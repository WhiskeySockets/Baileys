import type { Boom } from '@hapi/boom';
import { proto } from '../../WAProto/index.js';
import type { AuthenticationCreds } from './Auth.js';
import type { WACallEvent } from './Call.js';
import type { Chat, ChatUpdate, PresenceData } from './Chat.js';
import type { Contact } from './Contact.js';
import type { GroupMetadata, ParticipantAction, RequestJoinAction, RequestJoinMethod } from './GroupMetadata.js';
import type { Label } from './Label.js';
import type { LabelAssociation } from './LabelAssociation.js';
import type { MessageUpsertType, MessageUserReceiptUpdate, WAMessage, WAMessageKey, WAMessageUpdate } from './Message.js';
import type { ConnectionState } from './State.js';
export type BaileysEventMap = {
    /** connection state has been updated -- WS closed, opened, connecting etc. */
    'connection.update': Partial<ConnectionState>;
    /** credentials updated -- some metadata, keys or something */
    'creds.update': Partial<AuthenticationCreds>;
    /** set chats (history sync), everything is reverse chronologically sorted */
    'messaging-history.set': {
        chats: Chat[];
        contacts: Contact[];
        messages: WAMessage[];
        isLatest?: boolean;
        progress?: number | null;
        syncType?: proto.HistorySync.HistorySyncType;
        peerDataRequestSessionId?: string | null;
    };
    /** upsert chats */
    'chats.upsert': Chat[];
    /** update the given chats */
    'chats.update': ChatUpdate[];
    'lid-mapping.update': {
        lid: string;
        pn: string;
    };
    /** delete chats with given ID */
    'chats.delete': string[];
    /** presence of contact in a chat updated */
    'presence.update': {
        id: string;
        presences: {
            [participant: string]: PresenceData;
        };
    };
    'contacts.upsert': Contact[];
    'contacts.update': Partial<Contact>[];
    'messages.delete': {
        keys: WAMessageKey[];
    } | {
        jid: string;
        all: true;
    };
    'messages.update': WAMessageUpdate[];
    'messages.media-update': {
        key: WAMessageKey;
        media?: {
            ciphertext: Uint8Array;
            iv: Uint8Array;
        };
        error?: Boom;
    }[];
    /**
     * add/update the given messages. If they were received while the connection was online,
     * the update will have type: "notify"
     * if requestId is provided, then the messages was received from the phone due to it being unavailable
     *  */
    'messages.upsert': {
        messages: WAMessage[];
        type: MessageUpsertType;
        requestId?: string;
    };
    /** message was reacted to. If reaction was removed -- then "reaction.text" will be falsey */
    'messages.reaction': {
        key: WAMessageKey;
        reaction: proto.IReaction;
    }[];
    'message-receipt.update': MessageUserReceiptUpdate[];
    'groups.upsert': GroupMetadata[];
    'groups.update': Partial<GroupMetadata>[];
    /** apply an action to participants in a group */
    'group-participants.update': {
        id: string;
        author: string;
        participants: string[];
        action: ParticipantAction;
    };
    'group.join-request': {
        id: string;
        author: string;
        participant: string;
        action: RequestJoinAction;
        method: RequestJoinMethod;
    };
    'blocklist.set': {
        blocklist: string[];
    };
    'blocklist.update': {
        blocklist: string[];
        type: 'add' | 'remove';
    };
    /** Receive an update on a call, including when the call was received, rejected, accepted */
    call: WACallEvent[];
    'labels.edit': Label;
    'labels.association': {
        association: LabelAssociation;
        type: 'add' | 'remove';
    };
    /** Newsletter-related events */
    'newsletter.reaction': {
        id: string;
        server_id: string;
        reaction: {
            code?: string;
            count?: number;
            removed?: boolean;
        };
    };
    'newsletter.view': {
        id: string;
        server_id: string;
        count: number;
    };
    'newsletter-participants.update': {
        id: string;
        author: string;
        user: string;
        new_role: string;
        action: string;
    };
    'newsletter-settings.update': {
        id: string;
        update: any;
    };
};
export type BufferedEventData = {
    historySets: {
        chats: {
            [jid: string]: Chat;
        };
        contacts: {
            [jid: string]: Contact;
        };
        messages: {
            [uqId: string]: WAMessage;
        };
        empty: boolean;
        isLatest: boolean;
        progress?: number | null;
        syncType?: proto.HistorySync.HistorySyncType;
        peerDataRequestSessionId?: string;
    };
    chatUpserts: {
        [jid: string]: Chat;
    };
    chatUpdates: {
        [jid: string]: ChatUpdate;
    };
    chatDeletes: Set<string>;
    contactUpserts: {
        [jid: string]: Contact;
    };
    contactUpdates: {
        [jid: string]: Partial<Contact>;
    };
    messageUpserts: {
        [key: string]: {
            type: MessageUpsertType;
            message: WAMessage;
        };
    };
    messageUpdates: {
        [key: string]: WAMessageUpdate;
    };
    messageDeletes: {
        [key: string]: WAMessageKey;
    };
    messageReactions: {
        [key: string]: {
            key: WAMessageKey;
            reactions: proto.IReaction[];
        };
    };
    messageReceipts: {
        [key: string]: {
            key: WAMessageKey;
            userReceipt: proto.IUserReceipt[];
        };
    };
    groupUpdates: {
        [jid: string]: Partial<GroupMetadata>;
    };
};
export type BaileysEvent = keyof BaileysEventMap;
export interface BaileysEventEmitter {
    on<T extends keyof BaileysEventMap>(event: T, listener: (arg: BaileysEventMap[T]) => void): void;
    off<T extends keyof BaileysEventMap>(event: T, listener: (arg: BaileysEventMap[T]) => void): void;
    removeAllListeners<T extends keyof BaileysEventMap>(event: T): void;
    emit<T extends keyof BaileysEventMap>(event: T, arg: BaileysEventMap[T]): boolean;
}
//# sourceMappingURL=Events.d.ts.map