import { jest } from '@jest/globals'
import type { proto } from '../../../WAProto/index.js'
import type { SocketConfig } from '../../Types'
import type { ILogger } from '../../Utils/logger'
import { MessageRetryCoordinator, MessageRetryManager } from '../../Utils/message-retry-manager'
import type { BinaryNode } from '../../WABinary'

const makeMessagesSocket = jest.fn()
jest.unstable_mockModule('../../Socket/messages-send', () => ({ makeMessagesSocket }))

const { makeMessagesRecvSocket } = await import('../../Socket/messages-recv')

const noopLogger: ILogger = {
	level: 'silent',
	child: () => noopLogger,
	trace: () => {},
	debug: () => {},
	info: () => {},
	warn: () => {},
	error: () => {}
}

const immediateMutex = {
	mutex: async <T>(task: () => Promise<T> | T) => task()
}

const remoteJid = '120363000000000000@g.us'
const participant = 'peer@s.whatsapp.net'
const messageId = 'MESSAGE-ID'

const keyBundle: BinaryNode = {
	tag: 'keys',
	attrs: {},
	content: [
		{ tag: 'type', attrs: {}, content: Buffer.from([5]) },
		{ tag: 'identity', attrs: {}, content: Buffer.alloc(32, 1) },
		{
			tag: 'skey',
			attrs: {},
			content: [
				{ tag: 'id', attrs: {}, content: Buffer.from([0, 0, 1]) },
				{ tag: 'value', attrs: {}, content: Buffer.alloc(32, 2) },
				{ tag: 'signature', attrs: {}, content: Buffer.alloc(64, 3) }
			]
		}
	]
}

const makeRetryReceipt = (includeBundle: boolean): BinaryNode => ({
	tag: 'receipt',
	attrs: {
		from: remoteJid,
		participant,
		id: messageId,
		t: '1',
		type: 'retry'
	},
	content: [
		{ tag: 'retry', attrs: { count: '2', id: messageId, t: '1', v: '1' } },
		{ tag: 'registration', attrs: {}, content: Buffer.from([0, 0, 0, 2]) },
		...(includeBundle ? [keyBundle] : [])
	]
})

describe('retry receipt handling', () => {
	it.each([
		{ name: 'bundled-session retry', includeBundle: true, enableRetryManager: false },
		{ name: 'no-bundle registration-mismatch retry', includeBundle: false, enableRetryManager: true }
	])('cancels during message lookup before $name mutations or relay', async ({ includeBundle, enableRetryManager }) => {
		const handlers = new Map<string, (node: BinaryNode) => Promise<void> | void>()
		const messageRetryCoordinator = new MessageRetryCoordinator()
		const messageRetryManager = enableRetryManager
			? new MessageRetryManager(noopLogger, 5, messageRetryCoordinator)
			: null
		const injectE2ESession = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
		const getSessionInfo = jest
			.fn<() => Promise<{ registrationId: number; baseKey: Uint8Array }>>()
			.mockResolvedValue({ registrationId: 1, baseKey: new Uint8Array([1]) })
		const validateSession = jest.fn<() => Promise<{ exists: boolean }>>().mockResolvedValue({ exists: false })
		const setKeys = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
		const assertSessions = jest.fn<() => Promise<boolean>>().mockResolvedValue(true)
		const relayMessage = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
		const onUnexpectedError = jest.fn()
		const sendNode = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
		let socketEndHandler: ((error: Error | undefined) => void | Promise<void>) | undefined
		let markGetMessageStarted!: () => void
		const getMessageStarted = new Promise<void>(resolve => {
			markGetMessageStarted = resolve
		})
		let returnMessage!: (message: proto.IMessage) => void
		const getMessageResult = new Promise<proto.IMessage>(resolve => {
			returnMessage = resolve
		})
		const getMessage = jest.fn(async () => {
			markGetMessageStarted()
			return getMessageResult
		})

		makeMessagesSocket.mockReturnValue({
			userDevicesCache: {},
			devicesMutex: immediateMutex,
			ev: {
				buffer: jest.fn(),
				flush: jest.fn(),
				on: jest.fn(),
				emit: jest.fn()
			},
			authState: {
				creds: { me: { id: 'me@s.whatsapp.net' } },
				keys: {
					get: jest.fn(async () => ({})),
					set: setKeys,
					transaction: async <T>(task: () => Promise<T>) => task()
				}
			},
			ws: {
				isOpen: true,
				on: jest.fn((event: string, handler: (node: BinaryNode) => Promise<void> | void) => {
					handlers.set(event, handler)
				})
			},
			messageMutex: immediateMutex,
			notificationMutex: immediateMutex,
			receiptMutex: immediateMutex,
			signalRepository: {
				lidMapping: { getLIDForPN: jest.fn(async () => undefined) },
				jidToSignalProtocolAddress: jest.fn(() => 'signal-address'),
				injectE2ESession,
				getSessionInfo,
				validateSession
			},
			query: jest.fn(),
			upsertMessage: jest.fn(),
			resyncAppState: jest.fn(),
			onUnexpectedError,
			assertSessions,
			sendNode,
			relayMessage,
			sendReceipt: jest.fn(),
			uploadPreKeys: jest.fn(),
			sendPeerDataOperationMessage: jest.fn(),
			messageRetryManager,
			messageRetryCoordinator,
			registerSocketEndHandler: jest.fn((handler: (error: Error | undefined) => void | Promise<void>) => {
				socketEndHandler = handler
			}),
			issuePrivacyTokens: jest.fn(),
			fetchAccountReachoutTimelock: jest.fn(),
			placeholderResendCache: {
				get: jest.fn(async () => undefined),
				set: jest.fn(async () => undefined),
				del: jest.fn(async () => undefined)
			}
		})

		try {
			makeMessagesRecvSocket({
				logger: noopLogger,
				retryRequestDelayMs: 0,
				maxMsgRetryCount: 5,
				getMessage,
				shouldIgnoreJid: () => false,
				enableAutoSessionRecreation: true
			} as unknown as SocketConfig)

			const handleReceipt = handlers.get('CB:receipt')
			expect(handleReceipt).toBeDefined()

			const handling = Promise.resolve(handleReceipt!(makeRetryReceipt(includeBundle)))
			await getMessageStarted
			messageRetryCoordinator.invalidateMessage(remoteJid, messageId)
			returnMessage({ conversation: 'stale' })
			await handling

			expect(getMessage).toHaveBeenCalledWith(
				expect.objectContaining({
					remoteJid,
					participant,
					id: messageId,
					fromMe: true
				})
			)
			expect(onUnexpectedError).not.toHaveBeenCalled()
			expect(injectE2ESession).not.toHaveBeenCalled()
			expect(getSessionInfo).not.toHaveBeenCalled()
			expect(validateSession).not.toHaveBeenCalled()
			expect(setKeys).not.toHaveBeenCalled()
			expect(assertSessions).not.toHaveBeenCalled()
			expect(relayMessage).not.toHaveBeenCalled()
			expect(sendNode).toHaveBeenCalledTimes(1)
		} finally {
			await socketEndHandler?.(undefined)
			messageRetryManager?.clear()
		}
	})
})
