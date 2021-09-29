import type { proto } from "../../WAProto"

/** set of statuses visible to other people; see updatePresence() in WhatsAppWeb.Send */
export type WAPresence = 'unavailable' | 'available' | 'composing' | 'recording' | 'paused'

export type WAPatchName = 'critical_block' | 'critical_unblock_low' | 'regular_low' | 'regular_high' | 'regular'

export interface PresenceData {
    lastKnownPresence: WAPresence
    lastSeen?: number
}

export type ChatMutation = { action: proto.ISyncActionValue, index: string[], indexMac: Uint8Array, valueMac: Uint8Array, operation: number }

export type WAPatchCreate = {
    syncAction: proto.ISyncActionValue
    index: string[]
    type: WAPatchName
    apiVersion: number
}

export type Chat = Omit<proto.IConversation, 'messages'> & {
    /** unix timestamp of date when mute ends, if applicable */
    mute?: number | null
    /** timestamp of when pinned */
    pin?: number | null
    archive?: boolean
}

export type ChatModification = 
    { archive: boolean } |
    { 
        /** pin at current timestamp, or provide timestamp of pin to remove */
        pin: number | null
    } |
    {
        /** mute for duration, or provide timestamp of mute to remove*/
        mute: number | null
    } |
    {
        clear: 'all' | { message: {id: string, fromMe?: boolean} }
    } |
    {
        star: { 
            messages: { id: string, fromMe?: boolean }[],
            star: boolean
        }
    } | 
    {
        markRead: boolean
    } |
    { delete: true }