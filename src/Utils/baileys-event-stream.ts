/**
 * @fileoverview Gerenciamento de eventos do Baileys
 * @module Utils/baileys-event-stream
 *
 * Fornece:
 * - Event buffering com backpressure
 * - Event transformation e filtering
 * - Priority queues para eventos
 * - Batch processing
 * - Dead letter queue para eventos falhos
 * - Replay de eventos
 * - Integração com logging e métricas
 */

import { EventEmitter } from 'events'
import { metrics } from './prometheus-metrics.js'
import type { BaileysLogCategory } from './baileys-logger.js'

/**
 * Tipos de eventos do Baileys
 */
export type BaileysEventType =
	| 'connection.update'
	| 'creds.update'
	| 'messaging-history.set'
	| 'chats.set'
	| 'contacts.set'
	| 'messages.upsert'
	| 'messages.update'
	| 'messages.delete'
	| 'messages.reaction'
	| 'message-receipt.update'
	| 'groups.upsert'
	| 'groups.update'
	| 'group-participants.update'
	| 'presence.update'
	| 'chats.update'
	| 'chats.delete'
	| 'labels.edit'
	| 'labels.association'
	| 'call'
	| 'blocklist.set'
	| 'blocklist.update'
	| string // Para eventos customizados

/**
 * Prioridade de eventos
 */
export type EventPriority = 'critical' | 'high' | 'normal' | 'low'

/**
 * Valores numéricos de prioridade
 */
const PRIORITY_VALUES: Record<EventPriority, number> = {
	critical: 0,
	high: 1,
	normal: 2,
	low: 3,
}

/**
 * Evento do stream
 */
export interface StreamEvent<T = unknown> {
	id: string
	type: BaileysEventType
	data: T
	timestamp: number
	priority: EventPriority
	category: BaileysLogCategory
	metadata?: Record<string, unknown>
	retryCount?: number
	originalTimestamp?: number
}

/**
 * Opções do Event Stream
 */
export interface EventStreamOptions {
	/** Tamanho máximo do buffer (default: 10000) */
	maxBufferSize?: number
	/** Se deve aplicar backpressure quando buffer cheio */
	enableBackpressure?: boolean
	/** Limite de highWaterMark para backpressure */
	highWaterMark?: number
	/** Limite de lowWaterMark para retomar */
	lowWaterMark?: number
	/** Tamanho do batch para processamento */
	batchSize?: number
	/** Intervalo de flush em ms (0 = desabilitado) */
	flushInterval?: number
	/** Máximo de retries para eventos falhos */
	maxRetries?: number
	/** Tamanho da dead letter queue */
	deadLetterQueueSize?: number
	/** Se deve coletar métricas */
	collectMetrics?: boolean
	/** Nome do stream para métricas */
	streamName?: string
}

/**
 * Handler de evento
 */
export type EventHandler<T = unknown> = (event: StreamEvent<T>) => void | Promise<void>

/**
 * Filtro de evento
 */
export type EventFilter<T = unknown> = (event: StreamEvent<T>) => boolean

/**
 * Transformador de evento
 */
export type EventTransformer<T = unknown, R = unknown> = (event: StreamEvent<T>) => StreamEvent<R>

/**
 * Resultado de processamento de batch
 */
export interface BatchResult {
	processed: number
	failed: number
	duration: number
}

/**
 * Estatísticas do stream
 */
export interface EventStreamStats {
	bufferSize: number
	totalReceived: number
	totalProcessed: number
	totalFailed: number
	totalDropped: number
	deadLetterQueueSize: number
	isBackpressured: boolean
	lastEventTimestamp?: number
	eventsByType: Record<string, number>
	eventsByPriority: Record<EventPriority, number>
}

/**
 * Mapeamento de tipo de evento para categoria
 */
const EVENT_CATEGORY_MAP: Record<string, BaileysLogCategory> = {
	'connection.update': 'connection',
	'creds.update': 'auth',
	'messaging-history.set': 'sync',
	'chats.set': 'sync',
	'contacts.set': 'sync',
	'messages.upsert': 'message',
	'messages.update': 'message',
	'messages.delete': 'message',
	'messages.reaction': 'message',
	'message-receipt.update': 'message',
	'groups.upsert': 'group',
	'groups.update': 'group',
	'group-participants.update': 'group',
	'presence.update': 'presence',
	'chats.update': 'message',
	'chats.delete': 'message',
	'call': 'call',
	'blocklist.set': 'sync',
	'blocklist.update': 'sync',
}

/**
 * Prioridade padrão por tipo de evento
 */
const EVENT_PRIORITY_MAP: Partial<Record<BaileysEventType, EventPriority>> = {
	'connection.update': 'critical',
	'creds.update': 'critical',
	'messages.upsert': 'high',
	'messages.update': 'high',
	'call': 'high',
	'presence.update': 'low',
	'messaging-history.set': 'normal',
}

/**
 * Gera ID único para evento
 */
function generateEventId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Classe principal do Event Stream
 */
export class BaileysEventStream extends EventEmitter {
	private buffer: StreamEvent[] = []
	private handlers: Map<BaileysEventType | '*', Set<EventHandler>> = new Map()
	private filters: EventFilter[] = []
	private transformers: EventTransformer[] = []
	private deadLetterQueue: StreamEvent[] = []
	private options: Required<EventStreamOptions>
	private stats: EventStreamStats
	private isProcessing = false
	private flushTimer?: ReturnType<typeof setInterval>
	private paused = false

	constructor(options: EventStreamOptions = {}) {
		super()

		this.options = {
			maxBufferSize: options.maxBufferSize ?? 10000,
			enableBackpressure: options.enableBackpressure ?? true,
			highWaterMark: options.highWaterMark ?? 8000,
			lowWaterMark: options.lowWaterMark ?? 2000,
			batchSize: options.batchSize ?? 100,
			flushInterval: options.flushInterval ?? 0,
			maxRetries: options.maxRetries ?? 3,
			deadLetterQueueSize: options.deadLetterQueueSize ?? 1000,
			collectMetrics: options.collectMetrics ?? true,
			streamName: options.streamName ?? 'baileys',
		}

		this.stats = this.createInitialStats()

		// Iniciar flush periódico se configurado
		if (this.options.flushInterval > 0) {
			this.flushTimer = setInterval(() => this.flush(), this.options.flushInterval)
		}
	}

	private createInitialStats(): EventStreamStats {
		return {
			bufferSize: 0,
			totalReceived: 0,
			totalProcessed: 0,
			totalFailed: 0,
			totalDropped: 0,
			deadLetterQueueSize: 0,
			isBackpressured: false,
			eventsByType: {},
			eventsByPriority: {
				critical: 0,
				high: 0,
				normal: 0,
				low: 0,
			},
		}
	}

	/**
	 * Adiciona evento ao stream
	 */
	push<T>(type: BaileysEventType, data: T, options?: { priority?: EventPriority; metadata?: Record<string, unknown> }): boolean {
		// Verificar backpressure
		if (this.options.enableBackpressure && this.buffer.length >= this.options.highWaterMark) {
			this.stats.isBackpressured = true
			this.emit('backpressure', { bufferSize: this.buffer.length })

			if (this.buffer.length >= this.options.maxBufferSize) {
				this.stats.totalDropped++
				this.emit('dropped', { type, reason: 'buffer_full' })

				if (this.options.collectMetrics) {
					metrics.errors.inc({ category: 'event_stream', code: 'dropped' })
				}

				return false
			}
		}

		const event: StreamEvent<T> = {
			id: generateEventId(),
			type,
			data,
			timestamp: Date.now(),
			priority: options?.priority || EVENT_PRIORITY_MAP[type] || 'normal',
			category: EVENT_CATEGORY_MAP[type] || 'unknown',
			metadata: options?.metadata,
			retryCount: 0,
		}

		// Aplicar transformadores
		let transformedEvent: StreamEvent = event
		for (const transformer of this.transformers) {
			transformedEvent = transformer(transformedEvent)
		}

		// Aplicar filtros
		for (const filter of this.filters) {
			if (!filter(transformedEvent)) {
				return false
			}
		}

		// Adicionar ao buffer na posição correta (por prioridade)
		this.insertByPriority(transformedEvent)

		// Atualizar estatísticas
		this.stats.totalReceived++
		this.stats.bufferSize = this.buffer.length
		this.stats.lastEventTimestamp = Date.now()
		this.stats.eventsByType[type] = (this.stats.eventsByType[type] || 0) + 1
		this.stats.eventsByPriority[event.priority]++

		if (this.options.collectMetrics) {
			metrics.socketEvents.inc({ event: type })
		}

		this.emit('event', transformedEvent)

		// Processar se não estiver pausado
		if (!this.paused && !this.isProcessing) {
			this.processNext()
		}

		return true
	}

	/**
	 * Insere evento no buffer por prioridade
	 */
	private insertByPriority(event: StreamEvent): void {
		const eventPriorityValue = PRIORITY_VALUES[event.priority]

		// Encontrar posição correta
		let insertIndex = this.buffer.length
		for (let i = 0; i < this.buffer.length; i++) {
			if (PRIORITY_VALUES[this.buffer[i].priority] > eventPriorityValue) {
				insertIndex = i
				break
			}
		}

		this.buffer.splice(insertIndex, 0, event)
	}

	/**
	 * Registra handler para tipo de evento
	 */
	on<T = unknown>(event: BaileysEventType | '*', handler: EventHandler<T>): this {
		if (!this.handlers.has(event)) {
			this.handlers.set(event, new Set())
		}
		this.handlers.get(event)!.add(handler as EventHandler)
		return this
	}

	/**
	 * Remove handler
	 */
	off(event: BaileysEventType | '*', handler: EventHandler): this {
		const handlers = this.handlers.get(event)
		if (handlers) {
			handlers.delete(handler)
		}
		return this
	}

	/**
	 * Registra handler único
	 */
	once<T = unknown>(event: BaileysEventType, handler: EventHandler<T>): this {
		const wrappedHandler: EventHandler<T> = (e) => {
			this.off(event, wrappedHandler as EventHandler)
			return handler(e)
		}
		return this.on(event, wrappedHandler)
	}

	/**
	 * Adiciona filtro
	 */
	addFilter(filter: EventFilter): this {
		this.filters.push(filter)
		return this
	}

	/**
	 * Remove filtro
	 */
	removeFilter(filter: EventFilter): this {
		const index = this.filters.indexOf(filter)
		if (index !== -1) {
			this.filters.splice(index, 1)
		}
		return this
	}

	/**
	 * Adiciona transformador
	 */
	addTransformer(transformer: EventTransformer): this {
		this.transformers.push(transformer)
		return this
	}

	/**
	 * Processa próximos eventos
	 */
	private async processNext(): Promise<void> {
		if (this.isProcessing || this.paused || this.buffer.length === 0) {
			return
		}

		this.isProcessing = true

		try {
			// Pegar batch de eventos
			const batch = this.buffer.splice(0, this.options.batchSize)
			this.stats.bufferSize = this.buffer.length

			// Verificar se saiu de backpressure
			if (this.stats.isBackpressured && this.buffer.length <= this.options.lowWaterMark) {
				this.stats.isBackpressured = false
				this.emit('drain')
			}

			// Processar batch
			const startTime = Date.now()
			let processed = 0
			let failed = 0

			for (const event of batch) {
				try {
					await this.processEvent(event)
					processed++
					this.stats.totalProcessed++
				} catch (error) {
					failed++
					this.stats.totalFailed++
					await this.handleFailedEvent(event, error as Error)
				}
			}

			const duration = Date.now() - startTime
			this.emit('batch-processed', { processed, failed, duration } as BatchResult)

			// Continuar processando se houver mais
			if (this.buffer.length > 0) {
				setImmediate(() => this.processNext())
			}
		} finally {
			this.isProcessing = false
		}
	}

	/**
	 * Processa um evento
	 */
	private async processEvent(event: StreamEvent): Promise<void> {
		// Handlers específicos do tipo
		const typeHandlers = this.handlers.get(event.type)
		if (typeHandlers) {
			for (const handler of typeHandlers) {
				await handler(event)
			}
		}

		// Handlers globais
		const globalHandlers = this.handlers.get('*')
		if (globalHandlers) {
			for (const handler of globalHandlers) {
				await handler(event)
			}
		}
	}

	/**
	 * Trata evento que falhou
	 */
	private async handleFailedEvent(event: StreamEvent, error: Error): Promise<void> {
		event.retryCount = (event.retryCount || 0) + 1

		if (event.retryCount <= this.options.maxRetries) {
			// Re-adicionar ao buffer para retry
			event.originalTimestamp = event.originalTimestamp || event.timestamp
			event.timestamp = Date.now()
			this.buffer.push(event)
			this.stats.bufferSize = this.buffer.length

			this.emit('retry', { event, error, attempt: event.retryCount })
		} else {
			// Enviar para dead letter queue
			this.addToDeadLetterQueue(event, error)
		}

		if (this.options.collectMetrics) {
			metrics.errors.inc({ category: 'event_stream', code: 'processing_failed' })
		}
	}

	/**
	 * Adiciona evento à dead letter queue
	 */
	private addToDeadLetterQueue(event: StreamEvent, error: Error): void {
		const dlqEvent = {
			...event,
			metadata: {
				...event.metadata,
				error: error.message,
				errorStack: error.stack,
				movedToDlqAt: Date.now(),
			},
		}

		this.deadLetterQueue.push(dlqEvent)

		// Limitar tamanho da DLQ
		while (this.deadLetterQueue.length > this.options.deadLetterQueueSize) {
			this.deadLetterQueue.shift()
		}

		this.stats.deadLetterQueueSize = this.deadLetterQueue.length
		this.emit('dead-letter', dlqEvent)
	}

	/**
	 * Força flush do buffer
	 */
	async flush(): Promise<BatchResult> {
		const startTime = Date.now()
		let processed = 0
		let failed = 0

		while (this.buffer.length > 0 && !this.paused) {
			const batch = this.buffer.splice(0, this.options.batchSize)

			for (const event of batch) {
				try {
					await this.processEvent(event)
					processed++
					this.stats.totalProcessed++
				} catch (error) {
					failed++
					this.stats.totalFailed++
					await this.handleFailedEvent(event, error as Error)
				}
			}
		}

		this.stats.bufferSize = this.buffer.length

		return {
			processed,
			failed,
			duration: Date.now() - startTime,
		}
	}

	/**
	 * Pausa o processamento
	 */
	pause(): void {
		this.paused = true
		this.emit('pause')
	}

	/**
	 * Resume o processamento
	 */
	resume(): void {
		this.paused = false
		this.emit('resume')
		this.processNext()
	}

	/**
	 * Verifica se está pausado
	 */
	isPaused(): boolean {
		return this.paused
	}

	/**
	 * Limpa o buffer
	 */
	clear(): void {
		this.buffer = []
		this.stats.bufferSize = 0
		this.emit('clear')
	}

	/**
	 * Retorna eventos da dead letter queue
	 */
	getDeadLetterQueue(): StreamEvent[] {
		return [...this.deadLetterQueue]
	}

	/**
	 * Limpa dead letter queue
	 */
	clearDeadLetterQueue(): void {
		this.deadLetterQueue = []
		this.stats.deadLetterQueueSize = 0
	}

	/**
	 * Replay eventos da dead letter queue
	 */
	async replayDeadLetterQueue(): Promise<BatchResult> {
		const events = this.deadLetterQueue.splice(0)
		this.stats.deadLetterQueueSize = 0

		let processed = 0
		let failed = 0
		const startTime = Date.now()

		for (const event of events) {
			// Reset retry count
			event.retryCount = 0
			delete event.metadata?.error
			delete event.metadata?.errorStack
			delete event.metadata?.movedToDlqAt

			try {
				await this.processEvent(event)
				processed++
			} catch (error) {
				failed++
				this.addToDeadLetterQueue(event, error as Error)
			}
		}

		return {
			processed,
			failed,
			duration: Date.now() - startTime,
		}
	}

	/**
	 * Retorna estatísticas
	 */
	getStats(): EventStreamStats {
		return { ...this.stats }
	}

	/**
	 * Reseta estatísticas
	 */
	resetStats(): void {
		this.stats = this.createInitialStats()
		this.stats.bufferSize = this.buffer.length
		this.stats.deadLetterQueueSize = this.deadLetterQueue.length
	}

	/**
	 * Destroy e limpa recursos
	 */
	destroy(): void {
		if (this.flushTimer) {
			clearInterval(this.flushTimer)
		}
		this.buffer = []
		this.deadLetterQueue = []
		this.handlers.clear()
		this.filters = []
		this.transformers = []
		this.removeAllListeners()
	}
}

/**
 * Factory para criar event stream
 */
export function createEventStream(options?: EventStreamOptions): BaileysEventStream {
	return new BaileysEventStream(options)
}

/**
 * Filtros pré-definidos
 */
export const eventFilters = {
	/** Filtra por tipo de evento */
	byType:
		(...types: BaileysEventType[]): EventFilter =>
			(event) =>
				types.includes(event.type),

	/** Filtra por categoria */
	byCategory:
		(...categories: BaileysLogCategory[]): EventFilter =>
			(event) =>
				categories.includes(event.category),

	/** Filtra por prioridade mínima */
	byMinPriority:
		(minPriority: EventPriority): EventFilter =>
			(event) =>
				PRIORITY_VALUES[event.priority] <= PRIORITY_VALUES[minPriority],

	/** Filtra eventos recentes (dentro de ms) */
	recentOnly:
		(maxAgeMs: number): EventFilter =>
			(event) =>
				Date.now() - event.timestamp <= maxAgeMs,

	/** Combina filtros com AND */
	and:
		(...filters: EventFilter[]): EventFilter =>
			(event) =>
				filters.every((f) => f(event)),

	/** Combina filtros com OR */
	or:
		(...filters: EventFilter[]): EventFilter =>
			(event) =>
				filters.some((f) => f(event)),
}

/**
 * Transformadores pré-definidos
 */
export const eventTransformers = {
	/** Adiciona timestamp de processamento */
	addProcessingTimestamp: (): EventTransformer => (event) => ({
		...event,
		metadata: {
			...event.metadata,
			processingTimestamp: Date.now(),
		},
	}),

	/** Adiciona ID de trace */
	addTraceId:
		(traceIdGenerator: () => string): EventTransformer =>
			(event) => ({
				...event,
				metadata: {
					...event.metadata,
					traceId: traceIdGenerator(),
				},
			}),

	/** Eleva prioridade baseado em condição */
	elevatepriorityIf:
		(condition: (event: StreamEvent) => boolean, newPriority: EventPriority): EventTransformer =>
			(event) =>
				condition(event)
					? { ...event, priority: newPriority }
					: event,
}

export default BaileysEventStream
