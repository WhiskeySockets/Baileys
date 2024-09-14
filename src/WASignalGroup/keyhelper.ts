import { curve } from 'libsignal';
import nodeCrypto from 'crypto';

export const generateSenderKey = () => {
    return nodeCrypto.randomBytes(32);
}

export const generateSenderKeyId = () => {
    return nodeCrypto.randomInt(2147483647);
}

export const generateSenderSigningKey = (key?: any) => {
    if(!key) {
        key = curve.generateKeyPair()
    }

    return {
        public: key.pubKey,
        private: key.privKey,
    }
}