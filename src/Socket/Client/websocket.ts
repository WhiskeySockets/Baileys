//CF import WebSocket from 'ws'
import { logForDevelopment } from '../..'
import { DEFAULT_ORIGIN } from '../../Defaults'
import { AbstractSocketClient } from './types'

let socketGlobal: WebSocket | null = null //CF
let timeMaxOpenSocket: NodeJS.Timeout | null = null //CF

export class WebSocketClient extends AbstractSocketClient {

	protected socket: WebSocket | null = null
	public timeWs: NodeJS.Timeout | null = null

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
		if (socketGlobal) {
			try {
				(socketGlobal as WebSocket)?.close()
				socketGlobal = null
			} catch { }
		}
		if (timeMaxOpenSocket) {
			clearTimeout(timeMaxOpenSocket)
			timeMaxOpenSocket = null
		}

		const response = await fetch(this.url.href.replace('wss://', 'https://'), {
			headers: {
				'origin': DEFAULT_ORIGIN,
				'Upgrade': 'websocket'
			}
		}) as Response & { webSocket: WebSocket }

		this.socket = response?.webSocket
		socketGlobal = response?.webSocket
		if (!this.socket) {
			if (logForDevelopment) console.log("ERRO [!this.socket] Error connecting to WhatsApp websocket")
		}

		timeMaxOpenSocket = setTimeout(() => {
			this?.socket?.close()
		}, Math.floor(Math.random() * (50000 - 30000 + 1)) + 30000)

		this.socket.addEventListener('open', (event) => this.emit('open', event))
		this.socket.addEventListener('message', (event) => {
			if (logForDevelopment) console.log('')
			if (logForDevelopment) console.log('WARNING [RECEIVING]: ', '[event.data]', event.data)
			if (logForDevelopment) console.log('')
			let eventData = event.data
			if (eventData instanceof ArrayBuffer) {
				eventData = Buffer.from(eventData)
			}
			this.emit('message', eventData)
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
		if (logForDevelopment) console.log('WARNING [closed()]')
		if(!this.socket) {
			return
		}

		this.socket.close()
		this.socket = null
	}
	send(str: string | Uint8Array/*CF , cb?: (err?: Error) => void */): boolean {
		if (logForDevelopment) console.log('')
		if (logForDevelopment) console.log('WARNING [SENT]: ', '[str]', str)
		if (logForDevelopment) console.log('')
		this.socket?.send(str/*CF , cb */)

		return Boolean(this.socket)
	}
}
