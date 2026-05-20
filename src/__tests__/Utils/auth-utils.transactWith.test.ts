/**
 * Stage 2 — `transactWith` API contract.
 *
 * Pins the record-scoped transaction surface that replaces the deprecated
 * `transaction(work, key: string)` API. Captures:
 *   - explicit `records` list drives lock acquisition;
 *   - inner-scope records already held by an outer scope are NOT re-acquired
 *     (re-entry safety);
 *   - records NOT held by the outer ARE acquired (H0 closure);
 *   - mutations from nested calls share the outer's accumulator;
 *   - throws roll back the entire outer transaction (no commit);
 *   - sealed contexts reject detached-async writes (M5 hardening).
 */
import type { SignalDataSet, SignalKeyStore } from '../../Types'
import { addTransactionCapability } from '../../Utils/auth-utils'
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

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

const makeStore = () => {
	const data: Record<string, Record<string, unknown>> = {}
	const setCalls: SignalDataSet[] = []
	const store: SignalKeyStore = {
		async get(type, ids) {
			const bucket = data[type] ?? {}
			const out: Record<string, any> = {}
			for (const id of ids) {
				if (id in bucket) out[id] = bucket[id]
			}

			return out
		},
		async set(d: SignalDataSet) {
			// Shallow snapshot so later mutations to the live object don't bleed in.
			const snapshot: SignalDataSet = {}
			for (const type in d) {
				const incoming = (d as any)[type] as Record<string, unknown>
				const bucket: Record<string, unknown> = {}
				for (const id in incoming) bucket[id] = incoming[id]
				;(snapshot as any)[type] = bucket
			}

			setCalls.push(snapshot)
			for (const type in d) {
				data[type] = data[type] ?? {}
				const incoming = (d as any)[type] as Record<string, unknown>
				for (const id in incoming) {
					const v = incoming[id]
					if (v === null) delete data[type][id]
					else data[type][id] = v
				}
			}
		}
	}
	return { store, data, setCalls }
}

describe('addTransactionCapability — transactWith', () => {
	it('acquires record locks before invoking work', async () => {
		const { store } = makeStore()
		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		let active = 0
		let overlap = false
		const work = async () => {
			active++
			if (active > 1) overlap = true
			await delay(15)
			active--
		}

		await Promise.all([
			keys.transactWith({ records: [{ type: 'session', id: 'peer' }] }, work),
			keys.transactWith({ records: [{ type: 'session', id: 'peer' }] }, work),
			keys.transactWith({ records: [{ type: 'session', id: 'peer' }] }, work)
		])

		expect(overlap).toBe(false)
	})

	it('different records proceed in parallel', async () => {
		const { store } = makeStore()
		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		let maxConcurrency = 0
		let active = 0
		const work = async () => {
			active++
			if (active > maxConcurrency) maxConcurrency = active
			await delay(15)
			active--
		}

		await Promise.all([
			keys.transactWith({ records: [{ type: 'session', id: 'a' }] }, work),
			keys.transactWith({ records: [{ type: 'session', id: 'b' }] }, work),
			keys.transactWith({ records: [{ type: 'session', id: 'c' }] }, work)
		])

		expect(maxConcurrency).toBeGreaterThanOrEqual(2)
	})

	it('commits mutations to the underlying store in a single state.set call on success', async () => {
		const { store, setCalls } = makeStore()
		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		await keys.transactWith({ records: [{ type: 'session', id: 'a' }] }, async () => {
			await keys.set({ session: { a: Buffer.from([1]) as any } })
			await keys.set({ session: { a: Buffer.from([2]) as any } })
		})

		expect(setCalls).toHaveLength(1)
		expect(Buffer.from((setCalls[0] as any).session.a)).toEqual(Buffer.from([2]))
	})

	it('does not commit on throw — mutations are rolled back', async () => {
		const { store, setCalls } = makeStore()
		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		await expect(
			keys.transactWith({ records: [{ type: 'session', id: 'a' }] }, async () => {
				await keys.set({ session: { a: Buffer.from([1]) as any } })
				throw new Error('boom')
			})
		).rejects.toThrow('boom')

		expect(setCalls).toHaveLength(0)
	})

	describe('nested scope', () => {
		it('bypasses lock re-acquisition when the inner record is already held by the outer scope', async () => {
			const { store } = makeStore()
			const keys = addTransactionCapability(store, silentLogger(), {
				maxCommitRetries: 1,
				delayBetweenTriesMs: 1
			})

			let nestedRan = false
			await keys.transactWith({ records: [{ type: 'session', id: 'a' }] }, async () => {
				// If transactWith tried to re-acquire `session:a`, this would deadlock.
				await keys.transactWith({ records: [{ type: 'session', id: 'a' }] }, async () => {
					nestedRan = true
				})
			})

			expect(nestedRan).toBe(true)
		})

		it('acquires inner records that are NOT held by the outer scope (H0 closure)', async () => {
			const { store } = makeStore()
			const keys = addTransactionCapability(store, silentLogger(), {
				maxCommitRetries: 1,
				delayBetweenTriesMs: 1
			})

			let activeOnB = 0
			let overlap = false

			const path1 = keys.transactWith({ records: [{ type: 'session', id: 'a' }] }, async () => {
				await keys.transactWith({ records: [{ type: 'session', id: 'b' }] }, async () => {
					activeOnB++
					if (activeOnB > 1) overlap = true
					await delay(15)
					activeOnB--
				})
			})

			const path2 = keys.transactWith({ records: [{ type: 'session', id: 'b' }] }, async () => {
				activeOnB++
				if (activeOnB > 1) overlap = true
				await delay(15)
				activeOnB--
			})

			await Promise.all([path1, path2])

			expect(overlap).toBe(false)
		})

		it('mutations from nested writes commit in the outermost transaction', async () => {
			const { store, setCalls } = makeStore()
			const keys = addTransactionCapability(store, silentLogger(), {
				maxCommitRetries: 1,
				delayBetweenTriesMs: 1
			})

			await keys.transactWith(
				{
					records: [
						{ type: 'session', id: 'a' },
						{ type: 'session', id: 'b' }
					]
				},
				async () => {
					await keys.transactWith({ records: [{ type: 'session', id: 'a' }] }, async () => {
						await keys.set({ session: { a: Buffer.from([1]) as any } })
					})
					await keys.transactWith({ records: [{ type: 'session', id: 'b' }] }, async () => {
						await keys.set({ session: { b: Buffer.from([2]) as any } })
					})
				}
			)

			// One commit, covering both nested writes.
			expect(setCalls).toHaveLength(1)
			expect(Buffer.from((setCalls[0] as any).session.a)).toEqual(Buffer.from([1]))
			expect(Buffer.from((setCalls[0] as any).session.b)).toEqual(Buffer.from([2]))
		})
	})

	describe('M5 detached-async hardening', () => {
		it('drops writes from detached async after the transaction has sealed', async () => {
			const { store, setCalls } = makeStore()
			const keys = addTransactionCapability(store, silentLogger(), {
				maxCommitRetries: 1,
				delayBetweenTriesMs: 1
			})

			let detachedCompleted: ((v: void) => void) | null = null
			const detached = new Promise<void>(resolve => {
				detachedCompleted = resolve
			})

			await keys.transactWith({ records: [{ type: 'session', id: 'a' }] }, async () => {
				// Intentional anti-pattern: schedule async work without awaiting it.
				// After the outer work() resolves, the ALS context is sealed; this
				// detached write must NOT mutate already-committed state.
				void (async () => {
					await delay(20)
					await keys.set({ session: { a: Buffer.from([0xff]) as any } })
					detachedCompleted!()
				})()

				await keys.set({ session: { a: Buffer.from([0x01]) as any } })
			})

			await detached

			expect(setCalls).toHaveLength(1)
			expect(Buffer.from((setCalls[0] as any).session.a)).toEqual(Buffer.from([0x01]))
		})
	})

	describe('interop with deprecated `transaction(work, key)` API', () => {
		it('a legacy outer transaction does not bypass the inner transactWith record lock', async () => {
			const { store } = makeStore()
			const keys = addTransactionCapability(store, silentLogger(), {
				maxCommitRetries: 1,
				delayBetweenTriesMs: 1
			})

			let active = 0
			let overlap = false

			const path1 = keys.transaction(async () => {
				await keys.transactWith({ records: [{ type: 'session', id: 'shared' }] }, async () => {
					active++
					if (active > 1) overlap = true
					await delay(15)
					active--
				})
			}, 'legacy-outer')

			const path2 = keys.transactWith({ records: [{ type: 'session', id: 'shared' }] }, async () => {
				active++
				if (active > 1) overlap = true
				await delay(15)
				active--
			})

			await Promise.all([path1, path2])

			expect(overlap).toBe(false)
		})
	})
})
