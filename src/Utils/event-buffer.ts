import EventEmitter from 'events'
import type {
	BaileysEvent,
	BaileysEventEmitter,
	BaileysEventMap,
	BufferedEventData,
	Chat,
	ChatUpdate,
	Contact,
	WAMessage,
	WAMessageKey
} from '../Types'
import { WAMessageStatus } from '../Types'
import { trimUndefined } from './generics'
import type { ILogger } from './logger'
import { updateMessageWithReaction, updateMessageWithReceipt } from './messages'
import { isRealMessage, shouldIncrementChatUnread } from './process-message'
import { logEventBuffer } from './baileys-logger'

// ============================================================================
// BUFFER CONFIGURATION - Environment Variable Support
// ============================================================================

/**
 * Buffer configuration loaded from environment variables
 * Allows runtime customization without code changes
 */
export interface BufferConfig {
	/** Maximum buffer timeout in milliseconds */
	bufferTimeoutMs: number
	/** Minimum buffer timeout for adaptive algorithm */
	minBufferTimeoutMs: number
	/** Maximum buffer timeout for adaptive algorithm */
	maxBufferTimeoutMs: number
	/** Maximum history cache size before cleanup */
	maxHistoryCacheSize: number
	/** Maximum events before forcing a flush (overflow protection) */
	maxBufferSize: number
	/** Debounce delay for flush after buffered function */
	flushDebounceMs: number
	/** Enable adaptive timeout based on load */
	enableAdaptiveTimeout: boolean
	/** Enable Prometheus metrics */
	enableMetrics: boolean
	/** LRU cleanup percentage (0-1) when cache exceeds max */
	lruCleanupRatio: number
	/** Warn threshold for buffer size (percentage of max) */
	bufferWarnThreshold: number
}

/**
 * Load buffer configuration from environment variables
 * Uses BAILEYS_BUFFER_* prefix for consistency
 */
export function loadBufferConfig(): BufferConfig {
	return {
		bufferTimeoutMs: parseInt(process.env.BAILEYS_BUFFER_TIMEOUT_MS || '30000', 10),
		minBufferTimeoutMs: parseInt(process.env.BAILEYS_BUFFER_MIN_TIMEOUT_MS || '5000', 10),
		maxBufferTimeoutMs: parseInt(process.env.BAILEYS_BUFFER_MAX_TIMEOUT_MS || '60000', 10),
		maxHistoryCacheSize: parseInt(process.env.BAILEYS_BUFFER_MAX_HISTORY_CACHE || '10000', 10),
		maxBufferSize: parseInt(process.env.BAILEYS_BUFFER_MAX_SIZE || '5000', 10),
		flushDebounceMs: parseInt(process.env.BAILEYS_BUFFER_FLUSH_DEBOUNCE_MS || '100', 10),
		enableAdaptiveTimeout: process.env.BAILEYS_BUFFER_ADAPTIVE_TIMEOUT !== 'false',
		enableMetrics: process.env.BAILEYS_BUFFER_METRICS === 'true' || process.env.BAILEYS_PROMETHEUS_ENABLED === 'true',
		lruCleanupRatio: parseFloat(process.env.BAILEYS_BUFFER_LRU_CLEANUP_RATIO || '0.2'),
		bufferWarnThreshold: parseFloat(process.env.BAILEYS_BUFFER_WARN_THRESHOLD || '0.8')
	}
}

// ============================================================================
// BUFFERABLE EVENTS
// ============================================================================

const BUFFERABLE_EVENT = [
	'messaging-history.set',
	'chats.upsert',
	'chats.update',
	'chats.delete',
	'contacts.upsert',
	'contacts.update',
	'messages.upsert',
	'messages.update',
	'messages.delete',
	'messages.reaction',
	'message-receipt.update',
	'groups.update'
] as const

type BufferableEvent = (typeof BUFFERABLE_EVENT)[number]

/**
 * A map that contains a list of all events that have been triggered
 *
 * Note, this can contain different type of events
 * this can make processing events extremely efficient -- since everything
 * can be done in a single transaction
 */
type BaileysEventData = Partial<BaileysEventMap>

const BUFFERABLE_EVENT_SET = new Set<BaileysEvent>(BUFFERABLE_EVENT)

// ============================================================================
// BUFFER STATISTICS - For Metrics and Monitoring
// ============================================================================

/**
 * Statistics about buffer operations for monitoring and debugging
 */
export interface BufferStatistics {
	/** Total number of flushes performed */
	totalFlushes: number
	/** Total number of forced flushes (overflow/timeout) */
	forcedFlushes: number
	/** Total events buffered */
	totalEventsBuffered: number
	/** Current buffer size */
	currentBufferSize: number
	/** Peak buffer size reached */
	peakBufferSize: number
	/** Total buffer overflows prevented */
	overflowsDetected: number
	/** Current adaptive timeout */
	currentTimeout: number
	/** History cache size */
	historyCacheSize: number
	/** LRU cleanups performed */
	lruCleanups: number
	/** Average events per flush */
	avgEventsPerFlush: number
	/** Buffer creation timestamp */
	createdAt: number
	/** Last flush timestamp */
	lastFlushAt: number | null
}

// ============================================================================
// EXTENDED EVENT EMITTER TYPE
// ============================================================================

type BaileysBufferableEventEmitter = BaileysEventEmitter & {
	/** Use to process events in a batch */
	process(handler: (events: BaileysEventData) => void | Promise<void>): () => void
	/**
	 * starts buffering events, call flush() to release them
	 */
	buffer(): void
	/** buffers all events till the promise completes */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	createBufferedFunction<A extends any[], T>(work: (...args: A) => Promise<T>): (...args: A) => Promise<T>
	/**
	 * flushes all buffered events
	 * @param force - If true, flush even if buffer is empty or not buffering
	 * @returns returns true if the flush actually happened, otherwise false
	 */
	flush(force?: boolean): boolean
	/** is there an ongoing buffer */
	isBuffering(): boolean
	/**
	 * Destroy the buffer and clean up all resources
	 * CRITICAL: Call this when done to prevent memory leaks
	 */
	destroy(): void
	/** Check if buffer has been destroyed */
	isDestroyed(): boolean
	/** Get buffer statistics for monitoring */
	getStatistics(): BufferStatistics
	/** Get current configuration */
	getConfig(): BufferConfig
}

// ============================================================================
// LRU CACHE ENTRY WITH TIMESTAMP
// ============================================================================

interface LRUCacheEntry {
	key: string
	timestamp: number
}

/**
 * Simple LRU tracking for history cache
 * Tracks access times to enable partial cleanup
 */
class LRUTracker {
	private entries: Map<string, number> = new Map()

	add(key: string): void {
		this.entries.set(key, Date.now())
	}

	has(key: string): boolean {
		return this.entries.has(key)
	}

	touch(key: string): void {
		if (this.entries.has(key)) {
			this.entries.set(key, Date.now())
		}
	}

	get size(): number {
		return this.entries.size
	}

	/**
	 * Remove oldest entries up to the specified ratio
	 * @param ratio - Percentage of entries to remove (0-1)
	 * @returns Array of removed keys
	 */
	cleanup(ratio: number): string[] {
		const removeCount = Math.floor(this.entries.size * ratio)
		if (removeCount === 0) return []

		// Sort by timestamp (oldest first)
		const sorted: LRUCacheEntry[] = []
		this.entries.forEach((timestamp, key) => {
			sorted.push({ key, timestamp })
		})
		sorted.sort((a, b) => a.timestamp - b.timestamp)

		// Remove oldest entries
		const removed: string[] = []
		for (let i = 0; i < removeCount && i < sorted.length; i++) {
			const entry = sorted[i]
			if (entry) {
				this.entries.delete(entry.key)
				removed.push(entry.key)
			}
		}

		return removed
	}

	clear(): void {
		this.entries.clear()
	}
}

// ============================================================================
// ADAPTIVE TIMEOUT ALGORITHM
// ============================================================================

/**
 * Adaptive timeout calculator based on buffer activity
 * Adjusts timeout based on event rate to optimize batching
 */
class AdaptiveTimeoutCalculator {
	private eventTimestamps: number[] = []
	private readonly windowSize = 100 // Track last 100 events
	private readonly minTimeout: number
	private readonly maxTimeout: number
	private currentTimeout: number

	constructor(minTimeout: number, maxTimeout: number, initialTimeout: number) {
		this.minTimeout = minTimeout
		this.maxTimeout = maxTimeout
		this.currentTimeout = initialTimeout
	}

	/**
	 * Record an event and recalculate optimal timeout
	 */
	recordEvent(): void {
		const now = Date.now()
		this.eventTimestamps.push(now)

		// Keep only recent events
		if (this.eventTimestamps.length > this.windowSize) {
			this.eventTimestamps.shift()
		}

		this.recalculateTimeout()
	}

	/**
	 * Get current calculated timeout
	 */
	getTimeout(): number {
		return this.currentTimeout
	}

	/**
	 * Recalculate timeout based on event rate
	 * High rate = shorter timeout (flush more often)
	 * Low rate = longer timeout (batch more events)
	 */
	private recalculateTimeout(): void {
		if (this.eventTimestamps.length < 2) {
			return // Not enough data
		}

		const oldest = this.eventTimestamps[0]!
		const newest = this.eventTimestamps[this.eventTimestamps.length - 1]!
		const timeSpan = newest - oldest

		if (timeSpan === 0) return

		// Calculate events per second
		const eventsPerSecond = (this.eventTimestamps.length / timeSpan) * 1000

		// Adjust timeout inversely to event rate
		// High rate (>100 eps) = min timeout
		// Low rate (<1 eps) = max timeout
		if (eventsPerSecond > 100) {
			this.currentTimeout = this.minTimeout
		} else if (eventsPerSecond < 1) {
			this.currentTimeout = this.maxTimeout
		} else {
			// Linear interpolation between min and max
			const ratio = Math.log10(eventsPerSecond + 1) / 2 // 0 to 1 scale
			this.currentTimeout = this.maxTimeout - (this.maxTimeout - this.minTimeout) * ratio
		}
	}

	reset(): void {
		this.eventTimestamps = []
		this.currentTimeout = (this.minTimeout + this.maxTimeout) / 2
	}

	/**
	 * Get current adaptive mode based on timeout
	 * Returns 'aggressive', 'balanced', or 'conservative'
	 */
	getMode(): 'aggressive' | 'balanced' | 'conservative' {
		if (this.currentTimeout <= this.minTimeout * 1.5) {
			return 'aggressive'
		} else if (this.currentTimeout >= this.maxTimeout * 0.8) {
			return 'conservative'
		}
		return 'balanced'
	}

	/**
	 * Get current event rate in events per second
	 */
	getEventRate(): number {
		if (this.eventTimestamps.length < 2) {
			return 0
		}
		const oldest = this.eventTimestamps[0]!
		const newest = this.eventTimestamps[this.eventTimestamps.length - 1]!
		const timeSpan = newest - oldest
		if (timeSpan === 0) return 0
		return (this.eventTimestamps.length / timeSpan) * 1000
	}

	/**
	 * Check if system is healthy based on current mode
	 * Conservative mode with low event rate is healthy
	 * Aggressive mode might indicate high load
	 */
	isHealthy(): boolean {
		const mode = this.getMode()
		// System is considered healthy if not in aggressive mode (high load)
		return mode !== 'aggressive'
	}
}

// ============================================================================
// MAIN EVENT BUFFER FACTORY
// ============================================================================

/**
 * The event buffer logically consolidates different events into a single event
 * making the data processing more efficient.
 *
 * Enterprise-grade features:
 * - Environment variable configuration
 * - Proper resource cleanup (destroy method)
 * - Buffer overflow detection and prevention
 * - Adaptive timeout based on event rate
 * - LRU cache cleanup instead of full clear
 * - Prometheus metrics integration
 * - Force flush capability
 * - Comprehensive statistics
 */
export const makeEventBuffer = (
	logger: ILogger,
	configOverride?: Partial<BufferConfig>
): BaileysBufferableEventEmitter => {
	// Load configuration
	const config: BufferConfig = {
		...loadBufferConfig(),
		...configOverride
	}

	const ev = new EventEmitter()
	const historyCache = new LRUTracker()

	let data = makeBufferData()
	let isBuffering = false
	let destroyed = false
	let bufferTimeout: NodeJS.Timeout | null = null
	let flushPendingTimeout: NodeJS.Timeout | null = null
	let bufferCount = 0
	let currentEventCount = 0

	// Statistics tracking
	const stats: BufferStatistics = {
		totalFlushes: 0,
		forcedFlushes: 0,
		totalEventsBuffered: 0,
		currentBufferSize: 0,
		peakBufferSize: 0,
		overflowsDetected: 0,
		currentTimeout: config.bufferTimeoutMs,
		historyCacheSize: 0,
		lruCleanups: 0,
		avgEventsPerFlush: 0,
		createdAt: Date.now(),
		lastFlushAt: null
	}

	// Adaptive timeout calculator
	const adaptiveTimeout = new AdaptiveTimeoutCalculator(
		config.minBufferTimeoutMs,
		config.maxBufferTimeoutMs,
		config.bufferTimeoutMs
	)

	// Metrics integration (lazy loaded to avoid circular deps)
	let metricsModule: typeof import('./prometheus-metrics') | null = null
	let metricsQueue: Array<() => void> = []
	let metricsImportFailed = false
	const MAX_METRICS_QUEUE_SIZE = 1000 // Cap to prevent unbounded growth

	if (config.enableMetrics) {
		import('./prometheus-metrics').then(m => {
			metricsModule = m
			logger.debug({ queuedCount: metricsQueue.length }, '📊 Prometheus metrics loaded, flushing buffered metrics')
			// Flush buffered metrics
			metricsQueue.forEach(fn => fn())
			metricsQueue = []
		}).catch(() => {
			logger.debug('Prometheus metrics not available for event buffer')
			metricsImportFailed = true
			// Clear queue to prevent memory leak
			metricsQueue = []
		})
	}

	// Helper to record metrics with buffer support
	const recordMetrics = (eventType: string, count: number) => {
		if (metricsModule) {
			metricsModule.recordEventBuffered(eventType, count)
		} else if (!metricsImportFailed && metricsQueue.length < MAX_METRICS_QUEUE_SIZE) {
			// Buffer metric call until module loads (with size limit)
			metricsQueue.push(() => metricsModule?.recordEventBuffered(eventType, count))
		}
		// If import failed or queue is full, silently drop metric
	}

	const recordFlushMetrics = (eventCount: number, forced: boolean, cacheSize: number) => {
		if (metricsModule) {
			metricsModule.recordBufferFlush(eventCount, forced, cacheSize)
		} else if (!metricsImportFailed && metricsQueue.length < MAX_METRICS_QUEUE_SIZE) {
			metricsQueue.push(() => metricsModule?.recordBufferFlush(eventCount, forced, cacheSize))
		}
	}

	// Cleanup helper
	const clearAllTimers = () => {
		if (bufferTimeout) {
			clearTimeout(bufferTimeout)
			bufferTimeout = null
		}
		if (flushPendingTimeout) {
			clearTimeout(flushPendingTimeout)
			flushPendingTimeout = null
		}
	}

	// Take the generic event and fire it as a baileys event
	ev.on('event', (map: BaileysEventData) => {
		for (const event in map) {
			ev.emit(event, map[event as keyof BaileysEventMap])
		}
	})

	/**
	 * Check for buffer overflow and handle it
	 */
	function checkBufferOverflow(): boolean {
		if (currentEventCount >= config.maxBufferSize) {
			stats.overflowsDetected++
			logger.warn({
				currentSize: currentEventCount,
				maxSize: config.maxBufferSize
			}, 'Buffer overflow detected, forcing flush')
			logEventBuffer('buffer_overflow', {
				currentSize: currentEventCount,
				maxSize: config.maxBufferSize
			})
			// Record overflow metric
			if (metricsModule) {
				metricsModule.recordBufferOverflow()
			} else if (!metricsImportFailed && metricsQueue.length < MAX_METRICS_QUEUE_SIZE) {
				metricsQueue.push(() => metricsModule?.recordBufferOverflow())
			}
			flush(true)
			return true
		}

		// Warn if approaching threshold
		const threshold = config.maxBufferSize * config.bufferWarnThreshold
		if (currentEventCount >= threshold && currentEventCount < config.maxBufferSize) {
			logger.debug({
				currentSize: currentEventCount,
				threshold,
				maxSize: config.maxBufferSize
			}, 'Buffer approaching overflow threshold')
		}

		return false
	}

	/**
	 * Perform LRU cleanup on history cache
	 */
	function cleanupHistoryCache(): void {
		if (historyCache.size > config.maxHistoryCacheSize) {
			const removed = historyCache.cleanup(config.lruCleanupRatio)
			stats.lruCleanups++
			logger.debug({
				removed: removed.length,
				remaining: historyCache.size,
				maxSize: config.maxHistoryCacheSize
			}, 'LRU cleanup performed on history cache')
			logEventBuffer('cache_cleanup', {
				removed: removed.length,
				remaining: historyCache.size
			})
			// Record metrics for cache cleanup
			if (metricsModule) {
				metricsModule.recordCacheCleanup(removed.length)
			} else if (!metricsImportFailed && metricsQueue.length < MAX_METRICS_QUEUE_SIZE) {
				metricsQueue.push(() => metricsModule?.recordCacheCleanup(removed.length))
			}
		}
	}

	function buffer() {
		if (destroyed) {
			logger.warn('Attempted to buffer on destroyed event buffer')
			return
		}

		if (!isBuffering) {
			logger.debug('Event buffer activated')
			logEventBuffer('buffer_start')
			isBuffering = true
			bufferCount = 0
			currentEventCount = 0

			clearAllTimers()

			// Use adaptive timeout if enabled
			const timeout = config.enableAdaptiveTimeout
				? adaptiveTimeout.getTimeout()
				: config.bufferTimeoutMs
			stats.currentTimeout = timeout

			bufferTimeout = setTimeout(() => {
				if (isBuffering) {
					logger.warn({ timeout }, 'Buffer timeout reached, auto-flushing')
					logEventBuffer('buffer_timeout', { timeout })
					stats.forcedFlushes++
					flush(true)
				}
			}, timeout)
		}

		// Always increment count when requested
		bufferCount++
	}

	function flush(force: boolean = false): boolean {
		if (destroyed) {
			logger.warn('Attempted to flush destroyed event buffer')
			return false
		}

		if (!isBuffering && !force) {
			return false
		}

		const eventCount = currentEventCount
		const flushStartTime = Date.now()
		logger.debug({ bufferCount, eventCount, force }, 'Flushing event buffer')

		isBuffering = false
		bufferCount = 0
		currentEventCount = 0
		stats.totalFlushes++
		stats.lastFlushAt = Date.now()

		// Update average events per flush
		stats.avgEventsPerFlush = stats.totalFlushes > 0
			? (stats.avgEventsPerFlush * (stats.totalFlushes - 1) + eventCount) / stats.totalFlushes
			: eventCount

		// Clear timeouts
		clearAllTimers()

		// Perform LRU cleanup instead of full clear
		cleanupHistoryCache()
		stats.historyCacheSize = historyCache.size

		// Record metrics
		recordFlushMetrics(eventCount, force, historyCache.size)

		// Update adaptive metrics
		if (config.enableAdaptiveTimeout) {
			if (metricsModule) {
				metricsModule.updateAdaptiveMetrics(adaptiveTimeout.getEventRate(), adaptiveTimeout.isHealthy())
			} else if (!metricsImportFailed && metricsQueue.length < MAX_METRICS_QUEUE_SIZE) {
				metricsQueue.push(() => metricsModule?.updateAdaptiveMetrics(adaptiveTimeout.getEventRate(), adaptiveTimeout.isHealthy()))
			}
		}

		// Log with [BAILEYS] prefix - use getMode() to avoid duplicating mode calculation logic
		const flushDuration = Date.now() - flushStartTime
		logEventBuffer('buffer_flush', {
			flushCount: stats.totalFlushes,
			historyCacheSize: stats.historyCacheSize,
			mode: config.enableAdaptiveTimeout ? adaptiveTimeout.getMode() : 'fixed',
			...(flushDuration > 5 ? { duration: `${flushDuration}ms` } : {})
		})

		const newData = makeBufferData()
		const chatUpdates = Object.values(data.chatUpdates)
		let conditionalChatUpdatesLeft = 0
		for (const update of chatUpdates) {
			if (update.conditional) {
				conditionalChatUpdatesLeft += 1
				newData.chatUpdates[update.id!] = update
				delete data.chatUpdates[update.id!]
			}
		}

		const consolidatedData = consolidateEvents(data)
		if (Object.keys(consolidatedData).length) {
			ev.emit('event', consolidatedData)
		}

		data = newData

		logger.trace({ conditionalChatUpdatesLeft, eventCount }, 'released buffered events')

		// Reset adaptive timeout calculator on flush
		if (config.enableAdaptiveTimeout) {
			adaptiveTimeout.reset()
		}

		return true
	}

	function destroy(): void {
		if (destroyed) {
			logger.debug('Event buffer already destroyed')
			return
		}

		logger.debug('Destroying event buffer')
		const hadPendingFlush = isBuffering
		destroyed = true

		// Flush any remaining events
		if (hadPendingFlush) {
			flush(true)
			// Record final flush metric
			if (metricsModule) {
				metricsModule.recordBufferFinalFlush()
			} else if (!metricsImportFailed && metricsQueue.length < MAX_METRICS_QUEUE_SIZE) {
				metricsQueue.push(() => metricsModule?.recordBufferFinalFlush())
			}
		}

		// Clear all timers
		clearAllTimers()

		// Clear all data structures
		data = makeBufferData()
		historyCache.clear()

		// Remove all event listeners
		ev.removeAllListeners()

		// Record buffer destroyed metric
		if (metricsModule) {
			metricsModule.recordBufferDestroyed('normal', hadPendingFlush)
		} else if (!metricsImportFailed && metricsQueue.length < MAX_METRICS_QUEUE_SIZE) {
			metricsQueue.push(() => metricsModule?.recordBufferDestroyed('normal', hadPendingFlush))
		}

		logger.debug('Event buffer destroyed successfully')
	}

	return {
		process(handler) {
			if (destroyed) {
				throw new Error('Cannot process on destroyed event buffer')
			}

			const listener = async (map: BaileysEventData) => {
				await handler(map)
			}

			ev.on('event', listener)
			return () => {
				ev.off('event', listener)
			}
		},
		emit<T extends BaileysEvent>(event: BaileysEvent, evData: BaileysEventMap[T]) {
			if (destroyed) {
				logger.warn({ event }, 'Attempted to emit on destroyed event buffer')
				return false
			}

			// Check if this is a messages.upsert with a different type than what's buffered
			// If so, flush the buffered messages first to avoid type overshadowing
			if (event === 'messages.upsert') {
				const { type } = evData as BaileysEventMap['messages.upsert']
				const existingUpserts = Object.values(data.messageUpserts)
				if (existingUpserts.length > 0) {
					const bufferedType = existingUpserts[0]!.type
					if (bufferedType !== type) {
						logger.debug({ bufferedType, newType: type }, 'messages.upsert type mismatch, emitting buffered messages')
						// Emit the buffered messages with their correct type
						ev.emit('event', {
							'messages.upsert': {
								messages: existingUpserts.map(m => m.message),
								type: bufferedType
							}
						})
						// Clear the message upserts from the buffer
						data.messageUpserts = {}
					}
				}
			}

			if (isBuffering && BUFFERABLE_EVENT_SET.has(event)) {
				// Record event for adaptive timeout
				if (config.enableAdaptiveTimeout) {
					adaptiveTimeout.recordEvent()
				}

				// Track statistics
				currentEventCount++
				stats.totalEventsBuffered++
				stats.currentBufferSize = currentEventCount
				if (currentEventCount > stats.peakBufferSize) {
					stats.peakBufferSize = currentEventCount
				}

				// Record metrics
				recordMetrics(event, 1)

				// Check for overflow
				if (checkBufferOverflow()) {
					// Buffer was flushed due to overflow, re-buffer this event
					buffer()
				}

				append(data, historyCache, event as BufferableEvent, evData, logger)
				return true
			}

			return ev.emit('event', { [event]: evData })
		},
		isBuffering() {
			return isBuffering && !destroyed
		},
		isDestroyed() {
			return destroyed
		},
		buffer,
		flush,
		destroy,
		getStatistics() {
			return {
				...stats,
				currentBufferSize: currentEventCount,
				historyCacheSize: historyCache.size,
				currentTimeout: config.enableAdaptiveTimeout
					? adaptiveTimeout.getTimeout()
					: config.bufferTimeoutMs
			}
		},
		getConfig() {
			return { ...config }
		},
		createBufferedFunction(work) {
			// Track the timeout for this specific function call
			let functionTimeout: NodeJS.Timeout | null = null

			return async (...args) => {
				if (destroyed) {
					throw new Error('Cannot execute buffered function on destroyed event buffer')
				}

				buffer()
				try {
					const result = await work(...args)

					// If this is the only buffer, flush after a small delay
					if (bufferCount === 1) {
						// Clear any existing function timeout to prevent orphaned timers
						if (functionTimeout) {
							clearTimeout(functionTimeout)
						}
						functionTimeout = setTimeout(() => {
							functionTimeout = null
							if (isBuffering && bufferCount === 1 && !destroyed) {
								flush()
							}
						}, config.flushDebounceMs)
					}

					return result
				} catch (error) {
					// Clear timeout on error
					if (functionTimeout) {
						clearTimeout(functionTimeout)
						functionTimeout = null
					}
					throw error
				} finally {
					bufferCount = Math.max(0, bufferCount - 1)
					if (bufferCount === 0 && !destroyed) {
						// Only schedule ONE timeout, not multiple
						if (!flushPendingTimeout) {
							flushPendingTimeout = setTimeout(() => {
								flushPendingTimeout = null
								if (!destroyed) {
									flush()
								}
							}, config.flushDebounceMs)
						}
					}
				}
			}
		},
		on: (...args) => {
			if (destroyed) {
				throw new Error('Cannot add listener to destroyed event buffer')
			}
			return ev.on(...args)
		},
		off: (...args) => ev.off(...args),
		removeAllListeners: (...args) => ev.removeAllListeners(...args)
	}
}

// ============================================================================
// BUFFER DATA STRUCTURE
// ============================================================================

const makeBufferData = (): BufferedEventData => {
	return {
		historySets: {
			chats: {},
			messages: {},
			contacts: {},
			isLatest: false,
			empty: true
		},
		chatUpserts: {},
		chatUpdates: {},
		chatDeletes: new Set(),
		contactUpserts: {},
		contactUpdates: {},
		messageUpserts: {},
		messageUpdates: {},
		messageReactions: {},
		messageDeletes: {},
		messageReceipts: {},
		groupUpdates: {}
	}
}

// ============================================================================
// EVENT APPEND LOGIC
// ============================================================================

function append<E extends BufferableEvent>(
	data: BufferedEventData,
	historyCache: LRUTracker,
	event: E,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	eventData: any,
	logger: ILogger
) {
	switch (event) {
		case 'messaging-history.set':
			for (const chat of eventData.chats as Chat[]) {
				const id = chat.id || ''
				const existingChat = data.historySets.chats[id]
				if (existingChat) {
					existingChat.endOfHistoryTransferType = chat.endOfHistoryTransferType
				}

				if (!existingChat && !historyCache.has(id)) {
					data.historySets.chats[id] = chat
					historyCache.add(id)

					absorbingChatUpdate(chat)
				} else {
					// Touch existing entry for LRU tracking
					historyCache.touch(id)
				}
			}

			for (const contact of eventData.contacts as Contact[]) {
				const existingContact = data.historySets.contacts[contact.id]
				if (existingContact) {
					Object.assign(existingContact, trimUndefined(contact))
				} else {
					const historyContactId = `c:${contact.id}`
					const hasAnyName = contact.notify || contact.name || contact.verifiedName
					if (!historyCache.has(historyContactId) || hasAnyName) {
						data.historySets.contacts[contact.id] = contact
						historyCache.add(historyContactId)
					} else {
						historyCache.touch(historyContactId)
					}
				}
			}

			for (const message of eventData.messages as WAMessage[]) {
				const key = stringifyMessageKey(message.key)
				const existingMsg = data.historySets.messages[key]
				if (!existingMsg && !historyCache.has(key)) {
					data.historySets.messages[key] = message
					historyCache.add(key)
				} else {
					historyCache.touch(key)
				}
			}

			data.historySets.empty = false
			data.historySets.syncType = eventData.syncType
			data.historySets.progress = eventData.progress
			data.historySets.peerDataRequestSessionId = eventData.peerDataRequestSessionId
			data.historySets.isLatest = eventData.isLatest || data.historySets.isLatest

			break
		case 'chats.upsert':
			for (const chat of eventData as Chat[]) {
				const id = chat.id || ''
				let upsert = data.chatUpserts[id]
				if (id && !upsert) {
					upsert = data.historySets.chats[id]
					if (upsert) {
						logger.debug({ chatId: id }, 'absorbed chat upsert in chat set')
					}
				}

				if (upsert) {
					upsert = concatChats(upsert, chat)
				} else {
					upsert = chat
					data.chatUpserts[id] = upsert
				}

				absorbingChatUpdate(upsert)

				if (data.chatDeletes.has(id)) {
					data.chatDeletes.delete(id)
				}
			}

			break
		case 'chats.update':
			for (const update of eventData as ChatUpdate[]) {
				const chatId = update.id!
				const conditionMatches = update.conditional ? update.conditional(data) : true
				if (conditionMatches) {
					delete update.conditional

					// if there is an existing upsert, merge the update into it
					const upsert = data.historySets.chats[chatId] || data.chatUpserts[chatId]
					if (upsert) {
						concatChats(upsert, update)
					} else {
						// merge the update into the existing update
						const chatUpdate = data.chatUpdates[chatId] || {}
						data.chatUpdates[chatId] = concatChats(chatUpdate, update)
					}
				} else if (conditionMatches === undefined) {
					// condition yet to be fulfilled
					data.chatUpdates[chatId] = update
				}
				// otherwise -- condition not met, update is invalid

				// if the chat has been updated
				// ignore any existing chat delete
				if (data.chatDeletes.has(chatId)) {
					data.chatDeletes.delete(chatId)
				}
			}

			break
		case 'chats.delete':
			for (const chatId of eventData as string[]) {
				if (!data.chatDeletes.has(chatId)) {
					data.chatDeletes.add(chatId)
				}

				// remove any prior updates & upserts
				if (data.chatUpdates[chatId]) {
					delete data.chatUpdates[chatId]
				}

				if (data.chatUpserts[chatId]) {
					delete data.chatUpserts[chatId]
				}

				if (data.historySets.chats[chatId]) {
					delete data.historySets.chats[chatId]
				}
			}

			break
		case 'contacts.upsert':
			for (const contact of eventData as Contact[]) {
				let upsert = data.contactUpserts[contact.id]
				if (!upsert) {
					upsert = data.historySets.contacts[contact.id]
					if (upsert) {
						logger.debug({ contactId: contact.id }, 'absorbed contact upsert in contact set')
					}
				}

				if (upsert) {
					upsert = Object.assign(upsert, trimUndefined(contact))
				} else {
					upsert = contact
					data.contactUpserts[contact.id] = upsert
				}

				if (data.contactUpdates[contact.id]) {
					upsert = Object.assign(data.contactUpdates[contact.id]!, trimUndefined(contact)) as Contact
					delete data.contactUpdates[contact.id]
				}
			}

			break
		case 'contacts.update':
			const contactUpdates = eventData as BaileysEventMap['contacts.update']
			for (const update of contactUpdates) {
				const id = update.id!
				// merge into prior upsert
				const upsert = data.historySets.contacts[id] || data.contactUpserts[id]
				if (upsert) {
					Object.assign(upsert, update)
				} else {
					// merge into prior update
					const contactUpdate = data.contactUpdates[id] || {}
					data.contactUpdates[id] = Object.assign(contactUpdate, update)
				}
			}

			break
		case 'messages.upsert':
			const { messages, type } = eventData as BaileysEventMap['messages.upsert']
			for (const message of messages) {
				const key = stringifyMessageKey(message.key)
				let existing = data.messageUpserts[key]?.message
				if (!existing) {
					existing = data.historySets.messages[key]
					if (existing) {
						logger.debug({ messageId: key }, 'absorbed message upsert in message set')
					}
				}

				if (existing) {
					message.messageTimestamp = existing.messageTimestamp
				}

				if (data.messageUpdates[key]) {
					logger.debug('absorbed prior message update in message upsert')
					Object.assign(message, data.messageUpdates[key].update)
					delete data.messageUpdates[key]
				}

				if (data.historySets.messages[key]) {
					data.historySets.messages[key] = message
				} else {
					data.messageUpserts[key] = {
						message,
						type: type === 'notify' || data.messageUpserts[key]?.type === 'notify' ? 'notify' : type
					}
				}
			}

			break
		case 'messages.update':
			const msgUpdates = eventData as BaileysEventMap['messages.update']
			for (const { key, update } of msgUpdates) {
				const keyStr = stringifyMessageKey(key)
				const existing = data.historySets.messages[keyStr] || data.messageUpserts[keyStr]?.message
				if (existing) {
					Object.assign(existing, update)
					// if the message was received & read by us
					// the chat counter must have been incremented
					// so we need to decrement it
					if (update.status === WAMessageStatus.READ && !key.fromMe) {
						decrementChatReadCounterIfMsgDidUnread(existing)
					}
				} else {
					const msgUpdate = data.messageUpdates[keyStr] || { key, update: {} }
					Object.assign(msgUpdate.update, update)
					data.messageUpdates[keyStr] = msgUpdate
				}
			}

			break
		case 'messages.delete':
			const deleteData = eventData as BaileysEventMap['messages.delete']
			if ('keys' in deleteData) {
				const { keys } = deleteData
				for (const key of keys) {
					const keyStr = stringifyMessageKey(key)
					if (!data.messageDeletes[keyStr]) {
						data.messageDeletes[keyStr] = key
					}

					if (data.messageUpserts[keyStr]) {
						delete data.messageUpserts[keyStr]
					}

					if (data.messageUpdates[keyStr]) {
						delete data.messageUpdates[keyStr]
					}
				}
			} else {
				// TODO: add support
			}

			break
		case 'messages.reaction':
			const reactions = eventData as BaileysEventMap['messages.reaction']
			for (const { key, reaction } of reactions) {
				const keyStr = stringifyMessageKey(key)
				const existing = data.messageUpserts[keyStr]
				if (existing) {
					updateMessageWithReaction(existing.message, reaction)
				} else {
					data.messageReactions[keyStr] = data.messageReactions[keyStr] || { key, reactions: [] }
					updateMessageWithReaction(data.messageReactions[keyStr], reaction)
				}
			}

			break
		case 'message-receipt.update':
			const receipts = eventData as BaileysEventMap['message-receipt.update']
			for (const { key, receipt } of receipts) {
				const keyStr = stringifyMessageKey(key)
				const existing = data.messageUpserts[keyStr]
				if (existing) {
					updateMessageWithReceipt(existing.message, receipt)
				} else {
					data.messageReceipts[keyStr] = data.messageReceipts[keyStr] || { key, userReceipt: [] }
					updateMessageWithReceipt(data.messageReceipts[keyStr], receipt)
				}
			}

			break
		case 'groups.update':
			const groupUpdates = eventData as BaileysEventMap['groups.update']
			for (const update of groupUpdates) {
				const id = update.id!
				const groupUpdate = data.groupUpdates[id] || {}
				if (!data.groupUpdates[id]) {
					data.groupUpdates[id] = Object.assign(groupUpdate, update)
				}
			}

			break
		default:
			throw new Error(`"${event}" cannot be buffered`)
	}

	function absorbingChatUpdate(existing: Chat) {
		const chatId = existing.id || ''
		const update = data.chatUpdates[chatId]
		if (update) {
			const conditionMatches = update.conditional ? update.conditional(data) : true
			if (conditionMatches) {
				delete update.conditional
				logger.debug({ chatId }, 'absorbed chat update in existing chat')
				Object.assign(existing, concatChats(update as Chat, existing))
				delete data.chatUpdates[chatId]
			} else if (conditionMatches === false) {
				logger.debug({ chatId }, 'chat update condition fail, removing')
				delete data.chatUpdates[chatId]
			}
		}
	}

	function decrementChatReadCounterIfMsgDidUnread(message: WAMessage) {
		// decrement chat unread counter
		// if the message has already been marked read by us
		const chatId = message.key.remoteJid!
		const chat = data.chatUpdates[chatId] || data.chatUpserts[chatId]
		if (
			isRealMessage(message) &&
			shouldIncrementChatUnread(message) &&
			typeof chat?.unreadCount === 'number' &&
			chat.unreadCount > 0
		) {
			logger.debug({ chatId: chat.id }, 'decrementing chat counter')
			chat.unreadCount -= 1
			if (chat.unreadCount === 0) {
				delete chat.unreadCount
			}
		}
	}
}

// ============================================================================
// EVENT CONSOLIDATION
// ============================================================================

function consolidateEvents(data: BufferedEventData) {
	const map: BaileysEventData = {}

	if (!data.historySets.empty) {
		map['messaging-history.set'] = {
			chats: Object.values(data.historySets.chats),
			messages: Object.values(data.historySets.messages),
			contacts: Object.values(data.historySets.contacts),
			syncType: data.historySets.syncType,
			progress: data.historySets.progress,
			isLatest: data.historySets.isLatest,
			peerDataRequestSessionId: data.historySets.peerDataRequestSessionId
		}
	}

	const chatUpsertList = Object.values(data.chatUpserts)
	if (chatUpsertList.length) {
		map['chats.upsert'] = chatUpsertList
	}

	const chatUpdateList = Object.values(data.chatUpdates)
	if (chatUpdateList.length) {
		map['chats.update'] = chatUpdateList
	}

	const chatDeleteList = Array.from(data.chatDeletes)
	if (chatDeleteList.length) {
		map['chats.delete'] = chatDeleteList
	}

	const messageUpsertList = Object.values(data.messageUpserts)
	if (messageUpsertList.length) {
		const type = messageUpsertList[0]!.type
		map['messages.upsert'] = {
			messages: messageUpsertList.map(m => m.message),
			type
		}
	}

	const messageUpdateList = Object.values(data.messageUpdates)
	if (messageUpdateList.length) {
		map['messages.update'] = messageUpdateList
	}

	const messageDeleteList = Object.values(data.messageDeletes)
	if (messageDeleteList.length) {
		map['messages.delete'] = { keys: messageDeleteList }
	}

	const messageReactionList = Object.values(data.messageReactions).flatMap(({ key, reactions }) =>
		reactions.flatMap(reaction => ({ key, reaction }))
	)
	if (messageReactionList.length) {
		map['messages.reaction'] = messageReactionList
	}

	const messageReceiptList = Object.values(data.messageReceipts).flatMap(({ key, userReceipt }) =>
		userReceipt.flatMap(receipt => ({ key, receipt }))
	)
	if (messageReceiptList.length) {
		map['message-receipt.update'] = messageReceiptList
	}

	const contactUpsertList = Object.values(data.contactUpserts)
	if (contactUpsertList.length) {
		map['contacts.upsert'] = contactUpsertList
	}

	const contactUpdateList = Object.values(data.contactUpdates)
	if (contactUpdateList.length) {
		map['contacts.update'] = contactUpdateList
	}

	const groupUpdateList = Object.values(data.groupUpdates)
	if (groupUpdateList.length) {
		map['groups.update'] = groupUpdateList
	}

	return map
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function concatChats<C extends Partial<Chat>>(a: C, b: Partial<Chat>) {
	if (
		b.unreadCount === null && // neutralize unread counter
		a.unreadCount! < 0
	) {
		a.unreadCount = undefined
		b.unreadCount = undefined
	}

	if (typeof a.unreadCount === 'number' && typeof b.unreadCount === 'number') {
		b = { ...b }
		if (b.unreadCount! >= 0) {
			b.unreadCount = Math.max(b.unreadCount!, 0) + Math.max(a.unreadCount, 0)
		}
	}

	return Object.assign(a, b)
}

const stringifyMessageKey = (key: WAMessageKey) => `${key.remoteJid},${key.id},${key.fromMe ? '1' : '0'}`
