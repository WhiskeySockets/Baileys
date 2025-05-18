import type { Storage } from 'unstorage'
import { proto } from '../../WAProto'
import {
	AuthenticationCreds,
	AuthenticationState,
	SignalDataTypeMap,
} from '../Types'
import { initAuthCreds } from './auth-utils'
import { BufferJSON } from './generics'

export const useUnstorageAuthState = async(
	store: Storage,
	prefix = 'auth:',
): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void> }> => {
	const fixKey = (key: string) => `${prefix}${key}`

	const writeData = async(data: any, key: string) => {
		const jsonString = JSON.stringify(data, BufferJSON.replacer)
		await store.setItem(fixKey(key), jsonString)
	}

	const readData = async(key: string) => {
		const raw = await store.getItem<string>(fixKey(key))

		return raw ? JSON.parse(JSON.stringify(raw), BufferJSON.reviver) : null
	}

	const removeData = async(key: string) => {
		await store.removeItem(fixKey(key))
	}

	const creds: AuthenticationCreds = (await readData('creds')) ||
		initAuthCreds()

	return {
		state: {
			creds,
			keys: {
				get: async(type, ids) => {
					const data: { [_: string]: SignalDataTypeMap[typeof type] } = {}
					await Promise.all(
						ids.map(async(id) => {
							let value = await readData(`${type}-${id}`)
							if(type === 'app-state-sync-key' && value) {
								value = proto.Message.AppStateSyncKeyData.fromObject(value)
							}

							data[id] = value
						}),
					)
					return data
				},
				set: async(data) => {
					const tasks: Promise<void>[] = []
					for(const category in data) {
						for(const id in data[category]) {
							const value = data[category][id]
							const key = `${category}-${id}`
							tasks.push(value ? writeData(value, key) : removeData(key))
						}
					}

					await Promise.all(tasks)
				},
			},
		},
		saveCreds: async() => {
			await writeData(creds, 'creds')
		},
	}
}