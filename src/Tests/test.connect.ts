import { Boom } from '@hapi/boom'
import P from 'pino'
import BinaryNode from '../BinaryNode'
import makeConnection from '../Connection'
import { delay } from '../Utils/generics'

describe('QR Generation', () => {
    it('should generate QR', async () => {
		const QR_GENS = 1
        const {ev} = makeConnection({
			maxRetries: 0,
			maxQRCodes: QR_GENS,
			logger: P({ level: 'trace' })
		})
        let calledQR = 0
        ev.on('connection.update', ({ qr }) => {
			if(qr) calledQR += 1
		})
        
		await expect(open()).rejects.toThrowError('Too many QR codes')
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
        await conn.waitForConnection(true)
		const { user, isNewLogin } = await conn.getState()
		expect(user).toHaveProperty('jid')
		expect(user).toHaveProperty('name')
		expect(isNewLogin).toBe(true)

        conn.end(undefined)
    }, 65_000)

    it('should restore session', async () => {
        let conn = makeConnection({
			printQRInTerminal: true,
			logger,
		})
		await conn.waitForConnection(true)
		conn.end(undefined)

		await delay(2500)
		
        conn = makeConnection({
			printQRInTerminal: true,
			logger,
		})
		await conn.waitForConnection(true)

		const { user, isNewLogin, qr } = await conn.getState()
		expect(user).toHaveProperty('jid')
		expect(user).toHaveProperty('name')
		expect(isNewLogin).toBe(false)
		expect(qr).toBe(undefined)

		conn.end(undefined)
    }, 65_000)

    it('should logout', async () => {
        let conn = makeConnection({
			printQRInTerminal: true,
			logger,
		})
        await conn.waitForConnection(true)

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
		await expect(
            conn.waitForConnection()
        ).rejects.toThrowError('Unexpected error in login')
    }, 65_000)
})