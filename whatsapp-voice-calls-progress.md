# WhatsApp Voice Calls Progress

Date: 2026-02-25

## What Was Researched

- Internal Baileys call handling paths:
  - `src/Socket/messages-recv.ts` (`handleCall`, `rejectCall`, call event pipeline)
  - `src/Types/Call.ts`
  - `src/Utils/generics.ts` (`getCallStatusFromNode`)
  - `src/WABinary/constants.ts` (call token availability)
  - socket send/query patterns in `src/Socket/socket.ts` and `src/Socket/Client/*`
  - composition chain through `src/Socket/index.ts`

- Repository history/context:
  - Outgoing call API is not currently provided in upstream Baileys issues/PRs.
  - Call-related PRs mostly address events/call-link improvements, not live outgoing call initiation with media.

- Community sources:
  - Multiple fake-call signaling snippets and issue logs show common offer node shape.
  - Evidence that malformed/incomplete signaling can be rejected by server (`403`).

## What Was Implemented

1. Added outgoing call types:
- `src/Types/Call.ts`
  - `WAInitiateCallOptions`
  - `WAInitiateCallResult`

2. Added outgoing call signaling methods:
- `src/Socket/messages-recv.ts`
  - `initiateCall(jid, options?)`
    - builds and sends `call` -> `offer` stanza
    - supports voice/video via `isVideo`
    - includes nodes: media (`audio`/`video`), `net`, `encopt`, `relaylatency`, `te`
    - caches offer metadata in `callOfferCache`
  - `cancelCall(callId, callTo)`
    - sends `call` -> `terminate` stanza
    - deletes offer cache entry

3. Socket exposure:
- Both methods are returned from `makeMessagesRecvSocket` and propagate through existing socket composition.

## What Is Left To Do

- Validate offer format against real accounts/devices to confirm ringing reliability.
- Implement full call session/media negotiation (beyond signaling):
  - acceptance flow details
  - ICE/DTLS-SRTP setup
  - transport and codec handling
- Add tests and docs for public API usage examples.

## Blockers Encountered

- Could not run requested `gh` CLI operations:
  - `gh` token for account `koptereli` is invalid in this environment.
  - API/network connectivity to GitHub is unavailable from shell.

- Could not create requested branch or commit:
  - sandbox denies writing Git refs (`.git/refs/...lock` operation not permitted).

- Could not run `yarn build`:
  - `yarn` is not installed in this environment.
  - `npm run build` also failed because dependencies/tooling (`tsc`) are not installed.

- Could not write to memory path:
  - `/Users/johnnyfive/.openclaw/workspace/memory/designs/` is outside writable sandbox roots.
  - Files were written in repo root instead as fallback.
