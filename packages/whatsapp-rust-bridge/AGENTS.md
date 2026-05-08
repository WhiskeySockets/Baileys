# WhatsApp Rust Bridge - AI Coding Guidelines

Quick orientation for AI agents and contributors: this repo is a Rust → WebAssembly bridge that provides binary encoding/decoding utilities for WhatsApp protocols and a small LibSignal helper layer with JS bindings and TS types.

Core summary

- Rust WASM core (`src/`) exposes functions (via `wasm_bindgen`) consumed in JS/TS.
- TypeScript wrapper (`ts/binary.ts`) bundles wasm + lightweight entry API and exposes the `dist/` exports.
- Tests are in `test/` (Bun) and benches in `benches/` (Mitata).

Key files to review

- `src/wasm_api.rs` — JS ↔ Rust conversions, zero-copy decoding, caching, wasm exports (`encode_node`/`decode_node`).
- `src/key_helper_api.rs` — LibSignal helpers and key generation exposed to JS.
- `ts/binary.ts` + `ts/macro.ts` — WASM initialization and build-time embedding for runtime/CI.
- `test/` — Rigorous round-trip tests that illustrate supported content/attr conventions.

Important patterns (do not deviate without a PR note)

- Zero-copy decoding: `InternalBinaryNode` keeps an owned `Arc<Box<[u8]>>` buffer and returns `NodeRef` references (unsafe `mem::transmute` into `'static`). Be careful when adjusting lifetimes.
- JS → Rust encoding: `js_to_node()` coerces non-string attrs to strings and skips empty values; content can be `string`, `Uint8Array` or `BinaryNode[]`.
- Content types: decoded string content is returned as `Uint8Array` (UTF-8). Known token strings are encoded efficiently (small bytes). Ensure tests cover token vs binary behavior.
- Export naming: `#[wasm_bindgen(js_name = XXX)]` controls JS names (e.g., `encode_node` → `encodeNode`). Keep `typescript_custom_section` updated for TS types.

Build, test & release flow

- Local dev build (WASM + TS):
  - `bun run build` — runs `wasm-pack build` then TypeScript bundling; produces `pkg/` and `dist/`.
  - `bun test` — run unit tests in `test/`. (always remember to run `bun run build` first to ensure latest changes are tested)
  - `bun run bench` — build + run benches in `benches/`.
- Ensure you have `wasm-pack`, `bun`, and `wasm-opt` available when building.

Conventions & examples

- Naming: Rust functions are `snake_case`, exports use a `js_name` camelCase; TS uses camelCase for functions.
- Mutation model: `InternalBinaryNode` exposes JS getters/setters for `attrs` and `content`. Tests mutate and re-encode — ensure setters reflect intended semantics and re-encode correctly.

Tests & contributing guidance

- Follow the round-trip tests in `test/binary.test.ts` for behavior coverage: token strings, binary vs string content, attr coercion, and mutation/round-trip persistence.
- Prefer adding tests whenever changing encoding/decoding semantics; maintain parity between `encodeNode`/`decodeNode`.

Gotchas

- Unsafe lifetime coercion: the crate uses `transmute` to create a `'static` slice for NodeRef — any change must preserve memory ownership semantics.
- Type conversions: `js_to_node` converts numbers/booleans to strings and drops null/undefined/empty attrs.
- Build order matters: wasm build (pkg) must be generated before TS bundling.

If anything's unclear, ask for the target: (a) add a new wasm export, (b) change payload format, or (c) alter the Node lifetime/caching semantics.

— End of guide —

# WhatsApp Rust Bridge - AI Coding Guidelines

## Architecture Overview

This is a high-performance Rust-WebAssembly bridge for WhatsApp's binary protocol. The core architecture consists of:

- **Rust WASM Core** (`src/`): Zero-copy binary encoding/decoding using `wacore-binary` crate
- **TypeScript/JavaScript Layer** (`ts/`): WASM initialization and API exports

## Key Design Patterns

### Zero-Copy Decoding

- `WasmNode` struct holds references to WASM memory, avoiding copies
- Use `decodeNode()` for lazy access to decoded data
- Memory managed by custom Talc allocator (see `src/lib.rs`)

### Content Type Handling

- **Strings**: Passed as `Uint8Array` in decoded content (always UTF-8 encoded)
- **Binary data**: Direct `Uint8Array` representation
- **Token strings**: Compressed to single bytes (e.g., "receipt" → 5 bytes)
- Distinguish by input type: `string` vs `Uint8Array` in `INode.content`

### Node Structure

```typescript
// For encoding (input)
interface INode {
  tag: string;
  attrs: { [key: string]: string };
  content?: INode[] | string | Uint8Array;
}

// For decoding (output handle)
class WasmNode {
  readonly tag: string;
  readonly children: INode[];
  readonly content?: Uint8Array;
  getAttribute(key: string): string | undefined;
  getAttributes(): { [key: string]: string };
}
```

## Build & Development Workflow

### Primary Commands

- **Full build**: `bun run build` (WASM + TS bundle + declarations)
- **Test**: `bun test` (runs `test/binary.test.ts`)
- **Benchmark**: `bun run bench` (builds then runs `benches/binary.ts`)

### Testing Patterns

- Use Bun's test runner (`bun:test`)
- Round-trip testing: encode → decode → compare
- Content type verification: string vs binary handling
- Error case testing: truncated data, invalid inputs

## Code Organization

### File Structure

- `src/wasm_api.rs` - Core WASM bindings and conversion logic
- `src/wasm_types.rs` - TypeScript type definitions via `typescript_custom_section`
- `ts/binary.ts` - JavaScript entry point with WASM initialization
- `Cargo.toml` - Rust dependencies (note: uses private `wacore-binary` crate)

### Naming Conventions

- Rust: `snake_case` functions, `PascalCase` structs
- JavaScript: `camelCase` functions, `PascalCase` classes/interfaces
- WASM exports: `js_name` attributes for camelCase (e.g., `encode_node` → `encodeNode`)

## Performance Considerations

### Memory Management

- Custom Talc allocator optimized for WASM
- Zero-copy where possible (decoding)
- Reuse buffers with `encodeNodeTo()` for hot paths

### WASM Optimization

- Release profile: `lto = "fat"`, `opt-level = 3`, `codegen-units = 1`
- Custom `wasm-opt` flags for size/speed balance
- Target CPU: `native` for WASM builds

## Common Patterns

### Encoding Flow

```rust
// JS object → Rust Node → binary bytes
let node: Node = js_to_node(js_val)?;
let bytes = marshal(&node)?;
```

### Decoding Flow

```rust
// binary bytes → unpacked → NodeRef → WasmNode handle
let unpacked = unpack(data)?;
let node_ref = unmarshal_ref(unpacked)?;
let handle = WasmNode { _owned_data, node_ref };
```

### Attribute Access

- `getAttribute()` - Single attribute lookup
- `getAttributes()` - All attributes as JS object (single FFI call)
- `getAttributeAsJid()` - JID-specific parsing

## Dependencies & Tooling

- Declaration generation requires specific TypeScript config (`emitDeclarationOnly: true`)
- **Testing**: Bun test runner
- **Benchmarking**: Mitata
- **WASM**: wasm-pack + wasm-bindgen
- **Rust**: 2024 edition, custom allocator

## Gotchas

- WASM memory is static lifetime - careful with references
- Content encoding: strings become `Uint8Array` (not `string`) in decoded output
- Build order matters: WASM must be built before TypeScript bundling
- Declaration generation requires specific TypeScript config (`emitDeclarationOnly: true`)
