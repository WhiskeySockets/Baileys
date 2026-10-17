import type { Readable } from 'stream'
import type { URL } from 'url'
import { proto } from '../../WAProto/index.js'
import type { MediaType } from '../Defaults'
import type { BinaryNode } from '../WABinary'
import type { GroupMetadata } from './GroupMetadata'
import type { CacheStore } from './Socket'

// export the WAMessage Prototypes
export { proto as WAProto }
export type WAMessage = proto.IWebMessageInfo & {
	key: WAMessageKey
	messageStubParameters?: any
	category?: string
	retryCount?: number
}
export type WAMessageContent = proto.IMessage
export type WAContactMessage = proto.Message.IContactMessage
export type WAContactsArrayMessage = proto.Message.IContactsArrayMessage
export type WAMessageKey = proto.IMessageKey & {
	remoteJidAlt?: string
	remoteJidUsername?: string
	participantAlt?: string
	participantUsername?: string
	server_id?: string
	addressingMode?: string
	isViewOnce?: boolean // TODO: remove out of the message key, place in WebMessageInfo
}
export type WATextMessage = proto.Message.IExtendedTextMessage
export type WAContextInfo = proto.IContextInfo
export type WALocationMessage = proto.Message.ILocationMessage
export type WAGenericMediaMessage =
	| proto.Message.IVideoMessage
	| proto.Message.IImageMessage
	| proto.Message.IAudioMessage
	| proto.Message.IDocumentMessage
	| proto.Message.IStickerMessage
export const WAMessageStubType = proto.WebMessageInfo.StubType
export const WAMessageStatus = proto.WebMessageInfo.Status
import type { ILogger } from '../Utils/logger'
export type WAMediaPayloadURL = { url: URL | string }
export type WAMediaPayloadStream = { stream: Readable }
export type WAMediaUpload = Buffer | WAMediaPayloadStream | WAMediaPayloadURL
/** Set of message types that are supported by the library */
export type MessageType = keyof proto.Message

export enum WAMessageAddressingMode {
	PN = 'pn',
	LID = 'lid'
}

export type MessageWithContextInfo =
	| 'imageMessage'
	| 'contactMessage'
	| 'locationMessage'
	| 'extendedTextMessage'
	| 'documentMessage'
	| 'audioMessage'
	| 'videoMessage'
	| 'call'
	| 'contactsArrayMessage'
	| 'liveLocationMessage'
	| 'templateMessage'
	| 'stickerMessage'
	| 'groupInviteMessage'
	| 'templateButtonReplyMessage'
	| 'productMessage'
	| 'listMessage'
	| 'orderMessage'
	| 'listResponseMessage'
	| 'buttonsMessage'
	| 'buttonsResponseMessage'
	| 'interactiveMessage'
	| 'interactiveResponseMessage'
	| 'pollCreationMessage'
	| 'requestPhoneNumberMessage'
	| 'messageHistoryBundle'
	| 'eventMessage'
	| 'newsletterAdminInviteMessage'
	| 'albumMessage'
	| 'stickerPackMessage'
	| 'pollResultSnapshotMessage'
	| 'messageHistoryNotice'

export type DownloadableMessage = { mediaKey?: Uint8Array | null; directPath?: string | null; url?: string | null }

export type MessageReceiptType =
	| 'read'
	| 'read-self'
	| 'hist_sync'
	| 'peer_msg'
	| 'sender'
	| 'inactive'
	| 'played'
	| undefined

export type MediaConnInfo = {
	auth: string
	ttl: number
	hosts: { hostname: string; maxContentLengthBytes: number }[]
	fetchDate: Date
}

export interface WAUrlInfo {
	'canonical-url': string
	'matched-text': string
	title: string
	description?: string
	jpegThumbnail?: Buffer
	highQualityThumbnail?: proto.Message.IImageMessage
	originalThumbnailUrl?: string
}

// types to generate WA messages
type Mentionable = {
	/** list of jids that are mentioned in the accompanying text */
	mentions?: string[]
	/** mention all */
	mentionAll?: boolean
}
type Contextable = {
	/** add contextInfo to the message */
	contextInfo?: proto.IContextInfo
}
type ViewOnce = {
	viewOnce?: boolean
	viewOnceV2?: boolean
	viewOnceV2Extension?: boolean
	/** wrap the message in an ephemeralMessage wrapper */
	ephemeral?: boolean
	/** wrap the message in a lottieStickerMessage wrapper */
	isLottie?: boolean
	/** mark the message as a group status update */
	groupStatus?: boolean
	/** wrap an interactiveMessage in a templateMessage */
	interactiveAsTemplate?: boolean
}

type Editable = {
	edit?: WAMessageKey
}
type WithDimensions = {
	width?: number
	height?: number
}

export type PollMessageOptions = {
	name: string
	selectableCount?: number
	values: string[]
	/** 32 byte message secret to encrypt poll selections */
	messageSecret?: Uint8Array
	toAnnouncementGroup?: boolean
	endDate?: Date
	hideVoter?: boolean
	canAddOption?: boolean
	/** 1 = quiz (newsletter only) */
	pollType?: proto.Message.PollType
	correctAnswer?: string
}

export type EventMessageOptions = {
	name: string
	description?: string
	startDate: Date
	endDate?: Date
	location?: WALocationMessage
	call?: 'audio' | 'video'
	isCancelled?: boolean
	isScheduleCall?: boolean
	extraGuestsAllowed?: boolean
	messageSecret?: Uint8Array<ArrayBufferLike>
}

export type AlbumMessageOptions = {
	/** Number of images expected in the album */
	expectedImageCount?: number
	/** Number of videos expected in the album */
	expectedVideoCount?: number
}

/** a single media item of an album */
export type AlbumMediaContent = { image: WAMediaUpload; caption?: string } | { video: WAMediaUpload; caption?: string }

export type NativeFlowButton = {
	text?: string
	buttonText?: string
	/** quick reply id */
	id?: string
	copy?: string
	url?: string
	call?: string
	sections?: proto.Message.ListMessage.ISection[]
	/** advanced: raw native flow button name */
	name?: string
	paramsJson?: string
	useWebview?: boolean
	icon?: string
}

export type NativeFlowContent = {
	nativeFlow: NativeFlowButton[] | { buttons: NativeFlowButton[] }
	offerText?: string
	offerUrl?: string
	offerCode?: string
	offerExpiration?: number
	optionText?: string
	optionTitle?: string
	bizJid?: string
	shopSurface?: proto.Message.InteractiveMessage.ShopMessage.Surface
	id?: string
}

export type ButtonInput = NativeFlowButton & {
	buttonId?: string
	type?: proto.Message.ButtonsMessage.Button.Type
}

export type TemplateButtonInput = NativeFlowButton & {
	index?: number
}

/** media that can be used as the header of an interactive message */
type InteractiveMedia = {
	image?: WAMediaUpload
	video?: WAMediaUpload
	document?: WAMediaUpload
	audio?: WAMediaUpload
	location?: WALocationMessage
	product?: WASendableProduct
	caption?: string
	mimetype?: string
	fileName?: string
	jpegThumbnail?: string
}

export type InteractiveContent = InteractiveMedia & {
	text?: string
	footer?: string
	title?: string
	subtitle?: string
	thumbnail?: Buffer
	audioFooter?: WAMediaUpload
}

export type CarouselCardInput = InteractiveContent & {
	nativeFlow?: NativeFlowButton[] | { buttons: NativeFlowButton[] }
}

export type PollResultOptions = {
	name: string
	votes: { name: string; voteCount: string | number }[]
	pollType?: proto.Message.PollType
}

export type PollUpdateOptions = {
	key: WAMessageKey
	vote: proto.Message.IPollEncValue
	metadata?: proto.Message.IPollUpdateMessageMetadata
}

export type OrderMessageOptions = {
	orderText: string
	thumbnail: Buffer
	itemCount?: number
	status?: proto.Message.OrderMessage.OrderStatus
	surface?: proto.Message.OrderMessage.OrderSurface
	messageVersion?: number
	orderTitle?: string
	token?: string
	totalAmount1000?: number
	totalCurrencyCode?: string
}

export type RequestPaymentOptions = {
	requestPaymentFrom: string
	amount1000?: number
	currencyCodeIso4217?: string
	expiryTimestamp?: number
	background?: proto.IPaymentBackground
} & ({ text: string } | { sticker: WAMediaUpload })

export type InvoiceMessageOptions = {
	invoiceNote: string
} & ({ image: WAMediaUpload } | { document: WAMediaUpload; mimetype: string })

export type FlowReplyOptions = {
	text: string
	name: string
	format?: proto.Message.InteractiveResponseMessage.Body.Format
	paramsJson?: string
	version?: number
}

export type ExternalAdReplyOptions = NonNullable<proto.IContextInfo['externalAdReply']> & {
	thumbnail?: Buffer
	largeThumbnail?: boolean
	subTitle?: string
	url?: string
	mediaType?: number
}

type SharePhoneNumber = {
	sharePhoneNumber: boolean
}

type RequestPhoneNumber = {
	requestPhoneNumber: boolean
}

export type AnyMediaMessageContent = (
	| ({
			image: WAMediaUpload
			caption?: string
			jpegThumbnail?: string
	  } & Mentionable &
			Contextable &
			WithDimensions)
	| ({
			video: WAMediaUpload
			caption?: string
			gifPlayback?: boolean
			jpegThumbnail?: string
			/** if set to true, will send as a `video note` */
			ptv?: boolean
	  } & Mentionable &
			Contextable &
			WithDimensions)
	| {
			audio: WAMediaUpload
			/** if set to true, will send as a `voice note` */
			ptt?: boolean
			/** optionally tell the duration of the audio */
			seconds?: number
	  }
	| ({
			sticker: WAMediaUpload
			isAnimated?: boolean
	  } & WithDimensions)
	| ({
			document: WAMediaUpload
			mimetype: string
			fileName?: string
			caption?: string
	  } & Contextable)
) & { mimetype?: string } & Editable & {
		/** key of the parent albumMessage to associate this media with */
		albumParentKey?: WAMessageKey
	}

export type ButtonReplyInfo = {
	displayText: string
	id: string
	index: number
}

export type GroupInviteInfo = {
	inviteCode: string
	inviteExpiration: number
	text: string
	jid: string
	subject: string
}

export type WASendableProduct = Omit<proto.Message.ProductMessage.IProductSnapshot, 'productImage'> & {
	productImage: WAMediaUpload
}

export type AnyRegularMessageContent = (
	| ({
			text: string
			linkPreview?: WAUrlInfo | null
	  } & Mentionable &
			Contextable &
			Editable)
	| AnyMediaMessageContent
	| { event: EventMessageOptions }
	| ({
			poll: PollMessageOptions
	  } & Mentionable &
			Contextable &
			Editable)
	| ({
			album: AlbumMessageOptions | AlbumMediaContent[]
	  } & Contextable &
			Mentionable)
	| {
			contacts: {
				displayName?: string
				contacts: proto.Message.IContactMessage[]
			}
	  }
	| {
			location: WALocationMessage
	  }
	| { react: proto.Message.IReactionMessage }
	| {
			buttonReply: ButtonReplyInfo
			type: 'template' | 'plain'
	  }
	| {
			groupInvite: GroupInviteInfo
	  }
	| {
			listReply: Omit<proto.Message.IListResponseMessage, 'contextInfo'>
	  }
	| {
			pin: WAMessageKey
			type: proto.PinInChat.Type
			/**
			 * 24 hours, 7 days, 30 days
			 */
			time?: 86400 | 604800 | 2592000
	  }
	| {
			product: WASendableProduct
			businessOwnerJid?: string
			body?: string
			footer?: string
	  }
	| SharePhoneNumber
	| RequestPhoneNumber
	| ({ buttons: ButtonInput[]; footer?: string } & InteractiveContent)
	| ({
			sections: proto.Message.ListMessage.ISection[]
			buttonText: string
			title?: string
			footer?: string
			/** description shown above the list */
			text?: string
	  } & Mentionable &
			Contextable)
	| ({ templateButtons: TemplateButtonInput[]; footer?: string; id?: string } & InteractiveContent)
	| (NativeFlowContent & InteractiveContent)
	| ({ cards: CarouselCardInput[] } & InteractiveContent)
	| ({ externalAdReply: ExternalAdReplyOptions } & Contextable)
	| ({ pollResult: PollResultOptions } & Contextable)
	| ({ pollUpdate: PollUpdateOptions } & Contextable)
	| ({ paymentInviteServiceType: proto.Message.PaymentInviteMessage.ServiceType } & Contextable)
	| (OrderMessageOptions & Contextable)
	| (RequestPaymentOptions & Contextable)
	| (InvoiceMessageOptions & Contextable)
	| ({ keep: WAMessageKey; type?: proto.KeepType } & Contextable)
	| ({ flowReply: FlowReplyOptions } & Contextable)
	| { raw: WAMessageContent }
	| { ai: boolean }
	| { secureMetaServiceLabel: boolean }
) &
	ViewOnce

export type AnyMessageContent =
	| AnyRegularMessageContent
	| {
			forward: WAMessage
			force?: boolean
	  }
	| {
			/** Delete your message or anyone's message in a group (admin required) */
			delete: WAMessageKey
	  }
	| {
			disappearingMessagesInChat: boolean | number
	  }
	| {
			limitSharing: boolean
	  }

export type GroupMetadataParticipants = Pick<GroupMetadata, 'participants'>

type MinimalRelayOptions = {
	/** override the message ID with a custom provided string */
	messageId?: string
	/** should we use group metadata cache, or fetch afresh from the server; default assumed to be "true" */
	useCachedGroupMetadata?: boolean
	/** additional attributes to add to the WA binary node */
	additionalAttributes?: { [_: string]: string }
	additionalNodes?: BinaryNode[]
	/** delay between messages when sending an album or multiple statuses, in ms */
	delayMs?: number
}

export type MessageRelayOptions = MinimalRelayOptions & {
	/** only send to a specific participant; used when a message decryption fails for a single user */
	participant?: { jid: string; count: number }
	/** additional attributes to add to the WA binary node */
	additionalAttributes?: { [_: string]: string }
	additionalNodes?: BinaryNode[]
	/** include the biz node even when the message is not an interactive message */
	addBizAttributes?: boolean
	/** should we use the devices cache, or fetch afresh from the server; default assumed to be "true" */
	useUserDevicesCache?: boolean
	/** jid list of participants for status@broadcast */
	statusJidList?: string[]
}

export type MiscMessageGenerationOptions = MinimalRelayOptions & {
	/** optional, if you want to manually set the timestamp of the message */
	timestamp?: Date
	/** the message you want to quote */
	quoted?: WAMessage
	/** disappearing messages settings */
	ephemeralExpiration?: number | string
	/** timeout for media upload to WA server */
	mediaUploadTimeoutMs?: number
	/** jid list of participants for status@broadcast */
	statusJidList?: string[]
	/** backgroundcolor for status */
	backgroundColor?: string
	/** font type for status */
	font?: number
	/** if it is broadcast */
	broadcast?: boolean
}
export type MessageGenerationOptionsFromContent = MiscMessageGenerationOptions & {
	userJid: string
}

export type WAMediaUploadFunction = (
	encFilePath: string,
	opts: { fileEncSha256B64: string; mediaType: MediaType; timeoutMs?: number; newsletter?: boolean }
) => Promise<{
	mediaUrl: string
	directPath: string
	meta_hmac?: string
	ts?: number
	fbid?: number
	handle?: string
	thumbnailDirectPath?: string
	thumbnailSha256?: string
}>

export type MediaGenerationOptions = {
	logger?: ILogger
	mediaTypeOverride?: MediaType
	upload: WAMediaUploadFunction
	/** cache media so it does not have to be uploaded again */
	mediaCache?: CacheStore

	mediaUploadTimeoutMs?: number

	options?: RequestInit

	backgroundColor?: string

	font?: number
}
export type MessageContentGenerationOptions = MediaGenerationOptions & {
	getUrlInfo?: (text: string) => Promise<WAUrlInfo | undefined>
	getProfilePicUrl?: (jid: string, type: 'image' | 'preview') => Promise<string | undefined>
	getCallLink?: (type: 'audio' | 'video', event?: { startTime: number }) => Promise<string | undefined>
	jid?: string
}
export type MessageGenerationOptions = MessageContentGenerationOptions & MessageGenerationOptionsFromContent

/**
 * Type of message upsert
 * 1. notify => notify the user, this message was just received
 * 2. append => append the message to the chat history, no notification required
 */
export type MessageUpsertType = 'append' | 'notify'

export type MessageUserReceipt = proto.IUserReceipt

export type WAMessageUpdate = { update: Partial<WAMessage>; key: WAMessageKey }

export type WAMessageCursor = { before: WAMessageKey | undefined } | { after: WAMessageKey | undefined }

export type MessageUserReceiptUpdate = { key: WAMessageKey; receipt: MessageUserReceipt }

export type MediaDecryptionKeyInfo = {
	iv: Uint8Array
	cipherKey: Uint8Array
	macKey?: Uint8Array
}

export type MinimalMessage = Pick<WAMessage, 'key' | 'messageTimestamp'>
