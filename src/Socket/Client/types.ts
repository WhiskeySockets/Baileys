//CF import { EventEmitter } from 'events'
//CF import { URL } from 'url'
import { SocketConfig } from '../../Types'

export abstract class AbstractSocketClient /*CF extends EventEmitter */ {
	abstract get isOpen(): boolean
	abstract get isClosed(): boolean
	abstract get isClosing(): boolean
	abstract get isConnecting(): boolean

	constructor(public url: URL, public config: SocketConfig) {
		/*CF super()
		this.setMaxListeners(0) */
	}

	abstract connect(): Promise<void>
	abstract close(): Promise<void>
	abstract send(str: Uint8Array | string, cb?: (err?: Error) => void): boolean;

	//CF \/
	private eventListeners: Map<string, Set<(...args: any[]) => void>> = new Map()

	on(event: string, listener: (...args: any[]) => void): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set())
        }
        this.eventListeners.get(event)!.add(listener)
    }

    off(event: string, listener: (...args: any[]) => void): void {
        this.eventListeners.get(event)?.delete(listener)
        if (this.eventListeners.get(event)?.size === 0) {
            this.eventListeners.delete(event)
        }
    }

    emit(event: string, ...args: any[]): boolean {
        const listeners = this.eventListeners.get(event)
        if (!listeners || listeners.size === 0) {
            return false
        }

        listeners.forEach(listener => listener(...args))
        return true
    }

    removeAllListeners(event: string): void {
        this.eventListeners.delete(event)
    }
	//CF /\
}