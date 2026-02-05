import { jest } from '@jest/globals'
import P from 'pino'
import { LIDMappingStore } from '../../Signal/lid-mapping'
import type { LIDMapping, SignalDataTypeMap, SignalKeyStoreWithTransaction } from '../../Types'

const HOSTED_DEVICE_ID = 99

const mockKeys: jest.Mocked<SignalKeyStoreWithTransaction> = {
	get: jest.fn<SignalKeyStoreWithTransaction['get']>() as any,
	set: jest.fn<SignalKeyStoreWithTransaction['set']>(),
	transaction: jest.fn<SignalKeyStoreWithTransaction['transaction']>(async (work: () => any) => await work()) as any,
	isInTransaction: jest.fn<SignalKeyStoreWithTransaction['isInTransaction']>()
}
const logger = P({ level: 'silent' })

describe('LIDMappingStore', () => {
	const mockPnToLIDFunc = jest.fn<(jids: string[]) => Promise<LIDMapping[] | undefined>>()
	let lidMappingStore: LIDMappingStore

	beforeEach(() => {
		jest.clearAllMocks()
		lidMappingStore = new LIDMappingStore(mockKeys, logger, mockPnToLIDFunc)
	})

	describe('getPNForLID', () => {
		it('should correctly map a standard LID with a hosted device ID back to a standard PN with a hosted device', async () => {
			const lidWithHostedDevice = `12345:${HOSTED_DEVICE_ID}@lid`
			const pnUser = '54321'

			// @ts-ignore
			mockKeys.get.mockResolvedValue({ [`12345_reverse`]: pnUser } as SignalDataTypeMap['lid-mapping'])

			const result = await lidMappingStore.getPNForLID(lidWithHostedDevice)
			expect(result).toBe(`${pnUser}:${HOSTED_DEVICE_ID}@s.whatsapp.net`)
		})

		it('should return null if no reverse mapping is found', async () => {
			const lid = 'nonexistent@lid'

			// @ts-ignore
			mockKeys.get.mockResolvedValue({} as SignalDataTypeMap['lid-mapping']) // Simulate not found in DB

			const result = await lidMappingStore.getPNForLID(lid)
			expect(result).toBeNull()
		})
	})

	describe('getLIDsForPNs', () => {
		it('should resolve multiple PNs in a single batch', async () => {
			const pnOne = '11111@s.whatsapp.net'
			const pnTwo = '22222:5@s.whatsapp.net'

			// @ts-ignore
			mockKeys.get.mockResolvedValue({ '11111': 'aaaaa', '22222': 'bbbbb' } as SignalDataTypeMap['lid-mapping'])

			const result = await lidMappingStore.getLIDsForPNs([pnOne, pnTwo])

			expect(result).toEqual(
				expect.arrayContaining([
					{ pn: pnOne, lid: 'aaaaa@lid' },
					{ pn: pnTwo, lid: 'bbbbb:5@lid' }
				])
			)
		})
	})

	describe('getPNsForLIDs', () => {
		it('should resolve multiple LIDs in a single batch', async () => {
			const lidOne = '33333@lid'
			const lidTwo = '44444:99@hosted.lid'

			// @ts-ignore
			mockKeys.get.mockResolvedValue({ '33333_reverse': '77777', '44444_reverse': '88888' } as SignalDataTypeMap['lid-mapping'])

			const result = await lidMappingStore.getPNsForLIDs([lidOne, lidTwo])

			expect(result).toEqual(
				expect.arrayContaining([
					{ lid: lidOne, pn: '77777@s.whatsapp.net' },
					{ lid: lidTwo, pn: '88888:99@hosted' }
				])
			)
		})
	})

	// ========================================================================
	// M3: REQUEST COALESCING TESTS
	// ========================================================================

	describe('Request Coalescing (M3)', () => {
		it('should deduplicate concurrent getLIDForPN calls for same PN', async () => {
			const pn = '12345@s.whatsapp.net'
			const lidUser = 'aaaaa'

			// @ts-ignore - Mock DB lookup to return mapping
			mockKeys.get.mockResolvedValue({ '12345': lidUser } as SignalDataTypeMap['lid-mapping'])

			// Make 10 concurrent calls for the same PN
			const promises = Array(10).fill(null).map(() => lidMappingStore.getLIDForPN(pn))

			// All should resolve to same result
			const results = await Promise.all(promises)
			expect(results.every(r => r === `${lidUser}@lid`)).toBe(true)

			// But DB should only be queried ONCE (not 10 times)
			// The batch method getLIDsForPNs calls keys.get once
			expect(mockKeys.get).toHaveBeenCalledTimes(1)
		})

		it('should deduplicate concurrent getPNForLID calls for same LID', async () => {
			const lid = '54321@lid'
			const pnUser = 'bbbbb'

			// @ts-ignore - Mock DB lookup to return reverse mapping
			mockKeys.get.mockResolvedValue({ '54321_reverse': pnUser } as SignalDataTypeMap['lid-mapping'])

			// Make 10 concurrent calls for the same LID
			const promises = Array(10).fill(null).map(() => lidMappingStore.getPNForLID(lid))

			// All should resolve to same result
			const results = await Promise.all(promises)
			expect(results.every(r => r === `${pnUser}@s.whatsapp.net`)).toBe(true)

			// But DB should only be queried ONCE (not 10 times)
			expect(mockKeys.get).toHaveBeenCalledTimes(1)
		})

		it('should NOT coalesce calls for different PNs', async () => {
			const pn1 = '11111@s.whatsapp.net'
			const pn2 = '22222@s.whatsapp.net'

			// @ts-ignore - Mock to return different mappings
			mockKeys.get.mockResolvedValue({ '11111': 'aaaaa', '22222': 'bbbbb' } as SignalDataTypeMap['lid-mapping'])

			// Concurrent calls for DIFFERENT PNs
			const [result1, result2] = await Promise.all([
				lidMappingStore.getLIDForPN(pn1),
				lidMappingStore.getLIDForPN(pn2)
			])

			expect(result1).toBe('aaaaa@lid')
			expect(result2).toBe('bbbbb@lid')

			// Should make 2 separate DB calls (no coalescing)
			expect(mockKeys.get).toHaveBeenCalledTimes(2)
		})
	})

	// ========================================================================
	// V4: DESTROYED FLAG & OPERATION COUNTER TESTS
	// ========================================================================

	describe('Destroyed Flag Protection (V4, M2)', () => {
		it('should reject operations after destroy()', async () => {
			lidMappingStore.destroy()

			// All operations should throw after destroy
			await expect(lidMappingStore.getLIDForPN('12345@s.whatsapp.net'))
				.rejects.toThrow('LIDMappingStore has been destroyed')

			await expect(lidMappingStore.getPNForLID('54321@lid'))
				.rejects.toThrow('LIDMappingStore has been destroyed')

			await expect(lidMappingStore.storeLIDPNMappings([{ lid: 'a@lid', pn: 'b@s.whatsapp.net' }]))
				.rejects.toThrow('LIDMappingStore has been destroyed')
		})

		it('should allow destroy() to be called multiple times safely', () => {
			// First destroy
			lidMappingStore.destroy()

			// Second destroy should not throw (reentrancy guard)
			expect(() => lidMappingStore.destroy()).not.toThrow()

			// Third destroy should also be safe
			expect(() => lidMappingStore.destroy()).not.toThrow()
		})

		it('should complete active operations before destroying resources (graceful degradation)', async () => {
			const pn = '12345@s.whatsapp.net'

			// Mock slow DB operation (simulates long-running operation)
			let operationStarted = false
			let operationCompleted = false

			// @ts-ignore
			mockKeys.get.mockImplementation(async () => {
				operationStarted = true
				await new Promise(resolve => setTimeout(resolve, 100)) // 100ms delay
				operationCompleted = true
				return { '12345': 'aaaaa' } as SignalDataTypeMap['lid-mapping']
			})

			// Start operation
			const operationPromise = lidMappingStore.getLIDForPN(pn)

			// Wait a bit to ensure operation has started
			await new Promise(resolve => setTimeout(resolve, 10))
			expect(operationStarted).toBe(true)
			expect(operationCompleted).toBe(false)

			// Call destroy while operation is in progress
			lidMappingStore.destroy()

			// Operation should still complete successfully (graceful degradation)
			const result = await operationPromise
			expect(result).toBe('aaaaa@lid')
			expect(operationCompleted).toBe(true)

			// But new operations should be rejected
			await expect(lidMappingStore.getLIDForPN(pn))
				.rejects.toThrow('LIDMappingStore has been destroyed')
		})
	})

	// ========================================================================
	// CACHE & OPTIMIZATION TESTS
	// ========================================================================

	describe('Cache Behavior', () => {
		it('should use cache for subsequent lookups (no DB hit)', async () => {
			const pn = '12345@s.whatsapp.net'
			const lidUser = 'aaaaa'

			// @ts-ignore - First lookup hits DB
			mockKeys.get.mockResolvedValue({ '12345': lidUser } as SignalDataTypeMap['lid-mapping'])

			// First lookup - cache miss, DB hit
			const result1 = await lidMappingStore.getLIDForPN(pn)
			expect(result1).toBe(`${lidUser}@lid`)
			expect(mockKeys.get).toHaveBeenCalledTimes(1)

			// Second lookup - cache hit, no DB call
			const result2 = await lidMappingStore.getLIDForPN(pn)
			expect(result2).toBe(`${lidUser}@lid`)

			// DB should still only have been called once (cache hit)
			expect(mockKeys.get).toHaveBeenCalledTimes(1)
		})

		it('should clear cache on destroy()', async () => {
			const pn = '12345@s.whatsapp.net'

			// @ts-ignore
			mockKeys.get.mockResolvedValue({ '12345': 'aaaaa' } as SignalDataTypeMap['lid-mapping'])

			// Populate cache
			await lidMappingStore.getLIDForPN(pn)

			// Destroy should clear cache
			lidMappingStore.destroy()

			// Create new store
			const newStore = new LIDMappingStore(mockKeys, logger, mockPnToLIDFunc)

			// New lookup should hit DB again (cache was cleared)
			jest.clearAllMocks() // Reset call count
			await newStore.getLIDForPN(pn)
			expect(mockKeys.get).toHaveBeenCalledTimes(1)
		})
	})

	// ========================================================================
	// EDGE CASES & ERROR HANDLING
	// ========================================================================

	describe('Edge Cases', () => {
		it('should handle invalid JIDs gracefully', async () => {
			const result1 = await lidMappingStore.getLIDForPN('invalid')
			expect(result1).toBeNull()

			const result2 = await lidMappingStore.getPNForLID('invalid')
			expect(result2).toBeNull()
		})

		it('should handle empty results from DB', async () => {
			// @ts-ignore
			mockKeys.get.mockResolvedValue({} as SignalDataTypeMap['lid-mapping'])

			const result = await lidMappingStore.getLIDForPN('12345@s.whatsapp.net')
			expect(result).toBeNull()
		})

		it('should handle batch operations with mixed valid/invalid JIDs', async () => {
			// @ts-ignore
			mockKeys.get.mockResolvedValue({ '12345': 'aaaaa' } as SignalDataTypeMap['lid-mapping'])

			const result = await lidMappingStore.getLIDsForPNs([
				'12345@s.whatsapp.net',  // Valid
				'invalid',                 // Invalid
				'67890@s.whatsapp.net'    // Valid but not in DB
			])

			// Should only return valid results
			expect(result).toEqual([
				{ pn: '12345@s.whatsapp.net', lid: 'aaaaa@lid' }
			])
		})
	})
})
