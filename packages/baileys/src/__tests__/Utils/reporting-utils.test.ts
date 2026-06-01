import { randomBytes } from 'crypto'
import { proto } from '../../../WAProto'
import type { WAMessageKey } from '../../Types'
import { getMessageReportingToken, shouldIncludeReportingToken } from '../../Utils/reporting-utils'
import type { BinaryNode } from '../../WABinary'

describe('Reporting Utils', () => {
	describe('shouldIncludeReportingToken', () => {
		const includedMessages: [string, proto.IMessage][] = [
			['conversation', { conversation: 'Hello' }],
			['extendedTextMessage', { extendedTextMessage: { text: 'Link' } }],
			['imageMessage', { imageMessage: { url: 'url', mimetype: 'image/jpeg' } }],
			['videoMessage', { videoMessage: { url: 'url', mimetype: 'video/mp4' } }],
			['documentMessage', { documentMessage: { url: 'url', mimetype: 'application/pdf' } }],
			['audioMessage', { audioMessage: { url: 'url', mimetype: 'audio/ogg' } }],
			['stickerMessage', { stickerMessage: { url: 'url', mimetype: 'image/webp' } }]
		]

		const excludedMessages: [string, proto.IMessage][] = [
			['reactionMessage', { reactionMessage: { key: { id: 'id' }, text: '👍' } }],
			[
				'encReactionMessage',
				{
					encReactionMessage: { targetMessageKey: { id: 'id' }, encPayload: Buffer.from('x'), encIv: Buffer.from('x') }
				}
			],
			[
				'pollUpdateMessage',
				{
					pollUpdateMessage: {
						pollCreationMessageKey: { id: 'id' },
						vote: { encPayload: Buffer.from('x'), encIv: Buffer.from('x') }
					}
				}
			],
			[
				'encEventResponseMessage',
				{
					encEventResponseMessage: {
						eventCreationMessageKey: { id: 'id' },
						encPayload: Buffer.from('x'),
						encIv: Buffer.from('x')
					}
				}
			]
		]

		it.each(includedMessages)('should return true for %s', (_, message) => {
			expect(shouldIncludeReportingToken(message)).toBe(true)
		})

		it.each(excludedMessages)('should return false for %s', (_, message) => {
			expect(shouldIncludeReportingToken(message)).toBe(false)
		})
	})

	describe('getMessageReportingToken', () => {
		const createKey = (overrides?: Partial<WAMessageKey>): WAMessageKey => ({
			id: 'test-id',
			fromMe: true,
			remoteJid: '123@s.whatsapp.net',
			...overrides
		})

		const withSecret = (content: proto.IMessage, secret = randomBytes(32)): proto.IMessage => ({
			...content,
			messageContextInfo: { messageSecret: secret }
		})

		const encode = (msg: proto.IMessage) => Buffer.from(proto.Message.encode(msg).finish())
		const getToken = (result: BinaryNode | null): Buffer | undefined => {
			const content = result?.content
			if (Array.isArray(content) && content[0]) {
				return content[0].content as Buffer | undefined
			}

			return undefined
		}

		it('should return null when message secret is missing', async () => {
			const msg: proto.IMessage = { conversation: 'Hello' }
			expect(await getMessageReportingToken(encode(msg), msg, createKey())).toBeNull()
		})

		it('should return null when message key id is missing', async () => {
			const msg = withSecret({ conversation: 'Hello' })
			expect(await getMessageReportingToken(encode(msg), msg, createKey({ id: '' }))).toBeNull()
		})

		it('should return valid reporting node structure', async () => {
			const msg = withSecret({ conversation: 'Hello' })
			const result = await getMessageReportingToken(encode(msg), msg, createKey())

			expect(result).toMatchObject({ tag: 'reporting', attrs: {} })
			const content = result?.content as any[]
			expect(content).toHaveLength(1)
			expect(content[0]).toMatchObject({ tag: 'reporting_token', attrs: { v: '2' } })
			expect(content[0].content).toHaveLength(16)
		})

		it('should produce consistent tokens for the same input', async () => {
			const secret = randomBytes(32)
			const msg = withSecret({ conversation: 'Test' }, secret)
			const encoded = encode(msg)
			const key = createKey()

			const token1 = getToken(await getMessageReportingToken(encoded, msg, key))
			const token2 = getToken(await getMessageReportingToken(encoded, msg, key))
			expect(token1).toEqual(token2)
		})

		const uniquenessTests: [string, () => [proto.IMessage, WAMessageKey, proto.IMessage, WAMessageKey]][] = [
			[
				'different secrets',
				() => {
					const msg1 = withSecret({ conversation: 'Same' }, randomBytes(32))
					const msg2 = withSecret({ conversation: 'Same' }, randomBytes(32))
					return [msg1, createKey(), msg2, createKey()]
				}
			],
			[
				'different message IDs',
				() => {
					const secret = randomBytes(32)
					const msg = withSecret({ conversation: 'Same' }, secret)
					return [msg, createKey({ id: 'id-1' }), msg, createKey({ id: 'id-2' })]
				}
			],
			[
				'different remoteJids',
				() => {
					const secret = randomBytes(32)
					const msg = withSecret({ conversation: 'Same' }, secret)
					return [
						msg,
						createKey({ remoteJid: '111@s.whatsapp.net' }),
						msg,
						createKey({ remoteJid: '222@s.whatsapp.net' })
					]
				}
			]
		]

		it.each(uniquenessTests)('should produce different tokens for %s', async (_, setup) => {
			const [msg1, key1, msg2, key2] = setup()
			const token1 = getToken(await getMessageReportingToken(encode(msg1), msg1, key1))
			const token2 = getToken(await getMessageReportingToken(encode(msg2), msg2, key2))
			expect(token1).not.toEqual(token2)
		})

		it.each([
			['group messages', { remoteJid: '123@g.us', participant: '456@s.whatsapp.net' }],
			['incoming messages', { fromMe: false }]
		])('should handle %s', async (_, keyOverrides) => {
			const msg = withSecret({ conversation: 'Test' })
			const result = await getMessageReportingToken(encode(msg), msg, createKey(keyOverrides))
			expect(result?.tag).toBe('reporting')
		})
	})
})
