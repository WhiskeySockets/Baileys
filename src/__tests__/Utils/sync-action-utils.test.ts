import { Boom } from '@hapi/boom'
import { jest } from '@jest/globals'
import type { ILogger } from '../../Utils/logger'
import {
	BlockedCollectionsManager,
	classifySyncError,
	isSyncdMissingKeyError,
	prepareCollectionSyncNode,
	prepareCollectionSyncNodes,
	processContactAction,
	SyncdMissingKeyError,
	SyncErrorAction
} from '../../Utils/sync-action-utils'

describe('SyncdMissingKeyError', () => {
	it('should create error with correct properties', () => {
		const error = new SyncdMissingKeyError('AAAAANg9')

		expect(error).toBeInstanceOf(Error)
		expect(error).toBeInstanceOf(Boom)
		expect(error).toBeInstanceOf(SyncdMissingKeyError)
		expect(error.keyId).toBe('AAAAANg9')
		expect(error.message).toBe('failed to find key "AAAAANg9" to decode mutation')
		expect(error.output.statusCode).toBe(404)
	})

	it('should include additional data when provided', () => {
		const error = new SyncdMissingKeyError('AAAAANg9', { collection: 'regular' })

		expect(error.data).toEqual({ keyId: 'AAAAANg9', collection: 'regular' })
	})
})

describe('isSyncdMissingKeyError', () => {
	it('should return true for SyncdMissingKeyError', () => {
		const error = new SyncdMissingKeyError('AAAAANg9')
		expect(isSyncdMissingKeyError(error)).toBe(true)
	})

	it('should return true for Boom with 404 status AND matching message', () => {
		const error = new Boom('failed to find key "xyz" to decode', { statusCode: 404 })
		expect(isSyncdMissingKeyError(error)).toBe(true)
	})

	it('should return false for Boom with 404 status but wrong message', () => {
		const error = new Boom('resource not found', { statusCode: 404 })
		expect(isSyncdMissingKeyError(error)).toBe(false)
	})

	it('should return false for Boom with non-404 status', () => {
		const error = new Boom('other error', { statusCode: 500 })
		expect(isSyncdMissingKeyError(error)).toBe(false)
	})

	it('should return false for Boom with matching message but wrong status', () => {
		const error = new Boom('failed to find key "xyz"', { statusCode: 500 })
		expect(isSyncdMissingKeyError(error)).toBe(false)
	})

	it('should return true for Error with matching message', () => {
		const error = new Error('failed to find key "xyz" to decode')
		expect(isSyncdMissingKeyError(error)).toBe(true)
	})

	it('should return false for Error without matching message', () => {
		const error = new Error('some other error')
		expect(isSyncdMissingKeyError(error)).toBe(false)
	})

	it('should return false for non-error values', () => {
		expect(isSyncdMissingKeyError(null)).toBe(false)
		expect(isSyncdMissingKeyError(undefined)).toBe(false)
		expect(isSyncdMissingKeyError('string')).toBe(false)
		expect(isSyncdMissingKeyError(123)).toBe(false)
		expect(isSyncdMissingKeyError({})).toBe(false)
	})
})

describe('BlockedCollectionsManager', () => {
	let manager: BlockedCollectionsManager

	beforeEach(() => {
		manager = new BlockedCollectionsManager()
	})

	describe('block()', () => {
		it('should add collection to blocked set', () => {
			manager.block('regular')

			expect(manager.isBlocked('regular')).toBe(true)
			expect(manager.size).toBe(1)
		})

		it('should not duplicate collections', () => {
			manager.block('regular')
			manager.block('regular')

			expect(manager.size).toBe(1)
		})
	})

	describe('isBlocked()', () => {
		it('should return true for blocked collections', () => {
			manager.block('regular')
			expect(manager.isBlocked('regular')).toBe(true)
		})

		it('should return false for non-blocked collections', () => {
			expect(manager.isBlocked('regular')).toBe(false)
		})
	})

	describe('flush()', () => {
		it('should return all blocked collections and clear', () => {
			manager.block('regular')
			manager.block('regular_high')
			manager.block('regular_low')

			const flushed = manager.flush()

			expect(flushed).toHaveLength(3)
			expect(flushed).toContain('regular')
			expect(flushed).toContain('regular_high')
			expect(flushed).toContain('regular_low')
			expect(manager.size).toBe(0)
			expect(manager.hasBlocked).toBe(false)
		})

		it('should return empty array when nothing blocked', () => {
			const flushed = manager.flush()

			expect(flushed).toEqual([])
		})
	})

	describe('hasBlocked', () => {
		it('should return false when empty', () => {
			expect(manager.hasBlocked).toBe(false)
		})

		it('should return true when collections are blocked', () => {
			manager.block('regular')
			expect(manager.hasBlocked).toBe(true)
		})
	})

	describe('getBlocked()', () => {
		it('should return blocked collections without clearing', () => {
			manager.block('regular')
			manager.block('critical_block')

			const blocked = manager.getBlocked()

			expect(blocked).toHaveLength(2)
			expect(manager.size).toBe(2)
		})
	})
})

describe('classifySyncError', () => {
	describe('BLOCK_ON_KEY action', () => {
		it('should return BLOCK_ON_KEY for SyncdMissingKeyError', () => {
			const error = new SyncdMissingKeyError('test-key')
			const result = classifySyncError(error, 1, 5)

			expect(result.action).toBe(SyncErrorAction.BLOCK_ON_KEY)
			expect(result.error).toBe(error)
			expect(result.errorMessage).toBe('failed to find key "test-key" to decode mutation')
		})

		it('should return BLOCK_ON_KEY for Boom 404 with matching message', () => {
			const error = new Boom('failed to find key "xyz" to decode', { statusCode: 404 })
			const result = classifySyncError(error, 1, 5)

			expect(result.action).toBe(SyncErrorAction.BLOCK_ON_KEY)
		})

		it('should return BLOCK_ON_KEY for Error with matching message', () => {
			const error = new Error('failed to find key "abc"')
			const result = classifySyncError(error, 1, 5)

			expect(result.action).toBe(SyncErrorAction.BLOCK_ON_KEY)
		})
	})

	describe('ABORT action', () => {
		it('should return ABORT for TypeError', () => {
			const error = new TypeError('Cannot read property x of undefined')
			const result = classifySyncError(error, 1, 5)

			expect(result.action).toBe(SyncErrorAction.ABORT)
			expect(result.errorMessage).toBe('Cannot read property x of undefined')
		})

		it('should return ABORT when max attempts reached', () => {
			const error = new Error('Some retriable error')
			const result = classifySyncError(error, 5, 5)

			expect(result.action).toBe(SyncErrorAction.ABORT)
		})
	})

	describe('priority', () => {
		it('should return BLOCK_ON_KEY even when max attempts reached', () => {
			const error = new SyncdMissingKeyError('test-key')
			const result = classifySyncError(error, 10, 5)

			expect(result.action).toBe(SyncErrorAction.BLOCK_ON_KEY)
		})
	})

	describe('RETRY action', () => {
		it('should return RETRY for generic Error below max attempts', () => {
			const error = new Error('Network error')
			const result = classifySyncError(error, 2, 5)

			expect(result.action).toBe(SyncErrorAction.RETRY)
			expect(result.errorMessage).toBe('Network error')
		})

		it('should return RETRY for Boom with non-matching 404', () => {
			const error = new Boom('resource not found', { statusCode: 404 })
			const result = classifySyncError(error, 1, 5)

			expect(result.action).toBe(SyncErrorAction.RETRY)
		})

		it('should return RETRY for Boom with 500 status', () => {
			const error = new Boom('Internal server error', { statusCode: 500 })
			const result = classifySyncError(error, 1, 5)

			expect(result.action).toBe(SyncErrorAction.RETRY)
		})
	})

	describe('error details', () => {
		it('should include stack trace when available', () => {
			const error = new Error('Test error')
			const result = classifySyncError(error, 1, 5)

			expect(result.errorStack).toBeDefined()
			expect(result.errorStack).toContain('Error: Test error')
		})

		it('should handle non-Error values', () => {
			const result = classifySyncError('string error', 1, 5)

			expect(result.action).toBe(SyncErrorAction.RETRY)
			expect(result.errorMessage).toBe('string error')
			expect(result.errorStack).toBeUndefined()
		})
	})
})

describe('prepareCollectionSyncNode', () => {
	it('should create node with correct tag', () => {
		const state = { version: 5, hash: Buffer.from('test'), indexValueMap: {} }
		const node = prepareCollectionSyncNode('regular', state)

		expect(node.tag).toBe('collection')
	})

	it('should set name attribute to collection name', () => {
		const state = { version: 5, hash: Buffer.from('test'), indexValueMap: {} }
		const node = prepareCollectionSyncNode('regular_high', state)

		expect(node.attrs.name).toBe('regular_high')
	})

	it('should set version as string', () => {
		const state = { version: 42, hash: Buffer.from('test'), indexValueMap: {} }
		const node = prepareCollectionSyncNode('regular', state)

		expect(node.attrs.version).toBe('42')
	})

	it('should set return_snapshot to "true" when version is 0', () => {
		const state = { version: 0, hash: Buffer.from('test'), indexValueMap: {} }
		const node = prepareCollectionSyncNode('regular', state)

		expect(node.attrs.return_snapshot).toBe('true')
	})

	it('should set return_snapshot to "false" when version > 0', () => {
		const state = { version: 1, hash: Buffer.from('test'), indexValueMap: {} }
		const node = prepareCollectionSyncNode('regular', state)

		expect(node.attrs.return_snapshot).toBe('false')
	})
})

describe('prepareCollectionSyncNodes', () => {
	it('should return empty array for empty input', () => {
		const nodes = prepareCollectionSyncNodes([])

		expect(nodes).toEqual([])
	})

	it('should create nodes for each collection', () => {
		const collections = [
			{ name: 'regular' as const, state: { version: 0, hash: Buffer.from('a'), indexValueMap: {} }, isNewSync: true },
			{
				name: 'regular_high' as const,
				state: { version: 5, hash: Buffer.from('b'), indexValueMap: {} },
				isNewSync: false
			},
			{
				name: 'critical_block' as const,
				state: { version: 10, hash: Buffer.from('c'), indexValueMap: {} },
				isNewSync: false
			}
		]

		const nodes = prepareCollectionSyncNodes(collections)

		expect(nodes).toHaveLength(3)

		const [node0, node1, node2] = nodes
		expect(node0!.attrs.name).toBe('regular')
		expect(node0!.attrs.return_snapshot).toBe('true')
		expect(node1!.attrs.name).toBe('regular_high')
		expect(node1!.attrs.return_snapshot).toBe('false')
		expect(node2!.attrs.name).toBe('critical_block')
		expect(node2!.attrs.version).toBe('10')
	})
})

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
