import * as nodeCrypto from 'crypto'
import * as  libsignal from '@raphaelvserafim/libsignal'

type KeyPairType = ReturnType<typeof libsignal.curve.generateKeyPair>

export function generateSenderKey(): Buffer {
	return nodeCrypto.randomBytes(32)
}

export function generateSenderKeyId(): number {
	return nodeCrypto.randomInt(2147483647)
}

export interface SigningKeyPair {
	public: Buffer
	private: Buffer
}

export function generateSenderSigningKey(key?: KeyPairType): SigningKeyPair {
	if (!key) {
		key = libsignal.curve.generateKeyPair()
	}

	return {
		public: Buffer.from(key.pubKey),
		private: Buffer.from(key.privKey)
	}
}
