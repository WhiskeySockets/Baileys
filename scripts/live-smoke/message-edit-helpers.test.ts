import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { proto, type WAMessage, type WAMessageKey, type WAMessageUpdate } from '../../src'
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

	it('rejects the same id from a different conversation or direction', async () => {
		const lookup = new OriginalMessageLookup()
		const original = originalMessage()
		lookup.record(original)
		const mismatchedKeys: WAMessageKey[] = [
			{ ...original.key, remoteJid: '222222222222@s.whatsapp.net' },
			{ ...original.key, remoteJid: '111111111111@lid' },
			{ ...original.key, fromMe: true },
			{ ...original.key, fromMe: undefined },
			{ ...original.key, remoteJid: undefined },
			{ ...original.key, id: undefined },
			{ id: originalId }
		]

		for (const key of mismatchedKeys) {
			assert.equal(await lookup.getMessage(key), undefined)
		}
		assert.equal(lookup.matchingLookupCount, 0)
	})

	it('accepts device-normalized addressing and recorded PN/LID aliases', async () => {
		for (const [remoteJid, remoteJidAlt] of [
			['111111111111@s.whatsapp.net', '222222222222@lid'],
			['222222222222@lid', '111111111111@s.whatsapp.net']
		] as const) {
			const lookup = new OriginalMessageLookup()
			const original = originalMessage({ key: { id: originalId, remoteJid, remoteJidAlt, fromMe: false } })
			lookup.record(original)

			assert.equal(await lookup.getMessage({ ...original.key, remoteJid: remoteJidAlt }), original.message)
			assert.equal(lookup.matchingLookupCount, 1)
		}

		const lookup = new OriginalMessageLookup()
		const original = originalMessage()
		lookup.record(original)
		assert.equal(
			await lookup.getMessage({ ...original.key, remoteJid: '111111111111:42@s.whatsapp.net' }),
			original.message
		)
	})

	it('does not authorize a different conversation through a requested alias', async () => {
		const lookup = new OriginalMessageLookup()
		const original = originalMessage()
		lookup.record(original)

		assert.equal(
			await lookup.getMessage({
				...original.key,
				remoteJid: '222222222222@lid',
				remoteJidAlt: original.key.remoteJid ?? undefined
			}),
			undefined
		)
		assert.equal(lookup.matchingLookupCount, 0)
	})

	it('requires the recorded group sender and accepts its recorded alias', async () => {
		const lookup = new OriginalMessageLookup()
		const original = originalMessage({
			key: {
				id: originalId,
				remoteJid: '111111111111@g.us',
				participant: '222222222222@s.whatsapp.net',
				participantAlt: '333333333333@lid',
				fromMe: false
			}
		})
		lookup.record(original)

		assert.equal(await lookup.getMessage({ ...original.key, participant: '444444444444@s.whatsapp.net' }), undefined)
		assert.equal(await lookup.getMessage({ ...original.key, participant: undefined }), undefined)
		assert.equal(await lookup.getMessage({ ...original.key, participant: '333333333333:42@lid' }), original.message)
		assert.equal(lookup.matchingLookupCount, 1)
	})

	it('keeps the recorded key independent of later caller mutations', async () => {
		const lookup = new OriginalMessageLookup()
		const original = originalMessage()
		const recordedKey = { ...original.key }
		lookup.record(original)
		original.key.remoteJid = '222222222222@s.whatsapp.net'
		original.key.fromMe = true

		assert.equal(await lookup.getMessage(original.key), undefined)
		assert.equal(await lookup.getMessage(recordedKey), original.message)
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
