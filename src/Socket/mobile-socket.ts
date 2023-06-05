import { Socket } from 'net'
import { MOBILE_ENDPOINT, MOBILE_PORT } from '../Defaults'
import { SocketConfig } from '../Types'

export class MobileSocket extends Socket {
	constructor(public config: SocketConfig) {
		super()

		this.on('data', (d) => {
			this.emit('message', d)
		})
	}

	override connect() {
		return super.connect({
			host: MOBILE_ENDPOINT,
			port: MOBILE_PORT,
		}, () => {
			this.emit('open')
		})
	}

	get isOpen(): boolean {
		return this.readyState === 'open'
	}

	get isClosed(): boolean {
		return this.readyState === 'closed'
	}

	get isClosing(): boolean {
		return this.isClosed
	}

	get isConnecting(): boolean {
		return this.readyState === 'opening'
	}

	close(): void {
		this.end()
	}

	send(data: unknown, cb?: ((err?: Error | undefined) => void) | undefined) {
		return super.write(data as Uint8Array | string, undefined, cb as ((err?: Error | undefined) => void))
	}
}