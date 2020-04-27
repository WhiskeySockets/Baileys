/* 
	Contains the code for sending queries to WhatsApp 
*/
module.exports = function(WhatsAppWeb) {
    // check if given number is registered on WhatsApp
    WhatsAppWeb.prototype.isOnWhatsApp = function (jid) {
		return this.query(["query", "exist", jid])
	}
	// check the presence status of a given jid
	WhatsAppWeb.prototype.requestPresenceUpdate = function (jid) {
		return this.query(["action","presence","subscribe",jid])
    }
    // check the presence status of a given jid
	WhatsAppWeb.prototype.getStatus = function (jid) {
		return this.query(["query","Status",jid])
    }
    // check the presence status of a given jid
	WhatsAppWeb.prototype.getProfilePicture = function (jid) {
        if (!jid) {
            jid = this.userMetaData.id
        }
		return this.query(["query","ProfilePicThumb",jid])
    }
    // query all the contacts
    WhatsAppWeb.prototype.getContactList = function () {
        const json = [
            "query",
            {epoch: this.msgCount.toString(), type: "contacts"},
            null
        ]
        return this.query(json, true) // this has to be an encrypted query
    }
    // load messages from a group or sender
    WhatsAppWeb.prototype.getMessages = function (jid, count, beforeMessage=null) {
        // construct JSON
        let json = [
            "query",
            { 
                epoch: this.msgCount.toString(), 
                type: "message", 
                jid: jid,
                kind: "before", 
                owner: "true",
                count: count.toString()
            },
            null
        ]
        // if we have some index before which we want to query
        if (beforeMessage) {
            json[1].index = beforeMessage.id
            json[1].owner = beforeMessage.fromMe ? "true" : "false"
        }
        return this.query(json, true)
    }
    // loads all the conversation you've had with given ID
    WhatsAppWeb.prototype.getAllMessages = function (jid, onMessage, chunkSize=25) {
        var offsetID = null

        const loadMessage = () => {
            return this.getMessages(jid, chunkSize, offsetID)
            .then (json => {
                if (json[2]) {
                    // callback with most recent message first (descending order of date)
                    for (var i = json[2].length-1; i >= 0;i--) {
                        onMessage(json[2][i][2])
                    }
                    // if there are still more messages
                    if (json[2].length >= chunkSize) {
                        offsetID = json[2][0][2].key // get the oldest message
                        return new Promise ( (resolve, reject) => {
                            // send query after 200 ms
                            setTimeout( () => loadMessage().then (resolve).catch(reject), 200)
                        } )
                    }  
                }
            })
        } 

        return loadMessage()
    }
}