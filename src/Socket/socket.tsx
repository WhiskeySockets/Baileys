import { Boom } from '@hapi/boom'
import WebSocket from 'ws'
import { proto } from '../../WAProto'
import { DEF_CALLBACK_PREFIX, DEF_TAG_PREFIX, DEFAULT_ORIGIN, INITIAL_PREKEY_COUNT, MIN_PREKEY_COUNT } from '../Defaults'
import { DisconnectReason, SocketConfig } from '../Types'
import { addTransactionCapability, bindWaitForConnectionUpdate, configureSuccessfulPairing, Curve, generateLoginNode, generateMdTagPrefix, generateRegistrationNode, getCodeFromWSError, getErrorCodeFromStreamError, getNextPreKeysNode, makeNoiseHandler, printQRIfNecessaryListener, promiseTimeout } from '../Utils'
import { makeEventBuffer } from '../Utils/event-buffer'
import logger from '../Utils/logger'
import { assertNodeErrorFree, BinaryNode, encodeBinaryNode, getBinaryNodeChild, getBinaryNodeChildren, S_WHATSAPP_NET } from '../WABinary'

export class Socket {
	ev = makeEventBuffer(logger)
	uqTagId = generateMdTagPrefix()
	epoch = 1
	ws: WebSocket
	/** ephemeral key pair used to encrypt/decrypt communication. Unique for each connection */
	ephemeralKeyPair = Curve.generateKeyPair()
	/** WA noise protocol wrapper */
	noise = makeNoiseHandler(this.ephemeralKeyPair, logger)
	authState = this.config.auth
	keys = addTransactionCapability(this.authState.keys, logger, this.config.transactionOpts)
	lastDateRecv: Date
	keepAliveReq: NodeJS.Timeout
	qrTimer: NodeJS.Timeout
	closed = false

	constructor(public config: SocketConfig) {
		this.ws = new WebSocket(config.waWebSocketUrl, undefined, {
			origin: DEFAULT_ORIGIN,
			headers: config.options.headers,
			handshakeTimeout: config.connectTimeoutMs,
			timeout: config.connectTimeoutMs,
			agent: config.agent,
		})
		this.ws.setMaxListeners(0)

		this.ws.on('message', this.onMessageRecieved)
		this.ws.on('open', async() => {
			try {
				await this.validateConnection()
			} catch(err) {
				logger.error({ err }, 'error in validating connection')
				this.end(err)
			}
		})
		this.ws.on('error', mapWebSocketError(this.end))
		this.ws.on('close', () => this.end(new Boom('Connection Terminated', { statusCode: DisconnectReason.connectionClosed })))
		// the server terminated the connection
		this.ws.on('CB:xmlstreamend', () => this.end(new Boom('Connection Terminated by Server', { statusCode: DisconnectReason.connectionClosed })))
		// QR gen
		this.ws.on('CB:iq,type:set,pair-device', async(stanza: BinaryNode) => {
			const iq: BinaryNode = <iq to={S_WHATSAPP_NET} type="result" id={stanza.attrs.id} />
			await this.sendNode(iq)

			const pairDeviceNode = getBinaryNodeChild(stanza, 'pair-device')
			const refNodes = getBinaryNodeChildren(pairDeviceNode, 'ref')
			const noiseKeyB64 = Buffer.from(this.authState.creds.noiseKey.public).toString('base64')
			const identityKeyB64 = Buffer.from(this.authState.creds.signedIdentityKey.public).toString('base64')
			const advB64 = this.authState.creds.advSecretKey

			let qrMs = this.config.qrTimeout || 60_000 // time to let a QR live
			const genPairQR = () => {
				if(this.ws.readyState !== this.ws.OPEN) {
					return
				}

				const refNode = refNodes.shift()
				if(!refNode) {
					this.end(new Boom('QR refs attempts ended', { statusCode: DisconnectReason.timedOut }))
					return
				}

				const ref = (refNode.content as Buffer).toString('utf-8')
				const qr = [ref, noiseKeyB64, identityKeyB64, advB64].join(',')

				this.ev.emit('connection.update', { qr })

				this.qrTimer = setTimeout(genPairQR, qrMs)
				qrMs = this.config.qrTimeout || 20_000 // shorter subsequent qrs
			}

			genPairQR()
		})
		// device paired for the first time
		// if device pairs successfully, the server asks to restart the connection
		this.ws.on('CB:iq,,pair-success', async(stanza: BinaryNode) => {
			logger.debug('pair success recv')
			try {
				const { reply, creds: updatedCreds } = configureSuccessfulPairing(stanza, this.authState.creds)

				logger.info(
					{ me: updatedCreds.me, platform: updatedCreds.platform },
					'pairing configured successfully, expect to restart the connection...'
				)

				this.ev.emit('creds.update', updatedCreds)
				this.ev.emit('connection.update', { isNewLogin: true, qr: undefined })

				await this.sendNode(reply)
			} catch(error) {
				logger.info({ trace: error.stack }, 'error in pairing')
				this.end(error)
			}
		})
		// login complete
		this.ws.on('CB:success', async() => {
			await this.uploadPreKeysToServerIfRequired()
			await this.sendPassiveIq('active')

			logger.info('opened connection to WA')
			clearTimeout(this.qrTimer) // will never happen in all likelyhood -- but just in case WA sends success on first try

			this.ev.emit('connection.update', { connection: 'open' })
		})

		this.ws.on('CB:stream:error', (node: BinaryNode) => {
			logger.error({ node }, 'stream errored out')
			const { reason, statusCode } = getErrorCodeFromStreamError(node)

			this.end(new Boom(`Stream Errored (${reason})`, { statusCode, data: node }))
		})
		// stream fail, possible logout
		this.ws.on('CB:failure', (node: BinaryNode) => {
			const reason = +(node.attrs.reason || 500)
			this.end(new Boom('Connection Failure', { statusCode: reason, data: node.attrs }))
		})

		this.ws.on('CB:ib,,downgrade_webclient', () => {
			this.end(new Boom('Multi-device beta not joined', { statusCode: DisconnectReason.multideviceMismatch }))
		})

		let didStartBuffer = false
		process.nextTick(() => {
			if(this.authState.creds.me?.id) {
				// start buffering important events
				// if we're logged in
				this.ev.buffer()
				didStartBuffer = true
			}

			this.ev.emit('connection.update', { connection: 'connecting', receivedPendingNotifications: false, qr: undefined })
		})

		// called when all offline notifs are handled
		this.ws.on('CB:ib,,offline', (node: BinaryNode) => {
			const child = getBinaryNodeChild(node, 'offline')
			const offlineNotifs = +(child?.attrs.count || 0)

			logger.info(`handled ${offlineNotifs} offline messages/notifications`)
			if(didStartBuffer) {
				this.ev.flush()
				logger.trace('flushed events for initial buffer')
			}

			this.ev.emit('connection.update', { receivedPendingNotifications: true })
		})

		// update credentials when required
		this.ev.on('creds.update', update => {
			const name = update.me?.name
			// if name has just been received
			if(this.authState.creds.me?.name !== name) {
				logger.debug({ name }, 'updated pushName')
				this.sendNode(<presence name={name} />)
					.catch(err => {
						logger.warn({ trace: err.stack }, 'error in sending presence update on name change')
					})
			}

			Object.assign(this.authState.creds, update)
		})

		if(this.config.printQRInTerminal) {
			printQRIfNecessaryListener(this.ev, logger)
		}
	}

	generateMessageTag = () => `${this.uqTagId}${this.epoch++}`

	sendPromise = (data:any) => {
		return new Promise((resolve, reject) => {
			this.ws.send(data, (err) => err ? reject(err) : resolve(undefined))
		})
	}

	sendRawMessage = async(data: Uint8Array | Buffer) => {
		if(this.ws.readyState !== this.ws.OPEN) {
			throw new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed })
		}

		const bytes = this.noise.encodeFrame(data)
        await this.sendPromise.call(this.ws, bytes) as Promise<void>
	}

	/** send a binary node */
	sendNode = (frame: BinaryNode) => {
		if(logger.level === 'trace') {
			logger.trace({ msgId: frame.attrs.id, fromMe: true, frame }, 'communication')
		}

		const buff = encodeBinaryNode(frame)
		return this.sendRawMessage(buff)
	}

	/** await the next incoming message */
	awaitNextMessage = async(sendMsg?: Uint8Array) => {
		if(this.ws.readyState !== this.ws.OPEN) {
			throw new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed })
		}

		let onOpen: (data: any) => void
		let onClose: (err: Error) => void

		const result = promiseTimeout<any>(this.config.connectTimeoutMs, (resolve, reject) => {
			onOpen = (data: any) => resolve(data)
			onClose = mapWebSocketError(reject)
			this.ws.on('frame', onOpen)
			this.ws.on('close', onClose)
			this.ws.on('error', onClose)
		})
			.finally(() => {
				this.ws.off('frame', onOpen)
				this.ws.off('close', onClose)
				this.ws.off('error', onClose)
			})

		if(sendMsg) {
			this.sendRawMessage(sendMsg).catch(onClose!)
		}

		return result
	}

	/**
     * Wait for a message with a certain tag to be received
     * @param tag the message tag to await
     * @param json query that was sent
     * @param timeoutMs timeout after which the promise will reject
     */
	waitForMessage = async(msgId: string, timeoutMs = this.config.defaultQueryTimeoutMs) => {
		let onRecv: (json) => void
		let onErr: (err) => void
		try {
			const result = await promiseTimeout(timeoutMs,
				(resolve, reject) => {
					onRecv = resolve
					onErr = err => {
						reject(err || new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed }))
					}

					this.ws.on(`TAG:${msgId}`, onRecv)
					this.ws.on('close', onErr) // if the socket closes, you'll never receive the message
					this.ws.off('error', onErr)
				},
			)
			return result as any
		} finally {
			this.ws.off(`TAG:${msgId}`, onRecv!)
			this.ws.off('close', onErr!) // if the socket closes, you'll never receive the message
			this.ws.off('error', onErr!)
		}
	}

	/** send a query, and wait for its response. auto-generates message ID if not provided */
	query = async(node: BinaryNode, timeoutMs?: number) => {
		if(!node.attrs.id) {
			node.attrs.id = this.generateMessageTag()
		}

		const msgId = node.attrs.id
		const wait = this.waitForMessage(msgId, timeoutMs)

		await this.sendNode(node)

		const result = await (wait as Promise<BinaryNode>)
		if('tag' in result) {
			assertNodeErrorFree(result)
		}

		return result
	}

	/** log & process any unexpected errors */
	onUnexpectedError = (error: Error, msg: string) => {
		logger.error(
			{ trace: error.stack, output: (error as any).output },
			`unexpected error in '${msg}'`
		)
	}

	/** connection handshake */
	validateConnection = async() => {
		const { auth: { creds }, browser, version, syncFullHistory } = this.config

		let helloMsg: proto.IHandshakeMessage = {
			clientHello: { ephemeral: this.ephemeralKeyPair.public }
		}
		helloMsg = proto.HandshakeMessage.fromObject(helloMsg)

		logger.info({ browser: this.config.browser, helloMsg }, 'connected to WA Web')

		const init = proto.HandshakeMessage.encode(helloMsg).finish()

		const result = await this.awaitNextMessage(init)
		const handshake = proto.HandshakeMessage.decode(result)

		logger.trace({ handshake }, 'handshake recv from WA Web')

		const keyEnc = this.noise.processHandshake(handshake, this.authState.creds.noiseKey)

		const config = { version, browser, syncFullHistory }

		let node: proto.IClientPayload
		if(!creds.me) {
			node = generateRegistrationNode(creds, config)
			logger.info({ node }, 'not logged in, attempting registration...')
		} else {
			node = generateLoginNode(creds.me!.id, config)
			logger.info({ node }, 'logging in...')
		}

		const payloadEnc = this.noise.encrypt(
			proto.ClientPayload.encode(node).finish()
		)
		await this.sendRawMessage(
			proto.HandshakeMessage.encode({
				clientFinish: {
					static: keyEnc,
					payload: payloadEnc,
				},
			}).finish()
		)
		this.noise.finishInit()
		this.startKeepAliveRequest()
	}

	getAvailablePreKeysOnServer = async() => {
		const result = await this.query(
			<iq xmlns='encrypt' type='get' to={S_WHATSAPP_NET}>
				<count />
			</iq>
		)
		const countChild = getBinaryNodeChild(result, 'count')
		return +countChild!.attrs.value
	}

	/** generates and uploads a set of pre-keys to the server */
	uploadPreKeys = async(count = INITIAL_PREKEY_COUNT) => {
		await this.keys.transaction(
			async() => {
				logger.info({ count }, 'uploading pre-keys')
				const { update, node } = await getNextPreKeysNode({ creds: this.authState.creds, keys: this.keys }, count)

				await this.query(node)
				this.ev.emit('creds.update', update)

				logger.info({ count }, 'uploaded pre-keys')
			}
		)
	}

	uploadPreKeysToServerIfRequired = async() => {
		const preKeyCount = await this.getAvailablePreKeysOnServer()
		logger.info(`${preKeyCount} pre-keys found on server`)
		if(preKeyCount <= MIN_PREKEY_COUNT) {
			await this.uploadPreKeys()
		}
	}

	onMessageRecieved = (data: Buffer) => {
		this.noise.decodeFrame(data, frame => {
			// reset ping timeout
			this.lastDateRecv = new Date()

			let anyTriggered = false

			anyTriggered = this.ws.emit('frame', frame)
			// if it's a binary node
			if(!(frame instanceof Uint8Array)) {
				const msgId = frame.attrs.id

				if(logger.level === 'trace') {
					logger.trace({ msgId, fromMe: false, frame }, 'communication')
				}

				/* Check if this is a response to a message we sent */
				anyTriggered = this.ws.emit(`${DEF_TAG_PREFIX}${msgId}`, frame) || anyTriggered
				/* Check if this is a response to a message we are expecting */
				const l0 = frame.tag
				const l1 = frame.attrs || { }
				const l2 = Array.isArray(frame.content) ? frame.content[0]?.tag : ''

				Object.keys(l1).forEach(key => {
					anyTriggered = this.ws.emit(`${DEF_CALLBACK_PREFIX}${l0},${key}:${l1[key]},${l2}`, frame) || anyTriggered
					anyTriggered = this.ws.emit(`${DEF_CALLBACK_PREFIX}${l0},${key}:${l1[key]}`, frame) || anyTriggered
					anyTriggered = this.ws.emit(`${DEF_CALLBACK_PREFIX}${l0},${key}`, frame) || anyTriggered
				})
				anyTriggered = this.ws.emit(`${DEF_CALLBACK_PREFIX}${l0},,${l2}`, frame) || anyTriggered
				anyTriggered = this.ws.emit(`${DEF_CALLBACK_PREFIX}${l0}`, frame) || anyTriggered

				if(!anyTriggered && logger.level === 'debug') {
					logger.debug({ unhandled: true, msgId, fromMe: false, frame }, 'communication recv')
				}
			}
		})
	}

	end = (error: Error | undefined) => {
		if(this.closed) {
			logger.trace({ trace: error?.stack }, 'connection already closed')
			return
		}

		this.closed = true
		logger.info(
			{ trace: error?.stack },
			error ? 'connection errored' : 'connection closed'
		)

		clearInterval(this.keepAliveReq)
		clearTimeout(this.qrTimer)

		this.ws.removeAllListeners('close')
		this.ws.removeAllListeners('error')
		this.ws.removeAllListeners('open')
		this.ws.removeAllListeners('message')

		if(this.ws.readyState !== this.ws.CLOSED && this.ws.readyState !== this.ws.CLOSING) {
			try {
				this.ws.close()
			} catch{ }
		}

		this.ev.emit('connection.update', {
			connection: 'close',
			lastDisconnect: {
				error,
				date: new Date()
			}
		})
		this.ev.removeAllListeners('connection.update')
	}

	waitForSocketOpen = async() => {
		if(this.ws.readyState === this.ws.OPEN) {
			return
		}

		if(this.ws.readyState === this.ws.CLOSED || this.ws.readyState === this.ws.CLOSING) {
			throw new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed })
		}

		let onOpen: () => void
		let onClose: (err: Error) => void
		await new Promise((resolve, reject) => {
			onOpen = () => resolve(undefined)
			onClose = mapWebSocketError(reject)
			this.ws.on('open', onOpen)
			this.ws.on('close', onClose)
			this.ws.on('error', onClose)
		})
			.finally(() => {
				this.ws.off('open', onOpen)
				this.ws.off('close', onClose)
				this.ws.off('error', onClose)
			})
	}

	startKeepAliveRequest = () => (
		this.keepAliveReq = setInterval(() => {
			if(!this.lastDateRecv) {
				this.lastDateRecv = new Date()
			}

			const diff = Date.now() - this.lastDateRecv.getTime()
			/*
                check if it's been a suspicious amount of time since the server responded with our last seen
                it could be that the network is down
            */
			if(diff > this.config.keepAliveIntervalMs + 5000) {
				this.end(new Boom('Connection was lost', { statusCode: DisconnectReason.connectionLost }))
			} else if(this.ws.readyState === this.ws.OPEN) {
				// if its all good, send a keep alive request
				this.query(
					<iq to={S_WHATSAPP_NET} type="get" xmlns='w:p'>
						<ping />
					</iq>
				).catch(err => {
					logger.error({ trace: err.stack }, 'error in sending keep alive')
				})
			} else {
				logger.warn('keep alive called when WS not open')
			}
		}, this.config.keepAliveIntervalMs)
	)
	/** i have no idea why this exists. pls enlighten me */
	sendPassiveIq = (tag: 'passive' | 'active') => (
		this.query(
			<iq to={S_WHATSAPP_NET} xmlns='passive' type='set' >
				{JSX.createElement(tag, { })}
			</iq>
		)
	)

	/** logout & invalidate connection */
	logout = async(msg?: string) => {
		const jid = this.authState.creds.me?.id
		if(jid) {
			await this.sendNode(
				<iq to={S_WHATSAPP_NET} type='set' xmlns='md' id={this.generateMessageTag()}>
					<remove-companion-device jid={jid} reason='user_initiated' />
				</iq>
			)
		}

		this.end(new Boom(msg || 'Intentional Logout', { statusCode: DisconnectReason.loggedOut }))
	}

	waitForConnectionUpdate = bindWaitForConnectionUpdate(this.ev)

	get user() {
		return this.authState.creds.me
	}

	type = 'md' as 'md'
}

/**
 * map the websocket error to the right type
 * so it can be retried by the caller
 * */
function mapWebSocketError(handler: (err: Error) => void) {
	return (error: Error) => {
		handler(
			new Boom(
				`WebSocket Error (${error.message})`,
				{ statusCode: getCodeFromWSError(error), data: error }
			)
		)
	}
}
