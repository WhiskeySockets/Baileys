import { Boom } from '@hapi/boom'
import CurveCrypto from 'libsignal/src/curve25519_wrapper'
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from 'crypto'
import { platform, release } from 'os'
import { KeyPair } from '../Types'
import { proto } from '../../WAProto'
import { Binary } from '../WABinary'

const PLATFORM_MAP = {
    'aix': 'AIX',
    'darwin': 'Mac OS',
    'win32': 'Windows',
    'android': 'Android'
}

export const Browsers = {
    ubuntu: browser => ['Ubuntu', browser, '18.04'] as [string, string, string],
    macOS: browser => ['Mac OS', browser, '10.15.3'] as [string, string, string],
    baileys: browser => ['Baileys', browser, '4.0.0'] as [string, string, string],
    /** The appropriate browser based on your OS & release */
    appropriate: browser => [ PLATFORM_MAP[platform()] || 'Ubuntu', browser, release() ] as [string, string, string]
}

export const BufferJSON = {
    replacer: (k, value: any) => {
        if(Buffer.isBuffer(value) || value instanceof Uint8Array || value?.type === 'Buffer') {
            return { type: 'Buffer', data: Buffer.from(value?.data || value).toString('base64') }
        }
        return value
    },
    reviver: (_, value: any) => {
        if(typeof value === 'object' && !!value && (value.buffer === true || value.type === 'Buffer')) {
            const val = value.data || value.value 
            return typeof val === 'string' ? Buffer.from(val, 'base64') : Buffer.from(val)
        }
        return value
      } 
}


export const writeRandomPadMax16 = function(e: Binary) {
    function r(e: Binary, t: number) {
      for (var r = 0; r < t; r++)
          e.writeUint8(t)
    }
  
    var t = randomBytes(1)
    r(e, 1 + (15 & t[0]))
    return e
}

export const unpadRandomMax16 = (e: Uint8Array | Buffer) => {
    const t = new Uint8Array(e);
    if (0 === t.length) {
        throw new Error('unpadPkcs7 given empty bytes');
    }
  
    var r = t[t.length - 1];
    if (r > t.length) {
        throw new Error(`unpad given ${t.length} bytes, but pad is ${r}`);
    }
  
    return new Uint8Array(t.buffer, t.byteOffset, t.length - r);
}

export const encodeWAMessage = (message: proto.IMessage) => (
    Buffer.from(
        writeRandomPadMax16(
            new Binary(proto.Message.encode(message).finish())
        ).readByteArray()
    )
)

export const generateCurveKeyPair = (): KeyPair => {
    const { pubKey, privKey } = CurveCrypto.keyPair(randomBytes(32))
    return {
        private: Buffer.from(privKey),
        public: Buffer.from(pubKey)
    }
}

export const generateSharedKey = (privateKey: Uint8Array, publicKey: Uint8Array) => {
    const shared = CurveCrypto.sharedSecret(publicKey, privateKey)
    return Buffer.from(shared)
}

export const curveSign = (privateKey: Uint8Array, buf: Uint8Array) => (
    Buffer.from(CurveCrypto.sign(privateKey, buf))
)

export const curveVerify = (pubKey: Uint8Array, message: Uint8Array, signature: Uint8Array) => {
    try {
        CurveCrypto.verify(pubKey, message, signature)
        return true
    } catch(error) {
        if(error.message.includes('Invalid')) {
            return false
        }
        throw error
    }
}

export const signedKeyPair = (keyPair: KeyPair, keyId: number) => {
    const signKeys = generateCurveKeyPair()
    const pubKey = new Uint8Array(33)
    pubKey.set([5], 0)
    pubKey.set(signKeys.public, 1)

    const signature = curveSign(keyPair.private, pubKey)
  
    return { keyPair: signKeys, signature, keyId }
}

export const generateRegistrationId = () => (
    Uint16Array.from(randomBytes(2))[0] & 0x3fff
)

export const encodeInt = (e: number, t: number) => {
    for (var r = t, a = new Uint8Array(e), i = e - 1; i >= 0; i--) {
        a[i] = 255 & r
        r >>>= 8
    }
    return a
}
export const encodeBigEndian = (e: number, t=4) => {
    let r = e;
    let a = new Uint8Array(t);
    for (let i = t - 1; i >= 0; i--) {
      a[i] = 255 & r
      r >>>= 8
    }
    return a
}

export const toNumber = (t: Long | number) => (typeof t?.['low'] !== 'undefined' ? t['low'] : t) as number

export const whatsappID = (jid: string) => jid?.replace ('@c.us', '@s.whatsapp.net')
export const isGroupID = (jid: string) => jid?.endsWith ('@g.us')

export function shallowChanges <T> (old: T, current: T, {lookForDeletedKeys}: {lookForDeletedKeys: boolean}): Partial<T> {
    let changes: Partial<T> = {}
    for (let key in current) {
        if (old[key] !== current[key]) {
            changes[key] = current[key] || null
        }
    }
    if (lookForDeletedKeys) {
        for (let key in old) {
            if (!changes[key] && old[key] !== current[key]) {
                changes[key] = current[key] || null
            }
        }
    }
    return changes
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
export function hkdf(buffer: Buffer, expandedLength: number, { info, salt }: { salt?: Buffer, info?: string }) {
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
/** unix timestamp of a date in seconds */
export const unixTimestampSeconds = (date: Date = new Date()) => Math.floor(date.getTime()/1000)

export type DebouncedTimeout = ReturnType<typeof debouncedTimeout>

export const debouncedTimeout = (intervalMs: number = 1000, task: () => void = undefined) => {
    let timeout: NodeJS.Timeout
    return {
        start: (newIntervalMs?: number, newTask?: () => void) => {
            task = newTask || task
            intervalMs = newIntervalMs || intervalMs
            timeout && clearTimeout(timeout)
            timeout = setTimeout(task, intervalMs)
        },
        cancel: () => {
            timeout && clearTimeout(timeout)
            timeout = undefined
        },
        setTask: (newTask: () => void) => task = newTask,
        setInterval: (newInterval: number) => intervalMs = newInterval
    }
}

export const delay = (ms: number) => delayCancellable (ms).delay
export const delayCancellable = (ms: number) => {
    const stack = new Error().stack
    let timeout: NodeJS.Timeout
    let reject: (error) => void
    const delay: Promise<void> = new Promise((resolve, _reject) => {
        timeout = setTimeout(resolve, ms)
        reject = _reject
    })
    const cancel = () => {
        clearTimeout (timeout)
        reject(
            new Boom('Cancelled', {
                statusCode: 500,
                data: {
                    stack
                }
            })
        )
    }
    return { delay, cancel }
}
export async function promiseTimeout<T>(ms: number, promise: (resolve: (v?: T)=>void, reject: (error) => void) => void) {
    if (!ms) return new Promise (promise)
    const stack = new Error().stack
    // Create a promise that rejects in <ms> milliseconds
    let {delay, cancel} = delayCancellable (ms) 
    const p = new Promise ((resolve, reject) => {
        delay
        .then(() => reject(
            new Boom('Timed Out', {
                statusCode: 408,
                data: {
                    stack
                }
            })
        ))
        .catch (err => reject(err)) 
        
        promise (resolve, reject)
    })
    .finally (cancel)
    return p as Promise<T>
}
// generate a random ID to attach to a message
export const generateMessageID = () => 'BAE5' + randomBytes(6).toString('hex').toUpperCase()