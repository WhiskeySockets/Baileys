declare class d {
    salt: string;
    constructor(e: string);
    add(e: any, t: any): any;
    subtract(e: any, t: any): any;
    subtractThenAdd(e: any, t: any, r: any): any;
    _addSingle(e: any, t: any): ArrayBuffer;
    _subtractSingle(e: any, t: any): ArrayBuffer;
    performPointwiseWithOverflow(e: any, t: any, r: any): ArrayBuffer;
}
export declare const LT_HASH_ANTI_TAMPERING: d;
export {};
