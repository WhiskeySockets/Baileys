import Boom from 'boom'
import P from 'pino'
import BinaryNode from '../BinaryNode'
import makeConnection, { Connection, DisconnectReason } from '../makeConnection'
import { delay } from '../WAConnection/Utils'

describe('QR Generation', () => {
    it('should generate QR', async () => {
		const QR_GENS = 1
        const {ev, open} = makeConnection({
			maxRetries: 0,
			maxQRCodes: QR_GENS,
			logger: P({ level: 'trace' })
		})
        let calledQR = 0
        ev.removeAllListeners('qr')
        ev.on('state.update', ({ qr }) => {
			if(qr) calledQR += 1
		})
        
		await expect(open()).rejects.toThrowError('Too many QR codes')
		expect(
			Object.keys(ev.eventNames()).filter(key => key.startsWith('TAG:'))
		).toHaveLength(0)
		expect(calledQR).toBeGreaterThanOrEqual(QR_GENS)
    }, 60_000)
})

describe('Test Connect', () => {
	const logger = P({ level: 'trace' })
    it('should connect', async () => {
		
        logger.info('please be ready to scan with your phone')
        
        const conn = makeConnection({
			logger,
			printQRInTerminal: true
		})
        await conn.open()
		const { user, isNewLogin } = await conn.getState()
		expect(user).toHaveProperty('jid')
		expect(user).toHaveProperty('name')
		expect(isNewLogin).toBe(true)

        conn.close()
    }, 65_000)

    it('should restore session', async () => {
        const conn = makeConnection({
			printQRInTerminal: true,
			logger,
		})
		await conn.open()
		conn.close()

		await delay(2500)
		
        await conn.open()
		const { user, isNewLogin, qr } = await conn.getState()
		expect(user).toHaveProperty('jid')
		expect(user).toHaveProperty('name')
		expect(isNewLogin).toBe(false)
		expect(qr).toBe(undefined)

		conn.close()
    }, 65_000)

    it('should logout', async () => {
        let conn = makeConnection({
			printQRInTerminal: true,
			logger,
		})
        await conn.open()
		const { user, qr } = await conn.getState()
		expect(user).toHaveProperty('jid')
		expect(user).toHaveProperty('name')
		expect(qr).toBe(undefined)

		const credentials = conn.getAuthInfo()
        await conn.logout()

		conn = makeConnection({ 
			credentials,
			logger
		})
		await expect(conn.open()).rejects.toThrowError('Unexpected error in login')
    }, 65_000)
})

describe ('Reconnects', () => {
    const verifyConnectionOpen = async (conn: Connection) => {
        expect((await conn.getState()).user).toBeDefined()
        let failed = false
        // check that the connection stays open
		conn.ev.on('state.update', ({ connection, lastDisconnect }) => {
			if(connection === 'close' && !!lastDisconnect.error) {
				failed = true
			}
		})
        await delay (60*1000)
        conn.close ()

        expect(failed).toBe(false)
    }
    it('should dispose correctly on bad_session', async () => {
        const conn = makeConnection({
			reconnectMode: 'on-any-error',
			credentials: './auth_info.json',
			maxRetries: 2,
			connectCooldownMs: 500
		})
        let gotClose0 = false
        let gotClose1 = false

		const openPromise = conn.open()

        conn.getSocket().ev.once('ws-close', () => {
            gotClose0 = true
        })
        conn.ev.on('state.update', ({ lastDisconnect }) => {
			//@ts-ignore
            if(lastDisconnect?.error?.output?.statusCode === DisconnectReason.badSession) {
                gotClose1 = true
            }
        })
        setTimeout (() => conn.getSocket().ws.emit ('message', Buffer.from('some-tag,sdjjij1jo2ejo1je')), 1500)
        await openPromise

        console.log('opened connection')

		await delay(1000)
		conn.getSocket().ws.emit ('message', Buffer.from('some-tag,sdjjij1jo2ejo1je'))
		
		await delay(2000)
        await conn.waitForConnection()

        conn.close()

		expect(gotClose0).toBe(true)
		expect(gotClose1).toBe(true)
    }, 20_000)
    /**
     * the idea is to test closing the connection at multiple points in the connection 
     * and see if the library cleans up resources correctly
     */
    it('should cleanup correctly', async () => {
        const conn = makeConnection({
			reconnectMode: 'on-any-error',
			credentials: './auth_info.json'
		})
        let timeoutMs = 100
        while (true) {
            let tmout = setTimeout (() => {
                conn.close()
            }, timeoutMs)
            try {
                await conn.open()
                clearTimeout (tmout)
                break
            } catch (error) {

            }
            // exponentially increase the timeout disconnect
            timeoutMs *= 2
        }
        await verifyConnectionOpen(conn)
    }, 120_000)
    /**
     * the idea is to test closing the connection at multiple points in the connection 
     * and see if the library cleans up resources correctly
     */
    it('should disrupt connect loop', async () => {
        const conn = makeConnection({
			reconnectMode: 'on-any-error',
			credentials: './auth_info.json'
		})

        let timeout = 1000
        let tmout
        const endConnection = async () => {
            while (!conn.getSocket()) {
                await delay(100)
            }
            conn.getSocket().end(Boom.preconditionRequired('conn close'))

            while (conn.getSocket()) {
                await delay(100)
            }

            timeout *= 2
            tmout = setTimeout (endConnection, timeout) 
        }
        tmout = setTimeout (endConnection, timeout) 

        await conn.open()
        clearTimeout (tmout)

        await verifyConnectionOpen(conn)
    }, 120_000)
})