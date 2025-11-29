declare module 'baileys-enhanced' {
    export interface CacheEntry {
        jid: string;
        time: number;
    }

    export interface GroupCacheEntry {
        data: EnhancedGroupMetadata;
        time: number;
    }

    export interface EnhancedParticipant {
        jid: string;
        admin: string | null;
        isAdmin: boolean;
    }

    export interface EnhancedGroupMetadata {
        id: string;
        subject: string;
        owner: string | null;
        participants: EnhancedParticipant[];
        admins: EnhancedParticipant[];
        size: number;
    }

    export interface MessageInfo {
        chat: string;
        sender: string;
        isGroup: boolean;
        id: string;
    }

    export function autoCleanJid(jid: string | null | undefined): string | null;
    export function isLidJid(jid: string | null | undefined): boolean;
    export function isValidJid(jid: string | null | undefined): boolean;
    export function autoResolveLid(conn: any, lid: string): Promise<string | null>;
    export function autoProcessJids(conn: any, jids: (string | null | undefined)[]): Promise<string[]>;
    export function getEnhancedGroupMetadata(conn: any, groupJid: string): Promise<EnhancedGroupMetadata | null>;
}
