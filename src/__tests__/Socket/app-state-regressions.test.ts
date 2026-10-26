import { jest } from '@jest/globals'
import { makeEventBuffer } from '../../Utils/event-buffer'
import { fixture, JID, modification, silentLogger } from './app-state-fixtures'

beforeEach(() => {
	jest.useFakeTimers()
})
afterEach(() => {
	jest.clearAllTimers()
	jest.useRealTimers()
})

describe('proposed appPatch response validation', () => {
	it.each(['read', 'archive'] as const)(
		'%s rejects a collection conflict before saving state or emitting own events',
		async kind => {
			const f = fixture({ patchReply: 'conflict' })
			try {
				await expect(f.sock.chatModify(modification(kind, true), JID)).rejects.toMatchObject({ data: 409 })
				f.ev.flush()
				expect(await f.version()).toBe(0)
				expect(f.raw).toEqual([])
				expect(f.batches).toEqual([])
			} finally {
				f.close()
			}
		}
	)

	it('a missing response is uncertain and must not advance app-state or synthesize success', async () => {
		const f = fixture({ patchReply: 'missing' })
		try {
			await expect(f.sock.chatModify(modification('archive', true), JID)).rejects.toThrow(
				'Missing app state patch response'
			)
			f.ev.flush()
			expect(await f.version()).toBe(0)
			expect(f.raw).toEqual([])
		} finally {
			f.close()
		}
	})
})

describe('reentrant buffer flushing', () => {
	it('preserves a second chat update buffered synchronously by a flush listener', () => {
		const ev = makeEventBuffer(silentLogger)
		const received: unknown[] = []
		ev.on('chats.update', updates => {
			received.push(structuredClone(updates))
			if (received.length === 1) {
				ev.buffer()
				ev.emit('chats.update', [{ id: JID, unreadCount: 0 }])
			}
		})
		try {
			ev.buffer()
			ev.emit('chats.update', [{ id: JID, archived: true }])
			ev.flush()
			ev.flush()
			expect(received).toEqual([[{ id: JID, archived: true }], [{ id: JID, unreadCount: 0 }]])
		} finally {
			ev.destroy()
		}
	})
})
