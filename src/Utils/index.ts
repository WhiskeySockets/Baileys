export * from './generics'
export * from './decode-wa-message'
export * from './messages'
export * from './messages-media'
export * from './validate-connection'
export * from './crypto'
export * from './signal'
export * from './noise-handler'
export * from './history'
export * from './chat-utils'
export * from './lt-hash'
export * from './auth-utils'
export * from './use-multi-file-auth-state'
export * from './link-preview'
export * from './event-buffer'
export * from './process-message'
export * from './message-retry-manager'
export * from './browser-utils'

// === Novos Utilitários de Observabilidade e Resiliência ===

// Logging estruturado
export * from './structured-logger'
export * from './logger-adapter'
export * from './baileys-logger'

// Observabilidade e rastreamento
export * from './trace-context'
export * from './prometheus-metrics'

// Resiliência e performance
export * from './cache-utils'
export * from './circuit-breaker'
export * from './retry-utils'

// Event streaming
export * from './baileys-event-stream'
