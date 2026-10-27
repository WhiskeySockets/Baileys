import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import { SessionRecord } from 'whatsapp-rust-bridge'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type {
	RecordRef,
	SignalAuthState,
	SignalDataSet,
	SignalDataTypeMap,
	SignalKeyStore,
	SignalKeyStoreWithRecordTransaction
} from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { Curve, generateSignalPubKey } from '../../Utils/crypto'

/**
 * The session path reads a snapshot, runs the protocol with no callbacks, and
 * lands every mutation in one write. These tests pin that shape from the
 * Baileys side: what the store sees, and when. A regression here means the
 * bridge is reaching back into JS mid-operation again — the re-entrancy that
 * made two scopes take the same records in opposite orders.
 */

const logger = P({ level: 'silent' })

const deferred = () => {
	let resolve!: () => void
	const promise = new Promise<void>(r => (resolve = r))
	return { promise, resolve }
}

type Call = { op: 'get' | 'set'; types: string[]; ids: string[] }

const makeRecordingStore = () => {
	const data: { [type: string]: { [id: string]: unknown } } = {}
	const calls: Call[] = []

	const store: SignalKeyStore = {
		get: async (type, ids) => {
			calls.push({ op: 'get', types: [type], ids: [...ids] })
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
			const types = Object.keys(update)
			calls.push({
				op: 'set',
				types,
				ids: types.flatMap(type => Object.keys(update[type as keyof SignalDataSet]!))
			})
			for (const type of types) {
				data[type] ||= {}
				const bucket = update[type as keyof SignalDataSet]!
				for (const id of Object.keys(bucket)) {
					const value = (bucket as Record<string, unknown>)[id]
					if (value === null) delete data[type][id]
					else data[type][id] = value
				}
			}
		}
	}

	return { store, calls, data }
}

const makeParty = () => {
	const creds = initAuthCreds()
	const recorder = makeRecordingStore()
	const keys = addTransactionCapability(recorder.store, logger, {
		maxCommitRetries: 1,
		delayBetweenTriesMs: 1
	})
	const auth: SignalAuthState = { creds, keys }

	return { auth, creds, recorder, repository: makeLibSignalRepository(auth, logger) }
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

const aliceJid = '1111111111@s.whatsapp.net'
const bobJid = '2222222222@s.whatsapp.net'

describe('snapshot session path', () => {
	it('lands an encrypt in a single write with no reads in between', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })

		alice.recorder.calls.length = 0
		await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('hello') })

		const writes = alice.recorder.calls.filter(call => call.op === 'set')
		expect(writes).toHaveLength(1)
		// The peer identity is already known and unchanged, so only the session is
		// written. Reporting it every time would rewrite that row once per device
		// on every message sent.
		expect(writes[0]!.types).toEqual(['session'])

		// Every read must precede the single write: a read after it would mean
		// the operation went back to storage mid-flight.
		const write = alice.recorder.calls.findIndex(call => call.op === 'set')
		expect(alice.recorder.calls.slice(write + 1).some(call => call.op === 'get')).toBe(false)
	})

	it('does not rewrite the peer identity once it is known', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })

		alice.recorder.calls.length = 0
		for (let index = 0; index < 4; index++) {
			await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from(`m${index}`) })
		}

		const identityWrites = alice.recorder.calls.filter(call => call.op === 'set' && call.types.includes('identity-key'))
		expect(identityWrites).toHaveLength(0)
	})

	it('deletes the consumed pre-key in the same write that stores the session', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 7) })
		const { ciphertext, type } = await alice.repository.encryptMessage({
			jid: bobJid,
			data: Buffer.from('hi')
		})
		expect(type).toBe('pkmsg')

		bob.recorder.calls.length = 0
		await bob.repository.decryptMessage({ jid: aliceJid, type, ciphertext })

		const writes = bob.recorder.calls.filter(call => call.op === 'set')
		expect(writes).toHaveLength(1)
		// Session and spent pre-key move together: a crash between them would
		// either strip a key the session still needs or leave it reusable.
		expect(writes[0]!.types.sort()).toEqual(['identity-key', 'pre-key', 'session'])
		expect(bob.recorder.data['pre-key']?.[7]).toBeUndefined()
	})

	it('reads the pre-key the incoming message names, not the whole keyspace', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 42) })
		const message = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('hi') })

		bob.recorder.calls.length = 0
		await bob.repository.decryptMessage({ jid: aliceJid, ...message })

		const preKeyReads = bob.recorder.calls.filter(call => call.op === 'get' && call.types[0] === 'pre-key')
		expect(preKeyReads).toHaveLength(1)
		expect(preKeyReads[0]!.ids).toEqual(['42'])
	})

	it('does not touch the pre-key store for a plain whisper message', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })
		const first = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('one') })
		await bob.repository.decryptMessage({ jid: aliceJid, ...first })

		const reply = await bob.repository.encryptMessage({ jid: aliceJid, data: Buffer.from('two') })
		expect(reply.type).toBe('msg')

		alice.recorder.calls.length = 0
		const plaintext = await alice.repository.decryptMessage({ jid: bobJid, ...reply })

		expect(Buffer.from(plaintext).toString()).toBe('two')
		expect(alice.recorder.calls.some(call => call.types.includes('pre-key'))).toBe(false)
	})

	it('stores the new session when the peer identity changes', async () => {
		// A reinstalled peer sends a prekey message under a new identity. The
		// store reports the old session as void AND the core builds a new one in
		// the same operation, so the write must land the new session rather than
		// the deletion.
		const alice = makeParty()
		const bob = makeParty()
		const bobAgain = makeParty()

		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })
		const first = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('one') })
		await bob.repository.decryptMessage({ jid: aliceJid, ...first })

		// bob reinstalls: same jid, brand new identity, and he opens a session to
		// alice from scratch.
		await bobAgain.repository.injectE2ESession({ jid: aliceJid, session: await bundleOf(alice, 9) })
		const fromNewBob = await bobAgain.repository.encryptMessage({
			jid: aliceJid,
			data: Buffer.from('it is me again')
		})

		alice.recorder.calls.length = 0
		const plaintext = await alice.repository.decryptMessage({ jid: bobJid, ...fromNewBob })

		expect(Buffer.from(plaintext).toString()).toBe('it is me again')
		// The row must hold the new session, not be deleted.
		expect(alice.recorder.data['session']?.['2222222222.0']).toBeDefined()
		// ...and the identity is rewritten, since this one really did change.
		const writes = alice.recorder.calls.filter(call => call.op === 'set')
		expect(writes.some(call => call.types.includes('identity-key'))).toBe(true)

		// The session must still work afterwards.
		const reply = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('welcome back') })
		const received = await bobAgain.repository.decryptMessage({ jid: aliceJid, ...reply })
		expect(Buffer.from(received).toString()).toBe('welcome back')
	})

	it('rebuilds from a prekey message when the stored session is unreadable', async () => {
		// A corrupt row used to be raised on read, so every retry failed and the
		// conversation stayed stuck until someone deleted it by hand. A prekey
		// message carries everything needed to build a replacement.
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })
		const opener = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('hello') })

		const corrupt = Uint8Array.from([9, 9, 9, 9])
		bob.recorder.data['session'] = { '1111111111.0': corrupt }

		const plaintext = await bob.repository.decryptMessage({ jid: aliceJid, ...opener })
		expect(Buffer.from(plaintext).toString()).toBe('hello')

		// Decrypting is half of it: the rebuilt session has to land, or the next
		// message hits the same bad row and nothing was actually recovered.
		const stored = bob.recorder.data['session']!['1111111111.0']
		expect(stored).not.toEqual(corrupt)
		expect(stored).toBeInstanceOf(Uint8Array)
		if (!(stored instanceof Uint8Array)) throw new Error('Expected a canonical session')
		expect(SessionRecord.deserialize(stored).haveOpenSession()).toBe(true)
		// ...and the pre-key the message consumed is gone, as on the normal path.
		expect(bob.recorder.data['pre-key']?.[1]).toBeUndefined()

		// The recovered session carries the conversation on its own.
		const reply = await bob.repository.encryptMessage({ jid: aliceJid, data: Buffer.from('back') })
		expect(Buffer.from(await alice.repository.decryptMessage({ jid: bobJid, ...reply })).toString()).toBe('back')
	})

	it('still refuses a whisper message when the stored session is unreadable', async () => {
		// Without a prekey there is nothing to rebuild from, so the failure has
		// to surface rather than silently start a session that decrypts nothing.
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })
		const opener = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('one') })
		await bob.repository.decryptMessage({ jid: aliceJid, ...opener })
		const second = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('two') })

		bob.recorder.data['session'] = { '1111111111.0': Uint8Array.from([9, 9, 9, 9]) }

		await expect(bob.repository.decryptMessage({ jid: aliceJid, ...second })).rejects.toThrow()
	})

	it('leaves storage untouched when the operation fails', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })
		const message = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('hi') })

		const corrupted = Uint8Array.from(message.ciphertext)
		corrupted[corrupted.length - 1] = corrupted[corrupted.length - 1]! ^ 0xff

		bob.recorder.calls.length = 0
		await expect(
			bob.repository.decryptMessage({ jid: aliceJid, type: message.type, ciphertext: corrupted })
		).rejects.toThrow()

		// A failed operation reports no changes, so nothing may be written —
		// half-applied state is what corrupts a session.
		expect(bob.recorder.calls.filter(call => call.op === 'set')).toHaveLength(0)
		expect(bob.recorder.data['session']).toBeUndefined()
	})

	it('locks the identity and session rows in the same transaction', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })
		const keys = alice.auth.keys as SignalKeyStoreWithRecordTransaction
		const wireJid = '2222222222.0'
		const locked = deferred()
		const release = deferred()
		const holding = keys.transactWith({ records: [{ type: 'identity-key', id: wireJid }] }, () => {
			locked.resolve()
			return release.promise
		})
		await locked.promise

		const attempted = deferred()
		const scopes: (readonly RecordRef[])[] = []
		const transactWith = keys.transactWith
		keys.transactWith = (scope, work) => {
			scopes.push(scope.records)
			attempted.resolve()
			return transactWith(scope, work)
		}

		const encrypting = alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('blocked') })
		try {
			await attempted.promise
			expect(scopes[0]).toEqual(
				expect.arrayContaining([
					{ type: 'session', id: wireJid },
					{ type: 'identity-key', id: wireJid }
				])
			)
		} finally {
			release.resolve()
			await Promise.all([holding, encrypting])
			keys.transactWith = transactWith
		}
	})

	it('rejects an encrypt when persistence fails and retries from the durable session', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })
		const before = JSON.stringify(alice.recorder.data)
		const set = alice.recorder.store.set
		alice.recorder.store.set = async () => {
			throw new Error('persistence unavailable')
		}

		try {
			await expect(alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('retry') })).rejects.toThrow(
				'persistence unavailable'
			)
			expect(JSON.stringify(alice.recorder.data)).toBe(before)
		} finally {
			alice.recorder.store.set = set
		}

		const outgoing = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('retry') })
		expect(Buffer.from(await bob.repository.decryptMessage({ jid: aliceJid, ...outgoing })).toString()).toBe('retry')
	})

	it('keeps the session, identity and pre-key unchanged when decrypt persistence fails', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })
		const outgoing = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('retry decrypt') })
		const before = JSON.stringify(bob.recorder.data)
		const set = bob.recorder.store.set
		bob.recorder.store.set = async () => {
			throw new Error('persistence unavailable')
		}

		try {
			await expect(bob.repository.decryptMessage({ jid: aliceJid, ...outgoing })).rejects.toThrow(
				'persistence unavailable'
			)
			expect(JSON.stringify(bob.recorder.data)).toBe(before)
		} finally {
			bob.recorder.store.set = set
		}

		expect(Buffer.from(await bob.repository.decryptMessage({ jid: aliceJid, ...outgoing })).toString()).toBe(
			'retry decrypt'
		)
	})

	it('keeps the chain monotonic when encrypts overlap on one session', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })

		const produced = await Promise.all(
			Array.from({ length: 8 }, (_, index) =>
				alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from(`m${index}`) })
			)
		)

		// Two encrypts reading the same session state would reuse a chain index
		// and repeat a ciphertext — the failure the server reports as
		// "message with old counter".
		const distinct = new Set(produced.map(out => Buffer.from(out.ciphertext).toString('base64')))
		expect(distinct.size).toBe(produced.length)
	})

	it('delivers every message when encrypt and decrypt interleave on one session', async () => {
		const alice = makeParty()
		const bob = makeParty()
		await alice.repository.injectE2ESession({ jid: bobJid, session: await bundleOf(bob, 1) })

		const opening = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('open') })
		await bob.repository.decryptMessage({ jid: aliceJid, ...opening })

		// bob answers while still deciphering what alice sends: both directions
		// hit the same record at once.
		const inbound: Promise<unknown>[] = []
		const outbound: Promise<unknown>[] = []
		for (let index = 0; index < 6; index++) {
			outbound.push(bob.repository.encryptMessage({ jid: aliceJid, data: Buffer.from(`pong${index}`) }))
			inbound.push(
				alice.repository
					.encryptMessage({ jid: bobJid, data: Buffer.from(`ping${index}`) })
					.then(message => bob.repository.decryptMessage({ jid: aliceJid, ...message }))
			)
		}

		const received = (await Promise.all(inbound)) as Uint8Array[]
		expect(received.map(plaintext => Buffer.from(plaintext).toString()).sort()).toEqual([
			'ping0',
			'ping1',
			'ping2',
			'ping3',
			'ping4',
			'ping5'
		])

		const replies = (await Promise.all(outbound)) as { type: 'pkmsg' | 'msg'; ciphertext: Uint8Array }[]
		const decoded = await Promise.all(
			replies.map(reply =>
				alice.repository.decryptMessage({ jid: bobJid, type: reply.type, ciphertext: reply.ciphertext })
			)
		)
		expect(decoded.map(plaintext => Buffer.from(plaintext).toString()).sort()).toEqual([
			'pong0',
			'pong1',
			'pong2',
			'pong3',
			'pong4',
			'pong5'
		])
	})
})
