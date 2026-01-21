import { describe, it, expect } from '@jest/globals'
import {
	isPersonJid,
	extractLidPnFromConversation,
	extractLidPnFromMessage
} from '../../Utils/history'

describe('isPersonJid', () => {
	it('should return true for valid PN JIDs', () => {
		expect(isPersonJid('5511999999999@s.whatsapp.net')).toBe(true)
		expect(isPersonJid('1234567890@s.whatsapp.net')).toBe(true)
	})

	it('should return true for valid LID JIDs', () => {
		expect(isPersonJid('123456789@lid')).toBe(true)
		expect(isPersonJid('987654321@lid')).toBe(true)
	})

	it('should return true for hosted JIDs', () => {
		expect(isPersonJid('123456789@hosted')).toBe(true)
		expect(isPersonJid('123456789@hosted.lid')).toBe(true)
	})

	it('should return false for group JIDs', () => {
		expect(isPersonJid('123456789@g.us')).toBe(false)
		expect(isPersonJid('group-id@g.us')).toBe(false)
	})

	it('should return false for broadcast JIDs', () => {
		expect(isPersonJid('status@broadcast')).toBe(false)
		expect(isPersonJid('123@broadcast')).toBe(false)
	})

	it('should return false for newsletter JIDs', () => {
		expect(isPersonJid('123456789@newsletter')).toBe(false)
	})

	it('should return false for undefined/null/empty', () => {
		expect(isPersonJid(undefined)).toBe(false)
		expect(isPersonJid('')).toBe(false)
	})
})

describe('extractLidPnFromConversation', () => {
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

	it('should return undefined for group chats', () => {
		const result = extractLidPnFromConversation(
			'123456789@g.us',
			'987654321@lid',
			'5511999999999@s.whatsapp.net'
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined for newsletters', () => {
		const result = extractLidPnFromConversation(
			'123456789@newsletter',
			undefined,
			undefined
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

	it('should handle hosted LID format', () => {
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
})

describe('extractLidPnFromMessage', () => {
	it('should extract mapping from remoteJid and remoteJidAlt', () => {
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

	it('should extract mapping from participant and participantAlt for group messages', () => {
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

	it('should return undefined when primary is group (prevents poisoned mappings)', () => {
		// This tests the critical || fix from PR #21
		const result = extractLidPnFromMessage(
			'group@g.us',
			'123456789@lid',
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when alt is newsletter (prevents poisoned mappings)', () => {
		const result = extractLidPnFromMessage(
			'123456789@lid',
			'channel@newsletter',
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when both JIDs are same type (both LID)', () => {
		const result = extractLidPnFromMessage(
			'123456789@lid',
			'987654321@lid',
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when both JIDs are same type (both PN)', () => {
		const result = extractLidPnFromMessage(
			'5511999999999@s.whatsapp.net',
			'5522888888888@s.whatsapp.net',
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should return undefined when no alt JID provided', () => {
		const result = extractLidPnFromMessage(
			'123456789@lid',
			null,
			null,
			null
		)
		expect(result).toBeUndefined()
	})

	it('should handle reverse order (PN primary, LID alt)', () => {
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
})
