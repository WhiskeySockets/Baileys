import { MessageType, GroupSettingChange, createTimeout, ChatModification } from '../WAConnection/WAConnection'
import * as assert from 'assert'
import { WAConnectionTest, testJid } from './Common'

WAConnectionTest('Groups', (conn) => {
    let gid: string
    it('should create a group', async () => {
        const response = await conn.groupCreate('Cool Test Group', [testJid])
        gid = response.gid
        console.log('created group: ' + JSON.stringify(response))
    })
    it('should retreive group invite code', async () => {
        const code = await conn.groupInviteCode(gid)
        assert.ok(code)
        assert.strictEqual(typeof code, 'string')
    })
    it('should retreive group metadata', async () => {
        const metadata = await conn.groupMetadata(gid)
        assert.strictEqual(metadata.id, gid)
        assert.strictEqual(metadata.participants.filter((obj) => obj.id.split('@')[0] === testJid.split('@')[0]).length, 1)
    })
    it('should update the group description', async () => {
        const newDesc = 'Wow this was set from Baileys'

        await conn.groupUpdateDescription (gid, newDesc)
        await createTimeout (1000)

        const metadata = await conn.groupMetadata(gid)
        assert.strictEqual(metadata.desc, newDesc)
    })
    it('should send a message on the group', async () => {
        await conn.sendMessage(gid, 'hello', MessageType.text)
    })
    it('should update the subject', async () => {
        const subject = 'V Cool Title'
        await conn.groupUpdateSubject(gid, subject)

        const metadata = await conn.groupMetadata(gid)
        assert.strictEqual(metadata.subject, subject)
    })
    it('should update the group settings', async () => {
        await conn.groupSettingChange (gid, GroupSettingChange.messageSend, true)
        await createTimeout (5000)
        await conn.groupSettingChange (gid, GroupSettingChange.settingsChange, true)
    })
    it('should remove someone from a group', async () => {
        await conn.groupRemove(gid, [testJid])
    })
    it('should leave the group', async () => {
        await conn.groupLeave(gid)
        await conn.groupMetadataMinimal (gid)
    })
    it('should archive the group', async () => {
        await conn.modifyChat(gid, ChatModification.archive)
    })
    it('should delete the group', async () => {
        await conn.deleteChat(gid)
    })
})