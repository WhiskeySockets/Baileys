import { Boom } from '@hapi/boom'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'
import P from 'pino'
import makeWASocket, { DisconnectReason, useSqliteAuthState } from '../lib/index.js'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const AUTH_FOLDER = 'baileys_auth_info_bench'
const SOCKET_URL = process.env.SOCKET_URL ?? 'wss://127.0.0.1:8080/ws/chat'
const MOCK_PHONE_ADMIN_PATH = '/admin/mock-phone/scan-qr'
const TERMINAL_DISCONNECT_REASONS = [
	DisconnectReason.loggedOut,
	DisconnectReason.connectionReplaced,
	DisconnectReason.connectionClosed
]

function postQrToMockPhone(socketUrl: string, qr: string): Promise<void> {
	const adminUrl = new URL(socketUrl)
	adminUrl.protocol = adminUrl.protocol === 'wss:' ? 'https:' : 'http:'
	const isHttps = adminUrl.protocol === 'https:'
	const request = isHttps ? httpsRequest : httpRequest

	return new Promise((resolve, reject) => {
		const req = request(
			{
				host: adminUrl.hostname,
				port: adminUrl.port,
				path: MOCK_PHONE_ADMIN_PATH,
				method: 'POST',
				...(isHttps ? { rejectUnauthorized: false } : {})
			},
			res => {
				res.resume()
				const status = res.statusCode ?? 0
				if (status >= 200 && status < 300) {
					resolve()
				} else {
					reject(new Error(`mock-phone ${MOCK_PHONE_ADMIN_PATH} returned ${status}`))
				}
			}
		)
		req.on('error', reject)
		req.write(qr)
		req.end()
	})
}

interface BenchmarkResult {
	durationMs: number
	userCpuMs: number
	systemCpuMs: number
	totalCpuMs: number
	cpuPercent: number
	heapUsedStart: number
	heapUsedEnd: number
	heapUsedDiff: number
	heapTotalStart: number
	heapTotalEnd: number
	heapTotalDiff: number
	rssStart: number
	rssEnd: number
	rssDiff: number
}

interface BenchmarkTracking {
	cpuUsage: NodeJS.CpuUsage
	time: bigint
	memory: NodeJS.MemoryUsage
}

function parseArgs(): { runs: number } {
	const runsArg = process.argv.find(arg => arg.startsWith('--runs='))
	const runs = runsArg ? parseInt(runsArg.split('=')[1], 10) : 1
	if (isNaN(runs) || runs < 1) {
		console.error('Invalid --runs value. Must be a positive integer.')
		process.exit(1)
	}
	return { runs }
}

function formatBytes(bytes: number): string {
	const mb = bytes / 1024 / 1024
	return `${mb.toFixed(2)} MB`
}

function median(values: number[]): number {
	if (values.length === 0) return 0
	const sorted = [...values].sort((a, b) => a - b)
	const mid = Math.floor(sorted.length / 2)
	if (sorted.length % 2 === 0) {
		return (sorted[mid - 1] + sorted[mid]) / 2
	}
	return sorted[mid]
}

function runGC(): void {
	if (global.gc) {
		global.gc()
	}
}

function cleanAuthFolder(): void {
	if (fs.existsSync(AUTH_FOLDER)) {
		fs.rmSync(AUTH_FOLDER, { recursive: true })
	}
}

function captureResult(tracking: BenchmarkTracking): BenchmarkResult {
	const endCpuUsage = process.cpuUsage(tracking.cpuUsage)
	runGC()
	const endMemory = process.memoryUsage()
	const elapsedNs = process.hrtime.bigint() - tracking.time
	const durationMs = Number(elapsedNs) / 1_000_000

	const userCpuMs = endCpuUsage.user / 1000
	const systemCpuMs = endCpuUsage.system / 1000
	const totalCpuMs = userCpuMs + systemCpuMs
	const cpuPercent = (totalCpuMs / durationMs) * 100

	return {
		durationMs,
		userCpuMs,
		systemCpuMs,
		totalCpuMs,
		cpuPercent,
		heapUsedStart: tracking.memory.heapUsed,
		heapUsedEnd: endMemory.heapUsed,
		heapUsedDiff: endMemory.heapUsed - tracking.memory.heapUsed,
		heapTotalStart: tracking.memory.heapTotal,
		heapTotalEnd: endMemory.heapTotal,
		heapTotalDiff: endMemory.heapTotal - tracking.memory.heapTotal,
		rssStart: tracking.memory.rss,
		rssEnd: endMemory.rss,
		rssDiff: endMemory.rss - tracking.memory.rss
	}
}

function buildMemoryTable(
	heapUsed: { start: number; end: number; diff: number },
	heapTotal: { start: number; end: number; diff: number },
	rss: { start: number; end: number; diff: number }
): Record<string, { Start: string; End: string; Diff: string }> {
	return {
		'Heap Used': {
			Start: formatBytes(heapUsed.start),
			End: formatBytes(heapUsed.end),
			Diff: formatBytes(heapUsed.diff)
		},
		'Heap Total': {
			Start: formatBytes(heapTotal.start),
			End: formatBytes(heapTotal.end),
			Diff: formatBytes(heapTotal.diff)
		},
		RSS: {
			Start: formatBytes(rss.start),
			End: formatBytes(rss.end),
			Diff: formatBytes(rss.diff)
		}
	}
}

function printSingleRunSummary(run: number, totalRuns: number, result: BenchmarkResult): void {
	console.log(
		`Run ${run}/${totalRuns} completed - ` +
			`Duration: ${(result.durationMs / 1000).toFixed(2)}s, ` +
			`CPU: ${result.totalCpuMs.toFixed(0)}ms (${result.cpuPercent.toFixed(1)}%), ` +
			`Heap Diff: ${formatBytes(result.heapUsedDiff)}`
	)
}

function printAggregatedResults(results: BenchmarkResult[]): void {
	if (results.length === 0) return

	if (results.length === 1) {
		const r = results[0]
		console.log('\n========== BENCHMARK STATS ==========')
		console.log(`Duration: ${(r.durationMs / 1000).toFixed(2)}s\n`)

		console.log('CPU Usage:')
		console.table({
			'User CPU': `${r.userCpuMs.toFixed(2)} ms`,
			'System CPU': `${r.systemCpuMs.toFixed(2)} ms`,
			'Total CPU': `${r.totalCpuMs.toFixed(2)} ms`,
			'CPU %': `${r.cpuPercent.toFixed(2)}%`
		})

		console.log('Memory:')
		console.table(
			buildMemoryTable(
				{ start: r.heapUsedStart, end: r.heapUsedEnd, diff: r.heapUsedDiff },
				{ start: r.heapTotalStart, end: r.heapTotalEnd, diff: r.heapTotalDiff },
				{ start: r.rssStart, end: r.rssEnd, diff: r.rssDiff }
			)
		)
		return
	}

	console.log(`\n========== AGGREGATED RESULTS (${results.length} runs) ==========\n`)

	console.log('CPU Usage (median):')
	console.table({
		Duration: `${(median(results.map(r => r.durationMs)) / 1000).toFixed(2)} s`,
		'User CPU': `${median(results.map(r => r.userCpuMs)).toFixed(2)} ms`,
		'System CPU': `${median(results.map(r => r.systemCpuMs)).toFixed(2)} ms`,
		'Total CPU': `${median(results.map(r => r.totalCpuMs)).toFixed(2)} ms`,
		'CPU %': `${median(results.map(r => r.cpuPercent)).toFixed(2)}%`
	})

	console.log('Memory (median):')
	console.table(
		buildMemoryTable(
			{
				start: median(results.map(r => r.heapUsedStart)),
				end: median(results.map(r => r.heapUsedEnd)),
				diff: median(results.map(r => r.heapUsedDiff))
			},
			{
				start: median(results.map(r => r.heapTotalStart)),
				end: median(results.map(r => r.heapTotalEnd)),
				diff: median(results.map(r => r.heapTotalDiff))
			},
			{
				start: median(results.map(r => r.rssStart)),
				end: median(results.map(r => r.rssEnd)),
				diff: median(results.map(r => r.rssDiff))
			}
		)
	)
}

const { runs: totalRuns } = parseArgs()
const results: BenchmarkResult[] = []
let currentRun = 0
let tracking: BenchmarkTracking | null = null

const logger = P({ level: process.env.LOG_LEVEL ?? 'warn' })

cleanAuthFolder()
console.log(`Removed ${AUTH_FOLDER} for clean state`)

function finishCurrentRun(): void {
	if (tracking) {
		const result = captureResult(tracking)
		results.push(result)
		printSingleRunSummary(currentRun, totalRuns, result)
		tracking = null
	}
}

function handleShutdown(): void {
	finishCurrentRun()
	printAggregatedResults(results)
	process.exit(0)
}

process.on('SIGINT', handleShutdown)
process.on('SIGTERM', handleShutdown)

async function startBenchmark(auth?: { state: any; saveCreds: () => Promise<void>; close: () => void; }): Promise<void> {
	if (!auth) {
		auth = await useSqliteAuthState({dbPath: ':memory:'})
	}
	const { state, saveCreds, close: dbClose } = auth


	const sock = makeWASocket({
		logger,
		auth: state,
		waWebSocketUrl: SOCKET_URL,
		pushName: `baileys-bench-${randomUUID()}`
	})

	sock.ev.on('creds.update', saveCreds)

	let qrScanned = false

	sock.ev.process(async events => {
		if (events['connection.update']) {
			const { connection, lastDisconnect, qr } = events['connection.update']

			if (qr && !qrScanned) {
				qrScanned = true
				try {
					await postQrToMockPhone(SOCKET_URL, qr)
					console.log('QR posted to mock-phone')
				} catch (err) {
					console.error('Failed to pair with mock-phone:', err)
				}
			}

			if (connection === 'close') {
				const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
				console.log(`Disconnected: ${connection} with code ${statusCode}`)

				// Transient close (WhatsApp's post-pair 515 "restart
				// required", network blips, etc.): keep the SQLite handle
				// open so the next socket can keep using the same auth.
				// Closing here would crash `saveCreds` on the very next
				// `creds.update` emission.
				if (!TERMINAL_DISCONNECT_REASONS.includes(statusCode!)) {
					startBenchmark(auth)
					return
				}

				finishCurrentRun()

				// Terminal close: between runs we want a fresh auth state,
				// so close the db and let the next `startBenchmark` call
				// (with no `auth` arg) build a new one.
				dbClose()

				if (currentRun < totalRuns) {
					cleanAuthFolder()
					startBenchmark()
				} else {
					printAggregatedResults(results)
					process.exit(0)
				}
			} else if (connection === 'open') {
				currentRun++
				console.log(`\nRun ${currentRun}/${totalRuns} - Connected, ready for ping/pong benchmark`)

				runGC()
				tracking = {
					cpuUsage: process.cpuUsage(),
					memory: process.memoryUsage(),
					time: process.hrtime.bigint()
				}
			}
		}

		if (events['messages.upsert']) {
			const { messages, type } = events['messages.upsert']
			if (type !== 'notify') return

			for (const msg of messages) {
				const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text
				if (text === 'ping') {
					await sock.sendMessage(msg.key.remoteJid!, { text: `pong ${msg.key.id}` })
				}
			}
		}
	})
}

console.log(`Starting benchmark with ${totalRuns} run(s)...`)
startBenchmark()
