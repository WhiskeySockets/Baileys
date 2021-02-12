import * as Utils from './Utils'
import { KEEP_ALIVE_INTERVAL_MS, BaileysError, WAConnectOptions, DisconnectReason, UNAUTHORIZED_CODES, CancelledError, WAOpenResult, DEFAULT_ORIGIN, WS_URL } from './Constants'
import {WAConnection as Base} from './1.Validation'
import Decoder from '../Binary/Decoder'
import WS from 'ws'

const DEF_CALLBACK_PREFIX = 'CB:'
const DEF_TAG_PREFIX = 'TAG:'

export class WAConnection extends Base {
    /** Connect to WhatsApp Web */
    async connect () {
        // if we're already connected, throw an error
        if (this.state !== 'close') {
            throw new BaileysError('cannot connect when state=' + this.state, { status: 409 })
        }
        
        const options = this.connectOptions
        const newConnection = !this.authInfo
        
        this.state = 'connecting'
        this.emit ('connecting')

        let tries = 0
        let lastConnect = this.lastDisconnectTime
        let result: WAOpenResult
        while (this.state === 'connecting') {
            tries += 1
            try {
                const diff = lastConnect ? new Date().getTime()-lastConnect.getTime() : Infinity
                result = await this.connectInternal (
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

                this.logger.warn ({ error }, `connect attempt ${tries} failed: ${error}${ willReconnect ? ', retrying...' : ''}`)

                if ((this.state as string) !== 'close' && !willReconnect) {
                    this.closeInternal (reason)
                }
                if (!willReconnect) throw error
            }
        }
        if (newConnection) result.newConnection = newConnection
        this.emit ('open', result)
        
        this.logger.info ('opened connection to WhatsApp Web')

        this.conn.on ('close', () => this.unexpectedDisconnect (DisconnectReason.close))

        return result
    }
    /** Meat of the connect logic */
    protected async connectInternal (options: WAConnectOptions, delayMs?: number) {
        const rejections: ((e?: Error) => void)[] = []
        const rejectAll = (e: Error) => rejections.forEach (r => r(e))
        const rejectAllOnWSClose = ({ reason }) => rejectAll(new Error(reason))
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

                this.conn.on('message', data => this.onMessageRecieved(data as any))
                
                this.conn.once('open', async () => {
                    this.startKeepAliveRequest()
                    this.logger.info(`connected to WhatsApp Web server, authenticating via ${reconnectID ? 'reconnect' : 'takeover'}`)

                    try {
                        this.connectionDebounceTimeout.setInterval(this.connectOptions.maxIdleTimeMs)
                        const authResult = await this.authenticate(reconnectID)
                        
                        this.conn
                            .removeAllListeners('error')
                            .removeAllListeners('close')
                        this.connectionDebounceTimeout.start()
                        resolve(authResult as WAOpenResult)
                    } catch (error) {
                        reject(error)
                    }
                })
                this.conn.on('error', rejectAll)
                this.conn.on('close', () => rejectAll(new Error(DisconnectReason.close)))
            }) as Promise<WAOpenResult>
        )

        this.on ('ws-close', rejectAllOnWSClose)
        try {
            if (delayMs) {
                const {delay, cancel} = Utils.delayCancellable (delayMs)
                rejections.push (cancel)
                await delay
            }
            const result = await connect ()
            return result
        } catch (error) {
            if (this.conn) {
                this.endConnection(error.message)
            }
            throw error
        } finally {
            this.off ('ws-close', rejectAllOnWSClose)
        }
    }
    private onMessageRecieved(message: string | Buffer) {
        if (message[0] === '!') {
            // when the first character in the message is an '!', the server is sending a pong frame
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
                
                this.unexpectedDisconnect(DisconnectReason.badSession)
            }

            if (this.shouldLogMessages) this.messageLog.push ({ tag: messageTag, json: JSON.stringify(json), fromMe: false })
            if (!json) return 

            if (this.logger.level === 'trace') {
                this.logger.trace(messageTag + ',' + JSON.stringify(json))
            }

            let anyTriggered = false
            /* Check if this is a response to a message we sent */
            anyTriggered = this.emit (`${DEF_TAG_PREFIX}${messageTag}`, json)
            /* Check if this is a response to a message we are expecting */
            const l0 = json[0] || ''
            const l1 = typeof json[1] !== 'object' || json[1] === null ? {} : json[1]
            const l2 = ((json[2] || [])[0] || [])[0] || ''

            Object.keys(l1).forEach(key => {
                anyTriggered = this.emit (`${DEF_CALLBACK_PREFIX}${l0},${key}:${l1[key]},${l2}`, json) || anyTriggered;
                anyTriggered = this.emit (`${DEF_CALLBACK_PREFIX}${l0},${key}:${l1[key]}`, json) || anyTriggered;
                anyTriggered = this.emit (`${DEF_CALLBACK_PREFIX}${l0},${key}`, json) || anyTriggered;
            })
            anyTriggered = this.emit (`${DEF_CALLBACK_PREFIX}${l0},,${l2}`, json) || anyTriggered;
            anyTriggered = this.emit (`${DEF_CALLBACK_PREFIX}${l0}`, json) || anyTriggered;

            if (anyTriggered) return

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
            if (diff > KEEP_ALIVE_INTERVAL_MS+5000) this.unexpectedDisconnect(DisconnectReason.lost)
            else if (this.conn) this.send('?,,') // if its all good, send a keep alive request
        }, KEEP_ALIVE_INTERVAL_MS)
    }
}
