import { proto } from '../../../WAProto'
import * as crypto from '../../crypto'
import * as curve from '../../crypto'
import { SignalSessionStore } from '../../Types/Signal'
import queueJob from '../../Utils/queue-job'
import ChainType from './chain_type'
import * as errors from './errors'
import ProtocolAddress from './protocol_address'
import SessionBuilder from './session_builder'
import SessionRecord, { Chain } from './session_record'
import { SessionEntry } from './session_record'

const VERSION = 3

class SessionCipher {
	addr: ProtocolAddress
	storage: SignalSessionStore

	constructor(storage: SignalSessionStore, protocolAddress: ProtocolAddress) {
		if (!(protocolAddress instanceof ProtocolAddress)) {
			throw new TypeError('protocolAddress must be a ProtocolAddress')
		}

		this.addr = protocolAddress
		this.storage = storage
	}

	_encodeTupleByte(number1: number, number2: number) {
		if (number1 > 15 || number2 > 15) {
			throw TypeError('Numbers must be 4 bits or less')
		}

		return (number1 << 4) | number2
	}

	_decodeTupleByte(byte: number) {
		return [byte >> 4, byte & 0xf]
	}

	toString() {
		return `<SessionCipher(${this.addr.toString()})>`
	}

	async getRecord() {
		const record = await this.storage.loadSession(this.addr.toString())
		if (record && !(record instanceof SessionRecord)) {
			throw new TypeError('SessionRecord type expected from loadSession')
		}

		return record
	}

	async storeRecord(record: SessionRecord) {
		record.removeOldSessions()
		await this.storage.storeSession(this.addr.toString(), record)
	}

	async queueJob<T>(awaitable: () => Promise<T>) {
		return await queueJob(this.addr.toString(), awaitable)
	}

	async encrypt(data: Buffer) {
		const ourIdentityKey = await this.storage.getOurIdentity()
		return await this.queueJob(async () => {
			const record = await this.getRecord()
			if (!record) {
				throw new errors.SessionError('No sessions')
			}

			const session = record.getOpenSession()
			if (!session) {
				throw new errors.SessionError('No open session')
			}

			const remoteIdentityKey = session.indexInfo.remoteIdentityKey
			if (!(await this.storage.isTrustedIdentity(this.addr.id, remoteIdentityKey))) {
				throw new errors.UntrustedIdentityKeyError(this.addr.id, remoteIdentityKey)
			}

			const chain = session.getChain(session.currentRatchet.ephemeralKeyPair.pubKey)
			if (!chain) {
				throw new Error('No chain found for current ephemeral key')
			}

			if (chain.chainType === ChainType.RECEIVING) {
				throw new Error('Tried to encrypt on a receiving chain')
			}

			this.fillMessageKeys(chain, chain.chainKey.counter + 1)
			const keys = crypto.deriveSecrets(
				chain.messageKeys[chain.chainKey.counter],
				Buffer.alloc(32),
				Buffer.from('WhisperMessageKeys')
			)
			delete chain.messageKeys[chain.chainKey.counter]
			const msg = proto.SignalMessage.create()
			msg.ratchetKey = session.currentRatchet.ephemeralKeyPair.pubKey
			msg.counter = chain.chainKey.counter
			msg.previousCounter = session.currentRatchet.previousCounter
			msg.ciphertext = crypto.signalEncrypt(keys[0], data, keys[2].slice(0, 16))
			const msgBuf = proto.SignalMessage.encode(msg).finish()
			const macInput = Buffer.alloc(msgBuf.byteLength + 33 * 2 + 1)
			macInput.set(ourIdentityKey.pubKey)
			macInput.set(session.indexInfo.remoteIdentityKey, 33)
			macInput[33 * 2] = this._encodeTupleByte(VERSION, VERSION)
			macInput.set(msgBuf, 33 * 2 + 1)
			const mac = crypto.calculateMAC(keys[1], macInput)
			const result = Buffer.alloc(msgBuf.byteLength + 9)
			result[0] = this._encodeTupleByte(VERSION, VERSION)
			result.set(msgBuf, 1)
			result.set(mac.slice(0, 8), msgBuf.byteLength + 1)
			await this.storeRecord(record)
			let type: number, body: Buffer
			if (session.pendingPreKey) {
				type = 3 // prekey bundle
				const preKeyMsg = proto.PreKeySignalMessage.create({
					identityKey: ourIdentityKey.pubKey,
					registrationId: await this.storage.getOurRegistrationId(),
					baseKey: session.pendingPreKey.baseKey,
					signedPreKeyId: session.pendingPreKey.signedKeyId,
					message: result
				})
				if (session.pendingPreKey.preKeyId) {
					preKeyMsg.preKeyId = session.pendingPreKey.preKeyId
				}

				body = Buffer.concat([
					Buffer.from([this._encodeTupleByte(VERSION, VERSION)]),
					Buffer.from(proto.PreKeySignalMessage.encode(preKeyMsg).finish())
				])
			} else {
				type = 1 // normal
				body = result
			}

			return {
				type,
				body,
				registrationId: session.registrationId
			}
		})
	}

	async decryptWithSessions(data: Uint8Array, sessions: SessionEntry[]) {
		// Iterate through the sessions, attempting to decrypt using each one.
		// Stop and return the result if we get a valid result.
		if (!sessions.length) {
			throw new errors.SessionError('No sessions available')
		}

		const errs: unknown[] = []
		for (const session of sessions) {
			let plaintext: Buffer
			try {
				plaintext = await this.doDecryptWhisperMessage(Buffer.from(data), session)
				session.indexInfo.used = Date.now()
				return {
					session,
					plaintext
				}
			} catch (e) {
				errs.push(e)
			}
		}

		console.error('Failed to decrypt message with any known session...')
		for (const e of errs) {
			console.error('Session error:' + e, (e as Error).stack)
		}

		throw new errors.SessionError('No matching sessions found for message')
	}

	async decryptWhisperMessage(data: Buffer) {
		return await this.queueJob(async () => {
			const record = await this.getRecord()
			if (!record) {
				throw new errors.SessionError('No session record')
			}

			const result = await this.decryptWithSessions(data, record.getSessions())
			const remoteIdentityKey = result.session.indexInfo.remoteIdentityKey
			if (!(await this.storage.isTrustedIdentity(this.addr.id, remoteIdentityKey))) {
				throw new errors.UntrustedIdentityKeyError(this.addr.id, remoteIdentityKey)
			}

			if (record.isClosed(result.session)) {
				// It's possible for this to happen when processing a backlog of messages.
				// The message was, hopefully, just sent back in a time when this session
				// was the most current.  Simply make a note of it and continue.  If our
				// actual open session is for reason invalid, that must be handled via
				// a full SessionError response.
			}

			await this.storeRecord(record)
			return result.plaintext
		})
	}

	async decryptPreKeyWhisperMessage(data: Buffer) {
		const versions = this._decodeTupleByte(data[0])
		if (versions[1] > 3 || versions[0] < 3) {
			// min version > 3 or max version < 3
			throw new Error('Incompatible version number on PreKeyWhisperMessage')
		}

		return await this.queueJob(async () => {
			let record = await this.getRecord()
			const preKeyProto = proto.PreKeySignalMessage.decode(data.slice(1))
			if (!record) {
				if (preKeyProto.registrationId === null) {
					throw new Error('No registrationId')
				}

				record = new SessionRecord()
			}

			const builder = new SessionBuilder(this.storage, this.addr)
			const preKeyId = await builder.initIncoming(record, preKeyProto)
			const session = record.getSession(Buffer.from(preKeyProto.baseKey!))
			const plaintext = await this.doDecryptWhisperMessage(Buffer.from(preKeyProto.message!), session)
			await this.storeRecord(record)
			if (preKeyId) {
				await this.storage.removePreKey(preKeyId)
			}

			return plaintext
		})
	}

	async doDecryptWhisperMessage(messageBuffer: Buffer, session?: SessionEntry) {
		if (!session) {
			throw new TypeError('session required')
		}

		const versions = this._decodeTupleByte(messageBuffer[0])
		if (versions[1] > 3 || versions[0] < 3) {
			// min version > 3 or max version < 3
			throw new Error('Incompatible version number on WhisperMessage')
		}

		const messageProto = messageBuffer.slice(1, -8)
		const message = proto.SignalMessage.decode(messageProto)
		this.maybeStepRatchet(session, Buffer.from(message.ratchetKey!), message.previousCounter!)
		const chain = session.getChain(Buffer.from(message.ratchetKey!))
		if (chain?.chainType === ChainType.SENDING) {
			throw new Error('Tried to decrypt on a sending chain')
		}

		if (!chain) {
			throw new errors.SessionError('No chain found for ratchet key')
		}

		if (message.counter === null || message.counter === undefined) {
			throw new errors.MessageCounterError('Message counter is missing')
		}

		this.fillMessageKeys(chain, message.counter)
		if (!chain?.messageKeys.hasOwnProperty(message.counter)) {
			// Most likely the message was already decrypted and we are trying to process
			// twice.  This can happen if the user restarts before the server gets an ACK.
			throw new errors.MessageCounterError('Key used already or never filled')
		}

		const counter = message.counter
		if (counter === null || counter === undefined || typeof counter !== 'number') {
			throw new errors.MessageCounterError('Invalid message counter')
		}

		const messageKey = chain.messageKeys[counter]
		if (!messageKey) {
			throw new errors.MessageCounterError('Message key not found')
		}

		delete chain.messageKeys[counter]
		const keys = crypto.deriveSecrets(messageKey, Buffer.alloc(32), Buffer.from('WhisperMessageKeys'))
		const ourIdentityKey = await this.storage.getOurIdentity()
		const macInput = Buffer.alloc(messageProto.byteLength + 33 * 2 + 1)
		macInput.set(session.indexInfo.remoteIdentityKey)
		macInput.set(ourIdentityKey.pubKey, 33)
		macInput[33 * 2] = this._encodeTupleByte(VERSION, VERSION)
		macInput.set(messageProto, 33 * 2 + 1)
		// This is where we most likely fail if the session is not a match.
		// Don't misinterpret this as corruption.
		crypto.verifyMAC(macInput, keys[1], messageBuffer.slice(-8), 8)
		if (!message.ciphertext || !(message.ciphertext instanceof Buffer)) {
			throw new errors.MessageCounterError('Invalid ciphertext buffer')
		}

		const plaintext = crypto.signalDecrypt(keys[0], message.ciphertext, keys[2].slice(0, 16))
		delete session.pendingPreKey
		return plaintext
	}

	fillMessageKeys(chain: Chain, counter: number) {
		if (chain.chainKey.counter >= counter) {
			return
		}

		if (counter - chain.chainKey.counter > 2000) {
			throw new errors.SessionError('Over 2000 messages into the future!')
		}

		if (chain.chainKey.key === undefined) {
			throw new errors.SessionError('Chain closed')
		}

		const key = chain.chainKey.key
		chain.messageKeys[chain.chainKey.counter + 1] = crypto.calculateMAC(key, Buffer.from([1]))
		chain.chainKey.key = crypto.calculateMAC(key, Buffer.from([2]))
		chain.chainKey.counter += 1
		return this.fillMessageKeys(chain, counter)
	}

	maybeStepRatchet(session: SessionEntry, remoteKey: Buffer, previousCounter: number) {
		if (session.getChain(remoteKey)) {
			return
		}

		const ratchet = session.currentRatchet
		const previousRatchet = session.getChain(ratchet.lastRemoteEphemeralKey)
		if (previousRatchet) {
			this.fillMessageKeys(previousRatchet, previousCounter)
			delete previousRatchet.chainKey.key // Close
		}

		this.calculateRatchet(session, remoteKey, false)
		// Now swap the ephemeral key and calculate the new sending chain
		const prevCounter = session.getChain(ratchet.ephemeralKeyPair.pubKey)
		if (prevCounter) {
			ratchet.previousCounter = prevCounter.chainKey.counter
			session.deleteChain(ratchet.ephemeralKeyPair.pubKey)
		}

		ratchet.ephemeralKeyPair = curve.generateKeyPair()
		this.calculateRatchet(session, remoteKey, true)
		ratchet.lastRemoteEphemeralKey = remoteKey
	}

	calculateRatchet(session: SessionEntry, remoteKey: Buffer, sending: boolean) {
		const ratchet = session.currentRatchet
		const sharedSecret = curve.calculateAgreement(remoteKey, ratchet.ephemeralKeyPair.privKey)
		const masterKey = crypto.deriveSecrets(sharedSecret, ratchet.rootKey, Buffer.from('WhisperRatchet'), /*chunks*/ 2)
		const chainKey = sending ? ratchet.ephemeralKeyPair.pubKey : remoteKey
		session.addChain(chainKey, {
			messageKeys: {},
			chainKey: {
				counter: -1,
				key: masterKey[1]
			},
			chainType: sending ? ChainType.SENDING : ChainType.RECEIVING
		})
		ratchet.rootKey = masterKey[0]
	}

	async hasOpenSession() {
		return await this.queueJob(async () => {
			const record = await this.getRecord()
			if (!record) {
				return false
			}

			return record.haveOpenSession()
		})
	}

	async closeOpenSession() {
		return await this.queueJob(async () => {
			const record = await this.getRecord()
			if (record) {
				const openSession = record.getOpenSession()
				if (openSession) {
					record.closeSession(openSession)
					await this.storeRecord(record)
				}
			}
		})
	}
}

export default SessionCipher
