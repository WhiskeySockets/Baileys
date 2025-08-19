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
import type { ILogger } from './logger'

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
					const item = cache.get<SignalDataTypeMap[typeof type]>(getUniqueId(type, id)) as any
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
			})
		},
		async set(data) {
			return cacheMutex.runExclusive(async () => {
				let keys = 0
				for (const type in data) {
					for (const id in data[type as keyof SignalDataTypeMap]) {
						cache.set(getUniqueId(type, id), data[type as keyof SignalDataTypeMap]![id]!)
						keys += 1
					}
				}

				logger?.trace({ keys }, 'updated cache')

				await store.set(data)
			})
		},
		async clear() {
			cache.flushAll()
			await store.clear?.()
		}
	}
}

// Module-level specialized mutexes for pre-key operations
const preKeyMutex = new Mutex()
const signedPreKeyMutex = new Mutex()

/**
 * Get the appropriate mutex for the key type
 */
const getPreKeyMutex = (keyType: string): Mutex => {
	return keyType === 'signed-pre-key' ? signedPreKeyMutex : preKeyMutex
}

/**
 * Handles pre-key operations with mutex protection
 */
async function handlePreKeyOperations(
	data: SignalDataSet,
	keyType: keyof SignalDataTypeMap,
	transactionCache: SignalDataSet,
	mutations: SignalDataSet,
	logger: ILogger,
	isInTransaction: boolean,
	state?: SignalKeyStore
): Promise<void> {
	const mutex = getPreKeyMutex(keyType)

	await mutex.runExclusive(async () => {
		const keyData = data[keyType]
		if (!keyData) return

		// Ensure structures exist
		transactionCache[keyType] = transactionCache[keyType] || ({} as any)
		mutations[keyType] = mutations[keyType] || ({} as any)

		// Separate deletions from updates for batch processing
		const deletionKeys: string[] = []
		const updateKeys: string[] = []

		for (const keyId in keyData) {
			if (keyData[keyId] === null) {
				deletionKeys.push(keyId)
			} else {
				updateKeys.push(keyId)
			}
		}

		// Process updates first (no validation needed)
		for (const keyId of updateKeys) {
			if (transactionCache[keyType]) {
				transactionCache[keyType][keyId] = keyData[keyId]!
			}

			if (mutations[keyType]) {
				mutations[keyType][keyId] = keyData[keyId]!
			}
		}

		// Process deletions with validation
		if (deletionKeys.length === 0) return

		if (isInTransaction) {
			// In transaction, only allow deletion if key exists in cache
			for (const keyId of deletionKeys) {
				if (transactionCache[keyType]) {
					transactionCache[keyType][keyId] = null
					if (mutations[keyType]) {
						// Mark for deletion in mutations
						mutations[keyType][keyId] = null
					}
				} else {
					logger.warn(`Skipping deletion of non-existent ${keyType} in transaction: ${keyId}`)
				}
			}

			return
		}

		// Outside transaction, batch validate all deletions
		if (!state) return

		const existingKeys = await state.get(keyType, deletionKeys)
		for (const keyId of deletionKeys) {
			if (existingKeys[keyId]) {
				if (transactionCache[keyType]) transactionCache[keyType][keyId] = null

				if (mutations[keyType]) mutations[keyType][keyId] = null
			} else {
				logger.warn(`Skipping deletion of non-existent ${keyType}: ${keyId}`)
			}
		}
	})
}

/**
 * Handles normal key operations for transactions
 */
function handleNormalKeyOperations(
	data: SignalDataSet,
	key: keyof SignalDataTypeMap,
	transactionCache: SignalDataSet,
	mutations: SignalDataSet
) {
	Object.assign(transactionCache[key]!, data[key])
	mutations[key] = mutations[key] || ({} as any)
	Object.assign(mutations[key]!, data[key])
}

/**
 * Process pre-key deletions with validation
 */
async function processPreKeyDeletions(
	data: SignalDataSet,
	keyType: keyof SignalDataTypeMap,
	state: SignalKeyStore,
	logger: ILogger
): Promise<void> {
	const mutex = getPreKeyMutex(keyType)

	await mutex.runExclusive(async () => {
		const keyData = data[keyType]
		if (!keyData) return

		// Validate deletions
		for (const keyId in keyData) {
			if (keyData[keyId] === null) {
				const existingKeys = await state.get(keyType, [keyId])
				if (!existingKeys[keyId]) {
					logger.warn(`Skipping deletion of non-existent ${keyType}: ${keyId}`)

					if (data[keyType]) delete data[keyType][keyId]
				}
			}
		}
	})
}

/**
 * Executes a function with mutexes acquired for given key types
 * Uses async-mutex's runExclusive with efficient batching
 */
async function withMutexes<T>(
	keyTypes: string[],
	getKeyTypeMutex: (type: string) => Mutex,
	fn: () => Promise<T>
): Promise<T> {
	if (keyTypes.length === 0) {
		return fn()
	}

	if (keyTypes.length === 1) {
		return getKeyTypeMutex(keyTypes[0]!).runExclusive(fn)
	}

	// For multiple mutexes, sort by key type to prevent deadlocks
	// Then acquire all mutexes in order using Promise.all for better efficiency
	const sortedKeyTypes = [...keyTypes].sort()
	const mutexes = sortedKeyTypes.map(getKeyTypeMutex)

	// Acquire all mutexes in order to prevent deadlocks
	const releases: (() => void)[] = []

	try {
		for (const mutex of mutexes) {
			releases.push(await mutex.acquire())
		}

		return await fn()
	} finally {
		// Release in reverse order
		while (releases.length > 0) {
			const release = releases.pop()
			if (release) release()
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
	// number of queries made to the DB during the transaction
	// only there for logging purposes
	let dbQueriesInTransaction = 0
	let transactionCache: SignalDataSet = {}
	let mutations: SignalDataSet = {}

	// Mutex for each key type (session, pre-key, etc.)
	const keyTypeMutexes = new Map<string, Mutex>()
	// Per-sender-key-name mutexes for fine-grained serialization
	const senderKeyMutexes = new Map<string, Mutex>()
	// Track last usage time for sender key mutexes (for cleanup)
	const senderKeyMutexLastUsed = new Map<string, number>()

	// Mutex expiration time: 1 hour in milliseconds
	const SENDER_KEY_MUTEX_EXPIRY_MS = 60 * 60 * 1000

	// Cleanup interval: every 30 minutes
	const CLEANUP_INTERVAL_MS = 30 * 60 * 1000

	// Cleanup timer
	let cleanupTimer: NodeJS.Timer | null = null

	// Start cleanup timer if not already running
	function startCleanupTimer() {
		if (!cleanupTimer) {
			cleanupTimer = setInterval(() => {
				cleanupExpiredSenderKeyMutexes()
			}, CLEANUP_INTERVAL_MS)
		}
	}

	// Clean up expired sender key mutexes
	function cleanupExpiredSenderKeyMutexes() {
		const now = Date.now()
		const expiredKeys: string[] = []

		for (const [senderKeyName, lastUsed] of senderKeyMutexLastUsed.entries()) {
			if (now - lastUsed > SENDER_KEY_MUTEX_EXPIRY_MS) {
				const mutex = senderKeyMutexes.get(senderKeyName)
				// Only remove if mutex is not currently being used
				if (mutex && !mutex.isLocked()) {
					expiredKeys.push(senderKeyName)
				}
			}
		}

		if (expiredKeys.length > 0) {
			for (const key of expiredKeys) {
				senderKeyMutexes.delete(key)
				senderKeyMutexLastUsed.delete(key)
			}

			logger.info({ expiredKeys: expiredKeys.length }, 'cleaned up expired sender key mutexes')
		}
	}

	let transactionsInProgress = 0

	// Get or create a mutex for a specific key type
	function getKeyTypeMutex(type: string): Mutex {
		let mutex = keyTypeMutexes.get(type)
		if (!mutex) {
			// Create regular mutex, timeout only for critical operations
			mutex = new Mutex()
			keyTypeMutexes.set(type, mutex)
		}

		return mutex
	}

	// Get or create a mutex for a specific sender key name
	function getSenderKeyMutex(senderKeyName: string): Mutex {
		let mutex = senderKeyMutexes.get(senderKeyName)
		if (!mutex) {
			mutex = new Mutex()

			if (senderKeyMutexes.size === 0) {
				startCleanupTimer()
			}

			senderKeyMutexes.set(senderKeyName, mutex)
			logger.info({ senderKeyName }, 'created new sender key mutex')
		}

		// Update last used time
		senderKeyMutexLastUsed.set(senderKeyName, Date.now())

		return mutex
	}

	// Sender key operations with proper mutex sequencing
	function queueSenderKeyOperation<T>(senderKeyName: string, operation: () => Promise<T>): Promise<T> {
		return getSenderKeyMutex(senderKeyName).runExclusive(operation)
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

					// Use per-sender-key queue for sender-key operations when possible
					if (type === 'sender-key') {
						logger.info({ idsRequiringFetch }, 'processing sender keys in transaction')
						// For sender keys, process each one with queued operations to maintain serialization
						for (const senderKeyName of idsRequiringFetch) {
							await queueSenderKeyOperation(senderKeyName, async () => {
								logger.info({ senderKeyName }, 'fetching sender key in transaction')
								const result = await state.get(type, [senderKeyName])
								// Update transaction cache
								transactionCache[type] ||= {}
								Object.assign(transactionCache[type]!, result)
								logger.info({ senderKeyName, hasResult: !!result[senderKeyName] }, 'sender key fetch complete')
							})
						}
					} else {
						// Use runExclusive for cleaner mutex handling
						await getKeyTypeMutex(type as string).runExclusive(async () => {
							const result = await state.get(type, idsRequiringFetch)

							// Update transaction cache
							transactionCache[type] ||= {}
							Object.assign(transactionCache[type]!, result)
						})
					}
				}

				return ids.reduce((dict: { [T in string]: any }, id) => {
					const value = transactionCache[type]?.[id]
					if (value) {
						dict[id] = value
					}

					return dict
				}, {})
			} else {
				// Not in transaction, fetch directly with queue protection
				if (type === 'sender-key') {
					// For sender keys, use individual queues to maintain per-key serialization
					const results: { [key: string]: SignalDataTypeMap[typeof type] } = {}
					for (const senderKeyName of ids) {
						const result = await queueSenderKeyOperation(
							senderKeyName,
							async () => await state.get(type, [senderKeyName])
						)
						Object.assign(results, result)
					}

					return results
				} else {
					return await getKeyTypeMutex(type as string).runExclusive(() => state.get(type, ids))
				}
			}
		},
		set: async data => {
			if (isInTransaction()) {
				logger.trace({ types: Object.keys(data) }, 'caching in transaction')
				for (const key_ in data) {
					const key = key_ as keyof SignalDataTypeMap
					transactionCache[key] = transactionCache[key] || ({} as any)

					// Special handling for pre-keys and signed-pre-keys
					if (key === 'pre-key') {
						await handlePreKeyOperations(data, key, transactionCache, mutations, logger, true)
					} else {
						// Normal handling for other key types
						handleNormalKeyOperations(data, key, transactionCache, mutations)
					}
				}
			} else {
				// Not in transaction, apply directly with mutex protection
				const hasSenderKeys = 'sender-key' in data
				const senderKeyNames = hasSenderKeys ? Object.keys(data['sender-key'] || {}) : []

				if (hasSenderKeys) {
					logger.info({ senderKeyNames }, 'processing sender key set operations')
					// Handle sender key operations with per-key queues
					for (const senderKeyName of senderKeyNames) {
						await queueSenderKeyOperation(senderKeyName, async () => {
							// Create data subset for this specific sender key
							// @ts-ignore
							const senderKeyData: SignalDataSet = {
								'sender-key': {
									[senderKeyName]: data['sender-key']![senderKeyName]
								}
							};

							logger.trace({ senderKeyName }, 'storing sender key')
							// Apply changes to the store
							await state.set(senderKeyData)
							logger.trace({ senderKeyName }, 'sender key stored')
						})
					}

					// Handle any non-sender-key data with regular mutexes
					const nonSenderKeyData = { ...data }
					delete nonSenderKeyData['sender-key']

					if (Object.keys(nonSenderKeyData).length > 0) {
						await withMutexes(Object.keys(nonSenderKeyData), getKeyTypeMutex, async () => {
							// Process pre-keys and signed-pre-keys separately with specialized mutexes
							for (const key_ in nonSenderKeyData) {
								const keyType = key_ as keyof SignalDataTypeMap
								if (keyType === 'pre-key') {
									await processPreKeyDeletions(nonSenderKeyData, keyType, state, logger)
								}
							}

							// Apply changes to the store
							await state.set(nonSenderKeyData)
						})
					}
				} else {
					// No sender keys - use original logic
					await withMutexes(Object.keys(data), getKeyTypeMutex, async () => {
						// Process pre-keys and signed-pre-keys separately with specialized mutexes
						for (const key_ in data) {
							const keyType = key_ as keyof SignalDataTypeMap
							if (keyType === 'pre-key') {
								await processPreKeyDeletions(data, keyType, state, logger)
							}
						}

						// Apply changes to the store
						await state.set(data)
					})
				}
			}
		},
		isInTransaction,
		async transaction(work) {
			let result: Awaited<ReturnType<typeof work>>
			transactionsInProgress += 1
			if (transactionsInProgress === 1) {
				logger.trace('entering transaction')
			}

			try {
				result = await work()
				// commit if this is the outermost transaction
				if (transactionsInProgress === 1) {
					if (Object.keys(mutations).length) {
						logger.trace('committing transaction')
						// retry mechanism to ensure we've some recovery
						// in case a transaction fails in the first attempt
						let tries = maxCommitRetries
						while (tries) {
							tries -= 1
							//eslint-disable-next-line max-depth
							try {
								await state.set(mutations)
								logger.trace({ dbQueriesInTransaction }, 'committed transaction')
								break
							} catch (error) {
								logger.warn(`failed to commit ${Object.keys(mutations).length} mutations, tries left=${tries}`)
								await delay(delayBetweenTriesMs)
							}
						}
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
