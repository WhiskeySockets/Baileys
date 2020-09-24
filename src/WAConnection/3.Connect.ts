import * as Utils from './Utils'
import { WAMessage, WAChat, MessageLogLevel, WANode, KEEP_ALIVE_INTERVAL_MS, BaileysError, WAConnectOptions, DisconnectReason, UNAUTHORIZED_CODES, WAContact, TimedOutError, CancelledError, WAOpenResult, DEFAULT_ORIGIN, WS_URL } from './Constants'
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
                const willReconnect = !loggedOut && (tries <= (options?.maxRetries || 5)) && this.state === 'connecting'
                const reason = loggedOut ? DisconnectReason.invalidSession : error.message

                this.log (`connect attempt ${tries} failed: ${error}${ willReconnect ? ', retrying...' : ''}`, MessageLogLevel.info)

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
        this.startKeepAliveRequest()
        
        this.log ('opened connection to WhatsApp Web', MessageLogLevel.info)

        this.conn.on ('close', () => this.unexpectedDisconnect (DisconnectReason.close))

        return result
    }
    /** Meat of the connect logic */
    protected async connectInternal (options: WAConnectOptions, delayMs?: number) {
        // actual connect
        const connect = () => {
            const timeoutMs = options?.timeoutMs || 60*1000
            
            let cancel: () => void
            const task = Utils.promiseTimeout(timeoutMs, (resolve, reject) => {
                cancel = () => reject (CancelledError())
                const checkIdleTime = () => {
                    this.debounceTimeout && clearTimeout (this.debounceTimeout)
                    this.debounceTimeout = setTimeout (() => rejectSafe (TimedOutError()), this.connectOptions.maxIdleTimeMs)
                }
                const debouncedTimeout = () => this.connectOptions.maxIdleTimeMs && this.conn.addEventListener ('message', checkIdleTime)
                // determine whether reconnect should be used or not
                const shouldUseReconnect = this.lastDisconnectReason !== DisconnectReason.replaced && 
                                            this.lastDisconnectReason !== DisconnectReason.unknown &&
                                            this.lastDisconnectReason !== DisconnectReason.intentional && 
                                            this.user?.jid
                
                const reconnectID = shouldUseReconnect ? this.user.jid.replace ('@s.whatsapp.net', '@c.us') : null

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
                    this.log(`connected to WhatsApp Web server, authenticating via ${reconnectID ? 'reconnect' : 'takeover'}`, MessageLogLevel.info)
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
                        await this.authenticate (debouncedTimeout, reconnectID)
                        this.conn
                            .removeAllListeners ('error')
                            .removeAllListeners ('close')
                        const result = waitForChats && (await waitForChats)
                        this.conn.removeEventListener ('message', checkIdleTime)
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
        const chats = new KeyedDB<WAChat>(Utils.waChatUniqueKey, c => c.jid)
        const contacts = {}

        let receivedContacts = false
        let receivedMessages = false

        let resolveTask: () => void
        const deregisterCallbacks = () => {
            // wait for actual messages to load, "last" is the most recent message, "before" contains prior messages
            this.deregisterCallback(['action', 'add:last'])
            if (!waitOnlyForLast) {
                this.deregisterCallback(['action', 'add:before'])
                this.deregisterCallback(['action', 'add:unread'])    
            }
            
            this.deregisterCallback(['response', 'type:chat'])
            this.deregisterCallback(['response', 'type:contacts'])
        }
        const checkForResolution = () => receivedContacts && receivedMessages && resolveTask ()
        
        // wait for messages to load
        const chatUpdate = json => {
            receivedMessages = true

            const isLast = json[1].last || waitOnlyForLast
            const messages = json[2] as WANode[]

            if (messages) {
                messages.reverse().forEach (([,, message]: ['message', null, WAMessage]) => {
                    const jid = message.key.remoteJid
                    const chat = chats.get(jid)
                    chat?.messages.unshift (message)
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

            json[2]
            .forEach(([item, chat]: [any, WAChat]) => {
                if (!chat) {
                    this.log (`unexpectedly got null chat: ${item}, ${chat}`, MessageLogLevel.info)
                    return
                }

                chat.jid = Utils.whatsappID (chat.jid)
                chat.t = +chat.t
                chat.count = +chat.count
                chat.messages = []

                // chats data (log json to see what it looks like)
                !chats.get (chat.jid) && chats.insert (chat) 
            })
            
            this.log (`received ${json[2].length} chats`, MessageLogLevel.info)
            if (json[2].length === 0) {
                receivedMessages = true
                checkForResolution ()
            }
        })
        // get contacts
        this.registerCallback(['response', 'type:contacts'], json => {
            if (json[1].duplicate || !json[2]) return

            receivedContacts = true
            
            json[2].forEach(([type, contact]: ['user', WAContact]) => {
                if (!contact) return this.log (`unexpectedly got null contact: ${type}, ${contact}`, MessageLogLevel.info)
                
                contact.jid = Utils.whatsappID (contact.jid)
                contacts[contact.jid] = contact
            })
            this.log (`received ${json[2].length} contacts`, MessageLogLevel.info)
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
            const [messageTag, json] = Utils.decryptWA (message, this.authInfo?.macKey, this.authInfo?.encKey, new Decoder())
            if (!json) return

            if (this.logLevel === MessageLogLevel.all) {
                this.log(messageTag + ', ' + JSON.stringify(json), MessageLogLevel.all)
            }
            if (!this.phoneConnected) {
                this.phoneConnected = true
                this.emit ('connection-phone-change', { connected: true })
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
            if (this.logLevel === MessageLogLevel.unhandled) {
                this.log('[Unhandled] ' + messageTag + ', ' + JSON.stringify(json), MessageLogLevel.unhandled)
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

            // poll phone connection as well, 
            // 5000 ms for timeout
            this.checkPhoneConnection (this.connectOptions.phoneResponseTime || 7500) 
            .then (connected => {
                this.phoneConnected !== connected && this.emit ('connection-phone-change', {connected})
                this.phoneConnected = connected
            })

        }, KEEP_ALIVE_INTERVAL_MS)
    }
    /**
     * Check if your phone is connected
     * @param timeoutMs max time for the phone to respond
     */
    async checkPhoneConnection(timeoutMs = 5000) {
        if (this.state !== 'open') return false

        try {
            const response = await this.query({json: ['admin', 'test'], timeoutMs, waitForOpen: false})
            return response[1] as boolean
        } catch (error) {
            return false
        }
    }
}
