import { proto } from '../../WAProto'
import { WA_DEFAULT_EPHEMERAL } from '../Defaults'
import { AnyMessageContent, Chat, GroupMetadata, LegacySocketConfig, MediaConnInfo, MessageUpsertType, MessageUserReceipt, MessageUserReceiptUpdate, MiscMessageGenerationOptions, ParticipantAction, WAFlag, WAMessage, WAMessageCursor, WAMessageKey, WAMessageStatus, WAMessageStubType, WAMessageUpdate, WAMetric, WAUrlInfo } from '../Types'
import { assertMediaContent, downloadMediaMessage, generateWAMessage, getWAUploadToServer, MediaDownloadOptions, normalizeMessageContent, toNumber } from '../Utils'
import { areJidsSameUser, BinaryNode, getBinaryNodeMessages, isJidGroup, jidNormalizedUser } from '../WABinary'
import makeChatsSocket from './chats'

const STATUS_MAP = {
	read: WAMessageStatus.READ,
	message: WAMessageStatus.DELIVERY_ACK,
	error: WAMessageStatus.ERROR
} as { [_: string]: WAMessageStatus }

const makeMessagesSocket = (config: LegacySocketConfig) => {
	const { logger } = config
	const sock = makeChatsSocket(config)
	const {
		ev,
		ws: socketEvents,
		query,
		generateMessageTag,
		currentEpoch,
		setQuery,
		state
	} = sock

	let mediaConn: Promise<MediaConnInfo>
	const refreshMediaConn = async(forceGet = false) => {
		const media = await mediaConn
		if(!media || forceGet || (new Date().getTime() - media.fetchDate.getTime()) > media.ttl * 1000) {
			mediaConn = (async() => {
				const { media_conn } = await query({
					json: ['query', 'mediaConn'],
					requiresPhoneConnection: false,
					expect200: true
				})
				media_conn.fetchDate = new Date()
				return media_conn as MediaConnInfo
			})()
		}

		return mediaConn
	}

	const fetchMessagesFromWA = async(
		jid: string,
		count: number,
		cursor?: WAMessageCursor
	) => {
		let key: WAMessageKey | undefined
		if(cursor) {
			key = 'before' in cursor ? cursor.before : cursor.after
		}

		const { content }:BinaryNode = await query({
			json: {
				tag: 'query',
				attrs: {
					epoch: currentEpoch().toString(),
					type: 'message',
					jid: jid,
					kind: !cursor || 'before' in cursor ? 'before' : 'after',
					count: count.toString(),
					index: key?.id!,
					owner: key?.fromMe === false ? 'false' : 'true',
				}
			},
			binaryTag: [WAMetric.queryMessages, WAFlag.ignore],
			expect200: false,
			requiresPhoneConnection: true
		})
		if(Array.isArray(content)) {
			return content.map(data => proto.WebMessageInfo.decode(data.content as Buffer))
		}

		return []
	}

	const updateMediaMessage = async(message: WAMessage) => {
		const content = assertMediaContent(message.message)

		const response: BinaryNode = await query ({
			json: {
				tag: 'query',
				attrs: {
					type: 'media',
					index: message.key.id!,
					owner: message.key.fromMe ? 'true' : 'false',
					jid: message.key.remoteJid!,
					epoch: currentEpoch().toString()
				}
			},
			binaryTag: [WAMetric.queryMedia, WAFlag.ignore],
			expect200: true,
			requiresPhoneConnection: true
		})
		const attrs = response.attrs
		Object.assign(content, attrs) // update message

		ev.emit('messages.update', [{ key: message.key, update: { message: message.message } }])

		return message
	}

	const onMessage = (message: WAMessage, type: MessageUpsertType) => {
		const jid = message.key.remoteJid!
		// store chat updates in this
		const chatUpdate: Partial<Chat> = {
			id: jid,
		}

		const emitGroupUpdate = (update: Partial<GroupMetadata>) => {
			ev.emit('groups.update', [ { id: jid, ...update } ])
		}

		const normalizedContent = normalizeMessageContent(message.message)
		const protocolMessage = normalizedContent?.protocolMessage

		if(
			!!normalizedContent
			&& !normalizedContent?.protocolMessage
			&& !normalizedContent?.reactionMessage
		) {
			chatUpdate.conversationTimestamp = +toNumber(message.messageTimestamp)
			// add to count if the message isn't from me & there exists a message
			if(!message.key.fromMe) {
				chatUpdate.unreadCount = 1
				const participant = jidNormalizedUser(message.participant || jid)

				ev.emit(
					'presence.update',
					{
						id: jid,
						presences: { [participant]: { lastKnownPresence: 'available' } }
					}
				)
			}
		}

		if(normalizedContent?.reactionMessage) {
			const reaction: proto.IReaction = {
				...normalizedContent.reactionMessage,
				key: message.key,
			}
			ev.emit(
				'messages.reaction',
				[{ reaction, key: normalizedContent.reactionMessage!.key! }]
			)
		}

		// if it's a message to delete another message
		if(protocolMessage) {
			switch (protocolMessage.type) {
			case proto.Message.ProtocolMessage.Type.REVOKE:
				const key = protocolMessage.key
				const messageStubType = WAMessageStubType.REVOKE
				ev.emit('messages.update', [
					{
						// the key of the deleted message is updated
						update: { message: null, key: message.key, messageStubType },
						key: key!
					}
				])
				return
			case proto.Message.ProtocolMessage.Type.EPHEMERAL_SETTING:
				chatUpdate.ephemeralSettingTimestamp = message.messageTimestamp
            		chatUpdate.ephemeralExpiration = protocolMessage.ephemeralExpiration

				if(isJidGroup(jid)) {
					emitGroupUpdate({ ephemeralDuration: protocolMessage.ephemeralExpiration || 0 })
				}

				break
			default:
				break
			}
		}

		// check if the message is an action
		if(message.messageStubType) {
			const { user } = state.legacy!
			//let actor = jidNormalizedUser (message.participant)
			let participants: string[]
			const emitParticipantsUpdate = (action: ParticipantAction) => (
				ev.emit('group-participants.update', { id: jid, participants, action })
			)

			switch (message.messageStubType) {
			case WAMessageStubType.CHANGE_EPHEMERAL_SETTING:
				chatUpdate.ephemeralSettingTimestamp = message.messageTimestamp
				chatUpdate.ephemeralExpiration = +message.messageStubParameters![0]
				if(isJidGroup(jid)) {
					emitGroupUpdate({ ephemeralDuration: +(message.messageStubParameters?.[0] || 0) })
				}

				break
			case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
			case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
				participants = message.messageStubParameters!.map (jidNormalizedUser)
				emitParticipantsUpdate('remove')
				// mark the chat read only if you left the group
				if(participants.includes(user!.id)) {
					chatUpdate.readOnly = true
				}

				break
			case WAMessageStubType.GROUP_PARTICIPANT_ADD:
			case WAMessageStubType.GROUP_PARTICIPANT_INVITE:
			case WAMessageStubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
				participants = message.messageStubParameters!.map (jidNormalizedUser)
				if(participants.includes(user!.id)) {
					chatUpdate.readOnly = null
				}

				emitParticipantsUpdate('add')
				break
			case WAMessageStubType.GROUP_CHANGE_ANNOUNCE:
				const announce = message.messageStubParameters?.[0] === 'on'
				emitGroupUpdate({ announce })
				break
			case WAMessageStubType.GROUP_CHANGE_RESTRICT:
				const restrict = message.messageStubParameters?.[0] === 'on'
				emitGroupUpdate({ restrict })
				break
			case WAMessageStubType.GROUP_CHANGE_SUBJECT:
			case WAMessageStubType.GROUP_CREATE:
				chatUpdate.name = message.messageStubParameters?.[0]
				emitGroupUpdate({ subject: chatUpdate.name })
				break
			}
		}

		if(Object.keys(chatUpdate).length > 1) {
			ev.emit('chats.update', [chatUpdate])
		}

		ev.emit('messages.upsert', { messages: [message], type })
	}

	const waUploadToServer = getWAUploadToServer(config, refreshMediaConn)

	/** Query a string to check if it has a url, if it does, return WAUrlInfo */
	const generateUrlInfo = async(text: string) => {
		const response: BinaryNode = await query({
			json: {
				tag: 'query',
				attrs: {
					type: 'url',
					url: text,
					epoch: currentEpoch().toString()
				}
			},
			binaryTag: [26, WAFlag.ignore],
			expect200: true,
			requiresPhoneConnection: false
		})
		const urlInfo = { ...response.attrs } as any as WAUrlInfo
		if(response && response.content) {
			urlInfo.jpegThumbnail = response.content as Buffer
		}

		return urlInfo
	}

	/** Relay (send) a WAMessage; more advanced functionality to send a built WA Message, you may want to stick with sendMessage() */
	const relayMessage = async(message: WAMessage, { waitForAck } = { waitForAck: true }) => {
		const json: BinaryNode = {
			tag: 'action',
			attrs: { epoch: currentEpoch().toString(), type: 'relay' },
			content: [
				{
					tag: 'message',
					attrs: {},
					content: proto.WebMessageInfo.encode(message).finish()
				}
			]
		}
		const isMsgToMe = areJidsSameUser(message.key.remoteJid!, state.legacy?.user?.id || '')
		const flag = isMsgToMe ? WAFlag.acknowledge : WAFlag.ignore // acknowledge when sending message to oneself
		const mID = message.key.id!
		const finalState = isMsgToMe ? WAMessageStatus.READ : WAMessageStatus.SERVER_ACK

		message.status = WAMessageStatus.PENDING
		const promise = query({
			json,
			binaryTag: [WAMetric.message, flag],
			tag: mID,
			expect200: true,
			requiresPhoneConnection: true
		})

		if(waitForAck) {
			await promise
			message.status = finalState
		} else {
			const emitUpdate = (status: WAMessageStatus) => {
				message.status = status
				ev.emit('messages.update', [ { key: message.key, update: { status } } ])
			}

			promise
				.then(() => emitUpdate(finalState))
				.catch(() => emitUpdate(WAMessageStatus.ERROR))
		}

		if(config.emitOwnEvents) {
			onMessage(message, 'append')
		}
	}

	// messages received
	const messagesUpdate = (node: BinaryNode, isLatest: boolean) => {
		const messages = getBinaryNodeMessages(node)
		messages.reverse()
		ev.emit('messages.set', { messages, isLatest })
	}

	socketEvents.on('CB:action,add:last', json => messagesUpdate(json, true))
	socketEvents.on('CB:action,add:unread', json => messagesUpdate(json, false))
	socketEvents.on('CB:action,add:before', json => messagesUpdate(json, false))

	// new messages
	socketEvents.on('CB:action,add:relay,message', (node: BinaryNode) => {
		const msgs = getBinaryNodeMessages(node)
		for(const msg of msgs) {
			onMessage(msg, 'notify')
		}
	})
	// If a message has been updated
	// usually called when a video message gets its upload url, or live locations or ciphertext message gets fixed
	socketEvents.on ('CB:action,add:update,message', (node: BinaryNode) => {
		const msgs = getBinaryNodeMessages(node)
		for(const msg of msgs) {
			onMessage(msg, 'append')
		}
	})
	// message status updates
	const onMessageStatusUpdate = ({ content }: BinaryNode) => {
		if(Array.isArray(content)) {
			const updates: WAMessageUpdate[] = []
			for(const { attrs: json } of content) {
				const key: WAMessageKey = {
					remoteJid: jidNormalizedUser(json.jid),
					id: json.index,
					fromMe: json.owner === 'true'
				}
				const status = STATUS_MAP[json.type]

				if(status) {
					updates.push({ key, update: { status } })
				} else {
					logger.warn({ content, key }, 'got unknown status update for message')
				}
			}

			ev.emit('messages.update', updates)
		}
	}

	const onMessageInfoUpdate = ([, attributes]: [string, {[_: string]: any}]) => {
		let ids = attributes.id as string[] | string
		if(typeof ids === 'string') {
			ids = [ids]
		}

		let updateKey: keyof MessageUserReceipt
		switch (attributes.ack.toString()) {
		case '2':
			updateKey = 'receiptTimestamp'
			break
		case '3':
			updateKey = 'readTimestamp'
			break
		case '4':
			updateKey = 'playedTimestamp'
			break
		default:
			logger.warn({ attributes }, 'received unknown message info update')
			return
		}

		const keyPartial = {
			remoteJid: jidNormalizedUser(attributes.to),
			fromMe: areJidsSameUser(attributes.from, state.legacy?.user?.id || ''),
		}

		const userJid = jidNormalizedUser(attributes.participant || attributes.to)

		const updates = ids.map<MessageUserReceiptUpdate>(id => ({
			key: { ...keyPartial, id },
			receipt: {
				userJid,
				[updateKey]: +attributes.t
			}
		}))
		ev.emit('message-receipt.update', updates)
		// for individual messages
		// it means the message is marked read/delivered
		if(!isJidGroup(keyPartial.remoteJid)) {
			ev.emit('messages.update', ids.map(id => (
				{
					key: { ...keyPartial, id },
					update: {
						status: updateKey === 'receiptTimestamp' ? WAMessageStatus.DELIVERY_ACK : WAMessageStatus.READ
					}
				}
			)))
		}
	}

	socketEvents.on('CB:action,add:relay,received', onMessageStatusUpdate)
	socketEvents.on('CB:action,,received', onMessageStatusUpdate)

	socketEvents.on('CB:Msg', onMessageInfoUpdate)
	socketEvents.on('CB:MsgInfo', onMessageInfoUpdate)

	return {
		...sock,
		relayMessage,
		waUploadToServer,
		generateUrlInfo,
		messageInfo: async(jid: string, messageID: string) => {
			const { content }: BinaryNode = await query({
				json: {
					tag: 'query',
					attrs: {
						type: 'message_info',
						index: messageID,
						jid: jid,
						epoch: currentEpoch().toString()
					}
				},
				binaryTag: [WAMetric.queryRead, WAFlag.ignore],
				expect200: true,
				requiresPhoneConnection: true
			})
			const info: { [jid: string]: MessageUserReceipt } = { }
			if(Array.isArray(content)) {
				for(const { tag, content: innerData } of content) {
					const [{ attrs }] = (innerData as BinaryNode[])

					const jid = jidNormalizedUser(attrs.jid)
					const recp = info[jid] || { userJid: jid }
					const date = +attrs.t
					switch (tag) {
					case 'read':
						recp.readTimestamp = date
						break
					case 'delivery':
						recp.receiptTimestamp = date
						break
					}

					info[jid] = recp
				}
			}

			return Object.values(info)
		},
		downloadMediaMessage: async(message: WAMessage, type: 'buffer' | 'stream' = 'buffer', options: MediaDownloadOptions = { }) => {
			try {
				const result = await downloadMediaMessage(message, type, options)
				return result
			} catch(error) {
				if(error.message.includes('404')) { // media needs to be updated
					logger.info (`updating media of message: ${message.key.id}`)

					await updateMediaMessage(message)

					const result = await downloadMediaMessage(message, type, options)
					return result
				}

				throw error
			}
		},
		updateMediaMessage,
		fetchMessagesFromWA,
		/** Load a single message specified by the ID */
		loadMessageFromWA: async(jid: string, id: string) => {
			// load the message before the given message
			let messages = (await fetchMessagesFromWA(jid, 1, { before: { id, fromMe: true } }))
			if(!messages[0]) {
				messages = (await fetchMessagesFromWA(jid, 1, { before: { id, fromMe: false } }))
			}

			// the message after the loaded message is the message required
			const [actual] = await fetchMessagesFromWA(jid, 1, { after: messages[0] && messages[0].key })
			return actual
		},
		searchMessages: async(txt: string, inJid: string | null, count: number, page: number) => {
			const node: BinaryNode = await query({
				json: {
					tag: 'query',
					attrs: {
						epoch: currentEpoch().toString(),
						type: 'search',
						search: txt,
						count: count.toString(),
						page: page.toString(),
						jid: inJid!
					}
				},
				binaryTag: [24, WAFlag.ignore],
				expect200: true
			}) // encrypt and send  off

			return {
				last: node.attrs?.last === 'true',
				messages: getBinaryNodeMessages(node)
			}
		},
		sendMessage: async(
			jid: string,
			content: AnyMessageContent,
			options: MiscMessageGenerationOptions & { waitForAck?: boolean } = { waitForAck: true }
		) => {
			const userJid = state.legacy?.user?.id
			if(
				typeof content === 'object' &&
				'disappearingMessagesInChat' in content &&
				typeof content['disappearingMessagesInChat'] !== 'undefined' &&
				isJidGroup(jid)
			) {
				const { disappearingMessagesInChat } = content
				const value = typeof disappearingMessagesInChat === 'boolean' ?
					(disappearingMessagesInChat ? WA_DEFAULT_EPHEMERAL : 0) :
					disappearingMessagesInChat
				const tag = generateMessageTag(true)
				await setQuery([
					{
						tag: 'group',
						attrs: { id: tag, jid, type: 'prop', author: userJid! },
						content: [
							{ tag: 'ephemeral', attrs: { value: value.toString() } }
						]
					}
				])
			} else {
				const msg = await generateWAMessage(
					jid,
					content,
					{
						logger,
						userJid: userJid!,
						getUrlInfo: generateUrlInfo,
						upload: waUploadToServer,
						mediaCache: config.mediaCache,
						...options,
					}
				)

				await relayMessage(msg, { waitForAck: !!options.waitForAck })
				return msg
			}
		}
	}
}

export default makeMessagesSocket