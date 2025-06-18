import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import { UserFacingSocketConfig } from '../Types'
import { makeBusinessSocket } from './business'

// export the last socket layer
const makeWASocket = (config: UserFacingSocketConfig) =>
	makeBusinessSocket({
		...DEFAULT_CONNECTION_CONFIG,
		...config
	})

export default makeWASocket
