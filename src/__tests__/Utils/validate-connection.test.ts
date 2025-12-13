import {
	generateLoginNode,
	generateRegistrationNode,
	encodeSignedDeviceIdentity
} from '../../Utils/validate-connection'
import { proto } from '../../../WAProto/index.js'
import type { SignalCreds, SocketConfig } from '../../Types'
import { Curve, signedKeyPair } from '../../Utils/crypto'
import { generateRegistrationId } from '../../Utils/generics'

// Mock socket config
const createMockConfig = (overrides?: Partial<SocketConfig>): SocketConfig => {
	return {
		version: [2, 2413, 1] as [number, number, number],
		browser: ['Chrome', 'Desktop', '120.0'],
		countryCode: 'US',
		syncFullHistory: false,
		...overrides
	} as SocketConfig
}

// Create mock signal creds
function createMockSignalCreds(): SignalCreds {
	const identityKey = Curve.generateKeyPair()
	return {
		registrationId: generateRegistrationId(),
		signedPreKey: signedKeyPair(identityKey, 1),
		signedIdentityKey: identityKey
	}
}

describe('generateLoginNode', () => {
	it('should generate login node with correct username', () => {
		const config = createMockConfig()
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		// username is stored as Long type
		expect(Number(loginNode.username)).toBe(1234567890)
	})

	it('should set passive to true', () => {
		const config = createMockConfig()
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.passive).toBe(true)
	})

	it('should set pull to true', () => {
		const config = createMockConfig()
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.pull).toBe(true)
	})

	it('should include device number from JID', () => {
		const config = createMockConfig()
		const userJid = '1234567890:5@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.device).toBe(5)
	})

	it('should include user agent', () => {
		const config = createMockConfig()
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.userAgent).toBeDefined()
		expect(loginNode.userAgent?.appVersion?.primary).toBe(2)
		expect(loginNode.userAgent?.appVersion?.secondary).toBe(2413)
		expect(loginNode.userAgent?.appVersion?.tertiary).toBe(1)
	})

	it('should include web info', () => {
		const config = createMockConfig()
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.webInfo).toBeDefined()
	})

	it('should set country code from config', () => {
		const config = createMockConfig({ countryCode: 'GB' })
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.userAgent?.localeCountryIso31661Alpha2).toBe('GB')
	})
})

describe('generateRegistrationNode', () => {
	it('should generate registration node with device pairing data', () => {
		const config = createMockConfig()
		const creds = createMockSignalCreds()

		const regNode = generateRegistrationNode(creds, config)

		expect(regNode.devicePairingData).toBeDefined()
	})

	it('should set passive to false', () => {
		const config = createMockConfig()
		const creds = createMockSignalCreds()

		const regNode = generateRegistrationNode(creds, config)

		expect(regNode.passive).toBe(false)
	})

	it('should set pull to false', () => {
		const config = createMockConfig()
		const creds = createMockSignalCreds()

		const regNode = generateRegistrationNode(creds, config)

		expect(regNode.pull).toBe(false)
	})

	it('should include registration id', () => {
		const config = createMockConfig()
		const creds = createMockSignalCreds()

		const regNode = generateRegistrationNode(creds, config)

		expect(regNode.devicePairingData?.eRegid).toBeDefined()
		expect(regNode.devicePairingData?.eRegid?.length).toBeGreaterThan(0)
	})

	it('should include signed identity key', () => {
		const config = createMockConfig()
		const creds = createMockSignalCreds()

		const regNode = generateRegistrationNode(creds, config)

		expect(regNode.devicePairingData?.eIdent).toBeDefined()
		expect(regNode.devicePairingData?.eIdent?.length).toBe(32)
	})

	it('should include signed pre-key', () => {
		const config = createMockConfig()
		const creds = createMockSignalCreds()

		const regNode = generateRegistrationNode(creds, config)

		expect(regNode.devicePairingData?.eSkeyVal).toBeDefined()
		expect(regNode.devicePairingData?.eSkeySig).toBeDefined()
		expect(regNode.devicePairingData?.eSkeyId).toBeDefined()
	})

	it('should include build hash', () => {
		const config = createMockConfig()
		const creds = createMockSignalCreds()

		const regNode = generateRegistrationNode(creds, config)

		expect(regNode.devicePairingData?.buildHash).toBeDefined()
		// MD5 hash is 16 bytes
		expect(regNode.devicePairingData?.buildHash?.length).toBe(16)
	})

	it('should include device props', () => {
		const config = createMockConfig()
		const creds = createMockSignalCreds()

		const regNode = generateRegistrationNode(creds, config)

		expect(regNode.devicePairingData?.deviceProps).toBeDefined()
	})

	it('should use Windows sub-platform for Windows browser with full sync', () => {
		const config = createMockConfig({
			browser: ['Windows', 'Desktop', '10'],
			syncFullHistory: true
		})
		const creds = createMockSignalCreds()

		const regNode = generateRegistrationNode(creds, config)

		expect(regNode.webInfo?.webSubPlatform).toBe(proto.ClientPayload.WebInfo.WebSubPlatform.WIN32)
	})

	it('should use Mac sub-platform for Mac OS browser with full sync', () => {
		const config = createMockConfig({
			browser: ['Mac OS', 'Desktop', '14'],
			syncFullHistory: true
		})
		const creds = createMockSignalCreds()

		const regNode = generateRegistrationNode(creds, config)

		expect(regNode.webInfo?.webSubPlatform).toBe(proto.ClientPayload.WebInfo.WebSubPlatform.DARWIN)
	})

	it('should use web browser sub-platform without full sync', () => {
		const config = createMockConfig({
			browser: ['Windows', 'Desktop', '10'],
			syncFullHistory: false
		})
		const creds = createMockSignalCreds()

		const regNode = generateRegistrationNode(creds, config)

		expect(regNode.webInfo?.webSubPlatform).toBe(proto.ClientPayload.WebInfo.WebSubPlatform.WEB_BROWSER)
	})
})

describe('encodeSignedDeviceIdentity', () => {
	it('should encode device identity without signature key', () => {
		const account: proto.IADVSignedDeviceIdentity = {
			details: Buffer.from([1, 2, 3]),
			accountSignature: Buffer.from([4, 5, 6]),
			accountSignatureKey: Buffer.from([7, 8, 9]),
			deviceSignature: Buffer.from([10, 11, 12])
		}

		const encoded = encodeSignedDeviceIdentity(account, false)

		expect(encoded).toBeInstanceOf(Uint8Array)
		expect(encoded.length).toBeGreaterThan(0)

		// Decode and verify signature key is not included
		const decoded = proto.ADVSignedDeviceIdentity.decode(encoded)
		expect(decoded.accountSignatureKey).toBeFalsy()
	})

	it('should encode device identity with signature key', () => {
		const account: proto.IADVSignedDeviceIdentity = {
			details: Buffer.from([1, 2, 3]),
			accountSignature: Buffer.from([4, 5, 6]),
			accountSignatureKey: Buffer.from([7, 8, 9]),
			deviceSignature: Buffer.from([10, 11, 12])
		}

		const encoded = encodeSignedDeviceIdentity(account, true)

		expect(encoded).toBeInstanceOf(Uint8Array)

		// Decode and verify signature key is included
		const decoded = proto.ADVSignedDeviceIdentity.decode(encoded)
		expect(decoded.accountSignatureKey).toBeDefined()
		expect(Buffer.from(decoded.accountSignatureKey!)).toEqual(Buffer.from([7, 8, 9]))
	})

	it('should handle empty signature key when including', () => {
		const account: proto.IADVSignedDeviceIdentity = {
			details: Buffer.from([1, 2, 3]),
			accountSignature: Buffer.from([4, 5, 6]),
			accountSignatureKey: Buffer.from([]),
			deviceSignature: Buffer.from([10, 11, 12])
		}

		const encoded = encodeSignedDeviceIdentity(account, true)

		const decoded = proto.ADVSignedDeviceIdentity.decode(encoded)
		// Empty key should be set to null
		expect(decoded.accountSignatureKey).toBeFalsy()
	})

	it('should not modify original account object', () => {
		const originalKey = Buffer.from([7, 8, 9])
		const account: proto.IADVSignedDeviceIdentity = {
			details: Buffer.from([1, 2, 3]),
			accountSignature: Buffer.from([4, 5, 6]),
			accountSignatureKey: originalKey,
			deviceSignature: Buffer.from([10, 11, 12])
		}

		encodeSignedDeviceIdentity(account, false)

		// Original should still have the key
		expect(account.accountSignatureKey).toEqual(originalKey)
	})

	it('should encode all fields correctly', () => {
		const account: proto.IADVSignedDeviceIdentity = {
			details: Buffer.from('device-details'),
			accountSignature: Buffer.from('account-sig'),
			accountSignatureKey: Buffer.from('signature-key'),
			deviceSignature: Buffer.from('device-sig')
		}

		const encoded = encodeSignedDeviceIdentity(account, true)
		const decoded = proto.ADVSignedDeviceIdentity.decode(encoded)

		expect(Buffer.from(decoded.details!).toString()).toBe('device-details')
		expect(Buffer.from(decoded.accountSignature!).toString()).toBe('account-sig')
		expect(Buffer.from(decoded.deviceSignature!).toString()).toBe('device-sig')
	})
})

describe('user agent generation', () => {
	it('should use WEB platform', () => {
		const config = createMockConfig()
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.userAgent?.platform).toBe(proto.ClientPayload.UserAgent.Platform.WEB)
	})

	it('should use RELEASE channel', () => {
		const config = createMockConfig()
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.userAgent?.releaseChannel).toBe(proto.ClientPayload.UserAgent.ReleaseChannel.RELEASE)
	})

	it('should set device as Desktop', () => {
		const config = createMockConfig()
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.userAgent?.device).toBe('Desktop')
	})

	it('should set locale language to en', () => {
		const config = createMockConfig()
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.userAgent?.localeLanguageIso6391).toBe('en')
	})
})

describe('connection type', () => {
	it('should set connect type to WIFI_UNKNOWN', () => {
		const config = createMockConfig()
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.connectType).toBe(proto.ClientPayload.ConnectType.WIFI_UNKNOWN)
	})

	it('should set connect reason to USER_ACTIVATED', () => {
		const config = createMockConfig()
		const userJid = '1234567890@s.whatsapp.net'

		const loginNode = generateLoginNode(userJid, config)

		expect(loginNode.connectReason).toBe(proto.ClientPayload.ConnectReason.USER_ACTIVATED)
	})
})
