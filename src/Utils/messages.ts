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
	DownloadableMessage,
	MessageContentGenerationOptions,
	MessageGenerationOptions,
	MessageGenerationOptionsFromContent,
	MessageUserReceipt,
	MessageWithContextInfo,
	NativeFlowButton,
	NativeFlowContent,
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
	type MediaDownloadOptions,
	setNewsletterMediaHandle
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

	const isNewsletter = !!options.jid && isJidNewsletter(options.jid)
	// Newsletter uploads must not use the media cache: a cached message carries
	// no upload handle, but the channel send needs it as media_id.
	if (cacheableKey && !isNewsletter) {
		const mediaBuff = await options.mediaCache!.get<Buffer>(cacheableKey)
		if (mediaBuff) {
			logger?.debug({ cacheableKey }, 'got media cache hit')

			const obj = proto.Message.decode(mediaBuff)
			const key = `${mediaType}Message`

			Object.assign(obj[key as keyof proto.Message]!, { ...uploadData, media: undefined })

			return obj
		}
	}

	if (isNewsletter) {
		logger?.info({ key: cacheableKey }, 'Preparing raw media for newsletter')
		const { filePath, fileSha256, fileLength } = await getRawMediaUploadData(
			uploadData.media,
			options.mediaTypeOverride || mediaType,
			logger
		)

		const fileSha256B64 = fileSha256.toString('base64')
		const { mediaUrl, directPath, handle, thumbnailDirectPath, thumbnailSha256 } = await options.upload(filePath, {
			fileEncSha256B64: fileSha256B64,
			mediaType: mediaType,
			timeoutMs: options.mediaUploadTimeoutMs,
			newsletter: true
		})
		// keep the handle so the channel send can use it as media_id
		if (directPath && handle) {
			setNewsletterMediaHandle(directPath, handle)
		}

		// the newsletter branch returns before the duration/waveform step below,
		// so compute them here for audio — otherwise channel voice notes show no waveform
		if (mediaType === 'audio') {
			try {
				await applyNewsletterAudioMetadata(filePath, uploadData, logger)
			} catch (error) {
				logger?.warn({ trace: (error as any)?.stack }, 'failed to obtain audio duration/waveform for newsletter')
			}
		}

		// the newsletter branch also skips thumbnail generation — without one the
		// media renders as a gray box with no preview. itsliaaa/baileys gets
		// server-side thumbnails (thumbnailDirectPath) via the newsletter upload
		// endpoints; we upload via the standard endpoints, so generate the
		// standard inline jpegThumbnail instead
		if (mediaType === 'image' || mediaType === 'video') {
			try {
				await applyNewsletterThumbnail(filePath, mediaType, uploadData, logger)
			} catch (error) {
				logger?.warn({ trace: (error as any)?.stack }, 'failed to generate thumbnail for newsletter')
			}
		}

		await fs.unlink(filePath)

		const obj = WAProto.Message.fromObject({
			// todo: add more support here
			[`${mediaType}Message`]: (MessageTypeProto as any)[mediaType].fromObject({
				url: mediaUrl,
				directPath,
				fileSha256,
				fileLength,
				thumbnailDirectPath,
				thumbnailSha256,
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

		// do not cache newsletter messages: the cached form has no mediaKey and
		// no upload handle, so a later ordinary-chat send must never read it
		return obj
	}

	const requiresDurationComputation = mediaType === 'audio' && typeof uploadData.seconds === 'undefined'
	const requiresThumbnailComputation =
		(mediaType === 'image' || mediaType === 'video') && typeof uploadData['jpegThumbnail'] === 'undefined'
	const requiresWaveformProcessing =
		mediaType === 'audio' && uploadData.ptt === true && typeof uploadData.waveform === 'undefined'
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
		})
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

function hasOptionalProperty<T, K extends PropertyKey>(obj: T, key: K): obj is WithKey<T, K> {
	return typeof obj === 'object' && obj !== null && key in obj && (obj as any)[key] !== null
}

const getNativeFlowButtons = (message: NativeFlowContent): NativeFlowButton[] =>
	Array.isArray(message.nativeFlow) ? message.nativeFlow : message.nativeFlow.buttons

/** Build the nativeFlowMessage payload used by interactive messages and carousel cards. */
const prepareNativeFlowButtons = (message: NativeFlowContent): proto.Message.InteractiveMessage.INativeFlowMessage => {
	const buttons = getNativeFlowButtons(message)
	const messageParamsJson: Record<string, unknown> = {}

	if (message.offerText) {
		messageParamsJson.limited_time_offer = {
			text: message.offerText,
			url: message.offerUrl,
			copy_code: message.offerCode,
			expiration_time: message.offerExpiration
		}
	}

	if (message.optionText) {
		messageParamsJson.bottom_sheet = {
			in_thread_buttons_limit: 1,
			divider_indices: buttons.map((_, index) => index),
			list_title: message.optionTitle || 'Select Options',
			button_title: message.optionText
		}
	}

	return {
		buttons: buttons.map(button => {
			const displayText = button.text || button.buttonText
			const icon = button.icon?.toUpperCase()

			if (button.id) {
				return {
					name: 'quick_reply',
					buttonParamsJson: JSON.stringify({ display_text: displayText || 'Click', id: button.id, icon })
				}
			}

			if (button.copy) {
				return {
					name: 'cta_copy',
					buttonParamsJson: JSON.stringify({ display_text: displayText || 'Copy', copy_code: button.copy, icon })
				}
			}

			if (button.url) {
				return {
					name: 'cta_url',
					buttonParamsJson: JSON.stringify({
						display_text: displayText || 'Visit',
						url: button.url,
						merchant_url: button.url,
						webview_interaction: button.useWebview,
						icon
					})
				}
			}

			if (button.call) {
				return {
					name: 'cta_call',
					buttonParamsJson: JSON.stringify({ display_text: displayText || 'Call', phone_number: button.call, icon })
				}
			}

			if (button.sections) {
				return {
					name: 'single_select',
					buttonParamsJson: JSON.stringify({ title: displayText || 'Select', sections: button.sections, icon })
				}
			}

			return { name: button.name, buttonParamsJson: button.paramsJson }
		}),
		messageParamsJson: JSON.stringify(messageParamsJson)
	}
}

export const hasValidAlbumMedia = (message: WAMessageContent) => !!(message.imageMessage || message.videoMessage)

const hasValidInteractiveHeader = (message: WAMessageContent) =>
	!!(
		message.imageMessage ||
		message.videoMessage ||
		message.documentMessage ||
		message.productMessage ||
		message.locationMessage
	)

const hasValidCarouselHeader = (message: WAMessageContent) =>
	!!(message.imageMessage || message.videoMessage || message.productMessage)

const applyNewsletterAudioMetadata = async (filePath: string, uploadData: MediaUploadData, logger?: ILogger) => {
	if (typeof uploadData.seconds === 'undefined') {
		uploadData.seconds = await getAudioDuration(filePath)
	}

	if (uploadData.ptt === true && typeof uploadData.waveform === 'undefined') {
		uploadData.waveform = await getAudioWaveform(filePath, logger)
	}
}

const applyNewsletterThumbnail = async (
	filePath: string,
	mediaType: 'image' | 'video',
	uploadData: MediaUploadData,
	logger?: ILogger
) => {
	if (typeof uploadData.jpegThumbnail !== 'undefined') {
		return
	}

	const { thumbnail, originalImageDimensions } = await generateThumbnail(filePath, mediaType, { logger })
	if (thumbnail) {
		uploadData.jpegThumbnail = thumbnail
	}

	if (!uploadData.width && originalImageDimensions) {
		uploadData.width = originalImageDimensions.width
		uploadData.height = originalImageDimensions.height
	}
}

export const generateWAMessageContent = async (
	message: AnyMessageContent,
	options: MessageContentGenerationOptions
) => {
	let m: WAMessageContent = {}
	if (hasNonNullishProperty(message, 'raw')) {
		return message.raw
	}

	if (hasNonNullishProperty(message, 'text')) {
		const extContent = { text: message.text } as WATextMessage

		let urlInfo = 'linkPreview' in message ? message.linkPreview : undefined
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
	} else if (hasNonNullishProperty(message, 'keep')) {
		m.keepInChatMessage = {
			key: message.keep,
			keepType: message.type,
			timestampMs: Date.now()
		}
	} else if (hasNonNullishProperty(message, 'flowReply')) {
		m.interactiveResponseMessage = {
			body: {
				format: message.flowReply.format || proto.Message.InteractiveResponseMessage.Body.Format.DEFAULT,
				text: message.flowReply.text
			},
			nativeFlowResponseMessage: {
				name: message.flowReply.name,
				paramsJson: message.flowReply.paramsJson || '{}',
				version: message.flowReply.version || 1
			}
		}
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

		const pollCreationMessage: proto.Message.IPollCreationMessage = {
			name: message.poll.name,
			selectableOptionsCount: message.poll.selectableCount,
			options: message.poll.values.map(optionName => ({ optionName }))
		}

		if (message.poll.toAnnouncementGroup) {
			// poll v2 is for community announcement groups (single select and multiple)
			m.pollCreationMessageV2 = pollCreationMessage
		} else if (message.poll.pollType === proto.Message.PollType.QUIZ) {
			if (!message.poll.correctAnswer) {
				throw new Boom('No "correctAnswer" provided for quiz', { statusCode: 400 })
			}

			m.pollCreationMessageV5 = {
				...pollCreationMessage,
				correctAnswer: { optionName: message.poll.correctAnswer },
				pollType: proto.Message.PollType.QUIZ,
				selectableOptionsCount: 1
			}
		} else if (message.poll.selectableCount === 1) {
			//poll v3 is for single select polls
			m.pollCreationMessageV3 = pollCreationMessage
		} else {
			// poll for multiple choice polls
			m.pollCreationMessage = pollCreationMessage
		}
	} else if (hasNonNullishProperty(message, 'pollResult')) {
		const pollResultSnapshotMessage: proto.Message.IPollResultSnapshotMessage = {
			name: message.pollResult.name,
			pollVotes: message.pollResult.votes.map(vote => ({
				optionName: vote.name,
				optionVoteCount: Number(vote.voteCount)
			})),
			pollType: message.pollResult.pollType ?? proto.Message.PollType.POLL
		}

		if (message.pollResult.pollType === proto.Message.PollType.QUIZ) {
			m.pollResultSnapshotMessageV3 = pollResultSnapshotMessage
		} else {
			m.pollResultSnapshotMessage = pollResultSnapshotMessage
		}
	} else if (hasNonNullishProperty(message, 'pollUpdate')) {
		m.pollUpdateMessage = {
			metadata: message.pollUpdate.metadata,
			pollCreationMessageKey: message.pollUpdate.key,
			senderTimestampMs: Date.now(),
			vote: message.pollUpdate.vote
		}
	} else if (hasNonNullishProperty(message, 'paymentInviteServiceType')) {
		m.paymentInviteMessage = {
			expiryTimestamp: Date.now(),
			serviceType: message.paymentInviteServiceType
		}
	} else if (hasNonNullishProperty(message, 'orderText')) {
		if (!Buffer.isBuffer(message.thumbnail)) {
			throw new Boom('Must provide thumbnail buffer in order message', { statusCode: 400 })
		}

		m.orderMessage = {
			itemCount: message.itemCount ?? 1,
			messageVersion: message.messageVersion ?? 1,
			orderTitle: message.orderTitle || 'Order',
			status: message.status ?? proto.Message.OrderMessage.OrderStatus.INQUIRY,
			surface: message.surface ?? proto.Message.OrderMessage.OrderSurface.CATALOG,
			token: message.token || generateMessageIDV2(),
			totalAmount1000: message.totalAmount1000 ?? 1000,
			totalCurrencyCode: message.totalCurrencyCode || 'INR',
			message: message.orderText,
			thumbnail: message.thumbnail
		}
	} else if (hasNonNullishProperty(message, 'album')) {
		if (Array.isArray(message.album)) {
			let imageCount = 0
			let videoCount = 0
			for (const media of message.album) {
				if ('image' in media) imageCount++
				if ('video' in media) videoCount++
			}

			if (imageCount + videoCount < 2) {
				throw new Boom('Provide at least 2 media items for an album', { statusCode: 400 })
			}

			m.albumMessage = { expectedImageCount: imageCount, expectedVideoCount: videoCount }
		} else {
			m.albumMessage = {
				expectedImageCount: message.album.expectedImageCount,
				expectedVideoCount: message.album.expectedVideoCount
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
		m = await prepareWAMessageMedia(message as AnyMediaMessageContent, options)
	}

	if (hasNonNullishProperty(message, 'buttons')) {
		const buttonsMessage: proto.Message.IButtonsMessage = {
			buttons: message.buttons.map(button => {
				const buttonText = button.text || button.buttonText

				if (button.sections) {
					return {
						nativeFlowInfo: {
							name: 'single_select',
							paramsJson: JSON.stringify({ title: buttonText, sections: button.sections })
						},
						type: proto.Message.ButtonsMessage.Button.Type.NATIVE_FLOW
					}
				}

				if (button.name) {
					return {
						nativeFlowInfo: { name: button.name, paramsJson: button.paramsJson },
						type: proto.Message.ButtonsMessage.Button.Type.NATIVE_FLOW
					}
				}

				return {
					buttonId: button.id || button.buttonId,
					buttonText: { displayText: buttonText || 'Click' },
					type: button.type || proto.Message.ButtonsMessage.Button.Type.RESPONSE
				}
			})
		}

		if (message.text) {
			buttonsMessage.contentText = message.text
			buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.EMPTY
		} else {
			if (message.caption) {
				buttonsMessage.contentText = message.caption
			}

			const contentKey = Object.keys(m)[0]
			if (contentKey) {
				const headerType = contentKey.replace('Message', '').toUpperCase()
				buttonsMessage.headerType =
					proto.Message.ButtonsMessage.HeaderType[headerType as keyof typeof proto.Message.ButtonsMessage.HeaderType]
			}

			Object.assign(buttonsMessage, m)
		}

		if (message.footer) {
			buttonsMessage.footerText = message.footer
		}

		m = { buttonsMessage }
	} else if (hasNonNullishProperty(message, 'sections')) {
		m = {
			listMessage: {
				sections: message.sections,
				buttonText: message.buttonText,
				title: message.title,
				footerText: message.footer,
				description: message.text,
				listType: proto.Message.ListMessage.ListType.SINGLE_SELECT
			}
		}
	} else if (hasNonNullishProperty(message, 'templateButtons')) {
		const hydratedTemplate: proto.Message.TemplateMessage.IHydratedFourRowTemplate = {
			hydratedButtons: message.templateButtons.map((button, index): proto.IHydratedTemplateButton => {
				const buttonText = button.text || button.buttonText

				if (button.id) {
					return {
						index,
						quickReplyButton: { displayText: buttonText || 'Click', id: button.id }
					}
				}

				if (button.url) {
					return {
						index,
						urlButton: { displayText: buttonText || 'Visit', url: button.url }
					}
				}

				if (button.call) {
					return {
						index,
						callButton: { displayText: buttonText || 'Call', phoneNumber: button.call }
					}
				}

				return button
			})
		}

		if (message.text) {
			hydratedTemplate.hydratedContentText = message.text
		} else {
			if (message.caption) {
				hydratedTemplate.hydratedTitleText = message.title
				hydratedTemplate.hydratedContentText = message.caption
			}

			Object.assign(hydratedTemplate, m)
		}

		if (message.footer) {
			hydratedTemplate.hydratedFooterText = message.footer
		}

		hydratedTemplate.templateId = message.id || `template-${Date.now()}`
		m = {
			templateMessage: {
				hydratedFourRowTemplate: hydratedTemplate,
				hydratedTemplate
			}
		}
	} else if (hasNonNullishProperty(message, 'nativeFlow')) {
		const interactive: proto.Message.IInteractiveMessage = {
			nativeFlowMessage: prepareNativeFlowButtons(message)
		}

		if (message.bizJid) {
			interactive.collectionMessage = {
				bizJid: message.bizJid,
				id: message.id,
				messageVersion: 1
			}
		} else if (message.shopSurface) {
			interactive.shopStorefrontMessage = {
				surface: message.shopSurface,
				id: message.id,
				messageVersion: 1
			}
		}

		if (message.text) {
			interactive.body = { text: message.text }
		} else {
			if (message.caption) {
				if (!hasValidInteractiveHeader(m)) {
					throw new Boom('Invalid media type for interactive message header', { statusCode: 400 })
				}

				interactive.header = {
					title: message.title || '',
					subtitle: message.subtitle || '',
					hasMediaAttachment: true
				}
				interactive.body = { text: message.caption }
			}

			if (hasValidInteractiveHeader(m)) {
				interactive.header = {
					...(interactive.header || { hasMediaAttachment: true }),
					...m
				}
			}
		}

		if (message.audioFooter) {
			const { audioMessage } = await prepareWAMessageMedia({ audio: message.audioFooter }, options)
			interactive.footer = { audioMessage, hasMediaAttachment: true }
		} else if (message.footer) {
			interactive.footer = { text: message.footer }
		}

		m = { interactiveMessage: interactive }
	} else if (hasNonNullishProperty(message, 'cards')) {
		const cards: proto.Message.IInteractiveMessage[] = await Promise.all(
			message.cards.map(async card => {
				let cardHeader: WAMessageContent = {}

				if (card.product) {
					const { imageMessage } = await prepareWAMessageMedia({ image: card.product.productImage }, options)
					cardHeader.productMessage = WAProto.Message.ProductMessage.create({
						product: { ...card.product, productImage: imageMessage }
					})
				} else {
					cardHeader = await prepareWAMessageMedia(card as AnyMediaMessageContent, options).catch(() => ({}))
				}

				if (!hasValidCarouselHeader(cardHeader)) {
					throw new Boom('Invalid media type for carousel card', { statusCode: 400 })
				}

				const carouselCard: proto.Message.IInteractiveMessage = {
					nativeFlowMessage: card.nativeFlow
						? prepareNativeFlowButtons(card as NativeFlowContent)
						: { buttons: [], messageParamsJson: '{}' }
				}

				if (card.text) {
					carouselCard.body = { text: card.text }
				} else {
					if (card.caption) {
						carouselCard.header = {
							title: card.title || '',
							subtitle: card.subtitle || '',
							hasMediaAttachment: true
						}
						carouselCard.body = { text: card.caption }
					}

					carouselCard.header = {
						...(carouselCard.header || { hasMediaAttachment: true }),
						...cardHeader
					}
				}

				if (card.audioFooter) {
					const { audioMessage } = await prepareWAMessageMedia({ audio: card.audioFooter }, options)
					carouselCard.footer = { audioMessage, hasMediaAttachment: true }
				} else if (card.footer) {
					carouselCard.footer = { text: card.footer }
				}

				return carouselCard
			})
		)

		const interactive: proto.Message.IInteractiveMessage = {
			carouselMessage: {
				cards,
				carouselCardType: proto.Message.InteractiveMessage.CarouselMessage.CarouselCardType.UNKNOWN,
				messageVersion: 1
			}
		}

		if (message.text) {
			interactive.body = { text: message.text }
		}

		if (message.footer) {
			interactive.footer = { text: message.footer }
		}

		m = { interactiveMessage: interactive }
	} else if (hasNonNullishProperty(message, 'requestPaymentFrom')) {
		if (!m.extendedTextMessage && !m.stickerMessage) {
			throw new Boom('Invalid message type for request payment note message', { statusCode: 400 })
		}

		m = {
			requestPaymentMessage: {
				noteMessage: m,
				requestFrom: message.requestPaymentFrom,
				amount1000: message.amount1000 ?? 1000,
				currencyCodeIso4217: message.currencyCodeIso4217 || 'INR',
				expiryTimestamp: message.expiryTimestamp ?? Date.now(),
				background: message.background
			}
		}
	} else if (hasNonNullishProperty(message, 'invoiceNote')) {
		const attachment = m.imageMessage || m.documentMessage
		if (!attachment) {
			throw new Boom('Invalid media type for invoice message', { statusCode: 400 })
		}

		const isDocument = !!m.documentMessage
		m = {
			invoiceMessage: {
				note: message.invoiceNote,
				attachmentType: isDocument
					? proto.Message.InvoiceMessage.AttachmentType.PDF
					: proto.Message.InvoiceMessage.AttachmentType.IMAGE,
				attachmentDirectPath: attachment.directPath ?? undefined,
				attachmentFileEncSha256: attachment.fileEncSha256 ?? undefined,
				attachmentFileSha256: attachment.fileSha256 ?? undefined,
				attachmentJpegThumbnail: attachment.jpegThumbnail ?? undefined,
				attachmentMediaKey: attachment.mediaKey ?? undefined,
				attachmentMediaKeyTimestamp: attachment.mediaKeyTimestamp ?? undefined,
				attachmentMimetype: attachment.mimetype ?? undefined,
				token: generateMessageIDV2()
			}
		}
	}

	if (hasNonNullishProperty(message, 'externalAdReply')) {
		const messageType = Object.keys(m)[0] as keyof proto.IMessage
		const key = m[messageType] as { contextInfo?: proto.IContextInfo } | undefined
		if (!key) {
			throw new Boom('Invalid message type for external ad reply', { statusCode: 400 })
		}

		const content = message.externalAdReply
		const { subTitle, largeThumbnail, url, ...rest } = content
		const externalAdReply: NonNullable<proto.IContextInfo['externalAdReply']> = {
			...rest,
			body: content.body,
			mediaType: content.mediaType || 1,
			mediaUrl: url,
			renderLargerThumbnail: largeThumbnail,
			sourceUrl: url,
			thumbnail: content.thumbnail,
			thumbnailUrl: url ? `${url}?update=${Date.now()}` : undefined,
			title: content.title || rest.title
		}
		void subTitle

		key.contextInfo = { ...key.contextInfo, externalAdReply }
	}

	if (hasOptionalProperty(message, 'groupStatus') && !!message.groupStatus) {
		const messageType = Object.keys(m)[0] as keyof proto.IMessage
		const key = m[messageType] as { contextInfo?: proto.IContextInfo } | undefined
		if (key) {
			key.contextInfo = { ...key.contextInfo, isGroupStatus: true }
		}

		m = { groupStatusMessageV2: { message: m } }
	}

	if (hasOptionalProperty(message, 'interactiveAsTemplate') && !!message.interactiveAsTemplate) {
		if (!m.interactiveMessage) {
			throw new Boom('Invalid message type for template', { statusCode: 400 })
		}

		m = {
			templateMessage: {
				interactiveMessageTemplate: m.interactiveMessage,
				templateId:
					('id' in message && typeof message.id === 'string' ? message.id : undefined) || `template-${Date.now()}`
			}
		}
	}

	if (hasOptionalProperty(message, 'ephemeral') && !!message.ephemeral) {
		m = { ephemeralMessage: { message: m } }
	}

	if (hasOptionalProperty(message, 'isLottie') && !!message.isLottie) {
		m = { lottieStickerMessage: { message: m } }
	} else if (hasOptionalProperty(message, 'viewOnce') && !!message.viewOnce) {
		m = { viewOnceMessage: { message: m } }
	} else if (hasOptionalProperty(message, 'viewOnceV2') && !!message.viewOnceV2) {
		m = { viewOnceMessageV2: { message: m } }
	} else if (hasOptionalProperty(message, 'viewOnceV2Extension') && !!message.viewOnceV2Extension) {
		m = { viewOnceMessageV2Extension: { message: m } }
	}

	if (
		(hasOptionalProperty(message, 'mentions') && message.mentions?.length) ||
		(hasOptionalProperty(message, 'mentionAll') && message.mentionAll)
	) {
		const messageType = Object.keys(m)[0]! as Extract<keyof proto.IMessage, MessageWithContextInfo>
		const key = m[messageType]
		if (key && 'contextInfo' in key) {
			key.contextInfo = key.contextInfo || {}
			if (message.mentions?.length) {
				key.contextInfo.mentionedJid = message.mentions
			}

			if (message.mentionAll) {
				key.contextInfo.nonJidMentions = 1
			}
		} else if (key!) {
			key.contextInfo = {
				mentionedJid: message.mentions,
				nonJidMentions: message.mentionAll ? 1 : 0
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

	if (hasOptionalProperty(message, 'albumParentKey') && !!message.albumParentKey) {
		m.messageContextInfo = {
			...m.messageContextInfo,
			messageAssociation: {
				associationType: WAProto.MessageAssociation.AssociationType.MEDIA_ALBUM,
				parentMessageKey: message.albumParentKey
			}
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

/**
 * Builds the follow-up message that mentions a status/story in the given chat.
 * WA Web sends it after publishing the status itself; group mentions use the
 * `groupStatusMentionMessage` wrapper.
 */
export const buildStatusMentionContent = (statusKey: proto.IMessageKey, isGroup: boolean): WAMessageContent => ({
	messageContextInfo: { messageSecret: randomBytes(32) },
	...(isGroup
		? {
				groupStatusMentionMessage: {
					message: {
						protocolMessage: { key: statusKey, type: proto.Message.ProtocolMessage.Type.STATUS_MENTION_MESSAGE }
					}
				}
			}
		: {
				statusMentionMessage: {
					message: {
						protocolMessage: { key: statusKey, type: proto.Message.ProtocolMessage.Type.STATUS_MENTION_MESSAGE }
					}
				}
			})
})

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

	// plain text has no place to carry contextInfo, so a quoted plain-text message is
	// encoded as extendedTextMessage (the shape sendMessage already uses for text)
	if (options.quoted && !innerMessage.extendedTextMessage && innerMessage.conversation) {
		innerMessage.extendedTextMessage = { text: innerMessage.conversation }
		delete innerMessage.conversation
	}

	const key = getContentType(innerMessage)! as Exclude<keyof proto.IMessage, 'conversation'>
	const timestamp = unixTimestampSeconds(options.timestamp)
	const { quoted, userJid } = options

	if (quoted) {
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

		// the content may be a plain string (conversation), where `in` would throw
		const quotedTarget = innerMessage[key]
		const contextInfo: proto.IContextInfo =
			(typeof quotedTarget === 'object' && quotedTarget && 'contextInfo' in quotedTarget
				? quotedTarget.contextInfo
				: undefined) || {}
		contextInfo.participant = jidNormalizedUser(participant!)
		contextInfo.stanzaId = quoted.key.id
		contextInfo.quotedMessage = quotedMsg

		// if a participant is quoted, then it must be a group
		// hence, remoteJid of group must also be entered.
		// newsletters quote within their own channel, so remoteJid is omitted
		if (!isJidNewsletter(jid) && jid !== quoted.key.remoteJid) {
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
			message?.groupStatusMessageV2 ||
			message?.lottieStickerMessage
		)
	}
}

/**
 * Whether the outgoing content is view once media (image, video, round video or audio).
 * WA Web tags these sends with a `<meta view_once="true"/>` stanza node.
 * Looks through a disappearing message wrapper. View once wrappers around
 * anything else (e.g. buttons wrapped so they render) don't count.
 */
export const isViewOnceMessage = (content: WAMessageContent | null | undefined) => {
	const inner = content?.ephemeralMessage?.message ?? content
	const wrapped = (inner?.viewOnceMessage || inner?.viewOnceMessageV2 || inner?.viewOnceMessageV2Extension)?.message
	return !!(wrapped?.imageMessage || wrapped?.videoMessage || wrapped?.ptvMessage || wrapped?.audioMessage)
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
 * When a media link's signature expires, in ms: its `oe` query parameter, in hex unix seconds.
 * Undefined unless the query carries exactly one `oe` and it is plain hex.
 */
const mediaLinkExpiry = (link: string) => {
	let values: string[]
	try {
		// a directPath has no host; the base only makes it parseable
		values = new URL(link, 'https://mmg.whatsapp.net').searchParams.getAll('oe')
	} catch {
		return undefined
	}

	const [oe] = values
	if (values.length !== 1 || !oe || !/^[0-9a-f]+$/i.test(oe)) {
		return undefined
	}

	const expiry = parseInt(oe, 16) * 1000
	return Number.isSafeInteger(expiry) ? expiry : undefined
}

/**
 * Whether a 403 is worth a reupload: the link that failed carries an `oe` that has passed.
 * A conservative heuristic, not a documented contract: in a sample of 84 history-sync
 * downloads the media CDN answered 403 for all 34 links whose `oe` had passed and for none
 * of the 50 whose `oe` had not. It reads the local clock, so a clock that is off moves the line.
 * The link is the url getHttpStream reports on its error, or else the one
 * downloadContentFromMessage requests: the directPath when there is one, else the url.
 */
const isExpiredLinkError = (error: unknown, message: WAMessage) => {
	let link: unknown = (error as { data?: { url?: unknown } } | undefined)?.data?.url
	if (typeof link !== 'string' && !(link instanceof URL)) {
		const content = extractMessageContent(message.message)
		const contentType = content ? getContentType(content) : undefined
		const media = (contentType && content?.[contentType]) as
			{ url?: string | null; directPath?: string | null } | undefined
		link = media?.directPath || media?.url
	}

	if (!link) {
		return false
	}

	const expiry = mediaLinkExpiry(link.toString())
	return expiry !== undefined && expiry <= Date.now()
}

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
		// the media download throws a Boom, which carries the HTTP status on output.statusCode, not on status
		const status = error?.output?.statusCode ?? error?.status
		const expired =
			typeof status === 'number' &&
			(REUPLOAD_REQUIRED_STATUS.includes(status) || (status === 403 && isExpiredLinkError(error, message)))
		if (ctx && expired) {
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
