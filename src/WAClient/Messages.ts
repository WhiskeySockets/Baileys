import WhatsAppWebGroups from './Groups'
import fetch from 'node-fetch'
import {
    MessageOptions,
    MessageType,
    Mimetype,
    MimetypeMap,
    MediaPathMap,
    WALocationMessage,
    WAContactMessage,
    WASendMessageResponse,
    WAMessageKey,
    ChatModification,
    MessageInfo,
} from './Constants'
import { generateMessageID, sha256, hmacSign, aesEncrypWithIV, randomBytes } from '../WAConnection/Utils'
import { WAMessageContent, WAMetric, WAFlag, WANode, WAMessage } from '../WAConnection/Constants'
import { validateJIDForSending, generateThumbnail, getMediaKeys } from './Utils'
import { proto } from '../../WAMessage/WAMessage'

export default class WhatsAppWebMessages extends WhatsAppWebGroups {
    /** Get the message info, who has read it, who its been delivered to */
    async messageInfo (jid: string, messageID: string) {
        const query = ['query', {type: 'message_info', index: messageID, jid: jid, epoch: this.msgCount.toString()}, null]
        const response = (await this.queryExpecting200 (query, [22, WAFlag.ignore]))[2]
        
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
     * Send a read receipt to the given ID for a certain message
     * @param jid the ID of the person/group whose message you want to mark read
     * @param messageID optionally, the message ID
     * @param type whether to read or unread the message
     */
    async sendReadReceipt(jid: string, messageID?: string, type: 'read' | 'unread' = 'read') {
        const attributes = {
            jid: jid, 
            count: type === 'read' ? '1' : '-2', 
            index: messageID, 
            owner: messageID ? 'false' : null
        }
        return this.setQuery ([['read', attributes, null]])
    }
    /** Mark a given chat as unread */
    async markChatUnread (jid: string) { return this.sendReadReceipt (jid, null, 'unread') }
    async archiveChat (jid: string) { return this.modifyChat (jid, ChatModification.archive) }
    /**
     * Modify a given chat (archive, pin etc.)
     * @param jid the ID of the person/group you are modifiying
     * @param options.stamp the timestamp of pinning/muting the chat. Is required when unpinning/unmuting 
     */
    async modifyChat (jid: string, type: ChatModification, options: {stamp: Date | string} = {stamp: new Date()}) {
        let chatAttrs: Record<string, string> = {jid: jid}
        if ((type === ChatModification.unpin || type === ChatModification.unmute) && !options?.stamp) {
            throw new Error('options.stamp must be set to the timestamp of the time of pinning/unpinning of the chat')
        }
        const strStamp = options.stamp && 
                        (typeof options.stamp === 'string' ? options.stamp : Math.round(options.stamp.getTime ()/1000).toString ())
        switch (type) {
            case ChatModification.pin:
            case ChatModification.mute:
                chatAttrs.type = type
                chatAttrs[type] = strStamp
                break
            case ChatModification.unpin:
            case ChatModification.unmute:
                chatAttrs.type = type.replace ('un', '') // replace 'unpin' with 'pin'
                chatAttrs.previous = strStamp
                break
            default:
                chatAttrs.type = type
                break
        }
        let response = await this.setQuery ([['chat', chatAttrs, null]]) as any
        response.stamp = strStamp
        return response as {status: number, stamp: string}
    }
    async loadMessage (jid: string, messageID: string) {
        let messages
        try {
            messages = await this.loadConversation (jid, 1, {id: messageID, fromMe: true}, false)
        } catch {
            messages = await this.loadConversation (jid, 1, {id: messageID, fromMe: false}, false)
        }
        var index = null
        if (messages.length > 0) index = messages[0].key
        
        const actual = await this.loadConversation (jid, 1, index)
        return actual[0]
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
        const response: WANode = await this.queryExpecting200(json, [WAMetric.group, WAFlag.ignore]) // encrypt and send  off
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
     * Fetches the latest url & media key for the given message.
     * You may need to call this when the message is old & the content is deleted off of the WA servers
     * @param message 
     */
    async updateMediaMessage (message: WAMessage) {
        const content = message.message?.audioMessage || message.message?.videoMessage || message.message?.imageMessage || message.message?.stickerMessage || message.message?.documentMessage 
        if (!content) throw new Error (`given message ${message.key.id} is not a media message`)
        
        const query = ['query',{type: 'media', index: message.key.id, owner: message.key.fromMe ? 'true' : 'false', jid: message.key.remoteJid, epoch: this.msgCount.toString()},null]
        const response = await this.query (query, [WAMetric.queryMedia, WAFlag.ignore])
        if (parseInt(response[1].code) !== 200) throw new Error ('unexpected status ' + response[1].code)
        
        Object.keys (response[1]).forEach (key => content[key] = response[1][key]) // update message
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
                type: proto.ProtocolMessage.PROTOCOL_MESSAGE_TYPE.REVOKE
            }
        }
        return this.sendGenericMessage (id, json, {})
    }
    async sendMessage(
        id: string,
        message: string | WALocationMessage | WAContactMessage | Buffer,
        type: MessageType,
        options: MessageOptions = {},
    ) {
        if (options.validateID === true || !('validateID' in options)) {
            validateJIDForSending (id)
        }
        let m: any = {}
        switch (type) {
            case MessageType.text:
            case MessageType.extendedText:
                if (typeof message !== 'string') {
                    throw new Error('expected message to be a string')
                }
                m.extendedTextMessage = { text: message }
                break
            case MessageType.location:
            case MessageType.liveLocation:
                m.locationMessage = message as WALocationMessage
                break
            case MessageType.contact:
                m.contactMessage = message as WAContactMessage
                break
            default:
                m = await this.prepareMediaMessage(message as Buffer, type, options)
                break
        }
        return this.sendGenericMessage(id, m as WAMessageContent, options)
    }
    /** Prepare a media message for sending */
    protected async prepareMediaMessage(buffer: Buffer, mediaType: MessageType, options: MessageOptions = {}) {
        if (mediaType === MessageType.document && !options.mimetype) {
            throw new Error('mimetype required to send a document')
        }
        if (mediaType === MessageType.sticker && options.caption) {
            throw new Error('cannot send a caption with a sticker')
        }
        if (!options.mimetype) {
            options.mimetype = MimetypeMap[mediaType]
        }
        let isGIF = false
        if (options.mimetype === Mimetype.gif) {
            isGIF = true
            options.mimetype = MimetypeMap[MessageType.video]
        }
        // generate a media key
        const mediaKey = randomBytes(32)
        const mediaKeys = getMediaKeys(mediaKey, mediaType)
        const enc = aesEncrypWithIV(buffer, mediaKeys.cipherKey, mediaKeys.iv)
        const mac = hmacSign(Buffer.concat([mediaKeys.iv, enc]), mediaKeys.macKey).slice(0, 10)
        const body = Buffer.concat([enc, mac]) // body is enc + mac
        const fileSha256 = sha256(buffer)
        // url safe Base64 encode the SHA256 hash of the body
        const fileEncSha256B64 = sha256(body)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/\=+$/, '')

        await generateThumbnail(buffer, mediaType, options)
        // send a query JSON to obtain the url & auth token to upload our media
        const json = (await this.query(['query', 'mediaConn'])).media_conn
        const auth = json.auth // the auth token
        let hostname = 'https://' + json.hosts[0].hostname // first hostname available
        hostname += MediaPathMap[mediaType] + '/' + fileEncSha256B64 // append path
        hostname += '?auth=' + auth // add auth token
        hostname += '&token=' + fileEncSha256B64 // file hash

        const urlFetch = await fetch(hostname, {
            method: 'POST',
            body: body,
            headers: { Origin: 'https://web.whatsapp.com' },
        })
        const responseJSON = await urlFetch.json()
        if (!responseJSON.url) {
            throw new Error('Upload failed got: ' + JSON.stringify(responseJSON))
        }
        const message = {}
        message[mediaType] = {
            url: responseJSON.url,
            mediaKey: mediaKey.toString('base64'),
            mimetype: options.mimetype,
            fileEncSha256: fileEncSha256B64,
            fileSha256: fileSha256.toString('base64'),
            fileLength: buffer.length,
            fileName: options.filename || 'file',
            gifPlayback: isGIF || null,
        }
        return message as WAMessageContent
    }
    /** Generic send message function */
    async sendGenericMessage(id: string, message: WAMessageContent, options: MessageOptions) {
        if (!options.timestamp) {
            // if no timestamp was provided,
            options.timestamp = new Date() // set timestamp to now
        }
        const key = Object.keys(message)[0]
        const timestamp = options.timestamp.getTime() / 1000
        const quoted = options.quoted
        if (quoted) {
            const participant = quoted.key.participant || quoted.key.remoteJid
            message[key].contextInfo = {
                participant: participant,
                stanzaId: quoted.key.id,
                quotedMessage: quoted.message,
            }
            // if a participant is quoted, then it must be a group
            // hence, remoteJid of group must also be entered
            if (quoted.key.participant) {
                message[key].contextInfo.remoteJid = quoted.key.remoteJid
            }
        }
        message[key].caption = options?.caption
        message[key].jpegThumbnail = options?.thumbnail

        const messageJSON = {
            key: {
                remoteJid: id,
                fromMe: true,
                id: generateMessageID(),
            },
            message: message,
            messageTimestamp: timestamp,
            participant: id.includes('@g.us') ? this.userMetaData.id : null,
        }
        const json = ['action', {epoch: this.msgCount.toString(), type: 'relay'}, [['message', null, messageJSON]]]
        const response = await this.queryExpecting200(json, [WAMetric.message, WAFlag.ignore], null, messageJSON.key.id)
        return { status: response.status as number, messageID: messageJSON.key.id } as WASendMessageResponse
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
    /** Generic function for action, set queries */
    async setQuery (nodes: WANode[]) {
        const json = ['action', {epoch: this.msgCount.toString(), type: 'set'}, nodes]
        return this.queryExpecting200(json, [WAMetric.group, WAFlag.ignore]) as Promise<{status: number}>
    }
}
