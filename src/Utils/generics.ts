import { Boom } from '@hapi/boom'
import { createHash, randomBytes } from 'crypto'
import { proto } from '../../WAProto/index.js'
const baileysVersion = [2, 3000, 1033105955]
import type {
	BaileysEventEmitter,
	BaileysEventMap,
	ConnectionState,
	WACallUpdateType,
	WAMessageKey,
	WAVersion
} from '../Types'
import { DisconnectReason } from '../Types'
import { type BinaryNode, getAllBinaryNodeChildren, jidDecode } from '../WABinary'
import { sha256 } from './crypto'

export const BufferJSON = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	replacer: (k: any, value: any) => {
		if (Buffer.isBuffer(value) || value instanceof Uint8Array || value?.type === 'Buffer') {
			return { type: 'Buffer', data: Buffer.from(value?.data || value).toString('base64') }
		}

		return value
	},

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	reviver: (_: any, value: any) => {
		if (typeof value === 'object' && value !== null && value.type === 'Buffer' && typeof value.data === 'string') {
			return Buffer.from(value.data, 'base64')
		}

		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			const keys = Object.keys(value)
			if (keys.length > 0 && keys.every(k => !isNaN(parseInt(k, 10)))) {
				const values = Object.values(value)
				if (values.every(v => typeof v === 'number')) {
					return Buffer.from(values)
				}
			}
		}

		return value
	}
}

export const getKeyAuthor = (key: WAMessageKey | undefined | null, meId = 'me') =>
	(key?.fromMe ? meId : key?.participantAlt || key?.remoteJidAlt || key?.participant || key?.remoteJid) || ''

export const isStringNullOrEmpty = (value: string | null | undefined): value is null | undefined | '' =>
	// eslint-disable-next-line eqeqeq
	value == null || value === ''

export const writeRandomPadMax16 = (msg: Uint8Array) => {
	const pad = randomBytes(1)
	const padLength = (pad[0]! & 0x0f) + 1

	return Buffer.concat([msg, Buffer.alloc(padLength, padLength)])
}

export const unpadRandomMax16 = (e: Uint8Array | Buffer) => {
	const t = new Uint8Array(e)
	if (0 === t.length) {
		throw new Error('unpadPkcs7 given empty bytes')
	}

	var r = t[t.length - 1]!
	if (r > t.length) {
		throw new Error(`unpad given ${t.length} bytes, but pad is ${r}`)
	}

	return new Uint8Array(t.buffer, t.byteOffset, t.length - r)
}

// code is inspired by whatsmeow
export const generateParticipantHashV2 = (participants: string[]): string => {
	participants.sort()
	const sha256Hash = sha256(Buffer.from(participants.join(''))).toString('base64')
	return '2:' + sha256Hash.slice(0, 6)
}

export const encodeWAMessage = (message: proto.IMessage) => writeRandomPadMax16(proto.Message.encode(message).finish())

export const generateRegistrationId = (): number => {
	return Uint16Array.from(randomBytes(2))[0]! & 16383
}

export const encodeBigEndian = (e: number, t = 4) => {
	let r = e
	const a = new Uint8Array(t)
	for (let i = t - 1; i >= 0; i--) {
		a[i] = 255 & r
		r >>>= 8
	}

	return a
}

export const toNumber = (t: Long | number | null | undefined): number =>
	typeof t === 'object' && t ? ('toNumber' in t ? t.toNumber() : (t as Long).low) : t || 0

/** unix timestamp of a date in seconds */
export const unixTimestampSeconds = (date: Date = new Date()) => Math.floor(date.getTime() / 1000)

export type DebouncedTimeout = ReturnType<typeof debouncedTimeout>

export const debouncedTimeout = (intervalMs = 1000, task?: () => void) => {
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
		setTask: (newTask: () => void) => (task = newTask),
		setInterval: (newInterval: number) => (intervalMs = newInterval)
	}
}

export const delay = (ms: number) => delayCancellable(ms).delay

export const delayCancellable = (ms: number) => {
	const stack = new Error().stack
	let timeout: NodeJS.Timeout
	let reject: (error: any) => void
	const delay: Promise<void> = new Promise((resolve, _reject) => {
		timeout = setTimeout(resolve, ms)
		reject = _reject
	})
	const cancel = () => {
		clearTimeout(timeout)
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

export async function promiseTimeout<T>(
	ms: number | undefined,
	promise: (resolve: (v: T) => void, reject: (error: any) => void) => void
) {
	if (!ms) {
		return new Promise(promise)
	}

	const stack = new Error().stack
	// Create a promise that rejects in <ms> milliseconds
	const { delay, cancel } = delayCancellable(ms)
	const p = new Promise((resolve, reject) => {
		delay
			.then(() =>
				reject(
					new Boom('Timed Out', {
						statusCode: DisconnectReason.timedOut,
						data: {
							stack
						}
					})
				)
			)
			.catch(err => reject(err))

		promise(resolve, reject)
	}).finally(cancel)
	return p as Promise<T>
}

// inspired from whatsmeow code
// https://github.com/tulir/whatsmeow/blob/64bc969fbe78d31ae0dd443b8d4c80a5d026d07a/send.go#L42
export const generateMessageIDV2 = (userId?: string): string => {
	const data = Buffer.alloc(8 + 20 + 16)
	data.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 1000)))

	if (userId) {
		const id = jidDecode(userId)
		if (id?.user) {
			data.write(id.user, 8)
			data.write('@c.us', 8 + id.user.length)
		}
	}

	const random = randomBytes(16)
	random.copy(data, 28)

	const hash = createHash('sha256').update(data).digest()
	return '3EB0' + hash.toString('hex').toUpperCase().substring(0, 18)
}

// generate a random ID to attach to a message
export const generateMessageID = () => '3EB0' + randomBytes(18).toString('hex').toUpperCase()

export function bindWaitForEvent<T extends keyof BaileysEventMap>(ev: BaileysEventEmitter, event: T) {
	return async (check: (u: BaileysEventMap[T]) => Promise<boolean | undefined>, timeoutMs?: number) => {
		let listener: (item: BaileysEventMap[T]) => void
		let closeListener: (state: Partial<ConnectionState>) => void
		await promiseTimeout<void>(timeoutMs, (resolve, reject) => {
			closeListener = ({ connection, lastDisconnect }) => {
				if (connection === 'close') {
					reject(
						lastDisconnect?.error || new Boom('Connection Closed', { statusCode: DisconnectReason.connectionClosed })
					)
				}
			}

			ev.on('connection.update', closeListener)
			listener = async update => {
				if (await check(update)) {
					resolve()
				}
			}

			ev.on(event, listener)
		}).finally(() => {
			ev.off(event, listener)
			ev.off('connection.update', closeListener)
		})
	}
}

export const bindWaitForConnectionUpdate = (ev: BaileysEventEmitter) => bindWaitForEvent(ev, 'connection.update')

/**
 * utility that fetches latest baileys version from the master branch.
 * Use to ensure your WA connection is always on the latest version
 */
export const fetchLatestBaileysVersion = async (options: RequestInit = {}) => {
	const URL = 'https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/index.ts'
	try {
		const response = await fetch(URL, {
			dispatcher: options.dispatcher,
			method: 'GET',
			headers: options.headers
		})
		if (!response.ok) {
			throw new Boom(`Failed to fetch latest Baileys version: ${response.statusText}`, { statusCode: response.status })
		}

		const text = await response.text()
		// Extract version from line 7 (const version = [...])
		const lines = text.split('\n')
		const versionLine = lines[6] // Line 7 (0-indexed)
		const versionMatch = versionLine!.match(/const version = \[(\d+),\s*(\d+),\s*(\d+)\]/)

		if (versionMatch) {
			const version = [parseInt(versionMatch[1]!), parseInt(versionMatch[2]!), parseInt(versionMatch[3]!)] as WAVersion

			return {
				version,
				isLatest: true
			}
		} else {
			throw new Error('Could not parse version from Defaults/index.ts')
		}
	} catch (error) {
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
export const fetchLatestWaWebVersion = async (options: RequestInit = {}) => {
	try {
		// Absolute minimal headers required to bypass anti-bot detection
		const defaultHeaders = {
			'sec-fetch-site': 'none',
			'user-agent':
				'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
		}

		const headers = { ...defaultHeaders, ...options.headers }

		const response = await fetch('https://web.whatsapp.com/sw.js', {
			...options,
			method: 'GET',
			headers
		})

		if (!response.ok) {
			throw new Boom(`Failed to fetch sw.js: ${response.statusText}`, { statusCode: response.status })
		}

		const data = await response.text()

		const regex = /\\?"client_revision\\?":\s*(\d+)/
		const match = data.match(regex)

		if (!match?.[1]) {
			return {
				version: baileysVersion as WAVersion,
				isLatest: false,
				error: {
					message: 'Could not find client revision in the fetched content'
				}
			}
		}

		const clientRevision = match[1]

		return {
			version: [2, 3000, +clientRevision] as WAVersion,
			isLatest: true
		}
	} catch (error) {
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
	sender: proto.WebMessageInfo.Status.SERVER_ACK,
	played: proto.WebMessageInfo.Status.PLAYED,
	read: proto.WebMessageInfo.Status.READ,
	'read-self': proto.WebMessageInfo.Status.READ
}
/**
 * Given a type of receipt, returns what the new status of the message should be
 * @param type type from receipt
 */
export const getStatusFromReceiptType = (type: string | undefined) => {
	const status = STATUS_MAP[type!]
	if (typeof type === 'undefined') {
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

	if (statusCode === DisconnectReason.restartRequired) {
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
			if (attrs.reason === 'timeout') {
				status = 'timeout'
			} else {
				//fired when accepted/rejected/timeout/caller hangs up
				status = 'terminate'
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
	if (error?.message?.includes(UNEXPECTED_SERVER_CODE_TEXT)) {
		const code = +error?.message.slice(UNEXPECTED_SERVER_CODE_TEXT.length)
		if (!Number.isNaN(code) && code >= 400) {
			statusCode = code
		}
	} else if (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(error as any)?.code?.startsWith('E') ||
		error?.message?.includes('timed out')
	) {
		// handle ETIMEOUT, ENOTFOUND etc
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function trimUndefined(obj: { [_: string]: any }) {
	for (const key in obj) {
		if (typeof obj[key] === 'undefined') {
			delete obj[key]
		}
	}

	return obj
}

const CROCKFORD_CHARACTERS = '123456789ABCDEFGHJKLMNPQRSTVWXYZ'

export function bytesToCrockford(buffer: Buffer): string {
	let value = 0
	let bitCount = 0
	const crockford: string[] = []

	for (const element of buffer) {
		value = (value << 8) | (element & 0xff)
		bitCount += 8

		while (bitCount >= 5) {
			crockford.push(CROCKFORD_CHARACTERS.charAt((value >>> (bitCount - 5)) & 31))
			bitCount -= 5
		}
	}

	if (bitCount > 0) {
		crockford.push(CROCKFORD_CHARACTERS.charAt((value << (5 - bitCount)) & 31))
	}

	return crockford.join('')
}

export function encodeNewsletterMessage(message: proto.IMessage): Uint8Array {
	return proto.Message.encode(message).finish()
}
