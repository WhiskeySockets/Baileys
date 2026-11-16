// @ts-ignore libsignal does not publish declarations for its protobuf helpers
import { PreKeyWhisperMessage } from 'libsignal/src/protobufs'
import P from 'pino'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { AuthenticationState, SignalDataTypeMap } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { generateSignalPubKey } from '../../Utils/crypto'

function authState(creds = initAuthCreds()) {
	const rows = new Map<string, unknown>()
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
	return { auth, rows }
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
