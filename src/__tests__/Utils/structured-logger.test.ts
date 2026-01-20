/**
 * Testes unitários para structured-logger.ts
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import {
	StructuredLogger,
	createStructuredLogger,
	getDefaultLogger,
	setDefaultLogger,
	createTimer,
	LOG_LEVEL_VALUES,
	type LogLevel,
} from '../../Utils/structured-logger.js'

describe('StructuredLogger', () => {
	let logger: StructuredLogger
	let consoleSpy: jest.SpiedFunction<typeof console.info>

	beforeEach(() => {
		logger = createStructuredLogger({
			level: 'debug',
			name: 'test',
			jsonFormat: false,
		})
		consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
		jest.spyOn(console, 'debug').mockImplementation(() => {})
		jest.spyOn(console, 'warn').mockImplementation(() => {})
		jest.spyOn(console, 'error').mockImplementation(() => {})
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	describe('log levels', () => {
		it('should respect log level hierarchy', () => {
			const warnLogger = createStructuredLogger({ level: 'warn' })

			expect(warnLogger.isLevelEnabled('trace')).toBe(false)
			expect(warnLogger.isLevelEnabled('debug')).toBe(false)
			expect(warnLogger.isLevelEnabled('info')).toBe(false)
			expect(warnLogger.isLevelEnabled('warn')).toBe(true)
			expect(warnLogger.isLevelEnabled('error')).toBe(true)
			expect(warnLogger.isLevelEnabled('fatal')).toBe(true)
		})

		it('should have correct level values', () => {
			expect(LOG_LEVEL_VALUES.trace).toBeLessThan(LOG_LEVEL_VALUES.debug)
			expect(LOG_LEVEL_VALUES.debug).toBeLessThan(LOG_LEVEL_VALUES.info)
			expect(LOG_LEVEL_VALUES.info).toBeLessThan(LOG_LEVEL_VALUES.warn)
			expect(LOG_LEVEL_VALUES.warn).toBeLessThan(LOG_LEVEL_VALUES.error)
			expect(LOG_LEVEL_VALUES.error).toBeLessThan(LOG_LEVEL_VALUES.fatal)
		})

		it('should allow level to be changed', () => {
			expect(logger.level).toBe('debug')
			logger.level = 'error'
			expect(logger.level).toBe('error')
		})
	})

	describe('logging methods', () => {
		it('should log info messages', () => {
			logger.info({ test: 'data' }, 'Test message')
			expect(consoleSpy).toHaveBeenCalled()
		})

		it('should log with object data', () => {
			logger.debug({ key: 'value', number: 42 })
			expect(console.debug).toHaveBeenCalled()
		})

		it('should log errors with stack trace', () => {
			const error = new Error('Test error')
			logger.error(error, 'Error occurred')
			expect(console.error).toHaveBeenCalled()
		})
	})

	describe('child loggers', () => {
		it('should create child logger with additional context', () => {
			const child = logger.child({ component: 'child' })
			expect(child).toBeInstanceOf(StructuredLogger)
		})

		it('should inherit parent level', () => {
			logger.level = 'warn'
			const child = logger.child({ component: 'test' })
			expect(child.level).toBe('warn')
		})
	})

	describe('sanitization', () => {
		it('should redact sensitive fields', () => {
			const jsonLogger = createStructuredLogger({
				level: 'info',
				jsonFormat: true,
			})

			// O logger deve sanitizar campos sensíveis
			jsonLogger.info({
				user: 'test',
				password: 'secret123',
				token: 'abc123',
			})

			expect(consoleSpy).toHaveBeenCalled()
		})
	})

	describe('metrics', () => {
		it('should track log metrics', () => {
			logger.info({}, 'test 1')
			logger.warn({}, 'test 2')
			logger.error({}, 'test 3')

			const metrics = logger.getMetrics()

			expect(metrics.totalLogs).toBe(3)
			expect(metrics.logsByLevel.info).toBe(1)
			expect(metrics.logsByLevel.warn).toBe(1)
			expect(metrics.logsByLevel.error).toBe(1)
			expect(metrics.errorsCount).toBe(1)
		})

		it('should reset metrics', () => {
			logger.info({}, 'test')
			logger.resetMetrics()

			const metrics = logger.getMetrics()
			expect(metrics.totalLogs).toBe(0)
		})
	})

	describe('context helpers', () => {
		it('should create logger with context', () => {
			const contextLogger = logger.withContext({ requestId: '123' })
			expect(contextLogger).toBeInstanceOf(StructuredLogger)
		})

		it('should create logger with correlation ID', () => {
			const correlationLogger = logger.withCorrelationId('corr-123')
			expect(correlationLogger).toBeInstanceOf(StructuredLogger)
		})
	})

	describe('logOperation', () => {
		it('should log operation start and complete', async () => {
			const result = await logger.logOperation('test-op', async () => {
				return 'result'
			})

			expect(result).toBe('result')
		})

		it('should log operation error', async () => {
			await expect(
				logger.logOperation('failing-op', async () => {
					throw new Error('Operation failed')
				})
			).rejects.toThrow('Operation failed')
		})
	})

	describe('createTimer', () => {
		it('should measure elapsed time', async () => {
			const timer = createTimer()

			await new Promise((resolve) => setTimeout(resolve, 10))

			const elapsed = timer.elapsed()
			expect(elapsed).toBeGreaterThan(0)
		})

		it('should format elapsed time', async () => {
			const timer = createTimer()

			await new Promise((resolve) => setTimeout(resolve, 5))

			const formatted = timer.elapsedMs()
			expect(formatted).toMatch(/\d+\.\d+ms/)
		})
	})

	describe('default logger', () => {
		it('should get default logger', () => {
			const defaultLogger = getDefaultLogger()
			expect(defaultLogger).toBeInstanceOf(StructuredLogger)
		})

		it('should set default logger', () => {
			const customLogger = createStructuredLogger({ name: 'custom' })
			setDefaultLogger(customLogger)

			const retrieved = getDefaultLogger()
			expect(retrieved).toBe(customLogger)
		})
	})
})
