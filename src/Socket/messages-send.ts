import NodeCache from '@cacheable/node-cache'
import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto/index.js'
import { DEFAULT_CACHE_TTLS, WA_DEFAULT_EPHEMERAL } from '../Defaults'
import type {
	AlbumMediaItem,
	AlbumMediaResult,
	AlbumMessageOptions,
	AlbumSendResult,
	AnyMessageContent,
	MediaConnInfo,
	MessageReceiptType,
	MessageRelayOptions,
	MiscMessageGenerationOptions,
	SocketConfig,
	WAMessage,
	WAMessageKey
} from '../Types'
import { logMessageSent } from '../Utils/baileys-logger'
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
	generateParticipantHashV2,
	generateWAMessage,
	getStatusCodeForMediaRetry,
	getUrlFromDirectPath,
	getWAUploadToServer,
	hasNonNullishProperty,
	MessageRetryManager,
	normalizeMessageContent,
	parseAndInjectE2ESessions,
	unixTimestampSeconds
} from '../Utils'
import { getUrlInfo } from '../Utils/link-preview'
import { makeKeyedMutex } from '../Utils/make-mutex'
import { getMessageReportingToken, shouldIncludeReportingToken } from '../Utils/reporting-utils'
import {
	areJidsSameUser,
	type BinaryNode,
	type BinaryNodeAttributes,
	type FullJid,
	getBinaryNodeChild,
	getBinaryNodeChildren,
	isHostedLidUser,
	isHostedPnUser,
	isJidGroup,
	isLidUser,
	isPnUser,
	jidDecode,
	jidEncode,
	jidNormalizedUser,
	type JidWithDevice,
	S_WHATSAPP_NET
} from '../WABinary'
import { USyncQuery, USyncUser } from '../WAUSync'
import { recordMessageSent, recordMessageRetry, recordMessageFailure, metrics } from '../Utils/prometheus-metrics'
import { makeNewsletterSocket } from './newsletter'

export const makeMessagesSocket = (config: SocketConfig) => {
	const {
		logger,
		linkPreviewImageThumbnailWidth,
		generateHighQualityLinkPreview,
		options: httpRequestOptions,
		patchMessageBeforeSending,
		cachedGroupMetadata,
		enableRecentMessageCache,
		maxMsgRetryCount,
		enableInteractiveMessages
	} = config
	const sock = makeNewsletterSocket(config)
	const {
		ev,
		authState,
		messageMutex,
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

	const peerSessionsCache = new NodeCache<boolean>({
		stdTTL: DEFAULT_CACHE_TTLS.USER_DEVICES,
		useClones: false
	})

	// Initialize message retry manager if enabled
	const messageRetryManager = enableRecentMessageCache ? new MessageRetryManager(logger, maxMsgRetryCount) : null

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
				// TODO: explore full length of data that whatsapp provides
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

		if (type === 'sender' && (isPnUser(jid) || isLidUser(jid))) {
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

	/** Device info with wire JID */
	type DeviceWithJid = JidWithDevice & {
		jid: string
	}

	/** Fetch all the devices we've to send a message to */
	const getUSyncDevices = async (
		jids: string[],
		useCache: boolean,
		ignoreZeroDevices: boolean
	): Promise<DeviceWithJid[]> => {
		const deviceResults: DeviceWithJid[] = []

		if (!useCache) {
			logger.debug('not using cache for devices')
		}

		const toFetch: string[] = []

		const jidsWithUser = jids
			.map(jid => {
				const decoded = jidDecode(jid)
				const user = decoded?.user
				const device = decoded?.device
				const isExplicitDevice = typeof device === 'number' && device >= 0

				if (isExplicitDevice && user) {
					deviceResults.push({
						user,
						device,
						jid
					})
					return null
				}

				jid = jidNormalizedUser(jid)
				return { jid, user }
			})
			.filter(jid => jid !== null)

		let mgetDevices: undefined | Record<string, FullJid[] | undefined>

		if (useCache && userDevicesCache.mget) {
			const usersToFetch = jidsWithUser.map(j => j?.user).filter(Boolean) as string[]
			mgetDevices = await userDevicesCache.mget(usersToFetch)
		}

		for (const { jid, user } of jidsWithUser) {
			if (useCache) {
				const devices =
					mgetDevices?.[user!] ||
					(userDevicesCache.mget ? undefined : ((await userDevicesCache.get(user!)) as FullJid[]))
				if (devices) {
					const devicesWithJid = devices.map(d => ({
						...d,
						jid: jidEncode(d.user, d.server, d.device)
					}))
					deviceResults.push(...devicesWithJid)

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
			if (isLidUser(jid) || isHostedLidUser(jid)) {
				const user = jidDecode(jid)?.user
				if (user) requestedLidUsers.add(user)
			}
		}

		const query = new USyncQuery().withContext('message').withDeviceProtocol().withLIDProtocol()

		for (const jid of toFetch) {
			query.withUser(new USyncUser().withId(jid)) // todo: investigate - the idea here is that <user> should have an inline lid field with the lid being the pn equivalent
		}

		const result = await sock.executeUSyncQuery(query)

		if (result) {
			// TODO: LID MAP this stuff (lid protocol will now return lid with devices)
			const lidResults = result.list.filter(a => !!a.lid)
			if (lidResults.length > 0) {
				logger.trace('Storing LID maps from device call')
				await signalRepository.lidMapping.storeLIDPNMappings(lidResults.map(a => ({ lid: a.lid as string, pn: a.id })))

				// Force-refresh sessions for newly mapped LIDs to align identity addressing
				try {
					const lids = lidResults.map(a => a.lid as string)
					if (lids.length) {
						await assertSessions(lids, true)
					}
				} catch (e) {
					logger.warn({ e, count: lidResults.length }, 'failed to assert sessions for newly mapped LIDs')
				}
			}

			const extracted = extractDeviceJids(
				result?.list,
				authState.creds.me!.id,
				authState.creds.me!.lid!,
				ignoreZeroDevices
			)
			const deviceMap: { [_: string]: FullJid[] } = {}

			for (const item of extracted) {
				deviceMap[item.user] = deviceMap[item.user] || []
				deviceMap[item.user]?.push(item)
			}

			// Process each user's devices as a group for bulk LID migration
			for (const [user, userDevices] of Object.entries(deviceMap)) {
				const isLidUser = requestedLidUsers.has(user)

				// Process all devices for this user
				for (const item of userDevices) {
					const finalJid = isLidUser
						? jidEncode(user, item.server, item.device)
						: jidEncode(item.user, item.server, item.device)

					deviceResults.push({
						...item,
						jid: finalJid
					})

					logger.debug(
						{
							user: item.user,
							device: item.device,
							finalJid,
							usedLid: isLidUser
						},
						'Processed device with LID priority'
					)
				}
			}

			if (userDevicesCache.mset) {
				// if the cache supports mset, we can set all devices in one go
				await userDevicesCache.mset(Object.entries(deviceMap).map(([key, value]) => ({ key, value })))
			} else {
				for (const key in deviceMap) {
					if (deviceMap[key]) await userDevicesCache.set(key, deviceMap[key])
				}
			}

			const userDeviceUpdates: { [userId: string]: string[] } = {}
			for (const [userId, devices] of Object.entries(deviceMap)) {
				if (devices && devices.length > 0) {
					userDeviceUpdates[userId] = devices.map(d => d.device?.toString() || '0')
				}
			}

			if (Object.keys(userDeviceUpdates).length > 0) {
				try {
					await authState.keys.set({ 'device-list': userDeviceUpdates })
					logger.debug(
						{ userCount: Object.keys(userDeviceUpdates).length },
						'stored user device lists for bulk migration'
					)
				} catch (error) {
					logger.warn({ error }, 'failed to store user device lists')
				}
			}
		}

		return deviceResults
	}

	/**
	 * Update Member Label
	 */
	const updateMemberLabel = (jid: string, memberLabel: string) => {
		return relayMessage(
			jid,
			{
				protocolMessage: {
					type: proto.Message.ProtocolMessage.Type.GROUP_MEMBER_LABEL_CHANGE,
					memberLabel: {
						label: memberLabel?.slice(0, 30),
						labelTimestamp: unixTimestampSeconds()
					}
				}
			},
			{
				additionalNodes: [
					{
						tag: 'meta',
						attrs: {
							tag_reason: 'user_update',
							appdata: 'member_tag'
						},
						content: undefined
					}
				]
			}
		)
	}

	const assertSessions = async (jids: string[], force?: boolean) => {
		let didFetchNewSession = false
		const uniqueJids = [...new Set(jids)] // Deduplicate JIDs
		const jidsRequiringFetch: string[] = []

		logger.debug({ jids }, 'assertSessions call with jids')

		// Check peerSessionsCache and validate sessions using libsignal loadSession
		for (const jid of uniqueJids) {
			const signalId = signalRepository.jidToSignalProtocolAddress(jid)
			const cachedSession = peerSessionsCache.get(signalId)
			if (cachedSession !== undefined) {
				if (cachedSession && !force) {
					continue // Session exists in cache
				}
			} else {
				const sessionValidation = await signalRepository.validateSession(jid)
				const hasSession = sessionValidation.exists
				peerSessionsCache.set(signalId, hasSession)
				if (hasSession && !force) {
					continue
				}
			}

			jidsRequiringFetch.push(jid)
		}

		if (jidsRequiringFetch.length) {
			// LID if mapped, otherwise original
			const wireJids = [
				...jidsRequiringFetch.filter(jid => !!isLidUser(jid) || !!isHostedLidUser(jid)),
				...(
					(await signalRepository.lidMapping.getLIDsForPNs(
						jidsRequiringFetch.filter(jid => !!isPnUser(jid) || !!isHostedPnUser(jid))
					)) || []
				).map(a => a.lid)
			]

			logger.debug({ jidsRequiringFetch, wireJids }, 'fetching sessions')
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
						content: wireJids.map(jid => {
							const attrs: { [key: string]: string } = { jid }
							if (force) attrs.reason = 'identity'
							return { tag: 'user', attrs }
						})
					}
				]
			})
			await parseAndInjectE2ESessions(result, signalRepository)
			didFetchNewSession = true

			// Cache fetched sessions using wire JIDs
			for (const wireJid of wireJids) {
				const signalId = signalRepository.jidToSignalProtocolAddress(wireJid)
				peerSessionsCache.set(signalId, true)
			}
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
			},
			additionalNodes: [
				{
					tag: 'meta',
					attrs: { appdata: 'default' }
				}
			]
		})

		return msgId
	}

	const createParticipantNodes = async (
		recipientJids: string[],
		message: proto.IMessage,
		extraAttrs?: BinaryNode['attrs'],
		dsmMessage?: proto.IMessage
	) => {
		if (!recipientJids.length) {
			return { nodes: [] as BinaryNode[], shouldIncludeDeviceIdentity: false }
		}

		const patched = await patchMessageBeforeSending(message, recipientJids)
		const patchedMessages = Array.isArray(patched)
			? patched
			: recipientJids.map(jid => ({ recipientJid: jid, message: patched }))

		let shouldIncludeDeviceIdentity = false
		const meId = authState.creds.me!.id
		const meLid = authState.creds.me?.lid
		const meLidUser = meLid ? jidDecode(meLid)?.user : null

		const encryptionPromises = (patchedMessages as any).map(
			async ({ recipientJid: jid, message: patchedMessage }: any) => {
				try {
					if (!jid) return null

					let msgToEncrypt = patchedMessage

					if (dsmMessage) {
						const { user: targetUser } = jidDecode(jid)!
						const { user: ownPnUser } = jidDecode(meId)!
						const ownLidUser = meLidUser

						const isOwnUser = targetUser === ownPnUser || (ownLidUser && targetUser === ownLidUser)
						const isExactSenderDevice = jid === meId || (meLid && jid === meLid)

						if (isOwnUser && !isExactSenderDevice) {
							msgToEncrypt = dsmMessage
							logger.debug({ jid, targetUser }, 'Using DSM for own device')
						}
					}

					const bytes = encodeWAMessage(msgToEncrypt)
					const mutexKey = jid

					const node = await encryptionMutex.mutex(mutexKey, async () => {
						const { type, ciphertext } = await signalRepository.encryptMessage({ jid, data: bytes })

						if (type === 'pkmsg') {
							shouldIncludeDeviceIdentity = true
						}

						return {
							tag: 'to',
							attrs: { jid },
							content: [
								{
									tag: 'enc',
									attrs: { v: '2', type, ...(extraAttrs || {}) },
									content: ciphertext
								}
							]
						}
					})

					return node
				} catch (err) {
					logger.error({ jid, err }, 'Failed to encrypt for recipient')
					return null
				}
			}
		)

		const nodes = (await Promise.all(encryptionPromises)).filter(node => node !== null) as BinaryNode[]

		if (recipientJids.length > 0 && nodes.length === 0) {
			recordMessageFailure('send', 'encryption_failed')
			throw new Boom('All encryptions failed', { statusCode: 500 })
		}

		return { nodes, shouldIncludeDeviceIdentity }
	}

	// ⚠️ EXPERIMENTAL: Functions to detect and handle interactive messages
	// These features may not work and can cause account bans
	const getButtonType = (message: proto.IMessage): string | undefined => {
		// Check direct message types (legacy formats)
		if (message.buttonsMessage) {
			return 'buttons'
		} else if (message.templateMessage) {
			return 'template'
		} else if (message.listMessage) {
			return 'list'
		} else if (message.buttonsResponseMessage) {
			return 'buttons_response'
		} else if (message.listResponseMessage) {
			return 'list_response'
		} else if (message.templateButtonReplyMessage) {
			return 'template_reply'
		} else if (message.interactiveMessage) {
			return 'interactive'
		}

		// Check inside viewOnceMessage wrapper (modern nativeFlowMessage format)
		// This is the recommended format for interactive messages
		const innerMessage = message.viewOnceMessage?.message
		if (innerMessage) {
			if (innerMessage.interactiveMessage) {
				return 'interactive'
			} else if (innerMessage.listMessage) {
				return 'list'
			} else if (innerMessage.buttonsMessage) {
				return 'buttons'
			}
		}

		return undefined
	}

	const getButtonArgs = (message: proto.IMessage): BinaryNodeAttributes => {
		// Return appropriate attributes for each button type
		// This is often empty but required for the 'biz' node structure
		return {}
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
		const isRetryResend = Boolean(participant?.jid)
		let shouldIncludeDeviceIdentity = isRetryResend
		const statusJid = 'status@broadcast'

		const { user, server } = jidDecode(jid)!
		const isGroup = server === 'g.us'
		const isStatus = jid === statusJid
		const isLid = server === 'lid'
		const isNewsletter = server === 'newsletter'
		const isGroupOrStatus = isGroup || isStatus
		const finalJid = jid

		msgId = msgId || generateMessageIDV2(meId)
		useUserDevicesCache = useUserDevicesCache !== false
		useCachedGroupMetadata = useCachedGroupMetadata !== false && !isStatus

		const participants: BinaryNode[] = []
		const destinationJid = !isStatus ? finalJid : statusJid
		const binaryNodeContent: BinaryNode[] = []
		const devices: DeviceWithJid[] = []
		let reportingMessage: proto.IMessage | undefined

		const meMsg: proto.IMessage = {
			deviceSentMessage: {
				destinationJid,
				message
			},
			messageContextInfo: message.messageContextInfo
		}

		const extraAttrs: BinaryNodeAttributes = {}

		if (participant) {
			if (!isGroup && !isStatus) {
				additionalAttributes = { ...additionalAttributes, device_fanout: 'false' }
			}

			const { user, device } = jidDecode(participant.jid)!
			devices.push({
				user,
				device,
				jid: participant.jid
			})
		}

		await authState.keys.transaction(async () => {
			const mediaType = getMediaType(message)
			if (mediaType) {
				extraAttrs['mediatype'] = mediaType
			}

			if (isNewsletter) {
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

			if (normalizeMessageContent(message)?.pinInChatMessage || normalizeMessageContent(message)?.reactionMessage) {
				extraAttrs['decrypt-fail'] = 'hide' // todo: expand for reactions and other types
			}

			if (isGroupOrStatus && !isRetryResend) {
				const [groupData, senderKeyMap] = await Promise.all([
					(async () => {
						let groupData = useCachedGroupMetadata && cachedGroupMetadata ? await cachedGroupMetadata(jid) : undefined // todo: should we rely on the cache specially if the cache is outdated and the metadata has new fields?
						if (groupData && Array.isArray(groupData?.participants)) {
							logger.trace({ jid, participants: groupData.participants.length }, 'using cached group metadata')
						} else if (!isStatus) {
							groupData = await groupMetadata(jid) // TODO: start storing group participant list + addr mode in Signal & stop relying on this
						}

						return groupData
					})(),
					(async () => {
						if (!participant && !isStatus) {
							// what if sender memory is less accurate than the cached metadata
							// on participant change in group, we should do sender memory manipulation
							const result = await authState.keys.get('sender-key-memory', [jid]) // TODO: check out what if the sender key memory doesn't include the LID stuff now?
							return result[jid] || {}
						}

						return {}
					})()
				])

				const participantsList = groupData ? groupData.participants.map(p => p.id) : []

				if (groupData?.ephemeralDuration && groupData.ephemeralDuration > 0) {
					additionalAttributes = {
						...additionalAttributes,
						expiration: groupData.ephemeralDuration.toString()
					}
				}

				if (isStatus && statusJidList) {
					participantsList.push(...statusJidList)
				}

				const additionalDevices = await getUSyncDevices(participantsList, !!useUserDevicesCache, false)
				devices.push(...additionalDevices)

				if (isGroup) {
					additionalAttributes = {
						...additionalAttributes,
						addressing_mode: groupData?.addressingMode || 'lid'
					}
				}

				const patched = await patchMessageBeforeSending(message)
				if (Array.isArray(patched)) {
					throw new Boom('Per-jid patching is not supported in groups')
				}

				const bytes = encodeWAMessage(patched)
				reportingMessage = patched
				const groupAddressingMode = additionalAttributes?.['addressing_mode'] || groupData?.addressingMode || 'lid'
				const groupSenderIdentity = groupAddressingMode === 'lid' && meLid ? meLid : meId

				const { ciphertext, senderKeyDistributionMessage } = await signalRepository.encryptGroupMessage({
					group: destinationJid,
					data: bytes,
					meId: groupSenderIdentity
				})

				const senderKeyRecipients: string[] = []
				for (const device of devices) {
					const deviceJid = device.jid
					const hasKey = !!senderKeyMap[deviceJid]
					if (
						(!hasKey || !!participant) &&
						!isHostedLidUser(deviceJid) &&
						!isHostedPnUser(deviceJid) &&
						device.device !== 99
					) {
						//todo: revamp all this logic
						// the goal is to follow with what I said above for each group, and instead of a true false map of ids, we can set an array full of those the app has already sent pkmsgs
						senderKeyRecipients.push(deviceJid)
						senderKeyMap[deviceJid] = true
					}
				}

				if (senderKeyRecipients.length) {
					logger.debug({ senderKeyJids: senderKeyRecipients }, 'sending new sender key')

					const senderKeyMsg: proto.IMessage = {
						senderKeyDistributionMessage: {
							axolotlSenderKeyDistributionMessage: senderKeyDistributionMessage,
							groupId: destinationJid
						}
					}

					const senderKeySessionTargets = senderKeyRecipients
					await assertSessions(senderKeySessionTargets)

					const result = await createParticipantNodes(senderKeyRecipients, senderKeyMsg, extraAttrs)
					shouldIncludeDeviceIdentity = shouldIncludeDeviceIdentity || result.shouldIncludeDeviceIdentity

					participants.push(...result.nodes)
				}

				binaryNodeContent.push({
					tag: 'enc',
					attrs: { v: '2', type: 'skmsg', ...extraAttrs },
					content: ciphertext
				})

				await authState.keys.set({ 'sender-key-memory': { [jid]: senderKeyMap } })
			} else {
				// ADDRESSING CONSISTENCY: Match own identity to conversation context
				// TODO: investigate if this is true
				let ownId = meId
				if (isLid && meLid) {
					ownId = meLid
					logger.debug({ to: jid, ownId }, 'Using LID identity for @lid conversation')
				} else {
					logger.debug({ to: jid, ownId }, 'Using PN identity for @s.whatsapp.net conversation')
				}

				const { user: ownUser } = jidDecode(ownId)!
				if (!participant) {
					const patchedForReporting = await patchMessageBeforeSending(message, [jid])
					reportingMessage = Array.isArray(patchedForReporting)
						? patchedForReporting.find(item => item.recipientJid === jid) || patchedForReporting[0]
						: patchedForReporting
				}

				if (!isRetryResend) {
					const targetUserServer = isLid ? 'lid' : 's.whatsapp.net'
					devices.push({
						user,
						device: 0,
						jid: jidEncode(user, targetUserServer, 0) // rajeh, todo: this entire logic is convoluted and weird.
					})

					if (user !== ownUser) {
						const ownUserServer = isLid ? 'lid' : 's.whatsapp.net'
						const ownUserForAddressing = isLid && meLid ? jidDecode(meLid)!.user : jidDecode(meId)!.user

						devices.push({
							user: ownUserForAddressing,
							device: 0,
							jid: jidEncode(ownUserForAddressing, ownUserServer, 0)
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
						const sessionDevices = await getUSyncDevices([senderIdentity, jid], true, false)
						devices.push(...sessionDevices)

						logger.debug(
							{
								deviceCount: devices.length,
								devices: devices.map(d => `${d.user}:${d.device}@${jidDecode(d.jid)?.server}`)
							},
							'Device enumeration complete with unified addressing'
						)
					}
				}

				const allRecipients: string[] = []
				const meRecipients: string[] = []
				const otherRecipients: string[] = []
				const { user: mePnUser } = jidDecode(meId)!
				const { user: meLidUser } = meLid ? jidDecode(meLid)! : { user: null }

				for (const { user, jid } of devices) {
					const isExactSenderDevice = jid === meId || (meLid && jid === meLid)
					if (isExactSenderDevice) {
						logger.debug({ jid, meId, meLid }, 'Skipping exact sender device (whatsmeow pattern)')
						continue
					}

					// Check if this is our device (could match either PN or LID user)
					const isMe = user === mePnUser || user === meLidUser

					if (isMe) {
						meRecipients.push(jid)
					} else {
						otherRecipients.push(jid)
					}

					allRecipients.push(jid)
				}

				await assertSessions(allRecipients)

				const [
					{ nodes: meNodes, shouldIncludeDeviceIdentity: s1 },
					{ nodes: otherNodes, shouldIncludeDeviceIdentity: s2 }
				] = await Promise.all([
					// For own devices: use DSM if available (1:1 chats only)
					createParticipantNodes(meRecipients, meMsg || message, extraAttrs),
					createParticipantNodes(otherRecipients, message, extraAttrs, meMsg)
				])
				participants.push(...meNodes)
				participants.push(...otherNodes)

				if (meRecipients.length > 0 || otherRecipients.length > 0) {
					extraAttrs['phash'] = generateParticipantHashV2([...meRecipients, ...otherRecipients])
				}

				shouldIncludeDeviceIdentity = shouldIncludeDeviceIdentity || s1 || s2
			}

			if (isRetryResend) {
				const isParticipantLid = isLidUser(participant!.jid)
				const isMe = areJidsSameUser(participant!.jid, isParticipantLid ? meLid : meId)

				const encodedMessageToSend = isMe
					? encodeWAMessage({
							deviceSentMessage: {
								destinationJid,
								message
							}
						})
					: encodeWAMessage(message)

				const { type, ciphertext: encryptedContent } = await signalRepository.encryptMessage({
					data: encodedMessageToSend,
					jid: participant!.jid
				})

				binaryNodeContent.push({
					tag: 'enc',
					attrs: {
						v: '2',
						type,
						count: participant!.count.toString()
					},
					content: encryptedContent
				})
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

			// ⚠️ EXPERIMENTAL: Inject 'biz' node for interactive messages
			// This may not work and can cause account bans
			const buttonType = getButtonType(message)
			if (buttonType && enableInteractiveMessages) {
				const startTime = Date.now()
				logger.warn(
					{ msgId, buttonType, to: destinationJid, enableInteractiveMessages },
					'[EXPERIMENTAL] Injecting biz node for interactive message - may cause ban'
				)

				// Track that we're sending an interactive message
				metrics.interactiveMessagesSent.inc({ type: buttonType })

				try {
					;(stanza.content as BinaryNode[]).push({
						tag: 'biz',
						attrs: {},
						content: [
							{
								tag: buttonType,
								attrs: getButtonArgs(message)
							}
						]
					})

					// Track success and latency after message is sent
					metrics.interactiveMessagesSuccess.inc({ type: buttonType })
					metrics.interactiveMessagesLatency.observe({ type: buttonType }, Date.now() - startTime)
				} catch (error) {
					logger.error(
						{ error, msgId, buttonType },
						'[EXPERIMENTAL] Failed to inject biz node for interactive message'
					)
					metrics.interactiveMessagesFailures.inc({ type: buttonType, reason: 'injection_failed' })
				}
			} else if (buttonType && !enableInteractiveMessages) {
				logger.warn(
					{ msgId, buttonType },
					'[EXPERIMENTAL] Interactive message detected but feature disabled (enableInteractiveMessages=false)'
				)
				metrics.interactiveMessagesFailures.inc({ type: buttonType, reason: 'feature_disabled' })
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

			if (
				!isNewsletter &&
				!isRetryResend &&
				reportingMessage?.messageContextInfo?.messageSecret &&
				shouldIncludeReportingToken(reportingMessage)
			) {
				try {
					const encoded = encodeWAMessage(reportingMessage)
					const reportingKey: WAMessageKey = {
						id: msgId,
						fromMe: true,
						remoteJid: destinationJid,
						participant: participant?.jid
					}
					const reportingNode = await getMessageReportingToken(encoded, reportingMessage, reportingKey)
					if (reportingNode) {
						;(stanza.content as BinaryNode[]).push(reportingNode)
						logger.trace({ jid }, 'added reporting token to message')
					}
				} catch (error: any) {
					logger.warn({ jid, trace: error?.stack }, 'failed to attach reporting token')
				}
			}

			const contactTcTokenData =
				!isGroup && !isRetryResend && !isStatus ? await authState.keys.get('tctoken', [destinationJid]) : {}

			const tcTokenBuffer = contactTcTokenData[destinationJid]?.token

			if (tcTokenBuffer) {
				;(stanza.content as BinaryNode[]).push({
					tag: 'tctoken',
					attrs: {},
					content: tcTokenBuffer
				})
			}

			if (additionalNodes && additionalNodes.length > 0) {
				;(stanza.content as BinaryNode[]).push(...additionalNodes)
			}

			logger.debug({ msgId }, `sending message to ${participants.length} devices`)

			await sendNode(stanza)

			// Log with [BAILEYS] prefix
			logMessageSent(msgId, destinationJid)

			// Record message sent metric
			const msgType = message.conversation ? 'text'
				: message.imageMessage ? 'image'
				: message.videoMessage ? 'video'
				: message.audioMessage ? 'audio'
				: message.documentMessage ? 'document'
				: message.stickerMessage ? 'sticker'
				: message.reactionMessage ? 'reaction'
				: 'other'
			recordMessageSent(msgType)

			// Add message to retry cache if enabled
			if (messageRetryManager && !participant) {
				messageRetryManager.addRecentMessage(destinationJid, msgId, message)
			}
		}, meId)

		return msgId
	}

	const getMessageType = (message: proto.IMessage) => {
		const normalizedMessage = normalizeMessageContent(message)
		if (!normalizedMessage) return 'text'

		if (normalizedMessage.reactionMessage || normalizedMessage.encReactionMessage) {
			return 'reaction'
		}

		if (
			normalizedMessage.pollCreationMessage ||
			normalizedMessage.pollCreationMessageV2 ||
			normalizedMessage.pollCreationMessageV3 ||
			normalizedMessage.pollUpdateMessage
		) {
			return 'poll'
		}

		if (normalizedMessage.eventMessage) {
			return 'event'
		}

		if (getMediaType(normalizedMessage) !== '') {
			return 'media'
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

		return ''
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
		messageRetryManager,
		updateMemberLabel,
		updateMediaMessage: async (message: WAMessage) => {
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

		/**
		 * Send an album message (multiple images/videos grouped together)
		 *
		 * @param jid - The recipient JID
		 * @param album - Album configuration with media items
		 * @param options - Additional message generation options
		 * @returns Complete result with status of each media item
		 *
		 * @example
		 * ```typescript
		 * const result = await sock.sendAlbumMessage('1234567890@s.whatsapp.net', {
		 *   medias: [
		 *     { image: { url: './photo1.jpg' }, caption: 'First photo' },
		 *     { image: { url: './photo2.jpg' }, caption: 'Second photo' },
		 *     { video: { url: './video.mp4' }, caption: 'A video' }
		 *   ],
		 *   delay: 'adaptive', // or fixed ms like 500
		 *   retryCount: 3,
		 *   continueOnFailure: true
		 * })
		 *
		 * if (!result.success) {
		 *   console.log('Failed items:', result.failedIndices)
		 * }
		 * ```
		 */
		sendAlbumMessage: async (
			jid: string,
			album: AlbumMessageOptions,
			options: MiscMessageGenerationOptions = {}
		): Promise<AlbumSendResult> => {
			const startTime = Date.now()
			const userJid = authState.creds.me!.id

			const {
				medias,
				delay: delayConfig = 'adaptive',
				retryCount = 3,
				continueOnFailure = true
			} = album

			// Validation (also done in generateWAMessageContent, but double-check here)
			if (!medias || medias.length < 2) {
				throw new Boom('Album must have at least 2 media items', { statusCode: 400 })
			}
			if (medias.length > 10) {
				throw new Boom('Album cannot have more than 10 media items (WhatsApp limit)', { statusCode: 400 })
			}

			// Count media types for album root
			// Use hasNonNullishProperty for consistency with generateWAMessageContent validation
			const imageCount = medias.filter(m => hasNonNullishProperty(m as AnyMessageContent, 'image')).length
			const videoCount = medias.filter(m => hasNonNullishProperty(m as AnyMessageContent, 'video')).length

			logger.info(
				{ jid, totalItems: medias.length, imageCount, videoCount, delayConfig, retryCount },
				'Starting album message send'
			)

			// Generate album root message first (with counts of expected media)
			const albumRootMsg = await generateWAMessage(jid, {
				album: { medias, delay: delayConfig, retryCount, continueOnFailure }
			}, {
				logger,
				userJid,
				getUrlInfo: text => getUrlInfo(text, {
					thumbnailWidth: linkPreviewImageThumbnailWidth,
					fetchOpts: { timeout: 3_000, ...(httpRequestOptions || {}) },
					logger,
					uploadImage: generateHighQualityLinkPreview ? waUploadToServer : undefined
				}),
				upload: waUploadToServer,
				mediaCache: config.mediaCache,
				// Don't spread options here to avoid messageId collision
				timestamp: options.timestamp,
				quoted: options.quoted,
				ephemeralExpiration: options.ephemeralExpiration,
				mediaUploadTimeoutMs: options.mediaUploadTimeoutMs
			})

			const albumKey = albumRootMsg.key

			// CRITICAL: Relay album root message to server first
			// Without this, child media items reference a non-existent album key
			await relayMessage(jid, albumRootMsg.message!, {
				messageId: albumRootMsg.key.id!,
				useCachedGroupMetadata: options.useCachedGroupMetadata
			})

			// Emit own event for album root if configured
			if (config.emitOwnEvents) {
				process.nextTick(async () => {
					await messageMutex.mutex(() => upsertMessage(albumRootMsg, 'append'))
				})
			}

			logger.debug({ albumKeyId: albumKey.id }, 'Album root message relayed')

			const results: AlbumMediaResult[] = []

			/**
			 * Calculate adaptive delay based on media characteristics
			 * Videos get more delay (2x), later items get slightly more delay,
			 * plus random jitter to prevent predictable patterns
			 */
			const calculateAdaptiveDelay = (media: AlbumMediaItem, index: number): number => {
				const baseDelay = 500 // Base delay in ms

				// Videos get more delay
				const isVideo = 'video' in media
				const mediaTypeMultiplier = isVideo ? 2.0 : 1.0

				// Later items in album get slightly more delay (cumulative load)
				const positionMultiplier = 1 + (index * 0.1)

				// Add some jitter to prevent predictable patterns
				const jitter = Math.random() * 200

				return Math.round(baseDelay * mediaTypeMultiplier * positionMultiplier + jitter)
			}

			/**
			 * Get delay for this media item
			 */
			const getDelay = (media: AlbumMediaItem, index: number): number => {
				if (delayConfig === 'adaptive') {
					return calculateAdaptiveDelay(media, index)
				}
				return delayConfig
			}

			/**
			 * Send a single media item with retry logic
			 */
			const sendMediaWithRetry = async (
				media: AlbumMediaItem,
				index: number
			): Promise<AlbumMediaResult> => {
				const itemStartTime = Date.now()
				let lastError: Error | undefined
				let attempts = 0

				for (let attempt = 0; attempt <= retryCount; attempt++) {
					attempts = attempt + 1
					try {
						// Generate message for this media item
					// NOTE: Each item needs its own unique messageId, so we don't spread options.messageId
						const mediaMsg = await generateWAMessage(jid, media as AnyMessageContent, {
							logger,
							userJid,
							getUrlInfo: text => getUrlInfo(text, {
								thumbnailWidth: linkPreviewImageThumbnailWidth,
								fetchOpts: { timeout: 3_000, ...(httpRequestOptions || {}) },
								logger,
								uploadImage: generateHighQualityLinkPreview ? waUploadToServer : undefined
							}),
							upload: waUploadToServer,
							mediaCache: config.mediaCache,
							// Don't spread ...options to avoid messageId collision
							// Each item gets a fresh ID from generateWAMessage
							timestamp: options.timestamp,
							quoted: options.quoted,
							ephemeralExpiration: options.ephemeralExpiration,
							mediaUploadTimeoutMs: options.mediaUploadTimeoutMs
						})

						// Attach to parent album via messageAssociation (correct proto structure)
						// Uses AssociationType.MEDIA_ALBUM and parentMessageKey as per WhatsApp protocol
						if (!mediaMsg.message!.messageContextInfo) {
							mediaMsg.message!.messageContextInfo = {}
						}
						mediaMsg.message!.messageContextInfo.messageAssociation = {
							associationType: proto.MessageAssociation.AssociationType.MEDIA_ALBUM,
							parentMessageKey: albumKey
						}

						// Relay the message
						await relayMessage(jid, mediaMsg.message!, {
							messageId: mediaMsg.key.id!,
							useCachedGroupMetadata: options.useCachedGroupMetadata
						})

						// Emit own event if configured
						if (config.emitOwnEvents) {
							process.nextTick(async () => {
								await messageMutex.mutex(() => upsertMessage(mediaMsg, 'append'))
							})
						}

						logger.debug(
							{ index, msgId: mediaMsg.key.id, attempts },
							'Album media item sent successfully'
						)

						return {
							index,
							success: true,
							message: mediaMsg,
							retryAttempts: attempts,
							latencyMs: Date.now() - itemStartTime
						}
					} catch (error) {
						lastError = error as Error
						logger.warn(
							{ index, attempt: attempts, error: lastError.message },
							'Album media item send failed, will retry'
						)

						// Exponential backoff for retries
						if (attempt < retryCount) {
							const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 10000)
							await new Promise(resolve => setTimeout(resolve, backoffDelay))
						}
					}
				}

				// All retries exhausted
				logger.error(
					{ index, attempts, error: lastError?.message },
					'Album media item failed after all retries'
				)

				return {
					index,
					success: false,
					error: lastError,
					retryAttempts: attempts,
					latencyMs: Date.now() - itemStartTime
				}
			}

			// Send each media item sequentially
			for (let i = 0; i < medias.length; i++) {
				const media = medias[i]!

				const result = await sendMediaWithRetry(media, i)
				results.push(result)

				// Check if we should stop on failure
				if (!result.success && !continueOnFailure) {
					logger.warn(
						{ index: i, totalItems: medias.length },
						'Album send stopped due to failure (continueOnFailure=false)'
					)
					break
				}

				// Apply delay before next item (except for last item)
				if (i < medias.length - 1) {
					const delay = getDelay(media, i)
					logger.trace({ index: i, delayMs: delay }, 'Waiting before next album item')
					await new Promise(resolve => setTimeout(resolve, delay))
				}
			}

			// Calculate final results
			const attemptedItems = results.length
			const stoppedEarly = attemptedItems < medias.length
			const successCount = results.filter(r => r.success).length
			const failedCount = results.filter(r => !r.success).length
			const failedIndices = results.filter(r => !r.success).map(r => r.index)
			const totalLatencyMs = Date.now() - startTime

			const finalResult: AlbumSendResult = {
				albumKey,
				results,
				totalItems: medias.length,
				attemptedItems,
				successCount,
				failedCount,
				failedIndices,
				success: failedCount === 0 && !stoppedEarly,
				stoppedEarly,
				totalLatencyMs
			}

			logger.info(
				{
					albumKeyId: albumKey.id,
					totalItems: medias.length,
					attemptedItems,
					successCount,
					failedCount,
					stoppedEarly,
					totalLatencyMs
				},
				'Album message send completed'
			)

			return finalResult
		},

		sendMessage: async (jid: string, content: AnyMessageContent, options: MiscMessageGenerationOptions = {}) => {
			// Check for album misuse - must use sendAlbumMessage instead
			if (typeof content === 'object' && 'album' in content) {
				throw new Boom(
					'Cannot send album messages with sendMessage(). Use sendAlbumMessage() instead, ' +
					'which properly sends the album root and individual media items.',
					{ statusCode: 400 }
				)
			}

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
								...(httpRequestOptions || {})
							},
							logger,
							uploadImage: generateHighQualityLinkPreview ? waUploadToServer : undefined
						}),
					//TODO: CACHE
					getProfilePicUrl: sock.profilePictureUrl,
					getCallLink: sock.createCallLink,
					upload: waUploadToServer,
					mediaCache: config.mediaCache,
					options: config.options,
					messageId: generateMessageIDV2(sock.user?.id),
					...options
				})
				const isEventMsg = 'event' in content && !!content.event
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
				} else if (isEventMsg) {
					additionalNodes.push({
						tag: 'meta',
						attrs: {
							event_type: 'creation'
						}
					} as BinaryNode)
				}

				await relayMessage(jid, fullMsg.message!, {
					messageId: fullMsg.key.id!,
					useCachedGroupMetadata: options.useCachedGroupMetadata,
					additionalAttributes,
					statusJidList: options.statusJidList,
					additionalNodes
				})
				if (config.emitOwnEvents) {
					process.nextTick(async () => {
						await messageMutex.mutex(() => upsertMessage(fullMsg, 'append'))
					})
				}

				return fullMsg
			}
		}
	}
}
