/**
 * Unit tests for unified-session.ts
 *
 * Tests the UnifiedSessionManager implementation that mimics
 * official WhatsApp Web client telemetry behavior.
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import type { BinaryNode } from '../../WABinary/types.js'
import {
	UnifiedSessionManager,
	createUnifiedSessionManager,
	extractServerTime,
	shouldEnableUnifiedSession,
	type UnifiedSessionOptions
} from '../../Utils/unified-session.js'

// TimeMs constants for testing (matching unified-session.ts)
const TimeMs = {
	Second: 1_000,
	Minute: 60_000,
	Hour: 3_600_000,
	Day: 86_400_000,
	Week: 604_800_000,
} as const

// Mock the prometheus metrics to avoid side effects
jest.mock('../../Utils/prometheus-metrics.js', () => ({
	metrics: {
		socketEvents: { inc: jest.fn() },
		errors: { inc: jest.fn() },
		circuitBreakerTrips: { inc: jest.fn() }
	}
}))

// Mock logger
const createMockLogger = () => ({
	trace: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
	level: 'debug'
})

// Type for mock sendNode function
type MockSendNode = jest.Mock<(node: BinaryNode) => Promise<void>>

describe('UnifiedSessionManager', () => {
	let manager: UnifiedSessionManager
	let mockLogger: ReturnType<typeof createMockLogger>
	let mockSendNode: MockSendNode

	beforeEach(() => {
		mockLogger = createMockLogger()
		mockSendNode = jest.fn<(node: BinaryNode) => Promise<void>>().mockResolvedValue(undefined)

		manager = createUnifiedSessionManager({
			enabled: true,
			logger: mockLogger as any,
			enableCircuitBreaker: false, // Disable for simpler testing
			sendNode: mockSendNode
		})
	})

	afterEach(() => {
		manager.destroy()
		jest.clearAllMocks()
	})

	describe('TimeMs constants', () => {
		it('should have correct time values', () => {
			expect(TimeMs.Second).toBe(1_000)
			expect(TimeMs.Minute).toBe(60_000)
			expect(TimeMs.Hour).toBe(3_600_000)
			expect(TimeMs.Day).toBe(86_400_000)
			expect(TimeMs.Week).toBe(604_800_000)
		})

		it('should have readonly constants (enforced by TypeScript)', () => {
			// TypeScript's 'as const' ensures compile-time immutability
			// At runtime, we verify the values are what we expect
			expect(TimeMs.Second).toBe(1_000)
			expect(TimeMs.Week).toBe(604_800_000)
			// Verify the object structure is correct
			expect(Object.keys(TimeMs)).toEqual(['Second', 'Minute', 'Hour', 'Day', 'Week'])
		})
	})

	describe('initialization', () => {
		it('should initialize with default state', () => {
			const state = manager.getState()
			expect(state.isInitialized).toBe(true)
			expect(state.serverTimeOffset).toBe(0)
			expect(state.lastSentTime).toBe(0)
			expect(state.sendCount).toBe(0)
		})

		it('should create with factory function', () => {
			const newManager = createUnifiedSessionManager({ enabled: true })
			expect(newManager.getState().isInitialized).toBe(true)
			newManager.destroy()
		})

		it('should respect enabled option', async () => {
			const disabledManager = createUnifiedSessionManager({
				enabled: false,
				sendNode: mockSendNode
			})

			await disabledManager.send('login')

			expect(mockSendNode).not.toHaveBeenCalled()
			disabledManager.destroy()
		})
	})

	describe('getSessionId', () => {
		it('should return a string', () => {
			const sessionId = manager.getSessionId()
			expect(typeof sessionId).toBe('string')
		})

		it('should return a numeric value as string', () => {
			const sessionId = manager.getSessionId()
			const parsed = parseInt(sessionId, 10)
			expect(isNaN(parsed)).toBe(false)
			expect(parsed).toBeGreaterThanOrEqual(0)
		})

		it('should return value within week range', () => {
			const sessionId = manager.getSessionId()
			const value = parseInt(sessionId, 10)

			// Session ID should be modulo 7 days (in ms)
			expect(value).toBeLessThan(TimeMs.Week)
		})

		it('should change with server time offset', () => {
			const id1 = manager.getSessionId()

			// Update offset by 1 hour
			manager.updateServerTimeOffset(Math.floor(Date.now() / 1000) + 3600)

			const id2 = manager.getSessionId()

			// IDs should be different due to offset
			expect(id1).not.toBe(id2)
		})
	})

	describe('updateServerTimeOffset', () => {
		it('should update offset from string timestamp', () => {
			const serverTime = Math.floor(Date.now() / 1000) + 100
			manager.updateServerTimeOffset(serverTime.toString())

			const state = manager.getState()
			// Offset should be approximately 100 seconds (100,000ms)
			expect(Math.abs(state.serverTimeOffset - 100_000)).toBeLessThan(1000)
		})

		it('should update offset from number timestamp', () => {
			const serverTime = Math.floor(Date.now() / 1000) - 50
			manager.updateServerTimeOffset(serverTime)

			const state = manager.getState()
			// Offset should be approximately -50 seconds (-50,000ms)
			expect(Math.abs(state.serverTimeOffset + 50_000)).toBeLessThan(1000)
		})

		it('should ignore undefined value', () => {
			manager.updateServerTimeOffset(undefined)
			expect(manager.getState().serverTimeOffset).toBe(0)
		})

		it('should ignore invalid values', () => {
			manager.updateServerTimeOffset('invalid')
			expect(manager.getState().serverTimeOffset).toBe(0)

			manager.updateServerTimeOffset(-1)
			expect(manager.getState().serverTimeOffset).toBe(0)

			manager.updateServerTimeOffset(0)
			expect(manager.getState().serverTimeOffset).toBe(0)
		})

		it('should only update on significant change (>1 second)', () => {
			const serverTime = Math.floor(Date.now() / 1000) + 100
			manager.updateServerTimeOffset(serverTime)
			const offset1 = manager.getState().serverTimeOffset

			// Small change (< 1 second) should not update
			manager.updateServerTimeOffset(serverTime + 0.5)
			const offset2 = manager.getState().serverTimeOffset

			expect(offset1).toBe(offset2)
		})
	})

	describe('send', () => {
		it('should send unified_session node', async () => {
			await manager.send('login')

			expect(mockSendNode).toHaveBeenCalledTimes(1)

			const sentNode = mockSendNode.mock.calls[0]?.[0] as BinaryNode | undefined
			expect(sentNode).toBeDefined()
			expect(sentNode!.tag).toBe('ib')
			expect(Array.isArray(sentNode!.content)).toBe(true)
			const content = sentNode!.content as BinaryNode[]
			expect(content).toHaveLength(1)
			expect(content[0]!.tag).toBe('unified_session')
			expect(typeof content[0]!.attrs.id).toBe('string')
		})

		it('should update state after send', async () => {
			expect(manager.getState().sendCount).toBe(0)

			await manager.send('login')

			const state = manager.getState()
			expect(state.sendCount).toBe(1)
			expect(state.lastSentTime).toBeGreaterThan(0)
		})

		it('should rate limit sends (except login)', async () => {
			// First send should work
			await manager.send('presence')
			expect(mockSendNode).toHaveBeenCalledTimes(1)

			// Immediate second send should be skipped (rate limited)
			await manager.send('presence')
			expect(mockSendNode).toHaveBeenCalledTimes(1)
		})

		it('should not rate limit login trigger', async () => {
			await manager.send('login')
			expect(mockSendNode).toHaveBeenCalledTimes(1)

			// Login should always send, even immediately after
			await manager.send('login')
			expect(mockSendNode).toHaveBeenCalledTimes(2)
		})

		it('should not throw on send failure', async () => {
			mockSendNode.mockRejectedValue(new Error('Network error'))

			// Should not throw
			await expect(manager.send('login')).resolves.toBeUndefined()

			// Reset mock for subsequent tests
			mockSendNode.mockResolvedValue(undefined)
		})

		it('should log warning on send failure', async () => {
			mockSendNode.mockRejectedValue(new Error('Network error'))

			await manager.send('login')

			expect(mockLogger.warn).toHaveBeenCalled()

			// Reset mock for subsequent tests
			mockSendNode.mockResolvedValue(undefined)
		})
	})

	describe('reset', () => {
		it('should reset all state', async () => {
			// Modify state
			manager.updateServerTimeOffset(Math.floor(Date.now() / 1000) + 100)
			await manager.send('login')

			const stateBefore = manager.getState()
			expect(stateBefore.serverTimeOffset).not.toBe(0)
			expect(stateBefore.sendCount).toBe(1)

			// Reset
			manager.reset()

			const stateAfter = manager.getState()
			expect(stateAfter.serverTimeOffset).toBe(0)
			expect(stateAfter.sendCount).toBe(0)
			expect(stateAfter.lastSentTime).toBe(0)
			expect(stateAfter.isInitialized).toBe(true)
		})
	})

	describe('destroy', () => {
		it('should mark as not initialized', () => {
			manager.destroy()
			expect(manager.getState().isInitialized).toBe(false)
		})
	})
})

describe('extractServerTime', () => {
	it('should extract time from string attribute', () => {
		const node = { tag: 'test', attrs: { t: '1234567890' } }
		expect(extractServerTime(node as any)).toBe(1234567890)
	})

	it('should extract time from number attribute', () => {
		const node = { tag: 'test', attrs: { t: 1234567890 } }
		expect(extractServerTime(node as any)).toBe(1234567890)
	})

	it('should return undefined for missing attribute', () => {
		const node = { tag: 'test', attrs: {} }
		expect(extractServerTime(node as any)).toBeUndefined()
	})

	it('should return undefined for invalid values', () => {
		expect(extractServerTime({ tag: 'test', attrs: { t: 'invalid' } } as any)).toBeUndefined()
		expect(extractServerTime({ tag: 'test', attrs: { t: 0 } } as any)).toBeUndefined()
		expect(extractServerTime({ tag: 'test', attrs: { t: -1 } } as any)).toBeUndefined()
	})
})

describe('shouldEnableUnifiedSession', () => {
	const originalEnv = process.env.BAILEYS_UNIFIED_SESSION_ENABLED

	afterEach(() => {
		if (originalEnv === undefined) {
			delete process.env.BAILEYS_UNIFIED_SESSION_ENABLED
		} else {
			process.env.BAILEYS_UNIFIED_SESSION_ENABLED = originalEnv
		}
	})

	it('should return true by default', () => {
		delete process.env.BAILEYS_UNIFIED_SESSION_ENABLED
		expect(shouldEnableUnifiedSession()).toBe(true)
	})

	it('should respect environment variable true', () => {
		process.env.BAILEYS_UNIFIED_SESSION_ENABLED = 'true'
		expect(shouldEnableUnifiedSession()).toBe(true)

		process.env.BAILEYS_UNIFIED_SESSION_ENABLED = '1'
		expect(shouldEnableUnifiedSession()).toBe(true)

		process.env.BAILEYS_UNIFIED_SESSION_ENABLED = 'TRUE'
		expect(shouldEnableUnifiedSession()).toBe(true)
	})

	it('should respect environment variable false', () => {
		process.env.BAILEYS_UNIFIED_SESSION_ENABLED = 'false'
		expect(shouldEnableUnifiedSession()).toBe(false)

		process.env.BAILEYS_UNIFIED_SESSION_ENABLED = '0'
		expect(shouldEnableUnifiedSession()).toBe(false)

		process.env.BAILEYS_UNIFIED_SESSION_ENABLED = ''
		expect(shouldEnableUnifiedSession()).toBe(false)
	})
})

describe('UnifiedSessionManager with CircuitBreaker', () => {
	let manager: UnifiedSessionManager
	let mockSendNode: MockSendNode

	beforeEach(() => {
		mockSendNode = jest.fn<(node: BinaryNode) => Promise<void>>().mockResolvedValue(undefined)

		manager = createUnifiedSessionManager({
			enabled: true,
			logger: createMockLogger() as any,
			enableCircuitBreaker: true,
			sendNode: mockSendNode
		})
	})

	afterEach(() => {
		manager.destroy()
	})

	it('should work with circuit breaker enabled', async () => {
		await manager.send('login')
		expect(mockSendNode).toHaveBeenCalledTimes(1)
	})

	it('should handle circuit breaker failures gracefully', async () => {
		// Make send fail multiple times to trigger circuit breaker
		let callCount = 0
		mockSendNode.mockImplementation(async () => {
			callCount++
			if (callCount <= 3) {
				throw new Error(`Fail ${callCount}`)
			}
		})

		// These should not throw even with failures
		await expect(manager.send('login')).resolves.toBeUndefined()
		await expect(manager.send('login')).resolves.toBeUndefined()
		await expect(manager.send('login')).resolves.toBeUndefined()
	})
})
