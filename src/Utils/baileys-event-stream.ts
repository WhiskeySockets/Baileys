/**
 * Baileys Event Stream Management
 *
 * Provides:
 * - Event buffering with backpressure
 * - Event transformation and filtering
 * - Priority queues for events
 * - Batch processing
 * - Dead letter queue for failed events
 * - Event replay
 * - Logging and metrics integration
 *
 * @module Utils/baileys-event-stream
 */

import { EventEmitter } from 'events'
import { metrics } from './prometheus-metrics.js'
import type { BaileysLogCategory } from './baileys-logger.js'

/**
 * Baileys event types
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
	| string // For custom events

/**
 * Event priority
 */
export type EventPriority = 'critical' | 'high' | 'normal' | 'low'

/**
 * Numeric priority values
 */
const PRIORITY_VALUES: Record<EventPriority, number> = {
	critical: 0,
	high: 1,
	normal: 2,
	low: 3,
}

/**
 * Stream event
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
 * Event Stream options
 */
export interface EventStreamOptions {
	/** Maximum buffer size (default: 10000) */
	maxBufferSize?: number
	/** Whether to apply backpressure when buffer is full */
	enableBackpressure?: boolean
	/** High water mark limit for backpressure */
	highWaterMark?: number
	/** Low water mark limit to resume */
	lowWaterMark?: number
	/** Batch size for processing */
	batchSize?: number
	/** Flush interval in ms (0 = disabled) */
	flushInterval?: number
	/** Maximum retries for failed events */
	maxRetries?: number
	/** Dead letter queue size */
	deadLetterQueueSize?: number
	/** Whether to collect metrics */
	collectMetrics?: boolean
	/** Stream name for metrics */
	streamName?: string
}

/**
 * Event handler
 */
export type EventHandler<T = unknown> = (event: StreamEvent<T>) => void | Promise<void>

/**
 * Event filter
 */
export type EventFilter<T = unknown> = (event: StreamEvent<T>) => boolean

/**
 * Event transformer
 */
export type EventTransformer<T = unknown, R = unknown> = (event: StreamEvent<T>) => StreamEvent<R>

/**
 * Batch processing result
 */
export interface BatchResult {
	processed: number
	failed: number
	duration: number
}

/**
 * Stream statistics
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
 * Event type to category mapping
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
 * Default priority by event type
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
 * Generate unique event ID
 */
function generateEventId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Main Event Stream class
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

		// Start periodic flush if configured
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
	 * Add event to stream
	 */
	push<T>(type: BaileysEventType, data: T, options?: { priority?: EventPriority; metadata?: Record<string, unknown> }): boolean {
		// Check backpressure
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

		// Apply transformers
		let transformedEvent: StreamEvent = event
		for (const transformer of this.transformers) {
			transformedEvent = transformer(transformedEvent)
		}

		// Apply filters
		for (const filter of this.filters) {
			if (!filter(transformedEvent)) {
				return false
			}
		}

		// Add to buffer at correct position (by priority)
		this.insertByPriority(transformedEvent)

		// Update statistics
		this.stats.totalReceived++
		this.stats.bufferSize = this.buffer.length
		this.stats.lastEventTimestamp = Date.now()
		this.stats.eventsByType[type] = (this.stats.eventsByType[type] || 0) + 1
		this.stats.eventsByPriority[event.priority]++

		if (this.options.collectMetrics) {
			metrics.socketEvents.inc({ event: type })
		}

		this.emit('event', transformedEvent)

		// Process if not paused
		if (!this.paused && !this.isProcessing) {
			this.processNext()
		}

		return true
	}

	/**
	 * Insert event in buffer by priority
	 */
	private insertByPriority(event: StreamEvent): void {
		const eventPriorityValue = PRIORITY_VALUES[event.priority]

		// Find correct position
		let insertIndex = this.buffer.length
		for (let i = 0; i < this.buffer.length; i++) {
			const bufferEvent = this.buffer[i]
			if (bufferEvent && PRIORITY_VALUES[bufferEvent.priority] > eventPriorityValue) {
				insertIndex = i
				break
			}
		}

		this.buffer.splice(insertIndex, 0, event)
	}

	/**
	 * Register handler for event type
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
	 * Register single-use handler
	 */
	once<T = unknown>(event: BaileysEventType, handler: EventHandler<T>): this {
		const wrappedHandler: EventHandler<T> = (e) => {
			this.off(event, wrappedHandler as EventHandler)
			return handler(e)
		}
		return this.on(event, wrappedHandler)
	}

	/**
	 * Add filter
	 */
	addFilter(filter: EventFilter): this {
		this.filters.push(filter)
		return this
	}

	/**
	 * Remove filter
	 */
	removeFilter(filter: EventFilter): this {
		const index = this.filters.indexOf(filter)
		if (index !== -1) {
			this.filters.splice(index, 1)
		}
		return this
	}

	/**
	 * Add transformer
	 */
	addTransformer(transformer: EventTransformer): this {
		this.transformers.push(transformer)
		return this
	}

	/**
	 * Process next events
	 */
	private async processNext(): Promise<void> {
		if (this.isProcessing || this.paused || this.buffer.length === 0) {
			return
		}

		this.isProcessing = true

		try {
			// Get batch of events
			const batch = this.buffer.splice(0, this.options.batchSize)
			this.stats.bufferSize = this.buffer.length

			// Check if exited backpressure
			if (this.stats.isBackpressured && this.buffer.length <= this.options.lowWaterMark) {
				this.stats.isBackpressured = false
				this.emit('drain')
			}

			// Process batch
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

			// Continue processing if there are more
			if (this.buffer.length > 0) {
				setImmediate(() => this.processNext())
			}
		} finally {
			this.isProcessing = false
		}
	}

	/**
	 * Process a single event
	 */
	private async processEvent(event: StreamEvent): Promise<void> {
		// Type-specific handlers
		const typeHandlers = this.handlers.get(event.type)
		if (typeHandlers) {
			for (const handler of typeHandlers) {
				await handler(event)
			}
		}

		// Global handlers
		const globalHandlers = this.handlers.get('*')
		if (globalHandlers) {
			for (const handler of globalHandlers) {
				await handler(event)
			}
		}
	}

	/**
	 * Handle failed event
	 */
	private async handleFailedEvent(event: StreamEvent, error: Error): Promise<void> {
		event.retryCount = (event.retryCount || 0) + 1

		if (event.retryCount <= this.options.maxRetries) {
			// Re-add to buffer for retry
			event.originalTimestamp = event.originalTimestamp || event.timestamp
			event.timestamp = Date.now()
			this.buffer.push(event)
			this.stats.bufferSize = this.buffer.length

			this.emit('retry', { event, error, attempt: event.retryCount })
		} else {
			// Send to dead letter queue
			this.addToDeadLetterQueue(event, error)
		}

		if (this.options.collectMetrics) {
			metrics.errors.inc({ category: 'event_stream', code: 'processing_failed' })
		}
	}

	/**
	 * Add event to dead letter queue
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

		// Limit DLQ size
		while (this.deadLetterQueue.length > this.options.deadLetterQueueSize) {
			this.deadLetterQueue.shift()
		}

		this.stats.deadLetterQueueSize = this.deadLetterQueue.length
		this.emit('dead-letter', dlqEvent)
	}

	/**
	 * Force flush the buffer
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
	 * Pause processing
	 */
	pause(): void {
		this.paused = true
		this.emit('pause')
	}

	/**
	 * Resume processing
	 */
	resume(): void {
		this.paused = false
		this.emit('resume')
		this.processNext()
	}

	/**
	 * Check if paused
	 */
	isPaused(): boolean {
		return this.paused
	}

	/**
	 * Clear the buffer
	 */
	clear(): void {
		this.buffer = []
		this.stats.bufferSize = 0
		this.emit('clear')
	}

	/**
	 * Return dead letter queue events
	 */
	getDeadLetterQueue(): StreamEvent[] {
		return [...this.deadLetterQueue]
	}

	/**
	 * Clear dead letter queue
	 */
	clearDeadLetterQueue(): void {
		this.deadLetterQueue = []
		this.stats.deadLetterQueueSize = 0
	}

	/**
	 * Replay dead letter queue events
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
	 * Return statistics
	 */
	getStats(): EventStreamStats {
		return { ...this.stats }
	}

	/**
	 * Reset statistics
	 */
	resetStats(): void {
		this.stats = this.createInitialStats()
		this.stats.bufferSize = this.buffer.length
		this.stats.deadLetterQueueSize = this.deadLetterQueue.length
	}

	/**
	 * Destroy and clean up resources
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
 * Factory to create event stream
 */
export function createEventStream(options?: EventStreamOptions): BaileysEventStream {
	return new BaileysEventStream(options)
}

/**
 * Pre-defined filters
 */
export const eventFilters = {
	/** Filter by event type */
	byType:
		(...types: BaileysEventType[]): EventFilter =>
			(event) =>
				types.includes(event.type),

	/** Filter by category */
	byCategory:
		(...categories: BaileysLogCategory[]): EventFilter =>
			(event) =>
				categories.includes(event.category),

	/** Filter by minimum priority */
	byMinPriority:
		(minPriority: EventPriority): EventFilter =>
			(event) =>
				PRIORITY_VALUES[event.priority] <= PRIORITY_VALUES[minPriority],

	/** Filter recent events (within ms) */
	recentOnly:
		(maxAgeMs: number): EventFilter =>
			(event) =>
				Date.now() - event.timestamp <= maxAgeMs,

	/** Combine filters with AND */
	and:
		(...filters: EventFilter[]): EventFilter =>
			(event) =>
				filters.every((f) => f(event)),

	/** Combine filters with OR */
	or:
		(...filters: EventFilter[]): EventFilter =>
			(event) =>
				filters.some((f) => f(event)),
}

/**
 * Pre-defined transformers
 */
export const eventTransformers = {
	/** Add processing timestamp */
	addProcessingTimestamp: (): EventTransformer => (event) => ({
		...event,
		metadata: {
			...event.metadata,
			processingTimestamp: Date.now(),
		},
	}),

	/** Add trace ID */
	addTraceId:
		(traceIdGenerator: () => string): EventTransformer =>
			(event) => ({
				...event,
				metadata: {
					...event.metadata,
					traceId: traceIdGenerator(),
				},
			}),

	/** Elevate priority based on condition */
	elevatepriorityIf:
		(condition: (event: StreamEvent) => boolean, newPriority: EventPriority): EventTransformer =>
			(event) =>
				condition(event)
					? { ...event, priority: newPriority }
					: event,
}

export default BaileysEventStream
