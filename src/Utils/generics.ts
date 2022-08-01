import { Boom } from '@hapi/boom'
import axios from 'axios'
import { randomBytes } from 'crypto'
import { platform, release } from 'os'
import { Logger } from 'pino'
import { proto } from '../../WAProto'
import { version as baileysVersion } from '../Defaults/baileys-version.json'
import { BaileysEventMap, CommonBaileysEventEmitter, DisconnectReason, WACallUpdateType, WAVersion } from '../Types'
import { BinaryNode, getAllBinaryNodeChildren } from '../WABinary'

const PLATFORM_MAP = {
	'aix': 'AIX',
	'darwin': 'Mac OS',
	'win32': 'Windows',
	'android': 'Android'
}

export const Browsers = {
	ubuntu: browser => ['Ubuntu', browser, '20.0.04'] as [string, string, string],
	macOS: browser => ['Mac OS', browser, '10.15.7'] as [string, string, string],
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
			return typeof val === 'string' ? Buffer.from(val, 'base64') : Buffer.from(val || [])
		}

		return value
	}
}

export const writeRandomPadMax16 = (msg: Uint8Array) => {
	const pad = randomBytes(1)
	pad[0] &= 0xf
	if(!pad[0]) {
		pad[0] = 0xf
	}

	return Buffer.concat([msg, Buffer.alloc(pad[0], pad[0])])
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
	writeRandomPadMax16(
		proto.Message.encode(message).finish()
	)
)

export const generateRegistrationId = (): number => {
	return Uint16Array.from(randomBytes(2))[0] & 16383
}

export const encodeBigEndian = (e: number, t = 4) => {
	let r = e
	const a = new Uint8Array(t)
	for(let i = t - 1; i >= 0; i--) {
		a[i] = 255 & r
		r >>>= 8
	}

	return a
}

export const toNumber = (t: Long | number | null | undefined): number => ((typeof t === 'object' && t) ? ('toNumber' in t ? t.toNumber() : (t as any).low) : t)

/** unix timestamp of a date in seconds */
export const unixTimestampSeconds = (date: Date = new Date()) => Math.floor(date.getTime() / 1000)

export type DebouncedTimeout = ReturnType<typeof debouncedTimeout>

export const debouncedTimeout = (intervalMs: number = 1000, task?: () => void) => {
	let timeout: NodeJS.Timeout | undefined
	return {
		start: (newIntervalMs?: number, newTask?: () => void) => {
			task = newTask || task
			intervalMs = newIntervalMs || intervalMs
			timeout && clearTimeout(timeout)
			timeout = setTimeout(() => task?.(), intervalMs)
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

export async function promiseTimeout<T>(ms: number | undefined, promise: (resolve: (v?: T)=>void, reject: (error) => void) => void) {
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

export function bindWaitForEvent<T extends keyof BaileysEventMap<any>>(ev: CommonBaileysEventEmitter<any>, event: T) {
	return async(check: (u: BaileysEventMap<any>[T]) => boolean | undefined, timeoutMs?: number) => {
		let listener: (item: BaileysEventMap<any>[T]) => void
		let closeListener: any
		await (
			promiseTimeout(
				timeoutMs,
				(resolve, reject) => {
					closeListener = ({ connection, lastDisconnect }) => {
						if(connection === 'close') {
							reject(
								lastDisconnect?.error
								|| new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed })
							)
						}
					}

					ev.on('connection.update', closeListener)
					listener = (update) => {
						if(check(update)) {
							resolve()
						}
					}

					ev.on(event, listener)
				}
			)
				.finally(() => {
					ev.off(event, listener)
					ev.off('connection.update', closeListener)
				})
		)
	}
}

export const bindWaitForConnectionUpdate = (ev: CommonBaileysEventEmitter<any>) => bindWaitForEvent(ev, 'connection.update')

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

/**
 * utility that fetches latest baileys version from the master branch.
 * Use to ensure your WA connection is always on the latest version
 */
export const fetchLatestBaileysVersion = async() => {
	const URL = 'https://raw.githubusercontent.com/adiwajshing/Baileys/master/src/Defaults/baileys-version.json'
	try {
		const result = await axios.get<{ version: WAVersion }>(URL, { responseType: 'json' })
		return {
			version: result.data.version,
			isLatest: true
		}
	} catch(error) {
		return {
			version: baileysVersion as WAVersion,
			isLatest: false,
			error
		}
	}
}

/**
 * A utility that fetches the latest web version of whatsapp.
 * Use to ensure your WA connection is always on the latest version
 */
export const fetchLatestWaWebVersion = async() => {
	try {
		const result = await axios.get('https://web.whatsapp.com/check-update?version=1&platform=web', { responseType: 'json' })
		const version = result.data.currentVersion.split('.')
		return {
			version: [+version[0], +version[1], +version[2]] as WAVersion,
			isLatest: true
		}
	} catch(error) {
		return {
			version: baileysVersion as WAVersion,
			isLatest: false,
			error
		}
	}
}

/** unique message tag prefix for MD clients */
export const generateMdTagPrefix = () => {
	const bytes = randomBytes(4)
	return `${bytes.readUInt16BE()}.${bytes.readUInt16BE(2)}-`
}

const STATUS_MAP: { [_: string]: proto.WebMessageInfo.Status } = {
	'played': proto.WebMessageInfo.Status.PLAYED,
	'read': proto.WebMessageInfo.Status.READ,
	'read-self': proto.WebMessageInfo.Status.READ
}
/**
 * Given a type of receipt, returns what the new status of the message should be
 * @param type type from receipt
 */
export const getStatusFromReceiptType = (type: string | undefined) => {
	const status = STATUS_MAP[type!]
	if(typeof type === 'undefined') {
		return proto.WebMessageInfo.Status.DELIVERY_ACK
	}

	return status
}

const CODE_MAP: { [_: string]: DisconnectReason } = {
	conflict: DisconnectReason.connectionReplaced
}

/**
 * Stream errors generally provide a reason, map that to a baileys DisconnectReason
 * @param reason the string reason given, eg. "conflict"
 */
export const getErrorCodeFromStreamError = (node: BinaryNode) => {
	const [reasonNode] = getAllBinaryNodeChildren(node)
	let reason = reasonNode?.tag || 'unknown'
	const statusCode = +(node.attrs.code || CODE_MAP[reason] || DisconnectReason.badSession)

	if(statusCode === DisconnectReason.restartRequired) {
		reason = 'restart required'
	}

	return {
		reason,
		statusCode
	}
}

export const getCallStatusFromNode = ({ tag, attrs }: BinaryNode) => {
	let status: WACallUpdateType
	switch (tag) {
	case 'offer':
	case 'offer_notice':
		status = 'offer'
		break
	case 'terminate':
		if(attrs.reason === 'timeout') {
			status = 'timeout'
		} else {
			status = 'reject'
		}

		break
	case 'reject':
		status = 'reject'
		break
	case 'accept':
		status = 'accept'
		break
	default:
		status = 'ringing'
		break
	}

	return status
}

const UNEXPECTED_SERVER_CODE_TEXT = 'Unexpected server response: '

export const getCodeFromWSError = (error: Error) => {
	let statusCode = 500
	if(error.message.includes(UNEXPECTED_SERVER_CODE_TEXT)) {
		const code = +error.message.slice(UNEXPECTED_SERVER_CODE_TEXT.length)
		if(!Number.isNaN(code) && code >= 400) {
			statusCode = code
		}
	} else if((error as any).code?.startsWith('E')) { // handle ETIMEOUT, ENOTFOUND etc
		statusCode = 408
	}

	return statusCode
}

/**
 * Is the given platform WA business
 * @param platform AuthenticationCreds.platform
 */
export const isWABusinessPlatform = (platform: string) => {
	return platform === 'smbi' || platform === 'smba'
}