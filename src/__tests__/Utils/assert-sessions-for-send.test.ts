import { Boom } from '@hapi/boom'
import { DisconnectReason } from '../../Types'
import { assertSessionsSkippingRefused, isRefusedPrekeyFetch } from '../../Utils/assert-sessions-for-send'
import type { ILogger } from '../../Utils/logger'

const logger = {
	level: 'silent',
	child: () => logger,
	trace: () => {},
	debug: () => {},
	info: () => {},
	warn: () => {},
	error: () => {}
} as unknown as ILogger

// What the server's error node becomes: assertNodeErrorFree throws Boom(text, { data: code })
const notAcceptable = () => new Boom('not-acceptable', { data: 406 })

/** A fake assertSessions whose batch query fails if it contains any refused device. */
const fakeAssertSessions = (refusedDevices: string[]) => {
	const calls: string[][] = []
	const assertSessions = async (jids: string[]) => {
		calls.push(jids)
		if (jids.some(jid => refusedDevices.includes(jid))) {
			throw notAcceptable()
		}

		return true
	}

	return { assertSessions, calls }
}

describe('isRefusedPrekeyFetch', () => {
	it('treats a 406 or 404 error node as a refusal', () => {
		expect(isRefusedPrekeyFetch(notAcceptable())).toBe(true)
		expect(isRefusedPrekeyFetch(new Boom('item-not-found', { data: 404 }))).toBe(true)
	})

	it('does not treat rate limiting, server errors or a codeless error node as a refusal', () => {
		expect(isRefusedPrekeyFetch(new Boom('rate-overlimit', { data: 429 }))).toBe(false)
		expect(isRefusedPrekeyFetch(new Boom('internal-server-error', { data: 500 }))).toBe(false)
		expect(isRefusedPrekeyFetch(new Boom('Unknown error', { data: Number(undefined) }))).toBe(false)
	})

	it('does not treat a closed connection, a timeout or a plain error as a refusal', () => {
		expect(isRefusedPrekeyFetch(new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed }))).toBe(
			false
		)
		expect(isRefusedPrekeyFetch(new Boom('Timed Out', { statusCode: DisconnectReason.timedOut }))).toBe(false)
		expect(isRefusedPrekeyFetch(new Error('boom'))).toBe(false)
	})
})

describe('assertSessionsSkippingRefused', () => {
	it('makes one query and refuses nothing when the batch succeeds', async () => {
		const { assertSessions, calls } = fakeAssertSessions([])
		const refused = await assertSessionsSkippingRefused(assertSessions, ['a:0', 'a:46', 'a:47'], logger)
		expect(refused).toEqual([])
		expect(calls).toEqual([['a:0', 'a:46', 'a:47']])
	})

	it('returns the one device WhatsApp refused, so the send can go to the rest', async () => {
		const { assertSessions } = fakeAssertSessions(['a:45'])
		const refused = await assertSessionsSkippingRefused(assertSessions, ['a:0', 'a:45', 'a:46', 'a:47'], logger)
		expect(refused).toEqual(['a:45'])
	})

	it('refuses a lone device without throwing', async () => {
		const { assertSessions } = fakeAssertSessions(['a:45'])
		await expect(assertSessionsSkippingRefused(assertSessions, ['a:45'], logger)).resolves.toEqual(['a:45'])
	})

	it('isolates several refused devices in a large batch with far fewer queries than one per device', async () => {
		const jids = Array.from({ length: 64 }, (_, i) => `g${i}:1`)
		const { assertSessions, calls } = fakeAssertSessions(['g7:1', 'g40:1'])
		const refused = await assertSessionsSkippingRefused(assertSessions, jids, logger)
		expect(refused.sort()).toEqual(['g40:1', 'g7:1'])
		expect(calls.length).toBeLessThan(jids.length / 2)
	})

	it('deduplicates devices before querying', async () => {
		const { assertSessions, calls } = fakeAssertSessions([])
		await assertSessionsSkippingRefused(assertSessions, ['a:0', 'a:0'], logger)
		expect(calls).toEqual([['a:0']])
	})

	it('rethrows rate limiting instead of bisecting against a throttling server', async () => {
		const throttled = new Boom('rate-overlimit', { data: 429 })
		let calls = 0
		const assertSessions = async () => {
			calls++
			throw throttled
		}

		await expect(assertSessionsSkippingRefused(assertSessions, ['a:0', 'a:45', 'a:46'], logger)).rejects.toBe(throttled)
		expect(calls).toBe(1)
	})

	it('rethrows an error that is not a refusal', async () => {
		const closed = new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed })
		const assertSessions = async () => {
			throw closed
		}

		await expect(assertSessionsSkippingRefused(assertSessions, ['a:0', 'a:45'], logger)).rejects.toBe(closed)
	})
})
