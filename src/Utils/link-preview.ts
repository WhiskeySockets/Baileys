import { WAUrlInfo } from '../Types'
import { extractImageThumb, getHttpStream } from './messages-media'

const THUMBNAIL_WIDTH_PX = 128

/** Fetches an image and generates a thumbnail for it */
const getCompressedJpegThumbnail = async(url: string) => {
	const stream = await getHttpStream(url)
	const result = await extractImageThumb(stream, THUMBNAIL_WIDTH_PX)
	return result
}

/**
 * Given a piece of text, checks for any URL present, generates link preview for the same and returns it
 * Return undefined if the fetch failed or no URL was found
 * @param text the text containing URL
 * @returns the URL info required to generate link preview
 */
export const getUrlInfo = async(text: string): Promise<WAUrlInfo | undefined> => {
	try {
		const { getLinkPreview } = await import('link-preview-js')

		const info = await getLinkPreview(text)
		if(info && 'title' in info) {
			const [image] = info.images

			const jpegThumbnail = image ? await getCompressedJpegThumbnail(image) : undefined

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