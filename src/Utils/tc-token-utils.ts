import type { SignalDataTypeMap, SignalKeyStoreWithRecordTransaction, SignalKeyStoreWithTransaction } from '../Types'
import type { BinaryNode } from '../WABinary'
import {
	getBinaryNodeChild,
	getBinaryNodeChildren,
	isHostedLidUser,
	isHostedPnUser,
	isJidMetaAI,
	isLidUser,
	isPnUser,
	jidNormalizedUser
} from '../WABinary'

// Same phone-number pattern as WABinary's isJidBot, applied against the user
// part so the check is invariant to @c.us ↔ @s.whatsapp.net normalization.
const BOT_PHONE_REGEX = /^1313555\d{4}$|^131655500\d{2}$/

/**
 * Mirrors WA Web's `Wid.isRegularUser()` (user ∧ ¬PSA ∧ ¬Bot). Used to gate tctoken
 * storage against malformed notifications — WA Web filters server-side but we
 * defend here for parity with `WAWebSetTcTokenChatAction.handleIncomingTcToken`.
 * Works for both pre- and post-normalized JIDs (`@c.us` vs `@s.whatsapp.net`).
 */
function isRegularUser(jid: string | undefined): boolean {
	if (!jid) return false
	const user = jid.split('@')[0] ?? ''
	if (user === '0') return false // PSA
	if (BOT_PHONE_REGEX.test(user)) return false // Bot by phone pattern
	if (isJidMetaAI(jid)) return false // MetaAI (@bot server)
	return !!(isPnUser(jid) || isLidUser(jid) || isHostedPnUser(jid) || isHostedLidUser(jid) || jid.endsWith('@c.us'))
}

const TC_TOKEN_BUCKET_DURATION = 604800 // 7 days
const TC_TOKEN_NUM_BUCKETS = 4 // ~28-day rolling window

/** Sentinel key under `tctoken` store holding a JSON array of tracked storage JIDs for cross-session pruning. */
export const TC_TOKEN_INDEX_KEY = '__index'

/** Read the persisted tctoken JID index and return its entries (never contains the sentinel key itself). */
export async function readTcTokenIndex(keys: SignalKeyStoreWithTransaction): Promise<string[]> {
	const data = await keys.get('tctoken', [TC_TOKEN_INDEX_KEY])
	const entry = data[TC_TOKEN_INDEX_KEY]
	if (!entry?.token?.length) return []
	try {
		const parsed = JSON.parse(Buffer.from(entry.token).toString())
		if (!Array.isArray(parsed)) return []
		return parsed.filter((j): j is string => typeof j === 'string' && j.length > 0 && j !== TC_TOKEN_INDEX_KEY)
	} catch {
		return []
	}
}

/** Build a SignalDataSet fragment that writes the merged index (persisted ∪ added) under the sentinel key.
 *
 * @deprecated Prefer {@link commitTcTokenWithIndex}, which performs the read
 * → merge → write atomically under a `transactWith` lock on the index
 * record. This helper still works but the caller must arrange its own
 * locking to avoid two concurrent invocations each reading the same
 * pre-merge state and clobbering each other's additions on commit.
 */
export async function buildMergedTcTokenIndexWrite(
	keys: SignalKeyStoreWithTransaction,
	addedJids: Iterable<string>
): Promise<{ [TC_TOKEN_INDEX_KEY]: { token: Buffer } }> {
	const persisted = await readTcTokenIndex(keys)
	const merged = new Set(persisted)
	for (const jid of addedJids) {
		if (jid && jid !== TC_TOKEN_INDEX_KEY) merged.add(jid)
	}

	return {
		[TC_TOKEN_INDEX_KEY]: { token: Buffer.from(JSON.stringify([...merged])) }
	}
}

/**
 * Atomically commit a tctoken index update (and any accompanying per-jid
 * token writes) under a `transactWith` lock on the index record.
 *
 * Stage 10 closure of the audit's deferred tc-token item: two concurrent
 * callers using {@link buildMergedTcTokenIndexWrite} + a manual
 * `keys.set` would each read the same pre-merge state and then commit
 * their own merge, losing the other's additions. Wrapping the read +
 * write in one transactWith on `{ type: 'tctoken', id: '__index' }`
 * serializes them through the LockManager. Per-jid token writes can
 * piggyback on the same transactWith by passing them in `extraWrites`
 * — they're committed in the same atomic `state.set` as the index
 * update, so a partial-commit window cannot exist.
 *
 * Records held: the index sentinel + every per-jid key in `extraWrites`.
 * Concurrent callers touching disjoint jids and not the index proceed
 * in parallel.
 */
export async function commitTcTokenWithIndex(
	keys: SignalKeyStoreWithRecordTransaction,
	addedJids: Iterable<string>,
	extraWrites?: { [jid: string]: SignalDataTypeMap['tctoken'] | null }
): Promise<void> {
	const recordIds = [TC_TOKEN_INDEX_KEY, ...Object.keys(extraWrites ?? {})]
	await keys.transactWith({ records: recordIds.map(id => ({ type: 'tctoken', id })) }, async () => {
		const persisted = await readTcTokenIndex(keys)
		const merged = new Set(persisted)
		for (const jid of addedJids) {
			if (jid && jid !== TC_TOKEN_INDEX_KEY) merged.add(jid)
		}

		await keys.set({
			tctoken: {
				...(extraWrites ?? {}),
				[TC_TOKEN_INDEX_KEY]: { token: Buffer.from(JSON.stringify([...merged])) }
			}
		})
	})
}

// WA Web has separate sender/receiver AB props for these but they're identical today
export function isTcTokenExpired(timestamp: number | string | null | undefined): boolean {
	if (timestamp === null || timestamp === undefined) return true
	const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
	if (isNaN(ts)) return true
	const now = Math.floor(Date.now() / 1000)
	const currentBucket = Math.floor(now / TC_TOKEN_BUCKET_DURATION)
	const cutoffBucket = currentBucket - (TC_TOKEN_NUM_BUCKETS - 1)
	const cutoffTimestamp = cutoffBucket * TC_TOKEN_BUCKET_DURATION
	return ts < cutoffTimestamp
}

export function shouldSendNewTcToken(senderTimestamp: number | undefined): boolean {
	if (senderTimestamp === undefined) return true
	const now = Math.floor(Date.now() / 1000)
	const currentBucket = Math.floor(now / TC_TOKEN_BUCKET_DURATION)
	const senderBucket = Math.floor(senderTimestamp / TC_TOKEN_BUCKET_DURATION)
	return currentBucket > senderBucket
}

/** Resolve JID to LID for tctoken storage (WA Web stores under LID) */
export async function resolveTcTokenJid(
	jid: string,
	getLIDForPN: (pn: string) => Promise<string | null>
): Promise<string> {
	if (isLidUser(jid)) return jid
	const lid = await getLIDForPN(jid)
	return lid ?? jid
}

/** Resolve target JID for issuing privacy token based on AB prop 14303 */
export async function resolveIssuanceJid(
	jid: string,
	issueToLid: boolean,
	getLIDForPN: (pn: string) => Promise<string | null>,
	getPNForLID?: (lid: string) => Promise<string | null>
): Promise<string> {
	if (issueToLid) {
		if (isLidUser(jid)) return jid
		const lid = await getLIDForPN(jid)
		return lid ?? jid
	}

	if (!isLidUser(jid)) return jid
	if (getPNForLID) {
		const pn = await getPNForLID(jid)
		return pn ?? jid
	}

	return jid
}

type TcTokenParams = {
	jid: string
	baseContent?: BinaryNode[]
	authState: {
		keys: SignalKeyStoreWithTransaction
	}
	getLIDForPN: (pn: string) => Promise<string | null>
}

export async function buildTcTokenFromJid({
	authState,
	jid,
	baseContent = [],
	getLIDForPN
}: TcTokenParams): Promise<BinaryNode[] | undefined> {
	try {
		const storageJid = await resolveTcTokenJid(jid, getLIDForPN)
		const tcTokenData = await authState.keys.get('tctoken', [storageJid])
		const entry = tcTokenData?.[storageJid]
		const tcTokenBuffer = entry?.token

		if (!tcTokenBuffer?.length || isTcTokenExpired(entry?.timestamp)) {
			if (tcTokenBuffer) {
				// Preserve senderTimestamp so shouldSendNewTcToken() keeps its dedupe state
				// after we drop the unusable peer token. Only wipe the record entirely when
				// there's nothing worth keeping.
				const cleared =
					entry?.senderTimestamp !== undefined
						? { token: Buffer.alloc(0), senderTimestamp: entry.senderTimestamp }
						: null
				await authState.keys.set({ tctoken: { [storageJid]: cleared } })
			}

			return baseContent.length > 0 ? baseContent : undefined
		}

		baseContent.push({
			tag: 'tctoken',
			attrs: {},
			content: tcTokenBuffer
		})

		return baseContent
	} catch (error) {
		return baseContent.length > 0 ? baseContent : undefined
	}
}

type StoreTcTokensParams = {
	result: BinaryNode
	fallbackJid: string
	keys: SignalKeyStoreWithTransaction
	getLIDForPN: (pn: string) => Promise<string | null>
	onNewJidStored?: (jid: string) => void
}

export async function storeTcTokensFromIqResult({
	result,
	fallbackJid,
	keys,
	getLIDForPN,
	onNewJidStored
}: StoreTcTokensParams) {
	const tokensNode = getBinaryNodeChild(result, 'tokens')
	if (!tokensNode) return

	const tokenNodes = getBinaryNodeChildren(tokensNode, 'token')
	for (const tokenNode of tokenNodes) {
		if (tokenNode.attrs.type !== 'trusted_contact' || !(tokenNode.content instanceof Uint8Array)) {
			continue
		}

		// In notifications tokenNode.attrs.jid is your own device JID, not the sender's
		const rawJid = jidNormalizedUser(fallbackJid || tokenNode.attrs.jid)
		if (!isRegularUser(rawJid)) continue
		const storageJid = await resolveTcTokenJid(rawJid, getLIDForPN)
		const existingTcData = await keys.get('tctoken', [storageJid])
		const existingEntry = existingTcData[storageJid]

		const existingTs = existingEntry?.timestamp ? Number(existingEntry.timestamp) : 0
		const incomingTs = tokenNode.attrs.t ? Number(tokenNode.attrs.t) : 0
		// timestamp-less tokens would be immediately expired
		if (!incomingTs) continue
		if (existingTs > 0 && existingTs > incomingTs) continue

		await keys.set({
			tctoken: {
				[storageJid]: {
					...existingEntry,
					token: Buffer.from(tokenNode.content),
					timestamp: tokenNode.attrs.t
				}
			}
		})
		onNewJidStored?.(storageJid)
	}
}
