import { jest } from '@jest/globals'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import { WebSocketClient } from '../../Socket/Client'
import { makeMessagesSocket } from '../../Socket/messages-send'
import type { SocketConfig } from '../../Types'
import { decodeBinaryNode } from '../../WABinary'

// Store original prototype methods to restore them after tests
const originalConnect = WebSocketClient.prototype.connect
const originalSend = WebSocketClient.prototype.send
const originalClose = WebSocketClient.prototype.close
const originalIsOpenDescriptor = Object.getOwnPropertyDescriptor(WebSocketClient.prototype, 'isOpen')

describe('PN to LID Resolution (Issues #2683, #2698, #2688)', () => {
	let mockLidMapping: {
		getLIDForPN: jest.Mock<(pn: string) => Promise<string | null>>
		getPNForLID: jest.Mock<(lid: string) => Promise<string | null>>
		getLIDsForPNs: jest.Mock<(pns: string[]) => Promise<{ pn: string; lid: string }[] | null>>
	}
	let config: any

	beforeAll(() => {
		// Mock connect to be a no-op to prevent real network connections
		WebSocketClient.prototype.connect = jest.fn()
		WebSocketClient.prototype.close = jest.fn(() => Promise.resolve())

		// Mock isOpen to always return true
		Object.defineProperty(WebSocketClient.prototype, 'isOpen', {
			get: () => true,
			configurable: true
		})

		// Mock send to immediately call the callback and auto-reply to pending queries
		WebSocketClient.prototype.send = jest.fn().mockImplementation(function (this: any, data: any, cb: any) {
			cb?.(null)

			// Find any active TAG listeners and automatically reply to resolve the query
			const listeners = this.eventNames()
			for (const name of listeners) {
				if (typeof name === 'string' && name.startsWith('TAG:')) {
					const tag = name.slice(4)
					process.nextTick(async () => {
						let content: any[] = []
							const buf = Buffer.from(data)
							let decoded: any = null
							for (let offset = 0; offset < 20 && offset < buf.length; offset++) {
								try {
									decoded = await decodeBinaryNode(buf.slice(offset))
									break
								} catch {
									// try next offset
								}
							}

							if (decoded && decoded.tag === 'iq' && decoded.attrs.to?.endsWith('@g.us')) {
								content = [
									{
										tag: 'group',
										attrs: {
											id: decoded.attrs.to.split('@')[0],
											creation: '1700000000',
											s_t: '1700000000',
											subject: 'Test Group',
										},
										content: []
									}
								]
							}

						const responseNode = {
							tag: 'iq',
							attrs: { id: tag, type: 'result' },
							content
						}
						this.emit(name, responseNode)
					})
				}
			}

			return true
		}) as any
	})

	afterAll(() => {
		// Restore original prototype methods to avoid polluting other tests
		WebSocketClient.prototype.connect = originalConnect
		WebSocketClient.prototype.send = originalSend
		WebSocketClient.prototype.close = originalClose
		if (originalIsOpenDescriptor) {
			Object.defineProperty(WebSocketClient.prototype, 'isOpen', originalIsOpenDescriptor)
		}
	})

	beforeEach(() => {
		jest.clearAllMocks()
		mockLidMapping = {
			getLIDForPN: jest.fn<(pn: string) => Promise<string | null>>(),
			getPNForLID: jest.fn<(lid: string) => Promise<string | null>>(),
			getLIDsForPNs: jest.fn<(pns: string[]) => Promise<{ pn: string; lid: string }[] | null>>()
		}
		mockLidMapping.getPNForLID.mockResolvedValue(null)
		mockLidMapping.getLIDsForPNs.mockResolvedValue([])

		config = {
			...DEFAULT_CONNECTION_CONFIG,
			logger: {
				info: jest.fn(),
				debug: jest.fn(),
				warn: jest.fn(),
				error: jest.fn(),
				trace: jest.fn(),
				child: jest.fn().mockReturnThis()
			},
			auth: {
				creds: {
					me: { id: 'me@s.whatsapp.net' }
				},
				keys: {
					get: jest.fn<any>().mockResolvedValue({}),
					set: jest.fn()
				}
			},
			makeSignalRepository: jest.fn().mockReturnValue({
				lidMapping: mockLidMapping,
				validateSession: jest.fn<any>().mockResolvedValue({ exists: true }),
				encryptMessage: jest.fn<any>().mockResolvedValue({ type: 'pkmsg', ciphertext: Buffer.from('cipher') }),
				encryptGroupMessage: jest
					.fn<any>()
					.mockResolvedValue({ ciphertext: Buffer.from('cipher'), senderKeyDistributionMessage: Buffer.from('skdm') }),
				hasSenderKey: jest.fn<any>().mockResolvedValue(false)
			}),
			options: {}
		}
	})

	it('should keep destination JID unchanged for PN when no mapped LID exists', async () => {
		mockLidMapping.getLIDForPN.mockResolvedValue(null)

		const sock = makeMessagesSocket(config as unknown as SocketConfig)

		await sock.sendMessage('12345@s.whatsapp.net', { text: 'test' })

		expect(mockLidMapping.getLIDForPN).toHaveBeenCalledWith('12345@s.whatsapp.net')
	})

	it('should resolve destination JID to mapped LID when mapping exists', async () => {
		mockLidMapping.getLIDForPN.mockResolvedValue('98765@lid')

		const sock = makeMessagesSocket(config as unknown as SocketConfig)

		await sock.sendMessage('12345@s.whatsapp.net', { text: 'test' })

		expect(mockLidMapping.getLIDForPN).toHaveBeenCalledWith('12345@s.whatsapp.net')
	})

	it('should keep destination JID unchanged when sending directly to LID', async () => {
		const sock = makeMessagesSocket(config as unknown as SocketConfig)

		await sock.sendMessage('98765@lid', { text: 'test' })

		expect(mockLidMapping.getLIDForPN).not.toHaveBeenCalled()
	})

	it('should keep destination JID unchanged for groups', async () => {
		const sock = makeMessagesSocket(config as unknown as SocketConfig)

		sock.groupMetadata = jest.fn<any>().mockResolvedValue({
			id: '12345-group@g.us',
			participants: []
		})

		await sock.sendMessage('12345-group@g.us', { text: 'test' })

		expect(mockLidMapping.getLIDForPN).not.toHaveBeenCalled()
	})

	it('should gracefully fallback to original JID if getLIDForPN throws an error', async () => {
		mockLidMapping.getLIDForPN.mockRejectedValue(new Error('Database disconnect'))

		const sock = makeMessagesSocket(config as unknown as SocketConfig)

		await sock.sendMessage('12345@s.whatsapp.net', { text: 'test' })

		expect(mockLidMapping.getLIDForPN).toHaveBeenCalledWith('12345@s.whatsapp.net')
	})

	it('should keep destination JID unchanged and not query mapping for newsletters', async () => {
		const sock = makeMessagesSocket(config as unknown as SocketConfig)

		await sock.sendMessage('120363234@newsletter', { text: 'test' })

		expect(mockLidMapping.getLIDForPN).not.toHaveBeenCalled()
	})

	it('should keep destination JID unchanged and not query mapping for status broadcast', async () => {
		const sock = makeMessagesSocket(config as unknown as SocketConfig)

		await sock.sendMessage('status@broadcast', { text: 'test' })

		expect(mockLidMapping.getLIDForPN).not.toHaveBeenCalled()
	})

	it('should handle malformed/invalid JIDs gracefully without throwing or querying mapping', async () => {
		const sock = makeMessagesSocket(config as unknown as SocketConfig)

		await sock.sendMessage('invalid-jid@invalid-domain', { text: 'test' })

		expect(mockLidMapping.getLIDForPN).not.toHaveBeenCalled()
	})
})
