import { calculateMAC } from 'libsignal/src/crypto'
import { Buffer } from 'node:buffer'
import { SenderMessageKey } from './sender-message-key'

export class SenderChainKey {
	private readonly MESSAGE_KEY_SEED: Uint8Array = Buffer.from([0x01])
	private readonly CHAIN_KEY_SEED: Uint8Array = Buffer.from([0x02])
	private readonly iteration: number
	private readonly chainKey: Buffer

	constructor(iteration: number, chainKey: Uint8Array | Buffer) {
		this.iteration = iteration
		if (Buffer.isBuffer(chainKey)) {
			this.chainKey = chainKey
		} else if (chainKey instanceof Uint8Array) {
			this.chainKey = Buffer.from(chainKey)
		} else if (chainKey && typeof chainKey === 'object') {
			// backported from @MartinSchere (#1741)
			this.chainKey = Buffer.from(Object.values(chainKey)) // temp fix // backported from @MartinSchere (#1741)
		} else {
			this.chainKey = Buffer.alloc(0)
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
