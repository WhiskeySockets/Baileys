import { proto } from '../../WAProto/index.js'
import type { LIDMappingStore } from '../Signal/lid-mapping'

type DecryptGroupSignalOpts = {
	group: string
	authorJid: string
	msg: Uint8Array
}

type ProcessSenderKeyDistributionMessageOpts = {
	item: proto.Message.ISenderKeyDistributionMessage
	authorJid: string
}

type DecryptSignalProtoOpts = {
	jid: string
	type: 'pkmsg' | 'msg'
	ciphertext: Uint8Array
}

type EncryptMessageOpts = {
	jid: string
	data: Uint8Array
	/**
	 * Workaround flag (2026-05-25) — when `true`, encryptMessage SKIPS the
	 * inner transactional wrapper entirely (no `transactWith` and no legacy
	 * `transaction()`) and calls `cipher.encrypt(data)` directly. The outer
	 * `relayMessage` transaction context (or absence of one — see the
	 * companion outer-transaction bypass in messages-send.ts) is the only
	 * locking layer in effect.
	 *
	 * Set this for interactive 1-on-1 sends (buttons / CTA / list / carousel).
	 * `relayMessage` fans out per-device encryption via `Promise.all`,
	 * producing SIBLING transactWith calls inside the outer `transaction(meId)`
	 * ctx — Stage 2's own auth-utils.ts contract documents that pattern as
	 * unsafe, and in production it correlated with WhatsApp Web failing to
	 * render the resulting message. Bypassing the inner wrap mirrors the
	 * pre-Stage-2 H0-bypass behavior that empirically worked.
	 *
	 * Trade-off: loses H10 (per-jid encrypt serialization) for the
	 * interactive path. Never observed in production; acceptable.
	 *
	 * Non-interactive paths (text, media, poll, peer) continue to use Stage
	 * 2's transactWith with full record-scoped locking. Remove this flag
	 * once the underlying sibling-Promise.all issue is solved upstream.
	 */
	useLegacyLock?: boolean
}

type EncryptGroupMessageOpts = {
	group: string
	data: Uint8Array
	meId: string
}

type GetSenderKeyDistributionMessageOpts = {
	group: string
	meId: string
}

type PreKey = {
	keyId: number
	publicKey: Uint8Array
}

type SignedPreKey = PreKey & {
	signature: Uint8Array
}

type E2ESession = {
	registrationId: number
	identityKey: Uint8Array
	signedPreKey: SignedPreKey
	/** Optional — retry-receipt bundles may omit the one-time pre-key. */
	preKey?: PreKey
}

type E2ESessionOpts = {
	jid: string
	session: E2ESession
}

export type SignalRepository = {
	decryptGroupMessage(opts: DecryptGroupSignalOpts): Promise<Uint8Array>
	processSenderKeyDistributionMessage(opts: ProcessSenderKeyDistributionMessageOpts): Promise<void>
	decryptMessage(opts: DecryptSignalProtoOpts): Promise<Uint8Array>
	encryptMessage(opts: EncryptMessageOpts): Promise<{
		type: 'pkmsg' | 'msg'
		ciphertext: Uint8Array
	}>
	encryptGroupMessage(opts: EncryptGroupMessageOpts): Promise<{
		senderKeyDistributionMessage: Uint8Array
		ciphertext: Uint8Array
	}>
	/** Build a SenderKeyDistributionMessage for an existing/new sender key (no encryption). */
	getSenderKeyDistributionMessage(opts: GetSenderKeyDistributionMessageOpts): Promise<Uint8Array>
	/** Check whether a sender key already exists for `(group, meId)`. */
	hasSenderKey(opts: GetSenderKeyDistributionMessageOpts): Promise<boolean>
	/** Read the base key + registration id from the open session (for retry collision detection). */
	getSessionInfo(jid: string): Promise<{ baseKey: Uint8Array; registrationId: number } | null>
	injectE2ESession(opts: E2ESessionOpts): Promise<void>
	validateSession(jid: string): Promise<{ exists: boolean; reason?: string }>
	jidToSignalProtocolAddress(jid: string): string
	migrateSession(fromJid: string, toJid: string): Promise<{ migrated: number; skipped: number; total: number }>
	validateSession(jid: string): Promise<{ exists: boolean; reason?: string }>
	deleteSession(jids: string[]): Promise<void>
}

// Optimized repository with pre-loaded LID mapping store
export interface SignalRepositoryWithLIDStore extends SignalRepository {
	lidMapping: LIDMappingStore
	/** Release in-memory caches (migrated-session + LID mapping) on socket close. */
	close?: () => void | Promise<void>
}
