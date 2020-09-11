import * as Crypto from 'crypto'
import HKDF from 'futoin-hkdf'
import Jimp from 'jimp'
import {promises as fs} from 'fs'
import { exec } from 'child_process'
import {platform, release} from 'os'
import HttpsProxyAgent from 'https-proxy-agent'
import { URL } from 'url'
import { Agent } from 'https'

import Decoder from '../Binary/Decoder'
import { MessageType, HKDFInfoKeys, MessageOptions, WAChat, WAMessageContent, BaileysError, WAMessageProto, TimedOutError, CancelledError, WAGenericMediaMessage } from './Constants'

const platformMap = {
    'aix': 'AIX',
    'darwin': 'Mac OS',
    'win32': 'Windows',
    'android': 'Android'
}
export const Browsers = {
    ubuntu: browser => ['Ubuntu', browser, '18.04'] as [string, string, string],
    macOS: browser => ['Mac OS', browser, '10.15.3'] as [string, string, string],
    baileys: browser => ['Baileys', browser, '3.0'] as [string, string, string],
    /** The appropriate browser based on your OS & release */
    appropriate: browser => [ platformMap [platform()] || 'Ubuntu', browser, release() ] as [string, string, string]
}
function hashCode(s: string) {
    for(var i = 0, h = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h;
}
export const toNumber = (t: Long | number) => (t['low'] || t) as number
export const waChatUniqueKey = (c: WAChat) => ((c.t*100000) + (hashCode(c.jid)%100000))*-1 // -1 to sort descending
export const whatsappID = (jid: string) => jid?.replace ('@c.us', '@s.whatsapp.net')
export const isGroupID = (jid: string) => jid?.includes ('@g.us')

export function shallowChanges <T> (old: T, current: T): Partial<T> {
    let changes: Partial<T> = {}
    for (let key in current) {
        if (old[key] !== current[key]) {
            changes[key] = current[key] || null
        }
    }
    for (let key in old) {
        if (!changes[key] && old[key] !== current[key]) {
            changes[key] = current[key] || null
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
/** unix timestamp of a date in seconds */
export const unixTimestampSeconds = (date: Date = new Date()) => Math.floor(date.getTime()/1000)

export const delay = (ms: number) => delayCancellable (ms).delay
export const delayCancellable = (ms: number) => {
    let timeout: NodeJS.Timeout
    let reject: (error) => void
    const delay: Promise<void> = new Promise((resolve, _reject) => {
        timeout = setTimeout(resolve, ms)
        reject = _reject
    })
    const cancel = () => {
        clearTimeout (timeout)
        reject (CancelledError())
    }
    return { delay, cancel }
}
export async function promiseTimeout<T>(ms: number, promise: (resolve: (v?: T)=>void, reject: (error) => void) => void) {
    if (!ms) return new Promise (promise)

    // Create a promise that rejects in <ms> milliseconds
    let {delay, cancel} = delayCancellable (ms) 
    const p = new Promise ((resolve, reject) => {
        delay
        .then(() => reject(TimedOutError()))
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
export function generateClientID() {
    return randomBytes(16).toString('base64')
}
// generate a random 16 byte ID to attach to a message
export function generateMessageID() {
    return randomBytes(16).toString('hex').toUpperCase()
}
export function decryptWA (message: string | Buffer, macKey: Buffer, encKey: Buffer, decoder: Decoder, fromMe: boolean=false): [string, Object, [number, number]?] {
    let commaIndex = message.indexOf(',') // all whatsapp messages have a tag and a comma, followed by the actual message
    if (commaIndex < 0) throw Error ('invalid message: ' + message) // if there was no comma, then this message must be not be valid
    
    if (message[commaIndex+1] === ',') commaIndex += 1
    let data = message.slice(commaIndex+1, message.length)
    
    // get the message tag.
    // If a query was done, the server will respond with the same message tag we sent the query with
    const messageTag: string = message.slice(0, commaIndex).toString()
    let json
    let tags
    if (data.length > 0) {
        if (typeof data === 'string') {
            json = JSON.parse(data) // parse the JSON
        } else {
            if (!macKey || !encKey) {
                console.warn ('recieved encrypted buffer when auth creds unavailable: ' + message)
                return
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
            
            if (checksum.equals(computedChecksum)) {
                // the checksum the server sent, must match the one we computed for the message to be valid
                const decrypted = aesDecrypt(data, encKey) // decrypt using AES
                json = decoder.read(decrypted) // decode the binary message into a JSON array
            } else {
                console.error (`
                    Checksums don't match:
                    og: ${checksum.toString('hex')}
                    computed: ${computedChecksum.toString('hex')}
                    data: ${data.slice(0, 80).toString()}
                    tag: ${messageTag}
                    message: ${message.slice(0, 80).toString()}
                `)
            }
        }   
    }
    return [messageTag, json, tags]
}
/** generates all the keys required to encrypt/decrypt & sign a media message */
export function getMediaKeys(buffer, mediaType: MessageType) {
    if (typeof buffer === 'string') {
        buffer = Buffer.from (buffer.replace('data:;base64,', ''), 'base64')
    }
    // expand using HKDF to 112 bytes, also pass in the relevant app info
    const expandedMediaKey = hkdf(buffer, 112, HKDFInfoKeys[mediaType])
    return {
        iv: expandedMediaKey.slice(0, 16),
        cipherKey: expandedMediaKey.slice(16, 48),
        macKey: expandedMediaKey.slice(48, 80),
    }
}
/** Extracts video thumb using FFMPEG */
const extractVideoThumb = async (
    path: string,
    destPath: string,
    time: string,
    size: { width: number; height: number },
) =>
    new Promise((resolve, reject) => {
        const cmd = `ffmpeg -ss ${time} -i ${path} -y -s ${size.width}x${size.height} -vframes 1 -f image2 ${destPath}`
        exec(cmd, (err) => {
            if (err) reject(err)
            else resolve()
        })
    }) as Promise<void>

export const compressImage = async (buffer: Buffer) => {
    const jimp = await Jimp.read (buffer)
    return jimp.resize(48, 48).getBufferAsync (Jimp.MIME_JPEG)
}
export const generateProfilePicture = async (buffer: Buffer) => {
    const jimp = await Jimp.read (buffer)
    const min = Math.min(jimp.getWidth (), jimp.getHeight ())
    const cropped = jimp.crop (0, 0, min, min)
    return {
        img: await cropped.resize(640, 640).getBufferAsync (Jimp.MIME_JPEG),
        preview: await cropped.resize(96, 96).getBufferAsync (Jimp.MIME_JPEG)
    }
}
export const ProxyAgent = (host: string | URL) => HttpsProxyAgent(host) as any as Agent
/** gets the SHA256 of the given media message */
export const mediaMessageSHA256B64 = (message: WAMessageContent) => {
    const media = Object.values(message)[0] as WAGenericMediaMessage
    return media?.fileSha256 && Buffer.from(media.fileSha256).toString ('base64')
}

/** generates a thumbnail for a given media, if required */
export async function generateThumbnail(buffer: Buffer, mediaType: MessageType, info: MessageOptions) {
    if (info.thumbnail === null || info.thumbnail) {
        // don't do anything if the thumbnail is already provided, or is null
        if (mediaType === MessageType.audio) {
            throw new Error('audio messages cannot have thumbnails')
        }
    } else if (mediaType === MessageType.image) {
        const buff = await compressImage (buffer)
        info.thumbnail = buff.toString('base64')
    } else if (mediaType === MessageType.video) {
        const filename = './' + randomBytes(5).toString('hex') + '.mp4'
        const imgFilename = filename + '.jpg'
        await fs.writeFile(filename, buffer)
        try {
            await extractVideoThumb(filename, imgFilename, '00:00:00', { width: 48, height: 48 })
            const buff = await fs.readFile(imgFilename)
            info.thumbnail = buff.toString('base64')
            await fs.unlink(imgFilename)
        } catch (err) {
            console.log('could not generate video thumb: ' + err)
        }
        await fs.unlink(filename)
    }
}
/**
 * Decode a media message (video, image, document, audio) & return decrypted buffer
 * @param message the media message you want to decode
 */
export async function decodeMediaMessageBuffer(message: WAMessageContent, fetchRequest: (host: string, method: string) => any) {
    /* 
        One can infer media type from the key in the message
        it is usually written as [mediaType]Message. Eg. imageMessage, audioMessage etc.
    */
    const type = Object.keys(message)[0] as MessageType
    if (!type) {
        throw new BaileysError('unknown message type', message)
    }
    if (type === MessageType.text || type === MessageType.extendedText) {
        throw new BaileysError('cannot decode text message', message)
    }
    if (type === MessageType.location || type === MessageType.liveLocation) {
        return new Buffer(message[type].jpegThumbnail)
    }
    let messageContent: WAGenericMediaMessage
    if (message.productMessage) {
        const product = message.productMessage.product?.productImage
        if (!product) throw new BaileysError ('product has no image', message)
        messageContent = product
    } else {
        messageContent = message[type]
    }
    
    // download the message
    const fetched = await fetchRequest(messageContent.url, 'GET')
    const buffer = await fetched.buffer()

    if (buffer.length <= 10) {
        throw new BaileysError ('Empty buffer returned. File has possibly been deleted from WA servers. Run `client.updateMediaMessage()` to refresh the url', {status: 404})
    }

    const decryptedMedia = (type: MessageType) => {
        // get the keys to decrypt the message
        const mediaKeys = getMediaKeys(messageContent.mediaKey, type) //getMediaKeys(Buffer.from(messageContent.mediaKey, 'base64'), type)
        // first part is actual file
        const file = buffer.slice(0, buffer.length - 10)
        // last 10 bytes is HMAC sign of file
        const mac = buffer.slice(buffer.length - 10, buffer.length)
        // sign IV+file & check for match with mac
        const testBuff = Buffer.concat([mediaKeys.iv, file])
        const sign = hmacSign(testBuff, mediaKeys.macKey).slice(0, 10)
        // our sign should equal the mac
        if (!sign.equals(mac)) throw new Error()
        
        return aesDecryptWithIV(file, mediaKeys.cipherKey, mediaKeys.iv) // decrypt media
    }
    const allTypes = [type, ...Object.keys(HKDFInfoKeys)]
    for (let i = 0; i < allTypes.length;i++) {
        try {
            const decrypted = decryptedMedia (allTypes[i] as MessageType)
            
            if (i > 0) { console.log (`decryption of ${type} media with HKDF key of ${allTypes[i]}`) }
            return decrypted
        } catch {
            if (i === 0) { console.log (`decryption of ${type} media with original HKDF key failed`) }
        }
    }
    throw new BaileysError('Decryption failed, HMAC sign does not match', {status: 400})
}
export function extensionForMediaMessage(message: WAMessageContent) {
    const getExtension = (mimetype: string) => mimetype.split(';')[0].split('/')[1]
    const type = Object.keys(message)[0] as MessageType
    let extension: string
    if (type === MessageType.location || type === MessageType.liveLocation || type === MessageType.product) {
        extension = '.jpeg'
    } else {
        const messageContent = message[type] as
                                | WAMessageProto.VideoMessage
                                | WAMessageProto.ImageMessage
                                | WAMessageProto.AudioMessage
                                | WAMessageProto.DocumentMessage
        extension = getExtension (messageContent.mimetype)
    }
    return extension
}