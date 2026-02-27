import { LRUCache } from 'lru-cache'
import type { proto } from '../../WAProto/index.js'
import type { ILogger } from './logger'
import { metrics } from './prometheus-metrics.js'

/** Number of sent messages to cache in memory for handling retry receipts */
const RECENT_MESSAGES_SIZE = 512

const MESSAGE_KEY_SEPARATOR = '\u0000'

/** Timeout for session recreation - 1 hour */
const RECREATE_SESSION_TIMEOUT = 60 * 60 * 1000 // 1 hour in milliseconds
const PHONE_REQUEST_DELAY = 3000

/**
 * Retry reason codes from WhatsApp protocol
 * These map to the error codes sent in retry receipts
 *
 * @see https://github.com/WhiskeySockets/Baileys/pull/2307
 */
export enum RetryReason {
	/** Unknown or unspecified error */
	UnknownError = 0,
	/** No Signal session exists for recipient */
	SignalErrorNoSession = 1,
	/** Invalid key format or corrupted key */
	SignalErrorInvalidKey = 2,
	/** Invalid pre-key ID (key not found) */
	SignalErrorInvalidKeyId = 3,
	/** Invalid message - MAC verification failed */
	SignalErrorInvalidMessage = 4,
	/** Invalid signature on message or key */
	SignalErrorInvalidSignature = 5,
	/** Message from the future (timestamp issue) */
	SignalErrorFutureMessage = 6,
	/** Explicit MAC verification failure */
	SignalErrorBadMac = 7,
	/** Session is corrupted or invalid state */
	SignalErrorInvalidSession = 8,
	/** Invalid message key (decryption key issue) */
	SignalErrorInvalidMsgKey = 9,
	/** Bad broadcast ephemeral setting */
	BadBroadcastEphemeralSetting = 10,
	/** Unknown companion device without pre-key */
	UnknownCompanionNoPrekey = 11,
	/** ADV (Announcement Delivery Verification) failure */
	AdvFailure = 12,
	/** Status revoke was delayed */
	StatusRevokeDelay = 13
}

/**
 * MAC error codes that indicate identity key mismatch
 * These errors occur when the sender's identity key has changed (e.g., reinstalled WhatsApp)
 * and require immediate session recreation without waiting for the normal timeout
 */
export const MAC_ERROR_CODES = new Set<RetryReason>([
	RetryReason.SignalErrorInvalidMessage,
	RetryReason.SignalErrorBadMac
])

/**
 * Session-related error codes that may require session recreation
 */
export const SESSION_ERROR_CODES = new Set<RetryReason>([
	RetryReason.SignalErrorNoSession,
	RetryReason.SignalErrorInvalidSession,
	RetryReason.SignalErrorInvalidKey,
	RetryReason.SignalErrorInvalidKeyId
])
export interface RecentMessageKey {
	to: string
	id: string
}

export interface RecentMessage {
	message: proto.IMessage
	timestamp: number
}

export interface SessionRecreateHistory {
	[jid: string]: number // timestamp
}

export interface RetryCounter {
	[messageId: string]: number
}

export type PendingPhoneRequest = Record<string, ReturnType<typeof setTimeout>>

export interface RetryStatistics {
	totalRetries: number
	successfulRetries: number
	failedRetries: number
	mediaRetries: number
	sessionRecreations: number
	phoneRequests: number
}

export class MessageRetryManager {
	private recentMessagesMap = new LRUCache<string, RecentMessage>({
		max: RECENT_MESSAGES_SIZE,
		ttl: 5 * 60 * 1000,
		ttlAutopurge: true,
		dispose: (_value: RecentMessage, key: string) => {
			const separatorIndex = key.lastIndexOf(MESSAGE_KEY_SEPARATOR)
			if (separatorIndex > -1) {
				const messageId = key.slice(separatorIndex + MESSAGE_KEY_SEPARATOR.length)
				this.messageKeyIndex.delete(messageId)
			}
		}
	})
	private messageKeyIndex = new Map<string, string>()
	private sessionRecreateHistory = new LRUCache<string, number>({
		ttl: RECREATE_SESSION_TIMEOUT * 2,
		ttlAutopurge: true
	})
	private retryCounters = new LRUCache<string, number>({
		ttl: 15 * 60 * 1000,
		ttlAutopurge: true,
		updateAgeOnGet: true
	}) // 15 minutes TTL
	private pendingPhoneRequests: PendingPhoneRequest = {}
	private readonly maxMsgRetryCount: number = 5
	private statistics: RetryStatistics = {
		totalRetries: 0,
		successfulRetries: 0,
		failedRetries: 0,
		mediaRetries: 0,
		sessionRecreations: 0,
		phoneRequests: 0
	}

	constructor(
		private logger: ILogger,
		maxMsgRetryCount: number
	) {
		this.maxMsgRetryCount = maxMsgRetryCount
	}

	/**
	 * Add a recent message to the cache for retry handling
	 */
	addRecentMessage(to: string, id: string, message: proto.IMessage): void {
		const key: RecentMessageKey = { to, id }
		const keyStr = this.keyToString(key)

		// Add new message
		this.recentMessagesMap.set(keyStr, {
			message,
			timestamp: Date.now()
		})
		this.messageKeyIndex.set(id, keyStr)

		this.logger.debug(`Added message to retry cache: ${to}/${id}`)
	}

	/**
	 * Get a recent message from the cache.
	 *
	 * First attempts an exact `to+id` key lookup. If that misses — which happens when
	 * the retry receipt arrives from a device-specific JID (e.g. `55123:82@s.whatsapp.net`)
	 * while the message was stored under the normalised base JID (`55123@s.whatsapp.net`),
	 * or when the JID domain flipped between LID and PN — falls back to the `messageKeyIndex`
	 * which maps bare message IDs to stored keys regardless of the `to` format.
	 */
	getRecentMessage(to: string, id: string): RecentMessage | undefined {
		const key: RecentMessageKey = { to, id }
		const keyStr = this.keyToString(key)
		const exact = this.recentMessagesMap.get(keyStr)
		if (exact) return exact

		// Fallback: look up by message ID only to handle JID format mismatches
		// (device suffix present/absent, LID vs PN, etc.)
		const indexedKeyStr = this.messageKeyIndex.get(id)
		if (indexedKeyStr) {
			const message = this.recentMessagesMap.get(indexedKeyStr)
			if (!message) {
				// The LRU cache evicted this entry; clean up the stale index reference
				// to prevent repeated futile lookups on subsequent retry receipts.
				this.messageKeyIndex.delete(id)
			}
			return message
		}

		return undefined
	}

	/**
	 * Check if a session should be recreated based on retry count, history, and error code
	 *
	 * @param jid - The JID of the recipient
	 * @param hasSession - Whether a Signal session exists for this JID
	 * @param errorCode - Optional error code from the retry receipt (indicates type of failure)
	 * @returns Object with reason string and boolean indicating if session should be recreated
	 */
	shouldRecreateSession(
		jid: string,
		hasSession: boolean,
		errorCode?: RetryReason
	): { reason: string; recreate: boolean } {
		// If we don't have a session, always recreate
		if (!hasSession) {
			this.sessionRecreateHistory.set(jid, Date.now())
			this.statistics.sessionRecreations++
			metrics.signalSessionRecreations?.inc({ reason: 'no_session' })
			return {
				reason: "we don't have a Signal session with them",
				recreate: true
			}
		}

		// MAC errors require IMMEDIATE session recreation regardless of history
		// This handles the case where contact reinstalled WhatsApp (identity key changed)
		if (errorCode !== undefined && MAC_ERROR_CODES.has(errorCode)) {
			this.sessionRecreateHistory.set(jid, Date.now())
			this.statistics.sessionRecreations++
			const reasonName = RetryReason[errorCode] || `code_${errorCode}`
			metrics.signalMacErrors?.inc({ action: 'session_recreation' })
			metrics.signalSessionRecreations?.inc({ reason: 'mac_error' })
			this.logger.warn({ jid, errorCode: reasonName }, 'MAC error detected, forcing immediate session recreation')
			return {
				reason: `MAC error (${reasonName}) - contact may have reinstalled WhatsApp`,
				recreate: true
			}
		}

		// Session-related errors also warrant recreation
		if (errorCode !== undefined && SESSION_ERROR_CODES.has(errorCode)) {
			const now = Date.now()
			const prevTime = this.sessionRecreateHistory.get(jid)
			// For session errors, use a shorter timeout (5 minutes) since these are more severe
			const sessionErrorTimeout = 5 * 60 * 1000
			if (!prevTime || now - prevTime > sessionErrorTimeout) {
				this.sessionRecreateHistory.set(jid, now)
				this.statistics.sessionRecreations++
				const reasonName = RetryReason[errorCode] || `code_${errorCode}`
				metrics.signalSessionRecreations?.inc({ reason: 'session_error' })
				return {
					reason: `Session error (${reasonName})`,
					recreate: true
				}
			}
		}

		const now = Date.now()
		const prevTime = this.sessionRecreateHistory.get(jid)

		// If no previous recreation or it's been more than an hour
		if (!prevTime || now - prevTime > RECREATE_SESSION_TIMEOUT) {
			this.sessionRecreateHistory.set(jid, now)
			this.statistics.sessionRecreations++
			metrics.signalSessionRecreations?.inc({ reason: 'timeout_exceeded' })
			return {
				reason: 'retry count > 1 and over an hour since last recreation',
				recreate: true
			}
		}

		return { reason: '', recreate: false }
	}

	/**
	 * Parse error code from retry receipt attribute
	 *
	 * @param errorAttr - The error attribute string from the retry receipt
	 * @returns Parsed RetryReason or undefined if invalid
	 */
	parseRetryErrorCode(errorAttr: string | undefined): RetryReason | undefined {
		if (errorAttr === undefined || errorAttr === '') {
			return undefined
		}

		const code = parseInt(errorAttr, 10)
		if (Number.isNaN(code)) {
			return undefined
		}

		// Validate code is within known range
		if (code >= RetryReason.UnknownError && code <= RetryReason.StatusRevokeDelay) {
			return code as RetryReason
		}

		// Unknown code, treat as UnknownError
		return RetryReason.UnknownError
	}

	/**
	 * Check if an error code indicates a MAC verification failure
	 *
	 * @param errorCode - The retry error code to check
	 * @returns True if this is a MAC error requiring immediate session recreation
	 */
	isMacError(errorCode: RetryReason | undefined): boolean {
		return errorCode !== undefined && MAC_ERROR_CODES.has(errorCode)
	}

	/**
	 * Check if an error code indicates a session-related failure
	 *
	 * @param errorCode - The retry error code to check
	 * @returns True if this is a session error
	 */
	isSessionError(errorCode: RetryReason | undefined): boolean {
		return errorCode !== undefined && SESSION_ERROR_CODES.has(errorCode)
	}

	/**
	 * Increment retry counter for a message
	 */
	incrementRetryCount(messageId: string): number {
		this.retryCounters.set(messageId, (this.retryCounters.get(messageId) || 0) + 1)
		this.statistics.totalRetries++
		return this.retryCounters.get(messageId)!
	}

	/**
	 * Get retry count for a message
	 */
	getRetryCount(messageId: string): number {
		return this.retryCounters.get(messageId) || 0
	}

	/**
	 * Check if message has exceeded maximum retry attempts
	 */
	hasExceededMaxRetries(messageId: string): boolean {
		return this.getRetryCount(messageId) >= this.maxMsgRetryCount
	}

	/**
	 * Mark retry as successful
	 */
	markRetrySuccess(messageId: string): void {
		this.statistics.successfulRetries++
		// Clean up retry counter for successful message
		this.retryCounters.delete(messageId)
		this.cancelPendingPhoneRequest(messageId)
		this.removeRecentMessage(messageId)
	}

	/**
	 * Mark retry as failed
	 */
	markRetryFailed(messageId: string): void {
		this.statistics.failedRetries++
		this.retryCounters.delete(messageId)
		this.cancelPendingPhoneRequest(messageId)
		this.removeRecentMessage(messageId)
	}

	/**
	 * Schedule a phone request with delay
	 */
	schedulePhoneRequest(messageId: string, callback: () => void, delay: number = PHONE_REQUEST_DELAY): void {
		// Cancel any existing request for this message
		this.cancelPendingPhoneRequest(messageId)

		this.pendingPhoneRequests[messageId] = setTimeout(() => {
			delete this.pendingPhoneRequests[messageId]
			this.statistics.phoneRequests++
			callback()
		}, delay)

		this.logger.debug(`Scheduled phone request for message ${messageId} with ${delay}ms delay`)
	}

	/**
	 * Cancel pending phone request
	 */
	cancelPendingPhoneRequest(messageId: string): void {
		const timeout = this.pendingPhoneRequests[messageId]
		if (timeout) {
			clearTimeout(timeout)
			delete this.pendingPhoneRequests[messageId]
			this.logger.debug(`Cancelled pending phone request for message ${messageId}`)
		}
	}

	private keyToString(key: RecentMessageKey): string {
		return `${key.to}${MESSAGE_KEY_SEPARATOR}${key.id}`
	}

	private removeRecentMessage(messageId: string): void {
		const keyStr = this.messageKeyIndex.get(messageId)
		if (!keyStr) {
			return
		}

		this.recentMessagesMap.delete(keyStr)
		this.messageKeyIndex.delete(messageId)
	}
}
