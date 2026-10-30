import { proto } from '../../WAProto/index.js'
import { aesDecryptGCM, hmacSign } from './crypto'

type MessageEditContext = {
	originalSenderJid: string
	originalMsgId: string
	messageSecret: Uint8Array
	editorJid: string
}

export const isEncryptedMessageEdit = (
	content: proto.IMessage | null | undefined
): content is proto.IMessage & { secretEncryptedMessage: proto.Message.ISecretEncryptedMessage } =>
	content?.secretEncryptedMessage?.secretEncType === proto.Message.SecretEncryptedMessage.SecretEncType.MESSAGE_EDIT

/**
 * MESSAGE_EDIT uses the same single-block HKDF-SHA256 construction as other
 * encrypted add-ons, but binds the edit identities in the info and uses empty AAD.
 */
export const decryptMessageEdit = (
	{ encPayload, encIv }: proto.Message.ISecretEncryptedMessage,
	{ originalSenderJid, originalMsgId, messageSecret, editorJid }: MessageEditContext
): proto.Message => {
	if (messageSecret.byteLength !== 32) {
		throw new Error(`Invalid MESSAGE_EDIT message secret length: expected 32, got ${messageSecret.byteLength}`)
	}

	if (!encPayload?.length) {
		throw new Error('Invalid MESSAGE_EDIT payload: missing encrypted content')
	}

	if (encIv?.length !== 12) {
		throw new Error(`Invalid MESSAGE_EDIT IV length: expected 12, got ${encIv?.length ?? 0}`)
	}

	const info = Buffer.concat([
		Buffer.from(originalMsgId),
		Buffer.from(originalSenderJid),
		Buffer.from(editorJid),
		Buffer.from('Message Edit'),
		new Uint8Array([1])
	])
	const extractedKey = hmacSign(messageSecret, new Uint8Array(32), 'sha256')
	const decryptionKey = hmacSign(info, extractedKey, 'sha256')
	const plaintext = aesDecryptGCM(encPayload, decryptionKey, encIv, new Uint8Array(0))

	return proto.Message.decode(plaintext)
}
