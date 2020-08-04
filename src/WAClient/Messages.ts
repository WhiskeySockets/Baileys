import WhatsAppWebGroups from './Groups'
import fetch from 'node-fetch'
import { promises as fs } from 'fs'
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
    WATextMessage,
    WAUrlInfo,
} from './Constants'
import { generateMessageID, sha256, hmacSign, aesEncrypWithIV, randomBytes } from '../WAConnection/Utils'
import { WAMessageContent, WAMetric, WAFlag, WANode, WAMessage, WAMessageProto, BaileysError, MessageLogLevel } from '../WAConnection/Constants'
import { validateJIDForSending, generateThumbnail, getMediaKeys, decodeMediaMessageBuffer, extensionForMediaMessage } from './Utils'
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
    /** 
     * Mark a given chat as unread 
     * @deprecated since 2.0.0, use `sendReadReceipt (jid, null, 'unread')` instead
    */
    async markChatUnread (jid: string) { return this.sendReadReceipt (jid, null, 'unread') }
    /** 
     * Archive a chat
     * @deprecated since 2.0.0, use `modifyChat (jid, ChatModification.archive)` instead
    */
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
    /** Query a string to check if it has a url, if it does, return required extended text message */
    async generateLinkPreview (text: string) {
        const query = ['query', {type: 'url', url: text, epoch: this.msgCount.toString()}, null]
        const response = await this.queryExpecting200 (query, [26, WAFlag.ignore])
        
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
        if (!content) throw new BaileysError (`given message ${message.key.id} is not a media message`, message)
        
        const query = ['query',{type: 'media', index: message.key.id, owner: message.key.fromMe ? 'true' : 'false', jid: message.key.remoteJid, epoch: this.msgCount.toString()},null]
        const response = await this.query (query, [WAMetric.queryMedia, WAFlag.ignore])
        if (parseInt(response[1].code) !== 200) throw new BaileysError ('unexpected status ' + response[1].code, response)
        
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
        return this.sendMessageContent (id, json, {})
    }
    /**
     * Forward a message like WA does
     * @param id the id to forward the message to
     * @param message the message to forward
     */
    async forwardMessage(id: string, message: WAMessage) {
        const content = message.message
        if (!content) throw new Error ('no content in message')
        
        let key = Object.keys(content)[0]
        
        let score = content[key].contextInfo?.forwardingScore || 0
        score += message.key.fromMe ? 0 : 1
        if (key === MessageType.text) {
            content[MessageType.extendedText] = { text: content[key] }
            delete content[MessageType.text]

            key = MessageType.extendedText
        }
        if (score > 0) content[key].contextInfo = { forwardingScore: score, isForwarded: true }
        else content[key].contextInfo = {}

        return this.sendMessageContent (id, content, {})
    }
    async sendMessage(
        id: string,
        message: string | WATextMessage | WALocationMessage | WAContactMessage | Buffer,
        type: MessageType,
        options: MessageOptions = {},
    ) {
        if (options.validateID === true || !('validateID' in options)) {
            validateJIDForSending (id)
        }
        let m: WAMessageContent = {}
        switch (type) {
            case MessageType.text:
            case MessageType.extendedText:
                if (typeof message === 'string') {
                    m.extendedTextMessage = {text: message}
                } else if ('text' in message) {
                    m.extendedTextMessage = message as WATextMessage
                } else {
                    throw new BaileysError ('message needs to be a string or object with property \'text\'', message)
                }
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
        return this.sendMessageContent(id, m, options)
    }
    /** Prepare a media message for sending */
    async prepareMediaMessage(buffer: Buffer, mediaType: MessageType, options: MessageOptions = {}) {
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
            caption: options.caption
        }
        return message as WAMessageContent
    }
    /** Send message content */
    async sendMessageContent(id: string, message: WAMessageContent, options: MessageOptions) {
        const messageJSON = this.generateWAMessage (id, message, options)
        return this.sendWAMessage (messageJSON)
    }
    /** generates a WAMessage from the given content & options */
    generateWAMessage(id: string, message: WAMessageContent, options: MessageOptions) {
        if (!options.timestamp) options.timestamp = new Date() // set timestamp to now
        
        const key = Object.keys(message)[0]
        const timestamp = options.timestamp.getTime()/1000
        const quoted = options.quoted
        
        if (options.contextInfo) message[key].contextInfo = options.contextInfo

        if (quoted) {
            const participant = quoted.key.participant || quoted.key.remoteJid

            message[key].contextInfo = message[key].contextInfo || { }
            message[key].contextInfo.participant = participant
            message[key].contextInfo.stanzaId = quoted.key.id
            message[key].contextInfo.quotedMessage = quoted.message
            
            // if a participant is quoted, then it must be a group
            // hence, remoteJid of group must also be entered
            if (quoted.key.participant) {
                message[key].contextInfo.remoteJid = quoted.key.remoteJid
            }
        }
        if (!message[key].jpegThumbnail) message[key].jpegThumbnail = options?.thumbnail

        const messageJSON = {
            key: {
                remoteJid: id,
                fromMe: true,
                id: generateMessageID(),
            },
            message: message,
            messageTimestamp: timestamp,
            messageStubParameters: [],
            participant: id.includes('@g.us') ? this.userMetaData.id : null,
            status: WAMessageProto.proto.WebMessageInfo.WEB_MESSAGE_INFO_STATUS.PENDING
        }
        return messageJSON as WAMessage
    }
    /** 
     * Send a WAMessage; more advanced functionality, you may want to stick with sendMessage()
     * */
    async sendWAMessage(message: WAMessage) {
        const json = ['action', {epoch: this.msgCount.toString(), type: 'relay'}, [['message', null, message]]]
        const flag = message.key.remoteJid === this.userMetaData.id ? WAFlag.acknowledge : WAFlag.ignore // acknowledge when sending message to oneself
        const response = await this.queryExpecting200(json, [WAMetric.message, flag], null, message.key.id)
        return { 
            status: response.status as number, 
            messageID: message.key.id,
            message: message as WAMessage
        } as WASendMessageResponse
    }
    /**
     * Securely downloads the media from the message. 
     * Renews the download url automatically, if necessary.
     */
    async downloadMediaMessage (message: WAMessage) {
        const fetchHeaders = { 'User-Agent': this.userAgentString }
        try {
            const buff = await decodeMediaMessageBuffer (message.message, fetchHeaders)
            return buff
        } catch (error) {
            if (error instanceof BaileysError && error.status === 404) { // media needs to be updated
                this.log (`updating media of message: ${message.key.id}`, MessageLogLevel.info)
                await this.updateMediaMessage (message)
                const buff = await decodeMediaMessageBuffer (message.message, fetchHeaders)
                return buff
            }
            throw error
        }
    }
    /**
     * Securely downloads the media from the message and saves to a file. 
     * Renews the download url automatically, if necessary.
     * @param message the media message you want to decode
     * @param filename the name of the file where the media will be saved
     * @param attachExtension should the parsed extension be applied automatically to the file
     */
    async downloadAndSaveMediaMessage (message: WAMessage, filename: string, attachExtension: boolean=true) {
        const buffer = await this.downloadMediaMessage (message)
        const extension = extensionForMediaMessage (message.message)
        const trueFileName = attachExtension ? (filename + '.' + extension) : filename
        await fs.writeFile (trueFileName, buffer)
        return trueFileName
    }
}
