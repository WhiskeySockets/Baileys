import { SenderKeyDistributionMessage } from './sender_key_distribution_message'
import * as keyhelper from './keyhelper'

export class GroupSessionBuilder {
  senderKeyStore;

  constructor(senderKeyStore) {
    this.senderKeyStore = senderKeyStore;
  }

  async process(senderKeyName, senderKeyDistributionMessage) {
    //console.log('GroupSessionBuilder process', senderKeyName, senderKeyDistributionMessage);
    const senderKeyRecord = await this.senderKeyStore.loadSenderKey(senderKeyName);
    senderKeyRecord.addSenderKeyState(
      senderKeyDistributionMessage.getId(),
      senderKeyDistributionMessage.getIteration(),
      senderKeyDistributionMessage.getChainKey(),
      senderKeyDistributionMessage.getSignatureKey()
    );
    await this.senderKeyStore.storeSenderKey(senderKeyName, senderKeyRecord);
  }

  // [{"senderKeyId":1742199468,"senderChainKey":{"iteration":0,"seed":"yxMY9VFQcXEP34olRAcGCtsgx1XoKsHfDIh+1ea4HAQ="},"senderSigningKey":{"public":""}}]
  async create(senderKeyName) {
    const senderKeyRecord = await this.senderKeyStore.loadSenderKey(senderKeyName);
    //console.log('GroupSessionBuilder create session', senderKeyName, senderKeyRecord);

    if (senderKeyRecord.isEmpty()) {
      const keyId = keyhelper.generateSenderKeyId();
      const senderKey = keyhelper.generateSenderKey();
      const signingKey = keyhelper.generateSenderSigningKey();

      senderKeyRecord.setSenderKeyState(keyId, 0, senderKey, signingKey);
      await this.senderKeyStore.storeSenderKey(senderKeyName, senderKeyRecord);
    }

    const state = senderKeyRecord.getSenderKeyState();

    return new SenderKeyDistributionMessage(
      state.getKeyId(),
      state.getSenderChainKey().getIteration(),
      state.getSenderChainKey().getSeed(),
      state.getSigningKeyPublic()
    );
  }
}