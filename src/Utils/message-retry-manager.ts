import { LRUCache } from 'lru-cache'
import type { proto } from '../../WAProto/index.js'
import type { AnyMessageContent } from '../Types/Message'
import type { ILogger } from './logger'
import { makeKeyedMutex } from './make-mutex'

/** Number of sent messages to cache in memory for handling retry receipts */
const RECENT_MESSAGES_SIZE = 512

const MESSAGE_KEY_SEPARATOR = '\u0000'

/** Timeout for session recreation - 1 hour */
const RECREATE_SESSION_TIMEOUT = 60 * 60 * 1000 // 1 hour in milliseconds
const PHONE_REQUEST_DELAY = 3000
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

export interface PreparedMessageRetry {
	isCancelled(): boolean
	finish(): void
}

/**
 * Coordinates edits/revokes with retry relays independently of whether the
 * optional recent-message payload cache is enabled.
 */
export class MessageRetryCoordinator {
	private invalidatedMessages = new LRUCache<string, true>({
		max: RECENT_MESSAGES_SIZE,
		ttl: 5 * 60 * 1000,
		ttlAutopurge: true
	})
	private preparedRetries = new Map<string, Set<{ cancelled: boolean }>>()
	private mutex = makeKeyedMutex()

	private key(to: string, id: string): string {
		return `${to}${MESSAGE_KEY_SEPARATOR}${id}`
	}

	invalidateMessage(to: string, id: string): void {
		const key = this.key(to, id)
		this.invalidatedMessages.set(key, true)
		for (const retry of this.preparedRetries.get(key) ?? []) {
			retry.cancelled = true
		}
	}

	isMessageInvalidated(to: string, id: string): boolean {
		return this.invalidatedMessages.has(this.key(to, id))
	}

	prepareRetry(to: string, id: string): PreparedMessageRetry {
		const key = this.key(to, id)
		const retry = { cancelled: this.invalidatedMessages.has(key) }
		const retries = this.preparedRetries.get(key) ?? new Set<{ cancelled: boolean }>()
		retries.add(retry)
		this.preparedRetries.set(key, retries)

		let finished = false
		return {
			isCancelled: () => retry.cancelled,
			finish: () => {
				if (finished) return
				finished = true
				retries.delete(retry)
				if (retries.size === 0 && this.preparedRetries.get(key) === retries) {
					this.preparedRetries.delete(key)
				}
			}
		}
	}

	withMessageLock<T>(to: string, id: string, task: () => Promise<T> | T): Promise<T> {
		return this.mutex.mutex(this.key(to, id), task)
	}

	withMessageLocks<T>(to: string, ids: string[], task: () => Promise<T> | T): Promise<T> {
		const orderedIds = [...new Set(ids)].sort()
		const lockNext = (index: number): Promise<T> => {
			const id = orderedIds[index]
			return id === undefined ? Promise.resolve().then(task) : this.withMessageLock(to, id, () => lockNext(index + 1))
		}

		return lockNext(0)
	}

	clear(): void {
		for (const retries of this.preparedRetries.values()) {
			for (const retry of retries) {
				retry.cancelled = true
			}
		}

		this.invalidatedMessages.clear()
		this.preparedRetries.clear()
	}
}

// Retry reason codes matching WhatsApp Web's Signal error codes.
export enum RetryReason {
	UnknownError = 0,
	SignalErrorNoSession = 1,
	SignalErrorInvalidKey = 2,
	SignalErrorInvalidKeyId = 3,
	/** MAC verification failed - most common cause of decryption failures */
	SignalErrorInvalidMessage = 4,
	SignalErrorInvalidSignature = 5,
	SignalErrorFutureMessage = 6,
	/** Explicit MAC failure - session is definitely out of sync */
	SignalErrorBadMac = 7,
	SignalErrorInvalidSession = 8,
	SignalErrorInvalidMsgKey = 9,
	BadBroadcastEphemeralSetting = 10,
	UnknownCompanionNoPrekey = 11,
	AdvFailure = 12,
	StatusRevokeDelay = 13
}

/** Error codes that indicate a MAC failure and require immediate session recreation */
const MAC_ERROR_CODES = new Set([RetryReason.SignalErrorInvalidMessage, RetryReason.SignalErrorBadMac])

export class MessageRetryManager {
	private recentMessagesMap = new LRUCache<string, RecentMessage>({
		max: RECENT_MESSAGES_SIZE,
		ttl: 5 * 60 * 1000,
		ttlAutopurge: true,
		dispose: (_value: RecentMessage, key: string) => {
			const separatorIndex = key.lastIndexOf(MESSAGE_KEY_SEPARATOR)
			if (separatorIndex > -1) {
				const messageId = key.slice(separatorIndex + MESSAGE_KEY_SEPARATOR.length)
				const indexedKeys = this.messageKeyIndex.get(messageId)
				indexedKeys?.delete(key)
				if (indexedKeys?.size === 0) {
					this.messageKeyIndex.delete(messageId)
				}
			}
		}
	})
	private messageKeyIndex = new Map<string, Set<string>>()
	private sessionRecreateHistory = new LRUCache<string, number>({
		ttl: RECREATE_SESSION_TIMEOUT * 2,
		ttlAutopurge: true
	})
	private retryCounters = new LRUCache<string, number>({
		ttl: 15 * 60 * 1000,
		ttlAutopurge: true,
		updateAgeOnGet: true
	}) // 15 minutes TTL
	private baseKeys = new LRUCache<string, Uint8Array>({
		max: 1024,
		ttl: 15 * 60 * 1000,
		ttlAutopurge: true
	})
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
		maxMsgRetryCount: number,
		private coordinator = new MessageRetryCoordinator()
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
		const indexedKeys = this.messageKeyIndex.get(id) ?? new Set<string>()
		indexedKeys.add(keyStr)
		this.messageKeyIndex.set(id, indexedKeys)

		this.logger.debug(`Added message to retry cache: ${to}/${id}`)
	}

	/**
	 * Get a recent message from the cache
	 */
	getRecentMessage(to: string, id: string): RecentMessage | undefined {
		const key: RecentMessageKey = { to, id }
		const keyStr = this.keyToString(key)
		return this.recentMessagesMap.get(keyStr)
	}

	/**
	 * Check if a session should be recreated based on retry count, history, and error code.
	 * MAC errors (codes 4 and 7) trigger immediate session recreation regardless of timeout.
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
			return {
				reason: "we don't have a Signal session with them",
				recreate: true
			}
		}

		// IMMEDIATE recreation for MAC errors - session is definitely out of sync
		if (errorCode !== undefined && MAC_ERROR_CODES.has(errorCode)) {
			this.sessionRecreateHistory.set(jid, Date.now())
			this.statistics.sessionRecreations++
			this.logger.warn(
				{ jid, errorCode: RetryReason[errorCode] },
				'MAC error detected, forcing immediate session recreation'
			)
			return {
				reason: `MAC error (code ${errorCode}: ${RetryReason[errorCode]}), immediate session recreation`,
				recreate: true
			}
		}

		const now = Date.now()
		const prevTime = this.sessionRecreateHistory.get(jid)

		// If no previous recreation or it's been more than an hour
		if (!prevTime || now - prevTime > RECREATE_SESSION_TIMEOUT) {
			this.sessionRecreateHistory.set(jid, now)
			this.statistics.sessionRecreations++
			return {
				reason: 'retry count > 1 and over an hour since last recreation',
				recreate: true
			}
		}

		return { reason: '', recreate: false }
	}

	/**
	 * Parse error code from retry receipt's retry node.
	 * Returns undefined if no error code is present.
	 */
	parseRetryErrorCode(errorAttr: string | undefined): RetryReason | undefined {
		if (errorAttr === undefined || errorAttr === '') {
			return undefined
		}

		const code = parseInt(errorAttr, 10)
		if (Number.isNaN(code)) {
			return undefined
		}

		// Validate it's a known RetryReason
		if (code >= RetryReason.UnknownError && code <= RetryReason.StatusRevokeDelay) {
			return code as RetryReason
		}

		return RetryReason.UnknownError
	}

	/**
	 * Check if an error code indicates a MAC failure
	 */
	isMacError(errorCode: RetryReason | undefined): boolean {
		return errorCode !== undefined && MAC_ERROR_CODES.has(errorCode)
	}

	/**
	 * Increment retry counter for a message
	 */
	incrementRetryCount(messageId: string, to?: string): number {
		const key = this.retryKey(messageId, to)
		this.retryCounters.set(key, (this.retryCounters.get(key) || 0) + 1)
		this.statistics.totalRetries++
		return this.retryCounters.get(key)!
	}

	/**
	 * Get retry count for a message
	 */
	getRetryCount(messageId: string, to?: string): number {
		return this.retryCounters.get(this.retryKey(messageId, to)) || 0
	}

	/**
	 * Check if message has exceeded maximum retry attempts
	 */
	hasExceededMaxRetries(messageId: string, to?: string): boolean {
		return this.getRetryCount(messageId, to) >= this.maxMsgRetryCount
	}

	/**
	 * Mark retry as successful
	 */
	markRetrySuccess(messageId: string, to?: string): void {
		this.statistics.successfulRetries++
		// Clean up retry counter for successful message
		this.retryCounters.delete(this.retryKey(messageId, to))
		this.cancelPendingPhoneRequest(messageId, to)
		if (to) {
			this.removeRecentMessage(to, messageId)
		} else {
			this.removeRecentMessagesById(messageId)
		}
	}

	/**
	 * Mark retry as failed
	 */
	markRetryFailed(messageId: string, to?: string): void {
		this.statistics.failedRetries++
		this.retryCounters.delete(this.retryKey(messageId, to))
		this.cancelPendingPhoneRequest(messageId, to)
		if (to) {
			this.removeRecentMessage(to, messageId)
		} else {
			this.removeRecentMessagesById(messageId)
		}
	}

	/**
	 * Schedule a phone request with delay
	 */
	schedulePhoneRequest(
		messageId: string,
		callback: () => void,
		delay: number = PHONE_REQUEST_DELAY,
		to?: string
	): void {
		const key = this.retryKey(messageId, to)
		// Cancel any existing request for this message
		this.cancelPendingPhoneRequest(messageId, to)

		this.pendingPhoneRequests[key] = setTimeout(() => {
			delete this.pendingPhoneRequests[key]
			this.statistics.phoneRequests++
			callback()
		}, delay)

		this.logger.debug(`Scheduled phone request for message ${messageId} with ${delay}ms delay`)
	}

	/**
	 * Cancel pending phone request
	 */
	cancelPendingPhoneRequest(messageId: string, to?: string): void {
		const key = this.retryKey(messageId, to)
		const timeout = this.pendingPhoneRequests[key]
		if (timeout) {
			clearTimeout(timeout)
			delete this.pendingPhoneRequests[key]
			this.logger.debug(`Cancelled pending phone request for message ${messageId}`)
		}
	}

	clear(): void {
		this.recentMessagesMap.clear()
		this.messageKeyIndex.clear()
		this.coordinator.clear()
		this.sessionRecreateHistory.clear()
		this.retryCounters.clear()
		this.baseKeys.clear()
		for (const messageId of Object.keys(this.pendingPhoneRequests)) {
			this.cancelPendingPhoneRequest(messageId)
		}

		this.statistics = {
			totalRetries: 0,
			successfulRetries: 0,
			failedRetries: 0,
			mediaRetries: 0,
			sessionRecreations: 0,
			phoneRequests: 0
		}
	}

	saveBaseKey(addr: string, msgId: string, baseKey: Uint8Array): void {
		this.baseKeys.set(`${addr}:${msgId}`, baseKey)
	}

	hasSameBaseKey(addr: string, msgId: string, baseKey: Uint8Array): boolean {
		const stored = this.baseKeys.get(`${addr}:${msgId}`)
		if (!stored || stored.length !== baseKey.length) {
			return false
		}

		for (let i = 0; i < stored.length; i++) {
			if (stored[i] !== baseKey[i]) return false
		}

		return true
	}

	deleteBaseKey(addr: string, msgId: string): void {
		this.baseKeys.delete(`${addr}:${msgId}`)
	}

	private keyToString(key: RecentMessageKey): string {
		return `${key.to}${MESSAGE_KEY_SEPARATOR}${key.id}`
	}

	private retryKey(messageId: string, to?: string): string {
		return to ? this.keyToString({ to, id: messageId }) : messageId
	}

	/** Remove one exact destination/message pair from the retry cache. */
	removeRecentMessage(to: string, messageId: string): boolean {
		return this.recentMessagesMap.delete(this.keyToString({ to, id: messageId }))
	}

	/** Remove one exact cache entry and mark the message unavailable for retries. */
	invalidateRecentMessage(to: string, messageId: string): boolean {
		const keyStr = this.keyToString({ to, id: messageId })
		this.coordinator.invalidateMessage(to, messageId)
		return this.recentMessagesMap.delete(keyStr)
	}

	isRecentMessageInvalidated(to: string, messageId: string): boolean {
		return this.coordinator.isMessageInvalidated(to, messageId)
	}

	withRecentMessageLock<T>(to: string, messageId: string, task: () => Promise<T> | T): Promise<T> {
		return this.coordinator.withMessageLock(to, messageId, task)
	}

	private removeRecentMessagesById(messageId: string): boolean {
		const indexedKeys = this.messageKeyIndex.get(messageId)
		if (!indexedKeys) {
			return false
		}

		let removed = false
		for (const keyStr of [...indexedKeys]) {
			removed = this.recentMessagesMap.delete(keyStr) || removed
		}

		return removed
	}
}

const retryCacheTargetForContent = (content: AnyMessageContent): proto.IMessageKey | undefined => {
	const target = 'delete' in content && content.delete ? content.delete : 'edit' in content ? content.edit : undefined
	return target?.fromMe === true && target.remoteJid && target.id ? target : undefined
}

/**
 * Drop the original message from the retry cache after a local revoke or edit
 * has been relayed successfully.
 *
 * The full destination/message pair is required because callers may provide
 * custom message IDs and reuse the same ID in different chats.
 */
export const invalidateRecentMessageForContent = (
	manager: MessageRetryManager,
	content: AnyMessageContent
): boolean => {
	const target = retryCacheTargetForContent(content)
	if (!target) {
		return false
	}

	return manager.invalidateRecentMessage(target.remoteJid!, target.id!)
}

/**
 * Serialize a sendMessage-generated edit/revoke with retries for its target.
 * Coordination is updated only after the caller's relay succeeds; the optional
 * recent-message payload cache is removed when present.
 */
export const withMessageRetryInvalidation = async <T>(
	coordinator: MessageRetryCoordinator,
	manager: MessageRetryManager | null,
	content: AnyMessageContent,
	task: () => Promise<T> | T
): Promise<T> => {
	const target = retryCacheTargetForContent(content)
	if (!target) {
		return task()
	}

	return coordinator.withMessageLock(target.remoteJid!, target.id!, async () => {
		const result = await task()
		coordinator.invalidateMessage(target.remoteJid!, target.id!)
		manager?.removeRecentMessage(target.remoteJid!, target.id!)
		return result
	})
}
