import { KEY_BUNDLE_TYPE } from '../Defaults'
import type { SignalRepositoryWithLIDStore } from '../Types'
import type {
	AuthenticationCreds,
	AuthenticationState,
	KeyPair,
	SignalIdentity,
	SignalKeyStore,
	SignedKeyPair
} from '../Types/Auth'
import {
	assertNodeErrorFree,
	type BinaryNode,
	type FullJid,
	getBinaryNodeChild,
	getBinaryNodeChildBuffer,
	getBinaryNodeChildren,
	getBinaryNodeChildUInt,
	getServerFromDomainType,
	jidDecode,
	S_WHATSAPP_NET,
	WAJIDDomains
} from '../WABinary'
import type { DeviceListData, ParsedDeviceInfo, USyncQueryResultList } from '../WAUSync'
import { Curve, generateSignalPubKey } from './crypto'
import { encodeBigEndian } from './generics'

function chunk<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = []
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size))
	}

	return chunks
}

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

const isValidUInt = (n: number | undefined): n is number => typeof n === 'number' && Number.isInteger(n)

/**
 * Extract a Signal E2E session bundle from a `<receipt type="retry">` stanza.
 *
 * When WhatsApp asks us to resend a message it can attach a fresh `<keys>` prekey
 * bundle so the recipient is sure to have a matching session. Returning `null`
 * means "no usable bundle" — the caller should fall back to the usual prekey
 * IQ fetch path. Every nested field is validated (type byte, expected lengths,
 * registration id) so a malformed receipt never reaches the SessionBuilder.
 */
export const extractE2ESessionFromRetryReceipt = (receipt: BinaryNode) => {
	const keysNode = getBinaryNodeChild(receipt, 'keys')
	if (!keysNode) return null

	const typeBuf = getBinaryNodeChildBuffer(keysNode, 'type')
	if (!typeBuf || typeBuf.length !== 1 || typeBuf[0] !== KEY_BUNDLE_TYPE[0]) return null

	const identity = getBinaryNodeChildBuffer(keysNode, 'identity')
	const skey = getBinaryNodeChild(keysNode, 'skey')
	// Identity / signed pre-key value / pre-key value may arrive as raw 32 bytes
	// or already-prefixed 33 bytes (`generateSignalPubKey` handles both forms —
	// see Utils/crypto.ts:9-11, and the parseAndInjectE2ESessions test uses 33).
	// Reject only when neither length matches.
	if (!identity || (identity.length !== 32 && identity.length !== 33) || !skey) return null

	// Strict length check: <registration> must be exactly 4 bytes. Without this,
	// `getBinaryNodeChildUInt` happily decodes the first 4 bytes of an overlong
	// buffer and accepts trailing garbage — the parser must reject malformed
	// receipts before any payload reaches `SessionBuilder.initOutgoing`.
	const regBuf = getBinaryNodeChildBuffer(receipt, 'registration')
	if (!regBuf || regBuf.length !== 4) return null
	const registrationId = getBinaryNodeChildUInt(receipt, 'registration', 4)
	if (!isValidUInt(registrationId)) return null

	const signedPubKey = getBinaryNodeChildBuffer(skey, 'value')
	const signedSig = getBinaryNodeChildBuffer(skey, 'signature')
	// Accept both 32-byte raw and 33-byte already-prefixed pub keys (see above).
	// Signatures are always exactly 64 bytes (Ed25519/Curve25519) — reject anything
	// else, including the empty buffer that `getBinaryNodeChildBuffer` would
	// otherwise pass through as truthy.
	if (
		!signedPubKey ||
		(signedPubKey.length !== 32 && signedPubKey.length !== 33) ||
		!signedSig ||
		signedSig.length !== 64
	) {
		return null
	}

	const signedKeyIdBuf = getBinaryNodeChildBuffer(skey, 'id')
	if (!signedKeyIdBuf || signedKeyIdBuf.length !== 3) return null
	const signedKeyId = getBinaryNodeChildUInt(skey, 'id', 3)
	if (!isValidUInt(signedKeyId)) return null

	const preKeyNode = getBinaryNodeChild(keysNode, 'key')
	let preKey: { keyId: number; publicKey: Uint8Array } | undefined
	if (preKeyNode) {
		const preKeyPub = getBinaryNodeChildBuffer(preKeyNode, 'value')
		const preKeyIdBuf = getBinaryNodeChildBuffer(preKeyNode, 'id')
		// Same 32-or-33 acceptance as identity / signed pub key.
		if (
			!preKeyPub ||
			(preKeyPub.length !== 32 && preKeyPub.length !== 33) ||
			!preKeyIdBuf ||
			preKeyIdBuf.length !== 3
		) {
			return null
		}

		const preKeyId = getBinaryNodeChildUInt(preKeyNode, 'id', 3)
		if (!isValidUInt(preKeyId)) return null

		preKey = { keyId: preKeyId, publicKey: generateSignalPubKey(preKeyPub) }
	}

	return {
		registrationId,
		identityKey: generateSignalPubKey(identity),
		signedPreKey: {
			keyId: signedKeyId,
			publicKey: generateSignalPubKey(signedPubKey),
			signature: signedSig
		},
		preKey
	}
}

export const parseAndInjectE2ESessions = async (node: BinaryNode, repository: SignalRepositoryWithLIDStore) => {
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
		for (const node of nodesChunk) {
			const signedKey = getBinaryNodeChild(node, 'skey')!
			const key = getBinaryNodeChild(node, 'key')!
			const identity = getBinaryNodeChildBuffer(node, 'identity')!
			const jid = node.attrs.jid!

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
		}
	}
}

export const extractDeviceJids = (
	result: USyncQueryResultList[],
	myJid: string,
	myLid: string,
	excludeZeroDevices: boolean
) => {
	const { user: myUser, device: myDevice } = jidDecode(myJid)!

	const extracted: FullJid[] = []

	for (const userResult of result) {
		const { devices, id } = userResult as { devices: ParsedDeviceInfo; id: string }
		const decoded = jidDecode(id)!,
			{ user, server } = decoded
		let { domainType } = decoded
		const deviceList = devices?.deviceList as DeviceListData[]
		if (!Array.isArray(deviceList)) continue
		for (const { id: device, keyIndex, isHosted } of deviceList) {
			if (
				(!excludeZeroDevices || device !== 0) && // if zero devices are not-excluded, or device is non zero
				((myUser !== user && myLid !== user) || myDevice !== device) && // either different user or if me user, not this device
				(device === 0 || !!keyIndex) // ensure that "key-index" is specified for "non-zero" devices, produces a bad req otherwise
			) {
				if (isHosted) {
					domainType = domainType === WAJIDDomains.LID ? WAJIDDomains.HOSTED_LID : WAJIDDomains.HOSTED
				}

				extracted.push({
					user,
					device,
					domainType,
					server: getServerFromDomainType(server, domainType)
				})
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
			{ tag: 'list', attrs: {}, content: Object.keys(preKeys).map(k => xmppPreKey(preKeys[+k]!, +k)) },
			xmppSignedPreKey(creds.signedPreKey)
		]
	}

	return { update, node }
}
