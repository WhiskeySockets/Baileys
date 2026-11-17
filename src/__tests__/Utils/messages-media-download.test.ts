import { jest } from '@jest/globals'
import { randomBytes } from 'crypto'
import { downloadContentFromMessage } from '../../Utils/messages-media'

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
