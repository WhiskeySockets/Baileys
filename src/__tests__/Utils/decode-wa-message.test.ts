import { Boom } from '@hapi/boom'
import { proto } from '../../../WAProto/index.js'
import type { SignalRepositoryWithLIDStore } from '../../Types/Signal'
import { decodeMessageNode, decryptMessageNode } from '../../Utils/decode-wa-message'
import type { ILogger } from '../../Utils/logger'
import type { BinaryNode } from '../../WABinary'

const ME_ID = '5511999999999@s.whatsapp.net'
const ME_LID = '111111111111111@lid'
const PEER_ID = '5511888888888@s.whatsapp.net'
const GROUP_ID = '120363000000000000@g.us'

const message = (attrs: Record<string, string>): BinaryNode => ({
	tag: 'message',
	attrs: { t: '1700000000', ...attrs },
	content: []
})

const plaintextMessage = (content: proto.IMessage): BinaryNode => ({
	...message({ id: 'PLAINTEXT_MESSAGE', from: PEER_ID }),
	content: [
		{
			tag: 'plaintext',
			attrs: {},
			content: proto.Message.encode(proto.Message.create(content)).finish()
		}
	]
})

const repository = {
	lidMapping: {
		getLIDForPN: async () => null
	}
} as unknown as SignalRepositoryWithLIDStore

const logger = {
	error: () => undefined
} as unknown as ILogger

const captureThrow = (fn: () => unknown): unknown => {
	try {
		fn()
	} catch (err) {
		return err
	}

	throw new Error('expected function to throw')
}

describe('decodeMessageNode', () => {
	describe('validation', () => {
		it('throws Boom when stanza has no id attribute', () => {
			const stanza = message({ from: PEER_ID })
			const err = captureThrow(() => decodeMessageNode(stanza, ME_ID, ME_LID))
			expect(err).toBeInstanceOf(Boom)
			expect((err as Error).message).toMatch(/missing id/)
		})

		it('throws Boom when stanza has no from attribute', () => {
			const stanza = message({ id: 'MSG_1' })
			const err = captureThrow(() => decodeMessageNode(stanza, ME_ID, ME_LID))
			expect(err).toBeInstanceOf(Boom)
			expect((err as Error).message).toMatch(/missing from/)
		})

		it('throws Boom for an unknown jid type', () => {
			const stanza = message({ id: 'MSG_1', from: 'unknown@server' })
			expect(() => decodeMessageNode(stanza, ME_ID, ME_LID)).toThrow(/Unknown message type/)
		})

		it('throws Boom for group message without participant', () => {
			const stanza = message({ id: 'MSG_1', from: GROUP_ID })
			expect(() => decodeMessageNode(stanza, ME_ID, ME_LID)).toThrow(/No participant/)
		})
	})

	describe('happy paths', () => {
		it('decodes a 1:1 incoming chat message', () => {
			const stanza = message({ id: 'MSG_1', from: PEER_ID })
			const result = decodeMessageNode(stanza, ME_ID, ME_LID)

			expect(result.fullMessage.key.id).toBe('MSG_1')
			expect(result.fullMessage.key.remoteJid).toBe(PEER_ID)
			expect(result.fullMessage.key.fromMe).toBeFalsy()
			expect(result.author).toBe(PEER_ID)
		})

		it('decodes an outgoing chat message (recipient set, from = me)', () => {
			const stanza = message({ id: 'MSG_2', from: ME_ID, recipient: PEER_ID })
			const result = decodeMessageNode(stanza, ME_ID, ME_LID)

			expect(result.fullMessage.key.fromMe).toBe(true)
			expect(result.fullMessage.key.remoteJid).toBe(PEER_ID)
		})

		it('rejects a recipient-tagged message that is not from me', () => {
			const stanza = message({ id: 'MSG_3', from: PEER_ID, recipient: ME_ID })
			expect(() => decodeMessageNode(stanza, ME_ID, ME_LID)).toThrow(/not from me/)
		})

		it('decodes a group message', () => {
			const stanza = message({ id: 'MSG_G', from: GROUP_ID, participant: PEER_ID })
			const result = decodeMessageNode(stanza, ME_ID, ME_LID)

			expect(result.fullMessage.key.remoteJid).toBe(GROUP_ID)
			expect(result.fullMessage.key.participant).toBe(PEER_ID)
			expect(result.author).toBe(PEER_ID)
		})
	})
})

describe('decryptMessageNode', () => {
	it('preserves an outer message secret when unwrapping a device-sent message', async () => {
		const messageSecret = Buffer.alloc(32, 7)
		const result = decryptMessageNode(
			plaintextMessage({
				deviceSentMessage: {
					message: { conversation: 'linked-device message' }
				},
				messageContextInfo: { messageSecret }
			}),
			ME_ID,
			ME_LID,
			repository,
			logger
		)

		await result.decrypt()

		expect(result.fullMessage.message?.conversation).toBe('linked-device message')
		expect(result.fullMessage.message?.messageContextInfo?.messageSecret).toEqual(messageSecret)
		expect(result.fullMessage.message?.deviceSentMessage).toBeUndefined()
	})

	it('merges an outer message secret with inner message context fields', async () => {
		const messageSecret = Buffer.alloc(32, 7)
		const result = decryptMessageNode(
			plaintextMessage({
				deviceSentMessage: {
					message: {
						conversation: 'linked-device message',
						messageContextInfo: { messageAddOnDurationInSecs: 900 }
					}
				},
				messageContextInfo: { messageSecret }
			}),
			ME_ID,
			ME_LID,
			repository,
			logger
		)

		await result.decrypt()

		expect(result.fullMessage.message?.messageContextInfo?.messageSecret).toEqual(messageSecret)
		expect(result.fullMessage.message?.messageContextInfo?.messageAddOnDurationInSecs).toBe(900)
	})

	it('prefers inner fields when both device-sent layers provide message context', async () => {
		const outerSecret = Buffer.alloc(32, 7)
		const innerSecret = Buffer.alloc(32, 9)
		const result = decryptMessageNode(
			plaintextMessage({
				deviceSentMessage: {
					message: {
						conversation: 'linked-device message',
						messageContextInfo: { messageSecret: innerSecret }
					}
				},
				messageContextInfo: { messageSecret: outerSecret }
			}),
			ME_ID,
			ME_LID,
			repository,
			logger
		)

		await result.decrypt()

		expect(result.fullMessage.message?.messageContextInfo?.messageSecret).toEqual(innerSecret)
	})

	it('leaves messages without a device-sent wrapper unchanged', async () => {
		const messageSecret = Buffer.alloc(32, 5)
		const originalMessage = {
			conversation: 'ordinary message',
			messageContextInfo: { messageSecret }
		}
		const decodedMessage = proto.Message.decode(proto.Message.encode(proto.Message.create(originalMessage)).finish())
		const result = decryptMessageNode(plaintextMessage(originalMessage), ME_ID, ME_LID, repository, logger)

		await result.decrypt()

		expect(result.fullMessage.message).toEqual(decodedMessage)
	})
})
