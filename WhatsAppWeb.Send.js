const Utils = require("./WhatsAppWeb.Utils")
const fetch = require('node-fetch')
/* 
	Contains the code for sending stuff to WhatsApp 
*/
/**
 * @typedef {Object} MessageOptions
 * @property {Object} [quoted] the message you may wanna quote along with this message
 * @property {Date} [timestamp] optionally set the timestamp of the message in Unix time MS 
 * @property {string} [caption] (for media messages) caption to go along with the media
 * @property {string} [thumbnail] (for media & location messages) base64 encoded thumbnail
 * @property {string} [mimetype] (for media messages) specify the Mimetype of the media, required for document messages
 * @property {boolean} [gif] (for video messages) whether the media is a gif or not
 */
module.exports = {
	/**
	 * Send a read receipt to the given ID for a certain message
	 * @param {string} jid the ID of the person/group whose message you read
	 * @param {string} messageID the message ID
	 * @return {Promise<[object, object]>}
	 */
    sendReadReceipt: function (jid, messageID) {
        const json = [ 
            "action", 
            { epoch: this.msgCount.toString(), type: "set" }, 
            [ ["read", {count: "1", index: messageID, jid: jid, owner: "false"}, null] ] 
        ]
        return this.query(json, [10, 128]) // encrypt and send  off
	},
	/**
	 * Tell someone about your presence -- online, typing, offline etc.
	 * @param {string} jid the ID of the person/group who you are updating
	 * @param {string} type your presence
	 * @return {Promise<[object, object]>}
	 */
    updatePresence: function (jid, type) {
        const json = [ 
            "action", 
            { epoch: this.msgCount.toString(), type: "set" }, 
            [ ["presence", {type: type, to: jid}, null] ] 
        ]
        return this.query(json, [10, 64])
	},
	/**
	 * Send a text message
	 * @param {string} id the JID of the person/group you're sending the message to
	 * @param {string} txt the actual text of the message
	 * @param {MessageOptions} [options] some additional options
	 * @return {Promise<[object, object]>}
	 */
    sendTextMessage: function (id, txt, options={}) {
		if (typeof txt !== "string") {
			return Promise.reject("expected text to be a string")
		}
		let message
		if (options.quoted) {
			message = {extendedTextMessage: { text: txt }}
		} else {
			message = {conversation: txt}
		}
		return this.sendMessage(id, message, options)
	},
	/**
	 * Send a contact message
	 * @param {string} id the JID of the person/group you're sending the message to
	 * @param {string} displayName the name of the person on the contact, will be displayed on WhatsApp
	 * @param {string} vcard the VCARD formatted contact
	 * @param {MessageOptions} [options] some additional options
	 * @return {Promise<[object, object]>}
	 */
    sendContactMessage: function (id, displayName, vcard, options={}) {
		if (typeof displayName !== "string") {
			return Promise.reject("expected text to be a string")
		}
		return this.sendMessage(id, {contactMessage: {displayName: displayName, vcard: vcard}}, options)
	},
	/**
	 * Send a location message
	 * @param {string} id the JID of the person/group you're sending the message to
	 * @param {number} lat the latitude of the location
	 * @param {number} long the longitude of the location
	 * @param {MessageOptions} [options] some additional options
	 * @return {Promise<[object, object]>}
	 */
    sendLocationMessage: function (id, lat, long, options={}) {
		return this.sendMessage(id, {locationMessage: {degreesLatitude: lat, degreesLongitude: long}}, options)
	},
	/**
	 * Send a media message
	 * @param {string} id the JID of the person/group you're sending the message to
	 * @param {Buffer} buffer the buffer of the actual media you're sending
	 * @param {string} mediaType the type of media, can be one of [imageMessage, documentMessage, stickerMessage, videoMessage]
	 * @param {MessageOptions} [options] additional information about the message
	 * @return {Promise<[object, object]>}
	 */
	sendMediaMessage: function (id, buffer, mediaType, options={}) {
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
		if (!options) {
			options = {}
		}
		if (mediaType === "conversation" || mediaType === "extendedTextMessage") {
			return Promise.reject("use sendTextMessage() to send text messages")
		}
		if (mediaType === "documentMessage" && !options.mimetype) {
			return Promise.reject("mimetype required to send a document")
		}
		if (mediaType === "stickerMessage" && options.caption) {
			return Promise.reject("cannot send a caption with a sticker")
		}
		if (!options.mimetype) {
			options.mimetype = defaultMimetypeMap[mediaType]
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

		return Utils.generateThumbnail(buffer, mediaType, options)
		.then (() => this.query(["query", "mediaConn"])) // send a query JSON to obtain the url & auth token to upload our media
		.then (([json,_]) => {
			json = json.media_conn
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
				url: url,
				mediaKey: mediaKey.toString('base64'),
				mimetype: options.mimetype,
				fileEncSha256: fileEncSha256B64,
				fileSha256: fileSha256.toString('base64'),
				fileLength: buffer.length
			}
			if (mediaType === "videoMessage" && options.gif) {
				message[mediaType].gifPlayback = options.gif
			}
			return this.sendMessage(id, message, options)
		})
	},
	/**
	 * Generic send message function
	 * @private
	 * @param {string} id who to send the message to
	 * @param {object} message like, the message
	 * @param {MessageOptions} [options] some additional options
	 * @return {Promise<[object, object]>} array of the recieved JSON & the query JSON
	 */
	sendMessage: function (id, message, options) {
		if (!options.timestamp) { // if no timestamp was provided,
			options.timestamp = new Date() // set timestamp to now
		}
		const key = Object.keys(message)[0]
		const timestamp = options.timestamp.getTime()/1000
		const quoted = options.quoted
		if (quoted) {
			const participant = quoted.key.participant || quoted.key.remoteJid
			message[key].contextInfo = {
				participant: participant,
				stanzaId: quoted.key.id,
				quotedMessage: quoted.message
			} 
			// if a participant is quoted, then it must be a group
			// hence, remoteJid of group must also be entered
			if (quoted.key.participant) {
				message[key].contextInfo.remoteJid = quoted.key.remoteJid
			}
		}
		if (options.caption) {
			message[key].caption = options.caption
		}
		if (options.thumbnail) {
			if (typeof options.thumbnail !== "string") {
				return Promise.reject("expected JPEG to be a base64 encoded string")
			}
			message[key].jpegThumbnail = options.thumbnail 
		}

		let messageJSON = {
			key: {
				remoteJid: id,
				fromMe: true,
				id: Utils.generateMessageID()
			},
			message: message,
			messageTimestamp: timestamp,
			status: "ERROR"
		}
		
		if (id.includes ("@g.us")) {
			messageJSON.participant = this.userMetaData.id
		}
		const json = [
			"action", 
			{epoch: this.msgCount.toString(), type: "relay"}, 
			[ ["message", null, messageJSON] ]
		]
		return this.query(json, [16, 128], null, messageJSON.key.id)
	},
	/**
	 * Generic function for group queries
	 * @param {string} type the type of query
	 * @param {string} [jid] the id of the group
	 * @param {string} [subject] title to attach to the group
	 * @param {string[]} [participants] the people the query will affect
	 * @return {Promise<[object, object]>} array of the recieved JSON & the query JSON
	 */
	groupQuery: function (type, jid, subject, participants) {
		let json = [
			"group", 
			{
				author: this.userMetaData.id, 
				id: Utils.generateMessageTag(), 
				type: type
			},
			null
		]
		if (participants) {
			json[2] = participants.map (str => ["participant", {jid: str}, null])
		}
		if (jid) {
			json[1].jid = jid
		}
		if (subject) {
			json[1].subject = subject
		}
		json = [
			"action",
			{type: "set", epoch: this.msgCount.toString()},
			[json]
		]
		return this.query (json, [10, 128])
	},
	/**
	 * Query something from the WhatsApp servers
	 * @param {any[]} json the query itself
	 * @param {[number, number]} [binaryTags] the tags to attach if the query is supposed to be sent encoded in binary
	 * @param {Number} [timeoutMs] timeout after which the query will be failed (set to null to disable a timeout)
	 * @param {string} [tag] the tag to attach to the message
	 * @return {Promise<[object, object]>} array of the recieved JSON & the query JSON
	 */
    query: function (json, binaryTags, timeoutMs, tag) {
		if (binaryTags) {
			tag = this.sendBinary(json, binaryTags, tag)
		} else {
			tag = this.sendJSON(json, tag)
		}
		return this.waitForMessage (tag, json, timeoutMs)
	},
	/**
	 * Send a binary encoded message
	 * @private
	 * @param {[string, object, [string, object, object][]]} json the message to encode & send
	 * @param {[number, number]} tags the binary tags to tell WhatsApp what the message is all about
	 * @param {string} [tag] the tag to attach to the message
	 * @return {string} the message tag
	 */
	sendBinary: function (json, tags, tag) {
		const binary = this.encoder.write(json) // encode the JSON to the WhatsApp binary format
		
		var buff = Utils.aesEncrypt(binary, this.authInfo.encKey) // encrypt it using AES and our encKey
		const sign = Utils.hmacSign(buff, this.authInfo.macKey) // sign the message using HMAC and our macKey
		tag = tag || Utils.generateMessageTag()
		buff = Buffer.concat([ 
			Buffer.from(tag + ","), // generate & prefix the message tag
			Buffer.from(tags), // prefix some bytes that tell whatsapp what the message is about
			sign, // the HMAC sign of the message
			buff // the actual encrypted buffer
		])
		this.send(buff) // send it off
		return tag
	},
	/**
	 * Send a plain JSON message to the WhatsApp servers
	 * @private
	 * @param {[any]} json the message to send
	 * @param {string} [tag] the tag to attach to the message
	 * @return {string} the message tag
	 */
    sendJSON: function (json, tag) {
		const str = JSON.stringify(json)
		tag = tag || Utils.generateMessageTag()
		this.send(tag + "," + str)
		return tag
	},
	/**
	 * Send some message to the WhatsApp servers
	 * @private
	 * @param {any} json the message to send
	 */
	send: function (m) {
		this.msgCount += 1 // increment message count, it makes the 'epoch' field when sending binary messages
		this.conn.send( m )
	}
}