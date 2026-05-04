export type CacheStore = {
	/** get a cached key and change the stats */
	get<T>(key: string): Promise<T | undefined> | T | undefined
	/** set a key in the cache */
	set<T>(key: string, value: T): Promise<void> | void | number | boolean
	/** delete a key from the cache */
	del(key: string): void | Promise<void> | number | boolean
	/** flush all data */
	flushAll(): void | Promise<void>
}

export type PossiblyExtendedCacheStore = CacheStore & {
	mget?: <T>(keys: string[]) => Promise<Record<string, T | undefined>>
	mset?: <T>(entries: { key: string; value: T }[]) => Promise<void> | void | number | boolean
	mdel?: (keys: string[]) => void | Promise<void> | number | boolean
}
