import { Boom } from '@hapi/boom'
import { promises as fs } from 'fs'
import { proto } from '../../WAProto'
import { MEDIA_KEYS, URL_REGEX, WA_DEFAULT_EPHEMERAL } from '../Defaults'
import { 
	AnyMediaMessageContent, 
	AnyMessageContent, 
	MediaGenerationOptions, 
	MediaType, 
	MessageContentGenerationOptions, 
	MessageGenerationOptions, 
	MessageGenerationOptionsFromContent,
	MessageType, 
	MessageUserReceipt,
	WAMediaUpload, 
	WAMessage, 
	WAMessageContent, 
	WAMessageStatus,
	WAProto, 
	WATextMessage 
} from '../Types'
import { generateMessageID, unixTimestampSeconds } from './generics'
import { encryptedStream, generateThumbnail, getAudioDuration } from './messages-media'

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
	history: 'application/x-protobuf',
	'md-app-state': 'application/x-protobuf',
}

const MessageTypeProto = {
	'image': WAProto.ImageMessage,
	'video': WAProto.VideoMessage,
	'audio': WAProto.AudioMessage,
	'sticker': WAProto.StickerMessage,
   	'document': WAProto.DocumentMessage,
} as const

const ButtonType = proto.ButtonsMessage.ButtonsMessageHeaderType

export const prepareWAMessageMedia = async(
	message: AnyMediaMessageContent, 
	options: MediaGenerationOptions
) => {
	const logger = options.logger

	let mediaType: typeof MEDIA_KEYS[number]
	for(const key of MEDIA_KEYS) {
		if(key in message) {
			mediaType = key
		}
	}

	const uploadData: MediaUploadData = { 
		...message,
		media: message[mediaType]
	}
	delete uploadData[mediaType]
	// check if cacheable + generate cache key
	const cacheableKey = typeof uploadData.media === 'object' && 
			('url' in uploadData.media) && 
			!!uploadData.media.url && 
			!!options.mediaCache && (
	// generate the key
		mediaType + ':' + uploadData.media.url!.toString()
	)

	if(mediaType === 'document' && !uploadData.fileName) {
		uploadData.fileName = 'file'
	}

	if(!uploadData.mimetype) {
		uploadData.mimetype = MIMETYPE_MAP[mediaType]
	}

	// check for cache hit
	if(cacheableKey) {
		const mediaBuff: Buffer = options.mediaCache!.get(cacheableKey)
		if(mediaBuff) {
			logger?.debug({ cacheableKey }, 'got media cache hit')
			
			const obj = WAProto.Message.decode(mediaBuff)
			const key = `${mediaType}Message`

			delete uploadData.media
			Object.assign(obj[key], { ...uploadData })

			return obj
		}
	}

	const requiresDurationComputation = mediaType === 'audio' && typeof uploadData.seconds === 'undefined'
	const requiresThumbnailComputation = (mediaType === 'image' || mediaType === 'video') && 
										(typeof uploadData['jpegThumbnail'] === 'undefined')
	const requiresOriginalForSomeProcessing = requiresDurationComputation || requiresThumbnailComputation
	const {
		mediaKey,
		encWriteStream,
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

	const [{ mediaUrl, directPath }] = await Promise.all([
		(async() => {
			const result = await options.upload(
				encWriteStream,
				{ fileEncSha256B64, mediaType, timeoutMs: options.mediaUploadTimeoutMs }
			)
			logger?.debug('uploaded media')
			return result
		})(),
		(async() => {
			try {
				if(requiresThumbnailComputation) {
					uploadData.jpegThumbnail = await generateThumbnail(bodyPath, mediaType as any, options)
					logger?.debug('generated thumbnail')
				}

				if(requiresDurationComputation) {
					uploadData.seconds = await getAudioDuration(bodyPath)
					logger?.debug('computed audio duration')
				}
			} catch(error) {
				logger?.warn({ trace: error.stack }, 'failed to obtain extra info')
			}
		})(),
	])
		.finally(
			async() => {
				encWriteStream.destroy()
				// remove tmp files
				if(didSaveToTmpPath && bodyPath) {
					await fs.unlink(bodyPath)
					logger?.debug('removed tmp files')
				}
			}
		)

	delete uploadData.media

	const obj = WAProto.Message.fromObject({
		[`${mediaType}Message`]: MessageTypeProto[mediaType].fromObject(
			{
				url: mediaUrl,
				directPath,
				mediaKey,
				fileEncSha256,
				fileSha256,
				fileLength,
				mediaKeyTimestamp: unixTimestampSeconds(),
				...uploadData
			}
		)
	})

	if(cacheableKey) {
		logger.debug({ cacheableKey }, 'set cache')
		options.mediaCache!.set(cacheableKey, WAProto.Message.encode(obj).finish())
	}

	return obj
}

export const prepareDisappearingMessageSettingContent = (ephemeralExpiration?: number) => {
	ephemeralExpiration = ephemeralExpiration || 0
	const content: WAMessageContent = {
		ephemeralMessage: {
			message: {
				protocolMessage: {
					type: WAProto.ProtocolMessage.ProtocolMessageType.EPHEMERAL_SETTING,
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
export const generateForwardMessageContent = (
	message: WAMessage,
	forceForward?: boolean
) => {
	let content = message.message
	if(!content) {
		throw new Boom('no content in message', { statusCode: 400 })
	}

	// hacky copy
	content = proto.Message.decode(proto.Message.encode(message.message).finish())

	let key = Object.keys(content)[0] as MessageType

	let score = content[key].contextInfo?.forwardingScore || 0
	score += message.key.fromMe && !forceForward ? 0 : 1
	if(key === 'conversation') {
		content.extendedTextMessage = { text: content[key] }
		delete content.conversation

		key = 'extendedTextMessage'
	}

	if(score > 0) {
		content[key].contextInfo = { forwardingScore: score, isForwarded: true }
	} else {
		content[key].contextInfo = {}
	}

	return content
}

export const generateWAMessageContent = async(
	message: AnyMessageContent, 
	options: MessageContentGenerationOptions
) => {
	let m: WAMessageContent = {}
	if('text' in message) {
		const extContent = { ...message } as WATextMessage
		if(!!options.getUrlInfo && message.text.match(URL_REGEX)) {
			try {
				const data = await options.getUrlInfo(message.text)
				extContent.canonicalUrl = data['canonical-url']
				extContent.matchedText = data['matched-text']
				extContent.jpegThumbnail = data.jpegThumbnail
				extContent.description = data.description
				extContent.title = data.title
				extContent.previewType = 0
			} catch(error) { // ignore if fails
				options.logger?.warn({ trace: error.stack }, 'url generation failed')
			} 
		}

		m.extendedTextMessage = extContent
	} else if('contacts' in message) {
		const contactLen = message.contacts.contacts.length
		if(!contactLen) {
			throw new Boom('require atleast 1 contact', { statusCode: 400 })
		}
 
		if(contactLen === 1) {
			m.contactMessage = WAProto.ContactMessage.fromObject(message.contacts.contacts[0])
		} else {
			m.contactsArrayMessage = WAProto.ContactsArrayMessage.fromObject(message.contacts)
		}
	} else if('location' in message) {
		m.locationMessage = WAProto.LocationMessage.fromObject(message.location)
	} else if('delete' in message) {
		m.protocolMessage = {
			key: message.delete,
			type: WAProto.ProtocolMessage.ProtocolMessageType.REVOKE
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
			buttons: message.buttons!.map(b => ({ ...b, type: proto.Button.ButtonType.RESPONSE }))
		}
		if('text' in message) {
			buttonsMessage.contentText = message.text
			buttonsMessage.headerType = ButtonType.EMPTY
		} else {
			if('caption' in message) {
				buttonsMessage.contentText = message.caption
			}

			const type = Object.keys(m)[0].replace('Message', '').toUpperCase()
			buttonsMessage.headerType = ButtonType[type]
			
			Object.assign(buttonsMessage, m)
		}

		if('footer' in message && !!message.footer) {
			buttonsMessage.footerText = message.footer
		}

		m = { buttonsMessage }
	} else if('templateButtons' in message && !!message.templateButtons) {
		const templateMessage: proto.ITemplateMessage = {
			hydratedTemplate: {
				hydratedButtons: message.templateButtons
			}
		}
		
		if('text' in message) {
			templateMessage.hydratedTemplate.hydratedContentText = message.text
		} else {

			if('caption' in message) {
				templateMessage.hydratedTemplate.hydratedContentText = message.caption
			}
			
			Object.assign(templateMessage.hydratedTemplate, m)
		}

		if('footer' in message && !!message.footer) {
			templateMessage.hydratedTemplate.hydratedFooterText = message.footer
		}

		m = { templateMessage }
	}
	
	if('sections' in message && !!message.sections) {
		const listMessage: proto.IListMessage = {
			sections: message.sections,
			buttonText: message.buttonText,
			title: message.title,
			footerText: message.footer,
			description: message.text,
			listType: proto.ListMessage.ListMessageListType['SINGLE_SELECT']
		}

		m = { listMessage }
	}

	if('viewOnce' in message && !!message.viewOnce) {
		m = { viewOnceMessage: { message: m } }
	}

	if('mentions' in message && message.mentions?.length) {
		const [messageType] = Object.keys(m)
		m[messageType].contextInfo = m[messageType] || { }
		m[messageType].contextInfo.mentionedJid = message.mentions
	}

	return WAProto.Message.fromObject(m)
}

export const generateWAMessageFromContent = (
	jid: string, 
	message: WAMessageContent, 
	options: MessageGenerationOptionsFromContent
) => {
	if(!options.timestamp) {
		options.timestamp = new Date()
	} // set timestamp to now

	const key = Object.keys(message)[0]
	const timestamp = unixTimestampSeconds(options.timestamp)
	const { quoted, userJid } = options

	if(quoted) {
		const participant = quoted.key.fromMe ? userJid : (quoted.participant || quoted.key.participant || quoted.key.remoteJid)

		message[key].contextInfo = message[key].contextInfo || { }
		message[key].contextInfo.participant = participant
		message[key].contextInfo.stanzaId = quoted.key.id
		message[key].contextInfo.quotedMessage = quoted.message
		
		// if a participant is quoted, then it must be a group
		// hence, remoteJid of group must also be entered
		if(quoted.key.participant || quoted.participant) {
			message[key].contextInfo.remoteJid = quoted.key.remoteJid
		}
	}

	if(
		// if we want to send a disappearing message
		!!options?.ephemeralExpiration &&
		// and it's not a protocol message -- delete, toggle disappear message
		key !== 'protocolMessage' &&
		// already not converted to disappearing message
		key !== 'ephemeralMessage' 
	) {
		message[key].contextInfo = {
			...(message[key].contextInfo || {}),
			expiration: options.ephemeralExpiration || WA_DEFAULT_EPHEMERAL,
			//ephemeralSettingTimestamp: options.ephemeralOptions.eph_setting_ts?.toString()
		}
		message = {
			ephemeralMessage: {
				message
			}
		}
	}

	message = WAProto.Message.fromObject(message)

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
	return WAProto.WebMessageInfo.fromObject(messageJSON)
}

export const generateWAMessage = async(
	jid: string,
	content: AnyMessageContent,
	options: MessageGenerationOptions,
) => {
	// ensure msg ID is with every log
	options.logger = options?.logger?.child({ msgId: options.messageId })
	return generateWAMessageFromContent(
		jid,
		await generateWAMessageContent(
			content,
			options
		),
		options
	)
}

/** Get the key to access the true type of content */
export const getContentType = (content: WAProto.IMessage | undefined) => {
	if(content) {
		const keys = Object.keys(content)
		const key = keys.find(k => (k === 'conversation' || k.endsWith('Message')) && k !== 'senderKeyDistributionMessage')
		return key as keyof typeof content
	}
}

/**
 * Extract the true message content from a message
 * Eg. extracts the inner message from a disappearing message/view once message
 */
export const extractMessageContent = (content: WAMessageContent | undefined | null): WAMessageContent | undefined => {
	const extractFromTemplateMessage = (msg: proto.IHydratedFourRowTemplate | proto.IButtonsMessage) => {
		if(msg.imageMessage) {
			return { imageMessage: msg.imageMessage }
		} else if(msg.documentMessage) {
			return { documentMessage: msg.documentMessage }
		} else if(msg.videoMessage) {
			return { videoMessage: msg.videoMessage }
		} else if(msg.locationMessage) {
			return { locationMessage: msg.locationMessage }
		} else {
			return { conversation: 'contentText' in msg ? msg.contentText : ('hydratedContentText' in msg ? msg.hydratedContentText : '') }
		}
	}
	
	content = content?.ephemeralMessage?.message || 
				content?.viewOnceMessage?.message ||
				content || 
				undefined

	if(content?.buttonsMessage) {
	  return extractFromTemplateMessage(content.buttonsMessage!)
	}

	if(content?.templateMessage?.hydratedFourRowTemplate) {
		return extractFromTemplateMessage(content?.templateMessage?.hydratedFourRowTemplate)
	}

	if(content?.templateMessage?.hydratedTemplate) {
		return extractFromTemplateMessage(content?.templateMessage?.hydratedTemplate)
	}

	if(content?.templateMessage?.fourRowTemplate) {
		return extractFromTemplateMessage(content?.templateMessage?.fourRowTemplate)
	}

	return content
}

/**
 * Returns the device predicted by message ID
 */
export const getDevice = (id: string) => {
	const deviceType = id.length > 21 ? 'android' : id.substring(0, 2) === '3A' ? 'ios' : 'web'
	return deviceType
}

export const updateMessageWithReceipt = (msg: WAMessage, receipt: MessageUserReceipt) => {
	msg.userReceipt = msg.userReceipt || []
	const recp = msg.userReceipt.find(m => m.userJid === receipt.userJid)
	if(recp) {
		Object.assign(recp, receipt)
	} else {
		msg.userReceipt.push(receipt)
	}
}
