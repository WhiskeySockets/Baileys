/**
 * M9 — `query()` swallows timeouts as `undefined`.
 *
 * `socket.ts:167-228` — `waitForMessage` returns `undefined` on timeout (line
 * 194-198). `query` then does
 *   `if (result && 'tag' in result) assertNodeErrorFree(result)`
 * so callers that don't truthy-check dereference `undefined` and TypeError
 * instead of getting a clean typed timeout error.
 *
 * Desired behavior: `waitForMessage` throws a typed `QueryTimeoutError`;
 * `query` propagates it. Callers can `catch` with type narrowing.
 *
 * Failing while M9 is unresolved. Flipped to `it(...)` in Stage 8.
 *
 * The test extracts the timeout-shaped primitive that `waitForMessage` uses
 * (`Promise.race` between the wait promise and a setTimeout-driven `resolve`
 * with `undefined`) and asserts the *replacement* contract — throws instead of
 * resolves-undefined.
 */

/** A behavioral stand-in for `waitForMessage` exposing the current contract. */
const waitForMessageToday = <T>(work: Promise<T>, timeoutMs: number): Promise<T | undefined> =>
	Promise.race([work, new Promise<undefined>(resolve => setTimeout(() => resolve(undefined), timeoutMs))])

describe('socket query — timeout behavior (M9)', () => {
	it.failing('a timed-out query throws a typed timeout error rather than resolving undefined', async () => {
		// Caller writes the natural `await query(...)` without a truthy guard.
		const result = await waitForMessageToday(new Promise(() => {}), 25)

		// Today: result is undefined. Desired: the underlying primitive throws,
		// and assertions like `result.tag` on the consumer side wouldn't TypeError.
		expect(result).toBeDefined()
	})

	it.todo(
		'duplicate responses to the same tag do not silently drop later responses — Stage 8 introduces a Map<tag, Promise> with a structured warning on duplicates; covered by the real `query()` integration test added in Stage 8 once the in-flight map exists'
	)
})
