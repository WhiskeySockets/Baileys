import NodeCache from '@cacheable/node-cache'
import { jest } from '@jest/globals'
import P from 'pino'
import { handleIdentityChange, type IdentityChangeContext, type IdentityChangeResult } from '../../Utils/identity-change-handler'
import { type BinaryNode } from '../../WABinary'

const logger = P({ level: 'silent' })

type ValidateSessionFn = (jid: string) => Promise<{ exists: boolean; reason?: string }>
type AssertSessionsFn = (jids: string[], force?: boolean) => Promise<boolean>

describe('Identity Change Handling', () => {
	let mockValidateSession: jest.Mock<ValidateSessionFn>
	let mockAssertSessions: jest.Mock<AssertSessionsFn>
	let identityAssertDebounce: NodeCache<boolean>
	let mockMeId: string | undefined
	let mockMeLid: string | undefined

	function createIdentityChangeNode(from: string, offline?: string): BinaryNode {
		return {
			tag: 'notification',
			attrs: {
				from,
				type: 'encrypt',
				...(offline !== undefined ? { offline } : {})
			},
			content: [
				{
					tag: 'identity',
					attrs: {},
					content: Buffer.from('test-identity-key')
				}
			]
		}
	}

	function createContext(): IdentityChangeContext {
		return {
			meId: mockMeId,
			meLid: mockMeLid,
			validateSession: mockValidateSession,
			assertSessions: mockAssertSessions,
			debounceCache: identityAssertDebounce,
			logger
		}
	}

	beforeEach(() => {
		jest.clearAllMocks()
		mockValidateSession = jest.fn()
		mockAssertSessions = jest.fn()
		identityAssertDebounce = new NodeCache<boolean>({ stdTTL: 5, useClones: false })
		mockMeId = 'myuser@s.whatsapp.net'
		mockMeLid = 'mylid@lid'
	})

	describe('Core Checks', () => {
		it('should skip companion devices (device > 0)', async () => {
			const node = createIdentityChangeNode('user:5@s.whatsapp.net')
			const result = await handleIdentityChange(node, createContext())

			expect(mockValidateSession).not.toHaveBeenCalled()
			expect(result.action).toBe('skipped_companion_device')
		})

		it('should process primary device (device 0 or undefined)', async () => {
			mockValidateSession.mockResolvedValue({ exists: true })
			mockAssertSessions.mockResolvedValue(true)

			const node = createIdentityChangeNode('user@s.whatsapp.net')
			const result = await handleIdentityChange(node, createContext())

			expect(result.action).toBe('session_refreshed')
			expect((result as { hadExistingSession: boolean }).hadExistingSession).toBe(true)
		})

		it('should skip self-primary identity (PN match)', async () => {
			const node = createIdentityChangeNode('myuser@s.whatsapp.net')
			const result = await handleIdentityChange(node, createContext())

			expect(mockValidateSession).not.toHaveBeenCalled()
			expect(result.action).toBe('skipped_self_primary')
		})

		it('should skip self-primary identity (LID match)', async () => {
			const node = createIdentityChangeNode('mylid@lid')
			const result = await handleIdentityChange(node, createContext())

			expect(mockValidateSession).not.toHaveBeenCalled()
			expect(result.action).toBe('skipped_self_primary')
		})

		it('should skip self-primary identity when only meLid exists', async () => {
			// FIX: Test for the case where meId is undefined but meLid matches
			mockMeId = undefined
			mockMeLid = 'mylid@lid'

			const node = createIdentityChangeNode('mylid@lid')
			const result = await handleIdentityChange(node, createContext())

			expect(mockValidateSession).not.toHaveBeenCalled()
			expect(result.action).toBe('skipped_self_primary')
		})

		it('should create session when no existing session exists', async () => {
			// FIX: Identity change is the signal to rebuild session, even if none exists
			// This is critical for key reset or device restore scenarios
			mockValidateSession.mockResolvedValue({ exists: false })
			mockAssertSessions.mockResolvedValue(true)

			const node = createIdentityChangeNode('user@s.whatsapp.net')
			const result = await handleIdentityChange(node, createContext())

			expect(mockAssertSessions).toHaveBeenCalledWith(['user@s.whatsapp.net'], true)
			expect(result.action).toBe('session_refreshed')
			expect((result as { hadExistingSession: boolean }).hadExistingSession).toBe(false)
		})

		it('should skip session refresh during offline processing', async () => {
			const node = createIdentityChangeNode('user@s.whatsapp.net', '0')
			const result = await handleIdentityChange(node, createContext())

			// FIX: validateSession should not be called for offline notifications
			// because we skip before reaching that point
			expect(mockAssertSessions).not.toHaveBeenCalled()
			expect(result.action).toBe('skipped_offline')
		})

		it('should refresh session when online with existing session', async () => {
			mockValidateSession.mockResolvedValue({ exists: true })
			mockAssertSessions.mockResolvedValue(true)

			const node = createIdentityChangeNode('user@s.whatsapp.net')
			const result = await handleIdentityChange(node, createContext())

			expect(mockAssertSessions).toHaveBeenCalledWith(['user@s.whatsapp.net'], true)
			expect(result.action).toBe('session_refreshed')
			expect((result as { hadExistingSession: boolean }).hadExistingSession).toBe(true)
		})
	})

	describe('Debounce', () => {
		it('should debounce multiple identity changes for the same JID', async () => {
			mockValidateSession.mockResolvedValue({ exists: true })
			mockAssertSessions.mockResolvedValue(true)

			const node = createIdentityChangeNode('user@s.whatsapp.net')

			const result1 = await handleIdentityChange(node, createContext())
			expect(result1.action).toBe('session_refreshed')

			const result2 = await handleIdentityChange(node, createContext())
			expect(result2.action).toBe('debounced')
			expect(mockAssertSessions).toHaveBeenCalledTimes(1)
		})

		it('should allow different JIDs to process independently', async () => {
			mockValidateSession.mockResolvedValue({ exists: true })
			mockAssertSessions.mockResolvedValue(true)

			const result1 = await handleIdentityChange(createIdentityChangeNode('user1@s.whatsapp.net'), createContext())
			const result2 = await handleIdentityChange(createIdentityChangeNode('user2@s.whatsapp.net'), createContext())

			expect(result1.action).toBe('session_refreshed')
			expect(result2.action).toBe('session_refreshed')
			expect(mockAssertSessions).toHaveBeenCalledTimes(2)
		})

		it('should NOT set debounce cache when skipping due to offline', async () => {
			// FIX: Debounce should only be set when we actually attempt refresh
			const node = createIdentityChangeNode('user@s.whatsapp.net', '0')

			const result1 = await handleIdentityChange(node, createContext())
			expect(result1.action).toBe('skipped_offline')

			// Now process the same JID online - it should NOT be debounced
			mockValidateSession.mockResolvedValue({ exists: true })
			mockAssertSessions.mockResolvedValue(true)

			const onlineNode = createIdentityChangeNode('user@s.whatsapp.net')
			const result2 = await handleIdentityChange(onlineNode, createContext())

			expect(result2.action).toBe('session_refreshed')
			expect(mockAssertSessions).toHaveBeenCalledTimes(1)
		})
	})

	describe('Error Handling', () => {
		it('should handle assertSessions failure gracefully', async () => {
			mockValidateSession.mockResolvedValue({ exists: true })
			const testError = new Error('Session assertion failed')
			mockAssertSessions.mockRejectedValue(testError)

			const node = createIdentityChangeNode('user@s.whatsapp.net')
			const result = await handleIdentityChange(node, createContext())

			expect(result.action).toBe('session_refresh_failed')
			expect((result as { error: unknown }).error).toBe(testError)
		})

		it('should propagate validateSession errors', async () => {
			mockValidateSession.mockRejectedValue(new Error('Database error'))

			const node = createIdentityChangeNode('user@s.whatsapp.net')
			await expect(handleIdentityChange(node, createContext())).rejects.toThrow('Database error')
		})
	})

	describe('Edge Cases', () => {
		it('should return invalid_notification when from is missing', async () => {
			const node: BinaryNode = {
				tag: 'notification',
				attrs: { type: 'encrypt' },
				content: [{ tag: 'identity', attrs: {}, content: Buffer.from('key') }]
			}

			const result = await handleIdentityChange(node, createContext())
			expect(result.action).toBe('invalid_notification')
		})

		it('should return no_identity_node when identity child is missing', async () => {
			const node: BinaryNode = {
				tag: 'notification',
				attrs: { from: 'user@s.whatsapp.net', type: 'encrypt' },
				content: []
			}

			const result = await handleIdentityChange(node, createContext())
			expect(result.action).toBe('no_identity_node')
		})

		it('should handle LID JIDs correctly', async () => {
			mockValidateSession.mockResolvedValue({ exists: true })
			mockAssertSessions.mockResolvedValue(true)

			const node = createIdentityChangeNode('12345@lid')
			const result = await handleIdentityChange(node, createContext())

			expect(mockValidateSession).toHaveBeenCalledWith('12345@lid')
			expect(result.action).toBe('session_refreshed')
		})

		it('should process when both meId and meLid are undefined', async () => {
			mockMeId = undefined
			mockMeLid = undefined
			mockValidateSession.mockResolvedValue({ exists: true })
			mockAssertSessions.mockResolvedValue(true)

			const node = createIdentityChangeNode('anyuser@s.whatsapp.net')
			const result = await handleIdentityChange(node, createContext())

			expect(result.action).toBe('session_refreshed')
		})
	})

	describe('Result Types', () => {
		it('should include hadExistingSession in session_refreshed result', async () => {
			mockValidateSession.mockResolvedValue({ exists: true })
			mockAssertSessions.mockResolvedValue(true)

			const node = createIdentityChangeNode('user@s.whatsapp.net')
			const result = await handleIdentityChange(node, createContext()) as Extract<IdentityChangeResult, { action: 'session_refreshed' }>

			expect(result.action).toBe('session_refreshed')
			expect(result.hadExistingSession).toBe(true)
		})

		it('should return hadExistingSession=false when creating new session', async () => {
			mockValidateSession.mockResolvedValue({ exists: false })
			mockAssertSessions.mockResolvedValue(true)

			const node = createIdentityChangeNode('user@s.whatsapp.net')
			const result = await handleIdentityChange(node, createContext()) as Extract<IdentityChangeResult, { action: 'session_refreshed' }>

			expect(result.action).toBe('session_refreshed')
			expect(result.hadExistingSession).toBe(false)
		})

		it('should include device number in skipped_companion_device result', async () => {
			const node = createIdentityChangeNode('user:5@s.whatsapp.net')
			const result = await handleIdentityChange(node, createContext()) as Extract<IdentityChangeResult, { action: 'skipped_companion_device' }>

			expect(result.action).toBe('skipped_companion_device')
			expect(result.device).toBe(5)
		})
	})
})
