import Boom from 'boom'
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from 'crypto'
import HKDF from 'futoin-hkdf'
import { platform, release } from 'os'

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
export const toNumber = (t: Long | number) => (t['low'] || t) as number

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
export function aesEncrypt(buffer: Buffer, key: Buffer) {
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
export function hmacSign(buffer: Buffer, key: Buffer) {
    return createHmac('sha256', key).update(buffer).digest()
}
export function sha256(buffer: Buffer) {
    return createHash('sha256').update(buffer).digest()
}
// HKDF key expansion
export function hkdf(buffer: Buffer, expandedLength: number, info = null) {
    return HKDF(buffer, expandedLength, { salt: Buffer.alloc(32), info: info, hash: 'SHA-256' })
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
// whatsapp requires a message tag for every message, we just use the timestamp as one
export function generateMessageTag(epoch?: number) {
    let tag = unixTimestampSeconds().toString()
    if (epoch) tag += '.--' + epoch // attach epoch if provided
    return tag
}
// generate a random 16 byte client ID
export const generateClientID = () => randomBytes(16).toString('base64')
// generate a random ID to attach to a message
// this is the format used for WA Web 4 byte hex prefixed with 3EB0
export const generateMessageID = () => '3EB0' + randomBytes(4).toString('hex').toUpperCase()