import { Presence, ChatModification, delay, newMessagesDB, WA_DEFAULT_EPHEMERAL, MessageType, WAMessage } from '../WAConnection'
import { promises as fs } from 'fs'
import * as assert from 'assert'
import got from 'got'
import { WAConnectionTest, testJid, sendAndRetrieveMessage } from './Common'

WAConnectionTest('Misc', conn => {

    it('should tell if someone has an account on WhatsApp', async () => {
        const response = await conn.isOnWhatsApp(testJid)
        assert.strictEqual(response, true)

        const responseFail = await conn.isOnWhatsApp('abcd@s.whatsapp.net')
        assert.strictEqual(responseFail, false)
    })
    it('should return the status', async () => {
        const response = await conn.getStatus(testJid)
        assert.strictEqual(typeof response.status, 'string')
    })
    it('should update status', async () => {
        const newStatus = 'v cool status'

        const waitForEvent = new Promise (resolve => {
            conn.on ('contact-update', ({jid, status}) => {
                if (jid === conn.user.jid) {
                    assert.strictEqual (status, newStatus)
                    conn.removeAllListeners ('contact-update')
                    resolve(undefined)
                }
            })
        })

        const response = await conn.getStatus()
        assert.strictEqual(typeof response.status, 'string')

        await delay (1000)

        await conn.setStatus (newStatus)
        const response2 = await conn.getStatus()
        assert.strictEqual (response2.status, newStatus)

        await waitForEvent

        await delay (1000)

        await conn.setStatus (response.status) // update back
    })
    it('should update profile name', async () => {
        const newName = 'v cool name'

        await delay (1000)

        const originalName = conn.user.name!

        const waitForEvent = new Promise<void> (resolve => {
            conn.on ('contact-update', ({name}) => {
                assert.strictEqual (name, newName)
                conn.removeAllListeners ('contact-update')
                resolve ()
            })
        })

        await conn.updateProfileName (newName)

        await waitForEvent

        await delay (1000)

        assert.strictEqual (conn.user.name, newName)

        await delay (1000)

        await conn.updateProfileName (originalName) // update back
    })
    it('should return the stories', async () => {
        await conn.getStories()
    })

    it('should return the profile picture correctly', async () => {
        // wait for chats
        await new Promise(resolve => (
            conn.once('initial-data-received', resolve)
        )) 
        const pictures = await Promise.all(
            conn.chats.all().slice(0, 15).map(({ jid }) => (
                conn.getProfilePicture(jid)
                .catch(err => '')
            ))
        )
        // pictures should return correctly
        const truePictures = pictures.filter(pp => !!pp)
        assert.strictEqual(
            new Set(truePictures).size,
            truePictures.length
        )
    })

    it('should change the profile picture', async () => {
        await delay (5000)

        const ppUrl = await conn.getProfilePicture(conn.user.jid)
        const {rawBody: oldPP} = await got(ppUrl)

        const newPP = await fs.readFile('./Media/cat.jpeg')
        await conn.updateProfilePicture(conn.user.jid, newPP)

        await delay (10000)

        await conn.updateProfilePicture (conn.user.jid, oldPP) // revert back
    })
    it('should send typing indicator', async () => {
        const response = await conn.updatePresence(testJid, Presence.composing)
        assert.ok(response)
    })
    it('should change a chat read status', async () => {
        const jids = conn.chats.all ().map (c => c.jid)
        for (let jid of jids.slice(0, 5)) {
            console.log (`changing read status for ${jid}`)
            const waitForEvent = new Promise (resolve => {
                conn.once ('chat-update', ({jid: tJid, count}) => {
                    if (jid === tJid) {
                        assert.ok (count < 0)
                        resolve(undefined)
                    }
                })
            })
            await conn.chatRead (jid, 'unread')
            await waitForEvent
    
            await delay (5000)
    
            await conn.chatRead (jid, 'read')
        }
    })
    it('should archive & unarchive', async () => {
        // wait for chats
        await new Promise(resolve => (
            conn.once('chats-received', ({ }) => resolve(undefined))
        ))

        const idx = conn.chats.all().findIndex(chat => chat.jid === testJid)
        await conn.modifyChat (testJid, ChatModification.archive)
        const idx2 = conn.chats.all().findIndex(chat => chat.jid === testJid)
        assert.ok(idx < idx2) // should move further down the array

        await delay (2000)
        await conn.modifyChat (testJid, ChatModification.unarchive)
        const idx3 = conn.chats.all().findIndex(chat => chat.jid === testJid)
        assert.strictEqual(idx, idx3) // should be back there
    })
    it('should archive & unarchive on new message', async () => {
        // wait for chats
        await new Promise(resolve => (
            conn.once('chats-received', ({ }) => resolve(undefined))
        ))

        const idx = conn.chats.all().findIndex(chat => chat.jid === testJid)
        await conn.modifyChat (testJid, ChatModification.archive)
        const idx2 = conn.chats.all().findIndex(chat => chat.jid === testJid)
        assert.ok(idx < idx2) // should move further down the array

        await delay (2000)
        await sendAndRetrieveMessage(conn, 'test', MessageType.text)
        // should be unarchived
        const idx3 = conn.chats.all().findIndex(chat => chat.jid === testJid)
        assert.strictEqual(idx, idx3) // should be back there
    })
    it('should pin & unpin a chat', async () => {
        await conn.modifyChat (testJid, ChatModification.pin)
        await delay (2000)
        await conn.modifyChat (testJid, ChatModification.unpin)
    })
    it('should mute & unmute a chat', async () => {
        const waitForEvent = new Promise (resolve => {
            conn.on ('chat-update', ({jid, mute}) => {
                if (jid === testJid ) {
                    assert.ok (mute)
                    conn.removeAllListeners ('chat-update')
                    resolve(undefined)
                }
            })
        })
        await conn.modifyChat (testJid, ChatModification.mute, 8*60*60*1000) // 8 hours in the future
        await waitForEvent
        await delay (2000)
        await conn.modifyChat (testJid, ChatModification.unmute)
    })
    it('should star/unstar messages', async () => {
        for (let i = 1; i <= 5; i++) {
          await conn.sendMessage(testJid, `Message ${i}`, MessageType.text)
          await delay(1000)
        }

        let response = await conn.loadMessages(testJid, 5)
        let starred = response.messages.filter(m => m.starred)
        assert.strictEqual(starred.length, 0)
    
        conn.starMessage(response.messages[2].key)
        await delay(2000)
        conn.starMessage(response.messages[4].key)
        await delay(2000)
    
        response = await conn.loadMessages(testJid, 5)
        starred = response.messages.filter(m => m.starred)
        assert.strictEqual(starred.length, 2)
        await delay(2000)
        
        conn.starMessage(response.messages[2].key, 'unstar')
        await delay(2000)

        response = await conn.loadMessages(testJid, 5)
        starred = response.messages.filter(m => m.starred)
        assert.strictEqual(starred.length, 1)
    })
    it('should clear a chat', async () => {
        // Uses chat with yourself to avoid losing chats
        const selfJid = conn.user.jid

        for (let i = 1; i <= 5; i++) {
          await conn.sendMessage(selfJid, `Message ${i}`, MessageType.text)
          await delay(1000)
        }

        let response = await conn.loadMessages(selfJid, 50)
        const initialCount = response.messages.length

        assert.ok(response.messages.length >= 0)
    
        conn.starMessage(response.messages[2].key)
        await delay(2000)
        conn.starMessage(response.messages[4].key)
        await delay(2000)
    
        await conn.modifyChat(selfJid, ChatModification.clear)
        await delay(2000)
    
        response = await conn.loadMessages(selfJid, 50)
        await delay(2000)
        assert.ok(response.messages.length < initialCount)
        assert.ok(response.messages.length > 1)
    
        await conn.modifyChat(selfJid, ChatModification.clear, true)
        await delay(2000)
    
        response = await conn.loadMessages(selfJid, 50)
        assert.strictEqual(response.messages.length, 1)
    })
    it('should return search results', async () => {
        const jids = [null, testJid]
        for (let i in jids) {
            let response = await conn.searchMessages('Hello', jids[i], 25, 1)
            assert.ok (response.messages)
            assert.ok (response.messages.length >= 0)

            response = await conn.searchMessages('剛剛試咗😋一個字', jids[i], 25, 1)
            assert.ok (response.messages)
            assert.ok (response.messages.length >= 0)
        }
    })

    it('should load a single message', async () => {
        const {messages} = await conn.loadMessages (testJid, 25)
        for (var message of messages) {
            const loaded = await conn.loadMessage (testJid, message.key.id)
            assert.strictEqual (loaded.key.id, message.key.id, `loaded message ${JSON.stringify(message)} incorrectly`)
            await delay (500)
        } 
    })
    // open the other phone and look at the updates to really verify stuff
    it('should send presence updates', async () => {
        conn.shouldLogMessages = true
        conn.requestPresenceUpdate(testJid)

        const sequence = [ Presence.available, Presence.composing, Presence.paused, Presence.recording, Presence.paused, Presence.unavailable ]
        for (const presence of sequence) {
            await delay(5000)
            await conn.updatePresence(presence !== Presence.unavailable ? testJid : null, presence)
            //console.log(conn.messageLog.slice(-1))
            console.log('sent update ', presence)
        }
    })
    it('should generate link previews correctly', async () => {
        await conn.generateLinkPreview ('hello this is from https://www.github.com/adiwajshing/Baileys')
        // two links should fail
        await assert.rejects (
            conn.generateLinkPreview ('I sent links to https://teachyourselfcs.com/ and https://www.fast.ai/')
        )
    })
    // this test requires quite a few messages with the test JID
    it('should detect overlaps and clear messages accordingly', async () => {
        // wait for chats
        await new Promise(resolve => (
            conn.once('initial-data-received', resolve)
        ))

        conn.maxCachedMessages = 100

        const chat = conn.chats.get(testJid)
        const oldCount = chat.messages.length
        console.log(`test chat has ${oldCount} pre-loaded messages`)
        // load 100 messages
        await conn.loadMessages(testJid, 100, undefined)
        assert.strictEqual(chat.messages.length, 100)
        
        conn.close()
        // remove all latest messages
        chat.messages = newMessagesDB( chat.messages.all().slice(0, 20) )

        const task = new Promise(resolve => (
            conn.on('initial-data-received', ({ chatsWithMissingMessages }) => {
                assert.strictEqual(Object.keys(chatsWithMissingMessages).length, 1)
                const missing = chatsWithMissingMessages.find(({ jid }) => jid === testJid)
                assert.ok(missing, 'missing message not detected')
                assert.strictEqual(
                    conn.chats.get(testJid).messages.length,
                    missing.count
                )
                assert.strictEqual(missing.count, oldCount)
                resolve(undefined)
            })
        ))

        await conn.connect()

        await task
    })

    it('should toggle disappearing messages', async () => {
        let chat = conn.chats.get(testJid)
        if (!chat) {
            // wait for chats
            await new Promise(resolve => (
                conn.once('chats-received', resolve)
            ))
            chat = conn.chats.get(testJid)
        }
        
        const waitForChatUpdate = (ephemeralOn: boolean) => (
            new Promise(resolve => (
                conn.on('chat-update', ({ jid, ephemeral }) => {
                    if (jid === testJid && typeof ephemeral !== 'undefined') {
                        assert.strictEqual(!!(+ephemeral), ephemeralOn)
                        assert.strictEqual(!!(+chat.ephemeral), ephemeralOn)
                        resolve(undefined)
                        conn.removeAllListeners('chat-update')
                    }
                })
            ))
        )
        const toggleDisappearingMessages = async (on: boolean) => {
            const update = waitForChatUpdate(on)
            await conn.toggleDisappearingMessages(testJid, on ? WA_DEFAULT_EPHEMERAL : 0)
            await update
        }
        
        if (!chat.eph_setting_ts) {
            await toggleDisappearingMessages(true)
        }

        await delay(1000)

        let msg = await sendAndRetrieveMessage(
            conn,
            'This will go poof 😱',
            MessageType.text
        )
        assert.ok(msg.message?.ephemeralMessage)
        
        const contextInfo = msg.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo
        assert.strictEqual(contextInfo.expiration, chat.ephemeral)
        assert.strictEqual(+contextInfo.ephemeralSettingTimestamp, +chat.eph_setting_ts)
        // test message deletion
        await conn.deleteMessage(testJid, msg.key)
        
        await delay(1000)

        await toggleDisappearingMessages(false)

        await delay(1000)

        msg = await sendAndRetrieveMessage(
            conn,
            'This will not go poof 😔',
            MessageType.text
        )
        assert.ok(msg.message.extendedTextMessage)
    })
    it('should block & unblock a user', async () => {
        const blockedCount = conn.blocklist.length;

        const waitForEventAdded = new Promise<void> (resolve => {
            conn.once ('blocklist-update', ({added}) => {
                assert.ok (added.length)
                resolve ()
            })
        })

        await conn.blockUser (testJid, 'add')
        assert.strictEqual(conn.blocklist.length, blockedCount + 1);
        await waitForEventAdded

        await delay (2000)
        const waitForEventRemoved = new Promise<void> (resolve => {
            conn.once ('blocklist-update', ({removed}) => {
                assert.ok (removed.length)
                resolve ()
            })
        })

        await conn.blockUser (testJid, 'remove')
        assert.strictEqual(conn.blocklist.length, blockedCount);
        await waitForEventRemoved
    })
    it('should exit an invalid query', async () => {
        // try and send an already sent message
        let msg: WAMessage
        await conn.findMessage(testJid, 5, m => {
            if(m.key.fromMe) {
                msg = m
                return true
            }
        })
        try {
            await conn.relayWAMessage(msg)
            assert.fail('should not have sent')
        } catch(error) {
            assert.strictEqual(error.status, 422)
        }
    })
})
