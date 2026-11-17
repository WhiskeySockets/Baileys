// @ts-ignore
import * as libsignal from 'libsignal'
// @ts-ignore
import { PreKeyWhisperMessage } from 'libsignal/src/protobufs'
import type { LIDMapping, SignalAuthState, SignalKeyStoreWithTransaction } from '../Types'
import type { SignalRepositoryWithLIDStore } from '../Types/Signal'
import { generateSignalPubKey } from '../Utils'
import type { ILogger } from '../Utils/logger'
import {
	isHostedLidUser,
	isHostedPnUser,
	isLidUser,
	isPnUser,
	jidDecode,
	jidNormalizedUser,
	transferDevice,
	WAJIDDomains
} from '../WABinary'
import type { SenderKeyStore } from './Group/group_cipher'
import { SenderKeyName } from './Group/sender-key-name'
import { SenderKeyRecord } from './Group/sender-key-record'
import { GroupCipher, GroupSessionBuilder, SenderKeyDistributionMessage } from './Group'
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
		const preKeyProto = PreKeyWhisperMessage.decode(ciphertext.slice(1))
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
	const lidMapping = new LIDMappingStore(auth.keys as SignalKeyStoreWithTransaction, logger, pnToLIDFunc)
	const storage = signalStorage(auth, lidMapping)

	const parsedKeys = auth.keys as SignalKeyStoreWithTransaction

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

	const sessionTransactionJid = async (jid: string) =>
		isPnUser(jid) || isHostedPnUser(jid) ? (await lidMapping.getLIDForPN(jid)) || jid : jid

	const migrationGenerations = new Map<string, number>()
	const migrationGeneration = (jid: string) => migrationGenerations.get(jidNormalizedUser(jid)) ?? 0
	const retryAddress = Symbol('session address changed')
	const withSessionAddress = async <T>(
		jid: string,
		work: (resolved: string) => Promise<T>,
		exclusive = false
	): Promise<T> => {
		for (let attempt = 0; attempt < 3; attempt++) {
			const generation = migrationGeneration(jid)
			const resolved = await sessionTransactionJid(jid)
			const result = await parsedKeys.transaction(
				async () => {
					if (generation !== migrationGeneration(jid)) return retryAddress
					return work(resolved)
				},
				resolved,
				{ exclusive }
			)
			if (result !== retryAddress) return result
		}

		throw new Error('Session address kept changing before admission')
	}

	const repository: SignalRepositoryWithLIDStore = {
		supportsStatusSessions: parsedKeys.supportsExclusiveTransactions === true,
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
		async decryptMessage({ jid, type, ciphertext, sessionScope }) {
			if (sessionScope === 'status' && !parsedKeys.supportsExclusiveTransactions) {
				throw new Error('Signal repository does not support status sessions')
			}

			return withSessionAddress(
				jid,
				async resolvedJid => {
					const addr = jidToSignalProtocolAddress(resolvedJid)
					const decryptStorage = signalStorage(auth, lidMapping, sessionScope === 'status', addr.toString())
					const session = new libsignal.SessionCipher(decryptStorage, addr)
					if (type === 'pkmsg') {
						const identityKey = extractIdentityFromPkmsg(ciphertext)
						if (identityKey) {
							const identityChanged = await decryptStorage.saveIdentity(addr.toString(), identityKey)
							if (identityChanged)
								logger.info(
									{ jid, addr: addr.toString() },
									'identity key changed or new contact, session will be re-established'
								)
						}

						return session.decryptPreKeyWhisperMessage(ciphertext)
					}

					return session.decryptWhisperMessage(ciphertext)
				},
				type === 'pkmsg' && parsedKeys.supportsExclusiveTransactions === true
			)
		},

		async encryptMessage({ jid, data }) {
			return withSessionAddress(jid, async resolvedJid => {
				const addr = jidToSignalProtocolAddress(resolvedJid)
				const cipher = new libsignal.SessionCipher(signalStorage(auth, lidMapping, false, addr.toString()), addr)
				const { type: sigType, body } = await cipher.encrypt(data)
				const type = sigType === 3 ? 'pkmsg' : 'msg'
				return { type, ciphertext: Buffer.from(body, 'binary') }
			})
		},

		async encryptGroupMessage({ group, meId, data }) {
			return parsedKeys.transaction(async () => {
				const { senderName, skdm } = await ensureSenderKeyAndCreateSkdm(group, meId)
				const ciphertext = await new GroupCipher(storage, senderName).encrypt(data)
				return { ciphertext, senderKeyDistributionMessage: skdm.serialize() }
			}, group)
		},

		async getSenderKeyDistributionMessage({ group, meId }) {
			return parsedKeys.transaction(async () => {
				const { skdm } = await ensureSenderKeyAndCreateSkdm(group, meId)
				return skdm.serialize()
			}, group)
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
			return withSessionAddress(
				jid,
				async resolvedJid => {
					const addr = jidToSignalProtocolAddress(resolvedJid)
					const cipher = new libsignal.SessionBuilder(signalStorage(auth, lidMapping, false, addr.toString()), addr)
					// libsignal accepts an absent prekey despite the bundled declaration.
					await cipher.initOutgoing(session as unknown as Parameters<typeof cipher.initOutgoing>[0])
				},
				parsedKeys.supportsExclusiveTransactions === true
			)
		},
		jidToSignalProtocolAddress(jid) {
			return jidToSignalProtocolAddress(jid).toString()
		},

		// Optimized direct access to LID mapping store
		lidMapping,

		async validateSession(jid: string, sessionScope?: 'status') {
			try {
				const addr = jidToSignalProtocolAddress(jid)
				const validationStorage = sessionScope === 'status' ? signalStorage(auth, lidMapping, true) : storage
				const session = await validationStorage.loadSession(addr.toString())

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

		async deleteSession(jids: string[], sessionScope?: 'default' | 'status') {
			if (!jids.length) return
			if (sessionScope !== undefined && sessionScope !== 'status' && sessionScope !== 'default')
				throw new Error('Unsupported session deletion scope')
			if (!parsedKeys.supportsExclusiveTransactions)
				throw new Error('Key store does not support exclusive session deletion')

			await parsedKeys.transaction(
				async () => {
					// Deletion only uses associations already observed and stored.
					// Holding the barrier through resolution drains in-flight crypto
					// and mapping transactions before selecting their stored rows.
					const resolvedJids = await Promise.all(
						jids.map(async jid =>
							isPnUser(jid) || isHostedPnUser(jid)
								? (await lidMapping.getLIDForPN(jid, { useUSync: false })) || jid
								: jid
						)
					)
					const sessionUpdates: { [key: string]: null } = {}
					for (const [index, jid] of jids.entries()) {
						for (const target of [jid, resolvedJids[index]!]) {
							const addr = jidToSignalProtocolAddress(target).toString()
							if (sessionScope !== 'status') sessionUpdates[addr] = null
							if (sessionScope !== 'default') sessionUpdates[`${addr}_status`] = null
						}
					}

					await auth.keys.set({ session: sessionUpdates })
				},
				'signal-session-deletion',
				{ exclusive: true }
			)
		},

		close() {
			lidMapping.close()
		},

		async migrateSession(
			fromJid: string,
			toJid: string
		): Promise<{ migrated: number; skipped: number; total: number }> {
			return parsedKeys.transaction(
				async () => {
					// TODO: use usync to handle this entire mess
					if (!fromJid || (!isLidUser(toJid) && !isHostedLidUser(toJid))) return { migrated: 0, skipped: 0, total: 0 }

					// Only support PN to LID migration
					if (!isPnUser(fromJid) && !isHostedPnUser(fromJid)) {
						return { migrated: 0, skipped: 0, total: 1 }
					}

					// Only resolutions for this migrating user and its linked identity become stale.
					for (const jid of [fromJid, toJid]) {
						const key = jidNormalizedUser(jid)
						migrationGenerations.set(key, migrationGeneration(jid) + 1)
					}

					const { user } = jidDecode(fromJid)!

					logger.debug({ fromJid }, 'bulk device migration - loading all user devices')

					// Get user's device list from storage
					const devices = await parsedKeys.get('device-list', [user])
					const userDevices = [...(devices[user] ?? [])]

					const { device: fromDevice } = jidDecode(fromJid)!
					const fromDeviceStr = fromDevice?.toString() || '0'
					if (!userDevices.includes(fromDeviceStr)) {
						userDevices.push(fromDeviceStr)
					}

					// Probe both namespaces; another scope may arrive after an earlier migration.
					const sourceJids = userDevices.map(device =>
						device === '99'
							? `${user}:99@hosted`
							: device === '0'
								? `${user}@s.whatsapp.net`
								: `${user}:${device}@s.whatsapp.net`
					)
					const deviceSessionKeys = sourceJids.flatMap(jid => {
						const address = jidToSignalProtocolAddress(jid).toString()
						return [address, `${address}_status`]
					})
					const existingSessions = await parsedKeys.get('session', deviceSessionKeys)
					const deviceJids = sourceJids.filter(jid => {
						const address = jidToSignalProtocolAddress(jid).toString()
						return existingSessions[address] || existingSessions[`${address}_status`]
					})

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
								fromAddr: libsignal.ProtocolAddress
								toAddr: libsignal.ProtocolAddress
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
							const pnAddrStrings = Array.from(
								new Set(migrationOps.flatMap(op => [op.fromAddr.toString(), `${op.fromAddr.toString()}_status`]))
							)
							const pnSessions = await parsedKeys.get('session', pnAddrStrings)
							const lidSessions = await parsedKeys.get(
								'session',
								migrationOps.flatMap(op => [op.toAddr.toString(), `${op.toAddr.toString()}_status`])
							)

							// Prepare bulk session updates (PN → LID migration + deletion)
							const sessionUpdates: { [key: string]: Uint8Array | null } = {}

							for (const op of migrationOps) {
								let migrated = false
								for (const suffix of ['', '_status']) {
									const pnAddrStr = op.fromAddr.toString() + suffix
									const lidAddrStr = op.toAddr.toString() + suffix
									const pnSession = pnSessions[pnAddrStr]
									// Keep both records when an independently established destination exists.
									if (pnSession && !lidSessions[lidAddrStr]) {
										const fromSession = libsignal.SessionRecord.deserialize(pnSession)
										if (fromSession.haveOpenSession()) {
											sessionUpdates[lidAddrStr] = fromSession.serialize()
											sessionUpdates[pnAddrStr] = null
											migrated = true
										}
									}
								}

								if (migrated) migratedCount++
							}

							// Single bulk session update for all migrations
							if (Object.keys(sessionUpdates).length > 0) {
								await parsedKeys.set({ session: sessionUpdates })
								logger.debug({ migratedSessions: migratedCount }, 'bulk session migration complete')
							}

							const skippedCount = totalOps - migratedCount
							return { migrated: migratedCount, skipped: skippedCount, total: totalOps }
						},
						`migrate-${deviceJids.length}-sessions-${jidDecode(toJid)?.user}`
					)
				},
				'signal-session-migration',
				{ exclusive: parsedKeys.supportsExclusiveTransactions === true }
			)
		}
	}

	return repository
}

const jidToSignalProtocolAddress = (jid: string): libsignal.ProtocolAddress => {
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

	return new libsignal.ProtocolAddress(signalUser, finalDevice)
}

const jidToSignalSenderKeyName = (group: string, user: string): SenderKeyName => {
	return new SenderKeyName(group, jidToSignalProtocolAddress(user))
}

function signalStorage(
	{ creds, keys }: SignalAuthState,
	lidMapping: LIDMappingStore,
	statusSession = false,
	pinnedAddress?: string
): SenderKeyStore &
	libsignal.SignalStorage & {
		loadIdentityKey(id: string): Promise<Uint8Array | undefined>
		saveIdentity(id: string, identityKey: Uint8Array): Promise<boolean>
	} {
	// Shared function to resolve PN signal address to LID if mapping exists
	const resolveLIDSignalAddress = async (id: string): Promise<string> => {
		if (pinnedAddress) return pinnedAddress
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
				const resolved = await resolveLIDSignalAddress(id)
				const wireJid = statusSession ? `${resolved}_status` : resolved
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
			const resolved = await resolveLIDSignalAddress(id)
			const wireJid = statusSession ? `${resolved}_status` : resolved
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
				existingKey?.length === identityKey.length && existingKey.every((byte, i) => byte === identityKey[i])

			if (existingKey && !keysMatch) {
				// Identity changed - clear session and update key
				await keys.set({
					session: { [wireJid]: null, [`${wireJid}_status`]: null },
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
		}
	}
}
