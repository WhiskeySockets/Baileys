
import pino from 'pino'
import { makeEventBuffer } from '../Utils/event-buffer'

const logger = pino({ level: 'debug' })

describe('Issue 2464 Reproduction', () => {
	it('should not lose messages in a burst', async () => {
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
})
