import { Boom } from '@hapi/boom';
import type { Contact } from './Contact.js';
export declare enum SyncState {
    /** The socket is connecting, but we haven't received pending notifications yet. */
    Connecting = 0,
    /** Pending notifications received. Buffering events until we decide whether to sync or not. */
    AwaitingInitialSync = 1,
    /** The initial app state sync (history, etc.) is in progress. Buffering continues. */
    Syncing = 2,
    /** Initial sync is complete, or was skipped. The socket is fully operational and events are processed in real-time. */
    Online = 3
}
export type WAConnectionState = 'open' | 'connecting' | 'close';
export type ConnectionState = {
    /** connection is now open, connecting or closed */
    connection: WAConnectionState;
    /** the error that caused the connection to close */
    lastDisconnect?: {
        error: Boom | Error | undefined;
        date: Date;
    };
    /** is this a new login */
    isNewLogin?: boolean;
    /** the current QR code */
    qr?: string;
    /** has the device received all pending notifications while it was offline */
    receivedPendingNotifications?: boolean;
    /** legacy connection options */
    legacy?: {
        phoneConnected: boolean;
        user?: Contact;
    };
    /**
     * if the client is shown as an active, online client.
     * If this is false, the primary phone and other devices will receive notifs
     * */
    isOnline?: boolean;
};
//# sourceMappingURL=State.d.ts.map