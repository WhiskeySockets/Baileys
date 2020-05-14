const Crypto = require("crypto")
const HKDF = require("futoin-hkdf")
const sharp = require("sharp")
const VideoThumb = require("video-thumb")
const fs = require("fs")

/* 
    Basic cryptographic utilities to interact with WhatsApp servers
*/
module.exports = {
    // decrypt AES 256 CBC; where the IV is prefixed to the buffer
    aesDecrypt: function (buffer, key) {
        return this.aesDecryptWithIV(buffer.slice(16, buffer.length), key, buffer.slice(0,16))
    },
    // decrypt AES 256 CBC
    aesDecryptWithIV: function (buffer, key, IV) {
        const aes = Crypto.createDecipheriv('aes-256-cbc', key, IV )
        return Buffer.concat( [ aes.update(buffer), aes.final() ] )
    },
    // encrypt AES 256 CBC; where a random IV is prefixed to the buffer
    aesEncrypt: function (buffer, key) {
        const IV = this.randomBytes(16)
        const aes = Crypto.createCipheriv('aes-256-cbc', key, IV)
        return Buffer.concat( [ IV, aes.update(buffer), aes.final() ] ) // prefix IV to the buffer
    },
    // encrypt AES 256 CBC with a given IV
    aesEncrypWithIV: function (buffer, key, IV) {
        const aes = Crypto.createCipheriv('aes-256-cbc', key, IV)
        return Buffer.concat( [ aes.update(buffer), aes.final() ] ) // prefix IV to the buffer
    },
    // sign HMAC using SHA 256
    hmacSign: function (buffer, key) {
        return Crypto.createHmac('sha256', key).update(buffer).digest()
    },
    sha256: function (buffer) {
        return Crypto.createHash('sha256').update(buffer).digest()
    },
    // HKDF key expansion
    hkdf: function (buffer, expandedLength, info) {
        return HKDF(buffer, expandedLength, {salt: Buffer.alloc(32), info: info, hash: 'SHA-256'})
    },
    // generates all the keys required to encrypt/decrypt & sign a media message
    getMediaKeys: function (buffer, mediaType) {
        // info to put into the HKDF key expansion 
        const appInfo = {
            'imageMessage': 'WhatsApp Image Keys',
            'videoMessage': 'WhatsApp Video Keys',
            'audioMessage': 'WhatsApp Audio Keys',
            'documentMessage': 'WhatsApp Document Keys',
            'stickerMessage': 'WhatsApp Image Keys'
        }
        // expand using HKDF to 112 bytes, also pass in the relevant app info
        const expandedMediaKey = this.hkdf(buffer, 112, appInfo[mediaType])
        return {
            iv: expandedMediaKey.slice(0, 16),
            cipherKey: expandedMediaKey.slice(16, 48),
            macKey: expandedMediaKey.slice(48, 80)
        }
    },
    // generates a thumbnail for a given media, if required
    generateThumbnail: function (buffer, mediaType, info) {
        let promise
        if (info.thumbnail === null || info.thumbnail) { // don't do anything if the thumbnail is already provided, or is null
            if (mediaType === 'audioMessage') {
                promise = Promise.reject("audio messages cannot have thumbnails")
            } else {
                promise = Promise.resolve()
            }
        } else {
            if (mediaType === 'imageMessage' || mediaType === 'stickerMessage') {
                promise = sharp(buffer) // generate a 48x48 thumb
                          .resize(48, 48)
                          .jpeg()
                          .toBuffer()
                          .then (buffer => info.thumbnail = buffer.toString('base64'))
            } else if (mediaType === 'videoMessage') {
                const filename = "./" + this.randomBytes(5).toString("hex") + ".mp4"
                fs.writeFileSync(filename, buffer)

                promise = new Promise ( (resolve, reject) => {
                    VideoThumb.extract (filename, filename + ".png", "00:00:00", "48x48", (err) => {
                        if (err) {
                            console.log("could not generate video thumb: " + err)
                            resolve()
                        } else {
                            const buff = fs.readFileSync(filename + ".png")
                            return sharp(buff)
                                .jpeg()
                                .toBuffer()
                                .then (buffer => info.thumbnail = buffer.toString('base64'))
                                .then (() => {
                                    fs.unlinkSync(filename)
                                    fs.unlinkSync(filename + ".png")
                                    resolve()
                                })
                        }
                    })
                })
            } else {
                promise = Promise.resolve()
            }
        }
        return promise
    },
    // generate a buffer with random bytes of the specified length
    randomBytes: function (length) { return Crypto.randomBytes(length) },
    promiseTimeout: function(ms, promise) {
        // Create a promise that rejects in <ms> milliseconds
        let timeout = new Promise((_, reject) => {
            let id = setTimeout(() => {
                clearTimeout(id)
                reject('Timed out')
            }, ms)
        })
        return Promise.race([promise, timeout])
    },
    // whatsapp requires a message tag for every message, we just use the timestamp as one
    generateMessageTag: function () { return new Date().getTime().toString() },
    // generate a random 16 byte client ID
    generateClientID: function () { return this.randomBytes(16).toString('base64') },
    // generate a random 10 byte ID to attach to a message
	generateMessageID: function () { return this.randomBytes(10).toString('hex').toUpperCase() }
}