import NodeCache from '@cacheable/node-cache'
import { Boom } from '@hapi/boom'
import { LRUCache } from 'lru-cache'
import { proto } from '../../WAProto/index.js'
import {
	DEFAULT_CACHE_MAX_KEYS,
	DEFAULT_CACHE_TTLS,
	HISTORY_SYNC_PAUSED_TIMEOUT_MS,
	PROCESSABLE_HISTORY_TYPES
} from '../Defaults'
import type {
	BotListInfo,
	CacheStore,
	ChatModification,
	ChatMutation,
	ChatUpdate,
	LTHashState,
	MessageUpsertType,
	PresenceData,
	SocketConfig,
	WABusinessHoursConfig,
	WABusinessProfile,
	WAMediaUpload,
	WAMessage,
	WAPatchCreate,
	WAPatchName,
	WAPresence,
	WAPrivacyCallValue,
	WAPrivacyGroupAddValue,
	WAPrivacyMessagesValue,
	WAPrivacyOnlineValue,
	WAPrivacyValue,
	WAReadReceiptsValue
} from '../Types'
import { ALL_WA_PATCH_NAMES } from '../Types'
import type { QuickReplyAction } from '../Types/Bussines.js'
import type { LabelActionBody } from '../Types/Label'
import { SyncState } from '../Types/State'
import {
	chatModificationToAppPatch,
	type ChatMutationMap,
	decodePatches,
	decodeSyncdSnapshot,
	encodeSyncdPatch,
	ensureLTHashStateVersion,
	extractSyncdPatches,
	generateProfilePicture,
	getHistoryMsg,
	isAppStateSyncIrrecoverable,
	isMissingKeyError,
	MAX_SYNC_ATTEMPTS,
	newLTHashState,
	processSyncAction,
	resolveLidToPn
} from '../Utils'
import { makeKeyedMutex, makeMutex } from '../Utils/make-mutex'
import processMessage from '../Utils/process-message'
import { buildTcTokenFromJid } from '../Utils/tc-token-utils'
import {
	type BinaryNode,
	getBinaryNodeChild,
	getBinaryNodeChildren,
	isAnyLidUser,
	isAnyPnUser,
	jidDecode,
	jidNormalizedUser,
	reduceBinaryNodeToDictionary,
	S_WHATSAPP_NET
} from '../WABinary'
import { USyncQuery, USyncUser } from '../WAUSync'
import { makeSocket } from './socket.js'

export const makeChatsSocket = (config: SocketConfig) => {
	const {
		logger,
		markOnlineOnConnect,
		fireInitQueries,
		appStateMacVerification,
		shouldIgnoreJid,
		shouldSyncHistoryMessage,
		getMessage
	} = config
	const sock = makeSocket(config)
	const {
		ev,
		ws,
		authState,
		generateMessageTag,
		sendNode,
		query,
		signalRepository,
		onUnexpectedError,
		sendUnifiedSession,
		skipOfflineBuffer: socketSkippedOfflineBuffer
	} = sock

	const getLIDForPN = signalRepository.lidMapping.getLIDForPN.bind(signalRepository.lidMapping)

	let privacySettings: { [_: string]: string } | undefined

	let syncState: SyncState = SyncState.Connecting

	/** this mutex ensures that messages from the same chat are processed in order, while allowing parallel processing of messages from different chats */
	const messageMutex = makeKeyedMutex()

	/** this mutex ensures that receipts from the same chat are processed in order, while allowing parallel processing across chats */
	const receiptMutex = makeKeyedMutex()

	/** this mutex ensures that app state patches are processed in order */
	const appStatePatchMutex = makeMutex()

	/** this mutex ensures that notifications from the same chat are processed in order, while allowing parallel processing across chats */
	const notificationMutex = makeKeyedMutex()

	// Timeout for AwaitingInitialSync state
	let awaitingSyncTimeout: NodeJS.Timeout | undefined

	// In-memory history sync completion tracking (resets on reconnection)
	const historySyncStatus = {
		initialBootstrapComplete: false,
		recentSyncComplete: false
	}
	let historySyncPausedTimeout: NodeJS.Timeout | undefined

	// Collections blocked on missing app state sync keys (mirrors WA Web's "Blocked" state).
	// When a key arrives via APP_STATE_SYNC_KEY_SHARE, these are re-synced.
	const blockedCollections = new Set<WAPatchName>()

	const placeholderResendCache =
		config.placeholderResendCache ||
		(new NodeCache<number>({
			stdTTL: DEFAULT_CACHE_TTLS.MSG_RETRY, // 1 hour
			useClones: false
		}) as CacheStore)

	if (!config.placeholderResendCache) {
		config.placeholderResendCache = placeholderResendCache
	}

	/** helper function to fetch the given app state sync key */
	const getAppStateSyncKey = async (keyId: string) => {
		const { [keyId]: key } = await authState.keys.get('app-state-sync-key', [keyId])
		return key
	}

	/**
	 * App State Sync Key Cache with LRU eviction policy
	 * Prevents repeated database lookups for same keys during sync operations.
	 *
	 * MEMORY SAFETY: Limited by DEFAULT_CACHE_MAX_KEYS.SIGNAL_STORE with 1-hour TTL.
	 * Auto-purges expired entries to maintain memory bounds.
	 *
	 * TYPE SAFETY: Only successful lookups (non-null values) are cached.
	 * Null/undefined values are NOT cached to prevent blocking newly arrived keys.
	 * LRUCache.get() returns undefined for missing keys.
	 */
	const appStateSyncKeyCache = new LRUCache<string, proto.Message.IAppStateSyncKeyData>({
		max: DEFAULT_CACHE_MAX_KEYS.SIGNAL_STORE, // Use constant from Defaults (10,000)
		ttl: DEFAULT_CACHE_TTLS.MSG_RETRY * 1000, // 1 hour TTL (convert seconds to ms)
		ttlAutopurge: true, // Automatically remove expired entries
		updateAgeOnGet: true // LRU refresh on access
	})

	/**
	 * Cached version of getAppStateSyncKey
	 * Uses LRU cache to reduce database calls during snapshot/patch decoding.
	 *
	 * Performance: 5x faster sync operations by eliminating redundant key fetches.
	 * Memory: Bounded by LRU policy (max 1000 keys, 1h TTL)
	 *
	 * CRITICAL FIX: Only cache successful lookups (non-null values) to prevent
	 * stale null values from blocking newly arrived keys via APP_STATE_SYNC_KEY_SHARE.
	 */
	const getCachedAppStateSyncKey = async (keyId: string) => {
		// Use get() directly to avoid race between has() and get() (Fix: Copilot C)
		const cached = appStateSyncKeyCache.get(keyId)
		if (cached !== undefined) {
			// Cache hit - return the cached key
			return cached
		}

		// Cache miss - fetch from database
		const key = await getAppStateSyncKey(keyId)

		// CRITICAL: Only cache non-null values
		// Null/undefined means key doesn't exist YET, but may arrive via APP_STATE_SYNC_KEY_SHARE
		// If we cache null, the cache (TTL 1h) will block newly arrived keys
		if (key) {
			appStateSyncKeyCache.set(keyId, key)
		}

		return key
	}

	const fetchPrivacySettings = async (force = false) => {
		if (!privacySettings || force) {
			const { content } = await query({
				tag: 'iq',
				attrs: {
					xmlns: 'privacy',
					to: S_WHATSAPP_NET,
					type: 'get'
				},
				content: [{ tag: 'privacy', attrs: {} }]
			})
			privacySettings = reduceBinaryNodeToDictionary(content?.[0] as BinaryNode, 'category')
		}

		return privacySettings
	}

	/** helper function to run a privacy IQ query */
	const privacyQuery = async (name: string, value: string) => {
		await query({
			tag: 'iq',
			attrs: {
				xmlns: 'privacy',
				to: S_WHATSAPP_NET,
				type: 'set'
			},
			content: [
				{
					tag: 'privacy',
					attrs: {},
					content: [
						{
							tag: 'category',
							attrs: { name, value }
						}
					]
				}
			]
		})
	}

	const updateMessagesPrivacy = async (value: WAPrivacyMessagesValue) => {
		await privacyQuery('messages', value)
	}

	const updateCallPrivacy = async (value: WAPrivacyCallValue) => {
		await privacyQuery('calladd', value)
	}

	const updateLastSeenPrivacy = async (value: WAPrivacyValue) => {
		await privacyQuery('last', value)
	}

	const updateOnlinePrivacy = async (value: WAPrivacyOnlineValue) => {
		await privacyQuery('online', value)
	}

	const updateProfilePicturePrivacy = async (value: WAPrivacyValue) => {
		await privacyQuery('profile', value)
	}

	const updateStatusPrivacy = async (value: WAPrivacyValue) => {
		await privacyQuery('status', value)
	}

	const updateReadReceiptsPrivacy = async (value: WAReadReceiptsValue) => {
		await privacyQuery('readreceipts', value)
	}

	const updateGroupsAddPrivacy = async (value: WAPrivacyGroupAddValue) => {
		await privacyQuery('groupadd', value)
	}

	const updateDefaultDisappearingMode = async (duration: number) => {
		await query({
			tag: 'iq',
			attrs: {
				xmlns: 'disappearing_mode',
				to: S_WHATSAPP_NET,
				type: 'set'
			},
			content: [
				{
					tag: 'disappearing_mode',
					attrs: {
						duration: duration.toString()
					}
				}
			]
		})
	}

	const getBotListV2 = async () => {
		const resp = await query({
			tag: 'iq',
			attrs: {
				xmlns: 'bot',
				to: S_WHATSAPP_NET,
				type: 'get'
			},
			content: [
				{
					tag: 'bot',
					attrs: {
						v: '2'
					}
				}
			]
		})

		const botNode = getBinaryNodeChild(resp, 'bot')

		const botList: BotListInfo[] = []
		for (const section of getBinaryNodeChildren(botNode, 'section')) {
			if (section.attrs.type === 'all') {
				for (const bot of getBinaryNodeChildren(section, 'bot')) {
					const jid = bot.attrs.jid
					const personaId = bot.attrs['persona_id']
					if (!jid || !personaId) continue
					botList.push({
						jid,
						personaId
					})
				}
			}
		}

		return botList
	}

	const fetchStatus = async (...jids: string[]) => {
		const usyncQuery = new USyncQuery().withStatusProtocol()

		for (const jid of jids) {
			usyncQuery.withUser(new USyncUser().withId(jid))
		}

		const result = await sock.executeUSyncQuery(usyncQuery)
		if (result) {
			return result.list
		}
	}

	const fetchDisappearingDuration = async (...jids: string[]) => {
		const usyncQuery = new USyncQuery().withDisappearingModeProtocol()

		for (const jid of jids) {
			usyncQuery.withUser(new USyncUser().withId(jid))
		}

		const result = await sock.executeUSyncQuery(usyncQuery)
		if (result) {
			return result.list
		}
	}

	/** update the profile picture for yourself or a group */
	const updateProfilePicture = async (
		jid: string,
		content: WAMediaUpload,
		dimensions?: { width: number; height: number }
	) => {
		let targetJid
		if (!jid) {
			throw new Boom(
				'Illegal no-jid profile update. Please specify either your ID or the ID of the chat you wish to update'
			)
		}

		const me = authState.creds.me
		if (!me) throw new Boom('Not authenticated', { statusCode: 401 })
		if (jidNormalizedUser(jid) !== jidNormalizedUser(me.id)) {
			targetJid = jidNormalizedUser(jid) // in case it is someone other than us
		} else {
			targetJid = undefined
		}

		const { img } = await generateProfilePicture(content, dimensions)
		await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'set',
				xmlns: 'w:profile:picture',
				...(targetJid ? { target: targetJid } : {})
			},
			content: [
				{
					tag: 'picture',
					attrs: { type: 'image' },
					content: img
				}
			]
		})
	}

	/** remove the profile picture for yourself or a group */
	const removeProfilePicture = async (jid: string) => {
		let targetJid
		if (!jid) {
			throw new Boom(
				'Illegal no-jid profile update. Please specify either your ID or the ID of the chat you wish to update'
			)
		}

		const me = authState.creds.me
		if (!me) throw new Boom('Not authenticated', { statusCode: 401 })
		if (jidNormalizedUser(jid) !== jidNormalizedUser(me.id)) {
			targetJid = jidNormalizedUser(jid) // in case it is someone other than us
		} else {
			targetJid = undefined
		}

		await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'set',
				xmlns: 'w:profile:picture',
				...(targetJid ? { target: targetJid } : {})
			}
		})
	}

	/** update the profile status for yourself */
	const updateProfileStatus = async (status: string) => {
		await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'set',
				xmlns: 'status'
			},
			content: [
				{
					tag: 'status',
					attrs: {},
					content: Buffer.from(status, 'utf-8')
				}
			]
		})
	}

	const updateProfileName = async (name: string) => {
		await chatModify({ pushNameSetting: name }, '')
	}

	const fetchBlocklist = async () => {
		const result = await query({
			tag: 'iq',
			attrs: {
				xmlns: 'blocklist',
				to: S_WHATSAPP_NET,
				type: 'get'
			}
		})

		const listNode = getBinaryNodeChild(result, 'list')
		return getBinaryNodeChildren(listNode, 'item').map(n => n.attrs.jid)
	}

	const updateBlockStatus = async (jid: string, action: 'block' | 'unblock') => {
		const normalizedJid = jidNormalizedUser(jid)
		let lid: string
		let pn_jid: string | undefined

		if (isAnyLidUser(normalizedJid)) {
			lid = normalizedJid
			if (action === 'block') {
				const pn = await signalRepository.lidMapping.getPNForLID(normalizedJid)
				if (!pn) {
					throw new Boom(`Unable to resolve PN JID for LID: ${jid}`, { statusCode: 400 })
				}

				pn_jid = jidNormalizedUser(pn)
			}
		} else if (isAnyPnUser(normalizedJid)) {
			const mapped = await signalRepository.lidMapping.getLIDForPN(normalizedJid)
			if (!mapped) {
				throw new Boom(`Unable to resolve LID for PN JID: ${jid}`, { statusCode: 400 })
			}

			lid = mapped
			if (action === 'block') {
				pn_jid = normalizedJid
			}
		} else {
			throw new Boom(`Invalid jid for block/unblock: ${jid}`, { statusCode: 400 })
		}

		const itemAttrs: { action: 'block' | 'unblock'; jid: string; pn_jid?: string } = {
			action,
			jid: lid
		}

		if (action === 'block' && pn_jid) {
			itemAttrs.pn_jid = pn_jid
		}

		await query({
			tag: 'iq',
			attrs: {
				xmlns: 'blocklist',
				to: S_WHATSAPP_NET,
				type: 'set'
			},
			content: [
				{
					tag: 'item',
					attrs: itemAttrs
				}
			]
		})
	}

	const getBusinessProfile = async (jid: string): Promise<WABusinessProfile | void> => {
		const results = await query({
			tag: 'iq',
			attrs: {
				to: 's.whatsapp.net',
				xmlns: 'w:biz',
				type: 'get'
			},
			content: [
				{
					tag: 'business_profile',
					attrs: { v: '244' },
					content: [
						{
							tag: 'profile',
							attrs: { jid }
						}
					]
				}
			]
		})

		const profileNode = getBinaryNodeChild(results, 'business_profile')
		const profiles = getBinaryNodeChild(profileNode, 'profile')
		if (profiles) {
			const address = getBinaryNodeChild(profiles, 'address')
			const description = getBinaryNodeChild(profiles, 'description')
			const website = getBinaryNodeChild(profiles, 'website')
			const email = getBinaryNodeChild(profiles, 'email')
			const category = getBinaryNodeChild(getBinaryNodeChild(profiles, 'categories'), 'category')
			const businessHours = getBinaryNodeChild(profiles, 'business_hours')
			const businessHoursConfig = businessHours
				? getBinaryNodeChildren(businessHours, 'business_hours_config')
				: undefined
			const websiteStr = website?.content?.toString()
			return {
				wid: profiles.attrs?.jid,
				address: address?.content?.toString(),
				description: description?.content?.toString() || '',
				website: websiteStr ? [websiteStr] : [],
				email: email?.content?.toString(),
				category: category?.content?.toString(),
				business_hours: {
					timezone: businessHours?.attrs?.timezone,
					business_config: businessHoursConfig?.map(({ attrs }) => attrs as unknown as WABusinessHoursConfig)
				}
			}
		}
	}

	const cleanDirtyBits = async (type: 'account_sync' | 'groups', fromTimestamp?: number | string) => {
		logger.info({ fromTimestamp }, 'clean dirty bits ' + type)
		await sendNode({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'set',
				xmlns: 'urn:xmpp:whatsapp:dirty',
				id: generateMessageTag()
			},
			content: [
				{
					tag: 'clean',
					attrs: {
						type,
						...(fromTimestamp ? { timestamp: fromTimestamp.toString() } : null)
					}
				}
			]
		})
	}

	const newAppStateChunkHandler = (isInitialSync: boolean) => {
		return {
			onMutation(mutation: ChatMutation) {
				const me = authState.creds.me
				if (!me) throw new Boom('Not authenticated', { statusCode: 401 })
				processSyncAction(
					mutation,
					ev,
					me,
					isInitialSync ? { accountSettings: authState.creds.accountSettings } : undefined,
					logger
				)
			}
		}
	}

	const resyncAppState = ev.createBufferedFunction(
		async (collections: readonly WAPatchName[], isInitialSync: boolean) => {
			// we use this to determine which events to fire
			// otherwise when we resync from scratch -- all notifications will fire
			const initialVersionMap: { [T in WAPatchName]?: number } = {}
			const globalMutationMap: ChatMutationMap = {}
			const forceSnapshotCollections = new Set<WAPatchName>()

			await authState.keys.transaction(async () => {
				const collectionsToHandle = new Set<string>(collections)
				// in case something goes wrong -- ensure we don't enter a loop that cannot be exited from
				const attemptsMap: { [T in WAPatchName]?: number } = {}
				// keep executing till all collections are done
				// sometimes a single patch request will not return all the patches (God knows why)
				// so we fetch till they're all done (this is determined by the "has_more_patches" flag)
				while (collectionsToHandle.size) {
					const states = {} as { [T in WAPatchName]: LTHashState }
					const nodes: BinaryNode[] = []

					for (const name of collectionsToHandle as Set<WAPatchName>) {
						const result = await authState.keys.get('app-state-sync-version', [name])
						let state = result[name]

						if (state) {
							state = ensureLTHashStateVersion(state)
							if (typeof initialVersionMap[name] === 'undefined') {
								initialVersionMap[name] = state.version
							}
						} else {
							state = newLTHashState()
						}

						states[name] = state

						const shouldForceSnapshot = forceSnapshotCollections.has(name)
						if (shouldForceSnapshot) {
							forceSnapshotCollections.delete(name)
						}

						logger.info(`resyncing ${name} from v${state.version}${shouldForceSnapshot ? ' (forcing snapshot)' : ''}`)

						nodes.push({
							tag: 'collection',
							attrs: {
								name,
								version: state.version.toString(),
								// return snapshot if syncing from scratch or forcing after a failed attempt
								return_snapshot: (shouldForceSnapshot || !state.version).toString()
							}
						})
					}

					const result = await query({
						tag: 'iq',
						attrs: {
							to: S_WHATSAPP_NET,
							xmlns: 'w:sync:app:state',
							type: 'set'
						},
						content: [
							{
								tag: 'sync',
								attrs: {},
								content: nodes
							}
						]
					})

					// extract from binary node
					const decoded = await extractSyncdPatches(result, config?.options)
					for (const key in decoded) {
						const name = key as WAPatchName
						const { patches, hasMorePatches, snapshot } = decoded[name]
						try {
							if (snapshot) {
								const { state: newState, mutationMap } = await decodeSyncdSnapshot(
									name,
									snapshot,
									getCachedAppStateSyncKey,
									initialVersionMap[name],
									appStateMacVerification.snapshot
								)
								states[name] = newState
								Object.assign(globalMutationMap, mutationMap)

								logger.info(`restored state of ${name} from snapshot to v${newState.version} with mutations`)

								await authState.keys.set({ 'app-state-sync-version': { [name]: newState } })
							}

							// only process if there are syncd patches
							if (patches.length) {
								const { state: newState, mutationMap } = await decodePatches(
									name,
									patches,
									states[name],
									getCachedAppStateSyncKey,
									config.options,
									initialVersionMap[name],
									logger,
									appStateMacVerification.patch
								)

								await authState.keys.set({ 'app-state-sync-version': { [name]: newState } })

								logger.info(`synced ${name} to v${newState.version}`)
								initialVersionMap[name] = newState.version

								Object.assign(globalMutationMap, mutationMap)
							}

							if (hasMorePatches) {
								logger.info(`${name} has more patches...`)
							} else {
								// collection is done with sync
								collectionsToHandle.delete(name)
							}
						} catch (error: any) {
							attemptsMap[name] = (attemptsMap[name] || 0) + 1

							const logData = {
								name,
								attempt: attemptsMap[name],
								version: states[name].version,
								statusCode: error.output?.statusCode,
								errorType: error.name,
								error: error.stack
							}

							if (isMissingKeyError(error) && attemptsMap[name] >= MAX_SYNC_ATTEMPTS) {
								// WA Web treats missing keys as "Blocked" — park the collection
								// until the key arrives via APP_STATE_SYNC_KEY_SHARE.
								logger.warn(
									logData,
									`${name} blocked on missing key from v${states[name].version}, parking after ${attemptsMap[name]} attempts`
								)
								blockedCollections.add(name)
								collectionsToHandle.delete(name)
							} else if (isMissingKeyError(error)) {
								// Retry with a snapshot which may use a different key.
								logger.info(
									logData,
									`${name} blocked on missing key from v${states[name].version}, retrying with snapshot`
								)
								forceSnapshotCollections.add(name)
							} else if (isAppStateSyncIrrecoverable(error, attemptsMap[name])) {
								logger.warn(logData, `failed to sync ${name} from v${states[name].version}, giving up`)
								// reset persisted version to null so the next resyncAppState call
								// requests a full snapshot instead of reusing the stale version that caused the error
								await authState.keys.set({ 'app-state-sync-version': { [name]: null } })
								collectionsToHandle.delete(name)
							} else {
								logger.info(logData, `failed to sync ${name} from v${states[name].version}, forcing snapshot retry`)
								// force a full snapshot on retry to recover from
								// corrupted local state (e.g. LTHash MAC mismatch)
								forceSnapshotCollections.add(name)
							}
						}
					}
				}
			}, authState?.creds?.me?.id || 'resync-app-state')

			const { onMutation } = newAppStateChunkHandler(isInitialSync)
			const lidMapping = signalRepository.lidMapping
			for (const key in globalMutationMap) {
				const mutation = globalMutationMap[key]
				if (!mutation) continue
				// Normalize LID→PN in sync action index[1] (chat/contact ID)
				if (mutation.index[1] && isAnyLidUser(mutation.index[1])) {
					const resolved = await resolveLidToPn(mutation.index[1], lidMapping, logger)
					if (resolved) mutation.index[1] = resolved
				}

				onMutation(mutation)
			}
		}
	)

	/**
	 * fetch the profile picture of a user/group
	 * type = "preview" for a low res picture
	 * type = "image for the high res picture"
	 */
	const profilePictureUrl = async (jid: string, type: 'preview' | 'image' = 'preview', timeoutMs?: number) => {
		const baseContent: BinaryNode[] = [{ tag: 'picture', attrs: { type, query: 'url' } }]

		// WA Web only includes tctoken for user JIDs (not groups/newsletters)
		// and never for own profile pic (Chat model for self has no tcToken).
		// Including tctoken for own JID causes the server to never respond.
		const normalizedJid = jidNormalizedUser(jid)
		const isUserJid = isAnyPnUser(normalizedJid) || isAnyLidUser(normalizedJid)
		const me = authState.creds.me
		const isSelf =
			me && (normalizedJid === jidNormalizedUser(me.id) || (me.lid && normalizedJid === jidNormalizedUser(me.lid)))
		let content: BinaryNode[] | undefined = baseContent

		if (isUserJid && !isSelf) {
			content = await buildTcTokenFromJid({
				authState,
				jid: normalizedJid,
				baseContent,
				getLIDForPN
			})
		}

		jid = normalizedJid
		const result = await query(
			{
				tag: 'iq',
				attrs: {
					target: jid,
					to: S_WHATSAPP_NET,
					type: 'get',
					xmlns: 'w:profile:picture'
				},
				content
			},
			timeoutMs
		)
		const child = getBinaryNodeChild(result, 'picture')
		return child?.attrs?.url
	}

	const createCallLink = async (type: 'audio' | 'video', event?: { startTime: number }, timeoutMs?: number) => {
		const result = await query(
			{
				tag: 'call',
				attrs: {
					id: generateMessageTag(),
					to: '@call'
				},
				content: [
					{
						tag: 'link_create',
						attrs: { media: type },
						content: event ? [{ tag: 'event', attrs: { start_time: String(event.startTime) } }] : undefined
					}
				]
			},
			timeoutMs
		)
		const child = getBinaryNodeChild(result, 'link_create')
		return child?.attrs?.token
	}

	const sendPresenceUpdate = async (type: WAPresence, toJid?: string) => {
		const me = authState.creds.me
		if (!me) throw new Boom('Not authenticated', { statusCode: 401 })
		if (type === 'available' || type === 'unavailable') {
			if (!me.name) {
				logger.warn('no name present, ignoring presence update request...')
				return
			}

			ev.emit('connection.update', { isOnline: type === 'available' })

			await sendNode({
				tag: 'presence',
				attrs: {
					name: me.name.replace(/@/g, ''),
					type
				}
			})

			// Send unified_session telemetry when going online
			// This mimics official WhatsApp Web client behavior
			if (type === 'available') {
				sendUnifiedSession('presence').catch(err => {
					logger.debug({ err }, 'Failed to send unified_session on presence available')
				})
			}
		} else {
			if (!toJid) {
				logger.warn('sendPresenceUpdate: toJid is missing, skipping')
				return
			}

			const decoded = jidDecode(toJid)
			if (!decoded) {
				logger.warn({ toJid }, 'sendPresenceUpdate: failed to decode toJid, skipping')
				return
			}

			const { server } = decoded
			const isLid = server === 'lid'

			await sendNode({
				tag: 'chatstate',
				attrs: {
					from: isLid ? me.lid || me.id : me.id,
					to: toJid
				},
				content: [
					{
						tag: type === 'recording' ? 'composing' : type,
						attrs: type === 'recording' ? { media: 'audio' } : {}
					}
				]
			})
		}
	}

	/**
	 * @param toJid the jid to subscribe to
	 * @param tcToken token for subscription, use if present
	 */
	const presenceSubscribe = async (toJid: string) => {
		// Only include tctoken for user JIDs — groups/newsletters don't use tctokens
		const normalizedToJid = jidNormalizedUser(toJid)
		const isUserJid = isAnyPnUser(normalizedToJid) || isAnyLidUser(normalizedToJid)
		const tcTokenContent = isUserJid
			? await buildTcTokenFromJid({ authState, jid: normalizedToJid, getLIDForPN })
			: undefined

		return sendNode({
			tag: 'presence',
			attrs: {
				to: toJid,
				id: generateMessageTag(),
				type: 'subscribe'
			},
			content: tcTokenContent
		})
	}

	const handlePresenceUpdate = async ({ tag, attrs, content }: BinaryNode) => {
		let presence: PresenceData | undefined
		const rawJid = attrs.from
		const rawParticipant = attrs.participant || attrs.from
		if (!rawJid) {
			logger.warn({ attrs }, 'handlePresenceUpdate: jid (attrs.from) is missing, skipping')
			return
		}

		if (shouldIgnoreJid(rawJid) && rawJid !== S_WHATSAPP_NET) {
			return
		}

		if (tag === 'presence') {
			presence = {
				lastKnownPresence: attrs.type === 'unavailable' ? 'unavailable' : 'available',
				lastSeen: attrs.last && attrs.last !== 'deny' ? +attrs.last : undefined
			}
		} else if (Array.isArray(content)) {
			const [firstChild] = content
			if (!firstChild) {
				logger.warn({ jid: rawJid }, 'handlePresenceUpdate: firstChild content is empty, skipping')
				return
			}

			let type = firstChild.tag as WAPresence
			if (type === 'paused') {
				type = 'available'
			}

			if (firstChild.attrs?.media === 'audio') {
				type = 'recording'
			}

			presence = { lastKnownPresence: type }
		} else {
			logger.error({ tag, attrs, content }, 'recv invalid presence node')
		}

		if (presence) {
			if (!rawParticipant) {
				logger.warn({ jid: rawJid }, 'handlePresenceUpdate: participant is missing, skipping')
				return
			}

			// Resolve LID→PN so consumers always see phone-number JIDs
			const lidMapping = signalRepository.lidMapping
			const [jid, participant] = await Promise.all([
				resolveLidToPn(rawJid, lidMapping, logger),
				resolveLidToPn(rawParticipant, lidMapping, logger)
			])

			ev.emit('presence.update', { id: jid!, presences: { [participant!]: presence } })
		}
	}

	const appPatch = async (patchCreate: WAPatchCreate) => {
		const name = patchCreate.type
		const myAppStateKeyId = authState.creds.myAppStateKeyId
		if (!myAppStateKeyId) {
			throw new Boom('App state key not present!', { statusCode: 400 })
		}

		let initial: LTHashState
		let encodeResult: { patch: proto.ISyncdPatch; state: LTHashState }

		await appStatePatchMutex.mutex(async () => {
			await authState.keys.transaction(async () => {
				logger.debug({ patch: patchCreate }, 'applying app patch')

				await resyncAppState([name], false)

				const { [name]: currentSyncVersion } = await authState.keys.get('app-state-sync-version', [name])
				initial = currentSyncVersion ? ensureLTHashStateVersion(currentSyncVersion) : newLTHashState()

				encodeResult = await encodeSyncdPatch(patchCreate, myAppStateKeyId, initial, getAppStateSyncKey)
				const { patch, state } = encodeResult

				const node: BinaryNode = {
					tag: 'iq',
					attrs: {
						to: S_WHATSAPP_NET,
						type: 'set',
						xmlns: 'w:sync:app:state'
					},
					content: [
						{
							tag: 'sync',
							attrs: {},
							content: [
								{
									tag: 'collection',
									attrs: {
										name,
										version: (state.version - 1).toString(),
										return_snapshot: 'false'
									},
									content: [
										{
											tag: 'patch',
											attrs: {},
											content: proto.SyncdPatch.encode(patch).finish()
										}
									]
								}
							]
						}
					]
				}
				await query(node)

				await authState.keys.set({ 'app-state-sync-version': { [name]: state } })
			}, authState?.creds?.me?.id || 'app-patch')
		})

		if (config.emitOwnEvents) {
			const { onMutation } = newAppStateChunkHandler(false)
			const { mutationMap } = await decodePatches(
				name,
				[{ ...encodeResult!.patch, version: { version: encodeResult!.state.version } }],
				initial!,
				getAppStateSyncKey,
				config.options,
				undefined,
				logger
			)
			const lidMapping = signalRepository.lidMapping
			for (const key in mutationMap) {
				const mutation = mutationMap[key]!
				// Normalize LID→PN in sync action index[1] (chat/contact ID)
				if (mutation.index[1] && isAnyLidUser(mutation.index[1])) {
					const resolved = await resolveLidToPn(mutation.index[1], lidMapping, logger)
					if (resolved) mutation.index[1] = resolved
				}

				onMutation(mutation)
			}
		}
	}

	/** sending non-abt props may fix QR scan fail if server expects */
	const fetchProps = async () => {
		//TODO: implement both protocol 1 and protocol 2 prop fetching, specially for abKey for WM
		const resultNode = await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				xmlns: 'w',
				type: 'get'
			},
			content: [
				{
					tag: 'props',
					attrs: {
						protocol: '2',
						hash: authState?.creds?.lastPropHash || ''
					}
				}
			]
		})

		const propsNode = getBinaryNodeChild(resultNode, 'props')

		let props: { [_: string]: string } = {}
		if (propsNode) {
			if (propsNode.attrs?.hash) {
				// on some clients, the hash is returning as undefined
				authState.creds.lastPropHash = propsNode?.attrs?.hash
				ev.emit('creds.update', authState.creds)
			}

			props = reduceBinaryNodeToDictionary(propsNode, 'prop')
		}

		logger.debug('fetched props')

		return props
	}

	/**
	 * modify a chat -- mark unread, read etc.
	 * lastMessages must be sorted in reverse chronologically
	 * requires the last messages till the last message received; required for archive & unread
	 */
	const chatModify = (mod: ChatModification, jid: string) => {
		const patch = chatModificationToAppPatch(mod, jid)
		return appPatch(patch)
	}

	/**
	 * Enable/Disable link preview privacy, not related to baileys link preview generation
	 */
	const updateDisableLinkPreviewsPrivacy = (isPreviewsDisabled: boolean) => {
		return chatModify(
			{
				disableLinkPreviews: { isPreviewsDisabled }
			},
			''
		)
	}

	/**
	 * Star or Unstar a message
	 */
	const star = (jid: string, messages: { id: string; fromMe?: boolean }[], star: boolean) => {
		return chatModify(
			{
				star: {
					messages,
					star
				}
			},
			jid
		)
	}

	/**
	 * Add or Edit Contact
	 */
	const addOrEditContact = (jid: string, contact: proto.SyncActionValue.IContactAction) => {
		return chatModify(
			{
				contact
			},
			jid
		)
	}

	/**
	 * Remove Contact
	 */
	const removeContact = (jid: string) => {
		return chatModify(
			{
				contact: null
			},
			jid
		)
	}

	/**
	 * Adds label
	 */
	const addLabel = (jid: string, labels: LabelActionBody) => {
		return chatModify(
			{
				addLabel: {
					...labels
				}
			},
			jid
		)
	}

	/**
	 * Adds label for the chats
	 */
	const addChatLabel = (jid: string, labelId: string) => {
		return chatModify(
			{
				addChatLabel: {
					labelId
				}
			},
			jid
		)
	}

	/**
	 * Removes label for the chat
	 */
	const removeChatLabel = (jid: string, labelId: string) => {
		return chatModify(
			{
				removeChatLabel: {
					labelId
				}
			},
			jid
		)
	}

	/**
	 * Adds label for the message
	 */
	const addMessageLabel = (jid: string, messageId: string, labelId: string) => {
		return chatModify(
			{
				addMessageLabel: {
					messageId,
					labelId
				}
			},
			jid
		)
	}

	/**
	 * Removes label for the message
	 */
	const removeMessageLabel = (jid: string, messageId: string, labelId: string) => {
		return chatModify(
			{
				removeMessageLabel: {
					messageId,
					labelId
				}
			},
			jid
		)
	}

	/**
	 * Add or Edit Quick Reply
	 */
	const addOrEditQuickReply = (quickReply: QuickReplyAction) => {
		return chatModify(
			{
				quickReply
			},
			''
		)
	}

	/**
	 * Remove Quick Reply
	 */
	const removeQuickReply = (timestamp: string) => {
		return chatModify(
			{
				quickReply: { timestamp, deleted: true }
			},
			''
		)
	}

	/**
	 * queries need to be fired on connection open
	 * help ensure parity with WA Web
	 * */
	const executeInitQueries = async () => {
		await Promise.all([fetchProps(), fetchBlocklist(), fetchPrivacySettings()])
	}

	const upsertMessage = ev.createBufferedFunction(async (msg: WAMessage, type: MessageUpsertType) => {
		ev.emit('messages.upsert', { messages: [msg], type })

		if (!!msg.pushName) {
			let jid = msg.key.fromMe ? authState.creds.me!.id : msg.key.participant || msg.key.remoteJid
			jid = jidNormalizedUser(jid!)

			if (!msg.key.fromMe) {
				ev.emit('contacts.update', [{ id: jid, notify: msg.pushName, verifiedName: msg.verifiedBizName! }])
			}

			// update our pushname too
			if (msg.key.fromMe && msg.pushName && authState.creds.me?.name !== msg.pushName) {
				ev.emit('creds.update', { me: { ...authState.creds.me!, name: msg.pushName } })
			}
		}

		const historyMsg = getHistoryMsg(msg.message!)
		const shouldProcessHistoryMsg = historyMsg
			? shouldSyncHistoryMessage(historyMsg) &&
				PROCESSABLE_HISTORY_TYPES.includes(historyMsg.syncType! as proto.HistorySync.HistorySyncType)
			: false

		if (historyMsg && shouldProcessHistoryMsg) {
			const syncType = historyMsg.syncType as proto.HistorySync.HistorySyncType

			// INITIAL_BOOTSTRAP — fire immediately, no progress check (same as WA Web K function)
			if (
				syncType === proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP &&
				!historySyncStatus.initialBootstrapComplete
			) {
				historySyncStatus.initialBootstrapComplete = true
				ev.emit('messaging-history.status', {
					syncType,
					status: 'complete',
					explicit: true
				})
			}

			// RECENT with progress === 100 — explicit completion
			if (
				syncType === proto.HistorySync.HistorySyncType.RECENT &&
				historyMsg.progress === 100 &&
				!historySyncStatus.recentSyncComplete
			) {
				historySyncStatus.recentSyncComplete = true
				clearTimeout(historySyncPausedTimeout)
				historySyncPausedTimeout = undefined
				ev.emit('messaging-history.status', {
					syncType,
					status: 'complete',
					explicit: true
				})
			}

			// Reset 120s paused timeout on any RECENT chunk (like WA Web's handleChunkProgress)
			if (syncType === proto.HistorySync.HistorySyncType.RECENT && !historySyncStatus.recentSyncComplete) {
				clearTimeout(historySyncPausedTimeout)
				historySyncPausedTimeout = setTimeout(() => {
					if (!historySyncStatus.recentSyncComplete) {
						historySyncStatus.recentSyncComplete = true
						ev.emit('messaging-history.status', {
							syncType: proto.HistorySync.HistorySyncType.RECENT,
							status: 'paused',
							explicit: false
						})
					}

					historySyncPausedTimeout = undefined
				}, HISTORY_SYNC_PAUSED_TIMEOUT_MS)
			}
		}

		// State machine: decide on sync and flush
		if (historyMsg && syncState === SyncState.AwaitingInitialSync) {
			if (awaitingSyncTimeout) {
				clearTimeout(awaitingSyncTimeout)
				awaitingSyncTimeout = undefined
			}

			if (shouldProcessHistoryMsg) {
				syncState = SyncState.Syncing
				logger.info('Transitioned to Syncing state')
				// Let doAppStateSync handle the final flush after it's done
			} else {
				syncState = SyncState.Online
				logger.info('History sync skipped, transitioning to Online state and flushing buffer')
				ev.flush()
			}
		}

		const doAppStateSync = async () => {
			if (syncState === SyncState.Syncing) {
				// All collections will be synced, so clear any blocked ones
				blockedCollections.clear()

				logger.info('Doing app state sync')
				await resyncAppState(ALL_WA_PATCH_NAMES, true)

				// Sync is complete, go online and flush everything
				syncState = SyncState.Online
				logger.info('App state sync complete, transitioning to Online state and flushing buffer')
				ev.flush()

				const accountSyncCounter = (authState.creds.accountSyncCounter || 0) + 1
				ev.emit('creds.update', { accountSyncCounter })
			}
		}

		await Promise.all([
			(async () => {
				if (shouldProcessHistoryMsg) {
					await doAppStateSync()
				}
			})(),
			processMessage(msg, {
				signalRepository,
				shouldProcessHistoryMsg,
				placeholderResendCache,
				ev,
				creds: authState.creds,
				keyStore: authState.keys,
				logger,
				options: config.options,
				getMessage
			})
		])

		// If the app state key arrives and we are waiting to sync, trigger the sync now.
		if (msg.message?.protocolMessage?.appStateSyncKeyShare && syncState === SyncState.Syncing) {
			logger.info('App state sync key arrived, triggering app state sync')
			await doAppStateSync()
		}
	})

	ws.on('CB:presence', (node: BinaryNode) => {
		handlePresenceUpdate(node).catch(err => onUnexpectedError(err, 'handling presence update'))
	})
	ws.on('CB:chatstate', (node: BinaryNode) => {
		handlePresenceUpdate(node).catch(err => onUnexpectedError(err, 'handling chatstate update'))
	})

	ws.on('CB:ib,,dirty', async (node: BinaryNode) => {
		const { attrs } = getBinaryNodeChild(node, 'dirty')!
		const type = attrs.type
		switch (type) {
			case 'account_sync':
				if (attrs.timestamp) {
					let { lastAccountSyncTimestamp } = authState.creds
					if (lastAccountSyncTimestamp) {
						await cleanDirtyBits('account_sync', lastAccountSyncTimestamp)
					}

					lastAccountSyncTimestamp = +attrs.timestamp
					ev.emit('creds.update', { lastAccountSyncTimestamp })
				}

				break
			case 'groups':
				// handled in groups.ts
				break
			default:
				logger.info({ node }, 'received unknown sync')
				break
		}
	})

	ev.on('connection.update', ({ connection, receivedPendingNotifications }) => {
		if (connection === 'open') {
			if (fireInitQueries) {
				executeInitQueries().catch(error => onUnexpectedError(error, 'init queries'))
			}

			sendPresenceUpdate(markOnlineOnConnect ? 'available' : 'unavailable').catch(error =>
				onUnexpectedError(error, 'presence update requests')
			)
		}

		// Clean up app state sync key cache on connection close
		if (connection === 'close') {
			blockedCollections.clear()
			clearTimeout(historySyncPausedTimeout)
			historySyncPausedTimeout = undefined
			appStateSyncKeyCache.clear()
			logger.debug('App state sync key cache cleared on connection close')
		}

		if (!receivedPendingNotifications || syncState !== SyncState.Connecting) {
			return
		}

		historySyncStatus.initialBootstrapComplete = false
		historySyncStatus.recentSyncComplete = false
		clearTimeout(historySyncPausedTimeout)
		historySyncPausedTimeout = undefined

		syncState = SyncState.AwaitingInitialSync
		logger.info('Connection is now AwaitingInitialSync, buffering events')
		ev.buffer()

		// On reconnections, app state was already synced in a previous session.
		// Skip the AwaitingInitialSync wait and go directly to Online so that
		// live incoming messages are not held in the buffer for up to 4 seconds.
		//
		// Two signals indicate a reconnect (either is sufficient):
		// 1. accountSyncCounter > 0  — at least one full sync completed before
		// 2. socketSkippedOfflineBuffer — socket.ts already determined this is a
		//    reconnect (e.g. stale routingInfo was cleared) and skipped the offline
		//    phase buffer. Keeping the second buffer active while the first was already
		//    skipped would cause a mismatch: events flow immediately then stall for 4s.
		const isReconnection = (authState.creds.accountSyncCounter ?? 0) > 0 || socketSkippedOfflineBuffer
		if (isReconnection) {
			logger.info(
				{ accountSyncCounter: authState.creds.accountSyncCounter, socketSkippedOfflineBuffer },
				'Reconnection detected, skipping AwaitingInitialSync wait. Transitioning to Online immediately.'
			)
			blockedCollections.clear()
			syncState = SyncState.Online
			const accountSyncCounter = (authState.creds.accountSyncCounter || 0) + 1
			ev.emit('creds.update', { accountSyncCounter })
			// Fire-and-forget: pick up patches missed during downtime (mute/archive/pin/read state).
			// Runs in background so live incoming messages are not blocked.
			resyncAppState(ALL_WA_PATCH_NAMES, true).catch(err =>
				logger.warn({ err }, 'Background app state resync failed (non-critical on reconnection)')
			)
			setTimeout(() => ev.flush(), 0)
			return
		}

		const willSyncHistory = shouldSyncHistoryMessage(
			proto.Message.HistorySyncNotification.create({
				syncType: proto.HistorySync.HistorySyncType.RECENT
			})
		)

		if (!willSyncHistory) {
			logger.info('History sync is disabled by config, not waiting for notification. Transitioning to Online.')
			syncState = SyncState.Online
			setTimeout(() => ev.flush(), 0)
			return
		}

		// perf(inbound-latency): reduced from 20s → 8s → 4s. On first connection we wait for
		// the history-sync notification so that doAppStateSync runs before live messages are
		// emitted.  If the notification does not arrive within 4s we stop waiting, go Online,
		// and flush so that any live message arriving after connection is never held more than 4s.
		// History that arrives late is still processed via processMessage regardless of state.
		// This 4s timeout fires before the event-buffer's own adaptive safety timer
		// (BAILEYS_BUFFER_TIMEOUT_MS defaults to 5s), ensuring the buffer cannot stall
		// beyond 4s on a first connect regardless of event rate.
		logger.info('First connection, awaiting history sync notification with a 4s timeout.')

		if (awaitingSyncTimeout) {
			clearTimeout(awaitingSyncTimeout)
		}

		awaitingSyncTimeout = setTimeout(() => {
			if (syncState === SyncState.AwaitingInitialSync) {
				logger.warn('Timeout in AwaitingInitialSync (2s), forcing state to Online and flushing buffer')
				syncState = SyncState.Online
				ev.flush()

				// Increment so subsequent reconnections skip the wait entirely.
				// Late-arriving history is still processed via processMessage
				// regardless of the state machine phase.
				const accountSyncCounter = (authState.creds.accountSyncCounter || 0) + 1
				ev.emit('creds.update', { accountSyncCounter })
			}
		}, 2_000)
	})

	// When an app state sync key arrives (myAppStateKeyId is set) and there are
	// collections blocked on a missing key, trigger a re-sync for just those collections.
	// This mirrors WA Web's Blocked → retry-on-key-arrival behavior.
	ev.on('creds.update', ({ myAppStateKeyId }) => {
		if (!myAppStateKeyId || blockedCollections.size === 0) {
			return
		}

		// If we're in the middle of a full sync, doAppStateSync handles all collections
		if (syncState === SyncState.Syncing) {
			blockedCollections.clear()
			return
		}

		const collections = [...blockedCollections] as WAPatchName[]
		blockedCollections.clear()

		logger.info({ collections }, 'app state sync key arrived, re-syncing blocked collections')
		resyncAppState(collections, false).catch(error => onUnexpectedError(error, 'blocked collections resync'))
	})

	ev.on('lid-mapping.update', async mappings => {
		try {
			const result = await signalRepository.lidMapping.storeLIDPNMappings(mappings)
			logger.debug(
				{ count: mappings.length, stored: result.stored, skipped: result.skipped, errors: result.errors },
				'stored LID-PN mappings from update event'
			)
			if (result.stored > 0) {
				logger.info(
					{ count: mappings.length, stored: result.stored },
					'fallback LID mappings are now available from update event'
				)
			}

			// Automatic chat merge: notify consumers about LID→PN mapping
			// This allows ZPRO and other consumers to merge/rename chats accordingly
			// Collect all merge notifications to emit in a single batch
			const mergeNotifications: ChatUpdate[] = []
			const mergedAt = Date.now()

			for (const mapping of mappings) {
				const lidUser = jidNormalizedUser(mapping.lid)
				const pnUser = jidNormalizedUser(mapping.pn)

				if (lidUser && pnUser && lidUser !== pnUser) {
					logger.debug({ lid: lidUser, pn: pnUser }, 'collected chat update for LID→PN merge notification')

					mergeNotifications.push({
						id: pnUser,
						merged: true,
						previousId: lidUser,
						mergedAt
					})
				}
			}

			// Emit single batch of merge notifications for better performance
			if (mergeNotifications.length > 0) {
				logger.debug({ count: mergeNotifications.length }, 'emitting batch of chat merge notifications')
				ev.emit('chats.update', mergeNotifications)
			}

			// Log warning if some mappings failed to store
			if (result.errors > 0) {
				logger.warn(
					{ errors: result.errors, total: mappings.length, notified: mergeNotifications.length },
					'some LID-PN mappings failed to store, but merge notifications were sent'
				)
			}
		} catch (error) {
			logger.warn({ count: mappings.length, error }, 'Failed to store LID-PN mappings')
		}
	})

	return {
		...sock,
		createCallLink,
		getBotListV2,
		messageMutex,
		receiptMutex,
		appStatePatchMutex,
		notificationMutex,
		fetchPrivacySettings,
		upsertMessage,
		appPatch,
		sendPresenceUpdate,
		presenceSubscribe,
		profilePictureUrl,
		fetchBlocklist,
		fetchStatus,
		fetchDisappearingDuration,
		updateProfilePicture,
		removeProfilePicture,
		updateProfileStatus,
		updateProfileName,
		updateBlockStatus,
		updateDisableLinkPreviewsPrivacy,
		updateCallPrivacy,
		updateMessagesPrivacy,
		updateLastSeenPrivacy,
		updateOnlinePrivacy,
		updateProfilePicturePrivacy,
		updateStatusPrivacy,
		updateReadReceiptsPrivacy,
		updateGroupsAddPrivacy,
		updateDefaultDisappearingMode,
		getBusinessProfile,
		resyncAppState,
		chatModify,
		cleanDirtyBits,
		addOrEditContact,
		removeContact,
		addLabel,
		addChatLabel,
		removeChatLabel,
		addMessageLabel,
		removeMessageLabel,
		star,
		addOrEditQuickReply,
		removeQuickReply
	}
}
