import { proto } from '../../../WAProto/index.js'
import { WAProto } from '../../Types'
import { extractMessageContent, normalizeMessageContent } from '../../Utils/messages'

describe('Lottie sticker message support', () => {
	const innerSticker: proto.Message.IStickerMessage = {
		url: 'https://mmg.whatsapp.net/o1/v/example',
		directPath: '/o1/v/example',
		mediaKey: Buffer.from('a'.repeat(32)),
		fileSha256: Buffer.from('b'.repeat(32)),
		fileEncSha256: Buffer.from('c'.repeat(32)),
		fileLength: 19805,
		mimetype: 'application/was',
		width: 64,
		height: 64,
		isAnimated: true,
		isLottie: true
	}

	describe('normalizeMessageContent', () => {
		it('unwraps lottieStickerMessage to its inner stickerMessage', () => {
			const wrapped: proto.IMessage = {
				lottieStickerMessage: {
					message: { stickerMessage: innerSticker }
				}
			}

			const result = normalizeMessageContent(wrapped)

			expect(result).toBeDefined()
			expect(result?.stickerMessage).toBeDefined()
			expect(result?.stickerMessage?.isLottie).toBe(true)
			expect(result?.stickerMessage?.mimetype).toBe('application/was')
			expect(result?.lottieStickerMessage).toBeUndefined()
		})

		it('returns the original message untouched when there is no Lottie wrapper', () => {
			const plain: proto.IMessage = { stickerMessage: innerSticker }
			const result = normalizeMessageContent(plain)
			expect(result).toBe(plain)
		})
	})

	describe('extractMessageContent', () => {
		it('reaches the inner stickerMessage through a lottieStickerMessage wrapper', () => {
			const wrapped: proto.IMessage = {
				lottieStickerMessage: {
					message: { stickerMessage: innerSticker }
				}
			}

			const content = extractMessageContent(wrapped)
			expect(content?.stickerMessage?.url).toBe(innerSticker.url)
			expect(content?.stickerMessage?.isLottie).toBe(true)
		})
	})

	describe('proto round-trip', () => {
		it('encodes and decodes a lottieStickerMessage without losing the inner sticker', () => {
			const msg = WAProto.Message.create({
				lottieStickerMessage: {
					message: { stickerMessage: innerSticker }
				}
			})

			const encoded = WAProto.Message.encode(msg).finish()
			const decoded = WAProto.Message.decode(encoded)

			expect(decoded.lottieStickerMessage?.message?.stickerMessage?.mimetype).toBe('application/was')
			expect(decoded.lottieStickerMessage?.message?.stickerMessage?.isLottie).toBe(true)
		})
	})
})
