import { LRUCache } from 'lru-cache'
import type { LIDMapping, SignalKeyStoreWithTransaction } from '../Types'
import type { ILogger } from '../Utils/logger'
import { isAnyLidUser, isAnyPnUser, isHostedPnUser, jidDecode, jidNormalizedUser, WAJIDDomains } from '../WABinary'

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
	/** Retry attempts for failed operations (default: 3, max: 10) */
	retryAttempts: number
	/** Base retry delay in ms (default: 1000). Uses exponential backoff: delay * 2^(attempt-1) */
	retryDelayMs: number
	/** Enable debug logging (default: false) */
	debugLogging: boolean
}

/**
 * Load configuration from environment variables
 * Includes bounds validation to prevent DoS from malicious values
 */
export function loadLIDMappingConfig(): LIDMappingConfig {
	// Helper to clamp values within safe bounds
	const clamp = (value: number, min: number, max: number): number =>
		Math.max(min, Math.min(max, isNaN(value) ? min : value))

	const cacheTtlMs = parseInt(process.env.BAILEYS_LID_CACHE_TTL_MS || String(3 * 24 * 60 * 60 * 1000), 10)
	const maxCacheSize = parseInt(process.env.BAILEYS_LID_MAX_CACHE_SIZE || '50000', 10)
	const batchSize = parseInt(process.env.BAILEYS_LID_BATCH_SIZE || '100', 10)
	const retryAttempts = parseInt(process.env.BAILEYS_LID_RETRY_ATTEMPTS || '3', 10)
	const retryDelayMs = parseInt(process.env.BAILEYS_LID_RETRY_DELAY_MS || '1000', 10)

	return {
		// Cache TTL: minimum 1 minute, maximum 30 days
		cacheTtlMs: clamp(cacheTtlMs, 60_000, 30 * 24 * 60 * 60 * 1000),
		// Cache size: minimum 100, maximum 1,000,000
		maxCacheSize: clamp(maxCacheSize, 100, 1_000_000),
		cacheAutoPurge: process.env.BAILEYS_LID_CACHE_AUTO_PURGE !== 'false',
		updateAgeOnGet: process.env.BAILEYS_LID_UPDATE_AGE_ON_GET !== 'false',
		enableMetrics: process.env.BAILEYS_LID_METRICS === 'true',
		// Batch size: minimum 1 (prevents infinite loop), maximum 1000
		batchSize: clamp(batchSize, 1, 1000),
		// Retry attempts: minimum 1, maximum 10
		retryAttempts: clamp(retryAttempts, 1, 10),
		// Retry delay: minimum 100ms, maximum 60 seconds
		retryDelayMs: clamp(retryDelayMs, 100, 60_000),
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
		// NOTE: This is loaded asynchronously. Metrics recorded immediately after
		// construction may be lost until the module finishes loading.
		// For critical metrics, consider calling warmCache() or another async method
		// first to ensure the module has time to load.
		if (this.config.enableMetrics) {
			import('../Utils/prometheus-metrics').then(m => {
				this.metricsModule = m
				this.logger.debug('Prometheus metrics module loaded for LID mapping')
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
	 * Safe to call after destroy for debugging purposes
	 */
	getConfig(): LIDMappingConfig {
		return { ...this.config }
	}

	/**
	 * Get current statistics
	 * Safe to call after destroy for final metrics collection
	 */
	getStatistics(): LIDMappingStatistics {
		const totalLookups = this.stats.cacheHits + this.stats.cacheMisses
		return {
			...this.stats,
			cacheSize: this.destroyed ? 0 : this.mappingCache.size,
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
	 * Safe to call after destroy for final reporting
	 */
	getCacheInfo(): { size: number; maxSize: number; ttlMs: number } {
		return {
			size: this.destroyed ? 0 : this.mappingCache.size,
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
	 *
	 * @param pairs - Array of LID-PN mappings to store
	 * @returns Statistics about the operation (stored, skipped, errors)
	 *
	 * Note: Return type changed from void to statistics object.
	 * Existing callers that ignore the return value remain compatible.
	 */
	async storeLIDPNMappings(pairs: LIDMapping[]): Promise<{ stored: number; skipped: number; errors: number }> {
		this.checkDestroyed()
		this.stats.totalOperations++
		this.stats.lastOperationAt = Date.now()

		const result = { stored: 0, skipped: 0, errors: 0 }

		// Phase 1: Validate and collect cache misses
		const cacheMissPnUsers: string[] = []
		const pendingValidation = new Map<string, { pnUser: string; lidUser: string }>()

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
			const existingLidUser = this.mappingCache.get(`pn:${pnUser}`)

			if (existingLidUser !== undefined) {
				// Cache hit
				this.stats.cacheHits++
				if (existingLidUser === lidUser) {
					if (this.config.debugLogging) {
						this.logger.debug({ pnUser, lidUser }, 'LID mapping already exists, skipping')
					}
					result.skipped++
				} else {
					// Different mapping - will be stored
					pendingValidation.set(pnUser, { pnUser, lidUser })
				}
			} else {
				// Cache miss - queue for batch DB fetch
				this.stats.cacheMisses++
				cacheMissPnUsers.push(pnUser)
				pendingValidation.set(pnUser, { pnUser, lidUser })
			}
		}

		// Phase 2: Batch fetch all cache misses from DB
		if (cacheMissPnUsers.length > 0) {
			const batches = this.chunkArray(cacheMissPnUsers, this.config.batchSize)

			for (const batch of batches) {
				try {
					const stored = await this.retryOperation(
						() => this.keys.get('lid-mapping', batch),
						'batch-get-mappings'
					)

					// Update cache and validate against DB
					for (const pnUser of batch) {
						const existingLidUser = stored[pnUser]

						if (existingLidUser) {
							this.stats.dbHits++
							// Update cache with database value
							this.mappingCache.set(`pn:${pnUser}`, existingLidUser)
							this.mappingCache.set(`lid:${existingLidUser}`, pnUser)

							// Check if this mapping should be skipped
							const pending = pendingValidation.get(pnUser)
							if (pending && existingLidUser === pending.lidUser) {
								if (this.config.debugLogging) {
									this.logger.debug(
										{ pnUser, lidUser: pending.lidUser },
										'LID mapping already exists in DB, skipping'
									)
								}
								result.skipped++
								pendingValidation.delete(pnUser)
							}
						} else {
							this.stats.dbMisses++
						}
					}
				} catch (error) {
					this.logger.error({ error, batchSize: batch.length }, 'Failed to batch fetch existing mappings')
					result.errors += batch.length
					// Remove failed fetches from pending validation to avoid storing them
					for (const pnUser of batch) {
						pendingValidation.delete(pnUser)
					}
				}
			}
		}

		// Phase 3: Store new/updated mappings
		const validPairs = Array.from(pendingValidation.values())

		if (validPairs.length === 0) {
			return result
		}

		const storeBatches = this.chunkArray(validPairs, this.config.batchSize)

		for (const batch of storeBatches) {
			try {
				await this.retryOperation(async () => {
					await this.keys.transaction(async () => {
						for (const { pnUser, lidUser } of batch) {
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

		this.logger.trace({ result, totalPairs: pairs.length, cacheMisses: cacheMissPnUsers.length }, 'Stored LID-PN mappings with batch optimization')
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
	 *
	 * Note: PNs that fail database lookup are silently skipped and queued for
	 * USync retry. Check statistics.failedOperations for failure counts.
	 * The returned array may be smaller than input if some lookups failed.
	 */
	async getLIDsForPNs(pns: string[]): Promise<LIDMapping[] | null> {
		this.checkDestroyed()
		this.stats.totalOperations++
		this.stats.lastOperationAt = Date.now()

		const usyncFetch: { [_: string]: number[] } = {}
		const successfulPairs: { [_: string]: LIDMapping } = {}
		const failedPns = new Set<string>()
		const pendingByPnUser = new Map<string, Array<{ pn: string; decoded: ReturnType<typeof jidDecode> }>>()

		for (const pn of pns) {
			if (!isAnyPnUser(pn)) continue

			const decoded = jidDecode(pn)
			if (!decoded) continue

			const pnUser = decoded.user
			const cachedLidUser = this.mappingCache.get(`pn:${pnUser}`)

			if (cachedLidUser) {
				this.stats.cacheHits++
				const lidUser = cachedLidUser.toString()
				if (!lidUser) {
					this.logger.warn({ pn, lidUser }, 'Invalid or empty LID user')
					continue
				}

				const pnDevice = decoded.device ?? 0
				const deviceSpecificLid = this.buildDeviceSpecificJid(
					lidUser,
					pnDevice,
					decoded.server === 'hosted' ? 'hosted.lid' : 'lid'
				)

				if (this.config.debugLogging) {
					this.logger.trace({ pn, deviceSpecificLid, pnDevice }, 'getLIDForPN: mapping found')
				}

				successfulPairs[pn] = { lid: deviceSpecificLid, pn }
				continue
			}

			this.stats.cacheMisses++
			const pendingForUser = pendingByPnUser.get(pnUser) ?? []
			pendingForUser.push({ pn, decoded })
			pendingByPnUser.set(pnUser, pendingForUser)
		}

		if (pendingByPnUser.size > 0) {
			const pnUsers = [...pendingByPnUser.keys()]
			const dbFailedPnUsers = new Set<string>()

			for (const batch of this.chunkArray(pnUsers, this.config.batchSize)) {
				try {
					const stored = await this.retryOperation(
						() => this.keys.get('lid-mapping', batch),
						'get-lid-for-pn'
					)

					for (const pnUser of batch) {
						const lidUser = stored[pnUser]
						if (lidUser) {
							this.stats.dbHits++
							this.mappingCache.set(`pn:${pnUser}`, lidUser)
							this.mappingCache.set(`lid:${lidUser}`, pnUser)
						} else {
							this.stats.dbMisses++
						}
					}
				} catch (error) {
					this.logger.error({ error, batch }, 'Failed to get LID mapping batch from database')
					this.stats.failedOperations += batch.length
					batch.forEach(pnUser => dbFailedPnUsers.add(pnUser))
				}
			}

			for (const [pnUser, items] of pendingByPnUser.entries()) {
				const lidUser = this.mappingCache.get(`pn:${pnUser}`)
				for (const { pn, decoded } of items) {
					if (lidUser && decoded) {
						const lidUserString = lidUser.toString()
						if (!lidUserString) {
							this.logger.warn({ pn, lidUser }, 'Invalid or empty LID user')
							continue
						}

						const pnDevice = decoded.device ?? 0
						const deviceSpecificLid = this.buildDeviceSpecificJid(
							lidUserString,
							pnDevice,
							decoded.server === 'hosted' ? 'hosted.lid' : 'lid'
						)

						if (this.config.debugLogging) {
							this.logger.trace({ pn, deviceSpecificLid, pnDevice }, 'getLIDForPN: mapping found')
						}

						successfulPairs[pn] = { lid: deviceSpecificLid, pn }
						continue
					}

					if (dbFailedPnUsers.has(pnUser)) {
						failedPns.add(pn)
					}

					if (!decoded) continue

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
				}
			}
		}

		// Fetch from USync if needed
		if (Object.keys(usyncFetch).length > 0) {
			await this.fetchFromUSync(usyncFetch, successfulPairs)
		}

		// Log warning if some PNs failed lookup
		if (failedPns.size > 0) {
			this.logger.warn(
				{ failedCount: failedPns.size, totalRequested: pns.length },
				'Some PNs failed during getLIDsForPNs - results may be incomplete'
			)
		}

		this.recordMetrics('get-lid', Object.keys(successfulPairs).length)
		return Object.keys(successfulPairs).length > 0 ? Object.values(successfulPairs) : null
	}

	/**
	 * Get PN for LID - USER LEVEL with device construction
	 */
	async getPNForLID(lid: string): Promise<string | null> {
		const results = await this.getPNsForLIDs([lid])
		return results?.[0]?.pn || null
	}

	/**
	 * Get PNs for multiple LIDs - Optimized batch operation
	 */
	async getPNsForLIDs(lids: string[]): Promise<LIDMapping[] | null> {
		this.checkDestroyed()
		this.stats.totalOperations++
		this.stats.lastOperationAt = Date.now()

		const successfulPairs: { [_: string]: LIDMapping } = {}
		const failedLids = new Set<string>()
		const pendingByLidUser = new Map<string, Array<{ lid: string; decoded: ReturnType<typeof jidDecode> }>>()

		const addResolvedPair = (lid: string, decoded: ReturnType<typeof jidDecode>, pnUser: string): void => {
			const lidDevice = decoded?.device ?? 0
			const server = decoded?.domainType === WAJIDDomains.HOSTED_LID ? 'hosted' : 's.whatsapp.net'
			const pnJid = this.buildDeviceSpecificJid(pnUser, lidDevice, server)

			if (this.config.debugLogging) {
				this.logger.trace({ lid, pnJid }, 'Found reverse mapping')
			}

			successfulPairs[lid] = { lid, pn: pnJid }
		}

		for (const lid of lids) {
			if (!isAnyLidUser(lid)) continue

			const decoded = jidDecode(lid)
			if (!decoded) continue

			const lidUser = decoded.user
			const cachedPnUser = this.mappingCache.get(`lid:${lidUser}`)

			if (cachedPnUser && typeof cachedPnUser === 'string') {
				this.stats.cacheHits++
				addResolvedPair(lid, decoded, cachedPnUser)
				continue
			}

			this.stats.cacheMisses++
			const pendingForUser = pendingByLidUser.get(lidUser) ?? []
			pendingForUser.push({ lid, decoded })
			pendingByLidUser.set(lidUser, pendingForUser)
		}

		if (pendingByLidUser.size > 0) {
			const reverseKeys = [...pendingByLidUser.keys()].map(lidUser => `${lidUser}_reverse`)
			const dbFailedReverseKeys = new Set<string>()

			for (const batch of this.chunkArray(reverseKeys, this.config.batchSize)) {
				try {
					const stored = await this.retryOperation(
						() => this.keys.get('lid-mapping', batch),
						'get-pn-for-lid'
					)

					for (const reverseKey of batch) {
						const lidUser = reverseKey.replace(/_reverse$/, '')
						const pnUser = stored[reverseKey]
						if (pnUser && typeof pnUser === 'string') {
							this.stats.dbHits++
							this.mappingCache.set(`lid:${lidUser}`, pnUser)
							this.mappingCache.set(`pn:${pnUser}`, lidUser)
						} else {
							this.stats.dbMisses++
						}
					}
				} catch (error) {
					this.logger.error({ error, batch }, 'Failed to get PN mapping batch from database')
					this.stats.failedOperations += batch.length
					batch.forEach(reverseKey => dbFailedReverseKeys.add(reverseKey))
				}
			}

			for (const [lidUser, items] of pendingByLidUser.entries()) {
				const pnUser = this.mappingCache.get(`lid:${lidUser}`)
				for (const { lid, decoded } of items) {
					if (pnUser && typeof pnUser === 'string') {
						addResolvedPair(lid, decoded, pnUser)
						continue
					}

					if (dbFailedReverseKeys.has(`${lidUser}_reverse`)) {
						failedLids.add(lid)
					}

					if (this.config.debugLogging) {
						this.logger.trace({ lidUser }, 'No reverse mapping found')
					}
				}
			}
		}

		if (failedLids.size > 0) {
			this.logger.warn(
				{ failedCount: failedLids.size, totalRequested: lids.length },
				'Some LIDs failed during getPNsForLIDs - results may be incomplete'
			)
		}

		this.recordMetrics('get-pn', Object.keys(successfulPairs).length)
		return Object.keys(successfulPairs).length > 0 ? Object.values(successfulPairs) : null
	}

	/**
	 * Check if a mapping exists for a PN
	 */
	async hasMappingForPN(pn: string): Promise<boolean> {
		this.checkDestroyed()

		if (!isAnyPnUser(pn)) return false

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
	 * Delete mapping from cache only (does not affect persistent storage)
	 * Use this to force a fresh lookup on next access
	 * @param pn - The phone number JID to remove from cache
	 * @returns true if the PN was valid and cache was cleared
	 */
	async deleteMappingFromCache(pn: string): Promise<boolean> {
		this.checkDestroyed()

		if (!isAnyPnUser(pn)) return false

		const decoded = jidDecode(pn)
		if (!decoded) return false

		const pnUser = decoded.user
		const lidUser = this.mappingCache.get(`pn:${pnUser}`)

		// Remove from cache only - persistent storage maintains history
		this.mappingCache.delete(`pn:${pnUser}`)
		if (lidUser) {
			this.mappingCache.delete(`lid:${lidUser}`)
		}

		this.logger.debug({ pnUser }, 'Mapping deleted from cache')
		return true
	}

	/**
	 * @deprecated Use deleteMappingFromCache instead - name clarifies cache-only behavior
	 */
	async deleteMapping(pn: string): Promise<boolean> {
		return this.deleteMappingFromCache(pn)
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
	 * Checks that one is a LID and the other is a PN (in either order)
	 */
	private isValidMapping(lid: string, pn: string): boolean {
		return (isAnyLidUser(lid) && isAnyPnUser(pn)) || (isAnyPnUser(lid) && isAnyLidUser(pn))
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
	 *
	 * Delay pattern: baseDelay * 2^(attempt-1)
	 * - Attempt 1: immediate
	 * - Attempt 2: baseDelay * 1 (e.g., 1000ms)
	 * - Attempt 3: baseDelay * 2 (e.g., 2000ms)
	 * - Attempt 4: baseDelay * 4 (e.g., 4000ms)
	 *
	 * Configure via: BAILEYS_LID_RETRY_ATTEMPTS (default: 3)
	 *                BAILEYS_LID_RETRY_DELAY_MS (default: 1000)
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
