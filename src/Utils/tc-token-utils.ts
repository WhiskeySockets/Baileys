import type { SignalKeyStoreWithTransaction } from '../Types'
import type { BinaryNode } from '../WABinary'
import { getBinaryNodeChild, getBinaryNodeChildren, isLidUser, jidNormalizedUser } from '../WABinary'

const TC_TOKEN_BUCKET_DURATION = 604800 // 7 days
const TC_TOKEN_NUM_BUCKETS = 4 // ~28-day rolling window

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
	getLIDForPN?: (pn: string) => Promise<string | null>
}

export async function buildTcTokenFromJid({
	authState,
	jid,
	baseContent = [],
	getLIDForPN
}: TcTokenParams): Promise<BinaryNode[] | undefined> {
	try {
		const storageJid = getLIDForPN ? await resolveTcTokenJid(jid, getLIDForPN) : jid
		const tcTokenData = await authState.keys.get('tctoken', [storageJid])
		const entry = tcTokenData?.[storageJid]
		const tcTokenBuffer = entry?.token

		if (!tcTokenBuffer?.length || isTcTokenExpired(entry?.timestamp)) {
			if (tcTokenBuffer) {
				await authState.keys.set({ tctoken: { [storageJid]: null } })
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
		const storageJid = await resolveTcTokenJid(rawJid, getLIDForPN)
		const existingTcData = await keys.get('tctoken', [storageJid])
		const existingEntry = existingTcData[storageJid]

		const existingTs = existingEntry?.timestamp ? Number(existingEntry.timestamp) : 0
		const incomingTs = tokenNode.attrs.t ? Number(tokenNode.attrs.t) : 0
		if (existingTs > 0 && incomingTs > 0 && existingTs > incomingTs) {
			continue
		}

		// timestamp-less tokens would be immediately expired
		if (existingTs > 0 && !incomingTs) {
			continue
		}

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
