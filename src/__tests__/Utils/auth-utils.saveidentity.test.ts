/**
 * H3 / H5 — `saveIdentity` is non-atomic across types.
 *
 * `signalStorage.saveIdentity` calls
 *   `keys.set({ session: { [jid]: null }, 'identity-key': { [jid]: identityKey } })`
 * expecting both writes to land atomically. The non-transactional `set` path
 * in `auth-utils.ts:269` does `Promise.all` over per-TYPE queues, issuing
 * SEPARATE `state.set(...)` calls per type. A concurrent reader can therefore
 * observe a deleted session paired with an OLD identity key.
 *
 * Desired behavior: a single `set` call observing N record types either
 * commits every type in one underlying `state.set(...)` invocation or fails
 * the whole call. The underlying adapter is contractually atomic across types.
 *
 * Failing while H3/H5 are unresolved. Flipped to `it(...)` in Stage 4.
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

describe('SignalKeyStore.set — cross-type atomicity (H3 / H5)', () => {
	it('a multi-type set() issues exactly one underlying store.set call covering every type', async () => {
		const calls: SignalDataSet[] = []
		const store: SignalKeyStore = {
			async get() {
				return {}
			},
			async set(d) {
				calls.push(JSON.parse(JSON.stringify(d, (_, v) => (Buffer.isBuffer(v) ? Array.from(v) : v))))
			}
		}
		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		const jid = 'peer@s.whatsapp.net'
		await keys.set({
			session: { [jid]: Buffer.from([0x11]) as any },
			'identity-key': { [jid]: Buffer.from([0x22]) as any }
		})

		// Atomic contract: ONE store.set call covering both types.
		expect(calls).toHaveLength(1)
		expect(calls[0]).toHaveProperty('session')
		expect(calls[0]).toHaveProperty('identity-key')
	})

	it.todo(
		'a concurrent reader never observes session=null with the old identity-key — covered structurally by the single-call atomicity assertion above; Stage 4 + Stage 5 add an integration-level torn-read test against the real SQLite adapter where timing is deterministic'
	)
})
