import { describe, expect, it } from '@jest/globals'
import P from 'pino'
import { generatePreKey, generateSignedPreKey } from 'whatsapp-rust-bridge'
import { makeLibSignalRepository } from '../../Signal/libsignal'
import type { SignalAuthState, SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { generateSignalPubKey } from '../../Utils/crypto'

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

const makeAuthState = (): SignalAuthState => ({
	creds: initAuthCreds(),
	keys: addTransactionCapability(makeMemoryKeyStore(), logger, {
		maxCommitRetries: 1,
		delayBetweenTriesMs: 1
	})
})

/**
 * `getSessionInfo` decodes the persisted record with WAProto's `RecordStructure`
 * because the WASM bridge exposes no accessor for the open state's fields. That
 * only holds while the bridge keeps serializing sessions as that same protobuf,
 * so drive a real session through the bridge and assert the fields come back —
 * a format change on the Rust side has to fail here rather than silently turn
 * `getSessionInfo` into a `null`-returning no-op.
 */
describe('getSessionInfo', () => {
	const remoteJid = '5511999887766@s.whatsapp.net'

	const establishSession = async () => {
		const auth = makeAuthState()
		const repository = makeLibSignalRepository(auth, logger)

		const peer = initAuthCreds()
		const peerPreKey = generatePreKey(1)
		const peerSignedPreKey = generateSignedPreKey(
			{ pubKey: peer.signedIdentityKey.public, privKey: peer.signedIdentityKey.private },
			1
		)

		await repository.injectE2ESession({
			jid: remoteJid,
			session: {
				registrationId: peer.registrationId,
				identityKey: generateSignalPubKey(peer.signedIdentityKey.public),
				preKey: { keyId: 1, publicKey: peerPreKey.keyPair.pubKey },
				signedPreKey: {
					keyId: 1,
					publicKey: peerSignedPreKey.keyPair.pubKey,
					signature: peerSignedPreKey.signature
				}
			} as never
		})

		return { repository, peer }
	}

	it('returns the base key and registration id of an established session', async () => {
		const { repository, peer } = await establishSession()

		const info = await repository.getSessionInfo(remoteJid)

		expect(info).not.toBeNull()
		expect(info!.registrationId).toBe(peer.registrationId)
		expect(info!.baseKey.length).toBeGreaterThan(0)
	})

	it('keeps the base key stable across encrypts on the same session', async () => {
		const { repository } = await establishSession()

		const first = await repository.getSessionInfo(remoteJid)
		await repository.encryptMessage({ jid: remoteJid, data: Buffer.from('hello') })
		const second = await repository.getSessionInfo(remoteJid)

		expect(second).not.toBeNull()
		expect(Buffer.from(second!.baseKey)).toEqual(Buffer.from(first!.baseKey))
	})

	it('returns null when no session exists', async () => {
		const auth = makeAuthState()
		const repository = makeLibSignalRepository(auth, logger)

		await expect(repository.getSessionInfo(remoteJid)).resolves.toBeNull()
	})
})
