import { Boom } from '@hapi/boom'
import EventEmitter from "events"
import * as Curve from 'curve25519-js'
import { BaileysEventEmitter, BaileysEventMap, SocketConfig, CurveKeyPair, WAInitResponse, ConnectionState, DisconnectReason } from "../Types"
import { makeSocket } from "./socket"
import { generateClientID, promiseTimeout } from "../Utils/generics"
import { normalizedAuthInfo, computeChallengeResponse, validateNewConnection } from "../Utils/validate-connection"
import { randomBytes } from "crypto"
import { AuthenticationCredentials } from "../Types"

const makeAuthSocket = (config: SocketConfig) => {
	const {
		logger,
		version,
		browser,
		connectTimeoutMs,
		pendingRequestTimeoutMs,
		maxQRCodes,
		printQRInTerminal,
		credentials: anyAuthInfo
	} = config
	const ev = new EventEmitter() as BaileysEventEmitter
	
	let authInfo = normalizedAuthInfo(anyAuthInfo) || 
					// generate client id if not there
					{ clientID: generateClientID() } as AuthenticationCredentials
	
	const state: ConnectionState = {
		phoneConnected: false,
		connection: 'connecting',
	}

	const socket = makeSocket({
		...config,
		phoneConnectionChanged: phoneConnected => {
			if(phoneConnected !== state.phoneConnected) {
				updateState({ phoneConnected })
			}
		}
	})
	const { socketEvents } = socket
	let curveKeys: CurveKeyPair
	let initTimeout: NodeJS.Timeout
	// add close listener
	socketEvents.on('ws-close', (error: Boom | Error) => {
		logger.info({ error }, 'Closed connection to WhatsApp')
		initTimeout && clearTimeout(initTimeout)
		// if no reconnects occur
		// send close event
		updateState({ 
			connection: 'close', 
			qr: undefined,
			connectionTriesLeft: undefined,
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
            await socket.sendMessage({
				json: ['admin', 'Conn', 'disconnect'],
				tag: 'goodbye'
			})
        }
		// will call state update to close connection
        socket?.end(
			new Boom('Logged Out', { statusCode: DisconnectReason.credentialsInvalidated })
		)
		authInfo = undefined
	}
	/** Waits for the connection to WA to open up */
	const waitForConnection = async(waitInfinitely: boolean = false) => {
        if(state.connection === 'open') return

        let listener: (item: BaileysEventMap['connection.update']) => void
		const timeout = waitInfinitely ? undefined : pendingRequestTimeoutMs
        if(timeout < 0) {
            throw new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed })
        }

        await (
            promiseTimeout(
                timeout, 
                (resolve, reject) => {
                    listener = ({ connection, lastDisconnect }) => {
						if(connection === 'open') resolve()
						else if(connection == 'close') {
							reject(lastDisconnect.error || new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed }))
						}
					}
                    ev.on('connection.update', listener)
                }
            )
            .finally(() => (
				ev.off('state.update', listener)
			))
        )
    }

	const generateKeysForAuth = async(ref: string, ttl?: number) => {
		curveKeys = Curve.generateKeyPair(randomBytes(32))
		const publicKey = Buffer.from(curveKeys.public).toString('base64')
		let qrGens = 0
		
		const qrLoop = ttl => {
			const qr = [ref, publicKey, authInfo.clientID].join(',')
			updateState({ qr })

			initTimeout = setTimeout(async () => {
				if(state.connection !== 'connecting') return

				logger.debug('regenerating QR')
				try {
					if(qrGens >= maxQRCodes) {
						throw new Boom(
							'Too many QR codes',
							{ statusCode: 429 }
						)
					}
					// request new QR
					const {ref: newRef, ttl: newTTL} = await socket.query({
						json: ['admin', 'Conn', 'reref'], 
						expect200: true,
						longTag: true,
						requiresPhoneConnection: false
					})
					ttl = newTTL
					ref = newRef
				} catch (error) {
					logger.error({ error }, `error in QR gen`)
					if (error.output?.statusCode === 429) { // too many QR requests
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
        const initQuery = (async () => {
            const {ref, ttl} = await socket.query({
                json: ['admin', 'init', version, browser, authInfo.clientID, true], 
                expect200: true,
                longTag: true,
                requiresPhoneConnection: false
            }) as WAInitResponse

            if (!canDoLogin) {
                generateKeysForAuth(ref, ttl)
            }
        })();
        let loginTag: string
        if(canDoLogin) {
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
                socket.sendMessage({
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
				socket.waitForMessage('s1', false, undefined),
				...(loginTag ? [socket.waitForMessage(loginTag, false, connectTimeoutMs)] : []) 
				
			]
        )
        initTimeout && clearTimeout(initTimeout)
        initTimeout = undefined

        if(response.status && response.status !== 200) {
            throw new Boom(`Unexpected error in login`, { data: response, statusCode: response.status })
        }
        // if its a challenge request (we get it when logging in)
        if(response[1]?.challenge) {
			const json = computeChallengeResponse(response[1].challenge, authInfo)
			logger.info('resolving login challenge')
			
			await socket.query({ json, expect200: true, timeoutMs: connectTimeoutMs })
            
			response = await socket.waitForMessage('s2', true)
        }
        // validate the new connection
        const {user, auth, phone} = validateNewConnection(response[1], authInfo, curveKeys)// validate the connection
        const isNewLogin = user.jid !== state.user?.jid
		
		authInfo = auth
		// update the keys so we can decrypt traffic
		socket.updateKeys({ encKey: auth.encKey, macKey: auth.macKey })

		logger.info({ user }, 'logged in')

		updateState({
			connection: 'open',
			phoneConnected: true,
			user,
			isNewLogin,
			phoneInfo: phone,
			connectionTriesLeft: undefined,
			qr: undefined
		})
		ev.emit('credentials.update', auth)
	}
	socketEvents.once('ws-open', async() => {
		try {
			await onOpen()
		} catch(error) {
			socket.end(error)
		}
	})

	if(printQRInTerminal) {
		ev.on('connection.update', async({ qr }) => {
			if(qr) {
				const QR = await import('qrcode-terminal').catch(err => {
					logger.error('QR code terminal not added as dependency')
				})
				QR?.generate(qr, { small: true })
			}
		})
	}
	return {
		...socket,
		ev,
		getState: () => state,
		getAuthInfo: () => authInfo,
		waitForConnection,
		canLogin,
		logout
	}
}
export default makeAuthSocket