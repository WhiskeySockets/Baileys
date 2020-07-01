import WS from 'ws'
import * as Utils from './Utils'
import { AuthenticationCredentialsBase64, UserMetaData, WAMessage, WAChat, WAContact, MessageLogLevel } from './Constants'
import WAConnectionValidator from './Validation'

export default class WAConnectionConnector extends WAConnectionValidator {
    /**
     * Connect to WhatsAppWeb
     * @param [authInfo] credentials or path to credentials to log back in
     * @param [timeoutMs] timeout after which the connect will fail, set to null for an infinite timeout
     * @return returns [userMetaData, chats, contacts, unreadMessages]
     */
    async connect(authInfo: AuthenticationCredentialsBase64 | string = null, timeoutMs: number = null) {
        const userInfo = await this.connectSlim(authInfo, timeoutMs)
        const chats = await this.receiveChatsAndContacts(timeoutMs)
        return [userInfo, ...chats] as [UserMetaData, WAChat[], WAContact[], WAMessage[]]
    }
    /**
     * Connect to WhatsAppWeb, resolves without waiting for chats & contacts
     * @param [authInfo] credentials to log back in
     * @param [timeoutMs] timeout after which the connect will fail, set to null for an infinite timeout
     * @return [userMetaData, chats, contacts, unreadMessages]
     */
    async connectSlim(authInfo: AuthenticationCredentialsBase64 | string = null, timeoutMs: number = null) {
        // if we're already connected, throw an error
        if (this.conn) {
            throw [1, 'already connected or connecting']
        }
        // set authentication credentials if required
        try {
            this.loadAuthInfoFromBase64(authInfo)
        } catch {}
        
        this.conn = new WS('wss://web.whatsapp.com/ws', null, { origin: 'https://web.whatsapp.com' })

        let promise: Promise<UserMetaData> = new Promise((resolve, reject) => {
            this.conn.on('open', () => {
                this.log('connected to WhatsApp Web, authenticating...')
                // start sending keep alive requests (keeps the WebSocket alive & updates our last seen)
                this.authenticate()
                    .then((user) => {
                        this.startKeepAliveRequest()
                        resolve(user)
                    })
                    .catch(reject)
            })
            this.conn.on('message', (m) => this.onMessageRecieved(m)) // in WhatsAppWeb.Recv.js
            this.conn.on('error', (error) => {
                // if there was an error in the WebSocket
                this.close()
                reject(error)
            })
        })
        promise = Utils.promiseTimeout(timeoutMs, promise)
        return promise.catch(err => {
            this.close()
            throw err
        })
    }
    /**
     * Sets up callbacks to receive chats, contacts & unread messages.
     * Must be called immediately after connect
     * @returns [chats, contacts, unreadMessages]
     */
    async receiveChatsAndContacts(timeoutMs: number = null) {
        let chats: Array<WAChat> = []
        let contacts: Array<WAContact> = []
        let unreadMessages: Array<WAMessage> = []
        let unreadMap: Record<string, number> = {}

        let receivedContacts = false
        let receivedMessages = false
        let convoResolve

        this.log('waiting for chats & contacts') // wait for the message with chats
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
                    json = json[2]
                    if (json) {
                        for (let k = json.length - 1; k >= 0; k--) {
                            const message = json[k][2]
                            const jid = message.key.remoteJid.replace('@s.whatsapp.net', '@c.us')
                            if (!message.key.fromMe && unreadMap[jid] > 0) {
                                // only forward if the message is from the sender
                                unreadMessages.push(message)
                                unreadMap[jid] -= 1 // reduce
                            }
                        }
                    }
                    if (isLast && receivedContacts) { // if received contacts before messages
                        convoResolve ()   
                    }
                }
                // wait for actual messages to load, "last" is the most recent message, "before" contains prior messages
                this.registerCallback(['action', 'add:last'], chatUpdate)
                this.registerCallback(['action', 'add:before'], chatUpdate)
                this.registerCallback(['action', 'add:unread'], chatUpdate)
            })
        const waitForChats = async () => {
            const json = await this.registerCallbackOneTime(['response', 'type:chat'])
            json[2].forEach(chat => {
                chats.push(chat[1]) // chats data (log json to see what it looks like)
                // store the number of unread messages for each sender
                unreadMap[chat[1].jid] = chat[1].count
            })
            if (chats.length > 0) return waitForConvos()
        }
        const waitForContacts = async () => {
            const json = await this.registerCallbackOneTime(['response', 'type:contacts'])
            contacts = json[2].map(item => item[1])
            receivedContacts = true
            // if you receive contacts after messages
            // should probably resolve the promise
            if (receivedMessages) convoResolve()
        }
        // wait for the chats & contacts to load
        const promise = Promise.all([waitForChats(), waitForContacts()])
        await Utils.promiseTimeout (timeoutMs, promise)
        return [chats, contacts, unreadMessages] as [WAChat[], WAContact[], WAMessage[]]
    }
    private onMessageRecieved(message) {
        if (message[0] === '!') {
            // when the first character in the message is an '!', the server is updating the last seen
            const timestamp = message.slice(1, message.length)
            this.lastSeen = new Date(parseInt(timestamp))
        } else {
            const commaIndex = message.indexOf(',') // all whatsapp messages have a tag and a comma, followed by the actual message

            if (commaIndex < 0) {
                // if there was no comma, then this message must be not be valid
                throw [2, 'invalid message', message]
            }

            let data = message.slice(commaIndex + 1, message.length)
            // get the message tag.
            // If a query was done, the server will respond with the same message tag we sent the query with
            const messageTag = message.slice(0, commaIndex).toString()
            if (data.length === 0) {
                // got an empty message, usually get one after sending a query with the 128 tag
                return
            }

            let json
            if (data[0] === '[' || data[0] === '{') {
                // if the first character is a "[", then the data must just be plain JSON array or object
                json = JSON.parse(data) // parse the JSON
            } else if (this.authInfo.macKey && this.authInfo.encKey) {
                /* 
                    If the data recieved was not a JSON, then it must be an encrypted message.
                    Such a message can only be decrypted if we're connected successfully to the servers & have encryption keys
                 */

                const checksum = data.slice(0, 32) // the first 32 bytes of the buffer are the HMAC sign of the message
                data = data.slice(32, data.length) // the actual message

                const computedChecksum = Utils.hmacSign(data, this.authInfo.macKey) // compute the sign of the message we recieved using our macKey

                if (checksum.equals(computedChecksum)) {
                    // the checksum the server sent, must match the one we computed for the message to be valid
                    const decrypted = Utils.aesDecrypt(data, this.authInfo.encKey) // decrypt using AES
                    json = this.decoder.read(decrypted) // decode the binary message into a JSON array
                } else {
                    throw [7, "checksums don't match"]
                }
            } else {
                // if we recieved a message that was encrypted but we don't have the keys, then there must be an error
                throw [3, 'recieved encrypted message when auth creds not available', message]
            }
            if (this.logLevel === MessageLogLevel.all) {
                this.log(messageTag + ', ' + JSON.stringify(json))
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
                this.log('[Unhandled] ' + messageTag + ', ' + JSON.stringify(json))
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
				it could be that the network is down, or the phone got unpaired from our connection
			*/
            if (diff > refreshInterval + 5) {
                this.close()

                if (this.autoReconnect) {
                    // attempt reconnecting if the user wants us to
                    this.log('disconnected unexpectedly, reconnecting...')
                    const reconnectLoop = () => this.connect(null, 25 * 1000).catch(reconnectLoop)
                    reconnectLoop() // keep trying to connect
                } else {
                    this.unexpectedDisconnect('lost connection unexpectedly')
                }
            } else {
                // if its all good, send a keep alive request
                this.send('?,,')
            }
        }, refreshInterval * 1000)
    }
}
