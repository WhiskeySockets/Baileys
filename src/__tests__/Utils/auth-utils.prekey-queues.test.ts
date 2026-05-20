/**
 * H2 — Dual uncoordinated `pre-key` queues. CLOSED in Stage 1.
 *
 * Before Stage 1: validation routed through `PreKeyManager.queues`, the
 * durable write routed through `auth-utils.keyQueues`. Two independent
 * `Map<string, PQueue>` instances, no cross-coordination — a deletion
 * validated against a stale store snapshot could be silently dropped while
 * another in-flight write was about to overwrite the same id.
 *
 * Stage 1 collapsed both onto a single {@link LockManager}. Now the entire
 * validate-then-write sequence for a non-transactional `set()` runs under one
 * lock per `(namespace, id)`. These tests pin the merged-lock contract.
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

/**
 * Tracking store: records the strict order of get/set operations with
 * artificial delays so race windows are wide enough to be deterministic.
 */
const makeTrackingStore = (events: string[]) => {
	const data: Record<string, Record<string, unknown>> = {}
	const store: SignalKeyStore = {
		async get(type, ids) {
			events.push(`get-start:${type}:${ids.join(',')}`)
			await delay(15)
			const bucket = data[type] ?? {}
			const out: Record<string, any> = {}
			for (const id of ids) {
				if (id in bucket) out[id] = bucket[id]
			}

			events.push(`get-end:${type}:${ids.join(',')}`)
			return out
		},
		async set(d: SignalDataSet) {
			const summary = Object.entries(d)
				.map(([type, bucket]) => `${type}:${Object.keys(bucket as object).join(',')}`)
				.join('|')
			events.push(`set-start:${summary}`)
			await delay(15)
			for (const type in d) {
				data[type] = data[type] ?? {}
				const bucket = data[type]
				const incoming = (d as any)[type] as Record<string, unknown>
				for (const id in incoming) {
					const v = incoming[id]
					if (v === null) delete bucket[id]
					else bucket[id] = v
				}
			}

			events.push(`set-end:${summary}`)
		}
	}
	return { store, data }
}

describe('addTransactionCapability — pre-key validation vs write coordination (H2)', () => {
	it('validation read and durable write for one set() call run under a single critical section', async () => {
		const events: string[] = []
		const { store } = makeTrackingStore(events)
		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		// Seed: id "5" exists.
		await store.set({ 'pre-key': { '5': { public: Buffer.from([1]), private: Buffer.from([2]) } as any } })
		events.length = 0

		await keys.set({ 'pre-key': { '5': null } })

		const getStart = events.indexOf('get-start:pre-key:5')
		const getEnd = events.indexOf('get-end:pre-key:5')
		const setStart = events.findIndex(e => e.startsWith('set-start:pre-key:5'))
		const setEnd = events.findIndex(e => e.startsWith('set-end:pre-key:5'))

		expect(getStart).toBeGreaterThanOrEqual(0)
		expect(setStart).toBeGreaterThan(getEnd)
		expect(setEnd).toBeGreaterThan(setStart)
	})

	it('concurrent set() calls on the same pre-key id linearize their validate+write phases', async () => {
		const events: string[] = []
		const { store } = makeTrackingStore(events)
		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		// Seed: id "7" exists, so the deleter's validation has something to find.
		await store.set({
			'pre-key': { '7': { public: Buffer.from([1]), private: Buffer.from([2]) } as any }
		})
		events.length = 0

		const deleter = keys.set({ 'pre-key': { '7': null } })
		const creator = keys.set({
			'pre-key': { '7': { public: Buffer.from([9]), private: Buffer.from([8]) } as any }
		})

		await Promise.all([deleter, creator])

		// At most one set-start can be open at any given index — i.e. between
		// every set-start and the matching set-end, no other set-start fires.
		const setStartIdx = events
			.map((e, i) => ({ e, i }))
			.filter(({ e }) => e.startsWith('set-start:pre-key:7'))
			.map(({ i }) => i)
		const setEndIdx = events
			.map((e, i) => ({ e, i }))
			.filter(({ e }) => e.startsWith('set-end:pre-key:7'))
			.map(({ i }) => i)

		expect(setStartIdx).toHaveLength(2)
		expect(setEndIdx).toHaveLength(2)

		const sortedStarts = [...setStartIdx].sort((a, b) => a - b)
		const sortedEnds = [...setEndIdx].sort((a, b) => a - b)

		// First call's set-end precedes the second call's set-start.
		expect(sortedEnds[0]).toBeLessThan(sortedStarts[1]!)
	})

	it('a deleter validating against the store sees the same state the writer will observe', async () => {
		// The audited race: validator reads "id missing", drops deletion; a
		// concurrent writer was about to commit a new value. With the lock now
		// spanning validate+write, the validator's read never overlaps another
		// writer's commit on the same record.
		const events: string[] = []
		const { store } = makeTrackingStore(events)
		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		// Initial: id "9" does not exist.
		events.length = 0

		const creator = keys.set({
			'pre-key': { '9': { public: Buffer.from([1]), private: Buffer.from([2]) } as any }
		})
		const deleter = keys.set({ 'pre-key': { '9': null } })

		await Promise.all([creator, deleter])

		// If the deleter ran first (no validation get because keyData says
		// delete=null, but we always issue the get): saw no key, dropped delete,
		// then creator wrote and final state has the key.
		// If the deleter ran second (after creator's set-end): saw the key, ran
		// the deletion, final state has no key.
		// Either is acceptable; the assertion is that the deleter's read never
		// straddles the creator's write.
		const deleterGetStart = events.indexOf('get-start:pre-key:9')
		const deleterGetEnd = events.indexOf('get-end:pre-key:9')

		if (deleterGetStart >= 0) {
			const creatorWriteEvents = events
				.map((e, i) => ({ e, i }))
				.filter(({ e }) => e.startsWith('set-start:pre-key:9') || e.startsWith('set-end:pre-key:9'))
				.map(({ i }) => i)

			// No write event lies between the deleter's get-start and get-end —
			// the read snapshot is stable for the duration of validation.
			const straddling = creatorWriteEvents.filter(i => i > deleterGetStart && i < deleterGetEnd)
			expect(straddling).toEqual([])
		}
	})
})
