import * as Curve from 'curve25519-js'
import * as Utils from './Utils'
import {WAConnection as Base} from './0.Base'
import { WAMetric, WAFlag, BaileysError, Presence, WAUser, WAInitResponse, WAOpenResult } from './Constants'

export class WAConnection extends Base {

    /** Authenticate the connection */
    protected async authenticate (reconnect?: string) {
        // if no auth info is present, that is, a new session has to be established
        // generate a client ID
        if (!this.authInfo?.clientID) {
            this.authInfo = { clientID: Utils.generateClientID() } as any
        }
        const canLogin = this.canLogin()      
        this.referenceDate = new Date () // refresh reference date

        this.connectionDebounceTimeout.start()
        
        const initQuery = (async () => {
            const {ref, ttl} = await this.query({
                json: ['admin', 'init', this.version, this.browserDescription, this.authInfo?.clientID, true], 
                expect200: true, 
                waitForOpen: false, 
                longTag: true,
                requiresPhoneConnection: false,
                startDebouncedTimeout: true
            }) as WAInitResponse

            if (!canLogin) {
                this.connectionDebounceTimeout.cancel() // stop the debounced timeout for QR gen
                this.generateKeysForAuth (ref, ttl)
            }
        })();
        let loginTag: string
        if (canLogin) {
            // if we have the info to restore a closed session
            const json = [
                'admin',
                'login',
                this.authInfo?.clientToken,
                this.authInfo?.serverToken,
                this.authInfo?.clientID,
            ]
            loginTag = this.generateMessageTag(true)
            
            if (reconnect) json.push(...['reconnect', reconnect.replace('@s.whatsapp.net', '@c.us')])
            else json.push ('takeover')
            // send login every 10s
            const sendLoginReq = () => {
                if (!this.conn || this.conn?.readyState !== this.conn.OPEN) {
                    this.logger.warn('Received login timeout req when WS not open, ignoring...')
                    return
                }
                if (this.state === 'open') {
                    this.logger.warn('Received login timeout req when state=open, ignoring...')
                    return
                }
                this.logger.debug('sending login request')
                this.sendJSON(json, loginTag)
                this.initTimeout = setTimeout(sendLoginReq, 10_000)
            }
            sendLoginReq()
        }
                        
        await initQuery

        // wait for response with tag "s1"
        let response = await Promise.race(
            [
                this.waitForMessage('s1', false, undefined),
                loginTag && this.waitForMessage(loginTag, false, undefined)
            ]
            .filter(Boolean)
        )
        this.connectionDebounceTimeout.start()
        this.initTimeout && clearTimeout (this.initTimeout)
        this.initTimeout = null

        if (response.status && response.status !== 200) {
            throw new BaileysError(`Unexpected error in login`, { response, status: response.status })
        }
        // if its a challenge request (we get it when logging in)
        if (response[1]?.challenge) {
            await this.respondToChallenge(response[1].challenge)
            response = await this.waitForMessage('s2', true)
        }
        
        const result = this.validateNewConnection(response[1])// validate the connection
        if (result.user.jid !== this.user?.jid) {
            result.isNewUser = true
            // clear out old data
            this.chats.clear()
            this.contacts = {}
        }
        this.user = result.user
        
        this.logger.info('validated connection successfully')
        
        return result
    }
    /** 
     * Refresh QR Code 
     * @returns the new ref
     */
    async requestNewQRCodeRef() {
        const response = await this.query({
            json: ['admin', 'Conn', 'reref'], 
            expect200: true, 
            waitForOpen: false, 
            longTag: true,
            requiresPhoneConnection: false
        })
        return response as WAInitResponse
    }
    /**
     * Once the QR code is scanned and we can validate our connection, or we resolved the challenge when logging back in
     * @private
     * @param {object} json
     */
    private validateNewConnection(json) {
        // set metadata: one's WhatsApp ID [cc][number]@s.whatsapp.net, name on WhatsApp, info about the phone
        const onValidationSuccess = () => ({
            user: {
                jid: Utils.whatsappID(json.wid),
                name: json.pushname,
                phone: json.phone,
                imgUrl: null
            },
            auth: this.authInfo
        }) as WAOpenResult

        if (!json.secret) {
            // if we didn't get a secret, we don't need it, we're validated
            if (json.clientToken && json.clientToken !== this.authInfo.clientToken) {
                this.authInfo = { ...this.authInfo, clientToken: json.clientToken }
            }
            if (json.serverToken && json.serverToken !== this.authInfo.serverToken) {
                this.authInfo = { ...this.authInfo, serverToken: json.serverToken }
            }
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
        
        this.logger.info('resolving login challenge')
        return this.query({json, expect200: true, waitForOpen: false, startDebouncedTimeout: true})
    }
    /** When starting a new session, generate a QR code by generating a private/public key pair & the keys the server sends */
    protected generateKeysForAuth(ref: string, ttl?: number) {
        this.curveKeys = Curve.generateKeyPair(Utils.randomBytes(32))
        const publicKey = Buffer.from(this.curveKeys.public).toString('base64')

        const qrLoop = ttl => {
            const qr = [ref, publicKey, this.authInfo.clientID].join(',')
            this.emit ('qr', qr)

            this.initTimeout = setTimeout (async () => {
                if (this.state === 'open') return

                this.logger.debug ('regenerating QR')
                try {
                    const {ref: newRef, ttl: newTTL} = await this.requestNewQRCodeRef()
                    ttl = newTTL
                    ref = newRef
                } catch (error) {
                    this.logger.warn ({ error }, `error in QR gen`)
                    // @ts-ignore
                    if (error.status === 429 && this.state !== 'open') { // too many QR requests
                        this.endConnection(error.message)
                        return
                    }
                }
                qrLoop (ttl)
            }, ttl || 20_000) // default is 20s, on the off-chance ttl is not present
        }
        qrLoop (ttl)
    }
}
