import { Logger } from 'pino'
import { proto } from '../../WAProto'
import { AuthenticationCreds, BaileysEvent, BaileysEventEmitter, BaileysEventMap, BufferedEventData, Chat, Contact, WAMessage, WAMessageStatus } from '../Types'
import { updateMessageWithReaction, updateMessageWithReceipt } from './messages'
import { isRealMessage, shouldIncrementChatUnread } from './process-message'

const BUFFERABLE_EVENT = [
	'chats.upsert',
	'chats.update',
	'chats.delete',
	'contacts.upsert',
	'contacts.update',
	'messages.upsert',
	'messages.update',
	'messages.delete',
	'messages.reaction',
	'message-receipt.update',
	'groups.update',
] as const

type BufferableEvent = typeof BUFFERABLE_EVENT[number]

const BUFFERABLE_EVENT_SET = new Set<BaileysEvent>(BUFFERABLE_EVENT)

type BaileysBufferableEventEmitter = BaileysEventEmitter & {
	/**
	 * starts buffering events, call flush() to release them
	 * @returns true if buffering just started, false if it was already buffering
	 * */
	buffer(): boolean
	/** flushes all buffered events */
	flush(): Promise<void>
	/** waits for the task to complete, before releasing the buffer */
	processInBuffer(task: Promise<any>)
}

/**
 * The event buffer logically consolidates different events into a single event
 * making the data processing more efficient.
 * @param ev the baileys event emitter
 */
export const makeEventBuffer = (
	ev: BaileysEventEmitter,
	logger: Logger
): BaileysBufferableEventEmitter => {

	let data = makeBufferData()
	let isBuffering = false

	let preBufferTask: Promise<any> = Promise.resolve()

	return {
		emit<T extends BaileysEvent>(event: BaileysEvent, evData: BaileysEventMap<AuthenticationCreds>[T]) {
			if(isBuffering && BUFFERABLE_EVENT_SET.has(event)) {
				append(data, event as any, evData, logger)
				return true
			}

			return ev.emit(event, evData)
		},
		processInBuffer(task) {
			if(isBuffering) {
				preBufferTask = Promise.allSettled([ preBufferTask, task ])
			}
		},
		buffer() {
			if(!isBuffering) {
				logger.trace('buffering events')
				isBuffering = true
				return true
			}
		},
		async flush() {
			if(!isBuffering) {
				return
			}

			logger.trace('releasing buffered events...')
			await preBufferTask

			isBuffering = false
			flush(data, ev)
			data = makeBufferData()

			logger.trace('released buffered events')
		},
		on: (...args) => ev.on(...args),
		off: (...args) => ev.off(...args),
		removeAllListeners: (...args) => ev.removeAllListeners(...args),
	}
}

const makeBufferData = (): BufferedEventData => {
	return {
		chatUpserts: { },
		chatUpdates: { },
		chatDeletes: new Set(),
		contactUpserts: { },
		contactUpdates: { },
		messageUpserts: { },
		messageUpdates: { },
		messageReactions: { },
		messageDeletes: { },
		messageReceipts: { },
		groupUpdates: { }
	}
}

function append<E extends BufferableEvent>(
	data: BufferedEventData,
	event: E,
	eventData: any,
	logger: Logger
) {
	switch (event) {
	case 'chats.upsert':
		for(const chat of eventData as Chat[]) {
			let upsert = data.chatUpserts[chat.id] || { } as Chat
			upsert = concatChats(upsert, chat)
			if(data.chatUpdates[chat.id]) {
				logger.debug({ chatId: chat.id }, 'absorbed chat update in chat upsert')
				upsert = concatChats(data.chatUpdates[chat.id] as Chat, upsert)
				delete data.chatUpdates[chat.id]
			}

			data.chatUpserts[chat.id] = upsert
		}

		break
	case 'chats.update':
		for(const update of eventData as Partial<Chat>[]) {
			const upsert = data.chatUpserts[update.id!]
			if(upsert) {
				concatChats(upsert, update)
			} else {
				const chatUpdate = data.chatUpdates[update.id] || { }
				data.chatUpdates[update.id] = concatChats(chatUpdate, update)
			}
		}

		break
	case 'chats.delete':
		for(const chatId of eventData as string[]) {
			data.chatDeletes.add(chatId)
			if(data.chatUpdates[chatId]) {
				delete data.chatUpdates[chatId]
			}

			if(data.chatUpserts[chatId]) {
				delete data.chatUpserts[chatId]
			}
		}

		break
	case 'contacts.upsert':
		for(const contact of eventData as Contact[]) {
			let upsert = data.contactUpserts[contact.id] || { } as Contact
			upsert = Object.assign(upsert, contact)
			if(data.contactUpdates[contact.id]) {
				upsert = Object.assign(data.contactUpdates[contact.id], upsert)
				delete data.contactUpdates[contact.id]
			}

			data.contactUpserts[contact.id] = upsert
		}

		break
	case 'contacts.update':
		const contactUpdates = eventData as BaileysEventMap<any>['contacts.update']
		for(const update of contactUpdates) {
			const upsert = data.contactUpserts[update.id!]
			if(upsert) {
				Object.assign(upsert, update)
			} else {
				const contactUpdate = data.contactUpdates[update.id] || { }
				data.contactUpdates[update.id] = Object.assign(contactUpdate, update)
			}
		}

		break
	case 'messages.upsert':
		const { messages, type } = eventData as BaileysEventMap<any>['messages.upsert']
		for(const message of messages) {
			const key = stringifyMessageKey(message.key)
			const existing = data.messageUpserts[key]
			if(existing) {
				message.messageTimestamp = existing.message.messageTimestamp
			}

			data.messageUpserts[key] = {
				message,
				type: type === 'notify' || existing?.type === 'notify'
					? 'notify'
					: type
			}
		}

		break
	case 'messages.update':
		const msgUpdates = eventData as BaileysEventMap<any>['messages.update']
		for(const { key, update } of msgUpdates) {
			const keyStr = stringifyMessageKey(key)
			const existing = data.messageUpserts[keyStr]
			if(existing) {
				Object.assign(existing.message, update)
				// if the message was received & read by us
				// the chat counter must have been incremented
				// so we need to decrement it
				if(update.status === WAMessageStatus.READ && !key.fromMe) {
					decrementChatReadCounterIfMsgDidUnread(existing.message)
				}
			} else {
				const msgUpdate = data.messageUpdates[keyStr] || { key, update: { } }
				Object.assign(msgUpdate.update, update)
				data.messageUpdates[keyStr] = msgUpdate
			}
		}

		break
	case 'messages.delete':
		const deleteData = eventData as BaileysEventMap<any>['messages.delete']
		if('keys' in deleteData) {
			const { keys } = deleteData
			for(const key of keys) {
				const keyStr = stringifyMessageKey(key)
				data.messageDeletes[keyStr] = key

				if(data.messageUpserts[keyStr]) {
					delete data.messageUpserts[keyStr]
				}

				if(data.messageUpdates[keyStr]) {
					delete data.messageUpdates[keyStr]
				}
			}
		} else {
			// TODO: add support
		}

		break
	case 'messages.reaction':
		const reactions = eventData as BaileysEventMap<any>['messages.reaction']
		for(const { key, reaction } of reactions) {
			const keyStr = stringifyMessageKey(key)
			const existing = data.messageUpserts[keyStr]
			if(existing) {
				updateMessageWithReaction(existing.message, reaction)
			} else {
				data.messageReactions[keyStr] = data.messageReactions[keyStr]
					|| { key, reactions: [] }
				updateMessageWithReaction(data.messageReactions[keyStr], reaction)
			}
		}

		break
	case 'message-receipt.update':
		const receipts = eventData as BaileysEventMap<any>['message-receipt.update']
		for(const { key, receipt } of receipts) {
			const keyStr = stringifyMessageKey(key)
			const existing = data.messageUpserts[keyStr]
			if(existing) {
				updateMessageWithReceipt(existing.message, receipt)
			} else {
				data.messageReceipts[keyStr] = data.messageReceipts[keyStr]
					|| { key, userReceipt: [] }
				updateMessageWithReceipt(data.messageReceipts[keyStr], receipt)
			}
		}

		break
	case 'groups.update':
		const groupUpdates = eventData as BaileysEventMap<any>['groups.update']
		for(const update of groupUpdates) {
			const groupUpdate = data.groupUpdates[update.id] || { }
			data.groupUpdates[update.id] = Object.assign(groupUpdate, update)
		}

		break
	default:
		throw new Error(`"${event}" cannot be buffered`)
	}

	function decrementChatReadCounterIfMsgDidUnread(message: WAMessage) {
		// decrement chat unread counter
		// if the message has already been marked read by us
		const chatId = message.key.remoteJid
		const chat = data.chatUpdates[chatId] || data.chatUpserts[chatId]
		if(
			isRealMessage(message, false)
			&& shouldIncrementChatUnread(message)
			&& typeof chat.unreadCount !== 'undefined'
			&& chat.unreadCount > 0
		) {
			logger.debug({ chatId: chat.id }, 'decrementing chat counter')
			chat.unreadCount -= 1
			if(chat.unreadCount === 0) {
				delete chat.unreadCount
			}
		}
	}
}

function flush(data: BufferedEventData, ev: BaileysEventEmitter) {
	const chatUpsertList = Object.values(data.chatUpserts)
	chatUpsertList.length && ev.emit('chats.upsert', chatUpsertList)

	const chatUpdateList = Object.values(data.chatUpdates)
	chatUpdateList.length && ev.emit('chats.update', chatUpdateList)

	const chatDeleteList = Array.from(data.chatDeletes)
	chatDeleteList.length && ev.emit('chats.delete', chatDeleteList)

	const messageUpsertList = Object.values(data.messageUpserts)
	if(messageUpsertList.length) {
		const appends: WAMessage[] = []
		const notifys: WAMessage[] = []
		for(const { message, type } of messageUpsertList) {
			const arr = type === 'append' ? appends : notifys
			arr.push(message)
		}

		if(appends.length) {
			ev.emit('messages.upsert', { type: 'append', messages: appends })
		}

		if(notifys.length) {
			ev.emit('messages.upsert', { type: 'notify', messages: notifys })
		}
	}

	const messageUpdateList = Object.values(data.messageUpdates)
	messageUpdateList.length && ev.emit('messages.update', messageUpdateList)

	const messageDeleteList = Object.values(data.messageDeletes)
	messageDeleteList.length && ev.emit('messages.delete', { keys: messageDeleteList })

	const messageReactionList = Object.values(data.messageReactions).flatMap(
		({ key, reactions }) => reactions.flatMap(reaction => ({ key, reaction }))
	)
	messageReactionList.length && ev.emit('messages.reaction', messageReactionList)

	const messageReceiptList = Object.values(data.messageReceipts).flatMap(
		({ key, userReceipt }) => userReceipt.flatMap(receipt => ({ key, receipt }))
	)
	messageReceiptList.length && ev.emit('message-receipt.update', messageReceiptList)

	const contactUpsertList = Object.values(data.contactUpserts)
	contactUpsertList.length && ev.emit('contacts.upsert', contactUpsertList)

	const contactUpdateList = Object.values(data.contactUpdates)
	contactUpdateList.length && ev.emit('contacts.update', contactUpdateList)

	const groupUpdateList = Object.values(data.groupUpdates)
	groupUpdateList.length && ev.emit('groups.update', groupUpdateList)
}

function concatChats<C extends Partial<Chat>>(a: C, b: C) {
	if(b.unreadCount === null) {
		// neutralize unread counter
		if(a.unreadCount < 0) {
			a.unreadCount = undefined
			b.unreadCount = undefined
		}
	}

	if(typeof a.unreadCount !== 'undefined' && typeof b.unreadCount !== 'undefined') {
		b = { ...b }
		if(b.unreadCount >= 0) {
			b.unreadCount = Math.max(b.unreadCount, 0) + Math.max(a.unreadCount, 0)
		}
	}

	return Object.assign(a, b)
}

const stringifyMessageKey = (key: proto.IMessageKey) => `${key.remoteJid},${key.id},${key.fromMe ? '1' : '0'}`