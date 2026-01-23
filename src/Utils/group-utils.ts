/**
 * Group Utilities untuk Baileys-Joss
 * 
 * Fitur tambahan untuk group management
 * 
 * @module group-utils
 */

import type { GroupMetadata, GroupParticipant } from '../Types'

// =====================================================
// TYPES
// =====================================================

export interface GroupInfo {
    /** Group JID */
    jid: string
    /** Nama group */
    name: string
    /** Subject (sama dengan name) */
    subject: string
    /** Description */
    description?: string
    /** Owner JID */
    owner?: string
    /** Creation timestamp */
    createdAt?: number
    /** Jumlah participants */
    participantCount: number
    /** Is announcement (only admin can send) */
    isAnnouncement: boolean
    /** Is restricted (only admin can edit info) */
    isRestricted: boolean
    /** Is community */
    isCommunity: boolean
    /** Is community announcement */
    isCommunityAnnouncement: boolean
    /** Ephemeral duration */
    ephemeralDuration?: number
    /** Invite link */
    inviteCode?: string
}

export interface ParticipantInfo {
    /** JID */
    jid: string
    /** Is admin */
    isAdmin: boolean
    /** Is super admin (owner) */
    isSuperAdmin: boolean
    /** LID if available */
    lid?: string
}

export interface GroupStats {
    /** Total members */
    totalMembers: number
    /** Total admins */
    totalAdmins: number
    /** Total super admins */
    totalSuperAdmins: number
    /** Admin percentage */
    adminPercentage: number
}

// =====================================================
// PARTICIPANT UTILITIES
// =====================================================

/**
 * Get participant info dari GroupMetadata
 */
export const getParticipants = (metadata: GroupMetadata): ParticipantInfo[] => {
    return metadata.participants.map(p => ({
        jid: p.id,
        isAdmin: p.admin === 'admin' || p.admin === 'superadmin',
        isSuperAdmin: p.admin === 'superadmin',
        lid: p.lid
    }))
}

/**
 * Get only admins
 */
export const getAdmins = (metadata: GroupMetadata): ParticipantInfo[] => {
    return getParticipants(metadata).filter(p => p.isAdmin)
}

/**
 * Get only super admins (owners)
 */
export const getSuperAdmins = (metadata: GroupMetadata): ParticipantInfo[] => {
    return getParticipants(metadata).filter(p => p.isSuperAdmin)
}

/**
 * Get regular members (non-admin)
 */
export const getRegularMembers = (metadata: GroupMetadata): ParticipantInfo[] => {
    return getParticipants(metadata).filter(p => !p.isAdmin)
}

/**
 * Check apakah user adalah admin di group
 */
export const isGroupAdmin = (metadata: GroupMetadata, jid: string): boolean => {
    const participant = metadata.participants.find(p => 
        p.id === jid || p.lid === jid
    )
    return participant?.admin === 'admin' || participant?.admin === 'superadmin'
}

/**
 * Check apakah user adalah super admin (owner) di group
 */
export const isGroupSuperAdmin = (metadata: GroupMetadata, jid: string): boolean => {
    const participant = metadata.participants.find(p => 
        p.id === jid || p.lid === jid
    )
    return participant?.admin === 'superadmin'
}

/**
 * Check apakah user ada di group
 */
export const isGroupMember = (metadata: GroupMetadata, jid: string): boolean => {
    return metadata.participants.some(p => 
        p.id === jid || p.lid === jid
    )
}

// =====================================================
// GROUP INFO UTILITIES
// =====================================================

/**
 * Get formatted group info
 */
export const getGroupInfo = (metadata: GroupMetadata): GroupInfo => {
    return {
        jid: metadata.id,
        name: metadata.subject,
        subject: metadata.subject,
        description: metadata.desc || undefined,
        owner: metadata.owner || undefined,
        createdAt: metadata.creation ? metadata.creation * 1000 : undefined,
        participantCount: metadata.participants.length,
        isAnnouncement: !!metadata.announce,
        isRestricted: !!metadata.restrict,
        isCommunity: !!metadata.isCommunity,
        isCommunityAnnouncement: !!metadata.isCommunityAnnounce,
        ephemeralDuration: metadata.ephemeralDuration || undefined,
        inviteCode: metadata.inviteCode || undefined
    }
}

/**
 * Get group stats
 */
export const getGroupStats = (metadata: GroupMetadata): GroupStats => {
    const participants = getParticipants(metadata)
    const admins = participants.filter(p => p.isAdmin)
    const superAdmins = participants.filter(p => p.isSuperAdmin)
    
    return {
        totalMembers: participants.length,
        totalAdmins: admins.length,
        totalSuperAdmins: superAdmins.length,
        adminPercentage: Math.round((admins.length / participants.length) * 100)
    }
}

/**
 * Check if group is announcement only
 */
export const isAnnouncementGroup = (metadata: GroupMetadata): boolean => {
    return !!metadata.announce
}

/**
 * Check if group is restricted (only admin can edit info)
 */
export const isRestrictedGroup = (metadata: GroupMetadata): boolean => {
    return !!metadata.restrict
}

// =====================================================
// MENTION UTILITIES
// =====================================================

/**
 * Generate mention text untuk semua member
 */
export const mentionAll = (metadata: GroupMetadata): { text: string; mentions: string[] } => {
    const mentions = metadata.participants.map(p => p.id)
    const text = mentions.map(jid => `@${jid.split('@')[0]}`).join(' ')
    return { text, mentions }
}

/**
 * Generate mention text untuk admins saja
 */
export const mentionAdmins = (metadata: GroupMetadata): { text: string; mentions: string[] } => {
    const admins = getAdmins(metadata)
    const mentions = admins.map(a => a.jid)
    const text = mentions.map(jid => `@${jid.split('@')[0]}`).join(' ')
    return { text, mentions }
}

/**
 * Generate formatted participant list
 */
export const formatParticipantList = (
    metadata: GroupMetadata,
    options?: {
        showAdmin?: boolean
        showNumber?: boolean
        prefix?: string
    }
): string => {
    const opts = {
        showAdmin: true,
        showNumber: true,
        prefix: '• ',
        ...options
    }
    
    return metadata.participants
        .map((p, i) => {
            let line = opts.prefix
            if (opts.showNumber) {
                line += `${i + 1}. `
            }
            line += `${p.id.split('@')[0]}`
            if (opts.showAdmin && p.admin) {
                line += ` [${p.admin === 'superadmin' ? 'Owner' : 'Admin'}]`
            }
            return line
        })
        .join('\n')
}

// =====================================================
// BATCH OPERATIONS HELPERS
// =====================================================

/**
 * Split participants into chunks untuk batch operations
 * (WhatsApp has limit on participants per action)
 */
export const chunkParticipants = (
    participants: string[],
    chunkSize: number = 5
): string[][] => {
    const chunks: string[][] = []
    for (let i = 0; i < participants.length; i += chunkSize) {
        chunks.push(participants.slice(i, i + chunkSize))
    }
    return chunks
}

/**
 * Generate batch add/remove/promote/demote operations
 */
export const batchParticipantAction = async <T>(
    participants: string[],
    action: (jids: string[]) => Promise<T>,
    options?: {
        chunkSize?: number
        delayMs?: number
    }
): Promise<{ success: string[]; failed: string[]; results: T[] }> => {
    const opts = {
        chunkSize: 5,
        delayMs: 1000,
        ...options
    }
    
    const chunks = chunkParticipants(participants, opts.chunkSize)
    const success: string[] = []
    const failed: string[] = []
    const results: T[] = []
    
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]!
        try {
            const result = await action(chunk)
            results.push(result)
            success.push(...chunk)
        } catch (error) {
            failed.push(...chunk)
        }
        
        // Delay between chunks to avoid rate limiting
        if (i < chunks.length - 1 && opts.delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, opts.delayMs))
        }
    }
    
    return { success, failed, results }
}

// =====================================================
// VALIDATION UTILITIES
// =====================================================

/**
 * Validate group JID
 */
export const isValidGroupJid = (jid: string): boolean => {
    return jid.endsWith('@g.us')
}

/**
 * Validate community JID
 */
export const isValidCommunityJid = (jid: string): boolean => {
    return jid.endsWith('@g.us') // Communities also use @g.us
}

/**
 * Extract group ID dari JID
 */
export const extractGroupId = (jid: string): string | null => {
    if (!isValidGroupJid(jid)) return null
    return jid.split('@')[0] || null
}

export default {
    getParticipants,
    getAdmins,
    getSuperAdmins,
    getRegularMembers,
    isGroupAdmin,
    isGroupSuperAdmin,
    isGroupMember,
    getGroupInfo,
    getGroupStats,
    isAnnouncementGroup,
    isRestrictedGroup,
    mentionAll,
    mentionAdmins,
    formatParticipantList,
    chunkParticipants,
    batchParticipantAction,
    isValidGroupJid,
    isValidCommunityJid,
    extractGroupId
}
