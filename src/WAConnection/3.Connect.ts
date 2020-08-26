import * as Utils from './Utils'
import { WAMessage, WAChat, WAContact, MessageLogLevel, WANode, KEEP_ALIVE_INTERVAL_MS, BaileysError, WAConnectOptions } from './Constants'
import {WAConnection as Base} from './1.Validation'
import Decoder from '../Binary/Decoder'

export class WAConnection extends Base {
    /**
     * Connect to WhatsAppWeb
     * @param options the connect options
     */
    async connect(options: WAConnectOptions = {}) {
        // if we're already connected, throw an error
        if (this.state !== 'close') throw new Error('cannot connect when state=' + this.state)
        
        this.state = 'connecting'
        this.emit ('connecting')

        const { ws, cancel } = Utils.openWebSocketConnection (5000, typeof options?.retryOnNetworkErrors === 'undefined' ? true : options?.retryOnNetworkErrors)
        const promise = Utils.promiseTimeout(options?.timeoutMs, (resolve, reject) => {
            ws
            .then (conn => this.conn = conn)
            .then (() => this.conn.on('message', data => this.onMessageRecieved(data as any)))
            .then (() => this.log(`connected to WhatsApp Web server, authenticating via ${options.reconnectID ? 'reconnect' : 'takeover'}`, MessageLogLevel.info))
            .then (() => this.authenticate(options?.reconnectID))
            .then (() => {
                this.startKeepAliveRequest()
                this.conn.removeAllListeners ('error')
                this.conn.removeAllListeners ('close')
                this.conn.on ('close', () => this.unexpectedDisconnect ('close'))
            })
            .then (resolve)
            .catch (reject)
        })
        .catch (err => {
            cancel ()
            throw err
        }) as Promise<void>

        try {
            const tasks = [promise]

            const waitForChats = typeof options?.waitForChats === 'undefined' ? true : options?.waitForChats
            if (waitForChats) tasks.push (this.receiveChatsAndContacts(options?.timeoutMs, true))
            
            await Promise.all (tasks)

            this.phoneConnected = true
            this.state = 'open'
            
            this.user.imgUrl = await this.getProfilePicture (this.user.id).catch (err => '')
            
            this.emit ('open')

            this.releasePendingRequests ()
            this.log ('opened connection to WhatsApp Web', MessageLogLevel.info)

            return this
        } catch (error) {
            const loggedOut = error instanceof BaileysError && error.status >= 400
            if (loggedOut && this.cancelReconnect) this.cancelReconnect ()
            this.closeInternal (loggedOut ? 'invalid_session' : error.message)
            throw error
        }
    }
    /** Get the URL to download the profile picture of a person/group */
    async getProfilePicture(jid: string | null) {
        const response = await this.query({ json: ['query', 'ProfilePicThumb', jid || this.user.id] })
        return response.eurl as string
    }
    /**
     * Sets up callbacks to receive chats, contacts & messages.
     * Must be called immediately after connect
     * @returns [chats, contacts]
     */
    protected async receiveChatsAndContacts(timeoutMs: number = null, stopAfterMostRecentMessage: boolean=false) {
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
            
            this.log ('received chats list', MessageLogLevel.info)
        })
        // get contacts
        this.registerCallback(['response', 'type:contacts'], json => {
            if (json[1].duplicate) return

            receivedContacts = true
            
            json[2].forEach(([type, contact]: ['user', WAContact]) => {
                if (!contact) return this.log (`unexpectedly got null contact: ${type}, ${contact}`, MessageLogLevel.info)
                
                contact.jid = Utils.whatsappID (contact.jid)
                this.contacts[contact.jid] = contact
            })
            this.log ('received contacts list', MessageLogLevel.info)
            checkForResolution ()
        })
        // wait for the chats & contacts to load
        await Utils.promiseTimeout (timeoutMs, (resolve, reject) => {
            resolveTask = resolve
            const rejectTask = (reason) => {
                reject (new Error(reason))
                this.off ('close', rejectTask)
            }
            this.on ('close', rejectTask)
        }).finally (deregisterCallbacks)
        
        this.chats
        .all ()
        .forEach (chat => {
            const respectiveContact = this.contacts[chat.jid]
            chat.name = respectiveContact?.name || respectiveContact?.notify || chat.name
        })
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
        this.keepAliveReq = setInterval(() => {
            const diff = (new Date().getTime() - this.lastSeen.getTime())
            /*
				check if it's been a suspicious amount of time since the server responded with our last seen
				it could be that the network is down
			*/
            if (diff > KEEP_ALIVE_INTERVAL_MS+5000) this.unexpectedDisconnect ('lost')
            else this.send ('?,,') // if its all good, send a keep alive request
        }, KEEP_ALIVE_INTERVAL_MS)
    }
    protected async reconnectLoop () {
        this.cancelledReconnect = false
        try {
            while (true) {
                const {delay, cancel} = Utils.delayCancellable (2500)
                this.cancelReconnect = () => {
                    this.cancelledReconnect = true
                    this.cancelReconnect = null
                    cancel ()
                }
                
                await delay
                try {
                    const reconnectID = this.lastDisconnectReason !== 'replaced' && this.lastDisconnectReason !== 'unknown' && this.user ? this.user.id.replace ('@s.whatsapp.net', '@c.us') : null
                    await this.connect ({ timeoutMs: 30000, retryOnNetworkErrors: true, reconnectID })
                    this.cancelReconnect = null
                    break
                } catch (error) {
                    // don't continue reconnecting if error is 400
                    if (error instanceof BaileysError && error.status >= 400) {
                        break
                    }
                    this.log (`error in reconnecting: ${error}, reconnecting...`, MessageLogLevel.info)
                }
            }
        } catch {

        }
    }
    /**
     * Check if your phone is connected
     * @param timeoutMs max time for the phone to respond
     */
    async checkPhoneConnection(timeoutMs = 5000) {
        try {
            const response = await this.query({json: ['admin', 'test'], timeoutMs})
            return response[1] as boolean
        } catch (error) {
            return false
        }
    }
}
