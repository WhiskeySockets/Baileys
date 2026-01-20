/**
 * Unit tests for baileys-logger.ts console-friendly logging functions
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import {
	logEventBuffer,
	logBufferMetrics,
	logMessageSent,
	logMessageReceived,
	logConnection,
	logAuth,
	logCircuitBreaker,
	logRetry,
	logInfo,
	logWarn,
	logError,
	logLidMapping,
} from '../../Utils/baileys-logger.js'

describe('Baileys Console Logging Functions', () => {
	let consoleSpy: jest.SpiedFunction<typeof console.log>
	let consoleErrorSpy: jest.SpiedFunction<typeof console.error>
	const originalEnv = process.env.BAILEYS_LOG

	beforeEach(() => {
		consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
		// Reset env var
		delete process.env.BAILEYS_LOG
	})

	afterEach(() => {
		jest.restoreAllMocks()
		if (originalEnv !== undefined) {
			process.env.BAILEYS_LOG = originalEnv
		} else {
			delete process.env.BAILEYS_LOG
		}
	})

	describe('environment variable check', () => {
		it('should log when BAILEYS_LOG is not set', () => {
			delete process.env.BAILEYS_LOG
			logEventBuffer('buffer_start')
			expect(consoleSpy).toHaveBeenCalled()
		})

		it('should log when BAILEYS_LOG=true', () => {
			process.env.BAILEYS_LOG = 'true'
			logEventBuffer('buffer_start')
			expect(consoleSpy).toHaveBeenCalled()
		})

		it('should NOT log when BAILEYS_LOG=false', () => {
			process.env.BAILEYS_LOG = 'false'
			logEventBuffer('buffer_start')
			expect(consoleSpy).not.toHaveBeenCalled()
		})
	})

	describe('logEventBuffer', () => {
		it('should log buffer_start with 📦 emoji', () => {
			logEventBuffer('buffer_start')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] 📦 Event buffering started')
		})

		it('should log buffer_flush with 🔄 emoji and data', () => {
			logEventBuffer('buffer_flush', { flushCount: 10, mode: 'aggressive' })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] 🔄 Event buffer flushed'))
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('flushCount: 10'))
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('mode: aggressive'))
		})

		it('should log buffer_overflow with ⚠️ emoji', () => {
			logEventBuffer('buffer_overflow', { currentSize: 5000 })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] ⚠️ Buffer overflow detected'))
		})

		it('should log buffer_timeout with ⏰ emoji', () => {
			logEventBuffer('buffer_timeout', { timeout: 30000 })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] ⏰ Buffer timeout reached'))
		})

		it('should log cache_cleanup with 🧹 emoji', () => {
			logEventBuffer('cache_cleanup', { removed: 100 })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] 🧹 History cache cleanup'))
		})

		it('should include session name when provided', () => {
			logEventBuffer('buffer_start', undefined, 'session-123')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] [session-123] 📦 Event buffering started')
		})
	})

	describe('logBufferMetrics', () => {
		it('should log metrics in multi-line format', () => {
			logBufferMetrics({
				itemsBuffered: 50,
				flushCount: 100,
				historyCacheSize: 200,
				buffersInProgress: 1,
			})
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('📊 Buffer Metrics'))
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('itemsBuffered: 50'))
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('flushCount: 100'))
		})

		it('should include adaptive info when provided', () => {
			logBufferMetrics({
				itemsBuffered: 0,
				flushCount: 120,
				historyCacheSize: 0,
				buffersInProgress: 0,
				adaptive: {
					mode: 'aggressive',
					timeout: 1000,
					eventRate: 1.34,
					isHealthy: true,
				},
			})
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("mode: 'aggressive'"))
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('timeout: 1000'))
		})
	})

	describe('logMessageSent and logMessageReceived', () => {
		it('should log message sent with 📤 emoji and arrow', () => {
			logMessageSent('MSG123', '5511999999999@s.whatsapp.net')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] 📤 Message sent: MSG123 → 5511999999999@s.whatsapp.net')
		})

		it('should log message received with 📥 emoji and arrow', () => {
			logMessageReceived('MSG456', '5511888888888@s.whatsapp.net')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] 📥 Message received: MSG456 ← 5511888888888@s.whatsapp.net')
		})

		it('should include session name for messages', () => {
			logMessageSent('MSG789', 'user@lid', 'session-abc')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] [session-abc] 📤 Message sent: MSG789 → user@lid')
		})
	})

	describe('logConnection', () => {
		it('should log connecting with 🔌 emoji', () => {
			logConnection('connecting')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] 🔌 Connecting to WhatsApp...')
		})

		it('should log open with ✅ emoji', () => {
			logConnection('open')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] ✅ Connected to WhatsApp')
		})

		it('should log close with 🔴 emoji', () => {
			logConnection('close', { reason: 'logout' })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] 🔴 Disconnected from WhatsApp'))
		})

		it('should log reconnecting with 🔄 emoji', () => {
			logConnection('reconnecting', { attempt: 2 })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] 🔄 Reconnecting to WhatsApp'))
		})

		it('should log error with ❌ emoji', () => {
			logConnection('error', { code: 'ECONNREFUSED' })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] ❌ Connection error'))
		})
	})

	describe('logAuth', () => {
		it('should log qr_generated with 📱 emoji', () => {
			logAuth('qr_generated')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] 📱 QR Code generated - scan with WhatsApp')
		})

		it('should log authenticated with ✅ emoji', () => {
			logAuth('authenticated')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] ✅ Authentication successful')
		})

		it('should log logout with 🚪 emoji', () => {
			logAuth('logout')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] 🚪 Logged out')
		})
	})

	describe('logCircuitBreaker', () => {
		it('should log open state with ⚡ emoji', () => {
			logCircuitBreaker('open', { failures: 5 })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] ⚡ Circuit breaker OPEN'))
		})

		it('should log closed state with ✅ emoji', () => {
			logCircuitBreaker('closed')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] ✅ Circuit breaker CLOSED')
		})

		it('should log half_open state with 🔶 emoji', () => {
			logCircuitBreaker('half_open')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] 🔶 Circuit breaker HALF-OPEN')
		})
	})

	describe('logRetry', () => {
		it('should log retry attempt with 🔁 emoji', () => {
			logRetry(2, 5, 5000, 'connection')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] 🔁 Retry attempt 2/5 for connection (delay: 5000ms)')
		})
	})

	describe('logInfo, logWarn, logError', () => {
		it('should log info with ℹ️ emoji', () => {
			logInfo('PreKey validation passed')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] ℹ️ PreKey validation passed')
		})

		it('should log warning with ⚠️ emoji', () => {
			logWarn('Rate limit approaching', { remaining: 10 })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] ⚠️ Rate limit approaching'))
		})

		it('should log error with ❌ emoji to console.error', () => {
			logError('Failed to send', { error: 'timeout' })
			expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] ❌ Failed to send'))
		})
	})

	describe('logLidMapping', () => {
		it('should log LID events with appropriate emojis', () => {
			logLidMapping('initialized')
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] 🗂️ LID Mapping Store initialized')

			logLidMapping('lookup', { jid: 'user@lid' })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] 🔍 LID lookup'))

			logLidMapping('store', { count: 5 })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] 💾 LID stored'))

			logLidMapping('batch_resolved', { resolved: 10 })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BAILEYS] 📦 LID batch resolved'))
		})
	})

	describe('formatLogData edge cases', () => {
		it('should handle undefined values in data', () => {
			logInfo('Test', { key: undefined })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('key: undefined'))
		})

		it('should handle null values in data', () => {
			logInfo('Test', { key: null })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('key: null'))
		})

		it('should handle Error objects in data', () => {
			const error = new Error('Test error')
			logInfo('Test', { error })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error: Test error'))
		})

		it('should handle arrays in data', () => {
			logInfo('Test', { items: [1, 2, 3] })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[1, 2, 3]'))
		})

		it('should handle large arrays with truncation', () => {
			logInfo('Test', { items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[Array(10)]'))
		})

		it('should handle circular references gracefully', () => {
			const obj: Record<string, unknown> = { name: 'test' }
			obj.self = obj // Create circular reference
			// Should not throw
			expect(() => logInfo('Test', { obj })).not.toThrow()
			expect(consoleSpy).toHaveBeenCalled()
		})

		it('should handle Date objects', () => {
			const date = new Date('2026-01-20T12:00:00.000Z')
			logInfo('Test', { date })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('2026-01-20T12:00:00.000Z'))
		})

		it('should handle empty data object', () => {
			logInfo('Test', {})
			// Empty data object should not add trailing space
			expect(consoleSpy).toHaveBeenCalledWith('[BAILEYS] ℹ️ Test')
		})

		it('should handle nested objects', () => {
			logInfo('Test', { outer: { inner: { value: 42 } } })
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('outer:'))
		})
	})
})
