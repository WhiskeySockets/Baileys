/* @ts-ignore */
import { createHash } from 'crypto'
import * as libsignal from 'libsignal'
import { LRUCache } from 'lru-cache'
import type { LIDMapping, SignalAuthState, SignalKeyStoreWithTransaction } from '../Types'
import type { BaileysEventEmitter } from '../Types/Events'
import type { SignalRepositoryWithLIDStore } from '../Types/Signal'
import { generateSignalPubKey } from '../Utils'
import { CircuitBreaker } from '../Utils/circuit-breaker.js'
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
	/** Circuit breaker for prekey operations (optional) */
	preKeyCircuitBreaker?: CircuitBreaker
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
	const { ev, preKeyCircuitBreaker } = options || {}
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

	const storage = signalStorage(auth, lidMapping, identityKeyCache, ev, preKeyCircuitBreaker, logger)

	const parsedKeys = auth.keys as SignalKeyStoreWithTransaction
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

	const repository: SignalRepositoryWithLIDStore = {
		decryptGroupMessage({ group, authorJid, msg }) {
			const senderName = jidToSignalSenderKeyName(group, authorJid)
			const cipher = new GroupCipher(storage, senderName)

			// Use transaction to ensure atomicity
			return parsedKeys.transaction(async () => {
				return cipher.decrypt(msg)
			}, group)
		},
		async processSenderKeyDistributionMessage({ item, authorJid }) {
			const builder = new GroupSessionBuilder(storage)
			if (!item.groupId) {
				throw new Error('Group ID is required for sender key distribution message')
			}

			const senderName = jidToSignalSenderKeyName(item.groupId, authorJid)

			const senderMsg = new SenderKeyDistributionMessage(
				null,
				null,
				null,
				null,
				item.axolotlSenderKeyDistributionMessage
			)
			const senderNameStr = senderName.toString()
			const { [senderNameStr]: senderKey } = await auth.keys.get('sender-key', [senderNameStr])
			if (!senderKey) {
				await storage.storeSenderKey(senderName, new SenderKeyRecord())
			}

			return parsedKeys.transaction(async () => {
				const { [senderNameStr]: senderKey } = await auth.keys.get('sender-key', [senderNameStr])
				if (!senderKey) {
					await storage.storeSenderKey(senderName, new SenderKeyRecord())
				}

				await builder.process(senderName, senderMsg)
			}, item.groupId)
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

								// Reset prekey circuit breaker since we identified the cause
								// Reset regardless of state (could be open, half-open, or closed with accumulated failures)
								// eslint-disable-next-line max-depth
								if (preKeyCircuitBreaker) {
									preKeyCircuitBreaker.reset()
									logger.debug({ jid }, 'Reset prekey circuit breaker after identity key change detection')
								}
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

			// If it's not a sync message, we need to ensure atomicity
			// For regular messages, we use a transaction to ensure atomicity
			return parsedKeys.transaction(async () => {
				return await doDecrypt()
			}, jid)
		},

		async encryptMessage({ jid, data }) {
			const addr = jidToSignalProtocolAddress(jid)
			const cipher = new libsignal.SessionCipher(storage, addr)

			// Use transaction to ensure atomicity
			return parsedKeys.transaction(async () => {
				const { type: sigType, body } = await cipher.encrypt(data)
				const type = sigType === 3 ? 'pkmsg' : 'msg'
				return { type, ciphertext: Buffer.from(body, 'binary') }
			}, jid)
		},

		async encryptGroupMessage({ group, meId, data }) {
			const senderName = jidToSignalSenderKeyName(group, meId)
			const builder = new GroupSessionBuilder(storage)

			const senderNameStr = senderName.toString()

			return parsedKeys.transaction(async () => {
				const { [senderNameStr]: senderKey } = await auth.keys.get('sender-key', [senderNameStr])
				if (!senderKey) {
					await storage.storeSenderKey(senderName, new SenderKeyRecord())
				}

				const senderKeyDistributionMessage = await builder.create(senderName)
				const session = new GroupCipher(storage, senderName)
				const ciphertext = await session.encrypt(data)

				return {
					ciphertext,
					senderKeyDistributionMessage: senderKeyDistributionMessage.serialize()
				}
			}, group)
		},

		async injectE2ESession({ jid, session }) {
			logger.trace({ jid }, 'injecting E2EE session')
			const cipher = new libsignal.SessionBuilder(storage, jidToSignalProtocolAddress(jid))
			return parsedKeys.transaction(async () => {
				await cipher.initOutgoing(session)
			}, jid)
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

			// Convert JIDs to signal addresses and prepare for bulk deletion
			const sessionUpdates: { [key: string]: null } = {}
			jids.forEach(jid => {
				const addr = jidToSignalProtocolAddress(jid)
				sessionUpdates[addr.toString()] = null
			})

			// Single transaction for all deletions
			return parsedKeys.transaction(async () => {
				await auth.keys.set({ session: sessionUpdates })
			}, `delete-${jids.length}-sessions`)
		},

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
				logger.debug({ fromJid, totalDevices: userDevices.length }, 'bulk device migration - all devices already cached, skipping')
				return { migrated: 0, skipped: 0, total: userDevices.length }
			}

			// Bulk check session existence only for uncached devices
			const deviceSessionKeys = uncachedDevices.map(device => `${user}.${device}`)
			const existingSessions = await parsedKeys.get('session', deviceSessionKeys)

			// Step 3: Convert existing sessions to JIDs (only migrate sessions that exist)
			const deviceJids: string[] = []
			for (const [sessionKey, sessionData] of Object.entries(existingSessions)) {
				if (sessionData) {
					// Session exists in storage
					const deviceStr = sessionKey.split('.')[1]
					if (!deviceStr) continue
					const deviceNum = parseInt(deviceStr)
					let jid = deviceNum === 0 ? `${user}@s.whatsapp.net` : `${user}:${deviceNum}@s.whatsapp.net`
					if (deviceNum === 99) {
						jid = `${user}:99@hosted`
					}

					deviceJids.push(jid)
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

			// Single transaction for all migrations
			return parsedKeys.transaction(
				async (): Promise<{ migrated: number; skipped: number; total: number }> => {
					// Prepare migration operations with addressing metadata
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
								// Queue for bulk update: copy to LID, delete from PN
								sessionUpdates[lidAddrStr] = fromSession.serialize()
								sessionUpdates[pnAddrStr] = null

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
				},
				`migrate-${deviceJids.length}-sessions-${jidDecode(toJid)?.user}`
			)
			})()

			migrationInFlight.set(user, migrationPromise)
			migrationPromise.finally(() => migrationInFlight.delete(user))
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
	}

function signalStorage(
	{ creds, keys }: SignalAuthState,
	lidMapping: LIDMappingStore,
	identityKeyCache: LRUCache<string, Uint8Array>,
	ev?: BaileysEventEmitter,
	preKeyCircuitBreaker?: CircuitBreaker,
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

	return {
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
		removePreKey: (id: number) => keys.set({ 'pre-key': { [id]: null } }),
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

					// Delete old session and save new identity key atomically
					await keys.set({
						session: { [wireJid]: null },
						'identity-key': { [wireJid]: identityKey }
					})

					// Update cache
					identityKeyCache.set(wireJid, identityKey)

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
					await keys.set({ 'identity-key': { [wireJid]: identityKey } })

					// Update cache
					identityKeyCache.set(wireJid, identityKey)

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
