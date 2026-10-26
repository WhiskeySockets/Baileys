import { jest } from '@jest/globals'
import { EventEmitter } from 'node:events'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import type { makeSocket } from '../../Socket/socket'
import type { BaileysEventMap, SocketConfig } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { makeEventBuffer } from '../../Utils/event-buffer'
import logger from '../../Utils/logger'
import type { BinaryNode } from '../../WABinary'

let transport: ReturnType<typeof makeSocket>
jest.unstable_mockModule('../../Socket/socket.js', () => ({ makeSocket: () => transport }))
const { makeMessagesRecvSocket } = await import('../../Socket/messages-recv')

export const JID = '12025550101@s.whatsapp.net'
export const ME = { id: '12025550199@s.whatsapp.net', name: 'Fictional owner' }
export const silentLogger = logger.child({ class: 'receipt-test' })
silentLogger.level = 'silent'

export function fixture() {
	const ev = makeEventBuffer(silentLogger)
	const ws = Object.assign(new EventEmitter(), { isOpen: true, isClosed: false })
	const endHandlers: (() => void)[] = []
	const batches: Partial<BaileysEventMap>[] = []
	const sent: BinaryNode[] = []
	const creds = { ...initAuthCreds(), me: ME, accountSyncCounter: 1 }
	const keys = addTransactionCapability({ get: async () => ({}), set: async () => {} }, silentLogger, {
		maxCommitRetries: 1,
		delayBetweenTriesMs: 0
	})
	const config: SocketConfig = {
		...DEFAULT_CONNECTION_CONFIG,
		auth: { creds, keys },
		logger: silentLogger,
		fireInitQueries: false,
		markOnlineOnConnect: false,
		enableRecentMessageCache: false,
		shouldSyncHistoryMessage: () => false
	}
	ev.process(events => {
		batches.push(events)
	})
	// Only transport is mocked: the receipt handler and event buffering remain real.
	transport = {
		ev,
		ws,
		authState: { creds, keys },
		query: async () => {
			throw new Error('Unexpected query in offline receipt test')
		},
		sendNode: async (node: BinaryNode) => {
			sent.push(node)
		},
		generateMessageTag: () => 'fictional-tag',
		sendUnifiedSession: async () => {},
		signalRepository: { lidMapping: { getLIDForPN: async () => null } },
		onUnexpectedError: (error: unknown) => {
			throw error
		},
		registerSocketEndHandler: (handler: () => void) => endHandlers.push(handler)
	} as unknown as ReturnType<typeof makeSocket>
	makeMessagesRecvSocket(config)
	return {
		batches,
		sent,
		async receive(node: BinaryNode) {
			for (const handler of ws.listeners('CB:receipt')) await handler(node)
		},
		close() {
			for (const handler of endHandlers) handler()
			ev.destroy()
			ws.removeAllListeners()
		}
	}
}
