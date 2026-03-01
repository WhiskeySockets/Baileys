import type { WAMediaUploadFunction, WAUrlInfo } from '../Types'
import type { ILogger } from './logger'
import { prepareWAMessageMedia } from './messages'
import { extractImageThumb } from './messages-media'
import { Readable } from 'stream'
import { lookup } from 'dns/promises'
import { isIP } from 'net'

const THUMBNAIL_WIDTH_PX = 192
const MAX_LINK_PREVIEW_DOWNLOAD_BYTES = 10 * 1024 * 1024
const MAX_REDIRECTS = 5

type NormalizedFetchOptions = URLGenerationOptions['fetchOpts'] & {
	maxContentLength: number
}

const LOCALHOST_HOSTS = new Set(['localhost', 'localhost.localdomain'])

const sanitizeText = (text = '') =>
	text
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()

const decodeEntities = (text = '') =>
	text
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ')

const parseTagAttributes = (tag: string) => {
	const attrs: Record<string, string> = {}
	const attrRegex = /([a-zA-Z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g
	let match: RegExpExecArray | null
	while ((match = attrRegex.exec(tag))) {
		const key = match[1]?.toLowerCase()
		if (!key) {
			continue
		}

		attrs[key] = (match[2] || match[3] || match[4] || '').trim()
	}

	return attrs
}

const getMetaContent = (html: string, names: string[]) => {
	const metaTagRegex = /<meta\b[^>]*>/gi
	let tagMatch: RegExpExecArray | null
	while ((tagMatch = metaTagRegex.exec(html))) {
		const tag = tagMatch[0]
		const attrs = parseTagAttributes(tag)
		const name = (attrs.name || attrs.property || '').toLowerCase()
		const content = attrs.content
		if (!content) {
			continue
		}

		if (names.includes(name)) {
			return decodeEntities(content)
		}
	}
}

const getTitle = (html: string) => {
	const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)
	if (!titleMatch?.[1]) {
		return undefined
	}

	return decodeEntities(sanitizeText(titleMatch[1]))
}

const toAbsoluteUrl = (url: string, baseUrl: string) => {
	if (!url) {
		return undefined
	}

	try {
		return new URL(url, baseUrl).toString()
	} catch {
		return undefined
	}
}

const isPrivateIpv4 = (ip: string) => {
	const parts = ip.split('.').map(part => Number(part))
	if (parts.length !== 4 || parts.some(part => Number.isNaN(part) || part < 0 || part > 255)) {
		return true
	}

	const a = parts[0]!
	const b = parts[1]!
	if (a === 10 || a === 127 || a === 0) {
		return true
	}

	if (a === 100 && b >= 64 && b <= 127) {
		return true
	}

	if (a === 169 && b === 254) {
		return true
	}

	if (a === 172 && b >= 16 && b <= 31) {
		return true
	}

	if (a === 192 && b === 168) {
		return true
	}

	if (a >= 224) {
		return true
	}

	return false
}

const isPrivateIpv6 = (ip: string) => {
	const normalized = ip.toLowerCase()
	if (normalized === '::1' || normalized === '::') {
		return true
	}

	if (normalized.startsWith('fe80:')) {
		return true
	}

	if (normalized.startsWith('fc') || normalized.startsWith('fd')) {
		return true
	}

	if (normalized.startsWith('ff')) {
		return true
	}

	if (normalized.startsWith('::ffff:')) {
		const mappedIpv4 = normalized.slice('::ffff:'.length)
		if (isIP(mappedIpv4) === 4) {
			return isPrivateIpv4(mappedIpv4)
		}
	}

	return false
}

const isPrivateIpAddress = (ip: string) => {
	const family = isIP(ip)
	if (family === 4) {
		return isPrivateIpv4(ip)
	}

	if (family === 6) {
		return isPrivateIpv6(ip)
	}

	return true
}

const assertSafeHostname = async (hostname: string) => {
	const normalizedHost = hostname.toLowerCase().replace(/\.$/, '')
	if (LOCALHOST_HOSTS.has(normalizedHost) || normalizedHost.endsWith('.localhost')) {
		throw new Error(`blocked host "${hostname}"`)
	}

	if (isIP(normalizedHost) > 0) {
		if (isPrivateIpAddress(normalizedHost)) {
			throw new Error(`blocked private ip "${hostname}"`)
		}

		return
	}

	const addresses = await lookup(normalizedHost, { all: true, verbatim: true })
	if (!addresses.length) {
		throw new Error(`unable to resolve "${hostname}"`)
	}

	for (const { address } of addresses) {
		if (isPrivateIpAddress(address)) {
			throw new Error(`blocked private ip resolution "${hostname}" -> "${address}"`)
		}
	}
}

const assertSafeUrl = async (url: URL) => {
	if (url.protocol !== 'http:' && url.protocol !== 'https:') {
		throw new Error(`unsupported protocol "${url.protocol}"`)
	}

	await assertSafeHostname(url.hostname)
}

const toNodeStream = (stream: ReadableStream<Uint8Array>) => {
	// @ts-ignore Node18+ Readable.fromWeb exists
	return Readable.fromWeb(stream)
}

const assertContentLengthWithinLimit = (response: Response, maxBytes: number) => {
	const contentLengthHeader = response.headers.get('content-length')
	if (!contentLengthHeader) {
		return
	}

	const contentLength = Number(contentLengthHeader)
	if (Number.isNaN(contentLength)) {
		return
	}

	if (contentLength > maxBytes) {
		throw new Error(`content-length exceeded ${maxBytes} bytes`)
	}
}

const assertHtmlContentType = async (response: Response) => {
	const contentType = (response.headers.get('content-type') || '').toLowerCase()
	if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
		await response.body?.cancel()
		throw new Error(`unsupported content-type "${contentType}"`)
	}
}

const readResponseBody = async (response: Response, maxBytes: number, abortController: AbortController) => {
	if (!response.body) {
		return Buffer.alloc(0)
	}

	const stream = toNodeStream(response.body)
	const chunks: Buffer[] = []
	let totalBytes = 0

	for await (const chunk of stream) {
		const buff = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
		totalBytes += buff.length
		chunks.push(buff)

		if (totalBytes > maxBytes) {
			abortController.abort('response limit exceeded')
			stream.destroy()
			throw new Error(`response exceeded ${maxBytes} bytes`)
		}

		// Early exit once we've passed the head section — all OG tags will be there
		const partial = Buffer.concat(chunks).toString('utf8')
		if (partial.includes('</head>') || partial.includes('<body')) {
			abortController.abort('head section complete')
			stream.destroy()
			break
		}
	}

	return Buffer.concat(chunks)
}

const fetchWithGuards = async (
	input: string,
	fetchOpts: NormalizedFetchOptions,
	opts: { requireHtml?: boolean } = {}
): Promise<{ body: Buffer; contentType: string; finalUrl: string }> => {
	let currentUrl = new URL(input)

	// Create timeout signal once so it covers the entire operation including redirects
	const timeoutSignal = AbortSignal.timeout(fetchOpts.timeout)

	for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
		await assertSafeUrl(currentUrl)
		const abortController = new AbortController()

		const response = await fetch(currentUrl, {
			method: 'GET',
			redirect: 'manual',
			headers: fetchOpts.headers,
			signal: AbortSignal.any([timeoutSignal, abortController.signal])
		})

		if (response.status >= 300 && response.status < 400) {
			const location = response.headers.get('location')
			if (!location) {
				throw new Error(`redirect from "${currentUrl}" missing location header`)
			}

			currentUrl = new URL(location, currentUrl)
			continue
		}

		if (!response.ok) {
			throw new Error(`failed to fetch "${currentUrl}" with status ${response.status}`)
		}

		// Only enforce HTML content-type when fetching pages, not images
		if (opts.requireHtml) {
			await assertHtmlContentType(response)
		}

		assertContentLengthWithinLimit(response, fetchOpts.maxContentLength)

		return {
			body: await readResponseBody(response, fetchOpts.maxContentLength, abortController),
			contentType: response.headers.get('content-type') || '',
			finalUrl: currentUrl.toString()
		}
	}

	throw new Error(`too many redirects, max allowed is ${MAX_REDIRECTS}`)
}

/** Fetches an image and generates a thumbnail for it */
const getCompressedJpegThumbnail = async (
	url: string,
	{ thumbnailWidth, fetchOpts }: { thumbnailWidth: number; fetchOpts: NormalizedFetchOptions }
) => {
	const { body } = await fetchWithGuards(url, fetchOpts)

	return await extractImageThumb(body, thumbnailWidth)
}

export type URLGenerationOptions = {
	thumbnailWidth: number
	fetchOpts: {
		/** Timeout in ms */
		timeout: number
		proxyUrl?: string
		headers?: HeadersInit
		maxContentLength?: number
	}
	uploadImage?: WAMediaUploadFunction
	logger?: ILogger
}

const SWALLOWED_ERROR_PATTERNS = [
	'Invalid URL',
	'unsupported protocol',
	'unsupported content-type',
	'blocked',
]

/**
 * Given a piece of text, checks for any URL present, generates link preview for the same and returns it
 * Return undefined if the fetch failed or no URL was found
 * @param text first matched URL in text
 * @param opts
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
		let previewLink = text
		if (!text.startsWith('https://') && !text.startsWith('http://')) {
			previewLink = 'https://' + previewLink
		}

		const normalizedFetchOpts: NormalizedFetchOptions = {
			...opts.fetchOpts,
			timeout: opts.fetchOpts.timeout > 0 ? opts.fetchOpts.timeout : 3000,
			maxContentLength: opts.fetchOpts.maxContentLength || MAX_LINK_PREVIEW_DOWNLOAD_BYTES
		}

		const { body, finalUrl } = await fetchWithGuards(previewLink, normalizedFetchOpts, { requireHtml: true })

		const html = body.toString('utf8')
		const title = getMetaContent(html, ['og:title', 'twitter:title']) || getTitle(html)
		if (!title) {
			return
		}

		const description = getMetaContent(html, ['og:description', 'twitter:description', 'description']) || undefined

		const imageFromMeta = getMetaContent(html, ['og:image', 'twitter:image', 'twitter:image:src'])
		const image = imageFromMeta ? toAbsoluteUrl(imageFromMeta, finalUrl) : undefined
		const canonicalUrl =
			toAbsoluteUrl(getMetaContent(html, ['og:url', 'twitter:url', 'canonical']) || '', finalUrl) || finalUrl

		const urlInfo: WAUrlInfo = {
			'canonical-url': canonicalUrl,
			'matched-text': text,
			title,
			description,
			originalThumbnailUrl: image
		}

		if (opts.uploadImage && image) {
			await assertSafeUrl(new URL(image))

			const { imageMessage } = await prepareWAMessageMedia(
				{ image: { url: image } },
				{
					upload: opts.uploadImage,
					mediaTypeOverride: 'thumbnail-link',
					options: {
						...opts.fetchOpts,
						maxContentLength: normalizedFetchOpts.maxContentLength
					} as RequestInit & { maxContentLength: number }
				}
			)
			urlInfo.jpegThumbnail = imageMessage?.jpegThumbnail ? Buffer.from(imageMessage.jpegThumbnail) : undefined
			urlInfo.highQualityThumbnail = imageMessage || undefined
		} else {
			try {
				urlInfo.jpegThumbnail = image
					? (
							await getCompressedJpegThumbnail(image, {
								thumbnailWidth: opts.thumbnailWidth,
								fetchOpts: normalizedFetchOpts
							})
						).buffer
					: undefined
			} catch (error: any) {
				opts.logger?.debug({ err: error.stack, url: previewLink }, 'error in generating thumbnail')
			}
		}

		return urlInfo
	} catch (error: any) {
		if (!SWALLOWED_ERROR_PATTERNS.some(pattern => error?.message?.includes(pattern))) {
			throw error
		}
	}
}
