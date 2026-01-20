import { proto } from '../../../WAProto/index.js'
import { processHistoryMessage, extractLidPnFromConversation } from '../../Utils/history'

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

			// jidNormalizedUser preserves hosted formats (they are distinct servers)
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

			// jidNormalizedUser preserves hosted formats (they are distinct servers)
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
			// Edge case: LID chat has lidJid but no pnJid
			const result = extractLidPnFromConversation(
				'123456789012345@lid',
				'987654321098765@lid',
				undefined
			)

			expect(result).toBeUndefined()
		})

		it('should return undefined for PN chat with pnJid (no lidJid)', () => {
			// Edge case: PN chat has pnJid but no lidJid
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

			// Should have only 1 mapping (deduplicated)
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

			// jidNormalizedUser preserves hosted formats (they are distinct servers)
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

			// Should still extract from phoneNumberToLidMappings
			expect(result.lidPnMappings).toEqual([
				{ lid: '11111111111111@lid', pn: '5511999999999@s.whatsapp.net' }
			])
		})
	})
})
