
import got from "got"
import { Boom } from "@hapi/boom"
import { SocketConfig, MediaConnInfo, AnyMessageContent, MiscMessageGenerationOptions, WAMediaUploadFunction, MessageRelayOptions, WAMessageKey } from "../Types"
import { encodeWAMessage, generateMessageID, generateWAMessage, encryptSenderKeyMsgSignalProto, encryptSignalProto, extractDeviceJids, jidToSignalProtocolAddress, parseAndInjectE2ESession } from "../Utils"
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, isJidGroup, jidDecode, jidEncode, jidNormalizedUser, S_WHATSAPP_NET, BinaryNodeAttributes, JidWithDevice } from '../WABinary'
import { proto } from "../../WAProto"
import { WA_DEFAULT_EPHEMERAL, DEFAULT_ORIGIN, MEDIA_PATH_MAP } from "../Defaults"
import { makeGroupsSocket } from "./groups"
import NodeCache from "node-cache"

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
            const result = await query({
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
            const nodes = getBinaryNodeChildren(result, 'category')
            privacySettings = nodes.reduce(
                (dict, { attrs }) => {
                    dict[attrs.name] = attrs.value
                    return dict
                }, { } as { [_: string]: string }
            )
        }
        return privacySettings
    }

    let mediaConn: Promise<MediaConnInfo>
    const refreshMediaConn = async(forceGet = false) => {
        let media = await mediaConn
        if (!media || forceGet || (new Date().getTime()-media.fetchDate.getTime()) > media.ttl*1000) {
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

        logger.debug({ jid, messageIds }, 'reading messages')
        await sendNode(node)
    }

    const sendDeliveryReceipt = (jid: string, participant: string | undefined, messageIds: string[]) => {
        return sendReceipt(jid, participant, messageIds, undefined)
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
        const { device } = jidDecode(authState.creds.me!.id)
        
        const extracted = extractDeviceJids(result, device, ignoreZeroDevices)
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

    const assertSession = async(jid: string, force: boolean) => {
        const addr = jidToSignalProtocolAddress(jid).toString()
        const session = await authState.keys.getSession(addr)
        if(!session || force) {
            logger.debug({ jid }, `fetching session`)
            const identity: BinaryNode = {
                tag: 'user',
                attrs: { jid, reason: 'identity' },
            }
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
                        content: [ identity ]
                    }
                ]
            })
            await parseAndInjectE2ESession(result, authState)
            return true
        }
        return false
    }

    const createParticipantNode = async(jid: string, bytes: Buffer) => {
        await assertSession(jid, false)

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

    const relayMessage = async(
        jid: string, 
        message: proto.IMessage, 
        { messageId: msgId, additionalAttributes, cachedGroupMetadata }: MessageRelayOptions
    ) => {
        const { user, server } = jidDecode(jid)
        const isGroup = server === 'g.us'
        msgId = msgId || generateMessageID()

        const encodedMsg = encodeWAMessage(message)
        const participants: BinaryNode[] = []
        let stanza: BinaryNode

        const destinationJid = jidEncode(user, isGroup ? 'g.us' : 's.whatsapp.net')

        if(isGroup) {
            const { ciphertext, senderKeyDistributionMessageKey } = await encryptSenderKeyMsgSignalProto(destinationJid, encodedMsg, authState.creds.me!.id, authState)
            
            let groupData = cachedGroupMetadata ? await cachedGroupMetadata(jid) : undefined 
            if(!groupData) groupData = await groupMetadata(jid)

            const participantsList = groupData.participants.map(p => p.id)
            const devices = await getUSyncDevices(participantsList, false)

            logger.debug(`got ${devices.length} additional devices`)

            const encSenderKeyMsg = encodeWAMessage({
                senderKeyDistributionMessage: {
                    axolotlSenderKeyDistributionMessage: senderKeyDistributionMessageKey,
                    groupId: destinationJid
                }
            })

            for(const {user, device} of devices) {
                const jid = jidEncode(user, 's.whatsapp.net', device)
                const participant = await createParticipantNode(jid, encSenderKeyMsg)
                participants.push(participant)
            }

            const binaryNodeContent: BinaryNode[] = []
            if( // if there are some participants with whom the session has not been established
                // if there are, we overwrite the senderkey
                !!participants.find((p) => (
                    !!(p.content as BinaryNode[]).find(({ attrs }) => attrs.type == 'pkmsg')
                ))
            ) {
                binaryNodeContent.push({
                    tag: 'participants',
                    attrs: { },
                    content: participants
                })
            }

            binaryNodeContent.push({
                tag: 'enc',
                attrs: { v: '2', type: 'skmsg' },
                content: ciphertext
            })

            stanza = {
                tag: 'message',
                attrs: {
                    id: msgId,
                    type: 'text',
                    to: destinationJid
                },
                content: binaryNodeContent
            }
        } else {
            const { user: meUser } = jidDecode(authState.creds.me!.id!)
            
            const messageToMyself: proto.IMessage = {
                deviceSentMessage: {
                    destinationJid,
                    message
                }
            }
            const encodedMeMsg = encodeWAMessage(messageToMyself)

            participants.push(
                await createParticipantNode(jidEncode(user, 's.whatsapp.net'), encodedMsg)
            )
            participants.push(
                await createParticipantNode(jidEncode(meUser, 's.whatsapp.net'), encodedMeMsg)
            )
            const devices = await getUSyncDevices([ authState.creds.me!.id!, jid ], true)

            logger.debug(`got ${devices.length} additional devices`)

            for(const { user, device } of devices) {
                const isMe = user === meUser
                participants.push(
                    await createParticipantNode(
                        jidEncode(user, 's.whatsapp.net', device),
                        isMe ? encodedMeMsg : encodedMsg
                    )
                )
            }

            stanza = {
                tag: 'message',
                attrs: {
                    id: msgId,
                    type: 'text',
                    to: destinationJid,
                    ...(additionalAttributes || {})
                },
                content: [
                    {
                        tag: 'participants',
                        attrs: { },
                        content: participants
                    },
                ]
            }
        }

        const shouldHaveIdentity = !!participants.find((p) => (
            !!(p.content as BinaryNode[]).find(({ attrs }) => attrs.type == 'pkmsg')
        ))
        
        if(shouldHaveIdentity) {
            (stanza.content as BinaryNode[]).push({
                tag: 'device-identity',
                attrs: { },
                content: proto.ADVSignedDeviceIdentity.encode(authState.creds.account).finish()
            })
        }
        logger.debug({ msgId }, 'sending message')

        await sendNode(stanza)

        return msgId
    } 

    const waUploadToServer: WAMediaUploadFunction = async(stream, { mediaType, fileEncSha256B64, timeoutMs }) => {
		// send a query JSON to obtain the url & auth token to upload our media
		let uploadInfo = await refreshMediaConn(false)

		let mediaUrl: string
		for (let host of uploadInfo.hosts) {
			const auth = encodeURIComponent(uploadInfo.auth) // the auth token
			const url = `https://${host.hostname}${MEDIA_PATH_MAP[mediaType]}/${fileEncSha256B64}?auth=${auth}&token=${fileEncSha256B64}`
			
			try {
				const {body: responseText} = await got.post(
					url, 
					{
						headers: { 
							'Content-Type': 'application/octet-stream',
							'Origin': DEFAULT_ORIGIN
						},
						agent: {
							https: config.agent
						},
						body: stream,
                        timeout: timeoutMs
					}
				)
				const result = JSON.parse(responseText)
				mediaUrl = result?.url
				
				if (mediaUrl) break
				else {
					uploadInfo = await refreshMediaConn(true)
					throw new Error(`upload failed, reason: ${JSON.stringify(result)}`)
				}
			} catch (error) {
				const isLast = host.hostname === uploadInfo.hosts[uploadInfo.hosts.length-1].hostname
				logger.debug(`Error in uploading to ${host.hostname} (${error}) ${isLast ? '' : ', retrying...'}`)
			}
		}
		if (!mediaUrl) {
			throw new Boom(
				'Media upload failed on all hosts',
				{ statusCode: 500 }
			)
		}
		return { mediaUrl }
	}

	return {
		...sock,
        assertSession,
        relayMessage,
        sendDeliveryReceipt,
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
						...options,
						logger,
						userJid,
                        // multi-device does not have this yet
						//getUrlInfo: generateUrlInfo,
						upload: waUploadToServer,
                        mediaCache: config.mediaCache,
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
