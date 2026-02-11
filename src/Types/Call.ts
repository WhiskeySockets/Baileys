import type { BinaryNode } from '../WABinary'

export type WACallUpdateType = 'offer' | 'ringing' | 'timeout' | 'reject' | 'accept' | 'terminate'

export type WACallEvent = {
	node: BinaryNode
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
	callKey?: Uint8Array | null
}
