import NodeCache from '@cacheable/node-cache'
import { Boom } from '@hapi/boom'
import { AsyncLocalStorage } from 'async_hooks'
import { Mutex } from 'async-mutex'
import { randomBytes } from 'crypto'
import { DEFAULT_CACHE_TTLS } from '../Defaults'
import type {
	AuthenticationCreds,
	CacheStore,
	SignalDataSet,
	SignalDataTypeMap,
	SignalKeyStore,
	SignalKeyStoreWithTransaction,
	TransactionCapabilityOptions
} from '../Types'
import { Curve, signedKeyPair } from './crypto'
import { delay, generateRegistrationId } from './generics'
import { makeLockManager } from './lock-manager'
import type { ILogger } from './logger'
import { PreKeyManager } from './pre-key-manager'

/**
 * Transaction context stored in AsyncLocalStorage
 */
interface TransactionContext {
	cache: SignalDataSet
	mutations: SignalDataSet
	dbQueries: number
}

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
				let keys = 0
				for (const type in data) {
					for (const id in data[type as keyof SignalDataTypeMap]) {
						await cache.set(getUniqueId(type, id), data[type as keyof SignalDataTypeMap]![id]!)
						keys += 1
					}
				}

				logger?.trace({ keys }, 'updated cache')
				await store.set(data)
			})
		},
		async clear() {
			await cache.flushAll()
			await store.clear?.()
		},
		// Enumeration cannot be satisfied from the sparse in-memory cache — pass through.
		// Bypasses the cache mutex deliberately: a long-running enumeration must not
		// block point reads/writes for the duration of a full-store walk.
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
): SignalKeyStoreWithTransaction => {
	const txStorage = new AsyncLocalStorage<TransactionContext>()
	const locks = makeLockManager()
	const preKeyManager = new PreKeyManager(state, logger)

	/**
	 * Check if currently in a transaction
	 */
	function isInTransaction(): boolean {
		return !!txStorage.getStore()
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
			const ctx = txStorage.getStore()

			if (!ctx) {
				// No transaction — hold one per-type lock across validate + write so
				// pre-key deletion validation reads the same store state that the
				// write will observe (H2 fix).
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
			const existing = txStorage.getStore()

			// Nested transaction — reuse existing context. Note: this is the H0
			// bypass that Stage 2's `transactWith` fixes by requiring the inner
			// scope to be a subset of the outer scope.
			if (existing) {
				logger.trace('reusing existing transaction context')
				return work()
			}

			// New transaction — acquire the legacy-namespaced lock and create a
			// fresh AsyncLocalStorage context.
			return locks.withLock({ namespace: '__legacy__', id: key }, async () => {
				const ctx: TransactionContext = {
					cache: {},
					mutations: {},
					dbQueries: 0
				}

				logger.trace('entering transaction')

				try {
					const result = await txStorage.run(ctx, work)

					await commitWithRetry(ctx.mutations)

					logger.trace({ dbQueries: ctx.dbQueries }, 'transaction completed')

					return result
				} catch (err) {
					logger.error({ err }, 'transaction failed, rolling back')
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
