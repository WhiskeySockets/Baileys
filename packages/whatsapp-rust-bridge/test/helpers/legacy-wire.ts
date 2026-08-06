/**
 * What baileys@7.0.0-rc.9 produced for the nodes the parity suites use.
 *
 * Parity is still checked against the JS implementation, but from recorded
 * vectors rather than a build-time dependency on it. A node with no vector
 * throws instead of silently passing.
 *
 * To re-record after adding a case: `pnpm add -D baileys@7.0.0-rc.9`, run
 * `RECORD_LEGACY_VECTORS=1 pnpm test parity -- --runInBand`, commit the JSON,
 * then drop the dep again.
 */
import { createRequire } from "node:module";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type Node = { tag: string; attrs: Record<string, string>; content?: unknown };

const here = dirname(fileURLToPath(import.meta.url));
const store = resolve(here, "legacy-wire-vectors.json");
const recording = Boolean(process.env.RECORD_LEGACY_VECTORS);

const vectors: { encoded: Record<string, string>; decoded: Record<string, string> } = existsSync(store)
  ? JSON.parse(readFileSync(store, "utf8"))
  : { encoded: {}, decoded: {} };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacy: any = recording ? createRequire(import.meta.url)("baileys") : undefined;
/** Recording must run single-threaded (`--runInBand`); this merge is not atomic. */
const persist = () => {
  const onDisk = existsSync(store)
    ? JSON.parse(readFileSync(store, "utf8"))
    : { encoded: {}, decoded: {} };
  const merged = JSON.stringify({
    encoded: { ...onDisk.encoded, ...vectors.encoded },
    decoded: { ...onDisk.decoded, ...vectors.decoded },
  });
  writeFileSync(store + ".tmp", merged);
  renameSync(store + ".tmp", store);
};

/**
 * Key order is significant: the wire format encodes attributes in order.
 *
 * Buffers serialize as `{ type: 'Buffer', data: [...] }` because `toJSON` runs
 * before any replacer would, so that is the shape stored and revived.
 */
const canon = (value: unknown): string => JSON.stringify(value);

type BufferJson = { type: "Buffer"; data: number[] };

const isBufferJson = (value: unknown): value is BufferJson => {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as BufferJson;
  if (candidate.type !== "Buffer" || !Array.isArray(candidate.data)) return false;
  if (Object.keys(candidate).length !== 2) return false;
  // Buffer.from truncates out-of-range values instead of rejecting them, so a
  // hand-edited or truncated vector would revive as wrong bytes in silence.
  return candidate.data.every((byte) => Number.isInteger(byte) && byte >= 0 && byte <= 255);
};

const revive = (value: unknown): unknown => {
  if (isBufferJson(value)) return Buffer.from(value.data);
  if (
    typeof value === "object" &&
    value !== null &&
    (value as { type?: unknown }).type === "Buffer"
  ) {
    throw new Error("recorded vector has a malformed Buffer");
  }

  if (Array.isArray(value)) return value.map(revive);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as object).map(([k, v]) => [k, revive(v)]));
  }
  return value;
};

export function encodeBinaryNode(node: Node): Uint8Array {
  const key = canon(node);
  if (recording) {
    const out = legacy.encodeBinaryNode(node);
    vectors.encoded[key] = Buffer.from(out).toString("base64");
    persist();
    return out;
  }

  const hit = vectors.encoded[key];
  if (!hit) throw new Error(`no recorded rc.9 encoding for <${node.tag}>`);
  return new Uint8Array(Buffer.from(hit, "base64"));
}

export async function decodeBinaryNode(buffer: Uint8Array): Promise<Node> {
  const key = Buffer.from(buffer).toString("base64");
  if (recording) {
    const out = await legacy.decodeBinaryNode(buffer);
    vectors.decoded[key] = canon(out);
    persist();
    return out;
  }

  const hit = vectors.decoded[key];
  if (!hit) throw new Error("no recorded rc.9 decoding for this frame");
  return revive(JSON.parse(hit)) as Node;
}
