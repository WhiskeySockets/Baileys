import NodeCache from '@cacheable/node-cache'
import { jest } from '@jest/globals'
import type { SocketConfig } from '../../Types'
import { makeMutex } from '../../Utils/make-mutex'
import type { BinaryNode } from '../../WABinary'

const ME_ID = '1234567890:1@s.whatsapp.net'
const ME_LID = '9876543210@lid'
const USER = '5511999999999@s.whatsapp.net'
const DEVICE = '5511999999999:3@s.whatsapp.net'
const SENT_AT = '1700000000'
const MESSAGE = { conversation: 'hello' }
const REFUSAL_LOG = 'will not send message again, as sent too many times'

type RelayMessage = (jid: string, message: unknown, opts: unknown) => Promise<string>
type RelayOpts = { messageId: string }
type NodeHandler = (node: BinaryNode) => unknown
type MakeMessagesRecvSocket = (config: SocketConfig) => unknown

const counterKey = (id: string, jid: string) => `${id}:${jid}`

const retryReceipt = (from: string, id: string, count: number): BinaryNode => ({
	tag: 'receipt',
	attrs: { from, id, type: 'retry', t: SENT_AT },
	content: [{ tag: 'retry', attrs: { count: String(count), id, t: SENT_AT, v: '1' } }]
})

// ids after the first one travel as <item> children of the node's first child
const batchedRetryReceipt = (from: string, id: string, itemIds: string[], count: number): BinaryNode => ({
	tag: 'receipt',
	attrs: { from, id, type: 'retry', t: SENT_AT },
	content: [
		{ tag: 'list', attrs: {}, content: itemIds.map(itemId => ({ tag: 'item', attrs: { id: itemId } })) },
		{ tag: 'retry', attrs: { count: String(count), id, t: SENT_AT, v: '1' } }
	]
})

const makeLogger = () => ({
	level: 'silent',
	trace: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn()
})

// stands in for makeMessagesSocket: only what makeMessagesRecvSocket touches on the retry receipt path
const makeFakeSock = () => {
	const handlers = new Map<string, NodeHandler>()
	const endHandlers: (() => void)[] = []
	const relayMessage = jest.fn<RelayMessage>().mockResolvedValue('relayed')
	const sendNode = jest.fn<(node: BinaryNode) => Promise<void>>().mockResolvedValue(undefined)
	const assertSessions = jest.fn<(jids: string[], force?: boolean) => Promise<boolean>>().mockResolvedValue(true)

	const sock = {
		ev: { buffer: jest.fn(), flush: jest.fn(), emit: jest.fn(), on: jest.fn() },
		authState: {
			creds: { me: { id: ME_ID, lid: ME_LID } },
			keys: {
				get: jest.fn(async () => ({})),
				set: jest.fn(async () => undefined)
			}
		},
		ws: {
			isOpen: true,
			on: (event: string, handler: NodeHandler) => {
				handlers.set(event, handler)
			}
		},
		receiptMutex: makeMutex(),
		messageMutex: makeMutex(),
		notificationMutex: makeMutex(),
		signalRepository: {
			jidToSignalProtocolAddress: (jid: string) => `${jid}.0`,
			lidMapping: { getLIDForPN: jest.fn(async () => null) }
		},
		assertSessions,
		sendNode,
		relayMessage,
		onUnexpectedError: jest.fn((error: unknown) => {
			throw error
		}),
		registerSocketEndHandler: (handler: () => void) => {
			endHandlers.push(handler)
		},
		messageRetryManager: null
	}

	return { sock, handlers, endHandlers, relayMessage, sendNode, assertSessions }
}

type FakeSock = ReturnType<typeof makeFakeSock>

describe('Retry receipt resend counter', () => {
	const harness: { current?: FakeSock['sock'] } = {}
	const cleanups: (() => void)[] = []
	let makeMessagesRecvSocket: MakeMessagesRecvSocket

	beforeAll(async () => {
		jest.unstable_mockModule('../../Socket/messages-send', () => ({
			makeMessagesSocket: () => harness.current
		}))
		const recv = await import('../../Socket/messages-recv')
		makeMessagesRecvSocket = recv.makeMessagesRecvSocket
	}, 60_000)

	afterEach(() => {
		for (const cleanup of cleanups.splice(0)) {
			cleanup()
		}
	})

	const setup = (maxMsgRetryCount: number, available: string[]) => {
		const fake = makeFakeSock()
		const logger = makeLogger()
		const cache = new NodeCache<number>({ stdTTL: 3600, useClones: false })
		const stored = new Set(available)

		const getMessage = jest.fn(async (key: { id?: string | null }) => {
			if (key.id && stored.has(key.id)) {
				return MESSAGE
			}

			return undefined
		})

		harness.current = fake.sock
		cleanups.push(() => {
			for (const endHandler of fake.endHandlers) {
				endHandler()
			}

			cache.close()
		})

		const config = {
			logger,
			retryRequestDelayMs: 0,
			maxMsgRetryCount,
			getMessage,
			shouldIgnoreJid: () => false,
			enableAutoSessionRecreation: false,
			msgRetryCounterCache: cache
		}
		makeMessagesRecvSocket(config as unknown as SocketConfig)

		const receive = async (node: BinaryNode, expectError = false) => {
			const handler = fake.handlers.get('CB:receipt')
			if (!handler) {
				throw new Error('CB:receipt handler was not registered')
			}

			await handler(node)
			if (!expectError) {
				expect(logger.error).not.toHaveBeenCalled()
			}
		}

		const relayedIds = () => fake.relayMessage.mock.calls.map(([, , opts]) => (opts as RelayOpts).messageId)
		const counter = (id: string, jid: string) => cache.get(counterKey(id, jid))

		return { ...fake, logger, stored, receive, relayedIds, counter, getMessage }
	}

	it('charges one count for one resend', async () => {
		const h = setup(5, ['MSG1'])

		await h.receive(retryReceipt(USER, 'MSG1', 1))

		expect(h.relayMessage).toHaveBeenCalledTimes(1)
		expect(h.relayMessage).toHaveBeenCalledWith(USER, MESSAGE, { messageId: 'MSG1', useUserDevicesCache: false })
		expect(h.counter('MSG1', USER)).toBe(1)
		expect(h.sendNode).toHaveBeenCalledTimes(1)
	})

	it.each([1, 2, 5, 8])('resends exactly maxMsgRetryCount (%i) times and then stops', async limit => {
		const h = setup(limit, ['MSG1'])

		for (let count = 1; count <= limit; count++) {
			await h.receive(retryReceipt(USER, 'MSG1', count))
			expect(h.relayMessage).toHaveBeenCalledTimes(count)
		}

		await h.receive(retryReceipt(USER, 'MSG1', limit + 1))

		expect(h.relayMessage).toHaveBeenCalledTimes(limit)
		expect(h.counter('MSG1', USER)).toBe(limit)
	})

	it('refuses the receipt after the limit with the existing log and keeps a budget per device', async () => {
		const h = setup(5, ['MSG1'])

		for (let count = 1; count <= 5; count++) {
			await h.receive(retryReceipt(USER, 'MSG1', count))
		}

		expect(h.relayMessage).toHaveBeenCalledTimes(5)
		expect(h.logger.info).not.toHaveBeenCalledWith(expect.anything(), REFUSAL_LOG)

		await h.receive(retryReceipt(USER, 'MSG1', 6))

		expect(h.relayMessage).toHaveBeenCalledTimes(5)
		expect(h.logger.info).toHaveBeenCalledWith(expect.anything(), REFUSAL_LOG)

		await h.receive(retryReceipt(DEVICE, 'MSG1', 1))

		const deviceOpts = { messageId: 'MSG1', participant: { jid: DEVICE, count: 1 } }
		expect(h.relayMessage).toHaveBeenCalledTimes(6)
		expect(h.relayMessage).toHaveBeenLastCalledWith(DEVICE, MESSAGE, deviceOpts)
		expect(h.counter('MSG1', DEVICE)).toBe(1)
		expect(h.counter('MSG1', USER)).toBe(5)
	})

	it('counts each id of a batched receipt once', async () => {
		const h = setup(5, ['A', 'B', 'C'])

		await h.receive(batchedRetryReceipt(USER, 'A', ['B', 'C'], 1))

		expect(h.relayedIds()).toEqual(['A', 'B', 'C'])
		expect(h.counter('A', USER)).toBe(1)
		expect(h.counter('B', USER)).toBe(1)
		expect(h.counter('C', USER)).toBe(1)
	})

	it('charges one count to a missing id of a batched receipt and resends the others', async () => {
		const h = setup(5, ['A', 'C'])

		await h.receive(batchedRetryReceipt(USER, 'A', ['B', 'C'], 1))

		expect(h.relayedIds()).toEqual(['A', 'C'])
		expect(h.counter('A', USER)).toBe(1)
		expect(h.counter('B', USER)).toBe(1)
		expect(h.counter('C', USER)).toBe(1)
	})

	it('charges one count per receipt for a message the store cannot return and stops at the limit', async () => {
		const h = setup(5, [])

		for (let count = 1; count <= 5; count++) {
			await h.receive(retryReceipt(USER, 'MSG1', count))
			expect(h.counter('MSG1', USER)).toBe(count)
			expect(h.assertSessions).toHaveBeenCalledTimes(count)
		}

		await h.receive(retryReceipt(USER, 'MSG1', 6))

		expect(h.relayMessage).not.toHaveBeenCalled()
		expect(h.assertSessions).toHaveBeenCalledTimes(5)
		expect(h.counter('MSG1', USER)).toBe(5)
		expect(h.logger.info).toHaveBeenCalledWith(expect.anything(), REFUSAL_LOG)

		h.stored.add('MSG1')
		await h.receive(retryReceipt(USER, 'MSG1', 7))

		expect(h.relayMessage).not.toHaveBeenCalled()
		expect(h.assertSessions).toHaveBeenCalledTimes(5)
	})

	// no de-duplication: a peer that lost its retry counter legitimately repeats count 1,
	// and dropping that receipt would leave the message undecryptable
	it('treats a repeated receipt with the same id, device and retry count as a new attempt', async () => {
		const h = setup(5, ['MSG1'])

		await h.receive(retryReceipt(USER, 'MSG1', 1))
		await h.receive(retryReceipt(USER, 'MSG1', 1))

		expect(h.relayedIds()).toEqual(['MSG1', 'MSG1'])
		expect(h.counter('MSG1', USER)).toBe(2)
	})

	it('advances retry count and stops at limit when getMessage throws', async () => {
		const h = setup(5, ['MSG1'])
		h.getMessage.mockRejectedValue(new Error('store read error'))

		for (let count = 1; count <= 5; count++) {
			h.logger.error.mockClear()
			await h.receive(retryReceipt(USER, 'MSG1', count), true)
			expect(h.counter('MSG1', USER)).toBe(count)
			expect(h.logger.error).toHaveBeenCalledWith(expect.anything(), 'error in sending message again')
		}

		expect(h.getMessage).toHaveBeenCalledTimes(5)

		// 6th receipt: gate stops before getMessage
		h.logger.error.mockClear()
		await h.receive(retryReceipt(USER, 'MSG1', 6))

		expect(h.counter('MSG1', USER)).toBe(5)
		expect(h.getMessage).toHaveBeenCalledTimes(5)
		expect(h.logger.info).toHaveBeenCalledWith(expect.anything(), REFUSAL_LOG)
		expect(h.relayMessage).not.toHaveBeenCalled()
	})

	it('advances retry count and stops at limit when assertSessions rejects', async () => {
		const h = setup(5, ['MSG1'])
		h.assertSessions.mockRejectedValue(new Error('prekey IQ failed'))

		for (let count = 1; count <= 5; count++) {
			h.logger.error.mockClear()
			await h.receive(retryReceipt(USER, 'MSG1', count), true)
			expect(h.counter('MSG1', USER)).toBe(count)
			expect(h.logger.error).toHaveBeenCalledWith(expect.anything(), 'error in sending message again')
		}

		expect(h.assertSessions).toHaveBeenCalledTimes(5)

		// 6th receipt: gate stops before assertSessions
		h.logger.error.mockClear()
		await h.receive(retryReceipt(USER, 'MSG1', 6))

		expect(h.counter('MSG1', USER)).toBe(5)
		expect(h.assertSessions).toHaveBeenCalledTimes(5)
		expect(h.logger.info).toHaveBeenCalledWith(expect.anything(), REFUSAL_LOG)
		expect(h.relayMessage).not.toHaveBeenCalled()
	})

	it('charges all ids in a batched receipt before setup even if getMessage throws', async () => {
		const h = setup(5, ['A', 'B', 'C'])
		h.getMessage.mockRejectedValue(new Error('store lookup failed'))

		await h.receive(batchedRetryReceipt(USER, 'A', ['B', 'C'], 1), true)

		expect(h.counter('A', USER)).toBe(1)
		expect(h.counter('B', USER)).toBe(1)
		expect(h.counter('C', USER)).toBe(1)
		expect(h.logger.error).toHaveBeenCalledWith(expect.anything(), 'error in sending message again')
		expect(h.relayMessage).not.toHaveBeenCalled()
	})

	it('filters out ids over budget in a batched receipt without charging or resending them', async () => {
		const h = setup(5, ['A', 'B', 'C'])

		for (let count = 1; count <= 5; count++) {
			await h.receive(retryReceipt(USER, 'B', count))
		}

		expect(h.counter('B', USER)).toBe(5)
		h.relayMessage.mockClear()

		await h.receive(batchedRetryReceipt(USER, 'A', ['B', 'C'], 1))

		expect(h.relayedIds()).toEqual(['A', 'C'])
		expect(h.counter('A', USER)).toBe(1)
		expect(h.counter('B', USER)).toBe(5)
		expect(h.counter('C', USER)).toBe(1)
	})

	it('resends subsequent ids in a batched receipt when the first id is exhausted', async () => {
		const h = setup(5, ['A', 'B'])

		for (let count = 1; count <= 5; count++) {
			await h.receive(retryReceipt(USER, 'A', count))
		}

		expect(h.counter('A', USER)).toBe(5)
		h.relayMessage.mockClear()

		await h.receive(batchedRetryReceipt(USER, 'A', ['B'], 1))

		expect(h.relayedIds()).toEqual(['B'])
		expect(h.counter('A', USER)).toBe(5)
		expect(h.counter('B', USER)).toBe(1)
	})
})
