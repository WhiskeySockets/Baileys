import BinaryNode from "../BinaryNode";
import { Boom } from '@hapi/boom'
import { EventEmitter } from 'events'
import { Chat, Presence, WAMessageCursor, SocketConfig, WAMessage, WAMessageKey, ParticipantAction, WAMessageProto, WAMessageStatus, WAMessageStubType, GroupMetadata, AnyMessageContent, MiscMessageGenerationOptions, WAFlag, WAMetric, WAUrlInfo, MediaConnInfo, MessageUpdateType, MessageInfo, MessageInfoUpdate } from "../Types";
import { isGroupID, toNumber, whatsappID, generateWAMessage, decryptMediaMessageBuffer } from "../Utils";
import makeChatsSocket from "./chats";
import { WA_DEFAULT_EPHEMERAL } from "../Defaults";

const STATUS_MAP = {
	read: WAMessageStatus.READ,
	message: WAMessageStatus.DELIVERY_ACK,
    error: WAMessageStatus.ERROR
} as { [_: string]: WAMessageStatus }

const makeMessagesSocket = (config: SocketConfig) => {
	const { logger } = config
	const sock = makeChatsSocket(config)
	const { 
		ev, 
		socketEvents,
		query,
		generateMessageTag,
		currentEpoch,
		setQuery,
		getState
	} = sock

	let mediaConn: Promise<MediaConnInfo>
	const refreshMediaConn = async(forceGet = false) => {
		let media = await mediaConn
        if (!media || forceGet || (new Date().getTime()-media.fetchDate.getTime()) > media.ttl*1000) {
			mediaConn = (async() => {
				const {media_conn} = await query({
					json: ['query', 'mediaConn'], 
					requiresPhoneConnection: false
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
		let key: WAMessageKey
		if(cursor) {
			key = 'before' in cursor ? cursor.before : cursor.after
		}
        const { data }:BinaryNode = await query({
			json: new BinaryNode(
				'query',
				{
					epoch: currentEpoch().toString(),
					type: 'message',
					jid: jid,
					kind: !cursor || 'before' in cursor ? 'before' : 'after',
					count: count.toString(),
					index: key?.id,
					owner: key?.fromMe === false ? 'false' : 'true',
				}
			), 
			binaryTag: [WAMetric.queryMessages, WAFlag.ignore], 
			expect200: false, 
			requiresPhoneConnection: true
		})
		if(Array.isArray(data)) {
			return data.map(data => data.data as WAMessage)
		}
		return []
    }

	const updateMediaMessage = async(message: WAMessage) => {
		const content = message.message?.audioMessage || message.message?.videoMessage || message.message?.imageMessage || message.message?.stickerMessage || message.message?.documentMessage 
		if (!content) throw new Boom(
			`given message ${message.key.id} is not a media message`, 
			{ statusCode: 400, data: message }
		)
		
		const response = await query ({
			json: new BinaryNode(
				'query',
				{type: 'media', index: message.key.id, owner: message.key.fromMe ? 'true' : 'false', jid: message.key.remoteJid, epoch: currentEpoch().toString()}
			), 
			binaryTag: [WAMetric.queryMedia, WAFlag.ignore], 
			expect200: true, 
			requiresPhoneConnection: true
		})
		Object.keys(response[1]).forEach (key => content[key] = response[1][key]) // update message

		ev.emit('messages.update', [{ key: message.key, update: { message: message.message } }])

		return response
	}

	const onMessage = (message: WAMessage, type: MessageUpdateType | 'update') => {
		const jid = message.key.remoteJid!
		// store chat updates in this
		const chatUpdate: Partial<Chat> = { 
			jid,
			t: +toNumber(message.messageTimestamp)
		}
		// add to count if the message isn't from me & there exists a message
		if(!message.key.fromMe && message.message) {
			chatUpdate.count = 1
			const participant = whatsappID(message.participant || jid)
			chatUpdate.presences = {
				[participant]: {
					lastKnownPresence: Presence.available
				}
			}
		}

		const ephemeralProtocolMsg = message.message?.ephemeralMessage?.message?.protocolMessage
        if (
            ephemeralProtocolMsg && 
            ephemeralProtocolMsg.type === WAMessageProto.ProtocolMessage.ProtocolMessageType.EPHEMERAL_SETTING
        ) {
            chatUpdate.eph_setting_ts = message.messageTimestamp.toString()
            chatUpdate.ephemeral = ephemeralProtocolMsg.ephemeralExpiration.toString()
        }
		const protocolMessage = message.message?.protocolMessage
        // if it's a message to delete another message
        if (protocolMessage) {
            switch (protocolMessage.type) {
                case WAMessageProto.ProtocolMessage.ProtocolMessageType.REVOKE:
					const key = protocolMessage.key
					const messageStubType = WAMessageStubType.REVOKE
					ev.emit('messages.update', [ 
						{ 
							// the key of the deleted message is updated
							update: { message: null, key: message.key, messageStubType }, 
							key 
						}
					])
                    return
                default:
                    break
            }
        }

		// check if the message is an action 
		if (message.messageStubType) {
			const { user } = getState()
			//let actor = whatsappID (message.participant)
			let participants: string[]
			const emitParticipantsUpdate = (action: ParticipantAction) => (
				ev.emit('group-participants.update', { jid, participants, action })
			)
			const emitGroupUpdate = (update: Partial<GroupMetadata>) => {
				ev.emit('groups.update', [ { id: jid, ...update } ])
			}
			
			switch (message.messageStubType) {
				case WAMessageStubType.CHANGE_EPHEMERAL_SETTING:
					chatUpdate.eph_setting_ts = message.messageTimestamp.toString()
					chatUpdate.ephemeral = message.messageStubParameters[0]
					break
				case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
				case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
					participants = message.messageStubParameters.map (whatsappID)
					emitParticipantsUpdate('remove')
					// mark the chat read only if you left the group
					if (participants.includes(user.jid)) {
						chatUpdate.read_only = 'true'
					}
					break
				case WAMessageStubType.GROUP_PARTICIPANT_ADD:
				case WAMessageStubType.GROUP_PARTICIPANT_INVITE:
				case WAMessageStubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
					participants = message.messageStubParameters.map (whatsappID)
					if (participants.includes(user.jid)) {
						chatUpdate.read_only = 'false'
					}
					emitParticipantsUpdate('add')
					break
				case WAMessageStubType.GROUP_CHANGE_ANNOUNCE:
					const announce = message.messageStubParameters[0] === 'on' ? 'true' : 'false'
					emitGroupUpdate({ announce })
					break
				case WAMessageStubType.GROUP_CHANGE_RESTRICT:
					const restrict = message.messageStubParameters[0] === 'on' ? 'true' : 'false'
					emitGroupUpdate({ restrict })
					break
				case WAMessageStubType.GROUP_CHANGE_SUBJECT:
				case WAMessageStubType.GROUP_CREATE:
					chatUpdate.name = message.messageStubParameters[0]
					emitGroupUpdate({ subject: chatUpdate.name })
					break
			}
		}

		if(Object.keys(chatUpdate).length > 1) {
			ev.emit('chats.update', [chatUpdate])
		}
		if(type === 'update') {
			ev.emit('messages.update', [ { update: message, key: message.key } ])
		} else {
			ev.emit('messages.upsert', { messages: [message], type })
		} 
	}

	/** Query a string to check if it has a url, if it does, return WAUrlInfo */
    const generateUrlInfo = async(text: string) => {
        const response = await query({
			json: new BinaryNode(
				'query',
				{type: 'url', url: text, epoch: currentEpoch().toString()}
			), 
			binaryTag: [26, WAFlag.ignore], 
			expect200: true, 
			requiresPhoneConnection: false
		})
        if(response[1]) {
            response[1].jpegThumbnail = response[2]
        }
        return response[1] as WAUrlInfo
    }

	/** Relay (send) a WAMessage; more advanced functionality to send a built WA Message, you may want to stick with sendMessage() */
    const relayWAMessage = async(message: WAMessage, { waitForAck } = { waitForAck: true }) => {
		const json = new BinaryNode(
			'action',
			{ epoch: currentEpoch().toString(), type: 'relay' },
			[ new BinaryNode('message', {}, message) ]
		)
		const isMsgToMe = message.key.remoteJid === getState().user?.jid
        const flag = isMsgToMe ? WAFlag.acknowledge : WAFlag.ignore // acknowledge when sending message to oneself
        const mID = message.key.id
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

		onMessage(message, 'append')
    }

	// messages received
	const messagesUpdate = ({ data }: BinaryNode, type: 'prepend' | 'last') => {
		if(Array.isArray(data)) {
			const messages: WAMessage[] = []
			for(let i = data.length-1; i >= 0;i--) {
				messages.push(data[i].data as WAMessage)
			}
			ev.emit('messages.upsert', { messages, type })
		}
	}

	socketEvents.on('CB:action,add:last', json =>  messagesUpdate(json, 'last'))
	socketEvents.on('CB:action,add:unread', json => messagesUpdate(json, 'prepend'))
	socketEvents.on('CB:action,add:before', json => messagesUpdate(json, 'prepend'))
	
	// new messages
	socketEvents.on('CB:action,add:relay,message', ({data}: BinaryNode) => {
		if(Array.isArray(data)) {
			for(const { data: msg } of data) {
				onMessage(msg as WAMessage, 'notify')
			}
		}
	})
	// If a message has been updated (usually called when a video message gets its upload url, or live locations)
	socketEvents.on ('CB:action,add:update,message', ({ data }: BinaryNode) => {
		if(Array.isArray(data)) {
			for(const { data: msg } of data) {
				onMessage(msg as WAMessage, 'update')
			}
		}
	})
	// message status updates
	const onMessageStatusUpdate = ({ data }: BinaryNode) => {
		if(Array.isArray(data)) {
			for(const { attributes: json } of data) {
				const key: WAMessageKey = {
					remoteJid: whatsappID(json.jid),
					id: json.index,
					fromMe: json.owner === 'true'
				}
				const status = STATUS_MAP[json.type]

				if(status) {
					ev.emit('messages.update', [ { key, update: { status } } ])
				} else {
					logger.warn({ data }, 'got unknown status update for message')
				}
			}
		}
	}
	const onMessageInfoUpdate = ([,attributes]: [string,{[_: string]: any}]) => {
		let ids = attributes.id as string[] | string
		if(typeof ids === 'string') {
			ids = [ids]
		}
		let updateKey: keyof MessageInfoUpdate['update']
		switch(attributes.ack.toString()) {
			case '2':
				updateKey = 'deliveries'
				break
			case '3':
				updateKey = 'reads'
				break
			default:
				logger.warn({ attributes }, `received unknown message info update`)
				return
		}
		const updates = ids.map<MessageInfoUpdate>(id => ({
			key: { 
				remoteJid: whatsappID(attributes.to), 
				id, 
				fromMe: whatsappID(attributes.from) === getState().user?.jid,
			},
			update: {
				[updateKey]: { [whatsappID(attributes.participant)]: new Date(+attributes.t) }
			}
		}))
		ev.emit('message-info.update', updates)
	}

	socketEvents.on('CB:action,add:relay,received', onMessageStatusUpdate)
	socketEvents.on('CB:action,,received', onMessageStatusUpdate)

	socketEvents.on('CB:Msg', onMessageInfoUpdate)
	socketEvents.on('CB:MsgInfo', onMessageInfoUpdate)

	return {
		...sock,
		relayWAMessage,
		generateUrlInfo,
		messageInfo: async(jid: string, messageID: string) => {
			const { data }: BinaryNode = await query({
				json: new BinaryNode(
					'query',
					{type: 'message_info', index: messageID, jid: jid, epoch: currentEpoch().toString()}
				), 
				binaryTag: [WAMetric.queryRead, WAFlag.ignore], 
				expect200: true,
				requiresPhoneConnection: true
			})
			const info: MessageInfo = { reads: {}, deliveries: {} }
			if(Array.isArray(data)) {
				for(const { header, data: innerData } of data) {
					const [{ attributes }] = (innerData as BinaryNode[])
					const jid = whatsappID(attributes.jid)
					const date = new Date(+attributes.t * 1000)
					switch(header) {
						case 'read':
							info.reads[jid] = date
							break
						case 'delivery':
							info.deliveries[jid] = date
							break
					}
				}
			}
			return info
		},
		downloadMediaMessage: async(message: WAMessage, type: 'buffer' | 'stream' = 'buffer') => {
			let mContent = message.message?.ephemeralMessage?.message || message.message
			if (!mContent) throw new Boom('No message present', { statusCode: 400, data: message })
	
			const downloadMediaMessage = async () => {
				const stream = await decryptMediaMessageBuffer(mContent)
				if(type === 'buffer') {
					let buffer = Buffer.from([])
					for await(const chunk of stream) {
						buffer = Buffer.concat([buffer, chunk])
					}
					return buffer
				}
				return stream
			}
			
			try {
				const result = await downloadMediaMessage()
				return result
			} catch (error) {
				if(error instanceof Boom && error.output?.statusCode === 404) { // media needs to be updated
					logger.info (`updating media of message: ${message.key.id}`)
					
					await updateMediaMessage(message)

					mContent = message.message?.ephemeralMessage?.message || message.message
					const result = await downloadMediaMessage()
					return result
				}
				throw error
			}
		},
		updateMediaMessage,
		fetchMessagesFromWA,
		/** Load a single message specified by the ID */
		loadMessageFromWA: async(jid: string, id: string) => {
			let message: WAMessage
	
			// load the message before the given message
			let messages = (await fetchMessagesFromWA(jid, 1, { before: {id, fromMe: true} }))
			if(!messages[0]) messages = (await fetchMessagesFromWA(jid, 1, { before: {id, fromMe: false} }))
			// the message after the loaded message is the message required
			const [actual] = await fetchMessagesFromWA(jid, 1, { after: messages[0] && messages[0].key })
			message = actual
			return message
		},
		searchMessages: async(txt: string, inJid: string | null, count: number, page: number) => {
			const {data, attributes}: BinaryNode = await query({
				json: new BinaryNode(
					'query',
					{
						epoch: currentEpoch().toString(),
						type: 'search',
						search: txt,
						count: count.toString(),
						page: page.toString(),
						jid: inJid
					}
				), 
				binaryTag: [24, WAFlag.ignore], 
				expect200: true
			}) // encrypt and send  off

			const messages = Array.isArray(data) ? data.map(item => item.data as WAMessage) : []
			return { 
				last: attributes?.last === 'true', 
				messages 
			}
		},
		sendWAMessage: async(
			jid: string,
			content: AnyMessageContent,
			options: MiscMessageGenerationOptions & { waitForAck?: boolean }
		) => {
			const userJid = getState().user?.jid
			if(
				typeof content === 'object' &&
				'disappearingMessagesInChat' in content &&
				typeof content['disappearingMessagesInChat'] !== 'undefined' &&
				isGroupID(jid)
			) {
				const { disappearingMessagesInChat } = content
				const value = typeof disappearingMessagesInChat === 'boolean' ? 
						(disappearingMessagesInChat ? WA_DEFAULT_EPHEMERAL : 0) :
						disappearingMessagesInChat
				const tag = generateMessageTag(true)
				await setQuery([
					new BinaryNode(
						'group',
						{ id: tag, jid, type: 'prop', author: userJid },
						[ new BinaryNode('ephemeral',  { value: value.toString() }) ]
					)
				], [WAMetric.group, WAFlag.other], tag)
			} else {
				const msg = await generateWAMessage(
					jid,
					content,
					{
						...options,
						userJid: userJid,
						getUrlInfo: generateUrlInfo,
						getMediaOptions: refreshMediaConn
					}
				)
				await relayWAMessage(msg, { waitForAck: options.waitForAck })
				return msg
			}
		}
	}
}

export default makeMessagesSocket