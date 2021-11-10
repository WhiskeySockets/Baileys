import type { ReadStream } from "fs"
import type { Logger } from "pino"
import type { URL } from "url"
import type NodeCache from "node-cache"
import type { GroupMetadata } from "./GroupMetadata"
import { proto } from '../../WAProto'

// export the WAMessage Prototypes
export { proto as WAProto }
export type WAMessage = proto.IWebMessageInfo
export type WAMessageContent = proto.IMessage
export type WAContactMessage = proto.IContactMessage
export type WAContactsArrayMessage = proto.IContactsArrayMessage
export type WAMessageKey = proto.IMessageKey
export type WATextMessage = proto.IExtendedTextMessage
export type WAContextInfo = proto.IContextInfo
export type WALocationMessage = proto.ILocationMessage
export type WAGenericMediaMessage = proto.IVideoMessage | proto.IImageMessage | proto.IAudioMessage | proto.IDocumentMessage | proto.IStickerMessage
export import WAMessageStubType = proto.WebMessageInfo.WebMessageInfoStubType
export import WAMessageStatus = proto.WebMessageInfo.WebMessageInfoStatus
export type WAMediaUpload = Buffer | { url: URL | string }
/** Set of message types that are supported by the library */
export type MessageType = keyof proto.Message

export type MediaConnInfo = {
    auth: string 
    ttl: number
    hosts: { hostname: string }[]
    fetchDate: Date
}

export interface WAUrlInfo {
    'canonical-url': string
    'matched-text': string
    title: string
    description: string
    jpegThumbnail?: Buffer
}

// types to generate WA messages
type Mentionable = {
    /** list of jids that are mentioned in the accompanying text */
    mentions?: string[]
}
type ViewOnce = {
    viewOnce?: boolean
}
type Buttonable = {
    /** add buttons to the message  */
    buttons?: proto.IButton[]
}
type WithDimensions = {
    width?: number
    height?: number
}
export type MediaType = 'image' | 'video' | 'sticker' | 'audio' | 'document' | 'history' | 'md-app-state'
export type AnyMediaMessageContent = (
    ({
        image: WAMediaUpload
        caption?: string
        jpegThumbnail?: string
    } & Mentionable & Buttonable & WithDimensions) | 
    ({
        video: WAMediaUpload
        caption?: string
        gifPlayback?: boolean
        jpegThumbnail?: string
    } & Mentionable & Buttonable & WithDimensions) | {
        audio: WAMediaUpload
        /** if set to true, will send as a `voice note` */
        pttAudio?: boolean
        /** optionally tell the duration of the audio */
        seconds?: number
    } | ({
        sticker: WAMediaUpload
    } & WithDimensions) | ({
        document: WAMediaUpload
        mimetype: string
        fileName?: string
    } & Buttonable)) & 
    { mimetype?: string }

export type AnyRegularMessageContent = (
    ({
	    text: string
    } 
    & Mentionable & Buttonable) | 
    AnyMediaMessageContent | 
    {
        contacts: {
            displayName?: string
            contacts: proto.IContactMessage[]
        }
    } | 
    {  
        location: WALocationMessage
    }
) & ViewOnce

export type AnyMessageContent = AnyRegularMessageContent | {
	forward: WAMessage
	force?: boolean
} | {
	delete: WAMessageKey
}  | {
	disappearingMessagesInChat: boolean | number
}

export type MessageRelayOptions = {
    messageId?: string
    additionalAttributes?: { [_: string]: string }
    cachedGroupMetadata?: (jid: string) => Promise<GroupMetadata | undefined>
    //cachedDevices?: (jid: string) => Promise<string[] | undefined>
}

export type MiscMessageGenerationOptions = {
    /** Force message id */
    messageId?: string
    /** optional, if you want to manually set the timestamp of the message */
	timestamp?: Date
    /** the message you want to quote */
	quoted?: WAMessage
    /** disappearing messages settings */
    ephemeralExpiration?: number | string

    mediaUploadTimeoutMs?: number
}
export type MessageGenerationOptionsFromContent = MiscMessageGenerationOptions & {
	userJid: string
}

export type WAMediaUploadFunction = (readStream: ReadStream, opts: { fileEncSha256B64: string, mediaType: MediaType, timeoutMs?: number }) => Promise<{ mediaUrl: string }>

export type MediaGenerationOptions = {
	logger?: Logger
    upload: WAMediaUploadFunction
    /** cache media so it does not have to be uploaded again */
    mediaCache?: NodeCache

    mediaUploadTimeoutMs?: number
}
export type MessageContentGenerationOptions = MediaGenerationOptions & {
	getUrlInfo?: (text: string) => Promise<WAUrlInfo>
}
export type MessageGenerationOptions = MessageContentGenerationOptions & MessageGenerationOptionsFromContent

export type MessageUpdateType = 'append' | 'notify' | 'prepend'

export type MessageInfoEventMap = { [jid: string]: Date }
export interface MessageInfo {
    reads: MessageInfoEventMap
    deliveries: MessageInfoEventMap
}

export type WAMessageUpdate = { update: Partial<WAMessage>, key: proto.IMessageKey }

export type WAMessageCursor = { before: WAMessageKey | undefined } | { after: WAMessageKey | undefined }

export type MessageInfoUpdate = { key: proto.IMessageKey, update: Partial<MessageInfo> }