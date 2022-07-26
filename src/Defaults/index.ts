import type { CommonSocketConfig, LegacySocketConfig, MediaType, SocketConfig } from '../Types'
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
export const URL_REGEX = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi

export const WA_CERT_DETAILS = {
	SERIAL: 0,
}

const BASE_CONNECTION_CONFIG: CommonSocketConfig = {
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
	retryRequestDelayMs: 250
}

export const DEFAULT_CONNECTION_CONFIG: SocketConfig = {
	...BASE_CONNECTION_CONFIG,
	auth: undefined as any,
	downloadHistory: true,
	markOnlineOnConnect: true,
	syncFullHistory: false,
	linkPreviewImageThumbnailWidth: 192,
	transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
	getMessage: async() => undefined
}

export const DEFAULT_LEGACY_CONNECTION_CONFIG: LegacySocketConfig = {
	...BASE_CONNECTION_CONFIG,
	waWebSocketUrl: 'wss://web.whatsapp.com/ws',
	phoneResponseTimeMs: 20_000,
	expectResponseTimeout: 60_000,
}

export const MEDIA_PATH_MAP: { [T in MediaType]: string } = {
	image: '/mms/image',
	video: '/mms/video',
	document: '/mms/document',
	audio: '/mms/audio',
	sticker: '/mms/image',
	history: '',
	'md-app-state': ''
}

export const MEDIA_KEYS = Object.keys(MEDIA_PATH_MAP) as MediaType[]

export const MIN_PREKEY_COUNT = 5

export const INITIAL_PREKEY_COUNT = 30