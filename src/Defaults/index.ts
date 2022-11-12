import { proto } from '../../WAProto'
import type { MediaType, SocketConfig } from '../Types'
import { Browsers } from '../Utils'
import logger from '../Utils/logger'
import { version } from './baileys-version.json'

export const UNAUTHORIZED_CODES = [401, 403, 419]

export const DEFAULT_ORIGIN = 'https://web.whatsapp.com'
export const DEF_CALLBACK_PREFIX = 'CB:'
export const DEF_TAG_PREFIX = 'TAG:'
export const PHONE_CONNECTION_CB = 'CB:Pong'

export const WA_DEFAULT_EPHEMERAL = 7 * 24 * 60 * 60

export const NOISE_MODE = 'Noise_XX_25519_AESGCM_SHA256\0\0\0\0'
export const DICT_VERSION = 2
export const KEY_BUNDLE_TYPE = Buffer.from([5])
export const NOISE_WA_HEADER = Buffer.from(
	[ 87, 65, 6, DICT_VERSION ]
) // last is "DICT_VERSION"
/** from: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url */
export const URL_REGEX = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
export const URL_EXCLUDE_REGEX = /.*@.*/

export const WA_CERT_DETAILS = {
	SERIAL: 0,
}

export const PROCESSABLE_HISTORY_TYPES = [
	proto.Message.HistorySyncNotification.HistorySyncType.INITIAL_BOOTSTRAP,
	proto.Message.HistorySyncNotification.HistorySyncType.PUSH_NAME,
	proto.Message.HistorySyncNotification.HistorySyncType.RECENT,
	proto.Message.HistorySyncNotification.HistorySyncType.FULL
]

export const DEFAULT_CONNECTION_CONFIG: SocketConfig = {
	version: version as any,
	browser: Browsers.baileys('Chrome'),
	waWebSocketUrl: 'wss://web.whatsapp.com/ws/chat',
	connectTimeoutMs: 20_000,
	keepAliveIntervalMs: 15_000,
	logger: logger.child({ class: 'baileys' }),
	printQRInTerminal: false,
	emitOwnEvents: true,
	defaultQueryTimeoutMs: 60_000,
	customUploadHosts: [],
	retryRequestDelayMs: 250,
	fireInitQueries: true,
	auth: undefined as any,
	markOnlineOnConnect: true,
	syncFullHistory: false,
	patchMessageBeforeSending: msg => msg,
	shouldSyncHistoryMessage: () => true,
	shouldIgnoreJid: () => false,
	linkPreviewImageThumbnailWidth: 192,
	transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
	generateHighQualityLinkPreview: false,
	options: { },
	appStateMacVerification: {
		patch: false,
		snapshot: false,
	},
	getMessage: async() => undefined
}

export const MEDIA_PATH_MAP: { [T in MediaType]?: string } = {
	image: '/mms/image',
	video: '/mms/video',
	document: '/mms/document',
	audio: '/mms/audio',
	sticker: '/mms/image',
	'thumbnail-link': '/mms/image',
	'product-catalog-image': '/product/image',
	'md-app-state': ''
}

export const MEDIA_HKDF_KEY_MAPPING = {
	'audio': 'Audio',
	'document': 'Document',
	'gif': 'Video',
	'image': 'Image',
	'ppic': '',
	'product': 'Image',
	'ptt': 'Audio',
	'sticker': 'Image',
	'video': 'Video',
	'thumbnail-document': 'Document Thumbnail',
	'thumbnail-image': 'Image Thumbnail',
	'thumbnail-video': 'Video Thumbnail',
	'thumbnail-link': 'Link Thumbnail',
	'md-msg-hist': 'History',
	'md-app-state': 'App State',
	'product-catalog-image': '',
	'payment-bg-image': 'Payment Background',
}

export const MEDIA_KEYS = Object.keys(MEDIA_PATH_MAP) as MediaType[]

export const MIN_PREKEY_COUNT = 5

export const INITIAL_PREKEY_COUNT = 30