import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto/index.js'
import type { WAMessage, WAMessageKey } from '../Types'
import type { SignalRepositoryWithLIDStore } from '../Types/Signal'
import {
	areJidsSameUser,
	type BinaryNode,
	isHostedLidUser,
	isHostedPnUser,
	isJidBroadcast,
	isJidGroup,
	isJidMetaAI,
	isJidNewsletter,
	isJidStatusBroadcast,
	isLidUser,
	isPnUser,
	//	transferDevice
} from '../WABinary'
import { unpadRandomMax16 } from './generics'
import type { ILogger } from './logger'
import { retry, RetryExhaustedError, type RetryOptions } from './retry-utils'

export const getDecryptionJid = async (sender: string, repository: SignalRepositoryWithLIDStore): Promise<string> => {
	if (isLidUser(sender) || isHostedLidUser(sender)) {
		return sender
	}

	const mapped = await repository.lidMapping.getLIDForPN(sender)
	return mapped || sender
}

const storeMappingFromEnvelope = async (
	stanza: BinaryNode,
	sender: string,
	repository: SignalRepositoryWithLIDStore,
	decryptionJid: string,
	logger: ILogger
): Promise<void> => {
	// TODO: Handle hosted IDs
	const { senderAlt } = extractAddressingContext(stanza)

	if (senderAlt && isLidUser(senderAlt) && isPnUser(sender) && decryptionJid === sender) {
		try {
			await repository.lidMapping.storeLIDPNMappings([{ lid: senderAlt, pn: sender }])
			await repository.migrateSession(sender, senderAlt)
			logger.debug({ sender, senderAlt }, 'Stored LID mapping from envelope')
		} catch (error) {
			logger.warn({ sender, senderAlt, error }, 'Failed to store LID mapping')
		}
	}
}

export const NO_MESSAGE_FOUND_ERROR_TEXT = 'Message absent from node'
export const MISSING_KEYS_ERROR_TEXT = 'Key used already or never filled'
export const BAD_MAC_ERROR_TEXT = 'Bad MAC'

// Retry configuration for failed decryption
export const DECRYPTION_RETRY_CONFIG = {
	maxRetries: 3,
	baseDelayMs: 100,
	sessionRecordErrors: ['No session record', 'SessionError: No session record'],
	corruptedSessionErrors: ['Bad MAC', 'MessageCounterError', MISSING_KEYS_ERROR_TEXT]
}

/**
 * Retry options for decryption operations
 * Uses exponential backoff with jitter to handle transient failures
 */
export const DECRYPTION_RETRY_OPTIONS: RetryOptions = {
	maxAttempts: 3,
	baseDelay: 200, // 200ms base delay
	maxDelay: 2000, // 2s max delay
	backoffStrategy: 'exponential',
	backoffMultiplier: 2,
	jitter: 0.2, // 20% jitter
	collectMetrics: false, // No Prometheus metrics
	operationName: 'message_decryption',
	shouldRetry: (error: Error, attempt: number) => {
		const errorMsg = error?.message || ''

		// Always retry on session record errors (session might be syncing)
		if (DECRYPTION_RETRY_CONFIG.sessionRecordErrors.some(err => errorMsg.includes(err))) {
			return attempt < 3 // Retry up to 3 times
		}

		// Don't retry on corrupted session errors (need cleanup first)
		if (DECRYPTION_RETRY_CONFIG.corruptedSessionErrors.some(err => errorMsg.includes(err))) {
			return false
		}

		// Retry other transient errors
		return attempt < 2 // Retry up to 2 times for unknown errors
	}
}

export const NACK_REASONS = {
	ParsingError: 487,
	UnrecognizedStanza: 488,
	UnrecognizedStanzaClass: 489,
	UnrecognizedStanzaType: 490,
	InvalidProtobuf: 491,
	InvalidHostedCompanionStanza: 493,
	MissingMessageSecret: 495,
	SignalErrorOldCounter: 496,
	MessageDeletedOnPeer: 499,
	UnhandledError: 500,
	UnsupportedAdminRevoke: 550,
	UnsupportedLIDGroup: 551,
	DBOperationFailed: 552,
	CorruptedSession: 553
}

export const SERVER_ERROR_CODES = {
	MissingTcToken: '463',
	SmaxInvalid: '479',
	StaleGroupAddressingMode: '421',
	NewChatMessagesCapped: '475'
}

type MessageType =
	| 'chat'
	| 'peer_broadcast'
	| 'other_broadcast'
	| 'group'
	| 'direct_peer_status'
	| 'other_status'
	| 'newsletter'

export const extractAddressingContext = (stanza: BinaryNode) => {
	let senderAlt: string | undefined
	let recipientAlt: string | undefined

	const sender = stanza.attrs.participant || stanza.attrs.from
	const addressingMode = stanza.attrs.addressing_mode || (sender?.endsWith('lid') ? 'lid' : 'pn')

	if (addressingMode === 'lid') {
		// Message is LID-addressed: sender is LID, extract corresponding PN
		// without device data
		senderAlt = stanza.attrs.participant_pn || stanza.attrs.sender_pn || stanza.attrs.peer_recipient_pn
		recipientAlt = stanza.attrs.recipient_pn
		// with device data
		//if (sender && senderAlt) senderAlt = transferDevice(sender, senderAlt)
	} else {
		// Message is PN-addressed: sender is PN, extract corresponding LID
		// without device data
		senderAlt = stanza.attrs.participant_lid || stanza.attrs.sender_lid || stanza.attrs.peer_recipient_lid
		recipientAlt = stanza.attrs.recipient_lid

		//with device data
		//if (sender && senderAlt) senderAlt = transferDevice(sender, senderAlt)
	}

	return {
		addressingMode,
		senderAlt,
		recipientAlt
	}
}

/**
 * Decode the received node as a message.
 * @note this will only parse the message, not decrypt it
 */
export function decodeMessageNode(stanza: BinaryNode, meId: string, meLid: string) {
	let msgType: MessageType
	let chatId: string
	let author: string
	let fromMe = false

	const msgId = stanza.attrs.id
	const from = stanza.attrs.from
	if (!from) {
		throw new Boom('Missing from attribute in message', { data: stanza })
	}

	const participant: string | undefined = stanza.attrs.participant
	const recipient: string | undefined = stanza.attrs.recipient

	const addressingContext = extractAddressingContext(stanza)

	const isMe = (jid: string) => areJidsSameUser(jid, meId)
	const isMeLid = (jid: string) => areJidsSameUser(jid, meLid)

	if (isPnUser(from) || isLidUser(from) || isHostedLidUser(from) || isHostedPnUser(from)) {
		if (recipient && !isJidMetaAI(recipient)) {
			if (!isMe(from) && !isMeLid(from)) {
				throw new Boom('receipient present, but msg not from me', { data: stanza })
			}

			if (isMe(from) || isMeLid(from)) {
				fromMe = true
			}

			chatId = recipient
		} else {
			chatId = from
		}

		msgType = 'chat'
		author = from
	} else if (isJidGroup(from)) {
		if (!participant) {
			throw new Boom('No participant in group message')
		}

		if (isMe(participant) || isMeLid(participant)) {
			fromMe = true
		}

		msgType = 'group'
		author = participant
		chatId = from
	} else if (isJidBroadcast(from)) {
		if (!participant) {
			throw new Boom('No participant in group message')
		}

		const isParticipantMe = isMe(participant)
		if (isJidStatusBroadcast(from)) {
			msgType = isParticipantMe ? 'direct_peer_status' : 'other_status'
		} else {
			msgType = isParticipantMe ? 'peer_broadcast' : 'other_broadcast'
		}

		fromMe = isParticipantMe
		chatId = from
		author = participant
	} else if (isJidNewsletter(from)) {
		msgType = 'newsletter'
		chatId = from
		author = from

		if (isMe(from) || isMeLid(from)) {
			fromMe = true
		}
	} else {
		throw new Boom('Unknown message type', { data: stanza })
	}

	const pushname = stanza?.attrs?.notify

	const key: WAMessageKey = {
		remoteJid: chatId,
		remoteJidAlt: !isJidGroup(chatId) ? addressingContext.senderAlt : undefined,
		fromMe,
		id: msgId,
		participant,
		participantAlt: isJidGroup(chatId) ? addressingContext.senderAlt : undefined,
		addressingMode: addressingContext.addressingMode,
		...(msgType === 'newsletter' && stanza.attrs.server_id ? { server_id: stanza.attrs.server_id } : {})
	}

	const fullMessage: WAMessage = {
		key,
		category: stanza.attrs.category,
		messageTimestamp: +(stanza.attrs.t ?? 0),
		pushName: pushname,
		broadcast: isJidBroadcast(from)
	}

	if (key.fromMe) {
		fullMessage.status = proto.WebMessageInfo.Status.SERVER_ACK
	}

	return {
		fullMessage,
		author,
		sender: msgType === 'chat' ? author : chatId
	}
}

export const decryptMessageNode = (
	stanza: BinaryNode,
	meId: string,
	meLid: string,
	repository: SignalRepositoryWithLIDStore,
	logger: ILogger,
) => {
	const { fullMessage, author, sender } = decodeMessageNode(stanza, meId, meLid)
	return {
		fullMessage,
		category: stanza.attrs.category,
		author,
		async decrypt() {
			let decryptables = 0
			if (Array.isArray(stanza.content)) {
				for (const { tag, attrs, content } of stanza.content) {
					if (tag === 'verified_name' && content instanceof Uint8Array) {
						const cert = proto.VerifiedNameCertificate.decode(content)
						if (cert.details) {
							const details = proto.VerifiedNameCertificate.Details.decode(cert.details)
							fullMessage.verifiedBizName = details.verifiedName
						}
					}

					if (tag === 'unavailable' && attrs.type === 'view_once') {
						fullMessage.key.isViewOnce = true // TODO: remove from here and add a STUB TYPE
					}

					if (attrs.count && tag === 'enc') {
						fullMessage.retryCount = Number(attrs.count)
					}

					if (tag !== 'enc' && tag !== 'plaintext') {
						continue
					}

					if (!(content instanceof Uint8Array)) {
						continue
					}

					decryptables += 1

					let msgBuffer: Uint8Array

					const decryptionJid = await getDecryptionJid(author, repository)

					if (tag !== 'plaintext') {
						// TODO: Handle hosted devices
						await storeMappingFromEnvelope(stanza, author, repository, decryptionJid, logger)
					}

					try {
						const e2eType = tag === 'plaintext' ? 'plaintext' : attrs.type

						// Wrap decryption in retry logic for transient failures
						switch (e2eType) {
							case 'skmsg':
								msgBuffer = await retry(
									() =>
										repository.decryptGroupMessage({
											group: sender,
											authorJid: author,
											msg: content
										}),
									{
										...DECRYPTION_RETRY_OPTIONS,
										onRetry: (error, attempt, delay) => {
											logger.debug(
												{ error: error.message, attempt, delay, group: sender, author },
												'Retrying group message decryption'
											)
										}
									}
								)
								break
							case 'pkmsg':
							case 'msg':
								msgBuffer = await retry(
									() =>
										repository.decryptMessage({
											jid: decryptionJid,
											type: e2eType,
											ciphertext: content
										}),
									{
										...DECRYPTION_RETRY_OPTIONS,
										onRetry: (error, attempt, delay) => {
											logger.debug(
												{ error: error.message, attempt, delay, jid: decryptionJid, type: e2eType },
												'Retrying message decryption'
											)
										}
									}
								)
								break
							case 'plaintext':
								msgBuffer = content
								break
							default:
								throw new Error(`Unknown e2e type: ${e2eType}`)
						}

						let msg: proto.IMessage = proto.Message.decode(
							e2eType !== 'plaintext' ? unpadRandomMax16(msgBuffer) : msgBuffer
						)
						msg = msg.deviceSentMessage?.message || msg
						if (msg.senderKeyDistributionMessage) {
							//eslint-disable-next-line max-depth
							try {
								await repository.processSenderKeyDistributionMessage({
									authorJid: author,
									item: msg.senderKeyDistributionMessage
								})
							} catch (err) {
								logger.error({ key: fullMessage.key, err }, 'failed to process sender key distribution message')
							}
						}

						if (fullMessage.message) {
							Object.assign(fullMessage.message, msg)
						} else {
							fullMessage.message = msg
						}
					} catch (err: any) {
						// Check if this is a final failure after all retries exhausted
						const isRetryExhausted = err instanceof RetryExhaustedError
						const originalError = isRetryExhausted ? err.originalError : err

						const isCorrupted = isCorruptedSessionError(originalError)
						const isSessionRecord = isSessionRecordError(originalError)

						const errorContext = {
							key: fullMessage.key,
							err: originalError,
							messageType: tag === 'plaintext' ? 'plaintext' : attrs.type,
							sender,
							author,
							decryptionJid,
							isSessionRecordError: isSessionRecord,
							isCorruptedSession: isCorrupted,
							...(isRetryExhausted && { retriesExhausted: true, attempts: err.attempts })
						}

						// Smart logging based on error type and retry status
						if (isCorrupted) {
							// Corrupted session errors are expected and auto-recovered
							// Only log as ERROR if retries exhausted, otherwise WARN on first attempt
							// eslint-disable-next-line max-depth
							if (isRetryExhausted) {
								logger.error(
									errorContext,
									`⚠️ Session corrupted after ${err.attempts} attempts. Retry+pkmsg flow will recover.`
								)
							} else {
								// First occurrence - log as warning since auto-recovery will attempt
								logger.warn(errorContext, '⚠️ Corrupted session detected - attempting auto-recovery')
							}

							// Session cleanup is deferred to retry exhaustion (safety net).
							// The Signal Protocol handles recovery naturally via retry+pkmsg:
							// Bad MAC -> retry receipt -> sender re-sends as pkmsg -> new session.
							// Deleting sessions here (hot path) causes cascading failures when
							// multiple messages from the same contact arrive simultaneously.
							// See: messages-recv.ts sendRetryRequest() for deferred cleanup.
						} else if (isSessionRecord) {
							// Session record errors are transient - retry should handle them
							// eslint-disable-next-line max-depth
							if (isRetryExhausted) {
								logger.error(errorContext, `Failed to decrypt: No session record found after ${err.attempts} attempts`)
							} else {
								logger.debug(errorContext, 'No session record - will retry')
							}
						} else {
							// Unknown/unexpected errors (protobuf, parsing, etc.)
							// These don't go through retry, so always log as ERROR
							// Type-safe explicit logging instead of dynamic property access
							logger.error(
								errorContext,
								isRetryExhausted
									? `Failed to decrypt message after ${err.attempts} attempts`
									: 'Failed to decrypt message'
							)
						}

						fullMessage.messageStubType = proto.WebMessageInfo.StubType.CIPHERTEXT
						// Safe coercion handling edge cases where message might be undefined
						fullMessage.messageStubParameters = [String(originalError?.message ?? originalError)]
					}
				}
			}

			// if nothing was found to decrypt
			if (!decryptables && !fullMessage.key?.isViewOnce) {
				fullMessage.messageStubType = proto.WebMessageInfo.StubType.CIPHERTEXT
				fullMessage.messageStubParameters = [NO_MESSAGE_FOUND_ERROR_TEXT]
			}
		}
	}
}

/**
 * Utility function to check if an error is related to missing session record
 */
function isSessionRecordError(error: any): boolean {
	const errorMessage = error?.message || error?.toString() || ''
	return DECRYPTION_RETRY_CONFIG.sessionRecordErrors.some(errorPattern => errorMessage.includes(errorPattern))
}

/**
 * Utility function to check if an error indicates a corrupted session
 * (Bad MAC, MessageCounterError, Key already used)
 */
export function isCorruptedSessionError(error: any): boolean {
	const errorMessage = error?.message || error?.toString() || ''
	return DECRYPTION_RETRY_CONFIG.corruptedSessionErrors.some(errorPattern => errorMessage.includes(errorPattern))
}

/**
 * Clean up corrupted session for a specific device JID.
 * WABA behavior: DELETE sessions WHERE recipient_id=? AND device_id=?
 * Only deletes the exact device that was corrupted, not all devices.
 *
 * NOTE: This should NOT be called on every Bad MAC error (hot path).
 * Instead, let the retry+pkmsg flow handle recovery naturally (like WhatsApp does).
 * Only call this as a safety net when retries are exhausted.
 */
export async function cleanupCorruptedSession(
	jid: string,
	repository: SignalRepositoryWithLIDStore,
	logger: ILogger
): Promise<number> {
	await repository.deleteSession([jid])
	logger.info({ jid }, 'Cleaned up corrupted session for specific device')
	return 1
}
