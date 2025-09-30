import type { proto } from '../../WAProto/index.js';
import type { ILogger } from './logger.js';
export interface RecentMessageKey {
    to: string;
    id: string;
}
export interface RecentMessage {
    message: proto.IMessage;
    timestamp: number;
}
export interface SessionRecreateHistory {
    [jid: string]: number;
}
export interface RetryCounter {
    [messageId: string]: number;
}
export interface PendingPhoneRequest {
    [messageId: string]: NodeJS.Timeout;
}
export interface RetryStatistics {
    totalRetries: number;
    successfulRetries: number;
    failedRetries: number;
    mediaRetries: number;
    sessionRecreations: number;
    phoneRequests: number;
}
export declare class MessageRetryManager {
    private logger;
    private recentMessagesMap;
    private sessionRecreateHistory;
    private retryCounters;
    private pendingPhoneRequests;
    private readonly maxMsgRetryCount;
    private statistics;
    constructor(logger: ILogger, maxMsgRetryCount: number);
    /**
     * Add a recent message to the cache for retry handling
     */
    addRecentMessage(to: string, id: string, message: proto.IMessage): void;
    /**
     * Get a recent message from the cache
     */
    getRecentMessage(to: string, id: string): RecentMessage | undefined;
    /**
     * Check if a session should be recreated based on retry count and history
     */
    shouldRecreateSession(jid: string, retryCount: number, hasSession: boolean): {
        reason: string;
        recreate: boolean;
    };
    /**
     * Increment retry counter for a message
     */
    incrementRetryCount(messageId: string): number;
    /**
     * Get retry count for a message
     */
    getRetryCount(messageId: string): number;
    /**
     * Check if message has exceeded maximum retry attempts
     */
    hasExceededMaxRetries(messageId: string): boolean;
    /**
     * Mark retry as successful
     */
    markRetrySuccess(messageId: string): void;
    /**
     * Mark retry as failed
     */
    markRetryFailed(messageId: string): void;
    /**
     * Schedule a phone request with delay
     */
    schedulePhoneRequest(messageId: string, callback: () => void, delay?: number): void;
    /**
     * Cancel pending phone request
     */
    cancelPendingPhoneRequest(messageId: string): void;
    private keyToString;
}
//# sourceMappingURL=message-retry-manager.d.ts.map