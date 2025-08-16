import NodeCache from '@cacheable/node-cache'
import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto/index.js'
import { DEFAULT_CACHE_TTLS, WA_DEFAULT_EPHEMERAL } from '../Defaults'
import type {
	AnyMessageContent,
	MediaConnInfo,
	MessageReceiptType,
	MessageRelayOptions,
	MiscMessageGenerationOptions,
	SocketConfig,
	WAMessageKey
} from '../Types'
import {
	aggregateMessageKeysNotFromMe,
	assertMediaContent,
	bindWaitForEvent,
	decryptMediaRetryData,
	encodeNewsletterMessage,
	encodeSignedDeviceIdentity,
	encodeWAMessage,
	encryptMediaRetryRequest,
	extractDeviceJids,
	generateMessageIDV2,
	generateWAMessage,
	getStatusCodeForMediaRetry,
	getUrlFromDirectPath,
	getWAUploadToServer,
	normalizeMessageContent,
	parseAndInjectE2ESessions,
	unixTimestampSeconds
} from '../Utils'
import { getUrlInfo } from '../Utils/link-preview'
import { makeKeyedMutex } from '../Utils/make-mutex'
import {
	areJidsSameUser,
	type BinaryNode,
	type BinaryNodeAttributes,
	getBinaryNodeChild,
	getBinaryNodeChildren,
	isJidGroup,
	isJidUser,
	jidDecode,
	jidEncode,
	jidNormalizedUser,
	type JidWithDevice,
	S_WHATSAPP_NET
} from '../WABinary'
import { USyncQuery, USyncUser } from '../WAUSync'
import { makeGroupsSocket } from './groups'
import type { NewsletterSocket } from './newsletter'
import { makeNewsletterSocket } from './newsletter'

export const makeMessagesSocket = (config: SocketConfig) => {
	const {
		logger,
		linkPreviewImageThumbnailWidth,
		generateHighQualityLinkPreview,
		options: axiosOptions,
		patchMessageBeforeSending,
		cachedGroupMetadata
	} = config
	const sock: NewsletterSocket = makeNewsletterSocket(makeGroupsSocket(config))
	const {
		ev,
		authState,
		processingMutex,
		signalRepository,
		upsertMessage,
		query,
		fetchPrivacySettings,
		sendNode,
		groupMetadata,
		groupToggleEphemeral
	} = sock

	const userDevicesCache =
		config.userDevicesCache ||
		new NodeCache<JidWithDevice[]>({
			stdTTL: DEFAULT_CACHE_TTLS.USER_DEVICES, // 5 minutes
			useClones: false
		})

	// Prevent race conditions in Signal session encryption by user
	const encryptionMutex = makeKeyedMutex()

	let mediaConn: Promise<MediaConnInfo>
	const refreshMediaConn = async (forceGet = false) => {
		const media = await mediaConn
		if (!media || forceGet || new Date().getTime() - media.fetchDate.getTime() > media.ttl * 1000) {
			mediaConn = (async () => {
				const result = await query({
					tag: 'iq',
					attrs: {
						type: 'set',
						xmlns: 'w:m',
						to: S_WHATSAPP_NET
					},
					content: [{ tag: 'media_conn', attrs: {} }]
				})
				const mediaConnNode = getBinaryNodeChild(result, 'media_conn')!
				const node: MediaConnInfo = {
					hosts: getBinaryNodeChildren(mediaConnNode, 'host').map(({ attrs }) => ({
						hostname: attrs.hostname!,
						maxContentLengthBytes: +attrs.maxContentLengthBytes!
					})),
					auth: mediaConnNode.attrs.auth!,
					ttl: +mediaConnNode.attrs.ttl!,
					fetchDate: new Date()
				}
				logger.debug('fetched media conn')
				return node
			})()
		}

		return mediaConn
	}

	/**
	 * generic send receipt function
	 * used for receipts of phone call, read, delivery etc.
	 * */
	const sendReceipt = async (
		jid: string,
		participant: string | undefined,
		messageIds: string[],
		type: MessageReceiptType
	) => {
		if (!messageIds || messageIds.length === 0) {
			throw new Boom('missing ids in receipt')
		}

		const node: BinaryNode = {
			tag: 'receipt',
			attrs: {
				id: messageIds[0]!
			}
		}
		const isReadReceipt = type === 'read' || type === 'read-self'
		if (isReadReceipt) {
			node.attrs.t = unixTimestampSeconds().toString()
		}

		if (type === 'sender' && isJidUser(jid)) {
			node.attrs.recipient = jid
			node.attrs.to = participant!
		} else {
			node.attrs.to = jid
			if (participant) {
				node.attrs.participant = participant
			}
		}

		if (type) {
			node.attrs.type = type
		}

		const remainingMessageIds = messageIds.slice(1)
		if (remainingMessageIds.length) {
			node.content = [
				{
					tag: 'list',
					attrs: {},
					content: remainingMessageIds.map(id => ({
						tag: 'item',
						attrs: { id }
					}))
				}
			]
		}

		logger.debug({ attrs: node.attrs, messageIds }, 'sending receipt for messages')
		await sendNode(node)
	}

	/** Correctly bulk send receipts to multiple chats, participants */
	const sendReceipts = async (keys: WAMessageKey[], type: MessageReceiptType) => {
		const recps = aggregateMessageKeysNotFromMe(keys)
		for (const { jid, participant, messageIds } of recps) {
			await sendReceipt(jid, participant, messageIds, type)
		}
	}

	/** Bulk read messages. Keys can be from different chats & participants */
	const readMessages = async (keys: WAMessageKey[]) => {
		const privacySettings = await fetchPrivacySettings()
		// based on privacy settings, we have to change the read type
		const readType = privacySettings.readreceipts === 'all' ? 'read' : 'read-self'
		await sendReceipts(keys, readType)
	}

	/** Device info with wire JID format for envelope addressing */
	type DeviceWithWireJid = JidWithDevice & {
		wireJid: string // The exact JID format that should be used in wire protocol (envelope addressing)
	}

	/**
	 * Deduplicate JIDs when both LID and PN versions exist for same user
	 * Prefers LID over PN to maintain single encryption layer
	 */
	const deduplicateLidPnJids = (jids: string[]): string[] => {
		const lidUsers = new Set<string>()
		const filteredJids: string[] = []

		// Collect all LID users
		for (const jid of jids) {
			if (jid.includes('@lid')) {
				const user = jidDecode(jid)?.user
				if (user) lidUsers.add(user)
			}
		}

		// Filter out PN versions when LID exists
		for (const jid of jids) {
			if (jid.includes('@s.whatsapp.net')) {
				const user = jidDecode(jid)?.user
				if (user && lidUsers.has(user)) {
					logger.debug({ jid }, 'Skipping PN - LID version exists')
					continue
				}
			}

			filteredJids.push(jid)
		}

		return filteredJids
	}

	/** Fetch all the devices we've to send a message to */
	const getUSyncDevices = async (
		jids: string[],
		useCache: boolean,
		ignoreZeroDevices: boolean
	): Promise<DeviceWithWireJid[]> => {
		const deviceResults: DeviceWithWireJid[] = []

		if (!useCache) {
			logger.debug('not using cache for devices')
		}

		const toFetch: string[] = []
		// Deduplicate and normalize JIDs
		jids = deduplicateLidPnJids(Array.from(new Set(jids)))

		for (let jid of jids) {
			const decoded = jidDecode(jid)
			const user = decoded?.user
			const device = decoded?.device
			const isExplicitDevice = typeof device === 'number' && device >= 0

			// Handle explicit device JIDs directly
			if (isExplicitDevice && user) {
				deviceResults.push({
					user,
					device,
					wireJid: jid // Preserve exact JID format for wire protocol
				})
				continue
			}

			// For user JIDs, normalize and prepare for device enumeration
			jid = jidNormalizedUser(jid)

			if (useCache) {
				const devices = userDevicesCache.get(user!) as JidWithDevice[]
				if (devices) {
					const isLidJid = jid.includes('@lid')
					const devicesWithWire = devices.map(d => ({
						...d,
						wireJid: isLidJid ? jidEncode(d.user, 'lid', d.device) : jidEncode(d.user, 's.whatsapp.net', d.device)
					}))
					deviceResults.push(...devicesWithWire)

					logger.trace({ user }, 'using cache for devices')
				} else {
					toFetch.push(jid)
				}
			} else {
				toFetch.push(jid)
			}
		}

		if (!toFetch.length) {
			return deviceResults
		}

		const requestedLidUsers = new Set<string>()
		for (const jid of toFetch) {
			if (jid.includes('@lid')) {
				const user = jidDecode(jid)?.user
				if (user) requestedLidUsers.add(user)
			}
		}

		const query = new USyncQuery().withContext('message').withDeviceProtocol()

		for (const jid of toFetch) {
			query.withUser(new USyncUser().withId(jid))
		}

		const result = await sock.executeUSyncQuery(query)

		if (result) {
			const extracted = extractDeviceJids(result?.list, authState.creds.me!.id, ignoreZeroDevices)
			const deviceMap: { [_: string]: JidWithDevice[] } = {}

			for (const item of extracted) {
				deviceMap[item.user] = deviceMap[item.user] || []
				deviceMap[item.user]?.push(item)
			}

			// Process each user's devices as a group for bulk LID migration
			for (const [user, userDevices] of Object.entries(deviceMap)) {
				const isLidUser = requestedLidUsers.has(user)

				// Process all devices for this user
				for (const item of userDevices) {
					const finalWireJid = isLidUser
						? jidEncode(user, 'lid', item.device)
						: jidEncode(item.user, 's.whatsapp.net', item.device)

					deviceResults.push({
						...item,
						wireJid: finalWireJid
					})

					logger.debug(
						{
							user: item.user,
							device: item.device,
							finalWireJid,
							usedLid: isLidUser
						},
						'Processed device with LID priority'
					)
				}
			}

			for (const key in deviceMap) {
				userDevicesCache.set(key, deviceMap[key]!)
			}
		}

		return deviceResults
	}

	// Helper to check if JID has migrated LID session
	const checkForMigratedLidSession = async (jid: string): Promise<boolean> => {
		if (!jid.includes('@s.whatsapp.net')) return false

		const lidMapping = signalRepository.getLIDMappingStore()
		const lidForPN = await lidMapping.getLIDForPN(jid)
		if (!lidForPN?.includes('@lid')) return false

		const lidSignalId = signalRepository.jidToSignalProtocolAddress(lidForPN)
		const lidSessions = await authState.keys.get('session', [lidSignalId])
		return !!lidSessions[lidSignalId]
	}

	const assertSessions = async (jids: string[], force: boolean) => {
		let didFetchNewSession = false
		const jidsRequiringFetch: string[] = []

		// Apply same deduplication as in getUSyncDevices
		jids = deduplicateLidPnJids(jids)

		if (force) {
			// Check which sessions are missing (with LID migration check)
			const addrs = jids.map(jid => signalRepository.jidToSignalProtocolAddress(jid))
			const sessions = await authState.keys.get('session', addrs)

			// Helper to check session for a JID
			const checkJidSession = async (jid: string) => {
				const signalId = signalRepository.jidToSignalProtocolAddress(jid)
				let hasSession = !!sessions[signalId]

				// Check for migrated LID session if PN session missing
				if (!hasSession) {
					hasSession = await checkForMigratedLidSession(jid)
					if (hasSession) {
						logger.debug({ jid }, 'Found migrated LID session during force assert, skipping PN fetch')
					}
				}

				// Add to fetch list if no session exists
				if (!hasSession) {
					if (jid.includes('@lid')) {
						logger.debug({ jid }, 'No LID session found, will create new LID session')
					}

					jidsRequiringFetch.push(jid)
				}
			}

			// Process all JIDs
			for (const jid of jids) {
				await checkJidSession(jid)
			}
		} else {
			const lidMapping = signalRepository.getLIDMappingStore()
			const addrs = jids.map(jid => signalRepository.jidToSignalProtocolAddress(jid))
			const sessions = await authState.keys.get('session', addrs)

			// Group JIDs by user for bulk migration
			const userGroups = new Map<string, string[]>()
			for (const jid of jids) {
				const user = jidNormalizedUser(jid)
				if (!userGroups.has(user)) {
					userGroups.set(user, [])
				}

				userGroups.get(user)!.push(jid)
			}

			// Helper to check LID mapping for a user
			const checkUserLidMapping = async (user: string, userJids: string[]) => {
				if (!userJids.some(jid => jid.includes('@s.whatsapp.net'))) {
					return { shouldMigrate: false, lidForPN: undefined }
				}

				try {
					const mapping = await lidMapping.getLIDForPN(user)
					if (mapping?.includes('@lid')) {
						logger.debug(
							{ user, lidForPN: mapping, deviceCount: userJids.length },
							'User has LID mapping - preparing bulk migration'
						)
						return { shouldMigrate: true, lidForPN: mapping }
					}
				} catch (error) {
					logger.debug({ user, error }, 'Failed to check LID mapping for user')
				}

				return { shouldMigrate: false, lidForPN: undefined }
			}

			// Helper to migrate a single device
			const migrateDeviceToLid = async (jid: string, lidForPN: string) => {
				if (!jid.includes('@s.whatsapp.net')) return

				try {
					const jidDecoded = jidDecode(jid)
					const deviceId = jidDecoded?.device || 0
					const lidDecoded = jidDecode(lidForPN)
					const lidWithDevice = jidEncode(lidDecoded?.user!, 'lid', deviceId)

					await signalRepository.migrateSession(jid, lidWithDevice)
					logger.debug({ fromJid: jid, toJid: lidWithDevice }, 'Migrated device session to LID')

					// Delete PN session after successful migration
					try {
						await signalRepository.deleteSession(jid)
						logger.debug({ deletedPNSession: jid }, 'Deleted PN session after migration')
					} catch (deleteError) {
						logger.warn({ jid, error: deleteError }, 'Failed to delete PN session')
					}
				} catch (migrationError) {
					logger.warn({ jid, error: migrationError }, 'Failed to migrate device session')
				}
			}

			// Process each user group for potential bulk LID migration
			for (const [user, userJids] of userGroups) {
				const mappingResult = await checkUserLidMapping(user, userJids)
				const shouldMigrateUser = mappingResult.shouldMigrate
				const lidForPN = mappingResult.lidForPN

				// Migrate all devices for this user if LID mapping exists
				if (shouldMigrateUser && lidForPN) {
					// Migrate each device individually
					for (const jid of userJids) {
						await migrateDeviceToLid(jid, lidForPN)
					}

					logger.info(
						{
							user,
							lidMapping: lidForPN,
							deviceCount: userJids.length
						},
						'Completed migration attempt for user devices'
					)
				}

				// Helper to check session for migrated user
				const checkMigratedSession = async (jid: string) => {
					const signalId = signalRepository.jidToSignalProtocolAddress(jid)
					let hasSession = !!sessions[signalId]
					let jidToFetch = jid

					// Check if we should use migrated LID session instead
					if (shouldMigrateUser && lidForPN && jid.includes('@s.whatsapp.net')) {
						const originalDecoded = jidDecode(jid)
						const deviceId = originalDecoded?.device || 0
						const lidDecoded = jidDecode(lidForPN)
						const lidWithDevice = jidEncode(lidDecoded?.user!, 'lid', deviceId)

						// Check if LID session exists
						const lidSignalId = signalRepository.jidToSignalProtocolAddress(lidWithDevice)
						const lidSessions = await authState.keys.get('session', [lidSignalId])
						hasSession = !!lidSessions[lidSignalId]
						jidToFetch = lidWithDevice

						if (hasSession) {
							logger.debug({ originalJid: jid, lidJid: lidWithDevice }, '✅ Found bulk-migrated LID session')
						}
					}

					// Add to fetch list if no session exists
					if (!hasSession) {
						jidsRequiringFetch.push(jidToFetch)
						logger.debug(
							{ jid: jidToFetch, originalJid: jid !== jidToFetch ? jid : undefined },
							'Adding to session fetch list'
						)
					}
				}

				// Now check which sessions need to be fetched for this user
				for (const jid of userJids) {
					await checkMigratedSession(jid)
				}
			}
		}

		if (jidsRequiringFetch.length) {
			logger.debug({ jidsRequiringFetch }, 'fetching sessions')

			// DEBUG: Check if there are PN versions of LID users being fetched
			const lidUsersBeingFetched = new Set<string>()
			const pnUsersBeingFetched = new Set<string>()

			for (const jid of jidsRequiringFetch) {
				const user = jidDecode(jid)?.user
				if (user) {
					if (jid.includes('@lid')) {
						lidUsersBeingFetched.add(user)
					} else if (jid.includes('@s.whatsapp.net')) {
						pnUsersBeingFetched.add(user)
					}
				}
			}

			// Find overlaps
			const overlapping = Array.from(pnUsersBeingFetched).filter(user => lidUsersBeingFetched.has(user))
			if (overlapping.length > 0) {
				logger.warn(
					{
						overlapping,
						lidUsersBeingFetched: Array.from(lidUsersBeingFetched),
						pnUsersBeingFetched: Array.from(pnUsersBeingFetched)
					},
					'Fetching both LID and PN sessions for same users'
				)
			}

			const result = await query({
				tag: 'iq',
				attrs: {
					xmlns: 'encrypt',
					type: 'get',
					to: S_WHATSAPP_NET
				},
				content: [
					{
						tag: 'key',
						attrs: {},
						content: jidsRequiringFetch.map(jid => ({
							tag: 'user',
							attrs: { jid }
						}))
					}
				]
			})
			await parseAndInjectE2ESessions(result, signalRepository)

			didFetchNewSession = true
		}

		return didFetchNewSession
	}

	const sendPeerDataOperationMessage = async (
		pdoMessage: proto.Message.IPeerDataOperationRequestMessage
	): Promise<string> => {
		//TODO: for later, abstract the logic to send a Peer Message instead of just PDO - useful for App State Key Resync with phone
		if (!authState.creds.me?.id) {
			throw new Boom('Not authenticated')
		}

		const protocolMessage: proto.IMessage = {
			protocolMessage: {
				peerDataOperationRequestMessage: pdoMessage,
				type: proto.Message.ProtocolMessage.Type.PEER_DATA_OPERATION_REQUEST_MESSAGE
			}
		}

		const meJid = jidNormalizedUser(authState.creds.me.id)

		const msgId = await relayMessage(meJid, protocolMessage, {
			additionalAttributes: {
				category: 'peer',

				push_priority: 'high_force'
			}
		})

		return msgId
	}

	const createParticipantNodes = async (
		jids: string[],
		message: proto.IMessage,
		extraAttrs?: BinaryNode['attrs'],
		dsmMessage?: proto.IMessage
	) => {
		let patched = await patchMessageBeforeSending(message, jids)
		if (!Array.isArray(patched)) {
			patched = jids ? jids.map(jid => ({ recipientJid: jid, ...patched })) : [patched]
		}

		let shouldIncludeDeviceIdentity = false

		const meId = authState.creds.me!.id
		const meLid = authState.creds.me?.lid
		const meLidUser = meLid ? jidDecode(meLid)?.user : null

		const devicesByUser = new Map<string, Array<{ recipientJid: string; patchedMessage: proto.IMessage }>>()

		for (const patchedMessageWithJid of patched) {
			const { recipientJid: wireJid, ...patchedMessage } = patchedMessageWithJid
			if (!wireJid) continue

			// Extract user from JID for grouping
			const decoded = jidDecode(wireJid)
			const user = decoded?.user

			if (!user) continue

			if (!devicesByUser.has(user)) {
				devicesByUser.set(user, [])
			}

			devicesByUser.get(user)!.push({ recipientJid: wireJid, patchedMessage })
		}

		// Process each user's devices sequentially, but different users in parallel
		const userEncryptionPromises = Array.from(devicesByUser.entries()).map(([user, userDevices]) =>
			encryptionMutex.mutex(user, async () => {
				logger.debug({ user, deviceCount: userDevices.length }, 'Acquiring encryption lock for user devices')

				const userNodes: BinaryNode[] = []

				// Helper to get encryption JID with LID migration
				const getEncryptionJid = async (wireJid: string) => {
					if (!wireJid.includes('@s.whatsapp.net')) return wireJid

					try {
						const lidMapping = signalRepository.getLIDMappingStore()
						const lidForPN = await lidMapping.getLIDForPN(wireJid)

						if (!lidForPN?.includes('@lid')) return wireJid

						// Preserve device ID from original wire JID
						const wireDecoded = jidDecode(wireJid)
						const deviceId = wireDecoded?.device || 0
						const lidDecoded = jidDecode(lidForPN)
						const lidWithDevice = jidEncode(lidDecoded?.user!, 'lid', deviceId)

						// Migrate session to LID for unified encryption layer
						try {
							await signalRepository.migrateSession(wireJid, lidWithDevice)
							const recipientUser = jidNormalizedUser(wireJid)
							const ownPnUser = jidNormalizedUser(meId)
							const isOwnDevice = recipientUser === ownPnUser
							logger.info({ wireJid, lidWithDevice, isOwnDevice }, 'Migrated to LID encryption')

							// Delete PN session after successful migration
							try {
								await signalRepository.deleteSession(wireJid)
								logger.debug({ deletedPNSession: wireJid }, 'Deleted PN session')
							} catch (deleteError) {
								logger.warn({ wireJid, error: deleteError }, 'Failed to delete PN session')
							}

							return lidWithDevice
						} catch (migrationError) {
							logger.warn({ wireJid, error: migrationError }, 'Failed to migrate session')
							return wireJid
						}
					} catch (error) {
						logger.debug({ wireJid, error }, 'Failed to check LID mapping')
						return wireJid
					}
				}

				// Encrypt to this user's devices sequentially to prevent session corruption
				for (const { recipientJid: wireJid, patchedMessage } of userDevices) {
					// DSM logic: Use DSM for own other devices (following whatsmeow implementation)
					let messageToEncrypt = patchedMessage
					if (dsmMessage) {
						const { user: targetUser } = jidDecode(wireJid)!
						const { user: ownPnUser } = jidDecode(meId)!
						const ownLidUser = meLidUser

						// Check if this is our device (same user, different device)
						const isOwnUser = targetUser === ownPnUser || (ownLidUser && targetUser === ownLidUser)

						// Exclude exact sender device (whatsmeow: if jid == ownJID || jid == ownLID { continue })
						const isExactSenderDevice =
							wireJid === meId || (authState.creds.me?.lid && wireJid === authState.creds.me.lid)

						if (isOwnUser && !isExactSenderDevice) {
							messageToEncrypt = dsmMessage
							logger.debug({ wireJid, targetUser }, 'Using DSM for own device')
						}
					}

					const bytes = encodeWAMessage(messageToEncrypt)

					// Get encryption JID with LID migration
					const encryptionJid = await getEncryptionJid(wireJid)

					// ENCRYPT: Use the determined encryption identity (prefers migrated LID)
					const { type, ciphertext } = await signalRepository.encryptMessage({
						jid: encryptionJid, // Unified encryption layer (LID when available)
						data: bytes
					})

					if (type === 'pkmsg') {
						shouldIncludeDeviceIdentity = true
					}

					const node: BinaryNode = {
						tag: 'to',
						attrs: { jid: wireJid }, // Always use original wire identity in envelope
						content: [
							{
								tag: 'enc',
								attrs: {
									v: '2',
									type,
									...(extraAttrs || {})
								},
								content: ciphertext
							}
						]
					}
					userNodes.push(node)
				}

				logger.debug({ user, nodesCreated: userNodes.length }, 'Releasing encryption lock for user devices')
				return userNodes
			})
		)

		// Wait for all users to complete (users are processed in parallel)
		const userNodesArrays = await Promise.all(userEncryptionPromises)
		const nodes = userNodesArrays.flat()
		return { nodes, shouldIncludeDeviceIdentity }
	}

	const relayMessage = async (
		jid: string,
		message: proto.IMessage,
		{
			messageId: msgId,
			participant,
			additionalAttributes,
			additionalNodes,
			useUserDevicesCache,
			useCachedGroupMetadata,
			statusJidList
		}: MessageRelayOptions
	) => {
		const meId = authState.creds.me!.id
		const meLid = authState.creds.me?.lid

		// ADDRESSING CONSISTENCY: Keep envelope addressing as user provided, handle LID migration in encryption

		let shouldIncludeDeviceIdentity = false

		const { user, server } = jidDecode(jid)!
		const statusJid = 'status@broadcast'
		const isGroup = server === 'g.us'
		const isStatus = jid === statusJid
		const isLid = server === 'lid'
		const isNewsletter = server === 'newsletter'

		// Keep user's original JID choice for envelope addressing
		const finalJid = jid

		// ADDRESSING CONSISTENCY: Match own identity to conversation context
		let ownId = meId
		if (isLid && meLid) {
			ownId = meLid
			logger.debug({ to: jid, ownId }, 'Using LID identity for @lid conversation')
		} else {
			logger.debug({ to: jid, ownId }, 'Using PN identity for @s.whatsapp.net conversation')
		}

		msgId = msgId || generateMessageIDV2(sock.user?.id)
		useUserDevicesCache = useUserDevicesCache !== false
		useCachedGroupMetadata = useCachedGroupMetadata !== false && !isStatus

		const participants: BinaryNode[] = []
		const destinationJid = !isStatus ? finalJid : statusJid

		const binaryNodeContent: BinaryNode[] = []
		const devices: DeviceWithWireJid[] = []

		const meMsg: proto.IMessage = {
			deviceSentMessage: {
				destinationJid,
				message
			},
			messageContextInfo: message.messageContextInfo
		}

		const extraAttrs: BinaryNodeAttributes = {}

		if (participant) {
			// when the retry request is not for a group
			// only send to the specific device that asked for a retry
			// otherwise the message is sent out to every device that should be a recipient
			if (!isGroup && !isStatus) {
				additionalAttributes = { ...additionalAttributes, device_fanout: 'false' }
			}

			const { user, device } = jidDecode(participant.jid)!
			devices.push({
				user,
				device,
				wireJid: participant.jid // Use the participant JID as wire JID
			})
		}

		await authState.keys.transaction(async () => {
			const mediaType = getMediaType(message)
			if (mediaType) {
				extraAttrs['mediatype'] = mediaType
			}

			if (isNewsletter) {
				// Patch message if needed, then encode as plaintext
				const patched = patchMessageBeforeSending ? await patchMessageBeforeSending(message, []) : message
				const bytes = encodeNewsletterMessage(patched as proto.IMessage)
				binaryNodeContent.push({
					tag: 'plaintext',
					attrs: {},
					content: bytes
				})
				const stanza: BinaryNode = {
					tag: 'message',
					attrs: {
						to: jid,
						id: msgId,
						type: getMessageType(message),
						...(additionalAttributes || {})
					},
					content: binaryNodeContent
				}
				logger.debug({ msgId }, `sending newsletter message to ${jid}`)
				await sendNode(stanza)
				return
			}

			if (normalizeMessageContent(message)?.pinInChatMessage) {
				extraAttrs['decrypt-fail'] = 'hide'
			}

			if (isGroup || isStatus) {
				const [groupData, senderKeyMap] = await Promise.all([
					(async () => {
						let groupData = useCachedGroupMetadata && cachedGroupMetadata ? await cachedGroupMetadata(jid) : undefined
						if (groupData && Array.isArray(groupData?.participants)) {
							logger.trace({ jid, participants: groupData.participants.length }, 'using cached group metadata')
						} else if (!isStatus) {
							groupData = await groupMetadata(jid)
						}

						return groupData
					})(),
					(async () => {
						if (!participant && !isStatus) {
							const result = await authState.keys.get('sender-key-memory', [jid])
							return result[jid] || {}
						}

						return {}
					})()
				])

				if (!participant) {
					const participantsList = groupData && !isStatus ? groupData.participants.map(p => p.id) : []
					if (isStatus && statusJidList) {
						participantsList.push(...statusJidList)
					}

					if (!isStatus) {
						const groupAddressingMode = groupData?.addressingMode || (isLid ? 'lid' : 'pn')
						additionalAttributes = {
							...additionalAttributes,
							addressing_mode: groupAddressingMode
						}
					}

					const additionalDevices = await getUSyncDevices(participantsList, !!useUserDevicesCache, false)
					devices.push(...additionalDevices)
				}

				const patched = await patchMessageBeforeSending(message)

				if (Array.isArray(patched)) {
					throw new Boom('Per-jid patching is not supported in groups')
				}

				const bytes = encodeWAMessage(patched)

				// This should match the group's addressing mode and conversation context
				const groupAddressingMode = groupData?.addressingMode || (isLid ? 'lid' : 'pn')
				const groupSenderIdentity = groupAddressingMode === 'lid' && meLid ? meLid : meId

				const { ciphertext, senderKeyDistributionMessage } = await signalRepository.encryptGroupMessage({
					group: destinationJid,
					data: bytes,
					meId: groupSenderIdentity
				})

				const senderKeyJids: string[] = []
				// ensure a connection is established with every device
				for (const device of devices) {
					// This preserves the LID migration results from getUSyncDevices
					const deviceJid = device.wireJid
					const hasKey = !!senderKeyMap[deviceJid]
					if (!hasKey || !!participant) {
						senderKeyJids.push(deviceJid)
						// store that this person has had the sender keys sent to them
						senderKeyMap[deviceJid] = true
					}
				}

				// if there are some participants with whom the session has not been established
				// if there are, we re-send the senderkey
				if (senderKeyJids.length) {
					logger.debug({ senderKeyJids }, 'sending new sender key')

					const senderKeyMsg: proto.IMessage = {
						senderKeyDistributionMessage: {
							axolotlSenderKeyDistributionMessage: senderKeyDistributionMessage,
							groupId: destinationJid
						}
					}

					await assertSessions(senderKeyJids, false)

					const result = await createParticipantNodes(senderKeyJids, senderKeyMsg, extraAttrs)
					shouldIncludeDeviceIdentity = shouldIncludeDeviceIdentity || result.shouldIncludeDeviceIdentity

					participants.push(...result.nodes)
				}

				binaryNodeContent.push({
					tag: 'enc',
					attrs: { v: '2', type: 'skmsg' },
					content: ciphertext
				})

				await authState.keys.set({ 'sender-key-memory': { [jid]: senderKeyMap } })
			} else {
				const { user: ownUser } = jidDecode(ownId)!

				if (!participant) {
					const targetUserServer = isLid ? 'lid' : 's.whatsapp.net'
					devices.push({
						user,
						device: 0,
						wireJid: jidEncode(user, targetUserServer, 0)
					})

					// Own user matches conversation addressing mode
					if (user !== ownUser) {
						const ownUserServer = isLid ? 'lid' : 's.whatsapp.net'
						const ownUserForAddressing = isLid && meLid ? jidDecode(meLid)!.user : jidDecode(meId)!.user

						devices.push({
							user: ownUserForAddressing,
							device: 0,
							wireJid: jidEncode(ownUserForAddressing, ownUserServer, 0)
						})
					}

					if (additionalAttributes?.['category'] !== 'peer') {
						// Clear placeholders and enumerate actual devices
						devices.length = 0

						// Use conversation-appropriate sender identity
						const senderIdentity =
							isLid && meLid
								? jidEncode(jidDecode(meLid)?.user!, 'lid', undefined)
								: jidEncode(jidDecode(meId)?.user!, 's.whatsapp.net', undefined)

						// Enumerate devices for sender and target with consistent addressing
						const sessionDevices = await getUSyncDevices([senderIdentity, jid], false, false)
						devices.push(...sessionDevices)

						logger.debug(
							{
								deviceCount: devices.length,
								devices: devices.map(d => `${d.user}:${d.device}@${jidDecode(d.wireJid)?.server}`)
							},
							'Device enumeration complete with unified addressing'
						)
					}
				}

				const allJids: string[] = []
				const meJids: string[] = []
				const otherJids: string[] = []
				const { user: mePnUser } = jidDecode(meId)!
				const { user: meLidUser } = meLid ? jidDecode(meLid)! : { user: null }

				for (const { user, wireJid } of devices) {
					const isExactSenderDevice = wireJid === meId || (meLid && wireJid === meLid)
					if (isExactSenderDevice) {
						logger.debug({ wireJid, meId, meLid }, 'Skipping exact sender device (whatsmeow pattern)')
						continue
					}

					// Check if this is our device (could match either PN or LID user)
					const isMe = user === mePnUser || (meLidUser && user === meLidUser)

					const jid = wireJid

					if (isMe) {
						meJids.push(jid)
					} else {
						otherJids.push(jid)
					}

					allJids.push(jid)
				}

				await assertSessions([...otherJids, ...meJids], false)

				const [
					{ nodes: meNodes, shouldIncludeDeviceIdentity: s1 },
					{ nodes: otherNodes, shouldIncludeDeviceIdentity: s2 }
				] = await Promise.all([
					// For own devices: use DSM if available (1:1 chats only)
					createParticipantNodes(meJids, meMsg || message, extraAttrs),
					createParticipantNodes(otherJids, message, extraAttrs, meMsg)
				])
				participants.push(...meNodes)
				participants.push(...otherNodes)

				shouldIncludeDeviceIdentity = shouldIncludeDeviceIdentity || s1 || s2
			}

			if (participants.length) {
				if (additionalAttributes?.['category'] === 'peer') {
					const peerNode = participants[0]?.content?.[0] as BinaryNode
					if (peerNode) {
						binaryNodeContent.push(peerNode) // push only enc
					}
				} else {
					binaryNodeContent.push({
						tag: 'participants',
						attrs: {},

						content: participants
					})
				}
			}

			const stanza: BinaryNode = {
				tag: 'message',
				attrs: {
					id: msgId,
					to: destinationJid,
					type: getMessageType(message),
					...(additionalAttributes || {})
				},
				content: binaryNodeContent
			}

			// if the participant to send to is explicitly specified (generally retry recp)
			// ensure the message is only sent to that person
			// if a retry receipt is sent to everyone -- it'll fail decryption for everyone else who received the msg
			if (participant) {
				if (isJidGroup(destinationJid)) {
					stanza.attrs.to = destinationJid
					stanza.attrs.participant = participant.jid
				} else if (areJidsSameUser(participant.jid, meId)) {
					stanza.attrs.to = participant.jid
					stanza.attrs.recipient = destinationJid
				} else {
					stanza.attrs.to = participant.jid
				}
			} else {
				stanza.attrs.to = destinationJid
			}

			if (shouldIncludeDeviceIdentity) {
				;(stanza.content as BinaryNode[]).push({
					tag: 'device-identity',
					attrs: {},
					content: encodeSignedDeviceIdentity(authState.creds.account!, true)
				})

				logger.debug({ jid }, 'adding device identity')
			}

			if (additionalNodes && additionalNodes.length > 0) {
				;(stanza.content as BinaryNode[]).push(...additionalNodes)
			}

			logger.debug({ msgId }, `sending message to ${participants.length} devices`)

			await sendNode(stanza)
		})

		return msgId
	}

	const getMessageType = (message: proto.IMessage) => {
		if (message.pollCreationMessage || message.pollCreationMessageV2 || message.pollCreationMessageV3) {
			return 'poll'
		}

		return 'text'
	}

	const getMediaType = (message: proto.IMessage) => {
		if (message.imageMessage) {
			return 'image'
		} else if (message.videoMessage) {
			return message.videoMessage.gifPlayback ? 'gif' : 'video'
		} else if (message.audioMessage) {
			return message.audioMessage.ptt ? 'ptt' : 'audio'
		} else if (message.contactMessage) {
			return 'vcard'
		} else if (message.documentMessage) {
			return 'document'
		} else if (message.contactsArrayMessage) {
			return 'contact_array'
		} else if (message.liveLocationMessage) {
			return 'livelocation'
		} else if (message.stickerMessage) {
			return 'sticker'
		} else if (message.listMessage) {
			return 'list'
		} else if (message.listResponseMessage) {
			return 'list_response'
		} else if (message.buttonsResponseMessage) {
			return 'buttons_response'
		} else if (message.orderMessage) {
			return 'order'
		} else if (message.productMessage) {
			return 'product'
		} else if (message.interactiveResponseMessage) {
			return 'native_flow_response'
		} else if (message.groupInviteMessage) {
			return 'url'
		}
	}

	const getPrivacyTokens = async (jids: string[]) => {
		const t = unixTimestampSeconds().toString()
		const result = await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'set',
				xmlns: 'privacy'
			},
			content: [
				{
					tag: 'tokens',
					attrs: {},
					content: jids.map(jid => ({
						tag: 'token',
						attrs: {
							jid: jidNormalizedUser(jid),
							t,
							type: 'trusted_contact'
						}
					}))
				}
			]
		})

		return result
	}

	const waUploadToServer = getWAUploadToServer(config, refreshMediaConn)

	const waitForMsgMediaUpdate = bindWaitForEvent(ev, 'messages.media-update')

	return {
		...sock,
		getPrivacyTokens,
		assertSessions,
		relayMessage,
		sendReceipt,
		sendReceipts,
		readMessages,
		refreshMediaConn,
		waUploadToServer,
		fetchPrivacySettings,
		sendPeerDataOperationMessage,
		createParticipantNodes,
		getUSyncDevices,
		updateMediaMessage: async (message: proto.IWebMessageInfo) => {
			const content = assertMediaContent(message.message)
			const mediaKey = content.mediaKey!
			const meId = authState.creds.me!.id
			const node = await encryptMediaRetryRequest(message.key, mediaKey, meId)

			let error: Error | undefined = undefined
			await Promise.all([
				sendNode(node),
				waitForMsgMediaUpdate(async update => {
					const result = update.find(c => c.key.id === message.key.id)
					if (result) {
						if (result.error) {
							error = result.error
						} else {
							try {
								const media = await decryptMediaRetryData(result.media!, mediaKey, result.key.id!)
								if (media.result !== proto.MediaRetryNotification.ResultType.SUCCESS) {
									const resultStr = proto.MediaRetryNotification.ResultType[media.result!]
									throw new Boom(`Media re-upload failed by device (${resultStr})`, {
										data: media,
										statusCode: getStatusCodeForMediaRetry(media.result!) || 404
									})
								}

								content.directPath = media.directPath
								content.url = getUrlFromDirectPath(content.directPath!)

								logger.debug({ directPath: media.directPath, key: result.key }, 'media update successful')
							} catch (err: any) {
								error = err
							}
						}

						return true
					}
				})
			])

			if (error) {
				throw error
			}

			ev.emit('messages.update', [{ key: message.key, update: { message: message.message } }])

			return message
		},
		sendMessage: async (jid: string, content: AnyMessageContent, options: MiscMessageGenerationOptions = {}) => {
			const userJid = authState.creds.me!.id
			if (
				typeof content === 'object' &&
				'disappearingMessagesInChat' in content &&
				typeof content['disappearingMessagesInChat'] !== 'undefined' &&
				isJidGroup(jid)
			) {
				const { disappearingMessagesInChat } = content
				const value =
					typeof disappearingMessagesInChat === 'boolean'
						? disappearingMessagesInChat
							? WA_DEFAULT_EPHEMERAL
							: 0
						: disappearingMessagesInChat
				await groupToggleEphemeral(jid, value)
			} else {
				const fullMsg = await generateWAMessage(jid, content, {
					logger,
					userJid,
					getUrlInfo: text =>
						getUrlInfo(text, {
							thumbnailWidth: linkPreviewImageThumbnailWidth,
							fetchOpts: {
								timeout: 3_000,
								...(axiosOptions || {})
							},
							logger,
							uploadImage: generateHighQualityLinkPreview ? waUploadToServer : undefined
						}),
					//TODO: CACHE
					getProfilePicUrl: sock.profilePictureUrl,
					upload: waUploadToServer,
					mediaCache: config.mediaCache,
					options: config.options,
					messageId: generateMessageIDV2(sock.user?.id),
					...options
				})
				const isDeleteMsg = 'delete' in content && !!content.delete
				const isEditMsg = 'edit' in content && !!content.edit
				const isPinMsg = 'pin' in content && !!content.pin
				const isPollMessage = 'poll' in content && !!content.poll
				const additionalAttributes: BinaryNodeAttributes = {}
				const additionalNodes: BinaryNode[] = []
				// required for delete
				if (isDeleteMsg) {
					// if the chat is a group, and I am not the author, then delete the message as an admin
					if (isJidGroup(content.delete?.remoteJid as string) && !content.delete?.fromMe) {
						additionalAttributes.edit = '8'
					} else {
						additionalAttributes.edit = '7'
					}
				} else if (isEditMsg) {
					additionalAttributes.edit = '1'
				} else if (isPinMsg) {
					additionalAttributes.edit = '2'
				} else if (isPollMessage) {
					additionalNodes.push({
						tag: 'meta',
						attrs: {
							polltype: 'creation'
						}
					} as BinaryNode)
				}

				if ('cachedGroupMetadata' in options) {
					console.warn(
						'cachedGroupMetadata in sendMessage are deprecated, now cachedGroupMetadata is part of the socket config.'
					)
				}

				await relayMessage(jid, fullMsg.message!, {
					messageId: fullMsg.key.id!,
					useCachedGroupMetadata: options.useCachedGroupMetadata,
					additionalAttributes,
					statusJidList: options.statusJidList,
					additionalNodes
				})
				if (config.emitOwnEvents) {
					process.nextTick(() => {
						processingMutex.mutex(() => upsertMessage(fullMsg, 'append'))
					})
				}

				return fullMsg
			}
		}
	}
}
