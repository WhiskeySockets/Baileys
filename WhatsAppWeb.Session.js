const WebSocket = require('ws')
const Curve = require ('curve25519-js')
const HKDF = require('futoin-hkdf')
const Utils = require('./WhatsAppWeb.Utils')
const QR = require('qrcode-terminal')

/*
	Contains the code for connecting to WhatsApp Web, establishing a new session & logging back in
*/
module.exports = function (WhatsAppWeb) {
    const Status = WhatsAppWeb.Status
	
	// connect to the WhatsApp Web servers
    WhatsAppWeb.prototype.connect = function () {
		if (this.status != Status.notConnected) { 
            return this.gotError([1, "already connected or connecting"])
        }

		this.status = Status.connecting
		
		this.conn = new WebSocket("wss://web.whatsapp.com/ws", {origin: "https://web.whatsapp.com"})
		
		this.conn.on('open', () => this.onConnect())
		this.conn.on('message', (m) => this.onMessageRecieved(m)) // in WhatsAppWeb.Recv.js
		this.conn.on('error', (error) => { // if there was an error in the WebSocket
            this.close()
            this.gotError([20, error])			
		})
		this.conn.on('close', () => { })
	}
	// once a connection has been successfully established
    WhatsAppWeb.prototype.onConnect = function () {
        console.log("connected to WhatsApp Web")

        this.status = Status.creatingNewConnection
        if (!this.authInfo) { // if no auth info is present, that is, a new session has to be established
            this.authInfo = { clientID: Utils.generateClientID() } // generate a client ID
        }
        
        const data = ["admin", "init", WhatsAppWeb.version, WhatsAppWeb.browserDescriptions, this.authInfo.clientID, true]
		
		this.sendJSON( data )
	}
	// restore a previously closed session using the given authentication information
	WhatsAppWeb.prototype.login = function (authInfo) {
		this.authInfo = {
			clientID: authInfo.clientID,
			serverToken: authInfo.serverToken,
			clientToken: authInfo.clientToken,
			encKey: Buffer.from( authInfo.encKey, 'base64' ),
			macKey: Buffer.from( authInfo.macKey, 'base64' )
		}

        this.connect()
	}
	// once the QR code is scanned and we can validate our connection,
	// or we resolved the challenge when logging back in
    WhatsAppWeb.prototype.validateNewConnection = function (json) {
        if (json.connected) { // only if we're connected
            if (!json.secret) { // if we didn't get a secret, that is we don't need it
                return this.didConnectSuccessfully()
            }
			const secret = Buffer.from(json.secret, 'base64')

			if (secret.length !== 144) {
				return this.gotError([4, "incorrect secret length: " + secret.length])
			}
			// generate shared key from our private key & the secret shared by the server
			const sharedKey = Curve.sharedKey( this.curveKeys.private, secret.slice(0, 32) )
			// expand the key to 80 bytes using HKDF
			const expandedKey = HKDF(sharedKey, 80, [ Buffer.alloc(32), '', 'SHA-256' ])

			// perform HMAC validation.
			const hmacValidationKey = expandedKey.slice(32, 64)
			const hmacValidationMessage = Buffer.concat( [ secret.slice(0, 32), secret.slice(64, secret.length)  ] )

			const hmac = Utils.hmacSign(hmacValidationMessage, hmacValidationKey)
		
			if ( hmac.equals(secret.slice(32, 64)) ) { // computed HMAC should equal secret[32:64]
				// expandedKey[64:] + secret[64:] are the keys, encrypted using AES, that are used to encrypt/decrypt the messages recieved from WhatsApp
				// they are encrypted using key: expandedKey[0:32]
				const encryptedAESKeys = Buffer.concat([ expandedKey.slice(64, expandedKey.length), secret.slice(64, secret.length) ])
				const decryptedKeys = Utils.aesDecrypt(encryptedAESKeys, expandedKey.slice(0,32))
				
				// this data is required to restore closed sessions
				this.authInfo = {
					encKey: decryptedKeys.slice(0, 32), // first 32 bytes form the key to encrypt/decrypt messages
					macKey: decryptedKeys.slice(32, 64), // last 32 bytes from the key to sign messages
					clientToken: json.clientToken,
					serverToken: json.serverToken,
					clientID: this.authInfo.clientID
				}
				this.userMetaData = {
					id: json.wid, // one's WhatsApp ID [cc][number]@s.whatsapp.net
					name: json.pushname, // name set on whatsapp
					phone: json.phone  // information about the phone one has logged in to
				}
				this.status = Status.CONNECTED

                this.didConnectSuccessfully()
			} else { // if the checksums didn't match
                this.close()
                this.gotError([5, "HMAC validation failed"])
			}
		} else { // if we didn't get the connected field (usually we get this message when one opens WhatsApp on their phone)
            if (this.status !== Status.connected) { // and we're not already connected
                this.close()
                this.gotError([6, "json connection failed", json])
            }
		}
	}
	/*
		when logging back in (restoring a previously closed session), WhatsApp may challenge one to check if one still has the encryption keys
		WhatsApp does that by asking for us to sign a string it sends with our macKey
	*/
	WhatsAppWeb.prototype.respondToChallenge = function (challenge) {
		const bytes =  Buffer.from(challenge, 'base64') // decode the base64 encoded challenge string
		const signed = Utils.hmacSign(bytes, this.authInfo.macKey).toString('base64') // sign the challenge string with our macKey
		const data = ["admin", "challenge", signed, this.authInfo.serverToken, this.authInfo.clientID] // prepare to send this signed string with the serverToken & clientID

		console.log( "resolving challenge" )

		this.sendJSON( data )
	}
	/*
		when starting a new session, generate a QR code by generating a private/public key pair & the keys the server sends
	*/
	WhatsAppWeb.prototype.generateKeysForAuth = function (ref) {
		this.curveKeys = Curve.generateKeyPair( Utils.randomBytes(32) )

		const publicKeyStr = Buffer.from(this.curveKeys.public).toString('base64')
		//console.log ("private key: " + Buffer.from(this.curveKeys.private) )

		let str = ref + "," + publicKeyStr + "," + this.authInfo.clientID
		
		console.log("authenticating... Converting to QR: " + str)

		QR.generate(str, {small: true})
    }
    // send a keep alive request every 25 seconds, server updates & responds with last seen
    WhatsAppWeb.prototype.startKeepAliveRequest = function () {
		this.keepAliveReq = setInterval(() => {
			const diff = (new Date().getTime()-this.lastSeen.getTime())/1000
			/* 
				check if it's been a suspicious amount of time since the server responded with our last seen
				could be that the network is down, or the phone got disconnected or unpaired
			*/
			if (diff > 25+10) {
				console.log("disconnected")
				
				this.close()
				if (this.handlers.onDisconnect)
						this.handlers.onDisconnect()
				
				if (this.autoReconnect) { // attempt reconnecting if the user wants us to
					// keep trying to connect
					this.reconnectLoop = setInterval( () => {
						// only connect if we're not already in the prcoess of connectin
						if (this.status === Status.notConnected) {
							this.connect() 
						}
					}, 10 * 1000)
				}
			} else { // if its all good, send a keep alive request
				this.send( "?,," ) 
			}
        }, 25 * 1000)
	}
	// disconnect from the phone. Your auth credentials become invalid after sending a disconnect request.
	// use close() if you just want to close the connection
	WhatsAppWeb.prototype.disconnect = function () {
		if (this.status === Status.connected) {
			this.conn.send('goodbye,["admin","Conn","disconnect"]', null, () => {
                this.conn.close()
                if (this.handlers.onDisconnect)
                    this.handlers.onDisconnect()
			})
		} else if (this.conn) {
			this.close()
		}
	}
	// close the connection
	WhatsAppWeb.prototype.close = function () {
		this.conn.close()
		this.conn = null
        this.status = Status.notConnected
        this.msgCount = 0
        this.chats = {}

		if (this.keepAliveReq) {
			clearInterval(this.keepAliveReq)
		}
	}
	// request a new QR code from the server (HAVEN'T TESTED THIS OUT YET)
    WhatsAppWeb.prototype.requestNewQRCode = function () {
		if (this.status !== Status.creatingNewConnection) { // if we're not in the process of connecting
			return
		}
		const json = ["admin", "Conn", "reref"]
		this.sendJSON(json)
	}

}