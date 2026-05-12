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
})
