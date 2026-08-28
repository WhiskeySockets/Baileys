import { jest } from '@jest/globals'

/**
 * A partial `creds.update` (one carrying no `me`) used to fail the push-name comparison and
 * send a `<presence>` node whose only attribute was `undefined`. Undefined attributes are
 * stripped when encoding, so the node went out bare - and a presence node with no `type` is
 * read as "available". Because `creds.update` fires on ordinary key churn, the account was
 * announced online continuously even with `markOnlineOnConnect: false`, which makes WhatsApp
 * stop delivering push notifications to the user's phone.
 */

const send = jest.fn((_data: unknown, cb?: (err?: Error) => void) => cb?.())

jest.unstable_mockModule('../../Socket/Client/websocket', () => ({
	WebSocketClient: jest.fn().mockImplementation(() => ({
		connect: jest.fn(),
		close: jest.fn(),
		on: jest.fn(),
		off: jest.fn(),
		removeAllListeners: jest.fn(),
		emit: jest.fn(),
		send,
		isOpen: true
	}))
}))

const { DEFAULT_CONNECTION_CONFIG, NOISE_WA_HEADER } = await import('../../Defaults')
const makeWASocket = (await import('../../Socket')).default
const { decodeBinaryNode } = await import('../../WABinary/decode')
const { makeSession } = await import('../TestUtils/session')

describe('presence announcement on creds.update', () => {
	const ME = '1234567890:1@s.whatsapp.net'

	const makeSocket = async (name: string | undefined) => {
		const { state, clear } = await makeSession()
		state.creds.me = { id: ME, name }
		const sock = makeWASocket({
			...DEFAULT_CONNECTION_CONFIG,
			auth: state,
			markOnlineOnConnect: false,
			connectTimeoutMs: 200
		})
		send.mockClear()
		return { sock, clear }
	}

	const settle = () => new Promise(resolve => setTimeout(resolve, 50))

	/**
	 * A frame is `[intro header?][3-byte big-endian length][node]`. No transport is negotiated
	 * in these tests, so the payload is not encrypted and decodes directly.
	 */
	const decodeFrame = (frame: Buffer) => {
		const intro = Buffer.from(NOISE_WA_HEADER)
		const body = frame.subarray(0, intro.length).equals(intro) ? frame.subarray(intro.length) : frame
		return decodeBinaryNode(body.subarray(3))
	}

	it('does not send presence for a partial update that carries no `me`', async () => {
		const { sock, clear } = await makeSocket('Test User')

		// the shape emitted by ordinary key churn, e.g. from messages-recv
		sock.ev.emit('creds.update', { lastAccountSyncTimestamp: Date.now() })
		await settle()

		expect(send).not.toHaveBeenCalled()

		await sock.end(new Error('Test completed'))
		await clear()
	})

	it('does not send presence when the push name is unchanged', async () => {
		const { sock, clear } = await makeSocket('Test User')

		sock.ev.emit('creds.update', { me: { id: ME, name: 'Test User' } })
		await settle()

		expect(send).not.toHaveBeenCalled()

		await sock.end(new Error('Test completed'))
		await clear()
	})

	it('still announces a genuinely new push name', async () => {
		const { sock, clear } = await makeSocket('Old Name')

		sock.ev.emit('creds.update', { me: { id: ME, name: 'New Name' } })
		await settle()

		expect(send).toHaveBeenCalledTimes(1)
		// assert on the node itself: a nameless or mistagged frame is the exact regression
		// this PR guards against, and it would satisfy a bare "was called" check
		const node = await decodeFrame(send.mock.calls[0]![0] as Buffer)
		expect(node.tag).toBe('presence')
		expect(node.attrs.name).toBe('New Name')

		await sock.end(new Error('Test completed'))
		await clear()
	})
})
