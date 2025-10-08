# Status e Controle de Entrega no Baileys - Implementação Detalhada

## Índice

1. [Visão Geral dos Status](#visão-geral-dos-status)
2. [Confirmação de Envio, Entrega e Leitura](#confirmação-de-envio-entrega-e-leitura)
3. [Notificação de Falha no Envio](#notificação-de-falha-no-envio)
4. [Status de Digitação e Gravação](#status-de-digitação-e-gravação)
5. [Sincronização Multi-Device](#sincronização-multi-device)
6. [Recuperação de Mensagens Pendentes](#recuperação-de-mensagens-pendentes)
7. [Implementação Prática Completa](#implementação-prática-completa)
8. [Monitoramento e Debug](#monitoramento-e-debug)
9. [Melhores Práticas](#melhores-práticas)

---

## Visão Geral dos Status

### Estados de Mensagem no WhatsApp

```
📤 SENDING (Enviando)
├── ✅ SUCCESS → ✓ (Enviado)
│   ├── 📨 DELIVERED → ✓✓ (Entregue)
│   │   └── 👁️ READ → ✓✓ (Lido - azul)
│   └── ❌ DELIVERY_FAILED
└── ❌ SEND_FAILED (Falha no envio)
```

### Como o Baileys Mapeia os Status

| Status WhatsApp | Baileys Event | Valor | Descrição |
|---|---|---|---|
| **Enviando** | - | `sending` | Estado local antes do envio |
| **Enviado ✓** | `messages.update` | `SERVER_ACK` | Servidor recebeu |
| **Entregue ✓✓** | `message-receipt.update` | `delivery` | Dispositivo do destinatário recebeu |
| **Lido ✓✓ (azul)** | `message-receipt.update` | `read` | Usuário visualizou |
| **Falha ❌** | `messages.update` | `ERROR` | Erro no envio |

---

## Confirmação de Envio, Entrega e Leitura

### 1. **Implementação dos Status de Mensagem**

```typescript
// Tipos de status de mensagem
enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',           // ✓ (checkmark simples)
  DELIVERED = 'delivered', // ✓✓ (checkmark duplo)
  READ = 'read',          // ✓✓ (checkmark duplo azul)
  FAILED = 'failed'       // ❌ (erro)
}

interface MessageWithStatus {
  id: string
  key: WAMessageKey
  content: any
  status: MessageStatus
  timestamp: Date
  sentAt?: Date
  deliveredAt?: Date
  readAt?: Date
  error?: string
}
```

### 2. **Event Handlers para Status**

```typescript
class MessageStatusTracker {
  private messages = new Map<string, MessageWithStatus>()
  
  constructor(private sock: WASocket) {
    this.setupEventHandlers()
  }
  
  private setupEventHandlers() {
    // 1. Confirmação de envio (✓)
    this.sock.ev.on('messages.update', this.handleMessageUpdates.bind(this))
    
    // 2. Confirmação de entrega e leitura (✓✓ e azul)
    this.sock.ev.on('message-receipt.update', this.handleReceiptUpdates.bind(this))
    
    // 3. Mensagens enviadas
    this.sock.ev.on('messages.upsert', this.handleMessageUpsert.bind(this))
  }
  
  // Handler para atualizações de status de envio
  private async handleMessageUpdates(updates: any[]) {
    for (const update of updates) {
      const { key, update: messageUpdate } = update
      const messageId = key.id
      
      if (messageUpdate.status) {
        await this.updateMessageStatus(messageId, messageUpdate.status, messageUpdate)
      }
    }
  }
  
  // Handler para confirmações de entrega e leitura
  private async handleReceiptUpdates(receipts: any[]) {
    for (const receipt of receipts) {
      const { key, receipt: receiptInfo } = receipt
      const messageId = key.id
      
      if (receiptInfo.receiptTimestamp) {
        const status = receiptInfo.type === 'read' ? MessageStatus.READ : MessageStatus.DELIVERED
        await this.updateMessageStatus(messageId, status, receiptInfo)
      }
    }
  }
  
  // Atualizar status da mensagem
  private async updateMessageStatus(messageId: string, status: string, metadata: any) {
    const message = this.messages.get(messageId)
    if (!message) return
    
    const now = new Date()
    
    switch (status) {
      case 'SERVER_ACK':
        message.status = MessageStatus.SENT
        message.sentAt = now
        break
        
      case 'delivery':
        message.status = MessageStatus.DELIVERED
        message.deliveredAt = now
        break
        
      case 'read':
        message.status = MessageStatus.READ
        message.readAt = now
        break
        
      case 'ERROR':
        message.status = MessageStatus.FAILED
        message.error = metadata.error?.message || 'Unknown error'
        break
    }
    
    // Salvar no banco de dados
    await this.saveMessageStatus(message)
    
    // Emitir evento para UI
    this.emit('message:status-changed', {
      messageId,
      status: message.status,
      timestamp: now,
      metadata
    })
  }
}
```

### 3. **Implementação Visual dos Status**

```typescript
// Componente React para mostrar status
const MessageStatusIndicator: React.FC<{ status: MessageStatus, timestamp?: Date }> = ({ 
  status, 
  timestamp 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case MessageStatus.SENDING:
        return <ClockIcon className="text-gray-400 animate-spin" />
        
      case MessageStatus.SENT:
        return <CheckIcon className="text-gray-400" /> // ✓ cinza
        
      case MessageStatus.DELIVERED:
        return <CheckDoubleIcon className="text-gray-400" /> // ✓✓ cinza
        
      case MessageStatus.READ:
        return <CheckDoubleIcon className="text-blue-500" /> // ✓✓ azul
        
      case MessageStatus.FAILED:
        return <ExclamationIcon className="text-red-500" /> // ❌ vermelho
        
      default:
        return null
    }
  }
  
  const getStatusText = () => {
    switch (status) {
      case MessageStatus.SENDING: return 'Sending...'
      case MessageStatus.SENT: return `Sent ${formatTime(timestamp)}`
      case MessageStatus.DELIVERED: return `Delivered ${formatTime(timestamp)}`
      case MessageStatus.READ: return `Read ${formatTime(timestamp)}`
      case MessageStatus.FAILED: return 'Failed to send'
      default: return ''
    }
  }
  
  return (
    <div className="flex items-center gap-1 text-xs">
      {getStatusIcon()}
      <span className="text-gray-500">{getStatusText()}</span>
    </div>
  )
}
```

### 4. **Rastreamento Detalhado de Status**

```typescript
class DetailedMessageTracker {
  async sendMessageWithTracking(jid: string, content: any): Promise<MessageWithStatus> {
    // 1. Criar mensagem local com status SENDING
    const message: MessageWithStatus = {
      id: generateId(),
      key: null as any,
      content,
      status: MessageStatus.SENDING,
      timestamp: new Date()
    }
    
    // 2. Salvar localmente
    await this.saveMessage(message)
    this.emit('message:created', message)
    
    try {
      // 3. Enviar mensagem
      const result = await this.sock.sendMessage(jid, content)
      
      // 4. Atualizar com chave real
      message.key = result.key
      message.status = MessageStatus.SENT
      message.sentAt = new Date()
      
      await this.updateMessage(message)
      this.emit('message:sent', message)
      
      return message
      
    } catch (error) {
      // 5. Marcar como falha
      message.status = MessageStatus.FAILED
      message.error = error.message
      
      await this.updateMessage(message)
      this.emit('message:failed', message)
      
      throw error
    }
  }
  
  // Verificar status de mensagens antigas
  async checkPendingMessages() {
    const pendingMessages = await this.getPendingMessages()
    
    for (const message of pendingMessages) {
      try {
        // Verificar status atual no WhatsApp
        const currentStatus = await this.getMessageStatus(message.key)
        
        if (currentStatus !== message.status) {
          await this.updateMessageStatus(message.id, currentStatus, {})
        }
      } catch (error) {
        console.warn(`Failed to check status for message ${message.id}:`, error)
      }
    }
  }
}
```

---

## Notificação de Falha no Envio

### 1. **Tipos de Falhas**

```typescript
enum MessageFailureReason {
  NETWORK_ERROR = 'network_error',
  RATE_LIMITED = 'rate_limited',
  BLOCKED_BY_USER = 'blocked_by_user',
  INVALID_JID = 'invalid_jid',
  MEDIA_UPLOAD_FAILED = 'media_upload_failed',
  ENCRYPTION_ERROR = 'encryption_error',
  SERVER_ERROR = 'server_error',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

interface MessageFailure {
  messageId: string
  reason: MessageFailureReason
  error: Error
  timestamp: Date
  retryable: boolean
  retryCount: number
}
```

### 2. **Detector de Falhas**

```typescript
class MessageFailureHandler {
  private retryQueue = new Map<string, MessageFailure>()
  private maxRetries = 3
  private retryDelays = [1000, 5000, 15000] // 1s, 5s, 15s
  
  async handleSendError(messageId: string, error: Error): Promise<void> {
    const failureReason = this.categorizeError(error)
    
    const failure: MessageFailure = {
      messageId,
      reason: failureReason,
      error,
      timestamp: new Date(),
      retryable: this.isRetryable(failureReason),
      retryCount: 0
    }
    
    // Salvar falha no banco
    await this.saveFailure(failure)
    
    // Emitir evento para UI
    this.emit('message:failed', {
      messageId,
      reason: failureReason,
      error: error.message,
      retryable: failure.retryable
    })
    
    // Tentar novamente se possível
    if (failure.retryable) {
      await this.scheduleRetry(failure)
    }
  }
  
  private categorizeError(error: Error): MessageFailureReason {
    const message = error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('connection')) {
      return MessageFailureReason.NETWORK_ERROR
    }
    
    if (message.includes('rate') || message.includes('limit')) {
      return MessageFailureReason.RATE_LIMITED
    }
    
    if (message.includes('blocked') || message.includes('forbidden')) {
      return MessageFailureReason.BLOCKED_BY_USER
    }
    
    if (message.includes('invalid') || message.includes('not found')) {
      return MessageFailureReason.INVALID_JID
    }
    
    if (message.includes('media') || message.includes('upload')) {
      return MessageFailureReason.MEDIA_UPLOAD_FAILED
    }
    
    if (message.includes('timeout')) {
      return MessageFailureReason.TIMEOUT
    }
    
    if (message.includes('encrypt') || message.includes('decrypt')) {
      return MessageFailureReason.ENCRYPTION_ERROR
    }
    
    if (message.includes('server') || message.includes('500')) {
      return MessageFailureReason.SERVER_ERROR
    }
    
    return MessageFailureReason.UNKNOWN
  }
  
  private isRetryable(reason: MessageFailureReason): boolean {
    const retryableReasons = [
      MessageFailureReason.NETWORK_ERROR,
      MessageFailureReason.TIMEOUT,
      MessageFailureReason.SERVER_ERROR,
      MessageFailureReason.MEDIA_UPLOAD_FAILED
    ]
    
    return retryableReasons.includes(reason)
  }
  
  private async scheduleRetry(failure: MessageFailure): Promise<void> {
    if (failure.retryCount >= this.maxRetries) {
      await this.markAsPermanentFailure(failure)
      return
    }
    
    const delay = this.retryDelays[failure.retryCount] || this.retryDelays[this.retryDelays.length - 1]
    
    setTimeout(async () => {
      await this.retryMessage(failure)
    }, delay)
  }
  
  private async retryMessage(failure: MessageFailure): Promise<void> {
    try {
      failure.retryCount++
      
      // Buscar mensagem original
      const message = await this.getMessage(failure.messageId)
      if (!message) return
      
      // Tentar enviar novamente
      const result = await this.sock.sendMessage(message.jid, message.content)
      
      // Sucesso - atualizar status
      await this.updateMessageStatus(failure.messageId, MessageStatus.SENT, result)
      
      // Remover da fila de retry
      this.retryQueue.delete(failure.messageId)
      
      this.emit('message:retry-success', {
        messageId: failure.messageId,
        retryCount: failure.retryCount
      })
      
    } catch (error) {
      // Falha novamente
      failure.error = error
      failure.timestamp = new Date()
      
      if (failure.retryCount < this.maxRetries) {
        await this.scheduleRetry(failure)
      } else {
        await this.markAsPermanentFailure(failure)
      }
    }
  }
  
  private async markAsPermanentFailure(failure: MessageFailure): Promise<void> {
    await this.updateMessageStatus(failure.messageId, MessageStatus.FAILED, {
      reason: failure.reason,
      error: failure.error.message,
      retryCount: failure.retryCount,
      permanent: true
    })
    
    this.emit('message:permanent-failure', failure)
  }
}
```

### 3. **Interface para Falhas**

```typescript
// Componente para mostrar falhas e permitir retry
const MessageFailureIndicator: React.FC<{
  message: MessageWithStatus,
  onRetry: (messageId: string) => void
}> = ({ message, onRetry }) => {
  if (message.status !== MessageStatus.FAILED) return null
  
  const getFailureMessage = (reason: MessageFailureReason) => {
    switch (reason) {
      case MessageFailureReason.NETWORK_ERROR:
        return 'Network error. Check your connection.'
      case MessageFailureReason.RATE_LIMITED:
        return 'Too many messages. Please wait.'
      case MessageFailureReason.BLOCKED_BY_USER:
        return 'You are blocked by this contact.'
      case MessageFailureReason.INVALID_JID:
        return 'Invalid phone number.'
      default:
        return 'Failed to send message.'
    }
  }
  
  return (
    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
      <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
      <span className="text-sm text-red-700">
        {getFailureMessage(message.failureReason)}
      </span>
      {message.retryable && (
        <button
          onClick={() => onRetry(message.id)}
          className="text-sm text-blue-600 hover:underline"
        >
          Retry
        </button>
      )}
    </div>
  )
}
```

---

## Status de Digitação e Gravação

### 1. **Implementação de Presence**

```typescript
enum PresenceType {
  AVAILABLE = 'available',     // Online
  UNAVAILABLE = 'unavailable', // Offline
  COMPOSING = 'composing',     // Digitando...
  RECORDING = 'recording',     // Gravando áudio...
  PAUSED = 'paused'           // Parou de digitar
}

class PresenceManager {
  private presenceStates = new Map<string, PresenceType>()
  private presenceTimeouts = new Map<string, NodeJS.Timeout>()
  
  constructor(private sock: WASocket) {
    this.setupPresenceHandlers()
  }
  
  private setupPresenceHandlers() {
    // Receber atualizações de presence
    this.sock.ev.on('presence.update', this.handlePresenceUpdate.bind(this))
  }
  
  // Enviar status de digitação
  async setTyping(jid: string, isTyping: boolean): Promise<void> {
    try {
      if (isTyping) {
        // Inscrever-se para receber presence do contato
        await this.sock.presenceSubscribe(jid)
        
        // Enviar status de digitação
        await this.sock.sendPresenceUpdate('composing', jid)
        
        // Auto-parar após 10 segundos
        this.schedulePresenceStop(jid, 10000)
      } else {
        await this.sock.sendPresenceUpdate('paused', jid)
        this.clearPresenceTimeout(jid)
      }
    } catch (error) {
      console.error('Failed to update typing status:', error)
    }
  }
  
  // Enviar status de gravação de áudio
  async setRecording(jid: string, isRecording: boolean): Promise<void> {
    try {
      if (isRecording) {
        await this.sock.presenceSubscribe(jid)
        await this.sock.sendPresenceUpdate('recording', jid)
        
        // Auto-parar após 30 segundos
        this.schedulePresenceStop(jid, 30000)
      } else {
        await this.sock.sendPresenceUpdate('paused', jid)
        this.clearPresenceTimeout(jid)
      }
    } catch (error) {
      console.error('Failed to update recording status:', error)
    }
  }
  
  // Definir status online/offline
  async setAvailability(isAvailable: boolean): Promise<void> {
    try {
      const presence = isAvailable ? 'available' : 'unavailable'
      await this.sock.sendPresenceUpdate(presence)
    } catch (error) {
      console.error('Failed to update availability:', error)
    }
  }
  
  // Handler para receber presence de outros usuários
  private handlePresenceUpdate(update: any): void {
    const { id: jid, presences } = update
    
    if (!presences) return
    
    // Processar cada presence no update
    for (const [participantJid, presence] of Object.entries(presences)) {
      const { lastKnownPresence, lastSeen } = presence as any
      
      // Atualizar estado local
      this.presenceStates.set(participantJid, lastKnownPresence)
      
      // Emitir evento para UI
      this.emit('presence:updated', {
        jid: participantJid,
        chatJid: jid,
        presence: lastKnownPresence,
        lastSeen: lastSeen ? new Date(lastSeen * 1000) : null
      })
    }
  }
  
  // Agendar parada automática de presence
  private schedulePresenceStop(jid: string, delay: number): void {
    this.clearPresenceTimeout(jid)
    
    const timeout = setTimeout(async () => {
      await this.sock.sendPresenceUpdate('paused', jid)
      this.presenceTimeouts.delete(jid)
    }, delay)
    
    this.presenceTimeouts.set(jid, timeout)
  }
  
  private clearPresenceTimeout(jid: string): void {
    const timeout = this.presenceTimeouts.get(jid)
    if (timeout) {
      clearTimeout(timeout)
      this.presenceTimeouts.delete(jid)
    }
  }
  
  // Obter status atual de um usuário
  getPresence(jid: string): PresenceType | null {
    return this.presenceStates.get(jid) || null
  }
  
  // Limpar todos os timeouts
  cleanup(): void {
    for (const timeout of this.presenceTimeouts.values()) {
      clearTimeout(timeout)
    }
    this.presenceTimeouts.clear()
  }
}
```

### 2. **Integração com Interface de Chat**

```typescript
// Hook React para gerenciar typing status
const useTypingStatus = (jid: string, presenceManager: PresenceManager) => {
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  
  const startTyping = useCallback(async () => {
    if (!isTyping) {
      setIsTyping(true)
      await presenceManager.setTyping(jid, true)
    }
    
    // Reset timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Auto-stop após 3 segundos de inatividade
    typingTimeoutRef.current = setTimeout(async () => {
      setIsTyping(false)
      await presenceManager.setTyping(jid, false)
    }, 3000)
  }, [jid, isTyping, presenceManager])
  
  const stopTyping = useCallback(async () => {
    if (isTyping) {
      setIsTyping(false)
      await presenceManager.setTyping(jid, false)
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }, [jid, isTyping, presenceManager])
  
  const startRecording = useCallback(async () => {
    setIsRecording(true)
    await presenceManager.setRecording(jid, true)
  }, [jid, presenceManager])
  
  const stopRecording = useCallback(async () => {
    setIsRecording(false)
    await presenceManager.setRecording(jid, false)
  }, [jid, presenceManager])
  
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])
  
  return {
    isTyping,
    isRecording,
    startTyping,
    stopTyping,
    startRecording,
    stopRecording
  }
}

// Componente para mostrar status de digitação
const TypingIndicator: React.FC<{ 
  jid: string, 
  presenceManager: PresenceManager 
}> = ({ jid, presenceManager }) => {
  const [presence, setPresence] = useState<PresenceType | null>(null)
  
  useEffect(() => {
    const handlePresenceUpdate = (update: any) => {
      if (update.jid === jid) {
        setPresence(update.presence)
        
        // Auto-hide após 10 segundos
        setTimeout(() => {
          setPresence(null)
        }, 10000)
      }
    }
    
    presenceManager.on('presence:updated', handlePresenceUpdate)
    
    return () => {
      presenceManager.off('presence:updated', handlePresenceUpdate)
    }
  }, [jid, presenceManager])
  
  if (!presence || presence === PresenceType.AVAILABLE) {
    return null
  }
  
  const getPresenceText = () => {
    switch (presence) {
      case PresenceType.COMPOSING:
        return 'typing...'
      case PresenceType.RECORDING:
        return 'recording audio...'
      default:
        return null
    }
  }
  
  const presenceText = getPresenceText()
  
  if (!presenceText) return null
  
  return (
    <div className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600">
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100" />
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200" />
      </div>
      <span>{presenceText}</span>
    </div>
  )
}
```

---

## Sincronização Multi-Device

### 1. **Como Funciona a Sincronização**

```typescript
class MultiDeviceSyncManager {
  private syncState = {
    isInitialSync: true,
    lastSyncTimestamp: 0,
    pendingSyncs: new Set<string>()
  }
  
  constructor(private sock: WASocket) {
    this.setupSyncHandlers()
  }
  
  private setupSyncHandlers() {
    // Sincronização inicial
    this.sock.ev.on('connection.update', this.handleConnectionUpdate.bind(this))
    
    // Sincronização de mensagens
    this.sock.ev.on('messaging-history.set', this.handleHistorySync.bind(this))
    
    // Sincronização de estado da aplicação
    this.sock.ev.on('creds.update', this.handleCredsUpdate.bind(this))
    
    // Mensagens de outros dispositivos
    this.sock.ev.on('messages.upsert', this.handleCrossDeviceMessages.bind(this))
  }
  
  private async handleConnectionUpdate(update: any) {
    const { connection, receivedPendingNotifications } = update
    
    if (connection === 'open') {
      if (this.syncState.isInitialSync) {
        await this.performInitialSync()
        this.syncState.isInitialSync = false
      }
      
      if (receivedPendingNotifications) {
        await this.processPendingNotifications()
      }
    }
  }
  
  // Sincronização inicial ao conectar
  private async performInitialSync(): Promise<void> {
    console.log('Starting initial multi-device sync...')
    
    try {
      // 1. Sincronizar contatos
      await this.syncContacts()
      
      // 2. Sincronizar chats
      await this.syncChats()
      
      // 3. Sincronizar configurações
      await this.syncAppState()
      
      // 4. Sincronizar mensagens recentes
      await this.syncRecentMessages()
      
      console.log('Initial sync completed')
      this.emit('sync:completed', { type: 'initial' })
      
    } catch (error) {
      console.error('Initial sync failed:', error)
      this.emit('sync:failed', { type: 'initial', error })
    }
  }
  
  // Sincronizar histórico de mensagens
  private async handleHistorySync(historySet: any): Promise<void> {
    const { chats, contacts, messages, isLatest, progress, syncType } = historySet
    
    console.log(`Syncing history: ${messages.length} messages, ${chats.length} chats, progress: ${progress}%`)
    
    // Processar mensagens sincronizadas
    for (const message of messages) {
      await this.processHistoryMessage(message)
    }
    
    // Processar chats sincronizados
    for (const chat of chats) {
      await this.processHistoryChat(chat)
    }
    
    // Processar contatos sincronizados
    for (const contact of contacts) {
      await this.processHistoryContact(contact)
    }
    
    // Emitir progresso
    this.emit('sync:progress', {
      type: 'history',
      progress,
      isLatest,
      syncType,
      stats: {
        messages: messages.length,
        chats: chats.length,
        contacts: contacts.length
      }
    })
    
    if (isLatest) {
      console.log('History sync completed')
      this.emit('sync:completed', { type: 'history' })
    }
  }
  
  // Processar mensagens de outros dispositivos
  private async handleCrossDeviceMessages(upsert: any): Promise<void> {
    const { messages, type } = upsert
    
    for (const message of messages) {
      // Verificar se a mensagem veio de outro dispositivo
      if (message.key.fromMe && !message.key.participant) {
        await this.processCrossDeviceMessage(message)
      }
    }
  }
  
  private async processCrossDeviceMessage(message: any): Promise<void> {
    // Atualizar status de mensagens enviadas de outros dispositivos
    const existingMessage = await this.findMessageByKey(message.key)
    
    if (existingMessage) {
      // Atualizar status se necessário
      await this.updateMessageFromCrossDevice(existingMessage, message)
    } else {
      // Adicionar nova mensagem enviada de outro dispositivo
      await this.addCrossDeviceMessage(message)
    }
    
    this.emit('message:cross-device', {
      messageId: message.key.id,
      chatId: message.key.remoteJid,
      type: 'sent-from-other-device'
    })
  }
  
  // Sincronizar estado da aplicação
  private async syncAppState(): Promise<void> {
    // O Baileys sincroniza automaticamente o app state
    // Aqui podemos processar mudanças específicas
    
    const appState = this.sock.authState.creds
    
    // Processar configurações sincronizadas
    if (appState.accountSettings) {
      await this.processAccountSettings(appState.accountSettings)
    }
    
    this.emit('sync:app-state', { settings: appState.accountSettings })
  }
  
  // Forçar sincronização manual
  async forceSyncMessages(jid: string, count: number = 50): Promise<void> {
    try {
      console.log(`Force syncing ${count} messages for ${jid}`)
      
      const messages = await this.sock.fetchMessageHistory(jid, count)
      
      for (const message of messages) {
        await this.processHistoryMessage(message)
      }
      
      this.emit('sync:manual-completed', {
        jid,
        messageCount: messages.length
      })
      
    } catch (error) {
      console.error('Manual sync failed:', error)
      this.emit('sync:manual-failed', { jid, error })
    }
  }
  
  // Verificar e resolver conflitos de sincronização
  async resolveSyncConflicts(): Promise<void> {
    const conflicts = await this.detectSyncConflicts()
    
    for (const conflict of conflicts) {
      await this.resolveConflict(conflict)
    }
  }
  
  private async detectSyncConflicts(): Promise<any[]> {
    // Implementar detecção de conflitos
    // Ex: mensagens com timestamps inconsistentes
    return []
  }
  
  private async resolveConflict(conflict: any): Promise<void> {
    // Implementar resolução de conflitos
    // Ex: usar timestamp mais recente
  }
}
```

### 2. **Indicadores de Sincronização**

```typescript
// Componente para mostrar status de sincronização
const SyncStatusIndicator: React.FC<{ syncManager: MultiDeviceSyncManager }> = ({ 
  syncManager 
}) => {
  const [syncStatus, setSyncStatus] = useState<{
    isActive: boolean
    type?: string
    progress?: number
    error?: string
  }>({ isActive: false })
  
  useEffect(() => {
    const handleSyncProgress = (data: any) => {
      setSyncStatus({
        isActive: true,
        type: data.type,
        progress: data.progress
      })
    }
    
    const handleSyncCompleted = (data: any) => {
      setSyncStatus({ isActive: false })
      
      // Mostrar notificação de sucesso
      toast.success(`${data.type} sync completed`)
    }
    
    const handleSyncFailed = (data: any) => {
      setSyncStatus({
        isActive: false,
        error: data.error.message
      })
      
      // Mostrar notificação de erro
      toast.error(`Sync failed: ${data.error.message}`)
    }
    
    syncManager.on('sync:progress', handleSyncProgress)
    syncManager.on('sync:completed', handleSyncCompleted)
    syncManager.on('sync:failed', handleSyncFailed)
    
    return () => {
      syncManager.off('sync:progress', handleSyncProgress)
      syncManager.off('sync:completed', handleSyncCompleted)
      syncManager.off('sync:failed', handleSyncFailed)
    }
  }, [syncManager])
  
  if (!syncStatus.isActive && !syncStatus.error) {
    return null
  }
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-b">
      {syncStatus.isActive && (
        <>
          <Spinner className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-700">
            Syncing {syncStatus.type}...
            {syncStatus.progress && ` ${syncStatus.progress}%`}
          </span>
        </>
      )}
      
      {syncStatus.error && (
        <>
          <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">
            Sync failed: {syncStatus.error}
          </span>
        </>
      )}
    </div>
  )
}
```

---

## Recuperação de Mensagens Pendentes

### 1. **Sistema de Mensagens Pendentes**

```typescript
class PendingMessageManager {
  private pendingMessages = new Map<string, PendingMessage>()
  private recoveryInProgress = false
  
  constructor(private sock: WASocket) {
    this.setupRecoveryHandlers()
  }
  
  private setupRecoveryHandlers() {
    // Recuperar mensagens ao reconectar
    this.sock.ev.on('connection.update', this.handleReconnection.bind(this))
    
    // Processar notificações pendentes
    this.sock.ev.on('messages.upsert', this.handlePendingNotifications.bind(this))
  }
  
  // Adicionar mensagem à fila de pendentes
  async addPendingMessage(message: MessageWithStatus): Promise<void> {
    const pendingMessage: PendingMessage = {
      id: message.id,
      key: message.key,
      content: message.content,
      jid: message.jid,
      timestamp: message.timestamp,
      attempts: 0,
      maxAttempts: 5,
      nextRetry: new Date(Date.now() + 5000), // 5 segundos
      status: 'pending'
    }
    
    this.pendingMessages.set(message.id, pendingMessage)
    await this.savePendingMessage(pendingMessage)
    
    console.log(`Added message ${message.id} to pending queue`)
  }
  
  // Recuperar mensagens pendentes após reconexão
  private async handleReconnection(update: any): Promise<void> {
    const { connection, receivedPendingNotifications } = update
    
    if (connection === 'open' && !this.recoveryInProgress) {
      this.recoveryInProgress = true
      
      try {
        // 1. Carregar mensagens pendentes do banco
        await this.loadPendingMessages()
        
        // 2. Processar notificações pendentes do WhatsApp
        if (receivedPendingNotifications) {
          await this.processPendingNotifications()
        }
        
        // 3. Tentar reenviar mensagens pendentes
        await this.retryPendingMessages()
        
        // 4. Sincronizar status de mensagens
        await this.syncMessageStatus()
        
        console.log('Message recovery completed')
        this.emit('recovery:completed')
        
      } catch (error) {
        console.error('Message recovery failed:', error)
        this.emit('recovery:failed', error)
      } finally {
        this.recoveryInProgress = false
      }
    }
  }
  
  // Carregar mensagens pendentes do banco de dados
  private async loadPendingMessages(): Promise<void> {
    const pendingMessages = await database.pendingMessages.find({
      status: 'pending',
      attempts: { $lt: 5 }
    }).toArray()
    
    for (const message of pendingMessages) {
      this.pendingMessages.set(message.id, message)
    }
    
    console.log(`Loaded ${pendingMessages.length} pending messages`)
  }
  
  // Processar notificações pendentes do WhatsApp
  private async processPendingNotifications(): Promise<void> {
    // O WhatsApp envia automaticamente notificações pendentes
    // Aqui processamos mensagens que podem ter sido perdidas
    
    console.log('Processing pending notifications from WhatsApp')
    
    // Buscar mensagens recentes de todos os chats ativos
    const activeChats = await this.getActiveChats()
    
    for (const chat of activeChats) {
      try {
        // Buscar últimas 20 mensagens de cada chat
        const messages = await this.sock.fetchMessageHistory(chat.jid, 20)
        
        for (const message of messages) {
          await this.processRecoveredMessage(message)
        }
      } catch (error) {
        console.warn(`Failed to fetch history for ${chat.jid}:`, error)
      }
    }
  }
  
  // Tentar reenviar mensagens pendentes
  private async retryPendingMessages(): Promise<void> {
    const now = new Date()
    const messagesToRetry = Array.from(this.pendingMessages.values())
      .filter(msg => msg.nextRetry <= now && msg.attempts < msg.maxAttempts)
    
    console.log(`Retrying ${messagesToRetry.length} pending messages`)
    
    for (const message of messagesToRetry) {
      await this.retryPendingMessage(message)
    }
  }
  
  private async retryPendingMessage(message: PendingMessage): Promise<void> {
    try {
      message.attempts++
      message.lastAttempt = new Date()
      
      // Tentar enviar novamente
      const result = await this.sock.sendMessage(message.jid, message.content)
      
      // Sucesso - remover da fila de pendentes
      await this.removePendingMessage(message.id)
      
      // Atualizar status da mensagem original
      await this.updateMessageStatus(message.id, MessageStatus.SENT, result)
      
      console.log(`Successfully resent message ${message.id}`)
      
      this.emit('message:resent', {
        messageId: message.id,
        attempts: message.attempts
      })
      
    } catch (error) {
      console.warn(`Failed to resend message ${message.id}:`, error)
      
      // Calcular próxima tentativa (backoff exponencial)
      const backoffDelay = Math.min(1000 * Math.pow(2, message.attempts), 300000) // Max 5 minutos
      message.nextRetry = new Date(Date.now() + backoffDelay)
      
      await this.updatePendingMessage(message)
      
      // Se excedeu tentativas máximas, marcar como falha permanente
      if (message.attempts >= message.maxAttempts) {
        await this.markPendingMessageFailed(message)
      }
    }
  }
  
  // Sincronizar status de mensagens existentes
  private async syncMessageStatus(): Promise<void> {
    console.log('Syncing message status after reconnection')
    
    // Buscar mensagens com status 'sent' ou 'delivered' das últimas 24 horas
    const recentMessages = await database.messages.find({
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      status: { $in: [MessageStatus.SENT, MessageStatus.DELIVERED] },
      direction: 'outbound'
    }).toArray()
    
    // Verificar status atual de cada mensagem
    for (const message of recentMessages) {
      try {
        // Aqui você implementaria a lógica para verificar o status atual
        // O WhatsApp não fornece uma API direta para isso, então
        // dependemos dos eventos de receipt que chegam automaticamente
        
        // Por enquanto, apenas logamos
        console.log(`Checking status for message ${message.id}`)
      } catch (error) {
        console.warn(`Failed to check status for message ${message.id}:`, error)
      }
    }
  }
  
  // Processar mensagem recuperada
  private async processRecoveredMessage(message: any): Promise<void> {
    const messageId = message.key.id
    const existingMessage = await database.messages.findOne({ id: messageId })
    
    if (!existingMessage) {
      // Nova mensagem descoberta durante recuperação
      const processedMessage = MessageProcessor.processIncomingMessage(message)
      await database.messages.insertOne(processedMessage)
      
      this.emit('message:recovered', {
        messageId,
        chatId: message.key.remoteJid,
        type: 'new'
      })
    } else {
      // Verificar se precisa atualizar status
      const currentStatus = this.extractMessageStatus(message)
      
      if (currentStatus && currentStatus !== existingMessage.status) {
        await this.updateMessageStatus(messageId, currentStatus, {})
        
        this.emit('message:recovered', {
          messageId,
          chatId: message.key.remoteJid,
          type: 'status-updated',
          oldStatus: existingMessage.status,
          newStatus: currentStatus
        })
      }
    }
  }
  
  // Marcar mensagem pendente como falha permanente
  private async markPendingMessageFailed(message: PendingMessage): Promise<void> {
    await this.removePendingMessage(message.id)
    
    await this.updateMessageStatus(message.id, MessageStatus.FAILED, {
      reason: 'max_retries_exceeded',
      attempts: message.attempts
    })
    
    this.emit('message:permanent-failure', {
      messageId: message.id,
      attempts: message.attempts
    })
  }
  
  // Limpar mensagens pendentes antigas
  async cleanupOldPendingMessages(): Promise<void> {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 dias
    
    const oldMessages = await database.pendingMessages.find({
      timestamp: { $lt: cutoffDate }
    }).toArray()
    
    for (const message of oldMessages) {
      await this.markPendingMessageFailed(message)
    }
    
    console.log(`Cleaned up ${oldMessages.length} old pending messages`)
  }
  
  // Obter estatísticas de mensagens pendentes
  getPendingStats(): {
    total: number
    byStatus: Record<string, number>
    oldestPending: Date | null
  } {
    const messages = Array.from(this.pendingMessages.values())
    
    const stats = {
      total: messages.length,
      byStatus: {} as Record<string, number>,
      oldestPending: null as Date | null
    }
    
    for (const message of messages) {
      stats.byStatus[message.status] = (stats.byStatus[message.status] || 0) + 1
      
      if (!stats.oldestPending || message.timestamp < stats.oldestPending) {
        stats.oldestPending = message.timestamp
      }
    }
    
    return stats
  }
}

interface PendingMessage {
  id: string
  key: WAMessageKey
  content: any
  jid: string
  timestamp: Date
  attempts: number
  maxAttempts: number
  nextRetry: Date
  lastAttempt?: Date
  status: 'pending' | 'retrying' | 'failed'
}
```

---

## Implementação Prática Completa

### 1. **Sistema Integrado de Status**

```typescript
class WhatsAppStatusSystem {
  private messageTracker: MessageStatusTracker
  private failureHandler: MessageFailureHandler
  private presenceManager: PresenceManager
  private syncManager: MultiDeviceSyncManager
  private pendingManager: PendingMessageManager
  
  constructor(private sock: WASocket) {
    this.messageTracker = new MessageStatusTracker(sock)
    this.failureHandler = new MessageFailureHandler(sock)
    this.presenceManager = new PresenceManager(sock)
    this.syncManager = new MultiDeviceSyncManager(sock)
    this.pendingManager = new PendingMessageManager(sock)
    
    this.setupIntegration()
  }
  
  private setupIntegration() {
    // Integrar sistemas
    this.messageTracker.on('message:failed', (data) => {
      this.failureHandler.handleSendError(data.messageId, data.error)
    })
    
    this.failureHandler.on('message:permanent-failure', (failure) => {
      this.pendingManager.removePendingMessage(failure.messageId)
    })
    
    this.syncManager.on('sync:completed', () => {
      this.pendingManager.retryPendingMessages()
    })
  }
  
  // API unificada para enviar mensagem com tracking completo
  async sendMessage(jid: string, content: any): Promise<MessageWithStatus> {
    try {
      // 1. Criar mensagem local
      const message = await this.messageTracker.createMessage(jid, content)
      
      // 2. Adicionar à fila de pendentes
      await this.pendingManager.addPendingMessage(message)
      
      // 3. Tentar enviar
      const result = await this.messageTracker.sendMessageWithTracking(jid, content)
      
      // 4. Remover da fila de pendentes se sucesso
      await this.pendingManager.removePendingMessage(message.id)
      
      return result
      
    } catch (error) {
      // Erro será tratado pelos handlers integrados
      throw error
    }
  }
  
  // API para gerenciar presence
  async setTyping(jid: string, isTyping: boolean): Promise<void> {
    return this.presenceManager.setTyping(jid, isTyping)
  }
  
  async setRecording(jid: string, isRecording: boolean): Promise<void> {
    return this.presenceManager.setRecording(jid, isRecording)
  }
  
  // API para sincronização
  async forceSync(jid?: string): Promise<void> {
    if (jid) {
      return this.syncManager.forceSyncMessages(jid)
    } else {
      return this.syncManager.performInitialSync()
    }
  }
  
  // Obter estatísticas completas
  getSystemStats(): {
    messages: any
    pending: any
    sync: any
    presence: any
  } {
    return {
      messages: this.messageTracker.getStats(),
      pending: this.pendingManager.getPendingStats(),
      sync: this.syncManager.getSyncStats(),
      presence: this.presenceManager.getPresenceStats()
    }
  }
  
  // Cleanup completo
  async cleanup(): Promise<void> {
    await this.presenceManager.cleanup()
    await this.pendingManager.cleanupOldPendingMessages()
    await this.messageTracker.cleanup()
  }
}
```

### 2. **Interface Completa de Chat**

```typescript
const ChatInterface: React.FC<{ jid: string, statusSystem: WhatsAppStatusSystem }> = ({ 
  jid, 
  statusSystem 
}) => {
  const [messages, setMessages] = useState<MessageWithStatus[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserPresence, setOtherUserPresence] = useState<PresenceType | null>(null)
  
  // Gerenciar typing status
  const handleInputChange = useCallback(async (text: string) => {
    setInputText(text)
    
    if (text.length > 0 && !isTyping) {
      setIsTyping(true)
      await statusSystem.setTyping(jid, true)
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false)
      await statusSystem.setTyping(jid, false)
    }
  }, [jid, isTyping, statusSystem])
  
  // Enviar mensagem
  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) return
    
    try {
      // Parar typing
      if (isTyping) {
        setIsTyping(false)
        await statusSystem.setTyping(jid, false)
      }
      
      // Enviar mensagem
      const message = await statusSystem.sendMessage(jid, { text: inputText.trim() })
      
      // Adicionar à lista local
      setMessages(prev => [...prev, message])
      
      // Limpar input
      setInputText('')
      
    } catch (error) {
      console.error('Failed to send message:', error)
      // Erro será mostrado pelo sistema de status
    }
  }, [jid, inputText, isTyping, statusSystem])
  
  // Escutar eventos de status
  useEffect(() => {
    const handleStatusUpdate = (data: any) => {
      if (data.chatId === jid) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, status: data.status, [data.status + 'At']: data.timestamp }
              : msg
          )
        )
      }
    }
    
    const handlePresenceUpdate = (data: any) => {
      if (data.chatJid === jid) {
        setOtherUserPresence(data.presence)
      }
    }
    
    statusSystem.on('message:status-changed', handleStatusUpdate)
    statusSystem.on('presence:updated', handlePresenceUpdate)
    
    return () => {
      statusSystem.off('message:status-changed', handleStatusUpdate)
      statusSystem.off('presence:updated', handlePresenceUpdate)
    }
  }, [jid, statusSystem])
  
  return (
    <div className="flex flex-col h-full">
      {/* Header com status de sync */}
      <SyncStatusIndicator syncManager={statusSystem.syncManager} />
      
      {/* Lista de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.direction === 'outbound' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-900'
            }`}>
              <div>{message.text}</div>
              
              {/* Status da mensagem */}
              {message.direction === 'outbound' && (
                <MessageStatusIndicator 
                  status={message.status} 
                  timestamp={message[message.status + 'At']} 
                />
              )}
              
              {/* Indicador de falha */}
              <MessageFailureIndicator 
                message={message}
                onRetry={(messageId) => statusSystem.retryMessage(messageId)}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicador de typing */}
      <TypingIndicator jid={jid} presenceManager={statusSystem.presenceManager} />
      
      {/* Input de mensagem */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## Monitoramento e Debug

### 1. **Sistema de Monitoramento**

```typescript
class StatusMonitor {
  private metrics = {
    messagesSent: 0,
    messagesDelivered: 0,
    messagesRead: 0,
    messagesFailed: 0,
    averageDeliveryTime: 0,
    averageReadTime: 0,
    syncEvents: 0,
    presenceUpdates: 0
  }
  
  constructor(private statusSystem: WhatsAppStatusSystem) {
    this.setupMonitoring()
  }
  
  private setupMonitoring() {
    this.statusSystem.on('message:status-changed', this.trackMessageStatus.bind(this))
    this.statusSystem.on('sync:completed', this.trackSyncEvent.bind(this))
    this.statusSystem.on('presence:updated', this.trackPresenceUpdate.bind(this))
  }
  
  private trackMessageStatus(data: any) {
    switch (data.status) {
      case MessageStatus.SENT:
        this.metrics.messagesSent++
        break
      case MessageStatus.DELIVERED:
        this.metrics.messagesDelivered++
        this.updateAverageDeliveryTime(data)
        break
      case MessageStatus.READ:
        this.metrics.messagesRead++
        this.updateAverageReadTime(data)
        break
      case MessageStatus.FAILED:
        this.metrics.messagesFailed++
        break
    }
  }
  
  private updateAverageDeliveryTime(data: any) {
    // Calcular tempo médio de entrega
    const deliveryTime = data.timestamp - data.sentAt
    this.metrics.averageDeliveryTime = 
      (this.metrics.averageDeliveryTime + deliveryTime) / 2
  }
  
  private updateAverageReadTime(data: any) {
    // Calcular tempo médio de leitura
    const readTime = data.timestamp - data.deliveredAt
    this.metrics.averageReadTime = 
      (this.metrics.averageReadTime + readTime) / 2
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      deliveryRate: this.metrics.messagesDelivered / this.metrics.messagesSent,
      readRate: this.metrics.messagesRead / this.metrics.messagesDelivered,
      failureRate: this.metrics.messagesFailed / this.metrics.messagesSent
    }
  }
  
  generateReport(): string {
    const metrics = this.getMetrics()
    
    return `
WhatsApp Status Report
=====================
Messages Sent: ${metrics.messagesSent}
Messages Delivered: ${metrics.messagesDelivered} (${(metrics.deliveryRate * 100).toFixed(1)}%)
Messages Read: ${metrics.messagesRead} (${(metrics.readRate * 100).toFixed(1)}%)
Messages Failed: ${metrics.messagesFailed} (${(metrics.failureRate * 100).toFixed(1)}%)

Average Delivery Time: ${(metrics.averageDeliveryTime / 1000).toFixed(1)}s
Average Read Time: ${(metrics.averageReadTime / 1000).toFixed(1)}s

Sync Events: ${metrics.syncEvents}
Presence Updates: ${metrics.presenceUpdates}
    `.trim()
  }
}
```

### 2. **Debug Tools**

```typescript
class StatusDebugger {
  constructor(private statusSystem: WhatsAppStatusSystem) {}
  
  // Debug de mensagem específica
  async debugMessage(messageId: string): Promise<any> {
    const message = await database.messages.findOne({ id: messageId })
    
    if (!message) {
      return { error: 'Message not found' }
    }
    
    return {
      message,
      timeline: await this.getMessageTimeline(messageId),
      retryHistory: await this.getRetryHistory(messageId),
      syncStatus: await this.getSyncStatus(messageId)
    }
  }
  
  // Timeline de uma mensagem
  private async getMessageTimeline(messageId: string): Promise<any[]> {
    return await database.messageEvents.find({ messageId })
      .sort({ timestamp: 1 })
      .toArray()
  }
  
  // Histórico de tentativas
  private async getRetryHistory(messageId: string): Promise<any[]> {
    return await database.retryHistory.find({ messageId })
      .sort({ timestamp: 1 })
      .toArray()
  }
  
  // Status de sincronização
  private async getSyncStatus(messageId: string): Promise<any> {
    return {
      isPending: await this.statusSystem.pendingManager.isPending(messageId),
      lastSync: await this.getLastSyncTime(messageId),
      conflicts: await this.getSyncConflicts(messageId)
    }
  }
  
  // Verificar saúde do sistema
  checkSystemHealth(): {
    status: 'healthy' | 'warning' | 'critical'
    issues: string[]
    recommendations: string[]
  } {
    const issues: string[] = []
    const recommendations: string[] = []
    
    const stats = this.statusSystem.getSystemStats()
    
    // Verificar taxa de falhas
    if (stats.messages.failureRate > 0.1) {
      issues.push('High message failure rate')
      recommendations.push('Check network connection and rate limiting')
    }
    
    // Verificar mensagens pendentes
    if (stats.pending.total > 100) {
      issues.push('Too many pending messages')
      recommendations.push('Investigate connection stability')
    }
    
    // Verificar sincronização
    if (stats.sync.lastSync && Date.now() - stats.sync.lastSync > 300000) {
      issues.push('Sync is outdated')
      recommendations.push('Force sync or check connection')
    }
    
    const status = issues.length === 0 ? 'healthy' : 
                  issues.length <= 2 ? 'warning' : 'critical'
    
    return { status, issues, recommendations }
  }
}
```

---

## Melhores Práticas

### 1. **Otimização de Performance**

```typescript
// Batch processing de status updates
class BatchStatusProcessor {
  private updateQueue: any[] = []
  private batchSize = 50
  private batchTimeout = 1000 // 1 segundo
  
  queueStatusUpdate(update: any) {
    this.updateQueue.push(update)
    
    if (this.updateQueue.length >= this.batchSize) {
      this.processBatch()
    } else {
      this.scheduleBatchProcessing()
    }
  }
  
  private scheduleBatchProcessing() {
    setTimeout(() => {
      if (this.updateQueue.length > 0) {
        this.processBatch()
      }
    }, this.batchTimeout)
  }
  
  private async processBatch() {
    const batch = this.updateQueue.splice(0, this.batchSize)
    
    try {
      await database.messages.bulkWrite(
        batch.map(update => ({
          updateOne: {
            filter: { id: update.messageId },
            update: { $set: update.changes }
          }
        }))
      )
    } catch (error) {
      console.error('Batch status update failed:', error)
    }
  }
}
```

### 2. **Gerenciamento de Memória**

```typescript
// Limpeza automática de dados antigos
class DataCleanupManager {
  private cleanupInterval: NodeJS.Timeout
  
  constructor() {
    // Executar limpeza a cada hora
    this.cleanupInterval = setInterval(() => {
      this.performCleanup()
    }, 60 * 60 * 1000)
  }
  
  private async performCleanup() {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 dias
    
    // Limpar eventos antigos
    await database.messageEvents.deleteMany({
      timestamp: { $lt: cutoffDate }
    })
    
    // Limpar histórico de retry antigo
    await database.retryHistory.deleteMany({
      timestamp: { $lt: cutoffDate }
    })
    
    // Limpar cache de presence
    this.clearOldPresenceData()
  }
  
  cleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}
```

### 3. **Tratamento de Erros Robusto**

```typescript
// Error boundary para status system
class StatusSystemErrorBoundary {
  private errorCount = 0
  private lastError: Date | null = null
  private maxErrors = 10
  private errorWindow = 60000 // 1 minuto
  
  async handleError(error: Error, context: string): Promise<void> {
    const now = new Date()
    
    // Reset contador se passou da janela de tempo
    if (this.lastError && now.getTime() - this.lastError.getTime() > this.errorWindow) {
      this.errorCount = 0
    }
    
    this.errorCount++
    this.lastError = now
    
    // Log do erro
    console.error(`Status system error in ${context}:`, error)
    
    // Se muitos erros, entrar em modo de recuperação
    if (this.errorCount >= this.maxErrors) {
      await this.enterRecoveryMode()
    }
  }
  
  private async enterRecoveryMode(): Promise<void> {
    console.warn('Status system entering recovery mode due to excessive errors')
    
    // Pausar operações não críticas
    // Tentar reconectar
    // Limpar caches
    // Notificar administradores
  }
}
```

Esta implementação completa fornece um sistema robusto de controle de status e entrega para WhatsApp usando Baileys, cobrindo todos os aspectos desde o envio básico até a recuperação avançada de mensagens e sincronização multi-device.