import { jest } from '@jest/globals'
import { proto } from '../../../WAProto/index.js'
import { sha256 } from '../../Utils/crypto'
import { encryptPollVote, generateWAMessageContent } from '../../Utils/messages'
import { decryptPollVote } from '../../Utils/process-message'

const pollEncKey = new Uint8Array(32).fill(5)
const ctx = {
	pollCreatorJid: '222@lid',
	pollMsgId: '3EB0POLL',
	pollEncKey,
	voterJid: '111@lid'
}

describe('encryptPollVote', () => {
	it('is decrypted by decryptPollVote with the same poll context', () => {
		const vote = { selectedOptions: [sha256(Buffer.from('Yes')), sha256(Buffer.from('Maybe'))] }
		const encrypted = encryptPollVote(vote, ctx)
		expect(encrypted.encIv).toHaveLength(12)
		const decrypted = decryptPollVote(encrypted, ctx)
		expect(decrypted.selectedOptions.map(o => Buffer.from(o))).toEqual(vote.selectedOptions)
	})

	it('cannot be decrypted with the JIDs of another addressing mode', () => {
		const encrypted = encryptPollVote({ selectedOptions: [sha256(Buffer.from('Yes'))] }, ctx)
		expect(() => decryptPollVote(encrypted, { ...ctx, voterJid: '41700000000@s.whatsapp.net' })).toThrow()
		expect(() => decryptPollVote(encrypted, { ...ctx, pollCreatorJid: '41700000001@s.whatsapp.net' })).toThrow()
	})

	it('uses a new IV for every vote', () => {
		const vote = { selectedOptions: [] }
		expect(encryptPollVote(vote, ctx).encIv).not.toEqual(encryptPollVote(vote, ctx).encIv)
	})
})

describe('generateWAMessageContent with pollVote', () => {
	const upload = jest.fn<() => never>()
	const pollCreationMessageKey = { remoteJid: '222@lid', fromMe: false, id: '3EB0POLL' }

	it('builds an encrypted pollUpdateMessage', async () => {
		const message = await generateWAMessageContent(
			{
				pollVote: {
					pollCreationMessageKey,
					pollEncKey,
					selectedOptions: ['Yes'],
					pollCreatorJid: '222@lid',
					voterJid: '111@lid'
				}
			},
			{ upload }
		)
		const update = message.pollUpdateMessage!
		expect(update.pollCreationMessageKey).toEqual(pollCreationMessageKey)
		expect(update.metadata).toEqual({})
		expect(Number(update.senderTimestampMs)).toBeGreaterThan(0)
		const decrypted = decryptPollVote(update.vote!, ctx)
		expect(decrypted.selectedOptions.map(o => Buffer.from(o))).toEqual([sha256(Buffer.from('Yes'))])
		// the message encodes, as relayMessage will encode it
		expect(proto.Message.decode(proto.Message.encode(message).finish()).pollUpdateMessage).toBeTruthy()
		expect(upload).not.toHaveBeenCalled()
	})

	it('withdraws the vote with no selected options', async () => {
		const message = await generateWAMessageContent(
			{
				pollVote: {
					pollCreationMessageKey,
					pollEncKey,
					selectedOptions: [],
					pollCreatorJid: '222@lid',
					voterJid: '111@lid'
				}
			},
			{ upload }
		)
		expect(decryptPollVote(message.pollUpdateMessage!.vote!, ctx).selectedOptions).toEqual([])
	})

	it('requires the poll message id', async () => {
		await expect(
			generateWAMessageContent(
				{
					pollVote: {
						pollCreationMessageKey: { remoteJid: '222@lid', fromMe: false },
						pollEncKey,
						selectedOptions: ['Yes'],
						pollCreatorJid: '222@lid',
						voterJid: '111@lid'
					}
				},
				{ upload }
			)
		).rejects.toThrow('pollVote.pollCreationMessageKey must have an id')
	})
})
