/**
 * Prometheus Metrics Exposition - Enterprise Grade
 *
 * Provides:
 * - Counters for event counting
 * - Gauges for instantaneous values
 * - Histograms for value distribution
 * - Summaries for percentiles
 * - HTTP /metrics endpoint ready for scraping
 * - Dynamic labels
 * - Baileys events integration
 * - Event buffer metrics
 * - System metrics (memory, CPU, uptime)
 * - Circuit breaker metrics
 * - Environment variable configuration
 *
 * Configuration via environment variables:
 * - BAILEYS_PROMETHEUS_ENABLED: Enable/disable metrics (default: false)
 * - BAILEYS_PROMETHEUS_PORT: Port for HTTP metrics server (default: 9092)
 * - BAILEYS_PROMETHEUS_PATH: Path for metrics endpoint (default: /metrics)
 * - BAILEYS_PROMETHEUS_PREFIX: Prefix for all metrics (default: baileys)
 * - BAILEYS_PROMETHEUS_LABELS: JSON string with default labels (e.g. {"environment":"production"})
 * - BAILEYS_PROMETHEUS_COLLECT_DEFAULT: Collect default Node.js metrics (default: true)
 *
 * @module Utils/prometheus-metrics
 */

import { createServer, IncomingMessage, ServerResponse, Server } from 'http'
import * as os from 'os'

// ============================================
// Configuration
// ============================================

/**
 * Metrics configuration from environment
 */
export interface MetricsConfig {
	enabled: boolean
	port: number
	/** Host/IP to bind the metrics server (default: '127.0.0.1' for security) */
	host: string
	path: string
	prefix: string
	defaultLabels: Labels
	includeSystem: boolean
	collectDefaultMetrics: boolean
	/** Interval in milliseconds for system metrics collection (default: 10000) */
	collectIntervalMs: number
}

/**
 * Parse JSON labels from environment variable
 */
function parseLabelsFromEnv(envValue: string | undefined): Labels {
	if (!envValue) return {}
	try {
		const parsed = JSON.parse(envValue)
		if (typeof parsed === 'object' && parsed !== null) {
			return parsed as Labels
		}
		return {}
	} catch {
		return {}
	}
}

/**
 * Load configuration from environment variables
 * Supports both BAILEYS_PROMETHEUS_* and METRICS_* prefixes for compatibility
 */
export function loadMetricsConfig(): MetricsConfig {
	return {
		enabled: (process.env.BAILEYS_PROMETHEUS_ENABLED ?? process.env.METRICS_ENABLED) === 'true',
		port: parseInt(process.env.BAILEYS_PROMETHEUS_PORT || process.env.METRICS_PORT || '9092', 10),
		host: process.env.BAILEYS_PROMETHEUS_HOST || process.env.METRICS_HOST || '127.0.0.1',
		path: process.env.BAILEYS_PROMETHEUS_PATH || process.env.METRICS_PATH || '/metrics',
		prefix: process.env.BAILEYS_PROMETHEUS_PREFIX || process.env.METRICS_PREFIX || 'baileys',
		defaultLabels: parseLabelsFromEnv(process.env.BAILEYS_PROMETHEUS_LABELS),
		includeSystem: (process.env.BAILEYS_PROMETHEUS_COLLECT_DEFAULT ?? process.env.METRICS_INCLUDE_SYSTEM) !== 'false',
		collectDefaultMetrics: (process.env.BAILEYS_PROMETHEUS_COLLECT_DEFAULT ?? process.env.METRICS_COLLECT_DEFAULT) !== 'false',
		collectIntervalMs: parseInt(process.env.BAILEYS_PROMETHEUS_COLLECT_INTERVAL_MS || process.env.METRICS_COLLECT_INTERVAL_MS || '10000', 10),
	}
}

// ============================================
// Types
// ============================================

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
 * Default latency buckets (in seconds)
 */
export const DEFAULT_LATENCY_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]

/**
 * Default size buckets (in bytes)
 */
export const DEFAULT_SIZE_BUCKETS = [1024, 10240, 102400, 1048576, 10485760, 104857600]

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

// ============================================
// Counter Class
// ============================================

/**
 * Counter class - monotonically increasing metric
 *
 * Counters only go up (or reset to zero). They are used for
 * counting events like requests, errors, tasks completed, etc.
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

		if (incValue < 0) {
			throw new Error('Counter cannot be decremented')
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

// ============================================
// Gauge Class
// ============================================

/**
 * Gauge class - value that can increase and decrease
 *
 * Gauges represent a snapshot of a value at a point in time.
 * Examples: temperature, current memory usage, queue size.
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

// ============================================
// Histogram Class
// ============================================

/**
 * Histogram class - distribution of values in buckets
 *
 * Histograms sample observations and count them in configurable buckets.
 * They also provide sum and count of observations.
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

		// Increment appropriate buckets (cumulative)
		for (const bucket of this.buckets) {
			if (observeValue <= bucket) {
				histValue.buckets.set(bucket, (histValue.buckets.get(bucket) ?? 0) + 1)
			}
		}

		histValue.sum += observeValue
		histValue.count++
	}

	/**
	 * Timer helper - measures duration in milliseconds
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
	 * Timer helper - measures duration in seconds
	 */
	startTimerSeconds(labels: Labels = {}): () => number {
		const start = process.hrtime.bigint()
		return () => {
			const duration = Number(process.hrtime.bigint() - start) / 1_000_000_000 // seconds
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

// ============================================
// Summary Class
// ============================================

/**
 * Summary class - value percentiles (quantiles)
 *
 * Summaries calculate quantiles over a sliding time window.
 * Useful for tracking latency distributions.
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

		// Limit size to prevent memory leaks
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

// ============================================
// Metrics Registry
// ============================================

/**
 * Metrics registry - manages collection of metrics
 *
 * The registry holds all metrics and provides methods to
 * retrieve, reset, and export them in Prometheus format.
 */
export class MetricsRegistry {
	private metricsMap: Map<string, Counter | Gauge | Histogram | Summary> = new Map()
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
		this.metricsMap.set(fullName, metric)
		return metric
	}

	/**
	 * Get a metric by name
	 */
	get(name: string): Counter | Gauge | Histogram | Summary | undefined {
		const fullName = this.prefix ? `${this.prefix}_${name}` : name
		return this.metricsMap.get(fullName)
	}

	/**
	 * Check if a metric exists
	 */
	has(name: string): boolean {
		const fullName = this.prefix ? `${this.prefix}_${name}` : name
		return this.metricsMap.has(fullName)
	}

	/**
	 * Remove a metric
	 */
	remove(name: string): boolean {
		const fullName = this.prefix ? `${this.prefix}_${name}` : name
		return this.metricsMap.delete(fullName)
	}

	/**
	 * Get all registered metrics
	 */
	getAll(): Map<string, Counter | Gauge | Histogram | Summary> {
		return new Map(this.metricsMap)
	}

	/**
	 * Reset all metrics
	 */
	resetAll(): void {
		for (const metric of this.metricsMap.values()) {
			metric.reset()
		}
	}

	/**
	 * Set default labels that will be added to all metrics
	 */
	setDefaultLabels(labels: Labels): void {
		this.defaultLabels = { ...labels }
	}

	/**
	 * Return metrics in Prometheus exposition format
	 */
	async getMetricsOutput(): Promise<string> {
		const lines: string[] = []

		for (const [name, metric] of this.metricsMap) {
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

					// +Inf bucket (total count)
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

// ============================================
// System Metrics Collection
// ============================================

/**
 * System metrics collector
 * Collects Node.js process and system-level metrics
 *
 * FIX: CPU usage now calculates delta between measurements to get actual percentage
 */
export class SystemMetricsCollector {
	private processStartTime: number
	private registry: MetricsRegistry

	// CPU tracking for delta calculation
	private lastCpuUsage: { user: number; system: number } | null = null
	private lastCpuTime: number = 0

	// Process metrics
	public readonly processUptime: Gauge
	public readonly processCpuUsage: Gauge
	public readonly processMemoryUsage: Gauge
	public readonly processMemoryExternal: Gauge
	public readonly processMemoryHeapTotal: Gauge
	public readonly processMemoryHeapUsed: Gauge
	public readonly processMemoryRss: Gauge

	// System metrics
	public readonly systemCpuUsage: Gauge
	public readonly systemMemoryTotal: Gauge
	public readonly systemMemoryFree: Gauge
	public readonly systemLoadAverage: Gauge

	// Event loop metrics
	public readonly eventLoopLag: Histogram

	constructor(registry: MetricsRegistry) {
		this.registry = registry
		this.processStartTime = Date.now()

		// Initialize process metrics
		this.processUptime = registry.register(
			new Gauge('process_uptime_seconds', 'Process uptime in seconds')
		)
		// FIX: Updated description - can exceed 100% on multi-core (100% = 1 core)
		this.processCpuUsage = registry.register(
			new Gauge('process_cpu_usage_percent', 'Process CPU usage (100% = 1 core fully used)', ['type'])
		)
		this.processMemoryUsage = registry.register(
			new Gauge('process_memory_bytes', 'Process memory usage in bytes', ['type'])
		)
		this.processMemoryExternal = registry.register(
			new Gauge('process_memory_external_bytes', 'External memory used by C++ objects')
		)
		this.processMemoryHeapTotal = registry.register(
			new Gauge('process_memory_heap_total_bytes', 'Total heap memory')
		)
		this.processMemoryHeapUsed = registry.register(
			new Gauge('process_memory_heap_used_bytes', 'Used heap memory')
		)
		this.processMemoryRss = registry.register(
			new Gauge('process_memory_rss_bytes', 'Resident set size')
		)

		// Initialize system metrics
		this.systemCpuUsage = registry.register(
			new Gauge('system_cpu_usage_percent', 'System CPU usage percentage')
		)
		this.systemMemoryTotal = registry.register(
			new Gauge('system_memory_total_bytes', 'Total system memory')
		)
		this.systemMemoryFree = registry.register(
			new Gauge('system_memory_free_bytes', 'Free system memory')
		)
		this.systemLoadAverage = registry.register(
			new Gauge('system_load_average', 'System load average', ['period'])
		)

		// Event loop lag
		this.eventLoopLag = registry.register(
			new Histogram('nodejs_eventloop_lag_seconds', 'Event loop lag in seconds', [], DEFAULT_LATENCY_BUCKETS)
		)

		// Initialize CPU baseline
		this.lastCpuUsage = process.cpuUsage()
		this.lastCpuTime = Date.now()
	}

	/**
	 * Collect all system metrics
	 */
	collect(): void {
		// Process uptime
		this.processUptime.set((Date.now() - this.processStartTime) / 1000)

		// CPU usage - calculate delta to get actual percentage
		this.collectCpuUsage()

		// Memory usage
		const memUsage = process.memoryUsage()
		this.processMemoryRss.set(memUsage.rss)
		this.processMemoryHeapTotal.set(memUsage.heapTotal)
		this.processMemoryHeapUsed.set(memUsage.heapUsed)
		this.processMemoryExternal.set(memUsage.external)
		this.processMemoryUsage.set({ type: 'rss' }, memUsage.rss)
		this.processMemoryUsage.set({ type: 'heapTotal' }, memUsage.heapTotal)
		this.processMemoryUsage.set({ type: 'heapUsed' }, memUsage.heapUsed)
		this.processMemoryUsage.set({ type: 'external' }, memUsage.external)

		// System metrics
		this.systemMemoryTotal.set(os.totalmem())
		this.systemMemoryFree.set(os.freemem())

		// Load average
		const loadAvg = os.loadavg()
		this.systemLoadAverage.set({ period: '1m' }, loadAvg[0])
		this.systemLoadAverage.set({ period: '5m' }, loadAvg[1])
		this.systemLoadAverage.set({ period: '15m' }, loadAvg[2])

		// Event loop lag measurement
		this.measureEventLoopLag()
	}

	/**
	 * Calculate CPU usage percentage by measuring delta between calls
	 * FIX: process.cpuUsage() returns cumulative microseconds, not percentage
	 * We need to calculate the delta and convert to percentage
	 *
	 * NOTE: Values can exceed 100% on multi-core systems (e.g., 200% = 2 cores fully used)
	 * This follows the standard Unix/Prometheus convention for process CPU metrics
	 */
	private collectCpuUsage(): void {
		const currentCpuUsage = process.cpuUsage()
		const currentTime = Date.now()

		if (this.lastCpuUsage && this.lastCpuTime) {
			const elapsedMs = currentTime - this.lastCpuTime
			if (elapsedMs > 0) {
				// Calculate delta in microseconds
				const userDelta = currentCpuUsage.user - this.lastCpuUsage.user
				const systemDelta = currentCpuUsage.system - this.lastCpuUsage.system

				// Convert to percentage: (microseconds used / microseconds elapsed) * 100
				// FIX: Removed division by cpuCount - this was giving artificially low values
				// Standard convention: 100% = 1 core fully utilized, can go up to numCPUs * 100%
				const elapsedMicros = elapsedMs * 1000
				const userPercent = (userDelta / elapsedMicros) * 100
				const systemPercent = (systemDelta / elapsedMicros) * 100

				// Clamp to 0 minimum (no upper limit as it can exceed 100% with multiple cores)
				this.processCpuUsage.set({ type: 'user' }, Math.max(0, userPercent))
				this.processCpuUsage.set({ type: 'system' }, Math.max(0, systemPercent))
			}
		}

		// Store for next calculation
		this.lastCpuUsage = currentCpuUsage
		this.lastCpuTime = currentTime
	}

	private measureEventLoopLag(): void {
		const start = process.hrtime.bigint()
		setImmediate(() => {
			const lag = Number(process.hrtime.bigint() - start) / 1_000_000_000 // seconds
			this.eventLoopLag.observe(lag)
		})
	}
}

// ============================================
// HTTP Metrics Server
// ============================================

/**
 * HTTP server for exposing metrics endpoint
 *
 * SECURITY: By default binds to 127.0.0.1 (localhost only)
 * Set BAILEYS_PROMETHEUS_HOST=0.0.0.0 to expose on all interfaces
 */
export class MetricsServer {
	private server: Server | null = null
	private registry: MetricsRegistry
	private systemCollector: SystemMetricsCollector | null = null
	private collectInterval: NodeJS.Timeout | null = null
	private config: MetricsConfig
	private startPromise: Promise<void> | null = null // FIX: Cache Promise for race condition

	constructor(registry: MetricsRegistry, config?: Partial<MetricsConfig>) {
		this.registry = registry
		this.config = { ...loadMetricsConfig(), ...config }
	}

	/**
	 * Get the system collector (for external access, avoids duplicate creation)
	 */
	getSystemCollector(): SystemMetricsCollector | null {
		return this.systemCollector
	}

	/**
	 * Start the metrics HTTP server
	 * FIX: Properly handles concurrent start() calls by caching and returning the same Promise
	 */
	start(): Promise<void> {
		// If disabled, return resolved promise
		if (!this.config.enabled) {
			return Promise.resolve()
		}

		// If already running, return resolved promise
		if (this.server) {
			return Promise.resolve()
		}

		// FIX: If start is in progress, return the cached promise
		// This ensures all concurrent callers wait for the same result
		if (this.startPromise) {
			return this.startPromise
		}

		// Cache the promise so concurrent calls get the same one
		this.startPromise = new Promise<void>((resolve, reject) => {
			// Initialize system collector if enabled (only once)
			if (this.config.includeSystem && !this.systemCollector) {
				this.systemCollector = new SystemMetricsCollector(this.registry)
				// FIX: Use configurable interval instead of hardcoded 10000
				this.collectInterval = setInterval(() => {
					this.systemCollector?.collect()
				}, this.config.collectIntervalMs)
			}

			this.server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
				if (req.url === this.config.path && req.method === 'GET') {
					try {
						// Collect system metrics before responding
						this.systemCollector?.collect()

						const metricsOutput = await this.registry.getMetricsOutput()
						res.writeHead(200, { 'Content-Type': this.registry.contentType() })
						res.end(metricsOutput)
					} catch (error) {
						// FIX: More descriptive error message
						const errorMessage = error instanceof Error ? error.message : 'Unknown error'
						console.error(`[Prometheus] Error collecting metrics: ${errorMessage}`)
						res.writeHead(500, { 'Content-Type': 'application/json' })
						res.end(JSON.stringify({
							error: 'Failed to collect metrics',
							message: errorMessage,
							timestamp: new Date().toISOString()
						}))
					}
				} else if (req.url === '/health' && req.method === 'GET') {
					res.writeHead(200, { 'Content-Type': 'application/json' })
					res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }))
				} else {
					res.writeHead(404, { 'Content-Type': 'text/plain' })
					res.end('Not Found')
				}
			})

			this.server.on('error', (error) => {
				this.startPromise = null // Reset so retry is possible
				this.server = null
				reject(error)
			})

			// FIX: Use configurable host instead of hardcoded 0.0.0.0
			this.server.listen(this.config.port, this.config.host, () => {
				const labelsInfo = Object.keys(this.config.defaultLabels).length > 0
					? ` with labels: ${JSON.stringify(this.config.defaultLabels)}`
					: ''
				const securityNote = this.config.host === '0.0.0.0'
					? ' (WARNING: exposed on all interfaces)'
					: ''
				console.log(`[Prometheus] Metrics server listening on http://${this.config.host}:${this.config.port}${this.config.path}${labelsInfo}${securityNote}`)
				resolve()
			})
		})

		return this.startPromise
	}

	/**
	 * Stop the metrics HTTP server
	 */
	stop(): Promise<void> {
		return new Promise((resolve) => {
			if (this.collectInterval) {
				clearInterval(this.collectInterval)
				this.collectInterval = null
			}

			if (this.server) {
				this.server.close(() => {
					this.server = null
					resolve()
				})
			} else {
				resolve()
			}
		})
	}

	/**
	 * Check if server is running
	 */
	isRunning(): boolean {
		return this.server !== null
	}
}

// ============================================
// Pre-defined Baileys Metrics
// ============================================

/**
 * Load metrics configuration from environment
 */
const metricsConfig = loadMetricsConfig()

/**
 * Global registry for Baileys metrics
 * Uses prefix and default labels from environment variables
 */
export const baileysMetrics = new MetricsRegistry({
	prefix: metricsConfig.prefix,
	defaultLabels: metricsConfig.defaultLabels
})

/**
 * Pre-defined metrics for Baileys
 */
export const metrics = {
	// ========== Connection Metrics ==========
	connectionAttempts: baileysMetrics.register(
		new Counter('connection_attempts_total', 'Total connection attempts', ['status'])
	),
	connectionState: baileysMetrics.register(
		new Gauge('connection_state', 'Current connection state (0=disconnected, 1=connected)', ['instance'])
	),
	connectionDuration: baileysMetrics.register(
		new Gauge('connection_duration_seconds', 'Current connection duration in seconds', ['instance'])
	),
	reconnectAttempts: baileysMetrics.register(
		new Counter('reconnect_attempts_total', 'Total reconnection attempts', ['reason'])
	),
	connectionLatency: baileysMetrics.register(
		new Histogram('connection_latency_ms', 'Connection establishment latency in ms', [], [100, 250, 500, 1000, 2500, 5000, 10000])
	),

	// ========== Message Metrics ==========
	messagesSent: baileysMetrics.register(
		new Counter('messages_sent_total', 'Total messages sent', ['type'])
	),
	messagesReceived: baileysMetrics.register(
		new Counter('messages_received_total', 'Total messages received', ['type'])
	),
	messageLatency: baileysMetrics.register(
		new Histogram('message_latency_ms', 'Message send latency in ms', ['type'], [10, 50, 100, 250, 500, 1000, 2500, 5000])
	),
	messageRetries: baileysMetrics.register(
		new Counter('message_retries_total', 'Total message retry attempts', ['type'])
	),
	messageFailures: baileysMetrics.register(
		new Counter('message_failures_total', 'Total message send failures', ['type', 'reason'])
	),
	messagesQueued: baileysMetrics.register(
		new Gauge('messages_queued', 'Current number of messages in queue', ['priority'])
	),

	// ========== Media Metrics ==========
	mediaUploads: baileysMetrics.register(
		new Counter('media_uploads_total', 'Total media uploads', ['type', 'status'])
	),
	mediaDownloads: baileysMetrics.register(
		new Counter('media_downloads_total', 'Total media downloads', ['type', 'status'])
	),
	mediaSize: baileysMetrics.register(
		new Histogram('media_size_bytes', 'Media size in bytes', ['type', 'direction'], DEFAULT_SIZE_BUCKETS)
	),
	mediaLatency: baileysMetrics.register(
		new Histogram('media_latency_ms', 'Media upload/download latency in ms', ['type', 'direction'], [100, 500, 1000, 2500, 5000, 10000, 30000])
	),

	// ========== Event Buffer Metrics ==========
	bufferSize: baileysMetrics.register(
		new Gauge('buffer_size', 'Current event buffer size', ['type'])
	),
	bufferCapacity: baileysMetrics.register(
		new Gauge('buffer_capacity', 'Maximum event buffer capacity', ['type'])
	),
	bufferUtilization: baileysMetrics.register(
		new Gauge('buffer_utilization_percent', 'Event buffer utilization percentage', ['type'])
	),
	bufferFlushes: baileysMetrics.register(
		new Counter('buffer_flushes_total', 'Total buffer flush operations', ['type', 'reason'])
	),
	bufferOverflows: baileysMetrics.register(
		new Counter('buffer_overflows_total', 'Total buffer overflow events', ['type'])
	),
	eventsBuffered: baileysMetrics.register(
		new Counter('events_buffered_total', 'Total events added to buffer', ['event_type'])
	),
	eventsDropped: baileysMetrics.register(
		new Counter('events_dropped_total', 'Total events dropped due to buffer full', ['event_type'])
	),
	bufferFlushLatency: baileysMetrics.register(
		new Histogram('buffer_flush_latency_ms', 'Buffer flush operation latency in ms', ['type'], [1, 5, 10, 25, 50, 100, 250])
	),
	eventsProcessed: baileysMetrics.register(
		new Counter('events_processed_total', 'Total events processed from buffer', ['event_type'])
	),

	// ========== Adaptive Flush Metrics ==========
	adaptiveFlushInterval: baileysMetrics.register(
		new Gauge('adaptive_flush_interval_ms', 'Current adaptive flush interval in ms')
	),
	adaptiveFlushAdjustments: baileysMetrics.register(
		new Counter('adaptive_flush_adjustments_total', 'Total adaptive flush interval adjustments', ['direction'])
	),
	adaptiveFlushThroughput: baileysMetrics.register(
		new Gauge('adaptive_flush_throughput', 'Events processed per second by adaptive flush')
	),
	adaptiveFlushBackpressure: baileysMetrics.register(
		new Gauge('adaptive_flush_backpressure', 'Backpressure indicator (0-1)')
	),
	adaptiveFlushEfficiency: baileysMetrics.register(
		new Gauge('adaptive_flush_efficiency_percent', 'Flush efficiency percentage')
	),

	// ========== Error Metrics ==========
	errors: baileysMetrics.register(
		new Counter('errors_total', 'Total errors', ['category', 'code'])
	),
	errorRate: baileysMetrics.register(
		new Gauge('error_rate', 'Current error rate per minute', ['category'])
	),

	// ========== Retry Metrics ==========
	retries: baileysMetrics.register(
		new Counter('retries_total', 'Total retries', ['operation'])
	),
	retryLatency: baileysMetrics.register(
		new Histogram('retry_latency_ms', 'Retry latency in ms', ['operation'])
	),
	retrySuccess: baileysMetrics.register(
		new Counter('retry_success_total', 'Successful retries', ['operation'])
	),
	retryExhausted: baileysMetrics.register(
		new Counter('retry_exhausted_total', 'Exhausted retry attempts', ['operation'])
	),

	// ========== Socket Metrics ==========
	socketEvents: baileysMetrics.register(
		new Counter('socket_events_total', 'Total socket events', ['event'])
	),
	socketLatency: baileysMetrics.register(
		new Histogram('socket_latency_ms', 'Socket operation latency in ms', ['operation'])
	),
	socketBytesReceived: baileysMetrics.register(
		new Counter('socket_bytes_received_total', 'Total bytes received through socket')
	),
	socketBytesSent: baileysMetrics.register(
		new Counter('socket_bytes_sent_total', 'Total bytes sent through socket')
	),
	socketReconnects: baileysMetrics.register(
		new Counter('socket_reconnects_total', 'Total socket reconnection attempts', ['reason'])
	),

	// ========== Circuit Breaker Metrics ==========
	circuitBreakerState: baileysMetrics.register(
		new Gauge('circuit_breaker_state', 'Circuit breaker state (0=closed, 1=open, 2=half-open)', ['name'])
	),
	circuitBreakerTrips: baileysMetrics.register(
		new Counter('circuit_breaker_trips_total', 'Total circuit breaker trips', ['name'])
	),
	circuitBreakerRecoveries: baileysMetrics.register(
		new Counter('circuit_breaker_recoveries_total', 'Total circuit breaker recoveries', ['name'])
	),
	circuitBreakerRejections: baileysMetrics.register(
		new Counter('circuit_breaker_rejections_total', 'Total requests rejected by circuit breaker', ['name'])
	),
	circuitBreakerSuccesses: baileysMetrics.register(
		new Counter('circuit_breaker_successes_total', 'Total successful requests through circuit breaker', ['name'])
	),
	circuitBreakerFailures: baileysMetrics.register(
		new Counter('circuit_breaker_failures_total', 'Total failed requests through circuit breaker', ['name'])
	),

	// ========== Encryption Metrics ==========
	encryptionOperations: baileysMetrics.register(
		new Counter('encryption_operations_total', 'Total encryption operations', ['operation'])
	),
	encryptionLatency: baileysMetrics.register(
		new Histogram('encryption_latency_ms', 'Encryption operation latency in ms', ['operation'], [1, 5, 10, 25, 50, 100])
	),
	keyExchanges: baileysMetrics.register(
		new Counter('key_exchanges_total', 'Total key exchange operations', ['type'])
	),
	preKeyCount: baileysMetrics.register(
		new Gauge('prekey_count', 'Current prekey count')
	),

	// ========== Cache Metrics ==========
	cacheHits: baileysMetrics.register(
		new Counter('cache_hits_total', 'Total cache hits', ['cache'])
	),
	cacheMisses: baileysMetrics.register(
		new Counter('cache_misses_total', 'Total cache misses', ['cache'])
	),
	cacheSize: baileysMetrics.register(
		new Gauge('cache_size', 'Current cache size', ['cache'])
	),
	cacheEvictions: baileysMetrics.register(
		new Counter('cache_evictions_total', 'Total cache evictions', ['cache', 'reason'])
	),
	cacheHitRate: baileysMetrics.register(
		new Gauge('cache_hit_rate', 'Cache hit rate (0-1)', ['cache'])
	),

	// ========== Query Metrics ==========
	queryLatency: baileysMetrics.register(
		new Histogram('query_latency_ms', 'Query latency in ms', ['query_type'], [10, 50, 100, 250, 500, 1000, 2500, 5000])
	),
	queryCount: baileysMetrics.register(
		new Counter('query_count_total', 'Total queries executed', ['query_type', 'status'])
	),
	queryTimeouts: baileysMetrics.register(
		new Counter('query_timeouts_total', 'Total query timeouts', ['query_type'])
	),

	// ========== Presence Metrics ==========
	presenceUpdates: baileysMetrics.register(
		new Counter('presence_updates_total', 'Total presence updates received', ['type'])
	),
	presenceSubscriptions: baileysMetrics.register(
		new Gauge('presence_subscriptions', 'Current presence subscriptions')
	),

	// ========== Group Metrics ==========
	groupOperations: baileysMetrics.register(
		new Counter('group_operations_total', 'Total group operations', ['operation', 'status'])
	),
	groupMetadataFetches: baileysMetrics.register(
		new Counter('group_metadata_fetches_total', 'Total group metadata fetches', ['status'])
	),

	// ========== History Sync Metrics ==========
	historySyncEvents: baileysMetrics.register(
		new Counter('history_sync_events_total', 'Total history sync events', ['type'])
	),
	historySyncMessages: baileysMetrics.register(
		new Counter('history_sync_messages_total', 'Total messages synced from history')
	),
	historySyncDuration: baileysMetrics.register(
		new Histogram('history_sync_duration_ms', 'History sync duration in ms', ['type'], [1000, 5000, 10000, 30000, 60000])
	),
}

// ============================================
// Metrics Manager
// ============================================

/**
 * PrometheusMetricsManager - High-level manager for all metrics
 *
 * Provides a unified interface for managing metrics, HTTP server,
 * and system metrics collection.
 *
 * FIX: Removed duplicate SystemMetricsCollector - now uses server's collector
 */
export class PrometheusMetricsManager {
	public readonly registry: MetricsRegistry
	public readonly metrics: typeof metrics
	public readonly server: MetricsServer
	private config: MetricsConfig

	constructor(config?: Partial<MetricsConfig>) {
		this.config = { ...loadMetricsConfig(), ...config }
		this.registry = baileysMetrics
		this.metrics = metrics
		this.server = new MetricsServer(this.registry, this.config)
	}

	/**
	 * Initialize the metrics manager
	 * FIX: No longer creates duplicate SystemMetricsCollector
	 * The MetricsServer handles system metrics collection
	 */
	async initialize(): Promise<void> {
		if (!this.config.enabled) {
			return
		}

		// MetricsServer.start() creates SystemMetricsCollector if includeSystem is true
		await this.server.start()
	}

	/**
	 * Shutdown the metrics manager
	 */
	async shutdown(): Promise<void> {
		await this.server.stop()
	}

	/**
	 * Get metrics output in Prometheus format
	 */
	async getMetricsOutput(): Promise<string> {
		// Use server's system collector to avoid duplication
		this.server.getSystemCollector()?.collect()
		return this.registry.getMetricsOutput()
	}

	/**
	 * Reset all metrics
	 */
	resetAll(): void {
		this.registry.resetAll()
	}

	/**
	 * Check if metrics are enabled
	 */
	isEnabled(): boolean {
		return this.config.enabled
	}
}

// ============================================
// Helper Functions
// ============================================

/**
 * Helper to create HTTP metrics endpoint handler
 */
export function createMetricsHandler(registry: MetricsRegistry = baileysMetrics) {
	return async (_req: unknown, res: { setHeader: (name: string, value: string) => void; end: (body: string) => void }) => {
		const metricsOutput = await registry.getMetricsOutput()
		res.setHeader('Content-Type', registry.contentType())
		res.end(metricsOutput)
	}
}

/**
 * Create Express middleware for metrics endpoint
 */
export function createExpressMetricsMiddleware(registry: MetricsRegistry = baileysMetrics) {
	return async (_req: unknown, res: { set: (name: string, value: string) => void; send: (body: string) => void }) => {
		const metricsOutput = await registry.getMetricsOutput()
		res.set('Content-Type', registry.contentType())
		res.send(metricsOutput)
	}
}

/**
 * Track operation duration using histogram
 */
export function trackDuration<T>(
	histogram: Histogram,
	labels: Labels,
	operation: () => T
): T {
	const endTimer = histogram.startTimer(labels)
	try {
		const result = operation()
		if (result instanceof Promise) {
			return result.finally(() => endTimer()) as T
		}
		endTimer()
		return result
	} catch (error) {
		endTimer()
		throw error
	}
}

/**
 * Track operation duration using async histogram
 */
export async function trackDurationAsync<T>(
	histogram: Histogram,
	labels: Labels,
	operation: () => Promise<T>
): Promise<T> {
	const endTimer = histogram.startTimer(labels)
	try {
		const result = await operation()
		endTimer()
		return result
	} catch (error) {
		endTimer()
		throw error
	}
}

/**
 * Increment counter with automatic error tracking
 */
export function trackOperation(
	successCounter: Counter,
	errorCounter: Counter,
	labels: Labels
) {
	return {
		success: () => successCounter.inc(labels),
		failure: (errorCode?: string) => errorCounter.inc({ ...labels, code: errorCode || 'unknown' }),
	}
}

// ============================================
// Event Buffer Metrics Integration
// ============================================

// Event buffer metrics (lazy initialized)
let eventBufferMetrics: {
	eventsBuffered: Counter | null
	bufferFlushes: Counter | null
	bufferFlushEvents: Histogram | null
	bufferCurrentSize: Gauge | null
	bufferPeakSize: Gauge | null
	bufferHistoryCacheSize: Gauge | null
	bufferOverflows: Counter | null
	bufferLruCleanups: Counter | null
} | null = null

function getEventBufferMetrics() {
	if (!eventBufferMetrics) {
		eventBufferMetrics = {
			eventsBuffered: new Counter(
				'events_buffered_total',
				'Total number of events buffered',
				['event_type']
			),
			bufferFlushes: new Counter(
				'buffer_flushes_total',
				'Total number of buffer flushes',
				['forced']
			),
			bufferFlushEvents: new Histogram(
				'buffer_flush_events',
				'Number of events per buffer flush',
				[],
				[1, 5, 10, 25, 50, 100, 250, 500, 1000]
			),
			bufferCurrentSize: new Gauge(
				'buffer_current_size',
				'Current number of events in buffer'
			),
			bufferPeakSize: new Gauge(
				'buffer_peak_size',
				'Peak buffer size reached'
			),
			bufferHistoryCacheSize: new Gauge(
				'buffer_history_cache_size',
				'Current size of history cache'
			),
			bufferOverflows: new Counter(
				'buffer_overflows_total',
				'Total number of buffer overflows detected'
			),
			bufferLruCleanups: new Counter(
				'buffer_lru_cleanups_total',
				'Total number of LRU cache cleanups performed'
			)
		}
		// Register all metrics
		if (eventBufferMetrics.eventsBuffered) baileysMetrics.register(eventBufferMetrics.eventsBuffered)
		if (eventBufferMetrics.bufferFlushes) baileysMetrics.register(eventBufferMetrics.bufferFlushes)
		if (eventBufferMetrics.bufferFlushEvents) baileysMetrics.register(eventBufferMetrics.bufferFlushEvents)
		if (eventBufferMetrics.bufferCurrentSize) baileysMetrics.register(eventBufferMetrics.bufferCurrentSize)
		if (eventBufferMetrics.bufferPeakSize) baileysMetrics.register(eventBufferMetrics.bufferPeakSize)
		if (eventBufferMetrics.bufferHistoryCacheSize) baileysMetrics.register(eventBufferMetrics.bufferHistoryCacheSize)
		if (eventBufferMetrics.bufferOverflows) baileysMetrics.register(eventBufferMetrics.bufferOverflows)
		if (eventBufferMetrics.bufferLruCleanups) baileysMetrics.register(eventBufferMetrics.bufferLruCleanups)
	}
	return eventBufferMetrics
}

/**
 * Record an event being buffered
 * Used by event-buffer.ts for metrics integration
 */
export function recordEventBuffered(eventType: string, count: number = 1): void {
	try {
		const metrics = getEventBufferMetrics()
		metrics.eventsBuffered?.inc({ event_type: eventType }, count)
	} catch {
		// Metrics not initialized, ignore silently
	}
}

/**
 * Record a buffer flush operation
 * Used by event-buffer.ts for metrics integration
 */
export function recordBufferFlush(eventCount: number, forced: boolean): void {
	try {
		const metrics = getEventBufferMetrics()
		metrics.bufferFlushes?.inc({ forced: forced ? 'true' : 'false' })
		metrics.bufferFlushEvents?.observe({}, eventCount)
		metrics.bufferCurrentSize?.set({}, 0) // Reset after flush
	} catch {
		// Metrics not initialized, ignore silently
	}
}

/**
 * Update buffer statistics gauge
 * Used by event-buffer.ts for metrics integration
 */
export function updateBufferStatistics(stats: {
	currentSize: number
	peakSize: number
	historyCacheSize: number
	overflowsDetected: number
	lruCleanups: number
}): void {
	try {
		const metrics = getEventBufferMetrics()
		metrics.bufferCurrentSize?.set({}, stats.currentSize)
		metrics.bufferPeakSize?.set({}, stats.peakSize)
		metrics.bufferHistoryCacheSize?.set({}, stats.historyCacheSize)
	} catch {
		// Metrics not initialized, ignore silently
	}
}

// ============================================
// Global Instance
// ============================================

/**
 * Global metrics manager instance
 */
let globalMetricsManager: PrometheusMetricsManager | null = null

/**
 * Get or create global metrics manager
 */
export function getMetricsManager(config?: Partial<MetricsConfig>): PrometheusMetricsManager {
	if (!globalMetricsManager) {
		globalMetricsManager = new PrometheusMetricsManager(config)
	}
	return globalMetricsManager
}

/**
 * Initialize global metrics (call once at application startup)
 */
export async function initializeMetrics(config?: Partial<MetricsConfig>): Promise<PrometheusMetricsManager> {
	const manager = getMetricsManager(config)
	await manager.initialize()
	return manager
}

/**
 * Shutdown global metrics (call at application shutdown)
 */
export async function shutdownMetrics(): Promise<void> {
	if (globalMetricsManager) {
		await globalMetricsManager.shutdown()
		globalMetricsManager = null
	}
}

// ============================================
// Default Export
// ============================================

export default baileysMetrics
