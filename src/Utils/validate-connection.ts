import { Boom } from '@hapi/boom'
import { createHash } from 'crypto'
import { proto } from '../../WAProto'
import { KEY_BUNDLE_TYPE } from '../Defaults'
import type { AuthenticationCreds, SignalCreds, SocketConfig } from '../Types'
import { BinaryNode, getBinaryNodeChild, jidDecode, S_WHATSAPP_NET } from '../WABinary'
import { Curve, hmacSign } from './crypto'
import { encodeBigEndian } from './generics'
import { createSignalIdentity } from './signal'

const getUserAgent = (config: SocketConfig): proto.ClientPayload.IUserAgent => {
	return {
		appVersion: {
			primary: config.version[0],
			secondary: config.version[1],
			tertiary: config.version[2]
		},
		platform: proto.ClientPayload.UserAgent.Platform.WEB,
		releaseChannel: proto.ClientPayload.UserAgent.ReleaseChannel.RELEASE,
		osVersion: '0.1',
		device: 'Desktop',
		osBuildNumber: '0.1',
		localeLanguageIso6391: 'en',
		mnc: '000',
		mcc: '000',
		localeCountryIso31661Alpha2: config.countryCode
	}
}

const PLATFORM_MAP = {
	'Mac OS': proto.ClientPayload.WebInfo.WebSubPlatform.DARWIN,
	Windows: proto.ClientPayload.WebInfo.WebSubPlatform.WIN32
}

const getWebInfo = (config: SocketConfig): proto.ClientPayload.IWebInfo => {
	let webSubPlatform = proto.ClientPayload.WebInfo.WebSubPlatform.WEB_BROWSER
	if (config.syncFullHistory && PLATFORM_MAP[config.browser[0]]) {
		webSubPlatform = PLATFORM_MAP[config.browser[0]]
	}

	return { webSubPlatform }
}

const getClientPayload = (config: SocketConfig) => {
	const payload: proto.IClientPayload = {
		connectType: proto.ClientPayload.ConnectType.WIFI_UNKNOWN,
		connectReason: proto.ClientPayload.ConnectReason.USER_ACTIVATED,
		userAgent: getUserAgent(config)
	}

	payload.webInfo = getWebInfo(config)

	return payload
}

export const generateLoginNode = (userJid: string, config: SocketConfig): proto.IClientPayload => {
	const { user, device } = jidDecode(userJid)!
	const payload: proto.IClientPayload = {
		...getClientPayload(config),
		passive: false,
		pull: true,
		username: +user,
		device: device
	}
	return proto.ClientPayload.fromObject(payload)
}

const getPlatformType = (platform: string): proto.DeviceProps.PlatformType => {
	const platformType = platform.toUpperCase()
	return proto.DeviceProps.PlatformType[platformType] || proto.DeviceProps.PlatformType.DESKTOP
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

	const companion: proto.IDeviceProps = {
		os: config.browser[0],
		platformType: getPlatformType(config.browser[1]),
		requireFullSync: config.syncFullHistory
	}

	const companionProto = proto.DeviceProps.encode(companion).finish()

	const registerPayload: proto.IClientPayload = {
		...getClientPayload(config),
		passive: false,
		pull: false,
		devicePairingData: {
			buildHash: appVersionBuf,
			deviceProps: companionProto,
			eRegid: encodeBigEndian(registrationId),
			eKeytype: KEY_BUNDLE_TYPE,
			eIdent: signedIdentityKey.public,
			eSkeyId: encodeBigEndian(signedPreKey.keyId, 3),
			eSkeyVal: signedPreKey.keyPair.public,
			eSkeySig: signedPreKey.signature
		}
	}

	return proto.ClientPayload.fromObject(registerPayload)
}

export const configureSuccessfulPairing = (
	stanza: BinaryNode,
	{
		advSecretKey,
		signedIdentityKey,
		signalIdentities
	}: Pick<AuthenticationCreds, 'advSecretKey' | 'signedIdentityKey' | 'signalIdentities'>
) => {
	const msgId = stanza.attrs.id

	const pairSuccessNode = getBinaryNodeChild(stanza, 'pair-success')

	const deviceIdentityNode = getBinaryNodeChild(pairSuccessNode, 'device-identity')
	const platformNode = getBinaryNodeChild(pairSuccessNode, 'platform')
	const deviceNode = getBinaryNodeChild(pairSuccessNode, 'device')
	const businessNode = getBinaryNodeChild(pairSuccessNode, 'biz')

	if (!deviceIdentityNode || !deviceNode) {
		throw new Boom('Missing device-identity or device in pair success node', { data: stanza })
	}

	const bizName = businessNode?.attrs.name
	const jid = deviceNode.attrs.jid

	const { details, hmac, accountType } = proto.ADVSignedDeviceIdentityHMAC.decode(deviceIdentityNode.content as Buffer)
	const isHostedAccount = accountType !== undefined && accountType === proto.ADVEncryptionType.HOSTED

	const hmacPrefix = isHostedAccount ? Buffer.from([6, 5]) : Buffer.alloc(0)
	const advSign = hmacSign(Buffer.concat([hmacPrefix, details!]), Buffer.from(advSecretKey, 'base64'))
	if (Buffer.compare(hmac!, advSign) !== 0) {
		throw new Boom('Invalid account signature')
	}

	const account = proto.ADVSignedDeviceIdentity.decode(details!)
	const { accountSignatureKey, accountSignature, details: deviceDetails } = account
	const accountMsg = Buffer.concat([Buffer.from([6, 0]), deviceDetails!, signedIdentityKey.public])
	if (!Curve.verify(accountSignatureKey!, accountMsg, accountSignature!)) {
		throw new Boom('Failed to verify account signature')
	}

	const devicePrefix = isHostedAccount ? Buffer.from([6, 6]) : Buffer.from([6, 1])
	const deviceMsg = Buffer.concat([devicePrefix, deviceDetails!, signedIdentityKey.public, accountSignatureKey!])
	account.deviceSignature = Curve.sign(signedIdentityKey.private, deviceMsg)

	const identity = createSignalIdentity(jid, accountSignatureKey!)
	const accountEnc = encodeSignedDeviceIdentity(account, false)

	const deviceIdentity = proto.ADVDeviceIdentity.decode(account.details!)

	const reply: BinaryNode = {
		tag: 'iq',
		attrs: {
			to: S_WHATSAPP_NET,
			type: 'result',
			id: msgId
		},
		content: [
			{
				tag: 'pair-device-sign',
				attrs: {},
				content: [
					{
						tag: 'device-identity',
						attrs: { 'key-index': deviceIdentity.keyIndex!.toString() },
						content: accountEnc
					}
				]
			}
		]
	}

	const authUpdate: Partial<AuthenticationCreds> = {
		account,
		me: { id: jid, name: bizName },
		signalIdentities: [...(signalIdentities || []), identity],
		platform: platformNode?.attrs.name
	}

	return {
		creds: authUpdate,
		reply
	}
}

export const encodeSignedDeviceIdentity = (account: proto.IADVSignedDeviceIdentity, includeSignatureKey: boolean) => {
	account = { ...account }
	// set to null if we are not to include the signature key
	// or if we are including the signature key but it is empty
	if (!includeSignatureKey || !account.accountSignatureKey?.length) {
		account.accountSignatureKey = null
	}

	return proto.ADVSignedDeviceIdentity.encode(account).finish()
}
