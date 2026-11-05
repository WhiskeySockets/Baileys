import { EventEmitter } from 'events'
import { jest } from '@jest/globals'
import P from 'pino'
import type { BinaryNode } from '../../WABinary'

// jest.mock does not apply to static imports under ESM, so the client is mocked
// with unstable_mockModule and everything that loads the socket is imported only
// after registering it.
// The mock is a real EventEmitter so emitted 'CB:*' events reach the handlers.
const send = jest.fn((_data: unknown, cb?: (err?: Error) => void) => {
	cb?.()
	return true
})

class MockWebSocketClient extends EventEmitter {
	isOpen = true
	isClosed = false
	isClosing = false
	isConnecting = false
	connect() {}
	async close() {}
	send = send
}

jest.unstable_mockModule('../../Socket/Client/websocket', () => ({ WebSocketClient: MockWebSocketClient }))

const { DEFAULT_CONNECTION_CONFIG } = await import('../../Defaults')
const { default: makeWASocket } = await import('../../Socket')
const { makeSession } = await import('../TestUtils/session')

describe('<status> stanza', () => {
	it('is acked with class "status", or the server ends the stream later', async () => {
		const { state, clear } = await makeSession()
		state.creds.me = { id: '1234567890:1@s.whatsapp.net', name: 'Test User' }

		const lines: string[] = []
		const logger = P({ level: 'debug' }, { write: (line: string) => lines.push(line) })
		const sock = makeWASocket({ ...DEFAULT_CONNECTION_CONFIG, auth: state, logger })
		send.mockClear()

		const node: BinaryNode = {
			tag: 'status',
			attrs: { id: '3A2069ED', from: '5511999999999@s.whatsapp.net', type: 'media' }
		}
		sock.ws.emit('CB:status', node)
		await new Promise(resolve => setTimeout(resolve, 50))

		const entries = lines.map(line => JSON.parse(line))
		const acks = entries.filter(entry => entry.msg === 'sent ack')
		expect(acks.map(entry => entry.sent)).toEqual([
			{ id: '3A2069ED', to: '5511999999999@s.whatsapp.net', class: 'status', type: 'media' }
		])
		// the ack must actually reach the socket, not just be logged
		expect(send).toHaveBeenCalledTimes(1)
		expect(entries.filter(entry => entry.level >= 50)).toEqual([])

		await sock.end(new Error('Test completed'))
		await clear()
	})
})
