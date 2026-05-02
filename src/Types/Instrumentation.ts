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

/**
 * Append structured profiling lines as NDJSON for offline analysis (timings, response summaries).
 * Does not log raw USync/XML payloads unless extended later.
 */
export type BaileysFileInstrumentationConfig = {
	/** Path to NDJSON log file (relative to `process.cwd()` or absolute). Parent dirs are created automatically. */
	logPath: string
}

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
