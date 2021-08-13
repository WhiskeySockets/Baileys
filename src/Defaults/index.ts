import P from "pino"
import type { MediaType, SocketConfig } from "../Types"
import { Browsers } from "../Utils/generics"

export const UNAUTHORIZED_CODES = [401, 403, 419]

export const STORIES_JID = 'status@broadcast'

export const DEFAULT_ORIGIN = 'https://web.whatsapp.com'
export const DEF_CALLBACK_PREFIX = 'CB:'
export const DEF_TAG_PREFIX = 'TAG:'
export const PHONE_CONNECTION_CB = 'CB:Pong'

export const WA_DEFAULT_EPHEMERAL = 7*24*60*60

/** from: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url */
export const URL_REGEX = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi

export const DEFAULT_CONNECTION_CONFIG: SocketConfig = {
	version: [2, 2130, 9],
	browser: Browsers.baileys('Chrome'),

	waWebSocketUrl: 'wss://web.whatsapp.com/ws',
    keepAliveIntervalMs: 25_000,
    phoneResponseTimeMs: 15_000,
    connectTimeoutMs: 30_000,
    expectResponseTimeout: 12_000,
    logger: P().child({ class: 'baileys' }),
    phoneConnectionChanged: () => { },
	maxRetries: 5,
	connectCooldownMs: 2500,
	pendingRequestTimeoutMs: undefined,
	reconnectMode: 'on-connection-error',
	maxQRCodes: Infinity,
	printQRInTerminal: false,
}


export const MEDIA_PATH_MAP: { [T in MediaType]: string } = {
    image: '/mms/image',
    video: '/mms/video',
    document: '/mms/document',
    audio: '/mms/audio',
    sticker: '/mms/image',
}

export const MEDIA_KEYS = Object.keys(MEDIA_PATH_MAP) as MediaType[]