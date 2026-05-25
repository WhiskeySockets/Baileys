/* @ts-ignore */
import { createHash } from 'crypto'
import * as libsignal from 'libsignal'
import { LRUCache } from 'lru-cache'
import type {
	LIDMapping,
	RecordRef,
	SignalAuthState,
	SignalKeyStoreWithRecordTransaction,
	SignalKeyStoreWithTransaction
} from '../Types'
import type { BaileysEventEmitter } from '../Types/Events'
import type { SignalRepositoryWithLIDStore } from '../Types/Signal'
import { generateSignalPubKey } from '../Utils'
import type { ILogger } from '../Utils/logger'
import { metrics } from '../Utils/prometheus-metrics.js'
import { isAnyLidUser, isAnyPnUser, jidDecode, transferDevice, WAJIDDomains } from '../WABinary'
import type { SenderKeyStore } from './Group/group_cipher'
import { SenderKeyName } from './Group/sender-key-name'
import { SenderKeyRecord } from './Group/sender-key-record'
import { GroupCipher, GroupSessionBuilder, SenderKeyDistributionMessage } from './Group'
import { LIDMappingStore } from './lid-mapping'

// NOTE: Console.log suppression has been moved to src/index.ts
// to ensure it runs BEFORE libsignal is loaded

// ============================================
// Identity Key Detection Constants
// ============================================

/** Cache TTL for identity keys - 30 minutes */
const IDENTITY_KEY_CACHE_TTL = 30 * 60 * 1000

/** Maximum number of identity keys to cache */
const IDENTITY_KEY_CACHE_MAX = 1000

/** Curve25519 public key type byte (0x05) */
const CURVE25519_KEY_TYPE = 0x05

/** Expected length of a Curve25519 public key with type byte */
const IDENTITY_KEY_LENGTH = 33

/** PreKeyWhisperMessage version 3 */
const PREKEY_MSG_VERSION = 3

// ============================================
// Identity Key Types
// ============================================

/**
 * Result of identity key save operation
 */
export interface IdentitySaveResult {
	/**
	 * Whether the identity key changed from a previous known value.
	 * - true: Key changed (contact reinstalled WhatsApp or switched devices)
	 * - false: Key is new (first contact) OR unchanged (same key as before)
	 * Use `isNew` to distinguish between new and unchanged cases.
	 */
	changed: boolean
	/** Whether this is a new contact (first time seeing their key) */
	isNew: boolean
	/** Fingerprint of the previous key (only present if changed === true) */
	previousFingerprint?: string
	/** SHA-256 fingerprint of the current/new key (64 hex characters) */
	currentFingerprint: string
}

/**
 * Options for makeLibSignalRepository
 */
export interface LibSignalRepositoryOptions {
	/** Event emitter for broadcasting identity changes */
	ev?: BaileysEventEmitter
}

// ============================================
// Identity Key Utility Functions
// ============================================

/**
 * Generate a SHA-256 fingerprint of an identity key
 * This is used to display to users for verification
 * Returns full 64-character hex string (256 bits) for cryptographic consistency
 *
 * @param key - The identity key bytes
 * @returns Full SHA-256 hex string fingerprint (64 characters)
 */
function generateKeyFingerprint(key: Uint8Array): string {
	return createHash('sha256').update(key).digest('hex')
}

/**
 * Extract identity key from a PreKeyWhisperMessage
 *
 * The PreKeyWhisperMessage format (version 3):
 * - Byte 0: Version byte (high nibble = current version, low nibble = 3)
 * - Bytes 1+: Protobuf-encoded PreKeySignalMessage
 *
 * The protobuf contains:
 * - registrationId (uint32)
 * - preKeyId (uint32, optional)
 * - signedPreKeyId (uint32)
 * - baseKey (bytes, 33 bytes - Curve25519 public key)
 * - identityKey (bytes, 33 bytes - Curve25519 public key)
 * - message (bytes - the actual encrypted message)
 *
 * We manually parse the protobuf to extract identityKey without depending on
 * the full protobuf library, making this compatible with any Signal implementation.
 *
 * @param ciphertext - The raw PreKeyWhisperMessage bytes
 * @param logger - Logger for debug output
 * @returns The identity key bytes or undefined if extraction fails
 */
function extractIdentityFromPkmsg(ciphertext: Uint8Array, logger?: ILogger): Uint8Array | undefined {
	const timer = metrics.signalIdentityKeyOperations?.startTimer({ operation: 'extract' })

	try {
		// Minimum size: 1 byte version + at least 34 bytes for minimal protobuf with identity key
		if (!ciphertext || ciphertext.length < 35) {
			logger?.debug({ length: ciphertext?.length }, 'Ciphertext too short for identity extraction')
			return undefined
		}

		const version = ciphertext[0]!
		// Version byte format: high nibble = current version, low nibble = message type (3 = PreKey)
		const messageType = version & 0x0f
		if (messageType !== PREKEY_MSG_VERSION) {
			logger?.debug({ version, messageType }, 'Not a PreKeyWhisperMessage (version 3)')
			return undefined
		}

		// Parse protobuf manually - we're looking for field 5 (identityKey)
		// Protobuf wire format: varint tag (field_number << 3 | wire_type), then value
		// Wire type 2 = length-delimited (used for bytes)
		let offset = 1 // Skip version byte

		while (offset < ciphertext.length) {
			// Read tag varint
			const tagResult = readVarint(ciphertext, offset)
			if (!tagResult) break

			const tag = tagResult.value
			offset = tagResult.nextOffset

			const fieldNumber = tag >> 3
			const wireType = tag & 0x07

			if (wireType === 2) {
				// Length-delimited field
				const lengthResult = readVarint(ciphertext, offset)
				if (!lengthResult) break

				const length = lengthResult.value
				offset = lengthResult.nextOffset

				// Field 5 is identityKey
				if (fieldNumber === 5) {
					// Validate key length
					// eslint-disable-next-line max-depth
					if (length !== IDENTITY_KEY_LENGTH) {
						logger?.debug({ length, expected: IDENTITY_KEY_LENGTH }, 'Invalid identity key length')
						return undefined
					}

					// eslint-disable-next-line max-depth
					if (offset + length > ciphertext.length) {
						logger?.debug('Identity key extends beyond ciphertext bounds')
						return undefined
					}

					const identityKey = ciphertext.slice(offset, offset + length)

					// Validate key type byte (must be 0x05 for Curve25519)
					// eslint-disable-next-line max-depth
					if (identityKey[0] !== CURVE25519_KEY_TYPE) {
						logger?.debug({ type: identityKey[0], expected: CURVE25519_KEY_TYPE }, 'Invalid identity key type')
						return undefined
					}

					return new Uint8Array(identityKey)
				}

				offset += length
				// Bounds check after skipping field
				if (offset > ciphertext.length) {
					logger?.debug(
						{ offset, length: ciphertext.length },
						'Offset exceeds ciphertext bounds after length-delimited field'
					)
					break
				}
			} else if (wireType === 0) {
				// Varint
				const varintResult = readVarint(ciphertext, offset)
				if (!varintResult) break
				offset = varintResult.nextOffset
			} else if (wireType === 1) {
				// 64-bit fixed
				offset += 8
				if (offset > ciphertext.length) break
			} else if (wireType === 5) {
				// 32-bit fixed
				offset += 4
				if (offset > ciphertext.length) break
			} else {
				// Unknown wire type, cannot continue
				logger?.debug({ wireType }, 'Unknown wire type in protobuf')
				break
			}
		}

		logger?.debug('Identity key field not found in PreKeyWhisperMessage')
		return undefined
	} catch (error) {
		logger?.debug({ error: (error as Error).message }, 'Failed to extract identity from pkmsg')
		return undefined
	} finally {
		timer?.()
	}
}

/**
 * Read a varint from a buffer
 *
 * @param buffer - The buffer to read from
 * @param offset - Starting offset
 * @returns Object with value and nextOffset, or undefined if invalid
 */
function readVarint(buffer: Uint8Array, offset: number): { value: number; nextOffset: number } | undefined {
	let result = 0
	let shift = 0

	while (offset < buffer.length) {
		const byte = buffer[offset]!
		result |= (byte & 0x7f) << shift

		offset++
		if ((byte & 0x80) === 0) {
			return { value: result >>> 0, nextOffset: offset } // >>> 0 ensures unsigned
		}

		shift += 7
		if (shift > 35) {
			// Varint too long (max 5 bytes for 32-bit)
			// This could indicate a malformed or malicious message
			// Caller should log this condition at debug level
			return undefined
		}
	}

	// Incomplete varint - buffer ended before termination byte
	return undefined
}

export function makeLibSignalRepository(
	auth: SignalAuthState,
	logger: ILogger,
	pnToLIDFunc?: (jids: string[]) => Promise<LIDMapping[] | undefined>,
	options?: LibSignalRepositoryOptions
): SignalRepositoryWithLIDStore {
	const { ev } = options || {}

	// PR #457 round-3 (CodeRabbit Minor): runtime guard MOVED to the top of
	// this function. Previously sat after setInterval() — if the guard
	// threw, the minute-interval and identityKeyCache were already allocated
	// and leaked (unref'd timer + LRU pinned in closure). Failing fast
	// before any long-lived resource exists eliminates the startup leak.
	//
	// Stage 2 (upstream #2572): Baileys' `addTransactionCapability` returns a
	// store with `transactWith` implemented. `SignalAuthState.keys` is typed
	// `SignalKeyStore | SignalKeyStoreWithTransaction` (transactWith OPTIONAL).
	// A legacy store reaching here would silently fail at the first migrated
	// path with a confusing "transactWith is not a function" TypeError. The
	// guard surfaces the contract violation immediately with a clear message.
	const keysCandidate = auth.keys as Partial<SignalKeyStoreWithRecordTransaction>
	if (typeof keysCandidate.transactWith !== 'function') {
		throw new Error(
			'makeLibSignalRepository: auth.keys is missing the `transactWith` method. ' +
				'Wrap your storage with `addTransactionCapability()` so it returns a ' +
				'`SignalKeyStoreWithRecordTransaction` (Stage 2 record-scoped API).'
		)
	}

	const lidMapping = new LIDMappingStore(auth.keys as SignalKeyStoreWithTransaction, logger, pnToLIDFunc)

	// Identity key cache to avoid repeated storage reads
	const identityKeyCache = new LRUCache<string, Uint8Array>({
		max: IDENTITY_KEY_CACHE_MAX,
		ttl: IDENTITY_KEY_CACHE_TTL,
		ttlAutopurge: true,
		updateAgeOnGet: true
	})

	// Update cache size metric periodically
	const cacheMetricsInterval = setInterval(() => {
		metrics.signalIdentityKeyCacheSize?.set(identityKeyCache.size)
	}, 60000) // Every minute

	// Allow process to exit even with interval active (prevents blocking in short-lived scripts/tests)
	if (typeof cacheMetricsInterval.unref === 'function') {
		cacheMetricsInterval.unref()
	}

	const storage = signalStorage(auth, lidMapping, identityKeyCache, ev, logger)

	const parsedKeys = auth.keys as SignalKeyStoreWithRecordTransaction
	const migratedSessionCache = new LRUCache<string, true>({
		ttl: 3 * 24 * 60 * 60 * 1000, // 3 days
		ttlAutopurge: true,
		updateAgeOnGet: true
	})

	// Cache for device-list DB reads in migrateSession.
	// The device list changes rarely (new linked device), so a 5-minute TTL avoids
	// a DB round-trip on every incoming LID message without risking stale state:
	// new devices are picked up at most 5 minutes late (still migrated via their own
	// decrypt transaction when the session is first used).
	const deviceListCache = new LRUCache<string, string[]>({
		max: 500,
		ttl: 5 * 60 * 1000, // 5 minutes
		ttlAutopurge: true
	})

	// In-flight deduplication map for migrateSession: if N concurrent callers arrive
	// for the same PN user before the first migration completes, they all share one
	// Promise instead of each spawning their own DB transactions.
	const migrationInFlight = new Map<string, Promise<{ migrated: number; skipped: number; total: number }>>()

	// Resolve PN JID to its canonical LID JID for transaction locking.
	// This prevents PN/LID race conditions where concurrent operations for the
	// same logical contact acquire different mutex locks because one uses PN
	// and the other uses LID. (Aligned with WABA behavior — all operations use LID internally.)
	const resolveCanonicalJid = async(jid: string): Promise<string> => {
		if (isAnyLidUser(jid)) {
			return jid
		}

		if (isAnyPnUser(jid)) {
			const lid = await lidMapping.getLIDForPN(jid)
			if (lid) {
				return lid
			}
		}

		return jid
	}

	/**
	 * Shared by `encryptGroupMessage` and `getSenderKeyDistributionMessage`:
	 * ensure a SenderKeyRecord exists for `(group, meId)` and build the SKDM.
	 * Avoids the previous duplication between encrypt and retry-resend paths.
	 */
	const ensureSenderKeyAndCreateSkdm = async (group: string, meId: string) => {
		const senderName = jidToSignalSenderKeyName(group, meId)
		const senderNameStr = senderName.toString()
		const { [senderNameStr]: senderKey } = await auth.keys.get('sender-key', [senderNameStr])
		if (!senderKey) {
			await storage.storeSenderKey(senderName, new SenderKeyRecord())
		}

		const skdm = await new GroupSessionBuilder(storage).create(senderName)
		return { senderName, skdm }
	}

	const repository: SignalRepositoryWithLIDStore = {
		decryptGroupMessage({ group, authorJid, msg }) {
			const senderName = jidToSignalSenderKeyName(group, authorJid)
			const cipher = new GroupCipher(storage, senderName)

			// Stage 2 (upstream #2572): record-scoped lock on the actual sender-key
			// being decrypted, not the synthetic group jid. Concurrent decrypts of
			// different sender-keys in the same group now run in parallel.
			return parsedKeys.transactWith({ records: [{ type: 'sender-key', id: senderName.toString() }] }, async () => {
				return cipher.decrypt(msg)
			})
		},
		async processSenderKeyDistributionMessage({ item, authorJid }) {
			const builder = new GroupSessionBuilder(storage)
			if (!item.groupId) {
				throw new Error('Group ID is required for sender key distribution message')
			}

			const senderName = jidToSignalSenderKeyName(item.groupId, authorJid)
			const senderNameStr = senderName.toString()

			const senderMsg = new SenderKeyDistributionMessage(
				null,
				null,
				null,
				null,
				item.axolotlSenderKeyDistributionMessage
			)

			// Stage 2 (upstream #2572): removed the previous pre-lock
			// `auth.keys.get('sender-key', ...) + conditional storeSenderKey`
			// block. It was redundant (the same check + write runs inside the
			// transactWith below) AND unsafe — a concurrent writer could commit
			// a populated record between our pre-lock read and our pre-lock
			// write, which we'd then clobber with an empty SenderKeyRecord.
			// All initialization now happens atomically under the per-record lock.
			return parsedKeys.transactWith({ records: [{ type: 'sender-key', id: senderNameStr }] }, async () => {
				const { [senderNameStr]: senderKey } = await auth.keys.get('sender-key', [senderNameStr])
				if (!senderKey) {
					await storage.storeSenderKey(senderName, new SenderKeyRecord())
				}

				await builder.process(senderName, senderMsg)
			})
		},
		async decryptMessage({ jid, type, ciphertext }) {
			const addr = jidToSignalProtocolAddress(jid)
			const session = new libsignal.SessionCipher(storage, addr)

			async function doDecrypt() {
				// For PreKeyWhisperMessage, extract and verify identity key BEFORE decryption
				// This handles the case where a contact reinstalled WhatsApp (new identity key)
				if (type === 'pkmsg') {
					const identityKey = extractIdentityFromPkmsg(ciphertext, logger)
					if (identityKey) {
						const addrStr = addr.toString()
						try {
							const saveResult = await storage.saveIdentity(addrStr, identityKey)
							if (saveResult.changed) {
								logger.info(
									{
										jid,
										addr: addrStr,
										previousFingerprint: saveResult.previousFingerprint,
										newFingerprint: saveResult.currentFingerprint
									},
									'Identity key changed - contact may have reinstalled WhatsApp, session will be re-established'
								)
							} else if (saveResult.isNew) {
								logger.debug(
									{ jid, addr: addrStr, fingerprint: saveResult.currentFingerprint },
									'New contact identity key saved (Trust On First Use)'
								)
							}
						} catch (error) {
							// Log but don't fail decryption - identity tracking is best-effort
							logger.warn({ jid, error: (error as Error).message }, 'Failed to save identity key during decryption')
						}
					}
				}

				let result: Buffer
				if (type === 'pkmsg') {
					result = await session.decryptPreKeyWhisperMessage(ciphertext)
				} else {
					result = await session.decryptWhisperMessage(ciphertext)
				}

				return result
			}

			// InfiniteAPI hybrid (Stage 2 #2572 + nosso PN/LID race fix):
			// resolve PN→LID FIRST, then build the record id from the canonical
			// address. Upstream Stage 2 used `addr.toString()` direct, which loses
			// our PN→LID resolution and reintroduces the race where parallel
			// decrypts of the same logical contact via PN vs LID acquire DIFFERENT
			// session locks. We feed the canonical addr to transactWith so all
			// variants of the same logical session serialize under one record lock.
			const canonicalJid = await resolveCanonicalJid(jid)
			const canonicalAddr = jidToSignalProtocolAddress(canonicalJid).toString()
			return parsedKeys.transactWith({ records: [{ type: 'session', id: canonicalAddr }] }, async () => {
				return await doDecrypt()
			})
		},

		async encryptMessage({ jid, data, useLegacyLock }) {
			const addr = jidToSignalProtocolAddress(jid)
			const cipher = new libsignal.SessionCipher(storage, addr)
			const canonicalJid = await resolveCanonicalJid(jid)

			// WORKAROUND (Stage 2 #2572 regression — 2026-05-25): when caller
			// sets `useLegacyLock` (interactive message sends — buttons / CTA /
			// list / carousel), use the legacy `transaction(work, canonicalJid)`
			// pattern instead of `transactWith({records:[session:<addr>]})`.
			// Reason: `relayMessage` fans out per-device encryption via
			// `Promise.all`, producing SIBLING transactWith calls that share the
			// outer `transaction(meId)` ctx. Stage 2's own auth-utils.ts contract
			// documents that pattern as unsafe; in production it correlates with
			// the recipient sending retry receipts ("reg id mismatch on retry
			// without bundle, deleting session" → re-encrypt to `:N@lid` →
			// smax-invalid 479 → Web fails to render the message). Non-interactive
			// paths (text, media, poll, peer) keep transactWith — they don't hit
			// the multi-device fanout sibling pattern in a way that breaks render.
			if (useLegacyLock) {
				return parsedKeys.transaction(async () => {
					const { type: sigType, body } = await cipher.encrypt(data)
					const type = sigType === 3 ? 'pkmsg' : 'msg'
					return { type, ciphertext: Buffer.from(body, 'binary') }
				}, canonicalJid)
			}

			// InfiniteAPI hybrid (Stage 2 #2572 + nosso PN/LID race fix):
			// same canonical-address pattern as decryptMessage — PN→LID resolution
			// runs BEFORE we lock, so parallel encrypts to the same logical
			// contact via PN vs LID variants serialize under one session record.
			const canonicalAddr = jidToSignalProtocolAddress(canonicalJid).toString()
			return parsedKeys.transactWith({ records: [{ type: 'session', id: canonicalAddr }] }, async () => {
				const { type: sigType, body } = await cipher.encrypt(data)
				const type = sigType === 3 ? 'pkmsg' : 'msg'
				return { type, ciphertext: Buffer.from(body, 'binary') }
			})
		},

		async encryptGroupMessage({ group, meId, data }) {
			// Stage 2 (upstream #2572): hoist senderName computation out of the
			// transaction so the record id is known before lock acquisition.
			// Lock per (group, meId) sender-key instead of the synthetic group jid —
			// concurrent encrypts for different group/meId pairs run in parallel.
			const senderName = jidToSignalSenderKeyName(group, meId)
			return parsedKeys.transactWith(
				{ records: [{ type: 'sender-key', id: senderName.toString() }] },
				async () => {
					const { skdm } = await ensureSenderKeyAndCreateSkdm(group, meId)
					const ciphertext = await new GroupCipher(storage, senderName).encrypt(data)
					return { ciphertext, senderKeyDistributionMessage: skdm.serialize() }
				}
			)
		},

		async getSenderKeyDistributionMessage({ group, meId }) {
			// Stage 2: same record-scoped pattern as encryptGroupMessage.
			const senderName = jidToSignalSenderKeyName(group, meId)
			return parsedKeys.transactWith(
				{ records: [{ type: 'sender-key', id: senderName.toString() }] },
				async () => {
					const { skdm } = await ensureSenderKeyAndCreateSkdm(group, meId)
					return skdm.serialize()
				}
			)
		},

		async hasSenderKey({ group, meId }) {
			const senderName = jidToSignalSenderKeyName(group, meId).toString()
			const { [senderName]: key } = await auth.keys.get('sender-key', [senderName])
			return !!key
		},

		async getSessionInfo(jid) {
			const addr = jidToSignalProtocolAddress(jid).toString()
			const session = (await storage.loadSession(addr)) as {
				getOpenSession?: () => { indexInfo?: { baseKey?: Buffer }; registrationId?: number } | undefined
			} | null
			if (!session) {
				return null
			}

			const open = session.getOpenSession?.()
			const baseKey = open?.indexInfo?.baseKey
			const registrationId = open?.registrationId
			if (!baseKey || typeof registrationId !== 'number') {
				return null
			}

			return { baseKey: new Uint8Array(baseKey), registrationId }
		},

		async injectE2ESession({ jid, session }) {
			logger.trace({ jid }, 'injecting E2EE session')
			// PR #457 round-1 fix (Codex P1 + Copilot + CodeRabbit — 3 bots
			// convergem): use the canonical (PN→LID resolved) address as the
			// record lock id. `signalStorage.loadSession`/`storeSession`
			// canonicalize PN→LID before touching storage, so a PN JID with a
			// known mapping mutates `session.<lidAddr>` even when our cipher
			// holds the PN address. Without this hybrid, a concurrent encrypt
			// for the same logical contact (now using canonical addr in its
			// lock) would NOT serialize against this injection.
			const addr = jidToSignalProtocolAddress(jid)
			const canonicalJid = await resolveCanonicalJid(jid)
			const canonicalAddr = jidToSignalProtocolAddress(canonicalJid).toString()
			const cipher = new libsignal.SessionBuilder(storage, addr)
			return parsedKeys.transactWith({ records: [{ type: 'session', id: canonicalAddr }] }, async () => {
				// libsignal runtime accepts an absent prekey (initOutgoing checks `device.preKey && ...`)
				// but the bundled .d.ts marks it required. Retry-receipt bundles can legitimately
				// omit the one-time key — cast through unknown so TS lets us pass session through.
				await cipher.initOutgoing(session as unknown as Parameters<typeof cipher.initOutgoing>[0])
			})
		},
		jidToSignalProtocolAddress(jid) {
			return jidToSignalProtocolAddress(jid).toString()
		},

		// Optimized direct access to LID mapping store
		lidMapping,

		async validateSession(jid: string) {
			try {
				const addr = jidToSignalProtocolAddress(jid)
				const session = await storage.loadSession(addr.toString())

				if (!session) {
					return { exists: false, reason: 'no session' }
				}

				if (!session.haveOpenSession()) {
					return { exists: false, reason: 'no open session' }
				}

				return { exists: true }
			} catch (error) {
				return { exists: false, reason: 'validation error' }
			}
		},

		async deleteSession(jids: string[]) {
			if (!jids.length) return

			// PR #457 round-1 fix (Codex P1 + Copilot + CodeRabbit — 3 bots
			// convergem): canonicalize each JID's address before locking AND
			// before writing. `signalStorage` resolves PN→LID at the storage
			// boundary, so an uncanonicalized delete on a PN JID would (a)
			// lock `session.<pnAddr>` while concurrent encrypt/decrypt for
			// the same logical contact locks `session.<lidAddr>` (race), AND
			// (b) potentially leave the actual canonical LID session intact
			// because the write goes to the canonical record via storage's
			// own resolution. Lock + write both on canonical addr aligns
			// with encrypt/decrypt/injectE2ESession.
			const sessionUpdates: { [key: string]: null } = {}
			const sessionAddrs: string[] = []
			for (const jid of jids) {
				const canonicalJid = await resolveCanonicalJid(jid)
				const canonicalAddr = jidToSignalProtocolAddress(canonicalJid).toString()
				sessionUpdates[canonicalAddr] = null
				sessionAddrs.push(canonicalAddr)
			}

			// Stage 2 H4 fix (upstream #2572): lock the ACTUAL per-jid session
			// records being deleted, not the synthetic `delete-N-sessions`
			// string. Now serializes correctly against concurrent
			// encrypt/decrypt transactions on any of these jids — a delete
			// can no longer race past an in-flight encrypt that's still
			// reading the same session.
			return parsedKeys.transactWith(
				{ records: sessionAddrs.map(id => ({ type: 'session', id })) },
				async () => {
					await auth.keys.set({ session: sessionUpdates })
				}
			)
		},

		// Release in-memory caches and timers on socket close (adapted from #2191). Uses our own
		// lidMapping.destroy() (UAF-safe) rather than upstream's simpler close().
		//
		// CRITICAL: cacheMetricsInterval must be cleared here. Its callback closure pins this entire
		// repository (every LRU cache + lidMapping) in memory. On reconnect the consumer builds a
		// fresh repository, so a stale interval would keep the OLD one alive forever — the dominant
		// source of the gradual memory growth seen across many daily reconnects.
		close() {
			clearInterval(cacheMetricsInterval)
			storage.clearPendingPreKeyDeletions()
			identityKeyCache.clear()
			deviceListCache.clear()
			migrationInFlight.clear()
			migratedSessionCache.clear()
			lidMapping.destroy()
		},

		/**
		 * Known limitation (PR #457 round-3 CodeRabbit Major heavy lift):
		 *
		 * `existingSessions`, `deviceJids`, and `migrationRecords` are derived
		 * BEFORE the `transactWith` lock is acquired. In a strict reading,
		 * a PN session created/deleted/updated between the prefetch and the
		 * lock acquisition could be missed by this migration. Fully closing
		 * this requires lock-then-read-then-decide — a refactor not done
		 * here due to the migration's per-device complexity.
		 *
		 * Mitigations preserved by InfiniteAPI:
		 * - `migrationInFlight` Map dedups concurrent callers for the SAME
		 *   user, so the typical "two LID messages arrive at once" pattern
		 *   only computes one snapshot.
		 * - `migratedSessionCache` (3-day TTL) makes subsequent calls cheap
		 *   and the cache is populated INSIDE the transaction (caching only
		 *   committed state).
		 * - The lock scope DOES cover every device we discovered, so
		 *   in-transaction reads of `existingSessions` are correct for the
		 *   devices that WERE in the snapshot.
		 *
		 * Worst-case impact: a PN session created in the gap between
		 * prefetch and lock would be missed THIS round; next migration call
		 * for the same user (after `migrationInFlight` settles) re-prefetches
		 * and catches it.
		 *
		 * Deferred to a focused refactor PR with concurrent-migration tests.
		 */
		async migrateSession(
			fromJid: string,
			toJid: string
		): Promise<{ migrated: number; skipped: number; total: number }> {
			// TODO: use usync to handle this entire mess
			if (!fromJid || !isAnyLidUser(toJid)) return { migrated: 0, skipped: 0, total: 0 }

			// Only support PN to LID migration
			if (!isAnyPnUser(fromJid)) {
				return { migrated: 0, skipped: 0, total: 1 }
			}

			const decoded1 = jidDecode(fromJid)
			if (!decoded1) {
				logger.warn({ fromJid }, 'bulkDeviceMigration: failed to decode fromJid, aborting migration')
				return { migrated: 0, skipped: 0, total: 0 }
			}

			const { user } = decoded1

			// In-flight deduplication: if a migration is already running for this PN user,
			// return the existing Promise. The check+set is synchronous (before any await)
			// so it is safe in Node.js's single-threaded model.
			const inFlight = migrationInFlight.get(user)
			if (inFlight) {
				logger.trace({ fromJid }, 'migrateSession: reusing in-flight migration for same user')
				return inFlight
			}

			const migrationPromise = (async (): Promise<{ migrated: number; skipped: number; total: number }> => {
				// Get user's device list — use in-memory cache to avoid a DB round-trip on
				// every incoming LID message. Cache is invalidated after 5 minutes.
				// We use undefined to mean "not yet checked" and [] to mean "checked, no devices
				// found" so that DB misses are also cached and don't cause a per-message lookup.
				let userDevices: string[] | undefined = deviceListCache.get(user)
				if (userDevices === undefined) {
					logger.debug({ fromJid }, 'bulk device migration - loading all user devices from DB')
					const result = await parsedKeys.get('device-list', [user])
					userDevices = result[user] ?? []
					deviceListCache.set(user, userDevices)
				} else {
					logger.trace({ fromJid, deviceCount: userDevices.length }, 'bulk device migration - device list from cache')
				}

				if (userDevices.length === 0) {
					return { migrated: 0, skipped: 0, total: 0 }
				}

				// Work on a copy so we don't mutate the cached array
				userDevices = [...userDevices]

				const { device: fromDevice } = decoded1
				const fromDeviceStr = fromDevice?.toString() || '0'
				if (!userDevices.includes(fromDeviceStr)) {
					userDevices.push(fromDeviceStr)
				}

				// Filter out cached devices before database fetch
				const uncachedDevices = userDevices.filter(device => {
					const deviceKey = `${user}.${device}`
					return !migratedSessionCache.has(deviceKey)
				})

				// All devices already confirmed as migrated — skip DB lookups entirely
				if (uncachedDevices.length === 0) {
					logger.debug(
						{ fromJid, totalDevices: userDevices.length },
						'bulk device migration - all devices already cached, skipping'
					)
					return { migrated: 0, skipped: 0, total: userDevices.length }
				}

				// Bulk check session existence only for uncached devices.
				//
				// PR #457 round-2 (CodeRabbit Major): build session keys via the
				// canonical `jidToSignalProtocolAddress().toString()` instead of
				// the manual `${user}.${device}` format. For most devices these
				// are identical, BUT hosted device 99 (`${user}:99@hosted`)
				// produces `${user}_hosted.99` — manual format would miss it
				// because the storage key includes the domain prefix.
				// Pre-existing bug surfaced by Stage 2 (records must use same
				// canonical format as locks); aligning prefetch keys eliminates
				// the mismatch entirely.
				const deviceSessionKeyMap = new Map<string, string>() // sessionKey → originating JID
				const deviceSessionKeys: string[] = []
				for (const device of uncachedDevices) {
					const deviceNum = parseInt(device)
					const jid =
						deviceNum === 99
							? `${user}:99@hosted`
							: deviceNum === 0
								? `${user}@s.whatsapp.net`
								: `${user}:${deviceNum}@s.whatsapp.net`
					const sessionKey = jidToSignalProtocolAddress(jid).toString()
					deviceSessionKeyMap.set(sessionKey, jid)
					deviceSessionKeys.push(sessionKey)
				}

				const existingSessions = await parsedKeys.get('session', deviceSessionKeys)

				// Step 3: Convert existing sessions to JIDs (only migrate sessions that exist).
				// PR #457 round-2: use the deviceSessionKeyMap to recover the JID we
				// used to build each sessionKey — handles both canonical-format keys
				// (hosted: `${user}_hosted.99`) and plain (`${user}.${device}`) uniformly.
				const deviceJids: string[] = []
				for (const [sessionKey, sessionData] of Object.entries(existingSessions)) {
					if (sessionData) {
						const originalJid = deviceSessionKeyMap.get(sessionKey)
						if (originalJid) {
							deviceJids.push(originalJid)
						}
					}
				}

				logger.debug(
					{
						fromJid,
						totalDevices: userDevices.length,
						devicesWithSessions: deviceJids.length,
						devices: deviceJids
					},
					'bulk device migration complete - all user devices processed'
				)

				// No PN-format sessions found: all devices are already migrated to LID addressing.
				// Cache them now so subsequent messages skip redundant DB lookups entirely.
				if (deviceJids.length === 0) {
					for (const device of uncachedDevices) {
						migratedSessionCache.set(`${user}.${device}`, true)
					}

					return { migrated: 0, skipped: 0, total: userDevices.length }
				}

				// Stage 2 H4 hybrid (upstream #2572 + InfiniteAPI migration caches):
				// HOIST migrationOps computation OUT of the transaction so the
				// record scope is known before lock acquisition. Upstream Stage 2
				// requires this because `transactWith` needs the records list
				// declared up-front (so LockManager can sort+dedupe before locking).
				//
				// Preserved from InfiniteAPI: deviceListCache, migrationInFlight,
				// migratedSessionCache, existingSessions reuse, uncachedDevices
				// filter, early-exit caching of fully-migrated users. The Stage 2
				// upstream version has NONE of these — they're our perf custom and
				// the hoist here is non-invasive (moves dataflow up, doesn't change
				// semantics).
				type MigrationOp = {
					fromJid: string
					toJid: string
					pnUser: string
					lidUser: string
					deviceId: number
					fromAddr: libsignal.ProtocolAddress
					toAddr: libsignal.ProtocolAddress
				}

				const migrationOps: MigrationOp[] = deviceJids.map(jid => {
					const lidWithDevice = transferDevice(jid, toJid)
					const fromDecoded = jidDecode(jid)
					const toDecoded = jidDecode(lidWithDevice)
					if (!fromDecoded || !toDecoded) {
						throw new Error(`Failed to decode JID during migration: ${jid} -> ${lidWithDevice}`)
					}

					return {
						fromJid: jid,
						toJid: lidWithDevice,
						pnUser: fromDecoded.user,
						lidUser: toDecoded.user,
						deviceId: fromDecoded.device || 0,
						fromAddr: jidToSignalProtocolAddress(jid),
						toAddr: jidToSignalProtocolAddress(lidWithDevice)
					}
				})

				// Stage 2 H4 fix: lock scope is the actual device-list + every PN/LID
				// session pair we're touching. Replaces the synthetic
				// `migrate-N-sessions-X` key. Now serializes correctly against
				// concurrent decryptMessage/encryptMessage transactions on any of
				// these session addresses — a migration can no longer race past an
				// in-flight encrypt that's reading the same session.
				const migrationRecords: RecordRef[] = [
					{ type: 'device-list', id: user },
					...migrationOps.flatMap(op => [
						{ type: 'session' as const, id: op.fromAddr.toString() },
						{ type: 'session' as const, id: op.toAddr.toString() }
					])
				]

				return parsedKeys.transactWith(
					{ records: migrationRecords },
					async (): Promise<{ migrated: number; skipped: number; total: number }> => {
						const totalOps = migrationOps.length
						let migratedCount = 0

						// Reuse existingSessions fetched above — for PN users on s.whatsapp.net the
						// signal-address format (user.device) is identical to deviceSessionKeys, so
						// existingSessions already contains every session needed here.
						// Avoids a redundant storage round-trip inside the transaction.
						const pnSessions = existingSessions

						// Prepare bulk session updates (PN → LID migration + deletion)
						const sessionUpdates: { [key: string]: Uint8Array | null } = {}

						for (const op of migrationOps) {
							const pnAddrStr = op.fromAddr.toString()
							const lidAddrStr = op.toAddr.toString()

							const pnSession = pnSessions[pnAddrStr]
							if (pnSession) {
								// Session exists (guaranteed from device discovery)
								const fromSession = libsignal.SessionRecord.deserialize(pnSession)
								if (fromSession.haveOpenSession()) {
									// Queue for bulk update: copy to LID, retain PN session.
									// WABA retains both PN and LID sessions during migration to avoid
									// No Session errors if messages arrive via PN before migration completes.
									sessionUpdates[lidAddrStr] = fromSession.serialize()

									migratedCount++
								}
							}
						}

						// Single bulk session update for all migrations
						if (Object.keys(sessionUpdates).length > 0) {
							await parsedKeys.set({ session: sessionUpdates })
							logger.debug({ migratedSessions: migratedCount }, 'bulk session migration complete')
						}

						// Cache ALL processed devices (migrated, skipped, or closed-session) to prevent
						// redundant DB lookups on subsequent messages from the same contact.
						for (const op of migrationOps) {
							migratedSessionCache.set(`${op.pnUser}.${op.deviceId}`, true)
						}

						const skippedCount = totalOps - migratedCount
						return { migrated: migratedCount, skipped: skippedCount, total: totalOps }
					}
				)
			})()

			migrationInFlight.set(user, migrationPromise)
			// `void` marks this finally chain as intentionally fire-and-forget.
			// The original `migrationPromise` returned below is the awaited
			// reference; this auxiliary chain only services the inFlight
			// cleanup. Without `void`, no-floating-promises flags it (PR #451
			// CodeRabbit lint nit).
			void migrationPromise.finally(() => migrationInFlight.delete(user))
			return migrationPromise
		}
	}

	return repository
}

const jidToSignalProtocolAddress = (jid: string): libsignal.ProtocolAddress => {
	const decoded = jidDecode(jid)
	if (!decoded) {
		throw new Error(`Failed to decode JID: "${jid}"`)
	}

	const { user, device, server, domainType } = decoded

	if (!user) {
		throw new Error(
			`JID decoded but user is empty: "${jid}" -> user: "${user}", server: "${server}", device: ${device}`
		)
	}

	const signalUser = domainType !== WAJIDDomains.WHATSAPP ? `${user}_${domainType}` : user
	const finalDevice = device || 0

	if (device === 99 && decoded.server !== 'hosted' && decoded.server !== 'hosted.lid') {
		throw new Error('Unexpected non-hosted device JID with device 99. This ID seems invalid. ID:' + jid)
	}

	return new libsignal.ProtocolAddress(signalUser, finalDevice)
}

const jidToSignalSenderKeyName = (group: string, user: string): SenderKeyName => {
	return new SenderKeyName(group, jidToSignalProtocolAddress(user))
}

/**
 * Extended SignalStorage with identity key management
 * This type adds identity key operations to the standard Signal storage
 */
type ExtendedSignalStorage = SenderKeyStore &
	libsignal.SignalStorage & {
		/**
		 * Load identity key for a contact
		 * @param id - Signal protocol address string
		 * @returns Identity key bytes or undefined if not found
		 */
		loadIdentityKey(id: string): Promise<Uint8Array | undefined>

		/**
		 * Save/update identity key for a contact
		 * Handles Trust On First Use (TOFU) and change detection
		 *
		 * @param id - Signal protocol address string
		 * @param identityKey - The identity key bytes (33 bytes with type prefix)
		 * @returns Result indicating if key changed, is new, and fingerprints
		 */
		saveIdentity(id: string, identityKey: Uint8Array): Promise<IdentitySaveResult>

		/** Cancel pending PreKey deletion timers (5-min grace window) — called on socket close so the
		 * Map entries stop pinning the storage closure across reconnects. */
		clearPendingPreKeyDeletions(): void
	}

function signalStorage(
	{ creds, keys }: SignalAuthState,
	lidMapping: LIDMappingStore,
	identityKeyCache: LRUCache<string, Uint8Array>,
	ev?: BaileysEventEmitter,
	logger?: ILogger
): ExtendedSignalStorage {
	// Shared function to resolve PN signal address to LID if mapping exists
	const resolveLIDSignalAddress = async (id: string): Promise<string> => {
		if (id.includes('.')) {
			const [deviceId, device] = id.split('.')
			if (!deviceId) {
				throw new Error('Missing device ID')
			}

			const [user, domainType_] = deviceId.split('_')
			const domainType = parseInt(domainType_ || '0')

			if (domainType === WAJIDDomains.LID || domainType === WAJIDDomains.HOSTED_LID) return id

			const pnJid = `${user!}${device !== '0' ? `:${device}` : ''}@${domainType === WAJIDDomains.HOSTED ? 'hosted' : 's.whatsapp.net'}`

			const lidForPN = await lidMapping.getLIDForPN(pnJid)
			if (lidForPN) {
				const lidAddr = jidToSignalProtocolAddress(lidForPN)
				return lidAddr.toString()
			}
		}

		return id
	}

	// Delayed PreKey deletion: grace period to handle race conditions
	// where two pkmsg with the same preKeyId arrive nearly simultaneously.
	// WABA deletes immediately (33ms), but we add a 5-min grace period
	// because we can't handle "Invalid PreKey ID" errors at the native level.
	const PREKEY_GRACE_PERIOD_MS = 5 * 60 * 1000 // 5 minutes
	const pendingPreKeyDeletions = new Map<string, ReturnType<typeof setTimeout>>()

	return {
		/**
		 * Flush pending PreKey deletions on socket close.
		 *
		 * PR #451 cubic-dev finding (P2): the previous implementation only
		 * cancelled the 5-minute grace timers without running the actual
		 * `keys.set({ 'pre-key': { [id]: null } })` they were scheduled to
		 * perform. Consumed prekeys would then linger in persistent auth
		 * storage across the close → reconnect cycle (and grow without bound
		 * over many reconnects, defeating the leak-prevention work from
		 * PR #448).
		 *
		 * The flush is best-effort. The grace period exists to handle the
		 * race where two pkmsg arrive with the same preKeyId nearly
		 * simultaneously, but during socket close no new pkmsg can arrive
		 * (decryption path is dormant), so collapsing the wait is safe. If
		 * the keystore is being torn down concurrently the .catch swallows
		 * the failure — same contract the timer body itself used.
		 */
		clearPendingPreKeyDeletions: () => {
			// Collect all pending deletions, then issue ONE keys.set instead of
			// N (PR #451 CodeRabbit quick-win). For SQL-backed stores this
			// collapses N round-trips + N lock acquisitions into 1 and gives
			// the batch atomic semantics. Same swallow contract as before —
			// keystore may be destroyed concurrently with close, that's fine.
			const deletions: Record<number, null> = {}
			for (const [keyId, timer] of pendingPreKeyDeletions) {
				clearTimeout(timer)
				deletions[Number(keyId)] = null
			}

			if (Object.keys(deletions).length > 0) {
				// `keys.set` return type is `Awaitable<void>` = `void | Promise<void>`.
				// Defer the call into a `.then` (PR #451 CodeRabbit follow-up):
				// a non-async implementation that throws SYNCHRONOUSLY would
				// otherwise escape before `.catch` is attached. Wrapping with
				// `Promise.resolve().then(() => keys.set(...))` converts any
				// synchronous throw into a rejection that the `.catch` below
				// can swallow uniformly with async rejections. Our in-repo
				// implementations are all async, but the type allows non-async
				// (third-party stores in Astra-Api etc).
				void Promise.resolve()
					.then(() => keys.set({ 'pre-key': deletions }))
					.catch(() => {
						// Keystore may be destroyed if connection closed — safe to ignore
					})
			}

			pendingPreKeyDeletions.clear()
		},
		loadSession: async (id: string) => {
			try {
				const wireJid = await resolveLIDSignalAddress(id)
				const { [wireJid]: sess } = await keys.get('session', [wireJid])

				if (sess) {
					return libsignal.SessionRecord.deserialize(sess)
				}
			} catch (e) {
				return null
			}

			return null
		},
		storeSession: async (id: string, session: libsignal.SessionRecord) => {
			const wireJid = await resolveLIDSignalAddress(id)
			await keys.set({ session: { [wireJid]: session.serialize() } })
		},
		isTrustedIdentity: () => {
			return true // todo: implement proper trust management
		},
		loadPreKey: async (id: number | string) => {
			const keyId = id.toString()
			const { [keyId]: key } = await keys.get('pre-key', [keyId])
			if (key) {
				return {
					privKey: Buffer.from(key.private),
					pubKey: Buffer.from(key.public)
				}
			}
		},
		removePreKey: (id: number) => {
			const keyId = id.toString()
			// Clear any existing timer for this key
			const existing = pendingPreKeyDeletions.get(keyId)
			if (existing) {
				clearTimeout(existing)
			}

			// Schedule deletion after grace period
			const timer = setTimeout(async () => {
				pendingPreKeyDeletions.delete(keyId)
				try {
					await keys.set({ 'pre-key': { [id]: null } })
				} catch {
					// Keystore may be destroyed if connection closed — safe to ignore
				}
			}, PREKEY_GRACE_PERIOD_MS)

			pendingPreKeyDeletions.set(keyId, timer)
		},
		loadSignedPreKey: () => {
			const key = creds.signedPreKey
			return {
				privKey: Buffer.from(key.keyPair.private),
				pubKey: Buffer.from(key.keyPair.public)
			}
		},
		loadSenderKey: async (senderKeyName: SenderKeyName) => {
			const keyId = senderKeyName.toString()
			const { [keyId]: key } = await keys.get('sender-key', [keyId])
			if (key) {
				return SenderKeyRecord.deserialize(key)
			}

			return new SenderKeyRecord()
		},
		storeSenderKey: async (senderKeyName: SenderKeyName, key: SenderKeyRecord) => {
			const keyId = senderKeyName.toString()
			const serialized = JSON.stringify(key.serialize())
			await keys.set({ 'sender-key': { [keyId]: Buffer.from(serialized, 'utf-8') } })
		},
		getOurRegistrationId: () => creds.registrationId,
		getOurIdentity: () => {
			const { signedIdentityKey } = creds
			return {
				privKey: Buffer.from(signedIdentityKey.private),
				pubKey: Buffer.from(generateSignalPubKey(signedIdentityKey.public))
			}
		},

		// ============================================
		// Identity Key Management (NEW)
		// ============================================

		/**
		 * Load identity key for a contact from cache or storage
		 */
		loadIdentityKey: async (id: string): Promise<Uint8Array | undefined> => {
			const timer = metrics.signalIdentityKeyOperations?.startTimer({ operation: 'load' })

			try {
				const wireJid = await resolveLIDSignalAddress(id)

				// Check cache first
				const cached = identityKeyCache.get(wireJid)
				if (cached) {
					metrics.signalIdentityKeyCacheHits?.inc()
					return cached
				}

				metrics.signalIdentityKeyCacheMisses?.inc()

				// Load from storage
				const { [wireJid]: key } = await keys.get('identity-key', [wireJid])

				if (key) {
					// Populate cache
					identityKeyCache.set(wireJid, key)
					return key
				}

				return undefined
			} finally {
				timer?.()
			}
		},

		/**
		 * Save identity key for a contact with change detection
		 * Implements Trust On First Use (TOFU) and emits events on changes
		 */
		saveIdentity: async (id: string, identityKey: Uint8Array): Promise<IdentitySaveResult> => {
			const timer = metrics.signalIdentityKeyOperations?.startTimer({ operation: 'save' })

			try {
				const wireJid = await resolveLIDSignalAddress(id)
				const currentFingerprint = generateKeyFingerprint(identityKey)

				// Load existing key (from cache or storage)
				const { [wireJid]: existingKey } = await keys.get('identity-key', [wireJid])

				// Check if keys match
				const keysMatch =
					existingKey?.length === identityKey.length && existingKey.every((byte, i) => byte === identityKey[i])

				if (existingKey && !keysMatch) {
					// IDENTITY KEY CHANGED - contact reinstalled WhatsApp or switched devices
					const previousFingerprint = generateKeyFingerprint(existingKey)

					// Delete old session and save new identity key atomically.
					// Store identity in BOTH LID and PN addresses (WABA stores in both
					// recipient_account_type=0 and type=1 with CONFLICT_REPLACE).
					const identityUpdates: Record<string, Uint8Array> = { [wireJid]: identityKey }
					if (wireJid !== id) {
						identityUpdates[id] = identityKey
					}

					await keys.set({
						session: { [wireJid]: null },
						'identity-key': identityUpdates
					})

					// Update cache for both addresses
					identityKeyCache.set(wireJid, identityKey)
					if (wireJid !== id) {
						identityKeyCache.set(id, identityKey)
					}

					// Record metrics
					metrics.signalIdentityChanges?.inc({ type: 'changed' })

					// Emit event for application to notify user
					if (ev) {
						ev.emit('identity.changed', {
							jid: wireJid,
							previousKeyFingerprint: previousFingerprint,
							newKeyFingerprint: currentFingerprint,
							timestamp: Date.now(),
							isNewContact: false
						})
					}

					logger?.warn(
						{
							event: 'identity_key_changed',
							jid: wireJid,
							previousFingerprint,
							newFingerprint: currentFingerprint
						},
						'Contact identity key changed - security code changed'
					)

					return {
						changed: true,
						isNew: false,
						previousFingerprint,
						currentFingerprint
					}
				}

				if (!existingKey) {
					// NEW CONTACT - Trust On First Use (TOFU)
					// Store in both LID and PN addresses (aligned with WABA dual identity storage)
					const identityUpdates: Record<string, Uint8Array> = { [wireJid]: identityKey }
					if (wireJid !== id) {
						identityUpdates[id] = identityKey
					}

					await keys.set({ 'identity-key': identityUpdates })

					// Update cache for both addresses
					identityKeyCache.set(wireJid, identityKey)
					if (wireJid !== id) {
						identityKeyCache.set(id, identityKey)
					}

					// Record metrics
					metrics.signalIdentityChanges?.inc({ type: 'new' })

					// Emit event for new contact
					if (ev) {
						ev.emit('identity.changed', {
							jid: wireJid,
							previousKeyFingerprint: null,
							newKeyFingerprint: currentFingerprint,
							timestamp: Date.now(),
							isNewContact: true
						})
					}

					return {
						changed: false,
						isNew: true,
						currentFingerprint
					}
				}

				// Key unchanged
				return {
					changed: false,
					isNew: false,
					currentFingerprint
				}
			} finally {
				timer?.()
			}
		}
	}
}
