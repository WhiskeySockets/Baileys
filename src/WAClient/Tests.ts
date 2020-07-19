import { WAClient } from './WAClient'
import { MessageType, MessageOptions, Mimetype, Presence, ChatModification } from './Constants'
import * as fs from 'fs'
import * as assert from 'assert'

import { decodeMediaMessage, validateJIDForSending } from './Utils'
import { promiseTimeout, createTimeout } from '../WAConnection/Utils'

require ('dotenv').config () // dotenv to load test jid
const testJid = process.env.TEST_JID || '1234@s.whatsapp.net' // set TEST_JID=xyz@s.whatsapp.net in a .env file in the root directory

async function sendAndRetreiveMessage(client: WAClient, content, type: MessageType, options: MessageOptions = {}) {
    const response = await client.sendMessage(testJid, content, type, options)
    assert.strictEqual(response.status, 200)
    const messages = await client.loadConversation(testJid, 1, null, true)
    assert.strictEqual(messages[0].key.id, response.messageID)
    return messages[0]
}
function WAClientTest(name: string, func: (client: WAClient) => void) {
    describe(name, () => {
        const client = new WAClient()
        before(async () => {
            const file = './auth_info.json'
            await client.connectSlim(file)
            fs.writeFileSync(file, JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
        })
        after(() => client.close())
        func(client)
    })
}
WAClientTest('Messages', (client) => {
    it('should send a text message', async () => {
        const message = await sendAndRetreiveMessage(client, 'hello fren', MessageType.text)
        assert.strictEqual(message.message.conversation, 'hello fren')
    })
    it('should send a link preview', async () => {
        const content = await client.generateLinkPreview ('hello this is from https://www.github.com/adiwajshing/Baileys')
        const message = await sendAndRetreiveMessage(client, content, MessageType.text)
        const received = message.message.extendedTextMessage
        assert.strictEqual(received.text, content.text)
        
        fs.writeFileSync ('Media/received-thumb.jpeg', content.jpegThumbnail)
    })
    it('should quote a message', async () => {
        const messages = await client.loadConversation(testJid, 2)
        const message = await sendAndRetreiveMessage(client, 'hello fren 2', MessageType.extendedText, {
            quoted: messages[0],
        })
        assert.strictEqual(message.message.extendedTextMessage.contextInfo.stanzaId, messages[0].key.id)
    })
    it('should send a gif', async () => {
        const content = fs.readFileSync('./Media/ma_gif.mp4')
        const message = await sendAndRetreiveMessage(client, content, MessageType.video, { mimetype: Mimetype.gif })
        const file = await decodeMediaMessage(message.message, './Media/received_vid')
    })
    it('should send an image', async () => {
        const content = fs.readFileSync('./Media/meme.jpeg')
        const message = await sendAndRetreiveMessage(client, content, MessageType.image)
        const file = await decodeMediaMessage(message.message, './Media/received_img')
        //const message2 = await sendAndRetreiveMessage (client, 'this is a quote', MessageType.extendedText)
    })
    it('should send an image & quote', async () => {
        const messages = await client.loadConversation(testJid, 1)
        const content = fs.readFileSync('./Media/meme.jpeg')
        const message = await sendAndRetreiveMessage(client, content, MessageType.image, { quoted: messages[0] })
        const file = await decodeMediaMessage(message.message, './Media/received_img')
        assert.strictEqual(message.message.imageMessage.contextInfo.stanzaId, messages[0].key.id)
    })
    it('should send a text message & delete it', async () => {
        const message = await sendAndRetreiveMessage(client, 'hello fren', MessageType.text)
        await createTimeout (2000)
        await client.deleteMessage (testJid, message.key)
    })
    it('should clear the most recent message', async () => {
        const messages = await client.loadConversation (testJid, 1)
        await createTimeout (2000)
        await client.clearMessage (messages[0].key)
    })
})

describe('Validate WhatsApp IDs', () => {
    it ('should correctly validate', () => {
        assert.doesNotThrow (() => validateJIDForSending ('12345@s.whatsapp.net'))
        assert.doesNotThrow (() => validateJIDForSending ('919999999999@s.whatsapp.net'))
        assert.doesNotThrow (() => validateJIDForSending ('10203040506@s.whatsapp.net'))
        assert.doesNotThrow (() => validateJIDForSending ('12345-3478@g.us'))
        assert.doesNotThrow (() => validateJIDForSending ('1234567890-34712121238@g.us'))
        assert.throws (() => validateJIDForSending ('123454677@c.us'))
        assert.throws (() => validateJIDForSending ('+123454677@s.whatsapp.net'))
        assert.throws (() => validateJIDForSending ('+12345-3478@g.us'))
    })
})
WAClientTest('Presence', (client) => {
    it('should update presence', async () => {
        const presences = Object.values(Presence)
        for (const i in presences) {
            const response = await client.updatePresence(testJid, presences[i])
            assert.strictEqual(response.status, 200)

            await createTimeout(1500)
        }
    })
})
WAClientTest('Misc', (client) => {
    it('should tell if someone has an account on WhatsApp', async () => {
        const response = await client.isOnWhatsApp(testJid)
        assert.strictEqual(response, true)

        const responseFail = await client.isOnWhatsApp('abcd@s.whatsapp.net')
        assert.strictEqual(responseFail, false)
    })
    it('should return the status', async () => {
        const response = await client.getStatus(testJid)
        assert.ok(response.status)
        assert.strictEqual(typeof response.status, 'string')
    })
    it('should return the stories', async () => {
        await client.getStories()
    })
    it('should return the profile picture', async () => {
        const response = await client.getProfilePicture(testJid)
        assert.ok(response)
        assert.rejects(client.getProfilePicture('abcd@s.whatsapp.net'))
    })
    it('should mark a chat unread', async () => {
        await client.sendReadReceipt(testJid, null, 'unread')
    })
    it('should archive & unarchive', async () => {
        await client.modifyChat (testJid, ChatModification.archive)
        await createTimeout (2000)
        await client.modifyChat (testJid, ChatModification.unarchive)
    })
    it('should pin & unpin a chat', async () => {
        const response = await client.modifyChat (testJid, ChatModification.pin)
        await createTimeout (2000)
        await client.modifyChat (testJid, ChatModification.unpin, {stamp: response.stamp})
    })
    it('should mute & unmute a chat', async () => {
        const mutedate = new Date (new Date().getTime() + 8*60*60*1000) // 8 hours in the future
        await client.modifyChat (testJid, ChatModification.mute, {stamp: mutedate})
        await createTimeout (2000)
        await client.modifyChat (testJid, ChatModification.unmute, {stamp: mutedate})
    })
    it('should return search results', async () => {
        const jids = [null, testJid]
        for (let i in jids) {
            const response = await client.searchMessages('Hello', jids[i], 25, 1)
            assert.ok (response.messages)
            assert.ok (response.messages.length >= 0)
        }
    })
})
WAClientTest('Groups', (client) => {
    let gid: string
    it('should create a group', async () => {
        const response = await client.groupCreate('Cool Test Group', [testJid])
        gid = response.gid
        console.log('created group: ' + JSON.stringify(response))
    })
    it('should retreive group invite code', async () => {
        const code = await client.groupInviteCode(gid)
        assert.ok(code)
        assert.strictEqual(typeof code, 'string')
    })
    it('should retreive group metadata', async () => {
        const metadata = await client.groupMetadata(gid)
        assert.strictEqual(metadata.id, gid)
        assert.strictEqual(metadata.participants.filter((obj) => obj.id.split('@')[0] === testJid.split('@')[0]).length, 1)
    })
    it('should send a message on the group', async () => {
        await client.sendMessage(gid, 'hello', MessageType.text)
    })
    it('should update the subject', async () => {
        const subject = 'V Cool Title'
        await client.groupUpdateSubject(gid, subject)

        const metadata = await client.groupMetadata(gid)
        assert.strictEqual(metadata.subject, subject)
    })
    it('should remove someone from a group', async () => {
        await client.groupRemove(gid, [testJid])
    })
    it('should leave the group', async () => {
        await client.groupLeave(gid)
        await client.groupMetadataMinimal (gid)
    })
    it('should archive the group', async () => {
        await client.archiveChat(gid)
    })
    it('should delete the group', async () => {
        await client.deleteChat(gid)
    })
})
WAClientTest('Events', (client) => {
    it('should deliver a message', async () => {
        const waitForUpdate = () =>
            new Promise((resolve) => {
                client.setOnMessageStatusChange((update) => {
                    if (update.ids.includes(response.messageID)) {
                        resolve()
                    }
                })
            })
        const response = await client.sendMessage(testJid, 'My Name Jeff', MessageType.text)
        await promiseTimeout(10000, waitForUpdate())
    })
    /*it ('should update me on presence', async () => {
        //client.logUnhandledMessages = true
        client.setOnPresenceUpdate (presence => {
            console.log (presence)
        })
        const response = await client.requestPresenceUpdate (client.userMetaData)
        assert.strictEqual (response.status, 200)
        await createTimeout (25000)
    })*/
})
/*WAClientTest ('Testz', client => {
    it ('should work', async () => {
       
    })
})*/