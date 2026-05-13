import { proto } from '../../../WAProto/index.js'
import { aesEncryptGCM, hmacSign } from '../../Utils/crypto'
import { decryptMessageEdit } from '../../Utils/process-message'

describe('decryptMessageEdit', () => {
	const buildEncryptedEdit = (params: {
		messageSecret: Buffer
		msgId: string
		origSender: string
		editor: string
		newContent: proto.IMessage
	}) => {
		// Mirror the wire algorithm of `decryptMessageEdit`:
		//   info = msgId || origSender || editor || "Message Edit" || 0x01
		//   key  = HMAC(HMAC(zeros_32, messageSecret), info)
		//   aad  = empty
		const sign = Buffer.concat([
			Buffer.from(params.msgId),
			Buffer.from(params.origSender),
			Buffer.from(params.editor),
			Buffer.from('Message Edit'),
			new Uint8Array([1])
		])
		const key0 = hmacSign(params.messageSecret, new Uint8Array(32), 'sha256')
		const encKey = hmacSign(sign, key0, 'sha256')

		// Wrap new content in the same shape WhatsApp emits: a `Message` whose
		// `protocolMessage.editedMessage` carries the new content.
		const plaintextMsg: proto.IMessage = {
			protocolMessage: {
				key: { id: params.msgId, fromMe: true, remoteJid: 'g@g.us' },
				type: proto.Message.ProtocolMessage.Type.MESSAGE_EDIT,
				editedMessage: params.newContent,
				timestampMs: Date.now()
			}
		}
		const plaintext = proto.Message.encode(proto.Message.fromObject(plaintextMsg)).finish()

		const iv = Buffer.alloc(12, 0xab)
		const encPayload = aesEncryptGCM(plaintext, encKey, iv, Buffer.alloc(0))

		return {
			encPayload,
			encIv: iv,
			messageSecret: params.messageSecret
		}
	}

	it('round-trips an edited text message through encrypt + decrypt', () => {
		const messageSecret = Buffer.alloc(32, 7)
		const newContent: proto.IMessage = { conversation: 'edited text' }

		const { encPayload, encIv } = buildEncryptedEdit({
			messageSecret,
			msgId: 'AC1234567890ABCDEF',
			origSender: '5511999999999@s.whatsapp.net',
			editor: '5511999999999@s.whatsapp.net',
			newContent
		})

		const decoded = decryptMessageEdit(
			{ encPayload, encIv },
			{
				editEncKey: messageSecret,
				originalMsgId: 'AC1234567890ABCDEF',
				originalSenderJid: '5511999999999@s.whatsapp.net',
				editorJid: '5511999999999@s.whatsapp.net'
			}
		)

		const editedInner = decoded.protocolMessage?.editedMessage
		expect(editedInner).toBeDefined()
		expect(editedInner?.conversation).toBe('edited text')
	})

	it('works with LID-style JIDs (cross-identity edit)', () => {
		const messageSecret = Buffer.alloc(32, 0x42)
		const newContent: proto.IMessage = {
			extendedTextMessage: { text: 'B' }
		}

		const { encPayload, encIv } = buildEncryptedEdit({
			messageSecret,
			msgId: 'AC1191FE0A25A0E319BEA72064819280',
			origSender: '260661598801930@lid',
			editor: '260661598801930@lid',
			newContent
		})

		const decoded = decryptMessageEdit(
			{ encPayload, encIv },
			{
				editEncKey: messageSecret,
				originalMsgId: 'AC1191FE0A25A0E319BEA72064819280',
				originalSenderJid: '260661598801930@lid',
				editorJid: '260661598801930@lid'
			}
		)

		expect(decoded.protocolMessage?.editedMessage?.extendedTextMessage?.text).toBe('B')
	})

	it('throws when the editor JID does not match', () => {
		const messageSecret = Buffer.alloc(32, 7)
		const { encPayload, encIv } = buildEncryptedEdit({
			messageSecret,
			msgId: 'AC1',
			origSender: 'a@s.whatsapp.net',
			editor: 'a@s.whatsapp.net',
			newContent: { conversation: 'x' }
		})

		expect(() =>
			decryptMessageEdit(
				{ encPayload, encIv },
				{
					editEncKey: messageSecret,
					originalMsgId: 'AC1',
					originalSenderJid: 'a@s.whatsapp.net',
					// Tampered editor — GCM tag verify must fail.
					editorJid: 'b@s.whatsapp.net'
				}
			)
		).toThrow()
	})

	it('throws when the message secret does not match', () => {
		const { encPayload, encIv } = buildEncryptedEdit({
			messageSecret: Buffer.alloc(32, 7),
			msgId: 'AC1',
			origSender: 'a@s.whatsapp.net',
			editor: 'a@s.whatsapp.net',
			newContent: { conversation: 'x' }
		})

		expect(() =>
			decryptMessageEdit(
				{ encPayload, encIv },
				{
					editEncKey: Buffer.alloc(32, 8),
					originalMsgId: 'AC1',
					originalSenderJid: 'a@s.whatsapp.net',
					editorJid: 'a@s.whatsapp.net'
				}
			)
		).toThrow()
	})

	it('rejects an IV that is not 12 bytes', () => {
		// WA Web's `WAWebParseMessageEditEncryptedMessageProto` enforces
		// `u.length !== 12`. Mirror the check so failures surface as a clear
		// "Invalid IV length" instead of an opaque GCM error.
		const { encPayload } = buildEncryptedEdit({
			messageSecret: Buffer.alloc(32, 7),
			msgId: 'AC1',
			origSender: 'a@s.whatsapp.net',
			editor: 'a@s.whatsapp.net',
			newContent: { conversation: 'x' }
		})

		for (const badLen of [0, 8, 11, 13, 16]) {
			expect(() =>
				decryptMessageEdit(
					{ encPayload, encIv: Buffer.alloc(badLen, 0xab) },
					{
						editEncKey: Buffer.alloc(32, 7),
						originalMsgId: 'AC1',
						originalSenderJid: 'a@s.whatsapp.net',
						editorJid: 'a@s.whatsapp.net'
					}
				)
			).toThrow(/Invalid MESSAGE_EDIT IV length/)
		}
	})

	it('throws when origSender feeding HKDF is wrong (1:1 self-edit guard)', () => {
		// Regression: in 1:1 self-edits, targetKey.fromMe=true and the
		// `remoteJid` is the OTHER party. Feeding remoteJid into HKDF instead
		// of `meId` derives a different key — GCM tag must fail. This test
		// locks in that the original-sender input is load-bearing.
		const messageSecret = Buffer.alloc(32, 0x11)
		const meId = '5511aaaaaaaaaa@s.whatsapp.net'
		const otherParty = '5511bbbbbbbbbb@s.whatsapp.net'

		const { encPayload, encIv } = buildEncryptedEdit({
			messageSecret,
			msgId: 'AC1',
			origSender: meId, // sender encrypted with their own JID
			editor: meId,
			newContent: { conversation: 'x' }
		})

		// Passing the other party as originalSender (the legacy
		// remoteJid-only path) must fail.
		expect(() =>
			decryptMessageEdit(
				{ encPayload, encIv },
				{
					editEncKey: messageSecret,
					originalMsgId: 'AC1',
					originalSenderJid: otherParty,
					editorJid: meId
				}
			)
		).toThrow()

		// And with the correct meId it succeeds.
		const ok = decryptMessageEdit(
			{ encPayload, encIv },
			{
				editEncKey: messageSecret,
				originalMsgId: 'AC1',
				originalSenderJid: meId,
				editorJid: meId
			}
		)
		expect(ok.protocolMessage?.editedMessage?.conversation).toBe('x')
	})
})
