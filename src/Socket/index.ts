import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import { SocketConfig } from '../Types'
import { makeBusinessSocket as _makeSocket } from './business'

// export the last socket layer
const makeWASocket = (config: Partial<SocketConfig>) => (
	_makeSocket({
		...DEFAULT_CONNECTION_CONFIG,
		...config
	})
)

export default makeWASocket