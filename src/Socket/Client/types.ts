import { EventEmitter } from 'events'
import { URL } from 'url'
import type { SocketConfig } from '../../Types'

export abstract class AbstractSocketClient extends EventEmitter {
	abstract get isOpen(): boolean
	abstract get isClosed(): boolean
	abstract get isClosing(): boolean
	abstract get isConnecting(): boolean

	constructor(
		public url: URL,
		public config: SocketConfig
	) {
		super()
		// Set max listeners from config (default: 50)
		// WARNING: 0 disables limit and allows potential memory leaks
		const maxListeners = this.config.maxSocketClientListeners ?? 50
		if (maxListeners === 0) {
			this.config.logger?.warn('SocketClient setMaxListeners(0) allows UNLIMITED listeners - potential memory leak!')
		}
		this.setMaxListeners(maxListeners)
	}

	abstract connect(): void
	abstract close(): void
	abstract send(str: Uint8Array | string, cb?: (err?: Error) => void): boolean
}
