declare global {
	interface RequestInit {
		dispatcher?: unknown
		duplex?: 'half' | 'full'
	}
}

export {}
