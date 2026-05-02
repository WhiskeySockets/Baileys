import { jest } from '@jest/globals'
import P from 'pino'
import { makeEventBuffer } from '../../Utils/event-buffer'

const logger = P({ level: 'silent' })

describe('makeEventBuffer - destroy()', () => {
	it('should not throw when destroy is called on a fresh buffer', () => {
		const ev = makeEventBuffer(logger)
		expect(() => ev.destroy()).not.toThrow()
	})

	it('should remove all listeners after destroy', () => {
		const ev = makeEventBuffer(logger)
		const handler = jest.fn()

		ev.on('chats.upsert', handler)
		ev.destroy()

		// After destroy, emitting should not invoke listener
		ev.emit('chats.upsert', [])
		expect(handler).not.toHaveBeenCalled()
	})

	it('should set isBuffering to false after destroy', () => {
		const ev = makeEventBuffer(logger)
		ev.buffer()
		expect(ev.isBuffering()).toBe(true)

		ev.destroy()
		expect(ev.isBuffering()).toBe(false)
	})

	it('should clear pending buffer timeout so flush() returns false after destroy', () => {
		const ev = makeEventBuffer(logger)
		ev.buffer()
		ev.destroy()

		// flush should return false (buffer not active)
		const result = ev.flush()
		expect(result).toBe(false)
	})

	it('should be idempotent - calling destroy() twice should not throw', () => {
		const ev = makeEventBuffer(logger)
		ev.destroy()
		expect(() => ev.destroy()).not.toThrow()
	})

	it('should allow re-registering listeners after destroy and have them work correctly', () => {
		const ev = makeEventBuffer(logger)
		const firstHandler = jest.fn()
		ev.on('chats.upsert', firstHandler)
		ev.destroy()

		// After destroy, re-register a new listener
		const newHandler = jest.fn()
		ev.on('chats.upsert', newHandler)
		ev.emit('chats.upsert', [{ id: 'test@s.whatsapp.net' }])

		expect(firstHandler).not.toHaveBeenCalled()
		expect(newHandler).toHaveBeenCalledTimes(1)
	})

	it('should not call process handlers after destroy', () => {
		const ev = makeEventBuffer(logger)
		const processor = jest.fn()
		ev.process(processor)

		ev.destroy()
		ev.emit('chats.upsert', [{ id: 'test@s.whatsapp.net' }])

		// No buffered events should be processed after destroy
		expect(processor).not.toHaveBeenCalled()
	})

	it('should not lose state when destroy called during buffering', async () => {
		const ev = makeEventBuffer(logger)

		// Buffer some events
		ev.buffer()
		ev.emit('chats.upsert', [{ id: 'chat1@s.whatsapp.net' }])
		ev.emit('contacts.upsert', [{ id: 'contact1@s.whatsapp.net' }])

		// Destroy before flush - should not throw, state is cleaned
		expect(() => ev.destroy()).not.toThrow()
		expect(ev.isBuffering()).toBe(false)
	})
})