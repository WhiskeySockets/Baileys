import type { BinaryNode } from '../../WABinary'
import { extractDeviceData } from '../../Utils'

describe('Devices Event - extractDeviceData', () => {
	it('should extract device data with all attributes from device nodes', () => {
		const deviceNodes: BinaryNode[] = [
			{
				tag: 'device',
				attrs: {
					jid: '5511999999999:0@s.whatsapp.net',
					lid: '12345:0@lid',
					device_hash: 'abc123'
				}
			},
			{
				tag: 'device',
				attrs: {
					jid: '5511999999999:1@s.whatsapp.net',
					lid: '12345:1@lid',
					device_hash: 'def456'
				}
			}
		]

		const deviceData = extractDeviceData(deviceNodes)

		expect(deviceData).toEqual([
			{ id: '5511999999999:0@s.whatsapp.net', lid: '12345:0@lid', hash: 'abc123' },
			{ id: '5511999999999:1@s.whatsapp.net', lid: '12345:1@lid', hash: 'def456' }
		])
	})

	it('should filter out devices without JID', () => {
		const deviceNodes: BinaryNode[] = [
			{
				tag: 'device',
				attrs: {
					jid: '5511999999999:0@s.whatsapp.net',
					lid: '12345:0@lid'
				}
			},
			{
				tag: 'device',
				attrs: {
					lid: '12345:1@lid',
					device_hash: 'invalid'
				}
			}
		]

		const deviceData = extractDeviceData(deviceNodes)

		expect(deviceData).toHaveLength(1)
		expect(deviceData[0]!.id).toBe('5511999999999:0@s.whatsapp.net')
	})

	it('should handle devices with only JID', () => {
		const deviceNodes: BinaryNode[] = [
			{
				tag: 'device',
				attrs: {
					jid: '5511999999999:0@s.whatsapp.net'
				}
			}
		]

		const deviceData = extractDeviceData(deviceNodes)

		expect(deviceData).toEqual([
			{ id: '5511999999999:0@s.whatsapp.net', lid: undefined, hash: undefined }
		])
	})
})
