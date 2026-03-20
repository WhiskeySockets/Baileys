/* eslint-disable max-depth, @typescript-eslint/no-unused-vars */
import NodeCache from '@cacheable/node-cache'
import { Boom } from '@hapi/boom'
import { randomBytes } from 'crypto'
import Long from 'long'
import { proto } from '../../WAProto/index.js'
import {
	DEFAULT_CACHE_TTLS,
	DEFAULT_SESSION_CLEANUP_CONFIG,
	INITIAL_PREKEY_COUNT,
	KEY_BUNDLE_TYPE,
	MIN_PREKEY_COUNT,
	PLACEHOLDER_MAX_AGE_SECONDS,
	STATUS_EXPIRY_SECONDS
} from '../Defaults'
import type {
	GroupParticipant,
	MessageReceiptType,
	MessageRelayOptions,
	MessageUserReceipt,
	PlaceholderMessageData,
	SocketConfig,
	WACallEvent,
	WACallParticipant,
	WACallUpdateType,
	WAMessage,
	WAMessageKey,
	WAPatchName
} from '../Types'
import { WAMessageStatus, WAMessageStubType } from '../Types'
import {
	aesDecryptCTR,
	aesEncryptGCM,
	cleanMessage,
	cleanupCorruptedSession,
	Curve,
	decodeMediaRetryNode,
	decodeMessageNode,
	decryptMessageNode,
	delay,
	derivePairingCodeKey,
	encodeBigEndian,
	encodeSignedDeviceIdentity,
	extractAddressingContext,
	getCallStatusFromNode,
	getDecryptionJid,
	getHistoryMsg,
	getNextPreKeys,
	getStatusFromReceiptType,
	handleIdentityChange,
	hkdf,
	BAD_MAC_ERROR_TEXT,
	DECRYPTION_RETRY_CONFIG,
	MISSING_KEYS_ERROR_TEXT,
	NACK_REASONS,
	NO_MESSAGE_FOUND_ERROR_TEXT,
	normalizeKeyLidToPn,
	normalizeMessageJids,
	resolveLidToPn,
	SERVER_ERROR_CODES,
	toNumber,
	unixTimestampSeconds,
	xmppPreKey,
	xmppSignedPreKey
} from '../Utils'
import { logMessageReceived, logTcToken } from '../Utils/baileys-logger'
import { makeMutex } from '../Utils/make-mutex'
import {
	metrics,
	recordHistorySyncMessages,
	recordMessageFailure,
	recordMessageReceived,
	recordMessageRetry
} from '../Utils/prometheus-metrics.js'
import { isTcTokenExpired, resolveTcTokenJid, storeTcTokensFromIqResult } from '../Utils/tc-token-utils'
import {
	areJidsSameUser,
	type BinaryNode,
	binaryNodeToString,
	getAllBinaryNodeChildren,
	getBinaryNodeChild,
	getBinaryNodeChildBuffer,
	getBinaryNodeChildren,
	getBinaryNodeChildString,
	isJidGroup,
	isJidNewsletter,
	isJidStatusBroadcast,
	isLidUser,
	isPnUser,
	jidDecode,
	jidNormalizedUser,
	S_WHATSAPP_NET
} from '../WABinary'
import { extractGroupMetadata } from './groups'
import { makeMessagesSocket } from './messages-send'

export const makeMessagesRecvSocket = (config: SocketConfig) => {
	const {
		logger,
		retryRequestDelayMs,
		maxMsgRetryCount,
		getMessage,
		shouldIgnoreJid,
		enableAutoSessionRecreation,
		enableCTWARecovery,
		sessionCleanupConfig
	} = config
	// Use nullish coalescing to handle partial config properly
	const autoCleanCorrupted =
		sessionCleanupConfig?.autoCleanCorrupted ?? DEFAULT_SESSION_CLEANUP_CONFIG.autoCleanCorrupted
	const sock = makeMessagesSocket(config)
	const {
		ev,
		authState,
		ws,
		messageMutex,
		notificationMutex,
		receiptMutex,
		signalRepository,
		sessionActivityTracker,
		query,
		upsertMessage,
		resyncAppState,
		onUnexpectedError,
		assertSessions,
		sendNode,
		relayMessage,
		sendReceipt,
		uploadPreKeys,
		sendPeerDataOperationMessage,
		messageRetryManager,
		getPrivacyTokens
	} = sock

	const getLIDForPN = signalRepository.lidMapping.getLIDForPN.bind(signalRepository.lidMapping)

	/** this mutex ensures that each retryRequest will wait for the previous one to finish */
	const retryMutex = makeMutex()

	const msgRetryCache =
		config.msgRetryCounterCache ||
		new NodeCache<number>({
			stdTTL: DEFAULT_CACHE_TTLS.MSG_RETRY, // 1 hour
			useClones: false
		})
	const callOfferCache =
		config.callOfferCache ||
		new NodeCache<WACallEvent>({
			stdTTL: DEFAULT_CACHE_TTLS.CALL_OFFER, // 5 mins
			useClones: false
		})

	const placeholderResendCache =
		config.placeholderResendCache ||
		new NodeCache({
			stdTTL: DEFAULT_CACHE_TTLS.MSG_RETRY, // 1 hour
			useClones: false
		})

	// Debounce identity-change session refreshes per JID to avoid bursts
	const identityAssertDebounce = new NodeCache<boolean>({ stdTTL: 5, useClones: false })

	let sendActiveReceipts = false

	// ======= tctoken index tracking for cross-session pruning =======
	const TC_TOKEN_INDEX_KEY = '__index'
	const TC_TOKEN_PRUNE_TS_KEY = '__prune_ts'
	const tcTokenKnownJids = new Set<string>()
	const tcTokenRetriedMsgIds = new Set<string>()

	// Deduplicates retry requests per JID within a short window.
	// When a burst of Bad MAC errors arrives for the same contact,
	// only the first retry request is sent — the peer resends everything
	// with a single pkmsg, avoiding the close-session cascade.
	const retryRequestActiveJids = new Set<string>()
	let tcTokenIndexSaveTimer: ReturnType<typeof setTimeout> | undefined
	let lastTcTokenPruneTs = 0

	// Load persisted JID index and last prune timestamp on startup
	const tcTokenIndexLoaded = (async () => {
		try {
			const data = await authState.keys.get('tctoken', [TC_TOKEN_INDEX_KEY, TC_TOKEN_PRUNE_TS_KEY])
			const entry = data[TC_TOKEN_INDEX_KEY]
			if (entry?.token) {
				const stored = JSON.parse(Buffer.from(entry.token).toString('utf8'))
				if (Array.isArray(stored)) {
					for (const jid of stored) tcTokenKnownJids.add(jid)
				}
			}

			const pruneEntry = data[TC_TOKEN_PRUNE_TS_KEY]
			if (pruneEntry?.timestamp) {
				lastTcTokenPruneTs = Number(pruneEntry.timestamp)
			}
		} catch {
			/* first run or corrupt index — start fresh */
		}
	})()

	/** Debounced save of the tctoken JID index (5s) */
	const scheduleTcTokenIndexSave = () => {
		if (tcTokenIndexSaveTimer) clearTimeout(tcTokenIndexSaveTimer)
		tcTokenIndexSaveTimer = setTimeout(async () => {
			try {
				const arr = Array.from(tcTokenKnownJids)
				await authState.keys.set({
					tctoken: {
						[TC_TOKEN_INDEX_KEY]: {
							token: Buffer.from(JSON.stringify(arr), 'utf8'),
							timestamp: unixTimestampSeconds().toString()
						}
					}
				})
			} catch (err) {
				logger.debug({ err }, 'failed to persist tctoken index')
			}
		}, 5000)
	}

	/** Delete expired tctokens — runs at most once per 24h when coming online */
	const pruneExpiredTcTokens = async () => {
		await tcTokenIndexLoaded
		const pruneSet: Record<string, null> = {}
		const survivingJids: string[] = []

		const jidsToCheck = Array.from(tcTokenKnownJids).filter(j => j !== TC_TOKEN_INDEX_KEY)
		if (!jidsToCheck.length) return

		try {
			const allData = await authState.keys.get('tctoken', jidsToCheck)
			for (const jid of jidsToCheck) {
				const entry = allData[jid]
				if (!entry?.token || isTcTokenExpired(entry.timestamp)) {
					pruneSet[jid] = null
				} else {
					survivingJids.push(jid)
				}
			}
		} catch {
			return // batch read failed — skip this pruning cycle
		}

		const pruneCount = Object.keys(pruneSet).length
		if (pruneCount > 0) {
			await authState.keys.set({ tctoken: pruneSet })
			tcTokenKnownJids.clear()
			for (const jid of survivingJids) tcTokenKnownJids.add(jid)
			scheduleTcTokenIndexSave()
			logTcToken('prune', { pruned: pruneCount, remaining: survivingJids.length })
		}
	}
	// ======= END tctoken index tracking =======

	const fetchMessageHistory = async (
		count: number,
		oldestMsgKey: WAMessageKey,
		oldestMsgTimestamp: number | Long
	): Promise<string> => {
		if (!authState.creds.me?.id) {
			throw new Boom('Not authenticated')
		}

		const pdoMessage: proto.Message.IPeerDataOperationRequestMessage = {
			historySyncOnDemandRequest: {
				chatJid: oldestMsgKey.remoteJid,
				oldestMsgFromMe: oldestMsgKey.fromMe,
				oldestMsgId: oldestMsgKey.id,
				oldestMsgTimestampMs: oldestMsgTimestamp,
				onDemandMsgCount: count
			},
			peerDataOperationRequestType: proto.Message.PeerDataOperationRequestType.HISTORY_SYNC_ON_DEMAND
		}

		return sendPeerDataOperationMessage(pdoMessage)
	}

	const requestPlaceholderResend = async (
		messageKey: WAMessageKey,
		msgData?: PlaceholderMessageData
	): Promise<string | undefined> => {
		if (!authState.creds.me?.id) {
			throw new Boom('Not authenticated')
		}

		// Check if already requested using message ID to prevent duplicate PDO requests
		const alreadyRequested = await placeholderResendCache.get<PlaceholderMessageData | boolean>(messageKey?.id!)
		if (alreadyRequested) {
			logger.debug({ messageKey }, 'already requested resend')
			return
		}

		// Temporarily mark as requested using message ID to prevent race conditions
		await placeholderResendCache.set(messageKey?.id!, true)

		await delay(2000)

		// Check if message was received during delay
		if (!(await placeholderResendCache.get<PlaceholderMessageData | boolean>(messageKey?.id!))) {
			logger.debug({ messageKey }, 'message received while resend requested')
			return 'RESOLVED'
		}

		const pdoMessage = {
			placeholderMessageResendRequest: [
				{
					messageKey
				}
			],
			peerDataOperationRequestType: proto.Message.PeerDataOperationRequestType.PLACEHOLDER_MESSAGE_RESEND
		}

		// Send PDO and get stanzaId (PDO request ID)
		const stanzaId = await sendPeerDataOperationMessage(pdoMessage)

		// CRITICAL FIX: Store metadata using stanzaId (not messageKey.id)
		// The PDO response will use stanzaId to identify which request it's responding to
		if (msgData && stanzaId) {
			await placeholderResendCache.set(stanzaId, msgData)
			logger.debug(
				{ messageKey: messageKey.id, stanzaId },
				'CTWA: Cached metadata using stanzaId for PDO response lookup'
			)
		}

		// Clean up message ID marker after storing with stanzaId
		await placeholderResendCache.del(messageKey?.id!)

		// Cleanup timeout: if no response after 8s, assume phone is offline
		setTimeout(async () => {
			if (await placeholderResendCache.get<PlaceholderMessageData | boolean>(stanzaId)) {
				logger.debug({ stanzaId }, 'PDO message without response after 8 seconds. Phone possibly offline')
				await placeholderResendCache.del(stanzaId)
			}
		}, 8_000)

		return stanzaId
	}

	// Handles mex newsletter notifications
	const handleMexNewsletterNotification = async (node: BinaryNode) => {
		const mexNode = getBinaryNodeChild(node, 'mex')
		if (!mexNode?.content) {
			logger.warn({ node }, 'Invalid mex newsletter notification')
			return
		}

		let data: any
		try {
			data = JSON.parse(mexNode.content.toString())
		} catch (error) {
			logger.error({ err: error, node }, 'Failed to parse mex newsletter notification')
			return
		}

		const operation = data?.operation
		const updates = data?.updates

		if (!updates || !operation) {
			logger.warn({ data }, 'Invalid mex newsletter notification content')
			return
		}

		logger.info({ operation, updates }, 'got mex newsletter notification')

		switch (operation) {
			case 'NotificationNewsletterUpdate':
				for (const update of updates) {
					if (update.jid && update.settings && Object.keys(update.settings).length > 0) {
						ev.emit('newsletter-settings.update', {
							id: update.jid,
							update: update.settings
						})
					}
				}

				break

			case 'NotificationNewsletterAdminPromote':
				for (const update of updates) {
					if (update.jid && update.user) {
						const [resolvedAuthor, resolvedUser] = await Promise.all([
							resolveLidToPn(node.attrs.from!, signalRepository.lidMapping, logger),
							resolveLidToPn(update.user, signalRepository.lidMapping, logger)
						])
						ev.emit('newsletter-participants.update', {
							id: update.jid,
							author: resolvedAuthor || node.attrs.from!,
							user: resolvedUser || update.user,
							new_role: 'ADMIN',
							action: 'promote'
						})
					}
				}

				break

			default:
				logger.info({ operation, data }, 'Unhandled mex newsletter notification')
				break
		}
	}

	// Handles newsletter notifications
	const handleNewsletterNotification = async (node: BinaryNode) => {
		const from = node.attrs.from!
		const child = getAllBinaryNodeChildren(node)[0]!
		const rawAuthor = node.attrs.participant!
		// Resolve author LID→PN (participant is a user JID that could be LID)
		const author = await resolveLidToPn(rawAuthor, signalRepository.lidMapping, logger) || rawAuthor

		logger.info({ from, child }, 'got newsletter notification')

		switch (child.tag) {
			case 'reaction':
				const reactionUpdate = {
					id: from,
					server_id: child.attrs.message_id!,
					reaction: {
						code: getBinaryNodeChildString(child, 'reaction'),
						count: 1
					}
				}
				ev.emit('newsletter.reaction', reactionUpdate)
				break

			case 'view':
				const viewUpdate = {
					id: from,
					server_id: child.attrs.message_id!,
					count: parseInt(child.content?.toString() || '0', 10)
				}
				ev.emit('newsletter.view', viewUpdate)
				break

			case 'participant':
				const resolvedParticipantUser = await resolveLidToPn(child.attrs.jid!, signalRepository.lidMapping, logger) || child.attrs.jid!
				const participantUpdate = {
					id: from,
					author,
					user: resolvedParticipantUser,
					action: child.attrs.action!,
					new_role: child.attrs.role!
				}
				ev.emit('newsletter-participants.update', participantUpdate)
				break

			case 'update':
				const settingsNode = getBinaryNodeChild(child, 'settings')
				if (settingsNode) {
					const update: Record<string, any> = {}
					const nameNode = getBinaryNodeChild(settingsNode, 'name')
					if (nameNode?.content) update.name = nameNode.content.toString()

					const descriptionNode = getBinaryNodeChild(settingsNode, 'description')
					if (descriptionNode?.content) update.description = descriptionNode.content.toString()

					ev.emit('newsletter-settings.update', {
						id: from,
						update
					})
				}

				break

			case 'message':
				const plaintextNode = getBinaryNodeChild(child, 'plaintext')
				if (plaintextNode?.content) {
					try {
						const contentBuf =
							typeof plaintextNode.content === 'string'
								? Buffer.from(plaintextNode.content, 'binary')
								: Buffer.from(plaintextNode.content as Uint8Array)
						const messageProto = proto.Message.decode(contentBuf).toJSON()
						const fullMessage = proto.WebMessageInfo.fromObject({
							key: {
								remoteJid: from,
								id: child.attrs.message_id || child.attrs.server_id,
								fromMe: false // TODO: is this really true though
							},
							message: messageProto,
							messageTimestamp: +child.attrs.t!
						}).toJSON() as WAMessage
						await upsertMessage(fullMessage, 'append')
						logger.info('Processed plaintext newsletter message')
					} catch (error) {
						logger.error({ error }, 'Failed to decode plaintext newsletter message')
					}
				}

				break

			default:
				logger.warn({ node }, 'Unknown newsletter notification')
				break
		}
	}

	const sendMessageAck = async ({ tag, attrs, content }: BinaryNode, errorCode?: number) => {
		const stanza: BinaryNode = {
			tag: 'ack',
			attrs: {
				id: attrs.id!,
				to: attrs.from!,
				class: tag
			}
		}

		if (!!errorCode) {
			stanza.attrs.error = errorCode.toString()
		}

		if (!!attrs.participant) {
			stanza.attrs.participant = attrs.participant
		}

		if (!!attrs.recipient) {
			stanza.attrs.recipient = attrs.recipient
		}

		if (
			!!attrs.type &&
			(tag !== 'message' || getBinaryNodeChild({ tag, attrs, content }, 'unavailable') || errorCode !== 0)
		) {
			stanza.attrs.type = attrs.type
		}

		if (tag === 'message' && getBinaryNodeChild({ tag, attrs, content }, 'unavailable')) {
			const meId = authState.creds.me?.id
			if (!meId) throw new Boom('Not authenticated', { statusCode: 401 })
			stanza.attrs.from = meId
		}

		logger.debug({ recv: { tag, attrs }, sent: stanza.attrs }, 'sent ack')
		await sendNode(stanza)
	}

	const rejectCall = async (callId: string, callFrom: string) => {
		const meId = authState.creds.me?.id
		if (!meId) throw new Boom('Not authenticated', { statusCode: 401 })
		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				from: meId,
				to: callFrom
			},
			content: [
				{
					tag: 'reject',
					attrs: {
						'call-id': callId,
						'call-creator': callFrom,
						count: '0'
					},
					content: undefined
				}
			]
		}
		await query(stanza)
	}

	/**
	 * Offer (initiate) a call to a JID.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param jid - destination JID (e.g. "5511999999999@s.whatsapp.net" or LID)
	 * @param isVideo - true for video call, false/undefined for voice
	 * @returns callId (hex) and stanzaId used in the offer
	 */
	const offerCall = async (jid: string, isVideo?: boolean) => {
		const meId = authState.creds.me?.id
		if (!meId) throw new Boom('Not authenticated', { statusCode: 401 })

		const callId = randomBytes(16).toString('hex').toUpperCase()
		const stanzaId = randomBytes(16).toString('hex').toUpperCase()

		const offerContent: BinaryNode[] = [
			{ tag: 'privacy', attrs: {}, content: undefined },
			{ tag: 'audio', attrs: { rate: '8000', enc: 'opus' }, content: undefined },
			{ tag: 'audio', attrs: { rate: '16000', enc: 'opus' }, content: undefined },
		]

		if (isVideo) {
			offerContent.push({
				tag: 'video',
				attrs: {
					screen_width: '1080',
					screen_height: '2400',
					dec: 'H264,H265,AV1',
					device_orientation: '0',
					enc: 'h.264'
				},
				content: undefined
			})
		}

		offerContent.push(
			{ tag: 'net', attrs: { medium: '3' }, content: undefined },
			{ tag: 'capability', attrs: { ver: '1' }, content: undefined },
			{ tag: 'enc', attrs: { v: '2', type: isVideo ? 'msg' : 'pkmsg' }, content: undefined },
			{ tag: 'encopt', attrs: { keygen: '2' }, content: undefined },
		)

		// Voice calls include device-identity (verified via Frida capture)
		if (!isVideo) {
			offerContent.push(
				{ tag: 'device-identity', attrs: {}, content: undefined },
			)
		}

		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to: jid,
				id: stanzaId,
			},
			content: [{
				tag: 'offer',
				attrs: {
					'call-creator': meId,
					'call-id': callId,
					'device_class': '2013',
				},
				content: offerContent
			}]
		}

		await query(stanza)
		return { callId, stanzaId }
	}

	/**
	 * Terminate (hang up) an active or ringing call.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param callId - the call-id from the offer
	 * @param callTo - JID of the other party
	 * @param callCreator - JID of who created the call (usually meId for outgoing)
	 * @param reason - terminate reason (omit for normal hangup, or 'timeout', 'busy', etc.)
	 * @param duration - call duration in ms (included when call was connected)
	 */
	const terminateCall = async (
		callId: string,
		callTo: string,
		callCreator?: string,
		reason?: string,
		duration?: number
	) => {
		const meId = authState.creds.me?.id
		if (!meId) throw new Boom('Not authenticated', { statusCode: 401 })

		const terminateAttrs: Record<string, string> = {
			'call-id': callId,
			'call-creator': callCreator || meId,
		}

		if (reason) {
			terminateAttrs.reason = reason
		}

		if (typeof duration === 'number') {
			terminateAttrs.duration = String(duration)
			terminateAttrs.audio_duration = String(duration)
		}

		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to: callTo,
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'terminate',
				attrs: terminateAttrs,
				content: undefined
			}]
		}

		await query(stanza)
	}

	/**
	 * Accept (answer) an incoming call.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param callId - the call-id from the incoming offer
	 * @param callFrom - JID of the caller (call-creator)
	 * @param isVideo - true for video call
	 */
	const acceptCall = async (
		callId: string,
		callFrom: string,
		isVideo?: boolean,
	) => {
		const meId = authState.creds.me?.id
		if (!meId) throw new Boom('Not authenticated', { statusCode: 401 })

		const acceptContent: BinaryNode[] = [
			{ tag: 'audio', attrs: { rate: '16000', enc: 'opus' }, content: undefined },
		]

		if (isVideo) {
			acceptContent.push({
				tag: 'video',
				attrs: {
					dec: 'H264,AV1',
					device_orientation: '1',
				},
				content: undefined
			})
		}

		acceptContent.push(
			{ tag: 'net', attrs: { medium: '2' }, content: undefined },
			{ tag: 'encopt', attrs: { keygen: '2' }, content: undefined },
		)

		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				from: meId,
				to: callFrom,
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'accept',
				attrs: {
					'call-id': callId,
					'call-creator': callFrom,
				},
				content: acceptContent
			}]
		}

		await query(stanza)
	}

	/**
	 * Send preaccept signal for an incoming call (indicates device capabilities).
	 * Sent before accept to communicate supported codecs.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param callId - the call-id from the incoming offer
	 * @param callCreator - JID of the caller
	 * @param isVideo - true for video call
	 */
	const preacceptCall = async (
		callId: string,
		callCreator: string,
		isVideo?: boolean,
	) => {
		const preacceptContent: BinaryNode[] = [
			{ tag: 'audio', attrs: { rate: '16000', enc: 'opus' }, content: undefined },
		]

		if (isVideo) {
			preacceptContent.push({
				tag: 'video',
				attrs: {
					screen_width: '1080',
					screen_height: '2400',
					dec: 'H264,H265,AV1',
					device_orientation: '0',
				},
				content: undefined
			})
		}

		preacceptContent.push(
			{ tag: 'encopt', attrs: { keygen: '2' }, content: undefined },
			{ tag: 'capability', attrs: { ver: '1' }, content: undefined },
		)

		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to: callCreator,
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'preaccept',
				attrs: {
					'call-id': callId,
					'call-creator': callCreator,
				},
				content: preacceptContent
			}]
		}

		await query(stanza)
	}

	/**
	 * Report relay latency measurements to the server.
	 * Sent after receiving relay info to report measured latency per relay server.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param callId - the call-id
	 * @param callCreator - JID of the call creator
	 * @param relays - array of relay measurements
	 * @param transactionId - optional transaction ID for group calls
	 */
	const sendRelayLatency = async (
		callId: string,
		callCreator: string,
		relays: Array<{
			relayName?: string
			latency: number
			relayId?: string
			dlBw?: number
			ulBw?: number
		}>,
		transactionId?: string,
	) => {
		const relayLatencyAttrs: Record<string, string> = {
			'call-id': callId,
			'call-creator': callCreator,
		}

		if (transactionId) {
			relayLatencyAttrs['transaction-id'] = transactionId
		}

		const teChildren: BinaryNode[] = relays.map(r => {
			const teAttrs: Record<string, string> = {}
			if (r.relayName) {
				teAttrs.relay_name = r.relayName
			}

			teAttrs.latency = String(r.latency)
			if (r.relayId) {
				teAttrs.relay_id = r.relayId
			}

			if (r.dlBw !== undefined) {
				teAttrs.dl_bw = String(r.dlBw)
			}

			if (r.ulBw !== undefined) {
				teAttrs.ul_bw = String(r.ulBw)
			}

			return { tag: 'te', attrs: teAttrs, content: undefined }
		})

		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to: callCreator,
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'relaylatency',
				attrs: relayLatencyAttrs,
				content: teChildren
			}]
		}

		await sendNode(stanza)
	}

	/**
	 * Send transport (p2p/ICE) candidates for a call.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param callId - the call-id
	 * @param callCreator - JID of the call creator
	 * @param to - destination JID
	 * @param candidates - array of candidate entries with priority
	 * @param round - p2p candidate round number
	 */
	const sendTransport = async (
		callId: string,
		callCreator: string,
		to: string,
		candidates: Array<{ priority: string; data?: Uint8Array }>,
		round?: number,
	) => {
		const transportAttrs: Record<string, string> = {
			'call-id': callId,
			'call-creator': callCreator,
			'transport-message-type': '1',
		}

		if (round !== undefined) {
			transportAttrs['p2p-cand-round'] = String(round)
		}

		const teChildren: BinaryNode[] = candidates.map(c => ({
			tag: 'te',
			attrs: { priority: c.priority },
			content: c.data,
		}))

		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to,
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'transport',
				attrs: transportAttrs,
				content: teChildren
			}]
		}

		await sendNode(stanza)
	}

	/**
	 * Send call duration log to the server after a call ends.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param callId - the call-id
	 * @param callCreator - JID of the call creator
	 * @param peer - JID of the other party
	 * @param audioDuration - audio duration in ms
	 * @param callType - call type, defaults to '1x1'
	 */
	const sendCallDuration = async (
		callId: string,
		callCreator: string,
		peer: string,
		audioDuration: number,
		callType: string = '1x1',
	) => {
		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to: 'call',
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'duration',
				attrs: {
					'call-id': callId,
					'call-creator': callCreator,
					peer,
					audio_duration: String(audioDuration),
					type: callType,
				},
				content: undefined
			}]
		}

		await sendNode(stanza)
	}

	/**
	 * Mute or unmute during a call (MUTE_V2).
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param callId - the call-id
	 * @param callCreator - JID of the call creator
	 * @param to - destination JID
	 * @param muted - true to mute, false to unmute
	 */
	const muteCall = async (
		callId: string,
		callCreator: string,
		to: string,
		muted: boolean,
	) => {
		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to,
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'mute_v2',
				attrs: {
					'mute-state': muted ? '1' : '0',
					'call-id': callId,
					'call-creator': callCreator,
				},
				content: undefined
			}]
		}

		await sendNode(stanza)
	}

	/**
	 * Send heartbeat to keep a group call alive.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param callId - the call-id (also used as JID with @call)
	 * @param callCreator - JID of the call creator
	 */
	const sendHeartbeat = async (
		callId: string,
		callCreator: string,
	) => {
		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to: `${callId}@call`,
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'heartbeat',
				attrs: {
					'call-id': callId,
					'call-creator': callCreator,
				},
				content: undefined
			}]
		}

		await sendNode(stanza)
	}

	/**
	 * Send encryption re-key during a call.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param callId - the call-id
	 * @param callCreator - JID of the call creator
	 * @param to - destination JID
	 * @param transactionId - transaction ID for the rekey
	 */
	const sendEncRekey = async (
		callId: string,
		callCreator: string,
		to: string,
		transactionId: string,
	) => {
		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to,
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'enc_rekey',
				attrs: {
					'transaction-id': transactionId,
					'call-id': callId,
					'call-creator': callCreator,
				},
				content: [
					{ tag: 'encopt', attrs: { keygen: '2' }, content: undefined },
					{ tag: 'enc', attrs: { v: '2', type: 'msg' }, content: undefined },
				]
			}]
		}

		await sendNode(stanza)
	}

	/**
	 * Send video state change during a call.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param callId - the call-id
	 * @param callCreator - JID of the call creator
	 * @param to - destination JID
	 * @param enabled - true = video on (state=1), false = video off (state=0)
	 * @param orientation - device orientation (0=portrait, 1=landscape)
	 */
	const sendVideoState = async (
		callId: string,
		callCreator: string,
		to: string,
		enabled: boolean,
		orientation: string = '1',
	) => {
		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to,
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'video',
				attrs: {
					'call-id': callId,
					'call-creator': callCreator,
					state: enabled ? '1' : '0',
					device_orientation: orientation,
				},
				content: undefined
			}]
		}

		await sendNode(stanza)
	}

	/**
	 * Create a call link that others can join.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param media - 'video' or 'audio'
	 * @returns object with token, full URL, and raw server response
	 */
	const createCallLink = async (
		media: 'video' | 'audio' = 'video',
		event?: { startTime: number },
		timeoutMs?: number
	) => {
		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to: 'call',
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'link_create',
				attrs: { media },
				content: event
					? [{ tag: 'event', attrs: { start_time: String(event.startTime) }, content: undefined }]
					: undefined
			}]
		}

		const response = await query(stanza, timeoutMs)

		// Extract token from server response
		let token: string | undefined
		const linkCreateResp = getBinaryNodeChild(response, 'link_create')
		if (linkCreateResp) {
			token = linkCreateResp.attrs.token || linkCreateResp.attrs['link-token']
		}

		// Fallback: check response attrs directly
		if (!token) {
			token = response.attrs?.token || response.attrs?.['link-token']
		}

		// Fallback: search any child with token/link-token
		if (!token && Array.isArray(response.content)) {
			for (const child of response.content as BinaryNode[]) {
				if (child.attrs?.token || child.attrs?.['link-token']) {
					token = child.attrs.token || child.attrs['link-token']
					break
				}
			}
		}

		// URL format verified via Frida capture: https://call.whatsapp.com/<token>
		const url = token
			? `https://call.whatsapp.com/${token}`
			: undefined

		return { token, url, response }
	}

	/**
	 * Query info about a call link before joining.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param token - the call link token (from URL: https://call.whatsapp.com/<token>)
	 * @param media - 'video' or 'audio'
	 * @returns server response with call info
	 */
	const queryCallLink = async (token: string, media: 'video' | 'audio' = 'video') => {
		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to: 'call',
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'link_query',
				attrs: { media, token },
				content: undefined
			}]
		}

		return await query(stanza)
	}

	/**
	 * Join a call via its link token.
	 * Structure verified via Frida capture on WhatsApp Android v2.26.
	 *
	 * @param token - the call link token
	 * @param media - 'video' or 'audio'
	 * @returns server response with relay/group info
	 */
	const joinCallLink = async (token: string, media: 'video' | 'audio' = 'video') => {
		const joinContent: BinaryNode[] = [
			{ tag: 'audio', attrs: { rate: '16000', enc: 'opus' }, content: undefined },
			{ tag: 'net', attrs: { medium: '2' }, content: undefined },
			{ tag: 'capability', attrs: { ver: '1' }, content: undefined },
		]

		if (media === 'video') {
			joinContent.splice(1, 0, {
				tag: 'video',
				attrs: {
					screen_width: '1080',
					screen_height: '2400',
					dec: 'H264,H265,AV1',
					device_orientation: '0',
				},
				content: undefined
			})
		}

		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				to: 'call',
				id: randomBytes(16).toString('hex').toUpperCase(),
			},
			content: [{
				tag: 'link_join',
				attrs: { media, token },
				content: joinContent
			}]
		}

		return await query(stanza)
	}

	const sendRetryRequest = async (node: BinaryNode, forceIncludeKeys = false, decryptionError?: string) => {
		const { fullMessage } = decodeMessageNode(node, authState.creds.me!.id, authState.creds.me!.lid || '')
		const { key: msgKey } = fullMessage
		const msgId = msgKey.id!

		// Per-JID deduplication: when multiple messages from the same contact
		// fail with Bad MAC simultaneously, only send ONE retry request.
		// The peer will resend all failed messages when it receives the retry receipt.
		// For group messages, scope by participant (each participant has its own Signal session).
		const retryDedupeJid = msgKey.participant
			? jidNormalizedUser(msgKey.participant)
			: jidNormalizedUser(node.attrs.from!)
		if (retryRequestActiveJids.has(retryDedupeJid)) {
			logger.debug(
				{ fromJid: retryDedupeJid, msgId },
				'Skipping duplicate retry request — already in-flight for this JID'
			)
			return
		}

		if (messageRetryManager) {
			// Check if we've exceeded max retries using the new system
			if (messageRetryManager.hasExceededMaxRetries(msgId)) {
				logger.debug({ msgId }, 'reached retry limit with new retry manager, clearing')
				messageRetryManager.markRetryFailed(msgId)
				recordMessageFailure('retry', 'max_retries_reached')

				// Safety net: clean up corrupted sessions only after all retries exhausted.
				// This avoids the cascading delete loop that occurs when cleanup runs
				// on every Bad MAC in the hot path (decode-wa-message.ts).
				// The Signal Protocol recovers naturally via retry+pkmsg for most cases;
				// this cleanup only runs as a last resort.
				// For group messages, use participant JID (Signal sessions are per-participant, not per-group).
				if (autoCleanCorrupted) {
					const senderJid = msgKey.participant ? jidNormalizedUser(msgKey.participant) : jidNormalizedUser(node.attrs.from!)
					try {
						const decryptionJid = await getDecryptionJid(senderJid, signalRepository)
						const deletedCount = await cleanupCorruptedSession(decryptionJid, signalRepository, logger)
						if (deletedCount > 0) {
							logger.info(
								{ msgId, jid: decryptionJid, targetedDevices: deletedCount },
								`🔄 Session cleanup (retry exhausted) | Targeted: ${deletedCount} devices`
							)
						}
					} catch (cleanupErr) {
						logger.warn({ msgId, senderJid, err: cleanupErr }, 'Failed to cleanup session after retry exhaustion')
					}
				}

				return
			}

			// Increment retry count using new system
			const retryCount = messageRetryManager.incrementRetryCount(msgId)
			recordMessageRetry('retry')

			// Use the new retry count for the rest of the logic
			const key = `${msgId}:${msgKey?.participant}`
			await msgRetryCache.set(key, retryCount)
		} else {
			// Fallback to old system
			const key = `${msgId}:${msgKey?.participant}`
			let retryCount = (await msgRetryCache.get<number>(key)) || 0
			if (retryCount >= maxMsgRetryCount) {
				logger.debug({ retryCount, msgId }, 'reached retry limit, clearing')
				await msgRetryCache.del(key)
				recordMessageFailure('retry', 'max_retries_reached')

				// Safety net cleanup (same as new system above)
				if (autoCleanCorrupted) {
					const senderJid = msgKey.participant ? jidNormalizedUser(msgKey.participant) : jidNormalizedUser(node.attrs.from!)
					try {
						const decryptionJid = await getDecryptionJid(senderJid, signalRepository)
						await cleanupCorruptedSession(decryptionJid, signalRepository, logger)
					} catch (cleanupErr) {
						logger.warn({ msgId, senderJid, err: cleanupErr }, 'Failed to cleanup session after retry exhaustion')
					}
				}

				return
			}

			retryCount += 1
			await msgRetryCache.set(key, retryCount)
			recordMessageRetry('retry')
		}

		// Register dedup AFTER early-return checks so that max-retries paths
		// don't block subsequent messages from the same JID for 5 seconds.
		retryRequestActiveJids.add(retryDedupeJid)
		setTimeout(() => retryRequestActiveJids.delete(retryDedupeJid), 5_000)

		const key = `${msgId}:${msgKey?.participant}`
		const retryCount = (await msgRetryCache.get<number>(key)) || 1

		const { account, signedPreKey, signedIdentityKey: identityKey } = authState.creds
		const fromJid = node.attrs.from!

		// Derive the Signal error code from the actual decryption failure message.
		// Sent in the retry receipt so the peer (even another InfiniteAPI instance)
		// knows the exact failure type and can recreate the session immediately
		// instead of falling back to the 1-hour timeout.
		//
		// Codes mirror RetryReason enum in message-retry-manager.ts:
		//   0 = UnknownError | 1 = NoSession  | 2 = InvalidKey
		//   3 = InvalidKeyId | 4 = InvalidMessage | 7 = BadMac
		//
		// Uses DECRYPTION_RETRY_CONFIG error lists (single source of truth in
		// decode-wa-message.ts) so additions to those lists are picked up here
		// automatically.
		//
		// NOTE: We do NOT delete the session here (receiver side). The Signal Protocol
		// recovers automatically when the sender's pkmsg arrives — it overwrites the
		// corrupted session. Deleting prematurely creates a race window where no session
		// exists, which can cause "No Session" errors on concurrent messages.
		const retryErrorCode = (() => {
			if (!decryptionError) return 0
			// Bad MAC must be checked first — it is also in corruptedSessionErrors
			// but warrants the more specific code 7 over the generic code 4.
			if (decryptionError.includes(BAD_MAC_ERROR_TEXT)) return 7 // SignalErrorBadMac
			// MessageCounterError and other corrupted-session variants (code 4)
			if (DECRYPTION_RETRY_CONFIG.corruptedSessionErrors.some(e => decryptionError.includes(e))) return 4 // SignalErrorInvalidMessage
			// Missing / invalid session record (code 1)
			if (DECRYPTION_RETRY_CONFIG.sessionRecordErrors.some(e => decryptionError.includes(e)) ||
				/no\s+(open\s+)?sessions?/i.test(decryptionError)) return 1 // SignalErrorNoSession
			// PreKey / key-id errors (code 3)
			if (/pre\s*key/i.test(decryptionError)) return 3 // SignalErrorInvalidKeyId
			// Identity / key errors (code 2)
			if (/invalid\s*key|untrusted\s*identity/i.test(decryptionError)) return 2 // SignalErrorInvalidKey
			return 0
		})()

		if (retryCount <= 2) {
			// Use new retry manager for phone requests if available
			if (messageRetryManager) {
				// Schedule phone request with delay (like whatsmeow)
				messageRetryManager.schedulePhoneRequest(msgId, async () => {
					try {
						const requestId = await requestPlaceholderResend(msgKey)
						logger.debug(
							`sendRetryRequest: requested placeholder resend (${requestId}) for message ${msgId} (scheduled)`
						)
					} catch (error) {
						logger.warn({ error, msgId }, 'failed to send scheduled phone request')
					}
				})
			} else {
				// Fallback to immediate request
				const msgId = await requestPlaceholderResend(msgKey)
				logger.debug(`sendRetryRequest: requested placeholder resend for message ${msgId}`)
			}
		}

		if (!account) throw new Boom('Account not available', { statusCode: 401 })
		const deviceIdentity = encodeSignedDeviceIdentity(account, true)
		await authState.keys.transaction(async () => {
			const receipt: BinaryNode = {
				tag: 'receipt',
				attrs: {
					id: msgId,
					type: 'retry',
					to: node.attrs.from!
				},
				content: [
					{
						tag: 'retry',
						attrs: {
							count: retryCount.toString(),
							id: node.attrs.id!,
							t: node.attrs.t!,
							v: '1',
							error: retryErrorCode.toString()
						}
					},
					{
						tag: 'registration',
						attrs: {},
						content: encodeBigEndian(authState.creds.registrationId)
					}
				]
			}

			if (node.attrs.recipient) {
				receipt.attrs.recipient = node.attrs.recipient
			}

			if (node.attrs.participant) {
				receipt.attrs.participant = node.attrs.participant
			}

			if (retryCount > 1 || forceIncludeKeys) {
				const { update, preKeys } = await getNextPreKeys(authState, 1)

				const [keyId] = Object.keys(preKeys)
				const key = preKeys[+keyId!]

				const content = receipt.content! as BinaryNode[]
				content.push({
					tag: 'keys',
					attrs: {},
					content: [
						{ tag: 'type', attrs: {}, content: Buffer.from(KEY_BUNDLE_TYPE) },
						{ tag: 'identity', attrs: {}, content: identityKey.public },
						xmppPreKey(key!, +keyId!),
						xmppSignedPreKey(signedPreKey),
						{ tag: 'device-identity', attrs: {}, content: deviceIdentity }
					]
				})

				ev.emit('creds.update', update)
			}

			await sendNode(receipt)

			logger.info({ msgAttrs: node.attrs, retryCount }, 'sent retry receipt')
		}, authState?.creds?.me?.id || 'sendRetryRequest')
	}

	const handleEncryptNotification = async (node: BinaryNode) => {
		const from = node.attrs.from
		if (from === S_WHATSAPP_NET) {
			const countChild = getBinaryNodeChild(node, 'count')
			const count = +countChild!.attrs.value!
			const shouldUploadMorePreKeys = count < MIN_PREKEY_COUNT

			logger.debug({ count, shouldUploadMorePreKeys }, 'recv pre-key count')
			if (shouldUploadMorePreKeys) {
				// Top-up back to INITIAL_PREKEY_COUNT so the pool is always restored to full size
				await uploadPreKeys(Math.max(1, INITIAL_PREKEY_COUNT - count))
			}
		} else {
			const result = await handleIdentityChange(node, {
				meId: authState.creds.me?.id,
				meLid: authState.creds.me?.lid,
				validateSession: signalRepository.validateSession,
				assertSessions,
				debounceCache: identityAssertDebounce,
				logger
			})

			// When a session is refreshed (identity change), re-issue tctoken fire-and-forget
			// WABA Android: reissue stores senderTimestamp + realIssueTimestamp after IQ success
			if (result.action === 'session_refreshed') {
				const normalizedJid = jidNormalizedUser(from)
				resolveTcTokenJid(normalizedJid, getLIDForPN)
					.then(async tcJid => {
						const tcData = await authState.keys.get('tctoken', [tcJid])
						const entry = tcData[tcJid]
						if (entry?.token?.length && !isTcTokenExpired(entry.timestamp)) {
							const senderTs = unixTimestampSeconds()
							logTcToken('reissue', { jid: normalizedJid, reason: 'session_refreshed' })
							getPrivacyTokens([normalizedJid], senderTs)
								.then(async (iqResult) => {
									await storeTcTokensFromIqResult({
										result: iqResult,
										fallbackJid: normalizedJid,
										keys: authState.keys,
										getLIDForPN,
										onNewJidStored: (storedJid) => {
											tcTokenKnownJids.add(storedJid)
											scheduleTcTokenIndexSave()
										}
									})
									// Persist senderTimestamp + realIssueTimestamp after IQ success
									const currentData = await authState.keys.get('tctoken', [tcJid])
									const currentEntry = currentData[tcJid]
									await authState.keys.set({
										tctoken: {
											[tcJid]: {
												...currentEntry,
												token: currentEntry?.token ?? Buffer.alloc(0),
												senderTimestamp: senderTs,
												realIssueTimestamp: 0
											}
										}
									})
									logTcToken('reissue_ok', { jid: normalizedJid, reason: 'session_refreshed' })
								})
								.catch(err => {
									logTcToken('reissue_fail', { jid: normalizedJid, error: err?.message })
								})
						}
					})
					.catch(() => {
						/* ignore resolution errors */
					})
			}

			if (result.action === 'no_identity_node') {
				logger.info({ node }, 'unknown encrypt notification')
			}
		}
	}

	const handleGroupNotification = async (fullNode: BinaryNode, child: BinaryNode, msg: Partial<WAMessage>) => {
		const lidMapping = signalRepository.lidMapping

		const actingParticipantLid = fullNode.attrs.participant
		const actingParticipantPn = fullNode.attrs.participant_pn

		const affectedParticipantLid = getBinaryNodeChild(child, 'participant')?.attrs?.jid || actingParticipantLid!
		const affectedParticipantPn = getBinaryNodeChild(child, 'participant')?.attrs?.phone_number || actingParticipantPn!

		// Resolve acting participant to PN — prefer inline PN, fall back to LID→PN resolution
		const actingParticipant = actingParticipantPn
			|| await resolveLidToPn(actingParticipantLid, lidMapping, logger)

		// Resolve affected participant to PN
		const affectedParticipant = affectedParticipantPn
			|| await resolveLidToPn(affectedParticipantLid, lidMapping, logger)

		// Store LID↔PN mappings from notification attributes
		const mappingsToStore: Array<{ lid: string; pn: string }> = []
		if (actingParticipantLid && actingParticipantPn && isLidUser(actingParticipantLid) && isPnUser(actingParticipantPn)) {
			mappingsToStore.push({ lid: actingParticipantLid, pn: actingParticipantPn })
		}

		switch (child?.tag) {
			case 'create':
				const metadata = extractGroupMetadata(child)

				// Normalize group metadata participant IDs to PN
				for (const p of metadata.participants) {
					if (isLidUser(p.id)) {
						// Use inline phoneNumber if available, otherwise resolve via mapping
						if (p.phoneNumber) {
							// Store the mapping
							mappingsToStore.push({ lid: p.id, pn: p.phoneNumber })
							p.lid = p.id
							p.id = p.phoneNumber
						} else {
							const resolved = await resolveLidToPn(p.id, lidMapping, logger)
							if (resolved && resolved !== p.id) {
								p.lid = p.id
								p.id = resolved
							}
						}
					}
				}

				// Resolve metadata owner to PN
				if (metadata.owner && isLidUser(metadata.owner)) {
					const resolvedOwner = metadata.ownerPn || await resolveLidToPn(metadata.owner, lidMapping, logger)
					if (resolvedOwner) metadata.owner = resolvedOwner
				}

				msg.messageStubType = WAMessageStubType.GROUP_CREATE
				msg.messageStubParameters = [metadata.subject]
				msg.key = { participant: actingParticipant }

				ev.emit('chats.upsert', [
					{
						id: metadata.id,
						name: metadata.subject,
						conversationTimestamp: metadata.creation
					}
				])
				ev.emit('groups.upsert', [
					{
						...metadata,
						author: actingParticipant
					}
				])
				break
			case 'ephemeral':
			case 'not_ephemeral':
				msg.message = {
					protocolMessage: {
						type: proto.Message.ProtocolMessage.Type.EPHEMERAL_SETTING,
						ephemeralExpiration: +(child.attrs.expiration || 0)
					}
				}
				break
			case 'modify':
				const oldNumbers = await Promise.all(
					getBinaryNodeChildren(child, 'participant').map(async p => {
						const resolved = await resolveLidToPn(p.attrs.jid!, lidMapping, logger)
						return resolved || p.attrs.jid!
					})
				)
				msg.messageStubParameters = oldNumbers || []
				msg.messageStubType = WAMessageStubType.GROUP_PARTICIPANT_CHANGE_NUMBER
				break
			case 'promote':
			case 'demote':
			case 'remove':
			case 'add':
			case 'leave':
				const stubType = `GROUP_PARTICIPANT_${child.tag.toUpperCase()}`
				msg.messageStubType = WAMessageStubType[stubType as keyof typeof WAMessageStubType]

				const participants = await Promise.all(
					getBinaryNodeChildren(child, 'participant').map(async ({ attrs }) => {
						const rawJid = attrs.jid!
						let id = rawJid
						let phoneNumber: string | undefined
						let lid: string | undefined

						if (isLidUser(rawJid)) {
							// Primary is LID — resolve to PN
							phoneNumber = isPnUser(attrs.phone_number) ? attrs.phone_number : undefined
							if (phoneNumber) {
								mappingsToStore.push({ lid: rawJid, pn: phoneNumber })
								lid = rawJid
								id = phoneNumber
							} else {
								const resolved = await resolveLidToPn(rawJid, lidMapping, logger)
								if (resolved && resolved !== rawJid) {
									lid = rawJid
									id = resolved
								}
							}
						} else if (isPnUser(rawJid) && isLidUser(attrs.lid)) {
							// Primary is PN — store LID for reference
							lid = attrs.lid
							mappingsToStore.push({ lid: attrs.lid!, pn: rawJid })
						}

						return {
							id,
							phoneNumber,
							lid,
							admin: (attrs.type || null) as GroupParticipant['admin']
						}
					})
				)

				if (
					participants.length === 1 &&
					// if recv. "remove" message and sender removed themselves
					// mark as left
					(areJidsSameUser(participants[0]!.id, actingParticipant) ||
						areJidsSameUser(participants[0]!.id, actingParticipantLid) ||
						areJidsSameUser(participants[0]!.id, actingParticipantPn)) &&
					child.tag === 'remove'
				) {
					msg.messageStubType = WAMessageStubType.GROUP_PARTICIPANT_LEAVE
				}

				msg.messageStubParameters = participants.map(a => JSON.stringify(a))
				break
			case 'subject':
				msg.messageStubType = WAMessageStubType.GROUP_CHANGE_SUBJECT
				msg.messageStubParameters = [child.attrs.subject!]
				break
			case 'description':
				const description = getBinaryNodeChild(child, 'body')?.content?.toString()
				msg.messageStubType = WAMessageStubType.GROUP_CHANGE_DESCRIPTION
				msg.messageStubParameters = description ? [description] : undefined
				break
			case 'announcement':
			case 'not_announcement':
				msg.messageStubType = WAMessageStubType.GROUP_CHANGE_ANNOUNCE
				msg.messageStubParameters = [child.tag === 'announcement' ? 'on' : 'off']
				break
			case 'locked':
			case 'unlocked':
				msg.messageStubType = WAMessageStubType.GROUP_CHANGE_RESTRICT
				msg.messageStubParameters = [child.tag === 'locked' ? 'on' : 'off']
				break
			case 'invite':
				msg.messageStubType = WAMessageStubType.GROUP_CHANGE_INVITE_LINK
				msg.messageStubParameters = [child.attrs.code!]
				break
			case 'member_add_mode':
				const addMode = child.content
				if (addMode) {
					msg.messageStubType = WAMessageStubType.GROUP_MEMBER_ADD_MODE
					msg.messageStubParameters = [addMode.toString()]
				}

				break
			case 'membership_approval_mode':
				const approvalMode = getBinaryNodeChild(child, 'group_join')
				if (approvalMode) {
					msg.messageStubType = WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_MODE
					msg.messageStubParameters = [approvalMode.attrs.state!]
				}

				break
			case 'created_membership_requests':
				msg.messageStubType = WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD
				msg.messageStubParameters = [
					JSON.stringify({ lid: affectedParticipantLid, pn: affectedParticipant }),
					'created',
					child.attrs.request_method!
				]
				break
			case 'revoked_membership_requests':
				const isDenied = areJidsSameUser(affectedParticipantLid, actingParticipantLid)
				msg.messageStubType = WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD
				msg.messageStubParameters = [
					JSON.stringify({ lid: affectedParticipantLid, pn: affectedParticipant }),
					isDenied ? 'revoked' : 'rejected'
				]
				break
		}

		// Persist any LID↔PN mappings discovered from notification attributes
		if (mappingsToStore.length) {
			await lidMapping.storeLIDPNMappings(mappingsToStore).catch(err => {
				logger.warn({ err, count: mappingsToStore.length }, 'Failed to store LID↔PN mappings from group notification')
			})
		}
	}

	const processNotification = async (node: BinaryNode) => {
		const result: Partial<WAMessage> = {}
		const [child] = getAllBinaryNodeChildren(node)
		const nodeType = node.attrs.type
		const from = jidNormalizedUser(node.attrs.from)

		switch (nodeType) {
			case 'newsletter':
				await handleNewsletterNotification(node)
				break
			case 'mex':
				await handleMexNewsletterNotification(node)
				break
			case 'w:gp2':
				await handleGroupNotification(node, child!, result)
				break
			case 'mediaretry':
				const event = decodeMediaRetryNode(node)
				// Normalize LID→PN in media retry key before emitting
				await normalizeKeyLidToPn(event.key, signalRepository.lidMapping, logger)
				ev.emit('messages.media-update', [event])
				break
			case 'encrypt':
				await handleEncryptNotification(node)
				break
			case 'devices':
				const devices = getBinaryNodeChildren(child, 'device')
				if (
					areJidsSameUser(child!.attrs.jid, authState.creds.me!.id) ||
					areJidsSameUser(child!.attrs.lid, authState.creds.me!.lid)
				) {
					const deviceData = devices.map(d => ({ id: d.attrs.jid, lid: d.attrs.lid }))
					logger.info({ deviceData }, 'my own devices changed')
				}

				//TODO: drop a new event, add hashes

				break
			case 'server_sync':
				const update = getBinaryNodeChild(node, 'collection')
				if (update) {
					const name = update.attrs.name as WAPatchName
					await resyncAppState([name], false)
				}

				break
			case 'picture':
				const setPicture = getBinaryNodeChild(node, 'set')
				const delPicture = getBinaryNodeChild(node, 'delete')

				{
					const rawPictureJid = jidNormalizedUser(node?.attrs?.from) || (setPicture || delPicture)?.attrs?.hash || ''
					const pictureJid = await resolveLidToPn(rawPictureJid, signalRepository.lidMapping, logger) || rawPictureJid
					ev.emit('contacts.update', [
						{
							id: pictureJid,
							imgUrl: setPicture ? 'changed' : 'removed'
						}
					])
				}

				if (isJidGroup(from)) {
					const node = setPicture || delPicture
					result.messageStubType = WAMessageStubType.GROUP_CHANGE_ICON

					if (setPicture) {
						result.messageStubParameters = [setPicture.attrs.id!]
					}

					result.participant = node?.attrs.author
					result.key = {
						...(result.key || {}),
						participant: setPicture?.attrs.author
					}
				}

				break
			case 'account_sync':
				if (child!.tag === 'disappearing_mode') {
					const newDuration = +child!.attrs.duration!
					const timestamp = +child!.attrs.t!

					logger.info({ newDuration }, 'updated account disappearing mode')

					ev.emit('creds.update', {
						accountSettings: {
							...authState.creds.accountSettings,
							defaultDisappearingMode: {
								ephemeralExpiration: newDuration,
								ephemeralSettingTimestamp: timestamp
							}
						}
					})
				} else if (child!.tag === 'blocklist') {
					const blocklists = getBinaryNodeChildren(child, 'item')

					for (const { attrs } of blocklists) {
						const resolvedBlockJid = await resolveLidToPn(attrs.jid!, signalRepository.lidMapping, logger) || attrs.jid!
						const blocklist = [resolvedBlockJid]
						const type = attrs.action === 'block' ? 'add' : 'remove'
						ev.emit('blocklist.update', { blocklist, type })
					}
				}

				break
			case 'link_code_companion_reg':
				const linkCodeCompanionReg = getBinaryNodeChild(node, 'link_code_companion_reg')
				const ref = toRequiredBuffer(getBinaryNodeChildBuffer(linkCodeCompanionReg, 'link_code_pairing_ref'))
				const primaryIdentityPublicKey = toRequiredBuffer(
					getBinaryNodeChildBuffer(linkCodeCompanionReg, 'primary_identity_pub')
				)
				const primaryEphemeralPublicKeyWrapped = toRequiredBuffer(
					getBinaryNodeChildBuffer(linkCodeCompanionReg, 'link_code_pairing_wrapped_primary_ephemeral_pub')
				)
				const codePairingPublicKey = await decipherLinkPublicKey(primaryEphemeralPublicKeyWrapped)
				const companionSharedKey = Curve.sharedKey(
					authState.creds.pairingEphemeralKeyPair.private,
					codePairingPublicKey
				)
				const random = randomBytes(32)
				const linkCodeSalt = randomBytes(32)
				const linkCodePairingExpanded = hkdf(companionSharedKey, 32, {
					salt: linkCodeSalt,
					info: 'link_code_pairing_key_bundle_encryption_key'
				})
				const encryptPayload = Buffer.concat([
					Buffer.from(authState.creds.signedIdentityKey.public),
					primaryIdentityPublicKey,
					random
				])
				const encryptIv = randomBytes(12)
				const encrypted = aesEncryptGCM(encryptPayload, linkCodePairingExpanded, encryptIv, Buffer.alloc(0))
				const encryptedPayload = Buffer.concat([linkCodeSalt, encryptIv, encrypted])
				const identitySharedKey = Curve.sharedKey(authState.creds.signedIdentityKey.private, primaryIdentityPublicKey)
				const identityPayload = Buffer.concat([companionSharedKey, identitySharedKey, random])
				authState.creds.advSecretKey = Buffer.from(hkdf(identityPayload, 32, { info: 'adv_secret' })).toString('base64')
				await query({
					tag: 'iq',
					attrs: {
						to: S_WHATSAPP_NET,
						type: 'set',
						id: sock.generateMessageTag(),
						xmlns: 'md'
					},
					content: [
						{
							tag: 'link_code_companion_reg',
							attrs: {
								jid: authState.creds.me!.id,
								stage: 'companion_finish'
							},
							content: [
								{
									tag: 'link_code_pairing_wrapped_key_bundle',
									attrs: {},
									content: encryptedPayload
								},
								{
									tag: 'companion_identity_public',
									attrs: {},
									content: authState.creds.signedIdentityKey.public
								},
								{
									tag: 'link_code_pairing_ref',
									attrs: {},
									content: ref
								}
							]
						}
					]
				})
				authState.creds.registered = true
				ev.emit('creds.update', authState.creds)
				break
			case 'privacy_token':
				await handlePrivacyTokenNotification(node)
				break
		}

		if (Object.keys(result).length) {
			return result
		}
	}

	const handlePrivacyTokenNotification = async (node: BinaryNode) => {
		const tokensNode = getBinaryNodeChild(node, 'tokens')
		const from = jidNormalizedUser(node.attrs.from)

		if (!tokensNode) return

		const tokenNodes = getBinaryNodeChildren(tokensNode, 'token')

		for (const tokenNode of tokenNodes) {
			const { attrs, content } = tokenNode
			const type = attrs.type
			const timestamp = attrs.t

			if (type === 'trusted_contact' && content instanceof Uint8Array) {
				// Resolve to LID for consistent storage key
				const senderLid = attrs.sender_lid ? jidNormalizedUser(attrs.sender_lid) : undefined
				const storageJid = senderLid || (await resolveTcTokenJid(from, getLIDForPN))

				// Timestamp monotonicity guard — only store if incoming >= existing
				const existingData = await authState.keys.get('tctoken', [storageJid])
				const existing = existingData[storageJid]
				const existingTs = existing?.timestamp ? Number(existing.timestamp) : 0
				const incomingTs = timestamp ? Number(timestamp) : 0
				if (existingTs > 0 && incomingTs > 0 && existingTs > incomingTs) {
					continue
				}

				// Don't store timestamp-less tokens — they expire immediately and would
				// corrupt a valid existing entry if one is already present
				if (!incomingTs) {
					continue
				}

				await authState.keys.set({
					tctoken: {
						[storageJid]: {
							...existing,
							token: Buffer.from(content),
							timestamp,
							// WABA Android: resets real_issue_timestamp when a new incoming token arrives
							// (UPDATE wa_trusted_contacts_send SET real_issue_timestamp=null)
							realIssueTimestamp: null
						}
					}
				})

				logTcToken('stored', { jid: storageJid, from })

				// Track JID for cross-session pruning
				tcTokenKnownJids.add(storageJid)
				scheduleTcTokenIndexSave()
			}
		}
	}

	async function decipherLinkPublicKey(data: Uint8Array | Buffer) {
		const buffer = toRequiredBuffer(data)
		const salt = buffer.slice(0, 32)
		const secretKey = await derivePairingCodeKey(authState.creds.pairingCode!, salt)
		const iv = buffer.slice(32, 48)
		const payload = buffer.slice(48, 80)
		return aesDecryptCTR(payload, secretKey, iv)
	}

	function toRequiredBuffer(data: Uint8Array | Buffer | undefined) {
		if (data === undefined) {
			throw new Boom('Invalid buffer', { statusCode: 400 })
		}

		return data instanceof Buffer ? data : Buffer.from(data)
	}

	const willSendMessageAgain = async (id: string, participant: string) => {
		const key = `${id}:${participant}`
		const retryCount = (await msgRetryCache.get<number>(key)) || 0
		return retryCount < maxMsgRetryCount
	}

	const updateSendMessageAgainCount = async (id: string, participant: string) => {
		const key = `${id}:${participant}`
		const newValue = ((await msgRetryCache.get<number>(key)) || 0) + 1
		await msgRetryCache.set(key, newValue)
	}

	const sendMessagesAgain = async (key: WAMessageKey, ids: string[], retryNode: BinaryNode) => {
		const remoteJid = key.remoteJid!
		const participant = key.participant || remoteJid

		const retryCount = +retryNode.attrs.count! || 1

		// Try to get messages from cache first, then fallback to getMessage
		const msgs: (proto.IMessage | undefined)[] = []
		for (const id of ids) {
			let msg: proto.IMessage | undefined

			// Try to get from retry cache first if enabled
			if (messageRetryManager) {
				const cachedMsg = messageRetryManager.getRecentMessage(remoteJid, id)
				if (cachedMsg) {
					msg = cachedMsg.message
					logger.debug({ jid: remoteJid, id }, 'found message in retry cache')

					// Mark retry as successful since we found the message
					messageRetryManager.markRetrySuccess(id)
				}
			}

			// Fallback to getMessage if not found in cache
			if (!msg) {
				msg = await getMessage({ ...key, id })
				if (msg) {
					logger.debug({ jid: remoteJid, id }, 'found message via getMessage')
					// Also mark as successful if found via getMessage
					if (messageRetryManager) {
						messageRetryManager.markRetrySuccess(id)
					}
				}
			}

			msgs.push(msg)
		}

		// if it's the primary jid sending the request
		// just re-send the message to everyone
		// prevents the first message decryption failure
		const sendToAll = !jidDecode(participant)?.device

		// Check if we should recreate session for this retry
		let shouldRecreateSession = false
		let recreateReason = ''

		if (enableAutoSessionRecreation && messageRetryManager && retryCount >= 1) {
			try {
				const sessionId = signalRepository.jidToSignalProtocolAddress(participant)

				const hasSession = await signalRepository.validateSession(participant)

				// Extract error code from retry node if present (for MAC error detection)
				const errorAttr = retryNode?.attrs?.error as string | undefined
				const errorCode = messageRetryManager.parseRetryErrorCode(errorAttr)

				const result = messageRetryManager.shouldRecreateSession(participant, hasSession.exists, errorCode)
				shouldRecreateSession = result.recreate
				recreateReason = result.reason

				if (shouldRecreateSession) {
					logger.debug(
						{ participant, retryCount, reason: recreateReason, errorCode },
						'recreating session for outgoing retry'
					)
					// CRITICAL: Use same transaction key as encrypt/decrypt operations to prevent race
					// Using meId ensures this delete serializes with sendMessage() and other session operations
					await authState.keys.transaction(async () => {
						await authState.keys.set({ session: { [sessionId]: null } })
					}, authState.creds.me?.id || 'session-operation')
				}
			} catch (error) {
				logger.warn({ error, participant }, 'failed to check session recreation for outgoing retry')
			}
		}

		await assertSessions([participant], true)

		if (isJidGroup(remoteJid)) {
			await authState.keys.set({ 'sender-key-memory': { [remoteJid]: null } })
		}

		logger.debug({ participant, sendToAll, shouldRecreateSession, recreateReason }, 'forced new session for retry recp')

		for (const [i, msg] of msgs.entries()) {
			if (!ids[i]) continue

			if (msg && (await willSendMessageAgain(ids[i], participant))) {
				await updateSendMessageAgainCount(ids[i], participant)
				const msgRelayOpts: MessageRelayOptions = { messageId: ids[i] }

				if (sendToAll) {
					msgRelayOpts.useUserDevicesCache = false
				} else {
					msgRelayOpts.participant = {
						jid: participant,
						count: +retryNode.attrs.count!
					}
				}

				await relayMessage(key.remoteJid!, msg, msgRelayOpts)
			} else {
				logger.debug({ jid: key.remoteJid, id: ids[i] }, 'recv retry request, but message not available')
			}
		}
	}

	const handleReceipt = async (node: BinaryNode) => {
		const { attrs, content } = node
		const isLid = attrs.from!.includes('lid')
		const isNodeFromMe = areJidsSameUser(
			attrs.participant || attrs.from,
			isLid ? authState.creds.me?.lid : authState.creds.me?.id
		)
		const remoteJid = !isNodeFromMe || isJidGroup(attrs.from) ? attrs.from : attrs.recipient
		const fromMe = !attrs.recipient || ((attrs.type === 'retry' || attrs.type === 'sender') && isNodeFromMe)

		const key: proto.IMessageKey = {
			remoteJid,
			id: '',
			fromMe,
			participant: attrs.participant
		}

		// Normalize LID→PN in receipt key so events always emit PN JIDs
		const lidMapping = signalRepository.lidMapping
		const [resolvedRemoteJid, resolvedParticipant] = await Promise.all([
			resolveLidToPn(key.remoteJid, lidMapping, logger),
			resolveLidToPn(key.participant, lidMapping, logger)
		])
		if (resolvedRemoteJid) key.remoteJid = resolvedRemoteJid
		if (resolvedParticipant) key.participant = resolvedParticipant

		if (shouldIgnoreJid(remoteJid!) && remoteJid !== S_WHATSAPP_NET) {
			logger.trace({ remoteJid }, 'ignoring receipt from jid')
			await sendMessageAck(node)
			return
		}

		const ids = [attrs.id!]
		if (Array.isArray(content)) {
			const items = getBinaryNodeChildren(content[0], 'item')
			ids.push(...items.map(i => i.attrs.id!))
		}

		try {
			await Promise.all([
				receiptMutex.mutex(jidNormalizedUser(remoteJid) || 'unknown', async () => {
					const status = getStatusFromReceiptType(attrs.type)
					if (
						typeof status !== 'undefined' &&
						// basically, we only want to know when a message from us has been delivered to/read by the other person
						// or another device of ours has read some messages
						(status >= proto.WebMessageInfo.Status.SERVER_ACK || !isNodeFromMe)
					) {
						if (isJidGroup(remoteJid) || isJidStatusBroadcast(remoteJid!)) {
							if (attrs.participant) {
								const updateKey: keyof MessageUserReceipt =
									status === proto.WebMessageInfo.Status.DELIVERY_ACK ? 'receiptTimestamp' : 'readTimestamp'
								const resolvedReceiptUserJid = await resolveLidToPn(attrs.participant, lidMapping, logger) || jidNormalizedUser(attrs.participant)
								ev.emit(
									'message-receipt.update',
									ids.map(id => ({
										key: { ...key, id },
										receipt: {
											userJid: jidNormalizedUser(resolvedReceiptUserJid),
											[updateKey]: +attrs.t!
										}
									}))
								)
							}
						} else {
							ev.emit(
								'messages.update',
								ids.map(id => ({
									key: { ...key, id },
									update: { status, messageTimestamp: toNumber(+(attrs.t ?? 0)) }
								}))
							)
						}
					}

					if (attrs.type === 'retry') {
						// correctly set who is asking for the retry
						key.participant = key.participant || attrs.from
						const retryNode = getBinaryNodeChild(node, 'retry')
						if (ids[0] && key.participant && (await willSendMessageAgain(ids[0], key.participant))) {
							if (key.fromMe) {
								try {
									await updateSendMessageAgainCount(ids[0], key.participant)
									logger.debug({ attrs, key }, 'recv retry request')
									await sendMessagesAgain(key, ids, retryNode!)
								} catch (error: unknown) {
									logger.error(
										{ key, ids, trace: error instanceof Error ? error.stack : 'Unknown error' },
										'error in sending message again'
									)
								}
							} else {
								logger.info({ attrs, key }, 'recv retry for not fromMe message')
							}
						} else {
							logger.info({ attrs, key }, 'will not send message again, as sent too many times')
						}
					}
				})
			])
		} finally {
			await sendMessageAck(node)
		}
	}

	const handleNotification = async (node: BinaryNode) => {
		const remoteJid = node.attrs.from
		if (shouldIgnoreJid(remoteJid!) && remoteJid !== S_WHATSAPP_NET) {
			logger.trace({ remoteJid }, 'ignored notification')
			await sendMessageAck(node)
			return
		}

		try {
			await Promise.all([
				notificationMutex.mutex(jidNormalizedUser(remoteJid) || 'unknown', async () => {
					const msg = await processNotification(node)
					if (msg) {
						const fromMe = areJidsSameUser(node.attrs.participant || remoteJid, authState.creds.me!.id)
						const { senderAlt: participantAlt, addressingMode } = extractAddressingContext(node)
						msg.key = {
							remoteJid,
							fromMe,
							participant: node.attrs.participant,
							participantAlt,
							addressingMode,
							id: node.attrs.id,
							...(msg.key || {})
						}
						msg.participant ??= node.attrs.participant
						msg.messageTimestamp = +node.attrs.t!

						const fullMsg = proto.WebMessageInfo.fromObject(msg) as WAMessage
						await upsertMessage(fullMsg, 'append')
					}
				})
			])
		} finally {
			await sendMessageAck(node)
		}
	}

	const handleMessage = async (node: BinaryNode) => {
		if (shouldIgnoreJid(node.attrs.from!) && node.attrs.from !== S_WHATSAPP_NET) {
			logger.trace({ from: node.attrs.from }, 'ignored message')
			// Send a clean ACK (no error code) so the server considers the
			// message delivered. Using error 500 (UnhandledError) previously
			// caused the server to retry delivery, generating duplicate traffic.
			await sendMessageAck(node)
			return
		}

		const encNode = getBinaryNodeChild(node, 'enc')
		// TODO: temporary fix for crashes and issues resulting of failed msmsg decryption
		if (encNode?.attrs.type === 'msmsg') {
			logger.debug({ key: node.attrs.key }, 'ignored msmsg')
			await sendMessageAck(node, NACK_REASONS.MissingMessageSecret)
			return
		}

		const {
			fullMessage: msg,
			category,
			author,
			decrypt
		} = decryptMessageNode(
			node,
			authState.creds.me!.id,
			authState.creds.me!.lid || '',
			signalRepository,
			logger,
		)

		const alt = msg.key.participantAlt || msg.key.remoteJidAlt
		// Handle LID/PN mappings with hybrid approach:
		// - Store mapping operation runs in background (non-critical for decrypt)
		// - Session migration MUST complete before decrypt() to avoid "No session record" errors
		// This addresses Codex/Copilot review concerns about race conditions with decrypt()
		if (!!alt) {
			const altServer = jidDecode(alt)?.server
			const primaryJid = msg.key.participant || msg.key.remoteJid!

			if (altServer === 'lid') {
				// Check if mapping already exists to avoid unnecessary storage operations
				const existingMapping = await signalRepository.lidMapping.getPNForLID(alt)
				if (!existingMapping) {
					// MUST await: normalizeMessageJids() runs after this and needs the mapping
					// in the LIDMappingStore to resolve LID→PN for events delivered to consumers
					await signalRepository.lidMapping
						.storeLIDPNMappings([{ lid: alt, pn: primaryJid }])
						.catch(error => logger.warn({ error, alt, primaryJid }, 'LID mapping storage failed'))
				}

				// CRITICAL: ALWAYS migrate session, even if mapping exists
				// Other code paths (e.g., USync device lookup in messages-send.ts:310-319)
				// may create mappings via storeLIDPNMappings() without calling migrateSession()
				// This leaves sessions under PN format while decrypt() expects LID format
				// Skipping migration based on mapping existence causes "No session record" errors
				await signalRepository.migrateSession(primaryJid, alt)
			} else {
				// Check if reverse mapping exists
				const existingMapping = await signalRepository.lidMapping.getLIDForPN(alt)
				if (!existingMapping) {
					// MUST await: normalizeMessageJids() runs after this and needs the mapping
					// in the LIDMappingStore to resolve LID→PN for events delivered to consumers
					await signalRepository.lidMapping
						.storeLIDPNMappings([{ lid: primaryJid, pn: alt }])
						.catch(error => logger.warn({ error, alt, primaryJid }, 'LID mapping storage failed'))
				}

				// CRITICAL: ALWAYS migrate session, even if mapping exists
				// Same reasoning as above - mapping existence doesn't guarantee session migration
				await signalRepository.migrateSession(alt, primaryJid)
			}
		}

		if (msg.key?.remoteJid && msg.key?.id && messageRetryManager) {
			messageRetryManager.addRecentMessage(msg.key.remoteJid, msg.key.id, msg.message!)
			logger.debug(
				{
					jid: msg.key.remoteJid,
					id: msg.key.id
				},
				'Added message to recent cache for retry receipts'
			)
		}

		// CRITICAL: Normalize JIDs BEFORE acquiring mutex to ensure messages from the same
		// chat (arriving with different JID formats - LID vs PN) use the SAME mutex key.
		// This prevents parallel processing of messages from the same conversation which
		// would break message ordering guarantees.
		// Addresses Copilot/Codex PR #75 critical review: JID normalization vulnerability
		await normalizeMessageJids(msg, signalRepository, logger)

		try {
			// Use KeyedMutex with NORMALIZED remoteJid for parallel processing across different chats
			// while maintaining sequential order within the same chat
			// Fallback chain: remoteJid (normalized) > msg.key.id (unique) > 'unknown' (serializes all)
			let mutexKey = msg.key.remoteJid
			if (!mutexKey) {
				logger.warn(
					{ msgId: msg.key.id, fromMe: msg.key.fromMe },
					'Missing remoteJid after normalization, using msg.key.id as fallback'
				)
				mutexKey = msg.key.id || 'unknown'
			}

			await messageMutex.mutex(mutexKey, async () => {
				await decrypt()
				// message failed to decrypt
				if (msg.messageStubType === proto.WebMessageInfo.StubType.CIPHERTEXT && msg.category !== 'peer') {
					// Handle "Missing keys" - standard decryption failure
					// Return NACK with parsing error to signal the issue
					if (msg?.messageStubParameters?.[0] === MISSING_KEYS_ERROR_TEXT) {
						return sendMessageAck(node, NACK_REASONS.ParsingError)
					}

					// Handle "Message absent from node" - likely a CTWA (Click-to-WhatsApp) ads message
					// These messages are only encrypted for the primary phone, not linked devices
					// We need to request the message content from the phone via PDO (Peer Data Operation)
					if (msg.messageStubParameters?.[0] === NO_MESSAGE_FOUND_ERROR_TEXT) {
						// Skip unavailable fanout types - these messages will never have content available
						// These are system messages that cannot be decrypted or retrieved
						const messageType = msg.messageStubParameters?.[2]
						if (
							messageType === 'bot_unavailable_fanout' ||
							messageType === 'hosted_unavailable_fanout' ||
							messageType === 'view_once_unavailable_fanout'
						) {
							logger.debug(
								{ msgId: msg.key?.id, messageType },
								'CTWA: Skipping placeholder resend for unavailable fanout type'
							)
							metrics.ctwaRecoveryFailures.inc({ reason: 'unavailable_fanout' })
							return sendMessageAck(node)
						}

						// Skip old messages - don't request resend for messages older than 7 days
						const messageAge = unixTimestampSeconds() - toNumber(msg.messageTimestamp)

						if (messageAge > PLACEHOLDER_MAX_AGE_SECONDS) {
							logger.debug(
								{ msgId: msg.key?.id, messageAge, maxAge: PLACEHOLDER_MAX_AGE_SECONDS },
								'CTWA: Skipping placeholder resend for old message'
							)
							metrics.ctwaRecoveryFailures.inc({ reason: 'message_too_old' })
							return sendMessageAck(node)
						}

						if (enableCTWARecovery && msg.key) {
							const startTime = Date.now()
							const msgId = msg.key.id!
							const msgKey = msg.key

							// Prepare metadata to preserve original message details
							// The phone may not send all metadata in PDO response (e.g., pushName, participantAlt)
							// Caching these ensures we don't lose critical information like sender name and LID mappings
							const msgData: PlaceholderMessageData = {
								key: { ...msgKey },
								pushName: msg.pushName,
								messageTimestamp: msg.messageTimestamp,
								participant: msg.key.participant,
								participantAlt: msg.key.participantAlt
							}

							logger.info(
								{ msgId, remoteJid: msgKey.remoteJid, messageAge },
								'CTWA: Message absent from node detected, scheduling placeholder resend from phone'
							)

							// Use messageRetryManager to schedule the phone request with delay
							// This aligns with the upstream philosophy: centralize phone requests in the manager
							// Benefits: 3s delay (avoids spam), auto-cancellation if message arrives
							if (messageRetryManager) {
								metrics.ctwaRecoveryRequests.inc({ status: 'scheduled' })

								messageRetryManager.schedulePhoneRequest(msgId, async () => {
									try {
										const requestId = await requestPlaceholderResend(msgKey, msgData)
										if (requestId && requestId !== 'RESOLVED') {
											logger.debug({ msgId, requestId }, 'CTWA: Placeholder resend request sent successfully')
											metrics.ctwaRecoveryRequests.inc({ status: 'sent' })
											// Note: The actual message will be emitted via 'messages.upsert'
											// when the PEER_DATA_OPERATION_REQUEST_RESPONSE_MESSAGE is processed
											// in the PDO response handler in src/Utils/process-message.ts
										} else if (requestId === 'RESOLVED') {
											// Message was received while we were waiting
											logger.debug({ msgId }, 'CTWA: Message received during resend delay')
											metrics.ctwaMessagesRecovered.inc()
											metrics.ctwaRecoveryLatency.observe(Date.now() - startTime)
										} else {
											// Already requested (duplicate request prevented by cache)
											logger.debug({ msgId }, 'CTWA: Resend already requested, skipping duplicate')
										}
									} catch (error) {
										logger.warn({ error, msgId }, 'CTWA: Failed to request placeholder resend')
										metrics.ctwaRecoveryFailures.inc({ reason: 'request_failed' })
									}
								})
							} else {
								// Fallback: direct call if messageRetryManager is not available
								metrics.ctwaRecoveryRequests.inc({ status: 'requested' })

								try {
									const requestId = await requestPlaceholderResend(msgKey, msgData)
									if (requestId && requestId !== 'RESOLVED') {
										logger.debug({ msgId, requestId }, 'CTWA: Placeholder resend request sent successfully (direct)')
									} else if (requestId === 'RESOLVED') {
										// Message arrived during the internal 2s delay in requestPlaceholderResend
										logger.debug({ msgId }, 'CTWA: Message received before direct resend request completed')
										metrics.ctwaMessagesRecovered.inc()
										metrics.ctwaRecoveryLatency.observe(Date.now() - startTime)
									} else {
										// Already requested (duplicate request prevented by cache)
										logger.debug({ msgId }, 'CTWA: Resend already requested, skipping duplicate (direct)')
									}
								} catch (error) {
									logger.warn({ error, msgId }, 'CTWA: Failed to request placeholder resend')
									metrics.ctwaRecoveryFailures.inc({ reason: 'request_failed' })
								}
							}
						} else {
							logger.debug(
								{ msgId: msg.key?.id, enableCTWARecovery },
								'CTWA recovery disabled or missing key, skipping placeholder resend'
							)
						}

						return sendMessageAck(node)
					}

					// Skip retry for expired status messages (>24h old)
					if (isJidStatusBroadcast(msg.key.remoteJid!)) {
						const messageAge = unixTimestampSeconds() - toNumber(msg.messageTimestamp)
						if (messageAge > STATUS_EXPIRY_SECONDS) {
							logger.debug(
								{ msgId: msg.key.id, messageAge, remoteJid: msg.key.remoteJid },
								'skipping retry for expired status message'
							)
							return sendMessageAck(node)
						}
					}

					const errorMessage = msg?.messageStubParameters?.[0] || ''
					const isPreKeyError = errorMessage.includes('PreKey')

					logger.debug(`[handleMessage] Attempting retry request for failed decryption`)

					// Handle both pre-key and normal retries in single mutex
					await retryMutex.mutex(async () => {
						try {
							if (!ws.isOpen) {
								logger.debug({ node }, 'Connection closed, skipping retry')
								return
							}

							// Handle pre-key errors with upload and delay
							if (isPreKeyError) {
								logger.info({ error: errorMessage }, 'PreKey error detected, uploading and retrying')

								try {
									logger.debug('Uploading pre-keys for error recovery')
									await uploadPreKeys(5)
									logger.debug('Waiting for server to process new pre-keys')
									await delay(1000)
								} catch (uploadErr) {
									logger.error({ uploadErr }, 'Pre-key upload failed, proceeding with retry anyway')
								}
							}

							const encNode = getBinaryNodeChild(node, 'enc')
							await sendRetryRequest(node, !encNode, errorMessage)
							if (retryRequestDelayMs) {
								await delay(retryRequestDelayMs)
							}
						} catch (err) {
							logger.error({ err, isPreKeyError }, 'Failed to handle retry, attempting basic retry')
							// Still attempt retry even if pre-key upload failed
							try {
								const encNode = getBinaryNodeChild(node, 'enc')
								await sendRetryRequest(node, !encNode, errorMessage)
							} catch (retryErr) {
								logger.error({ retryErr }, 'Failed to send retry after error handling')
							}
						}

						await sendMessageAck(node, NACK_REASONS.UnhandledError)
					})
				} else {
					if (messageRetryManager && msg.key.id) {
						messageRetryManager.cancelPendingPhoneRequest(msg.key.id)
					}

					const isNewsletter = isJidNewsletter(msg.key.remoteJid!)
					if (!isNewsletter) {
						// no type in the receipt => message delivered
						let type: MessageReceiptType = undefined
						let participant = msg.key.participant
						if (category === 'peer') {
							// special peer message
							type = 'peer_msg'
						} else if (msg.key.fromMe) {
							// message was sent by us from a different device
							type = 'sender'
							// need to specially handle this case
							if (isLidUser(msg.key.remoteJid!) || isLidUser(msg.key.remoteJidAlt)) {
								participant = author // TODO: investigate sending receipts to LIDs and not PNs
							}
						} else if (!sendActiveReceipts) {
							type = 'inactive'
						}

						await sendReceipt(msg.key.remoteJid!, participant!, [msg.key.id!], type)

						// send ack for history message
						const isAnyHistoryMsg = getHistoryMsg(msg.message!)
						if (isAnyHistoryMsg) {
							const jid = jidNormalizedUser(msg.key.remoteJid!)
							await sendReceipt(jid, undefined, [msg.key.id!], 'hist_sync') // TODO: investigate
						}
					} else {
						await sendMessageAck(node)
						logger.debug({ key: msg.key }, 'processed newsletter message without receipts')
					}
				}

				// JID normalization moved BEFORE mutex acquisition (line 1273) to prevent race conditions
				// cleanMessage still runs inside mutex to ensure atomic message processing
				cleanMessage(msg, authState.creds.me!.id, authState.creds.me!.lid!)

				await upsertMessage(msg, node.attrs.offline ? 'append' : 'notify')

				// Log with [BAILEYS] prefix
				if (msg.key.id && msg.key.remoteJid) {
					logMessageReceived(msg.key.id, msg.key.remoteJid)
				}

				// Record message received metric
				const msgContent = msg.message
				const msgType = msgContent?.conversation
					? 'text'
					: msgContent?.imageMessage
						? 'image'
						: msgContent?.videoMessage
							? 'video'
							: msgContent?.audioMessage
								? 'audio'
								: msgContent?.documentMessage
									? 'document'
									: msgContent?.stickerMessage
										? 'sticker'
										: msgContent?.reactionMessage
											? 'reaction'
											: 'other'
				recordMessageReceived(msgType)

				// Track session activity for cleanup
				if (sessionActivityTracker && msg.key.remoteJid) {
					sessionActivityTracker.recordActivity(msg.key.remoteJid)

					// For groups, also track participant activity
					if (msg.key.participant) {
						sessionActivityTracker.recordActivity(msg.key.participant)
					}
				}
			})
		} catch (error) {
			logger.error({ error, node: binaryNodeToString(node) }, 'error in handling message')
		}
	}

	/**
	 * Sanitizes caller phone number to fix known decoder bugs
	 *
	 * Brazilian Phone Format:
	 * - Mobile: 55 + DD + 9XXXXXXXX (13 digits total)
	 *   Example: 5515991000000 (55 + 15 + 991000000)
	 * - Landline: 55 + DD + XXXXXXXX (12 digits total)
	 *   Example: 551541410000 (55 + 15 + 41410000)
	 *
	 * Decoder Bug: Landlines incorrectly get trailing zero
	 * Example: 551738025555 → 5517380255550 (should be 12, not 13)
	 *
	 * Detection Logic:
	 * - Extract first digit after DDD (position 4 in string)
	 * - If digit is 2-5: It's a LANDLINE
	 *   → 13 digits is ERROR → Remove trailing zero
	 * - If digit is 6-9: It's a MOBILE
	 *   → 13 digits is CORRECT → Don't touch!
	 *
	 * @param pn - Raw phone number from caller_pn attribute
	 * @returns Sanitized phone number
	 */
	const sanitizeCallerPn = (pn: string | undefined): string | undefined => {
		if (!pn) {
			return undefined
		}

		// Only process Brazilian numbers (country code 55)
		if (!pn.startsWith('55')) {
			return pn
		}

		// Check if it's a 13-digit number (potential landline bug)
		if (pn.length === 13) {
			// Extract first digit after DDD (position 4)
			// Format: 55 DD X...
			//         01 23 4...
			const firstDigitAfterDDD = pn.charAt(4)

			// Landline: first digit is 2-5
			// If 13 digits, it's an error (should be 12) - remove trailing zero
			if (['2', '3', '4', '5'].includes(firstDigitAfterDDD)) {
				// Extra validation: only sanitize if ends with 0 (the bug pattern)
				if (pn.endsWith('0')) {
					const sanitized = pn.slice(0, -1)
					logger.debug(
						{ original: pn, sanitized, firstDigit: firstDigitAfterDDD, type: 'landline' },
						'Call: Sanitized Brazilian landline number (removed trailing zero)'
					)
					return sanitized
				}
			}

			// Mobile: first digit is 6-9
			// 13 digits is CORRECT for mobile - don't sanitize!
			if (['6', '7', '8', '9'].includes(firstDigitAfterDDD)) {
				logger.trace(
					{ pn, firstDigit: firstDigitAfterDDD, type: 'mobile' },
					'Call: Valid Brazilian mobile number (13 digits correct, not sanitizing)'
				)
				return pn
			}
		}

		return pn
	}

	/** Extract participants from a node containing <user> children */
	const extractParticipants = (parentNode: BinaryNode): WACallParticipant[] | undefined => {
		const userNodes = getBinaryNodeChildren(parentNode, 'user')
		if (!userNodes.length) return undefined
		return userNodes.map(u => ({
			jid: u.attrs.jid,
			state: u.attrs.state,
			userPn: u.attrs.user_pn,
			type: u.attrs.type,
		}))
	}

	const handleCall = async (node: BinaryNode) => {
		const { attrs } = node
		const children = getAllBinaryNodeChildren(node)

		if (!children.length) {
			throw new Boom('Missing call info in call node')
		}

		// Process ALL children — a <call> node can carry multiple
		// sibling stanzas (e.g. <transport> + <mute_v2>)
		for (const infoChild of children) {
			const status = getCallStatusFromNode(infoChild)

			const callId = infoChild.attrs['call-id']!
			const from = infoChild.attrs.from! || infoChild.attrs['call-creator']!

			const call: WACallEvent = {
				chatId: attrs.from!,
				from,
				id: callId,
				date: new Date(+attrs.t! * 1000),
				offline: !!attrs.offline,
				status
			}

			if (status === 'offer') {
				call.isVideo = !!getBinaryNodeChild(infoChild, 'video')
				call.isGroup = infoChild.attrs.type === 'group' || !!infoChild.attrs['group-jid']
				call.groupJid = infoChild.attrs['group-jid']
				// Extract and sanitize caller phone number
				call.callerPn = sanitizeCallerPn(infoChild.attrs['caller_pn'])

				// Extract call link info from group_info child
				const groupInfo = getBinaryNodeChild(infoChild, 'group_info')
				if (groupInfo) {
					call.isGroup = true
					call.linkToken = groupInfo.attrs['link-token']
					call.media = groupInfo.attrs.media
					call.connectedLimit = groupInfo.attrs['connected-limit']
						? Number(groupInfo.attrs['connected-limit'])
						: undefined
					call.participants = extractParticipants(groupInfo)
				}

				// Extract link_info (who created the link)
				const linkInfo = getBinaryNodeChild(infoChild, 'link_info')
				if (linkInfo) {
					call.linkCreator = linkInfo.attrs.link_creator
					call.linkCreatorPn = linkInfo.attrs.link_creator_pn
				}

				await callOfferCache.set(call.id, call)
			}

			// Extract call link data from group_update
			if (status === 'group_update') {
				const groupInfo = getBinaryNodeChild(infoChild, 'group_info')
				if (groupInfo) {
					call.isGroup = true
					call.linkToken = groupInfo.attrs['link-token']
					call.media = groupInfo.attrs.media
					call.connectedLimit = groupInfo.attrs['connected-limit']
						? Number(groupInfo.attrs['connected-limit'])
						: undefined
					call.participants = extractParticipants(groupInfo)
				}
			}

			// Extract reminder data (e.g. link_creator_call_started)
			if (status === 'reminder') {
				const groupInfo = getBinaryNodeChild(infoChild, 'group_info')
				if (groupInfo) {
					call.isGroup = true
					call.linkToken = groupInfo.attrs['link-token']
					call.media = groupInfo.attrs.media
				}
			}

			// Extract terminate data (reason, duration, call_summary)
			if (status === 'terminate') {
				call.terminateReason = infoChild.attrs.reason
				const callSummary = getBinaryNodeChild(infoChild, 'call_summary')
				if (callSummary) {
					call.media = callSummary.attrs.media
					call.duration = callSummary.attrs.call_duration
						? Number(callSummary.attrs.call_duration)
						: undefined
					call.participants = extractParticipants(callSummary)
				}
			}

			// Extract video info from accept/preaccept
			if (status === 'accept' || status === 'preaccept') {
				call.isVideo = !!getBinaryNodeChild(infoChild, 'video')
			}

			const existingCall = await callOfferCache.get<WACallEvent>(call.id)

			// use existing call info to populate this event
			if (existingCall) {
				call.isVideo = call.isVideo ?? existingCall.isVideo
				call.isGroup = call.isGroup ?? existingCall.isGroup
				call.groupJid = call.groupJid ?? existingCall.groupJid
				// Preserve callerPn across call state updates
				call.callerPn = call.callerPn || existingCall.callerPn
				// Preserve call link data across updates
				call.linkToken = call.linkToken || existingCall.linkToken
				call.linkCreator = call.linkCreator || existingCall.linkCreator
				call.linkCreatorPn = call.linkCreatorPn || existingCall.linkCreatorPn
				call.media = call.media || existingCall.media
				call.connectedLimit = call.connectedLimit ?? existingCall.connectedLimit
			}

			// delete data once call has ended
			if (status === 'reject' || status === 'accept' || status === 'timeout' || status === 'terminate') {
				await callOfferCache.del(call.id)
			}

			// Normalize LID→PN in call event JIDs before emitting to consumers
			const callLidMapping = signalRepository.lidMapping
			const [resolvedChatId, resolvedFrom, resolvedLinkCreator] = await Promise.all([
				resolveLidToPn(call.chatId, callLidMapping, logger),
				resolveLidToPn(call.from, callLidMapping, logger),
				resolveLidToPn(call.linkCreator, callLidMapping, logger)
			])
			if (resolvedChatId) call.chatId = resolvedChatId
			if (resolvedFrom) call.from = resolvedFrom
			if (resolvedLinkCreator) call.linkCreator = resolvedLinkCreator
			// Resolve participant JIDs in parallel
			if (call.participants) {
				await Promise.all(call.participants.map(async (p) => {
					if (p.jid) {
						const resolved = p.userPn || await resolveLidToPn(p.jid, callLidMapping, logger)
						if (resolved) p.jid = resolved
					}
				}))
			}

			ev.emit('call', [call])
		}

		await sendMessageAck(node)
	}

	const handleBadAck = async ({ attrs }: BinaryNode) => {
		const key: WAMessageKey = { remoteJid: attrs.from, fromMe: true, id: attrs.id }
		await normalizeKeyLidToPn(key, signalRepository.lidMapping, logger)

		// WARNING: REFRAIN FROM ENABLING THIS FOR NOW. IT WILL CAUSE A LOOP
		// // current hypothesis is that if pash is sent in the ack
		// // it means -- the message hasn't reached all devices yet
		// // we'll retry sending the message here
		// if(attrs.phash) {
		// 	logger.info({ attrs }, 'received phash in ack, resending message...')
		// 	const msg = await getMessage(key)
		// 	if(msg) {
		// 		await relayMessage(key.remoteJid!, msg, { messageId: key.id!, useUserDevicesCache: false })
		// 	} else {
		// 		logger.warn({ attrs }, 'could not send message again, as it was not found')
		// 	}
		// }

		// error in acknowledgement,
		// device could not display the message
		if (attrs.error) {
			if (attrs.error === SERVER_ERROR_CODES.MissingTcToken) {
				const msgId = attrs.id
				const jid = jidNormalizedUser(attrs.from)
				logTcToken('error_463', { jid, msgId })

				// WABA Android: error 463 triggers getPrivacyTokens() fire-and-forget
				// to ensure token is available for the retry below
				getPrivacyTokens([jid])
					.then(async (result) => {
						await storeTcTokensFromIqResult({
							result,
							fallbackJid: jid,
							keys: authState.keys,
							getLIDForPN,
							onNewJidStored: (storedJid) => {
								tcTokenKnownJids.add(storedJid)
								scheduleTcTokenIndexSave()
							}
						})
						logTcToken('fetched', { jid, reason: 'error_463' })
					})
					.catch(() => { /* fire-and-forget */ })

				// Single-retry: wait 1.5s for the server's tctoken notification to arrive,
				// then resend. A Set prevents infinite retry loops.
				// Composite key (jid:msgId) ensures retries are isolated per destination.
				const retryKey = `${jid}:${msgId}`
				if (msgId && jid && !tcTokenRetriedMsgIds.has(retryKey)) {
					tcTokenRetriedMsgIds.add(retryKey)
					// Each entry auto-expires after 60s — naturally bounded under normal use
					setTimeout(() => tcTokenRetriedMsgIds.delete(retryKey), 60_000)
					;(async () => {
						try {
							await delay(1500)
							const msg =
								(await getMessage(key)) ??
								// Fallback: ack can arrive <30ms after send, before store persists
								messageRetryManager?.getRecentMessage(jid, msgId)?.message
							if (msg) {
								await relayMessage(jid, msg, { messageId: msgId, useUserDevicesCache: true })
								logTcToken('retry_463_ok', { jid, msgId })
							} else {
								logger.warn({ jid, msgId }, '463 retry: message not found in store')
								ev.emit('messages.update', [
									{ key, update: { status: WAMessageStatus.ERROR, messageStubParameters: ['463'] } }
								])
							}
						} catch (err: any) {
							logger.warn({ jid, msgId, err: err?.message }, '463 retry failed')
							ev.emit('messages.update', [
								{ key, update: { status: WAMessageStatus.ERROR, messageStubParameters: ['463'] } }
							])
						}
					})()

					return
				}
			} else if (attrs.error === SERVER_ERROR_CODES.SmaxInvalid) {
				const jid479 = jidNormalizedUser(attrs.from)
				logTcToken('error_479', { jid: jid479, msgId: attrs.id })
				// WABA Android: error 479 (SmaxInvalid) also triggers token re-fetch
				getPrivacyTokens([jid479])
					.then(async (result) => {
						await storeTcTokensFromIqResult({
							result,
							fallbackJid: jid479,
							keys: authState.keys,
							getLIDForPN,
							onNewJidStored: (storedJid) => {
								tcTokenKnownJids.add(storedJid)
								scheduleTcTokenIndexSave()
							}
						})
						logTcToken('fetched', { jid: jid479, reason: 'error_479' })
					})
					.catch(() => { /* fire-and-forget */ })
			} else {
				logger.warn({ attrs }, 'received error in ack')
			}

			ev.emit('messages.update', [
				{
					key,
					update: {
						status: WAMessageStatus.ERROR,
						messageStubParameters: [attrs.error]
					}
				}
			])
		}
	}

	/// processes a node with the given function
	/// and adds the task to the existing buffer if we're buffering events
	const processNodeWithBuffer = async <T>(
		node: BinaryNode,
		identifier: string,
		exec: (node: BinaryNode, offline: boolean) => Promise<T>
	) => {
		ev.buffer()
		await execTask()
		ev.flush()

		function execTask() {
			return exec(node, false).catch(err => onUnexpectedError(err, identifier))
		}
	}

	type MessageType = 'message' | 'call' | 'receipt' | 'notification'

	type OfflineNode = {
		type: MessageType
		node: BinaryNode
	}

	/** Yields control to the event loop to prevent blocking */
	const yieldToEventLoop = (): Promise<void> => {
		return new Promise(resolve => setImmediate(resolve))
	}

	const makeOfflineNodeProcessor = () => {
		const nodeProcessorMap: Map<MessageType, (node: BinaryNode) => Promise<void>> = new Map([
			['message', handleMessage],
			['call', handleCall],
			['receipt', handleReceipt],
			['notification', handleNotification]
		])
		const nodes: OfflineNode[] = []
		let isProcessing = false

		// Number of nodes to process before yielding to event loop
		const BATCH_SIZE = 25

		const enqueue = (type: MessageType, node: BinaryNode) => {
			nodes.push({ type, node })

			if (isProcessing) {
				return
			}

			isProcessing = true

			const promise = async () => {
				let processedInBatch = 0

				while (nodes.length && ws.isOpen) {
					const { type, node } = nodes.shift()!

					const nodeProcessor = nodeProcessorMap.get(type)

					if (!nodeProcessor) {
						onUnexpectedError(new Error(`unknown offline node type: ${type}`), 'processing offline node')
						continue
					}

					await nodeProcessor(node)
					processedInBatch++

					// Yield to event loop after processing a batch
					// This prevents blocking the event loop for too long when there are many offline nodes
					if (processedInBatch >= BATCH_SIZE) {
						processedInBatch = 0
						await yieldToEventLoop()
					}
				}

				isProcessing = false
			}

			promise().catch(error => onUnexpectedError(error, 'processing offline nodes'))
		}

		return { enqueue }
	}

	const offlineNodeProcessor = makeOfflineNodeProcessor()

	const processNode = async (
		type: MessageType,
		node: BinaryNode,
		identifier: string,
		exec: (node: BinaryNode) => Promise<void>
	) => {
		const isOffline = !!node.attrs.offline

		if (isOffline) {
			offlineNodeProcessor.enqueue(type, node)
		} else {
			await processNodeWithBuffer(node, identifier, exec)
		}
	}

	// recv a message
	ws.on('CB:message', async (node: BinaryNode) => {
		await processNode('message', node, 'processing message', handleMessage)
	})

	ws.on('CB:call', async (node: BinaryNode) => {
		await processNode('call', node, 'handling call', handleCall)
	})

	// Top-level <relay> stanzas carry TURN server info, tokens and crypto keys
	ws.on('CB:relay', async (node: BinaryNode) => {
		const callId = node.attrs['call-id']
		const rawCallCreator = node.attrs['call-creator']
		// Both callId and callCreator must be present to emit a valid event
		// (call link relays may arrive without these attrs — just log them)
		if (callId && rawCallCreator) {
			// Resolve LID→PN for call creator
			const callCreator = await resolveLidToPn(rawCallCreator, signalRepository.lidMapping, logger) || rawCallCreator
			logger.debug(
				{ callId, callCreator, uuid: node.attrs.uuid },
				'received relay info'
			)
			ev.emit('call', [{
				chatId: callCreator,
				from: callCreator,
				id: callId,
				date: new Date(),
				offline: false,
				status: 'relay' as WACallUpdateType,
			}])
		} else {
			logger.debug(
				{ attrs: node.attrs },
				'received relay stanza without call-id/call-creator'
			)
		}
	})

	ws.on('CB:receipt', async node => {
		await processNode('receipt', node, 'handling receipt', handleReceipt)
	})

	ws.on('CB:notification', async (node: BinaryNode) => {
		await processNode('notification', node, 'handling notification', handleNotification)
	})
	ws.on('CB:ack,class:message', (node: BinaryNode) => {
		handleBadAck(node).catch(error => onUnexpectedError(error, 'handling bad ack'))
	})

	ev.on('call', async ([call]) => {
		if (!call) {
			return
		}

		// missed call + group call notification message generation
		if (call.status === 'timeout' || (call.status === 'offer' && call.isGroup)) {
			const msg: WAMessage = {
				key: {
					remoteJid: call.chatId,
					id: call.id,
					fromMe: false
				},
				messageTimestamp: unixTimestampSeconds(call.date)
			}
			if (call.status === 'timeout') {
				if (call.isGroup) {
					msg.messageStubType = call.isVideo
						? WAMessageStubType.CALL_MISSED_GROUP_VIDEO
						: WAMessageStubType.CALL_MISSED_GROUP_VOICE
				} else {
					msg.messageStubType = call.isVideo ? WAMessageStubType.CALL_MISSED_VIDEO : WAMessageStubType.CALL_MISSED_VOICE
				}
			} else {
				msg.message = { call: { callKey: Buffer.from(call.id) } }
			}

			const protoMsg = proto.WebMessageInfo.fromObject(msg) as WAMessage
			await upsertMessage(protoMsg, call.offline ? 'append' : 'notify')
		}
	})

	ev.on('connection.update', ({ isOnline, connection }) => {
		// Flush pending tctoken index save on disconnect to avoid writing after close
		if (connection === 'close' && tcTokenIndexSaveTimer) {
			clearTimeout(tcTokenIndexSaveTimer)
			tcTokenIndexSaveTimer = undefined
			// Await index load first — prevents overwriting a more complete persisted index
			// if the connection closes before the initial load finishes.
			tcTokenIndexLoaded
				.then(() => {
					Promise.resolve(
						authState.keys.set({
							tctoken: {
								[TC_TOKEN_INDEX_KEY]: {
									token: Buffer.from(JSON.stringify([...tcTokenKnownJids]), 'utf8'),
									timestamp: unixTimestampSeconds().toString()
								}
							}
						})
					).catch(() => {
						/* non-critical */
					})
				})
				.catch(() => {
					/* non-critical */
				})
		}

		if (typeof isOnline !== 'undefined') {
			sendActiveReceipts = isOnline
			logger.trace(`sendActiveReceipts set to "${sendActiveReceipts}"`)

			// Prune expired tctokens when coming online (max once per 24h)
			if (isOnline) {
				const now = Date.now()
				const ONE_DAY_MS = 86400000
				if (now - lastTcTokenPruneTs > ONE_DAY_MS) {
					lastTcTokenPruneTs = now
					// Persist prune timestamp so it survives restarts
					Promise.resolve(
						authState.keys.set({
							tctoken: {
								[TC_TOKEN_PRUNE_TS_KEY]: {
									token: Buffer.alloc(0),
									timestamp: now.toString()
								}
							}
						})
					).catch(() => {
						/* non-critical */
					})
					pruneExpiredTcTokens().catch(err => {
						logger.debug({ err: err?.message }, 'tctoken pruning failed')
					})
				}
			}
		}
	})

	return {
		...sock,
		sendMessageAck,
		sendRetryRequest,
		rejectCall,
		offerCall,
		acceptCall,
		preacceptCall,
		terminateCall,
		sendRelayLatency,
		sendTransport,
		sendCallDuration,
		muteCall,
		sendHeartbeat,
		sendEncRekey,
		sendVideoState,
		createCallLink,
		queryCallLink,
		joinCallLink,
		fetchMessageHistory,
		requestPlaceholderResend,
		messageRetryManager
	}
}
