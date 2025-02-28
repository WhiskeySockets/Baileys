import { test, beforeEach } from 'node:test';
import assert from 'node:assert';
import { proto } from '../../WAProto'
import { Chat, WAMessageKey, WAMessageStatus, WAMessageStubType, WAMessageUpdate } from '../Types'
import { delay, generateMessageID, makeEventBuffer, toNumber, unixTimestampSeconds } from '../Utils'
import logger from '../Utils/logger'
import { randomJid } from './utils'

test('Event Buffer Tests', async (t) => {
	const fail = (err: Error) => {
		if(err) {
			throw err
		}
	}

	let ev: ReturnType<typeof makeEventBuffer>
	beforeEach(() => {
		const _logger = logger.child({ })
		_logger.level = 'trace'
		ev = makeEventBuffer(_logger)
	})

	await t.test('should buffer a chat upsert & update event', async() => {
		const chatId = randomJid()

		const chats: Chat[] = []

		ev.on('chats.upsert', c => chats.push(...c))
		ev.on('chats.update', () => fail(new Error('should not emit update event')))

		ev.buffer()
		await Promise.all([
			(async() => {
				ev.buffer()
				await delay(100)
				ev.emit('chats.upsert', [{ id: chatId, conversationTimestamp: 123, unreadCount: 1 }])
				const flushed = ev.flush()
				assert.strictEqual(flushed, false)
			})(),
			(async() => {
				ev.buffer()
				await delay(200)
				ev.emit('chats.update', [{ id: chatId, conversationTimestamp: 124, unreadCount: 1 }])
				const flushed = ev.flush()
				assert.strictEqual(flushed, false)
			})()
		])

		const flushed = ev.flush()
		assert.ok(flushed)

		assert.strictEqual(chats.length, 1)
		assert.strictEqual(chats[0].conversationTimestamp, 124)
		assert.strictEqual(chats[0].unreadCount, 2)
	})

	await t.test('should overwrite a chats.delete event', async() => {
		const chatId = randomJid()
		const chats: Partial<Chat>[] = []

		ev.on('chats.update', c => chats.push(...c))
		ev.on('chats.delete', () => fail(new Error('not should have emitted')))

		ev.buffer()

		ev.emit('chats.update', [{ id: chatId, conversationTimestamp: 123, unreadCount: 1 }])
		ev.emit('chats.delete', [chatId])
		ev.emit('chats.update', [{ id: chatId, conversationTimestamp: 124, unreadCount: 1 }])

		ev.flush()

		assert.strictEqual(chats.length, 1)
	})

	await t.test('should overwrite a chats.update event', async() => {
		const chatId = randomJid()
		const chatsDeleted: string[] = []

		ev.on('chats.delete', c => chatsDeleted.push(...c))
		ev.on('chats.update', () => fail(new Error('should not emit update event')))

		ev.buffer()

		ev.emit('chats.update', [{ id: chatId, conversationTimestamp: 123, unreadCount: 1 }])
		ev.emit('chats.delete', [chatId])

		ev.flush()

		assert.strictEqual(chatsDeleted.length, 1)
	})

	await t.test('should release a conditional update at the right time', async() => {
		const chatId = randomJid()
		const chatId2 = randomJid()
		const chatsUpserted: Chat[] = []
		const chatsSynced: Chat[] = []

		ev.on('chats.upsert', c => chatsUpserted.push(...c))
		ev.on('messaging-history.set', c => chatsSynced.push(...c.chats))
		ev.on('chats.update', () => fail(new Error('not should have emitted')))

		ev.buffer()
		ev.emit('chats.update', [{
			id: chatId,
			archived: true,
			conditional(buff) {
				if(buff.chatUpserts[chatId]) {
					return true
				}
			}
		}])
		ev.emit('chats.update', [{
			id: chatId2,
			archived: true,
			conditional(buff) {
				if(buff.historySets.chats[chatId2]) {
					return true
				}
			}
		}])

		ev.flush()

		ev.buffer()
		ev.emit('chats.upsert', [{
			id: chatId,
			conversationTimestamp: 123,
			unreadCount: 1,
			muteEndTime: 123
		}])
		ev.emit('messaging-history.set', {
			chats: [{
				id: chatId2,
				conversationTimestamp: 123,
				unreadCount: 1,
				muteEndTime: 123
			}],
			contacts: [],
			messages: [],
			isLatest: false
		})
		ev.flush()

		assert.strictEqual(chatsUpserted.length, 1)
		assert.strictEqual(chatsUpserted[0].id, chatId)
		assert.strictEqual(chatsUpserted[0].archived, true)
		assert.strictEqual(chatsUpserted[0].muteEndTime, 123)

		assert.strictEqual(chatsSynced.length, 1)
		assert.strictEqual(chatsSynced[0].id, chatId2)
		assert.strictEqual(chatsSynced[0].archived, true)
	})

	await t.test('should discard a conditional update', async() => {
		const chatId = randomJid()
		const chatsUpserted: Chat[] = []

		ev.on('chats.upsert', c => chatsUpserted.push(...c))
		ev.on('chats.update', () => fail(new Error('not should have emitted')))

		ev.buffer()
		ev.emit('chats.update', [{
			id: chatId,
			archived: true,
			conditional(buff) {
				if(buff.chatUpserts[chatId]) {
					return false
				}
			}
		}])
		ev.emit('chats.upsert', [{
			id: chatId,
			conversationTimestamp: 123,
			unreadCount: 1,
			muteEndTime: 123
		}])

		ev.flush()

		assert.strictEqual(chatsUpserted.length, 1)
		assert.strictEqual(chatsUpserted[0].archived, undefined)
	})

	await t.test('should overwrite a chats.update event with a history event', async() => {
		const chatId = randomJid()
		let chatRecv: Chat | undefined

		ev.on('messaging-history.set', ({ chats }) => {
			chatRecv = chats[0]
		})
		ev.on('chats.update', () => fail(new Error('not should have emitted')))

		ev.buffer()

		ev.emit('messaging-history.set', {
			chats: [{ id: chatId, conversationTimestamp: 123, unreadCount: 1 }],
			messages: [],
			contacts: [],
			isLatest: true
		})
		ev.emit('chats.update', [{ id: chatId, archived: true }])

		ev.flush()

		assert.strictEqual(chatRecv?.archived, true)
		assert.strictEqual(chatRecv?.id, chatId)
	})

	await t.test('should buffer message upsert events', async() => {
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
			assert.strictEqual(c.type, 'notify')
		})

		ev.buffer()
		ev.emit('messages.upsert', { messages: [proto.WebMessageInfo.fromObject(msg)], type: 'notify' })

		msg.messageTimestamp = unixTimestampSeconds() + 1
		msg.messageStubType = undefined
		msg.message = { conversation: 'Test' }
		ev.emit('messages.upsert', { messages: [proto.WebMessageInfo.fromObject(msg)], type: 'notify' })
		ev.emit('messages.update', [{ key: msg.key, update: { status: WAMessageStatus.READ } }])

		ev.flush()

		assert.strictEqual(msgs.length, 1)
		assert.ok(msgs[0].message)
		assert.strictEqual(toNumber(msgs[0].messageTimestamp!), messageTimestamp)
		assert.strictEqual(msgs[0].status, WAMessageStatus.READ)
	})

	await t.test('should buffer a message receipt update', async() => {
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
		ev.on('message-receipt.update', () => fail(new Error('should not emit')))

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

		ev.flush()

		assert.strictEqual(msgs.length, 1)
		assert.strictEqual(msgs[0].userReceipt?.length, 1)
	})

	await t.test('should buffer multiple status updates', async() => {
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

		ev.flush()

		assert.strictEqual(msgs.length, 1)
		assert.strictEqual(msgs[0].update.status, WAMessageStatus.READ)
	})

	await t.test('should remove chat unread counter', async() => {
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

		ev.flush()

		assert.strictEqual(chats[0].unreadCount, undefined)
	})
})