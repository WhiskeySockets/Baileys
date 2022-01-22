import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import { SocketConfig } from '../Types'
import { makeMessagesRecvSocket as _makeSocket } from './messages-recv'

// export the last socket layer
const makeWASocket = (config: Partial<SocketConfig>) => (
	_makeSocket({
		...DEFAULT_CONNECTION_CONFIG,
		...config
	})
)

export default makeWASocket