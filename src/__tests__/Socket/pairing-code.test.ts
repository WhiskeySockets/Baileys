import { jest } from '@jest/globals'
import { EventEmitter } from 'events'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import type { AuthenticationState, SignalDataTypeMap, SocketConfig } from '../../Types'
import { initAuthCreds } from '../../Utils/auth-utils'
import type { ILogger } from '../../Utils/logger'
import type { BinaryNode } from '../../WABinary'

class MockWebSocketClient extends EventEmitter {
	public sent: Array<string | Uint8Array> = []
	private closed = false
	private closing = false

	constructor(
		public url: URL,
		public config: SocketConfig
	) {
		super()
	}

	get isOpen() {
		return !this.closed && !this.closing
	}

	get isClosed() {
		return this.closed
	}

	get isClosing() {
		return this.closing
	}

	get isConnecting() {
		return false
	}

	connect() {}

	async close() {
		if (this.closed) {
			return
		}

		this.closing = true
		this.closed = true
		this.closing = false
		this.emit('close')
	}

	send(data: string | Uint8Array, cb?: (err?: Error) => void) {
		this.sent.push(data)
		cb?.()
		return true
	}
}

const mockSockets: MockWebSocketClient[] = []
const createWebSocketClient = (url: URL, config: SocketConfig) => {
	const socket = new MockWebSocketClient(url, config)
	mockSockets.push(socket)
	return socket
}

jest.unstable_mockModule('../../Socket/Client/websocket', () => ({
	WebSocketClient: jest.fn<typeof createWebSocketClient>(createWebSocketClient)
}))

const { default: makeWASocket } = await import('../../Socket')

const makeAuthState = (): AuthenticationState => ({
	creds: initAuthCreds(),
	keys: {
		get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => {
			void type
			void ids
			return {} as { [id: string]: SignalDataTypeMap[T] }
		},
		set: async data => {
			void data
		}
	}
})

type TestLogger = ILogger & {
	child: jest.MockedFunction<ILogger['child']>
	trace: jest.MockedFunction<ILogger['trace']>
	debug: jest.MockedFunction<ILogger['debug']>
	info: jest.MockedFunction<ILogger['info']>
	warn: jest.MockedFunction<ILogger['warn']>
	error: jest.MockedFunction<ILogger['error']>
}

const makeLogger = (): TestLogger => {
	const logger: TestLogger = {
		level: 'trace',
		child: jest.fn<ILogger['child']>(),
		trace: jest.fn<ILogger['trace']>(),
		debug: jest.fn<ILogger['debug']>(),
		info: jest.fn<ILogger['info']>(),
		warn: jest.fn<ILogger['warn']>(),
		error: jest.fn<ILogger['error']>()
	}

	logger.child.mockReturnValue(logger)

	return logger
}

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0))

const pairDeviceStanza = (): BinaryNode => ({
	tag: 'iq',
	attrs: {
		from: '@s.whatsapp.net',
		id: 'pair-device-1',
		type: 'set',
		xmlns: 'md'
	},
	content: [
		{
			tag: 'pair-device',
			attrs: {},
			content: [{ tag: 'ref', attrs: {}, content: Buffer.from('pair-ref') }]
		}
	]
})

const getPairingRequestXml = async (logger: ReturnType<typeof makeLogger>) => {
	for (let i = 0; i < 200; i++) {
		const entries = logger.trace.mock.calls.map(([entry]) => entry)
		for (let index = entries.length - 1; index >= 0; index--) {
			const entry = entries[index]
			if (
				typeof entry === 'object' &&
				entry !== null &&
				'xml' in entry &&
				typeof entry.xml === 'string' &&
				entry.xml.includes('link_code_companion_reg')
			) {
				return entry.xml
			}
		}

		await flushPromises()
	}

	throw new Error('pairing request XML was not sent')
}

const getStanzaId = (xml: string) => {
	const id = /<iq[^>]* id='([^']+)'/.exec(xml)?.[1]
	if (!id) {
		throw new Error(`could not find stanza id in XML: ${xml}`)
	}

	return id
}

const makeSocket = (auth: AuthenticationState, logger: ILogger) =>
	makeWASocket({
		...DEFAULT_CONNECTION_CONFIG,
		auth,
		logger,
		defaultQueryTimeoutMs: 1_000,
		browser: ['Aidy Staging', 'Chrome', '20.0.04']
	})

describe('requestPairingCode', () => {
	beforeEach(() => {
		mockSockets.length = 0
		jest.clearAllMocks()
	})

	it('queues requests until pair-device is received', async () => {
		const auth = makeAuthState()
		const logger = makeLogger()
		const sock = makeSocket(auth, logger)
		const ws = mockSockets[0]!

		const codePromise = sock.requestPairingCode('1234567890')
		await flushPromises()

		expect(logger.trace.mock.calls.some(([entry]) => JSON.stringify(entry).includes('link_code_companion_reg'))).toBe(
			false
		)

		ws.emit('CB:iq,type:set,pair-device', pairDeviceStanza())
		const xml = await getPairingRequestXml(logger)
		expect(xml).toContain('companion_platform_display')
		expect(xml).toContain('Chrome (Mac OS)')

		ws.emit(`TAG:${getStanzaId(xml)}`, {
			tag: 'iq',
			attrs: { from: '@s.whatsapp.net', id: getStanzaId(xml), type: 'result' }
		} satisfies BinaryNode)

		const code = await codePromise
		expect(code).toHaveLength(8)
		expect(auth.creds.me?.id).toBe('1234567890@s.whatsapp.net')

		await sock.end(new Error('test complete'))
	})

	it('rejects server companion_hello errors without persisting creds.me', async () => {
		const auth = makeAuthState()
		const logger = makeLogger()
		const sock = makeSocket(auth, logger)
		const ws = mockSockets[0]!

		ws.emit('CB:iq,type:set,pair-device', pairDeviceStanza())
		const codePromise = sock.requestPairingCode('1234567890')
		const xml = await getPairingRequestXml(logger)
		const id = getStanzaId(xml)

		ws.emit(`TAG:${id}`, {
			tag: 'iq',
			attrs: { from: '@s.whatsapp.net', id, type: 'error' },
			content: [{ tag: 'error', attrs: { code: '400', text: 'bad-request' } }]
		} satisfies BinaryNode)

		await expect(codePromise).rejects.toThrow('bad-request')
		expect(auth.creds.me).toBeUndefined()
		expect(auth.creds.pairingCode).toBeUndefined()

		await sock.end(new Error('test complete'))
	})

	it('rejects concurrent pairing requests', async () => {
		const auth = makeAuthState()
		const logger = makeLogger()
		const sock = makeSocket(auth, logger)

		const firstRequest = sock.requestPairingCode('1234567890')
		firstRequest.catch(() => undefined)

		await expect(sock.requestPairingCode('1234567890')).rejects.toMatchObject({
			output: { statusCode: 400 }
		})

		await sock.end(new Error('test complete'))
		await expect(firstRequest).rejects.toThrow('test complete')
	})
})
