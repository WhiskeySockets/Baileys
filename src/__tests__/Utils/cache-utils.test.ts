/**
 * Testes unitários para cache-utils.ts
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import {
	Cache,
	createCache,
	MultiLevelCache,
	withCache,
	getGlobalCache,
	clearGlobalCaches,
} from '../../Utils/cache-utils.js'

describe('Cache', () => {
	let cache: Cache<string>

	beforeEach(() => {
		cache = createCache<string>({
			ttl: 1000,
			maxSize: 100,
			collectMetrics: false,
		})
	})

	describe('basic operations', () => {
		it('should set and get values', () => {
			cache.set('key1', 'value1')
			expect(cache.get('key1')).toBe('value1')
		})

		it('should return undefined for non-existent keys', () => {
			expect(cache.get('nonexistent')).toBeUndefined()
		})

		it('should check if key exists', () => {
			cache.set('exists', 'value')
			expect(cache.has('exists')).toBe(true)
			expect(cache.has('notexists')).toBe(false)
		})

		it('should delete keys', () => {
			cache.set('toDelete', 'value')
			expect(cache.delete('toDelete')).toBe(true)
			expect(cache.get('toDelete')).toBeUndefined()
		})

		it('should clear all values', () => {
			cache.set('key1', 'value1')
			cache.set('key2', 'value2')
			cache.clear()
			expect(cache.size).toBe(0)
		})
	})

	describe('TTL', () => {
		it('should expire values after TTL', async () => {
			const shortTtlCache = createCache<string>({
				ttl: 50,
				collectMetrics: false,
			})

			shortTtlCache.set('expiring', 'value')
			expect(shortTtlCache.get('expiring')).toBe('value')

			await new Promise((resolve) => setTimeout(resolve, 100))

			expect(shortTtlCache.get('expiring')).toBeUndefined()
		})

		it('should support custom TTL per item', async () => {
			cache.set('shortLived', 'value', 50)
			cache.set('longLived', 'value', 5000)

			await new Promise((resolve) => setTimeout(resolve, 100))

			expect(cache.get('shortLived')).toBeUndefined()
			expect(cache.get('longLived')).toBe('value')
		})
	})

	describe('getOrSet', () => {
		it('should return cached value if exists', async () => {
			cache.set('cached', 'existingValue')

			const factory = jest.fn(() => 'newValue')
			const result = await cache.getOrSet('cached', factory)

			expect(result).toBe('existingValue')
			expect(factory).not.toHaveBeenCalled()
		})

		it('should call factory and cache if not exists', async () => {
			const factory = jest.fn(() => 'newValue')
			const result = await cache.getOrSet('new', factory)

			expect(result).toBe('newValue')
			expect(factory).toHaveBeenCalledTimes(1)
			expect(cache.get('new')).toBe('newValue')
		})

		it('should handle async factories', async () => {
			const factory = jest.fn(async () => {
				await new Promise((resolve) => setTimeout(resolve, 10))
				return 'asyncValue'
			})

			const result = await cache.getOrSet('async', factory)

			expect(result).toBe('asyncValue')
		})
	})

	describe('getOrSetSync', () => {
		it('should work synchronously', () => {
			const factory = jest.fn(() => 'syncValue')
			const result = cache.getOrSetSync('sync', factory)

			expect(result).toBe('syncValue')
			expect(factory).toHaveBeenCalledTimes(1)
		})
	})

	describe('invalidation', () => {
		it('should invalidate by pattern', () => {
			cache.set('user:1', 'user1')
			cache.set('user:2', 'user2')
			cache.set('post:1', 'post1')

			const count = cache.invalidateByPattern(/^user:/)

			expect(count).toBe(2)
			expect(cache.get('user:1')).toBeUndefined()
			expect(cache.get('user:2')).toBeUndefined()
			expect(cache.get('post:1')).toBe('post1')
		})

		it('should invalidate by prefix', () => {
			cache.set('prefix:a', 'a')
			cache.set('prefix:b', 'b')
			cache.set('other:c', 'c')

			const count = cache.invalidateByPrefix('prefix:')

			expect(count).toBe(2)
			expect(cache.get('prefix:a')).toBeUndefined()
			expect(cache.get('other:c')).toBe('c')
		})
	})

	describe('statistics', () => {
		it('should track hits and misses', () => {
			cache.set('key', 'value')

			cache.get('key') // hit
			cache.get('key') // hit
			cache.get('nonexistent') // miss

			const stats = cache.getStats()

			expect(stats.hits).toBe(2)
			expect(stats.misses).toBe(1)
			expect(stats.hitRate).toBeCloseTo(2 / 3)
		})
	})

	describe('touch', () => {
		it('should update TTL of existing item', () => {
			cache.set('touchable', 'value')
			expect(cache.touch('touchable')).toBe(true)
		})

		it('should return false for non-existent item', () => {
			expect(cache.touch('nonexistent')).toBe(false)
		})
	})

	describe('getWithResult', () => {
		it('should return detailed result on hit', () => {
			cache.set('key', 'value')
			const result = cache.getWithResult('key')

			expect(result.hit).toBe(true)
			expect(result.value).toBe('value')
			expect(result.key).toBe('key')
		})

		it('should return detailed result on miss', () => {
			const result = cache.getWithResult('missing')

			expect(result.hit).toBe(false)
			expect(result.value).toBeUndefined()
		})
	})
})

describe('MultiLevelCache', () => {
	it('should try L1 first', async () => {
		const l2Get = jest.fn()
		const l2Set = jest.fn()
		const l2Delete = jest.fn()

		const multiCache = new MultiLevelCache<string>(
			{ ttl: 1000, collectMetrics: false },
			{ get: l2Get, set: l2Set, delete: l2Delete }
		)

		multiCache.getL1().set('local', 'value')

		const result = await multiCache.get('local')

		expect(result).toBe('value')
		expect(l2Get).not.toHaveBeenCalled()
	})

	it('should fallback to L2 on L1 miss', async () => {
		const l2Get = jest.fn(async () => 'l2value')
		const l2Set = jest.fn()
		const l2Delete = jest.fn()

		const multiCache = new MultiLevelCache<string>(
			{ ttl: 1000, collectMetrics: false },
			{ get: l2Get, set: l2Set, delete: l2Delete }
		)

		const result = await multiCache.get('fromL2')

		expect(result).toBe('l2value')
		expect(l2Get).toHaveBeenCalledWith('fromL2')
	})

	it('should write to both levels', async () => {
		const l2Set = jest.fn()

		const multiCache = new MultiLevelCache<string>(
			{ ttl: 1000, collectMetrics: false },
			{ get: jest.fn(), set: l2Set, delete: jest.fn() }
		)

		await multiCache.set('key', 'value')

		expect(multiCache.getL1().get('key')).toBe('value')
		expect(l2Set).toHaveBeenCalledWith('key', 'value', undefined)
	})
})

describe('withCache', () => {
	it('should cache function results', async () => {
		let callCount = 0
		const expensiveFn = (x: number) => {
			callCount++
			return x * 2
		}

		const cachedFn = withCache(expensiveFn, { ttl: 1000, collectMetrics: false })

		const result1 = await cachedFn(5)
		const result2 = await cachedFn(5)
		const result3 = await cachedFn(10)

		expect(result1).toBe(10)
		expect(result2).toBe(10)
		expect(result3).toBe(20)
		expect(callCount).toBe(2) // 5 was cached, 10 was not
	})
})

describe('globalCache', () => {
	beforeEach(() => {
		clearGlobalCaches()
	})

	it('should create and retrieve global cache by namespace', () => {
		const cache1 = getGlobalCache('ns1')
		const cache2 = getGlobalCache('ns1')
		const cache3 = getGlobalCache('ns2')

		expect(cache1).toBe(cache2)
		expect(cache1).not.toBe(cache3)
	})

	it('should clear all global caches', () => {
		const cache1 = getGlobalCache<string>('test1')
		const cache2 = getGlobalCache<string>('test2')

		cache1.set('key', 'value')
		cache2.set('key', 'value')

		clearGlobalCaches()

		// After clear, new caches should be created
		const newCache1 = getGlobalCache<string>('test1')
		expect(newCache1.get('key')).toBeUndefined()
	})
})
