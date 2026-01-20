/**
 * Structured Logging System for InfiniteAPI
 *
 * Provides:
 * - Configurable log levels (trace, debug, info, warn, error, fatal)
 * - JSON formatting for log analysis
 * - Hierarchical context with child loggers
 * - External system integration via hooks
 * - Logging metrics support
 * - Sensitive data sanitization
 *
 * @module Utils/structured-logger
 */

import type { ILogger } from './logger.js'

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

/**
 * Structured Logger main class
 *
 * @example
 * ```typescript
 * const logger = createStructuredLogger({
 *   level: 'info',
 *   name: 'my-service',
 *   jsonFormat: true
 * })
 *
 * logger.info({ userId: '123' }, 'User logged in')
 * logger.error(new Error('Connection failed'))
 * ```
 */
export class StructuredLogger implements ILogger {
	private config: Required<StructuredLoggerConfig>
	private metrics: LoggerMetrics
	private childContext: Record<string, unknown> = {}

	constructor(config: StructuredLoggerConfig) {
		this.config = {
			level: config.level,
			name: config.name || 'app',
			context: config.context || {},
			jsonFormat: config.jsonFormat ?? true,
			redactFields: [...DEFAULT_REDACT_FIELDS, ...(config.redactFields || [])],
			externalHook: config.externalHook || (() => {}),
			includeStackTrace: config.includeStackTrace ?? true,
			timezone: config.timezone || 'UTC',
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
		if (!this.isLevelEnabled(level)) {
			return
		}

		const entry = this.createLogEntry(level, obj, msg)

		// Update metrics
		this.updateMetrics(level)

		// Output
		this.output(entry)

		// External hook (async, non-blocking)
		if (this.config.externalHook) {
			Promise.resolve(this.config.externalHook(entry)).catch(() => {
				// Silently ignore hook errors
			})
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
		}
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
