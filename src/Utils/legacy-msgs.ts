import { Boom } from '@hapi/boom'
import { randomBytes } from 'crypto'
import { decodeBinaryNodeLegacy, jidNormalizedUser } from "../WABinary"
import { aesDecrypt, hmacSign, hkdf, Curve } from "./crypto"
import { BufferJSON } from './generics'
import { DisconnectReason, WATag, LegacyAuthenticationCreds, CurveKeyPair, Contact } from "../Types"

export const newLegacyAuthCreds = () => ({
    clientID: randomBytes(16).toString('base64')
}) as LegacyAuthenticationCreds

export const decodeWAMessage = (
    message: Buffer | string, 
    auth: { macKey: Buffer, encKey: Buffer }, 
    fromMe: boolean=false
) => {
    let commaIndex = message.indexOf(',') // all whatsapp messages have a tag and a comma, followed by the actual message
    if (commaIndex < 0) throw new Boom('invalid message', { data: message }) // if there was no comma, then this message must be not be valid
    
    if (message[commaIndex+1] === ',') commaIndex += 1
    let data = message.slice(commaIndex+1, message.length)
    
    // get the message tag.
    // If a query was done, the server will respond with the same message tag we sent the query with
    const messageTag: string = message.slice(0, commaIndex).toString()
    let json: any
    let tags: WATag
    if(data.length) {
        const possiblyEnc = (data.length > 32 && data.length % 16 === 0)
        if(typeof data === 'string' || !possiblyEnc) {
            json = JSON.parse(data.toString()) // parse the JSON
        } else {
            try {
                json = JSON.parse(data.toString())
            } catch {
                const { macKey, encKey } = auth || {}
                if (!macKey || !encKey) {
                    throw new Boom('recieved encrypted buffer when auth creds unavailable', { data: message, statusCode: DisconnectReason.badSession })
                }
                /* 
                    If the data recieved was not a JSON, then it must be an encrypted message.
                    Such a message can only be decrypted if we're connected successfully to the servers & have encryption keys
                */
                if (fromMe) {
                    tags = [data[0], data[1]]
                    data = data.slice(2, data.length)
                }
                
                const checksum = data.slice(0, 32) // the first 32 bytes of the buffer are the HMAC sign of the message
                data = data.slice(32, data.length) // the actual message
                const computedChecksum = hmacSign(data, macKey) // compute the sign of the message we recieved using our macKey
                
                if (checksum.equals(computedChecksum)) {
                    // the checksum the server sent, must match the one we computed for the message to be valid
                    const decrypted = aesDecrypt(data, encKey) // decrypt using AES
                    json = decodeBinaryNodeLegacy(decrypted, { index: 0 }) // decode the binary message into a JSON array
                } else {
                    throw new Boom('Bad checksum', {
                        data: {
                            received: checksum.toString('hex'),
                            computed: computedChecksum.toString('hex'),
                            data: data.slice(0, 80).toString(),
                            tag: messageTag,
                            message: message.slice(0, 80).toString()
                        },
                        statusCode: DisconnectReason.badSession
                    })
                }
            }
        }   
    }
    return [messageTag, json, tags] as const
}

/**
* Once the QR code is scanned and we can validate our connection, or we resolved the challenge when logging back in
* @private
* @param json
*/
export const validateNewConnection = (
	json: { [_: string]: any }, 
	auth: LegacyAuthenticationCreds,
	curveKeys: CurveKeyPair
) => {
   // set metadata: one's WhatsApp ID [cc][number]@s.whatsapp.net, name on WhatsApp, info about the phone
   const onValidationSuccess = () => {
	   const user: Contact = {
           id: jidNormalizedUser(json.wid),
           name: json.pushname
       }
	   return { user, auth, phone: json.phone }
   }
   if (!json.secret) {
	   // if we didn't get a secret, we don't need it, we're validated
	   if (json.clientToken && json.clientToken !== auth.clientToken) {
			auth = { ...auth, clientToken: json.clientToken }
	   }
	   if (json.serverToken && json.serverToken !== auth.serverToken) {
		   auth = { ...auth, serverToken: json.serverToken }
	   }
	   return onValidationSuccess()
   }
   const secret = Buffer.from(json.secret, 'base64')
   if (secret.length !== 144) {
	   throw new Error ('incorrect secret length received: ' + secret.length)
   }

   // generate shared key from our private key & the secret shared by the server
   const sharedKey = Curve.sharedKey(curveKeys.private, secret.slice(0, 32))
   // expand the key to 80 bytes using HKDF
   const expandedKey = hkdf(sharedKey as Buffer, 80, { })

   // perform HMAC validation.
   const hmacValidationKey = expandedKey.slice(32, 64)
   const hmacValidationMessage = Buffer.concat([secret.slice(0, 32), secret.slice(64, secret.length)])

   const hmac = hmacSign(hmacValidationMessage, hmacValidationKey)

   if (!hmac.equals(secret.slice(32, 64))) {
	   // if the checksums didn't match
	   throw new Boom('HMAC validation failed', { statusCode: 400 })
   }

   // computed HMAC should equal secret[32:64]
   // expandedKey[64:] + secret[64:] are the keys, encrypted using AES, that are used to encrypt/decrypt the messages recieved from WhatsApp
   // they are encrypted using key: expandedKey[0:32]
   const encryptedAESKeys = Buffer.concat([
	   expandedKey.slice(64, expandedKey.length),
	   secret.slice(64, secret.length),
   ])
   const decryptedKeys = aesDecrypt(encryptedAESKeys, expandedKey.slice(0, 32))
   // set the credentials
   auth = {
	   encKey: decryptedKeys.slice(0, 32), // first 32 bytes form the key to encrypt/decrypt messages
	   macKey: decryptedKeys.slice(32, 64), // last 32 bytes from the key to sign messages
	   clientToken: json.clientToken,
	   serverToken: json.serverToken,
	   clientID: auth.clientID,
   }
   return onValidationSuccess()
}

export const computeChallengeResponse = (challenge: string, auth: LegacyAuthenticationCreds) => {
	const bytes = Buffer.from(challenge, 'base64') // decode the base64 encoded challenge string
	const signed = hmacSign(bytes, auth.macKey).toString('base64') // sign the challenge string with our macKey
	return['admin', 'challenge', signed, auth.serverToken, auth.clientID] // prepare to send this signed string with the serverToken & clientID
}

export const useSingleFileLegacyAuthState = (file: string) => {
    // require fs here so that in case "fs" is not available -- the app does not crash
	const { readFileSync, writeFileSync, existsSync } = require('fs')
    let state: LegacyAuthenticationCreds

    if(existsSync(file)) {
        state = JSON.parse(
            readFileSync(file, { encoding: 'utf-8' }), 
            BufferJSON.reviver
        )
        if(typeof state.encKey === 'string') {
            state.encKey = Buffer.from(state.encKey, 'base64')
        }
        if(typeof state.macKey === 'string') {
            state.macKey = Buffer.from(state.macKey, 'base64')
        }
    } else {
        state = newLegacyAuthCreds()
    }

    return {
        state,
        saveState: () => {
            const str = JSON.stringify(state, BufferJSON.replacer, 2)
            writeFileSync(file, str)
        }
    }
}