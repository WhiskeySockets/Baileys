const BinaryCoding = require('./binary_coding/binary_encoder.js')

class WhatsAppWeb {

	static version = [0,4,1296] // the version of WhatsApp Web we're telling the servers we are
	static browserDescriptions = ["Baileys", "Baileys"]

	static Status = {
		notConnected: 0,
		connecting: 1,
		creatingNewConnection: 3,
		loggingIn: 4,
		connected: 5
	}
	
	// set of statuses visible to other people; see updatePresence() in WhatsAppWeb.Send
	static Presence = {
		available: "available", // "online"
		unavailable: "unavailable", // "offline"
		composing: "composing", // "typing..."
		recording: "recording", // "recording..."
		paused: "paused" // I have no clue
	}
	// set of statuses visible to other people; see updatePresence() in WhatsAppWeb.Send
	static MessageStatus = {
		sent: "sent",
		received: "received",
		read: "read"
	}
	// set of message types that are supported by the library
	static MessageType = {
		text: "conversation",
		image: "imageMessage",
		video: "videoMessage",
		sticker: "stickerMessage",
		document: "documentMessage",
		extendedText: "extendedTextMessage"
	}

	constructor() {
		this.conn = null // the websocket connection

		this.authInfo = null // the auth info used to extablish new connections & restore connections

		this.userMetaData = null // metadata of the user i.e. name, phone number, phone stats
		this.chats = {} // all chats of the user, mapped by the user ID
		this.msgCount = 0 // number of messages sent to the server; required field for sending messages etc.
		this.autoReconnect = true // reconnect automatically after an unexpected disconnect
		this.lastSeen = null // updated by sending a keep alive request to the server, and the server responds with our updated last seen

		// object to hold the event handlers
		this.handlers = {
			onError: null,
			onConnected: null,
			presenceUpdated: null,
			onDisconnect: null,
			onUnreadMessage: null,
			gotContact: null,
			onMessageStatusChanged: null
		}

		this.callbacks = {}

		this.encoder = new BinaryCoding.Encoder()
		this.decoder = new BinaryCoding.Decoder()

		this.status = WhatsAppWeb.Status.notConnected
	}
	// error is a json array: [errorCode, "error description", optionalDescription]
	gotError (error) {
		this.handlers.onError(error) // tell the handler, we got an error
	}
	// called when established a connection to the WhatsApp servers successfully
	didConnectSuccessfully () {
		console.log("connected successfully")

		this.status = WhatsAppWeb.Status.connected // update our status
		this.lastSeen = new Date() // set last seen to right now
		this.startKeepAliveRequest() // start sending keep alive requests (keeps the WebSocket alive & updates our last seen)

		if (this.reconnectLoop) { // if we connected after being disconnected
			clearInterval(this.reconnectLoop) // kill the loop to reconnect us
		} else if (this.handlers.onConnected) { // if we connected for the first time, i.e. not after being disconnected
			this.handlers.onConnected()
		}
	}
	// base 64 encode the authentication credentials and return them, these can then be saved used to login again
	// see login () in WhatsAppWeb.Session
	base64EncodedAuthInfo () {
		return {
			clientID: this.authInfo.clientID,
			serverToken: this.authInfo.serverToken,
			clientToken: this.authInfo.clientToken,
			encKey: this.authInfo.encKey.toString('base64'),
			macKey: this.authInfo.macKey.toString('base64')
		}
	}
}

/* import the rest of the code */
require("./WhatsAppWeb.Session.js")(WhatsAppWeb)
require("./WhatsAppWeb.Recv.js")(WhatsAppWeb)
require("./WhatsAppWeb.Send.js")(WhatsAppWeb)
require("./WhatsAppWeb.Query")(WhatsAppWeb)

module.exports = WhatsAppWeb