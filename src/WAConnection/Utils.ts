import * as Crypto from 'crypto'
import { Readable, Transform } from 'stream'
import HKDF from 'futoin-hkdf'
import Jimp from 'jimp'
import {createReadStream, createWriteStream, promises as fs, WriteStream} from 'fs'
import { exec } from 'child_process'
import {platform, release, tmpdir} from 'os'
import HttpsProxyAgent from 'https-proxy-agent'
import { URL } from 'url'
import { Agent } from 'https'
import Decoder from '../Binary/Decoder'
import { MessageType, HKDFInfoKeys, MessageOptions, WAChat, WAMessageContent, BaileysError, WAMessageProto, TimedOutError, CancelledError, WAGenericMediaMessage, WAMessage, WAMessageKey, DEFAULT_ORIGIN, WAMediaUpload } from './Constants'
import KeyedDB from '@adiwajshing/keyed-db'
import got, { Options, Response } from 'got'
import { join } from 'path'
import { IAudioMetadata } from 'music-metadata'
import { once } from 'events'

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
export const toNumber = (t: Long | number) => (t['low'] || t) as number
export const waChatKey = (pin: boolean) => ({
    key: (c: WAChat) => (pin ? (c.pin ? '1' : '0') : '') + (c.archive === 'true' ? '0' : '1') + c.t.toString(16).padStart(8, '0') + c.jid,
    compare: (k1: string, k2: string) => k2.localeCompare (k1)
})
export const waMessageKey = {
    key: (m: WAMessage) => (5000 + (m['epoch'] || 0)).toString(16).padStart(6, '0') + toNumber(m.messageTimestamp).toString(16).padStart(8, '0'),
    compare: (k1: string, k2: string) => k1.localeCompare (k2)
}
export const WA_MESSAGE_ID = (m: WAMessage) => GET_MESSAGE_ID (m.key)
export const GET_MESSAGE_ID = (key: WAMessageKey) => `${key.id}|${key.fromMe ? 1 : 0}`

export const whatsappID = (jid: string) => jid?.replace ('@c.us', '@s.whatsapp.net')
export const isGroupID = (jid: string) => jid?.endsWith ('@g.us')

export const newMessagesDB = (messages: WAMessage[] = []) => {
    const db = new KeyedDB(waMessageKey, WA_MESSAGE_ID)
    messages.forEach(m => !db.get(WA_MESSAGE_ID(m)) && db.insert(m))
    return db
} 

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
        reject (CancelledError(stack))
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
        .then(() => reject(TimedOutError(stack)))
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
    return '3EB0' + randomBytes(4).toString('hex').toUpperCase()
}
export function decryptWA (message: string | Buffer, macKey: Buffer, encKey: Buffer, decoder: Decoder, fromMe: boolean=false): [string, Object, [number, number]?] {
    let commaIndex = message.indexOf(',') // all whatsapp messages have a tag and a comma, followed by the actual message
    if (commaIndex < 0) throw new BaileysError ('invalid message', { message }) // if there was no comma, then this message must be not be valid
    
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
                throw new BaileysError ('recieved encrypted buffer when auth creds unavailable', { message })
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
                throw new BaileysError ('checksum failed', {
                    received: checksum.toString('hex'),
                    computed: computedChecksum.toString('hex'),
                    data: data.slice(0, 80).toString(),
                    tag: messageTag,
                    message: message.slice(0, 80).toString()
                })
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

export const compressImage = async (bufferOrFilePath: Buffer | string) => {
    const jimp = await Jimp.read(bufferOrFilePath as any)
    const result = await jimp.resize(48, 48).getBufferAsync(Jimp.MIME_JPEG)
    return result
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
export async function getAudioDuration (buffer: Buffer | string) {
    const musicMetadata = await import ('music-metadata')
    let metadata: IAudioMetadata
    if(Buffer.isBuffer(buffer)) {
        metadata = await musicMetadata.parseBuffer(buffer, null, { duration: true })
    } else {
        const rStream = createReadStream(buffer)
        metadata = await musicMetadata.parseStream(rStream, null, { duration: true })
        rStream.close()
    }
    return metadata.format.duration;
}
export const toReadable = (buffer: Buffer) => {
    const readable = new Readable({ read: () => {} })
    readable.push(buffer)
    readable.push(null)
    return readable
}
export const getStream = async (item: WAMediaUpload) => {
    if(Buffer.isBuffer(item)) return { stream: toReadable(item), type: 'buffer' }
    if(item.url.toString().startsWith('http://') || item.url.toString().startsWith('https://')) {
        return { stream: await getGotStream(item.url), type: 'remote' }
    }
    return { stream: createReadStream(item.url), type: 'file' }
}
/** generates a thumbnail for a given media, if required */
export async function generateThumbnail(file: string, mediaType: MessageType, info: MessageOptions) {
    if ('thumbnail' in info) {
        // don't do anything if the thumbnail is already provided, or is null
        if (mediaType === MessageType.audio) {
            throw new Error('audio messages cannot have thumbnails')
        }
    } else if (mediaType === MessageType.image) {
        const buff = await compressImage(file)
        info.thumbnail = buff.toString('base64')
    } else if (mediaType === MessageType.video) {
        const imgFilename = join(tmpdir(), generateMessageID() + '.jpg')
        try {
            await extractVideoThumb(file, imgFilename, '00:00:00', { width: 48, height: 48 })
            const buff = await fs.readFile(imgFilename)
            info.thumbnail = buff.toString('base64')
            await fs.unlink(imgFilename)
        } catch (err) {
            console.log('could not generate video thumb: ' + err)
        }
    }
}
export const getGotStream = async(url: string | URL, options: Options & { isStream?: true } = {}) => {
    const fetched = got.stream(url, { ...options, isStream: true })
    await new Promise((resolve, reject) => {
        fetched.once('error', reject)
        fetched.once('response', ({statusCode: status}: Response) => {
            if (status >= 400) {
                reject(new BaileysError (
                    'Invalid code (' + status + ') returned', 
                    { status }
                ))
            } else {
                resolve(undefined)
            }
        })
    })
    return fetched
} 
export const encryptedStream = async(media: WAMediaUpload, mediaType: MessageType, saveOriginalFileIfRequired = true) => {
    const { stream, type } = await getStream(media)

    const mediaKey = randomBytes(32)
    const {cipherKey, iv, macKey} = getMediaKeys(mediaKey, mediaType)
    // random name
    const encBodyPath = join(tmpdir(), mediaType + generateMessageID() + '.enc')
    const encWriteStream = createWriteStream(encBodyPath)
    let bodyPath: string
    let writeStream: WriteStream
    if(type === 'file') {
        bodyPath = (media as any).url
    } else if(saveOriginalFileIfRequired) {
        bodyPath = join(tmpdir(), mediaType + generateMessageID())
        writeStream = createWriteStream(bodyPath)
    }
    
    let fileLength = 0
    const aes = Crypto.createCipheriv('aes-256-cbc', cipherKey, iv)
    let hmac = Crypto.createHmac('sha256', macKey).update(iv)
    let sha256Plain = Crypto.createHash('sha256')
    let sha256Enc = Crypto.createHash('sha256')

    const onChunk = (buff: Buffer) => {
        sha256Enc = sha256Enc.update(buff)
        hmac = hmac.update(buff)
        encWriteStream.write(buff)
    }
    for await(const data of stream) {
        fileLength += data.length
        sha256Plain = sha256Plain.update(data)
        if (writeStream && !writeStream.write(data)) await once(writeStream, 'drain') 
        onChunk(aes.update(data))
    }
    onChunk(aes.final())

    const mac = hmac.digest().slice(0, 10)
    sha256Enc = sha256Enc.update(mac)
    
    const fileSha256 = sha256Plain.digest()
    const fileEncSha256 = sha256Enc.digest()
    
    encWriteStream.write(mac)
    encWriteStream.end()

    writeStream && writeStream.end()

    return {
        mediaKey,
        encBodyPath,
        bodyPath,
        mac,
        fileEncSha256,
        fileSha256,
        fileLength,
        didSaveToTmpPath: type !== 'file'
    }
}
/**
 * Decode a media message (video, image, document, audio) & return decrypted buffer
 * @param message the media message you want to decode
 */
export async function decryptMediaMessageBuffer(message: WAMessageContent): Promise<Readable> {
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
        const buffer = Buffer.from(message[type].jpegThumbnail)
        const readable = new Readable({ read: () => {} })
        readable.push(buffer)
        readable.push(null)
        return readable
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
    const fetched = await getGotStream(messageContent.url, {
        headers: { Origin: DEFAULT_ORIGIN }
    })
    let remainingBytes = Buffer.from([])
    const { cipherKey, iv } = getMediaKeys(messageContent.mediaKey, type)
    const aes = Crypto.createDecipheriv("aes-256-cbc", cipherKey, iv)

    const output = new Transform({
        transform(chunk, _, callback) {
            let data = Buffer.concat([remainingBytes, chunk])
            const decryptLength =
                Math.floor(data.length / 16) * 16
            remainingBytes = data.slice(decryptLength)
            data = data.slice(0, decryptLength)

            try {
                this.push(aes.update(data))
                callback()
            } catch(error) {
                callback(error)
            }  
        },
        final(callback) {
            try {
                this.push(aes.final())
                callback()
            } catch(error) {
                callback(error)
            }
        },
    })
    return fetched.pipe(output, { end: true })
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
