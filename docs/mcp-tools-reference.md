# WhatsApp MCP Tools Reference

Complete API reference for all MCP tools exposed by the WhatsApp MCP Server.

---

## Connection Tools

### `whatsapp_connect`

Initialize connection to WhatsApp. Will return QR code if authentication is needed.

**Input Schema:**
```typescript
{}
```

**Output:**
```typescript
{
  status: "disconnected" | "connecting" | "connected" | "qr_required" | "pairing_required",
  qrCode?: string,
  pairingCode?: string
}
```

---

### `whatsapp_disconnect`

Disconnect and logout from WhatsApp.

**Input Schema:**
```typescript
{}
```

**Output:**
```typescript
{
  success: boolean
}
```

---

### `whatsapp_connection_status`

Get current WhatsApp connection status.

**Input Schema:**
```typescript
{}
```

**Output:**
```typescript
{
  status: "disconnected" | "connecting" | "connected" | "qr_required" | "pairing_required",
  isConnected: boolean,
  sessionInfo: {
    id: string,
    name?: string,
    phoneNumber?: string
  } | null
}
```

---

### `whatsapp_request_pairing_code`

Request a pairing code for phone number authentication. Auto-connects if not initialized.

**Input Schema:**
```typescript
{
  phoneNumber: string // Phone number with country code (no + or spaces)
}
```

**Output:**
```typescript
{
  pairingCode: string
}
```

---

### `whatsapp_get_qr_code`

Get the QR code for authentication. Initiates connection if needed and waits for QR.

**Input Schema:**
```typescript
{}
```

**Output:**
```typescript
{
  qrCode: string
}
```

---

## Contact Tools

### `whatsapp_check_number`

Check if a phone number is registered on WhatsApp.

**Input Schema:**
```typescript
{
  phoneNumber: string // Phone number with country code (e.g., +1234567890)
}
```

**Output:**
```typescript
{
  exists: boolean,
  jid?: string
}
```

---

### `whatsapp_get_profile_picture`

Get the profile picture URL of a user or group.

**Input Schema:**
```typescript
{
  jid: string, // User or group JID
  highRes?: boolean // Get high resolution image (default: false)
}
```

**Output:**
```typescript
{
  url: string | null
}
```

---

### `whatsapp_get_status`

Get the "about" status text of a user.

**Input Schema:**
```typescript
{
  jid: string // User JID
}
```

**Output:**
```typescript
{
  status: string | null
}
```

---

### `whatsapp_block_user`

Block a user on WhatsApp.

**Input Schema:**
```typescript
{
  jid: string // User JID to block
}
```

**Output:**
```typescript
{
  success: boolean
}
```

---

### `whatsapp_unblock_user`

Unblock a user on WhatsApp.

**Input Schema:**
```typescript
{
  jid: string // User JID to unblock
}
```

**Output:**
```typescript
{
  success: boolean
}
```

---

### `whatsapp_get_blocked_users`

Get list of blocked users.

**Input Schema:**
```typescript
{}
```

**Output:**
```typescript
{
  blockedUsers: string[]
}
```

---

## Group Tools

### `whatsapp_create_group`

Create a new WhatsApp group.

**Input Schema:**
```typescript
{
  subject: string, // Group name/subject
  participants: string[] // Array of participant JIDs to add
}
```

**Output:**
```typescript
{
  jid: string,
  subject: string,
  owner?: string,
  creation?: number
}
```

---

### `whatsapp_group_participants`

Add, remove, promote, or demote group participants.

**Input Schema:**
```typescript
{
  groupJid: string, // Group JID
  participants: string[], // Array of participant JIDs
  action: "add" | "remove" | "promote" | "demote"
}
```

**Output:**
```typescript
{
  success: boolean
}
```

---

### `whatsapp_group_settings`

Update group subject, description, or ephemeral settings.

**Input Schema:**
```typescript
{
  groupJid: string, // Group JID
  subject?: string, // New group name
  description?: string, // New group description
  ephemeral?: number // Disappearing messages duration in seconds (0 to disable)
}
```

**Output:**
```typescript
{
  success: boolean
}
```

---

### `whatsapp_get_group_info`

Get detailed information about a group.

**Input Schema:**
```typescript
{
  groupJid: string // Group JID
}
```

**Output:**
```typescript
{
  jid: string,
  subject: string,
  owner?: string,
  creation?: number,
  description?: string,
  participants: Array<{
    jid: string,
    admin?: "admin" | "superadmin" | null
  }>
}
```

---

### `whatsapp_leave_group`

Leave a WhatsApp group.

**Input Schema:**
```typescript
{
  groupJid: string // Group JID
}
```

**Output:**
```typescript
{
  success: boolean
}
```

---

### `whatsapp_get_group_invite`

Get the invite code/link for a group (requires admin).

**Input Schema:**
```typescript
{
  groupJid: string // Group JID
}
```

**Output:**
```typescript
{
  inviteCode: string,
  inviteLink: string
}
```

---

### `whatsapp_join_group`

Join a group using an invite code.

**Input Schema:**
```typescript
{
  inviteCode: string // Group invite code (from invite link)
}
```

**Output:**
```typescript
{
  groupJid: string
}
```

---

### `whatsapp_get_all_groups`

Get list of all groups the user participates in.

**Input Schema:**
```typescript
{}
```

**Output:**
```typescript
{
  groups: Array<{
    jid: string,
    subject: string,
    owner?: string
  }>
}
```

---

## Messaging Tools

### `whatsapp_send_text`

Send a text message to a WhatsApp user or group.

**Input Schema:**
```typescript
{
  jid: string, // Recipient JID (e.g., 1234567890@s.whatsapp.net for users, xxx@g.us for groups)
  text: string, // Message text content
  quotedMessageId?: string // Optional message ID to reply to
}
```

**Output:**
```typescript
{
  success: boolean,
  messageId: string,
  timestamp: number
}
```

---

### `whatsapp_send_media`

Send an image, video, audio, or document to a WhatsApp user or group.

**Input Schema:**
```typescript
{
  jid: string, // Recipient JID
  mediaType: "image" | "video" | "audio" | "document" | "sticker",
  url: string, // URL or local file path to the media
  caption?: string, // Optional caption (for image/video)
  filename?: string, // Filename (for documents)
  mimetype?: string // MIME type if not auto-detected
}
```

**Output:**
```typescript
{
  success: boolean,
  messageId: string,
  timestamp: number
}
```

---

### `whatsapp_send_reaction`

React to a message with an emoji. Use empty string to remove reaction.

**Input Schema:**
```typescript
{
  jid: string, // Chat JID where the message is
  messageId: string, // ID of the message to react to
  emoji: string // Emoji to react with (empty string to remove)
}
```

**Output:**
```typescript
{
  success: boolean,
  messageId: string,
  timestamp: number
}
```

---

### `whatsapp_read_messages`

Mark messages as read.

**Input Schema:**
```typescript
{
  messageKeys: Array<{
    remoteJid: string, // Chat JID
    id: string, // Message ID
    fromMe?: boolean // Whether the message is from me
  }>
}
```

**Output:**
```typescript
{
  success: boolean
}
```

---

### `whatsapp_delete_message`

Delete a message for everyone (only works for your own messages).

**Input Schema:**
```typescript
{
  jid: string, // Chat JID
  messageId: string // Message ID to delete
}
```

**Output:**
```typescript
{
  success: boolean
}
```

---

## Webhook Tools

### `whatsapp_webhook_register`

Register a webhook endpoint to receive real-time WhatsApp events.

**Input Schema:**
```typescript
{
  url: string, // The webhook endpoint URL (HTTPS recommended)
  events?: Array<"message.received" | "message.sent" | "message.update" | "connection.update" | "group.update" | "presence.update" | "*">, // Default: ["*"]
  secret?: string // Optional HMAC secret for signature verification
}
```

**Output:**
```typescript
{
  success: boolean,
  message: string,
  url: string,
  events: string[]
}
```

---

### `whatsapp_webhook_unregister`

Remove a registered webhook endpoint.

**Input Schema:**
```typescript
{
  url: string // The webhook URL
}
```

**Output:**
```typescript
{
  success: boolean,
  message: string,
  url: string
}
```

---

### `whatsapp_webhook_list`

List all registered webhook endpoints.

**Input Schema:**
```typescript
{}
```

**Output:**
```typescript
{
  count: number,
  webhooks: Array<{
    url: string,
    events: string[],
    secret?: string,
    enabled: boolean
  }>
}
```

---

### `whatsapp_webhook_test`

Send a test payload to a registered webhook to verify connectivity.

**Input Schema:**
```typescript
{
  url: string // The webhook URL
}
```

**Output:**
```typescript
{
  url: string,
  success: boolean,
  error?: string
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `NOT_CONNECTED` | WhatsApp session not connected |
| `AUTH_REQUIRED` | Authentication needed (scan QR or pair) |
| `INVALID_JID` | Invalid recipient ID format |
| `MESSAGE_NOT_FOUND` | Referenced message doesn't exist |
| `GROUP_NOT_FOUND` | Group doesn't exist |
| `PERMISSION_DENIED` | Insufficient permissions for operation |
