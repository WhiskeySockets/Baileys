/**
 * H4 — `deleteSession` / `migrateSession` previously used synthetic
 * transaction keys (`delete-${count}-sessions`, `migrate-${count}-...`) that
 * did NOT overlap with the per-JID `transaction(work, jid)` keyspace. CLOSED
 * in Stage 2 by migrating libsignal.ts to `transactWith({records:[{type:'session', id:addr}, ...]})`.
 *
 * These tests pin the new contract at the auth-utils layer: any `transactWith`
 * that names a session record serializes against any other `transactWith` on
 * the same record — no matter what the "outer naming" was.
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

describe('libsignal — bulk session delete/migrate vs per-JID encrypt (H4)', () => {
	it('deleteSession (transactWith on session records) serializes against an in-flight encrypt for the same address', async () => {
		const keys = addTransactionCapability(makeStore(), silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		const addr = '12025550100.0'

		let encryptActive = false
		let deleteSawEncryptActive = false

		// Encrypt-shaped tx: scope = the per-recipient session record.
		const encrypt = keys.transactWith({ records: [{ type: 'session', id: addr }] }, async () => {
			encryptActive = true
			await delay(30)
			encryptActive = false
		})

		// Delete-shaped tx: scope = the same session record (Stage 2 fix —
		// previously a synthetic `delete-N-sessions` string key that didn't
		// share lockspace with encrypt).
		const deleteAll = (async () => {
			await delay(5)
			await keys.transactWith({ records: [{ type: 'session', id: addr }] }, async () => {
				if (encryptActive) deleteSawEncryptActive = true
				await keys.set({ session: { [addr]: null } })
			})
		})()

		await Promise.all([encrypt, deleteAll])

		expect(deleteSawEncryptActive).toBe(false)
	})

	it('migrateSession (transactWith over the affected session records) serializes against in-flight encrypts on any of them', async () => {
		const keys = addTransactionCapability(makeStore(), silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		const pnAddr = '12025550100.0'
		const lidAddr = '12025550100_1.0'

		let encryptForPnActive = false
		let migrationSawEncrypt = false

		const encrypt = keys.transactWith({ records: [{ type: 'session', id: pnAddr }] }, async () => {
			encryptForPnActive = true
			await delay(30)
			encryptForPnActive = false
		})

		const migrate = (async () => {
			await delay(5)
			await keys.transactWith(
				{
					records: [
						{ type: 'session', id: pnAddr },
						{ type: 'session', id: lidAddr }
					]
				},
				async () => {
					if (encryptForPnActive) migrationSawEncrypt = true
					await keys.set({
						session: { [pnAddr]: null, [lidAddr]: new Uint8Array([0x01]) }
					})
				}
			)
		})()

		await Promise.all([encrypt, migrate])

		expect(migrationSawEncrypt).toBe(false)
	})
})
