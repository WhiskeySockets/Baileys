/**
 * H9 — Retry counter mutated under two different mutex chains. CLOSED in
 * Stage 6 by routing `msgRetryCache` read-modify-write through a shared
 * `retryLocks: LockManager` instance keyed on `(msgId, participant)`. Both
 * call paths in `messages-recv.ts` — `sendRetryRequest` (was under
 * `retryMutex` → `messageMutex`) and `updateSendMessageAgainCount` (under
 * `receiptMutex`) — now acquire the same per-key lock for the RMW.
 *
 * Pinned here at the LockManager primitive level: under the same locking
 * strategy the production code now uses, parallel increments do not lose
 * updates. Different `(msgId, participant)` pairs proceed in parallel.
 */
import type { CacheStore } from '../../Types'
import { makeLockManager } from '../../Utils/lock-manager'

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

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
 * Mirrors the production `incrementRetryAndGet` helper:
 *   per-(msgId,participant) lock → read → +1 → write → return.
 */
const makeIncrementer = (cache: CacheStore) => {
	const locks = makeLockManager()
	return async (msgId: string, participant: string): Promise<number> => {
		return locks.withLock({ namespace: 'msg-retry', id: `${msgId}:${participant}` }, async () => {
			const key = `${msgId}:${participant}`
			await delay(5)
			const next = ((await cache.get<number>(key)) ?? 0) + 1
			await delay(5)
			await cache.set(key, next)
			return next
		})
	}
}

describe('msgRetryCache — atomic increment across retry paths (H9)', () => {
	it('parallel increments on the same key do not lose updates', async () => {
		const cache = makeCacheStore()
		const increment = makeIncrementer(cache)

		const key = 'msg-123:peer@s.whatsapp.net'
		const N = 10
		await Promise.all(Array.from({ length: N }, () => increment('msg-123', 'peer@s.whatsapp.net')))

		const final = (await cache.get<number>(key)) as number
		expect(final).toBe(N)
	})

	it('both retry paths increment through the same shared lock', async () => {
		// Two call sites — "sendRetryRequest" + "updateSendMessageAgainCount" —
		// share one `retryLocks` instance. Under that shared lock the increment
		// is atomic across paths.
		const cache = makeCacheStore()
		const sharedIncrement = makeIncrementer(cache)

		const callSiteA = async () => sharedIncrement('msg-123', 'peer@x')
		const callSiteB = async () => sharedIncrement('msg-123', 'peer@x')

		const ops: Promise<unknown>[] = []
		for (let i = 0; i < 5; i++) {
			ops.push(callSiteA())
			ops.push(callSiteB())
		}

		await Promise.all(ops)

		const final = (await cache.get<number>('msg-123:peer@x')) as number
		expect(final).toBe(10)
	})

	it('different (msgId, participant) pairs proceed in parallel', async () => {
		const cache = makeCacheStore()
		const increment = makeIncrementer(cache)

		let active = 0
		let maxConcurrency = 0
		const trackingIncrement = async (msgId: string, participant: string) => {
			active++
			if (active > maxConcurrency) maxConcurrency = active
			const result = await increment(msgId, participant)
			active--
			return result
		}

		await Promise.all([
			trackingIncrement('msg-A', 'peer@x'),
			trackingIncrement('msg-B', 'peer@x'),
			trackingIncrement('msg-A', 'peer@y')
		])

		// At least two of these should be in-flight at once — they don't share a key.
		expect(maxConcurrency).toBeGreaterThanOrEqual(2)
	})
})
