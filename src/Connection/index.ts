import { SocketConfig } from '../Types'
import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import { EventEmitter } from 'events'
import * as Connection from './groups'
// export the last socket layer
const makeConnection = (config: Partial<SocketConfig>) => (
	Connection.default({
		...DEFAULT_CONNECTION_CONFIG,
		...config
	})
)
export default makeConnection