import { proto } from '../../../WAProto'
import { CiphertextMessage } from './ciphertext-message'

interface SenderKeyDistributionMessageStructure {
	id: number
	iteration: number
	chainKey: string | Uint8Array
	signingKey: string | Uint8Array
}

export class SenderKeyDistributionMessage extends CiphertextMessage {
	private readonly id: number
	private readonly iteration: number
	private readonly chainKey: Uint8Array
	private readonly signatureKey: Uint8Array
	private readonly serialized: Uint8Array

	constructor(
		id?: number | null,
		iteration?: number | null,
		chainKey?: Uint8Array | null,
		signatureKey?: Uint8Array | null,
		serialized?: Uint8Array | null
	) {
		super()

		if (serialized) {
			try {
				const message = serialized.slice(1)
				const distributionMessage = proto.SenderKeyDistributionMessage.decode(
					message
				).toJSON() as SenderKeyDistributionMessageStructure

				this.serialized = serialized
				this.id = distributionMessage.id
				this.iteration = distributionMessage.iteration
				this.chainKey =
					typeof distributionMessage.chainKey === 'string'
						? Buffer.from(distributionMessage.chainKey, 'base64')
						: distributionMessage.chainKey
				this.signatureKey =
					typeof distributionMessage.signingKey === 'string'
						? Buffer.from(distributionMessage.signingKey, 'base64')
						: distributionMessage.signingKey
			} catch (e) {
				throw new Error(String(e))
			}
		} else {
			const version = this.intsToByteHighAndLow(this.CURRENT_VERSION, this.CURRENT_VERSION)
			this.id = id!
			this.iteration = iteration!
			this.chainKey = chainKey!
			this.signatureKey = signatureKey!

			const message = proto.SenderKeyDistributionMessage.encode(
				proto.SenderKeyDistributionMessage.create({
					id,
					iteration,
					chainKey,
					signingKey: this.signatureKey
				})
			).finish()

			this.serialized = Buffer.concat([Buffer.from([version]), message])
		}
	}

	private intsToByteHighAndLow(highValue: number, lowValue: number): number {
		return (((highValue << 4) | lowValue) & 0xff) % 256
	}

	public serialize(): Uint8Array {
		return this.serialized
	}

	public getType(): number {
		return this.SENDERKEY_DISTRIBUTION_TYPE
	}

	public getIteration(): number {
		return this.iteration
	}

	public getChainKey(): Uint8Array {
		return typeof this.chainKey === 'string' ? Buffer.from(this.chainKey, 'base64') : this.chainKey
	}

	public getSignatureKey(): Uint8Array {
		return typeof this.signatureKey === 'string' ? Buffer.from(this.signatureKey, 'base64') : this.signatureKey
	}

	public getId(): number {
		return this.id
	}
}
