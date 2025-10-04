import { jest } from '@jest/globals'
import { proto } from '../..'
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

describe('createParticipantNodes fault tolerance', () => {
	test('skips failing participant and continues encrypting others', async () => {
		// Use the factory to set up the environment
		const { socket, logger, signalRepository } = createTestSocketAndDependencies(
			mockNewsletterSocket,
			makeMessagesSocket,
			{ failingParticipantJid: TEST_JIDS.badParticipant }
		)

		const { createParticipantNodes } = socket

		// Define the recipients for this test (excluding "me" since we're testing participant nodes)
		const recipients = [TEST_JIDS.goodParticipant1, TEST_JIDS.badParticipant, TEST_JIDS.goodParticipant2]

		const message = proto.Message.fromObject({ conversation: 'group test' })

		// --- EXECUTION ---
		// Call the internal function directly
		const result = await createParticipantNodes(recipients, message)

		// --- VERIFICATION ---
		// 1. Verify that an encryption attempt was made for everyone
		expect(signalRepository.encryptMessage).toHaveBeenCalledTimes(recipients.length)

		// 2. Check the direct output of the function - bad participant should be excluded
		const nodeJids = result.nodes.map((node: any) => node.attrs.jid)

		expect(nodeJids).toEqual(
			expect.arrayContaining([
				jidNormalizedUser(TEST_JIDS.goodParticipant1),
				jidNormalizedUser(TEST_JIDS.goodParticipant2)
			])
		)
		expect(nodeJids).not.toContain(jidNormalizedUser(TEST_JIDS.badParticipant))

		// 3. Verify device identity flag
		expect(result.shouldIncludeDeviceIdentity).toBe(true)

		// 4. Confirm the failure was logged
		expect(logger.warn).toHaveBeenCalledWith(
			expect.objectContaining({ id: expect.stringContaining(TEST_JIDS.badParticipant) }),
			'Skipping participant due to encryption failure'
		)
	})
})
