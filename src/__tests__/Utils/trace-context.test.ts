/**
 * Testes unitários para trace-context.ts
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import {
	createTraceContext,
	getCurrentContext,
	getOrCreateContext,
	runWithContext,
	runWithNewContext,
	createSpan,
	startSpan,
	endSpan,
	addSpanEvent,
	setSpanAttributes,
	setSpanError,
	withSpan,
	withSpanSync,
	setBaggage,
	getBaggage,
	getAllBaggage,
	removeBaggage,
	injectTraceHeaders,
	extractTraceHeaders,
	exportContext,
	importContext,
	createPrecisionTimer,
	generateTraceId,
	generateSpanId,
	generateCorrelationId,
	TRACE_HEADERS,
	type TraceContext,
	type Span,
} from '../../Utils/trace-context.js'

describe('ID generation', () => {
	describe('generateTraceId', () => {
		it('should generate 32 character hex string', () => {
			const id = generateTraceId()
			expect(id).toHaveLength(32)
			expect(id).toMatch(/^[0-9a-f]+$/)
		})

		it('should generate unique IDs', () => {
			const ids = new Set()
			for (let i = 0; i < 100; i++) {
				ids.add(generateTraceId())
			}
			expect(ids.size).toBe(100)
		})
	})

	describe('generateSpanId', () => {
		it('should generate 16 character hex string', () => {
			const id = generateSpanId()
			expect(id).toHaveLength(16)
			expect(id).toMatch(/^[0-9a-f]+$/)
		})
	})

	describe('generateCorrelationId', () => {
		it('should generate readable correlation ID', () => {
			const id = generateCorrelationId()
			expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/)
		})
	})
})

describe('TraceContext', () => {
	describe('createTraceContext', () => {
		it('should create context with generated IDs', () => {
			const context = createTraceContext()

			expect(context.traceIds.traceId).toHaveLength(32)
			expect(context.traceIds.spanId).toHaveLength(16)
			expect(context.traceIds.correlationId).toBeTruthy()
			expect(context.baggage).toEqual({})
			expect(context.spanStack).toEqual([])
		})

		it('should use provided options', () => {
			const context = createTraceContext({
				traceId: 'custom-trace-id',
				correlationId: 'custom-corr-id',
				parentSpanId: 'parent-span',
				baggage: { key: 'value' },
				metadata: { env: 'test' },
			})

			expect(context.traceIds.traceId).toBe('custom-trace-id')
			expect(context.traceIds.correlationId).toBe('custom-corr-id')
			expect(context.traceIds.parentSpanId).toBe('parent-span')
			expect(context.baggage).toEqual({ key: 'value' })
			expect(context.metadata).toEqual({ env: 'test' })
		})
	})

	describe('runWithContext', () => {
		it('should make context available within scope', () => {
			const context = createTraceContext()
			let captured: TraceContext | undefined

			runWithContext(context, () => {
				captured = getCurrentContext()
			})

			expect(captured).toBe(context)
		})

		it('should not leak context outside scope', () => {
			const context = createTraceContext()

			runWithContext(context, () => {
				// Context available here
			})

			// Context should be undefined outside
			expect(getCurrentContext()).toBeUndefined()
		})

		it('should return value from function', () => {
			const context = createTraceContext()

			const result = runWithContext(context, () => 'result')

			expect(result).toBe('result')
		})
	})

	describe('runWithNewContext', () => {
		it('should create and run with new context', () => {
			let captured: TraceContext | undefined

			runWithNewContext({ baggage: { test: 'value' } }, () => {
				captured = getCurrentContext()
			})

			expect(captured).toBeDefined()
			expect(captured!.baggage.test).toBe('value')
		})
	})

	describe('getOrCreateContext', () => {
		it('should return existing context if available', () => {
			const context = createTraceContext()

			runWithContext(context, () => {
				const retrieved = getOrCreateContext()
				expect(retrieved).toBe(context)
			})
		})

		it('should create new context if none exists', () => {
			const context = getOrCreateContext()
			expect(context).toBeDefined()
			expect(context.traceIds.traceId).toHaveLength(32)
		})
	})
})

describe('Spans', () => {
	describe('createSpan', () => {
		it('should create span with provided name', () => {
			const span = createSpan({ name: 'test-span' })

			expect(span.name).toBe('test-span')
			expect(span.traceIds.spanId).toHaveLength(16)
			expect(span.startTime).toBeGreaterThan(0)
			expect(span.status).toBe('unset')
			expect(span.ended).toBe(false)
		})

		it('should include provided attributes', () => {
			const span = createSpan({
				name: 'test',
				attributes: { key: 'value', count: 42 },
			})

			expect(span.attributes).toEqual({ key: 'value', count: 42 })
		})
	})

	describe('startSpan', () => {
		it('should start span and set as current in context', () => {
			const context = createTraceContext()

			runWithContext(context, () => {
				const span = startSpan({ name: 'operation' })

				expect(getCurrentContext()!.currentSpan).toBe(span)
			})
		})

		it('should support nested spans', () => {
			const context = createTraceContext()

			runWithContext(context, () => {
				const parent = startSpan({ name: 'parent' })
				const child = startSpan({ name: 'child' })

				expect(child.traceIds.parentSpanId).toBe(parent.traceIds.spanId)
				expect(getCurrentContext()!.spanStack).toContain(parent)
			})
		})
	})

	describe('endSpan', () => {
		it('should mark span as ended', () => {
			const span = createSpan({ name: 'test' })
			endSpan(span)

			expect(span.ended).toBe(true)
			expect(span.endTime).toBeDefined()
			expect(span.duration).toBeDefined()
			expect(span.status).toBe('ok')
		})

		it('should set custom status', () => {
			const span = createSpan({ name: 'test' })
			endSpan(span, 'error')

			expect(span.status).toBe('error')
		})

		it('should not modify already ended span', () => {
			const span = createSpan({ name: 'test' })
			endSpan(span, 'ok')

			const endTime = span.endTime

			endSpan(span, 'error')

			expect(span.endTime).toBe(endTime)
			expect(span.status).toBe('ok')
		})

		it('should pop span from stack', () => {
			const context = createTraceContext()

			runWithContext(context, () => {
				const parent = startSpan({ name: 'parent' })
				const child = startSpan({ name: 'child' })

				endSpan(child)

				expect(getCurrentContext()!.currentSpan).toBe(parent)
			})
		})
	})

	describe('addSpanEvent', () => {
		it('should add event to span', () => {
			const span = createSpan({ name: 'test' })
			addSpanEvent(span, 'event-occurred', { detail: 'value' })

			expect(span.events).toHaveLength(1)
			expect(span.events[0].name).toBe('event-occurred')
			expect(span.events[0].attributes).toEqual({ detail: 'value' })
		})

		it('should not add event to ended span', () => {
			const span = createSpan({ name: 'test' })
			endSpan(span)
			addSpanEvent(span, 'late-event')

			expect(span.events).toHaveLength(0)
		})
	})

	describe('setSpanAttributes', () => {
		it('should set attributes on span', () => {
			const span = createSpan({ name: 'test' })
			setSpanAttributes(span, { key1: 'value1', key2: 'value2' })

			expect(span.attributes.key1).toBe('value1')
			expect(span.attributes.key2).toBe('value2')
		})
	})

	describe('setSpanError', () => {
		it('should mark span as error with details', () => {
			const span = createSpan({ name: 'test' })
			const error = new Error('Something went wrong')
			setSpanError(span, error)

			expect(span.status).toBe('error')
			expect(span.attributes.error).toBe(true)
			expect(span.attributes.errorMessage).toBe('Something went wrong')
			expect(span.events.some((e) => e.name === 'exception')).toBe(true)
		})
	})
})

describe('withSpan helpers', () => {
	describe('withSpan', () => {
		it('should execute async operation within span', async () => {
			const result = await withSpan('async-op', async (span) => {
				expect(span.name).toBe('async-op')
				return 'async-result'
			})

			expect(result).toBe('async-result')
		})

		it('should handle errors and mark span as error', async () => {
			await expect(
				withSpan('failing-op', async () => {
					throw new Error('Failure')
				})
			).rejects.toThrow('Failure')
		})
	})

	describe('withSpanSync', () => {
		it('should execute sync operation within span', () => {
			const result = withSpanSync('sync-op', (span) => {
				expect(span.name).toBe('sync-op')
				return 'sync-result'
			})

			expect(result).toBe('sync-result')
		})
	})
})

describe('Baggage', () => {
	it('should set and get baggage', () => {
		const context = createTraceContext()

		runWithContext(context, () => {
			setBaggage('userId', 'user-123')
			setBaggage('requestType', 'api')

			expect(getBaggage('userId')).toBe('user-123')
			expect(getBaggage('requestType')).toBe('api')
		})
	})

	it('should get all baggage', () => {
		const context = createTraceContext({ baggage: { existing: 'value' } })

		runWithContext(context, () => {
			setBaggage('new', 'item')

			const all = getAllBaggage()

			expect(all).toEqual({ existing: 'value', new: 'item' })
		})
	})

	it('should remove baggage', () => {
		const context = createTraceContext({ baggage: { toRemove: 'value' } })

		runWithContext(context, () => {
			removeBaggage('toRemove')

			expect(getBaggage('toRemove')).toBeUndefined()
		})
	})
})

describe('Header injection/extraction', () => {
	describe('injectTraceHeaders', () => {
		it('should inject trace headers', () => {
			const context = createTraceContext({
				baggage: { user: 'test' },
			})

			const headers = runWithContext(context, () => {
				return injectTraceHeaders({})
			})

			expect(headers[TRACE_HEADERS.TRACE_ID]).toBe(context.traceIds.traceId)
			expect(headers[TRACE_HEADERS.SPAN_ID]).toBe(context.traceIds.spanId)
			expect(headers[TRACE_HEADERS.CORRELATION_ID]).toBe(context.traceIds.correlationId)
			expect(headers[TRACE_HEADERS.BAGGAGE]).toContain('user=test')
		})

		it('should preserve existing headers', () => {
			const context = createTraceContext()

			const headers = runWithContext(context, () => {
				return injectTraceHeaders({ 'Content-Type': 'application/json' })
			})

			expect(headers['Content-Type']).toBe('application/json')
		})
	})

	describe('extractTraceHeaders', () => {
		it('should extract trace context from headers', () => {
			const headers = {
				[TRACE_HEADERS.TRACE_ID]: 'trace-123',
				[TRACE_HEADERS.PARENT_SPAN_ID]: 'parent-456',
				[TRACE_HEADERS.CORRELATION_ID]: 'corr-789',
				[TRACE_HEADERS.BAGGAGE]: 'key1=value1,key2=value2',
			}

			const options = extractTraceHeaders(headers)

			expect(options.traceId).toBe('trace-123')
			expect(options.parentSpanId).toBe('parent-456')
			expect(options.correlationId).toBe('corr-789')
			expect(options.baggage).toEqual({ key1: 'value1', key2: 'value2' })
		})
	})
})

describe('Context serialization', () => {
	describe('exportContext', () => {
		it('should serialize context to JSON string', () => {
			const context = createTraceContext({
				baggage: { key: 'value' },
				metadata: { env: 'test' },
			})

			const exported = exportContext(context)
			const parsed = JSON.parse(exported)

			expect(parsed.traceIds).toEqual(context.traceIds)
			expect(parsed.baggage).toEqual(context.baggage)
			expect(parsed.metadata).toEqual(context.metadata)
		})
	})

	describe('importContext', () => {
		it('should deserialize context from JSON string', () => {
			const serialized = JSON.stringify({
				traceIds: {
					traceId: 'trace-123',
					spanId: 'span-456',
					correlationId: 'corr-789',
				},
				baggage: { imported: 'value' },
				metadata: { source: 'external' },
			})

			const options = importContext(serialized)

			expect(options.traceId).toBe('trace-123')
			expect(options.parentSpanId).toBe('span-456')
			expect(options.correlationId).toBe('corr-789')
			expect(options.baggage).toEqual({ imported: 'value' })
		})

		it('should handle invalid JSON gracefully', () => {
			const options = importContext('invalid json')
			expect(options).toEqual({})
		})
	})
})

describe('PrecisionTimer', () => {
	it('should measure elapsed time', async () => {
		const timer = createPrecisionTimer()

		await new Promise((resolve) => setTimeout(resolve, 20))

		const elapsed = timer.elapsed()
		expect(elapsed).toBeGreaterThan(10)
	})

	it('should format elapsed time', async () => {
		const timer = createPrecisionTimer()

		await new Promise((resolve) => setTimeout(resolve, 5))

		const formatted = timer.elapsedFormatted()
		expect(formatted).toMatch(/\d+(\.\d+)?(µs|ms|s)/)
	})

	it('should stop timer', async () => {
		const timer = createPrecisionTimer()

		await new Promise((resolve) => setTimeout(resolve, 10))

		const stopped = timer.stop()

		await new Promise((resolve) => setTimeout(resolve, 20))

		const afterStop = timer.elapsed()

		expect(afterStop).toBe(stopped)
	})
})
