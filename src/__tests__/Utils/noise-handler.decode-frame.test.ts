/**
 * M10 — Noise frame decoding is not serialized despite tests claiming it is.
 *
 * `decodeFrame()` mutates shared `inBytes` and calls async `processData()`
 * without a mutex (noise-handler.ts:73, 252). The bug is latent: today's
 * synchronous code paths inside `processData` never yield mid-loop. It
 * manifests once `processData` awaits (e.g. transport-mode
 * `await decodeBinaryNode(result)`) — a second `decodeFrame` call can mutate
 * `inBytes` before the first finishes draining.
 *
 * Also: `TransportState.encrypt` reuses a single `Uint8Array` for `iv` across
 * calls (lines 24, 38). Safe only because `aesEncryptGCM` is synchronous —
 * the invariant is implicit and brittle.
 *
 * Both fixes land in Stage 7. The tests below pin the desired invariants and
 * are marked `it.todo` because the failure modes are hard to reproduce on the
 * current synchronous code paths without intrusive module-level mocking;
 * Stage 7 ships behavioral tests alongside the mutex + per-call-IV fix.
 */

describe('Noise — decodeFrame serialization & IV allocation (M10)', () => {
	it.todo(
		'decodeFrame serializes concurrent invocations even when processData yields (Stage 7 adds a Mutex around the inBytes mutation + processData call)'
	)

	it.todo('TransportState.encrypt allocates a fresh IV per call instead of mutating a shared buffer (Stage 7 fix)')
})
