/**
 * Testes unitários para circuit-breaker.ts
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import {
	CircuitBreaker,
	createCircuitBreaker,
	CircuitBreakerRegistry,
	globalCircuitRegistry,
	CircuitOpenError,
	CircuitTimeoutError,
	withCircuitBreaker,
	getCircuitHealth,
	type CircuitState,
} from '../../Utils/circuit-breaker.js'

describe('CircuitBreaker', () => {
	let breaker: CircuitBreaker

	beforeEach(() => {
		breaker = createCircuitBreaker({
			name: 'test',
			failureThreshold: 3,
			successThreshold: 2,
			resetTimeout: 100,
			timeout: 1000,
			collectMetrics: false,
		})
	})

	afterEach(() => {
		breaker.destroy()
	})

	describe('initial state', () => {
		it('should start in closed state', () => {
			expect(breaker.getState()).toBe('closed')
			expect(breaker.isClosed()).toBe(true)
			expect(breaker.isOpen()).toBe(false)
			expect(breaker.isHalfOpen()).toBe(false)
		})
	})

	describe('successful operations', () => {
		it('should execute successful operations', async () => {
			const result = await breaker.execute(() => 'success')
			expect(result).toBe('success')
		})

		it('should execute async operations', async () => {
			const result = await breaker.execute(async () => {
				await new Promise((resolve) => setTimeout(resolve, 10))
				return 'async success'
			})
			expect(result).toBe('async success')
		})

		it('should track successful calls in stats', async () => {
			await breaker.execute(() => 'success')
			await breaker.execute(() => 'success')

			const stats = breaker.getStats()
			expect(stats.totalCalls).toBe(2)
			expect(stats.totalSuccesses).toBe(2)
			expect(stats.totalFailures).toBe(0)
		})
	})

	describe('failure handling', () => {
		it('should open after reaching failure threshold', async () => {
			const failingOp = () => {
				throw new Error('Failure')
			}

			// Reach failure threshold
			for (let i = 0; i < 3; i++) {
				await expect(breaker.execute(failingOp)).rejects.toThrow('Failure')
			}

			expect(breaker.isOpen()).toBe(true)
		})

		it('should not open before reaching threshold', async () => {
			const failingOp = () => {
				throw new Error('Failure')
			}

			// Below threshold
			for (let i = 0; i < 2; i++) {
				await expect(breaker.execute(failingOp)).rejects.toThrow('Failure')
			}

			expect(breaker.isClosed()).toBe(true)
		})

		it('should reset failure count on success', async () => {
			const failingOp = () => {
				throw new Error('Failure')
			}

			await expect(breaker.execute(failingOp)).rejects.toThrow()
			await expect(breaker.execute(failingOp)).rejects.toThrow()

			// Success resets failures
			await breaker.execute(() => 'success')

			// Need 3 more failures to open
			await expect(breaker.execute(failingOp)).rejects.toThrow()
			await expect(breaker.execute(failingOp)).rejects.toThrow()

			expect(breaker.isClosed()).toBe(true)
		})
	})

	describe('open state', () => {
		beforeEach(async () => {
			// Force open
			breaker.trip()
		})

		it('should reject operations when open', async () => {
			await expect(breaker.execute(() => 'success')).rejects.toThrow(CircuitOpenError)
		})

		it('should transition to half-open after reset timeout', async () => {
			await new Promise((resolve) => setTimeout(resolve, 150))
			expect(breaker.isHalfOpen()).toBe(true)
		})
	})

	describe('half-open state', () => {
		beforeEach(async () => {
			breaker.trip()
			await new Promise((resolve) => setTimeout(resolve, 150))
		})

		it('should close after success threshold', async () => {
			expect(breaker.isHalfOpen()).toBe(true)

			// Success threshold is 2
			await breaker.execute(() => 'success')
			await breaker.execute(() => 'success')

			expect(breaker.isClosed()).toBe(true)
		})

		it('should reopen on failure', async () => {
			expect(breaker.isHalfOpen()).toBe(true)

			await expect(
				breaker.execute(() => {
					throw new Error('Failure')
				})
			).rejects.toThrow()

			expect(breaker.isOpen()).toBe(true)
		})
	})

	describe('manual controls', () => {
		it('should force open with trip()', () => {
			breaker.trip()
			expect(breaker.isOpen()).toBe(true)
		})

		it('should force close with reset()', async () => {
			breaker.trip()
			breaker.reset()
			expect(breaker.isClosed()).toBe(true)
		})
	})

	describe('timeout', () => {
		it('should timeout slow operations', async () => {
			const slowBreaker = createCircuitBreaker({
				name: 'slow',
				timeout: 50,
				collectMetrics: false,
			})

			await expect(
				slowBreaker.execute(
					() => new Promise((resolve) => setTimeout(resolve, 200))
				)
			).rejects.toThrow(CircuitTimeoutError)

			slowBreaker.destroy()
		})
	})

	describe('events', () => {
		it('should emit state-change event', async () => {
			const stateChanges: Array<{ from: CircuitState; to: CircuitState }> = []

			breaker.on('state-change', (change) => {
				stateChanges.push(change)
			})

			breaker.trip()
			breaker.reset()

			expect(stateChanges).toHaveLength(2)
			expect(stateChanges[0]).toEqual({ from: 'closed', to: 'open' })
			expect(stateChanges[1]).toEqual({ from: 'open', to: 'closed' })
		})

		it('should emit success and failure events', async () => {
			let successCount = 0
			let failureCount = 0

			breaker.on('success', () => successCount++)
			breaker.on('failure', () => failureCount++)

			await breaker.execute(() => 'success')
			await expect(
				breaker.execute(() => {
					throw new Error()
				})
			).rejects.toThrow()

			expect(successCount).toBe(1)
			expect(failureCount).toBe(1)
		})
	})

	describe('isFailure predicate', () => {
		it('should use custom isFailure predicate', async () => {
			const customBreaker = createCircuitBreaker({
				name: 'custom',
				failureThreshold: 1,
				isFailure: (error) => error.message !== 'Ignored',
				collectMetrics: false,
			})

			// This error should be ignored
			await expect(
				customBreaker.execute(() => {
					throw new Error('Ignored')
				})
			).rejects.toThrow()

			expect(customBreaker.isClosed()).toBe(true)

			// This should trip the breaker
			await expect(
				customBreaker.execute(() => {
					throw new Error('Real failure')
				})
			).rejects.toThrow()

			expect(customBreaker.isOpen()).toBe(true)

			customBreaker.destroy()
		})
	})

	describe('sync operations', () => {
		it('should execute sync operations', () => {
			const result = breaker.executeSync(() => 'sync result')
			expect(result).toBe('sync result')
		})

		it('should handle sync failures', () => {
			expect(() =>
				breaker.executeSync(() => {
					throw new Error('Sync failure')
				})
			).toThrow('Sync failure')
		})
	})
})

describe('CircuitBreakerRegistry', () => {
	let registry: CircuitBreakerRegistry

	beforeEach(() => {
		registry = new CircuitBreakerRegistry()
	})

	afterEach(() => {
		registry.destroyAll()
	})

	it('should create and retrieve circuit breakers', () => {
		const breaker1 = registry.get('test1')
		const breaker2 = registry.get('test1')

		expect(breaker1).toBe(breaker2)
	})

	it('should check if breaker exists', () => {
		registry.get('exists')

		expect(registry.has('exists')).toBe(true)
		expect(registry.has('notexists')).toBe(false)
	})

	it('should remove breaker', () => {
		registry.get('toRemove')
		expect(registry.remove('toRemove')).toBe(true)
		expect(registry.has('toRemove')).toBe(false)
	})

	it('should get all stats', () => {
		registry.get('breaker1')
		registry.get('breaker2')

		const stats = registry.getAllStats()

		expect(stats).toHaveProperty('breaker1')
		expect(stats).toHaveProperty('breaker2')
	})

	it('should reset all breakers', async () => {
		const breaker = registry.get('test')
		breaker.trip()

		registry.resetAll()

		expect(breaker.isClosed()).toBe(true)
	})
})

describe('withCircuitBreaker', () => {
	it('should wrap function with circuit breaker', async () => {
		let callCount = 0

		const protectedFn = withCircuitBreaker(
			async () => {
				callCount++
				return 'result'
			},
			{
				name: 'wrapped-fn',
				collectMetrics: false,
			}
		)

		const result = await protectedFn()

		expect(result).toBe('result')
		expect(callCount).toBe(1)
	})
})

describe('getCircuitHealth', () => {
	beforeEach(() => {
		globalCircuitRegistry.destroyAll()
	})

	it('should report healthy when all circuits closed', () => {
		globalCircuitRegistry.get('healthy1')
		globalCircuitRegistry.get('healthy2')

		const health = getCircuitHealth()

		expect(health.healthy).toBe(true)
		expect(health.openCircuits).toHaveLength(0)
	})

	it('should report unhealthy when circuit is open', () => {
		const breaker = globalCircuitRegistry.get('unhealthy')
		breaker.trip()

		const health = getCircuitHealth()

		expect(health.healthy).toBe(false)
		expect(health.openCircuits).toContain('unhealthy')
	})
})
