import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { createPlaceholderTimeoutTracker } from '../../Socket/placeholder-timeouts'

describe('placeholder timeout tracker', () => {
	let tracker: ReturnType<typeof createPlaceholderTimeoutTracker>
	let clearTimeoutSpy: ReturnType<typeof jest.spyOn>

	beforeEach(() => {
		jest.useFakeTimers()
		clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
		tracker = createPlaceholderTimeoutTracker()
	})

	afterEach(() => {
		clearTimeoutSpy.mockRestore()
		jest.useRealTimers()
	})

	it('clears a tracked timer on demand', () => {
		const timer = setTimeout(() => {}, 1000)
		tracker.set('test', timer)
		expect(tracker.has('test')).toBe(true)

		tracker.clear('test')

		expect(clearTimeoutSpy).toHaveBeenCalledWith(timer)
		expect(tracker.has('test')).toBe(false)
	})

	it('cleans up all tracked timers', () => {
		const firstTimer = setTimeout(() => {}, 1000)
		const secondTimer = setTimeout(() => {}, 2000)
		tracker.set('first', firstTimer)
		tracker.set('second', secondTimer)

		tracker.cleanup()

		expect(clearTimeoutSpy).toHaveBeenCalledWith(firstTimer)
		expect(clearTimeoutSpy).toHaveBeenCalledWith(secondTimer)
		expect(tracker.has('first')).toBe(false)
		expect(tracker.has('second')).toBe(false)
		expect(tracker.size()).toBe(0)
	})
})
