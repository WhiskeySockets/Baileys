import { jest } from '@jest/globals'
import { EventEmitter } from 'events'
import P from 'pino'
import type { AuthenticationCreds } from '../../Types'
import type { BinaryNode } from '../../WABinary'

/**
 * The socket only reaches the network through the `ws` package, so faking that
 * one module is enough to hold a connection open. Everything the stanza is
 * routed through - the real WebSocketClient and the `CB:*` fan-out its
 * listeners are keyed on - stays in play.
 */
class FakeWebSocket extends EventEmitter {
	static readonly CONNECTING = 0
	static readonly OPEN = 1
	static readonly CLOSING = 2
	static readonly CLOSED = 3

	readyState: number = FakeWebSocket.OPEN

	send(data: Uint8Array | string, cb?: (err?: Error) => void) {
		cb?.()
	}

	close() {
		this.readyState = FakeWebSocket.CLOSED
		this.emit('close')
	}
}

jest.unstable_mockModule('ws', () => ({ __esModule: true, default: FakeWebSocket }))

// Imported after the mock is registered: mock factories are not hoisted in ESM.
const { DEF_CALLBACK_PREFIX, DEFAULT_CONNECTION_CONFIG } = await import('../../Defaults')
const { default: makeWASocket } = await import('../../Socket')
const { makeSession } = await import('../TestUtils/session')

const logger = P({ level: 'silent' })

const REFS = ['ref-1', 'ref-2']

const pairDeviceIq = (): BinaryNode => ({
	tag: 'iq',
	attrs: { from: 's.whatsapp.net', type: 'set', id: 'pair-device-1' },
	content: [
		{
			tag: 'pair-device',
			attrs: {},
			content: REFS.map(ref => ({ tag: 'ref', attrs: {}, content: Buffer.from(ref, 'utf-8') }))
		}
	]
})

const refreshNotification = (childTag?: string): BinaryNode => ({
	tag: 'notification',
	attrs: { from: 's.whatsapp.net', id: 'notification-1', type: 'companion_reg_refresh' },
	content: childTag ? [{ tag: childTag, attrs: {} }] : []
})

/**
 * Mirrors the `CB:*` fan-out `onMessageReceived` performs, so a stanza reaches
 * the handlers it would reach on a live connection - including the generic
 * `CB:notification` one that acks it. Raw frames cannot be fed in instead: the
 * noise transport only decodes them into binary nodes once a handshake has run.
 */
const deliver = (ws: EventEmitter, node: BinaryNode) => {
	const childTag = Array.isArray(node.content) ? node.content[0]?.tag : ''

	for (const [attr, value] of Object.entries(node.attrs)) {
		ws.emit(`${DEF_CALLBACK_PREFIX}${node.tag},${attr}:${value},${childTag}`, node)
		ws.emit(`${DEF_CALLBACK_PREFIX}${node.tag},${attr}:${value}`, node)
		ws.emit(`${DEF_CALLBACK_PREFIX}${node.tag},${attr}`, node)
	}

	ws.emit(`${DEF_CALLBACK_PREFIX}${node.tag},,${childTag}`, node)
	ws.emit(`${DEF_CALLBACK_PREFIX}${node.tag}`, node)
}

/** ref, noise key, identity key, adv secret, platform id - what the QR advertises */
const qrFields = (qr: string) => qr.split('#')[1]!.split(',')

const cleanups: Array<() => Promise<void>> = []

const bootUnpairedSocket = async () => {
	const { state, clear } = await makeSession()
	// no creds.me: an unpaired companion, the only state the server sends this
	// notification in
	const sock = makeWASocket({ ...DEFAULT_CONNECTION_CONFIG, auth: state, logger })

	// registered up front so a failing expectation still shuts the socket down:
	// its QR timer would otherwise outlive the test
	cleanups.push(async () => {
		try {
			await sock.end(new Error('test finished'))
		} finally {
			await clear()
		}
	})

	const qrs: string[] = []
	const credsUpdates: Partial<AuthenticationCreds>[] = []
	sock.ev.on('connection.update', ({ qr }) => {
		if (qr) {
			qrs.push(qr)
		}
	})
	sock.ev.on('creds.update', update => {
		credsUpdates.push(update)
	})

	const waitForQR = () =>
		new Promise<string>(resolve => {
			const listener = ({ qr }: { qr?: string }) => {
				if (qr) {
					sock.ev.off('connection.update', listener)
					resolve(qr)
				}
			}

			sock.ev.on('connection.update', listener)
		})
	const waitForCredsUpdate = () =>
		new Promise<Partial<AuthenticationCreds>>(resolve => {
			const listener = (update: Partial<AuthenticationCreds>) => {
				sock.ev.off('creds.update', listener)
				resolve(update)
			}

			sock.ev.on('creds.update', listener)
		})

	return { sock, creds: state.creds, qrs, credsUpdates, waitForQR, waitForCredsUpdate }
}

describe('CB:notification,type:companion_reg_refresh', () => {
	afterEach(async () => {
		for (const cleanup of cleanups.splice(0)) {
			await cleanup()
		}
	})

	it.each(['companion_reg_refresh', 'pair-device-rotate-qr'])(
		'rotates the adv secret and re-renders the QR on screen for a <%s> child',
		async childTag => {
			const { sock, creds, qrs, credsUpdates, waitForQR, waitForCredsUpdate } = await bootUnpairedSocket()

			const firstQR = waitForQR()
			deliver(sock.ws, pairDeviceIq())
			await firstQR
			expect(qrs).toHaveLength(1)

			const retiredSecret = creds.advSecretKey
			const refreshedQR = waitForQR()
			const credsUpdate = waitForCredsUpdate()
			deliver(sock.ws, refreshNotification(childTag))
			await Promise.all([refreshedQR, credsUpdate])

			// rotated, and handed to the auth store
			expect(creds.advSecretKey).not.toBe(retiredSecret)
			expect(Buffer.from(creds.advSecretKey, 'base64')).toHaveLength(32)
			expect(credsUpdates).toContainEqual({ advSecretKey: creds.advSecretKey })

			// re-rendered: same ref, new secret. A fresh ref would spend one of the
			// pool the server allotted, for a ref that has not expired.
			expect(qrs).toHaveLength(2)
			const [before, after] = qrs.map(qrFields)
			expect(after![0]).toBe(before![0])
			expect(after![0]).toBe(REFS[0])
			expect(after![3]).toBe(creds.advSecretKey)
			expect(after![3]).not.toBe(before![3])
		}
	)

	it('ignores a notification carrying neither expected child', async () => {
		const { sock, creds, qrs, credsUpdates, waitForQR } = await bootUnpairedSocket()

		const firstQR = waitForQR()
		deliver(sock.ws, pairDeviceIq())
		await firstQR

		const secretOnScreen = creds.advSecretKey
		deliver(sock.ws, refreshNotification())

		expect(creds.advSecretKey).toBe(secretOnScreen)
		expect(credsUpdates.some(update => 'advSecretKey' in update)).toBe(false)
		expect(qrs).toHaveLength(1)
	})
})
