import WebSocket from 'ws'
import { DEFAULT_ORIGIN } from '../../Defaults'
import { AbstractSocketClient } from './types'

export class WebSocketClient extends AbstractSocketClient {
	protected socket: WebSocket | null = null

	/**
	 * CONNECTION STABILITY: Store references to the event forwarding
	 * functions so they can be removed from the native WebSocket when
	 * the connection closes. Without this, the native socket holds
	 * references to `this.emit` which prevents GC of the client and
	 * all objects it references.
	 */
	private socketListeners: Map<string, (...args: any[]) => void> = new Map()

	get isOpen(): boolean {
		return this.socket?.readyState === WebSocket.OPEN
	}
	get isClosed(): boolean {
		return this.socket === null || this.socket?.readyState === WebSocket.CLOSED
	}
	get isClosing(): boolean {
		return this.socket === null || this.socket?.readyState === WebSocket.CLOSING
	}
	get isConnecting(): boolean {
		return this.socket?.readyState === WebSocket.CONNECTING
	}

	connect() {
		if (this.socket) {
			return
		}

		this.socket = new WebSocket(this.url, {
			origin: DEFAULT_ORIGIN,
			headers: this.config.options?.headers as {},
			handshakeTimeout: this.config.connectTimeoutMs,
			timeout: this.config.connectTimeoutMs,
			agent: this.config.agent
		})

		this.socket.setMaxListeners(0)

		const events = ['close', 'error', 'upgrade', 'message', 'open', 'ping', 'pong', 'unexpected-response']

		for (const event of events) {
			const handler = (...args: any[]) => this.emit(event, ...args)
			this.socketListeners.set(event, handler)
			this.socket?.on(event, handler)
		}
	}

	async close() {
		if (!this.socket) {
			return
		}

		/**
		 * CONNECTION STABILITY: Remove all forwarding listeners from the
		 * native WebSocket before closing. This ensures no event fires
		 * after close and breaks the reference chain from the native
		 * socket back to this client instance.
		 */
		for (const [event, handler] of this.socketListeners) {
			this.socket.removeListener(event, handler)
		}
		this.socketListeners.clear()

		const closePromise = new Promise<void>(resolve => {
			this.socket?.once('close', resolve)
		})

		this.socket.close()

		await closePromise

		this.socket = null
	}
	send(str: string | Uint8Array, cb?: (err?: Error) => void): boolean {
		this.socket?.send(str, cb)

		return Boolean(this.socket)
	}
}
