import { WAMessage } from '../WAConnection/Constants'
import { proto } from '../../WAMessage/WAMessage'
/**
 * set of statuses visible to other people; see updatePresence() in WhatsAppWeb.Send
 */
export enum Presence {
    available = 'available', // "online"
    unavailable = 'unavailable', // "offline"
    composing = 'composing', // "typing..."
    recording = 'recording', // "recording..."
    paused = 'paused', // I have no clue
}
/**
 * Status of a message sent or received
 */
export enum MessageStatus {
    sent = 'sent',
    received = 'received',
    read = 'read',
}
/**
 * set of message types that are supported by the library
 */
export enum MessageType {
    text = 'conversation',
    extendedText = 'extendedTextMessage',
    contact = 'contactMessage',
    location = 'locationMessage',
    liveLocation = 'liveLocationMessage',

    image = 'imageMessage',
    video = 'videoMessage',
    sticker = 'stickerMessage',
    document = 'documentMessage',
    audio = 'audioMessage',
    product = 'productMessage'
}
export enum ChatModification {
    archive='archive',
    unarchive='unarchive',
    pin='pin',
    unpin='unpin',
    mute='mute',
    unmute='unmute'
}
export const HKDFInfoKeys = {
    [MessageType.image]: 'WhatsApp Image Keys',
    [MessageType.audio]: 'WhatsApp Audio Keys',
    [MessageType.video]: 'WhatsApp Video Keys',
    [MessageType.document]: 'WhatsApp Document Keys',
    [MessageType.sticker]: 'WhatsApp Image Keys'
}
export enum Mimetype {
    jpeg = 'image/jpeg',
    png = 'image/png',
    mp4 = 'video/mp4',
    gif = 'video/gif',
    pdf = 'application/pdf',
    ogg = 'audio/ogg; codecs=opus',
    /** for stickers */
    webp = 'image/webp',
}
export interface MessageOptions {
    quoted?: WAMessage
    contextInfo?: WAContextInfo
    timestamp?: Date
    caption?: string
    thumbnail?: string
    mimetype?: Mimetype | string
    validateID?: boolean,
    filename?: string
}
export interface WABroadcastListInfo {
    status: number
    name: string
    recipients?: {id: string}[]
}
export interface WAUrlInfo {
    'canonical-url': string
    'matched-text': string
    title: string
    description: string
    jpegThumbnail?: Buffer
}
export interface WAProfilePictureChange {
    status: number
    tag: string
    eurl: string
}
export interface MessageInfo {
    reads: {jid: string, t: string}[]
    deliveries: {jid: string, t: string}[]
}
export interface MessageStatusUpdate {
    from: string
    to: string
    /** Which participant caused the update (only for groups) */
    participant?: string
    timestamp: Date
    /** Message IDs read/delivered */
    ids: string[]
    /** Status of the Message IDs */
    type: WA_MESSAGE_STATUS_TYPE
}
export enum GroupSettingChange {
    messageSend = 'announcement',
    settingsChange = 'locked',
}
export interface PresenceUpdate {
    id: string
    participant?: string
    t?: string
    type?: Presence
    deny?: boolean
}
// path to upload the media
export const MediaPathMap = {
    imageMessage: '/mms/image',
    videoMessage: '/mms/video',
    documentMessage: '/mms/document',
    audioMessage: '/mms/audio',
    stickerMessage: '/mms/image',
}
// gives WhatsApp info to process the media
export const MimetypeMap = {
    imageMessage: Mimetype.jpeg,
    videoMessage: Mimetype.mp4,
    documentMessage: Mimetype.pdf,
    audioMessage: Mimetype.ogg,
    stickerMessage: Mimetype.webp,
}
export interface WASendMessageResponse {
    status: number
    messageID: string
    message: WAMessage
}
export interface WALocationMessage {
    degreesLatitude: number
    degreesLongitude: number
    address?: string
}
export import WA_MESSAGE_STUB_TYPE = proto.WebMessageInfo.WEB_MESSAGE_INFO_STUBTYPE
export import WA_MESSAGE_STATUS_TYPE = proto.WebMessageInfo.WEB_MESSAGE_INFO_STATUS

/** Reverse stub type dictionary */
export const WAMessageType = function () {
    const types = WA_MESSAGE_STUB_TYPE
    const dict: Record<number, string> = {}
    Object.keys(types).forEach(element => dict[ types[element] ] = element)
    return dict
}()
export type WAContactMessage = proto.ContactMessage
export type WAMessageKey = proto.IMessageKey
export type WATextMessage = proto.ExtendedTextMessage
export type WAContextInfo = proto.IContextInfo
