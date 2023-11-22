import { mkdir, stat, unlink } from 'fs/promises'
import {createReadStream, createWriteStream} from 'fs'
import { join } from 'path'
import { proto } from '../../WAProto'
import { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from '../Types'
import { initAuthCreds } from './auth-utils'
import { BufferJSON } from './generics'

/**
 * stores the full authentication state in a single folder.
 * Far more efficient than singlefileauthstate
 *
 * Again, I wouldn't endorse this for any production level use other than perhaps a bot.
 * Would recommend writing an auth state for use with a proper SQL or No-SQL DB
 * */
export const useMultiFileAuthState = async(folder: string): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void> }> => {

	
	const writeData = async (data: any, file: string) => {
		const filePath = join(folder, fixFileName(file)!);
		return new Promise<void>((resolve, reject) => {
		  const writeStream = createWriteStream(filePath);
		  writeStream.on('error', reject);
		  writeStream.on('finish', resolve);
		  writeStream.write(JSON.stringify(data, BufferJSON.replacer));
		  writeStream.end();
		});
	  };
	  
	
	  const readData = async (file: string) => {
		try {
		  const filePath = join(folder, fixFileName(file)!);
		  const fileExists = await stat(filePath).catch(() => null);
		  if(!fileExists) return null
		  return new Promise<any>((resolve, reject) => {
			const readStream = createReadStream(filePath, { encoding: 'utf-8' });
			let data = '';
			readStream.on('data', (chunk) => {
			  data += chunk;
			});
			readStream.on('end', () => {
			  resolve(JSON.parse(data, BufferJSON.reviver));
			});
			readStream.on('error', (error) => {
			  reject(error);
			});
		  });
		} catch (error) {
		  return null;
		}
	  };

	const removeData = async(file: string) => {
		try {
			await unlink(join(folder, fixFileName(file)!))
		} catch{

		}
	}

	const folderInfo = await stat(folder).catch(() => { })
	if(folderInfo) {
		if(!folderInfo.isDirectory()) {
			throw new Error(`found something that is not a directory at ${folder}, either delete it or specify a different location`)
		}
	} else {
		await mkdir(folder, { recursive: true })
	}

	const fixFileName = (file?: string) => file?.replace(/\//g, '__')?.replace(/:/g, '-')

	const creds: AuthenticationCreds = await readData('creds.json') || initAuthCreds()

	return {
		state: {
			creds,
			keys: {
				get: async(type, ids) => {
					const data: { [_: string]: SignalDataTypeMap[typeof type] } = { }
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

					return data
				},
				set: async(data) => {
					const tasks: Promise<void>[] = []
					for(const category in data) {
						for(const id in data[category]) {
							const value = data[category][id]
							const file = `${category}-${id}.json`
							tasks.push(value ? writeData(value, file) : removeData(file))
						}
					}

					await Promise.all(tasks)
				}
			}
		},
		saveCreds: () => {
			return writeData(creds, 'creds.json')
		}
	}
}