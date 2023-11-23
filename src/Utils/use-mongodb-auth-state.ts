import { MongoClient } from 'mongodb'
import { proto } from '../../WAProto'
import {
  AuthenticationCreds,
  AuthenticationState,
  SignalDataTypeMap,
} from '../Types'
import { initAuthCreds } from './auth-utils'
import { BufferJSON } from './generics'

/**
 * Creates and returns an authentication object that stores and reads data in MongoDB.
 *
 * @param {string} mongodbUri - The MongoDB connection URI.
 * @param {string} databaseName - The name of the MongoDB database.
 * @param {string} collectionName - The name of the MongoDB collection.
 * @param {string} sessionId - The name of the Instance that you want to give to identify the connection, thus allowing multisessions in MongoDB
 * @returns {Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }>} The authentication object.
 */

type MongoDBAuthConfig = {
  mongodbUri: string
  databaseName: string
  collectionName: string
  sessionId: string
};

export const useMongoDBAuthState = async(
  config: MongoDBAuthConfig
): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void> }> => {
  const client = new MongoClient(config.mongodbUri, {
    connectTimeoutMS: 15000,
  })

  const sessionId = config.sessionId
  await client.connect()
  const db = client.db(config.databaseName)
  const collection = db.collection(config.collectionName)

  const ensureCollectionExists = async() => {
    const collections = await db
      .listCollections({ name: config.collectionName })
      .toArray()
    if(collections.length === 0) {
      await db.createCollection(config.collectionName)
    }
  }

  await ensureCollectionExists()

  async function writeData(data: any, key: any): Promise<any> {
    try {
      return await collection.replaceOne(
        { _id: key } as any,
        JSON.parse(JSON.stringify(data, BufferJSON.replacer)),
        { upsert: true }
      )
    } catch(error) {
      console.error(error)
    }
  }

  async function readData(key: any): Promise<any> {
    try {
      const data = await collection.findOne({ _id: key } as any)
      const creds = JSON.stringify(data)
      return JSON.parse(creds, BufferJSON.reviver)
    } catch(error) {
      console.error('Erro ao ler dados:', error)
      throw error
    }
  }

  const removeData = async(key: any) => {
    try {
      await collection.deleteOne({ _id: key })
    } catch(error) {
      throw new Error(`Error deleting creds ${error}`)
    }
  }

  const creds: AuthenticationCreds =
    (await readData(`creds-${sessionId}`)) || initAuthCreds()

  return {
    state: {
      creds,
      keys: {
        get: async(type, ids) => {
          const data: { [_: string]: SignalDataTypeMap[typeof type] } = {}
          await Promise.all(
            ids.map(async(id) => {
              let value = await readData(`${type}-${id}-${sessionId}`)
              if(type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value)
              }

              data[id] = value
            })
          )

          return data
        },
        set: async(data) => {
          const tasks: Promise<void>[] = []
          for(const category in data) {
            for(const id in data[category]) {
              const value = data[category][id]
              const sId = `${category}-${id}-${sessionId}`
              tasks.push(value ? writeData(value, sId) : removeData(sId))
            }
          }

          await Promise.all(tasks)
        },
      },
    },
    saveCreds: () => {
      return writeData(creds, `creds-${sessionId}`)
    },
  }
}
