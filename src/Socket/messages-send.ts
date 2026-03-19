import { randomBytes } from 'crypto'
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
import { logMessageSent, logTcToken } from '../Utils/baileys-logger'
import { getUrlInfo } from '../Utils/link-preview'
import { makeKeyedMutex } from '../Utils/make-mutex'
import { metrics, recordMessageFailure, recordMessageSent } from '../Utils/prometheus-metrics'
import { getMessageReportingToken, shouldIncludeReportingToken } from '../Utils/reporting-utils'
import {
	isTcTokenExpired,
	resolveTcTokenJid,
	shouldSendNewTcToken,
	storeTcTokensFromIqResult
} from '../Utils/tc-token-utils'
import {
	areJidsSameUser,
	type BinaryNode,
	type BinaryNodeAttributes,
	type FullJid,
	getBinaryNodeChild,
	getBinaryNodeChildren,
	isAnyLidUser,
	isAnyPnUser,
	isHostedLidUser,
	isHostedPnUser,
	isJidBot,
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
		sessionActivityTracker,
		upsertMessage,
		query,
		fetchPrivacySettings,
		sendNode,
		groupMetadata,
		groupToggleEphemeral
	} = sock

	const getLIDForPN = signalRepository.lidMapping.getLIDForPN.bind(signalRepository.lidMapping)

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

	// Tracks JIDs with an in-flight getPrivacyTokens IQ to avoid duplicate concurrent fetches
	const tcTokenFetchingJids = new Set<string>()

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
				const mediaConnNode = getBinaryNodeChild(result, 'media_conn')
				if (!mediaConnNode) throw new Boom('Missing media_conn node')
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
			if (!participant) throw new Boom('Missing participant for sender receipt')
			node.attrs.recipient = jid
			node.attrs.to = participant
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
			if (isAnyLidUser(jid)) {
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

			const meId = authState.creds.me?.id
			if (!meId) throw new Boom('Not authenticated', { statusCode: 401 })
			const meLid = authState.creds.me?.lid || ''

			const extracted = extractDeviceJids(result?.list, meId, meLid, ignoreZeroDevices)
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
				...jidsRequiringFetch.filter(jid => isAnyLidUser(jid)),
				...(
					(await signalRepository.lidMapping.getLIDsForPNs(jidsRequiringFetch.filter(jid => isAnyPnUser(jid)))) || []
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

	const canonicalizeCarouselRecipients = async (recipientJids: string[]): Promise<string[]> => {
		if (!recipientJids.length) {
			return recipientJids
		}

		const pnRecipients = [...new Set(recipientJids.filter(jid => isAnyPnUser(jid)))]
		if (!pnRecipients.length) {
			return recipientJids
		}

		const mappings = (await signalRepository.lidMapping.getLIDsForPNs(pnRecipients)) || []
		if (!mappings.length) {
			logger.debug({ recipientCount: recipientJids.length }, '[CAROUSEL] No PN→LID recipient mappings found')
			return recipientJids
		}

		const pnToLid = new Map(mappings.map(item => [item.pn, item.lid]))
		const mapped = recipientJids.map(jid => pnToLid.get(jid) || jid)
		const changed = mapped.filter((jid, index) => jid !== recipientJids[index]).length

		logger.info(
			{
				recipientCount: recipientJids.length,
				pnRecipients: pnRecipients.length,
				mappedRecipients: changed
			},
			'[CAROUSEL] Canonicalized recipient addressing to LID before session assert/encrypt'
		)

		return mapped
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

	const resolveDsmMessageForRecipient = (
		jid: string,
		patchedMessage: proto.IMessage,
		dsmMessage: proto.IMessage | undefined,
		meId: string,
		meLid: string | undefined,
		meLidUser: string | null | undefined
	) => {
		if (!dsmMessage) {
			return patchedMessage
		}

		const { user: targetUser } = jidDecode(jid)!
		const { user: ownPnUser } = jidDecode(meId)!
		const isOwnUser = targetUser === ownPnUser || (meLidUser && targetUser === meLidUser)
		const isExactSenderDevice = jid === meId || (meLid && jid === meLid)

		if (isOwnUser && !isExactSenderDevice) {
			logger.debug({ jid, targetUser }, 'Using DSM for own device')
			return dsmMessage
		}

		return patchedMessage
	}

	const encryptPatchedMessageForRecipient = async ({
		jid,
		patchedMessage,
		dsmMessage,
		meId,
		meLid,
		meLidUser,
		extraAttrs,
		onPkmsg
	}: {
		jid: string
		patchedMessage: proto.IMessage
		dsmMessage: proto.IMessage | undefined
		meId: string
		meLid: string | undefined
		meLidUser: string | null | undefined
		extraAttrs: BinaryNode['attrs'] | undefined
		onPkmsg: () => void
	}) => {
		if (!jid) return null

		try {
			const msgToEncrypt = resolveDsmMessageForRecipient(jid, patchedMessage, dsmMessage, meId, meLid, meLidUser)
			const bytes = encodeWAMessage(msgToEncrypt)
			const mutexKey = jid

			return await encryptionMutex.mutex(mutexKey, async () => {
				const { type, ciphertext } = await signalRepository.encryptMessage({ jid, data: bytes })

				if (type === 'pkmsg') {
					onPkmsg()
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
				} as BinaryNode
			})
		} catch (err) {
			logger.error({ jid, err }, 'Failed to encrypt for recipient')
			return null
		}
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
		const meId = authState.creds.me?.id
		if (!meId) throw new Boom('Not authenticated', { statusCode: 401 })
		const meLid = authState.creds.me?.lid
		const meLidUser = meLid ? (jidDecode(meLid)?.user ?? null) : null
		const onPkmsg = () => {
			shouldIncludeDeviceIdentity = true
		}

		const encryptionPromises = (patchedMessages as { recipientJid: string; message: proto.IMessage }[]).map(
			({ recipientJid: jid, message: patchedMessage }: { recipientJid: string; message: proto.IMessage }) =>
				encryptPatchedMessageForRecipient({
					jid,
					patchedMessage,
					dsmMessage,
					meId,
					meLid,
					meLidUser,
					extraAttrs,
					onPkmsg
				})
		)

		const nodes = (await Promise.all(encryptionPromises)).filter(node => node !== null) as BinaryNode[]

		if (recipientJids.length > 0 && nodes.length === 0) {
			recordMessageFailure('send', 'encryption_failed')
			throw new Boom('All encryptions failed', { statusCode: 500 })
		}

		return { nodes, shouldIncludeDeviceIdentity }
	}

	// Interactive message detection and binary node injection

	/**
	 * Detects the type of interactive message and returns the appropriate binary node tag
	 * Returns 'native_flow' for modern nativeFlowMessage format (recommended)
	 * Returns legacy types for older button formats
	 */
	const getButtonType = (message: proto.IMessage): string | undefined => {
		// Check direct message types (legacy formats)
		if (message.buttonsMessage) {
			return 'buttons'
		} else if (message.templateMessage) {
			return 'template'
		} else if (message.listMessage) {
			// All listMessages (SINGLE_SELECT and PRODUCT_LIST) need biz > list node
			return 'list'
		} else if (message.buttonsResponseMessage) {
			return 'buttons_response'
		} else if (message.listResponseMessage) {
			return 'list_response'
		} else if (message.templateButtonReplyMessage) {
			return 'template_reply'
		} else if (message.interactiveMessage) {
			// Check if it has nativeFlowMessage (modern format)
			if (message.interactiveMessage.nativeFlowMessage) {
				return 'native_flow'
			}

			// Check if it's a carousel with nativeFlowMessage buttons in cards
			if (message.interactiveMessage.carouselMessage?.cards?.length) {
				const hasNativeFlowButtons = message.interactiveMessage.carouselMessage.cards.some(
					(card: proto.Message.IInteractiveMessage) => card?.nativeFlowMessage?.buttons?.length
				)
				if (hasNativeFlowButtons) {
					return 'native_flow'
				}
			}

			// Check if it's a collection/product carousel
			if (message.interactiveMessage.carouselMessage?.cards?.length) {
				const hasCollectionCards = message.interactiveMessage.carouselMessage.cards.some(
					(card: any) => card?.collectionMessage
				)
				if (hasCollectionCards) {
					return 'native_flow'
				}
			}

			return 'interactive'
		}

		// Check inside viewOnceMessage/viewOnceMessageV2 wrapper (modern nativeFlowMessage format)
		// V2 is the recommended format for interactive messages (carousel, buttons)
		const innerMessage = message.viewOnceMessage?.message || message.viewOnceMessageV2?.message
		if (innerMessage) {
			if (innerMessage.buttonsMessage) {
				return 'buttons'
			} else if (innerMessage.templateMessage) {
				return 'template'
			} else if (innerMessage.listMessage) {
				// All listMessages (SINGLE_SELECT and PRODUCT_LIST) need biz > list node
				return 'list'
			} else if (innerMessage.buttonsResponseMessage) {
				return 'buttons_response'
			} else if (innerMessage.listResponseMessage) {
				return 'list_response'
			} else if (innerMessage.templateButtonReplyMessage) {
				return 'template_reply'
			} else if (innerMessage.interactiveMessage) {
				// Check if it has nativeFlowMessage (modern format)
				if (innerMessage.interactiveMessage.nativeFlowMessage) {
					return 'native_flow'
				}

				// Check if it's a carousel with nativeFlowMessage buttons in cards
				if (innerMessage.interactiveMessage.carouselMessage?.cards?.length) {
					const hasNativeFlowButtons = innerMessage.interactiveMessage.carouselMessage.cards.some(
						(card: any) => card?.nativeFlowMessage?.buttons?.length
					)
					if (hasNativeFlowButtons) {
						return 'native_flow'
					}
				}

				// Check if it's a collection/product carousel
				if (innerMessage.interactiveMessage.carouselMessage?.cards?.length) {
					const hasCollectionCards = innerMessage.interactiveMessage.carouselMessage.cards.some(
						(card: any) => card?.collectionMessage
					)
					if (hasCollectionCards) {
						return 'native_flow'
					}
				}

				return 'interactive'
			}
		}

		return undefined
	}

	/**
	 * Returns the attributes for the interactive binary node based on message type
	 * For native_flow: returns { v: '4', name: '' } or special attributes for payment flows
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const _getButtonArgs = (message: proto.IMessage): BinaryNodeAttributes => {
		const buttonType = getButtonType(message)

		// For native_flow messages, check for special button types that need specific attributes
		if (buttonType === 'native_flow') {
			const interactiveMsg =
				message.interactiveMessage ||
				message.viewOnceMessage?.message?.interactiveMessage ||
				message.viewOnceMessageV2?.message?.interactiveMessage

			if (interactiveMsg?.nativeFlowMessage?.buttons?.[0]) {
				const firstButtonName = interactiveMsg.nativeFlowMessage.buttons[0].name

				// Special button types that require specific attributes
				// Based on official WhatsApp client traffic
				if (firstButtonName === 'review_and_pay' || firstButtonName === 'payment_info') {
					return { v: '4', name: 'payment_info' }
				} else if (firstButtonName === 'mpm') {
					return { v: '4', name: 'mpm' }
				} else if (firstButtonName === 'review_order') {
					return { v: '4', name: 'order_details' }
				}
			}

			// Default native_flow attributes
			return { v: '4', name: '' }
		}

		// For other button types, return empty attributes
		return {}
	}

	/**
	 * Checks if the message is a carousel (media carousel or product carousel)
	 * Carousels should NOT have the bot node injected as they are not bot messages
	 */
	const isCarouselMessage = (message: proto.IMessage): boolean => {
		const interactiveMsg =
			message.interactiveMessage ||
			message.viewOnceMessage?.message?.interactiveMessage ||
			message.viewOnceMessageV2?.message?.interactiveMessage

		if (interactiveMsg?.carouselMessage?.cards?.length) {
			return true
		}

		return false
	}

	/**
	 * Checks if the message is a catalog/product message (catalog_message, single_product)
	 * These messages may need different biz node handling or no biz node at all
	 */
	const isCatalogMessage = (message: proto.IMessage): boolean => {
		const interactiveMsg =
			message.interactiveMessage ||
			message.viewOnceMessage?.message?.interactiveMessage ||
			message.viewOnceMessageV2?.message?.interactiveMessage

		const nativeFlow = interactiveMsg?.nativeFlowMessage
		if (nativeFlow?.buttons?.length) {
			// Check if any button is a catalog-type button
			return nativeFlow.buttons.some(
				(btn: any) => btn?.name === 'catalog_message' || btn?.name === 'single_product' || btn?.name === 'product_list'
			)
		}

		return false
	}

	/**
	 * Checks if the nativeFlowMessage is a list (single_select button)
	 * Lists need type='list' in the biz node instead of type='native_flow'
	 */
	const isListNativeFlow = (message: proto.IMessage): boolean => {
		const interactiveMsg =
			message.interactiveMessage ||
			message.viewOnceMessage?.message?.interactiveMessage ||
			message.viewOnceMessageV2?.message?.interactiveMessage

		const nativeFlow = interactiveMsg?.nativeFlowMessage
		if (nativeFlow?.buttons?.length) {
			// Check if any button is a list-type button (single_select or multi_select)
			return nativeFlow.buttons.some((btn: any) => btn?.name === 'single_select' || btn?.name === 'multi_select')
		}

		return false
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
		const meId = authState.creds.me?.id
		if (!meId) throw new Boom('Not authenticated', { statusCode: 401 })
		const meLid = authState.creds.me?.lid
		const isRetryResend = Boolean(participant?.jid)
		let shouldIncludeDeviceIdentity = isRetryResend
		const statusJid = 'status@broadcast'

		const jidDecoded = jidDecode(jid)
		if (!jidDecoded) throw new Boom('Invalid JID')
		const { user, server } = jidDecoded
		const isGroup = server === 'g.us'
		const isStatus = jid === statusJid
		const isLid = server === 'lid'
		const isNewsletter = server === 'newsletter'
		const isGroupOrStatus = isGroup || isStatus
		const finalJid = jid

		msgId = msgId || generateMessageIDV2(meId)
		useUserDevicesCache = useUserDevicesCache !== false
		useCachedGroupMetadata = useCachedGroupMetadata !== false && !isStatus

		// Convert nativeFlowMessage with single_select to direct listMessage (legacy format)
		// This is required because WhatsApp expects listMessage format with biz > list node
		// The viewOnceMessage > interactiveMessage > nativeFlowMessage wrapper causes error 479
		// Reference: direct listMessage works on phone + web
		const innerMsg = message.viewOnceMessage?.message
		const nativeFlow = innerMsg?.interactiveMessage?.nativeFlowMessage
		if (nativeFlow?.buttons?.length) {
			const singleSelectBtn = nativeFlow.buttons.find((btn: any) => btn?.name === 'single_select')
			if (singleSelectBtn?.buttonParamsJson) {
				try {
					const params = JSON.parse(singleSelectBtn.buttonParamsJson)
					const sections = params.sections?.map((section: any) => ({
						title: section.title,
						rows: section.rows?.map((row: any) => ({
							rowId: row.id || row.rowId,
							title: row.title,
							description: row.description || ''
						}))
					}))

					if (sections?.length) {
						// Build direct listMessage (legacy format that works)
						const listMessage = proto.Message.ListMessage.fromObject({
							title: innerMsg?.interactiveMessage?.header?.title || '',
							description: innerMsg?.interactiveMessage?.body?.text || '',
							buttonText: params.title || 'Menu',
							footerText: innerMsg?.interactiveMessage?.footer?.text || '',
							listType: proto.Message.ListMessage.ListType.SINGLE_SELECT,
							sections
						})

						// Mutate message in-place: remove viewOnceMessage, add listMessage
						delete message.viewOnceMessage
						message.listMessage = listMessage
						// Keep messageContextInfo if it was nested
						// eslint-disable-next-line max-depth
						if (!message.messageContextInfo && innerMsg?.messageContextInfo) {
							message.messageContextInfo = innerMsg.messageContextInfo
						}

						logger.info(
							{ msgId, sectionsCount: sections.length, buttonText: params.title },
							'[LIST CONVERT] Converted nativeFlowMessage(single_select) to direct listMessage format'
						)
					}
				} catch (err) {
					logger.warn(
						{ msgId, error: (err as Error).message },
						'[LIST CONVERT] Failed to convert nativeFlowMessage to listMessage, sending as-is'
					)
				}
			}
		}

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

			const participantDecoded = jidDecode(participant.jid)
			if (!participantDecoded) throw new Boom('Invalid participant JID')
			const { user, device } = participantDecoded
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
						// Send DSM to ALL own companion devices including carousel
						// Error 479 on companion devices is non-fatal
						meRecipients.push(jid)
					} else {
						otherRecipients.push(jid)
					}

					allRecipients.push(jid)
				}

				const isCarouselFanout = isCarouselMessage(message)
				const effectiveMeRecipients = isCarouselFanout
					? await canonicalizeCarouselRecipients(meRecipients)
					: meRecipients
				const effectiveOtherRecipients = isCarouselFanout
					? await canonicalizeCarouselRecipients(otherRecipients)
					: otherRecipients
				const effectiveAllRecipients = [...effectiveMeRecipients, ...effectiveOtherRecipients]

				await assertSessions(effectiveAllRecipients)

				const [
					{ nodes: meNodes, shouldIncludeDeviceIdentity: s1 },
					{ nodes: otherNodes, shouldIncludeDeviceIdentity: s2 }
				] = await Promise.all([
					// For own devices: use DSM (deviceSentMessage) wrapper
					createParticipantNodes(effectiveMeRecipients, meMsg || message, extraAttrs),
					createParticipantNodes(effectiveOtherRecipients, message, extraAttrs)
				])
				participants.push(...meNodes)
				participants.push(...otherNodes)

				if (effectiveMeRecipients.length > 0 || effectiveOtherRecipients.length > 0) {
					extraAttrs['phash'] = generateParticipantHashV2(effectiveAllRecipients)
				}

				shouldIncludeDeviceIdentity = shouldIncludeDeviceIdentity || s1 || s2
			}

			if (isRetryResend) {
				if (!participant) throw new Boom('Missing participant for retry resend')
				// Only check for regular LID users, NOT hosted LID users
				// Hosted LID users should use meId for comparison, not meLid
				const isParticipantLid = isLidUser(participant.jid)
				const isMe = areJidsSameUser(participant.jid, isParticipantLid ? meLid : meId)

				// Send DSM for all message types including carousel
				const usesDSM = isMe
				const encodedMessageToSend = usesDSM
					? encodeWAMessage({
							deviceSentMessage: {
								destinationJid,
								message
							}
						})
					: encodeWAMessage(message)

				const { type, ciphertext: encryptedContent } = await signalRepository.encryptMessage({
					data: encodedMessageToSend,
					jid: participant.jid
				})

				binaryNodeContent.push({
					tag: 'enc',
					attrs: {
						v: '2',
						type,
						count: participant.count.toString()
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

			// Inject 'biz' node for interactive messages
			const buttonType = getButtonType(message)
			const isCatalog = isCatalogMessage(message)
			const isCarousel = isCarouselMessage(message)

			// Collect biz/bot nodes to append AFTER device-identity and tctoken
			// Stanza order: participants → device-identity → tctoken → biz (when applicable)
			// CDP capture confirms Pastorini INCLUDES biz node for carousel (native_flow v=9, name=mixed)
			const deferredNodes: BinaryNode[] = []

			// Inject biz node for interactive messages (including carousel — CDP evidence from Pastorini)
			if ((buttonType || isCarousel) && enableInteractiveMessages) {
				const startTime = Date.now()
				// When entering via isCarousel, buttonType may be undefined — default to 'native_flow'
				const effectiveButtonType = buttonType || 'native_flow'

				// Debug: Log message structure to diagnose list detection
				const interactiveMsg =
					message.interactiveMessage ||
					message.viewOnceMessage?.message?.interactiveMessage ||
					message.viewOnceMessageV2?.message?.interactiveMessage
				const listMsg =
					message.listMessage ||
					message.viewOnceMessage?.message?.listMessage ||
					message.viewOnceMessageV2?.message?.listMessage
				// For carousel messages, buttons are inside each card's nativeFlowMessage
				let nativeFlowButtons = interactiveMsg?.nativeFlowMessage?.buttons || []
				if (nativeFlowButtons.length === 0 && interactiveMsg?.carouselMessage?.cards?.length) {
					nativeFlowButtons = interactiveMsg.carouselMessage.cards.flatMap(
						(card: proto.Message.IInteractiveMessage) => card?.nativeFlowMessage?.buttons || []
					)
				}

				const isListDetected = isListNativeFlow(message)

				logger.info(
					{
						msgId,
						buttonType,
						to: destinationJid,
						hasListMessage: !!listMsg,
						hasInteractiveMessage: !!interactiveMsg,
						hasNativeFlow: !!interactiveMsg?.nativeFlowMessage,
						nativeFlowButtonNames: nativeFlowButtons.map((b: any) => b?.name),
						isListDetected,
						isCatalog,
						isCarousel
					},
					'[Interactive] Preparing biz node'
				)

				// Track that we're sending an interactive message
				metrics.interactiveMessagesSent.inc({ type: effectiveButtonType })

				try {
					// Classify button types for native_flow name and bot node decisions
					const CTA_BUTTON_NAMES = new Set(['cta_url', 'cta_copy', 'cta_call'])
					const allButtonNames = nativeFlowButtons.map((b: any) => b?.name).filter(Boolean)
					const hasCTA = allButtonNames.some((name: string) => CTA_BUTTON_NAMES.has(name))
					const hasQuickReply = allButtonNames.some((name: string) => name === 'quick_reply')
					const isCTAOnly = hasCTA && !hasQuickReply

					// For listMessage (legacy format), use direct <list> tag
					// This matches the known working implementation
					if (buttonType === 'list') {
						deferredNodes.push({
							tag: 'biz',
							attrs: {},
							content: [
								{
									tag: 'list',
									attrs: {
										type: 'product_list',
										v: '2'
									}
								}
							]
						})
						logger.info({ msgId, to: destinationJid }, '[BIZ NODE] Injected biz > list (product_list, v=2)')
					} else {
						const SPECIAL_FLOW_NAMES: Record<string, string> = {
							review_and_pay: 'payment_info',
							payment_info: 'payment_info',
							mpm: 'mpm',
							review_order: 'order_details'
						}
						const firstButtonName = allButtonNames[0] || ''
						const nativeFlowName = SPECIAL_FLOW_NAMES[firstButtonName] || 'mixed'

						logger.info(
							{ msgId, buttonNames: allButtonNames, hasCTA, hasQuickReply, isCTAOnly, nativeFlowName },
							'[BIZ NODE] Injected biz > interactive(native_flow, v=1) > native_flow(v=9, name=' + nativeFlowName + ')'
						)

						const interactiveType = 'native_flow'
						const bizContent: BinaryNode[] = [
							{
								tag: 'interactive',
								attrs: {
									type: interactiveType,
									v: '1'
								},
								content: [
									{
										tag: interactiveType,
										attrs: {
											v: '9',
											name: nativeFlowName
										}
									}
								]
							}
						]

						// CDP capture shows Pastorini includes quality_control inside biz for carousel
						if (isCarousel) {
							const decisionId = randomBytes(20).toString('hex')
							bizContent.push({
								tag: 'quality_control',
								attrs: {
									decision_id: decisionId
								},
								content: [
									{
										tag: 'decision_source',
										attrs: {
											value: 'df'
										}
									}
								]
							})
							logger.info({ msgId, decisionId }, '[BIZ NODE] Added quality_control for carousel')
						}

						deferredNodes.push({
							tag: 'biz',
							attrs: {},
							content: bizContent
						})
					}

					// Bot node — skip for native_flow buttons (breaks Web rendering)
					const isNativeFlowButtons = buttonType === 'native_flow'

					const isPrivateUserChat =
						(isPnUser(destinationJid) || isLidUser(destinationJid) || destinationJid?.endsWith('@c.us')) &&
						!isJidBot(destinationJid)

					if (isPrivateUserChat && !isCarousel && !isCatalog && buttonType !== 'list' && !isNativeFlowButtons) {
						deferredNodes.push({
							tag: 'bot',
							attrs: { biz_bot: '1' }
						})
						logger.info({ msgId, to: destinationJid }, '[BOT NODE] Added bot node (biz_bot=1)')
					} else if (isNativeFlowButtons) {
						logger.debug({ msgId, to: destinationJid }, '[BOT NODE] Skipped — native_flow (Web compatibility)')
					} else if (isCarousel) {
						logger.debug({ msgId, to: destinationJid }, '[BOT NODE] Skipped — carousel message')
					} else if (isCatalog) {
						logger.debug({ msgId, to: destinationJid }, '[BOT NODE] Skipped — catalog message')
					}

					// Track success and latency after message is sent
					metrics.interactiveMessagesSuccess.inc({ type: effectiveButtonType })
					metrics.interactiveMessagesLatency.observe({ type: effectiveButtonType }, Date.now() - startTime)
				} catch (error) {
					logger.error({ error, msgId, buttonType: effectiveButtonType }, '[BIZ NODE] Failed to inject biz node')
					metrics.interactiveMessagesFailures.inc({ type: effectiveButtonType, reason: 'injection_failed' })
				}
			} else if (buttonType && !enableInteractiveMessages) {
				logger.warn(
					{ msgId, buttonType },
					'[Interactive] Message detected but feature disabled (enableInteractiveMessages=false)'
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

			// Always include device-identity for carousel (Pastorini stanza always has it)
			if (shouldIncludeDeviceIdentity || isCarousel) {
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

			// tctoken lifecycle: fetch, validate expiry, proactive re-fetch if missing/expired
			// WA Web never attaches tctoken to peer (AppStateSync) messages — server
			const isPeerMessage = additionalAttributes?.['category'] === 'peer'
			const is1on1Send = !isGroup && !isRetryResend && !isStatus && !isNewsletter && !isPeerMessage

			// Resolve destination to LID for tctoken storage — matches Signal session key pattern
			const tcTokenJid = is1on1Send ? await resolveTcTokenJid(destinationJid, getLIDForPN) : destinationJid
			const contactTcTokenData = is1on1Send ? await authState.keys.get('tctoken', [tcTokenJid]) : {}
			const existingTokenEntry = contactTcTokenData[tcTokenJid]
			let tcTokenBuffer = existingTokenEntry?.token

			// Treat expired tokens the same as missing — re-fetch from server
			if (tcTokenBuffer?.length && isTcTokenExpired(existingTokenEntry?.timestamp)) {
				logTcToken('expired', { jid: destinationJid, timestamp: existingTokenEntry?.timestamp })
				tcTokenBuffer = undefined
				// Opportunistic cleanup: remove expired token from store
				try {
					await authState.keys.set({ tctoken: { [tcTokenJid]: null } })
				} catch {
					/* ignore cleanup errors */
				}
			}

			// If tctoken is missing for a 1:1 send, fetch it
			// CDP capture confirms Pastorini stanza includes tctoken for carousel
			if (!tcTokenBuffer?.length && is1on1Send && !tcTokenFetchingJids.has(tcTokenJid)) {
				tcTokenFetchingJids.add(tcTokenJid)
				logTcToken('fetch', { jid: destinationJid })

				if (isCarousel) {
					// BLOCKING fetch for carousel — tctoken is required (Pastorini stanza has it)
					try {
						const fetchResult = await getPrivacyTokens([destinationJid])

						// Direct extraction from IQ result — bypass store/read key mismatch
						const tokensNode = getBinaryNodeChild(fetchResult, 'tokens')
						if (tokensNode) {
							const tokenNodes = getBinaryNodeChildren(tokensNode, 'token')
							for (const tokenNode of tokenNodes) {
								if (tokenNode.attrs.type === 'trusted_contact' && tokenNode.content instanceof Uint8Array) {
									tcTokenBuffer = Buffer.from(tokenNode.content)
									logger.info(
										{
											jid: destinationJid,
											tokenLen: tcTokenBuffer.length,
											tokenJid: tokenNode.attrs.jid,
											timestamp: tokenNode.attrs.t
										},
										'[CAROUSEL] tctoken extracted directly from IQ result'
									)
									break
								}
							}
						}

						if (!tcTokenBuffer?.length) {
							// Debug: dump the IQ result structure
							const childTags = Array.isArray(fetchResult.content)
								? (fetchResult.content as BinaryNode[]).map(n => `${n.tag}(${JSON.stringify(n.attrs)})`)
								: []
							logger.warn(
								{ jid: destinationJid, resultTag: fetchResult.tag, resultAttrs: fetchResult.attrs, childTags },
								'[CAROUSEL] tctoken fetch completed but NO valid token in IQ result'
							)
						}

						// Also store for future use
						await storeTcTokensFromIqResult({
							result: fetchResult,
							fallbackJid: destinationJid,
							keys: authState.keys,
							getLIDForPN
						}).catch(() => {})
					} catch (err: any) {
						logger.warn({ jid: destinationJid, err: err?.message }, '[CAROUSEL] Blocking tctoken fetch failed')
					} finally {
						tcTokenFetchingJids.delete(tcTokenJid)
					}
				} else {
					// Fire-and-forget for non-carousel
					getPrivacyTokens([destinationJid])
						.then(async fetchResult => {
							await storeTcTokensFromIqResult({
								result: fetchResult,
								fallbackJid: destinationJid,
								keys: authState.keys,
								getLIDForPN
							})
						})
						.catch(err => {
							logger.debug({ jid: destinationJid, err: err?.message }, 'fire-and-forget tctoken fetch failed')
						})
						.finally(() => {
							tcTokenFetchingJids.delete(tcTokenJid)
						})
				}
			}

			if (tcTokenBuffer?.length) {
				;(stanza.content as BinaryNode[]).push({
					tag: 'tctoken',
					attrs: {},
					content: tcTokenBuffer
				})
				logTcToken('attached', { jid: destinationJid })
			}

			if (additionalNodes && additionalNodes.length > 0) {
				;(stanza.content as BinaryNode[]).push(...additionalNodes)
			}

			// Append deferred biz/bot nodes LAST (after device-identity, tctoken)
			// Stanza order: participants → device-identity → tctoken → biz
			if (deferredNodes.length > 0) {
				;(stanza.content as BinaryNode[]).push(...deferredNodes)
			}

			// Log stanza structure for interactive messages
			if (buttonType || isCarousel) {
				const contentTags = Array.isArray(stanza.content) ? stanza.content.map((n: BinaryNode) => n.tag) : []
				logger.info({ msgId, to: destinationJid, contentTags }, '[STANZA] Content tags: ' + JSON.stringify(contentTags))
			}

			logger.debug({ msgId }, `sending message to ${participants.length} devices`)

			// ======= PROTOBUF ROUNDTRIP TEST: Verify encoding preserves carousel =======
			if (isCarousel) {
				try {
					const encoded = proto.Message.encode(message).finish()
					const decoded = proto.Message.decode(encoded)
					const decodedInteractive = decoded.interactiveMessage || decoded.viewOnceMessage?.message?.interactiveMessage
					const cardsCount = decodedInteractive?.carouselMessage?.cards?.length || 0
					const card0 = decodedInteractive?.carouselMessage?.cards?.[0]
					const card0Header = card0?.header

					logger.info(
						{
							msgId,
							encodedSize: encoded.length,
							messageKeys: Object.keys(message),
							hasInteractive: !!message.interactiveMessage,
							hasViewOnce: !!message.viewOnceMessage,
							hasCarouselAfterDecode: !!decodedInteractive?.carouselMessage,
							cardsCount,
							card0Title: card0Header?.title,
							card0HasImage: !!card0Header?.imageMessage,
							card0Buttons: card0?.nativeFlowMessage?.buttons?.length || 0,
							messageVersion: decodedInteractive?.carouselMessage?.messageVersion
						},
						'[ROUNDTRIP] Protobuf encode→decode verification'
					)
				} catch (err) {
					logger.error({ msgId, err: (err as Error).message }, '[ROUNDTRIP] Failed to verify protobuf encoding')
				}
			}

			// ======= PROTOCOL INTERCEPTOR: Dump complete stanza for debugging =======
			if (buttonType || isCarousel) {
				const dumpBinaryNode = (node: BinaryNode, indent = 0): string => {
					if (!node) return ''
					const pad = '  '.repeat(indent)
					const tag = node.tag || '?'
					const filteredAttrs = ([, v]: [string, unknown]) => v !== undefined && v !== null
					const attrEntries = node.attrs ? Object.entries(node.attrs).filter(filteredAttrs) : []
					const attrStr = attrEntries.length > 0 ? ' ' + attrEntries.map(([k, v]) => `${k}="${v}"`).join(' ') : ''

					if (!node.content) return `${pad}<${tag}${attrStr}/>`

					if (Buffer.isBuffer(node.content) || node.content instanceof Uint8Array) {
						return `${pad}<${tag}${attrStr}>[binary ${node.content.length} bytes]</${tag}>`
					}

					if (Array.isArray(node.content)) {
						const children = node.content.map((c: BinaryNode) => dumpBinaryNode(c, indent + 1)).join('\n')
						return `${pad}<${tag}${attrStr}>\n${children}\n${pad}</${tag}>`
					}

					return `${pad}<${tag}${attrStr}>${String(node.content).slice(0, 100)}</${tag}>`
				}

				logger.debug(
					{
						msgId,
						to: destinationJid,
						buttonType: buttonType || 'carousel',
						stanzaXML: '\n' + dumpBinaryNode(stanza)
					},
					'[PROTOCOL-DUMP] Stanza structure before send'
				)
			}
			// ======= END PROTOCOL INTERCEPTOR =======

			await sendNode(stanza)

			// Fire-and-forget: issue our token to the contact (like WA Web's sendTcToken).
			// Gated only by shouldSendNewTcToken — removed tcTokenBuffer?.length guard so
			// issuance fires even when we don't yet hold a token (bucket boundary crossed).
			// IMPORTANT: must run AFTER sendNode — issuing before the message causes error 463.
			if (is1on1Send && shouldSendNewTcToken(existingTokenEntry?.senderTimestamp)) {
				const issueTimestamp = unixTimestampSeconds()
				logTcToken('reissue', { jid: destinationJid })
				getPrivacyTokens([destinationJid], issueTimestamp)
					.then(async result => {
						// Store any tokens received in the IQ response.
						// onNewJidStored not passed — pruning index lives in messages-recv (higher layer).
						await storeTcTokensFromIqResult({
							result,
							fallbackJid: tcTokenJid,
							keys: authState.keys,
							getLIDForPN
						})

						// Persist senderTimestamp unconditionally — WA Web stores it in the chat table
						// regardless of whether a token exists. Spread preserves token+timestamp if present.
						// WABA Android: INSERT INTO wa_trusted_contacts_send (jid, sent_tc_token_timestamp, real_issue_timestamp)
						// VALUES (?, ?, 0) — realIssueTimestamp=0 means issued but not yet confirmed by server
						const currentData = await authState.keys.get('tctoken', [tcTokenJid])
						const currentEntry = currentData[tcTokenJid]
						await authState.keys.set({
							tctoken: {
								[tcTokenJid]: {
									...currentEntry,
									token: currentEntry?.token ?? Buffer.alloc(0),
									senderTimestamp: issueTimestamp,
									realIssueTimestamp: 0
								}
							}
						})

						logTcToken('reissue_ok', { jid: destinationJid })
					})
					.catch(err => {
						logTcToken('reissue_fail', { jid: destinationJid, error: err?.message })
					})
			}

			// Log with [BAILEYS] prefix
			logMessageSent(msgId, destinationJid)

			// Record message sent metric
			const msgType = message.conversation
				? 'text'
				: message.imageMessage
					? 'image'
					: message.videoMessage
						? 'video'
						: message.audioMessage
							? 'audio'
							: message.documentMessage
								? 'document'
								: message.stickerMessage
									? 'sticker'
									: message.stickerPackMessage
										? 'sticker_pack'
										: message.reactionMessage
											? 'reaction'
											: 'other'
			recordMessageSent(msgType)

			// Add message to retry cache if enabled
			if (messageRetryManager && !participant) {
				messageRetryManager.addRecentMessage(jidNormalizedUser(destinationJid), msgId, message)
			}

			// Track session activity for cleanup (all target JIDs)
			if (sessionActivityTracker) {
				// Record activity for destination JID
				sessionActivityTracker.recordActivity(destinationJid)

				// For groups, also record activity for all participants who received the message
				if (isGroup || isStatus) {
					for (const device of devices) {
						sessionActivityTracker.recordActivity(device.jid)
					}
				}
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

	const getPrivacyTokens = async (jids: string[], timestamp?: number) => {
		const t = (timestamp ?? unixTimestampSeconds()).toString()
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
			const mediaKey = content.mediaKey
			if (!mediaKey) {
				throw new Boom('Missing media key for update', { statusCode: 400 })
			}

			const meId = authState.creds.me!.id
			const node = encryptMediaRetryRequest(message.key, mediaKey, meId)

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
								const media = decryptMediaRetryData(result.media!, mediaKey, result.key.id!)
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

			const { medias, delay: delayConfig = 'adaptive', retryCount = 3, continueOnFailure = true } = album

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
			const albumRootMsg = await generateWAMessage(
				jid,
				{
					album: { medias, delay: delayConfig, retryCount, continueOnFailure }
				},
				{
					logger,
					userJid,
					getUrlInfo: text =>
						getUrlInfo(text, {
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
				}
			)

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
					let mutexKey = albumRootMsg.key.remoteJid
					if (!mutexKey) {
						logger.warn(
							{ msgId: albumRootMsg.key.id },
							'Missing remoteJid in albumRootMsg, using msg.key.id as fallback'
						)
						mutexKey = albumRootMsg.key.id || 'unknown'
					}

					await messageMutex.mutex(mutexKey, () => upsertMessage(albumRootMsg, 'append'))
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
				const positionMultiplier = 1 + index * 0.1

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
			const sendMediaWithRetry = async (media: AlbumMediaItem, index: number): Promise<AlbumMediaResult> => {
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
							getUrlInfo: text =>
								getUrlInfo(text, {
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
						if (!mediaMsg.message) {
							throw new Boom('Missing message content for album media item')
						}

						if (!mediaMsg.message.messageContextInfo) {
							mediaMsg.message.messageContextInfo = {}
						}

						mediaMsg.message.messageContextInfo.messageAssociation = {
							associationType: proto.MessageAssociation.AssociationType.MEDIA_ALBUM,
							parentMessageKey: albumKey
						}

						// Relay the message
						await relayMessage(jid, mediaMsg.message, {
							messageId: mediaMsg.key.id!,
							useCachedGroupMetadata: options.useCachedGroupMetadata
						})

						// Emit own event if configured
						if (config.emitOwnEvents) {
							process.nextTick(async () => {
								let mutexKey = mediaMsg.key.remoteJid
								if (!mutexKey) {
									logger.warn({ msgId: mediaMsg.key.id }, 'Missing remoteJid in mediaMsg, using msg.key.id as fallback')
									mutexKey = mediaMsg.key.id || 'unknown'
								}

								await messageMutex.mutex(mutexKey, () => upsertMessage(mediaMsg, 'append'))
							})
						}

						logger.debug({ index, msgId: mediaMsg.key.id, attempts }, 'Album media item sent successfully')

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
				logger.error({ index, attempts, error: lastError?.message }, 'Album media item failed after all retries')

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
						let mutexKey = fullMsg.key.remoteJid
						if (!mutexKey) {
							logger.warn({ msgId: fullMsg.key.id }, 'Missing remoteJid in fullMsg, using msg.key.id as fallback')
							mutexKey = fullMsg.key.id || 'unknown'
						}

						await messageMutex.mutex(mutexKey, () => upsertMessage(fullMsg, 'append'))
					})
				}

				return fullMsg
			}
		}
	}
}
