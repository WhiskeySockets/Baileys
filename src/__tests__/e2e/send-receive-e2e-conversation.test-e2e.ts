import { Boom } from '@hapi/boom'
import { jest } from '@jest/globals'
import { statSync } from 'node:fs'
import makeWASocket, { DisconnectReason, jidNormalizedUser, useMultiFileAuthState, type WAMessage } from '../../index'
import P from 'pino'

jest.setTimeout(120_000)

describe('E2E Conversation Test', () => {
	let sock1: ReturnType<typeof makeWASocket>
	let sock2: ReturnType<typeof makeWASocket>
	let meJid1: string | undefined
	let meJid2: string | undefined

	beforeAll(async () => {
		const authInfoDir1 = 'baileys_auth_info'
		const authInfoDir2 = 'baileys_auth_info_2'

		try {
			// Check if auth directories exist, otherwise skip the test
			statSync(authInfoDir1)
			statSync(authInfoDir2)
		} catch (error) {
			console.warn(
				'Skipping E2E conversation test: one or both auth info directories not found. Please set up two valid sessions.'
			)
			return
		}

		const logger = P({ level: 'silent' })

		const { state: state1, saveCreds: saveCreds1 } = await useMultiFileAuthState(authInfoDir1)
		const { state: state2, saveCreds: saveCreds2 } = await useMultiFileAuthState(authInfoDir2)

		sock1 = makeWASocket({ auth: state1, logger })
		sock2 = makeWASocket({ auth: state2, logger })

		sock1.ev.on('creds.update', saveCreds1)
		sock2.ev.on('creds.update', saveCreds2)

		const connectTasks = [
			new Promise<void>((resolve, reject) => {
				sock1.ev.on('connection.update', ({ connection, lastDisconnect }) => {
					if (connection === 'open') {
						meJid1 = jidNormalizedUser(sock1.user?.id)
						resolve()
					} else if (connection === 'close') {
						const reason = (lastDisconnect?.error as Boom)?.output?.statusCode
						if (reason === DisconnectReason.loggedOut) {
							reject(new Error('Socket 1 logged out. Please re-authenticate.'))
						} else if (reason !== DisconnectReason.connectionClosed) {
							reject(new Error(`Socket 1 connection closed unexpectedly: ${lastDisconnect?.error?.message}`))
						}
					}
				})
			}),
			new Promise<void>((resolve, reject) => {
				sock2.ev.on('connection.update', ({ connection, lastDisconnect }) => {
					if (connection === 'open') {
						meJid2 = jidNormalizedUser(sock2.user?.id)
						resolve()
					} else if (connection === 'close') {
						const reason = (lastDisconnect?.error as Boom)?.output?.statusCode
						if (reason === DisconnectReason.loggedOut) {
							reject(new Error('Socket 2 logged out. Please re-authenticate.'))
						} else if (reason !== DisconnectReason.connectionClosed) {
							reject(new Error(`Socket 2 connection closed unexpectedly: ${lastDisconnect?.error?.message}`))
						}
					}
				})
			})
		]

		try {
			await Promise.all(connectTasks)
		} catch (error) {
			console.error('Failed to connect one or both sockets for E2E test', error)
			// ensure sockets are cleaned up
			sock1?.end(undefined)
			sock2?.end(undefined)
			sock1 = undefined as any
			sock2 = undefined as any
		}
	})

	afterAll(() => {
		sock1?.end(undefined)
		sock2?.end(undefined)
	})

	test('should exchange a single message', async () => {
		if (!sock1 || !sock2) {
			return
		}

		const messageContent = `[bot1] E2E single message test: ${Date.now()}`
		let receivedMessage: WAMessage | undefined

		const listener = (event: { messages: WAMessage[] }) => {
			const msg = event.messages[0]!
			// When sock1 sends to its own number, sock2 receives it as a synced message, so `fromMe` is true.
			if (msg.key.remoteJid === meJid2 && msg.key.fromMe) {
				const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text
				if (text === messageContent) {
					receivedMessage = msg
				}
			}
		}

		sock2.ev.on('messages.upsert', listener)
		await sock1.sendMessage(meJid1!, { text: messageContent })

		await new Promise<void>((resolve, reject) => {
			let timeoutId: NodeJS.Timeout
			const check = () => {
				if (receivedMessage) {
					clearTimeout(timeoutId)
					resolve()
				} else {
					setTimeout(check, 500)
				}
			}
			timeoutId = setTimeout(() => reject(new Error('Timeout waiting for message')), 10000)
			check()
		}).finally(() => {
			sock2.ev.off('messages.upsert', listener)
		})

		expect(receivedMessage).toBeDefined()
		expect(receivedMessage?.message?.conversation || receivedMessage?.message?.extendedTextMessage?.text).toBe(
			messageContent
		)

		// Now reply from sock2 to sock1
		const replyContent = `[bot2] E2E single message reply: ${Date.now()}`
		let receivedReply: WAMessage | undefined

		const replyListener = (event: { messages: WAMessage[] }) => {
			const msg = event.messages[0]!
			// Same logic here for the reply
			if (msg.key.remoteJid === meJid1 && msg.key.fromMe) {
				const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text
				if (text === replyContent) {
					receivedReply = msg
				}
			}
		}

		sock1.ev.on('messages.upsert', replyListener)
		await sock2.sendMessage(meJid2!, { text: replyContent })

		await new Promise<void>((resolve, reject) => {
			let timeoutId: NodeJS.Timeout
			const check = () => {
				if (receivedReply) {
					clearTimeout(timeoutId)
					resolve()
				} else {
					setTimeout(check, 500)
				}
			}
			timeoutId = setTimeout(() => reject(new Error('Timeout waiting for reply')), 10000)
			check()
		}).finally(() => {
			sock1.ev.off('messages.upsert', replyListener)
		})

		expect(receivedReply).toBeDefined()
		expect(receivedReply?.message?.conversation || receivedReply?.message?.extendedTextMessage?.text).toBe(replyContent)
	})

	test('should handle a batch of messages', async () => {
		if (!sock1 || !sock2) {
			return
		}

		const batchSize = 10
		const sentMessages = new Set<string>()
		const receivedMessages = new Set<string>()

		const listener = (event: { messages: WAMessage[] }) => {
			for (const msg of event.messages) {
				if (msg.key.remoteJid === meJid2 && msg.key.fromMe) {
					const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text
					if (text && sentMessages.has(text)) {
						receivedMessages.add(text)
					}
				}
			}
		}

		sock2.ev.on('messages.upsert', listener)

		for (let i = 0; i < batchSize; i++) {
			const content = `[bot1] E2E batch test ${i}: ${Date.now()}`
			sentMessages.add(content)
			await sock1.sendMessage(meJid1!, { text: content })
			await new Promise(resolve => setTimeout(resolve, 1)) // small delay between sends
		}

		await new Promise<void>((resolve, reject) => {
			let timeoutId: NodeJS.Timeout
			const check = () => {
				if (receivedMessages.size === batchSize) {
					clearTimeout(timeoutId)
					resolve()
				} else {
					setTimeout(check, 1000)
				}
			}
			timeoutId = setTimeout(() => reject(new Error('Timeout waiting for messages')), 30000)
			check()
		}).finally(() => {
			sock2.ev.off('messages.upsert', listener)
		})

		expect(receivedMessages.size).toBe(batchSize)

		// Now test from sock2 to sock1
		const sentMessages2 = new Set<string>()
		const receivedMessages2 = new Set<string>()

		const listener2 = (event: { messages: WAMessage[] }) => {
			for (const msg of event.messages) {
				if (msg.key.remoteJid === meJid1 && msg.key.fromMe) {
					const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text
					if (text && sentMessages2.has(text)) {
						receivedMessages2.add(text)
					}
				}
			}
		}

		sock1.ev.on('messages.upsert', listener2)

		for (let i = 0; i < batchSize; i++) {
			const content = `[bot2] E2E batch test reply ${i}: ${Date.now()}`
			sentMessages2.add(content)
			await sock2.sendMessage(meJid2!, { text: content })
			await new Promise(resolve => setTimeout(resolve, 1))
		}

		await new Promise<void>((resolve, reject) => {
			let timeoutId: NodeJS.Timeout
			const check = () => {
				if (receivedMessages2.size === batchSize) {
					clearTimeout(timeoutId)
					resolve()
				} else {
					setTimeout(check, 1000)
				}
			}
			timeoutId = setTimeout(() => reject(new Error('Timeout waiting for messages')), 30000)
			check()
		}).finally(() => {
			sock1.ev.off('messages.upsert', listener2)
		})

		expect(receivedMessages2.size).toBe(batchSize)
	})
})
