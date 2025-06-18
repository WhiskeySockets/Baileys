import { Mutex } from 'async-mutex'
import { mkdir, readFile, stat, unlink, writeFile } from 'fs/promises'
import { join } from 'path'
import { proto } from '../../WAProto'
import { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from '../Types'
import { initAuthCreds } from './auth-utils'
import { BufferJSON } from './generics'

// We need to lock files due to the fact that we are using async functions to read and write files
// https://github.com/WhiskeySockets/Baileys/issues/794
// https://github.com/nodejs/node/issues/26338
// Use a Map to store mutexes for each file path
const fileLocks = new Map<string, Mutex>()

// Get or create a mutex for a specific file path
const getFileLock = (path: string): Mutex => {
	let mutex = fileLocks.get(path)
	if (!mutex) {
		mutex = new Mutex()
		fileLocks.set(path, mutex)
	}

	return mutex
}

/**
 * stores the full authentication state in a single folder.
 * Far more efficient than singlefileauthstate
 *
 * Again, I wouldn't endorse this for any production level use other than perhaps a bot.
 * Would recommend writing an auth state for use with a proper SQL or No-SQL DB
 * */
export const useMultiFileAuthState = async (
	folder: string
): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }> => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const writeData = async (data: any, file: string) => {
		const filePath = join(folder, fixFileName(file)!)
		const mutex = getFileLock(filePath)

		return mutex.acquire().then(async release => {
			try {
				await writeFile(filePath, JSON.stringify(data, BufferJSON.replacer))
			} finally {
				release()
			}
		})
	}

	const readData = async (file: string) => {
		try {
			const filePath = join(folder, fixFileName(file)!)
			const mutex = getFileLock(filePath)

			return await mutex.acquire().then(async release => {
				try {
					const data = await readFile(filePath, { encoding: 'utf-8' })
					return JSON.parse(data, BufferJSON.reviver)
				} finally {
					release()
				}
			})
		} catch (error) {
			return null
		}
	}

	const removeData = async (file: string) => {
		try {
			const filePath = join(folder, fixFileName(file)!)
			const mutex = getFileLock(filePath)

			return mutex.acquire().then(async release => {
				try {
					await unlink(filePath)
				} catch {
				} finally {
					release()
				}
			})
		} catch {}
	}

	const folderInfo = await stat(folder).catch(() => {})
	if (folderInfo) {
		if (!folderInfo.isDirectory()) {
			throw new Error(
				`found something that is not a directory at ${folder}, either delete it or specify a different location`
			)
		}
	} else {
		await mkdir(folder, { recursive: true })
	}

	const fixFileName = (file?: string) => file?.replace(/\//g, '__')?.replace(/:/g, '-')

	const creds: AuthenticationCreds = (await readData('creds.json')) || initAuthCreds()

	return {
		state: {
			creds,
			keys: {
				get: async (type, ids) => {
					const data: { [_: string]: SignalDataTypeMap[typeof type] } = {}
					await Promise.all(
						ids.map(async id => {
							let value = await readData(`${type}-${id}.json`)
							if (type === 'app-state-sync-key' && value) {
								value = proto.Message.AppStateSyncKeyData.fromObject(value)
							}

							data[id] = value
						})
					)

					return data
				},
				set: async data => {
					const tasks: Promise<void>[] = []
					for (const category in data) {
						for (const id in data[category]) {
							const value = data[category][id]
							const file = `${category}-${id}.json`
							tasks.push(value ? writeData(value, file) : removeData(file))
						}
					}

					await Promise.all(tasks)
				}
			}
		},
		saveCreds: async () => {
			return writeData(creds, 'creds.json')
		}
	}
}
