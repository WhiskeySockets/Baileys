import { describe, expect, it, jest } from '@jest/globals'
import {
	type GroupParticipantPrepCoordination,
	warmUpGroupParticipants
} from '../../Socket/messages-send'
import { makeKeyedMutex } from '../../Utils/make-mutex'

describe('Group participant prep coordination', () => {
	const makeCoordination = (): GroupParticipantPrepCoordination => ({
		keyedMutex: makeKeyedMutex(),
		inflightParticipantWarmUps: new Map()
	})

	const baseDeps = (coord: GroupParticipantPrepCoordination) => {
		const groupMetadata = jest.fn(async (_jid: string) => undefined)
		return { groupMetadata }
	}

	it('coalesces concurrent warm-ups with identical group + participant selection into one USync + assertSessions', async () => {
		const coord = makeCoordination()
		const { groupMetadata } = baseDeps(coord)
		let usyncCalls = 0
		const getUSyncDevices = jest.fn(async (jids: string[]) => {
			usyncCalls++
			await new Promise(r => setTimeout(r, 15))
			return jids.map(jid => ({ jid }))
		})
		const assertSessions = jest.fn(async () => true)

		const p = ['a@s.whatsapp.net', 'b@s.whatsapp.net']

		const [a, b] = await Promise.all([
			warmUpGroupParticipants('123@g.us', p, {
				groupMetadata,
				getUSyncDevices,
				assertSessions,
				participantPrepCoordination: coord
			}),
			warmUpGroupParticipants('123@g.us', p, {
				groupMetadata,
				getUSyncDevices,
				assertSessions,
				participantPrepCoordination: coord
			})
		])

		expect(a).toMatchObject(b)
		expect(usyncCalls).toBe(1)
		expect(getUSyncDevices).toHaveBeenCalledTimes(1)
		expect(assertSessions).toHaveBeenCalledTimes(1)
	})

	it('does not coalesce when participant sets differ (same group)', async () => {
		const coord = makeCoordination()
		const { groupMetadata } = baseDeps(coord)
		const getUSyncDevices = jest.fn(async (jids: string[]) => jids.map(jid => ({ jid })))
		const assertSessions = jest.fn(async () => true)

		await Promise.all([
			warmUpGroupParticipants('123@g.us', ['a@s.whatsapp.net'], {
				groupMetadata,
				getUSyncDevices,
				assertSessions,
				participantPrepCoordination: coord
			}),
			warmUpGroupParticipants('123@g.us', ['b@s.whatsapp.net'], {
				groupMetadata,
				getUSyncDevices,
				assertSessions,
				participantPrepCoordination: coord
			})
		])

		expect(getUSyncDevices).toHaveBeenCalledTimes(2)
		expect(assertSessions).toHaveBeenCalledTimes(2)
	})
})
