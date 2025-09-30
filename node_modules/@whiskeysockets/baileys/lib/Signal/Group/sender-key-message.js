import { calculateSignature, verifySignature } from 'libsignal/src/curve.js';
import { proto } from '../../../WAProto/index.js';
import { decodeAndHydrate } from '../../Utils/proto-utils.js';
import { CiphertextMessage } from './ciphertext-message.js';
export class SenderKeyMessage extends CiphertextMessage {
    constructor(keyId, iteration, ciphertext, signatureKey, serialized) {
        super();
        this.SIGNATURE_LENGTH = 64;
        if (serialized) {
            const version = serialized[0];
            const message = serialized.slice(1, serialized.length - this.SIGNATURE_LENGTH);
            const signature = serialized.slice(-1 * this.SIGNATURE_LENGTH);
            const senderKeyMessage = decodeAndHydrate(proto.SenderKeyMessage, message);
            this.serialized = serialized;
            this.messageVersion = (version & 0xff) >> 4;
            this.keyId = senderKeyMessage.id;
            this.iteration = senderKeyMessage.iteration;
            this.ciphertext = senderKeyMessage.ciphertext;
            this.signature = signature;
        }
        else {
            const version = (((this.CURRENT_VERSION << 4) | this.CURRENT_VERSION) & 0xff) % 256;
            const ciphertextBuffer = Buffer.from(ciphertext);
            const message = proto.SenderKeyMessage.encode(proto.SenderKeyMessage.create({
                id: keyId,
                iteration: iteration,
                ciphertext: ciphertextBuffer
            })).finish();
            const signature = this.getSignature(signatureKey, Buffer.concat([Buffer.from([version]), message]));
            this.serialized = Buffer.concat([Buffer.from([version]), message, Buffer.from(signature)]);
            this.messageVersion = this.CURRENT_VERSION;
            this.keyId = keyId;
            this.iteration = iteration;
            this.ciphertext = ciphertextBuffer;
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
        const part1 = this.serialized.slice(0, this.serialized.length - this.SIGNATURE_LENGTH);
        const part2 = this.serialized.slice(-1 * this.SIGNATURE_LENGTH);
        const res = verifySignature(signatureKey, part1, part2);
        if (!res)
            throw new Error('Invalid signature!');
    }
    getSignature(signatureKey, serialized) {
        return Buffer.from(calculateSignature(signatureKey, serialized));
    }
    serialize() {
        return this.serialized;
    }
    getType() {
        return 4;
    }
}
//# sourceMappingURL=sender-key-message.js.map