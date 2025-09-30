import { SenderKeyDistributionMessage } from './sender-key-distribution-message.js';
import { SenderKeyName } from './sender-key-name.js';
import { SenderKeyRecord } from './sender-key-record.js';
interface SenderKeyStore {
    loadSenderKey(senderKeyName: SenderKeyName): Promise<SenderKeyRecord>;
    storeSenderKey(senderKeyName: SenderKeyName, record: SenderKeyRecord): Promise<void>;
}
export declare class GroupSessionBuilder {
    private readonly senderKeyStore;
    constructor(senderKeyStore: SenderKeyStore);
    process(senderKeyName: SenderKeyName, senderKeyDistributionMessage: SenderKeyDistributionMessage): Promise<void>;
    create(senderKeyName: SenderKeyName): Promise<SenderKeyDistributionMessage>;
}
export {};
//# sourceMappingURL=group-session-builder.d.ts.map