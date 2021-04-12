import { WAConnection, MessageOptions, MessageType, unixTimestampSeconds, toNumber, GET_MESSAGE_ID, waMessageKey } from '../WAConnection'
import * as assert from 'assert'
import {promises as fs} from 'fs'

require ('dotenv').config () // dotenv to load test jid
export const testJid = process.env.TEST_JID || '1234@s.whatsapp.net' // set TEST_JID=xyz@s.whatsapp.net in a .env file in the root directory

export const makeConnection = () => {
    const conn = new WAConnection()
    conn.connectOptions.maxIdleTimeMs = 15_000
    conn.logger.level = 'debug'

    let evCounts = {}

    conn.on ('close', ({ isReconnecting }) => {
        !isReconnecting && console.log ('Events registered: ', evCounts)
    })

    const onM = conn.on
    conn.on = (...args: any[]) => {
        evCounts[args[0]] = (evCounts[args[0]] || 0) + 1
        return onM.apply (conn, args)
    }
    const offM = conn.off
    conn.off = (...args: any[]) => {
        evCounts[args[0]] = (evCounts[args[0]] || 0) - 1
        if (evCounts[args[0]] <= 0) delete evCounts[args[0]]
        return offM.apply (conn, args)
    }
    return conn
}

export async function sendAndRetrieveMessage(conn: WAConnection, content, type: MessageType, options: MessageOptions = {}, recipientJid = testJid) {
    const response = await conn.sendMessage(recipientJid, content, type, options)
    const {messages} = await conn.loadMessages(recipientJid, 10)
    const message = messages.find (m => m.key.id === response.key.id)
    assert.ok(message)

    const chat = conn.chats.get(recipientJid)

    assert.ok (chat.messages.get(GET_MESSAGE_ID(message.key)))
    assert.ok (chat.t >= (unixTimestampSeconds()-5), `expected: ${chat.t} > ${(unixTimestampSeconds()-5)}`)
    return message
}
export const WAConnectionTest = (name: string, func: (conn: WAConnection) => void) => (
    describe(name, () => {
        const conn = new WAConnection()
        conn.connectOptions.maxIdleTimeMs = 30_000
        conn.logger.level = 'debug'

        before(async () => {
            const file = './auth_info.json'
            await conn.loadAuthInfo(file).connect()
            await fs.writeFile(file, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
        })
        after(() => conn.close())

        afterEach (() => assertChatDBIntegrity (conn))
        
        func(conn)
    })
)
export const assertChatDBIntegrity = (conn: WAConnection) => {
    conn.chats.all ().forEach (chat => (
        assert.deepStrictEqual (
            [...chat.messages.all()].sort ((m1, m2) => waMessageKey.compare(waMessageKey.key(m1), waMessageKey.key(m2))),
            chat.messages.all()
        )
    ))
    conn.chats.all ().forEach (chat => (
        assert.deepStrictEqual (
            chat.messages.all().filter (m => chat.messages.all().filter(m1 => m1.key.id === m.key.id).length > 1),
            []
        )
    ))
}
