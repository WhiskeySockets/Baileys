import { buildRetryResendAddressing } from '../../Socket/messages-send'

describe('buildRetryResendAddressing', () => {
	const meId = '5511999999999:4@s.whatsapp.net'
	const meLid = '123456789012345:4@lid'

	it('sends a group retry to the group with the device as participant', () => {
		expect(buildRetryResendAddressing('120363000000000000@g.us', '987654321098765:2@lid', meId, meLid)).toEqual({
			to: '120363000000000000@g.us',
			participant: '987654321098765:2@lid'
		})
	})

	it('names the chat as recipient for one of our own PN devices', () => {
		expect(
			buildRetryResendAddressing('5511888888888@s.whatsapp.net', '5511999999999:7@s.whatsapp.net', meId, meLid)
		).toEqual({
			to: '5511999999999:7@s.whatsapp.net',
			recipient: '5511888888888@s.whatsapp.net'
		})
	})

	it('names the chat as recipient for one of our own LID devices', () => {
		expect(buildRetryResendAddressing('222222222222222@lid', '123456789012345:7@lid', meId, meLid)).toEqual({
			to: '123456789012345:7@lid',
			recipient: '222222222222222@lid'
		})
	})

	it('sends a retry for another user straight to their device', () => {
		expect(buildRetryResendAddressing('222222222222222@lid', '222222222222222:3@lid', meId, meLid)).toEqual({
			to: '222222222222222:3@lid'
		})
	})

	it('does not treat a LID device as ours when our LID is unknown', () => {
		expect(buildRetryResendAddressing('222222222222222@lid', '123456789012345:7@lid', meId, undefined)).toEqual({
			to: '123456789012345:7@lid'
		})
	})
})
