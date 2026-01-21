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
	jidNormalizedUser
} from '../WABinary/index.js'

const inflatePromise = promisify(inflate)

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
 * Checks if a JID represents a person (can have LID-PN mapping).
 * Excludes groups, broadcasts, and newsletters.
 *
 * @param jid - The JID to check
 * @returns true if the JID can have LID-PN mapping
 */
export function isPersonJid(jid: string | undefined): boolean {
	if (!jid) {
		return false
	}

	// Groups, broadcasts, and newsletters don't have LID-PN mappings
	if (isJidGroup(jid) || isJidBroadcast(jid) || isJidNewsletter(jid)) {
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
 * Extracts LID-PN mapping from a conversation object.
 *
 * Conversations may have their ID in either LID or PN format, with the
 * alternate format stored in `lidJid` or `pnJid` properties respectively.
 *
 * @param chatId - The conversation ID (may be LID or PN format)
 * @param lidJid - The LID JID if chat ID is PN format
 * @param pnJid - The PN JID if chat ID is LID format
 * @returns LID-PN mapping if extractable, undefined otherwise
 */
export function extractLidPnFromConversation(
	chatId: string,
	lidJid: string | undefined | null,
	pnJid: string | undefined | null
): LIDMapping | undefined {
	// Skip non-person JIDs (groups, broadcasts, newsletters)
	if (!isPersonJid(chatId)) {
		return undefined
	}

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
 * Extracts LID-PN mapping from a message's alternative JID fields.
 *
 * Messages may contain alternate JID formats in:
 * - `key.remoteJidAlt` - Alternative remote JID format
 * - `key.participantAlt` - Alternative participant JID format (for groups)
 *
 * IMPORTANT: Uses || (OR) to ensure BOTH JIDs are person JIDs before extracting.
 * This prevents "poisoned" mappings where one side is a group/newsletter/broadcast.
 *
 * @param remoteJid - The primary remote JID
 * @param remoteJidAlt - The alternative remote JID (may be LID or PN)
 * @param participant - The primary participant JID (for group messages)
 * @param participantAlt - The alternative participant JID
 * @returns LID-PN mapping if extractable, undefined otherwise
 */
export function extractLidPnFromMessage(
	remoteJid: string | undefined | null,
	remoteJidAlt: string | undefined | null,
	participant: string | undefined | null,
	participantAlt: string | undefined | null
): LIDMapping | undefined {
	// For group messages, use participant fields
	const primaryJid = participant || remoteJid
	const altJid = participantAlt || remoteJidAlt

	if (!primaryJid || !altJid) {
		return undefined
	}

	// IMPORTANT: Use || (OR) - Both JIDs MUST be person JIDs to create valid mapping
	// Using && would allow mixed scenarios (e.g., person + group) to proceed
	if (!isPersonJid(primaryJid) || !isPersonJid(altJid)) {
		return undefined
	}

	const primaryDecoded = jidDecode(primaryJid)
	const altDecoded = jidDecode(altJid)

	if (!primaryDecoded || !altDecoded) {
		return undefined
	}

	// Determine which is LID and which is PN
	const primaryIsLid = primaryDecoded.server === 'lid' || primaryDecoded.server === 'hosted.lid'
	const altIsLid = altDecoded.server === 'lid' || altDecoded.server === 'hosted.lid'

	if (primaryIsLid && !altIsLid) {
		// Primary is LID, alt is PN
		return {
			lid: jidNormalizedUser(primaryJid),
			pn: jidNormalizedUser(altJid)
		}
	}

	if (!primaryIsLid && altIsLid) {
		// Primary is PN, alt is LID
		return {
			lid: jidNormalizedUser(altJid),
			pn: jidNormalizedUser(primaryJid)
		}
	}

	return undefined
}

/**
 * Processes a history sync message and extracts chats, contacts, messages,
 * and LID-PN mappings.
 *
 * LID-PN mappings are extracted from three sources:
 * 1. Top-level `phoneNumberToLidMappings` array
 * 2. Conversation objects (via `lidJid` and `pnJid` properties)
 * 3. Message objects (via `remoteJidAlt`, `participantAlt` fields)
 *
 * Uses Map-based deduplication for O(1) insertion and automatic duplicate removal.
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

					// Source 3: Extract LID-PN mapping from message's alt JID fields
					const messageMapping = extractLidPnFromMessage(
						message.key.remoteJid,
						message.key.remoteJidAlt,
						message.key.participant,
						message.key.participantAlt
					)
					if (messageMapping) {
						addLidPnMapping(messageMapping)
					}

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
