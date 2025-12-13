import { initAuthCreds, makeCacheableSignalKeyStore, addTransactionCapability } from '../../Utils/auth-utils'
import type { SignalKeyStore, SignalDataSet, SignalDataTypeMap, CacheStore } from '../../Types'
import type { ILogger } from '../../Utils/logger'

// Create a properly typed mock logger
const createMockLogger = (): ILogger => ({
	trace: () => {},
	debug: () => {},
	info: () => {},
	warn: () => {},
	error: () => {},
	child: () => createMockLogger(),
	level: 'trace' as const
})

const mockLogger = createMockLogger()

// Helper to create a mock SignalKeyStore
function createMockStore(): SignalKeyStore & { data: SignalDataSet } {
	const data: SignalDataSet = {}

	return {
		data,
		async get(type, ids) {
			const result: { [key: string]: any } = {}
			const typeData = (data[type] || {}) as Record<string, any>
			for (const id of ids) {
				if (typeData[id] !== undefined) {
					result[id] = typeData[id]
				}
			}
			return result
		},
		async set(newData) {
			for (const type in newData) {
				const key = type as keyof SignalDataTypeMap
				data[key] = data[key] || ({} as any)
				Object.assign(data[key]!, newData[key])
			}
		},
		async clear() {
			for (const key in data) {
				delete data[key as keyof SignalDataSet]
			}
		}
	}
}

describe('initAuthCreds', () => {
	it('should create valid authentication credentials', () => {
		const creds = initAuthCreds()

		// Check all required properties exist
		expect(creds.noiseKey).toBeDefined()
		expect(creds.pairingEphemeralKeyPair).toBeDefined()
		expect(creds.signedIdentityKey).toBeDefined()
		expect(creds.signedPreKey).toBeDefined()
		expect(creds.registrationId).toBeDefined()
		expect(creds.advSecretKey).toBeDefined()
	})

	it('should create key pairs with correct structure', () => {
		const creds = initAuthCreds()

		// Key pairs should have public and private keys
		expect(creds.noiseKey.public).toBeInstanceOf(Uint8Array)
		expect(creds.noiseKey.private).toBeInstanceOf(Uint8Array)

		expect(creds.pairingEphemeralKeyPair.public).toBeInstanceOf(Uint8Array)
		expect(creds.pairingEphemeralKeyPair.private).toBeInstanceOf(Uint8Array)

		expect(creds.signedIdentityKey.public).toBeInstanceOf(Uint8Array)
		expect(creds.signedIdentityKey.private).toBeInstanceOf(Uint8Array)
	})

	it('should create signed pre-key with signature', () => {
		const creds = initAuthCreds()

		expect(creds.signedPreKey.keyPair).toBeDefined()
		expect(creds.signedPreKey.keyPair.public).toBeInstanceOf(Uint8Array)
		expect(creds.signedPreKey.keyPair.private).toBeInstanceOf(Uint8Array)
		expect(creds.signedPreKey.signature).toBeInstanceOf(Uint8Array)
		expect(creds.signedPreKey.keyId).toBe(1)
	})

	it('should create valid registration ID', () => {
		const creds = initAuthCreds()

		expect(typeof creds.registrationId).toBe('number')
		expect(creds.registrationId).toBeGreaterThan(0)
		expect(creds.registrationId).toBeLessThanOrEqual(16383)
	})

	it('should create base64 encoded advSecretKey', () => {
		const creds = initAuthCreds()

		// Should be valid base64
		expect(() => Buffer.from(creds.advSecretKey, 'base64')).not.toThrow()
		// Should decode to 32 bytes
		expect(Buffer.from(creds.advSecretKey, 'base64').length).toBe(32)
	})

	it('should initialize default values correctly', () => {
		const creds = initAuthCreds()

		expect(creds.processedHistoryMessages).toEqual([])
		expect(creds.nextPreKeyId).toBe(1)
		expect(creds.firstUnuploadedPreKeyId).toBe(1)
		expect(creds.accountSyncCounter).toBe(0)
		expect(creds.accountSettings.unarchiveChats).toBe(false)
		expect(creds.registered).toBe(false)
		expect(creds.pairingCode).toBeUndefined()
		expect(creds.lastPropHash).toBeUndefined()
		expect(creds.routingInfo).toBeUndefined()
	})

	it('should generate unique credentials each time', () => {
		const creds1 = initAuthCreds()
		const creds2 = initAuthCreds()

		// Keys should be different
		expect(creds1.noiseKey.public).not.toEqual(creds2.noiseKey.public)
		expect(creds1.signedIdentityKey.public).not.toEqual(creds2.signedIdentityKey.public)
		expect(creds1.advSecretKey).not.toBe(creds2.advSecretKey)
	})
})

describe('makeCacheableSignalKeyStore', () => {
	it('should return data from underlying store', async () => {
		const store = createMockStore()
		store.data['session'] = { 'user1': { key: 'value1' } } as any

		const cachedStore = makeCacheableSignalKeyStore(store, mockLogger)
		const result = await cachedStore.get('session', ['user1'])

		expect(result['user1']).toEqual({ key: 'value1' })
	})

	it('should cache data after first fetch', async () => {
		const store = createMockStore()
		store.data['session'] = { 'user1': { key: 'value1' } } as any

		const cachedStore = makeCacheableSignalKeyStore(store, mockLogger)

		// First fetch
		await cachedStore.get('session', ['user1'])

		// Modify underlying store
		store.data['session'] = { 'user1': { key: 'modified' } } as any

		// Second fetch should return cached value
		const result = await cachedStore.get('session', ['user1'])
		expect(result['user1']).toEqual({ key: 'value1' })
	})

	it('should update cache on set', async () => {
		const store = createMockStore()
		const cachedStore = makeCacheableSignalKeyStore(store, mockLogger)

		await cachedStore.set({
			'session': { 'user1': { key: 'newvalue' } } as any
		})

		const result = await cachedStore.get('session', ['user1'])
		expect(result['user1']).toEqual({ key: 'newvalue' })
	})

	it('should handle multiple keys', async () => {
		const store = createMockStore()
		store.data['session'] = {
			'user1': { key: 'value1' },
			'user2': { key: 'value2' },
			'user3': { key: 'value3' }
		} as any

		const cachedStore = makeCacheableSignalKeyStore(store, mockLogger)
		const result = await cachedStore.get('session', ['user1', 'user2', 'user3'])

		expect(Object.keys(result)).toHaveLength(3)
		expect(result['user1']).toEqual({ key: 'value1' })
		expect(result['user2']).toEqual({ key: 'value2' })
		expect(result['user3']).toEqual({ key: 'value3' })
	})

	it('should only fetch missing keys from store', async () => {
		const store = createMockStore()
		let lastFetchedIds: string[] = []
		const originalGet = store.get.bind(store)
		store.get = async (type, ids) => {
			lastFetchedIds = ids
			return originalGet(type, ids)
		}
		store.data['session'] = {
			'user1': { key: 'value1' },
			'user2': { key: 'value2' }
		} as any

		const cachedStore = makeCacheableSignalKeyStore(store, mockLogger)

		// First fetch user1
		await cachedStore.get('session', ['user1'])

		// Now fetch both - should only fetch user2 from store
		await cachedStore.get('session', ['user1', 'user2'])

		expect(lastFetchedIds).toEqual(['user2'])
	})

	it('should clear cache and underlying store', async () => {
		const store = createMockStore()
		store.data['session'] = { 'user1': { key: 'value1' } } as any

		const cachedStore = makeCacheableSignalKeyStore(store, mockLogger)

		// Populate cache
		await cachedStore.get('session', ['user1'])

		// Clear
		await cachedStore.clear!()

		// Underlying store should be cleared
		expect(store.data['session']).toBeUndefined()
	})

	it('should handle empty ids array', async () => {
		const store = createMockStore()
		const cachedStore = makeCacheableSignalKeyStore(store, mockLogger)

		const result = await cachedStore.get('session', [])
		expect(result).toEqual({})
	})

	it('should handle non-existent keys', async () => {
		const store = createMockStore()
		const cachedStore = makeCacheableSignalKeyStore(store, mockLogger)

		const result = await cachedStore.get('session', ['nonexistent'])
		expect(result).toEqual({})
	})

	it('should use custom cache if provided', async () => {
		const store = createMockStore()
		let getCalled = false
		let setCalled = false
		const customCache: CacheStore = {
			get: <T>(_key: string): T | undefined => { getCalled = true; return undefined },
			set: <T>(_key: string, _value: T) => { setCalled = true },
			del: (_key: string) => {},
			flushAll: () => {}
		}

		store.data['session'] = { 'user1': { key: 'value1' } } as any

		const cachedStore = makeCacheableSignalKeyStore(store, mockLogger, customCache)
		await cachedStore.get('session', ['user1'])

		expect(getCalled).toBe(true)
		expect(setCalled).toBe(true)
	})
})

describe('addTransactionCapability', () => {
	const defaultOptions = {
		maxCommitRetries: 3,
		delayBetweenTriesMs: 100
	}

	beforeEach(() => {
		// Reset test state
	})

	it('should pass through get without transaction', async () => {
		const store = createMockStore()
		store.data['session'] = { 'user1': { key: 'value1' } } as any

		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)
		const result = await txStore.get('session', ['user1'])

		expect(result['user1']).toEqual({ key: 'value1' })
	})

	it('should pass through set without transaction', async () => {
		const store = createMockStore()
		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)

		await txStore.set({
			'session': { 'user1': { key: 'newvalue' } } as any
		})

		expect(store.data['session']?.['user1']).toEqual({ key: 'newvalue' })
	})

	it('should report not in transaction initially', () => {
		const store = createMockStore()
		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)

		expect(txStore.isInTransaction()).toBe(false)
	})

	it('should report in transaction during transaction', async () => {
		const store = createMockStore()
		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)

		let wasInTransaction = false
		await txStore.transaction(async () => {
			wasInTransaction = txStore.isInTransaction()
		}, 'test')

		expect(wasInTransaction).toBe(true)
	})

	it('should cache reads within transaction', async () => {
		const store = createMockStore()
		let getCallCount = 0
		const originalGet = store.get.bind(store)
		store.get = async (type, ids) => {
			getCallCount++
			return originalGet(type, ids)
		}
		store.data['session'] = { 'user1': { key: 'value1' } } as any

		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)

		await txStore.transaction(async () => {
			// First read
			await txStore.get('session', ['user1'])
			const countAfterFirst = getCallCount
			// Second read should use cache
			await txStore.get('session', ['user1'])

			// Should not have made additional calls
			expect(getCallCount).toBe(countAfterFirst)
		}, 'test')
	})

	it('should commit mutations on transaction success', async () => {
		const store = createMockStore()
		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)

		await txStore.transaction(async () => {
			await txStore.set({
				'session': { 'user1': { key: 'txvalue' } } as any
			})
		}, 'test')

		expect(store.data['session']?.['user1']).toEqual({ key: 'txvalue' })
	})

	it('should rollback on transaction failure', async () => {
		const store = createMockStore()
		let setCalled = false
		const originalSet = store.set.bind(store)
		store.set = async (data) => {
			setCalled = true
			return originalSet(data)
		}
		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)

		try {
			await txStore.transaction(async () => {
				await txStore.set({
					'session': { 'user1': { key: 'txvalue' } } as any
				})
				throw new Error('Transaction failed')
			}, 'test')
		} catch {
			// Expected
		}

		// Set should not have been called on the underlying store
		expect(setCalled).toBe(false)
	})

	it('should reuse context for nested transactions', async () => {
		const store = createMockStore()
		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)

		let nestedInTransaction = false
		await txStore.transaction(async () => {
			await txStore.transaction(async () => {
				nestedInTransaction = txStore.isInTransaction()
			}, 'nested')
		}, 'outer')

		expect(nestedInTransaction).toBe(true)
	})

	it('should return value from transaction', async () => {
		const store = createMockStore()
		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)

		const result = await txStore.transaction(async () => {
			return 'transaction result'
		}, 'test')

		expect(result).toBe('transaction result')
	})

	it('should handle concurrent transactions on different keys', async () => {
		const store = createMockStore()
		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)

		const results: string[] = []

		await Promise.all([
			txStore.transaction(async () => {
				await delay(50)
				results.push('tx1')
			}, 'key1'),
			txStore.transaction(async () => {
				await delay(10)
				results.push('tx2')
			}, 'key2')
		])

		// tx2 should complete first since they run concurrently
		expect(results[0]).toBe('tx2')
		expect(results[1]).toBe('tx1')
	})

	it('should serialize transactions on same key', async () => {
		const store = createMockStore()
		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)

		const results: string[] = []

		await Promise.all([
			txStore.transaction(async () => {
				await delay(50)
				results.push('tx1')
			}, 'sameKey'),
			txStore.transaction(async () => {
				results.push('tx2')
			}, 'sameKey')
		])

		// tx1 should complete first since same key serializes
		expect(results[0]).toBe('tx1')
		expect(results[1]).toBe('tx2')
	})

	it('should not commit empty transactions', async () => {
		const store = createMockStore()
		let setCalled = false
		const originalSet = store.set.bind(store)
		store.set = async (data) => {
			setCalled = true
			return originalSet(data)
		}
		const txStore = addTransactionCapability(store, mockLogger, defaultOptions)

		await txStore.transaction(async () => {
			// No mutations
		}, 'test')

		expect(setCalled).toBe(false)
	})
})

// Helper function
function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}
