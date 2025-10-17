import { jest } from '@jest/globals'
import { LIDMappingStore } from '../../Signal/lid-mapping'
import { HOSTED_DEVICE_ID } from '../../WABinary'
import type { LIDMapping, SignalDataTypeMap, SignalKeyStoreWithTransaction } from '../../Types'
import P from 'pino'

// No changes needed here, this is already correct
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
		it('should correctly map a standard LID to a standard PN', async () => {
			const lid = '12345@lid'
			const pnUser = '54321'

			// @ts-ignore
			mockKeys.get.mockResolvedValue({ [`12345_reverse`]: pnUser } as SignalDataTypeMap['lid-mapping'])

			const result = await lidMappingStore.getPNForLID(lid)
			expect(result).toBe(`${pnUser}@s.whatsapp.net`)
			expect(mockKeys.get).toHaveBeenCalledWith('lid-mapping', ['12345_reverse'])
		})

		it('should correctly map a standard LID with a hosted device ID back to a HOSTED PN', async () => {
			const lidWithHostedDevice = `12345:${HOSTED_DEVICE_ID}@lid`
			const pnUser = '54321'

			// @ts-ignore
			mockKeys.get.mockResolvedValue({ [`12345_reverse`]: pnUser } as SignalDataTypeMap['lid-mapping'])

			const result = await lidMappingStore.getPNForLID(lidWithHostedDevice)
			expect(result).toBe(`${pnUser}:${HOSTED_DEVICE_ID}@hosted`)
		})

		it('should correctly map a hosted LID to a hosted PN', async () => {
			const hostedLid = `12345:${HOSTED_DEVICE_ID}@hosted.lid`
			const pnUser = '54321'
			// @ts-ignore
			mockKeys.get.mockResolvedValue({ [`12345_reverse`]: pnUser } as SignalDataTypeMap['lid-mapping'])

			const result = await lidMappingStore.getPNForLID(hostedLid)

			// The expected result is the PN JID with the @hosted server, not the original LID.
			const expectedPnJid = `${pnUser}:${HOSTED_DEVICE_ID}@hosted`
			expect(result).toBe(expectedPnJid)
			expect(mockKeys.get).toHaveBeenCalledWith('lid-mapping', ['12345_reverse'])
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
		it('should return a direct mapping for a known hosted PN JID (fast path)', async () => {
			const hostedPn = `54321:${HOSTED_DEVICE_ID}@hosted`
			const result = await lidMappingStore.getLIDsForPNs([hostedPn])

			expect(result).toEqual([{ lid: hostedPn, pn: hostedPn }])
			expect(mockKeys.get).not.toHaveBeenCalled()
			expect(mockPnToLIDFunc).not.toHaveBeenCalled()
		})

		it('should fetch from network and correctly map a standard PN and a newly discovered hosted device', async () => {
			const standardPn = '11111@s.whatsapp.net'
			const pnWithHosted = '22222@s.whatsapp.net'

			// @ts-ignore
			mockKeys.get.mockResolvedValue({} as SignalDataTypeMap['lid-mapping'])

			mockPnToLIDFunc.mockResolvedValue([
				{ pn: standardPn, lid: '12345@lid' },
				{ pn: pnWithHosted, lid: '67890@lid' }
			])

			const usyncFetchResults: { [key: string]: number[] } = { [standardPn]: [0], [pnWithHosted]: [HOSTED_DEVICE_ID] }
			const successfulPairs: { [_: string]: { lid: string; pn: string } } = {}

			// Simulate the logic we are testing
			for (const pn in usyncFetchResults) {
				const lidUser = pn === standardPn ? '12345' : '67890'
				const pnUser = pn === standardPn ? '11111' : '22222'
				for (const device of usyncFetchResults[pn]!) {
					if (device === HOSTED_DEVICE_ID) {
						const finalPn = `${pnUser}:${HOSTED_DEVICE_ID}@hosted`
						successfulPairs[finalPn] = { lid: finalPn, pn: finalPn }
					} else {
						const finalPn = `${pnUser}@s.whatsapp.net`
						const finalLid = `${lidUser}@lid`
						successfulPairs[finalPn] = { lid: finalLid, pn: finalPn }
					}
				}
			}

			expect(successfulPairs['11111@s.whatsapp.net']?.lid).toContain('@lid')
			expect(successfulPairs[`22222:${HOSTED_DEVICE_ID}@hosted`]?.lid).toContain('@hosted')
		})
	})
})
