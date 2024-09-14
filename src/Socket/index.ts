import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import { UserFacingSocketConfig } from '../Types'
import { makeRegistrationSocket as _makeSocket } from './registration'

// export the last socket layer
export const makeWASocket = (config: UserFacingSocketConfig) => (
	_makeSocket({
		...DEFAULT_CONNECTION_CONFIG,
		...config
	})
)

export type WASocket = ReturnType<typeof makeWASocket>