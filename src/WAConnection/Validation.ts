import * as Curve from 'curve25519-js'
import * as Utils from './Utils'
import WAConnectionBase from './Base'

export default class WAConnectionValidator extends WAConnectionBase {
    /** Authenticate the connection */
    protected async authenticate() {
        if (!this.authInfo.clientID) {
            // if no auth info is present, that is, a new session has to be established
            // generate a client ID
            this.authInfo = {
                clientID: Utils.generateClientID(),
                clientToken: null,
                serverToken: null,
                encKey: null,
                macKey: null,
            }
        }

        const data = ['admin', 'init', this.version, this.browserDescription, this.authInfo.clientID, true]
        return this.query(data)
            .then((json) => {
                // we're trying to establish a new connection or are trying to log in
                switch (json.status) {
                    case 200: // all good and we can procede to generate a QR code for new connection, or can now login given present auth info
                        if (this.authInfo.encKey && this.authInfo.macKey) {
                            // if we have the info to restore a closed session
                            const data = [
                                'admin',
                                'login',
                                this.authInfo.clientToken,
                                this.authInfo.serverToken,
                                this.authInfo.clientID,
                                'takeover',
                            ]
                            return this.query(data, null, null, 's1') // wait for response with tag "s1"
                        } else {
                            return this.generateKeysForAuth(json.ref)
                        }
                    default:
                        throw [json.status, 'unknown error', json]
                }
            })
            .then((json) => {
                switch (json.status) {
                    case 401: // if the phone was unpaired
                        throw [json.status, 'unpaired from phone', json]
                    case 429: // request to login was denied, don't know why it happens
                        throw [json.status, 'request denied, try reconnecting', json]
                    case 304: // request to generate a new key for a QR code was denied
                        throw [json.status, 'request for new key denied', json]
                    default:
                        break
                }
                if (json[1] && json[1].challenge) {
                    // if its a challenge request (we get it when logging in)
                    return this.respondToChallenge(json[1].challenge).then((json) => {
                        if (json.status !== 200) {
                            // throw an error if the challenge failed
                            throw [json.status, 'unknown error', json]
                        }
                        return this.waitForMessage('s2', []) // otherwise wait for the validation message
                    })
                } else {
                    // otherwise just chain the promise further
                    return json
                }
            })
            .then((json) => {
                this.validateNewConnection(json[1]) // validate the connection
                this.log('validated connection successfully')
                this.lastSeen = new Date() // set last seen to right now
                return this.userMetaData
            })
    }
    /**
     * Once the QR code is scanned and we can validate our connection, or we resolved the challenge when logging back in
     * @private
     * @param {object} json
     */
    private validateNewConnection(json) {
        const onValidationSuccess = () => {
            // set metadata: one's WhatsApp ID [cc][number]@s.whatsapp.net, name on WhatsApp, info about the phone
            this.userMetaData = {
                id: json.wid.replace('@c.us', '@s.whatsapp.net'),
                name: json.pushname,
                phone: json.phone,
            }
            return this.userMetaData
        }

        if (json.connected) {
            // only if we're connected
            if (!json.secret) {
                // if we didn't get a secret, we don't need it, we're validated
                return onValidationSuccess()
            }
            const secret = Buffer.from(json.secret, 'base64')
            if (secret.length !== 144) {
                throw [4, 'incorrect secret length: ' + secret.length]
            }
            // generate shared key from our private key & the secret shared by the server
            const sharedKey = Curve.sharedKey(this.curveKeys.private, secret.slice(0, 32))
            // expand the key to 80 bytes using HKDF
            const expandedKey = Utils.hkdf(sharedKey as Buffer, 80)

            // perform HMAC validation.
            const hmacValidationKey = expandedKey.slice(32, 64)
            const hmacValidationMessage = Buffer.concat([secret.slice(0, 32), secret.slice(64, secret.length)])

            const hmac = Utils.hmacSign(hmacValidationMessage, hmacValidationKey)

            if (hmac.equals(secret.slice(32, 64))) {
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
            } else {
                // if the checksums didn't match
                throw [5, 'HMAC validation failed']
            }
        } else {
            // if we didn't get the connected field (usually we get this message when one opens WhatsApp on their phone)
            throw [6, 'json connection failed', json]
        }
    }
    /**
     * When logging back in (restoring a previously closed session), WhatsApp may challenge one to check if one still has the encryption keys
     * WhatsApp does that by asking for us to sign a string it sends with our macKey
     */
    protected respondToChallenge(challenge: string) {
        const bytes = Buffer.from(challenge, 'base64') // decode the base64 encoded challenge string
        const signed = Utils.hmacSign(bytes, this.authInfo.macKey).toString('base64') // sign the challenge string with our macKey
        const data = ['admin', 'challenge', signed, this.authInfo.serverToken, this.authInfo.clientID] // prepare to send this signed string with the serverToken & clientID
        this.log('resolving login challenge')
        return this.query(data)
    }
    /**
     * When starting a new session, generate a QR code by generating a private/public key pair & the keys the server sends
     * @private
     */
    protected generateKeysForAuth(ref: string) {
        this.curveKeys = Curve.generateKeyPair(Utils.randomBytes(32))
        this.onReadyForPhoneAuthentication([
            ref,
            Buffer.from(this.curveKeys.public).toString('base64'),
            this.authInfo.clientID,
        ])
        return this.waitForMessage('s1', [])
    }
}
