# Funcionalidades de Mensagens WhatsApp - Guia Completo de Implementação

## Índice

1. [Visão Geral das Funcionalidades](#visão-geral-das-funcionalidades)
2. [Suporte do Baileys por Funcionalidade](#suporte-do-baileys-por-funcionalidade)
3. [Envio de Mensagens](#envio-de-mensagens)
4. [Interações com Mensagens](#interações-com-mensagens)
5. [Implementação na Interface](#implementação-na-interface)
6. [Estruturas de Dados](#estruturas-de-dados)
7. [Exemplos Práticos](#exemplos-práticos)
8. [Limitações e Considerações](#limitações-e-considerações)
9. [Melhores Práticas](#melhores-práticas)

---

## Visão Geral das Funcionalidades

### Funcionalidades Suportadas pelo Baileys

O Baileys implementa a maioria das funcionalidades do WhatsApp Web, mas com algumas limitações. Aqui está o mapeamento completo:

```
✅ Totalmente Suportado
🟡 Parcialmente Suportado  
❌ Não Suportado
🔄 Em Desenvolvimento
```

### Matriz de Compatibilidade

| Funcionalidade | Baileys | Implementação | Complexidade |
|---|---|---|---|
| **ENVIO DE MENSAGENS** |
| Texto simples | ✅ | Nativa | Baixa |
| Texto formatado | ✅ | Nativa | Baixa |
| Imagem | ✅ | Nativa | Média |
| Vídeo | ✅ | Nativa | Média |
| Áudio | ✅ | Nativa | Média |
| Documento | ✅ | Nativa | Média |
| Localização | ✅ | Nativa | Baixa |
| Contato (vCard) | ✅ | Nativa | Baixa |
| Sticker | ✅ | Nativa | Média |
| Mensagens interativas | 🟡 | Customizada | Alta |
| **INTERAÇÕES** |
| Reply (Responder) | ✅ | Nativa | Baixa |
| Reactions (Reagir) | ✅ | Nativa | Baixa |
| Forward (Encaminhar) | ✅ | Customizada | Média |
| Edit Message | ✅ | Nativa | Baixa |
| Delete for Me | ✅ | Nativa | Baixa |
| Delete for Everyone | ✅ | Nativa | Baixa |
| Pin Message | ✅ | Nativa | Baixa |
| Mention (@) | ✅ | Nativa | Média |
| Star Message | ✅ | Customizada | Baixa |
| Multiple Reply | 🟡 | Customizada | Alta |

---

## Suporte do Baileys por Funcionalidade

### Funcionalidades Nativas (Totalmente Suportadas)

#### 1. **Mensagens de Texto**
```typescript
// Texto simples
await sock.sendMessage(jid, { text: 'Hello World!' })

// Texto formatado
await sock.sendMessage(jid, { 
  text: '*Bold* _italic_ ~strikethrough~ ```monospace```' 
})

// Texto com menções
await sock.sendMessage(jid, {
  text: 'Hello @user!',
  mentions: ['5511999999999@s.whatsapp.net']
})
```

#### 2. **Mídia (Imagem, Vídeo, Áudio, Documento)**
```typescript
// Imagem
await sock.sendMessage(jid, {
  image: { url: 'https://example.com/image.jpg' },
  caption: 'Image caption'
})

// Vídeo
await sock.sendMessage(jid, {
  video: fs.readFileSync('./video.mp4'),
  caption: 'Video caption',
  gifPlayback: false
})

// Áudio
await sock.sendMessage(jid, {
  audio: { url: './audio.mp3' },
  mimetype: 'audio/mp4',
  ptt: true // Para áudio de voz
})

// Documento
await sock.sendMessage(jid, {
  document: { url: './document.pdf' },
  mimetype: 'application/pdf',
  fileName: 'document.pdf'
})
```

#### 3. **Localização**
```typescript
// Localização atual
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: -23.5505,
    degreesLongitude: -46.6333
  }
})

// Localização com nome
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: -23.5505,
    degreesLongitude: -46.6333,
    name: 'São Paulo, Brazil',
    address: 'São Paulo, SP, Brazil'
  }
})
```

#### 4. **Contato (vCard)**
```typescript
await sock.sendMessage(jid, {
  contacts: {
    displayName: 'John Doe',
    contacts: [{
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:John Doe
ORG:Company Name
TEL;type=CELL;type=VOICE;waid=5511999999999:+55 11 99999-9999
END:VCARD`
    }]
  }
})
```

#### 5. **Stickers**
```typescript
await sock.sendMessage(jid, {
  sticker: fs.readFileSync('./sticker.webp')
})
```

#### 6. **Reply (Responder)**
```typescript
await sock.sendMessage(jid, {
  text: 'This is a reply',
  quoted: originalMessage // Mensagem original sendo respondida
})
```

#### 7. **Reactions (Reagir)**
```typescript
await sock.sendMessage(jid, {
  react: {
    text: '👍', // Emoji da reação
    key: messageKey // Chave da mensagem sendo reagida
  }
})

// Remover reação
await sock.sendMessage(jid, {
  react: {
    text: '',
    key: messageKey
  }
})
```

#### 8. **Editar Mensagem**
```typescript
await sock.sendMessage(jid, {
  text: 'Edited message text',
  edit: messageKey // Chave da mensagem sendo editada
})
```

#### 9. **Deletar Mensagem**
```typescript
// Delete for everyone
await sock.sendMessage(jid, {
  delete: messageKey
})

// Delete for me (apenas local)
// Implementado através de flag local na aplicação
```

#### 10. **Pin Message**
```typescript
await sock.chatModify({
  pin: true,
  messageKey: messageKey
}, jid)

// Unpin
await sock.chatModify({
  pin: false,
  messageKey: messageKey
}, jid)
```

### Funcionalidades Parcialmente Suportadas

#### 1. **Mensagens Interativas (Business API)**
```typescript
// Botões (limitado)
await sock.sendMessage(jid, {
  text: 'Choose an option:',
  footer: 'Footer text',
  buttons: [
    { buttonId: 'id1', buttonText: { displayText: 'Button 1' }, type: 1 },
    { buttonId: 'id2', buttonText: { displayText: 'Button 2' }, type: 1 }
  ],
  headerType: 1
})

// Lista (limitado)
await sock.sendMessage(jid, {
  text: 'Select from list:',
  footer: 'Footer text',
  title: 'List Title',
  buttonText: 'View List',
  sections: [{
    title: 'Section 1',
    rows: [
      { title: 'Option 1', rowId: 'opt1', description: 'Description 1' },
      { title: 'Option 2', rowId: 'opt2', description: 'Description 2' }
    ]
  }]
})
```

### Funcionalidades Customizadas (Implementação Manual)

#### 1. **Forward (Encaminhar)**
```typescript
// Implementação customizada
async function forwardMessage(originalMessage, targetJid) {
  const messageContent = extractMessageContent(originalMessage)
  
  // Adicionar indicador de encaminhamento
  if (messageContent.text) {
    messageContent.text = `🔄 Forwarded: ${messageContent.text}`
  }
  
  await sock.sendMessage(targetJid, messageContent)
}
```

#### 2. **Star Message (Favoritar)**
```typescript
// Implementação via banco de dados local
async function starMessage(messageKey, starred = true) {
  await database.messages.updateOne(
    { key: messageKey },
    { $set: { starred, starredAt: new Date() } }
  )
}
```

---

## Envio de Mensagens

### Estrutura Base de Mensagem

```typescript
interface MessageContent {
  // Texto
  text?: string
  
  // Mídia
  image?: { url: string } | Buffer
  video?: { url: string } | Buffer
  audio?: { url: string } | Buffer
  document?: { url: string } | Buffer
  sticker?: { url: string } | Buffer
  
  // Localização
  location?: {
    degreesLatitude: number
    degreesLongitude: number
    name?: string
    address?: string
  }
  
  // Contato
  contacts?: {
    displayName: string
    contacts: Array<{ vcard: string }>
  }
  
  // Metadados
  caption?: string
  mimetype?: string
  fileName?: string
  
  // Interações
  quoted?: WAMessage // Para reply
  mentions?: string[] // Para menções
  edit?: WAMessageKey // Para edição
  
  // Reação
  react?: {
    text: string
    key: WAMessageKey
  }
}
```

### Implementação de Envio Robusto

```typescript
class MessageSender {
  constructor(private sock: WASocket) {}
  
  async sendText(jid: string, text: string, options: TextOptions = {}) {
    const message: MessageContent = { text }
    
    // Adicionar formatação se especificada
    if (options.formatting) {
      message.text = this.applyFormatting(text, options.formatting)
    }
    
    // Adicionar menções
    if (options.mentions?.length) {
      message.mentions = options.mentions
    }
    
    // Adicionar reply
    if (options.replyTo) {
      message.quoted = options.replyTo
    }
    
    return this.sendWithRetry(jid, message)
  }
  
  async sendMedia(jid: string, mediaType: MediaType, media: Buffer | string, options: MediaOptions = {}) {
    const message: MessageContent = {}
    
    // Configurar tipo de mídia
    switch (mediaType) {
      case 'image':
        message.image = typeof media === 'string' ? { url: media } : media
        break
      case 'video':
        message.video = typeof media === 'string' ? { url: media } : media
        break
      case 'audio':
        message.audio = typeof media === 'string' ? { url: media } : media
        message.ptt = options.isVoiceNote || false
        break
      case 'document':
        message.document = typeof media === 'string' ? { url: media } : media
        message.fileName = options.fileName
        break
    }
    
    // Adicionar caption
    if (options.caption) {
      message.caption = options.caption
    }
    
    // Adicionar mimetype
    if (options.mimetype) {
      message.mimetype = options.mimetype
    }
    
    return this.sendWithRetry(jid, message)
  }
  
  async sendLocation(jid: string, latitude: number, longitude: number, options: LocationOptions = {}) {
    const message: MessageContent = {
      location: {
        degreesLatitude: latitude,
        degreesLongitude: longitude,
        name: options.name,
        address: options.address
      }
    }
    
    return this.sendWithRetry(jid, message)
  }
  
  async sendContact(jid: string, contact: ContactInfo) {
    const vcard = this.generateVCard(contact)
    
    const message: MessageContent = {
      contacts: {
        displayName: contact.name,
        contacts: [{ vcard }]
      }
    }
    
    return this.sendWithRetry(jid, message)
  }
  
  private async sendWithRetry(jid: string, message: MessageContent, maxRetries = 3) {
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.sock.sendMessage(jid, message)
        
        // Log sucesso
        this.logMessageSent(jid, message, result)
        
        return result
      } catch (error) {
        lastError = error
        
        if (attempt < maxRetries) {
          // Aguardar antes de tentar novamente
          await this.delay(1000 * attempt)
        }
      }
    }
    
    // Log erro após todas as tentativas
    this.logMessageError(jid, message, lastError)
    throw lastError
  }
  
  private applyFormatting(text: string, formatting: TextFormatting): string {
    let formattedText = text
    
    if (formatting.bold) {
      formattedText = `*${formattedText}*`
    }
    
    if (formatting.italic) {
      formattedText = `_${formattedText}_`
    }
    
    if (formatting.strikethrough) {
      formattedText = `~${formattedText}~`
    }
    
    if (formatting.monospace) {
      formattedText = `\`\`\`${formattedText}\`\`\``
    }
    
    return formattedText
  }
  
  private generateVCard(contact: ContactInfo): string {
    return `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
${contact.organization ? `ORG:${contact.organization}` : ''}
${contact.phone ? `TEL;type=CELL;type=VOICE;waid=${contact.phone.replace(/\D/g, '')}:${contact.phone}` : ''}
${contact.email ? `EMAIL:${contact.email}` : ''}
END:VCARD`
  }
}
```

---

## Interações com Mensagens

### Reply (Responder)

```typescript
class MessageInteractions {
  constructor(private sock: WASocket) {}
  
  async replyToMessage(jid: string, originalMessage: WAMessage, replyText: string) {
    return this.sock.sendMessage(jid, {
      text: replyText,
      quoted: originalMessage
    })
  }
  
  // Reply com mídia
  async replyWithMedia(jid: string, originalMessage: WAMessage, mediaType: string, media: Buffer, caption?: string) {
    const message: any = { quoted: originalMessage }
    
    message[mediaType] = media
    if (caption) message.caption = caption
    
    return this.sock.sendMessage(jid, message)
  }
}
```

### Reactions (Reagir)

```typescript
class ReactionManager {
  constructor(private sock: WASocket) {}
  
  async addReaction(jid: string, messageKey: WAMessageKey, emoji: string) {
    return this.sock.sendMessage(jid, {
      react: {
        text: emoji,
        key: messageKey
      }
    })
  }
  
  async removeReaction(jid: string, messageKey: WAMessageKey) {
    return this.sock.sendMessage(jid, {
      react: {
        text: '',
        key: messageKey
      }
    })
  }
  
  // Gerenciar múltiplas reações
  async toggleReaction(jid: string, messageKey: WAMessageKey, emoji: string) {
    // Verificar se já existe a reação
    const existingReaction = await this.getExistingReaction(messageKey, emoji)
    
    if (existingReaction) {
      return this.removeReaction(jid, messageKey)
    } else {
      return this.addReaction(jid, messageKey, emoji)
    }
  }
  
  private async getExistingReaction(messageKey: WAMessageKey, emoji: string) {
    // Implementar busca na base de dados local
    return await database.reactions.findOne({
      messageKey,
      emoji,
      userId: this.getCurrentUserId()
    })
  }
}
```

### Forward (Encaminhar)

```typescript
class ForwardManager {
  constructor(private sock: WASocket) {}
  
  async forwardMessage(originalMessage: WAMessage, targetJids: string[], addForwardLabel = true) {
    const messageContent = this.extractForwardableContent(originalMessage)
    
    if (addForwardLabel) {
      messageContent = this.addForwardLabel(messageContent)
    }
    
    const results = []
    
    for (const jid of targetJids) {
      try {
        const result = await this.sock.sendMessage(jid, messageContent)
        results.push({ jid, success: true, result })
      } catch (error) {
        results.push({ jid, success: false, error })
      }
    }
    
    return results
  }
  
  private extractForwardableContent(message: WAMessage): MessageContent {
    const content: MessageContent = {}
    
    if (message.message?.conversation) {
      content.text = message.message.conversation
    } else if (message.message?.extendedTextMessage) {
      content.text = message.message.extendedTextMessage.text
    } else if (message.message?.imageMessage) {
      content.image = { url: message.message.imageMessage.url }
      content.caption = message.message.imageMessage.caption
    } else if (message.message?.videoMessage) {
      content.video = { url: message.message.videoMessage.url }
      content.caption = message.message.videoMessage.caption
    } else if (message.message?.audioMessage) {
      content.audio = { url: message.message.audioMessage.url }
    } else if (message.message?.documentMessage) {
      content.document = { url: message.message.documentMessage.url }
      content.fileName = message.message.documentMessage.fileName
      content.mimetype = message.message.documentMessage.mimetype
    }
    
    return content
  }
  
  private addForwardLabel(content: MessageContent): MessageContent {
    if (content.text) {
      content.text = `🔄 Forwarded\n\n${content.text}`
    } else if (content.caption) {
      content.caption = `🔄 Forwarded\n\n${content.caption}`
    }
    
    return content
  }
}
```

### Edit Message (Editar)

```typescript
class MessageEditor {
  constructor(private sock: WASocket) {}
  
  async editMessage(jid: string, messageKey: WAMessageKey, newText: string) {
    // Verificar se a mensagem pode ser editada (tempo limite)
    const canEdit = await this.canEditMessage(messageKey)
    
    if (!canEdit) {
      throw new Error('Message edit time limit exceeded')
    }
    
    return this.sock.sendMessage(jid, {
      text: newText,
      edit: messageKey
    })
  }
  
  private async canEditMessage(messageKey: WAMessageKey): Promise<boolean> {
    const message = await this.getMessageByKey(messageKey)
    
    if (!message) return false
    
    // WhatsApp permite edição até 15 minutos
    const editTimeLimit = 15 * 60 * 1000 // 15 minutos em ms
    const messageAge = Date.now() - (message.messageTimestamp * 1000)
    
    return messageAge < editTimeLimit
  }
  
  private async getMessageByKey(messageKey: WAMessageKey) {
    return await database.messages.findOne({ key: messageKey })
  }
}
```

### Delete Message (Deletar)

```typescript
class MessageDeleter {
  constructor(private sock: WASocket) {}
  
  async deleteForEveryone(jid: string, messageKey: WAMessageKey) {
    // Verificar se a mensagem pode ser deletada para todos
    const canDelete = await this.canDeleteForEveryone(messageKey)
    
    if (!canDelete) {
      throw new Error('Message delete time limit exceeded')
    }
    
    return this.sock.sendMessage(jid, {
      delete: messageKey
    })
  }
  
  async deleteForMe(messageKey: WAMessageKey) {
    // Marcar como deletada localmente
    return await database.messages.updateOne(
      { key: messageKey },
      { 
        $set: { 
          deletedForMe: true,
          deletedAt: new Date()
        }
      }
    )
  }
  
  private async canDeleteForEveryone(messageKey: WAMessageKey): Promise<boolean> {
    const message = await this.getMessageByKey(messageKey)
    
    if (!message) return false
    
    // WhatsApp permite deletar para todos até ~1 hora
    const deleteTimeLimit = 60 * 60 * 1000 // 1 hora em ms
    const messageAge = Date.now() - (message.messageTimestamp * 1000)
    
    return messageAge < deleteTimeLimit
  }
}
```

### Pin Message (Fixar)

```typescript
class MessagePinner {
  constructor(private sock: WASocket) {}
  
  async pinMessage(jid: string, messageKey: WAMessageKey) {
    return this.sock.chatModify({
      pin: true,
      messageKey: messageKey
    }, jid)
  }
  
  async unpinMessage(jid: string, messageKey: WAMessageKey) {
    return this.sock.chatModify({
      pin: false,
      messageKey: messageKey
    }, jid)
  }
  
  async getPinnedMessages(jid: string) {
    // Buscar mensagens fixadas no banco local
    return await database.messages.find({
      chatId: jid,
      pinned: true
    }).sort({ pinnedAt: -1 })
  }
}
```

### Star Message (Favoritar)

```typescript
class MessageStarrer {
  async starMessage(messageKey: WAMessageKey, starred = true) {
    return await database.messages.updateOne(
      { key: messageKey },
      { 
        $set: { 
          starred,
          starredAt: starred ? new Date() : null
        }
      }
    )
  }
  
  async getStarredMessages(jid?: string) {
    const filter: any = { starred: true }
    
    if (jid) {
      filter.chatId = jid
    }
    
    return await database.messages.find(filter)
      .sort({ starredAt: -1 })
  }
  
  async toggleStar(messageKey: WAMessageKey) {
    const message = await database.messages.findOne({ key: messageKey })
    
    if (!message) {
      throw new Error('Message not found')
    }
    
    return this.starMessage(messageKey, !message.starred)
  }
}
```

---

## Implementação na Interface

### Estrutura de Componentes

```typescript
// Estrutura da interface similar ao WhatsApp
interface WhatsAppInterface {
  // Lista de conversas
  conversationList: ConversationListComponent
  
  // Área de chat
  chatArea: {
    header: ChatHeaderComponent
    messageList: MessageListComponent
    inputArea: MessageInputComponent
  }
  
  // Modais e overlays
  mediaViewer: MediaViewerComponent
  contactPicker: ContactPickerComponent
  locationPicker: LocationPickerComponent
}
```

### Componente de Lista de Mensagens

```typescript
interface MessageBubbleProps {
  message: ProcessedMessage
  isOwn: boolean
  showSender: boolean
  onReply: (message: ProcessedMessage) => void
  onReact: (message: ProcessedMessage, emoji: string) => void
  onForward: (message: ProcessedMessage) => void
  onDelete: (message: ProcessedMessage, forEveryone: boolean) => void
  onEdit: (message: ProcessedMessage) => void
  onStar: (message: ProcessedMessage) => void
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showSender,
  onReply,
  onReact,
  onForward,
  onDelete,
  onEdit,
  onStar
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  
  const handleLongPress = () => {
    setShowContextMenu(true)
  }
  
  const handleDoubleClick = () => {
    // Reação rápida com ❤️
    onReact(message, '❤️')
  }
  
  return (
    <div 
      className={`message-bubble ${isOwn ? 'own' : 'other'}`}
      onContextMenu={handleLongPress}
      onDoubleClick={handleDoubleClick}
    >
      {/* Sender info */}
      {showSender && !isOwn && (
        <div className="message-sender">
          {message.senderName}
        </div>
      )}
      
      {/* Reply indicator */}
      {message.quotedMessage && (
        <div className="quoted-message">
          <div className="quoted-content">
            {renderQuotedContent(message.quotedMessage)}
          </div>
        </div>
      )}
      
      {/* Message content */}
      <div className="message-content">
        {renderMessageContent(message)}
      </div>
      
      {/* Message metadata */}
      <div className="message-metadata">
        {message.edited && <span className="edited-indicator">edited</span>}
        <span className="message-time">
          {formatTime(message.timestamp)}
        </span>
        {isOwn && (
          <span className={`message-status ${message.status}`}>
            {renderMessageStatus(message.status)}
          </span>
        )}
      </div>
      
      {/* Reactions */}
      {message.reactions && message.reactions.length > 0 && (
        <div className="message-reactions">
          {message.reactions.map(reaction => (
            <span 
              key={reaction.emoji}
              className="reaction"
              onClick={() => onReact(message, reaction.emoji)}
            >
              {reaction.emoji} {reaction.count}
            </span>
          ))}
        </div>
      )}
      
      {/* Context menu */}
      {showContextMenu && (
        <MessageContextMenu
          message={message}
          isOwn={isOwn}
          onReply={() => onReply(message)}
          onForward={() => onForward(message)}
          onDelete={(forEveryone) => onDelete(message, forEveryone)}
          onEdit={() => onEdit(message)}
          onStar={() => onStar(message)}
          onClose={() => setShowContextMenu(false)}
        />
      )}
      
      {/* Reaction picker */}
      {showReactions && (
        <ReactionPicker
          onReact={(emoji) => onReact(message, emoji)}
          onClose={() => setShowReactions(false)}
        />
      )}
    </div>
  )
}
```

### Componente de Input de Mensagem

```typescript
interface MessageInputProps {
  chatId: string
  replyingTo?: ProcessedMessage
  onSendMessage: (content: MessageContent) => void
  onCancelReply: () => void
}

const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  replyingTo,
  onSendMessage,
  onCancelReply
}) => {
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  
  const handleSendText = () => {
    if (text.trim()) {
      const content: MessageContent = { text: text.trim() }
      
      if (replyingTo) {
        content.quoted = replyingTo.original
      }
      
      onSendMessage(content)
      setText('')
      
      if (replyingTo) {
        onCancelReply()
      }
    }
  }
  
  const handleSendMedia = async (file: File, mediaType: MediaType) => {
    const buffer = await file.arrayBuffer()
    
    const content: MessageContent = {}
    content[mediaType] = Buffer.from(buffer)
    
    if (mediaType !== 'audio') {
      // Permitir caption para mídia visual
      const caption = prompt('Add a caption (optional):')
      if (caption) content.caption = caption
    }
    
    onSendMessage(content)
  }
  
  const handleSendLocation = (latitude: number, longitude: number) => {
    const content: MessageContent = {
      location: {
        degreesLatitude: latitude,
        degreesLongitude: longitude
      }
    }
    
    onSendMessage(content)
  }
  
  const handleSendContact = (contact: ContactInfo) => {
    const vcard = generateVCard(contact)
    
    const content: MessageContent = {
      contacts: {
        displayName: contact.name,
        contacts: [{ vcard }]
      }
    }
    
    onSendMessage(content)
  }
  
  return (
    <div className="message-input">
      {/* Reply indicator */}
      {replyingTo && (
        <div className="reply-indicator">
          <div className="replying-to">
            Replying to {replyingTo.senderName}
          </div>
          <div className="reply-content">
            {renderQuotedContent(replyingTo)}
          </div>
          <button onClick={onCancelReply}>×</button>
        </div>
      )}
      
      <div className="input-row">
        {/* Emoji picker button */}
        <button 
          className="emoji-button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😊
        </button>
        
        {/* Text input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
          placeholder="Type a message..."
          className="text-input"
        />
        
        {/* Attachment button */}
        <button 
          className="attach-button"
          onClick={() => setShowAttachMenu(!showAttachMenu)}
        >
          📎
        </button>
        
        {/* Send/Record button */}
        {text.trim() ? (
          <button onClick={handleSendText} className="send-button">
            ➤
          </button>
        ) : (
          <VoiceRecorder
            onRecordingComplete={(audioBuffer) => 
              handleSendMedia(new File([audioBuffer], 'voice.mp3'), 'audio')
            }
          />
        )}
      </div>
      
      {/* Emoji picker */}
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={(emoji) => setText(text + emoji)}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}
      
      {/* Attachment menu */}
      {showAttachMenu && (
        <AttachmentMenu
          onImageSelect={(file) => handleSendMedia(file, 'image')}
          onVideoSelect={(file) => handleSendMedia(file, 'video')}
          onDocumentSelect={(file) => handleSendMedia(file, 'document')}
          onLocationSelect={handleSendLocation}
          onContactSelect={handleSendContact}
          onClose={() => setShowAttachMenu(false)}
        />
      )}
    </div>
  )
}
```

### Context Menu de Mensagem

```typescript
interface MessageContextMenuProps {
  message: ProcessedMessage
  isOwn: boolean
  onReply: () => void
  onForward: () => void
  onDelete: (forEveryone: boolean) => void
  onEdit: () => void
  onStar: () => void
  onClose: () => void
}

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  message,
  isOwn,
  onReply,
  onForward,
  onDelete,
  onEdit,
  onStar,
  onClose
}) => {
  const canEdit = isOwn && message.type === 'text' && canEditMessage(message)
  const canDeleteForEveryone = isOwn && canDeleteForEveryone(message)
  
  return (
    <div className="context-menu" onClick={onClose}>
      <div className="menu-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Reply */}
        <button onClick={onReply} className="menu-item">
          ↩️ Reply
        </button>
        
        {/* Forward */}
        <button onClick={onForward} className="menu-item">
          ➡️ Forward
        </button>
        
        {/* Star/Unstar */}
        <button onClick={onStar} className="menu-item">
          {message.starred ? '☆' : '★'} {message.starred ? 'Unstar' : 'Star'}
        </button>
        
        {/* Edit (only for own text messages) */}
        {canEdit && (
          <button onClick={onEdit} className="menu-item">
            ✏️ Edit
          </button>
        )}
        
        {/* Delete for me */}
        <button onClick={() => onDelete(false)} className="menu-item">
          🗑️ Delete for me
        </button>
        
        {/* Delete for everyone (only for own messages within time limit) */}
        {canDeleteForEveryone && (
          <button onClick={() => onDelete(true)} className="menu-item danger">
            🗑️ Delete for everyone
          </button>
        )}
        
      </div>
    </div>
  )
}
```

---

## Estruturas de Dados

### Modelo de Mensagem Processada

```typescript
interface ProcessedMessage {
  // Identificação
  id: string
  key: WAMessageKey
  chatId: string
  
  // Conteúdo
  type: MessageType
  content: MessageContent
  text?: string
  mediaUrl?: string
  caption?: string
  
  // Metadados
  timestamp: Date
  status: MessageStatus
  direction: 'inbound' | 'outbound'
  
  // Sender info
  senderId: string
  senderName: string
  senderAvatar?: string
  
  // Interações
  quotedMessage?: ProcessedMessage
  mentions?: string[]
  reactions?: MessageReaction[]
  
  // Estados
  edited: boolean
  editedAt?: Date
  deleted: boolean
  deletedForMe: boolean
  deletedAt?: Date
  starred: boolean
  starredAt?: Date
  pinned: boolean
  pinnedAt?: Date
  
  // Referência original
  original: WAMessage
}

interface MessageReaction {
  emoji: string
  userId: string
  userName: string
  timestamp: Date
  count: number
}

type MessageType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'document' 
  | 'sticker' 
  | 'location' 
  | 'contact'
  | 'system'

type MessageStatus = 
  | 'sending' 
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'failed'
```

### Processador de Mensagens

```typescript
class MessageProcessor {
  static processIncomingMessage(waMessage: WAMessage, chatId: string): ProcessedMessage {
    const messageContent = waMessage.message
    const key = waMessage.key
    
    let type: MessageType = 'text'
    let text: string | undefined
    let mediaUrl: string | undefined
    let caption: string | undefined
    
    // Determinar tipo e extrair conteúdo
    if (messageContent?.conversation) {
      type = 'text'
      text = messageContent.conversation
    } else if (messageContent?.extendedTextMessage) {
      type = 'text'
      text = messageContent.extendedTextMessage.text
    } else if (messageContent?.imageMessage) {
      type = 'image'
      mediaUrl = messageContent.imageMessage.url
      caption = messageContent.imageMessage.caption
    } else if (messageContent?.videoMessage) {
      type = 'video'
      mediaUrl = messageContent.videoMessage.url
      caption = messageContent.videoMessage.caption
    } else if (messageContent?.audioMessage) {
      type = 'audio'
      mediaUrl = messageContent.audioMessage.url
    } else if (messageContent?.documentMessage) {
      type = 'document'
      mediaUrl = messageContent.documentMessage.url
      caption = messageContent.documentMessage.fileName
    } else if (messageContent?.stickerMessage) {
      type = 'sticker'
      mediaUrl = messageContent.stickerMessage.url
    } else if (messageContent?.locationMessage) {
      type = 'location'
    } else if (messageContent?.contactMessage) {
      type = 'contact'
    }
    
    // Extrair informações do sender
    const senderId = key.fromMe ? 'me' : key.remoteJid!
    const senderName = this.getSenderName(senderId, chatId)
    
    // Processar mensagem quotada
    let quotedMessage: ProcessedMessage | undefined
    if (messageContent?.extendedTextMessage?.contextInfo?.quotedMessage) {
      // Processar mensagem quotada recursivamente
      quotedMessage = this.processQuotedMessage(
        messageContent.extendedTextMessage.contextInfo
      )
    }
    
    // Extrair menções
    const mentions = messageContent?.extendedTextMessage?.contextInfo?.mentionedJid || []
    
    return {
      id: key.id!,
      key,
      chatId,
      type,
      content: messageContent,
      text,
      mediaUrl,
      caption,
      timestamp: new Date(waMessage.messageTimestamp! * 1000),
      status: key.fromMe ? 'sent' : 'read',
      direction: key.fromMe ? 'outbound' : 'inbound',
      senderId,
      senderName,
      quotedMessage,
      mentions,
      reactions: [],
      edited: false,
      deleted: false,
      deletedForMe: false,
      starred: false,
      pinned: false,
      original: waMessage
    }
  }
  
  static processOutgoingMessage(content: MessageContent, chatId: string): Partial<ProcessedMessage> {
    let type: MessageType = 'text'
    let text: string | undefined
    let mediaUrl: string | undefined
    let caption: string | undefined
    
    if (content.text) {
      type = 'text'
      text = content.text
    } else if (content.image) {
      type = 'image'
      caption = content.caption
    } else if (content.video) {
      type = 'video'
      caption = content.caption
    } else if (content.audio) {
      type = 'audio'
    } else if (content.document) {
      type = 'document'
      caption = content.fileName
    } else if (content.sticker) {
      type = 'sticker'
    } else if (content.location) {
      type = 'location'
    } else if (content.contacts) {
      type = 'contact'
    }
    
    return {
      chatId,
      type,
      content,
      text,
      mediaUrl,
      caption,
      timestamp: new Date(),
      status: 'sending',
      direction: 'outbound',
      senderId: 'me',
      senderName: 'You',
      reactions: [],
      edited: false,
      deleted: false,
      deletedForMe: false,
      starred: false,
      pinned: false
    }
  }
  
  private static getSenderName(senderId: string, chatId: string): string {
    if (senderId === 'me') return 'You'
    
    // Buscar nome do contato no banco de dados
    // Implementar lógica de busca de contatos
    return senderId.split('@')[0] // Fallback para número
  }
  
  private static processQuotedMessage(contextInfo: any): ProcessedMessage | undefined {
    // Implementar processamento de mensagem quotada
    // Similar ao processIncomingMessage mas para mensagem quotada
    return undefined
  }
}
```

---

## Exemplos Práticos

### Sistema Completo de Mensagens

```typescript
class WhatsAppMessageSystem {
  private sock: WASocket
  private messageSender: MessageSender
  private messageInteractions: MessageInteractions
  private reactionManager: ReactionManager
  private forwardManager: ForwardManager
  private messageEditor: MessageEditor
  private messageDeleter: MessageDeleter
  private messagePinner: MessagePinner
  private messageStarrer: MessageStarrer
  
  constructor(sock: WASocket) {
    this.sock = sock
    this.messageSender = new MessageSender(sock)
    this.messageInteractions = new MessageInteractions(sock)
    this.reactionManager = new ReactionManager(sock)
    this.forwardManager = new ForwardManager(sock)
    this.messageEditor = new MessageEditor(sock)
    this.messageDeleter = new MessageDeleter(sock)
    this.messagePinner = new MessagePinner(sock)
    this.messageStarrer = new MessageStarrer()
    
    this.setupEventHandlers()
  }
  
  private setupEventHandlers() {
    this.sock.ev.on('messages.upsert', this.handleIncomingMessages.bind(this))
    this.sock.ev.on('messages.update', this.handleMessageUpdates.bind(this))
    this.sock.ev.on('message-receipt.update', this.handleMessageReceipts.bind(this))
    this.sock.ev.on('messages.reaction', this.handleMessageReactions.bind(this))
  }
  
  // Envio de mensagens
  async sendTextMessage(jid: string, text: string, options?: TextOptions) {
    const processedMessage = MessageProcessor.processOutgoingMessage({ text }, jid)
    
    // Salvar no banco antes de enviar
    await this.saveMessage(processedMessage)
    
    try {
      const result = await this.messageSender.sendText(jid, text, options)
      
      // Atualizar com ID real da mensagem
      await this.updateMessageStatus(processedMessage.id!, 'sent', result.key)
      
      return result
    } catch (error) {
      await this.updateMessageStatus(processedMessage.id!, 'failed')
      throw error
    }
  }
  
  async sendMediaMessage(jid: string, mediaType: MediaType, media: Buffer | string, options?: MediaOptions) {
    const content: MessageContent = {}
    content[mediaType] = media
    if (options?.caption) content.caption = options.caption
    
    const processedMessage = MessageProcessor.processOutgoingMessage(content, jid)
    await this.saveMessage(processedMessage)
    
    try {
      const result = await this.messageSender.sendMedia(jid, mediaType, media, options)
      await this.updateMessageStatus(processedMessage.id!, 'sent', result.key)
      return result
    } catch (error) {
      await this.updateMessageStatus(processedMessage.id!, 'failed')
      throw error
    }
  }
  
  // Interações
  async replyToMessage(jid: string, originalMessageId: string, replyText: string) {
    const originalMessage = await this.getMessageById(originalMessageId)
    if (!originalMessage) {
      throw new Error('Original message not found')
    }
    
    return this.messageInteractions.replyToMessage(jid, originalMessage.original, replyText)
  }
  
  async reactToMessage(jid: string, messageId: string, emoji: string) {
    const message = await this.getMessageById(messageId)
    if (!message) {
      throw new Error('Message not found')
    }
    
    const result = await this.reactionManager.addReaction(jid, message.key, emoji)
    
    // Atualizar reações localmente
    await this.updateMessageReactions(messageId, emoji, 'me')
    
    return result
  }
  
  async forwardMessage(originalMessageId: string, targetJids: string[]) {
    const originalMessage = await this.getMessageById(originalMessageId)
    if (!originalMessage) {
      throw new Error('Original message not found')
    }
    
    return this.forwardManager.forwardMessage(originalMessage.original, targetJids)
  }
  
  async editMessage(jid: string, messageId: string, newText: string) {
    const message = await this.getMessageById(messageId)
    if (!message) {
      throw new Error('Message not found')
    }
    
    const result = await this.messageEditor.editMessage(jid, message.key, newText)
    
    // Atualizar localmente
    await this.updateMessageText(messageId, newText, true)
    
    return result
  }
  
  async deleteMessage(jid: string, messageId: string, forEveryone: boolean) {
    const message = await this.getMessageById(messageId)
    if (!message) {
      throw new Error('Message not found')
    }
    
    if (forEveryone) {
      const result = await this.messageDeleter.deleteForEveryone(jid, message.key)
      await this.markMessageDeleted(messageId, true, true)
      return result
    } else {
      await this.messageDeleter.deleteForMe(message.key)
      await this.markMessageDeleted(messageId, false, true)
    }
  }
  
  async starMessage(messageId: string, starred: boolean = true) {
    return this.messageStarrer.starMessage({ id: messageId } as WAMessageKey, starred)
  }
  
  async pinMessage(jid: string, messageId: string) {
    const message = await this.getMessageById(messageId)
    if (!message) {
      throw new Error('Message not found')
    }
    
    const result = await this.messagePinner.pinMessage(jid, message.key)
    await this.updateMessagePinStatus(messageId, true)
    
    return result
  }
  
  // Event handlers
  private async handleIncomingMessages(upsert: any) {
    for (const message of upsert.messages) {
      const processedMessage = MessageProcessor.processIncomingMessage(
        message, 
        message.key.remoteJid
      )
      
      await this.saveMessage(processedMessage)
      
      // Emitir evento para interface
      this.emit('message:received', processedMessage)
    }
  }
  
  private async handleMessageUpdates(updates: any[]) {
    for (const update of updates) {
      const { key, update: messageUpdate } = update
      
      if (messageUpdate.status) {
        await this.updateMessageStatus(key.id, messageUpdate.status)
        this.emit('message:status-updated', { messageId: key.id, status: messageUpdate.status })
      }
      
      if (messageUpdate.message) {
        // Mensagem editada
        const newText = this.extractTextFromMessage(messageUpdate.message)
        if (newText) {
          await this.updateMessageText(key.id, newText, true)
          this.emit('message:edited', { messageId: key.id, newText })
        }
      }
      
      if (messageUpdate.messageStubType === 68) {
        // Mensagem deletada
        await this.markMessageDeleted(key.id, true, false)
        this.emit('message:deleted', { messageId: key.id, forEveryone: true })
      }
    }
  }
  
  private async handleMessageReactions(reactions: any[]) {
    for (const reaction of reactions) {
      const { key, reaction: reactionData } = reaction
      
      await this.updateMessageReactions(
        key.id,
        reactionData.text,
        reaction.key.participant || reaction.key.remoteJid
      )
      
      this.emit('message:reaction', {
        messageId: key.id,
        emoji: reactionData.text,
        userId: reaction.key.participant || reaction.key.remoteJid
      })
    }
  }
  
  // Database operations
  private async saveMessage(message: Partial<ProcessedMessage>) {
    return await database.messages.insertOne(message)
  }
  
  private async getMessageById(messageId: string): Promise<ProcessedMessage | null> {
    return await database.messages.findOne({ id: messageId })
  }
  
  private async updateMessageStatus(messageId: string, status: MessageStatus, key?: WAMessageKey) {
    const update: any = { status }
    if (key) update.key = key
    
    return await database.messages.updateOne(
      { id: messageId },
      { $set: update }
    )
  }
  
  private async updateMessageText(messageId: string, newText: string, edited: boolean) {
    return await database.messages.updateOne(
      { id: messageId },
      { 
        $set: { 
          text: newText, 
          edited,
          editedAt: edited ? new Date() : undefined
        }
      }
    )
  }
  
  private async markMessageDeleted(messageId: string, forEveryone: boolean, forMe: boolean) {
    const update: any = { deletedAt: new Date() }
    
    if (forEveryone) update.deleted = true
    if (forMe) update.deletedForMe = true
    
    return await database.messages.updateOne(
      { id: messageId },
      { $set: update }
    )
  }
  
  private async updateMessageReactions(messageId: string, emoji: string, userId: string) {
    // Implementar lógica de atualização de reações
    // Pode ser complexa dependendo de como você quer armazenar as reações
  }
  
  private async updateMessagePinStatus(messageId: string, pinned: boolean) {
    return await database.messages.updateOne(
      { id: messageId },
      { 
        $set: { 
          pinned,
          pinnedAt: pinned ? new Date() : null
        }
      }
    )
  }
  
  private extractTextFromMessage(message: any): string | null {
    if (message.conversation) return message.conversation
    if (message.extendedTextMessage) return message.extendedTextMessage.text
    return null
  }
}
```

---

## Limitações e Considerações

### Limitações do Baileys

#### 1. **Mensagens Interativas**
```
❌ Limitações:
- Botões e listas podem não funcionar em todos os clientes
- Suporte limitado para templates complexos
- Não há garantia de compatibilidade futura

✅ Alternativas:
- Usar mensagens de texto com numeração
- Implementar menu baseado em texto
- Usar quick replies simples
```

#### 2. **Funcionalidades Business API**
```
❌ Não suportado:
- Templates aprovados pelo WhatsApp
- Catálogo de produtos
- WhatsApp Pay
- Flows interativos

🟡 Suporte limitado:
- Botões simples (podem não funcionar)
- Listas básicas (instáveis)
```

#### 3. **Rate Limiting**
```
⚠️ Cuidados:
- Máximo ~1000 mensagens/dia por número
- Evitar spam ou comportamento automatizado
- Respeitar intervalos entre mensagens
- Monitorar sinais de rate limiting
```

### Considerações de Implementação

#### 1. **Armazenamento de Mídia**
```typescript
class MediaManager {
  async downloadAndStoreMedia(message: WAMessage): Promise<string> {
    const mediaMessage = this.extractMediaMessage(message)
    
    if (!mediaMessage?.url) {
      throw new Error('No media URL found')
    }
    
    // Download da mídia
    const mediaBuffer = await downloadMediaMessage(
      message,
      'buffer',
      {},
      {
        logger: console,
        reuploadRequest: this.sock.updateMediaMessage
      }
    )
    
    // Salvar em storage (S3, local, etc.)
    const mediaPath = await this.saveMediaToStorage(mediaBuffer, mediaMessage.mimetype)
    
    return mediaPath
  }
  
  private async saveMediaToStorage(buffer: Buffer, mimetype: string): Promise<string> {
    const extension = mime.extension(mimetype)
    const fileName = `${generateId()}.${extension}`
    const filePath = `media/${fileName}`
    
    // Salvar no sistema de arquivos ou cloud storage
    await fs.writeFile(path.join(MEDIA_DIR, fileName), buffer)
    
    return filePath
  }
}
```

#### 2. **Sincronização de Estado**
```typescript
class MessageSyncManager {
  async syncMessageHistory(jid: string, limit: number = 50) {
    // Buscar histórico do WhatsApp
    const messages = await this.sock.fetchMessageHistory(jid, limit)
    
    for (const message of messages) {
      const existing = await this.getMessageById(message.key.id!)
      
      if (!existing) {
        const processed = MessageProcessor.processIncomingMessage(message, jid)
        await this.saveMessage(processed)
      }
    }
  }
  
  async syncMessageStatus() {
    // Sincronizar status de mensagens pendentes
    const pendingMessages = await database.messages.find({
      status: { $in: ['sending', 'sent'] },
      direction: 'outbound'
    })
    
    for (const message of pendingMessages) {
      // Verificar status real no WhatsApp
      const currentStatus = await this.checkMessageStatus(message.key)
      
      if (currentStatus !== message.status) {
        await this.updateMessageStatus(message.id, currentStatus)
      }
    }
  }
}
```

#### 3. **Tratamento de Erros**
```typescript
class MessageErrorHandler {
  async handleSendError(error: Error, message: ProcessedMessage) {
    console.error('Message send error:', error)
    
    // Categorizar erro
    if (error.message.includes('rate limit')) {
      // Rate limiting - reagendar envio
      await this.scheduleRetry(message, 60000) // 1 minuto
    } else if (error.message.includes('not found')) {
      // Número não existe
      await this.markMessageFailed(message.id, 'invalid_number')
    } else if (error.message.includes('blocked')) {
      // Bloqueado pelo usuário
      await this.markMessageFailed(message.id, 'blocked')
    } else {
      // Erro genérico - tentar novamente
      await this.scheduleRetry(message, 5000) // 5 segundos
    }
  }
  
  private async scheduleRetry(message: ProcessedMessage, delayMs: number) {
    setTimeout(async () => {
      try {
        await this.retryMessage(message)
      } catch (error) {
        await this.handleSendError(error, message)
      }
    }, delayMs)
  }
  
  private async retryMessage(message: ProcessedMessage) {
    // Implementar lógica de retry
  }
  
  private async markMessageFailed(messageId: string, reason: string) {
    await database.messages.updateOne(
      { id: messageId },
      { 
        $set: { 
          status: 'failed',
          failureReason: reason,
          failedAt: new Date()
        }
      }
    )
  }
}
```

---

## Melhores Práticas

### 1. **Performance e Otimização**

#### Lazy Loading de Mensagens
```typescript
class MessageLoader {
  async loadMessages(chatId: string, page: number = 0, limit: number = 50) {
    const offset = page * limit
    
    return await database.messages.find({ chatId })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()
  }
  
  async loadOlderMessages(chatId: string, beforeTimestamp: Date, limit: number = 50) {
    return await database.messages.find({
      chatId,
      timestamp: { $lt: beforeTimestamp }
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray()
  }
}
```

#### Cache de Mensagens
```typescript
class MessageCache {
  private cache = new Map<string, ProcessedMessage[]>()
  private readonly MAX_CACHE_SIZE = 1000
  
  getCachedMessages(chatId: string): ProcessedMessage[] | null {
    return this.cache.get(chatId) || null
  }
  
  setCachedMessages(chatId: string, messages: ProcessedMessage[]) {
    // Limitar tamanho do cache
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(chatId, messages)
  }
  
  addMessageToCache(chatId: string, message: ProcessedMessage) {
    const cached = this.cache.get(chatId) || []
    cached.unshift(message) // Adicionar no início
    
    // Limitar número de mensagens em cache por chat
    if (cached.length > 100) {
      cached.splice(100)
    }
    
    this.cache.set(chatId, cached)
  }
}
```

### 2. **Segurança e Validação**

#### Validação de Conteúdo
```typescript
class MessageValidator {
  validateTextMessage(text: string): ValidationResult {
    const errors: string[] = []
    
    // Verificar tamanho
    if (text.length > 4096) {
      errors.push('Message too long (max 4096 characters)')
    }
    
    // Verificar conteúdo suspeito
    if (this.containsSpam(text)) {
      errors.push('Message contains spam content')
    }
    
    // Verificar links maliciosos
    if (this.containsMaliciousLinks(text)) {
      errors.push('Message contains suspicious links')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
  
  validateMediaMessage(file: File): ValidationResult {
    const errors: string[] = []
    
    // Verificar tamanho
    const maxSize = 16 * 1024 * 1024 // 16MB
    if (file.size > maxSize) {
      errors.push('File too large (max 16MB)')
    }
    
    // Verificar tipo
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif',
      'video/mp4', 'video/avi',
      'audio/mp3', 'audio/wav', 'audio/ogg',
      'application/pdf', 'application/msword'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
  
  private containsSpam(text: string): boolean {
    const spamPatterns = [
      /click here/i,
      /free money/i,
      /urgent/i,
      // Adicionar mais padrões
    ]
    
    return spamPatterns.some(pattern => pattern.test(text))
  }
  
  private containsMaliciousLinks(text: string): boolean {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const urls = text.match(urlRegex) || []
    
    // Verificar URLs contra lista de domínios maliciosos
    return urls.some(url => this.isMaliciousDomain(url))
  }
  
  private isMaliciousDomain(url: string): boolean {
    // Implementar verificação contra lista de domínios maliciosos
    return false
  }
}
```

### 3. **Monitoramento e Analytics**

#### Métricas de Mensagens
```typescript
class MessageAnalytics {
  async trackMessageSent(message: ProcessedMessage) {
    await analytics.track('message_sent', {
      chatId: message.chatId,
      type: message.type,
      hasMedia: !!message.mediaUrl,
      hasCaption: !!message.caption,
      isReply: !!message.quotedMessage,
      hasMentions: (message.mentions?.length || 0) > 0
    })
  }
  
  async trackMessageReceived(message: ProcessedMessage) {
    await analytics.track('message_received', {
      chatId: message.chatId,
      type: message.type,
      hasMedia: !!message.mediaUrl,
      isReply: !!message.quotedMessage
    })
  }
  
  async trackInteraction(type: string, messageId: string) {
    await analytics.track('message_interaction', {
      type, // 'reply', 'react', 'forward', 'edit', 'delete', 'star'
      messageId
    })
  }
  
  async generateMessageReport(chatId: string, period: 'day' | 'week' | 'month') {
    const startDate = this.getStartDate(period)
    
    const stats = await database.messages.aggregate([
      {
        $match: {
          chatId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgLength: { $avg: { $strLenCP: '$text' } }
        }
      }
    ]).toArray()
    
    return {
      period,
      chatId,
      stats,
      generatedAt: new Date()
    }
  }
}
```

### 4. **Backup e Recuperação**

#### Backup de Mensagens
```typescript
class MessageBackup {
  async backupChatMessages(chatId: string): Promise<string> {
    const messages = await database.messages.find({ chatId })
      .sort({ timestamp: 1 })
      .toArray()
    
    const backup = {
      chatId,
      exportedAt: new Date(),
      messageCount: messages.length,
      messages: messages.map(msg => ({
        id: msg.id,
        type: msg.type,
        text: msg.text,
        timestamp: msg.timestamp,
        senderId: msg.senderId,
        senderName: msg.senderName,
        // Não incluir dados binários no backup
        hasMedia: !!msg.mediaUrl,
        mediaType: msg.type !== 'text' ? msg.type : undefined
      }))
    }
    
    const backupData = JSON.stringify(backup, null, 2)
    const backupPath = `backups/chat_${chatId}_${Date.now()}.json`
    
    await fs.writeFile(backupPath, backupData)
    
    return backupPath
  }
  
  async restoreFromBackup(backupPath: string): Promise<void> {
    const backupData = await fs.readFile(backupPath, 'utf-8')
    const backup = JSON.parse(backupData)
    
    for (const message of backup.messages) {
      const existing = await database.messages.findOne({ id: message.id })
      
      if (!existing) {
        await database.messages.insertOne({
          ...message,
          restored: true,
          restoredAt: new Date()
        })
      }
    }
  }
}
```

---

## Conclusão

Este guia fornece uma implementação completa das funcionalidades de mensagens do WhatsApp usando o Baileys. Os principais pontos são:

### ✅ **Funcionalidades Totalmente Suportadas**
- Envio de texto, mídia, localização, contatos
- Reply, reactions, edit, delete
- Pin messages e mentions

### 🟡 **Funcionalidades Parcialmente Suportadas**
- Mensagens interativas (botões/listas)
- Forward (implementação customizada)
- Star messages (implementação local)

### 🔧 **Implementação Recomendada**
- Usar padrões de design robustos
- Implementar cache e otimizações
- Adicionar validação e segurança
- Monitorar performance e erros

### 📱 **Interface de Usuário**
- Componentes modulares e reutilizáveis
- Context menus e interações intuitivas
- Lazy loading e performance otimizada
- Experiência similar ao WhatsApp oficial

Esta implementação permite criar uma aplicação completa de mensagens com todas as funcionalidades principais do WhatsApp, mantendo compatibilidade com o protocolo oficial e oferecendo uma experiência de usuário rica e intuitiva.