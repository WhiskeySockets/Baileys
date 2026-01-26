import { Boom } from '@hapi/boom'
import { randomBytes } from 'crypto'
import { promises as fs } from 'fs'
import { type Transform } from 'stream'
import { proto } from '../../WAProto/index.js'
import {
	CALL_AUDIO_PREFIX,
	CALL_VIDEO_PREFIX,
	MEDIA_KEYS,
	type MediaType,
	URL_REGEX,
	WA_DEFAULT_EPHEMERAL
} from '../Defaults'
import type {
	AnyMediaMessageContent,
	AnyMessageContent,
	ButtonMessageOptions,
	CarouselMessageOptions,
	DownloadableMessage,
	ListMessageOptions,
	MessageContentGenerationOptions,
	MessageGenerationOptions,
	MessageGenerationOptionsFromContent,
	MessageUserReceipt,
	MessageWithContextInfo,
	NativeButton,
	NativeFlowButton,
	WAMediaUpload,
	WAMessage,
	WAMessageContent,
	WAMessageKey,
	WATextMessage
} from '../Types'
import { WAMessageStatus, WAProto } from '../Types'
import { isJidGroup, isJidNewsletter, isJidStatusBroadcast, jidNormalizedUser } from '../WABinary'
import { sha256 } from './crypto'
import { generateMessageIDV2, getKeyAuthor, unixTimestampSeconds } from './generics'
import type { ILogger } from './logger'
import {
	downloadContentFromMessage,
	encryptedStream,
	generateThumbnail,
	getAudioDuration,
	getAudioWaveform,
	getRawMediaUploadData,
	type MediaDownloadOptions
} from './messages-media'
import { shouldIncludeReportingToken } from './reporting-utils'

type ExtractByKey<T, K extends PropertyKey> = T extends Record<K, any> ? T : never
type RequireKey<T, K extends keyof T> = T & {
	[P in K]-?: Exclude<T[P], null | undefined>
}

type WithKey<T, K extends PropertyKey> = T extends unknown ? (K extends keyof T ? RequireKey<T, K> : never) : never

type MediaUploadData = {
	media: WAMediaUpload
	caption?: string
	ptt?: boolean
	ptv?: boolean
	seconds?: number
	gifPlayback?: boolean
	fileName?: string
	jpegThumbnail?: string
	mimetype?: string
	width?: number
	height?: number
	waveform?: Uint8Array
	backgroundArgb?: number
}

const MIMETYPE_MAP: { [T in MediaType]?: string } = {
	image: 'image/jpeg',
	video: 'video/mp4',
	document: 'application/pdf',
	audio: 'audio/ogg; codecs=opus',
	sticker: 'image/webp',
	'product-catalog-image': 'image/jpeg'
}

const MessageTypeProto = {
	image: WAProto.Message.ImageMessage,
	video: WAProto.Message.VideoMessage,
	audio: WAProto.Message.AudioMessage,
	sticker: WAProto.Message.StickerMessage,
	document: WAProto.Message.DocumentMessage
} as const

/**
 * Uses a regex to test whether the string contains a URL, and returns the URL if it does.
 * @param text eg. hello https://google.com
 * @returns the URL, eg. https://google.com
 */
export const extractUrlFromText = (text: string) => text.match(URL_REGEX)?.[0]

export const generateLinkPreviewIfRequired = async (
	text: string,
	getUrlInfo: MessageGenerationOptions['getUrlInfo'],
	logger: MessageGenerationOptions['logger']
) => {
	const url = extractUrlFromText(text)
	if (!!getUrlInfo && url) {
		try {
			const urlInfo = await getUrlInfo(url)
			return urlInfo
		} catch (error: any) {
			// ignore if fails
			logger?.warn({ trace: error.stack }, 'url generation failed')
		}
	}
}

const assertColor = async (color: any) => {
	let assertedColor
	if (typeof color === 'number') {
		assertedColor = color > 0 ? color : 0xffffffff + Number(color) + 1
	} else {
		let hex = color.trim().replace('#', '')
		if (hex.length <= 6) {
			hex = 'FF' + hex.padStart(6, '0')
		}

		assertedColor = parseInt(hex, 16)
		return assertedColor
	}
}

export const prepareWAMessageMedia = async (
	message: AnyMediaMessageContent,
	options: MessageContentGenerationOptions
) => {
	const logger = options.logger

	let mediaType: (typeof MEDIA_KEYS)[number] | undefined
	for (const key of MEDIA_KEYS) {
		if (key in message) {
			mediaType = key
		}
	}

	if (!mediaType) {
		throw new Boom('Invalid media type', { statusCode: 400 })
	}

	const uploadData: MediaUploadData = {
		...message,
		media: (message as any)[mediaType]
	}
	delete (uploadData as any)[mediaType]
	// check if cacheable + generate cache key
	const cacheableKey =
		typeof uploadData.media === 'object' &&
		'url' in uploadData.media &&
		!!uploadData.media.url &&
		!!options.mediaCache &&
		mediaType + ':' + uploadData.media.url.toString()

	if (mediaType === 'document' && !uploadData.fileName) {
		uploadData.fileName = 'file'
	}

	if (!uploadData.mimetype) {
		uploadData.mimetype = MIMETYPE_MAP[mediaType]
	}

	if (cacheableKey) {
		const mediaBuff = await options.mediaCache!.get<Buffer>(cacheableKey)
		if (mediaBuff) {
			logger?.debug({ cacheableKey }, 'got media cache hit')

			const obj = proto.Message.decode(mediaBuff)
			const key = `${mediaType}Message`

			Object.assign(obj[key as keyof proto.Message]!, { ...uploadData, media: undefined })

			return obj
		}
	}

	const isNewsletter = !!options.jid && isJidNewsletter(options.jid)
	if (isNewsletter) {
		logger?.info({ key: cacheableKey }, 'Preparing raw media for newsletter')
		const { filePath, fileSha256, fileLength } = await getRawMediaUploadData(
			uploadData.media,
			options.mediaTypeOverride || mediaType,
			logger
		)

		const fileSha256B64 = fileSha256.toString('base64')
		const { mediaUrl, directPath } = await options.upload(filePath, {
			fileEncSha256B64: fileSha256B64,
			mediaType: mediaType,
			timeoutMs: options.mediaUploadTimeoutMs
		})

		await fs.unlink(filePath)

		const obj = WAProto.Message.fromObject({
			// todo: add more support here
			[`${mediaType}Message`]: (MessageTypeProto as any)[mediaType].fromObject({
				url: mediaUrl,
				directPath,
				fileSha256,
				fileLength,
				...uploadData,
				media: undefined
			})
		})

		if (uploadData.ptv) {
			obj.ptvMessage = obj.videoMessage
			delete obj.videoMessage
		}

		if (obj.stickerMessage) {
			obj.stickerMessage.stickerSentTs = Date.now()
		}

		if (cacheableKey) {
			logger?.debug({ cacheableKey }, 'set cache')
			await options.mediaCache!.set(cacheableKey, WAProto.Message.encode(obj).finish())
		}

		return obj
	}

	const requiresDurationComputation = mediaType === 'audio' && typeof uploadData.seconds === 'undefined'
	const requiresThumbnailComputation =
		(mediaType === 'image' || mediaType === 'video') && typeof uploadData['jpegThumbnail'] === 'undefined'
	const requiresWaveformProcessing = mediaType === 'audio' && uploadData.ptt === true
	const requiresAudioBackground = options.backgroundColor && mediaType === 'audio' && uploadData.ptt === true
	const requiresOriginalForSomeProcessing = requiresDurationComputation || requiresThumbnailComputation
	const { mediaKey, encFilePath, originalFilePath, fileEncSha256, fileSha256, fileLength } = await encryptedStream(
		uploadData.media,
		options.mediaTypeOverride || mediaType,
		{
			logger,
			saveOriginalFileIfRequired: requiresOriginalForSomeProcessing,
			opts: options.options
		}
	)

	const fileEncSha256B64 = fileEncSha256.toString('base64')
	const [{ mediaUrl, directPath }] = await Promise.all([
		(async () => {
			const result = await options.upload(encFilePath, {
				fileEncSha256B64,
				mediaType,
				timeoutMs: options.mediaUploadTimeoutMs
			})
			logger?.debug({ mediaType, cacheableKey }, 'uploaded media')
			return result
		})(),
		(async () => {
			try {
				if (requiresThumbnailComputation) {
					const { thumbnail, originalImageDimensions } = await generateThumbnail(
						originalFilePath!,
						mediaType as 'image' | 'video',
						options
					)
					uploadData.jpegThumbnail = thumbnail
					if (!uploadData.width && originalImageDimensions) {
						uploadData.width = originalImageDimensions.width
						uploadData.height = originalImageDimensions.height
						logger?.debug('set dimensions')
					}

					logger?.debug('generated thumbnail')
				}

				if (requiresDurationComputation) {
					uploadData.seconds = await getAudioDuration(originalFilePath!)
					logger?.debug('computed audio duration')
				}

				if (requiresWaveformProcessing) {
					uploadData.waveform = await getAudioWaveform(originalFilePath!, logger)
					logger?.debug('processed waveform')
				}

				if (requiresAudioBackground) {
					uploadData.backgroundArgb = await assertColor(options.backgroundColor)
					logger?.debug('computed backgroundColor audio status')
				}
			} catch (error) {
				logger?.warn({ trace: (error as any).stack }, 'failed to obtain extra info')
			}
		})()
	]).finally(async () => {
		try {
			await fs.unlink(encFilePath)
			if (originalFilePath) {
				await fs.unlink(originalFilePath)
			}

			logger?.debug('removed tmp files')
		} catch (error) {
			logger?.warn('failed to remove tmp file')
		}
	})

	const obj = WAProto.Message.fromObject({
		[`${mediaType}Message`]: MessageTypeProto[mediaType as keyof typeof MessageTypeProto].fromObject({
			url: mediaUrl,
			directPath,
			mediaKey,
			fileEncSha256,
			fileSha256,
			fileLength,
			mediaKeyTimestamp: unixTimestampSeconds(),
			...uploadData,
			media: undefined
		} as any)
	})

	if (uploadData.ptv) {
		obj.ptvMessage = obj.videoMessage
		delete obj.videoMessage
	}

	if (cacheableKey) {
		logger?.debug({ cacheableKey }, 'set cache')
		await options.mediaCache!.set(cacheableKey, WAProto.Message.encode(obj).finish())
	}

	return obj
}

export const prepareDisappearingMessageSettingContent = (ephemeralExpiration?: number) => {
	ephemeralExpiration = ephemeralExpiration || 0
	const content: WAMessageContent = {
		ephemeralMessage: {
			message: {
				protocolMessage: {
					type: WAProto.Message.ProtocolMessage.Type.EPHEMERAL_SETTING,
					ephemeralExpiration
				}
			}
		}
	}
	return WAProto.Message.fromObject(content)
}

/**
 * Generate forwarded message content like WA does
 * @param message the message to forward
 * @param options.forceForward will show the message as forwarded even if it is from you
 */
export const generateForwardMessageContent = (message: WAMessage, forceForward?: boolean) => {
	let content = message.message
	if (!content) {
		throw new Boom('no content in message', { statusCode: 400 })
	}

	// hacky copy
	content = normalizeMessageContent(content)
	content = proto.Message.decode(proto.Message.encode(content!).finish())

	let key = Object.keys(content)[0] as keyof proto.IMessage

	let score = (content?.[key] as { contextInfo: proto.IContextInfo })?.contextInfo?.forwardingScore || 0
	score += message.key.fromMe && !forceForward ? 0 : 1
	if (key === 'conversation') {
		content.extendedTextMessage = { text: content[key] }
		delete content.conversation

		key = 'extendedTextMessage'
	}

	const key_ = content?.[key] as { contextInfo: proto.IContextInfo }
	if (score > 0) {
		key_.contextInfo = { forwardingScore: score, isForwarded: true }
	} else {
		key_.contextInfo = {}
	}

	return content
}

export const hasNonNullishProperty = <K extends PropertyKey>(
	message: AnyMessageContent,
	key: K
): message is ExtractByKey<AnyMessageContent, K> => {
	return (
		typeof message === 'object' &&
		message !== null &&
		key in message &&
		(message as any)[key] !== null &&
		(message as any)[key] !== undefined
	)
}

// ========== Native Flow Button Utilities ==========

/**
 * Validates that a string is not empty or whitespace-only
 */
const validateNonEmptyString = (value: string | undefined, fieldName: string): void => {
	if (!value || value.trim().length === 0) {
		throw new Boom(`Button ${fieldName} is required and cannot be empty`, { statusCode: 400 })
	}
}

/**
 * Converts a NativeButton to the WhatsApp Native Flow format
 * Includes validation for required fields
 */
export const formatNativeFlowButton = (button: NativeButton): NativeFlowButton => {
	// Validate common field
	validateNonEmptyString(button.text, 'text')

	switch (button.type) {
		case 'url':
			validateNonEmptyString(button.url, 'url')
			return {
				name: 'cta_url',
				buttonParamsJson: JSON.stringify({
					display_text: button.text,
					url: button.url,
					merchant_url: button.merchantUrl || button.url
				})
			}
		case 'copy':
			validateNonEmptyString(button.copyText, 'copyText')
			return {
				name: 'cta_copy',
				buttonParamsJson: JSON.stringify({
					display_text: button.text,
					copy_code: button.copyText
				})
			}
		case 'reply':
			validateNonEmptyString(button.id, 'id')
			return {
				name: 'quick_reply',
				buttonParamsJson: JSON.stringify({
					display_text: button.text,
					id: button.id
				})
			}
		case 'call':
			validateNonEmptyString(button.phoneNumber, 'phoneNumber')
			return {
				name: 'cta_call',
				buttonParamsJson: JSON.stringify({
					display_text: button.text,
					phone_number: button.phoneNumber
				})
			}
		default:
			throw new Boom('Invalid button type', { statusCode: 400 })
	}
}

/**
 * Generates a button message using Native Flow format wrapped in viewOnceMessage
 * This is the modern approach for button messages that works on iOS and Android
 *
 * @example
 * ```typescript
 * const msg = await generateButtonMessage({
 *   buttons: [
 *     { type: 'url', text: 'Visit Site', url: 'https://example.com' },
 *     { type: 'copy', text: 'Copy Code', copyText: 'ABC123' },
 *     { type: 'reply', text: 'Contact Support', id: 'btn_support' }
 *   ],
 *   text: 'Choose an option:',
 *   footer: 'Powered by InfiniteAPI'
 * }, options)
 * await sock.sendMessage(jid, msg)
 * ```
 */
export const generateButtonMessage = async (
	options: ButtonMessageOptions,
	mediaOptions?: MessageContentGenerationOptions
): Promise<WAMessageContent> => {
	const { buttons, text, footer, headerTitle, headerImage, headerVideo, messageVersion = 2 } = options

	if (!buttons || buttons.length === 0) {
		throw new Boom('At least one button is required', { statusCode: 400 })
	}

	if (buttons.length > 3) {
		throw new Boom('Maximum 3 buttons allowed', { statusCode: 400 })
	}

	// Validate mutual exclusivity of media types
	if (headerImage && headerVideo) {
		throw new Boom('Cannot have both headerImage and headerVideo. Choose one.', { statusCode: 400 })
	}

	// Format buttons to Native Flow format
	const formattedButtons = buttons.map(formatNativeFlowButton)

	// Determine header configuration
	const hasMedia = !!(headerImage || headerVideo)
	const header: proto.Message.InteractiveMessage.IHeader = {
		title: hasMedia ? '' : (headerTitle || ''),
		subtitle: '',
		hasMediaAttachment: hasMedia
	}

	// Process media if present
	if (hasMedia && mediaOptions) {
		if (headerImage) {
			const { imageMessage } = await prepareWAMessageMedia({ image: headerImage }, mediaOptions)
			header.imageMessage = imageMessage
		} else if (headerVideo) {
			const { videoMessage } = await prepareWAMessageMedia({ video: headerVideo }, mediaOptions)
			header.videoMessage = videoMessage
		}
	} else if (hasMedia && !mediaOptions) {
		throw new Boom('mediaOptions required for processing header media', { statusCode: 400 })
	}

	// Build the interactive message
	const interactiveMessage: proto.Message.IInteractiveMessage = {
		body: { text: text || '' },
		footer: footer ? { text: footer } : undefined,
		header,
		nativeFlowMessage: {
			buttons: formattedButtons,
			messageParamsJson: JSON.stringify({}),
			messageVersion
		}
	}

	// Wrap in viewOnceMessage for better compatibility
	return {
		viewOnceMessage: {
			message: {
				messageContextInfo: {
					deviceListMetadata: {},
					deviceListMetadataVersion: 2
				},
				interactiveMessage
			}
		}
	}
}

/**
 * Generates a carousel message with multiple cards, each with their own buttons
 * Uses viewOnceMessage wrapper for better iOS/Android compatibility
 *
 * @example
 * ```typescript
 * const msg = await generateCarouselMessage({
 *   cards: [
 *     {
 *       title: 'Product 1',
 *       body: 'Amazing product description',
 *       footer: '$99.00',
 *       buttons: [
 *         { type: 'url', text: 'Buy Now', url: 'https://shop.com/item1' }
 *       ]
 *     },
 *     {
 *       title: 'Product 2',
 *       body: 'Another great product',
 *       footer: '$149.00',
 *       buttons: [
 *         { type: 'url', text: 'Buy Now', url: 'https://shop.com/item2' }
 *       ]
 *     }
 *   ],
 *   text: 'Check out our products!',
 *   footer: 'Swipe to see more'
 * }, options)
 * await sock.sendMessage(jid, msg)
 * ```
 */
export const generateCarouselMessage = async (
	options: CarouselMessageOptions,
	mediaOptions?: MessageContentGenerationOptions
): Promise<WAMessageContent> => {
	const { cards, text, footer } = options

	if (!cards || cards.length < 2) {
		throw new Boom('Carousel requires at least 2 cards', { statusCode: 400 })
	}

	if (cards.length > 10) {
		throw new Boom('Maximum 10 cards allowed in carousel', { statusCode: 400 })
	}

	// Validate cards
	for (let i = 0; i < cards.length; i++) {
		const card = cards[i]!

		// Validate mutual exclusivity of media types
		if (card.image && card.video) {
			throw new Boom(`Card ${i}: Cannot have both image and video. Choose one.`, { statusCode: 400 })
		}

		// Validate buttons are not empty
		if (!card.buttons || card.buttons.length === 0) {
			throw new Boom(`Card ${i}: At least one button is required per card`, { statusCode: 400 })
		}
	}

	// Check if any card has media
	const hasAnyMedia = cards.some(card => card.image || card.video)
	if (hasAnyMedia && !mediaOptions) {
		throw new Boom('mediaOptions required for processing card media', { statusCode: 400 })
	}

	// Map cards to the carousel format (processing media)
	const carouselCards = await Promise.all(cards.map(async (card) => {
		const hasMedia = !!(card.image || card.video)

		const header: any = {
			title: card.title || '',
			subtitle: '',
			hasMediaAttachment: hasMedia
		}

		// Process media if present
		if (hasMedia && mediaOptions) {
			if (card.image) {
				const { imageMessage } = await prepareWAMessageMedia({ image: card.image }, mediaOptions)
				header.imageMessage = imageMessage
			} else if (card.video) {
				const { videoMessage } = await prepareWAMessageMedia({ video: card.video }, mediaOptions)
				header.videoMessage = videoMessage
			}
		}

		return {
			header,
			body: { text: card.body || '' },
			footer: card.footer ? { text: card.footer } : undefined,
			nativeFlowMessage: {
				buttons: card.buttons.map(formatNativeFlowButton),
				messageParamsJson: ''
			}
		}
	}))

	// Build the interactive message with carousel
	const interactiveMessage: proto.Message.IInteractiveMessage = {
		body: { text: text || '' },
		footer: footer ? { text: footer } : undefined,
		header: {
			title: '',
			subtitle: '',
			hasMediaAttachment: false
		},
		carouselMessage: {
			cards: carouselCards,
			messageVersion: 1
		}
	}

	// Wrap in viewOnceMessage for better compatibility
	return {
		viewOnceMessage: {
			message: {
				messageContextInfo: {
					deviceListMetadata: {},
					deviceListMetadataVersion: 2
				},
				interactiveMessage
			}
		}
	}
}

/**
 * Generates a list message using Native Flow format (single_select)
 * Uses viewOnceMessage wrapper for better iOS/Android compatibility
 *
 * @example
 * ```typescript
 * const msg = generateListMessage({
 *   buttonText: 'View Options',
 *   text: 'Choose an option:',
 *   title: 'Menu',
 *   sections: [
 *     {
 *       title: 'Category 1',
 *       rows: [
 *         { id: 'opt1', title: 'Option 1', description: 'Description 1' },
 *         { id: 'opt2', title: 'Option 2', description: 'Description 2' }
 *       ]
 *     }
 *   ],
 *   footer: 'Select one item'
 * })
 * await sock.sendMessage(jid, msg)
 * ```
 */
export const generateListMessage = (options: ListMessageOptions): WAMessageContent => {
	const { buttonText, sections, text, title, footer } = options

	if (!sections || sections.length === 0) {
		throw new Boom('At least one section is required', { statusCode: 400 })
	}

	// Build sections for single_select
	const formattedSections = sections.map(section => ({
		title: section.title,
		rows: section.rows.map(row => ({
			id: row.id,
			title: row.title,
			description: row.description || ''
		}))
	}))

	// Create native flow message with single_select button
	const nativeFlowMessage = {
		buttons: [{
			name: 'single_select',
			buttonParamsJson: JSON.stringify({
				title: buttonText,
				sections: formattedSections
			})
		}],
		messageParamsJson: JSON.stringify({}),
		messageVersion: 2
	}

	// Build the interactive message
	const interactiveMessage: proto.Message.IInteractiveMessage = {
		body: { text: text || '' },
		footer: footer ? { text: footer } : undefined,
		header: title ? {
			title,
			subtitle: '',
			hasMediaAttachment: false
		} : undefined,
		nativeFlowMessage
	}

	// Wrap in viewOnceMessage for better compatibility
	return {
		viewOnceMessage: {
			message: {
				messageContextInfo: {
					deviceListMetadata: {},
					deviceListMetadataVersion: 2
				},
				interactiveMessage
			}
		}
	}
}

// ========== Legacy Message Functions ==========

/**
 * Generates a button message using the legacy buttonsMessage format
 * ⚠️ WARNING: This format is deprecated and may not work on all devices
 *
 * @deprecated Use generateButtonMessage instead for better compatibility
 */
export const generateButtonMessageLegacy = (
	buttons: Array<{ id?: string; text: string }>,
	text: string,
	footer?: string
): WAMessageContent => {
	const formattedButtons = buttons.map((button, index) => ({
		buttonId: button.id || `btn_${index}`,
		buttonText: { displayText: button.text },
		type: proto.Message.ButtonsMessage.Button.Type.RESPONSE
	}))

	return {
		buttonsMessage: WAProto.Message.ButtonsMessage.fromObject({
			contentText: text,
			footerText: footer,
			buttons: formattedButtons,
			headerType: proto.Message.ButtonsMessage.HeaderType.EMPTY
		})
	}
}

/**
 * Generates a list message using the legacy listMessage format
 * ⚠️ WARNING: This format is deprecated and may not work on all devices
 *
 * @deprecated Use generateListMessage instead for better compatibility
 */
export const generateListMessageLegacy = (
	listInfo: {
		sections: Array<{
			title: string
			rows: Array<{ id?: string; rowId?: string; title: string; description?: string }>
		}>
	},
	title: string,
	description: string,
	buttonText: string,
	footer?: string
): WAMessageContent => {
	return {
		listMessage: WAProto.Message.ListMessage.fromObject({
			title,
			description,
			buttonText,
			footerText: footer,
			listType: WAProto.Message.ListMessage.ListType.SINGLE_SELECT,
			sections: listInfo.sections.map(section => ({
				title: section.title,
				rows: section.rows.map(row => ({
					rowId: row.id || row.rowId,
					title: row.title,
					description: row.description
				}))
			}))
		})
	}
}

function hasOptionalProperty<T, K extends PropertyKey>(obj: T, key: K): obj is WithKey<T, K> {
	return typeof obj === 'object' && obj !== null && key in obj && (obj as any)[key] !== null
}

export const generateWAMessageContent = async (
	message: AnyMessageContent,
	options: MessageContentGenerationOptions
) => {
	let m: WAMessageContent = {}

	// ========== NATIVE FLOW BUTTONS (Modern approach) ==========
	// Check for nativeButtons first - this is the recommended modern approach
	if (hasNonNullishProperty(message, 'nativeButtons')) {
		const nativeMsg = message as any
		const buttonOptions: ButtonMessageOptions = {
			buttons: nativeMsg.nativeButtons,
			text: nativeMsg.text || '',
			footer: nativeMsg.footer,
			headerTitle: nativeMsg.headerTitle,
			headerImage: nativeMsg.headerImage,
			headerVideo: nativeMsg.headerVideo
		}
		// Pass options for media processing if header has image/video
		const generated = await generateButtonMessage(buttonOptions, options)
		m.viewOnceMessage = generated.viewOnceMessage
		options.logger?.info('Sending nativeFlowMessage with viewOnceMessage wrapper')
	}
	// Check for nativeCarousel
	else if (hasNonNullishProperty(message, 'nativeCarousel')) {
		const carouselMsg = message as any
		const carouselOptions: CarouselMessageOptions = {
			cards: carouselMsg.nativeCarousel.cards,
			text: carouselMsg.text,
			footer: carouselMsg.footer
		}
		// Pass options for media processing if cards have images/videos
		const generated = await generateCarouselMessage(carouselOptions, options)
		m.viewOnceMessage = generated.viewOnceMessage
		options.logger?.info('Sending carouselMessage with viewOnceMessage wrapper')
	}
	// Check for nativeList
	else if (hasNonNullishProperty(message, 'nativeList')) {
		const listMsg = message as any
		const listOptions: ListMessageOptions = {
			buttonText: listMsg.nativeList.buttonText,
			sections: listMsg.nativeList.sections,
			text: listMsg.text || '',
			title: listMsg.title,
			footer: listMsg.footer
		}
		const generated = generateListMessage(listOptions)
		m.viewOnceMessage = generated.viewOnceMessage
		options.logger?.info('Sending listMessage with viewOnceMessage wrapper')
	}
	// ⚠️ EXPERIMENTAL: Check for interactive messages FIRST (buttons, lists, templates)
	// These use the older API which may not work reliably
	else if (hasNonNullishProperty(message, 'text') && hasNonNullishProperty(message, 'buttons')) {
		// Process buttons for text messages
		const buttonsMessage: proto.Message.IButtonsMessage = {
			contentText: (message as any).text,
			footerText: (message as any).footerText,
			headerType: (message as any).headerType || proto.Message.ButtonsMessage.HeaderType.EMPTY
		}

		buttonsMessage.buttons = ((message as any).buttons as any[]).map((btn: any, idx: number) => ({
			buttonId: btn.buttonId || `btn_${idx}`,
			buttonText: { displayText: btn.buttonText?.displayText || btn.displayText || btn.text },
			type: btn.type || proto.Message.ButtonsMessage.Button.Type.RESPONSE
		}))

		m.buttonsMessage = buttonsMessage
		options.logger?.warn('[EXPERIMENTAL] Sending buttonsMessage - this may not work and can cause bans')
	} else if (hasNonNullishProperty(message, 'text') && hasNonNullishProperty(message, 'templateButtons')) {
		// Process templateButtons
		const templateMessage: proto.Message.ITemplateMessage = {
			hydratedTemplate: {
				hydratedContentText: (message as any).text,
				hydratedFooterText: (message as any).footer
			}
		}

		templateMessage.hydratedTemplate!.hydratedButtons = ((message as any).templateButtons as any[]).map((btn: any) => {
			if (btn.quickReplyButton) {
				return { index: btn.index, quickReplyButton: btn.quickReplyButton }
			} else if (btn.urlButton) {
				return { index: btn.index, urlButton: btn.urlButton }
			} else if (btn.callButton) {
				return { index: btn.index, callButton: btn.callButton }
			}
			return btn
		})

		m.templateMessage = templateMessage
		options.logger?.warn('[EXPERIMENTAL] Sending templateMessage - this may not work and can cause bans')
	} else if (hasNonNullishProperty(message, 'sections')) {
		// Process list messages
		const listMessage: proto.Message.IListMessage = {
			title: (message as any).title,
			description: (message as any).text,
			buttonText: (message as any).buttonText || 'View options',
			footerText: (message as any).footerText,
			listType: proto.Message.ListMessage.ListType.SINGLE_SELECT
		}

		listMessage.sections = ((message as any).sections as any[]).map((section: any) => ({
			title: section.title,
			rows: section.rows.map((row: any) => ({
				rowId: row.rowId || row.id,
				title: row.title,
				description: row.description
			}))
		}))

		m.listMessage = listMessage
		options.logger?.warn('[EXPERIMENTAL] Sending listMessage - this may not work and can cause bans')
	} else if (hasNonNullishProperty(message, 'carousel')) {
		// Process carousel/interactive messages with viewOnceMessage wrapper
		const carousel = (message as any).carousel
		const interactiveMessage: proto.Message.IInteractiveMessage = {
			header: carousel.header || { title: carousel.title || 'Carousel', hasMediaAttachment: false },
			body: { text: (message as any).text || carousel.description || '' },
			footer: carousel.footer ? { text: carousel.footer } : undefined,
			carouselMessage: {
				cards: carousel.cards.map((card: any) => ({
					header: card.header,
					body: card.body,
					footer: card.footer,
					nativeFlowMessage: card.nativeFlowMessage
				})),
				messageVersion: carousel.messageVersion || 1
			}
		}

		// Wrap in viewOnceMessage for better iOS/Android compatibility
		m.viewOnceMessage = {
			message: {
				messageContextInfo: {
					deviceListMetadata: {},
					deviceListMetadataVersion: 2
				},
				interactiveMessage
			}
		}
		options.logger?.warn('[EXPERIMENTAL] Sending carouselMessage with viewOnceMessage wrapper')
	} else if (hasNonNullishProperty(message, 'album')) {
		// Album message validation - actual sending is handled in messages-send.ts
		const { medias } = message.album

		// Validate minimum items (WhatsApp requirement)
		if (!medias || medias.length < 2) {
			throw new Boom('Album must have at least 2 media items', { statusCode: 400 })
		}

		// Validate maximum items (WhatsApp limit)
		if (medias.length > 10) {
			throw new Boom('Album cannot have more than 10 media items (WhatsApp limit)', { statusCode: 400 })
		}

		// Count and validate each media item
		let expectedImageCount = 0
		let expectedVideoCount = 0

		for (let i = 0; i < medias.length; i++) {
			const media = medias[i]!
			if (hasNonNullishProperty(media as AnyMessageContent, 'image')) {
				expectedImageCount++
			} else if (hasNonNullishProperty(media as AnyMessageContent, 'video')) {
				expectedVideoCount++
			} else {
				throw new Boom(`Album media at index ${i} must have 'image' or 'video' property`, { statusCode: 400 })
			}
		}

		// Create album root message
		m.albumMessage = WAProto.Message.AlbumMessage.create({
			expectedImageCount,
			expectedVideoCount
		})

		options.logger?.info(
			{ expectedImageCount, expectedVideoCount, totalItems: medias.length },
			'Album message validated - sending will be handled by relayMessage'
		)
	} else if (hasNonNullishProperty(message, 'text')) {
		// Normal text message processing
		const extContent = { text: message.text } as WATextMessage

		let urlInfo = message.linkPreview
		if (typeof urlInfo === 'undefined') {
			urlInfo = await generateLinkPreviewIfRequired(message.text, options.getUrlInfo, options.logger)
		}

		if (urlInfo) {
			extContent.matchedText = urlInfo['matched-text']
			extContent.jpegThumbnail = urlInfo.jpegThumbnail
			extContent.description = urlInfo.description
			extContent.title = urlInfo.title
			extContent.previewType = 0

			const img = urlInfo.highQualityThumbnail
			if (img) {
				extContent.thumbnailDirectPath = img.directPath
				extContent.mediaKey = img.mediaKey
				extContent.mediaKeyTimestamp = img.mediaKeyTimestamp
				extContent.thumbnailWidth = img.width
				extContent.thumbnailHeight = img.height
				extContent.thumbnailSha256 = img.fileSha256
				extContent.thumbnailEncSha256 = img.fileEncSha256
			}
		}

		if (options.backgroundColor) {
			extContent.backgroundArgb = await assertColor(options.backgroundColor)
		}

		if (options.font) {
			extContent.font = options.font
		}

		m.extendedTextMessage = extContent
	} else if (hasNonNullishProperty(message, 'contacts')) {
		const contactLen = message.contacts.contacts.length
		if (!contactLen) {
			throw new Boom('require atleast 1 contact', { statusCode: 400 })
		}

		if (contactLen === 1) {
			m.contactMessage = WAProto.Message.ContactMessage.create(message.contacts.contacts[0])
		} else {
			m.contactsArrayMessage = WAProto.Message.ContactsArrayMessage.create(message.contacts)
		}
	} else if (hasNonNullishProperty(message, 'location')) {
		m.locationMessage = WAProto.Message.LocationMessage.create(message.location)
	} else if (hasNonNullishProperty(message, 'react')) {
		if (!message.react.senderTimestampMs) {
			message.react.senderTimestampMs = Date.now()
		}

		m.reactionMessage = WAProto.Message.ReactionMessage.create(message.react)
	} else if (hasNonNullishProperty(message, 'delete')) {
		m.protocolMessage = {
			key: message.delete,
			type: WAProto.Message.ProtocolMessage.Type.REVOKE
		}
	} else if (hasNonNullishProperty(message, 'forward')) {
		m = generateForwardMessageContent(message.forward, message.force)
	} else if (hasNonNullishProperty(message, 'disappearingMessagesInChat')) {
		const exp =
			typeof message.disappearingMessagesInChat === 'boolean'
				? message.disappearingMessagesInChat
					? WA_DEFAULT_EPHEMERAL
					: 0
				: message.disappearingMessagesInChat
		m = prepareDisappearingMessageSettingContent(exp)
	} else if (hasNonNullishProperty(message, 'groupInvite')) {
		m.groupInviteMessage = {}
		m.groupInviteMessage.inviteCode = message.groupInvite.inviteCode
		m.groupInviteMessage.inviteExpiration = message.groupInvite.inviteExpiration
		m.groupInviteMessage.caption = message.groupInvite.text

		m.groupInviteMessage.groupJid = message.groupInvite.jid
		m.groupInviteMessage.groupName = message.groupInvite.subject
		//TODO: use built-in interface and get disappearing mode info etc.
		//TODO: cache / use store!?
		if (options.getProfilePicUrl) {
			const pfpUrl = await options.getProfilePicUrl(message.groupInvite.jid, 'preview')
			if (pfpUrl) {
				const resp = await fetch(pfpUrl, { method: 'GET', dispatcher: options?.options?.dispatcher })
				if (resp.ok) {
					const buf = Buffer.from(await resp.arrayBuffer())
					m.groupInviteMessage.jpegThumbnail = buf
				}
			}
		}
	} else if (hasNonNullishProperty(message, 'pin')) {
		m.pinInChatMessage = {}
		m.messageContextInfo = {}

		m.pinInChatMessage.key = message.pin
		m.pinInChatMessage.type = message.type
		m.pinInChatMessage.senderTimestampMs = Date.now()

		m.messageContextInfo.messageAddOnDurationInSecs = message.type === 1 ? message.time || 86400 : 0
	} else if (hasNonNullishProperty(message, 'buttonReply')) {
		switch (message.type) {
			case 'template':
				m.templateButtonReplyMessage = {
					selectedDisplayText: message.buttonReply.displayText,
					selectedId: message.buttonReply.id,
					selectedIndex: message.buttonReply.index
				}
				break
			case 'plain':
				m.buttonsResponseMessage = {
					selectedButtonId: message.buttonReply.id,
					selectedDisplayText: message.buttonReply.displayText,
					type: proto.Message.ButtonsResponseMessage.Type.DISPLAY_TEXT
				}
				break
		}
	}
	// ⚠️ EXPERIMENTAL: Process buttons with media (image/video)
	else if (
		(hasNonNullishProperty(message, 'image') || hasNonNullishProperty(message, 'video')) &&
		hasNonNullishProperty(message, 'buttons')
	) {
		const mediaType = hasNonNullishProperty(message, 'image') ? 'image' : 'video'
		const headerType =
			mediaType === 'image'
				? proto.Message.ButtonsMessage.HeaderType.IMAGE
				: proto.Message.ButtonsMessage.HeaderType.VIDEO

		// Extract only media properties to avoid type errors
		const mediaContent: AnyMediaMessageContent = mediaType === 'image'
			? {
				image: (message as any).image,
				caption: (message as any).caption,
				jpegThumbnail: (message as any).jpegThumbnail,
				mimetype: (message as any).mimetype
			  }
			: {
				video: (message as any).video,
				caption: (message as any).caption,
				jpegThumbnail: (message as any).jpegThumbnail,
				gifPlayback: (message as any).gifPlayback,
				ptv: (message as any).ptv,
				mimetype: (message as any).mimetype
			  }

		// Prepare media
		const mediaMessage = await prepareWAMessageMedia(mediaContent, options)

		const buttonsMessage: proto.Message.IButtonsMessage = {
			contentText: (message as any).caption || (message as any).text || '',
			footerText: (message as any).footerText,
			headerType: headerType
		}

		// Add media
		if (mediaType === 'image') {
			buttonsMessage.imageMessage = mediaMessage.imageMessage
		} else {
			buttonsMessage.videoMessage = mediaMessage.videoMessage
		}

		// Add buttons
		buttonsMessage.buttons = ((message as any).buttons as any[]).map((btn: any, idx: number) => ({
			buttonId: btn.buttonId || `btn_${idx}`,
			buttonText: { displayText: btn.buttonText?.displayText || btn.displayText || btn.text },
			type: btn.type || proto.Message.ButtonsMessage.Button.Type.RESPONSE
		}))

		m.buttonsMessage = buttonsMessage
		options.logger?.warn('[EXPERIMENTAL] Sending buttonsMessage with media - this may not work and can cause bans')
	} else if (hasOptionalProperty(message, 'ptv') && message.ptv) {
		const { videoMessage } = await prepareWAMessageMedia({ video: message.video }, options)
		m.ptvMessage = videoMessage
	} else if (hasNonNullishProperty(message, 'product')) {
		const { imageMessage } = await prepareWAMessageMedia({ image: message.product.productImage }, options)
		m.productMessage = WAProto.Message.ProductMessage.create({
			...message,
			product: {
				...message.product,
				productImage: imageMessage
			}
		})
	} else if (hasNonNullishProperty(message, 'listReply')) {
		m.listResponseMessage = { ...message.listReply }
	} else if (hasNonNullishProperty(message, 'event')) {
		m.eventMessage = {}
		const startTime = Math.floor(message.event.startDate.getTime() / 1000)

		if (message.event.call && options.getCallLink) {
			const token = await options.getCallLink(message.event.call, { startTime })
			m.eventMessage.joinLink = (message.event.call === 'audio' ? CALL_AUDIO_PREFIX : CALL_VIDEO_PREFIX) + token
		}

		m.messageContextInfo = {
			// encKey
			messageSecret: message.event.messageSecret || randomBytes(32)
		}

		m.eventMessage.name = message.event.name
		m.eventMessage.description = message.event.description
		m.eventMessage.startTime = startTime
		m.eventMessage.endTime = message.event.endDate ? message.event.endDate.getTime() / 1000 : undefined
		m.eventMessage.isCanceled = message.event.isCancelled ?? false
		m.eventMessage.extraGuestsAllowed = message.event.extraGuestsAllowed
		m.eventMessage.isScheduleCall = message.event.isScheduleCall ?? false
		m.eventMessage.location = message.event.location
	} else if (hasNonNullishProperty(message, 'poll')) {
		message.poll.selectableCount ||= 0
		message.poll.toAnnouncementGroup ||= false

		if (!Array.isArray(message.poll.values)) {
			throw new Boom('Invalid poll values', { statusCode: 400 })
		}

		if (message.poll.selectableCount < 0 || message.poll.selectableCount > message.poll.values.length) {
			throw new Boom(`poll.selectableCount in poll should be >= 0 and <= ${message.poll.values.length}`, {
				statusCode: 400
			})
		}

		m.messageContextInfo = {
			// encKey
			messageSecret: message.poll.messageSecret || randomBytes(32)
		}

		const pollCreationMessage = {
			name: message.poll.name,
			selectableOptionsCount: message.poll.selectableCount,
			options: message.poll.values.map(optionName => ({ optionName }))
		}

		if (message.poll.toAnnouncementGroup) {
			// poll v2 is for community announcement groups (single select and multiple)
			m.pollCreationMessageV2 = pollCreationMessage
		} else {
			if (message.poll.selectableCount === 1) {
				//poll v3 is for single select polls
				m.pollCreationMessageV3 = pollCreationMessage
			} else {
				// poll for multiple choice polls
				m.pollCreationMessage = pollCreationMessage
			}
		}
	} else if (hasNonNullishProperty(message, 'sharePhoneNumber')) {
		m.protocolMessage = {
			type: proto.Message.ProtocolMessage.Type.SHARE_PHONE_NUMBER
		}
	} else if (hasNonNullishProperty(message, 'requestPhoneNumber')) {
		m.requestPhoneNumberMessage = {}
	} else if (hasNonNullishProperty(message, 'limitSharing')) {
		m.protocolMessage = {
			type: proto.Message.ProtocolMessage.Type.LIMIT_SHARING,
			limitSharing: {
				sharingLimited: message.limitSharing === true,
				trigger: 1,
				limitSharingSettingTimestamp: Date.now(),
				initiatedByMe: true
			}
		}
	} else {
		m = await prepareWAMessageMedia(message, options)
	}

	if (hasOptionalProperty(message, 'viewOnce') && !!message.viewOnce) {
		m = { viewOnceMessage: { message: m } }
	}

	if (hasOptionalProperty(message, 'mentions') && message.mentions?.length) {
		const messageType = Object.keys(m)[0]! as Extract<keyof proto.IMessage, MessageWithContextInfo>
		const key = m[messageType]
		if ('contextInfo' in key! && !!key.contextInfo) {
			key.contextInfo.mentionedJid = message.mentions
		} else if (key!) {
			key.contextInfo = {
				mentionedJid: message.mentions
			}
		}
	}

	if (hasOptionalProperty(message, 'edit')) {
		m = {
			protocolMessage: {
				key: message.edit,
				editedMessage: m,
				timestampMs: Date.now(),
				type: WAProto.Message.ProtocolMessage.Type.MESSAGE_EDIT
			}
		}
	}

	if (hasOptionalProperty(message, 'contextInfo') && !!message.contextInfo) {
		const messageType = Object.keys(m)[0]! as Extract<keyof proto.IMessage, MessageWithContextInfo>
		const key = m[messageType]
		if ('contextInfo' in key! && !!key.contextInfo) {
			key.contextInfo = { ...key.contextInfo, ...message.contextInfo }
		} else if (key!) {
			key.contextInfo = message.contextInfo
		}
	}

	if (shouldIncludeReportingToken(m)) {
		m.messageContextInfo = m.messageContextInfo || {}
		if (!m.messageContextInfo.messageSecret) {
			m.messageContextInfo.messageSecret = randomBytes(32)
		}
	}

	return WAProto.Message.create(m)
}

export const generateWAMessageFromContent = (
	jid: string,
	message: WAMessageContent,
	options: MessageGenerationOptionsFromContent
) => {
	// set timestamp to now
	// if not specified
	if (!options.timestamp) {
		options.timestamp = new Date()
	}

	const innerMessage = normalizeMessageContent(message)!
	const key = getContentType(innerMessage)! as Exclude<keyof proto.IMessage, 'conversation'>
	const timestamp = unixTimestampSeconds(options.timestamp)
	const { quoted, userJid } = options

	if (quoted && !isJidNewsletter(jid)) {
		const participant = quoted.key.fromMe
			? userJid // TODO: Add support for LIDs
			: quoted.participant || quoted.key.participant || quoted.key.remoteJid

		let quotedMsg = normalizeMessageContent(quoted.message)!
		const msgType = getContentType(quotedMsg)!
		// strip any redundant properties
		quotedMsg = proto.Message.create({ [msgType]: quotedMsg[msgType] })

		const quotedContent = quotedMsg[msgType]
		if (typeof quotedContent === 'object' && quotedContent && 'contextInfo' in quotedContent) {
			delete quotedContent.contextInfo
		}

		const contextInfo: proto.IContextInfo =
			('contextInfo' in innerMessage[key]! && innerMessage[key]?.contextInfo) || {}
		contextInfo.participant = jidNormalizedUser(participant!)
		contextInfo.stanzaId = quoted.key.id
		contextInfo.quotedMessage = quotedMsg

		// if a participant is quoted, then it must be a group
		// hence, remoteJid of group must also be entered
		if (jid !== quoted.key.remoteJid) {
			contextInfo.remoteJid = quoted.key.remoteJid
		}

		if (contextInfo && innerMessage[key]) {
			/* @ts-ignore */
			innerMessage[key].contextInfo = contextInfo
		}
	}

	if (
		// if we want to send a disappearing message
		!!options?.ephemeralExpiration &&
		// and it's not a protocol message -- delete, toggle disappear message
		key !== 'protocolMessage' &&
		// already not converted to disappearing message
		key !== 'ephemeralMessage' &&
		// newsletters don't support ephemeral messages
		!isJidNewsletter(jid)
	) {
		/* @ts-ignore */
		innerMessage[key].contextInfo = {
			...((innerMessage[key] as any).contextInfo || {}),
			expiration: options.ephemeralExpiration || WA_DEFAULT_EPHEMERAL
			//ephemeralSettingTimestamp: options.ephemeralOptions.eph_setting_ts?.toString()
		}
	}

	message = WAProto.Message.create(message)

	const messageJSON = {
		key: {
			remoteJid: jid,
			fromMe: true,
			id: options?.messageId || generateMessageIDV2()
		},
		message: message,
		messageTimestamp: timestamp,
		messageStubParameters: [],
		participant: isJidGroup(jid) || isJidStatusBroadcast(jid) ? userJid : undefined, // TODO: Add support for LIDs
		status: WAMessageStatus.PENDING
	}
	return WAProto.WebMessageInfo.fromObject(messageJSON) as WAMessage
}

export const generateWAMessage = async (jid: string, content: AnyMessageContent, options: MessageGenerationOptions) => {
	// ensure msg ID is with every log
	options.logger = options?.logger?.child({ msgId: options.messageId })
	// Pass jid in the options to generateWAMessageContent
	return generateWAMessageFromContent(jid, await generateWAMessageContent(content, { ...options, jid }), options)
}

/** Get the key to access the true type of content */
export const getContentType = (content: proto.IMessage | undefined) => {
	if (content) {
		const keys = Object.keys(content)
		const key = keys.find(k => (k === 'conversation' || k.includes('Message')) && k !== 'senderKeyDistributionMessage')
		return key as keyof typeof content
	}
}

/**
 * Normalizes ephemeral, view once messages to regular message content
 * Eg. image messages in ephemeral messages, in view once messages etc.
 * @param content
 * @returns
 */
export const normalizeMessageContent = (content: WAMessageContent | null | undefined): WAMessageContent | undefined => {
	if (!content) {
		return undefined
	}

	// set max iterations to prevent an infinite loop
	for (let i = 0; i < 5; i++) {
		const inner = getFutureProofMessage(content)
		if (!inner) {
			break
		}

		content = inner.message
	}

	return content!

	function getFutureProofMessage(message: typeof content) {
		return (
			message?.ephemeralMessage ||
			message?.viewOnceMessage ||
			message?.documentWithCaptionMessage ||
			message?.viewOnceMessageV2 ||
			message?.viewOnceMessageV2Extension ||
			message?.editedMessage ||
			message?.associatedChildMessage ||
			message?.groupStatusMessage ||
			message?.groupStatusMessageV2
		)
	}
}

/**
 * Extract the true message content from a message
 * Eg. extracts the inner message from a disappearing message/view once message
 */
export const extractMessageContent = (content: WAMessageContent | undefined | null): WAMessageContent | undefined => {
	const extractFromTemplateMessage = (
		msg: proto.Message.TemplateMessage.IHydratedFourRowTemplate | proto.Message.IButtonsMessage
	) => {
		if (msg.imageMessage) {
			return { imageMessage: msg.imageMessage }
		} else if (msg.documentMessage) {
			return { documentMessage: msg.documentMessage }
		} else if (msg.videoMessage) {
			return { videoMessage: msg.videoMessage }
		} else if (msg.locationMessage) {
			return { locationMessage: msg.locationMessage }
		} else {
			return {
				conversation:
					'contentText' in msg ? msg.contentText : 'hydratedContentText' in msg ? msg.hydratedContentText : ''
			}
		}
	}

	content = normalizeMessageContent(content)

	if (content?.buttonsMessage) {
		return extractFromTemplateMessage(content.buttonsMessage)
	}

	if (content?.templateMessage?.hydratedFourRowTemplate) {
		return extractFromTemplateMessage(content?.templateMessage?.hydratedFourRowTemplate)
	}

	if (content?.templateMessage?.hydratedTemplate) {
		return extractFromTemplateMessage(content?.templateMessage?.hydratedTemplate)
	}

	if (content?.templateMessage?.fourRowTemplate) {
		return extractFromTemplateMessage(content?.templateMessage?.fourRowTemplate)
	}

	return content
}

/**
 * Returns the device predicted by message ID
 */
export const getDevice = (id: string) =>
	/^3A.{18}$/.test(id)
		? 'ios'
		: /^3E.{20}$/.test(id)
			? 'web'
			: /^(.{21}|.{32})$/.test(id)
				? 'android'
				: /^(3F|.{18}$)/.test(id)
					? 'desktop'
					: 'unknown'

/** Upserts a receipt in the message */
export const updateMessageWithReceipt = (msg: Pick<WAMessage, 'userReceipt'>, receipt: MessageUserReceipt) => {
	msg.userReceipt = msg.userReceipt || []
	const recp = msg.userReceipt.find(m => m.userJid === receipt.userJid)
	if (recp) {
		Object.assign(recp, receipt)
	} else {
		msg.userReceipt.push(receipt)
	}
}

/** Update the message with a new reaction */
export const updateMessageWithReaction = (msg: Pick<WAMessage, 'reactions'>, reaction: proto.IReaction) => {
	const authorID = getKeyAuthor(reaction.key)

	const reactions = (msg.reactions || []).filter(r => getKeyAuthor(r.key) !== authorID)
	reaction.text = reaction.text || ''
	reactions.push(reaction)
	msg.reactions = reactions
}

/** Update the message with a new poll update */
export const updateMessageWithPollUpdate = (msg: Pick<WAMessage, 'pollUpdates'>, update: proto.IPollUpdate) => {
	const authorID = getKeyAuthor(update.pollUpdateMessageKey)

	const reactions = (msg.pollUpdates || []).filter(r => getKeyAuthor(r.pollUpdateMessageKey) !== authorID)
	if (update.vote?.selectedOptions?.length) {
		reactions.push(update)
	}

	msg.pollUpdates = reactions
}

/** Update the message with a new event response */
export const updateMessageWithEventResponse = (
	msg: Pick<WAMessage, 'eventResponses'>,
	update: proto.IEventResponse
) => {
	const authorID = getKeyAuthor(update.eventResponseMessageKey)

	const responses = (msg.eventResponses || []).filter(r => getKeyAuthor(r.eventResponseMessageKey) !== authorID)
	responses.push(update)

	msg.eventResponses = responses
}

type VoteAggregation = {
	name: string
	voters: string[]
}

/**
 * Aggregates all poll updates in a poll.
 * @param msg the poll creation message
 * @param meId your jid
 * @returns A list of options & their voters
 */
export function getAggregateVotesInPollMessage(
	{ message, pollUpdates }: Pick<WAMessage, 'pollUpdates' | 'message'>,
	meId?: string
) {
	const opts =
		message?.pollCreationMessage?.options ||
		message?.pollCreationMessageV2?.options ||
		message?.pollCreationMessageV3?.options ||
		[]
	const voteHashMap = opts.reduce(
		(acc, opt) => {
			const hash = sha256(Buffer.from(opt.optionName || '')).toString()
			acc[hash] = {
				name: opt.optionName || '',
				voters: []
			}
			return acc
		},
		{} as { [_: string]: VoteAggregation }
	)

	for (const update of pollUpdates || []) {
		const { vote } = update
		if (!vote) {
			continue
		}

		for (const option of vote.selectedOptions || []) {
			const hash = option.toString()
			let data = voteHashMap[hash]
			if (!data) {
				voteHashMap[hash] = {
					name: 'Unknown',
					voters: []
				}
				data = voteHashMap[hash]
			}

			voteHashMap[hash]!.voters.push(getKeyAuthor(update.pollUpdateMessageKey, meId))
		}
	}

	return Object.values(voteHashMap)
}

type ResponseAggregation = {
	response: string
	responders: string[]
}

/**
 * Aggregates all event responses in an event message.
 * @param msg the event creation message
 * @param meId your jid
 * @returns A list of response types & their responders
 */
export function getAggregateResponsesInEventMessage(
	{ eventResponses }: Pick<WAMessage, 'eventResponses'>,
	meId?: string
) {
	const responseTypes = ['GOING', 'NOT_GOING', 'MAYBE']
	const responseMap: { [_: string]: ResponseAggregation } = {}

	for (const type of responseTypes) {
		responseMap[type] = {
			response: type,
			responders: []
		}
	}

	for (const update of eventResponses || []) {
		const responseType = (update as any).eventResponse || 'UNKNOWN'
		if (responseType !== 'UNKNOWN' && responseMap[responseType]) {
			responseMap[responseType].responders.push(getKeyAuthor(update.eventResponseMessageKey, meId))
		}
	}

	return Object.values(responseMap)
}

/** Given a list of message keys, aggregates them by chat & sender. Useful for sending read receipts in bulk */
export const aggregateMessageKeysNotFromMe = (keys: WAMessageKey[]) => {
	const keyMap: { [id: string]: { jid: string; participant: string | undefined; messageIds: string[] } } = {}
	for (const { remoteJid, id, participant, fromMe } of keys) {
		if (!fromMe) {
			const uqKey = `${remoteJid}:${participant || ''}`
			if (!keyMap[uqKey]) {
				keyMap[uqKey] = {
					jid: remoteJid!,
					participant: participant!,
					messageIds: []
				}
			}

			keyMap[uqKey].messageIds.push(id!)
		}
	}

	return Object.values(keyMap)
}

type DownloadMediaMessageContext = {
	reuploadRequest: (msg: WAMessage) => Promise<WAMessage>
	logger: ILogger
}

const REUPLOAD_REQUIRED_STATUS = [410, 404]

/**
 * Downloads the given message. Throws an error if it's not a media message
 */
export const downloadMediaMessage = async <Type extends 'buffer' | 'stream'>(
	message: WAMessage,
	type: Type,
	options: MediaDownloadOptions,
	ctx?: DownloadMediaMessageContext
) => {
	const result = await downloadMsg().catch(async error => {
		if (
			ctx &&
			typeof error?.status === 'number' && // treat errors with status as HTTP failures requiring reupload
			REUPLOAD_REQUIRED_STATUS.includes(error.status as number)
		) {
			ctx.logger.info({ key: message.key }, 'sending reupload media request...')
			// request reupload
			message = await ctx.reuploadRequest(message)
			const result = await downloadMsg()
			return result
		}

		throw error
	})

	return result as Type extends 'buffer' ? Buffer : Transform

	async function downloadMsg() {
		const mContent = extractMessageContent(message.message)
		if (!mContent) {
			throw new Boom('No message present', { statusCode: 400, data: message })
		}

		const contentType = getContentType(mContent)
		let mediaType = contentType?.replace('Message', '') as MediaType
		const media = mContent[contentType!]

		if (!media || typeof media !== 'object' || (!('url' in media) && !('thumbnailDirectPath' in media))) {
			throw new Boom(`"${contentType}" message is not a media message`)
		}

		let download: DownloadableMessage
		if ('thumbnailDirectPath' in media && !('url' in media)) {
			download = {
				directPath: media.thumbnailDirectPath,
				mediaKey: media.mediaKey
			}
			mediaType = 'thumbnail-link'
		} else {
			download = media
		}

		const stream = await downloadContentFromMessage(download, mediaType, options)
		if (type === 'buffer') {
			const bufferArray: Buffer[] = []
			for await (const chunk of stream) {
				bufferArray.push(chunk)
			}

			return Buffer.concat(bufferArray)
		}

		return stream
	}
}

/** Checks whether the given message is a media message; if it is returns the inner content */
export const assertMediaContent = (content: proto.IMessage | null | undefined) => {
	content = extractMessageContent(content)
	const mediaContent =
		content?.documentMessage ||
		content?.imageMessage ||
		content?.videoMessage ||
		content?.audioMessage ||
		content?.stickerMessage
	if (!mediaContent) {
		throw new Boom('given message is not a media message', { statusCode: 400, data: content })
	}

	return mediaContent
}
