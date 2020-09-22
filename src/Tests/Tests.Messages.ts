import { MessageType, Mimetype, delay, promiseTimeout, WA_MESSAGE_STATUS_TYPE, WAMessageStatusUpdate } from '../WAConnection/WAConnection'
import {promises as fs} from 'fs'
import * as assert from 'assert'
import { WAConnectionTest, testJid, sendAndRetreiveMessage } from './Common'

WAConnectionTest('Messages', conn => {
    it('should send a text message', async () => {
        const message = await sendAndRetreiveMessage(conn, 'hello fren', MessageType.text)
        assert.strictEqual(message.message.conversation || message.message.extendedTextMessage?.text, 'hello fren')
    })
    it('should forward a message', async () => {
        let {messages} = await conn.loadMessages (testJid, 1)
        await conn.forwardMessage (testJid, messages[0], true)
        
        messages = (await conn.loadMessages (testJid, 1)).messages
        const message = messages.slice (-1)[0]
        const content = message.message[ Object.keys(message.message)[0] ]
        assert.equal (content?.contextInfo?.isForwarded, true)
    })
    it('should send a link preview', async () => {
        const text = 'hello this is from https://www.github.com/adiwajshing/Baileys'
        const message = await sendAndRetreiveMessage(conn, text, MessageType.text, { detectLinks: true })
        const received = message.message.extendedTextMessage
        
        assert.strictEqual(received.text, text)
        assert.ok (received.canonicalUrl)
        assert.ok (received.title)
        assert.ok (received.description)
    })
    it('should quote a message', async () => {
        const quoted = (await conn.loadMessages(testJid, 2)).messages[0]
        const message = await sendAndRetreiveMessage(conn, 'hello fren 2', MessageType.extendedText, { quoted })
        assert.strictEqual(
            message.message.extendedTextMessage.contextInfo.stanzaId, 
            quoted.key.id
        )
        assert.strictEqual(
            message.message.extendedTextMessage.contextInfo.participant, 
            quoted.key.fromMe ? conn.user.jid : quoted.key.id
        )
    })
    it('should upload media successfully', async () => {
        const content = await fs.readFile('./Media/sonata.mp3')
        // run 10 uploads
        for (let i = 0; i < 10;i++) {
            await conn.prepareMessageContent (content, MessageType.audio, { filename: 'audio.mp3', mimetype: Mimetype.mp4Audio })
        }
    })
    it('should send a gif', async () => {
        const content = await fs.readFile('./Media/ma_gif.mp4')
        const message = await sendAndRetreiveMessage(conn, content, MessageType.video, { mimetype: Mimetype.gif })
        
        await conn.downloadAndSaveMediaMessage(message,'./Media/received_vid')
    })
    it('should send an audio', async () => {
        const content = await fs.readFile('./Media/sonata.mp3')
        const message = await sendAndRetreiveMessage(conn, content, MessageType.audio, { mimetype: Mimetype.ogg })
        
        await conn.downloadAndSaveMediaMessage(message,'./Media/received_aud')
    })
    it('should send an audio as a voice note', async () => {
        const content = await fs.readFile('./Media/sonata.mp3')
        const message = await sendAndRetreiveMessage(conn, content, MessageType.audio, { mimetype: Mimetype.ogg, ptt: true })
        
        assert.equal (message.message?.audioMessage?.ptt, true)
        await conn.downloadAndSaveMediaMessage(message,'./Media/received_aud')
    })
    it('should send an image', async () => {
        const content = await fs.readFile('./Media/meme.jpeg')
        const message = await sendAndRetreiveMessage(conn, content, MessageType.image)
        
        await conn.downloadMediaMessage(message)
    })
    it('should send a sticker', async () => {
        const content = await fs.readFile('./Media/octopus.webp')
        const message = await sendAndRetreiveMessage(conn, content, MessageType.sticker)
        
        await conn.downloadMediaMessage(message)
    })
    /*it('should send an interactive message', async () => {
        
        console.log (
            JSON.stringify(await conn.loadMessages (testJid, 5), null, '\t')
        )
        const message = conn.prepareMessageFromContent (
            testJid,
            {
                templateMessage: {
                    fourRowTemplate: {
                        content: {
                            namespace: 'my-namespace',
                            localizableParams: [
                                
                            ],
                            params: ['hello!']
                        },
                        buttons: [
                            {
                                index: 0,
                                quickReplyButton: {
                                    displayText: {
                                        params: ['my name jeff']
                                    }
                                }
                            },
                            {
                                index: 1,
                                quickReplyButton: {
                                    displayText: {
                                        params: ['my name NOT jeff'],
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {}
        )
        await conn.relayWAMessage (message)
    })*/
    it('should send an image & quote', async () => {
        const quoted = (await conn.loadMessages(testJid, 2)).messages[0]
        const content = await fs.readFile('./Media/meme.jpeg')
        const message = await sendAndRetreiveMessage(conn, content, MessageType.image, { quoted })
        
        await conn.downloadMediaMessage(message) // check for successful decoding
        assert.strictEqual(message.message.imageMessage.contextInfo.stanzaId, quoted.key.id)
    })
    it('should send a message & delete it', async () => {
        const message = await sendAndRetreiveMessage(conn, 'hello fren', MessageType.text)
        await delay (2000)
        await conn.deleteMessage (testJid, message.key)
    })
    it('should clear the most recent message', async () => {
        const {messages} = await conn.loadMessages (testJid, 1)
        await delay (2000)
        await conn.clearMessage (messages[0].key)
    })
    it('should send media after close', async () => {
        const content = await fs.readFile('./Media/octopus.webp')
        await sendAndRetreiveMessage(conn, content, MessageType.sticker)

        conn.close ()

        await conn.connect ()

        const content2 = await fs.readFile('./Media/cat.jpeg')
        await sendAndRetreiveMessage(conn, content2, MessageType.image)
    })
    it('should fail to send a text message', done => {
        const JID = '1234-1234@g.us'
        conn.sendMessage(JID, 'hello', MessageType.text)

        conn.on ('message-status-update', async update => {
            if (update.to === JID) {
                assert.equal (update.type, WA_MESSAGE_STATUS_TYPE.ERROR)
                await conn.deleteChat (JID)
                done ()
            }
        })
    })
    it('should not duplicate messages', async () => {
        const results = await Promise.all ([
            conn.loadMessages (testJid, 50),
            conn.loadMessages (testJid, 50)
        ])
        assert.deepEqual (results[0].messages, results[1].messages)
        assert.ok (results[0].messages.length <= 50)
    })
    it('should deliver a message', async () => {
        const waitForUpdate = 
            promiseTimeout(15000, resolve => {
                conn.on('message-status-update', update => {
                    if (update.ids.includes(response.key.id)) {
                        resolve(update)
                    }
                })
            }) as Promise<WAMessageStatusUpdate>
        const response = await conn.sendMessage(testJid, 'My Name Jeff', MessageType.text)
        const m = await waitForUpdate
        assert.ok (m.type >= WA_MESSAGE_STATUS_TYPE.DELIVERY_ACK)
    })
})
