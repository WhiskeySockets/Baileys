import { Boom } from '@hapi/boom'
import { createHash } from 'crypto'
import { proto } from '../../WAProto'
import { KEY_BUNDLE_TYPE } from '../Defaults'
import type { AuthenticationCreds, SignalCreds, SocketConfig } from '../Types'
import { BinaryNode, getBinaryNodeChild, jidDecode, S_WHATSAPP_NET } from '../WABinary'
import { Curve, hmacSign } from './crypto'
import { encodeBigEndian } from './generics'
import { createSignalIdentity } from './signal'

type ClientPayloadConfig = Pick<SocketConfig, 'version' | 'browser' | 'syncFullHistory'>

const getUserAgent = ({ version }: ClientPayloadConfig): proto.IUserAgent => {
	const osVersion = '0.1'
	return {
		appVersion: {
			primary: version[0],
			secondary: version[1],
			tertiary: version[2],
		},
		platform: proto.UserAgent.UserAgentPlatform.WEB,
		releaseChannel: proto.UserAgent.UserAgentReleaseChannel.RELEASE,
		mcc: '000',
		mnc: '000',
		osVersion: osVersion,
		manufacturer: '',
		device: 'Desktop',
		osBuildNumber: osVersion,
		localeLanguageIso6391: 'en',
		localeCountryIso31661Alpha2: 'US',
	}
}

const PLATFORM_MAP = {
	'Mac OS': proto.WebInfo.WebInfoWebSubPlatform.DARWIN,
	'Windows': proto.WebInfo.WebInfoWebSubPlatform.WIN32
}

const getWebInfo = (config: ClientPayloadConfig): proto.IWebInfo => {
	let webSubPlatform = proto.WebInfo.WebInfoWebSubPlatform.WEB_BROWSER
	if(config.syncFullHistory && PLATFORM_MAP[config.browser[0]]) {
		webSubPlatform = PLATFORM_MAP[config.browser[0]]
	}

	return { webSubPlatform }
}

const getClientPayload = (config: ClientPayloadConfig): proto.IClientPayload => {
	return {
		connectType: proto.ClientPayload.ClientPayloadConnectType.WIFI_UNKNOWN,
		connectReason: proto.ClientPayload.ClientPayloadConnectReason.USER_ACTIVATED,
		userAgent: getUserAgent(config),
		webInfo: getWebInfo(config),
	}
}

export const generateLoginNode = (userJid: string, config: ClientPayloadConfig): proto.IClientPayload => {
	const { user, device } = jidDecode(userJid)!
	const payload: proto.IClientPayload = {
		...getClientPayload(config),
		passive: true,
		username: +user,
		device: device,
	}
	return proto.ClientPayload.fromObject(payload)
}

export const generateRegistrationNode = (
	{ registrationId, signedPreKey, signedIdentityKey }: SignalCreds,
	config: ClientPayloadConfig
) => {
	// the app version needs to be md5 hashed
	// and passed in
	const appVersionBuf = createHash('md5')
		.update(config.version.join('.')) // join as string
		.digest()
	const browserVersion = config.browser[2].split('.')

	const companion: proto.IDeviceProps = {
		os: config.browser[0],
		version: {
			primary: +(browserVersion[0] || 0),
			secondary: +(browserVersion[1] || 1),
			tertiary: +(browserVersion[2] || 0),
		},
		platformType: proto.DeviceProps.DevicePropsPlatformType[config.browser[1].toUpperCase()]
			|| proto.DeviceProps.DevicePropsPlatformType.UNKNOWN,
		requireFullSync: config.syncFullHistory,
	}

	const companionProto = proto.DeviceProps.encode(companion).finish()

	const registerPayload: proto.IClientPayload = {
		...getClientPayload(config),
		passive: false,
		devicePairingData: {
			buildHash: appVersionBuf,
			deviceProps: companionProto,
			eRegid: encodeBigEndian(registrationId),
			eKeytype: KEY_BUNDLE_TYPE,
			eIdent: signedIdentityKey.public,
			eSkeyId: encodeBigEndian(signedPreKey.keyId, 3),
			eSkeyVal: signedPreKey.keyPair.public,
			eSkeySig: signedPreKey.signature,
		},
	}

	return proto.ClientPayload.fromObject(registerPayload)
}

export const configureSuccessfulPairing = (
	stanza: BinaryNode,
	{ advSecretKey, signedIdentityKey, signalIdentities }: Pick<AuthenticationCreds, 'advSecretKey' | 'signedIdentityKey' | 'signalIdentities'>
) => {
	const msgId = stanza.attrs.id

	const pairSuccessNode = getBinaryNodeChild(stanza, 'pair-success')

	const deviceIdentityNode = getBinaryNodeChild(pairSuccessNode, 'device-identity')
	const platformNode = getBinaryNodeChild(pairSuccessNode, 'platform')
	const deviceNode = getBinaryNodeChild(pairSuccessNode, 'device')
	const businessNode = getBinaryNodeChild(pairSuccessNode, 'biz')

	if(!deviceIdentityNode || !deviceNode) {
		throw new Boom('Missing device-identity or device in pair success node', { data: stanza })
	}

	const bizName = businessNode?.attrs.name
	const jid = deviceNode.attrs.jid

	const { details, hmac } = proto.ADVSignedDeviceIdentityHMAC.decode(deviceIdentityNode.content as Buffer)
	// check HMAC matches
	const advSign = hmacSign(details, Buffer.from(advSecretKey, 'base64'))
	if(Buffer.compare(hmac, advSign) !== 0) {
		throw new Boom('Invalid account signature')
	}

	const account = proto.ADVSignedDeviceIdentity.decode(details)
	const { accountSignatureKey, accountSignature, details: deviceDetails } = account
	// verify the device signature matches
	const accountMsg = Buffer.concat([ Buffer.from([6, 0]), deviceDetails, signedIdentityKey.public ])
	if(!Curve.verify(accountSignatureKey, accountMsg, accountSignature)) {
		throw new Boom('Failed to verify account signature')
	}

	// sign the details with our identity key
	const deviceMsg = Buffer.concat([ Buffer.from([6, 1]), deviceDetails, signedIdentityKey.public, accountSignatureKey ])
	account.deviceSignature = Curve.sign(signedIdentityKey.private, deviceMsg)

	const identity = createSignalIdentity(jid, accountSignatureKey)
	const accountEnc = proto.ADVSignedDeviceIdentity
		.encode({
			...account,
			// do not provide the "accountSignatureKey" back
			accountSignatureKey: undefined
		})
		.finish()

	const deviceIdentity = proto.ADVDeviceIdentity.decode(account.details)

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
						attrs: { 'key-index': deviceIdentity.keyIndex.toString() },
						content: accountEnc
					}
				]
			}
		]
	}

	const authUpdate: Partial<AuthenticationCreds> = {
		account,
		me: { id: jid, name: bizName },
		signalIdentities: [
			...(signalIdentities || []),
			identity
		],
		platform: platformNode?.attrs.name
	}

	return {
		creds: authUpdate,
		reply
	}
}
