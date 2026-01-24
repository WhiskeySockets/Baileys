/**
 * Health Status Utilities
 *
 * Provides health check and status information for monitoring and k8s probes.
 *
 * @module Utils/health-status
 */

import { getVersionCacheStatus } from './version-cache.js'
import { globalCircuitRegistry } from './circuit-breaker.js'

/**
 * Circuit breaker health information
 */
export interface CircuitBreakerHealth {
	name: string
	state: 'closed' | 'open' | 'half-open'
	failures: number
	successes: number
	totalCalls: number
}

/**
 * Cache health information
 */
export interface CacheHealth {
	versionCache: {
		hasCache: boolean
		isExpired: boolean
		ageMs: number | null
		source: string | null
	}
}

/**
 * Overall health status
 */
export interface HealthStatus {
	status: 'healthy' | 'degraded' | 'unhealthy'
	timestamp: number
	uptime: number
	version: string
	circuitBreakers: CircuitBreakerHealth[]
	cache: CacheHealth
	checks: {
		name: string
		status: 'pass' | 'warn' | 'fail'
		message?: string
	}[]
}

/**
 * Get the current health status of the Baileys instance.
 *
 * Useful for:
 * - Kubernetes liveness/readiness probes
 * - Load balancer health checks
 * - Monitoring dashboards
 *
 * @returns HealthStatus object with detailed status information
 *
 * @example
 * ```typescript
 * import { getHealthStatus } from '@whiskeysockets/baileys'
 *
 * // Simple health check endpoint
 * app.get('/health', (req, res) => {
 *   const health = getHealthStatus()
 *   const statusCode = health.status === 'healthy' ? 200 :
 *                      health.status === 'degraded' ? 200 : 503
 *   res.status(statusCode).json(health)
 * })
 *
 * // Kubernetes probe
 * app.get('/healthz', (req, res) => {
 *   const health = getHealthStatus()
 *   res.status(health.status !== 'unhealthy' ? 200 : 503).send(health.status)
 * })
 * ```
 */
export function getHealthStatus(): HealthStatus {
	const checks: HealthStatus['checks'] = []
	let overallStatus: HealthStatus['status'] = 'healthy'

	// 1. Check version cache
	const versionCacheStatus = getVersionCacheStatus()
	if (!versionCacheStatus.hasCache) {
		checks.push({
			name: 'version_cache',
			status: 'warn',
			message: 'No version cache available'
		})
		if (overallStatus === 'healthy') overallStatus = 'degraded'
	} else if (versionCacheStatus.isExpired) {
		checks.push({
			name: 'version_cache',
			status: 'warn',
			message: 'Version cache is expired'
		})
		if (overallStatus === 'healthy') overallStatus = 'degraded'
	} else {
		checks.push({
			name: 'version_cache',
			status: 'pass'
		})
	}

	// 2. Check circuit breakers
	const circuitBreakers: CircuitBreakerHealth[] = []
	let openCircuits = 0

	for (const [name, breaker] of globalCircuitRegistry.getAll()) {
		const stats = breaker.getStats()
		const state = breaker.getState()

		circuitBreakers.push({
			name,
			state,
			failures: stats.totalFailures,
			successes: stats.totalSuccesses,
			totalCalls: stats.totalCalls
		})

		if (state === 'open') {
			openCircuits++
		}
	}

	if (openCircuits > 0) {
		checks.push({
			name: 'circuit_breakers',
			status: openCircuits > 2 ? 'fail' : 'warn',
			message: `${openCircuits} circuit breaker(s) are open`
		})
		if (openCircuits > 2) {
			overallStatus = 'unhealthy'
		} else if (overallStatus === 'healthy') {
			overallStatus = 'degraded'
		}
	} else {
		checks.push({
			name: 'circuit_breakers',
			status: 'pass'
		})
	}

	// 3. Check memory usage (warn if > 90%)
	const memUsage = process.memoryUsage()
	const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100

	if (heapUsedPercent > 90) {
		checks.push({
			name: 'memory',
			status: 'warn',
			message: `Heap usage is ${heapUsedPercent.toFixed(1)}%`
		})
		if (overallStatus === 'healthy') overallStatus = 'degraded'
	} else {
		checks.push({
			name: 'memory',
			status: 'pass'
		})
	}

	return {
		status: overallStatus,
		timestamp: Date.now(),
		uptime: process.uptime(),
		version: process.env.npm_package_version || 'unknown',
		circuitBreakers,
		cache: {
			versionCache: {
				hasCache: versionCacheStatus.hasCache,
				isExpired: versionCacheStatus.isExpired,
				ageMs: versionCacheStatus.age,
				source: versionCacheStatus.source
			}
		},
		checks
	}
}

/**
 * Simple health check - returns true if system is healthy or degraded.
 * Use this for basic liveness probes.
 *
 * @returns true if healthy or degraded, false if unhealthy
 */
export function isHealthy(): boolean {
	const status = getHealthStatus()
	return status.status !== 'unhealthy'
}

/**
 * Get a simple status string for minimal health endpoints.
 *
 * @returns 'ok', 'degraded', or 'error'
 */
export function getSimpleHealthStatus(): 'ok' | 'degraded' | 'error' {
	const status = getHealthStatus()
	switch (status.status) {
		case 'healthy':
			return 'ok'
		case 'degraded':
			return 'degraded'
		case 'unhealthy':
			return 'error'
	}
}
