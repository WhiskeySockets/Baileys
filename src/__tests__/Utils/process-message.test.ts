import { cleanMessage } from '../../Utils/process-message'
import type { WAMessage } from '../../Types'

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
	const otherUserId = 'other@s.whatsapp.net'

	describe('JID Normalization', () => {
		it('should correctly normalize a standard phone number JID with a device', () => {
			const message = createBaseMessage({
				remoteJid: '1234567890:15@s.whatsapp.net',
				participant: '9876543210:5@s.whatsapp.net'
			})

			cleanMessage(message, meId)

			expect(message.key.remoteJid).toBe('1234567890@s.whatsapp.net')
			expect(message.key.participant).toBe('9876543210@s.whatsapp.net')
		})

		it('should not modify a group JID', () => {
			const message = createBaseMessage({
				remoteJid: '123456-7890@g.us'
			})

			cleanMessage(message, meId)

			expect(message.key.remoteJid).toBe('123456-7890@g.us')
		})

		it('should correctly normalize a LID with a device', () => {
			const message = createBaseMessage({
				participant: '1234567890:12@lid'
			})

			cleanMessage(message, meId)

			expect(message.key.participant).toBe('1234567890@lid')
		})
	})

	describe('Hosted JID Handling', () => {
		it('should PRESERVE a hosted PN JID and not normalize it', () => {
			const hostedJid = '1234567890:99@hosted'
			const message = createBaseMessage({
				remoteJid: hostedJid
			})

			cleanMessage(message, meId)

			expect(message.key.remoteJid).toBe(hostedJid)
		})

		it('should PRESERVE a hosted LID JID and not normalize it', () => {
			const hostedLidJid = '9876543210:99@hosted.lid'
			const message = createBaseMessage({
				participant: hostedLidJid
			})

			cleanMessage(message, meId)

			expect(message.key.participant).toBe(hostedLidJid)
		})
	})

	describe('Reaction Message Perspective', () => {
		it('should correct the perspective of a reaction to my message', () => {
			const message = createBaseMessage(
				{ fromMe: false, participant: otherUserId },
				{
					reactionMessage: {
						key: { remoteJid: 'chat@s.whatsapp.net', fromMe: false, id: 'MSG_I_SENT', participant: meId },
						text: '👍'
					}
				}
			)

			cleanMessage(message, meId)

			const reactionKey = message.message!.reactionMessage!.key!
			expect(reactionKey.fromMe).toBe(true)
			expect(reactionKey.remoteJid).toBe(message.key.remoteJid)
			expect(reactionKey.participant).toBe(otherUserId)
		})

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

			cleanMessage(message, meId)

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

			cleanMessage(message, meId)

			const reactionKey = message.message!.reactionMessage!.key!
			expect(reactionKey).toEqual(originalReactionKey)
		})
	})

	describe('Poll Update Message Perspective', () => {
		it('should correct the perspective of a poll update related to my message', () => {
			const message = createBaseMessage(
				{ fromMe: false, participant: otherUserId },
				{
					pollUpdateMessage: {
						pollCreationMessageKey: {
							remoteJid: 'chat@s.whatsapp.net',
							fromMe: false,
							id: 'POLL_I_CREATED',
							participant: meId
						},
						vote: { encIv: new Uint8Array(), encPayload: new Uint8Array() },
						senderTimestampMs: 1675888100
					}
				}
			)

			cleanMessage(message, meId)

			const pollKey = message.message!.pollUpdateMessage!.pollCreationMessageKey!
			expect(pollKey.fromMe).toBe(true)
			expect(pollKey.remoteJid).toBe(message.key.remoteJid)
			expect(pollKey.participant).toBe(otherUserId)
		})
	})

	describe('Edge Cases', () => {
		it('should not crash if JIDs are undefined', () => {
			const message = createBaseMessage({
				remoteJid: undefined,
				participant: undefined
			})

			expect(() => cleanMessage(message, meId)).not.toThrow()
		})

		it('should not crash on an empty message object', () => {
			const message = createBaseMessage({}, {})
			expect(() => cleanMessage(message, meId)).not.toThrow()
		})
	})
})
