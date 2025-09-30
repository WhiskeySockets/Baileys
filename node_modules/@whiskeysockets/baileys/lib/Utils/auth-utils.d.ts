import type { AuthenticationCreds, CacheStore, SignalKeyStore, SignalKeyStoreWithTransaction, TransactionCapabilityOptions } from '../Types/index.js';
import type { ILogger } from './logger.js';
/**
 * Adds caching capability to a SignalKeyStore
 * @param store the store to add caching to
 * @param logger to log trace events
 * @param _cache cache store to use
 */
export declare function makeCacheableSignalKeyStore(store: SignalKeyStore, logger?: ILogger, _cache?: CacheStore): SignalKeyStore;
/**
 * Adds DB like transaction capability (https://en.wikipedia.org/wiki/Database_transaction) to the SignalKeyStore,
 * this allows batch read & write operations & improves the performance of the lib
 * @param state the key store to apply this capability to
 * @param logger logger to log events
 * @returns SignalKeyStore with transaction capability
 */
export declare const addTransactionCapability: (state: SignalKeyStore, logger: ILogger, { maxCommitRetries, delayBetweenTriesMs }: TransactionCapabilityOptions) => SignalKeyStoreWithTransaction;
export declare const initAuthCreds: () => AuthenticationCreds;
//# sourceMappingURL=auth-utils.d.ts.map