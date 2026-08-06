import { Boom } from '@hapi/boom'
import { LRUCache } from 'lru-cache'
import type { SignalChanges, SignalSnapshot, SignalStorage } from 'whatsapp-rust-bridge'
import {
	decryptPreKeyWithSnapshot,
	decryptWhisperWithSnapshot,
	encryptWithSnapshot,
	GroupCipher,
	GroupSessionBuilder,
	hasLogger,
	importLegacySessionRecordV1,
	processBundleWithSnapshot,
	projectLegacySenderKeyRecordV1,
	projectLegacySessionRecordV1,
	ProtocolAddress,
	SenderKeyDistributionMessage,
	SenderKeyName,
	SessionRecord,
	setLogger
} from 'whatsapp-rust-bridge'
import { proto } from '../../WAProto/index.js'
import type {
	LIDMapping,
	RecordRef,
	SignalAuthState,
	SignalDataSet,
	SignalDataTypeMap,
	SignalKeyStoreWithRecordTransaction,
	SignalKeyStoreWithTransaction
} from '../Types'
import type { SignalRepositoryWithLIDStore } from '../Types/Signal'
import { generateSignalPubKey } from '../Utils/crypto'
import { MISSING_KEYS_ERROR_TEXT } from '../Utils/decode-wa-message'
import type { ILogger } from '../Utils/logger'
import {
	isHostedLidUser,
	isHostedPnUser,
	isLidUser,
	isPnUser,
	jidDecode,
	jidEncode,
	transferDevice,
	WAJIDDomains
} from '../WABinary'
import { hasOpenLegacySession, isLegacySessionEntry, isLegacySessionRecord, legacySessionInfo } from './legacy-session'
import { fromTypedRecord, toTypedRecord } from './legacy-session-codec'
import { LIDMappingStore } from './lid-mapping'

/**
 * Resolve a signal-protocol-address string (`user[_domainType].device`) to its
 * post-LID-mapping form. If `id` is already a LID/HOSTED_LID address, or no PN
 * mapping exists, it's returned unchanged.
 *
 * Lifted from `signalStorage()`'s closure (where it was hidden as a private
 * helper) so the repository methods can pre-resolve before acquiring locks —
 * otherwise `transactWith` would lock the raw PN id while
 * `loadSession`/`storeSession`/`saveIdentity` internally rewrite to the LID
 * form, letting two callers think they're touching different records when
 * they're actually mutating the same underlying storage row.
 */
async function resolveSignalAddressId(id: string, lidMapping: LIDMappingStore): Promise<string> {
	if (!id.includes('.')) return id

	const [deviceId, device] = id.split('.')
	const [user, domainType_] = deviceId!.split('_')
	const domainType = parseInt(domainType_ || '0')

	if (domainType === WAJIDDomains.LID || domainType === WAJIDDomains.HOSTED_LID) return id

	const pnJid = `${user!}${device !== '0' ? `:${device}` : ''}@${domainType === WAJIDDomains.HOSTED ? 'hosted' : 's.whatsapp.net'}`
	const lidForPN = await lidMapping.getLIDForPN(pnJid)
	if (lidForPN) {
		const lidAddr = jidToSignalProtocolAddress(lidForPN)
		return lidAddr.toString()
	}

	return id
}

/**
 * The bridge rejects with plain strings. Callers match on `.message` and log
 * `err.stack`, so hand them a real Error while keeping the text intact.
 */
function asError(error: unknown): Error {
	if (error instanceof Error) {
		return error
	}

	return new Error(typeof error === 'string' ? error : String(error))
}

/**
 * The JS libsignal reported an already-consumed message key as
 * `MISSING_KEYS_ERROR_TEXT`, which the receive path matches to ACK the stanza
 * (487) instead of asking the peer to resend. The bridge rejects the same case
 * with a Debug-formatted `DuplicatedMessage(chain, counter)` — and throws plain
 * strings, not Errors — so map it back onto the text messages-recv understands.
 * Without this a redelivered ciphertext drives a pointless retry/resend loop.
 */
function normalizeDecryptError(error: unknown): Error {
	const message = typeof error === 'string' ? error : error instanceof Error ? error.message : ''
	if (message.includes('DuplicatedMessage')) {
		return new Boom(MISSING_KEYS_ERROR_TEXT, { data: { cause: message } })
	}

	return asError(error)
}

/**
 * What the bridge's v1 import accepts per chain. Mirrors MAX_MESSAGE_KEYS in the
 * core: the engine prunes above that plus a threshold, so a live session can
 * legitimately sit above it for a while.
 */
const MAX_LEGACY_MESSAGE_KEYS = 2000

/** The bridge refuses a session it cannot decode; the row has to be replaced. */
function isUnreadableSession(error: unknown): boolean {
	const message = typeof error === 'string' ? error : error instanceof Error ? error.message : ''
	return message.includes('snapshot.session')
}

/** Does a stored session row — bridge bytes or a pre-WASM record — hold a live state? */
function hasOpenSession(stored: Uint8Array | undefined): boolean {
	if (!stored) {
		return false
	}

	if (isLegacySessionRecord(stored)) {
		return hasOpenLegacySession(stored)
	}

	try {
		return SessionRecord.deserialize(stored).haveOpenSession()
	} catch {
		return false
	}
}

/**
 * The one-time pre-key a prekey message will consume, read from its header so
 * the caller can put it in the snapshot instead of the operation fetching it.
 */
function preKeyIdsFrom(ciphertext: Uint8Array): number[] {
	try {
		const parsed = proto.PreKeySignalMessage.decode(ciphertext.slice(1))
		return typeof parsed.preKeyId === 'number' ? [parsed.preKeyId] : []
	} catch {
		return []
	}
}

export function makeLibSignalRepository(
	auth: SignalAuthState,
	logger: ILogger,
	pnToLIDFunc?: (jids: string[]) => Promise<LIDMapping[] | undefined>
): SignalRepositoryWithLIDStore {
	if (!hasLogger()) {
		setLogger(logger)
	}

	const lidMapping = new LIDMappingStore(auth.keys as SignalKeyStoreWithTransaction, logger, pnToLIDFunc)
	const storage = signalStorage(auth, lidMapping)
	// Bound delegate so repository methods can pre-resolve before acquiring locks.
	const resolveLIDSignalAddress = (id: string) => resolveSignalAddressId(id, lidMapping)

	// Baileys' `addTransactionCapability` returns a store with `transactWith`
	// implemented; narrow to the record-transaction variant so the internal
	// call sites don't have to null-check the (publicly optional) method.
	const parsedKeys = auth.keys as SignalKeyStoreWithRecordTransaction
	const { creds } = auth
	const migratedSessionCache = new LRUCache<string, true>({
		ttl: 3 * 24 * 60 * 60 * 1000, // 3 days
		ttlAutopurge: true,
		updateAgeOnGet: true
	})

	const ensureSenderKeyAndCreateSkdm = async (group: string, meId: string) => {
		const senderName = jidToSignalSenderKeyName(group, meId)
		// Do not seed an empty record first: the builder creates one when the row
		// is absent, but a stored empty record loads as a state-less session and
		// the create then fails with InvalidSenderKeySession. The JS backend this
		// replaced took the record object, not its bytes, and did not have that
		// distinction.
		const skdm = await new GroupSessionBuilder(storage).create(senderName)
		return { senderName, skdm }
	}

	/**
	 * Runs one Signal operation over the peer's session.
	 *
	 * The backend gets a snapshot and hands back a changeset, so the operation
	 * never calls into this store while it runs. That is what lets a single lock
	 * on the session record be enough: there is no nested scope to acquire a
	 * second record, and therefore no pair of scopes that can take the same two
	 * records in opposite orders.
	 *
	 * Everything the operation reported lands in one `set`, so a crash cannot
	 * leave the pre-key deleted while the session it belongs to is still the old
	 * one.
	 */
	const withSession = async <T>(
		jid: string,
		run: (snapshot: SignalSnapshot, address: ProtocolAddress) => Promise<{ changes: SignalChanges } & T>,
		extra?: { preKeyIds?: number[] }
	): Promise<T> => {
		const address = jidToSignalProtocolAddress(jid)
		const wireJid = await resolveLIDSignalAddress(address.toString())

		// The identity row is locked alongside the session because applying the
		// changeset writes it too. signalStorage.saveIdentity holds both and can
		// clear the session when the key differs, so taking only the session here
		// would let the two paths overwrite each other. transactWith acquires in a
		// fixed order, so naming both cannot deadlock against it.
		return parsedKeys.transactWith(
			{
				records: [
					{ type: 'session', id: wireJid },
					{ type: 'identity-key', id: wireJid }
				]
			},
			async () => {
				const [sessions, identities] = await Promise.all([
					parsedKeys.get('session', [wireJid]),
					parsedKeys.get('identity-key', [wireJid])
				])

				const preKeys: SignalSnapshot['preKeys'] = []
				for (const id of extra?.preKeyIds ?? []) {
					const { [id]: stored } = await parsedKeys.get('pre-key', [String(id)])
					if (stored) {
						preKeys.push({ id, keyPair: { public: stored.public, private: stored.private } })
					}
				}

				const snapshot: SignalSnapshot = {
					identity: {
						public: creds.signedIdentityKey.public,
						private: creds.signedIdentityKey.private
					},
					registrationId: creds.registrationId,
					session: await readSessionBytes(wireJid, sessions[wireJid]),
					peerIdentity: identities[wireJid],
					preKeys,
					signedPreKeys: [
						{
							id: creds.signedPreKey.keyId,
							keyPair: {
								public: creds.signedPreKey.keyPair.public,
								private: creds.signedPreKey.keyPair.private
							},
							signature: creds.signedPreKey.signature
						}
					]
				}

				let result: { changes: SignalChanges } & T
				try {
					result = await run(snapshot, address)
				} catch (error) {
					// Nothing was written yet, so a failure leaves storage exactly as
					// it was found — no half-applied session.
					throw asError(error)
				}

				const { changes, ...rest } = result
				await applyChanges(wireJid, changes)
				return rest as T
			}
		)
	}

	/**
	 * Sessions are stored in the shape a pre-WASM release wrote them, so this
	 * branch does not change what is on disk. A record the v1 model cannot
	 * express keeps its bridge bytes: `readSessionBytes` accepts both, so the
	 * fallback costs compatibility with an older release for that one row
	 * rather than failing the operation.
	 */
	const toStoredSession = (wireJid: string, session: Uint8Array): SignalDataTypeMap['session'] => {
		const projection = projectLegacySessionRecordV1(session)
		if (projection.status !== 'projected') {
			logger.warn(
				{ wireJid, issue: projection.issue },
				'session not expressible in the legacy shape, storing bridge bytes'
			)
			return session
		}

		// The projection does not bound the skipped-key count but the import
		// does, so a chain that grew past the limit would write cleanly and fail
		// to load. Keep those as bytes rather than storing a row we cannot read.
		const overflowing = projection.record.sessions.some(indexed =>
			indexed.session.chains.some(chain => chain.messageKeys.length > MAX_LEGACY_MESSAGE_KEYS)
		)
		if (overflowing) {
			logger.warn({ wireJid }, 'session holds more skipped keys than the legacy shape accepts, storing bridge bytes')
			return session
		}

		return fromTypedRecord(projection.record) as unknown as SignalDataTypeMap['session']
	}

	/** Pre-WASM records are converted on read; bridge records pass straight through. */
	const readSessionBytes = async (wireJid: string, stored: unknown): Promise<Uint8Array | undefined> => {
		if (!stored) return undefined

		try {
			if (isLegacySessionRecord(stored)) {
				if (!hasOpenLegacySession(stored)) return undefined
				return importLegacySessionRecordV1(toTypedRecord(stored), {
					identityKey: generateSignalPubKey(creds.signedIdentityKey.public),
					registrationId: creds.registrationId
				})
			}

			return stored as Uint8Array
		} catch (error) {
			// A row we cannot read is reported as absent, not raised: a prekey
			// message carries everything needed to build a replacement, and
			// failing here would leave the conversation stuck on the bad row
			// until someone deleted it by hand.
			logger.warn({ wireJid, err: error }, 'stored session is unreadable, treating it as absent')
			return undefined
		}
	}

	/**
	 * One write for everything the operation touched. Absent fields are left
	 * alone: rewriting an untouched record would clobber a concurrent update.
	 */
	const applyChanges = async (wireJid: string, changes: SignalChanges) => {
		const update: SignalDataSet = {}

		if (changes.sessionCleared) {
			update.session = { [wireJid]: null }
		} else if (changes.session) {
			update.session = { [wireJid]: toStoredSession(wireJid, changes.session) }
		}

		if (changes.identity) {
			update['identity-key'] = { [wireJid]: changes.identity }
		}

		if (changes.removedPreKeyId !== undefined) {
			update['pre-key'] = { [changes.removedPreKeyId]: null }
		}

		if (Object.keys(update).length) {
			await parsedKeys.set(update)
		}
	}

	const repository: SignalRepositoryWithLIDStore = {
		decryptGroupMessage({ group, authorJid, msg }) {
			const senderName = jidToSignalSenderKeyName(group, authorJid)
			const cipher = new GroupCipher(storage, group, jidToSignalProtocolAddress(authorJid))

			return parsedKeys.transactWith({ records: [{ type: 'sender-key', id: senderName.toString() }] }, async () => {
				return cipher.decrypt(msg)
			})
		},
		async processSenderKeyDistributionMessage({ item, authorJid }) {
			const builder = new GroupSessionBuilder(storage)
			if (!item.groupId) {
				throw new Error('Group ID is required for sender key distribution message')
			}

			if (!item.axolotlSenderKeyDistributionMessage) {
				throw new Error('Sender key distribution message is required')
			}

			const senderName = jidToSignalSenderKeyName(item.groupId, authorJid)
			const senderMsg = SenderKeyDistributionMessage.deserialize(item.axolotlSenderKeyDistributionMessage)
			const senderNameStr = senderName.toString()

			// The "ensure a SenderKeyRecord exists" check runs INSIDE the
			// per-record transactWith below. The previous pre-lock get + write
			// here was both redundant and unsafe: a concurrent
			// `processSenderKeyDistributionMessage` (or any other writer to the
			// same sender-key record) could commit a populated record between
			// our pre-lock read and our pre-lock write, which our write would
			// then clobber with an empty record. Removing it eliminates that
			// race window without changing observable behavior — the in-lock
			// re-check handles the first-time-seeing-this-sender case.
			return parsedKeys.transactWith({ records: [{ type: 'sender-key', id: senderNameStr }] }, async () =>
				builder.process(senderName, senderMsg)
			)
		},
		async decryptMessage({ jid, type, ciphertext }) {
			// A prekey message names the one-time key it consumes, so the snapshot
			// can carry it: the operation never has to reach back for a record.
			const preKeyIds = type === 'pkmsg' ? preKeyIdsFrom(ciphertext) : []

			const { plaintext } = await withSession(
				jid,
				async (snapshot, address) => {
					try {
						let out
						if (type === 'pkmsg') {
							try {
								out = await decryptPreKeyWithSnapshot(snapshot, address, ciphertext)
							} catch (error) {
								// The row is there but the bridge cannot read it. A prekey
								// message carries everything needed to build a replacement,
								// so retry without it rather than leaving the conversation
								// stuck on a record only a manual delete would clear.
								if (!snapshot.session || !isUnreadableSession(error)) {
									throw error
								}

								logger.warn({ jid }, 'stored session is unreadable, rebuilding from the prekey message')
								out = await decryptPreKeyWithSnapshot({ ...snapshot, session: undefined }, address, ciphertext)
							}
						} else {
							out = await decryptWhisperWithSnapshot(snapshot, address, ciphertext)
						}

						if (out.changes.sessionCleared) {
							logger.info({ jid }, 'identity key changed, session will be re-established')
						}

						return { plaintext: out.plaintext, changes: out.changes }
					} catch (error) {
						throw normalizeDecryptError(error)
					}
				},
				{ preKeyIds }
			)

			return plaintext
		},

		async encryptMessage({ jid, data }) {
			return withSession(jid, async (snapshot, address) => {
				const out = await encryptWithSnapshot(snapshot, address, data)
				return {
					type: out.messageType === 3 ? ('pkmsg' as const) : ('msg' as const),
					ciphertext: out.ciphertext,
					changes: out.changes
				}
			})
		},

		async encryptGroupMessage({ group, meId, data }) {
			const senderName = jidToSignalSenderKeyName(group, meId)
			return parsedKeys.transactWith({ records: [{ type: 'sender-key', id: senderName.toString() }] }, async () => {
				const { skdm } = await ensureSenderKeyAndCreateSkdm(group, meId)
				const ciphertext = await new GroupCipher(storage, group, jidToSignalProtocolAddress(meId)).encrypt(data)
				return { ciphertext, senderKeyDistributionMessage: skdm.serialize() }
			})
		},

		async getSenderKeyDistributionMessage({ group, meId }) {
			const senderName = jidToSignalSenderKeyName(group, meId)
			return parsedKeys.transactWith({ records: [{ type: 'sender-key', id: senderName.toString() }] }, async () => {
				const { skdm } = await ensureSenderKeyAndCreateSkdm(group, meId)
				return skdm.serialize()
			})
		},

		async hasSenderKey({ group, meId }) {
			const senderName = jidToSignalSenderKeyName(group, meId).toString()
			const { [senderName]: key } = await auth.keys.get('sender-key', [senderName])
			return !!key
		},

		async getSessionInfo(jid) {
			const addr = jidToSignalProtocolAddress(jid).toString()
			const serialized = await storage.loadSession(addr)
			if (!serialized) {
				return null
			}

			// A not-yet-converted session arrives as the JS libsignal state, which
			// carries these fields directly — read them so the retry protections
			// also cover sessions that predate the bridge format.
			if (isLegacySessionEntry(serialized)) {
				return legacySessionInfo(serialized)
			}

			// `storage.loadSession` hands the bridge the raw persisted record, and
			// `SessionRecord` only exposes `haveOpenSession`/`serialize` — no accessor
			// for the open state's fields. Decode the record here instead: it is the
			// wire `RecordStructure` protobuf, whose schema WAProto already carries.
			try {
				const { currentSession } = proto.RecordStructure.decode(serialized)
				const baseKey = currentSession?.aliceBaseKey
				const registrationId = currentSession?.remoteRegistrationId
				if (!baseKey?.length || typeof registrationId !== 'number') {
					return null
				}

				return { baseKey: new Uint8Array(baseKey), registrationId }
			} catch (error) {
				logger.debug({ jid, error }, 'failed to decode session record for session info')
				return null
			}
		},

		async injectE2ESession({ jid, session }) {
			logger.trace({ jid }, 'injecting E2EE session')
			await withSession(jid, async (snapshot, address) => {
				const out = await processBundleWithSnapshot(snapshot, address, {
					registrationId: session.registrationId,
					identityKey: session.identityKey,
					preKey: session.preKey ? { keyId: session.preKey.keyId, publicKey: session.preKey.publicKey } : undefined,
					signedPreKey: {
						keyId: session.signedPreKey.keyId,
						publicKey: session.signedPreKey.publicKey,
						signature: session.signedPreKey.signature
					}
				})

				return { changes: out.changes }
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
				const serialized = await storage.loadSession(addr.toString())

				if (!serialized) {
					return { exists: false, reason: 'no session' }
				}

				// `loadSession` only yields a legacy entry when it found an OPEN one,
				// and SessionRecord.deserialize would reject the object outright.
				if (isLegacySessionEntry(serialized)) {
					return { exists: true }
				}

				if (!SessionRecord.deserialize(serialized).haveOpenSession()) {
					return { exists: false, reason: 'no open session' }
				}

				return { exists: true }
			} catch (error) {
				return { exists: false, reason: 'validation error' }
			}
		},

		async deleteSession(jids: string[]) {
			if (!jids.length) return

			// Convert JIDs to signal addresses, pre-resolve each to its wire id
			// so the lock and the actual session-row deletion target the SAME
			// storage record (PN → LID mapping is transparent inside
			// `signalStorage`, so without pre-resolution the lock could be on
			// the PN form while the delete lands on the LID form).
			const sessionUpdates: { [key: string]: null } = {}
			const sessionAddrs: string[] = []
			for (const jid of jids) {
				const addr = jidToSignalProtocolAddress(jid).toString()
				const wireJid = await resolveLIDSignalAddress(addr)
				sessionUpdates[wireJid] = null
				sessionAddrs.push(wireJid)
			}

			// H4 fix: lock by the actual session record ids instead of a synthetic
			// `delete-N-sessions` key. Now serializes against concurrent
			// encrypt/decrypt transactions for any of these jids.
			return parsedKeys.transactWith({ records: sessionAddrs.map(id => ({ type: 'session', id })) }, async () => {
				await auth.keys.set({ session: sessionUpdates })
			})
		},

		close() {
			migratedSessionCache.clear()
			lidMapping.close()
		},

		async migrateSession(
			fromJid: string,
			toJid: string
		): Promise<{ migrated: number; skipped: number; total: number }> {
			// TODO: use usync to handle this entire mess
			if (!fromJid || (!isLidUser(toJid) && !isHostedLidUser(toJid))) return { migrated: 0, skipped: 0, total: 0 }

			// Only support PN to LID migration
			if (!isPnUser(fromJid) && !isHostedPnUser(fromJid)) {
				return { migrated: 0, skipped: 0, total: 1 }
			}

			const { user } = jidDecode(fromJid)!

			logger.debug({ fromJid }, 'bulk device migration - loading all user devices')

			// Get user's device list from storage
			const { [user]: userDevices } = await parsedKeys.get('device-list', [user])
			if (!userDevices) {
				return { migrated: 0, skipped: 0, total: 0 }
			}

			const { device: fromDevice } = jidDecode(fromJid)!
			const fromDeviceStr = fromDevice?.toString() || '0'
			if (!userDevices.includes(fromDeviceStr)) {
				userDevices.push(fromDeviceStr)
			}

			// Filter out cached devices before database fetch
			const uncachedDevices = userDevices.filter(device => {
				const deviceKey = `${user}.${device}`
				return !migratedSessionCache.has(deviceKey)
			})

			// Bulk check session existence only for uncached devices. Device 99 is
			// always hosted, so its row may sit under either the plain or the
			// hosted address depending on whether the mapping was known when the
			// session was created. Probe both, or a live session is left stranded
			// once lookups move to the LID side.
			const deviceSessionKeys: string[] = []
			for (const device of uncachedDevices) {
				deviceSessionKeys.push(`${user}.${device}`)
				if (device === '99') {
					deviceSessionKeys.push(`${user}_${WAJIDDomains.HOSTED}.${device}`)
				}
			}

			const existingSessions = await parsedKeys.get('session', deviceSessionKeys)

			// Step 3: Convert existing sessions to JIDs (only migrate sessions that exist).
			// The address the row was FOUND under is carried forward: re-deriving it
			// from the jid would address `user_128.99` for a row stored at `user.99`.
			const foundByDevice = new Map<number, { jid: string; addrStr: string }>()
			for (const [sessionKey, sessionData] of Object.entries(existingSessions)) {
				if (sessionData) {
					const deviceStr = sessionKey.split('.')[1]
					if (!deviceStr) continue
					const deviceNum = parseInt(deviceStr)
					let jid = deviceNum === 0 ? `${user}@s.whatsapp.net` : `${user}:${deviceNum}@s.whatsapp.net`
					if (deviceNum === 99) {
						jid = `${user}:99@hosted`
					}

					const already = foundByDevice.get(deviceNum)
					if (already) {
						// Both historical shapes hold a row for this device, and they
						// share one destination. Migrating both would delete both and
						// keep whichever landed last, dropping a ratchet that may still
						// be live. Prefer whichever row is still open; if that does not
						// separate them, take the hosted address, which is the shape
						// written today. The row not chosen is left where it is.
						const candidateOpen = hasOpenSession(sessionData)
						const incumbentOpen = hasOpenSession(existingSessions[already.addrStr])
						const takeCandidate = candidateOpen !== incumbentOpen ? candidateOpen : sessionKey.includes('_')

						logger.warn(
							{ device: deviceNum, migrating: takeCandidate ? sessionKey : already.addrStr },
							'device has a session under both the plain and hosted address; migrating one and leaving the other'
						)

						if (takeCandidate) {
							foundByDevice.set(deviceNum, { jid, addrStr: sessionKey })
						}

						continue
					}

					foundByDevice.set(deviceNum, { jid, addrStr: sessionKey })
				}
			}

			const found = Array.from(foundByDevice.values())
			const deviceJids = found.map(entry => entry.jid)

			logger.debug(
				{
					fromJid,
					totalDevices: userDevices.length,
					devicesWithSessions: deviceJids.length,
					devices: deviceJids
				},
				'bulk device migration complete - all user devices processed'
			)

			// Prepare migration operations with addressing metadata up-front so
			// we can build a precise lock scope before entering the critical
			// section (H4 fix: lock the actual session record ids + the
			// device-list record, instead of a synthetic `migrate-N-...` key).
			type MigrationOp = {
				fromJid: string
				toJid: string
				pnUser: string
				lidUser: string
				deviceId: number
				fromAddrStr: string
				toAddr: ProtocolAddress
			}

			const migrationOps: MigrationOp[] = found.map(({ jid, addrStr }) => {
				// transferDevice carries the destination's server, which for a LID
				// target is `lid`. Device 99 only exists on the hosted side, and
				// addressing it as plain LID is rejected outright.
				const lidWithDevice =
					jidDecode(jid)!.device === 99
						? transferDevice(jid, jidEncode(jidDecode(toJid)!.user, 'hosted.lid'))
						: transferDevice(jid, toJid)
				const fromDecoded = jidDecode(jid)!
				const toDecoded = jidDecode(lidWithDevice)!

				return {
					fromJid: jid,
					toJid: lidWithDevice,
					pnUser: fromDecoded.user,
					lidUser: toDecoded.user,
					deviceId: fromDecoded.device || 0,
					fromAddrStr: addrStr,
					toAddr: jidToSignalProtocolAddress(lidWithDevice)
				}
			})

			const sessionRecords: RecordRef[] = []
			for (const op of migrationOps) {
				sessionRecords.push({ type: 'session', id: op.fromAddrStr })
				sessionRecords.push({ type: 'session', id: op.toAddr.toString() })
			}

			return parsedKeys.transactWith(
				{
					records: [{ type: 'device-list', id: user }, ...sessionRecords]
				},
				async (): Promise<{ migrated: number; skipped: number; total: number }> => {
					const totalOps = migrationOps.length
					let migratedCount = 0

					// Bulk fetch PN sessions - already exist (verified during device discovery)
					const pnAddrStrings = Array.from(new Set(migrationOps.map(op => op.fromAddrStr)))
					const pnSessions = await parsedKeys.get('session', pnAddrStrings)
					// Destination rows, needed to avoid overwriting a live LID session
					// with a legacy PN one. Both sides are already inside the lock scope.
					const lidAddrStrings = Array.from(new Set(migrationOps.map(op => op.toAddr.toString())))
					const lidSessions = await parsedKeys.get('session', lidAddrStrings)

					// Prepare bulk session updates (PN → LID migration + deletion)
					const sessionUpdates: { [key: string]: Uint8Array | null } = {}

					for (const op of migrationOps) {
						const pnAddrStr = op.fromAddrStr
						const lidAddrStr = op.toAddr.toString()

						const pnSession = pnSessions[pnAddrStr]
						if (pnSession) {
							// A pre-WASM auth state still holds the JS libsignal object here.
							// Round-tripping it through SessionRecord.deserialize would flatten
							// it to an EMPTY record, so the copy would be skipped and the PN
							// session left stranded behind the now-LID-keyed lookup. Move the
							// record across verbatim and let the storage adapter migrate it on
							// first use, under the key it will actually be read from.
							if (isLegacySessionRecord(pnSession)) {
								// A session established after the upgrade already lives on the
								// LID key and is newer than anything the legacy PN record
								// holds, so it wins. Before this branch existed the legacy
								// record was silently skipped, which preserved it by accident;
								// now that the copy is real the check has to be explicit.
								if (hasOpenLegacySession(pnSession) && !hasOpenSession(lidSessions[lidAddrStr])) {
									sessionUpdates[lidAddrStr] = pnSession
									sessionUpdates[pnAddrStr] = null

									migratedCount++
								}

								continue
							}

							// Session exists (guaranteed from device discovery)
							const fromSession = SessionRecord.deserialize(pnSession)
							// Same rule as the legacy branch above: a live session already on
							// the LID key is newer than this one and must not be overwritten.
							if (fromSession.haveOpenSession() && !hasOpenSession(lidSessions[lidAddrStr])) {
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

						// Cache device-level migrations
						for (const op of migrationOps) {
							if (sessionUpdates[op.toAddr.toString()]) {
								const deviceKey = `${op.pnUser}.${op.deviceId}`
								migratedSessionCache.set(deviceKey, true)
							}
						}
					}

					const skippedCount = totalOps - migratedCount
					return { migrated: migratedCount, skipped: skippedCount, total: totalOps }
				}
			)
		}
	}

	return repository
}

const jidToSignalProtocolAddress = (jid: string): ProtocolAddress => {
	const decoded = jidDecode(jid)!
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

	return new ProtocolAddress(signalUser, finalDevice)
}

const jidToSignalSenderKeyName = (group: string, user: string): SenderKeyName => {
	return new SenderKeyName(group, jidToSignalProtocolAddress(user))
}

function signalStorage(
	{ creds, keys }: SignalAuthState,
	lidMapping: LIDMappingStore,
	/**
	 * Optional pinned-resolution override. When the repository methods
	 * pre-resolve `addrStr → wireJid` to scope a `transactWith` lock, they
	 * pass a per-call `signalStorage` instance with `pinnedResolver` set so
	 * libsignal's internal storage calls don't independently re-resolve
	 * (which would TOCTOU against a mid-flight LID mapping change — see
	 * Stage 3 round 2 commit). The function receives the same raw `id`
	 * libsignal would pass and returns the wire form to use, bypassing
	 * any consult of `lidMapping`.
	 */
	pinnedResolver?: (id: string) => Promise<string>
): SignalStorage & {
	// Members the bridge no longer asks for, but this file still calls: the
	// group path is all the adapter needs from us now.
	loadSession(id: string): Promise<Uint8Array | SignalDataTypeMap['session'] | null>
	storeSession(id: string, session: SessionRecord): Promise<void>
	loadIdentityKey(id: string): Promise<Uint8Array | undefined>
	saveIdentity(id: string, identityKey: Uint8Array): Promise<boolean>
	isTrustedIdentity(): boolean
	loadPreKey(id: number): Promise<{ pubKey: Uint8Array; privKey: Uint8Array } | null>
	removePreKey(id: number): unknown
	loadSignedPreKey(id: number): Promise<unknown>
	getOurRegistrationId(): number
	getOurIdentity(): { privKey: Uint8Array; pubKey: Uint8Array }
} {
	const resolveLIDSignalAddress = pinnedResolver ?? ((id: string) => resolveSignalAddressId(id, lidMapping))

	return {
		loadSession: async (id: string) => {
			try {
				const wireJid = await resolveLIDSignalAddress(id)
				const { [wireJid]: sess } = await keys.get('session', [wireJid])
				if (!sess) {
					return null
				}

				// Pre-WASM auth states hold the JS libsignal object. Convert it through
				// the core's typed model, which reconstructs the message-key material
				// from its seed. The adapter's own field-by-field fallback cannot: it
				// stores the seed as a cipher key and zeroes the mac/iv, so the very
				// first ciphertext the old build enciphered fails its MAC.
				//
				// With every state closed there is nothing safe to hand over — the
				// converted record would promote a closed state to current, and
				// encrypting under a ratchet the peer already dropped yields messages
				// nobody can decrypt. Report "no session" so it renegotiates.
				if (isLegacySessionRecord(sess)) {
					if (!hasOpenLegacySession(sess)) {
						return null
					}

					return importLegacySessionRecordV1(toTypedRecord(sess), {
						identityKey: generateSignalPubKey(creds.signedIdentityKey.public),
						registrationId: creds.registrationId
					})
				}

				return sess
			} catch (e) {
				return null
			}
		},
		storeSession: async (id: string, session: SessionRecord) => {
			const wireJid = await resolveLIDSignalAddress(id)
			await keys.set({ session: { [wireJid]: session.serialize() } })
		},
		isTrustedIdentity: () => {
			return true // TOFU - Trust on First Use (same as WhatsApp Web)
		},
		loadIdentityKey: async (id: string) => {
			const wireJid = await resolveLIDSignalAddress(id)
			const { [wireJid]: key } = await keys.get('identity-key', [wireJid])
			return key || undefined
		},
		saveIdentity: async (id: string, identityKey: Uint8Array): Promise<boolean> => {
			const wireJid = await resolveLIDSignalAddress(id)

			// H3 fix: the read-then-write sequence and the cross-type
			// session+identity-key write run inside a single transactWith. The
			// commit lands as ONE state.set covering both types — readers can
			// no longer observe `session=null` paired with the OLD identity-key.
			const txKeys = keys as SignalKeyStoreWithRecordTransaction
			return txKeys.transactWith(
				{
					records: [
						{ type: 'identity-key', id: wireJid },
						{ type: 'session', id: wireJid }
					]
				},
				async () => {
					const { [wireJid]: existingKey } = await txKeys.get('identity-key', [wireJid])

					const keysMatch =
						existingKey?.length === identityKey.length && existingKey.every((byte, i) => byte === identityKey[i])

					if (existingKey && !keysMatch) {
						// Identity changed — clear session and update key atomically.
						await txKeys.set({
							session: { [wireJid]: null },
							'identity-key': { [wireJid]: identityKey }
						})
						return true
					}

					if (!existingKey) {
						// New contact - Trust on First Use (TOFU)
						await txKeys.set({ 'identity-key': { [wireJid]: identityKey } })
						return true
					}

					return false
				}
			)
		},
		loadPreKey: async (id: number) => {
			const keyId = id.toString()
			const { [keyId]: key } = await keys.get('pre-key', [keyId])
			if (key) {
				return {
					privKey: key.private,
					pubKey: key.public
				}
			}

			return null
		},
		removePreKey: (id: number) => keys.set({ 'pre-key': { [id]: null } }),
		loadSignedPreKey: async (id: number) => {
			const key = creds.signedPreKey
			if (key?.keyId !== id) {
				return null
			}

			return {
				keyId: key.keyId,
				signature: key.signature,
				keyPair: {
					pubKey: key.keyPair.public,
					privKey: key.keyPair.private
				}
			}
		},
		loadSenderKey: async (keyId: string) => {
			const { [keyId]: key } = await keys.get('sender-key', [keyId])
			return key ?? null
		},
		storeSenderKey: async (keyId: string, keyBytes: Uint8Array) => {
			// Same policy as sessions: the row keeps the shape a pre-WASM release
			// reads. Every field of a sender-key state has a v1 counterpart, so
			// unlike a session this conversion cannot lose anything.
			await keys.set({ 'sender-key': { [keyId]: projectLegacySenderKeyRecordV1(keyBytes) } })
		},
		getOurRegistrationId: () => creds.registrationId,
		getOurIdentity: () => {
			const { signedIdentityKey } = creds
			return {
				privKey: signedIdentityKey.private,
				pubKey: signedIdentityKey.public
			}
		}
	}
}
