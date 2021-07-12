export * from './Auth'
export * from './GroupMetadata'
export * from './Chat'
export * from './Contact'
export * from './Store'
export * from './Message'

import type EventEmitter from "events"
import type { Agent } from "https"
import type { Logger } from "pino"
import type { URL } from "url"
import type BinaryNode from "../BinaryNode"
import { AnyAuthenticationCredentials, AuthenticationCredentials } from './Auth'
import { Chat } from './Chat'
import { Contact } from './Contact'
import { ConnectionState } from './Store'

import { GroupMetadata, ParticipantAction } from './GroupMetadata'
import { MessageUpdateType, WAMessage } from './Message'

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
	connectionClosed = 428,
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

export interface WABroadcastListInfo {
    status: number
    name: string
    recipients?: {id: string}[]
}


type WABusinessHoursConfig = {
    day_of_week: string
    mode: string
    open_time?: number
    close_time?: number
}
export type WABusinessProfile = {
    description: string
    email: string
    business_hours:  {
        timezone: string
        config?:  WABusinessHoursConfig[]
        business_config?: WABusinessHoursConfig[]
    }
    website: string[]
    categories: {
        id: string
        localized_display_name:  string
    }[]
    wid?: string
}

export type QueryOptions = SocketQueryOptions & {
	waitForOpen?: boolean
	maxRetries?: number
	startDebouncedTimeout?: boolean
}
export type CurveKeyPair = { private: Uint8Array; public: Uint8Array }

export type BaileysEventMap = {
	'connection.update': Partial<ConnectionState>
    'credentials.update': AuthenticationCredentials

    'chats.upsert': { chats: Chat[], type: 'set' | 'upsert' }
    'chats.update': Partial<Chat>[]
    'chats.delete': string[]

    'contacts.upsert': { contacts: Contact[], type: 'set' | 'upsert' }
    'contacts.update': Partial<Contact>[] 
    
    'messages.delete': { jid: string, ids: string[] } | { jid: string, all: true }
    'messages.update': Partial<WAMessage>[]
    'messages.upsert': { messages: WAMessage[], type: MessageUpdateType }

    'groups.update': Partial<GroupMetadata>[]
    'group-participants.update': { jid: string, participants: string[], action: ParticipantAction }

    'blocklist.update': { blocklist: string[], type: 'add' | 'remove' | 'set' }
}
export interface BaileysEventEmitter extends EventEmitter {
	on<T extends keyof BaileysEventMap>(event: T, listener: (arg: BaileysEventMap[T]) => void): this
    off<T extends keyof BaileysEventMap>(event: T, listener: (arg: BaileysEventMap[T]) => void): this
    removeAllListeners<T extends keyof BaileysEventMap>(event: T): this
	emit<T extends keyof BaileysEventMap>(event: T, arg: BaileysEventMap[T]): boolean
}