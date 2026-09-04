import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { proto, type WAMessage, type WAMessageUpdate } from '../../src'
import {
	extractEditedText,
	extractText,
	findOriginalMessage,
	hasUsableMessageSecret,
	OriginalMessageLookup
} from './message-edit-helpers'

const originalText = '[EDIT-SMOKE-ABC123] before'
const originalId = 'ORIGINAL-MESSAGE-ID'
const originalMessage = (overrides: Partial<WAMessage> = {}): WAMessage =>
	({
		key: {
			id: originalId,
			remoteJid: '111111111111@s.whatsapp.net',
			fromMe: false
		},
		message: {
			conversation: originalText,
			messageContextInfo: { messageSecret: Buffer.alloc(32, 7) }
		},
		...overrides
	}) as WAMessage

describe('message edit live-smoke helpers', () => {
	it('extracts text through supported wrappers', () => {
		assert.equal(extractText({ conversation: 'plain' }), 'plain')
		assert.equal(
			extractText({
				ephemeralMessage: {
					message: { extendedTextMessage: { text: 'wrapped' } }
				}
			}),
			'wrapped'
		)
		assert.equal(
			extractText({
				associatedChildMessage: {
					message: { conversation: 'shared helper wrapper' }
				}
			}),
			'shared helper wrapper'
		)
	})

	it('selects the expected incoming direct message', () => {
		assert.equal(
			findOriginalMessage({ type: 'notify', messages: [originalMessage()] }, originalText)?.key.id,
			originalId
		)
	})

	it('selects the expected incoming group message', () => {
		const groupMessage = originalMessage({
			key: {
				id: originalId,
				remoteJid: '111111111111@g.us',
				participant: '222222222222@s.whatsapp.net',
				fromMe: false
			}
		})

		assert.equal(findOriginalMessage({ type: 'notify', messages: [groupMessage] }, originalText), groupMessage)
	})

	it('ignores history, outgoing messages, broadcasts, newsletters, and different text', () => {
		assert.equal(findOriginalMessage({ type: 'append', messages: [originalMessage()] }, originalText), undefined)
		assert.equal(
			findOriginalMessage(
				{
					type: 'notify',
					messages: [
						originalMessage({
							key: { id: originalId, remoteJid: '111111111111@s.whatsapp.net', fromMe: true }
						})
					]
				},
				originalText
			),
			undefined
		)
		assert.equal(
			findOriginalMessage(
				{
					type: 'notify',
					messages: [
						originalMessage({
							key: { id: originalId, remoteJid: 'status@broadcast', fromMe: false }
						}),
						originalMessage({
							key: { id: originalId, remoteJid: '111111111111@newsletter', fromMe: false }
						})
					]
				},
				originalText
			),
			undefined
		)
		assert.equal(findOriginalMessage({ type: 'notify', messages: [originalMessage()] }, 'different'), undefined)
	})

	it('requires a 32-byte original message secret', () => {
		assert.equal(hasUsableMessageSecret(originalMessage()), true)
		assert.equal(
			hasUsableMessageSecret(
				originalMessage({
					message: {
						conversation: originalText,
						messageContextInfo: { messageSecret: Buffer.alloc(16) }
					}
				})
			),
			false
		)
	})

	it('extracts readable edit text only for the original message id', () => {
		const update: WAMessageUpdate = {
			key: { id: originalId, remoteJid: '111111111111@s.whatsapp.net', fromMe: false },
			update: {
				message: {
					editedMessage: {
						message: { conversation: '[EDIT-SMOKE-ABC123] after' }
					}
				}
			}
		}

		assert.equal(extractEditedText(update, originalId), '[EDIT-SMOKE-ABC123] after')
		assert.equal(extractEditedText(update, 'OTHER-ID'), undefined)
	})

	it('returns the recorded original only for a matching getMessage key', async () => {
		const lookup = new OriginalMessageLookup()
		const original = originalMessage({
			key: {
				id: originalId,
				remoteJid: '111111111111@g.us',
				participant: '222222222222@s.whatsapp.net',
				fromMe: false
			}
		})
		lookup.record(original)

		assert.equal(await lookup.getMessage({ id: 'OTHER-ID' }), undefined)
		assert.equal(
			await lookup.getMessage({
				id: originalId,
				remoteJid: '111111111111@g.us',
				participant: '222222222222@s.whatsapp.net',
				fromMe: false
			}),
			original.message
		)
		assert.equal(lookup.matchingLookupCount, 1)
	})

	it('accepts protobuf-created messages', () => {
		const message = originalMessage({
			message: proto.Message.create({
				extendedTextMessage: { text: originalText },
				messageContextInfo: { messageSecret: Buffer.alloc(32, 9) }
			})
		})

		assert.equal(extractText(message.message), originalText)
		assert.equal(hasUsableMessageSecret(message), true)
	})
})
