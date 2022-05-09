
export type WACallUpdateType = 'offer' | 'ringing' | 'timeout' | 'reject' | 'accept'

export type WACallEvent = {
	chatId: string
	from: string
	isGroup?: boolean
	id: string
	date: Date
	isVideo?: boolean
	status: WACallUpdateType
	offline: boolean
	latencyMs?: number
}