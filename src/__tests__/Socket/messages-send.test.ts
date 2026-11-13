import { jest } from '@jest/globals'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import makeWASocket from '../../Socket'
import { makeSession, mockWebSocket } from '../TestUtils/session'

mockWebSocket()

type WebSocketSend = (data: Uint8Array | Buffer, callback: (error?: Error | null) => void) => void

const RETRY_PARTICIPANT = '2222222222:3@lid'

async function makeTestSocket() {
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

	// swap the raw socket for an open in-memory one, so relayMessage can "send" offline
	const client = sock.ws as unknown as { socket: unknown }
	const real = client.socket as {
		on: (e: string, f: () => void) => void
		removeAllListeners: () => void
		terminate: () => void
	} | null
	if (real) {
		real.removeAllListeners()
		real.on('error', () => {})
		real.terminate()
	}

	let onClose: (() => void) | undefined
	client.socket = {
		readyState: 1,
		send: jest.fn<WebSocketSend>((_data, callback) => callback()),
		once: (event: string, listener: () => void) => {
			if (event === 'close') onClose = listener
		},
		close: () => onClose?.()
	}

	const validateSession = jest.spyOn(sock.signalRepository, 'validateSession').mockResolvedValue({ exists: true })
	const encryptMessage = jest.spyOn(sock.signalRepository, 'encryptMessage').mockResolvedValue({
		type: 'msg',
		ciphertext: Buffer.from('encrypted')
	})
	jest.spyOn(sock.signalRepository, 'hasSenderKey').mockResolvedValue(false)

	const close = async () => {
		await sock.end(new Error('Test completed'))
		await clear()
	}

	return { sock, validateSession, encryptMessage, close }
}

describe('relayMessage retry resend', () => {
	it('encrypts a device-specific 1:1 retry exactly once', async () => {
		const { sock, validateSession, encryptMessage, close } = await makeTestSocket()

		await sock.relayMessage(
			'2222222222@lid',
			{ conversation: 'hello' },
			{ messageId: 'retry-1on1', participant: { jid: RETRY_PARTICIPANT, count: 1 } }
		)

		expect(validateSession).toHaveBeenCalledWith(RETRY_PARTICIPANT)
		expect(encryptMessage).toHaveBeenCalledTimes(1)
		expect(encryptMessage).toHaveBeenCalledWith(expect.objectContaining({ jid: RETRY_PARTICIPANT }))

		await close()
	})

	it('encrypts a group retry for one participant device exactly once', async () => {
		const { sock, validateSession, encryptMessage, close } = await makeTestSocket()

		await sock.relayMessage(
			'120363000000000000@g.us',
			{ conversation: 'hello group' },
			{ messageId: 'retry-group', participant: { jid: RETRY_PARTICIPANT, count: 2 } }
		)

		expect(validateSession).toHaveBeenCalledWith(RETRY_PARTICIPANT)
		expect(encryptMessage).toHaveBeenCalledTimes(1)
		expect(encryptMessage).toHaveBeenCalledWith(expect.objectContaining({ jid: RETRY_PARTICIPANT }))

		await close()
	})
})
