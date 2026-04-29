export type SendInstrumentationStatus = 'start' | 'success' | 'hit' | 'miss' | 'failure'

export type SendInstrumentationCounts = {
	participants?: number
	devices?: number
	sessionsExisting?: number
	sessionsFetched?: number
	cacheHits?: number
	cacheMisses?: number
	cacheSets?: number
	attempts?: number
}

export type SendInstrumentationEvent = {
	stage: string
	status: SendInstrumentationStatus
	durationMs?: number
	instanceId?: string
	groupJid?: string
	host?: string
	retryFromHost?: string
	counts?: SendInstrumentationCounts
}

export type SendInstrumentation = (event: SendInstrumentationEvent) => void | Promise<void>

export type WarmUpGroupSendSummary = {
	groupJid: string
	metadataSource: 'cache' | 'network' | 'missing'
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
