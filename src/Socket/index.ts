import { getDefaultConnectionConfig } from '../Defaults'
import type { UserFacingSocketConfig } from '../Types'
import { makeBusinessSocket } from './business'

// export the last socket layer
const makeWASocket = (config: UserFacingSocketConfig) =>
	makeBusinessSocket({
		...getDefaultConnectionConfig(),
		...config
	})

export default makeWASocket
