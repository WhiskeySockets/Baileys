import { addTransactionCapability, delay } from '../Utils'
import logger from '../Utils/logger'
import { makeMockSignalKeyStore } from './utils'

logger.level = 'trace'

describe('Key Store w Transaction Tests', () => {

	const rawStore = makeMockSignalKeyStore()
	const store = addTransactionCapability(
		rawStore,
		logger,
		{
			maxCommitRetries: 1,
			delayBetweenTriesMs: 10
		}
	)

	it('should use transaction cache when mutated', async() => {
		const key = '123'
		const value = new Uint8Array(1)
		const ogGet = rawStore.get
		await store.transaction(
			async() => {
				await store.set({ 'session': { [key]: value } })

				rawStore.get = () => {
					throw new Error('should not have been called')
				}

				const { [key]: stored } = await store.get('session', [key])
				expect(stored).toEqual(new Uint8Array(1))
			}
		)

		rawStore.get = ogGet
	})

	it('should not commit a failed transaction', async() => {
		const key = 'abcd'
		await expect(
			store.transaction(
				async() => {
					await store.set({ 'session': { [key]: new Uint8Array(1) } })
					throw new Error('fail')
				}
			)
		).rejects.toThrowError(
			'fail'
		)

		const { [key]: stored } = await store.get('session', [key])
		expect(stored).toBeUndefined()
	})

	it('should handle overlapping transactions', async() => {
		// promise to let transaction 2
		// know that transaction 1 has started
		let promiseResolve: () => void
		const promise = new Promise<void>(resolve => {
			promiseResolve = resolve
		})

		store.transaction(
			async() => {
				await store.set({
					'session': {
						'1': new Uint8Array(1)
					}
				})
				// wait for the other transaction to start
				await delay(5)
				// reolve the promise to let the other transaction continue
				promiseResolve()
			}
		)

		await store.transaction(
			async() => {
				await promise
				await delay(5)

				expect(store.isInTransaction()).toBe(true)
			}
		)

		expect(store.isInTransaction()).toBe(false)
		// ensure that the transaction were committed
		const { ['1']: stored } = await store.get('session', ['1'])
		expect(stored).toEqual(new Uint8Array(1))
	})
})