import {WAConnection as Base} from './6.MessagesSend'
import { MessageType, WAMessageKey, MessageInfo, WAMessageContent, WAMetric, WAFlag, WANode, WAMessage, WAMessageProto, ChatModification, BaileysError, WAChatIndex, WAChat } from './Constants'
import { whatsappID, delay, toNumber, unixTimestampSeconds, GET_MESSAGE_ID, isGroupID, newMessagesDB } from './Utils'
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
        const [,,response] = await this.query ({
            json: query, 
            binaryTags: [WAMetric.queryRead, WAFlag.ignore], 
            expect200: true,
            requiresPhoneConnection: true
        })

        const info: MessageInfo = {reads: [], deliveries: []}
        if (response) {
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

        const count = type === 'unread' ? '-2' : Math.abs(chat.count).toString()
        if (type === 'unread' || chat.count !== 0) {
            const idx = await this.getChatIndex(jid)
            await this.setQuery ([
                ['read', { jid, count, ...idx, participant: undefined }, null]
            ], [ WAMetric.read, WAFlag.ignore ])
        }
        chat.count = type === 'unread' ? -1 : 0
        this.emit ('chat-update', {jid, count: chat.count})
    }
    /**
     * Sends a read receipt for a given message;
     * does not update the chat do @see chatRead
     * @deprecated just use chatRead()
     * @param jid the ID of the person/group whose message you want to mark read
     * @param messageKey the key of the message
     * @param count number of messages to read, set to < 0 to unread a message
     */
    async sendReadReceipt(jid: string, messageKey: WAMessageKey, count: number) {
        const attributes = {
            jid,
            count: count.toString(),
            index: messageKey?.id,
            participant: messageKey?.participant || undefined,
            owner: messageKey?.fromMe?.toString()
        }
        const read = await this.setQuery ([['read', attributes, null]], [ WAMetric.read, WAFlag.ignore ])
        return read
    }
    async fetchMessagesFromWA (jid: string, count: number, indexMessage?: { id?: string; fromMe?: boolean }, mostRecentFirst: boolean = true) {
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
        const response = await this.query({json, binaryTags: [WAMetric.queryMessages, WAFlag.ignore], expect200: false, requiresPhoneConnection: true})
        return (response[2] as WANode[])?.map(item => item[2] as WAMessage) || []
    }
    /**
     * Load the conversation with a group or person
     * @param count the number of messages to load
     * @param cursor the data for which message to offset the query by
     * @param mostRecentFirst retrieve the most recent message first or retrieve from the converation start
     */
    @Mutex (jid => jid)
    async loadMessages (
        jid: string,
        count: number,
        cursor?: { id?: string; fromMe?: boolean },
        mostRecentFirst: boolean = true
    ) {
        jid = whatsappID(jid)

        const retrieve = (count: number, indexMessage: any) => this.fetchMessagesFromWA (jid, count, indexMessage, mostRecentFirst)
        
        const chat = this.chats.get (jid)
        const hasCursor = cursor?.id && typeof cursor?.fromMe !== 'undefined'
        const cursorValue = hasCursor && chat?.messages.get (GET_MESSAGE_ID(cursor))
        
        let messages: WAMessage[]
        if (chat?.messages && mostRecentFirst && (!hasCursor || cursorValue)) {
            messages = chat.messages.paginatedByValue (cursorValue, count, null, 'before')
            
            const diff = count - messages.length
            if (diff < 0) {
                messages = messages.slice(-count) // get the last X messages
            } else if (diff > 0) {
                const fMessage = chat.messages.all()[0]
                let fepoch = (fMessage && fMessage['epoch']) || 0
                const extra = await retrieve (diff, messages[0]?.key || cursor)
                // add to DB
                for (let i = extra.length-1;i >= 0; i--) {
                    const m = extra[i]
                    fepoch -= 1
                    m['epoch'] = fepoch

                    if(chat.messages.length < this.maxCachedMessages) {
                        chat.messages.insertIfAbsent(m)
                    }
                }
                messages.unshift (...extra)
            }
        } else messages = await retrieve (count, cursor)
        
        if (messages[0]) cursor = { id: messages[0].key.id, fromMe: messages[0].key.fromMe }
        else cursor = null

        return {messages, cursor}
    }
    /**
     * Load the entire friggin conversation with a group or person
     * @param onMessage callback for every message retrieved
     * @param chunkSize the number of messages to load in a single request
     * @param mostRecentFirst retrieve the most recent message first or retrieve from the converation start
     */
    loadAllMessages(jid: string, onMessage: (m: WAMessage) => Promise<void>|void, chunkSize = 25, mostRecentFirst = true) {
        let offsetID = null
        const loadMessage = async () => {
            const {messages} = await this.loadMessages(jid, chunkSize, offsetID, mostRecentFirst)
            // callback with most recent message first (descending order of date)
            let lastMessage
            if (mostRecentFirst) {
                for (let i = messages.length - 1; i >= 0; i--) {
                    await onMessage(messages[i])
                    lastMessage = messages[i]
                }
            } else {
                for (let i = 0; i < messages.length; i++) {
                    await onMessage(messages[i])
                    lastMessage = messages[i]
                }
            }
            // if there are still more messages
            if (messages.length >= chunkSize) {
                offsetID = lastMessage.key // get the last message
                await delay(200)
                return loadMessage()
            }
        }
        return loadMessage() as Promise<void>
    }
    /**
     * Find a message in a given conversation
     * @param chunkSize the number of messages to load in a single request
     * @param onMessage callback for every message retrieved, if return true -- the loop will break
     */
    async findMessage (jid: string, chunkSize: number, onMessage: (m: WAMessage) => boolean) {
        const chat = this.chats.get (whatsappID(jid))
        let count = chat?.messages?.all().length || chunkSize
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
    async loadMessage (jid: string, id: string) {
        let message: WAMessage

        jid = whatsappID (jid)
        const chat = this.chats.get (jid)
        if (chat) {
            // see if message is present in cache
            message = chat.messages.get (GET_MESSAGE_ID({ id, fromMe: true })) || chat.messages.get (GET_MESSAGE_ID({ id, fromMe: false }))
        }
        if (!message) {
            // load the message before the given message
            let messages = (await this.loadMessages (jid, 1, {id, fromMe: true})).messages
            if (!messages[0]) messages = (await this.loadMessages (jid, 1, {id, fromMe: false})).messages
            // the message after the loaded message is the message required
            const actual = await this.loadMessages (jid, 1, messages[0] && messages[0].key, false)
            message = actual.messages[0]
        }
        return message
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
                search: Buffer.from(txt, 'utf-8'),
                count: count.toString(),
                page: page.toString(),
                jid: inJid
            },
            null,
        ]
        
        const response: WANode = await this.query({json, binaryTags: [24, WAFlag.ignore], expect200: true}) // encrypt and send  off
        const messages = response[2] ? response[2].map (row => row[2]) : []
        return { 
            last: response[1]['last'] === 'true', 
            messages: messages as WAMessage[] 
        }
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
            const value = chat.messages.get (GET_MESSAGE_ID(messageKey))
            value && chat.messages.delete (value)
        }
        return result
    }
    /**
     * Star or unstar a message
     * @param messageKey key of the message you want to star or unstar
     */
    @Mutex (m => m.remoteJid)
    async starMessage (messageKey: WAMessageKey, type: 'star' | 'unstar' = 'star') { 
        const attrs: WANode = [
            'chat',
            { 
                jid: messageKey.remoteJid,
                type
            },
            [
                ['item', {owner: `${messageKey.fromMe}`, index: messageKey.id}, null]
            ]
        ]
        const result = await this.setQuery ([attrs])

        const chat = this.chats.get (whatsappID(messageKey.remoteJid))
        if (result.status == 200 && chat) {
            const message = chat.messages.get (GET_MESSAGE_ID(messageKey))
            if (message) {
                message.starred = type === 'star'

                const chatUpdate: Partial<WAChat> = { jid: messageKey.remoteJid, messages: newMessagesDB([ message ]) }
                this.emit ('chat-update', chatUpdate)
            }
        }
        return result
    }
    /**
     * Delete a message in a chat for everyone
     * @param id the person or group where you're trying to delete the message
     * @param messageKey key of the message you want to delete
     */
    async deleteMessage (k: string | WAMessageKey, messageKey?: WAMessageKey) {
        if (typeof k === 'object') {
            messageKey = k
        }
        const json: WAMessageContent = {
            protocolMessage: {
                key: messageKey,
                type: WAMessageProto.ProtocolMessage.ProtocolMessageType.REVOKE
            }
        }
        const waMessage = this.prepareMessageFromContent (messageKey.remoteJid, json, {})
        await this.relayWAMessage (waMessage)
        return waMessage
    }
    /**
     * Generate forwarded message content like WA does
     * @param message the message to forward
     * @param forceForward will show the message as forwarded even if it is from you
     */
    generateForwardMessageContent (message: WAMessage, forceForward: boolean=false) {
        let content = message.message
        if (!content) throw new BaileysError ('no content in message', { status: 400 })
        content = WAMessageProto.Message.fromObject(content) // hacky copy

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
        return content
    }
    /**
     * Forward a message like WA
     * @param jid the chat ID to forward to
     * @param message the message to forward
     * @param forceForward will show the message as forwarded even if it is from you
     */
    async forwardMessage(jid: string, message: WAMessage, forceForward: boolean=false) {
        const content = this.generateForwardMessageContent(message, forceForward)
        const waMessage = this.prepareMessageFromContent (jid, content, {})
        await this.relayWAMessage (waMessage)
        return waMessage
    }
    /**
     * Clear the chat messages
     * @param jid the ID of the person/group you are modifiying
     * @param includeStarred delete starred messages, default false
     */
    async modifyChat (jid: string, type: ChatModification.clear, includeStarred?: boolean): Promise<{status: number;}>;
    /**
     * Modify a given chat (archive, pin etc.)
     * @param jid the ID of the person/group you are modifiying
     * @param durationMs only for muting, how long to mute the chat for
     */
    async modifyChat (jid: string, type: ChatModification.pin | ChatModification.mute, durationMs: number): Promise<{status: number;}>;
    /**
     * Modify a given chat (archive, pin etc.)
     * @param jid the ID of the person/group you are modifiying
     */
    async modifyChat (jid: string, type: ChatModification | (keyof typeof ChatModification)): Promise<{status: number;}>;
    @Mutex ((jid, type) => jid+type)
    async modifyChat (jid: string, type: (keyof typeof ChatModification), arg?: number | boolean): Promise<{status: number;}> {
        jid = whatsappID (jid)
        const chat = this.assertChatGet (jid)

        let chatAttrs: Record<string, string> = {jid: jid}
        if (type === ChatModification.mute && !arg) {
            throw new BaileysError(
                'duration must be set to the timestamp of the time of pinning/unpinning of the chat', 
                { status: 400 }
            )
        }

        const durationMs:number = arg as number || 0
        const includeStarred:boolean = arg as boolean
        let index: WAChatIndex;
        switch (type) {
            case ChatModification.pin:
            case ChatModification.mute:
                const strStamp = (unixTimestampSeconds() + Math.floor(durationMs/1000)).toString()
                chatAttrs.type = type
                chatAttrs[type] = strStamp
                break
            case ChatModification.unpin:
            case ChatModification.unmute:
                chatAttrs.type = type.replace ('un', '') // replace 'unpin' with 'pin'
                chatAttrs.previous = chat[type.replace ('un', '')]
                break
            case ChatModification.clear:
                chatAttrs.type = type
                chatAttrs.star = includeStarred ? 'true' : 'false'
                index = await this.getChatIndex(jid)
                chatAttrs = { ...chatAttrs, ...index }
                delete chatAttrs.participant
                break
            default:
                chatAttrs.type = type
                index = await this.getChatIndex(jid)
                chatAttrs = { ...chatAttrs, ...index }
                break
        }

        const response = await this.setQuery ([['chat', chatAttrs, null]], [ WAMetric.chat, WAFlag.ignore ])

        if (chat && response.status === 200) {
            switch(type) {
                case ChatModification.clear:
                    if (includeStarred) {
                        chat.messages.clear()
                    } else {
                        chat.messages = chat.messages.filter(m => m.starred)
                    }
                break
                case ChatModification.delete:
                    this.chats.deleteById(jid)
                    this.emit('chat-update', { jid, delete: 'true' })
                break
                default:
                    this.chats.update(jid, chat => {
                        if (type.includes('un')) {
                            type = type.replace ('un', '') as ChatModification
                            delete chat[type.replace('un','')]
                            this.emit ('chat-update', { jid, [type]: false })
                        } else {
                            chat[type] = chatAttrs[type] || 'true'
                            this.emit ('chat-update', { jid, [type]: chat[type] })
                        }
                    })
                break
            }
        }
        return response
    }
    protected async getChatIndex (jid: string): Promise<WAChatIndex> {
        const chatAttrs = {} as WAChatIndex
        const { messages: [msg] } = await this.loadMessages(jid, 1)
        if (msg) {
            chatAttrs.index = msg.key.id
            chatAttrs.owner = msg.key.fromMe.toString() as 'true' | 'false'
        }
        if (isGroupID(jid)) {
            chatAttrs.participant = msg.key.fromMe ? this.user?.jid : whatsappID(msg.participant || msg.key.participant)
        }
        return chatAttrs
    }
}
