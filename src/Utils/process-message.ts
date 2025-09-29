import type { AxiosRequestConfig } from 'axios'
import { proto } from '../../WAProto/index.js'
import type {
	AuthenticationCreds,
	BaileysEventEmitter,
	CacheStore,
	Chat,
	GroupMetadata,
	ParticipantAction,
	RequestJoinAction,
	RequestJoinMethod,
	SignalKeyStoreWithTransaction,
	SignalRepositoryWithLIDStore
} from '../Types'
import { WAMessageAddressingMode, WAMessageStubType } from '../Types'
import { getContentType, normalizeMessageContent } from '../Utils/messages'
import { areJidsSameUser, isJidBroadcast, isJidStatusBroadcast, jidNormalizedUser } from '../WABinary'
import { aesDecryptGCM, hmacSign } from './crypto'
import { toNumber } from './generics'
import { downloadAndProcessHistorySyncNotification } from './history'
import type { ILogger } from './logger'
import logger from './logger'
import { decodeAndHydrate } from './proto-utils'

const GROUP_TAG = 'group'
const MEMBERSHIP_APPROVAL_REQUESTS = 'membership_approval_requests'
const MEMBER_ADD_MODE = 'member_add_mode'
const POLL_VOTE = 'Poll Vote'

type ProcessMessageContext = {
	shouldProcessHistoryMsg: boolean
	placeholderResendCache?: CacheStore
	creds: AuthenticationCreds
	keyStore: SignalKeyStoreWithTransaction
	ev: BaileysEventEmitter
	logger?: ILogger
	options: AxiosRequestConfig<{}>
	signalRepository: SignalRepositoryWithLIDStore
}

const REAL_MSG_STUB_TYPES = new Set([
	WAMessageStubType.CALL_MISSED_GROUP_VIDEO,
	WAMessageStubType.CALL_MISSED_GROUP_VOICE,
	WAMessageStubType.CALL_MISSED_VIDEO,
	WAMessageStubType.CALL_MISSED_VOICE
])

const REAL_MSG_REQ_ME_STUB_TYPES = new Set([WAMessageStubType.GROUP_PARTICIPANT_ADD])

/** Cleans a received message for further processing */
export const cleanMessage = (message: proto.IWebMessageInfo, meId: string): void => {
	message.key.remoteJid = jidNormalizedUser(message.key.remoteJid ?? '')
	message.key.participant = message.key.participant ? jidNormalizedUser(message.key.participant) : undefined
	const content = normalizeMessageContent(message.message)

	if (content?.reactionMessage) {
		normaliseKey(content.reactionMessage.key!)
	}

	if (content?.pollUpdateMessage) {
		normaliseKey(content.pollUpdateMessage.pollCreationMessageKey!)
	}

	function normaliseKey(msgKey: proto.IMessageKey): void {
		if (!message.key.fromMe) {
			msgKey.fromMe = !msgKey.fromMe
				? areJidsSameUser(msgKey.participant || msgKey.remoteJid!, meId)
				: false
			msgKey.remoteJid = message.key.remoteJid
			msgKey.participant = msgKey.participant || message.key.participant
		}
	}
}

export const isRealMessage = (message: proto.IWebMessageInfo, meId: string): boolean => {
	const normalizedContent = normalizeMessageContent(message.message)
	const hasSomeContent = !!getContentType(normalizedContent)
	return (
		(!!normalizedContent ||
			REAL_MSG_STUB_TYPES.has(message.messageStubType!) ||
			(REAL_MSG_REQ_ME_STUB_TYPES.has(message.messageStubType!) &&
				message.messageStubParameters?.some(p => areJidsSameUser(meId, p)))) &&
		hasSomeContent &&
		!normalizedContent?.protocolMessage &&
		!normalizedContent?.reactionMessage &&
		!normalizedContent?.pollUpdateMessage
	)
}

export const shouldIncrementChatUnread = (message: proto.IWebMessageInfo): boolean =>
	!message.key.fromMe && !message.messageStubType

/**
 * Get the ID of the chat from the given key.
 * Typically -- that'll be the remoteJid, but for broadcasts, it'll be the participant
 */
export const getChatId = ({ remoteJid, participant, fromMe }: proto.IMessageKey): string => {
	if (isJidBroadcast(remoteJid!) && !isJidStatusBroadcast(remoteJid!) && !fromMe) {
		return participant!
	}
	return remoteJid!
}

type PollContext = {
	/** Normalised JID of the person that created the poll */
	pollCreatorJid: string
	/** ID of the poll creation message */
	pollMsgId: string
	/** Poll creation message encryption key */
	pollEncKey: Uint8Array
	/** JID of the person that voted */
	voterJid: string
}

/**
 * Decrypt a poll vote
 * @param vote Encrypted vote
 * @param ctx Additional info about the poll required for decryption
 * @returns List of SHA256 options
 */
export const decryptPollVote = (
	{ encPayload, encIv }: proto.Message.IPollEncValue,
	{ pollCreatorJid, pollMsgId, pollEncKey, voterJid }: PollContext
): proto.Message.PollVoteMessage => {
	const sign = Buffer.concat([
		Buffer.from(pollMsgId),
		Buffer.from(pollCreatorJid),
		Buffer.from(voterJid),
		Buffer.from(POLL_VOTE),
		new Uint8Array([1])
	])

	const key0 = hmacSign(pollEncKey, new Uint8Array(32), 'sha256')
	const decKey = hmacSign(sign, key0, 'sha256')
	const aad = Buffer.from(`${pollMsgId}${voterJid}`)

	const decrypted = aesDecryptGCM(encPayload!, decKey, encIv!, aad)
	return proto.Message.PollVoteMessage.decode(decrypted)
}

const processMessage = async (
	message: proto.IWebMessageInfo,
	{
		shouldProcessHistoryMsg,
		placeholderResendCache,
		ev,
		creds,
		signalRepository,
		keyStore,
		logger,
		options
	}: ProcessMessageContext
): Promise<void> => {
	const meId = jidNormalizedUser(creds.me?.id ?? '')
	const { accountSettings } = creds

	const chat: Partial<Chat> = { id: jidNormalizedUser(getChatId(message.key)) }
	const isRealMsg = isRealMessage(message, meId)

	if (isRealMsg) {
		chat.messages = [{ message }]
		chat.conversationTimestamp = toNumber(message.messageTimestamp)
		if (shouldIncrementChatUnread(message)) {
			chat.unreadCount = (chat.unreadCount ?? 0) + 1
		}
	}

	const content = normalizeMessageContent(message.message)

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
					logger?.warn({ id: message.key.id }, 'Missing history sync notification')
					break
				}
				const process = shouldProcessHistoryMsg
				const isLatest = !creds.processedHistoryMessages?.length

				logger?.info(
					{ histNotification, process, id: message.key.id, isLatest },
					'Got history notification'
				)

				if (process) {
					if (histNotification.syncType !== proto.HistorySync.HistorySyncType.ON_DEMAND) {
						ev.emit('creds.update', {
							processedHistoryMessages: [
								...(creds.processedHistoryMessages ?? []),
								{ key: message.key, messageTimestamp: message.messageTimestamp }
							]
						})
					}

					const data = await downloadAndProcessHistorySyncNotification(histNotification, options)
					ev.emit('messaging-history.set', {
						...data,
						isLatest: histNotification.syncType !== proto.HistorySync.HistorySyncType.ON_DEMAND ? isLatest : undefined,
						peerDataRequestSessionId: histNotification.peerDataRequestSessionId
					})
				}
				break
			case proto.Message.ProtocolMessage.Type.APP_STATE_SYNC_KEY_SHARE:
				const keys = protocolMsg.appStateSyncKeyShare?.keys
				if (keys?.length) {
					let newAppStateSyncKeyId = ''
					await keyStore.transaction(async () => {
						const newKeys: string[] = []
						for (const { keyData, keyId } of keys) {
							if (!keyId?.keyId || !keyData) {
								logger?.warn({ keyId }, 'Skipping invalid key in app state sync')
								continue
							}
							const strKeyId = Buffer.from(keyId.keyId).toString('base64')
							newKeys.push(strKeyId)
							await keyStore.set({ 'app-state-sync-key': { [strKeyId]: keyData } })
							newAppStateSyncKeyId = strKeyId
						}
						logger?.info({ newAppStateSyncKeyId, newKeys }, 'Injecting new app state sync keys')
					}, meId)

					if (newAppStateSyncKeyId) {
						ev.emit('creds.update', { myAppStateKeyId: newAppStateSyncKeyId })
					}
				} else {
					logger?.info({ protocolMsg }, 'Received app state sync with 0 keys')
				}
				break
			case proto.Message.ProtocolMessage.Type.REVOKE:
				const revokeKey = protocolMsg.key
				if (!revokeKey?.id) {
					logger?.warn({ id: message.key.id }, 'Missing key for revoke message')
					break
				}
				ev.emit('messages.update', [
					{
						key: { ...message.key, id: revokeKey.id },
						update: { message: null, messageStubType: WAMessageStubType.REVOKE, key: message.key }
					}
				])
				break
			case proto.Message.ProtocolMessage.Type.EPHEMERAL_SETTING:
				Object.assign(chat, {
					ephemeralSettingTimestamp: toNumber(message.messageTimestamp),
					ephemeralExpiration: protocolMsg.ephemeralExpiration ?? null
				})
				break
			case proto.Message.ProtocolMessage.Type.PEER_DATA_OPERATION_REQUEST_RESPONSE_MESSAGE:
				const response = protocolMsg.peerDataOperationRequestResponseMessage
				if (!response) {
					logger?.warn({ id: message.key.id }, 'Missing peer data operation response')
					break
				}
				if (response.stanzaId) {
					await placeholderResendCache?.del(response.stanzaId)
				}
				for (const result of response.peerDataOperationResult ?? []) {
					const { placeholderMessageResendResponse: retryResponse } = result
					if (retryResponse?.webMessageInfoBytes) {
						const webMessageInfo = decodeAndHydrate(proto.WebMessageInfo, retryResponse.webMessageInfoBytes)
						setTimeout(() => {
							ev.emit('messages.upsert', {
								messages: [webMessageInfo],
								type: 'notify',
								requestId: response.stanzaId!
							})
						}, 500)
					}
				}
				break
			case proto.Message.ProtocolMessage.Type.MESSAGE_EDIT:
				const editKey = protocolMsg.key
				if (!editKey?.id) {
					logger?.warn({ id: message.key.id }, 'Missing key for message edit')
					break
				}
				ev.emit('messages.update', [
					{
						key: { ...message.key, id: editKey.id },
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
			case proto.Message.ProtocolMessage.Type.LID_MIGRATION_MAPPING_SYNC:
				const encodedPayload = protocolMsg.lidMigrationMappingSyncMessage?.encodedMappingPayload
				if (!encodedPayload) {
					logger?.warn({ id: message.key.id }, 'Missing encoded payload for LID migration')
					break
				}
				const { pnToLidMappings, chatDbMigrationTimestamp } = decodeAndHydrate(
					proto.LIDMigrationMappingSyncPayload,
					encodedPayload
				)
				logger?.debug({ pnToLidMappings, chatDbMigrationTimestamp }, 'Got LID mappings and chat DB migration timestamp')
				const pairs: { lid: string; pn: string }[] = []
				for (const { pn, latestLid, assignedLid } of pnToLidMappings ?? []) {
					const lid = latestLid || assignedLid
					if (pn && lid) {
						pairs.push({ lid: `${lid}@lid`, pn: `${pn}@s.whatsapp.net` })
					}
				}
				if (pairs.length) {
					await signalRepository.lidMapping.storeLIDPNMappings(pairs)
					for (const { pn, lid } of pairs) {
						await signalRepository.migrateSession(pn, lid)
					}
				}
				break
		}
	} else if (content?.reactionMessage) {
		const reaction: proto.IReaction = {
			...content.reactionMessage,
			key: message.key
		}
		const reactionKey = content.reactionMessage?.key
		if (reactionKey) {
			ev.emit('messages.reaction', [{ reaction, key: reactionKey }])
		}
	} else if (message.messageStubType) {
		const jid = message.key?.remoteJid ?? ''
		const participants = message.messageStubParameters ?? []

		const emitParticipantsUpdate = (action: ParticipantAction): void => {
			if (participants.length) {
				ev.emit('group-participants.update', {
					id: jid,
					author: message.participant ? jidNormalizedUser(message.participant) : undefined,
					participants: participants.map(p => jidNormalizedUser(p)),
					action
				})
			}
		}

		const emitGroupUpdate = (update: Partial<GroupMetadata>): void => {
			ev.emit('groups.update', [
				{
					id: jid,
					...update,
					author: message.participant ? jidNormalizedUser(message.participant) : undefined
				}
			])
		}

		const emitGroupRequestJoin = (participant: string, action: RequestJoinAction, method: RequestJoinMethod): void => {
			ev.emit('group.join-request', {
				id: jid,
				author: message.participant ? jidNormalizedUser(message.participant) : undefined,
				participant: jidNormalizedUser(participant),
				action,
				method
			})
		}

		const participantsIncludesMe = (): boolean => participants.some(jid => areJidsSameUser(meId, jid))

		switch (message.messageStubType) {
			case WAMessageStubType.GROUP_PARTICIPANT_CHANGE_NUMBER:
				emitParticipantsUpdate('modify')
				break
			case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
			case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
				emitParticipantsUpdate('remove')
				if (participantsIncludesMe()) {
					chat.readOnly = true
				}
				break
			case WAMessageStubType.GROUP_PARTICIPANT_ADD:
			case WAMessageStubType.GROUP_PARTICIPANT_INVITE:
			case WAMessageStubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
				if (participantsIncludesMe()) {
					chat.readOnly = false
				}
				emitParticipantsUpdate('add')
				break
			case WAMessageStubType.GROUP_PARTICIPANT_DEMOTE:
				emitParticipantsUpdate('demote')
				break
			case WAMessageStubType.GROUP_PARTICIPANT_PROMOTE:
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
				if (name) {
					chat.name = name
					emitGroupUpdate({ subject: name })
				}
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
			case WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD:
				const participant = message.messageStubParameters?.[0]
				const action = message.messageStubParameters?.[1] as RequestJoinAction
				const method = message.messageStubParameters?.[2] as RequestJoinMethod
				if (participant && action && method) {
					emitGroupRequestJoin(participant, action, method)
				}
				break
		}
	}

	// Commented-out pollUpdateMessage block preserved as is
	/* else if (content?.pollUpdateMessage) {
		const creationMsgKey = content.pollUpdateMessage.pollCreationMessageKey!
		const pollMsg = await getMessage(creationMsgKey)
		if (pollMsg) {
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
			} catch (err) {
				logger?.warn({ err, creationMsgKey }, 'Failed to decrypt poll vote')
			}
		} else {
			logger?.warn({ creationMsgKey }, 'Poll creation message not found, cannot decrypt update')
		}
	} */

	if (Object.keys(chat).length > 1) {
		ev.emit('chats.update', [chat])
	}
}

export default processMessage