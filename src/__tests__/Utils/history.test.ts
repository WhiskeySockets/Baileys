import { proto } from '../../../WAProto/index.js'
import {
	extractLidPnFromConversation,
	extractLidPnFromMessage,
	isPersonJid,
	processHistoryMessage
} from '../../Utils/history'

describe('processHistoryMessage', () => {
	describe('phoneNumberToLidMappings extraction', () => {
		it('should extract LID-PN mappings from history sync payload', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [],
				phoneNumberToLidMappings: [
					{ lidJid: '11111111111111@lid', pnJid: '1234567890123@s.whatsapp.net' },
					{ lidJid: '22222222222222@lid', pnJid: '9876543210987@s.whatsapp.net' }
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([
				{ lid: '11111111111111@lid', pn: '1234567890123@s.whatsapp.net' },
				{ lid: '22222222222222@lid', pn: '9876543210987@s.whatsapp.net' }
			])
		})

		it('should skip mappings with missing lidJid or pnJid', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.RECENT,
				conversations: [],
				phoneNumberToLidMappings: [
					{ lidJid: undefined, pnJid: '1234567890123@s.whatsapp.net' },
					{ lidJid: '11111111111111@lid', pnJid: undefined },
					{ lidJid: '22222222222222@lid', pnJid: '9876543210987@s.whatsapp.net' }
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([{ lid: '22222222222222@lid', pn: '9876543210987@s.whatsapp.net' }])
		})

		it('should return empty array when no mappings exist', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: []
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([])
		})

		it('should process mappings regardless of sync type', () => {
			const syncTypes = [proto.HistorySync.HistorySyncType.PUSH_NAME, proto.HistorySync.HistorySyncType.ON_DEMAND]

			for (const syncType of syncTypes) {
				const historySync: proto.IHistorySync = {
					syncType,
					conversations: [],
					pushnames: [],
					phoneNumberToLidMappings: [{ lidJid: '11111111111111@lid', pnJid: '1234567890123@s.whatsapp.net' }]
				}

				const result = processHistoryMessage(historySync)

				expect(result.lidPnMappings).toEqual([{ lid: '11111111111111@lid', pn: '1234567890123@s.whatsapp.net' }])
			}
		})
	})

	describe('conversations processing', () => {
		it('should extract contacts with LID and PN from conversations', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '1234567890123@s.whatsapp.net',
						name: 'Test User',
						lidJid: '11111111111111@lid',
						pnJid: '1234567890123@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.contacts).toHaveLength(1)
			expect(result.contacts[0]).toEqual({
				id: '1234567890123@s.whatsapp.net',
				name: 'Test User',
				lid: '11111111111111@lid',
				phoneNumber: '1234567890123@s.whatsapp.net'
			})
		})

		it('should extract LID-PN mappings from conversation lidJid/pnJid properties', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '1234567890123@s.whatsapp.net',
						name: 'Test User',
						lidJid: '11111111111111@lid',
						pnJid: '1234567890123@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			// Should include mapping extracted from conversation
			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@lid',
				pn: '1234567890123@s.whatsapp.net'
			})
		})

		it('should NOT extract LID-PN mappings from group conversations', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '123456789@g.us',
						name: 'Test Group',
						lidJid: '11111111111111@lid',
						pnJid: '1234567890123@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			// Should NOT include mapping from group conversation
			expect(result.lidPnMappings).toEqual([])
		})
	})
})

describe('isPersonJid', () => {
	it('should return true for LID users', () => {
		expect(isPersonJid('11111111111111@lid')).toBe(true)
	})

	it('should return true for hosted LID users', () => {
		expect(isPersonJid('11111111111111@hosted.lid')).toBe(true)
	})

	it('should return true for PN users (s.whatsapp.net)', () => {
		expect(isPersonJid('1234567890123@s.whatsapp.net')).toBe(true)
	})

	it('should return true for hosted PN users', () => {
		expect(isPersonJid('1234567890123@hosted')).toBe(true)
	})

	it('should return false for groups', () => {
		expect(isPersonJid('123456789@g.us')).toBe(false)
	})

	it('should return false for broadcasts', () => {
		expect(isPersonJid('status@broadcast')).toBe(false)
	})

	it('should return false for newsletters', () => {
		expect(isPersonJid('123456789@newsletter')).toBe(false)
	})

	it('should return false for undefined', () => {
		expect(isPersonJid(undefined)).toBe(false)
	})

	it('should return false for empty string', () => {
		expect(isPersonJid('')).toBe(false)
	})
})

describe('extractLidPnFromConversation', () => {
	it('should extract mapping when chat is PN and lidJid is provided', () => {
		const result = extractLidPnFromConversation(
			'1234567890123@s.whatsapp.net',
			'11111111111111@lid',
			null
		)

		expect(result).toEqual({
			lid: '11111111111111@lid',
			pn: '1234567890123@s.whatsapp.net'
		})
	})

	it('should extract mapping when chat is LID and pnJid is provided', () => {
		const result = extractLidPnFromConversation(
			'11111111111111@lid',
			null,
			'1234567890123@s.whatsapp.net'
		)

		expect(result).toEqual({
			lid: '11111111111111@lid',
			pn: '1234567890123@s.whatsapp.net'
		})
	})

	it('should return undefined for group chats', () => {
		const result = extractLidPnFromConversation(
			'123456789@g.us',
			'11111111111111@lid',
			'1234567890123@s.whatsapp.net'
		)

		expect(result).toBeUndefined()
	})

	it('should return undefined for broadcast chats', () => {
		const result = extractLidPnFromConversation(
			'status@broadcast',
			'11111111111111@lid',
			'1234567890123@s.whatsapp.net'
		)

		expect(result).toBeUndefined()
	})

	it('should return undefined for newsletter chats', () => {
		const result = extractLidPnFromConversation(
			'123456789@newsletter',
			'11111111111111@lid',
			'1234567890123@s.whatsapp.net'
		)

		expect(result).toBeUndefined()
	})

	it('should return undefined when no mapping data is provided', () => {
		const result = extractLidPnFromConversation(
			'1234567890123@s.whatsapp.net',
			null,
			null
		)

		expect(result).toBeUndefined()
	})
})

describe('extractLidPnFromMessage', () => {
	it('should extract mapping when primary is LID and alt is PN', () => {
		const result = extractLidPnFromMessage(
			'11111111111111@lid',
			'1234567890123@s.whatsapp.net',
			null,
			null
		)

		expect(result).toEqual({
			lid: '11111111111111@lid',
			pn: '1234567890123@s.whatsapp.net'
		})
	})

	it('should extract mapping when primary is PN and alt is LID', () => {
		const result = extractLidPnFromMessage(
			'1234567890123@s.whatsapp.net',
			'11111111111111@lid',
			null,
			null
		)

		expect(result).toEqual({
			lid: '11111111111111@lid',
			pn: '1234567890123@s.whatsapp.net'
		})
	})

	it('should prefer participant over remoteJid', () => {
		const result = extractLidPnFromMessage(
			'11111111111111@lid',
			'22222222222222@lid',
			'33333333333333@lid',
			'1234567890123@s.whatsapp.net'
		)

		// participant (33333333333333@lid) and participantAlt (1234567890123@s.whatsapp.net) should be used
		expect(result).toEqual({
			lid: '33333333333333@lid',
			pn: '1234567890123@s.whatsapp.net'
		})
	})

	it('should return undefined when primaryJid is missing', () => {
		const result = extractLidPnFromMessage(
			null,
			'1234567890123@s.whatsapp.net',
			null,
			null
		)

		expect(result).toBeUndefined()
	})

	it('should return undefined when altJid is missing', () => {
		const result = extractLidPnFromMessage(
			'11111111111111@lid',
			null,
			null,
			null
		)

		expect(result).toBeUndefined()
	})

	// CRITICAL: Edge cases for the && vs || fix
	describe('edge cases for mixed JID types (bug fix validation)', () => {
		it('should return undefined when primary is person but alt is GROUP', () => {
			const result = extractLidPnFromMessage(
				'11111111111111@lid',
				'123456789@g.us', // group JID
				null,
				null
			)

			// With the fix (using ||), this should return undefined
			// because group JIDs cannot be part of a valid LID-PN mapping
			expect(result).toBeUndefined()
		})

		it('should return undefined when primary is person but alt is BROADCAST', () => {
			const result = extractLidPnFromMessage(
				'11111111111111@lid',
				'status@broadcast', // broadcast JID
				null,
				null
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when primary is person but alt is NEWSLETTER', () => {
			const result = extractLidPnFromMessage(
				'11111111111111@lid',
				'123456789@newsletter', // newsletter JID
				null,
				null
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when alt is person but primary is GROUP', () => {
			const result = extractLidPnFromMessage(
				'123456789@g.us', // group JID
				'1234567890123@s.whatsapp.net',
				null,
				null
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when alt is person but primary is BROADCAST', () => {
			const result = extractLidPnFromMessage(
				'status@broadcast', // broadcast JID
				'1234567890123@s.whatsapp.net',
				null,
				null
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when alt is person but primary is NEWSLETTER', () => {
			const result = extractLidPnFromMessage(
				'123456789@newsletter', // newsletter JID
				'1234567890123@s.whatsapp.net',
				null,
				null
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when BOTH are non-person JIDs', () => {
			const result = extractLidPnFromMessage(
				'123456789@g.us', // group JID
				'status@broadcast', // broadcast JID
				null,
				null
			)

			expect(result).toBeUndefined()
		})
	})

	it('should return undefined when both are same type (both LID)', () => {
		const result = extractLidPnFromMessage(
			'11111111111111@lid',
			'22222222222222@lid',
			null,
			null
		)

		// Both are LID, no PN - can't determine mapping
		expect(result).toBeUndefined()
	})

	it('should return undefined when both are same type (both PN)', () => {
		const result = extractLidPnFromMessage(
			'1234567890123@s.whatsapp.net',
			'9876543210987@s.whatsapp.net',
			null,
			null
		)

		// Both are PN, no LID - can't determine mapping
		expect(result).toBeUndefined()
	})
})
