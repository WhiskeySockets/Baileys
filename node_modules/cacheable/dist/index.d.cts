import { WrapFunctionOptions, GetOrSetKey, GetOrSetFunctionOptions } from '@cacheable/memoize';
export { GetOrSetFunctionOptions, GetOrSetKey, GetOrSetOptions, WrapOptions, WrapSyncOptions, getOrSet, wrap, wrapSync } from '@cacheable/memoize';
import { Stats, CacheableItem, HashAlgorithm } from '@cacheable/utils';
export { CacheableItem, Stats as CacheableStats, HashAlgorithm, calculateTtlFromExpiration, getCascadingTtl, hash, shorthandToMilliseconds, shorthandToTime } from '@cacheable/utils';
import { Hookified } from 'hookified';
import { Keyv, KeyvStoreAdapter, StoredDataRaw } from 'keyv';
export { Keyv, KeyvHooks, KeyvOptions, KeyvStoreAdapter } from 'keyv';
export { CacheableMemory, CacheableMemoryOptions, KeyvCacheableMemory, KeyvCacheableMemoryOptions, createKeyv } from '@cacheable/memory';

type CacheableOptions = {
    /**
     * The primary store for the cacheable instance
     */
    primary?: Keyv | KeyvStoreAdapter;
    /**
     * The secondary store for the cacheable instance
     */
    secondary?: Keyv | KeyvStoreAdapter;
    /**
     * Whether to enable statistics for the cacheable instance
     */
    stats?: boolean;
    /**
     * Whether the secondary store is non-blocking mode. It is set to false by default.
     * If it is set to true then the secondary store will not block the primary store.
     */
    nonBlocking?: boolean;
    /**
     * The time-to-live for the cacheable instance and will be used as the default value.
     * can be a number in milliseconds or a human-readable format such as `1s` for 1 second or `1h` for 1 hour
     * or undefined if there is no time-to-live.
     */
    ttl?: number | string;
    /**
     * The namespace for the cacheable instance. It can be a string or a function that returns a string.
     */
    namespace?: string | (() => string);
    /**
     * The cacheId for the cacheable instance. This is primarily used for the wrap function to not have conflicts.
     * If it is not set then it will be a random string that is generated
     */
    cacheId?: string;
};
type GetOptions = {
    /**
     * If set, this will bypass the instances nonBlocking setting.
     * @type {boolean}
     */
    nonBlocking?: boolean;
};

declare enum CacheableHooks {
    BEFORE_SET = "BEFORE_SET",
    AFTER_SET = "AFTER_SET",
    BEFORE_SET_MANY = "BEFORE_SET_MANY",
    AFTER_SET_MANY = "AFTER_SET_MANY",
    BEFORE_GET = "BEFORE_GET",
    AFTER_GET = "AFTER_GET",
    BEFORE_GET_MANY = "BEFORE_GET_MANY",
    AFTER_GET_MANY = "AFTER_GET_MANY",
    BEFORE_SECONDARY_SETS_PRIMARY = "BEFORE_SECONDARY_SETS_PRIMARY"
}
declare enum CacheableEvents {
    ERROR = "error",
    CACHE_HIT = "cache:hit",
    CACHE_MISS = "cache:miss"
}

declare class Cacheable extends Hookified {
    private _primary;
    private _secondary;
    private _nonBlocking;
    private _ttl?;
    private readonly _stats;
    private _namespace?;
    private _cacheId;
    /**
     * Creates a new cacheable instance
     * @param {CacheableOptions} [options] The options for the cacheable instance
     */
    constructor(options?: CacheableOptions);
    /**
     * The namespace for the cacheable instance
     * @returns {string | (() => string) | undefined} The namespace for the cacheable instance
     */
    get namespace(): string | (() => string) | undefined;
    /**
     * Sets the namespace for the cacheable instance
     * @param {string | (() => string) | undefined} namespace The namespace for the cacheable instance
     * @returns {void}
     */
    set namespace(namespace: string | (() => string) | undefined);
    /**
     * The statistics for the cacheable instance
     * @returns {CacheableStats} The statistics for the cacheable instance
     */
    get stats(): Stats;
    /**
     * The primary store for the cacheable instance
     * @returns {Keyv} The primary store for the cacheable instance
     */
    get primary(): Keyv;
    /**
     * Sets the primary store for the cacheable instance
     * @param {Keyv} primary The primary store for the cacheable instance
     */
    set primary(primary: Keyv);
    /**
     * The secondary store for the cacheable instance
     * @returns {Keyv | undefined} The secondary store for the cacheable instance
     */
    get secondary(): Keyv | undefined;
    /**
     * Sets the secondary store for the cacheable instance. If it is set to undefined then the secondary store is disabled.
     * @param {Keyv | undefined} secondary The secondary store for the cacheable instance
     * @returns {void}
     */
    set secondary(secondary: Keyv | undefined);
    /**
     * Gets whether the secondary store is non-blocking mode. It is set to false by default.
     * If it is set to true then the secondary store will not block the primary store.
     *
     * [Learn more about non-blocking mode](https://cacheable.org/docs/cacheable/#non-blocking-operations).
     *
     * @returns {boolean} Whether the cacheable instance is non-blocking
     */
    get nonBlocking(): boolean;
    /**
     * Sets whether the secondary store is non-blocking mode. It is set to false by default.
     * If it is set to true then the secondary store will not block the primary store.
     *
     * [Learn more about non-blocking mode](https://cacheable.org/docs/cacheable/#non-blocking-operations).
     *
     * @param {boolean} nonBlocking Whether the cacheable instance is non-blocking
     * @returns {void}
     */
    set nonBlocking(nonBlocking: boolean);
    /**
     * The time-to-live for the cacheable instance and will be used as the default value.
     * can be a number in milliseconds or a human-readable format such as `1s` for 1 second or `1h` for 1 hour
     * or undefined if there is no time-to-live.
     *
     * [Learn more about time-to-live](https://cacheable.org/docs/cacheable/#shorthand-for-time-to-live-ttl).
     *
     * @returns {number | string | undefined} The time-to-live for the cacheable instance in milliseconds, human-readable format or undefined
     * @example
     * ```typescript
     * const cacheable = new Cacheable({ ttl: '1h' });
     * console.log(cacheable.ttl); // 1h
     * ```
     */
    get ttl(): number | string | undefined;
    /**
     * Sets the time-to-live for the cacheable instance and will be used as the default value.
     * If you set a number it is miliseconds, if you set a string it is a human-readable
     * format such as `1s` for 1 second or `1h` for 1 hour. Setting undefined means that
     * there is no time-to-live.
     *
     * [Learn more about time-to-live](https://cacheable.org/docs/cacheable/#shorthand-for-time-to-live-ttl).
     *
     * @param {number | string | undefined} ttl The time-to-live for the cacheable instance
     * @example
     * ```typescript
     * const cacheable = new Cacheable();
     * cacheable.ttl = '1h'; // Set the time-to-live to 1 hour
     * ```
     * or setting the time-to-live in milliseconds
     * ```typescript
     * const cacheable = new Cacheable();
     * cacheable.ttl = 3600000; // Set the time-to-live to 1 hour
     * ```
     */
    set ttl(ttl: number | string | undefined);
    /**
     * The cacheId for the cacheable instance. This is primarily used for the wrap function to not have conflicts.
     * If it is not set then it will be a random string that is generated
     * @returns {string} The cacheId for the cacheable instance
     */
    get cacheId(): string;
    /**
     * Sets the cacheId for the cacheable instance. This is primarily used for the wrap function to not have conflicts.
     * If it is not set then it will be a random string that is generated
     * @param {string} cacheId The cacheId for the cacheable instance
     */
    set cacheId(cacheId: string);
    /**
     * Sets the primary store for the cacheable instance
     * @param {Keyv | KeyvStoreAdapter} primary The primary store for the cacheable instance
     * @returns {void}
     */
    setPrimary(primary: Keyv | KeyvStoreAdapter): void;
    /**
     * Sets the secondary store for the cacheable instance. If it is set to undefined then the secondary store is disabled.
     * @param {Keyv | KeyvStoreAdapter} secondary The secondary store for the cacheable instance
     * @returns {void}
     */
    setSecondary(secondary: Keyv | KeyvStoreAdapter): void;
    isKeyvInstance(keyv: any): boolean;
    getNameSpace(): string | undefined;
    /**
     * Retrieves an entry from the cache.
     *
     * Checks the primary store first; if not found and a secondary store is configured,
     * it will fetch from the secondary, repopulate the primary, and return the result.
     *
     * @typeParam T - The expected type of the stored value.
     * @param {string} key - The cache key to retrieve.
     * @param {GetOptions} - options such as to bypass `nonBlocking` for this call
     * @returns {Promise<T | undefined>}
     *   A promise that resolves to the cached value if found, or `undefined`.
     */
    get<T>(key: string, options?: GetOptions): Promise<T | undefined>;
    /**
     * Retrieves the raw entry from the cache including metadata like expiration.
     *
     * Checks the primary store first; if not found and a secondary store is configured,
     * it will fetch from the secondary, repopulate the primary, and return the result.
     *
     * @typeParam T - The expected type of the stored value.
     * @param {string} key - The cache key to retrieve.
     * @param {GetOptions} - options such as to bypass `nonBlocking` for this call
     * @returns {Promise<StoredDataRaw<T>>}
     *   A promise that resolves to the full raw data object if found, or undefined.
     */
    getRaw<T>(key: string, options?: GetOptions): Promise<StoredDataRaw<T>>;
    /**
     * Retrieves multiple raw entries from the cache including metadata like expiration.
     *
     * Checks the primary store for each key; if a key is missing and a secondary store is configured,
     * it will fetch from the secondary store, repopulate the primary store, and return the results.
     *
     * @typeParam T - The expected type of the stored values.
     * @param {string[]} keys - The cache keys to retrieve.
     * @param {GetOptions} - options such as to bypass `nonBlocking` on this call
     * @returns {Promise<Array<StoredDataRaw<T>>>}
     *   A promise that resolves to an array of raw data objects.
     */
    getManyRaw<T>(keys: string[], options?: GetOptions): Promise<Array<StoredDataRaw<T>>>;
    /**
     * Retrieves multiple entries from the cache.
     * Checks the primary store for each key; if a key is missing and a secondary store is configured,
     * it will fetch from the secondary store, repopulate the primary store, and return the results.
     *
     * @typeParam T - The expected type of the stored values.
     * @param {string[]} keys - The cache keys to retrieve.
     * @param {GetOptions} - options such as to bypass `nonBlocking` on this call
     * @returns {Promise<Array<T | undefined>>}
     *   A promise that resolves to an array of cached values or `undefined` for misses.
     */
    getMany<T>(keys: string[], options?: GetOptions): Promise<Array<T | undefined>>;
    /**
     * Sets the value of the key. If the secondary store is set then it will also set the value in the secondary store.
     * @param {string} key the key to set the value of
     * @param {T} value The value to set
     * @param {number | string} [ttl] set a number it is miliseconds, set a string it is a human-readable
     * format such as `1s` for 1 second or `1h` for 1 hour. Setting undefined means that it will use the default time-to-live.
     * @returns {boolean} Whether the value was set
     */
    set<T>(key: string, value: T, ttl?: number | string): Promise<boolean>;
    /**
     * Sets the values of the keys. If the secondary store is set then it will also set the values in the secondary store.
     * @param {CacheableItem[]} items The items to set
     * @returns {boolean} Whether the values were set
     */
    setMany(items: CacheableItem[]): Promise<boolean>;
    /**
     * Takes the value of the key and deletes the key. If the key does not exist then it will return undefined.
     * @param {string} key The key to take the value of
     * @returns {Promise<T | undefined>} The value of the key or undefined if the key does not exist
     */
    take<T>(key: string): Promise<T | undefined>;
    /**
     * Takes the values of the keys and deletes the keys. If the key does not exist then it will return undefined.
     * @param {string[]} keys The keys to take the values of
     * @returns {Promise<Array<T | undefined>>} The values of the keys or undefined if the key does not exist
     */
    takeMany<T>(keys: string[]): Promise<Array<T | undefined>>;
    /**
     * Checks if the key exists in the primary store. If it does not exist then it will check the secondary store.
     * @param {string} key The key to check
     * @returns {Promise<boolean>} Whether the key exists
     */
    has(key: string): Promise<boolean>;
    /**
     * Checks if the keys exist in the primary store. If it does not exist then it will check the secondary store.
     * @param {string[]} keys The keys to check
     * @returns {Promise<boolean[]>} Whether the keys exist
     */
    hasMany(keys: string[]): Promise<boolean[]>;
    /**
     * Deletes the key from the primary store. If the secondary store is set then it will also delete the key from the secondary store.
     * @param {string} key The key to delete
     * @returns {Promise<boolean>} Whether the key was deleted
     */
    delete(key: string): Promise<boolean>;
    /**
     * Deletes the keys from the primary store. If the secondary store is set then it will also delete the keys from the secondary store.
     * @param {string[]} keys The keys to delete
     * @returns {Promise<boolean>} Whether the keys were deleted
     */
    deleteMany(keys: string[]): Promise<boolean>;
    /**
     * Clears the primary store. If the secondary store is set then it will also clear the secondary store.
     * @returns {Promise<void>}
     */
    clear(): Promise<void>;
    /**
     * Disconnects the primary store. If the secondary store is set then it will also disconnect the secondary store.
     * @returns {Promise<void>}
     */
    disconnect(): Promise<void>;
    /**
     * Wraps a function with caching
     *
     * [Learn more about wrapping functions](https://cacheable.org/docs/cacheable/#wrap--memoization-for-sync-and-async-functions).
     * @param {Function} function_ The function to wrap
     * @param {WrapOptions} [options] The options for the wrap function
     * @returns {Function} The wrapped function
     */
    wrap<T, Arguments extends any[]>(function_: (...arguments_: Arguments) => T, options?: WrapFunctionOptions): (...arguments_: Arguments) => T;
    /**
     * Retrieves the value associated with the given key from the cache. If the key is not found,
     * invokes the provided function to calculate the value, stores it in the cache, and then returns it.
     *
     * @param {GetOrSetKey} key - The key to retrieve or set in the cache. This can also be a function that returns a string key.
     * If a function is provided, it will be called with the cache options to generate the key.
     * @param {() => Promise<T>} function_ - The asynchronous function that computes the value to be cached if the key does not exist.
     * @param {GetOrSetFunctionOptions} [options] - Optional settings for caching, such as the time to live (TTL) or whether to cache errors.
     * @return {Promise<T | undefined>} - A promise that resolves to the cached or newly computed value, or undefined if an error occurs and caching is not configured for errors.
     */
    getOrSet<T>(key: GetOrSetKey, function_: () => Promise<T>, options?: GetOrSetFunctionOptions): Promise<T | undefined>;
    /**
     * Will hash an object using the specified algorithm. The default algorithm is 'sha256'.
     * @param {any} object the object to hash
     * @param {string} algorithm the hash algorithm to use. The default is 'sha256'
     * @returns {string} the hash of the object
     */
    hash(object: any, algorithm?: HashAlgorithm): string;
    private setManyKeyv;
    private hasManyKeyv;
    /**
     * Processes a single key from secondary store for getRaw operation
     * @param primary - the primary store to use
     * @param secondary - the secondary store to use
     * @param key - The key to retrieve from secondary store
     * @returns Promise containing the result and TTL information
     */
    private processSecondaryForGetRaw;
    /**
     * Processes a single key from secondary store for getRaw operation in non-blocking mode
     * Non-blocking mode means we don't wait for secondary operations that update primary store
     * @param primary - the primary store to use
     * @param secondary - the secondary store to use
     * @param key - The key to retrieve from secondary store
     * @returns Promise containing the result and TTL information
     */
    private processSecondaryForGetRawNonBlocking;
    /**
     * Processes missing keys from secondary store for getManyRaw operation
     * @param primary - the primary store to use
     * @param secondary - the secondary store to use
     * @param keys - The original array of keys requested
     * @param result - The result array from primary store (will be modified)
     * @returns Promise<void>
     */
    private processSecondaryForGetManyRaw;
    /**
     * Processes missing keys from secondary store for getManyRaw operation in non-blocking mode
     * Non-blocking mode means we don't wait for secondary operations that update primary store
     * @param secondary - the secondary store to use
     * @param keys - The original array of keys requested
     * @param result - The result array from primary store (will be modified)
     * @returns Promise<void>
     */
    private processSecondaryForGetManyRawNonBlocking;
    private setTtl;
}

export { Cacheable, CacheableEvents, CacheableHooks, type CacheableOptions };
