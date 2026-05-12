import type { FetchDispatcher } from './Socket'

declare global {
	interface RequestInit {
		dispatcher?: FetchDispatcher
		duplex?: 'half' | 'full'
	}
}

export {}
