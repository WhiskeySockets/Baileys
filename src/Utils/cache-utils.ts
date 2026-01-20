/**
 * @fileoverview Sistema de cache inteligente
 * @module Utils/cache-utils
 *
 * Fornece:
 * - Cache em memória com TTL configurável
 * - Invalidação automática e manual
 * - Métricas de hit/miss
 * - Estratégia LRU (Least Recently Used)
 * - Cache distribuído (preparado para Redis)
 * - Namespace para isolamento
 * - Serialização customizável
 */

import { LRUCache } from 'lru-cache'
import { metrics } from './prometheus-metrics.js'

/**
 * Opções de configuração do cache
 */
export interface CacheOptions<V> {
	/** Tempo de vida em ms (default: 5 minutos) */
	ttl?: number
	/** Tamanho máximo do cache (default: 1000) */
	maxSize?: number
	/** Função para calcular tamanho de um item */
	sizeCalculation?: (value: V) => number
	/** Se deve atualizar TTL no acesso */
	updateAgeOnGet?: boolean
	/** Namespace para isolamento */
	namespace?: string
	/** Callback quando item expira */
	onExpire?: (key: string, value: V) => void
	/** Se deve coletar métricas */
	collectMetrics?: boolean
	/** Nome do cache para métricas */
	metricName?: string
}

/**
 * Estatísticas do cache
 */
export interface CacheStats {
	hits: number
	misses: number
	size: number
	maxSize: number
	hitRate: number
}

/**
 * Item do cache com metadados
 */
export interface CacheItem<V> {
	value: V
	createdAt: number
	expiresAt: number
	accessCount: number
	lastAccess: number
}

/**
 * Resultado de operação de cache
 */
export interface CacheResult<V> {
	value: V | undefined
	hit: boolean
	expired?: boolean
	key: string
}

/**
 * Classe principal do Cache
 */
export class Cache<V = unknown> {
	private cache: LRUCache<string, CacheItem<V>>
	private options: Required<CacheOptions<V>>
	private stats: { hits: number; misses: number }
	private namespace: string

	constructor(options: CacheOptions<V> = {}) {
		this.options = {
			ttl: options.ttl ?? 5 * 60 * 1000, // 5 minutos
			maxSize: options.maxSize ?? 1000,
			sizeCalculation: options.sizeCalculation ?? (() => 1),
			updateAgeOnGet: options.updateAgeOnGet ?? false,
			namespace: options.namespace ?? 'default',
			onExpire: options.onExpire ?? (() => {}),
			collectMetrics: options.collectMetrics ?? true,
			metricName: options.metricName ?? 'cache',
		}

		this.namespace = this.options.namespace
		this.stats = { hits: 0, misses: 0 }

		this.cache = new LRUCache<string, CacheItem<V>>({
			max: this.options.maxSize,
			ttl: this.options.ttl,
			updateAgeOnGet: this.options.updateAgeOnGet,
			sizeCalculation: (item) => this.options.sizeCalculation(item.value),
			dispose: (value, key) => {
				this.options.onExpire(key, value.value)
			},
		})
	}

	/**
	 * Obtém valor do cache
	 */
	get(key: string): V | undefined {
		const fullKey = this.getFullKey(key)
		const item = this.cache.get(fullKey)

		if (item) {
			this.stats.hits++
			item.accessCount++
			item.lastAccess = Date.now()

			if (this.options.collectMetrics) {
				metrics.cacheHits.inc({ cache: this.options.metricName })
			}

			return item.value
		}

		this.stats.misses++
		if (this.options.collectMetrics) {
			metrics.cacheMisses.inc({ cache: this.options.metricName })
		}

		return undefined
	}

	/**
	 * Obtém valor com resultado detalhado
	 */
	getWithResult(key: string): CacheResult<V> {
		const fullKey = this.getFullKey(key)
		const item = this.cache.get(fullKey)

		if (item) {
			this.stats.hits++
			item.accessCount++
			item.lastAccess = Date.now()

			if (this.options.collectMetrics) {
				metrics.cacheHits.inc({ cache: this.options.metricName })
			}

			return {
				value: item.value,
				hit: true,
				key,
			}
		}

		this.stats.misses++
		if (this.options.collectMetrics) {
			metrics.cacheMisses.inc({ cache: this.options.metricName })
		}

		return {
			value: undefined,
			hit: false,
			key,
		}
	}

	/**
	 * Define valor no cache
	 */
	set(key: string, value: V, ttl?: number): void {
		const fullKey = this.getFullKey(key)
		const now = Date.now()
		const itemTtl = ttl ?? this.options.ttl

		const item: CacheItem<V> = {
			value,
			createdAt: now,
			expiresAt: now + itemTtl,
			accessCount: 0,
			lastAccess: now,
		}

		this.cache.set(fullKey, item, { ttl: itemTtl })

		if (this.options.collectMetrics) {
			metrics.cacheSize.set({ cache: this.options.metricName }, this.cache.size)
		}
	}

	/**
	 * Verifica se chave existe
	 */
	has(key: string): boolean {
		const fullKey = this.getFullKey(key)
		return this.cache.has(fullKey)
	}

	/**
	 * Remove item do cache
	 */
	delete(key: string): boolean {
		const fullKey = this.getFullKey(key)
		const result = this.cache.delete(fullKey)

		if (this.options.collectMetrics) {
			metrics.cacheSize.set({ cache: this.options.metricName }, this.cache.size)
		}

		return result
	}

	/**
	 * Limpa todo o cache
	 */
	clear(): void {
		this.cache.clear()
		this.stats = { hits: 0, misses: 0 }

		if (this.options.collectMetrics) {
			metrics.cacheSize.set({ cache: this.options.metricName }, 0)
		}
	}

	/**
	 * Obtém ou define valor (cache-aside pattern)
	 */
	async getOrSet(key: string, factory: () => V | Promise<V>, ttl?: number): Promise<V> {
		const existing = this.get(key)
		if (existing !== undefined) {
			return existing
		}

		const value = await factory()
		this.set(key, value, ttl)
		return value
	}

	/**
	 * Obtém ou define valor síncronamente
	 */
	getOrSetSync(key: string, factory: () => V, ttl?: number): V {
		const existing = this.get(key)
		if (existing !== undefined) {
			return existing
		}

		const value = factory()
		this.set(key, value, ttl)
		return value
	}

	/**
	 * Invalida itens por padrão
	 */
	invalidateByPattern(pattern: RegExp): number {
		let count = 0
		const prefix = `${this.namespace}:`

		for (const key of this.cache.keys()) {
			const shortKey = key.startsWith(prefix) ? key.slice(prefix.length) : key
			if (pattern.test(shortKey)) {
				this.cache.delete(key)
				count++
			}
		}

		if (this.options.collectMetrics) {
			metrics.cacheSize.set({ cache: this.options.metricName }, this.cache.size)
		}

		return count
	}

	/**
	 * Invalida itens por prefixo
	 */
	invalidateByPrefix(prefix: string): number {
		return this.invalidateByPattern(new RegExp(`^${prefix}`))
	}

	/**
	 * Retorna estatísticas do cache
	 */
	getStats(): CacheStats {
		const total = this.stats.hits + this.stats.misses
		return {
			hits: this.stats.hits,
			misses: this.stats.misses,
			size: this.cache.size,
			maxSize: this.options.maxSize,
			hitRate: total > 0 ? this.stats.hits / total : 0,
		}
	}

	/**
	 * Retorna tamanho atual
	 */
	get size(): number {
		return this.cache.size
	}

	/**
	 * Retorna todas as chaves
	 */
	keys(): string[] {
		const prefix = `${this.namespace}:`
		return Array.from(this.cache.keys()).map((k) => (k.startsWith(prefix) ? k.slice(prefix.length) : k))
	}

	/**
	 * Retorna todos os valores
	 */
	values(): V[] {
		return Array.from(this.cache.values()).map((item) => item.value)
	}

	/**
	 * Retorna todos os itens com metadados
	 */
	entries(): Array<{ key: string; item: CacheItem<V> }> {
		const prefix = `${this.namespace}:`
		return Array.from(this.cache.entries()).map(([key, item]) => ({
			key: key.startsWith(prefix) ? key.slice(prefix.length) : key,
			item,
		}))
	}

	/**
	 * Atualiza TTL de um item
	 */
	touch(key: string, ttl?: number): boolean {
		const fullKey = this.getFullKey(key)
		const item = this.cache.get(fullKey)

		if (!item) {
			return false
		}

		const newTtl = ttl ?? this.options.ttl
		item.expiresAt = Date.now() + newTtl
		this.cache.set(fullKey, item, { ttl: newTtl })
		return true
	}

	/**
	 * Obtém item expirado (se ainda em memória)
	 */
	peek(key: string): V | undefined {
		const fullKey = this.getFullKey(key)
		const item = this.cache.peek(fullKey)
		return item?.value
	}

	private getFullKey(key: string): string {
		return `${this.namespace}:${key}`
	}
}

/**
 * Factory para criar cache com tipo
 */
export function createCache<V>(options?: CacheOptions<V>): Cache<V> {
	return new Cache<V>(options)
}

/**
 * Cache com múltiplos níveis (L1: memória, L2: externo)
 */
export class MultiLevelCache<V> {
	private l1: Cache<V>
	private l2?: {
		get: (key: string) => Promise<V | undefined>
		set: (key: string, value: V, ttl?: number) => Promise<void>
		delete: (key: string) => Promise<boolean>
	}

	constructor(
		l1Options: CacheOptions<V>,
		l2?: {
			get: (key: string) => Promise<V | undefined>
			set: (key: string, value: V, ttl?: number) => Promise<void>
			delete: (key: string) => Promise<boolean>
		}
	) {
		this.l1 = new Cache<V>(l1Options)
		this.l2 = l2
	}

	async get(key: string): Promise<V | undefined> {
		// Tentar L1 primeiro
		const l1Value = this.l1.get(key)
		if (l1Value !== undefined) {
			return l1Value
		}

		// Tentar L2 se disponível
		if (this.l2) {
			const l2Value = await this.l2.get(key)
			if (l2Value !== undefined) {
				// Promover para L1
				this.l1.set(key, l2Value)
				return l2Value
			}
		}

		return undefined
	}

	async set(key: string, value: V, ttl?: number): Promise<void> {
		this.l1.set(key, value, ttl)

		if (this.l2) {
			await this.l2.set(key, value, ttl)
		}
	}

	async delete(key: string): Promise<boolean> {
		const l1Result = this.l1.delete(key)
		let l2Result = false

		if (this.l2) {
			l2Result = await this.l2.delete(key)
		}

		return l1Result || l2Result
	}

	getL1(): Cache<V> {
		return this.l1
	}
}

/**
 * Decorator para cachear resultado de método
 */
export function cached<V>(options: CacheOptions<V> & { keyGenerator?: (...args: unknown[]) => string } = {}) {
	const cache = new Cache<V>(options)
	const keyGenerator = options.keyGenerator ?? ((...args) => JSON.stringify(args))

	return function (
		_target: unknown,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(...args: unknown[]) => V | Promise<V>>
	) {
		const originalMethod = descriptor.value
		if (!originalMethod) return descriptor

		descriptor.value = async function (...args: unknown[]): Promise<V> {
			const key = `${propertyKey}:${keyGenerator(...args)}`

			const cachedValue = cache.get(key)
			if (cachedValue !== undefined) {
				return cachedValue
			}

			const result = await originalMethod.apply(this, args)
			cache.set(key, result)
			return result
		}

		return descriptor
	}
}

/**
 * Wrapper para função com cache
 */
export function withCache<T extends (...args: unknown[]) => unknown>(
	fn: T,
	options: CacheOptions<ReturnType<T>> & { keyGenerator?: (...args: Parameters<T>) => string } = {}
): T {
	const cache = new Cache<ReturnType<T>>(options)
	const keyGenerator = options.keyGenerator ?? ((...args) => JSON.stringify(args))

	return ((...args: Parameters<T>): ReturnType<T> => {
		const key = keyGenerator(...args)

		const cachedValue = cache.get(key)
		if (cachedValue !== undefined) {
			return cachedValue as ReturnType<T>
		}

		const result = fn(...args) as ReturnType<T>

		if (result instanceof Promise) {
			return result.then((value) => {
				cache.set(key, value as ReturnType<T>)
				return value
			}) as ReturnType<T>
		}

		cache.set(key, result)
		return result
	}) as T
}

/**
 * Cache global singleton por namespace
 */
const globalCaches: Map<string, Cache<unknown>> = new Map()

export function getGlobalCache<V>(namespace: string, options?: CacheOptions<V>): Cache<V> {
	if (!globalCaches.has(namespace)) {
		globalCaches.set(namespace, new Cache<V>({ ...options, namespace }))
	}
	return globalCaches.get(namespace) as Cache<V>
}

export function clearGlobalCaches(): void {
	for (const cache of globalCaches.values()) {
		cache.clear()
	}
	globalCaches.clear()
}

export default Cache
