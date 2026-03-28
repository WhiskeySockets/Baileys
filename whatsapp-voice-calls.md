# WhatsApp Outgoing Voice Calls in Baileys

Date: 2026-02-25

## Scope
Design and initial implementation for outgoing call support in Baileys, focusing on signaling first (call offer/cancel) and documenting constraints for full media calls.

## Research Summary

### Baileys internals (current state)

1. `src/Socket/messages-recv.ts`
- Incoming calls are handled in `handleCall`.
- Incoming call status is normalized via `getCallStatusFromNode`.
- Existing call action implemented: `rejectCall(callId, callFrom)` sends:
  - top node `call` (`from` self, `to` caller)
  - child `reject` with attrs: `call-id`, `call-creator`, `count: '0'`.
- Call offers are cached in `callOfferCache` for correlating later `accept/reject/terminate/timeout` updates.

2. `src/Utils/generics.ts`
- `getCallStatusFromNode` mapping:
  - `offer` / `offer_notice` -> `offer`
  - `terminate` with reason `timeout` -> `timeout`
  - `terminate` otherwise -> `terminate`
  - `reject` -> `reject`
  - `accept` -> `accept`
  - fallback -> `ringing`

3. `src/Types/Call.ts`
- Defines current `WACallEvent` and `WACallUpdateType` for incoming call event pipeline.

4. `src/WABinary/constants.ts`
- Call-related tokens already exist (`call`, `call-id`, `call-creator`, `offer`, `accept`, `reject`, `terminate`, `audio`, `video`, `net`, `encopt`, `relaylatency`, `te`, `capability`, etc.).

5. `src/Socket/Client/*` and lower socket layer (`src/Socket/socket.ts`)
- Outgoing stanzas are sent via `sendNode` (fire-and-forget) or `query` (send + wait response by message id).
- For call signaling requiring server ack/error, `query` is the safer pattern (same as existing `rejectCall`).

6. Socket composition
- Layer chain: `makeSocket` -> `makeChatsSocket` -> `makeGroupsSocket` -> `makeNewsletterSocket` -> `makeMessagesSocket` -> `makeMessagesRecvSocket` -> `makeBusinessSocket` -> `makeCommunitiesSocket` -> `makeWASocket`.
- Any method added in `makeMessagesRecvSocket` and returned with `...sock` propagates to final socket.

### GitHub issue/PR research

`gh` CLI could not be used here (`koptereli` token invalid + no API connectivity), so equivalent web lookup was used.

Findings:
- Issue `#1873` asks for call API; maintainer response indicates there is no current outgoing-call API surface in Baileys.
- PRs with `call` mostly cover event parsing or call-link behavior, not real outgoing call media/session support (e.g. PR `#2190` is call-event metadata related).

### Community/fork research

Relevant external implementations/snippets found:
- StackOverflow snippet shows outgoing `call` `offer` stanza with child nodes:
  - media node (`audio`/`video`)
  - `net`
  - `encopt` with short random key
  - `relaylatency`
  - `te`
- Another public issue/thread shows similar fake-call stanza and server `403` responses when signaling is insufficient.
- Older forked-style code shows a similar `sendCall` function plus `terminate` signaling.

Interpretation: basic signaling node shape is known; reliability depends on additional protocol constraints not yet fully reverse-engineered.

## WhatsApp Call Signaling Shape (inferred)

Observed/inferred call offer stanza:

```xml
<call from="<my_jid>" to="<peer_jid>" id="<stanza_id>" t="<unix_ts>">
  <offer call-id="<call_id>" call-creator="<my_jid>" count="0">
    <audio|video />
    <net />
    <encopt key="<hex>" />
    <relaylatency />
    <te />
  </offer>
</call>
```

Other call actions:
- Reject incoming call:
  - `<call><reject call-id="..." call-creator="..." count="0"/></call>`
- Terminate/cancel call:
  - `<call><terminate call-id="..." call-creator="..." count="0"/></call>`

Server may emit additional `call` class traffic during signaling/telemetry (seen in logs), and malformed/incomplete sequences may return ack/error (including `403`).

## What Baileys Had vs Missing

Already implemented:
- Incoming call event parsing (`offer`, `ringing`, `accept`, `reject`, `terminate`, `timeout`)
- Incoming call reject action (`rejectCall`)
- Call-link creation (event/schedule call link), not live direct call initiation

Missing before this work:
- Outgoing direct call initiation API
- Outgoing call cancellation API
- Media/session negotiation for real VoIP (ICE/DTLS-SRTP)

## Outgoing Call Flow (Target)

1. Offer
- Send `call` stanza with `offer` child and media type (`audio` or `video`).

2. Ringing
- Wait for incoming call-related updates from WA (`CB:call`) and map to `ringing`/other statuses.

3. Accept/Reject/Terminate
- Remote side answers/rejects or either side terminates.
- Local can cancel via `terminate` signaling.

4. Media setup (future)
- On accept, establish secure media transport. This is not implemented in this phase.

## WebRTC/SRTP Requirements (full implementation)

For true voice media, signaling-only is not enough:
- Need mapping of WhatsApp call-session negotiation fields beyond current minimal stanza.
- Need media engine capable of RTP/RTCP, ICE, DTLS-SRTP.
- Candidate Node path would likely require native WebRTC binding (`wrtc` / node-webrtc class of tooling) or equivalent native transport stack.
- Need to interoperate with WhatsApp-specific call auth/crypto/relay expectations; generic WebRTC alone may not be sufficient.

Conclusion: full media call support is a multi-phase reverse-engineering + transport project.

## Implementation Plan

Phase 1 (implemented now):
- Add `initiateCall(jid, { isVideo })` signaling method.
- Add `cancelCall(callId, jid)` signaling method.
- Keep existing `rejectCall` for incoming calls.
- Cache outgoing offer metadata in `callOfferCache` for follow-up status correlation.

Phase 2:
- Add richer call session manager (state machine, retries, timeout handling).
- Capture and classify all `CB:call` payload variants for outgoing sessions.

Phase 3:
- Add experimental media layer behind feature flag.
- Test interop across voice/video, 1:1 and group scenarios.

Phase 4:
- Harden API, error surfaces, and docs.

## Risks / Blockers

- Protocol opacity: WhatsApp call signaling/media details are not fully documented.
- Server-side validation: incomplete offers may be rejected (`403`).
- Media stack complexity: secure real-time transport likely needs native/runtime support.
- Environment constraints here prevented live end-to-end runtime validation with authenticated device.

## Minimum Valuable Alternative

Yes: even without media transport, sending a valid enough offer/terminate signaling API is valuable:
- Enables protocol exploration and staged rollout.
- Supports experiments where recipient device may ring depending on account/server constraints.
- Creates a stable API surface for next-phase media implementation.

## What Was Actually Implemented (this iteration)

- New call types in `src/Types/Call.ts`:
  - `WAInitiateCallOptions`
  - `WAInitiateCallResult`

- New methods in `src/Socket/messages-recv.ts`:
  - `initiateCall(jid, options)`
    - Sends `call` -> `offer` with `audio/video`, `net`, `encopt`, `relaylatency`, `te`
    - Uses `query()` for server response handling
    - Stores offer metadata in `callOfferCache`
    - Returns `{ callId, to, isVideo }`
  - `cancelCall(callId, callTo)`
    - Sends `call` -> `terminate`
    - Removes cached offer entry

- Socket composition exposure:
  - Methods are returned from `makeMessagesRecvSocket` and therefore propagate through existing `...sock` composition to final `makeWASocket`.

## References

- Baileys issue search (outgoing call): https://github.com/WhiskeySockets/Baileys/issues?q=is%3Aissue+outgoing+call
- Baileys PR search (call): https://github.com/WhiskeySockets/Baileys/pulls?q=is%3Apr+call
- Issue #1873 (`calling button`): https://github.com/WhiskeySockets/Baileys/issues/1873
- PR #2190 (call event metadata): https://github.com/WhiskeySockets/Baileys/pull/2190
- EvolutionAPI issue with incoming call node/logs: https://github.com/EvolutionAPI/evolution-api/issues/1238
- HiFlyer issue (`fake-call` / 403 examples): https://github.com/HiFlyer-dev/baileys/issues/118
- StackOverflow fake call stanza snippet: https://stackoverflow.com/questions/75963302/why-is-my-code-for-whatsapp-fake-call-not-working
- Community code sample (`sendCall` shape): https://www.doooo.fun/blog/2024/01/16/node-whatsapp-web
