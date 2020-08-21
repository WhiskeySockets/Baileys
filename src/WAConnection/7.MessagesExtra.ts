import {WAConnection as Base} from './6.MessagesSend'
import {
    MessageType,
    WAMessageKey,
    MessageInfo,
    WATextMessage,
    WAUrlInfo,
    WAMessageContent, WAMetric, WAFlag, WANode, WAMessage, WAMessageProto, BaileysError, MessageLogLevel, WA_MESSAGE_STATUS_TYPE
} from './Constants'
import { whatsappID } from './Utils'

export class WAConnection extends Base {

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
     * Read/unread messages of a chat; will mark the entire chat read by default
     * @param jid the ID of the person/group whose message you want to mark read
     * @param messageID optionally, the message ID
     * @param count number of messages to read, set to < 0 to unread a message
     */
    async sendReadReceipt(jid: string, messageID?: string, count?: number) {
        jid = whatsappID (jid)
        const chat = this.chats.get(jid)
        count = count || Math.abs(chat?.count || 1)
        
        const attributes = {
            jid: jid, 
            count: count.toString(), 
            index: messageID, 
            owner: messageID ? 'false' : null
        }
        const read = await this.setQuery ([['read', attributes, null]])
        if (chat) {
            chat.count = count < 0 ? -1 : chat.count-count
            this.emit ('chat-update', {jid, count: chat.count})
        }
        return read
    }
    /**
     * Load the conversation with a group or person
     * @param count the number of messages to load
     * @param before the data for which message to offset the query by
     * @param mostRecentFirst retreive the most recent message first or retreive from the converation start
     */
    async loadMessages (
        jid: string,
        count: number,
        before: { id?: string; fromMe?: boolean } = null,
        mostRecentFirst = true
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
            const response = await this.query({json, binaryTags: [WAMetric.queryMessages, WAFlag.ignore], expect200: true})
            const messages = response[2] ? (response[2] as WANode[]).map((item) => item[2] as WAMessage) : []
    
            return messages
        }
        const chat = this.chats.get (jid)
        
        let messages: WAMessage[]
        if (!before && chat && mostRecentFirst) {
            messages = chat.messages
            if (messages.length < count) {
                const extra = await retreive (count-messages.length, messages[0]?.key)
                messages.unshift (...extra) 
            }
        } else messages = await retreive (count, before)
        
        const cursor = messages[0] && messages[0].key
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
    /** Load a single message specified by the ID */
    async loadMessage (jid: string, messageID: string) {
        let messages: WAMessage[]
        try {
            messages = (await this.loadMessages (jid, 1, {id: messageID, fromMe: true}, false)).messages
        } catch {
            messages = (await this.loadMessages (jid, 1, {id: messageID, fromMe: false}, false)).messages
        }
        var index = null
        if (messages.length > 0) index = messages[0].key
        
        const actual = await this.loadMessages (jid, 1, index)
        return actual.messages[0]
    }
    /** Query a string to check if it has a url, if it does, return required extended text message */
    async generateLinkPreview (text: string) {
        const query = ['query', {type: 'url', url: text, epoch: this.msgCount.toString()}, null]
        const response = await this.query ({json: query, binaryTags: [26, WAFlag.ignore], expect200: true})
        
        if (response[1]) response[1].jpegThumbnail = response[2]
        const data = response[1] as WAUrlInfo

        const content = {text} as WATextMessage
        content.canonicalUrl = data['canonical-url']
        content.matchedText = data['matched-text']
        content.jpegThumbnail = data.jpegThumbnail
        content.description = data.description
        content.title = data.title
        content.previewType = 0
        return content
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
    async clearMessage (messageKey: WAMessageKey) {
        const tag = Math.round(Math.random ()*1000000)
        const attrs: WANode = [
            'chat',
            { jid: messageKey.remoteJid, modify_tag: tag.toString(), type: 'clear' },
            [
                ['item', {owner: `${messageKey.fromMe}`, index: messageKey.id}, null]
            ]
        ]
        return this.setQuery ([attrs])
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