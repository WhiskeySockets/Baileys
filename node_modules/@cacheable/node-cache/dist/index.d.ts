import { Hookified } from 'hookified';
import { Cacheable } from 'cacheable';
import { Keyv } from 'keyv';

type NodeCacheStoreOptions<T> = {
    /**
     * Time to live in milliseconds. This is a breaking change from the original NodeCache.
     */
    ttl?: number | string;
    /**
     * Maximum number of keys to store in the cache. If this is set to a value greater than 0, the cache will keep track of the number of keys and will not store more than the specified number of keys.
     */
    maxKeys?: number;
    /**
     * Primary cache store.
     */
    primary?: Keyv<T>;
    /**
     * Secondary cache store. Learn more about the secondary cache store in the cacheable documentation.
     * [storage-tiering-and-caching](https://github.com/jaredwray/cacheable/tree/main/packages/cacheable#storage-tiering-and-caching)
     */
    secondary?: Keyv<T>;
    /**
     * Enable stats tracking. This is a breaking change from the original NodeCache.
     */
    stats?: boolean;
};
declare class NodeCacheStore<T> extends Hookified {
    private _maxKeys;
    private readonly _cache;
    constructor(options?: NodeCacheStoreOptions<T>);
    /**
     * Cacheable instance.
     * @returns {Cacheable}
     * @readonly
     */
    get cache(): Cacheable;
    /**
     * Time to live in milliseconds.
     * @returns {number | string | undefined}
     * @readonly
     */
    get ttl(): number | string | undefined;
    /**
     * Time to live in milliseconds.
     * @param {number | string | undefined} ttl
     */
    set ttl(ttl: number | string | undefined);
    /**
     * Primary cache store.
     * @returns {Keyv<T>}
     * @readonly
     */
    get primary(): Keyv<T>;
    /**
     * Primary cache store.
     * @param {Keyv<T>} primary
     */
    set primary(primary: Keyv<T>);
    /**
     * Secondary cache store. Learn more about the secondary cache store in the
     * [cacheable](https://github.com/jaredwray/cacheable/tree/main/packages/cacheable#storage-tiering-and-caching) documentation.
     * @returns {Keyv<T> | undefined}
     */
    get secondary(): Keyv<T> | undefined;
    /**
     * Secondary cache store. Learn more about the secondary cache store in the
     * [cacheable](https://github.com/jaredwray/cacheable/tree/main/packages/cacheable#storage-tiering-and-caching) documentation.
     * @param {Keyv | undefined} secondary
     */
    set secondary(secondary: Keyv | undefined);
    /**
     * Maximum number of keys to store in the cache. if this is set to a value greater than 0,
     * the cache will keep track of the number of keys and will not store more than the specified number of keys.
     * @returns {number}
     * @readonly
     */
    get maxKeys(): number;
    /**
     * Maximum number of keys to store in the cache. if this is set to a value greater than 0,
     * the cache will keep track of the number of keys and will not store more than the specified number of keys.
     * @param {number} maxKeys
     */
    set maxKeys(maxKeys: number);
    /**
     * Set a key/value pair in the cache.
     * @param {string | number} key
     * @param {T} value
     * @param {number} [ttl]
     * @returns {boolean}
     */
    set(key: string | number, value: T, ttl?: number): Promise<boolean>;
    /**
     * Set multiple key/value pairs in the cache.
     * @param {PartialNodeCacheItem[]} list
     * @returns {void}
     */
    mset(list: Array<PartialNodeCacheItem<T>>): Promise<void>;
    /**
     * Get a value from the cache.
     * @param {string | number} key
     * @returns {any | undefined}
     */
    get<T>(key: string | number): Promise<T | undefined>;
    /**
     * Get multiple values from the cache.
     * @param {Array<string | number>} keys
     * @returns {Record<string, any | undefined>}
     */
    mget<T>(keys: Array<string | number>): Promise<Record<string, T | undefined>>;
    /**
     * Delete a key from the cache.
     * @param {string | number} key
     * @returns {boolean}
     */
    del(key: string | number): Promise<boolean>;
    /**
     * Delete multiple keys from the cache.
     * @param {Array<string | number>} keys
     * @returns {boolean}
     */
    mdel(keys: Array<string | number>): Promise<boolean>;
    /**
     * Clear the cache.
     * @returns {void}
     */
    clear(): Promise<void>;
    /**
     * Check if a key exists in the cache.
     * @param {string | number} key
     * @returns {boolean}
     */
    setTtl(key: string | number, ttl?: number): Promise<boolean>;
    /**
     * Check if a key exists in the cache. If it does exist it will get the value and delete the item from the cache.
     * @param {string | number} key
     * @returns {T | undefined}
     */
    take<T>(key: string | number): Promise<T | undefined>;
    /**
     * Disconnect from the cache.
     * @returns {void}
     */
    disconnect(): Promise<void>;
}

type NodeCacheOptions = {
    /**
     * The standard ttl as number in seconds for every generated cache element. 0 = unlimited, If string, it will be in shorthand format like '1h' for 1 hour
     */
    stdTTL?: number | string;
    /**
     * The interval to check for expired items in seconds. Default is 600 = 5 minutes
     */
    checkperiod?: number;
    /**
     * If set to true (Default Setting), the cache will clone the returned items via get() functions.
     * This means that every time you set a value into the cache, node-cache makes a deep clone of it.
     * When you get that value back, you receive another deep clone.
     * This mimics the behavior of an external cache like Redis or Memcached, meaning mutations to the
     * returned object do not affect the cached copy (and vice versa). If set to false, the original
     * object will be returned, and mutations will affect the cached copy.
     */
    useClones?: boolean;
    /**
     * Delete expired items during an interval check or a single item on a get request. Default is true.
     */
    deleteOnExpire?: boolean;
    /**
     * The maximum number of keys that will be stored in the cache. Default is -1 = unlimited
     * If the limit is reached, it will no longer add any new items until some expire.
     */
    maxKeys?: number;
};
type PartialNodeCacheItem<T> = {
    /**
     * The key of the item
     */
    key: string | number;
    /**
     * The value of the item
     */
    value: T;
    /**
     * The ttl of the item in seconds. 0 = unlimited
     */
    ttl?: number;
};
type NodeCacheItem<T> = PartialNodeCacheItem<T> & {
    /**
     * The ttl of the item in milliseconds. 0 = unlimited
     */
    ttl: number;
};
declare enum NodeCacheErrors {
    ECACHEFULL = "Cache max keys amount exceeded",
    EKEYTYPE = "The key argument has to be of type `string` or `number`. Found: `__key`",
    EKEYSTYPE = "The keys argument has to be an array.",
    ETTLTYPE = "The ttl argument has to be a number or a string for shorthand ttl."
}
type NodeCacheStats = {
    /**
     * The number of keys stored in the cache
     */
    keys: number;
    /**
     * The number of hits
     */
    hits: number;
    /**
     * The number of misses
     */
    misses: number;
    /**
     * The global key size count in approximately bytes
     */
    ksize: number;
    /**
     * The global value size count in approximately bytes
     */
    vsize: number;
};
declare class NodeCache<T> extends Hookified {
    readonly options: NodeCacheOptions;
    readonly store: Map<string, NodeCacheItem<T>>;
    private _stats;
    private readonly _cacheable;
    private intervalId;
    constructor(options?: NodeCacheOptions);
    /**
     * Sets a key value pair. It is possible to define a ttl (in seconds). Returns true on success.
     * @param {string | number} key - it will convert the key to a string
     * @param {T} value
     * @param {number | string} [ttl] - this is in seconds and undefined will use the default ttl
     * @returns {boolean}
     */
    set(key: string | number, value: T, ttl?: number | string): boolean;
    /**
     * Sets multiple key val pairs. It is possible to define a ttl (seconds). Returns true on success.
     * @param {PartialNodeCacheItem<T>[]} data an array of key value pairs with optional ttl
     * @returns {boolean}
     */
    mset(data: Array<PartialNodeCacheItem<T>>): boolean;
    /**
     * Gets a saved value from the cache. Returns a undefined if not found or expired. If the value was found it returns the value.
     * @param {string | number} key if the key is a number it will convert it to a string
     * @returns {T} the value or undefined
     */
    get(key: string | number): T | undefined;
    /**
     * Gets multiple saved values from the cache. Returns an empty object {} if not found or expired.
     * If the value was found it returns an object with the key value pair.
     * @param {Array<string | number} keys an array of keys
     * @returns {Record<string, T | undefined>} an object with the key as a property and the value as the value
     */
    mget<T>(keys: Array<string | number>): Record<string, T | undefined>;
    /**
     * Get the cached value and remove the key from the cache. Equivalent to calling get(key) + del(key).
     * Useful for implementing single use mechanism such as OTP, where once a value is read it will become obsolete.
     * @param {string | number} key
     * @returns {T | undefined} the value or undefined
     */
    take<T>(key: string | number): T | undefined;
    /**
     * Delete a key. Returns the number of deleted entries. A delete will never fail.
     * @param {string | number | Array<string | number>} key if the key is a number it will convert it to a string. if an array is passed it will delete all keys in the array.
     * @returns {number} if it was successful it will return the count that was deleted
     */
    del(key: string | number | Array<string | number>): number;
    /**
     * Delete all keys in Array that exist. Returns the number of deleted entries.
     * @param {Array<string | number>} keys an array of keys
     * @returns {number} the count of deleted keys
     */
    mdel(keys: Array<string | number>): number;
    /**
     * Redefine the ttl of a key. Returns true if the key has been found and changed.
     * Otherwise returns false. If the ttl-argument isn't passed the default-TTL will be used.
     * @param {string | number} key if the key is a number it will convert it to a string
     * @param {number | string} [ttl] the ttl in seconds if number, or a shorthand string like '1h' for 1 hour
     * @returns {boolean} true if the key has been found and changed. Otherwise returns false.
     */
    ttl(key: string | number, ttl?: number | string): boolean;
    /**
     * Receive the ttl of a key.
     * @param {string | number} key if the key is a number it will convert it to a string
     * @returns {number | undefined} 0 if this key has no ttl, undefined if this key is not in the cache,
     * a timestamp in ms representing the time at which this key will expire
     */
    getTtl(key: string | number): number | undefined;
    /**
     * Returns an array of all existing keys. [ "all", "my", "keys", "foo", "bar" ]
     * @returns {string[]} an array of all keys
     */
    keys(): string[];
    /**
     * Returns boolean indicating if the key is cached.
     * @param {string | number} key if the key is a number it will convert it to a string
     * @returns {boolean} true if the key is cached
     */
    has(key: string | number): boolean;
    /**
     * Gets the stats of the cache
     * @returns {NodeCacheStats} the stats of the cache
     */
    getStats(): NodeCacheStats;
    /**
     * Flush the whole data.
     * @returns {void}
     */
    flushAll(): void;
    /**
     * Flush the stats.
     * @returns {void}
     */
    flushStats(): void;
    /**
     * Close the cache. This will clear the interval timeout which is set on check period option.
     * @returns {void}
     */
    close(): void;
    /**
     * Get the interval id
     * @returns {number | NodeJS.Timeout} the interval id
     */
    getIntervalId(): number | NodeJS.Timeout;
    private formatKey;
    private getExpirationTimestamp;
    private startInterval;
    private checkData;
    private stopInterval;
    private createError;
}

export { NodeCache, NodeCacheErrors, type NodeCacheItem, type NodeCacheOptions, type NodeCacheStats, NodeCacheStore, type NodeCacheStoreOptions, type PartialNodeCacheItem, NodeCache as default };
