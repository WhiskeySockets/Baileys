import NodeCache from '@cacheable/node-cache'
import { AsyncLocalStorage } from 'async_hooks'
import { Mutex } from 'async-mutex'
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
 * Stage 2 (upstream #2572) additions:
 * - `heldLocks` tracks every `${namespace}\0${id}` lock acquired in the outer
 *   scope (synthetic `__legacy__` namespace for the deprecated
 *   `transaction(work, key)` API, record-typed namespaces for `transactWith`).
 *   Inner calls consult this map to skip re-acquisition of a lock already held
 *   by the same async context — preserves re-entry safety while closing the
 *   H0 bypass for genuinely new lock keys.
 * - `sealed` set after `work()` resolves; further writes from detached async
 *   (setImmediate, process.nextTick, unawaited promises) become no-ops with
 *   a structured warn instead of silently mutating already-committed state
 *   (M5 hardening).
 *
 * PR #457 round-1 (cubic P1 defensive): heldLocks is a Map<key, refcount>
 * rather than a Set. Refcount semantics matter under parallel nested calls
 * that share the same AsyncLocalStorage context — Set's "single entry" model
 * lets the first finally() delete a key still in use by a sibling branch.
 * Refcount-aware delete only removes the entry when count drops to zero, so
 * a sibling that observed the held lock continues to see it until ITS own
 * acquisition releases.
 *
 * Not triggered by current InfiniteAPI code (libsignal calls are sequential,
 * no Promise.all of transactWith inside same outer ctx). Defensive guard for
 * future code paths that might do parallel branches.
 */
interface TransactionContext {
	cache: SignalDataSet
	mutations: SignalDataSet
	dbQueries: number
	heldLocks: Map<string, number>
	sealed: boolean
}

/** Increment refcount for a lock key. Returns the new count. */
const heldLocksAcquire = (heldLocks: Map<string, number>, lockKey: string): number => {
	const next = (heldLocks.get(lockKey) ?? 0) + 1
	heldLocks.set(lockKey, next)
	return next
}

/** Decrement refcount, removing the entry when it drops to zero. */
const heldLocksRelease = (heldLocks: Map<string, number>, lockKey: string): void => {
	const cur = heldLocks.get(lockKey)
	if (cur === undefined) return
	if (cur <= 1) {
		heldLocks.delete(lockKey)
	} else {
		heldLocks.set(lockKey, cur - 1)
	}
}

/**
 * Synthetic namespace for the deprecated legacy `transaction(work, key)` API.
 * `__legacy__` is reserved — no real {@link SignalDataType} can collide with it.
 */
const LEGACY_NAMESPACE = '__legacy__'

/**
 * Build the canonical heldLocks key. Uses `\0` (NUL) separator so a namespace
 * or id containing a space can't collide (e.g. `{namespace:'session', id:'a b'}`
 * vs `{namespace:'session a', id:'b'}` both produce `'session a b'` with a
 * space separator, letting the inner-scope re-entry check bypass acquisition
 * for a record that isn't really held). NUL cannot appear in a valid
 * {@link SignalDataType} or in our synthetic namespaces, so the encoding is
 * one-to-one (Stage 2 CodeRabbit round 2 P1 fix).
 */
const lockKeyForRef = (namespace: string, id: string): string => `${namespace}\0${id}`
const lockKeyForRecord = (r: RecordRef): string => lockKeyForRef(r.type, r.id)

/**
 * Adds caching capability to a SignalKeyStore
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

	// Mutex for protecting cache operations
	const cacheMutex = new Mutex()

	function getUniqueId(type: string, id: string) {
		return `${type}.${id}`
	}

	return {
		async get(type, ids) {
			return cacheMutex.runExclusive(async () => {
				const data: { [_: string]: SignalDataTypeMap[typeof type] } = {}
				const idsToFetch: string[] = []

				for (const id of ids) {
					const item = (await cache.get<SignalDataTypeMap[typeof type]>(getUniqueId(type, id))) as any
					if (typeof item !== 'undefined') {
						data[id] = item
					} else {
						idsToFetch.push(id)
					}
				}

				if (idsToFetch.length) {
					logger?.trace({ items: idsToFetch.length }, 'loading from store')
					const fetched = await store.get(type, idsToFetch)
					for (const id of idsToFetch) {
						const item = fetched[id]
						if (item) {
							data[id] = item
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
							await cache.set(getUniqueId(type, id), item as SignalDataTypeMap[keyof SignalDataTypeMap])
						}
					}
				}

				return data
			})
		},
		async set(data) {
			return cacheMutex.runExclusive(async () => {
				// H6 closure (adapted from upstream #2574):
				// Durable write FIRST; cache update only after success. If `store.set`
				// throws, the cache stays untouched and subsequent `get` reads return
				// the previous committed value (or fall back to the store), never an
				// unpersisted one that would linger until TTL expiry.
				//
				// Note: we keep the existing global `cacheMutex` rather than adopting
				// upstream's per-record LockManager — that change depends on Stage 1
				// (#2571) which is not yet ported. The write-through inversion is the
				// load-bearing part of the H6 fix.
				await store.set(data)

				let keys = 0
				for (const type in data) {
					for (const id in data[type as keyof SignalDataTypeMap]) {
						await cache.set(getUniqueId(type, id), data[type as keyof SignalDataTypeMap]![id]!)
						keys += 1
					}
				}

				logger?.trace({ keys }, 'updated cache')
			})
		},
		async clear() {
			// PR #453 round-4 (Copilot): synchronize clear with the same
			// `cacheMutex` that guards get/set. Without this, a concurrent set()
			// could land between `cache.flushAll()` and `store.clear()` (or
			// after), repopulating the cache with values that no longer reflect
			// the just-cleared store. Holding the mutex across the full clear
			// op ensures no get/set observes a half-cleared state.
			return cacheMutex.runExclusive(async () => {
				await cache.flushAll()
				await store.clear?.()
			})
		},
		// Stage 1 (upstream #2571): enumeration cannot be satisfied from the sparse
		// in-memory cache — pass through to the underlying store. Bypasses the cache
		// mutex deliberately: a long-running enumeration must not block point
		// reads/writes for the duration of a full-store walk.
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
 * Uses AsyncLocalStorage for automatic context management
 * @param state the key store to apply this capability to
 * @param logger logger to log events
 * @returns SignalKeyStore with transaction capability
 */
export const addTransactionCapability = (
	state: SignalKeyStore,
	logger: ILogger,
	{ maxCommitRetries, delayBetweenTriesMs }: TransactionCapabilityOptions
): SignalKeyStoreWithRecordTransaction => {
	const txStorage = new AsyncLocalStorage<TransactionContext>()

	/**
	 * Single canonical lock primitive (Stage 1 — upstream #2571). Replaces the
	 * previous bespoke `keyQueues` (Map<string, PQueue>) + `txMutexes` +
	 * `txMutexRefCounts` + `acquireTxMutexRef`/`releaseTxMutexRef` quartet.
	 * LockManager wraps `makeKeyedMutex` (which already does identity-checked
	 * refcount cleanup), so the M3 race the manual refcount missed is closed.
	 */
	const locks = makeLockManager()

	// Pre-key manager for specialized operations
	const preKeyManager = new PreKeyManager(state, logger)

	// Destroyed flag — InfiniteAPI defensive guard, preserved from pre-Stage-1.
	// Prevents new transactions from starting after `destroy()` is called.
	let destroyed = false

	/**
	 * Active-transaction counter (PR #453 CodeRabbit Major fix).
	 *
	 * Tracks how many `transaction(work, key)` invocations are currently
	 * past the destroyed-flag check and have not yet finished. `destroy()`
	 * waits for this to reach 0 before calling `preKeyManager.destroy()`,
	 * so an in-flight transaction never finds the prekey manager torn down
	 * under it.
	 *
	 * The counter races safely with `destroyed`: a new caller that races
	 * past `destroyed === false` will be observed by `destroy()` via this
	 * counter and waited for. Subsequent callers see `destroyed === true`
	 * and throw before incrementing.
	 */
	let activeTransactions = 0

	/**
	 * Check if currently in a transaction
	 */
	function isInTransaction(): boolean {
		return !!txStorage.getStore()
	}

	/**
	 * Commit transaction with retries.
	 *
	 * PR #453 CodeRabbit CRITICAL fix: acquire `__type__` locks for every
	 * mutation type before `state.set`. Without this, a tx commit raced
	 * against concurrent non-tx pre-key deletes — the non-tx path validated
	 * deletions against one snapshot while this commit landed on a different
	 * one, reopening the H2 atomicity hole for tx-vs-non-tx traffic.
	 *
	 * `LockManager.withLocks` sorts + dedupes the ref list so acquiring
	 * `[{__type__, sender-key}, {__type__, pre-key}]` and the symmetric
	 * `[{__type__, pre-key}, {__type__, sender-key}]` from two concurrent
	 * commits cannot deadlock.
	 */
	async function commitWithRetry(mutations: SignalDataSet): Promise<void> {
		if (Object.keys(mutations).length === 0) {
			logger.trace('no mutations in transaction')
			return
		}

		const lockRefs = (Object.keys(mutations) as Array<keyof SignalDataTypeMap>).map(type => ({
			namespace: '__type__',
			id: type
		}))

		logger.trace('committing transaction')

		for (let attempt = 0; attempt < maxCommitRetries; attempt++) {
			try {
				await locks.withLocks(lockRefs, () => state.set(mutations))
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
			const ctx = txStorage.getStore()

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
				// through the canonical LockManager instead of a private mutex map.
				const fetched = await locks.withLock({ namespace: '__type__', id: type }, () =>
					state.get(type, missing)
				)

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
			const ctx = txStorage.getStore()

			if (!ctx) {
				// No transaction — hold one per-type lock across validate + write so
				// pre-key deletion validation reads the same store state that the
				// write will observe (H2 fix from upstream #2571). Previously
				// `validateDeletions()` and `state.set()` ran under separate queues,
				// allowing a concurrent writer to flip the existence state between
				// our read and our write.
				const types = Object.keys(data) as Array<keyof SignalDataTypeMap>
				await Promise.all(
					types.map(type =>
						locks.withLock({ namespace: '__type__', id: type }, async () => {
							if (type === 'pre-key') {
								await preKeyManager.validateDeletions(data, type)
							}

							// `validateDeletions` may have removed every entry from
							// the bucket (e.g. all targeted ids were already gone).
							// Skip the durable write in that case — no work to do,
							// and writing `{ 'pre-key': {} }` is a wasteful no-op
							// against the storage adapter.
							const bucket = data[type]
							if (!bucket || Object.keys(bucket).length === 0) return

							const typeData = { [type]: bucket } as SignalDataSet
							await state.set(typeData)
						})
					)
				)
				return
			}

			// M5 hardening (Stage 2 — upstream #2572): detached async
			// (setImmediate, process.nextTick, unawaited promises) inherits
			// the AsyncLocalStorage context. After the outer work() resolves
			// the context is sealed; writes from such orphaned callbacks
			// become no-ops with a structured warn rather than silently
			// mutating already-committed state.
			if (ctx.sealed) {
				logger.warn(
					{ types: Object.keys(data) },
					'transaction context is sealed; ignoring detached write (M5 guard)'
				)
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

		/**
		 * @deprecated Stage 2 (upstream #2572) — use `transactWith({ records }, work)`
		 * for record-scoped locking with deadlock-free multi-acquire. The legacy
		 * key-based API is preserved for back-compat but lacks the explicit scope
		 * and same-context re-entry semantics of `transactWith`.
		 *
		 * H0 closure: re-entering with a key not already held by the outer scope
		 * now acquires its own lock instead of silently sharing the outer's. Same-
		 * key nested calls still bypass (re-entry safety).
		 *
		 * Known limitation — cross-API nesting order (PR #457 CodeRabbit
		 * theoretical): mixing `transaction()` and `transactWith()` in opposite
		 * acquisition orders across two concurrent callers can theoretically
		 * deadlock (caller A holds legacy → wants record; caller B holds record
		 * → wants legacy). InfiniteAPI codebase enforces ONE direction in
		 * practice: legacy `transaction(meId)` is the OUTER tx (only used in
		 * messages-send and a few send-path callers), and `transactWith` is
		 * INNER (libsignal). No code path calls `transaction()` from inside a
		 * `transactWith()`. Documented here so future contributors don't
		 * introduce inverse nesting; if such a pattern is needed, add a
		 * canonical sort across namespaces or split the locks.
		 */
		transaction: async (work, key) => {
			const lockKey = lockKeyForRef(LEGACY_NAMESPACE, key)
			const existing = txStorage.getStore()

			// Re-entry on a lock the outer scope already holds: bypass to avoid
			// self-deadlock. Different keys, however, must acquire their own lock
			// (the H0 closure — the unconditional bypass was the bug).
			if (existing?.heldLocks.has(lockKey)) {
				// Same-ctx re-entry: refcount up, run work, refcount down.
				// Set-based code would have skipped both add/delete; refcount
				// Map needs both so a sibling branch that observed the held
				// lock keeps seeing it until its own decrement.
				logger.trace({ key }, 'reusing held legacy lock')
				heldLocksAcquire(existing.heldLocks, lockKey)
				try {
					return await work()
				} finally {
					heldLocksRelease(existing.heldLocks, lockKey)
				}
			}

			return locks.withLock({ namespace: LEGACY_NAMESPACE, id: key }, async () => {
				// CRITICAL (InfiniteAPI preservation, PR #453): check destroyed flag
				// INSIDE the lock to prevent race between `destroy()` and a concurrent
				// new transaction. Atomic check-and-execute: if we hold the lock, the
				// destroy() observer either already saw destroyed=true (this throws),
				// or hasn't run yet (we proceed, destroy() will wait via active counter).
				//
				// PR #457 round-2 (CodeRabbit Critical): only reject brand-new
				// TOP-LEVEL entries. If we're nested inside an outer tx that
				// passed the destroyed check at its own entry, draining must
				// let us finish — otherwise destroy() racing an outer tx
				// before it reaches an inner call would abort in-flight work
				// instead of draining it normally. `existing` (outer ctx)
				// presence means we're nested.
				if (destroyed && !existing) {
					throw new Error('Transaction capability destroyed - cannot initiate new transactions')
				}

				// PR #453 CodeRabbit Major fix: increment ACTIVE counter while
				// destroyed is still false. `destroy()` waits for this to reach 0
				// before tearing down preKeyManager.
				activeTransactions++

				if (existing) {
					// Nested under an outer transaction we're now properly locked
					// against. Share the outer's mutation accumulator so all writes
					// commit together at the outermost level.
					heldLocksAcquire(existing.heldLocks, lockKey)
					try {
						return await work()
					} finally {
						heldLocksRelease(existing.heldLocks, lockKey)
						activeTransactions--
					}
				}

				const ctx: TransactionContext = {
					cache: {},
					mutations: {},
					dbQueries: 0,
					heldLocks: new Map([[lockKey, 1]]),
					sealed: false
				}

				logger.trace('entering transaction')

				try {
					const result = await txStorage.run(ctx, work)
					ctx.sealed = true
					await commitWithRetry(ctx.mutations)
					logger.trace({ dbQueries: ctx.dbQueries }, 'transaction completed')
					return result
				} catch (err) {
					ctx.sealed = true
					logger.error({ err }, 'transaction failed, rolling back')
					throw err
				} finally {
					activeTransactions--
				}
			})
		},

		/**
		 * Stage 2 (upstream #2572) — record-scoped transaction API.
		 *
		 * Acquires locks on every `(type, id)` pair in `scope.records` via
		 * `LockManager.withLocks` (sorted+deduped — deadlock-free against
		 * concurrent overlapping scopes). On success, all mutations commit
		 * atomically in a single `state.set`. On throw, mutations are
		 * discarded (rollback).
		 *
		 * Re-entry: if the outer scope already holds some of the requested
		 * record locks, only the new ones are acquired (no self-deadlock,
		 * still serializes against external callers).
		 *
		 * InfiniteAPI preservation: same `destroyed` check + `activeTransactions`
		 * counter as `transaction()` so PR #453's drain semantics in
		 * `destroy()` cover BOTH transaction surfaces.
		 */
		transactWith: async <T>(scope: TransactionScope, work: () => Promise<T>): Promise<T> => {
			const existing = txStorage.getStore()

			// Determine which records still need a lock — outer scope may already
			// hold some, in which case re-acquisition would self-deadlock.
			const needsAcquire = scope.records.filter(r => !existing?.heldLocks.has(lockKeyForRecord(r)))
			const newLockKeys = needsAcquire.map(lockKeyForRecord)
			const lockRefs = needsAcquire.map(r => ({ namespace: r.type, id: r.id }))

			return locks.withLocks(lockRefs, async () => {
				// InfiniteAPI preservation (PR #453): same destroyed check that
				// `transaction()` uses, so socket close drains transactWith too.
				//
				// PR #457 round-2 (CodeRabbit Critical): same as `transaction()`
				// above — only reject brand-new top-level entries, allow nested
				// to drain. `existing` presence means we're inside an outer tx
				// that already passed the destroyed check.
				if (destroyed && !existing) {
					throw new Error('Transaction capability destroyed - cannot initiate new transactions')
				}

				activeTransactions++

				if (existing) {
					// Nested transactWith — share outer's ctx, refcount-up the
					// newly held locks so deeper nesting sees them as held.
					for (const k of newLockKeys) heldLocksAcquire(existing.heldLocks, k)
					try {
						return await work()
					} finally {
						for (const k of newLockKeys) heldLocksRelease(existing.heldLocks, k)
						activeTransactions--
					}
				}

				const ctx: TransactionContext = {
					cache: {},
					mutations: {},
					dbQueries: 0,
					heldLocks: new Map(newLockKeys.map(k => [k, 1] as [string, number])),
					sealed: false
				}

				logger.trace({ records: scope.records.length }, 'entering transactWith')

				try {
					const result = await txStorage.run(ctx, work)
					ctx.sealed = true
					await commitWithRetry(ctx.mutations)
					logger.trace({ dbQueries: ctx.dbQueries }, 'transactWith completed')
					return result
				} catch (err) {
					ctx.sealed = true
					logger.error({ err }, 'transactWith failed, rolling back')
					throw err
				} finally {
					activeTransactions--
				}
			})
		},

		/**
		 * Cleanup transaction capability resources.
		 *
		 * Stage 1 (upstream #2571) collapsed the bespoke `keyQueues` +
		 * `txMutexes` + `txMutexRefCounts` quartet into one {@link LockManager}.
		 * LockManager handles its own refcount-based cleanup via the underlying
		 * `makeKeyedMutex`, so we no longer need to iterate live mutexes or
		 * clear queue handles here.
		 *
		 * InfiniteAPI preservation: the `destroyed` flag is still set first to
		 * block new transactions (`transaction()` checks it inside the lock).
		 * `preKeyManager.destroy()` is still called to signal the prekey
		 * manager that no further work should be accepted. Any transactions
		 * already in-flight when `destroy()` runs will complete normally; the
		 * LockManager + GC reclaim the lock state once they finish.
		 *
		 * Trade-off from the pre-Stage-1 behavior: we lose the "❌ Cannot
		 * destroy resources - transactions still active!" diagnostic log
		 * (LockManager doesn't expose the held-keys list). In production this
		 * fired rarely and was informational, not load-bearing.
		 */
		destroy: async () => {
			if (destroyed) return
			destroyed = true

			// PR #453 CodeRabbit Major fix: wait for in-flight transactions to
			// drain BEFORE tearing down preKeyManager. Each `transaction()`
			// invocation increments `activeTransactions` AFTER passing the
			// destroyed-flag check; we wait here until that counter reaches 0
			// so no tx is left holding a torn-down preKeyManager reference.
			//
			// New callers that race in see destroyed=true at the check above
			// and throw before incrementing, so the counter monotonically
			// decreases once `destroyed` flips.
			//
			// PR #453 round-2 (CodeRabbit + Copilot + cubic — 3 bots concordaram):
			// the drain wait MUST be bounded. Now that `socket.ts:1073` awaits
			// `keys.destroy?.()`, an unbounded wait would hang socket shutdown
			// forever if a transaction got stuck (network freeze, external
			// deadlock).
			//
			// PR #453 round-3 (cubic P2 follow-up): the cap MUST account for
			// `commitWithRetry`'s legitimate retry budget — a healthy tx can
			// burn `maxCommitRetries * delayBetweenTriesMs` (defaults: 10 ×
			// 1000ms = 10s) waiting between retries. A fixed 5s cap would
			// abort still-healthy transactions whose commits are merely
			// retrying. Derive the cap from the retry budget + 2s slack for
			// the actual state.set work, with a 5s floor for tiny configs.
			//
			// On timeout: log warn with the outstanding count and proceed with
			// teardown anyway (better a torn-down preKeyManager error in a
			// stuck tx than a hung shutdown that prevents reconnect).
			const MAX_DRAIN_WAIT_MS = Math.max(5_000, maxCommitRetries * delayBetweenTriesMs + 2_000)
			const startedAt = Date.now()
			// PR #453 round-4 (Copilot): throttle the trace log. Without this,
			// a 10ms poll + trace-level logging would emit ~MAX_DRAIN_WAIT_MS/10
			// entries (e.g. 1200 at 12s cap) per close. Log only when the
			// counter changes OR every 500ms — whichever comes first — so
			// trace-enabled environments don't drown in noise during shutdown.
			let lastLoggedCount = -1
			let lastLoggedAt = 0
			while (activeTransactions > 0) {
				if (Date.now() - startedAt >= MAX_DRAIN_WAIT_MS) {
					logger.warn(
						{ activeTransactions, waitedMs: MAX_DRAIN_WAIT_MS },
						'destroy: drain wait timed out — proceeding with teardown'
					)
					break
				}
				const now = Date.now()
				if (activeTransactions !== lastLoggedCount || now - lastLoggedAt >= 500) {
					logger.trace({ activeTransactions }, 'destroy: waiting for in-flight transactions to drain')
					lastLoggedCount = activeTransactions
					lastLoggedAt = now
				}

				await delay(10)
			}

			preKeyManager.destroy()
			logger.debug('Transaction capability destroyed')
		},

		// Stage 1 (upstream #2571) enumeration pass-throughs. Transactions over
		// `list` would require a holistic snapshot the cache layer can't
		// provide — these reads bypass the per-key tx cache by design. Stage 5's
		// adapters implement these; pre-existing user stores without `list`
		// simply omit these methods (they're optional on the interface).
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
