import { hkdfSync, randomBytes } from 'crypto'
import * as fs from 'fs'
import * as http from 'http'
import { Agent } from 'https'
import * as os from 'os'
import * as path from 'path'
import { Readable } from 'stream'
import { proto } from '../../../WAProto/index.js'
import type { MediaConnInfo, SocketConfig } from '../../Types'
import { aesDecryptGCM, aesEncryptGCM } from '../../Utils/crypto'
import type { ILogger } from '../../Utils/logger'
import {
	decryptMediaRetryData,
	encryptedStream,
	encryptMediaRetryRequest,
	getWAUploadToServer,
	type UploadParams,
	uploadWithNodeHttp
} from '../../Utils/messages-media'
import { type BinaryNode, getBinaryNodeChild } from '../../WABinary'

const createTempFile = async (content: string): Promise<string> => {
	const filePath = path.join(os.tmpdir(), `test-upload-${Date.now()}.txt`)
	await fs.promises.writeFile(filePath, content)
	return filePath
}

const cleanupTempFile = async (filePath: string): Promise<void> => {
	try {
		await fs.promises.unlink(filePath)
	} catch {}
}

const createLogger = (): ILogger => {
	const logger: ILogger = {
		level: 'silent',
		child: () => logger,
		trace: () => {},
		debug: () => {},
		info: () => {},
		warn: () => {},
		error: () => {}
	}
	return logger
}

describe('uploadWithNodeHttp', () => {
	let server: http.Server
	let serverPort: number
	let tempFilePath: string
	const testFileContent = 'Hello, this is test content for upload!'

	beforeAll(async () => {
		tempFilePath = await createTempFile(testFileContent)
	})

	afterAll(async () => {
		await cleanupTempFile(tempFilePath)
	})

	afterEach(() => {
		if (server) {
			server.close()
		}
	})

	const startServer = (handler: http.RequestListener): Promise<number> => {
		return new Promise(resolve => {
			server = http.createServer(handler)
			server.listen(0, () => {
				const address = server.address()
				if (address && typeof address === 'object') {
					serverPort = address.port
					resolve(serverPort)
				}
			})
		})
	}

	it('should successfully upload a file and receive JSON response', async () => {
		const expectedResponse = { url: 'https://example.com/media/123', direct_path: '/media/123' }
		let receivedBody = ''

		await startServer((req, res) => {
			req.on('data', chunk => {
				receivedBody += chunk
			})
			req.on('end', () => {
				res.writeHead(200, { 'Content-Type': 'application/json' })
				res.end(JSON.stringify(expectedResponse))
			})
		})

		const params: UploadParams = {
			url: `http://localhost:${serverPort}/upload`,
			filePath: tempFilePath,
			headers: { 'Content-Type': 'application/octet-stream' }
		}

		const result = await uploadWithNodeHttp(params)

		expect(result).toEqual(expectedResponse)
		expect(receivedBody).toBe(testFileContent)
	})

	it('should follow a single redirect (302)', async () => {
		const expectedResponse = { url: 'https://example.com/media/456', direct_path: '/media/456' }
		let requestCount = 0

		await startServer((req, res) => {
			requestCount++
			if (req.url === '/upload') {
				res.writeHead(302, { Location: `http://localhost:${serverPort}/final` })
				res.end()
			} else if (req.url === '/final') {
				let body = ''
				req.on('data', chunk => (body += chunk))
				req.on('end', () => {
					res.writeHead(200, { 'Content-Type': 'application/json' })
					res.end(JSON.stringify(expectedResponse))
				})
			}
		})

		const params: UploadParams = {
			url: `http://localhost:${serverPort}/upload`,
			filePath: tempFilePath,
			headers: { 'Content-Type': 'application/octet-stream' }
		}

		const result = await uploadWithNodeHttp(params)

		expect(result).toEqual(expectedResponse)
		expect(requestCount).toBe(2)
	})

	it('should follow multiple redirects (301 -> 302 -> 200)', async () => {
		const expectedResponse = { url: 'https://example.com/media/789', direct_path: '/media/789' }
		let requestCount = 0

		await startServer((req, res) => {
			requestCount++
			if (req.url === '/upload') {
				res.writeHead(301, { Location: `http://localhost:${serverPort}/redirect1` })
				res.end()
			} else if (req.url === '/redirect1') {
				res.writeHead(302, { Location: `http://localhost:${serverPort}/redirect2` })
				res.end()
			} else if (req.url === '/redirect2') {
				res.writeHead(307, { Location: `http://localhost:${serverPort}/final` })
				res.end()
			} else if (req.url === '/final') {
				let body = ''
				req.on('data', chunk => (body += chunk))
				req.on('end', () => {
					res.writeHead(200, { 'Content-Type': 'application/json' })
					res.end(JSON.stringify(expectedResponse))
				})
			}
		})

		const params: UploadParams = {
			url: `http://localhost:${serverPort}/upload`,
			filePath: tempFilePath,
			headers: { 'Content-Type': 'application/octet-stream' }
		}

		const result = await uploadWithNodeHttp(params)

		expect(result).toEqual(expectedResponse)
		expect(requestCount).toBe(4)
	})

	it('should throw error on too many redirects (more than 5)', async () => {
		await startServer((req, res) => {
			const currentNum = parseInt(req.url?.replace('/redirect', '') || '0')
			res.writeHead(302, { Location: `http://localhost:${serverPort}/redirect${currentNum + 1}` })
			res.end()
		})

		const params: UploadParams = {
			url: `http://localhost:${serverPort}/redirect0`,
			filePath: tempFilePath,
			headers: { 'Content-Type': 'application/octet-stream' }
		}

		await expect(uploadWithNodeHttp(params)).rejects.toThrow('Too many redirects')
	})

	it('should return undefined for non-JSON response', async () => {
		await startServer((req, res) => {
			let body = ''
			req.on('data', chunk => (body += chunk))
			req.on('end', () => {
				res.writeHead(200, { 'Content-Type': 'text/html' })
				res.end('<html>Not JSON</html>')
			})
		})

		const params: UploadParams = {
			url: `http://localhost:${serverPort}/upload`,
			filePath: tempFilePath,
			headers: { 'Content-Type': 'application/octet-stream' }
		}

		const result = await uploadWithNodeHttp(params)

		expect(result).toBeUndefined()
	})

	it('should handle relative redirect URLs', async () => {
		const expectedResponse = { url: 'https://example.com/media/rel', direct_path: '/media/rel' }
		let requestCount = 0

		await startServer((req, res) => {
			requestCount++
			if (req.url === '/upload') {
				res.writeHead(302, { Location: '/final' })
				res.end()
			} else if (req.url === '/final') {
				let body = ''
				req.on('data', chunk => (body += chunk))
				req.on('end', () => {
					res.writeHead(200, { 'Content-Type': 'application/json' })
					res.end(JSON.stringify(expectedResponse))
				})
			}
		})

		const params: UploadParams = {
			url: `http://localhost:${serverPort}/upload`,
			filePath: tempFilePath,
			headers: { 'Content-Type': 'application/octet-stream' }
		}

		const result = await uploadWithNodeHttp(params)

		expect(result).toEqual(expectedResponse)
		expect(requestCount).toBe(2)
	})

	it('should preserve headers on redirect', async () => {
		const expectedResponse = { success: true }
		let capturedHeaders: http.IncomingHttpHeaders | undefined

		await startServer((req, res) => {
			if (req.url === '/upload') {
				res.writeHead(302, { Location: `http://localhost:${serverPort}/final` })
				res.end()
			} else if (req.url === '/final') {
				capturedHeaders = req.headers
				let body = ''
				req.on('data', chunk => (body += chunk))
				req.on('end', () => {
					res.writeHead(200, { 'Content-Type': 'application/json' })
					res.end(JSON.stringify(expectedResponse))
				})
			}
		})

		const customHeaders = {
			'Content-Type': 'application/octet-stream',
			'X-Custom-Header': 'test-value',
			Authorization: 'Bearer token123'
		}

		const params: UploadParams = {
			url: `http://localhost:${serverPort}/upload`,
			filePath: tempFilePath,
			headers: customHeaders
		}

		const result = await uploadWithNodeHttp(params)

		expect(result).toEqual(expectedResponse)
		expect(capturedHeaders?.['x-custom-header']).toBe('test-value')
		expect(capturedHeaders?.['authorization']).toBe('Bearer token123')
	})

	it('should re-stream file content on redirect', async () => {
		const expectedResponse = { success: true }
		let finalReceivedBody = ''

		await startServer((req, res) => {
			if (req.url === '/upload') {
				req.on('data', () => {})
				req.on('end', () => {
					res.writeHead(302, { Location: `http://localhost:${serverPort}/final` })
					res.end()
				})
			} else if (req.url === '/final') {
				req.on('data', chunk => {
					finalReceivedBody += chunk
				})
				req.on('end', () => {
					res.writeHead(200, { 'Content-Type': 'application/json' })
					res.end(JSON.stringify(expectedResponse))
				})
			}
		})

		const params: UploadParams = {
			url: `http://localhost:${serverPort}/upload`,
			filePath: tempFilePath,
			headers: { 'Content-Type': 'application/octet-stream' }
		}

		const result = await uploadWithNodeHttp(params)

		expect(result).toEqual(expectedResponse)
		expect(finalReceivedBody).toBe(testFileContent)
	})
})

describe('getWAUploadToServer', () => {
	let tempFilePath: string
	let originalFetch: typeof globalThis.fetch
	let originalBunDescriptor: PropertyDescriptor | undefined

	beforeAll(async () => {
		tempFilePath = await createTempFile('fetch upload content')
	})

	beforeEach(() => {
		originalFetch = globalThis.fetch
		originalBunDescriptor = Object.getOwnPropertyDescriptor(process.versions, 'bun')
		Object.defineProperty(process.versions, 'bun', {
			value: 'test-runtime',
			configurable: true
		})
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
		if (originalBunDescriptor) {
			Object.defineProperty(process.versions, 'bun', originalBunDescriptor)
		} else {
			delete (process.versions as { bun?: string }).bun
		}
	})

	afterAll(async () => {
		await cleanupTempFile(tempFilePath)
	})

	it('does not pass a generic https Agent as a fetch dispatcher', async () => {
		let fetchInit: RequestInit | undefined
		globalThis.fetch = (async (_input, init) => {
			fetchInit = init
			return new Response(JSON.stringify({ url: 'https://example.com/media', direct_path: '/media' }), {
				headers: { 'Content-Type': 'application/json' }
			})
		}) as typeof fetch

		const mediaConn: MediaConnInfo = {
			auth: 'auth-token',
			ttl: 60,
			hosts: [{ hostname: 'upload.example.com', maxContentLengthBytes: 1024 }],
			fetchDate: new Date()
		}
		const upload = getWAUploadToServer(
			{
				customUploadHosts: [],
				fetchAgent: new Agent(),
				logger: createLogger(),
				options: {}
			} as Partial<SocketConfig> as SocketConfig,
			async () => mediaConn
		)

		await expect(upload(tempFilePath, { fileEncSha256B64: 'abc123', mediaType: 'image' })).resolves.toEqual({
			mediaUrl: 'https://example.com/media',
			directPath: '/media',
			meta_hmac: undefined,
			fbid: undefined,
			ts: undefined
		})
		expect((fetchInit as (RequestInit & { dispatcher?: unknown }) | undefined)?.dispatcher).toBeUndefined()
	})
})

describe('encryptedStream', () => {
	const cleanupFiles = async (files: (string | undefined)[]) => {
		for (const file of files) {
			if (file) {
				try {
					await fs.promises.unlink(file)
				} catch {}
			}
		}
	}

	it('should encrypt a buffer and return valid result without hanging', async () => {
		const testData = Buffer.from('Hello, this is test content for encryption!')

		const result = await encryptedStream(testData, 'image')

		expect(result).toBeDefined()
		expect(result.mediaKey).toBeDefined()
		expect(result.mediaKey.length).toBe(32)
		expect(result.encFilePath).toBeDefined()
		expect(result.fileSha256).toBeDefined()
		expect(result.fileEncSha256).toBeDefined()
		expect(result.mac).toBeDefined()
		expect(result.mac.length).toBe(10)
		expect(result.fileLength).toBe(testData.length)

		const encFileExists = await fs.promises
			.access(result.encFilePath)
			.then(() => true)
			.catch(() => false)
		expect(encFileExists).toBe(true)

		await cleanupFiles([result.encFilePath, result.originalFilePath])
	})

	it('should encrypt a stream and complete without race condition', async () => {
		const chunks = ['chunk1', 'chunk2', 'chunk3', 'chunk4', 'chunk5']
		const testStream = Readable.from(chunks.map(c => Buffer.from(c)))

		const result = await encryptedStream({ stream: testStream }, 'document')

		expect(result).toBeDefined()
		expect(result.mediaKey).toBeDefined()
		expect(result.encFilePath).toBeDefined()
		expect(result.fileLength).toBe(chunks.join('').length)

		await cleanupFiles([result.encFilePath, result.originalFilePath])
	})

	it('should save original file when saveOriginalFileIfRequired is true', async () => {
		const testData = Buffer.from('Original file content to save')

		const result = await encryptedStream(testData, 'audio', {
			saveOriginalFileIfRequired: true
		})

		expect(result).toBeDefined()
		expect(result.originalFilePath).toBeDefined()

		const originalContent = await fs.promises.readFile(result.originalFilePath!)
		expect(originalContent.toString()).toBe(testData.toString())

		await cleanupFiles([result.encFilePath, result.originalFilePath])
	})

	it('should complete encryption for various media types', async () => {
		const mediaTypes = ['image', 'video', 'audio', 'document', 'sticker'] as const
		const testData = Buffer.from('Test data for different media types')

		for (const mediaType of mediaTypes) {
			const result = await encryptedStream(testData, mediaType)

			expect(result).toBeDefined()
			expect(result.mediaKey).toBeDefined()
			expect(result.encFilePath).toBeDefined()

			await cleanupFiles([result.encFilePath, result.originalFilePath])
		}
	})

	it('should handle empty buffer without hanging', async () => {
		const emptyData = Buffer.from('')

		const result = await encryptedStream(emptyData, 'image')

		expect(result).toBeDefined()
		expect(result.fileLength).toBe(0)
		expect(result.encFilePath).toBeDefined()

		await cleanupFiles([result.encFilePath, result.originalFilePath])
	})

	it('should handle small content that finishes quickly', async () => {
		const smallData = Buffer.from('x')

		const result = await encryptedStream(smallData, 'image')

		expect(result).toBeDefined()
		expect(result.fileLength).toBe(1)

		await cleanupFiles([result.encFilePath, result.originalFilePath])
	})

	it('should complete multiple concurrent encryptions without deadlock', async () => {
		const testData = Buffer.from('Concurrent encryption test')

		const promises = Array.from({ length: 5 }, () => encryptedStream(testData, 'image'))

		const results = await Promise.all(promises)

		expect(results.length).toBe(5)
		for (const result of results) {
			expect(result).toBeDefined()
			expect(result.mediaKey).toBeDefined()
			await cleanupFiles([result.encFilePath, result.originalFilePath])
		}
	})
})

describe('media retry key', () => {
	const mediaKey = randomBytes(32)
	const msgId = '3EB0C0FFEE0123456789'
	// what the phone derives: HKDF-SHA256 over the raw media key bytes
	const retryKey = Buffer.from(hkdfSync('sha256', mediaKey, Buffer.alloc(0), 'WhatsApp Media Retry Notification', 32))
	// a message persisted as JSON (protobuf toJSON) carries its bytes fields as base64 strings
	const storedMediaKey: string = proto.Message.ImageMessage.create({ mediaKey }).toJSON().mediaKey

	const phoneAnswer = () => {
		const iv = randomBytes(12)
		const plaintext = proto.MediaRetryNotification.encode({
			stanzaId: msgId,
			directPath: '/v/t62.7118-24/fresh-path',
			result: proto.MediaRetryNotification.ResultType.SUCCESS
		}).finish()
		return { ciphertext: aesEncryptGCM(plaintext, retryKey, iv, Buffer.from(msgId)), iv }
	}

	it('decrypts the phone answer with a binary media key', () => {
		const result = decryptMediaRetryData(phoneAnswer(), mediaKey, msgId)

		expect(result.directPath).toBe('/v/t62.7118-24/fresh-path')
		expect(result.result).toBe(proto.MediaRetryNotification.ResultType.SUCCESS)
	})

	it('decrypts the phone answer when the media key is a base64 string', () => {
		expect(typeof storedMediaKey).toBe('string')

		const result = decryptMediaRetryData(phoneAnswer(), storedMediaKey, msgId)

		expect(result.directPath).toBe('/v/t62.7118-24/fresh-path')
	})

	it('accepts the data URI prefixed base64 form that getMediaKeys accepts', () => {
		const result = decryptMediaRetryData(phoneAnswer(), `data:;base64,${storedMediaKey}`, msgId)

		expect(result.directPath).toBe('/v/t62.7118-24/fresh-path')
	})

	it('encrypts the retry request with the same key when the media key is a base64 string', () => {
		const key = { remoteJid: '1234567890@s.whatsapp.net', fromMe: false, id: msgId }

		const node = encryptMediaRetryRequest(key, storedMediaKey, '1111111111:1@s.whatsapp.net')

		const encrypt = getBinaryNodeChild(node, 'encrypt')!
		const encP = getBinaryNodeChild(encrypt, 'enc_p')! as BinaryNode & { content: Uint8Array }
		const encIv = getBinaryNodeChild(encrypt, 'enc_iv')! as BinaryNode & { content: Uint8Array }
		const receipt = proto.ServerErrorReceipt.decode(
			aesDecryptGCM(encP.content, retryKey, encIv.content, Buffer.from(msgId))
		)
		expect(receipt.stanzaId).toBe(msgId)
	})
})
