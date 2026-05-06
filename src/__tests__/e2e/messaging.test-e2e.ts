import { jest } from '@jest/globals'
import { proto } from '../../index'
import { TestClient } from './helpers/test-client'

jest.setTimeout(60_000)

describe('Messaging (DM)', () => {
	let alice: TestClient
	let bob: TestClient

	beforeAll(async () => {
		;[alice, bob] = await Promise.all([TestClient.connect(), TestClient.connect()])
	})

	afterAll(async () => {
		await Promise.all([alice?.cleanup(), bob?.cleanup()])
	})

	test('alice sends a text message to bob', async () => {
		const text = `Hello Bob ${Date.now()}`
		const received = bob.waitForText(text)

		await alice.sock.sendMessage(bob.meJid, { text })
		const msg = await received

		expect(msg.key?.fromMe).toBe(false)
		expect(msg.message?.conversation || msg.message?.extendedTextMessage?.text).toBe(text)
	})

	test('alice and bob exchange messages bidirectionally', async () => {
		const fromAlice = `Hello Bob, this is Alice ${Date.now()}`
		const aliceToBob = bob.waitForText(fromAlice)
		await alice.sock.sendMessage(bob.meJid, { text: fromAlice })
		await aliceToBob

		const fromBob = `Hello Alice, this is Bob ${Date.now()}`
		const bobToAlice = alice.waitForText(fromBob)
		await bob.sock.sendMessage(alice.meJid, { text: fromBob })
		await bobToAlice
	})

	test('alice revokes a sent message and bob receives the protocol message', async () => {
		const text = `This will be revoked ${Date.now()}`
		const received = bob.waitForText(text)

		const sent = await alice.sock.sendMessage(bob.meJid, { text })
		await received

		const revokeReceived = bob.waitForMessage(
			m => m.message?.protocolMessage?.type === proto.Message.ProtocolMessage.Type.REVOKE
		)
		await alice.sock.sendMessage(bob.meJid, { delete: sent!.key })

		const revoke = await revokeReceived
		expect(revoke.message?.protocolMessage?.key?.id).toBe(sent!.key.id)
	})

	test('received message carries the sender push name', async () => {
		const text = `Hello with push name ${Date.now()}`
		const received = bob.waitForText(text)

		await alice.sock.sendMessage(bob.meJid, { text })
		const msg = await received

		expect(msg.pushName).toBe(alice.pushName)
	})
})
