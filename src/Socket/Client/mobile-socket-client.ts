import { connect, Socket } from 'net'
import { AbstractSocketClient } from './abstract-socket-client'

export class MobileSocketClient extends AbstractSocketClient {
	protected socket: Socket | null = null

	get isOpen(): boolean {
		return this.socket?.readyState === 'open'
	}
	get isClosed(): boolean {
		return this.socket === null || this.socket?.readyState === 'closed'
	}
	get isClosing(): boolean {
		return this.socket === null || this.socket?.readyState === 'closed'
	}
	get isConnecting(): boolean {
		return this.socket?.readyState === 'opening'
	}

	async connect(): Promise<void> {
		if(this.socket) {
			return
		}

		if(this.config.agent) {

			throw new Error('There are not support for proxy agent for mobile connection')
		} else {
			this.socket = connect({
				host: this.url.hostname,
				port: Number(this.url.port) || 443
			})
		}

		this.socket.setMaxListeners(0)

		const events = ['close', 'connect', 'data', 'drain', 'end', 'error', 'lookup', 'ready', 'timeout']

		for(const event of events) {
			this.socket?.on(event, (...args: any[]) => this.emit(event, ...args))
		}

		this.socket.on('data', (...args: any[]) => this.emit('message', ...args))
		this.socket.on('ready', (...args: any[]) => this.emit('open', ...args))
	}

	async close(): Promise<void> {
		if(!this.socket) {
			return
		}

		return new Promise<void>(resolve => {
			this.socket!.end(resolve)
			this.socket = null
		})
	}

	send(str: string | Uint8Array, cb?: (err?: Error) => void): boolean {
		if(this.socket === null) {
			return false
		}

		return this.socket.write(str, undefined, cb)
	}

}
