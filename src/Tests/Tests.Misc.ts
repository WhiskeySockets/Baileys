import { Presence, ChatModification, delay } from '../WAConnection/WAConnection'
import { promises as fs } from 'fs'
import * as assert from 'assert'
import fetch from 'node-fetch'
import { WAConnectionTest, testJid } from './Common'

WAConnectionTest('Misc', (conn) => {
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
            conn.on ('user-status-update', ({jid, status}) => {
                if (jid === conn.user.jid) {
                    assert.strictEqual (status, newStatus)
                    conn.removeAllListeners ('user-status-update')
                    resolve ()
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
    it('should return the stories', async () => {
        await conn.getStories()
    })
    it('should change the profile picture', async () => {
        await delay (5000)

        const ppUrl = await conn.getProfilePicture(conn.user.jid)
        const fetched = await fetch(ppUrl)
        const buff = await fetched.buffer ()

        const newPP = await fs.readFile ('./Media/cat.jpeg')
        const response = await conn.updateProfilePicture (conn.user.jid, newPP)

        await delay (10000)

        await conn.updateProfilePicture (conn.user.jid, buff) // revert back
    })
    it('should return the profile picture', async () => {
        const response = await conn.getProfilePicture(testJid)
        assert.ok(response)
        assert.rejects(conn.getProfilePicture('abcd@s.whatsapp.net'))
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
                        resolve ()
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
        await conn.modifyChat (testJid, ChatModification.archive)
        await delay (2000)
        await conn.modifyChat (testJid, ChatModification.unarchive)
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
                    resolve ()
                }
            })
        })
        await conn.modifyChat (testJid, ChatModification.mute, 8*60*60*1000) // 8 hours in the future
        await waitForEvent
        await delay (2000)
        await conn.modifyChat (testJid, ChatModification.unmute)
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
})