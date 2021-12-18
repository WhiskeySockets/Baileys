import { CommonSocketConfig } from "./Socket"
import { CommonBaileysEventEmitter } from "./Events"
import { BinaryNode } from "../WABinary"

export interface LegacyAuthenticationCreds {
    clientID: string
    serverToken: string
    clientToken: string
    encKey: Buffer
    macKey: Buffer
}

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

export type SocketQueryOptions = SocketSendMessageOptions & {
	timeoutMs?: number
	expect200?: boolean
	requiresPhoneConnection?: boolean
}

export type LegacySocketConfig = CommonSocketConfig<LegacyAuthenticationCreds> & {
	/** max time for the phone to respond to a connectivity test */
	phoneResponseTimeMs: number
	/** max time for WA server to respond before error with 422 */
    expectResponseTimeout: number
}

export type LegacyBaileysEventEmitter = CommonBaileysEventEmitter<LegacyAuthenticationCreds>