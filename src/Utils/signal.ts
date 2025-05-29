import { chunk } from 'lodash'
import { KEY_BUNDLE_TYPE } from '../Defaults'
import { SignalRepository } from '../Types'
import {
	AuthenticationCreds,
	AuthenticationState,
	KeyPair,
	SignalIdentity,
	SignalKeyStore,
	SignedKeyPair
} from '../Types/Auth'
import {
	assertNodeErrorFree,
	BinaryNode,
	getBinaryNodeChild,
	getBinaryNodeChildBuffer,
	getBinaryNodeChildren,
	getBinaryNodeChildUInt,
	jidDecode,
	JidWithDevice,
	S_WHATSAPP_NET
} from '../WABinary'
import { DeviceListData, ParsedDeviceInfo, USyncQueryResultList } from '../WAUSync'
import { Curve, generateSignalPubKey } from './crypto'
import { encodeBigEndian } from './generics'

export const createSignalIdentity = (wid: string, accountSignatureKey: Uint8Array): SignalIdentity => {
	return {
		identifier: { name: wid, deviceId: 0 },
		identifierKey: generateSignalPubKey(accountSignatureKey)
	}
}

export const getPreKeys = async ({ get }: SignalKeyStore, min: number, limit: number) => {
	const idList: string[] = []
	for (let id = min; id < limit; id++) {
		idList.push(id.toString())
	}

	return get('pre-key', idList)
}

export const generateOrGetPreKeys = (creds: AuthenticationCreds, range: number) => {
	const avaliable = creds.nextPreKeyId - creds.firstUnuploadedPreKeyId
	const remaining = range - avaliable
	const lastPreKeyId = creds.nextPreKeyId + remaining - 1
	const newPreKeys: { [id: number]: KeyPair } = {}
	if (remaining > 0) {
		for (let i = creds.nextPreKeyId; i <= lastPreKeyId; i++) {
			newPreKeys[i] = Curve.generateKeyPair()
		}
	}

	return {
		newPreKeys,
		lastPreKeyId,
		preKeysRange: [creds.firstUnuploadedPreKeyId, range] as const
	}
}

export const xmppSignedPreKey = (key: SignedKeyPair): BinaryNode => ({
	tag: 'skey',
	attrs: {},
	content: [
		{ tag: 'id', attrs: {}, content: encodeBigEndian(key.keyId, 3) },
		{ tag: 'value', attrs: {}, content: key.keyPair.public },
		{ tag: 'signature', attrs: {}, content: key.signature }
	]
})

export const xmppPreKey = (pair: KeyPair, id: number): BinaryNode => ({
	tag: 'key',
	attrs: {},
	content: [
		{ tag: 'id', attrs: {}, content: encodeBigEndian(id, 3) },
		{ tag: 'value', attrs: {}, content: pair.public }
	]
})

export const parseAndInjectE2ESessions = async (node: BinaryNode, repository: SignalRepository) => {
	const extractKey = (key: BinaryNode) =>
		key
			? {
					keyId: getBinaryNodeChildUInt(key, 'id', 3)!,
					publicKey: generateSignalPubKey(getBinaryNodeChildBuffer(key, 'value')!),
					signature: getBinaryNodeChildBuffer(key, 'signature')!
				}
			: undefined
	const nodes = getBinaryNodeChildren(getBinaryNodeChild(node, 'list'), 'user')
	for (const node of nodes) {
		assertNodeErrorFree(node)
	}

	// Most of the work in repository.injectE2ESession is CPU intensive, not IO
	// So Promise.all doesn't really help here,
	// but blocks even loop if we're using it inside keys.transaction, and it makes it "sync" actually
	// This way we chunk it in smaller parts and between those parts we can yield to the event loop
	// It's rare case when you need to E2E sessions for so many users, but it's possible
	const chunkSize = 100
	const chunks = chunk(nodes, chunkSize)
	for (const nodesChunk of chunks) {
		await Promise.all(
			nodesChunk.map(async node => {
				const signedKey = getBinaryNodeChild(node, 'skey')!
				const key = getBinaryNodeChild(node, 'key')!
				const identity = getBinaryNodeChildBuffer(node, 'identity')!
				const jid = node.attrs.jid
				const registrationId = getBinaryNodeChildUInt(node, 'registration', 4)

				await repository.injectE2ESession({
					jid,
					session: {
						registrationId: registrationId!,
						identityKey: generateSignalPubKey(identity),
						signedPreKey: extractKey(signedKey)!,
						preKey: extractKey(key)!
					}
				})
			})
		)
	}
}

export const extractDeviceJids = (result: USyncQueryResultList[], myJid: string, excludeZeroDevices: boolean) => {
	const { user: myUser, device: myDevice } = jidDecode(myJid)!

	const extracted: JidWithDevice[] = []

	for (const userResult of result) {
		const { devices, id } = userResult as { devices: ParsedDeviceInfo; id: string }
		const { user } = jidDecode(id)!
		const deviceList = devices?.deviceList as DeviceListData[]
		if (Array.isArray(deviceList)) {
			for (const { id: device, keyIndex } of deviceList) {
				if (
					(!excludeZeroDevices || device !== 0) && // if zero devices are not-excluded, or device is non zero
					(myUser !== user || myDevice !== device) && // either different user or if me user, not this device
					(device === 0 || !!keyIndex) // ensure that "key-index" is specified for "non-zero" devices, produces a bad req otherwise
				) {
					extracted.push({ user, device })
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
export const getNextPreKeys = async ({ creds, keys }: AuthenticationState, count: number) => {
	const { newPreKeys, lastPreKeyId, preKeysRange } = generateOrGetPreKeys(creds, count)

	const update: Partial<AuthenticationCreds> = {
		nextPreKeyId: Math.max(lastPreKeyId + 1, creds.nextPreKeyId),
		firstUnuploadedPreKeyId: Math.max(creds.firstUnuploadedPreKeyId, lastPreKeyId + 1)
	}

	await keys.set({ 'pre-key': newPreKeys })

	const preKeys = await getPreKeys(keys, preKeysRange[0], preKeysRange[0] + preKeysRange[1])

	return { update, preKeys }
}

export const getNextPreKeysNode = async (state: AuthenticationState, count: number) => {
	const { creds } = state
	const { update, preKeys } = await getNextPreKeys(state, count)

	const node: BinaryNode = {
		tag: 'iq',
		attrs: {
			xmlns: 'encrypt',
			type: 'set',
			to: S_WHATSAPP_NET
		},
		content: [
			{ tag: 'registration', attrs: {}, content: encodeBigEndian(creds.registrationId) },
			{ tag: 'type', attrs: {}, content: KEY_BUNDLE_TYPE },
			{ tag: 'identity', attrs: {}, content: creds.signedIdentityKey.public },
			{ tag: 'list', attrs: {}, content: Object.keys(preKeys).map(k => xmppPreKey(preKeys[+k], +k)) },
			xmppSignedPreKey(creds.signedPreKey)
		]
	}

	return { update, node }
}
