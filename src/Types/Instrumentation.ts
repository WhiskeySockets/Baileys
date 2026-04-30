export type WarmUpGroupSendSummary = {
	groupJid: string
	metadataSource: 'cache' | 'network'
	participants: number
	devices: number
	sessionsExisting: number
	sessionsFetched: number
	durationMs: number
}

export type WarmUpGroupParticipantsSummary = {
	groupJid: string
	participants: number
	devices: number
	sessionsExisting: number
	sessionsFetched: number
	durationMs: number
}
