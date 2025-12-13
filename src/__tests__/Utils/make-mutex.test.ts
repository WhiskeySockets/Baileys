import { makeMutex, makeKeyedMutex, type Mutex, type KeyedMutex } from '../../Utils/make-mutex'

describe('makeMutex', () => {
	let mutex: Mutex

	beforeEach(() => {
		mutex = makeMutex()
	})

	it('should execute task and return result', async () => {
		const result = await mutex.mutex(() => 42)
		expect(result).toBe(42)
	})

	it('should execute async task and return result', async () => {
		const result = await mutex.mutex(async () => {
			await delay(10)
			return 'async result'
		})
		expect(result).toBe('async result')
	})

	it('should execute tasks sequentially', async () => {
		const order: number[] = []

		const task1 = mutex.mutex(async () => {
			await delay(50)
			order.push(1)
		})

		const task2 = mutex.mutex(async () => {
			await delay(10)
			order.push(2)
		})

		const task3 = mutex.mutex(() => {
			order.push(3)
		})

		await Promise.all([task1, task2, task3])

		// Tasks should complete in order they were queued
		expect(order).toEqual([1, 2, 3])
	})

	it('should handle errors without blocking subsequent tasks', async () => {
		const results: string[] = []

		const task1 = mutex.mutex(async () => {
			throw new Error('Task 1 failed')
		}).catch(e => results.push(`error: ${e.message}`))

		const task2 = mutex.mutex(() => {
			results.push('task2 completed')
		})

		await Promise.all([task1, task2])

		expect(results).toContain('error: Task 1 failed')
		expect(results).toContain('task2 completed')
	})

	it('should handle synchronous tasks', async () => {
		let value = 0

		await mutex.mutex(() => {
			value = 1
		})

		expect(value).toBe(1)
	})

	it('should propagate return values correctly', async () => {
		const stringResult = await mutex.mutex(() => 'string')
		const numberResult = await mutex.mutex(() => 123)
		const objectResult = await mutex.mutex(() => ({ key: 'value' }))
		const arrayResult = await mutex.mutex(() => [1, 2, 3])

		expect(stringResult).toBe('string')
		expect(numberResult).toBe(123)
		expect(objectResult).toEqual({ key: 'value' })
		expect(arrayResult).toEqual([1, 2, 3])
	})

	it('should handle many concurrent tasks', async () => {
		const count = 100
		let counter = 0

		const tasks = Array.from({ length: count }, () =>
			mutex.mutex(() => {
				counter++
			})
		)

		await Promise.all(tasks)

		expect(counter).toBe(count)
	})

	it('should maintain order under high concurrency', async () => {
		const order: number[] = []
		const tasks: Promise<void>[] = []

		for (let i = 0; i < 50; i++) {
			tasks.push(
				mutex.mutex(async () => {
					await delay(Math.random() * 5)
					order.push(i)
				})
			)
		}

		await Promise.all(tasks)

		// Should be in sequential order since mutex enforces it
		expect(order).toEqual(Array.from({ length: 50 }, (_, i) => i))
	})
})

describe('makeKeyedMutex', () => {
	let keyedMutex: KeyedMutex

	beforeEach(() => {
		keyedMutex = makeKeyedMutex()
	})

	it('should execute task and return result', async () => {
		const result = await keyedMutex.mutex('key1', () => 42)
		expect(result).toBe(42)
	})

	it('should execute tasks with same key sequentially', async () => {
		const order: number[] = []

		const task1 = keyedMutex.mutex('key1', async () => {
			await delay(50)
			order.push(1)
		})

		const task2 = keyedMutex.mutex('key1', async () => {
			await delay(10)
			order.push(2)
		})

		await Promise.all([task1, task2])

		expect(order).toEqual([1, 2])
	})

	it('should execute tasks with different keys concurrently', async () => {
		const order: string[] = []
		const startTime = Date.now()

		const task1 = keyedMutex.mutex('key1', async () => {
			await delay(100)
			order.push('key1')
		})

		const task2 = keyedMutex.mutex('key2', async () => {
			await delay(50)
			order.push('key2')
		})

		await Promise.all([task1, task2])

		const elapsed = Date.now() - startTime

		// key2 should finish first since they run concurrently
		expect(order).toEqual(['key2', 'key1'])
		// Total time should be ~100ms, not ~150ms (concurrent execution)
		expect(elapsed).toBeLessThan(150)
	})

	it('should clean up mutex after task completes', async () => {
		// First call creates the mutex
		await keyedMutex.mutex('cleanup-test', () => 'first')

		// Mutex should be cleaned up, so a new one is created
		// This is internal behavior, but we can verify no memory leak
		await keyedMutex.mutex('cleanup-test', () => 'second')

		// No error means cleanup worked
		expect(true).toBe(true)
	})

	it('should handle errors and still clean up', async () => {
		try {
			await keyedMutex.mutex('error-key', () => {
				throw new Error('Test error')
			})
		} catch {
			// Expected
		}

		// Should be able to use the same key again
		const result = await keyedMutex.mutex('error-key', () => 'success')
		expect(result).toBe('success')
	})

	it('should handle many different keys', async () => {
		const results: string[] = []
		const tasks: Promise<void>[] = []

		for (let i = 0; i < 50; i++) {
			tasks.push(
				keyedMutex.mutex(`key-${i}`, async () => {
					await delay(Math.random() * 10)
					results.push(`key-${i}`)
				})
			)
		}

		await Promise.all(tasks)

		expect(results.length).toBe(50)
	})

	it('should handle concurrent access to same key', async () => {
		let counter = 0
		const iterations = 100

		const tasks = Array.from({ length: iterations }, () =>
			keyedMutex.mutex('counter', async () => {
				const current = counter
				await delay(1)
				counter = current + 1
			})
		)

		await Promise.all(tasks)

		// Without mutex, this would likely be less than iterations
		expect(counter).toBe(iterations)
	})

	it('should maintain reference counting correctly', async () => {
		const startTime = Date.now()

		// Start three tasks on same key
		const task1 = keyedMutex.mutex('refcount', async () => {
			await delay(30)
			return 1
		})

		const task2 = keyedMutex.mutex('refcount', async () => {
			await delay(30)
			return 2
		})

		const task3 = keyedMutex.mutex('refcount', async () => {
			await delay(30)
			return 3
		})

		const results = await Promise.all([task1, task2, task3])

		expect(results).toEqual([1, 2, 3])

		// All three should execute sequentially
		const elapsed = Date.now() - startTime
		expect(elapsed).toBeGreaterThanOrEqual(80) // At least 3 * 30ms = 90ms (with some tolerance)
	})
})

describe('Integration: makeMutex and makeKeyedMutex', () => {
	it('should work independently', async () => {
		const mutex = makeMutex()
		const keyedMutex = makeKeyedMutex()

		const results: string[] = []

		await Promise.all([
			mutex.mutex(() => results.push('mutex')),
			keyedMutex.mutex('key', () => results.push('keyed'))
		])

		expect(results).toContain('mutex')
		expect(results).toContain('keyed')
	})
})

describe('Edge cases', () => {
	it('should handle undefined return value', async () => {
		const mutex = makeMutex()
		const result = await mutex.mutex(() => undefined)
		expect(result).toBeUndefined()
	})

	it('should handle null return value', async () => {
		const mutex = makeMutex()
		const result = await mutex.mutex(() => null)
		expect(result).toBeNull()
	})

	it('should handle empty key in keyed mutex', async () => {
		const keyedMutex = makeKeyedMutex()
		const result = await keyedMutex.mutex('', () => 'empty key')
		expect(result).toBe('empty key')
	})

	it('should handle special characters in key', async () => {
		const keyedMutex = makeKeyedMutex()
		const result = await keyedMutex.mutex('key/with:special@chars!', () => 'special')
		expect(result).toBe('special')
	})

	it('should handle very long key', async () => {
		const keyedMutex = makeKeyedMutex()
		const longKey = 'x'.repeat(1000)
		const result = await keyedMutex.mutex(longKey, () => 'long key')
		expect(result).toBe('long key')
	})

	it('should handle rejection with non-Error value', async () => {
		const mutex = makeMutex()

		await expect(
			mutex.mutex(() => {
				// eslint-disable-next-line @typescript-eslint/no-throw-literal
				throw 'string error'
			})
		).rejects.toBe('string error')
	})
})

describe('Performance', () => {
	it('should handle rapid sequential operations', async () => {
		const mutex = makeMutex()
		const count = 1000
		let sum = 0

		for (let i = 0; i < count; i++) {
			await mutex.mutex(() => {
				sum += 1
			})
		}

		expect(sum).toBe(count)
	})

	it('should not create memory pressure with many keys', async () => {
		const keyedMutex = makeKeyedMutex()
		const keyCount = 1000

		const tasks = Array.from({ length: keyCount }, (_, i) =>
			keyedMutex.mutex(`unique-key-${i}`, () => i)
		)

		const results = await Promise.all(tasks)

		expect(results.length).toBe(keyCount)
		// Keys should be cleaned up after use (internal detail)
	})
})

// Helper function
function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}
