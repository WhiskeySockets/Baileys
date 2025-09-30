import { SenderMessageKey } from './sender-message-key.js';
export declare class SenderChainKey {
    private readonly MESSAGE_KEY_SEED;
    private readonly CHAIN_KEY_SEED;
    private readonly iteration;
    private readonly chainKey;
    constructor(iteration: number, chainKey: Uint8Array | Buffer);
    getIteration(): number;
    getSenderMessageKey(): SenderMessageKey;
    getNext(): SenderChainKey;
    getSeed(): Uint8Array;
    private getDerivative;
}
//# sourceMappingURL=sender-chain-key.d.ts.map