import { Boom } from '@hapi/boom'
import { jest } from '@jest/globals'
import { createCipheriv, createHmac, randomBytes } from 'crypto'
import * as http from 'http'
import type { AddressInfo } from 'net'
import type { WAMessage } from '../../Types'
import type { ILogger } from '../../Utils/logger'
import { downloadMediaMessage } from '../../Utils/messages'
import { getMediaKeys } from '../../Utils/messages-media'

const makeTestLogger = (): ILogger =>
	({
		level: 'silent',
		child: () => makeTestLogger(),
		trace: () => {},
		debug: () => {},
		info: () => {},
		warn: () => {},
		error: () => {},
		fatal: () => {}
	}) as unknown as ILogger

/** Encrypts like the WhatsApp media CDN serves it: AES-256-CBC ciphertext followed by a 10 byte MAC */
const encryptMedia = async (plaintext: Buffer, mediaKey: Buffer) => {
	const { cipherKey, iv, macKey } = await getMediaKeys(mediaKey, 'image')
	const aes = createCipheriv('aes-256-cbc', cipherKey, iv)
	const enc = Buffer.concat([aes.update(plaintext), aes.final()])
	const mac = createHmac('sha256', macKey!).update(iv).update(enc).digest().subarray(0, 10)
	return Buffer.concat([enc, mac])
}

describe('downloadMediaMessage', () => {
	const plaintext = Buffer.from('the media bytes, served again after a reupload')
	const mediaKey = randomBytes(32)

	let server: http.Server
	let baseUrl: string
	let encrypted: Buffer
	let expiredStatus: number
	let requestedPaths: string[]

	beforeAll(async () => {
		encrypted = await encryptMedia(plaintext, mediaKey)
		server = http.createServer((req, res) => {
			requestedPaths.push(req.url!)
			if (req.url === '/fresh') {
				res.writeHead(200, { 'Content-Type': 'application/octet-stream' })
				res.end(encrypted)
			} else {
				res.writeHead(expiredStatus)
				res.end()
			}
		})
		await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
		baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
	})

	afterAll(async () => {
		server.closeAllConnections()
		await new Promise(resolve => server.close(resolve))
	})

	beforeEach(() => {
		requestedPaths = []
	})

	const imageMessage = (path: string): WAMessage => ({
		key: { remoteJid: '1234567890@s.whatsapp.net', fromMe: false, id: 'ABCDEF123456' },
		message: {
			imageMessage: {
				url: `${baseUrl}${path}`,
				mediaKey,
				mimetype: 'image/jpeg'
			}
		}
	})

	const makeCtx = () => {
		const reuploadRequest = jest.fn(async (msg: WAMessage) => ({
			...msg,
			message: {
				imageMessage: {
					...msg.message!.imageMessage,
					url: `${baseUrl}/fresh`,
					// the phone's answer refreshes the directPath too, when the message has one
					...(msg.message!.imageMessage!.directPath ? { directPath: '/fresh' } : {})
				}
			}
		}))
		return { reuploadRequest, logger: makeTestLogger() }
	}

	it.each([404, 410])('requests a reupload and retries when the media CDN answers %i', async status => {
		expiredStatus = status
		const ctx = makeCtx()
		const message = imageMessage('/expired')

		const buffer = await downloadMediaMessage(message, 'buffer', {}, ctx)

		expect(buffer.equals(plaintext)).toBe(true)
		expect(ctx.reuploadRequest).toHaveBeenCalledTimes(1)
		expect(ctx.reuploadRequest).toHaveBeenCalledWith(message)
		expect(requestedPaths).toEqual(['/expired', '/fresh'])
	})

	it('does not request a reupload for a status that is not an expiry', async () => {
		expiredStatus = 500
		const ctx = makeCtx()

		const error = await downloadMediaMessage(imageMessage('/expired'), 'buffer', {}, ctx).catch(err => err)

		expect(error).toBeInstanceOf(Boom)
		expect((error as Boom).output.statusCode).toBe(500)
		expect(ctx.reuploadRequest).not.toHaveBeenCalled()
		expect(requestedPaths).toEqual(['/expired'])
	})

	it('rethrows the expiry without retrying when no context is given', async () => {
		expiredStatus = 410

		const error = await downloadMediaMessage(imageMessage('/expired'), 'buffer', {}).catch(err => err)

		expect(error).toBeInstanceOf(Boom)
		expect((error as Boom).output.statusCode).toBe(410)
		expect(requestedPaths).toEqual(['/expired'])
	})

	describe('a 403 is judged by the link that actually failed', () => {
		// a fixed clock, so that an `oe` can sit exactly on it
		const NOW = 1_790_000_000
		const DAY = 24 * 60 * 60
		/** a media link's `oe` query parameter: when its signature expires, in hex unix seconds */
		const oe = (unixSeconds: number) => unixSeconds.toString(16).toUpperCase()
		const signed = (path: string, expiry: string) => `${path}?ccb=11-4&oe=${expiry}&_nc_sid=5e03e0`
		const EXPIRED = oe(NOW - DAY)
		const VALID = oe(NOW + 14 * DAY)

		const realFetch = globalThis.fetch
		let fetchSpy: jest.Spied<typeof fetch>

		beforeEach(() => {
			expiredStatus = 403
			jest.spyOn(Date, 'now').mockReturnValue(NOW * 1000)
			// a directPath is fetched over https from the url's host, and the local server speaks http
			fetchSpy = jest
				.spyOn(globalThis, 'fetch')
				.mockImplementation((input, init) => realFetch(String(input).replace(/^https:/, 'http:'), init))
		})

		afterEach(() => {
			jest.restoreAllMocks()
		})

		/** the download requests the directPath when there is one, else the url */
		const message = (urlPath: string, directPath?: string) => {
			const msg = imageMessage(urlPath)
			if (directPath !== undefined) {
				msg.message!.imageMessage!.directPath = directPath
			}

			return msg
		}

		const expectReupload = async (msg: WAMessage, requested: string[]) => {
			const ctx = makeCtx()

			const buffer = await downloadMediaMessage(msg, 'buffer', {}, ctx)

			expect(buffer.equals(plaintext)).toBe(true)
			expect(ctx.reuploadRequest).toHaveBeenCalledTimes(1)
			expect(ctx.reuploadRequest).toHaveBeenCalledWith(msg)
			expect(requestedPaths).toEqual([...requested, '/fresh'])
		}

		const expectNoReupload = async (msg: WAMessage, requested: string[]) => {
			const ctx = makeCtx()

			const error = await downloadMediaMessage(msg, 'buffer', {}, ctx).catch(err => err)

			expect(error?.output?.statusCode ?? error?.status).toBe(403)
			expect(ctx.reuploadRequest).not.toHaveBeenCalled()
			expect(requestedPaths).toEqual(requested)
		}

		it.each([
			['a day past', EXPIRED],
			['exactly now', oe(NOW)],
			['a day past, in lowercase hex', EXPIRED.toLowerCase()],
			['a day past, percent-encoded', [...EXPIRED].map(c => `%${c.charCodeAt(0).toString(16)}`).join('')]
		])('requests a reupload when the oe of the url that failed is %s', async (_, expiry) => {
			const path = signed('/expired', expiry)

			await expectReupload(message(path), [path])
		})

		it.each([
			['one second from now', signed('/expired', oe(NOW + 1))],
			['14 days from now', signed('/expired', VALID)],
			['missing', '/expired'],
			['empty', signed('/expired', '')],
			['not hex', signed('/expired', `${EXPIRED}Z`)],
			['0x-prefixed', signed('/expired', `0x${EXPIRED}`)],
			['too large to be a time', signed('/expired', 'F'.repeat(20))],
			['given twice', `/expired?oe=${EXPIRED}&oe=${EXPIRED}`],
			['spelled OE', `/expired?OE=${EXPIRED}`]
		])('does not request a reupload when the oe of the url that failed is %s', async (_, path) => {
			await expectNoReupload(message(path), [path])
		})

		it('ignores an oe in the fragment, which is never sent', async () => {
			await expectNoReupload(message(`/expired#top?oe=${EXPIRED}`), ['/expired'])
		})

		it('does not request a reupload when the url has expired but the directPath that failed has not', async () => {
			const directPath = signed('/expired', VALID)

			await expectNoReupload(message(signed('/url', EXPIRED), directPath), [directPath])
		})

		it('requests a reupload when the directPath that failed has expired though the url has not', async () => {
			const directPath = signed('/expired', EXPIRED)

			await expectReupload(message(signed('/url', VALID), directPath), [directPath])
		})

		it('does not request a reupload when the url has expired but the directPath that failed has no oe', async () => {
			await expectNoReupload(message(signed('/url', EXPIRED), '/expired'), ['/expired'])
		})

		describe('when the error does not say which link failed', () => {
			// an error with a numeric status and no url, before any request reaches the server
			const failFirstFetch = () =>
				fetchSpy.mockImplementationOnce(async () => {
					throw Object.assign(new Error('forbidden'), { status: 403 })
				})

			it('judges by the directPath, which the download requests first', async () => {
				failFirstFetch()

				await expectReupload(message(signed('/url', VALID), signed('/expired', EXPIRED)), [])
			})

			it('does not fall back to an expired url when there is a directPath', async () => {
				failFirstFetch()

				await expectNoReupload(message(signed('/url', EXPIRED), signed('/expired', VALID)), [])
			})

			it('judges by the url when there is no directPath', async () => {
				failFirstFetch()

				await expectReupload(message(signed('/expired', EXPIRED)), [])
			})
		})
	})
})
