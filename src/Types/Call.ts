export type WACallUpdateType =
	| 'offer'
	| 'ringing'
	| 'preaccept'
	| 'transport'
	| 'relaylatency'
	| 'timeout'
	| 'reject'
	| 'accept'
	| 'terminate'

export type WACallEvent = {
	/** Prefer phone JID when known (from callerPn); otherwise the raw peer JID. */
	chatId: string
	/** Call-creator JID from the stanza (often @lid). Pass this to rejectCall(). */
	from: string
	/** Real phone JID when WhatsApp includes caller_pn or a LID mapping exists. */
	callerPn?: string
	isGroup?: boolean
	groupJid?: string
	id: string
	date: Date
	isVideo?: boolean
	status: WACallUpdateType
	offline: boolean
	latencyMs?: number
}
