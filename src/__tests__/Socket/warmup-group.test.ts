import { jest } from '@jest/globals'
import { createPeerSessionsCache, readCacheEntry, warmUpGroupParticipants, warmUpGroupSend } from '../../Socket/messages-send'
import type { CacheStore, GroupMetadata } from '../../Types'

const makeGroupMetadata = (participants: string[]): GroupMetadata => ({
	id: '12345@g.us',
	subject: 'Test Group',
	owner: 'owner@s.whatsapp.net',
	participants: participants.map(id => ({ id })),
	size: participants.length
})

describe('Group warm-up', () => {
	it('passes through a provided peer sessions cache', () => {
		const cache: CacheStore = {
			get: <T>() => undefined as T | undefined,
			set: () => undefined,
			del: () => undefined,
			flushAll: () => undefined
		}

		expect(createPeerSessionsCache(cache)).toBe(cache)
	})

	it('awaits async cache reads before using the value', async () => {
		const cache: CacheStore = {
			get: async <T>() => true as T,
			set: () => undefined,
			del: () => undefined,
			flushAll: () => undefined
		}

		await expect(readCacheEntry<boolean>(cache, 'signal-id')).resolves.toBe(true)
	})

	it('does not use sendNode and warms the full group from cached metadata', async () => {
		const cachedMetadata = makeGroupMetadata([
			'user-1@s.whatsapp.net',
			'user-2@s.whatsapp.net',
			'user-3@s.whatsapp.net'
		])
		const sendNode = jest.fn()
		const getUSyncDevices = jest.fn(async (jids: string[]) => jids.map(jid => ({ jid })))
		const assertSessions = jest.fn(async (_jids: string[], _force?: boolean, summary?: { existingCount: number; fetchedCount: number }) => {
			if (summary) {
				summary.existingCount = 1
				summary.fetchedCount = 2
			}
			return true
		})
		const groupMetadata = jest.fn(async () => undefined) as jest.MockedFunction<
			(jid: string) => Promise<GroupMetadata | undefined>
		>

		const summary = await warmUpGroupSend('12345@g.us', {
			cachedGroupMetadata: async () => cachedMetadata,
			groupMetadata,
			getUSyncDevices,
			assertSessions,
			// Extra field to assert that the warm-up helper never touches message send plumbing.
			sendNode
		} as any)

		expect(summary).toMatchObject({
			groupJid: '12345@g.us',
			metadataSource: 'cache',
			participants: 3,
			devices: 3,
			sessionsExisting: 1,
			sessionsFetched: 2
		})
		expect(summary.durationMs).toBeGreaterThanOrEqual(0)
		expect(getUSyncDevices).toHaveBeenCalledWith(
			['user-1@s.whatsapp.net', 'user-2@s.whatsapp.net', 'user-3@s.whatsapp.net'],
			true,
			false
		)
		expect(assertSessions).toHaveBeenCalledWith(
			['user-1@s.whatsapp.net', 'user-2@s.whatsapp.net', 'user-3@s.whatsapp.net'],
			false,
			expect.any(Object)
		)
		expect(assertSessions.mock.calls[0]?.[2]).toMatchObject({ existingCount: 1, fetchedCount: 2 })
		expect(sendNode).not.toHaveBeenCalled()
	})

	it('supports incremental participant warm-up without re-reading the group', async () => {
		const getUSyncDevices = jest.fn(async (jids: string[]) => jids.map(jid => ({ jid })))
		const assertSessions = jest.fn(async (_jids: string[], _force?: boolean, summary?: { existingCount: number; fetchedCount: number }) => {
			if (summary) {
				summary.existingCount = 0
				summary.fetchedCount = 1
			}
			return true
		})
		const groupMetadata = jest.fn(async () => undefined) as jest.MockedFunction<
			(jid: string) => Promise<GroupMetadata | undefined>
		>

		const summary = await warmUpGroupParticipants('12345@g.us', ['changed-user@s.whatsapp.net'], {
			groupMetadata,
			getUSyncDevices,
			assertSessions
		})

		expect(summary).toMatchObject({
			groupJid: '12345@g.us',
			participants: 1,
			devices: 1,
			sessionsExisting: 0,
			sessionsFetched: 1
		})
		expect(summary.durationMs).toBeGreaterThanOrEqual(0)
		expect(groupMetadata).not.toHaveBeenCalled()
		expect(getUSyncDevices).toHaveBeenCalledWith(['changed-user@s.whatsapp.net'], true, false)
	})

	it('propagates group metadata failures instead of fabricating a missing summary', async () => {
		const getUSyncDevices = jest.fn(async () => [])
		const assertSessions = jest.fn(async () => true)
		const groupMetadata = jest.fn(async () => {
			throw new Error('group fetch failed')
		}) as jest.MockedFunction<(jid: string) => Promise<GroupMetadata | undefined>>

		await expect(
			warmUpGroupSend('12345@g.us', {
				groupMetadata,
				getUSyncDevices,
				assertSessions
			})
		).rejects.toThrow('group fetch failed')

		expect(groupMetadata).toHaveBeenCalledWith('12345@g.us')
		expect(getUSyncDevices).not.toHaveBeenCalled()
		expect(assertSessions).not.toHaveBeenCalled()
	})
})
