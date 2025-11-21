/// <reference types="node-fetch" />
import type { RequestInit } from 'node-fetch'
declare global {
	// FetchRequestInit extends RequestInit from node-fetch
	type FetchRequestInit = RequestInit & {
		dispatcher?: any
	}
	// Export node-fetch's HeadersInit as a global type
	type FetchHeadersInit = import('node-fetch').HeadersInit
}

export {}
