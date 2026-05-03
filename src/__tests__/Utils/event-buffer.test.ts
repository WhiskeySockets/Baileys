import { jest } from '@jest/globals'
import { makeEventBuffer } from '../../Utils/event-buffer'
import type { ILogger } from '../../Utils/logger'

const createMockLogger = (): ILogger =>
	({
		warn: jest.fn(),
		info: jest.fn(),
		debug: jest.fn(),
		error: jest.fn(),
		trace: jest.fn(),
		child: jest.fn(function (this: ILogger) {
			return this
		}),
		level: 'silent'
	}) as unknown as ILogger

describe('event-buffer chats.delete debounce', () => {
	beforeEach(() => {
		jest.useFakeTimers()
	})

	afterEach(() => {
		jest.useRealTimers()
		jest.clearAllMocks()
	})

	it('debounces rapid chats.delete events into one emit', () => {
		const ev = makeEventBuffer(createMockLogger())
		const handler = jest.fn()
		ev.on('chats.delete', handler)

		ev.emit('chats.delete', ['a@s.whatsapp.net'])
		ev.emit('chats.delete', ['b@s.whatsapp.net'])
		ev.emit('chats.delete', ['a@s.whatsapp.net'])

		expect(handler).not.toHaveBeenCalled()

		jest.advanceTimersByTime(500)

		expect(handler).toHaveBeenCalledTimes(1)
		expect(handler).toHaveBeenCalledWith(['a@s.whatsapp.net', 'b@s.whatsapp.net'])
	})

	it('flushes pending chats.delete before another event to preserve order', () => {
		const ev = makeEventBuffer(createMockLogger())
		const order: string[] = []
		const chatDeleteHandler = jest.fn(() => order.push('delete'))
		const chatUpdateHandler = jest.fn(() => order.push('update'))

		ev.on('chats.delete', chatDeleteHandler)
		ev.on('chats.update', chatUpdateHandler)

		ev.emit('chats.delete', ['a@s.whatsapp.net'])
		ev.emit('chats.update', [{ id: 'a@s.whatsapp.net', archived: false }])

		expect(chatDeleteHandler).toHaveBeenCalledTimes(1)
		expect(chatDeleteHandler).toHaveBeenCalledWith(['a@s.whatsapp.net'])
		expect(chatUpdateHandler).toHaveBeenCalledTimes(1)
		expect(order).toEqual(['delete', 'update'])
	})

	it('does not drop pending chats.delete when transitioning into buffer/flush', () => {
		const ev = makeEventBuffer(createMockLogger())
		const handler = jest.fn()
		ev.on('chats.delete', handler)

		ev.emit('chats.delete', ['a@s.whatsapp.net'])
		ev.buffer()
		ev.flush()

		expect(handler).toHaveBeenCalledTimes(1)
		expect(handler).toHaveBeenCalledWith(['a@s.whatsapp.net'])
	})
})
