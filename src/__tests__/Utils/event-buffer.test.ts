import { jest } from '@jest/globals'
import type { BaileysEventMap } from '../../Types'
import { makeEventBuffer } from '../../Utils/event-buffer'
import type { ILogger } from '../../Utils/logger'

const makeTestLogger = (): ILogger =>
	({
		level: 'silent',
		child: () => makeTestLogger(),
		trace: jest.fn(),
		debug: jest.fn(),
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		fatal: jest.fn()
	}) as unknown as ILogger

describe('event-buffer', () => {
	describe('chats.delete debounce', () => {
		beforeEach(() => {
			jest.useFakeTimers()
		})

		afterEach(() => {
			jest.useRealTimers()
			jest.clearAllMocks()
		})

		it('debounces rapid chats.delete events into one emit', () => {
			const ev = makeEventBuffer(makeTestLogger())
			const handler = jest.fn()
			ev.on('chats.delete', handler)

			ev.emit('chats.delete', ['a@s.whatsapp.net'])
			ev.emit('chats.delete', ['b@s.whatsapp.net'])
			ev.emit('chats.delete', ['a@s.whatsapp.net'])

			expect(handler).not.toHaveBeenCalled()

			jest.advanceTimersByTime(500)

			expect(handler).toHaveBeenCalledTimes(1)
			expect(handler).toHaveBeenCalledWith(['a@s.whatsapp.net', 'b@s.whatsapp.net'])
		})

		it('flushes pending chats.delete before another event to preserve order', () => {
			const ev = makeEventBuffer(makeTestLogger())
			const order: string[] = []
			const chatDeleteHandler = jest.fn(() => order.push('delete'))
			const chatUpdateHandler = jest.fn(() => order.push('update'))

			ev.on('chats.delete', chatDeleteHandler)
			ev.on('chats.update', chatUpdateHandler)

			ev.emit('chats.delete', ['a@s.whatsapp.net'])
			ev.emit('chats.update', [{ id: 'a@s.whatsapp.net', archived: false }])

			expect(chatDeleteHandler).toHaveBeenCalledTimes(1)
			expect(chatDeleteHandler).toHaveBeenCalledWith(['a@s.whatsapp.net'])
			expect(chatUpdateHandler).toHaveBeenCalledTimes(1)
			expect(order).toEqual(['delete', 'update'])
		})

		it('does not drop pending chats.delete when transitioning into buffer/flush', () => {
			const ev = makeEventBuffer(makeTestLogger())
			const handler = jest.fn()
			ev.on('chats.delete', handler)

			ev.emit('chats.delete', ['a@s.whatsapp.net'])
			ev.buffer()
			ev.flush()

			expect(handler).toHaveBeenCalledTimes(1)
			expect(handler).toHaveBeenCalledWith(['a@s.whatsapp.net'])
		})
	})

	describe('messaging-history.set pastParticipants buffering', () => {
		it('should include pastParticipants in flushed event', async () => {
			const ev = makeEventBuffer(makeTestLogger())

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

			await new Promise(resolve => setTimeout(resolve, 100))

			expect(receivedEvents).toHaveLength(1)
			expect(receivedEvents[0]!.pastParticipants).toEqual(pastParticipants)
		})

		it('should accumulate pastParticipants across multiple buffered events', async () => {
			const ev = makeEventBuffer(makeTestLogger())

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
			const ev = makeEventBuffer(makeTestLogger())

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
