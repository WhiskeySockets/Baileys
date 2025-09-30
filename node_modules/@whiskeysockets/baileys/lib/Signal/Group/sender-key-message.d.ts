import { CiphertextMessage } from './ciphertext-message.js';
export declare class SenderKeyMessage extends CiphertextMessage {
    private readonly SIGNATURE_LENGTH;
    private readonly messageVersion;
    private readonly keyId;
    private readonly iteration;
    private readonly ciphertext;
    private readonly signature;
    private readonly serialized;
    constructor(keyId?: number | null, iteration?: number | null, ciphertext?: Uint8Array | null, signatureKey?: Uint8Array | null, serialized?: Uint8Array | null);
    getKeyId(): number;
    getIteration(): number;
    getCipherText(): Uint8Array;
    verifySignature(signatureKey: Uint8Array): void;
    private getSignature;
    serialize(): Uint8Array;
    getType(): number;
}
//# sourceMappingURL=sender-key-message.d.ts.map