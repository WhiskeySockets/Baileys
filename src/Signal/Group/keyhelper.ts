import { generateKeyPair } from 'libsignal/src/curve'
import { Buffer } from 'node:buffer'
import * as nodeCrypto from 'node:crypto'

type KeyPairType = ReturnType<typeof generateKeyPair>

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
		key = generateKeyPair()
	}

	return {
		public: Buffer.from(key.pubKey),
		private: Buffer.from(key.privKey)
	}
}
