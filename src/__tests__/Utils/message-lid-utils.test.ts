import type { WAMessageKey } from '../../Types'
import { extractAltJidMapping } from '../../Utils'

describe('Message LID Utils', () => {
	describe('extractAltJidMapping', () => {
		it('should return null when no alt JID exists', () => {
			const key: WAMessageKey = {
				remoteJid: '5511999999999@s.whatsapp.net',
				fromMe: false,
				id: 'msg123'
			}
			expect(extractAltJidMapping(key)).toBeNull()
		})

		it('should extract LID mapping when participantAlt is LID', () => {
			const key: WAMessageKey = {
				remoteJid: '5511999999999-1234567890@g.us',
				participant: '5511999999999@s.whatsapp.net',
				participantAlt: '12345@lid',
				fromMe: false,
				id: 'msg123'
			}

			const result = extractAltJidMapping(key)

			expect(result).not.toBeNull()
			expect(result!.mapping).toEqual({
				lid: '12345@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
			expect(result!.migrateFrom).toBe('5511999999999@s.whatsapp.net')
			expect(result!.migrateTo).toBe('12345@lid')
		})

		it('should extract PN mapping when remoteJidAlt is PN', () => {
			const key: WAMessageKey = {
				remoteJid: '12345@lid',
				remoteJidAlt: '5511999999999@s.whatsapp.net',
				fromMe: false,
				id: 'msg123'
			}

			const result = extractAltJidMapping(key)

			expect(result).not.toBeNull()
			expect(result!.mapping).toEqual({
				lid: '12345@lid',
				pn: '5511999999999@s.whatsapp.net'
			})
			expect(result!.migrateFrom).toBe('5511999999999@s.whatsapp.net')
			expect(result!.migrateTo).toBe('12345@lid')
		})

		it('should use participantAlt over remoteJidAlt', () => {
			const key: WAMessageKey = {
				remoteJid: '5511999999999-1234567890@g.us',
				participant: '5511999999999@s.whatsapp.net',
				participantAlt: '12345@lid',
				remoteJidAlt: '67890@lid',
				fromMe: false,
				id: 'msg123'
			}

			const result = extractAltJidMapping(key)

			expect(result).not.toBeNull()
			expect(result!.mapping.lid).toBe('12345@lid')
		})

		it('should return correct migration direction when alt is PN', () => {
			const key: WAMessageKey = {
				remoteJid: '12345@lid',
				remoteJidAlt: '5511999999999@s.whatsapp.net',
				fromMe: false,
				id: 'msg123'
			}

			const result = extractAltJidMapping(key)

			expect(result).not.toBeNull()
			expect(result!.migrateFrom).toBe('5511999999999@s.whatsapp.net')
			expect(result!.migrateTo).toBe('12345@lid')
		})

		it('should return null when alt exists but primary JID is missing', () => {
			const key: WAMessageKey = {
				remoteJidAlt: '12345@lid',
				fromMe: false,
				id: 'msg123'
			}

			expect(extractAltJidMapping(key)).toBeNull()
		})
	})
})
