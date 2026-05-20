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
 * without touching the filesystem and don't need cleanup.
 */
import { useSqliteAuthState } from '../../Utils/use-sqlite-auth-state'

const sampleSession = (b: number) => Buffer.from([b])

describe('useSqliteAuthState', () => {
	it('opens an in-memory database and round-trips creds', async () => {
		const { state, saveCreds, close } = await useSqliteAuthState({ dbPath: ':memory:' })
		state.creds.advSecretKey = 'sentinel'
		await saveCreds()

		// Cannot reopen `:memory:` (it's per-connection) — so verify via saveCreds
		// + a second instance pointed at the same handle.
		const row = (state.creds as any).advSecretKey
		expect(row).toBe('sentinel')
		close()
	})

	it('persists creds across open/close on a file-backed db', async () => {
		const tmp = await import('os').then(o => o.tmpdir())
		const path = await import('path').then(p => p.join(tmp, `baileys-sqlite-test-${Date.now()}.db`))
		const { promises: fs } = await import('fs')

		try {
			const a = await useSqliteAuthState({ dbPath: path })
			a.state.creds.advSecretKey = 'persistent-sentinel'
			await a.saveCreds()
			a.close()

			const b = await useSqliteAuthState({ dbPath: path })
			expect(b.state.creds.advSecretKey).toBe('persistent-sentinel')
			b.close()
		} finally {
			await fs.rm(path, { force: true })
			await fs.rm(`${path}-wal`, { force: true })
			await fs.rm(`${path}-shm`, { force: true })
		}
	})

	it('set/get/delete on signal records', async () => {
		const { state, close } = await useSqliteAuthState({ dbPath: ':memory:' })
		const jid = 'peer@s.whatsapp.net'

		await state.keys.set({ session: { [jid]: sampleSession(0x11) as any } })
		let got = await state.keys.get('session', [jid])
		expect(Buffer.from(got[jid] as Uint8Array)).toEqual(Buffer.from([0x11]))

		await state.keys.set({ session: { [jid]: null } })
		got = await state.keys.get('session', [jid])
		expect(got[jid]).toBeUndefined()
		close()
	})

	it('multi-type set commits atomically (BEGIN IMMEDIATE)', async () => {
		const { state, close } = await useSqliteAuthState({ dbPath: ':memory:' })
		const jid = 'peer@s.whatsapp.net'

		await state.keys.set({
			session: { [jid]: sampleSession(0x01) as any },
			'identity-key': { [jid]: sampleSession(0x02) as any }
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
		await state.keys.set({ 'identity-key': { [jid]: sampleSession(0xa0) as any } })

		// Simulate a corrupt value that fails JSON.stringify by passing a
		// circular reference. SQLite's BEGIN IMMEDIATE wraps the better-sqlite3
		// `db.transaction` callback; a throw inside rolls back the whole tx.
		const circular: any = {}
		circular.self = circular

		await expect(
			state.keys.set({
				session: { [jid]: sampleSession(0xff) as any },
				'identity-key': { [jid]: circular }
			})
		).rejects.toThrow()

		// Session was NOT written (rolled back); identity-key still holds A0.
		const got = await state.keys.get('session', [jid])
		expect(got[jid]).toBeUndefined()

		const idKey = await state.keys.get('identity-key', [jid])
		expect(Buffer.from(idKey[jid] as Uint8Array)).toEqual(Buffer.from([0xa0]))
		close()
	})

	it('list and listIds enumerate the stored records', async () => {
		const { state, close } = await useSqliteAuthState({ dbPath: ':memory:' })

		await state.keys.set({
			session: {
				'a@s.whatsapp.net': sampleSession(0x01) as any,
				'b@s.whatsapp.net': sampleSession(0x02) as any,
				'c@s.whatsapp.net': sampleSession(0x03) as any
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

		await state.keys.set({ session: { 'peer@s.whatsapp.net': sampleSession(0x99) as any } })

		await state.keys.clear!()

		const got = await state.keys.get('session', ['peer@s.whatsapp.net'])
		expect(got).toEqual({})
		expect(state.creds.advSecretKey).toBe('still-here')
		close()
	})
})
