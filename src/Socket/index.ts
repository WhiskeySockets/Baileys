import { SocketConfig } from '../Types'
import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import { makeChatsSocket as _makeSocket } from './chats'

// export the last socket layer
const makeWASocket = (config: Partial<SocketConfig>) => (
	_makeSocket({
		...DEFAULT_CONNECTION_CONFIG,
		...config
	})
)

export default makeWASocket