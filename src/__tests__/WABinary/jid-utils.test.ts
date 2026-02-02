import { describe, expect, it } from '@jest/globals'
import { isAnyLidUser, isAnyPnUser, isHostedLidUser, isHostedPnUser, isLidUser, isPnUser } from '../../WABinary/jid-utils'

describe('JID Utility Functions', () => {
	describe('isAnyLidUser', () => {
		it('should return true for regular LID users', () => {
			expect(isAnyLidUser('1234567890@lid')).toBe(true)
			expect(isAnyLidUser('1234567890:1@lid')).toBe(true)
			expect(isAnyLidUser('1234567890:99@lid')).toBe(true)
		})

		it('should return true for hosted LID users', () => {
			expect(isAnyLidUser('1234567890@hosted.lid')).toBe(true)
			expect(isAnyLidUser('1234567890:1@hosted.lid')).toBe(true)
			expect(isAnyLidUser('1234567890:99@hosted.lid')).toBe(true)
		})

		it('should return false for PN users', () => {
			expect(isAnyLidUser('1234567890@s.whatsapp.net')).toBe(false)
			expect(isAnyLidUser('1234567890:1@s.whatsapp.net')).toBe(false)
		})

		it('should return false for hosted PN users', () => {
			expect(isAnyLidUser('1234567890@hosted')).toBe(false)
			expect(isAnyLidUser('1234567890:1@hosted')).toBe(false)
		})

		it('should return false for groups', () => {
			expect(isAnyLidUser('123456789@g.us')).toBe(false)
		})

		it('should return false for newsletters', () => {
			expect(isAnyLidUser('123456789@newsletter')).toBe(false)
		})

		it('should return false for broadcasts', () => {
			expect(isAnyLidUser('status@broadcast')).toBe(false)
		})

		it('should return false for undefined or empty strings', () => {
			expect(isAnyLidUser(undefined)).toBe(false)
			expect(isAnyLidUser('')).toBe(false)
		})

		it('should handle edge cases', () => {
			expect(isAnyLidUser('invalid')).toBe(false)
			expect(isAnyLidUser('@lid')).toBe(true)
			expect(isAnyLidUser('@hosted.lid')).toBe(true)
		})
	})

	describe('isAnyPnUser', () => {
		it('should return true for regular PN users', () => {
			expect(isAnyPnUser('1234567890@s.whatsapp.net')).toBe(true)
			expect(isAnyPnUser('1234567890:1@s.whatsapp.net')).toBe(true)
			expect(isAnyPnUser('1234567890:99@s.whatsapp.net')).toBe(true)
		})

		it('should return true for hosted PN users', () => {
			expect(isAnyPnUser('1234567890@hosted')).toBe(true)
			expect(isAnyPnUser('1234567890:1@hosted')).toBe(true)
			expect(isAnyPnUser('1234567890:99@hosted')).toBe(true)
		})

		it('should return false for LID users', () => {
			expect(isAnyPnUser('1234567890@lid')).toBe(false)
			expect(isAnyPnUser('1234567890:1@lid')).toBe(false)
		})

		it('should return false for hosted LID users', () => {
			expect(isAnyPnUser('1234567890@hosted.lid')).toBe(false)
			expect(isAnyPnUser('1234567890:1@hosted.lid')).toBe(false)
		})

		it('should return false for groups', () => {
			expect(isAnyPnUser('123456789@g.us')).toBe(false)
		})

		it('should return false for newsletters', () => {
			expect(isAnyPnUser('123456789@newsletter')).toBe(false)
		})

		it('should return false for broadcasts', () => {
			expect(isAnyPnUser('status@broadcast')).toBe(false)
		})

		it('should return false for undefined or empty strings', () => {
			expect(isAnyPnUser(undefined)).toBe(false)
			expect(isAnyPnUser('')).toBe(false)
		})

		it('should handle edge cases', () => {
			expect(isAnyPnUser('invalid')).toBe(false)
			expect(isAnyPnUser('@s.whatsapp.net')).toBe(true)
			expect(isAnyPnUser('@hosted')).toBe(true)
		})
	})

	describe('isAnyLidUser vs individual checks', () => {
		it('should be equivalent to !!(isLidUser || isHostedLidUser)', () => {
			const testCases = [
				'1234567890@lid',
				'1234567890@hosted.lid',
				'1234567890@s.whatsapp.net',
				'1234567890@hosted',
				'123@g.us',
				undefined,
				''
			]

			for (const jid of testCases) {
				const anyLidResult = isAnyLidUser(jid)
				const individualResult = !!(isLidUser(jid) || isHostedLidUser(jid))
				expect(anyLidResult).toBe(individualResult)
			}
		})
	})

	describe('isAnyPnUser vs individual checks', () => {
		it('should be equivalent to !!(isPnUser || isHostedPnUser)', () => {
			const testCases = [
				'1234567890@s.whatsapp.net',
				'1234567890@hosted',
				'1234567890@lid',
				'1234567890@hosted.lid',
				'123@g.us',
				undefined,
				''
			]

			for (const jid of testCases) {
				const anyPnResult = isAnyPnUser(jid)
				const individualResult = !!(isPnUser(jid) || isHostedPnUser(jid))
				expect(anyPnResult).toBe(individualResult)
			}
		})
	})

	describe('Complementary behavior', () => {
		it('isAnyLidUser and isAnyPnUser should be mutually exclusive for valid JIDs', () => {
			const lidJids = ['1234567890@lid', '1234567890:1@hosted.lid']
			const pnJids = ['1234567890@s.whatsapp.net', '1234567890:1@hosted']

			for (const jid of lidJids) {
				expect(isAnyLidUser(jid)).toBe(true)
				expect(isAnyPnUser(jid)).toBe(false)
			}

			for (const jid of pnJids) {
				expect(isAnyLidUser(jid)).toBe(false)
				expect(isAnyPnUser(jid)).toBe(true)
			}
		})

		it('both should return false for non-user JIDs', () => {
			const nonUserJids = ['123@g.us', '456@newsletter', 'status@broadcast']

			for (const jid of nonUserJids) {
				expect(isAnyLidUser(jid)).toBe(false)
				expect(isAnyPnUser(jid)).toBe(false)
			}
		})
	})

	describe('Device ID handling', () => {
		it('should work correctly with various device IDs', () => {
			const deviceIds = [0, 1, 10, 99, 100, 999]

			for (const deviceId of deviceIds) {
				expect(isAnyLidUser(`123:${deviceId}@lid`)).toBe(true)
				expect(isAnyLidUser(`123:${deviceId}@hosted.lid`)).toBe(true)
				expect(isAnyPnUser(`123:${deviceId}@s.whatsapp.net`)).toBe(true)
				expect(isAnyPnUser(`123:${deviceId}@hosted`)).toBe(true)
			}
		})

		it('should work without device ID', () => {
			expect(isAnyLidUser('123@lid')).toBe(true)
			expect(isAnyLidUser('123@hosted.lid')).toBe(true)
			expect(isAnyPnUser('123@s.whatsapp.net')).toBe(true)
			expect(isAnyPnUser('123@hosted')).toBe(true)
		})
	})
})
