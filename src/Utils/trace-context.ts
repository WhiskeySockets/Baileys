/**
 * Request Tracing Context
 *
 * Provides:
 * - Unique trace ID generation
 * - Context propagation between operations
 * - Correlation IDs for request tracking
 * - Performance timing
 * - Span tracking for nested operations
 * - Baggage for contextual data
 *
 * @module Utils/trace-context
 */

import { randomBytes } from 'crypto'
import { AsyncLocalStorage } from 'async_hooks'

/**
 * Trace identifiers
 */
export interface TraceIds {
	/** Unique trace ID (16 bytes hex) */
	traceId: string
	/** Current span ID (8 bytes hex) */
	spanId: string
	/** Parent span ID (optional) */
	parentSpanId?: string
	/** Correlation ID for logging */
	correlationId: string
}

/**
 * Baggage data (propagated context)
 */
export type Baggage = Record<string, string | number | boolean>

/**
 * Span status
 */
export type SpanStatus = 'unset' | 'ok' | 'error'

/**
 * Span represents a unit of work
 */
export interface Span {
	/** Operation name */
	name: string
	/** Trace identifiers */
	traceIds: TraceIds
	/** Start timestamp (ms) */
	startTime: number
	/** End timestamp (ms) */
	endTime?: number
	/** Duration in ms */
	duration?: number
	/** Span status */
	status: SpanStatus
	/** Span attributes */
	attributes: Record<string, unknown>
	/** Events occurred during the span */
	events: SpanEvent[]
	/** Whether the span has ended */
	ended: boolean
}

/**
 * Event within a span
 */
export interface SpanEvent {
	/** Event name */
	name: string
	/** Event timestamp */
	timestamp: number
	/** Event attributes */
	attributes?: Record<string, unknown>
}

/**
 * Complete trace context
 */
export interface TraceContext {
	/** Trace identifiers */
	traceIds: TraceIds
	/** Baggage (propagated data) */
	baggage: Baggage
	/** Current span */
	currentSpan?: Span
	/** Span stack (for nested spans) */
	spanStack: Span[]
	/** Context creation timestamp */
	createdAt: number
	/** Additional metadata */
	metadata: Record<string, unknown>
}

/**
 * Options for creating a new context
 */
export interface CreateContextOptions {
	/** Existing trace ID (for propagation) */
	traceId?: string
	/** Parent span ID */
	parentSpanId?: string
	/** Existing correlation ID */
	correlationId?: string
	/** Initial baggage */
	baggage?: Baggage
	/** Initial metadata */
	metadata?: Record<string, unknown>
}

/**
 * Options for creating a span
 */
export interface CreateSpanOptions {
	/** Span name */
	name: string
	/** Initial attributes */
	attributes?: Record<string, unknown>
	/** Whether to be a child of the current span */
	asChild?: boolean
}

/**
 * Async storage for trace context
 */
const traceStorage = new AsyncLocalStorage<TraceContext>()

/**
 * Generate a random hexadecimal ID
 */
function generateId(bytes: number): string {
	return randomBytes(bytes).toString('hex')
}

/**
 * Generate a trace ID (16 bytes = 32 chars hex)
 */
export function generateTraceId(): string {
	return generateId(16)
}

/**
 * Generate a span ID (8 bytes = 16 chars hex)
 */
export function generateSpanId(): string {
	return generateId(8)
}

/**
 * Generate a more readable correlation ID
 */
export function generateCorrelationId(): string {
	const timestamp = Date.now().toString(36)
	const random = generateId(4)
	return `${timestamp}-${random}`
}

/**
 * Create a new trace context
 */
export function createTraceContext(options: CreateContextOptions = {}): TraceContext {
	const traceId = options.traceId || generateTraceId()
	const spanId = generateSpanId()
	const correlationId = options.correlationId || generateCorrelationId()

	return {
		traceIds: {
			traceId,
			spanId,
			parentSpanId: options.parentSpanId,
			correlationId,
		},
		baggage: options.baggage || {},
		spanStack: [],
		createdAt: Date.now(),
		metadata: options.metadata || {},
	}
}

/**
 * Get the current trace context
 */
export function getCurrentContext(): TraceContext | undefined {
	return traceStorage.getStore()
}

/**
 * Get the current trace context or create a new one
 */
export function getOrCreateContext(): TraceContext {
	const existing = getCurrentContext()
	if (existing) {
		return existing
	}
	return createTraceContext()
}

/**
 * Execute function with trace context
 */
export function runWithContext<T>(context: TraceContext, fn: () => T): T {
	return traceStorage.run(context, fn)
}

/**
 * Execute function with new trace context
 */
export function runWithNewContext<T>(options: CreateContextOptions, fn: () => T): T {
	const context = createTraceContext(options)
	return runWithContext(context, fn)
}

/**
 * Execute async function with trace context
 */
export async function runWithContextAsync<T>(
	context: TraceContext,
	fn: () => Promise<T>
): Promise<T> {
	return traceStorage.run(context, fn)
}

/**
 * Create a new span
 */
export function createSpan(options: CreateSpanOptions): Span {
	const context = getCurrentContext()
	const parentSpan = context?.currentSpan

	const span: Span = {
		name: options.name,
		traceIds: {
			traceId: context?.traceIds.traceId || generateTraceId(),
			spanId: generateSpanId(),
			parentSpanId: options.asChild && parentSpan ? parentSpan.traceIds.spanId : undefined,
			correlationId: context?.traceIds.correlationId || generateCorrelationId(),
		},
		startTime: Date.now(),
		status: 'unset',
		attributes: options.attributes || {},
		events: [],
		ended: false,
	}

	return span
}

/**
 * Start a span in the current context
 */
export function startSpan(options: CreateSpanOptions): Span {
	const context = getOrCreateContext()
	const span = createSpan({ ...options, asChild: true })

	// Push current span to stack and set new one as current
	if (context.currentSpan) {
		context.spanStack.push(context.currentSpan)
	}
	context.currentSpan = span

	return span
}

/**
 * End a span
 */
export function endSpan(span: Span, status?: SpanStatus): void {
	if (span.ended) {
		return
	}

	span.endTime = Date.now()
	span.duration = span.endTime - span.startTime
	span.status = status || 'ok'
	span.ended = true

	// Pop span from stack in context
	const context = getCurrentContext()
	if (context && context.currentSpan === span) {
		context.currentSpan = context.spanStack.pop()
	}
}

/**
 * Add event to a span
 */
export function addSpanEvent(span: Span, name: string, attributes?: Record<string, unknown>): void {
	if (span.ended) {
		return
	}

	span.events.push({
		name,
		timestamp: Date.now(),
		attributes,
	})
}

/**
 * Set attributes on a span
 */
export function setSpanAttributes(span: Span, attributes: Record<string, unknown>): void {
	if (span.ended) {
		return
	}

	Object.assign(span.attributes, attributes)
}

/**
 * Mark span as error
 */
export function setSpanError(span: Span, error: Error): void {
	if (span.ended) {
		return
	}

	span.status = 'error'
	span.attributes.error = true
	span.attributes.errorMessage = error.message
	span.attributes.errorName = error.name
	if (error.stack) {
		span.attributes.errorStack = error.stack
	}

	addSpanEvent(span, 'exception', {
		'exception.type': error.name,
		'exception.message': error.message,
	})
}

/**
 * Decorator for automatic function tracing
 */
export function traced(name?: string) {
	return function <T extends (...args: unknown[]) => unknown>(
		_target: unknown,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<T>
	): TypedPropertyDescriptor<T> {
		const originalMethod = descriptor.value
		if (!originalMethod) {
			return descriptor
		}

		const spanName = name || propertyKey

		descriptor.value = function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
			const span = startSpan({ name: spanName })

			try {
				const result = originalMethod.apply(this, args) as ReturnType<T>

				if (result instanceof Promise) {
					return result
						.then((value) => {
							endSpan(span, 'ok')
							return value
						})
						.catch((error) => {
							setSpanError(span, error as Error)
							endSpan(span, 'error')
							throw error
						}) as ReturnType<T>
				}

				endSpan(span, 'ok')
				return result
			} catch (error) {
				setSpanError(span, error as Error)
				endSpan(span, 'error')
				throw error
			}
		} as T

		return descriptor
	}
}

/**
 * Wrapper for tracing a function
 */
export function traceFunction<T extends (...args: unknown[]) => unknown>(
	name: string,
	fn: T
): T {
	return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
		const span = startSpan({ name })

		try {
			const result = fn.apply(this, args) as ReturnType<T>

			if (result instanceof Promise) {
				return result
					.then((value) => {
						endSpan(span, 'ok')
						return value
					})
					.catch((error) => {
						setSpanError(span, error as Error)
						endSpan(span, 'error')
						throw error
					}) as ReturnType<T>
			}

			endSpan(span, 'ok')
			return result
		} catch (error) {
			setSpanError(span, error as Error)
			endSpan(span, 'error')
			throw error
		}
	} as T
}

/**
 * Execute operation with automatic span
 */
export async function withSpan<T>(
	name: string,
	operation: (span: Span) => Promise<T>,
	attributes?: Record<string, unknown>
): Promise<T> {
	const span = startSpan({ name, attributes })

	try {
		const result = await operation(span)
		endSpan(span, 'ok')
		return result
	} catch (error) {
		setSpanError(span, error as Error)
		endSpan(span, 'error')
		throw error
	}
}

/**
 * Execute sync operation with automatic span
 */
export function withSpanSync<T>(
	name: string,
	operation: (span: Span) => T,
	attributes?: Record<string, unknown>
): T {
	const span = startSpan({ name, attributes })

	try {
		const result = operation(span)
		endSpan(span, 'ok')
		return result
	} catch (error) {
		setSpanError(span, error as Error)
		endSpan(span, 'error')
		throw error
	}
}

// === Baggage Management ===

/**
 * Set item in baggage
 */
export function setBaggage(key: string, value: string | number | boolean): void {
	const context = getCurrentContext()
	if (context) {
		context.baggage[key] = value
	}
}

/**
 * Get item from baggage
 */
export function getBaggage(key: string): string | number | boolean | undefined {
	const context = getCurrentContext()
	return context?.baggage[key]
}

/**
 * Get all baggage
 */
export function getAllBaggage(): Baggage {
	const context = getCurrentContext()
	return context?.baggage || {}
}

/**
 * Remove item from baggage
 */
export function removeBaggage(key: string): void {
	const context = getCurrentContext()
	if (context) {
		delete context.baggage[key]
	}
}

// === Header Utilities ===

/**
 * Standard headers for trace propagation
 */
export const TRACE_HEADERS = {
	TRACE_ID: 'x-trace-id',
	SPAN_ID: 'x-span-id',
	PARENT_SPAN_ID: 'x-parent-span-id',
	CORRELATION_ID: 'x-correlation-id',
	BAGGAGE: 'baggage',
} as const

/**
 * Inject context into HTTP headers
 */
export function injectTraceHeaders(headers: Record<string, string>): Record<string, string> {
	const context = getCurrentContext()
	if (!context) {
		return headers
	}

	const result = { ...headers }
	result[TRACE_HEADERS.TRACE_ID] = context.traceIds.traceId
	result[TRACE_HEADERS.SPAN_ID] = context.traceIds.spanId
	result[TRACE_HEADERS.CORRELATION_ID] = context.traceIds.correlationId

	if (context.traceIds.parentSpanId) {
		result[TRACE_HEADERS.PARENT_SPAN_ID] = context.traceIds.parentSpanId
	}

	// Baggage as key=value list
	if (Object.keys(context.baggage).length > 0) {
		result[TRACE_HEADERS.BAGGAGE] = Object.entries(context.baggage)
			.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
			.join(',')
	}

	return result
}

/**
 * Extract context from HTTP headers
 */
export function extractTraceHeaders(headers: Record<string, string | undefined>): CreateContextOptions {
	const options: CreateContextOptions = {}

	if (headers[TRACE_HEADERS.TRACE_ID]) {
		options.traceId = headers[TRACE_HEADERS.TRACE_ID]
	}

	if (headers[TRACE_HEADERS.PARENT_SPAN_ID]) {
		options.parentSpanId = headers[TRACE_HEADERS.PARENT_SPAN_ID]
	}

	if (headers[TRACE_HEADERS.CORRELATION_ID]) {
		options.correlationId = headers[TRACE_HEADERS.CORRELATION_ID]
	}

	// Parse baggage
	const baggageHeader = headers[TRACE_HEADERS.BAGGAGE]
	if (baggageHeader) {
		options.baggage = {}
		const pairs = baggageHeader.split(',')
		for (const pair of pairs) {
			const parts = pair.split('=')
			const key = parts[0]
			const value = parts[1]
			if (key && value) {
				options.baggage[key.trim()] = decodeURIComponent(value.trim())
			}
		}
	}

	return options
}

/**
 * Export trace context for serialization
 */
export function exportContext(context: TraceContext): string {
	return JSON.stringify({
		traceIds: context.traceIds,
		baggage: context.baggage,
		metadata: context.metadata,
	})
}

/**
 * Import trace context from serialized string
 */
export function importContext(serialized: string): CreateContextOptions {
	try {
		const data = JSON.parse(serialized)
		return {
			traceId: data.traceIds?.traceId,
			parentSpanId: data.traceIds?.spanId,
			correlationId: data.traceIds?.correlationId,
			baggage: data.baggage,
			metadata: data.metadata,
		}
	} catch {
		return {}
	}
}

// === Timer Utilities ===

/**
 * High precision timer
 */
export interface PrecisionTimer {
	/** Return elapsed time in milliseconds */
	elapsed(): number
	/** Return formatted elapsed time */
	elapsedFormatted(): string
	/** Stop the timer and return duration */
	stop(): number
}

/**
 * Create a high precision timer
 */
export function createPrecisionTimer(): PrecisionTimer {
	const start = process.hrtime.bigint()
	let stopped = false
	let finalDuration = 0

	return {
		elapsed(): number {
			if (stopped) return finalDuration
			return Number(process.hrtime.bigint() - start) / 1_000_000
		},
		elapsedFormatted(): string {
			const ms = this.elapsed()
			if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`
			if (ms < 1000) return `${ms.toFixed(2)}ms`
			return `${(ms / 1000).toFixed(2)}s`
		},
		stop(): number {
			if (!stopped) {
				finalDuration = Number(process.hrtime.bigint() - start) / 1_000_000
				stopped = true
			}
			return finalDuration
		},
	}
}

export default {
	createTraceContext,
	getCurrentContext,
	getOrCreateContext,
	runWithContext,
	runWithNewContext,
	createSpan,
	startSpan,
	endSpan,
	withSpan,
	withSpanSync,
	injectTraceHeaders,
	extractTraceHeaders,
	createPrecisionTimer,
}
