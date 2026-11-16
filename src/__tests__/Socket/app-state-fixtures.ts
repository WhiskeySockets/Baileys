import { jest } from '@jest/globals'
import { EventEmitter } from 'node:events'
import { proto } from '../../../WAProto/index.js'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import type { makeSocket } from '../../Socket/socket'
import type { ChatModification, LTHashState, SignalDataTypeMap, SignalKeyStore, SocketConfig } from '../../Types'
import { addTransactionCapability, initAuthCreds } from '../../Utils/auth-utils'
import { chatModificationToAppPatch, encodeSyncdPatch, newLTHashState } from '../../Utils/chat-utils'
import { makeEventBuffer } from '../../Utils/event-buffer'
import logger from '../../Utils/logger'
import { assertNodeErrorFree, type BinaryNode, getBinaryNodeChild } from '../../WABinary'

// The only mocked SDK module is the transport socket. No WebSocket is constructed.
let transport: ReturnType<typeof makeSocket>
jest.unstable_mockModule('../../Socket/socket.js', () => ({ makeSocket: () => transport }))
const { makeMessagesRecvSocket } = await import('../../Socket/messages-recv')

export const JID = '12025550101@s.whatsapp.net'
export const ME = { id: '12025550199@s.whatsapp.net', name: 'Fictional owner' }
export const GROUP = '120363000000000001@g.us'
export const LAST_MESSAGES = [
	{ key: { remoteJid: JID, id: 'fictional-last', fromMe: false }, messageTimestamp: 1700000000 }
]
export const KEY_ID = Buffer.from('fictional-key-id').toString('base64')
const KEY = { keyData: Buffer.alloc(32, 7) }
export const silentLogger = logger.child({ class: 'offline-investigation' })
silentLogger.level = 'silent'

export function modification(kind: 'read' | 'archive', value: boolean): ChatModification {
	return kind === 'read'
		? { markRead: value, lastMessages: LAST_MESSAGES }
		: { archive: value, lastMessages: LAST_MESSAGES }
}

export async function encodedAction(mod: ChatModification, initial = newLTHashState()) {
	const create = chatModificationToAppPatch(mod, JID)
	const result = await encodeSyncdPatch(create, KEY_ID, initial, async () => KEY)
	result.patch.version = { version: result.state.version }
	return result
}

export function syncResponse(patches: proto.ISyncdPatch[] = [], attrs: Record<string, string> = {}): BinaryNode {
	return {
		tag: 'iq',
		attrs: { type: 'result' },
		content: [
			{
				tag: 'sync',
				attrs: {},
				content: [
					{
						tag: 'collection',
						attrs: { name: 'regular_low', version: '0', has_more_patches: 'false', ...attrs },
						content: patches.map(patch => ({
							tag: 'patch',
							attrs: {},
							content: proto.SyncdPatch.encode(patch).finish()
						}))
					}
				]
			}
		]
	}
}

// Shape reported in the official issue #1406, comment 3904719766. Synthetic bytes only.
export function conflictResponse(): BinaryNode {
	const result = syncResponse([], { type: 'error' })
	getBinaryNodeChild(getBinaryNodeChild(result, 'sync'), 'collection')!.content = [
		{ tag: 'error', attrs: { code: '409', text: 'conflict' } }
	]
	return result
}

type PatchReply = 'accepted' | 'conflict' | 'missing' | 'transport-error' | 'bare-result' | 'wrong-version'

export function fixture(
	options: {
		emitOwnEvents?: boolean
		patchReply?: PatchReply
		privacy?: 'all' | 'none'
		patchGate?: Promise<void>
		failCommit?: boolean
		verifyMacs?: boolean
	} = {}
) {
	const ev = makeEventBuffer(silentLogger)
	const ws = Object.assign(new EventEmitter(), { isOpen: true, isClosed: false })
	const endHandlers: (() => void)[] = []
	const storage = new Map<string, unknown>([['app-state-sync-key:' + KEY_ID, KEY]])
	const sequence: string[] = []
	const raw: unknown[] = []
	const batches: Partial<import('../../Types').BaileysEventMap>[] = []
	const observations: unknown[] = []
	const sent: BinaryNode[] = []
	const syncReplies: BinaryNode[] = []
	let submitted: proto.ISyncdPatch | undefined
	const store: SignalKeyStore = {
		async get(type, ids) {
			const result: Record<string, SignalDataTypeMap[typeof type]> = {}
			for (const id of ids) {
				const value = storage.get(`${type}:${id}`)
				if (value !== undefined && value !== null) result[id] = value as SignalDataTypeMap[typeof type]
			}

			return result
		},
		async set(data) {
			if (options.failCommit && data['app-state-sync-version']) throw new Error('Fictional commit failure')
			for (const [type, entries] of Object.entries(data)) {
				for (const [id, value] of Object.entries(entries ?? {})) {
					storage.set(`${type}:${id}`, value)
					if (type === 'app-state-sync-version' && value) sequence.push(`persist:v${(value as LTHashState).version}`)
				}
			}
		}
	}
	const keys = addTransactionCapability(store, silentLogger, { maxCommitRetries: 1, delayBetweenTriesMs: 0 })
	const creds = { ...initAuthCreds(), me: ME, myAppStateKeyId: KEY_ID, accountSyncCounter: 1 }
	const config: SocketConfig = {
		...DEFAULT_CONNECTION_CONFIG,
		auth: { creds, keys },
		logger: silentLogger,
		emitOwnEvents: options.emitOwnEvents ?? true,
		fireInitQueries: false,
		markOnlineOnConnect: false,
		enableRecentMessageCache: false,
		shouldSyncHistoryMessage: () => false,
		appStateMacVerification: { patch: options.verifyMacs ?? true, snapshot: options.verifyMacs ?? true }
	}
	const emit = ev.emit.bind(ev)
	ev.emit = (event, value) => {
		if (event === 'chats.update') {
			sequence.push('emit:chats.update')
			// Serialize only the synthetic projection; omit the conditional function.
			raw.push(JSON.parse(JSON.stringify(value)))
		}

		return emit(event, value)
	}

	ev.process(events => {
		const observation = (events as Record<string, unknown>)['app-state.update']
		if (observation) {
			observations.push(structuredClone(observation))
			return
		}

		batches.push(events)
		for (const event of Object.keys(events)) sequence.push(`callback:${event}`)
	})
	const query = async (node: BinaryNode): Promise<BinaryNode | undefined> => {
		if (node.attrs.xmlns === 'privacy') {
			sequence.push('iq:privacy')
			return {
				tag: 'iq',
				attrs: { type: 'result' },
				content: [
					{
						tag: 'privacy',
						attrs: {},
						content: [{ tag: 'category', attrs: { name: 'readreceipts', value: options.privacy ?? 'all' } }]
					}
				]
			}
		}

		if (node.attrs.xmlns !== 'w:sync:app:state') throw new Error(`Unexpected offline query: ${node.attrs.xmlns}`)
		const collection = getBinaryNodeChild(getBinaryNodeChild(node, 'sync'), 'collection')!
		const patch = getBinaryNodeChild(collection, 'patch')
		if (!patch) {
			sequence.push(`iq:sync:v${collection.attrs.version}`)
			return syncReplies.shift() ?? syncResponse()
		}

		sequence.push('iq:patch')
		submitted = proto.SyncdPatch.decode(patch.content as Uint8Array)
		if (options.patchGate) await options.patchGate
		if (options.patchReply === 'transport-error') throw new Error('Fictional transport failure')
		if (options.patchReply === 'missing') return undefined
		const result: BinaryNode =
			options.patchReply === 'bare-result'
				? { tag: 'iq', attrs: { type: 'result' } }
				: options.patchReply === 'conflict'
					? conflictResponse()
					: syncResponse([], {
							version: String(Number(collection.attrs.version) + (options.patchReply === 'wrong-version' ? 2 : 1))
						})
		// Match the real query(): it checks only direct children of the IQ.
		assertNodeErrorFree(result)
		sequence.push(`iq:result:${options.patchReply ?? 'accepted'}`)
		return result
	}

	// Explicit boundary: only the fields exercised by these socket layers are supplied.
	transport = {
		ev,
		ws,
		authState: { creds, keys },
		query,
		sendNode: async (node: BinaryNode) => {
			sent.push(node)
			sequence.push(`send:${node.tag}`)
		},
		generateMessageTag: () => 'fictional-tag',
		sendUnifiedSession: async () => {},
		signalRepository: { lidMapping: { getLIDForPN: async () => null } },
		onUnexpectedError: (error: unknown) => {
			throw error
		},
		registerSocketEndHandler: (handler: () => void) => endHandlers.push(handler)
	} as unknown as ReturnType<typeof makeSocket>
	const sock = makeMessagesRecvSocket(config)
	return {
		sock,
		ev,
		sequence,
		raw,
		batches,
		observations,
		sent,
		syncReplies,
		async modifyWithRequestId(mod: ChatModification, requestId: string) {
			// Reflect keeps the same fixture runnable against the unextended SDK for a red/green comparison.
			await Reflect.apply(sock.chatModify, sock, [mod, JID, { requestId }])
		},
		async state() {
			return (await keys.get('app-state-sync-version', ['regular_low'])).regular_low ?? newLTHashState()
		},
		async version() {
			return (await keys.get('app-state-sync-version', ['regular_low'])).regular_low?.version ?? 0
		},
		submitted() {
			if (!submitted) throw new Error('No submitted patch')
			return proto.SyncdPatch.decode(proto.SyncdPatch.encode(submitted).finish())
		},
		async receive(event: 'receipt' | 'notification', node: BinaryNode) {
			for (const handler of ws.listeners(`CB:${event}`)) await handler(node)
		},
		close() {
			for (const handler of endHandlers) handler()
			ev.destroy()
			ws.removeAllListeners()
		}
	}
}
