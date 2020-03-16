/**
 * Returns a raw shared key between own private key and peer's public key (in other words, this is an ECC Diffie-Hellman function X25519, performing scalar multiplication).
 *
 * The result should not be used directly as a key, but should be processed with a one-way function (e.g. HSalsa20 as in NaCl, or any secure cryptographic hash function, such as SHA-256, or key derivation function, such as HKDF).
 *
 * @export
 * @param {Uint8Array} secretKey
 * @param {Uint8Array} publicKey
 * @returns Uint8Array
 */
export declare function sharedKey(secretKey: any, publicKey: any): Uint8Array;
/**
 * Signs the given message using the private key and returns a signed message (signature concatenated with the message copy).
 *
 * Optional random data argument (which must have 64 random bytes) turns on hash separation and randomization to make signatures non-deterministic.
 *
 * @export
 * @param {Uint8Array} secretKey
 * @param {*} msg
 * @param {Uint8Array} opt_random
 * @returns
 */
export declare function signMessage(secretKey: any, msg: any, opt_random: any): Uint8Array;
/**
 * Verifies signed message with the public key and returns the original message without signature if it's correct or null if verification fails.
 *
 * @export
 * @param {Uint8Array} publicKey
 * @param {*} signedMsg
 * @returns Message
 */
export declare function openMessage(publicKey: any, signedMsg: any): Uint8Array | null;
/**
 * Signs the given message using the private key and returns signature.
 *
 * Optional random data argument (which must have 64 random bytes) turns on hash separation and randomization to make signatures non-deterministic.
 *
 * @export
 * @param {Uint8Array} secretKey
 * @param {*} msg
 * @param {Uint8Array} opt_random
 * @returns
 */
export declare function sign(secretKey: any, msg: any, opt_random: any): Uint8Array;
/**
 * Verifies the given signature for the message using the given private key. Returns true if the signature is valid, false otherwise.
 *
 * @export
 * @param {Uint8Array} publicKey
 * @param {*} msg
 * @param {*} signature
 * @returns
 */
export declare function verify(publicKey: any, msg: any, signature: any): boolean;
/**
 * Generates a new key pair from the given 32-byte secret seed (which should be generated with a CSPRNG) and returns it as object.
 *
 * The returned keys can be used for signing and key agreement.
 *
 * @export
 * @param {Uint8Array} seed required
 * @returns
 */
export declare function generateKeyPair(seed: any): {
    public: Uint8Array;
    private: Uint8Array;
};
declare const _default: {};
export default _default;
