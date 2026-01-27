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
	participantAlt?: string
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
}
type Contextable = {
	/** add contextInfo to the message */
	contextInfo?: proto.IContextInfo
}
type ViewOnce = {
	viewOnce?: boolean
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
) & { mimetype?: string } & Editable & Partial<Buttonable> & Partial<Templatable>

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

// ⚠️ EXPERIMENTAL: Interactive message types
// These features may not work and can cause account bans
// Use only for testing with disposable accounts

export type ButtonInfo = {
	buttonId: string
	buttonText: { displayText: string }
	type?: proto.Message.ButtonsMessage.Button.Type
}

export type Buttonable = {
	buttons: ButtonInfo[]
	headerType?: proto.Message.ButtonsMessage.HeaderType
	footerText?: string
}

export type TemplateButton =
	| { index: number; quickReplyButton: { displayText: string; id: string } }
	| { index: number; urlButton: { displayText: string; url: string } }
	| { index: number; callButton: { displayText: string; phoneNumber: string } }

export type Templatable = {
	templateButtons: TemplateButton[]
	footer?: string
}

export type ListSection = {
	title: string
	rows: Array<{
		rowId: string
		title: string
		description?: string
	}>
}

export type Listable = {
	sections: ListSection[]
	title?: string
	buttonText?: string
}

// ========== Native Flow Button Types ==========

/**
 * Button types supported by WhatsApp Native Flow
 * - cta_url: Opens a URL
 * - cta_copy: Copies text to clipboard
 * - cta_call: Initiates a phone call
 * - quick_reply: Sends a quick reply with ID
 * - single_select: Opens a list selection
 */
export type NativeFlowButtonType = 'cta_url' | 'cta_copy' | 'cta_call' | 'quick_reply' | 'single_select'

/**
 * URL button - opens a link when clicked
 */
export type UrlButton = {
	type: 'url'
	text: string
	url: string
	/** Optional merchant URL for tracking */
	merchantUrl?: string
}

/**
 * Copy button - copies text to clipboard when clicked
 */
export type CopyButton = {
	type: 'copy'
	text: string
	copyText: string
}

/**
 * Quick reply button - sends a reply with an ID
 */
export type QuickReplyButton = {
	type: 'reply'
	text: string
	id: string
}

/**
 * Call button - initiates a phone call when clicked
 */
export type CallButton = {
	type: 'call'
	text: string
	phoneNumber: string
}

/**
 * Union type for all button types
 */
export type NativeButton = UrlButton | CopyButton | QuickReplyButton | CallButton

/**
 * Formatted button for Native Flow (internal use)
 */
export type NativeFlowButton = {
	name: string
	buttonParamsJson: string
}

/**
 * Row item in a list section
 */
export type ListRow = {
	/** Unique ID returned when selected */
	id: string
	/** Display title */
	title: string
	/** Optional description */
	description?: string
}

/**
 * Section in a native list message (uses ListRow with id)
 */
export type NativeListSection = {
	/** Section title */
	title: string
	/** Rows in this section */
	rows: ListRow[]
}

/**
 * Options for generating a list message
 */
export type ListMessageOptions = {
	/** Button text to open the list */
	buttonText: string
	/** Sections with selectable items */
	sections: NativeListSection[]
	/** Main text/body of the message */
	text: string
	/** Title shown in header */
	title?: string
	/** Footer text */
	footer?: string
}

/**
 * Options for generating a button message
 */
export type ButtonMessageOptions = {
	/** Array of buttons (2-3 recommended) */
	buttons: NativeButton[]
	/** Main text/body of the message */
	text: string
	/** Footer text (optional) */
	footer?: string
	/** Header title (optional, used if no media) */
	headerTitle?: string
	/** Header image (optional) */
	headerImage?: WAMediaUpload
	/** Header video (optional) */
	headerVideo?: WAMediaUpload
	/** Message version (default: 2) */
	messageVersion?: number
}

/**
 * Single card in a carousel message
 */
export type CarouselCardInput = {
	/** Card title in header */
	title: string
	/** Card body text */
	body: string
	/** Card footer text (optional) */
	footer?: string
	/** Card image (optional) */
	image?: WAMediaUpload
	/** Card video (optional) */
	video?: WAMediaUpload
	/** Buttons for this card */
	buttons: NativeButton[]
}

/**
 * Options for generating a carousel message
 */
export type CarouselMessageOptions = {
	/** Cards in the carousel (2-10 recommended) */
	cards: CarouselCardInput[]
	/** Main body text */
	text?: string
	/** Footer text */
	footer?: string
}

export type CarouselCard = {
	header: {
		title: string
		imageMessage?: {
			url: string
			mimetype: string
		}
		videoMessage?: {
			url: string
			mimetype: string
		}
		hasMediaAttachment: boolean
	}
	body: { text: string }
	footer?: { text: string }
	nativeFlowMessage?: {
		buttons: Array<{
			name: string
			buttonParamsJson: string
		}>
	}
}

export type Carouselable = {
	carousel: {
		cards: CarouselCard[]
		messageVersion?: number
	}
}

// ========== Product List Message Types ==========

/**
 * Product reference in a product list
 * Uses the product ID from the WhatsApp Business catalog
 */
export type ProductItem = {
	/** Product ID from the catalog */
	productId: string
}

/**
 * Section containing products in a product list message
 */
export type ProductSection = {
	/** Section title */
	title: string
	/** Products in this section */
	products: ProductItem[]
}

/**
 * Header image configuration for product list
 * Can reference a product's image from the catalog
 */
export type ProductListHeaderImage = {
	/** Product ID whose image to use as header */
	productId: string
	/** Optional JPEG thumbnail */
	jpegThumbnail?: Buffer
}

/**
 * Options for generating a product list message (multi-product)
 * Allows sending multiple products from the catalog in a single message
 *
 * @example
 * ```typescript
 * const msg = generateProductListMessage({
 *   title: 'Our Best Sellers',
 *   description: 'Check out our most popular products!',
 *   buttonText: 'View Products',
 *   footerText: 'Tap to browse',
 *   businessOwnerJid: '5511999999999@s.whatsapp.net',
 *   productSections: [
 *     {
 *       title: 'Electronics',
 *       products: [
 *         { productId: 'prod_001' },
 *         { productId: 'prod_002' }
 *       ]
 *     },
 *     {
 *       title: 'Accessories',
 *       products: [
 *         { productId: 'prod_003' }
 *       ]
 *     }
 *   ],
 *   headerImage: { productId: 'prod_001' }
 * })
 * await sock.sendMessage(jid, msg)
 * ```
 */
export type ProductListMessageOptions = {
	/** Message title */
	title: string
	/** Message description/body text */
	description: string
	/** Button text to open the product list */
	buttonText: string
	/** Footer text (optional) */
	footerText?: string
	/** Business owner JID (the catalog owner) */
	businessOwnerJid: string
	/** Sections with products */
	productSections: ProductSection[]
	/** Header image configuration (optional) */
	headerImage?: ProductListHeaderImage
}

// ========== Album Message Types ==========

/**
 * Single media item in an album (image or video)
 * Each item can have its own caption, thumbnail, and metadata
 */
export type AlbumMediaItem =
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
			/** Duration in seconds */
			seconds?: number
	  } & Mentionable &
			Contextable &
			WithDimensions)

/**
 * Configuration for album message sending
 */
export type AlbumMessageOptions = {
	/** Array of media items (images/videos) - min 2, max 10 */
	medias: AlbumMediaItem[]
	/**
	 * Delay strategy between media sends
	 * - 'adaptive': Calculates delay based on media type (videos get 2x delay),
	 *   position in album, and random jitter (recommended)
	 * - number: Fixed delay in milliseconds
	 * @default 'adaptive'
	 */
	delay?: 'adaptive' | number
	/**
	 * Number of retry attempts for failed media items
	 * @default 3
	 */
	retryCount?: number
	/**
	 * Whether to continue sending remaining items if one fails
	 * @default true
	 */
	continueOnFailure?: boolean
}

/**
 * Result of a single media item send attempt
 */
export type AlbumMediaResult = {
	/** Index in the original medias array */
	index: number
	/** Whether this item was sent successfully */
	success: boolean
	/** The sent message (if successful) */
	message?: WAMessage
	/** Error details (if failed) */
	error?: Error
	/** Total number of attempts made (1 = success on first try, >1 = retries occurred) */
	retryAttempts: number
	/** Time taken to send this item in ms */
	latencyMs: number
}

/**
 * Complete result of album message sending
 */
export type AlbumSendResult = {
	/** Key of the album root message */
	albumKey: WAMessageKey
	/** Results for each media item */
	results: AlbumMediaResult[]
	/** Total number of items in the album */
	totalItems: number
	/** Number of items that were actually attempted (may be < totalItems if stoppedEarly) */
	attemptedItems: number
	/** Number of successfully sent items */
	successCount: number
	/** Number of failed items */
	failedCount: number
	/** Indices of failed items (for potential retry) */
	failedIndices: number[]
	/** Overall success (all items sent) */
	success: boolean
	/** Whether the send was interrupted early due to continueOnFailure=false */
	stoppedEarly: boolean
	/** Total time taken in ms */
	totalLatencyMs: number
}

// ========== Product Carousel Message Types ==========

/**
 * Single product card in a product carousel
 * References a product from WhatsApp Business catalog
 */
export type ProductCarouselCard = {
	/** Product retailer ID from the catalog */
	productId: string
}

/**
 * Options for generating a product carousel message
 * Uses products from WhatsApp Business catalog
 *
 * @example
 * ```typescript
 * await sock.sendMessage(jid, {
 *   productCarousel: {
 *     businessOwnerJid: '5511999999999@s.whatsapp.net',
 *     products: [
 *       { productId: 'iphone_15' },
 *       { productId: 'macbook_air' },
 *       { productId: 'apple_watch' }
 *     ]
 *   },
 *   body: 'Check out our featured products!'
 * })
 * ```
 */
export type ProductCarouselMessageOptions = {
	/** JID of the business owner (who owns the catalog) */
	businessOwnerJid: string
	/** Products to display (2-10 cards required) */
	products: ProductCarouselCard[]
	/** Body text for the message */
	body?: string
}

export type AnyRegularMessageContent = (
	| ({
			text: string
			linkPreview?: WAUrlInfo | null
	  } & Mentionable &
			Contextable &
			Editable &
			Partial<Buttonable> &
			Partial<Templatable> &
			Partial<Listable> &
			Partial<Carouselable>)
	| AnyMediaMessageContent
	| { event: EventMessageOptions }
	| ({
			poll: PollMessageOptions
	  } & Mentionable &
			Contextable &
			Editable)
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
	| {
			/**
			 * Native Flow Buttons - Modern button message format
			 * Works reliably on iOS and Android with viewOnceMessage wrapper
			 *
			 * @example
			 * ```typescript
			 * await sock.sendMessage(jid, {
			 *   text: 'Choose an option:',
			 *   nativeButtons: [
			 *     { type: 'url', text: 'Visit Site', url: 'https://example.com' },
			 *     { type: 'copy', text: 'Copy Code', copyText: 'ABC123' },
			 *     { type: 'reply', text: 'Contact Us', id: 'btn_contact' }
			 *   ],
			 *   footer: 'Powered by InfiniteAPI'
			 * })
			 * ```
			 */
			nativeButtons: NativeButton[]
			text?: string
			footer?: string
			headerTitle?: string
			headerImage?: WAMediaUpload
			headerVideo?: WAMediaUpload
	  }
	| {
			/**
			 * Native Carousel Message - Multiple swipeable cards with buttons
			 *
			 * @example
			 * ```typescript
			 * await sock.sendMessage(jid, {
			 *   text: 'Our Products',
			 *   nativeCarousel: {
			 *     cards: [
			 *       { title: 'Item 1', body: 'Description', buttons: [...] },
			 *       { title: 'Item 2', body: 'Description', buttons: [...] }
			 *     ]
			 *   },
			 *   footer: 'Swipe for more'
			 * })
			 * ```
			 */
			nativeCarousel: {
				cards: CarouselCardInput[]
			}
			text?: string
			footer?: string
	  }
	| {
			/**
			 * Product Carousel Message - Swipeable product cards from WhatsApp Business catalog
			 * Requires: WhatsApp Business account with configured catalog
			 *
			 * @example
			 * ```typescript
			 * await sock.sendMessage(jid, {
			 *   productCarousel: {
			 *     businessOwnerJid: '5511999999999@s.whatsapp.net',
			 *     products: [
			 *       { productId: 'produto_001' },
			 *       { productId: 'produto_002' },
			 *       { productId: 'produto_003' }
			 *     ]
			 *   },
			 *   body: 'Confira nossos produtos em destaque!'
			 * })
			 * ```
			 */
			productCarousel: ProductCarouselMessageOptions
			body?: string
	  }
	| {
			/**
			 * Native List Message - Interactive list with sections
			 *
			 * @example
			 * ```typescript
			 * await sock.sendMessage(jid, {
			 *   text: 'Choose an option:',
			 *   title: 'Menu',
			 *   nativeList: {
			 *     buttonText: 'View Options',
			 *     sections: [
			 *       {
			 *         title: 'Category 1',
			 *         rows: [
			 *           { id: 'opt1', title: 'Option 1', description: 'Desc' },
			 *           { id: 'opt2', title: 'Option 2' }
			 *         ]
			 *       }
			 *     ]
			 *   },
			 *   footer: 'Select one'
			 * })
			 * ```
			 */
			nativeList: {
				buttonText: string
				sections: NativeListSection[]
			}
			text?: string
			title?: string
			footer?: string
	  }
	| {
			/**
			 * Album message - send multiple images/videos grouped together
			 * ⚠️ WARNING: Do NOT use with sendMessage() - use sendAlbumMessage() instead!
			 * sendMessage only relays the root message and won't send individual media items
			 * @internal Used internally by generateWAMessage
			 */
			album: AlbumMessageOptions
	  }
	| SharePhoneNumber
	| RequestPhoneNumber
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
}

export type MessageRelayOptions = MinimalRelayOptions & {
	/** only send to a specific participant; used when a message decryption fails for a single user */
	participant?: { jid: string; count: number }
	/** additional attributes to add to the WA binary node */
	additionalAttributes?: { [_: string]: string }
	additionalNodes?: BinaryNode[]
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
	opts: { fileEncSha256B64: string; mediaType: MediaType; timeoutMs?: number }
) => Promise<{ mediaUrl: string; directPath: string; meta_hmac?: string; ts?: number; fbid?: number }>

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
	iv: Buffer
	cipherKey: Buffer
	macKey?: Buffer
}

export type MinimalMessage = Pick<WAMessage, 'key' | 'messageTimestamp'>
