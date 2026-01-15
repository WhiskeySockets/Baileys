import type { WAMessage } from '../../Types'
import { determineReceiptType, shouldUseLidForParticipant, prepareMessageReceipt } from '../../Utils'

describe('Receipt Utils - determineReceiptType', () => {
	it('should return peer_msg for peer category', () => {
		expect(determineReceiptType({
			category: 'peer',
			isFromMe: false,
			sendActiveReceipts: true
		})).toBe('peer_msg')
	})

	it('should return sender when fromMe is true', () => {
		expect(determineReceiptType({
			category: 'message',
			isFromMe: true,
			sendActiveReceipts: true
		})).toBe('sender')
	})

	it('should return inactive when sendActiveReceipts is false', () => {
		expect(determineReceiptType({
			category: 'message',
			isFromMe: false,
			sendActiveReceipts: false
		})).toBe('inactive')
	})

	it('should return undefined (delivered) for normal message', () => {
		expect(determineReceiptType({
			category: 'message',
			isFromMe: false,
			sendActiveReceipts: true
		})).toBeUndefined()
	})

	it('should prioritize peer_msg over other conditions', () => {
		expect(determineReceiptType({
			category: 'peer',
			isFromMe: true,
			sendActiveReceipts: false
		})).toBe('peer_msg')
	})
})

describe('Receipt Utils - shouldUseLidForParticipant', () => {
	it('should return true when remoteJid is LID', () => {
		expect(shouldUseLidForParticipant('12345@lid', undefined)).toBe(true)
	})

	it('should return true when remoteJidAlt is LID', () => {
		expect(shouldUseLidForParticipant('5511999999999@s.whatsapp.net', '12345@lid')).toBe(true)
	})

	it('should return false when both are PN', () => {
		expect(shouldUseLidForParticipant(
			'5511999999999@s.whatsapp.net',
			'5522888888888@s.whatsapp.net'
		)).toBe(false)
	})

	it('should return false when both are undefined', () => {
		expect(shouldUseLidForParticipant(undefined, undefined)).toBe(false)
	})

	it('should return false when remoteJid is PN and remoteJidAlt is undefined', () => {
		expect(shouldUseLidForParticipant('5511999999999@s.whatsapp.net', undefined)).toBe(false)
	})
})

describe('Receipt Utils - prepareMessageReceipt', () => {
	it('should return shouldSendReceipt false for newsletter', () => {
		const msg = {
			key: {
				remoteJid: '1234567890@newsletter',
				fromMe: false,
				id: 'msg123'
			}
		} as WAMessage

		const result = prepareMessageReceipt(msg, 'message', 'author@s.whatsapp.net', true)

		expect(result.shouldSendReceipt).toBe(false)
	})

	it('should return correct type for peer message', () => {
		const msg = {
			key: {
				remoteJid: '5511999999999@s.whatsapp.net',
				fromMe: false,
				id: 'msg123'
			},
			message: {}
		} as WAMessage

		const result = prepareMessageReceipt(msg, 'peer', 'author@s.whatsapp.net', true)

		expect(result.shouldSendReceipt).toBe(true)
		expect(result.type).toBe('peer_msg')
	})

	it('should return sender type for fromMe message', () => {
		const msg = {
			key: {
				remoteJid: '5511999999999@s.whatsapp.net',
				fromMe: true,
				id: 'msg123'
			},
			message: {}
		} as WAMessage

		const result = prepareMessageReceipt(msg, 'message', 'author@s.whatsapp.net', true)

		expect(result.shouldSendReceipt).toBe(true)
		expect(result.type).toBe('sender')
	})

	it('should override participant with author for LID remoteJid', () => {
		const msg = {
			key: {
				remoteJid: '12345@lid',
				participant: 'original@s.whatsapp.net',
				fromMe: true,
				id: 'msg123'
			},
			message: {}
		} as WAMessage

		const result = prepareMessageReceipt(msg, 'message', 'author@lid', true)

		expect(result.participant).toBe('author@lid')
	})

	it('should keep original participant for non-LID', () => {
		const msg = {
			key: {
				remoteJid: '5511999999999@s.whatsapp.net',
				participant: 'original@s.whatsapp.net',
				fromMe: true,
				id: 'msg123'
			},
			message: {}
		} as WAMessage

		const result = prepareMessageReceipt(msg, 'message', 'author@s.whatsapp.net', true)

		expect(result.participant).toBe('original@s.whatsapp.net')
	})

	it('should return inactive type when sendActiveReceipts is false', () => {
		const msg = {
			key: {
				remoteJid: '5511999999999@s.whatsapp.net',
				fromMe: false,
				id: 'msg123'
			},
			message: {}
		} as WAMessage

		const result = prepareMessageReceipt(msg, 'message', 'author@s.whatsapp.net', false)

		expect(result.type).toBe('inactive')
	})
})
