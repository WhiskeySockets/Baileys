import { Cache, caching } from 'cache-manager'
import { RedisStore, redisStore } from 'cache-manager-ioredis-yet'
import { proto } from '../../WAProto'
import { AuthenticationCreds } from '../Types'
import { BufferJSON, initAuthCreds } from '../Utils'
import logger from '../Utils/logger'

const makeRedisAuthState = async(sessionKey: string) => {
	const defaultKey = (file: string): string => `${sessionKey}:${file}`

	let redisConn: null | Cache<RedisStore> = null

	const init = async(redisProps: {}) => {
		if(!redisProps) {
			throw new Error('Redis connection string missing')
		}

		const redis = await redisStore(redisProps)
		redisConn = await caching(redis)
	}

	const writeData = async(file: string, data: object) => {
		const setData = await redisConn?.set(defaultKey(file), JSON.stringify(data, BufferJSON.replacer))

		if(!setData) {
			throw new Error('Unable to set credentials, check your Redis connection')
		}
	}

	const readData = async(file: string): Promise<AuthenticationCreds | null> => {
		try {
			const data = await redisConn?.get(defaultKey(file))

			if(data) {
				return JSON.parse(data as string, BufferJSON.reviver)
			}

			return null
		} catch(error) {
			logger.error(error)
			return null
		}
	}

	const removeData = async(file: string) => {
		try {
			return await redisConn?.del(defaultKey(file))
		} catch{
			logger.error(`Error removing ${file} from session ${sessionKey}`)
		}
	}

	const clearState = async() => await redisConn?.del(sessionKey)

	const creds: AuthenticationCreds = (await readData('creds')) || initAuthCreds()

	return {
		init,
		clearState,
		saveCreds: () => writeData('creds', creds),
		state: {
			creds,
			keys: {
				get: async(type: string, ids: string[]) => {
					const data = {}
					await Promise.all(
						ids.map(async(id) => {
							let value: proto.Message.AppStateSyncKeyData | AuthenticationCreds | null =
                                await readData(`${type}-${id}`)
							if(type === 'app-state-sync-key' && value) {
								value = proto.Message.AppStateSyncKeyData.fromObject(value)
							}

							data[id] = value
						})
					)

					return data
				},
				set: async(data) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const tasks: Promise<any>[] = []
					for(const category in data) {
						for(const id in data[category]) {
							const value = data[category][id]
							const key = `${category}-${id}`
							tasks.push(value ? writeData(key, value) : removeData(key))
						}
					}

					await Promise.all(tasks)
				},
			}
		}
	}
}

export default makeRedisAuthState