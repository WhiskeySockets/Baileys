/**
 * Stage 1 — LockManager primitive.
 *
 * Pins the canonical locking surface used by the auth/transaction layer:
 *   - withLock serializes work on the same ref;
 *   - distinct refs run in parallel (per-record granularity);
 *   - withLocks acquires multiple refs in deterministic sorted order, so two
 *     callers asking for overlapping sets never deadlock against each other;
 *   - duplicate refs in a withLocks call are coalesced (acquired once);
 *   - throws inside work do not leak lock state.
 */
import { makeLockManager } from '../../Utils/lock-manager'

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

describe('makeLockManager', () => {
	it('serializes work on the same ref', async () => {
		const locks = makeLockManager()
		let active = 0
		let observedOverlap = false

		const work = async () => {
			active++
			if (active > 1) observedOverlap = true
			await delay(15)
			active--
		}

		const ref = { namespace: 'session', id: 'peer@s.whatsapp.net' }
		await Promise.all([locks.withLock(ref, work), locks.withLock(ref, work), locks.withLock(ref, work)])

		expect(observedOverlap).toBe(false)
	})

	it('runs distinct refs in parallel', async () => {
		const locks = makeLockManager()
		let maxConcurrency = 0
		let active = 0

		const work = async () => {
			active++
			if (active > maxConcurrency) maxConcurrency = active
			await delay(15)
			active--
		}

		await Promise.all([
			locks.withLock({ namespace: 'session', id: 'a' }, work),
			locks.withLock({ namespace: 'session', id: 'b' }, work),
			locks.withLock({ namespace: 'session', id: 'c' }, work)
		])

		expect(maxConcurrency).toBeGreaterThanOrEqual(2)
	})

	it('returns the inner work value through withLock', async () => {
		const locks = makeLockManager()
		const result = await locks.withLock({ namespace: 'session', id: 'a' }, async () => 42)
		expect(result).toBe(42)
	})

	it('propagates throws without leaking lock state', async () => {
		const locks = makeLockManager()
		const ref = { namespace: 'session', id: 'peer' }

		await expect(
			locks.withLock(ref, async () => {
				throw new Error('boom')
			})
		).rejects.toThrow('boom')

		// Subsequent acquisition on the same ref must succeed promptly — no leak.
		const start = Date.now()
		await locks.withLock(ref, async () => {})
		expect(Date.now() - start).toBeLessThan(50)
		expect(locks.isLocked(ref)).toBe(false)
	})

	it('cleans up entries after release so the internal map does not grow unboundedly', async () => {
		const locks = makeLockManager()

		for (let i = 0; i < 100; i++) {
			await locks.withLock({ namespace: 'session', id: `peer-${i}` }, async () => {})
		}

		// Probe a fresh ref — should not be reported as locked.
		expect(locks.isLocked({ namespace: 'session', id: 'peer-0' })).toBe(false)
	})

	describe('withLocks', () => {
		it('serializes work that shares any ref, regardless of order', async () => {
			const locks = makeLockManager()
			let active = 0
			let overlap = false

			const work = async () => {
				active++
				if (active > 1) overlap = true
				await delay(15)
				active--
			}

			await Promise.all([
				locks.withLocks(
					[
						{ namespace: 'session', id: 'a' },
						{ namespace: 'session', id: 'b' }
					],
					work
				),
				locks.withLocks(
					[
						{ namespace: 'session', id: 'b' },
						{ namespace: 'session', id: 'a' }
					],
					work
				)
			])

			// They share both records — must serialize.
			expect(overlap).toBe(false)
		})

		it('does not deadlock on partially-overlapping ref sets acquired in opposite orders', async () => {
			// The classic A-then-B vs B-then-A deadlock. The sort step prevents it.
			const locks = makeLockManager()
			const refs1 = [
				{ namespace: 'session', id: 'a' },
				{ namespace: 'session', id: 'b' }
			]
			const refs2 = [
				{ namespace: 'session', id: 'b' },
				{ namespace: 'session', id: 'a' }
			]

			const completed = await Promise.race([
				Promise.all([
					locks.withLocks(refs1, async () => {
						await delay(20)
						return 'first'
					}),
					locks.withLocks(refs2, async () => {
						await delay(20)
						return 'second'
					})
				]),
				delay(2000).then(() => 'deadlock')
			])

			expect(completed).not.toBe('deadlock')
			expect(completed).toEqual(['first', 'second'])
		})

		it('coalesces duplicate refs (acquires each underlying lock once)', async () => {
			const locks = makeLockManager()
			const ref = { namespace: 'session', id: 'a' }

			// If duplicates weren't coalesced, the second `withSingleLock` call on
			// the same key inside the recursive acquire would deadlock against the
			// outer one. We assert it completes promptly.
			const start = Date.now()
			await locks.withLocks([ref, ref, ref], async () => {
				await delay(5)
			})
			expect(Date.now() - start).toBeLessThan(200)
		})

		it('allows non-overlapping multi-acquires to proceed in parallel', async () => {
			const locks = makeLockManager()
			let maxConcurrency = 0
			let active = 0

			const work = async () => {
				active++
				if (active > maxConcurrency) maxConcurrency = active
				await delay(15)
				active--
			}

			await Promise.all([
				locks.withLocks(
					[
						{ namespace: 'session', id: 'a' },
						{ namespace: 'session', id: 'b' }
					],
					work
				),
				locks.withLocks(
					[
						{ namespace: 'session', id: 'c' },
						{ namespace: 'session', id: 'd' }
					],
					work
				)
			])

			expect(maxConcurrency).toBeGreaterThanOrEqual(2)
		})

		it('runs work immediately for an empty ref list', async () => {
			const locks = makeLockManager()
			const result = await locks.withLocks([], async () => 'no-locks')
			expect(result).toBe('no-locks')
		})

		it('distinguishes refs by namespace, not just id', async () => {
			const locks = makeLockManager()
			let maxConcurrency = 0
			let active = 0

			const work = async () => {
				active++
				if (active > maxConcurrency) maxConcurrency = active
				await delay(15)
				active--
			}

			await Promise.all([
				locks.withLock({ namespace: 'session', id: 'a' }, work),
				locks.withLock({ namespace: 'identity-key', id: 'a' }, work)
			])

			expect(maxConcurrency).toBeGreaterThanOrEqual(2)
		})
	})
})
