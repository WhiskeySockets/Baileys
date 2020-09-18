import * as Curve from 'curve25519-js'
import * as Utils from './Utils'
import {WAConnection as Base} from './0.Base'
import { MessageLogLevel, WAMetric, WAFlag, BaileysError, Presence, WAUser } from './Constants'

export class WAConnection extends Base {
    
    /** Authenticate the connection */
    protected async authenticate (onConnectionValidated: () => void, reconnect?: string) {
        // if no auth info is present, that is, a new session has to be established
        // generate a client ID
        if (!this.authInfo?.clientID) {
            this.authInfo = { clientID: Utils.generateClientID() } as any
        }

        const canLogin = this.authInfo?.encKey && this.authInfo?.macKey        
        this.referenceDate = new Date () // refresh reference date
        
        const initQueries = [
            (async () => {
                const {ref} = await this.query({
                    json: ['admin', 'init', this.version, this.browserDescription, this.authInfo?.clientID, true], 
                    expect200: true, 
                    waitForOpen: false, 
                    longTag: true
                })
                if (!canLogin) {
                    const result = await this.generateKeysForAuth (ref)
                    return result
                }
            })()
        ]
        if (canLogin) {
            // if we have the info to restore a closed session
            initQueries.push (
                (async () => {
                    const json = [
                        'admin',
                        'login',
                        this.authInfo?.clientToken,
                        this.authInfo?.serverToken,
                        this.authInfo?.clientID,
                    ]
                    if (reconnect) json.push(...['reconnect', reconnect.replace('@s.whatsapp.net', '@c.us')])
                    else json.push ('takeover')
                    
                    let response = await this.query({ json, tag: 's1', waitForOpen: false, expect200: true, longTag: true }) // wait for response with tag "s1"
                    // if its a challenge request (we get it when logging in)
                    if (response[1]?.challenge) {
                        await this.respondToChallenge(response[1].challenge)
                        response = await this.waitForMessage('s2', [])
                    }
                    return response
                })()
            )
        }

        const validationJSON = (await Promise.all (initQueries)).slice(-1)[0] // get the last result
        this.user = await this.validateNewConnection(validationJSON[1]) // validate the connection
        
        onConnectionValidated ()
        this.log('validated connection successfully', MessageLogLevel.info)

        const response = await this.query({ json: ['query', 'ProfilePicThumb', this.user.jid], waitForOpen: false, expect200: false })
        this.user.imgUrl = response?.eurl || ''

        this.sendPostConnectQueries ()

        this.log('sent init queries', MessageLogLevel.info)
    }
    /**
     * Send the same queries WA Web sends after connect
     */
    sendPostConnectQueries () {
        this.sendBinary (['query', {type: 'contacts', epoch: '1'}, null], [ WAMetric.queryContact, WAFlag.ignore ])
        this.sendBinary (['query', {type: 'chat', epoch: '1'}, null], [ WAMetric.queryChat, WAFlag.ignore ])
        this.sendBinary (['query', {type: 'status', epoch: '1'}, null], [ WAMetric.queryStatus, WAFlag.ignore ])
        this.sendBinary (['query', {type: 'quick_reply', epoch: '1'}, null], [ WAMetric.queryQuickReply, WAFlag.ignore ])
        this.sendBinary (['query', {type: 'label', epoch: '1'}, null], [ WAMetric.queryLabel, WAFlag.ignore ])
        this.sendBinary (['query', {type: 'emoji', epoch: '1'}, null], [ WAMetric.queryEmoji, WAFlag.ignore ])
        this.sendBinary (['action', {type: 'set', epoch: '1'}, [['presence', {type: Presence.available}, null]] ], [ WAMetric.presence, 160 ])
    }
    /** 
     * Refresh QR Code 
     * @returns the new ref
     */
    async generateNewQRCodeRef() {
        const response = await this.query({json: ['admin', 'Conn', 'reref'], expect200: true, waitForOpen: false, longTag: true})
        return response.ref as string
    }
    /**
     * Once the QR code is scanned and we can validate our connection, or we resolved the challenge when logging back in
     * @private
     * @param {object} json
     */
    private validateNewConnection(json) {
        // set metadata: one's WhatsApp ID [cc][number]@s.whatsapp.net, name on WhatsApp, info about the phone
        const onValidationSuccess = () => ({
            jid: Utils.whatsappID(json.wid),
            name: json.pushname,
            phone: json.phone,
            imgUrl: null
        }) as WAUser

        if (!json.secret) {
            // if we didn't get a secret, we don't need it, we're validated
            return onValidationSuccess()
        }

        const secret = Buffer.from(json.secret, 'base64')
        if (secret.length !== 144) {
            throw new Error ('incorrect secret length received: ' + secret.length)
        }

        // generate shared key from our private key & the secret shared by the server
        const sharedKey = Curve.sharedKey(this.curveKeys.private, secret.slice(0, 32))
        // expand the key to 80 bytes using HKDF
        const expandedKey = Utils.hkdf(sharedKey as Buffer, 80)

        // perform HMAC validation.
        const hmacValidationKey = expandedKey.slice(32, 64)
        const hmacValidationMessage = Buffer.concat([secret.slice(0, 32), secret.slice(64, secret.length)])

        const hmac = Utils.hmacSign(hmacValidationMessage, hmacValidationKey)

        if (!hmac.equals(secret.slice(32, 64))) {
            // if the checksums didn't match
            throw new BaileysError ('HMAC validation failed', json)
        }

        // computed HMAC should equal secret[32:64]
        // expandedKey[64:] + secret[64:] are the keys, encrypted using AES, that are used to encrypt/decrypt the messages recieved from WhatsApp
        // they are encrypted using key: expandedKey[0:32]
        const encryptedAESKeys = Buffer.concat([
            expandedKey.slice(64, expandedKey.length),
            secret.slice(64, secret.length),
        ])
        const decryptedKeys = Utils.aesDecrypt(encryptedAESKeys, expandedKey.slice(0, 32))
        // set the credentials
        this.authInfo = {
            encKey: decryptedKeys.slice(0, 32), // first 32 bytes form the key to encrypt/decrypt messages
            macKey: decryptedKeys.slice(32, 64), // last 32 bytes from the key to sign messages
            clientToken: json.clientToken,
            serverToken: json.serverToken,
            clientID: this.authInfo.clientID,
        }
        return onValidationSuccess()
    }
    /**
     * When logging back in (restoring a previously closed session), WhatsApp may challenge one to check if one still has the encryption keys
     * WhatsApp does that by asking for us to sign a string it sends with our macKey
     */
    protected respondToChallenge(challenge: string) {
        const bytes = Buffer.from(challenge, 'base64') // decode the base64 encoded challenge string
        const signed = Utils.hmacSign(bytes, this.authInfo.macKey).toString('base64') // sign the challenge string with our macKey
        const json = ['admin', 'challenge', signed, this.authInfo.serverToken, this.authInfo.clientID] // prepare to send this signed string with the serverToken & clientID
        this.log('resolving login challenge', MessageLogLevel.info)
        return this.query({json, expect200: true, waitForOpen: false})
    }
    /** When starting a new session, generate a QR code by generating a private/public key pair & the keys the server sends */
    protected async generateKeysForAuth(ref: string) {
        this.curveKeys = Curve.generateKeyPair(Utils.randomBytes(32))
        const publicKey = Buffer.from(this.curveKeys.public).toString('base64')

        const emitQR = () => {
            const qr = [ref, publicKey, this.authInfo.clientID].join(',')
            this.emit ('qr', qr)
        }

        const regenQR = () => {
            this.qrTimeout = setTimeout (() => {
                if (this.state === 'open') return

                this.log ('regenerated QR', MessageLogLevel.info)
                
                this.generateNewQRCodeRef ()
                .then (newRef => ref = newRef)
                .then (emitQR)
                .then (regenQR)
                .catch (err => this.log (`error in QR gen: ${err}`, MessageLogLevel.info))
            }, this.regenerateQRIntervalMs)
        }

        emitQR ()
        if (this.regenerateQRIntervalMs) regenQR ()

        const json = await this.waitForMessage('s1', [])
        this.qrTimeout && clearTimeout (this.qrTimeout)
        this.qrTimeout = null
        
        return json
    }
}
