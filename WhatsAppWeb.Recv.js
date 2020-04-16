const Utils = require("./WhatsAppWeb.Utils")
const HKDF = require("futoin-hkdf")
const fs = require("fs")
const fetch = require("node-fetch")
/*
    Contains the code for recieving messages and forwarding what to do with them to the correct functions
*/
module.exports = function(WhatsAppWeb) {

    const Status = WhatsAppWeb.Status

    WhatsAppWeb.prototype.onMessageRecieved = function (message) {

        if (message[0] === "!") { // when the first character in the message is an '!', the server is updating on the last seen
			const timestamp = message.slice(1,message.length)
			this.lastSeen = new Date( parseInt(timestamp) )
		} else {
            const commaIndex = message.indexOf(",") // all whatsapp messages have a tag and a comma, followed by the actual message
            
            if (commaIndex < 0) { // if there was no comma, then this message must be not be valid
                return this.gotError([2, "invalid message", message])
            }

            var data = message.slice(commaIndex+1, message.length)
            if (data.length === 0) {
                // got an empty message, usually get one after sending a message or something, just return then
                return
            }
            // get the message tag. 
            // If a query was done, the server will respond with the same message tag we sent the query with
            const messageTag = message.slice(0, commaIndex) 
            //console.log(messageTag)

            let json
            if (data[0] === "[" || data[0] === "{") { // if the first character is a "[", then the data must just be plain JSON array or object
                json = JSON.parse( data ) // parse the JSON
                //console.log("JSON: " + data)
            } else if (this.status === Status.connected) { 
                /* 
                    If the data recieved was not a JSON, then it must be an encrypted message.
                    Such a message can only be decrypted if we're connected successfully to the servers & have encryption keys
                 */

                data = Buffer.from(data, 'binary') // convert the string to a buffer                
                const checksum = data.slice(0, 32) // the first 32 bytes of the buffer are the HMAC sign of the message
                data = data.slice(32, data.length) // the actual message

                const computedChecksum = Utils.hmacSign(data, this.authInfo.macKey) // compute the sign of the message we recieved using our macKey
                
                if (checksum.equals(computedChecksum)) { // the checksum the server sent, must match the one we computed for the message to be valid
                    const decrypted = Utils.aesDecrypt(data, this.authInfo.encKey) // decrypt using AES
                    json = this.decoder.read( decrypted ) // decode the binary message into a JSON array
                } else {
                    return this.gotError([7, "checksums don't match"])
                }
                //console.log("enc_json: " + JSON.stringify(json))
            } else {
                // if we recieved a message that was encrypted but we weren't conencted, then there must be an error
                return this.gotError([3, "recieved encrypted message when not connected: " + this.status, message])
            }
            
            // the first item in the recieved JSON, if it exists, it tells us what the message is about
            switch (json[0]) {
                case "Conn":
                    /*
                        we get this message when a new connection is established, 
                        whether we're starting a new session or are logging back in.
                        Sometimes, we also recieve it when one opens their phone
                     */
                    this.validateNewConnection(json[1])
                    return
                case "Cmd":
                    /* 
                        WhatsApp usually sends this when we're trying to restore a closed session,
                        WhatsApp will challenge us to see whether we still have the keys
                    */
                    if (json[1].type === "challenge") { // if it really is a challenge
                        this.respondToChallenge(json[1].challenge)
                    }
                    return
                case "action":
                    /*
                        this is when some action was taken on a chat or that we recieve a message.
                        json[1] tells us more about the message, it can be null
                    */
                   if (!json[1]) {  // if json[1] is null
                        json = json[2][0] // set json to the first element in json[2]; it contains the relevant part
                    
                        if (json[0] === "read") { // if one marked a chat as read or unread on the phone 
                            const id = json[1].jid.replace("@c.us", "@s.whatsapp.net") // format the sender's ID
                            if (this.chats[id] && json[1].type === 'false') { // if it was marked unread
                                this.chats[id].user.count = 1 // up the read count
                                this.clearUnreadMessages(id) // send notification to the handler about the unread message
                            } else { // if it was marked read
                                this.chats[id].user.count = 0 // set the read count to zero
                            }
                        }
        
                    } else if (json[1].add === "relay") { // if we just recieved a new message sent to us
                        this.onNewMessage( json[2][0][2] ) // handle this new message
                    } else if (json[1].add === "before" || json[1].add === "last") { 
                        /* 
                            if we're recieving a full chat log
                            if json[1].add equals before: if its non-recent messages
                            if json[1].add equals last: contains the last message of the conversation between the sender and us
                        */

                        json = json[2] // json[2] is the relevant part    
                        /* reverse for loop, because messages are sent ordered by most recent
                           I can order them by recency if I add them in reverse order */          
                        for (var k = json.length-1;k >= 0;k--) { 
                            const message = json[k]
                            const id = message[2].key.remoteJid
                            if (!this.chats[ id ]) { // if we haven't added this ID before, add them now
                                this.chats[ id ] = {user: { jid: id, count: 0 }, messages: []}
                            }
                            this.chats[id].messages.push(message[2]) // append this message to the array
                            
                        }
                        

                        const id = json[0][2].key.remoteJid // get the ID whose chats we just processed
                        this.clearUnreadMessages(id) // forward to the handler any any unread messages
                    }
                    return
                case "response":
                    // if it is the list of all the people the WhatsApp account has chats with
                    if (json[1].type === "chat") {
                        json[2].forEach (chat => {
                            if (chat[0] === "chat" && chat[1].jid) {
                                const jid = chat[1].jid.replace("@c.us", "@s.whatsapp.net") // format ID
                                this.chats[ jid ] = {
                                    user: {
                                        jid: jid, // the ID of the person
                                        count: chat[1].count}, // number of unread messages we have from them
                                    messages: [ ] // empty messages, is filled by content in the previous section
                                }
                            }
                        })
                        
                    }
                    return
                default:
                    break
            }

            /* 
             if the recieved JSON wasn't an array, then we must have recieved a status for a request we made
            */
            if (this.status === Status.connected) {
                // if this message is responding to a query
                if (this.queryCallbacks[messageTag]) {
                    const q = this.queryCallbacks[messageTag]
                    if (q.queryJSON[1] === "exist") {
                        q.callback(json.status == 200, q.queryJSON[2])
                    } else if (q.queryJSON[1] === "mediaConn") {
                        q.callback(json.media_conn)
                    }
                    delete this.queryCallbacks[messageTag]
                }
            } else {
                // if we're trying to establish a new connection or are trying to log in
                switch (json.status) {
                    case 200: // all good and we can procede to generate a QR code for new connection, or can now login given present auth info
                        
                        if (this.status === Status.creatingNewConnection){ // if we're trying to start a connection
                            if (this.authInfo.encKey && this.authInfo.macKey) { // if we have the info to restore a closed session
                                this.status = Status.loggingIn
                                // create the login request
                                const data = ["admin", "login", this.authInfo.clientToken, this.authInfo.serverToken, this.authInfo.clientID, "takeover"]
                                this.sendJSON( data )
                            } else {
                                this.generateKeysForAuth(json.ref)
                            }
                        }
                        
                        break
                    case 401: // if the phone was unpaired
                        this.close()						
                        return this.gotError([json.status, "unpaired from phone", message])
                    case 429: // request to login was denied, don't know why it happens
                        this.close()
                        return this.gotError([ json.status, "request denied, try reconnecting", message ])
                    case 304: // request to generate a new key for a QR code was denied
                        console.log("reuse previous ref")
                        return this.gotError([ json.status, "request for new key denied", message ])
                    default:
                        return this.gotError([ json.status, "unknown error", message ])
                }
            }
        }
    }
    // shoot off notifications to the handler that new unread message are available
    WhatsAppWeb.prototype.clearUnreadMessages = function (id) {
		const chat = this.chats[id] // get the chat
        var j = 0
        let unreadMessages = chat.user.count
        while (unreadMessages > 0) {
            if (!chat.messages[j].key.fromMe) { // only forward if the message is from the sender
                this.handlers.onUnreadMessage( chat.messages[j] ) // send off the unread message
                unreadMessages -= 1 // reduce
            }
            j += 1
        }
    }
    // when a new message is recieved
	WhatsAppWeb.prototype.onNewMessage = function (message) {

		if (message && message.message) { // confirm that the message really is valid
			if (!this.chats[message.key.remoteJid]) { // if we don't have any chats from this ID before, add them to our DB
				this.chats[message.key.remoteJid] = { 
					user: { jid: message.key.remoteJid, count: 0 },
					messages: [ message ]
				}
			} else { 
                // if the chat was already there, then insert the message at the front of the array
				this.chats[ message.key.remoteJid ].messages.splice(0, 0, message)
			}

			if (!message.key.fromMe) { // if this message was sent to us, notify the handler
				this.handlers.onUnreadMessage ( message )
			}
		}
    }
    
    // get what type of message it is
    WhatsAppWeb.prototype.getMessageType = function (message) {
        return Object.keys(message)[0]
        /*for (var key in WhatsAppWeb.MessageType) {
            if (WhatsAppWeb.MessageType[key] === relvantKey) {
                return key
            }
        }*/
    }
    
    // decode a media message (video, image, document, audio) & save it to the given file; returns a promise with metadata
    WhatsAppWeb.prototype.decodeMediaMessage = function (message, fileName) {
        
        const getExtension = function (mimetype) {
            const str = mimetype.split(";")[0].split("/")
            return str[1]
        }
        /* 
            can infer media type from the key in the message
            it is usually written as [mediaType]Message. Eg. imageMessage, audioMessage etc.
        */
        let type = this.getMessageType(message)
        if (!type) {
            return Promise.reject("unknown message type")
        }
        if (type === WhatsAppWeb.MessageType.extendedText || type === WhatsAppWeb.MessageType.text) {
            return Promise.reject("cannot decode text message")
        }

        message = message[type]
        // get the keys to decrypt the message
        const mediaKeys = Utils.getMediaKeys(Buffer.from(message.mediaKey, 'base64'), type)
        const iv = mediaKeys.iv
        const cipherKey = mediaKeys.cipherKey
        const macKey = mediaKeys.macKey

        // download the message
        let p = fetch(message.url).then (res => res.buffer())
        p = p.then(buffer => {
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

                const trueFileName = fileName + "." + getExtension(message.mimetype)
                fs.writeFileSync(trueFileName, decrypted)

                message.fileName = trueFileName
                return message
            } else {
                throw "HMAC sign does not match"
            }
        })
        return p
    }

}