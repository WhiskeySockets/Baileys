import { jest } from '@jest/globals'
import P from 'pino'
import { proto } from '../../../WAProto/index.js'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import {
	type MessageRelayOptions,
	type SignalDataSet,
	type SignalRepository,
	WAMessageAddressingMode
} from '../../Types'
import { unpadRandomMax16 } from '../../Utils/generics'
import { type BinaryNode, type FullJid, getBinaryNodeChild, getBinaryNodeChildren, jidEncode } from '../../WABinary'

const makeNewsletterSocket = jest.fn()
jest.unstable_mockModule('../../Socket/newsletter', () => ({ makeNewsletterSocket }))

const { makeMessagesSocket } = await import('../../Socket/messages-send')

const GROUP_JID = '120363000000000000@g.us'
const ALICE = '2000@s.whatsapp.net'
const BOB = '3000@s.whatsapp.net'
const CAROL = '4000@s.whatsapp.net'
const devices: FullJid[] = [
	{ user: '2000', server: 's.whatsapp.net', device: 0 },
	{ user: '3000', server: 's.whatsapp.net', device: 0 },
	{ user: '4000', server: 's.whatsapp.net', device: 0 }
]

const makeHarness = (recipientDevices: FullJid[] = devices, initialMemory: Record<string, boolean> = {}) => {
	let memory = { ...initialMemory }
	const failedRecipients = new Set<string>()
	const deviceCache = new Map<string, FullJid[]>()
	const members = new Set<string>()
	for (const device of recipientDevices) {
		const cached = deviceCache.get(device.user) || []
		cached.push(device)
		deviceCache.set(device.user, cached)
		members.add(jidEncode(device.user, device.server))
	}

	// Return the stored map by reference, as a key-store cache may do, to expose mutations before set().
	const get = jest.fn(async () => ({ [GROUP_JID]: memory }))
	const set = jest.fn(async (data: SignalDataSet) => {
		const updated = data['sender-key-memory']?.[GROUP_JID]
		if (updated) {
			memory = { ...updated }
		}
	})
	const keys = {
		get,
		set,
		transaction: async <T>(work: () => Promise<T>) => work()
	}
	const skdm = Buffer.from('sender-key-distribution')
	const encryptMessage = jest.fn<SignalRepository['encryptMessage']>().mockImplementation(async ({ jid, data }) => {
		if (failedRecipients.has(jid)) {
			throw new Error('Missing session')
		}

		return { type: 'msg', ciphertext: data }
	})
	const encryptGroupMessage = jest.fn<SignalRepository['encryptGroupMessage']>().mockResolvedValue({
		ciphertext: Buffer.from('group-ciphertext'),
		senderKeyDistributionMessage: skdm
	})
	const sendNode = jest.fn<(node: BinaryNode) => Promise<void>>().mockResolvedValue(undefined)

	makeNewsletterSocket.mockReturnValue({
		authState: {
			creds: { me: { id: '1000:1@s.whatsapp.net', lid: '1000:1@lid' }, account: {} },
			keys
		},
		signalRepository: {
			lidMapping: { getLIDForPN: async () => null },
			validateSession: jest.fn<SignalRepository['validateSession']>().mockResolvedValue({ exists: true }),
			encryptMessage,
			encryptGroupMessage,
			hasSenderKey: async () => true,
			getSenderKeyDistributionMessage: async () => skdm
		},
		ev: {},
		sendNode,
		registerSocketEndHandler: jest.fn()
	})

	const socket = makeMessagesSocket({
		...DEFAULT_CONNECTION_CONFIG,
		logger: P({ level: 'silent' }),
		enableRecentMessageCache: false,
		cachedGroupMetadata: async () => ({
			id: GROUP_JID,
			owner: undefined,
			subject: 'Sender key test',
			addressingMode: WAMessageAddressingMode.PN,
			participants: [...members].map(id => ({ id }))
		}),
		userDevicesCache: {
			get: <T>(user: string) => deviceCache.get(user) as T | undefined,
			set: () => false,
			del: () => false,
			flushAll: () => {}
		}
	})

	const sentNode = (index = 0) => {
		const node = sendNode.mock.calls[index]?.[0]
		if (!node) {
			throw new Error('Expected a sent stanza')
		}

		return node
	}

	const sentRecipients = (index = 0) => {
		const participants = getBinaryNodeChild(sentNode(index), 'participants')
		return participants ? getBinaryNodeChildren(participants, 'to').map(node => node.attrs.jid) : []
	}

	return {
		relay: (options: MessageRelayOptions = {}) =>
			socket.relayMessage(GROUP_JID, { conversation: 'test' }, { messageId: 'test-message', ...options }),
		failedRecipients,
		encryptMessage,
		encryptGroupMessage,
		set,
		sendNode,
		sentNode,
		sentRecipients,
		senderKeyMemory: () => ({ ...memory })
	}
}

describe('sender-key-memory', () => {
	beforeEach(() => {
		makeNewsletterSocket.mockReset()
	})

	it('marks only the two devices whose SKDM encryption succeeds', async () => {
		const harness = makeHarness()
		harness.failedRecipients.add(BOB)

		await harness.relay()

		expect(harness.sentRecipients()).toEqual([ALICE, CAROL])
		expect(harness.senderKeyMemory()).toEqual({ [ALICE]: true, [CAROL]: true })
		expect(harness.set).toHaveBeenCalledWith({
			'sender-key-memory': { [GROUP_JID]: { [ALICE]: true, [CAROL]: true } }
		})
	})

	it('retries only the failed device on the next send and keeps hosted and device 99 exclusions', async () => {
		const harness = makeHarness([
			...devices,
			{ user: '5000', server: 'hosted', device: 0 },
			{ user: '6000', server: 'hosted.lid', device: 0 },
			{ user: '7000', server: 's.whatsapp.net', device: 99 }
		])
		harness.failedRecipients.add(BOB)
		await harness.relay()
		harness.failedRecipients.clear()

		await harness.relay()

		expect(harness.sentRecipients(1)).toEqual([BOB])
		expect(harness.encryptMessage.mock.calls.map(([{ jid }]) => jid)).toEqual([ALICE, BOB, CAROL, BOB])
		expect(harness.senderKeyMemory()).toEqual({ [ALICE]: true, [BOB]: true, [CAROL]: true })
	})

	it('leaves memory unchanged when all encryptions fail and marks every device when they all succeed', async () => {
		const previousMemory = { '8000:2@s.whatsapp.net': true }
		const harness = makeHarness(devices, previousMemory)
		for (const jid of [ALICE, BOB, CAROL]) {
			harness.failedRecipients.add(jid)
		}

		await expect(harness.relay()).rejects.toThrow('All encryptions failed')

		expect(harness.set).not.toHaveBeenCalled()
		expect(harness.sendNode).not.toHaveBeenCalled()
		expect(harness.senderKeyMemory()).toEqual(previousMemory)

		harness.failedRecipients.clear()
		await harness.relay()

		expect(harness.sentRecipients()).toEqual([ALICE, BOB, CAROL])
		expect(harness.senderKeyMemory()).toEqual({ ...previousMemory, [ALICE]: true, [BOB]: true, [CAROL]: true })
	})

	it.each([0, 2])('keeps failed linked device %i unmarked and honors older persisted maps', async failingDevice => {
		const primary = jidEncode('2000', 's.whatsapp.net', 0)
		const linked = jidEncode('2000', 's.whatsapp.net', 2)
		const failedJid = jidEncode('2000', 's.whatsapp.net', failingDevice)
		const successfulJid = jidEncode('2000', 's.whatsapp.net', failingDevice === 0 ? 2 : 0)
		const harness = makeHarness(
			[
				{ user: '2000', server: 's.whatsapp.net', device: 0 },
				{ user: '2000', server: 's.whatsapp.net', device: 2 },
				{ user: '3000', server: 's.whatsapp.net', device: 0 }
			],
			{ [BOB]: true }
		)
		harness.failedRecipients.add(failedJid)

		await harness.relay()

		expect(harness.encryptMessage.mock.calls.map(([{ jid }]) => jid)).toEqual([primary, linked])
		expect(harness.sentRecipients()).toEqual([successfulJid])
		expect(harness.senderKeyMemory()).toEqual({ [BOB]: true, [successfulJid]: true })

		harness.failedRecipients.clear()
		await harness.relay()

		expect(harness.sentRecipients(1)).toEqual([failedJid])
		expect(harness.encryptMessage.mock.calls[harness.encryptMessage.mock.calls.length - 1]?.[0]?.jid).toBe(failedJid)
		expect(harness.senderKeyMemory()).toEqual({ [BOB]: true, [successfulJid]: true, [failedJid]: true })

		await harness.relay({ participant: { jid: BOB, count: 1 } })

		expect(harness.set).toHaveBeenCalledTimes(2)
		expect(harness.encryptGroupMessage).toHaveBeenCalledTimes(2)
		expect(harness.sentNode(2).attrs.participant).toBe(BOB)
		const retry = harness.encryptMessage.mock.calls[harness.encryptMessage.mock.calls.length - 1]?.[0]
		if (!retry) {
			throw new Error('Expected retry encryption')
		}

		expect(proto.Message.decode(unpadRandomMax16(retry.data)).senderKeyDistributionMessage?.groupId).toBe(GROUP_JID)
		expect(harness.senderKeyMemory()).toEqual({ [BOB]: true, [successfulJid]: true, [failedJid]: true })
	})
})
