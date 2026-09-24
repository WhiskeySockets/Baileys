import NodeCache from '@cacheable/node-cache'
import { Boom } from '@hapi/boom'
import { AsyncLocalStorage } from 'async_hooks'
import { randomBytes } from 'crypto'
import { DEFAULT_CACHE_TTLS } from '../Defaults'
import type {
	AuthenticationCreds,
	CacheStore,
	RecordRef,
	SignalDataSet,
	SignalDataTypeMap,
	SignalKeyStore,
	SignalKeyStoreWithRecordTransaction,
	TransactionCapabilityOptions,
	TransactionScope
} from '../Types'
import { Curve, signedKeyPair } from './crypto'
import { delay, generateRegistrationId } from './generics'
import { makeLockManager } from './lock-manager'
import type { ILogger } from './logger'
import { PreKeyManager } from './pre-key-manager'

/**
 * Transaction context stored in AsyncLocalStorage.
 *
 * `heldLocks` tracks every `${namespace} ${id}` lock acquired in the outer
 * scope, including the synthetic `__legacy__` namespace used by the
 * deprecated `transaction(work, key)` API. Inner calls (both legacy and
 * `transactWith`) consult this set to skip re-acquisition of a lock already
 * held by the same async context — preserving re-entry safety while still
 * closing the H0 bypass for genuinely new lock keys.
 */
interface TransactionContext {
	cache: SignalDataSet
	mutations: SignalDataSet
	dbQueries: number
	heldLocks: Set<string>
	/** Sealed by `transactWith` after the work() promise resolves; further writes from detached async become no-ops (M5 hardening). */
	sealed: boolean
}

// One instance per process: a per-socket AsyncLocalStorage leaks the heap under Node's legacy
// async-context propagation, where every live instance tags every pending async resource. The
// value is keyed by store token so a store only ever sees its own context, even when another
// wrapped store runs inside its transaction.
const txStorage = new AsyncLocalStorage<Map<symbol, TransactionContext>>()

const LEGACY_NAMESPACE = '__legacy__'

/**
 * Build the canonical heldLocks key. Uses the same `\0` (NUL) separator
 * as `LockManager`'s internal `refKey` so the encoding is unambiguous: a
 * namespace or id containing a space would otherwise collide
 * (e.g. `{namespace:'session', id:'a b'}` and `{namespace:'session a', id:'b'}`
 * both produce `'session a b'`), letting the inner-scope re-entry check in
 * `transactWith` bypass acquisition for a record that isn't really held.
 * NUL cannot appear in a valid `SignalDataType` or in any of the synthetic
 * `__legacy__` / `__type__` namespaces, so the encoding is one-to-one.
 */
const lockKeyForRef = (namespace: string, id: string): string => `${namespace}\0${id}`
const lockKeyForRecord = (r: RecordRef): string => lockKeyForRef(r.type, r.id)

/**
 * Adds caching capability to a SignalKeyStore.
 *
 * Stage 4 semantics:
 *   - write-through with `store.set` FIRST, cache update only after success
 *     (H6 closure — a failed durable write never leaves the cache holding an
 *     uncommitted value);
 *   - the global `cacheMutex` is replaced with per-record locking via the
 *     shared LockManager, so different-record reads and writes can proceed in
 *     parallel. The previous single-mutex serialized the entire cache surface.
 *
 * @param store the store to add caching to
 * @param logger to log trace events
 * @param _cache cache store to use
 */
export function makeCacheableSignalKeyStore(
	store: SignalKeyStore,
	logger?: ILogger,
	_cache?: CacheStore
): SignalKeyStore {
	const cache =
		_cache ||
		new NodeCache<SignalDataTypeMap[keyof SignalDataTypeMap]>({
			stdTTL: DEFAULT_CACHE_TTLS.SIGNAL_STORE, // 5 minutes
			useClones: false,
			deleteOnExpire: true
		})

	const cacheLocks = makeLockManager()

	function getUniqueId(type: string, id: string) {
		return `${type}.${id}`
	}

	return {
		async get(type, ids) {
			const data: { [_: string]: SignalDataTypeMap[typeof type] } = {}
			const idsToFetch: string[] = []

			// Per-record locking for the read path. The lock scope is just the
			// cache `get` — point reads on distinct records proceed in parallel.
			await Promise.all(
				ids.map(id =>
					cacheLocks.withLock({ namespace: type, id }, async () => {
						const item = (await cache.get<SignalDataTypeMap[typeof type]>(getUniqueId(type, id))) as any
						// `null` is the SignalDataSet delete sentinel. A cached
						// `null` (from a previous `set({ type: { id: null } })`)
						// must be treated as a miss for the read API, which
						// returns "absent" by omitting the id — not "present
						// with value null". Without this filter `get` would
						// surface tombstones to libsignal.
						if (typeof item !== 'undefined' && item !== null) {
							data[id] = item
						} else {
							idsToFetch.push(id)
						}
					})
				)
			)

			if (idsToFetch.length) {
				logger?.trace({ items: idsToFetch.length }, 'loading from store')
				const fetched = await store.get(type, idsToFetch)
				// Populate cache + result under per-record locks so a concurrent
				// `set` cannot race with this fetched value being written back.
				await Promise.all(
					idsToFetch.map(id =>
						cacheLocks.withLock({ namespace: type, id }, async () => {
							// Re-check the cache after reacquiring the lock. A
							// concurrent `set()` may have committed a newer
							// value while we were outside the lock running
							// `store.get()`. Without this we'd overwrite the
							// fresh write with the older fetched value and
							// return stale data.
							const current = (await cache.get<SignalDataTypeMap[typeof type]>(getUniqueId(type, id))) as any
							if (typeof current !== 'undefined') {
								if (current !== null) data[id] = current
								return
							}

							const item = fetched[id]
							if (item !== null && item !== undefined) {
								data[id] = item
								// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
								await cache.set(getUniqueId(type, id), item as SignalDataTypeMap[keyof SignalDataTypeMap])
							}
						})
					)
				)
			}

			return data
		},
		async set(data) {
			// Collect every (type, id) touched by this write so we can hold the
			// full set of per-record locks across the durable write AND the
			// cache update. Using `withLocks` (sorted, dedup'd) prevents
			// deadlock against concurrent overlapping `set` calls.
			const refs: { namespace: string; id: string }[] = []
			for (const type in data) {
				for (const id in data[type as keyof SignalDataTypeMap]) {
					refs.push({ namespace: type, id })
				}
			}

			await cacheLocks.withLocks(refs, async () => {
				// H6 fix: durable store FIRST. If it throws the cache is
				// untouched, so a subsequent `get` does not return an
				// uncommitted value.
				await store.set(data)

				let updated = 0
				for (const type in data) {
					for (const id in data[type as keyof SignalDataTypeMap]) {
						const value = data[type as keyof SignalDataTypeMap]![id]
						// `null` is the delete sentinel — evict rather than
						// caching `null`. Otherwise the read path (post-
						// tombstone filter) would treat the slot as a cache
						// hit and short-circuit the store lookup, masking
						// any later writes from sibling adapters until TTL.
						if (value === null || value === undefined) {
							await cache.del(getUniqueId(type, id))
						} else {
							await cache.set(getUniqueId(type, id), value)
						}

						updated += 1
					}
				}

				logger?.trace({ keys: updated }, 'updated cache after durable write')
			})
		},
		async clear() {
			await cache.flushAll()
			await store.clear?.()
		},
		// Enumeration cannot be satisfied from the sparse in-memory cache — pass through.
		// A long-running enumeration must not block point reads/writes for the
		// duration of a full-store walk.
		...(store.list
			? {
					list: <T extends keyof SignalDataTypeMap>(type: T) => store.list!(type)
				}
			: {}),
		...(store.listIds
			? {
					listIds: <T extends keyof SignalDataTypeMap>(type: T) => store.listIds!(type)
				}
			: {})
	}
}

/**
 * Adds DB-like transaction capability to the SignalKeyStore
 * Uses AsyncLocalStorage for automatic context management.
 *
 * Stage 1: replaced the bespoke txMutexes/refCount pair (M3) and the dual
 * PreKeyManager.queues vs auth-utils.keyQueues map (H2) with a single
 * {@link LockManager} instance. The legacy `transaction(work, key: string)`
 * signature is preserved by locking under the `'__legacy__'` namespace; Stage 2
 * adds the typed record-scoped `transactWith` API alongside it.
 */
export const addTransactionCapability = (
	state: SignalKeyStore,
	logger: ILogger,
	{ maxCommitRetries, delayBetweenTriesMs }: TransactionCapabilityOptions
): SignalKeyStoreWithRecordTransaction => {
	const locks = makeLockManager()
	const preKeyManager = new PreKeyManager(state, logger)

	// Identifies this store's slot inside the shared transaction map
	const storeToken = Symbol('signalTxStore')

	/**
	 * Resolve this store's transaction context from the shared async-local map
	 */
	function getContext(): TransactionContext | undefined {
		return txStorage.getStore()?.get(storeToken)
	}

	/**
	 * Check if currently in a transaction
	 */
	function isInTransaction(): boolean {
		return !!getContext()
	}

	/**
	 * Commit transaction with retries
	 */
	async function commitWithRetry(mutations: SignalDataSet): Promise<void> {
		if (Object.keys(mutations).length === 0) {
			logger.trace('no mutations in transaction')
			return
		}

		logger.trace('committing transaction')

		for (let attempt = 0; attempt < maxCommitRetries; attempt++) {
			try {
				await state.set(mutations)
				logger.trace({ mutationCount: Object.keys(mutations).length }, 'committed transaction')
				return
			} catch (error) {
				const retriesLeft = maxCommitRetries - attempt - 1
				logger.warn(`failed to commit mutations, retries left=${retriesLeft}`)

				if (retriesLeft === 0) {
					throw error
				}

				await delay(delayBetweenTriesMs)
			}
		}
	}

	return {
		get: async (type, ids) => {
			const ctx = getContext()

			if (!ctx) {
				// No transaction - direct read without exclusive lock for concurrency
				return state.get(type, ids)
			}

			// In transaction - check cache first
			const cached = ctx.cache[type] || {}
			const missing = ids.filter(id => !(id in cached))

			if (missing.length > 0) {
				ctx.dbQueries++
				logger.trace({ type, count: missing.length }, 'fetching missing keys in transaction')

				// Per-type read serialization, same semantic as before but routed
				// through the canonical LockManager instead of a private PQueue.
				const fetched = await locks.withLock({ namespace: '__type__', id: type }, () => state.get(type, missing))

				// Update cache
				ctx.cache[type] = ctx.cache[type] || ({} as any)
				Object.assign(ctx.cache[type]!, fetched)
			}

			// Return requested ids from cache
			const result: { [key: string]: any } = {}
			for (const id of ids) {
				const value = ctx.cache[type]?.[id]
				if (value !== undefined && value !== null) {
					result[id] = value
				}
			}

			return result
		},

		set: async data => {
			const ctx = getContext()

			if (!ctx) {
				// No transaction — hold per-record locks across pre-key
				// validation AND the durable write, then issue ONE
				// `state.set(data)` covering every type. This closes:
				//   - H2: validation and write see the same store snapshot;
				//   - H3: cross-type atomicity. A caller passing
				//         `{ session, 'identity-key' }` cannot have one type
				//         commit while the other fails — readers never observe
				//         torn cross-type state at this layer.
				//
				// The locks use `{ namespace: type, id }` — the SAME shape
				// `transactWith` uses — so a non-transactional
				// `keys.set({ session: { jid: ... } })` correctly serializes
				// against an in-flight `transactWith({ records: [{ type:
				// 'session', id: jid }] }, ...)` on the same record. The
				// earlier `__type__:type` namespace was per-type-coarse and
				// shared no locks with transactWith — a known race window
				// flagged by Stage 6's CodeRabbit review.
				const types = Object.keys(data) as Array<keyof SignalDataTypeMap>
				const lockRefs: { namespace: string; id: string }[] = []
				for (const type of types) {
					const bucket = data[type]
					if (!bucket) continue
					for (const id of Object.keys(bucket)) {
						lockRefs.push({ namespace: type, id })
					}
				}

				await locks.withLocks(lockRefs, async () => {
					if ('pre-key' in data) {
						await preKeyManager.validateDeletions(data, 'pre-key' as keyof SignalDataTypeMap)
					}

					// `validateDeletions` may have emptied the pre-key bucket
					// (every targeted id was already gone). Skip `state.set` if
					// every bucket is empty — no work to do, and writing
					// `{ 'pre-key': {} }` is a wasteful no-op against the
					// storage adapter. Preserved from Stage 1's review fix.
					let hasAny = false
					for (const t of types) {
						const bucket = data[t]
						if (bucket && Object.keys(bucket).length > 0) {
							hasAny = true
							break
						}
					}

					if (hasAny) {
						await state.set(data)
					}
				})
				return
			}

			// M5 hardening: detached async (setImmediate, process.nextTick,
			// unawaited promises) inherits the AsyncLocalStorage context. After
			// the outer work() resolves the context is sealed; writes from such
			// orphaned callbacks become no-ops rather than silently mutating
			// already-committed state.
			if (ctx.sealed) {
				logger.warn({ types: Object.keys(data) }, 'transaction context is sealed; ignoring detached write (M5 guard)')
				return
			}

			// In transaction - update cache and mutations
			logger.trace({ types: Object.keys(data) }, 'caching in transaction')

			for (const key_ in data) {
				const key = key_ as keyof SignalDataTypeMap

				// Ensure structures exist
				ctx.cache[key] = ctx.cache[key] || ({} as any)
				ctx.mutations[key] = ctx.mutations[key] || ({} as any)

				// Special handling for pre-keys
				if (key === 'pre-key') {
					await preKeyManager.processOperations(data, key, ctx.cache, ctx.mutations, true)
				} else {
					// Normal key types
					Object.assign(ctx.cache[key]!, data[key])
					Object.assign(ctx.mutations[key]!, data[key])
				}
			}
		},

		isInTransaction,

		transaction: async (work, key) => {
			const lockKey = lockKeyForRef(LEGACY_NAMESPACE, key)
			const stores = txStorage.getStore()
			const existing = stores?.get(storeToken)

			// Re-entry on a lock the outer scope already holds: bypass to avoid
			// self-deadlock. Different keys, however, must acquire their own lock
			// (this is the H0 closure — the unconditional bypass was the bug).
			if (existing?.heldLocks.has(lockKey)) {
				logger.trace({ key }, 'reusing held legacy lock')
				return work()
			}

			return locks.withLock({ namespace: LEGACY_NAMESPACE, id: key }, async () => {
				if (existing) {
					// Nested under an outer transaction we're now properly locked
					// against. Share the outer's mutation accumulator so all
					// writes commit together at the outermost level.
					existing.heldLocks.add(lockKey)
					try {
						return await work()
					} finally {
						existing.heldLocks.delete(lockKey)
					}
				}

				const ctx: TransactionContext = {
					cache: {},
					mutations: {},
					dbQueries: 0,
					heldLocks: new Set([lockKey]),
					sealed: false
				}

				// Inherit contexts from outer stores so they stay isolated by token
				const next = new Map(stores)
				next.set(storeToken, ctx)

				logger.trace('entering transaction')

				try {
					const result = await txStorage.run(next, work)
					ctx.sealed = true
					await commitWithRetry(ctx.mutations)
					logger.trace({ dbQueries: ctx.dbQueries }, 'transaction completed')
					return result
				} catch (err) {
					ctx.sealed = true
					logger.error({ err }, 'transaction failed, rolling back')
					throw err
				}
			})
		},

		transactWith: async <T>(scope: TransactionScope, work: () => Promise<T>): Promise<T> => {
			const stores = txStorage.getStore()
			const existing = stores?.get(storeToken)

			// Determine which records still need a lock — outer scope may already
			// hold some of them, in which case re-acquisition would self-deadlock.
			const needsAcquire = scope.records.filter(r => !existing?.heldLocks.has(lockKeyForRecord(r)))
			const newLockKeys = needsAcquire.map(lockKeyForRecord)
			const lockRefs = needsAcquire.map(r => ({ namespace: r.type, id: r.id }))

			return locks.withLocks(lockRefs, async () => {
				if (existing) {
					// Nested transaction — share outer's ctx, mark the newly held
					// locks so deeper nesting sees them as held.
					for (const k of newLockKeys) existing.heldLocks.add(k)
					try {
						return await work()
					} finally {
						for (const k of newLockKeys) existing.heldLocks.delete(k)
					}
				}

				const ctx: TransactionContext = {
					cache: {},
					mutations: {},
					dbQueries: 0,
					heldLocks: new Set(newLockKeys),
					sealed: false
				}

				// Inherit contexts from outer stores so they stay isolated by token
				const next = new Map(stores)
				next.set(storeToken, ctx)

				logger.trace({ records: scope.records.length }, 'entering transactWith')

				try {
					const result = await txStorage.run(next, work)
					ctx.sealed = true
					await commitWithRetry(ctx.mutations)
					logger.trace({ dbQueries: ctx.dbQueries }, 'transactWith completed')
					return result
				} catch (err) {
					ctx.sealed = true
					logger.error({ err }, 'transactWith failed, rolling back')
					throw err
				}
			})
		},

		// Enumeration pass-throughs (Stage 1 type lift). Transactions over `list`
		// would require a holistic snapshot the cache layer can't provide — these
		// reads bypass the per-key tx cache by design. Stage 5's adapters
		// implement these; pre-existing user stores without `list` simply omit
		// these methods (they're optional on the interface).
		...(state.list
			? {
					list: <T extends keyof SignalDataTypeMap>(type: T) => state.list!(type)
				}
			: {}),
		...(state.listIds
			? {
					listIds: <T extends keyof SignalDataTypeMap>(type: T) => state.listIds!(type)
				}
			: {})
	}
}

/**
 * Returns the authenticated user's JID, or throws a Boom-401 if creds are not yet authenticated.
 * Use this anywhere we'd otherwise reach for `creds.me!.id` to fail fast with a descriptive error.
 */
export const assertMeId = (creds: AuthenticationCreds): string => {
	const id = creds.me?.id
	if (!id) {
		throw new Boom('Cannot proceed: socket is not authenticated yet (creds.me.id is missing)', { statusCode: 401 })
	}

	return id
}

export const initAuthCreds = (): AuthenticationCreds => {
	const identityKey = Curve.generateKeyPair()
	return {
		noiseKey: Curve.generateKeyPair(),
		pairingEphemeralKeyPair: Curve.generateKeyPair(),
		signedIdentityKey: identityKey,
		signedPreKey: signedKeyPair(identityKey, 1),
		registrationId: generateRegistrationId(),
		advSecretKey: randomBytes(32).toString('base64'),
		processedHistoryMessages: [],
		nextPreKeyId: 1,
		firstUnuploadedPreKeyId: 1,
		accountSyncCounter: 0,
		accountSettings: {
			unarchiveChats: false
		},
		registered: false,
		pairingCode: undefined,
		lastPropHash: undefined,
		routingInfo: undefined,
		additionalData: undefined
	}
}
