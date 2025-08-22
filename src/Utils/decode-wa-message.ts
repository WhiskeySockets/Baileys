import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto/index.js'
import type { SignalRepository, WAMessage, WAMessageKey } from '../Types'
import {
	areJidsSameUser,
	type BinaryNode,
	isJidBroadcast,
	isJidGroup,
	isJidMetaIa,
	isJidNewsletter,
	isJidStatusBroadcast,
	isJidUser,
	isLidUser
} from '../WABinary'
import { unpadRandomMax16 } from './generics'
import type { ILogger } from './logger'
import { fetchPreKeys } from './signal'

export const NO_MESSAGE_FOUND_ERROR_TEXT = 'Message absent from node'
export const MISSING_KEYS_ERROR_TEXT = 'Key used already or never filled'

// Retry configuration for failed decryption (inspired by whatsmeow)
export const DECRYPTION_RETRY_CONFIG = {
	maxRetries: 5, // Maximum retry attempts (same as whatsmeow)
	baseDelayMs: 100,
	sessionRecreateTimeout: 60 * 60 * 1000, // 1 hour timeout for session recreation
	requestFromPhoneDelay: 5000, // 5 seconds delay before requesting from phone
	sessionRecordErrors: [
		'No session record',
		'Session record not found',
		'SessionError',
		'Session Record error',
		'No matching sessions',
		'No session found',
		'No SenderKeyRecord found',
		'Signature verification failed'
	],
	macErrors: ['Bad MAC', 'MAC verification failed', 'Bad MAC Error', 'Decryption failed']
}

// Message retry tracking (inspired by whatsmeow)
export interface MessageRetryState {
	retryCount: number
	lastRetryTime: number
	sessionRecreateHistory: Map<string, number>
}

// Global retry state management
const messageRetryStates = new Map<string, MessageRetryState>()
const sessionRecreateHistory = new Map<string, number>()

// Recent messages cache for retry receipts (whatsmeow-inspired)
const RECENT_MESSAGES_SIZE = 512
export interface RecentMessage {
	message: proto.IMessage
	timestamp: number
}

export interface RecentMessageKey {
	to: string
	id: string
}

// Circular buffer for recent messages (whatsmeow pattern)
const recentMessagesMap = new Map<string, RecentMessage>()
const recentMessagesList: RecentMessageKey[] = new Array(RECENT_MESSAGES_SIZE)
	.fill(null)
	.map(() => ({ to: '', id: '' }))
let recentMessagesPtr = 0

// Internal retry counter per sender (whatsmeow uses 10 max)
const incomingRetryRequestCounter = new Map<string, number>()

// Session recreation interfaces (whatsmeow-inspired)
export interface SessionRecreationContext {
	authState: any
	logger: any
	signalRepository: any
	query: (node: BinaryNode) => Promise<BinaryNode>
}

// Smart retry control functions (inspired by whatsmeow)
export async function shouldRecreateSession(
	jid: string,
	retryCount: number,
	context?: SessionRecreationContext
): Promise<{ reason: string; recreate: boolean; shouldFetchPreKeys: boolean }> {
	const now = Date.now()

	// Check if we have a session with this JID (whatsmeow logic)
	if (context?.signalRepository) {
		try {
			const hasSession = await context.signalRepository.hasSession(jid)
			if (!hasSession) {
				sessionRecreateHistory.set(jid, now)
				return {
					reason: "we don't have a Signal session with them",
					recreate: true,
					shouldFetchPreKeys: true
				}
			}
		} catch (error: any) {
			context.logger?.warn({ jid, error: error.message }, 'Failed to check session existence')
		}
	}

	// Don't recreate if retry count < 2 (whatsmeow logic)
	if (retryCount < 2) {
		return { reason: '', recreate: false, shouldFetchPreKeys: false }
	}

	// Check timeout for recreation (whatsmeow uses 1 hour)
	const lastRecreate = sessionRecreateHistory.get(jid) || 0
	if (now - lastRecreate > DECRYPTION_RETRY_CONFIG.sessionRecreateTimeout) {
		sessionRecreateHistory.set(jid, now)
		return {
			reason: 'retry count >= 2 and over an hour since last recreation',
			recreate: true,
			shouldFetchPreKeys: true
		}
	}

	return { reason: '', recreate: false, shouldFetchPreKeys: false }
}

/**
 * Execute session recreation by fetching prekeys
 * Inspired by whatsmeow's session recreation logic
 */
export async function executeSessionRecreation(jid: string, context: SessionRecreationContext): Promise<boolean> {
	try {
		context.logger?.debug({ jid }, 'executing session recreation with prekey fetch')

		// Use the new fetchPreKeys function
		const success = await fetchPreKeys([jid], context.query, context.signalRepository, context.logger)

		if (success) {
			context.logger?.debug({ jid }, 'session recreation completed successfully')
		} else {
			context.logger?.warn({ jid }, 'session recreation failed')
		}

		return success
	} catch (error: any) {
		context.logger?.error({ jid, error: error.message }, 'session recreation failed with error')
		return false
	}
}

export function getMessageRetryState(messageKey: string): MessageRetryState {
	if (!messageRetryStates.has(messageKey)) {
		messageRetryStates.set(messageKey, {
			retryCount: 0,
			lastRetryTime: 0,
			sessionRecreateHistory: new Map()
		})
	}

	return messageRetryStates.get(messageKey)!
}

export function incrementRetryCount(messageKey: string): number {
	const state = getMessageRetryState(messageKey)
	state.retryCount++
	state.lastRetryTime = Date.now()
	return state.retryCount
}

export function shouldStopRetrying(messageKey: string): boolean {
	const state = getMessageRetryState(messageKey)
	return state.retryCount >= DECRYPTION_RETRY_CONFIG.maxRetries
}

// Recent message management functions (whatsmeow-compatible)
export function addRecentMessage(to: string, id: string, message: proto.IMessage): void {
	const key = `${to}_${id}`

	// Remove old entry if it exists (circular buffer pattern from whatsmeow)
	if (recentMessagesList[recentMessagesPtr]?.id !== '') {
		const oldEntry = recentMessagesList[recentMessagesPtr]!
		const oldKey = `${oldEntry.to}_${oldEntry.id}`
		recentMessagesMap.delete(oldKey)
	}

	// Add new entry (store the actual proto.IMessage like whatsmeow)
	recentMessagesMap.set(key, {
		message,
		timestamp: Date.now()
	})

	recentMessagesList[recentMessagesPtr] = { to, id }
	recentMessagesPtr = (recentMessagesPtr + 1) % RECENT_MESSAGES_SIZE
}

export function getRecentMessage(to: string, id: string): RecentMessage | null {
	const key = `${to}_${id}`
	return recentMessagesMap.get(key) || null
}

export async function getMessageForRetry(
	to: string,
	id: string,
	getMessage?: (key: WAMessageKey) => Promise<proto.IMessage | undefined>
): Promise<proto.IMessage | null> {
	// First, try to get from recent messages cache (whatsmeow pattern)
	const recentMsg = getRecentMessage(to, id)
	if (recentMsg?.message) {
		return Promise.resolve(recentMsg.message)
	}

	// If not in cache and getMessage callback is provided, use it
	if (getMessage) {
		const msg = await getMessage({ remoteJid: to, id })
		return msg || null
	}

	return Promise.resolve(null)
}

// Internal retry counter management (whatsmeow pattern)
export function incrementIncomingRetryCounter(senderJid: string, messageId: string): number {
	const key = `${senderJid}_${messageId}`
	const current = incomingRetryRequestCounter.get(key) || 0
	const newCount = current + 1
	incomingRetryRequestCounter.set(key, newCount)
	return newCount
}

export function shouldDropRetryRequest(senderJid: string, messageId: string): boolean {
	const key = `${senderJid}_${messageId}`
	const count = incomingRetryRequestCounter.get(key) || 0
	return count >= 10 // whatsmeow limit
}

export function cleanupOldRetryStates(): void {
	const now = Date.now()
	const maxAge = 24 * 60 * 60 * 1000 // 24 hours

	// Clean up old message retry states
	for (const [key, state] of messageRetryStates.entries()) {
		if (now - state.lastRetryTime > maxAge) {
			messageRetryStates.delete(key)
		}
	}

	// Clean up old session recreate history
	for (const [jid, timestamp] of sessionRecreateHistory.entries()) {
		if (now - timestamp > maxAge) {
			sessionRecreateHistory.delete(jid)
		}
	}

	// Clean up old recent messages
	for (const [key, recentMsg] of recentMessagesMap.entries()) {
		if (now - recentMsg.timestamp > maxAge) {
			recentMessagesMap.delete(key)
		}
	}

	// Clean up old retry counters
	for (const [key] of incomingRetryRequestCounter.entries()) {
		// Clean up counters older than 1 hour
		if (Math.random() < 0.1) {
			// Probabilistic cleanup to avoid performance issues
			incomingRetryRequestCounter.delete(key)
		}
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
	DBOperationFailed: 552
}

type MessageType =
	| 'chat'
	| 'peer_broadcast'
	| 'other_broadcast'
	| 'group'
	| 'direct_peer_status'
	| 'other_status'
	| 'newsletter'

/**
 * Decode the received node as a message.
 * @note this will only parse the message, not decrypt it
 */
export function decodeMessageNode(stanza: BinaryNode, meId: string, meLid: string) {
	let msgType: MessageType
	let chatId: string
	let author: string

	const msgId = stanza.attrs.id
	const from = stanza.attrs.from
	const participant: string | undefined = stanza.attrs.participant
	const recipient: string | undefined = stanza.attrs.recipient

	const isMe = (jid: string) => areJidsSameUser(jid, meId)
	const isMeLid = (jid: string) => areJidsSameUser(jid, meLid)

	if (isJidUser(from) || isLidUser(from)) {
		if (recipient && !isJidMetaIa(recipient)) {
			if (!isMe(from!) && !isMeLid(from!)) {
				throw new Boom('receipient present, but msg not from me', { data: stanza })
			}

			chatId = recipient
		} else {
			chatId = from!
		}

		msgType = 'chat'
		author = from!
	} else if (isJidGroup(from)) {
		if (!participant) {
			throw new Boom('No participant in group message')
		}

		msgType = 'group'
		author = participant
		chatId = from!
	} else if (isJidBroadcast(from)) {
		if (!participant) {
			throw new Boom('No participant in group message')
		}

		const isParticipantMe = isMe(participant)
		if (isJidStatusBroadcast(from!)) {
			msgType = isParticipantMe ? 'direct_peer_status' : 'other_status'
		} else {
			msgType = isParticipantMe ? 'peer_broadcast' : 'other_broadcast'
		}

		chatId = from!
		author = participant
	} else if (isJidNewsletter(from)) {
		msgType = 'newsletter'
		chatId = from!
		author = from!
	} else {
		throw new Boom('Unknown message type', { data: stanza })
	}

	const fromMe = (isLidUser(from) ? isMeLid : isMe)((stanza.attrs.participant || stanza.attrs.from)!)
	const pushname = stanza?.attrs?.notify

	const key: WAMessageKey = {
		remoteJid: chatId,
		fromMe,
		id: msgId,
		senderLid: stanza?.attrs?.sender_lid,
		senderPn: stanza?.attrs?.sender_pn,
		participant,
		participantPn: stanza?.attrs?.participant_pn,
		participantLid: stanza?.attrs?.participant_lid,
		...(msgType === 'newsletter' && stanza.attrs.server_id ? { server_id: stanza.attrs.server_id } : {})
	}

	const fullMessage: WAMessage = {
		key,
		messageTimestamp: +stanza.attrs.t!,
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
	repository: SignalRepository,
	logger: ILogger,
	sendRetryRequestFn?: (node: BinaryNode, forceIncludeKeys: boolean) => Promise<void>,
	sessionContext?: SessionRecreationContext
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
						const details = proto.VerifiedNameCertificate.Details.decode(cert.details!)
						fullMessage.verifiedBizName = details.verifiedName
					}

					if (tag === 'unavailable' && attrs.type === 'view_once') {
						fullMessage.key.isViewOnce = true
					}

					if (tag !== 'enc' && tag !== 'plaintext') {
						continue
					}

					if (!(content instanceof Uint8Array)) {
						continue
					}

					decryptables += 1

					let msgBuffer: Uint8Array

					try {
						const e2eType = tag === 'plaintext' ? 'plaintext' : attrs.type

						// Use retry mechanism for encrypted messages
						if (e2eType !== 'plaintext') {
							// Create session context with repository access
							const contextWithRepo = sessionContext
								? {
										...sessionContext,
										signalRepository: repository
									}
								: undefined

							msgBuffer = await decryptWithRetry(
								async () => {
									switch (e2eType) {
										case 'skmsg':
											return await repository.decryptGroupMessage({
												group: sender,
												authorJid: author,
												msg: content
											})
										case 'pkmsg':
										case 'msg':
											const user = isJidUser(sender) ? sender : author
											return await repository.decryptMessage({
												jid: user,
												type: e2eType,
												ciphertext: content
											})
										default:
											throw new Error(`Unknown e2e type: ${e2eType}`)
									}
								},
								logger,
								fullMessage.key,
								e2eType!,
								stanza,
								sendRetryRequestFn,
								contextWithRepo
							)
						} else {
							msgBuffer = content
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
						// Enhanced error logging with more context
						const errorContext = {
							key: fullMessage.key,
							err,
							messageType: tag === 'plaintext' ? 'plaintext' : attrs.type,
							sender,
							author,
							isSessionRecordError: isSessionRecordError(err)
						}

						logger.error(errorContext, 'failed to decrypt message')
						fullMessage.messageStubType = proto.WebMessageInfo.StubType.CIPHERTEXT
						fullMessage.messageStubParameters = [err.message]
					}
				}
			}

			// if nothing was found to decrypt
			if (!decryptables) {
				fullMessage.messageStubType = proto.WebMessageInfo.StubType.CIPHERTEXT
				fullMessage.messageStubParameters = [NO_MESSAGE_FOUND_ERROR_TEXT]
			}
		}
	}
}

/**
 * Utility function to check if an error is specifically a MAC error
 */
export function isMacError(error: any): boolean {
	const errorMessage = error?.message || error?.toString() || ''
	return DECRYPTION_RETRY_CONFIG.macErrors.some(errorPattern => errorMessage.includes(errorPattern))
}

/**
 * Utility function to check if an error is related to missing session record
 */
export function isSessionRecordError(error: any): boolean {
	const errorMessage = error?.message || error?.toString() || ''
	return DECRYPTION_RETRY_CONFIG.sessionRecordErrors.some(errorPattern => errorMessage.includes(errorPattern))
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// Helper functions for session recreation
async function handleSessionRecreation(
	senderJid: string,
	currentRetryCount: number,
	sessionContext: SessionRecreationContext | undefined,
	messageKey: WAMessageKey,
	logger: any
): Promise<{ reason: string; recreate: boolean; shouldFetchPreKeys: boolean }> {
	try {
		const sessionResult = await shouldRecreateSession(senderJid, currentRetryCount, sessionContext)

		if (sessionResult.recreate) {
			logger.warn(
				{
					key: messageKey,
					reason: sessionResult.reason,
					shouldFetchPreKeys: sessionResult.shouldFetchPreKeys
				},
				'Session recreation recommended'
			)

			// Execute session recreation with prekey fetching
			if (sessionResult.shouldFetchPreKeys && sessionContext) {
				await executeSessionRecreationWithPrekeys(senderJid, sessionContext, logger)
			}
		}

		return sessionResult
	} catch (sessionCheckError: any) {
		logger.warn(
			{
				jid: senderJid,
				error: sessionCheckError.message
			},
			'Failed to check session recreation need'
		)
		return { recreate: false, shouldFetchPreKeys: false, reason: '' }
	}
}

async function executeSessionRecreationWithPrekeys(
	senderJid: string,
	sessionContext: SessionRecreationContext,
	logger: any
): Promise<void> {
	try {
		const success = await executeSessionRecreation(senderJid, sessionContext)
		logger.debug(
			{ jid: senderJid },
			success ? 'Session recreation completed successfully' : 'Session recreation failed'
		)
	} catch (prekeyError: any) {
		logger.warn(
			{
				jid: senderJid,
				error: prekeyError.message
			},
			'Failed to execute session recreation'
		)
	}
}

/**
 * Decrypt a single message with retry logic for recoverable errors (inspired by whatsmeow)
 */
async function decryptWithRetry(
	decryptFn: () => Promise<Uint8Array>,
	logger: ILogger,
	messageKey: WAMessageKey,
	messageType: string,
	node?: BinaryNode,
	sendRetryRequestFn?: (node: BinaryNode, forceIncludeKeys: boolean) => Promise<void>,
	sessionContext?: SessionRecreationContext
): Promise<Uint8Array> {
	let lastError: any
	const messageKeyStr = `${messageKey.remoteJid}_${messageKey.id}_${messageKey.participant || ''}`

	// Check if we should stop retrying based on previous attempts
	if (shouldStopRetrying(messageKeyStr)) {
		logger.warn({ key: messageKey }, 'Message has exceeded maximum retry attempts, not retrying')
		throw new Error('Maximum retry attempts exceeded for message')
	}

	for (let attempt = 0; attempt <= DECRYPTION_RETRY_CONFIG.maxRetries; attempt++) {
		try {
			const result = await decryptFn()
			// Success - clean up retry state if it exists
			if (messageRetryStates.has(messageKeyStr)) {
				messageRetryStates.delete(messageKeyStr)
			}

			return result
		} catch (error: any) {
			lastError = error

			const isMac = isMacError(error)
			const isSessionRecord = isSessionRecordError(error)

			// Only retry for recoverable errors (session record, MAC, etc.)
			if (!isMac && !isSessionRecord) {
				logger.error({ key: messageKey, error: error.message }, 'Non-recoverable decryption error')
				throw error
			}

			// Increment retry count using whatsmeow-inspired tracking
			const currentRetryCount = incrementRetryCount(messageKeyStr)

			// Don't retry if we've exceeded the limit
			if (currentRetryCount > DECRYPTION_RETRY_CONFIG.maxRetries) {
				logger.warn({ key: messageKey, retryCount: currentRetryCount }, 'Max retries reached, throwing last error')
				break
			}

			// Calculate delay with exponential backoff
			const delay = DECRYPTION_RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt)

			// Enhanced logging with error type classification
			const errorType = isMac ? 'MAC' : 'Session Record'

			logger.warn(
				{
					key: messageKey,
					attempt: currentRetryCount,
					maxRetries: DECRYPTION_RETRY_CONFIG.maxRetries,
					error: error.message,
					errorType,
					messageType,
					delayMs: delay
				},
				`${errorType} error detected, retrying decryption`
			)

			// Check if we should recreate session (whatsmeow-inspired logic)
			const senderJid = messageKey.participant || messageKey.remoteJid || ''

			const sessionResult = await handleSessionRecreation(
				senderJid,
				currentRetryCount,
				sessionContext,
				messageKey,
				logger
			)
			const recreate = sessionResult.recreate
			const recreateReason = sessionResult.reason

			// Send retry request immediately when we detect a decryption error
			// This is more efficient than waiting for the full message processing
			if (node && sendRetryRequestFn && currentRetryCount <= 2) {
				try {
					// Force include keys on first retry, MAC errors, session errors, or when session recreation is needed
					const forceIncludeKeys = isSessionRecordError(error) || isMacError(error) || recreate || currentRetryCount > 1
					await sendRetryRequestFn(node, forceIncludeKeys)
					logger.debug(
						{
							key: messageKey,
							errorType,
							forceIncludeKeys,
							retryCount: currentRetryCount,
							sessionRecreate: recreate,
							recreateReason
						},
						'sent retry request during decryption retry'
					)
				} catch (retryRequestError: any) {
					logger.warn(
						{
							key: messageKey,
							error: retryRequestError.message
						},
						'failed to send retry request during decryption retry'
					)
				}
			}

			await sleep(delay)
		}
	}

	// If all retries failed, throw the last error
	throw lastError
}
