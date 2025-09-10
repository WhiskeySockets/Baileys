declare module 'libsignal/src/crypto' {
	export function decrypt(key: Uint8Array, ciphertext: Uint8Array, iv: Uint8Array): Promise<Uint8Array>

	export function encrypt(key: Uint8Array, plaintext: Uint8Array, iv: Uint8Array): Promise<Buffer>

	export function calculateMAC(key: Buffer, data: Uint8Array): Uint8Array

	export function deriveSecrets(key: Uint8Array, salt: Buffer, info: Buffer): [Buffer, Buffer]
}

declare module 'libsignal/src/curve' {
	export interface KeyPairType {
		pubKey: Uint8Array
		privKey: Uint8Array
	}

	export function generateKeyPair(): KeyPairType

	export function calculateAgreement(publicKey: Uint8Array, privateKey: Uint8Array): Uint8Array

	export function calculateSignature(privateKey: Uint8Array, message: Uint8Array): Uint8Array

	export function verifySignature(publicKey: Uint8Array, message: Uint8Array, signature: Uint8Array): boolean
}

declare module 'libsignal' {
	interface E2ESession {
		registrationId: number
		identityKey: Uint8Array
		signedPreKey: {
			keyId: number
			publicKey: Uint8Array
			signature: Uint8Array
		}
		preKey: {
			keyId: number
			publicKey: Uint8Array
		}
	}

	export interface SignalStorage {
		loadSession(id: string): Promise<SessionRecord | null | undefined>
		storeSession(id: string, session: SessionRecord): Promise<void>
		isTrustedIdentity(identifier: string, identityKey: Uint8Array, direction: number): boolean
		loadPreKey(id: number | string): Promise<{ privKey: Buffer; pubKey: Buffer } | undefined>
		removePreKey(id: number): void
		loadSignedPreKey(): { privKey: Buffer; pubKey: Buffer }
		getOurRegistrationId(): Promise<number> | number
		getOurIdentity(): { privKey: Buffer; pubKey: Buffer }
	}

	export class ProtocolAddress {
		constructor(name: string, deviceId: number)
		public getName(): string
		public getDeviceId(): number
		public toString(): string
	}

	export class SessionRecord {
		static deserialize(serialized: Uint8Array): SessionRecord
		public serialize(): Uint8Array
		public haveOpenSession(): boolean
	}

	export class SessionCipher {
		constructor(storage: SignalStorage, remoteAddress: ProtocolAddress)
		public decryptPreKeyWhisperMessage(ciphertext: Uint8Array): Promise<Buffer>
		public decryptWhisperMessage(ciphertext: Uint8Array): Promise<Buffer>
		public encrypt(data: Uint8Array): Promise<{ type: number; body: string }>
	}

	export class SessionBuilder {
		constructor(storage: SignalStorage, remoteAddress: ProtocolAddress)
		public initOutgoing(session: E2ESession): Promise<void>
	}
}
