import { proto } from '../../../WAProto/index.js'
import {
	decryptBotReply,
	decryptBotReplyNode,
	getBotReplyDecryptionIds,
	getBotReplyInfo
} from '../../Utils/bot-message'
import { aesEncryptGCM, hkdf } from '../../Utils/crypto'
import type { BinaryNode } from '../../WABinary'

const BOT = '867051314767696@bot'
const TARGET_SENDER = '15550009999@lid'

// Synthetic vector (not user data): Message { conversation: "test-ai" } encrypted
// for a reply with id RESPONSE_FIXTURE_1 under the secret 00..1f.
const VECTOR = {
	messageSecret: Uint8Array.from({ length: 32 }, (_, i) => i),
	messageId: 'RESPONSE_FIXTURE_1',
	encIv: Buffer.from('000102030405060708090a0b', 'hex'),
	encPayload: Buffer.from('60b618fee5dc5d068259e089a357c3db42eb3841c3d969d4dd', 'hex'),
	plaintext: Buffer.from('0a07746573742d6169', 'hex')
}

const encryptReply = (messageId: string, plaintext: Uint8Array) => {
	const botSecret = hkdf(VECTOR.messageSecret, 32, { info: 'Bot Message' })
	const key = hkdf(botSecret, 32, { info: `${messageId}${TARGET_SENDER}${BOT}` })
	const encPayload = aesEncryptGCM(plaintext, key, VECTOR.encIv, Buffer.from(`${messageId}\u0000${BOT}`))
	return proto.MessageSecretMessage.encode({ version: 0, encIv: VECTOR.encIv, encPayload }).finish()
}

describe('decryptBotReply', () => {
	it('decrypts the reference vector', () => {
		const plaintext = decryptBotReply({ ...VECTOR, targetSenderJid: TARGET_SENDER, botJid: BOT })
		expect(Buffer.from(plaintext)).toEqual(VECTOR.plaintext)
		expect(proto.Message.decode(plaintext).conversation).toBe('test-ai')
	})

	it('derives the key from the bare JIDs', () => {
		const plaintext = decryptBotReply({ ...VECTOR, targetSenderJid: '15550009999:3@lid', botJid: BOT })
		expect(Buffer.from(plaintext)).toEqual(VECTOR.plaintext)
	})

	it('rejects the wrong message id, sender, bot or a tampered payload', () => {
		const inputs = { ...VECTOR, targetSenderJid: TARGET_SENDER, botJid: BOT }
		expect(() => decryptBotReply({ ...inputs, messageId: 'RESPONSE_FIXTURE_2' })).toThrow()
		expect(() => decryptBotReply({ ...inputs, targetSenderJid: '15550009998@lid' })).toThrow()
		expect(() => decryptBotReply({ ...inputs, botJid: '1807055946647697@bot' })).toThrow()
		const tampered = Buffer.from(VECTOR.encPayload)
		tampered[0] = tampered[0]! ^ 1
		expect(() => decryptBotReply({ ...inputs, encPayload: tampered })).toThrow()
	})
})

describe('getBotReplyDecryptionIds', () => {
	it('uses the stanza id for a first piece and a full replacement', () => {
		expect(getBotReplyDecryptionIds('REPLY_2', { editType: 'first' })).toEqual(['REPLY_2'])
		expect(getBotReplyDecryptionIds('REPLY_2', { editType: 'full', editTargetId: 'REPLY_1' })).toEqual(['REPLY_2'])
	})

	it('tries the edited reply id first for inner and last edits', () => {
		expect(getBotReplyDecryptionIds('REPLY_2', { editType: 'inner', editTargetId: 'REPLY_1' })).toEqual([
			'REPLY_1',
			'REPLY_2'
		])
		expect(getBotReplyDecryptionIds('REPLY_2', { editType: 'last', editTargetId: 'REPLY_1' })).toEqual([
			'REPLY_1',
			'REPLY_2'
		])
	})
})

describe('getBotReplyInfo', () => {
	it('reads the meta and bot children of the stanza', () => {
		const stanza: BinaryNode = {
			tag: 'message',
			attrs: { id: 'REPLY_2', from: BOT },
			content: [
				{ tag: 'meta', attrs: { target_id: 'PROMPT_1', target_sender_jid: TARGET_SENDER } },
				{ tag: 'bot', attrs: { edit: 'inner', edit_target_id: 'REPLY_1' } }
			]
		}
		expect(getBotReplyInfo(stanza)).toEqual({
			targetId: 'PROMPT_1',
			targetSenderJid: TARGET_SENDER,
			editType: 'inner',
			editTargetId: 'REPLY_1'
		})
	})
})

describe('decryptBotReplyNode', () => {
	const plaintext = proto.Message.encode({ conversation: 'streamed' }).finish()
	const decrypt = (content: Uint8Array, stanzaId: string, editType?: string) =>
		decryptBotReplyNode({
			content,
			stanzaId,
			info: { targetId: 'PROMPT_1', editType, editTargetId: 'REPLY_1' },
			messageSecret: VECTOR.messageSecret,
			targetSenderJid: TARGET_SENDER,
			botJid: BOT
		})

	it('decrypts an inner edit encrypted with the id of the reply it edits', () => {
		expect(Buffer.from(decrypt(encryptReply('REPLY_1', plaintext), 'REPLY_2', 'inner'))).toEqual(Buffer.from(plaintext))
	})

	it('falls back to the stanza id when the edited reply id does not authenticate', () => {
		expect(Buffer.from(decrypt(encryptReply('REPLY_2', plaintext), 'REPLY_2', 'last'))).toEqual(Buffer.from(plaintext))
	})

	it('fails when no candidate id authenticates', () => {
		expect(() => decrypt(encryptReply('OTHER', plaintext), 'REPLY_2', 'inner')).toThrow()
	})
})
