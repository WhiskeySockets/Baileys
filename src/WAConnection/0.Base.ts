import * as fs from 'fs'
import WS from 'ws'
import * as Utils from './Utils'
import Encoder from '../Binary/Encoder'
import Decoder from '../Binary/Decoder'
import fetch from 'node-fetch'
import {
    AuthenticationCredentials,
    WAUser,
    WANode,
    WATag,
    MessageLogLevel,
    BaileysError,
    WAMetric,
    WAFlag,
    DisconnectReason,
    WAConnectionState,
    AnyAuthenticationCredentials,
    WAContact,
    WAChat,
    WAQuery,
    ReconnectMode,
    WAConnectOptions,
    MediaConnInfo,
    DEFAULT_ORIGIN,
} from './Constants'
import { EventEmitter } from 'events'
import KeyedDB from '@adiwajshing/keyed-db'
import { STATUS_CODES, Agent } from 'http'

export class WAConnection extends EventEmitter {
    /** The version of WhatsApp Web we're telling the servers we are */
    version: [number, number, number] = [2, 2037, 6]
    /** The Browser we're telling the WhatsApp Web servers we are */
    browserDescription: [string, string, string] = Utils.Browsers.baileys ('Chrome')
    /** Metadata like WhatsApp id, name set on WhatsApp etc. */
    user: WAUser
    /** What level of messages to log to the console */
    logLevel: MessageLogLevel = MessageLogLevel.info
    /** Should requests be queued when the connection breaks in between; if 0, then an error will be thrown */
    pendingRequestTimeoutMs: number = null
    /** The connection state */
    state: WAConnectionState = 'close'
    /** New QR generation interval, set to null if you don't want to regenerate */
    regenerateQRIntervalMs = 30*1000
    connectOptions: WAConnectOptions = {
        timeoutMs: 60*1000,
        maxIdleTimeMs: 10*1000,
        waitOnlyForLastMessage: false,
        waitForChats: true,
        maxRetries: 5,
        connectCooldownMs: 2250,
        phoneResponseTime: 7500
    }
    /** When to auto-reconnect */
    autoReconnect = ReconnectMode.onConnectionLost 
    /** Whether the phone is connected */
    phoneConnected: boolean = false

    maxCachedMessages = 50

    chats: KeyedDB<WAChat> = new KeyedDB (Utils.waChatUniqueKey, value => value.jid)
    contacts: { [k: string]: WAContact } = {}

    /** Data structure of tokens & IDs used to establish one's identiy to WhatsApp Web */
    protected authInfo: AuthenticationCredentials = null
    /** Curve keys to initially authenticate */
    protected curveKeys: { private: Uint8Array; public: Uint8Array }
    /** The websocket connection */
    protected conn: WS = null
    protected msgCount = 0
    protected keepAliveReq: NodeJS.Timeout
    protected callbacks: {[k: string]: any} = {}
    protected encoder = new Encoder()
    protected decoder = new Decoder()
    protected pendingRequests: {resolve: () => void, reject: (error) => void}[] = []
    protected referenceDate = new Date () // used for generating tags
    protected lastSeen: Date = null // last keep alive received
    protected qrTimeout: NodeJS.Timeout

    protected lastDisconnectTime: Date = null
    protected lastDisconnectReason: DisconnectReason 

    protected mediaConn: MediaConnInfo
    protected debounceTimeout: NodeJS.Timeout

    constructor () {
        super ()
        this.registerCallback (['Cmd', 'type:disconnect'], json => (
            this.unexpectedDisconnect(json[1].kind || 'unknown')
        ))
    }
    /**
     * Connect to WhatsAppWeb
     * @param options the connect options
     */
    async connect() {
        return null
    }
    async unexpectedDisconnect (error: DisconnectReason) {
        const willReconnect = 
            (this.autoReconnect === ReconnectMode.onAllErrors || 
            (this.autoReconnect === ReconnectMode.onConnectionLost && error !== DisconnectReason.replaced)) &&
            error !== DisconnectReason.invalidSession // do not reconnect if credentials have been invalidated
        
        this.closeInternal(error, willReconnect)
        willReconnect && (
            this.connect ()
            .catch(err => {}) // prevent unhandled exeception
        ) 
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
            this.log(`loading authentication credentials from ${authInfo}`, MessageLogLevel.info)
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
     * Register for a callback for a certain function
     * @param parameters name of the function along with some optional specific parameters
     */
    registerCallback(parameters: [string, string?, string?] | string, callback) {
        if (typeof parameters === 'string') {
            return this.registerCallback([parameters, null, null], callback)
        }
        if (!Array.isArray(parameters)) {
            throw new Error('parameters (' + parameters + ') must be a string or array')
        }
        const func = 'function:' + parameters[0]
        const key = parameters[1] || ''
        const key2 = parameters[2] || ''
        if (!this.callbacks[func]) {
            this.callbacks[func] = {}
        }
        if (!this.callbacks[func][key]) {
            this.callbacks[func][key] = {}
        }
        this.callbacks[func][key][key2] = callback
    }
    /**
     * Cancel all further callback events associated with the given parameters
     * @param parameters name of the function along with some optional specific parameters
     */
    deregisterCallback(parameters: [string, string?, string?] | string) {
        if (typeof parameters === 'string') {
            return this.deregisterCallback([parameters])
        }
        if (!Array.isArray(parameters)) {
            throw new Error('parameters (' + parameters + ') must be a string or array')
        }
        const func = 'function:' + parameters[0]
        const key = parameters[1] || ''
        const key2 = parameters[2] || ''
        if (this.callbacks[func] && this.callbacks[func][key] && this.callbacks[func][key][key2]) {
            delete this.callbacks[func][key][key2]
            return
        }
        this.log('WARNING: could not find ' + JSON.stringify(parameters) + ' to deregister', MessageLogLevel.info)
    }
    /**
     * Wait for a message with a certain tag to be received
     * @param tag the message tag to await
     * @param json query that was sent
     * @param timeoutMs timeout after which the promise will reject
     */
    async waitForMessage(tag: string, json: Object = null, timeoutMs: number = null) {
        let promise = Utils.promiseTimeout(timeoutMs,
            (resolve, reject) => (this.callbacks[tag] = { queryJSON: json, callback: resolve, errCallback: reject }),
        )
        .catch((err) => {
            delete this.callbacks[tag]
            throw err
        })
        return promise as Promise<any>
    }
    /** Generic function for action, set queries */
    async setQuery (nodes: WANode[], binaryTags: WATag = [WAMetric.group, WAFlag.ignore], tag?: string) {
        const json = ['action', {epoch: this.msgCount.toString(), type: 'set'}, nodes]
        const result = await this.query({ json, binaryTags, tag, expect200: true }) as Promise<{status: number}>
        return result
    }
    /**
     * Query something from the WhatsApp servers
     * @param json the query itself
     * @param binaryTags the tags to attach if the query is supposed to be sent encoded in binary
     * @param timeoutMs timeout after which the query will be failed (set to null to disable a timeout)
     * @param tag the tag to attach to the message
     * recieved JSON
     */
    async query({json, binaryTags, tag, timeoutMs, expect200, waitForOpen, longTag}: WAQuery) {
        waitForOpen = typeof waitForOpen === 'undefined' ? true : waitForOpen
        if (waitForOpen) await this.waitForConnection ()
        
        if (binaryTags) tag = await this.sendBinary(json as WANode, binaryTags, tag, longTag)
        else tag = await this.sendJSON(json, tag, longTag)
       
        const response = await this.waitForMessage(tag, json, timeoutMs)
        if (expect200 && response.status && Math.floor(+response.status / 100) !== 2) {
            // read here: http://getstatuscode.com/599
            if (response.status === 599) {
                this.unexpectedDisconnect (DisconnectReason.badSession)
                const response = await this.query ({json, binaryTags, tag, timeoutMs, expect200, waitForOpen})
                return response
            }
            const message = STATUS_CODES[response.status] || 'unknown'
            throw new BaileysError(
                `Unexpected status in '${json[0] || 'generic query'}': ${STATUS_CODES[response.status]}(${response.status})`, 
                {query: json, message, status: response.status}
            )
        }
        return response
    }
    /**
     * Send a binary encoded message
     * @param json the message to encode & send
     * @param tags the binary tags to tell WhatsApp what the message is all about
     * @param tag the tag to attach to the message
     * @return the message tag
     */
    protected sendBinary(json: WANode, tags: WATag, tag: string = null, longTag: boolean = false) {
        const binary = this.encoder.write(json) // encode the JSON to the WhatsApp binary format

        let buff = Utils.aesEncrypt(binary, this.authInfo.encKey) // encrypt it using AES and our encKey
        const sign = Utils.hmacSign(buff, this.authInfo.macKey) // sign the message using HMAC and our macKey
        tag = tag || this.generateMessageTag(longTag)
        buff = Buffer.concat([
            Buffer.from(tag + ','), // generate & prefix the message tag
            Buffer.from(tags), // prefix some bytes that tell whatsapp what the message is about
            sign, // the HMAC sign of the message
            buff, // the actual encrypted buffer
        ])
        this.send(buff) // send it off
        return tag
    }
    /**
     * Send a plain JSON message to the WhatsApp servers
     * @param json the message to send
     * @param tag the tag to attach to the message
     * @return the message tag
     */
    protected sendJSON(json: any[] | WANode, tag: string = null, longTag: boolean = false) {
        tag = tag || this.generateMessageTag(longTag)
        this.send(`${tag},${JSON.stringify(json)}`)
        return tag
    }
    /** Send some message to the WhatsApp servers */
    protected send(m) {
        this.msgCount += 1 // increment message count, it makes the 'epoch' field when sending binary messages
        return this.conn.send(m)
    }
    protected async waitForConnection () {
        if (this.state === 'open') return

        await Utils.promiseTimeout (
            this.pendingRequestTimeoutMs, 
            (resolve, reject) => this.pendingRequests.push({resolve, reject}))
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
        this.user = null
        this.close()
    }
    /** Close the connection to WhatsApp Web */
    close () {
        this.closeInternal (DisconnectReason.intentional)
    }
    protected closeInternal (reason?: DisconnectReason, isReconnecting: boolean=false) {
        this.log (`closed connection, reason ${reason}${isReconnecting ? ', reconnecting in a few seconds...' : ''}`, MessageLogLevel.info)  

        this.qrTimeout && clearTimeout (this.qrTimeout)
        this.keepAliveReq && clearInterval(this.keepAliveReq)
        this.debounceTimeout && clearTimeout (this.debounceTimeout)
        
        this.state = 'close'
        this.msgCount = 0
        this.phoneConnected = false
        this.lastDisconnectReason = reason
        this.lastDisconnectTime = new Date ()

        this.endConnection ()

        if (reason === 'invalid_session' || reason === 'intentional') {
            this.pendingRequests.forEach (({reject}) => reject(new Error(reason)))
            this.pendingRequests = []
        }
        // reconnecting if the timeout is active for the reconnect loop
        this.emit ('close', { reason, isReconnecting })
    }
    protected endConnection () {
        this.conn?.removeAllListeners ('close')
        this.conn?.removeAllListeners ('error')
        this.conn?.removeAllListeners ('open')
        this.conn?.removeAllListeners ('message')
        //this.conn?.close ()
        this.conn?.terminate()
        this.conn = null
        this.lastSeen = null

        Object.keys(this.callbacks).forEach(key => {
            if (!key.includes('function:')) {
                this.log (`cancelling message wait: ${key}`, MessageLogLevel.info)
                this.callbacks[key].errCallback(new Error('close'))
                delete this.callbacks[key]
            }
        })
    }
    /**
     * Does a fetch request with the configuration of the connection
     */
    protected fetchRequest = (endpoint: string, method: string = 'GET', body?: any, agent?: Agent, headers?: {[k: string]: string}) => (
        fetch(endpoint, {
            method,
            body,
            headers: { Origin: DEFAULT_ORIGIN, ...(headers || {}) },
            agent: agent || this.connectOptions.agent
        })
    )
    generateMessageTag (longTag: boolean = false) {
        const seconds = Utils.unixTimestampSeconds(this.referenceDate)
        return `${longTag ? seconds : (seconds%1000)}.--${this.msgCount}`
    }
    protected log(text, level: MessageLogLevel) {
        (this.logLevel >= level) && console.log(`[Baileys][${new Date().toLocaleString()}] ${text}`)
    }
}
