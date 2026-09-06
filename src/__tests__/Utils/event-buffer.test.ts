import { type BaileysEventMap, WAMessageStatus } from '../../Types'
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
	describe('messages.update buffering', () => {
		it('preserves the decoded message timestamp when absorbing a prior receipt update', () => {
			const ev = makeEventBuffer(makeTestLogger())
			const receivedEvents: BaileysEventMap['messages.upsert'][] = []
			const key = {
				remoteJid: '1234567890@s.whatsapp.net',
				id: 'message-id',
				fromMe: false
			}

			ev.on('messages.upsert', (data: BaileysEventMap['messages.upsert']) => {
				receivedEvents.push(data)
			})

			ev.buffer()
			ev.emit('messages.update', [
				{
					key,
					update: {
						status: WAMessageStatus.DELIVERY_ACK,
						messageTimestamp: 200
					}
				}
			])
			ev.emit('messages.upsert', {
				messages: [{ key, messageTimestamp: 100 }],
				type: 'append'
			})
			ev.flush()

			expect(receivedEvents).toHaveLength(1)
			expect(receivedEvents[0]!.messages[0]).toMatchObject({
				messageTimestamp: 100,
				status: WAMessageStatus.DELIVERY_ACK
			})

			ev.destroy()
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
