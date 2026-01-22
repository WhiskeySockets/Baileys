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

	describe('LID-PN mapping extraction from conversations', () => {
		it('should extract mapping when chat.id is LID and pnJid exists', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '11111111111111@lid',
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

		it('should extract mapping when chat.id is PN and lidJid exists', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '1234567890123@s.whatsapp.net',
						lidJid: '11111111111111@lid'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@lid',
				pn: '1234567890123@s.whatsapp.net'
			})
		})

		it('should not extract mapping for group chats', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '123456789012345678@g.us',
						lidJid: '11111111111111@lid',
						pnJid: '1234567890123@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([])
		})

		it('should combine mappings from phoneNumberToLidMappings and conversations', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				phoneNumberToLidMappings: [{ lidJid: '11111111111111@lid', pnJid: '1111111111111@s.whatsapp.net' }],
				conversations: [
					{
						id: '22222222222222@lid',
						pnJid: '2222222222222@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toHaveLength(2)
			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@lid',
				pn: '1111111111111@s.whatsapp.net'
			})
			expect(result.lidPnMappings).toContainEqual({
				lid: '22222222222222@lid',
				pn: '2222222222222@s.whatsapp.net'
			})
		})

		it('should extract mapping for hosted LID users', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '11111111111111@hosted.lid',
						pnJid: '1234567890123@hosted'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@hosted.lid',
				pn: '1234567890123@hosted'
			})
		})

		it('should extract mapping for hosted PN users', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '1234567890123@hosted',
						lidJid: '11111111111111@hosted.lid'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@hosted.lid',
				pn: '1234567890123@hosted'
			})
		})

		it('should extract mapping from userReceipt when pnJid is missing and chat.id is LID', () => {
			// Based on real-world case: LID chat without pnJid but userReceipt contains PN
			// See: https://github.com/WhiskeySockets/Baileys/pull/2282#issuecomment-3777941679
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '211071956705386@lid',
						// pnJid is intentionally missing
						messages: [
							{
								message: {
									key: {
										remoteJid: '211071956705386@lid',
										fromMe: true,
										id: '3EB052FF8D9D00646C9994'
									},
									messageTimestamp: 1768320044,
									userReceipt: [
										{
											userJid: '5518999991234@s.whatsapp.net',
											receiptTimestamp: 1768320045,
											readTimestamp: 1768327083
										}
									]
								}
							}
						]
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toContainEqual({
				lid: '211071956705386@lid',
				pn: '5518999991234@s.whatsapp.net'
			})
		})

		it('should not extract mapping from userReceipt when pnJid already exists', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '211071956705386@lid',
						pnJid: '5518888881234@s.whatsapp.net', // pnJid exists
						messages: [
							{
								message: {
									key: {
										remoteJid: '211071956705386@lid',
										fromMe: true,
										id: '3EB052FF8D9D00646C9994'
									},
									userReceipt: [
										{
											userJid: '5518999991234@s.whatsapp.net' // different PN
										}
									]
								}
							}
						]
					}
				]
			}

			const result = processHistoryMessage(historySync)

			// Should use pnJid, not userReceipt
			expect(result.lidPnMappings).toContainEqual({
				lid: '211071956705386@lid',
				pn: '5518888881234@s.whatsapp.net'
			})
			// Should NOT contain the userReceipt PN
			expect(result.lidPnMappings).not.toContainEqual({
				lid: '211071956705386@lid',
				pn: '5518999991234@s.whatsapp.net'
			})
		})

		it('should not extract mapping from userReceipt when fromMe is false', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '211071956705386@lid',
						messages: [
							{
								message: {
									key: {
										remoteJid: '211071956705386@lid',
										fromMe: false, // Not from me
										id: '3EB052FF8D9D00646C9994'
									},
									userReceipt: [
										{
											userJid: '5518999991234@s.whatsapp.net'
										}
									]
								}
							}
						]
					}
				]
			}

			const result = processHistoryMessage(historySync)

			// Should not extract mapping when fromMe is false
			expect(result.lidPnMappings).not.toContainEqual({
				lid: '211071956705386@lid',
				pn: '5518999991234@s.whatsapp.net'
			})
		})

		it('should not extract mapping from userReceipt when userJid is also a LID', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '211071956705386@lid',
						messages: [
							{
								message: {
									key: {
										remoteJid: '211071956705386@lid',
										fromMe: true,
										id: '3EB052FF8D9D00646C9994'
									},
									userReceipt: [
										{
											userJid: '152230971891797@lid' // Also a LID, not a PN
										}
									]
								}
							}
						]
					}
				]
			}

			const result = processHistoryMessage(historySync)

			// Should not create a LID->LID mapping
			expect(result.lidPnMappings).toHaveLength(0)
		})
	})
})
