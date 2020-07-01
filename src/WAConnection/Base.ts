import * as QR from 'qrcode-terminal'
import * as fs from 'fs'
import WS from 'ws'
import * as Utils from './Utils'
import Encoder from '../Binary/Encoder'
import Decoder from '../Binary/Decoder'
import { AuthenticationCredentials, UserMetaData, WANode, AuthenticationCredentialsBase64, WATag, MessageLogLevel } from './Constants'


/** Generate a QR code from the ref & the curve public key. This is scanned by the phone */
const generateQRCode = function ([ref, publicKey, clientID]) {
    const str = ref + ',' + publicKey + ',' + clientID
    QR.generate(str, { small: true })
}

export default class WAConnectionBase {
    /** The version of WhatsApp Web we're telling the servers we are */
    version: [number, number, number] = [2, 2025, 6]
    /** The Browser we're telling the WhatsApp Web servers we are */
    browserDescription: [string, string] = ['Baileys', 'Baileys']
    /** Metadata like WhatsApp id, name set on WhatsApp etc. */
    userMetaData: UserMetaData = { id: null, name: null, phone: null }
    /** Should reconnect automatically after an unexpected disconnect */
    autoReconnect = true
    lastSeen: Date = null
    /** Log messages that are not handled, so you can debug & see what custom stuff you can implement */
    logLevel: MessageLogLevel = MessageLogLevel.none
    /** Data structure of tokens & IDs used to establish one's identiy to WhatsApp Web */
    protected authInfo: AuthenticationCredentials = {
        clientID: null,
        serverToken: null,
        clientToken: null,
        encKey: null,
        macKey: null,
    }
    /** Curve keys to initially authenticate */
    protected curveKeys: { private: Uint8Array; public: Uint8Array }
    /** The websocket connection */
    protected conn: WS = null
    protected msgCount = 0
    protected keepAliveReq: NodeJS.Timeout
    protected callbacks = {}
    protected encoder = new Encoder()
    protected decoder = new Decoder()
    /**
     * What to do when you need the phone to authenticate the connection (generate QR code by default)
     */
    onReadyForPhoneAuthentication = generateQRCode
    unexpectedDisconnect = (err) => this.close()
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
    /**
     * Load in the authentication credentials
     * @param authInfo the authentication credentials or path to auth credentials JSON
     */
    loadAuthInfoFromBase64(authInfo: AuthenticationCredentialsBase64 | string) {
        if (!authInfo) {
            throw 'given authInfo is null'
        }
        if (typeof authInfo === 'string') {
            this.log(`loading authentication credentials from ${authInfo}`)
            const file = fs.readFileSync(authInfo, { encoding: 'utf-8' }) // load a closed session back if it exists
            authInfo = JSON.parse(file) as AuthenticationCredentialsBase64
        }
        this.authInfo = {
            clientID: authInfo.clientID,
            serverToken: authInfo.serverToken,
            clientToken: authInfo.clientToken,
            encKey: Buffer.from(authInfo.encKey, 'base64'), // decode from base64
            macKey: Buffer.from(authInfo.macKey, 'base64'), // decode from base64
        }
    }
    /**
     * Register for a callback for a certain function, will cancel automatically after one execution
     * @param {[string, object, string] | string} parameters name of the function along with some optional specific parameters
     */
    async registerCallbackOneTime(parameters) {
        const json = await new Promise((resolve, _) => this.registerCallback(parameters, resolve))
        this.deregisterCallback(parameters)
        return json
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
            throw 'parameters (' + parameters + ') must be a string or array'
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
            throw 'parameters (' + parameters + ') must be a string or array'
        }
        const func = 'function:' + parameters[0]
        const key = parameters[1] || ''
        const key2 = parameters[2] || ''
        if (this.callbacks[func] && this.callbacks[func][key] && this.callbacks[func][key][key2]) {
            delete this.callbacks[func][key][key2]
            return
        }
        this.log('WARNING: could not find ' + JSON.stringify(parameters) + ' to deregister')
    }
    /**
     * Wait for a message with a certain tag to be received
     * @param tag the message tag to await
     * @param json query that was sent
     * @param timeoutMs timeout after which the promise will reject
     */
    async waitForMessage(tag: string, json: Object = null, timeoutMs: number = null) {
        let promise = new Promise(
            (resolve, reject) => (this.callbacks[tag] = { queryJSON: json, callback: resolve, errCallback: reject }),
        )
        if (timeoutMs) {
            promise = Utils.promiseTimeout(timeoutMs, promise).catch((err) => {
                delete this.callbacks[tag]
                throw err
            })
        }
        return promise as Promise<any>
    }
    /**
     * Query something from the WhatsApp servers and error on a non-200 status
     * @param json the query itself
     * @param [binaryTags] the tags to attach if the query is supposed to be sent encoded in binary
     * @param [timeoutMs] timeout after which the query will be failed (set to null to disable a timeout)
     * @param [tag] the tag to attach to the message
     * recieved JSON
     */
    async queryExpecting200(
        json: any[] | WANode,
        binaryTags: WATag = null,
        timeoutMs: number = null,
        tag: string = null,
    ) {
        return Utils.errorOnNon200Status(this.query(json, binaryTags, timeoutMs, tag))
    }
    /**
     * Query something from the WhatsApp servers
     * @param json the query itself
     * @param [binaryTags] the tags to attach if the query is supposed to be sent encoded in binary
     * @param [timeoutMs] timeout after which the query will be failed (set to null to disable a timeout)
     * @param [tag] the tag to attach to the message
     * recieved JSON
     */
    async query(json: any[] | WANode, binaryTags: WATag = null, timeoutMs: number = null, tag: string = null) {
        if (binaryTags) {
            tag = this.sendBinary(json as WANode, binaryTags, tag)
        } else {
            tag = this.sendJSON(json, tag)
        }
        return this.waitForMessage(tag, json, timeoutMs)
    }
    /**
     * Send a binary encoded message
     * @param json the message to encode & send
     * @param {[number, number]} tags the binary tags to tell WhatsApp what the message is all about
     * @param {string} [tag] the tag to attach to the message
     * @return {string} the message tag
     */
    private sendBinary(json: WANode, tags: [number, number], tag: string) {
        const binary = this.encoder.write(json) // encode the JSON to the WhatsApp binary format

        let buff = Utils.aesEncrypt(binary, this.authInfo.encKey) // encrypt it using AES and our encKey
        const sign = Utils.hmacSign(buff, this.authInfo.macKey) // sign the message using HMAC and our macKey
        tag = tag || Utils.generateMessageTag()
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
     * @private
     * @param json the message to send
     * @param [tag] the tag to attach to the message
     * @return the message tag
     */
    private sendJSON(json: any[] | WANode, tag: string = null) {
        tag = tag || Utils.generateMessageTag()
        this.send(tag + ',' + JSON.stringify(json))
        return tag
    }
    /** Send some message to the WhatsApp servers */
    protected send(m) {
        if (!this.conn) {
            throw 'cannot send message, disconnected from WhatsApp'
        }
        this.msgCount += 1 // increment message count, it makes the 'epoch' field when sending binary messages
        this.conn.send(m)
    }
    /**
     * Disconnect from the phone. Your auth credentials become invalid after sending a disconnect request.
     * @see close() if you just want to close the connection
     */
    async logout() {
        if (!this.conn) {
            throw "You're not even connected, you can't log out"
        }
        await new Promise((resolve) => {
            this.conn.send('goodbye,["admin","Conn","disconnect"]', null, () => {
                this.authInfo = null
                resolve()
            })
        })
        this.close()
    }
    /** Close the connection to WhatsApp Web */
    close() {
        this.msgCount = 0
        if (this.conn) {
            this.conn.close()
            this.conn = null
        }
        const keys = Object.keys(this.callbacks)
        keys.forEach((key) => {
            if (!key.includes('function:')) {
                this.callbacks[key].errCallback('connection closed')
                delete this.callbacks[key]
            }
        })
        if (this.keepAliveReq) {
            clearInterval(this.keepAliveReq)
        }
    }
    protected log(text) {
        console.log(`[Baileys][${new Date().toLocaleString()}] ${text}`)
    }
}
