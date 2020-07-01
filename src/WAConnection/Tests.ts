import * as assert from 'assert'
import WAConnection from './WAConnection'
import { AuthenticationCredentialsBase64 } from './Constants'

describe('QR generation', () => {
    it('should generate QR', async () => {
        const conn = new WAConnection()
        let calledQR = false
        conn.onReadyForPhoneAuthentication = ([ref, curveKey, clientID]) => {
            assert.ok(ref, 'ref nil')
            assert.ok(curveKey, 'curve key nil')
            assert.ok(clientID, 'client ID nil')
            calledQR = true
        }
        await assert.rejects(async () => conn.connectSlim(null, 5000), 'should have failed connect')
        assert.equal(calledQR, true, 'QR not called')
    })
})

describe('Test Connect', () => {
    let auth: AuthenticationCredentialsBase64
    it('should connect', async () => {
        console.log('please be ready to scan with your phone')
        const conn = new WAConnection()
        const user = await conn.connectSlim(null)
        assert.ok(user)
        assert.ok(user.id)

        conn.close()
        auth = conn.base64EncodedAuthInfo()
    })
    it('should reconnect', async () => {
        const conn = new WAConnection()
        const [user, chats, contacts, unread] = await conn.connect(auth, 20*1000)

        assert.ok(user)
        assert.ok(user.id)

        assert.ok(chats)
        if (chats.length > 0) {
            assert.ok(chats[0].jid)
            assert.ok(chats[0].count)
        }
        assert.ok(contacts)
        if (contacts.length > 0) {
            assert.ok(contacts[0].jid)
        }
        assert.ok(unread)
        if (unread.length > 0) {
            assert.ok(unread[0].key)
        }

        await conn.logout()

        await assert.rejects(async () => conn.connectSlim(auth), 'reconnect should have failed')
    })
})