import { SenderChainKey } from './sender-chain-key.js';
import { SenderMessageKey } from './sender-message-key.js';
interface SenderChainKeyStructure {
    iteration: number;
    seed: Uint8Array;
}
interface SenderSigningKeyStructure {
    public: Uint8Array;
    private?: Uint8Array;
}
interface SenderMessageKeyStructure {
    iteration: number;
    seed: Uint8Array;
}
interface SenderKeyStateStructure {
    senderKeyId: number;
    senderChainKey: SenderChainKeyStructure;
    senderSigningKey: SenderSigningKeyStructure;
    senderMessageKeys: SenderMessageKeyStructure[];
}
export declare class SenderKeyState {
    private readonly MAX_MESSAGE_KEYS;
    private readonly senderKeyStateStructure;
    constructor(id?: number | null, iteration?: number | null, chainKey?: Uint8Array | null | string, signatureKeyPair?: {
        public: Uint8Array | string;
        private: Uint8Array | string;
    } | null, signatureKeyPublic?: Uint8Array | string | null, signatureKeyPrivate?: Uint8Array | string | null, senderKeyStateStructure?: SenderKeyStateStructure | null);
    getKeyId(): number;
    getSenderChainKey(): SenderChainKey;
    setSenderChainKey(chainKey: SenderChainKey): void;
    getSigningKeyPublic(): Buffer;
    getSigningKeyPrivate(): Buffer | undefined;
    hasSenderMessageKey(iteration: number): boolean;
    addSenderMessageKey(senderMessageKey: SenderMessageKey): void;
    removeSenderMessageKey(iteration: number): SenderMessageKey | null;
    getStructure(): SenderKeyStateStructure;
}
export {};
//# sourceMappingURL=sender-key-state.d.ts.map