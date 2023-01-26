import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import { UserFacingSocketConfig } from '../Types'
import { Business } from './business'

// export the last socket layer
const makeWASocket = (config: UserFacingSocketConfig) => (
	new Business({
		...DEFAULT_CONNECTION_CONFIG,
		...config
	})
)

export default makeWASocket