# Outgoing Call Implementation Summary

## What was implemented

### 1) New socket API: `requestCall(jid: string)`
- File: `src/Socket/chats.ts`
- Added `requestCall` method to initiate outgoing voice call signaling.
- Method behavior:
  - Ensures auth user (`me.id`) exists.
  - Sends a `call` query stanza to normalized target jid.
  - Uses `offer` child stanza with:
    - `call-id`: generated via `generateMessageID()`
    - `call-creator`: current user jid
    - `count`: `"0"`
  - Includes `audio` child node to mark voice intent.

### 2) Exported through socket surface
- File: `src/Socket/chats.ts`
- Added `requestCall` in the returned socket object so it is available to consumers through `makeWASocket()`.
- Since Baileys socket typing is inferred from layered socket returns, TypeScript surface includes this method automatically.

### 3) Documentation update
- File: `README.md`
- Added new section:
  - `## Request Voice Call`
  - Usage example: `await sock.requestCall(jid)`
  - Clarifies this is signaling only (WebRTC media setup out of scope).
- Added TOC entry for the section.

## Signaling stanza used

`requestCall` sends:

- top-level: `tag: 'call'`
- attrs:
  - `from: meId`
  - `to: jidNormalizedUser(jid)`
  - `id: generateMessageTag()`
- content:
  - `offer` with attrs:
    - `call-id`
    - `call-creator`
    - `count: '0'`
  - `audio` child marker

## Validation

Attempted requested commands:
- `yarn install` -> failed (`yarn: command not found`)
- `corepack yarn install` -> failed (`corepack: command not found`)
- `npm run build` -> failed (`tsc: command not found`) because deps not installed in this sandbox
- `npm run lint` -> failed (`tsc: command not found`) for same reason

## Environment constraints encountered

1. Git ref writes are blocked in this sandbox:
   - Could not create/switch branch (`feature/outgoing-calls`) because `.git/refs/...` writes are denied.
   - Could not commit or push from this environment.

2. Parent-directory writes are blocked:
   - Could not write `../RESEARCH.md` or `../IMPLEMENTATION.md`.
   - Wrote `RESEARCH.md` and `IMPLEMENTATION.md` in repo root instead.

## Suggested commands to run in a full local environment

```bash
git checkout -b feature/outgoing-calls
yarn install
yarn build
yarn lint
git add src/Socket/chats.ts README.md RESEARCH.md IMPLEMENTATION.md
git commit -m "feat: add outgoing voice call request signaling API"
git push koptereli feature/outgoing-calls
```
