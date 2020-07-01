import * as Crypto from 'crypto'
import HKDF from 'futoin-hkdf'

/** decrypt AES 256 CBC; where the IV is prefixed to the buffer */

export function aesDecrypt(buffer: Buffer, key: Buffer) {
    return aesDecryptWithIV(buffer.slice(16, buffer.length), key, buffer.slice(0, 16))
}
/** decrypt AES 256 CBC */
export function aesDecryptWithIV(buffer: Buffer, key: Buffer, IV: Buffer) {
    const aes = Crypto.createDecipheriv('aes-256-cbc', key, IV)
    return Buffer.concat([aes.update(buffer), aes.final()])
}
// encrypt AES 256 CBC; where a random IV is prefixed to the buffer
export function aesEncrypt(buffer: Buffer, key: Buffer) {
    const IV = randomBytes(16)
    const aes = Crypto.createCipheriv('aes-256-cbc', key, IV)
    return Buffer.concat([IV, aes.update(buffer), aes.final()]) // prefix IV to the buffer
}
// encrypt AES 256 CBC with a given IV
export function aesEncrypWithIV(buffer: Buffer, key: Buffer, IV: Buffer) {
    const aes = Crypto.createCipheriv('aes-256-cbc', key, IV)
    return Buffer.concat([aes.update(buffer), aes.final()]) // prefix IV to the buffer
}
// sign HMAC using SHA 256
export function hmacSign(buffer: Buffer, key: Buffer) {
    return Crypto.createHmac('sha256', key).update(buffer).digest()
}
export function sha256(buffer: Buffer) {
    return Crypto.createHash('sha256').update(buffer).digest()
}
// HKDF key expansion
export function hkdf(buffer: Buffer, expandedLength: number, info = null) {
    return HKDF(buffer, expandedLength, { salt: Buffer.alloc(32), info: info, hash: 'SHA-256' })
}
// generate a buffer with random bytes of the specified length
export function randomBytes(length) {
    return Crypto.randomBytes(length)
}
export function promiseTimeout<T>(ms: number, promise: Promise<T>) {
    if (!ms) { return promise }
    // Create a promise that rejects in <ms> milliseconds
    const timeout = new Promise((_, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id)
            reject('Timed out')
        }, ms)
    })
    return Promise.race([promise, timeout]) as Promise<T>
}
// whatsapp requires a message tag for every message, we just use the timestamp as one
export function generateMessageTag() {
    return new Date().getTime().toString()
}
// generate a random 16 byte client ID
export function generateClientID() {
    return randomBytes(16).toString('base64')
}
// generate a random 10 byte ID to attach to a message
export function generateMessageID() {
    return randomBytes(10).toString('hex').toUpperCase()
}

export function errorOnNon200Status(p: Promise<any>) {
    return p.then((json) => {
        if (json.status && typeof json.status === 'number' && Math.floor(json.status / 100) !== 2) {
            throw new Error(`Unexpected status code: ${json.status}`)
        }
        return json
    })
}
