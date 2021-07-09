import KeyedDB from "@adiwajshing/keyed-db"
import { Logger } from "pino"
import makeConnection from "../Connection"
import { BaileysEventEmitter, Chat, ConnectionState, Contact, WAMessage, WAMessageKey } from "../Types"

export const waChatKey = (pin: boolean) => ({
    key: (c: Chat) => (pin ? (c.pin ? '1' : '0') : '') + (c.archive === 'true' ? '0' : '1') + c.t.toString(16).padStart(8, '0') + c.jid,
    compare: (k1: string, k2: string) => k2.localeCompare (k1)
})

export type BaileysInMemoryStoreConfig = {
	logger: Logger
}

export default(
	{ logger }: BaileysInMemoryStoreConfig
) => {
	const chats = new KeyedDB<Chat, string>(waChatKey(true), c => c.jid)
	const messages: { [_: string]: WAMessage[] } = {}
	const contacts: { [_: string]: Contact } = {}
	const state: ConnectionState = {
		connection: 'close',
		phoneConnected: false
	}

	const messageIndex = (key: WAMessageKey) => {
		const messageList = messages[key.remoteJid!]
		if(messageList) {
			const idx = messageList.findIndex(m => m.key.id === key.id)
			if(idx >= 0) {
				return { messageList, idx }
			}
		}
	}

	const listen = (ev: BaileysEventEmitter) => {
		ev.on('connection.update', update => {
			Object.assign(state, update)
		})
		ev.on('contacts.upsert', ({ contacts: newContacts, type }) => {
			const oldContacts = new Set(Object.keys(contacts))
			for(const contact of newContacts) {
				oldContacts.delete(contact.jid)
				contacts[contact.jid] = Object.assign(
					contacts[contact.jid] || {}, 
					contact
				)
			}
			if(type === 'set') {
				for(const jid of oldContacts) {
					delete contacts[jid]
				}
				logger.debug({ deletedContacts: oldContacts.size }, 'synced contacts')
			}
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
		ev.on('chats.upsert', ({ chats: newChats, type }) => {
			if(type === 'set') {
				chats.clear()
			}
			for(const chat of newChats) {
				chats.upsert(chat)
			}
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
						const result = messageIndex(newMessages[0].key)
						if(!result) {
							if(!messages[jid]) {
								messages[jid] = []
							}
							messages[jid].push(msg)
						} else {
							result.messageList[result.idx] = msg
						}
					}
				break
				case 'last':
					for(const msg of newMessages) {
						const jid = msg.key.remoteJid!
						if(!messages[jid]) {
							messages[jid] = []
						}
						const [lastItem] = messages[jid].slice(-1)
						// reset message list
						if(lastItem && lastItem.key.id !== msg.key.id) {
							messages[jid] = [msg]
						}
					}
				break
				case 'prepend':

				break
			}
		})
		ev.on('messages.update', updates => {
			for(const update of updates) {
				const result = messageIndex(update.key!)
				if(result) {
					Object.assign(result.messageList[result.idx], update)
				} else {
					logger.debug({ update }, `got update for non-existant message`)
				}
			}
		})
		ev.on('messages.delete', item => {
			if('all' in item) {
				messages[item.jid] = []
			} else {
				const idSet = new Set(item.ids)
				if(messages[item.jid]) {
					messages[item.jid] = messages[item.jid].filter(
						m => !idSet.has(m.key.id)
					)
				}
			}
		})
	}

	return {
		chats,
		contacts,
		messages,
		listen,
		fetchImageUrl: async(jid: string, sock: ReturnType<typeof makeConnection>) => {
			const contact = contacts[jid]
			if(!contact) {
				return sock.fetchImageUrl(jid)
			}
			if(!contact.imgUrl) {
				contact.imgUrl = await sock.fetchImageUrl(jid)
			}
			return contact.imgUrl
		}
	}
}