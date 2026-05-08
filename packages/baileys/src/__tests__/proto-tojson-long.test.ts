import Long from 'long'
import '../index.js'
import { proto } from '../../WAProto/index.js'

describe('proto serialization', () => {
	it('handles string values in long fields gracefully', () => {
		const message = proto.WebMessageInfo.fromObject({
			key: {
				remoteJid: '123@s.whatsapp.net',
				id: 'ABC123',
				fromMe: false
			},
			messageTimestamp: 1,
			message: {
				imageMessage: {
					fileLength: 42
				}
			}
		})

		const imageMessage = message.message?.imageMessage
		if (!imageMessage) {
			throw new Error('imageMessage missing in test setup')
		}

		;(imageMessage as unknown as { fileLength: unknown }).fileLength = '1234567890123456789'

		expect(() => JSON.stringify(message)).not.toThrow()
		const json = message.toJSON()
		expect(json.message?.imageMessage?.fileLength).toBe('1234567890123456789')
	})

	it('converts Long objects to strings correctly via BigInt fast path', () => {
		const message = proto.WebMessageInfo.fromObject({
			key: {
				remoteJid: '123@s.whatsapp.net',
				id: 'ABC123',
				fromMe: false
			},
			messageTimestamp: Long.fromNumber(1700000000, true),
			message: {
				imageMessage: {
					fileLength: Long.fromString('9876543210', true)
				}
			}
		})

		const json = message.toJSON()
		expect(json.messageTimestamp).toBe('1700000000')
		expect(json.message?.imageMessage?.fileLength).toBe('9876543210')
	})

	it('handles large unsigned Long values (> MAX_SAFE_INTEGER)', () => {
		const message = proto.WebMessageInfo.fromObject({
			key: {
				remoteJid: '123@s.whatsapp.net',
				id: 'ABC123',
				fromMe: false
			},
			messageTimestamp: Long.fromString('18446744073709551615', true), // max uint64
			message: {
				imageMessage: {
					fileLength: Long.fromString('9999999999999999999', true)
				}
			}
		})

		const json = message.toJSON()
		expect(json.messageTimestamp).toBe('18446744073709551615')
		expect(json.message?.imageMessage?.fileLength).toBe('9999999999999999999')
	})

	it('handles zero and small Long values', () => {
		const message = proto.WebMessageInfo.fromObject({
			key: {
				remoteJid: '123@s.whatsapp.net',
				id: 'ABC123',
				fromMe: false
			},
			messageTimestamp: Long.fromNumber(0, true),
			message: {
				imageMessage: {
					fileLength: Long.fromNumber(1, true)
				}
			}
		})

		const json = message.toJSON()
		expect(json.messageTimestamp).toBe('0')
		expect(json.message?.imageMessage?.fileLength).toBe('1')
	})

	it('roundtrips encode/decode with Long fields preserving values', () => {
		const original = proto.WebMessageInfo.fromObject({
			key: {
				remoteJid: '123@s.whatsapp.net',
				id: 'ABC123',
				fromMe: false
			},
			messageTimestamp: 1700000000,
			message: {
				imageMessage: {
					fileLength: 123456789
				}
			}
		})

		const encoded = proto.WebMessageInfo.encode(original).finish()
		const decoded = proto.WebMessageInfo.decode(encoded)
		const json = decoded.toJSON()

		expect(json.messageTimestamp).toBe('1700000000')
		expect(json.message?.imageMessage?.fileLength).toBe('123456789')
	})
})
