import { jest } from '@jest/globals'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import makeWASocket from '../../Socket'
import { makeSession, mockWebSocket } from '../TestUtils/session'

mockWebSocket()

type WebSocketSend = (data: Uint8Array | Buffer, callback: (error?: Error | null) => void) => void

describe('relayMessage retry resend', () => {
	it('encrypts a device-specific 1:1 retry exactly once', async () => {
		const { state, clear } = await makeSession()
		state.creds.me = {
			id: '1111111111:1@s.whatsapp.net',
			lid: '1111111111:1@lid',
			name: 'Test User'
		}
		state.creds.account = {}

		const sock = makeWASocket({
			...DEFAULT_CONNECTION_CONFIG,
			auth: state,
			shouldSyncHistoryMessage: () => false
		})

		const wsSend = sock.ws.send as unknown as jest.MockedFunction<WebSocketSend>
		wsSend.mockImplementation((_data, callback) => callback())

		const validateSession = jest
			.spyOn(sock.signalRepository, 'validateSession')
			.mockResolvedValue({ exists: true })
		const encryptMessage = jest.spyOn(sock.signalRepository, 'encryptMessage').mockResolvedValue({
			type: 'msg',
			ciphertext: Buffer.from('encrypted')
		})

		await sock.relayMessage(
			'2222222222@lid',
			{ conversation: 'hello' },
			{
				messageId: 'retry-message',
				participant: {
					jid: '2222222222:1@lid',
					count: 1
				}
			}
		)

		expect(validateSession).toHaveBeenCalledWith('2222222222:1@lid')
		expect(encryptMessage).toHaveBeenCalledTimes(1)
		expect(encryptMessage).toHaveBeenCalledWith(
			expect.objectContaining({
				jid: '2222222222:1@lid'
			})
		)

		await sock.end(new Error('Test completed'))
		await clear()
	})
})
