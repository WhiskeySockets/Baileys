import { Boom } from '@hapi/boom'
import { createHash } from 'crypto'
import { KEY_BUNDLE_TYPE } from '../Defaults'
import { AuthenticationCreds, SignalCreds, SocketConfig, WAProto } from '../Types'
import { BinaryNode, getBinaryNodeChild, jidDecode, S_WHATSAPP_NET } from '../WABinary'
import { Curve, hmacSign } from './crypto'
import { encodeBigEndian } from './generics'
import { readBinaryNode, writeBinaryNode } from './proto-utils'
import { createSignalIdentity } from './signal'

const getUserAgent = (config: SocketConfig): WAProto.ClientPayloadUserAgent => {
	const osVersion = config.mobile ? '15.3.1' : '0.1'
	const version = config.mobile ? [2, 24, 6] : config.version
	const device = config.mobile ? 'iPhone_7' : 'Desktop'
	const manufacturer = config.mobile ? 'Apple' : ''
	const platform = config.mobile ? WAProto.ClientPayloadUserAgentPlatform.IOS : WAProto.ClientPayloadUserAgentPlatform.WEB
	const phoneId = config.mobile ? { phoneId: config.auth.creds.phoneId } : {}

	return {
		appVersion: {
			primary: version[0],
			secondary: version[1],
			tertiary: version[2],
		},
		platform,
		releaseChannel: WAProto.ClientPayloadUserAgentReleaseChannel.RELEASE,
		mcc: config.auth.creds.registration?.phoneNumberMobileCountryCode || '000',
		mnc: config.auth.creds.registration?.phoneNumberMobileNetworkCode || '000',
		osVersion: osVersion,
		manufacturer,
		device,
		osBuildNumber: osVersion,
		localeLanguageIso6391: 'en',
		localeCountryIso31661Alpha2: 'US',
		...phoneId
	}
}

const PLATFORM_MAP = {
	'Mac OS': WAProto.ClientPayloadWebInfoWebSubPlatform.DARWIN,
	'Windows': WAProto.ClientPayloadWebInfoWebSubPlatform.WIN32
}

const getWebInfo = (config: SocketConfig): WAProto.ClientPayloadWebInfo => {
	let webSubPlatform = WAProto.ClientPayloadWebInfoWebSubPlatform.WEB_BROWSER
	if(config.syncFullHistory && PLATFORM_MAP[config.browser[0]]) {
		webSubPlatform = PLATFORM_MAP[config.browser[0]]
	}

	return { webSubPlatform }
}


const getClientPayload = (config: SocketConfig) => {
	const payload: WAProto.ClientPayload = {
		connectType: WAProto.ClientPayloadConnectType.WIFI_UNKNOWN,
		connectReason: WAProto.ClientPayloadConnectReason.USER_ACTIVATED,
		userAgent: getUserAgent(config),
	}

	if(!config.mobile) {
		payload.webInfo = getWebInfo(config)
	}

	return payload
}

export const generateMobileNode = (config: SocketConfig): WAProto.ClientPayload => {
	if(!config.auth.creds) {
		throw new Boom('No registration data found', { data: config })
	}

	const payload: WAProto.ClientPayload = {
		...getClientPayload(config),
		sessionId: Math.floor(Math.random() * 999999999 + 1),
		shortConnect: true,
		connectAttemptCount: 0,
		device: 0,
		dnsSource: {
			appCached: false,
			dnsMethod: WAProto.ClientPayloadDNSSourceDNSResolutionMethod.SYSTEM,
		},
		passive: false, // XMPP heartbeat setting (false: server actively pings) (true: client actively pings)
		pushName: 'test',
		username: Number(`${config.auth.creds.registration.phoneNumberCountryCode}${config.auth.creds.registration.phoneNumberNationalNumber}`),
	}
	return payload
}

export const generateLoginNode = (userJid: string, config: SocketConfig): WAProto.ClientPayload => {
	const { user, device } = jidDecode(userJid)!
	const payload: WAProto.ClientPayload = {
		...getClientPayload(config),
		passive: true,
		username: +user,
		device: device,
	}
	return payload
}

const getPlatformType = (platform: string): WAProto.DevicePropsPlatformType => {
	const platformType = platform.toUpperCase()
	return WAProto.DevicePropsPlatformType[platformType] || WAProto.DevicePropsPlatformType.DESKTOP
}

export const generateRegistrationNode = (
	{ registrationId, signedPreKey, signedIdentityKey }: SignalCreds,
	config: SocketConfig
) => {
	// the app version needs to be md5 hashed
	// and passed in
	const appVersionBuf = createHash('md5')
		.update(config.version.join('.')) // join as string
		.digest()

	const companion: WAProto.DeviceProps = {
		os: config.browser[0],
		platformType: getPlatformType(config.browser[1]),
		requireFullSync: config.syncFullHistory,
	}

	const companionProto = writeBinaryNode(WAProto.writeDeviceProps, companion)

	const registerPayload: WAProto.ClientPayload = {
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

	return registerPayload
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

	const { details, hmac } = readBinaryNode(WAProto.readADVSignedDeviceIdentityHMAC, deviceIdentityNode.content as Buffer)

	if(!details || !hmac) {
		throw new Boom('Missing details or hmac in device identity', { data: stanza })
	}

	// check HMAC matches
	const advSign = hmacSign(details, Buffer.from(advSecretKey, 'base64'))
	if(Buffer.compare(hmac, advSign) !== 0) {
		throw new Boom('Invalid account signature')
	}

	const account = readBinaryNode(WAProto.readADVSignedDeviceIdentity, details)
	const { accountSignatureKey, accountSignature, details: deviceDetails } = account

	if(!accountSignatureKey || !accountSignature || !deviceDetails) {
		throw new Boom('Missing accountSignatureKey, accountSignature or deviceDetails in account', { data: stanza })
	}

	// verify the device signature matches
	const accountMsg = Buffer.concat([ Buffer.from([6, 0]), deviceDetails, signedIdentityKey.public ])
	if(!Curve.verify(accountSignatureKey, accountMsg, accountSignature)) {
		throw new Boom('Failed to verify account signature')
	}

	// sign the details with our identity key
	const deviceMsg = Buffer.concat([ Buffer.from([6, 1]), deviceDetails, signedIdentityKey.public, accountSignatureKey ])
	account.deviceSignature = Curve.sign(signedIdentityKey.private, deviceMsg)

	const identity = createSignalIdentity(jid, accountSignatureKey)
	const accountEnc = encodeSignedDeviceIdentity(account, false)

	const deviceIdentity = readBinaryNode(WAProto.readADVDeviceIdentity, account.details!)

	if(!deviceIdentity.keyIndex) {
		throw new Boom('Missing keyIndex in device identity', { data: stanza })
	}

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

export const encodeSignedDeviceIdentity = (
	account: WAProto.ADVSignedDeviceIdentity,
	includeSignatureKey: boolean
) => {
	account = { ...account }
	// set to null if we are not to include the signature key
	// or if we are including the signature key but it is empty
	if(!includeSignatureKey || !account.accountSignatureKey?.length) {
		account.accountSignatureKey = undefined
	}

	return writeBinaryNode(WAProto.writeADVSignedDeviceIdentity, account)
}
