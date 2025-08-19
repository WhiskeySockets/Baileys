import { Boom } from '@hapi/boom'
import { jest } from '@jest/globals'
import { readFileSync } from 'node:fs'
import P from 'pino'
import makeWASocket, { DisconnectReason, jidNormalizedUser, proto, useMultiFileAuthState } from '../../index'

jest.setTimeout(30_000)

describe('E2E Tests', () => {
	jest.useFakeTimers()

	let sock: ReturnType<typeof makeWASocket>
	let meJid: string | undefined

	beforeAll(async () => {
		const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
		const logger = P({ level: 'silent' })

		sock = makeWASocket({
			auth: state,
			logger
		})

		sock.ev.on('creds.update', saveCreds)

		await new Promise<void>((resolve, reject) => {
			sock.ev.on('connection.update', update => {
				const { connection, lastDisconnect } = update
				if (connection === 'open') {
					meJid = jidNormalizedUser(sock.user?.id)
					resolve()
				} else if (connection === 'close') {
					const reason = (lastDisconnect?.error as Boom)?.output?.statusCode
					if (reason === DisconnectReason.loggedOut) {
						console.error('Logged out, please delete the baileys_auth_info_e2e folder and re-run the test')
					}

					if (lastDisconnect?.error) {
						reject(new Error(`Connection closed: ${DisconnectReason[reason] || 'unknown'}`))
					}
				}
			})
		})
	})

	afterAll(async () => {
		if (sock) {
			await new Promise<void>(resolve => {
				sock.ev.on('connection.update', update => {
					if (update.connection === 'close') {
						resolve()
					}
				})
				sock.end(undefined)
			})
		}
	})

	test('should send a message', async () => {
		const messageContent = `E2E Test Message ${Date.now()}`
		const sentMessage = await sock.sendMessage(meJid!, { text: messageContent })

		expect(sentMessage).toBeDefined()
		console.log('Sent message:', sentMessage!.key.id)
		expect(sentMessage!.key.id).toBeTruthy()
		expect(sentMessage!.message?.extendedTextMessage?.text || sentMessage!.message?.conversation).toBe(messageContent)
	})

	test('should edit a message', async () => {
		const messageContent = `E2E Test Message to Edit ${Date.now()}`
		const sentMessage = await sock.sendMessage(meJid!, { text: messageContent })

		expect(sentMessage).toBeDefined()
		console.log('Sent message to edit:', sentMessage!.key.id)

		const newContent = `E2E Edited Message ${Date.now()}`
		const editedMessage = await sock.sendMessage(meJid!, {
			text: newContent,
			edit: sentMessage!.key
		})

		expect(editedMessage).toBeDefined()
		console.log('Edited message response:', editedMessage!.key.id)

		expect(editedMessage!.message?.protocolMessage?.type).toBe(proto.Message.ProtocolMessage.Type.MESSAGE_EDIT)
		const editedContent = editedMessage!.message?.protocolMessage?.editedMessage
		expect(editedContent?.extendedTextMessage?.text || editedContent?.conversation).toBe(newContent)
	})

	test('should react to a message', async () => {
		const messageContent = `E2E Test Message to React to ${Date.now()}`
		const sentMessage = await sock.sendMessage(meJid!, { text: messageContent })

		expect(sentMessage).toBeDefined()
		console.log('Sent message to react to:', sentMessage!.key.id)

		const reaction = '👍'
		const reactionMessage = await sock.sendMessage(meJid!, {
			react: {
				text: reaction,
				key: sentMessage!.key
			}
		})

		expect(reactionMessage).toBeDefined()
		console.log('Sent reaction:', reactionMessage!.key.id)

		expect(reactionMessage!.message?.reactionMessage?.text).toBe(reaction)
		expect(reactionMessage!.message?.reactionMessage?.key?.id).toBe(sentMessage!.key.id)
	})

	test('should remove a reaction from a message', async () => {
		const messageContent = `E2E Test Message to Remove Reaction from ${Date.now()}`
		const sentMessage = await sock.sendMessage(meJid!, { text: messageContent })

		expect(sentMessage).toBeDefined()
		console.log('Sent message to remove reaction from:', sentMessage!.key.id)

		await sock.sendMessage(meJid!, {
			react: {
				text: '😄',
				key: sentMessage!.key
			}
		})

		const removeReactionMessage = await sock.sendMessage(meJid!, {
			react: {
				text: '',
				key: sentMessage!.key
			}
		})

		expect(removeReactionMessage).toBeDefined()
		console.log('Sent remove reaction:', removeReactionMessage!.key.id)

		expect(removeReactionMessage!.message?.reactionMessage?.text).toBe('')
		expect(removeReactionMessage!.message?.reactionMessage?.key?.id).toBe(sentMessage!.key.id)
	})

	test('should delete a message', async () => {
		const messageContent = `E2E Test Message to Delete ${Date.now()}`
		const sentMessage = await sock.sendMessage(meJid!, { text: messageContent })

		expect(sentMessage).toBeDefined()
		console.log('Sent message to delete:', sentMessage!.key.id)

		const deleteMessage = await sock.sendMessage(meJid!, {
			delete: sentMessage!.key
		})

		expect(deleteMessage).toBeDefined()
		console.log('Sent delete message command:', deleteMessage!.key.id)

		expect(deleteMessage!.message?.protocolMessage?.type).toBe(proto.Message.ProtocolMessage.Type.REVOKE)
		expect(deleteMessage!.message?.protocolMessage?.key?.id).toBe(sentMessage!.key.id)
	})

	test('should forward a message', async () => {
		const messageContent = `E2E Test Message to Forward ${Date.now()}`
		const sentMessage = await sock.sendMessage(meJid!, {
			text: messageContent
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent message to forward:', sentMessage!.key.id)

		const forwardedMessage = await sock.sendMessage(meJid!, {
			forward: sentMessage!
		})

		expect(forwardedMessage).toBeDefined()
		console.log('Forwarded message:', forwardedMessage!.key.id)

		const content = forwardedMessage!.message?.extendedTextMessage?.text || forwardedMessage!.message?.conversation
		expect(content).toBe(messageContent)
		expect(forwardedMessage!.key.id).not.toBe(sentMessage!.key.id)
	})

	test('should send an image message', async () => {
		const image = readFileSync('./Media/cat.jpeg')
		const sentMessage = await sock.sendMessage(meJid!, {
			image: image,
			caption: 'E2E Test Image'
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent image message:', sentMessage!.key.id)
		expect(sentMessage!.message?.imageMessage).toBeDefined()
		expect(sentMessage!.message?.imageMessage?.caption).toBe('E2E Test Image')
	})

	test('should send a video message with a thumbnail', async () => {
		const video = readFileSync('./Media/ma_gif.mp4')
		const sentMessage = await sock.sendMessage(meJid!, {
			video: video,
			caption: 'E2E Test Video'
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent video message:', sentMessage!.key.id)
		expect(sentMessage!.message?.videoMessage).toBeDefined()
		expect(sentMessage!.message?.videoMessage?.caption).toBe('E2E Test Video')
	})

	test('should send a PTT (push-to-talk) audio message', async () => {
		const audio = readFileSync('./Media/sonata.mp3')
		const sentMessage = await sock.sendMessage(meJid!, {
			audio: audio,
			ptt: true,
			mimetype: 'audio/mp4'
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent PTT audio message:', sentMessage!.key.id)
		expect(sentMessage!.message?.audioMessage).toBeDefined()
		expect(sentMessage!.message?.audioMessage?.ptt).toBe(true)
	})

	test('should send a document message', async () => {
		const document = readFileSync('./Media/ma_gif.mp4')
		const sentMessage = await sock.sendMessage(meJid!, {
			document: document,
			mimetype: 'application/pdf',
			fileName: 'E2E Test Document.pdf'
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent document message:', sentMessage!.key.id)
		expect(sentMessage!.message?.documentMessage).toBeDefined()
		expect(sentMessage!.message?.documentMessage?.fileName).toBe('E2E Test Document.pdf')
	})

	test('should send a sticker message', async () => {
		const sticker = readFileSync('./Media/cat.jpeg')
		const sentMessage = await sock.sendMessage(meJid!, {
			sticker: sticker
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent sticker message:', sentMessage!.key.id)
		expect(sentMessage!.message?.stickerMessage).toBeDefined()
	})

	test('should send a poll message and receive a vote', async () => {
		const poll = {
			name: 'E2E Test Poll',
			values: ['Option 1', 'Option 2', 'Option 3'],
			selectableCount: 1
		}
		const sentPoll = await sock.sendMessage(meJid!, { poll })

		expect(sentPoll).toBeDefined()
		console.log('Sent poll message:', sentPoll!.key.id)
		expect(sentPoll?.message?.pollCreationMessageV3).toBeDefined()
		expect(sentPoll?.message?.pollCreationMessageV3?.name).toBe('E2E Test Poll')

		// This part of the test would require a second participant to vote
		// and for the test to listen for the poll update message.
		// For simplicity, we are only testing the sending of the poll here.
	})

	test('should send a contact (vCard) message', async () => {
		const vcard =
			'BEGIN:VCARD\n' +
			'VERSION:3.0\n' +
			'FN:E2E Test Contact\n' +
			'ORG:Baileys Tests;\n' +
			'TEL;type=CELL;type=VOICE;waid=1234567890:+1 234-567-890\n' +
			'END:VCARD'
		const sentMessage = await sock.sendMessage(meJid!, {
			contacts: {
				displayName: 'E2E Test Contact',
				contacts: [{ vcard }]
			}
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent contact message:', sentMessage!.key.id)
		expect(sentMessage!.message?.contactMessage).toBeDefined()
		expect(sentMessage!.message?.contactMessage?.vcard).toContain('FN:E2E Test Contact')
	})
})
