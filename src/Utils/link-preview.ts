import { lookup } from 'node:dns'
import net from 'node:net'
import type { WAMediaUploadFunction, WAUrlInfo } from '../Types'
import type { ILogger } from './logger'
import { prepareWAMessageMedia } from './messages'
import { extractImageThumb, getHttpStream } from './messages-media'

const THUMBNAIL_WIDTH_PX = 192

/** Fetches an image and generates a thumbnail for it */
const getCompressedJpegThumbnail = async(url: string, { thumbnailWidth, fetchOpts }: URLGenerationOptions) => {
	const stream = await getHttpStream(url, fetchOpts)
	const result = await extractImageThumb(stream, thumbnailWidth)
	return result
}

export type URLGenerationOptions = {
	thumbnailWidth: number
	fetchOpts: {
		/** Timeout in ms */
		timeout: number
		proxyUrl?: string
		headers?: HeadersInit
	}
	uploadImage?: WAMediaUploadFunction
	logger?: ILogger
}

/**
 * Given a piece of text, checks for any URL present, generates link preview for the same and returns it
 * Return undefined if the fetch failed or no URL was found
 * @param text first matched URL in text
 * @returns the URL info required to generate link preview
 */
export const getUrlInfo = async(
	text: string,
	opts: URLGenerationOptions = {
		thumbnailWidth: THUMBNAIL_WIDTH_PX,
		fetchOpts: { timeout: 3000 }
	}
): Promise<WAUrlInfo | undefined> => {

	function isPrivateOrReservedIp(ip: string) {
		if(net.isIP(ip) === 0) {
			return false
		}

		if(ip === '::1') {
			return true
		}

		const octets = ip.split('.').map(Number)
		const [a, b] = octets

		return (
			a === 10 ||
			a === 127 ||
			(a === 192 && b === 168) ||
			(a === 172 && b >= 16 && b <= 31) ||
			(a === 169 && b === 254) ||
			(a === 100 && b >= 64 && b <= 127) || // Carrier-grade NAT
			(a === 0) || // "This" network
			(a >= 224 && a <= 239) // Multicast
		)
	}

	try {
		const { getLinkPreview } = await import('link-preview-js')

		let previewLink = text
		if(!text.startsWith('https://') && !text.startsWith('http://')) {
			previewLink = 'https://' + previewLink
		}

		const info = await getLinkPreview(previewLink, {
			...opts.fetchOpts,
			headers: opts.fetchOpts?.headers as {},
			resolveDNSHost: async(url: string) => {
				return new Promise((resolve, reject) => {
					const hostname = new URL(url).hostname
					lookup(hostname, (err, address) => {
						if(err) {
							return reject(err)
						}

						if(isPrivateOrReservedIp(address)) {
							return reject(new Error(`SSRF attempt detected: ${hostname} resolves to a reserved IP address ${address}`))
						}

						resolve(address)
					})
				})
			},
		})

		if(info && 'title' in info && info.title) {
			const [image] = info.images

			const urlInfo: WAUrlInfo = {
				'canonical-url': info.url,
				'matched-text': text,
				title: info.title,
				description: info.description,
				originalThumbnailUrl: image
			}

			if(opts.uploadImage) {
				const { imageMessage } = await prepareWAMessageMedia(
					{ image: { url: image! } },
					{
						upload: opts.uploadImage,
						mediaTypeOverride: 'thumbnail-link',
						options: opts.fetchOpts
					}
				)
				urlInfo.jpegThumbnail = imageMessage?.jpegThumbnail ? Buffer.from(imageMessage.jpegThumbnail) : undefined
				urlInfo.highQualityThumbnail = imageMessage || undefined
			} else {
				try {
					urlInfo.jpegThumbnail = image ? (await getCompressedJpegThumbnail(image, opts)).buffer : undefined
				} catch (error: any) {
					opts.logger?.debug({ err: error.stack, url: previewLink }, 'error in generating thumbnail')
				}
			}

			return urlInfo
		}
	} catch (error: any) {
		if(!error.message.includes('receive a valid')) {
			throw error
		}
	}
}
