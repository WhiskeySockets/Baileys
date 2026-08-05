import { randomBytes } from 'crypto'
import { proto } from '../../../WAProto/index.js'
import type { WAMessage } from '../../Types'
import { aesEncryptGCM, hmacSign } from '../../Utils/crypto'
import {
	cleanMessage,
	decryptMessageEdit,
	getChatId,
	unwrapSecretEncryptedMessage
} from '../../Utils/process-message'

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

describe('secretEncryptedMessage edits', () => {
	const origMsgId = '3EB0C8712CC1E53869085F'
	const authorJid = '211459040641230@lid'
	const msgEncKey = randomBytes(32)

	const sealEdit = (innerMessage: any, jid = authorJid, key: Buffer = msgEncKey) => {
		const sign = Buffer.concat([
			Buffer.from(origMsgId),
			Buffer.from(jid),
			Buffer.from(jid),
			Buffer.from('Message Edit'),
			new Uint8Array([1])
		])
		const key0 = hmacSign(key, new Uint8Array(32), 'sha256')
		const encKey = hmacSign(sign, key0, 'sha256')
		const plaintext = proto.Message.encode(proto.Message.fromObject(innerMessage)).finish()
		const encIv = randomBytes(12)
		const encPayload = aesEncryptGCM(plaintext, encKey, encIv, new Uint8Array(0))
		return { encPayload, encIv }
	}

	const innerEdit = {
		protocolMessage: {
			key: { remoteJid: authorJid, fromMe: true, id: origMsgId },
			type: proto.Message.ProtocolMessage.Type.MESSAGE_EDIT,
			editedMessage: { conversation: 'edited text' }
		}
	}

	it('round-trips a sealed MESSAGE_EDIT payload', () => {
		const { encPayload, encIv } = sealEdit(innerEdit)
		const decoded = decryptMessageEdit(
			{ encPayload, encIv },
			{ origMsgId, origMsgSenderJid: authorJid, editorJid: authorJid, msgEncKey }
		)
		expect(decoded.protocolMessage?.editedMessage?.conversation).toBe('edited text')
	})

	it('fails on a wrong key', () => {
		const { encPayload, encIv } = sealEdit(innerEdit)
		expect(() =>
			decryptMessageEdit(
				{ encPayload, encIv },
				{ origMsgId, origMsgSenderJid: authorJid, editorJid: authorJid, msgEncKey: randomBytes(32) }
			)
		).toThrow()
	})

	const makeEnvelope = (sealed: { encPayload: Uint8Array; encIv: Uint8Array }): WAMessage => ({
		key: {
			remoteJid: '5511999999999@s.whatsapp.net',
			remoteJidAlt: authorJid,
			fromMe: false,
			id: 'ENVELOPE1'
		},
		message: {
			secretEncryptedMessage: {
				targetMessageKey: { remoteJid: authorJid, fromMe: true, id: origMsgId },
				encPayload: sealed.encPayload,
				encIv: sealed.encIv,
				secretEncType: proto.Message.SecretEncryptedMessage.SecretEncType.MESSAGE_EDIT
			}
		},
		messageTimestamp: 1675888000
	})

	const creds: any = { me: { id: '5513900000000:3@s.whatsapp.net', lid: '999@lid' } }

	it('unwraps in place, trying LID/PN identities', async () => {
		const msg = makeEnvelope(sealEdit(innerEdit))
		await unwrapSecretEncryptedMessage(msg, {
			creds,
			getMessage: async () => ({ messageContextInfo: { messageSecret: msgEncKey } })
		})
		expect(msg.message?.secretEncryptedMessage).toBeFalsy()
		expect(msg.message?.protocolMessage?.editedMessage?.conversation).toBe('edited text')
		expect(msg.message?.protocolMessage?.type).toBe(proto.Message.ProtocolMessage.Type.MESSAGE_EDIT)
	})

	it('accepts a base64 messageSecret from JSON-backed stores', async () => {
		const msg = makeEnvelope(sealEdit(innerEdit))
		await unwrapSecretEncryptedMessage(msg, {
			creds,
			// JSON-backed stores hand the secret back as a base64 string
			getMessage: async () =>
				({ messageContextInfo: { messageSecret: msgEncKey.toString('base64') } }) as unknown as proto.IMessage
		})
		expect(msg.message?.protocolMessage?.editedMessage?.conversation).toBe('edited text')
	})

	it('wraps a bare inner message into a MESSAGE_EDIT protocolMessage', async () => {
		const msg = makeEnvelope(sealEdit({ conversation: 'bare edited text' }))
		await unwrapSecretEncryptedMessage(msg, {
			creds,
			getMessage: async () => ({ messageContextInfo: { messageSecret: msgEncKey } })
		})
		expect(msg.message?.protocolMessage?.type).toBe(proto.Message.ProtocolMessage.Type.MESSAGE_EDIT)
		expect(msg.message?.protocolMessage?.editedMessage?.conversation).toBe('bare edited text')
		expect(msg.message?.protocolMessage?.key?.id).toBe(origMsgId)
	})

	it('leaves the message untouched when the secret is unavailable', async () => {
		const msg = makeEnvelope(sealEdit(innerEdit))
		await unwrapSecretEncryptedMessage(msg, {
			creds,
			getMessage: async () => undefined
		})
		expect(msg.message?.secretEncryptedMessage).toBeTruthy()
	})
})
