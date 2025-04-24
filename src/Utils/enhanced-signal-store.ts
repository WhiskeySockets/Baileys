import { Mutex } from 'async-mutex'
import { SignalDataSet, SignalDataTypeMap, SignalKeyStore, SignalKeyStoreWithTransaction, TransactionCapabilityOptions } from '../Types'
import { delay } from './generics'
import { ILogger } from './logger'

/**
 * Enhanced version of the SignalKeyStore with improved locking mechanisms
 * to prevent race conditions and data corruption.
 * 
 * This implementation adds:
 * 1. Per-key type mutexes to prevent concurrent access to the same key type
 * 2. Per-key mutexes to prevent concurrent access to the same key
 * 3. Improved transaction handling with proper locking
 * 4. Special handling for pre-keys to prevent unexpected deletion
 */
export function createEnhancedSignalKeyStore(
    store: SignalKeyStore,
    logger: ILogger,
    { maxCommitRetries, delayBetweenTriesMs }: TransactionCapabilityOptions
): SignalKeyStoreWithTransaction {
    // Mutex for each key type (session, pre-key, etc.)
    const keyTypeMutexes = new Map<string, Mutex>()
    // Mutex for individual keys
    const keyMutexes = new Map<string, Mutex>()
    // Global transaction mutex
    const transactionMutex = new Mutex()
    
    // Transaction state
    let transactionsInProgress = 0
    let dbQueriesInTransaction = 0
    let transactionCache: SignalDataSet = {}
    let mutations: SignalDataSet = {}
    
    // Get or create a mutex for a specific key type
    const getKeyTypeMutex = (type: string): Mutex => {
        let mutex = keyTypeMutexes.get(type)
        if (!mutex) {
            mutex = new Mutex()
            keyTypeMutexes.set(type, mutex)
        }
        return mutex
    }
    
    // Get or create a mutex for a specific key
    const getKeyMutex = (type: string, id: string): Mutex => {
        const key = `${type}:${id}`
        let mutex = keyMutexes.get(key)
        if (!mutex) {
            mutex = new Mutex()
            keyMutexes.set(key, mutex)
        }
        return mutex
    }
    
    // Check if we're in a transaction
    const isInTransaction = () => transactionsInProgress > 0
    
    return {
        async get<T extends keyof SignalDataTypeMap>(type: T, ids: string[]) {
            // If we're in a transaction, check the cache first
            if (isInTransaction()) {
                const dict = transactionCache[type]
                const idsRequiringFetch = dict
                    ? ids.filter(item => typeof dict[item] === 'undefined')
                    : ids
                
                // Only fetch if there are any items to fetch
                if (idsRequiringFetch.length) {
                    dbQueriesInTransaction += 1
                    
                    // Acquire mutex for this key type to prevent concurrent access
                    const typeMutex = getKeyTypeMutex(type as string)
                    await typeMutex.acquire()
                    
                    try {
                        const result = await store.get(type, idsRequiringFetch)
                        
                        // Update transaction cache
                        transactionCache[type] ||= {}
                        Object.assign(transactionCache[type]!, result)
                    } finally {
                        typeMutex.release()
                    }
                }
                
                // Return data from cache
                return ids.reduce(
                    (dict, id) => {
                        const value = transactionCache[type]?.[id]
                        if (value) {
                            dict[id] = value
                        }
                        return dict
                    },
                    {} as { [id: string]: SignalDataTypeMap[T] }
                )
            } else {
                // Not in transaction, fetch directly with mutex protection
                const typeMutex = getKeyTypeMutex(type as string)
                return await typeMutex.acquire().then(async (release) => {
                    try {
                        return await store.get(type, ids)
                    } finally {
                        release()
                    }
                })
            }
        },
        
        async set(data: SignalDataSet) {
            if (isInTransaction()) {
                logger.trace({ types: Object.keys(data) }, 'caching in transaction')
                
                // Update transaction cache and mutations
                for (const keyType in data) {
                    transactionCache[keyType] = transactionCache[keyType] || {}
                    
                    // Special handling for pre-keys to prevent unexpected deletion
                    if (keyType === 'pre-key') {
                        for (const keyId in data[keyType]) {
                            // If we're trying to delete a pre-key, check if we have it in cache first
                            if (data[keyType][keyId] === null) {
                                // Only allow deletion if we have the key in cache
                                // This prevents unexpected deletions during race conditions
                                if (transactionCache[keyType] && transactionCache[keyType][keyId]) {
                                    if (!transactionCache[keyType]) {
                                        transactionCache[keyType] = {}
                                    }
                                    transactionCache[keyType][keyId] = null
                                    
                                    if (!mutations[keyType]) {
                                        mutations[keyType] = {}
                                    }
                                    mutations[keyType][keyId] = null
                                } else {
                                    // Skip deletion if key doesn't exist in cache
                                    logger.warn(`Attempted to delete non-existent pre-key: ${keyId}`)
                                    continue
                                }
                            } else {
                                // Normal update
                                if (!transactionCache[keyType]) {
                                    transactionCache[keyType] = {}
                                }
                                transactionCache[keyType][keyId] = data[keyType][keyId]
                                
                                if (!mutations[keyType]) {
                                    mutations[keyType] = {}
                                }
                                mutations[keyType][keyId] = data[keyType][keyId]
                            }
                        }
                    } else {
                        // Normal handling for other key types
                        Object.assign(transactionCache[keyType], data[keyType])
                        
                        mutations[keyType] = mutations[keyType] || {}
                        Object.assign(mutations[keyType], data[keyType])
                    }
                }
            } else {
                // Not in transaction, apply directly with mutex protection
                const mutexes: Mutex[] = []
                
                try {
                    // Acquire all necessary mutexes to prevent concurrent access
                    for (const keyType in data) {
                        const typeMutex = getKeyTypeMutex(keyType)
                        await typeMutex.acquire()
                        mutexes.push(typeMutex)
                        
                        // For pre-keys, we need special handling
                        if (keyType === 'pre-key') {
                            for (const keyId in data[keyType]) {
                                if (data[keyType][keyId] === null) {
                                    // Check if the key exists before deleting
                                    const existingKeys = await store.get(keyType as any, [keyId])
                                    if (!existingKeys[keyId]) {
                                        // Skip deletion if key doesn't exist
                                        logger.warn(`Attempted to delete non-existent pre-key: ${keyId}`)
                                        delete data[keyType][keyId]
                                    }
                                }
                            }
                        }
                    }
                    
                    // Apply changes to the store
                    await store.set(data)
                } finally {
                    // Release all mutexes in reverse order
                    while (mutexes.length > 0) {
                        const mutex = mutexes.pop()
                        if (mutex) mutex.release()
                    }
                }
            }
        },
        
        async transaction<T>(work: () => Promise<T>): Promise<T> {
            // Use a global mutex for transaction to ensure only one transaction is being
            // prepared at a time (though multiple can run concurrently once started)
            return transactionMutex.acquire().then(async (releaseTxMutex) => {
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
                        
                        // Commit if this is the outermost transaction
                        if (transactionsInProgress === 1) {
                            if (Object.keys(mutations).length) {
                                logger.trace('committing transaction')
                                
                                // Retry mechanism for transaction commit
                                let tries = maxCommitRetries
                                while (tries) {
                                    tries -= 1
                                    try {
                                        // Acquire mutexes for all key types being modified
                                        const mutexes: Mutex[] = []
                                        for (const keyType in mutations) {
                                            const typeMutex = getKeyTypeMutex(keyType)
                                            await typeMutex.acquire()
                                            mutexes.push(typeMutex)
                                        }
                                        
                                        try {
                                            await store.set(mutations)
                                            logger.trace({ dbQueriesInTransaction }, 'committed transaction')
                                            break
                                        } finally {
                                            // Release all mutexes in reverse order
                                            while (mutexes.length > 0) {
                                                const mutex = mutexes.pop()
                                                if (mutex) mutex.release()
                                            }
                                        }
                                    } catch (error) {
                                        logger.warn(`failed to commit ${Object.keys(mutations).length} mutations, tries left=${tries}`)
                                        if (tries > 0) {
                                            await delay(delayBetweenTriesMs)
                                        } else {
                                            throw error
                                        }
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
                } catch (error) {
                    // If we haven't released the transaction mutex yet, release it
                    releaseTxMutex()
                    throw error
                }
            })
        },
        
        isInTransaction,
        
        // Pass through clear method if it exists
        ...(store.clear ? { clear: store.clear } : {})
    }
}