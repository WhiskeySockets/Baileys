import { shouldWarnMissingParticipantPn } from '../../Utils'

describe('Participant Validation', () => {
	describe('shouldWarnMissingParticipantPn', () => {
		it('should return true when participant is LID and participant_pn is missing', () => {
			const attrs = { participant: '12345@lid' }
			expect(shouldWarnMissingParticipantPn(attrs)).toBe(true)
		})

		it('should return false when participant_pn is present', () => {
			const attrs = {
				participant: '12345@lid',
				participant_pn: '5511999999999@s.whatsapp.net'
			}
			expect(shouldWarnMissingParticipantPn(attrs)).toBe(false)
		})

		it('should return false when participant is PN (not LID)', () => {
			const attrs = { participant: '5511999999999@s.whatsapp.net' }
			expect(shouldWarnMissingParticipantPn(attrs)).toBe(false)
		})

		it('should return false when participant is missing', () => {
			expect(shouldWarnMissingParticipantPn({})).toBe(false)
		})

		it('should handle undefined attributes gracefully', () => {
			const attrs = { participant: undefined }
			expect(shouldWarnMissingParticipantPn(attrs)).toBe(false)
		})
	})
})
