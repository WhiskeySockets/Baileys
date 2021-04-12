import { MessageType, Mimetype, delay, promiseTimeout, WA_MESSAGE_STATUS_TYPE, generateMessageID, WAMessage } from '../WAConnection'
import { promises as fs } from 'fs'
import * as assert from 'assert'
import { WAConnectionTest, testJid, sendAndRetrieveMessage } from './Common'

WAConnectionTest('Messages', conn => {

    it('should send a text message', async () => {
        const message = await sendAndRetrieveMessage(conn, 'hello fren', MessageType.text)
        assert.strictEqual(message.message.conversation || message.message.extendedTextMessage?.text, 'hello fren')
    })
    it('should send a pending message', async () => {
        const message = await sendAndRetrieveMessage(conn, 'hello fren', MessageType.text, { waitForAck: false })

        await new Promise(resolve => conn.on('chat-update', update => {
            if (update.jid === testJid && 
                update.messages && 
                update.messages.first.key.id === message.key.id &&
                update.messages.first.status === WA_MESSAGE_STATUS_TYPE.SERVER_ACK) {
                resolve(undefined)
            } 
        }))

    })
    it('should forward a message', async () => {
        let {messages} = await conn.loadMessages (testJid, 1)
        await conn.forwardMessage (testJid, messages[0], true)
        
        messages = (await conn.loadMessages (testJid, 1)).messages
        const message = messages.slice (-1)[0]
        const content = message.message[ Object.keys(message.message)[0] ]
        assert.strictEqual (content?.contextInfo?.isForwarded, true)
    })
    it('should send a link preview', async () => {
        const text = 'hello this is from https://www.github.com/adiwajshing/Baileys'
        const message = await sendAndRetrieveMessage(conn, text, MessageType.text, { detectLinks: true })
        const received = message.message.extendedTextMessage
        
        assert.strictEqual(received.text, text)
        assert.ok (received.canonicalUrl)
        assert.ok (received.title)
        assert.ok (received.description)
    })
    it('should quote a message', async () => {
        const quoted = (await conn.loadMessages(testJid, 2)).messages[0]
        const message = await sendAndRetrieveMessage(conn, 'hello fren 2', MessageType.extendedText, { quoted })
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
        const message = await sendAndRetrieveMessage(conn, { url: './Media/ma_gif.mp4' }, MessageType.video, { mimetype: Mimetype.gif })
        
        await conn.downloadAndSaveMediaMessage(message,'./Media/received_vid')
    })
    it('should send an audio', async () => {
        const content = await fs.readFile('./Media/sonata.mp3')
        const message = await sendAndRetrieveMessage(conn, content, MessageType.audio, { mimetype: Mimetype.mp4Audio })
        // check duration was okay
        assert.ok (message.message.audioMessage.seconds > 0)
        await conn.downloadAndSaveMediaMessage(message,'./Media/received_aud')
    })
    it('should send a voice note', async () => {
        const content = await fs.readFile('./Media/sonata.mp3')
        const message = await sendAndRetrieveMessage(conn, content, MessageType.audio, { mimetype: Mimetype.mp4Audio, ptt: true })
        
        assert.ok (message.message.audioMessage.seconds > 0)
        assert.strictEqual (message.message?.audioMessage?.ptt, true)
        await conn.downloadAndSaveMediaMessage(message,'./Media/received_aud')
    })
    it('should send a jpeg image', async () => {
        const message = await sendAndRetrieveMessage(conn, { url: './Media/meme.jpeg' }, MessageType.image)
        assert.ok(message.message.imageMessage.jpegThumbnail.length > 0)
        const msg = await conn.downloadMediaMessage(message)
        assert.deepStrictEqual(msg, await fs.readFile('./Media/meme.jpeg'))
    })
    it('should send a remote jpeg image', async () => {
        const message = await sendAndRetrieveMessage(
            conn, 
            { url: 'https://www.memestemplates.com/wp-content/uploads/2020/05/tom-with-phone.jpg' }, 
            MessageType.image
        )
        assert.ok (message.message?.imageMessage?.jpegThumbnail)
        await conn.downloadMediaMessage(message)
    })
    it('should send a png image', async () => {
        const content = await fs.readFile('./Media/icon.png')
        const message = await sendAndRetrieveMessage(conn, content, MessageType.image, { mimetype: 'image/png' })
        assert.ok (message.message?.imageMessage?.jpegThumbnail)
        await conn.downloadMediaMessage(message)
    })
    it('should send a sticker', async () => {
        const content = await fs.readFile('./Media/octopus.webp')
        const message = await sendAndRetrieveMessage(conn, content, MessageType.sticker)
        
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
        const message = await sendAndRetrieveMessage(conn, content, MessageType.image, { quoted })
        
        await conn.downloadMediaMessage(message) // check for successful decoding
        assert.strictEqual(message.message.imageMessage.contextInfo.stanzaId, quoted.key.id)
    })
    it('should send a message & delete it', async () => {
        const message = await sendAndRetrieveMessage(conn, 'hello fren', MessageType.text)
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
        await sendAndRetrieveMessage(conn, content, MessageType.sticker)

        conn.close ()

        await conn.connect ()

        const content2 = await fs.readFile('./Media/cat.jpeg')
        await sendAndRetrieveMessage(conn, content2, MessageType.image)
    })
    it('should fail to send a text message', async () => {
        const JID = '1234-1234@g.us'
        const messageId = generateMessageID()
        conn.sendMessage(JID, 'hello', MessageType.text, { messageId })

        await new Promise(resolve => (
            conn.on ('chat-update', async update => {
                console.log(messageId, update.messages?.first)
                if (
                    update.jid === JID && 
                    update.messages?.first.key.id === messageId &&
                    update.messages.first.status === WA_MESSAGE_STATUS_TYPE.ERROR) {
                    resolve(undefined)
                }
            })
        ))
        conn.removeAllListeners('chat-update')
    })
    it('should maintain message integrity', async () => {
        // loading twice does not alter the results
        const results = await Promise.all ([
            conn.loadMessages (testJid, 50),
            conn.loadMessages (testJid, 50)
        ])
        assert.strictEqual (results[0].messages.length, results[1].messages.length)
        for (let i = 0; i < results[1].messages.length;i++) {
            assert.deepStrictEqual (
                results[0].messages[i].key, 
                results[1].messages[i].key, 
                `failed equal at ${i}`
            )
        }
        assert.ok (results[0].messages.length <= 50)

        // check if messages match server
        let msgs = await conn.fetchMessagesFromWA (testJid, 50)
        for (let i = 0; i < results[1].messages.length;i++) {
            assert.deepStrictEqual (
                results[0].messages[i].key,
                msgs[i].key, 
                `failed equal at ${i}`
            )
        }
        // check with some arbitary cursors
        let cursor = results[0].messages.slice(-1)[0].key
        
        msgs = await conn.fetchMessagesFromWA (testJid, 20, cursor)
        let {messages} = await conn.loadMessages (testJid, 20, cursor)
        for (let i = 0; i < messages.length;i++) {
            assert.deepStrictEqual (
                messages[i].key, 
                msgs[i].key, 
                `failed equal at ${i}`
            )
        }
        for (let i = 0; i < 3;i++) {
            cursor = results[0].messages[i].key
        
            msgs = await conn.fetchMessagesFromWA (testJid, 20, cursor)
            messages = (await conn.loadMessages (testJid, 20, cursor)).messages
            for (let i = 0; i < messages.length;i++) {
                assert.deepStrictEqual (messages[i].key, msgs[i].key, `failed equal at ${i}`)
            }

            cursor = msgs[0].key

            msgs = await conn.fetchMessagesFromWA (testJid, 20, cursor)
            messages = (await conn.loadMessages (testJid, 20, cursor)).messages
            for (let i = 0; i < messages.length;i++) {
                assert.deepStrictEqual (messages[i].key, msgs[i].key, `failed equal at ${i}`)
            }
        }
    })
    it('should deliver a message', async () => {
        const response = await conn.sendMessage(testJid, 'My Name Jeff', MessageType.text)
        const waitForUpdate = 
            promiseTimeout(15000, resolve => {
                conn.on('chat-update', update => {
                    if (update.messages?.first.key.id === response.key.id) {
                        resolve(update.messages.first)
                    }
                })
            }) as Promise<WAMessage>
        
        const m = await waitForUpdate
        assert.ok (m.status >= WA_MESSAGE_STATUS_TYPE.DELIVERY_ACK)
    })
})
