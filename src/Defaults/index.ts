import { proto } from '../../WAProto'
import { makeLibSignalRepository } from '../Signal/libsignal'
import type { AuthenticationState, MediaType, SocketConfig, WAVersion } from '../Types'
import { Browsers } from '../Utils'
import logger from '../Utils/logger'
import { version } from './baileys-version.json'
import phoneNumberMCC from './phonenumber-mcc.json'

export const UNAUTHORIZED_CODES = [401, 403, 419]

export const PHONENUMBER_MCC = phoneNumberMCC

export const DEFAULT_ORIGIN = 'https://web.whatsapp.com'
export const MOBILE_ENDPOINT = 'g.whatsapp.net'
export const MOBILE_PORT = 443
export const DEF_CALLBACK_PREFIX = 'CB:'
export const DEF_TAG_PREFIX = 'TAG:'
export const PHONE_CONNECTION_CB = 'CB:Pong'

export const WA_DEFAULT_EPHEMERAL = 7 * 24 * 60 * 60

export const MOBILE_TOKEN = Buffer.from('0a1mLfGUIBVrMKF1RdvLI5lkRBvof6vn0fD2QRSM4174c0243f5277a5d7720ce842cc4ae6')
export const MOBILE_REGISTRATION_ENDPOINT = 'https://v.whatsapp.net/v2'
export const MOBILE_USERAGENT = 'WhatsApp/2.22.24.81 iOS/15.3.1 Device/Apple-iPhone_7'
export const REGISTRATION_PUBLIC_KEY = Buffer.from([
	5, 142, 140, 15, 116, 195, 235, 197, 215, 166, 134, 92, 108, 60, 132, 56, 86, 176, 97, 33, 204, 232, 234, 119, 77,
	34, 251, 111, 18, 37, 18, 48, 45,
])
export const NOISE_MODE = 'Noise_XX_25519_AESGCM_SHA256\0\0\0\0'
export const DICT_VERSION = 2
export const KEY_BUNDLE_TYPE = Buffer.from([5])
export const NOISE_WA_HEADER = Buffer.from(
	[ 87, 65, 6, DICT_VERSION ]
) // last is "DICT_VERSION"
export const PROTOCOL_VERSION = [5, 2]
export const MOBILE_NOISE_HEADER = Buffer.concat([Buffer.from('WA'), Buffer.from(PROTOCOL_VERSION)])
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
	version: version as WAVersion,
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
	auth: undefined as unknown as AuthenticationState,
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
	getMessage: async() => undefined,
	makeSignalRepository: makeLibSignalRepository
}

export const MEDIA_PATH_MAP: { [T in MediaType]?: string } = {
	image: '/mms/image',
	video: '/mms/video',
	document: '/mms/document',
	audio: '/mms/audio',
	sticker: '/mms/image',
	'thumbnail-link': '/mms/image',
	'product-catalog-image': '/product/image',
	'md-app-state': '',
	'md-msg-hist': '/mms/md-app-state',
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

export const DEFAULT_CACHE_TTLS = {
	SIGNAL_STORE: 5 * 60, // 5 minutes
	MSG_RETRY: 60 * 60, // 1 hour
	CALL_OFFER: 5 * 60, // 5 minutes
	USER_DEVICES: 5 * 60, // 5 minutes
}