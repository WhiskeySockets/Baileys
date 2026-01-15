import type { BinaryNode } from '../../WABinary'
import {
	extractLidMappingsFromParticipants,
	extractRevokedMembershipMapping,
	extractDeviceData,
	shouldWarnMissingParticipantPn
} from '../../Utils'

describe('Group Notification Handling - extractLidMappingsFromParticipants', () => {
	it('should extract LID-PN mapping when jid is LID and phone_number is PN', () => {
		const participantNodes: BinaryNode[] = [
			{
				tag: 'participant',
				attrs: {
					jid: '12345@lid',
					phone_number: '5511999999999@s.whatsapp.net'
				}
			}
		]

		const mappings = extractLidMappingsFromParticipants(participantNodes)

		expect(mappings).toHaveLength(1)
		expect(mappings[0]).toEqual({
			lid: '12345@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should extract LID-PN mapping when jid is PN and lid attribute is LID', () => {
		const participantNodes: BinaryNode[] = [
			{
				tag: 'participant',
				attrs: {
					jid: '5511999999999@s.whatsapp.net',
					lid: '12345@lid'
				}
			}
		]

		const mappings = extractLidMappingsFromParticipants(participantNodes)

		expect(mappings).toHaveLength(1)
		expect(mappings[0]).toEqual({
			lid: '12345@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should extract multiple LID-PN mappings from multiple participants', () => {
		const participantNodes: BinaryNode[] = [
			{
				tag: 'participant',
				attrs: {
					jid: '11111@lid',
					phone_number: '5511111111111@s.whatsapp.net'
				}
			},
			{
				tag: 'participant',
				attrs: {
					jid: '5522222222222@s.whatsapp.net',
					lid: '22222@lid'
				}
			},
			{
				tag: 'participant',
				attrs: {
					jid: '33333@lid',
					phone_number: '5533333333333@s.whatsapp.net'
				}
			}
		]

		const mappings = extractLidMappingsFromParticipants(participantNodes)

		expect(mappings).toHaveLength(3)
		expect(mappings).toContainEqual({ lid: '11111@lid', pn: '5511111111111@s.whatsapp.net' })
		expect(mappings).toContainEqual({ lid: '22222@lid', pn: '5522222222222@s.whatsapp.net' })
		expect(mappings).toContainEqual({ lid: '33333@lid', pn: '5533333333333@s.whatsapp.net' })
	})

	it('should not extract mapping when jid is missing', () => {
		const participantNodes: BinaryNode[] = [
			{
				tag: 'participant',
				attrs: {
					phone_number: '5511999999999@s.whatsapp.net'
				}
			}
		]

		const mappings = extractLidMappingsFromParticipants(participantNodes)

		expect(mappings).toHaveLength(0)
	})

	it('should not extract mapping when both jid and phone_number are PN', () => {
		const participantNodes: BinaryNode[] = [
			{
				tag: 'participant',
				attrs: {
					jid: '5511999999999@s.whatsapp.net',
					phone_number: '5522888888888@s.whatsapp.net'
				}
			}
		]

		const mappings = extractLidMappingsFromParticipants(participantNodes)

		expect(mappings).toHaveLength(0)
	})

	it('should not extract mapping when both jid and lid are LID', () => {
		const participantNodes: BinaryNode[] = [
			{
				tag: 'participant',
				attrs: {
					jid: '11111@lid',
					lid: '22222@lid'
				}
			}
		]

		const mappings = extractLidMappingsFromParticipants(participantNodes)

		expect(mappings).toHaveLength(0)
	})

	it('should handle participant with only jid (no mapping info)', () => {
		const participantNodes: BinaryNode[] = [
			{
				tag: 'participant',
				attrs: {
					jid: '5511999999999@s.whatsapp.net'
				}
			}
		]

		const mappings = extractLidMappingsFromParticipants(participantNodes)

		expect(mappings).toHaveLength(0)
	})

	it('should handle mixed participants - some with mappings, some without', () => {
		const participantNodes: BinaryNode[] = [
			{
				tag: 'participant',
				attrs: {
					jid: '11111@lid',
					phone_number: '5511111111111@s.whatsapp.net'
				}
			},
			{
				tag: 'participant',
				attrs: {
					jid: '5522222222222@s.whatsapp.net'
				}
			},
			{
				tag: 'participant',
				attrs: {
					jid: '5533333333333@s.whatsapp.net',
					lid: '33333@lid'
				}
			}
		]

		const mappings = extractLidMappingsFromParticipants(participantNodes)

		expect(mappings).toHaveLength(2)
		expect(mappings).toContainEqual({ lid: '11111@lid', pn: '5511111111111@s.whatsapp.net' })
		expect(mappings).toContainEqual({ lid: '33333@lid', pn: '5533333333333@s.whatsapp.net' })
	})

	it('should handle empty participant list', () => {
		const mappings = extractLidMappingsFromParticipants([])
		expect(mappings).toHaveLength(0)
	})
})

describe('Group Notification Handling - shouldWarnMissingParticipantPn', () => {
	it('should return true when participant is LID and participant_pn is missing', () => {
		const attrs = {
			participant: '12345@lid'
		}

		expect(shouldWarnMissingParticipantPn(attrs)).toBe(true)
	})

	it('should return false when participant is LID and participant_pn is present', () => {
		const attrs = {
			participant: '12345@lid',
			participant_pn: '5511999999999@s.whatsapp.net'
		}

		expect(shouldWarnMissingParticipantPn(attrs)).toBe(false)
	})

	it('should return false when participant is PN (not LID)', () => {
		const attrs = {
			participant: '5511999999999@s.whatsapp.net'
		}

		expect(shouldWarnMissingParticipantPn(attrs)).toBe(false)
	})

	it('should return false when participant is missing', () => {
		const attrs = {}

		expect(shouldWarnMissingParticipantPn(attrs)).toBe(false)
	})

	it('should return false when participant is PN even if participant_pn is missing', () => {
		const attrs = {
			participant: '5511999999999@s.whatsapp.net'
		}

		expect(shouldWarnMissingParticipantPn(attrs)).toBe(false)
	})
})

describe('Device Notification Handling - extractDeviceData', () => {
	it('should extract device data with all attributes', () => {
		const deviceNodes: BinaryNode[] = [
			{
				tag: 'device',
				attrs: {
					jid: '5511999999999:1@s.whatsapp.net',
					lid: '12345:1@lid',
					device_hash: 'abc123hash'
				}
			}
		]

		const devices = extractDeviceData(deviceNodes)

		expect(devices).toHaveLength(1)
		expect(devices[0]).toEqual({
			id: '5511999999999:1@s.whatsapp.net',
			lid: '12345:1@lid',
			hash: 'abc123hash'
		})
	})

	it('should extract multiple devices', () => {
		const deviceNodes: BinaryNode[] = [
			{
				tag: 'device',
				attrs: {
					jid: '5511999999999:0@s.whatsapp.net',
					lid: '12345:0@lid',
					device_hash: 'hash0'
				}
			},
			{
				tag: 'device',
				attrs: {
					jid: '5511999999999:1@s.whatsapp.net',
					lid: '12345:1@lid',
					device_hash: 'hash1'
				}
			},
			{
				tag: 'device',
				attrs: {
					jid: '5511999999999:2@s.whatsapp.net',
					lid: '12345:2@lid',
					device_hash: 'hash2'
				}
			}
		]

		const devices = extractDeviceData(deviceNodes)

		expect(devices).toHaveLength(3)
		expect(devices[0]!.id).toBe('5511999999999:0@s.whatsapp.net')
		expect(devices[1]!.id).toBe('5511999999999:1@s.whatsapp.net')
		expect(devices[2]!.id).toBe('5511999999999:2@s.whatsapp.net')
	})

	it('should handle devices with only jid (lid and hash optional)', () => {
		const deviceNodes: BinaryNode[] = [
			{
				tag: 'device',
				attrs: {
					jid: '5511999999999:1@s.whatsapp.net'
				}
			}
		]

		const devices = extractDeviceData(deviceNodes)

		expect(devices).toHaveLength(1)
		expect(devices[0]).toEqual({
			id: '5511999999999:1@s.whatsapp.net',
			lid: undefined,
			hash: undefined
		})
	})

	it('should filter out devices without jid', () => {
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
					device_hash: 'hash1'
				}
			},
			{
				tag: 'device',
				attrs: {
					jid: '5511999999999:2@s.whatsapp.net'
				}
			}
		]

		const devices = extractDeviceData(deviceNodes)

		expect(devices).toHaveLength(2)
		expect(devices[0]!.id).toBe('5511999999999:0@s.whatsapp.net')
		expect(devices[1]!.id).toBe('5511999999999:2@s.whatsapp.net')
	})

	it('should handle empty device list', () => {
		const devices = extractDeviceData([])
		expect(devices).toHaveLength(0)
	})

	it('should handle device with LID-only JID', () => {
		const deviceNodes: BinaryNode[] = [
			{
				tag: 'device',
				attrs: {
					jid: '12345:0@lid',
					device_hash: 'hashLid'
				}
			}
		]

		const devices = extractDeviceData(deviceNodes)

		expect(devices).toHaveLength(1)
		expect(devices[0]).toEqual({
			id: '12345:0@lid',
			lid: undefined,
			hash: 'hashLid'
		})
	})
})

describe('Revoked Membership Requests - extractRevokedMembershipMapping', () => {
	it('should extract mapping when affectedParticipantLid is LID and affectedParticipantPn is PN', () => {
		const mapping = extractRevokedMembershipMapping(
			'12345@lid',
			'5511999999999@s.whatsapp.net'
		)

		expect(mapping).toEqual({
			lid: '12345@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should extract mapping when affectedParticipantLid is PN and affectedParticipantPn is LID (swapped)', () => {
		const mapping = extractRevokedMembershipMapping(
			'5511999999999@s.whatsapp.net',
			'12345@lid'
		)

		expect(mapping).toEqual({
			lid: '12345@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should return null when both are LID', () => {
		const mapping = extractRevokedMembershipMapping('11111@lid', '22222@lid')
		expect(mapping).toBeNull()
	})

	it('should return null when both are PN', () => {
		const mapping = extractRevokedMembershipMapping(
			'5511111111111@s.whatsapp.net',
			'5522222222222@s.whatsapp.net'
		)
		expect(mapping).toBeNull()
	})
})
