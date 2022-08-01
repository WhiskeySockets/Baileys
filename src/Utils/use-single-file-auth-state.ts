import type { Logger } from 'pino'
import { proto } from '../../WAProto'
import type { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from '../Types'
import { initAuthCreds } from './auth-utils'
import { BufferJSON } from './generics'

// useless key map only there to maintain backwards compatibility
// do not use in your own systems please
const KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
	'pre-key': 'preKeys',
	'session': 'sessions',
	'sender-key': 'senderKeys',
	'app-state-sync-key': 'appStateSyncKeys',
	'app-state-sync-version': 'appStateVersions',
	'sender-key-memory': 'senderKeyMemory'
}
/**
 * @deprecated use multi file auth state instead please
 * stores the full authentication state in a single JSON file
 *
 * DO NOT USE IN A PROD ENVIRONMENT, only meant to serve as an example
 * */
export const useSingleFileAuthState = (filename: string, logger?: Logger): { state: AuthenticationState, saveState: () => void } => {
	// require fs here so that in case "fs" is not available -- the app does not crash
	const { readFileSync, writeFileSync, existsSync } = require('fs')
	let creds: AuthenticationCreds
	let keys: any = { }

	// save the authentication state to a file
	const saveState = () => {
		logger && logger.trace('saving auth state')
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
							let value = keys[key]?.[id]
							if(value) {
								if(type === 'app-state-sync-key') {
									value = proto.Message.AppStateSyncKeyData.fromObject(value)
								}

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