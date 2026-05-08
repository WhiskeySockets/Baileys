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
		chainKey?: Uint8Array | null | string,
		signatureKeyPair?: { public: Uint8Array | string; private: Uint8Array | string } | null,
		signatureKeyPublic?: Uint8Array | string | null,
		signatureKeyPrivate?: Uint8Array | string | null,
		senderKeyStateStructure?: SenderKeyStateStructure | null
	) {
		if (senderKeyStateStructure) {
			this.senderKeyStateStructure = {
				...senderKeyStateStructure,
				senderMessageKeys: Array.isArray(senderKeyStateStructure.senderMessageKeys)
					? senderKeyStateStructure.senderMessageKeys
					: []
			}
		} else {
			if (signatureKeyPair) {
				signatureKeyPublic = signatureKeyPair.public
				signatureKeyPrivate = signatureKeyPair.private
			}

			this.senderKeyStateStructure = {
				senderKeyId: id || 0,
				senderChainKey: {
					iteration: iteration || 0,
					seed: Buffer.from(chainKey || [])
				},
				senderSigningKey: {
					public: Buffer.from(signatureKeyPublic || []),
					private: Buffer.from(signatureKeyPrivate || [])
				},
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
		const publicKey = Buffer.from(this.senderKeyStateStructure.senderSigningKey.public)

		if (publicKey.length === 32) {
			const fixed = Buffer.alloc(33)
			fixed[0] = 0x05
			publicKey.copy(fixed, 1)
			return fixed
		}

		return publicKey
	}

	public getSigningKeyPrivate(): Buffer | undefined {
		const privateKey = this.senderKeyStateStructure.senderSigningKey.private

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
			const messageKey = this.senderKeyStateStructure.senderMessageKeys[index]!
			this.senderKeyStateStructure.senderMessageKeys.splice(index, 1)
			return new SenderMessageKey(messageKey.iteration, messageKey.seed)
		}

		return null
	}

	public getStructure(): SenderKeyStateStructure {
		return this.senderKeyStateStructure
	}
}
