import { jest } from '@jest/globals'
import { proto } from '../../../WAProto/index.js'
import { chatModificationToAppPatch, decodeSyncdSnapshot } from '../../Utils/chat-utils'
import { encodedAction, fixture, JID, KEY_ID, modification, silentLogger, syncResponse } from './app-state-fixtures'

beforeEach(() => {
	jest.useFakeTimers()
	jest.setSystemTime(1700000100000)
})
afterEach(() => {
	jest.clearAllTimers()
	jest.useRealTimers()
})

describe('app-state observations preserve evidence before chat consolidation', () => {
	it('concurrent callers keep distinct request IDs and their actual collection versions', async () => {
		const f = fixture()
		try {
			await Promise.all([
				f.modifyWithRequestId(modification('read', true), 'concurrent-read'),
				f.modifyWithRequestId(modification('archive', false), 'concurrent-archive')
			])
			expect(f.observations).toHaveLength(4)
			expect(f.observations).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						kind: 'patch-response',
						requestId: 'concurrent-read',
						version: 1,
						serverVersion: 1
					}),
					expect.objectContaining({
						kind: 'chat-action',
						source: 'local-echo',
						requestId: 'concurrent-read',
						version: 1,
						action: { kind: 'mark-read', read: true }
					}),
					expect.objectContaining({
						kind: 'patch-response',
						requestId: 'concurrent-archive',
						version: 2,
						serverVersion: 2
					}),
					expect.objectContaining({
						kind: 'chat-action',
						source: 'local-echo',
						requestId: 'concurrent-archive',
						version: 2,
						action: { kind: 'archive', archived: false }
					})
				])
			)
		} finally {
			f.close()
		}
	})

	it.each(['read', 'archive'] as const)('%s distinguishes server response, local echo and remote sync', async kind => {
		const f = fixture()
		try {
			await f.modifyWithRequestId(modification(kind, true), 'fictional-request')
			expect(f.observations).toEqual([
				{
					kind: 'patch-response',
					collection: 'regular_low',
					version: 1,
					requestId: 'fictional-request',
					status: 'version-matched',
					serverVersion: 1
				},
				expect.objectContaining({
					kind: 'chat-action',
					source: 'local-echo',
					collection: 'regular_low',
					version: 1,
					requestId: 'fictional-request',
					jid: JID,
					action: kind === 'read' ? { kind: 'mark-read', read: true } : { kind: 'archive', archived: true },
					timestamp: 1700000100000,
					messageRange: expect.objectContaining({
						lastMessageTimestamp: 1700000000,
						messages: [expect.objectContaining({ id: 'fictional-last', fromMe: false })]
					})
				})
			])
			expect(f.batches).toEqual([])
			const ownPatch = f.submitted()
			ownPatch.version = { version: 1 }
			f.syncReplies.push(syncResponse([ownPatch]))
			await f.sock.resyncAppState(['regular_low'], false)
			expect(f.observations).toHaveLength(3)
			expect(f.observations[2]).toEqual(
				expect.objectContaining({
					kind: 'chat-action',
					source: 'sync',
					representation: 'patch',
					initialSync: false,
					macVerified: true,
					collection: 'regular_low',
					version: 1,
					jid: JID
				})
			)
			expect(f.observations[2]).not.toHaveProperty('requestId')
			f.ev.flush()
			expect(f.batches).toHaveLength(1)
		} finally {
			f.close()
		}
	})

	it('preserves the preflight action separately from the own echo and never assigns it the local request ID', async () => {
		const f = fixture()
		try {
			const remote = await encodedAction(modification('archive', false))
			f.syncReplies.push(syncResponse([remote.patch]))
			await f.modifyWithRequestId(modification('archive', true), 'local-only')
			expect(f.observations).toEqual([
				expect.objectContaining({
					kind: 'chat-action',
					source: 'sync',
					version: 1,
					action: { kind: 'archive', archived: false }
				}),
				expect.objectContaining({ kind: 'patch-response', requestId: 'local-only', version: 2, serverVersion: 2 }),
				expect.objectContaining({
					kind: 'chat-action',
					source: 'local-echo',
					requestId: 'local-only',
					version: 2,
					action: { kind: 'archive', archived: true }
				})
			])
			expect(f.observations[0]).not.toHaveProperty('requestId')
			f.ev.flush()
			expect(f.batches).toEqual([{ 'chats.update': [{ id: JID, archived: true }] }])
		} finally {
			f.close()
		}
	})

	it('two actions at the same index retain their individual versions and order', async () => {
		const f = fixture()
		try {
			const first = await encodedAction(modification('archive', true))
			const second = await encodedAction(modification('archive', false), first.state)
			f.syncReplies.push(syncResponse([first.patch, second.patch]))
			await f.sock.resyncAppState(['regular_low'], false)
			expect(f.observations).toEqual([
				expect.objectContaining({ source: 'sync', version: 1, action: { kind: 'archive', archived: true } }),
				expect.objectContaining({ source: 'sync', version: 2, action: { kind: 'archive', archived: false } })
			])
			f.ev.flush()
			expect(f.batches).toEqual([{ 'chats.update': [{ id: JID, archived: false }] }])
		} finally {
			f.close()
		}
	})

	describe.each([false, true])('appPatch with emitOwnEvents=%s', emitOwnEvents => {
		it.each([
			['read', true],
			['read', false],
			['archive', true],
			['archive', false]
		] as const)('emits one typed %s=%s echo and preserves response correlation', async (kind, value) => {
			const f = fixture({ emitOwnEvents })
			const requestId = `fictional-${kind}-${value}-${emitOwnEvents}`
			try {
				const patch = chatModificationToAppPatch(modification(kind, value), JID)
				await f.sock.appPatch(patch, { requestId })
				expect(f.observations).toEqual([
					{
						kind: 'patch-response',
						collection: 'regular_low',
						version: 1,
						requestId,
						status: 'version-matched',
						serverVersion: 1
					},
					{
						kind: 'chat-action',
						source: 'local-echo',
						collection: 'regular_low',
						version: 1,
						requestId,
						jid: JID,
						action: kind === 'read' ? { kind: 'mark-read', read: value } : { kind: 'archive', archived: value },
						timestamp: 1700000100000,
						messageRange: {
							lastMessageTimestamp: 1700000000,
							messages: [{ id: 'fictional-last', fromMe: false, timestamp: 1700000000 }]
						}
					}
				])
				const legacyUpdate = [{ id: JID, ...(kind === 'read' ? { unreadCount: value ? 0 : -1 } : { archived: value }) }]
				expect(f.raw).toEqual(emitOwnEvents ? [legacyUpdate] : [])
				f.ev.flush()
				expect(f.batches).toEqual(emitOwnEvents ? [{ 'chats.update': legacyUpdate }] : [])
				expect(await f.version()).toBe(1)
			} finally {
				f.close()
			}
		})
	})

	it('preserves a decoded initial read action even when its old range is discarded from chat state', async () => {
		const f = fixture()
		try {
			f.ev.buffer()
			f.ev.emit('chats.upsert', [{ id: JID, lastMessageRecvTimestamp: 1700000001 }])
			const remote = await encodedAction(modification('read', true))
			f.syncReplies.push(syncResponse([remote.patch]))
			await f.sock.resyncAppState(['regular_low'], true)
			expect(f.observations).toEqual([
				expect.objectContaining({
					source: 'sync',
					initialSync: true,
					action: { kind: 'mark-read', read: true },
					messageRange: expect.objectContaining({ lastMessageTimestamp: 1700000000 })
				})
			])
			f.ev.flush()
			expect(f.batches).toEqual([{ 'chats.upsert': [{ id: JID, lastMessageRecvTimestamp: 1700000001 }] }])
		} finally {
			f.close()
		}
	})

	it('keeps server response evidence even when the local transaction commit fails', async () => {
		const f = fixture({ failCommit: true })
		try {
			await expect(f.modifyWithRequestId(modification('archive', true), 'commit-failed')).rejects.toThrow(
				'Fictional commit failure'
			)
			expect(f.observations).toEqual([
				expect.objectContaining({
					kind: 'patch-response',
					requestId: 'commit-failed',
					status: 'version-matched',
					serverVersion: 1
				})
			])
			expect(await f.version()).toBe(0)
			expect(f.raw).toEqual([])
		} finally {
			f.close()
		}
	})

	it.each(['bare-result', 'wrong-version'] as const)('%s never claims a matching acknowledgement', async patchReply => {
		const f = fixture({ patchReply, emitOwnEvents: false })
		try {
			await f.modifyWithRequestId(modification('archive', true), 'limited-evidence')
			expect(f.observations).toEqual([
				expect.objectContaining({ kind: 'patch-response', status: 'response-received', version: 1 }),
				expect.objectContaining({
					kind: 'chat-action',
					source: 'local-echo',
					requestId: 'limited-evidence',
					version: 1
				})
			])
		} finally {
			f.close()
		}
	})

	it.each(['conflict', 'missing'] as const)(
		'%s produces neither response success nor own observation',
		async patchReply => {
			const f = fixture({ patchReply })
			try {
				await expect(f.modifyWithRequestId(modification('archive', true), 'not-accepted')).rejects.toThrow()
				expect(f.observations).toEqual([])
			} finally {
				f.close()
			}
		}
	)

	it('does not publish observations from a patch whose aggregate MAC check failed', async () => {
		const f = fixture()
		try {
			const remote = await encodedAction(modification('archive', true))
			const mac = Buffer.from(remote.patch.snapshotMac!)
			mac[0] = mac[0]! ^ 0xff
			remote.patch.snapshotMac = mac
			f.syncReplies.push(syncResponse([remote.patch]))
			await f.sock.resyncAppState(['regular_low'], false)
			expect(f.observations).toEqual([])
		} finally {
			f.close()
		}
	})

	it('readMessages remains receipt-only, without app-state observations', async () => {
		const f = fixture()
		try {
			await f.sock.readMessages([{ remoteJid: JID, fromMe: false, id: 'fictional-incoming' }])
			expect(f.observations).toEqual([])
			expect(f.sent).toHaveLength(1)
			expect(f.sent[0]!.tag).toBe('receipt')
		} finally {
			f.close()
		}
	})

	it('preserves timestamps when they are actually present on the wire, without exposing SDK payloads', async () => {
		const f = fixture()
		try {
			await f.modifyWithRequestId(
				{
					markRead: true,
					lastMessages: {
						lastMessageTimestamp: 1700000000,
						messages: [{ key: { remoteJid: JID, id: 'fictional-message', fromMe: false }, timestamp: 1700000000 }]
					}
				},
				'explicit-range'
			)
			expect(f.observations[1]).toEqual({
				kind: 'chat-action',
				source: 'local-echo',
				requestId: 'explicit-range',
				collection: 'regular_low',
				version: 1,
				jid: JID,
				action: { kind: 'mark-read', read: true },
				timestamp: 1700000100000,
				messageRange: {
					lastMessageTimestamp: 1700000000,
					messages: [{ id: 'fictional-message', fromMe: false, timestamp: 1700000000 }]
				}
			})
		} finally {
			f.close()
		}
	})

	it('labels network actions as unchecked when MAC verification is disabled', async () => {
		const f = fixture({ verifyMacs: false })
		try {
			const remote = await encodedAction(modification('archive', true))
			remote.patch.snapshotMac = Buffer.alloc(32)
			f.syncReplies.push(syncResponse([remote.patch]))
			await f.sock.resyncAppState(['regular_low'], false)
			expect(f.observations).toEqual([
				expect.objectContaining({ source: 'sync', macVerified: false, action: { kind: 'archive', archived: true } })
			])
		} finally {
			f.close()
		}
	})

	it.each([false, true])(
		'a same-version snapshot is observed only after the configured MAC check, corrupted=%s',
		async corrupted => {
			const encoded = await encodedAction(modification('read', true))
			const snapshot: proto.ISyncdSnapshot = {
				version: { version: 1 },
				records: encoded.patch.mutations!.map(mutation => mutation.record!),
				keyId: encoded.patch.keyId,
				mac: corrupted ? Buffer.alloc(32) : encoded.patch.snapshotMac
			}
			const observed = jest.fn()
			await Reflect.apply(decodeSyncdSnapshot, undefined, [
				'regular_low',
				snapshot,
				async (id: string) => (id === KEY_ID ? { keyData: Buffer.alloc(32, 7) } : null),
				1,
				true,
				silentLogger,
				observed
			])
			if (corrupted) expect(observed).not.toHaveBeenCalled()
			else {
				expect(observed).toHaveBeenCalledTimes(1)
				expect(observed).toHaveBeenCalledWith(expect.objectContaining({ index: ['markChatAsRead', JID] }), {
					collection: 'regular_low',
					version: 1
				})
			}
		}
	)

	it('a consumer can keep response, local echo and network evidence separate after the call settles', async () => {
		const f = fixture()
		try {
			await f.modifyWithRequestId(modification('read', true), 'consumer')
			f.ev.flush()
			const networkRead = () =>
				f.observations.filter(event => {
					const observation = event as { kind: string; source?: string }
					return observation.kind === 'chat-action' && observation.source === 'sync'
				})
			expect(networkRead()).toEqual([])
			const patch = f.submitted()
			patch.version = { version: 1 }
			f.syncReplies.push(syncResponse([patch]))
			await f.sock.resyncAppState(['regular_low'], false)
			f.ev.flush()
			expect(networkRead()).toEqual([
				expect.objectContaining({ version: 1, source: 'sync', action: { kind: 'mark-read', read: true } })
			])
			expect(f.batches).toHaveLength(1)
		} finally {
			f.close()
		}
	})
})
