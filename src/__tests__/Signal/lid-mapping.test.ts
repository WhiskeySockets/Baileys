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

	describe('close() / closed-flag race protection', () => {
		it('returns null from getLIDsForPNs after close() is called', async () => {
			lidMappingStore.close()
			const result = await lidMappingStore.getLIDsForPNs(['12345@s.whatsapp.net'])
			expect(result).toBeNull()
			// keys.get must not be called when store is closed — short-circuit
			expect(mockKeys.get).not.toHaveBeenCalled()
		})

		it('returns null from getPNsForLIDs after close() is called', async () => {
			lidMappingStore.close()
			const result = await lidMappingStore.getPNsForLIDs(['12345@lid'])
			expect(result).toBeNull()
			expect(mockKeys.get).not.toHaveBeenCalled()
		})

		it('skips post-await DB writes in storeLIDPNMappings if close() runs mid-flight', async () => {
			// Arrange: keys.get awaits on a controllable promise; close() fires while it's pending.
			let resolveGet!: (v: SignalDataTypeMap['lid-mapping']) => void
			const getPromise = new Promise<SignalDataTypeMap['lid-mapping']>((resolve) => {
				resolveGet = resolve
			})
			// @ts-ignore
			mockKeys.get.mockReturnValueOnce(getPromise)

			// Act: kick off store, close mid-flight, then resolve the await.
			const storePromise = lidMappingStore.storeLIDPNMappings([
				{ lid: '12345@lid', pn: '54321@s.whatsapp.net' }
			])
			lidMappingStore.close()
			resolveGet({} as SignalDataTypeMap['lid-mapping'])
			await storePromise

			// Assert: the post-await transaction (DB write) was NOT scheduled because we returned early.
			expect(mockKeys.transaction).not.toHaveBeenCalled()
		})

		it('clears inflight maps on close() so subsequent lookups do not reuse stale promises', async () => {
			// Start a slow lookup (registers in inflightLIDLookups), then close before it resolves.
			let resolveGet!: (v: SignalDataTypeMap['lid-mapping']) => void
			const getPromise = new Promise<SignalDataTypeMap['lid-mapping']>((resolve) => {
				resolveGet = resolve
			})
			// @ts-ignore
			mockKeys.get.mockReturnValue(getPromise)

			const firstLookup = lidMappingStore.getLIDsForPNs(['12345@s.whatsapp.net'])
			lidMappingStore.close()
			resolveGet({} as SignalDataTypeMap['lid-mapping'])
			await firstLookup

			// A second identical request after close must short-circuit to null,
			// not return the inflight promise that was just cleared.
			const secondLookup = await lidMappingStore.getLIDsForPNs(['12345@s.whatsapp.net'])
			expect(secondLookup).toBeNull()
		})
	})
})
