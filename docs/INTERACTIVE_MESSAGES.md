# Mensagens Interativas — Guia Completo

Guia de referência para envio e consumo de todos os tipos de mensagens interativas suportados pela API.

---

## Compatibilidade por Plataforma

| Tipo | Android | iOS | WA Web |
|---|---|---|---|
| Menu Texto | ✅ | ✅ | ✅ |
| Botões Quick Reply | ✅ | ✅ | ✅ |
| Botões CTA (URL / Copy / Call) | ✅ | ✅ | ✅ |
| Lista Dropdown | ✅ | ✅ | ✅ |
| Enquete/Poll | ✅ | ✅ | ✅ |
| Carrossel com Imagens | ✅ | ✅ | ✅ |

> **Nota:** Todos os tipos exigem conta **WhatsApp Business** ativa e **não-hosted** (registrada via QR/pair code). Contas hosted (Meta Business Cloud API) podem ter restrições de entrega de mensagens interativas impostas pelo servidor WA.

---

## Índice

1. [Menu Texto](#1-menu-texto)
2. [Botões Quick Reply](#2-botões-quick-reply)
3. [Botões CTA — URL, Copy, Call](#3-botões-cta--url-copy-call)
4. [Lista Dropdown](#4-lista-dropdown)
5. [Enquete / Poll](#5-enquete--poll)
6. [Apenas Botões Reply sem CTA](#6-apenas-botões-reply-sem-cta)
7. [Apenas CTAs sem Quick Reply](#7-apenas-ctas-sem-quick-reply)
8. [Carrossel com Imagens](#8-carrossel-com-imagens)
9. [Como Consumir Respostas via Webhook](#9-como-consumir-respostas-via-webhook)
10. [Limites e Restrições](#10-limites-e-restrições)

---

## 1. Menu Texto

Envia uma mensagem de texto simples com uma lista numerada de opções. Funciona em todas as plataformas sem binary nodes.

### Curl

```bash
curl -X POST https://sua-api.com/v1/messages/send_menu \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "minha-instancia",
    "to": "5511900000001",
    "title": "Menu de Opções",
    "text": "Escolha uma opção:",
    "options": ["Opção 1", "Opção 2", "Opção 3"],
    "footer": "Responda com o número"
  }'
```

### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `instance` | string | ✅ | Nome da instância conectada |
| `to` | string | ✅ | Número do destinatário (DDI+DDD+número) |
| `title` | string | ❌ | Título do menu |
| `text` | string | ✅ | Texto da mensagem |
| `options` | string[] | ✅ | Lista de opções (sem limite fixo) |
| `footer` | string | ❌ | Texto de rodapé |

### Resposta da API

```json
{ "ok": true }
```

### Como o destinatário vê

O usuário recebe uma mensagem de texto com as opções numeradas e responde digitando o número correspondente. Não há interatividade nativa — a resposta chega como mensagem de texto comum.

---

## 2. Botões Quick Reply

Botões de resposta rápida que o usuário toca para selecionar. Testado com até **16 botões**. Renderiza nativamente em Android, iOS e WA Web.

### Curl

```bash
curl -X POST https://sua-api.com/v1/messages/send_buttons_helpers \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "minha-instancia",
    "to": "5511900000001",
    "text": "👋 Olá! Como posso ajudar?",
    "footer": "Atendimento 24h",
    "buttons": [
      {"id": "vendas",      "text": "🛒 Fazer Pedido"},
      {"id": "suporte",     "text": "🔧 Suporte Técnico"},
      {"id": "financeiro",  "text": "💰 Financeiro"},
      {"id": "comercial",   "text": "📊 Comercial"},
      {"id": "contabil",    "text": "📋 Contábil"},
      {"id": "rh",          "text": "👥 Recursos Humanos"},
      {"id": "secretaria",  "text": "📞 Secretaria"},
      {"id": "diplomas",    "text": "🎓 Diplomas"},
      {"id": "diretoria",   "text": "🏛️ Diretoria"},
      {"id": "compliance",  "text": "✅ Compliance"},
      {"id": "juridico",    "text": "⚖️ Jurídico"},
      {"id": "social",      "text": "🤝 Ass. Social"},
      {"id": "contratos",   "text": "📄 Contratos"},
      {"id": "ti",          "text": "💻 Tecnologia da Informação"},
      {"id": "assessoria",  "text": "📣 Assessoria"},
      {"id": "voip",        "text": "📡 VOIP"}
    ]
  }'
```

### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `instance` | string | ✅ | Nome da instância |
| `to` | string | ✅ | Número do destinatário |
| `text` | string | ✅ | Texto principal |
| `footer` | string | ❌ | Rodapé |
| `buttons` | array | ✅ | Lista de botões (ver abaixo) |
| `buttons[].id` | string | ✅ | ID do botão (retornado no webhook) |
| `buttons[].text` | string | ✅ | Texto exibido no botão |

### Webhook recebido ao clicar

```json
{
  "event": "messages.upsert",
  "data": {
    "messages": [{
      "key": { "remoteJid": "5511900000001@s.whatsapp.net", "fromMe": false },
      "message": {
        "interactiveResponseMessage": {
          "body": { "text": "🛒 Fazer Pedido" },
          "nativeFlowResponseMessage": {
            "name": "quick_reply",
            "paramsJson": "{\"id\":\"vendas\"}"
          }
        }
      }
    }]
  }
}
```

### Como ler a resposta

```javascript
function parseButtonReply(msg) {
  const interactive = msg.message?.interactiveResponseMessage
  if (!interactive) return null

  const params = JSON.parse(
    interactive.nativeFlowResponseMessage?.paramsJson || '{}'
  )
  return {
    buttonId: params.id,
    buttonText: interactive.body?.text
  }
}

// Exemplo:
// { buttonId: 'vendas', buttonText: '🛒 Fazer Pedido' }
```

---

## 3. Botões CTA — URL, Copy, Call

Botões de ação especiais: abrir URL, copiar código (PIX, cupom, etc.) e ligar. Podem ser combinados na mesma mensagem.

### Curl — Combinação URL + Copy + Call

```bash
curl -X POST https://sua-api.com/v1/messages/send_interactive_helpers \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "minha-instancia",
    "to": "5511900000001",
    "text": "💳 Pagamento via PIX\nValor: R$ 150,00\nPedido: #12345",
    "footer": "Obrigado pela preferência!",
    "buttons": [
      {
        "type": "call",
        "text": "📞 Ligar Suporte",
        "phoneNumber": "+5511900000002"
      },
      {
        "type": "copy",
        "text": "📋 Copiar Chave PIX",
        "copyCode": "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000"
      },
      {
        "type": "url",
        "text": "🔗 Ver Pedido",
        "url": "https://sualoja.com.br/pedido/12345"
      }
    ]
  }'
```

### Parâmetros de cada tipo de botão

**Tipo `url`:**
| Campo | Tipo | Descrição |
|---|---|---|
| `type` | `"url"` | Tipo do botão |
| `text` | string | Texto do botão |
| `url` | string | URL a abrir (http/https) |

**Tipo `copy`:**
| Campo | Tipo | Descrição |
|---|---|---|
| `type` | `"copy"` | Tipo do botão |
| `text` | string | Texto do botão |
| `copyCode` | string | Texto copiado ao clicar |

**Tipo `call`:**
| Campo | Tipo | Descrição |
|---|---|---|
| `type` | `"call"` | Tipo do botão |
| `text` | string | Texto do botão |
| `phoneNumber` | string | Número a ligar (com +DDI) |

### Webhook recebido ao clicar em URL

```json
{
  "message": {
    "interactiveResponseMessage": {
      "body": { "text": "🔗 Ver Pedido" },
      "nativeFlowResponseMessage": {
        "name": "cta_open_url",
        "paramsJson": "{\"url\":\"https://sualoja.com.br/pedido/12345\",\"from_notification\":false}"
      }
    }
  }
}
```

### Webhook recebido ao clicar em Copy

```json
{
  "message": {
    "interactiveResponseMessage": {
      "nativeFlowResponseMessage": {
        "name": "cta_copy",
        "paramsJson": "{\"copy_code\":\"00020126580014br.gov.bcb.pix...\"}"
      }
    }
  }
}
```

### Como ler a resposta CTA

```javascript
function parseCTAReply(msg) {
  const flow = msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!flow) return null

  const params = JSON.parse(flow.paramsJson || '{}')
  switch (flow.name) {
    case 'cta_open_url': return { action: 'url',  url: params.url }
    case 'cta_copy':     return { action: 'copy', code: params.copy_code }
    case 'cta_call':     return { action: 'call', phone: params.phone_number }
    default:             return { action: flow.name, params }
  }
}
```

---

## 4. Lista Dropdown

Menu suspenso com seções e itens selecionáveis. Suporta até **10 seções × 3 linhas = 30 itens** no total.

### Curl — Cardápio completo (10 seções, 30 itens)

```bash
curl -X POST https://sua-api.com/v1/messages/send_list_helpers \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "minha-instancia",
    "to": "5511900000001",
    "text": "Cardápio completo do restaurante.\nEscolha uma categoria abaixo:",
    "footer": "Delivery grátis acima de R$ 50",
    "buttonText": "Ver Cardápio",
    "sections": [
      {
        "title": "Hambúrgueres",
        "rows": [
          {"id": "burger_1", "title": "Clássico",       "description": "Pão, carne 180g, queijo, alface, tomate - R$ 28,90"},
          {"id": "burger_2", "title": "Bacon Lovers",   "description": "Pão, carne 180g, bacon crocante, cheddar - R$ 34,90"},
          {"id": "burger_3", "title": "Veggie Burger",  "description": "Pão, hambúrguer de grão de bico, rúcula - R$ 32,90"}
        ]
      },
      {
        "title": "Pizzas",
        "rows": [
          {"id": "pizza_1", "title": "Margherita",   "description": "Molho de tomate, mussarela, manjericão - R$ 49,90"},
          {"id": "pizza_2", "title": "Pepperoni",    "description": "Molho, mussarela, pepperoni fatiado - R$ 54,90"},
          {"id": "pizza_3", "title": "Quatro Queijos","description": "Mussarela, gorgonzola, parmesão, brie - R$ 52,90"}
        ]
      },
      {
        "title": "Massas",
        "rows": [
          {"id": "massa_1", "title": "Espaguete Bolonhesa", "description": "Massa al dente com molho bolonhesa caseiro - R$ 38,90"},
          {"id": "massa_2", "title": "Fettuccine Alfredo",  "description": "Fettuccine com molho branco cremoso - R$ 42,90"},
          {"id": "massa_3", "title": "Lasanha Especial",    "description": "Camadas de massa, carne, presunto, queijo - R$ 45,90"}
        ]
      },
      {
        "title": "Saladas",
        "rows": [
          {"id": "salada_1", "title": "Caesar",   "description": "Alface romana, croutons, parmesão, molho - R$ 32,90"},
          {"id": "salada_2", "title": "Tropical", "description": "Mix de folhas, manga, palmito, molho - R$ 29,90"},
          {"id": "salada_3", "title": "Caprese",  "description": "Tomate, mussarela búfala, manjericão - R$ 34,90"}
        ]
      },
      {
        "title": "Frutos do Mar",
        "rows": [
          {"id": "mar_1", "title": "Camarão Grelhado", "description": "Camarões grelhados com manteiga e alho - R$ 62,90"},
          {"id": "mar_2", "title": "Filé de Salmão",   "description": "Salmão grelhado com legumes no vapor - R$ 58,90"},
          {"id": "mar_3", "title": "Moqueca de Peixe", "description": "Peixe, leite de coco, dendê, pimentão - R$ 55,90"}
        ]
      },
      {
        "title": "Sobremesas",
        "rows": [
          {"id": "doce_1", "title": "Petit Gâteau", "description": "Bolo de chocolate com sorvete de creme - R$ 28,90"},
          {"id": "doce_2", "title": "Pudim",        "description": "Pudim de leite condensado tradicional - R$ 18,90"},
          {"id": "doce_3", "title": "Açaí 500ml",   "description": "Açaí com granola, banana e leite ninho - R$ 24,90"}
        ]
      },
      {
        "title": "Bebidas",
        "rows": [
          {"id": "bebida_1", "title": "Refrigerante 350ml", "description": "Coca-Cola, Guaraná, Sprite, Fanta - R$ 6,90"},
          {"id": "bebida_2", "title": "Suco Natural 500ml", "description": "Laranja, limão, maracujá, abacaxi - R$ 12,90"},
          {"id": "bebida_3", "title": "Água Mineral",       "description": "Com ou sem gás 500ml - R$ 4,90"}
        ]
      },
      {
        "title": "Cervejas",
        "rows": [
          {"id": "cerveja_1", "title": "Pilsen 600ml",  "description": "Brahma, Skol, Antarctica - R$ 12,90"},
          {"id": "cerveja_2", "title": "IPA 473ml",     "description": "Colorado, Lagunitas, Goose Island - R$ 18,90"},
          {"id": "cerveja_3", "title": "Weiss 500ml",   "description": "Erdinger, Paulaner, Blue Moon - R$ 22,90"}
        ]
      },
      {
        "title": "Vinhos",
        "rows": [
          {"id": "vinho_1", "title": "Tinto Seco",   "description": "Cabernet Sauvignon, taça 150ml - R$ 25,90"},
          {"id": "vinho_2", "title": "Branco Suave", "description": "Chardonnay, taça 150ml - R$ 23,90"},
          {"id": "vinho_3", "title": "Rosé",         "description": "Rosé Provence, taça 150ml - R$ 27,90"}
        ]
      },
      {
        "title": "Combos",
        "rows": [
          {"id": "combo_1", "title": "Combo Single",  "description": "1 hambúrguer + batata + refri - R$ 39,90"},
          {"id": "combo_2", "title": "Combo Casal",   "description": "2 hambúrgueres + batata grande + 2 refri - R$ 69,90"},
          {"id": "combo_3", "title": "Combo Família", "description": "4 hambúrgueres + 2 batatas + jarra - R$ 119,90"}
        ]
      }
    ]
  }'
```

### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `text` | string | ✅ | Texto da mensagem |
| `footer` | string | ❌ | Rodapé |
| `buttonText` | string | ✅ | Texto do botão que abre a lista (max 20 chars) |
| `sections` | array | ✅ | Seções da lista (max 10) |
| `sections[].title` | string | ✅ | Título da seção (max 24 chars) |
| `sections[].rows` | array | ✅ | Itens da seção (max 3 por seção) |
| `rows[].id` | string | ✅ | ID do item (retornado no webhook) |
| `rows[].title` | string | ✅ | Título do item (max 24 chars) |
| `rows[].description` | string | ❌ | Descrição do item (max 72 chars) |

### Webhook recebido ao selecionar item

```json
{
  "message": {
    "interactiveResponseMessage": {
      "body": { "text": "Clássico" },
      "nativeFlowResponseMessage": {
        "name": "single_select",
        "paramsJson": "{\"id\":\"burger_1\",\"title\":\"Clássico\"}"
      }
    }
  }
}
```

### Como ler a resposta

```javascript
function parseListReply(msg) {
  const flow = msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (flow?.name !== 'single_select') return null

  const params = JSON.parse(flow.paramsJson || '{}')
  return {
    id:    params.id,
    title: params.title
  }
}

// Exemplo: { id: 'burger_1', title: 'Clássico' }
```

---

## 5. Enquete / Poll

Enquete nativa do WhatsApp. Funciona em todas as plataformas sem restrições. O usuário seleciona uma ou mais opções e o resultado é atualizado em tempo real.

### Curl

```bash
curl -X POST https://sua-api.com/v1/messages/send_poll \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "minha-instancia",
    "to": "5511900000001",
    "name": "Qual sua linguagem favorita?",
    "options": ["JavaScript", "Python", "TypeScript", "Go"],
    "selectableCount": 1
  }'
```

### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | ✅ | Pergunta da enquete |
| `options` | string[] | ✅ | Opções (min 2, max 12) |
| `selectableCount` | number | ✅ | Quantas opções o usuário pode marcar (0 = ilimitado) |

### Webhook recebido ao votar

```json
{
  "event": "messages.upsert",
  "data": {
    "messages": [{
      "key": { "remoteJid": "5511900000001@s.whatsapp.net" },
      "message": {
        "pollUpdateMessage": {
          "pollCreationMessageKey": {
            "id": "ID_DA_ENQUETE_ORIGINAL"
          },
          "vote": {
            "selectedOptions": ["TypeScript"]
          }
        }
      }
    }]
  }
}
```

### Como ler a resposta

```javascript
function parsePollVote(msg) {
  const poll = msg.message?.pollUpdateMessage
  if (!poll) return null

  return {
    pollId:          poll.pollCreationMessageKey?.id,
    selectedOptions: poll.vote?.selectedOptions || []
  }
}

// Exemplo: { pollId: '3EB0...', selectedOptions: ['TypeScript'] }
```

---

## 6. Apenas Botões Reply sem CTA

Botões simples de confirmação/seleção sem nenhum botão de ação externa.

### Curl

```bash
curl -X POST https://sua-api.com/v1/messages/send_buttons_helpers \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "minha-instancia",
    "to": "5511900000001",
    "text": "Confirma o pedido #12345?",
    "footer": "Pedido no valor de R$ 150,00",
    "buttons": [
      {"id": "confirmar", "text": "✅ Confirmar"},
      {"id": "cancelar",  "text": "❌ Cancelar"},
      {"id": "adiar",     "text": "⏰ Adiar"}
    ]
  }'
```

O webhook e a leitura da resposta seguem o mesmo padrão da [Seção 2](#2-botões-quick-reply).

---

## 7. Apenas CTAs sem Quick Reply

Mensagem com somente botões de ação (URL / Call) sem botões de resposta rápida.

### Curl

```bash
curl -X POST https://sua-api.com/v1/messages/send_interactive_helpers \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "minha-instancia",
    "to": "5511900000001",
    "text": "🏪 Loja Virtual\nConfira nossos canais de atendimento:",
    "footer": "Atendimento 24h",
    "buttons": [
      {"type": "url",  "text": "🌐 Site Oficial",     "url": "https://www.sualoja.com.br"},
      {"type": "url",  "text": "📸 Instagram",         "url": "https://instagram.com/sualoja"},
      {"type": "call", "text": "📞 WhatsApp Vendas",   "phoneNumber": "+5511900000002"}
    ]
  }'
```

O webhook e a leitura da resposta seguem o mesmo padrão da [Seção 3](#3-botões-cta--url-copy-call).

---

## 8. Carrossel com Imagens

Cards deslizáveis com imagem, texto e botões. Suporta até **10 cards**, cada um com até **2 botões**. Renderiza nativamente em Android, iOS e WA Web.

### Curl — 10 cards (limite máximo)

```bash
curl -X POST https://sua-api.com/v1/messages/send_carousel_helpers \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "instance": "minha-instancia",
    "to": "5511900000001",
    "text": "🛍️ Ofertas Especiais",
    "footer": "Loja Virtual — Entrega Grátis",
    "cards": [
      {
        "body": "iPhone 15 Pro Max 256GB\nR$ 8.999,00 à vista\n12x R$ 833,25",
        "footer": "Frete Grátis",
        "imageUrl": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        "buttons": [{"id": "buy_1", "text": "Comprar"}, {"id": "info_1", "text": "Detalhes"}]
      },
      {
        "body": "MacBook Air M3 8GB 256GB\nR$ 12.499,00 à vista\n12x R$ 1.166,58",
        "footer": "Garantia 1 ano",
        "imageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        "buttons": [{"id": "buy_2", "text": "Comprar"}, {"id": "info_2", "text": "Detalhes"}]
      },
      {
        "body": "Apple Watch Series 9 45mm\nR$ 5.299,00 à vista\n12x R$ 491,58",
        "footer": "Pronta Entrega",
        "imageUrl": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
        "buttons": [{"id": "buy_3", "text": "Comprar"}, {"id": "info_3", "text": "Detalhes"}]
      },
      {
        "body": "AirPods Pro 2ª Geração\nR$ 2.499,00 à vista\n12x R$ 233,25",
        "footer": "Cancelamento de Ruído",
        "imageUrl": "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
        "buttons": [{"id": "buy_4", "text": "Comprar"}, {"id": "info_4", "text": "Detalhes"}]
      },
      {
        "body": "iPad Pro M2 11pol 128GB\nR$ 9.999,00 à vista\n12x R$ 916,58",
        "footer": "Chip M2",
        "imageUrl": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        "buttons": [{"id": "buy_5", "text": "Comprar"}, {"id": "info_5", "text": "Detalhes"}]
      },
      {
        "body": "Samsung Galaxy S24 Ultra\nR$ 7.499,00 à vista\n12x R$ 691,58",
        "footer": "Câmera 200MP",
        "imageUrl": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
        "buttons": [{"id": "buy_6", "text": "Comprar"}, {"id": "info_6", "text": "Detalhes"}]
      },
      {
        "body": "Sony WH-1000XM5\nR$ 2.299,00 à vista\n12x R$ 208,25",
        "footer": "Melhor ANC do mercado",
        "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        "buttons": [{"id": "buy_7", "text": "Comprar"}, {"id": "info_7", "text": "Detalhes"}]
      },
      {
        "body": "Nintendo Switch OLED\nR$ 2.699,00 à vista\n12x R$ 249,92",
        "footer": "Com Joy-Con",
        "imageUrl": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400",
        "buttons": [{"id": "buy_8", "text": "Comprar"}, {"id": "info_8", "text": "Detalhes"}]
      },
      {
        "body": "PlayStation 5 Slim\nR$ 4.499,00 à vista\n12x R$ 416,58",
        "footer": "1TB SSD",
        "imageUrl": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
        "buttons": [{"id": "buy_9", "text": "Comprar"}, {"id": "info_9", "text": "Detalhes"}]
      },
      {
        "body": "DJI Mini 4 Pro Drone\nR$ 6.999,00 à vista\n12x R$ 641,58",
        "footer": "4K 60fps",
        "imageUrl": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400",
        "buttons": [{"id": "buy_10", "text": "Comprar"}, {"id": "info_10", "text": "Detalhes"}]
      }
    ]
  }'
```

### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `text` | string | ✅ | Texto acima do carrossel |
| `footer` | string | ❌ | Rodapé |
| `cards` | array | ✅ | Cards (min 2, max 10) |
| `cards[].body` | string | ✅ | Texto do card |
| `cards[].footer` | string | ❌ | Rodapé do card |
| `cards[].imageUrl` | string | ✅ | URL da imagem do card |
| `cards[].buttons` | array | ✅ | Botões do card (max 2) |
| `buttons[].id` | string | ✅ | ID do botão |
| `buttons[].text` | string | ✅ | Texto do botão |

### Webhook recebido ao clicar em botão do carrossel

```json
{
  "message": {
    "interactiveResponseMessage": {
      "body": { "text": "Comprar" },
      "nativeFlowResponseMessage": {
        "name": "quick_reply",
        "paramsJson": "{\"id\":\"buy_3\"}"
      }
    }
  }
}
```

### Como ler a resposta

```javascript
function parseCarouselReply(msg) {
  const flow = msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (flow?.name !== 'quick_reply') return null

  const params = JSON.parse(flow.paramsJson || '{}')
  return {
    buttonId:   params.id,
    buttonText: msg.message.interactiveResponseMessage.body?.text
  }
}

// Exemplo: { buttonId: 'buy_3', buttonText: 'Comprar' }
```

---

## 9. Como Consumir Respostas via Webhook

### 9.1 Estrutura geral do evento

```json
{
  "event": "messages.upsert",
  "instance": "minha-instancia",
  "data": {
    "messages": [{ ...mensagem... }],
    "type": "notify"
  }
}
```

### 9.2 Roteador universal de respostas interativas

```javascript
function parseInteractiveReply(msg) {
  const interactive = msg.message?.interactiveResponseMessage
  if (!interactive) return null

  const flow = interactive.nativeFlowResponseMessage
  const body = interactive.body?.text
  const params = JSON.parse(flow?.paramsJson || '{}')

  switch (flow?.name) {
    // Botão quick_reply ou carrossel
    case 'quick_reply':
      return { type: 'button', id: params.id, text: body }

    // Lista dropdown
    case 'single_select':
      return { type: 'list', id: params.id, title: params.title }

    // CTA — abrir URL
    case 'cta_open_url':
      return { type: 'url', url: params.url }

    // CTA — copiar código
    case 'cta_copy':
      return { type: 'copy', code: params.copy_code }

    // CTA — ligar
    case 'cta_call':
      return { type: 'call', phone: params.phone_number }

    default:
      return { type: 'unknown', name: flow?.name, params }
  }
}
```

### 9.3 Enquete — roteador

```javascript
function parsePollUpdate(msg) {
  const poll = msg.message?.pollUpdateMessage
  if (!poll) return null

  return {
    type:            'poll_vote',
    pollId:          poll.pollCreationMessageKey?.id,
    selectedOptions: poll.vote?.selectedOptions || []
  }
}
```

### 9.4 Handler completo de webhook

```javascript
app.post('/webhook', (req, res) => {
  const { event, instance, data } = req.body

  if (event !== 'messages.upsert') return res.sendStatus(200)

  for (const msg of data.messages) {
    const from = msg.key.remoteJid.replace('@s.whatsapp.net', '')
    const fromMe = msg.key.fromMe

    if (fromMe) continue // ignora mensagens enviadas pela própria instância

    // Verificar tipo de resposta interativa
    const reply = parseInteractiveReply(msg) || parsePollUpdate(msg)

    if (reply) {
      console.log(`[${instance}] Resposta de ${from}:`, reply)
      handleInteractiveReply(instance, from, reply)
    }
  }

  res.sendStatus(200)
})

function handleInteractiveReply(instance, from, reply) {
  switch (reply.type) {
    case 'button':
      console.log(`Botão clicado: ${reply.id} — "${reply.text}"`)
      break
    case 'list':
      console.log(`Item selecionado: ${reply.id} — "${reply.title}"`)
      break
    case 'url':
      console.log(`URL aberta: ${reply.url}`)
      break
    case 'copy':
      console.log(`Código copiado: ${reply.code}`)
      break
    case 'poll_vote':
      console.log(`Voto em enquete ${reply.pollId}:`, reply.selectedOptions)
      break
  }
}
```

---

## 10. Limites e Restrições

### Limites por tipo

| Tipo | Limite |
|---|---|
| Botões Quick Reply | Testado com até 16 botões |
| Lista — seções | Máximo 10 seções |
| Lista — itens por seção | Máximo 3 itens |
| Lista — total de itens | Máximo 30 itens |
| Lista — título de seção | Máximo 24 caracteres |
| Lista — título de item | Máximo 24 caracteres |
| Lista — descrição de item | Máximo 72 caracteres |
| Lista — texto do botão | Máximo 20 caracteres |
| Carrossel — cards | Mínimo 2, máximo 10 |
| Carrossel — botões por card | Máximo 2 botões |
| Poll — opções | Mínimo 2, máximo 12 |

### Restrições de conta

| Restrição | Detalhe |
|---|---|
| Conta hosted (Meta Business Cloud API) | Mensagens interativas podem ser bloqueadas pelo servidor WA — política do servidor, sem workaround |
| Conta pessoal (não-Business) | Servidor WA pode rejeitar o envio de mensagens interativas |
| Conta Business não verificada | Funciona, mas pode ter limitações de alcance |
