import NodeCache from '@cacheable/node-cache'
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
import { ILogger } from './logger'

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
		new NodeCache({
			stdTTL: DEFAULT_CACHE_TTLS.SIGNAL_STORE, // 5 minutes
			useClones: false,
			deleteOnExpire: true
		})

	function getUniqueId(type: string, id: string) {
		return `${type}.${id}`
	}

	return {
		async get(type, ids) {
			const data: { [_: string]: SignalDataTypeMap[typeof type] } = {}
			const idsToFetch: string[] = []
			for (const id of ids) {
				const item = cache.get<SignalDataTypeMap[typeof type]>(getUniqueId(type, id))
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
						cache.set(getUniqueId(type, id), item)
					}
				}
			}

			return data
		},
		async set(data) {
			let keys = 0
			for (const type in data) {
				for (const id in data[type]) {
					cache.set(getUniqueId(type, id), data[type][id])
					keys += 1
				}
			}

			logger?.trace({ keys }, 'updated cache')

			await store.set(data)
		},
		async clear() {
			cache.flushAll()
			await store.clear?.()
		}
	}
}

/**
 * Handles pre-key operations for transactions
 */
function handlePreKeyOperations(
	data: SignalDataSet,
	key: string,
	transactionCache: SignalDataSet,
	mutations: SignalDataSet,
	logger: ILogger
) {
	for (const keyId in data[key]) {
		const isDeleteOperation = data[key][keyId] === null

		if (isDeleteOperation) {
			// Only allow deletion if we have the key in cache
			if (!transactionCache[key]?.[keyId]) {
				// Skip deletion if key doesn't exist in cache
				logger.warn(`Attempted to delete non-existent pre-key: ${keyId}`)
				continue
			}

			if (!transactionCache[key]) {
				transactionCache[key] = {}
			}

			transactionCache[key][keyId] = null

			if (!mutations[key]) {
				mutations[key] = {}
			}

			mutations[key][keyId] = null
		} else {
			// Normal update
			if (!transactionCache[key]) {
				transactionCache[key] = {}
			}

			transactionCache[key][keyId] = data[key][keyId]

			if (!mutations[key]) {
				mutations[key] = {}
			}

			mutations[key][keyId] = data[key][keyId]
		}
	}
}

/**
 * Handles normal key operations for transactions
 */
function handleNormalKeyOperations(
	data: SignalDataSet,
	key: string,
	transactionCache: SignalDataSet,
	mutations: SignalDataSet
) {
	Object.assign(transactionCache[key], data[key])
	mutations[key] = mutations[key] || {}
	Object.assign(mutations[key], data[key])
}

/**
 * Processes pre-key deletions outside of transactions
 */
async function processPreKeyDeletions(data: SignalDataSet, keyType: string, state: SignalKeyStore, logger: ILogger) {
	for (const keyId in data[keyType]) {
		const isDeleteOperation = data[keyType][keyId] === null

		if (isDeleteOperation) {
			// Check if the key exists before deleting
			const existingKeys = await state.get(keyType as keyof SignalDataTypeMap, [keyId])
			if (!existingKeys[keyId]) {
				// Skip deletion if key doesn't exist
				logger.warn(`Attempted to delete non-existent pre-key: ${keyId}`)
				delete data[keyType][keyId]
			}
		}
	}
}

/**
 * Acquires mutexes for given key types
 */
async function acquireMutexes(keyTypes: string[], getKeyTypeMutex: (type: string) => Mutex): Promise<Mutex[]> {
	const mutexes: Mutex[] = []

	for (const keyType of keyTypes) {
		const typeMutex = getKeyTypeMutex(keyType)
		await typeMutex.acquire()
		mutexes.push(typeMutex)
	}

	return mutexes
}

/**
 * Releases mutexes in reverse order
 */
function releaseMutexes(mutexes: Mutex[]) {
	while (mutexes.length > 0) {
		const mutex = mutexes.pop()
		if (mutex) mutex.release()
	}
}

/**
 * Attempts to commit transaction with retry mechanism
 */
async function commitWithRetry(
	mutations: SignalDataSet,
	state: SignalKeyStore,
	getKeyTypeMutex: (type: string) => Mutex,
	maxRetries: number,
	delayMs: number,
	logger: ILogger
): Promise<void> {
	let tries = maxRetries

	while (tries > 0) {
		tries -= 1

		try {
			const mutexes = await acquireMutexes(Object.keys(mutations), getKeyTypeMutex)

			try {
				await state.set(mutations)
				logger.trace('committed transaction')
				break
			} finally {
				releaseMutexes(mutexes)
			}
		} catch (error) {
			logger.warn(`failed to commit ${Object.keys(mutations).length} mutations, tries left=${tries}`)

			if (tries > 0) {
				await delay(delayMs)
			}
		}
	}
}

/**
 * Adds DB like transaction capability (https://en.wikipedia.org/wiki/Database_transaction) to the SignalKeyStore,
 * this allows batch read & write operations & improves the performance of the lib
 * @param state the key store to apply this capability to
 * @param logger logger to log events
 * @returns SignalKeyStore with transaction capability
 */
export const addTransactionCapability = (
	state: SignalKeyStore,
	logger: ILogger,
	{ maxCommitRetries, delayBetweenTriesMs }: TransactionCapabilityOptions
): SignalKeyStoreWithTransaction => {
	// Mutex for each key type (session, pre-key, etc.)
	const keyTypeMutexes = new Map<string, Mutex>()

	// Global transaction mutex
	const transactionMutex = new Mutex()

	// number of queries made to the DB during the transaction
	// only there for logging purposes
	let dbQueriesInTransaction = 0
	let transactionCache: SignalDataSet = {}
	let mutations: SignalDataSet = {}

	let transactionsInProgress = 0

	// Get or create a mutex for a specific key type
	function getKeyTypeMutex(type: string): Mutex {
		let mutex = keyTypeMutexes.get(type)
		if (!mutex) {
			mutex = new Mutex()
			keyTypeMutexes.set(type, mutex)
		}

		return mutex
	}

	// Check if we are currently in a transaction
	function isInTransaction() {
		return transactionsInProgress > 0
	}

	return {
		get: async (type, ids) => {
			if (isInTransaction()) {
				const dict = transactionCache[type]
				const idsRequiringFetch = dict ? ids.filter(item => typeof dict[item] === 'undefined') : ids
				// only fetch if there are any items to fetch
				if (idsRequiringFetch.length) {
					dbQueriesInTransaction += 1

					// Acquire mutex for this key type to prevent concurrent access
					const typeMutex = getKeyTypeMutex(type as string)
					await typeMutex.acquire()

					try {
						const result = await state.get(type, idsRequiringFetch)

						// Update transaction cache
						transactionCache[type] ||= {}
						Object.assign(transactionCache[type]!, result)
					} finally {
						typeMutex.release()
					}
				}

				return ids.reduce((dict, id) => {
					const value = transactionCache[type]?.[id]
					if (value) {
						dict[id] = value
					}

					return dict
				}, {})
			} else {
				// Not in transaction, fetch directly with mutex protection
				const typeMutex = getKeyTypeMutex(type as string)
				return await typeMutex.acquire().then(async release => {
					try {
						return await state.get(type, ids)
					} finally {
						release()
					}
				})
			}
		},
		set: async data => {
			if (isInTransaction()) {
				logger.trace({ types: Object.keys(data) }, 'caching in transaction')
				for (const key in data) {
					transactionCache[key] = transactionCache[key] || {}

					// Special handling for pre-keys to prevent unexpected deletion
					if (key === 'pre-key') {
						handlePreKeyOperations(data, key, transactionCache, mutations, logger)
					} else {
						// Normal handling for other key types
						handleNormalKeyOperations(data, key, transactionCache, mutations)
					}
				}
			} else {
				// Not in transaction, apply directly with mutex protection
				let mutexes: Mutex[] = []

				try {
					// Acquire all necessary mutexes to prevent concurrent access
					mutexes = await acquireMutexes(Object.keys(data), getKeyTypeMutex)

					// Process pre-keys separately
					for (const keyType in data) {
						if (keyType === 'pre-key') {
							await processPreKeyDeletions(data, keyType, state, logger)
						}
					}

					// Apply changes to the store
					await state.set(data)
				} finally {
					releaseMutexes(mutexes)
				}
			}
		},
		isInTransaction,
		...(state.clear ? { clear: state.clear } : {}),
		async transaction(work) {
			return transactionMutex.acquire().then(async releaseTxMutex => {
				let result: Awaited<ReturnType<typeof work>>
				try {
					transactionsInProgress += 1
					if (transactionsInProgress === 1) {
						logger.trace('entering transaction')
					}

					// Release the transaction mutex now that we've updated the counter
					// This allows other transactions to start preparing
					releaseTxMutex()

					try {
						result = await work()
						// commit if this is the outermost transaction
						if (transactionsInProgress === 1) {
							const hasMutations = Object.keys(mutations).length > 0

							if (hasMutations) {
								logger.trace('committing transaction')
								await commitWithRetry(mutations, state, getKeyTypeMutex, maxCommitRetries, delayBetweenTriesMs, logger)
								logger.trace({ dbQueriesInTransaction }, 'transaction completed')
							} else {
								logger.trace('no mutations in transaction')
							}
						}
					} finally {
						transactionsInProgress -= 1
						if (transactionsInProgress === 0) {
							transactionCache = {}
							mutations = {}
							dbQueriesInTransaction = 0
						}
					}

					return result
				} catch (error) {
					// If we haven't released the transaction mutex yet, release it
					releaseTxMutex()
					throw error
				}
			})
		}
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
		routingInfo: undefined
	}
}
