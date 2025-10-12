# Conexão WhatsApp com Baileys - Guia Funcional

## Visão Geral

O Baileys é uma biblioteca Node.js que permite conectar-se ao WhatsApp Web através de WebSockets, fornecendo uma interface programática para interagir com a plataforma de mensagens. Este documento explica como funciona o processo de conexão e as principais ações disponíveis.

## Processo de Conexão

### 1. Inicialização da Conexão

O processo de conexão começa com a criação de um socket usando a função `makeWASocket()`:

```typescript
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'

const { state, saveCreds } = await useMultiFileAuthState('auth_info')
const sock = makeWASocket({
    version: [2, 3000, 1023223821],
    logger: logger,
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
    }
})
```

### 2. Estados de Conexão

O Baileys gerencia diferentes estados de conexão que são comunicados através do evento `connection.update`:

- **`connecting`**: Iniciando a conexão
- **`open`**: Conexão estabelecida e autenticada
- **`close`**: Conexão fechada (pode ser temporária ou permanente)
- **`qr`**: Aguardando escaneamento do QR Code

### 3. Autenticação

#### Primeira Conexão (QR Code)
1. O socket emite um evento `connection.update` com `qr` contendo o código QR
2. O usuário escaneia o QR Code com o WhatsApp
3. Após o escaneamento, o socket recebe confirmação de pareamento
4. As credenciais são salvas automaticamente

#### Reconexão
1. O Baileys verifica se existem credenciais salvas
2. Se existirem, tenta reconectar automaticamente
3. Se as credenciais forem válidas, a conexão é estabelecida sem QR Code

### 4. Gerenciamento de Sessão

O Baileys mantém o estado da sessão através de:
- **Credenciais**: Informações de autenticação (chaves, tokens, etc.)
- **Chaves de Sinal**: Chaves criptográficas para comunicação segura
- **Pre-keys**: Chaves temporárias para criptografia de ponta a ponta

## Principais Ações Disponíveis

### 1. Conectar
```typescript
// A conexão é iniciada automaticamente ao criar o socket
const sock = makeWASocket(config)

// Aguardar conexão estar pronta
await sock.waitForConnectionUpdate(update => update.connection === 'open')
```

### 2. Desconectar
```typescript
// Desconexão temporária
sock.end()

// Logout completo (remove credenciais)
await sock.logout('Logout intencional')
```

### 3. Reconectar
```typescript
// Reconexão automática em caso de falha
sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
        if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
            // Reconectar automaticamente
            startSock()
        }
    }
})
```

### 4. Gerenciar QR Code
```typescript
// Escutar por QR Code
sock.ev.on('connection.update', ({ qr }) => {
    if (qr) {
        console.log('QR Code gerado:', qr)
        // Exibir QR Code para o usuário escanear
    }
})
```

### 5. Verificar Status da Conexão
```typescript
// Verificar se está conectado
if (sock.user) {
    console.log('Conectado como:', sock.user.name)
}

// Aguardar estado específico
await sock.waitForConnectionUpdate(update => 
    update.connection === 'open' && update.qr === undefined
)
```

## Eventos de Conexão

### Eventos Principais

1. **`connection.update`**: Mudanças no estado da conexão
2. **`creds.update`**: Atualizações nas credenciais
3. **`messages.upsert`**: Novas mensagens recebidas
4. **`messages.update`**: Atualizações em mensagens existentes

### Exemplo de Uso dos Eventos

```typescript
sock.ev.process(async (events) => {
    // Atualização de conexão
    if (events['connection.update']) {
        const { connection, lastDisconnect } = events['connection.update']
        
        if (connection === 'open') {
            console.log('Conectado com sucesso!')
        } else if (connection === 'close') {
            console.log('Conexão fechada:', lastDisconnect?.error)
        }
    }
    
    // Credenciais atualizadas
    if (events['creds.update']) {
        await saveCreds() // Salvar credenciais
    }
    
    // Novas mensagens
    if (events['messages.upsert']) {
        const { messages } = events['messages.upsert']
        console.log('Mensagens recebidas:', messages.length)
    }
})
```

## Configurações Importantes

### Timeouts e Retry
```typescript
const sock = makeWASocket({
    connectTimeoutMs: 20000,        // Timeout de conexão
    keepAliveIntervalMs: 30000,     // Intervalo de keep-alive
    defaultQueryTimeoutMs: 60000,   // Timeout de queries
    maxMsgRetryCount: 5,            // Máximo de tentativas de reenvio
    retryRequestDelayMs: 250        // Delay entre tentativas
})
```

### Cache e Performance
```typescript
const sock = makeWASocket({
    mediaCache: new NodeCache(),           // Cache de mídia
    msgRetryCounterCache: new NodeCache(), // Cache de retry
    userDevicesCache: new NodeCache(),     // Cache de dispositivos
    generateHighQualityLinkPreview: true   // Preview de links
})
```

## Tratamento de Erros

### Tipos de Erro Comuns

1. **`DisconnectReason.connectionClosed`**: Conexão fechada inesperadamente
2. **`DisconnectReason.loggedOut`**: Usuário deslogado (credenciais inválidas)
3. **`DisconnectReason.timedOut`**: Timeout na conexão
4. **`DisconnectReason.connectionLost`**: Perda de conexão

### Estratégias de Recuperação

```typescript
sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
        
        if (shouldReconnect) {
            console.log('Reconectando em 5 segundos...')
            setTimeout(() => startSock(), 5000)
        } else {
            console.log('Logout detectado. Removendo credenciais.')
        }
    }
})
```

## Boas Práticas

### 1. Gerenciamento de Estado
- Sempre salve as credenciais após atualizações
- Use cache para melhorar performance
- Implemente retry logic para operações críticas

### 2. Tratamento de Eventos
- Use `sock.ev.process()` para processar eventos em lote
- Implemente handlers específicos para cada tipo de evento
- Sempre trate erros de forma adequada

### 3. Performance
- Configure timeouts apropriados para seu ambiente
- Use cache para dados frequentemente acessados
- Monitore o uso de memória e CPU

### 4. Segurança
- Mantenha as credenciais seguras
- Use HTTPS para comunicação
- Implemente rate limiting para evitar spam

## Exemplo Completo

```typescript
import makeWASocket, { 
    useMultiFileAuthState, 
    DisconnectReason,
    makeCacheableSignalKeyStore 
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'

const startSock = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')
    
    const sock = makeWASocket({
        version: [2, 3000, 1023223821],
        logger: console,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, console)
        },
        connectTimeoutMs: 20000,
        keepAliveIntervalMs: 30000
    })
    
    // Processar eventos
    sock.ev.process(async (events) => {
        if (events['connection.update']) {
            const { connection, lastDisconnect } = events['connection.update']
            
            if (connection === 'open') {
                console.log('✅ Conectado ao WhatsApp!')
            } else if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                
                if (shouldReconnect) {
                    console.log('🔄 Reconectando...')
                    setTimeout(() => startSock(), 5000)
                } else {
                    console.log('❌ Logout detectado')
                }
            }
        }
        
        if (events['creds.update']) {
            await saveCreds()
        }
        
        if (events['messages.upsert']) {
            console.log('📨 Nova mensagem recebida')
        }
    })
    
    return sock
}

// Iniciar conexão
startSock().catch(console.error)
```

Este guia funcional fornece uma visão abrangente de como usar o Baileys para conectar-se ao WhatsApp, gerenciar a conexão e implementar as principais funcionalidades necessárias para uma aplicação robusta.