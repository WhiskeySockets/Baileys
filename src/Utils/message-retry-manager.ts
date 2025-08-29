import { proto } from '../../WAProto'
import type {WAMessageKey} from '../Types'
import type {ILogger} from './logger'

/** Number of sent messages to cache in memory for handling retry receipts */
const RECENT_MESSAGES_SIZE = 512

/** Timeout for session recreation - 1 hour */
const RECREATE_SESSION_TIMEOUT = 60 * 60 * 1000 // 1 hour in milliseconds

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

export class MessageRetryManager {
	private recentMessagesMap = new Map<string, RecentMessage>()
	private recentMessagesList: RecentMessageKey[] = new Array(RECENT_MESSAGES_SIZE)
	private recentMessagesPtr = 0
	private sessionRecreateHistory: SessionRecreateHistory = {}

	constructor(private logger: ILogger) {
		// Initialize the array with empty objects
		for (let i = 0; i < RECENT_MESSAGES_SIZE; i++) {
			this.recentMessagesList[i] = { to: '', id: '' }
		}
	}

	/**
	 * Add a recent message to the cache for retry handling
	 */
	addRecentMessage(to: string, id: string, message: proto.IMessage): void {
		const key: RecentMessageKey = { to, id }
		const keyStr = this.keyToString(key)

		// Remove old message if the slot is occupied
		const oldKey = this.recentMessagesList[this.recentMessagesPtr]
		if (oldKey.id !== '') {
			const oldKeyStr = this.keyToString(oldKey)
			this.recentMessagesMap.delete(oldKeyStr)
		}

		// Add new message
		this.recentMessagesMap.set(keyStr, {
			message,
			timestamp: Date.now()
		})

		this.recentMessagesList[this.recentMessagesPtr] = key
		this.recentMessagesPtr++

		if (this.recentMessagesPtr >= RECENT_MESSAGES_SIZE) {
			this.recentMessagesPtr = 0
		}

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
	 * Check if a session should be recreated based on retry count and history
	 */
	shouldRecreateSession(jid: string, retryCount: number, hasSession: boolean): { reason: string; recreate: boolean } {
		// If we don't have a session, always recreate
		if (!hasSession) {
			this.sessionRecreateHistory[jid] = Date.now()
			return {
				reason: "we don't have a Signal session with them",
				recreate: true
			}
		}

		// Only consider recreation if retry count > 1
		if (retryCount < 2) {
			return { reason: '', recreate: false }
		}

		const now = Date.now()
		const prevTime = this.sessionRecreateHistory[jid]

		// If no previous recreation or it's been more than an hour
		if (!prevTime || (now - prevTime) > RECREATE_SESSION_TIMEOUT) {
			this.sessionRecreateHistory[jid] = now
			return {
				reason: 'retry count > 1 and over an hour since last recreation',
				recreate: true
			}
		}

		return { reason: '', recreate: false }
	}

	/**
	 * Clear old entries from session recreate history
	 */
	cleanupSessionHistory(): void {
		const now = Date.now()
		const cutoff = now - (RECREATE_SESSION_TIMEOUT * 2) // Keep for 2 hours

		for (const [jid, timestamp] of Object.entries(this.sessionRecreateHistory)) {
			if (timestamp < cutoff) {
				delete this.sessionRecreateHistory[jid]
			}
		}
	}

	/**
	 * Get cache statistics for debugging
	 */
	getCacheStats(): { recentMessages: number; sessionHistory: number } {
		return {
			recentMessages: this.recentMessagesMap.size,
			sessionHistory: Object.keys(this.sessionRecreateHistory).length
		}
	}

	/**
	 * Clear all caches
	 */
	clearAll(): void {
		this.recentMessagesMap.clear()
		this.sessionRecreateHistory = {}
		this.recentMessagesPtr = 0

		// Reset the array
		for (let i = 0; i < RECENT_MESSAGES_SIZE; i++) {
			this.recentMessagesList[i] = { to: '', id: '' }
		}

		this.logger.debug('Cleared all retry manager caches')
	}

	private keyToString(key: RecentMessageKey): string {
		return `${key.to}:${key.id}`
	}
}