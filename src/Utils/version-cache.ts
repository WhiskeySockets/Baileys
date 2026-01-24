import { promises as fs } from 'fs'
import { join } from 'path'
import { fetchLatestWaWebVersion } from './generics'
import type { WAVersion } from '../Types'

/**
 * Version cache entry stored in file
 */
interface VersionCacheEntry {
	version: WAVersion
	fetchedAt: number // timestamp in ms
	source: 'online' | 'fallback'
}

/**
 * Logger interface for version cache operations
 */
export interface VersionCacheLogger {
	info: (obj: unknown, msg?: string) => void
	debug: (obj: unknown, msg?: string) => void
	warn: (obj: unknown, msg?: string) => void
}

/**
 * In-memory cache to avoid file reads on every connection
 */
let memoryCache: VersionCacheEntry | null = null

/**
 * Promise to prevent concurrent fetches (deduplication)
 */
let fetchInProgress: Promise<VersionCacheEntry> | null = null

/**
 * Default cache TTL: 6 hours
 */
const DEFAULT_CACHE_TTL_MS = 6 * 60 * 60 * 1000

/**
 * Default cache file path.
 *
 * NOTE: Uses process.cwd() which may not be writable in some environments
 * (containers, serverless, etc). In such cases, specify a custom `cacheFilePath`
 * in the config pointing to a writable directory like `/tmp`.
 */
const DEFAULT_CACHE_FILE = join(process.cwd(), '.baileys-version-cache.json')

/**
 * Configuration for version cache
 */
export interface VersionCacheConfig {
	/** Cache TTL in milliseconds (default: 6 hours) */
	cacheTtlMs?: number
	/**
	 * Path to cache file (default: .baileys-version-cache.json in cwd)
	 *
	 * NOTE: If running in a container or serverless environment where cwd
	 * is not writable, specify a writable path like '/tmp/.baileys-version-cache.json'
	 */
	cacheFilePath?: string
	/** Logger instance */
	logger?: VersionCacheLogger
}

/**
 * Result from refreshVersionCache with success status
 */
export interface RefreshVersionResult {
	version: WAVersion
	success: boolean
	source: 'online' | 'fallback'
}

/**
 * Reads the cache from file
 */
async function readCacheFile(filePath: string): Promise<VersionCacheEntry | null> {
	try {
		const data = await fs.readFile(filePath, 'utf-8')
		return JSON.parse(data) as VersionCacheEntry
	} catch {
		return null
	}
}

/**
 * Writes the cache to file
 */
async function writeCacheFile(
	filePath: string,
	entry: VersionCacheEntry,
	logger?: VersionCacheLogger
): Promise<void> {
	try {
		await fs.writeFile(filePath, JSON.stringify(entry, null, 2), 'utf-8')
	} catch (error) {
		// Log write errors for debugging - cache is optional but failures should be visible
		logger?.warn({ error, filePath }, 'Failed to write version cache file')
	}
}

/**
 * Checks if cache entry is still valid
 */
function isCacheValid(entry: VersionCacheEntry | null, ttlMs: number): boolean {
	if (!entry) return false
	const age = Date.now() - entry.fetchedAt
	return age < ttlMs
}

/**
 * Fetches version with deduplication (prevents 150 parallel requests)
 */
async function fetchVersionOnce(
	cacheFilePath: string,
	logger?: VersionCacheLogger
): Promise<VersionCacheEntry> {
	logger?.info({}, 'Fetching WhatsApp Web version (shared for all connections)...')

	const result = await fetchLatestWaWebVersion()

	const entry: VersionCacheEntry = {
		version: result.version,
		fetchedAt: Date.now(),
		source: result.isLatest ? 'online' : 'fallback'
	}

	// Update memory cache
	memoryCache = entry

	// Persist to file (async, don't wait)
	writeCacheFile(cacheFilePath, entry, logger).catch(() => {})

	logger?.info(
		{ version: entry.version, source: entry.source },
		'Version fetched and cached'
	)

	return entry
}

/**
 * Gets the cached WhatsApp version, fetching if necessary.
 *
 * Features:
 * - File-based persistence (survives restarts)
 * - In-memory cache (fast access)
 * - Request deduplication (150 connections = 1 request)
 * - Configurable TTL
 *
 * @example
 * ```typescript
 * // All 150 connections share the same cached version
 * const { version } = await getCachedVersion()
 * const sock = makeWASocket({ version, auth })
 * ```
 */
export async function getCachedVersion(
	config: VersionCacheConfig = {}
): Promise<{ version: WAVersion; fromCache: boolean; age: number; source: 'online' | 'fallback' | 'memory' | 'file' }> {
	const {
		cacheTtlMs = DEFAULT_CACHE_TTL_MS,
		cacheFilePath = DEFAULT_CACHE_FILE,
		logger
	} = config

	// 1. Check memory cache first (fastest)
	if (isCacheValid(memoryCache, cacheTtlMs)) {
		const age = Date.now() - memoryCache!.fetchedAt
		logger?.debug({ age: Math.round(age / 1000) + 's' }, 'Using memory cached version')
		return { version: memoryCache!.version, fromCache: true, age, source: 'memory' }
	}

	// 2. Check file cache (survives restarts)
	const fileCache = await readCacheFile(cacheFilePath)
	if (isCacheValid(fileCache, cacheTtlMs)) {
		memoryCache = fileCache // Update memory cache
		const age = Date.now() - fileCache!.fetchedAt
		logger?.debug({ age: Math.round(age / 1000) + 's' }, 'Using file cached version')
		return { version: fileCache!.version, fromCache: true, age, source: 'file' }
	}

	// 3. Need to fetch - but deduplicate concurrent requests
	// If 150 connections start at once, only 1 fetch happens
	if (!fetchInProgress) {
		fetchInProgress = fetchVersionOnce(cacheFilePath, logger)
			.finally(() => { fetchInProgress = null })
	}

	const entry = await fetchInProgress
	return { version: entry.version, fromCache: false, age: 0, source: entry.source }
}

/**
 * Clears the version cache (memory and file).
 * Also cancels any in-progress fetch to prevent it from restoring the cache.
 */
export async function clearVersionCache(
	cacheFilePath: string = DEFAULT_CACHE_FILE
): Promise<void> {
	// Wait for any in-progress fetch to complete before clearing
	// This prevents the fetch from restoring the cache after we clear it
	if (fetchInProgress) {
		try {
			await fetchInProgress
		} catch {
			// Ignore fetch errors during clear
		}
	}

	memoryCache = null
	fetchInProgress = null

	try {
		await fs.unlink(cacheFilePath)
	} catch {
		// Ignore if file doesn't exist
	}
}

/**
 * Forces a refresh of the cached version.
 * Returns success status to indicate if online fetch succeeded or fell back to bundled version.
 *
 * @returns Object with version, success status, and source
 */
export async function refreshVersionCache(
	config: VersionCacheConfig = {}
): Promise<RefreshVersionResult> {
	const { cacheFilePath = DEFAULT_CACHE_FILE, logger } = config

	// Wait for any existing fetch to complete first (deduplication)
	if (fetchInProgress) {
		try {
			const existing = await fetchInProgress
			// If there's already a fresh fetch in progress, return its result
			return {
				version: existing.version,
				success: existing.source === 'online',
				source: existing.source
			}
		} catch {
			// Ignore and proceed with new fetch
		}
	}

	// Clear existing cache
	memoryCache = null

	// Fetch fresh
	const entry = await fetchVersionOnce(cacheFilePath, logger)

	return {
		version: entry.version,
		success: entry.source === 'online',
		source: entry.source
	}
}

/**
 * Gets cache status information
 */
export function getVersionCacheStatus(
	cacheTtlMs: number = DEFAULT_CACHE_TTL_MS
): {
	hasCache: boolean
	version: WAVersion | null
	age: number | null
	isExpired: boolean
	expiresIn: number | null
	source: 'online' | 'fallback' | null
} {
	if (!memoryCache) {
		return {
			hasCache: false,
			version: null,
			age: null,
			isExpired: true,
			expiresIn: null,
			source: null
		}
	}

	const age = Date.now() - memoryCache.fetchedAt
	const isExpired = age >= cacheTtlMs

	return {
		hasCache: true,
		version: memoryCache.version,
		age,
		isExpired,
		expiresIn: isExpired ? 0 : cacheTtlMs - age,
		source: memoryCache.source
	}
}
