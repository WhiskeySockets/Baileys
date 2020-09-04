import { WAConnection, MessageLogLevel, MessageOptions, MessageType, unixTimestampSeconds, toNumber } from '../WAConnection/WAConnection'
import * as assert from 'assert'
import {promises as fs} from 'fs'

require ('dotenv').config () // dotenv to load test jid
export const testJid = process.env.TEST_JID || '1234@s.whatsapp.net' // set TEST_JID=xyz@s.whatsapp.net in a .env file in the root directory

export async function sendAndRetreiveMessage(conn: WAConnection, content, type: MessageType, options: MessageOptions = {}) {
    const response = await conn.sendMessage(testJid, content, type, options)
    const {messages} = await conn.loadMessages(testJid, 10)
    const message = messages.find (m => m.key.id === response.key.id)
    assert.ok(message)

    const chat = conn.chats.get(testJid)

    assertChatDBIntegrity (conn)
    assert.ok (chat.messages.find(m => m.key.id === response.key.id))
    assert.ok (chat.t >= (unixTimestampSeconds()-5) )
    return message
}
export const WAConnectionTest = (name: string, func: (conn: WAConnection) => void) => (
    describe(name, () => {
        const conn = new WAConnection()
        conn.logLevel = MessageLogLevel.info

        before(async () => {
            //conn.logLevel = MessageLogLevel.unhandled
            const file = './auth_info.json'
            await conn.loadAuthInfo(file).connect()
            await fs.writeFile(file, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
        })
        after(() => conn.close())
        
        func(conn)
    })
)
export const assertChatDBIntegrity = (conn: WAConnection) => {
    conn.chats.all ().forEach (chat => (
        assert.deepEqual (
            [...chat.messages].sort ((m1, m2) => toNumber(m1.messageTimestamp)-toNumber(m2.messageTimestamp)),
            chat.messages
        )
    ))
    conn.chats.all ().forEach (chat => (
        assert.deepEqual (
            chat.messages.filter (m => chat.messages.filter(m1 => m1.key.id === m.key.id).length > 1),
            []
        )
    ))
}