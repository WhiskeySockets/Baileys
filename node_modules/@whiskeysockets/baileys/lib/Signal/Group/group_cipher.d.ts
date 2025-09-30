import { SenderKeyName } from './sender-key-name.js';
import { SenderKeyRecord } from './sender-key-record.js';
export interface SenderKeyStore {
    loadSenderKey(senderKeyName: SenderKeyName): Promise<SenderKeyRecord>;
    storeSenderKey(senderKeyName: SenderKeyName, record: SenderKeyRecord): Promise<void>;
}
export declare class GroupCipher {
    private readonly senderKeyStore;
    private readonly senderKeyName;
    constructor(senderKeyStore: SenderKeyStore, senderKeyName: SenderKeyName);
    encrypt(paddedPlaintext: Uint8Array): Promise<Uint8Array>;
    decrypt(senderKeyMessageBytes: Uint8Array): Promise<Uint8Array>;
    private getSenderKey;
    private getPlainText;
    private getCipherText;
}
//# sourceMappingURL=group_cipher.d.ts.map