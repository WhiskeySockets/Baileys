import * as curveJs from 'curve25519-js'
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from 'crypto'
import { KeyPair } from '../Types'

export const Curve = {
	generateKeyPair: (): KeyPair => {
		const { public: pubKey, private: privKey } = curveJs.generateKeyPair(randomBytes(32))
		return {
			private: Buffer.from(privKey),
			public: Buffer.from(pubKey)
		}
	},
	sharedKey: (privateKey: Uint8Array, publicKey: Uint8Array) => {
		const shared = curveJs.sharedKey(privateKey, publicKey)
		return Buffer.from(shared)
	},
	sign: (privateKey: Uint8Array, buf: Uint8Array) => (
		Buffer.from(curveJs.sign(privateKey, buf, null))
	),
	verify: (pubKey: Uint8Array, message: Uint8Array, signature: Uint8Array) => {
		return curveJs.verify(pubKey, message, signature)
	}
}

export const signedKeyPair = (keyPair: KeyPair, keyId: number) => {
    const signKeys = Curve.generateKeyPair()
    const pubKey = new Uint8Array(33)
    pubKey.set([5], 0)
    pubKey.set(signKeys.public, 1)

    const signature = Curve.sign(keyPair.private, pubKey)
  
    return { keyPair: signKeys, signature, keyId }
}

/** decrypt AES 256 CBC; where the IV is prefixed to the buffer */
export function aesDecrypt(buffer: Buffer, key: Buffer) {
    return aesDecryptWithIV(buffer.slice(16, buffer.length), key, buffer.slice(0, 16))
}
/** decrypt AES 256 CBC */
export function aesDecryptWithIV(buffer: Buffer, key: Buffer, IV: Buffer) {
    const aes = createDecipheriv('aes-256-cbc', key, IV)
    return Buffer.concat([aes.update(buffer), aes.final()])
}
// encrypt AES 256 CBC; where a random IV is prefixed to the buffer
export function aesEncrypt(buffer: Buffer | Uint8Array, key: Buffer) {
    const IV = randomBytes(16)
    const aes = createCipheriv('aes-256-cbc', key, IV)
    return Buffer.concat([IV, aes.update(buffer), aes.final()]) // prefix IV to the buffer
}
// encrypt AES 256 CBC with a given IV
export function aesEncrypWithIV(buffer: Buffer, key: Buffer, IV: Buffer) {
    const aes = createCipheriv('aes-256-cbc', key, IV)
    return Buffer.concat([aes.update(buffer), aes.final()]) // prefix IV to the buffer
}
// sign HMAC using SHA 256
export function hmacSign(buffer: Buffer | Uint8Array, key: Buffer | Uint8Array, variant: 'sha256' | 'sha512' = 'sha256') {
    return createHmac(variant, key).update(buffer).digest()
}
export function sha256(buffer: Buffer) {
    return createHash('sha256').update(buffer).digest()
}
// HKDF key expansion
// from: https://github.com/benadida/node-hkdf
export function hkdf(buffer: Uint8Array, expandedLength: number, { info, salt }: { salt?: Buffer, info?: string }) {
    const hashAlg = 'sha256'
    const hashLength = 32
    salt = salt || Buffer.alloc(hashLength)
    // now we compute the PRK
    const prk = createHmac(hashAlg, salt).update(buffer).digest()

    let prev = Buffer.from([])
    const buffers = []
    const num_blocks = Math.ceil(expandedLength / hashLength)
    
    const infoBuff = Buffer.from(info || [])

    for (var i=0; i<num_blocks; i++) {
      const hmac = createHmac(hashAlg, prk)
      // XXX is there a more optimal way to build up buffers?
      const input = Buffer.concat([
        prev,
        infoBuff,
        Buffer.from(String.fromCharCode(i + 1))
      ]);
      hmac.update(input)

      prev = hmac.digest()
      buffers.push(prev)
    }
    return Buffer.concat(buffers, expandedLength)
}