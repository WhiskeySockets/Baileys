import WAConnection from '../WAConnection/WAConnection'
import { MessageStatus, MessageStatusUpdate, PresenceUpdate, Presence } from './Constants'
import {
    WAMessage,
    WANode,
    WAMetric,
    WAFlag,
    WAGroupCreateResponse,
    WAGroupMetadata,
    WAGroupModification,
    MessageLogLevel,
} from '../WAConnection/Constants'
import { generateMessageTag } from '../WAConnection/Utils'

export default class WhatsAppWebBase extends WAConnection {
    /** Set the callback for unexpected disconnects */
    setOnUnexpectedDisconnect(callback: (error: Error) => void) {
        this.unexpectedDisconnect = (err) => {
            this.close()
            callback(err)
        }
    }
    /** Set the callback for message status updates (when a message is delivered, read etc.) */
    setOnMessageStatusChange(callback: (update: MessageStatusUpdate) => void) {
        const func = (json) => {
            json = json[1]
            let ids = json.id
            if (json.cmd === 'ack') {
                ids = [json.id]
            }
            const ackTypes = [MessageStatus.sent, MessageStatus.received, MessageStatus.read]
            const data: MessageStatusUpdate = {
                from: json.from,
                to: json.to,
                participant: json.participant,
                timestamp: new Date(json.t * 1000),
                ids: ids,
                type: ackTypes[json.ack - 1] || 'unknown (' + json.ack + ')',
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
            } else if (this.logLevel >= MessageLogLevel.unhandled) {
                this.log(`[Unhandled] message - ${JSON.stringify(message)}`)
            }
        })
    }
    /** Set the callback for presence updates; if someone goes offline/online, this callback will be fired */
    setOnPresenceUpdate(callback: (p: PresenceUpdate) => void) {
        this.registerCallback('Presence', (json) => callback(json[1]))
    }
    /** Query whether a given number is registered on WhatsApp */
    isOnWhatsApp = (jid: string) => this.query(['query', 'exist', jid]).then((m) => m.status === 200)
    /**
     * Tell someone about your presence -- online, typing, offline etc.
     * @param jid the ID of the person/group who you are updating
     * @param type your presence
     */
    async updatePresence(jid: string, type: Presence) {
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
    /** Get the URL to download the profile picture of a person/group */
    async getProfilePicture(jid: string | null) {
        const response = await this.queryExpecting200(['query', 'ProfilePicThumb', jid || this.userMetaData.id])
        return response.eurl as string
    }
    /** Get your contacts */
    async getContacts() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'contacts' }, null]
        const response = await this.query(json, [WAMetric.group, WAFlag.ignore]) // this has to be an encrypted query
        console.log(response)
        return response
    }
    /** Fetch your chats */
    getChats() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'chat' }, null]
        return this.query(json, [WAMetric.group, WAFlag.ignore]) // this has to be an encrypted query
    }
    /**
     * Archive a given chat
     * @param jid the ID of the person/group you are archiving
     */
    async archiveChat(jid: string) {
        const json = [
            'action',
            { epoch: this.msgCount.toString(), type: 'set' },
            [['chat', { type: 'archive', jid: jid }, null]],
        ]
        return this.queryExpecting200(json, [WAMetric.group, WAFlag.acknowledge]) as Promise<{ status: number }>
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
        const response = await this.query(json, [WAMetric.group, WAFlag.ignore])

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
    /** Generic function for group queries */
    groupQuery(type: string, jid?: string, subject?: string, participants?: string[]) {
        const json: WANode = [
            'group',
            {
                author: this.userMetaData.id,
                id: generateMessageTag(),
                type: type,
                jid: jid,
                subject: subject,
            },
            participants ? participants.map((str) => ['participant', { jid: str }, null]) : [],
        ]
        const q = ['action', { type: 'set', epoch: this.msgCount.toString() }, [json]]
        return this.queryExpecting200(q, [WAMetric.group, WAFlag.ignore])
    }
    /** Get the metadata of the group */
    groupMetadata = (jid: string) => this.queryExpecting200(['query', 'GroupMetadata', jid]) as Promise<WAGroupMetadata>
    /**
     * Create a group
     * @param title like, the title of the group
     * @param participants people to include in the group
     */
    groupCreate = (title: string, participants: string[]) =>
        this.groupQuery('create', null, title, participants) as Promise<WAGroupCreateResponse>
    /**
     * Leave a group
     * @param jid the ID of the group
     */
    groupLeave = (jid: string) => this.groupQuery('leave', jid) as Promise<{ status: number }>
    /**
     * Update the subject of the group
     * @param {string} jid the ID of the group
     * @param {string} title the new title of the group
     */
    groupUpdateSubject = (jid: string, title: string) =>
        this.groupQuery('subject', jid, title) as Promise<{ status: number }>
    /**
     * Add somebody to the group
     * @param jid the ID of the group
     * @param participants the people to add
     */
    groupAdd = (jid: string, participants: string[]) =>
        this.groupQuery('add', jid, null, participants) as Promise<WAGroupModification>
    /**
     * Remove somebody from the group
     * @param jid the ID of the group
     * @param participants the people to remove
     */
    groupRemove = (jid: string, participants: string[]) =>
        this.groupQuery('remove', jid, null, participants) as Promise<WAGroupModification>
    /**
     * Make someone admin on the group
     * @param jid the ID of the group
     * @param participants the people to make admin
     */
    groupMakeAdmin = (jid: string, participants: string[]) =>
        this.groupQuery('promote', jid, null, participants) as Promise<WAGroupModification>
    /** Get the invite link of the given group */
    async groupInviteCode(jid: string) {
        const json = ['query', 'inviteCode', jid]
        const response = await this.queryExpecting200(json)
        return response.code as string
    }
}
