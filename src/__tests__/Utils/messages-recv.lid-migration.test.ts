/**
 * H8 — Receive-path LID migration runs outside `messageMutex`. CLOSED in
 * Stage 3 by wrapping the pre-mutex `getPNForLID → storeLIDPNMappings →
 * migrateSession` block at `messages-recv.ts:1606-1620` in a per-(alt-jid)
 * keyed lock from a dedicated `lidMigrationLocks` `LockManager` instance.
 *
 * These tests pin the lock primitive: parallel callers for the same
 * alt-jid serialize, exactly one observes "no existing mapping" and fires
 * the migration. Different alt-jids proceed in parallel.
 */
import { makeLockManager } from '../../Utils/lock-manager'

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

/**
 * Mirrors the actual receive-path block: look up existing mapping, store
 * if absent, count the migration. Wrapped by callers in
 * `lidMigrationLocks.withLock`.
 */
const lookupStoreMigrate = async (
	state: { mappings: Map<string, string> },
	pnUser: string,
	lidUser: string,
	migrationCounter: { count: number }
) => {
	const existing = state.mappings.get(pnUser)
	await delay(15) // simulates network / decoding work between read and write
	if (!existing) {
		state.mappings.set(pnUser, lidUser)
		migrationCounter.count++
	}
}

describe('messages-recv — concurrent alt-JID participant migration (H8)', () => {
	it('two parallel inbound messages from the same alt-JID participant trigger exactly one migration', async () => {
		const locks = makeLockManager()
		const state = { mappings: new Map<string, string>() }
		const migrationCounter = { count: 0 }

		const pnUser = '12025550100'
		const lidUser = 'alt-12025550100'

		const guarded = () =>
			locks.withLock({ namespace: 'lid-migration', id: pnUser }, () =>
				lookupStoreMigrate(state, pnUser, lidUser, migrationCounter)
			)

		await Promise.all([guarded(), guarded()])

		expect(migrationCounter.count).toBe(1)
		expect(state.mappings.get(pnUser)).toBe(lidUser)
	})

	it('N parallel callers seeing the same missing mapping produce exactly one migration', async () => {
		const locks = makeLockManager()
		const state = { mappings: new Map<string, string>() }
		const migrationCounter = { count: 0 }

		const pnUser = '12025550100'
		const lidUser = 'alt-12025550100'

		await Promise.all(
			Array.from({ length: 4 }, () =>
				locks.withLock({ namespace: 'lid-migration', id: pnUser }, () =>
					lookupStoreMigrate(state, pnUser, lidUser, migrationCounter)
				)
			)
		)

		expect(migrationCounter.count).toBe(1)
	})

	it('different alt-JIDs proceed in parallel (per-participant granularity)', async () => {
		const locks = makeLockManager()
		const state = { mappings: new Map<string, string>() }
		const migrationCounter = { count: 0 }

		let active = 0
		let maxConcurrency = 0

		const work = async (pn: string, lid: string) => {
			active++
			if (active > maxConcurrency) maxConcurrency = active
			await lookupStoreMigrate(state, pn, lid, migrationCounter)
			active--
		}

		await Promise.all([
			locks.withLock({ namespace: 'lid-migration', id: 'pn-A' }, () => work('pn-A', 'lid-A')),
			locks.withLock({ namespace: 'lid-migration', id: 'pn-B' }, () => work('pn-B', 'lid-B'))
		])

		expect(maxConcurrency).toBeGreaterThanOrEqual(2)
		expect(migrationCounter.count).toBe(2)
	})
})
