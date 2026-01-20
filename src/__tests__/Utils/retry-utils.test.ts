/**
 * Testes unitários para retry-utils.ts
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import {
	retry,
	retryWithResult,
	createRetrier,
	retryable,
	RetryManager,
	RetryExhaustedError,
	RetryAbortedError,
	calculateDelay,
	retryPredicates,
	retryConfigs,
	getRetryDelayWithJitter,
	getAllRetryDelaysWithJitter,
	RETRY_BACKOFF_DELAYS,
	RETRY_JITTER_FACTOR,
	type RetryContext,
} from '../../Utils/retry-utils.js'

describe('retry', () => {
	describe('successful operations', () => {
		it('should return result on first success', async () => {
			const result = await retry(() => 'success', { collectMetrics: false })
			expect(result).toBe('success')
		})

		it('should return result from async operation', async () => {
			const result = await retry(async () => {
				await new Promise((resolve) => setTimeout(resolve, 10))
				return 'async success'
			}, { collectMetrics: false })

			expect(result).toBe('async success')
		})
	})

	describe('retry behavior', () => {
		it('should retry on failure', async () => {
			let attempts = 0

			const result = await retry(
				() => {
					attempts++
					if (attempts < 3) {
						throw new Error('Failing')
					}
					return 'success after retries'
				},
				{
					maxAttempts: 5,
					baseDelay: 10,
					collectMetrics: false,
				}
			)

			expect(result).toBe('success after retries')
			expect(attempts).toBe(3)
		})

		it('should exhaust retries and throw', async () => {
			await expect(
				retry(
					() => {
						throw new Error('Always fails')
					},
					{
						maxAttempts: 3,
						baseDelay: 10,
						collectMetrics: false,
					}
				)
			).rejects.toThrow(RetryExhaustedError)
		})

		it('should pass context to operation', async () => {
			let receivedContext: RetryContext | null = null

			await retry(
				(context) => {
					receivedContext = context
					return 'success'
				},
				{ collectMetrics: false }
			)

			expect(receivedContext).not.toBeNull()
			expect(receivedContext!.attempt).toBe(1)
			expect(receivedContext!.maxAttempts).toBe(3) // default
		})
	})

	describe('shouldRetry predicate', () => {
		it('should use custom shouldRetry', async () => {
			let attempts = 0

			await expect(
				retry(
					() => {
						attempts++
						throw new Error('Non-retryable')
					},
					{
						maxAttempts: 5,
						baseDelay: 10,
						shouldRetry: () => false,
						collectMetrics: false,
					}
				)
			).rejects.toThrow(RetryExhaustedError)

			expect(attempts).toBe(1) // Should not retry
		})
	})

	describe('callbacks', () => {
		it('should call onRetry callback', async () => {
			const onRetry = jest.fn<(error: Error, attempt: number, delay: number) => void>()
			let attempts = 0

			await retry(
				() => {
					attempts++
					if (attempts < 3) {
						throw new Error('Failing')
					}
					return 'success'
				},
				{
					maxAttempts: 5,
					baseDelay: 10,
					onRetry,
					collectMetrics: false,
				}
			)

			expect(onRetry).toHaveBeenCalledTimes(2)
		})

		it('should call onSuccess callback', async () => {
			const onSuccess = jest.fn()

			await retry(() => 'result', {
				onSuccess,
				collectMetrics: false,
			})

			expect(onSuccess).toHaveBeenCalledWith('result', 1)
		})

		it('should call onFailure callback on exhaustion', async () => {
			const onFailure = jest.fn()

			await expect(
				retry(
					() => {
						throw new Error('Always fails')
					},
					{
						maxAttempts: 2,
						baseDelay: 10,
						onFailure,
						collectMetrics: false,
					}
				)
			).rejects.toThrow()

			expect(onFailure).toHaveBeenCalled()
		})
	})

	describe('abort signal', () => {
		it('should abort with signal', async () => {
			const controller = new AbortController()

			const promise = retry(
				async () => {
					await new Promise((resolve) => setTimeout(resolve, 100))
					return 'success'
				},
				{
					maxAttempts: 5,
					baseDelay: 50,
					abortSignal: controller.signal,
					collectMetrics: false,
				}
			)

			setTimeout(() => controller.abort(), 20)

			await expect(promise).rejects.toThrow(RetryAbortedError)
		})
	})
})

describe('retryWithResult', () => {
	it('should return success result', async () => {
		const result = await retryWithResult(() => 'success', { collectMetrics: false })

		expect(result.success).toBe(true)
		expect(result.result).toBe('success')
		expect(result.attempts).toBe(1)
		expect(result.totalDuration).toBeGreaterThanOrEqual(0)
	})

	it('should return failure result', async () => {
		const result = await retryWithResult(
			() => {
				throw new Error('Failure')
			},
			{
				maxAttempts: 2,
				baseDelay: 10,
				collectMetrics: false,
			}
		)

		expect(result.success).toBe(false)
		expect(result.error).toBeInstanceOf(RetryExhaustedError)
		expect(result.attempts).toBe(2)
	})
})

describe('calculateDelay', () => {
	describe('exponential backoff', () => {
		it('should calculate exponential delays', () => {
			const delay1 = calculateDelay(1, 100, 10000, 'exponential', 2, 0)
			const delay2 = calculateDelay(2, 100, 10000, 'exponential', 2, 0)
			const delay3 = calculateDelay(3, 100, 10000, 'exponential', 2, 0)

			expect(delay1).toBe(100)
			expect(delay2).toBe(200)
			expect(delay3).toBe(400)
		})
	})

	describe('linear backoff', () => {
		it('should calculate linear delays', () => {
			const delay1 = calculateDelay(1, 100, 10000, 'linear', 2, 0)
			const delay2 = calculateDelay(2, 100, 10000, 'linear', 2, 0)
			const delay3 = calculateDelay(3, 100, 10000, 'linear', 2, 0)

			expect(delay1).toBe(100)
			expect(delay2).toBe(200)
			expect(delay3).toBe(300)
		})
	})

	describe('constant backoff', () => {
		it('should return constant delays', () => {
			const delay1 = calculateDelay(1, 100, 10000, 'constant', 2, 0)
			const delay2 = calculateDelay(2, 100, 10000, 'constant', 2, 0)
			const delay3 = calculateDelay(3, 100, 10000, 'constant', 2, 0)

			expect(delay1).toBe(100)
			expect(delay2).toBe(100)
			expect(delay3).toBe(100)
		})
	})

	describe('max delay cap', () => {
		it('should cap at max delay', () => {
			const delay = calculateDelay(10, 100, 500, 'exponential', 2, 0)
			expect(delay).toBeLessThanOrEqual(500)
		})
	})

	describe('jitter', () => {
		it('should add jitter to delay', () => {
			const delays = new Set()

			for (let i = 0; i < 10; i++) {
				delays.add(calculateDelay(1, 100, 10000, 'constant', 2, 0.5))
			}

			// With jitter, we should get varying delays
			expect(delays.size).toBeGreaterThan(1)
		})
	})
})

describe('createRetrier', () => {
	it('should create preconfigured retrier', async () => {
		const myRetrier = createRetrier({
			maxAttempts: 5,
			baseDelay: 10,
			collectMetrics: false,
		})

		let attempts = 0
		const result = await myRetrier(() => {
			attempts++
			if (attempts < 3) throw new Error('Failing')
			return 'success'
		})

		expect(result).toBe('success')
		expect(attempts).toBe(3)
	})
})

describe('retryable', () => {
	it('should wrap function with retry', async () => {
		let attempts = 0

		const fn = retryable(
			() => {
				attempts++
				if (attempts < 2) throw new Error('Failing')
				return 'wrapped result'
			},
			{
				maxAttempts: 5,
				baseDelay: 10,
				collectMetrics: false,
			}
		)

		const result = await fn()

		expect(result).toBe('wrapped result')
		expect(attempts).toBe(2)
	})
})

describe('RetryManager', () => {
	let manager: RetryManager

	beforeEach(() => {
		manager = new RetryManager({ baseDelay: 10, collectMetrics: false })
	})

	it('should execute operation with id', async () => {
		const result = await manager.execute('op1', () => 'result')
		expect(result).toBe('result')
	})

	it('should cancel active retry', async () => {
		const promise = manager.execute('cancelable', async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000))
			return 'result'
		})

		setTimeout(() => manager.cancel('cancelable'), 20)

		await expect(promise).rejects.toThrow()
	})

	it('should check if operation is active', async () => {
		let resolve: () => void
		const promise = manager.execute('active', () =>
			new Promise<string>((r) => {
				resolve = () => r('done')
			})
		)

		expect(manager.isActive('active')).toBe(true)

		resolve!()
		await promise

		expect(manager.isActive('active')).toBe(false)
	})

	it('should cancel all operations', async () => {
		const promises = [
			manager.execute('op1', () => new Promise((_, reject) => setTimeout(() => reject(new Error()), 1000))),
			manager.execute('op2', () => new Promise((_, reject) => setTimeout(() => reject(new Error()), 1000))),
		]

		setTimeout(() => manager.cancelAll(), 20)

		await expect(Promise.all(promises)).rejects.toThrow()
	})

	it('should emit events', async () => {
		const events: string[] = []

		manager.on('attempt', () => events.push('attempt'))
		manager.on('success', () => events.push('success'))

		await manager.execute('test', () => 'result')

		expect(events).toContain('attempt')
		expect(events).toContain('success')
	})
})

describe('retryPredicates', () => {
	describe('always', () => {
		it('should always return true', () => {
			expect(retryPredicates.always()).toBe(true)
		})
	})

	describe('never', () => {
		it('should always return false', () => {
			expect(retryPredicates.never()).toBe(false)
		})
	})

	describe('onNetworkError', () => {
		it('should return true for network errors', () => {
			expect(retryPredicates.onNetworkError(new Error('ECONNREFUSED'))).toBe(true)
			expect(retryPredicates.onNetworkError(new Error('ETIMEDOUT'))).toBe(true)
		})

		it('should return false for other errors', () => {
			expect(retryPredicates.onNetworkError(new Error('Other error'))).toBe(false)
		})
	})

	describe('onErrorCodes', () => {
		it('should match specified codes', () => {
			const predicate = retryPredicates.onErrorCodes(['ECODE1', 'ECODE2'])

			expect(predicate(new Error('ECODE1 occurred'))).toBe(true)
			expect(predicate(new Error('ECODE3 occurred'))).toBe(false)
		})
	})

	describe('or', () => {
		it('should combine predicates with OR', () => {
			const combined = retryPredicates.or(
				(e) => e.message.includes('A'),
				(e) => e.message.includes('B')
			)

			expect(combined(new Error('A'), 1)).toBe(true)
			expect(combined(new Error('B'), 1)).toBe(true)
			expect(combined(new Error('C'), 1)).toBe(false)
		})
	})

	describe('and', () => {
		it('should combine predicates with AND', () => {
			const combined = retryPredicates.and(
				(e) => e.message.includes('A'),
				(e) => e.message.includes('B')
			)

			expect(combined(new Error('A and B'), 1)).toBe(true)
			expect(combined(new Error('A only'), 1)).toBe(false)
		})
	})
})

describe('retryConfigs', () => {
	it('should have aggressive config', () => {
		expect(retryConfigs.aggressive.maxAttempts).toBe(10)
		expect(retryConfigs.aggressive.baseDelay).toBe(100)
	})

	it('should have conservative config', () => {
		expect(retryConfigs.conservative.maxAttempts).toBe(3)
		expect(retryConfigs.conservative.baseDelay).toBe(2000)
	})

	it('should have fast config', () => {
		expect(retryConfigs.fast.maxAttempts).toBe(5)
		expect(retryConfigs.fast.baseDelay).toBe(50)
	})

	it('should have network config with predicate', () => {
		expect(retryConfigs.network.shouldRetry).toBe(retryPredicates.onNetworkError)
	})

	it('should have rsocket config with stepped strategy', () => {
		expect(retryConfigs.rsocket.backoffStrategy).toBe('stepped')
		expect(retryConfigs.rsocket.maxAttempts).toBe(5)
		expect(retryConfigs.rsocket.baseDelay).toBe(1000)
		expect(retryConfigs.rsocket.maxDelay).toBe(20000)
	})
})

describe('calculateDelay - stepped strategy', () => {
	it('should use exact delays from RETRY_BACKOFF_DELAYS array', () => {
		// Expected delays: [1000, 2000, 5000, 10000, 20000]
		const delay1 = calculateDelay(1, 100, 50000, 'stepped', 2, 0)
		const delay2 = calculateDelay(2, 100, 50000, 'stepped', 2, 0)
		const delay3 = calculateDelay(3, 100, 50000, 'stepped', 2, 0)
		const delay4 = calculateDelay(4, 100, 50000, 'stepped', 2, 0)
		const delay5 = calculateDelay(5, 100, 50000, 'stepped', 2, 0)

		expect(delay1).toBe(1000)
		expect(delay2).toBe(2000)
		expect(delay3).toBe(5000)
		expect(delay4).toBe(10000)
		expect(delay5).toBe(20000)
	})

	it('should use last delay for attempts beyond array length', () => {
		const delay6 = calculateDelay(6, 100, 50000, 'stepped', 2, 0)
		const delay10 = calculateDelay(10, 100, 50000, 'stepped', 2, 0)

		expect(delay6).toBe(20000)
		expect(delay10).toBe(20000)
	})

	it('should ignore baseDelay and multiplier parameters', () => {
		// baseDelay=9999 and multiplier=99 should be ignored
		const delay = calculateDelay(1, 9999, 50000, 'stepped', 99, 0)
		expect(delay).toBe(1000) // First step from RETRY_BACKOFF_DELAYS
	})

	it('should still apply jitter to stepped delays', () => {
		const delays = new Set<number>()

		for (let i = 0; i < 20; i++) {
			delays.add(calculateDelay(1, 100, 50000, 'stepped', 2, 0.15))
		}

		// With 15% jitter on 1000ms, delays should vary between ~850ms and ~1150ms
		expect(delays.size).toBeGreaterThan(1)
	})
})

describe('getRetryDelayWithJitter', () => {
	it('should return delay for each attempt with jitter applied', () => {
		// Test multiple times to verify jitter creates variation
		const delays: number[] = []
		for (let i = 0; i < 10; i++) {
			delays.push(getRetryDelayWithJitter(1))
		}

		// All delays should be within ±15% of 1000ms (850-1150ms)
		delays.forEach(delay => {
			expect(delay).toBeGreaterThanOrEqual(850)
			expect(delay).toBeLessThanOrEqual(1150)
		})

		// With jitter, we should have some variation
		const uniqueDelays = new Set(delays)
		expect(uniqueDelays.size).toBeGreaterThan(1)
	})

	it('should return correct base delays for each attempt', () => {
		// Test without considering jitter - just verify rough ranges
		// Attempt 1: 1000ms ±15% = 850-1150ms
		// Attempt 2: 2000ms ±15% = 1700-2300ms
		// Attempt 3: 5000ms ±15% = 4250-5750ms
		// Attempt 4: 10000ms ±15% = 8500-11500ms
		// Attempt 5: 20000ms ±15% = 17000-23000ms

		const d1 = getRetryDelayWithJitter(1)
		const d2 = getRetryDelayWithJitter(2)
		const d3 = getRetryDelayWithJitter(3)
		const d4 = getRetryDelayWithJitter(4)
		const d5 = getRetryDelayWithJitter(5)

		expect(d1).toBeGreaterThanOrEqual(850)
		expect(d1).toBeLessThanOrEqual(1150)

		expect(d2).toBeGreaterThanOrEqual(1700)
		expect(d2).toBeLessThanOrEqual(2300)

		expect(d3).toBeGreaterThanOrEqual(4250)
		expect(d3).toBeLessThanOrEqual(5750)

		expect(d4).toBeGreaterThanOrEqual(8500)
		expect(d4).toBeLessThanOrEqual(11500)

		expect(d5).toBeGreaterThanOrEqual(17000)
		expect(d5).toBeLessThanOrEqual(23000)
	})

	it('should handle attempt 0 by using first delay', () => {
		const delay = getRetryDelayWithJitter(0)
		expect(delay).toBeGreaterThanOrEqual(850)
		expect(delay).toBeLessThanOrEqual(1150)
	})

	it('should handle negative attempts by using first delay', () => {
		const delay = getRetryDelayWithJitter(-5)
		expect(delay).toBeGreaterThanOrEqual(850)
		expect(delay).toBeLessThanOrEqual(1150)
	})

	it('should use last delay for attempts beyond array length', () => {
		const delay6 = getRetryDelayWithJitter(6)
		const delay100 = getRetryDelayWithJitter(100)

		// Both should use 20000ms ±15% = 17000-23000ms
		expect(delay6).toBeGreaterThanOrEqual(17000)
		expect(delay6).toBeLessThanOrEqual(23000)

		expect(delay100).toBeGreaterThanOrEqual(17000)
		expect(delay100).toBeLessThanOrEqual(23000)
	})
})

describe('getAllRetryDelaysWithJitter', () => {
	it('should return array with 5 delays', () => {
		const delays = getAllRetryDelaysWithJitter()
		expect(delays).toHaveLength(5)
	})

	it('should return delays in increasing order (approximately)', () => {
		const delays = getAllRetryDelaysWithJitter()

		// Each delay should be roughly larger than the previous
		// (with jitter, there's small chance of overlap at boundaries)
		expect(delays[0]!).toBeLessThan(delays[2]!) // 1000 < 5000
		expect(delays[1]!).toBeLessThan(delays[3]!) // 2000 < 10000
		expect(delays[2]!).toBeLessThan(delays[4]!) // 5000 < 20000
	})

	it('should return different values on each call due to jitter', () => {
		const delays1 = getAllRetryDelaysWithJitter()
		const delays2 = getAllRetryDelaysWithJitter()

		// At least one delay should differ between calls
		const allSame = delays1.every((d, i) => d === delays2[i])
		expect(allSame).toBe(false)
	})
})

describe('retryConfigs.rsocket consistency', () => {
	/**
	 * This test ensures the hardcoded values in retryConfigs.rsocket
	 * stay synchronized with RETRY_BACKOFF_DELAYS and RETRY_JITTER_FACTOR.
	 *
	 * The values are hardcoded to avoid ESM initialization order issues,
	 * but this test will fail if someone updates the constants without
	 * updating retryConfigs.rsocket.
	 */
	it('should have maxAttempts equal to RETRY_BACKOFF_DELAYS.length', () => {
		expect(retryConfigs.rsocket.maxAttempts).toBe(RETRY_BACKOFF_DELAYS.length)
	})

	it('should have baseDelay equal to RETRY_BACKOFF_DELAYS[0]', () => {
		expect(retryConfigs.rsocket.baseDelay).toBe(RETRY_BACKOFF_DELAYS[0])
	})

	it('should have maxDelay equal to last RETRY_BACKOFF_DELAYS element', () => {
		expect(retryConfigs.rsocket.maxDelay).toBe(RETRY_BACKOFF_DELAYS[RETRY_BACKOFF_DELAYS.length - 1])
	})

	it('should have jitter equal to RETRY_JITTER_FACTOR', () => {
		expect(retryConfigs.rsocket.jitter).toBe(RETRY_JITTER_FACTOR)
	})
})
