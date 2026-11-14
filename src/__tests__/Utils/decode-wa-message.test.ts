import { Boom } from '@hapi/boom'
import P from 'pino'
import { proto } from '../../../WAProto/index.js'
import type { WAMessageKey } from '../../Types'
import type { SignalRepositoryWithLIDStore } from '../../Types/Signal'
import { aesEncryptGCM, hkdf } from '../../Utils/crypto'
import { decodeMessageNode, decryptMessageNode, MISSING_BOT_MESSAGE_SECRET_TEXT } from '../../Utils/decode-wa-message'
import type { BinaryNode } from '../../WABinary'

const ME_ID = '5511999999999@s.whatsapp.net'
const ME_LID = '111111111111111@lid'
const PEER_ID = '5511888888888@s.whatsapp.net'
const GROUP_ID = '120363000000000000@g.us'

const message = (attrs: Record<string, string>): BinaryNode => ({
	tag: 'message',
	attrs: { t: '1700000000', ...attrs },
	content: []
})

const captureThrow = (fn: () => unknown): unknown => {
	try {
		fn()
	} catch (err) {
		return err
	}

	throw new Error('expected function to throw')
}

describe('decodeMessageNode', () => {
	describe('validation', () => {
		it('throws Boom when stanza has no id attribute', () => {
			const stanza = message({ from: PEER_ID })
			const err = captureThrow(() => decodeMessageNode(stanza, ME_ID, ME_LID))
			expect(err).toBeInstanceOf(Boom)
			expect((err as Error).message).toMatch(/missing id/)
		})

		it('throws Boom when stanza has no from attribute', () => {
			const stanza = message({ id: 'MSG_1' })
			const err = captureThrow(() => decodeMessageNode(stanza, ME_ID, ME_LID))
			expect(err).toBeInstanceOf(Boom)
			expect((err as Error).message).toMatch(/missing from/)
		})

		it('throws Boom for an unknown jid type', () => {
			const stanza = message({ id: 'MSG_1', from: 'unknown@server' })
			expect(() => decodeMessageNode(stanza, ME_ID, ME_LID)).toThrow(/Unknown message type/)
		})

		it('throws Boom for group message without participant', () => {
			const stanza = message({ id: 'MSG_1', from: GROUP_ID })
			expect(() => decodeMessageNode(stanza, ME_ID, ME_LID)).toThrow(/No participant/)
		})
	})

	describe('happy paths', () => {
		it('decodes a 1:1 incoming chat message', () => {
			const stanza = message({ id: 'MSG_1', from: PEER_ID })
			const result = decodeMessageNode(stanza, ME_ID, ME_LID)

			expect(result.fullMessage.key.id).toBe('MSG_1')
			expect(result.fullMessage.key.remoteJid).toBe(PEER_ID)
			expect(result.fullMessage.key.fromMe).toBeFalsy()
			expect(result.author).toBe(PEER_ID)
		})

		it('decodes an outgoing chat message (recipient set, from = me)', () => {
			const stanza = message({ id: 'MSG_2', from: ME_ID, recipient: PEER_ID })
			const result = decodeMessageNode(stanza, ME_ID, ME_LID)

			expect(result.fullMessage.key.fromMe).toBe(true)
			expect(result.fullMessage.key.remoteJid).toBe(PEER_ID)
		})

		it('rejects a recipient-tagged message that is not from me', () => {
			const stanza = message({ id: 'MSG_3', from: PEER_ID, recipient: ME_ID })
			expect(() => decodeMessageNode(stanza, ME_ID, ME_LID)).toThrow(/not from me/)
		})

		it('decodes a group message', () => {
			const stanza = message({ id: 'MSG_G', from: GROUP_ID, participant: PEER_ID })
			const result = decodeMessageNode(stanza, ME_ID, ME_LID)

			expect(result.fullMessage.key.remoteJid).toBe(GROUP_ID)
			expect(result.fullMessage.key.participant).toBe(PEER_ID)
			expect(result.author).toBe(PEER_ID)
		})
	})
})

describe('native bot messages', () => {
	const BOT = '867051314767696@bot'
	// Our LID matches the synthetic vector's target sender (15550009999@lid).
	const OWN_LID = '15550009999:3@lid'
	const SECRET = Uint8Array.from({ length: 32 }, (_, i) => i)
	// Message { conversation: "test-ai" } encrypted for reply RESPONSE_FIXTURE_1 under SECRET (synthetic, not user data)
	const REPLY_ENVELOPE = proto.MessageSecretMessage.encode({
		version: 0,
		encIv: Buffer.from('000102030405060708090a0b', 'hex'),
		encPayload: Buffer.from('60b618fee5dc5d068259e089a357c3db42eb3841c3d969d4dd', 'hex')
	}).finish()

	const repository = {
		lidMapping: { getLIDForPN: async () => null }
	} as unknown as SignalRepositoryWithLIDStore
	const logger = P({ level: 'silent' })

	// Encrypt a reply the way the bot does, for the given (bare) target sender.
	const replyEncryptedFor = (targetSender: string, conversation: string) => {
		const iv = Buffer.alloc(12, 1)
		const key = hkdf(hkdf(SECRET, 32, { info: 'Bot Message' }), 32, {
			info: `RESPONSE_FIXTURE_1${targetSender}${BOT}`
		})
		const encPayload = aesEncryptGCM(
			proto.Message.encode({ conversation }).finish(),
			key,
			iv,
			Buffer.from(`RESPONSE_FIXTURE_1\u0000${BOT}`)
		)
		return proto.MessageSecretMessage.encode({ version: 0, encIv: iv, encPayload }).finish()
	}

	const botReply = (from: string, meta: Record<string, string>, envelope = REPLY_ENVELOPE): BinaryNode => ({
		tag: 'message',
		attrs: { id: 'RESPONSE_FIXTURE_1', from, t: '1700000000', type: 'text' },
		content: [
			{ tag: 'meta', attrs: meta },
			{ tag: 'enc', attrs: { v: '2', type: 'msmsg' }, content: envelope }
		]
	})

	const decrypt = async (stanza: BinaryNode, secret: Uint8Array | null = SECRET) => {
		const lookups: WAMessageKey[] = []
		const { fullMessage, decrypt } = decryptMessageNode(stanza, ME_ID, OWN_LID, repository, logger, async key => {
			lookups.push(key)
			return secret
		})
		await decrypt()
		return { fullMessage, lookups }
	}

	it('files a bot message under the bot chat', () => {
		const result = decodeMessageNode(message({ id: 'MSG_B', from: BOT }), ME_ID, ME_LID)

		expect(result.fullMessage.key.remoteJid).toBe(BOT)
		expect(result.fullMessage.key.fromMe).toBe(false)
		expect(result.author).toBe(BOT)
	})

	it("files our other device's copy of a message to the bot under the bot chat", () => {
		const result = decodeMessageNode(
			message({ id: 'MSG_C', from: '111111111111111:2@lid', recipient: BOT }),
			ME_ID,
			ME_LID
		)

		expect(result.fullMessage.key.remoteJid).toBe(BOT)
		expect(result.fullMessage.key.fromMe).toBe(true)
	})

	it('gives the bot chat no alternate JID, even when the copy carries our own', () => {
		const result = decodeMessageNode(
			message({
				id: 'MSG_A',
				from: '111111111111111:2@lid',
				recipient: BOT,
				sender_pn: '5511999999999:2@s.whatsapp.net'
			}),
			ME_ID,
			ME_LID
		)

		expect(result.fullMessage.key.remoteJid).toBe(BOT)
		expect(result.fullMessage.key.remoteJidAlt).toBeUndefined()
	})

	it('keeps a message from someone else that names the bot as recipient in their chat', () => {
		const result = decodeMessageNode(message({ id: 'MSG_T', from: PEER_ID, recipient: BOT }), ME_ID, ME_LID)

		expect(result.fullMessage.key.remoteJid).toBe(PEER_ID)
		expect(result.fullMessage.key.fromMe).toBe(false)
	})

	it('decrypts a bot reply with the secret of the message it answers, without unpadding', async () => {
		const { fullMessage, lookups } = await decrypt(botReply(BOT, { target_id: 'PROMPT_1' }))

		expect(lookups).toEqual([{ remoteJid: BOT, id: 'PROMPT_1', fromMe: true }])
		expect(fullMessage.messageStubType).toBeUndefined()
		expect(fullMessage.message?.conversation).toBe('test-ai')
	})

	it('derives the key from target_sender_jid when the reply names it, not from our LID', async () => {
		const { fullMessage } = await decrypt(
			botReply(BOT, { target_id: 'PROMPT_1', target_sender_jid: ME_ID }, replyEncryptedFor(ME_ID, 'answer to our PN'))
		)

		expect(fullMessage.message?.conversation).toBe('answer to our PN')
	})

	it('accepts a target sender given as our hosted LID', async () => {
		const { fullMessage, lookups } = await decrypt(
			botReply(
				BOT,
				{ target_id: 'PROMPT_1', target_sender_jid: '15550009999:99@hosted.lid' },
				replyEncryptedFor('15550009999@hosted.lid', 'answer to our hosted LID')
			)
		)

		expect(lookups).toEqual([{ remoteJid: BOT, id: 'PROMPT_1', fromMe: true }])
		expect(fullMessage.message?.conversation).toBe('answer to our hosted LID')
	})

	it('leaves a ciphertext stub when the secret is not found', async () => {
		const { fullMessage } = await decrypt(botReply(BOT, { target_id: 'PROMPT_1' }), null)

		expect(fullMessage.message).toBeUndefined()
		expect(fullMessage.messageStubType).toBe(proto.WebMessageInfo.StubType.CIPHERTEXT)
		expect(fullMessage.messageStubParameters).toEqual([MISSING_BOT_MESSAGE_SECRET_TEXT])
	})

	it('does not look up a secret for a reply to someone else, or msmsg from a non-bot', async () => {
		const toOther = await decrypt(botReply(BOT, { target_id: 'PROMPT_1', target_sender_jid: '15550008888@lid' }))
		const fromPeer = await decrypt(botReply(PEER_ID, { target_id: 'PROMPT_1' }))

		for (const { fullMessage, lookups } of [toOther, fromPeer]) {
			expect(lookups).toEqual([])
			expect(fullMessage.message).toBeUndefined()
			expect(fullMessage.messageStubType).toBe(proto.WebMessageInfo.StubType.CIPHERTEXT)
		}
	})

	it('does not decrypt with a secret that does not match', async () => {
		const { fullMessage } = await decrypt(botReply(BOT, { target_id: 'PROMPT_1' }), new Uint8Array(32).fill(7))

		expect(fullMessage.message).toBeUndefined()
		expect(fullMessage.messageStubType).toBe(proto.WebMessageInfo.StubType.CIPHERTEXT)
	})
})
