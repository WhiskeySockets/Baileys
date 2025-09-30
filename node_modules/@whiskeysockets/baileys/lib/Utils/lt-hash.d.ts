declare class LTHash {
    salt: string;
    constructor(e: string);
    add(e: ArrayBuffer, t: ArrayBuffer[]): Promise<ArrayBuffer>;
    subtract(e: ArrayBuffer, t: ArrayBuffer[]): Promise<ArrayBuffer>;
    subtractThenAdd(e: ArrayBuffer, addList: ArrayBuffer[], subtractList: ArrayBuffer[]): Promise<ArrayBuffer>;
    private _addSingle;
    private _subtractSingle;
    private performPointwiseWithOverflow;
}
export declare const LT_HASH_ANTI_TAMPERING: LTHash;
export {};
//# sourceMappingURL=lt-hash.d.ts.map