import type { LookupAddress } from 'dns'
import { lookup } from 'dns/promises'
import * as http from 'http'
import * as https from 'https'
import { isIP } from 'net'
import type { WAMediaUploadFunction, WAUrlInfo } from '../Types'
import type { ILogger } from './logger'
import { prepareWAMessageMedia } from './messages'
import { extractImageThumb } from './messages-media'

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
	const normalizedNames = names.map(n => n.toLowerCase())
	const found: Record<string, string> = {}
	let tagMatch: RegExpExecArray | null
	while ((tagMatch = metaTagRegex.exec(html))) {
		const tag = tagMatch[0]
		const attrs = parseTagAttributes(tag)
		const name = (attrs.name || attrs.property || '').toLowerCase()
		const content = attrs.content
		if (!content || !name) {
			continue
		}

		if (normalizedNames.includes(name) && !(name in found)) {
			found[name] = decodeEntities(content)
		}
	}

	for (const name of normalizedNames) {
		if (name in found) {
			return found[name]
		}
	}
}

const getCanonicalLinkHref = (html: string) => {
	const linkTagRegex = /<link\b[^>]*>/gi
	let tagMatch: RegExpExecArray | null
	while ((tagMatch = linkTagRegex.exec(html))) {
		const attrs = parseTagAttributes(tagMatch[0])
		const rels = (attrs.rel || '').toLowerCase().split(/\s+/)
		if (rels.includes('canonical') && attrs.href) {
			return decodeEntities(attrs.href)
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

/**
 * Resolves the hostname once, rejects private/loopback addresses, and returns the vetted
 * addresses so callers can pin the connection to them and avoid a TOCTOU DNS rebinding.
 */
const assertSafeHostname = async (hostname: string): Promise<LookupAddress[]> => {
	const normalizedHost = hostname.toLowerCase().replace(/\.$/, '')
	if (LOCALHOST_HOSTS.has(normalizedHost) || normalizedHost.endsWith('.localhost')) {
		throw new Error(`blocked host "${hostname}"`)
	}

	const family = isIP(normalizedHost)
	if (family > 0) {
		if (isPrivateIpAddress(normalizedHost)) {
			throw new Error(`blocked private ip "${hostname}"`)
		}

		return [{ address: normalizedHost, family }]
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

	return addresses
}

const assertSafeUrl = async (url: URL): Promise<LookupAddress[]> => {
	if (url.protocol !== 'http:' && url.protocol !== 'https:') {
		throw new Error(`unsupported protocol "${url.protocol}"`)
	}

	return assertSafeHostname(url.hostname)
}

const headersToOutgoingMap = (headers: HeadersInit | undefined): Record<string, string> => {
	const out: Record<string, string> = {}
	if (!headers) return out
	if (headers instanceof Headers) {
		headers.forEach((v, k) => {
			out[k] = v
		})
		return out
	}

	if (Array.isArray(headers)) {
		for (const [k, v] of headers) out[k] = v
		return out
	}

	for (const k of Object.keys(headers)) out[k] = (headers as Record<string, string>)[k]!
	return out
}

/**
 * Issues an HTTP(S) GET that connects only to a pre-vetted address. The custom
 * `lookup` returns the address that {@link assertSafeHostname} already validated,
 * so the OS resolver is not consulted again — this closes the DNS-rebinding TOCTOU
 * window while preserving the original hostname for the Host header and TLS SNI.
 */
const requestPinned = (
	url: URL,
	addresses: LookupAddress[],
	headers: Record<string, string>,
	signal: AbortSignal
): Promise<http.IncomingMessage> => {
	const protoModule = url.protocol === 'https:' ? https : http
	const pinned = addresses[0]!
	return new Promise((resolve, reject) => {
		const req = protoModule.request(
			url,
			{
				method: 'GET',
				headers,
				lookup: (_hostname, _options, cb) => cb(null, pinned.address, pinned.family),
				signal
			},
			res => resolve(res)
		)
		req.on('error', reject)
		req.end()
	})
}

const assertContentLengthWithinLimit = (response: http.IncomingMessage, maxBytes: number) => {
	const contentLengthHeader = response.headers['content-length']
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

const assertHtmlContentType = (response: http.IncomingMessage) => {
	const contentType = (response.headers['content-type'] || '').toLowerCase()
	if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
		response.destroy()
		throw new Error(`unsupported content-type "${contentType}"`)
	}
}

const HEAD_MARKERS = ['</head>', '<body']
const MARKER_OVERLAP = Math.max(...HEAD_MARKERS.map(m => m.length)) - 1

const readResponseBody = async (response: http.IncomingMessage, maxBytes: number) => {
	const chunks: Buffer[] = []
	let totalBytes = 0
	let tailStr = ''

	for await (const chunk of response) {
		const buff = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
		totalBytes += buff.length
		chunks.push(buff)

		if (totalBytes > maxBytes) {
			response.destroy()
			throw new Error(`response exceeded ${maxBytes} bytes`)
		}

		const window = tailStr + buff.toString('utf8')
		if (HEAD_MARKERS.some(m => window.includes(m))) {
			response.destroy()
			break
		}

		tailStr = window.length > MARKER_OVERLAP ? window.slice(-MARKER_OVERLAP) : window
	}

	return Buffer.concat(chunks)
}

const fetchWithGuards = async (
	input: string,
	fetchOpts: NormalizedFetchOptions,
	opts: { requireHtml?: boolean } = {}
): Promise<{ body: Buffer; contentType: string; finalUrl: string }> => {
	if (fetchOpts.proxyUrl) {
		// Pinning the DNS lookup is meaningless when a proxy is in front — the proxy
		// resolves the target itself. Refuse rather than silently falling back to a
		// vulnerable path.
		throw new Error('proxyUrl is not supported for link previews')
	}

	let currentUrl = new URL(input)
	const timeoutSignal = AbortSignal.timeout(fetchOpts.timeout)
	const headers = headersToOutgoingMap(fetchOpts.headers)

	for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
		const vettedAddresses = await assertSafeUrl(currentUrl)
		const response = await requestPinned(currentUrl, vettedAddresses, headers, timeoutSignal)
		const status = response.statusCode ?? 0

		if (status >= 300 && status < 400) {
			const location = response.headers.location
			// Drain/destroy the 3xx body so the underlying socket is released before we follow.
			response.resume()
			response.destroy()
			if (!location) {
				throw new Error(`redirect from "${currentUrl}" missing location header`)
			}

			currentUrl = new URL(location, currentUrl)
			continue
		}

		if (status < 200 || status >= 300) {
			response.destroy()
			throw new Error(`failed to fetch "${currentUrl}" with status ${status}`)
		}

		if (opts.requireHtml) {
			assertHtmlContentType(response)
		}

		assertContentLengthWithinLimit(response, fetchOpts.maxContentLength)

		return {
			body: await readResponseBody(response, fetchOpts.maxContentLength),
			contentType: response.headers['content-type'] || '',
			finalUrl: currentUrl.toString()
		}
	}

	throw new Error(`too many redirects, max allowed is ${MAX_REDIRECTS}`)
}

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
	'blocked host',
	'blocked private ip',
	'blocked private ip resolution'
]

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
		const canonicalCandidate =
			getMetaContent(html, ['og:url', 'twitter:url', 'canonical']) || getCanonicalLinkHref(html) || ''
		const canonicalUrl = toAbsoluteUrl(canonicalCandidate, finalUrl) || finalUrl

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
					options: normalizedFetchOpts as RequestInit & { maxContentLength: number }
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
