import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import type { UserFacingSocketConfig } from '../Types'
import { fetchLatestWaWebVersion } from '../Utils/generics'
import { makeCommunitiesSocket } from './communities'

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
 * Creates a WhatsApp socket connection with automatic version fetching.
 * Fetches the latest WhatsApp Web version from web.whatsapp.com before connecting.
 * Falls back to bundled version if fetch fails.
 *
 * @example
 * ```typescript
 * const sock = await makeWASocketAutoVersion({
 *     auth: state
 * })
 * ```
 */
export const makeWASocketAutoVersion = async (config: UserFacingSocketConfig) => {
	const mergedConfig = {
		...DEFAULT_CONNECTION_CONFIG,
		...config
	}

	const logger = mergedConfig.logger

	// Fetch latest version
	try {
		logger?.info('Fetching latest WhatsApp Web version...')
		const result = await fetchLatestWaWebVersion()

		if (result.isLatest) {
			logger?.info({ version: result.version }, 'Using latest WhatsApp Web version')
			mergedConfig.version = result.version
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

	return makeWASocket(mergedConfig)
}

export default makeWASocket
