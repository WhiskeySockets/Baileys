import { LRUCache } from 'lru-cache'
import type { proto } from '../../WAProto/index.js'
import type { ILogger } from './logger'

const RECENT_MESSAGES_SIZE = 512
const MESSAGE_KEY_SEPARATOR = '\u0000'
const RECREATE_SESSION_TIMEOUT = 60 * 60 * 1000
const PHONE_REQUEST_DELAY = 3000
const CLEANUP_INTERVAL = 5 * 60 * 1000

export interface RecentMessageKey {
	to: string
	id: string
}

export interface RecentMessage {
	message: proto.IMessage
	timestamp: number
}

export interface SessionRecreateHistory {
	[jid: string]: number
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
	private recentMessagesMap: LRUCache<string, RecentMessage> | null
	private messageKeyIndex: Map<string, string> | null
	private sessionRecreateHistory: LRUCache<string, number> | null
	private retryCounters: LRUCache<string, number> | null
	private pendingPhoneRequests: PendingPhoneRequest = {}
	private cleanupInterval: ReturnType<typeof setInterval> | null = null
	private readonly maxMsgRetryCount: number = 5
	private destroyed = false
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

		this.recentMessagesMap = new LRUCache<string, RecentMessage>({
			max: RECENT_MESSAGES_SIZE,
			ttl: 5 * 60 * 1000,
			ttlAutopurge: true,
			dispose: (_value: RecentMessage, key: string) => {
				if (this.destroyed || !this.messageKeyIndex) return
				const separatorIndex = key.lastIndexOf(MESSAGE_KEY_SEPARATOR)
				if (separatorIndex > -1) {
					const messageId = key.slice(separatorIndex + MESSAGE_KEY_SEPARATOR.length)
					this.messageKeyIndex.delete(messageId)
				}
			}
		})

		this.messageKeyIndex = new Map<string, string>()

		this.sessionRecreateHistory = new LRUCache<string, number>({
			max: 1000,
			ttl: RECREATE_SESSION_TIMEOUT * 2,
			ttlAutopurge: true
		})

		this.retryCounters = new LRUCache<string, number>({
			max: 1000,
			ttl: 15 * 60 * 1000,
			ttlAutopurge: true,
			updateAgeOnGet: true
		})

		this.cleanupInterval = setInterval(() => {
			this.performCleanup()
		}, CLEANUP_INTERVAL)
	}

	private performCleanup(): void {
		if (this.destroyed) return

		try {
			Object.keys(this.pendingPhoneRequests).forEach(messageId => {
				const timeout = this.pendingPhoneRequests[messageId]
				if (timeout) {
					this.cancelPendingPhoneRequest(messageId)
				}
			})

			this.recentMessagesMap?.purgeStale()
			this.sessionRecreateHistory?.purgeStale()
			this.retryCounters?.purgeStale()

			this.logger.debug('Performed periodic cleanup of retry manager')
		} catch (error) {
			this.logger.error({ error }, 'Error during retry manager cleanup')
		}
	}

	destroy(): void {
		if (this.destroyed) return

		this.destroyed = true
		this.logger.debug('Destroying message retry manager')

		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval)
			this.cleanupInterval = null
		}

		Object.keys(this.pendingPhoneRequests).forEach(messageId => {
			this.cancelPendingPhoneRequest(messageId)
		})
		this.pendingPhoneRequests = {}

		this.recentMessagesMap?.clear()
		this.recentMessagesMap = null

		this.messageKeyIndex?.clear()
		this.messageKeyIndex = null

		this.sessionRecreateHistory?.clear()
		this.sessionRecreateHistory = null

		this.retryCounters?.clear()
		this.retryCounters = null

		this.logger.debug('Message retry manager destroyed')
	}

	addRecentMessage(to: string, id: string, message: proto.IMessage): void {
		if (this.destroyed || !this.recentMessagesMap || !this.messageKeyIndex) return

		const key: RecentMessageKey = { to, id }
		const keyStr = this.keyToString(key)

		this.recentMessagesMap.set(keyStr, {
			message,
			timestamp: Date.now()
		})
		this.messageKeyIndex.set(id, keyStr)

		this.logger.debug(`Added message to retry cache: ${to}/${id}`)
	}

	getRecentMessage(to: string, id: string): RecentMessage | undefined {
		if (this.destroyed || !this.recentMessagesMap) return undefined

		const key: RecentMessageKey = { to, id }
		const keyStr = this.keyToString(key)
		return this.recentMessagesMap.get(keyStr)
	}

	shouldRecreateSession(jid: string, retryCount: number, hasSession: boolean): { reason: string; recreate: boolean } {
		if (this.destroyed || !this.sessionRecreateHistory) {
			return { reason: 'manager destroyed', recreate: false }
		}

		if (!hasSession) {
			this.sessionRecreateHistory.set(jid, Date.now())
			this.statistics.sessionRecreations++
			return {
				reason: "we don't have a Signal session with them",
				recreate: true
			}
		}

		if (retryCount < 2) {
			return { reason: '', recreate: false }
		}

		const now = Date.now()
		const prevTime = this.sessionRecreateHistory.get(jid)

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

	incrementRetryCount(messageId: string): number {
		if (this.destroyed || !this.retryCounters) return 0

		const current = this.retryCounters.get(messageId) || 0
		const next = current + 1
		this.retryCounters.set(messageId, next)
		this.statistics.totalRetries++
		return next
	}

	getRetryCount(messageId: string): number {
		if (this.destroyed || !this.retryCounters) return 0
		return this.retryCounters.get(messageId) || 0
	}

	hasExceededMaxRetries(messageId: string): boolean {
		return this.getRetryCount(messageId) >= this.maxMsgRetryCount
	}

	markRetrySuccess(messageId: string): void {
		if (this.destroyed) return

		this.statistics.successfulRetries++
		this.retryCounters?.delete(messageId)
		this.cancelPendingPhoneRequest(messageId)
		this.removeRecentMessage(messageId)
	}

	markRetryFailed(messageId: string): void {
		if (this.destroyed) return

		this.statistics.failedRetries++
		this.retryCounters?.delete(messageId)
		this.cancelPendingPhoneRequest(messageId)
		this.removeRecentMessage(messageId)
	}

	schedulePhoneRequest(messageId: string, callback: () => void, delay: number = PHONE_REQUEST_DELAY): void {
		if (this.destroyed) return

		this.cancelPendingPhoneRequest(messageId)

		this.pendingPhoneRequests[messageId] = setTimeout(() => {
			if (this.destroyed) return

			delete this.pendingPhoneRequests[messageId]
			this.statistics.phoneRequests++

			try {
				callback()
			} catch (error) {
				this.logger.error({ error, messageId }, 'Error executing phone request callback')
			}
		}, delay)

		this.logger.debug(`Scheduled phone request for message ${messageId} with ${delay}ms delay`)
	}

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
		if (this.destroyed || !this.recentMessagesMap || !this.messageKeyIndex) return

		const keyStr = this.messageKeyIndex.get(messageId)
		if (!keyStr) {
			return
		}

		this.recentMessagesMap.delete(keyStr)
		this.messageKeyIndex.delete(messageId)
	}
}
