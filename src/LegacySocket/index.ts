import { DEFAULT_LEGACY_CONNECTION_CONFIG } from '../Defaults'
import { LegacySocketConfig } from '../Types'
import _makeLegacySocket from './groups'
// export the last socket layer
const makeLegacySocket = (config: Partial<LegacySocketConfig>) => (
	_makeLegacySocket({
		...DEFAULT_LEGACY_CONNECTION_CONFIG,
		...config
	})
)

export default makeLegacySocket