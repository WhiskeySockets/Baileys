import * as libsignal from 'libsignal'
import { proto } from '../../WAProto'
import { GroupCipher, GroupSessionBuilder, SenderKeyDistributionMessage, SenderKeyName, SenderKeyRecord } from '../../WASignalGroup'
import { KEY_BUNDLE_TYPE } from '../Defaults'
import { AuthenticationCreds, AuthenticationState, KeyPair, SignalAuthState, SignalIdentity, SignalKeyStore, SignedKeyPair } from '../Types/Auth'
import { assertNodeErrorFree, BinaryNode, getBinaryNodeChild, getBinaryNodeChildBuffer, getBinaryNodeChildren, getBinaryNodeChildUInt, jidDecode, JidWithDevice, S_WHATSAPP_NET } from '../WABinary'
import { Curve, generateSignalPubKey } from './crypto'
import { encodeBigEndian } from './generics'

const jidToSignalAddress = (jid: string) => jid.split('@')[0]

export const jidToSignalProtocolAddress = (jid: string) => {
	return new libsignal.ProtocolAddress(jidToSignalAddress(jid), 0)
}

export const jidToSignalSenderKeyName = (group: string, user: string): string => {
	return new SenderKeyName(group, jidToSignalProtocolAddress(user)).toString()
}

export const createSignalIdentity = (
	wid: string,
	accountSignatureKey: Uint8Array
): SignalIdentity => {
	return {
		identifier: { name: wid, deviceId: 0 },
		identifierKey: generateSignalPubKey(accountSignatureKey)
	}
}

export const getPreKeys = async({ get }: SignalKeyStore, min: number, limit: number) => {
	const idList: string[] = []
	for(let id = min; id < limit;id++) {
		idList.push(id.toString())
	}

	return get('pre-key', idList)
}

export const generateOrGetPreKeys = (creds: AuthenticationCreds, range: number) => {
	const avaliable = creds.nextPreKeyId - creds.firstUnuploadedPreKeyId
	const remaining = range - avaliable
	const lastPreKeyId = creds.nextPreKeyId + remaining - 1
	const newPreKeys: { [id: number]: KeyPair } = { }
	if(remaining > 0) {
		for(let i = creds.nextPreKeyId;i <= lastPreKeyId;i++) {
			newPreKeys[i] = Curve.generateKeyPair()
		}
	}

	return {
		newPreKeys,
		lastPreKeyId,
		preKeysRange: [creds.firstUnuploadedPreKeyId, range] as const,
	}
}

export const xmppSignedPreKey = (key: SignedKeyPair): BinaryNode => (
	{
		tag: 'skey',
		attrs: { },
		content: [
			{ tag: 'id', attrs: { }, content: encodeBigEndian(key.keyId, 3) },
			{ tag: 'value', attrs: { }, content: key.keyPair.public },
			{ tag: 'signature', attrs: { }, content: key.signature }
		]
	}
)

export const xmppPreKey = (pair: KeyPair, id: number): BinaryNode => (
	{
		tag: 'key',
		attrs: { },
		content: [
			{ tag: 'id', attrs: { }, content: encodeBigEndian(id, 3) },
			{ tag: 'value', attrs: { }, content: pair.public }
		]
	}
)

export const signalStorage = ({ creds, keys }: SignalAuthState) => ({
	loadSession: async(id: string) => {
		const { [id]: sess } = await keys.get('session', [id])
		if(sess) {
			return libsignal.SessionRecord.deserialize(sess)
		}
	},
	storeSession: async(id, session) => {
		await keys.set({ 'session': { [id]: session.serialize() } })
	},
	isTrustedIdentity: () => {
		return true
	},
	loadPreKey: async(id: number | string) => {
		const keyId = id.toString()
		const { [keyId]: key } = await keys.get('pre-key', [keyId])
		if(key) {
			return {
				privKey: Buffer.from(key.private),
				pubKey: Buffer.from(key.public)
			}
		}
	},
	removePreKey: (id: number) => keys.set({ 'pre-key': { [id]: null } }),
	loadSignedPreKey: () => {
		const key = creds.signedPreKey
		return {
			privKey: Buffer.from(key.keyPair.private),
			pubKey: Buffer.from(key.keyPair.public)
		}
	},
	loadSenderKey: async(keyId: string) => {
		const { [keyId]: key } = await keys.get('sender-key', [keyId])
		if(key) {
			return new SenderKeyRecord(key)
		}
	},
	storeSenderKey: async(keyId, key) => {
		await keys.set({ 'sender-key': { [keyId]: key.serialize() } })
	},
	getOurRegistrationId: () => (
		creds.registrationId
	),
	getOurIdentity: () => {
		const { signedIdentityKey } = creds
		return {
			privKey: Buffer.from(signedIdentityKey.private),
			pubKey: generateSignalPubKey(signedIdentityKey.public),
		}
	}
})

export const decryptGroupSignalProto = (group: string, user: string, msg: Buffer | Uint8Array, auth: SignalAuthState) => {
	const senderName = jidToSignalSenderKeyName(group, user)
	const cipher = new GroupCipher(signalStorage(auth), senderName)

	return cipher.decrypt(Buffer.from(msg))
}

export const processSenderKeyMessage = async(
	authorJid: string,
	item: proto.Message.ISenderKeyDistributionMessage,
	auth: SignalAuthState
) => {
	const builder = new GroupSessionBuilder(signalStorage(auth))
	const senderName = jidToSignalSenderKeyName(item.groupId!, authorJid)

	const senderMsg = new SenderKeyDistributionMessage(null, null, null, null, item.axolotlSenderKeyDistributionMessage)
	const { [senderName]: senderKey } = await auth.keys.get('sender-key', [senderName])
	if(!senderKey) {
		const record = new SenderKeyRecord()
		await auth.keys.set({ 'sender-key': { [senderName]: record } })
	}

	await builder.process(senderName, senderMsg)
}

export const decryptSignalProto = async(user: string, type: 'pkmsg' | 'msg', msg: Buffer | Uint8Array, auth: SignalAuthState) => {
	const addr = jidToSignalProtocolAddress(user)
	const session = new libsignal.SessionCipher(signalStorage(auth), addr)
	let result: Buffer
	switch (type) {
	case 'pkmsg':
		result = await session.decryptPreKeyWhisperMessage(msg)
		break
	case 'msg':
		result = await session.decryptWhisperMessage(msg)
		break
	}

	return result
}


export const encryptSignalProto = async(user: string, buffer: Buffer, auth: SignalAuthState) => {
	const addr = jidToSignalProtocolAddress(user)
	const cipher = new libsignal.SessionCipher(signalStorage(auth), addr)

	const { type: sigType, body } = await cipher.encrypt(buffer)
	const type = sigType === 3 ? 'pkmsg' : 'msg'
	return { type, ciphertext: Buffer.from(body, 'binary') }
}

export const encryptSenderKeyMsgSignalProto = async(group: string, data: Uint8Array | Buffer, meId: string, auth: SignalAuthState) => {
	const storage = signalStorage(auth)
	const senderName = jidToSignalSenderKeyName(group, meId)
	const builder = new GroupSessionBuilder(storage)

	const { [senderName]: senderKey } = await auth.keys.get('sender-key', [senderName])
	if(!senderKey) {
		const record = new SenderKeyRecord()
		await auth.keys.set({ 'sender-key': { [senderName]: record } })
	}

	const senderKeyDistributionMessage = await builder.create(senderName)
	const session = new GroupCipher(storage, senderName)
	return {
		ciphertext: await session.encrypt(data) as Uint8Array,
		senderKeyDistributionMessageKey: senderKeyDistributionMessage.serialize() as Buffer,
	}
}

export const parseAndInjectE2ESessions = async(node: BinaryNode, auth: SignalAuthState) => {
	const extractKey = (key: BinaryNode) => (
		key ? ({
			keyId: getBinaryNodeChildUInt(key, 'id', 3),
			publicKey: generateSignalPubKey(getBinaryNodeChildBuffer(key, 'value')!),
			signature: getBinaryNodeChildBuffer(key, 'signature'),
		}) : undefined
	)
	const nodes = getBinaryNodeChildren(getBinaryNodeChild(node, 'list'), 'user')
	for(const node of nodes) {
		assertNodeErrorFree(node)
	}

	await Promise.all(
		nodes.map(
			async node => {
				const signedKey = getBinaryNodeChild(node, 'skey')!
				const key = getBinaryNodeChild(node, 'key')!
				const identity = getBinaryNodeChildBuffer(node, 'identity')!
				const jid = node.attrs.jid
				const registrationId = getBinaryNodeChildUInt(node, 'registration', 4)

				const device = {
					registrationId,
					identityKey: generateSignalPubKey(identity),
					signedPreKey: extractKey(signedKey),
					preKey: extractKey(key)
				}
				const cipher = new libsignal.SessionBuilder(signalStorage(auth), jidToSignalProtocolAddress(jid))
				await cipher.initOutgoing(device)
			}
		)
	)
}

export const extractDeviceJids = (result: BinaryNode, myJid: string, excludeZeroDevices: boolean) => {
	const { user: myUser, device: myDevice } = jidDecode(myJid)!
	const extracted: JidWithDevice[] = []
	for(const node of result.content as BinaryNode[]) {
		const list = getBinaryNodeChild(node, 'list')?.content
		if(list && Array.isArray(list)) {
			for(const item of list) {
				const { user } = jidDecode(item.attrs.jid)!
				const devicesNode = getBinaryNodeChild(item, 'devices')
				const deviceListNode = getBinaryNodeChild(devicesNode, 'device-list')
				if(Array.isArray(deviceListNode?.content)) {
					for(const { tag, attrs } of deviceListNode!.content) {
						const device = +attrs.id
						if(
							tag === 'device' && // ensure the "device" tag
							(!excludeZeroDevices || device !== 0) && // if zero devices are not-excluded, or device is non zero
							(myUser !== user || myDevice !== device) && // either different user or if me user, not this device
							(device === 0 || !!attrs['key-index']) // ensure that "key-index" is specified for "non-zero" devices, produces a bad req otherwise
						) {
							extracted.push({ user, device })
						}
					}
				}
			}
		}
	}

	return extracted
}

/**
 * get the next N keys for upload or processing
 * @param count number of pre-keys to get or generate
 */
export const getNextPreKeys = async({ creds, keys }: AuthenticationState, count: number) => {
	const { newPreKeys, lastPreKeyId, preKeysRange } = generateOrGetPreKeys(creds, count)

	const update: Partial<AuthenticationCreds> = {
		nextPreKeyId: Math.max(lastPreKeyId + 1, creds.nextPreKeyId),
		firstUnuploadedPreKeyId: Math.max(creds.firstUnuploadedPreKeyId, lastPreKeyId + 1)
	}

	await keys.set({ 'pre-key': newPreKeys })

	const preKeys = await getPreKeys(keys, preKeysRange[0], preKeysRange[0] + preKeysRange[1])

	return { update, preKeys }
}

export const getNextPreKeysNode = async(state: AuthenticationState, count: number) => {
	const { creds } = state
	const { update, preKeys } = await getNextPreKeys(state, count)

	const node: BinaryNode = {
		tag: 'iq',
		attrs: {
			xmlns: 'encrypt',
			type: 'set',
			to: S_WHATSAPP_NET,
		},
		content: [
			{ tag: 'registration', attrs: { }, content: encodeBigEndian(creds.registrationId) },
			{ tag: 'type', attrs: { }, content: KEY_BUNDLE_TYPE },
			{ tag: 'identity', attrs: { }, content: creds.signedIdentityKey.public },
			{ tag: 'list', attrs: { }, content: Object.keys(preKeys).map(k => xmppPreKey(preKeys[+k], +k)) },
			xmppSignedPreKey(creds.signedPreKey)
		]
	}

	return { update, node }
}