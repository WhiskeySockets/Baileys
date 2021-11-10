import * as QR from 'qrcode-terminal'
import { WAConnection as Base } from './3.Connect'
import { WAMessage, WAContact, WAChat, WAMessageProto, WA_MESSAGE_STUB_TYPE, WA_MESSAGE_STATUS_TYPE, PresenceUpdate, BaileysEvent, DisconnectReason, WAOpenResult, Presence, WAParticipantAction, WAGroupMetadata, WANode, WAPresenceData, WAChatUpdate, BlocklistUpdate, WAContactUpdate, WAMetric, WAFlag } from './Constants'
import { whatsappID, unixTimestampSeconds, GET_MESSAGE_ID, WA_MESSAGE_ID, newMessagesDB, shallowChanges, toNumber, isGroupID } from './Utils'
import KeyedDB from '@adiwajshing/keyed-db'
import { Mutex } from './Mutex'

export class WAConnection extends Base {

    constructor () {
        super ()
        this.setMaxListeners (30)
        this.chatsDebounceTimeout.setTask(() => {
            this.logger.debug('pinging with chats query')
            this.sendChatsQuery(this.msgCount)

            this.chatsDebounceTimeout.start()
        })
        this.on('open', () => {
            // send queries WA Web expects
            this.sendBinary (['query', {type: 'contacts', epoch: '1'}, null], [ WAMetric.queryContact, WAFlag.ignore ])
            this.sendBinary (['query', {type: 'status', epoch: '1'}, null], [ WAMetric.queryStatus, WAFlag.ignore ])
            this.sendBinary (['query', {type: 'quick_reply', epoch: '1'}, null], [ WAMetric.queryQuickReply, WAFlag.ignore ])
            this.sendBinary (['query', {type: 'label', epoch: '1'}, null], [ WAMetric.queryLabel, WAFlag.ignore ])
            this.sendBinary (['query', {type: 'emoji', epoch: '1'}, null], [ WAMetric.queryEmoji, WAFlag.ignore ])
            this.sendBinary (['action', {type: 'set', epoch: '1'}, [['presence', {type: Presence.available}, null]] ], [ WAMetric.presence, WAFlag.available ])
            
            if(this.connectOptions.queryChatsTillReceived) {
                this.chatsDebounceTimeout.start()
            } else {
                this.sendChatsQuery(1)
            }

            this.logger.debug('sent init queries')
        })
        // on disconnects
        this.on('CB:Cmd,type:disconnect', json => (
            this.state === 'open' && this.unexpectedDisconnect(json[1].kind || 'unknown')
        ))
        this.on('CB:Pong', json => {
            if (!json[1]) {
                this.unexpectedDisconnect(DisconnectReason.close)
                this.logger.info('Connection terminated by phone, closing...')
            } else if (this.phoneConnected !== json[1]) {
                this.phoneConnected = json[1]
                this.emit ('connection-phone-change', { connected: this.phoneConnected })
            }
        })
        // chats received
        this.on('CB:response,type:chat', json => {
            if (json[1].duplicate || !json[2]) return
            
            this.chatsDebounceTimeout.cancel()
            const chats = new KeyedDB(this.chatOrderingKey, c => c.jid)

            json[2].forEach(([item, chat]: [any, WAChat]) => {
                if (!chat) {
                    this.logger.warn (`unexpectedly got null chat: ${item}`, chat)
                    return
                }
                chat.jid = whatsappID (chat.jid)
                chat.t = +chat.t
                chat.count = +chat.count
                chat.messages = newMessagesDB()
                // chats data (log json to see what it looks like)
                chats.insertIfAbsent(chat) 
            })
            this.logger.info (`received ${json[2].length} chats`)

            const oldChats = this.chats
            const updatedChats = []
            let hasNewChats = false

            chats.all().forEach (chat => {
                const respectiveContact = this.contacts[chat.jid]
                chat.name = respectiveContact?.name || respectiveContact?.notify || chat.name
                
                const oldChat = oldChats.get(chat.jid)
                if (!oldChat) {
                    hasNewChats = true
                } else {
                    chat.messages = oldChat.messages
                    if (oldChat.t !== chat.t || oldChat.modify_tag !== chat.modify_tag) {
                        const changes = shallowChanges (oldChat, chat, { lookForDeletedKeys: true })
                        delete chat.metadata // remove group metadata as that may have changed; TODO, write better mechanism for this
                        delete changes.messages

                        updatedChats.push({ ...changes, jid: chat.jid })
                    }
                }
            })
            this.chats = chats 
            this.lastChatsReceived = new Date()

            updatedChats.length > 0 && this.emit('chats-update', updatedChats)

            this.emit('chats-received', { hasNewChats })
        })
        // we store these last messages
        const lastMessages = {}
        // keep track of overlaps, 
        // if there are no overlaps of messages and we had messages present, we clear the previous messages
        // this prevents missing messages in conversations
        let overlaps: { [_: string]: { requiresOverlap: boolean, didOverlap?: boolean } } = {}
        const onLastBatchOfDataReceived = () => {
            // find which chats had missing messages
            // list out all the jids, and how many messages we've cached now
            const chatsWithMissingMessages = Object.keys(overlaps).map(jid => {
                // if there was no overlap, delete previous messages
                if (!overlaps[jid].didOverlap && overlaps[jid].requiresOverlap) {
                    this.logger.debug(`received messages for ${jid}, but did not overlap with previous messages, clearing...`)
                    const chat = this.chats.get(jid)
                    if (chat) {
                        const message = chat.messages.get(lastMessages[jid])
                        const remainingMessages = chat.messages.paginatedByValue(message, this.maxCachedMessages, undefined, 'after')
                        chat.messages = newMessagesDB([message, ...remainingMessages])
                        return { jid, count: chat.messages.length } // return number of messages we've left
                    }
                }
            }).filter(Boolean)
            this.emit('initial-data-received', { chatsWithMissingMessages })
        }
        // messages received
        const messagesUpdate = (json, style: 'previous' | 'last') => {
            //console.log('msg ', json[1])
            this.messagesDebounceTimeout.start(undefined, onLastBatchOfDataReceived)
            if (style === 'last') {
                overlaps = {}
            }
            const messages = json[2] as WANode[]
            if (messages) {
                const updates: { [k: string]: KeyedDB<WAMessage, string> } = {}
                messages.reverse().forEach (([,, message]: ['message', null, WAMessage]) => {
                    const jid = message.key.remoteJid
                    const chat = this.chats.get(jid)
                    
                    const mKeyID = WA_MESSAGE_ID(message)
                    if (chat) {
                        if (style === 'previous') {
                            const fm = chat.messages.get(lastMessages[jid])
                            if (!fm) return
                            const prevEpoch = fm['epoch']
                            message['epoch'] = prevEpoch-1
                        } else if (style === 'last') {
                            // no overlap required, if there were no previous messages
                            overlaps[jid] = { requiresOverlap: chat.messages.length > 0 }
                            
                            const lm = chat.messages.all()[chat.messages.length-1]
                            const prevEpoch = (lm && lm['epoch']) || 0
                            // hacky way to allow more previous messages
                            message['epoch'] = prevEpoch+1000 
                        }
                        if (chat.messages.upsert(message).length > 0) {
                            overlaps[jid] = { ...(overlaps[jid] || { requiresOverlap: true }), didOverlap: true }
                        }                        
                        updates[jid] = updates[jid] || newMessagesDB()
                        updates[jid].upsert(message)

                        lastMessages[jid] = mKeyID
                    } else if (!chat) this.logger.debug({ jid }, `chat not found`)
                })
                if (Object.keys(updates).length > 0) {
                    this.emit ('chats-update', 
                        Object.keys(updates).map(jid => ({ jid, messages: updates[jid] }))
                    )
                }
            }
        }
        this.on('CB:action,add:last', json =>  messagesUpdate(json, 'last'))
        this.on('CB:action,add:before', json => messagesUpdate(json, 'previous'))
        this.on('CB:action,add:unread', json => messagesUpdate(json, 'previous'))

        // contacts received
        this.on('CB:response,type:contacts', json => {
            if (json[1].duplicate || !json[2]) return
            const contacts = this.contacts
            const updatedContacts: WAContact[] = []
            
            json[2].forEach(([type, contact]: ['user', WAContact]) => {
                if (!contact) return this.logger.info (`unexpectedly got null contact: ${type}`, contact)
                
                contact.jid = whatsappID (contact.jid)
                const presentContact = contacts[contact.jid]
                if (presentContact) {
                    const changes = shallowChanges(presentContact, contact, { lookForDeletedKeys: false })
                    if (changes && Object.keys(changes).length > 0) {
                        updatedContacts.push({ ...changes, jid: contact.jid })
                    }
                } else updatedContacts.push(contact)

                contacts[contact.jid] = { ...(presentContact || {}), ...contact }
            })
            // update chat names
            const updatedChats = []
            this.chats.all().forEach(c => {
                const contact = contacts[c.jid]
                if (contact) {
                    const name = contact?.name || contact?.notify || c.name
                    if (name !== c.name) {
                        updatedChats.push({ jid: c.jid, name })
                    }
                }
            })
            updatedChats.length > 0 && this.emit('chats-update', updatedChats)

            this.logger.info (`received ${json[2].length} contacts`)
            this.contacts = contacts

            this.emit('contacts-received', { updatedContacts })
        })
        // new messages
        this.on('CB:action,add:relay,message', json => {
            const message = json[2][0][2] as WAMessage
            this.chatAddMessageAppropriate (message)
        })
        this.on('CB:Chat,cmd:action', json => {
            const data = json[1].data
            if (data) {
                const emitGroupParticipantsUpdate = (action: WAParticipantAction) => this.emitParticipantsUpdate
                (json[1].id, data[2].participants.map(whatsappID), action)
                const emitGroupUpdate = (data: Partial<WAGroupMetadata>) => this.emitGroupUpdate(json[1].id, data)

                switch (data[0]) {
                    case "promote":
                        emitGroupParticipantsUpdate('promote')
                        break
                    case "demote":
                        emitGroupParticipantsUpdate('demote')
                        break
                    case "desc_add":
                        emitGroupUpdate({ ...data[2], descOwner: data[1] })
                        break
                    default:
                        this.logger.debug({ unhandled: true }, json)
                        break
                }
            }
        })
        // presence updates
        this.on('CB:Presence', json => {
            const chatUpdate = this.applyingPresenceUpdate(json[1])
            chatUpdate && this.emit('chat-update', chatUpdate)
        })
        // If a message has been updated (usually called when a video message gets its upload url, or live locations)
        this.on ('CB:action,add:update,message', json => {
            const message: WAMessage = json[2][0][2]
            const jid = whatsappID(message.key.remoteJid)
            const chat = this.chats.get(jid)
            if (!chat) return
            // reinsert to update
            const oldMessage = chat.messages.get (WA_MESSAGE_ID(message))
            if (oldMessage) {
                message['epoch'] = oldMessage['epoch']
                if (chat.messages.upsert(message).length) {
                    const chatUpdate: Partial<WAChat> = { jid, messages: newMessagesDB([ message ]) }
                    this.emit ('chat-update', chatUpdate)
                }
            } else {
                this.logger.debug ({ unhandled: true }, 'received message update for non-present message from ' + jid)
            }
        })
        // message status updates
        const onMessageStatusUpdate = json => {
            json = json[2][0][1]
            const MAP = {
                read: WA_MESSAGE_STATUS_TYPE.READ,
                message: WA_MESSAGE_STATUS_TYPE.DELIVERY_ACK,
                error: WA_MESSAGE_STATUS_TYPE.ERROR
            }
            this.onMessageStatusUpdate(
                whatsappID(json.jid),
                { id: json.index, fromMe: json.owner === 'true' },
                MAP[json.type]
            )
        }
        this.on('CB:action,add:relay,received', onMessageStatusUpdate)
        this.on('CB:action,,received', onMessageStatusUpdate)

        this.on('CB:Msg,cmd:ack', json => (
            this.onMessageStatusUpdate(
                whatsappID(json[1].to),
                { id: json[1].id, fromMe: true },
                +json[1].ack + 1
            )
        ))

        // If a user's contact has changed
        this.on ('CB:action,,user', json => {
            const node = json[2][0]
            if (node) {
                const user = node[1] as WAContact
                user.jid = whatsappID(user.jid)
                
                this.contacts[user.jid] = user
                this.emit('contact-update', user)
                
                const chat = this.chats.get (user.jid)
                if (chat) {
                    chat.name = user.name || user.notify || chat.name
                    this.emit ('chat-update', { jid: chat.jid, name: chat.name })
                }
            }
        })
        // chat archive, pin etc.
        this.on('CB:action,,chat', json => {
            json = json[2][0]

            const updateType = json[1].type
            const jid = whatsappID(json[1]?.jid)
            
            const chat = this.chats.get(jid)
            if (!chat) return

            const FUNCTIONS = {
                'delete': () => {
                    chat['delete'] = 'true'
                    this.chats.deleteById(chat.jid)
                    return 'delete'
                },
                'clear': () => {
                    if (!json[2]) chat.messages.clear ()
                    else json[2].forEach(item => chat.messages.filter(m => m.key.id !== item[1].index))
                    return 'clear'
                },
                'archive': () => {
                    this.chats.update(chat.jid, chat => chat.archive = 'true')
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
                this.emit ('chat-update', { jid, [property]: chat[property] || 'false' })
            }            
        })
        // profile picture updates
        this.on('CB:Cmd,type:picture', async json => {
            json = json[1]
            const jid = whatsappID(json.jid)
            const imgUrl = await this.getProfilePicture(jid).catch(() => '')
            const contact = this.contacts[jid]
            if (contact) {
                contact.imgUrl = imgUrl
                this.emit('contact-update', { jid, imgUrl })
            }
            const chat = this.chats.get(jid)
            if (chat) {
                chat.imgUrl = imgUrl
                this.emit ('chat-update', { jid, imgUrl })
            }
        })
        // status updates
        this.on('CB:Status,status', async json => {
            const jid = whatsappID(json[1].id)
            this.emit ('contact-update', { jid, status: json[1].status })
        })
        // User Profile Name Updates
        this.on ('CB:Conn,pushname', json => {
            if (this.user) {
                const name = json[1].pushname
                if(this.user.name !== name) {
                    this.user.name = name // update on client too
                    this.emit ('contact-update', { jid: this.user.jid, name })
                }   
            }
        })
        // read updates
        this.on ('CB:action,,read', async json => {
            const update = json[2][0][1]
            const jid = whatsappID(update.jid)
            const chat = this.chats.get (jid)
            if(chat) {
                if (update.type === 'false') chat.count = -1
                else chat.count = 0
    
                this.emit ('chat-update', { jid: chat.jid, count: chat.count })
            } else {
                this.logger.warn('recieved read update for unknown chat ' + jid)
            }
        })      
        this.on('qr', qr => {
			if (this.connectOptions.logQR) {
			QR.generate(qr, { small: true })
			}
		});

        // blocklist updates
        this.on('CB:Blocklist', json => {
            json = json[1]
            const initial = this.blocklist
            this.blocklist = json.blocklist

            const added = this.blocklist.filter(id => !initial.includes(id))
            const removed = initial.filter(id => !this.blocklist.includes(id))

            const update: BlocklistUpdate = { added, removed }

            this.emit('blocklist-update', update)
        })
    }
    protected sendChatsQuery(epoch: number) {
        return this.sendBinary(['query', {type: 'chat', epoch: epoch.toString()}, null], [ WAMetric.queryChat, WAFlag.ignore ])
    }
    /** Get the URL to download the profile picture of a person/group */
    @Mutex (jid => jid)
    async getProfilePicture(jid: string | null) {
        const response = await this.query({ 
            json: ['query', 'ProfilePicThumb', jid || this.user.jid], 
            expect200: true, 
            requiresPhoneConnection: false 
        })
        return response.eurl as string
    }
    protected applyingPresenceUpdate(update: PresenceUpdate) {
        const chatId = whatsappID(update.id)
        const jid = whatsappID(update.participant || update.id)
        
        const chat = this.chats.get(chatId)
        if (chat && jid.endsWith('@s.whatsapp.net')) { // if its a single chat
            chat.presences = chat.presences || {}
            
            const presence = { ...(chat.presences[jid] || {}) } as WAPresenceData 
            
            if (update.t) presence.lastSeen = +update.t
            else if (update.type === Presence.unavailable && (presence.lastKnownPresence === Presence.available || presence.lastKnownPresence === Presence.composing)) {
                presence.lastSeen = unixTimestampSeconds()
            }
            presence.lastKnownPresence = update.type
            // no update
            if(presence.lastKnownPresence === chat.presences[jid]?.lastKnownPresence && presence.lastSeen === chat.presences[jid]?.lastSeen) {
                return
            }

            const contact = this.contacts[jid]
            if (contact) {
                presence.name = contact.name || contact.notify || contact.vname
            }
            
            chat.presences[jid] = presence
            return { jid: chatId, presences: { [jid]: presence } } as Partial<WAChat>
        }
    }
    /** inserts an empty chat into the DB */
    protected chatAdd (jid: string, name?: string, properties: Partial<WAChat> = {}) {        
        const chat: WAChat = {
            jid,
            name,
            t: unixTimestampSeconds(),
            messages: newMessagesDB(),
            count: 0,
            ...(properties || {})
        }
        if(this.chats.insertIfAbsent(chat).length) {
            this.emit('chat-new', chat)
            return chat
        }   
    }
    protected onMessageStatusUpdate(jid: string, key: { id: string, fromMe: boolean }, status: WA_MESSAGE_STATUS_TYPE) {
        const chat = this.chats.get( whatsappID(jid) )
        const msg = chat?.messages.get(GET_MESSAGE_ID(key))
        if (msg) {
            if (typeof status !== 'undefined') {
                if (status > msg.status || status === WA_MESSAGE_STATUS_TYPE.ERROR) {
                    msg.status = status
                    this.emit('chat-update', { jid: chat.jid, messages: newMessagesDB([ msg ]) })
                }
            } else {
                this.logger.warn({ update: status }, 'received unknown message status update')
            }
        } else {
            this.logger.debug ({ unhandled: true, update: status, key }, 'received message status update for non-present message')
        }
    }
    protected contactAddOrGet (jid: string) {
        jid = whatsappID(jid)
        if (!this.contacts[jid]) this.contacts[jid] = { jid }
        return this.contacts[jid]
    }
    /** find a chat or return an error */
    protected assertChatGet = jid => {
        const chat = this.chats.get (jid)
        if (!chat) throw new Error (`chat '${jid}' not found`)
        return chat
    }
    /** Adds the given message to the appropriate chat, if the chat doesn't exist, it is created */
    protected async chatAddMessageAppropriate (message: WAMessage) {
        const jid = whatsappID(message.key.remoteJid)
        const chat = this.chats.get(jid) || await this.chatAdd (jid)
        this.chatAddMessage (message, chat)
    }
    protected chatAddMessage (message: WAMessage, chat: WAChat) {
        // store updates in this
        const chatUpdate: WAChatUpdate = { jid: chat.jid }
        // add to count if the message isn't from me & there exists a message
        if (!message.key.fromMe && message.message) {
            chat.count += 1
            chatUpdate.count = chat.count

            const participant = whatsappID(message.participant || chat.jid)
            const contact = chat.presences && chat.presences[participant]
            if (contact?.lastKnownPresence === Presence.composing) { // update presence
                const update = this.applyingPresenceUpdate({ id: chat.jid, participant, type: Presence.available })
                update && Object.assign(chatUpdate, update)
            }
        }
        
        const ephemeralProtocolMsg = message.message?.ephemeralMessage?.message?.protocolMessage
        if (
            ephemeralProtocolMsg && 
            ephemeralProtocolMsg.type === WAMessageProto.ProtocolMessage.ProtocolMessageType.EPHEMERAL_SETTING
        ) {
            chatUpdate.eph_setting_ts = message.messageTimestamp.toString()
            chatUpdate.ephemeral = ephemeralProtocolMsg.ephemeralExpiration.toString()
            
            if (ephemeralProtocolMsg.ephemeralExpiration) {
                chat.eph_setting_ts = chatUpdate.eph_setting_ts
                chat.ephemeral = chatUpdate.ephemeral
            } else {
                delete chat.eph_setting_ts
                delete chat.ephemeral
            }
        }

        const messages = chat.messages
        const protocolMessage = message.message?.protocolMessage
        // if it's a message to delete another message
        if (protocolMessage) {
            switch (protocolMessage.type) {
                case WAMessageProto.ProtocolMessage.ProtocolMessageType.REVOKE:
                    const found = chat.messages.get (GET_MESSAGE_ID(protocolMessage.key))
                    if (found?.message) {
                        this.logger.info ('deleting message: ' + protocolMessage.key.id + ' in chat: ' + protocolMessage.key.remoteJid)
                        
                        found.messageStubType = WA_MESSAGE_STUB_TYPE.REVOKE
                        delete found.message
                        chatUpdate.messages = newMessagesDB([ found ])
                    }
                    break
                default:
                    break
            }
        } else if (!messages.get(WA_MESSAGE_ID(message))) { // if the message is not already there

            const lastEpoch = (messages.last && messages.last['epoch']) || 0
            message['epoch'] = lastEpoch+1

            messages.insert (message)
            while (messages.length > this.maxCachedMessages) {
                messages.delete (messages.all()[0]) // delete oldest messages
            }            
            // only update if it's an actual message
            if (message.message && !ephemeralProtocolMsg) {
                this.chats.update(chat.jid, chat => {
                    chat.t = +toNumber(message.messageTimestamp)
                    chatUpdate.t = chat.t
                    // a new message unarchives the chat
                    if (chat.archive) {
                        delete chat.archive
                        chatUpdate.archive = 'false'
                    }
                })
            }
            chatUpdate.hasNewMessage = true
            chatUpdate.messages = newMessagesDB([ message ])
            // check if the message is an action 
            if (message.messageStubType) {
                const jid = chat.jid
                //let actor = whatsappID (message.participant)
                let participants: string[]
                const emitParticipantsUpdate = (action: WAParticipantAction) => (
                    this.emitParticipantsUpdate(jid, participants, action)
                )
                const emitGroupUpdate = (update: Partial<WAGroupMetadata>) => this.emitGroupUpdate(jid, update)
                
                switch (message.messageStubType) {
                    case WA_MESSAGE_STUB_TYPE.CHANGE_EPHEMERAL_SETTING:
                        chatUpdate.eph_setting_ts = message.messageTimestamp.toString()
                        chatUpdate.ephemeral = message.messageStubParameters[0]
                        
                        if (+chatUpdate.ephemeral) {
                            chat.eph_setting_ts = chatUpdate.eph_setting_ts
                            chat.ephemeral = chatUpdate.ephemeral
                        } else {
                            delete chat.eph_setting_ts
                            delete chat.ephemeral
                        }
                        break
                    case WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_LEAVE:
                    case WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_REMOVE:
                        participants = message.messageStubParameters.map (whatsappID)
                        emitParticipantsUpdate('remove')
                        // mark the chat read only if you left the group
                        if (participants.includes(this.user.jid)) {
                            chat.read_only = 'true'
                            chatUpdate.read_only = 'true'
                        }
                        break
                    case WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_ADD:
                    case WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_INVITE:
                    case WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
                        participants = message.messageStubParameters.map (whatsappID)
                        if (participants.includes(this.user.jid) && chat.read_only === 'true') {
                            delete chat.read_only
                            chatUpdate.read_only = 'false'
                        }
                        emitParticipantsUpdate('add')
                        break
                    case WA_MESSAGE_STUB_TYPE.GROUP_CHANGE_ANNOUNCE:
                        const announce = message.messageStubParameters[0] === 'on' ? 'true' : 'false'
                        emitGroupUpdate({ announce })
                        break
                    case WA_MESSAGE_STUB_TYPE.GROUP_CHANGE_RESTRICT:
                        const restrict = message.messageStubParameters[0] === 'on' ? 'true' : 'false'
                        emitGroupUpdate({ restrict })
                        break
                    case WA_MESSAGE_STUB_TYPE.GROUP_CHANGE_SUBJECT:
                    case WA_MESSAGE_STUB_TYPE.GROUP_CREATE:
                        chat.name = message.messageStubParameters[0]
                        chatUpdate.name = chat.name
                        if (chat.metadata) chat.metadata.subject = chat.name
                        break
                }
            }
        }

        this.emit('chat-update', chatUpdate)
    }
    protected emitParticipantsUpdate = (jid: string, participants: string[], action: WAParticipantAction) => {
        const chat = this.chats.get(jid)
        const meta = chat?.metadata
        if (meta) {
            switch (action) {
                case 'add':
                    participants.forEach(jid => (
                        meta.participants.push({ ...this.contactAddOrGet(jid), isAdmin: false, isSuperAdmin: false })
                    ))
                    break
                case 'remove':
                    meta.participants = meta.participants.filter(p => !participants.includes(p.jid))
                    break
                case 'promote':
                case 'demote':
                    const isAdmin = action==='promote'
                    meta.participants.forEach(p => {
                        if (participants.includes( p.jid )) p.isAdmin = isAdmin
                    })
                    break
            }
        }
        this.emit ('group-participants-update', { jid, participants, action })
    }
    protected emitGroupUpdate = (jid: string, update: Partial<WAGroupMetadata>) => {
        const chat = this.chats.get(jid)
        if (chat && chat.metadata) Object.assign(chat.metadata, update)
        this.emit ('group-update', { jid, ...update })
    }
    protected chatUpdateTime = (chat, stamp: number) => this.chats.update (chat.jid, c => c.t = stamp)
    /** sets the profile picture of a chat */
    protected async setProfilePicture (chat: WAChat) {
        chat.imgUrl = await this.getProfilePicture (chat.jid).catch (err => '')
    }

    // Add all event types

    /** when the connection has opened successfully */
    on (event: 'open', listener: (result: WAOpenResult) => void): this
    /** when the connection is opening */
    on (event: 'connecting', listener: () => void): this
    /** when the connection has closed */
    on (event: 'close', listener: (err: {reason?: DisconnectReason | string, isReconnecting: boolean}) => void): this
    /** when the socket is closed */
    on (event: 'ws-close', listener: (err: {reason?: DisconnectReason | string}) => void): this
    /** when a new QR is generated, ready for scanning */
    on (event: 'qr', listener: (qr: string) => void): this
    /** when the connection to the phone changes */
    on (event: 'connection-phone-change', listener: (state: {connected: boolean}) => void): this
    /** when a contact is updated */
    on (event: 'contact-update', listener: (update: WAContactUpdate) => void): this
    /** when a new chat is added */
    on (event: 'chat-new', listener: (chat: WAChat) => void): this
    /** when contacts are sent by WA */
    on (event: 'contacts-received', listener: (u: { updatedContacts: Partial<WAContact>[] }) => void): this
    /** when chats are sent by WA, and when all messages are received */
    on (event: 'chats-received', listener: (update: {hasNewChats?: boolean}) => void): this
    /** when all initial messages are received from WA */
    on (event: 'initial-data-received', listener: (update: {chatsWithMissingMessages: { jid: string, count: number }[] }) => void): this
    /** when multiple chats are updated (new message, updated message, deleted, pinned, etc) */
    on (event: 'chats-update', listener: (chats: WAChatUpdate[]) => void): this
    /** when a chat is updated (new message, updated message, read message, deleted, pinned, presence updated etc) */
    on (event: 'chat-update', listener: (chat: WAChatUpdate) => void): this
    /** when participants are added to a group */
    on (event: 'group-participants-update', listener: (update: {jid: string, participants: string[], actor?: string, action: WAParticipantAction}) => void): this
    /** when the group is updated */
    on (event: 'group-update', listener: (update: Partial<WAGroupMetadata> & {jid: string, actor?: string}) => void): this
    /** when WA sends back a pong */
    on (event: 'received-pong', listener: () => void): this
    /** when a user is blocked or unblockd */
    on (event: 'blocklist-update', listener: (update: BlocklistUpdate) => void): this

    on (event: BaileysEvent | string, listener: (json: any) => void): this

    on (event: BaileysEvent | string, listener: (...args: any[]) => void) { return super.on (event, listener) }
    emit (event: BaileysEvent | string, ...args: any[]) { return super.emit (event, ...args) }
}
