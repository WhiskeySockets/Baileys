import { Boom } from '@hapi/boom';
export var SyncState;
(function (SyncState) {
    /** The socket is connecting, but we haven't received pending notifications yet. */
    SyncState[SyncState["Connecting"] = 0] = "Connecting";
    /** Pending notifications received. Buffering events until we decide whether to sync or not. */
    SyncState[SyncState["AwaitingInitialSync"] = 1] = "AwaitingInitialSync";
    /** The initial app state sync (history, etc.) is in progress. Buffering continues. */
    SyncState[SyncState["Syncing"] = 2] = "Syncing";
    /** Initial sync is complete, or was skipped. The socket is fully operational and events are processed in real-time. */
    SyncState[SyncState["Online"] = 3] = "Online";
})(SyncState || (SyncState = {}));
//# sourceMappingURL=State.js.map