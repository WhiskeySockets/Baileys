import { jest } from '@jest/globals'
import P from 'pino'
import { LIDMappingStore } from '../../Signal/lid-mapping'
import type { LIDMapping, SignalKeyStoreWithTransaction } from '../../Types'

const HOSTED_DEVICE_ID = 99

// Type for lid-mapping get results
type LidMappingResult = { [key: string]: string | undefined }

// Type for set data
type LidMappingSetData = { 'lid-mapping': Record<string, string> }

// Helper to create mock keys with fresh mocks
function createMockKeys() {
	return {
		get: jest.fn<(type: string, keys: string[]) => Promise<LidMappingResult>>(),
		set: jest.fn<(data: LidMappingSetData) => Promise<void>>(),
		transaction: jest.fn<(work: () => Promise<void>) => Promise<void>>(async work => await work()),
		isInTransaction: jest.fn<() => boolean>()
	}
}

type MockKeys = ReturnType<typeof createMockKeys>

const logger = P({ level: 'silent' })

describe('LIDMappingStore', () => {
	let mockKeys: MockKeys
	let mockPnToLIDFunc: jest.Mock<(jids: string[]) => Promise<LIDMapping[] | undefined>>
	let store: LIDMappingStore

	beforeEach(() => {
		jest.clearAllMocks()
		mockKeys = createMockKeys()
		mockPnToLIDFunc = jest.fn<(jids: string[]) => Promise<LIDMapping[] | undefined>>()
		store = new LIDMappingStore(mockKeys as unknown as SignalKeyStoreWithTransaction, logger, mockPnToLIDFunc)
	})

	describe('storeLIDPNMappings', () => {
		it('should return early for empty array', async () => {
			await store.storeLIDPNMappings([])

			expect(mockKeys.get).not.toHaveBeenCalled()
			expect(mockKeys.set).not.toHaveBeenCalled()
			expect(mockKeys.transaction).not.toHaveBeenCalled()
		})

		it('should store a single valid LID-PN pair', async () => {
			const pairs: LIDMapping[] = [{ lid: '12345@lid', pn: '5511999999999@s.whatsapp.net' }]

			mockKeys.get.mockResolvedValue({})

			await store.storeLIDPNMappings(pairs)

			expect(mockKeys.transaction).toHaveBeenCalledTimes(1)
			expect(mockKeys.set).toHaveBeenCalledTimes(1)
			expect(mockKeys.set).toHaveBeenCalledWith({
				'lid-mapping': {
					'5511999999999': '12345',
					'12345_reverse': '5511999999999'
				}
			})
		})

		it('should store multiple valid LID-PN pairs in a single batch', async () => {
			const pairs: LIDMapping[] = [
				{ lid: '11111@lid', pn: '5511111111111@s.whatsapp.net' },
				{ lid: '22222@lid', pn: '5522222222222@s.whatsapp.net' },
				{ lid: '33333@lid', pn: '5533333333333@s.whatsapp.net' }
			]

			mockKeys.get.mockResolvedValue({})

			await store.storeLIDPNMappings(pairs)

			// Should only call set ONCE (batched)
			expect(mockKeys.set).toHaveBeenCalledTimes(1)
			expect(mockKeys.set).toHaveBeenCalledWith({
				'lid-mapping': {
					'5511111111111': '11111',
					'11111_reverse': '5511111111111',
					'5522222222222': '22222',
					'22222_reverse': '5522222222222',
					'5533333333333': '33333',
					'33333_reverse': '5533333333333'
				}
			})
		})

		it('should skip invalid LID-PN pairs (both LID)', async () => {
			const pairs: LIDMapping[] = [
				{ lid: '12345@lid', pn: '67890@lid' } // Invalid: both are LID
			]

			await store.storeLIDPNMappings(pairs)

			expect(mockKeys.set).not.toHaveBeenCalled()
		})

		it('should skip invalid LID-PN pairs (both PN)', async () => {
			const pairs: LIDMapping[] = [
				{ lid: '12345@s.whatsapp.net', pn: '67890@s.whatsapp.net' } // Invalid: both are PN
			]

			await store.storeLIDPNMappings(pairs)

			expect(mockKeys.set).not.toHaveBeenCalled()
		})

		it('should handle reversed order (PN as lid, LID as pn) and store correctly', async () => {
			// The function accepts either order but should store correctly
			// Here: lid field has PN, pn field has LID (reversed)
			const pairs: LIDMapping[] = [{ lid: '5511999999999@s.whatsapp.net', pn: '12345@lid' }]

			mockKeys.get.mockResolvedValue({})

			await store.storeLIDPNMappings(pairs)

			expect(mockKeys.set).toHaveBeenCalledTimes(1)
			// Verify the mapping is stored correctly: PN user -> LID user (not reversed)
			expect(mockKeys.set).toHaveBeenCalledWith({
				'lid-mapping': {
					'5511999999999': '12345', // PN user -> LID user
					'12345_reverse': '5511999999999' // LID user -> PN user (reverse lookup)
				}
			})
		})

		it('should skip pairs that already exist in cache', async () => {
			const pairs: LIDMapping[] = [{ lid: '12345@lid', pn: '5511999999999@s.whatsapp.net' }]

			// First store
			mockKeys.get.mockResolvedValue({})
			await store.storeLIDPNMappings(pairs)

			jest.clearAllMocks()

			// Second store with same data - should skip due to cache
			await store.storeLIDPNMappings(pairs)

			// Should not call set again because it's in cache
			expect(mockKeys.set).not.toHaveBeenCalled()
		})

		it('should skip pairs that already exist in database', async () => {
			const pairs: LIDMapping[] = [{ lid: '12345@lid', pn: '5511999999999@s.whatsapp.net' }]

			// Simulate existing mapping in DB
			mockKeys.get.mockResolvedValue({ '5511999999999': '12345' })

			await store.storeLIDPNMappings(pairs)

			// Should not store because mapping already exists
			expect(mockKeys.transaction).not.toHaveBeenCalled()
		})

		it('should batch fetch cache misses in a single DB call', async () => {
			const pairs: LIDMapping[] = [
				{ lid: '11111@lid', pn: '5511111111111@s.whatsapp.net' },
				{ lid: '22222@lid', pn: '5522222222222@s.whatsapp.net' },
				{ lid: '33333@lid', pn: '5533333333333@s.whatsapp.net' }
			]

			mockKeys.get.mockResolvedValue({})

			await store.storeLIDPNMappings(pairs)

			// Should call get ONCE with all cache miss keys (batched)
			expect(mockKeys.get).toHaveBeenCalledTimes(1)
			expect(mockKeys.get).toHaveBeenCalledWith('lid-mapping', ['5511111111111', '5522222222222', '5533333333333'])
		})

		it('should handle mixed new and existing pairs', async () => {
			const pairs: LIDMapping[] = [
				{ lid: '11111@lid', pn: '5511111111111@s.whatsapp.net' }, // exists
				{ lid: '22222@lid', pn: '5522222222222@s.whatsapp.net' }, // new
				{ lid: '33333@lid', pn: '5533333333333@s.whatsapp.net' } // new
			]

			// First one exists in DB
			mockKeys.get.mockResolvedValue({ '5511111111111': '11111' })

			await store.storeLIDPNMappings(pairs)

			// Should only store the new ones
			expect(mockKeys.set).toHaveBeenCalledWith({
				'lid-mapping': {
					'5522222222222': '22222',
					'22222_reverse': '5522222222222',
					'5533333333333': '33333',
					'33333_reverse': '5533333333333'
				}
			})
		})

		it('should handle hosted PN JIDs', async () => {
			const pairs: LIDMapping[] = [
				{ lid: `12345:${HOSTED_DEVICE_ID}@hosted.lid`, pn: `5511999999999:${HOSTED_DEVICE_ID}@hosted` }
			]

			mockKeys.get.mockResolvedValue({})

			await store.storeLIDPNMappings(pairs)

			expect(mockKeys.set).toHaveBeenCalledTimes(1)
		})
	})

	describe('getLIDForPN', () => {
		it('should return LID from cache', async () => {
			// Pre-populate cache via storeLIDPNMappings
			mockKeys.get.mockResolvedValue({})
			await store.storeLIDPNMappings([{ lid: '12345@lid', pn: '5511999999999@s.whatsapp.net' }])

			jest.clearAllMocks()

			const result = await store.getLIDForPN('5511999999999@s.whatsapp.net')

			expect(result).toBe('12345@lid')
			// Should not hit DB because it's cached
			expect(mockKeys.get).not.toHaveBeenCalled()
		})

		it('should return LID from database on cache miss', async () => {
			mockKeys.get.mockResolvedValue({ '5511999999999': '12345' })

			const result = await store.getLIDForPN('5511999999999@s.whatsapp.net')

			expect(result).toBe('12345@lid')
			expect(mockKeys.get).toHaveBeenCalledWith('lid-mapping', ['5511999999999'])
		})

		it('should return device-specific LID for device JID', async () => {
			mockKeys.get.mockResolvedValue({ '5511999999999': '12345' })

			const result = await store.getLIDForPN('5511999999999:2@s.whatsapp.net')

			expect(result).toBe('12345:2@lid')
		})

		it('should call usync function when mapping not found', async () => {
			mockKeys.get.mockResolvedValue({})
			mockPnToLIDFunc.mockResolvedValue([{ lid: '12345@lid', pn: '5511999999999@s.whatsapp.net' }])

			const result = await store.getLIDForPN('5511999999999@s.whatsapp.net')

			expect(mockPnToLIDFunc).toHaveBeenCalledWith(['5511999999999@s.whatsapp.net'])
			expect(result).toBe('12345@lid')
		})

		it('should return null when usync returns nothing', async () => {
			mockKeys.get.mockResolvedValue({})
			mockPnToLIDFunc.mockResolvedValue(undefined)

			const result = await store.getLIDForPN('5511999999999@s.whatsapp.net')

			expect(result).toBeNull()
		})

		it('should return null for invalid JID', async () => {
			const result = await store.getLIDForPN('invalid-jid')

			expect(result).toBeNull()
		})

		it('should handle hosted PN to hosted.lid mapping', async () => {
			mockKeys.get.mockResolvedValue({ '5511999999999': '12345' })

			const result = await store.getLIDForPN(`5511999999999:${HOSTED_DEVICE_ID}@hosted`)

			expect(result).toBe(`12345:${HOSTED_DEVICE_ID}@hosted.lid`)
		})
	})

	describe('getLIDsForPNs', () => {
		it('should return empty array for empty input', async () => {
			const result = await store.getLIDsForPNs([])

			expect(result).toEqual([])
			expect(mockKeys.get).not.toHaveBeenCalled()
		})

		it('should return LIDs for multiple PNs from cache', async () => {
			// Pre-populate cache
			mockKeys.get.mockResolvedValue({})
			await store.storeLIDPNMappings([
				{ lid: '11111@lid', pn: '5511111111111@s.whatsapp.net' },
				{ lid: '22222@lid', pn: '5522222222222@s.whatsapp.net' }
			])

			jest.clearAllMocks()

			const result = await store.getLIDsForPNs(['5511111111111@s.whatsapp.net', '5522222222222@s.whatsapp.net'])

			expect(result).toHaveLength(2)
			expect(result).toContainEqual({ lid: '11111@lid', pn: '5511111111111@s.whatsapp.net' })
			expect(result).toContainEqual({ lid: '22222@lid', pn: '5522222222222@s.whatsapp.net' })
			// No DB calls because all in cache
			expect(mockKeys.get).not.toHaveBeenCalled()
		})

		it('should batch fetch cache misses in a single DB call', async () => {
			mockKeys.get.mockResolvedValue({
				'5511111111111': '11111',
				'5522222222222': '22222',
				'5533333333333': '33333'
			})

			const result = await store.getLIDsForPNs([
				'5511111111111@s.whatsapp.net',
				'5522222222222@s.whatsapp.net',
				'5533333333333@s.whatsapp.net'
			])

			expect(result).toHaveLength(3)
			// Should call get ONCE (batched)
			expect(mockKeys.get).toHaveBeenCalledTimes(1)
			expect(mockKeys.get).toHaveBeenCalledWith('lid-mapping', ['5511111111111', '5522222222222', '5533333333333'])
		})

		it('should handle mix of cache hits and misses', async () => {
			// Pre-populate one in cache
			mockKeys.get.mockResolvedValueOnce({})
			await store.storeLIDPNMappings([{ lid: '11111@lid', pn: '5511111111111@s.whatsapp.net' }])

			jest.clearAllMocks()

			// Now lookup with one cached and one not
			mockKeys.get.mockResolvedValue({ '5522222222222': '22222' })

			const result = await store.getLIDsForPNs([
				'5511111111111@s.whatsapp.net', // cached
				'5522222222222@s.whatsapp.net' // not cached
			])

			expect(result).toHaveLength(2)
			// Should only fetch the uncached one
			expect(mockKeys.get).toHaveBeenCalledWith('lid-mapping', ['5522222222222'])
		})

		it('should filter out invalid JIDs', async () => {
			mockKeys.get.mockResolvedValue({ '5511111111111': '11111' })

			const result = await store.getLIDsForPNs([
				'5511111111111@s.whatsapp.net',
				'invalid-jid',
				'12345@lid' // LID, not PN
			])

			expect(result).toHaveLength(1)
			expect(result![0]).toEqual({ lid: '11111@lid', pn: '5511111111111@s.whatsapp.net' })
		})

		it('should call usync for missing mappings', async () => {
			mockKeys.get.mockResolvedValue({}) // Nothing in DB
			mockPnToLIDFunc.mockResolvedValue([{ lid: '11111@lid', pn: '5511111111111@s.whatsapp.net' }])

			const result = await store.getLIDsForPNs(['5511111111111@s.whatsapp.net'])

			expect(mockPnToLIDFunc).toHaveBeenCalled()
			expect(result).toHaveLength(1)
		})

		it('should handle multiple devices for same user', async () => {
			mockKeys.get.mockResolvedValue({ '5511111111111': '11111' })

			const result = await store.getLIDsForPNs([
				'5511111111111@s.whatsapp.net',
				'5511111111111:1@s.whatsapp.net',
				'5511111111111:2@s.whatsapp.net'
			])

			expect(result).toHaveLength(3)
			expect(result).toContainEqual({ lid: '11111@lid', pn: '5511111111111@s.whatsapp.net' })
			expect(result).toContainEqual({ lid: '11111:1@lid', pn: '5511111111111:1@s.whatsapp.net' })
			expect(result).toContainEqual({ lid: '11111:2@lid', pn: '5511111111111:2@s.whatsapp.net' })

			// Should only fetch user once (deduplicated)
			expect(mockKeys.get).toHaveBeenCalledWith('lid-mapping', ['5511111111111'])
		})

		it('should return null when usync fails for all', async () => {
			mockKeys.get.mockResolvedValue({})
			mockPnToLIDFunc.mockResolvedValue(undefined)

			const result = await store.getLIDsForPNs(['5511111111111@s.whatsapp.net'])

			expect(result).toBeNull()
		})
	})

	describe('getPNForLID', () => {
		it('should return null for non-LID JID', async () => {
			const result = await store.getPNForLID('5511999999999@s.whatsapp.net')

			expect(result).toBeNull()
			expect(mockKeys.get).not.toHaveBeenCalled()
		})

		it('should return PN from cache', async () => {
			// Pre-populate cache
			mockKeys.get.mockResolvedValue({})
			await store.storeLIDPNMappings([{ lid: '12345@lid', pn: '5511999999999@s.whatsapp.net' }])

			jest.clearAllMocks()

			const result = await store.getPNForLID('12345@lid')

			expect(result).toBe('5511999999999@s.whatsapp.net')
			expect(mockKeys.get).not.toHaveBeenCalled()
		})

		it('should return PN from database on cache miss', async () => {
			mockKeys.get.mockResolvedValue({ '12345_reverse': '5511999999999' })

			const result = await store.getPNForLID('12345@lid')

			expect(result).toBe('5511999999999@s.whatsapp.net')
		})

		it('should return device-specific PN for device LID', async () => {
			mockKeys.get.mockResolvedValue({ '12345_reverse': '5511999999999' })

			const result = await store.getPNForLID('12345:2@lid')

			expect(result).toBe('5511999999999:2@s.whatsapp.net')
		})

		it('should return hosted PN for hosted.lid', async () => {
			mockKeys.get.mockResolvedValue({ '12345_reverse': '5511999999999' })

			const result = await store.getPNForLID(`12345:${HOSTED_DEVICE_ID}@hosted.lid`)

			expect(result).toBe(`5511999999999:${HOSTED_DEVICE_ID}@hosted`)
		})

		it('should return null if no reverse mapping found', async () => {
			mockKeys.get.mockResolvedValue({})

			const result = await store.getPNForLID('nonexistent@lid')

			expect(result).toBeNull()
		})

		it('should return null for invalid LID format', async () => {
			const result = await store.getPNForLID('invalid')

			expect(result).toBeNull()
		})
	})

	describe('caching behavior', () => {
		it('should populate cache on storeLIDPNMappings', async () => {
			mockKeys.get.mockResolvedValue({})
			await store.storeLIDPNMappings([{ lid: '12345@lid', pn: '5511999999999@s.whatsapp.net' }])

			jest.clearAllMocks()

			// Both lookups should use cache
			const lidResult = await store.getLIDForPN('5511999999999@s.whatsapp.net')
			const pnResult = await store.getPNForLID('12345@lid')

			expect(lidResult).toBe('12345@lid')
			expect(pnResult).toBe('5511999999999@s.whatsapp.net')
			expect(mockKeys.get).not.toHaveBeenCalled()
		})

		it('should populate cache on getLIDsForPNs DB lookup', async () => {
			mockKeys.get.mockResolvedValue({ '5511999999999': '12345' })

			// First lookup - goes to DB
			await store.getLIDsForPNs(['5511999999999@s.whatsapp.net'])

			jest.clearAllMocks()

			// Second lookup - should use cache
			const result = await store.getLIDsForPNs(['5511999999999@s.whatsapp.net'])

			expect(result).toHaveLength(1)
			expect(mockKeys.get).not.toHaveBeenCalled()
		})

		it('should populate cache on getPNForLID DB lookup', async () => {
			mockKeys.get.mockResolvedValue({ '12345_reverse': '5511999999999' })

			// First lookup - goes to DB
			await store.getPNForLID('12345@lid')

			jest.clearAllMocks()

			// Second lookup - should use cache
			const result = await store.getPNForLID('12345@lid')

			expect(result).toBe('5511999999999@s.whatsapp.net')
			expect(mockKeys.get).not.toHaveBeenCalled()
		})
	})

	describe('edge cases', () => {
		it('should handle standard numeric JID user part', async () => {
			const pairs: LIDMapping[] = [{ lid: '12345@lid', pn: '5511999999999@s.whatsapp.net' }]

			mockKeys.get.mockResolvedValue({})
			await store.storeLIDPNMappings(pairs)

			expect(mockKeys.set).toHaveBeenCalled()
		})

		it('should handle very long phone numbers', async () => {
			const pairs: LIDMapping[] = [{ lid: '12345678901234567890@lid', pn: '12345678901234567890@s.whatsapp.net' }]

			mockKeys.get.mockResolvedValue({})
			await store.storeLIDPNMappings(pairs)

			expect(mockKeys.set).toHaveBeenCalled()
		})

		it('should handle duplicate pairs in input', async () => {
			const pairs: LIDMapping[] = [
				{ lid: '12345@lid', pn: '5511999999999@s.whatsapp.net' },
				{ lid: '12345@lid', pn: '5511999999999@s.whatsapp.net' } // duplicate
			]

			mockKeys.get.mockResolvedValue({})
			await store.storeLIDPNMappings(pairs)

			// Should dedupe and only store once
			const setCall = mockKeys.set.mock.calls[0]![0] as { 'lid-mapping': Record<string, string> }
			expect(Object.keys(setCall['lid-mapping'])).toHaveLength(2) // pnUser + reverse
		})

		it('should handle store without pnToLIDFunc', async () => {
			const storeWithoutUsync = new LIDMappingStore(mockKeys as unknown as SignalKeyStoreWithTransaction, logger)

			mockKeys.get.mockResolvedValue({})

			const result = await storeWithoutUsync.getLIDForPN('5511999999999@s.whatsapp.net')

			// Should return null gracefully when usync is not available
			expect(result).toBeNull()
		})
	})

	describe('history sync batch operations', () => {
		it('should efficiently handle large batches like history sync (simulating WhatsApp Web behavior)', async () => {
			// Simulate a history sync with many mappings (like WhatsApp Web's createLidPnMappingsInBatches)
			const pairs: LIDMapping[] = []
			for (let i = 0; i < 100; i++) {
				pairs.push({
					lid: `${10000 + i}@lid`,
					pn: `55119${String(i).padStart(8, '0')}@s.whatsapp.net`
				})
			}

			mockKeys.get.mockResolvedValue({})

			await store.storeLIDPNMappings(pairs)

			// Critical: Should only have ONE transaction and ONE set call (batched)
			expect(mockKeys.transaction).toHaveBeenCalledTimes(1)
			expect(mockKeys.set).toHaveBeenCalledTimes(1)

			// Verify all mappings were included
			const setCall = mockKeys.set.mock.calls[0]![0] as { 'lid-mapping': Record<string, string> }
			expect(Object.keys(setCall['lid-mapping'])).toHaveLength(200) // 100 pairs * 2 (forward + reverse)
		})

		it('should batch fetch cache misses in a single DB call', async () => {
			// Store many mappings first
			const pairs: LIDMapping[] = []
			for (let i = 0; i < 50; i++) {
				pairs.push({
					lid: `${20000 + i}@lid`,
					pn: `55119${String(i).padStart(8, '0')}@s.whatsapp.net`
				})
			}

			mockKeys.get.mockResolvedValue({})
			await store.storeLIDPNMappings(pairs)

			// Reset mocks
			mockKeys.get.mockClear()

			// Create a new store (no cache) and query multiple PNs
			const freshStore = new LIDMappingStore(
				mockKeys as unknown as SignalKeyStoreWithTransaction,
				logger,
				mockPnToLIDFunc
			)

			const pnsToQuery = pairs.slice(0, 10).map(p => p.pn)

			// Mock DB response with all mappings
			const dbResponse: { [key: string]: string } = {}
			for (let i = 0; i < 10; i++) {
				dbResponse[`119${String(i).padStart(8, '0')}`] = String(20000 + i)
			}

			mockKeys.get.mockResolvedValue(dbResponse)
			mockPnToLIDFunc.mockResolvedValue(undefined)

			await freshStore.getLIDsForPNs(pnsToQuery)

			// Should batch all cache misses into ONE DB call
			expect(mockKeys.get).toHaveBeenCalledTimes(1)
		})

		it('should handle mixed cache hits and misses efficiently', async () => {
			// Pre-populate cache with some mappings
			const cachedPairs: LIDMapping[] = [
				{ lid: '30001@lid', pn: '5511900000001@s.whatsapp.net' },
				{ lid: '30002@lid', pn: '5511900000002@s.whatsapp.net' }
			]
			mockKeys.get.mockResolvedValue({})
			await store.storeLIDPNMappings(cachedPairs)

			// Reset and prepare for query
			mockKeys.get.mockClear()

			// Query mix of cached and uncached
			const queryPns = [
				'5511900000001@s.whatsapp.net', // cached
				'5511900000002@s.whatsapp.net', // cached
				'5511900000003@s.whatsapp.net', // not cached
				'5511900000004@s.whatsapp.net' // not cached
			]

			// Mock DB response for uncached only (using pnUser without @s.whatsapp.net)
			mockKeys.get.mockResolvedValue({
				'5511900000003': '30003',
				'5511900000004': '30004'
			})
			mockPnToLIDFunc.mockResolvedValue(undefined)

			const results = await store.getLIDsForPNs(queryPns)

			// Should have results for all 4 items (2 cache hits + 2 DB hits)
			expect(results).toHaveLength(4)

			// DB should only be queried for cache misses
			expect(mockKeys.get).toHaveBeenCalledTimes(1)
			// Verify it was called with lid-mapping type and the uncached pnUsers
			expect(mockKeys.get).toHaveBeenCalledWith('lid-mapping', ['5511900000003', '5511900000004'])
		})
	})
})
