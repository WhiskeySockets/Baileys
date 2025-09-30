import { proto } from '../../../WAProto/index.js';
import { decodeAndHydrate } from '../../Utils/proto-utils.js';
import { CiphertextMessage } from './ciphertext-message.js';
export class SenderKeyDistributionMessage extends CiphertextMessage {
    constructor(id, iteration, chainKey, signatureKey, serialized) {
        super();
        if (serialized) {
            try {
                const message = serialized.slice(1);
                const distributionMessage = decodeAndHydrate(proto.SenderKeyDistributionMessage, message);
                this.serialized = serialized;
                this.id = distributionMessage.id;
                this.iteration = distributionMessage.iteration;
                this.chainKey = distributionMessage.chainKey;
                this.signatureKey = distributionMessage.signingKey;
            }
            catch (e) {
                throw new Error(String(e));
            }
        }
        else {
            const version = this.intsToByteHighAndLow(this.CURRENT_VERSION, this.CURRENT_VERSION);
            this.id = id;
            this.iteration = iteration;
            this.chainKey = chainKey;
            this.signatureKey = signatureKey;
            const message = proto.SenderKeyDistributionMessage.encode(proto.SenderKeyDistributionMessage.create({
                id,
                iteration,
                chainKey,
                signingKey: this.signatureKey
            })).finish();
            this.serialized = Buffer.concat([Buffer.from([version]), message]);
        }
    }
    intsToByteHighAndLow(highValue, lowValue) {
        return (((highValue << 4) | lowValue) & 0xff) % 256;
    }
    serialize() {
        return this.serialized;
    }
    getType() {
        return this.SENDERKEY_DISTRIBUTION_TYPE;
    }
    getIteration() {
        return this.iteration;
    }
    getChainKey() {
        return this.chainKey;
    }
    getSignatureKey() {
        return this.signatureKey;
    }
    getId() {
        return this.id;
    }
}
//# sourceMappingURL=sender-key-distribution-message.js.map