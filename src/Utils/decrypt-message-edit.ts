import { proto } from '../../WAProto/index.js'
import type { SocketConfig, WAMessage, WAMessageKey, WAMessageUpdate } from '../Types'
import { isHostedLidUser, isHostedPnUser, isLidUser, isPnUser, jidNormalizedUser } from '../WABinary'
import { aesDecryptGCM, hmacSign } from './crypto'
import { toNumber } from './generics'
import type { ILogger } from './logger'

type MessageEditContext = {
	originalSenderJid: string
	originalMsgId: string
	messageSecret: Uint8Array
	editorJid: string
}

type MessageEditLIDMapping = {
	getLIDForPN: (pn: string) => Promise<string | null>
	getPNForLID: (lid: string) => Promise<string | null>
}

type ProcessEncryptedMessageEditOptions = {
	message: WAMessage
	secretEncryptedMessage: proto.Message.ISecretEncryptedMessage
	getMessage: SocketConfig['getMessage']
	lidMapping: MessageEditLIDMapping
	logger: ILogger
	meId: string
	meLid?: string
}

const isUserJid = (jid: string | null | undefined): jid is string =>
	!!jid && !!(isPnUser(jid) || isLidUser(jid) || isHostedPnUser(jid) || isHostedLidUser(jid))

const uniqueNormalizedJids = (jids: Array<string | null | undefined>): string[] => [
	...new Set(jids.filter(isUserJid).map(jidNormalizedUser))
]

const expandAddressingCandidates = async (
	jids: Array<string | null | undefined>,
	lidMapping: MessageEditLIDMapping,
	logger: ILogger
): Promise<string[]> => {
	const candidates = uniqueNormalizedJids(jids)
	for (const jid of [...candidates]) {
		try {
			const alternate =
				isLidUser(jid) || isHostedLidUser(jid) ? await lidMapping.getPNForLID(jid) : await lidMapping.getLIDForPN(jid)
			if (isUserJid(alternate)) {
				const normalized = jidNormalizedUser(alternate)
				if (!candidates.includes(normalized)) {
					candidates.push(normalized)
				}
			}
		} catch (err) {
			logger.debug({ err }, 'failed to resolve alternate addressing for message edit')
		}
	}

	return candidates
}

const getLocalOriginalKey = (messageKey: WAMessageKey, originalMsgId: string): WAMessageKey => ({
	...messageKey,
	id: originalMsgId
})

const getEnvelopeAuthorJids = (message: WAMessage, meId: string, meLid?: string) =>
	message.key.fromMe
		? [meId, meLid]
		: [message.key.participant, message.key.participantAlt, message.key.remoteJid, message.key.remoteJidAlt]

const getOriginalSenderJids = (
	message: WAMessage,
	targetKey: WAMessageKey,
	envelopeAuthorJids: Array<string | null | undefined>
) => {
	if (targetKey.fromMe) {
		return envelopeAuthorJids
	}

	return isUserJid(message.key.remoteJid) ? [targetKey.remoteJid] : [targetKey.participant]
}

const decryptWithJidCandidates = (
	secretEncryptedMessage: proto.Message.ISecretEncryptedMessage,
	originalMsgId: string,
	messageSecret: Uint8Array,
	originalSenderCandidates: string[],
	editorCandidates: string[]
): { decoded?: proto.Message; lastError?: unknown } => {
	let lastError: unknown
	for (const originalSenderJid of originalSenderCandidates) {
		for (const editorJid of editorCandidates) {
			try {
				return {
					decoded: decryptMessageEdit(secretEncryptedMessage, {
						originalSenderJid,
						originalMsgId,
						messageSecret,
						editorJid
					})
				}
			} catch (err) {
				lastError = err
			}
		}
	}

	return { lastError }
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

export const processEncryptedMessageEdit = async ({
	message,
	secretEncryptedMessage,
	getMessage,
	lidMapping,
	logger,
	meId,
	meLid
}: ProcessEncryptedMessageEditOptions): Promise<WAMessageUpdate | undefined> => {
	const targetKey = secretEncryptedMessage.targetMessageKey
	if (
		secretEncryptedMessage.secretEncType !== proto.Message.SecretEncryptedMessage.SecretEncType.MESSAGE_EDIT ||
		!targetKey?.id ||
		!secretEncryptedMessage.encPayload?.length ||
		secretEncryptedMessage.encIv?.length !== 12
	) {
		logger.warn(
			{
				hasExpectedType:
					secretEncryptedMessage.secretEncType === proto.Message.SecretEncryptedMessage.SecretEncType.MESSAGE_EDIT,
				hasTargetId: !!targetKey?.id,
				hasPayload: !!secretEncryptedMessage.encPayload?.length,
				ivLength: secretEncryptedMessage.encIv?.length
			},
			'invalid encrypted message edit envelope'
		)
		return
	}

	const originalKey = getLocalOriginalKey(message.key, targetKey.id)
	let originalMessage: proto.IMessage | undefined
	try {
		originalMessage = await getMessage(originalKey)
	} catch (err) {
		logger.warn({ err }, 'failed to retrieve the original message for edit decryption')
		return
	}

	const messageSecret = originalMessage?.messageContextInfo?.messageSecret
	if (!(messageSecret instanceof Uint8Array) || messageSecret.byteLength !== 32) {
		logger.warn(
			{ foundOriginal: !!originalMessage, secretLength: messageSecret?.byteLength },
			'cannot decrypt message edit without the original message secret'
		)
		return
	}

	const envelopeAuthorJids = getEnvelopeAuthorJids(message, meId, meLid)
	const originalSenderJids = getOriginalSenderJids(message, targetKey, envelopeAuthorJids)
	const receivedEditorCandidates = uniqueNormalizedJids(envelopeAuthorJids)
	const receivedOriginalSenderCandidates = uniqueNormalizedJids(originalSenderJids)
	if (!receivedEditorCandidates.length || !receivedOriginalSenderCandidates.length) {
		logger.warn(
			{
				editorCandidateCount: receivedEditorCandidates.length,
				originalSenderCandidateCount: receivedOriginalSenderCandidates.length
			},
			'cannot decrypt message edit without sender addressing'
		)
		return
	}

	let { decoded, lastError } = decryptWithJidCandidates(
		secretEncryptedMessage,
		targetKey.id,
		messageSecret,
		receivedOriginalSenderCandidates,
		receivedEditorCandidates
	)
	if (!decoded) {
		const [expandedOriginalSenderCandidates, expandedEditorCandidates] = await Promise.all([
			expandAddressingCandidates(originalSenderJids, lidMapping, logger),
			expandAddressingCandidates(envelopeAuthorJids, lidMapping, logger)
		])
		const retry = decryptWithJidCandidates(
			secretEncryptedMessage,
			targetKey.id,
			messageSecret,
			expandedOriginalSenderCandidates,
			expandedEditorCandidates
		)
		decoded = retry.decoded
		lastError = retry.lastError
	}

	if (!decoded) {
		logger.warn({ err: lastError }, 'failed to decrypt encrypted message edit')
		return
	}

	const protocolMessage = decoded.protocolMessage
	if (
		protocolMessage?.type !== proto.Message.ProtocolMessage.Type.MESSAGE_EDIT ||
		!protocolMessage.editedMessage ||
		(protocolMessage.key?.id && protocolMessage.key.id !== targetKey.id)
	) {
		logger.warn(
			{
				protocolType: protocolMessage?.type,
				hasEditedMessage: !!protocolMessage?.editedMessage,
				hasMatchingTarget: !protocolMessage?.key?.id || protocolMessage.key.id === targetKey.id
			},
			'decrypted message edit contained an invalid protocol message'
		)
		return
	}

	return {
		key: originalKey,
		update: {
			message: {
				editedMessage: {
					message: protocolMessage.editedMessage
				}
			},
			messageTimestamp: protocolMessage.timestampMs
				? Math.floor(toNumber(protocolMessage.timestampMs) / 1000)
				: message.messageTimestamp
		}
	}
}
