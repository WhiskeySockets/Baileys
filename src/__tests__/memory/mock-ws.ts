/**
 * Mock WebSocket client for memory leak testing.
 * Simulates the WebSocketClient without any real network connection.
 * This allows us to test the full socket lifecycle (create → connect → close → destroy)
 * without hitting WhatsApp servers.
 */
import { EventEmitter } from 'events'

export class MockWebSocketClient extends EventEmitter {
	private _isOpen = false
	private _isClosed = true
	private _isClosing = false

	constructor() {
		super()
		// Mimic Baileys behavior: disable max listener warnings
		this.setMaxListeners(0)
	}

	get isOpen() {
		return this._isOpen
	}

	get isClosed() {
		return this._isClosed
	}

	get isClosing() {
		return this._isClosing
	}

	get isConnecting() {
		return false
	}

	/** Simulate opening the connection */
	simulateOpen() {
		this._isOpen = true
		this._isClosed = false
		this._isClosing = false
		this.emit('open')
	}

	/** Simulate receiving a raw message */
	simulateMessage(data: Buffer | Uint8Array) {
		this.emit('message', data)
	}

	/** Simulate connection close */
	simulateClose() {
		this._isOpen = false
		this._isClosing = false
		this._isClosed = true
		this.emit('close')
	}

	/** Simulate an error */
	simulateError(error: Error) {
		this.emit('error', error)
	}

	connect() {
		// no-op, use simulateOpen()
	}

	async close() {
		if (this._isClosed) {
			return
		}

		this._isClosing = true
		this._isOpen = false

		// Simulate async close behavior like real WS
		await new Promise<void>(resolve => {
			process.nextTick(() => {
				this._isClosing = false
				this._isClosed = true
				resolve()
			})
		})
	}

	send(_data: Uint8Array | string, cb?: (err?: Error) => void) {
		// no-op send
		if (cb) {
			cb()
		}

		return true
	}

	/**
	 * Get the count of listeners for ALL event types.
	 * Critical for leak detection — if this number grows after close(), we have a leak.
	 */
	getTotalListenerCount(): number {
		return this.eventNames().reduce((total, name) => total + this.listenerCount(name), 0)
	}

	/**
	 * Get a detailed breakdown of listeners per event name.
	 */
	getListenerBreakdown(): Record<string, number> {
		const breakdown: Record<string, number> = {}
		for (const name of this.eventNames()) {
			breakdown[String(name)] = this.listenerCount(name)
		}

		return breakdown
	}
}
