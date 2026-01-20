import { promisify } from 'util'
import { inflate } from 'zlib'
import { proto } from '../../WAProto/index.js'
import type { Chat, Contact, LIDMapping, WAMessage } from '../Types'
import { WAMessageStubType } from '../Types'
import { toNumber } from './generics'
import { normalizeMessageContent } from './messages'
import { downloadContentFromMessage } from './messages-media'
import {
	isHostedLidUser,
	isHostedPnUser,
	isLidUser,
	isPnUser,
	jidNormalizedUser
} from '../WABinary/index.js'

const inflatePromise = promisify(inflate)

/**
 * Downloads and decompresses history sync data from WhatsApp servers.
 *
 * @param msg - The history sync notification message containing download info
 * @param options - Request options for the download
 * @returns Decoded HistorySync protocol buffer
 */
export const downloadHistory = async (msg: proto.Message.IHistorySyncNotification, options: RequestInit) => {
	const stream = await downloadContentFromMessage(msg, 'md-msg-hist', { options })
	const bufferArray: Buffer[] = []
	for await (const chunk of stream) {
		bufferArray.push(chunk)
	}

	let buffer: Buffer = Buffer.concat(bufferArray)

	// decompress buffer
	buffer = await inflatePromise(buffer)

	const syncData = proto.HistorySync.decode(buffer)
	return syncData
}

/**
 * Extracts LID-PN mapping from a conversation object.
 *
 * WhatsApp uses two identifier systems:
 * - LID (Logical ID): Format `{number}@lid` or `{number}@hosted.lid`
 * - PN (Phone Number): Format `{number}@s.whatsapp.net` or `{number}@hosted`
 *
 * Conversations may have their ID in either format, with the alternate
 * format stored in `lidJid` or `pnJid` properties respectively.
 *
 * @param chatId - The conversation ID (may be LID or PN format)
 * @param lidJid - The LID JID if chat ID is PN format
 * @param pnJid - The PN JID if chat ID is LID format
 * @returns LID-PN mapping if extractable, undefined otherwise
 *
 * @example
 * // Chat ID is LID, pnJid contains phone number
 * extractLidPnFromConversation('123456789@lid', undefined, '5511999999999@s.whatsapp.net')
 * // Returns: { lid: '123456789@lid', pn: '5511999999999@s.whatsapp.net' }
 *
 * @example
 * // Chat ID is PN, lidJid contains LID
 * extractLidPnFromConversation('5511999999999@s.whatsapp.net', '123456789@lid', undefined)
 * // Returns: { lid: '123456789@lid', pn: '5511999999999@s.whatsapp.net' }
 */
export function extractLidPnFromConversation(
	chatId: string,
	lidJid: string | undefined | null,
	pnJid: string | undefined | null
): LIDMapping | undefined {
	// Check if chat ID is in LID format
	const chatIsLid = isLidUser(chatId) || isHostedLidUser(chatId)
	// Check if chat ID is in PN format
	const chatIsPn = isPnUser(chatId) || isHostedPnUser(chatId)

	if (chatIsLid && pnJid) {
		// Chat ID is LID, pnJid contains the phone number
		return {
			lid: jidNormalizedUser(chatId),
			pn: jidNormalizedUser(pnJid)
		}
	}

	if (chatIsPn && lidJid) {
		// Chat ID is PN, lidJid contains the LID
		return {
			lid: jidNormalizedUser(lidJid),
			pn: jidNormalizedUser(chatId)
		}
	}

	return undefined
}

/**
 * Processes a history sync message and extracts chats, contacts, messages,
 * and LID-PN mappings.
 *
 * LID-PN mappings are extracted from two sources:
 * 1. Top-level `phoneNumberToLidMappings` array in the history sync payload
 * 2. Individual conversation objects that contain both LID and PN identifiers
 *
 * This dual extraction ensures maximum mapping coverage, as WhatsApp may
 * provide mappings in either or both locations depending on the sync type.
 *
 * @param item - The history sync protocol buffer to process
 * @returns Processed data including chats, contacts, messages, and LID-PN mappings
 *
 * @see https://github.com/WhiskeySockets/Baileys/issues/2263
 */
export const processHistoryMessage = (item: proto.IHistorySync) => {
	const messages: WAMessage[] = []
	const contacts: Contact[] = []
	const chats: Chat[] = []

	// Use Map for O(1) deduplication of LID-PN mappings
	const lidPnMap = new Map<string, LIDMapping>()

	/**
	 * Adds a LID-PN mapping to the map with deduplication.
	 * Uses LID as key since each LID should map to exactly one PN.
	 */
	const addLidPnMapping = (mapping: LIDMapping): void => {
		// Normalize and validate
		if (!mapping.lid || !mapping.pn) {
			return
		}
		lidPnMap.set(mapping.lid, mapping)
	}

	// Source 1: Extract from top-level phoneNumberToLidMappings array
	for (const m of item.phoneNumberToLidMappings || []) {
		if (m.lidJid && m.pnJid) {
			addLidPnMapping({
				lid: jidNormalizedUser(m.lidJid),
				pn: jidNormalizedUser(m.pnJid)
			})
		}
	}

	switch (item.syncType) {
		case proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP:
		case proto.HistorySync.HistorySyncType.RECENT:
		case proto.HistorySync.HistorySyncType.FULL:
		case proto.HistorySync.HistorySyncType.ON_DEMAND:
			for (const chat of item.conversations! as Chat[]) {
				const chatId = chat.id!

				// Source 2: Extract LID-PN mapping from conversation object
				// This handles cases where the mapping isn't in phoneNumberToLidMappings
				const conversationMapping = extractLidPnFromConversation(
					chatId,
					chat.lidJid,
					chat.pnJid
				)
				if (conversationMapping) {
					addLidPnMapping(conversationMapping)
				}

				contacts.push({
					id: chatId,
					name: chat.name || undefined,
					lid: chat.lidJid || undefined,
					phoneNumber: chat.pnJid || undefined
				})

				const msgs = chat.messages || []
				delete chat.messages

				for (const item of msgs) {
					const message = item.message! as WAMessage
					messages.push(message)

					if (!chat.messages?.length) {
						// keep only the most recent message in the chat array
						chat.messages = [{ message }]
					}

					if (!message.key.fromMe && !chat.lastMessageRecvTimestamp) {
						chat.lastMessageRecvTimestamp = toNumber(message.messageTimestamp)
					}

					if (
						(message.messageStubType === WAMessageStubType.BIZ_PRIVACY_MODE_TO_BSP ||
							message.messageStubType === WAMessageStubType.BIZ_PRIVACY_MODE_TO_FB) &&
						message.messageStubParameters?.[0]
					) {
						contacts.push({
							id: message.key.participant || message.key.remoteJid!,
							verifiedName: message.messageStubParameters?.[0]
						})
					}
				}

				chats.push({ ...chat })
			}

			break
		case proto.HistorySync.HistorySyncType.PUSH_NAME:
			for (const c of item.pushnames!) {
				contacts.push({ id: c.id!, notify: c.pushname! })
			}

			break
	}

	// Convert Map back to array for return
	const lidPnMappings = Array.from(lidPnMap.values())

	return {
		chats,
		contacts,
		messages,
		lidPnMappings,
		syncType: item.syncType,
		progress: item.progress
	}
}

/**
 * Downloads and processes a history sync notification in one step.
 *
 * @param msg - The history sync notification message
 * @param options - Request options for the download
 * @returns Processed history data
 */
export const downloadAndProcessHistorySyncNotification = async (
	msg: proto.Message.IHistorySyncNotification,
	options: RequestInit
) => {
	let historyMsg: proto.HistorySync
	if (msg.initialHistBootstrapInlinePayload) {
		historyMsg = proto.HistorySync.decode(await inflatePromise(msg.initialHistBootstrapInlinePayload))
	} else {
		historyMsg = await downloadHistory(msg, options)
	}

	return processHistoryMessage(historyMsg)
}

/**
 * Extracts the history sync notification from a protocol message.
 *
 * @param message - The protocol message to check
 * @returns The history sync notification if present, undefined otherwise
 */
export const getHistoryMsg = (message: proto.IMessage) => {
	const normalizedContent = !!message ? normalizeMessageContent(message) : undefined
	const anyHistoryMsg = normalizedContent?.protocolMessage?.historySyncNotification!

	return anyHistoryMsg
}
