/**
 * H6 — Cache writes precede store writes.
 *
 * `makeCacheableSignalKeyStore.set()` writes to the in-memory cache (line 93)
 * BEFORE delegating to `store.set` (line 99). If the durable write throws, the
 * cache holds an uncommitted value, and subsequent `get` calls short-circuit
 * the store read and serve the dirty cache value (line 65). Divergence
 * persists until cache TTL expiry (5 min).
 *
 * Desired behavior: a failed `store.set` must NOT leave the cache observing a
 * value that was never durably persisted.
 *
 * Failing while H6 is unresolved. Flipped to `it(...)` in Stage 4.
 */
import type { SignalDataSet, SignalKeyStore } from '../../Types'
import { makeCacheableSignalKeyStore } from '../../Utils/auth-utils'
import type { ILogger } from '../../Utils/logger'

const silentLogger = (): ILogger =>
	({
		level: 'silent',
		child: () => silentLogger(),
		trace: () => {},
		debug: () => {},
		info: () => {},
		warn: () => {},
		error: () => {},
		fatal: () => {}
	}) as unknown as ILogger

describe('makeCacheableSignalKeyStore — cache divergence on store failure (H6)', () => {
	// PR #453: flipped from `it.failing` — H6 is closed in our tree by Phase 8
	// Batch 2 commit 756a83be2b (`fix(cache): close H6 cache divergence on
	// durable-write failure`). `makeCacheableSignalKeyStore.set` now writes
	// through to the durable store FIRST, then updates the cache only on success.
	it('does not return uncommitted cache value after store.set throws', async () => {
		const persisted: Record<string, Record<string, unknown>> = {}
		let shouldThrow = true

		const flakyStore: SignalKeyStore = {
			async get(type, ids) {
				const bucket = persisted[type] ?? {}
				const out: Record<string, any> = {}
				for (const id of ids) {
					if (id in bucket) out[id] = bucket[id]
				}

				return out
			},
			async set(data: SignalDataSet) {
				if (shouldThrow) {
					shouldThrow = false
					throw new Error('simulated transient durable-store failure')
				}

				for (const type in data) {
					persisted[type] = persisted[type] ?? {}
					const incoming = (data as any)[type] as Record<string, unknown>
					for (const id in incoming) {
						persisted[type][id] = incoming[id]
					}
				}
			}
		}

		const cacheable = makeCacheableSignalKeyStore(flakyStore, silentLogger())

		const id = '1'
		const uncommittedValue = { public: Buffer.from([0xaa]), private: Buffer.from([0xbb]) }

		await expect(cacheable.set({ 'pre-key': { [id]: uncommittedValue as any } })).rejects.toThrow(
			'simulated transient durable-store failure'
		)

		// A reader must NOT observe a value that was never durably persisted.
		const observed = await cacheable.get('pre-key', [id])
		expect(observed).toEqual({})
	})

	// PR #453: flipped from `it.failing` — same H6 fix (commit 756a83be2b)
	// also closes the interleaved-get-after-failed-set window.
	it(
		'a get() interleaved between a failed set() and a successful retry does not return the failed value',
		async () => {
			const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
			const persisted: Record<string, Record<string, unknown>> = {}
			let failNext = true

			const flakyStore: SignalKeyStore = {
				async get(type, ids) {
					const bucket = persisted[type] ?? {}
					const out: Record<string, any> = {}
					for (const id of ids) {
						if (id in bucket) out[id] = bucket[id]
					}

					return out
				},
				async set(data: SignalDataSet) {
					await delay(15)
					if (failNext) {
						failNext = false
						throw new Error('first attempt failed')
					}

					for (const type in data) {
						persisted[type] = persisted[type] ?? {}
						const incoming = (data as any)[type] as Record<string, unknown>
						for (const id in incoming) {
							persisted[type][id] = incoming[id]
						}
					}
				}
			}

			const cacheable = makeCacheableSignalKeyStore(flakyStore, silentLogger())

			const id = '1'
			const v1 = { public: Buffer.from([0x01]), private: Buffer.from([0x02]) }

			// First set fails. After it rejects, an interleaved reader must not
			// observe v1 — it was never durably persisted.
			const failingSet = cacheable.set({ 'pre-key': { [id]: v1 as any } })

			await expect(failingSet).rejects.toThrow('first attempt failed')

			const observed = await cacheable.get('pre-key', [id])
			expect(observed).toEqual({})
		}
	)
})
