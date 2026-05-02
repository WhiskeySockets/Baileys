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
})

describe('longToString / longToNumber via proto field serialization (PR changes)', () => {
	// These tests verify the behavior of longToString and longToNumber after the PR's
	// refactor from BigInt fast-path to $util.Long.fromValue() approach.

	it('should serialize a number long field to string in toJSON()', () => {
		const message = proto.WebMessageInfo.fromObject({
			key: { remoteJid: '1@s.whatsapp.net', id: 'X', fromMe: false },
			messageTimestamp: 1700000000
		})
		const json = message.toJSON()
		// messageTimestamp is a long field; toJSON should produce a string
		expect(typeof json.messageTimestamp).toBe('string')
		expect(json.messageTimestamp).toBe('1700000000')
	})

	it('should round-trip numeric fileLength through fromObject and toJSON', () => {
		const message = proto.WebMessageInfo.fromObject({
			key: { remoteJid: '1@s.whatsapp.net', id: 'X', fromMe: false },
			messageTimestamp: 1,
			message: { imageMessage: { fileLength: 123456 } }
		})
		const json = message.toJSON()
		expect(json.message?.imageMessage?.fileLength).toBe('123456')
	})

	it('should handle zero value for long fields', () => {
		const message = proto.WebMessageInfo.fromObject({
			key: { remoteJid: '1@s.whatsapp.net', id: 'X', fromMe: false },
			messageTimestamp: 0
		})
		const json = message.toJSON()
		expect(json.messageTimestamp).toBe('0')
	})

	it('should handle large timestamp values without throwing (Long object path)', () => {
		// This tests the $util.Long.fromValue() path instead of BigInt fast path
		const message = proto.WebMessageInfo.fromObject({
			key: { remoteJid: '1@s.whatsapp.net', id: 'X', fromMe: false },
			messageTimestamp: 9007199254740991 // MAX_SAFE_INTEGER
		})
		expect(() => message.toJSON()).not.toThrow()
		const json = message.toJSON()
		expect(json.messageTimestamp).toBe('9007199254740991')
	})

	it('should decode a message with numeric timestamp correctly', () => {
		// Tests the longToNumber path (decode side)
		const encoded = proto.WebMessageInfo.encode(
			proto.WebMessageInfo.fromObject({
				key: { remoteJid: '1@s.whatsapp.net', id: 'X', fromMe: false },
				messageTimestamp: 1700000000
			})
		).finish()

		const decoded = proto.WebMessageInfo.decode(encoded)
		// toNumber() should return the numeric value
		const ts = decoded.messageTimestamp
		const tsNum = typeof ts === 'object' && ts !== null && 'toNumber' in ts ? (ts as any).toNumber() : Number(ts)
		expect(tsNum).toBe(1700000000)
	})

	it('should not throw when serializing a message with undefined long fields', () => {
		const message = proto.WebMessageInfo.fromObject({
			key: { remoteJid: '1@s.whatsapp.net', id: 'X', fromMe: false },
			messageTimestamp: 1
		})
		expect(() => JSON.stringify(message.toJSON())).not.toThrow()
	})
})
