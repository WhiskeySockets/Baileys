import * as assert from 'assert'
import {WAConnection} from '../WAConnection'
import { AuthenticationCredentialsBase64, BaileysError, ReconnectMode, DisconnectReason, WAChat, WAContact } from '../WAConnection/Constants'
import { delay } from '../WAConnection/Utils'
import { assertChatDBIntegrity, makeConnection, testJid } from './Common'

describe('QR Generation', () => {
    it('should generate QR', async () => {
        const conn = makeConnection ()
        conn.connectOptions.maxRetries = 0

        let calledQR = 0
        conn.removeAllListeners ('qr')
        conn.on ('qr', () => calledQR += 1)
        
        await conn.connect()
            .then (() => assert.fail('should not have succeeded'))
            .catch (error => {})
        assert.deepStrictEqual (
            Object.keys(conn.eventNames()).filter(key => key.startsWith('TAG:')), 
            []
        )
        assert.ok(calledQR >= 2, 'QR not called')
    })
})

describe('Test Connect', () => {
    let auth: AuthenticationCredentialsBase64
    it('should connect', async () => {
        console.log('please be ready to scan with your phone')
        
        const conn = makeConnection ()

        let credentialsUpdateCalled = false
        conn.on ('credentials-updated', () => credentialsUpdateCalled = true)

        await conn.connect ()
        assert.ok(conn.user?.jid)
        assert.ok(conn.user?.phone)
        assert.ok (conn.user?.imgUrl || conn.user.imgUrl === '')
        assert.ok (credentialsUpdateCalled)

        assertChatDBIntegrity (conn)

        conn.close()
        auth = conn.base64EncodedAuthInfo()
    })
    it('should restore session', async () => {
        const conn = makeConnection ()

        let credentialsUpdateCalled = false
        conn.on ('credentials-updated', () => credentialsUpdateCalled = true)

        await conn.loadAuthInfo (auth).connect ()
        assert.ok(conn.user)
        assert.ok(conn.user.jid)
        assert.ok (credentialsUpdateCalled)

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
        const conn = makeConnection ()
        conn.logger.level = 'debug'
        await conn.loadAuthInfo('./auth_info.json').connect ()
        assert.strictEqual (conn.phoneConnected, true)

        try {
            const waitForEvent = expect => new Promise (resolve => {
                conn.on ('connection-phone-change', ({connected}) => {
                    if (connected === expect) {
                        conn.removeAllListeners ('connection-phone-change')
                        resolve(undefined)
                    }
                })
            })

            console.log ('disconnect your phone from the internet')
            await delay (10_000)
            console.log ('phone should be disconnected now, testing...')

            const messagesPromise = Promise.all (
                [ 
                    conn.loadMessages (testJid, 50),
                    conn.getStatus (testJid),
                    conn.getProfilePicture (testJid).catch (() => '')
                ]
            )

            await waitForEvent (false)
            
            console.log ('reconnect your phone to the internet')
            await waitForEvent (true)

            console.log ('reconnected successfully')

            const final = await messagesPromise
            assert.ok (final)
        } finally {
            conn.close ()
        }
    })
})
describe ('Reconnects', () => {
    const verifyConnectionOpen = async (conn: WAConnection) => {
        assert.ok (conn.user.jid)
        let failed = false
        // check that the connection stays open
        conn.on ('close', ({reason}) => {
            if(reason !== DisconnectReason.intentional) failed = true
        })
        await delay (60*1000)

        const status = await conn.getStatus ()
        assert.ok (status)
        assert.ok (!conn['debounceTimeout']) // this should be null

        conn.close ()

        if (failed) assert.fail ('should not have closed again')
    }
    it('should dispose correctly on bad_session', async () => {
        const conn = makeConnection ()
        conn.autoReconnect = ReconnectMode.onAllErrors
        conn.loadAuthInfo ('./auth_info.json')

        let gotClose0 = false
        let gotClose1 = false

        conn.on ('ws-close', ({ reason }) => {
            gotClose0 = true
        })
        conn.on ('close', ({ reason }) => {
            if (reason === DisconnectReason.badSession) gotClose1 = true
        })
        setTimeout (() => conn['conn'].emit ('message', Buffer.from('some-tag,sdjjij1jo2ejo1je')), 1500)
        await conn.connect ()

        setTimeout (() => conn['conn'].emit ('message', Buffer.from('some-tag,sdjjij1jo2ejo1je')), 1500)

        await new Promise (resolve => {
            conn.on ('open', resolve)
        })

        assert.ok (gotClose0, 'did not receive bad_session close initially')
        assert.ok (gotClose1, 'did not receive bad_session close')

        conn.close ()
    })
    /**
     * the idea is to test closing the connection at multiple points in the connection 
     * and see if the library cleans up resources correctly
     */
    it('should cleanup correctly', async () => {
        const conn = makeConnection ()
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
        const conn = makeConnection ()

        conn.autoReconnect = ReconnectMode.onAllErrors
        conn.loadAuthInfo ('./auth_info.json')

        let timeout = 1000
        let tmout
        const endConnection = async () => {
            while (!conn['conn']) {
                await delay(100)
            }
            conn['conn'].close ()

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
        const conn = makeConnection ()
        conn.autoReconnect = ReconnectMode.onConnectionLost

        await conn.loadAuthInfo('./auth_info.json').connect ()
        assert.strictEqual (conn.phoneConnected, true)

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
                        resolve(undefined)
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
                    resolve(undefined)
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
        const conn = makeConnection ()
        conn.autoReconnect = ReconnectMode.onConnectionLost

        await conn.loadAuthInfo('./auth_info.json').connect ()
        assert.strictEqual (conn.phoneConnected, true)

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
    it ('should correctly send updates for chats', async () => {
        const conn = makeConnection ()
        conn.pendingRequestTimeoutMs = null
        conn.loadAuthInfo('./auth_info.json')

        const task = new Promise(resolve => conn.once('chats-received', resolve))
        await conn.connect ()
        await task

        conn.close ()

        const oldChat = conn.chats.all()[0]
        oldChat.archive = 'true' // mark the first chat as archived
        oldChat.modify_tag = '1234' // change modify tag to detect change

        const promise = new Promise(resolve => conn.once('chats-update', resolve))

        const result = await conn.connect ()
        assert.ok (!result.newConnection)

        const chats = await promise as Partial<WAChat>[]
        const chat = chats.find (c => c.jid === oldChat.jid)
        assert.ok (chat)
        
        assert.ok ('archive' in chat)
        assert.strictEqual (Object.keys(chat).length, 3)
        assert.strictEqual (Object.keys(chats).length, 1)

        conn.close ()
    })
    it ('should correctly send updates for contacts', async () => {
        const conn = makeConnection ()
        conn.pendingRequestTimeoutMs = null
        conn.loadAuthInfo('./auth_info.json')

        const task: any = new Promise(resolve => conn.once('contacts-received', resolve))
        await conn.connect ()
        const initialResult = await task
        assert.strictEqual(
            initialResult.updatedContacts.length,
            Object.keys(conn.contacts).length
        )


        conn.close ()

        const [jid] = Object.keys(conn.contacts)
        const oldContact = conn.contacts[jid]
        oldContact.name = 'Lol'
        oldContact.index = 'L'

        const promise = new Promise(resolve => conn.once('contacts-received', resolve))

        const result = await conn.connect ()
        assert.ok (!result.newConnection)

        const {updatedContacts} = await promise as { updatedContacts: Partial<WAContact>[] }
        const contact = updatedContacts.find (c => c.jid === jid)
        assert.ok (contact)
        
        assert.ok ('name' in contact)
        assert.strictEqual (Object.keys(contact).length, 3)
        assert.strictEqual (Object.keys(updatedContacts).length, 1)

        conn.close ()
    })
    it('should queue requests when closed', async () => {
          const conn = makeConnection ()
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
    it('[MANUAL] should receive query response after phone disconnect', async () => {
        const conn = makeConnection ()
        await conn.loadAuthInfo('./auth_info.json').connect ()

        console.log(`disconnect your phone from the internet!`)
        await delay(5000)
        const task = conn.loadMessages(testJid, 50)
        setTimeout(() => console.log('reconnect your phone!'), 20_000)

        const result = await task
        assert.ok(result.messages[0])
        assert.ok(!conn['phoneCheckInterval']) // should be undefined

        conn.close ()
    })
    it('should re-execute query on connection closed error', async () => {
        const conn = makeConnection ()
        //conn.pendingRequestTimeoutMs = 10_000
        await conn.loadAuthInfo('./auth_info.json').connect ()
        const task: Promise<any> = conn.query({json: ['query', 'Status', conn.user.jid], waitForOpen: true})
        
        await delay(20)
        conn['onMessageRecieved']('1234,["Pong",false]') // fake cancel the connection

        await delay(2000)

        const json = await task
        
        assert.ok (json.status)

        conn.close ()
  })
})