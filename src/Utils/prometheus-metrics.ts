/**
 * Prometheus Metrics Exposition
 *
 * Provides:
 * - Counters for event counting
 * - Gauges for instantaneous values
 * - Histograms for value distribution
 * - Summaries for percentiles
 * - /metrics endpoint ready for scraping
 * - Dynamic labels
 * - Baileys events integration
 *
 * Note: Works standalone without prom-client,
 * but can be integrated with prom-client if available.
 *
 * @module Utils/prometheus-metrics
 */

/**
 * Metric type
 */
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary'

/**
 * Metric labels
 */
export type Labels = Record<string, string>

/**
 * Default histogram buckets (in ms)
 */
export const DEFAULT_BUCKETS = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]

/**
 * Default summary percentiles
 */
export const DEFAULT_PERCENTILES = [0.5, 0.9, 0.95, 0.99]

/**
 * Base metric interface
 */
export interface BaseMetric {
	name: string
	help: string
	type: MetricType
	labelNames: string[]
}

/**
 * Metric value with labels
 */
export interface MetricValue {
	labels: Labels
	value: number
	timestamp?: number
}

/**
 * Histogram values
 */
export interface HistogramValue {
	labels: Labels
	buckets: Map<number, number>
	sum: number
	count: number
}

/**
 * Summary values
 */
export interface SummaryValue {
	labels: Labels
	values: number[]
	sum: number
	count: number
}

/**
 * Counter class - monotonically increasing
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
	 * Increment the counter
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
	 * Get current value
	 */
	get(labels: Labels = {}): number {
		const key = this.labelsToKey(labels)
		return this.values.get(key)?.value ?? 0
	}

	/**
	 * Reset the counter
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
	 * Get all values
	 */
	getValues(): MetricValue[] {
		return Array.from(this.values.values())
	}

	private labelsToKey(labels: Labels): string {
		return JSON.stringify(labels)
	}

	/**
	 * Create version with pre-defined labels
	 */
	labels(labels: Labels): { inc: (value?: number) => void } {
		return {
			inc: (value?: number) => this.inc(labels, value),
		}
	}
}

/**
 * Gauge class - value that can increase and decrease
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
	 * Set value
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
	 * Increment value
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
	 * Decrement value
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
	 * Set to current timestamp
	 */
	setToCurrentTime(labels: Labels = {}): void {
		this.set(labels, Date.now() / 1000)
	}

	/**
	 * Get current value
	 */
	get(labels: Labels = {}): number {
		const key = this.labelsToKey(labels)
		return this.values.get(key)?.value ?? 0
	}

	/**
	 * Reset the gauge
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
	 * Get all values
	 */
	getValues(): MetricValue[] {
		return Array.from(this.values.values())
	}

	private labelsToKey(labels: Labels): string {
		return JSON.stringify(labels)
	}

	/**
	 * Create version with pre-defined labels
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
	 * Timer helper - returns function to stop and record duration
	 */
	startTimer(labels: Labels = {}): () => number {
		const start = process.hrtime.bigint()
		return () => {
			const duration = Number(process.hrtime.bigint() - start) / 1_000_000_000 // seconds
			this.set(labels, duration)
			return duration
		}
	}
}

/**
 * Histogram class - distribution of values in buckets
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
	 * Observe a value
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

		// Increment appropriate buckets
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
	 * Get histogram values
	 */
	get(labels: Labels = {}): HistogramValue | undefined {
		const key = this.labelsToKey(labels)
		return this.values.get(key)
	}

	/**
	 * Reset the histogram
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
	 * Get all values
	 */
	getValues(): HistogramValue[] {
		return Array.from(this.values.values())
	}

	/**
	 * Get configured buckets
	 */
	getBuckets(): number[] {
		return [...this.buckets]
	}

	private labelsToKey(labels: Labels): string {
		return JSON.stringify(labels)
	}

	/**
	 * Create version with pre-defined labels
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
 * Summary class - value percentiles
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
	 * Observe a value
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

		// Limit size
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
	 * Calculate percentile
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
	 * Get summary values
	 */
	get(labels: Labels = {}): SummaryValue | undefined {
		const key = this.labelsToKey(labels)
		return this.values.get(key)
	}

	/**
	 * Reset the summary
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
	 * Get all values
	 */
	getValues(): SummaryValue[] {
		return Array.from(this.values.values())
	}

	/**
	 * Get configured percentiles
	 */
	getPercentiles(): number[] {
		return [...this.percentiles]
	}

	private labelsToKey(labels: Labels): string {
		return JSON.stringify(labels)
	}

	/**
	 * Create version with pre-defined labels
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
 * Metrics registry
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
	 * Register a metric
	 */
	register<T extends Counter | Gauge | Histogram | Summary>(metric: T): T {
		const fullName = this.prefix ? `${this.prefix}_${metric.name}` : metric.name
		this.metrics.set(fullName, metric)
		return metric
	}

	/**
	 * Get a metric
	 */
	get(name: string): Counter | Gauge | Histogram | Summary | undefined {
		const fullName = this.prefix ? `${this.prefix}_${name}` : name
		return this.metrics.get(fullName)
	}

	/**
	 * Remove a metric
	 */
	remove(name: string): boolean {
		const fullName = this.prefix ? `${this.prefix}_${name}` : name
		return this.metrics.delete(fullName)
	}

	/**
	 * Reset all metrics
	 */
	resetAll(): void {
		for (const metric of this.metrics.values()) {
			metric.reset()
		}
	}

	/**
	 * Return metrics in Prometheus format
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
	 * Return content type for Prometheus
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

// === Default Baileys Metrics ===

/**
 * Global registry for Baileys metrics
 */
export const baileysMetrics = new MetricsRegistry({ prefix: 'baileys' })

/**
 * Pre-defined metrics for Baileys
 */
export const metrics = {
	// Connection
	connectionAttempts: baileysMetrics.register(
		new Counter('connection_attempts_total', 'Total connection attempts', ['status'])
	),
	connectionState: baileysMetrics.register(
		new Gauge('connection_state', 'Current connection state (0=disconnected, 1=connected)', ['instance'])
	),
	connectionDuration: baileysMetrics.register(
		new Gauge('connection_duration_seconds', 'Current connection duration in seconds', ['instance'])
	),

	// Messages
	messagesSent: baileysMetrics.register(
		new Counter('messages_sent_total', 'Total messages sent', ['type'])
	),
	messagesReceived: baileysMetrics.register(
		new Counter('messages_received_total', 'Total messages received', ['type'])
	),
	messageLatency: baileysMetrics.register(
		new Histogram('message_latency_ms', 'Message send latency in ms', ['type'], [10, 50, 100, 250, 500, 1000, 2500, 5000])
	),

	// Media
	mediaUploads: baileysMetrics.register(
		new Counter('media_uploads_total', 'Total media uploads', ['type', 'status'])
	),
	mediaDownloads: baileysMetrics.register(
		new Counter('media_downloads_total', 'Total media downloads', ['type', 'status'])
	),
	mediaSize: baileysMetrics.register(
		new Histogram('media_size_bytes', 'Media size in bytes', ['type', 'direction'], [1024, 10240, 102400, 1048576, 10485760])
	),

	// Errors
	errors: baileysMetrics.register(
		new Counter('errors_total', 'Total errors', ['category', 'code'])
	),

	// Retries
	retries: baileysMetrics.register(
		new Counter('retries_total', 'Total retries', ['operation'])
	),
	retryLatency: baileysMetrics.register(
		new Histogram('retry_latency_ms', 'Retry latency in ms', ['operation'])
	),

	// Socket
	socketEvents: baileysMetrics.register(
		new Counter('socket_events_total', 'Total socket events', ['event'])
	),
	socketLatency: baileysMetrics.register(
		new Histogram('socket_latency_ms', 'Socket operation latency in ms', ['operation'])
	),

	// Encryption
	encryptionOperations: baileysMetrics.register(
		new Counter('encryption_operations_total', 'Total encryption operations', ['operation'])
	),

	// Cache
	cacheHits: baileysMetrics.register(new Counter('cache_hits_total', 'Total cache hits', ['cache'])),
	cacheMisses: baileysMetrics.register(new Counter('cache_misses_total', 'Total cache misses', ['cache'])),
	cacheSize: baileysMetrics.register(new Gauge('cache_size', 'Current cache size', ['cache'])),
}

/**
 * Helper to create HTTP metrics endpoint
 */
export function createMetricsHandler(registry: MetricsRegistry = baileysMetrics) {
	return async (_req: unknown, res: { setHeader: (name: string, value: string) => void; end: (body: string) => void }) => {
		const metricsOutput = await registry.metrics()
		res.setHeader('Content-Type', registry.contentType())
		res.end(metricsOutput)
	}
}

export default baileysMetrics
