# ⚠️ EXPERIMENTAL: Interactive Messages Guide

## 🚨 **CRITICAL WARNING**

**These features MAY NOT WORK and can cause ACCOUNT BANS.**

- ❌ WhatsApp actively blocks non-business accounts from sending interactive messages
- ❌ Can result in temporary or permanent account bans
- ❌ Messages may not be delivered
- ✅ **Use ONLY for testing with DISPOSABLE accounts in DEV environment**

## 📋 Table of Contents

1. [Configuration](#configuration)
2. [Simple Text Buttons](#1-simple-text-buttons)
3. [Buttons with Image](#2-buttons-with-image)
4. [Buttons with Video](#3-buttons-with-video)
5. [List Messages](#4-list-messages)
6. [Template Buttons (Action Buttons)](#5-template-buttons-action-buttons)
7. [Carousel Messages](#6-carousel-messages)
8. [Metrics and Monitoring](#metrics-and-monitoring)

---

## Configuration

### Enable Interactive Messages

```typescript
import makeWASocket from '@whiskeysockets/baileys'

const sock = makeWASocket({
  auth: state,
  // ⚠️ Enable experimental interactive messages
  // WARNING: Can cause account bans!
  enableInteractiveMessages: true, // default: true
  logger: pino({ level: 'warn' })
})
```

### Disable in Production

```typescript
const sock = makeWASocket({
  auth: state,
  // ✅ Disable for production safety
  enableInteractiveMessages: false,
  logger: pino({ level: 'info' })
})
```

---

## 1. Simple Text Buttons

Send a message with up to 3 clickable buttons.

### Example

```typescript
await sock.sendMessage(jid, {
  text: 'Choose an option:',
  buttons: [
    {
      buttonId: 'btn1',
      buttonText: { displayText: 'Option 1' }
    },
    {
      buttonId: 'btn2',
      buttonText: { displayText: 'Option 2' }
    },
    {
      buttonId: 'btn3',
      buttonText: { displayText: 'Option 3' }
    }
  ],
  footerText: 'Optional footer text'
})
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | ✅ | Main message text |
| `buttons` | ButtonInfo[] | ✅ | Array of buttons (max 3) |
| `footerText` | string | ❌ | Footer text below buttons |

---

## 2. Buttons with Image

Send an image with interactive buttons.

### Example

```typescript
await sock.sendMessage(jid, {
  image: { url: 'https://example.com/image.jpg' },
  caption: 'Image description',
  buttons: [
    {
      buttonId: 'view_more',
      buttonText: { displayText: 'View More' }
    },
    {
      buttonId: 'buy_now',
      buttonText: { displayText: 'Buy Now' }
    }
  ],
  footerText: 'Available now'
})
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image` | WAMediaUpload | ✅ | Image URL or Buffer |
| `caption` | string | ❌ | Image caption |
| `buttons` | ButtonInfo[] | ✅ | Array of buttons (max 3) |
| `footerText` | string | ❌ | Footer text |

---

## 3. Buttons with Video

Send a video with interactive buttons.

### Example

```typescript
await sock.sendMessage(jid, {
  video: { url: 'https://example.com/video.mp4' },
  caption: 'Watch this!',
  buttons: [
    {
      buttonId: 'watch',
      buttonText: { displayText: 'Watch Now' }
    }
  ],
  footerText: 'New release'
})
```

---

## 4. List Messages

Send a message with a menu of up to 10 options organized in sections.

### Example

```typescript
await sock.sendMessage(jid, {
  text: 'Choose a product:',
  title: 'Product Catalog',
  buttonText: 'View Options',
  sections: [
    {
      title: 'Electronics',
      rows: [
        {
          rowId: 'laptop_1',
          title: 'Laptop Pro',
          description: '$999 - High performance'
        },
        {
          rowId: 'phone_1',
          title: 'Smartphone X',
          description: '$699 - Latest model'
        }
      ]
    },
    {
      title: 'Accessories',
      rows: [
        {
          rowId: 'case_1',
          title: 'Phone Case',
          description: '$29 - Protective'
        }
      ]
    }
  ],
  footerText: 'Free shipping'
})
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | ✅ | Message description |
| `title` | string | ❌ | List title |
| `buttonText` | string | ✅ | Text on button that opens list |
| `sections` | ListSection[] | ✅ | Array of sections (max 10 items total) |
| `footerText` | string | ❌ | Footer text |

### Limits

- Maximum 10 sections
- Maximum 10 rows total across all sections
- Row title: 24 characters max
- Row description: 72 characters max

---

## 5. Template Buttons (Action Buttons)

Send buttons with actions: Quick Reply, URL, or Call.

### Example

```typescript
await sock.sendMessage(jid, {
  text: 'Contact us or visit our website',
  templateButtons: [
    // Quick Reply Button
    {
      index: 1,
      quickReplyButton: {
        displayText: 'Quick Reply',
        id: 'reply_1'
      }
    },
    // URL Button
    {
      index: 2,
      urlButton: {
        displayText: 'Visit Website',
        url: 'https://example.com'
      }
    },
    // Call Button
    {
      index: 3,
      callButton: {
        displayText: 'Call Us',
        phoneNumber: '+551199999999'
      }
    }
  ],
  footer: 'We are here to help'
})
```

### Button Types

| Type | Description | Parameters |
|------|-------------|------------|
| `quickReplyButton` | Quick response button | `displayText`, `id` |
| `urlButton` | Opens URL in browser | `displayText`, `url` |
| `callButton` | Initiates phone call | `displayText`, `phoneNumber` |

---

## 6. Carousel Messages

Send up to 10 scrollable cards with images/videos and buttons.

### Example

```typescript
await sock.sendMessage(jid, {
  text: 'Check out our products',
  carousel: {
    cards: [
      // Card 1
      {
        header: {
          title: 'Product 1',
          imageMessage: {
            url: 'https://example.com/product1.jpg',
            mimetype: 'image/jpeg'
          },
          hasMediaAttachment: true
        },
        body: { text: 'Amazing product - $99.90' },
        footer: { text: 'Limited stock' },
        nativeFlowMessage: {
          buttons: [
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                display_text: 'Buy Now',
                id: 'buy_1'
              })
            },
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: 'More Info',
                url: 'https://example.com/product1'
              })
            }
          ]
        }
      },
      // Card 2
      {
        header: {
          title: 'Product 2',
          imageMessage: {
            url: 'https://example.com/product2.jpg',
            mimetype: 'image/jpeg'
          },
          hasMediaAttachment: true
        },
        body: { text: 'Great deal - $149.90' },
        footer: { text: 'Best seller' },
        nativeFlowMessage: {
          buttons: [
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                display_text: 'Buy Now',
                id: 'buy_2'
              })
            }
          ]
        }
      }
    ],
    messageVersion: 1
  }
})
```

### Limits

- Maximum 10 cards per carousel
- Each card requires an image or video
- Up to 3 buttons per card
- All cards must have same media type (all images or all videos)

---

## Metrics and Monitoring

All interactive messages are tracked with Prometheus metrics:

### Available Metrics

```typescript
// Messages sent by type
metrics.interactiveMessagesSent.inc({ type: 'buttons' })

// Successful sends
metrics.interactiveMessagesSuccess.inc({ type: 'list' })

// Failures with reason
metrics.interactiveMessagesFailures.inc({
  type: 'template',
  reason: 'feature_disabled'
})

// Send latency
metrics.interactiveMessagesLatency.observe({ type: 'carousel' }, 1234)
```

### Monitoring Dashboard

Query these metrics in Prometheus/Grafana:

```promql
# Total interactive messages sent
sum(interactive_messages_sent_total) by (type)

# Success rate
sum(interactive_messages_success_total) / sum(interactive_messages_sent_total)

# Failure breakdown
sum(interactive_messages_failures_total) by (type, reason)

# P95 latency
histogram_quantile(0.95, interactive_messages_latency_ms)
```

---

## Handling Responses

### Button Response

```typescript
sock.ev.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0]

  // Button response
  if (msg.message?.buttonsResponseMessage) {
    const buttonId = msg.message.buttonsResponseMessage.selectedButtonId
    const displayText = msg.message.buttonsResponseMessage.selectedDisplayText

    console.log(`User clicked: ${buttonId} - "${displayText}"`)
  }

  // Template button response
  if (msg.message?.templateButtonReplyMessage) {
    const selectedId = msg.message.templateButtonReplyMessage.selectedId
    const selectedText = msg.message.templateButtonReplyMessage.selectedDisplayText

    console.log(`User clicked template: ${selectedId} - "${selectedText}"`)
  }

  // List response
  if (msg.message?.listResponseMessage) {
    const rowId = msg.message.listResponseMessage.singleSelectReply.selectedRowId
    const title = msg.message.listResponseMessage.title

    console.log(`User selected from list: ${rowId} - "${title}"`)
  }
})
```

---

## Troubleshooting

### Message Not Showing

- ✅ Verify `enableInteractiveMessages` is `true`
- ✅ Check logs for `[EXPERIMENTAL]` warnings
- ✅ Ensure you're using a test/disposable account
- ❌ Interactive messages don't work on production accounts

### Account Banned/Restricted

- ⚠️ This is expected behavior
- ⚠️ WhatsApp blocks non-business accounts
- ✅ Create a new test account
- ✅ Use official WhatsApp Business API for production

### Metrics Not Showing

Check feature flag:
```typescript
if (buttonType && !enableInteractiveMessages) {
  // Metrics will show reason: 'feature_disabled'
}
```

---

## Migration to WhatsApp Business API

For production use, migrate to official API:

### Evolution API (Cloud Mode)

```typescript
// config.ts
export const evolutionConfig = {
  apiUrl: 'https://your-evolution-api.com',
  apiKey: 'your-api-key',
  instance: 'your-instance'
}

// Send button via Evolution API
await fetch(`${evolutionConfig.apiUrl}/message/sendButton`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': evolutionConfig.apiKey
  },
  body: JSON.stringify({
    number: '5511999999999',
    options: {
      delay: 1200,
      presence: 'composing'
    },
    buttonMessage: {
      text: 'Choose an option',
      buttons: [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' }
      ],
      footer: 'Footer text'
    }
  })
})
```

---

## References

- [WhatsApp Official Business API](https://business.whatsapp.com/products/business-platform)
- [Evolution API Documentation](https://doc.evolution-api.com/)
- [Baileys GitHub Issues #56](https://github.com/WhiskeySockets/Baileys/issues/56)
- [Baileys GitHub Issues #25](https://github.com/WhiskeySockets/Baileys/issues/25)

---

## ⚠️ Final Reminder

**THESE FEATURES ARE EXPERIMENTAL AND UNRELIABLE**

- Use only for testing
- Expect failures and bans
- Not suitable for production
- Official WhatsApp Business API is the only supported way

---

**Generated by rsalcara/InfiniteAPI**
