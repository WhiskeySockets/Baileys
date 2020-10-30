import * as Utils from './Utils'
import { WAMessage, WAChat, WANode, KEEP_ALIVE_INTERVAL_MS, BaileysError, WAConnectOptions, DisconnectReason, UNAUTHORIZED_CODES, WAContact, TimedOutError, CancelledError, WAOpenResult, DEFAULT_ORIGIN, WS_URL } from './Constants'
import {WAConnection as Base} from './1.Validation'
import Decoder from '../Binary/Decoder'
import WS from 'ws'
import KeyedDB from '@adiwajshing/keyed-db'

const DEF_CALLBACK_PREFIX = 'CB:'
const DEF_TAG_PREFIX = 'TAG:'

export class WAConnection extends Base {
    /** Connect to WhatsApp Web */
    async connect () {
        // if we're already connected, throw an error
        if (this.state !== 'close') throw new Error('cannot connect when state=' + this.state)
        
        const options = this.connectOptions
        const newConnection = !this.authInfo
        
        this.state = 'connecting'
        this.emit ('connecting')

        let tries = 0
        let lastConnect = this.lastDisconnectTime
        var updates
        while (this.state === 'connecting') {
            tries += 1
            try {
                const diff = lastConnect ? new Date().getTime()-lastConnect.getTime() : Infinity
                updates = await this.connectInternal (
                    options, 
                    diff > this.connectOptions.connectCooldownMs ? 0 : this.connectOptions.connectCooldownMs
                )
                this.phoneConnected = true
                this.state = 'open'
            } catch (error) {
                lastConnect = new Date()

                const loggedOut = error instanceof BaileysError && UNAUTHORIZED_CODES.includes(error.status)
                const willReconnect = !loggedOut && (tries < options?.maxRetries) && (this.state === 'connecting')
                const reason = loggedOut ? DisconnectReason.invalidSession : error.message

                this.logger.warn ({ error }, `connect attempt ${tries} failed${ willReconnect ? ', retrying...' : ''}`)

                if ((this.state as string) !== 'close' && !willReconnect) {
                    this.closeInternal (reason)
                }
                if (!willReconnect) throw error
            }
        }

        const updatedChats = !!this.lastDisconnectTime && updates
        const result: WAOpenResult = { user: this.user, newConnection, updatedChats }
        this.emit ('open', result)
        
        this.logger.info ('opened connection to WhatsApp Web')

        this.conn.on ('close', () => this.unexpectedDisconnect (DisconnectReason.close))

        return result
    }
    /** Meat of the connect logic */
    protected async connectInternal (options: WAConnectOptions, delayMs?: number) {
        const rejections: ((e?: Error) => void)[] = []
        const rejectAll = (e: Error) => rejections.forEach (r => r(e))
        // actual connect
        const connect = () => (
            new Promise((resolve, reject) => {
                rejections.push (reject)
                // determine whether reconnect should be used or not
                const shouldUseReconnect = (this.lastDisconnectReason === DisconnectReason.close || 
                                            this.lastDisconnectReason === DisconnectReason.lost) &&
                                            !this.connectOptions.alwaysUseTakeover
                const reconnectID = shouldUseReconnect && this.user.jid.replace ('@s.whatsapp.net', '@c.us')

                this.conn = new WS(WS_URL, null, { 
                    origin: DEFAULT_ORIGIN, 
                    timeout: this.connectOptions.maxIdleTimeMs, 
                    agent: options.agent,
                    headers: {
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Cache-Control': 'no-cache',
                        'Host': 'web.whatsapp.com',
                        'Pragma': 'no-cache',
                        'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
                    }
                })
                this.conn.addEventListener('message', ({data}) => this.onMessageRecieved(data as any))
                
                this.conn.on ('open', async () => {
                    this.logger.info(`connected to WhatsApp Web server, authenticating via ${reconnectID ? 'reconnect' : 'takeover'}`)
                    let waitForChats: Promise<{[k: string]: Partial<WAChat>}>
                    // add wait for chats promise if required
                    if (typeof options?.waitForChats === 'undefined' ? true : options?.waitForChats) {
                        const {waitForChats: wPromise, cancelChats} = this.receiveChatsAndContacts(this.connectOptions.waitOnlyForLastMessage)
                        waitForChats = wPromise
                        rejections.push (cancelChats)
                    }
                    try {
                        const [, result] = await Promise.all (
                            [ 
                                this.authenticate(reconnectID)
                                .then(() => this.startKeepAliveRequest()),
                                waitForChats || undefined
                            ]
                        )
                        this.conn
                            .removeAllListeners ('error')
                            .removeAllListeners ('close')
                        this.stopDebouncedTimeout ()
                        resolve (result)
                    } catch (error) {
                        reject (error)
                    }
                })
                this.conn.on('error', rejectAll)
                this.conn.on('close', () => rejectAll(new Error(DisconnectReason.close)))
            }) as Promise<void | { [k: string]: Partial<WAChat> }>
        )

        this.on ('ws-close', rejectAll)
        try {
            if (delayMs) {
                const {delay, cancel} = Utils.delayCancellable (delayMs)
                rejections.push (cancel)
                await delay
            }
            const result = await connect ()
            return result
        } catch (error) {
            this.endConnection ()
            throw error
        } finally {
            this.off ('ws-close', rejectAll)
        }
    }
    /**
     * Sets up callbacks to receive chats, contacts & messages.
     * Must be called immediately after connect
     */
    protected receiveChatsAndContacts(waitOnlyForLast: boolean) {
        const chats = new KeyedDB(this.chatOrderingKey, c => c.jid)
        const contacts = {}

        let receivedContacts = false
        let receivedMessages = false

        let resolveTask: () => void
        let rejectTask: (e: Error) => void
        const checkForResolution = () => receivedContacts && receivedMessages && resolveTask ()
        // wait for messages to load
        const messagesUpdate = json => {
            this.startDebouncedTimeout () // restart debounced timeout
            receivedMessages = true

            const isLast = json[1].last || waitOnlyForLast
            const messages = json[2] as WANode[]

            if (messages) {
                messages.reverse().forEach (([,, message]: ['message', null, WAMessage]) => {
                    const jid = message.key.remoteJid
                    const chat = chats.get(jid)
                    if (chat) {
                        const fm = chat.messages.all()[0]
                        
                        const prevEpoch = (fm && fm['epoch']) || 0
                       
                        message['epoch'] = prevEpoch-1
                        chat.messages.insert (message)
                    }
                })
            }
            // if received contacts before messages
            if (isLast && receivedContacts) checkForResolution ()
        }
        const chatUpdate = json => {
            if (json[1].duplicate || !json[2]) return
            this.startDebouncedTimeout () // restart debounced timeout

            json[2]
            .forEach(([item, chat]: [any, WAChat]) => {
                if (!chat) {
                    this.logger.warn (`unexpectedly got null chat: ${item}`, chat)
                    return
                }

                chat.jid = Utils.whatsappID (chat.jid)
                chat.t = +chat.t
                chat.count = +chat.count
                chat.messages = new KeyedDB (Utils.waMessageKey, Utils.WA_MESSAGE_ID)

                // chats data (log json to see what it looks like)
                !chats.get (chat.jid) && chats.insert (chat) 
            })
            
            this.logger.info (`received ${json[2].length} chats`)
            if (json[2].length === 0) {
                receivedMessages = true
                checkForResolution ()
            }
        }
        const contactsUpdate = json => {
            if (json[1].duplicate || !json[2]) return
            this.startDebouncedTimeout () // restart debounced timeout

            receivedContacts = true
            
            json[2].forEach(([type, contact]: ['user', WAContact]) => {
                if (!contact) return this.logger.info (`unexpectedly got null contact: ${type}`, contact)
                
                contact.jid = Utils.whatsappID (contact.jid)
                contacts[contact.jid] = contact
            })
            this.logger.info (`received ${json[2].length} contacts`)
            checkForResolution ()
        }
        const registerCallbacks = () => {
            // wait for actual messages to load, "last" is the most recent message, "before" contains prior messages
            this.on(DEF_CALLBACK_PREFIX + 'action,add:last', messagesUpdate)
            this.on(DEF_CALLBACK_PREFIX + 'action,add:before', messagesUpdate)
            this.on(DEF_CALLBACK_PREFIX + 'action,add:unread', messagesUpdate)
            // get chats
            this.on(DEF_CALLBACK_PREFIX + 'response,type:chat', chatUpdate)
            // get contacts
            this.on(DEF_CALLBACK_PREFIX + 'response,type:contacts', contactsUpdate)
        }
        const deregisterCallbacks = () => {
            this.off(DEF_CALLBACK_PREFIX + 'action,add:last', messagesUpdate)
            this.off(DEF_CALLBACK_PREFIX + 'action,add:before', messagesUpdate)
            this.off(DEF_CALLBACK_PREFIX + 'action,add:unread', messagesUpdate)
            this.off(DEF_CALLBACK_PREFIX + 'response,type:chat', chatUpdate)
            this.off(DEF_CALLBACK_PREFIX + 'response,type:contacts', contactsUpdate)
        }
        // wait for the chats & contacts to load
        const waitForChats = async () => {
            try {
                registerCallbacks ()

                await new Promise ((resolve, reject) => {
                    resolveTask = resolve
                    rejectTask = reject
                })

                const oldChats = this.chats
                const updatedChats: { [k: string]: Partial<WAChat> } = {}

                chats.all().forEach (chat => {
                    const respectiveContact = contacts[chat.jid]
                    chat.name = respectiveContact?.name || respectiveContact?.notify || chat.name
                    
                    const oldChat = oldChats.get(chat.jid)
                    if (!oldChat) {
                        updatedChats[chat.jid] = chat
                    } else if (oldChat.t < chat.t || oldChat.modify_tag !== chat.modify_tag) {
                        const changes = Utils.shallowChanges (oldChat, chat)
                        delete changes.messages
                        updatedChats[chat.jid] = changes
                    }
                })
                
                this.chats = chats 
                this.contacts = contacts

                return updatedChats
            } finally {
                deregisterCallbacks ()
            }
        }
        return { waitForChats: waitForChats (), cancelChats: () => rejectTask (CancelledError()) }
    }
    private onMessageRecieved(message: string | Buffer) {
        if (message[0] === '!') {
            // when the first character in the message is an '!', the server is updating the last seen
            const timestamp = message.slice(1, message.length).toString ('utf-8')
            this.lastSeen = new Date(parseInt(timestamp))
            this.emit ('received-pong')
        } else {
            let messageTag: string
            let json: any
            try {
                const dec = Utils.decryptWA (message, this.authInfo?.macKey, this.authInfo?.encKey, new Decoder())
                messageTag = dec[0]
                json = dec[1]
            } catch (error) {
                this.logger.error ({ error }, `encountered error in decrypting message, closing: ${error}`)
                
                if (this.state === 'open') this.unexpectedDisconnect (DisconnectReason.badSession)
                else this.emit ('ws-close', new Error(DisconnectReason.badSession))
            }

            if (this.shouldLogMessages) this.messageLog.push ({ tag: messageTag, json: JSON.stringify(json), fromMe: false })
            if (!json) return 

            if (this.logger.level === 'trace') {
                this.logger.trace(messageTag + ', ' + JSON.stringify(json))
            }

            let anyTriggered = false
            /* Check if this is a response to a message we sent */
            anyTriggered = this.emit (`${DEF_TAG_PREFIX}${messageTag}`, json)
            /* Check if this is a response to a message we are expecting */
            const l0 = json[0] || ''
            const l1 = typeof json[1] !== 'object' || json[1] === null ? {} : json[1]
            const l2 = ((json[2] || [])[0] || [])[0] || ''
            Object.keys(l1).forEach(key => {
                anyTriggered = anyTriggered || this.emit (`${DEF_CALLBACK_PREFIX}${l0},${key}:${l1[key]},${l2}`, json)
                anyTriggered = anyTriggered || this.emit (`${DEF_CALLBACK_PREFIX}${l0},${key}:${l1[key]}`, json)
            })
            anyTriggered = anyTriggered || this.emit (`${DEF_CALLBACK_PREFIX}${l0},,${l2}`, json)
            anyTriggered = anyTriggered || this.emit (`${DEF_CALLBACK_PREFIX}${l0}`, json)
            if (anyTriggered) return

            if (this.state === 'open' && json[0] === 'Pong') {
                if (this.phoneConnected !== json[1]) {
                    this.phoneConnected = json[1]
                    this.emit ('connection-phone-change', { connected: this.phoneConnected })
                    return
                }
            }
            if (this.logger.level === 'debug') {
                this.logger.debug({ unhandled: true }, messageTag + ',' + JSON.stringify(json))
            }
        }
    }
    /** Send a keep alive request every X seconds, server updates & responds with last seen */
    private startKeepAliveRequest() {
        this.keepAliveReq && clearInterval (this.keepAliveReq)

        this.keepAliveReq = setInterval(() => {
            if (!this.lastSeen) this.lastSeen = new Date ()
            const diff = new Date().getTime() - this.lastSeen.getTime()
            /*
				check if it's been a suspicious amount of time since the server responded with our last seen
				it could be that the network is down
			*/
            if (diff > KEEP_ALIVE_INTERVAL_MS+5000) this.unexpectedDisconnect (DisconnectReason.lost)
            else if (this.conn) this.send ('?,,') // if its all good, send a keep alive request
        }, KEEP_ALIVE_INTERVAL_MS)
    }
}
