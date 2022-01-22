import { BaileysEventMap, Chat, ChatModification, Contact, LegacySocketConfig, PresenceData, WABusinessProfile, WAFlag, WAMessageKey, WAMessageUpdate, WAMetric, WAPresence } from '../Types'
import { debouncedTimeout, unixTimestampSeconds } from '../Utils/generics'
import { BinaryNode, jidNormalizedUser } from '../WABinary'
import makeAuthSocket from './auth'

const makeChatsSocket = (config: LegacySocketConfig) => {
	const { logger } = config
	const sock = makeAuthSocket(config)
	const { 
		ev, 
		ws: socketEvents,
		currentEpoch,
		setQuery,
		query, 
		sendNode,
		state
	} = sock

	const chatsDebounceTimeout = debouncedTimeout(10_000, () => sendChatsQuery(1))

	const sendChatsQuery = (epoch: number) => (
		sendNode({
			json: {
				tag: 'query',
				attrs: { type: 'chat', epoch: epoch.toString() }
			},
			binaryTag: [ WAMetric.queryChat, WAFlag.ignore ]
		})
	)

	const profilePictureUrl = async(jid: string, timeoutMs?: number) => {
		const response = await query({ 
			json: ['query', 'ProfilePicThumb', jid], 
			expect200: false, 
			requiresPhoneConnection: false,
			timeoutMs
		})
		return response.eurl as string | undefined
	}

	const executeChatModification = (node: BinaryNode) => {
		const { attrs: attributes } = node
		const updateType = attributes.type
		const jid = jidNormalizedUser(attributes?.jid)

		switch (updateType) {
		case 'delete':
			ev.emit('chats.delete', [jid])
			break
		case 'clear':
			if(node.content) {
				const ids = (node.content as BinaryNode[]).map(
					({ attrs }) => attrs.index
				)
				ev.emit('messages.delete', { keys: ids.map(id => ({ id, remoteJid: jid })) })
			} else {
				ev.emit('messages.delete', { jid, all: true })
			}

			break
		case 'archive':
			ev.emit('chats.update', [ { id: jid, archive: true } ])
			break
		case 'unarchive':
			ev.emit('chats.update', [ { id: jid, archive: false } ])
			break
		case 'pin':
			ev.emit('chats.update', [ { id: jid, pin: attributes.pin ? +attributes.pin : null } ])
			break
		case 'star':
		case 'unstar':
			const starred = updateType === 'star'
			const updates: WAMessageUpdate[] = (node.content as BinaryNode[]).map(
				({ attrs }) => ({ 
					key: {
						remoteJid: jid, 
						id: attrs.index, 
						fromMe: attrs.owner === 'true' 
					},
					update: { starred }
				})
			)
			ev.emit('messages.update', updates)
			break
		case 'mute':
			if(attributes.mute === '0') {
				ev.emit('chats.update', [{ id: jid, mute: null }])
			} else {
				ev.emit('chats.update', [{ id: jid, mute: +attributes.mute }])
			}

			break
		default:
			logger.warn({ node }, 'received unrecognized chat update')
			break
		}     
	}

	const applyingPresenceUpdate = (update: BinaryNode['attrs']): BaileysEventMap<any>['presence.update'] => {
		const id = jidNormalizedUser(update.id)
		const participant = jidNormalizedUser(update.participant || update.id)
        
		const presence: PresenceData = {
			lastSeen: update.t ? +update.t : undefined,
			lastKnownPresence: update.type as WAPresence
		}
		return { id, presences: { [participant]: presence } }
	}

	const chatRead = async(fromMessage: WAMessageKey, count: number) => {
		await setQuery (
			[
				{ 
					tag: 'read',
					attrs: { 
						jid: fromMessage.remoteJid, 
						count: count.toString(), 
						index: fromMessage.id, 
						owner: fromMessage.fromMe ? 'true' : 'false'
					}
				}
			], 
			[ WAMetric.read, WAFlag.ignore ]
		)
		if(config.emitOwnEvents) {
			ev.emit('chats.update', [{ id: fromMessage.remoteJid, unreadCount: count < 0 ? -1 : 0 }])
		}	
	}

	ev.on('connection.update', async({ connection }) => {
		if(connection !== 'open') {
			return
		}

		try {
			await Promise.all([
				sendNode({
					json: { tag: 'query', attrs: { type: 'contacts', epoch: '1' } },
					binaryTag: [ WAMetric.queryContact, WAFlag.ignore ]
				}),
				sendNode({
					json: { tag: 'query', attrs: { type: 'status', epoch: '1' } },
					binaryTag: [ WAMetric.queryStatus, WAFlag.ignore ]
				}),
				sendNode({
					json: { tag: 'query', attrs: { type: 'quick_reply', epoch: '1' } }, 
					binaryTag: [ WAMetric.queryQuickReply, WAFlag.ignore ]
				}),
				sendNode({
					json: { tag: 'query', attrs: { type: 'label', epoch: '1' } },
					binaryTag: [ WAMetric.queryLabel, WAFlag.ignore ]
				}),
				sendNode({
					json: { tag: 'query', attrs: { type: 'emoji', epoch: '1' } },
					binaryTag: [ WAMetric.queryEmoji, WAFlag.ignore ] 
				}),
				sendNode({
					json: { 
						tag: 'action', 
						attrs: { type: 'set', epoch: '1' },
						content: [
							{ tag: 'presence', attrs: { type: 'available' } }
						]
					}, 
					binaryTag: [ WAMetric.presence, WAFlag.available ]
				})
			])
			chatsDebounceTimeout.start()
	
			logger.debug('sent init queries')
		} catch(error) {
			logger.error(`error in sending init queries: ${error}`)
		}
	})
	socketEvents.on('CB:response,type:chat', async({ content: data }: BinaryNode) => {
		chatsDebounceTimeout.cancel()
		if(Array.isArray(data)) {
			const contacts: Contact[] = []
			const chats = data.map(({ attrs }): Chat => {
				const id = jidNormalizedUser(attrs.jid)
				if(attrs.name) {
					contacts.push({ id, name: attrs.name })
				}

				return {
					id: jidNormalizedUser(attrs.jid),
					conversationTimestamp: attrs.t ? +attrs.t : undefined,
					unreadCount: +attrs.count,
					archive: attrs.archive === 'true' ? true : undefined,
					pin: attrs.pin ? +attrs.pin : undefined,
					mute: attrs.mute ? +attrs.mute : undefined,
					notSpam: !(attrs.spam === 'true'),
					name: attrs.name,
					ephemeralExpiration: attrs.ephemeral ? +attrs.ephemeral : undefined,
					ephemeralSettingTimestamp: attrs.eph_setting_ts ? +attrs.eph_setting_ts : undefined,
					readOnly: attrs.read_only === 'true' ? true : undefined,
				}
			})

			logger.info(`got ${chats.length} chats, extracted ${contacts.length} contacts with name`)
			ev.emit('chats.set', { chats, isLatest: true })
		}
	})
	// got all contacts from phone
	socketEvents.on('CB:response,type:contacts', async({ content: data }: BinaryNode) => {
		if(Array.isArray(data)) {
			const contacts = data.map(({ attrs }): Contact => {
				return {
					id: jidNormalizedUser(attrs.jid),
					name: attrs.name,
					notify: attrs.notify,
					verifiedName: attrs.verify === '2' ? attrs.vname : undefined
				}
			})

			logger.info(`got ${contacts.length} contacts`)
			ev.emit('contacts.set', { contacts })
		}
	})
	// status updates
	socketEvents.on('CB:Status,status', json => {
		const id = jidNormalizedUser(json[1].id)
		ev.emit('contacts.update', [ { id, status: json[1].status } ])
	})
	// User Profile Name Updates
	socketEvents.on('CB:Conn,pushname', json => {
		const { legacy: { user }, connection } = state
		if(connection === 'open' && json[1].pushname !== user.name) {
			user.name = json[1].pushname
			ev.emit('connection.update', { legacy: { ...state.legacy, user } })
		}
	})
	// read updates
	socketEvents.on ('CB:action,,read', async({ content }: BinaryNode) => {
		if(Array.isArray(content)) {
			const { attrs } = content[0]

			const update: Partial<Chat> = {
				id: jidNormalizedUser(attrs.jid)
			}
			if(attrs.type === 'false') {
				update.unreadCount = -1
			} else {
				update.unreadCount = 0
			}

			ev.emit('chats.update', [update])
		}
	}) 

	socketEvents.on('CB:Cmd,type:picture', async json => {
		json = json[1]
		const id = jidNormalizedUser(json.jid)
		const imgUrl = await profilePictureUrl(id).catch(() => '')
		
		ev.emit('contacts.update', [ { id, imgUrl } ])
	})
	
	// chat archive, pin etc.
	socketEvents.on('CB:action,,chat', ({ content }: BinaryNode) => {
		if(Array.isArray(content)) {
			const [node] = content
			executeChatModification(node)
		}
	})

	socketEvents.on('CB:action,,user', (json: BinaryNode) => {
		if(Array.isArray(json.content)) {
			const user = json.content[0].attrs
			if(user.id) {
				user.id = jidNormalizedUser(user.id)
			
				//ev.emit('contacts.upsert', [user])
			} else {
				logger.warn({ json }, 'recv unknown action')
			}
		}
	})

	// presence updates
	socketEvents.on('CB:Presence', json => {
		const update = applyingPresenceUpdate(json[1])
		ev.emit('presence.update', update)
	})

	// blocklist updates
	socketEvents.on('CB:Blocklist', json => {
		json = json[1]
		const blocklist = json.blocklist
		ev.emit('blocklist.set', { blocklist })
	})

	socketEvents.on('ws-close', () => {
		chatsDebounceTimeout.cancel()
	})

	return {
		...sock,
		sendChatsQuery,
		profilePictureUrl,
		chatRead,
		/**
		 * Modify a given chat (archive, pin etc.)
		 * @param jid the ID of the person/group you are modifiying
		 */
		chatModify: async(modification: ChatModification, jid: string, chatInfo: Pick<Chat, 'mute' | 'pin'>, timestampNow?: number) => {	 
			const chatAttrs: BinaryNode['attrs'] = { jid: jid }
			let data: BinaryNode[] | undefined = undefined

			timestampNow = timestampNow || unixTimestampSeconds()

			if('archive' in modification) {
				chatAttrs.type = modification.archive ? 'archive' : 'unarchive'
			} else if('pin' in modification) {
				chatAttrs.type = 'pin'
				if(modification.pin) {
					chatAttrs.pin = timestampNow.toString()
				} else {
					chatAttrs.previous = chatInfo.pin!.toString()
				}
			} else if('mute' in modification) {
				chatAttrs.type = 'mute'
				if(modification.mute) {
					chatAttrs.mute = (timestampNow + modification.mute).toString()
				} else {
					chatAttrs.previous = chatInfo.mute!.toString()
				}
			} else if('clear' in modification) {
				chatAttrs.type = 'clear'
				chatAttrs.modify_tag = Math.round(Math.random()*1000000).toString()
				if(modification.clear !== 'all') {
					data = modification.clear.messages.map(({ id, fromMe }) => (
						{ 
							tag: 'item',
							attrs: { owner: (!!fromMe).toString(), index: id }
						}
					))
				}
			} else if('star' in modification) {
				chatAttrs.type = modification.star.star ? 'star' : 'unstar'
				data = modification.star.messages.map(({ id, fromMe }) => (
					{ 
						tag: 'item',
						attrs: { owner: (!!fromMe).toString(), index: id }
					}
				))
			} else if('markRead' in modification) {
				const indexKey = modification.lastMessages[modification.lastMessages.length-1].key
				return chatRead(indexKey, modification.markRead ? 0 : -1)
			} else if('delete' in modification) {
				chatAttrs.type = 'delete'
			}

			if('lastMessages' in modification) {
				const indexKey = modification.lastMessages[modification.lastMessages.length-1].key
				if(indexKey) {
					chatAttrs.index = indexKey.id
					chatAttrs.owner = indexKey.fromMe ? 'true' : 'false'
				}
			}

			const node = { tag: 'chat', attrs: chatAttrs, content: data }
			const response = await setQuery([node], [ WAMetric.chat, WAFlag.ignore ])
			if(config.emitOwnEvents) {
				// apply it and emit events
				executeChatModification(node)
			}

			return response
		},
		/** 
		 * Query whether a given number is registered on WhatsApp
		 * @param str phone number/jid you want to check for
		 * @returns undefined if the number doesn't exists, otherwise the correctly formatted jid
		 */
		onWhatsApp: async(str: string) => {
			const { status, jid, biz } = await query({
				json: ['query', 'exist', str], 
				requiresPhoneConnection: false
			})
			if(status === 200) {
				return { 
					exists: true, 
					jid: jidNormalizedUser(jid), 
					isBusiness: biz as boolean
				}
			}
		},
		/**
		 * Tell someone about your presence -- online, typing, offline etc.
		 * @param jid the ID of the person/group who you are updating
		 * @param type your presence
		 */
		sendPresenceUpdate: (type: WAPresence, jid: string | undefined) => (
			sendNode({
				binaryTag: [WAMetric.presence, WAFlag[type]], // weird stuff WA does
				json: { 
					tag: 'action',
					attrs: { epoch: currentEpoch().toString(), type: 'set' },
					content: [
						{ 
							tag: 'presence', 
							attrs: { type: type, to: jid }
						}
					]
				}
			})
		),
		/** 
		 * Request updates on the presence of a user 
		 * this returns nothing, you'll receive updates in chats.update event
		 * */
		presenceSubscribe: async(jid: string) => (
			sendNode({ json: ['action', 'presence', 'subscribe', jid] })
		),
		/** Query the status of the person (see groupMetadata() for groups) */
		getStatus: async(jid: string) => {
			const status: { status: string } = await query({ json: ['query', 'Status', jid], requiresPhoneConnection: false })
			return status
		},
		setStatus: async(status: string) => {
			const response = await setQuery(
				[
					{ 
						tag: 'status',
						attrs: {},
						content: Buffer.from (status, 'utf-8')
					}
				]
			)
			ev.emit('contacts.update', [{ id: state.legacy!.user!.id, status }])
			return response
		},
		/** Updates business profile. */
		updateBusinessProfile: async(profile: WABusinessProfile) => {
			if(profile.business_hours?.config) {
				profile.business_hours.business_config = profile.business_hours.config
				delete profile.business_hours.config
			}

			const json = ['action', 'editBusinessProfile', { ...profile, v: 2 }]
			await query({ json, expect200: true, requiresPhoneConnection: true })
		},
		updateProfileName: async(name: string) => {
			const response = (await setQuery(
				[
					{ 
						tag: 'profile',
						attrs: { name }
					}
				]
			)) as any as {status: number, pushname: string}

			if(config.emitOwnEvents) {
				const user = { ...state.legacy!.user!, name }
				ev.emit('connection.update', { legacy: {
					...state.legacy, user
				} })
				ev.emit('contacts.update', [{ id: user.id, name }])
			}

			return response
		},
		/**
		 * Update the profile picture
		 * @param jid 
		 * @param img 
		 */
		async updateProfilePicture(jid: string, img: Buffer) {
			jid = jidNormalizedUser (jid)
			const data = { img: Buffer.from([]), preview: Buffer.from([]) } //await generateProfilePicture(img) TODO
			const tag = this.generateMessageTag ()
			const query: BinaryNode = { 
				tag: 'picture',
				attrs: { jid: jid, id: tag, type: 'set' },
				content: [
					{ tag: 'image', attrs: {}, content: data.img },
					{ tag: 'preview', attrs: {}, content: data.preview }
				]
			}

			const user = state.legacy?.user
			const { eurl } = await this.setQuery ([query], [WAMetric.picture, 136], tag) as { eurl: string, status: number }
			
			if(config.emitOwnEvents) {
				if(jid === user.id) {
					user.imgUrl = eurl
					ev.emit('connection.update', {
						legacy: {
							...state.legacy,
							user
						}
					})
				}

				ev.emit('contacts.update', [ { id: jid, imgUrl: eurl } ])
			}
		},
		/**
		 * Add or remove user from blocklist
		 * @param jid the ID of the person who you are blocking/unblocking
		 * @param type type of operation
		 */
		blockUser: async(jid: string, type: 'add' | 'remove' = 'add') => {
			const json = { 
				tag: 'block',
				attrs: { type },
				content: [ { tag: 'user', attrs: { jid } } ]
			}
			await setQuery([json], [WAMetric.block, WAFlag.ignore])
			if(config.emitOwnEvents) {
				ev.emit('blocklist.update', { blocklist: [jid], type })
			}
		},
		/**
		 * Query Business Profile (Useful for VCards)
		 * @param jid Business Jid
		 * @returns profile object or undefined if not business account
		 */
		getBusinessProfile: async(jid: string) => {
			jid = jidNormalizedUser(jid)
			const {
				profiles: [{
					profile,
					wid 
				}]
			} = await query({
				json: [
					'query', 'businessProfile', 
					[ { 'wid': jid.replace('@s.whatsapp.net', '@c.us') } ], 
					84
				],
				expect200: true,
				requiresPhoneConnection: false,
			})

			return {
				...profile,
				wid: jidNormalizedUser(wid)
			} as WABusinessProfile
		}
	}
}

export default makeChatsSocket