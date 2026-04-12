
import { jest } from '@jest/globals'
import pino from 'pino'
import EventEmitter from 'events'
import { Buffer } from 'buffer'

const logger = pino({ level: 'silent' })

describe('Issue 2464 Reproduction', () => {
	it('should not lose messages in a burst', async () => {
        const { makeEventBuffer } = await import('../Utils/event-buffer')
		const ev = makeEventBuffer(logger)
		const messagesReceived: any[] = []

		ev.on('messages.upsert', ({ messages }) => {
			messagesReceived.push(...messages)
		})

		const count = 100
		const remoteJid = '123456@newsletter'

		// Simulate burst
		ev.buffer()
		for (let i = 0; i < count; i++) {
			ev.emit('messages.upsert', {
				messages: [
					{
						key: {
							remoteJid,
							id: `msg-${i}`,
							fromMe: false
						},
						message: { conversation: `message ${i}` },
						messageTimestamp: Date.now()
					}
				],
				type: 'append'
			})
		}
		ev.flush()

		expect(messagesReceived.length).toBe(count)
	})

    it('should overwrite messages with the same key in a burst', async () => {
        const { makeEventBuffer } = await import('../Utils/event-buffer')
		const ev = makeEventBuffer(logger)
		const messagesReceived: any[] = []

		ev.on('messages.upsert', ({ messages }) => {
			messagesReceived.push(...messages)
		})

		const remoteJid = '123456@newsletter'

		// Simulate burst with same key
		ev.buffer()
		ev.emit('messages.upsert', {
			messages: [
				{
					key: { remoteJid, id: 'same-id', fromMe: false },
					message: { conversation: 'first' },
					messageTimestamp: Date.now()
				}
			],
			type: 'append'
		})
		ev.emit('messages.upsert', {
			messages: [
				{
					key: { remoteJid, id: 'same-id', fromMe: false },
					message: { conversation: 'second' },
					messageTimestamp: Date.now()
				}
			],
			type: 'append'
		})
		ev.flush()

		expect(messagesReceived.length).toBe(1)
		expect(messagesReceived[0].message.conversation).toBe('second')
	})

	it('should process multiple messages in a single newsletter notification (Integration Test)', async () => {
        const mockMakeMessagesSocket = jest.fn()
        jest.unstable_mockModule('../Socket/messages-send', () => ({
            makeMessagesSocket: mockMakeMessagesSocket
        }))

        const { makeMessagesRecvSocket } = await import('../Socket/messages-recv')
        const { makeEventBuffer } = await import('../Utils/event-buffer')
        const { proto } = await import('../../WAProto')

		const ev = makeEventBuffer(logger)
		const ws = new EventEmitter()
		const messagesReceived: any[] = []

		// We want to see what ends up in event-buffer eventually
		ev.on('messages.upsert', ({ messages }) => {
			messagesReceived.push(...messages)
		})

		// Mock makeMessagesSocket to return our controlled objects
		mockMakeMessagesSocket.mockReturnValue({
			ev,
			ws,
			authState: { creds: { me: { id: 'me' } } } as any,
			signalRepository: {
				jidToSignalProtocolAddress: jest.fn(),
				validateSession: jest.fn(),
				lidMapping: { getPNForLID: jest.fn() }
			} as any,
			messageMutex: { mutex: jest.fn(async (work: () => any) => work()) } as any,
			notificationMutex: { mutex: jest.fn(async (work: () => any) => work()) } as any,
			receiptMutex: { mutex: jest.fn(async (work: () => any) => work()) } as any,
			upsertMessage: jest.fn(async (msg: any, type: any) => {
				// This simulates the behavior of the real upsertMessage which emits to ev
				ev.emit('messages.upsert', { messages: [msg], type })
			}) as any,
			query: jest.fn() as any,
			onUnexpectedError: jest.fn(),
			assertSessions: jest.fn() as any,
			sendNode: jest.fn() as any,
			relayMessage: jest.fn() as any,
			sendReceipt: jest.fn() as any,
			uploadPreKeys: jest.fn() as any,
			sendPeerDataOperationMessage: jest.fn() as any,
			messageRetryManager: null
		} as any)

		const config: any = {
			logger,
			shouldIgnoreJid: () => false,
			retryRequestDelayMs: 0,
			maxMsgRetryCount: 0,
			getMessage: jest.fn(),
			enableAutoSessionRecreation: false
		}

		makeMessagesRecvSocket(config)

		const remoteJid = '123456@newsletter'
		const msg1 = proto.Message.encode({ conversation: 'message 1' }).finish()
		const msg2 = proto.Message.encode({ conversation: 'message 2' }).finish()

		// Construct a newsletter notification with multiple children
		const node = {
			tag: 'notification',
			attrs: {
				from: remoteJid,
				type: 'newsletter',
				id: 'notif-id',
				t: '123456789'
			},
			content: [
				{
					tag: 'message',
					attrs: { message_id: 'msg-1', t: '123456780' },
					content: [
						{ tag: 'plaintext', attrs: {}, content: msg1 }
					]
				},
				{
					tag: 'message',
					attrs: { message_id: 'msg-2', t: '123456781' },
					content: [
						{ tag: 'plaintext', attrs: {}, content: msg2 }
					]
				}
			]
		}

		// Emit the notification on the mock websocket
		ws.emit('CB:notification', node)

        // Wait for async processing
        await new Promise(resolve => setImmediate(resolve))

		// Verify that both messages were processed
		expect(messagesReceived.length).toBe(2)
		expect(messagesReceived[0].message.conversation).toBe('message 1')
		expect(messagesReceived[1].message.conversation).toBe('message 2')
		expect(messagesReceived[0].key.id).toBe('msg-1')
		expect(messagesReceived[1].key.id).toBe('msg-2')
	})
})
