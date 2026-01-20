/**
 * Custom Logger for Baileys/WhatsApp
 *
 * Provides:
 * - Pre-configured logger for Baileys/WhatsApp context
 * - Event categorization by type (connection, message, media, etc.)
 * - Specific filters to reduce noise
 * - WhatsApp event metrics
 * - Optimized formatting for debugging
 *
 * @module Utils/baileys-logger
 */

import type { ILogger } from './logger.js'
import { StructuredLogger, createStructuredLogger, type LogLevel, type LogEntry } from './structured-logger.js'

/**
 * Baileys-specific log categories
 */
export type BaileysLogCategory =
	| 'connection'    // WebSocket connection events
	| 'auth'          // Authentication and QR code
	| 'message'       // Message send/receive
	| 'media'         // Media upload/download
	| 'group'         // Group operations
	| 'presence'      // Presence status
	| 'call'          // Voice/video calls
	| 'sync'          // Data synchronization
	| 'encryption'    // Encryption operations
	| 'retry'         // Operation retries
	| 'socket'        // Low-level socket events
	| 'binary'        // Binary encoding/decoding
	| 'unknown'       // Unknown category

/**
 * Baileys Logger configuration
 */
export interface BaileysLoggerConfig {
	/** Default log level */
	level: LogLevel
	/** Categories to ignore */
	ignoredCategories?: BaileysLogCategory[]
	/** Categories with elevated log level (always debug) */
	verboseCategories?: BaileysLogCategory[]
	/** Whether to log message payloads (may be sensitive) */
	logMessagePayloads?: boolean
	/** Whether to log binary data in hex */
	logBinaryData?: boolean
	/** Instance identifier prefix */
	instanceId?: string
	/** Handler for specific events */
	eventHandler?: (category: BaileysLogCategory, entry: LogEntry) => void
	/** Size limit for logged payloads (bytes) */
	maxPayloadSize?: number
}

/**
 * Baileys-specific metrics
 */
export interface BaileysLoggerMetrics {
	connectionAttempts: number
	connectionSuccesses: number
	connectionFailures: number
	messagesSent: number
	messagesReceived: number
	mediaUploads: number
	mediaDownloads: number
	retryAttempts: number
	encryptionOperations: number
	errorsByCategory: Record<BaileysLogCategory, number>
	lastConnectionTime?: string
	lastMessageTime?: string
}

/**
 * Patterns to detect log category
 */
const CATEGORY_PATTERNS: Array<{ pattern: RegExp; category: BaileysLogCategory }> = [
	{ pattern: /connect|disconnect|socket|ws|websocket|open|close/i, category: 'connection' },
	{ pattern: /auth|qr|pairing|login|logout|creds/i, category: 'auth' },
	{ pattern: /message|msg|chat|text|send|recv|read|receipt/i, category: 'message' },
	{ pattern: /media|image|video|audio|document|sticker|upload|download/i, category: 'media' },
	{ pattern: /group|participant|admin|subject|invite/i, category: 'group' },
	{ pattern: /presence|online|offline|typing|available/i, category: 'presence' },
	{ pattern: /call|voice|video|ring/i, category: 'call' },
	{ pattern: /sync|history|initial|full/i, category: 'sync' },
	{ pattern: /encrypt|decrypt|signal|key|cipher/i, category: 'encryption' },
	{ pattern: /retry|attempt|backoff|reconnect/i, category: 'retry' },
	{ pattern: /binary|encode|decode|proto|buffer/i, category: 'binary' },
]

/**
 * Custom logger for Baileys
 *
 * @example
 * ```typescript
 * const logger = createBaileysLogger({
 *   level: 'debug',
 *   instanceId: 'session-1'
 * })
 *
 * logger.logConnection('connected', { duration: 1500 })
 * logger.logMessage('send', 'text', 'user@s.whatsapp.net')
 * ```
 */
export class BaileysLogger implements ILogger {
	private structuredLogger: StructuredLogger
	private config: Required<BaileysLoggerConfig>
	private metrics: BaileysLoggerMetrics
	private childContext: Record<string, unknown> = {}

	constructor(config: Partial<BaileysLoggerConfig> = {}) {
		this.config = {
			level: config.level || 'info',
			ignoredCategories: config.ignoredCategories || [],
			verboseCategories: config.verboseCategories || [],
			logMessagePayloads: config.logMessagePayloads ?? false,
			logBinaryData: config.logBinaryData ?? false,
			instanceId: config.instanceId || this.generateInstanceId(),
			eventHandler: config.eventHandler || (() => {}),
			maxPayloadSize: config.maxPayloadSize || 1024,
		}

		this.structuredLogger = createStructuredLogger({
			level: this.config.level,
			name: `baileys:${this.config.instanceId}`,
			jsonFormat: process.env.NODE_ENV === 'production',
			redactFields: ['password', 'token', 'secret', 'key', 'authKey', 'macKey'],
		})

		this.metrics = this.createInitialMetrics()
	}

	private generateInstanceId(): string {
		return Math.random().toString(36).substring(2, 8)
	}

	private createInitialMetrics(): BaileysLoggerMetrics {
		return {
			connectionAttempts: 0,
			connectionSuccesses: 0,
			connectionFailures: 0,
			messagesSent: 0,
			messagesReceived: 0,
			mediaUploads: 0,
			mediaDownloads: 0,
			retryAttempts: 0,
			encryptionOperations: 0,
			errorsByCategory: {
				connection: 0,
				auth: 0,
				message: 0,
				media: 0,
				group: 0,
				presence: 0,
				call: 0,
				sync: 0,
				encryption: 0,
				retry: 0,
				socket: 0,
				binary: 0,
				unknown: 0,
			},
		}
	}

	get level(): string {
		return this.config.level
	}

	set level(newLevel: string) {
		this.config.level = newLevel as LogLevel
		this.structuredLogger.level = newLevel
	}

	/**
	 * Create child logger with additional context
	 */
	child(obj: Record<string, unknown>): BaileysLogger {
		const childLogger = new BaileysLogger(this.config)
		childLogger.childContext = { ...this.childContext, ...obj }
		return childLogger
	}

	/**
	 * Detect log category based on content
	 */
	private detectCategory(obj: unknown, msg?: string): BaileysLogCategory {
		const searchText = [
			msg || '',
			typeof obj === 'string' ? obj : '',
			typeof obj === 'object' && obj !== null ? JSON.stringify(obj) : '',
		].join(' ')

		for (const { pattern, category } of CATEGORY_PATTERNS) {
			if (pattern.test(searchText)) {
				return category
			}
		}

		return 'unknown'
	}

	/**
	 * Check if category should be logged
	 */
	private shouldLogCategory(category: BaileysLogCategory, _level: LogLevel): boolean {
		if (this.config.ignoredCategories.includes(category)) {
			return false
		}

		// Verbose categories always log at debug or higher
		if (this.config.verboseCategories.includes(category)) {
			return true
		}

		return true
	}

	/**
	 * Sanitize message payload
	 */
	private sanitizePayload(obj: unknown): unknown {
		if (!this.config.logMessagePayloads) {
			if (typeof obj === 'object' && obj !== null) {
				const sanitized = { ...(obj as Record<string, unknown>) }

				// Remove sensitive message fields
				const sensitiveFields = ['body', 'text', 'content', 'caption', 'payload', 'data']
				for (const field of sensitiveFields) {
					if (field in sanitized) {
						const value = sanitized[field]
						if (typeof value === 'string' && value.length > 0) {
							sanitized[field] = `[${value.length} chars]`
						} else if (Buffer.isBuffer(value)) {
							sanitized[field] = `[Buffer: ${value.length} bytes]`
						}
					}
				}

				return sanitized
			}
		}

		// Limit payload size
		if (typeof obj === 'object' && obj !== null) {
			const str = JSON.stringify(obj)
			if (str.length > this.config.maxPayloadSize) {
				return {
					_truncated: true,
					_originalSize: str.length,
					_preview: str.substring(0, 200) + '...',
				}
			}
		}

		return obj
	}

	/**
	 * Update metrics based on log
	 */
	private updateMetrics(category: BaileysLogCategory, level: LogLevel, obj: unknown): void {
		const objStr = typeof obj === 'object' ? JSON.stringify(obj) : String(obj)

		switch (category) {
			case 'connection':
				if (/attempt|trying|connecting/i.test(objStr)) {
					this.metrics.connectionAttempts++
				} else if (/success|connected|open/i.test(objStr)) {
					this.metrics.connectionSuccesses++
					this.metrics.lastConnectionTime = new Date().toISOString()
				} else if (/fail|error|close/i.test(objStr)) {
					this.metrics.connectionFailures++
				}
				break

			case 'message':
				if (/send|sent|outgoing/i.test(objStr)) {
					this.metrics.messagesSent++
					this.metrics.lastMessageTime = new Date().toISOString()
				} else if (/recv|received|incoming/i.test(objStr)) {
					this.metrics.messagesReceived++
					this.metrics.lastMessageTime = new Date().toISOString()
				}
				break

			case 'media':
				if (/upload/i.test(objStr)) {
					this.metrics.mediaUploads++
				} else if (/download/i.test(objStr)) {
					this.metrics.mediaDownloads++
				}
				break

			case 'retry':
				this.metrics.retryAttempts++
				break

			case 'encryption':
				this.metrics.encryptionOperations++
				break
		}

		if (level === 'error' || level === 'fatal') {
			this.metrics.errorsByCategory[category]++
		}
	}

	/**
	 * Main log method
	 */
	private log(level: LogLevel, obj: unknown, msg?: string): void {
		const category = this.detectCategory(obj, msg)

		if (!this.shouldLogCategory(category, level)) {
			return
		}

		// Update metrics
		this.updateMetrics(category, level, obj)

		// Sanitize payload
		const sanitizedObj = this.sanitizePayload(obj)

		// Add Baileys context
		const enrichedObj = {
			category,
			instanceId: this.config.instanceId,
			...this.childContext,
			...(typeof sanitizedObj === 'object' && sanitizedObj !== null ? sanitizedObj : { value: sanitizedObj }),
		}

		// Structured log (skip if level is 'silent')
		if (level !== 'silent') {
			const logMethod = this.structuredLogger[level] as ((obj: unknown, msg?: string) => void) | undefined
			if (logMethod) {
				logMethod.call(this.structuredLogger, enrichedObj, msg)
			}
		}

		// Event handler
		if (this.config.eventHandler) {
			const entry: LogEntry = {
				timestamp: new Date().toISOString(),
				level,
				levelValue: 0,
				message: msg || '',
				name: `baileys:${this.config.instanceId}`,
				data: enrichedObj,
			}
			this.config.eventHandler(category, entry)
		}
	}

	trace(obj: unknown, msg?: string): void {
		this.log('trace', obj, msg)
	}

	debug(obj: unknown, msg?: string): void {
		this.log('debug', obj, msg)
	}

	info(obj: unknown, msg?: string): void {
		this.log('info', obj, msg)
	}

	warn(obj: unknown, msg?: string): void {
		this.log('warn', obj, msg)
	}

	error(obj: unknown, msg?: string): void {
		this.log('error', obj, msg)
	}

	/**
	 * Log connection-specific event
	 */
	logConnection(event: 'connecting' | 'connected' | 'disconnected' | 'error', details?: Record<string, unknown>): void {
		const level: LogLevel = event === 'error' ? 'error' : event === 'disconnected' ? 'warn' : 'info'
		this.log(level, { event, ...details, category: 'connection' }, `Connection ${event}`)
	}

	/**
	 * Log message-specific event
	 */
	logMessage(
		direction: 'send' | 'receive',
		messageType: string,
		jid: string,
		details?: Record<string, unknown>
	): void {
		const sanitizedJid = this.sanitizeJid(jid)
		this.log(
			'info',
			{
				direction,
				messageType,
				jid: sanitizedJid,
				...details,
				category: 'message',
			},
			`Message ${direction}: ${messageType}`
		)
	}

	/**
	 * Log media-specific event
	 */
	logMedia(
		operation: 'upload' | 'download',
		mediaType: string,
		size: number,
		details?: Record<string, unknown>
	): void {
		this.log(
			'info',
			{
				operation,
				mediaType,
				sizeBytes: size,
				sizeFormatted: this.formatBytes(size),
				...details,
				category: 'media',
			},
			`Media ${operation}: ${mediaType}`
		)
	}

	/**
	 * Sanitize JID for logging (mask part of number)
	 */
	private sanitizeJid(jid: string): string {
		if (process.env.NODE_ENV === 'production') {
			// In production, mask part of the number
			const parts = jid.split('@')
			const localPart = parts[0]
			const domain = parts[1]
			if (parts.length === 2 && localPart && domain && localPart.length > 4) {
				return `${localPart.substring(0, 4)}****@${domain}`
			}
		}
		return jid
	}

	/**
	 * Format bytes for human readability
	 */
	private formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B'
		const k = 1024
		const sizes = ['B', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
	}

	/**
	 * Get logger metrics
	 */
	getMetrics(): BaileysLoggerMetrics {
		return { ...this.metrics }
	}

	/**
	 * Get internal structured logger metrics
	 */
	getStructuredMetrics() {
		return this.structuredLogger.getMetrics()
	}

	/**
	 * Reset metrics
	 */
	resetMetrics(): void {
		this.metrics = this.createInitialMetrics()
		this.structuredLogger.resetMetrics()
	}

	/**
	 * Get instance ID
	 */
	getInstanceId(): string {
		return this.config.instanceId
	}
}

/**
 * Factory to create Baileys Logger
 */
export function createBaileysLogger(config?: Partial<BaileysLoggerConfig>): BaileysLogger {
	return new BaileysLogger(config)
}

/**
 * Default Baileys logger singleton
 */
let defaultBaileysLogger: BaileysLogger | null = null

export function getDefaultBaileysLogger(): BaileysLogger {
	if (!defaultBaileysLogger) {
		defaultBaileysLogger = createBaileysLogger({
			level: 'info',
		})
	}
	return defaultBaileysLogger
}

export function setDefaultBaileysLogger(logger: BaileysLogger): void {
	defaultBaileysLogger = logger
}

export default BaileysLogger
