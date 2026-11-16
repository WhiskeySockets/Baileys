import { jest } from '@jest/globals'
import { randomBytes } from 'crypto'
import pino from 'pino'
import { downloadContentFromMessage } from '../../Utils/messages-media'
import { downloadMediaMessage } from '../../Utils/messages'
import type { WAMessage } from '../../Types'

const DIRECT_PATH = '/v/t62.15575-24/123_456_n.enc?ccb=11-4&oh=abc&oe=def&_nc_sid=5e03e0'

// stop at the request: we only care about which URL is fetched
const captureDownloadUrl = async (message: { url?: string; directPath?: string }) => {
	const fetchSpy = jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('stop'))
	try {
		await expect(downloadContentFromMessage({ mediaKey: randomBytes(32), ...message }, 'sticker')).rejects.toThrow(
			'stop'
		)
		return String(fetchSpy.mock.calls[0]?.[0])
	} finally {
		fetchSpy.mockRestore()
	}
}

describe('downloadContentFromMessage host', () => {
	it('uses the default media host when the url points to a.whatsapp.net', async () => {
		const url = await captureDownloadUrl({
			url: `https://a.whatsapp.net${DIRECT_PATH}&mms3=true`,
			directPath: DIRECT_PATH
		})

		expect(url).toBe(`https://mmg.whatsapp.net${DIRECT_PATH}`)
	})

	it('keeps a real media host carried by the url', async () => {
		const url = await captureDownloadUrl({
			url: `https://media-cdn-1.cdn.whatsapp.net${DIRECT_PATH}&mms3=true`,
			directPath: DIRECT_PATH
		})

		expect(url).toBe(`https://media-cdn-1.cdn.whatsapp.net${DIRECT_PATH}`)
	})

	it('uses the default media host when there is no url', async () => {
		const url = await captureDownloadUrl({ directPath: DIRECT_PATH })

		expect(url).toBe(`https://mmg.whatsapp.net${DIRECT_PATH}`)
	})
})

const makeImageMessage = (): WAMessage => ({
	key: { remoteJid: '123@s.whatsapp.net', id: 'TESTMSGID', fromMe: false },
	message: {
		imageMessage: {
			url: `https://mmg.whatsapp.net${DIRECT_PATH}`,
			directPath: DIRECT_PATH,
			mediaKey: randomBytes(32),
			mimetype: 'image/jpeg'
		}
	}
})

describe('downloadMediaMessage reupload on expired media', () => {
	it('requests a reupload when the media host answers 410', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 410 }))
		const reuploadRequest = jest.fn(async (msg: WAMessage) => msg)
		try {
			await expect(
				downloadMediaMessage(makeImageMessage(), 'buffer', {}, { reuploadRequest, logger: pino({ level: 'silent' }) })
			).rejects.toThrow('Failed to fetch stream')
			expect(reuploadRequest).toHaveBeenCalledTimes(1)
		} finally {
			fetchSpy.mockRestore()
		}
	})

	it('requests a reupload for plain errors carrying a numeric status', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockRejectedValue({ status: 410 })
		const reuploadRequest = jest.fn(async (msg: WAMessage) => msg)
		try {
			await expect(
				downloadMediaMessage(makeImageMessage(), 'buffer', {}, { reuploadRequest, logger: pino({ level: 'silent' }) })
			).rejects.toEqual({ status: 410 })
			expect(reuploadRequest).toHaveBeenCalledTimes(1)
		} finally {
			fetchSpy.mockRestore()
		}
	})

	it('does not request a reupload for other failures', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
		const reuploadRequest = jest.fn(async (msg: WAMessage) => msg)
		try {
			await expect(
				downloadMediaMessage(makeImageMessage(), 'buffer', {}, { reuploadRequest, logger: pino({ level: 'silent' }) })
			).rejects.toThrow('Failed to fetch stream')
			expect(reuploadRequest).not.toHaveBeenCalled()
		} finally {
			fetchSpy.mockRestore()
		}
	})
})
