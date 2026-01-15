import type { BinaryNode } from '../../WABinary'
import { extractLidMappingsFromParticipants, extractRevokedMembershipMapping } from '../../Utils'

describe('LID Mapping Storage Integration', () => {
	describe('Group Participant Changes', () => {
		it('should produce correct mappings for storeLIDPNMappings from participant add', () => {
			const participantNodes: BinaryNode[] = [
				{
					tag: 'participant',
					attrs: {
						jid: '12345@lid',
						phone_number: '5511999999999@s.whatsapp.net'
					}
				},
				{
					tag: 'participant',
					attrs: {
						jid: '5522888888888@s.whatsapp.net',
						lid: '67890@lid'
					}
				}
			]

			const mappings = extractLidMappingsFromParticipants(participantNodes)

			expect(mappings).toHaveLength(2)
			expect(mappings).toEqual([
				{ lid: '12345@lid', pn: '5511999999999@s.whatsapp.net' },
				{ lid: '67890@lid', pn: '5522888888888@s.whatsapp.net' }
			])
		})

		it('should produce empty array when no valid mappings exist', () => {
			const participantNodes: BinaryNode[] = [
				{
					tag: 'participant',
					attrs: { jid: '5511999999999@s.whatsapp.net' }
				}
			]

			const mappings = extractLidMappingsFromParticipants(participantNodes)
			expect(mappings).toHaveLength(0)
		})
	})

	describe('Revoked Membership Requests', () => {
		it('should produce correct mapping for storeLIDPNMappings from revoked request', () => {
			const mapping = extractRevokedMembershipMapping('12345@lid', '5511999999999@s.whatsapp.net')

			expect(mapping).toEqual({
				lid: '12345@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})

		it('should handle swapped parameters correctly', () => {
			const mapping = extractRevokedMembershipMapping(
				'5511999999999@s.whatsapp.net',
				'12345@lid'
			)

			expect(mapping).toEqual({
				lid: '12345@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})

		it('should return null for invalid combinations', () => {
			expect(extractRevokedMembershipMapping('11111@lid', '22222@lid')).toBeNull()
			expect(extractRevokedMembershipMapping(
				'5511111111111@s.whatsapp.net',
				'5522222222222@s.whatsapp.net'
			)).toBeNull()
		})
	})
})
