const Utils = require("./WhatsAppWeb.Utils")
const fetch = require('node-fetch')

/* 
	Contains the code for sending stuff to WhatsApp 
*/
module.exports = function(WhatsAppWeb) {

	// send a read receipt to the given ID on a certain message
    WhatsAppWeb.prototype.sendReadReceipt = function (jid, messageID) {
        const json = [ 
            "action", 
            { epoch: this.msgCount.toString(), type: "set" }, 
            [ ["read", {count: "1", index: messageID, jid: jid, owner: "false"}, null] ] 
        ]
        this.sendBinary(json, [10, 128]) // encrypt and send  off

        if (this.chats[ jid ]) {
            this.chats[jid].user.count = 0 // reset read count
        }
	}
	// check if given number is registered on WhatsApp
    WhatsAppWeb.prototype.isOnWhatsApp = function (jid) {
        const json = [
            "query", 
            "exist", 
            jid
        ]
		return this.query(json)
	}
	// tell someone about your presence -- online, typing, offline etc.
    WhatsAppWeb.prototype.updatePresence = function (jid, type) {
        const json = [ 
            "action", 
            { epoch: this.msgCount.toString(), type: "set" }, 
            [ ["presence", {type: type, to: jid}, null] ] 
        ]
        this.sendBinary(json, [10, 128])
	}
	// send a text message to someone, optionally you can provide a quoted message & the timestamp for the message
    WhatsAppWeb.prototype.sendTextMessage = function (id, txt, quoted=null, timestamp=null) {
		let message
		if (quoted) {
			message = {
				extendedTextMessage: {
					text: txt,
					contextInfo: {
						participant: quoted.key.remoteJid,
						stanzaId: quoted.key.id,
						quotedMessage: quoted.message
					}
				}
			}
		} else {
			message = {conversation: txt}
		}
		
		return this.sendMessage(id, message, timestamp)
	}
	// send a media message to someone, optionally you can provide a caption, thumbnail, mimetype & the timestamp for the message
	WhatsAppWeb.prototype.sendMediaMessage = function (id, buffer, mediaType, info=null, timestamp=null) {
		// path to upload the media 
		const mediaPathMap = {
			imageMessage: "/mms/image",
			videoMessage: "/mms/video",
			documentMessage: "/mms/document",
			audioMessage: "/mms/audio",
			stickerMessage: "/mms/image"
		}
		// gives WhatsApp info to process the media 
		const defaultMimetypeMap = {
			imageMessage: "image/jpeg",
			videoMessage: "video/mp4",
			documentMessage: "appliction/pdf",
			audioMessage: "audio/ogg; codecs=opus",
			stickerMessage: "image/webp"
		}
		if (!info) {
			info = {}
		}
		if (mediaType === WhatsAppWeb.MessageType.text || mediaType === WhatsAppWeb.MessageType.extendedText) {
			return Promise.reject("use sendTextMessage() to send text messages")
		}
		if (mediaType === WhatsAppWeb.MessageType.document && !info.mimetype) {
			return Promise.reject("mimetype required to send a document")
		}
		if (mediaType === WhatsAppWeb.MessageType.sticker && info.caption) {
			return Promise.reject("cannot send a caption with a sticker")
		}
		if (!info.mimetype) {
			info.mimetype = defaultMimetypeMap[mediaType]
		}

		// generate a media key
		const mediaKey = Utils.randomBytes(32)
		const mediaKeys = Utils.getMediaKeys(mediaKey, mediaType)
		const enc = Utils.aesEncrypWithIV(buffer, mediaKeys.cipherKey, mediaKeys.iv)
		const mac = Utils.hmacSign(Buffer.concat([mediaKeys.iv, enc]), mediaKeys.macKey).slice(0, 10)
		const body = Buffer.concat([enc, mac]) // body is enc + mac
		const fileSha256 = Utils.sha256(buffer)
		// url safe Base64 encode the SHA256 hash of the body
		const fileEncSha256B64 = Utils.sha256(body).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '')

		const promise = 
		Utils.generateThumbnail(buffer, mediaType, info)
		.then (() => this.query(["query", "mediaConn"])) // send a query JSON to obtain the url & auth token to upload our media
		.then ((json) => {
			const auth = json.auth // the auth token
			let hostname = "https://" + json.hosts[0].hostname // first hostname available
			hostname += mediaPathMap[mediaType] + "/" + fileEncSha256B64 // append path
			hostname += "?auth=" + auth // add auth token
			hostname += "&token=" + fileEncSha256B64 // file hash

			return fetch(hostname, {method: 'POST', body: body, headers: {Origin: "https://web.whatsapp.com"}})
		})
		.then (res => res.json())
		.then (json => {
			if (json.url) {
				return json.url
			} else {
				throw "UPLOAD FAILED GOT: " + JSON.stringify(json)
			}
		})
		.then (url => {
			let message = {}
			message[mediaType] = {
				caption: info.caption,
				url: url,
				mediaKey: mediaKey.toString('base64'),
				mimetype: info.mimetype,
				fileEncSha256: fileEncSha256B64,
				fileSha256: fileSha256.toString('base64'),
				fileLength: buffer.length,
				jpegThumbnail: info.thumbnail
			}
			if (mediaType === WhatsAppWeb.MessageType.video && info.gif) {
				message[mediaType].gifPlayback = info.gif
			}
			//console.log(message)
			return this.sendMessage(id, message, timestamp)
		})

		return promise
	}
	// generic send message construct
	WhatsAppWeb.prototype.sendMessage = function (id, message, timestamp=null) {
		if (!timestamp) { // if no timestamp was provided,
			timestamp = new Date() // set timestamp to now
		}
		timestamp = timestamp.getTime()/1000

		const messageJSON = {
			key: {
				remoteJid: id,
				fromMe: true,
				id: Utils.generateMessageID()
			},
			message: message,
			messageTimestamp: timestamp,
			status: "ERROR"
		}
		
		const json = [
			"action", 
			{epoch: this.msgCount.toString(), type: "relay" }, 
			[ ['message', null, messageJSON] ] 
		]
		this.sendBinary(json, [16, 128])
		return messageJSON
	}
	// send a binary message, the tags parameter tell WhatsApp what the message is all about
	WhatsAppWeb.prototype.sendBinary = function (json, tags) {
		const binary = this.encoder.write(json) // encode the JSON to the WhatsApp binary format

		var buff = Utils.aesEncrypt(binary, this.authInfo.encKey) // encrypt it using AES and our encKey
		const sign = Utils.hmacSign(buff, this.authInfo.macKey) // sign the message using HMAC and our macKey
		const tag = Utils.generateMessageTag()
		buff = Buffer.concat([ 
			Buffer.from(tag + ","), // generate & prefix the message tag
			Buffer.from(tags), // prefix some bytes that tell whatsapp what the message is about
			sign, // the HMAC sign of the message
			buff // the actual encrypted buffer
		])
		this.send(buff) // send it off
		return tag
	}
	// send query message to WhatsApp servers; returns a promise
    WhatsAppWeb.prototype.query = function (json) {
		const promise = new Promise((resolve, reject) => {
			const tag = this.sendJSON(json) // send
			this.queryCallbacks[tag] = {queryJSON: json, callback: resolve, errCallback: reject}
		})
		return promise
	}
	// send a JSON message to WhatsApp servers
    WhatsAppWeb.prototype.sendJSON = function (json) {
		const str =  JSON.stringify(json)
		const tag = Utils.generateMessageTag()
		this.send(tag + "," + str)
		return tag
	}
	WhatsAppWeb.prototype.send = function (m) {
		this.msgCount += 1 // increment message count, it makes the 'epoch' field when sending binary messages
		this.conn.send( m )
	}

}