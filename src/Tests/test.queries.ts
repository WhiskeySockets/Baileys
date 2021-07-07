import BinaryNode from '../BinaryNode'
import makeConnection from '../makeConnection'
import { delay } from '../WAConnection/Utils'

describe('Queries', () => {
	/*it ('should correctly send updates for chats', async () => {
		const conn = makeConnection({
			pendingRequestTimeoutMs: undefined,
			credentials: './auth_info.json'
		})
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
	})*/
	it('should queue requests when closed', async () => {
		const conn = makeConnection({
			credentials: './auth_info.json'
		})
		await conn.open()
		await delay(2000)

		conn.close()
		const { user: { jid } } = await conn.getState()
		const task: Promise<any> = conn.query({
			json: ['query', 'Status', jid]
		})

		await delay(2000)

		conn.open()
		const json = await task

		expect(json.status).toBeDefined()

		conn.close()
	}, 65_000)

    it('[MANUAL] should recieve query response after phone disconnect', async () => {
        const conn = makeConnection ({
			printQRInTerminal: true,
			credentials: './auth_info.json'
		})
        await conn.open()
		const { phoneConnected } = await conn.getState()
        expect(phoneConnected).toBe(true)

        try {
            const waitForEvent = expect => new Promise (resolve => {
                conn.ev.on('state.update', ({phoneConnected}) => {
                    if (phoneConnected === expect) {
                        conn.ev.removeAllListeners('state.update')
                        resolve(undefined)
                    }
                })
            })

            console.log('disconnect your phone from the internet')
            await delay(10_000)
            console.log('phone should be disconnected now, testing...')

			const query = conn.query({
				json: new BinaryNode(
					'query',
					{
						epoch: conn.getSocket().currentEpoch().toString(),
						type: 'message',
						jid: '1234@s.whatsapp.net',
						kind: 'before',
						count: '10',
					}
				),
				requiresPhoneConnection: true,
				expect200: false
			})
            await waitForEvent(false)
            
            console.log('reconnect your phone to the internet')
            await waitForEvent(true)

            console.log('reconnected successfully')

            await expect(query).resolves.toBeDefined()
        } finally {
            conn.close()
        }
    }, 65_000)

	it('should re-execute query on connection closed error', async () => {
		const conn = makeConnection({
			credentials: './auth_info.json'
		})
		await conn.open()
		const { user: { jid } } = await conn.getState()
		const task: Promise<any> = conn.query({ json: ['query', 'Status', jid], waitForOpen: true })

		await delay(20)
		// fake cancel the connection
		conn.getSocket().ev.emit('message', '1234,["Pong",false]')

		await delay(2000)

		const json = await task

		expect(json.status).toBeDefined()

		conn.close()
	}, 65_000)
})