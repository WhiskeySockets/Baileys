import { deepStrictEqual, strictEqual } from 'assert'
import { createWriteStream } from 'fs'
import { readFile } from 'fs/promises'
import { proto } from '../../WAMessage/WAMessage'
import { MessageType } from '../WAConnection'
import { aesEncrypWithIV, decryptMediaMessageBuffer, encryptedStream, getMediaKeys, getStream, hmacSign, sha256 } from '../WAConnection/Utils'
import { WAConnectionTest } from './Common'

describe('Media Download Tests', () => {

    it('should encrypt media streams correctly', async function() {
        const url = './Media/meme.jpeg'
        const streamValues = await encryptedStream({ url }, MessageType.image)
        
        const buffer = await readFile(url)
        const mediaKeys = getMediaKeys(streamValues.mediaKey, MessageType.image)

        const enc = aesEncrypWithIV(buffer, mediaKeys.cipherKey, mediaKeys.iv)
        const mac = hmacSign(Buffer.concat([mediaKeys.iv, enc]), mediaKeys.macKey).slice(0, 10)
        const body = Buffer.concat([enc, mac]) // body is enc + mac
        const fileSha256 = sha256(buffer)
        const fileEncSha256 = sha256(body)
        
        deepStrictEqual(streamValues.fileSha256, fileSha256)
        strictEqual(streamValues.fileLength, buffer.length)
        deepStrictEqual(streamValues.mac, mac)
        deepStrictEqual(await readFile(streamValues.encBodyPath), body)
        deepStrictEqual(streamValues.fileEncSha256, fileEncSha256)
        
    })
})
/*
WAConnectionTest('Media Upload', conn => {

    it('should upload the same file', async () => {
        const FILES = [
            { url: './Media/meme.jpeg', type: MessageType.image },
            { url: './Media/ma_gif.mp4', type: MessageType.video },
            { url: './Media/sonata.mp3', type: MessageType.audio },
        ]
    })

})*/