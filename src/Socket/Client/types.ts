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

	on(Parameter_event: string, listener: (...Parameter_args: any[]) => void): void {
        if (!this.eventListeners.has(Parameter_event)) {
            this.eventListeners.set(Parameter_event, new Set())
        }
        this.eventListeners.get(Parameter_event)!.add(listener)
    }

    off(Parameter_event: string, listener: (...Parameter_args: any[]) => void): void {
        this.eventListeners.get(Parameter_event)?.delete(listener)
        if (this.eventListeners.get(Parameter_event)?.size === 0) {
            this.eventListeners.delete(Parameter_event)
        }
    }

    emit(Parameter_event: string, ...Parameter_args: any[]): boolean {
        const Const_listeners = this.eventListeners.get(Parameter_event)
        if (!Const_listeners || Const_listeners.size === 0) {
            return false
        }

        Const_listeners.forEach(Parameter_listener => Parameter_listener(...Parameter_args))
        return true
    }

    removeAllListeners(Parameter_event: string): void {
        this.eventListeners.delete(Parameter_event)
    }
	//CF /\
}