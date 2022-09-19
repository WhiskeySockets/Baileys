import EventEmitter from 'events'
import { Logger } from 'pino'
import { proto } from '../../WAProto'
import { BaileysEvent, BaileysEventEmitter, BaileysEventMap, BufferedEventData, Chat, Contact, WAMessage, WAMessageStatus } from '../Types'
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

/**
 * A map that contains a list of all events that have been triggered
 *
 * Note, this can contain different type of events
 * this can make processing events extremely efficient -- since everything
 * can be done in a single transaction
 */
type BaileysEventData = Partial<BaileysEventMap>

const BUFFERABLE_EVENT_SET = new Set<BaileysEvent>(BUFFERABLE_EVENT)

type BaileysBufferableEventEmitter = BaileysEventEmitter & {
	/** Use to process events in a batch */
	process(handler: (events: BaileysEventData) => void | Promise<void>): (() => void)
	/**
	 * starts buffering events, call flush() to release them
	 * @returns true if buffering just started, false if it was already buffering
	 * */
	buffer(): boolean
	/** buffers all events till the promise completes */
	createBufferedFunction<A extends any[], T>(work: (...args: A) => Promise<T>): ((...args: A) => Promise<T>)
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
export const makeEventBuffer = (logger: Logger): BaileysBufferableEventEmitter => {
	const ev = new EventEmitter()

	let data = makeBufferData()
	let isBuffering = false

	let preBufferTask: Promise<any> = Promise.resolve()

	// take the generic event and fire it as a baileys event
	ev.on('event', (map: BaileysEventData) => {
		for(const event in map) {
			ev.emit(event, map[event])
		}
	})

	function buffer() {
		if(!isBuffering) {
			logger.trace('buffering events')
			isBuffering = true
			return true
		}

		return false
	}

	async function flush() {
		if(!isBuffering) {
			return
		}

		logger.trace('releasing buffered events...')
		await preBufferTask

		isBuffering = false

		const consolidatedData = consolidateEvents(data)
		if(Object.keys(consolidatedData).length) {
			ev.emit('event', consolidatedData)
		}

		data = makeBufferData()

		logger.trace('released buffered events')
	}

	return {
		process(handler) {
			const listener = (map: BaileysEventData) => {
				handler(map)
			}

			ev.on('event', listener)
			return () => {
				ev.off('event', listener)
			}
		},
		emit<T extends BaileysEvent>(event: BaileysEvent, evData: BaileysEventMap[T]) {
			if(isBuffering && BUFFERABLE_EVENT_SET.has(event)) {
				append(data, event as any, evData, logger)
				return true
			}

			return ev.emit('event', { [event]: evData })
		},
		processInBuffer(task) {
			if(isBuffering) {
				preBufferTask = Promise.allSettled([ preBufferTask, task ])
			}
		},
		buffer,
		flush,
		createBufferedFunction(work) {
			return async(...args) => {
				const started = buffer()
				try {
					const result = await work(...args)
					return result
				} finally {
					if(started) {
						await flush()
					}
				}
			}
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

			if(data.chatDeletes.has(chat.id)) {
				data.chatDeletes.delete(chat.id)
			}

			data.chatUpserts[chat.id] = upsert
		}

		break
	case 'chats.update':
		for(const update of eventData as Partial<Chat>[]) {
			const chatId = update.id!
			// if there is an existing upsert, merge the update into it
			const upsert = data.chatUpserts[chatId]
			if(upsert) {
				concatChats(upsert, update)
			} else {
				// merge the update into the existing update
				const chatUpdate = data.chatUpdates[chatId] || { }
				data.chatUpdates[chatId] = concatChats(chatUpdate, update)
			}

			// if the chat has been updated
			// ignore any existing chat delete
			if(data.chatDeletes.has(chatId)) {
				data.chatDeletes.delete(chatId)
			}
		}

		break
	case 'chats.delete':
		for(const chatId of eventData as string[]) {
			data.chatDeletes.add(chatId)
			// remove any prior updates & upserts
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
		const contactUpdates = eventData as BaileysEventMap['contacts.update']
		for(const update of contactUpdates) {
			const id = update.id!
			// merge into prior upsert
			const upsert = data.contactUpserts[update.id!]
			if(upsert) {
				Object.assign(upsert, update)
			} else {
				// merge into prior update
				const contactUpdate = data.contactUpdates[id] || { }
				data.contactUpdates[id] = Object.assign(contactUpdate, update)
			}
		}

		break
	case 'messages.upsert':
		const { messages, type } = eventData as BaileysEventMap['messages.upsert']
		for(const message of messages) {
			const key = stringifyMessageKey(message.key)
			const existing = data.messageUpserts[key]
			if(existing) {
				message.messageTimestamp = existing.message.messageTimestamp
			}

			if(data.messageUpdates[key]) {
				logger.debug('absorbed prior message update in message upsert')
				Object.assign(message, data.messageUpdates[key].update)
				delete data.messageUpdates[key]
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
		const msgUpdates = eventData as BaileysEventMap['messages.update']
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
		const deleteData = eventData as BaileysEventMap['messages.delete']
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
		const reactions = eventData as BaileysEventMap['messages.reaction']
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
		const receipts = eventData as BaileysEventMap['message-receipt.update']
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
		const groupUpdates = eventData as BaileysEventMap['groups.update']
		for(const update of groupUpdates) {
			const id = update.id!
			const groupUpdate = data.groupUpdates[id] || { }
			data.groupUpdates[id] = Object.assign(groupUpdate, update)
		}

		break
	default:
		throw new Error(`"${event}" cannot be buffered`)
	}

	function decrementChatReadCounterIfMsgDidUnread(message: WAMessage) {
		// decrement chat unread counter
		// if the message has already been marked read by us
		const chatId = message.key.remoteJid!
		const chat = data.chatUpdates[chatId] || data.chatUpserts[chatId]
		if(
			isRealMessage(message)
			&& shouldIncrementChatUnread(message)
			&& typeof chat?.unreadCount === 'number'
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

function consolidateEvents(data: BufferedEventData) {
	const map: BaileysEventData = { }

	const chatUpsertList = Object.values(data.chatUpserts)
	if(chatUpsertList.length) {
		map['chats.upsert'] = chatUpsertList
	}

	const chatUpdateList = Object.values(data.chatUpdates)
	if(chatUpdateList.length) {
		map['chats.update'] = chatUpdateList
	}

	const chatDeleteList = Array.from(data.chatDeletes)
	if(chatDeleteList.length) {
		map['chats.delete'] = chatDeleteList
	}

	const messageUpsertList = Object.values(data.messageUpserts)
	if(messageUpsertList.length) {
		const type = messageUpsertList[0].type
		map['messages.upsert'] = {
			messages: messageUpsertList.map(m => m.message),
			type
		}
	}

	const messageUpdateList = Object.values(data.messageUpdates)
	if(messageUpdateList.length) {
		map['messages.update'] = messageUpdateList
	}

	const messageDeleteList = Object.values(data.messageDeletes)
	if(messageDeleteList.length) {
		map['messages.delete'] = { keys: messageDeleteList }
	}

	const messageReactionList = Object.values(data.messageReactions).flatMap(
		({ key, reactions }) => reactions.flatMap(reaction => ({ key, reaction }))
	)
	if(messageReactionList.length) {
		map['messages.reaction'] = messageReactionList
	}

	const messageReceiptList = Object.values(data.messageReceipts).flatMap(
		({ key, userReceipt }) => userReceipt.flatMap(receipt => ({ key, receipt }))
	)
	if(messageReceiptList.length) {
		map['message-receipt.update'] = messageReceiptList
	}

	const contactUpsertList = Object.values(data.contactUpserts)
	if(contactUpsertList.length) {
		map['contacts.upsert'] = contactUpsertList
	}

	const contactUpdateList = Object.values(data.contactUpdates)
	if(contactUpdateList.length) {
		map['contacts.update'] = contactUpdateList
	}

	const groupUpdateList = Object.values(data.groupUpdates)
	if(groupUpdateList.length) {
		map['groups.update'] = groupUpdateList
	}

	return map
}

function concatChats<C extends Partial<Chat>>(a: C, b: C) {
	if(b.unreadCount === null) {
		// neutralize unread counter
		if(a.unreadCount! < 0) {
			a.unreadCount = undefined
			b.unreadCount = undefined
		}
	}

	if(typeof a.unreadCount === 'number' && typeof b.unreadCount === 'number') {
		b = { ...b }
		if(b.unreadCount! >= 0) {
			b.unreadCount = Math.max(b.unreadCount!, 0) + Math.max(a.unreadCount, 0)
		}
	}

	return Object.assign(a, b)
}

const stringifyMessageKey = (key: proto.IMessageKey) => `${key.remoteJid},${key.id},${key.fromMe ? '1' : '0'}`