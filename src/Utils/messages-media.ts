import { Boom } from '@hapi/boom'
import { exec } from 'child_process'
import * as Crypto from 'crypto'
import { once } from 'events'
import { createReadStream, createWriteStream, promises as fs, WriteStream } from 'fs'
import type { IAudioMetadata } from 'music-metadata'
import { tmpdir } from 'os'
import { join } from 'path'
import { Readable, Transform } from 'stream'
import { URL } from 'url'
import { proto } from '../../WAProto/index.js'
import { DEFAULT_ORIGIN, MEDIA_HKDF_KEY_MAPPING, MEDIA_PATH_MAP, type MediaType } from '../Defaults'
import type {
	BaileysEventMap,
	DownloadableMessage,
	MediaConnInfo,
	MediaDecryptionKeyInfo,
	MessageType,
	SocketConfig,
	WAGenericMediaMessage,
	WAMediaUpload,
	WAMediaUploadFunction,
	WAMessageContent,
	WAMessageKey
} from '../Types'
import { type BinaryNode, getBinaryNodeChild, getBinaryNodeChildBuffer, jidNormalizedUser } from '../WABinary'
import { aesDecryptGCM, aesEncryptGCM, hkdf } from './crypto'
import { generateMessageIDV2 } from './generics'
import type { ILogger } from './logger'

const getTmpFilesDirectory = () => tmpdir()

export const getImageProcessingLibrary = async () => {
	const [jimp, sharp] = await Promise.all([import('jimp').catch(() => {}), import('sharp').catch(() => {})])

	if (sharp) {
		return { sharp }
	}

	if (jimp) {
		return { jimp }
	}

	throw new Boom('No image processing library available')
}

export const hkdfInfoKey = (type: MediaType) => {
	const hkdfInfo = MEDIA_HKDF_KEY_MAPPING[type]
	return `WhatsApp ${hkdfInfo} Keys`
}

export const getRawMediaUploadData = async (media: WAMediaUpload, mediaType: MediaType, logger?: ILogger) => {
	const { stream } = await getStream(media)
	logger?.debug('got stream for raw upload')

	const hasher = Crypto.createHash('sha256')
	const filePath = join(tmpdir(), mediaType + generateMessageIDV2())
	const fileWriteStream = createWriteStream(filePath)

	let fileLength = 0
	try {
		for await (const data of stream) {
			fileLength += data.length
			hasher.update(data)
			if (!fileWriteStream.write(data)) {
				await once(fileWriteStream, 'drain')
			}
		}

		fileWriteStream.end()
		await once(fileWriteStream, 'finish')
		stream.destroy()
		const fileSha256 = hasher.digest()
		logger?.debug('hashed data for raw upload')
		return {
			filePath: filePath,
			fileSha256,
			fileLength
		}
	} catch (error) {
		fileWriteStream.destroy()
		stream.destroy()
		try {
			await fs.unlink(filePath)
		} catch {
			//
		}

		throw error
	}
}

/** generates all the keys required to encrypt/decrypt & sign a media message */
export async function getMediaKeys(
	buffer: Uint8Array | string | null | undefined,
	mediaType: MediaType
): Promise<MediaDecryptionKeyInfo> {
	if (!buffer) {
		throw new Boom('Cannot derive from empty media key')
	}

	if (typeof buffer === 'string') {
		buffer = Buffer.from(buffer.replace('data:;base64,', ''), 'base64')
	}

	// expand using HKDF to 112 bytes, also pass in the relevant app info
	const expandedMediaKey = await hkdf(buffer, 112, { info: hkdfInfoKey(mediaType) })
	return {
		iv: expandedMediaKey.slice(0, 16),
		cipherKey: expandedMediaKey.slice(16, 48),
		macKey: expandedMediaKey.slice(48, 80)
	}
}

/** Extracts video thumb using FFMPEG */
const extractVideoThumb = async (
	path: string,
	destPath: string,
	time: string,
	size: { width: number; height: number }
) =>
	new Promise<void>((resolve, reject) => {
		const cmd = `ffmpeg -ss ${time} -i ${path} -y -vf scale=${size.width}:-1 -vframes 1 -f image2 ${destPath}`
		exec(cmd, err => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})

export const extractImageThumb = async (bufferOrFilePath: Readable | Buffer | string, width = 32) => {
	// TODO: Move entirely to sharp, removing jimp as it supports readable streams
	// This will have positive speed and performance impacts as well as minimizing RAM usage.
	if (bufferOrFilePath instanceof Readable) {
		bufferOrFilePath = await toBuffer(bufferOrFilePath)
	}

	const lib = await getImageProcessingLibrary()
	if ('sharp' in lib && typeof lib.sharp?.default === 'function') {
		const img = lib.sharp.default(bufferOrFilePath)
		const dimensions = await img.metadata()

		const buffer = await img.resize(width).jpeg({ quality: 50 }).toBuffer()
		return {
			buffer,
			original: {
				width: dimensions.width,
				height: dimensions.height
			}
		}
	} else if ('jimp' in lib && lib.jimp) {
		const jimp = await lib.jimp.Jimp.read(bufferOrFilePath)
		const dimensions = {
			width: jimp.width,
			height: jimp.height
		}
		const buffer = await jimp
			.resize({ w: width, mode: lib.jimp.ResizeStrategy.BILINEAR })
			.getBuffer('image/jpeg', { quality: 50 })
		return {
			buffer,
			original: dimensions
		}
	} else {
		throw new Boom('No image processing library available')
	}
}

export const encodeBase64EncodedStringForUpload = (b64: string) =>
	encodeURIComponent(b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, ''))

export const generateProfilePicture = async (
	mediaUpload: WAMediaUpload,
	dimensions?: { width: number; height: number }
) => {
	let buffer: Buffer

	const { width: w = 640, height: h = 640 } = dimensions || {}

	if (Buffer.isBuffer(mediaUpload)) {
		buffer = mediaUpload
	} else {
		// Use getStream to handle all WAMediaUpload types (Buffer, Stream, URL)
		const { stream } = await getStream(mediaUpload)
		// Convert the resulting stream to a buffer
		buffer = await toBuffer(stream)
	}

	const lib = await getImageProcessingLibrary()
	let img: Promise<Buffer>
	if ('sharp' in lib && typeof lib.sharp?.default === 'function') {
		img = lib.sharp
			.default(buffer)
			.resize(w, h)
			.jpeg({
				quality: 50
			})
			.toBuffer()
	} else if ('jimp' in lib && typeof lib.jimp?.Jimp === 'object') {
		const jimp = await (lib.jimp.Jimp as any).read(buffer)
		const min = Math.min(jimp.width, jimp.height)
		const cropped = jimp.crop({ x: 0, y: 0, w: min, h: min })

		img = cropped.resize({ w, h, mode: lib.jimp.ResizeStrategy.BILINEAR }).getBuffer('image/jpeg', { quality: 50 })
	} else {
		throw new Boom('No image processing library available')
	}

	return {
		img: await img
	}
}

/** gets the SHA256 of the given media message */
export const mediaMessageSHA256B64 = (message: WAMessageContent) => {
	const media = Object.values(message)[0] as WAGenericMediaMessage
	return media?.fileSha256 && Buffer.from(media.fileSha256).toString('base64')
}

export async function getAudioDuration(buffer: Buffer | string | Readable) {
	const musicMetadata = await import('music-metadata')
	let metadata: IAudioMetadata
	const options = {
		duration: true
	}
	if (Buffer.isBuffer(buffer)) {
		metadata = await musicMetadata.parseBuffer(buffer, undefined, options)
	} else if (typeof buffer === 'string') {
		metadata = await musicMetadata.parseFile(buffer, options)
	} else {
		metadata = await musicMetadata.parseStream(buffer, undefined, options)
	}

	return metadata.format.duration
}

/**
  referenced from and modifying https://github.com/wppconnect-team/wa-js/blob/main/src/chat/functions/prepareAudioWaveform.ts
 */
export async function getAudioWaveform(buffer: Buffer | string | Readable, logger?: ILogger) {
	try {
		// @ts-ignore
		const { default: decoder } = await import('audio-decode')
		let audioData: Buffer
		if (Buffer.isBuffer(buffer)) {
			audioData = buffer
		} else if (typeof buffer === 'string') {
			const rStream = createReadStream(buffer)
			audioData = await toBuffer(rStream)
		} else {
			audioData = await toBuffer(buffer)
		}

		const audioBuffer = await decoder(audioData)

		const rawData = audioBuffer.getChannelData(0) // We only need to work with one channel of data
		const samples = 64 // Number of samples we want to have in our final data set
		const blockSize = Math.floor(rawData.length / samples) // the number of samples in each subdivision
		const filteredData: number[] = []
		for (let i = 0; i < samples; i++) {
			const blockStart = blockSize * i // the location of the first sample in the block
			let sum = 0
			for (let j = 0; j < blockSize; j++) {
				sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
			}

			filteredData.push(sum / blockSize) // divide the sum by the block size to get the average
		}

		// This guarantees that the largest data point will be set to 1, and the rest of the data will scale proportionally.
		const multiplier = Math.pow(Math.max(...filteredData), -1)
		const normalizedData = filteredData.map(n => n * multiplier)

		// Generate waveform like WhatsApp
		const waveform = new Uint8Array(normalizedData.map(n => Math.floor(100 * n)))

		return waveform
	} catch (e) {
		logger?.debug('Failed to generate waveform: ' + e)
	}
}

export const toReadable = (buffer: Buffer) => {
	const readable = new Readable({ read: () => {} })
	readable.push(buffer)
	readable.push(null)
	return readable
}

export const toBuffer = async (stream: Readable) => {
	const chunks: Buffer[] = []
	for await (const chunk of stream) {
		chunks.push(chunk)
	}

	stream.destroy()
	return Buffer.concat(chunks)
}

export const getStream = async (item: WAMediaUpload, opts?: RequestInit & { maxContentLength?: number }) => {
	if (Buffer.isBuffer(item)) {
		return { stream: toReadable(item), type: 'buffer' } as const
	}

	if ('stream' in item) {
		return { stream: item.stream, type: 'readable' } as const
	}

	const urlStr = item.url.toString()

	if (urlStr.startsWith('data:')) {
		const buffer = Buffer.from(urlStr.split(',')[1]!, 'base64')
		return { stream: toReadable(buffer), type: 'buffer' } as const
	}

	if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
		return { stream: await getHttpStream(item.url, opts), type: 'remote' } as const
	}

	return { stream: createReadStream(item.url), type: 'file' } as const
}

/** generates a thumbnail for a given media, if required */
export async function generateThumbnail(
	file: string,
	mediaType: 'video' | 'image',
	options: {
		logger?: ILogger
	}
) {
	let thumbnail: string | undefined
	let originalImageDimensions: { width: number; height: number } | undefined
	if (mediaType === 'image') {
		const { buffer, original } = await extractImageThumb(file)
		thumbnail = buffer.toString('base64')
		if (original.width && original.height) {
			originalImageDimensions = {
				width: original.width,
				height: original.height
			}
		}
	} else if (mediaType === 'video') {
		const imgFilename = join(getTmpFilesDirectory(), generateMessageIDV2() + '.jpg')
		try {
			await extractVideoThumb(file, imgFilename, '00:00:00', { width: 32, height: 32 })
			const buff = await fs.readFile(imgFilename)
			thumbnail = buff.toString('base64')

			await fs.unlink(imgFilename)
		} catch (err) {
			options.logger?.debug('could not generate video thumb: ' + err)
		}
	}

	return {
		thumbnail,
		originalImageDimensions
	}
}

export const getHttpStream = async (url: string | URL, options: RequestInit & { isStream?: true } = {}) => {
	const response = await fetch(url.toString(), {
		dispatcher: options.dispatcher,
		method: 'GET',
		headers: options.headers as HeadersInit
	})
	if (!response.ok) {
		throw new Boom(`Failed to fetch stream from ${url}`, { statusCode: response.status, data: { url } })
	}

	// @ts-ignore Node18+ Readable.fromWeb exists
	return Readable.fromWeb(response.body as any)
}

type EncryptedStreamOptions = {
	saveOriginalFileIfRequired?: boolean
	logger?: ILogger
	opts?: RequestInit
}

export const encryptedStream = async (
	media: WAMediaUpload,
	mediaType: MediaType,
	{ logger, saveOriginalFileIfRequired, opts }: EncryptedStreamOptions = {}
) => {
	const { stream, type } = await getStream(media, opts)

	logger?.debug('fetched media stream')

	const mediaKey = Crypto.randomBytes(32)
	const { cipherKey, iv, macKey } = await getMediaKeys(mediaKey, mediaType)

	const encFilePath = join(getTmpFilesDirectory(), mediaType + generateMessageIDV2() + '-enc')
	const encFileWriteStream = createWriteStream(encFilePath)

	let originalFileStream: WriteStream | undefined
	let originalFilePath: string | undefined

	if (saveOriginalFileIfRequired) {
		originalFilePath = join(getTmpFilesDirectory(), mediaType + generateMessageIDV2() + '-original')
		originalFileStream = createWriteStream(originalFilePath)
	}

	let fileLength = 0
	const aes = Crypto.createCipheriv('aes-256-cbc', cipherKey, iv)
	const hmac = Crypto.createHmac('sha256', macKey!).update(iv)
	const sha256Plain = Crypto.createHash('sha256')
	const sha256Enc = Crypto.createHash('sha256')

	const onChunk = (buff: Buffer) => {
		sha256Enc.update(buff)
		hmac.update(buff)
		encFileWriteStream.write(buff)
	}

	try {
		for await (const data of stream) {
			fileLength += data.length

			if (
				type === 'remote' &&
				(opts as any)?.maxContentLength &&
				fileLength + data.length > (opts as any).maxContentLength
			) {
				throw new Boom(`content length exceeded when encrypting "${type}"`, {
					data: { media, type }
				})
			}

			if (originalFileStream) {
				if (!originalFileStream.write(data)) {
					await once(originalFileStream, 'drain')
				}
			}

			sha256Plain.update(data)
			onChunk(aes.update(data))
		}

		onChunk(aes.final())

		const mac = hmac.digest().slice(0, 10)
		sha256Enc.update(mac)

		const fileSha256 = sha256Plain.digest()
		const fileEncSha256 = sha256Enc.digest()

		encFileWriteStream.write(mac)

		encFileWriteStream.end()
		originalFileStream?.end?.()
		stream.destroy()

		logger?.debug('encrypted data successfully')

		return {
			mediaKey,
			originalFilePath,
			encFilePath,
			mac,
			fileEncSha256,
			fileSha256,
			fileLength
		}
	} catch (error) {
		// destroy all streams with error
		encFileWriteStream.destroy()
		originalFileStream?.destroy?.()
		aes.destroy()
		hmac.destroy()
		sha256Plain.destroy()
		sha256Enc.destroy()
		stream.destroy()

		try {
			await fs.unlink(encFilePath)
			if (originalFilePath) {
				await fs.unlink(originalFilePath)
			}
		} catch (err) {
			logger?.error({ err }, 'failed deleting tmp files')
		}

		throw error
	}
}

const DEF_HOST = 'mmg.whatsapp.net'
const AES_CHUNK_SIZE = 16

const toSmallestChunkSize = (num: number) => {
	return Math.floor(num / AES_CHUNK_SIZE) * AES_CHUNK_SIZE
}

export type MediaDownloadOptions = {
	startByte?: number
	endByte?: number
	options?: RequestInit
}

export const getUrlFromDirectPath = (directPath: string) => `https://${DEF_HOST}${directPath}`

export const downloadContentFromMessage = async (
	{ mediaKey, directPath, url }: DownloadableMessage,
	type: MediaType,
	opts: MediaDownloadOptions = {}
) => {
	const isValidMediaUrl = url?.startsWith('https://mmg.whatsapp.net/')
	const downloadUrl = isValidMediaUrl ? url : getUrlFromDirectPath(directPath!)
	if (!downloadUrl) {
		throw new Boom('No valid media URL or directPath present in message', { statusCode: 400 })
	}

	const keys = await getMediaKeys(mediaKey, type)

	return downloadEncryptedContent(downloadUrl, keys, opts)
}

/**
 * Decrypts and downloads an AES256-CBC encrypted file given the keys.
 * Assumes the SHA256 of the plaintext is appended to the end of the ciphertext
 * */
export const downloadEncryptedContent = async (
	downloadUrl: string,
	{ cipherKey, iv }: MediaDecryptionKeyInfo,
	{ startByte, endByte, options }: MediaDownloadOptions = {}
) => {
	let bytesFetched = 0
	let startChunk = 0
	let firstBlockIsIV = false
	// if a start byte is specified -- then we need to fetch the previous chunk as that will form the IV
	if (startByte) {
		const chunk = toSmallestChunkSize(startByte || 0)
		if (chunk) {
			startChunk = chunk - AES_CHUNK_SIZE
			bytesFetched = chunk

			firstBlockIsIV = true
		}
	}

	const endChunk = endByte ? toSmallestChunkSize(endByte || 0) + AES_CHUNK_SIZE : undefined

	const headersInit = options?.headers ? options.headers : undefined
	const headers: Record<string, string> = {
		...(headersInit
			? Array.isArray(headersInit)
				? Object.fromEntries(headersInit)
				: (headersInit as Record<string, string>)
			: {}),
		Origin: DEFAULT_ORIGIN
	}
	if (startChunk || endChunk) {
		headers.Range = `bytes=${startChunk}-`
		if (endChunk) {
			headers.Range += endChunk
		}
	}

	// download the message
	const fetched = await getHttpStream(downloadUrl, {
		...(options || {}),
		headers
	})

	let remainingBytes = Buffer.from([])

	let aes: Crypto.Decipher

	const pushBytes = (bytes: Buffer, push: (bytes: Buffer) => void) => {
		if (startByte || endByte) {
			const start = bytesFetched >= startByte! ? undefined : Math.max(startByte! - bytesFetched, 0)
			const end = bytesFetched + bytes.length < endByte! ? undefined : Math.max(endByte! - bytesFetched, 0)

			push(bytes.slice(start, end))

			bytesFetched += bytes.length
		} else {
			push(bytes)
		}
	}

	const output = new Transform({
		transform(chunk, _, callback) {
			let data = Buffer.concat([remainingBytes, chunk])

			const decryptLength = toSmallestChunkSize(data.length)
			remainingBytes = data.slice(decryptLength)
			data = data.slice(0, decryptLength)

			if (!aes) {
				let ivValue = iv
				if (firstBlockIsIV) {
					ivValue = data.slice(0, AES_CHUNK_SIZE)
					data = data.slice(AES_CHUNK_SIZE)
				}

				aes = Crypto.createDecipheriv('aes-256-cbc', cipherKey, ivValue)
				// if an end byte that is not EOF is specified
				// stop auto padding (PKCS7) -- otherwise throws an error for decryption
				if (endByte) {
					aes.setAutoPadding(false)
				}
			}

			try {
				pushBytes(aes.update(data), b => this.push(b))
				callback()
			} catch (error: any) {
				callback(error)
			}
		},
		final(callback) {
			try {
				pushBytes(aes.final(), b => this.push(b))
				callback()
			} catch (error: any) {
				callback(error)
			}
		}
	})
	return fetched.pipe(output, { end: true })
}

export function extensionForMediaMessage(message: WAMessageContent) {
	const getExtension = (mimetype: string) => mimetype.split(';')[0]?.split('/')[1]
	const type = Object.keys(message)[0] as Exclude<MessageType, 'toJSON'>
	let extension: string
	if (type === 'locationMessage' || type === 'liveLocationMessage' || type === 'productMessage') {
		extension = '.jpeg'
	} else {
		const messageContent = message[type] as WAGenericMediaMessage
		extension = getExtension(messageContent.mimetype!)!
	}

	return extension
}

export const getWAUploadToServer = (
	{ customUploadHosts, fetchAgent, logger, options }: SocketConfig,
	refreshMediaConn: (force: boolean) => Promise<MediaConnInfo>
): WAMediaUploadFunction => {
	return async (filePath, { mediaType, fileEncSha256B64, timeoutMs }) => {
		// send a query JSON to obtain the url & auth token to upload our media
		let uploadInfo = await refreshMediaConn(false)

		let urls: { mediaUrl: string; directPath: string; meta_hmac?: string; ts?: number; fbid?: number } | undefined
		const hosts = [...customUploadHosts, ...uploadInfo.hosts]

		fileEncSha256B64 = encodeBase64EncodedStringForUpload(fileEncSha256B64)

		for (const { hostname } of hosts) {
			logger.debug(`uploading to "${hostname}"`)

			const auth = encodeURIComponent(uploadInfo.auth) // the auth token
			const url = `https://${hostname}${MEDIA_PATH_MAP[mediaType]}/${fileEncSha256B64}?auth=${auth}&token=${fileEncSha256B64}`
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			let result: any
			try {
				const stream = createReadStream(filePath)
				const response = await fetch(url, {
					dispatcher: fetchAgent,
					method: 'POST',
					body: stream as any,
					headers: {
						...(() => {
							const hdrs = options?.headers
							if (!hdrs) return {}
							return Array.isArray(hdrs) ? Object.fromEntries(hdrs) : (hdrs as Record<string, string>)
						})(),
						'Content-Type': 'application/octet-stream',
						Origin: DEFAULT_ORIGIN
					},
					duplex: 'half',
					// Note: custom agents/proxy require undici Agent; omitted here.
					signal: timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined
				})
				let parsed: any = undefined
				try {
					parsed = await response.json()
				} catch {
					parsed = undefined
				}

				result = parsed

				if (result?.url || result?.directPath) {
					urls = {
						mediaUrl: result.url,
						directPath: result.direct_path,
						meta_hmac: result.meta_hmac,
						fbid: result.fbid,
						ts: result.ts
					}
					break
				} else {
					uploadInfo = await refreshMediaConn(true)
					throw new Error(`upload failed, reason: ${JSON.stringify(result)}`)
				}
			} catch (error: any) {
				const isLast = hostname === hosts[uploadInfo.hosts.length - 1]?.hostname
				logger.warn(
					{ trace: error?.stack, uploadResult: result },
					`Error in uploading to ${hostname} ${isLast ? '' : ', retrying...'}`
				)
			}
		}

		if (!urls) {
			throw new Boom('Media upload failed on all hosts', { statusCode: 500 })
		}

		return urls
	}
}

const getMediaRetryKey = (mediaKey: Buffer | Uint8Array) => {
	return hkdf(mediaKey, 32, { info: 'WhatsApp Media Retry Notification' })
}

/**
 * Generate a binary node that will request the phone to re-upload the media & return the newly uploaded URL
 */
export const encryptMediaRetryRequest = async (key: WAMessageKey, mediaKey: Buffer | Uint8Array, meId: string) => {
	const recp: proto.IServerErrorReceipt = { stanzaId: key.id }
	const recpBuffer = proto.ServerErrorReceipt.encode(recp).finish()

	const iv = Crypto.randomBytes(12)
	const retryKey = await getMediaRetryKey(mediaKey)
	const ciphertext = aesEncryptGCM(recpBuffer, retryKey, iv, Buffer.from(key.id!))

	const req: BinaryNode = {
		tag: 'receipt',
		attrs: {
			id: key.id!,
			to: jidNormalizedUser(meId),
			type: 'server-error'
		},
		content: [
			// this encrypt node is actually pretty useless
			// the media is returned even without this node
			// keeping it here to maintain parity with WA Web
			{
				tag: 'encrypt',
				attrs: {},
				content: [
					{ tag: 'enc_p', attrs: {}, content: ciphertext },
					{ tag: 'enc_iv', attrs: {}, content: iv }
				]
			},
			{
				tag: 'rmr',
				attrs: {
					jid: key.remoteJid!,
					from_me: (!!key.fromMe).toString(),
					// @ts-ignore
					participant: key.participant || undefined
				}
			}
		]
	}

	return req
}

export const decodeMediaRetryNode = (node: BinaryNode) => {
	const rmrNode = getBinaryNodeChild(node, 'rmr')!

	const event: BaileysEventMap['messages.media-update'][number] = {
		key: {
			id: node.attrs.id,
			remoteJid: rmrNode.attrs.jid,
			fromMe: rmrNode.attrs.from_me === 'true',
			participant: rmrNode.attrs.participant
		}
	}

	const errorNode = getBinaryNodeChild(node, 'error')
	if (errorNode) {
		const errorCode = +errorNode.attrs.code!
		event.error = new Boom(`Failed to re-upload media (${errorCode})`, {
			data: errorNode.attrs,
			statusCode: getStatusCodeForMediaRetry(errorCode)
		})
	} else {
		const encryptedInfoNode = getBinaryNodeChild(node, 'encrypt')
		const ciphertext = getBinaryNodeChildBuffer(encryptedInfoNode, 'enc_p')
		const iv = getBinaryNodeChildBuffer(encryptedInfoNode, 'enc_iv')
		if (ciphertext && iv) {
			event.media = { ciphertext, iv }
		} else {
			event.error = new Boom('Failed to re-upload media (missing ciphertext)', { statusCode: 404 })
		}
	}

	return event
}

export const decryptMediaRetryData = async (
	{ ciphertext, iv }: { ciphertext: Uint8Array; iv: Uint8Array },
	mediaKey: Uint8Array,
	msgId: string
) => {
	const retryKey = await getMediaRetryKey(mediaKey)
	const plaintext = aesDecryptGCM(ciphertext, retryKey, iv, Buffer.from(msgId))
	return proto.MediaRetryNotification.decode(plaintext)
}

export const getStatusCodeForMediaRetry = (code: number) =>
	MEDIA_RETRY_STATUS_MAP[code as proto.MediaRetryNotification.ResultType]

const MEDIA_RETRY_STATUS_MAP = {
	[proto.MediaRetryNotification.ResultType.SUCCESS]: 200,
	[proto.MediaRetryNotification.ResultType.DECRYPTION_ERROR]: 412,
	[proto.MediaRetryNotification.ResultType.NOT_FOUND]: 404,
	[proto.MediaRetryNotification.ResultType.GENERAL_ERROR]: 418
} as const
