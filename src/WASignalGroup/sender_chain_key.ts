import { SenderMessageKey } from './sender_message_key';
import { calculateMAC } from 'libsignal/src/crypto';

export class SenderChainKey {
    private readonly MESSAGE_KEY_SEED: Uint8Array = Buffer.from([0x01]);
    private readonly CHAIN_KEY_SEED: Uint8Array = Buffer.from([0x02]);
    private readonly iteration: number;
    private readonly chainKey: Uint8Array;

    constructor(iteration: number, chainKey: Uint8Array | string) {
        this.iteration = iteration;
        this.chainKey = typeof chainKey === 'string' ? Buffer.from(chainKey, 'base64') : chainKey;
    }

    public getIteration(): number {
        return this.iteration;
    }

    public getSenderMessageKey(): SenderMessageKey {
        return new SenderMessageKey(
            this.iteration,
            this.getDerivative(this.MESSAGE_KEY_SEED, this.chainKey)
        );
    }

    public getNext(): SenderChainKey {
        return new SenderChainKey(
            this.iteration + 1,
            this.getDerivative(this.CHAIN_KEY_SEED, this.chainKey)
        );
    }

    public getSeed(): Uint8Array {
        return typeof this.chainKey === 'string' ? Buffer.from(this.chainKey, 'base64') : this.chainKey;
    }

    private getDerivative(seed: Uint8Array, key: Uint8Array | string): Uint8Array {
        const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'base64') : key;
        return calculateMAC(keyBuffer, seed);
    }
}
