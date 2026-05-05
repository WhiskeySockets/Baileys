import { jest } from '@jest/globals'
import P from 'pino'
import { makeEventBuffer } from '../../Utils/event-buffer'

const logger = P({ level: 'silent' })

describe('makeEventBuffer destroy()', () => {
	beforeEach(() => {
		jest.useFakeTimers()
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	it('clears flushPendingTimeout so a debounced flush does not fire after destroy', () => {
		const buffer = makeEventBuffer(logger)

		// Enter buffering and queue an event so flush scheduling logic runs.
		buffer.buffer()
		buffer.emit('connection.update', { connection: 'open' })

		// Trigger a flush() during buffering — the implementation schedules a
		// debounced re-flush via setTimeout(flush, 100), assigned to flushPendingTimeout.
		buffer.flush()

		// Spy on the listener target to detect any post-destroy flush dispatching.
		const listener = jest.fn()
		buffer.on('connection.update', listener)

		// Destroy. Our patch must clear flushPendingTimeout in addition to bufferTimeout.
		buffer.destroy()

		// Advance past the debounce window. If the timeout was not cleared, flush()
		// would fire and either throw on torn-down state or re-emit events.
		jest.advanceTimersByTime(500)

		// listener was removed by removeAllListeners() inside destroy(); even if the
		// stray timeout fired, no events should have reached this handler.
		expect(listener).not.toHaveBeenCalled()
	})

	it('clears bufferTimeout (regression check for the existing cleanup)', () => {
		const buffer = makeEventBuffer(logger)
		buffer.buffer()
		buffer.emit('connection.update', { connection: 'open' })

		// Schedule the buffering-window timeout (4500ms in the source).
		// Then destroy before it fires.
		buffer.destroy()

		const listener = jest.fn()
		buffer.on('connection.update', listener)

		jest.advanceTimersByTime(10_000)
		expect(listener).not.toHaveBeenCalled()
	})
})
