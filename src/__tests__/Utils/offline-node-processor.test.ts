import { jest } from '@jest/globals'
import { makeOfflineNodeProcessor, type MessageType } from '../../Utils/offline-node-processor'
import { type BinaryNode } from '../../WABinary'

function makeNode(id: string, tag = 'message'): BinaryNode {
	return { tag, attrs: { id, from: 'user@s.whatsapp.net', offline: '1' } }
}

describe('makeOfflineNodeProcessor', () => {
	let mockOnUnexpectedError: jest.Mock<(error: Error, msg: string) => void>
	let isWsOpen: boolean
	let yieldCalls: number

	function createProcessor(handlers: Map<MessageType, (node: BinaryNode) => Promise<void>>, batchSize = 10) {
		return makeOfflineNodeProcessor(
			handlers,
			{
				isWsOpen: () => isWsOpen,
				onUnexpectedError: mockOnUnexpectedError,
				yieldToEventLoop: async () => {
					yieldCalls++
				}
			},
			batchSize
		)
	}

	beforeEach(() => {
		mockOnUnexpectedError = jest.fn()
		isWsOpen = true
		yieldCalls = 0
	})

	describe('basic processing', () => {
		it('should process a single enqueued node', async () => {
			const processed: string[] = []
			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockImplementation(async node => {
				processed.push(node.attrs.id!)
			})

			const processor = createProcessor(new Map([['message', handler]]))
			processor.enqueue('message', makeNode('msg-1'))

			// wait for microtask queue to flush
			await new Promise(r => setTimeout(r, 10))
			expect(processed).toEqual(['msg-1'])
			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should process multiple nodes in FIFO order', async () => {
			const processed: string[] = []
			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockImplementation(async node => {
				processed.push(node.attrs.id!)
			})

			const processor = createProcessor(new Map([['message', handler]]))
			processor.enqueue('message', makeNode('msg-1'))
			processor.enqueue('message', makeNode('msg-2'))
			processor.enqueue('message', makeNode('msg-3'))

			await new Promise(r => setTimeout(r, 10))
			expect(processed).toEqual(['msg-1', 'msg-2', 'msg-3'])
		})

		it('should dispatch nodes to correct handler by type', async () => {
			const messageIds: string[] = []
			const callIds: string[] = []
			const receiptIds: string[] = []
			const notificationIds: string[] = []

			const handlers = new Map<MessageType, (node: BinaryNode) => Promise<void>>([
				[
					'message',
					async n => {
						messageIds.push(n.attrs.id!)
					}
				],
				[
					'call',
					async n => {
						callIds.push(n.attrs.id!)
					}
				],
				[
					'receipt',
					async n => {
						receiptIds.push(n.attrs.id!)
					}
				],
				[
					'notification',
					async n => {
						notificationIds.push(n.attrs.id!)
					}
				]
			])

			const processor = createProcessor(handlers)
			processor.enqueue('message', makeNode('msg-1'))
			processor.enqueue('call', makeNode('call-1', 'call'))
			processor.enqueue('receipt', makeNode('rcpt-1', 'receipt'))
			processor.enqueue('notification', makeNode('notif-1', 'notification'))

			await new Promise(r => setTimeout(r, 10))
			expect(messageIds).toEqual(['msg-1'])
			expect(callIds).toEqual(['call-1'])
			expect(receiptIds).toEqual(['rcpt-1'])
			expect(notificationIds).toEqual(['notif-1'])
		})
	})

	describe('error resilience', () => {
		it('should continue processing after a handler throws', async () => {
			const processed: string[] = []
			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockImplementation(async node => {
				if (node.attrs.id === 'msg-2') {
					throw new Error('handler crash')
				}

				processed.push(node.attrs.id!)
			})

			const processor = createProcessor(new Map([['message', handler]]))
			processor.enqueue('message', makeNode('msg-1'))
			processor.enqueue('message', makeNode('msg-2'))
			processor.enqueue('message', makeNode('msg-3'))

			await new Promise(r => setTimeout(r, 10))
			// msg-1 and msg-3 should be processed, msg-2 error should be caught
			expect(processed).toEqual(['msg-1', 'msg-3'])
			expect(mockOnUnexpectedError).toHaveBeenCalledTimes(1)
			expect(mockOnUnexpectedError).toHaveBeenCalledWith(expect.any(Error), 'processing offline message')
		})

		it('should continue processing after multiple handler errors', async () => {
			const processed: string[] = []
			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockImplementation(async node => {
				if (node.attrs.id === 'msg-1' || node.attrs.id === 'msg-3') {
					throw new Error('crash')
				}

				processed.push(node.attrs.id!)
			})

			const processor = createProcessor(new Map([['message', handler]]))
			for (let i = 1; i <= 5; i++) {
				processor.enqueue('message', makeNode(`msg-${i}`))
			}

			await new Promise(r => setTimeout(r, 10))
			expect(processed).toEqual(['msg-2', 'msg-4', 'msg-5'])
			expect(mockOnUnexpectedError).toHaveBeenCalledTimes(2)
		})

		it('should report unknown node type and continue', async () => {
			const processed: string[] = []
			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockImplementation(async node => {
				processed.push(node.attrs.id!)
			})

			const processor = createProcessor(new Map([['message', handler]]))
			// Enqueue an unknown type
			processor.enqueue('unknown-type' as MessageType, makeNode('unknown-1'))
			processor.enqueue('message', makeNode('msg-1'))

			await new Promise(r => setTimeout(r, 10))
			expect(processed).toEqual(['msg-1'])
			expect(mockOnUnexpectedError).toHaveBeenCalledWith(
				expect.objectContaining({ message: expect.stringContaining('unknown offline node type') }),
				'processing offline node'
			)
		})
	})

	describe('connection awareness', () => {
		it('should stop processing when connection closes', async () => {
			const processed: string[] = []
			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockImplementation(async node => {
				processed.push(node.attrs.id!)
				if (node.attrs.id === 'msg-2') {
					isWsOpen = false
				}
			})

			const processor = createProcessor(new Map([['message', handler]]))
			for (let i = 1; i <= 5; i++) {
				processor.enqueue('message', makeNode(`msg-${i}`))
			}

			await new Promise(r => setTimeout(r, 10))
			// Should stop after msg-2 closes the connection
			expect(processed).toEqual(['msg-1', 'msg-2'])
		})

		it('should resume processing when new nodes are enqueued after connection reopens', async () => {
			const processed: string[] = []
			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockImplementation(async node => {
				processed.push(node.attrs.id!)
			})

			// Start with closed connection
			isWsOpen = false
			const processor = createProcessor(new Map([['message', handler]]))
			processor.enqueue('message', makeNode('msg-1'))

			await new Promise(r => setTimeout(r, 10))
			expect(processed).toEqual([])

			// Reopen connection and enqueue new node
			isWsOpen = true
			processor.enqueue('message', makeNode('msg-2'))

			await new Promise(r => setTimeout(r, 10))
			// Both nodes should now be processed (msg-1 was still in queue)
			expect(processed).toEqual(['msg-1', 'msg-2'])
		})
	})

	describe('batch yielding', () => {
		it('should yield to event loop after batchSize nodes', async () => {
			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockResolvedValue(undefined)
			const batchSize = 3
			const processor = createProcessor(new Map([['message', handler]]), batchSize)

			for (let i = 1; i <= 7; i++) {
				processor.enqueue('message', makeNode(`msg-${i}`))
			}

			await new Promise(r => setTimeout(r, 10))
			expect(handler).toHaveBeenCalledTimes(7)
			// 7 nodes with batchSize 3 => yields after 3rd and 6th = 2 yields
			expect(yieldCalls).toBe(2)
		})

		it('should NOT yield for fewer nodes than batchSize', async () => {
			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockResolvedValue(undefined)
			const processor = createProcessor(new Map([['message', handler]]), 10)

			for (let i = 1; i <= 5; i++) {
				processor.enqueue('message', makeNode(`msg-${i}`))
			}

			await new Promise(r => setTimeout(r, 10))
			expect(handler).toHaveBeenCalledTimes(5)
			expect(yieldCalls).toBe(0)
		})

		it('should yield exactly at batchSize boundary', async () => {
			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockResolvedValue(undefined)
			const processor = createProcessor(new Map([['message', handler]]), 3)

			for (let i = 1; i <= 3; i++) {
				processor.enqueue('message', makeNode(`msg-${i}`))
			}

			await new Promise(r => setTimeout(r, 10))
			expect(handler).toHaveBeenCalledTimes(3)
			expect(yieldCalls).toBe(1)
		})
	})

	describe('isProcessing guard', () => {
		it('should not start a second processing loop for concurrent enqueues', async () => {
			let resolveFirst: (() => void) | undefined
			const firstPromise = new Promise<void>(r => {
				resolveFirst = r
			})
			let callCount = 0

			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockImplementation(async () => {
				callCount++
				if (callCount === 1) {
					// Block on first node to simulate slow processing
					await firstPromise
				}
			})

			const processor = createProcessor(new Map([['message', handler]]))
			processor.enqueue('message', makeNode('msg-1'))

			// Give time for first processing to start
			await new Promise(r => setTimeout(r, 5))

			// Enqueue while first is still processing
			processor.enqueue('message', makeNode('msg-2'))
			processor.enqueue('message', makeNode('msg-3'))

			// Release the first handler
			resolveFirst!()

			await new Promise(r => setTimeout(r, 10))
			expect(handler).toHaveBeenCalledTimes(3)
		})
	})

	describe('mixed error types', () => {
		it('should handle both handler errors and unknown types in sequence', async () => {
			const processed: string[] = []
			const handler = jest.fn<(node: BinaryNode) => Promise<void>>().mockImplementation(async node => {
				if (node.attrs.id === 'msg-2') {
					throw new Error('boom')
				}

				processed.push(node.attrs.id!)
			})

			const processor = createProcessor(new Map([['message', handler]]))
			processor.enqueue('message', makeNode('msg-1'))
			processor.enqueue('message', makeNode('msg-2')) // will throw
			processor.enqueue('bogus' as MessageType, makeNode('x')) // unknown type
			processor.enqueue('message', makeNode('msg-3'))

			await new Promise(r => setTimeout(r, 10))
			expect(processed).toEqual(['msg-1', 'msg-3'])
			expect(mockOnUnexpectedError).toHaveBeenCalledTimes(2)
		})
	})
})
