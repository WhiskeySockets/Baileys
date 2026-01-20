/**
 * @fileoverview Adaptador entre diferentes sistemas de logging
 * @module Utils/logger-adapter
 *
 * Fornece:
 * - Adapter pattern para integrar diferentes loggers
 * - Mapeamento de níveis de log entre sistemas
 * - Transformação de formatos de log
 * - Compatibilidade com Pino, Console e StructuredLogger
 */

import type { ILogger } from './logger.js'
import type P from 'pino'
import { StructuredLogger, createStructuredLogger, type LogLevel, LOG_LEVEL_VALUES } from './structured-logger.js'

/**
 * Tipo de logger suportado
 */
export type LoggerType = 'pino' | 'console' | 'structured' | 'custom'

/**
 * Configuração do adapter
 */
export interface LoggerAdapterConfig {
	/** Tipo de logger de origem */
	sourceType: LoggerType
	/** Tipo de logger de destino */
	targetType: LoggerType
	/** Mapeamento customizado de níveis */
	levelMapping?: Record<string, LogLevel>
	/** Transformador de contexto */
	contextTransformer?: (context: Record<string, unknown>) => Record<string, unknown>
	/** Filtro de logs */
	logFilter?: (level: LogLevel, message: string, data?: unknown) => boolean
}

/**
 * Mapeamento padrão de níveis Pino para StructuredLogger
 */
const PINO_LEVEL_MAPPING: Record<number, LogLevel> = {
	10: 'trace',
	20: 'debug',
	30: 'info',
	40: 'warn',
	50: 'error',
	60: 'fatal',
}

/**
 * Mapeamento reverso para Pino
 */
const STRUCTURED_TO_PINO_LEVEL: Record<LogLevel, number> = {
	trace: 10,
	debug: 20,
	info: 30,
	warn: 40,
	error: 50,
	fatal: 60,
	silent: 100,
}

/**
 * Classe adaptadora principal
 */
export class LoggerAdapter implements ILogger {
	private sourceLogger: ILogger
	private targetLogger: ILogger | null = null
	private config: LoggerAdapterConfig

	constructor(sourceLogger: ILogger, config: Partial<LoggerAdapterConfig> = {}) {
		this.sourceLogger = sourceLogger
		this.config = {
			sourceType: config.sourceType || 'pino',
			targetType: config.targetType || 'structured',
			levelMapping: config.levelMapping,
			contextTransformer: config.contextTransformer,
			logFilter: config.logFilter,
		}
	}

	get level(): string {
		return this.sourceLogger.level
	}

	set level(newLevel: string) {
		this.sourceLogger.level = newLevel
		if (this.targetLogger) {
			this.targetLogger.level = newLevel
		}
	}

	/**
	 * Define o logger de destino
	 */
	setTargetLogger(logger: ILogger): void {
		this.targetLogger = logger
	}

	/**
	 * Cria um logger filho
	 */
	child(obj: Record<string, unknown>): LoggerAdapter {
		const transformedContext = this.config.contextTransformer ? this.config.contextTransformer(obj) : obj

		const childAdapter = new LoggerAdapter(this.sourceLogger.child(transformedContext), this.config)

		if (this.targetLogger) {
			childAdapter.setTargetLogger(this.targetLogger.child(transformedContext))
		}

		return childAdapter
	}

	/**
	 * Mapeia nível de log
	 */
	private mapLevel(level: string | number): LogLevel {
		if (typeof level === 'number') {
			return PINO_LEVEL_MAPPING[level] || 'info'
		}

		if (this.config.levelMapping && level in this.config.levelMapping) {
			return this.config.levelMapping[level]
		}

		return (level as LogLevel) || 'info'
	}

	/**
	 * Verifica se o log deve ser processado
	 */
	private shouldLog(level: LogLevel, msg: string, obj?: unknown): boolean {
		if (this.config.logFilter) {
			return this.config.logFilter(level, msg, obj)
		}
		return true
	}

	/**
	 * Processa log em ambos loggers
	 */
	private processLog(level: LogLevel, obj: unknown, msg?: string): void {
		if (!this.shouldLog(level, msg || '', obj)) {
			return
		}

		// Log no source logger
		const sourceMethod = this.sourceLogger[level as keyof ILogger]
		if (typeof sourceMethod === 'function') {
			;(sourceMethod as (obj: unknown, msg?: string) => void).call(this.sourceLogger, obj, msg)
		}

		// Log no target logger se configurado
		if (this.targetLogger) {
			const targetMethod = this.targetLogger[level as keyof ILogger]
			if (typeof targetMethod === 'function') {
				;(targetMethod as (obj: unknown, msg?: string) => void).call(this.targetLogger, obj, msg)
			}
		}
	}

	trace(obj: unknown, msg?: string): void {
		this.processLog('trace', obj, msg)
	}

	debug(obj: unknown, msg?: string): void {
		this.processLog('debug', obj, msg)
	}

	info(obj: unknown, msg?: string): void {
		this.processLog('info', obj, msg)
	}

	warn(obj: unknown, msg?: string): void {
		this.processLog('warn', obj, msg)
	}

	error(obj: unknown, msg?: string): void {
		this.processLog('error', obj, msg)
	}
}

/**
 * Wrapper para converter Pino logger em StructuredLogger
 */
export class PinoToStructuredAdapter implements ILogger {
	private pinoLogger: P.Logger
	private structuredLogger: StructuredLogger

	constructor(pinoLogger: P.Logger, structuredLoggerConfig?: Parameters<typeof createStructuredLogger>[0]) {
		this.pinoLogger = pinoLogger
		this.structuredLogger = createStructuredLogger({
			level: this.mapPinoLevel(pinoLogger.level),
			...structuredLoggerConfig,
		})
	}

	get level(): string {
		return this.pinoLogger.level
	}

	set level(newLevel: string) {
		this.pinoLogger.level = newLevel
		this.structuredLogger.level = newLevel
	}

	private mapPinoLevel(pinoLevel: string): LogLevel {
		const levelMap: Record<string, LogLevel> = {
			trace: 'trace',
			debug: 'debug',
			info: 'info',
			warn: 'warn',
			error: 'error',
			fatal: 'fatal',
			silent: 'silent',
		}
		return levelMap[pinoLevel] || 'info'
	}

	child(obj: Record<string, unknown>): PinoToStructuredAdapter {
		const adapter = new PinoToStructuredAdapter(this.pinoLogger.child(obj))
		return adapter
	}

	trace(obj: unknown, msg?: string): void {
		this.pinoLogger.trace(obj as object, msg)
		this.structuredLogger.trace(obj, msg)
	}

	debug(obj: unknown, msg?: string): void {
		this.pinoLogger.debug(obj as object, msg)
		this.structuredLogger.debug(obj, msg)
	}

	info(obj: unknown, msg?: string): void {
		this.pinoLogger.info(obj as object, msg)
		this.structuredLogger.info(obj, msg)
	}

	warn(obj: unknown, msg?: string): void {
		this.pinoLogger.warn(obj as object, msg)
		this.structuredLogger.warn(obj, msg)
	}

	error(obj: unknown, msg?: string): void {
		this.pinoLogger.error(obj as object, msg)
		this.structuredLogger.error(obj, msg)
	}

	/**
	 * Obtém métricas do structured logger
	 */
	getMetrics() {
		return this.structuredLogger.getMetrics()
	}
}

/**
 * Factory para criar adapter baseado no tipo de logger
 */
export function createLoggerAdapter(
	logger: ILogger,
	config?: Partial<LoggerAdapterConfig>
): LoggerAdapter {
	return new LoggerAdapter(logger, config)
}

/**
 * Converte qualquer logger para a interface ILogger
 */
export function normalizeLogger(logger: unknown): ILogger {
	if (isILogger(logger)) {
		return logger
	}

	// Se for um objeto com métodos de log
	if (typeof logger === 'object' && logger !== null) {
		const logObj = logger as Record<string, unknown>

		return {
			level: (logObj.level as string) || 'info',
			child: (obj: Record<string, unknown>) => {
				if (typeof logObj.child === 'function') {
					return normalizeLogger((logObj.child as (obj: Record<string, unknown>) => unknown)(obj))
				}
				return normalizeLogger(logger)
			},
			trace: createLogMethod(logObj, 'trace'),
			debug: createLogMethod(logObj, 'debug'),
			info: createLogMethod(logObj, 'info'),
			warn: createLogMethod(logObj, 'warn'),
			error: createLogMethod(logObj, 'error'),
		}
	}

	// Fallback: console logger
	return createConsoleLogger()
}

/**
 * Verifica se objeto implementa ILogger
 */
export function isILogger(obj: unknown): obj is ILogger {
	if (typeof obj !== 'object' || obj === null) {
		return false
	}

	const logger = obj as Record<string, unknown>

	return (
		typeof logger.child === 'function' &&
		typeof logger.trace === 'function' &&
		typeof logger.debug === 'function' &&
		typeof logger.info === 'function' &&
		typeof logger.warn === 'function' &&
		typeof logger.error === 'function'
	)
}

/**
 * Cria método de log genérico
 */
function createLogMethod(
	logger: Record<string, unknown>,
	level: string
): (obj: unknown, msg?: string) => void {
	return (obj: unknown, msg?: string) => {
		if (typeof logger[level] === 'function') {
			;(logger[level] as (obj: unknown, msg?: string) => void)(obj, msg)
		} else if (typeof (console as Record<string, unknown>)[level] === 'function') {
			;(console as Record<string, (...args: unknown[]) => void>)[level](obj, msg)
		}
	}
}

/**
 * Cria um logger baseado em console
 */
export function createConsoleLogger(prefix?: string): ILogger {
	const formatMessage = (level: string, obj: unknown, msg?: string): string => {
		const timestamp = new Date().toISOString()
		const prefixStr = prefix ? `[${prefix}]` : ''
		const message = msg || (typeof obj === 'string' ? obj : '')
		const data = typeof obj === 'object' ? JSON.stringify(obj) : ''

		return `${timestamp} ${prefixStr}[${level.toUpperCase()}] ${message} ${data}`.trim()
	}

	return {
		level: 'info',
		child(obj: Record<string, unknown>): ILogger {
			const childPrefix = prefix ? `${prefix}:${Object.values(obj)[0]}` : String(Object.values(obj)[0])
			return createConsoleLogger(childPrefix)
		},
		trace(obj: unknown, msg?: string): void {
			console.debug(formatMessage('trace', obj, msg))
		},
		debug(obj: unknown, msg?: string): void {
			console.debug(formatMessage('debug', obj, msg))
		},
		info(obj: unknown, msg?: string): void {
			console.info(formatMessage('info', obj, msg))
		},
		warn(obj: unknown, msg?: string): void {
			console.warn(formatMessage('warn', obj, msg))
		},
		error(obj: unknown, msg?: string): void {
			console.error(formatMessage('error', obj, msg))
		},
	}
}

export default LoggerAdapter
