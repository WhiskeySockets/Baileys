import { makeEventBuffer } from '../../Utils/event-buffer'
import type { Chat, Contact, WAMessage, BaileysEventMap } from '../../Types'
import type { ILogger } from '../../Utils/logger'

// Create a properly typed mock logger
const createMockLogger = (): ILogger => ({
	trace: () => {},
	debug: () => {},
	info: () => {},
	warn: () => {},
	error: () => {},
	child: () => createMockLogger(),
	level: 'trace' as const
})

// Helper to create mock chat
function createMockChat(id: string, overrides?: Partial<Chat>): Chat {
	return {
		id,
		conversationTimestamp: Date.now(),
		...overrides
	} as Chat
}

// Helper to create mock contact
function createMockContact(id: string, overrides?: Partial<Contact>): Contact {
	return {
		id,
		...overrides
	}
}

// Helper to create mock message
function createMockMessage(
	remoteJid: string,
	id: string,
	fromMe = false,
	overrides?: Partial<WAMessage>
): WAMessage {
	return {
		key: { remoteJid, id, fromMe },
		messageTimestamp: Date.now(),
		...overrides
	} as WAMessage
}

describe('makeEventBuffer', () => {
	let eventBuffer: ReturnType<typeof makeEventBuffer>
	let mockLogger: ILogger

	beforeEach(() => {
		mockLogger = createMockLogger()
		eventBuffer = makeEventBuffer(mockLogger)
	})

	describe('basic functionality', () => {
		it('should create event buffer', () => {
			expect(eventBuffer).toBeDefined()
			expect(eventBuffer.emit).toBeDefined()
			expect(eventBuffer.buffer).toBeDefined()
			expect(eventBuffer.flush).toBeDefined()
			expect(eventBuffer.isBuffering).toBeDefined()
		})

		it('should not be buffering initially', () => {
			expect(eventBuffer.isBuffering()).toBe(false)
		})

		it('should start buffering after buffer() call', () => {
			eventBuffer.buffer()
			expect(eventBuffer.isBuffering()).toBe(true)
		})

		it('should stop buffering after flush()', () => {
			eventBuffer.buffer()
			eventBuffer.flush()
			expect(eventBuffer.isBuffering()).toBe(false)
		})

		it('should return false when flushing without buffer', () => {
			const result = eventBuffer.flush()
			expect(result).toBe(false)
		})

		it('should return true when flushing with buffer', () => {
			eventBuffer.buffer()
			const result = eventBuffer.flush()
			expect(result).toBe(true)
		})
	})

	describe('event emission', () => {
		it('should emit events immediately when not buffering', () => {
			let received = false
			eventBuffer.on('chats.upsert', () => {
				received = true
			})

			eventBuffer.emit('chats.upsert', [createMockChat('chat1')])

			expect(received).toBe(true)
		})

		it('should buffer events when buffering', () => {
			let received = false
			eventBuffer.on('chats.upsert', () => {
				received = true
			})

			eventBuffer.buffer()
			eventBuffer.emit('chats.upsert', [createMockChat('chat1')])

			expect(received).toBe(false)
		})

		it('should emit buffered events on flush', () => {
			let received = false
			eventBuffer.on('chats.upsert', () => {
				received = true
			})

			eventBuffer.buffer()
			eventBuffer.emit('chats.upsert', [createMockChat('chat1')])
			eventBuffer.flush()

			expect(received).toBe(true)
		})
	})

	describe('chat events', () => {
		it('should consolidate multiple chat upserts', () => {
			let chatCount = 0
			eventBuffer.on('chats.upsert', (chats: Chat[]) => {
				chatCount = chats.length
			})

			eventBuffer.buffer()
			eventBuffer.emit('chats.upsert', [createMockChat('chat1')])
			eventBuffer.emit('chats.upsert', [createMockChat('chat2')])
			eventBuffer.flush()

			expect(chatCount).toBe(2)
		})

		it('should merge chat upsert with same id', () => {
			let chats: Chat[] = []
			eventBuffer.on('chats.upsert', (c: Chat[]) => {
				chats = c
			})

			eventBuffer.buffer()
			eventBuffer.emit('chats.upsert', [createMockChat('chat1', { name: 'First' })])
			eventBuffer.emit('chats.upsert', [createMockChat('chat1', { name: 'Second' })])
			eventBuffer.flush()

			expect(chats.length).toBe(1)
			expect(chats[0]!.name).toBe('Second')
		})
	})

	describe('contact events', () => {
		it('should consolidate contact upserts', () => {
			let contactCount = 0
			eventBuffer.on('contacts.upsert', (contacts: Contact[]) => {
				contactCount = contacts.length
			})

			eventBuffer.buffer()
			eventBuffer.emit('contacts.upsert', [createMockContact('contact1')])
			eventBuffer.emit('contacts.upsert', [createMockContact('contact2')])
			eventBuffer.flush()

			expect(contactCount).toBe(2)
		})
	})

	describe('message events', () => {
		it('should consolidate message upserts', () => {
			let msgCount = 0
			eventBuffer.on('messages.upsert', (data: BaileysEventMap['messages.upsert']) => {
				msgCount = data.messages.length
			})

			eventBuffer.buffer()
			eventBuffer.emit('messages.upsert', {
				messages: [createMockMessage('chat1', 'msg1')],
				type: 'notify'
			})
			eventBuffer.emit('messages.upsert', {
				messages: [createMockMessage('chat1', 'msg2')],
				type: 'notify'
			})
			eventBuffer.flush()

			expect(msgCount).toBe(2)
		})
	})

	describe('process handler', () => {
		it('should call process handler on event', () => {
			let called = false
			eventBuffer.process(() => {
				called = true
			})

			eventBuffer.emit('chats.upsert', [createMockChat('chat1')])

			expect(called).toBe(true)
		})

		it('should return unsubscribe function', () => {
			let callCount = 0
			const unsubscribe = eventBuffer.process(() => {
				callCount++
			})

			eventBuffer.emit('chats.upsert', [createMockChat('chat1')])
			unsubscribe()
			eventBuffer.emit('chats.upsert', [createMockChat('chat2')])

			expect(callCount).toBe(1)
		})
	})

	describe('createBufferedFunction', () => {
		it('should wrap function with buffering', async () => {
			const bufferedFn = eventBuffer.createBufferedFunction(async () => {
				return 'result'
			})

			const result = await bufferedFn()

			expect(result).toBe('result')
		})

		it('should handle errors in wrapped function', async () => {
			const bufferedFn = eventBuffer.createBufferedFunction(async () => {
				throw new Error('Test error')
			})

			await expect(bufferedFn()).rejects.toThrow('Test error')
		})
	})

	describe('event listener management', () => {
		it('should add event listener with on()', () => {
			let received = false
			eventBuffer.on('chats.upsert', () => {
				received = true
			})

			eventBuffer.emit('chats.upsert', [createMockChat('chat1')])

			expect(received).toBe(true)
		})

		it('should remove event listener with off()', () => {
			let callCount = 0
			const listener = () => {
				callCount++
			}

			eventBuffer.on('chats.upsert', listener)
			eventBuffer.emit('chats.upsert', [createMockChat('chat1')])

			eventBuffer.off('chats.upsert', listener)
			eventBuffer.emit('chats.upsert', [createMockChat('chat2')])

			expect(callCount).toBe(1)
		})
	})

	describe('edge cases', () => {
		it('should handle empty flush', () => {
			let called = false
			eventBuffer.on('chats.upsert', () => {
				called = true
			})

			eventBuffer.buffer()
			eventBuffer.flush()

			// Should not emit any events for empty buffer
			expect(called).toBe(false)
		})

		it('should handle multiple buffer calls', () => {
			eventBuffer.buffer()
			eventBuffer.buffer()
			eventBuffer.buffer()

			expect(eventBuffer.isBuffering()).toBe(true)
		})
	})
})
