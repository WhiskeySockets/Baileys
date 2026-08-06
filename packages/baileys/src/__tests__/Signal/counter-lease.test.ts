import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState, SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { Curve, generateSignalPubKey } from '../../Utils/crypto'

/**
 * The core leases outbound counters ahead of durability, and the record shape
 * we persist has nowhere to carry that ceiling: every export materializes the
 * reservation, so each send would jump a whole batch. The bridge waives the
 * lease because it hands the changeset back before the ciphertext is sent.
 *
 * These cases read the counter off the wire rather than the stored record: it
 * is the counter the peer has to follow, and a record that looks consecutive
 * while the wire jumps would still strand the conversation.
 */
const logger = P({ level: 'silent' })

const makeParty = () => {
	const creds = initAuthCreds()
	const data: { [type: string]: { [id: string]: unknown } } = {}
	const store: SignalKeyStore = {
		get: async (type, ids) => {
			const bucket = data[type] || {}
			const out: { [id: string]: SignalDataTypeMap[typeof type] } = {}
			for (const id of ids) {
				if (bucket[id] !== undefined && bucket[id] !== null) out[id] = bucket[id] as never
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

	const auth: SignalAuthState = {
		creds,
		keys: addTransactionCapability(store, logger, { maxCommitRetries: 1, delayBetweenTriesMs: 1 })
	}

	return { auth, creds, data, repository: makeLibSignalRepository(auth, logger) }
}

/** Length-delimited field of a protobuf carrying a leading version byte. */
const field = (buf: Uint8Array, want: number): Uint8Array | undefined => {
	let i = 1
	while (i < buf.length) {
		const tag = buf[i++]!
		if ((tag & 7) === 2) {
			let len = 0
			let shift = 0
			for (;;) {
				const byte = buf[i++]!
				len |= (byte & 0x7f) << shift
				shift += 7
				if (!(byte & 0x80)) break
			}

			if (tag >> 3 === want) return buf.subarray(i, i + len)
			i += len
		} else if ((tag & 7) === 0) {
			while (buf[i++]! & 0x80);
		} else return undefined
	}

	return undefined
}

/** WhisperMessage.counter, field 2. */
const counterOf = (ciphertext: Uint8Array): number => {
	let i = 1
	while (i < ciphertext.length) {
		const tag = ciphertext[i++]!
		if ((tag & 7) === 0) {
			let value = 0
			let shift = 0
			for (;;) {
				const byte = ciphertext[i++]!
				value |= (byte & 0x7f) << shift
				shift += 7
				if (!(byte & 0x80)) break
			}

			if (tag >> 3 === 2) return value
		} else if ((tag & 7) === 2) {
			let len = 0
			let shift = 0
			for (;;) {
				const byte = ciphertext[i++]!
				len |= (byte & 0x7f) << shift
				shift += 7
				if (!(byte & 0x80)) break
			}

			i += len
		} else return -1
	}

	return -1
}

const aliceJid = '1111111111@s.whatsapp.net'
const bobJid = '2222222222@s.whatsapp.net'
const groupJid = '120363000000000001@g.us'

const establish = async (alice: ReturnType<typeof makeParty>, bob: ReturnType<typeof makeParty>) => {
	const preKey = Curve.generateKeyPair()
	await bob.auth.keys.set({ 'pre-key': { 1: preKey } })
	await alice.repository.injectE2ESession({
		jid: bobJid,
		session: {
			registrationId: bob.creds.registrationId,
			identityKey: generateSignalPubKey(bob.creds.signedIdentityKey.public),
			preKey: { keyId: 1, publicKey: generateSignalPubKey(preKey.public) },
			signedPreKey: {
				keyId: bob.creds.signedPreKey.keyId,
				publicKey: generateSignalPubKey(bob.creds.signedPreKey.keyPair.public),
				signature: bob.creds.signedPreKey.signature
			}
		} as never
	})
}

describe('outbound counters across operations', () => {
	it('advances one per message instead of a batch', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await establish(alice, bob)

		const counters: number[] = []
		for (let index = 0; index < 6; index++) {
			const { ciphertext, type } = await alice.repository.encryptMessage({
				jid: bobJid,
				data: Buffer.from(`m${index}`)
			})
			// Every send is its own operation, which is what used to burn a batch.
			counters.push(counterOf(type === 'pkmsg' ? field(ciphertext, 4)! : ciphertext))
		}

		expect(counters).toEqual([0, 1, 2, 3, 4, 5])
	})

	it('leaves the peer with no skipped keys to buffer', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await establish(alice, bob)

		for (let index = 0; index < 6; index++) {
			const message = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from(`m${index}`) })
			const plaintext = await bob.repository.decryptMessage({
				jid: aliceJid,
				type: message.type as 'msg' | 'pkmsg',
				ciphertext: message.ciphertext
			})
			expect(Buffer.from(plaintext).toString()).toBe(`m${index}`)
		}

		// A batch-sized gap made the peer derive 63 keys per message, which is
		// what grew the row until it no longer fit the legacy shape.
		const record = bob.data.session!['1111111111.0'] as { _sessions: Record<string, unknown> }
		const skipped = Object.values(record._sessions).flatMap(session =>
			Object.values((session as { _chains: Record<string, { messageKeys?: object }> })._chains).map(
				chain => Object.keys(chain.messageKeys ?? {}).length
			)
		)

		expect(Math.max(...skipped)).toBe(0)
	})

	it('advances group iterations one per message', async () => {
		const alice = makeParty()
		const bob = makeParty()

		const skdm = await alice.repository.getSenderKeyDistributionMessage({ group: groupJid, meId: aliceJid })
		await bob.repository.processSenderKeyDistributionMessage({
			authorJid: aliceJid,
			item: { groupId: groupJid, axolotlSenderKeyDistributionMessage: skdm } as never
		})

		for (let index = 0; index < 6; index++) {
			const sent = await alice.repository.encryptGroupMessage({
				group: groupJid,
				meId: aliceJid,
				data: Buffer.from(`g${index}`)
			})
			const plaintext = await bob.repository.decryptGroupMessage({
				group: groupJid,
				authorJid: aliceJid,
				msg: sent.ciphertext
			})
			expect(Buffer.from(plaintext).toString()).toBe(`g${index}`)
		}

		const [key] = Object.keys(alice.data['sender-key']!)
		const [state] = JSON.parse(Buffer.from(alice.data['sender-key']![key!] as Uint8Array).toString())

		expect(state.senderChainKey.iteration).toBe(6)
	})

	it('keeps the stored row in the legacy shape as the conversation runs', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await establish(alice, bob)

		for (let index = 0; index < 40; index++) {
			const message = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from(`m${index}`) })
			await bob.repository.decryptMessage({
				jid: aliceJid,
				type: message.type as 'msg' | 'pkmsg',
				ciphertext: message.ciphertext
			})
		}

		// With the lease materialised this row passed MAX_LEGACY_MESSAGE_KEYS
		// around the 32nd message and fell back to bridge bytes, which is the
		// rollback guarantee going away.
		const stored = bob.data.session!['1111111111.0']
		expect(ArrayBuffer.isView(stored)).toBe(false)
		expect(JSON.stringify(stored).length).toBeLessThan(20_000)
	})
})
