// @ts-ignore libsignal does not publish declarations for its protobuf helpers
import { PreKeyWhisperMessage } from 'libsignal/src/protobufs'
import P from 'pino'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { AuthenticationState, SignalDataTypeMap, SignalKeyStoreWithTransaction } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { generateSignalPubKey } from '../../Utils/crypto'

function authState(creds = initAuthCreds()) {
	const rows = new Map<string, unknown>()
	let rejectWrites = false
	const auth: AuthenticationState = {
		creds,
		keys: {
			get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => {
				const result: { [id: string]: SignalDataTypeMap[T] } = {}
				for (const id of ids) {
					const value = rows.get(`${type}/${id}`)
					if (value !== null && value !== undefined) result[id] = value as SignalDataTypeMap[T]
				}

				return result
			},
			set: async data => {
				if (rejectWrites) throw new Error('authored storage rejection')
				for (const [type, entries] of Object.entries(data))
					for (const [id, value] of Object.entries(entries)) {
						if (value === null || value === undefined) rows.delete(`${type}/${id}`)
						else rows.set(`${type}/${id}`, value)
					}
			}
		}
	}
	auth.keys = addTransactionCapability(auth.keys, P({ level: 'silent' }), {
		maxCommitRetries: 1,
		delayBetweenTriesMs: 0
	})
	return {
		auth,
		rows,
		rejectWrites: (value: boolean) => {
			rejectWrites = value
		}
	}
}

it('decrypts alternating chat and status ratchets from the same identity', async () => {
	const receiver = authState()
	const sender = authState()
	const statusSender = authState(sender.auth.creds)
	const logger = P({ level: 'silent' })
	const receiveRepo = makeLibSignalRepository(receiver.auth, logger)
	const sendRepos = [makeLibSignalRepository(sender.auth, logger), makeLibSignalRepository(statusSender.auth, logger)]
	const receiverJid = '100000000001:1@lid'
	const senderJid = '200000000002:2@s.whatsapp.net'
	const creds = receiver.auth.creds
	for (const repo of sendRepos)
		await repo.injectE2ESession({
			jid: receiverJid,
			session: {
				registrationId: creds.registrationId,
				identityKey: generateSignalPubKey(creds.signedIdentityKey.public),
				signedPreKey: {
					keyId: creds.signedPreKey.keyId,
					publicKey: generateSignalPubKey(creds.signedPreKey.keyPair.public),
					signature: creds.signedPreKey.signature
				}
			}
		})
	for (let i = 0; i < 4; i++) {
		const status = i % 2 === 1
		const plaintext = Buffer.from(`authored ${i}`)
		const encrypted = await sendRepos[i % 2]!.encryptMessage({ jid: receiverJid, data: plaintext })
		const decrypted = await receiveRepo.decryptMessage({
			jid: senderJid,
			...encrypted,
			...(status ? { sessionScope: 'status' as const } : {})
		})
		expect(Buffer.from(decrypted)).toEqual(plaintext)
	}

	const address = receiveRepo.jidToSignalProtocolAddress(senderJid)
	expect(receiver.rows.has(`session/${address}`)).toBe(true)
	expect(receiver.rows.has(`session/${address}_status`)).toBe(true)
	const lid = '300000000003:2@lid'
	receiver.rows.set('device-list/200000000002', ['2'])
	expect(await receiveRepo.migrateSession(senderJid, lid)).toEqual({ migrated: 1, skipped: 0, total: 1 })
	const lidAddress = receiveRepo.jidToSignalProtocolAddress(lid)
	expect(receiver.rows.has(`session/${address}`)).toBe(false)
	expect(receiver.rows.has(`session/${address}_status`)).toBe(false)
	expect(receiver.rows.has(`session/${lidAddress}`)).toBe(true)
	expect(receiver.rows.has(`session/${lidAddress}_status`)).toBe(true)
	await receiveRepo.lidMapping.storeLIDPNMappings([{ pn: senderJid, lid }])
	await receiveRepo.deleteSession([senderJid])
	expect(receiver.rows.has(`session/${lidAddress}`)).toBe(false)
	expect(receiver.rows.has(`session/${lidAddress}_status`)).toBe(false)
	expect(receiver.rows.has(`session/${address}`)).toBe(false)
	expect(receiver.rows.has(`session/${address}_status`)).toBe(false)
	// Assert the identity remains shared; deleting sessions is not an identity reset.
	expect(receiver.rows.has(`identity-key/${address}`)).toBe(true)
})

it('rolls back identity replacement and both session resets when status decryption rejects', async () => {
	const receiver = authState()
	const sender = authState()
	const logger = P({ level: 'silent' })
	const repo = makeLibSignalRepository(receiver.auth, logger)
	const peer = makeLibSignalRepository(sender.auth, logger)
	const receiverJid = '100000000001:1@lid'
	const senderJid = '200000000002:2@lid'
	const creds = receiver.auth.creds
	await peer.injectE2ESession({
		jid: receiverJid,
		session: {
			registrationId: creds.registrationId,
			identityKey: generateSignalPubKey(creds.signedIdentityKey.public),
			signedPreKey: {
				keyId: creds.signedPreKey.keyId,
				publicKey: generateSignalPubKey(creds.signedPreKey.keyPair.public),
				signature: creds.signedPreKey.signature
			}
		}
	})
	const encrypted = await peer.encryptMessage({ jid: receiverJid, data: Buffer.from('authored rejected status') })
	const address = repo.jidToSignalProtocolAddress(senderJid)
	receiver.rows.set(`identity-key/${address}`, Buffer.alloc(33, 9))
	receiver.rows.set(`session/${address}`, Buffer.from('existing chat state'))
	receiver.rows.set(`session/${address}_status`, Buffer.from('existing status state'))
	const before = new Map(receiver.rows)
	const prekey = PreKeyWhisperMessage.decode(encrypted.ciphertext.subarray(1))
	prekey.message[prekey.message.length - 1] ^= 1
	const ciphertext = Buffer.concat([encrypted.ciphertext.subarray(0, 1), PreKeyWhisperMessage.encode(prekey).finish()])
	await expect(
		repo.decryptMessage({ jid: senderJid, ...encrypted, ciphertext, sessionScope: 'status' })
	).rejects.toThrow()
	expect(receiver.rows).toEqual(before)
})

it('refuses scoped status decryption before calling an unsupported custom repository', async () => {
	const { decryptMessageNode } = await import('../../Utils/decode-wa-message')
	const logger = P({ level: 'silent' })
	const repo = makeLibSignalRepository(authState().auth, logger)
	repo.supportsStatusSessions = false
	let called = false
	repo.decryptMessage = async () => {
		called = true
		throw new Error('must not be called')
	}

	const received = decryptMessageNode(
		{
			tag: 'status',
			attrs: { from: 'status@broadcast', participant: '200000000002:2@lid', id: 'authored-unsupported' },
			content: [
				{ tag: 'meta', attrs: { session_scope: 'status' } },
				{ tag: 'enc', attrs: { type: 'pkmsg', v: '2' }, content: Buffer.from('authored') }
			]
		},
		'100000000001@s.whatsapp.net',
		'100000000002@lid',
		repo,
		logger
	)
	await received.decrypt()
	expect(called).toBe(false)
	expect(received.fullMessage.messageStubParameters).toEqual(['Signal repository does not support status sessions'])
})

it('deletes a device batch atomically without starting a remote identity lookup', async () => {
	const receiver = authState()
	let lookups = 0
	const repo = makeLibSignalRepository(receiver.auth, P({ level: 'silent' }), async () => {
		lookups++
		throw new Error('lookup must not run')
	})
	const pn = '200000000002:2@s.whatsapp.net'
	const lid = '300000000003:2@lid'
	const other = '400000000004:3@s.whatsapp.net'
	receiver.rows.set('lid-mapping/200000000002', '300000000003')
	const addresses = [pn, lid, other].flatMap(jid => {
		const addr = repo.jidToSignalProtocolAddress(jid)
		return [addr, `${addr}_status`]
	})
	for (const address of addresses) receiver.rows.set(`session/${address}`, Buffer.from('authored retained state'))
	const before = new Map(receiver.rows)
	receiver.rejectWrites(true)
	await expect(repo.deleteSession([pn, other])).rejects.toThrow('authored storage rejection')
	expect(receiver.rows).toEqual(before)
	receiver.rejectWrites(false)
	await repo.deleteSession([pn, other])
	for (const address of addresses) expect(receiver.rows.has(`session/${address}`)).toBe(false)
	expect(lookups).toBe(0)
})

it('batch deletion drains ordinary per-device transactions before committing', async () => {
	const receiver = authState()
	const keys = receiver.auth.keys as SignalKeyStoreWithTransaction
	const repo = makeLibSignalRepository(receiver.auth, P({ level: 'silent' }))
	const jids = ['200000000002:2@lid', '200000000002:3@lid']
	const addresses = jids.map(jid => repo.jidToSignalProtocolAddress(jid))
	for (const addr of addresses) {
		receiver.rows.set(`session/${addr}`, Buffer.from('authored chat state'))
		receiver.rows.set(`session/${addr}_status`, Buffer.from('authored status state'))
	}

	let signalRead!: () => void
	let releaseRead!: () => void
	const read = new Promise<void>(resolve => {
		signalRead = resolve
	})
	const released = new Promise<void>(resolve => {
		releaseRead = resolve
	})
	const writer = keys.transaction(async () => {
		const old = await keys.get('session', [addresses[0]!])
		signalRead()
		await released
		await keys.set({ session: old })
	}, jids[0]!)
	await read
	let deleted = false
	const deletion = repo.deleteSession(jids).then(() => {
		deleted = true
	})
	await new Promise<void>(resolve => setImmediate(resolve))
	expect(deleted).toBe(false)
	releaseRead()
	await Promise.all([writer, deletion])
	for (const addr of addresses) {
		expect(receiver.rows.has(`session/${addr}`)).toBe(false)
		expect(receiver.rows.has(`session/${addr}_status`)).toBe(false)
	}
})

it('rejects exclusive upgrades and unqualified stores without mutating sessions', async () => {
	const receiver = authState()
	const keys = receiver.auth.keys as SignalKeyStoreWithTransaction
	const repo = makeLibSignalRepository(receiver.auth, P({ level: 'silent' }))
	const jid = '200000000002:2@lid'
	const addr = repo.jidToSignalProtocolAddress(jid)
	receiver.rows.set(`session/${addr}`, Buffer.from('authored retained state'))
	const before = new Map(receiver.rows)
	await expect(keys.transaction(() => repo.deleteSession([jid]), jid)).rejects.toThrow(
		'Cannot upgrade an active transaction to exclusive'
	)
	expect(receiver.rows).toEqual(before)
	keys.supportsExclusiveTransactions = false
	await expect(repo.deleteSession([jid])).rejects.toThrow('Key store does not support exclusive session deletion')
	expect(receiver.rows).toEqual(before)
})

it('keeps ordinary transactions concurrent and gives a queued exclusive writer priority', async () => {
	const receiver = authState()
	const keys = receiver.auth.keys as SignalKeyStoreWithTransaction
	const entered: string[] = []
	let releaseReaders!: () => void
	const readersReleased = new Promise<void>(resolve => {
		releaseReaders = resolve
	})
	let releaseWriter!: () => void
	const writerReleased = new Promise<void>(resolve => {
		releaseWriter = resolve
	})
	const readers = ['one', 'two'].map(key =>
		keys.transaction(async () => {
			entered.push(key)
			await readersReleased
		}, key)
	)
	await new Promise<void>(resolve => setImmediate(resolve))
	expect(entered).toEqual(['one', 'two'])
	const writer = keys.transaction(
		async () => {
			entered.push('exclusive')
			await writerReleased
			await keys.set({ session: { authored: Buffer.from('committed') } })
		},
		'writer',
		{ exclusive: true }
	)
	const later = keys.transaction(async () => {
		entered.push('later')
		expect((await keys.get('session', ['authored'])).authored).toEqual(Buffer.from('committed'))
	}, 'three')
	await new Promise<void>(resolve => setImmediate(resolve))
	expect(entered).toEqual(['one', 'two'])
	releaseReaders()
	await Promise.all(readers)
	await new Promise<void>(resolve => setImmediate(resolve))
	expect(entered).toEqual(['one', 'two', 'exclusive'])
	releaseWriter()
	await Promise.all([writer, later])
	expect(entered).toEqual(['one', 'two', 'exclusive', 'later'])
})

it('preserves independently established destination sessions during migration in both scopes', async () => {
	const source = authState()
	const peer = authState()
	const repo = makeLibSignalRepository(source.auth, P({ level: 'silent' }))
	const pn = '200000000002:2@s.whatsapp.net'
	const lid = '300000000003:2@lid'
	const creds = peer.auth.creds
	await repo.injectE2ESession({
		jid: pn,
		session: {
			registrationId: creds.registrationId,
			identityKey: generateSignalPubKey(creds.signedIdentityKey.public),
			signedPreKey: {
				keyId: creds.signedPreKey.keyId,
				publicKey: generateSignalPubKey(creds.signedPreKey.keyPair.public),
				signature: creds.signedPreKey.signature
			}
		}
	})
	const from = repo.jidToSignalProtocolAddress(pn)
	const to = repo.jidToSignalProtocolAddress(lid)
	source.rows.set('device-list/200000000002', ['2'])
	source.rows.set(`session/${from}_status`, source.rows.get(`session/${from}`))
	for (const suffix of ['', '_status'])
		source.rows.set(`session/${to}${suffix}`, Buffer.from(`authored destination ${suffix}`))
	const before = new Map(source.rows)
	expect(await repo.migrateSession(pn, lid)).toEqual({ migrated: 0, skipped: 1, total: 1 })
	expect(source.rows).toEqual(before)
})
