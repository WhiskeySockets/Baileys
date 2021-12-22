import type { proto } from "../../WAProto"

/** set of statuses visible to other people; see updatePresence() in WhatsAppWeb.Send */
export type WAPresence = 'unavailable' | 'available' | 'composing' | 'recording' | 'paused'

export type WAPatchName = 'critical_block' | 'critical_unblock_low' | 'regular_low' | 'regular_high' | 'regular'

export interface PresenceData {
    lastKnownPresence: WAPresence
    lastSeen?: number
}

export type ChatMutation = { syncAction: proto.ISyncActionData, index: string[], indexMac: Uint8Array, valueMac: Uint8Array, operation: number }

export type AppStateChunk = { totalMutations : ChatMutation[], collectionsToHandle: WAPatchName[] }

export type WAPatchCreate = {
    syncAction: proto.ISyncActionValue
    index: string[]
    type: WAPatchName
    apiVersion: number
    operation: proto.SyncdMutation.SyncdMutationSyncdOperation
}

export type Chat = Omit<proto.IConversation, 'messages'> & {
    /** unix timestamp of date when mute ends, if applicable */
    mute?: number | null
    /** timestamp of when pinned */
    pin?: number | null
    archive?: boolean
}
/** 
 * the last messages in a chat, sorted reverse-chronologically
 * for MD modifications, the last message in the array must be the last message recv in the chat
 * */
export type LastMessageList = Pick<proto.IWebMessageInfo, 'key' | 'messageTimestamp'>[]

export type ChatModification = 
    { 
        archive: boolean
        lastMessages: LastMessageList
    } |
    {
        pin: boolean
    } |
    {
        /** mute for duration, or provide timestamp of mute to remove*/
        mute: number | null
    } |
    {
        clear: 'all' | { messages: {id: string, fromMe?: boolean}[] }
    } |
    {
        star: { 
            messages: { id: string, fromMe?: boolean }[],
            star: boolean
        }
    } | 
    {
        markRead: boolean
        lastMessages: LastMessageList
    } |
    { delete: true, lastMessages: LastMessageList }