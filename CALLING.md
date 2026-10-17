# Voice calling with Baileys-X

Baileys is a messaging library: it implements WhatsApp's chat protocol, not the
WebRTC/RTP stack that carries call audio. It can receive call stanzas (the `call`
event) and reject a call (`sock.rejectCall(callId, callFrom)`), but it does not
negotiate SRTP, does not run Opus, and does not ship a media engine.

This page records the evaluation of [SheIITear/baileys-caller](https://github.com/SheIITear/baileys-caller)
and explains how to use it together with Baileys-X.

## Verdict: not bundled into Baileys-X

`baileys-caller` can place outbound 1:1 voice calls by running WhatsApp Web's
VoIP WASM stack in a 20-thread `worker_threads` pool and feeding the RTP relay.
It is a separate MIT-licensed package, and it is **not** absorbed into this
repository. The reasons:

| Concern                                                    | Impact if bundled                                                                                                 |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| ~11 MB `whatsapp.wasm` + `loader.js` + `worker-modules.js` | Every Baileys user would download and ship the binary, including users who never call                             |
| `worker_threads` pool of 20 workers per client             | Starts browser-style pthreads inside a library that only needs a socket                                           |
| `ffmpeg` on `PATH` and `@roamhq/wrtc`                      | Native/runtime requirements that cannot be optional peer deps without a fallback path                             |
| Hardcoded `import("@whiskeysockets/baileys")`              | The caller resolves utility functions from the official package name; bundling would create a second Baileys copy |
| Voice-only, outbound-only                                  | No group calls, no video, no inbound call handling; it is an SDK, not a protocol layer                            |

Bundling it would make the default install heavier and more fragile for
everyone, while the caller already works as an opt-in dependency. The useful
part that _is_ in Baileys-X is the signaling surface the caller needs, which
this fork exposes (see the table below).

## What Baileys-X provides

| API used by `baileys-caller`                                           | Baileys-X                                                                                |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `sock.authState.keys.get/set` (`tctoken`)                              | present                                                                                  |
| `sock.signalRepository` (`encryptGroupMessage`, sessions, LID mapping) | present                                                                                  |
| `sock.generateMessageTag()`                                            | present                                                                                  |
| `sock.query()` / `sock.sendNode()`                                     | present                                                                                  |
| `sock.waitForMessage(tag, timeoutMs)`                                  | present                                                                                  |
| `sock.getUSyncDevices(jids, ignoreZeroDevices, forceQuery)`            | present                                                                                  |
| `sock.presenceSubscribe(jid)`                                          | present                                                                                  |
| `sock.ws.on("CB:call")` / `sock.ws.on("CB:receipt")`                   | present                                                                                  |
| `parseAndInjectE2ESessions` export                                     | present (`Utils/signal`)                                                                 |
| `sock.getPrivacyTokens(jids)`                                          | exposed as `sock.issuePrivacyTokens(jids, timestamp?)`, which returns the same `iq` node |

## Using `baileys-caller` with Baileys-X

1. Build the caller from source (it is not published on npm):

   ```bash
   git clone https://github.com/SheIITear/baileys-caller
   cd baileys-caller
   npm install
   npm run build
   ```

2. The caller imports `@whiskeysockets/baileys` for its utility functions
   (`jidNormalizedUser`, `getBinaryNodeChild`, `parseAndInjectE2ESessions`, ...).
   Point that specifier at this fork with an npm alias so only one Baileys is
   installed:

   ```json
   {
   	"dependencies": {
   		"baileys": "7.0.0-rc14",
   		"@whiskeysockets/baileys": "npm:baileys@7.0.0-rc14",
   		"baileys-caller": "file:../baileys-caller"
   	}
   }
   ```

   If the fork is published under a different package name, alias that name
   instead: `"@whiskeysockets/baileys": "npm:<fork-name>@7.0.0-rc14"`. The alias
   must resolve to a registry package; install git forks with their package
   name and use the alias only for the scoped specifier.

3. The caller mints trusted-contact tokens by calling
   `sock.getPrivacyTokens(jids)` on the socket it creates itself (`VoipClient`
   does not accept an external socket). Baileys-X exposes the same IQ as
   `sock.issuePrivacyTokens(jids, timestamp?)`, but not under that name. The
   caller handles the miss gracefully: `requestTcToken` catches the failed
   lookup and returns any token already cached in `authState.keys` (`tctoken`),
   so calls work out of the box (the lookup fails immediately, not after a
   timeout).
   If you want fresh tokens minted automatically, keep a small local patch of
   `src/signaling.mts`:

   ```ts
   const response = await ((this.#sock as any).getPrivacyTokens ?? (this.#sock as any).issuePrivacyTokens)([userJid])
   ```

   and rebuild the caller. Do not add `getPrivacyTokens` to Baileys-X just for
   this: `issuePrivacyTokens` is already the public API for the same operation.

4. Requirements: Node.js >= 20, `ffmpeg` on `PATH`, and the WASM assets in the
   caller's `assets/wasm/`. Audio sources can be MP3, WAV or `"silence"`.

## Limitations

- Outbound 1:1 voice calls only. No group calls, video, or inbound calls.
- The VoIP engine is reverse-engineered from WhatsApp Web assets. It is not
  covered by any WhatsApp API agreement; use it with accounts you control and
  expect it to break when WhatsApp rotates the WASM build.
- `baileys-caller` is not bundled, tested, or versioned with Baileys-X. Bugs in
  the call path belong to its upstream repository.

## Related

- Rejecting an incoming call: see [Reject Call](./README.md#reject-call).
- Call event payloads: `Call` type in `src/Types/Call.ts`.
