import type { BaileysEventMap } from '../../Types'
import { makeEventBuffer } from '../../Utils/event-buffer'
import type { ILogger } from '../../Utils/logger'

const makeTestLogger = (): ILogger =>
	({
		level: 'silent',
		child: () => makeTestLogger(),
		trace: () => {},
		debug: () => {},
		info: () => {},
		warn: () => {},
		error: () => {},
		fatal: () => {}
	}) as unknown as ILogger

describe('event-buffer', () => {
	describe('chats.update readMessageRange', () => {
		const id = 'chat@s.whatsapp.net'
		const readMessageRange = {
			lastMessageTimestamp: 1700000100,
			messages: [{ key: { id: 'LAST', remoteJid: id, fromMe: false }, timestamp: 1700000100 }]
		}

		const collect = () => {
			const ev = makeEventBuffer(makeTestLogger())
			const upserts: BaileysEventMap['chats.upsert'][] = []
			const updates: BaileysEventMap['chats.update'][] = []
			ev.on('chats.upsert', (data: BaileysEventMap['chats.upsert']) => upserts.push(data))
			ev.on('chats.update', (data: BaileysEventMap['chats.update']) => updates.push(data))
			return { ev, upserts, updates }
		}

		const settle = () => new Promise(resolve => setTimeout(resolve, 100))

		it('keeps readMessageRange on a buffered update that stays an update', async () => {
			const { ev, updates } = collect()
			ev.buffer()
			ev.emit('chats.update', [{ id, unreadCount: 0, readMessageRange }])
			ev.flush()
			await settle()

			expect(updates.flat()).toEqual([expect.objectContaining({ id, unreadCount: 0, readMessageRange })])
		})

		it('drops a stale range when a ranged mark-read is followed by an unranged mark-unread', async () => {
			const { ev, updates } = collect()
			ev.buffer()
			ev.emit('chats.update', [{ id, unreadCount: 0, readMessageRange }])
			ev.emit('chats.update', [{ id, unreadCount: -1 }])
			ev.flush()
			await settle()

			const merged = updates.flat().filter(u => u.id === id)
			expect(merged).toHaveLength(1)
			expect(merged[0]).toMatchObject({ id, unreadCount: -1 })
			expect(merged[0]).not.toHaveProperty('readMessageRange')
		})

		it('keeps the range when a new incoming message follows the mark-read', async () => {
			const { ev, updates } = collect()
			ev.buffer()
			ev.emit('chats.update', [{ id, unreadCount: 0, readMessageRange }])
			ev.emit('chats.update', [{ id, unreadCount: 1 }])
			ev.flush()
			await settle()

			const merged = updates.flat().filter(u => u.id === id)
			expect(merged).toHaveLength(1)
			expect(merged[0]).toMatchObject({ id, unreadCount: 1, readMessageRange })
		})

		it('drops readMessageRange when the update merges into a buffered upsert', async () => {
			const { ev, upserts } = collect()
			ev.buffer()
			ev.emit('chats.upsert', [{ id, conversationTimestamp: 1700000000 }])
			ev.emit('chats.update', [{ id, unreadCount: 0, readMessageRange }])
			ev.flush()
			await settle()

			const chat = upserts.flat().find(c => c.id === id)
			expect(chat).toMatchObject({ id, unreadCount: 0 })
			expect(chat).not.toHaveProperty('readMessageRange')
		})

		it('drops readMessageRange when a later upsert absorbs the buffered update', async () => {
			const { ev, upserts } = collect()
			ev.buffer()
			ev.emit('chats.update', [{ id, unreadCount: 0, readMessageRange }])
			ev.emit('chats.upsert', [{ id, conversationTimestamp: 1700000000 }])
			ev.flush()
			await settle()

			const chat = upserts.flat().find(c => c.id === id)
			expect(chat).toMatchObject({ id, unreadCount: 0 })
			expect(chat).not.toHaveProperty('readMessageRange')
		})
	})

	describe('messaging-history.set pastParticipants buffering', () => {
		it('should include pastParticipants in flushed event', async () => {
			const logger = makeTestLogger()
			const ev = makeEventBuffer(logger)

			const pastParticipants = [
				{
					groupJid: '123456789012345678@g.us',
					pastParticipants: [{ userJid: '1234567890123@s.whatsapp.net', leaveReason: 1, leaveTs: 1700000000 }]
				}
			]

			const receivedEvents: BaileysEventMap['messaging-history.set'][] = []
			ev.on('messaging-history.set', (data: BaileysEventMap['messaging-history.set']) => {
				receivedEvents.push(data)
			})

			ev.buffer()
			ev.emit('messaging-history.set', {
				chats: [],
				contacts: [],
				messages: [],
				pastParticipants,
				syncType: 0,
				progress: 50,
				isLatest: false,
				peerDataRequestSessionId: null
			})
			ev.flush()

			// wait for event emission
			await new Promise(resolve => setTimeout(resolve, 100))

			expect(receivedEvents).toHaveLength(1)
			expect(receivedEvents[0]!.pastParticipants).toEqual(pastParticipants)
		})

		it('should accumulate pastParticipants across multiple buffered events', async () => {
			const logger = makeTestLogger()
			const ev = makeEventBuffer(logger)

			const batch1 = [
				{
					groupJid: '111111111111111111@g.us',
					pastParticipants: [{ userJid: '1111111111111@s.whatsapp.net', leaveReason: 1, leaveTs: 1700000000 }]
				}
			]

			const batch2 = [
				{
					groupJid: '222222222222222222@g.us',
					pastParticipants: [{ userJid: '2222222222222@s.whatsapp.net', leaveReason: 2, leaveTs: 1700000001 }]
				}
			]

			const receivedEvents: BaileysEventMap['messaging-history.set'][] = []
			ev.on('messaging-history.set', (data: BaileysEventMap['messaging-history.set']) => {
				receivedEvents.push(data)
			})

			ev.buffer()
			ev.emit('messaging-history.set', {
				chats: [],
				contacts: [],
				messages: [],
				pastParticipants: batch1,
				syncType: 0,
				progress: 25,
				isLatest: false,
				peerDataRequestSessionId: null
			})
			ev.emit('messaging-history.set', {
				chats: [],
				contacts: [],
				messages: [],
				pastParticipants: batch2,
				syncType: 0,
				progress: 50,
				isLatest: false,
				peerDataRequestSessionId: null
			})
			ev.flush()

			await new Promise(resolve => setTimeout(resolve, 100))

			expect(receivedEvents).toHaveLength(1)
			expect(receivedEvents[0]!.pastParticipants).toHaveLength(2)
			expect(receivedEvents[0]!.pastParticipants).toContainEqual(batch1[0])
			expect(receivedEvents[0]!.pastParticipants).toContainEqual(batch2[0])
		})

		it('should not lose pastParticipants when later event has none', async () => {
			const logger = makeTestLogger()
			const ev = makeEventBuffer(logger)

			const batch1 = [
				{
					groupJid: '111111111111111111@g.us',
					pastParticipants: [{ userJid: '1111111111111@s.whatsapp.net', leaveReason: 1, leaveTs: 1700000000 }]
				}
			]

			const receivedEvents: BaileysEventMap['messaging-history.set'][] = []
			ev.on('messaging-history.set', (data: BaileysEventMap['messaging-history.set']) => {
				receivedEvents.push(data)
			})

			ev.buffer()
			ev.emit('messaging-history.set', {
				chats: [],
				contacts: [],
				messages: [],
				pastParticipants: batch1,
				syncType: 0,
				progress: 25,
				isLatest: false,
				peerDataRequestSessionId: null
			})
			// Second event has no pastParticipants
			ev.emit('messaging-history.set', {
				chats: [],
				contacts: [],
				messages: [],
				syncType: 0,
				progress: 50,
				isLatest: false,
				peerDataRequestSessionId: null
			})
			ev.flush()

			await new Promise(resolve => setTimeout(resolve, 100))

			expect(receivedEvents).toHaveLength(1)
			expect(receivedEvents[0]!.pastParticipants).toEqual(batch1)
		})
	})
})
