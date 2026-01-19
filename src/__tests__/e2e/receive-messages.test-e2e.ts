import { Boom } from '@hapi/boom'
import { jest } from '@jest/globals'
import P from 'pino'
import makeWASocket, {
	type BaileysEventMap,
	DisconnectReason,
	jidNormalizedUser,
	useMultiFileAuthState,
	type WAMessage
} from '../../index'

// Timeout de 5 minutos para teste de recebimento contínuo
jest.setTimeout(300_000)

// Funções auxiliares para monitoramento de recursos
interface MemoryMetrics {
	heapUsed: number
	heapTotal: number
	external: number
	rss: number
	arrayBuffers: number
}

interface CpuMetrics {
	user: number
	system: number
	total: number
}

interface MessageStats {
	total: number
	byType: Record<string, number>
	withMedia: number
	fromGroups: number
	fromIndividuals: number
}

interface PerformanceSnapshot {
	timestamp: number
	memory: MemoryMetrics
	cpu: CpuMetrics
	messageStats: MessageStats
}

interface TestReport {
	testName: string
	startTime: number
	endTime: number
	duration: number
	initialMemory: MemoryMetrics
	finalMemory: MemoryMetrics
	memoryDelta: MemoryMetrics
	cpuUsage: CpuMetrics
	messageStats: MessageStats
	snapshots: PerformanceSnapshot[]
	peakMemory: MemoryMetrics
}

function getMemoryUsage(): MemoryMetrics {
	const mem = process.memoryUsage()
	return {
		heapUsed: mem.heapUsed,
		heapTotal: mem.heapTotal,
		external: mem.external,
		rss: mem.rss,
		arrayBuffers: mem.arrayBuffers
	}
}

function getCpuUsage(cpuDelta?: NodeJS.CpuUsage): CpuMetrics {
	const cpu = cpuDelta || process.cpuUsage()
	return {
		user: cpu.user,
		system: cpu.system,
		total: cpu.user + cpu.system
	}
}

function formatBytes(bytes: number): string {
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function formatMicroseconds(microseconds: number): string {
	if (microseconds < 1000) {
		return `${microseconds.toFixed(2)}μs`
	} else if (microseconds < 1000000) {
		return `${(microseconds / 1000).toFixed(2)}ms`
	} else {
		return `${(microseconds / 1000000).toFixed(2)}s`
	}
}

function formatDuration(ms: number): string {
	if (ms < 1000) {
		return `${ms.toFixed(0)}ms`
	} else if (ms < 60000) {
		return `${(ms / 1000).toFixed(2)}s`
	} else {
		const minutes = Math.floor(ms / 60000)
		const seconds = ((ms % 60000) / 1000).toFixed(0)
		return `${minutes}m ${seconds}s`
	}
}

function createEmptyMessageStats(): MessageStats {
	return {
		total: 0,
		byType: {},
		withMedia: 0,
		fromGroups: 0,
		fromIndividuals: 0
	}
}

function updateMessageStats(stats: MessageStats, messages: WAMessage[]): void {
	for (const msg of messages) {
		stats.total++

		// Tipo de mensagem
		const messageType = Object.keys(msg.message || {})[0] || 'unknown'
		stats.byType[messageType] = (stats.byType[messageType] || 0) + 1

		// Mensagem com mídia
		const hasMedia =
			!!msg.message?.imageMessage ||
			!!msg.message?.videoMessage ||
			!!msg.message?.audioMessage ||
			!!msg.message?.documentMessage ||
			!!msg.message?.stickerMessage
		if (hasMedia) {
			stats.withMedia++
		}

		// Origem da mensagem
		if (msg.key.remoteJid?.endsWith('@g.us')) {
			stats.fromGroups++
		} else {
			stats.fromIndividuals++
		}
	}
}

class PerformanceMonitor {
	private snapshots: PerformanceSnapshot[] = []
	private messageStats: MessageStats = createEmptyMessageStats()
	private startTime = 0
	private initialCpu: NodeJS.CpuUsage | null = null
	private peakMemory: MemoryMetrics | null = null
	private snapshotInterval: NodeJS.Timeout | null = null

	start(): void {
		this.startTime = Date.now()
		this.initialCpu = process.cpuUsage()
		this.snapshots = []
		this.messageStats = createEmptyMessageStats()
		this.peakMemory = getMemoryUsage()

		// Captura snapshot a cada 10 segundos
		this.snapshotInterval = setInterval(() => {
			this.captureSnapshot()
		}, 10000)

		this.captureSnapshot()
	}

	stop(): void {
		if (this.snapshotInterval) {
			clearInterval(this.snapshotInterval)
			this.snapshotInterval = null
		}

		this.captureSnapshot()
	}

	private captureSnapshot(): void {
		const memory = getMemoryUsage()
		const cpuDelta = this.initialCpu ? process.cpuUsage(this.initialCpu) : process.cpuUsage()

		// Atualizar pico de memória
		if (!this.peakMemory || memory.heapUsed > this.peakMemory.heapUsed) {
			this.peakMemory = memory
		}

		this.snapshots.push({
			timestamp: Date.now() - this.startTime,
			memory,
			cpu: getCpuUsage(cpuDelta),
			messageStats: { ...this.messageStats }
		})
	}

	onMessagesReceived(messages: WAMessage[]): void {
		updateMessageStats(this.messageStats, messages)
	}

	getReport(testName: string, initialMemory: MemoryMetrics): TestReport {
		const finalMemory = getMemoryUsage()
		const finalCpu = this.initialCpu ? process.cpuUsage(this.initialCpu) : process.cpuUsage()
		const endTime = Date.now()

		return {
			testName,
			startTime: this.startTime,
			endTime,
			duration: endTime - this.startTime,
			initialMemory,
			finalMemory,
			memoryDelta: {
				heapUsed: finalMemory.heapUsed - initialMemory.heapUsed,
				heapTotal: finalMemory.heapTotal - initialMemory.heapTotal,
				external: finalMemory.external - initialMemory.external,
				rss: finalMemory.rss - initialMemory.rss,
				arrayBuffers: finalMemory.arrayBuffers - initialMemory.arrayBuffers
			},
			cpuUsage: getCpuUsage(finalCpu),
			messageStats: { ...this.messageStats },
			snapshots: [...this.snapshots],
			peakMemory: this.peakMemory || finalMemory
		}
	}
}

function printReport(report: TestReport): void {
	process.stdout.write(`\n\n${'='.repeat(100)}\n`)
	process.stdout.write(`📊 RELATÓRIO DE RECEBIMENTO DE MENSAGENS - ${report.testName}\n`)
	process.stdout.write(`${'='.repeat(100)}\n\n`)

	// Informações gerais
	process.stdout.write(`⏱️  Duração Total: ${formatDuration(report.duration)}\n`)
	process.stdout.write(`📅 Início: ${new Date(report.startTime).toLocaleString()}\n`)
	process.stdout.write(`📅 Fim: ${new Date(report.endTime).toLocaleString()}\n\n`)

	// Estatísticas de mensagens
	process.stdout.write(`📨 ESTATÍSTICAS DE MENSAGENS\n`)
	process.stdout.write(`${'─'.repeat(100)}\n`)
	process.stdout.write(`  Total de mensagens recebidas: ${report.messageStats.total}\n`)
	if (report.duration > 0) {
		process.stdout.write(`  Taxa média: ${(report.messageStats.total / (report.duration / 1000)).toFixed(2)} msgs/s\n`)
	}

	process.stdout.write(`  Mensagens de grupos: ${report.messageStats.fromGroups}\n`)
	process.stdout.write(`  Mensagens individuais: ${report.messageStats.fromIndividuals}\n`)
	process.stdout.write(`  Mensagens com mídia: ${report.messageStats.withMedia}\n\n`)

	if (Object.keys(report.messageStats.byType).length > 0) {
		process.stdout.write(`  Mensagens por tipo:\n`)
		const sortedTypes = Object.entries(report.messageStats.byType).sort((a, b) => b[1] - a[1])
		for (const [type, count] of sortedTypes) {
			const percentage = ((count / report.messageStats.total) * 100).toFixed(1)
			process.stdout.write(`    ${type.padEnd(25)} ${count.toString().padStart(6)} (${percentage}%)\n`)
		}

		process.stdout.write('\n')
	}

	// Métricas de memória
	process.stdout.write(`💾 ANÁLISE DE MEMÓRIA\n`)
	process.stdout.write(`${'─'.repeat(100)}\n`)
	process.stdout.write(`  Memória Inicial:\n`)
	process.stdout.write(`    Heap Usado: ${formatBytes(report.initialMemory.heapUsed)}\n`)
	process.stdout.write(`    Heap Total: ${formatBytes(report.initialMemory.heapTotal)}\n`)
	process.stdout.write(`    RSS: ${formatBytes(report.initialMemory.rss)}\n\n`)

	process.stdout.write(`  Memória Final:\n`)
	process.stdout.write(`    Heap Usado: ${formatBytes(report.finalMemory.heapUsed)}\n`)
	process.stdout.write(`    Heap Total: ${formatBytes(report.finalMemory.heapTotal)}\n`)
	process.stdout.write(`    RSS: ${formatBytes(report.finalMemory.rss)}\n\n`)

	process.stdout.write(`  Pico de Memória:\n`)
	process.stdout.write(`    Heap Usado: ${formatBytes(report.peakMemory.heapUsed)}\n`)
	process.stdout.write(`    RSS: ${formatBytes(report.peakMemory.rss)}\n\n`)

	process.stdout.write(`  Delta de Memória:\n`)
	const heapIcon = report.memoryDelta.heapUsed > 0 ? '⬆️' : '⬇️'
	const rssIcon = report.memoryDelta.rss > 0 ? '⬆️' : '⬇️'
	process.stdout.write(`    Heap Usado: ${formatBytes(Math.abs(report.memoryDelta.heapUsed))} ${heapIcon}\n`)
	process.stdout.write(
		`    Heap Total: ${formatBytes(Math.abs(report.memoryDelta.heapTotal))} ${report.memoryDelta.heapTotal > 0 ? '⬆️' : '⬇️'}\n`
	)
	process.stdout.write(`    RSS: ${formatBytes(Math.abs(report.memoryDelta.rss))} ${rssIcon}\n`)
	process.stdout.write(
		`    Array Buffers: ${formatBytes(Math.abs(report.memoryDelta.arrayBuffers))} ${report.memoryDelta.arrayBuffers > 0 ? '⬆️' : '⬇️'}\n\n`
	)

	// Análise de uso de memória
	if (report.messageStats.total > 0) {
		const memoryPerMessage = report.memoryDelta.heapUsed / report.messageStats.total
		process.stdout.write(`  Análise:\n`)
		process.stdout.write(`    Memória por mensagem: ${formatBytes(Math.abs(memoryPerMessage))}\n`)

		if (report.memoryDelta.heapUsed > 50 * 1024 * 1024) {
			process.stdout.write(`    ⚠️  ALERTA: Aumento significativo de memória (> 50MB)\n`)
		} else if (report.memoryDelta.heapUsed < 0) {
			process.stdout.write(`    ✅ Boa gestão de memória - GC funcionando corretamente\n`)
		}

		process.stdout.write('\n')
	}

	// Métricas de CPU
	process.stdout.write(`💻 USO DE CPU\n`)
	process.stdout.write(`${'─'.repeat(100)}\n`)
	process.stdout.write(`  User Time: ${formatMicroseconds(report.cpuUsage.user)}\n`)
	process.stdout.write(`  System Time: ${formatMicroseconds(report.cpuUsage.system)}\n`)
	process.stdout.write(`  Total Time: ${formatMicroseconds(report.cpuUsage.total)}\n`)
	if (report.duration > 0) {
		const cpuPercentage = (report.cpuUsage.total / 1000 / report.duration) * 100
		process.stdout.write(`  Utilização média: ${cpuPercentage.toFixed(2)}%\n`)
	}

	process.stdout.write('\n')

	// Histórico de snapshots
	if (report.snapshots.length > 1) {
		process.stdout.write(`📈 HISTÓRICO DE MONITORAMENTO (${report.snapshots.length} snapshots)\n`)
		process.stdout.write(`${'─'.repeat(100)}\n`)
		process.stdout.write(`  Tempo     Mensagens  Heap Usado    RSS         CPU User    CPU System\n`)
		process.stdout.write(`${'─'.repeat(100)}\n`)

		for (const snapshot of report.snapshots) {
			const time = formatDuration(snapshot.timestamp).padEnd(9)
			const msgs = snapshot.messageStats.total.toString().padStart(9)
			const heap = formatBytes(snapshot.memory.heapUsed).padEnd(13)
			const rss = formatBytes(snapshot.memory.rss).padEnd(11)
			const cpuUser = formatMicroseconds(snapshot.cpu.user).padEnd(11)
			const cpuSys = formatMicroseconds(snapshot.cpu.system).padEnd(11)

			process.stdout.write(`  ${time}  ${msgs}  ${heap}  ${rss}  ${cpuUser}  ${cpuSys}\n`)
		}

		process.stdout.write('\n')
	}

	// Análise final
	process.stdout.write(`🔍 ANÁLISE GERAL\n`)
	process.stdout.write(`${'─'.repeat(100)}\n`)

	const warnings: string[] = []
	const success: string[] = []

	// Verificações
	if (report.memoryDelta.heapUsed > 100 * 1024 * 1024) {
		warnings.push(`Vazamento de memória suspeito: +${formatBytes(report.memoryDelta.heapUsed)}`)
	} else if (report.memoryDelta.heapUsed < 0) {
		success.push(`Gestão eficiente de memória (redução de ${formatBytes(Math.abs(report.memoryDelta.heapUsed))})`)
	}

	if (report.messageStats.total === 0) {
		warnings.push('Nenhuma mensagem foi recebida durante o teste')
	} else {
		success.push(`${report.messageStats.total} mensagens processadas com sucesso`)
	}

	const peakIncrease = report.peakMemory.heapUsed - report.initialMemory.heapUsed
	if (peakIncrease > 200 * 1024 * 1024) {
		warnings.push(`Pico de memória muito alto: +${formatBytes(peakIncrease)}`)
	}

	if (success.length > 0) {
		process.stdout.write(`  ✅ Sucessos:\n`)
		for (const msg of success) {
			process.stdout.write(`     • ${msg}\n`)
		}

		process.stdout.write('\n')
	}

	if (warnings.length > 0) {
		process.stdout.write(`  ⚠️  Avisos:\n`)
		for (const msg of warnings) {
			process.stdout.write(`     • ${msg}\n`)
		}

		process.stdout.write('\n')
	}

	process.stdout.write(`${'='.repeat(100)}\n\n`)
}

describe('E2E Receive Messages Tests', () => {
	let sock: ReturnType<typeof makeWASocket>
	let meJid: string | undefined
	let monitor: PerformanceMonitor

	beforeAll(async () => {
		console.log(`\n🚀 Iniciando teste de recebimento de mensagens`)
		console.log(`⚙️  Node.js: ${process.version}`)
		console.log(`💻 Plataforma: ${process.platform} ${process.arch}\n`)

		const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
		const logger = P({ level: 'silent' })

		sock = makeWASocket({
			auth: state,
			logger
		})

		sock.ev.on('creds.update', saveCreds)

		await new Promise<void>((resolve, reject) => {
			sock.ev.on('connection.update', update => {
				const { connection, lastDisconnect } = update
				if (connection === 'open') {
					meJid = jidNormalizedUser(sock.user?.id)
					console.log(`✅ Conectado como: ${meJid}`)
					resolve()
				} else if (connection === 'close') {
					const reason = (lastDisconnect?.error as Boom)?.output?.statusCode
					if (reason === DisconnectReason.loggedOut) {
						console.error('❌ Logout detectado, delete a pasta baileys_auth_info e execute novamente')
					}

					if (lastDisconnect?.error) {
						reject(new Error(`Conexão fechada: ${DisconnectReason[reason] || 'unknown'}`))
					}
				}
			})
		})
	})

	afterAll(async () => {
		if (sock) {
			await sock.end(undefined)
		}
	})

	test('Monitor message receiving for 2 minutes', async () => {
		const testDuration = 120_000 // 2 minutos
		const initialMemory = getMemoryUsage()

		console.log(`\n📡 Iniciando monitoramento de recebimento de mensagens...`)
		console.log(`⏱️  Duração: ${formatDuration(testDuration)}`)
		console.log(`💾 Memória inicial: ${formatBytes(initialMemory.heapUsed)}\n`)

		monitor = new PerformanceMonitor()
		monitor.start()

		// Listener de mensagens
		const messageListener = (update: BaileysEventMap['messages.upsert']) => {
			const { messages, type } = update
			console.log(`📨 [${type}] Recebidas ${messages.length} mensagem(ns)`)

			for (const msg of messages) {
				const from = msg.key.remoteJid
				const messageType = Object.keys(msg.message || {})[0] || 'unknown'
				const fromMe = msg.key.fromMe ? '(eu)' : ''
				console.log(`   └─ ${from} ${fromMe}: ${messageType}`)
			}

			monitor.onMessagesReceived(messages)
		}

		sock.ev.on('messages.upsert', messageListener)

		// Aguardar o tempo de teste
		await new Promise(resolve => setTimeout(resolve, testDuration))

		// Remover listener
		sock.ev.off('messages.upsert', messageListener)

		monitor.stop()

		// Gerar relatório
		const report = monitor.getReport('Monitor 2 Minutes', initialMemory)
		printReport(report)

		// Asserções
		expect(sock.user).toBeDefined()
		// Não falhamos se não recebemos mensagens, apenas alertamos no relatório
	})

	test('Monitor message receiving for 5 minutes with detailed tracking', async () => {
		const testDuration = 300_000 // 5 minutos
		const initialMemory = getMemoryUsage()

		console.log(`\n📡 Iniciando monitoramento estendido de recebimento de mensagens...`)
		console.log(`⏱️  Duração: ${formatDuration(testDuration)}`)
		console.log(`💾 Memória inicial: ${formatBytes(initialMemory.heapUsed)}\n`)

		monitor = new PerformanceMonitor()
		monitor.start()

		let messageCount = 0

		// Listener de mensagens com mais detalhes
		const messageListener = (update: BaileysEventMap['messages.upsert']) => {
			const { messages, type } = update
			messageCount += messages.length

			console.log(`📨 [${type}] Total acumulado: ${messageCount} mensagem(ns)`)

			monitor.onMessagesReceived(messages)

			// Log periódico de memória a cada 50 mensagens
			if (messageCount % 50 === 0) {
				const currentMemory = getMemoryUsage()
				console.log(`   💾 Heap atual: ${formatBytes(currentMemory.heapUsed)}`)
			}
		}

		sock.ev.on('messages.upsert', messageListener)

		// Aguardar o tempo de teste
		await new Promise(resolve => setTimeout(resolve, testDuration))

		// Remover listener
		sock.ev.off('messages.upsert', messageListener)

		monitor.stop()

		// Gerar relatório
		const report = monitor.getReport('Monitor 5 Minutes Extended', initialMemory)
		printReport(report)

		// Asserções
		expect(sock.user).toBeDefined()
	})
})
