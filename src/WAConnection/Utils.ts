import * as Crypto from 'crypto'
import HKDF from 'futoin-hkdf'
import Decoder from '../Binary/Decoder'
import {platform, release} from 'os'
import { BaileysError, WAChat } from './Constants'
import UserAgent from 'user-agents'

const platformMap = {
    'aix': 'AIX',
    'darwin': 'Mac OS',
    'win32': 'Windows',
    'android': 'Android'
}
export const Browsers = {
    ubuntu: browser => ['Ubuntu', browser, '18.04'] as [string, string, string],
    macOS: browser => ['Mac OS', browser, '10.15.3'] as [string, string, string],
    baileys: browser => ['Baileys', browser, '2.0'] as [string, string, string],
    /** The appropriate browser based on your OS & release */
    appropriate: browser => [ platformMap [platform()] || 'Ubuntu', browser, release() ] as [string, string, string]
}
function hashCode(s: string) {
    for(var i = 0, h = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h;
}
export const waChatUniqueKey = (c: WAChat) => ((+c.t*1000) + (hashCode(c.jid)%1000))*-1 // -1 to sort descending

export function userAgentString (browser) {
    const agent = new UserAgent (new RegExp(browser))
    return agent.toString ()
}
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
export const createTimeout = (timeout) => new Promise(resolve => setTimeout(resolve, timeout))
export async function promiseTimeout<T>(ms: number, promise: Promise<T>) {
    if (!ms) return promise
    // Create a promise that rejects in <ms> milliseconds
    let timeoutI
    const timeout = new Promise(
        (_, reject) => timeoutI = setTimeout(() => reject(new BaileysError ('Timed out', promise)), ms)
    )
    try {
        const content = await Promise.race([promise, timeout])
        return content as T
    } finally {
        clearTimeout (timeoutI)
    }
}
// whatsapp requires a message tag for every message, we just use the timestamp as one
export function generateMessageTag(epoch?: number) {
    let tag = Math.round(new Date().getTime()/1000).toString()
    if (epoch) tag += '.--' + epoch // attach epoch if provided
    return tag
}
// generate a random 16 byte client ID
export function generateClientID() {
    return randomBytes(16).toString('base64')
}
// generate a random 10 byte ID to attach to a message
export function generateMessageID() {
    return randomBytes(10).toString('hex').toUpperCase()
}
export function decryptWA (message: any, macKey: Buffer, encKey: Buffer, decoder: Decoder, fromMe: boolean=false): [string, Object, [number, number]?] {
    let commaIndex = message.indexOf(',') // all whatsapp messages have a tag and a comma, followed by the actual message
    
    if (commaIndex < 0) throw Error ('invalid message: ' + message) // if there was no comma, then this message must be not be valid
    
    if (message[commaIndex+1] === ',') commaIndex += 1
    let data = message.slice(commaIndex+1, message.length)
    // get the message tag.
    // If a query was done, the server will respond with the same message tag we sent the query with
    const messageTag: string = message.slice(0, commaIndex).toString()
    if (data.length === 0) {
        // got an empty message, usually get one after sending a query with the 128 tag
        return 
    }

    let json
    let tags = null
    if (data[0] === '[' || data[0] === '{') {
        // if the first character is a "[", then the data must just be plain JSON array or object
        json = JSON.parse(data) // parse the JSON
    } else {
        if (!macKey || !encKey) {
            // if we recieved a message that was encrypted but we don't have the keys, then there must be an error
            throw new Error ('recieved encrypted buffer when auth creds unavailable')
        }
        /* 
            If the data recieved was not a JSON, then it must be an encrypted message.
            Such a message can only be decrypted if we're connected successfully to the servers & have encryption keys
        */
        if (fromMe) {
            tags = [data[0], data[1]]
            data = data.slice(2, data.length)
        }
        
        const checksum = data.slice(0, 32) // the first 32 bytes of the buffer are the HMAC sign of the message
        data = data.slice(32, data.length) // the actual message
        const computedChecksum = hmacSign(data, macKey) // compute the sign of the message we recieved using our macKey
        
        if (!checksum.equals(computedChecksum)) {
            throw new Error (`Checksums don't match:\nog: ${checksum.toString('hex')}\ncomputed: ${computedChecksum.toString('hex')}`)
        }
        // the checksum the server sent, must match the one we computed for the message to be valid
        const decrypted = aesDecrypt(data, encKey) // decrypt using AES
        json = decoder.read(decrypted) // decode the binary message into a JSON array
    }
    return [messageTag, json, tags]
}