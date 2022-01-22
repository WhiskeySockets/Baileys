import { Boom } from '@hapi/boom'
import { randomBytes } from 'crypto'
import { platform, release } from 'os'
import { Logger } from 'pino'
import { proto } from '../../WAProto'
import { CommonBaileysEventEmitter, DisconnectReason } from '../Types'
import { Binary } from '../WABinary'
import { ConnectionState } from '..'

const PLATFORM_MAP = {
	'aix': 'AIX',
	'darwin': 'Mac OS',
	'win32': 'Windows',
	'android': 'Android'
}

export const Browsers = {
	ubuntu: browser => ['Ubuntu', browser, '18.04'] as [string, string, string],
	macOS: browser => ['Mac OS', browser, '10.15.3'] as [string, string, string],
	baileys: browser => ['Baileys', browser, '4.0.0'] as [string, string, string],
	/** The appropriate browser based on your OS & release */
	appropriate: browser => [ PLATFORM_MAP[platform()] || 'Ubuntu', browser, release() ] as [string, string, string]
}

export const BufferJSON = {
	replacer: (k, value: any) => {
		if(Buffer.isBuffer(value) || value instanceof Uint8Array || value?.type === 'Buffer') {
			return { type: 'Buffer', data: Buffer.from(value?.data || value).toString('base64') }
		}

		return value
	},
	reviver: (_, value: any) => {
		if(typeof value === 'object' && !!value && (value.buffer === true || value.type === 'Buffer')) {
			const val = value.data || value.value 
			return typeof val === 'string' ? Buffer.from(val, 'base64') : Buffer.from(val)
		}

		return value
	} 
}


export const writeRandomPadMax16 = (e: Binary) => {
	function r(e: Binary, t: number) {
		for(var r = 0; r < t; r++) {
			e.writeUint8(t)
		}
	}
  
	var t = randomBytes(1)
	r(e, 1 + (15 & t[0]))
	return e
}

export const unpadRandomMax16 = (e: Uint8Array | Buffer) => {
	const t = new Uint8Array(e)
	if(0 === t.length) {
		throw new Error('unpadPkcs7 given empty bytes')
	}
  
	var r = t[t.length - 1]
	if(r > t.length) {
		throw new Error(`unpad given ${t.length} bytes, but pad is ${r}`)
	}
  
	return new Uint8Array(t.buffer, t.byteOffset, t.length - r)
}

export const encodeWAMessage = (message: proto.IMessage) => (
	Buffer.from(
		writeRandomPadMax16(
			new Binary(proto.Message.encode(message).finish())
		).readByteArray()
	)
)

export const generateRegistrationId = () => (
	Uint16Array.from(randomBytes(2))[0] & 0x3fff
)

export const encodeInt = (e: number, t: number) => {
	for(var r = t, a = new Uint8Array(e), i = e - 1; i >= 0; i--) {
		a[i] = 255 & r
		r >>>= 8
	}

	return a
}

export const encodeBigEndian = (e: number, t=4) => {
	let r = e
	const a = new Uint8Array(t)
	for(let i = t - 1; i >= 0; i--) {
		a[i] = 255 & r
		r >>>= 8
	}

	return a
}

export const toNumber = (t: Long | number) => ((typeof t === 'object' && 'toNumber' in t) ? t.toNumber() : t)

export function shallowChanges <T>(old: T, current: T, { lookForDeletedKeys }: {lookForDeletedKeys: boolean}): Partial<T> {
	const changes: Partial<T> = {}
	for(const key in current) {
		if(old[key] !== current[key]) {
			changes[key] = current[key] || null
		}
	}

	if(lookForDeletedKeys) {
		for(const key in old) {
			if(!changes[key] && old[key] !== current[key]) {
				changes[key] = current[key] || null
			}
		}
	}

	return changes
}

/** unix timestamp of a date in seconds */
export const unixTimestampSeconds = (date: Date = new Date()) => Math.floor(date.getTime()/1000)

export type DebouncedTimeout = ReturnType<typeof debouncedTimeout>

export const debouncedTimeout = (intervalMs: number = 1000, task: () => void = undefined) => {
	let timeout: NodeJS.Timeout
	return {
		start: (newIntervalMs?: number, newTask?: () => void) => {
			task = newTask || task
			intervalMs = newIntervalMs || intervalMs
			timeout && clearTimeout(timeout)
			timeout = setTimeout(task, intervalMs)
		},
		cancel: () => {
			timeout && clearTimeout(timeout)
			timeout = undefined
		},
		setTask: (newTask: () => void) => task = newTask,
		setInterval: (newInterval: number) => intervalMs = newInterval
	}
}

export const delay = (ms: number) => delayCancellable (ms).delay
export const delayCancellable = (ms: number) => {
	const stack = new Error().stack
	let timeout: NodeJS.Timeout
	let reject: (error) => void
	const delay: Promise<void> = new Promise((resolve, _reject) => {
		timeout = setTimeout(resolve, ms)
		reject = _reject
	})
	const cancel = () => {
		clearTimeout (timeout)
		reject(
			new Boom('Cancelled', {
				statusCode: 500,
				data: {
					stack
				}
			})
		)
	}

	return { delay, cancel }
}

export async function promiseTimeout<T>(ms: number, promise: (resolve: (v?: T)=>void, reject: (error) => void) => void) {
	if(!ms) {
		return new Promise (promise)
	}

	const stack = new Error().stack
	// Create a promise that rejects in <ms> milliseconds
	const { delay, cancel } = delayCancellable (ms) 
	const p = new Promise ((resolve, reject) => {
		delay
			.then(() => reject(
				new Boom('Timed Out', {
					statusCode: DisconnectReason.timedOut,
					data: {
						stack
					}
				})
			))
			.catch (err => reject(err)) 
        
		promise (resolve, reject)
	})
		.finally (cancel)
	return p as Promise<T>
}

// generate a random ID to attach to a message
export const generateMessageID = () => 'BAE5' + randomBytes(6).toString('hex').toUpperCase()

export const bindWaitForConnectionUpdate = (ev: CommonBaileysEventEmitter<any>) => (
	async(check: (u: Partial<ConnectionState>) => boolean, timeoutMs?: number) => {
		let listener: (item: Partial<ConnectionState>) => void
		await (
			promiseTimeout(
				timeoutMs, 
				(resolve, reject) => {
					listener = (update) => {
						if(check(update)) {
							resolve()
						} else if(update.connection === 'close') {
							reject(update.lastDisconnect?.error || new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed }))
						}
					}

					ev.on('connection.update', listener)
				}
			)
				.finally(() => (
					ev.off('connection.update', listener)
				))
		)
	}
)

export const printQRIfNecessaryListener = (ev: CommonBaileysEventEmitter<any>, logger: Logger) => {
	ev.on('connection.update', async({ qr }) => {
		if(qr) {
			const QR = await import('qrcode-terminal')
				.catch(err => {
					logger.error('QR code terminal not added as dependency')
				})
			QR?.generate(qr, { small: true })
		}
	})
}