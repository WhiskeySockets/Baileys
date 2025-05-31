import { AxiosRequestConfig } from 'axios'
import { WAMediaUploadFunction, WAUrlInfo } from '../Types'
import { ILogger } from './logger'
import { prepareWAMessageMedia } from './messages'
import { extractImageThumb, getHttpStream } from './messages-media'

const THUMBNAIL_WIDTH_PX = 192

/** Fetches an image and generates a thumbnail for it */
const getCompressedJpegThumbnail = async (url: string, { thumbnailWidth, fetchOpts }: URLGenerationOptions) => {
	const stream = await getHttpStream(url, fetchOpts)
	const result = await extractImageThumb(stream, thumbnailWidth)
	return result
}

/** Processes base64 image and generates a thumbnail for it */
const getCompressedJpegThumbnailFromBase64 = async (image: string, { thumbnailWidth }: URLGenerationOptions) => {
	const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/)
	if (!matches || matches.length !== 3) {
		throw new Error("Invalid base64 image format")
	}
	
	const extension = matches[1]
	const base64Data = matches[2]
	const buffer = Buffer.from(base64Data, 'base64')
	const result = await extractImageThumb(buffer, thumbnailWidth)
	return { result, extension }
}

/** Checks if a string is a base64 encoded image */
const isBase64Image = (str: string): boolean => {
	const matches = str.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/)
	return matches !== null && matches.length === 3
}

export type URLGenerationOptions = {
	thumbnailWidth: number
	fetchOpts: {
		/** Timeout in ms */
		timeout: number
		proxyUrl?: string
		headers?: AxiosRequestConfig<{}>['headers']
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
export const getUrlInfo = async (
	text: string,
	opts: URLGenerationOptions = {
		thumbnailWidth: THUMBNAIL_WIDTH_PX,
		fetchOpts: { timeout: 3000 }
	}
): Promise<WAUrlInfo | undefined> => {
	try {
		// retries
		const retries = 0
		const maxRetry = 5
		const { getLinkPreview } = await import('link-preview-js')
		let previewLink = text
		if (!text.startsWith('https://') && !text.startsWith('http://')) {
			previewLink = 'https://' + previewLink
		}
		const info = await getLinkPreview(previewLink, {
			...opts.fetchOpts,
			followRedirects: 'follow',
			handleRedirects: (baseURL: string, forwardedURL: string) => {
				const urlObj = new URL(baseURL)
				const forwardedURLObj = new URL(forwardedURL)
				if (retries >= maxRetry) {
					return false
				}
				if (
					forwardedURLObj.hostname === urlObj.hostname ||
					forwardedURLObj.hostname === 'www.' + urlObj.hostname ||
					'www.' + forwardedURLObj.hostname === urlObj.hostname
				) {
					retries + 1
					return true
				} else {
					return false
				}
			},
			headers: opts.fetchOpts as {}
		})
		if (info && 'title' in info && info.title) {
			const [image] = info.images
			const urlInfo: WAUrlInfo = {
				'canonical-url': info.url,
				'matched-text': text,
				title: info.title,
				description: info.description,
				originalThumbnailUrl: image
			}

			// Handle image processing - check if it's base64 or URL
			if (image) {
				if (opts.uploadImage) {
					let imageInput: { url: string } | { data: Buffer }
					
					if (isBase64Image(image)) {
						// Handle base64 image
						const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/)
						if (matches && matches.length === 3) {
							const base64Data = matches[2]
							const buffer = Buffer.from(base64Data, 'base64')
							imageInput = { data: buffer }
						} else {
							opts.logger?.debug({ image: image.substring(0, 50) + '...' }, 'Invalid base64 image format')
							return urlInfo
						}
					} else {
						// Handle URL image
						imageInput = { url: image }
					}

					const { imageMessage } = await prepareWAMessageMedia(
						{ image: imageInput },
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
						if (isBase64Image(image)) {
							// Process base64 image
							const { result } = await getCompressedJpegThumbnailFromBase64(image, opts)
							urlInfo.jpegThumbnail = result.buffer
						} else {
							// Process URL image
							urlInfo.jpegThumbnail = (await getCompressedJpegThumbnail(image, opts)).buffer
						}
					} catch (error) {
						opts.logger?.debug({ 
							err: error.stack, 
							url: previewLink, 
							imageType: isBase64Image(image) ? 'base64' : 'url' 
						}, 'error in generating thumbnail')
					}
				}
			}
			
			return urlInfo
		}
	} catch (error) {
		if (!error.message.includes('receive a valid')) {
			throw error
		}
	}
}
