/**
 * Unified Session Telemetry Implementation
 *
 * This module implements WhatsApp's unified_session telemetry feature to reduce
 * detection of unofficial clients. The implementation is inspired by:
 * - whatsmeow PR #1057 (Go implementation)
 * - Baileys PR #2294 (TypeScript implementation)
 *
 * The unified_session is a time-based identifier that mimics the behavior of
 * official WhatsApp Web clients, potentially reducing account restriction warnings.
 *
 * @module Utils/unified-session
 * @see https://github.com/tulir/whatsmeow/pull/1057
 * @see https://github.com/WhiskeySockets/Baileys/pull/2294
 */

import { metrics } from './prometheus-metrics.js'
import type { ILogger } from './logger.js'
import type { BinaryNode } from '../WABinary/types.js'
import {
	CircuitBreaker,
	CircuitOpenError,
	createConnectionCircuitBreaker
} from './circuit-breaker.js'

// ============================================
// Time Constants (Enterprise-grade)
// ============================================

// Import TimeMs from Defaults (single source of truth)
import { TimeMs } from '../Defaults/index.js'

// Re-export for convenience (but not as main export to avoid conflicts)
export { TimeMs }

/**
 * Offset for session ID calculation (3 days in ms).
 * This matches the WhatsApp Web official client behavior.
 */
const SESSION_OFFSET_MS = 3 * TimeMs.Day

// ============================================
// Types
// ============================================

/**
 * Unified Session Manager options
 */
export interface UnifiedSessionOptions {
	/** Whether unified session telemetry is enabled */
	enabled?: boolean
	/** Logger instance for debugging */
	logger?: ILogger
	/** Enable circuit breaker protection for send operations */
	enableCircuitBreaker?: boolean
	/** Function to send binary nodes to WhatsApp */
	sendNode?: (node: BinaryNode) => Promise<void>
}

/**
 * Unified Session state
 */
export interface UnifiedSessionState {
	/** Server time offset in milliseconds (server time - local time) */
	serverTimeOffset: number
	/** Last time unified_session was sent (Unix timestamp ms) */
	lastSentTime: number
	/** Total number of unified_session messages sent */
	sendCount: number
	/** Whether the session manager is initialized */
	isInitialized: boolean
}

/**
 * Trigger types for unified session sending
 */
export type UnifiedSessionTrigger = 'login' | 'pairing' | 'presence' | 'manual'

// ============================================
// Core Implementation
// ============================================

/**
 * Unified Session Manager
 *
 * Manages the unified_session telemetry feature with:
 * - Server time synchronization
 * - Rate limiting (prevents spam)
 * - Circuit breaker protection
 * - Prometheus metrics integration
 * - Structured logging
 *
 * @example
 * ```typescript
 * const sessionManager = new UnifiedSessionManager({
 *   enabled: true,
 *   logger: myLogger,
 *   sendNode: (node) => sock.sendNode(node)
 * })
 *
 * // Update server time offset when receiving server timestamp
 * sessionManager.updateServerTimeOffset(serverTimeAttr)
 *
 * // Send unified_session on login
 * await sessionManager.send('login')
 * ```
 */
export class UnifiedSessionManager {
	private state: UnifiedSessionState = {
		serverTimeOffset: 0,
		lastSentTime: 0,
		sendCount: 0,
		isInitialized: false
	}

	private readonly options: Required<UnifiedSessionOptions>
	private circuitBreaker: CircuitBreaker | null = null

	/** Minimum interval between unified_session sends (1 minute) */
	private static readonly MIN_SEND_INTERVAL_MS = TimeMs.Minute

	constructor(options: UnifiedSessionOptions = {}) {
		this.options = {
			enabled: options.enabled ?? true,
			logger: options.logger ?? console as unknown as ILogger,
			enableCircuitBreaker: options.enableCircuitBreaker ?? true,
			sendNode: options.sendNode ?? (async () => {
				throw new Error('sendNode function not configured')
			})
		}

		// Initialize circuit breaker if enabled
		if (this.options.enableCircuitBreaker) {
			this.circuitBreaker = createConnectionCircuitBreaker({
				name: 'unified-session',
				failureThreshold: 3,
				failureWindow: 60000,
				resetTimeout: 30000,
				successThreshold: 1,
				timeout: 10000,
				onStateChange: (from, to) => {
					this.options.logger.debug?.({ from, to }, 'Unified session circuit breaker state changed')
				},
				onOpen: () => {
					this.options.logger.warn?.('Unified session circuit breaker OPENED')
					metrics.circuitBreakerTrips?.inc({ name: 'unified-session' })
				}
			})
		}

		this.state.isInitialized = true
		this.options.logger.debug?.('UnifiedSessionManager initialized')
	}

	/**
	 * Update the server time offset from a received server timestamp.
	 *
	 * WhatsApp includes a 't' attribute in some nodes containing the server's
	 * Unix timestamp (in seconds). We use this to calculate the offset between
	 * server time and local time.
	 *
	 * @param serverTime - Server timestamp (seconds) from node.attrs.t
	 */
	updateServerTimeOffset(serverTime: string | number | undefined): void {
		if (serverTime === undefined || serverTime === null) {
			return
		}

		const serverTimeNum = typeof serverTime === 'string'
			? parseInt(serverTime, 10)
			: serverTime

		if (isNaN(serverTimeNum) || serverTimeNum <= 0) {
			this.options.logger.debug?.(
				{ serverTime },
				'Invalid server time received, ignoring'
			)
			return
		}

		// Server time is in seconds, convert to ms
		const serverTimeMs = serverTimeNum * 1000
		const localTimeMs = Date.now()
		const newOffset = serverTimeMs - localTimeMs

		// Only update if the offset changed significantly (>1 second)
		if (Math.abs(newOffset - this.state.serverTimeOffset) > 1000) {
			const oldOffset = this.state.serverTimeOffset
			this.state.serverTimeOffset = newOffset

			this.options.logger.debug?.(
				{ oldOffset, newOffset, serverTime: serverTimeNum },
				'Server time offset updated'
			)

			// Record metric
			metrics.socketEvents?.inc({ event: 'server_time_sync' })
		}
	}

	/**
	 * Calculate the unified session ID.
	 *
	 * The algorithm matches WhatsApp Web's official implementation:
	 * - Takes current time adjusted by server offset
	 * - Adds 3-day offset
	 * - Modulo 7 days (one week cycle)
	 * - Returns as string
	 *
	 * @returns The unified session ID as a string
	 */
	getSessionId(): string {
		const adjustedTime = Date.now() + this.state.serverTimeOffset
		const sessionId = (adjustedTime + SESSION_OFFSET_MS) % TimeMs.Week
		return String(Math.floor(sessionId))
	}

	/**
	 * Check if enough time has passed since the last send.
	 * Prevents spamming the server with unified_session messages.
	 */
	private canSend(): boolean {
		const timeSinceLastSend = Date.now() - this.state.lastSentTime
		return timeSinceLastSend >= UnifiedSessionManager.MIN_SEND_INTERVAL_MS
	}

	/**
	 * Send the unified_session telemetry to WhatsApp.
	 *
	 * This should be called at specific trigger points:
	 * - After successful login (CB:success)
	 * - After successful pairing (CB:iq,,pair-success)
	 * - When sending 'available' presence
	 *
	 * @param trigger - What triggered this send (for logging/metrics)
	 * @returns Promise that resolves when sent, or void if skipped
	 */
	async send(trigger: UnifiedSessionTrigger = 'manual'): Promise<void> {
		// Check if enabled
		if (!this.options.enabled) {
			this.options.logger.trace?.('Unified session is disabled, skipping')
			return
		}

		// Rate limiting (except for login which always sends)
		if (trigger !== 'login' && !this.canSend()) {
			this.options.logger.trace?.(
				{ trigger, lastSent: this.state.lastSentTime },
				'Unified session rate limited, skipping'
			)
			return
		}

		const sessionId = this.getSessionId()
		const startTime = Date.now()

		const node: BinaryNode = {
			tag: 'ib',
			attrs: {},
			content: [{
				tag: 'unified_session',
				attrs: { id: sessionId }
			}]
		}

		const sendOperation = async (): Promise<void> => {
			await this.options.sendNode(node)

			// Update state on success
			this.state.lastSentTime = Date.now()
			this.state.sendCount++

			const latency = Date.now() - startTime

			this.options.logger.debug?.(
				{ sessionId, trigger, latency, sendCount: this.state.sendCount },
				'Unified session telemetry sent'
			)

			// Record metrics
			metrics.socketEvents?.inc({ event: 'unified_session_sent' })
		}

		try {
			// Execute with circuit breaker if available
			if (this.circuitBreaker) {
				await this.circuitBreaker.execute(sendOperation)
			} else {
				await sendOperation()
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error)

			if (error instanceof CircuitOpenError) {
				this.options.logger.warn?.(
					{ trigger, circuitState: error.state },
					'Unified session blocked by circuit breaker'
				)
			} else {
				this.options.logger.warn?.(
					{ trigger, error: errorMessage },
					'Failed to send unified session telemetry'
				)
			}

			// Record failure metric
			metrics.errors?.inc({ category: 'unified_session', code: 'send_failed' })

			// Don't rethrow - unified_session is non-critical
		}
	}

	/**
	 * Get the current state for debugging/monitoring.
	 */
	getState(): Readonly<UnifiedSessionState> {
		return { ...this.state }
	}

	/**
	 * Reset the manager state (useful for testing or reconnection).
	 */
	reset(): void {
		this.state = {
			serverTimeOffset: 0,
			lastSentTime: 0,
			sendCount: 0,
			isInitialized: true
		}
		this.circuitBreaker?.reset()
		this.options.logger.debug?.('UnifiedSessionManager reset')
	}

	/**
	 * Destroy the manager and clean up resources.
	 */
	destroy(): void {
		this.circuitBreaker?.destroy()
		this.state.isInitialized = false
		this.options.logger.debug?.('UnifiedSessionManager destroyed')
	}
}

// ============================================
// Factory Function
// ============================================

/**
 * Create a new UnifiedSessionManager instance.
 *
 * @param options - Configuration options
 * @returns A new UnifiedSessionManager instance
 *
 * @example
 * ```typescript
 * const sessionManager = createUnifiedSessionManager({
 *   enabled: config.enableUnifiedSession,
 *   logger: config.logger,
 *   sendNode: sock.sendNode
 * })
 * ```
 */
export function createUnifiedSessionManager(
	options: UnifiedSessionOptions = {}
): UnifiedSessionManager {
	return new UnifiedSessionManager(options)
}

// ============================================
// Utility Functions
// ============================================

/**
 * Extract server time from a binary node's attributes.
 * WhatsApp includes 't' attribute in various nodes.
 *
 * @param node - Binary node with potential time attribute
 * @returns Server time in seconds, or undefined if not present
 */
export function extractServerTime(node: BinaryNode): number | undefined {
	const timeAttr = node.attrs?.t
	if (timeAttr === undefined || timeAttr === null) {
		return undefined
	}

	const parsed = typeof timeAttr === 'string'
		? parseInt(timeAttr, 10)
		: typeof timeAttr === 'number'
			? timeAttr
			: undefined

	if (parsed === undefined || isNaN(parsed) || parsed <= 0) {
		return undefined
	}

	return parsed
}

/**
 * Check if unified_session should be enabled based on environment.
 * Can be controlled via environment variable for testing.
 *
 * @returns true if unified_session should be enabled
 */
export function shouldEnableUnifiedSession(): boolean {
	const envValue = process.env.BAILEYS_UNIFIED_SESSION_ENABLED
	if (envValue !== undefined) {
		return envValue.toLowerCase() === 'true' || envValue === '1'
	}
	// Default: enabled
	return true
}

export default UnifiedSessionManager
