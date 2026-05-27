/**
 * Phase 9 — `useWaAlignedSqliteAuthState` skeleton smoke test.
 *
 * Covers:
 *   - creates all 5 physical .db files (creds, axolotl, msgstore, wa, sync);
 *   - WA-aligned tables exist with expected names;
 *   - creds round-trip via creds.db;
 *   - signal data round-trip via axolotl.db.signal_kv (opaque key-value
 *     until phase 9.5 splits to typed tables);
 *   - close + reopen preserves all data.
 *
 * Uses on-disk DBs in a tmp directory because the multi-file layout
 * requires real files (`:memory:` is per-connection and doesn't apply
 * across the 5 handles).
 */
import { mkdtemp, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

import type { SignalDataTypeMap } from '../../Types'
import { useWaAlignedSqliteAuthState } from '../../Utils/wa-aligned-sqlite'

const sampleSession = (b: number): SignalDataTypeMap['session'] => Buffer.from([b]) as Uint8Array

describe('useWaAlignedSqliteAuthState', () => {
	let dir: string

	beforeEach(async () => {
		dir = await mkdtemp(join(tmpdir(), 'wa-aligned-test-'))
	})

	afterEach(async () => {
		await rm(dir, { recursive: true, force: true })
	})

	it('opens all 5 physical .db files on first open', async () => {
		const { close } = await useWaAlignedSqliteAuthState({ sessionDir: dir })
		const { promises: fs } = await import('fs')
		const files = await fs.readdir(dir)
		expect(files).toEqual(expect.arrayContaining(['creds.db', 'axolotl.db', 'msgstore.db', 'wa.db', 'sync.db']))
		close()
	})

	it('creates WA-aligned tables in the right .db files', async () => {
		const { store, close } = await useWaAlignedSqliteAuthState({ sessionDir: dir })

		const axolotlTables = (
			store.handle('axolotl.db').prepare('SELECT name FROM sqlite_master WHERE type="table"').all() as Array<{
				name: string
			}>
		).map(r => r.name)
		expect(axolotlTables).toEqual(
			expect.arrayContaining([
				'signal_sessions',
				'signal_prekeys',
				'signal_signed_prekeys',
				'signal_kyber_prekeys',
				'signal_identities',
				'signal_sender_keys',
				'e2ee_stanza_queue',
				'signal_kv'
			])
		)

		const msgstoreTables = (
			store.handle('msgstore.db').prepare('SELECT name FROM sqlite_master WHERE type="table"').all() as Array<{
				name: string
			}>
		).map(r => r.name)
		expect(msgstoreTables).toEqual(
			expect.arrayContaining([
				'jid',
				'jid_map',
				'user_device',
				'user_device_info',
				'primary_device_version',
				'message_orphaned_edit',
				'message_quarantine'
			])
		)

		const waTables = (
			store.handle('wa.db').prepare('SELECT name FROM sqlite_master WHERE type="table"').all() as Array<{
				name: string
			}>
		).map(r => r.name)
		expect(waTables).toEqual(
			expect.arrayContaining(['wa_contacts', 'wa_trusted_contacts', 'wa_trusted_contacts_send'])
		)

		const syncTables = (
			store.handle('sync.db').prepare('SELECT name FROM sqlite_master WHERE type="table"').all() as Array<{
				name: string
			}>
		).map(r => r.name)
		expect(syncTables).toEqual(expect.arrayContaining(['collection_versions', 'syncd_mutations', 'pending_mutations']))

		close()
	})

	it('persists creds across close+reopen via creds.db', async () => {
		const first = await useWaAlignedSqliteAuthState({ sessionDir: dir })
		first.state.creds.advSecretKey = 'sentinel-creds'
		await first.saveCreds()
		first.close()

		const second = await useWaAlignedSqliteAuthState({ sessionDir: dir })
		expect(second.state.creds.advSecretKey).toBe('sentinel-creds')
		second.close()
	})

	it('persists signal data across close+reopen via axolotl.db.signal_kv', async () => {
		const first = await useWaAlignedSqliteAuthState({ sessionDir: dir })
		await first.state.keys.set({
			session: { 'aaa:0': sampleSession(7), 'bbb:0': sampleSession(42) }
		})
		first.close()

		const second = await useWaAlignedSqliteAuthState({ sessionDir: dir })
		const got = await second.state.keys.get('session', ['aaa:0', 'bbb:0'])
		expect(got['aaa:0']).toBeDefined()
		expect(got['bbb:0']).toBeDefined()
		expect(Buffer.from(got['aaa:0'] as Uint8Array).toString('hex')).toBe('07')
		expect(Buffer.from(got['bbb:0'] as Uint8Array).toString('hex')).toBe('2a')
		second.close()
	})

	it('deletes a signal key when set to null', async () => {
		const { state, close } = await useWaAlignedSqliteAuthState({ sessionDir: dir })
		await state.keys.set({ session: { x: sampleSession(1) } })
		await state.keys.set({ session: { x: null as unknown as SignalDataTypeMap['session'] } })

		const got = await state.keys.get('session', ['x'])
		expect(got['x']).toBeUndefined()
		close()
	})

	it('enumerates ids via listIds AsyncIterable', async () => {
		const { state, close } = await useWaAlignedSqliteAuthState({ sessionDir: dir })
		await state.keys.set({
			session: { a: sampleSession(1), b: sampleSession(2), c: sampleSession(3) }
		})

		const listIds = state.keys.listIds
		if (!listIds) throw new Error('listIds not implemented')
		const ids: string[] = []
		for await (const id of listIds('session')) ids.push(id)
		expect(ids.sort()).toEqual(['a', 'b', 'c'])
		close()
	})
})
