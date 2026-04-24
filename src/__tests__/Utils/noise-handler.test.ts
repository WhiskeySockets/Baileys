import { jest } from '@jest/globals'
import { NOISE_WA_HEADER } from '../../Defaults'
import { Curve } from '../../Utils/crypto'
import { makeNoiseHandler } from '../../Utils/noise-handler'
import type { BinaryNode } from '../../WABinary/types'

// Create a mock logger
const createMockLogger = () => ({
	child: jest.fn().mockReturnThis(),
	trace: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
	fatal: jest.fn(),
	level: 'trace'
})

// Helper to create a frame with length prefix
const createFrame = (payload: Buffer) => {
	const frame = Buffer.alloc(3 + payload.length)
	frame.writeUInt8(payload.length >> 16, 0)
	frame.writeUInt16BE(payload.length & 0xffff, 1)
	payload.copy(frame, 3)
	return frame
}

describe('Noise Handler', () => {
	describe('decodeFrame with multiple frames in buffer', () => {
		it('should process multiple unencrypted frames in single buffer', async () => {
			const keyPair = Curve.generateKeyPair()
			const logger = createMockLogger()

			const handler = makeNoiseHandler({
				keyPair,
				NOISE_HEADER: NOISE_WA_HEADER,
				logger: logger as any
			})

			const payload1 = Buffer.from([1, 2, 3, 4, 5])
			const payload2 = Buffer.from([6, 7, 8, 9, 10])

			const frame1 = createFrame(payload1)
			const frame2 = createFrame(payload2)

			const combinedBuffer = Buffer.concat([frame1, frame2])

			const receivedFrames: Buffer[] = []
			const onFrame = (frame: Uint8Array | BinaryNode) => {
				receivedFrames.push(Buffer.from(frame as Uint8Array))
			}

			await handler.decodeFrame(combinedBuffer, onFrame)

			expect(receivedFrames).toHaveLength(2)
			expect(receivedFrames[0]).toEqual(payload1)
			expect(receivedFrames[1]).toEqual(payload2)
		})

		it('should handle frames split across multiple decodeFrame calls', async () => {
			const keyPair = Curve.generateKeyPair()
			const logger = createMockLogger()

			const handler = makeNoiseHandler({
				keyPair,
				NOISE_HEADER: NOISE_WA_HEADER,
				logger: logger as any
			})

			const payload = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
			const frame = createFrame(payload)

			const receivedFrames: Buffer[] = []
			const onFrame = (frame: Uint8Array | BinaryNode) => {
				receivedFrames.push(Buffer.from(frame as Uint8Array))
			}

			// Split the frame across two calls
			const part1 = frame.slice(0, 5)
			const part2 = frame.slice(5)

			await handler.decodeFrame(part1, onFrame)
			expect(receivedFrames).toHaveLength(0)

			await handler.decodeFrame(part2, onFrame)
			expect(receivedFrames).toHaveLength(1)
			expect(receivedFrames[0]).toEqual(payload)
		})

		it('should correctly process frames when callback triggers async operations', async () => {
			const keyPair = Curve.generateKeyPair()
			const logger = createMockLogger()

			const handler = makeNoiseHandler({
				keyPair,
				NOISE_HEADER: NOISE_WA_HEADER,
				logger: logger as any
			})

			const payload1 = Buffer.from([1, 2, 3])
			const payload2 = Buffer.from([4, 5, 6])

			const combinedBuffer = Buffer.concat([createFrame(payload1), createFrame(payload2)])

			const receivedFrames: Buffer[] = []
			const callbackOrder: number[] = []

			const onFrame = (frame: Uint8Array | BinaryNode) => {
				const frameNum = receivedFrames.length + 1
				callbackOrder.push(frameNum)
				receivedFrames.push(Buffer.from(frame as Uint8Array))
			}

			await handler.decodeFrame(combinedBuffer, onFrame)

			expect(receivedFrames).toHaveLength(2)
			expect(callbackOrder).toEqual([1, 2])
			expect(receivedFrames[0]).toEqual(payload1)
			expect(receivedFrames[1]).toEqual(payload2)
		})
	})

	describe('encrypted frame handling', () => {
		it('should encrypt and verify frame structure', async () => {
			const keyPair = Curve.generateKeyPair()
			const logger = createMockLogger()

			const handler = makeNoiseHandler({
				keyPair,
				NOISE_HEADER: NOISE_WA_HEADER,
				logger: logger as any
			})

			await handler.finishInit()

			const payload = Buffer.from('test payload')
			const encoded = handler.encodeFrame(payload)

			expect(encoded.length).toBeGreaterThan(payload.length + 3)

			const encoded2 = handler.encodeFrame(Buffer.from('second payload'))
			expect(encoded2.slice(0, 3)).toEqual(Buffer.from([0, 0, encoded2.length - 3]))
		})

		it('should produce different ciphertext for same plaintext due to counter', async () => {
			const keyPair = Curve.generateKeyPair()
			const logger = createMockLogger()

			const handler = makeNoiseHandler({
				keyPair,
				NOISE_HEADER: NOISE_WA_HEADER,
				logger: logger as any
			})

			await handler.finishInit()

			const payload = Buffer.from('same payload')

			const encrypted1 = handler.encrypt(payload)
			const encrypted2 = handler.encrypt(payload)
			const encrypted3 = handler.encrypt(payload)

			expect(encrypted1).not.toEqual(encrypted2)
			expect(encrypted2).not.toEqual(encrypted3)
			expect(encrypted1).not.toEqual(encrypted3)
		})
	})

	describe('race condition scenario - concurrent decodeFrame calls', () => {
		it('should handle concurrent decodeFrame calls without corrupting inBytes buffer', async () => {
			const keyPair = Curve.generateKeyPair()
			const logger = createMockLogger()

			const handler = makeNoiseHandler({
				keyPair,
				NOISE_HEADER: NOISE_WA_HEADER,
				logger: logger as any
			})

			// Create multiple frames
			const payloads = Array.from({ length: 5 }, (_, i) => Buffer.from(`payload-${i}`))
			const frames = payloads.map(createFrame)

			const receivedFrames: Buffer[] = []
			const onFrame = (frame: Uint8Array | BinaryNode) => {
				receivedFrames.push(Buffer.from(frame as Uint8Array))
			}

			// Simulate concurrent calls (multiple WebSocket messages arriving rapidly)
			// This tests the shared inBytes buffer handling
			await Promise.all(frames.map(frame => handler.decodeFrame(frame, onFrame)))

			// All frames should be received
			expect(receivedFrames).toHaveLength(5)

			// Verify all payloads are present (order may vary due to concurrency)
			const receivedPayloads = receivedFrames.map(f => f.toString())
			payloads.forEach(p => {
				expect(receivedPayloads).toContain(p.toString())
			})
		})

		it('should maintain counter integrity with many frames in single buffer', async () => {
			const keyPair = Curve.generateKeyPair()
			const logger = createMockLogger()

			const handler = makeNoiseHandler({
				keyPair,
				NOISE_HEADER: NOISE_WA_HEADER,
				logger: logger as any
			})

			// Create 10 frames to stress test the while loop
			const payloads = Array.from({ length: 10 }, (_, i) => Buffer.from(`frame-${i}-payload-data`))

			const combinedBuffer = Buffer.concat(payloads.map(createFrame))

			const receivedFrames: Buffer[] = []
			const onFrame = (frame: Uint8Array | BinaryNode) => {
				receivedFrames.push(Buffer.from(frame as Uint8Array))
			}

			await handler.decodeFrame(combinedBuffer, onFrame)

			expect(receivedFrames).toHaveLength(10)
			payloads.forEach((payload, i) => {
				expect(receivedFrames[i]).toEqual(payload)
			})
		})
	})

	describe('encrypted frame race condition', () => {
		it('should produce different ciphertext for same plaintext due to counter', async () => {
			// Verify that encryption uses incrementing counters

			const keyPair = Curve.generateKeyPair()
			const logger = createMockLogger()

			const handler = makeNoiseHandler({
				keyPair,
				NOISE_HEADER: NOISE_WA_HEADER,
				logger: logger as any
			})

			await handler.finishInit()

			const payload1 = Buffer.from('message-1')
			const payload2 = Buffer.from('message-2')

			const encrypted1 = handler.encrypt(payload1)
			const encrypted2 = handler.encrypt(payload2)

			expect(encrypted1.length).toBe(payload1.length + 16) // +16 for GCM tag
			expect(encrypted2.length).toBe(payload2.length + 16)

			// The encrypted data should be different (different counters used)
			expect(encrypted1).not.toEqual(encrypted2)
		})

		it('should serialize concurrent decodeFrame calls (fix for race condition)', async () => {
			// This test verifies that the lock mechanism correctly serializes
			// concurrent decodeFrame calls, preventing race conditions

			const keyPair = Curve.generateKeyPair()
			const logger = createMockLogger()

			const handler = makeNoiseHandler({
				keyPair,
				NOISE_HEADER: NOISE_WA_HEADER,
				logger: logger as any
			})

			const payload1 = Buffer.from('first')
			const payload2 = Buffer.from('second')
			const payload3 = Buffer.from('third')

			const frame1 = createFrame(payload1)
			const frame2 = createFrame(payload2)
			const frame3 = createFrame(payload3)

			const receivedOrder: string[] = []

			const onFrame = (frame: Uint8Array | BinaryNode) => {
				const content = Buffer.from(frame as Uint8Array).toString()
				receivedOrder.push(content)
			}

			// Start all three decodeFrame calls "simultaneously"
			// With the lock fix, they should be processed in order
			const p1 = handler.decodeFrame(frame1, onFrame)
			const p2 = handler.decodeFrame(frame2, onFrame)
			const p3 = handler.decodeFrame(frame3, onFrame)

			await Promise.all([p1, p2, p3])

			// With serialization, frames should be received in the order
			// the decodeFrame calls were made
			expect(receivedOrder).toHaveLength(3)
			expect(receivedOrder[0]).toBe('first')
			expect(receivedOrder[1]).toBe('second')
			expect(receivedOrder[2]).toBe('third')
		})

		it('should maintain frame order with interleaved partial frames after fix', async () => {
			// This test verifies that partial frames from different sources
			// are correctly reassembled when calls are serialized

			const keyPair = Curve.generateKeyPair()
			const logger = createMockLogger()

			const handler = makeNoiseHandler({
				keyPair,
				NOISE_HEADER: NOISE_WA_HEADER,
				logger: logger as any
			})

			// Create a single frame split into parts
			const payload = Buffer.from('complete-message-content')
			const frame = createFrame(payload)

			const part1 = frame.slice(0, 10)
			const part2 = frame.slice(10)

			const receivedFrames: Buffer[] = []
			const onFrame = (frame: Uint8Array | BinaryNode) => {
				receivedFrames.push(Buffer.from(frame as Uint8Array))
			}

			// With serialization, these should be processed in order
			// and the frame should be correctly reassembled
			await handler.decodeFrame(part1, onFrame)
			expect(receivedFrames).toHaveLength(0) // Not complete yet

			await handler.decodeFrame(part2, onFrame)
			expect(receivedFrames).toHaveLength(1)
			expect(receivedFrames[0]).toEqual(payload)
		})
	})
})
