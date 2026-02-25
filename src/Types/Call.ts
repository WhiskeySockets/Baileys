export type WACallUpdateType = 'offer' | 'ringing' | 'timeout' | 'reject' | 'accept' | 'terminate'

export type WAInitiateCallOptions = {
	isVideo?: boolean
}

export type WAInitiateCallResult = {
	callId: string
	to: string
	isVideo: boolean
}

export type WACallEvent = {
	chatId: string
	from: string
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
