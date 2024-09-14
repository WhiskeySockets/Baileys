import { readBinaryNode, writeBinaryNode } from '../Utils/proto-utils';
import { CipherTextMessage } from './ciphertext_message';
import * as proto from '../Proto';


export class SenderKeyDistributionMessage extends CipherTextMessage {
  constructor(
    private id?: number,
    private iteration?: number,
    private chainKey?: Uint8Array,
    private signatureKey?: Uint8Array,
    private serialized?: Uint8Array
  ) {
    super();
    if (serialized) {
      try {
        const version = serialized[0];
        const message = serialized.slice(1);

        const distributionMessage = readBinaryNode(proto.readSenderKeyDistributionMessage, message);

        this.serialized = serialized;
        this.id = distributionMessage.id;
        this.iteration = distributionMessage.iteration;
        this.chainKey = distributionMessage.chainKey;
        this.signatureKey = distributionMessage.signingKey;
      } catch (e) {
        throw new Error(e);
      }
    } else {
      const version = this.intsToByteHighAndLow(this.CURRENT_VERSION, this.CURRENT_VERSION);
      this.id = id;
      this.iteration = iteration;
      this.chainKey = chainKey;
      this.signatureKey = signatureKey;

      const message = writeBinaryNode(proto.writeSenderKeyDistributionMessage, {
        id: this.id,
        iteration: this.iteration,
        chainKey: this.chainKey,
        signingKey: this.signatureKey,
      });

      this.serialized = Buffer.concat([Buffer.from([version]), message]);
    }
  }

  intsToByteHighAndLow(highValue, lowValue) {
    return (((highValue << 4) | lowValue) & 0xff) % 256;
  }

  serialize() {
    if(!this.serialized) {
      throw new Error('No serialized data')
    }

    return this.serialized;
  }

  getType() {
    return this.SENDERKEY_DISTRIBUTION_TYPE;
  }

  getIteration() {
    return this.iteration;
  }

  getChainKey() {
    return typeof this.chainKey === 'string' ? Buffer.from(this.chainKey, 'base64') : this.chainKey;
  }

  getSignatureKey() {
    return typeof this.signatureKey === 'string'
      ? Buffer.from(this.signatureKey, 'base64')
      : this.signatureKey;
  }

  getId() {
    return this.id;
  }
}