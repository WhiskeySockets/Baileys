/**
 * Sticker Maker Utilities untuk Baileys-Joss
 * 
 * Fitur untuk membuat sticker dari image/video
 * 
 * @module sticker-maker
 */

import { proto } from '../../WAProto/index.js'
import type { WAMediaUpload, WAMessageContent } from '../Types'

// =====================================================
// TYPES
// =====================================================

export interface StickerMetadata {
    /** Sticker pack name */
    packName?: string
    /** Author/creator name */
    author?: string
    /** Category (emoji) */
    categories?: string[]
    /** Sticker ID */
    id?: string
    /** Quality (0-100) */
    quality?: number
    /** Background for non-square images */
    background?: string
    /** Tipe sticker */
    type?: 'default' | 'circle' | 'rounded'
}

export interface StickerOptions extends StickerMetadata {
    /** Crop to square */
    crop?: boolean
    /** Target width (default 512) */
    width?: number
    /** Target height (default 512) */
    height?: number
}

// =====================================================
// STICKER METADATA (EXIF)
// =====================================================

/**
 * Build EXIF metadata untuk sticker
 * WhatsApp uses EXIF to store sticker pack info
 */
export const buildStickerExif = (metadata: StickerMetadata): Buffer => {
    const json = JSON.stringify({
        'sticker-pack-id': metadata.id || 'baileys-joss',
        'sticker-pack-name': metadata.packName || 'Baileys-Joss',
        'sticker-pack-publisher': metadata.author || '',
        'emojis': metadata.categories || ['🤖'],
        'android-app-store-link': '',
        'ios-app-store-link': ''
    })
    
    const exifData = Buffer.concat([
        Buffer.from([
            0x49, 0x49, 0x2A, 0x00, // TIFF header (little endian)
            0x08, 0x00, 0x00, 0x00, // Offset to first IFD
            0x01, 0x00,             // Number of IFD entries
            0x41, 0x57,             // Tag: 0x5741 (WA)
            0x07, 0x00,             // Type: undefined
            json.length & 0xFF, (json.length >> 8) & 0xFF, 0x00, 0x00, // Count
            0x16, 0x00, 0x00, 0x00, // Offset to value
            0x00, 0x00, 0x00, 0x00  // Next IFD offset
        ]),
        Buffer.from(json, 'utf-8')
    ])
    
    return Buffer.concat([
        Buffer.from('EXIF\x00\x00'),
        exifData
    ])
}

/**
 * Prepend EXIF ke WebP buffer
 */
export const addExifToWebp = (webpBuffer: Buffer, metadata: StickerMetadata): Buffer => {
    const exif = buildStickerExif(metadata)
    
    // Find RIFF header
    if (webpBuffer.slice(0, 4).toString() !== 'RIFF') {
        throw new Error('Invalid WebP format')
    }
    
    // Find VP8 chunk position
    let pos = 12
    while (pos < webpBuffer.length) {
        const chunkId = webpBuffer.slice(pos, pos + 4).toString()
        const chunkSize = webpBuffer.readUInt32LE(pos + 4)
        
        if (chunkId === 'VP8 ' || chunkId === 'VP8L' || chunkId === 'VP8X') {
            break
        }
        
        pos += 8 + chunkSize + (chunkSize % 2)
    }
    
    // Build new WebP with EXIF
    const before = webpBuffer.slice(0, pos)
    const after = webpBuffer.slice(pos)
    
    // EXIF chunk
    const exifChunk = Buffer.concat([
        Buffer.from('EXIF'),
        Buffer.alloc(4)
    ])
    exifChunk.writeUInt32LE(exif.length, 4)
    
    const result = Buffer.concat([
        before,
        exifChunk,
        exif,
        exif.length % 2 ? Buffer.alloc(1) : Buffer.alloc(0),
        after
    ])
    
    // Update RIFF size
    result.writeUInt32LE(result.length - 8, 4)
    
    return result
}

// =====================================================
// STICKER MESSAGE GENERATION
// =====================================================

/**
 * Generate sticker message content
 * Note: Actual image processing requires sharp/jimp
 * This provides the message structure
 */
export const generateStickerMessage = (
    stickerBuffer: Buffer,
    options: StickerOptions = {}
): { sticker: Buffer } & StickerOptions => {
    // Add EXIF metadata if provided
    let finalBuffer = stickerBuffer
    
    if (options.packName || options.author) {
        try {
            finalBuffer = addExifToWebp(stickerBuffer, {
                packName: options.packName,
                author: options.author,
                categories: options.categories,
                id: options.id
            })
        } catch {
            // If adding EXIF fails, use original buffer
            finalBuffer = stickerBuffer
        }
    }
    
    return {
        sticker: finalBuffer,
        ...options
    }
}

/**
 * Check apakah buffer adalah valid WebP
 */
export const isValidWebP = (buffer: Buffer): boolean => {
    if (buffer.length < 12) return false
    
    const riff = buffer.slice(0, 4).toString()
    const webp = buffer.slice(8, 12).toString()
    
    return riff === 'RIFF' && webp === 'WEBP'
}

/**
 * Get WebP dimensions
 */
export const getWebPDimensions = (buffer: Buffer): { width: number; height: number } | null => {
    if (!isValidWebP(buffer)) return null
    
    let pos = 12
    while (pos < buffer.length) {
        const chunkId = buffer.slice(pos, pos + 4).toString()
        const chunkSize = buffer.readUInt32LE(pos + 4)
        
        if (chunkId === 'VP8 ') {
            // Lossy format
            const width = buffer.readUInt16LE(pos + 14) & 0x3FFF
            const height = buffer.readUInt16LE(pos + 16) & 0x3FFF
            return { width, height }
        }
        
        if (chunkId === 'VP8L') {
            // Lossless format
            const signature = buffer.readUInt8(pos + 8)
            if (signature !== 0x2F) break
            
            const b1 = buffer.readUInt8(pos + 9)
            const b2 = buffer.readUInt8(pos + 10)
            const b3 = buffer.readUInt8(pos + 11)
            const b4 = buffer.readUInt8(pos + 12)
            
            const width = ((b1 | ((b2 & 0x3F) << 8)) + 1)
            const height = (((b2 >> 6) | (b3 << 2) | ((b4 & 0xF) << 10)) + 1)
            return { width, height }
        }
        
        if (chunkId === 'VP8X') {
            // Extended format
            const width = (buffer.readUIntLE(pos + 12, 3) + 1)
            const height = (buffer.readUIntLE(pos + 15, 3) + 1)
            return { width, height }
        }
        
        pos += 8 + chunkSize + (chunkSize % 2)
    }
    
    return null
}

/**
 * Check apakah WebP valid untuk sticker (512x512, < 500KB)
 */
export const isValidStickerWebP = (buffer: Buffer): { valid: boolean; reason?: string } => {
    if (!isValidWebP(buffer)) {
        return { valid: false, reason: 'Not a valid WebP file' }
    }
    
    // Check size (max 500KB for sticker)
    if (buffer.length > 500 * 1024) {
        return { valid: false, reason: 'File too large (max 500KB)' }
    }
    
    // Check dimensions
    const dims = getWebPDimensions(buffer)
    if (!dims) {
        return { valid: false, reason: 'Could not read dimensions' }
    }
    
    if (dims.width !== 512 || dims.height !== 512) {
        return { valid: false, reason: `Invalid dimensions: ${dims.width}x${dims.height} (should be 512x512)` }
    }
    
    return { valid: true }
}

// =====================================================
// ANIMATED STICKER UTILITIES
// =====================================================

/**
 * Check apakah WebP adalah animated
 */
export const isAnimatedWebP = (buffer: Buffer): boolean => {
    if (!isValidWebP(buffer)) return false
    
    let pos = 12
    while (pos < buffer.length) {
        const chunkId = buffer.slice(pos, pos + 4).toString()
        const chunkSize = buffer.readUInt32LE(pos + 4)
        
        if (chunkId === 'VP8X') {
            const flags = buffer.readUInt8(pos + 8)
            return !!(flags & 0x02) // Animation flag
        }
        
        if (chunkId === 'ANIM' || chunkId === 'ANMF') {
            return true
        }
        
        pos += 8 + chunkSize + (chunkSize % 2)
    }
    
    return false
}

// =====================================================
// CONVERSION HELPERS
// =====================================================

/**
 * Instructions untuk convert image ke sticker
 * (Actual conversion requires sharp atau ffmpeg)
 */
export const getStickerConversionCommand = (
    inputPath: string,
    outputPath: string,
    options: StickerOptions = {}
): string => {
    const width = options.width || 512
    const height = options.height || 512
    const quality = options.quality || 80
    
    // FFmpeg command untuk convert image ke WebP sticker
    return `ffmpeg -i "${inputPath}" -vf "scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=white" -c:v libwebp -lossless 0 -q:v ${quality} -loop 0 -preset default -an -vsync 0 "${outputPath}"`
}

/**
 * Get FFmpeg command untuk convert video ke animated sticker
 */
export const getAnimatedStickerCommand = (
    inputPath: string,
    outputPath: string,
    options: { fps?: number; duration?: number } = {}
): string => {
    const fps = options.fps || 15
    const duration = options.duration || 8
    
    // FFmpeg command untuk convert video ke animated WebP sticker
    return `ffmpeg -i "${inputPath}" -t ${duration} -vf "fps=${fps},scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white" -c:v libwebp -lossless 0 -q:v 75 -loop 0 -preset default -an -vsync 0 "${outputPath}"`
}

export default {
    buildStickerExif,
    addExifToWebp,
    generateStickerMessage,
    isValidWebP,
    getWebPDimensions,
    isValidStickerWebP,
    isAnimatedWebP,
    getStickerConversionCommand,
    getAnimatedStickerCommand
}
