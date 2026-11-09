import type { MessageReceiptType } from '../Types'
import { isJidMetaAI, isLidUser, isPnUser } from '../WABinary'

/**
 * Builds the addressing attributes of a receipt stanza.
 * Pure function -- no I/O, no side effects.
 *
 * A sender receipt (for a message one of our other devices sent) names the chat
 * as `recipient` and goes `to` the sending device. Bot chats need the same shape:
 * a receipt sent `to` the bot leaves the server redelivering the message.
 */
export function buildReceiptAddressing(
	jid: string,
	participant: string | undefined,
	type: MessageReceiptType
): { to: string; recipient?: string; participant?: string } {
	if (type === 'sender' && (isPnUser(jid) || isLidUser(jid) || isJidMetaAI(jid))) {
		return { recipient: jid, to: participant! }
	}

	return participant ? { to: jid, participant } : { to: jid }
}
