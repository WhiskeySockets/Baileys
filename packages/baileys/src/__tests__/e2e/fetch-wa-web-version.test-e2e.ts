import { jest } from '@jest/globals'
import { fetchLatestWaWebVersion } from '../../Utils/generics'

describe('fetchLatestWaWebVersion Integration Tests', () => {
	jest.setTimeout(10000)

	it('should successfully fetch the latest WhatsApp Web version from real API', async () => {
		const result = await fetchLatestWaWebVersion()

		expect(Array.isArray(result.version)).toBe(true)
		expect(result.version).toHaveLength(3)
		expect(typeof result.version[0]).toBe('number')
		expect(typeof result.version[1]).toBe('number')
		expect(typeof result.version[2]).toBe('number')

		expect(typeof result.isLatest).toBe('boolean')

		if (!result.isLatest) {
			expect(result.error).toBeDefined()
		}
	})

	it('should handle custom headers correctly', async () => {
		const customHeaders = {
			accept:
				'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
			'accept-language': 'en-US,en;q=0.9',
			'cache-control': 'max-age=0',
			'sec-ch-prefers-color-scheme': 'dark',
			'sec-fetch-dest': 'document',
			'sec-fetch-mode': 'navigate',
			'sec-fetch-site': 'none',
			'upgrade-insecure-requests': '1'
		}

		const result = await fetchLatestWaWebVersion({
			headers: customHeaders
		})

		expect(Array.isArray(result.version)).toBe(true)
		expect(result.version).toHaveLength(3)
		expect(result.isLatest).toBe(true)
	})

	it('should fallback gracefully when client_revision is not found', async () => {
		const result = await fetchLatestWaWebVersion()

		expect(result).toHaveProperty('version')
		expect(result).toHaveProperty('isLatest')
		expect(Array.isArray(result.version)).toBe(true)
	})

	it('should handle network timeouts gracefully', async () => {
		const result = await fetchLatestWaWebVersion()

		expect(result).toHaveProperty('version')
		expect(result).toHaveProperty('isLatest')
		expect(Array.isArray(result.version)).toBe(true)
	})
})
