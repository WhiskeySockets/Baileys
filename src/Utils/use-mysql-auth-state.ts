import { proto } from '../../WAProto'
import { AuthenticationCreds, AuthenticationState, SignalDataTypeMap, MySQLConfig } from '../Types'
import { initAuthCreds } from './auth-utils'
import { BufferJSON } from './generics'
import { createConnection, RowDataPacket } from 'mysql2/promise'

/**
 * Stores the full authentication state in mysql
 * Far more efficient than file
 * @param {string} host - MySql host, by default localhost
 * @param {string} user - MySql user, by default root
 * @param {string} password - MySql password
 * @param {string} database - MySql database name
 * @param {string} session - Session name to identify the connection, allowing multisessions with mysql
 * @returns {Promise<{ state: AuthenticationState, saveCreds: () => Promise<void>, removeCreds: () => Promise<void> }>}
 */

/* Example for create table

CREATE TABLE `auth` (
	`session` varchar(50) NOT NULL,
	`id` varchar(100) NOT NULL,
	`value` json DEFAULT NULL,
	UNIQUE KEY `idxunique` (`session`,`id`),
	KEY `idxsession` (`session`),
	KEY `idxid` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
*/

interface sqlData extends RowDataPacket {
	value?: Array<any>
}

export const useMySQLAuthState = async(config: MySQLConfig): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void>, removeCreds: () => Promise<void> }> => {
	const newConnection = async(config: MySQLConfig) => {
		const conn = await createConnection({
			host: config?.host || 'localhost',
			user: config?.user || 'root',
			password: config?.password || 'Password123#',
			database: config?.database || 'base'
		}).catch((e) => {
			throw e
		})
		return conn
	}

	const sqlConn = await newConnection(config)

	const session = config?.session || 'session-1'

	const query = async (sql: string, values: any) => {
		const [rows] = await sqlConn.query(sql, values).catch((e) => {
			throw e
		})
		return rows as sqlData
	}

	const readData = async (id: string) => {
		const data = await query(`SELECT value FROM auth WHERE id = ? AND session = ?`, [id, session])
		if(!data[0]?.value){
			return null
		}
		const creds = JSON.stringify(data[0].value)
		const credsParsed = JSON.parse(creds, BufferJSON.reviver)
		return credsParsed
	}

	const writeData = async (id: string, value: any) => {
		const valueFixed = JSON.stringify(value, BufferJSON.replacer)
		await query(`INSERT INTO auth (value, id, session) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = ?`, [valueFixed, id, session, valueFixed])
	}

	const removeData = async (id: string) => {
		await query(`DELETE FROM auth WHERE id = ? AND session = ?`, [id, session])
	}

	const removeAll = async () => {
		await query(`DELETE FROM auth WHERE session = ?`, [session])
	}

	const creds: AuthenticationCreds = await readData('creds') || initAuthCreds()

	return {
		state: {
			creds,
			keys: {
				get: async (type, ids) => {
					const data: { [_: string]: SignalDataTypeMap[typeof type] } = { }
					await Promise.all(
						ids.map(async(id) => {
							let value = await readData(`${type}-${id}`)
							if(type === 'app-state-sync-key' && value) {
								value = proto.Message.AppStateSyncKeyData.fromObject(value)
							}
							data[id] = value
						})
					)
					return data
				},
				set: async (data) => {
					const tasks: Promise<void>[] = []
					for(const category in data) {
						for(const id in data[category]) {
							const value = data[category][id];
							const name = `${category}-${id}`
							tasks.push(value ? writeData(name, value) : removeData(name))
						}
					}
					await Promise.all(tasks)
				}
			}
		},
		saveCreds: async () => {
			return writeData('creds', creds)
		},
		removeCreds: async () => {
			return removeAll()
		}
	}
}
