import { WAUrlInfo } from '../Types'
import { extractImageThumb, getHttpStream } from './messages-media'

const THUMBNAIL_WIDTH_PX = 192

/** Fetches an image and generates a thumbnail for it */
const getCompressedJpegThumbnail = async(url: string, { thumbnailWidth, timeoutMs }: URLGenerationOptions) => {
	const stream = await getHttpStream(url, { timeout: timeoutMs })
	const result = await extractImageThumb(stream, thumbnailWidth)
	return result
}

export type URLGenerationOptions = {
	thumbnailWidth: number
	timeoutMs: number
}

/**
 * Given a piece of text, checks for any URL present, generates link preview for the same and returns it
 * Return undefined if the fetch failed or no URL was found
 * @param text the text containing URL
 * @returns the URL info required to generate link preview
 */
export const getUrlInfo = async(
	text: string,
	opts: URLGenerationOptions = { thumbnailWidth: THUMBNAIL_WIDTH_PX, timeoutMs: 3000 }
): Promise<WAUrlInfo | undefined> => {
	try {
		const { getLinkPreview } = await import('link-preview-js')

		const info = await getLinkPreview(text, { timeout: opts.timeoutMs })
		if(info && 'title' in info) {
			const [image] = info.images

			const jpegThumbnail = image
				? await getCompressedJpegThumbnail(image, opts)
				: undefined

			return {
				'canonical-url': info.url,
				'matched-text': info.url,
				title: info.title,
				description: info.description,
				jpegThumbnail
			}
		}
	} catch(error) {
		if(!error.message.includes('receive a valid')) {
			throw error
		}
	}
}