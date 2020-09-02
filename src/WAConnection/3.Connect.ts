import * as Utils from './Utils'
import { WAMessage, WAChat, MessageLogLevel, WANode, KEEP_ALIVE_INTERVAL_MS, BaileysError, WAConnectOptions, DisconnectReason, UNAUTHORIZED_CODES, WAContact, TimedOutError, CancelledError } from './Constants'
import {WAConnection as Base} from './1.Validation'
import Decoder from '../Binary/Decoder'

export class WAConnection extends Base {
    /** Connect to WhatsApp Web */
    async connect() {
        // if we're already connected, throw an error
        if (this.state !== 'close') throw new Error('cannot connect when state=' + this.state)
        
        const options = this.connectOptions

        this.state = 'connecting'
        this.emit ('connecting')

        let tries = 0
        while (this.state === 'connecting') {
            tries += 1
            try {
                const diff = this.lastConnectTime ? new Date().getTime()-this.lastConnectTime.getTime() : Infinity
                await this.connectInternal (
                    options, 
                    diff > this.connectOptions.connectCooldownMs ? 0 : this.connectOptions.connectCooldownMs
                )
                this.phoneConnected = true
                this.state = 'open'
            } catch (error) {
                const loggedOut = error instanceof BaileysError && UNAUTHORIZED_CODES.includes(error.status)
                const willReconnect = !loggedOut && (tries <= (options?.maxRetries || 5)) && this.state === 'connecting'

                this.log (`connect attempt ${tries} failed: ${error}${ willReconnect ? ', retrying...' : ''}`, MessageLogLevel.info)

                if ((this.state as string) !== 'close' && !willReconnect) {
                    this.closeInternal (loggedOut ? DisconnectReason.invalidSession : error.message)
                }

                if (!willReconnect) throw error
            } finally {
                this.lastConnectTime = new Date()
            }
        }

        this.emit ('open')
 
        this.releasePendingRequests ()
        this.startKeepAliveRequest()
        
        this.log ('opened connection to WhatsApp Web', MessageLogLevel.info)

        this.conn.on ('close', () => this.unexpectedDisconnect (DisconnectReason.close))

        return this

    }
    /** Meat of the connect logic */
    protected async connectInternal (options: WAConnectOptions, delayMs?: number) {
        // actual connect
        const connect = () => {
            const timeoutMs = options?.timeoutMs || 60*1000
            
            const { ws, cancel } = Utils.openWebSocketConnection (5000, false)

            let task = ws
                    .then (conn => this.conn = conn)
                    .then (() => (
                        this.conn.on('message', data => this.onMessageRecieved(data as any))
                    ))
                    .then (() => (
                        this.log(`connected to WhatsApp Web server, authenticating via ${reconnectID ? 'reconnect' : 'takeover'}`, MessageLogLevel.info)
                    ))
                    .then (() => this.authenticate(reconnectID))
                    .then (() => {
                        this.conn
                        .removeAllListeners ('error')
                        .removeAllListeners ('close')
                    })

            let cancelTask: () => void
            if (typeof options?.waitForChats === 'undefined' ? true : options?.waitForChats) {
                const {waitForChats, cancelChats} = this.receiveChatsAndContacts(true)
                
                task = Promise.all ([task, waitForChats]).then (() => {})
                cancelTask = () => { cancelChats(); cancel() }
            } else cancelTask = cancel

            // determine whether reconnect should be used or not
            const shouldUseReconnect = this.lastDisconnectReason !== DisconnectReason.replaced && 
                                       this.lastDisconnectReason !== DisconnectReason.unknown &&
                                       this.lastDisconnectReason !== DisconnectReason.intentional && this.user?.jid
            const reconnectID = shouldUseReconnect ? this.user.jid.replace ('@s.whatsapp.net', '@c.us') : null

            const promise = Utils.promiseTimeout(timeoutMs, (resolve, reject) => (
                task.then (resolve).catch (reject)
            ))
            .catch (err => {
                this.endConnection ()
                throw err
            }) as Promise<void>

            return { promise, cancel: cancelTask }
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

        return promise
            .then (() => {
                const {promise, cancel} = connect ()
                cancellations.push (cancel)
                return promise
            })
            .finally (() => {
                cancel()
                this.off('close', cancel)
            })
    }
    /**
     * Sets up callbacks to receive chats, contacts & messages.
     * Must be called immediately after connect
     * @returns [chats, contacts]
     */
    protected receiveChatsAndContacts(stopAfterMostRecentMessage: boolean=false) {
        this.contacts = {}
        this.chats.clear ()

        let receivedContacts = false
        let receivedMessages = false

        let resolveTask: () => void
        const deregisterCallbacks = () => {
            // wait for actual messages to load, "last" is the most recent message, "before" contains prior messages
            this.deregisterCallback(['action', 'add:last'])
            if (!stopAfterMostRecentMessage) {
                this.deregisterCallback(['action', 'add:before'])
                this.deregisterCallback(['action', 'add:unread'])
            }
            this.deregisterCallback(['response', 'type:chat'])
            this.deregisterCallback(['response', 'type:contacts'])
        }
        const checkForResolution = () => {
            if (receivedContacts && receivedMessages) resolveTask ()
        }
        
        // wait for messages to load
        const chatUpdate = json => {
            receivedMessages = true
            const isLast = json[1].last || stopAfterMostRecentMessage
            const messages = json[2] as WANode[]

            if (messages) {
                messages.reverse().forEach (([,, message]: ['message', null, WAMessage]) => {
                    const jid = message.key.remoteJid
                    const chat = this.chats.get(jid)
                    chat?.messages.unshift (message)
                })
            }
            // if received contacts before messages
            if (isLast && receivedContacts) checkForResolution ()
        }

        // wait for actual messages to load, "last" is the most recent message, "before" contains prior messages
        this.registerCallback(['action', 'add:last'], chatUpdate)
        if (!stopAfterMostRecentMessage) {
            this.registerCallback(['action', 'add:before'], chatUpdate)
            this.registerCallback(['action', 'add:unread'], chatUpdate)
        }
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
                
                const oldChat = this.chats.get(chat.jid) 
                oldChat && this.chats.delete (oldChat)

                this.chats.insert (chat) // chats data (log json to see what it looks like)
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
                this.contacts[contact.jid] = contact
            })
            this.log (`received ${json[2].length} contacts`, MessageLogLevel.info)
            checkForResolution ()
        })

        // wait for the chats & contacts to load
        let cancelChats: () => void
        const waitForChats = new Promise ((resolve, reject) => {
                resolveTask = resolve
                cancelChats = () => reject (CancelledError())
            })
            .then (() => (
                this.chats
                .all ()
                .forEach (chat => {
                    const respectiveContact = this.contacts[chat.jid]
                    chat.name = respectiveContact?.name || respectiveContact?.notify || chat.name
                })
            ))
            .finally (deregisterCallbacks)

        return { waitForChats, cancelChats }
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
        } else {
            const decrypted = Utils.decryptWA (message, this.authInfo?.macKey, this.authInfo?.encKey, new Decoder())
            if (!decrypted) return
            
            const [messageTag, json] = decrypted

            if (this.logLevel === MessageLogLevel.all) {
                this.log(messageTag + ', ' + JSON.stringify(json), MessageLogLevel.all)
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
            this.checkPhoneConnection (5000) 
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
