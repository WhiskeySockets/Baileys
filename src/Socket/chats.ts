import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto'
import { ALL_WA_PATCH_NAMES, ChatModification, ChatMutation, InitialReceivedChatsState, LTHashState, MessageUpsertType, PresenceData, SocketConfig, WABusinessHoursConfig, WABusinessProfile, WAMediaUpload, WAMessage, WAPatchCreate, WAPatchName, WAPresence } from '../Types'
import { chatModificationToAppPatch, debouncedTimeout, decodePatches, decodeSyncdSnapshot, encodeSyncdPatch, extractSyncdPatches, generateProfilePicture, isHistoryMsg, newLTHashState, processSyncAction } from '../Utils'
import { makeMutex } from '../Utils/make-mutex'
import processMessage from '../Utils/process-message'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, jidNormalizedUser, reduceBinaryNodeToDictionary, S_WHATSAPP_NET } from '../WABinary'
import { makeSocket } from './socket'

const MAX_SYNC_ATTEMPTS = 5

const APP_STATE_SYNC_TIMEOUT_MS = 10_000

export const makeChatsSocket = (config: SocketConfig) => {
	const { logger, markOnlineOnConnect, downloadHistory, fireInitQueries } = config
	const sock = makeSocket(config)
	const {
		ev,
		ws,
		authState,
		generateMessageTag,
		sendNode,
		query,
		onUnexpectedError,
	} = sock

	let privacySettings: { [_: string]: string } | undefined

	/** this mutex ensures that the notifications (receipts, messages etc.) are processed in order */
	const processingMutex = makeMutex()
	/** cache to ensure new history sync events do not have duplicate items */
	const historyCache = new Set<string>()
	let recvChats: InitialReceivedChatsState = { }

	const appStateSyncTimeout = debouncedTimeout(
		APP_STATE_SYNC_TIMEOUT_MS,
		async() => {
			if(ws.readyState === ws.OPEN) {
				logger.info(
					{ recvChats: Object.keys(recvChats).length },
					'doing initial app state sync'
				)
				await resyncMainAppState(recvChats)

				const accountSyncCounter = (authState.creds.accountSyncCounter || 0) + 1
				ev.emit('creds.update', { accountSyncCounter })
			} else {
				logger.warn('connection closed before app state sync')
			}

			historyCache.clear()
			recvChats = { }
		}
	)

	/** helper function to fetch the given app state sync key */
	const getAppStateSyncKey = async(keyId: string) => {
		const { [keyId]: key } = await authState.keys.get('app-state-sync-key', [keyId])
		return key
	}

	const fetchPrivacySettings = async(force: boolean = false) => {
		if(!privacySettings || force) {
			const { content } = await query({
				tag: 'iq',
				attrs: {
					xmlns: 'privacy',
					to: S_WHATSAPP_NET,
					type: 'get'
				},
				content: [
					{ tag: 'privacy', attrs: { } }
				]
			})
			privacySettings = reduceBinaryNodeToDictionary(content?.[0] as BinaryNode, 'category')
		}

		return privacySettings
	}

	/** helper function to run a generic IQ query */
	const interactiveQuery = async(userNodes: BinaryNode[], queryNode: BinaryNode) => {
		const result = await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'get',
				xmlns: 'usync',
			},
			content: [
				{
					tag: 'usync',
					attrs: {
						sid: generateMessageTag(),
						mode: 'query',
						last: 'true',
						index: '0',
						context: 'interactive',
					},
					content: [
						{
							tag: 'query',
							attrs: { },
							content: [ queryNode ]
						},
						{
							tag: 'list',
							attrs: { },
							content: userNodes
						}
					]
				}
			],
		})

		const usyncNode = getBinaryNodeChild(result, 'usync')
		const listNode = getBinaryNodeChild(usyncNode, 'list')
		const users = getBinaryNodeChildren(listNode, 'user')

		return users
	}

	const onWhatsApp = async(...jids: string[]) => {
		const results = await interactiveQuery(
			[
				{
					tag: 'user',
					attrs: { },
					content: jids.map(
						jid => ({
							tag: 'contact',
							attrs: { },
							content: `+${jid}`
						})
					)
				}
			],
			{ tag: 'contact', attrs: { } }
		)

		return results.map(user => {
			const contact = getBinaryNodeChild(user, 'contact')
			return { exists: contact?.attrs.type === 'in', jid: user.attrs.jid }
		}).filter(item => item.exists)
	}

	const fetchStatus = async(jid: string) => {
		const [result] = await interactiveQuery(
			[{ tag: 'user', attrs: { jid } }],
			{ tag: 'status', attrs: { } }
		)
		if(result) {
			const status = getBinaryNodeChild(result, 'status')
			return {
				status: status?.content!.toString(),
				setAt: new Date(+(status?.attrs.t || 0) * 1000)
			}
		}
	}

	/** update the profile picture for yourself or a group */
	const updateProfilePicture = async(jid: string, content: WAMediaUpload) => {
		const { img } = await generateProfilePicture(content)
		await query({
			tag: 'iq',
			attrs: {
				to: jidNormalizedUser(jid),
				type: 'set',
				xmlns: 'w:profile:picture'
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

	/** update the profile status for yourself */
	const updateProfileStatus = async(status: string) => {
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
					attrs: { },
					content: Buffer.from(status, 'utf-8')
				}
			]
		})
	}

	const updateProfileName = async(name: string) => {
		await chatModify({ pushNameSetting: name }, '')
	}

	const fetchBlocklist = async() => {
		const result = await query({
			tag: 'iq',
			attrs: {
				xmlns: 'blocklist',
				to: S_WHATSAPP_NET,
				type: 'get'
			}
		})

		const listNode = getBinaryNodeChild(result, 'list')
		return getBinaryNodeChildren(listNode, 'item')
			.map(n => n.attrs.jid)
	}

	const updateBlockStatus = async(jid: string, action: 'block' | 'unblock') => {
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
					attrs: {
						action,
						jid
					}
				}
			]
		})
	}

	const getBusinessProfile = async(jid: string): Promise<WABusinessProfile | void> => {
		const results = await query({
			tag: 'iq',
			attrs: {
				to: 's.whatsapp.net',
				xmlns: 'w:biz',
				type: 'get'
			},
			content: [{
				tag: 'business_profile',
				attrs: { v: '244' },
				content: [{
					tag: 'profile',
					attrs: { jid }
				}]
			}]
		})

		const profileNode = getBinaryNodeChild(results, 'business_profile')
		const profiles = getBinaryNodeChild(profileNode, 'profile')
		if(profiles) {
			const address = getBinaryNodeChild(profiles, 'address')
			const description = getBinaryNodeChild(profiles, 'description')
			const website = getBinaryNodeChild(profiles, 'website')
			const email = getBinaryNodeChild(profiles, 'email')
			const category = getBinaryNodeChild(getBinaryNodeChild(profiles, 'categories'), 'category')
			const business_hours = getBinaryNodeChild(profiles, 'business_hours')
			const business_hours_config = business_hours && getBinaryNodeChildren(business_hours, 'business_hours_config')
			const websiteStr = website?.content?.toString()
			return {
				wid: profiles.attrs?.jid,
				address: address?.content?.toString(),
				description: description?.content?.toString() || '',
				website: websiteStr ? [websiteStr] : [],
				email: email?.content?.toString(),
				category: category?.content?.toString(),
				business_hours: {
					timezone: business_hours?.attrs?.timezone,
					business_config: business_hours_config?.map(({ attrs }) => attrs as unknown as WABusinessHoursConfig)
				}
			}
		}
	}

	const updateAccountSyncTimestamp = async(fromTimestamp: number | string) => {
		logger.info({ fromTimestamp }, 'requesting account sync')
		await sendNode({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'set',
				xmlns: 'urn:xmpp:whatsapp:dirty',
				id: generateMessageTag(),
			},
			content: [
				{
					tag: 'clean',
					attrs: {
						type: 'account_sync',
						timestamp: fromTimestamp.toString(),
					}
				}
			]
		})
	}

	const newAppStateChunkHandler = (recvChats: InitialReceivedChatsState | undefined) => {
		return {
			onMutation(mutation: ChatMutation) {
				processSyncAction(
					mutation,
					ev,
					authState.creds.me!,
					recvChats ? { recvChats, accountSettings: authState.creds.accountSettings } : undefined,
					logger
				)
			}
		}
	}

	const resyncAppState = ev.createBufferedFunction(async(collections: readonly WAPatchName[], recvChats: InitialReceivedChatsState | undefined) => {
		const { onMutation } = newAppStateChunkHandler(recvChats)
		// we use this to determine which events to fire
		// otherwise when we resync from scratch -- all notifications will fire
		const initialVersionMap: { [T in WAPatchName]?: number } = { }

		await authState.keys.transaction(
			async() => {
				const collectionsToHandle = new Set<string>(collections)
				// in case something goes wrong -- ensure we don't enter a loop that cannot be exited from
				const attemptsMap = { } as { [T in WAPatchName]: number | undefined }
				// keep executing till all collections are done
				// sometimes a single patch request will not return all the patches (God knows why)
				// so we fetch till they're all done (this is determined by the "has_more_patches" flag)
				while(collectionsToHandle.size) {
					const states = { } as { [T in WAPatchName]: LTHashState }
					const nodes: BinaryNode[] = []

					for(const name of collectionsToHandle) {
						const result = await authState.keys.get('app-state-sync-version', [name])
						let state = result[name]

						if(state) {
							if(typeof initialVersionMap[name] === 'undefined') {
								initialVersionMap[name] = state.version
							}
						} else {
							state = newLTHashState()
						}

						states[name] = state

						logger.info(`resyncing ${name} from v${state.version}`)

						nodes.push({
							tag: 'collection',
							attrs:  {
								name,
								version: state.version.toString(),
								// return snapshot if being synced from scratch
								return_snapshot: (!state.version).toString()
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
								attrs: { },
								content: nodes
							}
						]
					})

					const decoded = await extractSyncdPatches(result) // extract from binary node
					for(const key in decoded) {
						const name = key as WAPatchName
						const { patches, hasMorePatches, snapshot } = decoded[name]
						try {
							if(snapshot) {
								const { state: newState } = await decodeSyncdSnapshot(name, snapshot, getAppStateSyncKey, initialVersionMap[name], onMutation)
								states[name] = newState

								logger.info(
									`restored state of ${name} from snapshot to v${newState.version} with mutations`
								)

								await authState.keys.set({ 'app-state-sync-version': { [name]: newState } })
							}

							// only process if there are syncd patches
							if(patches.length) {
								const { newMutations, state: newState } = await decodePatches(name, patches, states[name], getAppStateSyncKey, onMutation, initialVersionMap[name])

								await authState.keys.set({ 'app-state-sync-version': { [name]: newState } })

								logger.info(`synced ${name} to v${newState.version}`)
								if(newMutations.length) {
									logger.trace({ newMutations, name }, 'recv new mutations')
								}
							}

							if(hasMorePatches) {
								logger.info(`${name} has more patches...`)
							} else { // collection is done with sync
								collectionsToHandle.delete(name)
							}
						} catch(error) {
							// if retry attempts overshoot
							// or key not found
							const isIrrecoverableError = attemptsMap[name]! >= MAX_SYNC_ATTEMPTS || error.output?.statusCode === 404
							logger.info({ name, error: error.stack }, `failed to sync state from version${isIrrecoverableError ? '' : ', removing and trying from scratch'}`)
							await authState.keys.set({ 'app-state-sync-version': { [name]: null } })
							// increment number of retries
							attemptsMap[name] = (attemptsMap[name] || 0) + 1

							if(isIrrecoverableError) {
								// stop retrying
								collectionsToHandle.delete(name)
							}
						}
					}
				}
			}
		)
	})

	/**
     * fetch the profile picture of a user/group
     * type = "preview" for a low res picture
     * type = "image for the high res picture"
     */
	const profilePictureUrl = async(jid: string, type: 'preview' | 'image' = 'preview', timeoutMs?: number) => {
		jid = jidNormalizedUser(jid)
		const result = await query({
			tag: 'iq',
			attrs: {
				to: jid,
				type: 'get',
				xmlns: 'w:profile:picture'
			},
			content: [
				{ tag: 'picture', attrs: { type, query: 'url' } }
			]
		}, timeoutMs)
		const child = getBinaryNodeChild(result, 'picture')
		return child?.attrs?.url
	}

	const sendPresenceUpdate = async(type: WAPresence, toJid?: string) => {
		const me = authState.creds.me!
		if(type === 'available' || type === 'unavailable') {
			if(!me!.name) {
				logger.warn('no name present, ignoring presence update request...')
				return
			}

			ev.emit('connection.update', { isOnline: type === 'available' })

			await sendNode({
				tag: 'presence',
				attrs: {
					name: me!.name,
					type
				}
			})
		} else {
			await sendNode({
				tag: 'chatstate',
				attrs: {
					from: me!.id!,
					to: toJid!,
				},
				content: [
					{
						tag: type === 'recording' ? 'composing' : type,
						attrs: type === 'recording' ? { media : 'audio' } : {}
					}
				]
			})
		}
	}

	const presenceSubscribe = (toJid: string) => (
		sendNode({
			tag: 'presence',
			attrs: {
				to: toJid,
				id: generateMessageTag(),
				type: 'subscribe'
			}
		})
	)

	const handlePresenceUpdate = ({ tag, attrs, content }: BinaryNode) => {
		let presence: PresenceData | undefined
		const jid = attrs.from
		const participant = attrs.participant || attrs.from
		if(tag === 'presence') {
			presence = {
				lastKnownPresence: attrs.type === 'unavailable' ? 'unavailable' : 'available',
				lastSeen: attrs.last && attrs.last !== 'deny' ? +attrs.last : undefined
			}
		} else if(Array.isArray(content)) {
			const [firstChild] = content
			let type = firstChild.tag as WAPresence
			if(type === 'paused') {
				type = 'available'
			}

			if(firstChild.attrs?.media === 'audio') {
				type = 'recording'
			}

			presence = { lastKnownPresence: type }
		} else {
			logger.error({ tag, attrs, content }, 'recv invalid presence node')
		}

		if(presence) {
			ev.emit('presence.update', { id: jid, presences: { [participant]: presence } })
		}
	}

	const resyncMainAppState = async(ctx?: InitialReceivedChatsState) => {
		logger.debug('resyncing main app state')

		await (
			processingMutex.mutex(
				() => resyncAppState(ALL_WA_PATCH_NAMES, ctx)
			)
				.catch(err => (
					onUnexpectedError(err, 'main app sync')
				))
		)
	}

	const appPatch = async(patchCreate: WAPatchCreate) => {
		const name = patchCreate.type
		const myAppStateKeyId = authState.creds.myAppStateKeyId
		if(!myAppStateKeyId) {
			throw new Boom('App state key not present!', { statusCode: 400 })
		}

		let initial: LTHashState
		let encodeResult: { patch: proto.ISyncdPatch, state: LTHashState }

		await processingMutex.mutex(
			async() => {
				await authState.keys.transaction(
					async() => {
						logger.debug({ patch: patchCreate }, 'applying app patch')

						await resyncAppState([name], undefined)

						const { [name]: currentSyncVersion } = await authState.keys.get('app-state-sync-version', [name])
						initial = currentSyncVersion || newLTHashState()

						encodeResult = await encodeSyncdPatch(
							patchCreate,
							myAppStateKeyId,
							initial,
							getAppStateSyncKey,
						)
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
									attrs: { },
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
													attrs: { },
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
					}
				)
			}
		)

		if(config.emitOwnEvents) {
			const { onMutation } = newAppStateChunkHandler(undefined)
			await decodePatches(
				name,
				[{ ...encodeResult!.patch, version: { version: encodeResult!.state.version }, }],
				initial!,
				getAppStateSyncKey,
				onMutation,
				undefined,
				logger,
			)
		}
	}

	/** sending abt props may fix QR scan fail if server expects */
	const fetchAbt = async() => {
		const abtNode = await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				xmlns: 'abt',
				type: 'get',
			},
			content: [
				{ tag: 'props', attrs: { protocol: '1' } }
			]
		})

		const propsNode = getBinaryNodeChild(abtNode, 'props')

		let props: { [_: string]: string } = { }
		if(propsNode) {
			props = reduceBinaryNodeToDictionary(propsNode, 'prop')
		}

		logger.debug('fetched abt')

		return props
	}

	/** sending non-abt props may fix QR scan fail if server expects */
	const fetchProps = async() => {
		const resultNode = await query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				xmlns: 'w',
				type: 'get',
			},
			content: [
				{ tag: 'props', attrs: { } }
			]
		})

		const propsNode = getBinaryNodeChild(resultNode, 'props')

		let props: { [_: string]: string } = { }
		if(propsNode) {
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
	 * queries need to be fired on connection open
	 * help ensure parity with WA Web
	 * */
	const executeInitQueries = async() => {
		await Promise.all([
			fetchAbt(),
			fetchProps(),
			fetchBlocklist(),
			fetchPrivacySettings(),
		])
	}

	const upsertMessage = ev.createBufferedFunction(async(msg: WAMessage, type: MessageUpsertType) => {
		ev.emit('messages.upsert', { messages: [msg], type })

		if(!!msg.pushName) {
			let jid = msg.key.fromMe ? authState.creds.me!.id : (msg.key.participant || msg.key.remoteJid)
			jid = jidNormalizedUser(jid!)

			if(!msg.key.fromMe) {
				ev.emit('contacts.update', [{ id: jid, notify: msg.pushName, verifiedName: msg.verifiedBizName! }])
			}

			// update our pushname too
			if(msg.key.fromMe && authState.creds.me?.name !== msg.pushName) {
				ev.emit('creds.update', { me: { ...authState.creds.me!, name: msg.pushName! } })
			}
		}

		// process message and emit events
		await processMessage(
			msg,
			{
				downloadHistory,
				ev,
				historyCache,
				recvChats,
				creds: authState.creds,
				keyStore: authState.keys,
				logger,
			}
		)

		const isAnyHistoryMsg = isHistoryMsg(msg.message!)
		if(isAnyHistoryMsg) {
			// we only want to sync app state once we've all the history
			// restart the app state sync timeout
			logger.debug('restarting app sync timeout')
			appStateSyncTimeout.start()
		}
	})

	ws.on('CB:presence', handlePresenceUpdate)
	ws.on('CB:chatstate', handlePresenceUpdate)

	ws.on('CB:ib,,dirty', async(node: BinaryNode) => {
		const { attrs } = getBinaryNodeChild(node, 'dirty')!
		const type = attrs.type
		switch (type) {
		case 'account_sync':
			if(attrs.timestamp) {
				let { lastAccountSyncTimestamp } = authState.creds
				if(lastAccountSyncTimestamp) {
					await updateAccountSyncTimestamp(lastAccountSyncTimestamp)
				}

				lastAccountSyncTimestamp = +attrs.timestamp
				ev.emit('creds.update', { lastAccountSyncTimestamp })
			}

			break
		default:
			logger.info({ node }, 'received unknown sync')
			break
		}
	})

	ev.on('connection.update', ({ connection }) => {
		if(connection === 'open') {
			if(fireInitQueries) {
				executeInitQueries()
					.catch(
						error => onUnexpectedError(error, 'init queries')
					)
			}

			sendPresenceUpdate(markOnlineOnConnect ? 'available' : 'unavailable')
				.catch(
					error => onUnexpectedError(error, 'presence update requests')
				)
		}
	})

	return {
		...sock,
		processingMutex,
		fetchPrivacySettings,
		upsertMessage,
		appPatch,
		sendPresenceUpdate,
		presenceSubscribe,
		profilePictureUrl,
		onWhatsApp,
		fetchBlocklist,
		fetchStatus,
		updateProfilePicture,
		updateProfileStatus,
		updateProfileName,
		updateBlockStatus,
		getBusinessProfile,
		resyncAppState,
		chatModify,
		resyncMainAppState,
	}
}
