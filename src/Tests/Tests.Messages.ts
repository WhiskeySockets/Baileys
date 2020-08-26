import { MessageType, Mimetype, delay, promiseTimeout, WAMessage, WA_MESSAGE_STATUS_TYPE, MessageStatusUpdate } from '../WAConnection/WAConnection'
import {promises as fs} from 'fs'
import * as assert from 'assert'
import { WAConnectionTest, testJid, sendAndRetreiveMessage } from './Common'

WAConnectionTest('Messages', (conn) => {
    it('should send a text message', async () => {
        //const message = await sendAndRetreiveMessage(conn, 'hello fren', MessageType.text)
        //assert.strictEqual(message.message.conversation || message.message.extendedTextMessage?.text, 'hello fren')
    })
    it('should forward a message', async () => {
        let messages = await conn.loadMessages (testJid, 1)
        await conn.forwardMessage (testJid, messages[0], true)
        
        messages = await conn.loadMessages (testJid, 1)
        const message = messages[0]
        const content = message.message[ Object.keys(message.message)[0] ]
        assert.equal (content?.contextInfo?.isForwarded, true)
    })
    it('should send a link preview', async () => {
        const content = await conn.generateLinkPreview ('hello this is from https://www.github.com/adiwajshing/Baileys')
        const message = await sendAndRetreiveMessage(conn, content, MessageType.text)
        const received = message.message.extendedTextMessage
        
        assert.strictEqual(received.text, content.text)
        assert.ok (received.canonicalUrl)
        assert.ok (received.title)
        assert.ok (received.jpegThumbnail)
    })
    it('should quote a message', async () => {
        const {messages} = await conn.loadMessages(testJid, 2)
        const message = await sendAndRetreiveMessage(conn, 'hello fren 2', MessageType.extendedText, {
            quoted: messages[0],
        })
        assert.strictEqual(message.message.extendedTextMessage.contextInfo.stanzaId, messages[0].key.id)
        assert.strictEqual(
            message.message.extendedTextMessage.contextInfo.participant, 
            messages[0].key.fromMe ? conn.user.id : messages[0].key.id
        )
    })
    it('should send a gif', async () => {
        const content = await fs.readFile('./Media/ma_gif.mp4')
        const message = await sendAndRetreiveMessage(conn, content, MessageType.video, { mimetype: Mimetype.gif })
        
        await conn.downloadAndSaveMediaMessage(message,'./Media/received_vid')
    })
    it('should send an image', async () => {
        const content = await fs.readFile('./Media/meme.jpeg')
        const message = await sendAndRetreiveMessage(conn, content, MessageType.image)
        
        await conn.downloadMediaMessage(message)
        //const message2 = await sendAndRetreiveMessage (conn, 'this is a quote', MessageType.extendedText)
    })
    it('should send an image & quote', async () => {
        const messages = await conn.loadMessages(testJid, 1)
        const content = await fs.readFile('./Media/meme.jpeg')
        const message = await sendAndRetreiveMessage(conn, content, MessageType.image, { quoted: messages[0] })
        
        await conn.downloadMediaMessage(message) // check for successful decoding
        assert.strictEqual(message.message.imageMessage.contextInfo.stanzaId, messages[0].key.id)
    })
    it('should send a message & delete it', async () => {
        const message = await sendAndRetreiveMessage(conn, 'hello fren', MessageType.text)
        await delay (2000)
        await conn.deleteMessage (testJid, message.key)
    })
    it('should clear the most recent message', async () => {
        const messages = await conn.loadMessages (testJid, 1)
        await delay (2000)
        await conn.clearMessage (messages[0].key)
    })
})
WAConnectionTest('Message Events', (conn) => {
    it('should deliver a message', async () => {
        const waitForUpdate = 
            promiseTimeout(15000, resolve => {
                conn.on('message-update', update => {
                    if (update.ids.includes(response.key.id)) {
                        resolve(update)
                    }
                })
            }) as Promise<MessageStatusUpdate>
        const response = await conn.sendMessage(testJid, 'My Name Jeff', MessageType.text)
        const m = await waitForUpdate
        assert.ok (m.type >= WA_MESSAGE_STATUS_TYPE.DELIVERY_ACK)
    })
})
