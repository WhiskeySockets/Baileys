import { proto } from '../../../WAProto/index.js'
import {
	processHistoryMessage,
	extractLidPnFromConversation,
	extractLidPnFromMessage,
	isPersonJid
} from '../../Utils/history'

describe('isPersonJid', () => {
	it('should return true for @s.whatsapp.net format', () => {
		expect(isPersonJid('5511999999999@s.whatsapp.net')).toBe(true)
	})

	it('should return true for @lid format', () => {
		expect(isPersonJid('123456789012345@lid')).toBe(true)
	})

	it('should return true for @hosted format', () => {
		expect(isPersonJid('5511999999999@hosted')).toBe(true)
	})

	it('should return true for @hosted.lid format', () => {
		expect(isPersonJid('123456789012345@hosted.lid')).toBe(true)
	})

	it('should return false for @g.us (groups)', () => {
		expect(isPersonJid('123456789012345@g.us')).toBe(false)
	})

	it('should return false for @broadcast', () => {
		expect(isPersonJid('status@broadcast')).toBe(false)
	})

	it('should return false for @newsletter (channels)', () => {
		expect(isPersonJid('123456789012345@newsletter')).toBe(false)
	})

	it('should return false for undefined', () => {
		expect(isPersonJid(undefined)).toBe(false)
	})

	it('should return false for empty string', () => {
		expect(isPersonJid('')).toBe(false)
	})
})

describe('extractLidPnFromMessage', () => {
	describe('direct messages', () => {
		it('should extract mapping when remoteJid is LID and remoteJidAlt is PN', () => {
			const result = extractLidPnFromMessage(
				'123456789012345@lid',
				'5511999999999@s.whatsapp.net',
				undefined,
				undefined
			)

			expect(result).toEqual({
				lid: '123456789012345@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})

		it('should extract mapping when remoteJid is PN and remoteJidAlt is LID', () => {
			const result = extractLidPnFromMessage(
				'5511999999999@s.whatsapp.net',
				'123456789012345@lid',
				undefined,
				undefined
			)

			expect(result).toEqual({
				lid: '123456789012345@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})
	})

	describe('group messages', () => {
		it('should extract mapping from participant fields in groups', () => {
			const result = extractLidPnFromMessage(
				'123456789012345@g.us', // group JID
				undefined,
				'5511999999999@s.whatsapp.net', // participant
				'123456789012345@lid' // participantAlt
			)

			expect(result).toEqual({
				lid: '123456789012345@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})

		it('should prefer participant over remoteJid for mapping', () => {
			const result = extractLidPnFromMessage(
				'5511888888888@s.whatsapp.net', // ignored
				'987654321098765@lid', // ignored
				'5511999999999@s.whatsapp.net', // participant used
				'123456789012345@lid' // participantAlt used
			)

			expect(result).toEqual({
				lid: '123456789012345@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})
	})

	describe('edge cases', () => {
		it('should return undefined when no alt JID is present', () => {
			const result = extractLidPnFromMessage(
				'5511999999999@s.whatsapp.net',
				undefined,
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when both are same type (LID)', () => {
			const result = extractLidPnFromMessage(
				'123456789012345@lid',
				'987654321098765@lid',
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when both are same type (PN)', () => {
			const result = extractLidPnFromMessage(
				'5511999999999@s.whatsapp.net',
				'5511888888888@s.whatsapp.net',
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined for newsletter messages', () => {
			const result = extractLidPnFromMessage(
				'123456789012345@newsletter',
				undefined,
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		// CRITICAL: Edge cases for the && vs || fix (bug fix validation)
		it('should return undefined when primary is person but alt is GROUP', () => {
			const result = extractLidPnFromMessage(
				'123456789012345@lid',
				'123456789@g.us', // group JID
				undefined,
				undefined
			)

			// With the fix (using ||), this should return undefined
			// because group JIDs cannot be part of a valid LID-PN mapping
			expect(result).toBeUndefined()
		})

		it('should return undefined when primary is person but alt is BROADCAST', () => {
			const result = extractLidPnFromMessage(
				'123456789012345@lid',
				'status@broadcast', // broadcast JID
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when primary is person but alt is NEWSLETTER', () => {
			const result = extractLidPnFromMessage(
				'123456789012345@lid',
				'123456789@newsletter', // newsletter JID
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when alt is person but primary is GROUP', () => {
			const result = extractLidPnFromMessage(
				'123456789@g.us', // group JID
				'5511999999999@s.whatsapp.net',
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when alt is person but primary is BROADCAST', () => {
			const result = extractLidPnFromMessage(
				'status@broadcast', // broadcast JID
				'5511999999999@s.whatsapp.net',
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when alt is person but primary is NEWSLETTER', () => {
			const result = extractLidPnFromMessage(
				'123456789@newsletter', // newsletter JID
				'5511999999999@s.whatsapp.net',
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when BOTH are non-person JIDs', () => {
			const result = extractLidPnFromMessage(
				'123456789@g.us', // group JID
				'status@broadcast', // broadcast JID
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})
	})
})

describe('extractLidPnFromConversation', () => {
	describe('LID chat with pnJid', () => {
		it('should extract mapping when chat ID is @lid format with pnJid', () => {
			const result = extractLidPnFromConversation(
				'123456789012345@lid',
				undefined,
				'5511999999999@s.whatsapp.net'
			)

			expect(result).toEqual({
				lid: '123456789012345@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})

		it('should extract mapping when chat ID is @hosted.lid format with pnJid', () => {
			const result = extractLidPnFromConversation(
				'123456789012345@hosted.lid',
				undefined,
				'5511999999999@hosted'
			)

			expect(result).toEqual({
				lid: '123456789012345@hosted.lid',
				pn: '5511999999999@hosted'
			})
		})
	})

	describe('PN chat with lidJid', () => {
		it('should extract mapping when chat ID is @s.whatsapp.net format with lidJid', () => {
			const result = extractLidPnFromConversation(
				'5511999999999@s.whatsapp.net',
				'123456789012345@lid',
				undefined
			)

			expect(result).toEqual({
				lid: '123456789012345@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})

		it('should extract mapping when chat ID is @hosted format with lidJid', () => {
			const result = extractLidPnFromConversation(
				'5511999999999@hosted',
				'123456789012345@hosted.lid',
				undefined
			)

			expect(result).toEqual({
				lid: '123456789012345@hosted.lid',
				pn: '5511999999999@hosted'
			})
		})
	})

	describe('edge cases', () => {
		it('should return undefined for group chats', () => {
			const result = extractLidPnFromConversation(
				'123456789012345@g.us',
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined for newsletters (@newsletter)', () => {
			const result = extractLidPnFromConversation(
				'123456789012345@newsletter',
				'11111111111111@lid',
				'5511999999999@s.whatsapp.net'
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined for broadcast lists (@broadcast)', () => {
			const result = extractLidPnFromConversation(
				'status@broadcast',
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when no alternate JID is available', () => {
			const result = extractLidPnFromConversation(
				'123456789012345@lid',
				undefined,
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined when both lidJid and pnJid are null', () => {
			const result = extractLidPnFromConversation(
				'5511999999999@s.whatsapp.net',
				null,
				null
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined for LID chat with lidJid (no pnJid)', () => {
			const result = extractLidPnFromConversation(
				'123456789012345@lid',
				'987654321098765@lid',
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined for PN chat with pnJid (no lidJid)', () => {
			const result = extractLidPnFromConversation(
				'5511999999999@s.whatsapp.net',
				undefined,
				'5511888888888@s.whatsapp.net'
			)

			expect(result).toBeUndefined()
		})
	})
})

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

			expect(result.lidPnMappings).toEqual([])
		})
	})

	describe('LID-PN extraction from conversations', () => {
		it('should extract LID-PN mapping when chat ID is LID with pnJid', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '11111111111111@lid',
						name: 'LID User',
						pnJid: '5511999999999@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([
				{ lid: '11111111111111@lid', pn: '5511999999999@s.whatsapp.net' }
			])
		})

		it('should extract LID-PN mapping when chat ID is PN with lidJid', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '5511999999999@s.whatsapp.net',
						name: 'PN User',
						lidJid: '11111111111111@lid'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([
				{ lid: '11111111111111@lid', pn: '5511999999999@s.whatsapp.net' }
			])
		})

		it('should deduplicate mappings from both sources', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				phoneNumberToLidMappings: [
					{ lidJid: '11111111111111@lid', pnJid: '5511999999999@s.whatsapp.net' }
				],
				conversations: [
					{
						id: '11111111111111@lid',
						name: 'Same User',
						pnJid: '5511999999999@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toHaveLength(1)
			expect(result.lidPnMappings[0]).toEqual({
				lid: '11111111111111@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})

		it('should combine mappings from both sources', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				phoneNumberToLidMappings: [
					{ lidJid: '11111111111111@lid', pnJid: '5511999999999@s.whatsapp.net' }
				],
				conversations: [
					{
						id: '22222222222222@lid',
						name: 'Different User',
						pnJid: '5511888888888@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toHaveLength(2)
			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
			expect(result.lidPnMappings).toContainEqual({
				lid: '22222222222222@lid',
				pn: '5511888888888@s.whatsapp.net'
			})
		})

		it('should not extract mapping from group chats', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '123456789012345@g.us',
						name: 'Group Chat'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([])
		})

		it('should handle hosted LID format', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '11111111111111@hosted.lid',
						name: 'Hosted LID User',
						pnJid: '5511999999999@hosted'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([
				{ lid: '11111111111111@hosted.lid', pn: '5511999999999@hosted' }
			])
		})

		it('should extract mappings for all conversation sync types', () => {
			const syncTypes = [
				proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				proto.HistorySync.HistorySyncType.RECENT,
				proto.HistorySync.HistorySyncType.FULL,
				proto.HistorySync.HistorySyncType.ON_DEMAND
			]

			for (const syncType of syncTypes) {
				const historySync: proto.IHistorySync = {
					syncType,
					conversations: [
						{
							id: '11111111111111@lid',
							pnJid: '5511999999999@s.whatsapp.net'
						}
					]
				}

				const result = processHistoryMessage(historySync)

				expect(result.lidPnMappings).toEqual([
					{ lid: '11111111111111@lid', pn: '5511999999999@s.whatsapp.net' }
				])
			}
		})

		it('should not extract conversation mappings for PUSH_NAME sync type', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.PUSH_NAME,
				pushnames: [
					{ id: '5511999999999@s.whatsapp.net', pushname: 'User Name' }
				],
				phoneNumberToLidMappings: [
					{ lidJid: '11111111111111@lid', pnJid: '5511999999999@s.whatsapp.net' }
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([
				{ lid: '11111111111111@lid', pn: '5511999999999@s.whatsapp.net' }
			])
		})

		it('should not extract mapping from newsletter conversations', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '123456789012345@newsletter',
						name: 'News Channel'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([])
		})

		it('should not extract mapping from broadcast conversations', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: 'status@broadcast',
						name: 'Status'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([])
		})
	})

	describe('LID-PN extraction from messages (remoteJidAlt)', () => {
		it('should extract mapping from message with remoteJidAlt', () => {
			const historySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '5511999999999@s.whatsapp.net',
						name: 'User',
						messages: [
							{
								message: {
									key: {
										remoteJid: '5511999999999@s.whatsapp.net',
										remoteJidAlt: '11111111111111@lid',
										id: 'MSG123',
										fromMe: false
									},
									messageTimestamp: 1234567890
								}
							}
						]
					}
				]
			} as unknown as proto.IHistorySync

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})

		it('should extract mapping from group message with participantAlt', () => {
			const historySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '123456789012345@g.us',
						name: 'Group Chat',
						messages: [
							{
								message: {
									key: {
										remoteJid: '123456789012345@g.us',
										participant: '5511999999999@s.whatsapp.net',
										participantAlt: '11111111111111@lid',
										id: 'MSG456',
										fromMe: false
									},
									messageTimestamp: 1234567890
								}
							}
						]
					}
				]
			} as unknown as proto.IHistorySync

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})

		it('should deduplicate mappings from all three sources', () => {
			const historySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				phoneNumberToLidMappings: [
					{ lidJid: '11111111111111@lid', pnJid: '5511999999999@s.whatsapp.net' }
				],
				conversations: [
					{
						id: '11111111111111@lid',
						name: 'User',
						pnJid: '5511999999999@s.whatsapp.net',
						messages: [
							{
								message: {
									key: {
										remoteJid: '11111111111111@lid',
										remoteJidAlt: '5511999999999@s.whatsapp.net',
										id: 'MSG789',
										fromMe: true
									},
									messageTimestamp: 1234567890
								}
							}
						]
					}
				]
			} as unknown as proto.IHistorySync

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toHaveLength(1)
			expect(result.lidPnMappings[0]).toEqual({
				lid: '11111111111111@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
		})
	})
})
