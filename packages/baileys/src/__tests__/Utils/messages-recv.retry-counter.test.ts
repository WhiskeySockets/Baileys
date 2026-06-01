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
 *
 * The optional `hooks` fire INSIDE the lock body so the concurrency test
 * below can observe how many incrementers are simultaneously holding work
 * inside the critical section — measuring the call wrapper from the
 * outside would always count all three callers as "in-flight" even if the
 * locks serialized them, masking a per-key-granularity regression.
 */
type IncrementHooks = {
	enterCritical?: () => void
	leaveCritical?: () => void
}

const makeIncrementer = (cache: CacheStore, hooks?: IncrementHooks) => {
	const locks = makeLockManager()
	return async (msgId: string, participant: string): Promise<number> => {
		return locks.withLock({ namespace: 'msg-retry', id: `${msgId}:${participant}` }, async () => {
			hooks?.enterCritical?.()
			try {
				const key = `${msgId}:${participant}`
				await delay(5)
				const next = ((await cache.get<number>(key)) ?? 0) + 1
				await delay(5)
				await cache.set(key, next)
				return next
			} finally {
				hooks?.leaveCritical?.()
			}
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

		// Track concurrency INSIDE the lock body so the assertion observes
		// actual per-key parallelism. The previous wrapper-based counter
		// incremented `active` synchronously for all three callers BEFORE
		// any of them entered the critical section, so `maxConcurrency`
		// would always reach 3 — even if the LockManager had been
		// regressed to a global mutex.
		let active = 0
		let maxConcurrency = 0
		const increment = makeIncrementer(cache, {
			enterCritical: () => {
				active++
				if (active > maxConcurrency) maxConcurrency = active
			},
			leaveCritical: () => {
				active--
			}
		})

		await Promise.all([increment('msg-A', 'peer@x'), increment('msg-B', 'peer@x'), increment('msg-A', 'peer@y')])

		// Three distinct keys → all three locks acquired in parallel; the
		// 10ms total work per call means at the busiest moment all three
		// should be holding their respective critical sections. Asserting
		// `=== 3` (not `>= 2`) catches any future regression that adds
		// coarser serialization across distinct keys.
		expect(maxConcurrency).toBe(3)
	})
})
