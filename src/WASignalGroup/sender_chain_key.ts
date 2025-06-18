import { SenderMessageKey } from './sender_message_key';
import { calculateMAC } from 'libsignal/src/crypto';

export class SenderChainKey {
    private readonly MESSAGE_KEY_SEED: Uint8Array = Buffer.from([0x01]);
    private readonly CHAIN_KEY_SEED: Uint8Array = Buffer.from([0x02]);
    private readonly iteration: number;
    private readonly chainKey: Uint8Array;

    constructor(iteration: number, chainKey: any) {
        this.iteration = iteration;
        if (typeof chainKey === 'string') {
            this.chainKey = Buffer.from(chainKey, 'base64');
        } else if (chainKey instanceof Uint8Array) {
            this.chainKey = chainKey;
        } else if (chainKey && typeof chainKey === 'object') {
            const values = Object.values(chainKey) as number[];
            this.chainKey = Buffer.from(values);
        } else {
            this.chainKey = Buffer.alloc(0);
        }
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
        return this.chainKey;
    }

    private getDerivative(seed: Uint8Array, key: Uint8Array | string): Uint8Array {
        const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'base64') : key;
        return calculateMAC(keyBuffer, seed);
    }
}
