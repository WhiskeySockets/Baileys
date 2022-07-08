import { Boom } from '@hapi/boom'
import EventEmitter from 'events'
import { ConnectionState, CurveKeyPair, DisconnectReason, LegacyBaileysEventEmitter, LegacySocketConfig, WAInitResponse } from '../Types'
import { bindWaitForConnectionUpdate, computeChallengeResponse, Curve, newLegacyAuthCreds, printQRIfNecessaryListener, validateNewConnection } from '../Utils'
import { makeSocket } from './socket'

const makeAuthSocket = (config: LegacySocketConfig) => {
	const {
		logger,
		version,
		browser,
		connectTimeoutMs,
		printQRInTerminal,
		auth: initialAuthInfo
	} = config
	const ev = new EventEmitter() as LegacyBaileysEventEmitter

	const authInfo = initialAuthInfo || newLegacyAuthCreds()

	const state: ConnectionState = {
		legacy: {
			phoneConnected: false,
		},
		connection: 'connecting',
	}

	const socket = makeSocket(config)
	const { ws } = socket
	let curveKeys: CurveKeyPair
	let initTimeout: NodeJS.Timeout | undefined

	ws.on('phone-connection', ({ value: phoneConnected }) => {
		updateState({ legacy: { ...state.legacy, phoneConnected } })
	})
	// add close listener
	ws.on('ws-close', (error: Boom | Error) => {
		logger.info({ error }, 'closed connection to WhatsApp')
		initTimeout && clearTimeout(initTimeout)
		// if no reconnects occur
		// send close event
		updateState({
			connection: 'close',
			qr: undefined,
			lastDisconnect: {
				error,
				date: new Date()
			}
		})
	})
	/** Can you login to WA without scanning the QR */
	const canLogin = () => !!authInfo?.encKey && !!authInfo?.macKey

	const updateState = (update: Partial<ConnectionState>) => {
		Object.assign(state, update)
		ev.emit('connection.update', update)
	}

	/**
	 * Logs you out from WA
	 * If connected, invalidates the credentials with the server
	 */
	const logout = async() => {
		if(state.connection === 'open') {
			await socket.sendNode({
				json: ['admin', 'Conn', 'disconnect'],
				tag: 'goodbye'
			})
		}

		// will call state update to close connection
		socket?.end(
			new Boom('Logged Out', { statusCode: DisconnectReason.loggedOut })
		)
	}

	const updateEncKeys = () => {
		// update the keys so we can decrypt traffic
		socket.updateKeys({ encKey: authInfo!.encKey, macKey: authInfo!.macKey })
	}

	const generateKeysForAuth = async(ref: string, ttl?: number) => {
		curveKeys = Curve.generateKeyPair()
		const publicKey = Buffer.from(curveKeys.public).toString('base64')
		let qrGens = 0

		const qrLoop = ttl => {
			const qr = [ref, publicKey, authInfo.clientID].join(',')
			updateState({ qr })

			initTimeout = setTimeout(async() => {
				if(state.connection !== 'connecting') {
					return
				}

				logger.debug('regenerating QR')
				try {
					// request new QR
					const { ref: newRef, ttl: newTTL } = await socket.query({
						json: ['admin', 'Conn', 'reref'],
						expect200: true,
						longTag: true,
						requiresPhoneConnection: false
					})
					ttl = newTTL
					ref = newRef
				} catch(error) {
					logger.error({ error }, 'error in QR gen')
					if(error.output?.statusCode === 429) { // too many QR requests
						socket.end(error)
						return
					}
				}

				qrGens += 1
				qrLoop(ttl)
			}, ttl || 20_000) // default is 20s, on the off-chance ttl is not present
		}

		qrLoop(ttl)
	}

	const onOpen = async() => {
		const canDoLogin = canLogin()
		const initQuery = (async() => {
			const { ref, ttl } = await socket.query({
				json: ['admin', 'init', version, browser, authInfo.clientID, true],
				expect200: true,
				longTag: true,
				requiresPhoneConnection: false
			}) as WAInitResponse

			if(!canDoLogin) {
				generateKeysForAuth(ref, ttl)
			}
		})()
		let loginTag: string | undefined
		if(canDoLogin) {
			updateEncKeys()
			// if we have the info to restore a closed session
			const json = [
				'admin',
				'login',
				authInfo.clientToken,
				authInfo.serverToken,
				authInfo.clientID,
				'takeover'
			]
			loginTag = socket.generateMessageTag(true)
			// send login every 10s
			const sendLoginReq = () => {
				if(state.connection === 'open') {
					logger.warn('Received login timeout req when state=open, ignoring...')
					return
				}

				logger.info('sending login request')
				socket.sendNode({
					json,
					tag: loginTag
				})
				initTimeout = setTimeout(sendLoginReq, 10_000)
			}

			sendLoginReq()
		}

		await initQuery

		// wait for response with tag "s1"
		let response = await Promise.race(
			[
				socket.waitForMessage('s1', false, undefined).promise,
				...(loginTag ? [socket.waitForMessage(loginTag, false, connectTimeoutMs).promise] : [])
			]
		)
		initTimeout && clearTimeout(initTimeout)
		initTimeout = undefined

		if(response.status && response.status !== 200) {
			throw new Boom('Unexpected error in login', { data: response, statusCode: response.status })
		}

		// if its a challenge request (we get it when logging in)
		if(response[1]?.challenge) {
			const json = computeChallengeResponse(response[1].challenge, authInfo)
			logger.info('resolving login challenge')

			await socket.query({ json, expect200: true, timeoutMs: connectTimeoutMs })

			response = await socket.waitForMessage('s2', true).promise
		}

		if(!response || !response[1]) {
			throw new Boom('Received unexpected login response', { data: response })
		}

		if(response[1].type === 'upgrade_md_prod') {
			throw new Boom('Require multi-device edition', { statusCode: DisconnectReason.multideviceMismatch })
		}

		// validate the new connection
		const { user, auth } = validateNewConnection(response[1], authInfo, curveKeys)// validate the connection
		const isNewLogin = user.id !== state.legacy!.user?.id

		Object.assign(authInfo, auth)
		updateEncKeys()

		logger.info({ user }, 'logged in')

		ev.emit('creds.update', auth)

		updateState({
			connection: 'open',
			legacy: {
				phoneConnected: true,
				user,
			},
			isNewLogin,
			qr: undefined
		})
	}

	ws.once('open', async() => {
		try {
			await onOpen()
		} catch(error) {
			socket.end(error)
		}
	})

	if(printQRInTerminal) {
		printQRIfNecessaryListener(ev, logger)
	}

	process.nextTick(() => {
		ev.emit('connection.update', {
			...state
		})
	})

	return {
		...socket,
		state,
		authInfo,
		ev,
		canLogin,
		logout,
		/** Waits for the connection to WA to reach a state */
		waitForConnectionUpdate: bindWaitForConnectionUpdate(ev)
	}
}

export default makeAuthSocket