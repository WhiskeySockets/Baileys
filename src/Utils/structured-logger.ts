/**
 * @fileoverview Sistema de logging estruturado para InfiniteAPI
 * @module Utils/structured-logger
 *
 * Fornece:
 * - Níveis de log configuráveis (trace, debug, info, warn, error, fatal)
 * - Formatação JSON para análise
 * - Contexto hierárquico com child loggers
 * - Integração com sistemas externos (hooks)
 * - Suporte a métricas de logging
 * - Sanitização de dados sensíveis
 */

import type { ILogger } from './logger.js'

/**
 * Níveis de log disponíveis (ordenados por severidade)
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'

/**
 * Valores numéricos para cada nível de log
 */
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
	trace: 10,
	debug: 20,
	info: 30,
	warn: 40,
	error: 50,
	fatal: 60,
	silent: 100,
}

/**
 * Configuração do logger estruturado
 */
export interface StructuredLoggerConfig {
	/** Nível mínimo de log a ser registrado */
	level: LogLevel
	/** Nome do serviço/componente */
	name?: string
	/** Contexto adicional a ser incluído em todos os logs */
	context?: Record<string, unknown>
	/** Se deve formatar como JSON (true) ou texto legível (false) */
	jsonFormat?: boolean
	/** Campos a serem sanitizados (senhas, tokens, etc.) */
	redactFields?: string[]
	/** Hook para enviar logs para sistemas externos */
	externalHook?: (entry: LogEntry) => void | Promise<void>
	/** Se deve incluir stack trace em erros */
	includeStackTrace?: boolean
	/** Timezone para timestamps (default: UTC) */
	timezone?: string
}

/**
 * Entrada de log estruturada
 */
export interface LogEntry {
	/** Timestamp ISO 8601 */
	timestamp: string
	/** Nível do log */
	level: LogLevel
	/** Valor numérico do nível */
	levelValue: number
	/** Mensagem principal */
	message: string
	/** Nome do logger/componente */
	name?: string
	/** Contexto adicional */
	context?: Record<string, unknown>
	/** Dados do objeto logado */
	data?: Record<string, unknown>
	/** Stack trace (para erros) */
	stack?: string
	/** ID de correlação para rastreamento */
	correlationId?: string
	/** Duração de operação em ms (se aplicável) */
	durationMs?: number
}

/**
 * Métricas de logging
 */
export interface LoggerMetrics {
	totalLogs: number
	logsByLevel: Record<LogLevel, number>
	errorsCount: number
	lastLogTimestamp?: string
}

/**
 * Campos padrão a serem sanitizados
 */
const DEFAULT_REDACT_FIELDS = [
	'password',
	'passwd',
	'secret',
	'token',
	'accessToken',
	'refreshToken',
	'apiKey',
	'api_key',
	'authorization',
	'auth',
	'credentials',
	'privateKey',
	'private_key',
]

/**
 * Classe principal do Logger Estruturado
 */
export class StructuredLogger implements ILogger {
	private config: Required<StructuredLoggerConfig>
	private metrics: LoggerMetrics
	private childContext: Record<string, unknown> = {}

	constructor(config: StructuredLoggerConfig) {
		this.config = {
			level: config.level,
			name: config.name || 'app',
			context: config.context || {},
			jsonFormat: config.jsonFormat ?? true,
			redactFields: [...DEFAULT_REDACT_FIELDS, ...(config.redactFields || [])],
			externalHook: config.externalHook || (() => {}),
			includeStackTrace: config.includeStackTrace ?? true,
			timezone: config.timezone || 'UTC',
		}

		this.metrics = {
			totalLogs: 0,
			logsByLevel: {
				trace: 0,
				debug: 0,
				info: 0,
				warn: 0,
				error: 0,
				fatal: 0,
				silent: 0,
			},
			errorsCount: 0,
		}
	}

	/**
	 * Getter para o nível atual do logger (compatibilidade com ILogger)
	 */
	get level(): string {
		return this.config.level
	}

	/**
	 * Setter para o nível do logger
	 */
	set level(newLevel: string) {
		if (newLevel in LOG_LEVEL_VALUES) {
			this.config.level = newLevel as LogLevel
		}
	}

	/**
	 * Cria um logger filho com contexto adicional
	 */
	child(obj: Record<string, unknown>): StructuredLogger {
		const childLogger = new StructuredLogger({
			...this.config,
			context: { ...this.config.context, ...this.childContext, ...obj },
		})
		childLogger.childContext = { ...this.childContext, ...obj }
		return childLogger
	}

	/**
	 * Verifica se o nível de log está habilitado
	 */
	isLevelEnabled(level: LogLevel): boolean {
		return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[this.config.level]
	}

	/**
	 * Método principal de logging
	 */
	private log(level: LogLevel, obj: unknown, msg?: string): void {
		if (!this.isLevelEnabled(level)) {
			return
		}

		const entry = this.createLogEntry(level, obj, msg)

		// Atualizar métricas
		this.updateMetrics(level)

		// Output
		this.output(entry)

		// Hook externo (async, não bloqueia)
		if (this.config.externalHook) {
			Promise.resolve(this.config.externalHook(entry)).catch(() => {
				// Silently ignore hook errors
			})
		}
	}

	/**
	 * Cria uma entrada de log estruturada
	 */
	private createLogEntry(level: LogLevel, obj: unknown, msg?: string): LogEntry {
		const timestamp = new Date().toISOString()
		let message = msg || ''
		let data: Record<string, unknown> | undefined
		let stack: string | undefined

		// Processar objeto
		if (obj instanceof Error) {
			message = message || obj.message
			if (this.config.includeStackTrace && obj.stack) {
				stack = obj.stack
			}
			data = {
				errorName: obj.name,
				errorMessage: obj.message,
				...(obj as unknown as Record<string, unknown>),
			}
		} else if (typeof obj === 'object' && obj !== null) {
			data = this.sanitize(obj as Record<string, unknown>)
			if (!message && 'msg' in (obj as Record<string, unknown>)) {
				message = String((obj as Record<string, unknown>).msg)
			}
		} else if (typeof obj === 'string') {
			message = message || obj
		}

		// Extrair correlationId e durationMs se presentes
		const correlationId = data?.correlationId as string | undefined
		const durationMs = data?.durationMs as number | undefined

		return {
			timestamp,
			level,
			levelValue: LOG_LEVEL_VALUES[level],
			message,
			name: this.config.name,
			context: Object.keys(this.config.context).length > 0 ? this.config.context : undefined,
			data,
			stack,
			correlationId,
			durationMs,
		}
	}

	/**
	 * Sanitiza dados sensíveis
	 */
	private sanitize(obj: Record<string, unknown>): Record<string, unknown> {
		const sanitized: Record<string, unknown> = {}

		for (const [key, value] of Object.entries(obj)) {
			const lowerKey = key.toLowerCase()

			if (this.config.redactFields.some((field) => lowerKey.includes(field.toLowerCase()))) {
				sanitized[key] = '[REDACTED]'
			} else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
				sanitized[key] = this.sanitize(value as Record<string, unknown>)
			} else {
				sanitized[key] = value
			}
		}

		return sanitized
	}

	/**
	 * Atualiza métricas internas
	 */
	private updateMetrics(level: LogLevel): void {
		this.metrics.totalLogs++
		this.metrics.logsByLevel[level]++
		this.metrics.lastLogTimestamp = new Date().toISOString()

		if (level === 'error' || level === 'fatal') {
			this.metrics.errorsCount++
		}
	}

	/**
	 * Output do log
	 */
	private output(entry: LogEntry): void {
		const output = this.config.jsonFormat ? JSON.stringify(entry) : this.formatText(entry)

		switch (entry.level) {
			case 'trace':
			case 'debug':
				console.debug(output)
				break
			case 'info':
				console.info(output)
				break
			case 'warn':
				console.warn(output)
				break
			case 'error':
			case 'fatal':
				console.error(output)
				break
		}
	}

	/**
	 * Formata log como texto legível
	 */
	private formatText(entry: LogEntry): string {
		const parts = [
			`[${entry.timestamp}]`,
			`[${entry.level.toUpperCase()}]`,
			entry.name ? `[${entry.name}]` : '',
			entry.correlationId ? `[${entry.correlationId}]` : '',
			entry.message,
			entry.durationMs !== undefined ? `(${entry.durationMs}ms)` : '',
		]

		let text = parts.filter(Boolean).join(' ')

		if (entry.data && Object.keys(entry.data).length > 0) {
			text += ` | ${JSON.stringify(entry.data)}`
		}

		if (entry.stack) {
			text += `\n${entry.stack}`
		}

		return text
	}

	// Métodos de conveniência para cada nível de log

	trace(obj: unknown, msg?: string): void {
		this.log('trace', obj, msg)
	}

	debug(obj: unknown, msg?: string): void {
		this.log('debug', obj, msg)
	}

	info(obj: unknown, msg?: string): void {
		this.log('info', obj, msg)
	}

	warn(obj: unknown, msg?: string): void {
		this.log('warn', obj, msg)
	}

	error(obj: unknown, msg?: string): void {
		this.log('error', obj, msg)
	}

	fatal(obj: unknown, msg?: string): void {
		this.log('fatal', obj, msg)
	}

	/**
	 * Log com contexto temporário
	 */
	withContext(context: Record<string, unknown>): StructuredLogger {
		return this.child(context)
	}

	/**
	 * Log com correlation ID
	 */
	withCorrelationId(correlationId: string): StructuredLogger {
		return this.child({ correlationId })
	}

	/**
	 * Log de operação com duração
	 */
	logOperation<T>(
		operationName: string,
		operation: () => T | Promise<T>,
		level: LogLevel = 'info'
	): T | Promise<T> {
		const startTime = Date.now()
		const contextLogger = this.child({ operation: operationName })

		contextLogger.log(level, { event: 'operation_start' }, `Starting ${operationName}`)

		const handleResult = (result: T): T => {
			const durationMs = Date.now() - startTime
			contextLogger.log(level, { event: 'operation_complete', durationMs }, `Completed ${operationName}`)
			return result
		}

		const handleError = (error: Error): never => {
			const durationMs = Date.now() - startTime
			contextLogger.error({ event: 'operation_error', durationMs, error }, `Failed ${operationName}`)
			throw error
		}

		try {
			const result = operation()

			if (result instanceof Promise) {
				return result.then(handleResult).catch(handleError) as Promise<T>
			}

			return handleResult(result)
		} catch (error) {
			return handleError(error as Error)
		}
	}

	/**
	 * Retorna métricas do logger
	 */
	getMetrics(): LoggerMetrics {
		return { ...this.metrics }
	}

	/**
	 * Reseta métricas
	 */
	resetMetrics(): void {
		this.metrics = {
			totalLogs: 0,
			logsByLevel: {
				trace: 0,
				debug: 0,
				info: 0,
				warn: 0,
				error: 0,
				fatal: 0,
				silent: 0,
			},
			errorsCount: 0,
		}
	}
}

/**
 * Factory para criar logger estruturado
 */
export function createStructuredLogger(config: Partial<StructuredLoggerConfig> = {}): StructuredLogger {
	return new StructuredLogger({
		level: config.level || 'info',
		...config,
	})
}

/**
 * Logger padrão singleton
 */
let defaultLogger: StructuredLogger | null = null

export function getDefaultLogger(): StructuredLogger {
	if (!defaultLogger) {
		defaultLogger = createStructuredLogger({
			level: 'info',
			name: 'baileys',
			jsonFormat: process.env.NODE_ENV === 'production',
		})
	}
	return defaultLogger
}

export function setDefaultLogger(logger: StructuredLogger): void {
	defaultLogger = logger
}

/**
 * Utilitário para medir tempo de execução
 */
export function createTimer(): { elapsed: () => number; elapsedMs: () => string } {
	const start = process.hrtime.bigint()
	return {
		elapsed: () => Number(process.hrtime.bigint() - start) / 1_000_000,
		elapsedMs: () => `${(Number(process.hrtime.bigint() - start) / 1_000_000).toFixed(2)}ms`,
	}
}

export default StructuredLogger
