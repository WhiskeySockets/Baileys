import { jest } from '@jest/globals'
import { proto } from '../../../WAProto/index.js'
import type { BaileysEventMap, WAMessage } from '../../Types'
import { makeEventBuffer } from '../../Utils/event-buffer'
import { fixture, JID, ME, silentLogger } from './receipt-fixtures'

beforeEach(() => jest.useFakeTimers())
afterEach(() => {
	jest.clearAllTimers()
	jest.useRealTimers()
})

describe('direct receipt timestamps', () => {
	it.each([
		['read-self', false, 'readTimestamp'],
		['read', true, 'readTimestamp'],
		[undefined, true, 'receiptTimestamp'],
		['played', true, 'playedTimestamp']
	] as const)('%s keeps receipt time separate from message time, fromMe=%s', async (type, fromMe, timestampField) => {
		const f = fixture()
		try {
			await f.receive({
				tag: 'receipt',
				attrs: {
					from: fromMe ? JID : ME.id,
					...(fromMe ? {} : { recipient: JID }),
					id: 'fictional-message',
					t: '1700000050',
					...(type ? { type } : {})
				}
			})
			const updates = f.batches.flatMap(batch => batch['messages.update'] ?? [])
			const receipts = f.batches.flatMap(batch => batch['message-receipt.update'] ?? [])
			expect(updates).toHaveLength(1)
			expect(updates[0]!.update.messageTimestamp).toBeUndefined()
			expect(receipts).toEqual([
				{ key: updates[0]!.key, receipt: { userJid: fromMe ? JID : ME.id, [timestampField]: 1700000050 } }
			])
			expect(f.batches.flatMap(batch => batch['chats.update'] ?? [])).toEqual([])
			expect(f.sent.at(-1)?.tag).toBe('ack')
			for (const order of ['upsert-first', 'receipt-first', 'separate-flushes'] as const) {
				const ev = makeEventBuffer(silentLogger)
				const messages: WAMessage[] = []
				const changes: BaileysEventMap['messages.update'] = []
				ev.on('messages.upsert', batch => messages.push(...batch.messages))
				ev.on('messages.update', batch => changes.push(...batch))
				const message = { key: updates[0]!.key, messageTimestamp: 1700000000, message: { conversation: 'Fictional' } }
				const upsert = () => ev.emit('messages.upsert', { messages: [structuredClone(message)], type: 'notify' })
				const receipt = () => ev.emit('messages.update', structuredClone(updates))
				ev.buffer()
				if (order === 'receipt-first') {
					receipt()
					upsert()
				} else {
					upsert()
					if (order === 'separate-flushes') ev.flush()
					receipt()
				}

				ev.flush()
				expect(messages[0]!.messageTimestamp).toBe(1700000000)
				expect(changes.every(change => change.update.messageTimestamp === undefined)).toBe(true)
				ev.destroy()
			}
		} finally {
			f.close()
		}
	})

	it.each(['', 'NaN', '-1', '0', '1.5'])('does not manufacture a receipt timestamp from %j', async t => {
		const f = fixture()
		try {
			await f.receive({
				tag: 'receipt',
				attrs: { from: ME.id, recipient: JID, id: 'fictional-message', type: 'read-self', t }
			})
			expect(f.batches.flatMap(batch => batch['message-receipt.update'] ?? [])).toEqual([])
			expect(f.batches.flatMap(batch => batch['messages.update'] ?? [])[0]!.update).toEqual({
				status: proto.WebMessageInfo.Status.READ
			})
		} finally {
			f.close()
		}
	})

	it.each([
		['broadcast list', '120363000000000001@broadcast', undefined, JID],
		['broadcast list without participant', '120363000000000001@broadcast', undefined, undefined],
		['own-device broadcast list', ME.id, '120363000000000001@broadcast', undefined]
	] as const)(
		'%s does not create a user receipt for the broadcast address',
		async (_, from, recipient, participant) => {
			const f = fixture()
			try {
				await f.receive({
					tag: 'receipt',
					attrs: {
						from,
						...(recipient ? { recipient } : {}),
						...(participant ? { participant } : {}),
						id: 'fictional-broadcast-message',
						type: 'read',
						t: '1700000050'
					}
				})
				expect(f.batches.flatMap(batch => batch['message-receipt.update'] ?? [])).toEqual([])
				expect(f.batches.flatMap(batch => batch['messages.update'] ?? [])).toEqual([
					{
						key: {
							remoteJid: recipient ?? from,
							id: 'fictional-broadcast-message',
							fromMe: !recipient,
							participant
						},
						update: { status: proto.WebMessageInfo.Status.READ }
					}
				])
				expect(f.sent.at(-1)?.tag).toBe('ack')
			} finally {
				f.close()
			}
		}
	)

	it.each(['120363000000000001@g.us', 'status@broadcast'])(
		'%s keeps the participant receipt projection',
		async from => {
			const f = fixture()
			try {
				await f.receive({
					tag: 'receipt',
					attrs: { from, participant: JID, id: 'fictional-group-message', type: 'read', t: '1700000050' }
				})
				expect(f.batches.flatMap(batch => batch['messages.update'] ?? [])).toEqual([])
				expect(f.batches.flatMap(batch => batch['message-receipt.update'] ?? [])).toEqual([
					{
						key: { remoteJid: from, id: 'fictional-group-message', fromMe: true, participant: JID },
						receipt: { userJid: JID, readTimestamp: 1700000050 }
					}
				])
				expect(f.sent.at(-1)?.tag).toBe('ack')
			} finally {
				f.close()
			}
		}
	)
})
