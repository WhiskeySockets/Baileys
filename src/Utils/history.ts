import { promisify } from 'util'
import { inflate } from 'zlib'
import { proto } from '../../WAProto'
import { Chat, Contact } from '../Types'
import { downloadContentFromMessage } from './messages-media'

const inflatePromise = promisify(inflate)

export const downloadHistory = async(msg: proto.IHistorySyncNotification) => {
	const stream = await downloadContentFromMessage(msg, 'history')
	let buffer = Buffer.from([])
	for await (const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk])
	}

	// decompress buffer
	buffer = await inflatePromise(buffer)

	const syncData = proto.HistorySync.decode(buffer)
	return syncData
}

export const processHistoryMessage = (item: proto.IHistorySync, historyCache: Set<string>) => {
	const isLatest = historyCache.size === 0
	const messages: proto.IWebMessageInfo[] = []
	const contacts: Contact[] = []
	const chats: Chat[] = []
	switch (item.syncType) {
	case proto.HistorySync.HistorySyncHistorySyncType.INITIAL_BOOTSTRAP:
	case proto.HistorySync.HistorySyncHistorySyncType.RECENT:
		for(const chat of item.conversations) {
			const contactId = `c:${chat.id}`
			if(chat.name && !historyCache.has(contactId)) {
				contacts.push({
					id: chat.id,
					name: chat.name
				})
				historyCache.add(contactId)
			}

			for(const { message } of chat.messages || []) {
				const uqId = `${message?.key.remoteJid}:${message.key.id}`
				if(message && !historyCache.has(uqId)) {
					messages.push(message)
					historyCache.add(uqId)
				}
			}

			delete chat.messages
			if(!historyCache.has(chat.id)) {
				chats.push(chat)
				historyCache.add(chat.id)
			}
		}

		break
	case proto.HistorySync.HistorySyncHistorySyncType.PUSH_NAME:
		for(const c of item.pushnames) {
			const contactId = `c:${c.id}`
			if(historyCache.has(contactId)) {
				contacts.push({ notify: c.pushname, id: c.id })
				historyCache.add(contactId)
			}
		}

		break
	case proto.HistorySync.HistorySyncHistorySyncType.INITIAL_STATUS_V3:
		// TODO
		break
	}

	return {
		chats,
		contacts,
		messages,
		isLatest,
	}
}

export const downloadAndProcessHistorySyncNotification = async(msg: proto.IHistorySyncNotification, historyCache: Set<string>) => {
	const historyMsg = await downloadHistory(msg)
	return processHistoryMessage(historyMsg, historyCache)
}