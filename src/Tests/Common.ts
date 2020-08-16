import { WAConnection, MessageLogLevel, MessageOptions, MessageType } from '../WAConnection/WAConnection'
import * as assert from 'assert'
import {promises as fs} from 'fs'

require ('dotenv').config () // dotenv to load test jid
export const testJid = process.env.TEST_JID || '1234@s.whatsapp.net' // set TEST_JID=xyz@s.whatsapp.net in a .env file in the root directory

export async function sendAndRetreiveMessage(conn: WAConnection, content, type: MessageType, options: MessageOptions = {}) {
    const response = await conn.sendMessage(testJid, content, type, options)
    const messages = await conn.loadConversation(testJid, 10, null, true)
    const message = messages.find (m => m.key.id === response.key.id)
    assert.ok(message)
    return message
}
export function WAConnectionTest(name: string, func: (conn: WAConnection) => void) {
    describe(name, () => {
        const conn = new WAConnection()
        conn.logLevel = MessageLogLevel.info

        before(async () => {
            const file = './auth_info.json'
            await conn.connectSlim(file)
            await fs.writeFile(file, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
        })
        after(() => conn.close())
        func(conn)
    })
}