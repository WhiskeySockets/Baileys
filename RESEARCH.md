# Outgoing WhatsApp Calls Research (Baileys)

## Scope
Research focused on how Baileys currently handles calls, where call stanzas are parsed/sent, and how to add a minimal outgoing call request API.

## Repository / branch context
- Repo: `Baileys` fork in `whatsapp-voice-calls`
- Current local branch in this environment: `master` (branch writes under `.git` are sandbox-blocked here)
- Remotes:
  - `origin`: `WhiskeySockets/Baileys`
  - `koptereli`: `koptereli/Baileys`

## 1) Call-related code in `src/`

### Incoming call parsing
- File: `src/Socket/messages-recv.ts`
- Call node listener:
  - `ws.on('CB:call', ...)` at around line `1605`
- Core parser:
  - `handleCall(node)` at around line `1408`
  - Reads first child under `<call>` and maps status via `getCallStatusFromNode`
  - Extracts:
    - `call-id` from child attrs
    - `from` from child `from` or `call-creator`
    - top-level `attrs.from` as `chatId`
  - For `offer`:
    - Detects video by checking for a `<video>` child
    - Detects group with `type=group` or `group-jid`
    - Stores offer in `callOfferCache`
  - Emits `ev.emit('call', [call])`
  - Sends stanza ack with `sendMessageAck`

### Call status mapping
- File: `src/Utils/generics.ts`
- Function: `getCallStatusFromNode`
- Mapping:
  - `offer`, `offer_notice` -> `offer`
  - `accept` -> `accept`
  - `reject` -> `reject`
  - `terminate` + `reason=timeout` -> `timeout`
  - else default -> `ringing`

### Existing outbound call stanzas
- File: `src/Socket/messages-recv.ts`
- Function: `rejectCall(callId, callFrom)`
- Sends:
  - top: `<call from="me" to="callFrom">`
  - child: `<reject call-id="..." call-creator="callFrom" count="0"/>`
  - sent via `query(stanza)`

- File: `src/Socket/chats.ts`
- Function: `createCallLink(type, event?)`
- Sends:
  - top: `<call id="..." to="@call">`
  - child: `<link_create media="audio|video"> ...`
  - sent via `query(...)`

### Related types/events
- `src/Types/Call.ts`:
  - `WACallUpdateType = 'offer' | 'ringing' | 'timeout' | 'reject' | 'accept' | 'terminate'`
  - `WACallEvent` shape
- `src/Types/Events.ts`:
  - `call: WACallEvent[]` event stream
- `src/Types/Socket.ts`:
  - `callOfferCache?: CacheStore` config

## 2) WAProto call definitions (`WAProto/`)

- File: `WAProto/WAProto.proto`
- `message Message` contains `optional Call call = 10;`
- `Message.Call` contains fields like `callKey`, conversion/deeplink/context fields
- `CallLogMessage` and scheduled call messages exist

Observation:
- WAProto covers message payload/logging representations for call-related message objects.
- Live call signaling used by `CB:call` in Baileys is stanza-based (`BinaryNode`), not these protobuf message types.

## 3) WABinary / tokens relevant to call signaling

- File: `src/WABinary/constants.ts`
- Includes call-related tokens used in binary node encoding:
  - `call`, `call-id`, `call-creator`, `offer`, `offer_notice`, `accept`, `reject`, `terminate`, `video`, `audio`, etc.

Observation:
- Token set supports call offer/reject/accept style stanzas and media hint tags.

## 4) Stanza sending path

- File: `src/Socket/socket.ts`
- `query(node)`:
  - auto-fills `attrs.id` if missing
  - sends node via `sendNode`
  - waits for `TAG:<id>` response
  - validates server errors

Implication:
- Outgoing call initiation should use `query` for consistency with existing call control stanzas.

## 5) Existing docs references

- File: `README.md`
- Existing public call API mentions only:
  - `sock.rejectCall(callId, callFrom)`

No existing outgoing call initiation API is documented.

## 6) Inferred minimal outgoing call initiation format

Based on:
- incoming parser expectations (`offer` child, `call-id`, `call-creator`, optional `video` child)
- existing outbound call control style (`rejectCall`)
- existing outbound call query style (`createCallLink`)

A minimal voice-call request stanza is inferred as:

- top-level: `tag: 'call'`, attrs: `{ from: me, to: targetJid, id: ... }`
- child: `tag: 'offer'`, attrs includes:
  - `call-id`: generated unique id
  - `call-creator`: caller jid
  - `count`: `'0'`
- child content includes `audio` marker node for explicit voice intent

## 7) Risk notes

- WhatsApp call signaling is not officially documented; this implementation is based on protocol symmetry and existing parser behavior.
- Full WebRTC/media session establishment is out of scope; this work only initiates signaling.
- Runtime interoperability may still depend on additional opaque metadata in some environments.

## 8) External corroboration used

- Looked at `whatsmeow` call parsing/reject implementation (raw `call.go`) for protocol parity signals.
- Findings align with Baileys incoming parsing and reject stanza structure.
