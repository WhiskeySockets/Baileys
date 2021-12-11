import { randomBytes } from 'crypto'
import type { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from "../Types"
import { Curve, signedKeyPair } from './crypto'
import { generateRegistrationId, BufferJSON } from './generics'

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

const KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
	'pre-key': 'preKeys',
	'session': 'sessions',
	'sender-key': 'senderKeys',
	'app-state-sync-key': 'appStateSyncKeys',
	'app-state-sync-version': 'appStateVersions',
	'sender-key-memory': 'senderKeyMemory'
}

/** stores the full authentication state in a single JSON file */
export const useSingleFileAuthState = (filename: string): { state: AuthenticationState, saveState: () => void } => {
	// require fs here so that in case "fs" is not available -- the app does not crash
	const { readFileSync, writeFileSync, existsSync } = require('fs')
	let creds: AuthenticationCreds
	let keys: any = { }

	// save the authentication state to a file
	const saveState = () => {
		console.log('saving auth state')
		writeFileSync(
			filename,
			// BufferJSON replacer utility saves buffers nicely
			JSON.stringify({ creds, keys }, BufferJSON.replacer, 2)
		)
	}
	
    if(existsSync(filename)) {
        const result = JSON.parse(
            readFileSync(filename, { encoding: 'utf-8' }), 
            BufferJSON.reviver
        )
		creds = result.creds
		keys = result.keys
    } else {
        creds = initAuthCreds()
        keys = { }
    }

	return { 
		state: { 
			creds,
			keys: {
				get: (type, ids) => {
					const key = KEY_MAP[type]
					return ids.reduce(
						(dict, id) => {
							const value = keys[key]?.[id]
							if(value) {
								dict[id] = value
							}
							return dict
						}, { }
					)
				},
				set: (data) => {
					for(const _key in data) {
						const key = KEY_MAP[_key as keyof SignalDataTypeMap]
						keys[key] = keys[key] || { }
						Object.assign(keys[key], data[_key])
					}
					saveState()
				}
			}
		}, 
		saveState 
	}
}