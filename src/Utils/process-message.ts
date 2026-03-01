/* eslint-disable @typescript-eslint/no-unused-vars */
import Long from 'long'
import { proto } from '../../WAProto/index.js'
import type {
	AuthenticationCreds,
	BaileysEventEmitter,
	CacheStore,
	Chat,
	GroupMetadata,
	GroupParticipant,
	LIDMapping,
	ParticipantAction,
	PlaceholderMessageData,
	RequestJoinAction,
	RequestJoinMethod,
	SignalKeyStoreWithTransaction,
	SignalRepositoryWithLIDStore,
	SocketConfig,
	WAMessage,
	WAMessageKey
} from '../Types'
import type { LIDMappingStore } from '../Signal/lid-mapping'
import { WAMessageStubType } from '../Types'
import { getContentType, normalizeMessageContent } from '../Utils/messages'
import {
	areJidsSameUser,
	isAnyLidUser,
	isAnyPnUser,
	isHostedLidUser,
	isHostedPnUser,
	isJidBroadcast,
	isJidStatusBroadcast,
	isLidUser,
	jidDecode,
	jidEncode,
	jidNormalizedUser
} from '../WABinary'
import { aesDecryptGCM, hmacSign } from './crypto'
import { getKeyAuthor, toNumber } from './generics'
import { downloadAndProcessHistorySyncNotification } from './history'
import type { ILogger } from './logger'
import { metrics, recordHistorySyncMessages } from './prometheus-metrics.js'

type ProcessMessageContext = {
	shouldProcessHistoryMsg: boolean
	placeholderResendCache?: CacheStore
	creds: AuthenticationCreds
	keyStore: SignalKeyStoreWithTransaction
	ev: BaileysEventEmitter
	logger?: ILogger
	options: RequestInit
	signalRepository: SignalRepositoryWithLIDStore
	getMessage: SocketConfig['getMessage']
}

const REAL_MSG_STUB_TYPES = new Set([
	WAMessageStubType.CALL_MISSED_GROUP_VIDEO,
	WAMessageStubType.CALL_MISSED_GROUP_VOICE,
	WAMessageStubType.CALL_MISSED_VIDEO,
	WAMessageStubType.CALL_MISSED_VOICE
])

const REAL_MSG_REQ_ME_STUB_TYPES = new Set([WAMessageStubType.GROUP_PARTICIPANT_ADD])

/** Cleans a received message to further processing */
export const cleanMessage = (message: WAMessage, meId: string, meLid: string) => {
	// ensure remoteJid and participant doesn't have device or agent in it
	if (isHostedPnUser(message.key.remoteJid!) || isHostedLidUser(message.key.remoteJid!)) {
		message.key.remoteJid = jidEncode(
			jidDecode(message.key?.remoteJid!)?.user!,
			isHostedPnUser(message.key.remoteJid!) ? 's.whatsapp.net' : 'lid'
		)
	} else {
		message.key.remoteJid = jidNormalizedUser(message.key.remoteJid!)
	}

	if (isHostedPnUser(message.key.participant!) || isHostedLidUser(message.key.participant!)) {
		message.key.participant = jidEncode(
			jidDecode(message.key.participant!)?.user!,
			isHostedPnUser(message.key.participant!) ? 's.whatsapp.net' : 'lid'
		)
	} else {
		message.key.participant = jidNormalizedUser(message.key.participant!)
	}

	const content = normalizeMessageContent(message.message)
	// if the message has a reaction, ensure fromMe & remoteJid are from our perspective
	if (content?.reactionMessage) {
		const reactionKey = content.reactionMessage.key
		if (reactionKey) {
			normaliseKey(reactionKey)
		}
	}

	if (content?.pollUpdateMessage) {
		const pollCreationKey = content.pollUpdateMessage.pollCreationMessageKey
		if (pollCreationKey) {
			normaliseKey(pollCreationKey)
		}
	}

	function normaliseKey(msgKey: WAMessageKey) {
		// if the reaction is from another user
		// we've to correctly map the key to this user's perspective
		if (!message.key.fromMe) {
			// if the sender believed the message being reacted to is not from them
			// we've to correct the key to be from them, or some other participant
			msgKey.fromMe = !msgKey.fromMe
				? areJidsSameUser(msgKey.participant || msgKey.remoteJid!, meId) ||
					areJidsSameUser(msgKey.participant || msgKey.remoteJid!, meLid)
				: // if the message being reacted to, was from them
					// fromMe automatically becomes false
					false
			// set the remoteJid to being the same as the chat the message came from
			// TODO: investigate inconsistencies
			msgKey.remoteJid = message.key.remoteJid
			// set participant of the message
			msgKey.participant = msgKey.participant || message.key.participant
		} else {
			// fromMe reactions/polls: normalise remoteJid to match the chat JID
			// ensures DM reaction keys are consistent with group behavior
			msgKey.remoteJid = message.key.remoteJid
			// in groups, normalise participant for own messages too
			if (message.key.participant) {
				msgKey.participant = msgKey.participant || message.key.participant
			}
		}
	}
}

/**
 * Resolves a LID JID to its PN equivalent using the LID mapping store.
 * Returns the original JID if it's not a LID or if no mapping is found.
 * Safe to call with any JID type (group, newsletter, PN, etc.).
 */
export const resolveLidToPn = async (
	jid: string | undefined | null,
	lidMapping: LIDMappingStore,
	logger?: ILogger
): Promise<string | undefined> => {
	if (!jid) {
		return undefined
	}

	if (isAnyLidUser(jid)) {
		const pn = await lidMapping.getPNForLID(jid)
		if (pn) {
			logger?.debug({ lid: jid, pn }, 'Resolved LID to PN')
		}

		return pn || jid
	}

	return jid
}

/**
 * Normalizes a WAMessageKey by resolving LID→PN for remoteJid and participant.
 */
export const normalizeKeyLidToPn = async (
	key: WAMessageKey,
	lidMapping: LIDMappingStore,
	logger?: ILogger
): Promise<void> => {
	const [resolvedRemoteJid, resolvedParticipant] = await Promise.all([
		resolveLidToPn(key.remoteJid, lidMapping, logger),
		resolveLidToPn(key.participant, lidMapping, logger)
	])
	if (resolvedRemoteJid) {
		key.remoteJid = resolvedRemoteJid
	}

	if (resolvedParticipant) {
		key.participant = resolvedParticipant
	}
}

export const normalizeMessageJids = async (
	message: WAMessage,
	signalRepository: SignalRepositoryWithLIDStore,
	logger?: ILogger
): Promise<void> => {
	const lidMapping = signalRepository.lidMapping
	const key = message.key

	// FAST PATH: Use alt JIDs directly when available (avoids LIDMappingStore race condition).
	// The stanza always carries both formats (LID + PN) in the attributes.
	// When addressing_mode=lid, remoteJid is LID and remoteJidAlt is PN.
	// When addressing_mode=pn, remoteJid is already PN (no conversion needed).
	if (key.remoteJid && isAnyLidUser(key.remoteJid) && key.remoteJidAlt && isAnyPnUser(key.remoteJidAlt)) {
		logger?.debug({ lid: key.remoteJid, pn: key.remoteJidAlt }, 'Resolved remoteJid LID→PN via alt (fast path)')
		key.remoteJid = key.remoteJidAlt
	}

	if (key.participant && isAnyLidUser(key.participant) && key.participantAlt && isAnyPnUser(key.participantAlt)) {
		logger?.debug({ lid: key.participant, pn: key.participantAlt }, 'Resolved participant LID→PN via alt (fast path)')
		key.participant = key.participantAlt
	}

	// SLOW PATH: Resolve any remaining LIDs via LIDMappingStore lookup
	await normalizeKeyLidToPn(key, lidMapping, logger)

	// Also normalize participantAlt (the alternative JID format — can be LID when addressing_mode=pn)
	if (key.participantAlt && isAnyLidUser(key.participantAlt)) {
		const resolved = await resolveLidToPn(key.participantAlt, lidMapping, logger)
		if (resolved) {
			key.participantAlt = resolved
		}
	}

	// Normalize nested message keys (reaction, poll) that may contain LID JIDs
	const content = normalizeMessageContent(message.message)
	if (content?.reactionMessage?.key) {
		await normalizeKeyLidToPn(content.reactionMessage.key, lidMapping, logger)
	}

	if (content?.pollUpdateMessage?.pollCreationMessageKey) {
		await normalizeKeyLidToPn(content.pollUpdateMessage.pollCreationMessageKey, lidMapping, logger)
	}
}

// TODO: target:audit AUDIT THIS FUNCTION AGAIN
export const isRealMessage = (message: WAMessage) => {
	const normalizedContent = normalizeMessageContent(message.message)
	const hasSomeContent = !!getContentType(normalizedContent)
	const stubType = message.messageStubType ?? 0
	return (
		(!!normalizedContent || REAL_MSG_STUB_TYPES.has(stubType) || REAL_MSG_REQ_ME_STUB_TYPES.has(stubType)) &&
		hasSomeContent &&
		!normalizedContent?.protocolMessage &&
		!normalizedContent?.reactionMessage &&
		!normalizedContent?.pollUpdateMessage
	)
}

export const shouldIncrementChatUnread = (message: WAMessage) => !message.key.fromMe && !message.messageStubType

/**
 * Get the ID of the chat from the given key.
 * Typically -- that'll be the remoteJid, but for broadcasts, it'll be the participant
 */
export const getChatId = ({ remoteJid, participant, fromMe }: WAMessageKey) => {
	if (isJidBroadcast(remoteJid!) && !isJidStatusBroadcast(remoteJid!) && !fromMe) {
		return participant!
	}

	return remoteJid!
}

type PollContext = {
	/** normalised jid of the person that created the poll */
	pollCreatorJid: string
	/** ID of the poll creation message */
	pollMsgId: string
	/** poll creation message enc key */
	pollEncKey: Uint8Array
	/** jid of the person that voted */
	voterJid: string
}

type EventContext = {
	/** normalised jid of the person that created the event */
	eventCreatorJid: string
	/** ID of the event creation message */
	eventMsgId: string
	/** event creation message enc key */
	eventEncKey: Uint8Array
	/** jid of the person that responded */
	responderJid: string
}

/**
 * Decrypt a poll vote
 * @param vote encrypted vote
 * @param ctx additional info about the poll required for decryption
 * @returns list of SHA256 options
 */
export function decryptPollVote(
	{ encPayload, encIv }: proto.Message.IPollEncValue,
	{ pollCreatorJid, pollMsgId, pollEncKey, voterJid }: PollContext
) {
	const sign = Buffer.concat([
		toBinary(pollMsgId),
		toBinary(pollCreatorJid),
		toBinary(voterJid),
		toBinary('Poll Vote'),
		new Uint8Array([1])
	])

	const key0 = hmacSign(pollEncKey, new Uint8Array(32), 'sha256')
	const decKey = hmacSign(sign, key0, 'sha256')
	const aad = toBinary(`${pollMsgId}\u0000${voterJid}`)

	if (!encPayload || !encIv) {
		throw new Error('Missing encPayload or encIv for poll vote decryption')
	}

	const decrypted = aesDecryptGCM(encPayload, decKey, encIv, aad)
	return proto.Message.PollVoteMessage.decode(decrypted)

	function toBinary(txt: string) {
		return Buffer.from(txt)
	}
}

/**
 * Decrypt an event response
 * @param response encrypted event response
 * @param ctx additional info about the event required for decryption
 * @returns event response message
 */
export function decryptEventResponse(
	{ encPayload, encIv }: proto.Message.IPollEncValue,
	{ eventCreatorJid, eventMsgId, eventEncKey, responderJid }: EventContext
) {
	const sign = Buffer.concat([
		toBinary(eventMsgId),
		toBinary(eventCreatorJid),
		toBinary(responderJid),
		toBinary('Event Response'),
		new Uint8Array([1])
	])

	const key0 = hmacSign(eventEncKey, new Uint8Array(32), 'sha256')
	const decKey = hmacSign(sign, key0, 'sha256')
	const aad = toBinary(`${eventMsgId}\u0000${responderJid}`)

	if (!encPayload || !encIv) {
		throw new Error('Missing encPayload or encIv for event response decryption')
	}

	const decrypted = aesDecryptGCM(encPayload, decKey, encIv, aad)
	return proto.Message.EventResponseMessage.decode(decrypted)

	function toBinary(txt: string) {
		return Buffer.from(txt)
	}
}

const processMessage = async (
	message: WAMessage,
	{
		shouldProcessHistoryMsg,
		placeholderResendCache,
		ev,
		creds,
		signalRepository,
		keyStore,
		logger,
		options,
		getMessage
	}: ProcessMessageContext
) => {
	const meUser = creds.me
	if (!meUser) {
		logger?.warn({ messageKey: message.key }, 'processMessage: creds.me not set, skipping message')
		return
	}

	const meId = meUser.id
	const { accountSettings } = creds

	const chat: Partial<Chat> = { id: jidNormalizedUser(getChatId(message.key)) }
	const isRealMsg = isRealMessage(message)

	if (isRealMsg) {
		chat.messages = [{ message }]
		chat.conversationTimestamp = toNumber(message.messageTimestamp)
		// only increment unread count if not CIPHERTEXT and from another person
		if (shouldIncrementChatUnread(message)) {
			chat.unreadCount = (chat.unreadCount || 0) + 1
		}
	}

	const content = normalizeMessageContent(message.message)

	// unarchive chat if it's a real message, or someone reacted to our message
	// and we've the unarchive chats setting on
	if ((isRealMsg || content?.reactionMessage?.key?.fromMe) && accountSettings?.unarchiveChats) {
		chat.archived = false
		chat.readOnly = false
	}

	const protocolMsg = content?.protocolMessage
	if (protocolMsg) {
		switch (protocolMsg.type) {
			case proto.Message.ProtocolMessage.Type.HISTORY_SYNC_NOTIFICATION:
				const histNotification = protocolMsg.historySyncNotification
				if (!histNotification) {
					break
				}

				const process = shouldProcessHistoryMsg
				const isLatest = !creds.processedHistoryMessages?.length

				logger?.info(
					{
						histNotification,
						process,
						id: message.key.id,
						isLatest
					},
					'got history notification'
				)

				if (process) {
					// TODO: investigate
					if (histNotification.syncType !== proto.HistorySync.HistorySyncType.ON_DEMAND) {
						ev.emit('creds.update', {
							processedHistoryMessages: [
								...(creds.processedHistoryMessages || []),
								{ key: message.key, messageTimestamp: message.messageTimestamp }
							]
						})
					}

					const data = await downloadAndProcessHistorySyncNotification(histNotification, options, logger)

					// Emit LID-PN mappings from history sync
					// This is how WhatsApp Web learns mappings for chats with non-contacts
					if (data.lidPnMappings?.length) {
						logger?.debug({ count: data.lidPnMappings.length }, 'processing LID-PN mappings from history sync')
						// eslint-disable-next-line max-depth
						try {
							const result = await signalRepository.lidMapping.storeLIDPNMappings(data.lidPnMappings)
							logger?.debug(
								{ stored: result.stored, skipped: result.skipped, errors: result.errors },
								'stored LID-PN mappings from history sync'
							)
							// eslint-disable-next-line max-depth
							if (result.stored > 0) {
								logger?.info({ stored: result.stored }, 'fallback LID mappings are now available from history sync')
							}
						} catch (error) {
							logger?.warn({ error }, 'Failed to store LID-PN mappings from history sync')
						}

						// Emit all mappings at once for better performance
						// eslint-disable-next-line max-depth
						if (data.lidPnMappings.length > 0) {
							ev.emit('lid-mapping.update', data.lidPnMappings)
						}
					}

					ev.emit('messaging-history.set', {
						...data,
						isLatest: histNotification.syncType !== proto.HistorySync.HistorySyncType.ON_DEMAND ? isLatest : undefined,
						chunkOrder: histNotification.chunkOrder,
						peerDataRequestSessionId: histNotification.peerDataRequestSessionId
					})

					// Record history sync metrics
					if (data.messages?.length) {
						recordHistorySyncMessages(data.messages.length)
					}
				}

				break
			case proto.Message.ProtocolMessage.Type.APP_STATE_SYNC_KEY_SHARE:
				const keys = protocolMsg.appStateSyncKeyShare?.keys
				if (keys?.length) {
					let newAppStateSyncKeyId = ''
					await keyStore.transaction(async () => {
						const newKeys: string[] = []
						for (const { keyData, keyId } of keys) {
							const keyIdValue = keyId?.keyId
							if (!keyIdValue) {
								continue
							}

							const strKeyId = Buffer.from(keyIdValue).toString('base64')
							newKeys.push(strKeyId)

							if (keyData) {
								await keyStore.set({ 'app-state-sync-key': { [strKeyId]: keyData } })
							}

							newAppStateSyncKeyId = strKeyId
						}

						logger?.info({ newAppStateSyncKeyId, newKeys }, 'injecting new app state sync keys')
					}, meId)

					ev.emit('creds.update', { myAppStateKeyId: newAppStateSyncKeyId })
				} else {
					logger?.info({ protocolMsg }, 'recv app state sync with 0 keys')
				}

				break
			case proto.Message.ProtocolMessage.Type.REVOKE:
				ev.emit('messages.update', [
					{
						key: {
							...message.key,
							id: protocolMsg.key?.id
						},
						update: { message: null, messageStubType: WAMessageStubType.REVOKE, key: message.key }
					}
				])
				break
			case proto.Message.ProtocolMessage.Type.EPHEMERAL_SETTING:
				Object.assign(chat, {
					ephemeralSettingTimestamp: toNumber(message.messageTimestamp),
					ephemeralExpiration: protocolMsg.ephemeralExpiration || null
				})
				break
			case proto.Message.ProtocolMessage.Type.PEER_DATA_OPERATION_REQUEST_RESPONSE_MESSAGE:
				const response = protocolMsg.peerDataOperationRequestResponseMessage
				if (response) {
					// Retrieve cached metadata BEFORE deletion
					// This preserves original message details that the phone might not send
					const cachedData = response.stanzaId
						? await placeholderResendCache?.get<PlaceholderMessageData | boolean>(response.stanzaId)
						: undefined

					// Clean up cache after retrieving data
					if (response.stanzaId) {
						await placeholderResendCache?.del(response.stanzaId)
					}

					// TODO: IMPLEMENT HISTORY SYNC ETC (sticker uploads etc.).
					const { peerDataOperationResult } = response
					if (!peerDataOperationResult) {
						break
					}

					let recoveredCount = 0
					for (const result of peerDataOperationResult) {
						const { placeholderMessageResendResponse: retryResponse } = result
						//eslint-disable-next-line max-depth
						if (retryResponse) {
							// eslint-disable-next-line max-depth
							if (!retryResponse.webMessageInfoBytes) {
								continue
							}

							const webMessageInfo = proto.WebMessageInfo.decode(retryResponse.webMessageInfoBytes)

							// Merge cached metadata with decoded message
							// This ensures we don't lose critical information like pushName and LID mappings
							// eslint-disable-next-line max-depth
							if (cachedData && typeof cachedData === 'object') {
								// Preserve pushName if not present in PDO response
								// eslint-disable-next-line max-depth
								if (cachedData.pushName && !webMessageInfo.pushName) {
									webMessageInfo.pushName = cachedData.pushName
									logger?.debug({ msgId: webMessageInfo.key?.id }, 'CTWA: Restored pushName from cached metadata')
								}

								// Preserve participantAlt (LID) if not present in PDO response
								// This is critical for maintaining LID/PN mapping in groups
								// eslint-disable-next-line max-depth
								if (cachedData.participantAlt && webMessageInfo.key) {
									const msgKey = webMessageInfo.key as WAMessageKey
									// eslint-disable-next-line max-depth
									if (!msgKey.participantAlt) {
										msgKey.participantAlt = cachedData.participantAlt
										logger?.debug(
											{ msgId: webMessageInfo.key?.id, participantAlt: cachedData.participantAlt },
											'CTWA: Restored participantAlt (LID) from cached metadata'
										)
									}
								}

								// Preserve original participant if not in PDO response
								// eslint-disable-next-line max-depth
								if (cachedData.participant && webMessageInfo.key && !webMessageInfo.key.participant) {
									webMessageInfo.key.participant = cachedData.participant
									logger?.debug({ msgId: webMessageInfo.key?.id }, 'CTWA: Restored participant from cached metadata')
								}

								// Only use cached timestamp if PDO response doesn't have one
								// PDO response timestamp is more authoritative if present
								// eslint-disable-next-line max-depth
								if (!webMessageInfo.messageTimestamp && cachedData.messageTimestamp) {
									webMessageInfo.messageTimestamp = cachedData.messageTimestamp
								}
							}

							// Track CTWA message recovery success
							recoveredCount++
							logger?.info(
								{
									msgId: webMessageInfo.key?.id,
									remoteJid: webMessageInfo.key?.remoteJid,
									requestId: response.stanzaId,
									hasMetadata: !!cachedData && typeof cachedData === 'object'
								},
								'CTWA: Successfully recovered message via placeholder resend'
							)

							// Normalize LID→PN in PDO-recovered message key before emitting
							// eslint-disable-next-line max-depth
							if (webMessageInfo.key && signalRepository) {
								await normalizeKeyLidToPn(webMessageInfo.key as WAMessageKey, signalRepository.lidMapping, logger)
							}

							// wait till another upsert event is available, don't want it to be part of the PDO response message
							// TODO: parse through proper message handling utilities (to add relevant key fields)
							ev.emit('messages.upsert', {
								messages: [webMessageInfo as WAMessage],
								type: 'notify',
								requestId: response.stanzaId!
							})
						}
					}

					// Update metrics for recovered messages
					if (recoveredCount > 0) {
						metrics.ctwaMessagesRecovered.inc(recoveredCount)
						metrics.ctwaRecoveryRequests.inc({ status: 'success' })
						logger?.debug(
							{ recoveredCount, requestId: response.stanzaId },
							'CTWA: Placeholder resend response processed'
						)
					}
				}

				break
			case proto.Message.ProtocolMessage.Type.MESSAGE_EDIT:
				ev.emit('messages.update', [
					{
						// flip the sender / fromMe properties because they're in the perspective of the sender
						key: { ...message.key, id: protocolMsg.key?.id },
						update: {
							message: {
								editedMessage: {
									message: protocolMsg.editedMessage
								}
							},
							messageTimestamp: protocolMsg.timestampMs
								? Math.floor(toNumber(protocolMsg.timestampMs) / 1000)
								: message.messageTimestamp
						}
					}
				])
				break
			case proto.Message.ProtocolMessage.Type.GROUP_MEMBER_LABEL_CHANGE:
				const labelAssociationMsg = protocolMsg.memberLabel
				if (labelAssociationMsg?.label) {
					ev.emit('group.member-tag.update', {
						groupId: chat.id!,
						label: labelAssociationMsg.label,
						participant: message.key.participant!,
						participantAlt: message.key.participantAlt!,
						messageTimestamp: Number(message.messageTimestamp)
					})
				}

				break
			case proto.Message.ProtocolMessage.Type.LID_MIGRATION_MAPPING_SYNC:
				const encodedPayload = protocolMsg.lidMigrationMappingSyncMessage?.encodedMappingPayload
				if (!encodedPayload) {
					break
				}

				const { pnToLidMappings, chatDbMigrationTimestamp } =
					proto.LIDMigrationMappingSyncPayload.decode(encodedPayload)
				logger?.debug({ pnToLidMappings, chatDbMigrationTimestamp }, 'got lid mappings and chat db migration timestamp')
				const pairs = []
				for (const { pn, latestLid, assignedLid } of pnToLidMappings) {
					const lid = latestLid || assignedLid
					pairs.push({ lid: `${lid}@lid`, pn: `${pn}@s.whatsapp.net` })
				}

				await signalRepository.lidMapping.storeLIDPNMappings(pairs)
				if (pairs.length) {
					for (const { pn, lid } of pairs) {
						await signalRepository.migrateSession(pn, lid)
					}
				}
		}
	} else if (content?.reactionMessage) {
		const reactionKey = content.reactionMessage.key
		if (!reactionKey) {
			logger?.warn({ messageKey: message.key }, 'processMessage: reactionMessage.key missing, skipping')
			return
		}

		const reaction: proto.IReaction = {
			...content.reactionMessage,
			key: message.key
		}
		ev.emit('messages.reaction', [
			{
				reaction,
				key: reactionKey
			}
		])
	} else if (content?.encEventResponseMessage) {
		const encEventResponse = content.encEventResponseMessage
		const creationMsgKey = encEventResponse.eventCreationMessageKey
		if (!creationMsgKey) {
			logger?.warn({ messageKey: message.key }, 'processMessage: eventCreationMessageKey missing, skipping')
			return
		}

		// we need to fetch the event creation message to get the event enc key
		const eventMsg = await getMessage(creationMsgKey)
		if (eventMsg) {
			try {
				const meIdNormalised = jidNormalizedUser(meId)

				// all jids need to be PN
				const eventCreatorKey = creationMsgKey.participant || creationMsgKey.remoteJid!
				const eventCreatorPn = isLidUser(eventCreatorKey)
					? await signalRepository.lidMapping.getPNForLID(eventCreatorKey)
					: eventCreatorKey
				if (!eventCreatorPn) {
					logger?.warn({ messageKey: message.key, eventCreatorKey }, 'processMessage: eventCreatorPn missing, skipping')
					return
				}

				const eventCreatorJid = getKeyAuthor(
					{ remoteJid: jidNormalizedUser(eventCreatorPn), fromMe: meIdNormalised === eventCreatorPn },
					meIdNormalised
				)

				const responderJid = getKeyAuthor(message.key, meIdNormalised)
				const eventEncKey = eventMsg?.messageContextInfo?.messageSecret

				if (!eventEncKey) {
					logger?.warn({ creationMsgKey }, 'event response: missing messageSecret for decryption')
				} else {
					const responseMsg = decryptEventResponse(encEventResponse, {
						eventEncKey,
						eventCreatorJid,
						eventMsgId: creationMsgKey.id!,
						responderJid
					})

					const eventResponse = {
						eventResponseMessageKey: message.key,
						senderTimestampMs: responseMsg.timestampMs!,
						response: responseMsg
					}

					// Normalize creationMsgKey JIDs for the emitted event
					const normalizedCreationKey = { ...creationMsgKey }
					await normalizeKeyLidToPn(normalizedCreationKey, signalRepository.lidMapping, logger)

					ev.emit('messages.update', [
						{
							key: normalizedCreationKey,
							update: {
								eventResponses: [eventResponse]
							}
						}
					])
				}
			} catch (err) {
				logger?.warn({ err, creationMsgKey }, 'failed to decrypt event response')
			}
		} else {
			logger?.warn({ creationMsgKey }, 'event creation message not found, cannot decrypt response')
		}
	} else if (message.messageStubType) {
		const jid = message.key?.remoteJid!
		//let actor = whatsappID (message.participant)
		let participants: GroupParticipant[]
		const emitParticipantsUpdate = (action: ParticipantAction) =>
			ev.emit('group-participants.update', {
				id: jid,
				author: message.key.participant!,
				authorPn: message.key.participantAlt!,
				participants,
				action
			})
		const emitGroupUpdate = (update: Partial<GroupMetadata>) => {
			ev.emit('groups.update', [
				{ id: jid, ...update, author: message.key.participant ?? undefined, authorPn: message.key.participantAlt }
			])
		}

		const emitGroupRequestJoin = (participant: LIDMapping, action: RequestJoinAction, method: RequestJoinMethod) => {
			ev.emit('group.join-request', {
				id: jid,
				author: message.key.participant!,
				authorPn: message.key.participantAlt!,
				participant: participant.lid,
				participantPn: participant.pn,
				action,
				method: method!
			})
		}

		const participantsIncludesMe = () => participants.find(p => areJidsSameUser(meId, p.id) || areJidsSameUser(meId, p.phoneNumber))

		switch (message.messageStubType) {
			case WAMessageStubType.GROUP_PARTICIPANT_CHANGE_NUMBER:
				participants = message.messageStubParameters.map((a: any) => JSON.parse(a as string)) || []
				emitParticipantsUpdate('modify')
				break
			case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
			case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
				participants = message.messageStubParameters.map((a: any) => JSON.parse(a as string)) || []
				emitParticipantsUpdate('remove')
				// mark the chat read only if you left the group
				if (participantsIncludesMe()) {
					chat.readOnly = true
				}

				break
			case WAMessageStubType.GROUP_PARTICIPANT_ADD:
			case WAMessageStubType.GROUP_PARTICIPANT_INVITE:
			case WAMessageStubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
				participants = message.messageStubParameters.map((a: any) => JSON.parse(a as string)) || []
				if (participantsIncludesMe()) {
					chat.readOnly = false
				}

				emitParticipantsUpdate('add')
				break
			case WAMessageStubType.GROUP_PARTICIPANT_DEMOTE:
				participants = message.messageStubParameters.map((a: any) => JSON.parse(a as string)) || []
				emitParticipantsUpdate('demote')
				break
			case WAMessageStubType.GROUP_PARTICIPANT_PROMOTE:
				participants = message.messageStubParameters.map((a: any) => JSON.parse(a as string)) || []
				emitParticipantsUpdate('promote')
				break
			case WAMessageStubType.GROUP_CHANGE_ANNOUNCE:
				const announceValue = message.messageStubParameters?.[0]
				emitGroupUpdate({ announce: announceValue === 'true' || announceValue === 'on' })
				break
			case WAMessageStubType.GROUP_CHANGE_RESTRICT:
				const restrictValue = message.messageStubParameters?.[0]
				emitGroupUpdate({ restrict: restrictValue === 'true' || restrictValue === 'on' })
				break
			case WAMessageStubType.GROUP_CHANGE_SUBJECT:
				const name = message.messageStubParameters?.[0]
				chat.name = name
				emitGroupUpdate({ subject: name })
				break
			case WAMessageStubType.GROUP_CHANGE_DESCRIPTION:
				const description = message.messageStubParameters?.[0]
				chat.description = description
				emitGroupUpdate({ desc: description })
				break
			case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
				const code = message.messageStubParameters?.[0]
				emitGroupUpdate({ inviteCode: code })
				break
			case WAMessageStubType.GROUP_MEMBER_ADD_MODE:
				const memberAddValue = message.messageStubParameters?.[0]
				emitGroupUpdate({ memberAddMode: memberAddValue === 'all_member_add' })
				break
			case WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_MODE:
				const approvalMode = message.messageStubParameters?.[0]
				emitGroupUpdate({ joinApprovalMode: approvalMode === 'on' })
				break
			case WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD: // TODO: Add other events
				const participant = JSON.parse(message.messageStubParameters?.[0]) as LIDMapping
				const action = message.messageStubParameters?.[1] as RequestJoinAction
				const method = message.messageStubParameters?.[2] as RequestJoinMethod
				emitGroupRequestJoin(participant, action, method)
				break
		}
	} /*  else if(content?.pollUpdateMessage) {
		const creationMsgKey = content.pollUpdateMessage.pollCreationMessageKey!
		// we need to fetch the poll creation message to get the poll enc key
		// TODO: make standalone, remove getMessage reference
		// TODO: Remove entirely
		const pollMsg = await getMessage(creationMsgKey)
		if(pollMsg) {
			const meIdNormalised = jidNormalizedUser(meId)
			const pollCreatorJid = getKeyAuthor(creationMsgKey, meIdNormalised)
			const voterJid = getKeyAuthor(message.key, meIdNormalised)
			const pollEncKey = pollMsg.messageContextInfo?.messageSecret!

			try {
				const voteMsg = decryptPollVote(
					content.pollUpdateMessage.vote!,
					{
						pollEncKey,
						pollCreatorJid,
						pollMsgId: creationMsgKey.id!,
						voterJid,
					}
				)
				ev.emit('messages.update', [
					{
						key: creationMsgKey,
						update: {
							pollUpdates: [
								{
									pollUpdateMessageKey: message.key,
									vote: voteMsg,
									senderTimestampMs: (content.pollUpdateMessage.senderTimestampMs! as Long).toNumber(),
								}
							]
						}
					}
				])
			} catch(err) {
				logger?.warn(
					{ err, creationMsgKey },
					'failed to decrypt poll vote'
				)
			}
		} else {
			logger?.warn(
				{ creationMsgKey },
				'poll creation message not found, cannot decrypt update'
			)
		}
		} */

	if (Object.keys(chat).length > 1) {
		ev.emit('chats.update', [chat])
	}
}

export default processMessage
