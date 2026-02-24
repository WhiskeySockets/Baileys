import { jest } from '@jest/globals'

/**
 * Tests for the error 463 retry logic in handleBadAck.
 *
 * Since handleBadAck is a closure inside makeMessagesRecvSocket, we extract
 * the core retry logic into a standalone function that mirrors the real
 * implementation and test it directly.
 */

interface MockKey {
	remoteJid: string
	fromMe: boolean
	id: string
}

type GetMessageFn = (key: MockKey) => Promise<any>
type RelayMessageFn = (jid: string, msg: any, opts: any) => Promise<void>
type EmitFn = (event: string, data: any) => void

/** Mirrors the handleBadAck error-463 retry logic */
async function handleBadAck463(
	attrs: { id: string; from: string; error: string },
	tcTokenRetriedMsgIds: Set<string>,
	getMessage: GetMessageFn,
	relayMessage: RelayMessageFn,
	emit: EmitFn,
	delayFn: (ms: number) => Promise<void>
): Promise<{ action: string }> {
	const key: MockKey = { remoteJid: attrs.from, fromMe: true, id: attrs.id }

	if (attrs.error === '463') {
		if (!tcTokenRetriedMsgIds.has(attrs.id)) {
			tcTokenRetriedMsgIds.add(attrs.id)

			const msg = await getMessage(key)
			if (msg) {
				try {
					await delayFn(1500)
					await relayMessage(key.remoteJid, msg, {
						messageId: key.id,
						useUserDevicesCache: true
					})
					return { action: 'retry_succeeded' }
				} catch {
					// fall through to ERROR
				}
			}
		}
	}

	emit('messages.update', [{ key, update: { status: 'ERROR', messageStubParameters: [attrs.error] } }])
	return { action: 'error_emitted' }
}

describe('handleBadAck error 463 retry', () => {
	let tcTokenRetriedMsgIds: Set<string>
	let mockGetMessage: jest.Mock<GetMessageFn>
	let mockRelayMessage: jest.Mock<RelayMessageFn>
	let mockEmit: jest.Mock<EmitFn>
	let mockDelay: jest.Mock<(ms: number) => Promise<void>>

	const baseAttrs = { id: 'msg-001', from: '1234@s.whatsapp.net', error: '463' }

	beforeEach(() => {
		tcTokenRetriedMsgIds = new Set()
		mockGetMessage = jest.fn()
		mockRelayMessage = jest.fn()
		mockEmit = jest.fn()
		mockDelay = jest.fn<(ms: number) => Promise<void>>().mockResolvedValue(undefined)
	})

	it('should retry once on 463 when getMessage returns content', async () => {
		const fakeMsg = { conversation: 'hello' }
		mockGetMessage.mockResolvedValue(fakeMsg)
		mockRelayMessage.mockResolvedValue(undefined)

		const result = await handleBadAck463(
			baseAttrs,
			tcTokenRetriedMsgIds,
			mockGetMessage,
			mockRelayMessage,
			mockEmit,
			mockDelay
		)

		expect(result.action).toBe('retry_succeeded')
		expect(mockGetMessage).toHaveBeenCalledTimes(1)
		expect(mockRelayMessage).toHaveBeenCalledWith(baseAttrs.from, fakeMsg, {
			messageId: baseAttrs.id,
			useUserDevicesCache: true
		})
		expect(mockDelay).toHaveBeenCalledWith(1500)
		expect(mockEmit).not.toHaveBeenCalled()
	})

	it('should NOT retry when getMessage returns undefined', async () => {
		mockGetMessage.mockResolvedValue(undefined)

		const result = await handleBadAck463(
			baseAttrs,
			tcTokenRetriedMsgIds,
			mockGetMessage,
			mockRelayMessage,
			mockEmit,
			mockDelay
		)

		expect(result.action).toBe('error_emitted')
		expect(mockRelayMessage).not.toHaveBeenCalled()
		expect(mockEmit).toHaveBeenCalledTimes(1)
	})

	it('should NOT retry same message ID twice (loop guard)', async () => {
		const fakeMsg = { conversation: 'hello' }
		mockGetMessage.mockResolvedValue(fakeMsg)
		mockRelayMessage.mockResolvedValue(undefined)

		// First attempt succeeds
		await handleBadAck463(baseAttrs, tcTokenRetriedMsgIds, mockGetMessage, mockRelayMessage, mockEmit, mockDelay)
		expect(tcTokenRetriedMsgIds.has(baseAttrs.id)).toBe(true)

		// Second attempt with same ID — should not retry
		mockGetMessage.mockClear()
		mockRelayMessage.mockClear()

		const result = await handleBadAck463(
			baseAttrs,
			tcTokenRetriedMsgIds,
			mockGetMessage,
			mockRelayMessage,
			mockEmit,
			mockDelay
		)

		expect(result.action).toBe('error_emitted')
		expect(mockGetMessage).not.toHaveBeenCalled()
		expect(mockRelayMessage).not.toHaveBeenCalled()
		expect(mockEmit).toHaveBeenCalledTimes(1)
	})

	it('should emit ERROR status when retry fails', async () => {
		const fakeMsg = { conversation: 'hello' }
		mockGetMessage.mockResolvedValue(fakeMsg)
		mockRelayMessage.mockRejectedValue(new Error('send failed'))

		const result = await handleBadAck463(
			baseAttrs,
			tcTokenRetriedMsgIds,
			mockGetMessage,
			mockRelayMessage,
			mockEmit,
			mockDelay
		)

		expect(result.action).toBe('error_emitted')
		expect(mockEmit).toHaveBeenCalledTimes(1)
		expect(mockEmit).toHaveBeenCalledWith(
			'messages.update',
			expect.arrayContaining([
				expect.objectContaining({
					update: expect.objectContaining({ status: 'ERROR' })
				})
			])
		)
	})

	it('should not retry for non-463 errors', async () => {
		for (const errorCode of ['479', '421']) {
			mockGetMessage.mockClear()
			mockRelayMessage.mockClear()
			mockEmit.mockClear()

			const attrs = { ...baseAttrs, error: errorCode }
			const result = await handleBadAck463(
				attrs,
				tcTokenRetriedMsgIds,
				mockGetMessage,
				mockRelayMessage,
				mockEmit,
				mockDelay
			)

			expect(result.action).toBe('error_emitted')
			expect(mockGetMessage).not.toHaveBeenCalled()
			expect(mockRelayMessage).not.toHaveBeenCalled()
		}
	})

	it('should allow retry for different message IDs', async () => {
		const fakeMsg = { conversation: 'hello' }
		mockGetMessage.mockResolvedValue(fakeMsg)
		mockRelayMessage.mockResolvedValue(undefined)

		const result1 = await handleBadAck463(
			{ ...baseAttrs, id: 'msg-A' },
			tcTokenRetriedMsgIds,
			mockGetMessage,
			mockRelayMessage,
			mockEmit,
			mockDelay
		)
		const result2 = await handleBadAck463(
			{ ...baseAttrs, id: 'msg-B' },
			tcTokenRetriedMsgIds,
			mockGetMessage,
			mockRelayMessage,
			mockEmit,
			mockDelay
		)

		expect(result1.action).toBe('retry_succeeded')
		expect(result2.action).toBe('retry_succeeded')
		expect(mockRelayMessage).toHaveBeenCalledTimes(2)
	})
})
