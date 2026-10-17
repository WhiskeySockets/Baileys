import { Mutex } from 'async-mutex'
import { randomBytes } from 'crypto'
import { mkdir, readFile, rename, stat, unlink, writeFile } from 'fs/promises'
import { join } from 'path'
import { proto } from '../../WAProto/index.js'
import type { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from '../Types'
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

// On Windows, rename fails with EPERM/EACCES/EBUSY while another process (antivirus, backup,
// a reader outside this mutex) has the target open. The lock is short-lived, so retry briefly.
// Elsewhere those codes mean a real permission problem, so fail on the first attempt.
const RENAME_RETRY_CODES = new Set(['EPERM', 'EACCES', 'EBUSY'])
const RENAME_ATTEMPTS = process.platform === 'win32' ? 50 : 1
const renameWithRetry = async (from: string, to: string, attempts = RENAME_ATTEMPTS) => {
	for (let i = 1; ; i++) {
		try {
			return await rename(from, to)
		} catch (error) {
			const code = (error as NodeJS.ErrnoException).code
			if (i >= attempts || !code || !RENAME_RETRY_CODES.has(code)) {
				throw error
			}

			await new Promise(resolve => setTimeout(resolve, Math.min(10 * i, 100)))
		}
	}
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
			// writeFile truncates in place, so a crash mid-write leaves an empty or partial file,
			// and readData turns that into null: creds.json is silently replaced by fresh creds.
			// Write a sibling temp file and rename it over the target (atomic on the same filesystem).
			// The mutex only covers this process, so the temp name is unique per write.
			const tmpPath = `${filePath}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`
			try {
				// a new file gets the default mode; keep the target's (e.g. 0600) instead
				const mode = (await stat(filePath).catch(() => undefined))?.mode
				await writeFile(tmpPath, JSON.stringify(data, BufferJSON.replacer), { mode })
				await renameWithRetry(tmpPath, filePath)
			} catch (error) {
				await unlink(tmpPath).catch(() => {})
				throw error
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
						for (const id in data[category as keyof SignalDataTypeMap]) {
							const value = data[category as keyof SignalDataTypeMap]![id]
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
