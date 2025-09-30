import { calculateMAC } from 'libsignal/src/crypto.js';
import { SenderMessageKey } from './sender-message-key.js';
export class SenderChainKey {
    constructor(iteration, chainKey) {
        this.MESSAGE_KEY_SEED = Buffer.from([0x01]);
        this.CHAIN_KEY_SEED = Buffer.from([0x02]);
        this.iteration = iteration;
        this.chainKey = Buffer.from(chainKey);
    }
    getIteration() {
        return this.iteration;
    }
    getSenderMessageKey() {
        return new SenderMessageKey(this.iteration, this.getDerivative(this.MESSAGE_KEY_SEED, this.chainKey));
    }
    getNext() {
        return new SenderChainKey(this.iteration + 1, this.getDerivative(this.CHAIN_KEY_SEED, this.chainKey));
    }
    getSeed() {
        return this.chainKey;
    }
    getDerivative(seed, key) {
        return calculateMAC(key, seed);
    }
}
//# sourceMappingURL=sender-chain-key.js.map