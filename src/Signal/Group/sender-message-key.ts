import { deriveSecrets } from 'libsignal/src/crypto'

export class SenderMessageKey {
	private readonly iteration: number
	private readonly iv: Uint8Array
	private readonly cipherKey: Uint8Array
	private readonly seed: Uint8Array

	constructor(iteration: number, seed: Uint8Array) {
		const derivative = deriveSecrets(seed, Buffer.alloc(32), Buffer.from('WhisperGroup'))
		const keys = new Uint8Array(32)
		keys.set(new Uint8Array(derivative[0].slice(16)))
		keys.set(new Uint8Array(derivative[1].slice(0, 16)), 16)

		this.iv = Buffer.from(derivative[0].slice(0, 16))
		this.cipherKey = Buffer.from(keys.buffer)
		this.iteration = iteration
		this.seed = seed
	}

	public getIteration(): number {
		return this.iteration
	}

	public getIv(): Uint8Array {
		return this.iv
	}

	public getCipherKey(): Uint8Array {
		return this.cipherKey
	}

	public getSeed(): Uint8Array {
		return this.seed
	}
}
