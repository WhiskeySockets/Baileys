/**
 * Structured Logging System for InfiniteAPI
 *
 * Enterprise-grade features:
 * - Environment variable configuration (BAILEYS_LOG_*)
 * - Configurable log levels (trace, debug, info, warn, error, fatal)
 * - JSON formatting for log analysis
 * - Hierarchical context with child loggers
 * - External system integration via hooks with circuit breaker
 * - Logging metrics with Prometheus integration
 * - Sensitive data sanitization
 * - Log buffering for batch writes
 * - Rate limiting to prevent flooding
 * - Async logging queue for non-blocking operations
 * - Proper resource cleanup (destroy)
 *
 * @module Utils/structured-logger
 */

import type { ILogger } from './logger.js'

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Available log levels (ordered by severity)
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'

/**
 * Numeric values for each log level
 */
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
	trace: 10,
	debug: 20,
	info: 30,
	warn: 40,
	error: 50,
	fatal: 60,
	silent: 100,
}

/**
 * Structured logger configuration
 */
export interface StructuredLoggerConfig {
	/** Minimum log level to record */
	level: LogLevel
	/** Service/component name */
	name?: string
	/** Additional context to include in all logs */
	context?: Record<string, unknown>
	/** Format as JSON (true) or human-readable text (false) */
	jsonFormat?: boolean
	/** Fields to sanitize (passwords, tokens, etc.) */
	redactFields?: string[]
	/** Hook for sending logs to external systems */
	externalHook?: (entry: LogEntry) => void | Promise<void>
	/** Include stack trace in errors */
	includeStackTrace?: boolean
	/** Timezone for timestamps (default: UTC) */
	timezone?: string
	/** Enable log buffering for batch writes */
	enableBuffering?: boolean
	/** Buffer flush interval in ms (default: 1000) */
	bufferFlushIntervalMs?: number
	/** Maximum buffer size before auto-flush (default: 100) */
	maxBufferSize?: number
	/** Enable rate limiting (default: false) */
	enableRateLimiting?: boolean
	/** Max logs per second (default: 1000) */
	maxLogsPerSecond?: number
	/** Enable async logging queue (default: false) */
	enableAsyncQueue?: boolean
	/** Circuit breaker failure threshold for external hooks (default: 5) */
	circuitBreakerThreshold?: number
	/** Circuit breaker reset timeout in ms (default: 30000) */
	circuitBreakerResetMs?: number
	/** Enable Prometheus metrics integration (default: false) */
	enableMetrics?: boolean
}

/**
 * Internal resolved configuration with required fields
 * externalHook remains optional since it may not be provided
 */
type ResolvedLoggerConfig = Omit<Required<StructuredLoggerConfig>, 'externalHook'> & {
	externalHook?: (entry: LogEntry) => void | Promise<void>
}

/**
 * Load configuration from environment variables
 */
export function loadLoggerConfig(): Partial<StructuredLoggerConfig> {
	const level = process.env.BAILEYS_LOG_LEVEL as LogLevel | undefined
	return {
		level: level && level in LOG_LEVEL_VALUES ? level : undefined,
		name: process.env.BAILEYS_LOG_NAME,
		jsonFormat: process.env.BAILEYS_LOG_JSON === 'true' || process.env.NODE_ENV === 'production',
		enableBuffering: process.env.BAILEYS_LOG_BUFFERING === 'true',
		bufferFlushIntervalMs: process.env.BAILEYS_LOG_BUFFER_FLUSH_MS
			? parseInt(process.env.BAILEYS_LOG_BUFFER_FLUSH_MS, 10)
			: undefined,
		maxBufferSize: process.env.BAILEYS_LOG_MAX_BUFFER_SIZE
			? parseInt(process.env.BAILEYS_LOG_MAX_BUFFER_SIZE, 10)
			: undefined,
		enableRateLimiting: process.env.BAILEYS_LOG_RATE_LIMIT === 'true',
		maxLogsPerSecond: process.env.BAILEYS_LOG_MAX_PER_SECOND
			? parseInt(process.env.BAILEYS_LOG_MAX_PER_SECOND, 10)
			: undefined,
		enableAsyncQueue: process.env.BAILEYS_LOG_ASYNC === 'true',
		enableMetrics: process.env.BAILEYS_LOG_METRICS === 'true',
		includeStackTrace: process.env.BAILEYS_LOG_STACK_TRACE !== 'false',
	}
}

/**
 * Structured log entry
 */
export interface LogEntry {
	/** ISO 8601 timestamp */
	timestamp: string
	/** Log level */
	level: LogLevel
	/** Numeric level value */
	levelValue: number
	/** Main message */
	message: string
	/** Logger/component name */
	name?: string
	/** Additional context */
	context?: Record<string, unknown>
	/** Logged object data */
	data?: Record<string, unknown>
	/** Stack trace (for errors) */
	stack?: string
	/** Correlation ID for tracing */
	correlationId?: string
	/** Operation duration in ms (if applicable) */
	durationMs?: number
}

/**
 * Logger metrics
 */
export interface LoggerMetrics {
	totalLogs: number
	logsByLevel: Record<LogLevel, number>
	errorsCount: number
	lastLogTimestamp?: string
	/** Logs dropped due to rate limiting */
	droppedLogs: number
	/** Buffer flushes performed */
	bufferFlushes: number
	/** External hook failures */
	hookFailures: number
	/** Circuit breaker trips */
	circuitBreakerTrips: number
	/** Average log processing time in ms */
	avgProcessingTimeMs: number
}

/**
 * Logger statistics for monitoring
 */
export interface LoggerStatistics extends LoggerMetrics {
	/** Buffer current size */
	bufferSize: number
	/** Rate limiter tokens available */
	rateLimiterTokens: number
	/** Circuit breaker state */
	circuitBreakerState: 'closed' | 'open' | 'half-open'
	/** Queue size (if async enabled) */
	queueSize: number
	/** Created timestamp */
	createdAt: number
	/** Uptime in ms */
	uptimeMs: number
}

/**
 * Default fields to sanitize
 */
const DEFAULT_REDACT_FIELDS = [
	'password',
	'passwd',
	'secret',
	'token',
	'accessToken',
	'refreshToken',
	'apiKey',
	'api_key',
	'authorization',
	'auth',
	'credentials',
	'privateKey',
	'private_key',
]

// ============================================================================
// RATE LIMITER
// ============================================================================

/**
 * Token bucket rate limiter
 */
class RateLimiter {
	private tokens: number
	private lastRefill: number
	private readonly maxTokens: number
	private readonly refillRate: number // tokens per ms

	constructor(maxPerSecond: number) {
		this.maxTokens = maxPerSecond
		this.tokens = maxPerSecond
		this.refillRate = maxPerSecond / 1000
		this.lastRefill = Date.now()
	}

	tryAcquire(): boolean {
		this.refill()
		if (this.tokens >= 1) {
			this.tokens--
			return true
		}
		return false
	}

	private refill(): void {
		const now = Date.now()
		const elapsed = now - this.lastRefill
		const tokensToAdd = elapsed * this.refillRate
		this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd)
		this.lastRefill = now
	}

	getTokens(): number {
		this.refill()
		return Math.floor(this.tokens)
	}
}

// ============================================================================
// CIRCUIT BREAKER
// ============================================================================

/**
 * Circuit breaker for external hook protection
 */
class CircuitBreaker {
	private failures: number = 0
	private lastFailure: number = 0
	private state: 'closed' | 'open' | 'half-open' = 'closed'

	constructor(
		private readonly threshold: number,
		private readonly resetTimeoutMs: number
	) {}

	async execute<T>(operation: () => Promise<T>): Promise<T | null> {
		if (this.state === 'open') {
			if (Date.now() - this.lastFailure > this.resetTimeoutMs) {
				this.state = 'half-open'
			} else {
				return null // Circuit is open, skip
			}
		}

		try {
			const result = await operation()
			this.onSuccess()
			return result
		} catch (error) {
			this.onFailure()
			throw error
		}
	}

	private onSuccess(): void {
		this.failures = 0
		this.state = 'closed'
	}

	private onFailure(): void {
		this.failures++
		this.lastFailure = Date.now()
		if (this.failures >= this.threshold) {
			this.state = 'open'
		}
	}

	getState(): 'closed' | 'open' | 'half-open' {
		// Check if should transition from open to half-open
		if (this.state === 'open' && Date.now() - this.lastFailure > this.resetTimeoutMs) {
			this.state = 'half-open'
		}
		return this.state
	}

	getFailures(): number {
		return this.failures
	}
}

// ============================================================================
// ASYNC LOG QUEUE
// ============================================================================

/**
 * Async log processing queue
 */
class AsyncLogQueue {
	private queue: Array<() => void> = []
	private processing: boolean = false
	private destroyed: boolean = false

	enqueue(task: () => void): void {
		if (this.destroyed) return
		this.queue.push(task)
		this.processNext()
	}

	private async processNext(): Promise<void> {
		if (this.processing || this.queue.length === 0 || this.destroyed) return

		this.processing = true
		while (this.queue.length > 0 && !this.destroyed) {
			const task = this.queue.shift()
			if (task) {
				try {
					task()
				} catch {
					// Silently ignore errors
				}
			}
			// Yield to event loop periodically
			if (this.queue.length > 0 && this.queue.length % 10 === 0) {
				await new Promise(resolve => setImmediate(resolve))
			}
		}
		this.processing = false
	}

	getSize(): number {
		return this.queue.length
	}

	destroy(): void {
		this.destroyed = true
		this.queue = []
	}
}

// ============================================================================
// MAIN CLASS
// ============================================================================

/**
 * Structured Logger main class
 *
 * Enterprise-grade features:
 * - Environment variable configuration
 * - Log buffering for batch writes
 * - Rate limiting to prevent flooding
 * - Async logging queue
 * - Circuit breaker for external hooks
 * - Prometheus metrics integration
 *
 * @example
 * ```typescript
 * const logger = createStructuredLogger({
 *   level: 'info',
 *   name: 'my-service',
 *   jsonFormat: true,
 *   enableBuffering: true,
 *   enableRateLimiting: true
 * })
 *
 * logger.info({ userId: '123' }, 'User logged in')
 * logger.error(new Error('Connection failed'))
 *
 * // Cleanup when done
 * logger.destroy()
 * ```
 */
export class StructuredLogger implements ILogger {
	private config: ResolvedLoggerConfig
	private metrics: LoggerMetrics
	private childContext: Record<string, unknown> = {}
	private destroyed: boolean = false
	private createdAt: number

	// Buffer for batch writes
	private buffer: LogEntry[] = []
	private bufferFlushTimer: NodeJS.Timeout | null = null

	// Rate limiter
	private rateLimiter: RateLimiter | null = null

	// Circuit breaker for external hook
	private circuitBreaker: CircuitBreaker | null = null

	// Async queue
	private asyncQueue: AsyncLogQueue | null = null

	// Performance tracking
	private totalProcessingTime: number = 0
	private processedLogs: number = 0

	// Metrics module (lazy loaded)
	private metricsModule: typeof import('./prometheus-metrics') | null = null
	private metricsQueue: Array<() => void> = []

	constructor(config: StructuredLoggerConfig) {
		const envConfig = loadLoggerConfig()
		this.createdAt = Date.now()

		this.config = {
			level: config.level ?? envConfig.level ?? 'info',
			name: config.name ?? envConfig.name ?? 'app',
			context: config.context || {},
			jsonFormat: config.jsonFormat ?? envConfig.jsonFormat ?? true,
			redactFields: [...DEFAULT_REDACT_FIELDS, ...(config.redactFields || [])],
			externalHook: config.externalHook,
			includeStackTrace: config.includeStackTrace ?? envConfig.includeStackTrace ?? true,
			timezone: config.timezone || 'UTC',
			enableBuffering: config.enableBuffering ?? envConfig.enableBuffering ?? false,
			bufferFlushIntervalMs: config.bufferFlushIntervalMs ?? envConfig.bufferFlushIntervalMs ?? 1000,
			maxBufferSize: config.maxBufferSize ?? envConfig.maxBufferSize ?? 100,
			enableRateLimiting: config.enableRateLimiting ?? envConfig.enableRateLimiting ?? false,
			maxLogsPerSecond: config.maxLogsPerSecond ?? envConfig.maxLogsPerSecond ?? 1000,
			enableAsyncQueue: config.enableAsyncQueue ?? envConfig.enableAsyncQueue ?? false,
			circuitBreakerThreshold: config.circuitBreakerThreshold ?? 5,
			circuitBreakerResetMs: config.circuitBreakerResetMs ?? 30000,
			enableMetrics: config.enableMetrics ?? envConfig.enableMetrics ?? false,
		}

		this.metrics = {
			totalLogs: 0,
			logsByLevel: {
				trace: 0,
				debug: 0,
				info: 0,
				warn: 0,
				error: 0,
				fatal: 0,
				silent: 0,
			},
			errorsCount: 0,
			droppedLogs: 0,
			bufferFlushes: 0,
			hookFailures: 0,
			circuitBreakerTrips: 0,
			avgProcessingTimeMs: 0,
		}

		// Initialize rate limiter
		if (this.config.enableRateLimiting) {
			this.rateLimiter = new RateLimiter(this.config.maxLogsPerSecond)
		}

		// Initialize circuit breaker for external hook
		if (this.config.externalHook) {
			this.circuitBreaker = new CircuitBreaker(
				this.config.circuitBreakerThreshold,
				this.config.circuitBreakerResetMs
			)
		}

		// Initialize async queue
		if (this.config.enableAsyncQueue) {
			this.asyncQueue = new AsyncLogQueue()
		}

		// Initialize buffer flush timer
		if (this.config.enableBuffering) {
			this.bufferFlushTimer = setInterval(() => {
				this.flushBuffer()
			}, this.config.bufferFlushIntervalMs)
		}

		// Load metrics module if enabled
		if (this.config.enableMetrics) {
			import('./prometheus-metrics').then(m => {
				this.metricsModule = m
				this.debug('📊 Prometheus metrics loaded for logger, flushing buffered metrics', { queuedCount: this.metricsQueue.length })
				// Flush buffered metrics
				this.metricsQueue.forEach(fn => fn())
				this.metricsQueue = []
			}).catch(() => {
				// Metrics not available
			})
		}
	}

	/**
	 * Get current log level (ILogger compatibility)
	 */
	get level(): string {
		return this.config.level
	}

	/**
	 * Set log level
	 */
	set level(newLevel: string) {
		if (newLevel in LOG_LEVEL_VALUES) {
			this.config.level = newLevel as LogLevel
		}
	}

	/**
	 * Check if logger has been destroyed
	 */
	isDestroyed(): boolean {
		return this.destroyed
	}

	/**
	 * Create a child logger with additional context
	 */
	child(obj: Record<string, unknown>): StructuredLogger {
		const childLogger = new StructuredLogger({
			...this.config,
			context: { ...this.config.context, ...this.childContext, ...obj },
		})
		childLogger.childContext = { ...this.childContext, ...obj }
		return childLogger
	}

	/**
	 * Check if log level is enabled
	 */
	isLevelEnabled(level: LogLevel): boolean {
		return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[this.config.level]
	}

	/**
	 * Main logging method
	 */
	private log(level: LogLevel, obj: unknown, msg?: string): void {
		if (this.destroyed || !this.isLevelEnabled(level)) {
			return
		}

		const startTime = Date.now()

		// Rate limiting check
		if (this.rateLimiter && !this.rateLimiter.tryAcquire()) {
			this.metrics.droppedLogs++
			return
		}

		const entry = this.createLogEntry(level, obj, msg)

		// Update metrics
		this.updateMetrics(level)

		// Process log (sync or async)
		const processLog = () => {
			// Buffered output
			if (this.config.enableBuffering) {
				this.buffer.push(entry)
				if (this.buffer.length >= this.config.maxBufferSize) {
					this.flushBuffer()
				}
			} else {
				this.output(entry)
			}

			// External hook with circuit breaker
			const externalHook = this.config.externalHook
			if (externalHook && this.circuitBreaker) {
				this.circuitBreaker.execute(async () => {
					await Promise.resolve(externalHook(entry))
				}).catch(() => {
					this.metrics.hookFailures++
					if (this.circuitBreaker?.getState() === 'open') {
						this.metrics.circuitBreakerTrips++
					}
				})
			}

			// Track processing time
			this.totalProcessingTime += Date.now() - startTime
			this.processedLogs++
			this.metrics.avgProcessingTimeMs = this.totalProcessingTime / this.processedLogs
		}

		// Async or sync processing
		if (this.asyncQueue) {
			this.asyncQueue.enqueue(processLog)
		} else {
			processLog()
		}
	}

	/**
	 * Flush buffered logs
	 */
	flushBuffer(): void {
		if (this.buffer.length === 0) return

		const entries = this.buffer
		this.buffer = []
		this.metrics.bufferFlushes++

		for (const entry of entries) {
			this.output(entry)
		}
	}

	/**
	 * Create a structured log entry
	 */
	private createLogEntry(level: LogLevel, obj: unknown, msg?: string): LogEntry {
		const timestamp = new Date().toISOString()
		let message = msg || ''
		let data: Record<string, unknown> | undefined
		let stack: string | undefined

		// Process object
		if (obj instanceof Error) {
			message = message || obj.message
			if (this.config.includeStackTrace && obj.stack) {
				stack = obj.stack
			}
			data = {
				errorName: obj.name,
				errorMessage: obj.message,
				...(obj as unknown as Record<string, unknown>),
			}
		} else if (typeof obj === 'object' && obj !== null) {
			data = this.sanitize(obj as Record<string, unknown>)
			if (!message && 'msg' in (obj as Record<string, unknown>)) {
				message = String((obj as Record<string, unknown>).msg)
			}
		} else if (typeof obj === 'string') {
			message = message || obj
		}

		// Extract correlationId and durationMs if present
		const correlationId = data?.correlationId as string | undefined
		const durationMs = data?.durationMs as number | undefined

		return {
			timestamp,
			level,
			levelValue: LOG_LEVEL_VALUES[level],
			message,
			name: this.config.name,
			context: Object.keys(this.config.context).length > 0 ? this.config.context : undefined,
			data,
			stack,
			correlationId,
			durationMs,
		}
	}

	/**
	 * Sanitize sensitive data
	 */
	private sanitize(obj: Record<string, unknown>): Record<string, unknown> {
		const sanitized: Record<string, unknown> = {}

		for (const [key, value] of Object.entries(obj)) {
			const lowerKey = key.toLowerCase()

			if (this.config.redactFields.some((field) => lowerKey.includes(field.toLowerCase()))) {
				sanitized[key] = '[REDACTED]'
			} else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
				sanitized[key] = this.sanitize(value as Record<string, unknown>)
			} else {
				sanitized[key] = value
			}
		}

		return sanitized
	}

	/**
	 * Update internal metrics
	 */
	private updateMetrics(level: LogLevel): void {
		this.metrics.totalLogs++
		this.metrics.logsByLevel[level]++
		this.metrics.lastLogTimestamp = new Date().toISOString()

		if (level === 'error' || level === 'fatal') {
			this.metrics.errorsCount++
		}
	}

	/**
	 * Output log entry
	 */
	private output(entry: LogEntry): void {
		const output = this.config.jsonFormat ? JSON.stringify(entry) : this.formatText(entry)

		switch (entry.level) {
			case 'trace':
			case 'debug':
				console.debug(output)
				break
			case 'info':
				console.info(output)
				break
			case 'warn':
				console.warn(output)
				break
			case 'error':
			case 'fatal':
				console.error(output)
				break
		}
	}

	/**
	 * Format log as human-readable text
	 */
	private formatText(entry: LogEntry): string {
		const parts = [
			`[${entry.timestamp}]`,
			`[${entry.level.toUpperCase()}]`,
			entry.name ? `[${entry.name}]` : '',
			entry.correlationId ? `[${entry.correlationId}]` : '',
			entry.message,
			entry.durationMs !== undefined ? `(${entry.durationMs}ms)` : '',
		]

		let text = parts.filter(Boolean).join(' ')

		if (entry.data && Object.keys(entry.data).length > 0) {
			text += ` | ${JSON.stringify(entry.data)}`
		}

		if (entry.stack) {
			text += `\n${entry.stack}`
		}

		return text
	}

	// Convenience methods for each log level

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

	fatal(obj: unknown, msg?: string): void {
		this.log('fatal', obj, msg)
	}

	/**
	 * Log with temporary context
	 */
	withContext(context: Record<string, unknown>): StructuredLogger {
		return this.child(context)
	}

	/**
	 * Log with correlation ID
	 */
	withCorrelationId(correlationId: string): StructuredLogger {
		return this.child({ correlationId })
	}

	/**
	 * Log operation with duration tracking
	 */
	logOperation<T>(
		operationName: string,
		operation: () => T | Promise<T>,
		level: LogLevel = 'info'
	): T | Promise<T> {
		const startTime = Date.now()
		const contextLogger = this.child({ operation: operationName })

		contextLogger.log(level, { event: 'operation_start' }, `Starting ${operationName}`)

		const handleResult = (result: T): T => {
			const durationMs = Date.now() - startTime
			contextLogger.log(level, { event: 'operation_complete', durationMs }, `Completed ${operationName}`)
			return result
		}

		const handleError = (error: Error): never => {
			const durationMs = Date.now() - startTime
			contextLogger.error({ event: 'operation_error', durationMs, error }, `Failed ${operationName}`)
			throw error
		}

		try {
			const result = operation()

			if (result instanceof Promise) {
				return result.then(handleResult).catch(handleError) as Promise<T>
			}

			return handleResult(result)
		} catch (error) {
			return handleError(error as Error)
		}
	}

	/**
	 * Get logger metrics
	 */
	getMetrics(): LoggerMetrics {
		return { ...this.metrics }
	}

	/**
	 * Get comprehensive statistics
	 */
	getStatistics(): LoggerStatistics {
		return {
			...this.metrics,
			bufferSize: this.buffer.length,
			rateLimiterTokens: this.rateLimiter?.getTokens() ?? 0,
			circuitBreakerState: this.circuitBreaker?.getState() ?? 'closed',
			queueSize: this.asyncQueue?.getSize() ?? 0,
			createdAt: this.createdAt,
			uptimeMs: Date.now() - this.createdAt,
		}
	}

	/**
	 * Reset metrics
	 */
	resetMetrics(): void {
		this.metrics = {
			totalLogs: 0,
			logsByLevel: {
				trace: 0,
				debug: 0,
				info: 0,
				warn: 0,
				error: 0,
				fatal: 0,
				silent: 0,
			},
			errorsCount: 0,
			droppedLogs: 0,
			bufferFlushes: 0,
			hookFailures: 0,
			circuitBreakerTrips: 0,
			avgProcessingTimeMs: 0,
		}
		this.totalProcessingTime = 0
		this.processedLogs = 0
	}

	/**
	 * Destroy the logger and clean up resources
	 * CRITICAL: Call this when done to prevent memory leaks
	 */
	destroy(): void {
		if (this.destroyed) return

		this.destroyed = true

		// Flush remaining buffer
		this.flushBuffer()

		// Clear buffer flush timer
		if (this.bufferFlushTimer) {
			clearInterval(this.bufferFlushTimer)
			this.bufferFlushTimer = null
		}

		// Destroy async queue
		if (this.asyncQueue) {
			this.asyncQueue.destroy()
			this.asyncQueue = null
		}

		// Clear references
		this.rateLimiter = null
		this.circuitBreaker = null
		this.metricsModule = null
	}
}

/**
 * Factory to create structured logger
 */
export function createStructuredLogger(config: Partial<StructuredLoggerConfig> = {}): StructuredLogger {
	return new StructuredLogger({
		level: config.level || 'info',
		...config,
	})
}

/**
 * Default singleton logger
 */
let defaultLogger: StructuredLogger | null = null

export function getDefaultLogger(): StructuredLogger {
	if (!defaultLogger) {
		defaultLogger = createStructuredLogger({
			level: 'info',
			name: 'baileys',
			jsonFormat: process.env.NODE_ENV === 'production',
		})
	}
	return defaultLogger
}

export function setDefaultLogger(logger: StructuredLogger): void {
	defaultLogger = logger
}

/**
 * Utility to measure execution time
 */
export function createTimer(): { elapsed: () => number; elapsedMs: () => string } {
	const start = process.hrtime.bigint()
	return {
		elapsed: () => Number(process.hrtime.bigint() - start) / 1_000_000,
		elapsedMs: () => `${(Number(process.hrtime.bigint() - start) / 1_000_000).toFixed(2)}ms`,
	}
}

export default StructuredLogger
