import { jest } from '@jest/globals'
import type { SignalKeyStoreWithTransaction } from '../../Types'
import { buildTcTokenFromJid } from '../../Utils/tc-token-utils'

const makeMockKeys = (
	tokenData: Record<string, { token: Buffer; timestamp?: string } | null | undefined> = {}
): jest.Mocked<SignalKeyStoreWithTransaction> => ({
	get: jest.fn(async (_type: any, jids: string[]) => {
		const result: any = {}
		for (const jid of jids) {
			result[jid] = tokenData[jid]
		}
		return result
	}) as any,
	set: jest.fn(async () => {}) as any,
	transaction: jest.fn(async (work: any) => await work()) as any,
	isInTransaction: jest.fn(() => false) as any
})

describe('buildTcTokenFromJid', () => {
	describe('when no token is stored for the JID', () => {
		it('should return undefined when no token and no baseContent', async () => {
			const keys = makeMockKeys({})
			const result = await buildTcTokenFromJid({
				authState: { keys },
				jid: 'user@s.whatsapp.net'
			})
			expect(result).toBeUndefined()
		})

		it('should return baseContent when no token but baseContent provided', async () => {
			const keys = makeMockKeys({})
			const baseContent = [{ tag: 'picture', attrs: { type: 'preview', query: 'url' } }]
			const result = await buildTcTokenFromJid({
				authState: { keys },
				jid: 'user@s.whatsapp.net',
				baseContent
			})
			expect(result).toEqual(baseContent)
		})

		it('should return undefined when token entry exists but token is undefined', async () => {
			const keys = makeMockKeys({ 'user@s.whatsapp.net': { token: undefined as any } })
			const result = await buildTcTokenFromJid({
				authState: { keys },
				jid: 'user@s.whatsapp.net'
			})
			expect(result).toBeUndefined()
		})

		it('should return undefined when token entry is null', async () => {
			const keys = makeMockKeys({ 'user@s.whatsapp.net': null as any })
			const result = await buildTcTokenFromJid({
				authState: { keys },
				jid: 'user@s.whatsapp.net'
			})
			expect(result).toBeUndefined()
		})
	})

	describe('when a token is stored for the JID', () => {
		it('should append a tctoken node to baseContent when token present', async () => {
			const token = Buffer.from('test-tc-token-data')
			const keys = makeMockKeys({
				'user@s.whatsapp.net': { token, timestamp: '1700000000' }
			})
			const baseContent = [{ tag: 'picture', attrs: { type: 'preview', query: 'url' } }]

			const result = await buildTcTokenFromJid({
				authState: { keys },
				jid: 'user@s.whatsapp.net',
				baseContent
			})

			expect(result).toHaveLength(2)
			expect(result![0]).toEqual({ tag: 'picture', attrs: { type: 'preview', query: 'url' } })
			expect(result![1]).toEqual({ tag: 'tctoken', attrs: {}, content: token })
		})

		it('should return array with only tctoken when no baseContent provided', async () => {
			const token = Buffer.from('my-tc-token')
			const keys = makeMockKeys({
				'user@s.whatsapp.net': { token, timestamp: '1700000000' }
			})

			const result = await buildTcTokenFromJid({
				authState: { keys },
				jid: 'user@s.whatsapp.net'
			})

			expect(result).toHaveLength(1)
			expect(result![0]).toEqual({ tag: 'tctoken', attrs: {}, content: token })
		})

		it('should look up token using the exact JID provided (no LID resolution)', async () => {
			const token = Buffer.from('token-for-lid')
			const lidJid = '123456789@lid'
			const keys = makeMockKeys({
				[lidJid]: { token, timestamp: '1700000000' }
			})

			const result = await buildTcTokenFromJid({
				authState: { keys },
				jid: lidJid
			})

			expect(result).toHaveLength(1)
			expect(result![0].tag).toBe('tctoken')
			// Verify keys.get was called with the LID directly (no resolution)
			expect(keys.get).toHaveBeenCalledWith('tctoken', [lidJid])
		})

		it('should include exact token buffer content in the node', async () => {
			const tokenBytes = Buffer.from([0xde, 0xad, 0xbe, 0xef, 0xca, 0xfe])
			const keys = makeMockKeys({
				'user@s.whatsapp.net': { token: tokenBytes }
			})

			const result = await buildTcTokenFromJid({
				authState: { keys },
				jid: 'user@s.whatsapp.net'
			})

			expect(result![0].content).toBe(tokenBytes)
		})
	})

	describe('error handling', () => {
		it('should return undefined when keys.get throws and no baseContent', async () => {
			const keys = makeMockKeys()
			keys.get = jest.fn().mockRejectedValue(new Error('DB error')) as any

			const result = await buildTcTokenFromJid({
				authState: { keys },
				jid: 'user@s.whatsapp.net'
			})
			expect(result).toBeUndefined()
		})

		it('should return baseContent when keys.get throws and baseContent provided', async () => {
			const keys = makeMockKeys()
			keys.get = jest.fn().mockRejectedValue(new Error('DB error')) as any

			const baseContent = [{ tag: 'picture', attrs: { type: 'preview', query: 'url' } }]
			const result = await buildTcTokenFromJid({
				authState: { keys },
				jid: 'user@s.whatsapp.net',
				baseContent
			})
			expect(result).toEqual(baseContent)
		})
	})

	describe('no longer resolves LID from PN (simplified behavior)', () => {
		it('should not perform LID-PN resolution; uses jid as-is for lookup', async () => {
			const pnJid = 'user@s.whatsapp.net'
			// Token stored under PN JID
			const token = Buffer.from('token-under-pn')
			const keys = makeMockKeys({ [pnJid]: { token } })

			const result = await buildTcTokenFromJid({
				authState: { keys },
				jid: pnJid
			})

			// Should find token directly under PN JID (no LID resolution)
			expect(result).toHaveLength(1)
			expect(result![0].tag).toBe('tctoken')
			expect(keys.get).toHaveBeenCalledWith('tctoken', [pnJid])
		})
	})
})