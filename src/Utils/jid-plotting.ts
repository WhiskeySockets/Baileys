/**
 * LID & SenderPn Plotting Utilities untuk Baileys-Joss
 * 
 * senderPn = nomor WA yang sedang digunakan (current session)
 * LID = Linked ID yang dipakai WhatsApp untuk identifikasi
 * 
 * @module jid-plotting
 */

import { 
    jidDecode, 
    jidEncode, 
    jidNormalizedUser, 
    isLidUser, 
    isPnUser,
    isHostedLidUser,
    isHostedPnUser,
    S_WHATSAPP_NET,
    type FullJid
} from '../WABinary'
import type { AuthenticationCreds } from '../Types'

// =====================================================
// TYPES
// =====================================================

export interface JidInfo {
    /** Full JID string */
    jid: string
    /** User part (phone number or LID) */
    user: string
    /** Server/domain part */
    server: string
    /** Device number (0 = primary) */
    device: number
    /** Agent (0 = user, 1 = agent) */
    agent: number
    /** Is this a LID? */
    isLid: boolean
    /** Is this a phone number (PN)? */
    isPn: boolean
    /** Is this a hosted account? */
    isHosted: boolean
    /** Is this a group? */
    isGroup: boolean
    /** Is this a newsletter? */
    isNewsletter: boolean
    /** Normalized user (without device) */
    normalizedUser: string
}

export interface PlottedJid {
    /** Original JID yang diberikan */
    original: string
    /** Phone number JID */
    pn?: string
    /** LID */
    lid?: string
    /** Resolved (primary identifier) */
    primary: string
    /** Info lengkap */
    info: JidInfo
}

export interface SenderPnInfo {
    /** Phone number dengan @s.whatsapp.net */
    phoneJid: string
    /** Phone number tanpa domain */
    phoneNumber: string
    /** LID jika tersedia */
    lid?: string
    /** Device ID */
    deviceId: number
    /** Nama yang tersimpan di account */
    pushName?: string
    /** Platform (android/ios/web/etc) */
    platform?: string
}

// =====================================================
// CORE FUNCTIONS
// =====================================================

/**
 * Parse dan extract informasi lengkap dari JID
 */
export const parseJid = (jid: string): JidInfo | null => {
    if (!jid) return null
    
    const decoded = jidDecode(jid)
    if (!decoded) return null
    
    const isLidVal = isLidUser(jid) || isHostedLidUser(jid)
    const isPnVal = isPnUser(jid) || isHostedPnUser(jid)
    const isGroup = jid.endsWith('@g.us')
    const isNewsletter = jid.endsWith('@newsletter')
    const isHostedVal = jid.includes('@hosted') || isHostedLidUser(jid) || isHostedPnUser(jid)
    
    return {
        jid,
        user: decoded.user,
        server: decoded.server,
        device: decoded.device || 0,
        agent: 0,
        isLid: !!isLidVal,
        isPn: !!isPnVal,
        isHosted: !!isHostedVal,
        isGroup,
        isNewsletter,
        normalizedUser: jidNormalizedUser(jid)
    }
}

/**
 * Get senderPn (current session phone number) dari AuthenticationCreds
 */
export const getSenderPn = (creds: AuthenticationCreds): SenderPnInfo | null => {
    if (!creds?.me?.id) return null
    
    const decoded = jidDecode(creds.me.id)
    if (!decoded) return null
    
    const phoneNumber = decoded.user
    const phoneJid = `${phoneNumber}@s.whatsapp.net`
    
    return {
        phoneJid,
        phoneNumber,
        lid: creds.me.lid || undefined,
        deviceId: decoded.device || 0,
        pushName: creds.me.name,
        platform: creds.platform
    }
}

/**
 * Get current sender info dari authState
 * Ini function yang paling sering dipakai
 */
export const getCurrentSenderInfo = (authState: { creds: AuthenticationCreds }): SenderPnInfo | null => {
    return getSenderPn(authState.creds)
}

/**
 * Check apakah JID adalah diri sendiri (current sender)
 */
export const isSelf = (jid: string, senderPn: SenderPnInfo): boolean => {
    if (!jid || !senderPn) return false
    
    const normalizedJid = jidNormalizedUser(jid)
    const normalizedSelf = jidNormalizedUser(senderPn.phoneJid)
    
    // Check phone number match
    if (normalizedJid === normalizedSelf) return true
    
    // Check LID match if available
    if (senderPn.lid) {
        const normalizedLid = jidNormalizedUser(senderPn.lid)
        if (normalizedJid === normalizedLid) return true
    }
    
    return false
}

/**
 * Plot JID - convert antara PN dan LID
 * Ini memerlukan LIDMappingStore untuk full functionality
 */
export const plotJid = (jid: string): PlottedJid | null => {
    const info = parseJid(jid)
    if (!info) return null
    
    const result: PlottedJid = {
        original: jid,
        primary: jid,
        info
    }
    
    // Determine what type this is
    if (info.isPn) {
        result.pn = info.normalizedUser
        result.primary = info.normalizedUser
    } else if (info.isLid) {
        result.lid = info.normalizedUser
        result.primary = info.normalizedUser
    }
    
    return result
}

/**
 * Normalize berbagai format nomor ke JID yang valid
 */
export const normalizePhoneToJid = (phone: string): string => {
    // Hapus karakter non-numeric kecuali @
    let cleaned = phone.replace(/[^\d@]/g, '')
    
    // Jika sudah ada domain, return as-is setelah normalize
    if (phone.includes('@')) {
        return jidNormalizedUser(phone)
    }
    
    // Tambah domain
    return `${cleaned}@s.whatsapp.net`
}

/**
 * Extract phone number dari JID (tanpa domain)
 */
export const extractPhoneNumber = (jid: string): string | null => {
    const info = parseJid(jid)
    if (!info || !info.isPn) return null
    return info.user
}

/**
 * Buat formatted display untuk JID
 */
export const formatJidDisplay = (jid: string, options?: {
    showDevice?: boolean
    showType?: boolean
}): string => {
    const info = parseJid(jid)
    if (!info) return jid
    
    let display = info.user
    
    if (options?.showDevice && info.device > 0) {
        display += `:${info.device}`
    }
    
    if (options?.showType) {
        if (info.isLid) display += ' (LID)'
        else if (info.isGroup) display += ' (Group)'
        else if (info.isNewsletter) display += ' (Newsletter)'
        else if (info.isPn) display += ' (PN)'
    }
    
    return display
}

/**
 * Compare dua JID apakah merujuk ke user yang sama
 */
export const isSameUser = (jid1: string, jid2: string): boolean => {
    const info1 = parseJid(jid1)
    const info2 = parseJid(jid2)
    
    if (!info1 || !info2) return false
    
    // Normalize dan compare
    return info1.normalizedUser === info2.normalizedUser
}

/**
 * Get all JID variants dari satu nomor
 * Useful untuk searching across different formats
 */
export const getJidVariants = (phone: string): string[] => {
    const cleaned = phone.replace(/[^\d]/g, '')
    
    return [
        `${cleaned}@s.whatsapp.net`,
        `${cleaned}:0@s.whatsapp.net`,
        `${cleaned}@lid`,
        // Dengan device IDs
        `${cleaned}:1@s.whatsapp.net`,
        `${cleaned}:2@s.whatsapp.net`,
    ]
}

/**
 * Construct JID dengan device ID
 */
export const constructJidWithDevice = (
    user: string, 
    device: number, 
    server: string = 's.whatsapp.net'
): string => {
    if (device === 0) {
        return `${user}@${server}`
    }
    return `${user}:${device}@${server}`
}

/**
 * Helper untuk mendapatkan remoteJid yang benar dari message
 * Memperhitungkan group dan direct messages
 */
export const getRemoteJidFromMessage = (msg: {
    key: { remoteJid?: string; participant?: string }
}): { chatJid: string; senderJid: string } | null => {
    if (!msg?.key?.remoteJid) return null
    
    const chatJid = msg.key.remoteJid
    const isGroupMsg = chatJid.endsWith('@g.us')
    
    // For group messages, sender is in participant
    // For direct messages, sender is remoteJid
    const senderJid = isGroupMsg 
        ? (msg.key.participant || chatJid)
        : chatJid
    
    return { chatJid, senderJid }
}

// =====================================================
// ADVANCED PLOTTING WITH MAPPING SUPPORT
// =====================================================

/**
 * Interface untuk plotting dengan external mapping
 */
export interface JidPlotterWithMapping {
    plotToLid: (pn: string) => Promise<string | null>
    plotToPn: (lid: string) => Promise<string | null>
    plotBidirectional: (jid: string) => Promise<PlottedJid>
}

/**
 * Create plotter yang bisa resolve LID <-> PN
 * Membutuhkan getLIDForPN dan getPNForLID dari LIDMappingStore
 */
export const createJidPlotter = (
    getLIDForPN: (pn: string) => Promise<string | null>,
    getPNForLID: (lid: string) => Promise<string | null>
): JidPlotterWithMapping => {
    return {
        plotToLid: async (pn: string) => {
            return await getLIDForPN(pn)
        },
        
        plotToPn: async (lid: string) => {
            return await getPNForLID(lid)
        },
        
        plotBidirectional: async (jid: string) => {
            const info = parseJid(jid)
            if (!info) {
                return {
                    original: jid,
                    primary: jid,
                    info: parseJid(jid)!
                }
            }
            
            const result: PlottedJid = {
                original: jid,
                primary: jid,
                info
            }
            
            if (info.isPn) {
                result.pn = info.normalizedUser
                const lid = await getLIDForPN(jid)
                if (lid) result.lid = lid
                result.primary = info.normalizedUser
            } else if (info.isLid) {
                result.lid = info.normalizedUser
                const pn = await getPNForLID(jid)
                if (pn) result.pn = pn
                result.primary = result.pn || info.normalizedUser
            }
            
            return result
        }
    }
}

export default {
    parseJid,
    getSenderPn,
    getCurrentSenderInfo,
    isSelf,
    plotJid,
    normalizePhoneToJid,
    extractPhoneNumber,
    formatJidDisplay,
    isSameUser,
    getJidVariants,
    constructJidWithDevice,
    getRemoteJidFromMessage,
    createJidPlotter
}
