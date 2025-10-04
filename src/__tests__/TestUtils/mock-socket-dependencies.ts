import { jest } from '@jest/globals'
import { proto } from '../..'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import type { AuthenticationState, SignalDataSet, SignalDataTypeMap } from '../../Types'
import type { SignalRepositoryWithLIDStore } from '../../Types/Signal'
import type { SocketConfig } from '../../Types/Socket'
import type { ILogger } from '../../Utils/logger'
import { jidNormalizedUser } from '../../WABinary'

/**
 * Shared constants for tests to ensure consistency across all test suites.
 */
export const TEST_JIDS = {
	group: '123456789-123345@g.us',
	goodParticipant1: '1111111111@s.whatsapp.net',
	badParticipant: '2222222222@s.whatsapp.net',
	goodParticipant2: '3333333333@s.whatsapp.net',
	me: '9999999999@s.whatsapp.net'
} as const

/**
 * All participants for the mock group metadata.
 */
const ALL_PARTICIPANTS = [
	TEST_JIDS.goodParticipant1,
	TEST_JIDS.badParticipant,
	TEST_JIDS.goodParticipant2,
	TEST_JIDS.me
]

/**
 * Creates a mock logger with all required methods.
 * Returns a logger that can be used with jest.fn() spies.
 */
export const createMockLogger = () => {
	const logger: any = {
		child: jest.fn(),
		trace: jest.fn(),
		debug: jest.fn(),
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn()
	}
	logger.child.mockReturnValue(logger)
	return logger as ILogger & {
		child: jest.Mock
		trace: jest.Mock
		debug: jest.Mock
		info: jest.Mock
		warn: jest.Mock
		error: jest.Mock
	}
}

/**
 * Creates a mock AuthenticationState for testing.
 */
export const createMockAuthState = (meJid: string = TEST_JIDS.me): AuthenticationState => {
	const keys = {
		get: async <T extends keyof SignalDataTypeMap>(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			_type: T,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			_ids: string[]
		): Promise<Record<string, SignalDataTypeMap[T]>> => ({}),
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		set: async (_data: SignalDataSet) => {},
		clear: async () => {},
		transaction: async <T>(exec: () => Promise<T>) => exec(),
		isInTransaction: () => false
	}

	return {
		creds: {
			me: { id: meJid, name: 'Me' }
		} as any,
		keys: keys as unknown as AuthenticationState['keys']
	}
}

/**
 * Creates a mock SignalRepository with configurable encryption failure behavior.
 * @param failingParticipantJid - The JID that should fail encryption attempts.
 */
export const createMockSignalRepository = (failingParticipantJid: string): SignalRepositoryWithLIDStore => {
	const badNormalized = jidNormalizedUser(failingParticipantJid)

	return {
		encryptMessage: jest.fn(async ({ jid }: { jid: string }) => {
			const normalized = jidNormalizedUser(jid)
			if (normalized === badNormalized) {
				throw new Error(`Simulated Session Error for ${jid}`)
			}

			return {
				type: 'pkmsg' as const,
				ciphertext: Buffer.from('encrypted-message')
			}
		}),
		encryptGroupMessage: jest.fn(async () => ({
			senderKeyDistributionMessage: Buffer.from('skdm'),
			ciphertext: Buffer.from('group-encrypted')
		})),
		processSenderKeyDistributionMessage: jest.fn(async () => {}),
		deleteSession: jest.fn(async () => {}),
		validateSession: jest.fn(async () => ({ exists: true })),
		jidToSignalProtocolAddress: (jid: string) => jid,
		lidMapping: {
			getLIDsForPNs: async () => [],
			storeLIDPNMappings: async () => {}
		}
	} as unknown as SignalRepositoryWithLIDStore
}

/**
 * Creates a mock user devices cache.
 */
export const createMockUserDevicesCache = () => {
	const buildEntry = (user: string) => [{ user, device: 0 }]
	return {
		get: jest.fn(async (user: string) => buildEntry(user)),
		set: jest.fn(),
		del: jest.fn(),
		flushAll: jest.fn(),
		mget: jest.fn(async (users: string[]) => Object.fromEntries(users.map(user => [user, buildEntry(user)]))),
		mset: jest.fn()
	}
}

/**
 * Creates mock group metadata for testing.
 */
export const createMockGroupMetadata = (groupJid: string = TEST_JIDS.group) => ({
	id: groupJid,
	subject: 'Test Group',
	owner: undefined,
	participants: ALL_PARTICIPANTS.map(id => ({ id, admin: null }))
})

/**
 * Options for creating a test socket environment.
 */
export interface CreateTestSocketOptions {
	/** The JID of the participant whose encryption should fail. Defaults to TEST_JIDS.badParticipant */
	failingParticipantJid?: string
	/** The JID of the current user. Defaults to TEST_JIDS.me */
	meJid?: string
	/** Custom group metadata. If not provided, uses default mock metadata */
	groupMetadata?: ReturnType<typeof createMockGroupMetadata>
	/** Custom signal repository. If not provided, uses default mock with failingParticipantJid logic */
	signalRepository?: SignalRepositoryWithLIDStore
}

/**
 * Return type for createTestSocketAndDependencies function.
 * Provides type-safe access to all test fixtures and mocks.
 */
export interface TestSocketEnvironment {
	/** The socket instance with message functionality ready for testing */
	socket: ReturnType<(typeof import('../../Socket/messages-send.js'))['makeMessagesSocket']>
	/** Mock logger with jest spies for all logging methods */
	logger: ReturnType<typeof createMockLogger>
	/** Mock authentication state */
	authState: AuthenticationState
	/** Mock signal repository with configurable failure behavior */
	signalRepository: SignalRepositoryWithLIDStore
	/** Jest mock for the sendNode function */
	sendNodeMock: jest.Mock
	/** The base mock socket object passed to makeMessagesSocket */
	mockBaseSocket: any
	/** Mock group metadata used in tests */
	fakeMetadata: ReturnType<typeof createMockGroupMetadata>
	/** Socket configuration used to create the socket */
	config: SocketConfig
}

export const createTestSocketAndDependencies = (
	mockNewsletterSocket: jest.Mock,
	makeMessagesSocket: (typeof import('../../Socket/messages-send.js'))['makeMessagesSocket'],
	options: CreateTestSocketOptions = {}
): TestSocketEnvironment => {
	const {
		failingParticipantJid = TEST_JIDS.badParticipant,
		meJid = TEST_JIDS.me,
		groupMetadata,
		signalRepository: customSignalRepository
	} = options

	// 1. Create a mock logger with spies
	const logger = createMockLogger()

	// 2. Create mock auth state
	const authState = createMockAuthState(meJid)

	// 3. Create the mock signal repository with the failure logic or use custom
	const signalRepository = customSignalRepository || createMockSignalRepository(failingParticipantJid)

	// 4. Create the mock for the final `sendNode` call
	const sendNodeMock = jest.fn()

	// 5. Create mock group metadata
	const fakeMetadata = groupMetadata || createMockGroupMetadata()

	// 6. Assemble the mock base socket that `makeMessagesSocket` will wrap
	const mockBaseSocket: any = {
		ev: { emit: jest.fn(), on: jest.fn(), off: jest.fn() },
		authState,
		processingMutex: { mutex: (task: () => Promise<any>) => task() },
		signalRepository,
		upsertMessage: jest.fn(),
		query: async () => ({}),
		fetchPrivacySettings: async () => undefined,
		sendNode: sendNodeMock,
		groupMetadata: async () => fakeMetadata,
		groupToggleEphemeral: async () => undefined,
		profilePictureUrl: async () => undefined,
		logger
	}

	mockNewsletterSocket.mockReturnValue(mockBaseSocket)

	// 7. Create the socket configuration
	const config: SocketConfig = {
		...DEFAULT_CONNECTION_CONFIG,
		auth: authState,
		logger,
		patchMessageBeforeSending: (msg: proto.IMessage) => msg,
		cachedGroupMetadata: async (jid: string) => (jid === TEST_JIDS.group ? (fakeMetadata as any) : undefined),
		getMessage: async () => undefined,
		userDevicesCache: createMockUserDevicesCache() as any,
		makeSignalRepository: () => signalRepository
	}

	// 8. Create the actual `makeMessagesSocket` instance using all our mocks
	const socket = makeMessagesSocket(config)

	// 9. Return everything the test needs
	return {
		socket,
		logger,
		authState,
		signalRepository,
		sendNodeMock,
		mockBaseSocket,
		fakeMetadata,
		config
	}
}

/**
 * Sets up the newsletter socket mock for testing.
 * Call this in beforeAll of your test file.
 */
export const setupNewsletterMock = () => {
	const mockNewsletterSocket = jest.fn()

	// Mock the newsletter module
	jest.unstable_mockModule('../../Socket/newsletter.js', () => ({
		__esModule: true,
		makeNewsletterSocket: mockNewsletterSocket
	}))

	return mockNewsletterSocket
}

/**
 * Gets the makeMessagesSocket function after newsletter mock is set up.
 * Call this in beforeAll after setupNewsletterMock.
 */
export const getMakeMessagesSocket = async () => {
	const { makeMessagesSocket } = await import('../../Socket/messages-send.js')
	return makeMessagesSocket
}
