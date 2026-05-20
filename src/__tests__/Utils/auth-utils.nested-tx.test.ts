/**
 * H0 — Nested transactions suppress recipient locks.
 *
 * `relayMessage` opens an outer transaction keyed by `meId`, then nested
 * per-recipient `encryptMessage` opens an inner transaction keyed by `jid`.
 * Today `auth-utils.ts:307` detects the existing context and reuses it WITHOUT
 * acquiring the inner key's mutex — so the carefully constructed per-JID Signal
 * serialization is bypassed.
 *
 * Desired behavior: the inner `jid`-keyed body must serialize against any other
 * `jid`-keyed body, regardless of whether it is invoked inside an outer
 * transaction keyed by a different record.
 *
 * Failing while H0 is unresolved. Flipped to `it(...)` in Stage 2.
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

const makeInMemoryStore = (): SignalKeyStore => {
	const data: Record<string, Record<string, unknown>> = {}
	return {
		async get(type, ids) {
			const bucket = data[type] ?? {}
			const out: Record<string, any> = {}
			for (const id of ids) {
				if (id in bucket) out[id] = bucket[id]
			}

			return out
		},
		async set(d: SignalDataSet) {
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
		}
	}
}

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

describe('addTransactionCapability — nested-transaction lock suppression (H0)', () => {
	it('serializes inner jid-keyed work against parallel jid-keyed work, even inside an outer meId tx', async () => {
		const keys = addTransactionCapability(makeInMemoryStore(), silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		const meId = 'me@s.whatsapp.net'
		const jid = 'peer@s.whatsapp.net'

		let activeJidWorkers = 0
		const observedOverlap: number[] = []

		const jidWork = async (label: string) => {
			activeJidWorkers++
			if (activeJidWorkers > 1) observedOverlap.push(activeJidWorkers)
			await delay(25)
			activeJidWorkers--
			void label
		}

		// Path A: outer meId tx wraps an inner jid tx (mirrors relayMessage → encryptMessage).
		const a = keys.transaction(async () => {
			await keys.transaction(async () => {
				await jidWork('A-inner-jid')
			}, jid)
		}, meId)

		// Path B: plain jid tx (mirrors decryptMessage running in parallel).
		const b = keys.transaction(async () => {
			await jidWork('B-jid')
		}, jid)

		await Promise.all([a, b])

		// They share `jid` — they MUST serialize. Today they don't (H0).
		expect(observedOverlap).toEqual([])
	})

	it('serializes nested encrypt-style writes within an outer meId tx against external jid txs', async () => {
		const keys = addTransactionCapability(makeInMemoryStore(), silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		const meId = 'me@s.whatsapp.net'
		const jid = 'peer@s.whatsapp.net'

		const sessionWrites: Array<{ at: number; from: 'A' | 'B' }> = []
		const t0 = Date.now()

		// Simulates relayMessage's outer meId tx + per-recipient encrypt's inner jid tx
		// performing a session write. If the inner jid lock were actually acquired,
		// this write would serialize against any other jid-keyed write.
		const a = keys.transaction(async () => {
			await keys.transaction(async () => {
				await delay(10)
				await keys.set({ session: { [jid]: Buffer.from([0x01]) } })
				sessionWrites.push({ at: Date.now() - t0, from: 'A' })
			}, jid)
		}, meId)

		// External jid tx writing the same session.
		const b = keys.transaction(async () => {
			await delay(5)
			await keys.set({ session: { [jid]: Buffer.from([0x02]) } })
			sessionWrites.push({ at: Date.now() - t0, from: 'B' })
		}, jid)

		await Promise.all([a, b])

		// Both writes happened; serialization guarantee means the recorded order is
		// stable and one fully completes before the other starts. The audit's H0
		// failure mode is that the writes happen concurrently and the second one
		// silently clobbers the first under last-commit-wins.
		expect(sessionWrites).toHaveLength(2)
		// Stronger property: writes must be more than ~5ms apart (the delay inside
		// the critical section). If they overlap they'd land within 1-2ms of each
		// other.
		const [first, second] = sessionWrites.sort((x, y) => x.at - y.at)
		expect(second!.at - first!.at).toBeGreaterThanOrEqual(8)
	})
})
