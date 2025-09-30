type CacheInstance = {
    get: (key: string) => Promise<any | undefined>;
    has: (key: string) => Promise<boolean>;
    set: (key: string, value: any, ttl?: number | string) => Promise<void>;
    on: (event: string, listener: (...args: any[]) => void) => void;
    emit: (event: string, ...args: any[]) => boolean;
};
type CacheSyncInstance = {
    get: (key: string) => any | undefined;
    has: (key: string) => boolean;
    set: (key: string, value: any, ttl?: number | string) => void;
    on: (event: string, listener: (...args: any[]) => void) => void;
    emit: (event: string, ...args: any[]) => boolean;
};
type GetOrSetKey = string | ((options?: GetOrSetOptions) => string);
type GetOrSetFunctionOptions = {
    ttl?: number | string;
    cacheErrors?: boolean;
    throwErrors?: boolean;
};
type GetOrSetOptions = GetOrSetFunctionOptions & {
    cacheId?: string;
    cache: CacheInstance;
};
type CreateWrapKey = (function_: AnyFunction, arguments_: any[], options?: WrapFunctionOptions) => string;
type WrapFunctionOptions = {
    ttl?: number | string;
    keyPrefix?: string;
    createKey?: CreateWrapKey;
    cacheErrors?: boolean;
    cacheId?: string;
    serialize?: (object: any) => string;
};
type WrapOptions = WrapFunctionOptions & {
    cache: CacheInstance;
    serialize?: (object: any) => string;
};
type WrapSyncOptions = WrapFunctionOptions & {
    cache: CacheSyncInstance;
    serialize?: (object: any) => string;
};
type AnyFunction = (...arguments_: any[]) => any;
declare function wrapSync<T>(function_: AnyFunction, options: WrapSyncOptions): AnyFunction;
declare function getOrSet<T>(key: GetOrSetKey, function_: () => Promise<T>, options: GetOrSetOptions): Promise<T | undefined>;
declare function wrap<T>(function_: AnyFunction, options: WrapOptions): AnyFunction;
type CreateWrapKeyOptions = {
    keyPrefix?: string;
    serialize?: (object: any) => string;
};
declare function createWrapKey(function_: AnyFunction, arguments_: any[], options?: CreateWrapKeyOptions): string;

export { type AnyFunction, type CacheInstance, type CacheSyncInstance, type CreateWrapKey, type CreateWrapKeyOptions, type GetOrSetFunctionOptions, type GetOrSetKey, type GetOrSetOptions, type WrapFunctionOptions, type WrapOptions, type WrapSyncOptions, createWrapKey, getOrSet, wrap, wrapSync };
