import WAConnection from '../WAConnection/WAConnection'
import { MessageStatusUpdate, PresenceUpdate, Presence, WABroadcastListInfo, WAProfilePictureChange } from './Constants'
import {
    WAMessage,
    WANode,
    WAMetric,
    WAFlag,
    MessageLogLevel,
    WATag,
} from '../WAConnection/Constants'
import { generateProfilePicture } from '../WAClient/Utils'


export default class WhatsAppWebBase extends WAConnection {

    /** Set the callback for message status updates (when a message is delivered, read etc.) */
    setOnMessageStatusChange(callback: (update: MessageStatusUpdate) => void) {
        const func = json => {
            json = json[1]
            let ids = json.id
            if (json.cmd === 'ack') {
                ids = [json.id]
            }
            const data: MessageStatusUpdate = {
                from: json.from,
                to: json.to,
                participant: json.participant,
                timestamp: new Date(json.t * 1000),
                ids: ids,
                type: (+json.ack)+1,
            }
            callback(data)
        }
        this.registerCallback('Msg', func)
        this.registerCallback('MsgInfo', func)
    }
    /**
     * Set the callback for new/unread messages; if someone sends you a message, this callback will be fired
     * @param callbackOnMyMessages - should the callback be fired on a message you sent from the phone
     */
    setOnUnreadMessage(callbackOnMyMessages = false, callback: (m: WAMessage) => void) {
        this.registerCallback(['action', 'add:relay', 'message'], (json) => {
            const message = json[2][0][2]
            if (!message.key.fromMe || callbackOnMyMessages) {
                // if this message was sent to us, notify
                callback(message as WAMessage)
            } else {
                this.log(`[Unhandled] message - ${JSON.stringify(message)}`, MessageLogLevel.unhandled)
            }
        })
    }
    /** Set the callback for presence updates; if someone goes offline/online, this callback will be fired */
    setOnPresenceUpdate(callback: (p: PresenceUpdate) => void) {
        this.registerCallback('Presence', json => callback(json[1]))
    }
    /** Query whether a given number is registered on WhatsApp */
    isOnWhatsApp = (jid: string) => this.query(['query', 'exist', jid]).then((m) => m.status === 200)
    /**
     * Tell someone about your presence -- online, typing, offline etc.
     * @param jid the ID of the person/group who you are updating
     * @param type your presence
     */
    async updatePresence(jid: string | null, type: Presence) {
        const json = [
            'action',
            { epoch: this.msgCount.toString(), type: 'set' },
            [['presence', { type: type, to: jid }, null]],
        ]
        return this.queryExpecting200(json, [WAMetric.group, WAFlag.acknowledge]) as Promise<{ status: number }>
    }
    /** Request an update on the presence of a user */
    requestPresenceUpdate = async (jid: string) => this.queryExpecting200(['action', 'presence', 'subscribe', jid])
    /** Query the status of the person (see groupMetadata() for groups) */
    async getStatus (jid?: string) {
        return this.query(['query', 'Status', jid || this.userMetaData.id]) as Promise<{ status: string }>
    }
    async setStatus (status: string) {
        return this.setQuery ([
            [
                'status',
                null,
                Buffer.from (status, 'utf-8')
            ]
        ]) 
    }
    /** Get the URL to download the profile picture of a person/group */
    async getProfilePicture(jid: string | null) {
        const response = await this.queryExpecting200(['query', 'ProfilePicThumb', jid || this.userMetaData.id])
        return response.eurl as string
    }
    /** Get your contacts */
    async getContacts() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'contacts' }, null]
        const response = await this.query(json, [6, WAFlag.ignore]) // this has to be an encrypted query
        return response
    }
    /** Get the stories of your contacts */
    async getStories() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'status' }, null]
        const response = await this.queryExpecting200(json, [30, WAFlag.ignore]) as WANode
        if (Array.isArray(response[2])) {
            return response[2].map (row => (
                { 
                    unread: row[1]?.unread, 
                    count: row[1]?.count, 
                    messages: Array.isArray(row[2]) ? row[2].map (m => m[2]) : []
                } as {unread: number, count: number, messages: WAMessage[]}
            ))
        }
        return []
    }
    /** Fetch your chats */
    async getChats() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'chat' }, null]
        return this.query(json, [5, WAFlag.ignore]) // this has to be an encrypted query
    }
    /** Query broadcast list info */
    async getBroadcastListInfo(jid: string) { return this.queryExpecting200(['query', 'contact', jid]) as Promise<WABroadcastListInfo> }
    /** Delete the chat of a given ID */
    async deleteChat (jid: string) {
        return this.setQuery ([ ['chat', {type: 'delete', jid: jid}, null] ], [12, WAFlag.ignore]) as Promise<{status: number}>
    }
    /**
     * Check if your phone is connected
     * @param timeoutMs max time for the phone to respond
     */
    async isPhoneConnected(timeoutMs = 5000) {
        try {
            const response = await this.query(['admin', 'test'], null, timeoutMs)
            return response[1] as boolean
        } catch (error) {
            return false
        }
    }
    /**
     * Load the conversation with a group or person
     * @param count the number of messages to load
     * @param [indexMessage] the data for which message to offset the query by
     * @param [mostRecentFirst] retreive the most recent message first or retreive from the converation start
     */
    async loadConversation(
        jid: string,
        count: number,
        indexMessage: { id: string; fromMe: boolean } = null,
        mostRecentFirst = true,
    ) {
        const json = [
            'query',
            {
                epoch: this.msgCount.toString(),
                type: 'message',
                jid: jid,
                kind: mostRecentFirst ? 'before' : 'after',
                count: count.toString(),
                index: indexMessage?.id,
                owner: indexMessage?.fromMe === false ? 'false' : 'true',
            },
            null,
        ]
        const response = await this.query(json, [WAMetric.queryMessages, WAFlag.ignore])

        if (response.status) throw new Error(`error in query, got status: ${response.status}`)

        return response[2] ? (response[2] as WANode[]).map((item) => item[2] as WAMessage) : []
    }
    /**
     * Load the entire friggin conversation with a group or person
     * @param onMessage callback for every message retreived
     * @param [chunkSize] the number of messages to load in a single request
     * @param [mostRecentFirst] retreive the most recent message first or retreive from the converation start
     */
    loadEntireConversation(jid: string, onMessage: (m: WAMessage) => void, chunkSize = 25, mostRecentFirst = true) {
        let offsetID = null
        const loadMessage = async () => {
            const json = await this.loadConversation(jid, chunkSize, offsetID, mostRecentFirst)
            // callback with most recent message first (descending order of date)
            let lastMessage
            if (mostRecentFirst) {
                for (let i = json.length - 1; i >= 0; i--) {
                    onMessage(json[i])
                    lastMessage = json[i]
                }
            } else {
                for (let i = 0; i < json.length; i++) {
                    onMessage(json[i])
                    lastMessage = json[i]
                }
            }
            // if there are still more messages
            if (json.length >= chunkSize) {
                offsetID = lastMessage.key // get the last message
                return new Promise((resolve, reject) => {
                    // send query after 200 ms
                    setTimeout(() => loadMessage().then(resolve).catch(reject), 200)
                })
            }
        }
        return loadMessage() as Promise<void>
    }
    async updateProfilePicture (jid: string, img: Buffer) {
        const data = await generateProfilePicture (img)
        const tag = this.generateMessageTag ()
        const query: WANode = [
            'picture', 
            { jid: jid, id: tag, type: 'set' }, 
            [
                ['image', null, data.img],
                ['preview', null, data.preview]
            ]
        ]
        return this.setQuery ([query], [WAMetric.picture, 136], tag) as Promise<WAProfilePictureChange>
    }
    /** Generic function for action, set queries */
    async setQuery (nodes: WANode[], binaryTags: WATag = [WAMetric.group, WAFlag.ignore], tag?: string) {
        const json = ['action', {epoch: this.msgCount.toString(), type: 'set'}, nodes]
        const result = await this.queryExpecting200(json, binaryTags, null, tag) as Promise<{status: number}>
        return result
    }
}
