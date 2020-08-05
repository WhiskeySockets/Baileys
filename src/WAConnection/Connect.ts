import WS from 'ws'
import KeyedDB from '@adiwajshing/keyed-db'
import * as Utils from './Utils'
import { AuthenticationCredentialsBase64, UserMetaData, WAMessage, WAChat, WAContact, MessageLogLevel, WANode, WAConnectionMode } from './Constants'
import WAConnectionValidator from './Validation'
import Decoder from '../Binary/Decoder'

export default class WAConnectionConnector extends WAConnectionValidator {
    /**
     * Connect to WhatsAppWeb
     * @param [authInfo] credentials or path to credentials to log back in
     * @param [timeoutMs] timeout after which the connect will fail, set to null for an infinite timeout
     * @return returns [userMetaData, chats, contacts]
     */
    async connect(authInfo: AuthenticationCredentialsBase64 | string = null, timeoutMs: number = null) {
        try {
            const userInfo = await this.connectSlim(authInfo, timeoutMs)
            const chats = await this.receiveChatsAndContacts(timeoutMs)
            return [userInfo, ...chats] as [UserMetaData, KeyedDB<WAChat>, WAContact[]]
        } catch (error) {
            this.close ()
            throw error
        }
    }
    /**
     * Connect to WhatsAppWeb, resolves without waiting for chats & contacts
     * @param [authInfo] credentials to log back in
     * @param [timeoutMs] timeout after which the connect will fail, set to null for an infinite timeout
     * @return [userMetaData, chats, contacts, unreadMessages]
     */
    async connectSlim(authInfo: AuthenticationCredentialsBase64 | string = null, timeoutMs: number = null) {
        // if we're already connected, throw an error
        if (this.conn) throw new Error('already connected or connecting')
        // set authentication credentials if required
        try {
            this.loadAuthInfoFromBase64(authInfo)
        } catch {}

        this.conn = new WS('wss://web.whatsapp.com/ws', null, { origin: 'https://web.whatsapp.com' })

        const promise: Promise<UserMetaData> = new Promise((resolve, reject) => {
            this.conn.on('open', () => {
                this.log('connected to WhatsApp Web, authenticating...', MessageLogLevel.info)
                // start sending keep alive requests (keeps the WebSocket alive & updates our last seen)
                this.authenticate()
                .then(user => {
                    this.startKeepAliveRequest()

                    this.conn.removeAllListeners ('error')
                    this.conn.on ('close', () => this.unexpectedDisconnect ('closed'))

                    resolve(user)
                })
                .catch(reject)
            })
            this.conn.on('message', m => this.onMessageRecieved(m))
            // if there was an error in the WebSocket
            this.conn.on('error', error => { this.close(); reject(error) })
        })
        const user = await Utils.promiseTimeout(timeoutMs, promise).catch(err => {this.close(); throw err})
        if (this.connectionMode === WAConnectionMode.onlyRequireValidation) this.releasePendingRequests ()
        return user
    }
    /**
     * Sets up callbacks to receive chats, contacts & unread messages.
     * Must be called immediately after connect
     * @returns [chats, contacts]
     */
    async receiveChatsAndContacts(timeoutMs: number = null) {
        let contacts: WAContact[] = []
        const chats: KeyedDB<WAChat> = new KeyedDB (Utils.waChatUniqueKey, value => value.jid)

        let receivedContacts = false
        let receivedMessages = false
        let convoResolve

        this.log('waiting for chats & contacts', MessageLogLevel.info) // wait for the message with chats
        const waitForConvos = () =>
            new Promise(resolve => {
                convoResolve = () => {
                    // de-register the callbacks, so that they don't get called again
                    this.deregisterCallback(['action', 'add:last'])
                    this.deregisterCallback(['action', 'add:before'])
                    this.deregisterCallback(['action', 'add:unread'])
                    resolve()
                }
                const chatUpdate = json => {
                    receivedMessages = true
                    const isLast = json[1].last
                    const messages = json[2] as WANode[]

                    if (messages) {
                        messages.reverse().forEach (([, __, message]: ['message', null, WAMessage]) => {
                            const jid = message.key.remoteJid.replace('@s.whatsapp.net', '@c.us')
                            const chat = chats.get(jid)
                            chat?.messages.unshift (message)
                        })
                    }
                    // if received contacts before messages
                    if (isLast && receivedContacts) convoResolve ()
                }
                // wait for actual messages to load, "last" is the most recent message, "before" contains prior messages
                this.registerCallback(['action', 'add:last'], chatUpdate)
                this.registerCallback(['action', 'add:before'], chatUpdate)
                this.registerCallback(['action', 'add:unread'], chatUpdate)
            })
        const waitForChats = async () => {
            let json = await this.registerCallbackOneTime(['response', 'type:chat'])
            if (json[1].duplicate) json = await this.registerCallbackOneTime (['response', 'type:chat'])

            if (!json[2]) return
            json[2].forEach(([_, chat]: [any, WAChat]) => {
                chat.count = +chat.count
                chat.messages = []
                chats.insert (chat) // chats data (log json to see what it looks like)
            })

            if (chats.all().length > 0) return waitForConvos()
        }
        const waitForContacts = async () => {
            let json = await this.registerCallbackOneTime(['response', 'type:contacts'])
            if (json[1].duplicate) json = await this.registerCallbackOneTime (['response', 'type:contacts'])

            contacts = json[2].map(item => item[1])
            receivedContacts = true
            // if you receive contacts after messages
            // should probably resolve the promise
            if (receivedMessages) convoResolve()
        }
        // wait for the chats & contacts to load
        const promise = Promise.all([waitForChats(), waitForContacts()])
        await Utils.promiseTimeout (timeoutMs, promise)

        if (this.connectionMode === WAConnectionMode.requireChatsAndContacts) this.releasePendingRequests ()

        return [chats, contacts] as [KeyedDB<WAChat>, WAContact[]]
    }
    private releasePendingRequests () {
        this.pendingRequests.forEach (send => send()) // send off all pending request
        this.pendingRequests = []
    }
    private onMessageRecieved(message) {
        if (message[0] === '!') {
            // when the first character in the message is an '!', the server is updating the last seen
            const timestamp = message.slice(1, message.length)
            this.lastSeen = new Date(parseInt(timestamp))
        } else {
            const decrypted = Utils.decryptWA (message, this.authInfo.macKey, this.authInfo.encKey, new Decoder())
            if (!decrypted) {
                return
            }
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
        const refreshInterval = 20
        this.keepAliveReq = setInterval(() => {
            const diff = (new Date().getTime() - this.lastSeen.getTime()) / 1000
            /*
				check if it's been a suspicious amount of time since the server responded with our last seen
				it could be that the network is down
			*/
            if (diff > refreshInterval + 5) this.unexpectedDisconnect ('lost')
            else this.send ('?,,') // if its all good, send a keep alive request
        }, refreshInterval * 1000)
    }

    reconnectLoop = async () => {
        // attempt reconnecting if the user wants us to
        this.log('network is down, reconnecting...', MessageLogLevel.info)
        return this.connectSlim(null, 25*1000).catch(this.reconnectLoop)
    }
}
