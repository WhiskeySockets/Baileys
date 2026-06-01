import { jest } from '@jest/globals'
import { proto, type WAMessage } from '../..'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import makeWASocket from '../../Socket'
import { makeSession, mockWebSocket } from '../TestUtils/session'

mockWebSocket()

describe('Reconnection Sync Skip', () => {
	it('should skip 20s history sync wait on reconnection (accountSyncCounter > 0)', async () => {
		const { state, clear } = await makeSession()

		state.creds.me = { id: '1234567890:1@s.whatsapp.net', name: 'Test User' }
		// Simulate a session that has already synced before
		state.creds.accountSyncCounter = 1

		const sock = makeWASocket({
			...DEFAULT_CONNECTION_CONFIG,
			auth: state
		})

		const messageListener = jest.fn()
		sock.ev.on('messages.upsert', messageListener)

		// Simulate receiving pending notifications (triggers AwaitingInitialSync)
		sock.ev.emit('connection.update', { receivedPendingNotifications: true })

		// Emit a message immediately after — if the 20s wait is skipped,
		// the buffer should already be flushed and this message should be delivered.
		const msg = proto.WebMessageInfo.fromObject({
			key: { remoteJid: '1234567890@s.whatsapp.net', fromMe: false, id: 'MSG_AFTER_RECONNECT' },
			messageTimestamp: Date.now() / 1000,
			message: { conversation: 'Hello after reconnect' }
		}) as WAMessage
		sock.ev.emit('messages.upsert', { messages: [msg], type: 'notify' })

		await new Promise(resolve => setTimeout(resolve, 50))

		// Message should be delivered immediately, NOT buffered for 20s
		expect(messageListener).toHaveBeenCalledTimes(1)
		expect(messageListener).toHaveBeenCalledWith(
			expect.objectContaining({
				messages: expect.arrayContaining([expect.objectContaining({ key: msg.key })]),
				type: 'notify'
			})
		)

		await sock.end(new Error('Test completed'))
		await clear()
	})

	it('should still wait for history sync on fresh pairing (accountSyncCounter === 0)', async () => {
		const { state, clear } = await makeSession()

		state.creds.me = { id: '1234567890:1@s.whatsapp.net', name: 'Test User' }
		// Fresh pairing — accountSyncCounter is 0 (default)
		state.creds.accountSyncCounter = 0

		const sock = makeWASocket({
			...DEFAULT_CONNECTION_CONFIG,
			auth: state
		})

		const messageListener = jest.fn()
		sock.ev.on('messages.upsert', messageListener)

		// Simulate receiving pending notifications
		sock.ev.emit('connection.update', { receivedPendingNotifications: true })

		// Emit a message immediately
		const msg = proto.WebMessageInfo.fromObject({
			key: { remoteJid: '1234567890@s.whatsapp.net', fromMe: false, id: 'MSG_DURING_INITIAL_SYNC' },
			messageTimestamp: Date.now() / 1000,
			message: { conversation: 'Hello during initial sync' }
		}) as WAMessage
		sock.ev.emit('messages.upsert', { messages: [msg], type: 'notify' })

		await new Promise(resolve => setTimeout(resolve, 50))

		// Message should be BUFFERED (not delivered) because we're waiting for history sync
		expect(messageListener).toHaveBeenCalledTimes(0)

		await sock.end(new Error('Test completed'))
		await clear()
	})
})
