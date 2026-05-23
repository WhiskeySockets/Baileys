/**
 * H8 — Receive-path LID migration runs outside `messageMutex`.
 *
 * The pre-mutex block in `messages-recv.ts:1604-1620` does
 *   `getPNForLID → storeLIDPNMappings → migrateSession`
 * before acquiring `messageMutex`. Two concurrent inbound messages from the
 * same alt-JID participant both observe a null mapping, both call
 * `storeLIDPNMappings`, both call `migrateSession` — and the migration race
 * compounds with H4's synthetic-key problem.
 *
 * Desired behavior: for a given alt-JID participant, the lookup-store-migrate
 * sequence runs at most once concurrently. Coalesce the work or guard it with
 * a per-participant mutex.
 *
 * Failing while H8 is unresolved. Flipped to `it(...)` in Stage 3.
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

const makeStore = (initial: Record<string, Record<string, unknown>> = {}): SignalKeyStore => {
	const data = { ...initial }
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

/**
 * Mirrors the receive-path pre-mutex block: check mapping, store if missing,
 * migrate session. The deliberately wide read-then-act window matches the
 * real code path which performs async I/O between the check and the migrate.
 */
const lookupStoreMigrate = async (
	keys: Awaited<ReturnType<typeof addTransactionCapability>>,
	pnUser: string,
	lidUser: string,
	migrationCounter: { count: number }
) => {
	const { [pnUser]: existing } = await keys.get('lid-mapping', [pnUser])
	await delay(15) // simulates network/decoding work between read and write
	if (!existing) {
		await keys.transaction(async () => {
			await keys.set({ 'lid-mapping': { [pnUser]: lidUser } })
		}, 'lid-mapping')
		// Migration only fires once per actual missing-mapping observation.
		migrationCounter.count++
	}
}

describe('messages-recv — concurrent alt-JID participant migration (H8)', () => {
	it.failing(
		'two parallel inbound messages from the same alt-JID participant trigger at most one migration',
		async () => {
			const keys = addTransactionCapability(makeStore(), silentLogger(), {
				maxCommitRetries: 1,
				delayBetweenTriesMs: 1
			})

			const pnUser = '12025550100'
			const lidUser = 'alt-12025550100'
			const migrationCounter = { count: 0 }

			await Promise.all([
				lookupStoreMigrate(keys, pnUser, lidUser, migrationCounter),
				lookupStoreMigrate(keys, pnUser, lidUser, migrationCounter)
			])

			// Today: both callers observe the mapping as missing → both migrate.
			// With per-participant serialization (or proper coalescing), only one.
			expect(migrationCounter.count).toBe(1)
		}
	)

	it.failing('store.set is only invoked once when N parallel callers see the same missing mapping', async () => {
		const setCalls: SignalDataSet[] = []
		const store: SignalKeyStore = {
			async get() {
				return {}
			},
			async set(d) {
				setCalls.push(structuredClone(d))
			}
		}
		const keys = addTransactionCapability(store, silentLogger(), {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})

		const pnUser = '12025550100'
		const lidUser = 'alt-12025550100'
		const migrationCounter = { count: 0 }

		await Promise.all(Array.from({ length: 4 }, () => lookupStoreMigrate(keys, pnUser, lidUser, migrationCounter)))

		expect(setCalls).toHaveLength(1)
		expect(migrationCounter.count).toBe(1)
	})
})
