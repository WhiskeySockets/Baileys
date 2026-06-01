/**
 * Stage 6 — MessageRetryManager unit tests.
 *
 * Covers the M12 changes:
 *   - `tryIncrement` is an atomic check-and-increment (single sync block);
 *   - returns `proceed: false` at the cap;
 *   - LRU caches are bounded (`max: 10_000`) so a stream of unique ids does
 *     not grow them indefinitely.
 */
import P from 'pino'
import { MessageRetryManager } from '../../Utils/message-retry-manager'

const silent = P({ level: 'silent' })

describe('MessageRetryManager.tryIncrement (M12)', () => {
	it('increments below the cap and returns proceed: true', () => {
		const m = new MessageRetryManager(silent, 5)
		const a = m.tryIncrement('msg-1')
		const b = m.tryIncrement('msg-1')
		expect(a).toEqual({ proceed: true, count: 1 })
		expect(b).toEqual({ proceed: true, count: 2 })
	})

	it('refuses to increment at or above the cap', () => {
		const m = new MessageRetryManager(silent, 3)
		expect(m.tryIncrement('msg-1').count).toBe(1)
		expect(m.tryIncrement('msg-1').count).toBe(2)
		expect(m.tryIncrement('msg-1').count).toBe(3)
		const blocked = m.tryIncrement('msg-1')
		expect(blocked.proceed).toBe(false)
		expect(blocked.count).toBe(3)
	})

	it('different message ids increment independently', () => {
		const m = new MessageRetryManager(silent, 5)
		expect(m.tryIncrement('a').count).toBe(1)
		expect(m.tryIncrement('b').count).toBe(1)
		expect(m.tryIncrement('a').count).toBe(2)
		expect(m.tryIncrement('b').count).toBe(2)
	})

	it('bounds the retryCounters cache (M12) — exceeding `max` evicts oldest entries', () => {
		const m = new MessageRetryManager(silent, 5)
		// Drive the LRU well past `max: 10_000` so eviction kicks in.
		for (let i = 0; i < 11_000; i++) m.tryIncrement(`msg-${i}`)

		// At least the very first should have been evicted (LRU). Sample-check.
		expect(m.getRetryCount('msg-0')).toBe(0)
		// Recent entries still present.
		expect(m.getRetryCount('msg-10999')).toBe(1)
	})
})
