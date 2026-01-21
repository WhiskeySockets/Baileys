import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import type { UserFacingSocketConfig, WAVersion } from '../Types'
import { fetchLatestWaWebVersion } from '../Utils/generics'
import { makeCommunitiesSocket } from './communities'

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
 * - Fetches latest version on connect
 * - Checks for new versions every 6 hours (configurable)
 * - Updates version on next natural reconnection (transparent)
 * - Emits 'version.update' event when new version is detected
 *
 * @example
 * ```typescript
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
	let currentVersion = mergedConfig.version
	let versionCheckInterval: ReturnType<typeof setInterval> | null = null

	// Fetch latest version before connecting
	try {
		logger?.info('Fetching latest WhatsApp Web version...')
		const result = await fetchLatestWaWebVersion()

		if (result.isLatest) {
			logger?.info({ version: result.version }, 'Using latest WhatsApp Web version')
			mergedConfig.version = result.version
			currentVersion = result.version
		} else {
			logger?.warn(
				{ error: result.error, fallbackVersion: mergedConfig.version },
				'Failed to fetch latest version, using bundled version'
			)
		}
	} catch (error) {
		logger?.warn(
			{ error, fallbackVersion: mergedConfig.version },
			'Error fetching latest version, using bundled version'
		)
	}

	// Create the socket
	const sock = makeWASocket(mergedConfig)

	// Setup periodic version check if interval > 0
	const checkIntervalMs = mergedConfig.versionCheckIntervalMs
	if (checkIntervalMs > 0) {
		logger?.info(
			{ intervalHours: checkIntervalMs / (60 * 60 * 1000) },
			'Starting periodic version check'
		)

		versionCheckInterval = setInterval(async () => {
			try {
				logger?.debug('Checking for WhatsApp Web version update...')
				const result = await fetchLatestWaWebVersion()

				if (result.isLatest && versionsAreDifferent(currentVersion, result.version)) {
					const isCritical = isCriticalVersionChange(currentVersion, result.version)

					logger?.info(
						{
							currentVersion,
							newVersion: result.version,
							isCritical
						},
						'New WhatsApp Web version detected! Will use on next reconnection.'
					)

					// Emit event for user to handle
					sock.ev.emit('version.update', {
						currentVersion,
						newVersion: result.version,
						isCritical
					})

					// Update the version for next reconnection
					// This is the "soft" update - it will be used when WhatsApp naturally reconnects
					currentVersion = result.version
					mergedConfig.version = result.version
				} else if (result.isLatest) {
					logger?.debug({ version: currentVersion }, 'Version is up to date')
				} else {
					logger?.warn({ error: result.error }, 'Failed to check for version update')
				}
			} catch (error) {
				logger?.warn({ error }, 'Error checking for version update')
			}
		}, checkIntervalMs)

		// Clean up interval when socket closes
		const originalEnd = sock.end.bind(sock)
		sock.end = (error) => {
			if (versionCheckInterval) {
				clearInterval(versionCheckInterval)
				versionCheckInterval = null
				logger?.debug('Stopped periodic version check')
			}
			return originalEnd(error)
		}
	}

	return sock
}

export default makeWASocket
