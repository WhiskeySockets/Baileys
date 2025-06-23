import { proto } from '../../../WAProto'
import * as crypto from '../../crypto'
import * as curve from '../../crypto'
import { E2ESession, SignalKeyPair, SignalSessionStore } from '../../Types/Signal'
import queueJob from '../../Utils/queue-job'
import BaseKeyType from './base_key_type'
import ChainType from './chain_type'
import * as errors from './errors'
import ProtocolAddress from './protocol_address'
import SessionRecord, { SessionEntry } from './session_record'

class SessionBuilder {
	addr: ProtocolAddress
	storage: SignalSessionStore

	constructor(storage: SignalSessionStore, protocolAddress: ProtocolAddress) {
		this.addr = protocolAddress
		this.storage = storage
	}

	async initOutgoing(device: E2ESession) {
		const fqAddr = this.addr.toString()
		return await queueJob(fqAddr, async () => {
			if (!(await this.storage.isTrustedIdentity(this.addr.id, device.identityKey))) {
				throw new errors.UntrustedIdentityKeyError(this.addr.id, device.identityKey)
			}

			curve.verifySignature(
				Buffer.from(device.identityKey),
				Buffer.from(device.signedPreKey.publicKey),
				Buffer.from(device.signedPreKey.signature),
				true
			)
			const baseKey = curve.generateKeyPair()
			const devicePreKey = device.preKey?.publicKey
			const session = await this.initSession(
				true,
				baseKey,
				undefined,
				device.identityKey,
				devicePreKey,
				device.signedPreKey.publicKey,
				device.registrationId
			)
			session.pendingPreKey = {
				signedKeyId: device.signedPreKey.keyId,
				baseKey: baseKey.pubKey
			}
			if (device.preKey) {
				session.pendingPreKey.preKeyId = device.preKey.keyId
			}

			let record = await this.storage.loadSession(fqAddr)
			if (!record) {
				record = new SessionRecord()
			} else {
				const openSession = record.getOpenSession()
				if (openSession) {
					record.closeSession(openSession)
				}
			}

			record.setSession(session)
			await this.storage.storeSession(fqAddr, record)
		})
	}

	async initIncoming(sessionRecord: SessionRecord, message: proto.PreKeySignalMessage) {
		const fqAddr = this.addr.toString()
		if (!(await this.storage.isTrustedIdentity(fqAddr, message.identityKey!))) {
			throw new errors.UntrustedIdentityKeyError(this.addr.id, message.identityKey!)
		}

		if (sessionRecord.getSession(Buffer.from(message.baseKey!))) {
			// This just means we haven't replied.
			return
		}

		const preKeyPair = await this.storage.loadPreKey(message.preKeyId!)
		if (message.preKeyId && !preKeyPair) {
			throw new errors.PreKeyError('Invalid PreKey ID')
		}

		const signedPreKeyPair = await this.storage.loadSignedPreKey(message.signedPreKeyId!)
		if (!signedPreKeyPair) {
			throw new errors.PreKeyError('Missing SignedPreKey')
		}

		const existingOpenSession = sessionRecord.getOpenSession()
		if (existingOpenSession) {
			sessionRecord.closeSession(existingOpenSession)
		}

		sessionRecord.setSession(
			await this.initSession(
				false,
				preKeyPair,
				signedPreKeyPair,
				message.identityKey!,
				message.baseKey!,
				undefined,
				message.registrationId!
			)
		)
		return message.preKeyId
	}

	async initSession(
		isInitiator: boolean,
		ourEphemeralKey: SignalKeyPair | undefined,
		ourSignedKey: SignalKeyPair | undefined,
		theirIdentityPubKey: Uint8Array,
		theirEphemeralPubKey: Uint8Array | undefined,
		theirSignedPubKey: Uint8Array | undefined,
		registrationId: number
	) {
		if (isInitiator) {
			if (ourSignedKey) {
				throw new Error('Invalid call to initSession')
			}

			ourSignedKey = ourEphemeralKey
		} else {
			if (theirSignedPubKey) {
				throw new Error('Invalid call to initSession')
			}

			theirSignedPubKey = theirEphemeralPubKey
		}

		let sharedSecret: Uint8Array
		if (!ourEphemeralKey || !theirEphemeralPubKey) {
			sharedSecret = new Uint8Array(32 * 4)
		} else {
			sharedSecret = new Uint8Array(32 * 5)
		}

		for (let i = 0; i < 32; i++) {
			sharedSecret[i] = 0xff
		}

		const ourIdentityKey = await this.storage.getOurIdentity()
		const a1 = curve.calculateAgreement(Buffer.from(theirSignedPubKey!), ourIdentityKey.privKey)
		const a2 = curve.calculateAgreement(Buffer.from(theirIdentityPubKey), ourSignedKey!.privKey)
		const a3 = curve.calculateAgreement(Buffer.from(theirSignedPubKey!), ourSignedKey!.privKey)
		if (isInitiator) {
			sharedSecret.set(new Uint8Array(a1), 32)
			sharedSecret.set(new Uint8Array(a2), 32 * 2)
		} else {
			sharedSecret.set(new Uint8Array(a1), 32 * 2)
			sharedSecret.set(new Uint8Array(a2), 32)
		}

		sharedSecret.set(new Uint8Array(a3), 32 * 3)
		if (ourEphemeralKey && theirEphemeralPubKey) {
			const a4 = curve.calculateAgreement(Buffer.from(theirEphemeralPubKey), ourEphemeralKey.privKey)
			sharedSecret.set(new Uint8Array(a4), 32 * 4)
		}

		const masterKey = crypto.deriveSecrets(Buffer.from(sharedSecret), Buffer.alloc(32), Buffer.from('WhisperText'))
		const sessionEntry = SessionRecord.createEntry()
		sessionEntry.registrationId = registrationId
		sessionEntry.currentRatchet = {
			rootKey: masterKey[0],
			ephemeralKeyPair: isInitiator ? curve.generateKeyPair() : ourSignedKey!,
			lastRemoteEphemeralKey: Buffer.from(theirSignedPubKey!),
			previousCounter: 0
		}
		sessionEntry.indexInfo = {
			created: Date.now(),
			used: Date.now(),
			remoteIdentityKey: Buffer.from(theirIdentityPubKey),
			baseKey: isInitiator ? ourEphemeralKey!.pubKey : Buffer.from(theirEphemeralPubKey!),
			baseKeyType: isInitiator ? BaseKeyType.OURS : BaseKeyType.THEIRS,
			closed: -1
		}
		if (isInitiator) {
			// If we're initiating we go ahead and set our first sending ephemeral key now,
			// otherwise we figure it out when we first maybeStepRatchet with the remote's
			// ephemeral key
			this.calculateSendingRatchet(sessionEntry, Buffer.from(theirSignedPubKey!))
		}

		return sessionEntry
	}

	calculateSendingRatchet(sessionEntry: SessionEntry, remoteKey: Buffer) {
		const ratchet = sessionEntry.currentRatchet
		const sharedSecret = curve.calculateAgreement(remoteKey, ratchet.ephemeralKeyPair.privKey)
		const masterKey = crypto.deriveSecrets(sharedSecret, ratchet.rootKey, Buffer.from('WhisperRatchet'))
		sessionEntry.addChain(ratchet.ephemeralKeyPair.pubKey, {
			messageKeys: {},
			chainKey: {
				counter: -1,
				key: masterKey[1]
			},
			chainType: ChainType.SENDING
		})
		ratchet.rootKey = masterKey[0]
	}
}

export default SessionBuilder
