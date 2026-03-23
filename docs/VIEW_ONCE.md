# Mensagens View-Once (Visualização Única) — Guia de Implementação

**Data:** 2026-03-23
**Versão:** 1.0

---

## 1. O que é View-Once

Mensagem de visualização única é um tipo especial de mídia (imagem, vídeo ou áudio) que o destinatário pode abrir apenas uma vez. Após abrir, o conteúdo some permanentemente.

**Comportamento em cada dispositivo após envio via API:**

| Dispositivo | O que aparece |
|---|---|
| Destinatário (Android/iOS) | Recebe a mídia com ícone de olhinho — pode abrir uma vez |
| Android principal do remetente | Mostra na conversa que a mensagem foi enviada (ícone de olhinho) |
| WA Web do remetente | "Aguardando mensagem. Abra o WhatsApp no seu celular." |

> **Nota:** A mensagem "Aguardando mensagem..." no WA Web é o comportamento correto e esperado quando o envio vem de um companion (API). É uma limitação do protocolo WhatsApp — o servidor só permite que o celular principal notifique companions com o conteúdo da view-once.

---

## 2. Como Enviar via API

### 2.1 Imagem

```bash
curl -X POST https://sua-api.com/v1/messages/send_image \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "nome-da-instancia",
    "to": "5511999999999",
    "caption": "Olha só isso!",
    "imageUrl": "https://exemplo.com/foto.jpg",
    "viewOnce": true
  }'
```

**Resposta de sucesso:**
```json
{ "ok": true }
```

### 2.2 Vídeo

```bash
curl -X POST https://sua-api.com/v1/messages/send_video \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "nome-da-instancia",
    "to": "5511999999999",
    "caption": "Assista uma vez",
    "videoUrl": "https://exemplo.com/video.mp4",
    "viewOnce": true
  }'
```

### 2.3 Áudio

```bash
curl -X POST https://sua-api.com/v1/messages/send_audio \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "nome-da-instancia",
    "to": "5511999999999",
    "audioUrl": "https://exemplo.com/audio.ogg",
    "ptt": false,
    "viewOnce": true
  }'
```

### 2.4 Usando Base64 (sem URL pública)

```bash
curl -X POST https://sua-api.com/v1/messages/send_image \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "nome-da-instancia",
    "to": "5511999999999",
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgAB...",
    "viewOnce": true
  }'
```

---

## 3. Como Receber via Webhook

Quando um contato envia uma mensagem de visualização única para o número conectado na API, o webhook recebe o evento com `key.isViewOnce = true`.

### 3.1 Estrutura do evento recebido

```json
{
  "event": "messages.upsert",
  "instance": "nome-da-instancia",
  "data": {
    "messages": [
      {
        "key": {
          "remoteJid": "5511999999999@s.whatsapp.net",
          "fromMe": false,
          "id": "3EB0ABCDEF123456",
          "isViewOnce": true
        },
        "message": {
          "viewOnceMessageV2": {
            "message": {
              "imageMessage": {
                "url": "https://mmg.whatsapp.net/...",
                "mimetype": "image/jpeg",
                "mediaKey": "base64...",
                "fileEncSha256": "base64...",
                "directPath": "/v/...",
                "viewOnce": true
              }
            }
          }
        },
        "messageTimestamp": 1742700000,
        "pushName": "João Silva"
      }
    ],
    "type": "notify"
  }
}
```

### 3.2 Como identificar que é view-once

O campo principal para identificar é `key.isViewOnce = true`. Existem dois caminhos para confirmar:

```javascript
function isViewOnce(msg) {
  // Caminho 1: flag direta (mais simples)
  if (msg.key?.isViewOnce) return true

  // Caminho 2: verificar o wrapper da mensagem
  const inner =
    msg.message?.viewOnceMessageV2?.message ||
    msg.message?.viewOnceMessage?.message ||
    msg.message?.viewOnceMessageV2Extension?.message

  return !!(
    inner?.imageMessage?.viewOnce ||
    inner?.videoMessage?.viewOnce ||
    inner?.audioMessage?.viewOnce
  )
}
```

### 3.3 Como acessar a mídia

```javascript
function getViewOnceMedia(msg) {
  const inner =
    msg.message?.viewOnceMessageV2?.message ||
    msg.message?.viewOnceMessage?.message ||
    msg.message?.viewOnceMessageV2Extension?.message

  if (!inner) return null

  if (inner.imageMessage) return { type: 'image', media: inner.imageMessage }
  if (inner.videoMessage) return { type: 'video', media: inner.videoMessage }
  if (inner.audioMessage) return { type: 'audio', media: inner.audioMessage }

  return null
}

// Uso:
const media = getViewOnceMedia(msg)
if (media) {
  console.log(`View-once ${media.type}`)
  console.log('URL:', media.media.url)
  console.log('DirectPath:', media.media.directPath)
  console.log('MediaKey:', media.media.mediaKey) // necessário para download
}
```

---

## 4. Como Exibir numa Ferramenta (Frontend/CRM)

### 4.1 Lógica de detecção e exibição

```javascript
function renderMessage(msg) {
  if (!isViewOnce(msg)) {
    // Renderizar mensagem normal
    return renderNormalMessage(msg)
  }

  const media = getViewOnceMedia(msg)
  if (!media) return

  // Verificar se já foi aberta (controle local da ferramenta)
  const alreadyOpened = localStorage.getItem(`vo_${msg.key.id}`)

  if (alreadyOpened) {
    // Mostrar placeholder de "já visualizado"
    return renderViewOncePlaceholder(media.type, msg.key.fromMe)
  }

  if (msg.key.fromMe) {
    // Mensagem enviada por mim — nunca mostrar conteúdo
    return renderSentViewOnce(media.type)
  }

  // Mensagem recebida — mostrar botão para "abrir uma vez"
  return renderViewOnceButton(media.type, msg)
}
```

### 4.2 Componente de exibição — mensagem recebida

```javascript
function renderViewOnceButton(type, msg) {
  const icons = { image: '📷', video: '🎥', audio: '🎵' }
  const labels = { image: 'Foto', video: 'Vídeo', áudio: 'Áudio' }

  return `
    <div class="view-once-bubble received">
      <span class="view-once-icon">${icons[type]}</span>
      <span class="view-once-label">${labels[type]} de visualização única</span>
      <button onclick="openViewOnce('${msg.key.id}', '${type}')">
        Abrir
      </button>
    </div>
  `
}

async function openViewOnce(msgId, type) {
  // 1. Marcar como aberta ANTES de mostrar (só uma chance)
  localStorage.setItem(`vo_${msgId}`, '1')

  // 2. Baixar e mostrar a mídia
  const mediaUrl = await downloadViewOnceMedia(msgId)
  showMedia(type, mediaUrl)

  // 3. Após fechar/visualizar, substituir pelo placeholder
  onMediaClosed(() => {
    replaceWithPlaceholder(msgId, type)
  })
}
```

### 4.3 Componente de exibição — mensagem enviada

```javascript
function renderSentViewOnce(type) {
  const labels = { image: 'Foto', video: 'Vídeo', audio: 'Áudio' }
  return `
    <div class="view-once-bubble sent">
      <span class="view-once-icon">👁️</span>
      <span>${labels[type]} de visualização única</span>
      <span class="view-once-status">Enviada</span>
    </div>
  `
}
```

### 4.4 Placeholder após visualização

```javascript
function renderViewOncePlaceholder(type, fromMe) {
  const labels = { image: 'foto', video: 'vídeo', audio: 'áudio' }
  const text = fromMe
    ? `Você enviou uma ${labels[type]} de visualização única`
    : `${labels[type]} de visualização única aberta`

  return `
    <div class="view-once-bubble placeholder">
      <span class="view-once-icon">🚫</span>
      <span>${text}</span>
    </div>
  `
}
```

### 4.5 CSS sugerido

```css
.view-once-bubble {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 280px;
}

.view-once-bubble.received {
  background: #f0f0f0;
  color: #333;
}

.view-once-bubble.sent {
  background: #dcf8c6;
  color: #333;
  align-self: flex-end;
}

.view-once-bubble.placeholder {
  background: #e8e8e8;
  color: #999;
  font-style: italic;
}

.view-once-bubble button {
  background: #25d366;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
}
```

---

## 5. Código Implementado na API

### 5.1 Geração da mensagem — `src/Utils/messages.ts`

Quando `viewOnce: true` é passado, a mídia é encapsulada no wrapper moderno `viewOnceMessageV2` (campo 55 do proto) e o flag `viewOnce=true` é setado na mídia interna:

```typescript
if (hasOptionalProperty(message, 'viewOnce') && !!message.viewOnce) {
    // Seta viewOnce=true na mensagem de mídia interna
    if (m.imageMessage) m.imageMessage.viewOnce = true
    else if (m.videoMessage) m.videoMessage.viewOnce = true
    else if (m.audioMessage) m.audioMessage.viewOnce = true
    // Usa viewOnceMessageV2 (campo 55) — formato atual do WA
    m = { viewOnceMessageV2: { message: m } }
}
```

### 5.2 Envio — `src/Socket/messages-send.ts`

**Detecção de view-once real** (não confunde com botões/listas que também usam o wrapper `viewOnceMessage`):

```typescript
// Detecta view-once real pela flag viewOnce na mídia interna.
// viewOnceMessage* wrappers são também usados por botões/listas/carrosséis
// (que carregam interactiveMessage dentro) — esses NÃO têm viewOnce=true na mídia.
const viewOnceInner =
    message.viewOnceMessageV2?.message ||
    message.viewOnceMessage?.message ||
    message.viewOnceMessageV2Extension?.message
const isViewOnceMsg = !!(
    viewOnceInner?.imageMessage?.viewOnce ||
    viewOnceInner?.videoMessage?.viewOnce ||
    viewOnceInner?.audioMessage?.viewOnce
)

// Para view-once: DSM enviado apenas para o celular principal (device=0).
// Companions (device>0) são omitidos — o servidor WA gera
// <unavailable type="view_once"/> automaticamente para eles.
const viewOnceMeRecipients = isViewOnceMsg
    ? meRecipients.filter(jid => !jidDecode(jid)?.device)
    : meRecipients

// assertSessions apenas para quem vai realmente receber
await assertSessions([...viewOnceMeRecipients, ...otherRecipients])

const [meNodes, otherNodes] = await Promise.all([
    createParticipantNodes(viewOnceMeRecipients, meMsg || message, extraAttrs),
    createParticipantNodes(otherRecipients, message, extraAttrs)
])
participants.push(...meNodes)
participants.push(...otherNodes)

// phash recalculado com os participantes reais
const phashRecipients = isViewOnceMsg
    ? [...viewOnceMeRecipients, ...otherRecipients]
    : [...meRecipients, ...otherRecipients]
if (phashRecipients.length > 0) {
    extraAttrs['phash'] = generateParticipantHashV2(phashRecipients)
}
```

**`getMediaType()` — garante que vídeo e áudio view-once sejam entregues:**

```typescript
const getMediaType = (message: proto.IMessage) => {
    // Desencapsula wrapper view-once antes de verificar o tipo de mídia.
    // Sem isso, message.videoMessage e message.audioMessage são undefined
    // (estão dentro do wrapper) e o atributo mediatype ficaria ausente no
    // enc node — o servidor WA descarta silenciosamente vídeo/áudio view-once.
    const inner =
        message.viewOnceMessage?.message ||
        message.viewOnceMessageV2?.message ||
        message.viewOnceMessageV2Extension?.message
    if (inner) {
        return getMediaType(inner)
    }

    if (message.imageMessage) return 'image'
    else if (message.videoMessage) return 'video'
    // ...
}
```

### 5.3 Recepção — `src/Utils/decode-wa-message.ts`

Quando a API recebe uma view-once como companion (linked device), o servidor envia dois stanzas:

- **Stanza 1** (`enc`): conteúdo completo com metadados da mídia
- **Stanza 2** (`unavailable type="view_once"`): sinal de sync

O stanza 1 é detectado e marcado corretamente:

```typescript
// Detecta view-once na stanza 1 recebida por linked device.
// O wrapper viewOnceMessage também é usado por mensagens interativas
// (interactiveMessage, listMessage) — esses NÃO têm viewOnce=true na mídia.
const viewOnceInner =
    msg.viewOnceMessage?.message ||
    msg.viewOnceMessageV2?.message ||
    msg.viewOnceMessageV2Extension?.message
if (
    viewOnceInner?.imageMessage?.viewOnce ||
    viewOnceInner?.videoMessage?.viewOnce ||
    viewOnceInner?.audioMessage?.viewOnce
) {
    fullMessage.key.isViewOnce = true
}
```

---

## 6. Fluxo Completo

```
API envia view-once para destinatário
│
├── Protobuf gerado:
│   viewOnceMessageV2 {
│     message {
│       imageMessage { viewOnce: true, url, mediaKey, ... }
│     }
│   }
│
├── Stanza enviado ao servidor WA:
│   <message to="destinatario@s.whatsapp.net" type="media">
│     <enc type="pkmsg">...viewOnceMessageV2 cifrado...</enc>   ← para o destinatário
│     <participants>
│       <to jid="meu-numero:0@lid">                             ← celular principal
│         <enc type="msg">...DSM{viewOnceMessageV2}...</enc>
│       </to>
│       <!-- device>0 omitidos — servidor gera unavailable -->
│     </participants>
│   </message>
│
└── Distribuição pelo servidor:
    ├── Destinatário      → recebe enc → abre uma vez ✅
    ├── Celular principal → recebe DSM → mostra "você enviou" ✅
    └── WA Web            → recebe <unavailable> → "Aguardando..." ✅


Destinatário envia view-once de volta para a API
│
├── Stanza recebido pela API (stanza 1 — enc com conteúdo):
│   <message from="destinatario@s.whatsapp.net" type="media">
│     <enc type="msg">...viewOnceMessageV2 cifrado...</enc>
│   </message>
│
├── decode-wa-message.ts:
│   └── Descriptografa → detecta viewOnce=true → seta key.isViewOnce=true
│
├── Stanza recebido (stanza 2 — unavailable, ignorado):
│   <message from="...">
│     <unavailable type="view_once"/>
│   </message>
│
└── Webhook emitido:
    messages.upsert → msg.key.isViewOnce = true ✅
```

---

## 7. Limitações

| Situação | Comportamento | Motivo |
|---|---|---|
| WA Web do remetente | "Aguardando mensagem. Abra no celular." | Servidor WA só aceita `<unavailable>` vindo do celular principal, não de companions |
| View-once de documento/sticker | Não suportado | Limitação do protocolo WA — só imagem, vídeo e áudio |
| `error_479` nos logs | Normal, não é erro | TcToken é atualizado após o envio de view-once |
| Companion não consegue abrir | Por design | O conteúdo não é entregue para linked devices |

---

## 8. Checklist de Validação

**Envio:**
- [ ] Destinatário recebe com ícone de olhinho
- [ ] Destinatário consegue abrir a mídia
- [ ] Após abrir, a mídia some
- [ ] Celular principal do remetente mostra "você enviou" com ícone de olhinho
- [ ] WA Web do remetente mostra "Aguardando mensagem..."
- [ ] Funciona para imagem, vídeo e áudio
- [ ] Logs mostram `📤 Message sent` (error_479 é normal)

**Recepção:**
- [ ] Webhook recebe `key.isViewOnce = true`
- [ ] `viewOnceMessageV2.message.imageMessage` (ou video/audio) está presente
- [ ] API não crasha ao receber view-once de outro dispositivo
- [ ] Mensagem interativa (botão/lista) enviada após view-once não é afetada
