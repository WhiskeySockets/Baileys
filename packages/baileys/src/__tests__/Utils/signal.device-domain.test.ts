import { describe, expect, it } from '@jest/globals'
import { extractDeviceJids } from '../../Utils/signal'
import { WAJIDDomains } from '../../WABinary'
import type { USyncQueryResultList } from '../../WAUSync/USyncQuery'

/**
 * `domainType` describes one device, not the user. Kept in a variable that
 * outlives the loop, a hosted device leaves it rewritten for every device
 * listed after it — those devices are then addressed on the hosted server and
 * their sessions land under the wrong id.
 */
describe('extractDeviceJids device domains', () => {
	const meJid = '5511900000000:0@s.whatsapp.net'
	const meLid = '99999999999999:0@lid'

	const userWith = (id: string, deviceList: unknown[]): USyncQueryResultList =>
		({ id, devices: { deviceList } }) as unknown as USyncQueryResultList

	it('keeps a plain device on the default domain', () => {
		const result = extractDeviceJids(
			[userWith('5511911111111@s.whatsapp.net', [{ id: 1, keyIndex: 1 }])],
			meJid,
			meLid,
			false
		)

		expect(result).toHaveLength(1)
		expect(result[0]!.domainType).toBe(WAJIDDomains.WHATSAPP)
		expect(result[0]!.server).toBe('s.whatsapp.net')
	})

	it('marks a hosted device as hosted', () => {
		const result = extractDeviceJids(
			[userWith('5511911111111@s.whatsapp.net', [{ id: 1, keyIndex: 1, isHosted: true }])],
			meJid,
			meLid,
			false
		)

		expect(result[0]!.domainType).toBe(WAJIDDomains.HOSTED)
		expect(result[0]!.server).toBe('hosted')
	})

	it('does not carry a hosted device domain over to the devices after it', () => {
		const result = extractDeviceJids(
			[
				userWith('5511911111111@s.whatsapp.net', [
					{ id: 1, keyIndex: 1 },
					{ id: 2, keyIndex: 1, isHosted: true },
					{ id: 3, keyIndex: 1 },
					{ id: 4, keyIndex: 1 }
				])
			],
			meJid,
			meLid,
			false
		)

		const byDevice = new Map(result.map(entry => [entry.device, entry]))
		expect(byDevice.get(1)!.domainType).toBe(WAJIDDomains.WHATSAPP)
		expect(byDevice.get(2)!.domainType).toBe(WAJIDDomains.HOSTED)
		// Devices 3 and 4 are not hosted; before the fix they inherited device 2's.
		expect(byDevice.get(3)!.domainType).toBe(WAJIDDomains.WHATSAPP)
		expect(byDevice.get(4)!.domainType).toBe(WAJIDDomains.WHATSAPP)
		expect(byDevice.get(3)!.server).toBe('s.whatsapp.net')
		expect(byDevice.get(4)!.server).toBe('s.whatsapp.net')
	})

	it('keeps a LID user on the LID domain after a hosted device', () => {
		const result = extractDeviceJids(
			[
				userWith('11111111111111@lid', [
					{ id: 1, keyIndex: 1, isHosted: true },
					{ id: 2, keyIndex: 1 }
				])
			],
			meJid,
			meLid,
			false
		)

		const byDevice = new Map(result.map(entry => [entry.device, entry]))
		expect(byDevice.get(1)!.domainType).toBe(WAJIDDomains.HOSTED_LID)
		expect(byDevice.get(2)!.domainType).toBe(WAJIDDomains.LID)
	})

	it('does not leak a hosted domain across users in the same response', () => {
		const result = extractDeviceJids(
			[
				userWith('5511911111111@s.whatsapp.net', [{ id: 1, keyIndex: 1, isHosted: true }]),
				userWith('5511922222222@s.whatsapp.net', [{ id: 1, keyIndex: 1 }])
			],
			meJid,
			meLid,
			false
		)

		const second = result.find(entry => entry.user === '5511922222222')
		expect(second!.domainType).toBe(WAJIDDomains.WHATSAPP)
	})
})
