const SenderKeyMessage = require('./sender_key_message');
const crypto = require('libsignal/src/crypto');

class GroupCipher {
  constructor(senderKeyStore, senderKeyName) {
    this.senderKeyStore = senderKeyStore;
    this.senderKeyName = senderKeyName;
  }

  async encrypt(paddedPlaintext) {
    try {
      const record = await this.senderKeyStore.loadSenderKey(this.senderKeyName);
      const senderKeyState = record.getSenderKeyState();
      const senderKey = senderKeyState.getSenderChainKey().getSenderMessageKey();

      const ciphertext = await this.getCipherText(
        senderKey.getIv(),
        senderKey.getCipherKey(),
        paddedPlaintext
      );

      const senderKeyMessage = new SenderKeyMessage(
        senderKeyState.getKeyId(),
        senderKey.getIteration(),
        ciphertext,
        senderKeyState.getSigningKeyPrivate()
      );
      senderKeyState.setSenderChainKey(senderKeyState.getSenderChainKey().getNext());
      await this.senderKeyStore.storeSenderKey(this.senderKeyName, record);
      return senderKeyMessage.serialize();
    } catch (e) {
      //console.log(e.stack);
      throw new Error('NoSessionException');
    }
  }

  async decrypt(senderKeyMessageBytes) {
    const record = await this.senderKeyStore.loadSenderKey(this.senderKeyName);
    if (!record) throw new Error(`No sender key for: ${this.senderKeyName}`);

    const senderKeyMessage = new SenderKeyMessage(null, null, null, null, senderKeyMessageBytes);

    const senderKeyState = record.getSenderKeyState(senderKeyMessage.getKeyId());
    //senderKeyMessage.verifySignature(senderKeyState.getSigningKeyPublic());
    const senderKey = this.getSenderKey(senderKeyState, senderKeyMessage.getIteration());
    // senderKeyState.senderKeyStateStructure.senderSigningKey.private =

    const plaintext = await this.getPlainText(
      senderKey.getIv(),
      senderKey.getCipherKey(),
      senderKeyMessage.getCipherText()
    );

    await this.senderKeyStore.storeSenderKey(this.senderKeyName, record);

    return plaintext;
  }

  getSenderKey(senderKeyState, iteration) {
    let senderChainKey = senderKeyState.getSenderChainKey();
    if (senderChainKey.getIteration() > iteration) {
      if (senderKeyState.hasSenderMessageKey(iteration)) {
        return senderKeyState.removeSenderMessageKey(iteration);
      }
      throw new Error(
        `Received message with old counter: ${senderChainKey.getIteration()}, ${iteration}`
      );
    }

    if (senderChainKey.getIteration() - iteration > 2000) {
      throw new Error('Over 2000 messages into the future!');
    }

    while (senderChainKey.getIteration() < iteration) {
      senderKeyState.addSenderMessageKey(senderChainKey.getSenderMessageKey());
      senderChainKey = senderChainKey.getNext();
    }

    senderKeyState.setSenderChainKey(senderChainKey.getNext());
    return senderChainKey.getSenderMessageKey();
  }

  getPlainText(iv, key, ciphertext) {
    try {
      const plaintext = crypto.decrypt(key, ciphertext, iv);
      return plaintext;
    } catch (e) {
      //console.log(e.stack);
      throw new Error('InvalidMessageException');
    }
  }

  getCipherText(iv, key, plaintext) {
    try {
      iv = typeof iv === 'string' ? Buffer.from(iv, 'base64') : iv;
      key = typeof key === 'string' ? Buffer.from(key, 'base64') : key;
      const crypted = crypto.encrypt(key, Buffer.from(plaintext), iv);
      return crypted;
    } catch (e) {
      //console.log(e.stack);
      throw new Error('InvalidMessageException');
    }
  }
}

module.exports = GroupCipher;