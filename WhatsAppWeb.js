const BinaryCoding = require('./binary_coding/binary_encoder.js')
const QR = require('qrcode-terminal')
const Utils = require('./WhatsAppWeb.Utils')

/**
 * @typedef WhatsAppMessage
 * @property {Object} key metadata about the sender
 * @property {string} key.remoteJid sender ID (could be group or individual)
 * @property {bool} key.fromMe
 * @property {string} key.id ID of the message
 * @property {string} [key.participant] if its a group, which individual sent it
 * @property {Object} [message] the actual message
 * @property {string} messageTimestamp unix timestamp
 * @property {number} [duration] the duration of the live location
 */

class WhatsAppWeb {
	/** 
	 * set of statuses visible to other people; see updatePresence() in WhatsAppWeb.Send
	 */
	static Presence = {
		available: "available", // "online"
		unavailable: "unavailable", // "offline"
		composing: "composing", // "typing..."
		recording: "recording", // "recording..."
		paused: "paused" // I have no clue
	}
	/** 
	 * Status of a message sent or received
	 */
	static MessageStatus = {
		sent: "sent",
		received: "received",
		read: "read"
	}
	/** 
	 * set of message types that are supported by the library
	 */
	static MessageType = {
		text: "conversation",
		image: "imageMessage",
		video: "videoMessage",
		sticker: "stickerMessage",
        document: "documentMessage",
        audio: "audioMessage",
        extendedText: "extendedTextMessage",
        contact: "contactMessage",
        location: "locationMessage",
        liveLocation: "liveLocationMessage"
    }
    /** 
	 * Tells us what kind of message it is
	 */
	static MessageStubTypes = {
        20: "addedToGroup",
        32: "leftGroup",
		39: "createdGroup"
	}

	constructor() {
        /** The version of WhatsApp Web we're telling the servers we are */
        this.version = [0,4,1296]
        this.browserDescriptions = ["Baileys", "Baileys"]
        /** The websocket connection 
         * @private
        */
		this.conn = null
		/** Data structure of tokens & IDs used to establish one's identiy to WhatsApp Web */
		this.authInfo = {
			clientID: null,
			serverToken: null,
			clientToken: null,
			encKey: null,
			macKey: null
        }
        /** Metadata like WhatsApp id, name set on WhatsApp etc. */
        this.userMetaData = {id: null, name: null, phone: null}
        /** @private */
        this.msgCount = 0 // (epoch) number of messages sent to the server; required field for sending messages etc.
        /** Shoud reconnect automatically after an unexpected disconnect */
        this.autoReconnect = true // 
        /** @private */
        this.lastSeen = null // updated by sending a keep alive request to the server, and the server responds with our updated last seen
        /** Log messages that are not handled, so you can debug & see what custom stuff you can implement */
        this.logUnhandledMessages = false
        /** @private */
        this.callbacks = {}
        
        /**
         * What to do when you need the phone to authenticate the connection (generate QR code by default)
         */
        this.onReadyForPhoneAuthentication = this.generateQRCode
	this.encoder = new BinaryCoding.Encoder()
        this.decoder = new BinaryCoding.Decoder()
        
        this.unexpectedDisconnect = (err) => { this.close () }
    }
    /**
     * Set the callback for unexpected disconnects
     * @param {function(object)} callback
     */
    setOnUnexpectedDisconnect (callback) {
        this.unexpectedDisconnect = (err) => {
            this.close ()
            callback (err)
        }
    }
    /**
     * Set the callback for message status updates (when a message is delivered, read etc.)
     * @param {function(object)} callback
     */
    setOnMessageStatusChange (callback) {
        const func = (json) => {
            json = json[1]
            var ids = json.id
            if (json.cmd === "ack") {
                ids = [json.id]
            }
            const ackTypes = [
                WhatsAppWeb.MessageStatus.sent,
                WhatsAppWeb.MessageStatus.received,
                WhatsAppWeb.MessageStatus.read
            ]
            const data = {
                from: json.from,
                to: json.to,
                participant: json.participant,
                timestamp: new Date (json.t*1000),
                ids: ids,
                type: ackTypes[json.ack-1] || "unknown (" + json.ack + ")"
            }
            callback (data)
        }
        this.registerCallback ("Msg", func)
        this.registerCallback ("MsgInfo", func)
    }
    /**
     * Set the callback for new/unread messages; if someone sends you a message, this callback will be fired
     * @param {function(WhatsAppMessage)} callback
     * @param {boolean} callbackOnMyMessages - should the callback be fired on a message you sent 
     */
    setOnUnreadMessage (callback, callbackOnMyMessages=false) {
        this.registerCallback (["action", "add:relay", "message"], (json) => {
            const message = json[2][0][2]
            if (!message.key.fromMe || callbackOnMyMessages) { // if this message was sent to us, notify
                callback (message)
            } else if (this.logUnhandledMessages) {
                this.log (`[Unhandled] message - ${JSON.stringify(message)}`)
            }
        })
    }
    /**
     * Set the callback for presence updates; if someone goes offline/online, this callback will be fired
     * @param {function(object)} callback
     */
    setOnPresenceUpdate (callback) {
        this.registerCallback ("Presence", (json) => callback(json[1]))
    }
    /**
     * base 64 encode the authentication credentials and return them
     * these can then be used to login again by passing the object to the connect () function.
     * @see connect () in WhatsAppWeb.Session
     */
	base64EncodedAuthInfo () {
		return {
			clientID: this.authInfo.clientID,
			serverToken: this.authInfo.serverToken,
			clientToken: this.authInfo.clientToken,
			encKey: this.authInfo.encKey.toString('base64'),
			macKey: this.authInfo.macKey.toString('base64')
        }        
    }
    /** Generate a QR code from the ref & the curve public key. This is scanned by the phone */
    generateQRCode ([ref, publicKey, clientID]) {
        const str = ref + "," + publicKey + "," + clientID
		QR.generate(str, {small: true})
    }

	log (text) { console.log (`[Baileys] ${text}`) }
}

/* Import the rest of the code */

const recv = require("./WhatsAppWeb.Recv")
/** Called when a message is recieved on the socket */
WhatsAppWeb.prototype.onMessageRecieved = recv.onMessageRecieved
/** The type of notification one recieved */
WhatsAppWeb.prototype.getNotificationType = recv.getNotificationType
/** Register for a callback for a certain function, will cancel automatically after one execution */
WhatsAppWeb.prototype.registerCallbackOneTime = recv.registerCallbackOneTime
/** Register for a callback for a certain function */
WhatsAppWeb.prototype.registerCallback = recv.registerCallback
/** Cancel all further callback events associated with the given parameters */
WhatsAppWeb.prototype.deregisterCallback = recv.deregisterCallback
/** Wait for a message with a certain tag to be received */
WhatsAppWeb.prototype.waitForMessage = recv.waitForMessage
/** Decode a media message (video, image, document, audio) & save it to the given file */
WhatsAppWeb.prototype.decodeMediaMessage = recv.decodeMediaMessage

const session = require("./WhatsAppWeb.Session")
WhatsAppWeb.prototype.connect = session.connect
WhatsAppWeb.prototype.connectSlim = session.connectSlim
WhatsAppWeb.prototype.receiveChatsAndContacts = session.receiveChatsAndContacts
WhatsAppWeb.prototype.beginAuthentication = session.beginAuthentication
WhatsAppWeb.prototype.validateNewConnection = session.validateNewConnection
WhatsAppWeb.prototype.respondToChallenge = session.respondToChallenge
WhatsAppWeb.prototype.generateKeysForAuth = session.generateKeysForAuth
WhatsAppWeb.prototype.startKeepAliveRequest = session.startKeepAliveRequest
WhatsAppWeb.prototype.logout = session.logout
WhatsAppWeb.prototype.close = session.close

const send = require("./WhatsAppWeb.Send")
/** Send a read receipt to the given ID for a certain message */
WhatsAppWeb.prototype.sendReadReceipt = send.sendReadReceipt
/** Tell someone about your presence -- online, typing, offline etc. 
 * @see WhatsAppWeb.Presence for all presence types
*/
WhatsAppWeb.prototype.updatePresence = send.updatePresence
/** Send a text message */
WhatsAppWeb.prototype.sendTextMessage = send.sendTextMessage
/** Send a contact message */
WhatsAppWeb.prototype.sendContactMessage = send.sendContactMessage
/** Send a location message */
WhatsAppWeb.prototype.sendLocationMessage = send.sendLocationMessage
/** Send a media message */
WhatsAppWeb.prototype.sendMediaMessage = send.sendMediaMessage
/** @private */
WhatsAppWeb.prototype.sendMessage = send.sendMessage
/** Generic function for group related queries */
WhatsAppWeb.prototype.groupQuery = send.groupQuery
/** Query something from the WhatsApp servers */
WhatsAppWeb.prototype.query = send.query
/** @private */
WhatsAppWeb.prototype.sendBinary = send.sendBinary
/** @private */
WhatsAppWeb.prototype.sendJSON = send.sendJSON
/** @private */
WhatsAppWeb.prototype.send = send.send

const query = require("./WhatsAppWeb.Query")
/** Query whether a given number is registered on WhatsApp */
WhatsAppWeb.prototype.isOnWhatsApp = query.isOnWhatsApp
/** Check the presence of a given person (online, offline) */
WhatsAppWeb.prototype.requestPresenceUpdate = query.requestPresenceUpdate
/** Query the status of the person (see groupMetadata() for groups) */
WhatsAppWeb.prototype.getStatus = query.getStatus
/** Get the URL to download the profile picture of a person/group */
WhatsAppWeb.prototype.getProfilePicture = query.getProfilePicture
/** Query all your contacts */
WhatsAppWeb.prototype.getContacts = query.getContacts
/** Query all the people/groups you have a chat history with */
WhatsAppWeb.prototype.getChats = query.getChats
/** Query whether your phone is still connected to this WhatsApp Web */
WhatsAppWeb.prototype.isPhoneConnected = query.isPhoneConnected
/** Load the conversation with a group or person */
WhatsAppWeb.prototype.loadConversation = query.loadConversation
/** Load the entire friggin conversation with a group or person */
WhatsAppWeb.prototype.loadEntireConversation = query.loadEntireConversation
/** Get the metadata of the group */
WhatsAppWeb.prototype.groupMetadata = query.groupMetadata
/** Create a group */
WhatsAppWeb.prototype.groupCreate = query.groupCreate
/** Leave a group */
WhatsAppWeb.prototype.groupLeave = query.groupLeave
/** Add somebody to the group */
WhatsAppWeb.prototype.groupAdd = query.groupAdd
/** Remove somebody from the group */
WhatsAppWeb.prototype.groupRemove = query.groupRemove
/** Make somebody admin on the group */
WhatsAppWeb.prototype.groupMakeAdmin = query.groupMakeAdmin
/** Get the invite code of the group */
WhatsAppWeb.prototype.groupInviteCode = query.groupInviteCode


module.exports = WhatsAppWeb
