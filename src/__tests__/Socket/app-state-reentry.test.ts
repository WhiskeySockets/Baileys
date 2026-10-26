import { jest } from '@jest/globals'
import { encodedAction, fixture, JID, modification, syncResponse } from './app-state-fixtures'

beforeEach(() => {
	jest.useFakeTimers()
	jest.setSystemTime(1700000100000)
})
afterEach(() => {
	jest.clearAllTimers()
	jest.useRealTimers()
})

it('commits a follow-up chatModify started from a preflight sync observation', async () => {
	const f = fixture({ emitOwnEvents: false })
	let followup: Promise<void> | undefined
	try {
		f.ev.on('app-state.update', event => {
			if (event.kind === 'chat-action' && event.source === 'sync' && !followup) {
				followup = f.sock.chatModify(modification('archive', false), JID, { requestId: 'followup' })
			}
		})
		const remote = await encodedAction(modification('archive', false))
		f.syncReplies.push(syncResponse([remote.patch]))
		await f.sock.chatModify(modification('archive', true), JID, { requestId: 'outer' })
		expect(followup).toBeDefined()
		await followup
		expect(f.observations).toEqual([
			expect.objectContaining({ kind: 'chat-action', source: 'sync', version: 1 }),
			expect.objectContaining({ kind: 'patch-response', requestId: 'outer', version: 2 }),
			expect.objectContaining({ kind: 'chat-action', source: 'local-echo', requestId: 'outer', version: 2 }),
			expect.objectContaining({ kind: 'patch-response', requestId: 'followup', version: 3 }),
			expect.objectContaining({ kind: 'chat-action', source: 'local-echo', requestId: 'followup', version: 3 })
		])
		// Both outgoing calls resolved and version 3 was acknowledged, so the key store must contain it.
		expect(await f.version()).toBe(3)
	} finally {
		f.close()
	}
})

it('control: commits the same follow-up started outside the sync listener', async () => {
	const f = fixture({ emitOwnEvents: false })
	try {
		const remote = await encodedAction(modification('archive', false))
		f.syncReplies.push(syncResponse([remote.patch]))
		await f.sock.chatModify(modification('archive', true), JID, { requestId: 'outer' })
		await f.sock.chatModify(modification('archive', false), JID, { requestId: 'followup' })
		expect(await f.version()).toBe(3)
	} finally {
		f.close()
	}
})

it.each([
	['conflict', 'conflict'],
	['missing', 'Missing app state patch response']
] as const)('retains committed preflight sync when the outgoing patch fails: %s', async (patchReply, error) => {
	const f = fixture({ patchReply })
	try {
		const remote = await encodedAction(modification('archive', false))
		f.syncReplies.push(syncResponse([remote.patch]))
		await expect(f.sock.chatModify(modification('archive', true), JID)).rejects.toThrow(error)
		expect(await f.version()).toBe(1)
		expect(f.observations).toEqual([expect.objectContaining({ kind: 'chat-action', source: 'sync', version: 1 })])
	} finally {
		f.close()
	}
})

it('does not submit a patch or publish sync actions when the preflight commit fails', async () => {
	const f = fixture({ failCommit: true })
	try {
		const remote = await encodedAction(modification('archive', false))
		f.syncReplies.push(syncResponse([remote.patch]))
		await expect(f.sock.chatModify(modification('archive', true), JID)).rejects.toThrow('Fictional commit failure')
		expect(f.sequence).not.toContain('iq:patch')
		expect(f.observations).toEqual([])
		expect(await f.version()).toBe(0)
	} finally {
		f.close()
	}
})
