import { Boom } from '@hapi/boom'
import { proto } from '../../../WAProto/index.js'
import * as chatUtilsModule from '../../Utils/chat-utils'
import { decodeSyncdPatch, newLTHashState } from '../../Utils/chat-utils'

// Helper: key lookup that always returns null (simulates missing key)
const missingKeyFn = async (_keyId: string) => null

describe('chat-utils PR changes', () => {
	describe('newLTHashState', () => {
		it('should return state with version 0', () => {
			const state = newLTHashState()
			expect(state.version).toBe(0)
		})

		it('should return state with 128-byte hash buffer filled with zeros', () => {
			const state = newLTHashState()
			expect(Buffer.isBuffer(state.hash)).toBe(true)
			expect(state.hash.length).toBe(128)
			expect(state.hash.every((b: number) => b === 0)).toBe(true)
		})

		it('should return state with empty indexValueMap', () => {
			const state = newLTHashState()
			expect(state.indexValueMap).toEqual({})
		})

		it('should return a new object each time (not shared state)', () => {
			const state1 = newLTHashState()
			const state2 = newLTHashState()
			expect(state1).not.toBe(state2)
			expect(state1.hash).not.toBe(state2.hash)
			expect(state1.indexValueMap).not.toBe(state2.indexValueMap)
		})
	})

	describe('decodeSyncdPatch - statusCode 404 for missing key (not isMissingKey)', () => {
		it('should throw Boom with statusCode 404 when key is missing (validateMacs=true)', async () => {
			const msg: proto.ISyncdPatch = {
				keyId: { id: Buffer.from('missing-key-id') },
				mutations: [],
				version: { version: 1 as any },
				snapshotMac: Buffer.alloc(32),
				patchMac: Buffer.alloc(32)
			}

			try {
				await decodeSyncdPatch(msg, 'regular_low', newLTHashState(), missingKeyFn, () => {}, true)
				throw new Error('should have thrown')
			} catch (error: any) {
				expect(error).toBeInstanceOf(Boom)
				expect(error.output?.statusCode).toBe(404)
			}
		})

		it('should NOT have isMissingKey data property when key is missing', async () => {
			// PR changed: removed isMissingKey flag from errors, now uses statusCode 404
			const msg: proto.ISyncdPatch = {
				keyId: { id: Buffer.from('missing-key') },
				mutations: [],
				version: { version: 1 as any },
				snapshotMac: Buffer.alloc(32),
				patchMac: Buffer.alloc(32)
			}

			try {
				await decodeSyncdPatch(msg, 'regular_low', newLTHashState(), missingKeyFn, () => {}, true)
				throw new Error('should have thrown')
			} catch (error: any) {
				// isMissingKey was removed from the error data
				expect(error?.data?.isMissingKey).toBeUndefined()
			}
		})

		it('should include the key ID in the error message', async () => {
			const keyId = Buffer.from('some-key-id')
			const base64Key = keyId.toString('base64')
			const msg: proto.ISyncdPatch = {
				keyId: { id: keyId },
				mutations: [],
				version: { version: 1 as any },
				snapshotMac: Buffer.alloc(32),
				patchMac: Buffer.alloc(32)
			}

			try {
				await decodeSyncdPatch(msg, 'regular_low', newLTHashState(), missingKeyFn, () => {}, true)
				throw new Error('should have thrown')
			} catch (error: any) {
				expect(error.message).toContain(base64Key)
			}
		})

		it('should not throw when validateMacs=false even if key lookup returns null', async () => {
			// With validateMacs=false, the patch-level key lookup is skipped
			// (but mutations may fail if they also need keys)
			const msg: proto.ISyncdPatch = {
				keyId: { id: Buffer.from('missing-key') },
				mutations: [], // empty mutations avoids mutation key lookup
				version: { version: 1 as any },
				snapshotMac: Buffer.alloc(32),
				patchMac: Buffer.alloc(32)
			}

			// Should not throw with empty mutations and validateMacs=false
			await expect(
				decodeSyncdPatch(msg, 'regular_low', newLTHashState(), missingKeyFn, () => {}, false)
			).resolves.not.toThrow()
		})
	})

	describe('removed functions (ensureLTHashStateVersion, isMissingKeyError, isAppStateSyncIrrecoverable, MAX_SYNC_ATTEMPTS)', () => {
		it('should not export ensureLTHashStateVersion', () => {
			expect((chatUtilsModule as any).ensureLTHashStateVersion).toBeUndefined()
		})

		it('should not export isMissingKeyError', () => {
			expect((chatUtilsModule as any).isMissingKeyError).toBeUndefined()
		})

		it('should not export isAppStateSyncIrrecoverable', () => {
			expect((chatUtilsModule as any).isAppStateSyncIrrecoverable).toBeUndefined()
		})

		it('should not export MAX_SYNC_ATTEMPTS from chat-utils (moved to chats.ts as local const)', () => {
			expect((chatUtilsModule as any).MAX_SYNC_ATTEMPTS).toBeUndefined()
		})
	})
})