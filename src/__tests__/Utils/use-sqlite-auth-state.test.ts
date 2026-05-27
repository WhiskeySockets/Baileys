/**
 * Stage 5 — `useSqliteAuthState` smoke test.
 *
 * Covers:
 *   - in-memory open, schema creation;
 *   - creds round-trip;
 *   - multi-type set lands as ONE atomic transaction;
 *   - get/set/delete on signal records;
 *   - list/listIds enumeration;
 *   - close+reopen preserves state.
 *
 * Uses `':memory:'` databases (better-sqlite3 supports them) so tests run
 * without touching the filesystem and don't need cleanup. Adapted from
 * upstream WhiskeySockets/Baileys #2575 (Stage 5).
 */
import type { SignalDataTypeMap } from '../../Types'
import { useSqliteAuthState } from '../../Utils/use-sqlite-auth-state'

// Return the precise `session` value type so call sites don't need an
// `as any` to satisfy `state.keys.set({ session: { ... } })`. Buffer is a
// Uint8Array at runtime; the cast is purely to widen one to the other for
// TypeScript's mapped-type machinery.
const sampleSession = (b: number): SignalDataTypeMap['session'] => Buffer.from([b]) as Uint8Array

describe('useSqliteAuthState', () => {
	it('opens an in-memory database and accepts an in-process creds mutation', async () => {
		// Renamed from "round-trips creds" — this in-memory case doesn't
		// actually round-trip across opens (`:memory:` is per-connection,
		// so a `close()` would discard the DB). It just exercises the
		// in-process mutation path. The file-backed test below covers the
		// real cross-instance round-trip.
		const { state, saveCreds, close } = await useSqliteAuthState({ dbPath: ':memory:' })
		state.creds.advSecretKey = 'sentinel'
		await saveCreds()

		expect(state.creds.advSecretKey).toBe('sentinel')
		close()
	})

	it('persists creds across open/close on a file-backed db', async () => {
		// Copilot round-5 fix: `Date.now()` alone can collide between Jest
		// parallel workers landing in the same millisecond. `mkdtemp` gives
		// a process-unique directory; the DB filename inside it is fixed
		// so we can predictably target the WAL/SHM companions on cleanup.
		const { promises: fs } = await import('fs')
		const { mkdtemp } = await import('fs/promises')
		const { tmpdir } = await import('os')
		const { join } = await import('path')

		const dir = await mkdtemp(join(tmpdir(), 'baileys-sqlite-test-'))
		const path = join(dir, 'auth.db')

		try {
			const a = await useSqliteAuthState({ dbPath: path })
			a.state.creds.advSecretKey = 'persistent-sentinel'
			await a.saveCreds()
			a.close()

			const b = await useSqliteAuthState({ dbPath: path })
			expect(b.state.creds.advSecretKey).toBe('persistent-sentinel')
			b.close()
		} finally {
			await fs.rm(dir, { recursive: true, force: true })
		}
	})

	it('set/get/delete on signal records', async () => {
		const { state, close } = await useSqliteAuthState({ dbPath: ':memory:' })
		const jid = 'peer@s.whatsapp.net'

		await state.keys.set({ session: { [jid]: sampleSession(0x11) } })
		let got = await state.keys.get('session', [jid])
		expect(Buffer.from(got[jid] as Uint8Array)).toEqual(Buffer.from([0x11]))

		await state.keys.set({ session: { [jid]: null } })
		got = await state.keys.get('session', [jid])
		expect(got[jid]).toBeUndefined()
		close()
	})

	it('treats undefined as delete sentinel (cross-adapter consistency, round-6)', async () => {
		// Regression guard for Copilot's round-6 finding: the multi-file
		// adapter and `makeCacheableSignalKeyStore` defensively accept
		// `undefined` as a delete sentinel alongside `null`. The SQLite
		// store must do the same — otherwise `JSON.stringify(undefined)`
		// would bind as NULL and violate the `value TEXT NOT NULL` schema
		// constraint at the database boundary.
		const { state, close } = await useSqliteAuthState({ dbPath: ':memory:' })
		const jid = 'peer@s.whatsapp.net'

		await state.keys.set({ session: { [jid]: sampleSession(0x22) } })
		let got = await state.keys.get('session', [jid])
		expect(Buffer.from(got[jid] as Uint8Array)).toEqual(Buffer.from([0x22]))

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await state.keys.set({ session: { [jid]: undefined as any } })
		got = await state.keys.get('session', [jid])
		expect(got[jid]).toBeUndefined()
		close()
	})

	it('multi-type set commits atomically (BEGIN IMMEDIATE)', async () => {
		const { state, close } = await useSqliteAuthState({ dbPath: ':memory:' })
		const jid = 'peer@s.whatsapp.net'

		await state.keys.set({
			session: { [jid]: sampleSession(0x01) },
			'identity-key': { [jid]: sampleSession(0x02) }
		})

		const [{ [jid]: s }, { [jid]: i }] = await Promise.all([
			state.keys.get('session', [jid]),
			state.keys.get('identity-key', [jid])
		])

		expect(Buffer.from(s as Uint8Array)).toEqual(Buffer.from([0x01]))
		expect(Buffer.from(i as Uint8Array)).toEqual(Buffer.from([0x02]))
		close()
	})

	it('rolls back a partial set when one of the inner writes throws', async () => {
		const { state, close } = await useSqliteAuthState({ dbPath: ':memory:' })
		const jid = 'peer@s.whatsapp.net'

		// Pre-seed identity-key so the partial-write test has something to
		// observe; if rollback works, this value remains.
		await state.keys.set({ 'identity-key': { [jid]: sampleSession(0xa0) } })

		// Simulate a corrupt value that fails JSON.stringify by passing a
		// circular reference. SQLite's BEGIN IMMEDIATE wraps the better-sqlite3
		// `db.transaction` callback; a throw inside rolls back the whole tx.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const circular: any = {}
		circular.self = circular

		await expect(
			state.keys.set({
				session: { [jid]: sampleSession(0xff) },
				'identity-key': { [jid]: circular }
			})
		).rejects.toThrow()

		// Session was NOT written (rolled back); identity-key still holds A0.
		const got = await state.keys.get('session', [jid])
		expect(got[jid]).toBeUndefined()

		const idKey = await state.keys.get('identity-key', [jid])
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect(Buffer.from(idKey[jid] as Uint8Array)).toEqual(Buffer.from([0xa0]))
		close()
	})

	it('list and listIds enumerate the stored records', async () => {
		const { state, close } = await useSqliteAuthState({ dbPath: ':memory:' })

		await state.keys.set({
			session: {
				'a@s.whatsapp.net': sampleSession(0x01),
				'b@s.whatsapp.net': sampleSession(0x02),
				'c@s.whatsapp.net': sampleSession(0x03)
			}
		})

		const ids: string[] = []
		for await (const id of state.keys.listIds!('session')) ids.push(id)
		expect(ids.sort()).toEqual(['a@s.whatsapp.net', 'b@s.whatsapp.net', 'c@s.whatsapp.net'])

		const seen = new Map<string, number>()
		for await (const [id, value] of state.keys.list!('session')) {
			seen.set(id, Buffer.from(value)[0]!)
		}

		expect(seen.get('a@s.whatsapp.net')).toBe(0x01)
		expect(seen.get('b@s.whatsapp.net')).toBe(0x02)
		expect(seen.get('c@s.whatsapp.net')).toBe(0x03)
		close()
	})

	it('clear() empties signal_keys but keeps creds', async () => {
		const { state, saveCreds, close } = await useSqliteAuthState({ dbPath: ':memory:' })
		state.creds.advSecretKey = 'still-here'
		await saveCreds()

		await state.keys.set({ session: { 'peer@s.whatsapp.net': sampleSession(0x99) } })

		await state.keys.clear!()

		const got = await state.keys.get('session', ['peer@s.whatsapp.net'])
		expect(got).toEqual({})
		expect(state.creds.advSecretKey).toBe('still-here')
		close()
	})
})
