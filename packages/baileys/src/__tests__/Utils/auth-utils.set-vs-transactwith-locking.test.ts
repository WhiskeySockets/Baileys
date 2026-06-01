/**
 * Regression: non-transactional `keys.set(...)` and `keys.transactWith(...)`
 * must share locks on the SAME record, not on disjoint namespaces.
 *
 * Pre-fix, the non-tx set path acquired `{ namespace: '__type__', id: type }`
 * while transactWith acquired `{ namespace: type, id }`. Different keys → no
 * mutual exclusion → a non-tx `keys.set({ session: { jid: BUF_A } })` could
 * interleave with a `transactWith({ records: [{ type: 'session', id: jid }] })`
 * that was mid-flight and reading/writing the same record. Direct session
 * deletes in the recv path (Stage 3's H8 + Stage 6's H9 fixes route through
 * non-tx set) made this reachable.
 *
 * Post-fix both paths use `{ namespace: type, id }` and the LockManager
 * serializes them.
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
 * Tracking store that records the ORDER of `set` calls so the test can
 * verify whether two operations on the same record overlapped.
 */
function makeTrackingStore() {
	const setEvents: Array<{ phase: 'start' | 'end'; tag: string }> = []
	const persisted: Record<string, Record<string, unknown>> = {}

	const store: SignalKeyStore = {
		async get(type, ids) {
			const bucket = persisted[type] ?? {}
			const out: Record<string, any> = {}
			for (const id of ids) {
				if (id in bucket) out[id] = bucket[id]
			}

			return out
		},
		async set(data: SignalDataSet) {
			// Identify the set call by the first (type, id) it touches.
			const firstType = Object.keys(data)[0]
			const firstId = firstType ? Object.keys((data as any)[firstType] ?? {})[0] : '?'
			const tag = `${firstType}:${firstId}`

			setEvents.push({ phase: 'start', tag })
			await delay(15)

			for (const type in data) {
				persisted[type] = persisted[type] ?? {}
				const incoming = (data as any)[type] as Record<string, unknown>
				for (const id in incoming) {
					persisted[type][id] = incoming[id]
				}
			}

			setEvents.push({ phase: 'end', tag })
		}
	}

	return { store, setEvents }
}

describe('non-tx set ↔ transactWith mutual exclusion on the same record', () => {
	it('serializes a non-tx set against an in-flight transactWith on the same (type, id)', async () => {
		const { store, setEvents } = makeTrackingStore()
		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		const jid = 'peer.0'

		// transactWith: work resolves quickly so the commit's `store.set`
		// (the slow 15ms delay in the tracking store) starts almost
		// immediately and stays in flight while the non-tx set races for
		// the lock. Whether the two `state.set` calls OVERLAP is what
		// distinguishes the pre-fix `__type__:session` shape (overlap) from
		// the post-fix `session:jid` shape (serial).
		const tx = keys.transactWith({ records: [{ type: 'session', id: jid }] }, async () => {
			// Inside work: queue the write into the in-tx mutations.
			await keys.set({ session: { [jid]: Buffer.from([0x01]) as any } })
		})

		// Tiny head start so the transactWith has time to acquire its lock
		// and enter `commitWithRetry`'s `state.set` (which holds the lock).
		await delay(2)

		// Non-tx set on the SAME record. Pre-fix this would acquire a
		// disjoint `__type__:session` lock and call `state.set` immediately,
		// producing an overlap. Post-fix it must queue behind the
		// transactWith's `session:jid` lock.
		const nonTx = keys.set({ session: { [jid]: Buffer.from([0x02]) as any } })

		await Promise.all([tx, nonTx])

		// Two `store.set` calls landed (one from the transactWith commit,
		// one from the non-tx path). Strictly serialized order — the
		// second `start` must come AFTER the first `end`.
		const sessionEvents = setEvents.filter(e => e.tag === `session:${jid}`)
		expect(sessionEvents).toHaveLength(4)
		expect(sessionEvents.map(e => e.phase)).toEqual(['start', 'end', 'start', 'end'])
	})

	it('allows a non-tx set on a DIFFERENT record to proceed in parallel with transactWith', async () => {
		const { store, setEvents } = makeTrackingStore()
		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		// transactWith on session:a; non-tx set on session:b. Distinct
		// records, so they should NOT serialize against each other.
		const tx = keys.transactWith({ records: [{ type: 'session', id: 'a' }] }, async () => {
			await delay(30)
			await keys.set({ session: { a: Buffer.from([0x01]) as any } })
		})

		await delay(5)

		const nonTx = keys.set({ session: { b: Buffer.from([0x02]) as any } })

		await Promise.all([tx, nonTx])

		// `b`'s set should have completed BEFORE `a`'s (which sleeps for
		// 30ms inside the transactWith before committing). Demonstrates
		// per-record granularity, not per-type coarseness.
		const indexBStart = setEvents.findIndex(e => e.tag === 'session:b' && e.phase === 'start')
		const indexBEnd = setEvents.findIndex(e => e.tag === 'session:b' && e.phase === 'end')
		const indexAEnd = setEvents.findIndex(e => e.tag === 'session:a' && e.phase === 'end')

		expect(indexBStart).toBeGreaterThanOrEqual(0)
		expect(indexBEnd).toBeGreaterThan(indexBStart)
		expect(indexBEnd).toBeLessThan(indexAEnd)
	})
})
