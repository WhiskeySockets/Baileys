import {WAConnection as Base} from './6.MessagesSend'
import { MessageType, WAMessageKey, MessageInfo, WAMessageContent, WAMetric, WAFlag, WANode, WAMessage, WAMessageProto } from './Constants'
import { whatsappID, delay, toNumber, unixTimestampSeconds } from './Utils'
import { Mutex } from './Mutex'

export class WAConnection extends Base {

    @Mutex ()
    async loadAllUnreadMessages () {
        const tasks = this.chats.all()
                    .filter(chat => chat.count > 0)
                    .map (chat => this.loadMessages(chat.jid, chat.count))
        const list = await Promise.all (tasks)
        const combined: WAMessage[] = []
        list.forEach (({messages}) => combined.push(...messages))
        return combined
    }
    /** Get the message info, who has read it, who its been delivered to */
    @Mutex ((jid, messageID) => jid+messageID)
    async messageInfo (jid: string, messageID: string) {
        const query = ['query', {type: 'message_info', index: messageID, jid: jid, epoch: this.msgCount.toString()}, null]
        const response = (await this.query ({json: query, binaryTags: [22, WAFlag.ignore], expect200: true}))[2]

        const info: MessageInfo = {reads: [], deliveries: []}
        if (response) {
            //console.log (response)
            const reads = response.filter (node => node[0] === 'read')
            if (reads[0]) {
                info.reads = reads[0][2].map (item => item[1])
            }
            const deliveries = response.filter (node => node[0] === 'delivery')
            if (deliveries[0]) {
                info.deliveries = deliveries[0][2].map (item => item[1])
            }
        }
        return info
    }
    /**
     * Marks a chat as read/unread; updates the chat object too
     * @param jid the ID of the person/group whose message you want to mark read
     * @param unread unreads the chat, if true
     */
    @Mutex (jid => jid)
    async chatRead (jid: string, type: 'unread' | 'read' = 'read') {
        jid = whatsappID (jid)
        const chat = this.assertChatGet (jid)

        if (type === 'unread') await this.sendReadReceipt (jid, null, -2)
        else if (chat.count !== 0) {
            const {messages} = await this.loadMessages (jid, 1)
            await this.sendReadReceipt (jid, messages[0].key, Math.abs(chat.count))
        }
        chat.count = type === 'unread' ? -1 : 0
        this.emit ('chat-update', {jid, count: chat.count})
    }
    /**
     * Sends a read receipt for a given message;
     * does not update the chat do @see chatRead
     * @param jid the ID of the person/group whose message you want to mark read
     * @param messageKey the key of the message
     * @param count number of messages to read, set to < 0 to unread a message
     */
    async sendReadReceipt(jid: string, messageKey: { id?: string, fromMe?: boolean }, count: number) {
        const attributes = {
            jid: jid,
            count: count.toString(),
            index: messageKey?.id,
            owner: messageKey?.fromMe?.toString()
        }
        const read = await this.setQuery ([['read', attributes, null]])
        return read
    }
    /**
     * Load the conversation with a group or person
     * @param count the number of messages to load
     * @param before the data for which message to offset the query by
     * @param mostRecentFirst retreive the most recent message first or retreive from the converation start
     */
    @Mutex ((jid, _, before, mostRecentFirst) => jid + (before?.id || '') + mostRecentFirst)
    async loadMessages (
        jid: string,
        count: number,
        before?: { id?: string; fromMe?: boolean },
        mostRecentFirst: boolean = true
    ) {
        jid = whatsappID(jid)

        const retreive = async (count: number, indexMessage: any) => {
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
            const response = await this.query({json, binaryTags: [WAMetric.queryMessages, WAFlag.ignore], expect200: false})
            return (response[2] as WANode[])?.map(item => item[2] as WAMessage) || []
        }
        const chat = this.chats.get (jid)
        let messages: WAMessage[]
        if (!before && chat && mostRecentFirst) {
            messages = chat.messages
            const diff = count - messages.length
            if (diff < 0) {
                messages = messages.slice(-count); // get the last X messages
            } else if (diff > 0) {
                const extra = await retreive (diff, messages[0]?.key)
                messages.unshift (...extra)
            }
        } else messages = await retreive (count, before)

        let cursor
        if (messages[0]) cursor = { id: messages[0].key.id, fromMe: messages[0].key.fromMe }
        return {messages, cursor}
    }
    /**
     * Load the entire friggin conversation with a group or person
     * @param onMessage callback for every message retreived
     * @param chunkSize the number of messages to load in a single request
     * @param mostRecentFirst retreive the most recent message first or retreive from the converation start
     */
    loadAllMessages(jid: string, onMessage: (m: WAMessage) => void, chunkSize = 25, mostRecentFirst = true) {
        let offsetID = null
        const loadMessage = async () => {
            const {messages} = await this.loadMessages(jid, chunkSize, offsetID, mostRecentFirst)
            // callback with most recent message first (descending order of date)
            let lastMessage
            if (mostRecentFirst) {
                for (let i = messages.length - 1; i >= 0; i--) {
                    onMessage(messages[i])
                    lastMessage = messages[i]
                }
            } else {
                for (let i = 0; i < messages.length; i++) {
                    onMessage(messages[i])
                    lastMessage = messages[i]
                }
            }
            // if there are still more messages
            if (messages.length >= chunkSize) {
                offsetID = lastMessage.key // get the last message
                return new Promise((resolve, reject) => {
                    // send query after 200 ms
                    setTimeout(() => loadMessage().then(resolve).catch(reject), 200)
                })
            }
        }
        return loadMessage() as Promise<void>
    }
    /**
     * Find a message in a given conversation
     * @param chunkSize the number of messages to load in a single request
     * @param onMessage callback for every message retreived, if return true -- the loop will break
     */
    async findMessage (jid: string, chunkSize: number, onMessage: (m: WAMessage) => boolean) {
        const chat = this.chats.get (whatsappID(jid))
        let count = chat?.messages?.length || chunkSize
        let offsetID
        while (true) {
            const {messages, cursor} = await this.loadMessages(jid, count, offsetID, true)
            // callback with most recent message first (descending order of date)
            for (let i = messages.length - 1; i >= 0; i--) {
                if (onMessage(messages[i])) return
            }
            if (messages.length === 0) return
            // if there are more messages
            offsetID = cursor
            await delay (200)
        }
    }
    /**
     * Loads all messages sent after a specific date
     */
    async messagesReceivedAfter (date: Date, onlyUnrespondedMessages = false) {
        const stamp = unixTimestampSeconds (date)
        // find the index where the chat timestamp becomes greater
        const idx = this.chats.all ().findIndex (c => c.t < stamp)
        // all chats before that index -- i.e. all chats that were updated after that
        const chats = this.chats.all ().slice (0, idx)

        const messages: WAMessage[] = []
        await Promise.all (
            chats.map (async chat => {
                await this.findMessage (chat.jid, 5, m => {
                    if (toNumber(m.messageTimestamp) < stamp || (onlyUnrespondedMessages && m.key.fromMe)) return true
                    messages.push (m)
                })
            })
        )
        return messages
    }
    /** Load a single message specified by the ID */
    async loadMessage (jid: string, messageID: string) {
        // load the message before the given message
        let messages = (await this.loadMessages (jid, 1, {id: messageID, fromMe: true})).messages
        if (!messages[0]) messages = (await this.loadMessages (jid, 1, {id: messageID, fromMe: false})).messages
        // the message after the loaded message is the message required
        const actual = await this.loadMessages (jid, 1, messages[0] && messages[0].key, false)
        return actual.messages[0]
    }
    /**
     * Search WhatsApp messages with a given text string
     * @param txt the search string
     * @param inJid the ID of the chat to search in, set to null to search all chats
     * @param count number of results to return
     * @param page page number of results (starts from 1)
     */
    async searchMessages(txt: string, inJid: string | null, count: number, page: number) {
        const json = [
            'query',
            {
                epoch: this.msgCount.toString(),
                type: 'search',
                search: txt,
                count: count.toString(),
                page: page.toString(),
                jid: inJid
            },
            null,
        ]
        const response: WANode = await this.query({json, binaryTags: [WAMetric.group, WAFlag.ignore], expect200: true}) // encrypt and send  off
        const messages = response[2] ? response[2].map (row => row[2]) : []
        return { last: response[1]['last'] === 'true', messages: messages as WAMessage[] }
    }
    /**
     * Delete a message in a chat for yourself
     * @param messageKey key of the message you want to delete
     */
    @Mutex (m => m.remoteJid)
    async clearMessage (messageKey: WAMessageKey) {
        const tag = Math.round(Math.random ()*1000000)
        const attrs: WANode = [
            'chat',
            { jid: messageKey.remoteJid, modify_tag: tag.toString(), type: 'clear' },
            [
                ['item', {owner: `${messageKey.fromMe}`, index: messageKey.id}, null]
            ]
        ]
        const result = await this.setQuery ([attrs])

        const chat = this.chats.get (whatsappID(messageKey.remoteJid))
        if (chat) {
            chat.messages = chat.messages.filter (m => m.key.id !== messageKey.id)
        }

        return result
    }
    /**
     * Delete a message in a chat for everyone
     * @param id the person or group where you're trying to delete the message
     * @param messageKey key of the message you want to delete
     */
    async deleteMessage (id: string, messageKey: WAMessageKey) {
        const json: WAMessageContent = {
            protocolMessage: {
                key: messageKey,
                type: WAMessageProto.ProtocolMessage.PROTOCOL_MESSAGE_TYPE.REVOKE
            }
        }
        const waMessage = this.prepareMessageFromContent (id, json, {})
        await this.relayWAMessage (waMessage)
        return waMessage
    }
    /**
     * Forward a message like WA does
     * @param id the id to forward the message to
     * @param message the message to forward
     * @param forceForward will show the message as forwarded even if it is from you
     */
    async forwardMessage(id: string, message: WAMessage, forceForward: boolean=false) {
        const content = message.message
        if (!content) throw new Error ('no content in message')

        let key = Object.keys(content)[0]

        let score = content[key].contextInfo?.forwardingScore || 0
        score += message.key.fromMe && !forceForward ? 0 : 1
        if (key === MessageType.text) {
            content[MessageType.extendedText] = { text: content[key] }
            delete content[MessageType.text]

            key = MessageType.extendedText
        }
        if (score > 0) content[key].contextInfo = { forwardingScore: score, isForwarded: true }
        else content[key].contextInfo = {}

        const waMessage = this.prepareMessageFromContent (id, content, {})
        await this.relayWAMessage (waMessage)
        return waMessage
    }
}
