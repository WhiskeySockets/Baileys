/**
 * Circuit Breaker Pattern Implementation
 *
 * Provides protection against cascading failures by monitoring operation outcomes
 * and temporarily blocking requests when failure thresholds are exceeded.
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Failures exceeded threshold, requests are blocked
 * - HALF_OPEN: Testing recovery, limited requests allowed
 *
 * @module Utils/circuit-breaker
 */

import { EventEmitter } from 'events'
import { metrics } from './prometheus-metrics.js'

/**
 * Circuit breaker operational states
 */
export type CircuitState = 'closed' | 'open' | 'half-open'

/**
 * Failure record with timestamp for sliding window tracking
 */
export interface FailureRecord {
	timestamp: number
	error: Error
}

/**
 * Circuit breaker configuration options
 */
export interface CircuitBreakerOptions {
	/** Unique identifier for this circuit breaker (used in metrics/logging) */
	name: string
	/** Number of failures within the window to trigger OPEN state (default: 5) */
	failureThreshold?: number
	/** Time window in ms for counting failures (default: 60000) */
	failureWindow?: number
	/** Number of successes required in HALF_OPEN to return to CLOSED (default: 2) */
	successThreshold?: number
	/** Time in ms to wait before transitioning from OPEN to HALF_OPEN (default: 30000) */
	resetTimeout?: number
	/** Timeout for individual operations in ms (default: 10000) */
	timeout?: number
	/** Minimum number of requests before circuit can trip (default: 5) */
	volumeThreshold?: number
	/** Predicate to determine if an error should count as a failure */
	shouldCountError?: (error: Error) => boolean
	/** Whether to collect Prometheus metrics (default: true) */
	collectMetrics?: boolean
	/** Fallback function when circuit is OPEN */
	fallback?: <T>() => T | Promise<T>
	/** Callback when state changes */
	onStateChange?: (from: CircuitState, to: CircuitState) => void
	/** Callback on failure */
	onFailure?: (error: Error) => void
	/** Callback on success */
	onSuccess?: () => void
	/** Callback when circuit opens */
	onOpen?: () => void
	/** Callback when circuit closes */
	onClose?: () => void
	/** Callback when circuit enters half-open */
	onHalfOpen?: () => void
}

/**
 * Circuit breaker statistics
 */
export interface CircuitBreakerStats {
	state: CircuitState
	failures: number
	successes: number
	consecutiveFailures: number
	consecutiveSuccesses: number
	totalCalls: number
	totalFailures: number
	totalSuccesses: number
	totalRejected: number
	failureRate: number
	lastFailureTime?: number
	lastSuccessTime?: number
	lastStateChange?: number
	isOpen: boolean
	isClosed: boolean
	isHalfOpen: boolean
}

/**
 * Error thrown when circuit is OPEN and request is rejected
 */
export class CircuitOpenError extends Error {
	constructor(
		public readonly circuitName: string,
		public readonly state: CircuitState
	) {
		super(`Circuit breaker "${circuitName}" is ${state}`)
		this.name = 'CircuitOpenError'
	}
}

/**
 * Error thrown when operation exceeds timeout
 */
export class CircuitTimeoutError extends Error {
	constructor(
		public readonly circuitName: string,
		public readonly timeoutMs: number
	) {
		super(`Circuit breaker "${circuitName}" operation timed out after ${timeoutMs}ms`)
		this.name = 'CircuitTimeoutError'
	}
}

/**
 * Circuit Breaker implementation with sliding window failure tracking
 *
 * @example
 * ```typescript
 * const breaker = new CircuitBreaker({
 *   name: 'whatsapp-api',
 *   failureThreshold: 5,
 *   resetTimeout: 30000
 * })
 *
 * try {
 *   const result = await breaker.execute(() => sendMessage(msg))
 * } catch (error) {
 *   if (error instanceof CircuitOpenError) {
 *     // Circuit is open, use fallback
 *   }
 * }
 * ```
 */
export class CircuitBreaker extends EventEmitter {
	private state: CircuitState = 'closed'
	private failureRecords: FailureRecord[] = []
	private consecutiveFailures = 0
	private consecutiveSuccesses = 0
	private totalCalls = 0
	private totalFailures = 0
	private totalSuccesses = 0
	private totalRejected = 0
	private lastFailureTime?: number
	private lastSuccessTime?: number
	private lastStateChange: number
	private resetTimer?: ReturnType<typeof setTimeout>
	private readonly options: Required<CircuitBreakerOptions>

	constructor(options: CircuitBreakerOptions) {
		super()

		this.options = {
			name: options.name,
			failureThreshold: options.failureThreshold ?? 5,
			failureWindow: options.failureWindow ?? 60000,
			successThreshold: options.successThreshold ?? 2,
			resetTimeout: options.resetTimeout ?? 30000,
			timeout: options.timeout ?? 10000,
			volumeThreshold: options.volumeThreshold ?? 5,
			shouldCountError: options.shouldCountError ?? (() => true),
			collectMetrics: options.collectMetrics ?? true,
			fallback:
				options.fallback ??
				(() => {
					throw new CircuitOpenError(this.options.name, this.state)
				}),
			onStateChange: options.onStateChange ?? (() => {}),
			onFailure: options.onFailure ?? (() => {}),
			onSuccess: options.onSuccess ?? (() => {}),
			onOpen: options.onOpen ?? (() => {}),
			onClose: options.onClose ?? (() => {}),
			onHalfOpen: options.onHalfOpen ?? (() => {})
		}

		this.lastStateChange = Date.now()
	}

	/**
	 * Check if the circuit allows execution
	 */
	canExecute(): boolean {
		if (this.state === 'closed') {
			return true
		}

		if (this.state === 'open') {
			return false
		}

		// HALF_OPEN: allow limited requests for testing
		return true
	}

	/**
	 * Execute an async operation with circuit breaker protection
	 */
	async execute<T>(operation: () => T | Promise<T>): Promise<T> {
		this.totalCalls++

		// Check if circuit allows execution
		if (this.state === 'open') {
			this.totalRejected++

			if (this.options.collectMetrics) {
				metrics.errors.inc({ category: 'circuit_breaker', code: 'rejected' })
			}

			return this.options.fallback() as T
		}

		// Execute with timeout protection
		try {
			const result = await this.executeWithTimeout(operation)
			this.recordSuccess()
			return result
		} catch (error) {
			this.recordFailure(error as Error)
			throw error
		}
	}

	/**
	 * Execute a synchronous operation with circuit breaker protection
	 */
	executeSync<T>(operation: () => T): T {
		this.totalCalls++

		if (this.state === 'open') {
			this.totalRejected++

			if (this.options.collectMetrics) {
				metrics.errors.inc({ category: 'circuit_breaker', code: 'rejected' })
			}

			return this.options.fallback() as T
		}

		try {
			const result = operation()
			this.recordSuccess()
			return result
		} catch (error) {
			this.recordFailure(error as Error)
			throw error
		}
	}

	/**
	 * Execute operation with timeout wrapper
	 */
	private async executeWithTimeout<T>(operation: () => T | Promise<T>): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const timer = setTimeout(() => {
				reject(new CircuitTimeoutError(this.options.name, this.options.timeout))
			}, this.options.timeout)

			Promise.resolve(operation())
				.then(result => {
					clearTimeout(timer)
					resolve(result)
				})
				.catch(error => {
					clearTimeout(timer)
					reject(error)
				})
		})
	}

	/**
	 * Record a successful operation
	 */
	private recordSuccess(): void {
		this.totalSuccesses++
		this.lastSuccessTime = Date.now()
		this.consecutiveSuccesses++
		this.consecutiveFailures = 0

		if (this.options.collectMetrics) {
			metrics.socketEvents.inc({ event: 'circuit_success' })
		}

		this.options.onSuccess()
		this.emit('success')

		// In HALF_OPEN state, check if we can close the circuit
		if (this.state === 'half-open') {
			if (this.consecutiveSuccesses >= this.options.successThreshold) {
				this.transitionTo('closed')
			}
		}
	}

	/**
	 * Record a failed operation
	 */
	private recordFailure(error: Error): void {
		// Check if this error should count as a failure
		if (!this.options.shouldCountError(error)) {
			return
		}

		const now = Date.now()
		this.totalFailures++
		this.lastFailureTime = now
		this.consecutiveFailures++
		this.consecutiveSuccesses = 0

		// Add to failure records for sliding window
		this.failureRecords.push({ timestamp: now, error })

		// Clean old failures outside the window
		this.cleanOldFailures()

		if (this.options.collectMetrics) {
			metrics.errors.inc({ category: 'circuit_breaker', code: 'failure' })
		}

		this.options.onFailure(error)
		this.emit('failure', error)

		// State transition logic
		if (this.state === 'half-open') {
			// Any failure in HALF_OPEN immediately reopens the circuit
			this.transitionTo('open')
		} else if (this.state === 'closed') {
			// Check if we should trip the circuit
			const recentFailures = this.failureRecords.length

			if (this.totalCalls >= this.options.volumeThreshold && recentFailures >= this.options.failureThreshold) {
				this.transitionTo('open')
			}
		}
	}

	/**
	 * Remove failure records outside the sliding window
	 */
	private cleanOldFailures(): void {
		const cutoff = Date.now() - this.options.failureWindow
		this.failureRecords = this.failureRecords.filter(record => record.timestamp > cutoff)
	}

	/**
	 * Transition to a new state
	 */
	private transitionTo(newState: CircuitState): void {
		const oldState = this.state

		if (oldState === newState) {
			return
		}

		this.state = newState
		this.lastStateChange = Date.now()

		// Clear existing reset timer
		if (this.resetTimer) {
			clearTimeout(this.resetTimer)
			this.resetTimer = undefined
		}

		// State-specific actions
		switch (newState) {
			case 'closed':
				this.consecutiveFailures = 0
				this.consecutiveSuccesses = 0
				this.failureRecords = []
				this.options.onClose()
				this.emit('close')
				break

			case 'open':
				this.consecutiveSuccesses = 0
				this.options.onOpen()
				this.emit('open')

				// Record circuit breaker trip metric
				if (this.options.collectMetrics) {
					metrics.circuitBreakerTrips?.inc({ name: this.options.name })
				}

				// Schedule transition to HALF_OPEN
				this.resetTimer = setTimeout(() => {
					this.transitionTo('half-open')
				}, this.options.resetTimeout)
				break

			case 'half-open':
				this.consecutiveSuccesses = 0
				this.consecutiveFailures = 0
				this.options.onHalfOpen()
				this.emit('half-open')
				break
		}

		this.options.onStateChange(oldState, newState)
		this.emit('state-change', { from: oldState, to: newState })
	}

	/**
	 * Manually trip the circuit to OPEN state
	 */
	trip(): void {
		this.transitionTo('open')
	}

	/**
	 * Manually reset the circuit to CLOSED state
	 */
	reset(): void {
		this.transitionTo('closed')
	}

	/**
	 * Get current circuit state
	 */
	getState(): CircuitState {
		return this.state
	}

	/**
	 * Check if circuit is OPEN
	 */
	isOpen(): boolean {
		return this.state === 'open'
	}

	/**
	 * Check if circuit is CLOSED
	 */
	isClosed(): boolean {
		return this.state === 'closed'
	}

	/**
	 * Check if circuit is HALF_OPEN
	 */
	isHalfOpen(): boolean {
		return this.state === 'half-open'
	}

	/**
	 * Get circuit breaker statistics
	 */
	getStats(): CircuitBreakerStats {
		this.cleanOldFailures()

		const failureRate = this.totalCalls > 0 ? (this.totalFailures / this.totalCalls) * 100 : 0

		return {
			state: this.state,
			failures: this.failureRecords.length,
			successes: this.consecutiveSuccesses,
			consecutiveFailures: this.consecutiveFailures,
			consecutiveSuccesses: this.consecutiveSuccesses,
			totalCalls: this.totalCalls,
			totalFailures: this.totalFailures,
			totalSuccesses: this.totalSuccesses,
			totalRejected: this.totalRejected,
			failureRate,
			lastFailureTime: this.lastFailureTime,
			lastSuccessTime: this.lastSuccessTime,
			lastStateChange: this.lastStateChange,
			isOpen: this.isOpen(),
			isClosed: this.isClosed(),
			isHalfOpen: this.isHalfOpen()
		}
	}

	/**
	 * Get circuit breaker name
	 */
	getName(): string {
		return this.options.name
	}

	/**
	 * Destroy circuit breaker and clean up resources
	 */
	destroy(): void {
		if (this.resetTimer) {
			clearTimeout(this.resetTimer)
		}

		this.failureRecords = []
		this.removeAllListeners()
	}
}

/**
 * Factory function to create a circuit breaker
 */
export function createCircuitBreaker(options: CircuitBreakerOptions): CircuitBreaker {
	return new CircuitBreaker(options)
}

/**
 * Registry for managing multiple circuit breakers
 */
export class CircuitBreakerRegistry {
	private breakers: Map<string, CircuitBreaker> = new Map()

	/**
	 * Get or create a circuit breaker by name
	 */
	get(name: string, options?: Omit<CircuitBreakerOptions, 'name'>): CircuitBreaker {
		if (!this.breakers.has(name)) {
			const breaker = new CircuitBreaker({ ...options, name })
			this.breakers.set(name, breaker)
		}

		return this.breakers.get(name)!
	}

	/**
	 * Check if a circuit breaker exists
	 */
	has(name: string): boolean {
		return this.breakers.has(name)
	}

	/**
	 * Remove a circuit breaker
	 */
	remove(name: string): boolean {
		const breaker = this.breakers.get(name)
		if (breaker) {
			breaker.destroy()
			return this.breakers.delete(name)
		}

		return false
	}

	/**
	 * Get all circuit breakers
	 */
	getAll(): Map<string, CircuitBreaker> {
		return new Map(this.breakers)
	}

	/**
	 * Get statistics for all circuit breakers
	 */
	getAllStats(): Record<string, CircuitBreakerStats> {
		const stats: Record<string, CircuitBreakerStats> = {}
		for (const [name, breaker] of this.breakers) {
			stats[name] = breaker.getStats()
		}

		return stats
	}

	/**
	 * Reset all circuit breakers to CLOSED state
	 */
	resetAll(): void {
		for (const breaker of this.breakers.values()) {
			breaker.reset()
		}
	}

	/**
	 * Destroy all circuit breakers
	 */
	destroyAll(): void {
		for (const breaker of this.breakers.values()) {
			breaker.destroy()
		}

		this.breakers.clear()
	}
}

/**
 * Global circuit breaker registry instance
 */
export const globalCircuitRegistry = new CircuitBreakerRegistry()

/**
 * Decorator to protect a method with circuit breaker
 *
 * @example
 * ```typescript
 * class MyService {
 *   @circuitBreaker({ failureThreshold: 3 })
 *   async fetchData() {
 *     return await api.getData()
 *   }
 * }
 * ```
 */
export function circuitBreaker(options: Omit<CircuitBreakerOptions, 'name'> & { name?: string } = {}) {
	return function (
		_target: unknown,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(...args: unknown[]) => unknown>
	) {
		const originalMethod = descriptor.value
		if (!originalMethod) return descriptor

		const name = options.name || propertyKey
		const breaker = globalCircuitRegistry.get(name, options)

		descriptor.value = async function (...args: unknown[]): Promise<unknown> {
			return breaker.execute(() => originalMethod.apply(this, args))
		}

		return descriptor
	}
}

/**
 * Wrap a function with circuit breaker protection
 *
 * @example
 * ```typescript
 * const protectedFetch = withCircuitBreaker(
 *   fetchData,
 *   { name: 'api-fetch', failureThreshold: 5 }
 * )
 * ```
 */
// eslint-disable-next-line space-before-function-paren
export function withCircuitBreaker<T extends (...args: unknown[]) => unknown>(
	fn: T,
	options: CircuitBreakerOptions
): T {
	const breaker = new CircuitBreaker(options)

	return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
		return breaker.execute(() => fn(...args)) as Promise<ReturnType<T>>
	}) as unknown as T
}

/**
 * Get health status of all circuit breakers
 */
export function getCircuitHealth(): {
	healthy: boolean
	openCircuits: string[]
	stats: Record<string, CircuitBreakerStats>
} {
	const stats = globalCircuitRegistry.getAllStats()
	const openCircuits: string[] = []

	for (const [name, stat] of Object.entries(stats)) {
		if (stat.isOpen) {
			openCircuits.push(name)
		}
	}

	return {
		healthy: openCircuits.length === 0,
		openCircuits,
		stats
	}
}

/**
 * Create a pre-configured circuit breaker for WhatsApp PreKey operations
 *
 * This circuit breaker is optimized for handling encryption/session errors
 * that commonly occur with WhatsApp's Signal protocol implementation.
 *
 * @example
 * ```typescript
 * const preKeyBreaker = createPreKeyCircuitBreaker()
 *
 * async function sendEncryptedMessage(msg) {
 *   return preKeyBreaker.execute(async () => {
 *     return await encryptAndSend(msg)
 *   })
 * }
 * ```
 */
export function createPreKeyCircuitBreaker(customOptions?: Partial<CircuitBreakerOptions>): CircuitBreaker {
	const preKeyErrorPatterns = ['prekey', 'pre-key', 'session', 'signal', 'encrypt', 'decrypt', 'cipher', 'key']

	return new CircuitBreaker({
		name: 'prekey-operations',
		failureThreshold: 5,
		failureWindow: 60000,
		resetTimeout: 30000,
		successThreshold: 2,
		shouldCountError: (error: Error) => {
			const message = error.message.toLowerCase()
			return preKeyErrorPatterns.some(pattern => message.includes(pattern))
		},
		...customOptions
	})
}

/**
 * Create a circuit breaker for WebSocket connection operations
 */
export function createConnectionCircuitBreaker(customOptions?: Partial<CircuitBreakerOptions>): CircuitBreaker {
	const connectionErrorPatterns = [
		'econnrefused',
		'econnreset',
		'etimedout',
		'enotfound',
		'socket',
		'websocket',
		'connection',
		'network'
	]

	return new CircuitBreaker({
		name: 'connection-operations',
		failureThreshold: 3,
		failureWindow: 30000,
		resetTimeout: 60000,
		successThreshold: 1,
		shouldCountError: (error: Error) => {
			// CircuitTimeoutError messages embed the circuit name (e.g. "socket-query"), which
			// accidentally matches the "socket" pattern below and causes a self-reinforcing loop
			// where the breaker's own timeouts keep tripping the breaker. Exclude them explicitly.
			if (error instanceof CircuitTimeoutError) return false
			const message = error.message.toLowerCase()
			const code = (error as NodeJS.ErrnoException).code?.toLowerCase() || ''
			return connectionErrorPatterns.some(pattern => message.includes(pattern) || code.includes(pattern))
		},
		...customOptions
	})
}

/**
 * Create a circuit breaker for message sending operations
 */
export function createMessageCircuitBreaker(customOptions?: Partial<CircuitBreakerOptions>): CircuitBreaker {
	return new CircuitBreaker({
		name: 'message-operations',
		failureThreshold: 5,
		failureWindow: 60000,
		resetTimeout: 15000,
		successThreshold: 2,
		timeout: 30000,
		...customOptions
	})
}

export default CircuitBreaker
