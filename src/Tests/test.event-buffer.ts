import { proto } from '../../WAProto'
import { Chat, WAMessageKey, WAMessageStatus, WAMessageStubType, WAMessageUpdate } from '../Types'
import { delay, generateMessageID, makeEventBuffer, toNumber, unixTimestampSeconds } from '../Utils'
import logger from '../Utils/logger'
import { randomJid } from './utils'

describe('Event Buffer Tests', () => {

	let ev: ReturnType<typeof makeEventBuffer>
	beforeEach(() => {
		ev = makeEventBuffer(logger)
	})

	it('should buffer a chat upsert & update event', async() => {
		const chatId = randomJid()

		const chats: Chat[] = []

		ev.on('chats.upsert', c => chats.push(...c))
		ev.on('chats.update', () => fail('should not emit update event'))

		ev.buffer()
		ev.processInBuffer((async() => {
			await delay(100)
			ev.emit('chats.upsert', [{ id: chatId, conversationTimestamp: 123, unreadCount: 1 }])
		})())
		ev.processInBuffer((async() => {
			await delay(200)
			ev.emit('chats.update', [{ id: chatId, conversationTimestamp: 124, unreadCount: 1 }])
		})())

		await ev.flush()

		expect(chats).toHaveLength(1)
		expect(chats[0].conversationTimestamp).toEqual(124)
		expect(chats[0].unreadCount).toEqual(2)
	})

	it('should overwrite a chats.delete event', async() => {
		const chatId = randomJid()
		const chats: Partial<Chat>[] = []

		ev.on('chats.update', c => chats.push(...c))
		ev.on('chats.delete', () => fail('not should have emitted'))

		ev.buffer()

		ev.emit('chats.update', [{ id: chatId, conversationTimestamp: 123, unreadCount: 1 }])
		ev.emit('chats.delete', [chatId])
		ev.emit('chats.update', [{ id: chatId, conversationTimestamp: 124, unreadCount: 1 }])

		await ev.flush()

		expect(chats).toHaveLength(1)
	})

	it('should overwrite a chats.update event', async() => {
		const chatId = randomJid()
		const chatsDeleted: string[] = []

		ev.on('chats.delete', c => chatsDeleted.push(...c))
		ev.on('chats.update', () => fail('not should have emitted'))

		ev.buffer()

		ev.emit('chats.update', [{ id: chatId, conversationTimestamp: 123, unreadCount: 1 }])
		ev.emit('chats.delete', [chatId])

		await ev.flush()

		expect(chatsDeleted).toHaveLength(1)
	})

	it('should buffer message upsert events', async() => {
		const messageTimestamp = unixTimestampSeconds()
		const msg: proto.IWebMessageInfo = {
			key: {
				remoteJid: randomJid(),
				id: generateMessageID(),
				fromMe: false
			},
			messageStubType: WAMessageStubType.CIPHERTEXT,
			messageTimestamp
		}

		const msgs: proto.IWebMessageInfo[] = []

		ev.on('messages.upsert', c => {
			msgs.push(...c.messages)
			expect(c.type).toEqual('notify')
		})

		ev.buffer()
		ev.emit('messages.upsert', { messages: [proto.WebMessageInfo.fromObject(msg)], type: 'notify' })

		msg.messageTimestamp = unixTimestampSeconds() + 1
		msg.messageStubType = undefined
		msg.message = { conversation: 'Test' }
		ev.emit('messages.upsert', { messages: [proto.WebMessageInfo.fromObject(msg)], type: 'notify' })
		ev.emit('messages.update', [{ key: msg.key, update: { status: WAMessageStatus.READ } }])

		await ev.flush()

		expect(msgs).toHaveLength(1)
		expect(msgs[0].message).toBeTruthy()
		expect(toNumber(msgs[0].messageTimestamp!)).toEqual(messageTimestamp)
		expect(msgs[0].status).toEqual(WAMessageStatus.READ)
	})

	it('should buffer a message receipt update', async() => {
		const msg: proto.IWebMessageInfo = {
			key: {
				remoteJid: randomJid(),
				id: generateMessageID(),
				fromMe: false
			},
			messageStubType: WAMessageStubType.CIPHERTEXT,
			messageTimestamp: unixTimestampSeconds()
		}

		const msgs: proto.IWebMessageInfo[] = []

		ev.on('messages.upsert', c => msgs.push(...c.messages))
		ev.on('message-receipt.update', () => fail('should not emit'))

		ev.buffer()
		ev.emit('messages.upsert', { messages: [proto.WebMessageInfo.fromObject(msg)], type: 'notify' })
		ev.emit('message-receipt.update', [
			{
				key: msg.key,
				receipt: {
					userJid: randomJid(),
					readTimestamp: unixTimestampSeconds()
				}
			}
		])

		await ev.flush()

		expect(msgs).toHaveLength(1)
		expect(msgs[0].userReceipt).toHaveLength(1)
	})

	it('should buffer multiple status updates', async() => {
		const key: WAMessageKey = {
			remoteJid: randomJid(),
			id: generateMessageID(),
			fromMe: false
		}

		const msgs: WAMessageUpdate[] = []

		ev.on('messages.update', c => msgs.push(...c))

		ev.buffer()
		ev.emit('messages.update', [{ key, update: { status: WAMessageStatus.DELIVERY_ACK } }])
		ev.emit('messages.update', [{ key, update: { status: WAMessageStatus.READ } }])

		await ev.flush()

		expect(msgs).toHaveLength(1)
		expect(msgs[0].update.status).toEqual(WAMessageStatus.READ)
	})

	it('should remove chat unread counter', async() => {
		const msg: proto.IWebMessageInfo = {
			key: {
				remoteJid: '12345@s.whatsapp.net',
				id: generateMessageID(),
				fromMe: false
			},
			message: {
				conversation: 'abcd'
			},
			messageTimestamp: unixTimestampSeconds()
		}

		const chats: Partial<Chat>[] = []

		ev.on('chats.update', c => chats.push(...c))

		ev.buffer()
		ev.emit('messages.upsert', { messages: [proto.WebMessageInfo.fromObject(msg)], type: 'notify' })
		ev.emit('chats.update', [{ id: msg.key.remoteJid!, unreadCount: 1, conversationTimestamp: msg.messageTimestamp }])
		ev.emit('messages.update', [{ key: msg.key, update: { status: WAMessageStatus.READ } }])

		await ev.flush()

		expect(chats[0].unreadCount).toBeUndefined()
	})
})