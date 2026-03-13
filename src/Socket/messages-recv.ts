import NodeCache from '@cacheable/node-cache'
import { Boom } from '@hapi/boom'
import { randomBytes } from 'crypto'
import Long from 'long'
import { proto } from '../../WAProto/index.js'
import {
	DEFAULT_CACHE_TTLS,
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
	getHistoryMsg,
	getNextPreKeys,
	getStatusFromReceiptType,
	handleIdentityChange,
	hkdf,
	MISSING_KEYS_ERROR_TEXT,
	NACK_REASONS,
	NO_MESSAGE_FOUND_ERROR_TEXT,
	toNumber,
	unixTimestampSeconds,
	xmppPreKey,
	xmppSignedPreKey
} from '../Utils'
import { makeMutex } from '../Utils/make-mutex'
import { makeOfflineNodeProcessor, type MessageType } from '../Utils/offline-node-processor'
import { buildAckStanza } from '../Utils/stanza-ack'
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
	const { logger, retryRequestDelayMs, maxMsgRetryCount, getMessage, shouldIgnoreJid, enableAutoSessionRecreation } =
		config
	const sock = makeMessagesSocket(config)
	const {
		ev,
		authState,
		ws,
		messageMutex,
		notificationMutex,
		receiptMutex,
		signalRepository,
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
		messageRetryManager
	} = sock

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
		msgData?: Partial<WAMessage>
	): Promise<string | undefined> => {
		if (!authState.creds.me?.id) {
			throw new Boom('Not authenticated')
		}

		if (await placeholderResendCache.get(messageKey?.id!)) {
			logger.debug({ messageKey }, 'already requested resend')
			return
		} else {
			// Store original message data so PDO response handler can preserve
			// metadata (LID details, timestamps, etc.) that the phone may omit
			await placeholderResendCache.set(messageKey?.id!, msgData || true)
		}

		await delay(2000)

		if (!(await placeholderResendCache.get(messageKey?.id!))) {
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

		setTimeout(async () => {
			if (await placeholderResendCache.get(messageKey?.id!)) {
				logger.debug({ messageKey }, 'PDO message without response after 8 seconds. Phone possibly offline')
				await placeholderResendCache.del(messageKey?.id!)
			}
		}, 8_000)

		return sendPeerDataOperationMessage(pdoMessage)
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
						ev.emit('newsletter-participants.update', {
							id: update.jid,
							author: node.attrs.from!,
							user: update.user,
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
		const author = node.attrs.participant!

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
				const participantUpdate = {
					id: from,
					author,
					user: child.attrs.jid!,
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

	const sendMessageAck = async (node: BinaryNode, errorCode?: number) => {
		const stanza = buildAckStanza(node, errorCode, authState.creds.me!.id)
		logger.debug({ recv: { tag: node.tag, attrs: node.attrs }, sent: stanza.attrs }, 'sent ack')
		await sendNode(stanza)
	}

	const rejectCall = async (callId: string, callFrom: string) => {
		const stanza: BinaryNode = {
			tag: 'call',
			attrs: {
				from: authState.creds.me!.id,
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

	// ====================================================================
	// Call signaling functions
	// ====================================================================

	/**
	 * Offer (initiate) a call to a JID.
	 * @param jid - destination JID
	 * @param isVideo - true for video call, false for voice
	 */
	const offerCall = async (jid: string, isVideo?: boolean) => {
		const meId = authState.creds.me?.id
		if (!meId) throw new Boom('Not authenticated', { statusCode: 401 })

		const callId = randomBytes(16).toString('hex').toUpperCase()
		const stanzaId = randomBytes(16).toString('hex').toUpperCase()

		const offerContent: BinaryNode[] = [
			{ tag: 'privacy', attrs: {}, content: undefined },
			{ tag: 'audio', attrs: { rate: '8000', enc: 'opus' }, content: undefined },
			{ tag: 'audio', attrs: { rate: '16000', enc: 'opus' }, content: undefined }
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
			{ tag: 'encopt', attrs: { keygen: '2' }, content: undefined }
		)

		// Voice calls include device-identity, video calls do not
		if (!isVideo) {
			offerContent.push({ tag: 'device-identity', attrs: {}, content: undefined })
		}

		const stanza: BinaryNode = {
			tag: 'call',
			attrs: { to: jid, id: stanzaId },
			content: [
				{
					tag: 'offer',
					attrs: { 'call-creator': meId, 'call-id': callId, device_class: '2013' },
					content: offerContent
				}
			]
		}

		await query(stanza)
		return { callId, stanzaId }
	}

	/** Terminate (hang up) an active or ringing call. */
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
			'call-creator': callCreator || meId
		}
		if (reason) terminateAttrs.reason = reason
		if (typeof duration === 'number') {
			terminateAttrs.duration = String(duration)
			terminateAttrs.audio_duration = String(duration)
		}

		const stanza: BinaryNode = {
			tag: 'call',
			attrs: { to: callTo, id: randomBytes(16).toString('hex').toUpperCase() },
			content: [{ tag: 'terminate', attrs: terminateAttrs, content: undefined }]
		}
		await query(stanza)
	}

	/** Accept (answer) an incoming call. */
	const acceptCall = async (callId: string, callFrom: string, isVideo?: boolean) => {
		const meId = authState.creds.me?.id
		if (!meId) throw new Boom('Not authenticated', { statusCode: 401 })

		const acceptContent: BinaryNode[] = [{ tag: 'audio', attrs: { rate: '16000', enc: 'opus' }, content: undefined }]
		if (isVideo) {
			acceptContent.push({ tag: 'video', attrs: { dec: 'H264,AV1', device_orientation: '1' }, content: undefined })
		}

		acceptContent.push(
			{ tag: 'net', attrs: { medium: '2' }, content: undefined },
			{ tag: 'encopt', attrs: { keygen: '2' }, content: undefined }
		)

		const stanza: BinaryNode = {
			tag: 'call',
			attrs: { from: meId, to: callFrom, id: randomBytes(16).toString('hex').toUpperCase() },
			content: [{ tag: 'accept', attrs: { 'call-id': callId, 'call-creator': callFrom }, content: acceptContent }]
		}
		await query(stanza)
	}

	/** Send preaccept signal (codec capabilities) for an incoming call. */
	const preacceptCall = async (callId: string, callCreator: string, isVideo?: boolean) => {
		const preacceptContent: BinaryNode[] = [{ tag: 'audio', attrs: { rate: '16000', enc: 'opus' }, content: undefined }]
		if (isVideo) {
			preacceptContent.push({
				tag: 'video',
				attrs: { screen_width: '1080', screen_height: '2400', dec: 'H264,H265,AV1', device_orientation: '0' },
				content: undefined
			})
		}

		preacceptContent.push(
			{ tag: 'encopt', attrs: { keygen: '2' }, content: undefined },
			{ tag: 'capability', attrs: { ver: '1' }, content: undefined }
		)

		const stanza: BinaryNode = {
			tag: 'call',
			attrs: { to: callCreator, id: randomBytes(16).toString('hex').toUpperCase() },
			content: [
				{ tag: 'preaccept', attrs: { 'call-id': callId, 'call-creator': callCreator }, content: preacceptContent }
			]
		}
		await query(stanza)
	}

	/** Report relay latency measurements to the server. */
	const sendRelayLatency = async (
		callId: string,
		callCreator: string,
		relays: Array<{ relayName?: string; latency: number; relayId?: string; dlBw?: number; ulBw?: number }>,
		transactionId?: string
	) => {
		const attrs: Record<string, string> = { 'call-id': callId, 'call-creator': callCreator }
		if (transactionId) attrs['transaction-id'] = transactionId

		const teChildren: BinaryNode[] = relays.map(r => {
			const teAttrs: Record<string, string> = {}
			if (r.relayName) teAttrs.relay_name = r.relayName
			teAttrs.latency = String(r.latency)
			if (r.relayId) teAttrs.relay_id = r.relayId
			if (r.dlBw !== undefined) teAttrs.dl_bw = String(r.dlBw)
			if (r.ulBw !== undefined) teAttrs.ul_bw = String(r.ulBw)
			return { tag: 'te', attrs: teAttrs, content: undefined }
		})

		await sendNode({
			tag: 'call',
			attrs: { to: callCreator, id: randomBytes(16).toString('hex').toUpperCase() },
			content: [{ tag: 'relaylatency', attrs, content: teChildren }]
		})
	}

	/** Send transport (p2p/ICE) candidates for a call. */
	const sendTransport = async (
		callId: string,
		callCreator: string,
		to: string,
		candidates: Array<{ priority: string; data?: Uint8Array }>,
		round?: number
	) => {
		const attrs: Record<string, string> = {
			'call-id': callId,
			'call-creator': callCreator,
			'transport-message-type': '1'
		}
		if (round !== undefined) attrs['p2p-cand-round'] = String(round)

		await sendNode({
			tag: 'call',
			attrs: { to, id: randomBytes(16).toString('hex').toUpperCase() },
			content: [
				{
					tag: 'transport',
					attrs,
					content: candidates.map(c => ({ tag: 'te', attrs: { priority: c.priority }, content: c.data }))
				}
			]
		})
	}

	/** Send call duration log to the server after a call ends. */
	const sendCallDuration = async (
		callId: string,
		callCreator: string,
		peer: string,
		audioDuration: number,
		callType = '1x1'
	) => {
		await sendNode({
			tag: 'call',
			attrs: { to: 'call', id: randomBytes(16).toString('hex').toUpperCase() },
			content: [
				{
					tag: 'duration',
					attrs: {
						'call-id': callId,
						'call-creator': callCreator,
						peer,
						audio_duration: String(audioDuration),
						type: callType
					},
					content: undefined
				}
			]
		})
	}

	/** Mute or unmute during a call. */
	const muteCall = async (callId: string, callCreator: string, to: string, muted: boolean) => {
		await sendNode({
			tag: 'call',
			attrs: { to, id: randomBytes(16).toString('hex').toUpperCase() },
			content: [
				{
					tag: 'mute_v2',
					attrs: { 'mute-state': muted ? '1' : '0', 'call-id': callId, 'call-creator': callCreator },
					content: undefined
				}
			]
		})
	}

	/** Send heartbeat to keep a group/link call alive. */
	const sendHeartbeat = async (callId: string, callCreator: string) => {
		await sendNode({
			tag: 'call',
			attrs: { to: `${callId}@call`, id: randomBytes(16).toString('hex').toUpperCase() },
			content: [{ tag: 'heartbeat', attrs: { 'call-id': callId, 'call-creator': callCreator }, content: undefined }]
		})
	}

	/** Send encryption re-key during a call. */
	const sendEncRekey = async (callId: string, callCreator: string, to: string, transactionId: string) => {
		await sendNode({
			tag: 'call',
			attrs: { to, id: randomBytes(16).toString('hex').toUpperCase() },
			content: [
				{
					tag: 'enc_rekey',
					attrs: { 'transaction-id': transactionId, 'call-id': callId, 'call-creator': callCreator },
					content: [
						{ tag: 'encopt', attrs: { keygen: '2' }, content: undefined },
						{ tag: 'enc', attrs: { v: '2', type: 'msg' }, content: undefined }
					]
				}
			]
		})
	}

	/** Send video state change during a call. */
	const sendVideoState = async (
		callId: string,
		callCreator: string,
		to: string,
		enabled: boolean,
		orientation = '1'
	) => {
		await sendNode({
			tag: 'call',
			attrs: { to, id: randomBytes(16).toString('hex').toUpperCase() },
			content: [
				{
					tag: 'video',
					attrs: {
						'call-id': callId,
						'call-creator': callCreator,
						state: enabled ? '1' : '0',
						device_orientation: orientation
					},
					content: undefined
				}
			]
		})
	}

	/** Create a call link that others can join. Returns { token, url, response }. */
	const createCallLink = async (
		media: 'video' | 'audio' = 'video',
		event?: { startTime: number },
		timeoutMs?: number
	) => {
		const stanza: BinaryNode = {
			tag: 'call',
			attrs: { to: 'call', id: randomBytes(16).toString('hex').toUpperCase() },
			content: [
				{
					tag: 'link_create',
					attrs: { media },
					content: event
						? [{ tag: 'event', attrs: { start_time: String(event.startTime) }, content: undefined }]
						: undefined
				}
			]
		}

		const response = await query(stanza, timeoutMs)

		let token: string | undefined
		const linkCreateResp = getBinaryNodeChild(response, 'link_create')
		if (linkCreateResp) {
			token = linkCreateResp.attrs.token || linkCreateResp.attrs['link-token']
		}

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

		const url = token ? `https://call.whatsapp.com/${token}` : undefined
		return { token, url, response }
	}

	/** Query info about a call link before joining. */
	const queryCallLink = async (token: string, media: 'video' | 'audio' = 'video') => {
		return await query({
			tag: 'call',
			attrs: { to: 'call', id: randomBytes(16).toString('hex').toUpperCase() },
			content: [{ tag: 'link_query', attrs: { media, token }, content: undefined }]
		})
	}

	/** Join a call via its link token. */
	const joinCallLink = async (token: string, media: 'video' | 'audio' = 'video') => {
		const joinContent: BinaryNode[] = [
			{ tag: 'audio', attrs: { rate: '16000', enc: 'opus' }, content: undefined },
			{ tag: 'net', attrs: { medium: '2' }, content: undefined },
			{ tag: 'capability', attrs: { ver: '1' }, content: undefined }
		]
		if (media === 'video') {
			joinContent.splice(1, 0, {
				tag: 'video',
				attrs: { screen_width: '1080', screen_height: '2400', dec: 'H264,H265,AV1', device_orientation: '0' },
				content: undefined
			})
		}

		return await query({
			tag: 'call',
			attrs: { to: 'call', id: randomBytes(16).toString('hex').toUpperCase() },
			content: [{ tag: 'link_join', attrs: { media, token }, content: joinContent }]
		})
	}

	const sendRetryRequest = async (node: BinaryNode, forceIncludeKeys = false) => {
		const { fullMessage } = decodeMessageNode(node, authState.creds.me!.id, authState.creds.me!.lid || '')
		const { key: msgKey } = fullMessage
		const msgId = msgKey.id!

		if (messageRetryManager) {
			// Check if we've exceeded max retries using the new system
			if (messageRetryManager.hasExceededMaxRetries(msgId)) {
				logger.debug({ msgId }, 'reached retry limit with new retry manager, clearing')
				messageRetryManager.markRetryFailed(msgId)
				return
			}

			// Increment retry count using new system
			const retryCount = messageRetryManager.incrementRetryCount(msgId)

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
				return
			}

			retryCount += 1
			await msgRetryCache.set(key, retryCount)
		}

		const key = `${msgId}:${msgKey?.participant}`
		const retryCount = (await msgRetryCache.get<number>(key)) || 1

		const { account, signedPreKey, signedIdentityKey: identityKey } = authState.creds
		const fromJid = node.attrs.from!

		// Check if we should recreate the session
		let shouldRecreateSession = false
		let recreateReason = ''

		if (enableAutoSessionRecreation && messageRetryManager && retryCount > 1) {
			try {
				// Check if we have a session with this JID
				const sessionId = signalRepository.jidToSignalProtocolAddress(fromJid)
				const hasSession = await signalRepository.validateSession(fromJid)
				const result = messageRetryManager.shouldRecreateSession(fromJid, hasSession.exists)
				shouldRecreateSession = result.recreate
				recreateReason = result.reason

				if (shouldRecreateSession) {
					logger.debug({ fromJid, retryCount, reason: recreateReason }, 'recreating session for retry')
					// Delete existing session to force recreation
					await authState.keys.set({ session: { [sessionId]: null } })
					forceIncludeKeys = true
				}
			} catch (error) {
				logger.warn({ error, fromJid }, 'failed to check session recreation')
			}
		}

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

		const deviceIdentity = encodeSignedDeviceIdentity(account!, true)
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
							// ADD ERROR FIELD
							error: '0'
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

			if (retryCount > 1 || forceIncludeKeys || shouldRecreateSession) {
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
				await uploadPreKeys()
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

			if (result.action === 'no_identity_node') {
				logger.info({ node }, 'unknown encrypt notification')
			}
		}
	}

	const handleGroupNotification = (fullNode: BinaryNode, child: BinaryNode, msg: Partial<WAMessage>) => {
		// TODO: Support PN/LID (Here is only LID now)

		const actingParticipantLid = fullNode.attrs.participant
		const actingParticipantPn = fullNode.attrs.participant_pn

		const affectedParticipantLid = getBinaryNodeChild(child, 'participant')?.attrs?.jid || actingParticipantLid!
		const affectedParticipantPn = getBinaryNodeChild(child, 'participant')?.attrs?.phone_number || actingParticipantPn!

		switch (child?.tag) {
			case 'create':
				const metadata = extractGroupMetadata(child)

				msg.messageStubType = WAMessageStubType.GROUP_CREATE
				msg.messageStubParameters = [metadata.subject]
				msg.key = { participant: metadata.owner, participantAlt: metadata.ownerPn }

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
						author: actingParticipantLid,
						authorPn: actingParticipantPn
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
				const oldNumber = getBinaryNodeChildren(child, 'participant').map(p => p.attrs.jid!)
				msg.messageStubParameters = oldNumber || []
				msg.messageStubType = WAMessageStubType.GROUP_PARTICIPANT_CHANGE_NUMBER
				break
			case 'promote':
			case 'demote':
			case 'remove':
			case 'add':
			case 'leave':
				const stubType = `GROUP_PARTICIPANT_${child.tag.toUpperCase()}`
				msg.messageStubType = WAMessageStubType[stubType as keyof typeof WAMessageStubType]

				const participants = getBinaryNodeChildren(child, 'participant').map(({ attrs }) => {
					// TODO: Store LID MAPPINGS
					return {
						id: attrs.jid!,
						phoneNumber: isLidUser(attrs.jid) && isPnUser(attrs.phone_number) ? attrs.phone_number : undefined,
						lid: isPnUser(attrs.jid) && isLidUser(attrs.lid) ? attrs.lid : undefined,
						admin: (attrs.type || null) as GroupParticipant['admin']
					}
				})

				if (
					participants.length === 1 &&
					// if recv. "remove" message and sender removed themselves
					// mark as left
					(areJidsSameUser(participants[0]!.id, actingParticipantLid) ||
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
					JSON.stringify({ lid: affectedParticipantLid, pn: affectedParticipantPn }),
					'created',
					child.attrs.request_method!
				]
				break
			case 'revoked_membership_requests':
				const isDenied = areJidsSameUser(affectedParticipantLid, actingParticipantLid)
				// TODO: LIDMAPPING SUPPORT
				msg.messageStubType = WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD
				msg.messageStubParameters = [
					JSON.stringify({ lid: affectedParticipantLid, pn: affectedParticipantPn }),
					isDenied ? 'revoked' : 'rejected'
				]
				break
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
				// TODO: HANDLE PARTICIPANT_PN
				handleGroupNotification(node, child!, result)
				break
			case 'mediaretry':
				const event = decodeMediaRetryNode(node)
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

				// TODO: WAJIDHASH stuff proper support inhouse
				ev.emit('contacts.update', [
					{
						id: jidNormalizedUser(node?.attrs?.from) || (setPicture || delPicture)?.attrs?.hash || '',
						imgUrl: setPicture ? 'changed' : 'removed'
					}
				])

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
						const blocklist = [attrs.jid!]
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

			if (type === 'trusted_contact' && content instanceof Buffer) {
				logger.debug(
					{
						from,
						timestamp,
						tcToken: content
					},
					'received trusted contact token'
				)

				await authState.keys.set({
					tctoken: { [from]: { token: content, timestamp } }
				})
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

		if (enableAutoSessionRecreation && messageRetryManager && retryCount > 1) {
			try {
				const sessionId = signalRepository.jidToSignalProtocolAddress(participant)

				const hasSession = await signalRepository.validateSession(participant)
				const result = messageRetryManager.shouldRecreateSession(participant, hasSession.exists)
				shouldRecreateSession = result.recreate
				recreateReason = result.reason

				if (shouldRecreateSession) {
					logger.debug({ participant, retryCount, reason: recreateReason }, 'recreating session for outgoing retry')
					await authState.keys.set({ session: { [sessionId]: null } })
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

		if (shouldIgnoreJid(remoteJid!) && remoteJid !== S_WHATSAPP_NET) {
			logger.debug({ remoteJid }, 'ignoring receipt from jid')
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
				receiptMutex.mutex(async () => {
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
								ev.emit(
									'message-receipt.update',
									ids.map(id => ({
										key: { ...key, id },
										receipt: {
											userJid: jidNormalizedUser(attrs.participant),
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
			await sendMessageAck(node).catch(ackErr => logger.error({ ackErr }, 'failed to ack receipt'))
		}
	}

	const handleNotification = async (node: BinaryNode) => {
		const remoteJid = node.attrs.from
		if (shouldIgnoreJid(remoteJid!) && remoteJid !== S_WHATSAPP_NET) {
			logger.debug({ remoteJid, id: node.attrs.id }, 'ignored notification')
			await sendMessageAck(node)
			return
		}

		try {
			await Promise.all([
				notificationMutex.mutex(async () => {
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
			await sendMessageAck(node).catch(ackErr => logger.error({ ackErr }, 'failed to ack notification'))
		}
	}

	const handleMessage = async (node: BinaryNode) => {
		if (shouldIgnoreJid(node.attrs.from!) && node.attrs.from !== S_WHATSAPP_NET) {
			logger.debug({ key: node.attrs.key }, 'ignored message')
			await sendMessageAck(node, NACK_REASONS.UnhandledError)
			return
		}

		const encNode = getBinaryNodeChild(node, 'enc')
		// TODO: temporary fix for crashes and issues resulting of failed msmsg decryption
		if (encNode?.attrs.type === 'msmsg') {
			logger.debug({ key: node.attrs.key }, 'ignored msmsg')
			await sendMessageAck(node, NACK_REASONS.MissingMessageSecret)
			return
		}

		let acked = false

		try {
			const {
				fullMessage: msg,
				category,
				author,
				decrypt
			} = decryptMessageNode(node, authState.creds.me!.id, authState.creds.me!.lid || '', signalRepository, logger)

			const alt = msg.key.participantAlt || msg.key.remoteJidAlt
			// store new mappings we didn't have before
			if (!!alt) {
				const altServer = jidDecode(alt)?.server
				const primaryJid = msg.key.participant || msg.key.remoteJid!
				if (altServer === 'lid') {
					if (!(await signalRepository.lidMapping.getPNForLID(alt))) {
						await signalRepository.lidMapping.storeLIDPNMappings([{ lid: alt, pn: primaryJid }])
						await signalRepository.migrateSession(primaryJid, alt)
					}
				} else {
					await signalRepository.lidMapping.storeLIDPNMappings([{ lid: primaryJid, pn: alt }])
					await signalRepository.migrateSession(alt, primaryJid)
				}
			}

			await messageMutex.mutex(async () => {
				await decrypt()

				if (msg.key?.remoteJid && msg.key?.id && msg.message && messageRetryManager) {
					messageRetryManager.addRecentMessage(msg.key.remoteJid, msg.key.id, msg.message)
				}

				// message failed to decrypt
				if (msg.messageStubType === proto.WebMessageInfo.StubType.CIPHERTEXT && msg.category !== 'peer') {
					if (msg?.messageStubParameters?.[0] === MISSING_KEYS_ERROR_TEXT) {
						acked = true
						return sendMessageAck(node, NACK_REASONS.ParsingError)
					}

					if (msg.messageStubParameters?.[0] === NO_MESSAGE_FOUND_ERROR_TEXT) {
						// Message arrived without encryption (e.g. CTWA ads messages).
						// Check if this is eligible for placeholder resend (matching WA Web filters).
						const unavailableNode = getBinaryNodeChild(node, 'unavailable')
						const unavailableType = unavailableNode?.attrs?.type
						if (
							unavailableType === 'bot_unavailable_fanout' ||
							unavailableType === 'hosted_unavailable_fanout' ||
							unavailableType === 'view_once_unavailable_fanout'
						) {
							logger.debug(
								{ msgId: msg.key.id, unavailableType },
								'skipping placeholder resend for excluded unavailable type'
							)
							acked = true
							return sendMessageAck(node)
						}

						const messageAge = unixTimestampSeconds() - toNumber(msg.messageTimestamp)
						if (messageAge > PLACEHOLDER_MAX_AGE_SECONDS) {
							logger.debug({ msgId: msg.key.id, messageAge }, 'skipping placeholder resend for old message')
							acked = true
							return sendMessageAck(node)
						}

						// Request the real content from the phone via placeholder resend PDO.
						// Upsert the CIPHERTEXT stub as a placeholder (like WA Web's processPlaceholderMsg),
						// and store the requestId in stubParameters[1] so users can correlate
						// with the incoming PDO response event.
						const cleanKey: proto.IMessageKey = {
							remoteJid: msg.key.remoteJid,
							fromMe: msg.key.fromMe,
							id: msg.key.id,
							participant: msg.key.participant
						}
						// Cache the original message metadata so the PDO response handler
						// can preserve key fields (LID details etc.) that the phone may omit
						const msgData: Partial<WAMessage> = {
							key: msg.key,
							messageTimestamp: msg.messageTimestamp,
							pushName: msg.pushName,
							participant: msg.participant,
							verifiedBizName: msg.verifiedBizName
						}
						requestPlaceholderResend(cleanKey, msgData)
							.then(requestId => {
								if (requestId && requestId !== 'RESOLVED') {
									logger.debug({ msgId: msg.key.id, requestId }, 'requested placeholder resend for unavailable message')
									ev.emit('messages.update', [
										{
											key: msg.key,
											update: { messageStubParameters: [NO_MESSAGE_FOUND_ERROR_TEXT, requestId] }
										}
									])
								}
							})
							.catch(err => {
								logger.warn({ err, msgId: msg.key.id }, 'failed to request placeholder resend for unavailable message')
							})
						acked = true
						await sendMessageAck(node)
						// Don't return — fall through to upsertMessage so the stub is emitted
					} else {
						// Skip retry for expired status messages (>24h old)
						if (isJidStatusBroadcast(msg.key.remoteJid!)) {
							const messageAge = unixTimestampSeconds() - toNumber(msg.messageTimestamp)
							if (messageAge > STATUS_EXPIRY_SECONDS) {
								logger.debug(
									{ msgId: msg.key.id, messageAge, remoteJid: msg.key.remoteJid },
									'skipping retry for expired status message'
								)
								acked = true
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
								await sendRetryRequest(node, !encNode)
								if (retryRequestDelayMs) {
									await delay(retryRequestDelayMs)
								}
							} catch (err) {
								logger.error({ err, isPreKeyError }, 'Failed to handle retry, attempting basic retry')
								// Still attempt retry even if pre-key upload failed
								try {
									const encNode = getBinaryNodeChild(node, 'enc')
									await sendRetryRequest(node, !encNode)
								} catch (retryErr) {
									logger.error({ retryErr }, 'Failed to send retry after error handling')
								}
							}

							acked = true
							await sendMessageAck(node, NACK_REASONS.UnhandledError)
						})
					}
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

						acked = true
						await sendReceipt(msg.key.remoteJid!, participant!, [msg.key.id!], type)

						// send ack for history message
						const isAnyHistoryMsg = getHistoryMsg(msg.message!)
						if (isAnyHistoryMsg) {
							const jid = jidNormalizedUser(msg.key.remoteJid!)
							await sendReceipt(jid, undefined, [msg.key.id!], 'hist_sync') // TODO: investigate
						}
					} else {
						acked = true
						await sendMessageAck(node)
						logger.debug({ key: msg.key }, 'processed newsletter message without receipts')
					}
				}

				cleanMessage(msg, authState.creds.me!.id, authState.creds.me!.lid!)

				await upsertMessage(msg, node.attrs.offline ? 'append' : 'notify')
			})
		} catch (error) {
			logger.error({ error, node: binaryNodeToString(node) }, 'error in handling message')
			if (!acked) {
				await sendMessageAck(node, NACK_REASONS.UnhandledError).catch(ackErr =>
					logger.error({ ackErr }, 'failed to ack message after error')
				)
			}
		}
	}

	/**
	 * Sanitize Brazilian landline phone numbers from caller_pn.
	 * WhatsApp decoder may append a trailing zero to 12-digit landlines,
	 * making them 13 digits. Mobile numbers (first digit 6-9) at 13 digits are correct.
	 */
	const sanitizeCallerPn = (pn: string | undefined): string | undefined => {
		if (!pn) return undefined
		if (!pn.startsWith('55')) return pn

		if (pn.length === 13) {
			const firstDigitAfterDDD = pn.charAt(4)
			// Landline (2-5): 13 digits is error → remove trailing zero
			if (['2', '3', '4', '5'].includes(firstDigitAfterDDD) && pn.endsWith('0')) {
				return pn.slice(0, -1)
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
			type: u.attrs.type
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
				call.callerPn = sanitizeCallerPn(infoChild.attrs['caller_pn'])

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

				const linkInfo = getBinaryNodeChild(infoChild, 'link_info')
				if (linkInfo) {
					call.linkCreator = linkInfo.attrs.link_creator
					call.linkCreatorPn = linkInfo.attrs.link_creator_pn
				}

				await callOfferCache.set(call.id, call)
			}

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

			if (status === 'reminder') {
				const groupInfo = getBinaryNodeChild(infoChild, 'group_info')
				if (groupInfo) {
					call.isGroup = true
					call.linkToken = groupInfo.attrs['link-token']
					call.media = groupInfo.attrs.media
				}
			}

			if (status === 'terminate') {
				call.terminateReason = infoChild.attrs.reason
				const callSummary = getBinaryNodeChild(infoChild, 'call_summary')
				if (callSummary) {
					call.media = callSummary.attrs.media
					call.duration = callSummary.attrs.call_duration ? Number(callSummary.attrs.call_duration) : undefined
					call.participants = extractParticipants(callSummary)
				}
			}

			if (status === 'accept' || status === 'preaccept') {
				call.isVideo = !!getBinaryNodeChild(infoChild, 'video')
			}

			const existingCall = await callOfferCache.get<WACallEvent>(call.id)
			if (existingCall) {
				call.isVideo = call.isVideo ?? existingCall.isVideo
				call.isGroup = call.isGroup ?? existingCall.isGroup
				call.groupJid = call.groupJid ?? existingCall.groupJid
				call.callerPn = call.callerPn || existingCall.callerPn
				call.linkToken = call.linkToken || existingCall.linkToken
				call.linkCreator = call.linkCreator || existingCall.linkCreator
				call.linkCreatorPn = call.linkCreatorPn || existingCall.linkCreatorPn
				call.media = call.media || existingCall.media
				call.connectedLimit = call.connectedLimit ?? existingCall.connectedLimit
			}

			if (status === 'reject' || status === 'accept' || status === 'timeout' || status === 'terminate') {
				await callOfferCache.del(call.id)
			}

			ev.emit('call', [call])
		}
		try {
			const { attrs } = node
			const [infoChild] = getAllBinaryNodeChildren(node)

			if (!infoChild) {
				throw new Boom('Missing call info in call node')
			}

			const status = getCallStatusFromNode(infoChild)

			const callId = infoChild.attrs['call-id']!
			const from = infoChild.attrs.from! || infoChild.attrs['call-creator']!

			const call: WACallEvent = {
				chatId: attrs.from!,
				from,
				callerPn: infoChild.attrs['caller_pn'],
				id: callId,
				date: new Date(+attrs.t! * 1000),
				offline: !!attrs.offline,
				status
			}

			if (status === 'offer') {
				call.isVideo = !!getBinaryNodeChild(infoChild, 'video')
				call.isGroup = infoChild.attrs.type === 'group' || !!infoChild.attrs['group-jid']
				call.groupJid = infoChild.attrs['group-jid']
				await callOfferCache.set(call.id, call)
			}

			const existingCall = await callOfferCache.get<WACallEvent>(call.id)

			// use existing call info to populate this event
			if (existingCall) {
				call.isVideo = existingCall.isVideo
				call.isGroup = existingCall.isGroup
				call.callerPn = call.callerPn || existingCall.callerPn
			}

			// delete data once call has ended
			if (status === 'reject' || status === 'accept' || status === 'timeout' || status === 'terminate') {
				await callOfferCache.del(call.id)
			}

			ev.emit('call', [call])
		} catch (error) {
			logger.error({ error, node: binaryNodeToString(node) }, 'error in handling call')
		} finally {
			await sendMessageAck(node).catch(ackErr => logger.error({ ackErr }, 'failed to ack call'))
		}
	}

	const handleBadAck = async ({ attrs }: BinaryNode) => {
		const key: WAMessageKey = { remoteJid: attrs.from, fromMe: true, id: attrs.id }

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
			logger.warn({ attrs }, 'received error in ack')
			ev.emit('messages.update', [
				{
					key,
					update: {
						status: WAMessageStatus.ERROR,
						messageStubParameters: [attrs.error]
					}
				}
			])

			// resend the message with device_fanout=false, use at your own risk
			// if (attrs.error === '475') {
			// 	const msg = await getMessage(key)
			// 	if (msg) {
			// 		await relayMessage(key.remoteJid!, msg, {
			// 			messageId: key.id!,
			// 			useUserDevicesCache: false,
			// 			additionalAttributes: {
			// 				device_fanout: 'false'
			// 			}
			// 		})
			// 	}
			// }
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

	const offlineNodeProcessor = makeOfflineNodeProcessor(
		new Map<MessageType, (node: BinaryNode) => Promise<void>>([
			['message', handleMessage],
			['call', handleCall],
			['receipt', handleReceipt],
			['notification', handleNotification]
		]),
		{
			isWsOpen: () => ws.isOpen,
			onUnexpectedError,
			yieldToEventLoop: () => new Promise(resolve => setImmediate(resolve))
		}
	)

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
		const callCreator = node.attrs['call-creator']
		if (callId && callCreator) {
			logger.debug({ callId, callCreator, uuid: node.attrs.uuid }, 'received relay info')
			ev.emit('call', [
				{
					chatId: callCreator,
					from: callCreator,
					id: callId,
					date: new Date(),
					offline: false,
					status: 'relay' as WACallUpdateType
				}
			])
		} else {
			logger.debug({ attrs: node.attrs }, 'received relay stanza without call-id/call-creator')
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

	ev.on('connection.update', ({ isOnline }) => {
		if (typeof isOnline !== 'undefined') {
			sendActiveReceipts = isOnline
			logger.trace(`sendActiveReceipts set to "${sendActiveReceipts}"`)
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
