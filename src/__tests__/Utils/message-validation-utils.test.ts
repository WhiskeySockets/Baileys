import type { BinaryNode } from '../../WABinary'
import { isMsmsgEncryption, shouldSkipMessage } from '../../Utils'

describe('Message Validation Utils', () => {
	describe('isMsmsgEncryption', () => {
		it('should return true for msmsg encryption type', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {},
				content: [
					{
						tag: 'enc',
						attrs: { type: 'msmsg' }
					}
				]
			}
			expect(isMsmsgEncryption(node)).toBe(true)
		})

		it('should return false for other encryption types', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {},
				content: [
					{
						tag: 'enc',
						attrs: { type: 'pkmsg' }
					}
				]
			}
			expect(isMsmsgEncryption(node)).toBe(false)
		})

		it('should return false when no enc node exists', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {},
				content: []
			}
			expect(isMsmsgEncryption(node)).toBe(false)
		})

		it('should return false when enc node has no type', () => {
			const node: BinaryNode = {
				tag: 'message',
				attrs: {},
				content: [
					{
						tag: 'enc',
						attrs: {}
					}
				]
			}
			expect(isMsmsgEncryption(node)).toBe(false)
		})
	})

	describe('shouldSkipMessage', () => {
		it('should return true when JID is ignored and not server JID', () => {
			const shouldIgnoreJid = (jid: string) => jid.includes('blocked')
			expect(shouldSkipMessage('blocked@s.whatsapp.net', shouldIgnoreJid, 's.whatsapp.net')).toBe(true)
		})

		it('should return false when JID is server JID', () => {
			const shouldIgnoreJid = () => true
			expect(shouldSkipMessage('s.whatsapp.net', shouldIgnoreJid, 's.whatsapp.net')).toBe(false)
		})

		it('should return false when JID is not ignored', () => {
			const shouldIgnoreJid = () => false
			expect(shouldSkipMessage('user@s.whatsapp.net', shouldIgnoreJid, 's.whatsapp.net')).toBe(false)
		})

		it('should handle undefined return from shouldIgnoreJid', () => {
			const shouldIgnoreJid = () => undefined
			expect(shouldSkipMessage('user@s.whatsapp.net', shouldIgnoreJid, 's.whatsapp.net')).toBe(false)
		})
	})
})
