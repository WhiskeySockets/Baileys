import { promisify } from 'util'
import { inflate } from 'zlib'
import { proto } from '../../WAProto/index.js'
import type { Chat, Contact, LIDMapping, WAMessage } from '../Types'
import { WAMessageStubType } from '../Types'
import { toNumber } from './generics'
import { normalizeMessageContent } from './messages'
import { downloadContentFromMessage } from './messages-media'

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
 * Checks if a JID represents a person (not a group, broadcast, or newsletter).
 * Only person JIDs can have valid LID-PN mappings.
 *
 * Valid person JID formats:
 * - @s.whatsapp.net (standard phone number)
 * - @lid (Logical ID)
 * - @hosted (hosted phone number)
 * - @hosted.lid (hosted Logical ID)
 *
 * Invalid (non-person) JID formats:
 * - @g.us (groups)
 * - @broadcast (broadcast lists)
 * - @newsletter (channels)
 */
export function isPersonJid(jid: string | undefined): boolean {
	if (!jid) {
		return false
	}

	// Person JIDs: @s.whatsapp.net, @lid, @hosted, @hosted.lid
	if (
		jid.endsWith('@s.whatsapp.net') ||
		jid.endsWith('@lid') ||
		jid.endsWith('@hosted') ||
		jid.endsWith('@hosted.lid')
	) {
		return true
	}

	// Non-person JIDs: @g.us (groups), @broadcast, @newsletter
	return false
}

/**
 * Checks if a JID is a LID (Logical ID) format.
 * LID formats: @lid or @hosted.lid
 */
function isLidJid(jid: string): boolean {
	return jid.endsWith('@lid') || jid.endsWith('@hosted.lid')
}

/**
 * Checks if a JID is a PN (Phone Number) format.
 * PN formats: @s.whatsapp.net or @hosted
 */
function isPnJid(jid: string): boolean {
	return jid.endsWith('@s.whatsapp.net') || jid.endsWith('@hosted')
}

/**
 * Extracts LID-PN mapping from a conversation object.
 *
 * Conversations can have:
 * - A chat ID that is either LID or PN format
 * - Optional lidJid property (alternate LID for the contact)
 * - Optional pnJid property (alternate PN for the contact)
 *
 * Valid extraction scenarios:
 * 1. Chat ID is LID + pnJid is present -> mapping found
 * 2. Chat ID is PN + lidJid is present -> mapping found
 * 3. lidJid + pnJid both present -> mapping found
 *
 * @returns LIDMapping if valid mapping found, undefined otherwise
 */
export function extractLidPnFromConversation(
	chatId: string,
	lidJid: string | undefined | null,
	pnJid: string | undefined | null
): LIDMapping | undefined {
	// Skip non-person chats (groups, broadcasts, newsletters)
	if (!isPersonJid(chatId)) {
		return undefined
	}

	// Case 1: Both lidJid and pnJid are provided
	if (lidJid && pnJid && isLidJid(lidJid) && isPnJid(pnJid)) {
		return { lid: lidJid, pn: pnJid }
	}

	// Case 2: Chat ID is LID format, pnJid provides the phone number
	if (isLidJid(chatId) && pnJid && isPnJid(pnJid)) {
		return { lid: chatId, pn: pnJid }
	}

	// Case 3: Chat ID is PN format, lidJid provides the logical ID
	if (isPnJid(chatId) && lidJid && isLidJid(lidJid)) {
		return { lid: lidJid, pn: chatId }
	}

	return undefined
}

/**
 * Extracts LID-PN mapping from message fields.
 *
 * Messages can have:
 * - remoteJid: Primary JID of the chat/sender
 * - remoteJidAlt: Alternate JID format (LID if remoteJid is PN, or vice versa)
 * - participant: Sender JID in group messages
 * - participantAlt: Alternate format of participant JID
 *
 * For group messages, participant/participantAlt take priority over remoteJid/remoteJidAlt
 * since remoteJid in groups is the group JID, not a person JID.
 *
 * @returns LIDMapping if valid mapping found, undefined otherwise
 */
export function extractLidPnFromMessage(
	remoteJid: string | undefined | null,
	remoteJidAlt: string | undefined | null,
	participant: string | undefined | null,
	participantAlt: string | undefined | null
): LIDMapping | undefined {
	// Prefer participant fields (for group messages)
	let primaryJid = participant || remoteJid
	let altJid = participantAlt || remoteJidAlt

	if (!primaryJid || !altJid) {
		return undefined
	}

	// CRITICAL: Both JIDs MUST be person JIDs to create a valid mapping.
	// Using || ensures we reject if EITHER is not a person JID.
	// This prevents "poisoned" mappings where a group/broadcast/newsletter
	// JID gets incorrectly paired with a person JID.
	if (!isPersonJid(primaryJid) || !isPersonJid(altJid)) {
		return undefined
	}

	// Determine which is LID and which is PN
	if (isLidJid(primaryJid) && isPnJid(altJid)) {
		return { lid: primaryJid, pn: altJid }
	}

	if (isPnJid(primaryJid) && isLidJid(altJid)) {
		return { lid: altJid, pn: primaryJid }
	}

	// Both are same type (both LID or both PN) - cannot create mapping
	return undefined
}

export const processHistoryMessage = (item: proto.IHistorySync) => {
	const messages: WAMessage[] = []
	const contacts: Contact[] = []
	const chats: Chat[] = []

	// Use Map for O(1) deduplication of LID-PN mappings
	const lidPnMap = new Map<string, LIDMapping>()

	const addLidPnMapping = (mapping: LIDMapping | undefined): void => {
		if (!mapping || !mapping.lid || !mapping.pn) {
			return
		}
		lidPnMap.set(mapping.lid, mapping)
	}

	// Source 1: Extract from phoneNumberToLidMappings array (all sync types)
	for (const m of item.phoneNumberToLidMappings || []) {
		if (m.lidJid && m.pnJid) {
			addLidPnMapping({ lid: m.lidJid, pn: m.pnJid })
		}
	}

	switch (item.syncType) {
		case proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP:
		case proto.HistorySync.HistorySyncType.RECENT:
		case proto.HistorySync.HistorySyncType.FULL:
		case proto.HistorySync.HistorySyncType.ON_DEMAND:
			for (const chat of item.conversations! as Chat[]) {
				contacts.push({
					id: chat.id!,
					name: chat.name || undefined,
					lid: chat.lidJid || undefined,
					phoneNumber: chat.pnJid || undefined
				})

				// Source 2: Extract from conversation metadata
				addLidPnMapping(
					extractLidPnFromConversation(chat.id!, chat.lidJid, chat.pnJid)
				)

				const msgs = chat.messages || []
				delete chat.messages

				for (const item of msgs) {
					const message = item.message! as WAMessage
					messages.push(message)

					// Source 3: Extract from message alt fields
					const key = message.key
					if (key) {
						addLidPnMapping(
							extractLidPnFromMessage(
								key.remoteJid,
								(key as any).remoteJidAlt,
								key.participant,
								(key as any).participantAlt
							)
						)
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

	return {
		chats,
		contacts,
		messages,
		lidPnMappings: Array.from(lidPnMap.values()),
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
