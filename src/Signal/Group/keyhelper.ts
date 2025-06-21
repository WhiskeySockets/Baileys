import * as nodeCrypto from 'crypto'
import { generateKeyPair } from '../../crypto'
import { SignalKeyPair } from '../../Types'

export function generateSenderKey(): Buffer {
	return nodeCrypto.randomBytes(32)
}

export function generateSenderKeyId(): number {
	return nodeCrypto.randomInt(2147483647)
}

interface SigningKeyPair {
	public: Buffer
	private: Buffer
}

export function generateSenderSigningKey(key?: SignalKeyPair): SigningKeyPair {
	if (!key) {
		key = generateKeyPair()
	}

	return {
		public: Buffer.from(key.pubKey),
		private: Buffer.from(key.privKey)
	}
}
