import { MIN_PREKEY_COUNT } from '../Defaults'
import { type BinaryNode, getBinaryNodeChild, S_WHATSAPP_NET } from '../WABinary'
import type { ILogger } from './logger'

export type ServerEncryptNotificationResult =
	| { action: 'in_flight' }
	| { action: 'prekey_count'; count: number; uploaded: boolean }
	| { action: 'digest_ok' }
	| { action: 'digest_missing_uploaded' }
	| { action: 'digest_failed'; code?: number }
	| { action: 'pq_count_ignored' }
	| { action: 'unknown' }

export type ServerEncryptNotificationContext = {
	query: (node: BinaryNode) => Promise<unknown>
	uploadPreKeys: () => Promise<void>
	inFlightPreKeyLow: Set<string>
	logger: ILogger
}

/**
 * Handles `<notification type="encrypt" from="s.whatsapp.net">`.
 *
 * The server sends three variants, mirroring WA Web:
 * - `<count>`: our pre-key count is low; upload more (WAWebHandlePreKeyLow).
 * - `<pq_count>`: post-quantum (Kyber) pre-key count; WA Web only acks it unless
 *   PQ upload is enabled, which Baileys does not support.
 * - `<digest>`: the server asks us to validate our key bundle (WAWebHandleDigestKey /
 *   WAWebDigestKeyJob): an `encrypt` iq with `<digest/>`; if the server has no record
 *   for us (404) the pre-keys are uploaded again. Other errors are only logged.
 *
 * Previously only `<count>` was handled and the other two crashed on `countChild.attrs`.
 */
export async function handleServerEncryptNotification(
	node: BinaryNode,
	ctx: ServerEncryptNotificationContext
): Promise<ServerEncryptNotificationResult> {
	const { query, uploadPreKeys, inFlightPreKeyLow, logger } = ctx
	const stanzaId = node.attrs.id
	if (stanzaId && inFlightPreKeyLow.has(stanzaId)) {
		return { action: 'in_flight' }
	}

	const countChild = getBinaryNodeChild(node, 'count')
	if (countChild) {
		const count = +countChild.attrs.value!
		const shouldUploadMorePreKeys = count < MIN_PREKEY_COUNT
		logger.debug({ count, shouldUploadMorePreKeys }, 'recv pre-key count')
		if (shouldUploadMorePreKeys) {
			if (stanzaId) inFlightPreKeyLow.add(stanzaId)
			try {
				await uploadPreKeys()
			} finally {
				if (stanzaId) inFlightPreKeyLow.delete(stanzaId)
			}
		}

		return { action: 'prekey_count', count, uploaded: shouldUploadMorePreKeys }
	}

	if (getBinaryNodeChild(node, 'digest')) {
		try {
			await query({
				tag: 'iq',
				attrs: { xmlns: 'encrypt', type: 'get', to: S_WHATSAPP_NET },
				content: [{ tag: 'digest', attrs: {} }]
			})
			logger.debug('key bundle digest checked')
			return { action: 'digest_ok' }
		} catch (error) {
			const code = Number((error as { data?: unknown })?.data)
			if (code === 404) {
				logger.info('server has no key bundle for us (digest 404), uploading pre-keys')
				await uploadPreKeys()
				return { action: 'digest_missing_uploaded' }
			}

			logger.warn({ error, code }, 'failed to check key bundle digest')
			return { action: 'digest_failed', code: Number.isNaN(code) ? undefined : code }
		}
	}

	if (getBinaryNodeChild(node, 'pq_count')) {
		logger.debug('recv post-quantum pre-key count, ignoring')
		return { action: 'pq_count_ignored' }
	}

	logger.info({ node }, 'unknown server encrypt notification')
	return { action: 'unknown' }
}
