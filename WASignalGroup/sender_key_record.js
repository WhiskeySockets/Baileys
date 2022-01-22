const SenderKeyState = require('./sender_key_state');

class SenderKeyRecord {
    MAX_STATES = 5;
  
    constructor(serialized) {
      this.senderKeyStates = [];
  
      if (serialized) {
        const list = serialized;
        for (let i = 0; i < list.length; i++) {
          const structure = list[i];
          this.senderKeyStates.push(
            new SenderKeyState(null, null, null, null, null, null, structure)
          );
        }
      }
    }
  
    isEmpty() {
      return this.senderKeyStates.length === 0;
    }
  
    getSenderKeyState(keyId) {
      if (!keyId && this.senderKeyStates.length) return this.senderKeyStates[0];
      for (let i = 0; i < this.senderKeyStates.length; i++) {
        const state = this.senderKeyStates[i];
        if (state.getKeyId() === keyId) {
          return state;
        }
      }
      throw new Error(`No keys for: ${keyId}`);
    }
  
    addSenderKeyState(id, iteration, chainKey, signatureKey) {
      this.senderKeyStates.push(new SenderKeyState(id, iteration, chainKey, null, signatureKey));
    }
  
    setSenderKeyState(id, iteration, chainKey, keyPair) {
      this.senderKeyStates.length = 0;
      this.senderKeyStates.push(new SenderKeyState(id, iteration, chainKey, keyPair));
    }
  
    serialize() {
      const recordStructure = [];
      for (let i = 0; i < this.senderKeyStates.length; i++) {
        const senderKeyState = this.senderKeyStates[i];
        recordStructure.push(senderKeyState.getStructure());
      }
      return recordStructure;
    }
  }
  
  module.exports = SenderKeyRecord;