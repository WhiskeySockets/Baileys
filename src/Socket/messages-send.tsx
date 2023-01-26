
import { Boom } from '@hapi/boom'
import NodeCache from 'node-cache'
import { proto } from '../../WAProto'
import { WA_DEFAULT_EPHEMERAL } from '../Defaults'
import { AnyMessageContent, MediaConnInfo, MessageReceiptType, MessageRelayOptions, MiscMessageGenerationOptions, WAMessageKey } from '../Types'
import { aggregateMessageKeysNotFromMe, assertMediaContent, bindWaitForEvent, decryptMediaRetryData, encodeSignedDeviceIdentity, encodeWAMessage, encryptMediaRetryRequest, encryptSenderKeyMsgSignalProto, encryptSignalProto, extractDeviceJids, generateMessageID, generateWAMessage, getStatusCodeForMediaRetry, getUrlFromDirectPath, getWAUploadToServer, jidToSignalProtocolAddress, parseAndInjectE2ESessions, unixTimestampSeconds } from '../Utils'
import { getUrlInfo } from '../Utils/link-preview'
import logger from '../Utils/logger'
import { areJidsSameUser, BinaryNode, BinaryNodeAttributes, getBinaryNodeChild, getBinaryNodeChildren, isJidGroup, isJidUser, jidDecode, jidEncode, jidNormalizedUser, JidWithDevice, S_WHATSAPP_NET } from '../WABinary'
import { Groups } from './groups'

export class MessagesSend extends Groups {
	userDevicesCache = this.config.userDevicesCache || new NodeCache({
		stdTTL: 300, // 5 minutes
		useClones: false
	})

	mediaConn: Promise<MediaConnInfo>

	refreshMediaConn = async(forceGet = false) => {
		const media = await this.mediaConn
		if(!media || forceGet || (new Date().getTime() - media.fetchDate.getTime()) > media.ttl * 1000) {
			this.mediaConn = (async() => {
				const result = await this.query(
					<iq type="set" xmlns="w:m" to={S_WHATSAPP_NET}>
						<media_conn/>
					</iq>
				)
				
				const mediaConnNode = getBinaryNodeChild(result, 'media_conn')
				const node: MediaConnInfo = {
					hosts: getBinaryNodeChildren(mediaConnNode, 'host').map(
						item => item.attrs as any
					),
					auth: mediaConnNode!.attrs.auth,
					ttl: +mediaConnNode!.attrs.ttl,
					fetchDate: new Date()
				}
				logger.debug('fetched media conn')
				return node
			})()
		}

		return this.mediaConn
	}

	/**
     * generic send receipt function
     * used for receipts of phone call, read, delivery etc.
     * */
	sendReceipt = async(jid: string, participant: string | undefined, messageIds: string[], type: MessageReceiptType) => {
		const node: BinaryNode = <receipt id={messageIds[0]} />
		const isReadReceipt = type === 'read' || type === 'read-self'
		if(isReadReceipt) {
			node.attrs.t = unixTimestampSeconds().toString()
		}

		if(type === 'sender' && isJidUser(jid)) {
			node.attrs.recipient = jid
			node.attrs.to = participant!
		} else {
			node.attrs.to = jid
			if(participant) {
				node.attrs.participant = participant
			}
		}

		if(type) {
			node.attrs.type = type
		}

		const remainingMessageIds = messageIds.slice(1)
		if(remainingMessageIds.length) {
			node.content = [
				<list>{remainingMessageIds.map(id => <item id={id} />)}</list>
			]
		}

		logger.debug({ attrs: node.attrs, messageIds }, 'sending receipt for messages')
		await this.sendNode(node)
	}

	/** Correctly bulk send receipts to multiple chats, participants */
	sendReceipts = async(keys: WAMessageKey[], type: MessageReceiptType) => {
		const recps = aggregateMessageKeysNotFromMe(keys)
		for(const { jid, participant, messageIds } of recps) {
			await this.sendReceipt(jid, participant, messageIds, type)
		}
	}

	/** Bulk read messages. Keys can be from different chats & participants */
	readMessages = async(keys: WAMessageKey[]) => {
		const privacySettings = await this.fetchPrivacySettings()
		// based on privacy settings, we have to change the read type
		const readType = privacySettings.readreceipts === 'all' ? 'read' : 'read-self'
		await this.sendReceipts(keys, readType)
 	}

	/** Fetch all the devices we've to send a message to */
	getUSyncDevices = async(jids: string[], useCache: boolean, ignoreZeroDevices: boolean) => {
		const deviceResults: JidWithDevice[] = []

		if(!useCache) {
			logger.debug('not using cache for devices')
		}

		const users: BinaryNode[] = []
		jids = Array.from(new Set(jids))
		for(let jid of jids) {
			const user = jidDecode(jid)?.user
			jid = jidNormalizedUser(jid)
			if(this.userDevicesCache.has(user!) && useCache) {
				const devices = this.userDevicesCache.get<JidWithDevice[]>(user!)!
				deviceResults.push(...devices)

				logger.trace({ user }, 'using cache for devices')
			} else {
				users.push(<user jid={jid} />)
			}
		}

		const result = await this.query(
			<iq to={S_WHATSAPP_NET} type="get" xmlns="usync">
				<usync sid={this.generateMessageTag()} mode="query" last="true" index="0" context="message">
					<query>
						<devices version="2" />
					</query>
					<list>{users}</list>
				</usync>
			</iq>
		)
		const extracted = extractDeviceJids(result, this.authState.creds.me!.id, ignoreZeroDevices)
		const deviceMap: { [_: string]: JidWithDevice[] } = {}

		for(const item of extracted) {
			deviceMap[item.user] = deviceMap[item.user] || []
			deviceMap[item.user].push(item)

			deviceResults.push(item)
		}

		for(const key in deviceMap) {
			this.userDevicesCache.set(key, deviceMap[key])
		}

		return deviceResults
	}

	assertSessions = async(jids: string[], force: boolean) => {
		let didFetchNewSession = false
		let jidsRequiringFetch: string[] = []
		if(force) {
			jidsRequiringFetch = jids
		} else {
			const addrs = jids.map(jid => jidToSignalProtocolAddress(jid).toString())
			const sessions = await this.authState.keys.get('session', addrs)
			for(const jid of jids) {
				const signalId = jidToSignalProtocolAddress(jid).toString()
				if(!sessions[signalId]) {
					jidsRequiringFetch.push(jid)
				}
			}
		}

		if(jidsRequiringFetch.length) {
			logger.debug({ jidsRequiringFetch }, 'fetching sessions')
			const result = await this.query(
				<iq to={S_WHATSAPP_NET} type="get" xmlns="encrypt">
					<key>
						{jidsRequiringFetch.map(jid => <user jid={jid} />)}
					</key>
				</iq>
			)
			await parseAndInjectE2ESessions(result, this.authState)

			didFetchNewSession = true
		}

		return didFetchNewSession
	}

	createParticipantNodes = async(
		jids: string[],
		message: proto.IMessage,
		extraAttrs?: BinaryNode['attrs']
	) => {
		const patched = await this.config.patchMessageBeforeSending(message, jids)
		const bytes = encodeWAMessage(patched)

		let shouldIncludeDeviceIdentity = false
		const nodes = await Promise.all(
			jids.map(
				async jid => {
					const { type, ciphertext } = await encryptSignalProto(jid, bytes, this.authState)
					if(type === 'pkmsg') {
						shouldIncludeDeviceIdentity = true
					}

					const node: BinaryNode = (
						<to jid={jid}>
							<enc v="2" type={type} {...extraAttrs || {}}>
								{ciphertext}
							</enc>
						</to>
					)

					return node
				}
			)
		)
		return { nodes, shouldIncludeDeviceIdentity }
	}

	relayMessage = async(
		jid: string,
		message: proto.IMessage,
		{ messageId: msgId, participant, additionalAttributes, useUserDevicesCache, cachedGroupMetadata }: MessageRelayOptions
	) => {
		const meId = this.authState.creds.me!.id

		let shouldIncludeDeviceIdentity = false

		const { user, server } = jidDecode(jid)!
		const isGroup = server === 'g.us'
		msgId = msgId || generateMessageID()
		useUserDevicesCache = useUserDevicesCache !== false

		const participants: BinaryNode[] = []
		const destinationJid = jidEncode(user, isGroup ? 'g.us' : 's.whatsapp.net')
		const binaryNodeContent: BinaryNode[] = []
		const devices: JidWithDevice[] = []

		const meMsg: proto.IMessage = {
			deviceSentMessage: {
				destinationJid,
				message
			}
		}

		if(participant) {
			// when the retry request is not for a group
			// only send to the specific device that asked for a retry
			// otherwise the message is sent out to every device that should be a recipient
			if(!isGroup) {
				additionalAttributes = { ...additionalAttributes, device_fanout: 'false' }
			}

			const { user, device } = jidDecode(participant.jid)!
			devices.push({ user, device })
		}

		await this.keys.transaction(
			async() => {
				if(isGroup) {
					const [groupData, senderKeyMap] = await Promise.all([
						(async() => {
							let groupData = cachedGroupMetadata ? await cachedGroupMetadata(jid) : undefined
							if(groupData) {
								logger.trace({ jid, participants: groupData.participants.length }, 'using cached group metadata')
							}

							if(!groupData) {
								groupData = await this.groupMetadata(jid)
							}

							return groupData
						})(),
						(async() => {
							if(!participant) {
								const result = await this.authState.keys.get('sender-key-memory', [jid])
								return result[jid] || { }
							}

							return { }
						})()
					])

					if(!participant) {
						const participantsList = groupData.participants.map(p => p.id)
						const additionalDevices = await this.getUSyncDevices(participantsList, !!useUserDevicesCache, false)
						devices.push(...additionalDevices)
					}

					const patched = await this.config.patchMessageBeforeSending(message, devices.map(d => jidEncode(d.user, 's.whatsapp.net', d.device)))
					const bytes = encodeWAMessage(patched)

					const { ciphertext, senderKeyDistributionMessageKey } = await encryptSenderKeyMsgSignalProto(
						destinationJid,
						bytes,
						meId,
						this.authState
					)

					const senderKeyJids: string[] = []
					// ensure a connection is established with every device
					for(const { user, device } of devices) {
						const jid = jidEncode(user, 's.whatsapp.net', device)
						if(!senderKeyMap[jid] || !!participant) {
							senderKeyJids.push(jid)
							// store that this person has had the sender keys sent to them
							senderKeyMap[jid] = true
						}
					}

					// if there are some participants with whom the session has not been established
					// if there are, we re-send the senderkey
					if(senderKeyJids.length) {
						logger.debug({ senderKeyJids }, 'sending new sender key')

						const senderKeyMsg: proto.IMessage = {
							senderKeyDistributionMessage: {
								axolotlSenderKeyDistributionMessage: senderKeyDistributionMessageKey,
								groupId: destinationJid
							}
						}

						await this.assertSessions(senderKeyJids, false)

						const result = await this.createParticipantNodes(senderKeyJids, senderKeyMsg)
						shouldIncludeDeviceIdentity = shouldIncludeDeviceIdentity || result.shouldIncludeDeviceIdentity

						participants.push(...result.nodes)
					}

					binaryNodeContent.push(<enc v="2" type="skmsg">{ciphertext}</enc>)

					await this.authState.keys.set({ 'sender-key-memory': { [jid]: senderKeyMap } })
				} else {
					const { user: meUser } = jidDecode(meId)!

					if(!participant) {
						devices.push({ user })
						devices.push({ user: meUser })

						const additionalDevices = await this.getUSyncDevices([ meId, jid ], !!useUserDevicesCache, true)
						devices.push(...additionalDevices)
					}

					const allJids: string[] = []
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

						allJids.push(jid)
					}

					await this.assertSessions(allJids, false)

					const [
						{ nodes: meNodes, shouldIncludeDeviceIdentity: s1 },
						{ nodes: otherNodes, shouldIncludeDeviceIdentity: s2 }
					] = await Promise.all([
						this.createParticipantNodes(meJids, meMsg),
						this.createParticipantNodes(otherJids, message)
					])
					participants.push(...meNodes)
					participants.push(...otherNodes)

					shouldIncludeDeviceIdentity = shouldIncludeDeviceIdentity || s1 || s2
				}

				if(participants.length) {
					binaryNodeContent.push(<participants>{participants}</participants>)
				}

				const stanza: BinaryNode = (
					<message id={msgId!} type="text" {...additionalAttributes}>
						{binaryNodeContent}
					</message>
				)
				// if the participant to send to is explicitly specified (generally retry recp)
				// ensure the message is only sent to that person
				// if a retry receipt is sent to everyone -- it'll fail decryption for everyone else who received the msg
				if(participant) {
					if(isJidGroup(destinationJid)) {
						stanza.attrs.to = destinationJid
						stanza.attrs.participant = participant.jid
					} else if(areJidsSameUser(participant.jid, meId)) {
						stanza.attrs.to = participant.jid
						stanza.attrs.recipient = destinationJid
					} else {
						stanza.attrs.to = participant.jid
					}
				} else {
					stanza.attrs.to = destinationJid
				}

				if(shouldIncludeDeviceIdentity) {
					if (!Array.isArray(stanza.content)) stanza.content = [] as BinaryNode[]

					stanza.content.push(
						<device-identity>
							{encodeSignedDeviceIdentity(this.authState.creds.account!, true)}
						</device-identity>
					)

					logger.debug({ jid }, 'adding device identity')
				}

				logger.debug({ msgId }, `sending message to ${participants.length} devices`)

				await this.sendNode(stanza)
			}
		)

		return msgId
	}

	getPrivacyTokens = async(jids: string[]) => {
		const t = unixTimestampSeconds().toString()

		return this.query(
			<iq to={S_WHATSAPP_NET} type='get' xmlns='privacy'>
				<tokens>
					{jids.map(jid => <token jid={jidNormalizedUser(jid)} t={t} type='trusted_contact' />)}
				</tokens>
			</iq>
		)
	}

	waUploadToServer = getWAUploadToServer(this.config, this.refreshMediaConn)

	waitForMsgMediaUpdate = bindWaitForEvent(this.ev, 'messages.media-update')

	updateMediaMessage = async(message: proto.IWebMessageInfo) => {
		const content = assertMediaContent(message.message)
		const mediaKey = content.mediaKey!
		const meId = this.authState.creds.me!.id
		const node = encryptMediaRetryRequest(message.key, mediaKey, meId)

		let error: Error | undefined = undefined
		await Promise.all(
			[
				this.sendNode(node),
				this.waitForMsgMediaUpdate(update => {
					const result = update.find(c => c.key.id === message.key.id)
					if(result) {
						if(result.error) {
							error = result.error
						} else {
							try {
								const media = decryptMediaRetryData(result.media!, mediaKey, result.key.id!)
								if(media.result !== proto.MediaRetryNotification.ResultType.SUCCESS) {
									const resultStr = proto.MediaRetryNotification.ResultType[media.result]
									throw new Boom(
										`Media re-upload failed by device (${resultStr})`,
										{ data: media, statusCode: getStatusCodeForMediaRetry(media.result) || 404 }
									)
								}

								content.directPath = media.directPath
								content.url = getUrlFromDirectPath(content.directPath!)

								logger.debug({ directPath: media.directPath, key: result.key }, 'media update successful')
							} catch(err) {
								error = err
							}
						}

						return true
					}
				})
			]
		)

		if(error) {
			throw error
		}

		this.ev.emit('messages.update', [
			{ key: message.key, update: { message: message.message } }
		])

		return message
	}

	sendMessage = async(
		jid: string,
		content: AnyMessageContent,
		options: MiscMessageGenerationOptions = { }
	) => {
		const userJid = this.authState.creds.me!.id
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
			await this.groupToggleEphemeral(jid, value)
		} else {
			const fullMsg = await generateWAMessage(
				jid,
				content,
				{
					logger,
					userJid,
					getUrlInfo: text => getUrlInfo(
						text,
						{
							thumbnailWidth: this.config.linkPreviewImageThumbnailWidth,
							fetchOpts: {
								timeout: 3_000,
								...this.config.options || { }
							},
							logger,
							uploadImage: this.config.generateHighQualityLinkPreview
								? this.waUploadToServer
								: undefined
						},
					),
					upload: this.waUploadToServer,
					mediaCache: this.config.mediaCache,
					...options,
				}
			)
			const isDeleteMsg = 'delete' in content && !!content.delete
			const additionalAttributes: BinaryNodeAttributes = { }
			// required for delete
			if(isDeleteMsg) {
				// if the chat is a group, and I am not the author, then delete the message as an admin
				if(isJidGroup(content.delete?.remoteJid as string) && !content.delete?.fromMe) {
					additionalAttributes.edit = '8'
				} else {
					additionalAttributes.edit = '7'
				}
			}

			await this.relayMessage(jid, fullMsg.message!, { messageId: fullMsg.key.id!, cachedGroupMetadata: options.cachedGroupMetadata, additionalAttributes })
			if(this.config.emitOwnEvents) {
				process.nextTick(() => {
					this.processingMutex.mutex(() => (
						this.upsertMessage(fullMsg, 'append')
					))
				})
			}

			return fullMsg
		}
	}
}