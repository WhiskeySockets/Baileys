/**
 * Testes unitários para baileys-event-stream.ts
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import {
	BaileysEventStream,
	createEventStream,
	eventFilters,
	eventTransformers,
	type StreamEvent,
	type BaileysEventType,
	type EventPriority,
} from '../../Utils/baileys-event-stream.js'

describe('BaileysEventStream', () => {
	let stream: BaileysEventStream

	beforeEach(() => {
		stream = createEventStream({
			maxBufferSize: 100,
			batchSize: 10,
			collectMetrics: false,
		})
	})

	afterEach(() => {
		stream.destroy()
	})

	describe('push events', () => {
		it('should push event to stream', () => {
			const result = stream.push('messages.upsert', { message: 'test' })

			expect(result).toBe(true)
			expect(stream.getStats().bufferSize).toBeGreaterThan(0)
		})

		it('should assign priority based on event type', (done) => {
			stream.on('*', (event) => {
				expect(event.priority).toBe('critical')
				done()
			})

			stream.push('connection.update', { state: 'open' })
		})

		it('should use custom priority when provided', (done) => {
			stream.on('*', (event) => {
				expect(event.priority).toBe('low')
				done()
			})

			stream.push('messages.upsert', { message: 'test' }, { priority: 'low' })
		})

		it('should assign correct category', (done) => {
			stream.on('*', (event) => {
				expect(event.category).toBe('message')
				done()
			})

			stream.push('messages.upsert', { message: 'test' })
		})

		it('should reject events when buffer is full', () => {
			const smallStream = createEventStream({
				maxBufferSize: 5,
				enableBackpressure: true,
				highWaterMark: 3,
				collectMetrics: false,
			})

			smallStream.pause() // Prevent processing

			for (let i = 0; i < 5; i++) {
				smallStream.push('messages.upsert', { index: i })
			}

			const result = smallStream.push('messages.upsert', { overflow: true })

			expect(result).toBe(false)
			expect(smallStream.getStats().totalDropped).toBe(1)

			smallStream.destroy()
		})
	})

	describe('event handlers', () => {
		it('should call handler for specific event type', async () => {
			const handler = jest.fn()

			stream.on('messages.upsert', handler)
			stream.push('messages.upsert', { message: 'test' })

			// Wait for processing
			await new Promise((resolve) => setTimeout(resolve, 50))

			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should call global handler for all events', async () => {
			const handler = jest.fn()

			stream.on('*', handler)
			stream.push('messages.upsert', { message: 'test' })
			stream.push('connection.update', { state: 'open' })

			await new Promise((resolve) => setTimeout(resolve, 50))

			expect(handler).toHaveBeenCalledTimes(2)
		})

		it('should support once handler', async () => {
			const handler = jest.fn()

			stream.once('messages.upsert', handler)
			stream.push('messages.upsert', { first: true })
			stream.push('messages.upsert', { second: true })

			await new Promise((resolve) => setTimeout(resolve, 50))

			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should remove handler with off', async () => {
			const handler = jest.fn()

			stream.on('messages.upsert', handler)
			stream.off('messages.upsert', handler)
			stream.push('messages.upsert', { message: 'test' })

			await new Promise((resolve) => setTimeout(resolve, 50))

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('pause and resume', () => {
		it('should pause processing', async () => {
			const handler = jest.fn()

			stream.on('messages.upsert', handler)
			stream.pause()

			expect(stream.isPaused()).toBe(true)

			stream.push('messages.upsert', { message: 'test' })

			await new Promise((resolve) => setTimeout(resolve, 50))

			expect(handler).not.toHaveBeenCalled()
		})

		it('should resume processing', async () => {
			const handler = jest.fn()

			stream.on('messages.upsert', handler)
			stream.pause()
			stream.push('messages.upsert', { message: 'test' })
			stream.resume()

			await new Promise((resolve) => setTimeout(resolve, 50))

			expect(handler).toHaveBeenCalled()
		})
	})

	describe('flush', () => {
		it('should process all buffered events', async () => {
			const handler = jest.fn()

			stream.pause()
			stream.on('messages.upsert', handler)

			for (let i = 0; i < 5; i++) {
				stream.push('messages.upsert', { index: i })
			}

			stream.resume()
			const result = await stream.flush()

			expect(result.processed).toBe(5)
			expect(handler).toHaveBeenCalledTimes(5)
		})
	})

	describe('filters', () => {
		it('should filter events before processing', async () => {
			const handler = jest.fn()

			stream.addFilter((event) => event.data.include === true)
			stream.on('*', handler)

			stream.push('messages.upsert', { include: true })
			stream.push('messages.upsert', { include: false })

			await new Promise((resolve) => setTimeout(resolve, 50))

			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should remove filter', async () => {
			const filter = (event: StreamEvent) => false

			stream.addFilter(filter)
			stream.removeFilter(filter)

			const handler = jest.fn()
			stream.on('*', handler)

			stream.push('messages.upsert', { test: true })

			await new Promise((resolve) => setTimeout(resolve, 50))

			expect(handler).toHaveBeenCalled()
		})
	})

	describe('transformers', () => {
		it('should transform events before processing', async () => {
			stream.addTransformer((event) => ({
				...event,
				metadata: { ...event.metadata, transformed: true },
			}))

			let receivedEvent: StreamEvent | null = null
			stream.on('*', (event) => {
				receivedEvent = event
			})

			stream.push('messages.upsert', { message: 'test' })

			await new Promise((resolve) => setTimeout(resolve, 50))

			expect(receivedEvent?.metadata?.transformed).toBe(true)
		})
	})

	describe('dead letter queue', () => {
		it('should move failed events to DLQ after max retries', async () => {
			const failingHandler = jest.fn(() => {
				throw new Error('Processing failed')
			})

			const dlqStream = createEventStream({
				maxRetries: 2,
				batchSize: 1,
				collectMetrics: false,
			})

			dlqStream.on('messages.upsert', failingHandler)
			dlqStream.push('messages.upsert', { will: 'fail' })

			await new Promise((resolve) => setTimeout(resolve, 200))

			const dlq = dlqStream.getDeadLetterQueue()
			expect(dlq.length).toBeGreaterThan(0)

			dlqStream.destroy()
		})

		it('should clear DLQ', () => {
			stream.push('test', { data: 'test' })

			// Manually add to DLQ for testing
			const dlq = stream.getDeadLetterQueue()

			stream.clearDeadLetterQueue()

			expect(stream.getStats().deadLetterQueueSize).toBe(0)
		})
	})

	describe('statistics', () => {
		it('should track event statistics', async () => {
			stream.on('*', () => {})

			stream.push('messages.upsert', { a: 1 })
			stream.push('connection.update', { b: 2 })
			stream.push('messages.update', { c: 3 })

			await new Promise((resolve) => setTimeout(resolve, 50))

			const stats = stream.getStats()

			expect(stats.totalReceived).toBe(3)
			expect(stats.totalProcessed).toBe(3)
			expect(stats.eventsByType['messages.upsert']).toBe(1)
			expect(stats.eventsByType['connection.update']).toBe(1)
		})

		it('should reset statistics', async () => {
			stream.on('*', () => {})
			stream.push('messages.upsert', { test: true })

			await new Promise((resolve) => setTimeout(resolve, 50))

			stream.resetStats()

			const stats = stream.getStats()
			expect(stats.totalReceived).toBe(0)
			expect(stats.totalProcessed).toBe(0)
		})
	})

	describe('priority ordering', () => {
		it('should process critical events before normal events', async () => {
			const processedOrder: EventPriority[] = []

			stream.pause()

			stream.on('*', (event) => {
				processedOrder.push(event.priority)
			})

			// Add in reverse priority order
			stream.push('presence.update', {}, { priority: 'low' })
			stream.push('messages.upsert', {}, { priority: 'normal' })
			stream.push('connection.update', {}, { priority: 'critical' })
			stream.push('call', {}, { priority: 'high' })

			stream.resume()
			await stream.flush()

			expect(processedOrder[0]).toBe('critical')
			expect(processedOrder[1]).toBe('high')
			expect(processedOrder[2]).toBe('normal')
			expect(processedOrder[3]).toBe('low')
		})
	})

	describe('backpressure', () => {
		it('should emit backpressure event when high water mark reached', (done) => {
			const bpStream = createEventStream({
				maxBufferSize: 100,
				highWaterMark: 5,
				enableBackpressure: true,
				collectMetrics: false,
			})

			bpStream.pause()

			bpStream.on('backpressure', () => {
				expect(bpStream.getStats().isBackpressured).toBe(true)
				bpStream.destroy()
				done()
			})

			for (let i = 0; i < 10; i++) {
				bpStream.push('messages.upsert', { index: i })
			}
		})

		it('should emit drain event when below low water mark', (done) => {
			const bpStream = createEventStream({
				maxBufferSize: 100,
				highWaterMark: 5,
				lowWaterMark: 2,
				enableBackpressure: true,
				batchSize: 10,
				collectMetrics: false,
			})

			bpStream.pause()

			for (let i = 0; i < 10; i++) {
				bpStream.push('messages.upsert', { index: i })
			}

			bpStream.on('*', () => {})
			bpStream.on('drain', () => {
				bpStream.destroy()
				done()
			})

			bpStream.resume()
		})
	})

	describe('clear', () => {
		it('should clear buffer', () => {
			stream.pause()

			for (let i = 0; i < 10; i++) {
				stream.push('messages.upsert', { index: i })
			}

			stream.clear()

			expect(stream.getStats().bufferSize).toBe(0)
		})
	})
})

describe('eventFilters', () => {
	describe('byType', () => {
		it('should filter by event type', () => {
			const filter = eventFilters.byType('messages.upsert', 'messages.update')

			const matchingEvent: StreamEvent = {
				id: '1',
				type: 'messages.upsert',
				data: {},
				timestamp: Date.now(),
				priority: 'normal',
				category: 'message',
			}

			const nonMatchingEvent: StreamEvent = {
				id: '2',
				type: 'connection.update',
				data: {},
				timestamp: Date.now(),
				priority: 'normal',
				category: 'connection',
			}

			expect(filter(matchingEvent)).toBe(true)
			expect(filter(nonMatchingEvent)).toBe(false)
		})
	})

	describe('byCategory', () => {
		it('should filter by category', () => {
			const filter = eventFilters.byCategory('message', 'connection')

			const matchingEvent: StreamEvent = {
				id: '1',
				type: 'messages.upsert',
				data: {},
				timestamp: Date.now(),
				priority: 'normal',
				category: 'message',
			}

			const nonMatchingEvent: StreamEvent = {
				id: '2',
				type: 'presence.update',
				data: {},
				timestamp: Date.now(),
				priority: 'normal',
				category: 'presence',
			}

			expect(filter(matchingEvent)).toBe(true)
			expect(filter(nonMatchingEvent)).toBe(false)
		})
	})

	describe('byMinPriority', () => {
		it('should filter by minimum priority', () => {
			const filter = eventFilters.byMinPriority('high')

			const criticalEvent: StreamEvent = {
				id: '1',
				type: 'connection.update',
				data: {},
				timestamp: Date.now(),
				priority: 'critical',
				category: 'connection',
			}

			const lowEvent: StreamEvent = {
				id: '2',
				type: 'presence.update',
				data: {},
				timestamp: Date.now(),
				priority: 'low',
				category: 'presence',
			}

			expect(filter(criticalEvent)).toBe(true)
			expect(filter(lowEvent)).toBe(false)
		})
	})

	describe('recentOnly', () => {
		it('should filter old events', () => {
			const filter = eventFilters.recentOnly(1000)

			const recentEvent: StreamEvent = {
				id: '1',
				type: 'messages.upsert',
				data: {},
				timestamp: Date.now(),
				priority: 'normal',
				category: 'message',
			}

			const oldEvent: StreamEvent = {
				id: '2',
				type: 'messages.upsert',
				data: {},
				timestamp: Date.now() - 5000,
				priority: 'normal',
				category: 'message',
			}

			expect(filter(recentEvent)).toBe(true)
			expect(filter(oldEvent)).toBe(false)
		})
	})

	describe('and', () => {
		it('should combine filters with AND', () => {
			const filter = eventFilters.and(
				eventFilters.byType('messages.upsert'),
				eventFilters.byMinPriority('high')
			)

			const matchingEvent: StreamEvent = {
				id: '1',
				type: 'messages.upsert',
				data: {},
				timestamp: Date.now(),
				priority: 'high',
				category: 'message',
			}

			const partialMatch: StreamEvent = {
				id: '2',
				type: 'messages.upsert',
				data: {},
				timestamp: Date.now(),
				priority: 'low',
				category: 'message',
			}

			expect(filter(matchingEvent)).toBe(true)
			expect(filter(partialMatch)).toBe(false)
		})
	})

	describe('or', () => {
		it('should combine filters with OR', () => {
			const filter = eventFilters.or(
				eventFilters.byType('messages.upsert'),
				eventFilters.byCategory('connection')
			)

			const typeMatch: StreamEvent = {
				id: '1',
				type: 'messages.upsert',
				data: {},
				timestamp: Date.now(),
				priority: 'normal',
				category: 'message',
			}

			const categoryMatch: StreamEvent = {
				id: '2',
				type: 'connection.update',
				data: {},
				timestamp: Date.now(),
				priority: 'normal',
				category: 'connection',
			}

			const noMatch: StreamEvent = {
				id: '3',
				type: 'presence.update',
				data: {},
				timestamp: Date.now(),
				priority: 'normal',
				category: 'presence',
			}

			expect(filter(typeMatch)).toBe(true)
			expect(filter(categoryMatch)).toBe(true)
			expect(filter(noMatch)).toBe(false)
		})
	})
})

describe('eventTransformers', () => {
	describe('addProcessingTimestamp', () => {
		it('should add processing timestamp', () => {
			const transformer = eventTransformers.addProcessingTimestamp()

			const event: StreamEvent = {
				id: '1',
				type: 'messages.upsert',
				data: {},
				timestamp: Date.now() - 1000,
				priority: 'normal',
				category: 'message',
			}

			const transformed = transformer(event)

			expect(transformed.metadata?.processingTimestamp).toBeDefined()
			expect(transformed.metadata?.processingTimestamp).toBeGreaterThan(event.timestamp)
		})
	})

	describe('addTraceId', () => {
		it('should add trace ID', () => {
			const transformer = eventTransformers.addTraceId(() => 'trace-123')

			const event: StreamEvent = {
				id: '1',
				type: 'messages.upsert',
				data: {},
				timestamp: Date.now(),
				priority: 'normal',
				category: 'message',
			}

			const transformed = transformer(event)

			expect(transformed.metadata?.traceId).toBe('trace-123')
		})
	})

	describe('elevatepriorityIf', () => {
		it('should elevate priority when condition is met', () => {
			const transformer = eventTransformers.elevatepriorityIf(
				(event) => (event.data as { urgent?: boolean }).urgent === true,
				'critical'
			)

			const urgentEvent: StreamEvent = {
				id: '1',
				type: 'messages.upsert',
				data: { urgent: true },
				timestamp: Date.now(),
				priority: 'normal',
				category: 'message',
			}

			const normalEvent: StreamEvent = {
				id: '2',
				type: 'messages.upsert',
				data: { urgent: false },
				timestamp: Date.now(),
				priority: 'normal',
				category: 'message',
			}

			expect(transformer(urgentEvent).priority).toBe('critical')
			expect(transformer(normalEvent).priority).toBe('normal')
		})
	})
})
