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

it.each([false, true])('refuses unsupported scoped decryption with compound=%s', async compound => {
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
				{ tag: 'enc', attrs: { type: 'pkmsg', v: '2' }, content: Buffer.from('authored') },
				...(compound
					? [{ tag: 'enc', attrs: { type: 'skmsg', v: '2' }, content: Buffer.from('authored failing group') }]
					: [])
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

it('resolves each pairwise address once before admission and keeps lookups outside crypto transactions', async () => {
	const receiver = authState()
	const sender = authState()
	const logger = P({ level: 'silent' })
	const receiveRepo = makeLibSignalRepository(receiver.auth, logger)
	const sendRepo = makeLibSignalRepository(sender.auth, logger)
	const receiverJid = '100000000001:1@s.whatsapp.net'
	const senderJid = '200000000002:2@s.whatsapp.net'
	const resolvedReceiver = '300000000003:1@lid'
	const resolvedSender = '400000000004:2@lid'
	let calls = 0

	for (const [repo, state, resolved] of [
		[sendRepo, sender, resolvedReceiver],
		[receiveRepo, receiver, resolvedSender]
	] as const) {
		repo.lidMapping.getLIDForPN = async () => {
			expect((state.auth.keys as SignalKeyStoreWithTransaction).isInTransaction()).toBe(false)
			calls++
			return resolved
		}
	}

	const creds = receiver.auth.creds
	await sendRepo.injectE2ESession({
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
	expect(calls).toBe(1)
	const plaintext = Buffer.from('authored pinned address')
	const encrypted = await sendRepo.encryptMessage({ jid: receiverJid, data: plaintext })
	expect(calls).toBe(2)
	expect(
		Buffer.from(await receiveRepo.decryptMessage({ jid: senderJid, ...encrypted, sessionScope: 'status' }))
	).toEqual(plaintext)
	expect(calls).toBe(3)
	const addr = receiveRepo.jidToSignalProtocolAddress(resolvedSender)
	expect(receiver.rows.has(`session/${addr}_status`)).toBe(true)
	expect(receiver.rows.has(`session/${receiveRepo.jidToSignalProtocolAddress(senderJid)}_status`)).toBe(false)
	expect((await receiveRepo.validateSession(senderJid, 'status')).exists).toBe(true)
	expect((await receiveRepo.validateSession(senderJid)).exists).toBe(false)
})

it.each([false, true])('discovers a later status session after chat migration, hosted=%s', async hosted => {
	const source = authState()
	const peer = authState()
	const repo = makeLibSignalRepository(source.auth, P({ level: 'silent' }))
	const pn = hosted ? '200000000002:99@hosted' : '200000000002:2@s.whatsapp.net'
	const lid = hosted ? '300000000003:99@hosted.lid' : '300000000003:2@lid'
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
	const retained = source.rows.get(`session/${from}`)
	source.rows.set('device-list/200000000002', [hosted ? '99' : '2'])
	expect(await repo.migrateSession(pn, lid)).toEqual({ migrated: 1, skipped: 0, total: 1 })
	const migrated = source.rows.get(`session/${to}`)
	source.rows.set(`session/${from}_status`, retained)
	expect(await repo.migrateSession(pn, lid)).toEqual({ migrated: 1, skipped: 0, total: 1 })
	expect(source.rows.has(`session/${from}_status`)).toBe(false)
	expect(source.rows.has(`session/${to}_status`)).toBe(true)
	expect(source.rows.get(`session/${to}`)).toEqual(migrated)
})

it.each(['default', 'status'] as const)('deletes only the selected %s retry namespace', async scope => {
	const receiver = authState()
	const repo = makeLibSignalRepository(receiver.auth, P({ level: 'silent' }))
	const pn = '200000000002:2@s.whatsapp.net',
		lid = '300000000003:2@lid'
	await repo.lidMapping.storeLIDPNMappings([{ pn, lid }])
	const addresses = [pn, lid].map(jid => repo.jidToSignalProtocolAddress(jid))
	for (const address of addresses) {
		receiver.rows.set(`session/${address}`, Buffer.from('authored chat ratchet'))
		receiver.rows.set(`session/${address}_status`, Buffer.from('authored status ratchet'))
	}

	// Keep the fixture callable against the previous one-argument runtime too.
	const deleteScoped = repo.deleteSession as (jids: string[], selected: 'default' | 'status') => Promise<void>
	await deleteScoped([pn], scope)
	for (const address of addresses) {
		expect(receiver.rows.has(`session/${address}`)).toBe(scope === 'status')
		expect(receiver.rows.has(`session/${address}_status`)).toBe(scope === 'default')
	}
})

it('rejects an unknown session deletion scope without changing retained state', async () => {
	const receiver = authState()
	const repo = makeLibSignalRepository(receiver.auth, P({ level: 'silent' }))
	const pn = '200000000002:2@s.whatsapp.net'
	receiver.rows.set(`session/${repo.jidToSignalProtocolAddress(pn)}`, Buffer.from('authored chat ratchet'))
	const before = new Map(receiver.rows)
	const deleteScoped = repo.deleteSession as (jids: string[], selected: 'status') => Promise<void>
	await expect(deleteScoped([pn], 'future' as 'status')).rejects.toThrow('Unsupported session deletion scope')
	expect(receiver.rows).toEqual(before)
})

it('refuses direct scoped calls before lookup when exclusive admission is unavailable', async () => {
	const receiver = authState()
	;(receiver.auth.keys as SignalKeyStoreWithTransaction).supportsExclusiveTransactions = false
	const repo = makeLibSignalRepository(receiver.auth, P({ level: 'silent' }))
	let lookedUp = false
	repo.lidMapping.getLIDForPN = async () => {
		lookedUp = true
		throw new Error('lookup must not run')
	}

	const before = new Map(receiver.rows)
	expect(repo.supportsStatusSessions).toBe(false)
	await expect(
		repo.decryptMessage({
			jid: '200000000002:2@s.whatsapp.net',
			type: 'pkmsg',
			ciphertext: Buffer.from('authored'),
			sessionScope: 'status'
		})
	).rejects.toThrow('Signal repository does not support status sessions')
	expect(lookedUp).toBe(false)
	expect(receiver.rows).toEqual(before)
})

it.each([
	[false, false, 'default'],
	[false, true, 'default'],
	[true, false, 'default'],
	[true, true, 'default'],
	[false, false, 'status'],
	[false, true, 'status'],
	[true, false, 'status'],
	[true, true, 'status']
] as const)(
	'retries address resolution across migration entry hosted=%s, decrypt hosted=%s, scope=%s',
	async (hostedEntry, hostedDecrypt, scope) => {
		const receiver = authState(),
			sender = authState()
		const receiveRepo = makeLibSignalRepository(receiver.auth, P({ level: 'silent' }))
		const sendRepo = makeLibSignalRepository(sender.auth, P({ level: 'silent' }))
		const receiverJid = '100000000001:1@lid',
			senderJid = hostedDecrypt ? '200000000002:99@hosted' : '200000000002:2@s.whatsapp.net',
			lid = hostedDecrypt ? '300000000003:99@hosted.lid' : '300000000003:2@lid'
		const scopeOptions = scope === 'status' ? { sessionScope: 'status' as const } : {}
		const creds = receiver.auth.creds
		await sendRepo.injectE2ESession({
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
		const first = await sendRepo.encryptMessage({ jid: receiverJid, data: Buffer.from('authored first') })
		await receiveRepo.decryptMessage({ jid: senderJid, ...first, ...scopeOptions })

		if (scope === 'default') {
			const reply = await receiveRepo.encryptMessage({ jid: senderJid, data: Buffer.from('authored reply') })
			await sendRepo.decryptMessage({ jid: receiverJid, ...reply })
		}

		const next = await sendRepo.encryptMessage({ jid: receiverJid, data: Buffer.from('authored after migration') })
		expect(next.type).toBe(scope === 'status' ? 'pkmsg' : 'msg')
		const originalLookup = receiveRepo.lidMapping.getLIDForPN.bind(receiveRepo.lidMapping)
		let enter!: () => void,
			release!: () => void,
			reads = 0
		const entered = new Promise<void>(resolve => {
			enter = resolve
		})
		const gate = new Promise<void>(resolve => {
			release = resolve
		})
		receiveRepo.lidMapping.getLIDForPN = async (...args) => {
			reads++
			const result = await originalLookup(...args)
			if (reads === 1) {
				enter()
				await gate
			}

			return result
		}

		const pending = receiveRepo.decryptMessage({ jid: senderJid, ...next, ...scopeOptions })
		try {
			await entered
			receiver.rows.set('device-list/200000000002', ['2', '99'])
			await receiveRepo.lidMapping.storeLIDPNMappings([{ pn: '200000000002@s.whatsapp.net', lid: '300000000003@lid' }])
			await receiveRepo.migrateSession(
				hostedEntry ? '200000000002:99@hosted' : '200000000002:2@s.whatsapp.net',
				hostedEntry ? '300000000003:99@hosted.lid' : '300000000003:2@lid'
			)
		} finally {
			release()
		}

		expect(Buffer.from(await pending).toString()).toBe('authored after migration')
		expect(reads).toBe(2)
		const suffix = scope === 'status' ? '_status' : ''
		expect(receiver.rows.has(`session/${receiveRepo.jidToSignalProtocolAddress(senderJid)}${suffix}`)).toBe(false)
		expect(receiver.rows.has(`session/${receiveRepo.jidToSignalProtocolAddress(lid)}${suffix}`)).toBe(true)
	}
)

it('does not retry a pairwise operation because another user migrated', async () => {
	const sender = authState(),
		receiver = authState()
	const repo = makeLibSignalRepository(sender.auth, P({ level: 'silent' }))
	let lookups = 0
	repo.lidMapping.getLIDForPN = async () => {
		lookups++
		await repo.migrateSession('300000000003:2@s.whatsapp.net', '400000000004:2@lid')
		return null
	}

	const creds = receiver.auth.creds
	await repo.injectE2ESession({
		jid: '200000000002:2@s.whatsapp.net',
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
	expect(lookups).toBe(1)
})

it('migrates a received status without requiring a saved device list', async () => {
	const receiver = authState(),
		sender = authState()
	const repo = makeLibSignalRepository(receiver.auth, P({ level: 'silent' }))
	const peer = makeLibSignalRepository(sender.auth, P({ level: 'silent' }))
	const pn = '200000000002:2@s.whatsapp.net',
		lid = '300000000003:2@lid',
		own = '100000000001:1@lid'
	const creds = receiver.auth.creds
	await peer.injectE2ESession({
		jid: own,
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
	const encrypted = await peer.encryptMessage({ jid: own, data: Buffer.from('authored received status') })
	const plaintext = await repo.decryptMessage({ jid: pn, ...encrypted, sessionScope: 'status' })
	expect(Buffer.from(plaintext).toString()).toBe('authored received status')
	expect(receiver.rows.has('device-list/200000000002')).toBe(false)
	await repo.lidMapping.storeLIDPNMappings([{ pn, lid }])
	expect(await repo.migrateSession(pn, lid)).toEqual({ migrated: 1, skipped: 0, total: 1 })
	expect(receiver.rows.has(`session/${repo.jidToSignalProtocolAddress(pn)}_status`)).toBe(false)
	expect(receiver.rows.has(`session/${repo.jidToSignalProtocolAddress(lid)}_status`)).toBe(true)
	expect(receiver.rows.has('device-list/200000000002')).toBe(false)
})

it.each([false, true])('migrates normal and hosted devices in the same batch, hosted entry=%s', async hostedEntry => {
	const source = authState(),
		remote = authState()
	const repo = makeLibSignalRepository(source.auth, P({ level: 'silent' }))
	const creds = remote.auth.creds
	for (const jid of ['200000000002:2@s.whatsapp.net', '200000000002:99@hosted']) {
		await repo.injectE2ESession({
			jid,
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
		const address = repo.jidToSignalProtocolAddress(jid)
		source.rows.set(`session/${address}_status`, source.rows.get(`session/${address}`))
	}

	source.rows.set('device-list/200000000002', ['2', '99'])
	expect(
		await repo.migrateSession(
			hostedEntry ? '200000000002:99@hosted' : '200000000002:2@s.whatsapp.net',
			hostedEntry ? '300000000003:99@hosted.lid' : '300000000003:2@lid'
		)
	).toEqual({
		migrated: 2,
		skipped: 0,
		total: 2
	})
	for (const jid of ['300000000003:2@lid', '300000000003:99@hosted.lid']) {
		const address = repo.jidToSignalProtocolAddress(jid)
		expect(source.rows.has(`session/${address}`)).toBe(true)
		expect(source.rows.has(`session/${address}_status`)).toBe(true)
	}
})

it.each([false, true])(
	'carries a migrated identity without replacing a destination identity, existing=%s',
	async existing => {
		const receiver = authState(),
			oldSender = authState(),
			replacement = authState()
		const repo = makeLibSignalRepository(receiver.auth, P({ level: 'silent' }))
		const own = '100000000001:1@lid',
			pn = '200000000002:2@s.whatsapp.net',
			lid = '300000000003:2@lid'
		const receiveCreds = receiver.auth.creds
		const senders = [oldSender, authState(oldSender.auth.creds), replacement].map(state =>
			makeLibSignalRepository(state.auth, P({ level: 'silent' }))
		)
		for (const sender of senders)
			await sender.injectE2ESession({
				jid: own,
				session: {
					registrationId: receiveCreds.registrationId,
					identityKey: generateSignalPubKey(receiveCreds.signedIdentityKey.public),
					signedPreKey: {
						keyId: receiveCreds.signedPreKey.keyId,
						publicKey: generateSignalPubKey(receiveCreds.signedPreKey.keyPair.public),
						signature: receiveCreds.signedPreKey.signature
					}
				}
			})
		for (const [index, sessionScope] of [undefined, 'status' as const].entries()) {
			const encrypted = await senders[index]!.encryptMessage({ jid: own, data: Buffer.from('authored old identity') })
			expect(Buffer.from(await repo.decryptMessage({ jid: pn, ...encrypted, sessionScope })).toString()).toBe(
				'authored old identity'
			)
		}

		const from = repo.jidToSignalProtocolAddress(pn),
			to = repo.jidToSignalProtocolAddress(lid)
		const oldIdentity = receiver.rows.get(`identity-key/${from}`)
		const independentIdentity = Buffer.alloc(33, 9)
		if (existing) receiver.rows.set(`identity-key/${to}`, independentIdentity)
		await repo.migrateSession(pn, lid)
		expect(receiver.rows.get(`identity-key/${to}`)).toEqual(existing ? independentIdentity : oldIdentity)
		await repo.lidMapping.storeLIDPNMappings([{ pn, lid }])
		const encrypted = await senders[2]!.encryptMessage({ jid: own, data: Buffer.from('authored replacement status') })
		expect(Buffer.from(await repo.decryptMessage({ jid: lid, ...encrypted, sessionScope: 'status' })).toString()).toBe(
			'authored replacement status'
		)
		expect(receiver.rows.has(`session/${to}`)).toBe(false)
		expect(receiver.rows.has(`session/${to}_status`)).toBe(true)
		expect(receiver.rows.get(`identity-key/${to}`)).toEqual(
			generateSignalPubKey(replacement.auth.creds.signedIdentityKey.public)
		)
	}
)
