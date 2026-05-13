import { Boom } from '@hapi/boom'
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
	RequestJoinAction,
	RequestJoinMethod,
	SignalKeyStoreWithTransaction,
	SignalRepositoryWithLIDStore,
	SocketConfig,
	WAMessage,
	WAMessageKey
} from '../Types'
import { WAMessageStubType } from '../Types'
import { getContentType, normalizeMessageContent } from '../Utils/messages'
import {
	areJidsSameUser,
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
import { buildMergedTcTokenIndexWrite, resolveTcTokenJid } from './tc-token-utils'

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

async function storeTcTokensFromHistorySync(
	chats: Chat[],
	signalRepository: SignalRepositoryWithLIDStore,
	keyStore: SignalKeyStoreWithTransaction,
	logger?: ILogger
) {
	const getLIDForPN = signalRepository.lidMapping.getLIDForPN.bind(signalRepository.lidMapping)

	const candidates: { storageJid: string; token: Buffer; ts: number; senderTs?: number }[] = []
	for (const chat of chats) {
		const ts = chat.tcTokenTimestamp ? toNumber(chat.tcTokenTimestamp) : 0
		if (chat.tcToken?.length && ts > 0) {
			const jid = jidNormalizedUser(chat.id!)
			const storageJid = await resolveTcTokenJid(jid, getLIDForPN)
			candidates.push({
				storageJid,
				token: Buffer.from(chat.tcToken),
				ts,
				senderTs: chat.tcTokenSenderTimestamp ? toNumber(chat.tcTokenSenderTimestamp) : undefined
			})
		}
	}

	if (!candidates.length) {
		return
	}

	const jids = candidates.map(c => c.storageJid)
	const existing = await keyStore.get('tctoken', jids)
	const entries: Record<string, { token: Buffer; timestamp?: string; senderTimestamp?: number }> = {}

	for (const c of candidates) {
		const existingEntry = existing[c.storageJid]
		const existingTs = existingEntry?.timestamp ? Number(existingEntry.timestamp) : 0
		if (existingTs > 0 && existingTs >= c.ts) {
			continue
		}

		entries[c.storageJid] = {
			...existingEntry,
			token: c.token,
			timestamp: String(c.ts),
			...(c.senderTs !== undefined ? { senderTimestamp: c.senderTs } : {})
		}
	}

	if (Object.keys(entries).length) {
		logger?.debug({ count: Object.keys(entries).length }, 'storing tctokens from history sync')
		try {
			// Include updated __index so cross-session pruning picks these JIDs up.
			const indexWrite = await buildMergedTcTokenIndexWrite(keyStore, Object.keys(entries))
			await keyStore.set({ tctoken: { ...entries, ...indexWrite } })
		} catch (err) {
			logger?.warn({ err }, 'failed to store tctokens from history sync')
		}
	}
}

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
		normaliseKey(content.reactionMessage.key!)
	}

	if (content?.pollUpdateMessage) {
		normaliseKey(content.pollUpdateMessage.pollCreationMessageKey!)
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
		}
	}
}

// TODO: target:audit AUDIT THIS FUNCTION AGAIN
export const isRealMessage = (message: WAMessage) => {
	const normalizedContent = normalizeMessageContent(message.message)
	const hasSomeContent = !!getContentType(normalizedContent)
	return (
		(!!normalizedContent ||
			REAL_MSG_STUB_TYPES.has(message.messageStubType!) ||
			REAL_MSG_REQ_ME_STUB_TYPES.has(message.messageStubType!)) &&
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
export const getChatId = ({ remoteJid, participant, fromMe }: WAMessageKey): string => {
	if (!remoteJid) {
		throw new Boom('Cannot derive chat id: message key is missing remoteJid', {
			data: { remoteJid, participant, fromMe }
		})
	}

	if (isJidBroadcast(remoteJid) && !isJidStatusBroadcast(remoteJid) && !fromMe) {
		if (!participant) {
			throw new Boom('Cannot derive chat id: broadcast message key is missing participant', {
				data: { remoteJid, fromMe }
			})
		}

		return participant
	}

	return remoteJid
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

type MessageEditContext = {
	/** normalised jid of the person that sent the original message */
	originalSenderJid: string
	/** ID of the original (target) message */
	originalMsgId: string
	/** original message enc key (messageContextInfo.messageSecret of the target) */
	editEncKey: Uint8Array
	/** jid of the person performing the edit */
	editorJid: string
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

	const decrypted = aesDecryptGCM(encPayload!, decKey, encIv!, aad)
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

	const decrypted = aesDecryptGCM(encPayload!, decKey, encIv!, aad)
	return proto.Message.EventResponseMessage.decode(decrypted)

	function toBinary(txt: string) {
		return Buffer.from(txt)
	}
}

/**
 * Decrypt a `secretEncryptedMessage` carrying a `MESSAGE_EDIT` payload.
 *
 * WhatsApp started wrapping message edits in an E2EE envelope (May 2026).
 * The new content is encrypted with a key derived from the original
 * message's `messageContextInfo.messageSecret` using HKDF-SHA256
 * + AES-256-GCM, same family as polls and event responses but with
 * different constants (validated against live WhatsApp Android traffic):
 *
 *   info = msgId || origSenderJid || editorJid || "Message Edit"
 *   aad  = (empty)              <-- differs from Poll Vote / Event Response
 *   key  = HKDF-SHA256(salt=zeros, ikm=messageSecret, info, L=32)
 *
 * The decrypted plaintext is a regular `proto.Message` whose
 * `protocolMessage.editedMessage` field holds the new content — same
 * shape as the legacy `protocolMessage.editedMessage` edit path, so
 * consumers can treat the result identically.
 *
 * @param edit encrypted edit payload (encPayload + encIv from SecretEncryptedMessage)
 * @param ctx info about the original message required for decryption
 * @returns decoded outer `Message` whose `protocolMessage.editedMessage`
 *   carries the new content (extendedTextMessage / conversation / etc.)
 */
export function decryptMessageEdit(
	{ encPayload, encIv }: proto.Message.IPollEncValue,
	{ originalSenderJid, originalMsgId, editEncKey, editorJid }: MessageEditContext
) {
	if (!encIv || encIv.length !== 12) {
		throw new Error(`Invalid MESSAGE_EDIT IV length: expected 12, got ${encIv?.length ?? 0}`)
	}

	const sign = Buffer.concat([
		toBinary(originalMsgId),
		toBinary(originalSenderJid),
		toBinary(editorJid),
		toBinary('Message Edit'),
		new Uint8Array([1])
	])

	const key0 = hmacSign(editEncKey, new Uint8Array(32), 'sha256')
	const decKey = hmacSign(sign, key0, 'sha256')
	// AAD is intentionally empty for MESSAGE_EDIT. WA Web's
	// `WAWebAddonEncryption` function `g` only binds `stanzaId\0sender`
	// into AAD for PollVote/EventResponse — every other addon (edits,
	// reactions, comments, ...) uses an empty AAD.
	const aad = Buffer.alloc(0)

	const decrypted = aesDecryptGCM(encPayload!, decKey, encIv, aad)
	return proto.Message.decode(decrypted)

	function toBinary(txt: string) {
		return Buffer.from(txt)
	}
}

type EditJidPair = { originalSenderJid: string; editorJid: string }

/**
 * Decrypt a MESSAGE_EDIT envelope and rewrap the decoded inner message
 * into the legacy `messages.update` shape so consumers that already
 * handle `protocolMessage.editedMessage` keep working without changes.
 *
 * The emitted payload is:
 * ```
 * {
 *   key: <messageKey with id swapped for the target msg id>,
 *   update: {
 *     message: { editedMessage: { message: <inner edited content> } },
 *     messageTimestamp: <protocolMessage.timestampMs / 1000, or envelope ts>
 *   }
 * }
 * ```
 *
 * Returns `null` (with a `logger?.warn` for visibility) when decryption
 * succeeds but the inner plaintext lacks a `protocolMessage.editedMessage`
 * — defensive guard for malformed envelopes the wire schema technically
 * allows.
 */
const buildEditUpdate = (args: {
	editEncKey: Uint8Array
	encPayload?: Uint8Array | null
	encIv?: Uint8Array | null
	primary: EditJidPair
	fallback: EditJidPair | null
	originalMsgId: string
	messageKey: proto.IMessageKey
	targetKey: proto.IMessageKey
	fallbackTimestamp: number
	logger?: ILogger
}): { key: proto.IMessageKey; update: Partial<WAMessage> } | null => {
	const editedInner = decryptWithJidFallback(
		{ encPayload: args.encPayload, encIv: args.encIv },
		args.editEncKey,
		args.originalMsgId,
		args.primary,
		args.fallback
	)
	const editProtocol = editedInner.protocolMessage
	const innerEdited = editProtocol?.editedMessage
	if (!innerEdited) {
		args.logger?.warn(
			{ targetKey: args.targetKey },
			'decrypted MESSAGE_EDIT plaintext had no protocolMessage.editedMessage — skipping update'
		)
		return null
	}
	return {
		key: { ...args.messageKey, id: args.targetKey.id! },
		update: {
			message: {
				editedMessage: {
					message: innerEdited
				}
			},
			messageTimestamp: editProtocol?.timestampMs
				? Math.floor(toNumber(editProtocol.timestampMs) / 1000)
				: args.fallbackTimestamp
		}
	}
}

/**
 * Try `decryptMessageEdit` with the JIDs as received; on GCM failure
 * retry with the alternate addressing form (LID↔PN). Mirrors WA Web's
 * `decryptAddOn` cross-addressing retry. Throws the combined error when
 * both attempts fail.
 */
function decryptWithJidFallback(
	encrypted: proto.Message.IPollEncValue,
	editEncKey: Uint8Array,
	originalMsgId: string,
	primary: EditJidPair,
	fallback: EditJidPair | null
): proto.Message {
	try {
		return decryptMessageEdit(encrypted, { ...primary, editEncKey, originalMsgId })
	} catch (primaryErr) {
		if (
			!fallback ||
			(fallback.originalSenderJid === primary.originalSenderJid && fallback.editorJid === primary.editorJid)
		) {
			throw primaryErr
		}
		try {
			return decryptMessageEdit(encrypted, { ...fallback, editEncKey, originalMsgId })
		} catch (fallbackErr) {
			throw new Error(
				`edit decrypt failed: primary=${(primaryErr as Error).message}; fallback=${(fallbackErr as Error).message}`
			)
		}
	}
}

/**
 * Returns the alternate addressing form (LID→PN or PN→LID) for a JID,
 * or null when no mapping is known. Used to build the fallback HKDF
 * info buffer when the primary decrypt fails GCM verification.
 */
async function alternateAddressing(jid: string, signalRepository: SignalRepositoryWithLIDStore): Promise<string | null> {
	try {
		if (isLidUser(jid)) {
			const pn = await signalRepository.lidMapping.getPNForLID(jid)
			return pn ? jidNormalizedUser(pn) : null
		}
		const lid = await signalRepository.lidMapping.getLIDForPN(jid)
		return lid ? jidNormalizedUser(lid) : null
	} catch {
		return null
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
	const meId = creds.me!.id
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
				const histNotification = protocolMsg.historySyncNotification!
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

					if (data.lidPnMappings?.length) {
						logger?.debug({ count: data.lidPnMappings.length }, 'processing LID-PN mappings from history sync')
						await signalRepository.lidMapping
							.storeLIDPNMappings(data.lidPnMappings)
							.catch(err => logger?.warn({ err }, 'failed to store LID-PN mappings from history sync'))
					}

					await storeTcTokensFromHistorySync(data.chats, signalRepository, keyStore, logger)

					ev.emit('messaging-history.set', {
						...data,
						isLatest: histNotification.syncType !== proto.HistorySync.HistorySyncType.ON_DEMAND ? isLatest : undefined,
						chunkOrder: histNotification.chunkOrder,
						peerDataRequestSessionId: histNotification.peerDataRequestSessionId
					})
				}

				break
			case proto.Message.ProtocolMessage.Type.APP_STATE_SYNC_KEY_SHARE:
				const keys = protocolMsg.appStateSyncKeyShare!.keys
				if (keys?.length) {
					let newAppStateSyncKeyId = ''
					await keyStore.transaction(async () => {
						const newKeys: string[] = []
						for (const { keyData, keyId } of keys) {
							const strKeyId = Buffer.from(keyId!.keyId!).toString('base64')
							newKeys.push(strKeyId)

							await keyStore.set({ 'app-state-sync-key': { [strKeyId]: keyData! } })

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
							id: protocolMsg.key!.id
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
				const response = protocolMsg.peerDataOperationRequestResponseMessage!
				if (response) {
					// TODO: IMPLEMENT HISTORY SYNC ETC (sticker uploads etc.).
					const peerDataOperationResult = response.peerDataOperationResult || []
					for (const result of peerDataOperationResult) {
						const retryResponse = result?.placeholderMessageResendResponse
						//eslint-disable-next-line max-depth
						if (!retryResponse?.webMessageInfoBytes) {
							continue
						}

						//eslint-disable-next-line max-depth
						try {
							const webMessageInfo = proto.WebMessageInfo.decode(retryResponse.webMessageInfoBytes)
							const msgId = webMessageInfo.key?.id
							// Retrieve cached original message data (preserves LID details,
							// timestamps, etc. that the phone may omit in its PDO response)
							const cachedData = msgId ? await placeholderResendCache?.get<Partial<WAMessage> | true>(msgId) : undefined
							//eslint-disable-next-line max-depth
							if (msgId) {
								await placeholderResendCache?.del(msgId)
							}

							let finalMsg: WAMessage
							//eslint-disable-next-line max-depth
							if (cachedData && typeof cachedData === 'object') {
								// Apply decoded message content onto cached metadata (preserves LID etc.)
								cachedData.message = webMessageInfo.message
								//eslint-disable-next-line max-depth
								if (webMessageInfo.messageTimestamp) {
									cachedData.messageTimestamp = webMessageInfo.messageTimestamp
								}

								finalMsg = cachedData as WAMessage
							} else {
								finalMsg = webMessageInfo as WAMessage
							}

							logger?.debug({ msgId, requestId: response.stanzaId }, 'received placeholder resend')

							ev.emit('messages.upsert', {
								messages: [finalMsg],
								type: 'notify',
								requestId: response.stanzaId!
							})
						} catch (err) {
							logger?.warn({ err, stanzaId: response.stanzaId }, 'failed to decode placeholder resend response')
						}
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
				const encodedPayload = protocolMsg.lidMigrationMappingSyncMessage?.encodedMappingPayload!
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
		const reaction: proto.IReaction = {
			...content.reactionMessage,
			key: message.key
		}
		ev.emit('messages.reaction', [
			{
				reaction,
				key: content.reactionMessage?.key!
			}
		])
	} else if (content?.encEventResponseMessage) {
		const encEventResponse = content.encEventResponseMessage
		const creationMsgKey = encEventResponse.eventCreationMessageKey!

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
				const eventCreatorJid = getKeyAuthor(
					{ remoteJid: jidNormalizedUser(eventCreatorPn!), fromMe: meIdNormalised === eventCreatorPn },
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

					ev.emit('messages.update', [
						{
							key: creationMsgKey,
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
	} else if (
		content?.secretEncryptedMessage &&
		content.secretEncryptedMessage.secretEncType === proto.Message.SecretEncryptedMessage.SecretEncType.MESSAGE_EDIT
	) {
		// E2EE message edit envelope (new in 2026-05). Replaces the older
		// `protocolMessage.editedMessage` path for direct text edits.
		// We fetch the target message to obtain its `messageSecret`, derive the
		// decryption key, and surface the decoded inner Message via the same
		// `messages.update` event used by the legacy edit path so consumers do
		// not need a new event type.
		const secEnc = content.secretEncryptedMessage
		const targetKey = secEnc.targetMessageKey!

		// WA Web (`WAWebParseMessageEditEncryptedMessageProto`) rejects
		// envelopes whose IV is not exactly 12 bytes — we do the same so the
		// error path is a clear log instead of an opaque GCM failure.
		if (!targetKey?.id || !secEnc.encPayload?.length || secEnc.encIv?.length !== 12) {
			logger?.warn(
				{ targetKey, ivLen: secEnc.encIv?.length, hasPayload: !!secEnc.encPayload?.length },
				'MESSAGE_EDIT envelope malformed (missing targetKey/payload or IV != 12) — skipping'
			)
		} else {
			const targetMsg = await getMessage(targetKey)
			if (!targetMsg) {
				logger?.warn(
					{ targetKey },
					'original message not found in store, cannot decrypt secretEncryptedMessage edit'
				)
			} else {
				try {
					const meIdNormalised = jidNormalizedUser(meId)
					const editEncKey = targetMsg.messageContextInfo?.messageSecret
					if (!editEncKey) {
						logger?.warn(
							{ targetKey },
							'message edit: missing messageSecret on original message — cannot decrypt'
						)
					} else {
						// ── original sender of the edited message ────────────────────
						// `targetKey.fromMe` is from the ENVELOPE SENDER'S perspective,
						// not ours. When someone else edits their own msg in a group,
						// the envelope arrives with `message.key.fromMe = false` but
						// `targetKey.fromMe = true` — falling back to `meId` here
						// feeds OUR jid into HKDF and GCM tag verification fails.
						//
						// Resolution:
						//   1. `targetKey.participant` if set (always in groups when WA
						//      bothered to include it).
						//   2. If `targetKey.fromMe` → author of the envelope itself
						//      (meId when the envelope is fromMe, otherwise the
						//      envelope's `participant`). Mirrors WA Web's
						//      `MsgGetters.getOriginalSender` once you adjust the
						//      "self" reference for the envelope's perspective.
						//   3. `targetKey.remoteJid` (1:1 incoming edit from the other
						//      party).
						const envelopeAuthorRaw = message.key.fromMe
							? meIdNormalised
							: message.key.participant || message.key.remoteJid!
						const origSenderRaw =
							targetKey.participant || (targetKey.fromMe ? envelopeAuthorRaw : targetKey.remoteJid!)

						// Editor JID — author of the envelope itself, in the *raw*
						// addressing form (LID in LID groups, PN in PN groups). We
						// deliberately do NOT use `getKeyAuthor` here because it
						// prefers `participantAlt` which is the OTHER addressing
						// form — the sender encrypts with whatever form the chat
						// is actually using, and the alt form is what we feed into
						// the LID↔PN fallback below.
						const editorRaw = envelopeAuthorRaw

						// JID forms threaded into HKDF info MUST match what the
						// sender used. We try the JIDs as received first, then a
						// LID↔PN swap when available — mirrors WA Web's
						// `decryptAddOn` cross-addressing fallback.
						const altOrig = await alternateAddressing(origSenderRaw, signalRepository)
						const altEditor = await alternateAddressing(editorRaw, signalRepository)
						const primary = {
							originalSenderJid: jidNormalizedUser(origSenderRaw),
							editorJid: jidNormalizedUser(editorRaw)
						}
						const fallback =
							altOrig || altEditor
								? {
										originalSenderJid: altOrig ?? primary.originalSenderJid,
										editorJid: altEditor ?? primary.editorJid
									}
								: null

						const update = buildEditUpdate({
							editEncKey,
							encPayload: secEnc.encPayload,
							encIv: secEnc.encIv,
							primary,
							fallback,
							originalMsgId: targetKey.id,
							messageKey: message.key,
							targetKey,
							fallbackTimestamp: toNumber(message.messageTimestamp),
							logger
						})
						if (update) {
							ev.emit('messages.update', [update])
						}
					}
				} catch (err) {
					logger?.warn({ err, targetKey }, 'failed to decrypt secretEncryptedMessage MESSAGE_EDIT')
				}
			}
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
				authorUsername: message.key.participantUsername!,
				participants,
				action
			})
		const emitGroupUpdate = (update: Partial<GroupMetadata>) => {
			ev.emit('groups.update', [
				{
					id: jid,
					...update,
					author: message.key.participant ?? undefined,
					authorPn: message.key.participantAlt,
					authorUsername: message.key.participantUsername
				}
			])
		}

		const emitGroupRequestJoin = (participant: LIDMapping, action: RequestJoinAction, method: RequestJoinMethod) => {
			ev.emit('group.join-request', {
				id: jid,
				author: message.key.participant!,
				authorPn: message.key.participantAlt!,
				authorUsername: message.key.participantUsername!,
				participant: participant.lid,
				participantPn: participant.pn,
				action,
				method: method!
			})
		}

		const participantsIncludesMe = () => participants.find(jid => areJidsSameUser(meId, jid.phoneNumber)) // ADD SUPPORT FOR LID

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
