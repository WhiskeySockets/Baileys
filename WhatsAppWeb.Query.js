/* 
	Contains the code for sending queries to WhatsApp 
*/
module.exports = {
    /** 
     * Query whether a given number is registered on WhatsApp 
     * @param {string} jid the number you want to query, format as [number]@s.whatsapp.net
     * @return {Promise<[boolean, string]>} Promise with an array [exists, jid]
     */
    isOnWhatsApp: function (jid) {
		return this.query(["query", "exist", jid]).then (([m, _]) => [m.status === 200, jid])
    },
    /**
     * @param {string} jid the whatsapp ID of the person
     * @return {Promise<[object, object]>}
     */
	requestPresenceUpdate: function (jid) {
		return this.query(["action","presence","subscribe",jid])
    },
    /**
     * Query the status of the person (see groupMetadata() for groups)
     * @param {string} [jid] the whatsapp ID of the person
     * @return {Promise<[object, object]>}
     */
	getStatus: function (jid) {
        jid = jid || this.userMetaData.id
		return this.query(["query","Status",jid])
    },
    /**
     * Get the URL to download the profile picture of a person/group
     * @param {string} [jid] the whatsapp ID of the person/group (will get your own picture if not specified)
     * @return {Promise<[object, object]>}
     */
	getProfilePicture: function (jid) {
        jid = jid || this.userMetaData.id
		return this.query(["query","ProfilePicThumb",jid])
    },
    /**
     * @return {Promise<[object, object]>}
     */
    getContacts: function () {
        const json = ["query", {epoch: this.msgCount.toString(), type: "contacts"}, null]
        return this.query(json, [10, 128]) // this has to be an encrypted query
    },
    /**
     * @return {Promise<[object, object]>}
     */
    getChats: function () {
        const json = ["query", {epoch: this.msgCount.toString(), type: "chat"}, null]
        return this.query(json, [10, 128]) // this has to be an encrypted query
    },
    /**
     * Check if your phone is connected
     * @param {number} timeoutMs max time for the phone to respond
     * @return {Promise<[object, object]>}
     */
    isPhoneConnected: function (timeoutMs=5000) {
        return this.query (["admin", "test"], null, timeoutMs)
            .then (([json, q]) => json[1])
            .catch (err => false)
    },
    /**
     * Load the conversation with a group or person
     * @param {string} jid the id of the group or person
     * @param {number} count the number of messages to load
     * @param {object} [indexMessage] the data for which message to offset the query by
     * @param {string} [indexMessage.id] the id of the message
     * @param {object} [indexMessage.fromMe] whether the message was sent by yours truly
     * @param {boolean} [mostRecentFirst] retreive the most recent message first or retreive from the converation start
     * @return {Promise} Promise of the messages loaded
     */
    loadConversation: function (jid, count, indexMessage=null, mostRecentFirst=true) {
        // construct JSON
        let json = [
            "query",
            {
                epoch: this.msgCount.toString(), 
                type: "message", 
                jid: jid,
                kind: mostRecentFirst ? "before" : "after", 
                owner: "true",
                count: count.toString()
            },
            null
        ]
        // if we have some index from which we want to query
        if (indexMessage) {
            json[1].index = indexMessage.id
            json[1].owner = indexMessage.fromMe ? "true" : "false"
        }
        return this.query(json, [10, 128])
    },
    /**
     * Load the entire friggin conversation with a group or person
     * @param {string} jid the id of the group or person
     * @param {function} onMessage callback for every message retreived
     * @param {number} [chunkSize] the number of messages to load in a single request
     * @param {boolean} [mostRecentFirst] retreive the most recent message first or retreive from the converation start
     */
    loadEntireConversation: function (jid, onMessage, chunkSize=25, mostRecentFirst=true) {
        var offsetID = null

        const loadMessage = () => {
            return this.loadConversation(jid, chunkSize, offsetID, mostRecentFirst)
            .then (([json]) => {
                if (json[2]) {
                    // callback with most recent message first (descending order of date)
                    let lastMessage
                    if (mostRecentFirst) {
                        for (var i = json[2].length-1; i >= 0;i--) {
                            onMessage(json[2][i][2])
                            lastMessage = json[2][i][2]
                        }
                    } else {
                        for (var i = 0; i < json[2].length;i++) {
                            onMessage(json[2][i][2])
                            lastMessage = json[2][i][2]
                        }
                    }
                    // if there are still more messages
                    if (json[2].length >= chunkSize) {
                        offsetID = lastMessage.key // get the last message
                        return new Promise ((resolve, reject) => {
                            // send query after 200 ms
                            setTimeout( () => loadMessage().then (resolve).catch(reject), 200)
                        })
                    }  
                }
            })
        } 

        return loadMessage()
    },
    /**
     * Get the metadata of the group
     * @param {string} jid the ID of the group
     * @return {Promise<[object, object]>}
     */
    groupMetadata: function (jid) {
		return this.query (["query", "GroupMetadata", jid])
    },
    /**
     * Create a group
     * @param {string} title like, the title of the group
     * @param {string[]} participants people to include in the group
     * @return {Promise<[object, object]>}
     */
    groupCreate: function (title, participants) {
		return this.groupQuery ("create", null, title, participants)
    },
    /**
     * Leave a group
     * @param {string} jid the ID of the group
     * @return {Promise<[object, object]>}
     */
    groupLeave: function (jid) {
		return this.groupQuery ("leave", jid)
    },
    /**
     * Update the title of the group
     * @param {string} jid the ID of the group
     * @param {string} title the new title of the group
     * @return {Promise<[object, object]>}
     */
    groupUpdateTitle: function (jid, title) {
		return this.groupQuery ("subject", jid, title)
    },
    /**
     * Add somebody to the group
     * @param {string} jid the ID of the group
     * @param {string[]} participants the people to add
     * @return {Promise<[object, object]>}
     */
    groupAdd: function (jid, participants) {
		return this.groupQuery ("add", jid, null, participants)
    },
    /**
     * Remove somebody from the group
     * @param {string} jid the ID of the group
     * @param {string[]} participants the people to remove
     * @return {Promise<[object, object]>}
     */
    groupRemove: function (jid, participants) {
		return this.groupQuery ("remove", jid, null, participants)
    },
    /**
     * Make someone admin on the group
     * @param {string} jid the ID of the group
     * @param {string[]} participants the people to make admin
     * @return {Promise<[object, object]>}
     */
    groupMakeAdmin: function (jid, participants) {
		return this.groupQuery ("promote", jid, null, participants)
    },
    /**
     * Get the invite link of the group
     * @param {string} jid the ID of the group
     * @return {Promise<string>}
     */
    groupInviteCode: function (jid) {
        const json = ["query", "inviteCode", jid]
		return this.query (json).then (([json, _]) => json.code)
	}
}
