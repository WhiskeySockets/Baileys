import type { MessageReceiptType, WAMessage } from '../Types'
import { isJidNewsletter, isLidUser, jidNormalizedUser } from '../WABinary'
import { getHistoryMsg } from './history'

export type ReceiptContext = {
	category: string
	isFromMe: boolean
	sendActiveReceipts: boolean
}

export function determineReceiptType(ctx: ReceiptContext): MessageReceiptType {
	if (ctx.category === 'peer') {
		return 'peer_msg'
	}
	if (ctx.isFromMe) {
		return 'sender'
	}
	if (!ctx.sendActiveReceipts) {
		return 'inactive'
	}
	return undefined
}

export function shouldUseLidForParticipant(
	remoteJid: string | null | undefined,
	remoteJidAlt: string | null | undefined
): boolean {
	return !!(remoteJid && isLidUser(remoteJid)) || !!(remoteJidAlt && isLidUser(remoteJidAlt))
}

export type ReceiptPreparation = {
	shouldSendReceipt: boolean
	type: MessageReceiptType
	participant: string | undefined
	remoteJid: string
	isHistoryMessage: boolean
	normalizedJid: string
}

export function prepareMessageReceipt(
	msg: WAMessage,
	category: string | undefined,
	author: string,
	sendActiveReceipts: boolean
): ReceiptPreparation {
	const remoteJid = msg.key.remoteJid!

	if (isJidNewsletter(remoteJid)) {
		return {
			shouldSendReceipt: false,
			type: undefined,
			participant: undefined,
			remoteJid,
			isHistoryMessage: false,
			normalizedJid: ''
		}
	}

	const type = determineReceiptType({
		category: category ?? '',
		isFromMe: msg.key.fromMe ?? false,
		sendActiveReceipts
	})

	const useLidParticipant = msg.key.fromMe && shouldUseLidForParticipant(msg.key.remoteJid, msg.key.remoteJidAlt)
	const participant = useLidParticipant ? author : (msg.key.participant ?? undefined)
	const isHistoryMessage = msg.message ? !!getHistoryMsg(msg.message) : false

	return {
		shouldSendReceipt: true,
		type,
		participant,
		remoteJid,
		isHistoryMessage,
		normalizedJid: isHistoryMessage ? jidNormalizedUser(remoteJid) : ''
	}
}
