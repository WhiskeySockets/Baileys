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

	it('a get() interleaved between a failed set() and a successful retry does not return the failed value', async () => {
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
		const v2 = { public: Buffer.from([0x03]), private: Buffer.from([0x04]) }

		// Kick off the failing set without awaiting, then immediately fire a
		// get against the same record while the in-flight set is still
		// inside `flakyStore.set`'s 15ms delay. Per-record locking serializes
		// the get behind the set — by the time the get acquires the lock the
		// set has already rejected and the cache must NOT hold v1.
		const failingSet = cacheable.set({ 'pre-key': { [id]: v1 as any } })
		await delay(5) // let flakyStore.set begin its 15ms delay
		const interleavedGet = cacheable.get('pre-key', [id])

		await expect(failingSet).rejects.toThrow('first attempt failed')
		expect(await interleavedGet).toEqual({})

		// Now retry with v2. The store accepts on the second call (failNext
		// was already flipped). After it succeeds the cache must observe v2.
		await cacheable.set({ 'pre-key': { [id]: v2 as any } })
		const finalGet = await cacheable.get('pre-key', [id])
		expect(finalGet).toEqual({ [id]: v2 })
	})
})
