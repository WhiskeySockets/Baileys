const CiphertextMessage = require('./ciphertext_message');
const curve = require('libsignal/src/curve');
const protobufs = require('./protobufs');

class SenderKeyMessage extends CiphertextMessage {
  SIGNATURE_LENGTH = 64;

  constructor(
    keyId = null,
    iteration = null,
    ciphertext = null,
    signatureKey = null,
    serialized = null
  ) {
    super();
    if (serialized) {
      const version = serialized[0];
      const message = serialized.slice(1, serialized.length - this.SIGNATURE_LENGTH);
      const signature = serialized.slice(-1 * this.SIGNATURE_LENGTH);
      const senderKeyMessage = protobufs.SenderKeyMessage.decode(message).toJSON();
      senderKeyMessage.ciphertext = Buffer.from(senderKeyMessage.ciphertext, 'base64');

      this.serialized = serialized;
      this.messageVersion = (version & 0xff) >> 4;

      this.keyId = senderKeyMessage.id;
      this.iteration = senderKeyMessage.iteration;
      this.ciphertext = senderKeyMessage.ciphertext;
      this.signature = signature;
    } else {
      const version = (((this.CURRENT_VERSION << 4) | this.CURRENT_VERSION) & 0xff) % 256;
      ciphertext = Buffer.from(ciphertext); // .toString('base64');
      const message = protobufs.SenderKeyMessage.encode(
        protobufs.SenderKeyMessage.create({
          id: keyId,
          iteration,
          ciphertext,
        })
      ).finish();

      const signature = this.getSignature(
        signatureKey,
        Buffer.concat([Buffer.from([version]), message])
      );
      this.serialized = Buffer.concat([Buffer.from([version]), message, Buffer.from(signature)]);
      this.messageVersion = this.CURRENT_VERSION;
      this.keyId = keyId;
      this.iteration = iteration;
      this.ciphertext = ciphertext;
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
    const part1 = this.serialized.slice(0, this.serialized.length - this.SIGNATURE_LENGTH + 1);
    const part2 = this.serialized.slice(-1 * this.SIGNATURE_LENGTH);
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

module.exports = SenderKeyMessage;