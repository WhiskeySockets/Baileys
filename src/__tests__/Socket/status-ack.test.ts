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

const statusNode: BinaryNode = {
	tag: 'status',
	attrs: { id: '3A2069ED', from: '5511999999999@s.whatsapp.net', type: 'media' }
}

const emitStatus = async (config: { shouldIgnoreJid?: (jid: string) => boolean } = {}) => {
	const { state, clear } = await makeSession()
	state.creds.me = { id: '1234567890:1@s.whatsapp.net', name: 'Test User' }

	const lines: string[] = []
	const logger = P({ level: 'debug' }, { write: (line: string) => lines.push(line) })
	const sock = makeWASocket({ ...DEFAULT_CONNECTION_CONFIG, ...config, auth: state, logger })
	send.mockClear()

	sock.ws.emit('CB:status', statusNode)
	await new Promise(resolve => setTimeout(resolve, 50))

	await sock.end(new Error('Test completed'))
	await clear()

	return lines.map(line => JSON.parse(line))
}

describe('<status> stanza', () => {
	afterEach(() => {
		send.mockImplementation((_data, cb) => {
			cb?.()
			return true
		})
	})

	it('is acked with class "status", or the server ends the stream later', async () => {
		const entries = await emitStatus()

		const acks = entries.filter(entry => entry.msg === 'sent ack')
		expect(acks.map(entry => entry.sent)).toEqual([
			{ id: '3A2069ED', to: '5511999999999@s.whatsapp.net', class: 'status', type: 'media' }
		])
		// the ack must actually reach the socket, not just be logged
		expect(send).toHaveBeenCalledTimes(1)
		expect(entries.filter(entry => entry.level >= 50)).toEqual([])
	})

	it('reports a failed ack from the ignored-JID path instead of rejecting the listener', async () => {
		send.mockImplementation((_data, cb) => {
			cb?.(new Error('send failed'))
			return true
		})
		const unhandled: unknown[] = []
		const onUnhandled = (reason: unknown) => unhandled.push(reason)
		process.on('unhandledRejection', onUnhandled)

		try {
			const entries = await emitStatus({ shouldIgnoreJid: () => true })

			expect(send).toHaveBeenCalledTimes(1)
			expect(entries.filter(entry => entry.msg === "unexpected error in 'acking status stanza'")).toHaveLength(1)
			expect(unhandled).toEqual([])
		} finally {
			process.off('unhandledRejection', onUnhandled)
		}
	})
})
