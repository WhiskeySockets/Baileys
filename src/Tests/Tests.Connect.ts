import * as assert from 'assert'
import {WAConnection} from '../WAConnection/WAConnection'
import { AuthenticationCredentialsBase64, BaileysError, MessageLogLevel } from '../WAConnection/Constants'
import { delay, promiseTimeout } from '../WAConnection/Utils'

describe('QR Generation', () => {
    it('should generate QR', async () => {

        const conn = new WAConnection()
        conn.regenerateQRIntervalMs = 5000
        let calledQR = 0
        conn.removeAllListeners ('qr')
        conn.on ('qr', qr => calledQR += 1)
        
        await conn.connect(15000)
            .then (() => assert.fail('should not have succeeded'))
            .catch (error => {
                assert.equal (error.message, 'timed out')
            })
        assert.equal (conn['pendingRequests'].length, 0)
        assert.equal (Object.keys(conn['callbacks']).filter(key => !key.startsWith('function:')).length, 0)
        assert.ok(calledQR >= 2, 'QR not called')
    })
})

describe('Test Connect', () => {
    let auth: AuthenticationCredentialsBase64
    it('should connect', async () => {
        console.log('please be ready to scan with your phone')
        
        const conn = new WAConnection()
        await conn.connect (null)
        assert.ok(conn.user?.id)
        assert.ok(conn.user?.phone)
        assert.ok (conn.user?.imgUrl || conn.user.imgUrl === '')

        conn.close()
        auth = conn.base64EncodedAuthInfo()
    })
    it('should reconnect', async () => {
        const conn = new WAConnection()
        await conn
        .loadAuthInfo (auth)
        .connect (20*1000)
        .then (conn => {
            assert.ok(conn.user)
            assert.ok(conn.user.id)

            const chatArray = conn.chats.all()
            if (chatArray.length > 0) {
                assert.ok(chatArray[0].jid)
                assert.ok(chatArray[0].count !== null)
                if (chatArray[0].messages.length > 0) {
                    assert.ok(chatArray[0].messages[0])
                }  
            }
            const contactValues = Object.values(conn.contacts)
            if (contactValues[0]) {
                assert.ok(contactValues[0].jid)
            }
        })
        .then (() => conn.logout())
        .then (() => conn.loadAuthInfo(auth))
        .then (() => (
            conn.connect()
                .then (() => assert.fail('should not have reconnected'))
                .catch (err => {
                    assert.ok (err instanceof BaileysError)
                    assert.ok ((err as BaileysError).status >= 400)
                })
        ))
        .finally (() => conn.close())
    })
})
describe ('Pending Requests', async () => {
    it('should queue requests when closed', async () => {
          const conn = new WAConnection ()
          conn.pendingRequestTimeoutMs = null

          await conn.loadAuthInfo('./auth_info.json').connect ()
          
          await delay (2000)

          conn.close ()

          const task: Promise<any> = conn.query({json: ['query', 'Status', conn.user.id]})

          await delay (2000)

          conn.connect ()
          const json = await task
          
          assert.ok (json.status)

          conn.close ()
    })
})