import { Boom } from '@hapi/boom'
import { createReadStream, promises as fs } from "fs"
import { proto } from '../../WAMessage'
import { MEDIA_KEYS, URL_REGEX, WA_DEFAULT_EPHEMERAL } from "../Defaults"
import { 
	AnyMediaMessageContent, 
	AnyMessageContent, 
	MediaGenerationOptions, 
	MessageContentGenerationOptions, 
	MessageGenerationOptions, 
	MessageGenerationOptionsFromContent,
	MessageType, 
	WAMediaUpload, 
	WAMessage, 
	WAMessageContent, 
	WAMessageProto, 
	WATextMessage,
	MediaType, 
	WAMessageStatus
} from "../Types"
import { generateMessageID, unixTimestampSeconds, whatsappID } from "./generics"
import { encryptedStream, generateThumbnail, getAudioDuration } from "./messages-media"

type MediaUploadData = {
	media: WAMediaUpload
	caption?: string
	ptt?: boolean
	seconds?: number
	gifPlayback?: boolean
	fileName?: string
	jpegThumbnail?: string
	mimetype?: string
}

const MIMETYPE_MAP: { [T in MediaType]: string } = {
    image: 'image/jpeg',
    video: 'video/mp4',
    document: 'application/pdf',
    audio: 'audio/ogg; codecs=opus',
    sticker: 'image/webp',
}

const MessageTypeProto = {
    'image': WAMessageProto.ImageMessage,
    'video': WAMessageProto.VideoMessage,
    'audio': WAMessageProto.AudioMessage,
    'sticker': WAMessageProto.StickerMessage,
   	'document': WAMessageProto.DocumentMessage,
} as const

const ButtonType = proto.ButtonsMessage.ButtonsMessageHeaderType

export const prepareWAMessageMedia = async(
	message: AnyMediaMessageContent, 
	options: MediaGenerationOptions
) => {
	let mediaType: typeof MEDIA_KEYS[number]
	for(const key of MEDIA_KEYS) {
		if(key in message) {
			mediaType = key
		}
	}
	const uploadData: MediaUploadData = { 
		...message,
		[mediaType]: undefined,
		media: message[mediaType]
	}
	// check for cache hit
	if(typeof uploadData.media === 'object' && 'url' in uploadData.media) {
		const result = !!options.mediaCache && await options.mediaCache!(uploadData.media.url?.toString())
		if(result) {
			return WAMessageProto.Message.fromObject({
				[`${mediaType}Message`]: result
			})
		}
	}
	if(mediaType === 'document' && !uploadData.fileName) {
		uploadData.fileName = 'file'
	}
	if(!uploadData.mimetype) {
		uploadData.mimetype = MIMETYPE_MAP[mediaType]
	}
	const requiresDurationComputation = mediaType === 'audio' && typeof uploadData.seconds === 'undefined'
	const requiresThumbnailComputation = (mediaType === 'image' || mediaType === 'video') && 
										(typeof uploadData['jpegThumbnail'] === 'undefined')
	const requiresOriginalForSomeProcessing = requiresDurationComputation || requiresThumbnailComputation
	const {
		mediaKey,
		encBodyPath,
		bodyPath,
		fileEncSha256,
		fileSha256,
		fileLength,
		didSaveToTmpPath
	} = await encryptedStream(uploadData.media, mediaType, requiresOriginalForSomeProcessing)
	 // url safe Base64 encode the SHA256 hash of the body
	const fileEncSha256B64 = encodeURIComponent( 
		fileEncSha256.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/\=+$/, '')
	)
	try {
		if(requiresThumbnailComputation) {
			uploadData.jpegThumbnail = await generateThumbnail(bodyPath, mediaType as any, options)
		}
		if (requiresDurationComputation) {
			uploadData.seconds = await getAudioDuration(bodyPath)
		}
	} catch (error) {
		options.logger?.info({ trace: error.stack }, 'failed to obtain extra info')
	}
	const {mediaUrl} = await options.upload(
		createReadStream(encBodyPath),
		{ fileEncSha256B64, mediaType }
	)
	// remove tmp files
	await Promise.all(
		[
			fs.unlink(encBodyPath),
			didSaveToTmpPath && bodyPath && fs.unlink(bodyPath)
		]
		.filter(Boolean)
	)
	delete uploadData.media
	const content = {
		[`${mediaType}Message`]: MessageTypeProto[mediaType].fromObject(
			{
				url: mediaUrl,
				mediaKey,
				fileEncSha256,
				fileSha256,
				fileLength,
				
				...uploadData
			}
		)
	}
	return WAMessageProto.Message.fromObject(content)
}
export const prepareDisappearingMessageSettingContent = (ephemeralExpiration?: number) => {
	ephemeralExpiration = ephemeralExpiration || 0
	const content: WAMessageContent = {
		ephemeralMessage: {
			message: {
				protocolMessage: {
					type: WAMessageProto.ProtocolMessage.ProtocolMessageType.EPHEMERAL_SETTING,
					ephemeralExpiration
				}
			}
		}
	}
	return WAMessageProto.Message.fromObject(content)
}
/**
 * Generate forwarded message content like WA does
 * @param message the message to forward
 * @param options.forceForward will show the message as forwarded even if it is from you
 */
export const generateForwardMessageContent = (
	message: WAMessage,
	forceForward?: boolean
) => {
	let content = message.message
	if (!content) throw new Boom('no content in message', { statusCode: 400 })
	content = JSON.parse(JSON.stringify(content)) // hacky copy

	let key = Object.keys(content)[0] as MessageType

	let score = content[key].contextInfo?.forwardingScore || 0
	score += message.key.fromMe && !forceForward ? 0 : 1
	if (key === 'conversation') {
		content.extendedTextMessage = { text: content[key] }
		delete content.conversation

		key = 'extendedTextMessage'
	}
	if (score > 0) content[key].contextInfo = { forwardingScore: score, isForwarded: true }
	else content[key].contextInfo = {}

	return content
}
export const generateWAMessageContent = async(
	message: AnyMessageContent, 
	options: MessageContentGenerationOptions
) => {
	let m: WAMessageContent = {}
	if('text' in message) {
		const extContent = { ...message } as WATextMessage
		if (!!options.getUrlInfo && message.text.match(URL_REGEX)) {
			try {
				const data = await options.getUrlInfo(message.text)
				extContent.canonicalUrl = data['canonical-url']
				extContent.matchedText = data['matched-text']
				extContent.jpegThumbnail = data.jpegThumbnail
				extContent.description = data.description
				extContent.title = data.title
				extContent.previewType = 0
			} catch (error) { // ignore if fails
				
			} 
		}
		m.extendedTextMessage = extContent
	} else if('contacts' in message) {
		const contactLen = message.contacts.contacts.length
		if(!contactLen) {
			throw new Boom('require atleast 1 contact', { statusCode: 400 })
		} 
		if(contactLen === 1) {
			m.contactMessage = WAMessageProto.ContactMessage.fromObject(message.contacts.contacts[0])
		}
	} else if('location' in message) {
		m.locationMessage = WAMessageProto.LocationMessage.fromObject(message.location)
	} else if('delete' in message) {
		m.protocolMessage = {
			key: message.delete,
			type: WAMessageProto.ProtocolMessage.ProtocolMessageType.REVOKE
		}
	} else if('forward' in message) {
		m = generateForwardMessageContent(
			message.forward,
			message.force
		)
	} else if('disappearingMessagesInChat' in message) {
		const exp = typeof message.disappearingMessagesInChat === 'boolean' ? 
					(message.disappearingMessagesInChat ? WA_DEFAULT_EPHEMERAL : 0) :
					message.disappearingMessagesInChat
		m = prepareDisappearingMessageSettingContent(exp)
	} else {
		m = await prepareWAMessageMedia(
			message,
			options
		)
	}
	if('buttons' in message && !!message.buttons) {
		const buttonsMessage: proto.IButtonsMessage = {
			buttons: message.buttons!,
			text: ''
		}
		if('text' in message) {
			buttonsMessage.contentText = message.text
			buttonsMessage.headerType = ButtonType.TEXT
		} else {
			if('caption' in message) {
				buttonsMessage.contentText = message.caption
			}
			const type = Object.keys(m)[0].replace('Message', '').toUpperCase()
			buttonsMessage.headerType = ButtonType[type]
			
			Object.assign(buttonsMessage, m)
		}
		m = { buttonsMessage }
	}
	if('viewOnce' in message && !!message.viewOnce) {
		m = { viewOnceMessage: { message: m } }
	}
	if('mentions' in message && message.mentions?.length) {
		const [messageType] = Object.keys(m)
		m[messageType].contextInfo = m[messageType] || { }
		m[messageType].contextInfo.mentionedJid = message.mentions
	}
	return WAMessageProto.Message.fromObject(m)
}
export const generateWAMessageFromContent = (
	jid: string, 
	message: WAMessageContent, 
	options: MessageGenerationOptionsFromContent
) => {
	if (!options.timestamp) options.timestamp = new Date() // set timestamp to now
	// prevent an annoying bug (WA doesn't accept sending messages with '@c.us')
	jid = whatsappID(jid)

	const key = Object.keys(message)[0]
	const timestamp = unixTimestampSeconds(options.timestamp)
	const { quoted, userJid } = options

	if (quoted) {
		const participant = quoted.key.fromMe ? userJid : (quoted.participant || quoted.key.participant || quoted.key.remoteJid)

		message[key].contextInfo = message[key].contextInfo || { }
		message[key].contextInfo.participant = participant
		message[key].contextInfo.stanzaId = quoted.key.id
		message[key].contextInfo.quotedMessage = quoted.message
		
		// if a participant is quoted, then it must be a group
		// hence, remoteJid of group must also be entered
		if (quoted.key.participant) {
			message[key].contextInfo.remoteJid = quoted.key.remoteJid
		}
	}
	if(
		// if we want to send a disappearing message
		!!options?.ephemeralOptions &&
		// and it's not a protocol message -- delete, toggle disappear message
		key !== 'protocolMessage' &&
		// already not converted to disappearing message
		key !== 'ephemeralMessage' 
	) {
		message[key].contextInfo = {
			...(message[key].contextInfo || {}),
			expiration: options.ephemeralOptions.expiration || WA_DEFAULT_EPHEMERAL,
			ephemeralSettingTimestamp: options.ephemeralOptions.eph_setting_ts?.toString()
		}
		message = {
			ephemeralMessage: {
				message
			}
		}
	} 
	message = WAMessageProto.Message.fromObject (message)

	const messageJSON = {
		key: {
			remoteJid: jid,
			fromMe: true,
			id: options?.messageId || generateMessageID(),
		},
		message: message,
		messageTimestamp: timestamp,
		messageStubParameters: [],
		participant: jid.includes('@g.us') ? userJid : undefined,
		status: WAMessageStatus.PENDING
	}
	return WAMessageProto.WebMessageInfo.fromObject (messageJSON)
}
export const generateWAMessage = async(
	jid: string,
	content: AnyMessageContent,
	options: MessageGenerationOptions,
) => (
	generateWAMessageFromContent(
		jid,
		await generateWAMessageContent(
			content,
			options
		),
		options
	)
)