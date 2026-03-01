export type WACallUpdateType =
	| 'offer'
	| 'ringing'
	| 'timeout'
	| 'reject'
	| 'accept'
	| 'terminate'
	| 'preaccept'
	| 'transport'
	| 'relaylatency'
	| 'group_update'
	| 'reminder'
	| 'heartbeat'
	| 'mute_v2'
	| 'enc_rekey'
	| 'video'
	| 'relay'

export type WACallParticipant = {
	jid?: string
	/** 'connected' | 'invited' | 'left' etc. */
	state?: string
	/** Phone number in s.whatsapp.net format */
	userPn?: string
	/** 'admin' for group call link creator */
	type?: string
}

export type WACallEvent = {
	chatId: string
	from: string
	isGroup?: boolean
	groupJid?: string
	id: string
	date: Date
	isVideo?: boolean
	status: WACallUpdateType
	offline: boolean
	latencyMs?: number
	/** Phone number of the caller */
	callerPn?: string
	/** Call link token (forms URL: https://call.whatsapp.com/<token>) */
	linkToken?: string
	/** JID of who created the call link */
	linkCreator?: string
	/** Phone number of link creator */
	linkCreatorPn?: string
	/** Media type: 'video' or 'audio' */
	media?: string
	/** Max participants for group/link calls */
	connectedLimit?: number
	/** Participants in a group/link call */
	participants?: WACallParticipant[]
	/** Call duration in ms (from terminate/call_summary) */
	duration?: number
	/** Terminate reason (e.g. 'group_call_ended', 'accepted_elsewhere', 'timeout') */
	terminateReason?: string
}
