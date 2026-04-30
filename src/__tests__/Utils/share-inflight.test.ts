import { describe, expect, it } from '@jest/globals'
import { shareInflightPromise } from '../../Utils/share-inflight'

describe('shareInflightPromise', () => {
	it('runs the factory once while concurrent callers receive the same result', async () => {
		let calls = 0
		const bag = new Map<string, Promise<number>>()

		const delayed = (): Promise<number> =>
			new Promise(resolve => {
				calls++
				setTimeout(() => resolve(42), 20)
			})

		const p1 = shareInflightPromise(bag, 'a', delayed)
		const p2 = shareInflightPromise(bag, 'a', delayed)

		const [one, two] = await Promise.all([p1, p2])

		expect(one).toBe(42)
		expect(two).toBe(42)
		expect(calls).toBe(1)
		expect(bag.size).toBe(0)
	})

	it('uses separate factories per key', async () => {
		const bag = new Map<string, Promise<string>>()
		let calls = 0

		const mk = shareInflightPromise(bag, 'x', async () => {
			calls++
			return `k${calls}`
		})

		const mk2 = shareInflightPromise(bag, 'y', async () => {
			calls++
			return `other`
		})

		const [rx, ry] = await Promise.all([mk, mk2])
		expect(rx).toMatch(/^k/)
		expect(ry).toBe('other')
		expect(calls).toBe(2)
	})

	it('clears map entry after rejection', async () => {
		const bag = new Map<string, Promise<number>>()
		await expect(
			shareInflightPromise(bag, 'err', async () => {
				throw new Error('boom')
			})
		).rejects.toThrow('boom')
		expect(bag.size).toBe(0)
	})
})
