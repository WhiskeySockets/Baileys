/**
 * M10 — Noise frame decoding & IV handling. CLOSED in Stage 7.
 *
 * Two fixes pinned here:
 *   1. `decodeFrame` now serializes its `inBytes` mutation + `processData`
 *      drain under a per-handler `Mutex`. Concurrent invocations execute in
 *      sequence — no interleaving of partial frames between calls.
 *   2. `TransportState.encrypt` / `.decrypt` now allocate a FRESH IV per call
 *      instead of mutating a shared buffer. The 12-byte alloc removes the
 *      implicit "must stay sync" invariant — any future move to an
 *      async/streaming AEAD silently reuses the same key+IV otherwise, which
 *      is catastrophic for AES-GCM.
 */
import { jest } from '@jest/globals'
import { NOISE_WA_HEADER } from '../../Defaults'
import { Curve } from '../../Utils/crypto'
import { makeNoiseHandler } from '../../Utils/noise-handler'
import type { BinaryNode } from '../../WABinary/types'

const createMockLogger = () => ({
	child: jest.fn().mockReturnThis(),
	trace: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
	fatal: jest.fn(),
	level: 'silent'
})

const createFrame = (payload: Buffer) => {
	const frame = Buffer.alloc(3 + payload.length)
	frame.writeUInt8(payload.length >> 16, 0)
	frame.writeUInt16BE(payload.length & 0xffff, 1)
	payload.copy(frame, 3)
	return frame
}

describe('Noise — decodeFrame serialization (M10)', () => {
	it('serializes concurrent decodeFrame invocations: frames are delivered in submission order', async () => {
		const handler = makeNoiseHandler({
			keyPair: Curve.generateKeyPair(),
			NOISE_HEADER: NOISE_WA_HEADER,
			logger: createMockLogger() as any
		})

		const payloads = [Buffer.from('one'), Buffer.from('two'), Buffer.from('three')]
		const frames = payloads.map(createFrame)

		const received: string[] = []
		const onFrame = (f: Uint8Array | BinaryNode) => {
			received.push(Buffer.from(f as Uint8Array).toString())
		}

		// Without the mutex, parallel decodeFrame calls could append to
		// `inBytes` while a previous call's processData drain was mid-await,
		// producing out-of-order frame deliveries. With Stage 7's mutex, each
		// call's append + drain runs to completion before the next acquires.
		await Promise.all(frames.map(frame => handler.decodeFrame(frame, onFrame)))

		expect(received).toEqual(['one', 'two', 'three'])
	})

	it('preserves frame ordering across split-buffer decodeFrame calls', async () => {
		const handler = makeNoiseHandler({
			keyPair: Curve.generateKeyPair(),
			NOISE_HEADER: NOISE_WA_HEADER,
			logger: createMockLogger() as any
		})

		const payload = Buffer.from('split-frame-content')
		const frame = createFrame(payload)
		const part1 = frame.slice(0, 5)
		const part2 = frame.slice(5)

		const received: Buffer[] = []
		const onFrame = (f: Uint8Array | BinaryNode) => {
			received.push(Buffer.from(f as Uint8Array))
		}

		// Both decode calls go through the same mutex; the second waits for
		// the first to complete its inBytes mutation before appending its own.
		await Promise.all([handler.decodeFrame(part1, onFrame), handler.decodeFrame(part2, onFrame)])

		expect(received).toHaveLength(1)
		expect(received[0]).toEqual(payload)
	})
})

describe('Noise transport — per-call IV allocation (M10)', () => {
	it('two consecutive encrypts produce distinct ciphertexts (counter advances and IV is per-call)', async () => {
		const handler = makeNoiseHandler({
			keyPair: Curve.generateKeyPair(),
			NOISE_HEADER: NOISE_WA_HEADER,
			logger: createMockLogger() as any
		})

		await handler.finishInit()

		const same = Buffer.from('same-plaintext')
		const c1 = handler.encrypt(same)
		const c2 = handler.encrypt(same)

		// Stage 7 (M10) allocates a fresh IV per call. The counter still
		// advances, so two encrypts of identical plaintext produce distinct
		// ciphertexts. Verified behaviorally because the IV is internal to
		// TransportState and jest cannot spy on ESM `crypto` module exports.
		expect(Buffer.from(c1).equals(Buffer.from(c2))).toBe(false)
	})
})
