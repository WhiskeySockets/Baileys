import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto'
import { PROCESSABLE_HISTORY_TYPES } from '../Defaults'
import { ALL_WA_PATCH_NAMES, ChatModification, ChatMutation, LTHashState, MessageUpsertType, PresenceData, SocketConfig, WABusinessHoursConfig, WABusinessProfile, WAMediaUpload, WAMessage, WAPatchCreate, WAPatchName, WAPresence } from '../Types'
import { chatModificationToAppPatch, ChatMutationMap, decodePatches, decodeSyncdSnapshot, encodeSyncdPatch, extractSyncdPatches, generateProfilePicture, getHistoryMsg, newLTHashState, processSyncAction } from '../Utils'
import logger from '../Utils/logger'
import { makeMutex } from '../Utils/make-mutex'
import processMessage from '../Utils/process-message'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, jidNormalizedUser, reduceBinaryNodeToDictionary, S_WHATSAPP_NET } from '../WABinary'
import { Socket } from './socket'

const MAX_SYNC_ATTEMPTS = 2

export class Chats extends Socket {
	privacySettings: { [_: string]: string } | undefined
	needToFlushWithAppStateSync = false
	pendingAppStateSync = false
	/** this mutex ensures that the notifications (receipts, messages etc.) are processed in order */
	processingMutex = makeMutex()

	constructor(config: SocketConfig) {
		super(config)
	}

	/** helper function to fetch the given app state sync key */
	getAppStateSyncKey = async(keyId: string) => {
		const { [keyId]: key } = await this.authState.keys.get('app-state-sync-key', [keyId])
		return key
	}

	fetchPrivacySettings = async(force: boolean = false) => {
		if(!this.privacySettings || force) {
			const { content } = await this.query({
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
			this.privacySettings = reduceBinaryNodeToDictionary(content?.[0] as BinaryNode, 'category')
		}

		return this.privacySettings
	}

	/** helper function to run a generic IQ query */
	interactiveQuery = async(userNodes: BinaryNode[], queryNode: BinaryNode) => {
		const result = await this.query({
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
						sid: this.generateMessageTag(),
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

	onWhatsApp = async(...jids: string[]) => {
		const results = await this.interactiveQuery(
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

	fetchStatus = async(jid: string) => {
		const [result] = await this.interactiveQuery(
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
	updateProfilePicture = async(jid: string, content: WAMediaUpload) => {
		const { img } = await generateProfilePicture(content)
		await this.query({
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
	updateProfileStatus = async(status: string) => {
		await this.query({
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

	updateProfileName = async(name: string) => {
		await this.chatModify({ pushNameSetting: name }, '')
	}

	fetchBlocklist = async() => {
		const result = await this.query({
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

	updateBlockStatus = async(jid: string, action: 'block' | 'unblock') => {
		await this.query({
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

	getBusinessProfile = async(jid: string): Promise<WABusinessProfile | void> => {
		const results = await this.query({
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

	updateAccountSyncTimestamp = async(fromTimestamp: number | string) => {
		logger.info({ fromTimestamp }, 'requesting account sync')
		await this.sendNode({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'set',
				xmlns: 'urn:xmpp:whatsapp:dirty',
				id: this.generateMessageTag(),
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

	newAppStateChunkHandler = (isInitialSync: boolean) => {
		return {
			onMutation: (mutation: ChatMutation) => {
				processSyncAction(
					mutation,
					this.ev,
					this.authState.creds.me!,
					isInitialSync ? { accountSettings: this.authState.creds.accountSettings } : undefined,
					logger
				)
			}
		}
	}

	resyncAppState = this.ev.createBufferedFunction(async(collections: readonly WAPatchName[], isInitialSync: boolean) => {
		// we use this to determine which events to fire
		// otherwise when we resync from scratch -- all notifications will fire
		const initialVersionMap: { [T in WAPatchName]?: number } = { }
		const globalMutationMap: ChatMutationMap = { }

		await this.keys.transaction(
			async() => {
				const collectionsToHandle = new Set<string>(collections)
				// in case something goes wrong -- ensure we don't enter a loop that cannot be exited from
				const attemptsMap: { [T in WAPatchName]?: number } = { }
				// keep executing till all collections are done
				// sometimes a single patch request will not return all the patches (God knows why)
				// so we fetch till they're all done (this is determined by the "has_more_patches" flag)
				while(collectionsToHandle.size) {
					const states = { } as { [T in WAPatchName]: LTHashState }
					const nodes: BinaryNode[] = []

					for(const name of collectionsToHandle) {
						const result = await this.authState.keys.get('app-state-sync-version', [name])
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

					const result = await this.query({
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

					// extract from binary node
					const decoded = await extractSyncdPatches(result, this.config?.options)
					for(const key in decoded) {
						const name = key as WAPatchName
						const { patches, hasMorePatches, snapshot } = decoded[name]
						try {
							if(snapshot) {
								const { state: newState, mutationMap } = await decodeSyncdSnapshot(
									name,
									snapshot,
									this.getAppStateSyncKey,
									initialVersionMap[name],
									this.config.appStateMacVerification.snapshot
								)
								states[name] = newState
								Object.assign(globalMutationMap, mutationMap)

								logger.info(`restored state of ${name} from snapshot to v${newState.version} with mutations`)

								await this.authState.keys.set({ 'app-state-sync-version': { [name]: newState } })
							}

							// only process if there are syncd patches
							if(patches.length) {
								const { state: newState, mutationMap } = await decodePatches(
									name,
									patches,
									states[name],
									this.getAppStateSyncKey,
									this.config.options,
									initialVersionMap[name],
									logger,
									this.config.appStateMacVerification.patch
								)

								await this.authState.keys.set({ 'app-state-sync-version': { [name]: newState } })

								logger.info(`synced ${name} to v${newState.version}`)
								initialVersionMap[name] = newState.version

								Object.assign(globalMutationMap, mutationMap)
							}

							if(hasMorePatches) {
								logger.info(`${name} has more patches...`)
							} else { // collection is done with sync
								collectionsToHandle.delete(name)
							}
						} catch(error) {
							// if retry attempts overshoot
							// or key not found
							const isIrrecoverableError = attemptsMap[name]! >= MAX_SYNC_ATTEMPTS
								|| error.output?.statusCode === 404
								|| error.name === 'TypeError'
							logger.info(
								{ name, error: error.stack },
								`failed to sync state from version${isIrrecoverableError ? '' : ', removing and trying from scratch'}`
							)
							await this.authState.keys.set({ 'app-state-sync-version': { [name]: null } })
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

		const { onMutation } = this.newAppStateChunkHandler(isInitialSync)
		for(const key in globalMutationMap) {
			onMutation(globalMutationMap[key])
		}
	})

	/**
     * fetch the profile picture of a user/group
     * type = "preview" for a low res picture
     * type = "image for the high res picture"
     */
	profilePictureUrl = async(jid: string, type: 'preview' | 'image' = 'preview', timeoutMs?: number) => {
		jid = jidNormalizedUser(jid)
		const result = await this.query({
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

	sendPresenceUpdate = async(type: WAPresence, toJid?: string) => {
		const me = this.authState.creds.me!
		if(type === 'available' || type === 'unavailable') {
			if(!me!.name) {
				logger.warn('no name present, ignoring presence update request...')
				return
			}

			this.ev.emit('connection.update', { isOnline: type === 'available' })

			await this.sendNode({
				tag: 'presence',
				attrs: {
					name: me!.name,
					type
				}
			})
		} else {
			await this.sendNode({
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

	/**
	 * @param toJid the jid to subscribe to
	 * @param tcToken token for subscription, use if present
	 */
	presenceSubscribe = (toJid: string, tcToken?: Buffer) => (
		this.sendNode({
			tag: 'presence',
			attrs: {
				to: toJid,
				id: this.generateMessageTag(),
				type: 'subscribe'
			},
			content: tcToken
				? [
					{
						tag: 'tctoken',
						attrs: { },
						content: tcToken
					}
				]
				: undefined
		})
	)

	handlePresenceUpdate = ({ tag, attrs, content }: BinaryNode) => {
		let presence: PresenceData | undefined
		const jid = attrs.from
		const participant = attrs.participant || attrs.from

		if(this.config.shouldIgnoreJid(jid)) {
			return
		}

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
			this.ev.emit('presence.update', { id: jid, presences: { [participant]: presence } })
		}
	}

	appPatch = async(patchCreate: WAPatchCreate) => {
		const name = patchCreate.type
		const myAppStateKeyId = this.authState.creds.myAppStateKeyId
		if(!myAppStateKeyId) {
			throw new Boom('App state key not present!', { statusCode: 400 })
		}

		let initial: LTHashState
		let encodeResult: { patch: proto.ISyncdPatch, state: LTHashState }

		await this.processingMutex.mutex(
			async() => {
				await this.keys.transaction(
					async() => {
						logger.debug({ patch: patchCreate }, 'applying app patch')

						await this.resyncAppState([name], false)

						const { [name]: currentSyncVersion } = await this.authState.keys.get('app-state-sync-version', [name])
						initial = currentSyncVersion || newLTHashState()

						encodeResult = await encodeSyncdPatch(
							patchCreate,
							myAppStateKeyId,
							initial,
							this.getAppStateSyncKey,
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
						await this.query(node)

						await this.authState.keys.set({ 'app-state-sync-version': { [name]: state } })
					}
				)
			}
		)

		if(this.config.emitOwnEvents) {
			const { onMutation } = this.newAppStateChunkHandler(false)
			const { mutationMap } = await decodePatches(
				name,
				[{ ...encodeResult!.patch, version: { version: encodeResult!.state.version }, }],
				initial!,
				this.getAppStateSyncKey,
				this.config.options,
				undefined,
				logger,
			)
			for(const key in mutationMap) {
				onMutation(mutationMap[key])
			}
		}
	}

	/** sending abt props may fix QR scan fail if server expects */
	fetchAbt = async() => {
		const abtNode = await this.query({
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
	fetchProps = async() => {
		const resultNode = await this.query({
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
	chatModify = (mod: ChatModification, jid: string) => {
		const patch = chatModificationToAppPatch(mod, jid)
		return this.appPatch(patch)
	}

	/**
	 * queries need to be fired on connection open
	 * help ensure parity with WA Web
	 * */
	executeInitQueries = async() => {
		await Promise.all([
			this.fetchAbt(),
			this.fetchProps(),
			this.fetchBlocklist(),
			this.fetchPrivacySettings(),
		])
	}

	upsertMessage = this.ev.createBufferedFunction(async(msg: WAMessage, type: MessageUpsertType) => {
		this.ev.emit('messages.upsert', { messages: [msg], type })

		if(!!msg.pushName) {
			let jid = msg.key.fromMe ? this.authState.creds.me!.id : (msg.key.participant || msg.key.remoteJid)
			jid = jidNormalizedUser(jid!)

			if(!msg.key.fromMe) {
				this.ev.emit('contacts.update', [{ id: jid, notify: msg.pushName, verifiedName: msg.verifiedBizName! }])
			}

			// update our pushname too
			if(msg.key.fromMe && msg.pushName && this.authState.creds.me?.name !== msg.pushName) {
				this.ev.emit('creds.update', { me: { ...this.authState.creds.me!, name: msg.pushName! } })
			}
		}

		const historyMsg = getHistoryMsg(msg.message!)
		const shouldProcessHistoryMsg = historyMsg
			? (
				this.config.shouldSyncHistoryMessage(historyMsg)
				&& PROCESSABLE_HISTORY_TYPES.includes(historyMsg.syncType!)
			)
			: false

		if(historyMsg && !this.authState.creds.myAppStateKeyId) {
			logger.warn('skipping app state sync, as myAppStateKeyId is not set')
			this.pendingAppStateSync = true
		}

		await Promise.all([
			(async() => {
				if(
					historyMsg
					&& this.authState.creds.myAppStateKeyId
				) {
					this.pendingAppStateSync = false
					await this.doAppStateSync()
				}
			})(),
			processMessage(
				msg,
				{
					shouldProcessHistoryMsg,
					ev: this.ev,
					creds: this.authState.creds,
					keyStore: this.keys,
					logger,
					options: this.config.options,
				}
			)
		])

		if(
			msg.message?.protocolMessage?.appStateSyncKeyShare
			&& this.pendingAppStateSync
		) {
			await this.doAppStateSync()
			this.pendingAppStateSync = false
		}
	})

	async doAppStateSync() {
		if(!this.authState.creds.accountSyncCounter) {
			logger.info('doing initial app state sync')
			await this.resyncAppState(ALL_WA_PATCH_NAMES, true)

			const accountSyncCounter = (this.authState.creds.accountSyncCounter || 0) + 1
			this.ev.emit('creds.update', { accountSyncCounter })

			if(this.needToFlushWithAppStateSync) {
				logger.debug('flushing with app state sync')
				this.ev.flush()
			}
		}
	}

	override init() {
		super.init()
		this.ws.on('CB:presence', this.handlePresenceUpdate)
		this.ws.on('CB:chatstate', this.handlePresenceUpdate)

		this.ws.on('CB:ib,,dirty', async(node: BinaryNode) => {
			const { attrs } = getBinaryNodeChild(node, 'dirty')!
			const type = attrs.type
			switch (type) {
			case 'account_sync':
				if(attrs.timestamp) {
					let { lastAccountSyncTimestamp } = this.authState.creds
					if(lastAccountSyncTimestamp) {
						await this.updateAccountSyncTimestamp(lastAccountSyncTimestamp)
					}

					lastAccountSyncTimestamp = +attrs.timestamp
					this.ev.emit('creds.update', { lastAccountSyncTimestamp })
				}

				break
			default:
				logger.info({ node }, 'received unknown sync')
				break
			}
		})

		this.ev.on('connection.update', ({ connection, receivedPendingNotifications }) => {
			if(connection === 'open') {
				if(this.config.fireInitQueries) {
					this.executeInitQueries()
						.catch(
							error => this.onUnexpectedError(error, 'init queries')
						)
				}

				this.sendPresenceUpdate(this.config.markOnlineOnConnect ? 'available' : 'unavailable')
					.catch(
						error => this.onUnexpectedError(error, 'presence update requests')
					)
			}

			if(receivedPendingNotifications) {
				// if we don't have the app state key
				// we keep buffering events until we finally have
				// the key and can sync the messages
				if(!this.authState.creds?.myAppStateKeyId) {
					this.ev.buffer()
					this.needToFlushWithAppStateSync = true
				}
			}
		})
	}

}
