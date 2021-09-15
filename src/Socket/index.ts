import { SocketConfig } from '../Types'
import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import { makeMessagesSocket as _makeSocket } from './messages-send'

// export the last socket layer
const makeWASocket = (config: Partial<SocketConfig>) => (
	_makeSocket({
		...DEFAULT_CONNECTION_CONFIG,
		...config
	})
)

export default makeWASocket