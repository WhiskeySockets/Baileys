const Utils = require("./WhatsAppWeb.Utils")
const fs = require("fs")
const fetch = require("node-fetch")
/*
    Contains the code for recieving messages and forwarding what to do with them to the correct functions
*/
module.exports = {
    /**
     * Called when a message is recieved on the socket
     * @private
     * @param {string|buffer} message 
     * @param {function(any)} reject 
     */
    onMessageRecieved: function (message) {
        if (message[0] === "!") { // when the first character in the message is an '!', the server is updating the last seen
			const timestamp = message.slice(1,message.length)
			this.lastSeen = new Date( parseInt(timestamp) )
		} else {
            const commaIndex = message.indexOf(",") // all whatsapp messages have a tag and a comma, followed by the actual message
            
            if (commaIndex < 0) { // if there was no comma, then this message must be not be valid
                return this.gotError([2, "invalid message", message])
            }

            var data = message.slice(commaIndex+1, message.length)
            // get the message tag. 
            // If a query was done, the server will respond with the same message tag we sent the query with
            const messageTag = message.slice(0, commaIndex).toString ()
            if (data.length === 0) {
                // got an empty message, usually get one after sending a query with the 128 tag
                return
            }

            let json
            if (data[0] === "[" || data[0] === "{") { // if the first character is a "[", then the data must just be plain JSON array or object
                json = JSON.parse( data ) // parse the JSON
            } else if (this.authInfo.macKey && this.authInfo.encKey) { 
                /* 
                    If the data recieved was not a JSON, then it must be an encrypted message.
                    Such a message can only be decrypted if we're connected successfully to the servers & have encryption keys
                 */           
                const checksum = data.slice(0, 32) // the first 32 bytes of the buffer are the HMAC sign of the message
                data = data.slice(32, data.length) // the actual message

                const computedChecksum = Utils.hmacSign(data, this.authInfo.macKey) // compute the sign of the message we recieved using our macKey
                
                if (checksum.equals(computedChecksum)) { // the checksum the server sent, must match the one we computed for the message to be valid
                    const decrypted = Utils.aesDecrypt(data, this.authInfo.encKey) // decrypt using AES
                    json = this.decoder.read( decrypted ) // decode the binary message into a JSON array
                } else {
                    this.unexpectedDisconnect([7, "checksums don't match"])
                    return
                }
            } else {
                // if we recieved a message that was encrypted but we don't have the keys, then there must be an error
                this.unexpectedDisconnect([3, "recieved encrypted message when auth creds not available", message])
                return
            }
            /* 
             Check if this is a response to a message we sent
            */
            if (this.callbacks[messageTag]) {
                const q = this.callbacks[messageTag]
                //console.log (messageTag + ", " + q.queryJSON)
                q.callback([json, q.queryJSON])
                delete this.callbacks[messageTag]
                return
            }
            /* 
             Check if this is a response to a message we are expecting
            */
            if (this.callbacks["function:" + json[0]]) {
                let callbacks = this.callbacks["function:" + json[0]]
                var callbacks2
                var callback
                for (var key in json[1] || {}) {
                    callbacks2 = callbacks[key + ":" + json[1][key]]
                    if (callbacks2) { break }
                }
                if (!callbacks2) {
                    for (var key in json[1] || {}) {
                        callbacks2 = callbacks[key]
                        if (callbacks2) { break }
                    }
                }
                if (!callbacks2) {
                    callbacks2 = callbacks[""]
                }
                if (callbacks2) {
                    callback = callbacks2[ json[2] && json[2][0][0] ]
                    if (!callback) {
                        callback = callbacks2[""]
                    }        
                }
                if (callback) {
                    callback (json)
                    return
                }
            }
            if (this.logUnhandledMessages) {
                this.log("[Unhandled] " + messageTag + ", " + JSON.stringify(json))
            }
        }
    },
    /**
     * Type of notification
     * @param {object} message 
     * @param {object} [message.message] should be present for actual encrypted messages
     * @param {object} [message.messageStubType] should be present for group add, leave etc. notifications
     * @return {[string, string]} [type of notification, specific type of message]
     */
    getNotificationType: function (message) {
        const MessageStubTypes = {
            20: "addedToGroup",
            32: "leftGroup",
            39: "createdGroup"
        }
        if (message.message) {
            return ["message", Object.keys(message.message)[0]]
        } else if (message.messageStubType) {
            return [MessageStubTypes[message.messageStubType] , null]
        } else {
            return ["unknown", null]
        }
    },
    /**
     * Register for a callback for a certain function, will cancel automatically after one execution
     * @param {[string, object, string] | string} parameters name of the function along with some optional specific parameters 
     * @return {promise<object>} when the function is received
     */
    registerCallbackOneTime: function (parameters) {
        return new Promise ((resolve, reject) => this.registerCallback (parameters, resolve))
                .finally (json => {
                    this.deregisterCallback (parameters)
                    return json
                })
    },
    /**
     * Register for a callback for a certain function
     * @param {[string, string, string] | string} parameters name of the function along with some optional specific parameters 
     * @param {function(any)} callback
     */
    registerCallback: function (parameters, callback) {
        if (typeof parameters === "string") {
            return this.registerCallback ([parameters], callback)
        }
        if (!Array.isArray (parameters)) {
            throw "parameters (" + parameters + ") must be a string or array"
        }
        const func = "function:" + parameters[0]
        const key = parameters[1] || ""
        const key2 = parameters[2] || ""
        if (!this.callbacks[func]) {
            this.callbacks[func] = {}
        }
        if (!this.callbacks[func][key]) {
            this.callbacks[func][key] = {}
        }
        this.callbacks[func][key][key2] = callback
    },
    /**
     * Cancel all further callback events associated with the given parameters
     * @param {[string, object, string] | string} parameters name of the function along with some optional specific parameters 
     */
    deregisterCallback: function (parameters) {
        if (typeof parameters === "string") {
            return this.deregisterCallback ([parameters])
        }
        if (!Array.isArray (parameters)) {
            throw "parameters (" + parameters + ") must be a string or array"
        }
        const func = "function:" + parameters[0]
        const key = parameters[1] || ""
        const key2 = parameters[2] || ""
        if (this.callbacks[func] && this.callbacks[func][key] && this.callbacks[func][key][key2]) {
            delete this.callbacks[func][key][key2]
            return
        }
        this.log ("WARNING: could not find " + JSON.stringify (parameters) + " to deregister")
    },
    /**
     * Wait for a message with a certain tag to be received
     * @param {string} tag the message tag to await
     * @param {object} [json] query that was sent
     * @param {number} [timeoutMs] timeout after which the promise will reject
     */
    waitForMessage: function (tag, json, timeoutMs) {
		const promise = new Promise((resolve, reject) => 
				this.callbacks[tag] = {queryJSON: json, callback: resolve, errCallback: reject})
		if (timeoutMs) {
			return Utils.promiseTimeout (timeoutMs, promise)
				.catch (err => {
					delete this.callbacks[tag]
					throw err
				})
		} else {
			return promise
		}
    },
    /**
     * Decode a media message (video, image, document, audio) & save it to the given file
     * @param {object} message the media message you want to decode
     * @param {string} filename the name of the file where the media will be saved
     * @return {Promise<Object>} promise once the file is successfully saved, with the metadata
     */
    decodeMediaMessage: async function (message, filename) {
        const getExtension = (mimetype) => mimetype.split(";")[0].split("/")[1]
        
        /* 
            One can infer media type from the key in the message
            it is usually written as [mediaType]Message. Eg. imageMessage, audioMessage etc.
        */
        let type = Object.keys(message)[0]
        if (!type) {
            throw "unknown message type"
        }
        if (type === "extendedTextMessage" || type === "conversation") {
            throw "cannot decode text message"
        }
        if (type === "locationMessage" || type === "liveLocationMessage") {
            fs.writeFileSync (filename + ".jpeg", message[type].jpegThumbnail)
            return {filename: filename + ".jpeg"}
        }

        message = message[type]
        // get the keys to decrypt the message
        const mediaKeys = Utils.getMediaKeys(Buffer.from(message.mediaKey, 'base64'), type)
        const iv = mediaKeys.iv
        const cipherKey = mediaKeys.cipherKey
        const macKey = mediaKeys.macKey

        // download the message
        const fetched = await fetch(message.url)
        const buffer = await fetched.buffer()
        // first part is actual file
        let file = buffer.slice(0, buffer.length-10)
        // last 10 bytes is HMAC sign of file
        let mac = buffer.slice(buffer.length-10, buffer.length)
        
        // sign IV+file & check for match with mac
        let testBuff = Buffer.concat([iv, file])
        let sign = Utils.hmacSign(testBuff, macKey).slice(0, 10)
        // our sign should equal the mac
        if (sign.equals(mac)) {
            let decrypted = Utils.aesDecryptWithIV(file, cipherKey, iv) // decrypt media

            const trueFileName = filename + "." + getExtension(message.mimetype)
            fs.writeFileSync(trueFileName, decrypted)

            message.filename = trueFileName
            return message
        } else {
            throw "HMAC sign does not match"
        }
    }

}