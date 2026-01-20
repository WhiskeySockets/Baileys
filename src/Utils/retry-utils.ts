/**
 * Smart Retry Logic
 *
 * Provides:
 * - Exponential backoff
 * - Jitter to avoid thundering herd
 * - Configurable max attempts
 * - Customizable retry predicates
 * - Circuit breaker integration
 * - Event hooks
 * - Cancellation support
 *
 * @module Utils/retry-utils
 */

import { EventEmitter } from 'events'
import { metrics } from './prometheus-metrics.js'
import type { CircuitBreaker } from './circuit-breaker.js'
import { RETRY_BACKOFF_DELAYS, RETRY_JITTER_FACTOR } from '../Defaults/index.js'

/**
 * Backoff strategies
 */
export type BackoffStrategy = 'exponential' | 'linear' | 'constant' | 'fibonacci'

/**
 * Retry configuration options
 */
export interface RetryOptions {
	/** Maximum number of attempts (default: 3) */
	maxAttempts?: number
	/** Base delay in ms (default: 1000) */
	baseDelay?: number
	/** Maximum delay in ms (default: 30000) */
	maxDelay?: number
	/** Backoff strategy (default: exponential) */
	backoffStrategy?: BackoffStrategy
	/** Multiplier for exponential backoff (default: 2) */
	backoffMultiplier?: number
	/** Jitter percentage (0-1, default: 0.1) */
	jitter?: number
	/** Function to determine if should retry */
	shouldRetry?: (error: Error, attempt: number) => boolean | Promise<boolean>
	/** Timeout per attempt in ms */
	timeout?: number
	/** Operation name for metrics */
	operationName?: string
	/** Collect metrics */
	collectMetrics?: boolean
	/** Circuit breaker for integration */
	circuitBreaker?: CircuitBreaker
	/** Callback before each retry */
	onRetry?: (error: Error, attempt: number, delay: number) => void | Promise<void>
	/** Callback on success */
	onSuccess?: (result: unknown, attempt: number) => void
	/** Callback on final failure */
	onFailure?: (error: Error, attempts: number) => void
	/** Signal for cancellation */
	abortSignal?: AbortSignal
}

/**
 * Result of operation with retry
 */
export interface RetryResult<T> {
	success: boolean
	result?: T
	error?: Error
	attempts: number
	totalDuration: number
	lastAttemptDuration: number
}

/**
 * Retry context
 */
export interface RetryContext {
	attempt: number
	maxAttempts: number
	lastError?: Error
	startTime: number
	aborted: boolean
}

/**
 * Retry exhausted error
 */
export class RetryExhaustedError extends Error {
	constructor(
		public readonly originalError: Error,
		public readonly attempts: number,
		public readonly operationName?: string
	) {
		super(
			`Retry exhausted after ${attempts} attempts${operationName ? ` for "${operationName}"` : ''}: ${originalError.message}`
		)
		this.name = 'RetryExhaustedError'
	}
}

/**
 * Abort error
 */
export class RetryAbortedError extends Error {
	constructor(public readonly attempt: number) {
		super(`Retry aborted at attempt ${attempt}`)
		this.name = 'RetryAbortedError'
	}
}

/**
 * Calculate delay based on strategy
 */
export function calculateDelay(
	attempt: number,
	baseDelay: number,
	maxDelay: number,
	strategy: BackoffStrategy,
	multiplier: number,
	jitter: number
): number {
	let delay: number

	switch (strategy) {
		case 'exponential':
			delay = baseDelay * Math.pow(multiplier, attempt - 1)
			break

		case 'linear':
			delay = baseDelay * attempt
			break

		case 'constant':
			delay = baseDelay
			break

		case 'fibonacci': {
			const fib = fibonacciNumber(attempt)
			delay = baseDelay * fib
			break
		}

		default:
			delay = baseDelay
	}

	// Apply max delay cap
	delay = Math.min(delay, maxDelay)

	// Apply jitter
	if (jitter > 0) {
		const jitterAmount = delay * jitter
		delay = delay + (Math.random() * 2 - 1) * jitterAmount
	}

	return Math.max(0, Math.round(delay))
}

/**
 * Calculate Fibonacci number
 */
function fibonacciNumber(n: number): number {
	if (n <= 1) return 1
	let a = 1,
		b = 1
	for (let i = 2; i < n; i++) {
		const c = a + b
		a = b
		b = c
	}
	return b
}

/**
 * Sleep with abort support
 */
async function sleep(ms: number, signal?: AbortSignal): Promise<void> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(resolve, ms)

		if (signal) {
			if (signal.aborted) {
				clearTimeout(timer)
				reject(new RetryAbortedError(0))
				return
			}

			const abortHandler = () => {
				clearTimeout(timer)
				reject(new RetryAbortedError(0))
			}

			signal.addEventListener('abort', abortHandler, { once: true })
		}
	})
}

/**
 * Execute operation with timeout
 */
async function executeWithTimeout<T>(
	operation: () => Promise<T>,
	timeout: number,
	signal?: AbortSignal
): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		let completed = false

		const timer = setTimeout(() => {
			if (!completed) {
				completed = true
				reject(new Error(`Operation timed out after ${timeout}ms`))
			}
		}, timeout)

		if (signal?.aborted) {
			clearTimeout(timer)
			reject(new RetryAbortedError(0))
			return
		}

		operation()
			.then((result) => {
				if (!completed) {
					completed = true
					clearTimeout(timer)
					resolve(result)
				}
			})
			.catch((error) => {
				if (!completed) {
					completed = true
					clearTimeout(timer)
					reject(error)
				}
			})
	})
}

/**
 * Main retry function
 */
export async function retry<T>(
	operation: (context: RetryContext) => T | Promise<T>,
	options: RetryOptions = {}
): Promise<T> {
	const config = {
		maxAttempts: options.maxAttempts ?? 3,
		baseDelay: options.baseDelay ?? 1000,
		maxDelay: options.maxDelay ?? 30000,
		backoffStrategy: options.backoffStrategy ?? 'exponential',
		backoffMultiplier: options.backoffMultiplier ?? 2,
		jitter: options.jitter ?? 0.1,
		shouldRetry: options.shouldRetry ?? (() => true),
		timeout: options.timeout,
		operationName: options.operationName ?? 'operation',
		collectMetrics: options.collectMetrics ?? true,
		circuitBreaker: options.circuitBreaker,
		onRetry: options.onRetry ?? (() => {}),
		onSuccess: options.onSuccess ?? (() => {}),
		onFailure: options.onFailure ?? (() => {}),
		abortSignal: options.abortSignal,
	}

	const context: RetryContext = {
		attempt: 0,
		maxAttempts: config.maxAttempts,
		startTime: Date.now(),
		aborted: false,
	}

	let lastError: Error | undefined

	// Check initial abort
	if (config.abortSignal?.aborted) {
		throw new RetryAbortedError(0)
	}

	for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
		context.attempt = attempt

		// Check abort
		if (config.abortSignal?.aborted) {
			context.aborted = true
			throw new RetryAbortedError(attempt)
		}

		// Check circuit breaker
		if (config.circuitBreaker?.isOpen()) {
			throw new Error(`Circuit breaker "${config.circuitBreaker.getName()}" is open`)
		}

		try {
			// Execute operation
			let result: T

			if (config.timeout) {
				result = await executeWithTimeout(
					() => Promise.resolve(operation(context)),
					config.timeout,
					config.abortSignal
				)
			} else {
				result = await operation(context)
			}

			// Success
			if (config.collectMetrics) {
				metrics.retries.inc({ operation: config.operationName })
			}

			config.onSuccess(result, attempt)
			return result
		} catch (error) {
			lastError = error as Error
			context.lastError = lastError

			// Check if should retry
			const shouldRetry = await config.shouldRetry(lastError, attempt)

			if (!shouldRetry || attempt >= config.maxAttempts) {
				// Final failure
				if (config.collectMetrics) {
					metrics.errors.inc({ category: 'retry', code: 'exhausted' })
				}

				config.onFailure(lastError, attempt)

				throw new RetryExhaustedError(lastError, attempt, config.operationName)
			}

			// Calculate delay
			const delay = calculateDelay(
				attempt,
				config.baseDelay,
				config.maxDelay,
				config.backoffStrategy,
				config.backoffMultiplier,
				config.jitter
			)

			// Retry callback
			await config.onRetry(lastError, attempt, delay)

			if (config.collectMetrics) {
				metrics.retryLatency.observe({ operation: config.operationName }, delay)
			}

			// Wait for delay
			await sleep(delay, config.abortSignal)
		}
	}

	// Should never reach here, but TypeScript needs this
	throw new RetryExhaustedError(lastError || new Error('Unknown error'), config.maxAttempts, config.operationName)
}

/**
 * Retry with detailed result
 */
export async function retryWithResult<T>(
	operation: (context: RetryContext) => T | Promise<T>,
	options: RetryOptions = {}
): Promise<RetryResult<T>> {
	const startTime = Date.now()
	let attempts = 0
	let lastAttemptStart = startTime

	try {
		const result = await retry(
			(context) => {
				attempts = context.attempt
				lastAttemptStart = Date.now()
				return operation(context)
			},
			options
		)

		return {
			success: true,
			result,
			attempts,
			totalDuration: Date.now() - startTime,
			lastAttemptDuration: Date.now() - lastAttemptStart,
		}
	} catch (error) {
		return {
			success: false,
			error: error as Error,
			attempts,
			totalDuration: Date.now() - startTime,
			lastAttemptDuration: Date.now() - lastAttemptStart,
		}
	}
}

/**
 * Factory to create configured retry function
 */
export function createRetrier(defaultOptions: RetryOptions = {}) {
	return <T>(
		operation: (context: RetryContext) => T | Promise<T>,
		options?: RetryOptions
	): Promise<T> => {
		return retry(operation, { ...defaultOptions, ...options })
	}
}

/**
 * Decorator to add retry to method
 */
export function withRetry(options: RetryOptions = {}) {
	return function (
		_target: unknown,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(...args: unknown[]) => unknown>
	) {
		const originalMethod = descriptor.value
		if (!originalMethod) return descriptor

		descriptor.value = async function (...args: unknown[]): Promise<unknown> {
			return retry(
				() => originalMethod.apply(this, args),
				{ ...options, operationName: options.operationName || propertyKey }
			)
		}

		return descriptor
	}
}

/**
 * Wrapper for function with retry
 */
export function retryable<T extends (...args: unknown[]) => unknown>(
	fn: T,
	options: RetryOptions = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
	return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
		return retry(() => fn(...args), options) as Promise<ReturnType<T>>
	}
}

/**
 * Class to manage retries with state
 */
export class RetryManager extends EventEmitter {
	private activeRetries: Map<string, { cancel: () => void; context: RetryContext }> = new Map()
	private defaultOptions: RetryOptions

	constructor(defaultOptions: RetryOptions = {}) {
		super()
		this.defaultOptions = defaultOptions
	}

	/**
	 * Execute operation with retry
	 */
	async execute<T>(
		id: string,
		operation: (context: RetryContext) => T | Promise<T>,
		options?: RetryOptions
	): Promise<T> {
		// Cancel previous retry with same ID
		this.cancel(id)

		const abortController = new AbortController()
		const mergedOptions = { ...this.defaultOptions, ...options, abortSignal: abortController.signal }

		const retryPromise = retry((context) => {
			this.activeRetries.set(id, {
				cancel: () => abortController.abort(),
				context,
			})
			this.emit('attempt', { id, attempt: context.attempt })
			return operation(context)
		}, mergedOptions)

		try {
			const result = await retryPromise
			this.emit('success', { id })
			return result
		} catch (error) {
			this.emit('failure', { id, error })
			throw error
		} finally {
			this.activeRetries.delete(id)
		}
	}

	/**
	 * Cancel in-progress retry
	 */
	cancel(id: string): boolean {
		const active = this.activeRetries.get(id)
		if (active) {
			active.cancel()
			this.activeRetries.delete(id)
			this.emit('cancelled', { id })
			return true
		}
		return false
	}

	/**
	 * Cancel all retries
	 */
	cancelAll(): void {
		for (const [id, active] of this.activeRetries) {
			active.cancel()
			this.emit('cancelled', { id })
		}
		this.activeRetries.clear()
	}

	/**
	 * Check if there is an active retry
	 */
	isActive(id: string): boolean {
		return this.activeRetries.has(id)
	}

	/**
	 * Return active retry context
	 */
	getContext(id: string): RetryContext | undefined {
		return this.activeRetries.get(id)?.context
	}

	/**
	 * Return active retry IDs
	 */
	getActiveIds(): string[] {
		return Array.from(this.activeRetries.keys())
	}
}

/**
 * Common predicates for shouldRetry
 */
export const retryPredicates = {
	/** Always retry (up to max attempts) */
	always: () => true,

	/** Never retry */
	never: () => false,

	/** Retry only on network errors */
	onNetworkError: (error: Error) => {
		const networkErrors = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN']
		return networkErrors.some((code) => error.message.includes(code) || (error as NodeJS.ErrnoException).code === code)
	},

	/** Retry only on specific errors */
	onErrorCodes:
		(codes: string[]) =>
			(error: Error): boolean => {
				return codes.some((code) => error.message.includes(code) || (error as NodeJS.ErrnoException).code === code)
			},

	/** Retry except on specific errors */
	exceptErrorCodes:
		(codes: string[]) =>
			(error: Error): boolean => {
				return !codes.some((code) => error.message.includes(code) || (error as NodeJS.ErrnoException).code === code)
			},

	/** Retry on HTTP 5xx errors or timeout */
	onServerError: (error: Error) => {
		const message = error.message.toLowerCase()
		return (
			message.includes('500') ||
			message.includes('502') ||
			message.includes('503') ||
			message.includes('504') ||
			message.includes('timeout')
		)
	},

	/** Combine multiple predicates with OR */
	or:
		(...predicates: Array<(error: Error, attempt: number) => boolean>) =>
			(error: Error, attempt: number): boolean => {
				return predicates.some((p) => p(error, attempt))
			},

	/** Combine multiple predicates with AND */
	and:
		(...predicates: Array<(error: Error, attempt: number) => boolean>) =>
			(error: Error, attempt: number): boolean => {
				return predicates.every((p) => p(error, attempt))
			},
}

/**
 * Pre-defined retry configurations
 */
export const retryConfigs = {
	/** Aggressive retry (many attempts, short delays) */
	aggressive: {
		maxAttempts: 10,
		baseDelay: 100,
		maxDelay: 5000,
		backoffStrategy: 'exponential' as const,
		jitter: 0.2,
	},

	/** Conservative retry (few attempts, long delays) */
	conservative: {
		maxAttempts: 3,
		baseDelay: 2000,
		maxDelay: 60000,
		backoffStrategy: 'exponential' as const,
		jitter: 0.1,
	},

	/** Fast retry (for short operations) */
	fast: {
		maxAttempts: 5,
		baseDelay: 50,
		maxDelay: 1000,
		backoffStrategy: 'linear' as const,
		jitter: 0.05,
	},

	/** Retry for network operations */
	network: {
		maxAttempts: 5,
		baseDelay: 1000,
		maxDelay: 30000,
		backoffStrategy: 'exponential' as const,
		jitter: 0.1,
		shouldRetry: retryPredicates.onNetworkError,
	},

	/**
	 * RSocket-style retry (uses RETRY_BACKOFF_DELAYS from Defaults)
	 * Delays: 1s, 2s, 5s, 10s, 20s with jitter
	 */
	rsocket: {
		maxAttempts: RETRY_BACKOFF_DELAYS.length,
		baseDelay: RETRY_BACKOFF_DELAYS[0],
		maxDelay: RETRY_BACKOFF_DELAYS[RETRY_BACKOFF_DELAYS.length - 1],
		backoffStrategy: 'exponential' as const,
		jitter: RETRY_JITTER_FACTOR,
	},
}

/**
 * Get retry delay with jitter applied
 * Uses RETRY_BACKOFF_DELAYS and RETRY_JITTER_FACTOR from Defaults
 *
 * @param attempt - Current attempt number (1-based)
 * @returns Delay in ms with jitter applied
 */
export function getRetryDelayWithJitter(attempt: number): number {
	const index = Math.min(Math.max(attempt - 1, 0), RETRY_BACKOFF_DELAYS.length - 1)
	const baseDelay = RETRY_BACKOFF_DELAYS[index] ?? RETRY_BACKOFF_DELAYS[0] ?? 1000
	const jitterRange = baseDelay * RETRY_JITTER_FACTOR
	const jitter = (Math.random() * 2 - 1) * jitterRange // ±15%
	return Math.round(baseDelay + jitter)
}

/**
 * Get all retry delays with jitter for planning
 * @returns Array of delays with jitter applied
 */
export function getAllRetryDelaysWithJitter(): number[] {
	return RETRY_BACKOFF_DELAYS.map((_, i) => getRetryDelayWithJitter(i + 1))
}

export default retry
