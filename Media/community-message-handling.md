# Handling Messages in Community Sub-Groups

## The Problem

When receiving messages from WhatsApp Community sub-groups, `messages.upsert` fires **twice** for the same message:

1. **First event:** Contains only `senderKeyDistributionMessage` + `messageContextInfo` (encryption key distribution, no actual text)
2. **Second event:** Contains the actual message content (`conversation`, `extendedTextMessage`, etc.) alongside the key distribution

If you process both events, you'll either:
- Get duplicate messages in your database
- Crash on the first event (no text content to extract)

## Solution

Handle this in two parts: **skip pure key distributions** and **deduplicate by message ID**.

### 1. Skip Pure Key Distributions

When `senderKeyDistributionMessage` is the content type, check if actual text content exists. If not, skip it — the real message will arrive in the second event.

```typescript
sock.ev.on('messages.upsert', async ({ messages, type }) => {
  if (type !== 'notify') return;

  for (const msg of messages) {
    const content = msg.message;
    if (!content) continue;

    const contentType = getContentType(content);

    // Community sub-group messages arrive twice:
    // 1st: senderKeyDistributionMessage only (encryption keys, no text)
    // 2nd: actual message content + keys
    // Skip the first one — do NOT mark as processed (dedup),
    // so the second delivery can still be handled.
    if (contentType === 'senderKeyDistributionMessage') {
      const msgAny = content as any;
      if (!msgAny.conversation && !msgAny.extendedTextMessage?.text) {
        continue; // Pure key distribution, skip
      }
    }

    // ... process the message
  }
});
```

**Important:** Do NOT add the message ID to your dedup set when skipping key distributions. The real message has the same ID and needs to pass through.

### 2. Deduplicate by Message ID

Baileys can fire multiple `messages.upsert` events for the same message ID nearly simultaneously. Use a synchronous Set check **before** any async work:

```typescript
const processedMessages = new Set<string>();
const MAX_PROCESSED = 1000;

sock.ev.on('messages.upsert', async ({ messages, type }) => {
  if (type !== 'notify') return;

  for (const msg of messages) {
    const messageId = msg.key.id;
    if (!messageId) continue;

    // ... skip pure key distributions first (see above) ...

    // Synchronous dedup check — must happen before any await
    if (processedMessages.has(messageId)) continue;
    processedMessages.add(messageId);

    // Prevent memory leak
    if (processedMessages.size > MAX_PROCESSED) {
      const entries = Array.from(processedMessages);
      entries.slice(0, entries.length - MAX_PROCESSED).forEach(id => processedMessages.delete(id));
    }

    // Now safe to do async processing
    await handleMessage(msg);
  }
});
```

### Why Synchronous Dedup Matters

If you use a database check (async) for deduplication, two identical events can both pass the check before either writes to the DB. The in-memory Set is synchronous and prevents this race condition.

## Supported Content Types

For reference, these are the common content types you'll encounter in groups:

| Content Type | Contains | Notes |
|---|---|---|
| `conversation` | Plain text | Most common |
| `extendedTextMessage` | Text with links/mentions/quotes | Check `.text` property |
| `imageMessage` | Image + optional caption | Use `downloadMediaMessage()` |
| `videoMessage` | Video + optional caption | Use `downloadMediaMessage()` |
| `senderKeyDistributionMessage` | Encryption keys | Skip if no text alongside |
| `documentMessage` | File attachment | PDF, docs, etc. |
| `audioMessage` | Voice note or audio file | |
| `stickerMessage` | Sticker | |
| `reactionMessage` | Emoji reaction | |

## Community vs Regular Groups

Community sub-groups (groups under a Community parent) behave differently:

- Messages fire twice (key distribution + content)
- `groupMetadata()` returns `isCommunity: true` for the parent
- Sub-groups have a `linkedParent` field pointing to the community JID
- Filter out community parents when listing user-facing groups:

```typescript
const groups = await sock.groupFetchAllParticipating();
const userGroups = Object.values(groups).filter(g => !g.isCommunity);
```

---

*Contributed by the [WhatsAuction](https://whatsauction.co.za) team — WhatsApp-native auction software for South Africa.*
