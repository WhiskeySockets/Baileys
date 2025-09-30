// vim: ts=4:sw=4:expandtab

const curve = require('./curve');
const nodeCrypto = require('crypto');

function isNonNegativeInteger(n) {
    return (typeof n === 'number' && (n % 1) === 0  && n >= 0);
}

exports.generateIdentityKeyPair = curve.generateKeyPair;

exports.generateRegistrationId = function() {
    var registrationId = Uint16Array.from(nodeCrypto.randomBytes(2))[0];
    return registrationId & 0x3fff;
};

exports.generateSignedPreKey = function(identityKeyPair, signedKeyId) {
    if (!(identityKeyPair.privKey instanceof Buffer) ||
        identityKeyPair.privKey.byteLength != 32 ||
        !(identityKeyPair.pubKey instanceof Buffer) ||
        identityKeyPair.pubKey.byteLength != 33) {
        throw new TypeError('Invalid argument for identityKeyPair');
    }
    if (!isNonNegativeInteger(signedKeyId)) {
        throw new TypeError('Invalid argument for signedKeyId: ' + signedKeyId);
    }
    const keyPair = curve.generateKeyPair();
    const sig = curve.calculateSignature(identityKeyPair.privKey, keyPair.pubKey);
    return {
        keyId: signedKeyId,
        keyPair: keyPair,
        signature: sig
    };
};

exports.generatePreKey = function(keyId) {
    if (!isNonNegativeInteger(keyId)) {
        throw new TypeError('Invalid argument for keyId: ' + keyId);
    }
    const keyPair = curve.generateKeyPair();
    return {
        keyId,
        keyPair
    };
};
