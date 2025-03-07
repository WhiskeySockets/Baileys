/*CF import AsyncLock from 'async-lock' */
/*CF import { mkdir, readFile, stat, unlink, writeFile } from 'fs/promises' */
import { join } from 'path'
/*CF import { proto } from '../../WAProto' */
import { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from '../Types'
import { initAuthCreds } from './auth-utils'
import { BufferJSON } from './generics'
import { R2Bucket } from '@cloudflare/workers-types' //CF

// We need to lock files due to the fact that we are using async functions to read and write files
// https://github.com/WhiskeySockets/Baileys/issues/794
// https://github.com/nodejs/node/issues/26338
// Default pending is 1000, set it to infinity
// https://github.com/rogierschouten/async-lock/issues/63
/*CF const fileLock = new AsyncLock({ maxPending: Infinity }) */

/**
 * stores the full authentication state in a single folder.
 * Far more efficient than singlefileauthstate
 *
 * Again, I wouldn't endorse this for any production level use other than perhaps a bot.
 * Would recommend writing an auth state for use with a proper SQL or No-SQL DB
 * */
export const useMultiFileAuthState = async(folder: string, Parameter_R2Bucket: R2Bucket): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void> }> => { //CF
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	/*CF const writeData = (data: any, file: string) => {
		const filePath = join(folder, fixFileName(file)!)
		return fileLock.acquire(
			filePath,
			() => writeFile(join(filePath), JSON.stringify(data, BufferJSON.replacer))
		)
	} */

	/*CF const readData = async(file: string) => {
		try {
			const filePath = join(folder, fixFileName(file)!)
			const data = await fileLock.acquire(
				filePath,
				() => readFile(filePath, { encoding: 'utf-8' })
			)
			return JSON.parse(data, BufferJSON.reviver)
		} catch(error) {
			return null
		}
	} */

	/*CF const removeData = async(file: string) => {
		try {
			const filePath = join(folder, fixFileName(file)!)
			await fileLock.acquire(
				filePath,
				() => unlink(filePath)
			)
		} catch{

		}
	} */

	/*CF const folderInfo = await stat(folder).catch(() => { })
	if(folderInfo) {
		if(!folderInfo.isDirectory()) {
			throw new Error(`found something that is not a directory at ${folder}, either delete it or specify a different location`)
		}
	} else {
		await mkdir(folder, { recursive: true })
	} */

	const writeData = async (data: any, file: string) => {
		const Const_filePath = join(join(folder, fixFileName(file)!))
		const Const_dataFormatted = JSON.stringify(data, BufferJSON.replacer)

		await Parameter_R2Bucket.put(Const_filePath, Const_dataFormatted)
	}

	const readData = async(file: string) => {
		try {
			const Const_filePath = join(folder, fixFileName(file)!)

			console.log("Const_filePath", Const_filePath)

			const Const_resultGetR2  = await Parameter_R2Bucket.get(Const_filePath)
			if (!Const_resultGetR2) { return null }

			const Const_data = await Const_resultGetR2.text()

			////console.log('Const_data 1111111', Const_data)

			return JSON.parse(Const_data, BufferJSON.reviver)
		} catch(error) {
			return null
		}
	}

	const removeData = async(file: string) => {
		try {
			const filePath = join(folder, fixFileName(file)!)
			await Parameter_R2Bucket.delete(filePath)
		} catch{

		}
	}

	const fixFileName = (file?: string) => file?.replace(/\//g, '__')?.replace(/:/g, '-')

	const creds: AuthenticationCreds = await readData('creds.json') || initAuthCreds()

	return {
		state: {
			creds,
			keys: {
				get: async(type, ids) => {
					/*CF const data: { [_: string]: SignalDataTypeMap[typeof type] } = { }
					await Promise.all(
						ids.map(
							async id => {
								let value = await readData(`${type}-${id}.json`)
								if(type === 'app-state-sync-key' && value) {
									value = proto.Message.AppStateSyncKeyData.fromObject(value)
								}

								data[id] = value
							}
						)
					)

					return data */

					//CF \/
					const data: { [_: string]: SignalDataTypeMap[typeof type] } = { }
					ids.map(
						id => {
							let value = null as any
							data[id] = value
						}
					)
					//CF /\

					return data
				},
				set: async(data) => {
					/*CF const tasks: Promise<void>[] = []
					for(const category in data) {
						for(const id in data[category]) {
							const value = data[category][id]
							const file = `${category}-${id}.json`
							tasks.push(value ? writeData(value, file) : removeData(file))
						}
					}

					await Promise.all(tasks) */

					return void 0 //CF
				}
			}
		},
		saveCreds: async () => { //CF
			return await writeData(creds, 'creds.json') //CF
		}
	}
}
