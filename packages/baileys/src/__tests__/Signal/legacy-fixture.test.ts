import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState, SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability } from '../../Utils/auth-utils'
import fixture from '../fixtures/legacy-session-rc9.json'

const logger = P({ level: 'silent' })

/**
 * `legacy-session-rc9.json` was produced by baileys@7.0.0-rc.9 — the last JS
 * libsignal release, with no Rust anywhere in the pipeline. These are real
 * ratcheted sessions (a DM that turned over twice, plus a group sender key)
 * and real ciphertexts that the old implementation produced but never
 * consumed.
 *
 * The point of these tests is the upgrade path: a user with an existing auth
 * state must be able to install this branch and keep talking. If the WASM
 * backend cannot decrypt what the JS backend enciphered, the migration silently
 * breaks every live conversation.
 */

type JsonBuffer = { type: 'Buffer'; data: string }

const isJsonBuffer = (value: unknown): value is JsonBuffer =>
	typeof value === 'object' && value !== null && (value as JsonBuffer).type === 'Buffer'

/** Rehydrate the `{type:'Buffer',data:<base64>}` envelopes back into Buffers. */
const revive = (value: unknown): unknown => {
	if (isJsonBuffer(value)) {
		return Buffer.from(value.data, 'base64')
	}

	if (Array.isArray(value)) {
		return value.map(revive)
	}

	if (typeof value === 'object' && value !== null) {
		const out: Record<string, unknown> = {}
		for (const [k, v] of Object.entries(value)) {
			out[k] = revive(v)
		}

		return out
	}

	return value
}

const makeStore = (seed: Record<string, Record<string, unknown>>) => {
	const data: Record<string, Record<string, unknown>> = revive(seed) as never

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

const makeParty = (side: 'alice' | 'bob') => {
	const { store, data } = makeStore(fixture[side].store as never)
	const auth: SignalAuthState = {
		creds: revive(fixture[side].creds) as never,
		keys: addTransactionCapability(store, logger, { maxCommitRetries: 1, delayBetweenTriesMs: 1 })
	}

	return { repository: makeLibSignalRepository(auth, logger), data }
}

const { aliceJid, bobJid, groupJid } = fixture.jids

describe('pre-WASM auth state (baileys@7.0.0-rc.9 fixture)', () => {
	it('decrypts direct messages the JS backend enciphered but never delivered', async () => {
		const bob = makeParty('bob')

		for (const message of fixture.pending) {
			const plaintext = await bob.repository.decryptMessage({
				jid: aliceJid,
				type: message.type as 'msg' | 'pkmsg',
				ciphertext: Buffer.from(message.ct, 'base64')
			})

			expect(Buffer.from(plaintext).toString()).toBe(message.pt)
		}
	})

	it('decrypts group messages using the legacy sender key', async () => {
		const bob = makeParty('bob')

		for (const message of fixture.pendingGroup) {
			const plaintext = await bob.repository.decryptGroupMessage({
				group: groupJid,
				authorJid: aliceJid,
				msg: Buffer.from(message.ct, 'base64')
			})

			expect(Buffer.from(plaintext).toString()).toBe(message.pt)
		}
	})

	it('keeps the conversation going after adopting the legacy session', async () => {
		const alice = makeParty('alice')
		const bob = makeParty('bob')

		// Alice (legacy session, now driven by the WASM backend) sends anew...
		const outgoing = await alice.repository.encryptMessage({
			jid: bobJid,
			data: Buffer.from('after the upgrade')
		})
		const received = await bob.repository.decryptMessage({
			jid: aliceJid,
			type: outgoing.type,
			ciphertext: outgoing.ciphertext
		})
		expect(Buffer.from(received).toString()).toBe('after the upgrade')

		// ...and Bob replies on the same migrated session.
		const reply = await bob.repository.encryptMessage({ jid: aliceJid, data: Buffer.from('reply') })
		const readBack = await alice.repository.decryptMessage({
			jid: bobJid,
			type: reply.type,
			ciphertext: reply.ciphertext
		})
		expect(Buffer.from(readBack).toString()).toBe('reply')
	})

	it('reports the legacy session as valid and exposes its identity', async () => {
		const bob = makeParty('bob')

		await expect(bob.repository.validateSession(aliceJid)).resolves.toEqual({ exists: true })

		const info = await bob.repository.getSessionInfo(aliceJid)
		expect(info).not.toBeNull()
		expect(info!.registrationId).toBeGreaterThan(0)
		expect(info!.baseKey.length).toBeGreaterThan(0)
	})

	it('leaves the stored record untouched when only reading it', async () => {
		const bob = makeParty('bob')
		const before = JSON.stringify(bob.data.session)

		await bob.repository.validateSession(aliceJid)
		await bob.repository.getSessionInfo(aliceJid)

		// Read-only operations must not rewrite the row: a user who installs this
		// branch and never sends a message keeps a session the old code can read.
		expect(JSON.stringify(bob.data.session)).toBe(before)
	})
})
