import * as assert from 'assert'
import * as QR from 'qrcode-terminal'
import WAConnection from './WAConnection'
import { AuthenticationCredentialsBase64 } from './Constants'
import { createTimeout } from './Utils'

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
    it('should re-generate QR & connect', async () => {
        const conn = new WAConnection()
        conn.onReadyForPhoneAuthentication = async ([ref, publicKey, clientID]) => {
            for (let i = 0; i < 2; i++) {
                console.log ('called QR ' + i + ' times')
                await createTimeout (3000)
                ref = await conn.generateNewQRCode ()
            }
            const str = ref + ',' + publicKey + ',' + clientID
            QR.generate(str, { small: true })
        }
        const user = await conn.connectSlim(null)
        assert.ok(user)
        assert.ok(user.id)

        conn.close()
    })
    it('should reconnect', async () => {
        const conn = new WAConnection()
        const [user, chats, contacts] = await conn.connect(auth, 20*1000)

        assert.ok(user)
        assert.ok(user.id)

        assert.ok(chats)
        
        const chatArray = chats.all()
        if (chatArray.length > 0) {
            assert.ok(chatArray[0].jid)
            assert.ok(chatArray[0].count !== null)
            if (chatArray[0].messages.length > 0) {
                assert.ok(chatArray[0].messages[0])
            }  
        }
        assert.ok(contacts)
        if (contacts.length > 0) {
            assert.ok(contacts[0].jid)
        }
        await conn.logout()
        await assert.rejects(async () => conn.connectSlim(auth), 'reconnect should have failed')
    })
})
describe ('Pending Requests', async () => {
    it('should queue requests when closed', async () => {
          const conn = new WAConnection ()
          conn.pendingRequestTimeoutMs = null

          await conn.connectSlim ()
          
          await createTimeout (2000)

          conn.close ()

          const task: Promise<any> = new Promise ((resolve, reject) => {
            conn.query(['query', 'Status', conn.userMetaData.id])
            .then (json => resolve(json))
            .catch (error => reject ('should not have failed, got error: ' + error))
          })

          await createTimeout (2000)

          await conn.connectSlim ()
          const json = await task
          
          assert.ok (json.status)

          conn.close ()
    })
})