export declare const S_WHATSAPP_NET = "@s.whatsapp.net";
export declare const OFFICIAL_BIZ_JID = "16505361212@c.us";
export declare const SERVER_JID = "server@c.us";
export declare const PSA_WID = "0@c.us";
export declare const STORIES_JID = "status@broadcast";
export declare const META_AI_JID = "13135550002@c.us";
export type JidServer = 'c.us' | 'g.us' | 'broadcast' | 's.whatsapp.net' | 'call' | 'lid' | 'newsletter' | 'bot';
export type JidWithDevice = {
    user: string;
    device?: number;
};
export type FullJid = JidWithDevice & {
    server: JidServer;
    domainType?: number;
};
export declare const jidEncode: (user: string | number | null, server: JidServer, device?: number, agent?: number) => string;
export declare const jidDecode: (jid: string | undefined) => FullJid | undefined;
/** is the jid a user */
export declare const areJidsSameUser: (jid1: string | undefined, jid2: string | undefined) => boolean;
/** is the jid Meta AI */
export declare const isJidMetaAI: (jid: string | undefined) => boolean | undefined;
/** is the jid a PN user */
export declare const isPnUser: (jid: string | undefined) => boolean | undefined;
/** is the jid a LID */
export declare const isLidUser: (jid: string | undefined) => boolean | undefined;
/** is the jid a broadcast */
export declare const isJidBroadcast: (jid: string | undefined) => boolean | undefined;
/** is the jid a group */
export declare const isJidGroup: (jid: string | undefined) => boolean | undefined;
/** is the jid the status broadcast */
export declare const isJidStatusBroadcast: (jid: string) => jid is "status@broadcast";
/** is the jid a newsletter */
export declare const isJidNewsletter: (jid: string | undefined) => boolean | undefined;
export declare const isJidBot: (jid: string | undefined) => boolean | "" | undefined;
export declare const jidNormalizedUser: (jid: string | undefined) => string;
export declare const transferDevice: (fromJid: string, toJid: string) => string;
//# sourceMappingURL=jid-utils.d.ts.map