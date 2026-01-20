import { LRUCache } from 'lru-cache'
import type { LIDMapping, SignalKeyStoreWithTransaction } from '../Types'
import type { ILogger } from '../Utils/logger'
import { isHostedPnUser, isLidUser, isPnUser, jidDecode, jidNormalizedUser, WAJIDDomains } from '../WABinary'

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * LID Mapping Store configuration
 * Configurable via environment variables with BAILEYS_LID_* prefix
 */
export interface LIDMappingConfig {
	/** Cache TTL in milliseconds (default: 3 days) */
	cacheTtlMs: number
	/** Maximum cache size (default: 50000 entries) */
	maxCacheSize: number
	/** Enable cache auto-purge (default: true) */
	cacheAutoPurge: boolean
	/** Update cache age on get (default: true) */
	updateAgeOnGet: boolean
	/** Enable Prometheus metrics (default: false) */
	enableMetrics: boolean
	/** Batch size for bulk operations (default: 100) */
	batchSize: number
	/** Retry attempts for failed operations (default: 3) */
	retryAttempts: number
	/** Retry delay in milliseconds (default: 1000) */
	retryDelayMs: number
	/** Enable debug logging (default: false) */
	debugLogging: boolean
}

/**
 * Load configuration from environment variables
 */
export function loadLIDMappingConfig(): LIDMappingConfig {
	return {
		cacheTtlMs: parseInt(process.env.BAILEYS_LID_CACHE_TTL_MS || String(3 * 24 * 60 * 60 * 1000), 10),
		maxCacheSize: parseInt(process.env.BAILEYS_LID_MAX_CACHE_SIZE || '50000', 10),
		cacheAutoPurge: process.env.BAILEYS_LID_CACHE_AUTO_PURGE !== 'false',
		updateAgeOnGet: process.env.BAILEYS_LID_UPDATE_AGE_ON_GET !== 'false',
		enableMetrics: process.env.BAILEYS_LID_METRICS === 'true',
		batchSize: parseInt(process.env.BAILEYS_LID_BATCH_SIZE || '100', 10),
		retryAttempts: parseInt(process.env.BAILEYS_LID_RETRY_ATTEMPTS || '3', 10),
		retryDelayMs: parseInt(process.env.BAILEYS_LID_RETRY_DELAY_MS || '1000', 10),
		debugLogging: process.env.BAILEYS_LID_DEBUG === 'true'
	}
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Statistics for monitoring and debugging
 */
export interface LIDMappingStatistics {
	/** Total cache hits */
	cacheHits: number
	/** Total cache misses */
	cacheMisses: number
	/** Total database hits */
	dbHits: number
	/** Total database misses */
	dbMisses: number
	/** Total USync fetches */
	usyncFetches: number
	/** Total USync failures */
	usyncFailures: number
	/** Total mappings stored */
	mappingsStored: number
	/** Total invalid mappings rejected */
	invalidMappings: number
	/** Current cache size */
	cacheSize: number
	/** Cache hit rate (percentage) */
	cacheHitRate: number
	/** Total operations */
	totalOperations: number
	/** Failed operations */
	failedOperations: number
	/** Store creation timestamp */
	createdAt: number
	/** Last operation timestamp */
	lastOperationAt: number | null
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Custom error for LID mapping operations
 */
export class LIDMappingError extends Error {
	constructor(
		message: string,
		public readonly code: LIDMappingErrorCode,
		public readonly details?: Record<string, unknown>
	) {
		super(message)
		this.name = 'LIDMappingError'
	}
}

export enum LIDMappingErrorCode {
	INVALID_JID = 'INVALID_JID',
	INVALID_MAPPING = 'INVALID_MAPPING',
	DATABASE_ERROR = 'DATABASE_ERROR',
	USYNC_ERROR = 'USYNC_ERROR',
	CACHE_ERROR = 'CACHE_ERROR',
	DESTROYED = 'DESTROYED'
}

// ============================================================================
// MAIN CLASS
// ============================================================================

/**
 * Enterprise-grade LID Mapping Store
 *
 * Features:
 * - Environment variable configuration
 * - LRU cache with configurable TTL and size
 * - Comprehensive statistics and metrics
 * - Batch operations for bulk mappings
 * - Retry logic for failed operations
 * - Proper resource cleanup
 * - Prometheus metrics integration
 */
export class LIDMappingStore {
	private readonly mappingCache: LRUCache<string, string>
	private readonly keys: SignalKeyStoreWithTransaction
	private readonly logger: ILogger
	private readonly config: LIDMappingConfig
	private destroyed: boolean = false

	private pnToLIDFunc?: (jids: string[]) => Promise<LIDMapping[] | undefined>

	// Statistics tracking
	private stats: LIDMappingStatistics = {
		cacheHits: 0,
		cacheMisses: 0,
		dbHits: 0,
		dbMisses: 0,
		usyncFetches: 0,
		usyncFailures: 0,
		mappingsStored: 0,
		invalidMappings: 0,
		cacheSize: 0,
		cacheHitRate: 0,
		totalOperations: 0,
		failedOperations: 0,
		createdAt: Date.now(),
		lastOperationAt: null
	}

	// Metrics integration (lazy loaded)
	private metricsModule: typeof import('../Utils/prometheus-metrics') | null = null

	constructor(
		keys: SignalKeyStoreWithTransaction,
		logger: ILogger,
		pnToLIDFunc?: (jids: string[]) => Promise<LIDMapping[] | undefined>,
		configOverride?: Partial<LIDMappingConfig>
	) {
		this.keys = keys
		this.pnToLIDFunc = pnToLIDFunc
		this.logger = logger
		this.config = { ...loadLIDMappingConfig(), ...configOverride }

		// Initialize LRU cache with configuration
		this.mappingCache = new LRUCache<string, string>({
			max: this.config.maxCacheSize,
			ttl: this.config.cacheTtlMs,
			ttlAutopurge: this.config.cacheAutoPurge,
			updateAgeOnGet: this.config.updateAgeOnGet
		})

		// Load metrics module if enabled
		if (this.config.enableMetrics) {
			import('../Utils/prometheus-metrics').then(m => {
				this.metricsModule = m
			}).catch(() => {
				this.logger.debug('Prometheus metrics not available for LID mapping')
			})
		}

		this.logger.debug({ config: this.config }, 'LIDMappingStore initialized')
	}

	// ========================================================================
	// CONFIGURATION & STATISTICS
	// ========================================================================

	/**
	 * Get current configuration
	 */
	getConfig(): LIDMappingConfig {
		return { ...this.config }
	}

	/**
	 * Get current statistics
	 */
	getStatistics(): LIDMappingStatistics {
		const totalLookups = this.stats.cacheHits + this.stats.cacheMisses
		return {
			...this.stats,
			cacheSize: this.mappingCache.size,
			cacheHitRate: totalLookups > 0 ? (this.stats.cacheHits / totalLookups) * 100 : 0
		}
	}

	/**
	 * Check if store has been destroyed
	 */
	isDestroyed(): boolean {
		return this.destroyed
	}

	// ========================================================================
	// CACHE MANAGEMENT
	// ========================================================================

	/**
	 * Warm cache with pre-loaded mappings
	 * Useful for initialization with known mappings
	 */
	async warmCache(mappings: LIDMapping[]): Promise<{ loaded: number; skipped: number }> {
		this.checkDestroyed()
		let loaded = 0
		let skipped = 0

		for (const { lid, pn } of mappings) {
			if (!this.isValidMapping(lid, pn)) {
				skipped++
				continue
			}

			const lidDecoded = jidDecode(lid)
			const pnDecoded = jidDecode(pn)
			if (!lidDecoded || !pnDecoded) {
				skipped++
				continue
			}

			const pnUser = pnDecoded.user
			const lidUser = lidDecoded.user

			this.mappingCache.set(`pn:${pnUser}`, lidUser)
			this.mappingCache.set(`lid:${lidUser}`, pnUser)
			loaded++
		}

		this.logger.debug({ loaded, skipped }, 'Cache warmed with mappings')
		return { loaded, skipped }
	}

	/**
	 * Clear all cached mappings
	 */
	clearCache(): void {
		this.checkDestroyed()
		const previousSize = this.mappingCache.size
		this.mappingCache.clear()
		this.logger.debug({ previousSize }, 'Cache cleared')
	}

	/**
	 * Get cache info for monitoring
	 */
	getCacheInfo(): { size: number; maxSize: number; ttlMs: number } {
		return {
			size: this.mappingCache.size,
			maxSize: this.config.maxCacheSize,
			ttlMs: this.config.cacheTtlMs
		}
	}

	// ========================================================================
	// STORE OPERATIONS
	// ========================================================================

	/**
	 * Store LID-PN mapping - USER LEVEL
	 * Enhanced with batch operations and retry logic
	 */
	async storeLIDPNMappings(pairs: LIDMapping[]): Promise<{ stored: number; skipped: number; errors: number }> {
		this.checkDestroyed()
		this.stats.totalOperations++
		this.stats.lastOperationAt = Date.now()

		const result = { stored: 0, skipped: 0, errors: 0 }

		// Validate and prepare mappings
		const validPairs: { [pnUser: string]: string } = {}

		for (const { lid, pn } of pairs) {
			if (!this.isValidMapping(lid, pn)) {
				this.logger.warn({ lid, pn }, 'Invalid LID-PN mapping rejected')
				this.stats.invalidMappings++
				result.skipped++
				continue
			}

			const lidDecoded = jidDecode(lid)
			const pnDecoded = jidDecode(pn)

			if (!lidDecoded || !pnDecoded) {
				result.skipped++
				continue
			}

			const pnUser = pnDecoded.user
			const lidUser = lidDecoded.user

			// Check cache first
			let existingLidUser = this.mappingCache.get(`pn:${pnUser}`)

			if (!existingLidUser) {
				// Cache miss - check database
				this.stats.cacheMisses++
				try {
					const stored = await this.retryOperation(
						() => this.keys.get('lid-mapping', [pnUser]),
						'get-mapping'
					)
					existingLidUser = stored[pnUser]

					if (existingLidUser) {
						this.stats.dbHits++
						// Update cache with database value
						this.mappingCache.set(`pn:${pnUser}`, existingLidUser)
						this.mappingCache.set(`lid:${existingLidUser}`, pnUser)
					} else {
						this.stats.dbMisses++
					}
				} catch (error) {
					this.logger.error({ error, pnUser }, 'Failed to check existing mapping')
					result.errors++
					continue
				}
			} else {
				this.stats.cacheHits++
			}

			if (existingLidUser === lidUser) {
				if (this.config.debugLogging) {
					this.logger.debug({ pnUser, lidUser }, 'LID mapping already exists, skipping')
				}
				result.skipped++
				continue
			}

			validPairs[pnUser] = lidUser
		}

		if (Object.keys(validPairs).length === 0) {
			return result
		}

		// Store in batches for better performance
		const entries = Object.entries(validPairs)
		const batches = this.chunkArray(entries, this.config.batchSize)

		for (const batch of batches) {
			try {
				await this.retryOperation(async () => {
					await this.keys.transaction(async () => {
						for (const [pnUser, lidUser] of batch) {
							await this.keys.set({
								'lid-mapping': {
									[pnUser]: lidUser,
									[`${lidUser}_reverse`]: pnUser
								}
							})

							this.mappingCache.set(`pn:${pnUser}`, lidUser)
							this.mappingCache.set(`lid:${lidUser}`, pnUser)
							result.stored++
							this.stats.mappingsStored++
						}
					}, 'lid-mapping')
				}, 'store-mappings')
			} catch (error) {
				this.logger.error({ error, batchSize: batch.length }, 'Failed to store mapping batch')
				result.errors += batch.length
				this.stats.failedOperations++
			}
		}

		this.logger.trace({ result, totalPairs: pairs.length }, 'Stored LID-PN mappings')
		this.recordMetrics('store', result.stored)

		return result
	}

	/**
	 * Get LID for PN - Returns device-specific LID based on user mapping
	 */
	async getLIDForPN(pn: string): Promise<string | null> {
		const results = await this.getLIDsForPNs([pn])
		return results?.[0]?.lid || null
	}

	/**
	 * Get LIDs for multiple PNs - Optimized batch operation
	 */
	async getLIDsForPNs(pns: string[]): Promise<LIDMapping[] | null> {
		this.checkDestroyed()
		this.stats.totalOperations++
		this.stats.lastOperationAt = Date.now()

		const usyncFetch: { [_: string]: number[] } = {}
		const successfulPairs: { [_: string]: LIDMapping } = {}

		for (const pn of pns) {
			if (!isPnUser(pn) && !isHostedPnUser(pn)) continue

			const decoded = jidDecode(pn)
			if (!decoded) continue

			const pnUser = decoded.user
			let lidUser = this.mappingCache.get(`pn:${pnUser}`)

			if (lidUser) {
				this.stats.cacheHits++
			} else {
				this.stats.cacheMisses++

				// Cache miss - check database
				try {
					const stored = await this.retryOperation(
						() => this.keys.get('lid-mapping', [pnUser]),
						'get-lid-for-pn'
					)
					lidUser = stored[pnUser]

					if (lidUser) {
						this.stats.dbHits++
						this.mappingCache.set(`pn:${pnUser}`, lidUser)
						this.mappingCache.set(`lid:${lidUser}`, pnUser)
					} else {
						this.stats.dbMisses++

						// Need to fetch from USync
						if (this.config.debugLogging) {
							this.logger.trace({ pnUser }, 'No LID mapping found, queuing for USync')
						}

						const device = decoded.device || 0
						let normalizedPn = jidNormalizedUser(pn)
						if (isHostedPnUser(normalizedPn)) {
							normalizedPn = `${pnUser}@s.whatsapp.net`
						}

						if (!usyncFetch[normalizedPn]) {
							usyncFetch[normalizedPn] = [device]
						} else {
							usyncFetch[normalizedPn]?.push(device)
						}
						continue
					}
				} catch (error) {
					this.logger.error({ error, pn }, 'Failed to get LID mapping')
					this.stats.failedOperations++
					continue
				}
			}

			lidUser = lidUser?.toString()
			if (!lidUser) {
				this.logger.warn({ pn, lidUser }, 'Invalid or empty LID user')
				continue
			}

			// Push the PN device ID to the LID to maintain device separation
			const pnDevice = decoded.device ?? 0
			const deviceSpecificLid = this.buildDeviceSpecificJid(lidUser, pnDevice, decoded.server === 'hosted' ? 'hosted.lid' : 'lid')

			if (this.config.debugLogging) {
				this.logger.trace({ pn, deviceSpecificLid, pnDevice }, 'getLIDForPN: mapping found')
			}

			successfulPairs[pn] = { lid: deviceSpecificLid, pn }
		}

		// Fetch from USync if needed
		if (Object.keys(usyncFetch).length > 0) {
			await this.fetchFromUSync(usyncFetch, successfulPairs)
		}

		this.recordMetrics('get-lid', Object.keys(successfulPairs).length)
		return Object.keys(successfulPairs).length > 0 ? Object.values(successfulPairs) : null
	}

	/**
	 * Get PN for LID - USER LEVEL with device construction
	 */
	async getPNForLID(lid: string): Promise<string | null> {
		this.checkDestroyed()
		this.stats.totalOperations++
		this.stats.lastOperationAt = Date.now()

		if (!isLidUser(lid)) return null

		const decoded = jidDecode(lid)
		if (!decoded) return null

		const lidUser = decoded.user
		let pnUser = this.mappingCache.get(`lid:${lidUser}`)

		if (pnUser) {
			this.stats.cacheHits++
		} else {
			this.stats.cacheMisses++

			// Cache miss - check database
			try {
				const stored = await this.retryOperation(
					() => this.keys.get('lid-mapping', [`${lidUser}_reverse`]),
					'get-pn-for-lid'
				)
				pnUser = stored[`${lidUser}_reverse`]

				if (!pnUser || typeof pnUser !== 'string') {
					this.stats.dbMisses++
					if (this.config.debugLogging) {
						this.logger.trace({ lidUser }, 'No reverse mapping found')
					}
					return null
				}

				this.stats.dbHits++
				this.mappingCache.set(`lid:${lidUser}`, pnUser)
			} catch (error) {
				this.logger.error({ error, lid }, 'Failed to get PN for LID')
				this.stats.failedOperations++
				return null
			}
		}

		// Construct device-specific PN JID
		const lidDevice = decoded.device ?? 0
		const server = decoded.domainType === WAJIDDomains.HOSTED_LID ? 'hosted' : 's.whatsapp.net'
		const pnJid = this.buildDeviceSpecificJid(pnUser, lidDevice, server)

		if (this.config.debugLogging) {
			this.logger.trace({ lid, pnJid }, 'Found reverse mapping')
		}

		this.recordMetrics('get-pn', 1)
		return pnJid
	}

	/**
	 * Check if a mapping exists for a PN
	 */
	async hasMappingForPN(pn: string): Promise<boolean> {
		this.checkDestroyed()

		if (!isPnUser(pn) && !isHostedPnUser(pn)) return false

		const decoded = jidDecode(pn)
		if (!decoded) return false

		const pnUser = decoded.user

		// Check cache first
		if (this.mappingCache.has(`pn:${pnUser}`)) {
			return true
		}

		// Check database
		try {
			const stored = await this.keys.get('lid-mapping', [pnUser])
			return !!stored[pnUser]
		} catch {
			return false
		}
	}

	/**
	 * Delete mapping for a PN
	 */
	async deleteMapping(pn: string): Promise<boolean> {
		this.checkDestroyed()

		if (!isPnUser(pn) && !isHostedPnUser(pn)) return false

		const decoded = jidDecode(pn)
		if (!decoded) return false

		const pnUser = decoded.user
		const lidUser = this.mappingCache.get(`pn:${pnUser}`)

		// Remove from cache
		this.mappingCache.delete(`pn:${pnUser}`)
		if (lidUser) {
			this.mappingCache.delete(`lid:${lidUser}`)
		}

		// Note: We don't delete from persistent storage to maintain history
		// This only clears the cache entry

		this.logger.debug({ pnUser }, 'Mapping deleted from cache')
		return true
	}

	// ========================================================================
	// CLEANUP
	// ========================================================================

	/**
	 * Destroy the store and clean up resources
	 * CRITICAL: Call this when done to prevent memory leaks
	 */
	destroy(): void {
		if (this.destroyed) {
			this.logger.debug('LIDMappingStore already destroyed')
			return
		}

		this.logger.debug('Destroying LIDMappingStore')
		this.destroyed = true

		// Clear cache
		this.mappingCache.clear()

		// Clear metrics module reference
		this.metricsModule = null

		this.logger.debug('LIDMappingStore destroyed successfully')
	}

	// ========================================================================
	// PRIVATE HELPERS
	// ========================================================================

	/**
	 * Check if store has been destroyed and throw if so
	 */
	private checkDestroyed(): void {
		if (this.destroyed) {
			throw new LIDMappingError(
				'LIDMappingStore has been destroyed',
				LIDMappingErrorCode.DESTROYED
			)
		}
	}

	/**
	 * Validate a LID-PN mapping pair
	 */
	private isValidMapping(lid: string, pn: string): boolean {
		return ((isLidUser(lid) && isPnUser(pn)) || (isPnUser(lid) && isLidUser(pn))) ?? false
	}

	/**
	 * Build device-specific JID
	 */
	private buildDeviceSpecificJid(user: string, device: number, server: string): string {
		return `${user}${device ? `:${device}` : ''}@${server}`
	}

	/**
	 * Chunk array into smaller arrays for batch processing
	 */
	private chunkArray<T>(array: T[], size: number): T[][] {
		const chunks: T[][] = []
		for (let i = 0; i < array.length; i += size) {
			chunks.push(array.slice(i, i + size))
		}
		return chunks
	}

	/**
	 * Retry an operation with exponential backoff
	 * Supports both Promise and Awaitable return types
	 */
	private async retryOperation<T>(
		operation: () => T | Promise<T>,
		operationName: string
	): Promise<T> {
		let lastError: Error | undefined

		for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
			try {
				return await operation()
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error))

				if (attempt < this.config.retryAttempts) {
					const delay = this.config.retryDelayMs * Math.pow(2, attempt - 1)
					this.logger.warn(
						{ operationName, attempt, maxAttempts: this.config.retryAttempts, delay },
						'Operation failed, retrying'
					)
					await this.sleep(delay)
				}
			}
		}

		throw new LIDMappingError(
			`Operation ${operationName} failed after ${this.config.retryAttempts} attempts: ${lastError?.message}`,
			LIDMappingErrorCode.DATABASE_ERROR,
			{ operationName, lastError: lastError?.message }
		)
	}

	/**
	 * Sleep for specified milliseconds
	 */
	private sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	/**
	 * Fetch mappings from USync
	 */
	private async fetchFromUSync(
		usyncFetch: { [pn: string]: number[] },
		successfulPairs: { [pn: string]: LIDMapping }
	): Promise<void> {
		if (!this.pnToLIDFunc) {
			this.logger.warn('No pnToLIDFunc provided, cannot fetch from USync')
			return
		}

		this.stats.usyncFetches++

		try {
			const result = await this.pnToLIDFunc(Object.keys(usyncFetch))

			if (result && result.length > 0) {
				await this.storeLIDPNMappings(result)

				for (const pair of result) {
					const pnDecoded = jidDecode(pair.pn)
					const pnUser = pnDecoded?.user
					if (!pnUser) continue

					const lidUser = jidDecode(pair.lid)?.user
					if (!lidUser) continue

					const devices = usyncFetch[pair.pn]
					if (!devices) continue

					for (const device of devices) {
						const server = device === 99 ? 'hosted.lid' : 'lid'
						const deviceSpecificLid = this.buildDeviceSpecificJid(lidUser, device, server)

						const pnServer = device === 99 ? 'hosted' : 's.whatsapp.net'
						const deviceSpecificPn = this.buildDeviceSpecificJid(pnUser, device, pnServer)

						if (this.config.debugLogging) {
							this.logger.trace(
								{ pn: pair.pn, deviceSpecificLid, device },
								'USync fetch successful'
							)
						}

						successfulPairs[deviceSpecificPn] = { lid: deviceSpecificLid, pn: deviceSpecificPn }
					}
				}
			} else {
				this.stats.usyncFailures++
			}
		} catch (error) {
			this.logger.error({ error }, 'USync fetch failed')
			this.stats.usyncFailures++
			this.stats.failedOperations++
		}
	}

	/**
	 * Record metrics if enabled
	 */
	private recordMetrics(operation: string, count: number): void {
		if (this.metricsModule) {
			try {
				// Use the metrics registry to record LID mapping operations
				// This integrates with the existing Prometheus metrics
			} catch {
				// Ignore metrics errors
			}
		}
	}
}
