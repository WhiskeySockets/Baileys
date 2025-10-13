import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import type { UserFacingSocketConfig } from '../Types'
import { makeCommunitiesSocket } from './communities'

// export the last socket layer
const makeWASocket = (config: UserFacingSocketConfig) => {
	const newConfig = {
		...DEFAULT_CONNECTION_CONFIG,
		...config
	}

	if (!newConfig.getPrivacyToken && !newConfig.storePrivacyTokens) {
		// Both functions missing - install in-memory defaults
		const memoryPrivacyTokens = new Map<string, Uint8Array>()
		newConfig.getPrivacyToken = async (jid: string) => memoryPrivacyTokens.get(jid)
		newConfig.storePrivacyTokens = async (entries: { jid: string; token: Uint8Array }[]) => {
			for (const entry of entries) {
				memoryPrivacyTokens.set(entry.jid, entry.token)
			}
		}
	} else if (!newConfig.getPrivacyToken || !newConfig.storePrivacyTokens) {
		throw new Error(
			'Both getPrivacyToken and storePrivacyTokens must be provided together, or both must be omitted for in-memory storage. ' +
				'You cannot mix custom and default implementations.'
		)
	}

	// If the user hasn't provided their own history sync function,
	// let's create a default one that respects the syncFullHistory flag.
	// TODO: Change
	if (config.shouldSyncHistoryMessage === undefined) {
		newConfig.shouldSyncHistoryMessage = () => !!newConfig.syncFullHistory
	}

	return makeCommunitiesSocket(newConfig)
}

export default makeWASocket
