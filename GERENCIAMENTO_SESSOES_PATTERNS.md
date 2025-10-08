# Padrões de Gerenciamento de Sessões Multi-Clínica

## Índice

1. [Visão Geral dos Padrões](#visão-geral-dos-padrões)
2. [Session Manager Pattern](#session-manager-pattern)
3. [Factory Pattern para Sessões](#factory-pattern-para-sessões)
4. [Observer Pattern para Eventos](#observer-pattern-para-eventos)
5. [State Machine Pattern](#state-machine-pattern)
6. [Circuit Breaker Pattern](#circuit-breaker-pattern)
7. [Pool Pattern](#pool-pattern)
8. [Registry Pattern](#registry-pattern)
9. [Strategy Pattern](#strategy-pattern)
10. [Decorator Pattern](#decorator-pattern)
11. [Implementação Prática](#implementação-prática)

---

## Visão Geral dos Padrões

### Por que Padrões de Design?

Em um sistema multi-clínica com centenas ou milhares de sessões WhatsApp simultâneas, os padrões de design são essenciais para:

- **Organização**: Estruturar código complexo de forma compreensível
- **Manutenibilidade**: Facilitar mudanças e evoluções
- **Escalabilidade**: Permitir crescimento sem refatoração completa
- **Testabilidade**: Facilitar testes unitários e de integração
- **Reutilização**: Reaproveitar soluções para problemas similares

### Padrões Fundamentais para Multi-Tenant

1. **Criacionais**: Como criar e configurar sessões
2. **Estruturais**: Como organizar e compor componentes
3. **Comportamentais**: Como gerenciar interações e estados
4. **Arquiteturais**: Como estruturar o sistema como um todo

---

## Session Manager Pattern

### Conceito

O Session Manager é o padrão central que coordena todas as sessões WhatsApp. Ele atua como um registry e controlador centralizado.

### Responsabilidades

```
┌─────────────────────────────────────────────────────────────┐
│                    Session Manager                          │
├─────────────────────────────────────────────────────────────┤
│ • Criar e destruir sessões                                  │
│ • Manter registry de sessões ativas                        │
│ • Monitorar saúde das sessões                              │
│ • Implementar políticas de lifecycle                       │
│ • Coordenar recursos compartilhados                        │
│ • Implementar isolamento entre clínicas                    │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura Conceitual

```typescript
interface SessionManager {
  // Lifecycle Management
  createSession(config: SessionConfig): Promise<Session>
  destroySession(sessionId: string): Promise<void>
  
  // Registry Operations
  getSession(sessionId: string): Session | null
  getAllSessions(): Session[]
  getSessionsByClinic(clinicId: string): Session[]
  
  // Health Management
  checkHealth(sessionId: string): HealthStatus
  restartSession(sessionId: string): Promise<void>
  
  // Resource Management
  getResourceUsage(): ResourceMetrics
  enforceResourceLimits(): void
}
```

### Implementação de Registry

#### 1. **Hierarchical Registry**
```
sessions/
├── clinic_001/
│   ├── channel_001 -> Session Instance
│   ├── channel_002 -> Session Instance
│   └── channel_003 -> Session Instance
├── clinic_002/
│   ├── channel_001 -> Session Instance
│   └── channel_002 -> Session Instance
└── clinic_003/
    └── channel_001 -> Session Instance
```

#### 2. **Flat Registry with Composite Keys**
```
sessions: Map<string, Session>
├── "clinic_001:channel_001" -> Session
├── "clinic_001:channel_002" -> Session
├── "clinic_002:channel_001" -> Session
└── "clinic_003:channel_001" -> Session
```

### Políticas de Lifecycle

#### 1. **Lazy Creation**
- Sessões são criadas apenas quando necessárias
- Reduz uso de recursos para clínicas inativas
- Melhora tempo de inicialização do sistema

#### 2. **Eager Cleanup**
- Sessões inativas são removidas proativamente
- Libera recursos rapidamente
- Previne vazamentos de memória

#### 3. **Graceful Shutdown**
- Finalização ordenada de todas as sessões
- Salvamento de estado antes do shutdown
- Notificação de clientes sobre indisponibilidade

### Monitoramento e Saúde

#### Health Check Strategy
```typescript
interface HealthStatus {
  isHealthy: boolean
  lastSeen: Date
  connectionState: ConnectionState
  messageCount: number
  errorCount: number
  memoryUsage: number
}

class HealthMonitor {
  async checkSession(session: Session): Promise<HealthStatus> {
    return {
      isHealthy: session.isConnected && session.errorCount < 5,
      lastSeen: session.lastActivity,
      connectionState: session.connectionState,
      messageCount: session.messageCount,
      errorCount: session.errorCount,
      memoryUsage: process.memoryUsage().heapUsed
    }
  }
}
```

---

## Factory Pattern para Sessões

### Conceito

O Factory Pattern encapsula a lógica complexa de criação de sessões, permitindo diferentes tipos de configuração baseados no contexto da clínica.

### Tipos de Factories

#### 1. **Simple Factory**
```typescript
class SessionFactory {
  static create(config: SessionConfig): WhatsAppSession {
    const session = new WhatsAppSession(config)
    session.setupEventHandlers()
    session.configureRetryPolicy()
    return session
  }
}
```

#### 2. **Abstract Factory**
```typescript
abstract class SessionFactory {
  abstract createSession(config: SessionConfig): WhatsAppSession
  abstract createAuthManager(config: AuthConfig): AuthManager
  abstract createEventRouter(config: EventConfig): EventRouter
}

class BasicClinicFactory extends SessionFactory {
  createSession(config: SessionConfig): WhatsAppSession {
    return new BasicWhatsAppSession(config)
  }
}

class PremiumClinicFactory extends SessionFactory {
  createSession(config: SessionConfig): WhatsAppSession {
    return new PremiumWhatsAppSession(config)
  }
}
```

#### 3. **Builder Pattern Integration**
```typescript
class SessionBuilder {
  private config: Partial<SessionConfig> = {}
  
  withClinic(clinicId: string): SessionBuilder {
    this.config.clinicId = clinicId
    return this
  }
  
  withChannel(channelId: string): SessionBuilder {
    this.config.channelId = channelId
    return this
  }
  
  withRetryPolicy(policy: RetryPolicy): SessionBuilder {
    this.config.retryPolicy = policy
    return this
  }
  
  build(): WhatsAppSession {
    if (!this.config.clinicId || !this.config.channelId) {
      throw new Error('Missing required configuration')
    }
    return SessionFactory.create(this.config as SessionConfig)
  }
}
```

### Configuration Strategies

#### 1. **Environment-Based Configuration**
```typescript
class ConfigurationManager {
  getSessionConfig(clinicId: string, channelId: string): SessionConfig {
    const baseConfig = this.getBaseConfig()
    const clinicConfig = this.getClinicConfig(clinicId)
    const channelConfig = this.getChannelConfig(channelId)
    
    return {
      ...baseConfig,
      ...clinicConfig,
      ...channelConfig,
      sessionId: `${clinicId}:${channelId}`
    }
  }
}
```

#### 2. **Template-Based Configuration**
```typescript
interface SessionTemplate {
  name: string
  retryPolicy: RetryPolicy
  timeouts: TimeoutConfig
  features: FeatureFlags
}

const templates: Record<string, SessionTemplate> = {
  'basic': {
    name: 'Basic Clinic',
    retryPolicy: { maxRetries: 3, backoffMs: 1000 },
    timeouts: { connection: 30000, message: 10000 },
    features: { autoReply: false, analytics: false }
  },
  'premium': {
    name: 'Premium Clinic',
    retryPolicy: { maxRetries: 10, backoffMs: 500 },
    timeouts: { connection: 10000, message: 5000 },
    features: { autoReply: true, analytics: true }
  }
}
```

---

## Observer Pattern para Eventos

### Conceito

O Observer Pattern permite que múltiplos componentes sejam notificados sobre mudanças de estado das sessões sem acoplamento direto.

### Arquitetura de Eventos

```
┌─────────────────┐    events    ┌─────────────────┐
│  WhatsApp       │─────────────→│  Event Router   │
│  Session        │              │                 │
└─────────────────┘              └─────────┬───────┘
                                           │
                        ┌──────────────────┼──────────────────┐
                        │                  │                  │
                        ▼                  ▼                  ▼
              ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
              │   Message       │ │   Connection    │ │   Analytics     │
              │   Handler       │ │   Monitor       │ │   Collector     │
              └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Event Types

#### 1. **Session Events**
```typescript
interface SessionEvents {
  'session.created': { sessionId: string, clinicId: string }
  'session.destroyed': { sessionId: string, reason: string }
  'session.connected': { sessionId: string, timestamp: Date }
  'session.disconnected': { sessionId: string, reason: string }
  'session.error': { sessionId: string, error: Error }
}
```

#### 2. **Message Events**
```typescript
interface MessageEvents {
  'message.received': { sessionId: string, message: WAMessage }
  'message.sent': { sessionId: string, messageId: string }
  'message.failed': { sessionId: string, error: Error }
  'message.delivered': { sessionId: string, messageId: string }
  'message.read': { sessionId: string, messageId: string }
}
```

#### 3. **Connection Events**
```typescript
interface ConnectionEvents {
  'connection.qr': { sessionId: string, qrCode: string }
  'connection.pairing': { sessionId: string, phoneNumber: string }
  'connection.authenticated': { sessionId: string, user: WAUser }
  'connection.lost': { sessionId: string, lastSeen: Date }
  'connection.restored': { sessionId: string, downtime: number }
}
```

### Event Router Implementation

#### 1. **Centralized Router**
```typescript
class EventRouter extends EventEmitter {
  private handlers = new Map<string, EventHandler[]>()
  
  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }
    this.handlers.get(eventType)!.push(handler)
  }
  
  publish(eventType: string, data: any): void {
    const handlers = this.handlers.get(eventType) || []
    handlers.forEach(handler => {
      try {
        handler.handle(eventType, data)
      } catch (error) {
        console.error(`Error in event handler: ${error.message}`)
      }
    })
  }
}
```

#### 2. **Filtered Subscriptions**
```typescript
interface EventFilter {
  clinicId?: string
  channelId?: string
  eventType?: string
  predicate?: (event: any) => boolean
}

class FilteredEventRouter extends EventRouter {
  subscribeWithFilter(filter: EventFilter, handler: EventHandler): void {
    const wrappedHandler = {
      handle: (eventType: string, data: any) => {
        if (this.matchesFilter(filter, eventType, data)) {
          handler.handle(eventType, data)
        }
      }
    }
    this.subscribe(filter.eventType || '*', wrappedHandler)
  }
}
```

### Event Persistence

#### 1. **Event Sourcing**
```typescript
interface EventStore {
  append(event: DomainEvent): Promise<void>
  getEvents(aggregateId: string): Promise<DomainEvent[]>
  getEventsSince(timestamp: Date): Promise<DomainEvent[]>
}

class SessionEventStore implements EventStore {
  async append(event: DomainEvent): Promise<void> {
    // Persist event to database
    await this.database.events.insert({
      id: event.id,
      aggregateId: event.aggregateId,
      type: event.type,
      data: event.data,
      timestamp: event.timestamp
    })
  }
}
```

---

## State Machine Pattern

### Conceito

O State Machine Pattern modela explicitamente os estados possíveis de uma sessão e as transições válidas entre eles.

### Estados da Sessão

```
                    ┌─────────────┐
                    │ INITIALIZING│
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
              ┌────→│ DISCONNECTED│◄────┐
              │     └──────┬──────┘     │
              │            │            │
              │            ▼            │
              │     ┌─────────────┐     │
              │     │ CONNECTING  │     │
              │     └──────┬──────┘     │
              │            │            │
              │            ▼            │
              │     ┌─────────────┐     │
              │  ┌─→│ QR_REQUIRED │     │
              │  │  └──────┬──────┘     │
              │  │         │            │
              │  │         ▼            │
              │  │  ┌─────────────┐     │
              │  │  │   PAIRING   │     │
              │  │  └──────┬──────┘     │
              │  │         │            │
              │  │         ▼            │
              │  │  ┌─────────────┐     │
              │  └──┤  CONNECTED  │     │
              │     └──────┬──────┘     │
              │            │            │
              │            ▼            │
              │     ┌─────────────┐     │
              └─────┤    ERROR    │─────┘
                    └─────────────┘
```

### State Machine Implementation

#### 1. **State Interface**
```typescript
interface SessionState {
  name: string
  canTransitionTo(newState: string): boolean
  onEnter(context: SessionContext): Promise<void>
  onExit(context: SessionContext): Promise<void>
  handle(event: SessionEvent, context: SessionContext): Promise<void>
}
```

#### 2. **Concrete States**
```typescript
class DisconnectedState implements SessionState {
  name = 'DISCONNECTED'
  
  canTransitionTo(newState: string): boolean {
    return ['CONNECTING', 'ERROR'].includes(newState)
  }
  
  async onEnter(context: SessionContext): Promise<void> {
    context.logger.info('Session disconnected')
    context.metrics.increment('session.disconnected')
  }
  
  async handle(event: SessionEvent, context: SessionContext): Promise<void> {
    if (event.type === 'CONNECT_REQUESTED') {
      await context.transitionTo('CONNECTING')
    }
  }
}

class ConnectingState implements SessionState {
  name = 'CONNECTING'
  
  canTransitionTo(newState: string): boolean {
    return ['CONNECTED', 'QR_REQUIRED', 'ERROR', 'DISCONNECTED'].includes(newState)
  }
  
  async onEnter(context: SessionContext): Promise<void> {
    context.logger.info('Attempting to connect...')
    // Start connection process
    await context.session.connect()
  }
}
```

#### 3. **State Machine Context**
```typescript
class SessionStateMachine {
  private currentState: SessionState
  private states = new Map<string, SessionState>()
  
  constructor(private context: SessionContext) {
    this.setupStates()
    this.currentState = this.states.get('DISCONNECTED')!
  }
  
  async transitionTo(stateName: string): Promise<void> {
    const newState = this.states.get(stateName)
    if (!newState) {
      throw new Error(`Unknown state: ${stateName}`)
    }
    
    if (!this.currentState.canTransitionTo(stateName)) {
      throw new Error(`Invalid transition from ${this.currentState.name} to ${stateName}`)
    }
    
    await this.currentState.onExit(this.context)
    const previousState = this.currentState
    this.currentState = newState
    await this.currentState.onEnter(this.context)
    
    this.context.emit('state.changed', {
      from: previousState.name,
      to: newState.name,
      timestamp: new Date()
    })
  }
}
```

### State Persistence

#### 1. **State Snapshots**
```typescript
interface StateSnapshot {
  sessionId: string
  stateName: string
  timestamp: Date
  context: any
}

class StateStore {
  async saveSnapshot(sessionId: string, state: SessionState): Promise<void> {
    const snapshot: StateSnapshot = {
      sessionId,
      stateName: state.name,
      timestamp: new Date(),
      context: state.getSerializableContext()
    }
    await this.database.snapshots.upsert(snapshot)
  }
  
  async loadSnapshot(sessionId: string): Promise<StateSnapshot | null> {
    return this.database.snapshots.findBySessionId(sessionId)
  }
}
```

---

## Circuit Breaker Pattern

### Conceito

O Circuit Breaker protege o sistema contra falhas em cascata, interrompendo tentativas de conexão quando muitas falhas consecutivas ocorrem.

### Estados do Circuit Breaker

```
                    ┌─────────────┐
                    │   CLOSED    │ (Normal operation)
                    │ (Requests   │
                    │  allowed)   │
                    └──────┬──────┘
                           │ Failure threshold reached
                           ▼
                    ┌─────────────┐
                    │    OPEN     │ (Failing fast)
                    │ (Requests   │
                    │  rejected)  │
                    └──────┬──────┘
                           │ Timeout elapsed
                           ▼
                    ┌─────────────┐
                    │ HALF_OPEN   │ (Testing)
                    │ (Limited    │
                    │  requests)  │
                    └─────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
              Success │           │ Failure
                    ▼             ▼
             ┌─────────────┐ ┌─────────────┐
             │   CLOSED    │ │    OPEN     │
             └─────────────┘ └─────────────┘
```

### Implementation

#### 1. **Circuit Breaker Core**
```typescript
enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

class CircuitBreaker {
  private state = CircuitState.CLOSED
  private failureCount = 0
  private lastFailureTime?: Date
  private nextAttemptTime?: Date
  
  constructor(
    private failureThreshold: number = 5,
    private recoveryTimeoutMs: number = 60000,
    private successThreshold: number = 2
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }
    
    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }
  
  private onSuccess(): void {
    this.failureCount = 0
    this.state = CircuitState.CLOSED
  }
  
  private onFailure(): void {
    this.failureCount++
    this.lastFailureTime = new Date()
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN
      this.nextAttemptTime = new Date(Date.now() + this.recoveryTimeoutMs)
    }
  }
}
```

#### 2. **Session-Specific Circuit Breaker**
```typescript
class SessionCircuitBreaker extends CircuitBreaker {
  constructor(
    private sessionId: string,
    private logger: Logger,
    failureThreshold = 3,
    recoveryTimeoutMs = 30000
  ) {
    super(failureThreshold, recoveryTimeoutMs)
  }
  
  async executeConnection(): Promise<void> {
    return this.execute(async () => {
      this.logger.info(`Attempting connection for session ${this.sessionId}`)
      // Connection logic here
      await this.connectToWhatsApp()
    })
  }
  
  private async connectToWhatsApp(): Promise<void> {
    // Actual connection implementation
  }
}
```

### Integration with Session Manager

#### 1. **Circuit Breaker Registry**
```typescript
class CircuitBreakerManager {
  private breakers = new Map<string, SessionCircuitBreaker>()
  
  getBreaker(sessionId: string): SessionCircuitBreaker {
    if (!this.breakers.has(sessionId)) {
      this.breakers.set(sessionId, new SessionCircuitBreaker(sessionId, logger))
    }
    return this.breakers.get(sessionId)!
  }
  
  async executeWithBreaker<T>(
    sessionId: string, 
    operation: () => Promise<T>
  ): Promise<T> {
    const breaker = this.getBreaker(sessionId)
    return breaker.execute(operation)
  }
}
```

---

## Pool Pattern

### Conceito

O Pool Pattern gerencia um conjunto de recursos reutilizáveis (sessões, conexões, objetos) para otimizar performance e uso de memória.

### Types of Pools

#### 1. **Session Pool**
```typescript
class SessionPool {
  private available: WhatsAppSession[] = []
  private inUse = new Set<WhatsAppSession>()
  private maxSize: number
  private minSize: number
  
  constructor(maxSize = 100, minSize = 10) {
    this.maxSize = maxSize
    this.minSize = minSize
    this.initializePool()
  }
  
  async acquire(config: SessionConfig): Promise<WhatsAppSession> {
    let session = this.available.pop()
    
    if (!session) {
      if (this.inUse.size >= this.maxSize) {
        throw new Error('Pool exhausted')
      }
      session = await this.createSession(config)
    }
    
    await session.reconfigure(config)
    this.inUse.add(session)
    return session
  }
  
  release(session: WhatsAppSession): void {
    if (this.inUse.has(session)) {
      this.inUse.delete(session)
      session.reset()
      this.available.push(session)
    }
  }
}
```

#### 2. **Connection Pool**
```typescript
class ConnectionPool {
  private connections: Map<string, WebSocket[]> = new Map()
  private maxConnectionsPerHost = 10
  
  async getConnection(host: string): Promise<WebSocket> {
    const hostConnections = this.connections.get(host) || []
    
    // Reuse existing connection if available
    const availableConnection = hostConnections.find(conn => 
      conn.readyState === WebSocket.OPEN
    )
    
    if (availableConnection) {
      return availableConnection
    }
    
    // Create new connection if under limit
    if (hostConnections.length < this.maxConnectionsPerHost) {
      const newConnection = new WebSocket(host)
      hostConnections.push(newConnection)
      this.connections.set(host, hostConnections)
      return newConnection
    }
    
    throw new Error(`Connection pool exhausted for host: ${host}`)
  }
}
```

### Resource Management

#### 1. **Lifecycle Management**
```typescript
interface PooledResource {
  id: string
  isAvailable(): boolean
  reset(): Promise<void>
  destroy(): Promise<void>
  getMetrics(): ResourceMetrics
}

class ResourcePool<T extends PooledResource> {
  private resources = new Map<string, T>()
  private available: string[] = []
  private inUse = new Set<string>()
  
  async acquire(): Promise<T> {
    const resourceId = this.available.pop()
    if (resourceId) {
      const resource = this.resources.get(resourceId)!
      this.inUse.add(resourceId)
      return resource
    }
    
    // Create new resource if pool not at capacity
    if (this.resources.size < this.maxSize) {
      const resource = await this.createResource()
      this.resources.set(resource.id, resource)
      this.inUse.add(resource.id)
      return resource
    }
    
    throw new Error('Pool exhausted')
  }
  
  release(resource: T): void {
    if (this.inUse.has(resource.id)) {
      this.inUse.delete(resource.id)
      resource.reset()
      this.available.push(resource.id)
    }
  }
}
```

---

## Registry Pattern

### Conceito

O Registry Pattern fornece um ponto central para localizar e gerenciar instâncias de sessões, permitindo acesso global organizado.

### Implementation Strategies

#### 1. **Hierarchical Registry**
```typescript
class SessionRegistry {
  private clinics = new Map<string, Map<string, WhatsAppSession>>()
  
  register(clinicId: string, channelId: string, session: WhatsAppSession): void {
    if (!this.clinics.has(clinicId)) {
      this.clinics.set(clinicId, new Map())
    }
    this.clinics.get(clinicId)!.set(channelId, session)
  }
  
  get(clinicId: string, channelId: string): WhatsAppSession | null {
    return this.clinics.get(clinicId)?.get(channelId) || null
  }
  
  getByClinic(clinicId: string): WhatsAppSession[] {
    const clinicSessions = this.clinics.get(clinicId)
    return clinicSessions ? Array.from(clinicSessions.values()) : []
  }
  
  getAllSessions(): WhatsAppSession[] {
    const allSessions: WhatsAppSession[] = []
    for (const clinicSessions of this.clinics.values()) {
      allSessions.push(...clinicSessions.values())
    }
    return allSessions
  }
}
```

#### 2. **Tagged Registry**
```typescript
interface SessionTags {
  clinicId: string
  channelId: string
  tier: 'basic' | 'premium'
  region: string
  status: 'active' | 'inactive' | 'suspended'
}

class TaggedSessionRegistry {
  private sessions = new Map<string, WhatsAppSession>()
  private tags = new Map<string, SessionTags>()
  private indexes = new Map<string, Set<string>>()
  
  register(sessionId: string, session: WhatsAppSession, tags: SessionTags): void {
    this.sessions.set(sessionId, session)
    this.tags.set(sessionId, tags)
    this.updateIndexes(sessionId, tags)
  }
  
  findByTag(tagName: keyof SessionTags, value: any): WhatsAppSession[] {
    const sessionIds = this.indexes.get(`${tagName}:${value}`) || new Set()
    return Array.from(sessionIds).map(id => this.sessions.get(id)!).filter(Boolean)
  }
  
  findByQuery(query: Partial<SessionTags>): WhatsAppSession[] {
    let results = new Set<string>(this.sessions.keys())
    
    for (const [key, value] of Object.entries(query)) {
      const matchingIds = this.indexes.get(`${key}:${value}`) || new Set()
      results = new Set([...results].filter(id => matchingIds.has(id)))
    }
    
    return Array.from(results).map(id => this.sessions.get(id)!)
  }
}
```

### Service Locator Integration

#### 1. **Service Locator Pattern**
```typescript
class ServiceLocator {
  private static instance: ServiceLocator
  private services = new Map<string, any>()
  
  static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator()
    }
    return ServiceLocator.instance
  }
  
  register<T>(name: string, service: T): void {
    this.services.set(name, service)
  }
  
  get<T>(name: string): T {
    const service = this.services.get(name)
    if (!service) {
      throw new Error(`Service not found: ${name}`)
    }
    return service as T
  }
}

// Usage
const locator = ServiceLocator.getInstance()
locator.register('sessionRegistry', new SessionRegistry())
locator.register('sessionManager', new SessionManager())

const registry = locator.get<SessionRegistry>('sessionRegistry')
```

---

## Strategy Pattern

### Conceito

O Strategy Pattern permite alternar entre diferentes algoritmos de reconexão, autenticação, e outras operações baseadas no contexto da clínica.

### Reconnection Strategies

#### 1. **Strategy Interface**
```typescript
interface ReconnectionStrategy {
  name: string
  shouldReconnect(session: WhatsAppSession, error: Error): boolean
  getDelay(attemptNumber: number): number
  getMaxAttempts(): number
}
```

#### 2. **Concrete Strategies**
```typescript
class BasicReconnectionStrategy implements ReconnectionStrategy {
  name = 'basic'
  
  shouldReconnect(session: WhatsAppSession, error: Error): boolean {
    // Don't reconnect if logged out
    return error.message !== 'logged_out'
  }
  
  getDelay(attemptNumber: number): number {
    // Linear backoff: 1s, 2s, 3s, ...
    return attemptNumber * 1000
  }
  
  getMaxAttempts(): number {
    return 5
  }
}

class PremiumReconnectionStrategy implements ReconnectionStrategy {
  name = 'premium'
  
  shouldReconnect(session: WhatsAppSession, error: Error): boolean {
    return error.message !== 'logged_out'
  }
  
  getDelay(attemptNumber: number): number {
    // Exponential backoff with jitter
    const baseDelay = Math.pow(2, attemptNumber) * 1000
    const jitter = Math.random() * 0.1 * baseDelay
    return Math.min(baseDelay + jitter, 30000) // Max 30s
  }
  
  getMaxAttempts(): number {
    return 10
  }
}
```

#### 3. **Strategy Context**
```typescript
class ReconnectionManager {
  private strategy: ReconnectionStrategy
  
  constructor(strategy: ReconnectionStrategy) {
    this.strategy = strategy
  }
  
  setStrategy(strategy: ReconnectionStrategy): void {
    this.strategy = strategy
  }
  
  async handleDisconnection(session: WhatsAppSession, error: Error): Promise<void> {
    if (!this.strategy.shouldReconnect(session, error)) {
      return
    }
    
    let attempt = 1
    while (attempt <= this.strategy.getMaxAttempts()) {
      const delay = this.strategy.getDelay(attempt)
      await this.sleep(delay)
      
      try {
        await session.connect()
        return // Success
      } catch (reconnectError) {
        attempt++
      }
    }
    
    throw new Error('Max reconnection attempts exceeded')
  }
}
```

### Authentication Strategies

#### 1. **Authentication Strategy Interface**
```typescript
interface AuthenticationStrategy {
  authenticate(session: WhatsAppSession): Promise<AuthResult>
  requiresQR(): boolean
  supportsPairing(): boolean
}

interface AuthResult {
  success: boolean
  qrCode?: string
  pairingCode?: string
  error?: Error
}
```

#### 2. **QR Code Strategy**
```typescript
class QRCodeAuthStrategy implements AuthenticationStrategy {
  requiresQR(): boolean { return true }
  supportsPairing(): boolean { return false }
  
  async authenticate(session: WhatsAppSession): Promise<AuthResult> {
    return new Promise((resolve) => {
      session.on('qr', (qrCode) => {
        resolve({ success: true, qrCode })
      })
      
      session.on('connection.update', (update) => {
        if (update.connection === 'open') {
          resolve({ success: true })
        }
      })
      
      session.connect()
    })
  }
}
```

#### 3. **Pairing Code Strategy**
```typescript
class PairingCodeAuthStrategy implements AuthenticationStrategy {
  requiresQR(): boolean { return false }
  supportsPairing(): boolean { return true }
  
  async authenticate(session: WhatsAppSession): Promise<AuthResult> {
    const phoneNumber = await this.getPhoneNumber(session)
    const pairingCode = await session.requestPairingCode(phoneNumber)
    
    return { success: true, pairingCode }
  }
}
```

---

## Decorator Pattern

### Conceito

O Decorator Pattern adiciona funcionalidades a sessões existentes sem modificar sua estrutura base, permitindo composição flexível de recursos.

### Session Decorators

#### 1. **Base Decorator**
```typescript
abstract class SessionDecorator implements WhatsAppSession {
  constructor(protected session: WhatsAppSession) {}
  
  // Delegate all methods to wrapped session
  async connect(): Promise<void> {
    return this.session.connect()
  }
  
  async sendMessage(to: string, content: any): Promise<any> {
    return this.session.sendMessage(to, content)
  }
  
  // Abstract methods for specific decorators
  abstract getName(): string
}
```

#### 2. **Logging Decorator**
```typescript
class LoggingSessionDecorator extends SessionDecorator {
  constructor(session: WhatsAppSession, private logger: Logger) {
    super(session)
  }
  
  getName(): string {
    return `Logging(${this.session.getName()})`
  }
  
  async connect(): Promise<void> {
    this.logger.info('Attempting to connect...')
    try {
      await super.connect()
      this.logger.info('Connection successful')
    } catch (error) {
      this.logger.error('Connection failed', error)
      throw error
    }
  }
  
  async sendMessage(to: string, content: any): Promise<any> {
    this.logger.info(`Sending message to ${to}`)
    const result = await super.sendMessage(to, content)
    this.logger.info(`Message sent successfully: ${result.id}`)
    return result
  }
}
```

#### 3. **Rate Limiting Decorator**
```typescript
class RateLimitingSessionDecorator extends SessionDecorator {
  private messageQueue: Array<{ to: string, content: any, resolve: Function, reject: Function }> = []
  private isProcessing = false
  
  constructor(session: WhatsAppSession, private messagesPerMinute: number = 60) {
    super(session)
  }
  
  getName(): string {
    return `RateLimit(${this.session.getName()})`
  }
  
  async sendMessage(to: string, content: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.messageQueue.push({ to, content, resolve, reject })
      this.processQueue()
    })
  }
  
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.messageQueue.length === 0) {
      return
    }
    
    this.isProcessing = true
    const intervalMs = (60 * 1000) / this.messagesPerMinute
    
    while (this.messageQueue.length > 0) {
      const { to, content, resolve, reject } = this.messageQueue.shift()!
      
      try {
        const result = await super.sendMessage(to, content)
        resolve(result)
      } catch (error) {
        reject(error)
      }
      
      if (this.messageQueue.length > 0) {
        await this.sleep(intervalMs)
      }
    }
    
    this.isProcessing = false
  }
}
```

#### 4. **Analytics Decorator**
```typescript
class AnalyticsSessionDecorator extends SessionDecorator {
  constructor(session: WhatsAppSession, private analytics: AnalyticsService) {
    super(session)
  }
  
  getName(): string {
    return `Analytics(${this.session.getName()})`
  }
  
  async connect(): Promise<void> {
    const startTime = Date.now()
    try {
      await super.connect()
      this.analytics.track('session.connected', {
        sessionId: this.session.getId(),
        connectionTime: Date.now() - startTime
      })
    } catch (error) {
      this.analytics.track('session.connection_failed', {
        sessionId: this.session.getId(),
        error: error.message
      })
      throw error
    }
  }
  
  async sendMessage(to: string, content: any): Promise<any> {
    this.analytics.track('message.sent', {
      sessionId: this.session.getId(),
      to,
      contentType: typeof content
    })
    return super.sendMessage(to, content)
  }
}
```

### Decorator Composition

#### 1. **Decorator Builder**
```typescript
class SessionDecoratorBuilder {
  private session: WhatsAppSession
  
  constructor(baseSession: WhatsAppSession) {
    this.session = baseSession
  }
  
  withLogging(logger: Logger): SessionDecoratorBuilder {
    this.session = new LoggingSessionDecorator(this.session, logger)
    return this
  }
  
  withRateLimit(messagesPerMinute: number): SessionDecoratorBuilder {
    this.session = new RateLimitingSessionDecorator(this.session, messagesPerMinute)
    return this
  }
  
  withAnalytics(analytics: AnalyticsService): SessionDecoratorBuilder {
    this.session = new AnalyticsSessionDecorator(this.session, analytics)
    return this
  }
  
  build(): WhatsAppSession {
    return this.session
  }
}

// Usage
const decoratedSession = new SessionDecoratorBuilder(baseSession)
  .withLogging(logger)
  .withRateLimit(60)
  .withAnalytics(analyticsService)
  .build()
```

---

## Implementação Prática

### Integração dos Padrões

#### 1. **Sistema Completo**
```typescript
class MultiClinicWhatsAppPlatform {
  private sessionManager: SessionManager
  private sessionRegistry: SessionRegistry
  private eventRouter: EventRouter
  private circuitBreakerManager: CircuitBreakerManager
  
  constructor() {
    this.sessionRegistry = new SessionRegistry()
    this.eventRouter = new EventRouter()
    this.circuitBreakerManager = new CircuitBreakerManager()
    this.sessionManager = new SessionManager(
      this.sessionRegistry,
      this.eventRouter,
      this.circuitBreakerManager
    )
  }
  
  async createClinicChannel(
    clinicId: string, 
    channelId: string, 
    config: ChannelConfig
  ): Promise<void> {
    // Use Factory to create session
    const sessionConfig = SessionConfigFactory.create(clinicId, channelId, config)
    
    // Use Builder to add decorators based on clinic tier
    const baseSession = new WhatsAppSession(sessionConfig)
    const decoratedSession = new SessionDecoratorBuilder(baseSession)
      .withLogging(this.createLogger(clinicId, channelId))
      .withRateLimit(config.tier === 'premium' ? 120 : 60)
      .withAnalytics(this.analyticsService)
      .build()
    
    // Register session
    this.sessionRegistry.register(clinicId, channelId, decoratedSession)
    
    // Setup event handlers
    this.setupEventHandlers(decoratedSession)
    
    // Start connection with circuit breaker
    await this.circuitBreakerManager.executeWithBreaker(
      `${clinicId}:${channelId}`,
      () => decoratedSession.connect()
    )
  }
  
  private setupEventHandlers(session: WhatsAppSession): void {
    session.on('message', (message) => {
      this.eventRouter.publish('message.received', {
        sessionId: session.getId(),
        message
      })
    })
    
    session.on('connection.update', (update) => {
      this.eventRouter.publish('connection.update', {
        sessionId: session.getId(),
        update
      })
    })
  }
}
```

### Configuration Management

#### 1. **Hierarchical Configuration**
```typescript
interface PlatformConfig {
  database: DatabaseConfig
  redis: RedisConfig
  sessions: SessionsConfig
  clinics: Record<string, ClinicConfig>
}

interface ClinicConfig {
  tier: 'basic' | 'premium' | 'enterprise'
  limits: {
    maxChannels: number
    messagesPerMinute: number
    storageQuotaGB: number
  }
  features: {
    analytics: boolean
    autoReply: boolean
    webhooks: boolean
  }
  reconnection: ReconnectionConfig
}
```

#### 2. **Dynamic Configuration**
```typescript
class ConfigurationManager {
  private config: PlatformConfig
  private watchers = new Map<string, ConfigWatcher[]>()
  
  async getClinicConfig(clinicId: string): Promise<ClinicConfig> {
    // Load from database, cache, or file
    return this.config.clinics[clinicId] || this.getDefaultConfig()
  }
  
  async updateClinicConfig(clinicId: string, config: Partial<ClinicConfig>): Promise<void> {
    this.config.clinics[clinicId] = { ...this.config.clinics[clinicId], ...config }
    
    // Notify watchers
    const watchers = this.watchers.get(clinicId) || []
    watchers.forEach(watcher => watcher.onConfigChanged(config))
  }
  
  watchConfig(clinicId: string, watcher: ConfigWatcher): void {
    if (!this.watchers.has(clinicId)) {
      this.watchers.set(clinicId, [])
    }
    this.watchers.get(clinicId)!.push(watcher)
  }
}
```

### Monitoring Integration

#### 1. **Metrics Collection**
```typescript
class MetricsCollector {
  private metrics = new Map<string, number>()
  
  increment(metric: string, tags: Record<string, string> = {}): void {
    const key = this.buildMetricKey(metric, tags)
    this.metrics.set(key, (this.metrics.get(key) || 0) + 1)
  }
  
  gauge(metric: string, value: number, tags: Record<string, string> = {}): void {
    const key = this.buildMetricKey(metric, tags)
    this.metrics.set(key, value)
  }
  
  private buildMetricKey(metric: string, tags: Record<string, string>): string {
    const tagString = Object.entries(tags)
      .map(([k, v]) => `${k}=${v}`)
      .join(',')
    return `${metric}{${tagString}}`
  }
}
```

### Testing Strategies

#### 1. **Unit Testing with Mocks**
```typescript
describe('SessionManager', () => {
  let sessionManager: SessionManager
  let mockRegistry: jest.Mocked<SessionRegistry>
  let mockEventRouter: jest.Mocked<EventRouter>
  
  beforeEach(() => {
    mockRegistry = createMockRegistry()
    mockEventRouter = createMockEventRouter()
    sessionManager = new SessionManager(mockRegistry, mockEventRouter)
  })
  
  it('should create session with correct configuration', async () => {
    const config = { clinicId: 'clinic1', channelId: 'channel1' }
    
    await sessionManager.createSession(config)
    
    expect(mockRegistry.register).toHaveBeenCalledWith(
      'clinic1', 
      'channel1', 
      expect.any(WhatsAppSession)
    )
  })
})
```

#### 2. **Integration Testing**
```typescript
describe('Multi-Clinic Integration', () => {
  let platform: MultiClinicWhatsAppPlatform
  
  beforeEach(async () => {
    platform = new MultiClinicWhatsAppPlatform()
    await platform.initialize()
  })
  
  it('should isolate sessions between clinics', async () => {
    await platform.createClinicChannel('clinic1', 'channel1', basicConfig)
    await platform.createClinicChannel('clinic2', 'channel1', basicConfig)
    
    const clinic1Sessions = platform.getSessionsByClinic('clinic1')
    const clinic2Sessions = platform.getSessionsByClinic('clinic2')
    
    expect(clinic1Sessions).toHaveLength(1)
    expect(clinic2Sessions).toHaveLength(1)
    expect(clinic1Sessions[0]).not.toBe(clinic2Sessions[0])
  })
})
```

---

## Conclusão

Os padrões de design apresentados fornecem uma base sólida para implementar um sistema robusto de gerenciamento de sessões multi-clínica:

### Benefícios dos Padrões

1. **Modularidade**: Cada padrão resolve um problema específico
2. **Flexibilidade**: Permite customização por clínica
3. **Testabilidade**: Facilita testes unitários e de integração
4. **Manutenibilidade**: Código organizado e compreensível
5. **Escalabilidade**: Suporta crescimento do sistema

### Implementação Recomendada

1. **Comece Simples**: Implemente padrões básicos primeiro
2. **Evolua Gradualmente**: Adicione complexidade conforme necessário
3. **Teste Continuamente**: Mantenha cobertura de testes alta
4. **Monitore Ativamente**: Implemente observabilidade desde o início
5. **Documente Bem**: Mantenha documentação atualizada

Esta arquitetura baseada em padrões garante que o sistema seja robusto, escalável e manutenível, adequado para as demandas de uma plataforma multi-clínica de produção.