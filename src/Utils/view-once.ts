/**
 * View Once & Media Utilities untuk Baileys-Joss
 * 
 * Fitur untuk handling view once messages dan media utilities
 * 
 * @module view-once
 */

import type { Readable } from 'stream'
import { proto } from '../../WAProto/index.js'
import type { WAMessage, WAMessageContent, DownloadableMessage } from '../Types'
import type { MediaType } from '../Defaults'
import { downloadContentFromMessage, toBuffer } from './messages-media'

// =====================================================
// TYPES
// =====================================================

export interface ViewOnceInfo {
    /** Apakah ini view once message */
    isViewOnce: boolean
    /** Type media (image/video/audio) */
    mediaType?: MediaType
    /** Caption jika ada */
    caption?: string
    /** Sudah dilihat atau belum */
    isViewed?: boolean
    /** Message content untuk download */
    downloadable?: DownloadableMessage
    /** Mimetype */
    mimetype?: string
    /** File size */
    fileLength?: number
}

export interface MediaInfo {
    /** Type media */
    type: MediaType | 'unknown'
    /** Caption */
    caption?: string
    /** Mimetype */
    mimetype?: string
    /** File size dalam bytes */
    fileSize?: number
    /** Duration (untuk audio/video) */
    duration?: number
    /** Width (untuk image/video) */
    width?: number
    /** Height (untuk image/video) */
    height?: number
    /** Is GIF */
    isGif?: boolean
    /** Is animated sticker */
    isAnimated?: boolean
    /** Filename (untuk document) */
    fileName?: string
    /** Thumbnail */
    jpegThumbnail?: Uint8Array
    /** View once */
    isViewOnce?: boolean
    /** Downloadable message */
    downloadable?: DownloadableMessage
}

export interface ExtractedMessage {
    /** Text content */
    text?: string
    /** Media info jika ada */
    media?: MediaInfo
    /** Quoted message jika ada */
    quoted?: {
        message?: WAMessageContent
        key?: proto.IMessageKey
        participant?: string
        text?: string
        media?: MediaInfo
    }
    /** Mentions */
    mentions?: string[]
    /** Is forwarded */
    isForwarded?: boolean
    /** Forward score */
    forwardScore?: number
    /** Reaction */
    reaction?: {
        text: string
        key: proto.IMessageKey
    }
    /** Is ephemeral */
    isEphemeral?: boolean
    /** Ephemeral expiration */
    ephemeralExpiration?: number
}

// =====================================================
// VIEW ONCE FUNCTIONS
// =====================================================

/**
 * Check apakah message adalah view once
 */
export const isViewOnceMessage = (message: WAMessage): boolean => {
    const content = message.message
    if (!content) return false
    
    // Check view once v1
    if (content.viewOnceMessage?.message) return true
    
    // Check view once v2 (ephemeral)
    if (content.viewOnceMessageV2?.message) return true
    
    // Check view once v2 extension
    if (content.viewOnceMessageV2Extension?.message) return true
    
    // Check key flag
    if (message.key?.isViewOnce) return true
    
    return false
}

/**
 * Get view once message info
 */
export const getViewOnceInfo = (message: WAMessage): ViewOnceInfo | null => {
    const content = message.message
    if (!content) return null
    
    // Get inner message
    const viewOnceContent = 
        content.viewOnceMessage?.message ||
        content.viewOnceMessageV2?.message ||
        content.viewOnceMessageV2Extension?.message
    
    if (!viewOnceContent) {
        if (message.key?.isViewOnce) {
            return { isViewOnce: true }
        }
        return null
    }
    
    const result: ViewOnceInfo = {
        isViewOnce: true
    }
    
    // Check for image
    if (viewOnceContent.imageMessage) {
        const img = viewOnceContent.imageMessage
        result.mediaType = 'image'
        result.caption = img.caption || undefined
        result.mimetype = img.mimetype || undefined
        result.fileLength = img.fileLength ? Number(img.fileLength) : undefined
        result.downloadable = {
            mediaKey: img.mediaKey,
            directPath: img.directPath,
            url: img.url
        }
    }
    
    // Check for video
    else if (viewOnceContent.videoMessage) {
        const vid = viewOnceContent.videoMessage
        result.mediaType = 'video'
        result.caption = vid.caption || undefined
        result.mimetype = vid.mimetype || undefined
        result.fileLength = vid.fileLength ? Number(vid.fileLength) : undefined
        result.downloadable = {
            mediaKey: vid.mediaKey,
            directPath: vid.directPath,
            url: vid.url
        }
    }
    
    // Check for audio
    else if (viewOnceContent.audioMessage) {
        const aud = viewOnceContent.audioMessage
        result.mediaType = 'audio'
        result.mimetype = aud.mimetype || undefined
        result.fileLength = aud.fileLength ? Number(aud.fileLength) : undefined
        result.downloadable = {
            mediaKey: aud.mediaKey,
            directPath: aud.directPath,
            url: aud.url
        }
    }
    
    return result
}

/**
 * Download view once media
 * Returns buffer dari media
 */
export const downloadViewOnceMedia = async (
    message: WAMessage,
    options?: { timeout?: number }
): Promise<{ buffer: Buffer; info: ViewOnceInfo } | null> => {
    const info = getViewOnceInfo(message)
    if (!info?.downloadable || !info.mediaType) return null
    
    try {
        const stream = await downloadContentFromMessage(
            info.downloadable,
            info.mediaType,
            { options: options?.timeout ? { signal: AbortSignal.timeout(options.timeout) } : undefined }
        )
        
        const buffer = await toBuffer(stream as Readable)
        return { buffer, info }
    } catch (error) {
        throw new Error(`Failed to download view once media: ${error}`)
    }
}

// =====================================================
// MEDIA EXTRACTION FUNCTIONS
// =====================================================

/**
 * Get media info dari message content
 */
export const getMediaInfo = (content: WAMessageContent | null | undefined): MediaInfo | null => {
    if (!content) return null
    
    // Image
    if (content.imageMessage) {
        const m = content.imageMessage
        return {
            type: 'image',
            caption: m.caption || undefined,
            mimetype: m.mimetype || undefined,
            fileSize: m.fileLength ? Number(m.fileLength) : undefined,
            width: m.width || undefined,
            height: m.height || undefined,
            jpegThumbnail: m.jpegThumbnail || undefined,
            downloadable: {
                mediaKey: m.mediaKey,
                directPath: m.directPath,
                url: m.url
            }
        }
    }
    
    // Video
    if (content.videoMessage) {
        const m = content.videoMessage
        return {
            type: 'video',
            caption: m.caption || undefined,
            mimetype: m.mimetype || undefined,
            fileSize: m.fileLength ? Number(m.fileLength) : undefined,
            width: m.width || undefined,
            height: m.height || undefined,
            duration: m.seconds || undefined,
            isGif: m.gifPlayback || false,
            jpegThumbnail: m.jpegThumbnail || undefined,
            downloadable: {
                mediaKey: m.mediaKey,
                directPath: m.directPath,
                url: m.url
            }
        }
    }
    
    // Audio
    if (content.audioMessage) {
        const m = content.audioMessage
        return {
            type: 'audio',
            mimetype: m.mimetype || undefined,
            fileSize: m.fileLength ? Number(m.fileLength) : undefined,
            duration: m.seconds || undefined,
            downloadable: {
                mediaKey: m.mediaKey,
                directPath: m.directPath,
                url: m.url
            }
        }
    }
    
    // Document
    if (content.documentMessage) {
        const m = content.documentMessage
        return {
            type: 'document',
            caption: m.caption || undefined,
            mimetype: m.mimetype || undefined,
            fileSize: m.fileLength ? Number(m.fileLength) : undefined,
            fileName: m.fileName || undefined,
            jpegThumbnail: m.jpegThumbnail || undefined,
            downloadable: {
                mediaKey: m.mediaKey,
                directPath: m.directPath,
                url: m.url
            }
        }
    }
    
    // Sticker
    if (content.stickerMessage) {
        const m = content.stickerMessage
        return {
            type: 'sticker',
            mimetype: m.mimetype || undefined,
            fileSize: m.fileLength ? Number(m.fileLength) : undefined,
            width: m.width || undefined,
            height: m.height || undefined,
            isAnimated: m.isAnimated || false,
            downloadable: {
                mediaKey: m.mediaKey,
                directPath: m.directPath,
                url: m.url
            }
        }
    }
    
    // Check view once
    const viewOnceContent = 
        content.viewOnceMessage?.message ||
        content.viewOnceMessageV2?.message ||
        content.viewOnceMessageV2Extension?.message
    
    if (viewOnceContent) {
        const inner = getMediaInfo(viewOnceContent)
        if (inner) {
            inner.isViewOnce = true
            return inner
        }
    }
    
    return null
}

/**
 * Download media dari message
 */
export const downloadMedia = async (
    message: WAMessage,
    options?: { timeout?: number }
): Promise<Buffer | null> => {
    const content = message.message
    if (!content) return null
    
    // Check view once first
    if (isViewOnceMessage(message)) {
        const result = await downloadViewOnceMedia(message, options)
        return result?.buffer || null
    }
    
    const mediaInfo = getMediaInfo(content)
    if (!mediaInfo?.downloadable || mediaInfo.type === 'unknown') return null
    
    try {
        const stream = await downloadContentFromMessage(
            mediaInfo.downloadable,
            mediaInfo.type as MediaType,
            { options: options?.timeout ? { signal: AbortSignal.timeout(options.timeout) } : undefined }
        )
        
        return await toBuffer(stream as Readable)
    } catch (error) {
        throw new Error(`Failed to download media: ${error}`)
    }
}

// =====================================================
// MESSAGE EXTRACTION FUNCTIONS
// =====================================================

/**
 * Get text dari message (support berbagai jenis message)
 */
export const getMessageText = (message: WAMessage): string | undefined => {
    const content = message.message
    if (!content) return undefined
    
    // Simple text
    if (content.conversation) return content.conversation
    
    // Extended text
    if (content.extendedTextMessage?.text) return content.extendedTextMessage.text
    
    // Captions
    if (content.imageMessage?.caption) return content.imageMessage.caption
    if (content.videoMessage?.caption) return content.videoMessage.caption
    if (content.documentMessage?.caption) return content.documentMessage.caption
    
    // Button responses
    if (content.buttonsResponseMessage?.selectedDisplayText) {
        return content.buttonsResponseMessage.selectedDisplayText
    }
    
    // List response
    if (content.listResponseMessage?.title) {
        return content.listResponseMessage.title
    }
    
    // Template button reply
    if (content.templateButtonReplyMessage?.selectedDisplayText) {
        return content.templateButtonReplyMessage.selectedDisplayText
    }
    
    // View once captions
    const viewOnceContent = 
        content.viewOnceMessage?.message ||
        content.viewOnceMessageV2?.message
    
    if (viewOnceContent) {
        if (viewOnceContent.imageMessage?.caption) return viewOnceContent.imageMessage.caption
        if (viewOnceContent.videoMessage?.caption) return viewOnceContent.videoMessage.caption
    }
    
    return undefined
}

/**
 * Get quoted message info
 */
export const getQuotedMessage = (message: WAMessage): ExtractedMessage['quoted'] | null => {
    const content = message.message
    if (!content) return null
    
    // Find context info
    const contextInfo = 
        content.extendedTextMessage?.contextInfo ||
        content.imageMessage?.contextInfo ||
        content.videoMessage?.contextInfo ||
        content.audioMessage?.contextInfo ||
        content.documentMessage?.contextInfo ||
        content.stickerMessage?.contextInfo ||
        content.viewOnceMessage?.message?.imageMessage?.contextInfo ||
        content.viewOnceMessage?.message?.videoMessage?.contextInfo
    
    if (!contextInfo?.quotedMessage) return null
    
    const quoted = contextInfo.quotedMessage
    
    // Get text from quoted
    let text: string | undefined
    if (quoted.conversation) text = quoted.conversation
    else if (quoted.extendedTextMessage?.text) text = quoted.extendedTextMessage.text
    else if (quoted.imageMessage?.caption) text = quoted.imageMessage.caption
    else if (quoted.videoMessage?.caption) text = quoted.videoMessage.caption
    
    return {
        message: quoted,
        key: contextInfo.stanzaId ? {
            remoteJid: message.key.remoteJid,
            id: contextInfo.stanzaId,
            fromMe: contextInfo.participant === message.key.participant,
            participant: contextInfo.participant
        } : undefined,
        participant: contextInfo.participant || undefined,
        text,
        media: getMediaInfo(quoted) || undefined
    }
}

/**
 * Get mentions dari message
 */
export const getMentions = (message: WAMessage): string[] => {
    const content = message.message
    if (!content) return []
    
    const contextInfo = 
        content.extendedTextMessage?.contextInfo ||
        content.imageMessage?.contextInfo ||
        content.videoMessage?.contextInfo
    
    return contextInfo?.mentionedJid || []
}

/**
 * Check apakah message adalah forwarded
 */
export const isForwardedMessage = (message: WAMessage): boolean => {
    const content = message.message
    if (!content) return false
    
    const contextInfo = 
        content.extendedTextMessage?.contextInfo ||
        content.imageMessage?.contextInfo ||
        content.videoMessage?.contextInfo ||
        content.audioMessage?.contextInfo ||
        content.documentMessage?.contextInfo
    
    return !!contextInfo?.isForwarded
}

/**
 * Get forward score (berapa kali di-forward)
 */
export const getForwardScore = (message: WAMessage): number => {
    const content = message.message
    if (!content) return 0
    
    const contextInfo = 
        content.extendedTextMessage?.contextInfo ||
        content.imageMessage?.contextInfo ||
        content.videoMessage?.contextInfo
    
    return contextInfo?.forwardingScore || 0
}

/**
 * Extract semua info dari message
 */
export const extractMessageInfo = (message: WAMessage): ExtractedMessage => {
    const content = message.message
    
    const result: ExtractedMessage = {}
    
    // Text
    result.text = getMessageText(message)
    
    // Media
    if (content) {
        result.media = getMediaInfo(content) || undefined
    }
    
    // Quoted
    result.quoted = getQuotedMessage(message) || undefined
    
    // Mentions
    const mentions = getMentions(message)
    if (mentions.length > 0) {
        result.mentions = mentions
    }
    
    // Forward info
    result.isForwarded = isForwardedMessage(message)
    if (result.isForwarded) {
        result.forwardScore = getForwardScore(message)
    }
    
    // Ephemeral
    const contextInfo = content?.extendedTextMessage?.contextInfo
    if (contextInfo?.expiration) {
        result.isEphemeral = true
        result.ephemeralExpiration = contextInfo.expiration
    }
    
    return result
}

// =====================================================
// HELPER UTILITIES
// =====================================================

/**
 * Get message type
 */
export const getMessageType = (message: WAMessage): string | undefined => {
    const content = message.message
    if (!content) return undefined
    
    // Check each type
    if (content.conversation) return 'text'
    if (content.extendedTextMessage) return 'extendedText'
    if (content.imageMessage) return 'image'
    if (content.videoMessage) return 'video'
    if (content.audioMessage) return 'audio'
    if (content.documentMessage) return 'document'
    if (content.stickerMessage) return 'sticker'
    if (content.contactMessage) return 'contact'
    if (content.contactsArrayMessage) return 'contacts'
    if (content.locationMessage) return 'location'
    if (content.liveLocationMessage) return 'liveLocation'
    if (content.reactionMessage) return 'reaction'
    if (content.pollCreationMessage || content.pollCreationMessageV2 || content.pollCreationMessageV3) return 'poll'
    if (content.pollUpdateMessage) return 'pollUpdate'
    if (content.viewOnceMessage || content.viewOnceMessageV2) return 'viewOnce'
    if (content.buttonsMessage) return 'buttons'
    if (content.buttonsResponseMessage) return 'buttonsResponse'
    if (content.listMessage) return 'list'
    if (content.listResponseMessage) return 'listResponse'
    if (content.templateMessage) return 'template'
    if (content.templateButtonReplyMessage) return 'templateButtonReply'
    if (content.interactiveMessage) return 'interactive'
    if (content.interactiveResponseMessage) return 'interactiveResponse'
    if (content.protocolMessage) return 'protocol'
    if (content.eventMessage) return 'event'
    if (content.productMessage) return 'product'
    if (content.groupInviteMessage) return 'groupInvite'
    
    return 'unknown'
}

/**
 * Check apakah message memiliki media
 */
export const hasMedia = (message: WAMessage): boolean => {
    const content = message.message
    if (!content) return false
    
    return !!(
        content.imageMessage ||
        content.videoMessage ||
        content.audioMessage ||
        content.documentMessage ||
        content.stickerMessage ||
        content.viewOnceMessage?.message?.imageMessage ||
        content.viewOnceMessage?.message?.videoMessage ||
        content.viewOnceMessageV2?.message?.imageMessage ||
        content.viewOnceMessageV2?.message?.videoMessage
    )
}

/**
 * Check apakah message adalah reply
 */
export const isReply = (message: WAMessage): boolean => {
    return !!getQuotedMessage(message)
}

export default {
    isViewOnceMessage,
    getViewOnceInfo,
    downloadViewOnceMedia,
    getMediaInfo,
    downloadMedia,
    getMessageText,
    getQuotedMessage,
    getMentions,
    isForwardedMessage,
    getForwardScore,
    extractMessageInfo,
    getMessageType,
    hasMedia,
    isReply
}
