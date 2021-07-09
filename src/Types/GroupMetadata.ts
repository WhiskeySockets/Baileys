import { Contact } from "./Contact";

export type GroupParticipant = (Contact & { isAdmin: boolean; isSuperAdmin: boolean })

export type ParticipantAction = 'add' | 'remove' | 'promote' | 'demote'

export interface GroupMetadata {
    id: string
    owner: string
    subject: string
    creation: number
    desc?: string
    descOwner?: string
    descId?: string
    /** is set when the group only allows admins to change group settings */
    restrict?: 'true' | 'false' 
    /** is set when the group only allows admins to write messages */
    announce?: 'true' | 'false' 
    // Baileys modified array
    participants: GroupParticipant[]
}


export interface WAGroupCreateResponse {
    status: number
    gid?: string
    participants?: [{ [key: string]: any }]
}

export interface GroupModificationResponse {
    status: number
    participants?: { [key: string]: any }
}