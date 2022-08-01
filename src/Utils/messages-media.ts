import { Boom } from '@hapi/boom'
import { AxiosRequestConfig } from 'axios'
import { exec } from 'child_process'
import * as Crypto from 'crypto'
import { once } from 'events'
import { createReadStream, createWriteStream, promises as fs, WriteStream } from 'fs'
import type { IAudioMetadata } from 'music-metadata'
import { tmpdir } from 'os'
import { join } from 'path'
import type { Logger } from 'pino'
import { Readable, Transform } from 'stream'
import { URL } from 'url'
import { proto } from '../../WAProto'
import { DEFAULT_ORIGIN, MEDIA_PATH_MAP } from '../Defaults'
import { BaileysEventMap, CommonSocketConfig, DownloadableMessage, MediaConnInfo, MediaDecryptionKeyInfo, MediaType, MessageType, WAGenericMediaMessage, WAMediaUpload, WAMediaUploadFunction, WAMessageContent } from '../Types'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildBuffer, jidNormalizedUser } from '../WABinary'
import { aesDecryptGCM, aesEncryptGCM, hkdf } from './crypto'
import { generateMessageID } from './generics'

const getTmpFilesDirectory = () => tmpdir()

const getImageProcessingLibrary = async() => {
	const [jimp, sharp] = await Promise.all([
		(async() => {
			const jimp = await (
				import('jimp')
					.catch(() => { })
			)
			return jimp
		})(),
		(async() => {
			const sharp = await (
				import('sharp')
					.catch(() => { })
			)
			return sharp
		})()
	])
	if(sharp) {
		return { sharp }
	}

	if(jimp) {
		return { jimp }
	}

	throw new Boom('No image processing library available')
}

export const hkdfInfoKey = (type: MediaType) => {
	let str: string = type
	if(type === 'sticker') {
		str = 'image'
	}

	if(type === 'md-app-state') {
		str = 'App State'
	}

	const hkdfInfo = str[0].toUpperCase() + str.slice(1)
	return `WhatsApp ${hkdfInfo} Keys`
}

/** generates all the keys required to encrypt/decrypt & sign a media message */
export function getMediaKeys(buffer: Uint8Array | string | null | undefined, mediaType: MediaType): MediaDecryptionKeyInfo {
	if(!buffer) {
		throw new Boom('Cannot derive from empty media key')
	}

	if(typeof buffer === 'string') {
		buffer = Buffer.from(buffer.replace('data:;base64,', ''), 'base64')
	}

	// expand using HKDF to 112 bytes, also pass in the relevant app info
	const expandedMediaKey = hkdf(buffer, 112, { info: hkdfInfoKey(mediaType) })
	return {
		iv: expandedMediaKey.slice(0, 16),
		cipherKey: expandedMediaKey.slice(16, 48),
		macKey: expandedMediaKey.slice(48, 80),
	}
}

/** Extracts video thumb using FFMPEG */
const extractVideoThumb = async(
	path: string,
	destPath: string,
	time: string,
	size: { width: number; height: number },
) => new Promise((resolve, reject) => {
    	const cmd = `ffmpeg -ss ${time} -i ${path} -y -vf scale=${size.width}:-1 -vframes 1 -f image2 ${destPath}`
    	exec(cmd, (err) => {
    		if(err) {
			reject(err)
		} else {
			resolve()
		}
    	})
}) as Promise<void>

export const extractImageThumb = async(bufferOrFilePath: Readable | Buffer | string, width = 32) => {
	if(bufferOrFilePath instanceof Readable) {
		bufferOrFilePath = await toBuffer(bufferOrFilePath)
	}

	const lib = await getImageProcessingLibrary()
	if('sharp' in lib) {
		const result = await lib.sharp!.default(bufferOrFilePath)
			.resize(width)
			.jpeg({ quality: 50 })
			.toBuffer()
		return result
	} else {
		const { read, MIME_JPEG, RESIZE_BILINEAR, AUTO } = lib.jimp

		const jimp = await read(bufferOrFilePath as any)
		const result = await jimp
			.quality(50)
			.resize(width, AUTO, RESIZE_BILINEAR)
			.getBufferAsync(MIME_JPEG)
		return result
	}
}

export const generateProfilePicture = async(mediaUpload: WAMediaUpload) => {
	let bufferOrFilePath: Buffer | string
	if(Buffer.isBuffer(mediaUpload)) {
		bufferOrFilePath = mediaUpload
	} else if('url' in mediaUpload) {
		bufferOrFilePath = mediaUpload.url.toString()
	} else {
		bufferOrFilePath = await toBuffer(mediaUpload.stream)
	}

	const lib = await getImageProcessingLibrary()
	let img: Promise<Buffer>
	if('sharp' in lib) {
		img = lib.sharp!.default(bufferOrFilePath)
			.resize(640, 640)
			.jpeg({
				quality: 50,
			})
			.toBuffer()
	} else {
		const { read, MIME_JPEG, RESIZE_BILINEAR } = lib.jimp
		const jimp = await read(bufferOrFilePath as any)
		const min = Math.min(jimp.getWidth(), jimp.getHeight())
		const cropped = jimp.crop(0, 0, min, min)

		img = cropped
			.quality(50)
			.resize(640, 640, RESIZE_BILINEAR)
			.getBufferAsync(MIME_JPEG)
	}

	return {
		img: await img,
	}
}

/** gets the SHA256 of the given media message */
export const mediaMessageSHA256B64 = (message: WAMessageContent) => {
	const media = Object.values(message)[0] as WAGenericMediaMessage
	return media?.fileSha256 && Buffer.from(media.fileSha256).toString ('base64')
}

export async function getAudioDuration(buffer: Buffer | string | Readable) {
	const musicMetadata = await import('music-metadata')
	let metadata: IAudioMetadata
	if(Buffer.isBuffer(buffer)) {
		metadata = await musicMetadata.parseBuffer(buffer, undefined, { duration: true })
	} else if(typeof buffer === 'string') {
		const rStream = createReadStream(buffer)
		metadata = await musicMetadata.parseStream(rStream, undefined, { duration: true })
		rStream.close()
	} else {
		metadata = await musicMetadata.parseStream(buffer, undefined, { duration: true })
	}

	return metadata.format.duration
}

export const toReadable = (buffer: Buffer) => {
	const readable = new Readable({ read: () => {} })
	readable.push(buffer)
	readable.push(null)
	return readable
}

export const toBuffer = async(stream: Readable) => {
	let buff = Buffer.alloc(0)
	for await (const chunk of stream) {
		buff = Buffer.concat([ buff, chunk ])
	}

	stream.destroy()
	return buff
}

export const getStream = async(item: WAMediaUpload) => {
	if(Buffer.isBuffer(item)) {
		return { stream: toReadable(item), type: 'buffer' }
	}

	if('stream' in item) {
		return { stream: item.stream, type: 'readable' }
	}

	if(item.url.toString().startsWith('http://') || item.url.toString().startsWith('https://')) {
		return { stream: await getHttpStream(item.url), type: 'remote' }
	}

	return { stream: createReadStream(item.url), type: 'file' }
}

/** generates a thumbnail for a given media, if required */
export async function generateThumbnail(
	file: string,
	mediaType: 'video' | 'image',
	options: {
        logger?: Logger
    }
) {
	let thumbnail: string | undefined
	if(mediaType === 'image') {
		const buff = await extractImageThumb(file)
		thumbnail = buff.toString('base64')
	} else if(mediaType === 'video') {
		const imgFilename = join(getTmpFilesDirectory(), generateMessageID() + '.jpg')
		try {
			await extractVideoThumb(file, imgFilename, '00:00:00', { width: 32, height: 32 })
			const buff = await fs.readFile(imgFilename)
			thumbnail = buff.toString('base64')

			await fs.unlink(imgFilename)
		} catch(err) {
			options.logger?.debug('could not generate video thumb: ' + err)
		}
	}

	return thumbnail
}

export const getHttpStream = async(url: string | URL, options: AxiosRequestConfig & { isStream?: true } = {}) => {
	const { default: axios } = await import('axios')
	const fetched = await axios.get(url.toString(), { ...options, responseType: 'stream' })
	return fetched.data as Readable
}

export const encryptedStream = async(
	media: WAMediaUpload,
	mediaType: MediaType,
	saveOriginalFileIfRequired = true,
	logger?: Logger
) => {
	const { stream, type } = await getStream(media)

	logger?.debug('fetched media stream')

	const mediaKey = Crypto.randomBytes(32)
	const { cipherKey, iv, macKey } = getMediaKeys(mediaKey, mediaType)
	// random name
	//const encBodyPath = join(getTmpFilesDirectory(), mediaType + generateMessageID() + '.enc')
	// const encWriteStream = createWriteStream(encBodyPath)
	const encWriteStream = new Readable({ read: () => {} })

	let bodyPath: string | undefined
	let writeStream: WriteStream | undefined
	let didSaveToTmpPath = false
	if(type === 'file') {
		bodyPath = (media as any).url
	} else if(saveOriginalFileIfRequired) {
		bodyPath = join(getTmpFilesDirectory(), mediaType + generateMessageID())
		writeStream = createWriteStream(bodyPath)
		didSaveToTmpPath = true
	}

	let fileLength = 0
	const aes = Crypto.createCipheriv('aes-256-cbc', cipherKey, iv)
	let hmac = Crypto.createHmac('sha256', macKey!).update(iv)
	let sha256Plain = Crypto.createHash('sha256')
	let sha256Enc = Crypto.createHash('sha256')

	const onChunk = (buff: Buffer) => {
		sha256Enc = sha256Enc.update(buff)
		hmac = hmac.update(buff)
		encWriteStream.push(buff)
	}

	try {
		for await (const data of stream) {
			fileLength += data.length
			sha256Plain = sha256Plain.update(data)
			if(writeStream) {
				if(!writeStream.write(data)) {
					await once(writeStream, 'drain')
				}
			}

			onChunk(aes.update(data))
		}

		onChunk(aes.final())

		const mac = hmac.digest().slice(0, 10)
		sha256Enc = sha256Enc.update(mac)

		const fileSha256 = sha256Plain.digest()
		const fileEncSha256 = sha256Enc.digest()

		encWriteStream.push(mac)
		encWriteStream.push(null)

		writeStream && writeStream.end()
		stream.destroy()

		logger?.debug('encrypted data successfully')

		return {
			mediaKey,
			encWriteStream,
			bodyPath,
			mac,
			fileEncSha256,
			fileSha256,
			fileLength,
			didSaveToTmpPath
		}
	} catch(error) {
		encWriteStream.destroy(error)
		writeStream?.destroy(error)
		aes.destroy(error)
		hmac.destroy(error)
		sha256Plain.destroy(error)
		sha256Enc.destroy(error)
		stream.destroy(error)

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
}

export const getUrlFromDirectPath = (directPath: string) => `https://${DEF_HOST}${directPath}`

export const downloadContentFromMessage = (
	{ mediaKey, directPath, url }: DownloadableMessage,
	type: MediaType,
	opts: MediaDownloadOptions = { }
) => {
	const downloadUrl = url || getUrlFromDirectPath(directPath!)
	const keys = getMediaKeys(mediaKey, type)

	return downloadEncryptedContent(downloadUrl, keys, opts)
}

/**
 * Decrypts and downloads an AES256-CBC encrypted file given the keys.
 * Assumes the SHA256 of the plaintext is appended to the end of the ciphertext
 * */
export const downloadEncryptedContent = async(
	downloadUrl: string,
	{ cipherKey, iv }: MediaDecryptionKeyInfo,
	{ startByte, endByte }: MediaDownloadOptions = { }
) => {
	let bytesFetched = 0
	let startChunk = 0
	let firstBlockIsIV = false
	// if a start byte is specified -- then we need to fetch the previous chunk as that will form the IV
	if(startByte) {
		const chunk = toSmallestChunkSize(startByte || 0)
		if(chunk) {
			startChunk = chunk - AES_CHUNK_SIZE
			bytesFetched = chunk

			firstBlockIsIV = true
		}
	}

	const endChunk = endByte ? toSmallestChunkSize(endByte || 0) + AES_CHUNK_SIZE : undefined

	const headers: { [_: string]: string } = {
		Origin: DEFAULT_ORIGIN,
	}
	if(startChunk || endChunk) {
		headers.Range = `bytes=${startChunk}-`
		if(endChunk) {
			headers.Range += endChunk
		}
	}

	// download the message
	const fetched = await getHttpStream(
		downloadUrl,
		{
			headers,
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
		}
	)

	let remainingBytes = Buffer.from([])

	let aes: Crypto.Decipher

	const pushBytes = (bytes: Buffer, push: (bytes: Buffer) => void) => {
		if(startByte || endByte) {
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

			if(!aes) {
				let ivValue = iv
				if(firstBlockIsIV) {
					ivValue = data.slice(0, AES_CHUNK_SIZE)
					data = data.slice(AES_CHUNK_SIZE)
				}

				aes = Crypto.createDecipheriv('aes-256-cbc', cipherKey, ivValue)
				// if an end byte that is not EOF is specified
				// stop auto padding (PKCS7) -- otherwise throws an error for decryption
				if(endByte) {
					aes.setAutoPadding(false)
				}

			}

			try {
				pushBytes(aes.update(data), b => this.push(b))
				callback()
			} catch(error) {
				callback(error)
			}
		},
		final(callback) {
			try {
				pushBytes(aes.final(), b => this.push(b))
				callback()
			} catch(error) {
				callback(error)
			}
		},
	})
	return fetched.pipe(output, { end: true })
}

export function extensionForMediaMessage(message: WAMessageContent) {
	const getExtension = (mimetype: string) => mimetype.split(';')[0].split('/')[1]
	const type = Object.keys(message)[0] as MessageType
	let extension: string
	if(
		type === 'locationMessage' ||
		type === 'liveLocationMessage' ||
		type === 'productMessage'
	) {
		extension = '.jpeg'
	} else {
		const messageContent = message[type] as WAGenericMediaMessage
		extension = getExtension(messageContent.mimetype!)
	}

	return extension
}

export const getWAUploadToServer = ({ customUploadHosts, fetchAgent, logger }: CommonSocketConfig, refreshMediaConn: (force: boolean) => Promise<MediaConnInfo>): WAMediaUploadFunction => {
	return async(stream, { mediaType, fileEncSha256B64, timeoutMs }) => {
		const { default: axios } = await import('axios')
		// send a query JSON to obtain the url & auth token to upload our media
		let uploadInfo = await refreshMediaConn(false)

		let urls: { mediaUrl: string, directPath: string } | undefined
		const hosts = [ ...customUploadHosts, ...uploadInfo.hosts ]

		const chunks: Buffer[] = []
		for await (const chunk of stream) {
			chunks.push(chunk)
		}

		const reqBody = Buffer.concat(chunks)

		for(const { hostname, maxContentLengthBytes } of hosts) {
			logger.debug(`uploading to "${hostname}"`)

			const auth = encodeURIComponent(uploadInfo.auth) // the auth token
			const url = `https://${hostname}${MEDIA_PATH_MAP[mediaType]}/${fileEncSha256B64}?auth=${auth}&token=${fileEncSha256B64}`
			let result: any
			try {
				if(maxContentLengthBytes && reqBody.length > maxContentLengthBytes) {
					throw new Boom(`Body too large for "${hostname}"`, { statusCode: 413 })
				}

				const body = await axios.post(
					url,
					reqBody,
					{
						headers: {
							'Content-Type': 'application/octet-stream',
							'Origin': DEFAULT_ORIGIN
						},
						httpsAgent: fetchAgent,
						timeout: timeoutMs,
						responseType: 'json',
						maxBodyLength: Infinity,
						maxContentLength: Infinity,
					}
				)
				result = body.data

				if(result?.url || result?.directPath) {
					urls = {
						mediaUrl: result.url,
						directPath: result.direct_path
					}
					break
				} else {
					uploadInfo = await refreshMediaConn(true)
					throw new Error(`upload failed, reason: ${JSON.stringify(result)}`)
				}
			} catch(error) {
				if(axios.isAxiosError(error)) {
					result = error.response?.data
				}

				const isLast = hostname === hosts[uploadInfo.hosts.length - 1]?.hostname
				logger.warn({ trace: error.stack, uploadResult: result }, `Error in uploading to ${hostname} ${isLast ? '' : ', retrying...'}`)
			}
		}

		if(!urls) {
			throw new Boom(
				'Media upload failed on all hosts',
				{ statusCode: 500 }
			)
		}

		return urls
	}
}

const GCM_AUTH_TAG_LENGTH: number | undefined = 128 >> 3

const getMediaRetryKey = (mediaKey: Buffer | Uint8Array) => {
	return hkdf(mediaKey, 32, { info: 'WhatsApp Media Retry Notification' })
}

/**
 * Generate a binary node that will request the phone to re-upload the media & return the newly uploaded URL
 */
export const encryptMediaRetryRequest = (
	key: proto.IMessageKey,
	mediaKey: Buffer | Uint8Array,
	meId: string
) => {
	const recp: proto.IServerErrorReceipt = { stanzaId: key.id }
	const recpBuffer = proto.ServerErrorReceipt.encode(recp).finish()

	const iv = Crypto.randomBytes(12)
	const retryKey = getMediaRetryKey(mediaKey)
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
				attrs: { },
				content: [
					{ tag: 'enc_p', attrs: { }, content: ciphertext },
					{ tag: 'enc_iv', attrs: { }, content: iv }
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

	const event: BaileysEventMap<any>['messages.media-update'][number] = {
		key: {
			id: node.attrs.id,
			remoteJid: rmrNode.attrs.jid,
			fromMe: rmrNode.attrs.from_me === 'true',
			participant: rmrNode.attrs.participant
		}
	}

	const errorNode = getBinaryNodeChild(node, 'error')
	if(errorNode) {
		const errorCode = +errorNode.attrs.code
		event.error = new Boom(
			`Failed to re-upload media (${errorCode})`,
			{ data: errorNode.attrs, statusCode: getStatusCodeForMediaRetry(errorCode) }
		)
	} else {
		const encryptedInfoNode = getBinaryNodeChild(node, 'encrypt')
		const ciphertext = getBinaryNodeChildBuffer(encryptedInfoNode, 'enc_p')
		const iv = getBinaryNodeChildBuffer(encryptedInfoNode, 'enc_iv')
		if(ciphertext && iv) {
			event.media = { ciphertext, iv }
		} else {
			event.error = new Boom('Failed to re-upload media (missing ciphertext)', { statusCode: 404 })
		}
	}

	return event
}

export const decryptMediaRetryData = (
	{ ciphertext, iv }: { ciphertext: Uint8Array, iv: Uint8Array },
	mediaKey: Uint8Array,
	msgId: string
) => {
	const retryKey = getMediaRetryKey(mediaKey)
	const plaintext = aesDecryptGCM(ciphertext, retryKey, iv, Buffer.from(msgId))
	return proto.MediaRetryNotification.decode(plaintext)
}

export const getStatusCodeForMediaRetry = (code: number) => MEDIA_RETRY_STATUS_MAP[code]

const MEDIA_RETRY_STATUS_MAP = {
	[proto.MediaRetryNotification.ResultType.SUCCESS]: 200,
	[proto.MediaRetryNotification.ResultType.DECRYPTION_ERROR]: 412,
	[proto.MediaRetryNotification.ResultType.NOT_FOUND]: 404,
	[proto.MediaRetryNotification.ResultType.GENERAL_ERROR]: 418,
} as const
