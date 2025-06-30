import { SenderChainKey } from './sender-chain-key'
import { SenderMessageKey } from './sender-message-key'

interface SenderChainKeyStructure {
	iteration: number
	seed: Uint8Array
}

interface SenderSigningKeyStructure {
	public: Uint8Array
	private?: Uint8Array
}

interface SenderMessageKeyStructure {
	iteration: number
	seed: Uint8Array
}

interface SenderKeyStateStructure {
	senderKeyId: number
	senderChainKey: SenderChainKeyStructure
	senderSigningKey: SenderSigningKeyStructure
	senderMessageKeys: SenderMessageKeyStructure[]
}

export class SenderKeyState {
	private readonly MAX_MESSAGE_KEYS = 2000
	private readonly senderKeyStateStructure: SenderKeyStateStructure

	constructor(
		id?: number | null,
		iteration?: number | null,
		chainKey?: Uint8Array | null,
		signatureKeyPair?: { public: Uint8Array; private: Uint8Array } | null,
		signatureKeyPublic?: Uint8Array | null,
		signatureKeyPrivate?: Uint8Array | null,
		senderKeyStateStructure?: SenderKeyStateStructure | null
	) {
		if (senderKeyStateStructure) {
			this.senderKeyStateStructure = senderKeyStateStructure
		} else {
			if (signatureKeyPair) {
				signatureKeyPublic = signatureKeyPair.public
				signatureKeyPrivate = signatureKeyPair.private
			}

			chainKey = typeof chainKey === 'string' ? Buffer.from(chainKey, 'base64') : chainKey

			const senderChainKeyStructure: SenderChainKeyStructure = {
				iteration: iteration || 0,
				seed: chainKey || Buffer.alloc(0)
			}

			const signingKeyStructure: SenderSigningKeyStructure = {
				public:
					typeof signatureKeyPublic === 'string'
						? Buffer.from(signatureKeyPublic, 'base64')
						: signatureKeyPublic || Buffer.alloc(0)
			}

			if (signatureKeyPrivate) {
				signingKeyStructure.private =
					typeof signatureKeyPrivate === 'string' ? Buffer.from(signatureKeyPrivate, 'base64') : signatureKeyPrivate
			}

			this.senderKeyStateStructure = {
				senderKeyId: id || 0,
				senderChainKey: senderChainKeyStructure,
				senderSigningKey: signingKeyStructure,
				senderMessageKeys: []
			}
		}
	}

	public getKeyId(): number {
		return this.senderKeyStateStructure.senderKeyId
	}

	public getSenderChainKey(): SenderChainKey {
		return new SenderChainKey(
			this.senderKeyStateStructure.senderChainKey.iteration,
			this.senderKeyStateStructure.senderChainKey.seed
		)
	}

	public setSenderChainKey(chainKey: SenderChainKey): void {
		this.senderKeyStateStructure.senderChainKey = {
			iteration: chainKey.getIteration(),
			seed: chainKey.getSeed()
		}
	}

	public getSigningKeyPublic(): Buffer {
		const publicKey = this.senderKeyStateStructure.senderSigningKey.public
		if (publicKey instanceof Buffer) {
			return publicKey
		} else if (typeof publicKey === 'string') {
			return Buffer.from(publicKey, 'base64')
		}

		return Buffer.from(publicKey || [])
	}

	public getSigningKeyPrivate(): Buffer | undefined {
		const privateKey = this.senderKeyStateStructure.senderSigningKey.private
		if (!privateKey) {
			return undefined
		}

		if (privateKey instanceof Buffer) {
			return privateKey
		} else if (typeof privateKey === 'string') {
			return Buffer.from(privateKey, 'base64')
		}

		return Buffer.from(privateKey || [])
	}

	public hasSenderMessageKey(iteration: number): boolean {
		return this.senderKeyStateStructure.senderMessageKeys.some(key => key.iteration === iteration)
	}

	public addSenderMessageKey(senderMessageKey: SenderMessageKey): void {
		this.senderKeyStateStructure.senderMessageKeys.push({
			iteration: senderMessageKey.getIteration(),
			seed: senderMessageKey.getSeed()
		})

		if (this.senderKeyStateStructure.senderMessageKeys.length > this.MAX_MESSAGE_KEYS) {
			this.senderKeyStateStructure.senderMessageKeys.shift()
		}
	}

	public removeSenderMessageKey(iteration: number): SenderMessageKey | null {
		const index = this.senderKeyStateStructure.senderMessageKeys.findIndex(key => key.iteration === iteration)

		if (index !== -1) {
			const messageKey = this.senderKeyStateStructure.senderMessageKeys[index]
			this.senderKeyStateStructure.senderMessageKeys.splice(index, 1)
			return new SenderMessageKey(messageKey.iteration, messageKey.seed)
		}

		return null
	}

	public getStructure(): SenderKeyStateStructure {
		return this.senderKeyStateStructure
	}
}
