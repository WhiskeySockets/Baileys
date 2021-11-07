export * from './Auth'
export * from './GroupMetadata'
export * from './Chat'
export * from './Contact'
export * from './State'
export * from './Message'

import type EventEmitter from "events"
import type { Agent } from "https"
import type { Logger } from "pino"
import type { URL } from "url"
import type NodeCache from 'node-cache'

import { AuthenticationState } from './Auth'
import { Chat, PresenceData } from './Chat'
import { Contact } from './Contact'
import { ConnectionState } from './State'

import { GroupMetadata, ParticipantAction } from './GroupMetadata'
import { MessageInfoUpdate, MessageUpdateType, WAMessage, WAMessageUpdate, WAMessageKey } from './Message'

export type WAVersion = [number, number, number]
export type WABrowserDescription = [string, string, string]
export type ReconnectMode = 'no-reconnects' | 'on-any-error' | 'on-connection-error'

export type SocketConfig = {
    /** provide an auth state object to maintain the auth state */
    auth?: AuthenticationState
    /** the WS url to connect to WA */
    waWebSocketUrl: string | URL 
    /** Fails the connection if the socket times out in this interval */
	connectTimeoutMs: number
    /** ping-pong interval for WS connection */
    keepAliveIntervalMs: number
    /** proxy agent */
	agent?: Agent
    /** pino logger */
	logger: Logger
    /** version to connect with */
    version: WAVersion
    /** override browser config */
	browser: WABrowserDescription
	/** agent used for fetch requests -- uploading/downloading media */
	fetchAgent?: Agent
    /** should the QR be printed in the terminal */
    printQRInTerminal: boolean
    /** should events be emitted for actions done by this socket connection */
    emitOwnEvents: boolean
    /** provide a cache to store a user's device list */
    userDevicesCache?: NodeCache
}

export enum DisconnectReason {
	connectionClosed = 428,
	connectionLost = 408,
    timedOut = 408,
	loggedOut = 401,
    badSession = 500,
    restartRequired = 410
}

export type WAInitResponse = {
    ref: string
    ttl: number
    status: 200
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

export type CurveKeyPair = { private: Uint8Array; public: Uint8Array }

export type BaileysEventMap = {
    /** connection state has been updated -- WS closed, opened, connecting etc. */
	'connection.update': Partial<ConnectionState>
    /** auth state updated -- some pre keys, or identity keys etc. */
    'auth-state.update': AuthenticationState
    /** set chats (history sync), messages are reverse chronologically sorted */
    'chats.set': { chats: Chat[], messages: WAMessage[] }
    /** upsert chats */
    'chats.upsert': Chat[]
    /** update the given chats */
    'chats.update': Partial<Chat>[]
    /** delete chats with given ID */
    'chats.delete': string[]
    /** presence of contact in a chat updated */
    'presence.update': { id: string, presences: { [participant: string]: PresenceData }  }

    'contacts.upsert': Contact[]
    'contacts.update': Partial<Contact>[] 
    
    'messages.delete': { keys: WAMessageKey[] } | { jid: string, all: true }
    'messages.update': WAMessageUpdate[]
    /** 
     * add/update the given messages. If they were received while the connection was online, 
     * the update will have type: "notify"
     *  */
    'messages.upsert': { messages: WAMessage[], type: MessageUpdateType }

    'message-info.update': MessageInfoUpdate[]

    'groups.update': Partial<GroupMetadata>[]
    /** apply an action to participants in a group */
    'group-participants.update': { id: string, participants: string[], action: ParticipantAction }

    'blocklist.set': { blocklist: string[] }
    'blocklist.update': { blocklist: string[], type: 'add' | 'remove' }
}
export interface BaileysEventEmitter extends EventEmitter {
	on<T extends keyof BaileysEventMap>(event: T, listener: (arg: BaileysEventMap[T]) => void): this
    off<T extends keyof BaileysEventMap>(event: T, listener: (arg: BaileysEventMap[T]) => void): this
    removeAllListeners<T extends keyof BaileysEventMap>(event: T): this
	emit<T extends keyof BaileysEventMap>(event: T, arg: BaileysEventMap[T]): boolean
}