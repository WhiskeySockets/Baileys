import WS from 'ws'
import * as fs from 'fs'
import * as Utils from './Utils'
import Encoder from '../Binary/Encoder'
import Decoder from '../Binary/Decoder'
import got, { Method } from 'got'
import {
    AuthenticationCredentials,
    WAUser,
    WANode,
    WATag,
    BaileysError,
    WAMetric,
    WAFlag,
    DisconnectReason,
    WAConnectionState,
    AnyAuthenticationCredentials,
    WAContact,
    WAQuery,
    ReconnectMode,
    WAConnectOptions,
    MediaConnInfo,
    DEFAULT_ORIGIN,
} from './Constants'
import { EventEmitter } from 'events'
import KeyedDB from '@adiwajshing/keyed-db'
import { STATUS_CODES } from 'http'
import { Agent } from 'https'
import pino from 'pino'

const logger = pino({ prettyPrint: { levelFirst: true, ignore: 'hostname', translateTime: true },  prettifier: require('pino-pretty') })

export class WAConnection extends EventEmitter {
    /** The version of WhatsApp Web we're telling the servers we are */
    version: [number, number, number] = [2, 2147, 14]
    /** The Browser we're telling the WhatsApp Web servers we are */
    browserDescription: [string, string, string] = Utils.Browsers.baileys ('Chrome')
    /** Metadata like WhatsApp id, name set on WhatsApp etc. */
    user: WAUser
    /** Should requests be queued when the connection breaks in between; if 0, then an error will be thrown */
    pendingRequestTimeoutMs: number = null
    /** The connection state */
    state: WAConnectionState = 'close'
    connectOptions: WAConnectOptions = {
        maxIdleTimeMs: 60_000,
        maxRetries: 10,
        connectCooldownMs: 4000,
        phoneResponseTime: 15_000,
        maxQueryResponseTime: 10_000,
        alwaysUseTakeover: true,
        queryChatsTillReceived: true,
        logQR: true
    }
    /** When to auto-reconnect */
    autoReconnect = ReconnectMode.onConnectionLost 
    /** Whether the phone is connected */
    phoneConnected: boolean = false
    /** key to use to order chats */
    chatOrderingKey = Utils.waChatKey(false)

    logger = logger.child ({ class: 'Baileys' })

    /** log messages */
    shouldLogMessages = false 
    messageLog: { tag: string, json: string, fromMe: boolean, binaryTags?: any[] }[] = []

    maxCachedMessages = 50

    lastChatsReceived: Date
    chats = new KeyedDB (Utils.waChatKey(false), value => value.jid)
    contacts: { [k: string]: WAContact } = {}
    blocklist: string[] = []

    /** Data structure of tokens & IDs used to establish one's identiy to WhatsApp Web */
    protected authInfo: AuthenticationCredentials
    /** Curve keys to initially authenticate */
    protected curveKeys: { private: Uint8Array; public: Uint8Array }
    /** The websocket connection */
    protected conn: WS
    protected msgCount = 0
    protected keepAliveReq: NodeJS.Timeout
    protected encoder = new Encoder()
    protected decoder = new Decoder()
    protected phoneCheckInterval
    protected phoneCheckListeners = 0

    protected referenceDate = new Date () // used for generating tags
    protected lastSeen: Date = null // last keep alive received
    protected initTimeout: NodeJS.Timeout

    protected lastDisconnectTime: Date = null
    protected lastDisconnectReason: DisconnectReason 

    protected mediaConn: MediaConnInfo
    protected connectionDebounceTimeout = Utils.debouncedTimeout(
        1000, 
        () => this.state === 'connecting' && this.endConnection(DisconnectReason.timedOut)
    )
    // timeout to know when we're done recieving messages
    protected messagesDebounceTimeout = Utils.debouncedTimeout(2000)
    // ping chats till recieved
    protected chatsDebounceTimeout = Utils.debouncedTimeout(10_000)
    /**
     * Connect to WhatsAppWeb
     * @param options the connect options
     */
    async connect() {
        return null
    }
    async unexpectedDisconnect (error: DisconnectReason) {
        if (this.state === 'open') {
            const willReconnect = 
            (this.autoReconnect === ReconnectMode.onAllErrors || 
            (this.autoReconnect === ReconnectMode.onConnectionLost && error !== DisconnectReason.replaced)) &&
            error !== DisconnectReason.invalidSession // do not reconnect if credentials have been invalidated
        
            this.closeInternal(error, willReconnect)
            willReconnect && (
                this.connect()
                .catch(err => {}) // prevent unhandled exeception
            ) 
        } else {
            this.endConnection(error)
        }
    }
    /**
     * base 64 encode the authentication credentials and return them
     * these can then be used to login again by passing the object to the connect () function.
     * @see connect () in WhatsAppWeb.Session
     */
    base64EncodedAuthInfo() {
        return {
            clientID: this.authInfo.clientID,
            serverToken: this.authInfo.serverToken,
            clientToken: this.authInfo.clientToken,
            encKey: this.authInfo.encKey.toString('base64'),
            macKey: this.authInfo.macKey.toString('base64'),
        }
    }
    /** Can you login to WA without scanning the QR */
    canLogin () {
        return !!this.authInfo?.encKey && !!this.authInfo?.macKey
    }
    /** Clear authentication info so a new connection can be created */
    clearAuthInfo () {
        this.authInfo = null
        return this 
    }
    /**
     * Load in the authentication credentials
     * @param authInfo the authentication credentials or file path to auth credentials
     */
    loadAuthInfo(authInfo: AnyAuthenticationCredentials | string) {
        if (!authInfo) throw new Error('given authInfo is null')
        
        if (typeof authInfo === 'string') {
            this.logger.info(`loading authentication credentials from ${authInfo}`)
            const file = fs.readFileSync(authInfo, { encoding: 'utf-8' }) // load a closed session back if it exists
            authInfo = JSON.parse(file) as AnyAuthenticationCredentials
        }
        if ('clientID' in authInfo) {
            this.authInfo = {
                clientID: authInfo.clientID,
                serverToken: authInfo.serverToken,
                clientToken: authInfo.clientToken,
                encKey: Buffer.isBuffer(authInfo.encKey) ? authInfo.encKey : Buffer.from(authInfo.encKey, 'base64'),
                macKey: Buffer.isBuffer(authInfo.macKey) ? authInfo.macKey : Buffer.from(authInfo.macKey, 'base64'), 
            }
        } else {
            const secretBundle: {encKey: string, macKey: string} = typeof authInfo.WASecretBundle === 'string' ? JSON.parse (authInfo.WASecretBundle): authInfo.WASecretBundle
            this.authInfo = {
                clientID: authInfo.WABrowserId.replace(/\"/g, ''),
                serverToken: authInfo.WAToken2.replace(/\"/g, ''),
                clientToken: authInfo.WAToken1.replace(/\"/g, ''),
                encKey: Buffer.from(secretBundle.encKey, 'base64'), // decode from base64
                macKey: Buffer.from(secretBundle.macKey, 'base64'), // decode from base64
            }
        }   
        return this
    }
    /**
     * Wait for a message with a certain tag to be received
     * @param tag the message tag to await
     * @param json query that was sent
     * @param timeoutMs timeout after which the promise will reject
     */
    async waitForMessage(tag: string, requiresPhoneConnection: boolean, timeoutMs?: number) {
        let onRecv: (json) => void
        let onErr: (err) => void
        let cancelPhoneChecker: () => void
        if (requiresPhoneConnection) {
            this.startPhoneCheckInterval()
            cancelPhoneChecker = this.exitQueryIfResponseNotExpected(tag, err => onErr(err))
        }
        try {
            const result = await Utils.promiseTimeout(timeoutMs,
                (resolve, reject) => {
                    onRecv = resolve
                    onErr = ({ reason, status }) => reject(new BaileysError(reason, { status }))
                    this.on (`TAG:${tag}`, onRecv)
                    this.on ('ws-close', onErr) // if the socket closes, you'll never receive the message
                },
            )
            return result as any
        } finally {
            requiresPhoneConnection && this.clearPhoneCheckInterval()
            this.off (`TAG:${tag}`, onRecv)
            this.off (`ws-close`, onErr)
            cancelPhoneChecker && cancelPhoneChecker()
        }
    }
    /** Generic function for action, set queries */
    async setQuery (nodes: WANode[], binaryTags: WATag = [WAMetric.group, WAFlag.ignore], tag?: string) {
        const json = ['action', {epoch: this.msgCount.toString(), type: 'set'}, nodes]
        const result = await this.query({ json, binaryTags, tag, expect200: true, requiresPhoneConnection: true }) as Promise<{status: number}>
        return result
    }
    /**
     * Query something from the WhatsApp servers
     * @param json the query itself
     * @param binaryTags the tags to attach if the query is supposed to be sent encoded in binary
     * @param timeoutMs timeout after which the query will be failed (set to null to disable a timeout)
     * @param tag the tag to attach to the message
     */
    async query(q: WAQuery): Promise<any> {
        let {json, binaryTags, tag, timeoutMs, expect200, waitForOpen, longTag, requiresPhoneConnection, startDebouncedTimeout, maxRetries} = q
        requiresPhoneConnection = requiresPhoneConnection !== false
        waitForOpen = waitForOpen !== false
        let triesLeft = maxRetries || 2
        tag = tag || this.generateMessageTag(longTag)
        
        while (triesLeft >= 0) {
            if (waitForOpen) await this.waitForConnection()

            const promise = this.waitForMessage(tag, requiresPhoneConnection, timeoutMs)

            if (this.logger.level === 'trace') {
                this.logger.trace ({ fromMe: true },`${tag},${JSON.stringify(json)}`)
            }
           
            if (binaryTags) tag = await this.sendBinary(json as WANode, binaryTags, tag)
            else tag = await this.sendJSON(json, tag)

            try {
                const response = await promise
                if (expect200 && response.status && Math.floor(+response.status / 100) !== 2) {
                    const message = STATUS_CODES[response.status] || 'unknown'
                    throw new BaileysError (
                        `Unexpected status in '${json[0] || 'query'}': ${STATUS_CODES[response.status]}(${response.status})`, 
                        {query: json, message, status: response.status}
                    )
                }
                if (startDebouncedTimeout) {
                    this.connectionDebounceTimeout.start()
                }
                return response
            } catch (error) {
                if (triesLeft === 0) {
                    throw error
                }
                // read here: http://getstatuscode.com/599
                if (error.status === 599) {
                    this.unexpectedDisconnect (DisconnectReason.badSession)
                } else if (
                    (error.message === 'close' || error.message === 'lost') && 
                    waitForOpen && 
                    this.state !== 'close' &&
                    (this.pendingRequestTimeoutMs === null ||
                    this.pendingRequestTimeoutMs > 0)) {
                    // nothing here
                } else throw error

                triesLeft -= 1
                this.logger.debug(`query failed due to ${error}, retrying...`)
            }
        }
    }
    protected exitQueryIfResponseNotExpected(tag: string, cancel: ({ reason, status }) => void) {
        let timeout: NodeJS.Timeout
        const listener = ({ connected }) => {
            if(connected) {
                timeout = setTimeout(() => {
                    this.logger.info({ tag }, `cancelling wait for message as a response is no longer expected from the phone`)
                    cancel({ reason: 'Not expecting a response', status: 422 })
                }, this.connectOptions.maxQueryResponseTime)
                this.off('connection-phone-change', listener)
            }
        }
        this.on('connection-phone-change', listener)
        return () => {
            this.off('connection-phone-change', listener)
            timeout && clearTimeout(timeout)
        }
    }
    /** interval is started when a query takes too long to respond */
    protected startPhoneCheckInterval () {
        this.phoneCheckListeners += 1
        if (!this.phoneCheckInterval) {
            // if its been a long time and we haven't heard back from WA, send a ping
            this.phoneCheckInterval = setInterval (() => {
                if (!this.conn) return  // if disconnected, then don't do anything

                this.logger.info('checking phone connection...')
                this.sendAdminTest ()
                if(this.phoneConnected !== false) {
                    this.phoneConnected = false
                    this.emit ('connection-phone-change', { connected: false })
                }
            }, this.connectOptions.phoneResponseTime)
        }
        
    }
    protected clearPhoneCheckInterval () {
        this.phoneCheckListeners -= 1
        if (this.phoneCheckListeners <= 0) {
            this.phoneCheckInterval && clearInterval (this.phoneCheckInterval)
            this.phoneCheckInterval = undefined
            this.phoneCheckListeners = 0
        }
        
    }
    /** checks for phone connection */
    protected async sendAdminTest () {
        return this.sendJSON (['admin', 'test'])
    }
    /**
     * Send a binary encoded message
     * @param json the message to encode & send
     * @param tags the binary tags to tell WhatsApp what the message is all about
     * @param tag the tag to attach to the message
     * @return the message tag
     */
    protected async sendBinary(json: WANode, tags: WATag, tag: string = null, longTag: boolean = false) {
        const binary = this.encoder.write(json) // encode the JSON to the WhatsApp binary format

        let buff = Utils.aesEncrypt(binary, this.authInfo.encKey) // encrypt it using AES and our encKey
        const sign = Utils.hmacSign(buff, this.authInfo.macKey) // sign the message using HMAC and our macKey
        tag = tag || this.generateMessageTag(longTag)

        if (this.shouldLogMessages) this.messageLog.push ({ tag, json: JSON.stringify(json), fromMe: true, binaryTags: tags })

        buff = Buffer.concat([
            Buffer.from(tag + ','), // generate & prefix the message tag
            Buffer.from(tags), // prefix some bytes that tell whatsapp what the message is about
            sign, // the HMAC sign of the message
            buff, // the actual encrypted buffer
        ])
        await this.send(buff) // send it off
        return tag
    }
    /**
     * Send a plain JSON message to the WhatsApp servers
     * @param json the message to send
     * @param tag the tag to attach to the message
     * @returns the message tag
     */
    protected async sendJSON(json: any[] | WANode, tag: string = null, longTag: boolean = false) {
        tag = tag || this.generateMessageTag(longTag)
        if (this.shouldLogMessages) this.messageLog.push ({ tag, json: JSON.stringify(json), fromMe: true })
        await this.send(`${tag},${JSON.stringify(json)}`)
        return tag
    }
    /** Send some message to the WhatsApp servers */
    protected async send(m) {
        this.conn.send(m)
    }
    protected async waitForConnection () {
        if (this.state === 'open') return

        let onOpen: () => void
        let onClose: ({ reason }) => void

        if (this.pendingRequestTimeoutMs !== null && this.pendingRequestTimeoutMs <= 0) {
            throw new BaileysError(DisconnectReason.close, { status: 428 })
        }
        await (
            Utils.promiseTimeout (
                this.pendingRequestTimeoutMs, 
                (resolve, reject) => {
                    onClose = ({ reason }) => {
                        if (reason === DisconnectReason.invalidSession || reason === DisconnectReason.intentional) {
                            reject (new Error(reason))
                        }
                    }
                    onOpen = resolve
                    this.on ('close', onClose)
                    this.on ('open', onOpen)
                }
            )
            .finally(() => {
                this.off ('open', onOpen)
                this.off ('close', onClose)
            })
        )
    }
    /**
     * Disconnect from the phone. Your auth credentials become invalid after sending a disconnect request.
     * @see close() if you just want to close the connection
     */
    async logout () {
        this.authInfo = null
        if (this.state === 'open') {
            //throw new Error("You're not even connected, you can't log out")
            await new Promise(resolve => this.conn.send('goodbye,["admin","Conn","disconnect"]', null, resolve))
        }
        this.user = undefined
        this.chats.clear()
        this.contacts = {}
        this.close()
    }
    /** Close the connection to WhatsApp Web */
    close () {
        this.closeInternal (DisconnectReason.intentional)
    }
    protected closeInternal (reason?: DisconnectReason, isReconnecting: boolean=false) {
        this.logger.info (`closed connection, reason ${reason}${isReconnecting ? ', reconnecting in a few seconds...' : ''}`)  

        this.state = 'close'
        this.phoneConnected = false
        this.lastDisconnectReason = reason
        this.lastDisconnectTime = new Date ()

        this.endConnection(reason)
        // reconnecting if the timeout is active for the reconnect loop
        this.emit ('close', { reason, isReconnecting })
    }
    protected endConnection (reason: DisconnectReason) {
        this.conn?.removeAllListeners ('close')
        this.conn?.removeAllListeners ('error')
        this.conn?.removeAllListeners ('open')
        this.conn?.removeAllListeners ('message')

        this.initTimeout && clearTimeout (this.initTimeout)
        this.connectionDebounceTimeout.cancel()
        this.messagesDebounceTimeout.cancel()
        this.chatsDebounceTimeout.cancel()
        this.keepAliveReq && clearInterval(this.keepAliveReq)
        this.phoneCheckListeners = 0
        this.clearPhoneCheckInterval ()
        
        this.emit ('ws-close', { reason })

        try {
            this.conn?.close()
            //this.conn?.terminate()
        } catch {

        }
        this.conn = undefined
        this.lastSeen = undefined
        this.msgCount = 0
    }
    /**
     * Does a fetch request with the configuration of the connection
     */
    protected fetchRequest = (
        endpoint: string, 
        method: Method = 'GET', 
        body?: any, 
        agent?: Agent, 
        headers?: {[k: string]: string}, 
        followRedirect = true
    ) => (
        got(endpoint, {
            method,
            body,
            followRedirect,
            headers: { Origin: DEFAULT_ORIGIN, ...(headers || {}) },
            agent: { https: agent || this.connectOptions.fetchAgent }
        })
    )
    generateMessageTag (longTag: boolean = false) {
        const seconds = Utils.unixTimestampSeconds(this.referenceDate)
        const tag = `${longTag ? seconds : (seconds%1000)}.--${this.msgCount}`
        this.msgCount += 1 // increment message count, it makes the 'epoch' field when sending binary messages
        return tag
    }
}
