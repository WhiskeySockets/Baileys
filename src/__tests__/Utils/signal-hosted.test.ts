import { extractDeviceJids } from '../../Utils/signal'
import { WAJIDDomains } from '../../WABinary'

describe('extractDeviceJids Hosted Device Logic', () => {
	const myJid = '11111111111@s.whatsapp.net'
	const myLid = '22222222222@lid'

	it('should correctly convert PN user with device 99 to @hosted domain', () => {
		const targetUser = '33333333333@s.whatsapp.net'
		// Mock a USync result where isHosted is MISSING/false for device 99
		const mockResult = [
			{
				id: targetUser,
				devices: {
					deviceList: [{ id: 99, keyIndex: 1, isHosted: false }]
				}
			}
		]

		const result = extractDeviceJids(mockResult as any, myJid, myLid, false)

		expect(result).toHaveLength(1)
		expect(result[0]!.device).toBe(99)
		// Must be HOSTED (1), not WHATSAPP (0)
		expect(result[0]!.domainType).toBe(WAJIDDomains.HOSTED)
		expect(result[0]!.server).toBe('hosted')
	})

	it('should correctly convert LID user with device 99 to @hosted.lid domain', () => {
		const targetUser = '44444444444@lid'
		const mockResult = [
			{
				id: targetUser,
				devices: {
					deviceList: [{ id: 99, keyIndex: 1, isHosted: false }]
				}
			}
		]

		const result = extractDeviceJids(mockResult as any, myJid, myLid, false)

		expect(result).toHaveLength(1)
		expect(result[0]!.device).toBe(99)
		// Must be HOSTED_LID (129), not LID (1)
		expect(result[0]!.domainType).toBe(WAJIDDomains.HOSTED_LID)
		expect(result[0]!.server).toBe('hosted.lid')
	})

	it('should respect explicit isHosted flag for non-99 devices', () => {
		const targetUser = '55555555555@s.whatsapp.net'
		const mockResult = [
			{
				id: targetUser,
				devices: {
					deviceList: [{ id: 33, keyIndex: 1, isHosted: true }]
				}
			}
		]

		const result = extractDeviceJids(mockResult as any, myJid, myLid, false)

		expect(result).toHaveLength(1)
		expect(result[0]!.device).toBe(33)
		expect(result[0]!.domainType).toBe(WAJIDDomains.HOSTED)
		expect(result[0]!.server).toBe('hosted')
	})

	it('should NOT force hosted domain for non-99 devices without isHosted flag', () => {
		const targetUser = '66666666666@s.whatsapp.net'
		const mockResult = [
			{
				id: targetUser,
				devices: {
					deviceList: [{ id: 33, keyIndex: 1, isHosted: false }]
				}
			}
		]

		const result = extractDeviceJids(mockResult as any, myJid, myLid, false)

		expect(result).toHaveLength(1)
		expect(result[0]!.device).toBe(33)
		// Should remain WHATSAPP (0) when isHosted=false
		expect(result[0]!.domainType).toBe(WAJIDDomains.WHATSAPP)
		expect(result[0]!.server).toBe('s.whatsapp.net')
	})

	it('should handle device 99 with explicit isHosted=true (redundant but safe)', () => {
		const targetUser = '77777777777@lid'
		const mockResult = [
			{
				id: targetUser,
				devices: {
					deviceList: [{ id: 99, keyIndex: 1, isHosted: true }]
				}
			}
		]

		const result = extractDeviceJids(mockResult as any, myJid, myLid, false)

		expect(result).toHaveLength(1)
		expect(result[0]!.device).toBe(99)
		expect(result[0]!.domainType).toBe(WAJIDDomains.HOSTED_LID)
		expect(result[0]!.server).toBe('hosted.lid')
	})
})
