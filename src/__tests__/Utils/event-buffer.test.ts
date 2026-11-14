import { proto } from '../../../WAProto/index.js'
import type { BaileysEventMap } from '../../Types'
import { makeEventBuffer } from '../../Utils/event-buffer'
import { toNumber } from '../../Utils/generics'
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

	describe('messages.upsert absorbing a prior messages.update', () => {
		it('preserves the upserted message send timestamp when a buffered status update is absorbed', async () => {
			const logger = makeTestLogger()
			const ev = makeEventBuffer(logger)

			const key = { remoteJid: '1234567890123@s.whatsapp.net', id: 'ABCD1234', fromMe: true }
			const sendTime = 1700000000
			const receiptTime = 1700000095

			const received: BaileysEventMap['messages.upsert'][] = []
			ev.on('messages.upsert', data => received.push(data))
			const receivedUpdates: BaileysEventMap['messages.update'][] = []
			ev.on('messages.update', data => receivedUpdates.push(data))

			ev.buffer()

			// A read/delivery receipt is processed first and emits a status update whose
			// `update` carries the receipt timestamp (see handleReceipt in messages-recv).
			ev.emit('messages.update', [
				{
					key,
					update: { status: proto.WebMessageInfo.Status.READ, messageTimestamp: receiptTime }
				}
			])

			// The message itself is then upserted carrying the authoritative send time.
			ev.emit('messages.upsert', {
				messages: [{ key, messageTimestamp: sendTime, message: { conversation: 'hi' } }],
				type: 'notify'
			})

			ev.flush()

			await new Promise(resolve => setTimeout(resolve, 100))

			expect(received).toHaveLength(1)
			const msg = received[0]!.messages[0]!
			// send time must be preserved, not overwritten by the receipt timestamp
			expect(toNumber(msg.messageTimestamp)).toBe(sendTime)
			// the status from the absorbed update must still be applied
			expect(msg.status).toBe(proto.WebMessageInfo.Status.READ)
			// the absorbed update must not be re-emitted separately
			expect(receivedUpdates).toHaveLength(0)
		})

		it('preserves a buffered edit timestamp when the upsert is absorbed', async () => {
			const logger = makeTestLogger()
			const ev = makeEventBuffer(logger)

			const key = { remoteJid: '1234567890123@s.whatsapp.net', id: 'ABCD1234', fromMe: true }
			const sendTime = 1700000000
			const editTime = 1700000200

			const received: BaileysEventMap['messages.upsert'][] = []
			ev.on('messages.upsert', data => received.push(data))
			const receivedUpdates: BaileysEventMap['messages.update'][] = []
			ev.on('messages.update', data => receivedUpdates.push(data))

			ev.buffer()

			// An edit arrives before its target upsert. Unlike a receipt, it carries an
			// edited `message` plus its own (edit) messageTimestamp, which must survive.
			ev.emit('messages.update', [
				{
					key,
					update: {
						message: { editedMessage: { message: { conversation: 'edited' } } },
						messageTimestamp: editTime
					}
				}
			])

			ev.emit('messages.upsert', {
				messages: [{ key, messageTimestamp: sendTime, message: { conversation: 'hi' } }],
				type: 'notify'
			})

			ev.flush()

			await new Promise(resolve => setTimeout(resolve, 100))

			expect(received).toHaveLength(1)
			const msg = received[0]!.messages[0]!
			// the edit timestamp must win over the upsert send time
			expect(toNumber(msg.messageTimestamp)).toBe(editTime)
			expect(receivedUpdates).toHaveLength(0)
		})

		it('keeps the edit timestamp when a receipt is combined before the upsert', async () => {
			const logger = makeTestLogger()
			const ev = makeEventBuffer(logger)

			const key = { remoteJid: '1234567890123@s.whatsapp.net', id: 'ABCD1234', fromMe: true }
			const upsertTime = 1700000100
			const editTime = 1700000200
			const receiptTime = 1700000300

			const received: BaileysEventMap['messages.upsert'][] = []
			ev.on('messages.upsert', data => received.push(data))

			ev.buffer()

			// An edit arrives first (carries its own edit time + edited message)...
			ev.emit('messages.update', [
				{
					key,
					update: {
						message: { editedMessage: { message: { conversation: 'edited' } } },
						messageTimestamp: editTime
					}
				}
			])

			// ...then a later receipt/status update for the same key is combined in.
			// Its receiptTime must not clobber the buffered edit time.
			ev.emit('messages.update', [
				{
					key,
					update: { status: proto.WebMessageInfo.Status.DELIVERY_ACK, messageTimestamp: receiptTime }
				}
			])

			ev.emit('messages.upsert', {
				messages: [{ key, messageTimestamp: upsertTime, message: { conversation: 'hi' } }],
				type: 'notify'
			})

			ev.flush()

			await new Promise(resolve => setTimeout(resolve, 100))

			expect(received).toHaveLength(1)
			const msg = received[0]!.messages[0]!
			// the edit time must survive both the receipt combine and the upsert absorb
			expect(toNumber(msg.messageTimestamp)).toBe(editTime)
		})
	})
})
