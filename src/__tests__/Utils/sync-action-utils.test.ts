import { jest } from '@jest/globals'
import type { ILogger } from '../../Utils/logger'
import { processContactAction } from '../../Utils/sync-action-utils'

describe('processContactAction', () => {
	const mockLogger: ILogger = {
		warn: jest.fn(),
		info: jest.fn(),
		debug: jest.fn(),
		error: jest.fn(),
		trace: jest.fn(),
		child: jest.fn(() => mockLogger),
		level: 'silent'
	} as unknown as ILogger

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('contacts.upsert', () => {
		it('emits with phoneNumber from id when id is PN user', () => {
			const action = { fullName: 'John Doe', lidJid: '123456789@lid', pnJid: null }
			const id = '5511999999999@s.whatsapp.net'

			const results = processContactAction(action, id)

			expect(results).toContainEqual({
				event: 'contacts.upsert',
				data: [
					{
						id: '5511999999999@s.whatsapp.net',
						name: 'John Doe',
						lid: '123456789@lid',
						phoneNumber: '5511999999999@s.whatsapp.net'
					}
				]
			})
		})

		it('uses pnJid as phoneNumber fallback when id is LID user', () => {
			const action = { fullName: 'John Doe', lidJid: null, pnJid: '5511888888888@s.whatsapp.net' }
			const id = '123456789@lid'

			const results = processContactAction(action, id)

			expect(results).toContainEqual({
				event: 'contacts.upsert',
				data: [
					{
						id: '123456789@lid',
						name: 'John Doe',
						lid: undefined,
						phoneNumber: '5511888888888@s.whatsapp.net'
					}
				]
			})
		})

		it('handles undefined fullName', () => {
			const action = { fullName: undefined, lidJid: '123456789@lid', pnJid: null }
			const id = '5511999999999@s.whatsapp.net'

			const results = processContactAction(action, id)

			const contactData = results.find(r => r.event === 'contacts.upsert')!.data
			expect(contactData[0]!.name).toBeUndefined()
		})
	})

	describe('lid-mapping.update', () => {
		it('emits when LID and PN are valid', () => {
			const action = { fullName: 'John Doe', lidJid: '123456789@lid', pnJid: null }
			const id = '5511999999999@s.whatsapp.net'

			const results = processContactAction(action, id)

			expect(results).toContainEqual({
				event: 'lid-mapping.update',
				data: { lid: '123456789@lid', pn: '5511999999999@s.whatsapp.net' }
			})
		})

		it('handles LID with device ID suffix', () => {
			const action = { fullName: 'Contact', lidJid: '173233882013816:99@lid', pnJid: null }
			const id = '5511999999999@s.whatsapp.net'

			const results = processContactAction(action, id)

			expect(results).toContainEqual({
				event: 'lid-mapping.update',
				data: { lid: '173233882013816:99@lid', pn: '5511999999999@s.whatsapp.net' }
			})
		})

		it('does NOT emit when lidJid is missing', () => {
			const action = { fullName: 'John Doe', lidJid: null, pnJid: null }
			const id = '5511999999999@s.whatsapp.net'

			const results = processContactAction(action, id)

			expect(results.find(r => r.event === 'lid-mapping.update')).toBeUndefined()
		})

		it('does NOT emit when id is LID user (not PN)', () => {
			const action = { fullName: 'John Doe', lidJid: '123456789@lid', pnJid: null }
			const id = '987654321@lid'

			const results = processContactAction(action, id)

			expect(results.find(r => r.event === 'lid-mapping.update')).toBeUndefined()
		})

		it('does NOT emit when lidJid is invalid format', () => {
			const action = { fullName: 'John Doe', lidJid: 'invalid-lid-format', pnJid: null }
			const id = '5511999999999@s.whatsapp.net'

			const results = processContactAction(action, id)

			expect(results.find(r => r.event === 'lid-mapping.update')).toBeUndefined()
		})

		it('does NOT emit for group JIDs', () => {
			const action = { fullName: 'Group', lidJid: '123456789@lid', pnJid: null }
			const id = '123456789012345678@g.us'

			const results = processContactAction(action, id)

			expect(results.find(r => r.event === 'lid-mapping.update')).toBeUndefined()
		})
	})

	describe('missing id', () => {
		it('returns empty array and logs warning when id is undefined', () => {
			const action = { fullName: 'John Doe', lidJid: '123456789@lid', pnJid: null }

			const results = processContactAction(action, undefined, mockLogger)

			expect(results).toEqual([])
			expect(mockLogger.warn).toHaveBeenCalledWith(
				{ hasFullName: true, hasLidJid: true, hasPnJid: false },
				'contactAction sync: missing id in index'
			)
		})

		it('returns empty array when id is empty string', () => {
			const action = { fullName: 'John Doe', lidJid: '123456789@lid', pnJid: null }

			const results = processContactAction(action, '', mockLogger)

			expect(results).toEqual([])
		})
	})

	describe('PN extraction from index[1] (pnJid is always null)', () => {
		it('extracts PN from id when pnJid is null', () => {
			// In real WhatsApp data, pnJid is ALWAYS null - PN comes from index[1]
			const action = { fullName: 'Test Contact', lidJid: '111222333@lid', pnJid: null }
			const id = '5599887766@s.whatsapp.net'

			const results = processContactAction(action, id)

			const contactData = results.find(r => r.event === 'contacts.upsert')!.data
			expect(contactData[0]!.phoneNumber).toBe('5599887766@s.whatsapp.net')
			expect(contactData[0]!.lid).toBe('111222333@lid')

			const mapping = results.find(r => r.event === 'lid-mapping.update')!.data
			expect(mapping).toEqual({ lid: '111222333@lid', pn: '5599887766@s.whatsapp.net' })
		})

		it('prefers id over pnJid when id is PN user', () => {
			const action = { fullName: 'Test', lidJid: '111222333@lid', pnJid: '1111111111@s.whatsapp.net' }
			const id = '9999999999@s.whatsapp.net'

			const results = processContactAction(action, id)

			const contactData = results.find(r => r.event === 'contacts.upsert')!.data
			expect(contactData[0]!.phoneNumber).toBe('9999999999@s.whatsapp.net')

			const mapping = results.find(r => r.event === 'lid-mapping.update')!.data
			expect(mapping.pn).toBe('9999999999@s.whatsapp.net')
		})
	})
})
