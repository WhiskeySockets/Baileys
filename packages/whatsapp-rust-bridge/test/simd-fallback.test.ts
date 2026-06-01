import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const probe = resolve(import.meta.dir, "helpers/probe-runtime.ts");

function runProbe(extraEnv: Record<string, string> = {}) {
  const r = spawnSync("bun", ["run", probe], {
    env: { ...process.env, ...extraEnv },
    encoding: "utf8",
  });
  if (r.status !== 0) {
    throw new Error(
      `probe exited with ${r.status}\nstdout: ${r.stdout}\nstderr: ${r.stderr}`,
    );
  }
  const lines = r.stdout.trim().split("\n");
  return JSON.parse(lines[lines.length - 1]);
}

describe("SIMD / non-SIMD initialization paths", () => {
  test("default path uses SIMD wasm and exposes working bridge", () => {
    const out = runProbe();
    expect(out.simdActive).toBe(true);
    expect(out.encodedLen).toBeGreaterThan(0);
    expect(out.decodedTag).toBe("iq");
    expect(out.decodedAttrsOk).toBe(true);
    expect(out.md5Hex).toBe("900150983cd24fb0d6963f7d28e17f72");
    expect(out.hkdfLen).toBe(32);
  });

  test("forced non-SIMD path falls back to nosimd wasm with identical output", () => {
    const out = runProbe({ WHATSAPP_RUST_BRIDGE_FORCE_NOSIMD: "1" });
    expect(out.simdActive).toBe(false);
    expect(out.encodedLen).toBeGreaterThan(0);
    expect(out.decodedTag).toBe("iq");
    expect(out.decodedAttrsOk).toBe(true);
    expect(out.md5Hex).toBe("900150983cd24fb0d6963f7d28e17f72");
    expect(out.hkdfLen).toBe(32);
  });

  test("SIMD and non-SIMD paths produce byte-identical encode output", () => {
    const probeBytes = resolve(import.meta.dir, "helpers/probe-encode-bytes.ts");
    const simd = spawnSync("bun", ["run", probeBytes], {
      env: { ...process.env },
      encoding: "utf8",
    });
    const noSimd = spawnSync("bun", ["run", probeBytes], {
      env: { ...process.env, WHATSAPP_RUST_BRIDGE_FORCE_NOSIMD: "1" },
      encoding: "utf8",
    });
    expect(simd.status).toBe(0);
    expect(noSimd.status).toBe(0);

    const simdLines = simd.stdout.trim().split("\n");
    const noSimdLines = noSimd.stdout.trim().split("\n");
    const simdOut = JSON.parse(simdLines[simdLines.length - 1]);
    const noSimdOut = JSON.parse(noSimdLines[noSimdLines.length - 1]);
    expect(simdOut.simd).toBe(true);
    expect(noSimdOut.simd).toBe(false);
    // Byte-identical wire output and structurally identical decoded form.
    expect(simdOut.encHex).toBe(noSimdOut.encHex);
    expect(simdOut.decoded).toEqual(noSimdOut.decoded);
  });
});
