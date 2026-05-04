import NodeCache from '@cacheable/node-cache'
import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto/index.js'
import { DEFAULT_CACHE_TTLS, WA_DEFAULT_EPHEMERAL } from '../Defaults'
import type {
	AnyMessageContent,
	CacheStore,
	GroupMetadata,
	MediaConnInfo,
	MessageReceiptType,
	MessageRelayOptions,
	MiscMessageGenerationOptions,
	PossiblyExtendedCacheStore,
	SocketConfig,
	WAMessage,
	WAMessageKey,
	WarmUpGroupParticipantsSummary,
	WarmUpGroupSendSummary
} from '../Types'
import { DisconnectReason } from '../Types'
import type { ILogger } from '../Utils/logger'
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
	MessageRetryManager,
	normalizeMessageContent,
	parseAndInjectE2ESessions,
	delay,
	unixTimestampSeconds
} from '../Utils'
import { emitTelemetry } from '../Utils/instrumentation'
import { getUrlInfo } from '../Utils/link-preview'
import type { KeyedMutex } from '../Utils/make-mutex'
import { makeKeyedMutex } from '../Utils/make-mutex'
import { shareInflightPromise } from '../Utils/share-inflight'
import { getMessageReportingToken, shouldIncludeReportingToken } from '../Utils/reporting-utils'
import {
	buildMergedTcTokenIndexWrite,
	isTcTokenExpired,
	resolveIssuanceJid,
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
	isHostedLidUser,
	isHostedPnUser,
	isJidBot,
	isJidGroup,
	isJidMetaAI,
	isJidNewsletter,
	isLidUser,
	isPnUser,
	jidDecode,
	jidEncode,
	jidNormalizedUser,
	type JidWithDevice,
	PSA_WID,
	S_WHATSAPP_NET
} from '../WABinary'
import { USyncQuery, USyncUser } from '../WAUSync'
import { makeNewsletterSocket } from './newsletter'

const makeSendTimeoutError = () =>
	new Boom('Timed out sending message', {
		statusCode: DisconnectReason.timedOut
	})

const withAbort = async <T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> => {
	if (!signal) {
		return promise
	}

	if (signal.aborted) {
		throw signal.reason ?? makeSendTimeoutError()
	}

	return await new Promise<T>((resolve, reject) => {
		const cleanup = () => signal.removeEventListener('abort', onAbort)
		const onAbort = () => {
			cleanup()
			reject(signal.reason ?? makeSendTimeoutError())
		}

		signal.addEventListener('abort', onAbort, { once: true })
		promise.then(
			value => {
				cleanup()
				resolve(value)
			},
			error => {
				cleanup()
				reject(error)
			}
		)
	})
}

type DeviceWithJid = {
	jid: string
}

/** Wired by makeMessagesSocket: coalesce duplicate warm-ups; mutex serializes vs relay fan-out per group. */
export type GroupParticipantPrepCoordination = {
	keyedMutex: KeyedMutex
	inflightParticipantWarmUps: Map<string, Promise<WarmUpGroupParticipantsSummary>>
}

type WarmUpGroupDeps = {
	cachedGroupMetadata?: (jid: string) => Promise<GroupMetadata | undefined>
	groupMetadata: (jid: string) => Promise<GroupMetadata | undefined>
	getUSyncDevices: (jids: string[], useCache: boolean, ignoreZeroDevices: boolean) => Promise<DeviceWithJid[]>
	assertSessions: (
		jids: string[],
		force?: boolean,
		summary?: { existingCount: number; fetchedCount: number }
	) => Promise<boolean>
	participantPrepCoordination?: GroupParticipantPrepCoordination
}

const participantWarmInflightKey = (groupJid: string, participants: string[]): string =>
	`${groupJid}\x1e${[...participants].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).join('\x1d')}`

export const createPeerSessionsCache = (peerSessionsCache?: CacheStore): CacheStore =>
	(peerSessionsCache ||
		new NodeCache<boolean>({
			stdTTL: DEFAULT_CACHE_TTLS.USER_DEVICES,
			useClones: false
		})) as CacheStore

export const readCacheEntry = async <T>(cache: CacheStore, key: string): Promise<T | undefined> =>
	await cache.get<T>(key)

const readCacheEntries = async <T>(cache: CacheStore, keys: string[]): Promise<Record<string, T | undefined>> => {
	const extendedCache = cache as PossiblyExtendedCacheStore
	if (extendedCache.mget) {
		return extendedCache.mget<T>(keys)
	}

	const entries: Record<string, T | undefined> = {}
	for (const key of keys) {
		entries[key] = await cache.get<T>(key)
	}

	return entries
}

const writeCacheEntries = async <T>(cache: CacheStore, entries: { key: string; value: T }[]) => {
	if (!entries.length) {
		return
	}

	const extendedCache = cache as PossiblyExtendedCacheStore
	if (extendedCache.mset) {
		await extendedCache.mset(entries)
		return
	}

	for (const { key, value } of entries) {
		await cache.set(key, value)
	}
}

export const warmUpGroupParticipants = async (
	groupJid: string,
	participants: string[],
	deps: WarmUpGroupDeps
): Promise<WarmUpGroupParticipantsSummary> => {
	const startedAt = Date.now()
	const coordinator = deps.participantPrepCoordination

	const runInner = async (): Promise<WarmUpGroupParticipantsSummary> => {
		const sessionSummary = { existingCount: 0, fetchedCount: 0 }
		const devices = await deps.getUSyncDevices(participants, true, false)
		await deps.assertSessions(
			devices.map(device => device.jid),
			false,
			sessionSummary
		)

		return {
			groupJid,
			participants: participants.length,
			devices: devices.length,
			sessionsExisting: sessionSummary.existingCount,
			sessionsFetched: sessionSummary.fetchedCount,
			durationMs: Date.now() - startedAt
		}
	}

	if (!coordinator) {
		return runInner()
	}

	return shareInflightPromise(
		coordinator.inflightParticipantWarmUps,
		participantWarmInflightKey(groupJid, participants),
		() => coordinator.keyedMutex.mutex(groupJid, runInner)
	)
}

export const warmUpGroupSend = async (groupJid: string, deps: WarmUpGroupDeps): Promise<WarmUpGroupSendSummary> => {
	const startedAt = Date.now()

	let metadata: GroupMetadata | undefined
	let metadataSource: WarmUpGroupSendSummary['metadataSource'] = 'network'

	if (deps.cachedGroupMetadata) {
		metadata = await deps.cachedGroupMetadata(groupJid)
		if (metadata) {
			metadataSource = 'cache'
		}
	}

	if (!metadata) {
		metadata = await deps.groupMetadata(groupJid)
	}

	if (!metadata) {
		throw new Boom('missing group metadata')
	}

	const participantIds = metadata.participants.map(participant => participant.id)
	const participantSummary = await warmUpGroupParticipants(groupJid, participantIds, deps)

	return {
		groupJid,
		metadataSource,
		participants: participantSummary.participants,
		devices: participantSummary.devices,
		sessionsExisting: participantSummary.sessionsExisting,
		sessionsFetched: participantSummary.sessionsFetched,
		durationMs: Date.now() - startedAt
	}
}

export const createRefreshMediaConn = (query: (node: BinaryNode) => Promise<BinaryNode>, logger: ILogger) => {
	let mediaConn: Promise<MediaConnInfo> | undefined

	return async (forceGet = false) => {
		const currentMedia = await mediaConn
		if (
			currentMedia &&
			!forceGet &&
			new Date().getTime() - currentMedia.fetchDate.getTime() <= currentMedia.ttl * 1000
		) {
			return currentMedia
		}

		const pendingMediaConn = (async () => {
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

		mediaConn = pendingMediaConn

		try {
			return await pendingMediaConn
		} catch (error) {
			// Only clear the cache if this promise is still the active one.
			if (mediaConn === pendingMediaConn) {
				mediaConn = undefined
			}
			throw error
		}
	}
}
export const makeMessagesSocket = (config: SocketConfig) => {
	const {
		logger,
		linkPreviewImageThumbnailWidth,
		generateHighQualityLinkPreview,
		options: httpRequestOptions,
		patchMessageBeforeSending,
		cachedGroupMetadata,
		enableRecentMessageCache,
		maxMsgRetryCount
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
	const getInstanceId = () => authState.creds.me?.id
	const emitSendPathTelemetry = (
		stage: string,
		status: 'start' | 'success' | 'hit' | 'miss' | 'failure',
		counts?: {
			participants?: number
			devices?: number
			sessionsExisting?: number
			sessionsFetched?: number
			cacheHits?: number
			cacheMisses?: number
			cacheSets?: number
			attempts?: number
		},
		details?: Record<string, unknown>
	) => {
		const normalizedDetails = {
			namespace: 'send_path',
			component: 'messages-send',
			schemaVersion: 1,
			...details
		}
		void emitTelemetry(config.telemetry, {
			stage,
			status,
			instanceId: getInstanceId(),
			counts,
			details: normalizedDetails
		})
	}

	const getLIDForPN = signalRepository.lidMapping.getLIDForPN.bind(signalRepository.lidMapping)

	/**
	 * Set of tctoken storage JIDs with a fire-and-forget `issuePrivacyTokens` IQ in flight.
	 * Prevents duplicate IQs from rapid back-to-back sends before `senderTimestamp` persists.
	 * Entries are always removed in `.finally()`, so the set is bounded by concurrency.
	 */
	const inFlightTcTokenIssuance = new Set<string>()

	const userDevicesCache =
		config.userDevicesCache ||
		new NodeCache<JidWithDevice[]>({
			stdTTL: DEFAULT_CACHE_TTLS.USER_DEVICES, // 5 minutes
			useClones: false
		})

	const peerSessionsCache = createPeerSessionsCache(config.peerSessionsCache)

	// Initialize message retry manager if enabled
	const messageRetryManager = enableRecentMessageCache ? new MessageRetryManager(logger, maxMsgRetryCount) : null

	// Prevent race conditions in Signal session encryption by user
	const encryptionMutex = makeKeyedMutex()

	/** Serialized per `@g.us` participant prep (warm-up vs relay fan-out overlap). Status broadcasts untouched. */
	const groupParticipantPrepMutex = makeKeyedMutex()
	const inflightParticipantWarmUps = new Map<string, Promise<WarmUpGroupParticipantsSummary>>()

	const participantPrepCoordination: GroupParticipantPrepCoordination = {
		keyedMutex: groupParticipantPrepMutex,
		inflightParticipantWarmUps
	}

	const refreshMediaConn = createRefreshMediaConn(query, logger)

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

	const summarizeDevicesByUser = (devices: DeviceWithJid[]) => {
		const counts: Record<string, number> = {}
		for (const device of devices) {
			const key = device.user || 'unknown'
			counts[key] = (counts[key] || 0) + 1
		}

		const values = Object.values(counts)
		return {
			uniqueUsersReturned: Object.keys(counts).length,
			maxDevicesPerUser: values.length ? Math.max(...values) : 0,
			minDevicesPerUser: values.length ? Math.min(...values) : 0,
			devicesPerUser: counts
		}
	}

	/** Fetch all the devices we've to send a message to */
	const getUSyncDevices = async (
		jids: string[],
		useCache: boolean,
		ignoreZeroDevices: boolean
	): Promise<DeviceWithJid[]> => {
		const overallStart = Date.now()
		const deviceResults: DeviceWithJid[] = []
		let explicitDeviceBypassCount = 0

		emitSendPathTelemetry(
			'getUSyncDevices.start',
			'start',
			{ participants: jids.length },
			{
				useCache,
				ignoreZeroDevices,
				pid: process.pid,
				uptimeSec: Math.floor(process.uptime())
			}
		)

		if (!useCache) {
			logger.debug('not using cache for devices')
		}

		const toFetch: string[] = []
		const cacheHitUsers: string[] = []
		const cacheMissUsers: string[] = []

		const jidsWithUser = jids
			.map(jid => {
				const decoded = jidDecode(jid)
				const user = decoded?.user
				const device = decoded?.device
				const isExplicitDevice = typeof device === 'number' && device >= 0

				if (isExplicitDevice && user) {
					explicitDeviceBypassCount += 1
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
					cacheHitUsers.push(user!)

					logger.trace({ user }, 'using cache for devices')
				} else {
					toFetch.push(jid)
					cacheMissUsers.push(user!)
				}
			} else {
				toFetch.push(jid)
				cacheMissUsers.push(user!)
			}
		}

		emitSendPathTelemetry(
			'getUSyncDevices.cachePhase',
			cacheMissUsers.length ? 'miss' : 'hit',
			{
				participants: jidsWithUser.length,
				cacheHits: cacheHitUsers.length,
				cacheMisses: cacheMissUsers.length
			},
			{
				explicitDeviceBypassCount,
				cacheHitUsers: cacheHitUsers.slice(0, 20),
				cacheMissUsers: cacheMissUsers.slice(0, 20)
			}
		)

		if (!toFetch.length) {
			const summary = summarizeDevicesByUser(deviceResults)
			emitSendPathTelemetry(
				'getUSyncDevices.complete',
				'success',
				{
					participants: summary.uniqueUsersReturned,
					devices: deviceResults.length,
					cacheHits: cacheHitUsers.length,
					cacheMisses: cacheMissUsers.length
				},
				{ path: 'cache_only', ...summary }
			)
			return deviceResults
		}

		const networkPhaseStart = Date.now()

		const requestedLidUsers = new Set<string>()
		for (const jid of toFetch) {
			if (isLidUser(jid) || isHostedLidUser(jid)) {
				const user = jidDecode(jid)?.user
				if (user) requestedLidUsers.add(user)
			}
		}

		const query = new USyncQuery().withContext('message').withDeviceProtocol().withLIDProtocol()
		for (const jid of toFetch) {
			query.withUser(new USyncUser().withId(jid))
		}

		const usyncQueryStarted = Date.now()
		emitSendPathTelemetry('getUSyncDevices.usyncQuery', 'start', { participants: toFetch.length })
		const result = await sock.executeUSyncQuery(query)
		emitSendPathTelemetry(
			'getUSyncDevices.usyncQuery',
			result ? 'success' : 'miss',
			{ participants: toFetch.length },
			{
				durationMs: Date.now() - usyncQueryStarted,
				resultNodeBytes: result?.telemetry?.resultNodeBytes,
				resultNodeMb: result?.telemetry?.resultNodeMb,
				resultXmlBytes: result?.telemetry?.resultXmlBytes,
				resultXmlMb: result?.telemetry?.resultXmlMb
			}
		)

		if (result) {
			const lidResults = result.list.filter(a => !!a.lid)
			if (lidResults.length > 0) {
				logger.trace('Storing LID maps from device call')
				const lidStoreStarted = Date.now()
				emitSendPathTelemetry('getUSyncDevices.storeLIDMappings', 'start', { participants: lidResults.length })
				await signalRepository.lidMapping.storeLIDPNMappings(lidResults.map(a => ({ lid: a.lid as string, pn: a.id })))
				emitSendPathTelemetry(
					'getUSyncDevices.storeLIDMappings',
					'success',
					{ participants: lidResults.length, cacheSets: lidResults.length },
					{ durationMs: Date.now() - lidStoreStarted }
				)

				try {
					const lids = lidResults.map(a => a.lid as string)
					if (lids.length) {
						const lidAssertStarted = Date.now()
						emitSendPathTelemetry('getUSyncDevices.assertLidSessions', 'start', { participants: lids.length })
						await assertSessions(lids, true)
						emitSendPathTelemetry(
							'getUSyncDevices.assertLidSessions',
							'success',
							{ participants: lids.length },
							{ durationMs: Date.now() - lidAssertStarted }
						)
					}
				} catch (e) {
					emitSendPathTelemetry(
						'getUSyncDevices.assertLidSessions',
						'failure',
						{ participants: lidResults.length },
						{
							error: e instanceof Error ? e.message : String(e)
						}
					)
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

			for (const [user, userDevices] of Object.entries(deviceMap)) {
				const isLidUser = requestedLidUsers.has(user)
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

			const deviceCacheStarted = Date.now()
			if (userDevicesCache.mset) {
				await userDevicesCache.mset(Object.entries(deviceMap).map(([key, value]) => ({ key, value })))
			} else {
				for (const key in deviceMap) {
					if (deviceMap[key]) await userDevicesCache.set(key, deviceMap[key])
				}
			}
			emitSendPathTelemetry(
				'getUSyncDevices.cacheDevices',
				'success',
				{ cacheSets: Object.keys(deviceMap).length },
				{ durationMs: Date.now() - deviceCacheStarted, usedBatch: !!userDevicesCache.mset }
			)

			const userDeviceUpdates: { [userId: string]: string[] } = {}
			for (const [userId, devices] of Object.entries(deviceMap)) {
				if (devices && devices.length > 0) {
					userDeviceUpdates[userId] = devices.map(d => d.device?.toString() || '0')
				}
			}

			if (Object.keys(userDeviceUpdates).length > 0) {
				try {
					const deviceListPersistStarted = Date.now()
					emitSendPathTelemetry('getUSyncDevices.persistDeviceList', 'start', {
						cacheSets: Object.keys(userDeviceUpdates).length
					})
					await authState.keys.set({ 'device-list': userDeviceUpdates })
					emitSendPathTelemetry(
						'getUSyncDevices.persistDeviceList',
						'success',
						{ cacheSets: Object.keys(userDeviceUpdates).length },
						{ durationMs: Date.now() - deviceListPersistStarted }
					)
					logger.debug(
						{ userCount: Object.keys(userDeviceUpdates).length },
						'stored user device lists for bulk migration'
					)
				} catch (error) {
					emitSendPathTelemetry(
						'getUSyncDevices.persistDeviceList',
						'failure',
						{
							cacheSets: Object.keys(userDeviceUpdates).length
						},
						{
							error: error instanceof Error ? error.message : String(error)
						}
					)
					logger.warn({ error }, 'failed to store user device lists')
				}
			}
		}

		const summary = summarizeDevicesByUser(deviceResults)
		emitSendPathTelemetry(
			'getUSyncDevices.complete',
			'success',
			{
				participants: summary.uniqueUsersReturned,
				devices: deviceResults.length,
				cacheHits: cacheHitUsers.length,
				cacheMisses: cacheMissUsers.length
			},
			{
				path: 'network_usync',
				networkPhaseMs: Date.now() - networkPhaseStart,
				usyncFetchUserCount: toFetch.length,
				...summary
			}
		)

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

	const assertSessions = async (
		jids: string[],
		force?: boolean,
		summary?: { existingCount: number; fetchedCount: number }
	) => {
		const startedAt = Date.now()
		let didFetchNewSession = false
		const uniqueJids = [...new Set(jids)] // Deduplicate JIDs
		const jidsRequiringFetch: string[] = []
		let existingCount = 0

		emitSendPathTelemetry('assertSessions.start', 'start', { participants: uniqueJids.length }, { force: !!force })

		logger.debug({ jids }, 'assertSessions call with jids')

		const signalIdsByJid = new Map<string, string>()
		for (const jid of uniqueJids) {
			signalIdsByJid.set(jid, signalRepository.jidToSignalProtocolAddress(jid))
		}

		const cacheStartedAt = Date.now()
		const signalIds = [...new Set(signalIdsByJid.values())]
		const cachedSessions = await readCacheEntries<boolean>(peerSessionsCache, signalIds)
		const cacheMissJids: string[] = []
		const cacheHits = signalIds.filter(signalId => cachedSessions[signalId] !== undefined).length
		emitSendPathTelemetry(
			'assertSessions.cachePhase',
			'success',
			{
				participants: uniqueJids.length,
				cacheHits,
				cacheMisses: signalIds.length - cacheHits
			},
			{ durationMs: Date.now() - cacheStartedAt }
		)

		for (const jid of uniqueJids) {
			const signalId = signalIdsByJid.get(jid)!
			const cachedSession = cachedSessions[signalId]
			if (cachedSession !== undefined) {
				if (cachedSession) existingCount += 1
				if (cachedSession && !force) {
					continue
				}

				jidsRequiringFetch.push(jid)
			} else {
				cacheMissJids.push(jid)
			}
		}

		if (cacheMissJids.length) {
			const validationStartedAt = Date.now()
			const sessionValidations = await signalRepository.validateSessions(cacheMissJids)
			const cacheSets: { key: string; value: boolean }[] = []

			for (const jid of cacheMissJids) {
				const hasSession = !!sessionValidations[jid]?.exists
				if (hasSession) existingCount += 1
				cacheSets.push({ key: signalIdsByJid.get(jid)!, value: hasSession })
				if (hasSession && !force) {
					continue
				}

				jidsRequiringFetch.push(jid)
			}

			await writeCacheEntries(peerSessionsCache, cacheSets)
			emitSendPathTelemetry(
				'assertSessions.validateSessions',
				'success',
				{
					participants: cacheMissJids.length,
					sessionsExisting: cacheSets.filter(entry => entry.value).length,
					cacheSets: cacheSets.length
				},
				{ durationMs: Date.now() - validationStartedAt }
			)
		}

		if (jidsRequiringFetch.length) {
			const lidMappingStarted = Date.now()
			const lidInputJids = jidsRequiringFetch.filter(jid => !!isPnUser(jid) || !!isHostedPnUser(jid))
			emitSendPathTelemetry(
				'assertSessions.lidMapping',
				'start',
				{ participants: lidInputJids.length },
				{
					force: !!force
				}
			)
			const lidMappings = (await signalRepository.lidMapping.getLIDsForPNs(lidInputJids)) || []
			emitSendPathTelemetry(
				'assertSessions.lidMapping',
				'success',
				{ participants: lidInputJids.length, devices: lidMappings.length },
				{
					durationMs: Date.now() - lidMappingStarted,
					force: !!force
				}
			)
			// LID if mapped, otherwise original
			const wireJids = [
				...jidsRequiringFetch.filter(jid => !!isLidUser(jid) || !!isHostedLidUser(jid)),
				...lidMappings.map(a => a.lid)
			]

			logger.debug({ jidsRequiringFetch, wireJids }, 'fetching sessions')
			emitSendPathTelemetry(
				'assertSessions.fetching',
				'start',
				{ participants: jidsRequiringFetch.length },
				{
					wireJids: wireJids.length,
					force: !!force
				}
			)
			const fetchStartedAt = Date.now()
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
			emitSendPathTelemetry(
				'assertSessions.fetchQuery',
				'success',
				{
					participants: jidsRequiringFetch.length
				},
				{ durationMs: Date.now() - fetchStartedAt, wireJids: wireJids.length }
			)
			const injectStartedAt = Date.now()
			emitSendPathTelemetry('assertSessions.injectSessions', 'start', {
				participants: wireJids.length
			})
			await parseAndInjectE2ESessions(result, signalRepository)
			emitSendPathTelemetry(
				'assertSessions.injectSessions',
				'success',
				{
					participants: wireJids.length
				},
				{ durationMs: Date.now() - injectStartedAt }
			)
			didFetchNewSession = true

			// Cache fetched sessions using wire JIDs
			const fetchedCacheStarted = Date.now()
			await writeCacheEntries(
				peerSessionsCache,
				wireJids.map(wireJid => ({
					key: signalRepository.jidToSignalProtocolAddress(wireJid),
					value: true
				}))
			)
			emitSendPathTelemetry(
				'assertSessions.cacheFetchedSessions',
				'success',
				{ cacheSets: wireJids.length },
				{ durationMs: Date.now() - fetchedCacheStarted }
			)
		}

		if (summary) {
			summary.existingCount = existingCount
			summary.fetchedCount = jidsRequiringFetch.length
		}
		emitSendPathTelemetry(
			'assertSessions.complete',
			didFetchNewSession ? 'success' : 'hit',
			{
				participants: uniqueJids.length,
				sessionsExisting: existingCount,
				sessionsFetched: jidsRequiringFetch.length
			},
			{ didFetchNewSession, force: !!force }
		)
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
		const startedAt = Date.now()
		emitSendPathTelemetry(
			'createParticipantNodes.start',
			'start',
			{ participants: recipientJids.length },
			{
				hasDsmMessage: !!dsmMessage,
				hasExtraAttrs: !!extraAttrs && Object.keys(extraAttrs).length > 0
			}
		)
		if (!recipientJids.length) {
			emitSendPathTelemetry(
				'createParticipantNodes.complete',
				'hit',
				{ participants: 0, devices: 0 },
				{ durationMs: Date.now() - startedAt, path: 'empty' }
			)
			return { nodes: [] as BinaryNode[], shouldIncludeDeviceIdentity: false }
		}

		const patchStarted = Date.now()
		const patched = await patchMessageBeforeSending(message, recipientJids)
		emitSendPathTelemetry(
			'createParticipantNodes.patchMessage',
			'success',
			{ participants: recipientJids.length },
			{ durationMs: Date.now() - patchStarted, perRecipientPatch: Array.isArray(patched) }
		)
		const patchedMessages = Array.isArray(patched)
			? patched
			: recipientJids.map(jid => ({ recipientJid: jid, message: patched }))
		const encodeStarted = Date.now()
		const sharedPatchedBytes = Array.isArray(patched) ? undefined : encodeWAMessage(patched)
		const sharedDsmBytes = dsmMessage ? encodeWAMessage(dsmMessage) : undefined
		emitSendPathTelemetry(
			'createParticipantNodes.encodeMessage',
			'success',
			{ participants: recipientJids.length },
			{
				durationMs: Date.now() - encodeStarted,
				sharedPatchedBytes: sharedPatchedBytes?.byteLength,
				sharedDsmBytes: sharedDsmBytes?.byteLength
			}
		)

		let shouldIncludeDeviceIdentity = false
		let encryptionFailures = 0
		let pkmsgCount = 0
		const meId = authState.creds.me!.id
		const meLid = authState.creds.me?.lid
		const meLidUser = meLid ? jidDecode(meLid)?.user : null

		const encryptStarted = Date.now()
		emitSendPathTelemetry('createParticipantNodes.encryptRecipients', 'start', {
			participants: recipientJids.length
		})
		const encryptionPromises = (patchedMessages as any).map(
			async ({ recipientJid: jid, message: patchedMessage }: any) => {
				try {
					if (!jid) return null

					let msgToEncrypt = patchedMessage

					if (dsmMessage) {
						const targetDec = jidDecode(jid)
						const ownPnDec = jidDecode(meId)
						const targetUser = targetDec?.user
						const ownPnUser = ownPnDec?.user
						const ownLidUser = meLidUser

						const isOwnUser =
							targetUser != null &&
							ownPnUser != null &&
							(targetUser === ownPnUser || (ownLidUser && targetUser === ownLidUser))
						const isExactSenderDevice = jid === meId || (meLid && jid === meLid)

						if (isOwnUser && !isExactSenderDevice) {
							msgToEncrypt = dsmMessage
							logger.debug({ jid, targetUser }, 'Using DSM for own device')
						}
					}

					const bytes =
						!Array.isArray(patched) && msgToEncrypt === patched
							? sharedPatchedBytes!
							: !Array.isArray(patched) && sharedDsmBytes && msgToEncrypt === dsmMessage
								? sharedDsmBytes
								: encodeWAMessage(msgToEncrypt)
					const mutexKey = jid

					const node = await encryptionMutex.mutex(mutexKey, async () => {
						const { type, ciphertext } = await signalRepository.encryptMessage({ jid, data: bytes })

						if (type === 'pkmsg') {
							shouldIncludeDeviceIdentity = true
							pkmsgCount += 1
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
					encryptionFailures += 1
					logger.error({ jid, err }, 'Failed to encrypt for recipient')
					return null
				}
			}
		)

		const nodes = (await Promise.all(encryptionPromises)).filter(node => node !== null) as BinaryNode[]

		if (recipientJids.length > 0 && nodes.length === 0) {
			emitSendPathTelemetry(
				'createParticipantNodes.encryptRecipients',
				'failure',
				{ participants: recipientJids.length, devices: 0 },
				{
					durationMs: Date.now() - encryptStarted,
					encryptionFailures,
					pkmsgCount
				}
			)
			throw new Boom('All encryptions failed', { statusCode: 500 })
		}
		emitSendPathTelemetry(
			'createParticipantNodes.encryptRecipients',
			'success',
			{ participants: recipientJids.length, devices: nodes.length },
			{
				durationMs: Date.now() - encryptStarted,
				encryptionFailures,
				pkmsgCount,
				shouldIncludeDeviceIdentity
			}
		)
		emitSendPathTelemetry(
			'createParticipantNodes.complete',
			'success',
			{ participants: recipientJids.length, devices: nodes.length },
			{ durationMs: Date.now() - startedAt, shouldIncludeDeviceIdentity }
		)
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
		const relayStartedAt = Date.now()
		const meId = authState.creds.me!.id
		const meLid = authState.creds.me?.lid
		const isRetryResend = Boolean(participant?.jid)
		let shouldIncludeDeviceIdentity = isRetryResend
		const statusJid = 'status@broadcast'

		const destinationDecoded = jidDecode(jid)
		if (!destinationDecoded) {
			throw new Boom(
				`Invalid destination JID: expected a WhatsApp address containing "@", e.g. "553199...@s.whatsapp.net" or "...@g.us". Got: ${String(jid)}`,
				{ statusCode: 400 }
			)
		}
		const { user, server } = destinationDecoded
		const isGroup = server === 'g.us'
		const isStatus = jid === statusJid
		const isLid = server === 'lid'
		const isNewsletter = server === 'newsletter'
		const isGroupOrStatus = isGroup || isStatus
		const finalJid = jid

		msgId = msgId || generateMessageIDV2(meId)
		useUserDevicesCache = useUserDevicesCache !== false
		useCachedGroupMetadata = useCachedGroupMetadata !== false && !isStatus
		emitSendPathTelemetry(
			'relay.start',
			'start',
			{ participants: statusJidList?.length },
			{
				msgId,
				jid,
				isGroup,
				isStatus,
				isNewsletter,
				isRetryResend,
				useUserDevicesCache,
				useCachedGroupMetadata
			}
		)

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
			if (!participantDecoded) {
				throw new Boom(`Invalid participant JID for relay: ${String(participant.jid)}`, {
					statusCode: 400
				})
			}
			const { user, device } = participantDecoded
			devices.push({
				user,
				device,
				jid: participant.jid
			})
		}

		{
			const mediaType = getMediaType(message)
			if (mediaType) {
				extraAttrs['mediatype'] = mediaType
			}

			if (isNewsletter) {
				const newsletterStarted = Date.now()
				const patched = patchMessageBeforeSending ? await patchMessageBeforeSending(message, []) : message
				const bytes = encodeNewsletterMessage(patched as proto.IMessage)
				emitSendPathTelemetry('relay.newsletter.encode', 'success', undefined, {
					durationMs: Date.now() - newsletterStarted,
					bytes: bytes.byteLength
				})
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
				const sendStarted = Date.now()
				emitSendPathTelemetry('relay.sendNode', 'start', { devices: 0 }, { msgId, route: 'newsletter' })
				await sendNode(stanza)
				emitSendPathTelemetry(
					'relay.sendNode',
					'success',
					{ devices: 0 },
					{ msgId, route: 'newsletter', durationMs: Date.now() - sendStarted }
				)
				emitSendPathTelemetry(
					'relay.complete',
					'success',
					{ devices: 0 },
					{ msgId, route: 'newsletter', durationMs: Date.now() - relayStartedAt }
				)
				return msgId
			}

			const normalizedMessage = normalizeMessageContent(message)
			if (normalizedMessage?.pinInChatMessage || normalizedMessage?.reactionMessage) {
				extraAttrs['decrypt-fail'] = 'hide' // todo: expand for reactions and other types
			}

			if (isGroupOrStatus && !isRetryResend) {
				const metadataLoadStarted = Date.now()
				const [groupData, senderKeyMap] = await Promise.all([
					(async () => {
						const groupMetadataStarted = Date.now()
						emitSendPathTelemetry('relay.group.prep.groupMetadata', 'start', undefined, {
							jid,
							useCachedGroupMetadata
						})
						let groupData = useCachedGroupMetadata && cachedGroupMetadata ? await cachedGroupMetadata(jid) : undefined // todo: should we rely on the cache specially if the cache is outdated and the metadata has new fields?
						let metadataSource: 'cache' | 'network' | 'missing' = groupData ? 'cache' : 'missing'
						if (groupData && Array.isArray(groupData?.participants)) {
							logger.trace({ jid, participants: groupData.participants.length }, 'using cached group metadata')
						} else if (!isStatus) {
							groupData = await groupMetadata(jid) // TODO: start storing group participant list + addr mode in Signal & stop relying on this
							metadataSource = groupData ? 'network' : 'missing'
						}

						emitSendPathTelemetry(
							'relay.group.prep.groupMetadata',
							groupData ? 'success' : 'miss',
							{ participants: groupData?.participants?.length },
							{
								jid,
								source: metadataSource,
								durationMs: Date.now() - groupMetadataStarted,
								addressingMode: groupData?.addressingMode
							}
						)
						return groupData
					})(),
					(async () => {
						if (!participant && !isStatus) {
							const senderKeyStarted = Date.now()
							emitSendPathTelemetry('relay.group.prep.senderKeyMemory', 'start', undefined, { jid })
							// what if sender memory is less accurate than the cached metadata
							// on participant change in group, we should do sender memory manipulation
							const result = await authState.keys.get('sender-key-memory', [jid]) // TODO: check out what if the sender key memory doesn't include the LID stuff now?
							const senderKeyMemory = result[jid] || {}
							emitSendPathTelemetry(
								'relay.group.prep.senderKeyMemory',
								'success',
								{ cacheHits: Object.keys(senderKeyMemory).length },
								{
									jid,
									durationMs: Date.now() - senderKeyStarted,
									entries: Object.keys(senderKeyMemory).length
								}
							)
							return senderKeyMemory
						}

						return {}
					})()
				])
				emitSendPathTelemetry(
					'relay.group.prep.metadataAndSenderKey',
					'success',
					{
						participants: groupData?.participants?.length
					},
					{
						durationMs: Date.now() - metadataLoadStarted,
						isGroup,
						isStatus,
						useCachedGroupMetadata,
						hasGroupData: !!groupData,
						senderKeyMemoryEntries: Object.keys(senderKeyMap || {}).length
					}
				)

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

				const performGroupOrStatusFanOut = async (): Promise<void> => {
					const usyncFanOutStarted = Date.now()
					const additionalDevices = await getUSyncDevices(participantsList, !!useUserDevicesCache, false)
					emitSendPathTelemetry(
						'relay.group.fanOut.getUSyncDevices',
						'success',
						{
							participants: participantsList.length,
							devices: additionalDevices.length
						},
						{ durationMs: Date.now() - usyncFanOutStarted, useUserDevicesCache: !!useUserDevicesCache }
					)
					devices.push(...additionalDevices)

					if (isGroup) {
						additionalAttributes = {
							...additionalAttributes,
							addressing_mode: groupData?.addressingMode || 'lid'
						}
					}

					const patchStarted = Date.now()
					emitSendPathTelemetry('relay.group.fanOut.patchMessage', 'start', {
						participants: participantsList.length,
						devices: devices.length
					})
					const patched = await patchMessageBeforeSending(message)
					if (Array.isArray(patched)) {
						throw new Boom('Per-jid patching is not supported in groups')
					}
					emitSendPathTelemetry(
						'relay.group.fanOut.patchMessage',
						'success',
						{
							participants: participantsList.length,
							devices: devices.length
						},
						{ durationMs: Date.now() - patchStarted }
					)

					const bytes = encodeWAMessage(patched)
					reportingMessage = patched
					const groupAddressingMode = additionalAttributes?.['addressing_mode'] || groupData?.addressingMode || 'lid'
					const groupSenderIdentity = groupAddressingMode === 'lid' && meLid ? meLid : meId
					emitSendPathTelemetry(
						'relay.group.fanOut.addressing',
						'success',
						{
							devices: devices.length
						},
						{ groupAddressingMode, groupSenderIdentity }
					)

					const senderKeyRecipients: string[] = []
					let senderKeyMapChanged = false
					for (const device of devices) {
						const deviceJid = device.jid
						const hasKey = !!senderKeyMap[deviceJid]
						if (
							(!hasKey || !!participant) &&
							!isHostedLidUser(deviceJid) &&
							!isHostedPnUser(deviceJid) &&
							device.device !== 99
						) {
							senderKeyRecipients.push(deviceJid)
							if (!hasKey) {
								senderKeyMapChanged = true
							}
							senderKeyMap[deviceJid] = true
						}
					}
					emitSendPathTelemetry(
						'relay.group.senderKey.selectRecipients',
						senderKeyRecipients.length ? 'miss' : 'hit',
						{
							devices: devices.length,
							participants: senderKeyRecipients.length
						},
						{
							senderKeyMapChanged,
							senderKeyMemoryEntries: Object.keys(senderKeyMap || {}).length
						}
					)

					const encryptStarted = Date.now()
					emitSendPathTelemetry(
						'relay.group.fanOut.encryptGroupMessage',
						'start',
						{
							devices: devices.length
						},
						{ senderKeyRecipients: senderKeyRecipients.length }
					)
					const { ciphertext, senderKeyDistributionMessage } = await signalRepository.encryptGroupMessage({
						group: destinationJid,
						data: bytes,
						meId: groupSenderIdentity,
						createDistributionMessage: senderKeyRecipients.length > 0
					})
					emitSendPathTelemetry(
						'relay.group.fanOut.encryptGroupMessage',
						'success',
						{
							devices: devices.length
						},
						{
							durationMs: Date.now() - encryptStarted,
							senderKeyRecipients: senderKeyRecipients.length
						}
					)

					if (senderKeyRecipients.length) {
						logger.debug({ senderKeyJids: senderKeyRecipients }, 'sending new sender key')
						emitSendPathTelemetry(
							'relay.group.senderKey.distribution',
							'success',
							{
								participants: senderKeyRecipients.length
							},
							{ senderKeyMapChanged }
						)
						if (!senderKeyDistributionMessage) {
							throw new Boom('Missing sender key distribution message for group fanout', { statusCode: 500 })
						}

						const senderKeyMsg: proto.IMessage = {
							senderKeyDistributionMessage: {
								axolotlSenderKeyDistributionMessage: senderKeyDistributionMessage,
								groupId: destinationJid
							}
						}

						const senderKeySessionTargets = senderKeyRecipients
						const senderKeyAssertStarted = Date.now()
						emitSendPathTelemetry('relay.group.senderKey.assertSessions', 'start', {
							participants: senderKeySessionTargets.length
						})
						await assertSessions(senderKeySessionTargets)
						emitSendPathTelemetry(
							'relay.group.senderKey.assertSessions',
							'success',
							{
								participants: senderKeySessionTargets.length
							},
							{ durationMs: Date.now() - senderKeyAssertStarted }
						)

						const senderKeyNodesStarted = Date.now()
						emitSendPathTelemetry('relay.group.senderKey.createParticipantNodes', 'start', {
							participants: senderKeyRecipients.length
						})
						const result = await createParticipantNodes(senderKeyRecipients, senderKeyMsg, extraAttrs)
						emitSendPathTelemetry(
							'relay.group.senderKey.createParticipantNodes',
							'success',
							{
								participants: senderKeyRecipients.length,
								devices: result.nodes.length
							},
							{ durationMs: Date.now() - senderKeyNodesStarted }
						)
						shouldIncludeDeviceIdentity = shouldIncludeDeviceIdentity || result.shouldIncludeDeviceIdentity

						participants.push(...result.nodes)
					}

					binaryNodeContent.push({
						tag: 'enc',
						attrs: { v: '2', type: 'skmsg', ...extraAttrs },
						content: ciphertext
					})

					if (senderKeyMapChanged) {
						const persistStarted = Date.now()
						emitSendPathTelemetry('relay.group.senderKey.memoryPersisted', 'start', {
							cacheSets: 1
						})
						await authState.keys.set({ 'sender-key-memory': { [jid]: senderKeyMap } })
						emitSendPathTelemetry(
							'relay.group.senderKey.memoryPersisted',
							'success',
							{
								cacheSets: 1
							},
							{ durationMs: Date.now() - persistStarted, entries: Object.keys(senderKeyMap).length }
						)
					}
				}

				if (isGroup) {
					const mutexWaitStarted = Date.now()
					emitSendPathTelemetry(
						'relay.group.fanOut.mutex',
						'start',
						{
							participants: participantsList.length
						},
						{ jid }
					)
					try {
						await groupParticipantPrepMutex.mutex(jid, async () => {
							emitSendPathTelemetry(
								'relay.group.fanOut.mutex',
								'hit',
								{
									participants: participantsList.length
								},
								{ jid, waitMs: Date.now() - mutexWaitStarted }
							)
							return performGroupOrStatusFanOut()
						})
						emitSendPathTelemetry(
							'relay.group.fanOut.mutex',
							'success',
							{
								participants: participantsList.length
							},
							{ jid, durationMs: Date.now() - mutexWaitStarted }
						)
					} catch (error) {
						emitSendPathTelemetry(
							'relay.group.fanOut.mutex',
							'failure',
							{
								participants: participantsList.length
							},
							{
								jid,
								durationMs: Date.now() - mutexWaitStarted,
								error: error instanceof Error ? error.message : String(error)
							}
						)
						throw error
					}
				} else {
					await performGroupOrStatusFanOut()
				}
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
					const reportingPatchStarted = Date.now()
					emitSendPathTelemetry('relay.direct.reportingPatch', 'start', { participants: 1 }, { jid })
					const patchedForReporting = await patchMessageBeforeSending(message, [jid])
					reportingMessage = Array.isArray(patchedForReporting)
						? patchedForReporting.find(item => item.recipientJid === jid) || patchedForReporting[0]
						: patchedForReporting
					emitSendPathTelemetry(
						'relay.direct.reportingPatch',
						'success',
						{ participants: 1 },
						{
							durationMs: Date.now() - reportingPatchStarted,
							perRecipientPatch: Array.isArray(patchedForReporting)
						}
					)
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
						const directUsyncStarted = Date.now()
						emitSendPathTelemetry('relay.direct.getUSyncDevices', 'start', { participants: 2 }, { senderIdentity, jid })
						const sessionDevices = await getUSyncDevices([senderIdentity, jid], true, false)
						devices.push(...sessionDevices)
						emitSendPathTelemetry(
							'relay.direct.getUSyncDevices',
							'success',
							{ participants: 2, devices: sessionDevices.length },
							{ durationMs: Date.now() - directUsyncStarted, senderIdentity }
						)

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
				emitSendPathTelemetry(
					'relay.direct.recipients.split',
					'success',
					{
						participants: allRecipients.length,
						devices: devices.length
					},
					{
						meRecipients: meRecipients.length,
						otherRecipients: otherRecipients.length,
						rawDevicesEnumerated: devices.length
					}
				)

				const directAssertStarted = Date.now()
				emitSendPathTelemetry('relay.direct.assertSessions', 'start', {
					participants: allRecipients.length
				})
				await assertSessions(allRecipients)
				emitSendPathTelemetry(
					'relay.direct.assertSessions',
					'success',
					{
						participants: allRecipients.length
					},
					{ durationMs: Date.now() - directAssertStarted }
				)

				const directNodesStarted = Date.now()
				emitSendPathTelemetry('relay.direct.createParticipantNodes', 'start', {
					participants: allRecipients.length
				})
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
				emitSendPathTelemetry(
					'relay.direct.createParticipantNodes',
					'success',
					{
						participants: allRecipients.length,
						devices: meNodes.length + otherNodes.length
					},
					{
						durationMs: Date.now() - directNodesStarted,
						meRecipients: meRecipients.length,
						otherRecipients: otherRecipients.length
					}
				)

				if (meRecipients.length > 0 || otherRecipients.length > 0) {
					extraAttrs['phash'] = generateParticipantHashV2([...meRecipients, ...otherRecipients])
				}

				shouldIncludeDeviceIdentity = shouldIncludeDeviceIdentity || s1 || s2
			}

			if (isRetryResend) {
				const retryEncryptStarted = Date.now()
				emitSendPathTelemetry(
					'relay.retry.encryptParticipant',
					'start',
					{ participants: 1 },
					{
						participant: participant!.jid,
						count: participant!.count
					}
				)
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
				emitSendPathTelemetry(
					'relay.retry.encryptParticipant',
					'success',
					{ participants: 1, devices: 1 },
					{
						durationMs: Date.now() - retryEncryptStarted,
						type,
						isParticipantLid,
						isMe
					}
				)

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

			const stanzaBuildStarted = Date.now()
			emitSendPathTelemetry('relay.stanza.build', 'start', {
				participants: participants.length,
				devices: devices.length
			})
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

			if (
				!isNewsletter &&
				!isRetryResend &&
				reportingMessage?.messageContextInfo?.messageSecret &&
				shouldIncludeReportingToken(reportingMessage)
			) {
				const reportingTokenStarted = Date.now()
				emitSendPathTelemetry('relay.reportingToken', 'start', undefined, { msgId, jid: destinationJid })
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
					emitSendPathTelemetry('relay.reportingToken', reportingNode ? 'success' : 'miss', undefined, {
						msgId,
						jid: destinationJid,
						durationMs: Date.now() - reportingTokenStarted
					})
				} catch (error: any) {
					emitSendPathTelemetry('relay.reportingToken', 'failure', undefined, {
						msgId,
						jid: destinationJid,
						durationMs: Date.now() - reportingTokenStarted,
						error: error instanceof Error ? error.message : String(error)
					})
					logger.warn({ jid, trace: error?.stack }, 'failed to attach reporting token')
				}
			} else {
				emitSendPathTelemetry('relay.reportingToken', 'hit', undefined, {
					msgId,
					jid: destinationJid,
					eligible: false
				})
			}

			// WA Web never attaches tctoken to peer (AppStateSync) messages — server rejects with 479
			const isPeerMessage = additionalAttributes?.['category'] === 'peer'
			const is1on1Send = !isGroup && !isRetryResend && !isStatus && !isNewsletter && !isPeerMessage

			// Resolve destination to LID for tctoken storage — matches Signal session key pattern
			const tcTokenLookupStarted = Date.now()
			const tcTokenJid = is1on1Send ? await resolveTcTokenJid(destinationJid, getLIDForPN) : destinationJid
			const contactTcTokenData = is1on1Send ? await authState.keys.get('tctoken', [tcTokenJid]) : {}
			emitSendPathTelemetry(
				'relay.tctoken.lookup',
				is1on1Send ? 'success' : 'hit',
				{ cacheHits: contactTcTokenData[tcTokenJid]?.token?.length ? 1 : 0 },
				{
					msgId,
					jid: destinationJid,
					tcTokenJid,
					is1on1Send,
					durationMs: Date.now() - tcTokenLookupStarted
				}
			)
			const existingTokenEntry = contactTcTokenData[tcTokenJid]
			let tcTokenBuffer = existingTokenEntry?.token

			// Treat expired tokens the same as missing — clear from cache
			if (tcTokenBuffer?.length && isTcTokenExpired(existingTokenEntry?.timestamp)) {
				const cleanupStarted = Date.now()
				logger.debug({ jid: destinationJid, timestamp: existingTokenEntry?.timestamp }, 'tctoken expired, clearing')
				tcTokenBuffer = undefined
				// Preserve senderTimestamp so the fire-and-forget issuance dedupe survives cleanup.
				const cleared =
					existingTokenEntry?.senderTimestamp !== undefined
						? { token: Buffer.alloc(0), senderTimestamp: existingTokenEntry.senderTimestamp }
						: null
				try {
					await authState.keys.set({ tctoken: { [tcTokenJid]: cleared } })
					emitSendPathTelemetry(
						'relay.tctoken.expiryCleanup',
						'success',
						{ cacheSets: 1 },
						{
							msgId,
							jid: destinationJid,
							tcTokenJid,
							durationMs: Date.now() - cleanupStarted
						}
					)
				} catch (err: any) {
					emitSendPathTelemetry(
						'relay.tctoken.expiryCleanup',
						'failure',
						{ cacheSets: 1 },
						{
							msgId,
							jid: destinationJid,
							tcTokenJid,
							durationMs: Date.now() - cleanupStarted,
							error: err instanceof Error ? err.message : String(err)
						}
					)
					logger.debug({ jid: destinationJid, err: err?.message }, 'failed to persist tctoken expiry cleanup')
				}
			}

			if (tcTokenBuffer?.length && sock.serverProps.privacyTokenOn1to1) {
				;(stanza.content as BinaryNode[]).push({
					tag: 'tctoken',
					attrs: {},
					content: tcTokenBuffer
				})
				emitSendPathTelemetry('relay.tctoken.attach', 'success', undefined, {
					msgId,
					jid: destinationJid,
					tcTokenJid,
					bytes: tcTokenBuffer.byteLength
				})
			} else {
				emitSendPathTelemetry('relay.tctoken.attach', 'hit', undefined, {
					msgId,
					jid: destinationJid,
					tcTokenJid,
					hasToken: !!tcTokenBuffer?.length,
					privacyTokenOn1to1: sock.serverProps.privacyTokenOn1to1
				})
			}

			if (additionalNodes && additionalNodes.length > 0) {
				;(stanza.content as BinaryNode[]).push(...additionalNodes)
			}
			emitSendPathTelemetry(
				'relay.stanza.build',
				'success',
				{
					participants: participants.length,
					devices: devices.length
				},
				{
					msgId,
					durationMs: Date.now() - stanzaBuildStarted,
					contentNodes: Array.isArray(stanza.content) ? stanza.content.length : 0,
					shouldIncludeDeviceIdentity,
					additionalNodes: additionalNodes?.length || 0
				}
			)

			logger.debug({ msgId }, `sending message to ${participants.length} devices`)

			const sendStarted = Date.now()
			emitSendPathTelemetry('relay.sendNode', 'start', { devices: participants.length }, { msgId, route: 'message' })
			await sendNode(stanza)
			emitSendPathTelemetry(
				'relay.sendNode',
				'success',
				{ devices: participants.length },
				{ msgId, route: 'message', durationMs: Date.now() - sendStarted }
			)

			// Fire-and-forget: issue our token to the contact AFTER message send.
			// WA Web skips protocol messages and PSA/bot contacts (TcTokenChatAction: isRegularUser)
			const isProtocolMsg = !!normalizeMessageContent(message)?.protocolMessage
			const isBotOrPSA = destinationJid === PSA_WID || isJidBot(destinationJid) || isJidMetaAI(destinationJid)
			if (
				is1on1Send &&
				!isProtocolMsg &&
				!isBotOrPSA &&
				shouldSendNewTcToken(existingTokenEntry?.senderTimestamp) &&
				!inFlightTcTokenIssuance.has(tcTokenJid)
			) {
				inFlightTcTokenIssuance.add(tcTokenJid)
				const issueTimestamp = unixTimestampSeconds()
				const issuanceStarted = Date.now()
				emitSendPathTelemetry(
					'relay.tctoken.issue.schedule',
					'start',
					{ participants: 1 },
					{
						msgId,
						jid: destinationJid,
						tcTokenJid,
						issueTimestamp
					}
				)
				const getPNForLID = signalRepository.lidMapping.getPNForLID.bind(signalRepository.lidMapping)
				resolveIssuanceJid(destinationJid, sock.serverProps.lidTrustedTokenIssueToLid, getLIDForPN, getPNForLID)
					.then(issueJid => issuePrivacyTokens([issueJid], issueTimestamp))
					.then(async result => {
						await storeTcTokensFromIqResult({
							result,
							fallbackJid: tcTokenJid,
							keys: authState.keys,
							getLIDForPN
						})

						const currentData = await authState.keys.get('tctoken', [tcTokenJid])
						const currentEntry = currentData[tcTokenJid]
						const indexWrite = await buildMergedTcTokenIndexWrite(authState.keys, [tcTokenJid])
						await authState.keys.set({
							tctoken: {
								[tcTokenJid]: {
									token: Buffer.alloc(0),
									...currentEntry,
									senderTimestamp: issueTimestamp
								},
								...indexWrite
							}
						})
						emitSendPathTelemetry(
							'relay.tctoken.issue.complete',
							'success',
							{ participants: 1, cacheSets: 1 },
							{
								msgId,
								jid: destinationJid,
								tcTokenJid,
								durationMs: Date.now() - issuanceStarted
							}
						)
					})
					.catch(err => {
						emitSendPathTelemetry(
							'relay.tctoken.issue.complete',
							'failure',
							{ participants: 1 },
							{
								msgId,
								jid: destinationJid,
								tcTokenJid,
								durationMs: Date.now() - issuanceStarted,
								error: err instanceof Error ? err.message : String(err)
							}
						)
						logger.debug({ jid: destinationJid, err: err?.message }, 'fire-and-forget tctoken issuance failed')
					})
					.finally(() => {
						inFlightTcTokenIssuance.delete(tcTokenJid)
					})
			}

			// Add message to retry cache if enabled
			if (messageRetryManager && !participant) {
				messageRetryManager.addRecentMessage(destinationJid, msgId, message)
				emitSendPathTelemetry('relay.retryCache.add', 'success', { cacheSets: 1 }, { msgId, jid: destinationJid })
			} else {
				emitSendPathTelemetry('relay.retryCache.add', 'hit', undefined, {
					msgId,
					jid: destinationJid,
					enabled: !!messageRetryManager,
					isRetryResend
				})
			}
		}

		emitSendPathTelemetry(
			'relay.complete',
			'success',
			{
				participants: participants.length,
				devices: devices.length
			},
			{
				msgId,
				jid: destinationJid,
				durationMs: Date.now() - relayStartedAt,
				isGroup,
				isStatus,
				isNewsletter,
				isRetryResend
			}
		)
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

	const issuePrivacyTokens = async (jids: string[], timestamp?: number) => {
		const startedAt = Date.now()
		emitSendPathTelemetry('issuePrivacyTokens.start', 'start', { participants: jids.length })
		const t = (timestamp ?? unixTimestampSeconds()).toString()
		try {
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

			emitSendPathTelemetry(
				'issuePrivacyTokens.complete',
				'success',
				{ participants: jids.length },
				{ durationMs: Date.now() - startedAt }
			)
			return result
		} catch (error) {
			emitSendPathTelemetry(
				'issuePrivacyTokens.complete',
				'failure',
				{ participants: jids.length },
				{ durationMs: Date.now() - startedAt, error: error instanceof Error ? error.message : String(error) }
			)
			throw error
		}
	}

	const waUploadToServer = getWAUploadToServer(config, refreshMediaConn)

	const waitForMsgMediaUpdate = bindWaitForEvent(ev, 'messages.media-update')

	return {
		...sock,
		issuePrivacyTokens,
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
			const node = encryptMediaRetryRequest(message.key, mediaKey, meId)

			let error: Error | undefined = undefined
			await Promise.all([
				(async () => {
					await sendNode(node)
				})(),
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
		warmUpGroupSend: async (groupJid: string) =>
			warmUpGroupSend(groupJid, {
				cachedGroupMetadata: config.cachedGroupMetadata,
				groupMetadata,
				getUSyncDevices,
				assertSessions,
				participantPrepCoordination
			}),
		warmUpGroupParticipants: async (groupJid: string, participants: string[]) =>
			warmUpGroupParticipants(groupJid, participants, {
				cachedGroupMetadata: config.cachedGroupMetadata,
				groupMetadata,
				getUSyncDevices,
				assertSessions,
				participantPrepCoordination
			}),
		sendMessage: async (jid: string, content: AnyMessageContent, options: MiscMessageGenerationOptions = {}) => {
			const sendStartedAt = Date.now()
			const timeoutMs = options.timeoutMs && options.timeoutMs > 0 ? options.timeoutMs : undefined
			const timeoutController = timeoutMs ? new AbortController() : undefined
			let timeoutHandle: NodeJS.Timeout | undefined
			const signal = timeoutController?.signal
			const contentType = typeof content === 'object' && content ? Object.keys(content)[0] : typeof content
			emitSendPathTelemetry('sendMessage.start', 'start', undefined, {
				jid,
				contentType,
				timeoutMs,
				useCachedGroupMetadata: options.useCachedGroupMetadata,
				statusJidList: options.statusJidList?.length
			})

			if (timeoutController) {
				timeoutHandle = setTimeout(() => {
					timeoutController.abort(makeSendTimeoutError())
				}, timeoutMs)
			}

			try {
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

					const ephemeralStarted = Date.now()
					emitSendPathTelemetry('sendMessage.groupToggleEphemeral', 'start', undefined, { jid, value })
					await withAbort(groupToggleEphemeral(jid, value), signal)
					emitSendPathTelemetry('sendMessage.groupToggleEphemeral', 'success', undefined, {
						jid,
						value,
						durationMs: Date.now() - ephemeralStarted
					})
					emitSendPathTelemetry('sendMessage.complete', 'success', undefined, {
						jid,
						contentType,
						durationMs: Date.now() - sendStartedAt,
						path: 'groupToggleEphemeral'
					})
					return
				}

				const generateStarted = Date.now()
				emitSendPathTelemetry('sendMessage.generateWAMessage', 'start', undefined, {
					jid,
					contentType
				})
				const fullMsg = await withAbort(
					generateWAMessage(jid, content, {
						logger,
						userJid,
						instanceId: getInstanceId(),
						telemetry: config.telemetry,
						getUrlInfo: (text: string) =>
							withAbort(
								getUrlInfo(text, {
									thumbnailWidth: linkPreviewImageThumbnailWidth,
									fetchOpts: {
										timeout: 3_000,
										...(httpRequestOptions || {}),
										signal
									},
									logger,
									uploadImage: generateHighQualityLinkPreview ? waUploadToServer : undefined
								}),
								signal
							),
						getProfilePicUrl: (j: string, type: 'image' | 'preview') =>
							withAbort(sock.profilePictureUrl(j, type), signal),
						getCallLink: (type: 'audio' | 'video', event?: { startTime: number }) =>
							withAbort(sock.createCallLink(type, event), signal),
						upload: waUploadToServer,
						mediaCache: config.mediaCache,
						options: {
							...config.options,
							signal
						},
						messageId: generateMessageIDV2(sock.user?.id),
						...options
					}),
					signal
				)
				emitSendPathTelemetry('sendMessage.generateWAMessage', 'success', undefined, {
					jid,
					contentType,
					msgId: fullMsg.key.id,
					durationMs: Date.now() - generateStarted,
					hasMedia: !!getMediaType(fullMsg.message || {})
				})

				if (options.debugDelayBeforeRelayMs && options.debugDelayBeforeRelayMs > 0) {
					const delayStarted = Date.now()
					emitSendPathTelemetry('sendMessage.debugDelayBeforeRelay', 'start', undefined, {
						msgId: fullMsg.key.id,
						delayMs: options.debugDelayBeforeRelayMs
					})
					await withAbort(delay(options.debugDelayBeforeRelayMs), signal)
					emitSendPathTelemetry('sendMessage.debugDelayBeforeRelay', 'success', undefined, {
						msgId: fullMsg.key.id,
						durationMs: Date.now() - delayStarted
					})
				}

				const isEventMsg = 'event' in content && !!content.event
				const isDeleteMsg = 'delete' in content && !!content.delete
				const isEditMsg = 'edit' in content && !!content.edit
				const isPinMsg = 'pin' in content && !!content.pin
				const isPollMessage = 'poll' in content && !!content.poll
				const additionalAttributes: BinaryNodeAttributes = {}
				const additionalNodes: BinaryNode[] = []
				if (isDeleteMsg) {
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

				const relayStarted = Date.now()
				emitSendPathTelemetry('sendMessage.relayMessage', 'start', undefined, {
					jid,
					msgId: fullMsg.key.id
				})
				await withAbort(
					relayMessage(jid, fullMsg.message!, {
						messageId: fullMsg.key.id!,
						useCachedGroupMetadata: options.useCachedGroupMetadata,
						additionalAttributes,
						statusJidList: options.statusJidList,
						additionalNodes,
						useUserDevicesCache: !!userDevicesCache,
						signal
					}),
					signal
				)
				emitSendPathTelemetry('sendMessage.relayMessage', 'success', undefined, {
					jid,
					msgId: fullMsg.key.id,
					durationMs: Date.now() - relayStarted
				})

				if (config.emitOwnEvents) {
					process.nextTick(async () => {
						await messageMutex.mutex(() => upsertMessage(fullMsg, 'append'))
					})
				}

				emitSendPathTelemetry('sendMessage.complete', 'success', undefined, {
					jid,
					contentType,
					msgId: fullMsg.key.id,
					durationMs: Date.now() - sendStartedAt
				})
				return fullMsg
			} catch (error) {
				emitSendPathTelemetry('sendMessage.complete', 'failure', undefined, {
					jid,
					contentType,
					durationMs: Date.now() - sendStartedAt,
					aborted: !!signal?.aborted,
					error: error instanceof Error ? error.message : String(error)
				})
				if (signal?.aborted) {
					throw signal.reason ?? makeSendTimeoutError()
				}

				throw error
			} finally {
				if (timeoutHandle) {
					clearTimeout(timeoutHandle)
				}
			}
		}
	}
}
