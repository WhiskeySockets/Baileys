import { createHmac } from 'crypto'
import type { SignalKeyStoreWithTransaction } from '../Types'
import type { BinaryNode } from '../WABinary'
import { getBinaryNodeChild, getBinaryNodeChildren, jidNormalizedUser } from '../WABinary'

/**
 * TC Token Modes — WA Web uses different AB props for Sender vs Receiver.
 * Sender mode: used when SENDING tokens (fire-and-forget after message send)
 * Receiver mode: used when RECEIVING/validating tokens (attaching to outgoing messages)
 *
 * WA Web AB props:
 *   - tcTokenSenderBucketSize / tcTokenReceiverBucketSize (default: 604800 = 7 days)
 *   - tcTokenSenderNumBuckets / tcTokenReceiverNumBuckets (default: 4)
 */
export type TcTokenMode = 'sender' | 'receiver'

// Default rolling bucket constants (matching WA Web defaults)
const TC_SENDER_BUCKET_SIZE = 604800 // 7 days in seconds
const TC_SENDER_NUM_BUCKETS = 4
const TC_RECEIVER_BUCKET_SIZE = 604800 // 7 days in seconds
const TC_RECEIVER_NUM_BUCKETS = 4

// LRU cache for cstoken to avoid recomputing HMAC on every message
// WA Web uses a cache of max 5 entries (var L=5 in WAWebSendMsgCreateFanoutStanza)
const CS_TOKEN_CACHE_MAX = 5
const csTokenCache = new Map<string, Uint8Array>()

type TcTokenParams = {
	jid: string
	authState: {
		keys: SignalKeyStoreWithTransaction
	}
}

type TcTokenData = {
	token: Buffer
	timestamp?: string
}

type StoreTcTokensParams = {
	node: BinaryNode
	keys: SignalKeyStoreWithTransaction
	onNewJidStored?: (jid: string) => void
}

/**
 * Get bucket size and num buckets for a given mode.
 */
function getBucketConfig(mode: TcTokenMode): { bucketSize: number; numBuckets: number } {
	if (mode === 'sender') {
		return { bucketSize: TC_SENDER_BUCKET_SIZE, numBuckets: TC_SENDER_NUM_BUCKETS }
	}

	return { bucketSize: TC_RECEIVER_BUCKET_SIZE, numBuckets: TC_RECEIVER_NUM_BUCKETS }
}

/**
 * Check if a TC token is expired using rolling bucket algorithm.
 * Tokens are valid for (numBuckets × bucketSize) seconds.
 *
 * @param timestamp - Token timestamp (unix seconds)
 * @param mode - 'sender' for re-issuance checks, 'receiver' for validation (default: 'receiver')
 */
export function isTcTokenExpired(timestamp: number | string | undefined, mode: TcTokenMode = 'receiver'): boolean {
	if (!timestamp) return true

	const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp
	if (!ts || ts <= 0) return true

	const { bucketSize, numBuckets } = getBucketConfig(mode)
	const now = Math.floor(Date.now() / 1000)
	const currentBucket = Math.floor(now / bucketSize)
	const cutoff = (currentBucket - (numBuckets - 1)) * bucketSize
	return ts < cutoff
}

/**
 * Determine if a new TC token should be re-issued.
 * Returns true when we cross a bucket boundary (sender mode), so we don't
 * spam the server with token re-issuance on every single message.
 */
export function shouldSendNewTcToken(senderTimestamp: number | string | null | undefined): boolean {
	if (!senderTimestamp) return true

	const ts = typeof senderTimestamp === 'string' ? parseInt(senderTimestamp, 10) : senderTimestamp
	if (!ts || ts <= 0) return true

	const { bucketSize } = getBucketConfig('sender')
	const now = Math.floor(Date.now() / 1000)
	const currentBucket = Math.floor(now / bucketSize)
	const tokenBucket = Math.floor(ts / bucketSize)
	return currentBucket > tokenBucket
}

/**
 * Build a tctoken BinaryNode from authState for a given JID.
 * Returns the tctoken node and sender timestamp for re-issuance logic.
 */
export async function buildTcTokenFromJid({ authState, jid }: TcTokenParams): Promise<{
	tokenNode: BinaryNode | null
	senderTimestamp: number | string | null
}> {
	const normalizedJid = jidNormalizedUser(jid)
	let tokenNode: BinaryNode | null = null
	let senderTimestamp: number | string | null = null

	try {
		const tcTokenData = await authState.keys.get('tctoken', [normalizedJid])
		const data: TcTokenData | undefined = tcTokenData?.[normalizedJid]

		if (data?.token) {
			if (!isTcTokenExpired(data.timestamp, 'receiver')) {
				tokenNode = {
					tag: 'tctoken',
					attrs: {},
					content: data.token
				}
			} else {
				// Opportunistically delete expired token
				await authState.keys.set({
					tctoken: { [normalizedJid]: null }
				})
			}
		}
	} catch {
		// tctoken failure should not break the caller
	}

	// Always read the persisted sender timestamp for re-issuance logic
	// This is separate from the token's receiver timestamp
	try {
		const senderTsData = await authState.keys.get('tctoken-sender-ts', [normalizedJid])
		const storedTs = senderTsData?.[normalizedJid]
		if (storedTs) {
			senderTimestamp = storedTs
		}
	} catch {
		// ignore
	}

	return { tokenNode, senderTimestamp }
}

/**
 * Monotonicity guard: returns true if we should reject an incoming token
 * because we already have a newer one stored.
 */
async function shouldRejectToken(
	keys: SignalKeyStoreWithTransaction,
	jid: string,
	incomingTs: number
): Promise<boolean> {
	try {
		const existing = await keys.get('tctoken', [jid])
		const existingData = existing?.[jid]
		if (!existingData?.timestamp) return false
		const existingTs = parseInt(existingData.timestamp, 10)
		if (existingTs <= 0) return false
		return incomingTs <= 0 || incomingTs < existingTs
	} catch {
		return false
	}
}

/**
 * Parse and store TC tokens from a privacy_token notification node.
 * Includes monotonicity guard: rejects tokens with older timestamps.
 */
export async function storeTcTokensFromNotification({
	node,
	keys,
	onNewJidStored
}: StoreTcTokensParams): Promise<number> {
	const tokensNode = getBinaryNodeChild(node, 'tokens')
	const fallbackFrom = jidNormalizedUser(node.attrs.from)

	if (!tokensNode) return 0

	const tokenNodes = getBinaryNodeChildren(tokensNode, 'token')
	let storedCount = 0

	for (const tokenNode of tokenNodes) {
		const { attrs, content } = tokenNode
		const type = attrs.type
		const timestamp = attrs.t

		if (type !== 'trusted_contact' || !(Buffer.isBuffer(content) || content instanceof Uint8Array)) {
			continue
		}

		const tokenJid = attrs.jid ? jidNormalizedUser(attrs.jid) : fallbackFrom
		const tokenBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content)
		const incomingTs = timestamp ? parseInt(String(timestamp), 10) : 0

		if (await shouldRejectToken(keys, tokenJid, incomingTs)) {
			continue
		}

		await keys.set({
			tctoken: { [tokenJid]: { token: tokenBuffer, timestamp: incomingTs > 0 ? String(incomingTs) : undefined } }
		})

		storedCount++
		onNewJidStored?.(tokenJid)
	}

	return storedCount
}

/**
 * Compute CS Token (client-side token) as fallback when no TC token is available.
 * CS Token = HMAC-SHA256(nctSalt, UTF8(recipientLid))
 *
 * Uses an LRU cache to avoid recomputing HMAC on every message to the same recipient.
 * Requires nctSalt from credentials (received via NctSaltSyncAction or history sync).
 */
export function computeCsToken(nctSalt: Uint8Array | Buffer, recipientLid: string): Uint8Array {
	// Validate nctSalt is exactly 32 bytes (HMAC-SHA256 key length)
	if (nctSalt?.length !== 32) {
		throw new Error(`Invalid nctSalt length: expected 32, got ${nctSalt?.length ?? 0}`)
	}

	// Check cache first
	const cached = csTokenCache.get(recipientLid)
	if (cached) {
		return cached
	}

	const hmac = createHmac('sha256', Buffer.from(nctSalt))
	hmac.update(recipientLid, 'utf8')
	const token = new Uint8Array(hmac.digest())

	// LRU eviction: remove oldest entry if cache is full
	if (csTokenCache.size >= CS_TOKEN_CACHE_MAX) {
		const firstKey = csTokenCache.keys().next().value!
		csTokenCache.delete(firstKey)
	}

	csTokenCache.set(recipientLid, token)
	return token
}

/**
 * Invalidate cstoken cache (e.g., when nctSalt changes).
 */
export function clearCsTokenCache(): void {
	csTokenCache.clear()
}

/**
 * Prune expired TC tokens from the key store.
 * Iterates over a set of known JIDs and removes any tokens that are expired.
 * Should be called periodically to prevent memory leaks from accumulated tokens.
 */
export async function pruneExpiredTcTokens(
	keys: SignalKeyStoreWithTransaction,
	knownJids: Set<string>
): Promise<number> {
	let pruned = 0

	for (const jid of knownJids) {
		try {
			const data = await keys.get('tctoken', [jid])
			const tokenData = data?.[jid]

			if (tokenData?.timestamp && isTcTokenExpired(tokenData.timestamp, 'receiver')) {
				await keys.set({ tctoken: { [jid]: null } })
				knownJids.delete(jid)
				pruned++
			}
		} catch {
			// ignore errors during pruning
		}
	}

	return pruned
}
