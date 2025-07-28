import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import type { UserFacingSocketConfig } from '../Types'
import { makeBusinessSocket } from './business'

// export the last socket layer
const makeWASocket = (config: UserFacingSocketConfig) => {
	const newConfig = {
		...DEFAULT_CONNECTION_CONFIG,
		...config
	}

	// If the user hasn't provided their own history sync function,
	// let's create a default one that respects the syncFullHistory flag.
	if (config.shouldSyncHistoryMessage === undefined) {
		newConfig.shouldSyncHistoryMessage = () => !!newConfig.syncFullHistory
	}

	return makeBusinessSocket(newConfig)
}

export default makeWASocket
