
import NodeCache from 'node-cache'
import { proto } from '../../WAProto'
import { WA_DEFAULT_EPHEMERAL } from '../Defaults'
import { AnyMessageContent, MediaConnInfo, MessageRelayOptions, MiscMessageGenerationOptions, SocketConfig } from '../Types'
import { encodeWAMessage, encryptSenderKeyMsgSignalProto, encryptSignalProto, extractDeviceJids, generateMessageID, generateWAMessage, getWAUploadToServer, jidToSignalProtocolAddress, parseAndInjectE2ESessions } from '../Utils'
import { BinaryNode, BinaryNodeAttributes, getBinaryNodeChild, getBinaryNodeChildren, isJidGroup, jidDecode, jidEncode, jidNormalizedUser, JidWithDevice, reduceBinaryNodeToDictionary, S_WHATSAPP_NET } from '../WABinary'
import { makeGroupsSocket } from './groups'

export const makeMessagesSocket = (config: SocketConfig) => {
	const { logger } = config
	const sock = makeGroupsSocket(config)
	const { 
		ev,
		authState,
		query,
		generateMessageTag,
		sendNode,
		groupMetadata,
		groupToggleEphemeral
	} = sock

	const userDevicesCache = config.userDevicesCache || new NodeCache({
		stdTTL: 300, // 5 minutes
		useClones: false
	})
	let privacySettings: { [_: string]: string } | undefined

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
			privacySettings = reduceBinaryNodeToDictionary(content[0] as BinaryNode, 'category')
		}

		return privacySettings
	}

	let mediaConn: Promise<MediaConnInfo>
	const refreshMediaConn = async(forceGet = false) => {
		const media = await mediaConn
		if(!media || forceGet || (new Date().getTime()-media.fetchDate.getTime()) > media.ttl*1000) {
			mediaConn = (async() => {
				const result = await query({
					tag: 'iq',
					attrs: {
						type: 'set',
						xmlns: 'w:m',
						to: S_WHATSAPP_NET,
					},
					content: [ { tag: 'media_conn', attrs: { } } ]
				})
				const mediaConnNode = getBinaryNodeChild(result, 'media_conn')
				const node: MediaConnInfo = {
					hosts: getBinaryNodeChildren(mediaConnNode, 'host').map(
						item => item.attrs as any
					),
					auth: mediaConnNode.attrs.auth,
					ttl: +mediaConnNode.attrs.ttl,
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
	const sendReceipt = async(jid: string, participant: string | undefined, messageIds: string[], type: 'read' | 'read-self' | undefined) => {
		const node: BinaryNode = {
			tag: 'receipt',
			attrs: {
				id: messageIds[0],
				t: Date.now().toString(),
				to: jid,
			},
		}
		if(type) {
			node.attrs.type = type
		}

		if(participant) {
			node.attrs.participant = participant
		}

		const remainingMessageIds = messageIds.slice(1)
		if(remainingMessageIds.length) {
			node.content = [
				{
					tag: 'list',
					attrs: { },
					content: remainingMessageIds.map(id => ({
						tag: 'item',
						attrs: { id }
					}))
				}
			]
		}

		logger.debug({ jid, messageIds, type }, 'sending receipt for messages')
		await sendNode(node)
	}

	const sendReadReceipt = async(jid: string, participant: string | undefined, messageIds: string[]) => {
		const privacySettings = await fetchPrivacySettings()
		// based on privacy settings, we have to change the read type
		const readType = privacySettings.readreceipts === 'all' ? 'read' : 'read-self'
		return sendReceipt(jid, participant, messageIds, readType)
	}

	const getUSyncDevices = async(jids: string[], ignoreZeroDevices: boolean) => {
		const deviceResults: JidWithDevice[] = []
       
		const users: BinaryNode[] = []
		jids = Array.from(new Set(jids))
		for(let jid of jids) {
			const user = jidDecode(jid).user
			jid = jidNormalizedUser(jid)
			if(userDevicesCache.has(user)) {
				const devices: JidWithDevice[] = userDevicesCache.get(user)
				deviceResults.push(...devices)

				logger.trace({ user }, 'using cache for devices')
			} else {
				users.push({ tag: 'user', attrs: { jid } })
			}
		}

		const iq: BinaryNode = {
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
						context: 'message',
					},
					content: [
						{
							tag: 'query',
							attrs: { },
							content: [
								{ 
									tag: 'devices', 
									attrs: { version: '2' }
								}
							]
						},
						{ tag: 'list', attrs: { }, content: users }
					]
				},
			],
		}
		const result = await query(iq)
		const extracted = extractDeviceJids(result, authState.creds.me!.id, ignoreZeroDevices)
		const deviceMap: { [_: string]: JidWithDevice[] } = {}

		for(const item of extracted) {
			deviceMap[item.user] = deviceMap[item.user] || []
			deviceMap[item.user].push(item)

			deviceResults.push(item)
		}

		for(const key in deviceMap) {
			userDevicesCache.set(key, deviceMap[key])
		}

		return deviceResults
	}

	const assertSessions = async(jids: string[], force: boolean) => {
		let jidsRequiringFetch: string[] = []
		if(force) {
			jidsRequiringFetch = jids 
		} else {
			const addrs = jids.map(jid => jidToSignalProtocolAddress(jid).toString())
			const sessions = await authState.keys.get('session', addrs)
			for(const jid of jids) {
				const signalId = jidToSignalProtocolAddress(jid).toString()
				if(!sessions[signalId]) {
					jidsRequiringFetch.push(jid)
				}
			}
		}

		if(jidsRequiringFetch.length) {
			logger.debug({ jidsRequiringFetch }, 'fetching sessions')
			const result = await query({
				tag: 'iq',
				attrs: {
					xmlns: 'encrypt',
					type: 'get',
					to: S_WHATSAPP_NET,
				},
				content: [
					{
						tag: 'key',
						attrs: { },
						content: jidsRequiringFetch.map(
							jid => ({
								tag: 'user',
								attrs: { jid, reason: 'identity' },
							})
						)
					}
				]
			})
			await parseAndInjectE2ESessions(result, authState)
			return true
		}

		return false
	}

	const createParticipantNodes = async(jids: string[], bytes: Buffer) => {
		await assertSessions(jids, false)

		if(authState.keys.isInTransaction()) {
			await authState.keys.prefetch(
				'session', 
				jids.map(jid => jidToSignalProtocolAddress(jid).toString())
			)
		}
        
		const nodes = await Promise.all(
			jids.map(
				async jid => {
					const { type, ciphertext } = await encryptSignalProto(jid, bytes, authState)
					const node: BinaryNode = {
						tag: 'to',
						attrs: { jid },
						content: [{
							tag: 'enc',
							attrs: { v: '2', type },
							content: ciphertext
						}]
					}
					return node
				}
			)
		)
		return nodes
	}

	const relayMessage = async(
		jid: string, 
		message: proto.IMessage, 
		{ messageId: msgId, participant, additionalAttributes, cachedGroupMetadata }: MessageRelayOptions
	) => {
		const meId = authState.creds.me!.id

		const { user, server } = jidDecode(jid)
		const isGroup = server === 'g.us'
		msgId = msgId || generateMessageID()

		const encodedMsg = encodeWAMessage(message)
		const participants: BinaryNode[] = []

		const destinationJid = jidEncode(user, isGroup ? 'g.us' : 's.whatsapp.net')

		const binaryNodeContent: BinaryNode[] = []

		const devices: JidWithDevice[] = []
		if(participant) {
			const { user, device } = jidDecode(participant)
			devices.push({ user, device })
		}

		await authState.keys.transaction(
			async() => {
				if(isGroup) {
					const { ciphertext, senderKeyDistributionMessageKey } = await encryptSenderKeyMsgSignalProto(destinationJid, encodedMsg, meId, authState)
                    
					const [groupData, senderKeyMap] = await Promise.all([
						(async() => {
							let groupData = cachedGroupMetadata ? await cachedGroupMetadata(jid) : undefined 
							if(!groupData) {
								groupData = await groupMetadata(jid)
							}

							return groupData
						})(),
						(async() => {
							const result = await authState.keys.get('sender-key-memory', [jid])
							return result[jid] || { }
						})()
					])
        
					if(!participant) {
						const participantsList = groupData.participants.map(p => p.id)
						const additionalDevices = await getUSyncDevices(participantsList, false)
						devices.push(...additionalDevices)
					}
        
					const senderKeyJids: string[] = []
					// ensure a connection is established with every device
					for(const { user, device } of devices) {
						const jid = jidEncode(user, 's.whatsapp.net', device)
						if(!senderKeyMap[jid]) {
							senderKeyJids.push(jid)
							// store that this person has had the sender keys sent to them
							senderKeyMap[jid] = true
						}
					}

					// if there are some participants with whom the session has not been established
					// if there are, we re-send the senderkey
					if(senderKeyJids.length) {
						logger.debug({ senderKeyJids }, 'sending new sender key')
        
						const encSenderKeyMsg = encodeWAMessage({
							senderKeyDistributionMessage: {
								axolotlSenderKeyDistributionMessage: senderKeyDistributionMessageKey,
								groupId: destinationJid
							}
						})
        
						participants.push(
							...(await createParticipantNodes(senderKeyJids, encSenderKeyMsg))
						)
					}
        
					binaryNodeContent.push({
						tag: 'enc',
						attrs: { v: '2', type: 'skmsg' },
						content: ciphertext
					})
        
					await authState.keys.set({ 'sender-key-memory': { [jid]: senderKeyMap } })
				} else {
					const { user: meUser } = jidDecode(meId)
                    
					const encodedMeMsg = encodeWAMessage({
						deviceSentMessage: {
							destinationJid,
							message
						}
					})
        
					if(!participant) {
						devices.push({ user })
						devices.push({ user: meUser })
                        
						const additionalDevices = await getUSyncDevices([ meId, jid ], true)
						devices.push(...additionalDevices)
					}
        
					const meJids: string[] = []
					const otherJids: string[] = []
					for(const { user, device } of devices) {
						const jid = jidEncode(user, 's.whatsapp.net', device)
						const isMe = user === meUser
						if(isMe) {
							meJids.push(jid)
						} else {
							otherJids.push(jid)
						}
					}
        
					const [meNodes, otherNodes] = await Promise.all([
						createParticipantNodes(meJids, encodedMeMsg),
						createParticipantNodes(otherJids, encodedMsg)
					])
					participants.push(...meNodes)
					participants.push(...otherNodes)
				}
        
				if(participants.length) {
					binaryNodeContent.push({
						tag: 'participants',
						attrs: { },
						content: participants
					})
				}
        
				const stanza: BinaryNode = {
					tag: 'message',
					attrs: {
						id: msgId,
						type: 'text',
						to: destinationJid,
						...(additionalAttributes || {})
					},
					content: binaryNodeContent
				}
                
				const shouldHaveIdentity = !!participants.find(
					participant => (participant.content! as BinaryNode[]).find(n => n.attrs.type === 'pkmsg')
				)
        
				if(shouldHaveIdentity) {
					(stanza.content as BinaryNode[]).push({
						tag: 'device-identity',
						attrs: { },
						content: proto.ADVSignedDeviceIdentity.encode(authState.creds.account).finish()
					})
        
					logger.debug({ jid }, 'adding device identity')
				}
        
				logger.debug({ msgId }, `sending message to ${participants.length} devices`)
        
				await sendNode(stanza)
			}
		)

		return msgId
	} 

	const waUploadToServer = getWAUploadToServer(config, refreshMediaConn)
    
	return {
		...sock,
		assertSessions,
		relayMessage,
		sendReceipt,
		sendReadReceipt,
		refreshMediaConn,
	    waUploadToServer,
		fetchPrivacySettings,
		sendMessage: async(
			jid: string,
			content: AnyMessageContent,
			options: MiscMessageGenerationOptions = { }
		) => {
			const userJid = authState.creds.me!.id
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
				await groupToggleEphemeral(jid, value)
			} else {
				const fullMsg = await generateWAMessage(
					jid,
					content,
					{
						logger,
						userJid,
						// multi-device does not have this yet
						//getUrlInfo: generateUrlInfo,
						upload: waUploadToServer,
						mediaCache: config.mediaCache,
						...options,
					}
				)
				const isDeleteMsg = 'delete' in content && !!content.delete
				const additionalAttributes: BinaryNodeAttributes = { }
				// required for delete
				if(isDeleteMsg) {
					additionalAttributes.edit = '7'
				}

				await relayMessage(jid, fullMsg.message, { messageId: fullMsg.key.id!, additionalAttributes })
				if(config.emitOwnEvents) {
					process.nextTick(() => {
						ev.emit('messages.upsert', { messages: [fullMsg], type: 'append' })
					})
				}

				return fullMsg
			}
		}
	}
}
