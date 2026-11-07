import P from 'pino'
import { MessageRetryManager } from '../../Utils/message-retry-manager'

const logger = P({ level: 'silent' })

describe('MessageRetryManager retry count restoration', () => {
	it('restores a persisted count into an empty counter', () => {
		const manager = new MessageRetryManager(logger, 5)

		manager.restoreRetryCount('message-1', 3)

		expect(manager.getRetryCount('message-1')).toBe(3)
	})

	it('does not lower a higher in-memory count', () => {
		const manager = new MessageRetryManager(logger, 5)
		manager.incrementRetryCount('message-1')
		manager.incrementRetryCount('message-1')

		manager.restoreRetryCount('message-1', 1)

		expect(manager.getRetryCount('message-1')).toBe(2)
	})

	it('does not store a restored zero count', () => {
		const manager = new MessageRetryManager(logger, 5)

		manager.restoreRetryCount('message-1', 0)

		expect(manager.getRetryCount('message-1')).toBe(0)
		expect(manager.hasExceededMaxRetries('message-1')).toBe(false)
	})

	it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
		'treats non-finite restored counts as reaching the retry limit: %s',
		retryCount => {
			const manager = new MessageRetryManager(logger, 5)

			manager.restoreRetryCount('message-1', retryCount)

			expect(manager.hasExceededMaxRetries('message-1')).toBe(true)
		}
	)
})
