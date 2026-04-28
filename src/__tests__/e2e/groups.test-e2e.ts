import { jest } from '@jest/globals'
import { TestClient } from './helpers/test-client'

jest.setTimeout(90_000)

/**
 * Create a group and wait until each participant receives the corresponding
 * `groups.upsert` event. Without this barrier, an immediate sendMessage races
 * the recipient's group materialization and arrives before the SKDM session
 * is installable.
 */
const createGroup = async (creator: TestClient, subject: string, members: TestClient[]): Promise<string> => {
	const seenByMembers = members.map(m => m.waitForEvent('groups.upsert', g => g.some(x => x.subject === subject)))
	const { id } = await creator.sock.groupCreate(
		subject,
		members.map(m => m.meJid)
	)
	await Promise.all(seenByMembers)
	return id
}

describe('Groups', () => {
	let alice: TestClient
	let bob: TestClient
	let charlie: TestClient

	beforeAll(async () => {
		;[alice, bob, charlie] = await Promise.all([TestClient.connect(), TestClient.connect(), TestClient.connect()])
	})

	afterAll(async () => {
		await Promise.all([alice?.cleanup(), bob?.cleanup(), charlie?.cleanup()])
	})

	test('alice creates a group, sends a message, adds charlie, and everyone receives subsequent messages', async () => {
		const groupJid = await createGroup(alice, 'E2E Test Group', [bob])

		const text1 = `Hello group from A ${Date.now()}`
		const bobReceives1 = bob.waitForText(text1, { remoteJid: groupJid })
		await alice.sock.sendMessage(groupJid, { text: text1 })
		await bobReceives1

		const charlieSeesGroup = charlie.waitForEvent('groups.upsert', groups => groups.some(g => g.id === groupJid))
		const addResult = await alice.sock.groupParticipantsUpdate(groupJid, [charlie.meJid], 'add')
		expect(addResult[0]?.status).toBe('200')
		await charlieSeesGroup

		const text2 = `Welcome C ${Date.now()}`
		const text2ReceivedByAll = Promise.all([
			bob.waitForText(text2, { remoteJid: groupJid }),
			charlie.waitForText(text2, { remoteJid: groupJid })
		])
		await alice.sock.sendMessage(groupJid, { text: text2 })
		await text2ReceivedByAll

		const text3 = `B says hi ${Date.now()}`
		const text3ReceivedByAll = Promise.all([
			alice.waitForText(text3, { remoteJid: groupJid }),
			charlie.waitForText(text3, { remoteJid: groupJid })
		])
		await bob.sock.sendMessage(groupJid, { text: text3 })
		await text3ReceivedByAll
	})

	test('alice removes charlie from a group', async () => {
		const groupJid = await createGroup(alice, 'Remove Test Group', [bob, charlie])

		const removeResult = await alice.sock.groupParticipantsUpdate(groupJid, [charlie.meJid], 'remove')
		expect(removeResult[0]?.status).toBe('200')

		const text = `After remove ${Date.now()}`
		const bobReceives = bob.waitForText(text, { remoteJid: groupJid })
		await alice.sock.sendMessage(groupJid, { text })
		await bobReceives
	})

	test('alice promotes bob to admin and demotes back', async () => {
		const groupJid = await createGroup(alice, 'Promote Test Group', [bob])

		const promoteResult = await alice.sock.groupParticipantsUpdate(groupJid, [bob.meJid], 'promote')
		expect(promoteResult[0]?.status).toBe('200')

		const demoteResult = await alice.sock.groupParticipantsUpdate(groupJid, [bob.meJid], 'demote')
		expect(demoteResult[0]?.status).toBe('200')
	})

	test('group metadata cache invalidates on participant add', async () => {
		const groupJid = await createGroup(alice, 'Cache Test Group', [bob])

		const before = await alice.sock.groupMetadata(groupJid)
		expect(before.participants.length).toBe(2)

		await alice.sock.groupParticipantsUpdate(groupJid, [charlie.meJid], 'add')

		// stale cache would still report 2 participants
		const after = await alice.sock.groupMetadata(groupJid)
		expect(after.participants.length).toBe(3)
	})
})
