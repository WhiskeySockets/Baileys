# Webhooks

Real-time push notifications for WhatsApp events.

## Overview

The MCP server can push events to external HTTP endpoints in real-time. This enables integrations that need immediate notifications without polling.

## Event Types

| Event | Description | Trigger |
|-------|-------------|---------|
| `message.received` | New message arrives | Incoming messages |
| `message.sent` | Message sent confirmation | After sendMessage |
| `message.update` | Read receipts, status | Status changes |
| `connection.update` | Connection state change | Connect/disconnect/QR |
| `group.update` | Group metadata change | Subject, settings |
| `presence.update` | User online/offline | Presence changes |
| `*` | All events | Wildcard subscription |

## MCP Tools

### Register Webhook

```json
{
  "tool": "whatsapp_webhook_register",
  "arguments": {
    "url": "https://your-server.com/webhook",
    "events": ["message.received", "connection.update"],
    "secret": "your-hmac-secret"
  }
}
```

### Unregister Webhook

```json
{
  "tool": "whatsapp_webhook_unregister",
  "arguments": {
    "url": "https://your-server.com/webhook"
  }
}
```

### List Webhooks

```json
{
  "tool": "whatsapp_webhook_list",
  "arguments": {}
}
```

### Test Webhook

```json
{
  "tool": "whatsapp_webhook_test",
  "arguments": {
    "url": "https://your-server.com/webhook"
  }
}
```

## Payload Format

```json
{
  "event": "message.received",
  "timestamp": 1704470400000,
  "data": {
    "messages": [...],
    "type": "notify"
  }
}
```

## Security

### HMAC Signature

If a `secret` is configured, requests include `X-Webhook-Signature` header:

```
X-Webhook-Signature: sha256=<hmac-hex>
```

Verify in your server:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return signature === `sha256=${expected}`;
}
```

### Best Practices

1. **Use HTTPS** - Always use secure endpoints
2. **Verify signatures** - Validate HMAC on every request
3. **Respond quickly** - Return 200 within 10 seconds
4. **Idempotency** - Handle duplicate deliveries gracefully

## Retry Logic

Failed deliveries are retried with exponential backoff:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 second |
| 3 | 3 seconds |
| 4 | 10 seconds |

After 3 failed attempts, the event is dropped (logged as error).

## Architecture

```
Baileys Events → ConnectionService → WebhookService → HTTP POST
                    (emit)              (dispatch)      (fetch)
```

The `WebhookService` follows SOLID principles:
- **SRP**: Only handles dispatch, not event generation
- **OCP**: New events addable without modifying dispatcher
- **DIP**: Depends on abstract types, not socket implementation
