import { createCipheriv, hkdfSync } from 'node:crypto'
import { pino } from 'pino'
import { proto } from '../../../WAProto/index.js'
import type { SignalRepositoryWithLIDStore } from '../../Types'
import { decryptMessageNode } from '../../Utils/decode-wa-message'
import { decryptMessageEdit, isEncryptedMessageEdit } from '../../Utils/decrypt-message-edit'
import { isRealMessage } from '../../Utils/process-message'

const author = '123450001@lid'
const id = 'fictional-original'
const messageSecret = Buffer.alloc(32, 7)
const encIv = Buffer.alloc(12, 8)
const context = { originalSenderJid: author, editorJid: author, originalMsgId: id, messageSecret }
const plaintext = proto.Message.encode({
	protocolMessage: {
		type: proto.Message.ProtocolMessage.Type.MESSAGE_EDIT,
		key: { id, fromMe: true },
		editedMessage: { conversation: 'Fictional correction' }
	}
}).finish()
const key = Buffer.from(
	hkdfSync('sha256', messageSecret, Buffer.alloc(32), Buffer.from(id + author + author + 'Message Edit'), 32)
)
const cipher = createCipheriv('aes-256-gcm', key, encIv)
const encPayload = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()])
const secretEncryptedMessage = {
	secretEncType: proto.Message.SecretEncryptedMessage.SecretEncType.MESSAGE_EDIT,
	targetMessageKey: { id, fromMe: true },
	encIv,
	encPayload
}

describe('encrypted message edits', () => {
	it('authenticates an independently encrypted MESSAGE_EDIT without counting a new message', () => {
		const decoded = decryptMessageEdit(secretEncryptedMessage, context)
		expect(decoded.protocolMessage?.editedMessage?.conversation).toBe('Fictional correction')
		expect(isEncryptedMessageEdit({ secretEncryptedMessage })).toBe(true)
		expect(
			isRealMessage({
				key: { remoteJid: author, id: 'fictional-edit', fromMe: false },
				message: { secretEncryptedMessage }
			})
		).toBe(false)
	})

	it('rejects a wrong author, secret, IV, or modified ciphertext', () => {
		expect(() => decryptMessageEdit(secretEncryptedMessage, { ...context, editorJid: '123450002@lid' })).toThrow()
		expect(() =>
			decryptMessageEdit(secretEncryptedMessage, { ...context, messageSecret: Buffer.alloc(32, 9) })
		).toThrow()
		expect(() => decryptMessageEdit({ ...secretEncryptedMessage, encIv: Buffer.alloc(11) }, context)).toThrow(
			/IV length/
		)
		const corrupt = Buffer.from(encPayload)
		corrupt[0] = corrupt[0]! ^ 1
		expect(() => decryptMessageEdit({ ...secretEncryptedMessage, encPayload: corrupt }, context)).toThrow()
	})
})

it('retains the outer message secret when decoding a linked-device message', async () => {
	const repository = { lidMapping: { getLIDForPN: async () => null } } as unknown as SignalRepositoryWithLIDStore
	const decoded = decryptMessageNode(
		{
			tag: 'message',
			attrs: { id: 'fictional-linked', from: '12025550199@s.whatsapp.net', recipient: author, t: '1700000000' },
			content: [
				{
					tag: 'plaintext',
					attrs: {},
					content: proto.Message.encode({
						messageContextInfo: { messageSecret },
						deviceSentMessage: {
							destinationJid: author,
							message: {
								conversation: 'Fictional phone message',
								messageContextInfo: { deviceListMetadataVersion: 2 }
							}
						}
					}).finish()
				}
			]
		},
		'12025550199@s.whatsapp.net',
		'123450002@lid',
		repository,
		pino({ level: 'silent' })
	)
	await decoded.decrypt()
	expect(decoded.fullMessage.message?.conversation).toBe('Fictional phone message')
	expect(Buffer.from(decoded.fullMessage.message?.messageContextInfo?.messageSecret!)).toEqual(messageSecret)
	expect(decoded.fullMessage.message?.messageContextInfo?.deviceListMetadataVersion).toBe(2)
})
