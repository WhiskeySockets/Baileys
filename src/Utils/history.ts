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
	isJidBroadcast,
	isJidGroup,
	isJidNewsletter,
	isLidUser,
	isPnUser,
	jidDecode,
	jidNormalizedUser,
} from '../WABinary/jid-utils'

const inflatePromise = promisify(inflate)

/**
 * Checks if a JID represents a person (individual user) rather than a group, broadcast, or newsletter.
 * Only person JIDs (LID or PN formats) can have LID-PN mappings.
 */
export function isPersonJid(jid: string | undefined): boolean {
	if(!jid) {
		return false
	}

	// Groups, broadcasts, and newsletters don't have LID-PN mappings
	if(isJidGroup(jid) || isJidBroadcast(jid) || isJidNewsletter(jid)) {
		return false
	}

	// Only person JIDs (LID or PN formats) can have mappings
	return !!(
		isLidUser(jid) ||
		isHostedLidUser(jid) ||
		isPnUser(jid) ||
		isHostedPnUser(jid)
	)
}

/**
 * Extracts a LID-PN mapping from conversation data.
 * Returns undefined if the conversation doesn't represent a valid person-to-person mapping.
 */
export function extractLidPnFromConversation(
	chatId: string,
	lidJid: string | undefined | null,
	pnJid: string | undefined | null
): LIDMapping | undefined {
	// Skip non-person JIDs (groups, broadcasts, newsletters)
	if(!isPersonJid(chatId)) {
		return undefined
	}

	const chatIsLid = isLidUser(chatId) || isHostedLidUser(chatId)
	const chatIsPn = isPnUser(chatId) || isHostedPnUser(chatId)

	if(chatIsLid && pnJid) {
		return {
			lid: jidNormalizedUser(chatId),
			pn: jidNormalizedUser(pnJid)
		}
	}

	if(chatIsPn && lidJid) {
		return {
			lid: jidNormalizedUser(lidJid),
			pn: jidNormalizedUser(chatId)
		}
	}

	return undefined
}

/**
 * Extracts a LID-PN mapping from message data (remoteJidAlt/participantAlt fields).
 * Returns undefined if the message doesn't contain a valid person-to-person mapping.
 *
 * IMPORTANT: Uses || (OR) to ensure BOTH JIDs are person JIDs before extracting.
 * This prevents "poisoned" mappings where one side is a group/newsletter/broadcast.
 */
export function extractLidPnFromMessage(
	remoteJid: string | undefined | null,
	remoteJidAlt: string | undefined | null,
	participant: string | undefined | null,
	participantAlt: string | undefined | null
): LIDMapping | undefined {
	const primaryJid = participant || remoteJid
	const altJid = participantAlt || remoteJidAlt

	if(!primaryJid || !altJid) {
		return undefined
	}

	// FIXED: Use || (OR) instead of && (AND)
	// Both JIDs MUST be person JIDs to create a valid mapping.
	// Using && would allow mixed scenarios (e.g., person + group) to proceed,
	// resulting in invalid "poisoned" mappings.
	if(!isPersonJid(primaryJid) || !isPersonJid(altJid)) {
		return undefined
	}

	const primaryDecoded = jidDecode(primaryJid)
	const altDecoded = jidDecode(altJid)

	if(!primaryDecoded || !altDecoded) {
		return undefined
	}

	const primaryIsLid = primaryDecoded.server === 'lid' ||
		primaryDecoded.server === 'hosted.lid'
	const altIsLid = altDecoded.server === 'lid' ||
		altDecoded.server === 'hosted.lid'

	if(primaryIsLid && !altIsLid) {
		return {
			lid: jidNormalizedUser(primaryJid),
			pn: jidNormalizedUser(altJid)
		}
	}

	if(!primaryIsLid && altIsLid) {
		return {
			lid: jidNormalizedUser(altJid),
			pn: jidNormalizedUser(primaryJid)
		}
	}

	return undefined
}

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

export const processHistoryMessage = (item: proto.IHistorySync) => {
	const messages: WAMessage[] = []
	const contacts: Contact[] = []
	const chats: Chat[] = []
	// Extract LID-PN mappings for all sync types
	const lidPnMappings: LIDMapping[] = []
	for (const m of item.phoneNumberToLidMappings || []) {
		if (m.lidJid && m.pnJid) {
			lidPnMappings.push({ lid: m.lidJid, pn: m.pnJid })
		}
	}

	switch (item.syncType) {
		case proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP:
		case proto.HistorySync.HistorySyncType.RECENT:
		case proto.HistorySync.HistorySyncType.FULL:
		case proto.HistorySync.HistorySyncType.ON_DEMAND:
			for(const chat of item.conversations! as Chat[]) {
				contacts.push({
					id: chat.id!,
					name: chat.name || undefined,
					lid: chat.lidJid || undefined,
					phoneNumber: chat.pnJid || undefined
				})

				// Extract LID-PN mapping from conversation (lidJid/pnJid properties)
				const convMapping = extractLidPnFromConversation(
					chat.id!,
					chat.lidJid,
					chat.pnJid
				)
				if(convMapping) {
					lidPnMappings.push(convMapping)
				}

				const msgs = chat.messages || []
				delete chat.messages

				for(const item of msgs) {
					const message = item.message! as WAMessage
					messages.push(message)

					if(!chat.messages?.length) {
						// keep only the most recent message in the chat array
						chat.messages = [{ message }]
					}

					if(!message.key.fromMe && !chat.lastMessageRecvTimestamp) {
						chat.lastMessageRecvTimestamp = toNumber(message.messageTimestamp)
					}

					if(
						(message.messageStubType === WAMessageStubType.BIZ_PRIVACY_MODE_TO_BSP ||
							message.messageStubType === WAMessageStubType.BIZ_PRIVACY_MODE_TO_FB) &&
						message.messageStubParameters?.[0]
					) {
						contacts.push({
							id: message.key.participant || message.key.remoteJid!,
							verifiedName: message.messageStubParameters?.[0]
						})
					}

					// Extract LID-PN mapping from message (remoteJidAlt/participantAlt fields)
					const msgMapping = extractLidPnFromMessage(
						message.key.remoteJid,
						(message.key as { remoteJidAlt?: string }).remoteJidAlt,
						message.key.participant,
						(message.key as { participantAlt?: string }).participantAlt
					)
					if(msgMapping) {
						lidPnMappings.push(msgMapping)
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

	return {
		chats,
		contacts,
		messages,
		lidPnMappings,
		syncType: item.syncType,
		progress: item.progress
	}
}

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

export const getHistoryMsg = (message: proto.IMessage) => {
	const normalizedContent = !!message ? normalizeMessageContent(message) : undefined
	const anyHistoryMsg = normalizedContent?.protocolMessage?.historySyncNotification!

	return anyHistoryMsg
}
