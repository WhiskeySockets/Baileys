
import { SenderKeyState } from './sender_key_state'
import * as proto from '../Proto'

export class SenderKeyRecord {
    MAX_STATES = 5;
    senderKeyStates: SenderKeyState[];
  
    constructor(serialized?: any) {
      this.senderKeyStates = [];
  
      if (serialized) {
        const list = serialized;
        for (let i = 0; i < list.length; i++) {
          const structure = list[i];
          this.senderKeyStates.push(
            new SenderKeyState(undefined, undefined, undefined, undefined, undefined, undefined, structure)
          );
        }
      }
    }
  
    isEmpty() {
      return this.senderKeyStates.length === 0;
    }
  
    getSenderKeyState(keyId) {
      if (!keyId && this.senderKeyStates.length) return this.senderKeyStates[this.senderKeyStates.length - 1];
      for (let i = 0; i < this.senderKeyStates.length; i++) {
        const state = this.senderKeyStates[i];
        if (state.getKeyId() === keyId) {
          return state;
        }
      }
    }
  
    addSenderKeyState(id, iteration, chainKey, signatureKey) {
      this.senderKeyStates.push(new SenderKeyState(id, iteration, chainKey, undefined, signatureKey));
      if (this.senderKeyStates.length > 5) {
        this.senderKeyStates.shift()
      }
    }
  
    setSenderKeyState(id, iteration, chainKey, keyPair) {
      this.senderKeyStates.length = 0;
      this.senderKeyStates.push(new SenderKeyState(id, iteration, chainKey, keyPair));
    }
  
    serialize() {
      const recordStructure: proto.SenderKeyStateStructure[] = [];
      for (let i = 0; i < this.senderKeyStates.length; i++) {
        const senderKeyState = this.senderKeyStates[i];
        recordStructure.push(senderKeyState.getStructure());
      }
      return recordStructure;
    }
  }