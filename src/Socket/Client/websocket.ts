//CF import WebSocket from 'ws'
import { DEFAULT_ORIGIN } from '../../Defaults'
import { AbstractSocketClient } from './types'

export class WebSocketClient extends AbstractSocketClient {

	protected socket: WebSocket | null = null

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

	async connect(): Promise<void> {
		if(this.socket) {
			return
		}

		/*CF this.socket = new WebSocket(this.url, {
			origin: DEFAULT_ORIGIN,
			headers: this.config.options?.headers as {},
			handshakeTimeout: this.config.connectTimeoutMs,
			timeout: this.config.connectTimeoutMs,
			agent: this.config.agent,
		})

		this.socket.setMaxListeners(0)

		const events = ['close', 'error', 'upgrade', 'message', 'open', 'ping', 'pong', 'unexpected-response']

		for(const event of events) {
			this.socket?.on(event, (...args: any[]) => this.emit(event, ...args))
		} */

		//CF \/
		const Const_response = await fetch(this.url.href.replace('wss://', 'https://'), {
			headers: {
				'origin': DEFAULT_ORIGIN,
				'Upgrade': 'websocket'
			}
		}) as Response & { webSocket: WebSocket }

		this.socket = Const_response?.webSocket
		if (!this.socket) {
			console.log("ERRO [!this.socket] Error connecting to WhatsApp websocket")
		}

		this.socket.addEventListener('open', (event) => this.emit('open', event))
		this.socket.addEventListener('message', (event) => {
			let Let_eventData = event.data
			if (Let_eventData instanceof ArrayBuffer) {
				Let_eventData = Buffer.from(Let_eventData)
			}
			this.emit('message', Let_eventData)
		})
		this.socket.addEventListener('error', (event) => this.emit('error', event))
		this.socket.addEventListener('close', (event) => this.emit('close', event))

		if (this.socket.readyState === WebSocket.OPEN) {
			(this.socket as WebSocket & {accept(): void}).accept()
			this.emit('open')
		}
		else {
			this.emit('error', new Error('WebSocket connection failed'))
		}
		//CF /\
	}

	async close(): Promise<void> {
		if(!this.socket) {
			return
		}

		this.socket.close()
		this.socket = null
	}
	send(str: string | Uint8Array/*CF , cb?: (err?: Error) => void */): boolean {
		this.socket?.send(str/*CF , cb */)

		return Boolean(this.socket)
	}
}
