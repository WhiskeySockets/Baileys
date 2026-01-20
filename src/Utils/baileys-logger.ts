/**
 * @fileoverview Logger customizado específico para Baileys
 * @module Utils/baileys-logger
 *
 * Fornece:
 * - Logger pré-configurado para contexto Baileys/WhatsApp
 * - Categorização de eventos por tipo (connection, message, media, etc.)
 * - Filtros específicos para reduzir ruído
 * - Métricas de eventos WhatsApp
 * - Formatação otimizada para debugging
 */

import type { ILogger } from './logger.js'
import { StructuredLogger, createStructuredLogger, type LogLevel, type LogEntry } from './structured-logger.js'

/**
 * Categorias de log específicas do Baileys
 */
export type BaileysLogCategory =
	| 'connection'    // Eventos de conexão WebSocket
	| 'auth'          // Autenticação e QR code
	| 'message'       // Envio/recebimento de mensagens
	| 'media'         // Upload/download de mídia
	| 'group'         // Operações de grupo
	| 'presence'      // Status de presença
	| 'call'          // Chamadas de voz/vídeo
	| 'sync'          // Sincronização de dados
	| 'encryption'    // Operações de criptografia
	| 'retry'         // Retentativas de operações
	| 'socket'        // Eventos de socket baixo nível
	| 'binary'        // Codificação/decodificação binária
	| 'unknown'       // Categoria desconhecida

/**
 * Configuração do Baileys Logger
 */
export interface BaileysLoggerConfig {
	/** Nível de log padrão */
	level: LogLevel
	/** Categorias a serem ignoradas */
	ignoredCategories?: BaileysLogCategory[]
	/** Categorias com nível de log elevado (debug sempre) */
	verboseCategories?: BaileysLogCategory[]
	/** Se deve logar payloads de mensagens (pode ser sensível) */
	logMessagePayloads?: boolean
	/** Se deve logar dados binários em hex */
	logBinaryData?: boolean
	/** Prefixo para identificar instância */
	instanceId?: string
	/** Handler para eventos específicos */
	eventHandler?: (category: BaileysLogCategory, entry: LogEntry) => void
	/** Limite de tamanho para payloads logados (bytes) */
	maxPayloadSize?: number
}

/**
 * Métricas específicas do Baileys
 */
export interface BaileysLoggerMetrics {
	connectionAttempts: number
	connectionSuccesses: number
	connectionFailures: number
	messagesSent: number
	messagesReceived: number
	mediaUploads: number
	mediaDownloads: number
	retryAttempts: number
	encryptionOperations: number
	errorsByCategory: Record<BaileysLogCategory, number>
	lastConnectionTime?: string
	lastMessageTime?: string
}

/**
 * Padrões para detectar categoria de log
 */
const CATEGORY_PATTERNS: Array<{ pattern: RegExp; category: BaileysLogCategory }> = [
	{ pattern: /connect|disconnect|socket|ws|websocket|open|close/i, category: 'connection' },
	{ pattern: /auth|qr|pairing|login|logout|creds/i, category: 'auth' },
	{ pattern: /message|msg|chat|text|send|recv|read|receipt/i, category: 'message' },
	{ pattern: /media|image|video|audio|document|sticker|upload|download/i, category: 'media' },
	{ pattern: /group|participant|admin|subject|invite/i, category: 'group' },
	{ pattern: /presence|online|offline|typing|available/i, category: 'presence' },
	{ pattern: /call|voice|video|ring/i, category: 'call' },
	{ pattern: /sync|history|initial|full/i, category: 'sync' },
	{ pattern: /encrypt|decrypt|signal|key|cipher/i, category: 'encryption' },
	{ pattern: /retry|attempt|backoff|reconnect/i, category: 'retry' },
	{ pattern: /binary|encode|decode|proto|buffer/i, category: 'binary' },
]

/**
 * Logger customizado para Baileys
 */
export class BaileysLogger implements ILogger {
	private structuredLogger: StructuredLogger
	private config: Required<BaileysLoggerConfig>
	private metrics: BaileysLoggerMetrics
	private childContext: Record<string, unknown> = {}

	constructor(config: Partial<BaileysLoggerConfig> = {}) {
		this.config = {
			level: config.level || 'info',
			ignoredCategories: config.ignoredCategories || [],
			verboseCategories: config.verboseCategories || [],
			logMessagePayloads: config.logMessagePayloads ?? false,
			logBinaryData: config.logBinaryData ?? false,
			instanceId: config.instanceId || this.generateInstanceId(),
			eventHandler: config.eventHandler || (() => {}),
			maxPayloadSize: config.maxPayloadSize || 1024,
		}

		this.structuredLogger = createStructuredLogger({
			level: this.config.level,
			name: `baileys:${this.config.instanceId}`,
			jsonFormat: process.env.NODE_ENV === 'production',
			redactFields: ['password', 'token', 'secret', 'key', 'authKey', 'macKey'],
		})

		this.metrics = this.createInitialMetrics()
	}

	private generateInstanceId(): string {
		return Math.random().toString(36).substring(2, 8)
	}

	private createInitialMetrics(): BaileysLoggerMetrics {
		return {
			connectionAttempts: 0,
			connectionSuccesses: 0,
			connectionFailures: 0,
			messagesSent: 0,
			messagesReceived: 0,
			mediaUploads: 0,
			mediaDownloads: 0,
			retryAttempts: 0,
			encryptionOperations: 0,
			errorsByCategory: {
				connection: 0,
				auth: 0,
				message: 0,
				media: 0,
				group: 0,
				presence: 0,
				call: 0,
				sync: 0,
				encryption: 0,
				retry: 0,
				socket: 0,
				binary: 0,
				unknown: 0,
			},
		}
	}

	get level(): string {
		return this.config.level
	}

	set level(newLevel: string) {
		this.config.level = newLevel as LogLevel
		this.structuredLogger.level = newLevel
	}

	/**
	 * Cria logger filho com contexto adicional
	 */
	child(obj: Record<string, unknown>): BaileysLogger {
		const childLogger = new BaileysLogger(this.config)
		childLogger.childContext = { ...this.childContext, ...obj }
		return childLogger
	}

	/**
	 * Detecta categoria do log baseado no conteúdo
	 */
	private detectCategory(obj: unknown, msg?: string): BaileysLogCategory {
		const searchText = [
			msg || '',
			typeof obj === 'string' ? obj : '',
			typeof obj === 'object' && obj !== null ? JSON.stringify(obj) : '',
		].join(' ')

		for (const { pattern, category } of CATEGORY_PATTERNS) {
			if (pattern.test(searchText)) {
				return category
			}
		}

		return 'unknown'
	}

	/**
	 * Verifica se categoria deve ser logada
	 */
	private shouldLogCategory(category: BaileysLogCategory, level: LogLevel): boolean {
		if (this.config.ignoredCategories.includes(category)) {
			return false
		}

		// Categorias verbose sempre logam em debug ou superior
		if (this.config.verboseCategories.includes(category)) {
			return true
		}

		return true
	}

	/**
	 * Sanitiza payload de mensagem
	 */
	private sanitizePayload(obj: unknown): unknown {
		if (!this.config.logMessagePayloads) {
			if (typeof obj === 'object' && obj !== null) {
				const sanitized = { ...(obj as Record<string, unknown>) }

				// Remover campos sensíveis de mensagem
				const sensitiveFields = ['body', 'text', 'content', 'caption', 'payload', 'data']
				for (const field of sensitiveFields) {
					if (field in sanitized) {
						const value = sanitized[field]
						if (typeof value === 'string' && value.length > 0) {
							sanitized[field] = `[${value.length} chars]`
						} else if (Buffer.isBuffer(value)) {
							sanitized[field] = `[Buffer: ${value.length} bytes]`
						}
					}
				}

				return sanitized
			}
		}

		// Limitar tamanho do payload
		if (typeof obj === 'object' && obj !== null) {
			const str = JSON.stringify(obj)
			if (str.length > this.config.maxPayloadSize) {
				return {
					_truncated: true,
					_originalSize: str.length,
					_preview: str.substring(0, 200) + '...',
				}
			}
		}

		return obj
	}

	/**
	 * Atualiza métricas baseado no log
	 */
	private updateMetrics(category: BaileysLogCategory, level: LogLevel, obj: unknown): void {
		const objStr = typeof obj === 'object' ? JSON.stringify(obj) : String(obj)

		switch (category) {
			case 'connection':
				if (/attempt|trying|connecting/i.test(objStr)) {
					this.metrics.connectionAttempts++
				} else if (/success|connected|open/i.test(objStr)) {
					this.metrics.connectionSuccesses++
					this.metrics.lastConnectionTime = new Date().toISOString()
				} else if (/fail|error|close/i.test(objStr)) {
					this.metrics.connectionFailures++
				}
				break

			case 'message':
				if (/send|sent|outgoing/i.test(objStr)) {
					this.metrics.messagesSent++
					this.metrics.lastMessageTime = new Date().toISOString()
				} else if (/recv|received|incoming/i.test(objStr)) {
					this.metrics.messagesReceived++
					this.metrics.lastMessageTime = new Date().toISOString()
				}
				break

			case 'media':
				if (/upload/i.test(objStr)) {
					this.metrics.mediaUploads++
				} else if (/download/i.test(objStr)) {
					this.metrics.mediaDownloads++
				}
				break

			case 'retry':
				this.metrics.retryAttempts++
				break

			case 'encryption':
				this.metrics.encryptionOperations++
				break
		}

		if (level === 'error' || level === 'fatal') {
			this.metrics.errorsByCategory[category]++
		}
	}

	/**
	 * Método principal de log
	 */
	private log(level: LogLevel, obj: unknown, msg?: string): void {
		const category = this.detectCategory(obj, msg)

		if (!this.shouldLogCategory(category, level)) {
			return
		}

		// Atualizar métricas
		this.updateMetrics(category, level, obj)

		// Sanitizar payload
		const sanitizedObj = this.sanitizePayload(obj)

		// Adicionar contexto do Baileys
		const enrichedObj = {
			category,
			instanceId: this.config.instanceId,
			...this.childContext,
			...(typeof sanitizedObj === 'object' && sanitizedObj !== null ? sanitizedObj : { value: sanitizedObj }),
		}

		// Log estruturado
		this.structuredLogger[level](enrichedObj, msg)

		// Handler de evento
		if (this.config.eventHandler) {
			const entry: LogEntry = {
				timestamp: new Date().toISOString(),
				level,
				levelValue: 0,
				message: msg || '',
				name: `baileys:${this.config.instanceId}`,
				data: enrichedObj,
			}
			this.config.eventHandler(category, entry)
		}
	}

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

	/**
	 * Log de conexão específico
	 */
	logConnection(event: 'connecting' | 'connected' | 'disconnected' | 'error', details?: Record<string, unknown>): void {
		const level: LogLevel = event === 'error' ? 'error' : event === 'disconnected' ? 'warn' : 'info'
		this.log(level, { event, ...details, category: 'connection' }, `Connection ${event}`)
	}

	/**
	 * Log de mensagem específico
	 */
	logMessage(
		direction: 'send' | 'receive',
		messageType: string,
		jid: string,
		details?: Record<string, unknown>
	): void {
		const sanitizedJid = this.sanitizeJid(jid)
		this.log(
			'info',
			{
				direction,
				messageType,
				jid: sanitizedJid,
				...details,
				category: 'message',
			},
			`Message ${direction}: ${messageType}`
		)
	}

	/**
	 * Log de mídia específico
	 */
	logMedia(
		operation: 'upload' | 'download',
		mediaType: string,
		size: number,
		details?: Record<string, unknown>
	): void {
		this.log(
			'info',
			{
				operation,
				mediaType,
				sizeBytes: size,
				sizeFormatted: this.formatBytes(size),
				...details,
				category: 'media',
			},
			`Media ${operation}: ${mediaType}`
		)
	}

	/**
	 * Sanitiza JID para log (remove parte do número)
	 */
	private sanitizeJid(jid: string): string {
		if (process.env.NODE_ENV === 'production') {
			// Em produção, mascara parte do número
			const parts = jid.split('@')
			if (parts.length === 2 && parts[0].length > 4) {
				return `${parts[0].substring(0, 4)}****@${parts[1]}`
			}
		}
		return jid
	}

	/**
	 * Formata bytes para leitura humana
	 */
	private formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B'
		const k = 1024
		const sizes = ['B', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
	}

	/**
	 * Retorna métricas do logger
	 */
	getMetrics(): BaileysLoggerMetrics {
		return { ...this.metrics }
	}

	/**
	 * Retorna métricas do structured logger interno
	 */
	getStructuredMetrics() {
		return this.structuredLogger.getMetrics()
	}

	/**
	 * Reseta métricas
	 */
	resetMetrics(): void {
		this.metrics = this.createInitialMetrics()
		this.structuredLogger.resetMetrics()
	}

	/**
	 * Retorna instance ID
	 */
	getInstanceId(): string {
		return this.config.instanceId
	}
}

/**
 * Factory para criar Baileys Logger
 */
export function createBaileysLogger(config?: Partial<BaileysLoggerConfig>): BaileysLogger {
	return new BaileysLogger(config)
}

/**
 * Singleton para logger padrão do Baileys
 */
let defaultBaileysLogger: BaileysLogger | null = null

export function getDefaultBaileysLogger(): BaileysLogger {
	if (!defaultBaileysLogger) {
		defaultBaileysLogger = createBaileysLogger({
			level: 'info',
		})
	}
	return defaultBaileysLogger
}

export function setDefaultBaileysLogger(logger: BaileysLogger): void {
	defaultBaileysLogger = logger
}

export default BaileysLogger
