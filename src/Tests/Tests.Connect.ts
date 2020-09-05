import * as assert from 'assert'
import {WAConnection} from '../WAConnection/WAConnection'
import { AuthenticationCredentialsBase64, BaileysError, ReconnectMode, DisconnectReason } from '../WAConnection/Constants'
import { delay } from '../WAConnection/Utils'
import { assertChatDBIntegrity } from './Common'

describe('QR Generation', () => {
    it('should generate QR', async () => {
        const conn = new WAConnection()
        conn.regenerateQRIntervalMs = 5000

        let calledQR = 0
        conn.removeAllListeners ('qr')
        conn.on ('qr', qr => calledQR += 1)
        
        await conn.connect()
            .then (() => assert.fail('should not have succeeded'))
            .catch (error => {
                assert.equal (error.message, 'timed out')
            })
        assert.deepEqual (conn['pendingRequests'], [])
        assert.deepEqual (
            Object.keys(conn['callbacks']).filter(key => !key.startsWith('function:')), 
            []
        )
        assert.ok(calledQR >= 2, 'QR not called')
    })
})

describe('Test Connect', () => {
    let auth: AuthenticationCredentialsBase64
    it('should connect', async () => {
        console.log('please be ready to scan with your phone')
        
        const conn = new WAConnection()
        await conn.connect ()
        assert.ok(conn.user?.jid)
        assert.ok(conn.user?.phone)
        assert.ok (conn.user?.imgUrl || conn.user.imgUrl === '')

        assertChatDBIntegrity (conn)

        conn.close()
        auth = conn.base64EncodedAuthInfo()
    })
    it('should reconnect', async () => {
        const conn = new WAConnection()
        conn.connectOptions.timeoutMs = 20*1000
        
        await conn.loadAuthInfo (auth).connect ()
        assert.ok(conn.user)
        assert.ok(conn.user.jid)

        assertChatDBIntegrity (conn)
        await conn.logout()
        conn.loadAuthInfo(auth)
        
        await conn.connect()
            .then (() => assert.fail('should not have reconnected'))
            .catch (err => {
                assert.ok (err instanceof BaileysError)
                assert.ok ((err as BaileysError).status >= 400)
            })
        conn.close()
    })
    it ('should disconnect & reconnect phone', async () => {
        const conn = new WAConnection ()
        await conn.loadAuthInfo('./auth_info.json').connect ()
        assert.equal (conn.phoneConnected, true)

        try {
            const waitForEvent = expect => new Promise (resolve => {
                conn.on ('connection-phone-change', ({connected}) => {
                    assert.equal (connected, expect)
                    conn.removeAllListeners ('connection-phone-change')
                    resolve ()
                })
            })

            console.log ('disconnect your phone from the internet')
            await waitForEvent (false)
            console.log ('reconnect your phone to the internet')
            await waitForEvent (true)
        } finally {
            conn.close ()
        }
    })
})
describe ('Reconnects', () => {
    const verifyConnectionOpen = async (conn: WAConnection) => {
        assert.ok (conn.user.jid)
        // check that the connection stays open
        conn.on ('close', ({reason}) => (
            reason !== DisconnectReason.intentional && assert.fail ('should not have closed again')
        ))
        await delay (60*1000)

        const status = await conn.getStatus ()
        assert.ok (status)

        conn.close ()
    }
    /**
     * the idea is to test closing the connection at multiple points in the connection 
     * and see if the library cleans up resources correctly
     */
    it('should cleanup correctly', async () => {
        const conn = new WAConnection()
        conn.autoReconnect = ReconnectMode.onAllErrors
        conn.loadAuthInfo ('./auth_info.json')

        let timeout = 0.1
        while (true) {
            let tmout = setTimeout (() => conn.close(), timeout*1000)
            try {
                await conn.connect ()
                clearTimeout (tmout)
                break
            } catch (error) {

            }
            // exponentially increase the timeout disconnect
            timeout *= 2
        }
        await verifyConnectionOpen (conn)
    })
    /**
     * the idea is to test closing the connection at multiple points in the connection 
     * and see if the library cleans up resources correctly
     */
    it('should disrupt connect loop', async () => {
        const conn = new WAConnection()
        conn.autoReconnect = ReconnectMode.onAllErrors
        conn.connectOptions.timeoutMs = 20000
        conn.loadAuthInfo ('./auth_info.json')

        let timeout = 1000
        let tmout
        const endConnection = async () => {
            while (!conn['conn']) {
                await delay(100)
            }
            conn['conn'].terminate ()

            while (conn['conn']) {
                await delay(100)
            }

            timeout *= 2
            tmout = setTimeout (endConnection, timeout) 
        }
        tmout = setTimeout (endConnection, timeout) 

        await conn.connect ()
        clearTimeout (tmout)

        await verifyConnectionOpen (conn)
    })
    it ('should reconnect on broken connection', async () => {
        const conn = new WAConnection ()
        conn.autoReconnect = ReconnectMode.onConnectionLost

        await conn.loadAuthInfo('./auth_info.json').connect ()
        assert.equal (conn.phoneConnected, true)

        try {
            const closeConn = () => conn['conn']?.terminate ()
            
            const task = new Promise (resolve => {
                let closes = 0
                conn.on ('close', ({reason, isReconnecting}) => {
                    console.log (`closed: ${reason}`)
                    assert.ok (reason)
                    assert.ok (isReconnecting)
                    closes += 1
                    
                    // let it fail reconnect a few times
                    if (closes >= 1) {
                        conn.removeAllListeners ('close')
                        conn.removeAllListeners ('connecting')
                        resolve ()
                    }
                })
                conn.on ('connecting', () => {
                    // close again
                    delay (3500).then (closeConn)   
                })
            })

            closeConn ()
            await task
            
            await new Promise (resolve => {
                conn.on ('open', () => {
                    conn.removeAllListeners ('open')
                    resolve ()
                })
            })

            conn.close ()
            
            conn.on ('connecting', () => assert.fail('should not connect'))
            await delay (2000)
        } finally {
            conn.removeAllListeners ('connecting')
            conn.removeAllListeners ('close')
            conn.removeAllListeners ('open')
            conn.close ()
        }
    })
    it ('should reconnect & stay connected', async () => {
        const conn = new WAConnection ()
        conn.autoReconnect = ReconnectMode.onConnectionLost

        await conn.loadAuthInfo('./auth_info.json').connect ()
        assert.equal (conn.phoneConnected, true)

        await delay (30*1000)

        conn['conn']?.terminate ()

        conn.on ('close', () => {
            assert.ok (!conn['lastSeen'])
            console.log ('connection closed')
        })
        await new Promise (resolve => conn.on ('open', resolve))
        await verifyConnectionOpen (conn)
    })
})

describe ('Pending Requests', () => {
    it ('should correctly send updates', async () => {
        const conn = new WAConnection ()
        conn.connectOptions.timeoutMs = 20*1000
        conn.pendingRequestTimeoutMs = null

        conn.loadAuthInfo('./auth_info.json')
        await conn.connect ()

        conn.close ()

        const result0 = await conn.connect ()
        assert.deepEqual (result0.updatedChats, {})

        conn.close ()

        const oldChat = conn.chats.all()[0]
        oldChat.archive = 'true' // mark the first chat as archived
        oldChat.modify_tag = '1234' // change modify tag to detect change

        // close the socket after a few seconds second to see if updates are correct after a reconnect
        setTimeout (() => conn['conn'].close(), 5000) 

        const result = await conn.connect ()
        assert.ok (!result.newConnection)

        const chat = result.updatedChats[oldChat.jid]
        assert.ok (chat)
        
        assert.ok ('archive' in chat)
        assert.equal (Object.keys(chat).length, 2)

        assert.equal (Object.keys(result.updatedChats).length, 1)

        conn.close ()
    })
    it('should queue requests when closed', async () => {
          const conn = new WAConnection ()
          //conn.pendingRequestTimeoutMs = null

          await conn.loadAuthInfo('./auth_info.json').connect ()
          
          await delay (2000)

          conn.close ()

          const task: Promise<any> = conn.query({json: ['query', 'Status', conn.user.jid]})

          await delay (2000)

          conn.connect ()
          const json = await task
          
          assert.ok (json.status)

          conn.close ()
    })
})