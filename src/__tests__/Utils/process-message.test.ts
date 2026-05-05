import type { WAMessage } from '../../Types'
import { cleanMessage, getChatId } from '../../Utils/process-message'

const createBaseMessage = (key: Partial<WAMessage['key']>, message?: Partial<WAMessage['message']>): WAMessage => {
	return {
		key: {
			remoteJid: 'chat@s.whatsapp.net',
			fromMe: false,
			id: 'ABC',
			...key
		},
		message: message || { conversation: 'hello' },
		messageTimestamp: 1675888000
	}
}

describe('cleanMessage', () => {
	const meId = 'me@s.whatsapp.net'
	const meLid = 'me@lid'
	const otherUserId = 'other@s.whatsapp.net'

	describe('JID Normalization', () => {
		it('should correctly normalize a standard phone number JID with a device', () => {
			const message = createBaseMessage({
				remoteJid: '1234567890:15@s.whatsapp.net',
				participant: '9876543210:5@s.whatsapp.net'
			})

			cleanMessage(message, meId, meLid)

			expect(message.key.remoteJid).toBe('1234567890@s.whatsapp.net')
			expect(message.key.participant).toBe('9876543210@s.whatsapp.net')
		})

		it('should not modify a group JID', () => {
			const message = createBaseMessage({
				remoteJid: '123456-7890@g.us'
			})

			cleanMessage(message, meId, meLid)

			expect(message.key.remoteJid).toBe('123456-7890@g.us')
		})

		it('should correctly normalize a LID with a device', () => {
			const message = createBaseMessage({
				participant: '1234567890:12@lid'
			})

			cleanMessage(message, meId, meLid)

			expect(message.key.participant).toBe('1234567890@lid')
		})
	})

	describe('Hosted JID Handling', () => {
		it('should correctly normalize a hosted PN JID back to PN form', () => {
			const hostedJid = '1234567890:99@hosted'
			const message = createBaseMessage({
				remoteJid: hostedJid
			})

			cleanMessage(message, meId, meLid)

			expect(message.key.remoteJid).toBe('1234567890@s.whatsapp.net')
		})

		it('should correctly normalize a hosted LID JID back to LID form', () => {
			const hostedLidJid = '9876543210:99@hosted.lid'
			const message = createBaseMessage({
				participant: hostedLidJid
			})

			cleanMessage(message, meId, meLid)

			expect(message.key.participant).toBe('9876543210@lid')
		})
	})

	describe('Reaction Message Perspective', () => {
		it("should correct the perspective of a reaction to another user's message", () => {
			const message = createBaseMessage(
				{ fromMe: false, participant: otherUserId },
				{
					reactionMessage: {
						key: {
							remoteJid: 'chat@s.whatsapp.net',
							fromMe: false,
							id: 'MSG_THEY_SENT',
							participant: otherUserId
						},
						text: '😂'
					}
				}
			)

			cleanMessage(message, meId, meLid)

			const reactionKey = message.message!.reactionMessage!.key!
			expect(reactionKey.fromMe).toBe(false)
		})

		it('should not modify a reaction on a message I sent from another device', () => {
			const message = createBaseMessage(
				{ fromMe: true },
				{
					reactionMessage: {
						key: { remoteJid: 'chat@s.whatsapp.net', fromMe: true, id: 'MSG_I_SENT' },
						text: '❤️'
					}
				}
			)

			const originalReactionKey = { ...message.message!.reactionMessage!.key! }

			cleanMessage(message, meId, meLid)

			const reactionKey = message.message!.reactionMessage!.key!
			expect(reactionKey).toEqual(originalReactionKey)
		})
	})

	describe('Edge Cases', () => {
		it('should not crash if JIDs are undefined', () => {
			const message = createBaseMessage({
				remoteJid: undefined,
				participant: undefined
			})

			expect(() => cleanMessage(message, meId, meLid)).not.toThrow()
		})

		it('should not crash on an empty message object', () => {
			const message = createBaseMessage({}, {})
			expect(() => cleanMessage(message, meId, meLid)).not.toThrow()
		})
	})
})

describe('getChatId', () => {
	it('returns remoteJid for a regular 1:1 chat', () => {
		expect(getChatId({ remoteJid: 'peer@s.whatsapp.net', fromMe: false, id: 'X' })).toBe('peer@s.whatsapp.net')
	})

	it('returns remoteJid for a group chat (broadcast check is false)', () => {
		expect(getChatId({ remoteJid: '120363@g.us', fromMe: false, id: 'X' })).toBe('120363@g.us')
	})

	it('returns remoteJid for status broadcast (status is special-cased to remoteJid)', () => {
		expect(
			getChatId({
				remoteJid: 'status@broadcast',
				participant: 'someone@s.whatsapp.net',
				fromMe: false,
				id: 'X'
			})
		).toBe('status@broadcast')
	})

	it('returns participant for non-status broadcast received from peer', () => {
		expect(
			getChatId({
				remoteJid: '12345@broadcast',
				participant: 'sender@s.whatsapp.net',
				fromMe: false,
				id: 'X'
			})
		).toBe('sender@s.whatsapp.net')
	})

	it('returns remoteJid for non-status broadcast sent by me', () => {
		expect(
			getChatId({
				remoteJid: '12345@broadcast',
				participant: 'me@s.whatsapp.net',
				fromMe: true,
				id: 'X'
			})
		).toBe('12345@broadcast')
	})

	it('throws when remoteJid is missing', () => {
		expect(() => getChatId({ fromMe: false, id: 'X' })).toThrow(/missing remoteJid/)
	})

	it('throws when broadcast key has no participant', () => {
		expect(() => getChatId({ remoteJid: '12345@broadcast', fromMe: false, id: 'X' })).toThrow(/missing participant/)
	})
})
