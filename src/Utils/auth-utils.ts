import { Boom } from '@hapi/boom'
import { randomBytes } from 'crypto'
import type { Logger } from 'pino'
import { proto } from '../../WAProto'
import type { AuthenticationCreds, AuthenticationState, SignalDataTypeMap, SignalDataSet, SignalKeyStore, SignalKeyStoreWithTransaction } from "../Types"
import { Curve, signedKeyPair } from './crypto'
import { generateRegistrationId, BufferJSON } from './generics'

const KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
	'pre-key': 'preKeys',
	'session': 'sessions',
	'sender-key': 'senderKeys',
	'app-state-sync-key': 'appStateSyncKeys',
	'app-state-sync-version': 'appStateVersions',
	'sender-key-memory': 'senderKeyMemory'
}

export const addTransactionCapability = (state: SignalKeyStore, logger: Logger): SignalKeyStoreWithTransaction => {
	let inTransaction = false
	let transactionCache: SignalDataSet = { }
	let mutations: SignalDataSet = { }

	const prefetch = async(type: keyof SignalDataTypeMap, ids: string[]) => {
		if(!inTransaction) {
			throw new Boom('Cannot prefetch without transaction')
		}

		const dict = transactionCache[type]
		const idsRequiringFetch = dict ? ids.filter(item => !(item in dict)) : ids
		// only fetch if there are any items to fetch
		if(idsRequiringFetch.length) {
			const result = await state.get(type, idsRequiringFetch)

			transactionCache[type] = transactionCache[type] || { }
			Object.assign(transactionCache[type], result)
		}
	}

	return {
		get: async(type, ids) => {
			if(inTransaction) {
				await prefetch(type, ids)
				return ids.reduce(
					(dict, id) => {
						const value = transactionCache[type]?.[id]
						if(value) {
							dict[id] = value
						}
						return dict
					}, { }
				)
			} else {
				return state.get(type, ids)
			}
		},
		set: data => {
			if(inTransaction) {
				logger.trace({ types: Object.keys(data) }, `caching in transaction`)
				for(const key in data) {
					transactionCache[key] = transactionCache[key] || { }
					Object.assign(transactionCache[key], data[key])

					mutations[key] = mutations[key] || { }
					Object.assign(mutations[key], data[key])
				}
			} else {
				return state.set(data)
			}
		},
		isInTransaction: () => inTransaction,
		prefetch: (type, ids) => {
			logger.trace({ type, ids }, `prefetching`)
			return prefetch(type, ids)
		},
		transaction: async(work) => {
			if(inTransaction) {
				await work()
			} else {
				logger.debug('entering transaction')
				inTransaction = true
				try {
					await work()
					if(Object.keys(mutations).length) {
						logger.debug('committing transaction')
						await state.set(mutations)
					} else {
						logger.debug('no mutations in transaction')
					}
				} finally {
					inTransaction = false
					transactionCache = { }
					mutations = { }
				}
			}
		}
	}
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
									value = proto.AppStateSyncKeyData.fromObject(value)
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