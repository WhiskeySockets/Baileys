import { Boom } from '@hapi/boom'
import { proto } from '../../../WAProto/index.js'
import {
	decodeSyncdMutations,
	decodeSyncdPatch,
	decodeSyncdSnapshot,
	isAppStateSyncIrrecoverable,
	MAX_SYNC_ATTEMPTS,
	newLTHashState
} from '../../Utils/chat-utils'

const missingKeyFn = async () => null

describe('App State Sync', () => {
	describe('missing key errors throw with statusCode 404', () => {
		it('decodeSyncdPatch throws 404 on missing key', async () => {
			const msg: proto.ISyncdPatch = {
				keyId: { id: Buffer.from('missing-key') },
				mutations: [],
				version: { version: 1 as any },
				snapshotMac: Buffer.alloc(32),
				patchMac: Buffer.alloc(32)
			}

			await expect(
				decodeSyncdPatch(msg, 'regular_low', newLTHashState(), missingKeyFn, () => {}, true)
			).rejects.toMatchObject({ output: { statusCode: 404 } })
		})

		it('decodeSyncdSnapshot throws 404 on missing snapshot key', async () => {
			const snapshot: proto.ISyncdSnapshot = {
				version: { version: 1 as any },
				records: [],
				keyId: { id: Buffer.from('missing-key') },
				mac: Buffer.alloc(32)
			}

			await expect(decodeSyncdSnapshot('regular_low', snapshot, missingKeyFn, undefined, true)).rejects.toMatchObject({
				output: { statusCode: 404 }
			})
		})

		it('decodeSyncdMutations throws 404 on missing mutation key', async () => {
			const records: proto.ISyncdRecord[] = [
				{
					keyId: { id: Buffer.from('missing-key') },
					value: { blob: Buffer.alloc(64) },
					index: { blob: Buffer.alloc(32) }
				}
			]

			await expect(decodeSyncdMutations(records, newLTHashState(), missingKeyFn, () => {}, true)).rejects.toMatchObject(
				{ output: { statusCode: 404 } }
			)
		})

		it('decodeSyncdMutations throws 404 even with validateMacs=false', async () => {
			const records: proto.ISyncdRecord[] = [
				{
					keyId: { id: Buffer.from('missing-key') },
					value: { blob: Buffer.alloc(64) },
					index: { blob: Buffer.alloc(32) }
				}
			]

			await expect(
				decodeSyncdMutations(records, newLTHashState(), missingKeyFn, () => {}, false)
			).rejects.toMatchObject({ output: { statusCode: 404 } })
		})
	})

	describe('isAppStateSyncIrrecoverable', () => {
		it.each([400, 404, 405, 406])('should be irrecoverable for status %d on first attempt', statusCode => {
			expect(isAppStateSyncIrrecoverable(new Boom('test', { statusCode }), 1)).toBe(true)
		})

		it('should be irrecoverable for TypeError', () => {
			expect(isAppStateSyncIrrecoverable(new TypeError('WASM crash'), 1)).toBe(true)
		})

		it('should be irrecoverable when attempts >= MAX_SYNC_ATTEMPTS', () => {
			expect(isAppStateSyncIrrecoverable(new Error('generic'), MAX_SYNC_ATTEMPTS)).toBe(true)
		})

		it('should NOT be irrecoverable for generic error below max attempts', () => {
			expect(isAppStateSyncIrrecoverable(new Error('generic'), 1)).toBe(false)
		})

		it('should NOT be irrecoverable for non-fatal status codes', () => {
			expect(isAppStateSyncIrrecoverable(new Boom('server error', { statusCode: 500 }), 1)).toBe(false)
		})

		it('should handle null/undefined error gracefully', () => {
			expect(isAppStateSyncIrrecoverable(null, MAX_SYNC_ATTEMPTS)).toBe(true)
			expect(isAppStateSyncIrrecoverable(undefined, 1)).toBe(false)
		})
	})
})
