import { SenderKeyName } from './sender_key_name';
import { SenderKeyRecord } from './sender_key_record';
import { SenderKeyDistributionMessage } from './sender_key_distribution_message';
import * as keyhelper from './keyhelper';

interface SenderKeyStore {
    loadSenderKey(senderKeyName: SenderKeyName): Promise<SenderKeyRecord>;
    storeSenderKey(senderKeyName: SenderKeyName, record: SenderKeyRecord): Promise<void>;
}

export class GroupSessionBuilder {
    private readonly senderKeyStore: SenderKeyStore;

    constructor(senderKeyStore: SenderKeyStore) {
        this.senderKeyStore = senderKeyStore;
    }

    public async process(
        senderKeyName: SenderKeyName,
        senderKeyDistributionMessage: SenderKeyDistributionMessage
    ): Promise<void> {
        const senderKeyRecord = await this.senderKeyStore.loadSenderKey(senderKeyName);
        senderKeyRecord.addSenderKeyState(
            senderKeyDistributionMessage.getId(),
            senderKeyDistributionMessage.getIteration(),
            senderKeyDistributionMessage.getChainKey(),
            senderKeyDistributionMessage.getSignatureKey()
        );
        await this.senderKeyStore.storeSenderKey(senderKeyName, senderKeyRecord);
    }

    public async create(senderKeyName: SenderKeyName): Promise<SenderKeyDistributionMessage> {
        const senderKeyRecord = await this.senderKeyStore.loadSenderKey(senderKeyName);

        if (senderKeyRecord.isEmpty()) {
            const keyId = keyhelper.generateSenderKeyId();
            const senderKey = keyhelper.generateSenderKey();
            const signingKey = keyhelper.generateSenderSigningKey();

            senderKeyRecord.setSenderKeyState(keyId, 0, senderKey, signingKey);
            await this.senderKeyStore.storeSenderKey(senderKeyName, senderKeyRecord);
        }

        const state = senderKeyRecord.getSenderKeyState();
        if (!state) {
            throw new Error("No session state available");
        }

        return new SenderKeyDistributionMessage(
            state.getKeyId(),
            state.getSenderChainKey().getIteration(),
            state.getSenderChainKey().getSeed(),
            state.getSigningKeyPublic()
        );
    }
}
