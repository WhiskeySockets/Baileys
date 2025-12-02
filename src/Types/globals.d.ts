declare global {
	interface RequestInit {
		dispatcher?: any
		duplex?: 'half' | 'full'
	}
}

export {}
