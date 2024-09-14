import { readBinaryNode, writeBinaryNode } from '../Utils/proto-utils';
import { CipherTextMessage } from './ciphertext_message';
import { curve } from 'libsignal';
import * as proto from '../Proto';

export class SenderKeyMessage extends CipherTextMessage {
  SIGNATURE_LENGTH = 64;
  CURRENT_VERSION = 3;

  messageVersion;
  ciphertext;
  signature;

  constructor(
    private keyId?: number,
    private iteration?: number,
    private chainKey?: Uint8Array,
    private signatureKey?: Uint8Array,
    private serialized?: Uint8Array
  ) {
    super();
    if (serialized) {
      const version = serialized[0];
      const message = serialized.slice(1, serialized.length - this.SIGNATURE_LENGTH);
      const signature = serialized.slice(-1 * this.SIGNATURE_LENGTH);

      const senderKeyMessage = readBinaryNode(proto.readSenderKeyMessage, message);

      this.serialized = serialized;
      this.messageVersion = (version & 0xff) >> 4;

      this.keyId = senderKeyMessage.id;
      this.iteration = senderKeyMessage.iteration;
      this.ciphertext = senderKeyMessage.ciphertext;
      this.signature = signature;
    } else {
      const version = (((this.CURRENT_VERSION << 4) | this.CURRENT_VERSION) & 0xff) % 256;

      const message = writeBinaryNode(proto.writeSenderKeyMessage, {
        id: this.keyId,
        iteration: this.iteration,
        ciphertext: this.ciphertext,
      });

      const signature = this.getSignature(
        signatureKey,
        Buffer.concat([Buffer.from([version]), message])
      );

      this.serialized = Buffer.concat([Buffer.from([version]), message, Buffer.from(signature)]);
      this.messageVersion = this.CURRENT_VERSION;
      this.keyId = keyId;
      this.iteration = iteration;
      this.ciphertext = this.ciphertext;
      this.signature = signature;
    }
  }

  getKeyId() {
    return this.keyId;
  }

  getIteration() {
    return this.iteration;
  }

  getCipherText() {
    return this.ciphertext;
  }

  verifySignature(signatureKey) {
    if(!this.signature) {
      throw new Error('No signature to verify')
    }
    const part1 = this.serialized?.slice(0, this.serialized.length - this.SIGNATURE_LENGTH);
    const part2 = this.serialized?.slice(-1 * this.SIGNATURE_LENGTH);
    const res = curve.verifySignature(signatureKey, part1, part2);
    if (!res) throw new Error('Invalid signature!');
  }

  getSignature(signatureKey, serialized) {
    const signature = Buffer.from(
      curve.calculateSignature(
        signatureKey,
        serialized
      )
    );
    return signature;
  }

  serialize() {
    return this.serialized;
  }

  getType() {
    return 4;
  }
}