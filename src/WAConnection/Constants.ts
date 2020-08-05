import { WA } from '../Binary/Constants'
import { proto } from '../../WAMessage/WAMessage'


export class BaileysError extends Error {
    status?: number
    context: any

    constructor (message: string, context: any) {
        super (message)
        this.name = 'BaileysError'
        this.status = context.status
        this.context = context
    }
}

export enum MessageLogLevel {
    none=0,
    info=1,
    unhandled=2,
    all=3
}
export interface AuthenticationCredentials {
    clientID: string
    serverToken: string
    clientToken: string
    encKey: Buffer
    macKey: Buffer
}
export interface AuthenticationCredentialsBase64 {
    clientID: string
    serverToken: string
    clientToken: string
    encKey: string
    macKey: string
}
export interface AuthenticationCredentialsBrowser {
    WABrowserId: string
    WASecretBundle: {encKey: string, macKey: string} | string
    WAToken1: string
    WAToken2: string
}
export interface UserMetaData {
    id: string
    name: string
    phone: string
}
export type WANode = WA.Node
export type WAMessage = proto.WebMessageInfo
export type WAMessageContent = proto.IMessage

export enum WAConnectionMode {
    /** Baileys will let requests through after a simple connect */
    onlyRequireValidation = 0,
    /** Baileys will let requests through only after chats & contacts are received */
    requireChatsAndContacts = 1
}
export interface WAGroupCreateResponse {
    status: number
    gid?: string
    participants?: [{ [key: string]: any }]
}
export interface WAGroupMetadata {
    id: string
    owner: string
    subject: string
    creation: number
    desc?: string
    descOwner?: string
    descId?: string
    participants: [{ id: string; isAdmin: boolean; isSuperAdmin: boolean }]
}
export interface WAGroupModification {
    status: number
    participants?: { [key: string]: any }
}

export interface WAContact {
    notify?: string
    jid: string
    name?: string
    index?: string
    short?: string
}
export interface WAChat {
    t: string
    count: number
    archive?: 'true' | 'false'
    read_only?: 'true' | 'false'
    mute?: string
    pin?: string
    spam: 'false' | 'true'
    jid: string
    modify_tag: string
    messages: WAMessage[]
}
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
    queryVCard = 29,
    queryStatus = 30,
    queryStatusUpdate = 31,
    queryLiveLocation = 33,
    queryLabel = 36,
    queryQuickReply = 39
}
export enum WAFlag {
    ignore = 1 << 7,
    acknowledge = 1 << 6,
    available = 1 << 5,
    unavailable = 1 << 4,
    expires = 1 << 3,
    skipOffline = 1 << 2,
}
/** Tag used with binary queries */
export type WATag = [WAMetric, WAFlag]
export * as WAMessageProto from '../../WAMessage/WAMessage' 


