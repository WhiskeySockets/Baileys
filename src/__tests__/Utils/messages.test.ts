import { describe, expect, it } from '@jest/globals'
import { jest } from '@jest/globals'
import { generateWAMessageContent } from '../../Utils/messages'

describe('generateWAMessageContent — messageSecret option', () => {
	const knownSecret = new Uint8Array(32).fill(0xab)

	// Stub upload that returns the minimal shape prepareWAMessageMedia expects
	const makeUploadStub = () =>
		jest.fn().mockResolvedValue({
			mediaUrl: 'https://example.com/uploaded',
			directPath: '/v/t62.7117-24/x',
		}) as any

	it('text: round-trips supplied messageSecret on extendedTextMessage', async () => {
		const m: any = await generateWAMessageContent(
			{ text: 'hello' },
			{ userJid: 'me@s.whatsapp.net', messageSecret: knownSecret } as any,
		)
		expect(m.messageContextInfo?.messageSecret).toBeDefined()
		expect(Buffer.from(m.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))
	})

	it('image: round-trips on imageMessage', async () => {
		// Pass media as a Buffer to avoid network I/O inside encryptedStream
		const m: any = await generateWAMessageContent(
			{ image: Buffer.alloc(16), caption: 'cap' } as any,
			{ userJid: 'me@s.whatsapp.net', messageSecret: knownSecret, upload: makeUploadStub() } as any,
		)
		expect(Buffer.from(m.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))
	})

	it('video: round-trips on videoMessage', async () => {
		const m: any = await generateWAMessageContent(
			{ video: Buffer.alloc(16) } as any,
			{ userJid: 'me@s.whatsapp.net', messageSecret: knownSecret, upload: makeUploadStub() } as any,
		)
		expect(Buffer.from(m.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))
	})

	it('audio: round-trips on audioMessage', async () => {
		const m: any = await generateWAMessageContent(
			{ audio: Buffer.alloc(16), mimetype: 'audio/ogg' } as any,
			{ userJid: 'me@s.whatsapp.net', messageSecret: knownSecret, upload: makeUploadStub() } as any,
		)
		expect(Buffer.from(m.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))
	})

	it('document: round-trips on documentMessage', async () => {
		const m: any = await generateWAMessageContent(
			{ document: Buffer.alloc(16), mimetype: 'application/pdf' } as any,
			{ userJid: 'me@s.whatsapp.net', messageSecret: knownSecret, upload: makeUploadStub() } as any,
		)
		expect(Buffer.from(m.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))
	})

	it('sticker: round-trips on stickerMessage', async () => {
		const m: any = await generateWAMessageContent(
			{ sticker: Buffer.alloc(16) } as any,
			{ userJid: 'me@s.whatsapp.net', messageSecret: knownSecret, upload: makeUploadStub() } as any,
		)
		expect(Buffer.from(m.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))
	})

	it('option absent: still generates 32 random bytes (existing behavior preserved)', async () => {
		const m: any = await generateWAMessageContent(
			{ text: 'no secret here' },
			{ userJid: 'me@s.whatsapp.net' } as any,
		)
		expect(m.messageContextInfo?.messageSecret).toBeDefined()
		expect(m.messageContextInfo.messageSecret.length).toBe(32)
		// Sanity: not all zeros (would imply we set something we shouldn't have).
		const isAllZero = Buffer.from(m.messageContextInfo.messageSecret).every(b => b === 0)
		expect(isAllZero).toBe(false)
	})

	it('conflict: poll messageSecret wins over option', async () => {
		const optionSecret = new Uint8Array(32).fill(0xAB)
		const pollSecret = new Uint8Array(32).fill(0xCD)
		const m: any = await generateWAMessageContent({
			poll: {
				name: 'q?',
				values: ['a', 'b'],
				selectableCount: 1,
				messageSecret: pollSecret,
			},
		} as any, { userJid: 'me@s.whatsapp.net', messageSecret: optionSecret } as any)
		// Poll's own slot is set BEFORE our option-handler runs, and our handler
		// gates on `!m.messageContextInfo?.messageSecret`, so poll's bytes survive.
		expect(Buffer.from(m.messageContextInfo.messageSecret)).toEqual(Buffer.from(pollSecret))
	})

	it('conflict: option falls through when poll does NOT supply its own secret (poll fallback random shadows option)', async () => {
		const optionSecret = new Uint8Array(32).fill(0xAB)
		const m: any = await generateWAMessageContent({
			poll: {
				name: 'q?',
				values: ['a', 'b'],
				selectableCount: 1,
				// no messageSecret here
			},
		} as any, { userJid: 'me@s.whatsapp.net', messageSecret: optionSecret } as any)
		// Poll's branch generates randomBytes(32) for its own slot today; our
		// option-handler only fills in when no secret exists. So poll's random
		// bytes win and the option is shadowed. This test documents the
		// behavior so a future contributor doesn't silently invert it.
		expect(m.messageContextInfo?.messageSecret).toBeDefined()
		expect(m.messageContextInfo.messageSecret.length).toBe(32)
		expect(Buffer.from(m.messageContextInfo.messageSecret)).not.toEqual(Buffer.from(optionSecret))
	})
})
