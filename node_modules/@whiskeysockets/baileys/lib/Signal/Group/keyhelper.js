import * as nodeCrypto from 'crypto';
import { generateKeyPair } from 'libsignal/src/curve.js';
export function generateSenderKey() {
    return nodeCrypto.randomBytes(32);
}
export function generateSenderKeyId() {
    return nodeCrypto.randomInt(2147483647);
}
export function generateSenderSigningKey(key) {
    if (!key) {
        key = generateKeyPair();
    }
    return {
        public: Buffer.from(key.pubKey),
        private: Buffer.from(key.privKey)
    };
}
//# sourceMappingURL=keyhelper.js.map