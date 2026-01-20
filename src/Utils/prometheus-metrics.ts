/**
 * @fileoverview Exposição de métricas no formato Prometheus
 * @module Utils/prometheus-metrics
 *
 * Fornece:
 * - Counters para contagem de eventos
 * - Gauges para valores instantâneos
 * - Histograms para distribuição de valores
 * - Summaries para percentis
 * - Endpoint /metrics pronto para scraping
 * - Labels dinâmicas
 * - Integração com Baileys events
 *
 * Nota: Funciona de forma standalone sem prom-client,
 * mas pode ser integrado com prom-client se disponível.
 */

/**
 * Tipo de métrica
 */
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary'

/**
 * Labels para métricas
 */
export type Labels = Record<string, string>

/**
 * Buckets padrão para histogramas (em ms)
 */
export const DEFAULT_BUCKETS = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]

/**
 * Percentis padrão para summaries
 */
export const DEFAULT_PERCENTILES = [0.5, 0.9, 0.95, 0.99]

/**
 * Interface base para métricas
 */
export interface BaseMetric {
	name: string
	help: string
	type: MetricType
	labelNames: string[]
}

/**
 * Valor de uma métrica com labels
 */
export interface MetricValue {
	labels: Labels
	value: number
	timestamp?: number
}

/**
 * Valores de histograma
 */
export interface HistogramValue {
	labels: Labels
	buckets: Map<number, number>
	sum: number
	count: number
}

/**
 * Valores de summary
 */
export interface SummaryValue {
	labels: Labels
	values: number[]
	sum: number
	count: number
}

/**
 * Classe Counter - incrementa monotonicamente
 */
export class Counter implements BaseMetric {
	readonly type = 'counter' as const
	private values: Map<string, MetricValue> = new Map()

	constructor(
		public name: string,
		public help: string,
		public labelNames: string[] = []
	) {}

	/**
	 * Incrementa o counter
	 */
	inc(labelsOrValue?: Labels | number, value?: number): void {
		let labels: Labels = {}
		let incValue = 1

		if (typeof labelsOrValue === 'number') {
			incValue = labelsOrValue
		} else if (labelsOrValue) {
			labels = labelsOrValue
			incValue = value ?? 1
		}

		const key = this.labelsToKey(labels)
		const existing = this.values.get(key)

		if (existing) {
			existing.value += incValue
			existing.timestamp = Date.now()
		} else {
			this.values.set(key, {
				labels,
				value: incValue,
				timestamp: Date.now(),
			})
		}
	}

	/**
	 * Retorna valor atual
	 */
	get(labels: Labels = {}): number {
		const key = this.labelsToKey(labels)
		return this.values.get(key)?.value ?? 0
	}

	/**
	 * Reseta o counter
	 */
	reset(labels?: Labels): void {
		if (labels) {
			const key = this.labelsToKey(labels)
			this.values.delete(key)
		} else {
			this.values.clear()
		}
	}

	/**
	 * Retorna todos os valores
	 */
	getValues(): MetricValue[] {
		return Array.from(this.values.values())
	}

	private labelsToKey(labels: Labels): string {
		return JSON.stringify(labels)
	}

	/**
	 * Cria versão com labels pré-definidas
	 */
	labels(labels: Labels): { inc: (value?: number) => void } {
		return {
			inc: (value?: number) => this.inc(labels, value),
		}
	}
}

/**
 * Classe Gauge - valor que pode aumentar e diminuir
 */
export class Gauge implements BaseMetric {
	readonly type = 'gauge' as const
	private values: Map<string, MetricValue> = new Map()

	constructor(
		public name: string,
		public help: string,
		public labelNames: string[] = []
	) {}

	/**
	 * Define valor
	 */
	set(labelsOrValue: Labels | number, value?: number): void {
		let labels: Labels = {}
		let setValue: number

		if (typeof labelsOrValue === 'number') {
			setValue = labelsOrValue
		} else {
			labels = labelsOrValue
			setValue = value ?? 0
		}

		const key = this.labelsToKey(labels)
		this.values.set(key, {
			labels,
			value: setValue,
			timestamp: Date.now(),
		})
	}

	/**
	 * Incrementa valor
	 */
	inc(labelsOrValue?: Labels | number, value?: number): void {
		let labels: Labels = {}
		let incValue = 1

		if (typeof labelsOrValue === 'number') {
			incValue = labelsOrValue
		} else if (labelsOrValue) {
			labels = labelsOrValue
			incValue = value ?? 1
		}

		const key = this.labelsToKey(labels)
		const existing = this.values.get(key)
		const currentValue = existing?.value ?? 0

		this.set(labels, currentValue + incValue)
	}

	/**
	 * Decrementa valor
	 */
	dec(labelsOrValue?: Labels | number, value?: number): void {
		let labels: Labels = {}
		let decValue = 1

		if (typeof labelsOrValue === 'number') {
			decValue = labelsOrValue
		} else if (labelsOrValue) {
			labels = labelsOrValue
			decValue = value ?? 1
		}

		const key = this.labelsToKey(labels)
		const existing = this.values.get(key)
		const currentValue = existing?.value ?? 0

		this.set(labels, currentValue - decValue)
	}

	/**
	 * Define para timestamp atual
	 */
	setToCurrentTime(labels: Labels = {}): void {
		this.set(labels, Date.now() / 1000)
	}

	/**
	 * Retorna valor atual
	 */
	get(labels: Labels = {}): number {
		const key = this.labelsToKey(labels)
		return this.values.get(key)?.value ?? 0
	}

	/**
	 * Reseta o gauge
	 */
	reset(labels?: Labels): void {
		if (labels) {
			const key = this.labelsToKey(labels)
			this.values.delete(key)
		} else {
			this.values.clear()
		}
	}

	/**
	 * Retorna todos os valores
	 */
	getValues(): MetricValue[] {
		return Array.from(this.values.values())
	}

	private labelsToKey(labels: Labels): string {
		return JSON.stringify(labels)
	}

	/**
	 * Cria versão com labels pré-definidas
	 */
	labels(labels: Labels): {
		set: (value: number) => void
		inc: (value?: number) => void
		dec: (value?: number) => void
	} {
		return {
			set: (value: number) => this.set(labels, value),
			inc: (value?: number) => this.inc(labels, value),
			dec: (value?: number) => this.dec(labels, value),
		}
	}

	/**
	 * Timer helper - retorna função para parar e registrar duração
	 */
	startTimer(labels: Labels = {}): () => number {
		const start = process.hrtime.bigint()
		return () => {
			const duration = Number(process.hrtime.bigint() - start) / 1_000_000_000 // segundos
			this.set(labels, duration)
			return duration
		}
	}
}

/**
 * Classe Histogram - distribuição de valores em buckets
 */
export class Histogram implements BaseMetric {
	readonly type = 'histogram' as const
	private values: Map<string, HistogramValue> = new Map()
	private buckets: number[]

	constructor(
		public name: string,
		public help: string,
		public labelNames: string[] = [],
		buckets: number[] = DEFAULT_BUCKETS
	) {
		this.buckets = [...buckets].sort((a, b) => a - b)
	}

	/**
	 * Observa um valor
	 */
	observe(labelsOrValue: Labels | number, value?: number): void {
		let labels: Labels = {}
		let observeValue: number

		if (typeof labelsOrValue === 'number') {
			observeValue = labelsOrValue
		} else {
			labels = labelsOrValue
			observeValue = value ?? 0
		}

		const key = this.labelsToKey(labels)
		let histValue = this.values.get(key)

		if (!histValue) {
			histValue = {
				labels,
				buckets: new Map(this.buckets.map((b) => [b, 0])),
				sum: 0,
				count: 0,
			}
			this.values.set(key, histValue)
		}

		// Incrementar buckets apropriados
		for (const bucket of this.buckets) {
			if (observeValue <= bucket) {
				histValue.buckets.set(bucket, (histValue.buckets.get(bucket) ?? 0) + 1)
			}
		}

		histValue.sum += observeValue
		histValue.count++
	}

	/**
	 * Timer helper
	 */
	startTimer(labels: Labels = {}): () => number {
		const start = process.hrtime.bigint()
		return () => {
			const duration = Number(process.hrtime.bigint() - start) / 1_000_000 // ms
			this.observe(labels, duration)
			return duration
		}
	}

	/**
	 * Retorna valores do histogram
	 */
	get(labels: Labels = {}): HistogramValue | undefined {
		const key = this.labelsToKey(labels)
		return this.values.get(key)
	}

	/**
	 * Reseta o histogram
	 */
	reset(labels?: Labels): void {
		if (labels) {
			const key = this.labelsToKey(labels)
			this.values.delete(key)
		} else {
			this.values.clear()
		}
	}

	/**
	 * Retorna todos os valores
	 */
	getValues(): HistogramValue[] {
		return Array.from(this.values.values())
	}

	/**
	 * Retorna buckets configurados
	 */
	getBuckets(): number[] {
		return [...this.buckets]
	}

	private labelsToKey(labels: Labels): string {
		return JSON.stringify(labels)
	}

	/**
	 * Cria versão com labels pré-definidas
	 */
	labels(labels: Labels): {
		observe: (value: number) => void
		startTimer: () => () => number
	} {
		return {
			observe: (value: number) => this.observe(labels, value),
			startTimer: () => this.startTimer(labels),
		}
	}
}

/**
 * Classe Summary - percentis de valores
 */
export class Summary implements BaseMetric {
	readonly type = 'summary' as const
	private values: Map<string, SummaryValue> = new Map()
	private percentiles: number[]
	private maxAge: number // ms
	private maxSize: number

	constructor(
		public name: string,
		public help: string,
		public labelNames: string[] = [],
		options: { percentiles?: number[]; maxAge?: number; maxSize?: number } = {}
	) {
		this.percentiles = options.percentiles ?? DEFAULT_PERCENTILES
		this.maxAge = options.maxAge ?? 600000 // 10 min
		this.maxSize = options.maxSize ?? 1000
	}

	/**
	 * Observa um valor
	 */
	observe(labelsOrValue: Labels | number, value?: number): void {
		let labels: Labels = {}
		let observeValue: number

		if (typeof labelsOrValue === 'number') {
			observeValue = labelsOrValue
		} else {
			labels = labelsOrValue
			observeValue = value ?? 0
		}

		const key = this.labelsToKey(labels)
		let summaryValue = this.values.get(key)

		if (!summaryValue) {
			summaryValue = {
				labels,
				values: [],
				sum: 0,
				count: 0,
			}
			this.values.set(key, summaryValue)
		}

		summaryValue.values.push(observeValue)
		summaryValue.sum += observeValue
		summaryValue.count++

		// Limitar tamanho
		if (summaryValue.values.length > this.maxSize) {
			const removed = summaryValue.values.shift()
			if (removed !== undefined) {
				summaryValue.sum -= removed
				summaryValue.count--
			}
		}
	}

	/**
	 * Timer helper
	 */
	startTimer(labels: Labels = {}): () => number {
		const start = process.hrtime.bigint()
		return () => {
			const duration = Number(process.hrtime.bigint() - start) / 1_000_000 // ms
			this.observe(labels, duration)
			return duration
		}
	}

	/**
	 * Calcula percentil
	 */
	getPercentile(labels: Labels, percentile: number): number | undefined {
		const key = this.labelsToKey(labels)
		const summaryValue = this.values.get(key)

		if (!summaryValue || summaryValue.values.length === 0) {
			return undefined
		}

		const sorted = [...summaryValue.values].sort((a, b) => a - b)
		const index = Math.ceil(percentile * sorted.length) - 1
		return sorted[Math.max(0, index)]
	}

	/**
	 * Retorna valores do summary
	 */
	get(labels: Labels = {}): SummaryValue | undefined {
		const key = this.labelsToKey(labels)
		return this.values.get(key)
	}

	/**
	 * Reseta o summary
	 */
	reset(labels?: Labels): void {
		if (labels) {
			const key = this.labelsToKey(labels)
			this.values.delete(key)
		} else {
			this.values.clear()
		}
	}

	/**
	 * Retorna todos os valores
	 */
	getValues(): SummaryValue[] {
		return Array.from(this.values.values())
	}

	/**
	 * Retorna percentis configurados
	 */
	getPercentiles(): number[] {
		return [...this.percentiles]
	}

	private labelsToKey(labels: Labels): string {
		return JSON.stringify(labels)
	}

	/**
	 * Cria versão com labels pré-definidas
	 */
	labels(labels: Labels): {
		observe: (value: number) => void
		startTimer: () => () => number
	} {
		return {
			observe: (value: number) => this.observe(labels, value),
			startTimer: () => this.startTimer(labels),
		}
	}
}

/**
 * Registry de métricas
 */
export class MetricsRegistry {
	private metrics: Map<string, Counter | Gauge | Histogram | Summary> = new Map()
	private prefix: string
	private defaultLabels: Labels

	constructor(options: { prefix?: string; defaultLabels?: Labels } = {}) {
		this.prefix = options.prefix || ''
		this.defaultLabels = options.defaultLabels || {}
	}

	/**
	 * Registra uma métrica
	 */
	register<T extends Counter | Gauge | Histogram | Summary>(metric: T): T {
		const fullName = this.prefix ? `${this.prefix}_${metric.name}` : metric.name
		this.metrics.set(fullName, metric)
		return metric
	}

	/**
	 * Obtém uma métrica
	 */
	get(name: string): Counter | Gauge | Histogram | Summary | undefined {
		const fullName = this.prefix ? `${this.prefix}_${name}` : name
		return this.metrics.get(fullName)
	}

	/**
	 * Remove uma métrica
	 */
	remove(name: string): boolean {
		const fullName = this.prefix ? `${this.prefix}_${name}` : name
		return this.metrics.delete(fullName)
	}

	/**
	 * Reseta todas as métricas
	 */
	resetAll(): void {
		for (const metric of this.metrics.values()) {
			metric.reset()
		}
	}

	/**
	 * Retorna métricas no formato Prometheus
	 */
	async metrics(): Promise<string> {
		const lines: string[] = []

		for (const [name, metric] of this.metrics) {
			lines.push(`# HELP ${name} ${metric.help}`)
			lines.push(`# TYPE ${name} ${metric.type}`)

			if (metric instanceof Counter || metric instanceof Gauge) {
				for (const value of metric.getValues()) {
					const labelsStr = this.formatLabels({ ...this.defaultLabels, ...value.labels })
					lines.push(`${name}${labelsStr} ${value.value}`)
				}
			} else if (metric instanceof Histogram) {
				for (const value of metric.getValues()) {
					const labelsStr = this.formatLabels({ ...this.defaultLabels, ...value.labels })
					const buckets = metric.getBuckets()

					for (const bucket of buckets) {
						const bucketLabels = this.formatLabels({
							...this.defaultLabels,
							...value.labels,
							le: String(bucket),
						})
						lines.push(`${name}_bucket${bucketLabels} ${value.buckets.get(bucket) ?? 0}`)
					}

					// +Inf bucket
					const infLabels = this.formatLabels({
						...this.defaultLabels,
						...value.labels,
						le: '+Inf',
					})
					lines.push(`${name}_bucket${infLabels} ${value.count}`)
					lines.push(`${name}_sum${labelsStr} ${value.sum}`)
					lines.push(`${name}_count${labelsStr} ${value.count}`)
				}
			} else if (metric instanceof Summary) {
				for (const value of metric.getValues()) {
					const labelsStr = this.formatLabels({ ...this.defaultLabels, ...value.labels })

					for (const percentile of metric.getPercentiles()) {
						const quantileLabels = this.formatLabels({
							...this.defaultLabels,
							...value.labels,
							quantile: String(percentile),
						})
						const percentileValue = metric.getPercentile(value.labels, percentile)
						if (percentileValue !== undefined) {
							lines.push(`${name}${quantileLabels} ${percentileValue}`)
						}
					}

					lines.push(`${name}_sum${labelsStr} ${value.sum}`)
					lines.push(`${name}_count${labelsStr} ${value.count}`)
				}
			}

			lines.push('')
		}

		return lines.join('\n')
	}

	/**
	 * Retorna content type para Prometheus
	 */
	contentType(): string {
		return 'text/plain; version=0.0.4; charset=utf-8'
	}

	private formatLabels(labels: Labels): string {
		const entries = Object.entries(labels)
		if (entries.length === 0) return ''

		const formatted = entries.map(([k, v]) => `${k}="${this.escapeLabel(v)}"`).join(',')
		return `{${formatted}}`
	}

	private escapeLabel(value: string): string {
		return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
	}
}

// === Métricas Padrão do Baileys ===

/**
 * Registry global para métricas do Baileys
 */
export const baileysMetrics = new MetricsRegistry({ prefix: 'baileys' })

/**
 * Métricas pré-definidas para Baileys
 */
export const metrics = {
	// Conexão
	connectionAttempts: baileysMetrics.register(
		new Counter('connection_attempts_total', 'Total de tentativas de conexão', ['status'])
	),
	connectionState: baileysMetrics.register(
		new Gauge('connection_state', 'Estado atual da conexão (0=desconectado, 1=conectado)', ['instance'])
	),
	connectionDuration: baileysMetrics.register(
		new Gauge('connection_duration_seconds', 'Duração da conexão atual em segundos', ['instance'])
	),

	// Mensagens
	messagesSent: baileysMetrics.register(
		new Counter('messages_sent_total', 'Total de mensagens enviadas', ['type'])
	),
	messagesReceived: baileysMetrics.register(
		new Counter('messages_received_total', 'Total de mensagens recebidas', ['type'])
	),
	messageLatency: baileysMetrics.register(
		new Histogram('message_latency_ms', 'Latência de envio de mensagem em ms', ['type'], [10, 50, 100, 250, 500, 1000, 2500, 5000])
	),

	// Mídia
	mediaUploads: baileysMetrics.register(
		new Counter('media_uploads_total', 'Total de uploads de mídia', ['type', 'status'])
	),
	mediaDownloads: baileysMetrics.register(
		new Counter('media_downloads_total', 'Total de downloads de mídia', ['type', 'status'])
	),
	mediaSize: baileysMetrics.register(
		new Histogram('media_size_bytes', 'Tamanho de mídia em bytes', ['type', 'direction'], [1024, 10240, 102400, 1048576, 10485760])
	),

	// Erros
	errors: baileysMetrics.register(
		new Counter('errors_total', 'Total de erros', ['category', 'code'])
	),

	// Retries
	retries: baileysMetrics.register(
		new Counter('retries_total', 'Total de retentativas', ['operation'])
	),
	retryLatency: baileysMetrics.register(
		new Histogram('retry_latency_ms', 'Latência de retentativas em ms', ['operation'])
	),

	// Socket
	socketEvents: baileysMetrics.register(
		new Counter('socket_events_total', 'Total de eventos de socket', ['event'])
	),
	socketLatency: baileysMetrics.register(
		new Histogram('socket_latency_ms', 'Latência de operações de socket em ms', ['operation'])
	),

	// Criptografia
	encryptionOperations: baileysMetrics.register(
		new Counter('encryption_operations_total', 'Total de operações de criptografia', ['operation'])
	),

	// Cache
	cacheHits: baileysMetrics.register(new Counter('cache_hits_total', 'Total de cache hits', ['cache'])),
	cacheMisses: baileysMetrics.register(new Counter('cache_misses_total', 'Total de cache misses', ['cache'])),
	cacheSize: baileysMetrics.register(new Gauge('cache_size', 'Tamanho atual do cache', ['cache'])),
}

/**
 * Helper para criar endpoint HTTP de métricas
 */
export function createMetricsHandler(registry: MetricsRegistry = baileysMetrics) {
	return async (_req: unknown, res: { setHeader: (name: string, value: string) => void; end: (body: string) => void }) => {
		const metricsOutput = await registry.metrics()
		res.setHeader('Content-Type', registry.contentType())
		res.end(metricsOutput)
	}
}

export default baileysMetrics
