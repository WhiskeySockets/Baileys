/**
 * Native LRU Cache implementation to replace the `lru-cache` npm package.
 *
 * Uses a doubly-linked list + Map for O(1) get/set/delete with proper
 * LRU eviction and optional TTL expiration.  Designed as a drop-in
 * replacement for the subset of the API used in this project.
 */

export interface NativeLRUCacheOptions<V> {
	/** Maximum number of items. When omitted the cache is unbounded (only TTL evicts). */
	max?: number
	/** Default time-to-live in milliseconds. 0 = no expiry. */
	ttl?: number
	/** When true, expired entries are purged periodically (every 30 s). */
	ttlAutopurge?: boolean
	/** When true, accessing an entry via `get` resets its TTL. */
	updateAgeOnGet?: boolean
	/** Called when an entry is evicted (both LRU and TTL). Signature: (value, key) */
	dispose?: (value: V, key: string) => void
}

interface CacheNode<V> {
	key: string
	value: V
	expiry: number // 0 means no expiry
	prev: CacheNode<V> | null
	next: CacheNode<V> | null
}

export class NativeLRUCache<K extends string, V> {
	private readonly map = new Map<string, CacheNode<V>>()
	private head: CacheNode<V> | null = null // most-recently used
	private tail: CacheNode<V> | null = null // least-recently used

	private readonly maxSize: number
	private readonly ttl: number
	private readonly updateAgeOnGet: boolean
	private readonly disposeFn?: (value: V, key: string) => void
	private purgeTimer: ReturnType<typeof setInterval> | null = null

	constructor(opts: NativeLRUCacheOptions<V> = {}) {
		this.maxSize = opts.max ?? Infinity
		this.ttl = opts.ttl ?? 0
		this.updateAgeOnGet = opts.updateAgeOnGet ?? false
		this.disposeFn = opts.dispose

		if (opts.ttlAutopurge && this.ttl > 0) {
			const interval = Math.min(this.ttl, 30_000)
			this.purgeTimer = setInterval(() => this._purgeExpired(), interval)
			if (typeof this.purgeTimer === 'object' && 'unref' in this.purgeTimer) {
				this.purgeTimer.unref()
			}
		}
	}

	// ── public API ──────────────────────────────────────────────

	get size(): number {
		return this.map.size
	}

	get(key: string): V | undefined {
		const node = this.map.get(key)
		if (!node) {
			return undefined
		}

		if (this._isExpired(node)) {
			this._removeNode(node, true)
			return undefined
		}

		// Promote to head (most-recently used)
		this._moveToHead(node)

		if (this.updateAgeOnGet && this.ttl > 0) {
			node.expiry = Date.now() + this.ttl
		}

		return node.value
	}

	set(key: string, value: V): this {
		let node = this.map.get(key)
		if (node) {
			// Update existing entry
			node.value = value
			node.expiry = this.ttl > 0 ? Date.now() + this.ttl : 0
			this._moveToHead(node)
			return this
		}

		// Evict LRU entry if at capacity
		if (this.map.size >= this.maxSize) {
			this._evictLRU()
		}

		node = {
			key,
			value,
			expiry: this.ttl > 0 ? Date.now() + this.ttl : 0,
			prev: null,
			next: null
		}

		this.map.set(key, node)
		this._addToHead(node)
		return this
	}

	has(key: string): boolean {
		const node = this.map.get(key)
		if (!node) {
			return false
		}

		if (this._isExpired(node)) {
			this._removeNode(node, true)
			return false
		}

		return true
	}

	delete(key: string): boolean {
		const node = this.map.get(key)
		if (!node) {
			return false
		}

		this._removeNode(node, true)
		return true
	}

	clear(): void {
		if (this.disposeFn) {
			for (const node of this.map.values()) {
				this.disposeFn(node.value, node.key)
			}
		}

		this.map.clear()
		this.head = null
		this.tail = null
	}

	/**
	 * Release background resources (purge timer).
	 * The cache is still usable after calling destroy, but auto-purge stops.
	 */
	destroy(): void {
		if (this.purgeTimer) {
			clearInterval(this.purgeTimer)
			this.purgeTimer = null
		}
	}

	// ── linked-list helpers ─────────────────────────────────────

	private _addToHead(node: CacheNode<V>): void {
		node.prev = null
		node.next = this.head
		if (this.head) {
			this.head.prev = node
		}

		this.head = node
		if (!this.tail) {
			this.tail = node
		}
	}

	private _detach(node: CacheNode<V>): void {
		if (node.prev) {
			node.prev.next = node.next
		} else {
			this.head = node.next
		}

		if (node.next) {
			node.next.prev = node.prev
		} else {
			this.tail = node.prev
		}

		node.prev = null
		node.next = null
	}

	private _moveToHead(node: CacheNode<V>): void {
		if (node === this.head) {
			return
		}

		this._detach(node)
		this._addToHead(node)
	}

	private _removeNode(node: CacheNode<V>, notify: boolean): void {
		this._detach(node)
		this.map.delete(node.key)
		if (notify && this.disposeFn) {
			this.disposeFn(node.value, node.key)
		}
	}

	private _evictLRU(): void {
		if (this.tail) {
			this._removeNode(this.tail, true)
		}
	}

	private _isExpired(node: CacheNode<V>): boolean {
		return node.expiry !== 0 && Date.now() > node.expiry
	}

	private _purgeExpired(): void {
		for (const node of this.map.values()) {
			if (this._isExpired(node)) {
				this._removeNode(node, true)
			}
		}
	}
}
