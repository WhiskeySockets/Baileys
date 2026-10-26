# Chat app-state evidence

`chatModify` changes conversation read/unread or archive state through app-state. `readMessages` sends message read receipts through a separate path. Neither a resolved call nor a local echo proves that another device applied the requested state.

This adds the unbuffered `app-state.update` event. Existing `chats.update` payloads and the `Promise<void>` return types of `chatModify` and `appPatch` are preserved.

Each `app-state.update` listener is invoked independently, including handlers registered through `ev.process`. Exceptions and rejected promises from one consumer do not prevent delivery to later subscribers, skip legacy chat callbacks or replace the operation's result. Diagnostics omit the thrown value, which may contain private consumer state. Dispatch of other event types is unchanged.

```ts
sock.ev.on('app-state.update', event => {
	if (event.kind === 'patch-response') {
		// The response to the outgoing IQ; independent of local commit success.
	} else if (event.source === 'local-echo') {
		// Reconstruction of the outgoing patch; independent of emitOwnEvents.
	} else {
		// An app-state record decoded from a fetched patch or snapshot.
	}
})

await sock.chatModify({ markRead: true, lastMessages }, jid, { requestId: 'read-001' })
```

`requestId` is optional local metadata. It is not sent to WhatsApp, does not provide idempotency, and is never attached to records received through sync. `appPatch` accepts the same options as its second parameter.

## Response evidence

A `patch-response` contains the collection, outgoing version, optional request ID and status:

- `version-matched`: an IQ result includes the corresponding collection with the exact outgoing version.
- `response-received`: a response arrived, without a matching collection version. A parseable server version is included when present.

Missing responses and explicit nested collection errors reject before saving the outgoing patch's local version or producing an own echo. Independently fetched preflight state may already have committed. A missing response leaves the remote outcome uncertain. No operation is automatically retried. A response event can still be emitted if the subsequent local transaction commit fails and the call rejects.

The preflight sync commits before the outgoing patch's write transaction starts, under the same patch mutex. A sync listener can therefore queue another `chatModify` without inheriting a transaction context that has already committed when the queued call executes. A later outgoing rejection does not roll back that independently fetched sync state; a failed preflight commit prevents submission of the outgoing patch.

## Decoded records

A `chat-action` contains its origin, JID, collection, version, action, and available remote timestamp and message range. The range contains only message keys and timestamps, without message content or cryptographic material.

- `local-echo` describes the locally encoded patch. It is emitted regardless of `emitOwnEvents`; only legacy chat callbacks follow that option.
- `sync` also includes `representation: 'patch' | 'snapshot'`, `initialSync` and `macVerified`. It does not identify the originating device. Snapshot versions describe the containing snapshot, not the original action version.

Decoded actions are collected separately from the consolidation maps, preserving individual records and same-version network replays. Events are emitted after the sync transaction and map construction, before consolidated chat callbacks. Records can be historical, repeated, superseded, or part of an initial snapshot; arrival order alone does not establish current state. The original chat projection and its consolidation behavior remain separate. This event is not a durable journal or exactly-once delivery mechanism.

`REMOVE` mutations retire an encrypted app-state record. Their payload describes the old action and must not be applied as a new chat action. They still participate in validation and LTHash accounting, but do not generate `chat-action` or consolidated chat changes. Snapshot records without an operation remain SET records. This matters when a new action under one app-state key is followed by retirement of the previous record under another key, including within the same collection version.

Opening a chat on another device can yield an own-device `read-self` receipt with message IDs. That path produces message read evidence (`messages.update` for a direct chat), rather than `chat-action` or a blanket conversation-read update. A receipt does not establish that all messages or a manually marked-unread conversation are now read. This extension does not convert receipts to conversation state or force periodic resynchronization.

`macVerified` reports successful checks only when verification was enabled and the relevant checks passed. The SDK defaults disable app-state MAC verification; a decoded record with `macVerified: false` is not a verified record. The extension does not change those settings. Aggregate verification failures prevent this new observation from being emitted for the affected patch or snapshot.

## Other fixes and tests

The event buffer replaces its internal batch before invoking synchronous listeners, preserving updates emitted reentrantly during a flush. The array form of `lastMessages` maps each `messageTimestamp` to protobuf `timestamp`, preserving per-message timestamps on the wire.

The focused tests live in `src/__tests__/Socket/app-state*.test.ts` and `src/__tests__/Utils/chat-utils.test.ts`. They use fictional cryptographic fixtures, a mocked transport and fake timers; chat conversion, encoding/decoding, transactions, handlers and event buffering are real. No WhatsApp connection, session or live message is used. Run them with `corepack yarn test --runInBand --runTestsByPath src/__tests__/Socket/app-state*.test.ts src/__tests__/Utils/chat-utils.test.ts`, or run the complete suite with `corepack yarn test --runInBand`.

The implementation was compared with upstream rc14 (`7e7b0757e3f9f3c7789fb1cfd2f241d5002a199a`) and master (`0af2386292907f7d9742d8d41f830d8c48208fa1`). The response error fixture reconstructs the shape discussed in [upstream issue #1406](https://github.com/WhiskeySockets/Baileys/issues/1406#issuecomment-3904719766). The buffer fix follows the mechanism in [upstream PR #2577](https://github.com/WhiskeySockets/Baileys/pull/2577).
