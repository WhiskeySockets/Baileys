import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState, SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { Curve, generateSignalPubKey } from '../../Utils/crypto'

const logger = P({ level: 'silent' })
const mk = () => {
	const data: { [t: string]: { [i: string]: unknown } } = {}
	const store: SignalKeyStore = {
		get: async (type, ids) => {
			const b = data[type] || {}
			const o: { [id: string]: SignalDataTypeMap[typeof type] } = {}
			for (const id of ids) if (b[id] !== undefined && b[id] !== null) o[id] = b[id] as never
			return o
		},
		set: async (u: SignalDataSet) => {
			for (const t of Object.keys(u)) {
				data[t] ||= {}
				const bk = u[t as keyof SignalDataSet]!
				for (const i of Object.keys(bk)) {
					const v = (bk as Record<string, unknown>)[i]
					if (v === null) delete data[t]![i]
					else data[t]![i] = v
				}
			}
		}
	}
	const creds = initAuthCreds()
	const auth: SignalAuthState = {
		creds,
		keys: addTransactionCapability(store, logger, { maxCommitRetries: 1, delayBetweenTriesMs: 1 })
	}
	return { auth, creds, repository: makeLibSignalRepository(auth, logger), data }
}

/**
 * Rolling back to a pre-WASM release hands these rows to the JS libsignal, so
 * the bytes written here have to be the shape it already stores: the 0x05
 * prefixed curve key, not the bare 32 bytes.
 */
describe('identity-key wire format', () => {
	it('writes the 33-byte prefixed form the JS libsignal also stores', async () => {
		const alice = mk()
		const bob = mk()
		const pk = Curve.generateKeyPair()
		await bob.auth.keys.set({ 'pre-key': { 1: pk } })
		await alice.repository.injectE2ESession({
			jid: '2222222222@s.whatsapp.net',
			session: {
				registrationId: bob.creds.registrationId,
				// Prefixed, as the wire format and every caller supply it. The bridge
				// normalises the identity inside a snapshot but decodes the bundle's
				// key strictly, so a bare 32 bytes is rejected here.
				identityKey: generateSignalPubKey(bob.creds.signedIdentityKey.public),
				preKey: { keyId: 1, publicKey: generateSignalPubKey(pk.public) },
				signedPreKey: {
					keyId: bob.creds.signedPreKey.keyId,
					publicKey: generateSignalPubKey(bob.creds.signedPreKey.keyPair.public),
					signature: bob.creds.signedPreKey.signature
				}
			}
		})

		const stored = alice.data['identity-key']!['2222222222.0'] as Uint8Array
		expect(stored).toBeDefined()
		expect(stored.length).toBe(33)
		expect(stored[0]).toBe(5)
		expect(Buffer.from(stored)).toEqual(Buffer.from(generateSignalPubKey(bob.creds.signedIdentityKey.public)))
	})
})
