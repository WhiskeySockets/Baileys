export type WACallUpdateType = 'offer' | 'ringing' | 'timeout' | 'reject' | 'accept' | 'terminate';
export type WACallEvent = {
    chatId: string;
    from: string;
    isGroup?: boolean;
    groupJid?: string;
    id: string;
    date: Date;
    isVideo?: boolean;
    status: WACallUpdateType;
    offline: boolean;
    latencyMs?: number;
};
