/**
 * Opt-in NDJSON profiling for USync / device fan-out (timings + numeric summaries).
 *
 * Enable via socket config:
 *
 * ```ts
 * makeWASocket({
 *   auth: ...,
 *   baileysInstrumentation: { logPath: 'logs/baileys-instrumentation.ndjson' }
 * })
 * ```
 *
 * Lines are JSON objects (one per row). Raw USync/XML wire payloads are not written.
 */
import { mkdir, appendFile } from 'fs/promises'
import path from 'path'
import type { BinaryNode } from '../WABinary'
import type { BaileysFileInstrumentationConfig } from '../Types'
import type { USyncQueryResult } from '../WAUSync/USyncQuery'
import type { ParsedDeviceInfo } from '../WAUSync/Protocols/USyncDeviceProtocol'
import type { ILogger } from './logger'

let activePath: string | undefined
let writeChain: Promise<void> = Promise.resolve()
let instrumentationLogger: ILogger | undefined

export function configureBaileysFileInstrumentation(
	config: BaileysFileInstrumentationConfig | undefined,
	logger?: ILogger
): void {
	instrumentationLogger = logger
	activePath = config?.logPath
		? path.isAbsolute(config.logPath)
			? config.logPath
			: path.join(process.cwd(), config.logPath)
		: undefined

	if (activePath) {
		instrumentationLogger?.info(
			{
				configuredLogPath: config?.logPath,
				resolvedLogPath: activePath
			},
			'baileysInstrumentation enabled'
		)
		writeChain = mkdir(path.dirname(activePath), { recursive: true }).then(() => {})
		// Write a bootstrap line so the file is created immediately when enabled.
		logBaileysFileInstrumentation({
			event: 'baileysInstrumentation.enabled',
			configuredLogPath: config?.logPath,
			resolvedLogPath: activePath,
			processCwd: process.cwd()
		})
	} else {
		instrumentationLogger?.debug('baileysInstrumentation disabled (no logPath provided)')
	}
}

export function logBaileysFileInstrumentation(record: Record<string, unknown>): void {
	if (!activePath) {
		return
	}

	const line = JSON.stringify({ ts: new Date().toISOString(), ...record }) + '\n'
	instrumentationLogger?.debug({ record }, 'baileysInstrumentation event')
	instrumentationLogger?.debug({ path: activePath, event: record.event }, 'baileysInstrumentation append queued')
	writeChain = writeChain
		.then(() => appendFile(activePath!, line, 'utf8'))
		.then(() => {
			instrumentationLogger?.debug(
				{ path: activePath, bytes: Buffer.byteLength(line, 'utf8'), event: record.event },
				'baileysInstrumentation append success'
			)
		})
		.catch(err => {
			instrumentationLogger?.error({ err, path: activePath, event: record.event }, 'baileysInstrumentation append failed')
		})
}

/** Rough byte estimate of an parsed IQ / node tree (attrs + strings + binary blobs); for comparing response bulk. */
export function estimateBinaryNodeFootprint(node: BinaryNode | undefined): number {
	if (!node) {
		return 0
	}

	let n = (node.tag?.length ?? 0) + 32

	for (const [k, v] of Object.entries(node.attrs || {})) {
		n += k.length + String(v).length
	}

	const c = node.content
	if (!c) {
		return n
	}

	if (typeof c === 'string') {
		return n + c.length * 2
	}

	if (c instanceof Uint8Array) {
		return n + c.byteLength
	}

	if (Array.isArray(c)) {
		for (const child of c) {
			if (child && typeof child === 'object' && 'tag' in child) {
				n += estimateBinaryNodeFootprint(child as BinaryNode)
			}
		}
	}

	return n
}

export function summarizeUsyncDeviceDistribution(parsed: USyncQueryResult | undefined): Record<string, number | undefined> {
	if (!parsed?.list?.length) {
		return {
			usyncUsersReturned: 0,
			usyncTotalDevices: 0,
			usyncUsersZeroDevices: undefined,
			usyncMaxDevicesPerUser: undefined
		}
	}

	const counts = parsed.list.map(entry => {
		const devices = entry.devices as ParsedDeviceInfo | undefined
		return devices?.deviceList?.length ?? 0
	})

	const totalDevices = counts.reduce((a, b) => a + b, 0)
	const asc = [...counts].sort((a, b) => a - b)
	const pick = (q: number) =>
		asc.length ? asc[Math.min(asc.length - 1, Math.floor(q * (asc.length - 1)))]! : undefined

	return {
		usyncUsersReturned: parsed.list.length,
		usyncTotalDevices: totalDevices,
		usyncUsersZeroDevices: counts.filter(x => x === 0).length,
		usyncMaxDevicesPerUser: counts.length ? Math.max(...counts) : undefined,
		usyncP50DevicesPerUser: pick(0.5),
		usyncP90DevicesPerUser: pick(0.9)
	}
}
