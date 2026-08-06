import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import { importLegacySessionRecordV1, projectLegacySessionRecordV1 } from 'whatsapp-rust-bridge'
import { hasOpenLegacySession } from '../../Signal/legacy-session'
import { fromTypedRecord, toTypedRecord } from '../../Signal/legacy-session-codec'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState, SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability } from '../../Utils/auth-utils'
import { generateSignalPubKey } from '../../Utils/crypto'
import fixture from '../fixtures/legacy-session-rc9.json'

const logger = P({ level: 'silent' })

const revive = (value: unknown): unknown => {
	if (typeof value === 'object' && value !== null && (value as { type?: string }).type === 'Buffer') {
		// JSON.stringify writes a Buffer as { type: 'Buffer', data: number[] };
		// fixtures captured by hand may carry base64 instead.
		const { data } = value as { data: number[] | string }
		return typeof data === 'string' ? Buffer.from(data, 'base64') : Buffer.from(data)
	}

	if (Array.isArray(value)) return value.map(revive)
	// Typed arrays are already binary — walking them would turn them into plain
	// objects keyed by index.
	if (ArrayBuffer.isView(value)) return value
	if (typeof value === 'object' && value !== null) {
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, revive(v)]))
	}

	return value
}

const makeStore = (seed: Record<string, Record<string, unknown>>) => {
	const data = revive(seed) as Record<string, Record<string, unknown>>

	const store: SignalKeyStore = {
		get: async (type, ids) => {
			const bucket = data[type] || {}
			const out: { [id: string]: SignalDataTypeMap[typeof type] } = {}
			for (const id of ids) {
				if (bucket[id] !== undefined && bucket[id] !== null) {
					out[id] = bucket[id] as SignalDataTypeMap[typeof type]
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
					if (value === null) delete data[type]![id]
					else data[type]![id] = value
				}
			}
		}
	}

	return { store, data }
}

const bobCreds = revive(fixture.bob.creds) as {
	registrationId: number
	signedIdentityKey: { public: Uint8Array }
}
type LegacyEntry = {
	registrationId: number
	currentRatchet: { rootKey: string; lastRemoteEphemeralKey: string }
	indexInfo: { baseKey: string; remoteIdentityKey: string; closed: number }
	_chains: Record<string, { chainType: number; chainKey: { counter: number; key?: string } }>
}

const legacyBobSession = fixture.bob.store.session['5511900000001.0'] as unknown as {
	_sessions: Record<string, LegacyEntry>
	version: string
}
const { aliceJid } = fixture.jids

const importBobSession = () =>
	importLegacySessionRecordV1(toTypedRecord(legacyBobSession as never), {
		identityKey: generateSignalPubKey(bobCreds.signedIdentityKey.public),
		registrationId: bobCreds.registrationId
	})

describe('legacy session codec', () => {
	it('imports a real rc.9 session into the native format', () => {
		const bytes = importBobSession()

		expect(bytes.length).toBeGreaterThan(0)
	})

	it('decrypts rc.9 ciphertexts through the typed import', async () => {
		// Same ciphertexts the ad-hoc storage-adapter conversion fails on: the
		// typed path routes through the core, which reconstructs the message-key
		// material properly instead of copying fields across.
		const { store } = makeStore({
			...(fixture.bob.store as unknown as Record<string, Record<string, unknown>>),
			session: { '5511900000001.0': importBobSession() }
		})
		const auth: SignalAuthState = {
			creds: revive(fixture.bob.creds) as never,
			keys: addTransactionCapability(store, logger, { maxCommitRetries: 1, delayBetweenTriesMs: 1 })
		}
		const repository = makeLibSignalRepository(auth, logger)

		for (const message of fixture.pending) {
			const plaintext = await repository.decryptMessage({
				jid: aliceJid,
				type: message.type as 'msg' | 'pkmsg',
				ciphertext: Buffer.from(message.ct, 'base64')
			})

			expect(Buffer.from(plaintext).toString()).toBe(message.pt)
		}
	})

	it('projects the native record back into readable legacy JSON', () => {
		const projection = projectLegacySessionRecordV1(importBobSession())

		expect(projection.status).toBe('projected')
		if (projection.status !== 'projected') return

		const back = fromTypedRecord(projection.record)
		const originalEntry = Object.values(legacyBobSession._sessions)[0]!
		const backEntry = Object.values(back._sessions!)[0] as unknown as LegacyEntry

		// The identity of the session — what makes it the SAME session to the peer —
		// must survive the round trip untouched.
		expect(backEntry.registrationId).toBe(originalEntry.registrationId)
		expect(backEntry.currentRatchet.rootKey).toBe(originalEntry.currentRatchet.rootKey)
		expect(backEntry.currentRatchet.lastRemoteEphemeralKey).toBe(originalEntry.currentRatchet.lastRemoteEphemeralKey)
		expect(backEntry.indexInfo.baseKey).toBe(originalEntry.indexInfo.baseKey)
		expect(backEntry.indexInfo.remoteIdentityKey).toBe(originalEntry.indexInfo.remoteIdentityKey)
		expect(backEntry.indexInfo.closed).toBe(originalEntry.indexInfo.closed)
	})

	it('preserves every ratchet chain across the round trip', () => {
		const projection = projectLegacySessionRecordV1(importBobSession())
		if (projection.status !== 'projected') throw new Error('expected a projectable record')

		const back = fromTypedRecord(projection.record)
		const originalEntry = Object.values(legacyBobSession._sessions)[0]!
		const backEntry = Object.values(back._sessions!)[0] as unknown as LegacyEntry

		// Chain order is normalized by the core, so compare by ratchet key.
		expect(Object.keys(backEntry._chains).sort()).toEqual(Object.keys(originalEntry._chains).sort())

		for (const [ratchetKey, original] of Object.entries(originalEntry._chains)) {
			const got = backEntry._chains[ratchetKey]!
			expect(got.chainType).toBe(original.chainType)
			expect(got.chainKey.counter).toBe(original.chainKey.counter)
			expect(got.chainKey.key).toBe(original.chainKey.key)
		}
	})

	it('is idempotent: re-importing the projection yields the same bytes', () => {
		const first = importBobSession()
		const projection = projectLegacySessionRecordV1(first)
		if (projection.status !== 'projected') throw new Error('expected a projectable record')

		const second = importLegacySessionRecordV1(toTypedRecord(fromTypedRecord(projection.record) as never), {
			identityKey: generateSignalPubKey(bobCreds.signedIdentityKey.public),
			registrationId: bobCreds.registrationId
		})

		expect(Buffer.from(second)).toEqual(Buffer.from(first))
	})
})

/**
 * libsignal's own deserialize runs a v1 migration that copies a record-level
 * `registrationId` onto every entry that lacks one. An auth state written
 * before that migration still has the id only at the top, and reading such a
 * record as if the entries were unusable drops sessions that are live.
 */
describe('pre-v1 legacy records', () => {
	const preV1 = () => {
		const record = JSON.parse(JSON.stringify(legacyBobSession)) as {
			_sessions: Record<string, { registrationId?: number }>
			registrationId?: number
		}
		const [entry] = Object.values(record._sessions)
		record.registrationId = entry!.registrationId
		delete entry!.registrationId
		return record
	}

	it('counts the session as open using the record-level id', () => {
		const record = preV1()

		expect(Object.values(record._sessions)[0]!.registrationId).toBeUndefined()
		expect(hasOpenLegacySession(record as never)).toBe(true)
	})

	it('imports it instead of reporting no session', () => {
		const bytes = importLegacySessionRecordV1(toTypedRecord(preV1() as never), {
			identityKey: generateSignalPubKey(bobCreds.signedIdentityKey.public),
			registrationId: bobCreds.registrationId
		})

		expect(bytes.length).toBeGreaterThan(0)
	})
})
