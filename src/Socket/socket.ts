/* eslint-disable @typescript-eslint/no-floating-promises */
import { Boom } from '@hapi/boom'
import { randomBytes } from 'crypto'
import { URL } from 'url'
import { promisify } from 'util'
import { proto } from '../../WAProto/index.js'
import {
	DEF_CALLBACK_PREFIX,
	DEF_TAG_PREFIX,
	DEFAULT_SESSION_CLEANUP_CONFIG,
	INITIAL_PREKEY_COUNT,
	MIN_PREKEY_COUNT,
	MIN_UPLOAD_INTERVAL,
	NOISE_WA_HEADER,
	UPLOAD_TIMEOUT
} from '../Defaults'
import { makeSessionActivityTracker } from '../Signal/session-activity-tracker'
import { makeSessionCleanup } from '../Signal/session-cleanup'
import type { ConnectionState, LIDMapping, SocketConfig } from '../Types'
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
	decrementActiveConnections,
	incrementActiveConnections,
	recordConnectionAttempt,
	recordConnectionError
} from '../Utils/prometheus-metrics'
import {
	createUnifiedSessionManager,
	extractServerTime,
	shouldEnableUnifiedSession,
	type UnifiedSessionManager
} from '../Utils/unified-session'
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
	const enableUnifiedSession =
		enableUnifiedSessionConfig !== undefined ? enableUnifiedSessionConfig : shouldEnableUnifiedSession()

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

	// If clearRoutingInfoOnStart is enabled, discard the stored routing hint so WhatsApp
	// assigns a fresh edge server on this connection. This fixes sessions that became slow
	// after a pm2 restart because the previous edge server retained stale state.
	// Signal keys and auth credentials are NOT affected — no QR re-scan is needed.
	// hadStaleRoutingInfo is used below to skip the offline buffer on reconnect scenarios
	// (restart of an already-authenticated session) so live messages are not held hostage by the backlog buffer.
	let hadStaleRoutingInfo = false
	if (config.clearRoutingInfoOnStart && authState?.creds?.routingInfo) {
		logger.info('clearRoutingInfoOnStart: discarding stored routingInfo to force fresh edge server assignment')
		authState.creds.routingInfo = undefined
		hadStaleRoutingInfo = true
	}

	// Skip the offline-phase buffer for ANY restart of an existing session.
	// accountSyncCounter > 0 means at least one full sync has completed before — this is a
	// reconnect, not a first-time QR scan. This is a superset of hadStaleRoutingInfo:
	// it covers channels where WhatsApp never sends routingInfo, where routingInfo was already
	// cleared on a previous restart, or any other reconnect scenario.
	// ev.buffer() is called twice on connect (here and in chats.ts). chats.ts already flushes
	// immediately on reconnect (accountSyncCounter > 0), but if socket.ts also buffers, the
	// refcount stays at 1 and events are held for up to 5 s. Skipping this buffer on reconnects
	// lets the chats.ts flush drop the refcount to 0 and release messages immediately.
	const skipOfflineBuffer = hadStaleRoutingInfo || (authState?.creds?.accountSyncCounter ?? 0) > 0

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

		// Register the response listener BEFORE sending — avoids a race where the server
		// responds before we start listening.  waitForMessage already handles its own
		// timeout (returns undefined) and connection-close errors (throws), so we do NOT
		// wrap it in a second promiseTimeout.  The outer wrapper caused a race condition
		// where both timers fired at ~the same deadline: the outer one threw
		// Boom('Timed Out') while sendNode was still pending, producing a spurious error
		// whose message contained "socket-query" → matched the circuit-breaker's
		// "socket" pattern → incorrectly tripped the breaker after 5 timeouts.
		const responsePromise = waitForMessage<any>(msgId, timeoutMs)

		// Await the send so that real sendNode failures (e.g. serialisation errors)
		// are surfaced to the caller immediately rather than silently discarded.
		// Socket-close errors are also propagated by waitForMessage via ws.on('close').
		await sendNode(node)

		const result = await responsePromise

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

	// Persist the routingInfo clearing so the consumer's saveCreds() writes the clean state to disk.
	// This ensures that if the process restarts again before the server assigns new routingInfo,
	// the stale value is not reused.
	if (config.clearRoutingInfoOnStart && !authState?.creds?.routingInfo) {
		ev.emit('creds.update', authState.creds)
	}

	const { creds } = authState
	// add transaction capability
	const keys = addTransactionCapability(authState.keys, logger, transactionOpts)
	const signalRepository = makeSignalRepository({ creds, keys }, logger, pnFromLIDUSync)

	// Session activity tracker - tracks last activity for cleanup (must be created first)
	const sessionActivityTracker = makeSessionActivityTracker(keys, logger)

	// Session cleanup manager - removes inactive/orphaned sessions
	// Merge user config with defaults to prevent partial overrides from breaking cleanup
	const sessionCleanupConfig = {
		...DEFAULT_SESSION_CLEANUP_CONFIG,
		...(config.sessionCleanupConfig || {})
	}
	const sessionCleanup = makeSessionCleanup(
		keys,
		signalRepository.lidMapping,
		sessionActivityTracker,
		logger,
		sessionCleanupConfig
	)

	let lastDateRecv: Date
	let epoch = 1
	let keepAliveReq: NodeJS.Timeout
	let qrTimer: NodeJS.Timeout

	/**
	 * Connection closed flag - protected by atomic check-and-set in end()
	 *
	 * THREAD SAFETY: This flag uses atomic check-and-set pattern (see end() function)
	 * to prevent race conditions between:
	 * - Multiple simultaneous calls to end() (prevents double cleanup)
	 * - Operations checking flag while end() is destroying resources
	 *
	 * USAGE: Always check this flag BEFORE accessing socket resources (ws, keys, etc.)
	 * The flag is set IMMEDIATELY in end() before any async operations to minimize race window.
	 */
	let closed = false

	// Session TTL and cleanup
	const SESSION_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days
	let sessionStartTime: number | undefined
	let ttlTimer: NodeJS.Timeout | undefined
	let ttlGraceTimer: NodeJS.Timeout | undefined

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

		const keyEnc = noise.processHandshake(handshake, creds.noiseKey)

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
	 * Returns cleanup function to remove event listener
	 */
	const startPreKeyAutoSync = () => {
		const SYNC_INTERVAL = 6 * 60 * 60 * 1000 // 6 hours
		let syncTimer: NodeJS.Timeout | undefined
		let isRunning = false

		/**
		 * Cleanup flag - protected by atomic check-and-set in cleanup function
		 *
		 * THREAD SAFETY: This flag uses atomic check-and-set pattern (see cleanup return function)
		 * to prevent race conditions between:
		 * - syncLoop reschedule check (line 790) and cleanup setting flag to true
		 * - Multiple calls to cleanup function (reentrancy guard)
		 *
		 * CRITICAL: Prevents timer orphaning where syncLoop creates new timer
		 * after cleanup has cleared the existing timer, causing memory leak.
		 */
		let cleanedUp = false

		const syncLoop = async () => {
			// PROTECTION 1: Prevent overlapping runs
			if (isRunning) {
				logger.warn('🔑 PreKey sync already running, skipping this cycle')
				return
			}

			// PROTECTION 2: Check connection state AND cleanup flag
			// Safe to check these flags because:
			// - 'closed': Atomic check-and-set in end() (V7 fix)
			// - 'cleanedUp': Atomic check-and-set in cleanup() (V8 fix)
			// - If either is true, we return immediately (no resource access)
			// - If both are false, resources guaranteed available
			// - Race windows minimized by immediate flag setting after checks
			if (closed || !ws.isOpen || cleanedUp) {
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

				// PROTECTION 3: Prevent timer accumulation and post-cleanup rescheduling
				// Check flags inside finally to minimize race window
				// CRITICAL: Even with minimal race window, cleanup's atomic check-and-set
				// ensures cleanedUp=true BEFORE clearTimeout, so if we create a timer here
				// after cleanup check but before our check, cleanup will clear it.
				// If cleanup sets cleanedUp=true after our check, new timer won't be cleared,
				// but V8 fix ensures cleanedUp is set IMMEDIATELY, minimizing this window.
				if (!closed && !cleanedUp && ws.isOpen) {
					syncTimer = setTimeout(syncLoop, SYNC_INTERVAL)
				}
			}
		}

		// PROTECTION 4: Initial delay (avoid duplicate at startup)
		// CB:success already calls uploadPreKeysToServerIfRequired(), so wait 6h before first auto-sync
		const connectionHandler = (update: Partial<ConnectionState>) => {
			if (update.connection === 'open') {
				logger.info('🔑 Starting PreKey auto-sync timer (first sync in 6h)')
				syncTimer = setTimeout(syncLoop, SYNC_INTERVAL)
			} else if (update.connection === 'close') {
				// PROTECTION 5: Cleanup on disconnect
				if (syncTimer) {
					clearTimeout(syncTimer)
					syncTimer = undefined
					isRunning = false
					logger.info('🔑 PreKey auto-sync stopped')
				}
			}
		}

		ev.on('connection.update', connectionHandler)

		// PROTECTION 6: Return cleanup function with atomic check-and-set
		return () => {
			// PROTECTION: Atomic check-and-set to prevent race conditions
			// Flag is set IMMEDIATELY after check, BEFORE any operations
			// This prevents:
			// 1. Multiple calls to cleanup (reentrancy guard)
			// 2. Timer orphaning: syncLoop creating timer after clearTimeout
			if (cleanedUp) {
				return // Already cleaned up
			}

			cleanedUp = true // ← Set IMMEDIATELY to close race window

			ev.off('connection.update', connectionHandler)
			if (syncTimer) {
				clearTimeout(syncTimer)
				syncTimer = undefined
			}
		}
	}

	// Initialize PreKey auto-sync and store cleanup function
	const cleanupPreKeyAutoSync = startPreKeyAutoSync()

	/**
	 * Session TTL Management: Graceful cleanup after 7 days
	 * Prevents memory leaks and allows credential rotation in long-running sessions
	 * Returns cleanup function to remove event listener
	 */
	const startSessionTTL = () => {
		/**
		 * Cleanup flag - protected by atomic check-and-set in cleanup function
		 *
		 * THREAD SAFETY: This flag uses atomic check-and-set pattern to prevent
		 * race conditions between:
		 * - ttlTimer callback creating ttlGraceTimer after cleanup cleared timers
		 * - Multiple cleanup calls (connectionHandler + cleanup function)
		 *
		 * CRITICAL: Prevents timer orphaning where ttlTimer expires and creates
		 * ttlGraceTimer after cleanup has cleared ttlTimer, causing end() to be
		 * called after socket cleanup is complete.
		 */
		let cleanedUp = false

		const connectionHandler = (update: Partial<ConnectionState>) => {
			if (update.connection === 'open') {
				sessionStartTime = Date.now()

				// PROTECTION 1: Long TTL (7 days)
				ttlTimer = setTimeout(() => {
					// PROTECTION: Check cleanup flag to prevent orphan timer creation
					// If cleanup was called while ttlTimer was pending, abort immediately
					if (cleanedUp) {
						logger.debug('🕐 TTL timer fired but cleanup already called, aborting')
						return
					}

					if (!sessionStartTime) {
						logger.debug('TTL timer: sessionStartTime not set, skipping')
						return
					}

					const duration = Date.now() - sessionStartTime
					const durationHours = Math.floor(duration / 1000 / 60 / 60)

					logger.info(`🕐 Session TTL reached after ${durationHours}h, initiating graceful cleanup`)

					// PROTECTION 2: Event-based (app decides)
					ev.emit('session.ttl-expired', {
						startTime: sessionStartTime,
						duration: duration
					})

					// PROTECTION 3: Graceful delay before cleanup (with proper cleanup)
					// Check cleanup flag again before creating grace timer to prevent orphaning
					if (cleanedUp) {
						logger.debug('🕐 Cleanup called before grace timer creation, aborting')
						return
					}

					ttlGraceTimer = setTimeout(() => {
						// PROTECTION: Check cleanup flag before calling end()
						// Prevents calling end() after socket cleanup is complete
						if (cleanedUp) {
							logger.debug('🕐 Grace timer fired but cleanup already called, aborting')
							return
						}

						logger.info('🕐 Proceeding with TTL cleanup after grace period')
						end(new Error('SESSION_TTL_EXPIRED'))
					}, 5000) // 5s grace period
				}, SESSION_TTL)

				const ttlHours = SESSION_TTL / 1000 / 60 / 60
				logger.info(`🕐 Session TTL started (${ttlHours}h = 7 days)`)
			} else if (update.connection === 'close') {
				// PROTECTION 4: Cleanup ALL timers on disconnect
				// Safe to check cleanedUp here - if cleanup function already ran,
				// we return early to avoid redundant cleanup
				if (cleanedUp) {
					logger.debug('🕐 Session TTL already cleaned up via cleanup function')
					return
				}

				// Clear all timers - cleanedUp flag in callbacks prevents orphaning
				if (ttlTimer) {
					clearTimeout(ttlTimer)
					ttlTimer = undefined
				}

				if (ttlGraceTimer) {
					clearTimeout(ttlGraceTimer)
					ttlGraceTimer = undefined
				}

				sessionStartTime = undefined
				logger.info('🕐 Session TTL timers cleared on disconnect')
			}
		}

		ev.on('connection.update', connectionHandler)

		// PROTECTION 5: Return cleanup function with atomic check-and-set
		return () => {
			// PROTECTION: Atomic check-and-set to prevent race conditions
			// Flag is set IMMEDIATELY after check, BEFORE any operations
			// This prevents:
			// 1. Multiple cleanup calls (reentrancy guard)
			// 2. Timer callbacks from creating new timers or calling end()
			if (cleanedUp) {
				logger.debug('🕐 Session TTL cleanup already called')
				return
			}

			cleanedUp = true // ← Set IMMEDIATELY to close race window

			ev.off('connection.update', connectionHandler)
			if (ttlTimer) {
				clearTimeout(ttlTimer)
				ttlTimer = undefined
			}

			if (ttlGraceTimer) {
				clearTimeout(ttlGraceTimer)
				ttlGraceTimer = undefined
			}

			logger.debug('🕐 Session TTL cleanup function executed')
		}
	}

	// Initialize Session TTL and store cleanup function
	const cleanupSessionTTL = startSessionTTL()

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
		// PROTECTION: Atomic check-and-set to prevent race conditions
		// Flag is set IMMEDIATELY after check, BEFORE any async operations
		// This minimizes the race window and prevents:
		// 1. Multiple simultaneous calls to end() from destroying resources twice
		// 2. Operations checking 'closed' while resources are being destroyed
		if (closed) {
			logger.trace({ trace: error?.stack }, 'connection already closed')
			return
		}

		closed = true // ← Set IMMEDIATELY to close race window

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

		// Clear offline-buffer safety timer so its callback cannot call ev.flush()
		// on an already-closed socket (e.g. auth failure or early network drop before
		// CB:ib,,offline ever arrives).  Mirrors how awaitingSyncTimeout is cleared in
		// chats.ts on connection close.
		if (offlineBufferTimeout) {
			clearTimeout(offlineBufferTimeout)
			offlineBufferTimeout = undefined
		}

		didStartBuffer = false

		// Stop session cleanup scheduler
		sessionCleanup.stop()

		// Stop session activity tracker and flush pending data
		await sessionActivityTracker.stop()

		// Clean up unified session manager
		unifiedSessionManager?.destroy()

		// CRITICAL: Wait for pending pre-key upload before destroying transaction capability
		// This prevents destroying resources while they're in use
		if (uploadPreKeysPromise) {
			logger.debug('Waiting for pending pre-key upload to complete before cleanup')
			try {
				await Promise.race([
					uploadPreKeysPromise,
					new Promise<void>(resolve => setTimeout(resolve, 5000)) // 5s timeout
				])
				logger.debug('Pending pre-key upload completed or timed out')
			} catch (error) {
				logger.warn({ error }, 'Pending pre-key upload failed during cleanup')
			}
		}

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

		// Detect socket-level session errors that require recreation
		const statusCode = (error as Boom)?.output?.statusCode || 0
		const isSessionError = statusCode === DisconnectReason.badSession || statusCode === DisconnectReason.restartRequired

		if (isSessionError) {
			logger.warn(
				{ statusCode, reason: DisconnectReason[statusCode] },
				'🔴 Socket-level session error - consumer should recreate socket'
			)
		}

		// CRITICAL: Emit close event BEFORE cleaning up listeners
		// This allows handlers (PreKey auto-sync, Session TTL) to receive the final close event
		ev.emit('connection.update', {
			connection: 'close',
			lastDisconnect: {
				error,
				date: new Date()
			},
			isSessionError
		})

		// NOW clean up our internal listeners (after they've received the close event)
		cleanupPreKeyAutoSync()
		cleanupSessionTTL()

		// CRITICAL: Destroy circuit breakers AFTER cleanup functions complete
		// This ensures cleanup functions can still use circuit breakers if needed
		queryCircuitBreaker?.destroy()
		connectionCircuitBreaker?.destroy()
		preKeyCircuitBreaker?.destroy()

		// IMPORTANT: Do NOT use removeAllListeners('connection.update')
		// It would remove consumer listeners, breaking their reconnection logic
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
				// Send keep-alive ping via sendNode() (fire-and-forget) instead of query().
				// query() wraps the ping in the query circuit breaker — when that breaker is
				// open or timing out, the ping is never sent, WA never responds, lastDateRecv
				// goes stale, and the diff check above wrongly fires "Connection was lost".
				// sendNode() bypasses the query circuit breaker entirely; WA's ping response
				// still arrives as an incoming frame and updates lastDateRecv normally.
				sendNode({
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
		if (!authState.creds.pairingCode) {
			throw new Error('Pairing code not set')
		}

		const key = await derivePairingCodeKey(authState.creds.pairingCode, salt)
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
		logger.info('opened connection to WA')
		clearTimeout(qrTimer) // will never happen in all likelyhood -- but just in case WA sends success on first try

		ev.emit('creds.update', { me: { ...authState.creds.me!, lid: node.attrs.lid } })

		// Emit connection:open immediately so the application layer begins processing
		// incoming messages without waiting for any WA round-trips.
		ev.emit('connection.update', { connection: 'open' })

		// ─── Background: sendPassiveIq + pre-key validation + key-bundle digest ──
		// sendPassiveIq('active') tells the WA edge server to start routing live
		// messages to this connection. All three operations involve WA round-trips
		// (100–500 ms each) but none need to complete before the app can handle
		// messages. Run them in parallel, fire-and-forget, non-blocking.
		Promise.allSettled([sendPassiveIq('active'), uploadPreKeysToServerIfRequired(), digestKeyBundle()])
			.then(results => {
				const [passiveResult] = results
				if (passiveResult.status === 'rejected') {
					logger.warn({ err: passiveResult.reason }, 'failed to send initial passive iq')
				}
				for (const result of results.slice(1)) {
					if (result.status === 'rejected') {
						logger.warn({ err: result.reason }, 'background key operation failed after login (non-critical)')
					}
				}
			})
			.catch(err => {
				logger.error({ err }, 'unexpected error in background post-login handler')
			})

		// Record successful connection metrics
		recordConnectionAttempt('success')
		incrementActiveConnections()

		// Start session cleanup scheduler
		sessionCleanup.start()

		// Start session activity tracker
		sessionActivityTracker.start()

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
		const { reason, statusCode } = getErrorCodeFromStreamError(node)

		if (reason === 'device_removed') {
			logger.error({ node }, 'stream error: device removed — logging out')
		} else if (reason === 'xml-not-well-formed') {
			logger.warn({ node }, 'stream error: sent malformed stanza (xml-not-well-formed)')
		} else if (reason === 'ack') {
			logger.warn({ ackId: reasonNode?.attrs?.id, node }, 'stream error: ack-based error')
		} else {
			logger.error({ reason, statusCode, node }, 'stream errored out')
		}

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
	// perf(inbound-latency): safety timer that caps how long the offline-phase buffer may
	// block live message delivery. The server sends CB:ib,,offline only after transmitting
	// ALL queued offline messages; on busy accounts this can take 10-30+ seconds, holding
	// every buffered event hostage. This timer fires after OFFLINE_BUFFER_TIMEOUT_MS and
	// force-flushes so live messages are never delayed beyond that cap.
	// CB:ib,,offline clears the timer when it fires normally (fast path).
	//
	// INTENTIONALLY hardcoded — not controlled by BAILEYS_BUFFER_TIMEOUT_MS or any other
	// env var. BAILEYS_BUFFER_TIMEOUT_MS governs general-purpose buffer batching (for
	// Prometheus / history consolidation) and is typically set to 5-30 s by operators.
	// This constant must remain short regardless so that a large offline backlog cannot
	// hold live incoming messages hostage for minutes.
	// When clearRoutingInfoOnStart cleared a stale routingInfo, this is a restart of an
	// already-authenticated session (no QR re-scan needed). In this case we skip
	// the offline buffer entirely so live messages are not held hostage waiting for the
	// server to finish flushing the pending-message backlog (CB:ib,,offline).
	// For normal restarts (no stale routingInfo) the standard 5 s safety cap applies.
	const OFFLINE_BUFFER_TIMEOUT_MS = 5_000
	let offlineBufferTimeout: NodeJS.Timeout | undefined

	process.nextTick(() => {
		if (creds.me?.id && !skipOfflineBuffer) {
			// First-time QR connection: buffer events until CB:ib,,offline signals all
			// offline messages have been delivered, then flush everything at once.
			ev.buffer()
			didStartBuffer = true

			// Cap the offline-phase buffer so a large backlog of missed messages
			// does not delay delivery of the very next live message beyond OFFLINE_BUFFER_TIMEOUT_MS.
			offlineBufferTimeout = setTimeout(() => {
				offlineBufferTimeout = undefined
				if (didStartBuffer) {
					logger.warn(
						{ timeoutMs: OFFLINE_BUFFER_TIMEOUT_MS },
						'perf: offline-buffer safety timeout reached, force-flushing before CB:ib,,offline'
					)
					ev.flush()
					didStartBuffer = false
				}
			}, OFFLINE_BUFFER_TIMEOUT_MS)
		} else if (creds.me?.id && skipOfflineBuffer) {
			logger.info(
				'perf: skipping offline-phase buffer — reconnect of existing session, messages will be delivered immediately'
			)
		}

		ev.emit('connection.update', { connection: 'connecting', receivedPendingNotifications: false, qr: undefined })
	})

	// called when all offline notifs are handled
	ws.on('CB:ib,,offline', (node: BinaryNode) => {
		const child = getBinaryNodeChild(node, 'offline')
		const offlineNotifs = +(child?.attrs.count || 0)

		logger.info(`handled ${offlineNotifs} offline messages/notifications`)

		// Clear safety timeout — CB:ib,,offline arrived in time, do the normal flush.
		if (offlineBufferTimeout) {
			clearTimeout(offlineBufferTimeout)
			offlineBufferTimeout = undefined
		}

		if (didStartBuffer) {
			ev.flush()
			didStartBuffer = false
			logger.trace('flushed events for initial buffer')
		}

		ev.emit('connection.update', { receivedPendingNotifications: true })
	})

	// update credentials when required
	ev.on('creds.update', update => {
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
		sessionCleanup,
		sessionActivityTracker,
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
