import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import type { UserFacingSocketConfig } from '../Types'
import { makeCommunitiesSocket } from './communities'

// export the last socket layer
const makeWASocket = (config: UserFacingSocketConfig) => {
	const newConfig = {
		...DEFAULT_CONNECTION_CONFIG,
		...config
	}

	const hasLegacyVersion = Object.prototype.hasOwnProperty.call(config, 'version')
	if (hasLegacyVersion && !newConfig.versionOverride) {
		newConfig.versionOverride = config.version
	}

	return makeCommunitiesSocket(newConfig)
}

export default makeWASocket
