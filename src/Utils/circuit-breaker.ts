/**
 * @fileoverview Proteção contra falhas em cascata - Circuit Breaker
 * @module Utils/circuit-breaker
 *
 * Fornece:
 * - Estados: Closed, Open, Half-Open
 * - Thresholds configuráveis
 * - Recuperação automática
 * - Callbacks de estado
 * - Integração com métricas
 * - Fallback handlers
 */

import { EventEmitter } from 'events'
import { metrics } from './prometheus-metrics.js'

/**
 * Estados do Circuit Breaker
 */
export type CircuitState = 'closed' | 'open' | 'half-open'

/**
 * Opções de configuração do Circuit Breaker
 */
export interface CircuitBreakerOptions {
	/** Nome do circuit breaker (para métricas) */
	name: string
	/** Número de falhas para abrir o circuito */
	failureThreshold?: number
	/** Número de sucessos para fechar o circuito (em half-open) */
	successThreshold?: number
	/** Tempo em ms para tentar half-open após open */
	resetTimeout?: number
	/** Timeout para operações em ms */
	timeout?: number
	/** Função para determinar se erro deve contar como falha */
	isFailure?: (error: Error) => boolean
	/** Coletar métricas */
	collectMetrics?: boolean
	/** Função de fallback quando circuito está aberto */
	fallback?: <T>() => T | Promise<T>
	/** Callback quando estado muda */
	onStateChange?: (from: CircuitState, to: CircuitState) => void
	/** Callback em falha */
	onFailure?: (error: Error) => void
	/** Callback em sucesso */
	onSuccess?: () => void
	/** Callback quando circuito abre */
	onOpen?: () => void
	/** Callback quando circuito fecha */
	onClose?: () => void
}

/**
 * Estatísticas do Circuit Breaker
 */
export interface CircuitBreakerStats {
	state: CircuitState
	failures: number
	successes: number
	totalCalls: number
	totalFailures: number
	totalSuccesses: number
	lastFailureTime?: number
	lastSuccessTime?: number
	lastStateChange?: number
	isOpen: boolean
	isClosed: boolean
	isHalfOpen: boolean
}

/**
 * Erro lançado quando circuito está aberto
 */
export class CircuitOpenError extends Error {
	constructor(
		public readonly circuitName: string,
		public readonly state: CircuitState
	) {
		super(`Circuit breaker "${circuitName}" is ${state}`)
		this.name = 'CircuitOpenError'
	}
}

/**
 * Erro de timeout
 */
export class CircuitTimeoutError extends Error {
	constructor(
		public readonly circuitName: string,
		public readonly timeoutMs: number
	) {
		super(`Circuit breaker "${circuitName}" operation timed out after ${timeoutMs}ms`)
		this.name = 'CircuitTimeoutError'
	}
}

/**
 * Classe principal do Circuit Breaker
 */
export class CircuitBreaker extends EventEmitter {
	private state: CircuitState = 'closed'
	private failures = 0
	private successes = 0
	private totalCalls = 0
	private totalFailures = 0
	private totalSuccesses = 0
	private lastFailureTime?: number
	private lastSuccessTime?: number
	private lastStateChange?: number
	private resetTimer?: ReturnType<typeof setTimeout>
	private options: Required<CircuitBreakerOptions>

	constructor(options: CircuitBreakerOptions) {
		super()

		this.options = {
			name: options.name,
			failureThreshold: options.failureThreshold ?? 5,
			successThreshold: options.successThreshold ?? 2,
			resetTimeout: options.resetTimeout ?? 30000,
			timeout: options.timeout ?? 10000,
			isFailure: options.isFailure ?? (() => true),
			collectMetrics: options.collectMetrics ?? true,
			fallback: options.fallback ?? (() => {
				throw new CircuitOpenError(this.options.name, this.state)
			}),
			onStateChange: options.onStateChange ?? (() => {}),
			onFailure: options.onFailure ?? (() => {}),
			onSuccess: options.onSuccess ?? (() => {}),
			onOpen: options.onOpen ?? (() => {}),
			onClose: options.onClose ?? (() => {}),
		}

		this.lastStateChange = Date.now()
	}

	/**
	 * Executa operação protegida pelo circuit breaker
	 */
	async execute<T>(operation: () => T | Promise<T>): Promise<T> {
		this.totalCalls++

		// Verificar estado
		if (this.state === 'open') {
			if (this.options.collectMetrics) {
				metrics.errors.inc({ category: 'circuit_breaker', code: 'open' })
			}

			return this.options.fallback() as T
		}

		// Executar com timeout
		try {
			const result = await this.executeWithTimeout(operation)
			this.recordSuccess()
			return result
		} catch (error) {
			this.recordFailure(error as Error)
			throw error
		}
	}

	/**
	 * Executa operação síncrona protegida
	 */
	executeSync<T>(operation: () => T): T {
		this.totalCalls++

		if (this.state === 'open') {
			if (this.options.collectMetrics) {
				metrics.errors.inc({ category: 'circuit_breaker', code: 'open' })
			}

			return this.options.fallback() as T
		}

		try {
			const result = operation()
			this.recordSuccess()
			return result
		} catch (error) {
			this.recordFailure(error as Error)
			throw error
		}
	}

	/**
	 * Executa com timeout
	 */
	private async executeWithTimeout<T>(operation: () => T | Promise<T>): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const timer = setTimeout(() => {
				reject(new CircuitTimeoutError(this.options.name, this.options.timeout))
			}, this.options.timeout)

			Promise.resolve(operation())
				.then((result) => {
					clearTimeout(timer)
					resolve(result)
				})
				.catch((error) => {
					clearTimeout(timer)
					reject(error)
				})
		})
	}

	/**
	 * Registra sucesso
	 */
	private recordSuccess(): void {
		this.totalSuccesses++
		this.lastSuccessTime = Date.now()
		this.failures = 0

		if (this.options.collectMetrics) {
			metrics.socketEvents.inc({ event: 'circuit_success' })
		}

		this.options.onSuccess()
		this.emit('success')

		if (this.state === 'half-open') {
			this.successes++

			if (this.successes >= this.options.successThreshold) {
				this.transitionTo('closed')
			}
		}
	}

	/**
	 * Registra falha
	 */
	private recordFailure(error: Error): void {
		// Verificar se erro deve contar como falha
		if (!this.options.isFailure(error)) {
			return
		}

		this.totalFailures++
		this.lastFailureTime = Date.now()
		this.failures++
		this.successes = 0

		if (this.options.collectMetrics) {
			metrics.errors.inc({ category: 'circuit_breaker', code: 'failure' })
		}

		this.options.onFailure(error)
		this.emit('failure', error)

		if (this.state === 'half-open') {
			this.transitionTo('open')
		} else if (this.state === 'closed' && this.failures >= this.options.failureThreshold) {
			this.transitionTo('open')
		}
	}

	/**
	 * Transiciona para novo estado
	 */
	private transitionTo(newState: CircuitState): void {
		const oldState = this.state

		if (oldState === newState) {
			return
		}

		this.state = newState
		this.lastStateChange = Date.now()

		// Limpar timer existente
		if (this.resetTimer) {
			clearTimeout(this.resetTimer)
			this.resetTimer = undefined
		}

		// Resetar contadores baseado no novo estado
		if (newState === 'closed') {
			this.failures = 0
			this.successes = 0
			this.options.onClose()
			this.emit('close')
		} else if (newState === 'open') {
			this.successes = 0
			this.options.onOpen()
			this.emit('open')

			// Agendar tentativa de half-open
			this.resetTimer = setTimeout(() => {
				this.transitionTo('half-open')
			}, this.options.resetTimeout)
		} else if (newState === 'half-open') {
			this.successes = 0
			this.failures = 0
			this.emit('half-open')
		}

		this.options.onStateChange(oldState, newState)
		this.emit('state-change', { from: oldState, to: newState })
	}

	/**
	 * Força abertura do circuito
	 */
	trip(): void {
		this.transitionTo('open')
	}

	/**
	 * Força fechamento do circuito
	 */
	reset(): void {
		this.transitionTo('closed')
	}

	/**
	 * Retorna estado atual
	 */
	getState(): CircuitState {
		return this.state
	}

	/**
	 * Verifica se circuito está aberto
	 */
	isOpen(): boolean {
		return this.state === 'open'
	}

	/**
	 * Verifica se circuito está fechado
	 */
	isClosed(): boolean {
		return this.state === 'closed'
	}

	/**
	 * Verifica se circuito está half-open
	 */
	isHalfOpen(): boolean {
		return this.state === 'half-open'
	}

	/**
	 * Retorna estatísticas
	 */
	getStats(): CircuitBreakerStats {
		return {
			state: this.state,
			failures: this.failures,
			successes: this.successes,
			totalCalls: this.totalCalls,
			totalFailures: this.totalFailures,
			totalSuccesses: this.totalSuccesses,
			lastFailureTime: this.lastFailureTime,
			lastSuccessTime: this.lastSuccessTime,
			lastStateChange: this.lastStateChange,
			isOpen: this.isOpen(),
			isClosed: this.isClosed(),
			isHalfOpen: this.isHalfOpen(),
		}
	}

	/**
	 * Retorna nome do circuit breaker
	 */
	getName(): string {
		return this.options.name
	}

	/**
	 * Destroy e limpa recursos
	 */
	destroy(): void {
		if (this.resetTimer) {
			clearTimeout(this.resetTimer)
		}
		this.removeAllListeners()
	}
}

/**
 * Factory para criar circuit breaker
 */
export function createCircuitBreaker(options: CircuitBreakerOptions): CircuitBreaker {
	return new CircuitBreaker(options)
}

/**
 * Registry de circuit breakers
 */
export class CircuitBreakerRegistry {
	private breakers: Map<string, CircuitBreaker> = new Map()

	/**
	 * Obtém ou cria circuit breaker
	 */
	get(name: string, options?: Omit<CircuitBreakerOptions, 'name'>): CircuitBreaker {
		if (!this.breakers.has(name)) {
			const breaker = new CircuitBreaker({ ...options, name })
			this.breakers.set(name, breaker)
		}
		return this.breakers.get(name)!
	}

	/**
	 * Verifica se circuit breaker existe
	 */
	has(name: string): boolean {
		return this.breakers.has(name)
	}

	/**
	 * Remove circuit breaker
	 */
	remove(name: string): boolean {
		const breaker = this.breakers.get(name)
		if (breaker) {
			breaker.destroy()
			return this.breakers.delete(name)
		}
		return false
	}

	/**
	 * Retorna todos os circuit breakers
	 */
	getAll(): Map<string, CircuitBreaker> {
		return new Map(this.breakers)
	}

	/**
	 * Retorna estatísticas de todos os circuit breakers
	 */
	getAllStats(): Record<string, CircuitBreakerStats> {
		const stats: Record<string, CircuitBreakerStats> = {}
		for (const [name, breaker] of this.breakers) {
			stats[name] = breaker.getStats()
		}
		return stats
	}

	/**
	 * Reseta todos os circuit breakers
	 */
	resetAll(): void {
		for (const breaker of this.breakers.values()) {
			breaker.reset()
		}
	}

	/**
	 * Destroy todos os circuit breakers
	 */
	destroyAll(): void {
		for (const breaker of this.breakers.values()) {
			breaker.destroy()
		}
		this.breakers.clear()
	}
}

/**
 * Registry global
 */
export const globalCircuitRegistry = new CircuitBreakerRegistry()

/**
 * Decorator para proteger método com circuit breaker
 */
export function circuitBreaker(options: Omit<CircuitBreakerOptions, 'name'> & { name?: string } = {}) {
	return function (
		_target: unknown,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(...args: unknown[]) => unknown>
	) {
		const originalMethod = descriptor.value
		if (!originalMethod) return descriptor

		const name = options.name || propertyKey
		const breaker = globalCircuitRegistry.get(name, options)

		descriptor.value = async function (...args: unknown[]): Promise<unknown> {
			return breaker.execute(() => originalMethod.apply(this, args))
		}

		return descriptor
	}
}

/**
 * Wrapper para função com circuit breaker
 */
export function withCircuitBreaker<T extends (...args: unknown[]) => unknown>(
	fn: T,
	options: CircuitBreakerOptions
): T {
	const breaker = new CircuitBreaker(options)

	return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
		return breaker.execute(() => fn(...args)) as Promise<ReturnType<T>>
	}) as unknown as T
}

/**
 * Verifica saúde de todos os circuit breakers
 */
export function getCircuitHealth(): {
	healthy: boolean
	openCircuits: string[]
	stats: Record<string, CircuitBreakerStats>
} {
	const stats = globalCircuitRegistry.getAllStats()
	const openCircuits: string[] = []

	for (const [name, stat] of Object.entries(stats)) {
		if (stat.isOpen) {
			openCircuits.push(name)
		}
	}

	return {
		healthy: openCircuits.length === 0,
		openCircuits,
		stats,
	}
}

export default CircuitBreaker
