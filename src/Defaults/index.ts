import P from "pino"
import type { SocketConfig } from "../Types"
import { Browsers } from "../Utils/generics"

export const UNAUTHORIZED_CODES = [401, 403, 419]

export const DEFAULT_ORIGIN = 'https://web.whatsapp.com'
export const DEF_CALLBACK_PREFIX = 'CB:'
export const DEF_TAG_PREFIX = 'TAG:'
export const PHONE_CONNECTION_CB = 'CB:Pong'

export const DEFAULT_CONNECTION_CONFIG: SocketConfig = {
	version: [2, 2123, 8],
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
