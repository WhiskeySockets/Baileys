import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState, SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability, initAuthCreds, makeCacheableSignalKeyStore } from '../../Utils/auth-utils'
import { Curve, generateSignalPubKey } from '../../Utils/crypto'

const logger = P({ level: 'silent' })

const makeMemoryKeyStore = (): SignalKeyStore => {
	const data: { [type: string]: { [id: string]: unknown } } = {}

	return {
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
}

/** Mirrors how a real socket is wired: cacheable store on top of a durable one. */
const makeParty = (cacheable: boolean) => {
	const creds = initAuthCreds()
	const base = makeMemoryKeyStore()
	const keys = addTransactionCapability(cacheable ? makeCacheableSignalKeyStore(base, logger) : base, logger, {
		maxCommitRetries: 1,
		delayBetweenTriesMs: 1
	})
	const auth: SignalAuthState = { creds, keys }

	return { auth, creds, repository: makeLibSignalRepository(auth, logger) }
}

const bundleOf = async (party: ReturnType<typeof makeParty>, preKeyId: number) => {
	const preKey = Curve.generateKeyPair()
	await party.auth.keys.set({ 'pre-key': { [preKeyId]: preKey } })

	return {
		registrationId: party.creds.registrationId,
		identityKey: generateSignalPubKey(party.creds.signedIdentityKey.public),
		preKey: { keyId: preKeyId, publicKey: generateSignalPubKey(preKey.public) },
		signedPreKey: {
			keyId: party.creds.signedPreKey.keyId,
			publicKey: generateSignalPubKey(party.creds.signedPreKey.keyPair.public),
			signature: party.creds.signedPreKey.signature
		}
	}
}

/**
 * pingpong drives encrypt and decrypt against the SAME peer session at once:
 * the pong for message N is enciphered while message N+1 is being deciphered.
 * If those two interleave badly the sending chain rewinds, and the peer rejects
 * the result with "message with old counter" — which is exactly what the
 * wabench server reported for this branch.
 */
describe('concurrent encrypt/decrypt on one session', () => {
	const aliceJid = '5511900000001@s.whatsapp.net'
	const bobJid = '5511900000002@s.whatsapp.net'

	const establish = async (cacheable: boolean) => {
		const alice = makeParty(cacheable)
		const bob = makeParty(cacheable)
		await alice.repository.injectE2ESession({ jid: bobJid, session: (await bundleOf(bob, 1)) as never })

		// One round trip so both sides hold a running session.
		const opener = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('open') })
		await bob.repository.decryptMessage({ jid: aliceJid, type: opener.type, ciphertext: opener.ciphertext })

		return { alice, bob }
	}

	it.each([
		['plain store', false],
		['cacheable store', true]
	])('keeps the sending chain monotonic under load (%s)', async (_label, cacheable) => {
		const { alice, bob } = await establish(cacheable as boolean)

		// Alice enciphers a burst concurrently, exactly like a client answering a
		// stream of pings without awaiting each send.
		const BURST = 40
		const sent = await Promise.all(
			Array.from({ length: BURST }, (_, i) =>
				alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from(`m${i}`) })
			)
		)

		// Every ciphertext must decrypt exactly once, in any order.
		const seen = new Set<string>()
		for (const [i, message] of sent.entries()) {
			const plaintext = await bob.repository.decryptMessage({
				jid: aliceJid,
				type: message.type,
				ciphertext: message.ciphertext
			})
			const text = Buffer.from(plaintext).toString()
			expect(seen.has(text)).toBe(false)
			seen.add(text)
			expect(text).toBe(`m${i}`)
		}

		expect(seen.size).toBe(BURST)
	})

	it('survives encrypt racing against decrypt on the same session', async () => {
		const { alice, bob } = await establish(true)

		// Bob sends towards Alice while Alice sends towards Bob: both sides run
		// encrypt and decrypt on the same session concurrently.
		const ROUNDS = 25
		const fromBob = await Promise.all(
			Array.from({ length: ROUNDS }, (_, i) =>
				bob.repository.encryptMessage({ jid: aliceJid, data: Buffer.from(`b${i}`) })
			)
		)

		const results = await Promise.all(
			fromBob.map(async (incoming, i) => {
				const [plaintext, outgoing] = await Promise.all([
					alice.repository.decryptMessage({
						jid: bobJid,
						type: incoming.type,
						ciphertext: incoming.ciphertext
					}),
					alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from(`pong${i}`) })
				])

				return { plaintext: Buffer.from(plaintext).toString(), outgoing }
			})
		)

		expect(results.map(r => r.plaintext).sort()).toEqual(fromBob.map((_, i) => `b${i}`).sort())

		// Bob must be able to read every pong Alice produced while decrypting.
		const pongs = new Set<string>()
		for (const { outgoing } of results) {
			const plaintext = await bob.repository.decryptMessage({
				jid: aliceJid,
				type: outgoing.type,
				ciphertext: outgoing.ciphertext
			})
			pongs.add(Buffer.from(plaintext).toString())
		}

		expect(pongs.size).toBe(ROUNDS)
	})
})

/**
 * The server periodically re-opens the session with a fresh prekey message
 * (6 per wabench run). Adopting it must not invalidate a pong that was being
 * enciphered at the same moment — the peer still has the old state archived and
 * expects to be able to read it.
 */
describe('session replacement mid-flight', () => {
	const aliceJid = '5511900000001@s.whatsapp.net'
	const bobJid = '5511900000002@s.whatsapp.net'

	it('keeps producing readable ciphertext while adopting an incoming prekey session', async () => {
		const alice = makeParty(true)
		const bob = makeParty(true)
		await alice.repository.injectE2ESession({ jid: bobJid, session: (await bundleOf(bob, 1)) as never })

		const opener = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('open') })
		await bob.repository.decryptMessage({ jid: aliceJid, type: opener.type, ciphertext: opener.ciphertext })

		// Bob re-establishes: he injects a brand new session towards Alice and
		// sends a pkmsg on it, while Alice keeps enciphering pongs.
		await bob.repository.injectE2ESession({ jid: aliceJid, session: (await bundleOf(alice, 2)) as never })
		const rekey = await bob.repository.encryptMessage({ jid: aliceJid, data: Buffer.from('rekey') })
		expect(rekey.type).toBe('pkmsg')

		const [pongBefore, plaintext, pongAfter] = await Promise.all([
			alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('pong-before') }),
			alice.repository.decryptMessage({ jid: bobJid, type: rekey.type, ciphertext: rekey.ciphertext }),
			alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('pong-after') })
		])

		expect(Buffer.from(plaintext).toString()).toBe('rekey')

		// Bob must read BOTH pongs: one may ride the archived session, one the new.
		const first = await bob.repository.decryptMessage({
			jid: aliceJid,
			type: pongBefore.type,
			ciphertext: pongBefore.ciphertext
		})
		expect(Buffer.from(first).toString()).toBe('pong-before')

		const second = await bob.repository.decryptMessage({
			jid: aliceJid,
			type: pongAfter.type,
			ciphertext: pongAfter.ciphertext
		})
		expect(Buffer.from(second).toString()).toBe('pong-after')
	})
})
