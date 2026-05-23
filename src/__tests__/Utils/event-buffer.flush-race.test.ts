/**
 * M6 — Event buffer flush race: `flush()` emits before swapping `data`.
 *
 * `flush()` at `event-buffer.ts:153,156` does:
 *     ev.emit('event', consolidatedData)  // line 153, SYNCHRONOUS
 *     data = newData                       // line 156
 *
 * EventEmitter listeners run synchronously inside `emit`. The
 * `process()`-registered listener is `async (map) => await handler(map)` — the
 * synchronous prefix of `handler(map)` runs before any awaits yield. If that
 * prefix calls `ev.buffer()` then `ev.emit(...)`, the re-entrant emit lands in
 * `append(data, ...)` against the OLD `data` reference, which line 156
 * immediately overwrites. Silent lost-event window.
 *
 * Desired behavior: `data = newData` BEFORE the synchronous `emit`. Re-entrant
 * events from listeners land in the new buffer and survive the next flush.
 *
 * Failing while M6 is unresolved. Flipped to `it(...)` in Stage 7.
 */
import type { BaileysEventMap } from '../../Types'
import { makeEventBuffer } from '../../Utils/event-buffer'
import type { ILogger } from '../../Utils/logger'

const silentLogger = (): ILogger =>
	({
		level: 'silent',
		child: () => silentLogger(),
		trace: () => {},
		debug: () => {},
		info: () => {},
		warn: () => {},
		error: () => {},
		fatal: () => {}
	}) as unknown as ILogger

describe('event-buffer — re-entrant flush race (M6)', () => {
	it.failing('re-entrant events emitted from a listener during flush survive the next flush', async () => {
		const ev = makeEventBuffer(silentLogger())
		const observed: string[] = []
		let reentered = false

		ev.process(async data => {
			const upserts = (data as BaileysEventMap)['chats.upsert']
			if (upserts) {
				for (const c of upserts) if (c.id) observed.push(c.id)
			}

			// Re-enter ONCE: while flushing the initial event, schedule another.
			if (!reentered) {
				reentered = true
				ev.buffer()
				ev.emit('chats.upsert', [{ id: 'reentrant@s.whatsapp.net', conversationTimestamp: 0, unreadCount: 0 } as any])
			}
		})

		ev.buffer()
		ev.emit('chats.upsert', [{ id: 'initial@s.whatsapp.net', conversationTimestamp: 0, unreadCount: 0 } as any])
		ev.flush()

		// Let the first listener delivery settle.
		await new Promise(r => setTimeout(r, 30))

		// Drain whatever the listener buffered re-entrantly.
		ev.flush()
		await new Promise(r => setTimeout(r, 30))

		expect(observed).toEqual(['initial@s.whatsapp.net', 'reentrant@s.whatsapp.net'])
	})

	it.todo(
		'createBufferedFunction does not race on nested invocations sharing bufferCount — Stage 7 replaces the ad-hoc counter with a LockManager-backed serialization; the race window depends on cross-microtask scheduling that the synthetic harness here cannot reliably reproduce'
	)
})
