import { Boom } from '@hapi/boom'
import { randomBytes } from 'crypto'
import { URL } from 'url'
import { promisify } from 'util'
import { proto } from '../../WAProto/index.js'
import {
	DEF_CALLBACK_PREFIX,
	DEF_TAG_PREFIX,
	INITIAL_PREKEY_COUNT,
	MIN_PREKEY_COUNT,
	MIN_UPLOAD_INTERVAL,
	NOISE_WA_HEADER,
	UPLOAD_TIMEOUT
} from '../Defaults'
import type { LIDMapping, SocketConfig } from '../Types'
import { DisconnectReason } from '../Types'
import {
	addTransactionCapability,
	aesEncryptCTR,
	bindWaitForConnectionUpdate,
	bytesToCrockford,
	configureSuccessfulPairing,
	Curve,
	derivePairingCodeKey,
	generateLoginNode,
	generateMdTagPrefix,
	generateRegistrationNode,
	getCodeFromWSError,
	getErrorCodeFromStreamError,
	getNextPreKeysNode,
	makeEventBuffer,
	makeNoiseHandler,
	promiseTimeout,
	signedKeyPair,
	xmppSignedPreKey
} from '../Utils'
import { getPlatformId } from '../Utils/browser-utils'
import {
	CircuitBreaker,
	CircuitOpenError,
	createConnectionCircuitBreaker,
	createPreKeyCircuitBreaker
} from '../Utils/circuit-breaker'
import {
	assertNodeErrorFree,
	type BinaryNode,
	binaryNodeToString,
	encodeBinaryNode,
	getAllBinaryNodeChildren,
	getBinaryNodeChild,
	getBinaryNodeChildren,
	isLidUser,
	jidDecode,
	jidEncode,
	S_WHATSAPP_NET
} from '../WABinary'
import {
	recordConnectionError,
	recordConnectionAttempt,
	incrementActiveConnections,
	decrementActiveConnections
} from '../Utils/prometheus-metrics'
import {
	createUnifiedSessionManager,
	extractServerTime,
	shouldEnableUnifiedSession,
	type UnifiedSessionManager
} from '../Utils/unified-session'
import { BinaryInfo } from '../WAM/BinaryInfo.js'
import { USyncQuery, USyncUser } from '../WAUSync/'
import { WebSocketClient } from './Client'

/**
 * Connects to WA servers and performs:
 * - simple queries (no retry mechanism, wait for connection establishment)
 * - listen to messages and emit events
 * - query phone connection
 */

export const makeSocket = (config: SocketConfig) => {
	const {
		waWebSocketUrl,
		connectTimeoutMs,
		logger,
		keepAliveIntervalMs,
		browser,
		auth: authState,
		printQRInTerminal,
		defaultQueryTimeoutMs,
		transactionOpts,
		qrTimeout,
		makeSignalRepository,
		enableCircuitBreaker = true,
		queryCircuitBreaker: queryCircuitBreakerConfig,
		connectionCircuitBreaker: connectionCircuitBreakerConfig,
		preKeyCircuitBreaker: preKeyCircuitBreakerConfig,
		// If enableUnifiedSession is explicitly set (true/false), use it
		// Otherwise (undefined), check env var, then default to true
		enableUnifiedSession: enableUnifiedSessionConfig
	} = config

	// Resolve enableUnifiedSession: explicit config > env var > default (true)
	const enableUnifiedSession = enableUnifiedSessionConfig !== undefined
		? enableUnifiedSessionConfig
		: shouldEnableUnifiedSession()

	// Initialize circuit breakers if enabled
	let queryCircuitBreaker: CircuitBreaker | undefined
	let connectionCircuitBreaker: CircuitBreaker | undefined
	let preKeyCircuitBreaker: CircuitBreaker | undefined

	if (enableCircuitBreaker) {
		// Circuit breaker for query operations (most critical)
		queryCircuitBreaker = createConnectionCircuitBreaker({
			name: 'socket-query',
			failureThreshold: 5,
			failureWindow: 60000,
			resetTimeout: 30000,
			successThreshold: 2,
			timeout: defaultQueryTimeoutMs || 60000,
			onStateChange: (from, to) => {
				logger.info({ from, to }, 'Query circuit breaker state changed')
			},
			onOpen: () => {
				logger.warn('Query circuit breaker OPENED - blocking requests')
			},
			onClose: () => {
				logger.info('Query circuit breaker CLOSED - resuming normal operation')
			},
			...queryCircuitBreakerConfig
		})

		// Circuit breaker for connection operations
		connectionCircuitBreaker = createConnectionCircuitBreaker({
			name: 'socket-connection',
			failureThreshold: 3,
			failureWindow: 30000,
			resetTimeout: 60000,
			successThreshold: 1,
			onStateChange: (from, to) => {
				logger.info({ from, to }, 'Connection circuit breaker state changed')
			},
			...connectionCircuitBreakerConfig
		})

		// Circuit breaker for pre-key operations
		preKeyCircuitBreaker = createPreKeyCircuitBreaker({
			name: 'socket-prekey',
			onStateChange: (from, to) => {
				logger.info({ from, to }, 'PreKey circuit breaker state changed')
			},
			...preKeyCircuitBreakerConfig
		})

		logger.info('Circuit breakers initialized for socket operations')
	}

	// Unified Session Manager will be initialized after sendNode is defined
	let unifiedSessionManager: UnifiedSessionManager | undefined

	const publicWAMBuffer = new BinaryInfo()

	const uqTagId = generateMdTagPrefix()
	const generateMessageTag = () => `${uqTagId}${epoch++}`

	if (printQRInTerminal) {
		console.warn(
			'⚠️ The printQRInTerminal option has been deprecated. You will no longer receive QR codes in the terminal automatically. Please listen to the connection.update event yourself and handle the QR your way. You can remove this message by removing this opttion. This message will be removed in a future version.'
		)
	}

	const url = typeof waWebSocketUrl === 'string' ? new URL(waWebSocketUrl) : waWebSocketUrl

	if (config.mobile || url.protocol === 'tcp:') {
		throw new Boom('Mobile API is not supported anymore', { statusCode: DisconnectReason.loggedOut })
	}

	if (url.protocol === 'wss' && authState?.creds?.routingInfo) {
		url.searchParams.append('ED', authState.creds.routingInfo.toString('base64url'))
	}

	/** ephemeral key pair used to encrypt/decrypt communication. Unique for each connection */
	const ephemeralKeyPair = Curve.generateKeyPair()
	/** WA noise protocol wrapper */
	const noise = makeNoiseHandler({
		keyPair: ephemeralKeyPair,
		NOISE_HEADER: NOISE_WA_HEADER,
		logger,
		routingInfo: authState?.creds?.routingInfo
	})

	const ws = new WebSocketClient(url, config)

	ws.connect()

	const sendPromise = promisify(ws.send)
	/** send a raw buffer (internal implementation) */
	const sendRawMessageInternal = async (data: Uint8Array | Buffer) => {
		if (!ws.isOpen) {
			throw new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed })
		}

		const bytes = noise.encodeFrame(data)
		await promiseTimeout<void>(connectTimeoutMs, async (resolve, reject) => {
			try {
				await sendPromise.call(ws, bytes)
				resolve()
			} catch (error) {
				reject(error)
			}
		})
	}

	/** send a raw buffer with circuit breaker protection */
	const sendRawMessage = async (data: Uint8Array | Buffer) => {
		if (connectionCircuitBreaker) {
			try {
				return await connectionCircuitBreaker.execute(() => sendRawMessageInternal(data))
			} catch (error) {
				if (error instanceof CircuitOpenError) {
					logger.warn({ circuitName: error.circuitName }, 'Send blocked by connection circuit breaker')
				}
				throw error
			}
		}

		return sendRawMessageInternal(data)
	}

	/** send a binary node */
	const sendNode = (frame: BinaryNode) => {
		if (logger.level === 'trace') {
			logger.trace({ xml: binaryNodeToString(frame), msg: 'xml send' })
		}

		const buff = encodeBinaryNode(frame)
		return sendRawMessage(buff)
	}

	// Initialize Unified Session Manager now that sendNode is defined
	// (single initialization to avoid duplicating circuit breakers and state)
	if (enableUnifiedSession) {
		const sendNodeForSession = async (node: BinaryNode): Promise<void> => {
			await sendNode(node)
		}
		unifiedSessionManager = createUnifiedSessionManager({
			enabled: true,
			logger,
			enableCircuitBreaker,
			sendNode: sendNodeForSession
		})
		logger.info('Unified session manager initialized')
	}

	/** Send unified_session telemetry */
	const sendUnifiedSession = async (trigger: 'login' | 'pairing' | 'presence' | 'manual' = 'manual'): Promise<void> => {
		if (unifiedSessionManager) {
			await unifiedSessionManager.send(trigger)
		}
	}

	/**
	 * Wait for a message with a certain tag to be received
	 * @param msgId the message tag to await
	 * @param timeoutMs timeout after which the promise will reject
	 */
	const waitForMessage = async <T>(msgId: string, timeoutMs = defaultQueryTimeoutMs) => {
		let onRecv: ((data: T) => void) | undefined
		let onErr: ((err: Error) => void) | undefined
		try {
			const result = await promiseTimeout<T>(timeoutMs, (resolve, reject) => {
				onRecv = data => {
					resolve(data)
				}

				onErr = err => {
					reject(
						err ||
							new Boom('Connection Closed', {
								statusCode: DisconnectReason.connectionClosed
							})
					)
				}

				ws.on(`TAG:${msgId}`, onRecv)
				ws.on('close', onErr)
				ws.on('error', onErr)

				return () => reject(new Boom('Query Cancelled'))
			})
			return result
		} catch (error) {
			// Catch timeout and return undefined instead of throwing
			if (error instanceof Boom && error.output?.statusCode === DisconnectReason.timedOut) {
				logger?.warn?.({ msgId }, 'timed out waiting for message')
				return undefined
			}

			throw error
		} finally {
			if (onRecv) ws.off(`TAG:${msgId}`, onRecv)
			if (onErr) {
				ws.off('close', onErr)
				ws.off('error', onErr)
			}
		}
	}

	/** send a query, and wait for its response. auto-generates message ID if not provided */
	const queryInternal = async (node: BinaryNode, timeoutMs?: number) => {
		if (!node.attrs.id) {
			node.attrs.id = generateMessageTag()
		}

		const msgId = node.attrs.id

		const result = await promiseTimeout<any>(timeoutMs, async (resolve, reject) => {
			const result = waitForMessage(msgId, timeoutMs).catch(reject)
			sendNode(node)
				.then(async () => resolve(await result))
				.catch(reject)
		})

		if (result && 'tag' in result) {
			assertNodeErrorFree(result)
		}

		return result
	}

	/** send a query with circuit breaker protection */
	const query = async (node: BinaryNode, timeoutMs?: number) => {
		// If circuit breaker is enabled, wrap the query
		if (queryCircuitBreaker) {
			try {
				return await queryCircuitBreaker.execute(() => queryInternal(node, timeoutMs))
			} catch (error) {
				// If circuit is open, log and rethrow with context
				if (error instanceof CircuitOpenError) {
					logger.warn({ circuitName: error.circuitName, state: error.state }, 'Query blocked by circuit breaker')
				}
				throw error
			}
		}

		// Fallback to direct query if circuit breaker is disabled
		return queryInternal(node, timeoutMs)
	}

	// Validate current key-bundle on server; on failure, trigger pre-key upload and rethrow
	const digestKeyBundle = async (): Promise<void> => {
		const res = await query({
			tag: 'iq',
			attrs: { to: S_WHATSAPP_NET, type: 'get', xmlns: 'encrypt' },
			content: [{ tag: 'digest', attrs: {} }]
		})
		const digestNode = getBinaryNodeChild(res, 'digest')
		if (!digestNode) {
			await uploadPreKeys()
			throw new Error('encrypt/get digest returned no digest node')
		}
	}

	// Rotate our signed pre-key on server; on failure, run digest as fallback and rethrow
	const rotateSignedPreKey = async (): Promise<void> => {
		const newId = (creds.signedPreKey.keyId || 0) + 1
		const skey = await signedKeyPair(creds.signedIdentityKey, newId)
		await query({
			tag: 'iq',
			attrs: { to: S_WHATSAPP_NET, type: 'set', xmlns: 'encrypt' },
			content: [
				{
					tag: 'rotate',
					attrs: {},
					content: [xmppSignedPreKey(skey)]
				}
			]
		})
		// Persist new signed pre-key in creds
		ev.emit('creds.update', { signedPreKey: skey })
	}

	const executeUSyncQuery = async (usyncQuery: USyncQuery) => {
		if (usyncQuery.protocols.length === 0) {
			throw new Boom('USyncQuery must have at least one protocol')
		}

		// todo: validate users, throw WARNING on no valid users
		// variable below has only validated users
		const validUsers = usyncQuery.users

		const userNodes = validUsers.map(user => {
			return {
				tag: 'user',
				attrs: {
					jid: !user.phone ? user.id : undefined
				},
				content: usyncQuery.protocols.map(a => a.getUserElement(user)).filter(a => a !== null)
			} as BinaryNode
		})

		const listNode: BinaryNode = {
			tag: 'list',
			attrs: {},
			content: userNodes
		}

		const queryNode: BinaryNode = {
			tag: 'query',
			attrs: {},
			content: usyncQuery.protocols.map(a => a.getQueryElement())
		}
		const iq = {
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'get',
				xmlns: 'usync'
			},
			content: [
				{
					tag: 'usync',
					attrs: {
						context: usyncQuery.context,
						mode: usyncQuery.mode,
						sid: generateMessageTag(),
						last: 'true',
						index: '0'
					},
					content: [queryNode, listNode]
				}
			]
		}

		const result = await query(iq)

		return usyncQuery.parseUSyncQueryResult(result)
	}

	const onWhatsApp = async (...phoneNumber: string[]) => {
		let usyncQuery = new USyncQuery()

		let contactEnabled = false
		for (const jid of phoneNumber) {
			if (isLidUser(jid)) {
				logger?.warn('LIDs are not supported with onWhatsApp')
				continue
			} else {
				if (!contactEnabled) {
					contactEnabled = true
					usyncQuery = usyncQuery.withContactProtocol()
				}

				const phone = `+${jid.replace('+', '').split('@')[0]?.split(':')[0]}`
				usyncQuery.withUser(new USyncUser().withPhone(phone))
			}
		}

		if (usyncQuery.users.length === 0) {
			return [] // return early without forcing an empty query
		}

		const results = await executeUSyncQuery(usyncQuery)

		if (results) {
			return results.list.filter(a => !!a.contact).map(({ contact, id }) => ({ jid: id, exists: contact as boolean }))
		}
	}

	const pnFromLIDUSync = async (jids: string[]): Promise<LIDMapping[] | undefined> => {
		const usyncQuery = new USyncQuery().withLIDProtocol().withContext('background')

		for (const jid of jids) {
			if (isLidUser(jid)) {
				logger?.warn('LID user found in LID fetch call')
				continue
			} else {
				usyncQuery.withUser(new USyncUser().withId(jid))
			}
		}

		if (usyncQuery.users.length === 0) {
			return [] // return early without forcing an empty query
		}

		const results = await executeUSyncQuery(usyncQuery)

		if (results) {
			return results.list.filter(a => !!a.lid).map(({ lid, id }) => ({ pn: id, lid: lid as string }))
		}

		return []
	}

	const ev = makeEventBuffer(logger)

	const { creds } = authState
	// add transaction capability
	const keys = addTransactionCapability(authState.keys, logger, transactionOpts)
	const signalRepository = makeSignalRepository({ creds, keys }, logger, pnFromLIDUSync)

	let lastDateRecv: Date
	let epoch = 1
	let keepAliveReq: NodeJS.Timeout
	let qrTimer: NodeJS.Timeout
	let closed = false

	// Auto-reconnect state for session errors
	const MAX_RECONNECT_ATTEMPTS = 5
	let reconnectAttempts = 0

	/** log & process any unexpected errors */
	const onUnexpectedError = (err: Error | Boom, msg: string) => {
		logger.error({ err }, `unexpected error in '${msg}'`)
	}

	/** await the next incoming message */
	const awaitNextMessage = async <T>(sendMsg?: Uint8Array) => {
		if (!ws.isOpen) {
			throw new Boom('Connection Closed', {
				statusCode: DisconnectReason.connectionClosed
			})
		}

		let onOpen: (data: T) => void
		let onClose: (err: Error) => void

		const result = promiseTimeout<T>(connectTimeoutMs, (resolve, reject) => {
			onOpen = resolve
			onClose = mapWebSocketError(reject)
			ws.on('frame', onOpen)
			ws.on('close', onClose)
			ws.on('error', onClose)
		}).finally(() => {
			ws.off('frame', onOpen)
			ws.off('close', onClose)
			ws.off('error', onClose)
		})

		if (sendMsg) {
			sendRawMessage(sendMsg).catch(onClose!)
		}

		return result
	}

	/** connection handshake */
	const validateConnection = async () => {
		let helloMsg: proto.IHandshakeMessage = {
			clientHello: { ephemeral: ephemeralKeyPair.public }
		}
		helloMsg = proto.HandshakeMessage.fromObject(helloMsg)

		logger.info({ browser, helloMsg }, 'connected to WA')

		const init = proto.HandshakeMessage.encode(helloMsg).finish()

		const result = await awaitNextMessage<Uint8Array>(init)
		const handshake = proto.HandshakeMessage.decode(result)

		logger.trace({ handshake }, 'handshake recv from WA')

		const keyEnc = await noise.processHandshake(handshake, creds.noiseKey)

		let node: proto.IClientPayload
		if (!creds.me) {
			node = generateRegistrationNode(creds, config)
			logger.info({ node }, 'not logged in, attempting registration...')
		} else {
			node = generateLoginNode(creds.me.id, config)
			logger.info({ node }, 'logging in...')
		}

		const payloadEnc = noise.encrypt(proto.ClientPayload.encode(node).finish())
		await sendRawMessage(
			proto.HandshakeMessage.encode({
				clientFinish: {
					static: keyEnc,
					payload: payloadEnc
				}
			}).finish()
		)
		await noise.finishInit()
		startKeepAliveRequest()
	}

	const getAvailablePreKeysOnServer = async () => {
		const result = await query({
			tag: 'iq',
			attrs: {
				id: generateMessageTag(),
				xmlns: 'encrypt',
				type: 'get',
				to: S_WHATSAPP_NET
			},
			content: [{ tag: 'count', attrs: {} }]
		})
		const countChild = getBinaryNodeChild(result, 'count')!
		return +countChild.attrs.value!
	}

	// Pre-key upload state management
	let uploadPreKeysPromise: Promise<void> | null = null
	let lastUploadTime = 0

	/** generates and uploads a set of pre-keys to the server */
	const uploadPreKeys = async (count = MIN_PREKEY_COUNT, retryCount = 0) => {
		// Check if pre-key circuit breaker is open
		if (preKeyCircuitBreaker?.isOpen()) {
			logger.warn('PreKey circuit breaker is open, skipping upload')
			throw new CircuitOpenError('socket-prekey', 'open')
		}

		// Check minimum interval (except for retries)
		if (retryCount === 0) {
			const timeSinceLastUpload = Date.now() - lastUploadTime
			if (timeSinceLastUpload < MIN_UPLOAD_INTERVAL) {
				logger.debug(`Skipping upload, only ${timeSinceLastUpload}ms since last upload`)
				return
			}
		}

		// Prevent multiple concurrent uploads
		if (uploadPreKeysPromise) {
			logger.debug('Pre-key upload already in progress, waiting for completion')
			await uploadPreKeysPromise
		}

		const uploadLogic = async () => {
			logger.info({ count, retryCount }, 'uploading pre-keys')

			// Generate and save pre-keys atomically (prevents ID collisions on retry)
			const node = await keys.transaction(async () => {
				logger.debug({ requestedCount: count }, 'generating pre-keys with requested count')
				const { update, node } = await getNextPreKeysNode({ creds, keys }, count)
				// Update credentials immediately to prevent duplicate IDs on retry
				ev.emit('creds.update', update)
				return node // Only return node since update is already used
			}, creds?.me?.id || 'upload-pre-keys')

			// Upload to server with circuit breaker protection
			const uploadToServer = async () => {
				await query(node)
				logger.info({ count }, 'uploaded pre-keys successfully')
				lastUploadTime = Date.now()
			}

			try {
				// Use circuit breaker if available
				if (preKeyCircuitBreaker) {
					await preKeyCircuitBreaker.execute(uploadToServer)
				} else {
					await uploadToServer()
				}
			} catch (uploadError) {
				logger.error({ uploadError: (uploadError as Error).toString(), count }, 'Failed to upload pre-keys to server')

				// Don't retry if circuit breaker is open
				if (uploadError instanceof CircuitOpenError) {
					throw uploadError
				}

				// Exponential backoff retry (max 3 retries)
				if (retryCount < 3) {
					const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000)
					logger.info(`Retrying pre-key upload in ${backoffDelay}ms`)
					await new Promise(resolve => setTimeout(resolve, backoffDelay))
					return uploadPreKeys(count, retryCount + 1)
				}

				throw uploadError
			}
		}

		// Add timeout protection
		uploadPreKeysPromise = Promise.race([
			uploadLogic(),
			new Promise<void>((_, reject) =>
				setTimeout(() => reject(new Boom('Pre-key upload timeout', { statusCode: 408 })), UPLOAD_TIMEOUT)
			)
		])

		try {
			await uploadPreKeysPromise
		} finally {
			uploadPreKeysPromise = null
		}
	}

	const verifyCurrentPreKeyExists = async () => {
		const currentPreKeyId = creds.nextPreKeyId - 1
		if (currentPreKeyId <= 0) {
			return { exists: false, currentPreKeyId: 0 }
		}

		const preKeys = await keys.get('pre-key', [currentPreKeyId.toString()])
		const exists = !!preKeys[currentPreKeyId.toString()]

		return { exists, currentPreKeyId }
	}

	const uploadPreKeysToServerIfRequired = async () => {
		try {
			let count = 0
			const preKeyCount = await getAvailablePreKeysOnServer()
			if (preKeyCount === 0) count = INITIAL_PREKEY_COUNT
			else count = MIN_PREKEY_COUNT
			const { exists: currentPreKeyExists, currentPreKeyId } = await verifyCurrentPreKeyExists()

			logger.info(`${preKeyCount} pre-keys found on server`)
			logger.info(`Current prekey ID: ${currentPreKeyId}, exists in storage: ${currentPreKeyExists}`)

			const lowServerCount = preKeyCount <= count
			const missingCurrentPreKey = !currentPreKeyExists && currentPreKeyId > 0

			const shouldUpload = lowServerCount || missingCurrentPreKey

			if (shouldUpload) {
				const reasons = []
				if (lowServerCount) reasons.push(`server count low (${preKeyCount})`)
				if (missingCurrentPreKey) reasons.push(`current prekey ${currentPreKeyId} missing from storage`)

				logger.info(`Uploading PreKeys due to: ${reasons.join(', ')}`)
				await uploadPreKeys(count)
			} else {
				logger.info(`PreKey validation passed - Server: ${preKeyCount}, Current prekey ${currentPreKeyId} exists`)
			}
		} catch (error) {
			logger.error({ error }, 'Failed to check/upload pre-keys during initialization')
			// Don't throw - allow connection to continue even if pre-key check fails
		}
	}

	/**
	 * PreKey Auto-Sync: Proactive validation every 6 hours
	 * Prevents "Identity key field not found" errors by ensuring keys are always valid
	 */
	const startPreKeyAutoSync = () => {
		const SYNC_INTERVAL = 6 * 60 * 60 * 1000 // 6 hours
		let syncTimer: NodeJS.Timeout | undefined
		let isRunning = false

		const syncLoop = async () => {
			// PROTECTION 1: Prevent overlapping runs
			if (isRunning) {
				logger.warn('🔑 PreKey sync already running, skipping this cycle')
				return
			}

			// PROTECTION 2: Check connection state
			if (closed || !ws.isOpen) {
				logger.debug('🔑 Connection closed, stopping PreKey sync')
				return
			}

			isRunning = true
			try {
				logger.info('🔑 PreKey auto-sync started (6h interval)')
				await uploadPreKeysToServerIfRequired()
				logger.info('🔑 PreKey auto-sync completed successfully')
			} catch (error) {
				logger.error({ error }, '🔑 PreKey auto-sync failed')
			} finally {
				isRunning = false
			}

			// PROTECTION 5: Reschedule AFTER completion (not from start)
			syncTimer = setTimeout(syncLoop, SYNC_INTERVAL)
		}

		// PROTECTION 6: Initial delay (avoid duplicate at startup)
		// CB:success already calls uploadPreKeysToServerIfRequired(), so wait 6h before first auto-sync
		ev.on('connection.update', ({ connection }) => {
			if (connection === 'open') {
				logger.info('🔑 Starting PreKey auto-sync timer (first sync in 6h)')
				syncTimer = setTimeout(syncLoop, SYNC_INTERVAL)
			} else if (connection === 'close') {
				// PROTECTION 7: Cleanup on disconnect
				if (syncTimer) {
					clearTimeout(syncTimer)
					syncTimer = undefined
					isRunning = false
					logger.info('🔑 PreKey auto-sync stopped')
				}
			}
		})
	}

	// Initialize PreKey auto-sync
	startPreKeyAutoSync()

	const onMessageReceived = async (data: Buffer) => {
		await noise.decodeFrame(data, frame => {
			// reset ping timeout
			lastDateRecv = new Date()

			let anyTriggered = false

			anyTriggered = ws.emit('frame', frame)
			// if it's a binary node
			if (!(frame instanceof Uint8Array)) {
				const msgId = frame.attrs.id

				// Update server time offset from any node with timestamp 't'
				// This keeps the offset accurate even after long connections
				const serverTime = extractServerTime(frame)
				if (serverTime) {
					unifiedSessionManager?.updateServerTimeOffset(serverTime)
				}

				if (logger.level === 'trace') {
					logger.trace({ xml: binaryNodeToString(frame), msg: 'recv xml' })
				}

				/* Check if this is a response to a message we sent */
				anyTriggered = ws.emit(`${DEF_TAG_PREFIX}${msgId}`, frame) || anyTriggered
				/* Check if this is a response to a message we are expecting */
				const l0 = frame.tag
				const l1 = frame.attrs || {}
				const l2 = Array.isArray(frame.content) ? frame.content[0]?.tag : ''

				for (const key of Object.keys(l1)) {
					anyTriggered = ws.emit(`${DEF_CALLBACK_PREFIX}${l0},${key}:${l1[key]},${l2}`, frame) || anyTriggered
					anyTriggered = ws.emit(`${DEF_CALLBACK_PREFIX}${l0},${key}:${l1[key]}`, frame) || anyTriggered
					anyTriggered = ws.emit(`${DEF_CALLBACK_PREFIX}${l0},${key}`, frame) || anyTriggered
				}

				anyTriggered = ws.emit(`${DEF_CALLBACK_PREFIX}${l0},,${l2}`, frame) || anyTriggered
				anyTriggered = ws.emit(`${DEF_CALLBACK_PREFIX}${l0}`, frame) || anyTriggered

				if (!anyTriggered && logger.level === 'debug') {
					logger.debug({ unhandled: true, msgId, fromMe: false, frame }, 'communication recv')
				}
			}
		})
	}

	const end = async (error: Error | undefined) => {
		if (closed) {
			logger.trace({ trace: error?.stack }, 'connection already closed')
			return
		}

		closed = true
		logger.info({ trace: error?.stack }, error ? 'connection errored' : 'connection closed')

		// Record connection error metric
		if (error) {
			const statusCode = (error as Boom)?.output?.statusCode || 0
			let errorType = 'unknown'
			switch (statusCode) {
				case DisconnectReason.connectionClosed:
					errorType = 'connection_closed'
					break
				case DisconnectReason.connectionLost:
					errorType = 'connection_lost'
					break
				case DisconnectReason.connectionReplaced:
					errorType = 'connection_replaced'
					break
				case DisconnectReason.timedOut:
					errorType = 'timed_out'
					break
				case DisconnectReason.loggedOut:
					errorType = 'logged_out'
					break
				case DisconnectReason.badSession:
					errorType = 'bad_session'
					break
				case DisconnectReason.restartRequired:
					errorType = 'restart_required'
					break
				case DisconnectReason.multideviceMismatch:
					errorType = 'multidevice_mismatch'
					break
				default:
					errorType = `error_${statusCode}`
			}
			recordConnectionError(errorType)
			recordConnectionAttempt('failure')
		}

		// Decrement active connections
		decrementActiveConnections()

		clearInterval(keepAliveReq)
		clearTimeout(qrTimer)

		// Clean up circuit breakers
		queryCircuitBreaker?.destroy()
		connectionCircuitBreaker?.destroy()
		preKeyCircuitBreaker?.destroy()

		// Clean up unified session manager
		unifiedSessionManager?.destroy()

		// Clean up transaction capability (PreKeyManager + queues)
		keys.destroy?.()

		ws.removeAllListeners('close')
		ws.removeAllListeners('open')
		ws.removeAllListeners('message')

		if (!ws.isClosed && !ws.isClosing) {
			try {
				await ws.close()
			} catch {}
		}

		ev.emit('connection.update', {
			connection: 'close',
			lastDisconnect: {
				error,
				date: new Date()
			}
		})
		ev.removeAllListeners('connection.update')
	}

	const waitForSocketOpen = async () => {
		if (ws.isOpen) {
			return
		}

		if (ws.isClosed || ws.isClosing) {
			throw new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed })
		}

		let onOpen: () => void
		let onClose: (err: Error) => void
		await new Promise((resolve, reject) => {
			onOpen = () => resolve(undefined)
			onClose = mapWebSocketError(reject)
			ws.on('open', onOpen)
			ws.on('close', onClose)
			ws.on('error', onClose)
		}).finally(() => {
			ws.off('open', onOpen)
			ws.off('close', onClose)
			ws.off('error', onClose)
		})
	}

	const startKeepAliveRequest = () =>
		(keepAliveReq = setInterval(() => {
			if (!lastDateRecv) {
				lastDateRecv = new Date()
			}

			const diff = Date.now() - lastDateRecv.getTime()
			/*
				check if it's been a suspicious amount of time since the server responded with our last seen
				it could be that the network is down
			*/
			if (diff > keepAliveIntervalMs + 5000) {
				void end(new Boom('Connection was lost', { statusCode: DisconnectReason.connectionLost }))
			} else if (ws.isOpen) {
				// if its all good, send a keep alive request
				query({
					tag: 'iq',
					attrs: {
						id: generateMessageTag(),
						to: S_WHATSAPP_NET,
						type: 'get',
						xmlns: 'w:p'
					},
					content: [{ tag: 'ping', attrs: {} }]
				}).catch(err => {
					logger.error({ trace: err.stack }, 'error in sending keep alive')
				})
			} else {
				logger.warn('keep alive called when WS not open')
			}
		}, keepAliveIntervalMs))
	/** i have no idea why this exists. pls enlighten me */
	const sendPassiveIq = (tag: 'passive' | 'active') =>
		query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				xmlns: 'passive',
				type: 'set'
			},
			content: [{ tag, attrs: {} }]
		})

	/** logout & invalidate connection */
	const logout = async (msg?: string) => {
		const jid = authState.creds.me?.id
		if (jid) {
			await sendNode({
				tag: 'iq',
				attrs: {
					to: S_WHATSAPP_NET,
					type: 'set',
					id: generateMessageTag(),
					xmlns: 'md'
				},
				content: [
					{
						tag: 'remove-companion-device',
						attrs: {
							jid,
							reason: 'user_initiated'
						}
					}
				]
			})
		}

		void end(new Boom(msg || 'Intentional Logout', { statusCode: DisconnectReason.loggedOut }))
	}

	const requestPairingCode = async (phoneNumber: string, customPairingCode?: string): Promise<string> => {
		const pairingCode = customPairingCode ?? bytesToCrockford(randomBytes(5))

		if (customPairingCode && customPairingCode?.length !== 8) {
			throw new Error('Custom pairing code must be exactly 8 chars')
		}

		authState.creds.pairingCode = pairingCode

		authState.creds.me = {
			id: jidEncode(phoneNumber, 's.whatsapp.net'),
			name: '~'
		}
		ev.emit('creds.update', authState.creds)
		await sendNode({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'set',
				id: generateMessageTag(),
				xmlns: 'md'
			},
			content: [
				{
					tag: 'link_code_companion_reg',
					attrs: {
						jid: authState.creds.me.id,
						stage: 'companion_hello',

						should_show_push_notification: 'true'
					},
					content: [
						{
							tag: 'link_code_pairing_wrapped_companion_ephemeral_pub',
							attrs: {},
							content: await generatePairingKey()
						},
						{
							tag: 'companion_server_auth_key_pub',
							attrs: {},
							content: authState.creds.noiseKey.public
						},
						{
							tag: 'companion_platform_id',
							attrs: {},
							content: getPlatformId(browser[1])
						},
						{
							tag: 'companion_platform_display',
							attrs: {},
							content: `${browser[1]} (${browser[0]})`
						},
						{
							tag: 'link_code_pairing_nonce',
							attrs: {},
							content: '0'
						}
					]
				}
			]
		})
		return authState.creds.pairingCode
	}

	async function generatePairingKey() {
		const salt = randomBytes(32)
		const randomIv = randomBytes(16)
		const key = await derivePairingCodeKey(authState.creds.pairingCode!, salt)
		const ciphered = aesEncryptCTR(authState.creds.pairingEphemeralKeyPair.public, key, randomIv)
		return Buffer.concat([salt, randomIv, ciphered])
	}

	const sendWAMBuffer = (wamBuffer: Buffer) => {
		return query({
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				id: generateMessageTag(),
				xmlns: 'w:stats'
			},
			content: [
				{
					tag: 'add',
					attrs: { t: Math.round(Date.now() / 1000) + '' },
					content: wamBuffer
				}
			]
		})
	}

	ws.on('message', onMessageReceived)

	ws.on('open', async () => {
		try {
			await validateConnection()
		} catch (err: any) {
			logger.error({ err }, 'error in validating connection')
			void end(err)
		}
	})
	ws.on('error', mapWebSocketError(end))
	ws.on('close', () => void end(new Boom('Connection Terminated', { statusCode: DisconnectReason.connectionClosed })))
	// the server terminated the connection
	ws.on(
		'CB:xmlstreamend',
		() => void end(new Boom('Connection Terminated by Server', { statusCode: DisconnectReason.connectionClosed }))
	)
	// QR gen
	ws.on('CB:iq,type:set,pair-device', async (stanza: BinaryNode) => {
		const iq: BinaryNode = {
			tag: 'iq',
			attrs: {
				to: S_WHATSAPP_NET,
				type: 'result',
				id: stanza.attrs.id!
			}
		}
		await sendNode(iq)

		const pairDeviceNode = getBinaryNodeChild(stanza, 'pair-device')
		const refNodes = getBinaryNodeChildren(pairDeviceNode, 'ref')
		const noiseKeyB64 = Buffer.from(creds.noiseKey.public).toString('base64')
		const identityKeyB64 = Buffer.from(creds.signedIdentityKey.public).toString('base64')
		const advB64 = creds.advSecretKey

		let qrMs = qrTimeout || 60_000 // time to let a QR live
		const genPairQR = () => {
			if (!ws.isOpen) {
				return
			}

			const refNode = refNodes.shift()
			if (!refNode) {
				void end(new Boom('QR refs attempts ended', { statusCode: DisconnectReason.timedOut }))
				return
			}

			const ref = (refNode.content as Buffer).toString('utf-8')
			const qr = [ref, noiseKeyB64, identityKeyB64, advB64].join(',')

			ev.emit('connection.update', { qr })

			qrTimer = setTimeout(genPairQR, qrMs)
			qrMs = qrTimeout || 20_000 // shorter subsequent qrs
		}

		genPairQR()
	})
	// device paired for the first time
	// if device pairs successfully, the server asks to restart the connection
	ws.on('CB:iq,,pair-success', async (stanza: BinaryNode) => {
		logger.debug('pair success recv')
		try {
			const { reply, creds: updatedCreds } = configureSuccessfulPairing(stanza, creds)

			logger.info(
				{ me: updatedCreds.me, platform: updatedCreds.platform },
				'pairing configured successfully, expect to restart the connection...'
			)

			ev.emit('creds.update', updatedCreds)
			ev.emit('connection.update', { isNewLogin: true, qr: undefined })

			await sendNode(reply)

			// Send unified_session telemetry on successful pairing
			sendUnifiedSession('pairing').catch(err => {
				logger.debug({ err }, 'Failed to send unified_session on pairing')
			})
		} catch (error: any) {
			logger.info({ trace: error.stack }, 'error in pairing')
			void end(error)
		}
	})
	// login complete
	ws.on('CB:success', async (node: BinaryNode) => {
		try {
			await uploadPreKeysToServerIfRequired()
			await sendPassiveIq('active')

			// After successful login, validate our key-bundle against server
			try {
				await digestKeyBundle()
			} catch (e) {
				logger.warn({ e }, 'failed to run digest after login')
			}
		} catch (err) {
			logger.warn({ err }, 'failed to send initial passive iq')
		}

		logger.info('opened connection to WA')
		clearTimeout(qrTimer) // will never happen in all likelyhood -- but just in case WA sends success on first try

		ev.emit('creds.update', { me: { ...authState.creds.me!, lid: node.attrs.lid } })

		ev.emit('connection.update', { connection: 'open' })

		// Record successful connection metrics
		recordConnectionAttempt('success')
		incrementActiveConnections()

		// Update server time offset from success node
		const serverTime = extractServerTime(node)
		if (serverTime) {
			unifiedSessionManager?.updateServerTimeOffset(serverTime)
		}

		// Send unified_session telemetry on successful login
		sendUnifiedSession('login').catch(err => {
			logger.debug({ err }, 'Failed to send unified_session on login')
		})

		if (node.attrs.lid && authState.creds.me?.id) {
			const myLID = node.attrs.lid
			process.nextTick(async () => {
				try {
					const myPN = authState.creds.me!.id

					// Store our own LID-PN mapping
					await signalRepository.lidMapping.storeLIDPNMappings([{ lid: myLID, pn: myPN }])

					// Create device list for our own user (needed for bulk migration)
					const { user, device } = jidDecode(myPN)!
					await authState.keys.set({
						'device-list': {
							[user]: [device?.toString() || '0']
						}
					})

					// migrate our own session
					await signalRepository.migrateSession(myPN, myLID)

					logger.info({ myPN, myLID }, 'Own LID session created successfully')
				} catch (error) {
					logger.error({ error, lid: myLID }, 'Failed to create own LID session')
				}
			})
		}
	})

	ws.on('CB:stream:error', (node: BinaryNode) => {
		const [reasonNode] = getAllBinaryNodeChildren(node)
		logger.error({ reasonNode, fullErrorNode: node }, 'stream errored out')

		const { reason, statusCode } = getErrorCodeFromStreamError(node)

		void end(new Boom(`Stream Errored (${reason})`, { statusCode, data: reasonNode || node }))
	})
	// stream fail, possible logout
	ws.on('CB:failure', (node: BinaryNode) => {
		const reason = +(node.attrs.reason || 500)
		void end(new Boom('Connection Failure', { statusCode: reason, data: node.attrs }))
	})

	ws.on('CB:ib,,downgrade_webclient', () => {
		void end(new Boom('Multi-device beta not joined', { statusCode: DisconnectReason.multideviceMismatch }))
	})

	ws.on('CB:ib,,offline_preview', async (node: BinaryNode) => {
		logger.info('offline preview received', JSON.stringify(node))
		await sendNode({
			tag: 'ib',
			attrs: {},
			content: [{ tag: 'offline_batch', attrs: { count: '100' } }]
		})
	})

	ws.on('CB:ib,,edge_routing', (node: BinaryNode) => {
		const edgeRoutingNode = getBinaryNodeChild(node, 'edge_routing')
		const routingInfo = getBinaryNodeChild(edgeRoutingNode, 'routing_info')
		if (routingInfo?.content) {
			authState.creds.routingInfo = Buffer.from(routingInfo?.content as Uint8Array)
			ev.emit('creds.update', authState.creds)
		}
	})

	let didStartBuffer = false
	process.nextTick(() => {
		if (creds.me?.id) {
			// start buffering important events
			// if we're logged in
			ev.buffer()
			didStartBuffer = true
		}

		ev.emit('connection.update', { connection: 'connecting', receivedPendingNotifications: false, qr: undefined })
	})

	// called when all offline notifs are handled
	ws.on('CB:ib,,offline', (node: BinaryNode) => {
		const child = getBinaryNodeChild(node, 'offline')
		const offlineNotifs = +(child?.attrs.count || 0)

		logger.info(`handled ${offlineNotifs} offline messages/notifications`)
		if (didStartBuffer) {
			ev.flush()
			logger.trace('flushed events for initial buffer')
		}

		ev.emit('connection.update', { receivedPendingNotifications: true })
	})

	// update credentials when required
	ev.on('creds.update', async update => {
		// CRITICAL: Handle session errors with auto-reconnect
		if (update.error) {
			logger.error({ error: update.error }, '🔴 Session error detected - initiating auto-reconnect')

			// PROTECTION 1: Max attempts guard
			if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
				logger.error(`❌ Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached, giving up`)
				ev.emit('connection.update', {
					connection: 'close',
					lastDisconnect: {
						error: update.error,
						date: new Date()
					}
				})
				return
			}

			reconnectAttempts++
			logger.info(`🔄 Reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`)

			// PROTECTION 4: Cleanup before reconnect
			await end(update.error)

			// PROTECTION 2: Exponential backoff
			const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 30000)
			logger.info(`⏳ Waiting ${delay}ms before reconnect (exponential backoff)`)
			await new Promise(resolve => setTimeout(resolve, delay))

			// Attempt reconnect
			logger.info(`🔄 Reconnecting now (attempt ${reconnectAttempts})`)
			await connect()

			// PROTECTION 3: Reset counter on success
			ev.once('connection.update', ({ connection }) => {
				if (connection === 'open') {
					logger.info(`✅ Reconnect successful, resetting attempt counter`)
					reconnectAttempts = 0
				}
			})

			return
		}

		const name = update.me?.name
		// if name has just been received
		if (creds.me?.name !== name) {
			logger.debug({ name }, 'updated pushName')
			sendNode({
				tag: 'presence',
				attrs: { name: name! }
			}).catch(err => {
				logger.warn({ trace: err.stack }, 'error in sending presence update on name change')
			})
		}

		Object.assign(creds, update)
	})

	return {
		type: 'md' as 'md',
		ws,
		ev,
		authState: { creds, keys },
		signalRepository,
		get user() {
			return authState.creds.me
		},
		generateMessageTag,
		query,
		waitForMessage,
		waitForSocketOpen,
		sendRawMessage,
		sendNode,
		logout,
		end,
		onUnexpectedError,
		uploadPreKeys,
		uploadPreKeysToServerIfRequired,
		digestKeyBundle,
		rotateSignedPreKey,
		requestPairingCode,
		wamBuffer: publicWAMBuffer,
		/** Waits for the connection to WA to reach a state */
		waitForConnectionUpdate: bindWaitForConnectionUpdate(ev),
		sendWAMBuffer,
		executeUSyncQuery,
		onWhatsApp,
		// Circuit breaker utilities
		circuitBreakers: {
			query: queryCircuitBreaker,
			connection: connectionCircuitBreaker,
			preKey: preKeyCircuitBreaker
		},
		/** Get circuit breaker statistics */
		getCircuitBreakerStats: () => ({
			query: queryCircuitBreaker?.getStats(),
			connection: connectionCircuitBreaker?.getStats(),
			preKey: preKeyCircuitBreaker?.getStats()
		}),
		/** Reset all circuit breakers to closed state */
		resetCircuitBreakers: () => {
			queryCircuitBreaker?.reset()
			connectionCircuitBreaker?.reset()
			preKeyCircuitBreaker?.reset()
			logger.info('All circuit breakers reset to closed state')
		},
		// Unified Session Telemetry
		/** Send unified_session telemetry manually */
		sendUnifiedSession,
		/** Get unified session manager state (for debugging) */
		getUnifiedSessionState: () => unifiedSessionManager?.getState(),
		/** Update server time offset (call when receiving server timestamps) */
		updateServerTimeOffset: (serverTime: string | number) => {
			unifiedSessionManager?.updateServerTimeOffset(serverTime)
		}
	}
}

/**
 * map the websocket error to the right type
 * so it can be retried by the caller
 * */
function mapWebSocketError(handler: (err: Error) => void) {
	return (error: Error) => {
		handler(new Boom(`WebSocket Error (${error?.message})`, { statusCode: getCodeFromWSError(error), data: error }))
	}
}
