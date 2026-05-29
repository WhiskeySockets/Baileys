/**
 * Stage 5 — `migrateAuthState` round-trip test.
 *
 * Source = on-disk `useMultiFileAuthState`. Destination = in-memory
 * `useSqliteAuthState`. Verifies that creds + a representative slice of
 * signal records (pre-key + session + identity-key) round-trip without loss
 * and that a re-run is idempotent (skipExisting).
 */
import { mkdtemp, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { migrateAuthState } from '../../Utils/migrate-auth-state'
import { useMultiFileAuthState } from '../../Utils/use-multi-file-auth-state'
import { useSqliteAuthState } from '../../Utils/use-sqlite-auth-state'

describe('migrateAuthState — multi-file → SQLite', () => {
	let dir: string
	beforeEach(async () => {
		dir = await mkdtemp(join(tmpdir(), 'baileys-migrate-'))
	})
	afterEach(async () => {
		await rm(dir, { recursive: true, force: true })
	})

	it('copies creds and every signal record type (including app-state-sync-key)', async () => {
		const src = await useMultiFileAuthState(dir)
		src.state.creds.advSecretKey = 'migrate-test-secret'
		await src.saveCreds()

		// `app-state-sync-key` is the type that exercises the
		// `proto.Message.AppStateSyncKeyData.fromObject` codec on read, so
		// migrating it round-trips the protobuf-special-cased path — not
		// just plain Buffer/object values like the other types.
		await src.state.keys.set({
			'pre-key': {
				'1': { public: Buffer.from([0x11]), private: Buffer.from([0x12]) } as any,
				'2': { public: Buffer.from([0x21]), private: Buffer.from([0x22]) } as any
			},
			session: {
				'peer-a@s.whatsapp.net': Buffer.from([0xa1]) as any,
				'peer-b@s.whatsapp.net': Buffer.from([0xa2]) as any
			},
			'identity-key': {
				'peer-a@s.whatsapp.net': Buffer.from([0xb1]) as any
			},
			'app-state-sync-key': {
				'key-id-1': {
					keyData: Buffer.from([0xc1, 0xc2, 0xc3]),
					fingerprint: { rawId: 1, currentIndex: 0, deviceIndexes: [0] },
					timestamp: '1700000000'
				} as any
			}
		})

		const dst = await useSqliteAuthState({ dbPath: ':memory:' })

		const result = await migrateAuthState({ from: src.state, to: dst.state, verify: true })

		expect(result.creds.copied).toBe(true)
		expect(result.counts['pre-key']).toBe(2)
		expect(result.counts['session']).toBe(2)
		expect(result.counts['identity-key']).toBe(1)
		expect(result.counts['app-state-sync-key']).toBe(1)
		expect(result.verified).toBe(true)
		expect(result.warnings).toEqual([])

		// Sample-check destination contents.
		expect(dst.state.creds.advSecretKey).toBe('migrate-test-secret')
		const sessions = await dst.state.keys.get('session', ['peer-a@s.whatsapp.net', 'peer-b@s.whatsapp.net'])
		expect(Buffer.from(sessions['peer-a@s.whatsapp.net'] as Uint8Array)).toEqual(Buffer.from([0xa1]))
		expect(Buffer.from(sessions['peer-b@s.whatsapp.net'] as Uint8Array)).toEqual(Buffer.from([0xa2]))

		const preKeys = await dst.state.keys.get('pre-key', ['1', '2'])
		expect(Buffer.from((preKeys['1'] as any).public)).toEqual(Buffer.from([0x11]))
		expect(Buffer.from((preKeys['2'] as any).public)).toEqual(Buffer.from([0x21]))

		const appStateKeys = await dst.state.keys.get('app-state-sync-key', ['key-id-1'])
		expect(appStateKeys['key-id-1']).toBeDefined()
		expect(Buffer.from((appStateKeys['key-id-1'] as any).keyData)).toEqual(Buffer.from([0xc1, 0xc2, 0xc3]))

		dst.close()
	})

	it('is idempotent: re-running after a partial migration completes cleanly', async () => {
		const src = await useMultiFileAuthState(dir)
		src.state.creds.advSecretKey = 'idempotent-test'
		await src.saveCreds()

		await src.state.keys.set({
			session: {
				'peer-a@s.whatsapp.net': Buffer.from([0x01]) as any,
				'peer-b@s.whatsapp.net': Buffer.from([0x02]) as any,
				'peer-c@s.whatsapp.net': Buffer.from([0x03]) as any
			}
		})

		const dst = await useSqliteAuthState({ dbPath: ':memory:' })

		// First migration.
		const first = await migrateAuthState({ from: src.state, to: dst.state })
		expect(first.counts['session']).toBe(3)

		// Add one more record to source, re-run migration. The two already-
		// migrated records should be skipped; only the new one is copied.
		await src.state.keys.set({
			session: {
				'peer-d@s.whatsapp.net': Buffer.from([0x04]) as any
			}
		})

		const second = await migrateAuthState({ from: src.state, to: dst.state })
		expect(second.counts['session']).toBe(1)
		expect(second.verified).toBe(true)

		// All 4 records observable on the destination.
		const all = await dst.state.keys.get('session', [
			'peer-a@s.whatsapp.net',
			'peer-b@s.whatsapp.net',
			'peer-c@s.whatsapp.net',
			'peer-d@s.whatsapp.net'
		])
		expect(Object.keys(all).sort()).toEqual([
			'peer-a@s.whatsapp.net',
			'peer-b@s.whatsapp.net',
			'peer-c@s.whatsapp.net',
			'peer-d@s.whatsapp.net'
		])

		dst.close()
	})

	it('throws when the source store does not implement list()', async () => {
		const noListSrc = {
			creds: { advSecretKey: 'x' } as any,
			keys: {
				get: async () => ({}),
				set: async () => {}
			}
		}
		const dst = await useSqliteAuthState({ dbPath: ':memory:' })
		await expect(migrateAuthState({ from: noListSrc as any, to: dst.state })).rejects.toThrow(/list\(type\)/)
		dst.close()
	})
})
