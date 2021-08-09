import type KeyedDB from "@adiwajshing/keyed-db"
import type { Comparable } from "@adiwajshing/keyed-db/lib/Types"
import type { Logger } from "pino"
import type { Connection } from "../Connection"
import type { BaileysEventEmitter, Chat, ConnectionState, Contact, GroupMetadata, MessageInfo, WAMessage, WAMessageCursor, WAMessageKey } from "../Types"
import { toNumber } from "../Utils"
import makeOrderedDictionary from "./ordered-dictionary"

export const waChatKey = (pin: boolean) => ({
    key: (c: Chat) => (pin ? (c.pin ? '1' : '0') : '') + (c.archive === 'true' ? '0' : '1') + c.t.toString(16).padStart(8, '0') + c.jid,
    compare: (k1: string, k2: string) => k2.localeCompare (k1)
})

export const waMessageID = (m: WAMessage) => m.key.id

export type BaileysInMemoryStoreConfig = {
	chatKey: Comparable<Chat, string>
	logger: Logger
}

const makeMessagesDictionary = () => makeOrderedDictionary(waMessageID)

export default(
	{ logger, chatKey }: BaileysInMemoryStoreConfig
) => {
	const KeyedDBConstructor = require('@adiwajshing/keyed-db').default as new (...args: any[]) => KeyedDB<Chat, string>
	const chats = new KeyedDBConstructor(chatKey, c => c.jid)
	const messages: { [_: string]: ReturnType<typeof makeMessagesDictionary> } = {}
	const contacts: { [_: string]: Contact } = {}
	const groupMetadata: { [_: string]: GroupMetadata } = {}
	const messageInfos: { [id: string]: MessageInfo } = { }
	const state: ConnectionState = {
		connection: 'close',
		phoneConnected: false
	}

	const assertMessageList = (jid: string) => {
		if(!messages[jid]) messages[jid] = makeMessagesDictionary()
		return messages[jid]
	}

	const listen = (ev: BaileysEventEmitter) => {

		const contactsUpsert = (newContacts: Contact[]) => {
			const oldContacts = new Set(Object.keys(contacts))
			for(const contact of newContacts) {
				oldContacts.delete(contact.jid)
				contacts[contact.jid] = Object.assign(
					contacts[contact.jid] || {}, 
					contact
				)
			}
			return oldContacts
		}
		
		ev.on('connection.update', update => {
			Object.assign(state, update)
		})
		ev.on('contacts.set', ({ contacts: newContacts }) => {
			const oldContacts = contactsUpsert(newContacts)
			for(const jid of oldContacts) {
				delete contacts[jid]
			}
			logger.debug({ deletedContacts: oldContacts.size }, 'synced contacts')
		})
		ev.on('contacts.update', updates => {
			for(const update of updates) {
				if(contacts[update.jid!]) {
					Object.assign(contacts[update.jid!], update)
				} else {
					logger.debug({ update }, `got update for non-existant contact`)
				}
			}
		})
		ev.on('chats.upsert', newChats => {
			chats.upsert(...newChats)
		})
		ev.on('chats.set', ({ chats: newChats }) => {
			chats.upsert(...newChats)
		})
		ev.on('chats.update', updates => {
			for(const update of updates) {
				const result = chats.update(update.jid!, chat => {
					Object.assign(chat, update)
				})
				if(!result) {
					logger.debug({ update }, `got update for non-existant chat`)
				}
			}
		})
		ev.on('chats.delete', deletions => {
			for(const item of deletions) {
				chats.deleteById(item)
			}
		})
		ev.on('messages.upsert', ({ messages: newMessages, type }) => {
			switch(type) {
				case 'append':
				case 'notify':
					for(const msg of newMessages) {
						const jid = msg.key.remoteJid!
						const list = assertMessageList(jid)
						list.upsert(msg, 'append')

						if(type === 'notify') {
							if(!chats.get(jid)) {
								ev.emit('chats.upsert', [ 
									{ jid, t: toNumber(msg.messageTimestamp), count: 1 } 
								])
							}
							// add message infos if required
							messageInfos[msg.key.id!] = messageInfos[msg.key.id!] || { reads: {}, deliveries: {} }
						}
					}
				break
				case 'last':
					logger.info('recv last message on all chats')
					for(const msg of newMessages) {
						const jid = msg.key.remoteJid!
						const list = assertMessageList(jid)
						const [lastItem] = list.array.slice(-1)
						// reset message list
						if(lastItem?.key.id !== msg.key.id) {
							list.clear()
							list.upsert(msg, 'append')
						}
					}
				break
				case 'prepend':
					for(const msg of newMessages) {
						const jid = msg.key.remoteJid!
						const list = assertMessageList(jid)
						list.upsert(msg, 'prepend')
					}
				break
			}
		})
		ev.on('messages.update', updates => {
			for(const { update, key } of updates) {
				const list = assertMessageList(key.remoteJid)
				const result = list.updateAssign(key.id, update)
				if(!result) {
					logger.debug({ update }, `got update for non-existent message`)
				}
			}
		})
		ev.on('messages.delete', item => {
			const list = assertMessageList(item.jid)
			if('all' in item) {
				list.clear()
			} else {
				const idSet = new Set(item.ids)
				list.filter(m => !idSet.has(m.key.id))
			}
		})

		ev.on('groups.update', updates => {
			for(const update of updates) {
				if(groupMetadata[update.id]) {
					Object.assign(groupMetadata[update.id!], update)
				} else {
					logger.debug({ update }, `got update for non-existant group metadata`)
				}
			}
		})

		ev.on('group-participants.update', ({ jid, participants, action }) => {
			const metadata = groupMetadata[jid]
			if(metadata) {
				switch(action) {
					case 'add':
						metadata.participants.push(...participants.map(jid => ({ jid, isAdmin: false, isSuperAdmin: false })))
						break
					case 'demote':
					case 'promote':
						for(const participant of metadata.participants) {
							if(participants.includes(participant.jid)) {
								participant.isAdmin = action === 'promote'
							}
						}
						break
					case 'remove':
						metadata.participants = metadata.participants.filter(p => !participants.includes(p.jid))
						break
				}
			}
		})

		ev.on('message-info.update', updates => {
			for(const { key, update } of updates) {
				const obj = messageInfos[key.id!]
				if(obj) {
					// add reads/deliveries
					for(const key in update) {
						Object.assign(obj[key], update[key])
					}
				}
			}
		})
	}


	return {
		chats,
		contacts,
		messages,
		groupMetadata,
		messageInfos,
		state,
		listen,
		loadMessages: async(jid: string, count: number, cursor: WAMessageCursor, sock: Connection | undefined) => {
			const list = assertMessageList(jid)
			const retrieve = async(count: number, cursor: WAMessageCursor) => {
				const result = await sock?.fetchMessagesFromWA(jid, count, cursor)
				return result || []
			}
			const mode = !cursor || 'before' in cursor ? 'before' : 'after'
			const cursorKey = !!cursor ? ('before' in cursor ? cursor.before : cursor.after) : undefined
			const cursorValue = cursorKey ? list.get(cursorKey.id) : undefined
			
			let messages: WAMessage[]
			if(list && mode === 'before' && (!cursorKey || cursorValue)) {
				if(cursorValue) {
					const msgIdx = list.array.findIndex(m => m.key.id === cursorKey.id)
					messages = list.array.slice(0, msgIdx)
				} else {
					messages = list.array
				}
				const diff = count - messages.length
				if (diff < 0) {
					messages = messages.slice(-count) // get the last X messages
				} else if (diff > 0) {
					const [fMessage] = messages
					const cursor = { before: fMessage?.key || cursorKey }
					const extra = await retrieve (diff, cursor)
					// add to DB
					for(let i = extra.length-1; i >= 0;i--) {
						list.upsert(extra[i], 'prepend')
					}
					messages.splice(0, 0, ...extra)
				}
			} else messages = await retrieve(count, cursor)

			return messages
		},
		loadMessage: async(jid: string, id: string, sock: Connection | undefined) => {
			let message = messages[jid]?.get(id)
			if(!message) {
				message = await sock?.loadMessageFromWA(jid, id)
			}
			return message
		},
		mostRecentMessage: async(jid: string, sock: Connection | undefined) => {
			let message = messages[jid]?.array.slice(-1)[0]
			if(!message) {
				const [result] = await sock?.fetchMessagesFromWA(jid, 1, undefined)
				message = result
			}
			return message
		},
		fetchImageUrl: async(jid: string, sock: Connection | undefined) => {
			const contact = contacts[jid]
			if(!contact) {
				return sock?.fetchImageUrl(jid)
			}
			if(typeof contact.imgUrl === 'undefined') {
				contact.imgUrl = await sock?.fetchImageUrl(jid)
			}
			return contact.imgUrl
		},
		fetchGroupMetadata: async(jid: string, sock: Connection | undefined) => {
			if(!groupMetadata[jid]) {
				groupMetadata[jid] = await sock?.groupMetadata(jid, chats.get(jid)?.read_only === 'true')
			}
			return groupMetadata[jid]
		},
		fetchBroadcastListInfo: async(jid: string, sock: Connection | undefined) => {
			if(!groupMetadata[jid]) {
				groupMetadata[jid] = await sock?.getBroadcastListInfo(jid)
			}
			return groupMetadata[jid]
		},
		fetchMessageInfo: async({remoteJid, id}: WAMessageKey, sock: Connection | undefined) => {
			if(!messageInfos[id!]) {
				messageInfos[id!] = await sock?.messageInfo(remoteJid, id)
			}
			return messageInfos[id!]
		}
	}
}