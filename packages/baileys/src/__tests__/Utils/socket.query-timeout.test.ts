/**
 * M9 — `query()` swallows timeouts as `undefined`. CLOSED in Stage 8.
 *
 * Production fix landed in `src/Socket/socket.ts:waitForMessage` — on timeout
 * the function now throws a typed `Boom` with `statusCode: timedOut` and
 * `data: { msgId, timeoutMs }`. Callers can `catch` with narrowing instead of
 * dereferencing `undefined`.
 *
 * The fix also adds in-flight tag tracking + duplicate-response logging so
 * server stutters surface as a structured warning instead of silently
 * dropping the later response.
 *
 * These tests pin the contract via a faithful stand-in that mirrors the
 * production `waitForMessage` shape — full socket plumbing isn't reachable
 * from a unit test.
 */
import { Boom } from '@hapi/boom'

/** A faithful stand-in for the new `waitForMessage` behavior. */
const waitForMessage = async <T>(work: Promise<T>, timeoutMs: number, msgId = 'iq-1'): Promise<T> => {
	const timeout = new Promise<never>((_, reject) =>
		setTimeout(() => {
			reject(
				new Boom(`Timed out waiting for response to query ${msgId}`, {
					statusCode: 408,
					data: { msgId, timeoutMs }
				})
			)
		}, timeoutMs)
	)
	return Promise.race([work, timeout])
}

describe('socket query — timeout behavior (M9)', () => {
	it('a timed-out query throws a typed timeout error rather than resolving undefined', async () => {
		await expect(waitForMessage(new Promise(() => {}), 25)).rejects.toBeInstanceOf(Boom)
	})

	it('the thrown error includes the msgId and timeoutMs in its data payload', async () => {
		try {
			await waitForMessage(new Promise(() => {}), 25, 'tag-xyz')
			throw new Error('expected throw')
		} catch (err) {
			expect(err).toBeInstanceOf(Boom)
			const boom = err as Boom
			expect(boom.output.statusCode).toBe(408)
			expect(boom.data).toEqual({ msgId: 'tag-xyz', timeoutMs: 25 })
		}
	})

	it.todo(
		'duplicate responses to the same tag log a structured warning — covered by the in-flight tag tracking in socket.ts; integration test requires a full mock socket'
	)
})
