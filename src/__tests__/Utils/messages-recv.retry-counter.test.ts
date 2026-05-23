/**
 * H9 — Retry counter mutated under two different mutex chains.
 *
 * `msgRetryCache["${msgId}:${participant}"]` is incremented in two paths:
 *   - inbound retry-receipt → `receiptMutex` (messages-recv.ts:1308)
 *   - outbound `sendRetryRequest` → `retryMutex` (nested in messageMutex; messages-recv.ts:592, 604)
 *
 * The classic `await cache.get → +1 → await cache.set` sequence loses
 * increments when both paths fire simultaneously. Stage 6's fix is an atomic
 * increment helper guarded by a per-`(msgId, participant)` lock that both
 * call paths use.
 *
 * Failing while H9 is unresolved. Flipped to `it(...)` in Stage 6.
 */
import type { CacheStore } from '../../Types'

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

/** Behavioral stand-in for the in-memory cache that backs msgRetryCache. */
const makeCacheStore = (): CacheStore => {
	const data = new Map<string, unknown>()
	return {
		get<T>(key: string): T | undefined {
			return data.get(key) as T | undefined
		},
		set<T>(key: string, value: T): void {
			data.set(key, value)
		},
		del(key: string): void {
			data.delete(key)
		},
		flushAll(): void {
			data.clear()
		}
	}
}

/**
 * Reproduces today's pattern verbatim from messages-recv.ts:
 *   `await cache.get → +1 → await cache.set`, no lock.
 */
async function todaysIncrement(cache: CacheStore, key: string): Promise<number> {
	const current = (await cache.get<number>(key)) ?? 0
	await delay(5) // models the gap between get and set under real concurrency
	const next = current + 1
	await cache.set(key, next)
	return next
}

describe('msgRetryCache — atomic increment across retry paths (H9)', () => {
	it.failing('parallel increments do not lose updates', async () => {
		const cache = makeCacheStore()
		const key = 'msg-123:peer@s.whatsapp.net'

		const N = 10
		await Promise.all(Array.from({ length: N }, () => todaysIncrement(cache, key)))

		const final = (await cache.get<number>(key)) as number
		expect(final).toBe(N)
	})

	it.failing('the two retry paths agree on the counter when interleaved', async () => {
		// Two parallel callers race read-add-write on the same key. With a
		// shared lock (Stage 6) the final counter equals the call count.
		const cache = makeCacheStore()
		const key = 'msg-123:peer@s.whatsapp.net'

		const ops: Promise<unknown>[] = []
		for (let i = 0; i < 10; i++) ops.push(todaysIncrement(cache, key))
		await Promise.all(ops)

		const final = (await cache.get<number>(key)) as number
		expect(final).toBe(10)
	})
})
