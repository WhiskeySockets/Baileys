import { jest } from '@jest/globals'
import { proto } from '../..'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import makeWASocket from '../../Socket'
import { makeSession, mockWebSocket } from '../TestUtils/session'

mockWebSocket()

describe('Connection Deadlock Test', () => {
	it('should not deadlock when history sync is disabled', async () => {
		const { state, clear } = await makeSession()

		state.creds.me = { id: '1234567890:1@s.whatsapp.net', name: 'Test User' }

		const sock = makeWASocket({
			...DEFAULT_CONNECTION_CONFIG,
			auth: state,
			// This is the key setting that reproduces the deadlock.
			shouldSyncHistoryMessage: () => false
		})

		// Spy on the internal upsertMessage function to call it directly
		const upsertMessageSpy = jest.spyOn(sock, 'upsertMessage')

		const regularMessageListener = jest.fn()
		sock.ev.on('messages.upsert', regularMessageListener)

		// 1. Simulate receiving pending notifications. This activates the buffer.
		sock.ev.emit('connection.update', { receivedPendingNotifications: true })

		// 2. Directly call the internal 'upsertMessage' function to simulate
		// the arrival of a history sync notification. This is the crucial step.
		// This bypasses the event buffer and triggers our state machine logic.
		const historySyncNotification = proto.WebMessageInfo.fromObject({
			key: { remoteJid: 'status@broadcast', fromMe: false, id: 'HIST_SYNC_1' },
			messageTimestamp: Date.now() / 1000,
			message: {
				protocolMessage: {
					type: proto.Message.ProtocolMessage.Type.HISTORY_SYNC_NOTIFICATION,
					historySyncNotification: { syncType: proto.HistorySync.HistorySyncType.RECENT }
				}
			}
		})
		// We await this because upsertMessage is async
		// @ts-ignore
		await upsertMessageSpy(historySyncNotification, 'notify')

		// 3. Now, emit a regular message. Because the previous step should have
		// flushed the buffer, this message should be processed immediately.
		const regularMessage = proto.WebMessageInfo.fromObject({
			key: { remoteJid: '1234567890@s.whatsapp.net', fromMe: false, id: 'REGULAR_MSG_1' },
			messageTimestamp: Date.now() / 1000,
			message: { conversation: 'Hello, world!' }
		})
		sock.ev.emit('messages.upsert', { messages: [regularMessage], type: 'notify' })

		// Wait for the event loop to process any final events.
		await new Promise(resolve => setImmediate(resolve))

		// 4. Check if the regular message listener was called.
		// This will now PASS with the refactored code.
		expect(regularMessageListener).toHaveBeenCalledWith(
			expect.objectContaining({
				messages: expect.arrayContaining([
					expect.objectContaining({
						key: regularMessage.key
					})
				]),
				type: 'notify'
			})
		)

		sock.ev.off('messages.upsert', regularMessageListener)
		upsertMessageSpy.mockRestore()
		await clear()
	})
})
