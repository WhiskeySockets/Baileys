export declare class SenderMessageKey {
    private readonly iteration;
    private readonly iv;
    private readonly cipherKey;
    private readonly seed;
    constructor(iteration: number, seed: Uint8Array);
    getIteration(): number;
    getIv(): Uint8Array;
    getCipherKey(): Uint8Array;
    getSeed(): Uint8Array;
}
//# sourceMappingURL=sender-message-key.d.ts.map