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
			const onRetry = jest.fn()
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
			expect(retryPredicates.always(new Error(), 1)).toBe(true)
		})
	})

	describe('never', () => {
		it('should always return false', () => {
			expect(retryPredicates.never(new Error(), 1)).toBe(false)
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
})
