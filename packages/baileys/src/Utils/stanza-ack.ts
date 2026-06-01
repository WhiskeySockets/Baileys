import type { BinaryNode } from '../WABinary'

/**
 * Builds an ACK stanza for a received node.
 * Pure function -- no I/O, no side effects.
 *
 * Mirrors WhatsApp Web's ACK construction:
 * - WAWebHandleMsgSendAck.sendAck / sendNack
 * - WAWebCreateNackFromStanza.createNackFromStanza
 */
export function buildAckStanza(node: BinaryNode, errorCode?: number, meId?: string): BinaryNode {
	const { tag, attrs } = node
	const stanza: BinaryNode = {
		tag: 'ack',
		attrs: {
			id: attrs.id!,
			to: attrs.from!,
			class: tag
		}
	}

	if (errorCode) {
		stanza.attrs.error = errorCode.toString()
	}

	if (attrs.participant) {
		stanza.attrs.participant = attrs.participant
	}

	if (attrs.recipient) {
		stanza.attrs.recipient = attrs.recipient
	}

	// WA Web always includes type when present: `n.type || DROP_ATTR`
	if (attrs.type) {
		stanza.attrs.type = attrs.type
	}

	// WA Web WAWebHandleMsgSendAck.sendAck/sendNack always include `from` for message-class ACKs
	if (tag === 'message' && meId) {
		stanza.attrs.from = meId
	}

	return stanza
}
