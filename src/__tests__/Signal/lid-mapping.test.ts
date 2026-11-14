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

	describe('storeLIDPNMappings', () => {
		// get() is generic, so the mock takes `never`; `satisfies` still checks each fixture's shape
		type LidMappingRows = Record<string, SignalDataTypeMap['lid-mapping']>

		it('returns a pair that was not stored before and writes it', async () => {
			mockKeys.get.mockResolvedValue({} satisfies LidMappingRows as never)

			const stored = await lidMappingStore.storeLIDPNMappings([{ lid: '111@lid', pn: '222@s.whatsapp.net' }])

			expect(stored).toEqual([{ pnUser: '222', lidUser: '111' }])
			expect(mockKeys.set).toHaveBeenCalledWith({ 'lid-mapping': { '222': '111', '111_reverse': '222' } })
		})

		it('returns nothing for a pair that is already stored', async () => {
			mockKeys.get.mockResolvedValue({ '222': '111' } satisfies LidMappingRows as never)

			const stored = await lidMappingStore.storeLIDPNMappings([{ lid: '111@lid', pn: '222@s.whatsapp.net' }])

			expect(stored).toEqual([])
			expect(mockKeys.set).not.toHaveBeenCalled()
		})

		it('returns nothing on a repeat call answered from the cache', async () => {
			mockKeys.get.mockResolvedValue({} satisfies LidMappingRows as never)
			const pair = { lid: '111@lid', pn: '222@s.whatsapp.net' }

			await lidMappingStore.storeLIDPNMappings([pair])
			const second = await lidMappingStore.storeLIDPNMappings([pair])

			expect(second).toEqual([])
		})

		it('returns a pair whose LID changed', async () => {
			mockKeys.get.mockResolvedValue({ '222': '999' } satisfies LidMappingRows as never)

			const stored = await lidMappingStore.storeLIDPNMappings([{ lid: '111@lid', pn: '222@s.whatsapp.net' }])

			expect(stored).toEqual([{ pnUser: '222', lidUser: '111' }])
		})

		it('returns only the new pairs from a mixed batch', async () => {
			mockKeys.get.mockResolvedValue({ '222': '111' } satisfies LidMappingRows as never)

			const stored = await lidMappingStore.storeLIDPNMappings([
				{ lid: '111@lid', pn: '222@s.whatsapp.net' },
				{ lid: '333@lid', pn: '444@s.whatsapp.net' }
			])

			expect(stored).toEqual([{ pnUser: '444', lidUser: '333' }])
		})

		it('returns nothing for an empty or invalid batch', async () => {
			expect(await lidMappingStore.storeLIDPNMappings([])).toEqual([])
			expect(await lidMappingStore.storeLIDPNMappings([{ lid: 'bad', pn: 'also-bad' }])).toEqual([])
		})
	})
})
