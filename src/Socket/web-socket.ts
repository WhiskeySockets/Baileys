import { WebSocket as WS } from 'ws'
import { DEFAULT_ORIGIN } from '../Defaults'
import { SocketConfig } from '../Types'

export class WebSocket extends WS {
	constructor(public config: SocketConfig) {
		super(config.waWebSocketUrl, undefined, {
			origin: DEFAULT_ORIGIN,
			headers: config.options.headers as Record<string, string>,
			handshakeTimeout: config.connectTimeoutMs,
			timeout: config.connectTimeoutMs,
			agent: config.agent,
		})
	}

	get isOpen() {
		return this.readyState === WS.OPEN
	}

	get isClosed() {
		return this.readyState === WS.CLOSED
	}

	get isClosing() {
		return this.readyState === WS.CLOSING
	}

	get isConnecting() {
		return this.readyState === WS.CONNECTING
	}
}
