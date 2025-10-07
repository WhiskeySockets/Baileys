import { jest } from '@jest/globals'
import type { WAMessageKey } from '../../Types'
import type { BinaryNode } from '../../WABinary'
import { jidNormalizedUser } from '../../WABinary'
import {
	createTestSocketAndDependencies,
	getMakeMessagesSocket,
	setupNewsletterMock,
	TEST_JIDS
} from '../TestUtils/mock-socket-dependencies'

let mockNewsletterSocket: jest.Mock
let makeMessagesSocket: (typeof import('../../Socket/messages-send.js'))['makeMessagesSocket']

beforeAll(async () => {
	jest.resetModules()
	mockNewsletterSocket = setupNewsletterMock()
	makeMessagesSocket = await getMakeMessagesSocket()
})

afterEach(() => {
	jest.clearAllMocks()
})

describe('Business logic: group sendMessage resilience', () => {
	test('should successfully send a message to valid group participants, skipping the one that fails', async () => {
		// Use the factory to set up the environment
		const { socket, logger, sendNodeMock } = createTestSocketAndDependencies(mockNewsletterSocket, makeMessagesSocket, {
			failingParticipantJid: TEST_JIDS.badParticipant
		})

		// --- EXECUTION ---
		// Call the public API - sock.sendMessage
		const result = await socket.sendMessage(TEST_JIDS.group, { text: 'Hello, resilient group!' })

		// --- VERIFICATION ---
		// 1. Verify the message was created successfully
		expect(result).toBeDefined()
		expect(result!.key).toBeDefined()
		expect(result!.key.remoteJid).toBe(TEST_JIDS.group)

		// 2. Verify that sendNode was called (message was prepared for sending)
		expect(sendNodeMock).toHaveBeenCalledTimes(1)

		// 3. Inspect the payload that would be sent over the wire
		const sentNode = sendNodeMock.mock.calls[0]?.[0] as BinaryNode | undefined
		const participantsNode = Array.isArray(sentNode?.content)
			? sentNode?.content.find((node: BinaryNode) => node.tag === 'participants')
			: undefined
		const recipientJids = Array.isArray(participantsNode?.content)
			? participantsNode.content.map(node => (node.attrs as any).jid)
			: []

		// 4. Assert the business logic: message prepared for good participants
		expect(recipientJids).toEqual(
			expect.arrayContaining([
				jidNormalizedUser(TEST_JIDS.goodParticipant1),
				jidNormalizedUser(TEST_JIDS.goodParticipant2)
			])
		)

		// 5. Assert the core of the fix: bad participant excluded
		expect(recipientJids).not.toContain(jidNormalizedUser(TEST_JIDS.badParticipant))

		// 6. Assert failure was logged for debugging
		expect(logger.warn).toHaveBeenCalledWith(
			expect.objectContaining({ id: expect.stringContaining(TEST_JIDS.badParticipant) }),
			'Skipping participant due to encryption failure'
		)
	})

	test('should handle multiple participants with mixed encryption states', async () => {
		// Use the factory to set up the environment
		const { socket, logger, sendNodeMock } = createTestSocketAndDependencies(mockNewsletterSocket, makeMessagesSocket, {
			failingParticipantJid: TEST_JIDS.badParticipant
		})

		// --- EXECUTION ---
		// With the fix applied, this should succeed even with a failing participant
		const result = await socket.sendMessage(TEST_JIDS.group, { text: 'Mixed encryption states handled' })

		// --- VERIFICATION ---
		expect(result).toBeDefined()
		expect(sendNodeMock).toHaveBeenCalledTimes(1)

		// Verify warning was logged for the failed participant
		expect(logger.warn).toHaveBeenCalledWith(
			expect.objectContaining({ id: expect.stringContaining(TEST_JIDS.badParticipant) }),
			'Skipping participant due to encryption failure'
		)
	})

	test('should include the "edit" attribute when sending an edited message', async () => {
		// We don't need any failing participants for this test.
		const { socket, sendNodeMock } = createTestSocketAndDependencies(mockNewsletterSocket, makeMessagesSocket, {
			failingParticipantJid: 'no-one-will-fail@s.whatsapp.net'
		})

		const originalMessageKey: WAMessageKey = {
			remoteJid: TEST_JIDS.group,
			id: 'ORIGINAL_MESSAGE_ID',
			fromMe: true
		}

		// --- EXECUTION ---
		await socket.sendMessage(TEST_JIDS.group, {
			text: 'This is an edited message',
			edit: originalMessageKey
		})

		// --- VERIFICATION ---
		expect(sendNodeMock).toHaveBeenCalledTimes(1)

		const sentNode = sendNodeMock.mock.calls[0]?.[0] as BinaryNode | undefined
		expect(sentNode).toBeDefined()

		// Assert that the top-level message node has the 'edit' attribute set to '1'
		expect(sentNode!.tag).toBe('message')
		expect(sentNode!.attrs.edit).toBe('1')
	})

	test('should send a senderKeyDistributionMessage to participants without a known key', async () => {
		const { socket, sendNodeMock, signalRepository, authState } = createTestSocketAndDependencies(
			mockNewsletterSocket,
			makeMessagesSocket,
			{
				failingParticipantJid: 'no-one-will-fail@s.whatsapp.net'
			}
		)

		// 1. Setup: Mock the 'sender-key-memory' to simulate not having a key for one participant.
		// Let's pretend we don't have a key for goodParticipant2.
		jest.spyOn(authState.keys, 'get').mockImplementation(async (type, ids) => {
			if (type === 'sender-key-memory' && ids.includes(TEST_JIDS.group)) {
				return {
					[TEST_JIDS.group]: {
						// We have a key for goodParticipant1, but not for goodParticipant2
						[jidNormalizedUser(TEST_JIDS.goodParticipant1)]: true
					}
				} as Record<string, Record<string, boolean>>
			}

			return {}
		})

		// 2. Act: Send a message
		await socket.sendMessage(TEST_JIDS.group, { text: 'Welcome new member!' })

		// 3. Assert
		expect(sendNodeMock).toHaveBeenCalledTimes(1)
		const sentNode = sendNodeMock.mock.calls[0]?.[0] as BinaryNode
		expect(sentNode).toBeDefined()
		expect(Array.isArray(sentNode.content)).toBe(true)

		const participantsNode = (sentNode.content as BinaryNode[]).find(c => c.tag === 'participants')
		expect(participantsNode).toBeDefined()
		expect(Array.isArray(participantsNode!.content)).toBe(true)

		// Find the participant node for the "new" member (goodParticipant2)
		const newParticipantNode = (participantsNode!.content as BinaryNode[]).find(
			p => p.attrs.jid === jidNormalizedUser(TEST_JIDS.goodParticipant2)
		)

		expect(newParticipantNode).toBeDefined()

		// It should contain an encrypted sender key message just for them.
		// We expect two calls to encryptMessage: one for the sender key, one for the group message.
		// A simpler assertion is to check if the spy was called for the new participant.
		expect(signalRepository.encryptMessage).toHaveBeenCalledWith(
			expect.objectContaining({ jid: jidNormalizedUser(TEST_JIDS.goodParticipant2) })
		)
	})
})

describe('Business Logic: Group Edge Cases', () => {
	test('should handle case when participants fail encryption', async () => {
		// Create a socket where only goodParticipant1 will fail
		const { socket, logger, sendNodeMock } = createTestSocketAndDependencies(mockNewsletterSocket, makeMessagesSocket, {
			failingParticipantJid: TEST_JIDS.goodParticipant1
		})

		// --- EXECUTION ---
		await socket.sendMessage(TEST_JIDS.group, { text: 'Message with some failures' })

		// --- VERIFICATION ---
		expect(sendNodeMock).toHaveBeenCalledTimes(1)

		const sentNode = sendNodeMock.mock.calls[0]?.[0] as BinaryNode | undefined
		expect(sentNode).toBeDefined()

		const participantsNode = Array.isArray(sentNode!.content)
			? sentNode!.content.find((node: BinaryNode) => node.tag === 'participants')
			: undefined

		const recipientJids = Array.isArray(participantsNode?.content)
			? participantsNode.content.map(node => (node.attrs as any).jid)
			: []

		// Should include goodParticipant2, badParticipant (not failing in this test), and me, but not goodParticipant1 (failing)
		expect(recipientJids).toContain(jidNormalizedUser(TEST_JIDS.goodParticipant2))
		expect(recipientJids).toContain(jidNormalizedUser(TEST_JIDS.badParticipant)) // badParticipant works in this test
		expect(recipientJids).not.toContain(jidNormalizedUser(TEST_JIDS.goodParticipant1)) // goodParticipant1 fails

		// Should log warnings for the failed participant
		expect(logger.warn).toHaveBeenCalledWith(
			expect.objectContaining({ id: expect.stringContaining(TEST_JIDS.goodParticipant1) }),
			'Skipping participant due to encryption failure'
		)
	})
})
