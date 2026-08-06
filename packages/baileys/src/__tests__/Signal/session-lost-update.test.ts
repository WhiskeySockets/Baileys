import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type {
	SignalAuthState,
	SignalDataSet,
	SignalDataTypeMap,
	SignalKeyStore,
	SignalKeyStoreWithTransaction
} from '../../Types'
import { addTransactionCapability, initAuthCreds, makeCacheableSignalKeyStore } from '../../Utils/auth-utils'
import { Curve, generateSignalPubKey } from '../../Utils/crypto'

const logger = P({ level: 'silent' })

const deferred = () => {
	let resolve!: () => void
	const promise = new Promise<void>(r => {
		resolve = r
	})

	return { promise, resolve }
}

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

const makeParty = () => {
	const creds = initAuthCreds()
	const keys = addTransactionCapability(makeCacheableSignalKeyStore(makeMemoryKeyStore(), logger), logger, {
		maxCommitRetries: 1,
		delayBetweenTriesMs: 1
	})
	const auth: SignalAuthState = { creds, keys }

	return { auth, creds, keys: keys as SignalKeyStoreWithTransaction, repository: makeLibSignalRepository(auth, logger) }
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
 * `relayMessage` wraps sending in `transaction(meId)`, and `encryptMessage`
 * opens a nested `transactWith({session})` inside it. A nested transactWith
 * shares the OUTER context: it takes the session lock, buffers its write into
 * the outer accumulator, then RELEASES the lock — while the write is still
 * uncommitted.
 *
 * The decrypt path runs outside that outer transaction. It can therefore take
 * the just-released session lock, read the pre-encrypt session from the store,
 * advance it and commit — and then the outer transaction commits the encrypt's
 * buffered write on top, rewinding the chain.
 *
 * That rewind is what the peer reports as `message with old counter N / 0`,
 * which is exactly what the wabench server logged for this branch under load.
 */
describe('session lost update between relayMessage and the decrypt path', () => {
	const aliceJid = '5511900000001@s.whatsapp.net'
	const bobJid = '5511900000002@s.whatsapp.net'
	const meId = 'alice-device'

	const establish = async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: (await bundleOf(bob, 1)) as never })

		const opener = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('open') })
		await bob.repository.decryptMessage({ jid: aliceJid, type: opener.type, ciphertext: opener.ciphertext })

		// Bob replies so Alice has something inbound to decrypt mid-send.
		const inbound = await bob.repository.encryptMessage({ jid: aliceJid, data: Buffer.from('inbound') })

		return { alice, bob, inbound }
	}

	it('does not rewind the sending chain when a decrypt lands mid-transaction', async () => {
		const { alice, bob, inbound } = await establish()

		const encryptDone = deferred()
		const releaseOuter = deferred()

		// Mirror relayMessage: an outer transaction keyed by meId that stays open
		// after the nested encrypt has already released the session lock.
		const sending = alice.keys.transaction(async () => {
			const outgoing = await alice.repository.encryptMessage({
				jid: bobJid,
				data: Buffer.from('sent-inside-transaction')
			})
			encryptDone.resolve()
			await releaseOuter.promise
			return outgoing
		}, meId)

		// The decrypt path is NOT inside that transaction.
		await encryptDone.promise
		const plaintext = await alice.repository.decryptMessage({
			jid: bobJid,
			type: inbound.type,
			ciphertext: inbound.ciphertext
		})
		expect(Buffer.from(plaintext).toString()).toBe('inbound')

		releaseOuter.resolve()
		const outgoing = await sending

		// The peer must still be able to read what Alice sent. If the outer
		// commit clobbered the session the decrypt advanced, this ciphertext
		// rides a rewound chain and Bob rejects it.
		const received = await bob.repository.decryptMessage({
			jid: aliceJid,
			type: outgoing.type,
			ciphertext: outgoing.ciphertext
		})
		expect(Buffer.from(received).toString()).toBe('sent-inside-transaction')
	})

	it('keeps the session usable for the NEXT send after the interleave', async () => {
		const { alice, bob, inbound } = await establish()

		const encryptDone = deferred()
		const releaseOuter = deferred()

		const sending = alice.keys.transaction(async () => {
			const outgoing = await alice.repository.encryptMessage({
				jid: bobJid,
				data: Buffer.from('first')
			})
			encryptDone.resolve()
			await releaseOuter.promise
			return outgoing
		}, meId)

		await encryptDone.promise
		await alice.repository.decryptMessage({
			jid: bobJid,
			type: inbound.type,
			ciphertext: inbound.ciphertext
		})

		releaseOuter.resolve()
		const first = await sending

		// A follow-up send must continue the chain rather than restart it.
		const second = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('second') })

		const firstRead = await bob.repository.decryptMessage({
			jid: aliceJid,
			type: first.type,
			ciphertext: first.ciphertext
		})
		expect(Buffer.from(firstRead).toString()).toBe('first')

		const secondRead = await bob.repository.decryptMessage({
			jid: aliceJid,
			type: second.type,
			ciphertext: second.ciphertext
		})
		expect(Buffer.from(secondRead).toString()).toBe('second')
	})
})
