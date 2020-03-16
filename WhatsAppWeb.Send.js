const Utils = require("./WhatsAppWeb.Utils")

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
	// tell someone about your presence -- online, typing, offline etc.
    WhatsAppWeb.prototype.updatePresence = function (jid, type) {
        const json = [ 
            "action", 
            { epoch: this.msgCount.toString(), type: "set" }, 
            [ ["presence", {type: type, to: jid}, null] ] 
        ]
        this.sendBinary(json, [10, 128])
	}
	// send a text message to someone, optionally you can provide the time at which you want the message to be sent
    WhatsAppWeb.prototype.sendTextMessage = function (id, txt, timestamp=null) {
		const message = {conversation: txt}
		return this.sendMessage(id, message, timestamp)
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
		return this.sendBinary(json, [16, 128])
	}
	// send a binary message, the tags parameter tell WhatsApp what the message is all about
	WhatsAppWeb.prototype.sendBinary = function (json, tags) {
		const binary = this.encoder.write(json) // encode the JSON to the WhatsApp binary format

		var buff = Utils.aesEncrypt(binary, this.authInfo.encKey) // encrypt it using AES and our encKey
		const sign = Utils.hmacSign(buff, this.authInfo.macKey) // sign the message using HMAC and our macKey

		buff = Buffer.concat([ 
			Buffer.from( Utils.generateMessageTag() + "," ), // generate & prefix the message tag
			Buffer.from(tags), // prefix some bytes that tell whatsapp what the message is about
			sign, // the HMAC sign of the message
			buff // the actual encrypted buffer
		])
		this.send(buff) // send it off
	}
	// send a JSON message to WhatsApp servers
    WhatsAppWeb.prototype.sendJSON = function (json) {
		const str =  JSON.stringify(json)
		this.send( Utils.generateMessageTag() + "," + str )
	}
	WhatsAppWeb.prototype.send = function (m) {
		this.msgCount += 1 // increment message count, it makes the 'epoch' field when sending binary messages
		this.conn.send( m )
	}

}