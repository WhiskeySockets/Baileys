/* @ts-ignore */
import { calculateMAC } from 'libsignal/src/crypto'
import { SenderMessageKey } from './sender-message-key'

export class SenderChainKey {
	private readonly MESSAGE_KEY_SEED: Uint8Array = Buffer.from([0x01])
	private readonly CHAIN_KEY_SEED: Uint8Array = Buffer.from([0x02])
	private readonly iteration: number
	private readonly chainKey: Buffer

	constructor(iteration: number, chainKey: any) {
		this.iteration = iteration
		if (chainKey instanceof Buffer) {
			this.chainKey = chainKey
		} else {
			this.chainKey = Buffer.from(chainKey || [])
		}
	}

	public getIteration(): number {
		return this.iteration
	}

	public getSenderMessageKey(): SenderMessageKey {
		return new SenderMessageKey(this.iteration, this.getDerivative(this.MESSAGE_KEY_SEED, this.chainKey))
	}

	public getNext(): SenderChainKey {
		return new SenderChainKey(this.iteration + 1, this.getDerivative(this.CHAIN_KEY_SEED, this.chainKey))
	}

	public getSeed(): Uint8Array {
		return this.chainKey
	}

	private getDerivative(seed: Uint8Array, key: Buffer): Uint8Array {
		return calculateMAC(key, seed)
	}
}
