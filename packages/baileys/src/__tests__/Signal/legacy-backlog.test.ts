import { describe, expect, it } from '@jest/globals'
import { createRequire } from 'node:module'
import P from 'pino'
import { projectLegacySessionRecordV1 } from 'whatsapp-rust-bridge'
import { proto } from '../../../WAProto/index.js'
import type { LegacySessionRecord } from '../../Signal/legacy-session'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState, SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { Curve, generateSignalPubKey } from '../../Utils/crypto'
import { MISSING_KEYS_ERROR_TEXT } from '../../Utils/decode-wa-message'
import { BufferJSON } from '../../Utils/generics'
import fixture from '../fixtures/legacy-session-rc9.json'

type Data = Record<string, Record<string, unknown>>
type OldChain = { chainKey: { counter: number }; messageKeys: Record<string, Buffer> }
type OldRecord = {
	getOpenSession(): { getChain(ratchetKey: Uint8Array): OldChain }
	serialize(): LegacySessionRecord
}
type OldStorage = {
	loadSession(): Promise<OldRecord>
	storeSession(): Promise<void>
	isTrustedIdentity(): boolean
	getOurIdentity(): { pubKey: Buffer; privKey: Buffer }
	getOurRegistrationId(): number
}
type OldAddress = { toString(): string }
type OldCipher = {
	fillMessageKeys(chain: OldChain, counter: number): void
	encrypt(data: Buffer): Promise<{ type: number; body: Buffer }>
}
type OldEngine = {
	SessionRecord: { deserialize(record: unknown): OldRecord }
	ProtocolAddress: new (user: string, device: number) => OldAddress
	SessionCipher: new (storage: OldStorage, address: OldAddress) => OldCipher
}
type OldProtobuf = {
	WhisperMessage: { decode(bytes: Uint8Array): { counter: number; ephemeralKey: Buffer } }
}

const require = createRequire(import.meta.resolve('whatsapp-rust-bridge'))
const old = require('@whiskeysockets/libsignal-node') as OldEngine
const protobuf = require('@whiskeysockets/libsignal-node/src/protobufs.js') as OldProtobuf
const logger = P({ level: 'silent' })
const { aliceJid, bobJid } = fixture.jids
const aliceAddress = '5511900000001.0'

const revive = <T>(value: unknown): T =>
	JSON.parse(JSON.stringify(value), (_key: string, entry: unknown) => {
		if (typeof entry === 'object' && entry !== null && 'type' in entry && entry.type === 'Buffer' && 'data' in entry) {
			if (typeof entry.data === 'string') return Buffer.from(entry.data, 'base64')
			if (Array.isArray(entry.data)) return Buffer.from(entry.data)
		}

		return entry
	}) as T

const makeRepository = (creds: SignalAuthState['creds'], data: Data) => {
	let writes = 0
	const store: SignalKeyStore = {
		async get(type, ids) {
			const result: Record<string, SignalDataTypeMap[typeof type]> = {}
			for (const id of ids) {
				const value = data[type]?.[id]
				if (value !== undefined && value !== null) result[id] = value as SignalDataTypeMap[typeof type]
			}

			return result
		},
		async set(update: SignalDataSet) {
			writes++
			const persisted = JSON.parse(JSON.stringify(update, BufferJSON.replacer), BufferJSON.reviver) as SignalDataSet
			for (const [type, bucket] of Object.entries(persisted)) {
				const target = (data[type] ??= {})
				for (const [id, value] of Object.entries(bucket)) {
					if (value === null) delete target[id]
					else target[id] = value
				}
			}
		}
	}
	const repository = makeLibSignalRepository(
		{ creds, keys: addTransactionCapability(store, logger, { maxCommitRetries: 1, delayBetweenTriesMs: 1 }) },
		logger
	)
	return { repository, writes: () => writes }
}

const prepareBacklog = (count: number) => {
	const creds = revive<SignalAuthState['creds']>(fixture.bob.creds)
	const data = revive<Data>(fixture.bob.store)
	const record = old.SessionRecord.deserialize(data.session?.[aliceAddress])
	const first = fixture.pending[0]!
	const ciphertext = Buffer.from(first.ct, 'base64')
	const { ephemeralKey } = protobuf.WhisperMessage.decode(ciphertext.subarray(1, -8))
	const cipher = new old.SessionCipher(
		{
			loadSession: async () => record,
			storeSession: async () => {},
			isTrustedIdentity: () => true,
			getOurIdentity: () => ({
				pubKey: Buffer.from(generateSignalPubKey(creds.signedIdentityKey.public)),
				privKey: Buffer.from(creds.signedIdentityKey.private)
			}),
			getOurRegistrationId: () => creds.registrationId
		},
		new old.ProtocolAddress('5511900000001', 0)
	)
	const chain = record.getOpenSession().getChain(ephemeralKey)
	while (chain.chainKey.counter < count) cipher.fillMessageKeys(chain, Math.min(chain.chainKey.counter + 2000, count))
	data.session![aliceAddress] = record.serialize()
	expect(Object.keys(chain.messageKeys)).toHaveLength(count)
	return { creds, data, ephemeralKey }
}

const makeMessages = async (ratchetKey: Uint8Array) => {
	const creds = revive<SignalAuthState['creds']>(fixture.alice.creds)
	const record = old.SessionRecord.deserialize(Object.values(fixture.alice.store.session)[0])
	const cipher = new old.SessionCipher(
		{
			loadSession: async () => record,
			storeSession: async () => {},
			isTrustedIdentity: () => true,
			getOurIdentity: () => ({
				pubKey: Buffer.from(generateSignalPubKey(creds.signedIdentityKey.public)),
				privKey: Buffer.from(creds.signedIdentityKey.private)
			}),
			getOurRegistrationId: () => creds.registrationId
		},
		new old.ProtocolAddress('5511900000002', 0)
	)
	const messages = new Map<number, Buffer>()
	for (const message of fixture.pending) {
		const ciphertext = Buffer.from(message.ct, 'base64')
		messages.set(protobuf.WhisperMessage.decode(ciphertext.subarray(1, -8)).counter, ciphertext)
	}

	const chain = record.getOpenSession().getChain(ratchetKey)
	for (let counter = chain.chainKey.counter + 1; counter <= 2002; counter++) {
		const message = await cipher.encrypt(Buffer.from(`message-${counter}`))
		expect(message.type).toBe(1)
		messages.set(counter, message.body)
	}

	for (const counter of [6000, 8002]) {
		while (chain.chainKey.counter < counter - 1) {
			cipher.fillMessageKeys(chain, Math.min(chain.chainKey.counter + 2000, counter - 1))
		}

		const message = await cipher.encrypt(Buffer.from(`message-${counter}`))
		messages.set(counter, message.body)
	}

	return (counter: number) => {
		const ciphertext = messages.get(counter)
		if (!ciphertext) throw new Error(`Missing ciphertext for counter ${counter}`)
		return ciphertext
	}
}

const nativeSession = (data: Data) => {
	const stored = data.session?.[aliceAddress]
	if (!(stored instanceof Uint8Array)) throw new Error('Expected a canonical persisted session')
	return stored
}

describe('legacy skipped-key backlog', () => {
	it('preserves imported retention through reload, draining, and a later forward step', async () => {
		const { creds, data, ephemeralKey } = prepareBacklog(4000)
		const message = await makeMessages(ephemeralKey)
		let party = makeRepository(creds, data)
		const decrypt = (counter: number) =>
			party.repository.decryptMessage({ jid: aliceJid, type: 'msg', ciphertext: message(counter) })
		try {
			expect(Buffer.from(await decrypt(1)).toString()).toBe(fixture.pending[0]!.pt)
			let writes = party.writes()
			await expect(decrypt(1)).rejects.toHaveProperty('message', MISSING_KEYS_ERROR_TEXT)
			expect(party.writes()).toBe(writes)
			const corrupt = Buffer.from(message(2))
			corrupt[corrupt.length - 1] = corrupt[corrupt.length - 1]! ^ 1
			await expect(
				party.repository.decryptMessage({ jid: aliceJid, type: 'msg', ciphertext: corrupt })
			).rejects.toThrow('BadMac')
			expect(party.writes()).toBe(writes)
			party.repository.close?.()
			party = makeRepository(creds, data)
			for (let counter = 2; counter <= 2001; counter++) await decrypt(counter)
			const chains = proto.RecordStructure.decode(nativeSession(data)).currentSession?.receiverChains ?? []
			const chain = chains.find(
				value => value.senderRatchetKey && Buffer.from(value.senderRatchetKey).equals(ephemeralKey)
			)
			expect(chain?.messageKeys).toHaveLength(1999)
			expect(projectLegacySessionRecordV1(nativeSession(data)).status).toBe('projected')
			party.repository.close?.()
			party = makeRepository(creds, data)
			expect(Buffer.from(await decrypt(6000)).toString()).toBe('message-6000')
			nativeSession(data)
			party.repository.close?.()
			party = makeRepository(creds, data)
			expect(Buffer.from(await decrypt(2002)).toString()).toBe('message-2002')
			writes = party.writes()
			await expect(decrypt(8002)).rejects.toThrow('InvalidMessage')
			expect(party.writes()).toBe(writes)
		} finally {
			party.repository.close?.()
		}
	}, 30_000)

	it('rejects 4001 imported keys without replacing the row from a prekey message', async () => {
		const { creds, data } = prepareBacklog(4001)
		const preKey = Curve.generateKeyPair()
		data['pre-key'] ??= {}
		data['pre-key']['77'] = preKey
		const alice = makeRepository(initAuthCreds(), {})
		const bob = makeRepository(creds, data)
		try {
			await alice.repository.injectE2ESession({
				jid: bobJid,
				session: {
					registrationId: creds.registrationId,
					identityKey: generateSignalPubKey(creds.signedIdentityKey.public),
					preKey: { keyId: 77, publicKey: generateSignalPubKey(preKey.public) },
					signedPreKey: {
						keyId: creds.signedPreKey.keyId,
						publicKey: generateSignalPubKey(creds.signedPreKey.keyPair.public),
						signature: creds.signedPreKey.signature
					}
				}
			})
			const opener = await alice.repository.encryptMessage({ jid: bobJid, data: Buffer.from('fresh session') })
			expect(opener.type).toBe('pkmsg')
			const before = JSON.stringify(data, BufferJSON.replacer)
			await expect(bob.repository.decryptMessage({ jid: aliceJid, ...opener })).rejects.toHaveProperty(
				'code',
				'LEGACY_SESSION_IMPORT_LIMIT'
			)
			expect(JSON.stringify(data, BufferJSON.replacer)).toBe(before)
			expect(bob.writes()).toBe(0)
		} finally {
			alice.repository.close?.()
			bob.repository.close?.()
		}
	})
})
