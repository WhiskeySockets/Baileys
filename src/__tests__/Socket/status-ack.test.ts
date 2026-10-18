import P from 'pino'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import makeWASocket from '../../Socket'
import { type BinaryNode } from '../../WABinary'
import { makeSession, mockWebSocket } from '../TestUtils/session'

mockWebSocket()

describe('<status> stanza', () => {
	it('is acked with class "status", or the server ends the stream later', async () => {
		const { state, clear } = await makeSession()
		state.creds.me = { id: '1234567890:1@s.whatsapp.net', name: 'Test User' }

		const lines: string[] = []
		const logger = P({ level: 'debug' }, { write: (line: string) => lines.push(line) })
		const sock = makeWASocket({ ...DEFAULT_CONNECTION_CONFIG, auth: state, logger })

		const node: BinaryNode = {
			tag: 'status',
			attrs: { id: '3A2069ED', from: '5511999999999@s.whatsapp.net', type: 'media', offline: '0' }
		}
		// The ack is logged before it is written, so no open connection is needed.
		sock.ws.emit('CB:status', node)
		await new Promise(resolve => setTimeout(resolve, 50))

		const acks = lines.map(line => JSON.parse(line)).filter(entry => entry.msg === 'sent ack')
		expect(acks.map(entry => entry.sent)).toEqual([
			{ id: '3A2069ED', to: '5511999999999@s.whatsapp.net', class: 'status', type: 'media' }
		])

		await sock.end(new Error('Test completed'))
		await clear()
	})
})
