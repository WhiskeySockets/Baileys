import { proto } from '../../WAProto/index.js'
import { makeLibSignalRepository } from '../Signal/libsignal'
import type { AuthenticationState, SocketConfig, WAVersion } from '../Types'
import { Browsers } from '../Utils/browser-utils'
import logger from '../Utils/logger'
// Single source of truth for WhatsApp Web version - imported from JSON
import baileysVersionData from './baileys-version.json' with { type: 'json' }

const version = baileysVersionData.version

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

/** Status messages older than 24 hours are considered expired */
export const STATUS_EXPIRY_SECONDS = 24 * 60 * 60

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

// 6 hours in milliseconds
const SIX_HOURS_MS = 6 * 60 * 60 * 1000

export const DEFAULT_CONNECTION_CONFIG: SocketConfig = {
	version: version as WAVersion,
	versionCheckIntervalMs: SIX_HOURS_MS,
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
	// Set to false if you don't need full message history (reduces bandwidth/storage)
	syncFullHistory: true,
	patchMessageBeforeSending: msg => msg,
	shouldSyncHistoryMessage: () => true,
	shouldIgnoreJid: () => false,
	linkPreviewImageThumbnailWidth: 192,
	transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
	generateHighQualityLinkPreview: false,
	enableAutoSessionRecreation: true,
	enableRecentMessageCache: true,
	// Enable automatic recovery of Click-to-WhatsApp ads messages
	// These arrive as "placeholder messages" and need to be requested from the phone
	enableCTWARecovery: true,
	// ⚠️ EXPERIMENTAL: Enable interactive messages (buttons, lists, templates, carousel)
	// WARNING: These features may not work and can cause account BANS
	// Use ONLY for testing with DISPOSABLE accounts in DEV environment
	// Default: true (for dev/testing) - set to false in production
	enableInteractiveMessages: true,
	options: {},
	appStateMacVerification: {
		patch: false,
		snapshot: false
	},
	countryCode: 'US',
	getMessage: async () => undefined,
	cachedGroupMetadata: async () => undefined,
	makeSignalRepository: makeLibSignalRepository,
	// Circuit breaker configuration
	enableCircuitBreaker: true,
	// Listener limits (memory leak prevention)
	// WebSocket: 8 core events (open, close, error, message, ping, pong, upgrade, unexpected-response)
	//          + 10 dynamic listeners (reconnect handlers, custom events)
	//          + 2 buffer slots for temporary listeners = 20 total
	maxWebSocketListeners: 20,
	// SocketClient: 20 core events (connection, messaging, presence, groups, calls, etc.)
	//             + 20 dynamic listeners (user handlers, plugins)
	//             + 10 buffer slots for high-load scenarios = 50 total
	maxSocketClientListeners: 50,
	// Unified session telemetry (reduces detection of unofficial clients)
	// NOTE: undefined means "check env var first, then default to true"
	// This allows BAILEYS_UNIFIED_SESSION_ENABLED env var to have precedence
	enableUnifiedSession: undefined
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
	'biz-cover-photo': '/pps/biz-cover-photo',
	'sticker-pack': '/mms/sticker-pack',
	'thumbnail-sticker-pack': '/mms/thumbnail-sticker-pack'
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
	'biz-cover-photo': 'Image',
	'sticker-pack': 'Sticker Pack',
	'thumbnail-sticker-pack': 'Sticker Pack Thumbnail'
}

export type MediaType = keyof typeof MEDIA_HKDF_KEY_MAPPING

export const MEDIA_KEYS = Object.keys(MEDIA_PATH_MAP) as MediaType[]

export const MIN_PREKEY_COUNT = 5

// Moderate prekey count (upstream uses 812, reduced to balance rate limiting and availability)
export const INITIAL_PREKEY_COUNT = 200

export const UPLOAD_TIMEOUT = 30000 // 30 seconds
// Moderate upload interval to balance rate limiting and responsiveness (was 5000)
export const MIN_UPLOAD_INTERVAL = 10_000 // 10 seconds minimum between uploads

/**
 * Cache TTL configuration (in seconds)
 */
export const DEFAULT_CACHE_TTLS = {
	SIGNAL_STORE: 5 * 60, // 5 minutes
	MSG_RETRY: 60 * 60, // 1 hour
	CALL_OFFER: 5 * 60, // 5 minutes
	USER_DEVICES: 5 * 60 // 5 minutes
}

/**
 * Maximum cache keys per store type - prevents memory leaks
 * Based on RSocket's battle-tested configuration
 *
 * Usage: Use these limits when initializing LRU caches to prevent unbounded growth
 * Example:
 *   import { DEFAULT_CACHE_MAX_KEYS } from './Defaults'
 *   const cache = new LRUCache({ max: DEFAULT_CACHE_MAX_KEYS.SIGNAL_STORE })
 */
export const DEFAULT_CACHE_MAX_KEYS = {
	SIGNAL_STORE: 10_000,
	MSG_RETRY: 10_000,
	CALL_OFFER: 500,
	USER_DEVICES: 5_000,
	PLACEHOLDER_RESEND: 5_000,
	LID_PER_SOCKET: 2_000,
	LID_GLOBAL: 10_000
}

// Re-export retry constants for backwards compatibility
// Actual definitions are in retry-utils.ts to avoid ESM initialization order issues
export { RETRY_BACKOFF_DELAYS, RETRY_JITTER_FACTOR } from '../Utils/retry-utils'

// ============================================
// Time Constants
// ============================================

/**
 * Time constants in milliseconds for various timing calculations.
 * Used by unified session, rate limiting, and other time-based features.
 *
 * @example
 * ```typescript
 * import { TimeMs } from './Defaults'
 *
 * // Calculate 3 days in milliseconds
 * const threeDays = 3 * TimeMs.Day
 *
 * // Check if 1 week has passed
 * if (Date.now() - lastUpdate > TimeMs.Week) {
 *   // do something
 * }
 * ```
 */
export const TimeMs = {
	/** One second in milliseconds (1,000) */
	Second: 1_000,
	/** One minute in milliseconds (60,000) */
	Minute: 60_000,
	/** One hour in milliseconds (3,600,000) */
	Hour: 3_600_000,
	/** One day in milliseconds (86,400,000) */
	Day: 86_400_000,
	/** One week in milliseconds (604,800,000) */
	Week: 604_800_000,
} as const

export type TimeMsKey = keyof typeof TimeMs
