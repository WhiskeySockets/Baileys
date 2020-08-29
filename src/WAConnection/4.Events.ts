import * as QR from 'qrcode-terminal'
import { WAConnection as Base } from './3.Connect'
import { WAMessageStatusUpdate, WAMessage, WAContact, WAChat, WAMessageProto, WA_MESSAGE_STUB_TYPE, WA_MESSAGE_STATUS_TYPE, MessageLogLevel, PresenceUpdate, BaileysEvent, DisconnectReason, WANode } from './Constants'
import { whatsappID, unixTimestampSeconds, isGroupID } from './Utils'

export class WAConnection extends Base {

    constructor () {
        super ()

        this.registerOnMessageStatusChange ()
        this.registerOnUnreadMessage ()
        this.registerOnPresenceUpdate ()
        
        // If a message has been updated (usually called when a video message gets its upload url)
        this.registerCallback (['action', 'add:update', 'message'], json => {
            const message: WAMessage = json[2][0][2]
            const jid = whatsappID(message.key.remoteJid)
            const chat = this.chats.get(jid)
            if (!chat) return

            const messageIndex = chat.messages.findIndex(m => m.key.id === message.key.id)
            if (messageIndex >= 0) chat.messages[messageIndex] = message
            
            this.emit ('message-update', message)
        })
        // If a user's contact has changed
        this.registerCallback (['action', null, 'user'], json => {
            const node = json[2][0]
            if (node) {
                const user = node[1] as WAContact
                user.jid = whatsappID(user.jid)
                
                const chat = this.chats.get (user.jid)
                if (chat) {
                    chat.name = user.name || user.notify
                    this.emit ('chat-update', { jid: chat.jid, name: chat.name })
                }
            }
        })
        // chat archive, pin etc.
        this.registerCallback(['action', null, 'chat'], json => {
            json = json[2][0]

            const updateType = json[1].type
            const jid = whatsappID(json[1]?.jid)
            
            const chat = this.chats.get(jid)
            if (!chat) return

            const FUNCTIONS = {
                'delete': () => {
                    chat['delete'] = 'true'
                    this.chats.delete(chat)
                    return 'delete'
                },
                'clear': () => {
                    json[2].forEach(item => chat.messages.filter(m => m.key.id !== item[1].index))
                    return 'clear'
                },
                'archive': () => {
                    chat.archive = 'true'
                    return 'archive'
                },
                'unarchive': () => {
                    delete chat.archive
                    return 'archive'
                },
                'pin': () => {
                    chat.pin = json[1].pin
                    return 'pin'
                }
            }
            const func = FUNCTIONS [updateType]
            
            if (func) {
                const property = func ()
                this.emit ('chat-update', { jid, [property]: chat[property] || null })
            }            
        })
        // profile picture updates
        this.registerCallback(['Cmd', 'type:picture'], async json => {
            const jid = whatsappID(json[1].jid)
            const chat = this.chats.get(jid)
            if (!chat) return
            
            await this.setProfilePicture (chat)
            this.emit ('chat-update', { jid, imgUrl: chat.imgUrl })
        })
        // status updates
        this.registerCallback(['Status'], async json => {
            const jid = whatsappID(json[1].id)
            this.emit ('user-status-update', { jid, status: json[1].status })
        })
        // read updates
        this.registerCallback (['action', null, 'read'], async json => {
            const update = json[2][0][1]

            const chat = this.chats.get ( whatsappID(update.jid) )

            if (update.type === 'false') chat.count = -1
            else chat.count = 0

            this.emit ('chat-update', { jid: chat.jid, count: chat.count })
        })
        // get contacts
        this.registerCallback(['response', 'type:contacts'], json => {
            if (json[1].duplicate || !json[2]) return
            
            const contacts: {[k: string]: WAContact} = {}
            json[2].forEach(([type, contact]: ['user', WAContact]) => {
                if (!contact) return this.log (`unexpectedly got null contact: ${type}, ${contact}`, MessageLogLevel.info)
                
                contact.jid = whatsappID (contact.jid)
                contacts[contact.jid] = contact
            })
            this.emit ('contacts-received', contacts)
        })
        /*// genetic chat action
        this.registerCallback (['Chat', 'cmd:action'], json => {
            const data = json[1].data as WANode
            if (!data) return

            this.log (data, MessageLogLevel.info)

            if (data[0] === 'create') {

            }
        })*/

        this.on ('qr', qr => QR.generate(qr, { small: true }))
    }
    /** Get the URL to download the profile picture of a person/group */
    async getProfilePicture(jid: string | null) {
        const response = await this.query({ json: ['query', 'ProfilePicThumb', jid || this.user.jid] })
        return response.eurl as string
    }
    /** Set the callback for message status updates (when a message is delivered, read etc.) */
    protected registerOnMessageStatusChange() {
        const func = json => {
            json = json[1]
            let ids = json.id
            
            if (json.cmd === 'ack') ids = [json.id]
            
            const update: WAMessageStatusUpdate = {
                from: json.from,
                to: json.to,
                participant: json.participant,
                timestamp: new Date(json.t * 1000),
                ids: ids,
                type: (+json.ack)+1,
            }
            
            const chat = this.chats.get( whatsappID(update.to) )
            if (!chat) return
            
            this.emit ('message-status-update', update) 
            this.chatUpdatedMessage (update.ids, update.type as number, chat)
        }
        this.registerCallback('Msg', func)
        this.registerCallback('MsgInfo', func)
    }
    protected registerOnUnreadMessage() {
        this.registerCallback(['action', 'add:relay', 'message'], json => {
            const message = json[2][0][2] as WAMessage
            this.chatAddMessageAppropriate (message)
        })
    }
    /** Set the callback for presence updates; if someone goes offline/online, this callback will be fired */
    protected registerOnPresenceUpdate() {
        this.registerCallback('Presence', json => this.emit('user-presence-update', json[1] as PresenceUpdate))
    }
    /** inserts an empty chat into the DB */
    protected async chatAdd (jid: string, name?: string) {
        const chat: WAChat = {
            jid: jid,
            t: unixTimestampSeconds(),
            messages: [],
            count: 0,
            modify_tag: '',
            spam: 'false',
            name
        }
        this.chats.insert (chat)

        await this.setProfilePicture (chat)
        this.emit ('chat-new', chat)
        return chat
    }
    /** find a chat or return an error */
    protected assertChatGet = jid => {
        const chat = this.chats.get (jid)
        if (!chat) throw new Error (`chat '${jid}' not found`)
        return chat
    }
    /** Adds the given message to the appropriate chat, if the chat doesn't exist, it is created */
    protected async chatAddMessageAppropriate (message: WAMessage) {
        const jid = whatsappID (message.key.remoteJid)
        const chat = this.chats.get(jid) || await this.chatAdd (jid)
        this.chatAddMessage (message, chat)
    }
    protected chatAddMessage (message: WAMessage, chat: WAChat) {
        // add to count if the message isn't from me & there exists a message
        if (!message.key.fromMe && message.message) chat.count += 1

        const protocolMessage = message.message?.protocolMessage
        
        // if it's a message to delete another message
        if (protocolMessage) {
            switch (protocolMessage.type) {
                case WAMessageProto.ProtocolMessage.PROTOCOL_MESSAGE_TYPE.REVOKE:
                    const found = chat.messages.find(m => m.key.id === protocolMessage.key.id)
                    if (found && found.message) {
                        
                        this.log ('deleting message: ' + protocolMessage.key.id + ' in chat: ' + protocolMessage.key.remoteJid, MessageLogLevel.info)
                        
                        found.messageStubType = WA_MESSAGE_STUB_TYPE.REVOKE
                        found.message = null
                        
                        this.emit ('message-update', found)
                    }
                    break
                default:
                    break
            }
        } else if (!chat.messages.find(m => m.key.id === message.key.id)) {
           // this.log ('adding new message from ' + chat.jid)
            chat.messages.push(message)
            chat.messages = chat.messages.slice (-5) // only keep the last 5 messages
            
            // only update if it's an actual message
            if (message.message) this.chatUpdateTime (chat)
            
            this.emit ('message-new', message)

            // check if the message is an action 
            if (message.messageStubType) {
                const jid = chat.jid
                let actor = whatsappID (message.participant)
                let participants: string[]
                switch (message.messageStubType) {
                    case WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_LEAVE:
                    case WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_REMOVE:
                        participants = message.messageStubParameters.map (whatsappID)
                        this.emit ('group-participants-remove', { jid, actor, participants})
                        
                        // mark the chat read only if you left the group
                        if (participants.includes(this.user.jid)) {
                            chat.read_only = 'true'
                            this.emit ('chat-update', { jid, read_only: chat.read_only })
                        }
                        break
                    case WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_ADD:
                    case WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_INVITE:
                        participants = message.messageStubParameters.map (whatsappID)
                        this.emit ('group-participants-add', { jid, participants, actor })
                        break
                    case WA_MESSAGE_STUB_TYPE.GROUP_CHANGE_ANNOUNCE:
                        const announce = message.messageStubParameters[0] === 'on' ? 'true' : 'false'
                        this.emit ('group-settings-update', { jid, announce, actor })
                        break
                    case WA_MESSAGE_STUB_TYPE.GROUP_CHANGE_ANNOUNCE:
                        const restrict = message.messageStubParameters[0] === 'on' ? 'true' : 'false'
                        this.emit ('group-settings-update', { jid, restrict, actor })
                        break
                    case WA_MESSAGE_STUB_TYPE.GROUP_CHANGE_DESCRIPTION:
                        this.emit ('group-description-update', { jid, actor })
                        break
                    case WA_MESSAGE_STUB_TYPE.GROUP_CHANGE_SUBJECT:
                    case WA_MESSAGE_STUB_TYPE.GROUP_CREATE:
                        chat.name = message.messageStubParameters[0]
                        this.emit ('chat-update', { jid, name: chat.name })
                        break 
                }
            }
        }
    }
    protected chatUpdatedMessage (messageIDs: string[], status: number, chat: WAChat) {
        for (let msg of chat.messages) {
            if (messageIDs.includes(msg.key.id)) {
                if (isGroupID(chat.jid)) msg.status = WA_MESSAGE_STATUS_TYPE.SERVER_ACK
                else msg.status = status
            }
        }
    }
    protected chatUpdateTime = chat => this.chats.updateKey (chat, c => c.t = unixTimestampSeconds())
    /** sets the profile picture of a chat */
    protected async setProfilePicture (chat: WAChat) {
        chat.imgUrl = await this.getProfilePicture (chat.jid).catch (err => '')
    }

    // Add all event types

    /** when the connection has opened successfully */
    on (event: 'open', listener: () => void): this
    /** when the connection is opening */
    on (event: 'connecting', listener: () => void): this
    /** when the connection has closed */
    on (event: 'close', listener: (err: {reason?: DisconnectReason | string, isReconnecting: boolean}) => void): this
    /** when a new QR is generated, ready for scanning */
    on (event: 'qr', listener: (qr: string) => void): this
    /** when the connection to the phone changes */
    on (event: 'connection-phone-change', listener: (state: {connected: boolean}) => void): this
    /** when a user's presence is updated */
    on (event: 'user-presence-update', listener: (update: PresenceUpdate) => void): this
    /** when a user's status is updated */
    on (event: 'user-status-update', listener: (update: {jid: string, status?: string}) => void): this
    /** when a user receives contacts */
    on (event: 'contacts-received', listener: (contacts: {[k: string]: WAContact}) => void): this
    /** when a new chat is added */
    on (event: 'chat-new', listener: (chat: WAChat) => void): this
    /** when a chat is updated (archived, deleted, pinned) */
    on (event: 'chat-update', listener: (chat: Partial<WAChat> & { jid: string }) => void): this
    /** when a new message is relayed */
    on (event: 'message-new', listener: (message: WAMessage) => void): this
    /** when a message object itself is updated (receives its media info or is deleted) */
    on (event: 'message-update', listener: (message: WAMessage) => void): this
    /** when a message's status is updated (deleted, delivered, read, sent etc.) */
    on (event: 'message-status-update', listener: (message: WAMessageStatusUpdate) => void): this
    /** when participants are added to a group */
    on (event: 'group-participants-add', listener: (update: {jid: string, participants: string[], actor?: string}) => void): this
    /** when participants are removed or leave from a group */
    on (event: 'group-participants-remove', listener: (update: {jid: string, participants: string[], actor?: string}) => void): this
    /** when participants are promoted in a group */
    on (event: 'group-participants-promote', listener: (update: {jid: string, participants: string[], actor?: string}) => void): this
    /** when participants are demoted in a group */
    on (event: 'group-participants-demote', listener: (update: {jid: string, participants: string[], actor?: string}) => void): this
    /** when the group settings is updated */
    on (event: 'group-settings-update', listener: (update: {jid: string, restrict?: string, announce?: string, actor?: string}) => void): this
    /** when the group description is updated */
    on (event: 'group-description-update', listener: (update: {jid: string, description?: string, actor?: string}) => void): this

    on (event: BaileysEvent, listener: (...args: any[]) => void) { return super.on (event, listener) }
    emit (event: BaileysEvent, ...args: any[]) { return super.emit (event, ...args) }
}
