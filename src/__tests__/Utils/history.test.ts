import { proto } from '../../../WAProto/index.js'
import { processHistoryMessage } from '../../Utils/history'

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
})
