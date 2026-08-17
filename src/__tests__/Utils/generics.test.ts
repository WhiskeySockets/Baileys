import { jest } from '@jest/globals'
import { BufferJSON, fetchLatestBaileysVersion } from '../../Utils/generics'

describe('BufferJSON', () => {
	const originalObject = {
		id: 1,
		key: Buffer.from([1, 2, 3, 4, 5]),
		nested: {
			data: Buffer.from([6, 7, 8])
		}
	}

	const legacyJsonString = '{"id":1,"key":{"0":1,"1":2,"2":3,"3":4,"4":5},"nested":{"data":{"0":6,"1":7,"2":8}}}'

	it('should correctly perform a round trip (stringify with replacer, parse with reviver)', () => {
		const serialized = JSON.stringify(originalObject, BufferJSON.replacer)

		expect(serialized).toContain('"type":"Buffer"')
		expect(serialized).not.toContain('"data":[1,2,3,4,5]')

		const revived = JSON.parse(serialized, BufferJSON.reviver)

		expect(Buffer.isBuffer(revived.key)).toBe(true)
		expect(Buffer.isBuffer(revived.nested.data)).toBe(true)
		expect(revived.key).toEqual(originalObject.key)
		expect(revived).toEqual(originalObject)
	})

	it('should correctly revive a legacy JSON string with object-like buffers', () => {
		const revived = JSON.parse(legacyJsonString, BufferJSON.reviver)

		expect(Buffer.isBuffer(revived.key)).toBe(true)
		expect(Buffer.isBuffer(revived.nested.data)).toBe(true)
		expect(revived.key).toEqual(originalObject.key)
		expect(revived.nested.data).toEqual(originalObject.nested.data)
		expect(revived.id).toEqual(originalObject.id)
	})

	it('should not corrupt legitimate objects that are not buffers', () => {
		const legitimateProtoObject = {
			'0': 'some-value',
			'1': 'another-value'
		}
		const jsonString = JSON.stringify(legitimateProtoObject)
		const revived = JSON.parse(jsonString, BufferJSON.reviver)

		expect(Buffer.isBuffer(revived)).toBe(false)
		expect(revived).toEqual(legitimateProtoObject)
	})

	it('should not convert other objects or null values', () => {
		const otherObject = {
			a: 1,
			b: 2,
			c: null,
			d: { '0': 1, foo: 'bar' }
		}
		const jsonString = JSON.stringify(otherObject)
		const revived = JSON.parse(jsonString, BufferJSON.reviver)

		expect(Buffer.isBuffer(revived.a)).toBe(false)
		expect(revived.c).toBeNull()
		expect(Buffer.isBuffer(revived.d)).toBe(false)
		expect(revived).toEqual(otherObject)
	})

	it('should correctly handle an empty object', () => {
		const revived = JSON.parse('{}', BufferJSON.reviver)
		expect(revived).toEqual({})
	})
})

describe('fetchLatestBaileysVersion', () => {
	const originalFetch = globalThis.fetch

	afterEach(() => {
		globalThis.fetch = originalFetch
	})

	it('should parse version with standard and flexible whitespace', async () => {
		const mockDefaultsContent = `
			import { WAVersion } from '../Types'
			export const version: WAVersion = [ 2 , 3000 , 1043857760 ]
		`

		globalThis.fetch = (jest.fn() as any).mockImplementation(async (url: string) => {
			if (typeof url === 'string' && url.includes('raw.githubusercontent.com')) {
				return {
					ok: true,
					text: async () => mockDefaultsContent,
				} as any
			}
			throw new Error('Unexpected URL')
		})

		const result = await fetchLatestBaileysVersion()
		expect(result.isLatest).toBe(true)
		expect(result.version).toEqual([2, 3000, 1043857760])
	})

	it('should fallback to fetchLatestWaWebVersion when GitHub fetch fails', async () => {
		globalThis.fetch = (jest.fn() as any).mockImplementation(async (url: string) => {
			if (typeof url === 'string' && url.includes('raw.githubusercontent.com')) {
				return {
					ok: false,
					status: 503,
					statusText: 'Service Unavailable',
				} as any
			}
			if (typeof url === 'string' && url.includes('web.whatsapp.com/sw.js')) {
				return {
					ok: true,
					text: async () => 'self.__BUILD_MANIFEST = { "client_revision": 1045345293 }',
				} as any
			}
			throw new Error('Unexpected URL')
		})

		const result = await fetchLatestBaileysVersion({
			headers: { 'Authorization': 'token secret-gh-token' }
		})

		expect(result.isLatest).toBe(true)
		expect(result.version).toEqual([2, 3000, 1045345293])

		// Verify GitHub-only headers are NOT passed to web.whatsapp.com
		const swCall = ((globalThis.fetch as any).mock.calls as any[]).find(c => c[0]?.includes('web.whatsapp.com/sw.js'))
		expect(swCall).toBeDefined()
		expect(swCall[1]?.headers).not.toHaveProperty('Authorization')
	})

	it('should fallback to static baileysVersion when both remote calls fail', async () => {
		globalThis.fetch = (jest.fn() as any).mockImplementation(async () => {
			return {
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			} as any
		})

		const result = await fetchLatestBaileysVersion()
		expect(result.isLatest).toBe(false)
		expect(Array.isArray(result.version)).toBe(true)
		expect(result.version).toHaveLength(3)
		expect(result.error).toBeDefined()
	})
})
