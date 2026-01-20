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
