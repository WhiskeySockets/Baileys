import NodeCache from '@cacheable/node-cache'
import { jest } from '@jest/globals'
import P from 'pino'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import type { SignalDataSet, SignalDataTypeMap, SignalKeyStore } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { TC_TOKEN_INDEX_KEY } from '../../Utils/tc-token-utils'
import { type BinaryNode, getBinaryNodeChild } from '../../WABinary'

const makeNewsletterSocket = jest.fn()
jest.unstable_mockModule('../../Socket/newsletter', () => ({ makeNewsletterSocket }))
const { makeMessagesSocket } = await import('../../Socket/messages-send')

const ME = 'me:1@s.whatsapp.net'
const CONTACT = 'contact@s.whatsapp.net'
const CONTACT_LID = 'contact@lid'
const NOW = 1_800_000_000
const TOKEN = Buffer.from('synthetic-tc-token')
const logger = P({ level: 'silent' })

function deferred<T>() {
	let resolve!: (value: T) => void
	let reject!: (error: Error) => void
	const promise = new Promise<T>((resolvePromise, rejectPromise) => {
		resolve = resolvePromise
		reject = rejectPromise
	})
	return { promise, resolve, reject }
}

const drainTasks = () => new Promise<void>(resolve => setImmediate(resolve))

function makeFixture() {
	const data: SignalDataSet = {}
	const store: SignalKeyStore = {
		get<T extends keyof SignalDataTypeMap>(type: T, ids: string[]) {
			const result: Record<string, SignalDataTypeMap[T]> = {}
			for (const id of ids) {
				const value = data[type]?.[id]
				if (value !== undefined && value !== null) result[id] = value
			}

			return result
		},
		set(update) {
			for (const type of Object.keys(update) as (keyof SignalDataTypeMap)[]) {
				Object.assign((data[type] ??= {}), update[type])
			}
		}
	}
	const write = jest.spyOn(store, 'set')
	const keys = addTransactionCapability(store, logger, { maxCommitRetries: 1, delayBetweenTriesMs: 0 })
	const creds = initAuthCreds()
	creds.me = { id: ME, name: 'Test' }
	const response = deferred<BinaryNode>()
	const query = jest.fn<(node: BinaryNode) => Promise<BinaryNode>>().mockImplementation(() => response.promise)
	const sendNode = jest.fn<(node: BinaryNode) => Promise<void>>().mockResolvedValue(undefined)
	const userDevicesCache = new NodeCache({ checkperiod: 0, useClones: false })
	userDevicesCache.set('me', [])
	userDevicesCache.set('contact', [{ user: 'contact', server: 's.whatsapp.net', device: 0 }])
	makeNewsletterSocket.mockReturnValue({
		authState: { creds, keys },
		signalRepository: {
			lidMapping: {
				getLIDForPN: async () => CONTACT_LID,
				getPNForLID: async () => CONTACT
			},
			validateSession: async () => ({ exists: true }),
			encryptMessage: async () => {
				await keys.set({ session: { [CONTACT]: Buffer.from('synthetic-session') } })
				return { type: 'msg', ciphertext: Buffer.from('synthetic-ciphertext') }
			}
		},
		query,
		sendNode,
		serverProps: { privacyTokenOn1to1: true, lidTrustedTokenIssueToLid: false },
		registerSocketEndHandler: jest.fn()
	})
	const socket = makeMessagesSocket({
		...DEFAULT_CONNECTION_CONFIG,
		logger,
		auth: { creds, keys },
		userDevicesCache: {
			get: <T>(key: string) => userDevicesCache.get(key) as T | undefined,
			set: (key, value) => userDevicesCache.set(key, value),
			del: key => userDevicesCache.del(key),
			flushAll: () => userDevicesCache.flushAll()
		},
		enableRecentMessageCache: false
	})
	const relay = (id = 'test-message') => socket.relayMessage(CONTACT, { conversation: 'test' }, { messageId: id })
	const complete = async () => {
		response.resolve({
			tag: 'iq',
			attrs: { type: 'result' },
			content: [
				{
					tag: 'tokens',
					attrs: {},
					content: [{ tag: 'token', attrs: { type: 'trusted_contact', t: String(NOW) }, content: TOKEN }]
				}
			]
		})
		await drainTasks()
	}

	return { data, write, keys, query, sendNode, response, relay, complete }
}

describe('relayMessage tc-token issuance', () => {
	beforeEach(() => {
		jest.useFakeTimers({ now: NOW * 1000, doNotFake: ['setImmediate', 'nextTick', 'queueMicrotask'] })
	})

	afterEach(() => {
		jest.useRealTimers()
		jest.restoreAllMocks()
		makeNewsletterSocket.mockReset()
	})

	it('persists a delayed IQ response, index and sender timestamp outside the relay transaction', async () => {
		const { relay, complete, data, keys, query, sendNode } = makeFixture()
		const transactionContexts: boolean[] = []
		const set = keys.set.bind(keys)
		jest.spyOn(keys, 'set').mockImplementation(async update => {
			if (update.tctoken) transactionContexts.push(keys.isInTransaction())
			await set(update)
		})

		await expect(relay()).resolves.toBe('test-message')
		expect(data.session?.[CONTACT]).toBeDefined()
		expect(data.tctoken?.[CONTACT_LID]).toBeUndefined()
		await complete()

		expect(data.tctoken?.[CONTACT_LID]).toEqual({ token: TOKEN, timestamp: String(NOW), senderTimestamp: NOW })
		expect(data.tctoken?.[TC_TOKEN_INDEX_KEY]?.token.toString()).toBe(JSON.stringify([CONTACT_LID]))
		expect(transactionContexts).toEqual([false, false])
		await relay('next-message')
		expect(query).toHaveBeenCalledTimes(1)
		expect(sendNode).toHaveBeenCalledTimes(2)
		const nextMessage = sendNode.mock.calls[1]?.[0]
		expect(nextMessage && getBinaryNodeChild(nextMessage, 'tctoken')?.content).toEqual(TOKEN)
	})

	it('waits for a successful commit before issuing an IQ', async () => {
		const { relay, write, query, complete } = makeFixture()
		const committing = deferred<void>()
		const committed = deferred<void>()
		write.mockImplementationOnce(async () => {
			committing.resolve()
			await committed.promise
		})
		const sending = relay()
		await committing.promise
		await drainTasks()
		const queriesBeforeCommit = query.mock.calls.length
		committed.resolve()
		await sending
		await complete()

		expect(queriesBeforeCommit).toBe(0)
		expect(query).toHaveBeenCalledTimes(1)
	})

	it('deduplicates concurrent sends while an issuance is pending', async () => {
		const { relay, query, sendNode, complete } = makeFixture()
		await Promise.all([relay('first'), relay('second')])
		await drainTasks()

		expect(query).toHaveBeenCalledTimes(1)
		expect(sendNode).toHaveBeenCalledTimes(2)
		await complete()
		await relay('third')
		expect(query).toHaveBeenCalledTimes(1)
	})

	it('clears the in-flight marker after an IQ error without resending the message', async () => {
		const { relay, query, sendNode, response, data } = makeFixture()
		await relay()
		response.reject(new Error('synthetic IQ failure'))
		await drainTasks()

		expect(data.tctoken?.[CONTACT_LID]?.senderTimestamp).toBeUndefined()
		expect(sendNode).toHaveBeenCalledTimes(1)
		query.mockResolvedValue({ tag: 'iq', attrs: { type: 'result' } })
		await relay('next-message')
		await drainTasks()
		expect(query).toHaveBeenCalledTimes(2)
		expect(sendNode).toHaveBeenCalledTimes(2)
		expect(data.tctoken?.[CONTACT_LID]?.senderTimestamp).toBe(NOW)
	})

	it('clears the in-flight marker after a persistence error without resending the message', async () => {
		const { relay, query, sendNode, write, complete, data } = makeFixture()
		await relay()
		write.mockImplementationOnce(() => {
			throw new Error('synthetic token write failure')
		})
		await complete()

		expect(data.tctoken?.[CONTACT_LID]?.senderTimestamp).toBeUndefined()
		expect(sendNode).toHaveBeenCalledTimes(1)
		await relay('next-message')
		await drainTasks()
		expect(query).toHaveBeenCalledTimes(2)
		expect(data.tctoken?.[CONTACT_LID]?.senderTimestamp).toBe(NOW)
		expect(sendNode).toHaveBeenCalledTimes(2)
	})

	it('does not issue a token or retain an in-flight marker when the relay commit fails', async () => {
		const { relay, query, sendNode, write, complete } = makeFixture()
		write.mockImplementationOnce(() => {
			throw new Error('synthetic commit failure')
		})
		await expect(relay()).rejects.toThrow('synthetic commit failure')
		await drainTasks()
		expect(query).not.toHaveBeenCalled()
		expect(sendNode).toHaveBeenCalledTimes(1)

		await relay('next-message')
		await complete()
		expect(query).toHaveBeenCalledTimes(1)
		expect(sendNode).toHaveBeenCalledTimes(2)
	})
})
