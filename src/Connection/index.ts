import { SocketConfig } from '../Types'
import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import _makeConnection from './groups'
// export the last socket layer
const makeConnection = (config: Partial<SocketConfig>) => (
	_makeConnection({
		...DEFAULT_CONNECTION_CONFIG,
		...config
	})
)

export type Connection = ReturnType<typeof makeConnection>

export default makeConnection