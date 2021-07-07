import type KeyedDB from "@adiwajshing/keyed-db";
import type { proto } from '../../WAMessage/WAMessage'
import type { GroupMetadata } from "./GroupMetadata";

/** set of statuses visible to other people; see updatePresence() in WhatsAppWeb.Send */
export enum Presence {
    unavailable = 'unavailable', // "offline"
    available = 'available', // "online"
    composing = 'composing', // "typing..."
    recording = 'recording', // "recording..."
    paused = 'paused', // stop typing
}

export interface PresenceData {
    lastKnownPresence?: Presence
    lastSeen?: number
    name?: string
}

export interface Chat {
    jid: string

    t: number
    /** number of unread messages, is < 0 if the chat is manually marked unread */
    count: number
    archive?: 'true' | 'false'
    clear?: 'true' | 'false'
    read_only?: 'true' | 'false'
    mute?: string
    pin?: string
    spam?: 'false' | 'true'
    modify_tag?: string
    name?: string
    /** when ephemeral messages were toggled on */
    eph_setting_ts?: string
    /** how long each message lasts for */
    ephemeral?: string
    
    // Baileys added properties
    messages: KeyedDB<proto.IWebMessageInfo, string>
    imgUrl?: string
    presences?: { [k: string]: PresenceData }
    metadata?: GroupMetadata
}