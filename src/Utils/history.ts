import { AxiosRequestConfig } from 'axios'
import { promisify } from 'util'
import { inflate } from 'zlib'
import { Chat, Contact, WAMessageStubType, WAProto } from '../Types'
import { isJidUser } from '../WABinary'
import { toNumber } from './generics'
import { normalizeMessageContent } from './messages'
import { downloadContentFromMessage } from './messages-media'
import { readBinaryNode } from './proto-utils'

const inflatePromise = promisify(inflate)

export const downloadHistory = async(
	msg: WAProto.MessageHistorySyncNotification,
	options: AxiosRequestConfig<any>
) => {
	const stream = await downloadContentFromMessage(msg, 'md-msg-hist', { options })
	const bufferArray: Buffer[] = []
	for await (const chunk of stream) {
		bufferArray.push(chunk)
	}

	let buffer = Buffer.concat(bufferArray)

	// decompress buffer
	buffer = await inflatePromise(buffer)

	const syncData = readBinaryNode(WAProto.readHistorySync, buffer)
	return syncData
}

export const processHistoryMessage = (item: WAProto.HistorySync) => {
	const messages: WAProto.WebMessageInfo[] = []
	const contacts: Contact[] = []
	const chats: Chat[] = []

	switch (item.syncType) {
	case WAProto.HistorySyncHistorySyncType.INITIAL_BOOTSTRAP:
	case WAProto.HistorySyncHistorySyncType.RECENT:
	case WAProto.HistorySyncHistorySyncType.FULL:
	case WAProto.HistorySyncHistorySyncType.ON_DEMAND:
		for(const chat of item.conversations! as Chat[]) {
			contacts.push({ id: chat.id, name: chat.name || undefined })

			const msgs = chat.messages || []
			delete chat.messages
			delete chat.archived
			delete chat.muteEndTime
			delete chat.pinned

			for(const item of msgs) {
				const message = item.message!
				messages.push(message)

				if(!chat.messages?.length) {
					// keep only the most recent message in the chat array
					chat.messages = [{ message }]
				}

				if(!message.key.fromMe && !chat.lastMessageRecvTimestamp) {
					chat.lastMessageRecvTimestamp = toNumber(message.messageTimestamp)
				}

				if(
					(message.messageStubType === WAMessageStubType.BIZ_PRIVACY_MODE_TO_BSP
					|| message.messageStubType === WAMessageStubType.BIZ_PRIVACY_MODE_TO_FB
					)
					&& message.messageStubParameters?.[0]
				) {
					contacts.push({
						id: message.key.participant || message.key.remoteJid!,
						verifiedName: message.messageStubParameters?.[0],
					})
				}
			}

			if(isJidUser(chat.id) && chat.readOnly && chat.archived) {
				delete chat.readOnly
			}

			chats.push({ ...chat })
		}

		break
	case WAProto.HistorySyncHistorySyncType.PUSH_NAME:
		for(const c of item.pushnames!) {
			contacts.push({ id: c.id!, notify: c.pushname! })
		}

		break
	}

	return {
		chats,
		contacts,
		messages,
		syncType: item.syncType,
		progress: item.progress,
	}
}

export const downloadAndProcessHistorySyncNotification = async(
	msg: WAProto.MessageHistorySyncNotification,
	options: AxiosRequestConfig<any>
) => {
	const historyMsg = await downloadHistory(msg, options)
	return processHistoryMessage(historyMsg)
}

export const getHistoryMsg = (message: WAProto.Message) => {
	const normalizedContent = !!message ? normalizeMessageContent(message) : undefined
	const anyHistoryMsg = normalizedContent?.protocolMessage?.historySyncNotification

	return anyHistoryMsg
}