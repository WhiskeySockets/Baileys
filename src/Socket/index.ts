import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import { UserFacingSocketConfig } from '../Types'
import { makeBusinessSocket as _makeSocket } from './business'

// export the last socket layer
const makeWASocket = (config: UserFacingSocketConfig) => (
	_makeSocket({
		...DEFAULT_CONNECTION_CONFIG,
		...config
	})
)

export default makeWASocket