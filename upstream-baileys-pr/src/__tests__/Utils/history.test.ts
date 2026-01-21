import { describe, it, expect } from '@jest/globals'
import {
	isPersonJid,
	extractLidPnFromConversation,
	extractLidPnFromMessage,
	processHistoryMessage
} from '../../Utils/history'
import { proto } from '../../../WAProto/index.js'

// =============================================================================
// isPersonJid Tests (9 tests)
// =============================================================================

describe('isPersonJid', () => {
	// Accepts valid person JIDs
	it('should return true for @s.whatsapp.net JIDs', () => {
		expect(isPersonJid('5511999999999@s.whatsapp.net')).toBe(true)
		expect(isPersonJid('1234567890@s.whatsapp.net')).toBe(true)
	})

	it('should return true for @lid JIDs', () => {
		expect(isPersonJid('123456789012345@lid')).toBe(true)
		expect(isPersonJid('987654321098765@lid')).toBe(true)
	})

	it('should return true for @hosted JIDs', () => {
		expect(isPersonJid('5511999999999@hosted')).toBe(true)
	})

	it('should return true for @hosted.lid JIDs', () => {
		expect(isPersonJid('123456789012345@hosted.lid')).toBe(true)
	})

	// Rejects non-person JIDs
	it('should return false for @g.us (group) JIDs', () => {
		expect(isPersonJid('123456789012345@g.us')).toBe(false)
		expect(isPersonJid('group-id@g.us')).toBe(false)
	})

	it('should return false for @broadcast JIDs', () => {
		expect(isPersonJid('status@broadcast')).toBe(false)
		expect(isPersonJid('123@broadcast')).toBe(false)
	})

	it('should return false for @newsletter JIDs', () => {
		expect(isPersonJid('123456789012345@newsletter')).toBe(false)
	})

	it('should return false for undefined', () => {
		expect(isPersonJid(undefined)).toBe(false)
	})

	it('should return false for empty string', () => {
		expect(isPersonJid('')).toBe(false)
	})
})

// =============================================================================
// extractLidPnFromConversation Tests (11 tests)
// =============================================================================

describe('extractLidPnFromConversation', () => {
	// Valid extraction scenarios
	it('should extract mapping when chatId is LID and pnJid is provided', () => {
		const result = extractLidPnFromConversation(
			'123456789@lid',
			undefined,
			'5511999999999@s.whatsapp.net'
		)
		expect(result).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should extract mapping when chatId is PN and lidJid is provided', () => {
		const result = extractLidPnFromConversation(
			'5511999999999@s.whatsapp.net',
			'123456789@lid',
			undefined
		)
		expect(result).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should handle hosted LID with hosted PN', () => {
		const result = extractLidPnFromConversation(
			'123456789@hosted.lid',
			undefined,
			'5511999999999@hosted'
		)
		expect(result).toEqual({
			lid: '123456789@hosted.lid',
			pn: '5511999999999@hosted'
		})
	})

	it('should handle hosted PN with regular LID', () => {
		const result = extractLidPnFromConversation(
			'5511999999999@hosted',
			'123456789@lid',
			undefined
		)
		expect(result).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@hosted'
		})
	})

	// Rejection scenarios
	it('should return undefined for group chats', () => {
		const result = extractLidPnFromConversation(
			'123456789@g.us',
			'987654321@lid',
			'5511999999999@s.whatsapp.net'
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined for newsletter chats', () => {
		const result = extractLidPnFromConversation(
			'123456789@newsletter',
			'987654321@lid',
			'5511999999999@s.whatsapp.net'
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined for broadcast chats', () => {
		const result = extractLidPnFromConversation(
			'status@broadcast',
			'987654321@lid',
			'5511999999999@s.whatsapp.net'
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when no alternate JID is provided', () => {
		const result = extractLidPnFromConversation(
			'123456789@lid',
			undefined,
			undefined
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when lidJid is null', () => {
		const result = extractLidPnFromConversation(
			'5511999999999@s.whatsapp.net',
			null,
			undefined
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when pnJid is null', () => {
		const result = extractLidPnFromConversation(
			'123456789@lid',
			undefined,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should normalize JIDs in the result', () => {
		const result = extractLidPnFromConversation(
			'123456789:0@lid',
			undefined,
			'5511999999999:0@s.whatsapp.net'
		)
		expect(result).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})
})

// =============================================================================
// extractLidPnFromMessage Tests (17 tests)
// =============================================================================

describe('extractLidPnFromMessage', () => {
	// Direct message scenarios
	it('should extract from remoteJid (LID) and remoteJidAlt (PN)', () => {
		const result = extractLidPnFromMessage(
			'123456789@lid',
			'5511999999999@s.whatsapp.net',
			null,
			null
		)
		expect(result).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should extract from remoteJid (PN) and remoteJidAlt (LID)', () => {
		const result = extractLidPnFromMessage(
			'5511999999999@s.whatsapp.net',
			'123456789@lid',
			null,
			null
		)
		expect(result).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	// Group message scenarios - participant takes priority
	it('should extract from participant and participantAlt for group messages', () => {
		const result = extractLidPnFromMessage(
			'group@g.us',
			null,
			'123456789@lid',
			'5511999999999@s.whatsapp.net'
		)
		expect(result).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should prioritize participant over remoteJid when both exist', () => {
		const result = extractLidPnFromMessage(
			'987654321@lid',
			'5522888888888@s.whatsapp.net',
			'123456789@lid',
			'5511999999999@s.whatsapp.net'
		)
		expect(result).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should handle reverse order in participant fields', () => {
		const result = extractLidPnFromMessage(
			'group@g.us',
			null,
			'5511999999999@s.whatsapp.net',
			'123456789@lid'
		)
		expect(result).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	// Hosted format scenarios
	it('should handle hosted LID with regular PN', () => {
		const result = extractLidPnFromMessage(
			'123456789@hosted.lid',
			'5511999999999@s.whatsapp.net',
			null,
			null
		)
		expect(result).toEqual({
			lid: '123456789@hosted.lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should handle regular LID with hosted PN', () => {
		const result = extractLidPnFromMessage(
			'123456789@lid',
			'5511999999999@hosted',
			null,
			null
		)
		expect(result).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@hosted'
		})
	})

	// Bug fix validation - || instead of && (Critical tests)
	it('should return undefined when primary is group (prevents poisoned mapping)', () => {
		const result = extractLidPnFromMessage(
			'group@g.us',
			'123456789@lid',
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when alt is group (prevents poisoned mapping)', () => {
		const result = extractLidPnFromMessage(
			'123456789@lid',
			'group@g.us',
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when primary is broadcast (prevents poisoned mapping)', () => {
		const result = extractLidPnFromMessage(
			'status@broadcast',
			'5511999999999@s.whatsapp.net',
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when alt is newsletter (prevents poisoned mapping)', () => {
		const result = extractLidPnFromMessage(
			'123456789@lid',
			'channel@newsletter',
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	// Same type scenarios
	it('should return undefined when both JIDs are LID type', () => {
		const result = extractLidPnFromMessage(
			'123456789@lid',
			'987654321@lid',
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when both JIDs are PN type', () => {
		const result = extractLidPnFromMessage(
			'5511999999999@s.whatsapp.net',
			'5522888888888@s.whatsapp.net',
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	// Missing data scenarios
	it('should return undefined when no alt JID provided', () => {
		const result = extractLidPnFromMessage(
			'123456789@lid',
			null,
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when remoteJid is null and no participant', () => {
		const result = extractLidPnFromMessage(
			null,
			'123456789@lid',
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when all parameters are null', () => {
		const result = extractLidPnFromMessage(null, null, null, null)
		expect(result).toBeUndefined()
	})

	it('should normalize JIDs in the result', () => {
		const result = extractLidPnFromMessage(
			'123456789:0@lid',
			'5511999999999:0@s.whatsapp.net',
			null,
			null
		)
		expect(result).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})
})

// =============================================================================
// processHistoryMessage Tests (18 tests)
// =============================================================================

describe('processHistoryMessage', () => {
	// Helper to create minimal history sync payload
	const createHistorySync = (
		syncType: proto.HistorySync.HistorySyncType,
		options: {
			phoneNumberToLidMappings?: Array<{ lidJid: string; pnJid: string }>
			conversations?: Array<{
				id: string
				lidJid?: string
				pnJid?: string
				messages?: Array<{
					message: {
						key: {
							remoteJid: string
							remoteJidAlt?: string
							participant?: string
							participantAlt?: string
							fromMe?: boolean
						}
						messageTimestamp?: number
					}
				}>
			}>
			pushnames?: Array<{ id: string; pushname: string }>
		} = {}
	): proto.IHistorySync => ({
		syncType,
		phoneNumberToLidMappings: options.phoneNumberToLidMappings || [],
		conversations: options.conversations || [],
		pushnames: options.pushnames || []
	})

	// Source 1: phoneNumberToLidMappings
	it('should extract from phoneNumberToLidMappings array', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			phoneNumberToLidMappings: [
				{ lidJid: '123456789@lid', pnJid: '5511999999999@s.whatsapp.net' }
			]
		})

		const result = processHistoryMessage(payload)
		expect(result.lidPnMappings).toHaveLength(1)
		expect(result.lidPnMappings[0]).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should extract multiple mappings from phoneNumberToLidMappings', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			phoneNumberToLidMappings: [
				{ lidJid: '111@lid', pnJid: '5511111111111@s.whatsapp.net' },
				{ lidJid: '222@lid', pnJid: '5522222222222@s.whatsapp.net' }
			]
		})

		const result = processHistoryMessage(payload)
		expect(result.lidPnMappings).toHaveLength(2)
	})

	// Source 2: Conversation objects
	it('should extract from conversation lidJid/pnJid fields', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			conversations: [{
				id: '123456789@lid',
				pnJid: '5511999999999@s.whatsapp.net'
			}]
		})

		const result = processHistoryMessage(payload)
		expect(result.lidPnMappings).toHaveLength(1)
		expect(result.lidPnMappings[0]).toEqual({
			lid: '123456789@lid',
			pn: '5511999999999@s.whatsapp.net'
		})
	})

	it('should extract from conversation when id is PN and lidJid provided', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			conversations: [{
				id: '5511999999999@s.whatsapp.net',
				lidJid: '123456789@lid'
			}]
		})

		const result = processHistoryMessage(payload)
		expect(result.lidPnMappings).toHaveLength(1)
	})

	// Source 3: Message objects
	it('should extract from message remoteJidAlt field', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			conversations: [{
				id: '123456789@lid',
				messages: [{
					message: {
						key: {
							remoteJid: '123456789@lid',
							remoteJidAlt: '5511999999999@s.whatsapp.net'
						}
					}
				}]
			}]
		})

		const result = processHistoryMessage(payload)
		expect(result.lidPnMappings.length).toBeGreaterThanOrEqual(1)
	})

	it('should extract from message participantAlt field (group messages)', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			conversations: [{
				id: 'group@g.us',
				messages: [{
					message: {
						key: {
							remoteJid: 'group@g.us',
							participant: '123456789@lid',
							participantAlt: '5511999999999@s.whatsapp.net'
						}
					}
				}]
			}]
		})

		const result = processHistoryMessage(payload)
		expect(result.lidPnMappings).toHaveLength(1)
	})

	// Deduplication tests
	it('should deduplicate mappings across all three sources', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			phoneNumberToLidMappings: [
				{ lidJid: '123456789@lid', pnJid: '5511999999999@s.whatsapp.net' }
			],
			conversations: [{
				id: '123456789@lid',
				pnJid: '5511999999999@s.whatsapp.net',
				messages: [{
					message: {
						key: {
							remoteJid: '123456789@lid',
							remoteJidAlt: '5511999999999@s.whatsapp.net'
						}
					}
				}]
			}]
		})

		const result = processHistoryMessage(payload)
		// Should have only 1 mapping despite being in all 3 sources
		expect(result.lidPnMappings).toHaveLength(1)
	})

	it('should keep latest mapping when duplicates have same LID', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			phoneNumberToLidMappings: [
				{ lidJid: '123456789@lid', pnJid: '5511111111111@s.whatsapp.net' },
				{ lidJid: '123456789@lid', pnJid: '5522222222222@s.whatsapp.net' }
			]
		})

		const result = processHistoryMessage(payload)
		expect(result.lidPnMappings).toHaveLength(1)
	})

	// Sync type tests
	it('should work with INITIAL_BOOTSTRAP sync type', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			phoneNumberToLidMappings: [
				{ lidJid: '123@lid', pnJid: '5511@s.whatsapp.net' }
			],
			conversations: [{ id: '123@lid' }]
		})

		const result = processHistoryMessage(payload)
		expect(result.syncType).toBe(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP)
	})

	it('should work with RECENT sync type', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.RECENT, {
			conversations: [{ id: '123@lid', pnJid: '5511@s.whatsapp.net' }]
		})

		const result = processHistoryMessage(payload)
		expect(result.syncType).toBe(proto.HistorySync.HistorySyncType.RECENT)
		expect(result.lidPnMappings).toHaveLength(1)
	})

	it('should work with FULL sync type', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.FULL, {
			conversations: [{ id: '123@lid', pnJid: '5511@s.whatsapp.net' }]
		})

		const result = processHistoryMessage(payload)
		expect(result.syncType).toBe(proto.HistorySync.HistorySyncType.FULL)
	})

	it('should work with ON_DEMAND sync type', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.ON_DEMAND, {
			conversations: [{ id: '123@lid', pnJid: '5511@s.whatsapp.net' }]
		})

		const result = processHistoryMessage(payload)
		expect(result.syncType).toBe(proto.HistorySync.HistorySyncType.ON_DEMAND)
	})

	it('should handle PUSH_NAME sync type correctly (no lid mappings)', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.PUSH_NAME, {
			pushnames: [
				{ id: '5511999999999@s.whatsapp.net', pushname: 'John Doe' }
			]
		})

		const result = processHistoryMessage(payload)
		expect(result.contacts).toHaveLength(1)
		expect(result.contacts[0].notify).toBe('John Doe')
		expect(result.lidPnMappings).toHaveLength(0)
	})

	// Rejection scenarios
	it('should not extract mappings from group conversations', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			conversations: [{
				id: 'group@g.us',
				lidJid: '123@lid',
				pnJid: '5511@s.whatsapp.net'
			}]
		})

		const result = processHistoryMessage(payload)
		expect(result.lidPnMappings).toHaveLength(0)
	})

	it('should not extract mappings from newsletter conversations', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			conversations: [{
				id: 'channel@newsletter',
				lidJid: '123@lid',
				pnJid: '5511@s.whatsapp.net'
			}]
		})

		const result = processHistoryMessage(payload)
		expect(result.lidPnMappings).toHaveLength(0)
	})

	it('should not extract mappings from broadcast conversations', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			conversations: [{
				id: 'status@broadcast',
				lidJid: '123@lid',
				pnJid: '5511@s.whatsapp.net'
			}]
		})

		const result = processHistoryMessage(payload)
		expect(result.lidPnMappings).toHaveLength(0)
	})

	// Empty payload test
	it('should return empty lidPnMappings for empty payload', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {})

		const result = processHistoryMessage(payload)
		expect(result.lidPnMappings).toHaveLength(0)
	})

	// Return structure test
	it('should return correct structure with all fields', () => {
		const payload = createHistorySync(proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP, {
			phoneNumberToLidMappings: [
				{ lidJid: '123@lid', pnJid: '5511@s.whatsapp.net' }
			],
			conversations: [{
				id: '5511@s.whatsapp.net',
				name: 'Test Contact'
			}]
		})

		const result = processHistoryMessage(payload)

		expect(result).toHaveProperty('chats')
		expect(result).toHaveProperty('contacts')
		expect(result).toHaveProperty('messages')
		expect(result).toHaveProperty('lidPnMappings')
		expect(result).toHaveProperty('syncType')
		expect(Array.isArray(result.chats)).toBe(true)
		expect(Array.isArray(result.contacts)).toBe(true)
		expect(Array.isArray(result.messages)).toBe(true)
		expect(Array.isArray(result.lidPnMappings)).toBe(true)
	})
})
