import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState, SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { Curve, generateSignalPubKey } from '../../Utils/crypto'
import { MISSING_KEYS_ERROR_TEXT } from '../../Utils/decode-wa-message'

const logger = P({ level: 'silent' })

const makeMemoryKeyStore = (): SignalKeyStore => {
	const data: { [type: string]: { [id: string]: unknown } } = {}

	return {
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
}

const makeParty = () => {
	const creds = initAuthCreds()
	const auth: SignalAuthState = {
		creds,
		keys: addTransactionCapability(makeMemoryKeyStore(), logger, {
			maxCommitRetries: 1,
			delayBetweenTriesMs: 1
		})
	}

	return { auth, repository: makeLibSignalRepository(auth, logger) }
}

/**
 * messages-recv matches the decrypt failure text exactly to decide between
 * ACKing a redelivered stanza (487) and asking the peer to resend. The bridge
 * reports a replayed ciphertext as `DuplicatedMessage(chain, counter)` instead
 * of the JS libsignal wording, so the repository normalizes it — otherwise
 * every duplicate drives a retry loop.
 */
describe('decryptMessage duplicate handling', () => {
	const bobJid = '5511900000002@s.whatsapp.net'

	const establish = async () => {
		const alice = makeParty()
		const bob = makeParty()

		// Alice opens a session towards Bob from Bob's published bundle.
		const bobPreKeyId = 1
		const preKeyPair = Curve.generateKeyPair()
		await bob.auth.keys.set({ 'pre-key': { [bobPreKeyId]: preKeyPair } })

		await alice.repository.injectE2ESession({
			jid: bobJid,
			session: {
				registrationId: bob.auth.creds.registrationId,
				identityKey: generateSignalPubKey(bob.auth.creds.signedIdentityKey.public),
				preKey: { keyId: bobPreKeyId, publicKey: generateSignalPubKey(preKeyPair.public) },
				signedPreKey: {
					keyId: bob.auth.creds.signedPreKey.keyId,
					publicKey: generateSignalPubKey(bob.auth.creds.signedPreKey.keyPair.public),
					signature: bob.auth.creds.signedPreKey.signature
				}
			} as never
		})

		return { alice, bob }
	}

	it('decrypts a message once and reports a replay as an already-used key', async () => {
		const { alice, bob } = await establish()
		const aliceJid = `${alice.auth.creds.registrationId}0000001@s.whatsapp.net`

		const plaintext = Buffer.from('hello bob')
		const { type, ciphertext } = await alice.repository.encryptMessage({ jid: bobJid, data: plaintext })

		// Happy path: Bob decrypts the first delivery.
		const decrypted = await bob.repository.decryptMessage({ jid: aliceJid, type, ciphertext })
		expect(Buffer.from(decrypted)).toEqual(plaintext)

		// Bad path: the very same ciphertext arrives again. messages-recv compares
		// the stub parameter with `===`, so a prefix/suffix would break the 487 ACK
		// while still satisfying toThrow's substring match — assert exact equality.
		await expect(bob.repository.decryptMessage({ jid: aliceJid, type, ciphertext })).rejects.toHaveProperty(
			'message',
			MISSING_KEYS_ERROR_TEXT
		)
	})

	it('leaves unrelated decrypt failures untouched', async () => {
		const { bob } = await establish()
		const strangerJid = '5511900000009@s.whatsapp.net'

		// No session with this peer at all: must NOT be reported as a duplicate.
		await expect(
			bob.repository.decryptMessage({
				jid: strangerJid,
				type: 'msg',
				ciphertext: Buffer.from([0x33, 0x0a, 0x21, 0x05])
			})
		).rejects.not.toThrow(MISSING_KEYS_ERROR_TEXT)
	})
})
