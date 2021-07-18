import BinaryNode from "../BinaryNode";
import { EventEmitter } from 'events'
import { Chat, Contact, Presence, PresenceData, SocketConfig, WAFlag, WAMetric, WABusinessProfile, ChatModification, WAMessageKey, WAMessage } from "../Types";
import { debouncedTimeout, unixTimestampSeconds, whatsappID } from "../Utils/generics";
import makeAuthSocket from "./auth";
import { Attributes, BinaryNode as BinaryNodeBase } from "../BinaryNode/types";

const makeChatsSocket = (config: SocketConfig) => {
	const { logger } = config
	const sock = makeAuthSocket(config)
	const { 
		ev, 
		socketEvents,
		currentEpoch,
		setQuery,
		query, 
		sendMessage,
		getState
	} = sock

	const chatsDebounceTimeout = debouncedTimeout(10_000, () => sendChatsQuery(1))

	const sendChatsQuery = (epoch: number) => (
		sendMessage({
			json: new BinaryNode('query', {type: 'chat', epoch: epoch.toString()}),
			binaryTag: [ WAMetric.queryChat, WAFlag.ignore ]
		})
	)

	const fetchImageUrl = async(jid: string) => {
		const response = await query({ 
			json: ['query', 'ProfilePicThumb', jid], 
			expect200: false, 
			requiresPhoneConnection: false 
		})
		return response.eurl as string | undefined
	}

	const executeChatModification = (node: BinaryNodeBase) => {
		const { attributes } = node
		const updateType = attributes.type
		const jid = whatsappID(attributes?.jid)

		switch(updateType) {
			case 'delete':
				ev.emit('chats.delete', [jid])
				break
			case 'clear':
				if(node.data) {
					const ids = (node.data as BinaryNode[]).map(
						({ attributes }) => attributes.index
					)
					ev.emit('messages.delete', { jid, ids })
				} else {
					ev.emit('messages.delete', { jid, all: true })
				}
				break
			case 'archive':
				ev.emit('chats.update', [ { jid, archive: 'true' } ])
				break
			case 'unarchive':
				ev.emit('chats.update', [ { jid, archive: 'false' } ])
				break
			case 'pin':
				ev.emit('chats.update', [ { jid, pin: attributes.pin } ])
				break
			case 'star':
			case 'unstar':
				const starred = updateType === 'star'
				const updates: Partial<WAMessage>[] = (node.data as BinaryNode[]).map(
					({ attributes }) => ({ 
						key: {
							remoteJid: jid, 
							id: attributes.index, 
							fromMe: attributes.owner === 'true' 
						},
						starred
					})
				)
				ev.emit('messages.update', updates)
				break
			case 'mute':
				if(attributes.mute === '0') {
					ev.emit('chats.update', [{ jid, mute: null }])
				} else {
					ev.emit('chats.update', [{ jid, mute: attributes.mute }])
				}
				break
			default:
				logger.warn({ node }, `received unrecognized chat update`)
				break
		}     
	}

	const applyingPresenceUpdate = (update: Attributes, chat: Partial<Chat>) => {
		chat.jid = whatsappID(update.id)
        const jid = whatsappID(update.participant || update.id)
        
        if (jid.endsWith('@s.whatsapp.net')) { // if its a single chat
            chat.presences = chat.presences || {}
            
            const presence = { } as PresenceData 
            
            if(update.t) {
				presence.lastSeen = +update.t
			}
            presence.lastKnownPresence = update.type as Presence
            chat.presences[jid] = presence

			chat.presences = {
				[jid]: presence
			}
        }
		return chat
	}

	ev.on('connection.update', async({ connection }) => {
		if(connection !== 'open') return
		try {
			await Promise.all([
				sendMessage({
					json: new BinaryNode('query', {type: 'contacts', epoch: '1'}),
					binaryTag: [ WAMetric.queryContact, WAFlag.ignore ]
				}),
				sendMessage({
					json: new BinaryNode('query', {type: 'status', epoch: '1'}),
					binaryTag: [ WAMetric.queryStatus, WAFlag.ignore ]
				}),
				sendMessage({
					json: new BinaryNode('query', {type: 'quick_reply', epoch: '1'}), 
					binaryTag: [ WAMetric.queryQuickReply, WAFlag.ignore ]
				}),
				sendMessage({
					json: new BinaryNode('query', {type: 'label', epoch: '1'}),
					binaryTag: [ WAMetric.queryLabel, WAFlag.ignore ]
				}),
				sendMessage({
					json: new BinaryNode('query', {type: 'emoji', epoch: '1'}),
					binaryTag: [ WAMetric.queryEmoji, WAFlag.ignore ] 
				}),
				sendMessage({
					json: new BinaryNode(
						'action', 
						{ type: 'set', epoch: '1' },
						[
							new BinaryNode('presence', {type: 'available'})
						]
					), 
					binaryTag: [ WAMetric.presence, WAFlag.available ]
				})
			])
			chatsDebounceTimeout.start()
	
			logger.debug('sent init queries')
		} catch(error) {
			logger.error(`error in sending init queries: ${error}`)
		}
	})
	socketEvents.on('CB:response,type:chat', async ({ data }: BinaryNode) => {
		chatsDebounceTimeout.cancel()
		if(Array.isArray(data)) {
			const chats = data.map(({ attributes }) => {
				return {
					...attributes,
					jid: whatsappID(attributes.jid),
					t: +attributes.t,
					count: +attributes.count
				} as Chat
			})

			logger.info(`got ${chats.length} chats`)
			ev.emit('chats.set', { chats })
		}
	})
	// got all contacts from phone
	socketEvents.on('CB:response,type:contacts', async ({ data }: BinaryNode) => {
		if(Array.isArray(data)) {
			const contacts = data.map(({ attributes }) => {
				const contact = attributes as any as Contact
				contact.jid = whatsappID(contact.jid)
				return contact
			})

			logger.info(`got ${contacts.length} contacts`)
			ev.emit('contacts.set', { contacts })
		}
	})
	// status updates
	socketEvents.on('CB:Status,status', json => {
		const jid = whatsappID(json[1].id)
		ev.emit('contacts.update', [ { jid, status: json[1].status } ])
	})
	// User Profile Name Updates
	socketEvents.on('CB:Conn,pushname', json => {
		const { user, connection } = getState()
		if(connection === 'open' && json[1].pushname !== user.name) {
			user.name = json[1].pushname
			ev.emit('connection.update', { user })
		}
	})
	// read updates
	socketEvents.on ('CB:action,,read', async ({ data }: BinaryNode) => {
		if(Array.isArray(data)) {
			const { attributes } = data[0]

			const update: Partial<Chat> = {
				jid: whatsappID(attributes.jid)
			}
			if (attributes.type === 'false') update.count = -1
			else update.count = 0

			ev.emit('chats.update', [update])
		}
	}) 

	socketEvents.on('CB:Cmd,type:picture', async json => {
		json = json[1]
		const jid = whatsappID(json.jid)
		const imgUrl = await fetchImageUrl(jid).catch(() => '')
		
		ev.emit('contacts.update', [ { jid, imgUrl } ])
	})
	
	// chat archive, pin etc.
	socketEvents.on('CB:action,,chat', ({ data }: BinaryNode) => {
		if(Array.isArray(data)) {
			const [node] = data
			executeChatModification(node)
		}
	})

	socketEvents.on ('CB:action,,user', json => {
		const node = json[2][0]
		if (node) {
			const user = node[1] as Contact
			user.jid = whatsappID(user.jid)
			
			ev.emit('contacts.upsert', [user])
		}
	})

	// presence updates
	socketEvents.on('CB:Presence', json => {
		const chat = applyingPresenceUpdate(json[1], { })
		ev.emit('chats.update', [ chat ])
	})

	// blocklist updates
	socketEvents.on('CB:Blocklist', json => {
		json = json[1]
		const blocklist = json.blocklist
		ev.emit('blocklist.set', { blocklist })
	})

	return {
		...sock,
		sendChatsQuery,
		fetchImageUrl,
		chatRead: async(fromMessage: WAMessageKey, count: number) => {
			if(count < 0) {
				count = -2
			}
			await setQuery (
				[
					new BinaryNode(
						'read',
						{ 
							jid: fromMessage.remoteJid, 
							count: count.toString(), 
							index: fromMessage.id, 
							owner: fromMessage.fromMe ? 'true' : 'false'
						}
					)
				], 
				[ WAMetric.read, WAFlag.ignore ]
			)
			ev.emit ('chats.update', [{ jid: fromMessage.remoteJid, count: count < 0 ? -1 : 0 }])
		},
		/**
		 * Modify a given chat (archive, pin etc.)
		 * @param jid the ID of the person/group you are modifiying
		 */
		modifyChat: async(jid: string, modification: ChatModification) => {	 
			let chatAttrs: Attributes = { jid: jid }
			let data: BinaryNode[] | undefined = undefined
			const stamp = unixTimestampSeconds()

			if('archive' in modification) {
				chatAttrs.type = modification.archive ? 'archive' : 'unarchive'
			} else if('pin' in modification) {
				chatAttrs.type = 'pin'
				if(typeof modification.pin === 'object') {
					chatAttrs.previous = modification.pin.remove.toString()
				} else {
					chatAttrs.pin = stamp.toString()
				}
			} else if('mute' in modification) {
				chatAttrs.type = 'mute'
				if(typeof modification.mute === 'object') {
					chatAttrs.previous = modification.mute.remove.toString()
				} else {
					chatAttrs.mute = (stamp + modification.mute).toString()
				}
			} else if('clear' in modification) {
				chatAttrs.type = 'clear'
				chatAttrs.modify_tag = Math.round(Math.random ()*1000000).toString()
				if(modification.clear !== 'all') {
					data = modification.clear.messages.map(({ id, fromMe }) => (
						new BinaryNode(
							'item',
							{ owner: (!!fromMe).toString(), index: id }
						)
					))
				}
			} else if('star' in modification) {
				chatAttrs.type = modification.star.star ? 'star' : 'unstar'
				data = modification.star.messages.map(({ id, fromMe }) => (
					new BinaryNode(
						'item',
						{ owner: (!!fromMe).toString(), index: id }
					)
				))
			}

			const node = new BinaryNode('chat', chatAttrs, data)
			const response = await setQuery ([node], [ WAMetric.chat, WAFlag.ignore ])
			// apply it and emit events
			executeChatModification(node)
			return response
		},
		/** 
		 * Query whether a given number is registered on WhatsApp
		 * @param str phone number/jid you want to check for
		 * @returns undefined if the number doesn't exists, otherwise the correctly formatted jid
		 */
		isOnWhatsApp: async (str: string) => {
			const { status, jid, biz } = await query({
				json: ['query', 'exist', str], 
				requiresPhoneConnection: false
			})
			if (status === 200) {
				return { 
					exists: true, 
					jid: whatsappID(jid), 
					isBusiness: biz as boolean
				}
			}
		},
		/**
		 * Tell someone about your presence -- online, typing, offline etc.
		 * @param jid the ID of the person/group who you are updating
		 * @param type your presence
		 */
		updatePresence: (jid: string | undefined, type: Presence) => (
			sendMessage({
				binaryTag: [WAMetric.presence, WAFlag[type]], // weird stuff WA does
				json: new BinaryNode(
					'action',
					{ epoch: currentEpoch().toString(), type: 'set' },
					[
						new BinaryNode(
						'presence', 
						{ type: type, to: jid }
						)
					]
				)
			})
		),
		/** 
		 * Request updates on the presence of a user 
		 * this returns nothing, you'll receive updates in chats.update event
		 * */
		requestPresenceUpdate: async (jid: string) => (
			sendMessage({ json: ['action', 'presence', 'subscribe', jid] })
		),
		/** Query the status of the person (see groupMetadata() for groups) */
		getStatus: async(jid: string) => {
			const status: { status: string } = await query({ json: ['query', 'Status', jid], requiresPhoneConnection: false })
			return status
		},
		setStatus: async(status: string) => {
			const response = await setQuery(
				[
					new BinaryNode(
						'status',
						{},
						Buffer.from (status, 'utf-8')
					)
				]
			)
			ev.emit('contacts.update', [{ jid: getState().user!.jid, status }])
			return response
		},
		/** Updates business profile. */
		updateBusinessProfile: async(profile: WABusinessProfile) => {
			if (profile.business_hours?.config) {
				profile.business_hours.business_config = profile.business_hours.config
				delete profile.business_hours.config
			}
			const json = ['action', "editBusinessProfile", {...profile, v: 2}]
			await query({ json, expect200: true, requiresPhoneConnection: true })
		},
		updateProfileName: async(name: string) => {
			const response = (await setQuery(
				[
					new BinaryNode(
						'profile',
						{ name }
					)
				]
			)) as any as {status: number, pushname: string}

			if (response.status === 200) {
				const user = { ...getState().user!, name }
				ev.emit('connection.update', { user })
				ev.emit('contacts.update', [{ jid: user.jid, name }])
			}
			return response
		},
		/**
		 * Update the profile picture
		 * @param jid 
		 * @param img 
		 */
		async updateProfilePicture (jid: string, img: Buffer) {
			jid = whatsappID (jid)
			const data = { img: Buffer.from([]), preview: Buffer.from([]) } //await generateProfilePicture(img) TODO
			const tag = this.generateMessageTag ()
			const query = new BinaryNode(
				'picture',
				{ jid: jid, id: tag, type: 'set' },
				[
					new BinaryNode('image', {}, data.img),
					new BinaryNode('preview', {}, data.preview)
				]
			)
			const user = getState().user
			const { eurl } = await this.setQuery ([query], [WAMetric.picture, 136], tag) as { eurl: string, status: number }
			
			if (jid === user.jid) {
				user.imgUrl = eurl
				ev.emit('connection.update', { user })
			}
			ev.emit('contacts.update', [ { jid, imgUrl: eurl } ])
		},
		/**
		 * Add or remove user from blocklist
		 * @param jid the ID of the person who you are blocking/unblocking
		 * @param type type of operation
		 */
		blockUser: async(jid: string, type: 'add' | 'remove' = 'add') => {
			const json = new BinaryNode(
				'block',
				{ type },
				[ new BinaryNode('user', { jid }) ]
			)
			await setQuery ([json], [WAMetric.block, WAFlag.ignore])
			ev.emit('blocklist.update', { blocklist: [jid], type })
		},
		/**
		 * Query Business Profile (Useful for VCards)
		 * @param jid Business Jid
		 * @returns profile object or undefined if not business account
		 */
		getBusinessProfile: async(jid: string) => {
			jid = whatsappID(jid)
			const {
				profiles: [{
					profile,
					wid 
				}]
			} = await query({
				json: [
					"query", "businessProfile", 
					[ { "wid": jid.replace('@s.whatsapp.net', '@c.us') } ], 
					84
				],
				expect200: true,
				requiresPhoneConnection: false,
			})

			return {
				...profile,
				wid: whatsappID(wid)
			} as WABusinessProfile
		}
	}
}
export default makeChatsSocket