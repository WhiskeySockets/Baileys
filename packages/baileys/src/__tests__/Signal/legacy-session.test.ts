import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import {
	hasOpenLegacySession,
	isLegacySessionEntry,
	isLegacySessionRecord,
	legacySessionInfo,
	pickOpenLegacySession
} from '../../Signal/legacy-session'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState, SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { generateSignalPubKey } from '../../Utils/crypto'
import { WAJIDDomains } from '../../WABinary'

const logger = P({ level: 'silent' })

const b64 = (fill: number, size = 33) => Buffer.alloc(size, fill).toString('base64')

/** One `SessionEntry.serialize()` as the JS libsignal wrote it (base64 strings). */
const legacyEntry = ({ closed, registrationId, baseKeyFill }: Record<string, number>) => ({
	registrationId,
	currentRatchet: {
		ephemeralKeyPair: { pubKey: b64(1), privKey: b64(2, 32) },
		lastRemoteEphemeralKey: b64(3),
		previousCounter: 0,
		rootKey: b64(4, 32)
	},
	indexInfo: {
		baseKey: b64(baseKeyFill!),
		baseKeyType: 2,
		closed,
		used: 1700000000000,
		created: 1699999999000,
		remoteIdentityKey: b64(5)
	},
	_chains: {}
})

/** A rotated record: the FIRST key is a closed state, the live one comes later. */
const rotatedLegacyRecord = () => ({
	_sessions: {
		[b64(9)]: legacyEntry({ closed: 1700000000000, registrationId: 111, baseKeyFill: 9 }),
		[b64(8)]: legacyEntry({ closed: -1, registrationId: 222, baseKeyFill: 8 })
	},
	version: 'v1'
})

const makeMemoryKeyStore = (seed: { [type: string]: { [id: string]: unknown } } = {}) => {
	const data: { [type: string]: { [id: string]: unknown } } = JSON.parse(JSON.stringify(seed))

	const store: SignalKeyStore = {
		get: async (type, ids) => {
			const bucket = data[type] || {}
			const out: { [id: string]: SignalDataTypeMap[typeof type] } = {}
			for (const id of ids) {
				const value = bucket[id]
				if (value !== undefined && value !== null) {
					out[id] = value as SignalDataTypeMap[typeof type]
				}
			}

			return out
		},
		set: async (update: SignalDataSet) => {
			for (const type of Object.keys(update)) {
				data[type] ||= {}
				const bucket = update[type as keyof SignalDataSet]!
				for (const id of Object.keys(bucket)) {
					const value = (bucket as Record<string, unknown>)[id]
					if (value === null) {
						delete data[type]![id]
					} else {
						data[type]![id] = value
					}
				}
			}
		}
	}

	return { store, data }
}

const makeRepository = (seed?: { [type: string]: { [id: string]: unknown } }) => {
	const { store, data } = makeMemoryKeyStore(seed)
	const auth: SignalAuthState = {
		creds: initAuthCreds(),
		keys: addTransactionCapability(store, logger, { maxCommitRetries: 1, delayBetweenTriesMs: 1 })
	}

	return { repository: makeLibSignalRepository(auth, logger), data }
}

describe('legacy session helpers', () => {
	it('recognises a legacy record and rejects bridge bytes', () => {
		expect(isLegacySessionRecord(rotatedLegacyRecord())).toBe(true)
		expect(isLegacySessionRecord(new Uint8Array([1, 2, 3]))).toBe(false)
		expect(isLegacySessionRecord(Buffer.from([1, 2, 3]))).toBe(false)
		expect(isLegacySessionRecord(null)).toBe(false)
		expect(isLegacySessionRecord({})).toBe(false)
	})

	it('picks the OPEN state, not the first key', () => {
		const open = pickOpenLegacySession(rotatedLegacyRecord())

		// Insertion order puts the closed state first; the live one must win.
		expect(open?.registrationId).toBe(222)
		expect(hasOpenLegacySession(rotatedLegacyRecord())).toBe(true)
	})

	it('reports no open state when every session is closed', () => {
		const allClosed = {
			_sessions: {
				[b64(9)]: legacyEntry({ closed: 1700000000000, registrationId: 111, baseKeyFill: 9 })
			}
		}

		expect(pickOpenLegacySession(allClosed)).toBeUndefined()
		expect(hasOpenLegacySession(allClosed)).toBe(false)
	})

	it('ignores structurally incomplete entries', () => {
		const broken = { _sessions: { a: { indexInfo: { closed: -1 } } as never } }

		expect(pickOpenLegacySession(broken)).toBeUndefined()
	})

	it('detects a bare entry and reads its session info', () => {
		const entry = legacyEntry({ closed: -1, registrationId: 222, baseKeyFill: 8 })

		expect(isLegacySessionEntry(entry)).toBe(true)
		expect(isLegacySessionEntry(new Uint8Array([1]))).toBe(false)

		const info = legacySessionInfo(entry)
		expect(info?.registrationId).toBe(222)
		expect(Buffer.from(info!.baseKey).toString('base64')).toBe(b64(8))
	})

	it('returns null session info when the entry lacks a base key', () => {
		expect(legacySessionInfo({ registrationId: 1 })).toBeNull()
		expect(legacySessionInfo({ indexInfo: { baseKey: b64(8) } })).toBeNull()
	})
})

describe('repository on a pre-WASM auth state', () => {
	const pnJid = '5511900000001@s.whatsapp.net'
	const addr = '5511900000001.0'

	// A legacy record only converts if its key material is real: these fixtures
	// carry filler bytes, which are not valid curve points, so the typed import
	// rejects them rather than adopting a session that cannot work. The happy
	// path is covered against a genuine rc.9 session in legacy-fixture.test.ts.
	it('refuses a legacy record whose key material is not valid', async () => {
		const { repository } = makeRepository({ session: { [addr]: rotatedLegacyRecord() } })

		await expect(repository.getSessionInfo(pnJid)).resolves.toBeNull()
		await expect(repository.validateSession(pnJid)).resolves.toEqual({ exists: false, reason: 'no session' })
	})

	it('reports no open session when the legacy record is fully closed', async () => {
		const closedOnly = {
			_sessions: { [b64(9)]: legacyEntry({ closed: 1700000000000, registrationId: 111, baseKeyFill: 9 }) }
		}
		const { repository } = makeRepository({ session: { [addr]: closedOnly } })

		const result = await repository.validateSession(pnJid)
		expect(result.exists).toBe(false)
	})

	it('carries a legacy session across the PN → LID migration instead of dropping it', async () => {
		const lidJid = '18000000000001@lid'
		const { repository, data } = makeRepository({
			'device-list': { '5511900000001': ['0'] },
			session: { [addr]: rotatedLegacyRecord() }
		})

		const result = await repository.migrateSession(pnJid, lidJid)

		expect(result.migrated).toBe(1)
		// PN row cleared, LID row now holds the record — still readable, not empty.
		expect(data.session!['5511900000001.0']).toBeUndefined()
		const moved = data.session!['18000000000001_1.0']
		expect(moved).toBeDefined()
		expect(hasOpenLegacySession(moved as never)).toBe(true)
	})

	it('does not resurrect a fully-closed legacy record as a usable session', async () => {
		const closedOnly = {
			_sessions: { [b64(9)]: legacyEntry({ closed: 1700000000000, registrationId: 111, baseKeyFill: 9 }) }
		}
		const { repository } = makeRepository({ session: { [addr]: closedOnly } })

		// Handing the record over would let the bridge promote the closed state to
		// current and encrypt under a ratchet the peer already dropped.
		await expect(repository.getSessionInfo(pnJid)).resolves.toBeNull()
		await expect(repository.validateSession(pnJid)).resolves.toEqual({ exists: false, reason: 'no session' })
	})

	it('keeps a live LID session instead of overwriting it with a legacy PN one', async () => {
		const lidJid = '18000000000001@lid'
		const lidAddr = '18000000000001_1.0'
		const liveLid = {
			_sessions: { [b64(7)]: legacyEntry({ closed: -1, registrationId: 333, baseKeyFill: 7 }) }
		}
		const { repository, data } = makeRepository({
			'device-list': { '5511900000001': ['0'] },
			session: { [addr]: rotatedLegacyRecord(), [lidAddr]: liveLid }
		})

		const result = await repository.migrateSession(pnJid, lidJid)

		expect(result.migrated).toBe(0)
		// The post-upgrade LID session is newer and must survive untouched.
		expect(pickOpenLegacySession(data.session![lidAddr] as never)?.registrationId).toBe(333)
		// ...and the PN row is not cleared, since nothing was moved.
		expect(data.session![addr]).toBeDefined()
	})

	/**
	 * Sessions are stored in the legacy shape, so rows are compared by the base
	 * keys they hold rather than byte-for-byte: that is what identifies the
	 * session, and it survives the conversion.
	 */
	const sessionIdentity = (row: unknown): string[] =>
		Object.keys((row as { _sessions?: Record<string, unknown> })?._sessions ?? {}).sort()

	/** A real session, exactly as injectE2ESession leaves it in storage. */
	const bridgeSessionBytes = async (jid: string, preKeyId: number): Promise<unknown> => {
		const peerCreds = initAuthCreds()
		const { repository, data } = makeRepository()
		await repository.injectE2ESession({
			jid,
			session: {
				registrationId: peerCreds.registrationId,
				identityKey: generateSignalPubKey(peerCreds.signedIdentityKey.public),
				preKey: {
					keyId: preKeyId,
					publicKey: generateSignalPubKey(peerCreds.signedPreKey.keyPair.public)
				},
				signedPreKey: {
					keyId: peerCreds.signedPreKey.keyId,
					publicKey: generateSignalPubKey(peerCreds.signedPreKey.keyPair.public),
					signature: peerCreds.signedPreKey.signature
				}
			}
		})

		return Object.values(data.session!)[0]
	}

	it('keeps a live LID session instead of overwriting it with a post-upgrade PN one', async () => {
		// Same rule as the legacy case, reached through the bridge-bytes branch:
		// a session written under the PN key before the mapping was known must
		// not clobber a newer one already on the LID key.
		const lidJid = '18000000000001@lid'
		const lidAddr = '18000000000001_1.0'
		const older = await bridgeSessionBytes(pnJid, 1)
		const newer = await bridgeSessionBytes(lidJid, 2)

		const { repository, data } = makeRepository({ 'device-list': { '5511900000001': ['0'] } })
		// Seeded outside the constructor: it JSON round-trips the seed, which
		// would turn these byte arrays into plain objects.
		data.session = { [addr]: older, [lidAddr]: newer }

		const result = await repository.migrateSession(pnJid, lidJid)

		expect(result.migrated).toBe(0)
		// The LID row must still hold the newer session, byte for byte.
		expect(sessionIdentity(data.session![lidAddr])).toEqual(sessionIdentity(newer))
		expect(data.session![addr]).toBeDefined()
	})

	it('migrates a post-upgrade PN session when the LID key is free', async () => {
		const lidJid = '18000000000002@lid'
		const lidAddr = '18000000000002_1.0'
		const pnBytes = await bridgeSessionBytes(pnJid, 3)

		const { repository, data } = makeRepository({ 'device-list': { '5511900000001': ['0'] } })
		data.session = { [addr]: pnBytes }

		const result = await repository.migrateSession(pnJid, lidJid)

		expect(result.migrated).toBe(1)
		expect(data.session![lidAddr]).toBeDefined()
		expect(data.session![addr]).toBeUndefined()
	})

	it('migrates a device-99 session stored under the hosted address', async () => {
		// A device-99 session created before the mapping was known lands on the
		// hosted address. Discovery used to probe only `user.99`, so the row was
		// never found and went stale once lookups moved to the LID side.
		const lidJid = '18000000000003@lid'
		const hostedAddr = `5511900000001_${WAJIDDomains.HOSTED}.99`
		const pnBytes = await bridgeSessionBytes('5511900000001:99@hosted', 4)

		const { repository, data } = makeRepository({ 'device-list': { '5511900000001': ['99'] } })
		data.session = { [hostedAddr]: pnBytes }

		const result = await repository.migrateSession(pnJid, lidJid)

		expect(result.migrated).toBe(1)
		// The row moves to the hosted-LID address and the source is cleared.
		expect(data.session![`18000000000003_${WAJIDDomains.HOSTED_LID}.99`]).toBeDefined()
		expect(data.session![hostedAddr]).toBeUndefined()
	})

	it('migrates a device-99 session stored under the plain address', async () => {
		// The other half of the same problem: the row exists at `user.99`, but the
		// address was re-derived from the jid as `user_128.99`, so nothing matched.
		const lidJid = '18000000000004@lid'
		const plainAddr = '5511900000001.99'
		const pnBytes = await bridgeSessionBytes('5511900000001:99@hosted', 5)

		const { repository, data } = makeRepository({ 'device-list': { '5511900000001': ['99'] } })
		data.session = { [plainAddr]: pnBytes }

		const result = await repository.migrateSession(pnJid, lidJid)

		expect(result.migrated).toBe(1)
		expect(sessionIdentity(data.session![`18000000000004_${WAJIDDomains.HOSTED_LID}.99`])).toEqual(
			sessionIdentity(pnBytes)
		)
		expect(data.session![plainAddr]).toBeUndefined()
	})

	it('keeps one device-99 row when both address shapes hold a session', async () => {
		// The two shapes share a single destination. Migrating both would delete
		// both and keep whichever was written last, losing a live ratchet.
		const lidJid = '18000000000005@lid'
		const plainAddr = '5511900000001.99'
		const hostedAddr = `5511900000001_${WAJIDDomains.HOSTED}.99`
		const plainBytes = await bridgeSessionBytes('5511900000001:99@hosted', 6)
		const hostedBytes = await bridgeSessionBytes('5511900000001:99@hosted', 7)

		const { repository, data } = makeRepository({ 'device-list': { '5511900000001': ['99'] } })
		data.session = { [plainAddr]: plainBytes, [hostedAddr]: hostedBytes }

		const result = await repository.migrateSession(pnJid, lidJid)

		expect(result.migrated).toBe(1)
		// The hosted row is the shape written today, so it is the one that moves.
		expect(sessionIdentity(data.session![`18000000000005_${WAJIDDomains.HOSTED_LID}.99`])).toEqual(
			sessionIdentity(hostedBytes)
		)
		expect(data.session![hostedAddr]).toBeUndefined()
		// The other row is left alone rather than deleted along with it.
		expect(data.session![plainAddr]).toBeDefined()
	})

	it('picks the open device-99 row when the hosted one is closed', async () => {
		// Preferring the hosted shape unconditionally would strand the live
		// session whenever the hosted row is the dead one.
		const lidJid = '18000000000006@lid'
		const plainAddr = '5511900000001.99'
		const hostedAddr = `5511900000001_${WAJIDDomains.HOSTED}.99`
		const liveBytes = await bridgeSessionBytes('5511900000001:99@hosted', 8)

		const { repository, data } = makeRepository({ 'device-list': { '5511900000001': ['99'] } })
		// An empty record deserialises to a session with no open state.
		data.session = { [plainAddr]: liveBytes, [hostedAddr]: new Uint8Array([0]) }

		const result = await repository.migrateSession(pnJid, lidJid)

		expect(result.migrated).toBe(1)
		expect(sessionIdentity(data.session![`18000000000006_${WAJIDDomains.HOSTED_LID}.99`])).toEqual(
			sessionIdentity(liveBytes)
		)
		expect(data.session![plainAddr]).toBeUndefined()
		// The closed row is left behind rather than migrated.
		expect(data.session![hostedAddr]).toBeDefined()
	})

	it('does not migrate a legacy record whose states are all closed', async () => {
		const lidJid = '18000000000001@lid'
		const closedOnly = {
			_sessions: { [b64(9)]: legacyEntry({ closed: 1700000000000, registrationId: 111, baseKeyFill: 9 }) }
		}
		const { repository, data } = makeRepository({
			'device-list': { '5511900000001': ['0'] },
			session: { [addr]: closedOnly }
		})

		const result = await repository.migrateSession(pnJid, lidJid)

		expect(result.migrated).toBe(0)
		// The dead record stays put rather than being copied onto the LID key.
		expect(data.session!['18000000000001_1.0']).toBeUndefined()
	})
})
