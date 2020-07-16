import { WA } from '../Binary/Constants'
import { proto } from '../../WAMessage/WAMessage'

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
    liveLocation = 3,
    queryMedia = 4,
    queryMessages = 7,
    group = 10,
    message = 16,
    queryLiveLocation = 33,
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



