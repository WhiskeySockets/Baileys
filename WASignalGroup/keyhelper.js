const curve = require('libsignal/src/curve');
const nodeCrypto = require('crypto');

exports.generateSenderKey = function() {
    return nodeCrypto.randomBytes(32);
}

exports.generateSenderKeyId = function() {
    return nodeCrypto.randomInt(2147483647);
}

exports.generateSenderSigningKey = function(key) {
    if (!key) {
        key = curve.generateKeyPair();
    }

    return {
        public: key.pubKey,
        private: key.privKey,
    };
} 
