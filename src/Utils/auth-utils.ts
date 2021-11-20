import { randomBytes } from 'crypto'
import { proto } from '../../WAProto'
import type { SignalKeyStore, AuthenticationCreds, KeyPair, LTHashState, AuthenticationState } from "../Types"
import { Curve, signedKeyPair } from './crypto'
import { generateRegistrationId, BufferJSON } from './generics'

export const initInMemoryKeyStore = (
	{ preKeys, sessions, senderKeys, appStateSyncKeys, appStateVersions }: { 
		preKeys?: { [k: number]: KeyPair },
		sessions?: { [k: string]: any },
		senderKeys?: { [k: string]: any }
		appStateSyncKeys?: { [k: string]: proto.IAppStateSyncKeyData },
		appStateVersions?: { [k: string]: LTHashState },
	} = { },
	save: (data: any) => void
) => {

	preKeys = preKeys || { }
	sessions = sessions || { }
	senderKeys = senderKeys || { }
	appStateSyncKeys = appStateSyncKeys || { }
	appStateVersions = appStateVersions || { }

	const keyData = {
		preKeys,
		sessions,
		senderKeys,
		appStateSyncKeys,
		appStateVersions,
	}

	return {
		...keyData,
		getPreKey: keyId => preKeys[keyId],
		setPreKey: (keyId, pair) => {
			if(pair) preKeys[keyId] = pair
			else delete preKeys[keyId]

			save(keyData)
		},
		getSession: id => sessions[id],
		setSession: (id, item) => {
			if(item) sessions[id] = item
			else delete sessions[id]

			save(keyData)
		},
		getSenderKey: id => {
			return senderKeys[id]
		},
		setSenderKey: (id, item) => {
			if(item) senderKeys[id] = item
			else delete senderKeys[id]

			save(keyData)
		},
		getAppStateSyncKey: id => {
			const obj = appStateSyncKeys[id]
			if(obj) {
				return proto.AppStateSyncKeyData.fromObject(obj)
			}
		},
		setAppStateSyncKey: (id, item) => {
			if(item) appStateSyncKeys[id] = item
			else delete appStateSyncKeys[id]

			save(keyData)
		},
		getAppStateSyncVersion: id => {
			const obj = appStateVersions[id]
			if(obj) {
				return obj
			}
		},
		setAppStateSyncVersion: (id, item) => {
			if(item) appStateVersions[id] = item
			else delete appStateVersions[id]

			save(keyData)
		}
	} as SignalKeyStore
}

export const initAuthCreds = (): AuthenticationCreds => {
	const identityKey = Curve.generateKeyPair()
	return {
		noiseKey: Curve.generateKeyPair(),
		signedIdentityKey: identityKey,
		signedPreKey: signedKeyPair(identityKey, 1),
		registrationId: generateRegistrationId(),
		advSecretKey: randomBytes(32).toString('base64'),

		nextPreKeyId: 1,
		firstUnuploadedPreKeyId: 1,
		serverHasPreKeys: false
	}
}
/** stores the full authentication state in a single JSON file */
export const useSingleFileAuthState = (filename: string) => {
	// require fs here so that in case "fs" is not available -- the app does not crash
	const { readFileSync, writeFileSync, existsSync } = require('fs')

	let state: AuthenticationState = undefined

	// save the authentication state to a file
	const saveState = () => {
		console.log('saving auth state')
		writeFileSync(
			filename,
			// BufferJSON replacer utility saves buffers nicely
			JSON.stringify(state, BufferJSON.replacer, 2)
		)
	}
	
    if(existsSync(filename)) {
        const { creds, keys } = JSON.parse(
            readFileSync(filename, { encoding: 'utf-8' }), 
            BufferJSON.reviver
        )
        state = { 
            creds: creds, 
            // stores pre-keys, session & other keys in a JSON object
            // we deserialize it here
            keys: initInMemoryKeyStore(keys, saveState) 
        }
    } else {
        const creds = initAuthCreds()
        const keys = initInMemoryKeyStore({ }, saveState)
        state = { creds: creds, keys: keys }
    }

	return { state, saveState }
}