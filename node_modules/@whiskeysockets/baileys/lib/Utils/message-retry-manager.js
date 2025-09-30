import { LRUCache } from 'lru-cache';
/** Number of sent messages to cache in memory for handling retry receipts */
const RECENT_MESSAGES_SIZE = 512;
/** Timeout for session recreation - 1 hour */
const RECREATE_SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const PHONE_REQUEST_DELAY = 3000;
export class MessageRetryManager {
    constructor(logger, maxMsgRetryCount) {
        this.logger = logger;
        this.recentMessagesMap = new LRUCache({
            max: RECENT_MESSAGES_SIZE
        });
        this.sessionRecreateHistory = new LRUCache({
            ttl: RECREATE_SESSION_TIMEOUT * 2,
            ttlAutopurge: true
        });
        this.retryCounters = new LRUCache({
            ttl: 15 * 60 * 1000,
            ttlAutopurge: true,
            updateAgeOnGet: true
        }); // 15 minutes TTL
        this.pendingPhoneRequests = {};
        this.maxMsgRetryCount = 5;
        this.statistics = {
            totalRetries: 0,
            successfulRetries: 0,
            failedRetries: 0,
            mediaRetries: 0,
            sessionRecreations: 0,
            phoneRequests: 0
        };
        this.maxMsgRetryCount = maxMsgRetryCount;
    }
    /**
     * Add a recent message to the cache for retry handling
     */
    addRecentMessage(to, id, message) {
        const key = { to, id };
        const keyStr = this.keyToString(key);
        // Add new message
        this.recentMessagesMap.set(keyStr, {
            message,
            timestamp: Date.now()
        });
        this.logger.debug(`Added message to retry cache: ${to}/${id}`);
    }
    /**
     * Get a recent message from the cache
     */
    getRecentMessage(to, id) {
        const key = { to, id };
        const keyStr = this.keyToString(key);
        return this.recentMessagesMap.get(keyStr);
    }
    /**
     * Check if a session should be recreated based on retry count and history
     */
    shouldRecreateSession(jid, retryCount, hasSession) {
        // If we don't have a session, always recreate
        if (!hasSession) {
            this.sessionRecreateHistory.set(jid, Date.now());
            this.statistics.sessionRecreations++;
            return {
                reason: "we don't have a Signal session with them",
                recreate: true
            };
        }
        // Only consider recreation if retry count > 1
        if (retryCount < 2) {
            return { reason: '', recreate: false };
        }
        const now = Date.now();
        const prevTime = this.sessionRecreateHistory.get(jid);
        // If no previous recreation or it's been more than an hour
        if (!prevTime || now - prevTime > RECREATE_SESSION_TIMEOUT) {
            this.sessionRecreateHistory.set(jid, now);
            this.statistics.sessionRecreations++;
            return {
                reason: 'retry count > 1 and over an hour since last recreation',
                recreate: true
            };
        }
        return { reason: '', recreate: false };
    }
    /**
     * Increment retry counter for a message
     */
    incrementRetryCount(messageId) {
        this.retryCounters.set(messageId, (this.retryCounters.get(messageId) || 0) + 1);
        this.statistics.totalRetries++;
        return this.retryCounters.get(messageId);
    }
    /**
     * Get retry count for a message
     */
    getRetryCount(messageId) {
        return this.retryCounters.get(messageId) || 0;
    }
    /**
     * Check if message has exceeded maximum retry attempts
     */
    hasExceededMaxRetries(messageId) {
        return this.getRetryCount(messageId) >= this.maxMsgRetryCount;
    }
    /**
     * Mark retry as successful
     */
    markRetrySuccess(messageId) {
        this.statistics.successfulRetries++;
        // Clean up retry counter for successful message
        this.retryCounters.delete(messageId);
        this.cancelPendingPhoneRequest(messageId);
    }
    /**
     * Mark retry as failed
     */
    markRetryFailed(messageId) {
        this.statistics.failedRetries++;
        this.retryCounters.delete(messageId);
    }
    /**
     * Schedule a phone request with delay
     */
    schedulePhoneRequest(messageId, callback, delay = PHONE_REQUEST_DELAY) {
        // Cancel any existing request for this message
        this.cancelPendingPhoneRequest(messageId);
        this.pendingPhoneRequests[messageId] = setTimeout(() => {
            delete this.pendingPhoneRequests[messageId];
            this.statistics.phoneRequests++;
            callback();
        }, delay);
        this.logger.debug(`Scheduled phone request for message ${messageId} with ${delay}ms delay`);
    }
    /**
     * Cancel pending phone request
     */
    cancelPendingPhoneRequest(messageId) {
        const timeout = this.pendingPhoneRequests[messageId];
        if (timeout) {
            clearTimeout(timeout);
            delete this.pendingPhoneRequests[messageId];
            this.logger.debug(`Cancelled pending phone request for message ${messageId}`);
        }
    }
    keyToString(key) {
        return `${key.to}:${key.id}`;
    }
}
//# sourceMappingURL=message-retry-manager.js.map