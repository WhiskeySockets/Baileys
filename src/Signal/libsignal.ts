import { generateSignalPubKey } from '../crypto'
import { SignalAuthState } from '../Types'
import { SignalRepository } from '../Types/Signal'
import { SignalSessionStore } from '../Types/Signal'
import { jidDecode } from '../WABinary'
import ProtocolAddress from './Core/protocol_address'
import SessionBuilder from './Core/session_builder'
import SessionCipher from './Core/session_cipher'
import SessionRecord from './Core/session_record'
import { SenderKeyName } from './Group/sender-key-name'
import { SenderKeyRecord } from './Group/sender-key-record'
import { GroupCipher, GroupSessionBuilder, SenderKeyDistributionMessage } from './Group'

export function makeLibSignalRepository(auth: SignalAuthState): SignalRepository {
	const signalStore: SignalSessionStore = signalStorage(auth)
	return {
		decryptGroupMessage({ group, authorJid, msg }) {
			const senderName = jidToSignalSenderKeyName(group, authorJid)
			const cipher = new GroupCipher(signalStore, senderName)

			return cipher.decrypt(msg)
		},
		async processSenderKeyDistributionMessage({ item, authorJid }) {
			const builder = new GroupSessionBuilder(signalStore)
			if (!item.groupId) {
				throw new Error('Group ID is required for sender key distribution message')
			}

			const senderName = jidToSignalSenderKeyName(item.groupId, authorJid)

			const senderMsg = new SenderKeyDistributionMessage(
				null,
				null,
				null,
				null,
				item.axolotlSenderKeyDistributionMessage
			)
			const senderNameStr = senderName.toString()
			const { [senderNameStr]: senderKey } = await auth.keys.get('sender-key', [senderNameStr])
			if (!senderKey) {
				await signalStore.storeSenderKey(senderName, new SenderKeyRecord())
			}

			await builder.process(senderName, senderMsg)
		},
		async decryptMessage({ jid, type, ciphertext }) {
			const addr = jidToSignalProtocolAddress(jid)
			const session = new SessionCipher(signalStore, addr)
			let result: Buffer
			switch (type) {
				case 'pkmsg':
					result = await session.decryptPreKeyWhisperMessage(Buffer.from(ciphertext))
					break
				case 'msg':
					result = await session.decryptWhisperMessage(Buffer.from(ciphertext))
					break
				default:
					throw new Error(`Unknown message type: ${type}`)
			}

			return result
		},
		async encryptMessage({ jid, data }) {
			const addr = jidToSignalProtocolAddress(jid)
			const cipher = new SessionCipher(signalStore, addr)
			const { type: sigType, body } = await cipher.encrypt(Buffer.from(data))
			const type = sigType === 3 ? 'pkmsg' : 'msg'
			return { type, ciphertext: body }
		},
		async encryptGroupMessage({ group, meId, data }) {
			const senderName = jidToSignalSenderKeyName(group, meId)
			const builder = new GroupSessionBuilder(signalStore)

			const senderNameStr = senderName.toString()
			const { [senderNameStr]: senderKey } = await auth.keys.get('sender-key', [senderNameStr])
			if (!senderKey) {
				await signalStore.storeSenderKey(senderName, new SenderKeyRecord())
			}

			const senderKeyDistributionMessage = await builder.create(senderName)
			const session = new GroupCipher(signalStore, senderName)
			const ciphertext = await session.encrypt(data)

			return {
				ciphertext,
				senderKeyDistributionMessage: senderKeyDistributionMessage.serialize()
			}
		},
		async injectE2ESession({ jid, session }) {
			const cipher = new SessionBuilder(signalStore, jidToSignalProtocolAddress(jid))
			await cipher.initOutgoing(session)
		},
		jidToSignalProtocolAddress(jid) {
			return jidToSignalProtocolAddress(jid).toString()
		}
	}
}

const jidToSignalProtocolAddress = (jid: string) => {
	const { user, device } = jidDecode(jid)!
	return new ProtocolAddress(user, device || 0)
}

const jidToSignalSenderKeyName = (group: string, user: string): SenderKeyName => {
	return new SenderKeyName(group, jidToSignalProtocolAddress(user))
}

function signalStorage({ creds, keys }: SignalAuthState): SignalSessionStore {
	return {
		loadSession: async (id: string) => {
			const { [id]: sess } = await keys.get('session', [id])
			if (sess) {
				let data
				if (Buffer.isBuffer(sess)) {
					data = JSON.parse(sess.toString('utf-8'))
				} else if (typeof sess === 'string') {
					data = JSON.parse(sess)
				} else {
					data = sess
				}

				return SessionRecord.deserialize(data)
			}
		},
		storeSession: async (id: string, session: SessionRecord) => {
			const serialized = JSON.stringify(session.serialize())
			await keys.set({ session: { [id]: Buffer.from(serialized, 'utf-8') } })
		},
		isTrustedIdentity: async () => {
			return true
		},
		loadPreKey: async (id: number | string) => {
			const keyId = id.toString()
			const { [keyId]: key } = await keys.get('pre-key', [keyId])
			if (key) {
				return {
					privKey: Buffer.from(key.private),
					pubKey: Buffer.from(key.public)
				}
			}
		},
		removePreKey: async (id: number) => keys.set({ 'pre-key': { [id]: null } }),
		loadSignedPreKey: async () => {
			const key = creds.signedPreKey
			return {
				privKey: Buffer.from(key.keyPair.private),
				pubKey: Buffer.from(key.keyPair.public)
			}
		},
		loadSenderKey: async (senderKeyName: SenderKeyName) => {
			const keyId = senderKeyName.toString()
			const { [keyId]: key } = await keys.get('sender-key', [keyId])
			if (key) {
				return SenderKeyRecord.deserialize(key)
			}

			return new SenderKeyRecord()
		},
		storeSenderKey: async (senderKeyName: SenderKeyName, key: SenderKeyRecord) => {
			const keyId = senderKeyName.toString()
			const serialized = JSON.stringify(key.serialize())
			await keys.set({ 'sender-key': { [keyId]: Buffer.from(serialized, 'utf-8') } })
		},
		getOurRegistrationId: async () => creds.registrationId,
		getOurIdentity: async () => {
			const { signedIdentityKey } = creds
			return {
				privKey: Buffer.from(signedIdentityKey.private),
				pubKey: generateSignalPubKey(signedIdentityKey.public)
			}
		}
	}
}
