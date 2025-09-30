import { SenderKeyState } from './sender-key-state.js';
export interface SenderKeyStateStructure {
    senderKeyId: number;
    senderChainKey: {
        iteration: number;
        seed: Uint8Array;
    };
    senderSigningKey: {
        public: Uint8Array;
        private?: Uint8Array;
    };
    senderMessageKeys: Array<{
        iteration: number;
        seed: Uint8Array;
    }>;
}
export declare class SenderKeyRecord {
    private readonly MAX_STATES;
    private readonly senderKeyStates;
    constructor(serialized?: SenderKeyStateStructure[]);
    isEmpty(): boolean;
    getSenderKeyState(keyId?: number): SenderKeyState | undefined;
    addSenderKeyState(id: number, iteration: number, chainKey: Uint8Array, signatureKey: Uint8Array): void;
    setSenderKeyState(id: number, iteration: number, chainKey: Uint8Array, keyPair: {
        public: Uint8Array;
        private: Uint8Array;
    }): void;
    serialize(): SenderKeyStateStructure[];
    static deserialize(data: Uint8Array): SenderKeyRecord;
}
//# sourceMappingURL=sender-key-record.d.ts.map