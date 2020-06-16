const WebSocket = require('ws')
const Curve = require ('curve25519-js')
const Utils = require('./WhatsAppWeb.Utils')
/*
	Contains the code for connecting to WhatsApp Web, establishing a new session & logging back in
*/
module.exports = {
	/**
	 * Connect to WhatsAppWeb
	 * @param {Object} [authInfo] credentials to log back in
	 * @param {number} [timeoutMs] timeout after which the connect will fail, set to null for an infinite timeout
	 * @return {[object, object[], object[], object[]]} returns [userMetaData, chats, contacts, unreadMessages]
	 */
    connect: async function (authInfo, timeoutMs) {
		const userInfo = await this.connectSlim (authInfo, timeoutMs)
		const chats = await this.receiveChatsAndContacts (authInfo, timeoutMs)
		return [userInfo, ...chats]
	},
	/**
	 * Connect to WhatsAppWeb, resolves without waiting for chats & contacts
	 * @param {Object} [authInfo] credentials to log back in
	 * @param {number} [timeoutMs] timeout after which the connect will fail, set to null for an infinite timeout
	 * @return {Promise<Object>} returns [userMetaData, chats, contacts, unreadMessages]
	 */
    connectSlim: function (authInfo, timeoutMs) {
		// set authentication credentials if required
		if (authInfo) {
			this.authInfo = Object.assign ({}, authInfo) // copy credentials
			this.authInfo.encKey = Buffer.from(authInfo.encKey, 'base64') // decode from base64
			this.authInfo.macKey = Buffer.from(authInfo.macKey, 'base64')
		}
		// if we're already connected, throw an error
		if (this.conn) { 
            return Promise.reject([1, "already connected or connecting"])
        }
		this.conn = new WebSocket("wss://web.whatsapp.com/ws", {origin: "https://web.whatsapp.com"})

		let promise = new Promise ( (resolve, reject) => {
			this.conn.on('open', () => {
				this.conn.on('message', m => this.onMessageRecieved(m)) // in WhatsAppWeb.Recv.js	
				this.beginAuthentication ().then (resolve).catch (reject)
			})
			this.conn.on('error', error => { // if there was an error in the WebSocket
				this.close()
				reject (error)	
			})
		})
		promise = timeoutMs ? Utils.promiseTimeout (timeoutMs, promise) : promise
		return promise.catch (err => {this.close (); throw err;})
	},
	/** 
	 * Once a connection has been successfully established
	 * @private
	 * @return {promise<object[]>}
	 */
    beginAuthentication: function () {
        this.log("connected to WhatsApp Web")

        if (!this.authInfo.clientID) { // if no auth info is present, that is, a new session has to be established
            this.authInfo = { clientID: Utils.generateClientID() } // generate a client ID
		}
		    
        const data = ["admin", "init", this.version, this.browserDescriptions, this.authInfo.clientID, true]
		return this.query(data)
		.then (([json, _]) => {
			// we're trying to establish a new connection or are trying to log in
			switch (json.status) {
				case 200: // all good and we can procede to generate a QR code for new connection, or can now login given present auth info
					if (this.authInfo.encKey && this.authInfo.macKey) { // if we have the info to restore a closed session
						const data = ["admin", "login", this.authInfo.clientToken, this.authInfo.serverToken, this.authInfo.clientID, "takeover"]
						return this.query(data, null, null, "s1") // wait for response with tag "s1"
					} else {
						return this.generateKeysForAuth(json.ref)
					}
				default:
					throw [json.status, "unknown error", json]
			}
		})
		.then (([json, q]) => {
			switch (json.status) {
				case 401: // if the phone was unpaired				
					throw [json.status, "unpaired from phone", json]
				case 429: // request to login was denied, don't know why it happens
					throw [json.status, "request denied, try reconnecting", json]
				case 304: // request to generate a new key for a QR code was denied
					throw [json.status, "request for new key denied", json]
				default:
					break
			}
			if (json[1] && json[1].challenge) { // if its a challenge request (we get it when logging in)
				return this.respondToChallenge(json[1].challenge)
				.then (([json, _]) => { 
					if (json.status !== 200) { // throw an error if the challenge failed
						throw [json.status, "unknown error", json] 
					}
					return this.waitForMessage ("s2", []) // otherwise wait for the validation message
				})
			} else { // otherwise just chain the promise further
				return [json, q]
			}
		})
		.then (([json, _]) => {
			this.validateNewConnection (json[1]) 
			this.log("validated connection successfully")
			this.lastSeen = new Date() // set last seen to right now
			this.startKeepAliveRequest() // start sending keep alive requests (keeps the WebSocket alive & updates our last seen)
		}) // validate the connection
		.then (() => {
			this.log("connected successfully")
			return this.userMetaData
		})
	},
	/**
	 * Sets up callbacks to receive chats, contacts & unread messages. 
	 * Must be called immediately after connect
	 * @returns {[ object[], object[], object[] ]} - [chats, contacts, unreadMessages]
	 */
	receiveChatsAndContacts: function () {
		let chats = []
		let contacts = []
		let unreadMessages = []
		let unreadMap = {}

		let encounteredAddBefore = false
		var convoResolve

		this.log ("waiting for chats & contacts") // wait for the message with chats
		const waitForConvos = () => new Promise ((resolve, _) => {
			convoResolve = resolve
			const chatUpdate = (json) => {
				const isLast = json[1].last
				encounteredAddBefore = json[1].add === "before" ? true : encounteredAddBefore
				
				json = json[2]
				if (json) {
					for (var k = json.length-1;k >= 0;k--) { 
						const message = json[k][2]
						const jid = message.key.remoteJid.replace ("@s.whatsapp.net", "@c.us")
						if (!message.key.fromMe && unreadMap[jid] > 0) { // only forward if the message is from the sender
							unreadMessages.push (message)
							unreadMap[jid] -= 1 // reduce
						}
					}
				}
				if (isLast) {
					// de-register the callbacks, so that they don't get called again
					this.deregisterCallback (["action", "add:last"])
					this.deregisterCallback (["action", "add:before"])
					this.deregisterCallback (["action", "add:unread"])
					resolve ()
				}
			}
			// wait for actual messages to load, "last" is the most recent message, "before" contains prior messages
			this.registerCallback (["action", "add:last"], chatUpdate)
			this.registerCallback (["action", "add:before"], chatUpdate)
			this.registerCallback (["action", "add:unread"], chatUpdate)
		})
		const waitForChats = this.registerCallbackOneTime (["response",  "type:chat"])
							.then (json => {
								chats = json[2] // chats data (log json to see what it looks like)
								chats.forEach (chat => unreadMap [chat[1].jid] = chat[1].count) // store the number of unread messages for each sender
								if (chats && chats.length > 0) return waitForConvos ()
							})
		const waitForContacts = this.registerCallbackOneTime (["response", "type:contacts"])
								.then (json => {
									contacts = json[2]
									// if no add:before messages are sent, and you receive contacts
									// should probably resolve the promise
									if (!encounteredAddBefore && convoResolve) convoResolve ()
								})
		// wait for the chats & contacts to load
		return Promise.all ([waitForChats, waitForContacts]).then (() => [chats, contacts, unreadMessages])
	},
	/**
	 * Once the QR code is scanned and we can validate our connection, or we resolved the challenge when logging back in
	 * @private
	 * @param {object} json 
	 */
    validateNewConnection: function (json) {
		const onValidationSuccess = () => {
			// set metadata: one's WhatsApp ID [cc][number]@s.whatsapp.net, name on WhatsApp, info about the phone
			this.userMetaData = {id: json.wid.replace("@c.us", "@s.whatsapp.net"), name: json.pushname, phone: json.phone}
			return this.userMetaData
		}

        if (json.connected) { // only if we're connected
            if (!json.secret) { // if we didn't get a secret, we don't need it, we're validated
                return onValidationSuccess()
            }
			const secret = Buffer.from(json.secret, 'base64')
			if (secret.length !== 144) {
				throw [4, "incorrect secret length: " + secret.length]
			}
			// generate shared key from our private key & the secret shared by the server
			const sharedKey = Curve.sharedKey( this.curveKeys.private, secret.slice(0, 32) )
			// expand the key to 80 bytes using HKDF
			const expandedKey = Utils.hkdf(sharedKey, 80)

			// perform HMAC validation.
			const hmacValidationKey = expandedKey.slice(32, 64)
			const hmacValidationMessage = Buffer.concat( [ secret.slice(0, 32), secret.slice(64, secret.length)  ] )

			const hmac = Utils.hmacSign(hmacValidationMessage, hmacValidationKey)
		
			if (hmac.equals(secret.slice(32, 64))) { // computed HMAC should equal secret[32:64]
				// expandedKey[64:] + secret[64:] are the keys, encrypted using AES, that are used to encrypt/decrypt the messages recieved from WhatsApp
				// they are encrypted using key: expandedKey[0:32]
				const encryptedAESKeys = Buffer.concat([ expandedKey.slice(64, expandedKey.length), secret.slice(64, secret.length) ])
				const decryptedKeys = Utils.aesDecrypt(encryptedAESKeys, expandedKey.slice(0,32))
				// set the credentials
				this.authInfo = {
					encKey: decryptedKeys.slice(0, 32), // first 32 bytes form the key to encrypt/decrypt messages
					macKey: decryptedKeys.slice(32, 64), // last 32 bytes from the key to sign messages
					clientToken: json.clientToken,
					serverToken: json.serverToken,
					clientID: this.authInfo.clientID
				}
				return onValidationSuccess()
			} else { // if the checksums didn't match
                throw [5, "HMAC validation failed"]
			}
		} else { // if we didn't get the connected field (usually we get this message when one opens WhatsApp on their phone)
			throw [6, "json connection failed", json]
		}
	},
	/** 
	 * When logging back in (restoring a previously closed session), WhatsApp may challenge one to check if one still has the encryption keys
	 * WhatsApp does that by asking for us to sign a string it sends with our macKey
	 * @private
	*/
	respondToChallenge: function (challenge) {
		const bytes =  Buffer.from(challenge, 'base64') // decode the base64 encoded challenge string
		const signed = Utils.hmacSign(bytes, this.authInfo.macKey).toString('base64') // sign the challenge string with our macKey
		const data = ["admin", "challenge", signed, this.authInfo.serverToken, this.authInfo.clientID] // prepare to send this signed string with the serverToken & clientID
		this.log("resolving login challenge")
		return this.query(data)
	},
	/** 
	 * When starting a new session, generate a QR code by generating a private/public key pair & the keys the server sends
	 * @private
	*/
	generateKeysForAuth: function (ref) {
		this.curveKeys = Curve.generateKeyPair(Utils.randomBytes(32))
		const phoneAuthInfo = [ref, Buffer.from(this.curveKeys.public).toString('base64'), this.authInfo.clientID]
		this.onReadyForPhoneAuthentication (phoneAuthInfo)
		return this.waitForMessage ("s1", [])
    },
    /** 
	 * Send a keep alive request every X seconds, server updates & responds with last seen 
	 * @private
	*/
    startKeepAliveRequest: function () {
		const refreshInterval = 20
		this.keepAliveReq = setInterval(() => {
			const diff = (new Date().getTime()-this.lastSeen.getTime())/1000
			/* 
				check if it's been a suspicious amount of time since the server responded with our last seen
				it could be that the network is down, or the phone got unpaired from our connection
			*/
			if (diff > refreshInterval+5) {
				this.close()

				if (this.autoReconnect) { // attempt reconnecting if the user wants us to
					this.log("disconnected unexpectedly, reconnecting...")
					const reconnectLoop = () => this.connect (null, 25*1000).catch (reconnectLoop)
					reconnectLoop () // keep trying to connect
				} else {
					this.unexpectedDisconnect ("lost connection unexpectedly")
				}
			} else { // if its all good, send a keep alive request
				this.send("?,,") 
			}
        }, refreshInterval * 1000)
	},
	/**
	 * Disconnect from the phone. Your auth credentials become invalid after sending a disconnect request.
	 * Use close() if you just want to close the connection
	 * @return {Promise<void>}
	 */
	logout: function () {
		return new Promise ( (resolve, reject) => {
			if (this.conn) {
				this.conn.send('goodbye,["admin","Conn","disconnect"]', null, () => {
					this.authInfo = {}
					resolve ()
				})
			} else {
				throw "You're not even connected, you can't log out"
			}
		})
		.then (() => this.close ())
	},
	/** Close the connection to WhatsApp Web */
	close: function () {
        this.msgCount = 0
		if (this.conn) {
			this.conn.close()
			this.conn = null
		}
		const keys = Object.keys (this.callbacks)
		keys.forEach (key => {
			if (!key.includes ("function:")) {
				this.callbacks[key].reject ("connection closed")
				delete this.callbacks[key]
			}
		} )
		if (this.keepAliveReq) {
			clearInterval(this.keepAliveReq)
		}
	}
}