/**
 * @fileoverview Contexto de rastreamento para requests
 * @module Utils/trace-context
 *
 * Fornece:
 * - Geração de trace IDs únicos
 * - Context propagation entre operações
 * - Correlation IDs para rastrear requests
 * - Performance timing
 * - Span tracking para operações aninhadas
 * - Baggage para dados contextuais
 */

import { randomBytes } from 'crypto'
import { AsyncLocalStorage } from 'async_hooks'

/**
 * Identificadores de trace
 */
export interface TraceIds {
	/** ID único do trace (16 bytes hex) */
	traceId: string
	/** ID do span atual (8 bytes hex) */
	spanId: string
	/** ID do span pai (opcional) */
	parentSpanId?: string
	/** ID de correlação para logging */
	correlationId: string
}

/**
 * Dados de baggage (contexto propagado)
 */
export type Baggage = Record<string, string | number | boolean>

/**
 * Status de um span
 */
export type SpanStatus = 'unset' | 'ok' | 'error'

/**
 * Span representa uma unidade de trabalho
 */
export interface Span {
	/** Nome da operação */
	name: string
	/** IDs de rastreamento */
	traceIds: TraceIds
	/** Timestamp de início (ms) */
	startTime: number
	/** Timestamp de fim (ms) */
	endTime?: number
	/** Duração em ms */
	duration?: number
	/** Status do span */
	status: SpanStatus
	/** Atributos do span */
	attributes: Record<string, unknown>
	/** Eventos ocorridos durante o span */
	events: SpanEvent[]
	/** Se o span está finalizado */
	ended: boolean
}

/**
 * Evento dentro de um span
 */
export interface SpanEvent {
	/** Nome do evento */
	name: string
	/** Timestamp do evento */
	timestamp: number
	/** Atributos do evento */
	attributes?: Record<string, unknown>
}

/**
 * Contexto completo de trace
 */
export interface TraceContext {
	/** IDs de rastreamento */
	traceIds: TraceIds
	/** Baggage (dados propagados) */
	baggage: Baggage
	/** Span atual */
	currentSpan?: Span
	/** Stack de spans (para spans aninhados) */
	spanStack: Span[]
	/** Timestamp de criação do contexto */
	createdAt: number
	/** Metadados adicionais */
	metadata: Record<string, unknown>
}

/**
 * Opções para criar um novo contexto
 */
export interface CreateContextOptions {
	/** Trace ID existente (para propagação) */
	traceId?: string
	/** Parent span ID */
	parentSpanId?: string
	/** Correlation ID existente */
	correlationId?: string
	/** Baggage inicial */
	baggage?: Baggage
	/** Metadados iniciais */
	metadata?: Record<string, unknown>
}

/**
 * Opções para criar um span
 */
export interface CreateSpanOptions {
	/** Nome do span */
	name: string
	/** Atributos iniciais */
	attributes?: Record<string, unknown>
	/** Se deve ser filho do span atual */
	asChild?: boolean
}

/**
 * Storage assíncrono para contexto de trace
 */
const traceStorage = new AsyncLocalStorage<TraceContext>()

/**
 * Gera um ID hexadecimal aleatório
 */
function generateId(bytes: number): string {
	return randomBytes(bytes).toString('hex')
}

/**
 * Gera um trace ID (16 bytes = 32 chars hex)
 */
export function generateTraceId(): string {
	return generateId(16)
}

/**
 * Gera um span ID (8 bytes = 16 chars hex)
 */
export function generateSpanId(): string {
	return generateId(8)
}

/**
 * Gera um correlation ID mais legível
 */
export function generateCorrelationId(): string {
	const timestamp = Date.now().toString(36)
	const random = generateId(4)
	return `${timestamp}-${random}`
}

/**
 * Cria um novo contexto de trace
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
 * Obtém o contexto de trace atual
 */
export function getCurrentContext(): TraceContext | undefined {
	return traceStorage.getStore()
}

/**
 * Obtém o contexto de trace atual ou cria um novo
 */
export function getOrCreateContext(): TraceContext {
	const existing = getCurrentContext()
	if (existing) {
		return existing
	}
	return createTraceContext()
}

/**
 * Executa função com contexto de trace
 */
export function runWithContext<T>(context: TraceContext, fn: () => T): T {
	return traceStorage.run(context, fn)
}

/**
 * Executa função com novo contexto de trace
 */
export function runWithNewContext<T>(options: CreateContextOptions, fn: () => T): T {
	const context = createTraceContext(options)
	return runWithContext(context, fn)
}

/**
 * Executa função assíncrona com contexto de trace
 */
export async function runWithContextAsync<T>(
	context: TraceContext,
	fn: () => Promise<T>
): Promise<T> {
	return traceStorage.run(context, fn)
}

/**
 * Cria um novo span
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
 * Inicia um span no contexto atual
 */
export function startSpan(options: CreateSpanOptions): Span {
	const context = getOrCreateContext()
	const span = createSpan({ ...options, asChild: true })

	// Push span atual para stack e define novo como atual
	if (context.currentSpan) {
		context.spanStack.push(context.currentSpan)
	}
	context.currentSpan = span

	return span
}

/**
 * Finaliza um span
 */
export function endSpan(span: Span, status?: SpanStatus): void {
	if (span.ended) {
		return
	}

	span.endTime = Date.now()
	span.duration = span.endTime - span.startTime
	span.status = status || 'ok'
	span.ended = true

	// Pop span do stack no contexto
	const context = getCurrentContext()
	if (context && context.currentSpan === span) {
		context.currentSpan = context.spanStack.pop()
	}
}

/**
 * Adiciona evento a um span
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
 * Define atributos em um span
 */
export function setSpanAttributes(span: Span, attributes: Record<string, unknown>): void {
	if (span.ended) {
		return
	}

	Object.assign(span.attributes, attributes)
}

/**
 * Marca span como erro
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
 * Decorator para rastrear função automaticamente
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
 * Wrapper para rastrear função
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
 * Executa operação com span automático
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
 * Executa operação síncrona com span automático
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

// === Gerenciamento de Baggage ===

/**
 * Define item no baggage
 */
export function setBaggage(key: string, value: string | number | boolean): void {
	const context = getCurrentContext()
	if (context) {
		context.baggage[key] = value
	}
}

/**
 * Obtém item do baggage
 */
export function getBaggage(key: string): string | number | boolean | undefined {
	const context = getCurrentContext()
	return context?.baggage[key]
}

/**
 * Obtém todo o baggage
 */
export function getAllBaggage(): Baggage {
	const context = getCurrentContext()
	return context?.baggage || {}
}

/**
 * Remove item do baggage
 */
export function removeBaggage(key: string): void {
	const context = getCurrentContext()
	if (context) {
		delete context.baggage[key]
	}
}

// === Utilitários de Headers ===

/**
 * Headers padrão para propagação de trace
 */
export const TRACE_HEADERS = {
	TRACE_ID: 'x-trace-id',
	SPAN_ID: 'x-span-id',
	PARENT_SPAN_ID: 'x-parent-span-id',
	CORRELATION_ID: 'x-correlation-id',
	BAGGAGE: 'baggage',
} as const

/**
 * Injeta contexto em headers HTTP
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

	// Baggage como lista de key=value
	if (Object.keys(context.baggage).length > 0) {
		result[TRACE_HEADERS.BAGGAGE] = Object.entries(context.baggage)
			.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
			.join(',')
	}

	return result
}

/**
 * Extrai contexto de headers HTTP
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
	if (headers[TRACE_HEADERS.BAGGAGE]) {
		options.baggage = {}
		const pairs = headers[TRACE_HEADERS.BAGGAGE].split(',')
		for (const pair of pairs) {
			const [key, value] = pair.split('=')
			if (key && value) {
				options.baggage[key.trim()] = decodeURIComponent(value.trim())
			}
		}
	}

	return options
}

/**
 * Exporta trace context para serialização
 */
export function exportContext(context: TraceContext): string {
	return JSON.stringify({
		traceIds: context.traceIds,
		baggage: context.baggage,
		metadata: context.metadata,
	})
}

/**
 * Importa trace context de string serializada
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
 * Timer de alta precisão
 */
export interface PrecisionTimer {
	/** Retorna tempo decorrido em milliseconds */
	elapsed(): number
	/** Retorna tempo decorrido formatado */
	elapsedFormatted(): string
	/** Para o timer e retorna duração */
	stop(): number
}

/**
 * Cria um timer de alta precisão
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
