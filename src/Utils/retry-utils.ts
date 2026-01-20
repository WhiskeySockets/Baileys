/**
 * @fileoverview Lógica de retry inteligente
 * @module Utils/retry-utils
 *
 * Fornece:
 * - Exponential backoff
 * - Jitter para evitar thundering herd
 * - Max attempts configurável
 * - Predicates de retry customizáveis
 * - Integração com circuit breaker
 * - Hooks de eventos
 * - Cancelamento
 */

import { EventEmitter } from 'events'
import { metrics } from './prometheus-metrics.js'
import type { CircuitBreaker } from './circuit-breaker.js'

/**
 * Estratégias de backoff
 */
export type BackoffStrategy = 'exponential' | 'linear' | 'constant' | 'fibonacci'

/**
 * Opções de configuração de retry
 */
export interface RetryOptions {
	/** Número máximo de tentativas (default: 3) */
	maxAttempts?: number
	/** Delay base em ms (default: 1000) */
	baseDelay?: number
	/** Delay máximo em ms (default: 30000) */
	maxDelay?: number
	/** Estratégia de backoff (default: exponential) */
	backoffStrategy?: BackoffStrategy
	/** Multiplicador para exponential backoff (default: 2) */
	backoffMultiplier?: number
	/** Percentual de jitter (0-1, default: 0.1) */
	jitter?: number
	/** Função para determinar se deve retry */
	shouldRetry?: (error: Error, attempt: number) => boolean | Promise<boolean>
	/** Timeout por tentativa em ms */
	timeout?: number
	/** Nome da operação para métricas */
	operationName?: string
	/** Coletar métricas */
	collectMetrics?: boolean
	/** Circuit breaker para integração */
	circuitBreaker?: CircuitBreaker
	/** Callback antes de cada retry */
	onRetry?: (error: Error, attempt: number, delay: number) => void | Promise<void>
	/** Callback em sucesso */
	onSuccess?: (result: unknown, attempt: number) => void
	/** Callback em falha final */
	onFailure?: (error: Error, attempts: number) => void
	/** Signal para cancelamento */
	abortSignal?: AbortSignal
}

/**
 * Resultado de operação com retry
 */
export interface RetryResult<T> {
	success: boolean
	result?: T
	error?: Error
	attempts: number
	totalDuration: number
	lastAttemptDuration: number
}

/**
 * Contexto de retry
 */
export interface RetryContext {
	attempt: number
	maxAttempts: number
	lastError?: Error
	startTime: number
	aborted: boolean
}

/**
 * Erro de retry esgotado
 */
export class RetryExhaustedError extends Error {
	constructor(
		public readonly originalError: Error,
		public readonly attempts: number,
		public readonly operationName?: string
	) {
		super(
			`Retry exhausted after ${attempts} attempts${operationName ? ` for "${operationName}"` : ''}: ${originalError.message}`
		)
		this.name = 'RetryExhaustedError'
	}
}

/**
 * Erro de abort
 */
export class RetryAbortedError extends Error {
	constructor(public readonly attempt: number) {
		super(`Retry aborted at attempt ${attempt}`)
		this.name = 'RetryAbortedError'
	}
}

/**
 * Calcula delay com base na estratégia
 */
export function calculateDelay(
	attempt: number,
	baseDelay: number,
	maxDelay: number,
	strategy: BackoffStrategy,
	multiplier: number,
	jitter: number
): number {
	let delay: number

	switch (strategy) {
		case 'exponential':
			delay = baseDelay * Math.pow(multiplier, attempt - 1)
			break

		case 'linear':
			delay = baseDelay * attempt
			break

		case 'constant':
			delay = baseDelay
			break

		case 'fibonacci': {
			const fib = fibonacciNumber(attempt)
			delay = baseDelay * fib
			break
		}

		default:
			delay = baseDelay
	}

	// Aplicar cap de delay máximo
	delay = Math.min(delay, maxDelay)

	// Aplicar jitter
	if (jitter > 0) {
		const jitterAmount = delay * jitter
		delay = delay + (Math.random() * 2 - 1) * jitterAmount
	}

	return Math.max(0, Math.round(delay))
}

/**
 * Calcula número de Fibonacci
 */
function fibonacciNumber(n: number): number {
	if (n <= 1) return 1
	let a = 1,
		b = 1
	for (let i = 2; i < n; i++) {
		const c = a + b
		a = b
		b = c
	}
	return b
}

/**
 * Sleep com suporte a abort
 */
async function sleep(ms: number, signal?: AbortSignal): Promise<void> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(resolve, ms)

		if (signal) {
			if (signal.aborted) {
				clearTimeout(timer)
				reject(new RetryAbortedError(0))
				return
			}

			const abortHandler = () => {
				clearTimeout(timer)
				reject(new RetryAbortedError(0))
			}

			signal.addEventListener('abort', abortHandler, { once: true })
		}
	})
}

/**
 * Executa operação com timeout
 */
async function executeWithTimeout<T>(
	operation: () => Promise<T>,
	timeout: number,
	signal?: AbortSignal
): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		let completed = false

		const timer = setTimeout(() => {
			if (!completed) {
				completed = true
				reject(new Error(`Operation timed out after ${timeout}ms`))
			}
		}, timeout)

		if (signal?.aborted) {
			clearTimeout(timer)
			reject(new RetryAbortedError(0))
			return
		}

		operation()
			.then((result) => {
				if (!completed) {
					completed = true
					clearTimeout(timer)
					resolve(result)
				}
			})
			.catch((error) => {
				if (!completed) {
					completed = true
					clearTimeout(timer)
					reject(error)
				}
			})
	})
}

/**
 * Função principal de retry
 */
export async function retry<T>(
	operation: (context: RetryContext) => T | Promise<T>,
	options: RetryOptions = {}
): Promise<T> {
	const config = {
		maxAttempts: options.maxAttempts ?? 3,
		baseDelay: options.baseDelay ?? 1000,
		maxDelay: options.maxDelay ?? 30000,
		backoffStrategy: options.backoffStrategy ?? 'exponential',
		backoffMultiplier: options.backoffMultiplier ?? 2,
		jitter: options.jitter ?? 0.1,
		shouldRetry: options.shouldRetry ?? (() => true),
		timeout: options.timeout,
		operationName: options.operationName ?? 'operation',
		collectMetrics: options.collectMetrics ?? true,
		circuitBreaker: options.circuitBreaker,
		onRetry: options.onRetry ?? (() => {}),
		onSuccess: options.onSuccess ?? (() => {}),
		onFailure: options.onFailure ?? (() => {}),
		abortSignal: options.abortSignal,
	}

	const context: RetryContext = {
		attempt: 0,
		maxAttempts: config.maxAttempts,
		startTime: Date.now(),
		aborted: false,
	}

	let lastError: Error | undefined

	// Verificar abort inicial
	if (config.abortSignal?.aborted) {
		throw new RetryAbortedError(0)
	}

	for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
		context.attempt = attempt

		// Verificar abort
		if (config.abortSignal?.aborted) {
			context.aborted = true
			throw new RetryAbortedError(attempt)
		}

		// Verificar circuit breaker
		if (config.circuitBreaker?.isOpen()) {
			throw new Error(`Circuit breaker "${config.circuitBreaker.getName()}" is open`)
		}

		try {
			// Executar operação
			let result: T

			if (config.timeout) {
				result = await executeWithTimeout(
					() => Promise.resolve(operation(context)),
					config.timeout,
					config.abortSignal
				)
			} else {
				result = await operation(context)
			}

			// Sucesso
			if (config.collectMetrics) {
				metrics.retries.inc({ operation: config.operationName })
			}

			config.onSuccess(result, attempt)
			return result
		} catch (error) {
			lastError = error as Error
			context.lastError = lastError

			// Verificar se deve retry
			const shouldRetry = await config.shouldRetry(lastError, attempt)

			if (!shouldRetry || attempt >= config.maxAttempts) {
				// Falha final
				if (config.collectMetrics) {
					metrics.errors.inc({ category: 'retry', code: 'exhausted' })
				}

				config.onFailure(lastError, attempt)

				throw new RetryExhaustedError(lastError, attempt, config.operationName)
			}

			// Calcular delay
			const delay = calculateDelay(
				attempt,
				config.baseDelay,
				config.maxDelay,
				config.backoffStrategy,
				config.backoffMultiplier,
				config.jitter
			)

			// Callback de retry
			await config.onRetry(lastError, attempt, delay)

			if (config.collectMetrics) {
				metrics.retryLatency.observe({ operation: config.operationName }, delay)
			}

			// Aguardar delay
			await sleep(delay, config.abortSignal)
		}
	}

	// Nunca deve chegar aqui, mas TypeScript precisa
	throw new RetryExhaustedError(lastError || new Error('Unknown error'), config.maxAttempts, config.operationName)
}

/**
 * Retry com resultado detalhado
 */
export async function retryWithResult<T>(
	operation: (context: RetryContext) => T | Promise<T>,
	options: RetryOptions = {}
): Promise<RetryResult<T>> {
	const startTime = Date.now()
	let attempts = 0
	let lastAttemptStart = startTime

	try {
		const result = await retry(
			(context) => {
				attempts = context.attempt
				lastAttemptStart = Date.now()
				return operation(context)
			},
			options
		)

		return {
			success: true,
			result,
			attempts,
			totalDuration: Date.now() - startTime,
			lastAttemptDuration: Date.now() - lastAttemptStart,
		}
	} catch (error) {
		return {
			success: false,
			error: error as Error,
			attempts,
			totalDuration: Date.now() - startTime,
			lastAttemptDuration: Date.now() - lastAttemptStart,
		}
	}
}

/**
 * Factory para criar função de retry configurada
 */
export function createRetrier(defaultOptions: RetryOptions = {}) {
	return <T>(
		operation: (context: RetryContext) => T | Promise<T>,
		options?: RetryOptions
	): Promise<T> => {
		return retry(operation, { ...defaultOptions, ...options })
	}
}

/**
 * Decorator para adicionar retry a método
 */
export function withRetry(options: RetryOptions = {}) {
	return function (
		_target: unknown,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(...args: unknown[]) => unknown>
	) {
		const originalMethod = descriptor.value
		if (!originalMethod) return descriptor

		descriptor.value = async function (...args: unknown[]): Promise<unknown> {
			return retry(
				() => originalMethod.apply(this, args),
				{ ...options, operationName: options.operationName || propertyKey }
			)
		}

		return descriptor
	}
}

/**
 * Wrapper para função com retry
 */
export function retryable<T extends (...args: unknown[]) => unknown>(
	fn: T,
	options: RetryOptions = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
	return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
		return retry(() => fn(...args), options) as Promise<ReturnType<T>>
	}
}

/**
 * Classe para gerenciar retries com estado
 */
export class RetryManager extends EventEmitter {
	private activeRetries: Map<string, { cancel: () => void; context: RetryContext }> = new Map()
	private defaultOptions: RetryOptions

	constructor(defaultOptions: RetryOptions = {}) {
		super()
		this.defaultOptions = defaultOptions
	}

	/**
	 * Executa operação com retry
	 */
	async execute<T>(
		id: string,
		operation: (context: RetryContext) => T | Promise<T>,
		options?: RetryOptions
	): Promise<T> {
		// Cancelar retry anterior com mesmo ID
		this.cancel(id)

		const abortController = new AbortController()
		const mergedOptions = { ...this.defaultOptions, ...options, abortSignal: abortController.signal }

		const retryPromise = retry((context) => {
			this.activeRetries.set(id, {
				cancel: () => abortController.abort(),
				context,
			})
			this.emit('attempt', { id, attempt: context.attempt })
			return operation(context)
		}, mergedOptions)

		try {
			const result = await retryPromise
			this.emit('success', { id })
			return result
		} catch (error) {
			this.emit('failure', { id, error })
			throw error
		} finally {
			this.activeRetries.delete(id)
		}
	}

	/**
	 * Cancela retry em andamento
	 */
	cancel(id: string): boolean {
		const active = this.activeRetries.get(id)
		if (active) {
			active.cancel()
			this.activeRetries.delete(id)
			this.emit('cancelled', { id })
			return true
		}
		return false
	}

	/**
	 * Cancela todos os retries
	 */
	cancelAll(): void {
		for (const [id, active] of this.activeRetries) {
			active.cancel()
			this.emit('cancelled', { id })
		}
		this.activeRetries.clear()
	}

	/**
	 * Verifica se há retry ativo
	 */
	isActive(id: string): boolean {
		return this.activeRetries.has(id)
	}

	/**
	 * Retorna contexto de retry ativo
	 */
	getContext(id: string): RetryContext | undefined {
		return this.activeRetries.get(id)?.context
	}

	/**
	 * Retorna IDs de retries ativos
	 */
	getActiveIds(): string[] {
		return Array.from(this.activeRetries.keys())
	}
}

/**
 * Predicates comuns para shouldRetry
 */
export const retryPredicates = {
	/** Sempre retry (até max attempts) */
	always: () => true,

	/** Nunca retry */
	never: () => false,

	/** Retry apenas em erros de rede */
	onNetworkError: (error: Error) => {
		const networkErrors = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN']
		return networkErrors.some((code) => error.message.includes(code) || (error as NodeJS.ErrnoException).code === code)
	},

	/** Retry apenas em erros específicos */
	onErrorCodes:
		(codes: string[]) =>
			(error: Error): boolean => {
				return codes.some((code) => error.message.includes(code) || (error as NodeJS.ErrnoException).code === code)
			},

	/** Retry exceto em erros específicos */
	exceptErrorCodes:
		(codes: string[]) =>
			(error: Error): boolean => {
				return !codes.some((code) => error.message.includes(code) || (error as NodeJS.ErrnoException).code === code)
			},

	/** Retry em erros HTTP 5xx ou timeout */
	onServerError: (error: Error) => {
		const message = error.message.toLowerCase()
		return (
			message.includes('500') ||
			message.includes('502') ||
			message.includes('503') ||
			message.includes('504') ||
			message.includes('timeout')
		)
	},

	/** Combina múltiplos predicates com OR */
	or:
		(...predicates: Array<(error: Error, attempt: number) => boolean>) =>
			(error: Error, attempt: number): boolean => {
				return predicates.some((p) => p(error, attempt))
			},

	/** Combina múltiplos predicates com AND */
	and:
		(...predicates: Array<(error: Error, attempt: number) => boolean>) =>
			(error: Error, attempt: number): boolean => {
				return predicates.every((p) => p(error, attempt))
			},
}

/**
 * Configurações pré-definidas de retry
 */
export const retryConfigs = {
	/** Retry agressivo (muitas tentativas, delays curtos) */
	aggressive: {
		maxAttempts: 10,
		baseDelay: 100,
		maxDelay: 5000,
		backoffStrategy: 'exponential' as const,
		jitter: 0.2,
	},

	/** Retry conservador (poucas tentativas, delays longos) */
	conservative: {
		maxAttempts: 3,
		baseDelay: 2000,
		maxDelay: 60000,
		backoffStrategy: 'exponential' as const,
		jitter: 0.1,
	},

	/** Retry rápido (para operações curtas) */
	fast: {
		maxAttempts: 5,
		baseDelay: 50,
		maxDelay: 1000,
		backoffStrategy: 'linear' as const,
		jitter: 0.05,
	},

	/** Retry para operações de rede */
	network: {
		maxAttempts: 5,
		baseDelay: 1000,
		maxDelay: 30000,
		backoffStrategy: 'exponential' as const,
		jitter: 0.1,
		shouldRetry: retryPredicates.onNetworkError,
	},
}

export default retry
