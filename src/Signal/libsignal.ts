import { LRUCache } from 'lru-cache'
import type { SignalStorage } from 'whatsapp-rust-bridge'
import {
	GroupCipher,
	GroupSessionBuilder,
	hasLogger,
	ProtocolAddress,
	SenderKeyDistributionMessage,
	SenderKeyName,
	SessionBuilder,
	SessionCipher,
	SessionRecord,
	setLogger
} from 'whatsapp-rust-bridge'
import { proto } from '../../WAProto/index.js'
import type { LIDMapping, SignalAuthState, SignalKeyStoreWithTransaction } from '../Types'
import type { SignalRepositoryWithLIDStore } from '../Types/Signal'
import type { ILogger } from '../Utils/logger'
import { makeKeyedMutex } from '../Utils/make-mutex'
import {
	isHostedLidUser,
	isHostedPnUser,
	isLidUser,
	isPnUser,
	jidDecode,
	transferDevice,
	WAJIDDomains
} from '../WABinary'
import { LIDMappingStore } from './lid-mapping'

/** Extract identity key from PreKeyWhisperMessage for identity change detection */
function extractIdentityFromPkmsg(ciphertext: Uint8Array): Uint8Array | undefined {
	try {
		if (!ciphertext || ciphertext.length < 2) {
			return undefined
		}

		// Version byte check (version 3)
		const version = ciphertext[0]!
		if ((version & 0xf) !== 3) {
			return undefined
		}

		// Parse protobuf (skip version byte)
		const preKeyProto = proto.PreKeySignalMessage.decode(ciphertext.slice(1))
		if (preKeyProto.identityKey?.length === 33) {
			return new Uint8Array(preKeyProto.identityKey)
		}

		return undefined
	} catch {
		return undefined
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

	const parsedKeys = auth.keys as SignalKeyStoreWithTransaction

	// Per-session mutex: serializes encrypt and decrypt for the same JID.
	// Prevents session counter corruption when encrypt (inside relayMessage
	// transaction) and decrypt (outside it) interleave on the same session.
	const sessionMutex = makeKeyedMutex()
	const migratedSessionCache = new LRUCache<string, true>({
		ttl: 3 * 24 * 60 * 60 * 1000, // 7 days
		ttlAutopurge: true,
		updateAgeOnGet: true
	})

	const resolveSignalAddress = async (jid: string): Promise<string> => {
		const addr = jidToSignalProtocolAddress(jid).toString()
		if (addr.includes('.')) {
			const [deviceId, device] = addr.split('.')
			const [user, domainType_] = deviceId!.split('_')
			const domainType = parseInt(domainType_ || '0')

			if (domainType === WAJIDDomains.LID || domainType === WAJIDDomains.HOSTED_LID) return addr

			const pnJid = `${user!}${device !== '0' ? `:${device}` : ''}@${domainType === WAJIDDomains.HOSTED ? 'hosted' : 's.whatsapp.net'}`

			const lidForPN = await lidMapping.getLIDForPN(pnJid)
			if (lidForPN) {
				const lidAddr = jidToSignalProtocolAddress(lidForPN)
				return lidAddr.toString()
			}
		}

		return addr
	}

	const repository: SignalRepositoryWithLIDStore = {
		decryptGroupMessage({ group, authorJid, msg }) {
			const senderAddr = jidToSignalProtocolAddress(authorJid)
			const cipher = new GroupCipher(storage, group, senderAddr)

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

			const senderAddr = jidToSignalProtocolAddress(authorJid)

			const senderName = new SenderKeyName(item.groupId, senderAddr)
			const senderMsg = SenderKeyDistributionMessage.deserialize(item.axolotlSenderKeyDistributionMessage!)

			return parsedKeys.transaction(async () => {
				await builder.process(senderName, senderMsg)
			}, item.groupId)
		},
		async decryptMessage({ jid, type, ciphertext }) {
			const lockKey = await resolveSignalAddress(jid)
			return sessionMutex.mutex(lockKey, async () => {
				const addr = jidToSignalProtocolAddress(jid)
				const session = new SessionCipher(storage, addr)

				// Extract and save sender's identity key before decryption for identity change detection
				if (type === 'pkmsg') {
					const identityKey = extractIdentityFromPkmsg(ciphertext)
					if (identityKey) {
						const addrStr = addr.toString()
						const identityChanged = await storage.saveIdentity(addrStr, identityKey)
						if (identityChanged) {
							logger.info({ jid, addr: addrStr }, 'identity key changed or new contact, session will be re-established')
						}
					}
				}

				return parsedKeys.transaction(async () => {
					let result: Uint8Array
					switch (type) {
						case 'pkmsg':
							result = await session.decryptPreKeyWhisperMessage(ciphertext)
							break
						case 'msg':
							result = await session.decryptWhisperMessage(ciphertext)
							break
					}

					return result
				}, lockKey)
			})
		},

		async encryptMessage({ jid, data }) {
			const lockKey = await resolveSignalAddress(jid)
			return sessionMutex.mutex(lockKey, async () => {
				const addr = jidToSignalProtocolAddress(jid)
				const cipher = new SessionCipher(storage, addr)

				return parsedKeys.transaction(async () => {
					const { type: sigType, body } = await cipher.encrypt(data)
					const type = sigType === 3 ? 'pkmsg' : 'msg'
					return { type, ciphertext: body }
				}, lockKey)
			})
		},

		async encryptGroupMessage({ group, meId, data }) {
			const builder = new GroupSessionBuilder(storage)
			const meAddr = jidToSignalProtocolAddress(meId)
			const senderName = jidToSignalSenderKeyName(group, meId)

			const senderKeyDistributionMessage = await builder.create(senderName)

			const cipher = new GroupCipher(storage, group, meAddr)

			return parsedKeys.transaction(async () => {
				const ciphertext = await cipher.encrypt(data)

				return {
					ciphertext,
					senderKeyDistributionMessage: senderKeyDistributionMessage.serialize()
				}
			}, group)
		},

		async injectE2ESession({ jid, session }) {
			logger.trace({ jid }, 'injecting E2EE session')
			const lockKey = await resolveSignalAddress(jid)
			const cipher = new SessionBuilder(storage, jidToSignalProtocolAddress(jid))
			return parsedKeys.transaction(async () => {
				await cipher.initOutgoing(session)
			}, lockKey)
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
						fromAddr: ProtocolAddress
						toAddr: ProtocolAddress
					}

					const migrationOps: MigrationOp[] = deviceJids.map(jid => {
						const lidWithDevice = transferDevice(jid, toJid)
						const fromDecoded = jidDecode(jid)!
						const toDecoded = jidDecode(lidWithDevice)!

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

					// Bulk fetch PN sessions - already exist (verified during device discovery)
					const pnAddrStrings = Array.from(new Set(migrationOps.map(op => op.fromAddr.toString())))
					const pnSessions = await parsedKeys.get('session', pnAddrStrings)

					// Prepare bulk session updates (PN → LID migration + deletion)
					const sessionUpdates: { [key: string]: Uint8Array | null } = {}

					for (const op of migrationOps) {
						const pnAddrStr = op.fromAddr.toString()
						const lidAddrStr = op.toAddr.toString()

						const pnSession = pnSessions[pnAddrStr]
						if (pnSession) {
							// Session exists (guaranteed from device discovery)
							const fromSession = SessionRecord.deserialize(pnSession)
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
				},
				`migrate-${deviceJids.length}-sessions-${jidDecode(toJid)?.user}`
			)
		}
	}

	return repository
}

const addressCache = new LRUCache<string, ProtocolAddress>({ max: 1000 })

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

	const cacheKey = `${signalUser}.${finalDevice}`
	let addr = addressCache.get(cacheKey)
	if (!addr) {
		addr = new ProtocolAddress(signalUser, finalDevice)
		addressCache.set(cacheKey, addr)
	}

	return addr
}

const jidToSignalSenderKeyName = (group: string, user: string): SenderKeyName => {
	return new SenderKeyName(group, jidToSignalProtocolAddress(user))
}

function signalStorage(
	{ creds, keys }: SignalAuthState,
	lidMapping: LIDMappingStore
): SignalStorage & {
	loadIdentityKey(id: string): Promise<Uint8Array | undefined>
	saveIdentity(id: string, identityKey: Uint8Array): Promise<boolean>
} {
	// Shared function to resolve PN signal address to LID if mapping exists
	const resolveLIDSignalAddress = async (id: string): Promise<string> => {
		if (id.includes('.')) {
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
		}

		return id
	}

	return {
		loadSession: async (id: string) => {
			try {
				const wireJid = await resolveLIDSignalAddress(id)
				const { [wireJid]: sess } = await keys.get('session', [wireJid])
				if (sess) {
					return sess
				}

				return null
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
			const { [wireJid]: existingKey } = await keys.get('identity-key', [wireJid])

			const keysMatch =
				existingKey &&
				existingKey.length === identityKey.length &&
				existingKey.every((byte, i) => byte === identityKey[i])

			if (existingKey && !keysMatch) {
				// Identity changed - clear session and update key
				await keys.set({
					session: { [wireJid]: null },
					'identity-key': { [wireJid]: identityKey }
				})
				return true
			}

			if (!existingKey) {
				// New contact - Trust on First Use (TOFU)
				await keys.set({ 'identity-key': { [wireJid]: identityKey } })
				return true
			}

			return false
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
		},
		removePreKey: (id: number) => keys.set({ 'pre-key': { [id]: null } }),
		loadSignedPreKey: async (id: number) => {
			const key = creds.signedPreKey
			if (!key || key.keyId !== id) {
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
			await keys.set({ 'sender-key': { [keyId]: keyBytes.slice() } })
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
