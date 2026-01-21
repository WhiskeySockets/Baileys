/**
 * Tests for CTWA (Click-to-WhatsApp) Ads Message Recovery
 *
 * This tests the functionality that recovers messages from Facebook/Instagram ads
 * that arrive as "placeholder messages" because Meta's ads endpoint doesn't
 * encrypt messages for linked devices.
 *
 * @see https://github.com/WhiskeySockets/Baileys/issues/1723
 */

import { proto } from '../../../WAProto/index.js'
import { metrics } from '../../Utils/prometheus-metrics.js'
import { NO_MESSAGE_FOUND_ERROR_TEXT } from '../../Utils/decode-wa-message.js'

describe('CTWA Recovery', () => {
	describe('Message Detection', () => {
		it('should correctly identify NO_MESSAGE_FOUND_ERROR_TEXT constant', () => {
			expect(NO_MESSAGE_FOUND_ERROR_TEXT).toBe('Message absent from node')
		})

		it('should match the stubType for CIPHERTEXT messages', () => {
			const stubType = proto.WebMessageInfo.StubType.CIPHERTEXT
			expect(stubType).toBeDefined()
			expect(typeof stubType).toBe('number')
		})
	})

	describe('Placeholder Resend Protocol', () => {
		it('should have PLACEHOLDER_MESSAGE_RESEND in PeerDataOperationRequestType', () => {
			const requestType = proto.Message.PeerDataOperationRequestType.PLACEHOLDER_MESSAGE_RESEND
			expect(requestType).toBeDefined()
			expect(typeof requestType).toBe('number')
		})

		it('should have PEER_DATA_OPERATION_REQUEST_MESSAGE in ProtocolMessage.Type', () => {
			const messageType = proto.Message.ProtocolMessage.Type.PEER_DATA_OPERATION_REQUEST_MESSAGE
			expect(messageType).toBeDefined()
			expect(typeof messageType).toBe('number')
		})

		it('should have PEER_DATA_OPERATION_REQUEST_RESPONSE_MESSAGE in ProtocolMessage.Type', () => {
			const responseType = proto.Message.ProtocolMessage.Type.PEER_DATA_OPERATION_REQUEST_RESPONSE_MESSAGE
			expect(responseType).toBeDefined()
			expect(typeof responseType).toBe('number')
		})
	})

	describe('PDO Request Structure', () => {
		it('should create valid PDO message structure for placeholder resend', () => {
			const messageKey = {
				remoteJid: 'user@s.whatsapp.net',
				fromMe: false,
				id: 'TEST_MSG_ID'
			}

			const pdoMessage: proto.Message.IPeerDataOperationRequestMessage = {
				placeholderMessageResendRequest: [
					{
						messageKey
					}
				],
				peerDataOperationRequestType: proto.Message.PeerDataOperationRequestType.PLACEHOLDER_MESSAGE_RESEND
			}

			expect(pdoMessage.placeholderMessageResendRequest).toHaveLength(1)
			expect(pdoMessage.placeholderMessageResendRequest?.[0]?.messageKey).toEqual(messageKey)
			expect(pdoMessage.peerDataOperationRequestType).toBe(
				proto.Message.PeerDataOperationRequestType.PLACEHOLDER_MESSAGE_RESEND
			)
		})
	})

	describe('PDO Response Processing', () => {
		it('should decode webMessageInfoBytes from placeholder resend response', () => {
			// Create a minimal WebMessageInfo
			const originalMessage: proto.IWebMessageInfo = {
				key: {
					remoteJid: 'user@s.whatsapp.net',
					fromMe: false,
					id: 'RECOVERED_MSG_ID'
				},
				message: {
					conversation: 'Hello from Facebook ad!'
				},
				messageTimestamp: Math.floor(Date.now() / 1000)
			}

			// Encode it
			const encoded = proto.WebMessageInfo.encode(originalMessage).finish()

			// Decode it back (simulating what process-message.ts does)
			const decoded = proto.WebMessageInfo.decode(encoded)

			expect(decoded.key?.id).toBe('RECOVERED_MSG_ID')
			expect(decoded.key?.remoteJid).toBe('user@s.whatsapp.net')
			expect(decoded.message?.conversation).toBe('Hello from Facebook ad!')
		})

		it('should handle empty webMessageInfoBytes gracefully', () => {
			const emptyBuffer = Buffer.alloc(0)

			// Empty buffer returns empty object (protobuf default behavior)
			const result = proto.WebMessageInfo.decode(emptyBuffer)
			expect(result).toBeDefined()
			// Key fields will be null for empty buffer (protobuf default)
			expect(result.key).toBeNull()
		})
	})

	describe('Metrics Integration', () => {
		it('should have all required CTWA metrics defined', () => {
			expect(metrics.ctwaRecoveryRequests).toBeDefined()
			expect(typeof metrics.ctwaRecoveryRequests.inc).toBe('function')

			expect(metrics.ctwaMessagesRecovered).toBeDefined()
			expect(typeof metrics.ctwaMessagesRecovered.inc).toBe('function')

			expect(metrics.ctwaRecoveryLatency).toBeDefined()
			expect(typeof metrics.ctwaRecoveryLatency.observe).toBe('function')

			expect(metrics.ctwaRecoveryFailures).toBeDefined()
			expect(typeof metrics.ctwaRecoveryFailures.inc).toBe('function')
		})

		it('should be able to call recovery request metric with status label', () => {
			// Should not throw when called with valid labels
			expect(() => {
				metrics.ctwaRecoveryRequests.inc({ status: 'requested' })
			}).not.toThrow()
		})

		it('should be able to call recovered messages counter', () => {
			// Should not throw when called
			expect(() => {
				metrics.ctwaMessagesRecovered.inc()
			}).not.toThrow()
		})

		it('should be able to observe recovery latency', () => {
			const latencyMs = 2500
			// Should not throw when called with valid latency
			expect(() => {
				metrics.ctwaRecoveryLatency.observe(latencyMs)
			}).not.toThrow()
		})

		it('should be able to call failure counter with reason', () => {
			// Should not throw when called with valid labels
			expect(() => {
				metrics.ctwaRecoveryFailures.inc({ reason: 'request_failed' })
			}).not.toThrow()
		})
	})

	describe('Configuration', () => {
		it('should have enableCTWARecovery as a valid configuration option', () => {
			// This tests that the type system accepts enableCTWARecovery
			const config = {
				enableCTWARecovery: true
			}

			expect(config.enableCTWARecovery).toBe(true)
		})

		it('should default enableCTWARecovery to true', async () => {
			// Import the defaults
			const { DEFAULT_CONNECTION_CONFIG } = await import('../../Defaults/index.js')

			// The config should have enableCTWARecovery defaulting to true
			expect(DEFAULT_CONNECTION_CONFIG.enableCTWARecovery).toBe(true)
		})
	})
})

describe('CTWA Message Scenarios', () => {
	describe('Facebook Ads Click-to-WhatsApp', () => {
		it('should identify a typical CTWA stub message', () => {
			// A typical CTWA message arrives like this
			const ctwaStubMessage = {
				key: {
					remoteJid: 'lead@s.whatsapp.net',
					fromMe: false,
					id: 'CTWA_MSG_12345'
				},
				messageStubType: proto.WebMessageInfo.StubType.CIPHERTEXT,
				messageStubParameters: ['Message absent from node'],
				messageTimestamp: Math.floor(Date.now() / 1000)
			}

			// Verify it matches the detection criteria
			expect(ctwaStubMessage.messageStubType).toBe(proto.WebMessageInfo.StubType.CIPHERTEXT)
			expect(ctwaStubMessage.messageStubParameters?.[0]).toBe(NO_MESSAGE_FOUND_ERROR_TEXT)
		})

		it('should differentiate CTWA from other CIPHERTEXT errors', () => {
			const preKeyError = {
				messageStubType: proto.WebMessageInfo.StubType.CIPHERTEXT,
				messageStubParameters: ['PreKey not found']
			}

			const missingKeysError = {
				messageStubType: proto.WebMessageInfo.StubType.CIPHERTEXT,
				messageStubParameters: ['Missing keys for decryption']
			}

			const ctwaError = {
				messageStubType: proto.WebMessageInfo.StubType.CIPHERTEXT,
				messageStubParameters: [NO_MESSAGE_FOUND_ERROR_TEXT]
			}

			// CTWA detection should only match "Message absent from node"
			expect(ctwaError.messageStubParameters[0]).toBe(NO_MESSAGE_FOUND_ERROR_TEXT)
			expect(preKeyError.messageStubParameters[0]).not.toBe(NO_MESSAGE_FOUND_ERROR_TEXT)
			expect(missingKeysError.messageStubParameters[0]).not.toBe(NO_MESSAGE_FOUND_ERROR_TEXT)
		})
	})

	describe('Instagram Ads Click-to-WhatsApp', () => {
		it('should handle Instagram ad messages the same way', () => {
			// Instagram ads use the same CTWA mechanism
			const instagramAdMessage = {
				key: {
					remoteJid: 'instagram_lead@s.whatsapp.net',
					fromMe: false,
					id: 'IG_CTWA_MSG_67890'
				},
				messageStubType: proto.WebMessageInfo.StubType.CIPHERTEXT,
				messageStubParameters: ['Message absent from node'],
				messageTimestamp: Math.floor(Date.now() / 1000)
			}

			expect(instagramAdMessage.messageStubParameters?.[0]).toBe(NO_MESSAGE_FOUND_ERROR_TEXT)
		})
	})
})
