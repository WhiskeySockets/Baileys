/**
 * H10 — Decrypt path has no per-JID serialization at the receive layer.
 *
 * The send path acquires `encryptionMutex` keyed per-JID. The receive path
 * relies entirely on `parsedKeys.transaction(..., jid)` inside libsignal.ts
 * (line 149) — which is exactly the lock H0 punctures when an outer
 * meId-keyed transaction is already active. So in practice: an outbound
 * `relayMessage` holding the meId transaction concurrent with an inbound
 * decrypt for the same JID will both touch the ratchet without
 * serialization.
 *
 * Desired behavior: under the H0+H10 fix, even when one decrypt-shaped
 * critical section is invoked inside an outer meId tx (as `encryptMessage` is
 * by `relayMessage`), it serializes against any other per-JID critical
 * section for the same recipient.
 *
 * Failing while H10 is unresolved. Flipped to `it(...)` in Stage 3.
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

const makeStore = (): SignalKeyStore => {
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
				const incoming = (d as any)[type] as Record<string, unknown>
				for (const id in incoming) {
					const v = incoming[id]
					if (v === null) delete data[type][id]
					else data[type][id] = v
				}
			}
		}
	}
}

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

describe('messages-recv — per-JID ratchet serialization vs concurrent send (H10)', () => {
	it('decrypt for jid serializes against an encrypt for the same jid wrapped in an outer meId tx', async () => {
		const store = makeStore()
		// Seed: a "session" with an integer counter standing in for ratchet chain index.
		await store.set({ session: { 'peer@s.whatsapp.net': Buffer.from([0]) } })

		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		const meId = 'me@s.whatsapp.net'
		const jid = 'peer@s.whatsapp.net'

		let activeOps = 0
		let overlapped = false

		const ratchetCriticalSection = (label: string) =>
			keys.transaction(async () => {
				activeOps++
				if (activeOps > 1) overlapped = true
				const { [jid]: sess } = await keys.get('session', [jid])
				const counter = Buffer.isBuffer(sess) ? (sess[0] ?? 0) : 0
				await delay(20)
				await keys.set({ session: { [jid]: Buffer.from([counter + 1]) } })
				activeOps--
				void label
			}, jid)

		// Send side: encrypt is invoked by relayMessage inside an outer meId tx.
		const sendSide = keys.transaction(async () => {
			await ratchetCriticalSection('encrypt-from-relay')
		}, meId)

		// Receive side: decrypt is invoked at the receive layer keyed by jid.
		const receiveSide = ratchetCriticalSection('decrypt')

		await Promise.all([sendSide, receiveSide])

		expect(overlapped).toBe(false)

		const { [jid]: finalSession } = await store.get('session', [jid])
		const finalCounter = Buffer.isBuffer(finalSession) ? finalSession[0] : 0
		// Both critical sections advanced the ratchet once; with proper
		// serialization the counter is 2.
		expect(finalCounter).toBe(2)
	})

	it('two parallel decrypts at the receive layer serialize even when one is nested in an outer meId tx', async () => {
		const store = makeStore()
		await store.set({ session: { 'peer@s.whatsapp.net': Buffer.from([0]) } })

		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		const meId = 'me@s.whatsapp.net'
		const jid = 'peer@s.whatsapp.net'

		const ratchetAdvance = () =>
			keys.transaction(async () => {
				const { [jid]: sess } = await keys.get('session', [jid])
				const counter = Buffer.isBuffer(sess) ? (sess[0] ?? 0) : 0
				await delay(10)
				await keys.set({ session: { [jid]: Buffer.from([counter + 1]) } })
			}, jid)

		const N = 8
		const ops: Promise<unknown>[] = []
		for (let i = 0; i < N; i++) {
			// Half of them go through an outer meId tx (mimicking the relayMessage path).
			if (i % 2 === 0) {
				ops.push(keys.transaction(async () => ratchetAdvance(), meId))
			} else {
				ops.push(ratchetAdvance())
			}
		}

		await Promise.all(ops)

		const { [jid]: finalSession } = await store.get('session', [jid])
		const finalCounter = Buffer.isBuffer(finalSession) ? finalSession[0] : 0
		expect(finalCounter).toBe(N)
	})
})
