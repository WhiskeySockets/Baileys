import { Boom } from '@hapi/boom'
import type { ILogger } from './logger'

/**
 * Error-node codes on the prekey query that mean "no keys for this device":
 * 406 `not-acceptable` has been seen for a linked device removed moments
 * earlier and still in the cached device list; 404 for a device that is gone.
 */
const DEVICE_REFUSAL_CODES = new Set([404, 406])

/**
 * Whether a failed prekey query was WhatsApp refusing keys for (some of) the
 * requested devices. The server answers the whole `encrypt` iq with an error
 * node, and `parseAndInjectE2ESessions` throws on any per-user error node;
 * `assertNodeErrorFree` turns both into a Boom with the code in `data`. Other
 * codes (429 rate limiting, 5xx) and connection errors are not refusals and must
 * reach the caller. A query timeout never gets here: `query` resolves undefined.
 */
export const isRefusedPrekeyFetch = (err: unknown): boolean =>
	err instanceof Boom && typeof err.data === 'number' && DEVICE_REFUSAL_CODES.has(err.data)

/**
 * Asserts sessions for the devices a message is about to be encrypted for, and
 * returns the devices whose prekeys WhatsApp refused, instead of failing the
 * whole send because of them.
 *
 * `assertSessions` fetches every device without a session in one query, so a
 * single unreachable device (typically a just-removed companion) aborted the
 * send for every device of every recipient. On a refusal the batch is halved
 * until the refused devices are isolated: O(k log n) queries for k refused
 * devices among n. Devices that already have a session cost no query
 * (`assertSessions` skips them). Any other error is rethrown unchanged.
 */
export const assertSessionsSkippingRefused = async (
	assertSessions: (jids: string[]) => Promise<boolean>,
	jids: string[],
	logger: ILogger
): Promise<string[]> => {
	const refused: string[] = []

	const attempt = async (batch: string[]): Promise<void> => {
		try {
			await assertSessions(batch)
		} catch (err) {
			if (!isRefusedPrekeyFetch(err)) {
				throw err
			}

			if (batch.length === 1) {
				refused.push(batch[0]!)
				logger.warn({ jid: batch[0], err }, 'prekey fetch refused for device, sending to the others')
				return
			}

			const mid = Math.ceil(batch.length / 2)
			await attempt(batch.slice(0, mid))
			await attempt(batch.slice(mid))
		}
	}

	const unique = [...new Set(jids)]
	if (unique.length) {
		await attempt(unique)
	}

	return refused
}
