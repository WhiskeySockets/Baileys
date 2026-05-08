# Baileys monorepo

This repository hosts two npm packages developed together:

| Package | Path | Description |
|---|---|---|
| [`baileys`](./packages/baileys) | `packages/baileys/` | The TypeScript WhatsApp Web library. Published to npm as `baileys` (and mirrored as `@whiskeysockets/baileys`). |
| [`whatsapp-rust-bridge`](./packages/whatsapp-rust-bridge) | `packages/whatsapp-rust-bridge/` | Rust → WebAssembly utilities consumed by `baileys` (binary protocol, Signal helpers, app-state crypto, etc). Published to npm as `whatsapp-rust-bridge`. |

If you want to **use Baileys**, install it from npm — see [`packages/baileys/README.md`](./packages/baileys/README.md). You don't need to clone this repo.

If you want to **contribute**, read [`AGENTS.md`](./AGENTS.md). It covers setup, code style, commits, what not to touch, and how the bridge's prebuilt artifact is fetched at install time so contributors don't need a Rust toolchain.

## Quick start (contributors)

```bash
corepack enable
pnpm install                    # postinstall fetches the prebuilt bridge dist/ from npm
pnpm build                      # builds the baileys library
pnpm test                       # 403 unit + integration tests
pnpm lint                       # tsc + eslint
```

To work on the Rust crate (needs `cargo`, `wasm-pack`, `wasm-opt`, `bun`):

```bash
WHATSAPP_RUST_BRIDGE_SKIP_PREBUILT=1 pnpm install
pnpm build:bridge
```

## Releasing

- **baileys** — tag `v<version>` (the `publish-release` workflow runs `npm publish` from `packages/baileys/`).
- **whatsapp-rust-bridge** — tag `whatsapp-rust-bridge@<version>` (the `bridge-release` workflow rebuilds WASM, publishes to npm, and opens a PR refreshing `dist.sha256`).

## Layout

```
packages/
  baileys/                  # the npm `baileys` library (src/, WAProto/, Example/, …)
  whatsapp-rust-bridge/     # the Rust crate + TS wrapper that ships WASM inline as base64
proto-extract/              # standalone tool that refreshes WAProto from web.whatsapp.com
docs/                       # design notes & investigation write-ups
.github/workflows/          # CI: build, test, e2e, lint, bridge-build, bridge-release, …
```
