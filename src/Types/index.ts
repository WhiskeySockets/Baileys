export * from './Auth'
export * from './GroupMetadata'
export * from './Chat'
export * from './Contact'
export * from './Store'

import type EventEmitter from "events"
import type { Agent } from "https"
import type { Logger } from "pino"
import type { URL } from "url"
import type BinaryNode from "../BinaryNode"
import { AnyAuthenticationCredentials } from './Auth'
import { ConnectionState } from './Store'

/** used for binary messages */
export enum WAMetric {
    debugLog = 1,
    queryResume = 2,
    liveLocation = 3,
    queryMedia = 4,
    queryChat = 5,
    queryContact = 6,
    queryMessages = 7,
    presence = 8,
    presenceSubscribe = 9,
    group = 10,
    read = 11,
    chat = 12,
    received = 13,
    picture = 14,
    status = 15,
    message = 16,
    queryActions = 17,
    block = 18,
    queryGroup = 19,
    queryPreview = 20,
    queryEmoji = 21,
    queryRead = 22,
    queryVCard = 29,
    queryStatus = 30,
    queryStatusUpdate = 31,
    queryLiveLocation = 33,
    queryLabel = 36,
    queryQuickReply = 39
}

/** used for binary messages */
export enum WAFlag {
    available = 160,
    other = 136, // don't know this one
    ignore = 1 << 7,
    acknowledge = 1 << 6,
    unavailable = 1 << 4,
    expires = 1 << 3,
    composing = 1 << 2,
    recording = 1 << 2,
    paused = 1 << 2
}

/** Tag used with binary queries */
export type WATag = [WAMetric, WAFlag]

export type SocketSendMessageOptions = {
	json: BinaryNode | any[]
	binaryTag?: WATag
	tag?: string
	longTag?: boolean
}

export type WAVersion = [number, number, number]
export type WABrowserDescription = [string, string, string]
export type ReconnectMode = 'no-reconnects' | 'on-any-error' | 'on-connection-error'

export type SocketConfig = {
    /** the WS url to connect to WA */
    waWebSocketUrl: string | URL 
    /** Fails the connection if the connection times out in this time interval or no data is received */
	connectTimeoutMs: number
    /** max time for the phone to respond to a connectivity test */
	phoneResponseTimeMs: number
    /** ping-pong interval for WS connection */
    keepAliveIntervalMs: number

    expectResponseTimeout: number
    /** proxy agent */
	agent?: Agent
	logger: Logger

    version: WAVersion
	browser: WABrowserDescription
	/** maximum attempts to connect */
	maxRetries: number
	connectCooldownMs: number
	/** agent used for fetch requests -- uploading/downloading media */
	fetchAgent?: Agent
    /** credentials used to sign back in */
    credentials?: AnyAuthenticationCredentials | string
	/** 
	 * Sometimes WA does not send the chats, 
	 * this keeps pinging the phone to send the chats over
	 * */
	queryChatsTillReceived?: boolean
	/**  */
	pendingRequestTimeoutMs: number
	reconnectMode: ReconnectMode
    maxQRCodes: number
    /** should the QR be printed in the terminal */
    printQRInTerminal: boolean

    phoneConnectionChanged: (connected: boolean) => void
}

export type SocketQueryOptions = SocketSendMessageOptions & {
	timeoutMs?: number
	expect200?: boolean
	requiresPhoneConnection?: boolean
}

export enum DisconnectReason {
	connectionClosedIntentionally = 428,
    connectionReplaced = 440,
	connectionLost = 408,
    timedOut = 408,
	credentialsInvalidated = 401,
    badSession = 500
}

export type WAInitResponse = {
    ref: string
    ttl: number
    status: 200
}

export type QueryOptions = SocketQueryOptions & {
	waitForOpen?: boolean
	maxRetries?: number
	startDebouncedTimeout?: boolean
}
export type CurveKeyPair = { private: Uint8Array; public: Uint8Array }

export type BaileysEventMap = {
	'connection.update': Partial<ConnectionState>
}
export interface BaileysEventEmitter extends EventEmitter {
	on<T extends keyof BaileysEventMap>(event: T, listener: (arg: BaileysEventMap[T]) => void): this
	emit<T extends keyof BaileysEventMap>(event: T, arg: BaileysEventMap[T]): boolean
}