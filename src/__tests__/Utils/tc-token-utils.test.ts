import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import {
	buildTcTokenFromJid,
	clearCsTokenCache,
	computeCsToken,
	isTcTokenExpired,
	shouldSendNewTcToken,
	storeTcTokensFromNotification
} from '../../Utils/tc-token-utils'

// Mock key store
function createMockKeyStore(data: Record<string, Record<string, any>> = {}) {
	const store: Record<string, Record<string, any>> = { ...data }
	return {
		get: jest.fn(async (type: string, ids: string[]) => {
			const result: Record<string, any> = {}
			for (const id of ids) {
				result[id] = store[type]?.[id] ?? undefined
			}

			return result
		}),
		set: jest.fn(async (data: Record<string, Record<string, any>>) => {
			for (const [type, entries] of Object.entries(data)) {
				if (!store[type]) store[type] = {}
				for (const [id, value] of Object.entries(entries)) {
					if (value === null) {
						delete store[type][id]
					} else {
						store[type][id] = value
					}
				}
			}
		}),
		isInTransaction: () => false,
		transaction: async <T>(exec: () => Promise<T>) => exec()
	}
}

describe('tc-token-utils', () => {
	describe('isTcTokenExpired', () => {
		it('returns true for undefined/null/empty timestamp', () => {
			expect(isTcTokenExpired(undefined)).toBe(true)
			expect(isTcTokenExpired('')).toBe(true)
		})

		it('returns true for zero or negative timestamp', () => {
			expect(isTcTokenExpired(0)).toBe(true)
			expect(isTcTokenExpired(-1)).toBe(true)
			expect(isTcTokenExpired('0')).toBe(true)
		})

		it('returns false for a recent timestamp', () => {
			const now = Math.floor(Date.now() / 1000)
			expect(isTcTokenExpired(now)).toBe(false)
			expect(isTcTokenExpired(String(now))).toBe(false)
			expect(isTcTokenExpired(now - 3600)).toBe(false) // 1 hour ago
		})

		it('returns true for a very old timestamp', () => {
			const veryOld = Math.floor(Date.now() / 1000) - 604800 * 5 // 5 weeks ago
			expect(isTcTokenExpired(veryOld)).toBe(true)
			expect(isTcTokenExpired(veryOld, 'receiver')).toBe(true)
			expect(isTcTokenExpired(veryOld, 'sender')).toBe(true)
		})

		it('uses correct bucket math: cutoff = (currentBucket - (numBuckets-1)) * bucketSize', () => {
			const bucketSize = 604800 // 7 days
			const now = Math.floor(Date.now() / 1000)
			const currentBucket = Math.floor(now / bucketSize)

			// Token at exactly the cutoff boundary (3 buckets back) should NOT be expired
			const cutoffBoundary = (currentBucket - 3) * bucketSize
			expect(isTcTokenExpired(cutoffBoundary, 'receiver')).toBe(false)

			// Token 1 second before cutoff should be expired
			expect(isTcTokenExpired(cutoffBoundary - 1, 'receiver')).toBe(true)
		})

		it('handles string timestamps correctly', () => {
			const now = Math.floor(Date.now() / 1000)
			expect(isTcTokenExpired(String(now))).toBe(false)
			expect(isTcTokenExpired('not-a-number')).toBe(true)
		})
	})

	describe('shouldSendNewTcToken', () => {
		it('returns true for null/undefined/empty', () => {
			expect(shouldSendNewTcToken(null)).toBe(true)
			expect(shouldSendNewTcToken(undefined)).toBe(true)
			expect(shouldSendNewTcToken('')).toBe(true)
			expect(shouldSendNewTcToken(0)).toBe(true)
		})

		it('returns false when timestamp is in the current bucket', () => {
			const now = Math.floor(Date.now() / 1000)
			expect(shouldSendNewTcToken(now)).toBe(false)
			expect(shouldSendNewTcToken(String(now))).toBe(false)
			// 1 hour ago, still same bucket
			expect(shouldSendNewTcToken(now - 3600)).toBe(false)
		})

		it('returns true when timestamp is in a previous bucket', () => {
			const now = Math.floor(Date.now() / 1000)
			const oldTimestamp = now - (604800 + 1) // 7 days + 1 second ago
			expect(shouldSendNewTcToken(oldTimestamp)).toBe(true)
		})
	})

	describe('computeCsToken', () => {
		const validSalt = new Uint8Array(32).fill(0xab)

		beforeEach(() => {
			clearCsTokenCache()
		})

		it('computes HMAC-SHA256 correctly', () => {
			const token = computeCsToken(validSalt, '12345@lid')
			expect(token).toBeInstanceOf(Uint8Array)
			expect(token.length).toBe(32) // SHA-256 = 32 bytes
		})

		it('produces same output for same input (cache hit)', () => {
			const t1 = computeCsToken(validSalt, '12345@lid')
			const t2 = computeCsToken(validSalt, '12345@lid')
			expect(t1).toBe(t2) // Same reference = cache hit
		})

		it('produces different output for different LIDs', () => {
			const t1 = computeCsToken(validSalt, 'aaa@lid')
			const t2 = computeCsToken(validSalt, 'bbb@lid')
			expect(Buffer.from(t1).equals(Buffer.from(t2))).toBe(false)
		})

		it('throws for invalid salt length', () => {
			expect(() => computeCsToken(new Uint8Array(16), '12345@lid')).toThrow('Invalid nctSalt length')
			expect(() => computeCsToken(new Uint8Array(0), '12345@lid')).toThrow('Invalid nctSalt length')
			expect(() => computeCsToken(new Uint8Array(64), '12345@lid')).toThrow('Invalid nctSalt length')
		})

		it('clearCsTokenCache invalidates cache', () => {
			const t1 = computeCsToken(validSalt, '12345@lid')
			clearCsTokenCache()
			const t2 = computeCsToken(validSalt, '12345@lid')
			// Same value but different reference (recomputed)
			expect(t1).not.toBe(t2)
			expect(Buffer.from(t1).equals(Buffer.from(t2))).toBe(true)
		})
	})

	describe('buildTcTokenFromJid', () => {
		it('returns null tokenNode when no token exists', async () => {
			const keys = createMockKeyStore()
			const result = await buildTcTokenFromJid({
				authState: { keys: keys as any },
				jid: '5511999999999@s.whatsapp.net'
			})
			expect(result.tokenNode).toBeNull()
			expect(result.senderTimestamp).toBeNull()
		})

		it('returns tokenNode when valid token exists', async () => {
			const now = Math.floor(Date.now() / 1000)
			const keys = createMockKeyStore({
				tctoken: {
					'5511999999999@s.whatsapp.net': {
						token: Buffer.from('test-token'),
						timestamp: String(now)
					}
				}
			})
			const result = await buildTcTokenFromJid({
				authState: { keys: keys as any },
				jid: '5511999999999@s.whatsapp.net'
			})
			expect(result.tokenNode).not.toBeNull()
			expect(result.tokenNode!.tag).toBe('tctoken')
		})

		it('deletes expired token and returns null', async () => {
			const veryOld = Math.floor(Date.now() / 1000) - 604800 * 5
			const keys = createMockKeyStore({
				tctoken: {
					'5511999999999@s.whatsapp.net': {
						token: Buffer.from('old-token'),
						timestamp: String(veryOld)
					}
				}
			})
			const result = await buildTcTokenFromJid({
				authState: { keys: keys as any },
				jid: '5511999999999@s.whatsapp.net'
			})
			expect(result.tokenNode).toBeNull()
			expect(keys.set).toHaveBeenCalledWith({
				tctoken: { '5511999999999@s.whatsapp.net': null }
			})
		})

		it('reads sender timestamp from separate key', async () => {
			const keys = createMockKeyStore({
				'tctoken-sender-ts': {
					'5511999999999@s.whatsapp.net': '1700000000'
				}
			})
			const result = await buildTcTokenFromJid({
				authState: { keys: keys as any },
				jid: '5511999999999@s.whatsapp.net'
			})
			expect(result.senderTimestamp).toBe('1700000000')
		})
	})

	describe('storeTcTokensFromNotification', () => {
		it('stores token keyed by token jid attribute (not notification from)', async () => {
			const keys = createMockKeyStore()
			const node = {
				tag: 'notification' as const,
				attrs: { from: 'server@s.whatsapp.net' },
				content: [
					{
						tag: 'tokens' as const,
						attrs: {},
						content: [
							{
								tag: 'token' as const,
								attrs: {
									type: 'trusted_contact',
									t: '1700000000',
									jid: '5511888888888@s.whatsapp.net'
								},
								content: Buffer.from('the-token-data')
							}
						]
					}
				]
			}

			const storedJids: string[] = []
			const count = await storeTcTokensFromNotification({
				node: node as any,
				keys: keys as any,
				onNewJidStored: jid => storedJids.push(jid)
			})

			expect(count).toBe(1)
			expect(storedJids).toEqual(['5511888888888@s.whatsapp.net'])
			expect(keys.set).toHaveBeenCalledWith({
				tctoken: {
					'5511888888888@s.whatsapp.net': {
						token: expect.any(Buffer),
						timestamp: '1700000000'
					}
				}
			})
		})

		it('falls back to notification from when token has no jid attr', async () => {
			const keys = createMockKeyStore()
			const node = {
				tag: 'notification' as const,
				attrs: { from: '5511777777777@s.whatsapp.net' },
				content: [
					{
						tag: 'tokens' as const,
						attrs: {},
						content: [
							{
								tag: 'token' as const,
								attrs: { type: 'trusted_contact', t: '1700000000' },
								content: Buffer.from('token-data')
							}
						]
					}
				]
			}

			const count = await storeTcTokensFromNotification({
				node: node as any,
				keys: keys as any
			})
			expect(count).toBe(1)
		})

		it('rejects older token (monotonicity guard)', async () => {
			const keys = createMockKeyStore({
				tctoken: {
					'5511999999999@s.whatsapp.net': {
						token: Buffer.from('newer-token'),
						timestamp: '1700000100'
					}
				}
			})
			const node = {
				tag: 'notification' as const,
				attrs: { from: '5511999999999@s.whatsapp.net' },
				content: [
					{
						tag: 'tokens' as const,
						attrs: {},
						content: [
							{
								tag: 'token' as const,
								attrs: { type: 'trusted_contact', t: '1700000050' },
								content: Buffer.from('older-token')
							}
						]
					}
				]
			}

			const count = await storeTcTokensFromNotification({
				node: node as any,
				keys: keys as any
			})
			expect(count).toBe(0) // Rejected
		})

		it('rejects token without timestamp when existing has valid timestamp (prevent downgrade)', async () => {
			const keys = createMockKeyStore({
				tctoken: {
					'5511999999999@s.whatsapp.net': {
						token: Buffer.from('good-token'),
						timestamp: '1700000100'
					}
				}
			})
			const node = {
				tag: 'notification' as const,
				attrs: { from: '5511999999999@s.whatsapp.net' },
				content: [
					{
						tag: 'tokens' as const,
						attrs: {},
						content: [
							{
								tag: 'token' as const,
								attrs: { type: 'trusted_contact' }, // no t attribute
								content: Buffer.from('no-timestamp-token')
							}
						]
					}
				]
			}

			const count = await storeTcTokensFromNotification({
				node: node as any,
				keys: keys as any
			})
			expect(count).toBe(0) // Rejected — prevents downgrade
		})

		it('skips non-trusted_contact tokens', async () => {
			const keys = createMockKeyStore()
			const node = {
				tag: 'notification' as const,
				attrs: { from: '5511999999999@s.whatsapp.net' },
				content: [
					{
						tag: 'tokens' as const,
						attrs: {},
						content: [
							{
								tag: 'token' as const,
								attrs: { type: 'other_type', t: '1700000000' },
								content: Buffer.from('token')
							}
						]
					}
				]
			}

			const count = await storeTcTokensFromNotification({
				node: node as any,
				keys: keys as any
			})
			expect(count).toBe(0)
		})

		it('stores token without timestamp as undefined (not "0")', async () => {
			const keys = createMockKeyStore()
			const node = {
				tag: 'notification' as const,
				attrs: { from: '5511999999999@s.whatsapp.net' },
				content: [
					{
						tag: 'tokens' as const,
						attrs: {},
						content: [
							{
								tag: 'token' as const,
								attrs: { type: 'trusted_contact' }, // no t
								content: Buffer.from('token-no-ts')
							}
						]
					}
				]
			}

			await storeTcTokensFromNotification({
				node: node as any,
				keys: keys as any
			})

			expect(keys.set).toHaveBeenCalledWith({
				tctoken: {
					'5511999999999@s.whatsapp.net': {
						token: expect.any(Buffer),
						timestamp: undefined // NOT "0"
					}
				}
			})
		})
	})
})
