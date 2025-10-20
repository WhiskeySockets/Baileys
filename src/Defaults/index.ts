import { proto } from '../../WAProto/index.js'
import { makeLibSignalRepository } from '../Signal/libsignal'
import type { AuthenticationState, SocketConfig, WAVersion } from '../Types'
import { Browsers } from '../Utils/browser-utils'
import logger from '../Utils/logger'

const version = [2, 3000, 1027934701]

// HTTP/connection error codes for unauthorized requests
export const UNAUTHORIZED_CODES = [401, 403, 419]

// Default endpoints and URL prefixes
export const DEFAULT_ORIGIN = 'https://web.whatsapp.com'
export const CALL_VIDEO_PREFIX = 'https://call.whatsapp.com/video/'
export const CALL_AUDIO_PREFIX = 'https://call.whatsapp.com/voice/'
export const DEF_CALLBACK_PREFIX = 'CB:'
export const DEF_TAG_PREFIX = 'TAG:'
export const PHONE_CONNECTION_CB = 'CB:Pong'

// Advanced signal prefixes for WhatsApp
export const WA_ADV_ACCOUNT_SIG_PREFIX = Buffer.from([6, 0])
export const WA_ADV_DEVICE_SIG_PREFIX = Buffer.from([6, 1])
export const WA_ADV_HOSTED_ACCOUNT_SIG_PREFIX = Buffer.from([6, 5])
export const WA_ADV_HOSTED_DEVICE_SIG_PREFIX = Buffer.from([6, 6])

// Default ephemeral message duration (7 days in seconds)
export const WA_DEFAULT_EPHEMERAL = 7 * 24 * 60 * 60

// Noise protocol settings
export const NOISE_MODE = 'Noise_XX_25519_AESGCM_SHA256\0\0\0\0'
export const DICT_VERSION = 3
export const KEY_BUNDLE_TYPE = Buffer.from([5])
export const NOISE_WA_HEADER = Buffer.from([87, 65, 6, DICT_VERSION]) // last byte is DICT_VERSION

/** Regex to match URLs (avoids credentials in URL) */
export const URL_REGEX = /https:\/\/(?![^:@\/\s]+:[^:@\/\s]+@)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?/g

// TODO: Add WA root certificate
export const WA_CERT_DETAILS = {
SERIAL: 0
}

// History types that can be processed by the client
export const PROCESSABLE_HISTORY_TYPES = [
proto.Message.HistorySyncNotification.HistorySyncType.INITIAL_BOOTSTRAP,
proto.Message.HistorySyncNotification.HistorySyncType.PUSH_NAME,
proto.Message.HistorySyncNotification.HistorySyncType.RECENT,
proto.Message.HistorySyncNotification.HistorySyncType.FULL,
proto.Message.HistorySyncNotification.HistorySyncType.ON_DEMAND,
proto.Message.HistorySyncNotification.HistorySyncType.NON_BLOCKING_DATA,
proto.Message.HistorySyncNotification.HistorySyncType.INITIAL_STATUS_V3
]

// List of browsers and OS combinations for random selection
const alternateBrowsers = [
Browsers.macOS('Chrome'),
Browsers.macOS('Firefox'),
Browsers.macOS('Opera'),
Browsers.macOS('Safari'),
Browsers.ubuntu('Chrome'),
Browsers.ubuntu('Firefox'),
Browsers.windows('Chrome'),
Browsers.windows('Edge'),
Browsers.windows('Firefox')
]

// Function to select a random browser/OS for the connection
const getRandomBrowser = () => alternateBrowsers[Math.floor(Math.random() * alternateBrowsers.length)]

// Main default connection configuration
export const DEFAULT_CONNECTION_CONFIG: SocketConfig = {
version: version as WAVersion,
browser: getRandomBrowser(), // randomly selected browser/OS combination
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

// Media paths mapping for different types
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

// HKDF key mapping for media encryption/decryption
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

// Type for media keys
export type MediaType = keyof typeof MEDIA_HKDF_KEY_MAPPING

// Array of all media types
export const MEDIA_KEYS = Object.keys(MEDIA_PATH_MAP) as MediaType[]

// Signal prekey constants
export const MIN_PREKEY_COUNT = 5
export const INITIAL_PREKEY_COUNT = 812

// Upload settings
export const UPLOAD_TIMEOUT = 30_000 // 30 seconds
export const MIN_UPLOAD_INTERVAL = 5_000 // 5 seconds minimum between uploads

// Cache TTLs for different features
export const DEFAULT_CACHE_TTLS = {
SIGNAL_STORE: 5 * 60, // 5 minutes
MSG_RETRY: 60 * 60, // 1 hour
CALL_OFFER: 5 * 60, // 5 minutes
USER_DEVICES: 5 * 60 // 5 minutes
}
