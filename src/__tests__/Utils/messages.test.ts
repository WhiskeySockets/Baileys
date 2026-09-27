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
			message: { imageMessage: { ...msg.message!.imageMessage, url: `${baseUrl}/fresh` } }
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
})
