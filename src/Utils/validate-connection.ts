import { Boom } from '@hapi/boom'
import { createHash } from 'crypto'
import { proto } from '../../WAProto'
import type { AuthenticationCreds, SignalCreds, SocketConfig } from '../Types'
import { Binary, BinaryNode, getAllBinaryNodeChildren, jidDecode, S_WHATSAPP_NET } from '../WABinary'
import { Curve, hmacSign } from './crypto'
import { encodeInt } from './generics'
import { createSignalIdentity } from './signal'

const getUserAgent = ({ version }: Pick<SocketConfig, 'version'>): proto.IUserAgent => ({
	appVersion: {
		primary: version[0],
		secondary: version[1],
		tertiary: version[2],
	},
	platform: proto.UserAgent.UserAgentPlatform.WEB,
	releaseChannel: proto.UserAgent.UserAgentReleaseChannel.RELEASE,
	mcc: '000',
	mnc: '000',
	osVersion: '0.1',
	manufacturer: '',
	device: 'Desktop',
	osBuildNumber: '0.1.0',
	localeLanguageIso6391: 'en',
	localeCountryIso31661Alpha2: 'en',
})

const getWebInfo = (): proto.IWebInfo => ({
	webSubPlatform: proto.WebInfo.WebInfoWebSubPlatform.WEB_BROWSER
})

export const generateLoginNode = (userJid: string, config: Pick<SocketConfig, 'version' | 'browser'>) => {
	const { user, device } = jidDecode(userJid)
	const payload: proto.IClientPayload = {
		passive: true,
		connectType: proto.ClientPayload.ClientPayloadConnectType.WIFI_UNKNOWN,
		connectReason: proto.ClientPayload.ClientPayloadConnectReason.USER_ACTIVATED,
		userAgent: getUserAgent(config),
		webInfo: getWebInfo(),
		username: +user,
		device: device,
	}
	return proto.ClientPayload.encode(payload).finish()
}

export const generateRegistrationNode = (
	{ registrationId, signedPreKey, signedIdentityKey }: SignalCreds,
	config: Pick<SocketConfig, 'version' | 'browser'>
) => {
	// the app version needs to be md5 hashed
	// and passed in
	const appVersionBuf = createHash('md5')
		.update(config.version.join('.')) // join as string
		.digest()
	const browserVersion = config.browser[2].split('.')

	const companion: proto.ICompanionProps = {
		os: config.browser[0],
		version: {
			primary: +(browserVersion[0] || 10),
			secondary: +(browserVersion[1] || 0),
			tertiary: +(browserVersion[2] || 0),
		},
		platformType: proto.CompanionProps.CompanionPropsPlatformType.CHROME,
		requireFullSync: false,
	}

	const companionProto = proto.CompanionProps.encode(companion).finish()

	const registerPayload: proto.IClientPayload = {
		connectReason: proto.ClientPayload.ClientPayloadConnectReason.USER_ACTIVATED,
		connectType: proto.ClientPayload.ClientPayloadConnectType.WIFI_UNKNOWN,
		passive: false,
		regData: {
			buildHash: appVersionBuf,
			companionProps: companionProto,
			eRegid: encodeInt(4, registrationId),
			eKeytype: encodeInt(1, 5),
			eIdent: signedIdentityKey.public,
			eSkeyId: encodeInt(3, signedPreKey.keyId),
			eSkeyVal: signedPreKey.keyPair.public,
			eSkeySig: signedPreKey.signature,
		},
		userAgent: getUserAgent(config),
		webInfo: getWebInfo(),
	}

	return proto.ClientPayload.encode(registerPayload).finish()
}

export const configureSuccessfulPairing = (
	stanza: BinaryNode,
	{ advSecretKey, signedIdentityKey, signalIdentities }: Pick<AuthenticationCreds, 'advSecretKey' | 'signedIdentityKey' | 'signalIdentities'>
) => {
	const [pair] = getAllBinaryNodeChildren(stanza)
	const pairContent = Array.isArray(pair.content) ? pair.content : []

	const msgId = stanza.attrs.id
	const deviceIdentity = pairContent.find(m => m.tag === 'device-identity')?.content
	const businessName = pairContent.find(m => m.tag === 'biz')?.attrs?.name
	const verifiedName = businessName || ''
	const jid = pairContent.find(m => m.tag === 'device')?.attrs?.jid

	const { details, hmac } = proto.ADVSignedDeviceIdentityHMAC.decode(deviceIdentity as Buffer)

	const advSign = hmacSign(details, Buffer.from(advSecretKey, 'base64'))

	if(Buffer.compare(hmac, advSign) !== 0) {
		throw new Boom('Invalid pairing')
	}

	const account = proto.ADVSignedDeviceIdentity.decode(details)
	const { accountSignatureKey, accountSignature } = account

	const accountMsg = Binary.build(new Uint8Array([6, 0]), account.details, signedIdentityKey.public).readByteArray()
	if(!Curve.verify(accountSignatureKey, accountMsg, accountSignature)) {
		throw new Boom('Failed to verify account signature')
	}

	const deviceMsg = Binary.build(new Uint8Array([6, 1]), account.details, signedIdentityKey.public, account.accountSignatureKey).readByteArray()
	account.deviceSignature = Curve.sign(signedIdentityKey.private, deviceMsg)

	const identity = createSignalIdentity(jid, accountSignatureKey)

	const keyIndex = proto.ADVDeviceIdentity.decode(account.details).keyIndex

	const accountEnc = proto.ADVSignedDeviceIdentity.encode({
		...account.toJSON(),
		accountSignatureKey: undefined
	}).finish()

	const reply: BinaryNode = {
		tag: 'iq',
		attrs: {
			to: S_WHATSAPP_NET,
			type: 'result',
			id: msgId,
		},
		content: [
			{
				tag: 'pair-device-sign',
				attrs: { },
				content: [
					{
						tag: 'device-identity',
						attrs: { 'key-index': `${keyIndex}` },
						content: accountEnc
					}
				]
			}
		]
	}

	const authUpdate: Partial<AuthenticationCreds> = {
		account,
		me: { id: jid, verifiedName },
		signalIdentities: [...(signalIdentities || []), identity]
	}
	return {
		creds: authUpdate,
		reply
	}
}