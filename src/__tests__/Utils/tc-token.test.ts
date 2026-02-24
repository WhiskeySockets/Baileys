import { jest } from '@jest/globals'
import { DisconnectReason, type SignalKeyStoreWithTransaction } from '../../Types'
import { getErrorCodeFromStreamError, SERVER_ERROR_CODES } from '../../Utils'
import { buildTcTokenFromJid, isTcTokenExpired, shouldSendNewTcToken } from '../../Utils/tc-token-utils'
import type { BinaryNode } from '../../WABinary'

/** 7 days in seconds — matches WA Web tctoken_duration */
const BUCKET_DURATION = 604800
/** 4 buckets — matches WA Web tctoken_num_buckets */
const NUM_BUCKETS = 4

const nowSeconds = () => Math.floor(Date.now() / 1000)

/**
 * Compute the cutoff timestamp for the rolling bucket algorithm.
 * Tokens with timestamp < cutoff are expired.
 */
const computeCutoff = () => {
	const now = nowSeconds()
	const currentBucket = Math.floor(now / BUCKET_DURATION)
	const cutoffBucket = currentBucket - (NUM_BUCKETS - 1)
	return cutoffBucket * BUCKET_DURATION
}

const createMockKeys = (): jest.Mocked<SignalKeyStoreWithTransaction> => ({
	get: jest.fn<SignalKeyStoreWithTransaction['get']>() as any,
	set: jest.fn<SignalKeyStoreWithTransaction['set']>(),
	transaction: jest.fn<SignalKeyStoreWithTransaction['transaction']>(async (work: () => any) => await work()) as any,
	isInTransaction: jest.fn<SignalKeyStoreWithTransaction['isInTransaction']>()
})

// ─── Phase 2: isTcTokenExpired (rolling bucket algorithm) ───────────────

describe('isTcTokenExpired', () => {
	it('returns true for undefined', () => {
		expect(isTcTokenExpired(undefined)).toBe(true)
	})

	it('returns true for null', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect(isTcTokenExpired(null as any)).toBe(true)
	})

	it('returns true for NaN string', () => {
		expect(isTcTokenExpired('not-a-number')).toBe(true)
	})

	it('returns true for empty string', () => {
		expect(isTcTokenExpired('')).toBe(true)
	})

	it('returns true for timestamp 0', () => {
		expect(isTcTokenExpired(0)).toBe(true)
	})

	it('returns false for recent token (1 day ago)', () => {
		const ts = nowSeconds() - 86400
		expect(isTcTokenExpired(ts)).toBe(false)
	})

	it('returns false for token 20 days ago (within 28-day window)', () => {
		const ts = nowSeconds() - 20 * 86400
		expect(isTcTokenExpired(ts)).toBe(false)
	})

	it('returns true for expired token (30 days ago)', () => {
		const ts = nowSeconds() - 30 * 86400
		expect(isTcTokenExpired(ts)).toBe(true)
	})

	it('handles string timestamp (recent)', () => {
		const ts = String(nowSeconds() - 86400)
		expect(isTcTokenExpired(ts)).toBe(false)
	})

	it('handles string timestamp (expired)', () => {
		const ts = String(nowSeconds() - 30 * 86400)
		expect(isTcTokenExpired(ts)).toBe(true)
	})

	it('boundary: token exactly at cutoff is NOT expired', () => {
		const cutoff = computeCutoff()
		expect(isTcTokenExpired(cutoff)).toBe(false)
	})

	it('boundary: token one second before cutoff IS expired', () => {
		const cutoff = computeCutoff()
		expect(isTcTokenExpired(cutoff - 1)).toBe(true)
	})

	it('returns true for very old timestamp (epoch)', () => {
		expect(isTcTokenExpired(1)).toBe(true)
	})

	it('returns false for token issued just now', () => {
		expect(isTcTokenExpired(nowSeconds())).toBe(false)
	})

	it('verifies bucket math: cutoff = (currentBucket - 3) * bucketDuration', () => {
		const cutoff = computeCutoff()

		// Token at exactly cutoff is NOT expired (uses < not <=)
		expect(isTcTokenExpired(cutoff)).toBe(false)

		// Token one second before cutoff IS expired
		expect(isTcTokenExpired(cutoff - 1)).toBe(true)

		// Token well past cutoff (e.g. 1 day ago) is valid
		expect(isTcTokenExpired(nowSeconds() - 86400)).toBe(false)

		// Token well before cutoff (e.g. 35 days ago) is expired
		expect(isTcTokenExpired(nowSeconds() - 35 * 86400)).toBe(true)
	})
})

// ─── Phase 2: shouldSendNewTcToken (bucket boundary refresh) ────────────

describe('shouldSendNewTcToken', () => {
	it('returns true for undefined', () => {
		expect(shouldSendNewTcToken(undefined)).toBe(true)
	})

	it('returns false for timestamp in current bucket', () => {
		const ts = nowSeconds() - 100
		expect(shouldSendNewTcToken(ts)).toBe(false)
	})

	it('returns true for timestamp in previous bucket', () => {
		const ts = nowSeconds() - BUCKET_DURATION - 1
		expect(shouldSendNewTcToken(ts)).toBe(true)
	})

	it('returns false for timestamp at start of current bucket', () => {
		const now = nowSeconds()
		const bucketStart = Math.floor(now / BUCKET_DURATION) * BUCKET_DURATION
		expect(shouldSendNewTcToken(bucketStart)).toBe(false)
	})

	it('returns true for timestamp at end of previous bucket', () => {
		const now = nowSeconds()
		const bucketStart = Math.floor(now / BUCKET_DURATION) * BUCKET_DURATION
		expect(shouldSendNewTcToken(bucketStart - 1)).toBe(true)
	})

	it('returns true for very old timestamp', () => {
		expect(shouldSendNewTcToken(1000000)).toBe(true)
	})

	it('returns false for timestamp equal to now', () => {
		expect(shouldSendNewTcToken(nowSeconds())).toBe(false)
	})
})

// ─── Phase 2 + 5: buildTcTokenFromJid ───────────────────────────────────

describe('buildTcTokenFromJid', () => {
	const TEST_JID = 'user@s.whatsapp.net'
	const VALID_TOKEN = Buffer.from([4, 1, 33, 254, 110])
	const RECENT_TS = String(nowSeconds() - 86400) // 1 day ago
	const EXPIRED_TS = String(nowSeconds() - 30 * 86400) // 30 days ago

	let mockKeys: jest.Mocked<SignalKeyStoreWithTransaction>

	beforeEach(() => {
		mockKeys = createMockKeys()
	})

	it('returns tctoken node for valid non-expired token', async () => {
		// @ts-ignore
		mockKeys.get.mockResolvedValue({ [TEST_JID]: { token: VALID_TOKEN, timestamp: RECENT_TS } })

		const result = await buildTcTokenFromJid({ authState: { keys: mockKeys }, jid: TEST_JID })

		expect(result).toBeDefined()
		expect(result).toHaveLength(1)
		const node = result![0]!
		expect(node.tag).toBe('tctoken')
		expect(node.content).toBe(VALID_TOKEN)
	})

	it('returns undefined when no token exists', async () => {
		// @ts-ignore
		mockKeys.get.mockResolvedValue({})

		const result = await buildTcTokenFromJid({ authState: { keys: mockKeys }, jid: TEST_JID })

		expect(result).toBeUndefined()
	})

	it('returns undefined for expired token', async () => {
		// @ts-ignore
		mockKeys.get.mockResolvedValue({ [TEST_JID]: { token: VALID_TOKEN, timestamp: EXPIRED_TS } })

		const result = await buildTcTokenFromJid({ authState: { keys: mockKeys }, jid: TEST_JID })

		expect(result).toBeUndefined()
	})

	it('deletes expired token from store (Phase 5 opportunistic cleanup)', async () => {
		// @ts-ignore
		mockKeys.get.mockResolvedValue({ [TEST_JID]: { token: VALID_TOKEN, timestamp: EXPIRED_TS } })

		await buildTcTokenFromJid({ authState: { keys: mockKeys }, jid: TEST_JID })

		expect(mockKeys.set).toHaveBeenCalledWith({ tctoken: { [TEST_JID]: null } })
	})

	it('does NOT delete when token is simply missing', async () => {
		// @ts-ignore
		mockKeys.get.mockResolvedValue({})

		await buildTcTokenFromJid({ authState: { keys: mockKeys }, jid: TEST_JID })

		expect(mockKeys.set).not.toHaveBeenCalled()
	})

	it('preserves baseContent when no token', async () => {
		// @ts-ignore
		mockKeys.get.mockResolvedValue({})
		const existingNode: BinaryNode = { tag: 'picture', attrs: { type: 'image' } }

		const result = await buildTcTokenFromJid({
			authState: { keys: mockKeys },
			jid: TEST_JID,
			baseContent: [existingNode]
		})

		expect(result).toEqual([existingNode])
	})

	it('appends tctoken to existing baseContent', async () => {
		// @ts-ignore
		mockKeys.get.mockResolvedValue({ [TEST_JID]: { token: VALID_TOKEN, timestamp: RECENT_TS } })
		const existingNode: BinaryNode = { tag: 'picture', attrs: { type: 'image' } }

		const result = await buildTcTokenFromJid({
			authState: { keys: mockKeys },
			jid: TEST_JID,
			baseContent: [existingNode]
		})

		expect(result).toHaveLength(2)
		expect(result![0]).toBe(existingNode)
		const appended = result![1]!
		expect(appended.tag).toBe('tctoken')
		expect(appended.content).toBe(VALID_TOKEN)
	})

	it('handles key store errors gracefully', async () => {
		// @ts-ignore
		mockKeys.get.mockRejectedValueOnce(new Error('database error'))

		const result = await buildTcTokenFromJid({ authState: { keys: mockKeys }, jid: TEST_JID })

		expect(result).toBeUndefined()
	})

	it('handles key store errors with baseContent fallback', async () => {
		// @ts-ignore
		mockKeys.get.mockRejectedValueOnce(new Error('database error'))
		const existingNode: BinaryNode = { tag: 'picture', attrs: { type: 'image' } }

		const result = await buildTcTokenFromJid({
			authState: { keys: mockKeys },
			jid: TEST_JID,
			baseContent: [existingNode]
		})

		expect(result).toEqual([existingNode])
	})

	it('returns undefined when token has no timestamp (treated as expired)', async () => {
		// @ts-ignore
		mockKeys.get.mockResolvedValue({ [TEST_JID]: { token: VALID_TOKEN } })

		const result = await buildTcTokenFromJid({ authState: { keys: mockKeys }, jid: TEST_JID })

		expect(result).toBeUndefined()
	})
})

// ─── Phase 3: getErrorCodeFromStreamError (stream error parser) ─────────

describe('getErrorCodeFromStreamError', () => {
	const makeStreamError = (attrs: Record<string, string>, content: BinaryNode[] = []): BinaryNode => ({
		tag: 'stream:error',
		attrs,
		content
	})

	describe('conflict errors', () => {
		it('maps conflict type=replaced to connectionReplaced', () => {
			const node = makeStreamError({}, [{ tag: 'conflict', attrs: { type: 'replaced' } }])
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('replaced')
			expect(statusCode).toBe(DisconnectReason.connectionReplaced)
		})

		it('maps conflict type=device_removed to loggedOut', () => {
			const node = makeStreamError({}, [{ tag: 'conflict', attrs: { type: 'device_removed' } }])
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('device_removed')
			expect(statusCode).toBe(DisconnectReason.loggedOut)
		})

		it('maps conflict with unknown type to device_removed (WA Web default)', () => {
			// WA Web's switch/default falls to device_removed for unknown types
			const node = makeStreamError({}, [{ tag: 'conflict', attrs: { type: 'something_else' } }])
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('device_removed')
			expect(statusCode).toBe(DisconnectReason.loggedOut)
		})

		it('maps conflict with no type attribute to device_removed', () => {
			const node = makeStreamError({}, [{ tag: 'conflict', attrs: {} }])
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('device_removed')
			expect(statusCode).toBe(DisconnectReason.loggedOut)
		})

		it('conflict takes priority over code attribute', () => {
			const node = makeStreamError({ code: '515' }, [{ tag: 'conflict', attrs: { type: 'replaced' } }])
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('replaced')
			expect(statusCode).toBe(DisconnectReason.connectionReplaced)
		})
	})

	describe('numeric code errors', () => {
		it('maps code 515 to restartRequired', () => {
			const node = makeStreamError({ code: '515' })
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('restart required')
			expect(statusCode).toBe(DisconnectReason.restartRequired)
		})

		it('maps code 516 to sessionInvalidated', () => {
			const node = makeStreamError({ code: '516' })
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('session invalidated')
			expect(statusCode).toBe(DisconnectReason.sessionInvalidated)
		})

		it('passes through other numeric codes', () => {
			const node = makeStreamError({ code: '503' })
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('code 503')
			expect(statusCode).toBe(503)
		})

		it('code takes priority over non-conflict child tags', () => {
			const node = makeStreamError({ code: '515' }, [{ tag: 'ack', attrs: { id: '123' } }])
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('restart required')
			expect(statusCode).toBe(515)
		})
	})

	describe('child-based errors', () => {
		it('maps ack child to badSession', () => {
			const node = makeStreamError({}, [{ tag: 'ack', attrs: { id: 'msg123' } }])
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('ack')
			expect(statusCode).toBe(DisconnectReason.badSession)
		})

		it('maps xml-not-well-formed to badSession', () => {
			const node = makeStreamError({}, [{ tag: 'xml-not-well-formed', attrs: {} }])
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('xml-not-well-formed')
			expect(statusCode).toBe(DisconnectReason.badSession)
		})

		it('maps unknown child tag to badSession with tag as reason', () => {
			const node = makeStreamError({}, [{ tag: 'something-weird', attrs: {} }])
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('something-weird')
			expect(statusCode).toBe(DisconnectReason.badSession)
		})
	})

	describe('edge cases', () => {
		it('handles empty node (no children, no code)', () => {
			const node = makeStreamError({})
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('unknown')
			expect(statusCode).toBe(DisconnectReason.badSession)
		})

		it('handles node with empty content array', () => {
			const node = makeStreamError({}, [])
			const { reason, statusCode } = getErrorCodeFromStreamError(node)
			expect(reason).toBe('unknown')
			expect(statusCode).toBe(DisconnectReason.badSession)
		})
	})
})

// ─── Phase 3: SERVER_ERROR_CODES constants ──────────────────────────────

describe('SERVER_ERROR_CODES', () => {
	it('MissingTcToken is 463', () => {
		expect(SERVER_ERROR_CODES.MissingTcToken).toBe('463')
	})

	it('SmaxInvalid is 479', () => {
		expect(SERVER_ERROR_CODES.SmaxInvalid).toBe('479')
	})

	it('StaleGroupAddressingMode is 421', () => {
		expect(SERVER_ERROR_CODES.StaleGroupAddressingMode).toBe('421')
	})

	it('NewChatMessagesCapped is 475', () => {
		expect(SERVER_ERROR_CODES.NewChatMessagesCapped).toBe('475')
	})
})

// ─── Integration scenarios: Phases 1, 2, 4, 5 lifecycle ────────────────

describe('tctoken integration scenarios', () => {
	const JID_A = 'alice@s.whatsapp.net'
	const JID_B = 'bob@s.whatsapp.net'
	const JID_C = 'charlie@s.whatsapp.net'
	const TOKEN_A = Buffer.from([4, 1, 33, 254, 110, 59])
	const TOKEN_B = Buffer.from([4, 2, 44, 128, 200, 12])

	let mockKeys: jest.Mocked<SignalKeyStoreWithTransaction>

	beforeEach(() => {
		mockKeys = createMockKeys()
	})

	describe('Phase 1: token fetch and store flow', () => {
		it('token missing → fetch stores new token → subsequent read finds it', async () => {
			const recentTs = String(nowSeconds())

			// First read: no token
			// @ts-ignore
			mockKeys.get.mockResolvedValueOnce({})

			const result1 = await buildTcTokenFromJid({ authState: { keys: mockKeys }, jid: JID_A })
			expect(result1).toBeUndefined()

			// Simulate: after fetch, token is stored
			await mockKeys.set({ tctoken: { [JID_A]: { token: TOKEN_A, timestamp: recentTs } } })
			expect(mockKeys.set).toHaveBeenCalledWith({
				tctoken: { [JID_A]: { token: TOKEN_A, timestamp: recentTs } }
			})

			// Second read: token found
			// @ts-ignore
			mockKeys.get.mockResolvedValueOnce({ [JID_A]: { token: TOKEN_A, timestamp: recentTs } })

			const result2 = await buildTcTokenFromJid({ authState: { keys: mockKeys }, jid: JID_A })
			expect(result2).toBeDefined()
			const node2 = result2![0]!
			expect(node2.tag).toBe('tctoken')
			expect(node2.content).toBe(TOKEN_A)
		})
	})

	describe('Phase 2: expired token triggers re-fetch', () => {
		it('expired token is detected and deleted, then re-fetch stores fresh token', async () => {
			const expiredTs = String(nowSeconds() - 30 * 86400)
			const freshTs = String(nowSeconds())

			// Read expired token → returns undefined, triggers cleanup
			// @ts-ignore
			mockKeys.get.mockResolvedValueOnce({ [JID_A]: { token: TOKEN_A, timestamp: expiredTs } })

			const result1 = await buildTcTokenFromJid({ authState: { keys: mockKeys }, jid: JID_A })
			expect(result1).toBeUndefined()
			expect(isTcTokenExpired(expiredTs)).toBe(true)

			// Verify expired entry deleted
			expect(mockKeys.set).toHaveBeenCalledWith({ tctoken: { [JID_A]: null } })

			// After re-fetch, fresh token stored and readable
			// @ts-ignore
			mockKeys.get.mockResolvedValueOnce({ [JID_A]: { token: TOKEN_B, timestamp: freshTs } })

			const result2 = await buildTcTokenFromJid({ authState: { keys: mockKeys }, jid: JID_A })
			expect(result2).toBeDefined()
			const freshNode = result2![0]!
			expect(freshNode.content).toBe(TOKEN_B)
		})
	})

	describe('Phase 2: shouldSendNewTcToken gates fire-and-forget', () => {
		it('recent senderTimestamp prevents re-issuance', () => {
			const recentTs = nowSeconds() - 100
			expect(shouldSendNewTcToken(recentTs)).toBe(false)
		})

		it('old senderTimestamp triggers re-issuance', () => {
			const oldTs = nowSeconds() - BUCKET_DURATION - 1
			expect(shouldSendNewTcToken(oldTs)).toBe(true)
		})

		it('senderTimestamp update prevents next issuance in same bucket', () => {
			// Before update: should issue
			expect(shouldSendNewTcToken(undefined)).toBe(true)

			// After update with current timestamp
			const newTs = nowSeconds()
			expect(shouldSendNewTcToken(newTs)).toBe(false)
		})
	})

	describe('senderTimestamp preservation on token update', () => {
		it('simulates notification handler preserving senderTimestamp via spread', () => {
			// This tests the pattern: { ...existing, token, timestamp }
			// which preserves senderTimestamp from the existing entry
			const existingEntry = {
				token: TOKEN_A,
				timestamp: '1770912853',
				senderTimestamp: 1770912855
			}
			const newToken = Buffer.from([4, 1, 33, 99, 88])
			const newTimestamp = '1770920492'

			// Spread preserves senderTimestamp
			const merged = { ...existingEntry, token: newToken, timestamp: newTimestamp }

			expect(merged.token).toBe(newToken)
			expect(merged.timestamp).toBe(newTimestamp)
			expect(merged.senderTimestamp).toBe(1770912855)
		})

		it('spread with undefined existing does not crash', () => {
			const newToken = Buffer.from([4, 1, 33, 99, 88])
			const newTimestamp = '1770920492'
			// Simulates keys.get returning {} for unknown JID → entry is undefined
			const existing = ({} as Record<string, any>)['unknown@lid']

			// Spread of undefined is a no-op at runtime
			const merged = { ...existing, token: newToken, timestamp: newTimestamp }

			expect(merged.token).toBe(newToken)
			expect(merged.timestamp).toBe(newTimestamp)
			expect(merged).not.toHaveProperty('senderTimestamp')
		})
	})

	describe('Phase 4: identity change re-issuance decision', () => {
		it('re-issues when senderTimestamp is recent (within 28-day window)', async () => {
			const recentSenderTs = nowSeconds() - 5 * 86400 // 5 days ago
			// @ts-ignore
			mockKeys.get.mockResolvedValue({
				[JID_A]: { token: TOKEN_A, timestamp: String(recentSenderTs), senderTimestamp: recentSenderTs }
			})

			const tcTokenData = await mockKeys.get('tctoken', [JID_A])
			const senderTs = tcTokenData[JID_A]?.senderTimestamp

			// Valid senderTimestamp → should re-issue
			expect(senderTs).toBeDefined()
			expect(isTcTokenExpired(senderTs)).toBe(false)
		})

		it('does NOT re-issue when senderTimestamp is expired', async () => {
			const expiredSenderTs = nowSeconds() - 30 * 86400 // 30 days ago
			// @ts-ignore
			mockKeys.get.mockResolvedValue({
				[JID_A]: { token: TOKEN_A, timestamp: String(expiredSenderTs), senderTimestamp: expiredSenderTs }
			})

			const tcTokenData = await mockKeys.get('tctoken', [JID_A])
			const senderTs = tcTokenData[JID_A]?.senderTimestamp

			// Expired senderTimestamp → should NOT re-issue
			expect(senderTs).toBeDefined()
			expect(isTcTokenExpired(senderTs)).toBe(true)
		})

		it('does NOT re-issue when no senderTimestamp exists', async () => {
			// @ts-ignore
			mockKeys.get.mockResolvedValue({ [JID_A]: { token: TOKEN_A, timestamp: String(nowSeconds()) } })

			const tcTokenData = await mockKeys.get('tctoken', [JID_A])
			const senderTs = tcTokenData[JID_A]?.senderTimestamp

			// No senderTimestamp → isTcTokenExpired(undefined) = true → don't re-issue
			expect(senderTs).toBeUndefined()
			expect(isTcTokenExpired(undefined)).toBe(true)
		})
	})

	describe('Phase 5: token pruning', () => {
		it('prune correctly identifies expired vs valid tokens', () => {
			const now = nowSeconds()
			const entries = {
				[JID_A]: { token: TOKEN_A, timestamp: String(now - 86400) }, // valid (1 day old)
				[JID_B]: { token: TOKEN_B, timestamp: String(now - 30 * 86400) }, // expired (30 days old)
				[JID_C]: { token: TOKEN_A, timestamp: String(now - 20 * 86400) } // valid (20 days old)
			}

			const expiredJids: string[] = []
			const validJids: string[] = []

			for (const [jid, entry] of Object.entries(entries)) {
				if (isTcTokenExpired(entry.timestamp)) {
					expiredJids.push(jid)
				} else {
					validJids.push(jid)
				}
			}

			expect(expiredJids).toEqual([JID_B])
			expect(validJids).toContain(JID_A)
			expect(validJids).toContain(JID_C)
		})

		it('prune builds correct deletion map', () => {
			const now = nowSeconds()
			const entries = {
				[JID_A]: { token: TOKEN_A, timestamp: String(now - 86400) },
				[JID_B]: { token: TOKEN_B, timestamp: String(now - 30 * 86400) }
			}

			const deletions: Record<string, null> = {}
			for (const [jid, entry] of Object.entries(entries)) {
				if (isTcTokenExpired(entry.timestamp)) {
					deletions[jid] = null
				}
			}

			expect(deletions).toEqual({ [JID_B]: null })
			expect(deletions[JID_A]).toBeUndefined() // valid entry not in deletions
		})

		it('prune with all tokens valid results in no deletions', () => {
			const now = nowSeconds()
			const entries = {
				[JID_A]: { token: TOKEN_A, timestamp: String(now - 86400) },
				[JID_B]: { token: TOKEN_B, timestamp: String(now - 3 * 86400) }
			}

			const deletions: Record<string, null> = {}
			for (const [jid, entry] of Object.entries(entries)) {
				if (isTcTokenExpired(entry.timestamp)) {
					deletions[jid] = null
				}
			}

			expect(Object.keys(deletions)).toHaveLength(0)
		})

		it('prune with all tokens expired results in full cleanup', () => {
			const now = nowSeconds()
			const entries = {
				[JID_A]: { token: TOKEN_A, timestamp: String(now - 30 * 86400) },
				[JID_B]: { token: TOKEN_B, timestamp: String(now - 35 * 86400) }
			}

			const deletions: Record<string, null> = {}
			for (const [jid, entry] of Object.entries(entries)) {
				if (isTcTokenExpired(entry.timestamp)) {
					deletions[jid] = null
				}
			}

			expect(Object.keys(deletions)).toHaveLength(2)
			expect(deletions[JID_A]).toBeNull()
			expect(deletions[JID_B]).toBeNull()
		})

		it('prune handles entries with missing timestamp', () => {
			const entries = {
				[JID_A]: { token: TOKEN_A } // no timestamp → treated as expired
			}

			const deletions: Record<string, null> = {}
			for (const [jid, entry] of Object.entries(entries)) {
				if (isTcTokenExpired((entry as any).timestamp)) {
					deletions[jid] = null
				}
			}

			expect(deletions[JID_A]).toBeNull()
		})
	})

	describe('full lifecycle simulation', () => {
		it('token goes through complete lifecycle: missing → fetch → valid → bucket cross → expired → prune', () => {
			const now = nowSeconds()
			const bucketStart = Math.floor(now / BUCKET_DURATION) * BUCKET_DURATION

			// Step 1: Token missing → isTcTokenExpired(undefined) triggers fetch
			expect(isTcTokenExpired(undefined)).toBe(true)
			expect(shouldSendNewTcToken(undefined)).toBe(true)

			// Step 2: After fetch — token is fresh, no need to re-issue in same bucket
			const fetchTime = now
			expect(isTcTokenExpired(fetchTime)).toBe(false)
			expect(shouldSendNewTcToken(fetchTime)).toBe(false)

			// Step 3: Still in same bucket — token valid, no fire-and-forget
			expect(isTcTokenExpired(fetchTime)).toBe(false)
			expect(shouldSendNewTcToken(fetchTime)).toBe(false)

			// Step 4: Next bucket boundary crossed — shouldSendNewTcToken triggers
			const nextBucketTs = bucketStart - 1 // timestamp from previous bucket
			expect(shouldSendNewTcToken(nextBucketTs)).toBe(true)

			// After re-issuing, senderTimestamp updated to current bucket
			expect(shouldSendNewTcToken(now)).toBe(false)

			// Step 5: Token received long ago → expired
			const oldToken = now - 30 * 86400
			expect(isTcTokenExpired(oldToken)).toBe(true)

			// Step 6: Identity change — check senderTimestamp
			// Recent sender timestamp → re-issue
			const recentSender = now - 5 * 86400
			expect(isTcTokenExpired(recentSender)).toBe(false) // still valid → re-issue

			// Expired sender timestamp → don't re-issue
			const expiredSender = now - 30 * 86400
			expect(isTcTokenExpired(expiredSender)).toBe(true) // expired → skip

			// Step 7: Prune — only old tokens cleaned
			expect(isTcTokenExpired(fetchTime)).toBe(false) // fresh → keep
			expect(isTcTokenExpired(oldToken)).toBe(true) // old → delete
		})

		it('senderTimestamp and received timestamp are independent', () => {
			const now = nowSeconds()
			const entry = {
				token: TOKEN_A,
				timestamp: String(now - 86400), // received 1 day ago (valid)
				senderTimestamp: now - 10 * 86400 // issued 10 days ago (different bucket)
			}

			// Received token is valid
			expect(isTcTokenExpired(entry.timestamp)).toBe(false)

			// But we should re-issue our token (crossed bucket boundary)
			expect(shouldSendNewTcToken(entry.senderTimestamp)).toBe(true)
		})

		it('multiple contacts have independent token lifecycles', async () => {
			const now = nowSeconds()

			// @ts-ignore
			mockKeys.get.mockResolvedValue({
				[JID_A]: { token: TOKEN_A, timestamp: String(now - 86400) }, // valid
				[JID_B]: { token: TOKEN_B, timestamp: String(now - 30 * 86400) } // expired
			})

			const data = await mockKeys.get('tctoken', [JID_A, JID_B])

			// A is valid
			expect(isTcTokenExpired(data[JID_A]!.timestamp)).toBe(false)

			// B is expired
			expect(isTcTokenExpired(data[JID_B]!.timestamp)).toBe(true)
		})
	})

	describe('tctoken index persistence', () => {
		const INDEX_KEY = '__index'

		it('index round-trips through JSON-encoded Buffer', () => {
			const jids = [JID_A, JID_B, '999@lid']
			const token = Buffer.from(JSON.stringify(jids))
			const parsed: string[] = JSON.parse(token.toString())
			expect(parsed).toEqual(jids)
		})

		it('index ignores sentinel key when loading', () => {
			const jids = [JID_A, INDEX_KEY, JID_B, '', null as any]
			const loaded = new Set<string>()
			for (const jid of jids) {
				if (jid && jid !== INDEX_KEY) {
					loaded.add(jid)
				}
			}

			expect(loaded.has(JID_A)).toBe(true)
			expect(loaded.has(JID_B)).toBe(true)
			expect(loaded.has(INDEX_KEY)).toBe(false)
			expect(loaded.size).toBe(2)
		})

		it('index enables pruning of tokens from previous sessions', () => {
			const now = nowSeconds()
			// Simulate: index loaded from store with 3 JIDs from previous session
			const knownJids = new Set([JID_A, JID_B, '999@lid'])

			// Simulate token state: A valid, B expired, 999 missing
			const allTokens: Record<string, { token: Buffer; timestamp: string } | undefined> = {
				[JID_A]: { token: TOKEN_A, timestamp: String(now - 86400) },
				[JID_B]: { token: TOKEN_B, timestamp: String(now - 30 * 86400) }
				// 999@lid not in store → undefined
			}

			const expiredDeletions: Record<string, null> = {}
			for (const jid of knownJids) {
				const entry = allTokens[jid]
				if (!entry?.token || isTcTokenExpired(entry.timestamp)) {
					expiredDeletions[jid] = null
					knownJids.delete(jid)
				}
			}

			// B (expired) and 999 (missing) should be pruned
			expect(expiredDeletions[JID_B]).toBeNull()
			expect(expiredDeletions['999@lid']).toBeNull()
			// A should survive
			expect(expiredDeletions[JID_A]).toBeUndefined()
			expect(knownJids.has(JID_A)).toBe(true)
			expect(knownJids.size).toBe(1)

			// Updated index should only contain A
			const updatedIndex = JSON.parse(Buffer.from(JSON.stringify([...knownJids])).toString())
			expect(updatedIndex).toEqual([JID_A])
		})

		it('only schedules index save when JID is new', () => {
			const knownJids = new Set<string>()
			let saveCount = 0
			const scheduleSave = () => {
				saveCount++
			}

			// First add → triggers save
			if (!knownJids.has(JID_A)) {
				knownJids.add(JID_A)
				scheduleSave()
			}

			expect(saveCount).toBe(1)

			// Duplicate add → no save
			if (!knownJids.has(JID_A)) {
				knownJids.add(JID_A)
				scheduleSave()
			}

			expect(saveCount).toBe(1)

			// New JID → triggers save
			if (!knownJids.has(JID_B)) {
				knownJids.add(JID_B)
				scheduleSave()
			}

			expect(saveCount).toBe(2)
		})
	})
})
