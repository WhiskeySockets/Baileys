const Crypto = require("crypto")

/* 
    Basic cryptographic utilities to interact with WhatsApp servers
*/
module.exports = {
    // decrypt AES 256 CBC; where the IV is prefixed to the buffer
    aesDecrypt: function (buffer, key) {
        const aes = Crypto.createDecipheriv('aes-256-cbc', key, buffer.slice(0,16) ) // first 16 bytes of buffer is IV
        return Buffer.concat( [ aes.update(buffer.slice(16, buffer.length)), aes.final() ] )
    },
    // encrypt AES 256 CBC; where the IV is prefixed to the buffer
    aesEncrypt: function (buffer, key) {
        const IV = this.randomBytes(16)
        const aes = Crypto.createCipheriv('aes-256-cbc', key, IV)
        return Buffer.concat( [ IV, aes.update(buffer), aes.final() ] ) // prefix IV to the buffer
    },
    // sign HMAC using SHA 256
    hmacSign: function (buffer, key) {
        return Crypto.createHmac('sha256', key).update(buffer).digest()
    },
    // generate a buffer with random bytes of the specified length
    randomBytes: function (length) { return Crypto.randomBytes(length) },

    // whatsapp requires a message tag for every message, we just use the timestamp as one
    generateMessageTag: function () { return new Date().getTime().toString() },
    // generate a random 16 byte client ID
    generateClientID: function () { return this.randomBytes(16).toString('base64') },
    // generate a random 10 byte ID to attach to a message
	generateMessageID: function () { return this.randomBytes(10).toString('hex').toUpperCase() }
}