import {Boom} from '@hapi/boom'
import * as Curve from 'curve25519-js'
import type { Contact } from '../Types/Contact'
import type { AnyAuthenticationCredentials, AuthenticationCredentials, CurveKeyPair } from "../Types"
import { aesDecrypt, hkdf, hmacSign, whatsappID } from './generics'
import { readFileSync } from 'fs'

export const normalizedAuthInfo = (authInfo: AnyAuthenticationCredentials | string) => {
    if (!authInfo) return
    
    if (typeof authInfo === 'string') {
        const file = readFileSync(authInfo, { encoding: 'utf-8' }) // load a closed session back if it exists
        authInfo = JSON.parse(file) as AnyAuthenticationCredentials
    }
    if ('clientID' in authInfo) {
        authInfo = {
            clientID: authInfo.clientID,
            serverToken: authInfo.serverToken,
            clientToken: authInfo.clientToken,
            encKey: Buffer.isBuffer(authInfo.encKey) ? authInfo.encKey : Buffer.from(authInfo.encKey, 'base64'),
            macKey: Buffer.isBuffer(authInfo.macKey) ? authInfo.macKey : Buffer.from(authInfo.macKey, 'base64'), 
        }
    } else {
        const secretBundle: {encKey: string, macKey: string} = typeof authInfo.WASecretBundle === 'string' ? JSON.parse (authInfo.WASecretBundle): authInfo.WASecretBundle
        authInfo = {
            clientID: authInfo.WABrowserId.replace(/\"/g, ''),
            serverToken: authInfo.WAToken2.replace(/\"/g, ''),
            clientToken: authInfo.WAToken1.replace(/\"/g, ''),
            encKey: Buffer.from(secretBundle.encKey, 'base64'), // decode from base64
            macKey: Buffer.from(secretBundle.macKey, 'base64'), // decode from base64
        }
    }   
    return authInfo as AuthenticationCredentials
}
/**
* Once the QR code is scanned and we can validate our connection, or we resolved the challenge when logging back in
* @private
* @param json
*/
export const validateNewConnection = (
	json: { [_: string]: any }, 
	auth: AuthenticationCredentials,
	curveKeys: CurveKeyPair
) => {
   // set metadata: one's WhatsApp ID [cc][number]@s.whatsapp.net, name on WhatsApp, info about the phone
   const onValidationSuccess = () => {
	   const user: Contact = {
           jid: whatsappID(json.wid),
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
   const expandedKey = hkdf(sharedKey as Buffer, 80)

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
export const computeChallengeResponse = (challenge: string, auth: AuthenticationCredentials) => {
	const bytes = Buffer.from(challenge, 'base64') // decode the base64 encoded challenge string
	const signed = hmacSign(bytes, auth.macKey).toString('base64') // sign the challenge string with our macKey
	return[ 'admin', 'challenge', signed, auth.serverToken, auth.clientID] // prepare to send this signed string with the serverToken & clientID
}