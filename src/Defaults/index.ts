import { proto } from '../../WAProto/index.js'
import { makeLibSignalRepository } from '../Signal/libsignal'
import type { AuthenticationState, SocketConfig, WAVersion } from '../Types'
import { Browsers } from '../Utils/browser-utils'
import logger from '../Utils/logger'

const version = [2, 3000, 1032141294]

export const UNAUTHORIZED_CODES = [401, 403, 419]

export const DEFAULT_ORIGIN = 'https://web.whatsapp.com'
export const CALL_VIDEO_PREFIX = 'https://call.whatsapp.com/video/'
export const CALL_AUDIO_PREFIX = 'https://call.whatsapp.com/voice/'
export const DEF_CALLBACK_PREFIX = 'CB:'
export const DEF_TAG_PREFIX = 'TAG:'
export const PHONE_CONNECTION_CB = 'CB:Pong'

export const WA_ADV_ACCOUNT_SIG_PREFIX = Buffer.from([6, 0])
export const WA_ADV_DEVICE_SIG_PREFIX = Buffer.from([6, 1])
export const WA_ADV_HOSTED_ACCOUNT_SIG_PREFIX = Buffer.from([6, 5])
export const WA_ADV_HOSTED_DEVICE_SIG_PREFIX = Buffer.from([6, 6])

export const WA_DEFAULT_EPHEMERAL = 7 * 24 * 60 * 60

export const NOISE_MODE = 'Noise_XX_25519_AESGCM_SHA256\0\0\0\0'
export const DICT_VERSION = 3
export const KEY_BUNDLE_TYPE = Buffer.from([5])
export const NOISE_WA_HEADER = Buffer.from([87, 65, 6, DICT_VERSION]) // last is "DICT_VERSION"
/** from: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url */
export const URL_REGEX = /https:\/\/(?![^:@\/\s]+:[^:@\/\s]+@)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?/g

export const WA_CERT_DETAILS = {
	SERIAL: 0,
	ISSUER: 'WhatsAppLongTerm1',
	PUBLIC_KEY: Buffer.from('142375574d0a587166aae71ebe516437c4a28b73e3695c6ce1f7f9545da8ee6b', 'hex')
}

export const PROCESSABLE_HISTORY_TYPES = [
	proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
	proto.HistorySync.HistorySyncType.PUSH_NAME,
	proto.HistorySync.HistorySyncType.RECENT,
	proto.HistorySync.HistorySyncType.FULL,
	proto.HistorySync.HistorySyncType.ON_DEMAND,
	proto.HistorySync.HistorySyncType.NON_BLOCKING_DATA,
	proto.HistorySync.HistorySyncType.INITIAL_STATUS_V3
]

export const DEFAULT_CONNECTION_CONFIG: SocketConfig = {
	version: version as WAVersion,
	browser: Browsers.macOS('Chrome'),
	waWebSocketUrl: 'wss://web.whatsapp.com/ws/chat',
	connectTimeoutMs: 20_000,
	keepAliveIntervalMs: 30_000,
	logger: logger.child({ class: 'baileys' }),
	emitOwnEvents: true,
	defaultQueryTimeoutMs: 60_000,
	customUploadHosts: [],
	retryRequestDelayMs: 250,
	maxMsgRetryCount: 5,
	fireInitQueries: true,
	auth: undefined as unknown as AuthenticationState,
	markOnlineOnConnect: true,
	syncFullHistory: true,
	patchMessageBeforeSending: msg => msg,
	shouldSyncHistoryMessage: () => true,
	shouldIgnoreJid: () => false,
	linkPreviewImageThumbnailWidth: 192,
	transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
	generateHighQualityLinkPreview: false,
	enableAutoSessionRecreation: true,
	enableRecentMessageCache: true,
	options: {},
	appStateMacVerification: {
		patch: false,
		snapshot: false
	},
	countryCode: 'US',
	getMessage: async () => undefined,
	cachedGroupMetadata: async () => undefined,
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
	'biz-cover-photo': '/pps/biz-cover-photo'
}

export const MEDIA_HKDF_KEY_MAPPING = {
	audio: 'Audio',
	document: 'Document',
	gif: 'Video',
	image: 'Image',
	ppic: '',
	product: 'Image',
	ptt: 'Audio',
	sticker: 'Image',
	video: 'Video',
	'thumbnail-document': 'Document Thumbnail',
	'thumbnail-image': 'Image Thumbnail',
	'thumbnail-video': 'Video Thumbnail',
	'thumbnail-link': 'Link Thumbnail',
	'md-msg-hist': 'History',
	'md-app-state': 'App State',
	'product-catalog-image': '',
	'payment-bg-image': 'Payment Background',
	ptv: 'Video',
	'biz-cover-photo': 'Image'
}

export type MediaType = keyof typeof MEDIA_HKDF_KEY_MAPPING

export const MEDIA_KEYS = Object.keys(MEDIA_PATH_MAP) as MediaType[]

export const MIN_PREKEY_COUNT = 5

export const INITIAL_PREKEY_COUNT = 812

export const UPLOAD_TIMEOUT = 30000 // 30 seconds
export const MIN_UPLOAD_INTERVAL = 5000 // 5 seconds minimum between uploads

export const DEFAULT_CACHE_TTLS = {
	SIGNAL_STORE: 5 * 60, // 5 minutes
	MSG_RETRY: 60 * 60, // 1 hour
	CALL_OFFER: 5 * 60, // 5 minutes
	USER_DEVICES: 5 * 60 // 5 minutes
}
