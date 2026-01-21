import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import type { UserFacingSocketConfig, WAVersion } from '../Types'
import { getCachedVersion, refreshVersionCache, clearVersionCache, getVersionCacheStatus } from '../Utils/version-cache'
import type { VersionCacheLogger } from '../Utils/version-cache'
import { makeCommunitiesSocket } from './communities'

/**
 * Adapts Baileys logger to VersionCacheLogger interface
 */
const createCacheLogger = (logger: any): VersionCacheLogger | undefined => {
	if (!logger) return undefined
	return {
		info: (obj: unknown, msg?: string) => logger.info(obj, msg),
		debug: (obj: unknown, msg?: string) => logger.debug(obj, msg),
		warn: (obj: unknown, msg?: string) => logger.warn(obj, msg)
	}
}

/**
 * Compares two WhatsApp versions
 * @returns true if versions are different
 */
const versionsAreDifferent = (v1: WAVersion, v2: WAVersion): boolean => {
	return v1[0] !== v2[0] || v1[1] !== v2[1] || v1[2] !== v2[2]
}

/**
 * Checks if a version change is critical (major or minor version changed)
 */
const isCriticalVersionChange = (oldVersion: WAVersion, newVersion: WAVersion): boolean => {
	// Major version change (index 0) or minor version change (index 1)
	return oldVersion[0] !== newVersion[0] || oldVersion[1] !== newVersion[1]
}

// export the last socket layer
const makeWASocket = (config: UserFacingSocketConfig) => {
	const newConfig = {
		...DEFAULT_CONNECTION_CONFIG,
		...config
	}

	// If the user hasn't provided their own history sync function,
	// let's create a default one that respects the syncFullHistory flag.
	// TODO: Change
	if (config.shouldSyncHistoryMessage === undefined) {
		newConfig.shouldSyncHistoryMessage = () => !!newConfig.syncFullHistory
	}

	return makeCommunitiesSocket(newConfig)
}

/**
 * Creates a WhatsApp socket connection with automatic version fetching
 * and periodic version checks (soft update - transparent to user).
 *
 * Features:
 * - **Shared cache**: 150 connections = 1 request (not 150)
 * - **Persistent cache**: Survives server restarts
 * - Fetches latest version on connect (uses cache if valid)
 * - Checks for new versions every 6 hours (configurable)
 * - Updates version on next natural reconnection (transparent)
 * - Emits 'version.update' event when new version is detected
 *
 * @example
 * ```typescript
 * // All connections share the same cached version
 * const sock = await makeWASocketAutoVersion({
 *     auth: state,
 *     versionCheckIntervalMs: 6 * 60 * 60 * 1000 // 6 hours (default)
 * })
 *
 * // Listen for version updates
 * sock.ev.on('version.update', ({ currentVersion, newVersion, isCritical }) => {
 *     console.log(`New version detected: ${newVersion.join('.')}`)
 *     // Version will be used on next reconnection automatically
 * })
 * ```
 */
export const makeWASocketAutoVersion = async (config: UserFacingSocketConfig) => {
	const mergedConfig = {
		...DEFAULT_CONNECTION_CONFIG,
		...config
	}

	const logger = mergedConfig.logger
	const cacheLogger = createCacheLogger(logger)
	const checkIntervalMs = mergedConfig.versionCheckIntervalMs

	// Track version separately to avoid mutating config (Fix #7)
	let trackedVersion: WAVersion = [...mergedConfig.version] as WAVersion
	let versionCheckInterval: ReturnType<typeof setInterval> | null = null
	let isSocketClosed = false

	/**
	 * Cleans up the version check interval
	 */
	const cleanupInterval = () => {
		if (versionCheckInterval) {
			clearInterval(versionCheckInterval)
			versionCheckInterval = null
			logger?.debug('Stopped periodic version check')
		}
	}

	// Fetch latest version using SHARED CACHE
	// 150 connections starting = 1 request (deduplication)
	try {
		const { version, fromCache, age } = await getCachedVersion({
			cacheTtlMs: checkIntervalMs,
			logger: cacheLogger
		})

		logger?.info(
			{
				version,
				fromCache,
				ageMinutes: fromCache ? Math.round(age / 60000) : 0
			},
			fromCache
				? 'Using cached WhatsApp Web version'
				: 'Fetched fresh WhatsApp Web version'
		)

		mergedConfig.version = version
		trackedVersion = [...version] as WAVersion
	} catch (error) {
		logger?.warn(
			{ error, fallbackVersion: mergedConfig.version },
			'Error fetching version, using bundled version'
		)
	}

	// Create the socket
	const sock = makeWASocket(mergedConfig)

	// Listen for connection close to cleanup interval (Fix #1, #6)
	// This handles both explicit sock.end() and internal disconnections
	sock.ev.on('connection.update', (update) => {
		if (update.connection === 'close') {
			isSocketClosed = true
			cleanupInterval()
		} else if (update.connection === 'open') {
			isSocketClosed = false
		}
	})

	// Setup periodic version check if interval > 0
	if (checkIntervalMs > 0) {
		logger?.info(
			{ intervalHours: checkIntervalMs / (60 * 60 * 1000) },
			'Starting periodic version check'
		)

		versionCheckInterval = setInterval(async () => {
			// Skip if socket is closed (Fix #8 - race condition)
			if (isSocketClosed) {
				cleanupInterval()
				return
			}

			try {
				logger?.debug('Checking for WhatsApp Web version update...')

				// Check cache status first
				const cacheStatus = getVersionCacheStatus(checkIntervalMs)

				// Only refresh if cache is expired (one socket refreshes, others use cache)
				let newVersion: WAVersion
				let fetchSuccess = true

				if (cacheStatus.isExpired) {
					logger?.debug('Cache expired, refreshing...')
					const result = await refreshVersionCache({ logger: cacheLogger })
					newVersion = result.version
					fetchSuccess = result.success

					// Don't update to fallback version on transient network errors
					if (!fetchSuccess) {
						logger?.warn(
							{ fallbackVersion: result.version },
							'Failed to fetch latest version, keeping current version'
						)
						return // Skip version update on fetch failure
					}
				} else if (cacheStatus.version) {
					// Cache still valid, use cached version directly (no file I/O)
					newVersion = cacheStatus.version
				} else {
					// No cache available, skip this check
					return
				}

				// Double-check socket is still open after async operation (Fix #8)
				if (isSocketClosed) {
					cleanupInterval()
					return
				}

				if (versionsAreDifferent(trackedVersion, newVersion)) {
					const isCritical = isCriticalVersionChange(trackedVersion, newVersion)
					const previousVersion = trackedVersion

					logger?.info(
						{
							currentVersion: previousVersion,
							newVersion: newVersion,
							isCritical
						},
						'New WhatsApp Web version detected! Will use on next reconnection.'
					)

					// Update tracked version for next reconnection (Fix #7)
					trackedVersion = [...newVersion] as WAVersion

					// Emit event for user to handle (only if socket still open)
					if (!isSocketClosed) {
						sock.ev.emit('version.update', {
							currentVersion: previousVersion,
							newVersion: newVersion,
							isCritical
						})
					}
				} else {
					logger?.debug({ version: trackedVersion }, 'Version is up to date')
				}
			} catch (error) {
				logger?.warn({ error }, 'Error checking for version update')
			}
		}, checkIntervalMs)
	}

	return sock
}

// Export cache utilities for manual control
export { getCachedVersion, refreshVersionCache, clearVersionCache, getVersionCacheStatus }

export default makeWASocket
