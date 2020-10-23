import * as Utils from './Utils'
import { WAMessage, WAChat, WANode, KEEP_ALIVE_INTERVAL_MS, BaileysError, WAConnectOptions, DisconnectReason, UNAUTHORIZED_CODES, WAContact, TimedOutError, CancelledError, WAOpenResult, DEFAULT_ORIGIN, WS_URL } from './Constants'
import {WAConnection as Base} from './1.Validation'
import Decoder from '../Binary/Decoder'
import WS from 'ws'
import KeyedDB from '@adiwajshing/keyed-db'

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
                this.emit ('intermediate-close', {reason})
            }
        }

        const updatedChats = !!this.lastDisconnectTime && updates
        const result: WAOpenResult = { user: this.user, newConnection, updatedChats }
        this.emit ('open', result)
 
        this.releasePendingRequests ()
        
        this.logger.info ('opened connection to WhatsApp Web')

        this.conn.on ('close', () => this.unexpectedDisconnect (DisconnectReason.close))

        return result
    }
    /** Meat of the connect logic */
    protected async connectInternal (options: WAConnectOptions, delayMs?: number) {
        // actual connect
        const connect = () => {
            let cancel: () => void
            const task = new Promise((resolve, reject) => {
                cancel = () => reject (CancelledError())
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
                        const recv = this.receiveChatsAndContacts(this.connectOptions.waitOnlyForLastMessage)
                        waitForChats = recv.waitForChats
                        cancel = () => {
                            reject (CancelledError())
                            recv.cancelChats ()
                        }
                    }
                    try {
                        this.onDebounceTimeout = () => rejectSafe(TimedOutError())
                        await this.authenticate (reconnectID)
                        
                        this.startKeepAliveRequest()
                        
                        this.conn
                            .removeAllListeners ('error')
                            .removeAllListeners ('close')
                        const result = waitForChats && (await waitForChats)

                        this.stopDebouncedTimeout ()

                        resolve (result)
                    } catch (error) {
                        reject (error)
                    }
                })
                const rejectSafe = error => reject (error)
                this.conn.on('error', rejectSafe)
                this.conn.on('close', () => rejectSafe(new Error('close')))

            }) as Promise<void | { [k: string]: Partial<WAChat> }>

            return { promise: task, cancel: cancel }
        }

        let promise = Promise.resolve ()
        let cancellations: (() => void)[] = []

        const cancel = () => cancellations.forEach (cancel => cancel())
        
        this.on ('close', cancel)

        if (delayMs) {
            const {delay, cancel} = Utils.delayCancellable (delayMs)
            promise = delay
            cancellations.push (cancel)
        }

        try {
            await promise

            const result = connect ()
            cancellations.push (result.cancel)

            const final = await result.promise            
            return final
        } catch (error) {
            this.endConnection ()
            throw error
        } finally {
            cancel()
            this.off('close', cancel)
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
        const deregisterCallbacks = () => {
            // wait for actual messages to load, "last" is the most recent message, "before" contains prior messages
            this.deregisterCallback(['action', 'add:last'])
            this.deregisterCallback(['action', 'add:before'])
            this.deregisterCallback(['action', 'add:unread'])    
            
            this.deregisterCallback(['response', 'type:chat'])
            this.deregisterCallback(['response', 'type:contacts'])
        }
        const checkForResolution = () => receivedContacts && receivedMessages && resolveTask ()
        
        // wait for messages to load
        const chatUpdate = json => {
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

        // wait for actual messages to load, "last" is the most recent message, "before" contains prior messages
        this.registerCallback(['action', 'add:last'], chatUpdate)
        this.registerCallback(['action', 'add:before'], chatUpdate)
        this.registerCallback(['action', 'add:unread'], chatUpdate)

        // get chats
        this.registerCallback(['response', 'type:chat'], json => {
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
        })
        // get contacts
        this.registerCallback(['response', 'type:contacts'], json => {
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
        })

        // wait for the chats & contacts to load
        let cancelChats: () => void
        const waitForChats = async () => {
            try {
                await new Promise ((resolve, reject) => {
                    resolveTask = resolve
                    cancelChats = () => reject (CancelledError())
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
        return { waitForChats: waitForChats (), cancelChats }
    }
    private releasePendingRequests () {
        this.pendingRequests.forEach (({resolve}) => resolve()) // send off all pending request
        this.pendingRequests = []
    }
    private onMessageRecieved(message: string | Buffer) {
        if (message[0] === '!') {
            // when the first character in the message is an '!', the server is updating the last seen
            const timestamp = message.slice(1, message.length).toString ('utf-8')
            this.lastSeen = new Date(parseInt(timestamp))
            this.emit ('received-pong')
        } else {
            try {
                const [messageTag, json] = Utils.decryptWA (message, this.authInfo?.macKey, this.authInfo?.encKey, new Decoder())
                if (this.shouldLogMessages) this.messageLog.push ({ tag: messageTag, json: JSON.stringify(json), fromMe: false })
                
                if (!json) { return }

                if (this.logger.level === 'trace') {
                    this.logger.trace(messageTag + ', ' + JSON.stringify(json))
                }
                /*
                Check if this is a response to a message we sent
                */
                if (this.callbacks[messageTag]) {
                    const q = this.callbacks[messageTag]
                    q.callback(json)
                    delete this.callbacks[messageTag]
                    return
                }
                /*
                Check if this is a response to a message we are expecting
                */
                if (this.callbacks['function:' + json[0]]) {
                    const callbacks = this.callbacks['function:' + json[0]]
                    let callbacks2
                    let callback
                    for (const key in json[1] || {}) {
                        callbacks2 = callbacks[key + ':' + json[1][key]]
                        if (callbacks2) {
                            break
                        }
                    }
                    if (!callbacks2) {
                        for (const key in json[1] || {}) {
                            callbacks2 = callbacks[key]
                            if (callbacks2) {
                                break
                            }
                        }
                    }
                    if (!callbacks2) {
                        callbacks2 = callbacks['']
                    }
                    if (callbacks2) {
                        callback = callbacks2[json[2] && json[2][0][0]]
                        if (!callback) {
                            callback = callbacks2['']
                        }
                    }
                    if (callback) {
                        callback(json)
                        return
                    }
                }
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
            } catch (error) {
                this.logger.error ({ error }, `encountered error in decrypting message, closing`)
                
                if (this.state === 'open') this.unexpectedDisconnect (DisconnectReason.badSession)
                else this.endConnection ()
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
