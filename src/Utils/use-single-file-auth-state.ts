import AsyncLock from 'async-lock'
import { readFile, stat, writeFile } from 'fs/promises'
import { proto } from '../../WAProto/index'
import { AuthenticationState, SignalDataTypeMap } from '../Types/index'
import { initAuthCreds } from './auth-utils'
import { BufferJSON } from './generics'

const fileLock = new AsyncLock({ maxPending: Infinity })

export const useSingleFileAuthState = async(filepath: string): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void> }> => {
    const filePath = filepath + '.json'

	const writeData = (data: any) => {
		return fileLock.acquire(
			filePath,
			() => writeFile(filePath, JSON.stringify(data, BufferJSON.replacer))
		)
	}

	const readData = async() => {
		try {
			const data = await fileLock.acquire(
				filePath,
				() => readFile(filePath, { encoding: 'utf-8' })
			)
			return JSON.parse(data, BufferJSON.reviver)
		} catch(error) {
			return null
		}
	}

	const fileInfo = await stat(filePath).catch(() => null)
	if(fileInfo && !fileInfo.isFile()) {
		throw new Error(`A non-file exists at ${filePath}, please delete it or specify a different path.`)
	}

	// Initialize with default credentials if the file is empty or doesn't exist
	const { creds = initAuthCreds(), keys = {} } = await readData() || {}

	return {
		state: {
			creds,
			keys: {
				get: async(type, ids) => {
					const data: { [_: string]: SignalDataTypeMap[typeof type] } = {}
					for(const id of ids) {
						const value = keys[`${type}-${id}`]
						data[id] = type === 'app-state-sync-key' && value
							? proto.Message.AppStateSyncKeyData.fromObject(value)
							: value
					}

					return data
				},
				set: async(data) => {
					for(const category in data) {
						for(const id in data[category]) {
							const value = data[category][id]
							if(value) {
								keys[`${category}-${id}`] = value
							} else {
								delete keys[`${category}-${id}`]
							}
						}
					}

					await writeData({ creds, keys })
				}
			}
		},
		saveCreds: () => writeData({ creds, keys })
	}
}
