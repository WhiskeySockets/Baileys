import { jest } from '@jest/globals'
import { proto } from '../../../WAProto/index.js'
import { chatModificationToAppPatch, decodePatches, newLTHashState, processSyncAction } from '../../Utils/chat-utils'
import { makeEventBuffer } from '../../Utils/event-buffer'
import { isJidGroup } from '../../WABinary'
import { encodedAction, fixture, GROUP, JID, ME, modification, silentLogger, syncResponse } from './app-state-fixtures'

beforeEach(() => {
	jest.useFakeTimers()
	jest.setSystemTime(1700000100000)
})
afterEach(() => {
	jest.clearAllTimers()
	jest.useRealTimers()
})

describe.each(['read', 'archive'] as const)('%s conversation app-state', kind => {
	it.each([true, false])('encodes value=%s in regular_low; no read receipt is sent', async value => {
		const f = fixture()
		try {
			const patch = chatModificationToAppPatch(modification(kind, value), JID)
			expect(patch.type).toBe('regular_low')
			expect(patch.apiVersion).toBe(3)
			expect(patch.index).toEqual([kind === 'read' ? 'markChatAsRead' : 'archive', JID])
			await f.sock.chatModify(modification(kind, value), JID)
			f.sequence.push('promise:resolved')
			expect(await f.version()).toBe(1)
			expect(f.raw).toEqual([
				[{ id: JID, ...(kind === 'read' ? { unreadCount: value ? 0 : -1 } : { archived: value }) }]
			])
			expect(f.batches).toEqual([])
			expect(f.sent).toEqual([])
			expect(f.sequence).toEqual([
				'iq:sync:v0',
				'iq:patch',
				'iq:result:accepted',
				'persist:v1',
				'emit:chats.update',
				'promise:resolved'
			])
			await jest.advanceTimersByTimeAsync(100)
			expect(f.sequence.at(-1)).toBe('callback:chats.update')
			expect(f.batches).toHaveLength(1)
		} finally {
			f.close()
		}
	})

	it.each([true, false])(
		'saving the local version suppresses an equal-version resync, own events=%s',
		async emitOwnEvents => {
			const f = fixture({ emitOwnEvents })
			try {
				await f.sock.chatModify(modification(kind, true), JID)
				f.ev.flush()
				const count = f.batches.length
				const ownPatch = f.submitted()
				ownPatch.version = { version: 1 }
				f.syncReplies.push(syncResponse([ownPatch]))
				await f.sock.resyncAppState(['regular_low'], false)
				f.ev.flush()
				expect(f.batches).toHaveLength(count)
				expect(count).toBe(emitOwnEvents ? 1 : 0)
				expect(f.raw).toHaveLength(count)
			} finally {
				f.close()
			}
		}
	)

	it('when preflight buffering has already flushed, the own callback precedes promise resolution', async () => {
		let accept!: () => void
		const patchGate = new Promise<void>(resolve => {
			accept = resolve
		})
		const f = fixture({ patchGate })
		try {
			const call = f.sock.chatModify(modification(kind, true), JID)
			await jest.advanceTimersByTimeAsync(100)
			expect(f.ev.isBuffering()).toBe(false)
			accept()
			await call
			f.sequence.push('promise:resolved')
			expect(f.sequence.slice(-3)).toEqual(['emit:chats.update', 'callback:chats.update', 'promise:resolved'])
		} finally {
			accept()
			f.close()
		}
	})

	it('a newer remotely fetched patch produces an update without origin, version, time or range', async () => {
		const f = fixture({ emitOwnEvents: false })
		try {
			await f.sock.chatModify(modification(kind, true), JID)
			f.ev.flush()
			const remote = await encodedAction(modification(kind, false), await f.state())
			f.syncReplies.push(syncResponse([remote.patch]))
			await f.receive('notification', {
				tag: 'notification',
				attrs: { type: 'server_sync', from: 's.whatsapp.net', id: 'fictional-sync' },
				content: [{ tag: 'collection', attrs: { name: 'regular_low', version: '2' } }]
			})
			expect(f.batches).toEqual([
				{ 'chats.update': [{ id: JID, ...(kind === 'read' ? { unreadCount: -1 } : { archived: false }) }] }
			])
			expect(await f.version()).toBe(2)
		} finally {
			f.close()
		}
	})

	it('preflight remote state and own echo can merge into one callback after the call returns', async () => {
		const f = fixture()
		try {
			const remote = await encodedAction(modification(kind, false))
			f.syncReplies.push(syncResponse([remote.patch]))
			await f.sock.chatModify(modification(kind, true), JID)
			expect(f.raw).toHaveLength(2)
			expect(f.batches).toEqual([])
			f.ev.flush()
			expect(f.batches).toHaveLength(1)
			expect(f.batches[0]!['chats.update']).toEqual([
				{ id: JID, ...(kind === 'read' ? { unreadCount: 0 } : { archived: true }) }
			])
			expect(await f.version()).toBe(2)
		} finally {
			f.close()
		}
	})
})

describe('decoded mutations and initial sync', () => {
	it('successive archive actions at the same index collapse to the last mutation before event emission', async () => {
		const first = await encodedAction(modification('archive', true))
		const second = await encodedAction(modification('archive', false), first.state)
		const decoded = await decodePatches(
			'regular_low',
			[first.patch, second.patch],
			newLTHashState(),
			async () => ({ keyData: Buffer.alloc(32, 7) }),
			{},
			undefined,
			silentLogger
		)
		expect(Object.values(decoded.mutationMap)).toHaveLength(1)
		expect(Object.values(decoded.mutationMap)[0]!.syncAction.value!.archiveChatAction!.archived).toBe(false)
	})

	it.each(['read', 'archive'] as const)('%s initial action waits for a chat, then is absorbed into history', kind => {
		const ev = makeEventBuffer(silentLogger)
		const received: unknown[] = []
		ev.process(events => {
			received.push(events)
		})
		try {
			ev.buffer()
			const patch = chatModificationToAppPatch(modification(kind, true), JID)
			processSyncAction({ index: patch.index, syncAction: { value: patch.syncAction } }, ev, ME, {
				accountSettings: { unarchiveChats: true }
			})
			ev.flush()
			expect(received).toEqual([])
			ev.buffer()
			ev.emit('messaging-history.set', {
				chats: [{ id: JID, lastMessageRecvTimestamp: 1700000000 }],
				contacts: [],
				messages: [],
				isLatest: true,
				syncType: 0
			})
			ev.flush()
			expect(received).toHaveLength(1)
			const batch = received[0] as { 'messaging-history.set': { chats: unknown[] }; 'chats.update'?: unknown }
			expect(batch['chats.update']).toBeUndefined()
			expect(batch['messaging-history.set'].chats).toEqual([
				{
					id: JID,
					lastMessageRecvTimestamp: 1700000000,
					...(kind === 'read' ? { unreadCount: null } : { archived: true })
				}
			])
		} finally {
			ev.destroy()
		}
	})

	it.each(['read', 'archive'] as const)('%s initial action with an older range is discarded', kind => {
		const ev = makeEventBuffer(silentLogger)
		const updates: unknown[] = []
		ev.on('chats.update', update => {
			updates.push(update)
		})
		try {
			ev.buffer()
			ev.emit('chats.upsert', [{ id: JID, lastMessageRecvTimestamp: 1700000001 }])
			const patch = chatModificationToAppPatch(modification(kind, true), JID)
			processSyncAction({ index: patch.index, syncAction: { value: patch.syncAction } }, ev, ME, {
				accountSettings: { unarchiveChats: true }
			})
			ev.flush()
			expect(updates).toEqual([])
		} finally {
			ev.destroy()
		}
	})

	it.each(['read-first', 'incoming-first'] as const)(
		'positive unread and read=0 consolidate to positive: %s',
		order => {
			const ev = makeEventBuffer(silentLogger)
			const received: unknown[] = []
			ev.on('chats.update', updates => {
				received.push(updates)
			})
			try {
				ev.buffer()
				for (const unreadCount of order === 'read-first' ? [0, 1] : [1, 0])
					ev.emit('chats.update', [{ id: JID, unreadCount }])
				ev.flush()
				expect(received).toEqual([[{ id: JID, unreadCount: 1 }]])
			} finally {
				ev.destroy()
			}
		}
	)

	it('flush callbacks follow consolidation order, not the original emission order', () => {
		const ev = makeEventBuffer(silentLogger)
		const order: string[] = []
		ev.on('messages.update', () => {
			order.push('messages.update')
		})
		ev.on('chats.update', () => {
			order.push('chats.update')
		})
		try {
			ev.buffer()
			ev.emit('messages.update', [
				{ key: { remoteJid: JID, id: 'fictional-message' }, update: { status: proto.WebMessageInfo.Status.READ } }
			])
			ev.emit('chats.update', [{ id: JID, archived: true }])
			ev.flush()
			expect(order).toEqual(['chats.update', 'messages.update'])
		} finally {
			ev.destroy()
		}
	})
})

describe('message read receipts are a separate path', () => {
	it.each(['all', 'none'] as const)(
		'readMessages with privacy=%s sends a receipt without chat state or own events',
		async privacy => {
			const f = fixture({ privacy })
			try {
				await f.sock.readMessages([
					{ remoteJid: JID, id: 'fictional-incoming', fromMe: false },
					{ remoteJid: JID, id: 'fictional-own', fromMe: true }
				])
				expect(f.sequence).toEqual(['iq:privacy', 'send:receipt'])
				expect(f.sent).toEqual([
					{
						tag: 'receipt',
						attrs: {
							id: 'fictional-incoming',
							to: JID,
							type: privacy === 'all' ? 'read' : 'read-self',
							t: '1700000100'
						}
					}
				])
				expect(f.batches).toEqual([])
				expect(await f.version()).toBe(0)
			} finally {
				f.close()
			}
		}
	)

	it.each([JID, GROUP])('an incoming read receipt for %s produces message evidence, no chats.update', async from => {
		const f = fixture()
		try {
			await f.receive('receipt', {
				tag: 'receipt',
				attrs: {
					id: 'fictional-sent',
					from,
					type: 'read',
					t: '1700000050',
					...(isJidGroup(from) ? { participant: JID } : {})
				}
			})
			const key = {
				remoteJid: from,
				id: 'fictional-sent',
				fromMe: true,
				participant: isJidGroup(from) ? JID : undefined
			}
			const updates = f.batches.flatMap(batch => batch['messages.update'] ?? [])
			const receipts = f.batches.flatMap(batch => batch['message-receipt.update'] ?? [])
			if (isJidGroup(from)) {
				expect(receipts).toEqual([{ key, receipt: { userJid: JID, readTimestamp: 1700000050 } }])
			} else {
				expect(updates).toEqual([
					{ key, update: expect.objectContaining({ status: proto.WebMessageInfo.Status.READ }) }
				])
			}

			expect(f.raw).toEqual([])
			expect(f.sent.at(-1)?.tag).toBe('ack')
		} finally {
			f.close()
		}
	})
})

describe('transport failure', () => {
	it('a thrown transport error neither advances state nor creates an echo', async () => {
		const f = fixture({ patchReply: 'transport-error' })
		try {
			await expect(f.sock.chatModify(modification('archive', true), JID)).rejects.toThrow('Fictional transport failure')
			f.ev.flush()
			expect(await f.version()).toBe(0)
			expect(f.batches).toEqual([])
		} finally {
			f.close()
		}
	})
})
