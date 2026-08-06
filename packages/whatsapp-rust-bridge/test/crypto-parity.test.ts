import { describe, it, expect } from "@jest/globals";
import { createHash, hkdfSync, randomBytes } from "crypto";
import { md5, hkdf } from "../dist/index.js";

// Node itself, not the JS client: MD5 and HKDF are standard, so the reference
// is the algorithm rather than another implementation of it.
const nodeMd5 = (data: Uint8Array) =>
  createHash("md5").update(data).digest();

const nodeHkdf = async (
  ikm: Uint8Array,
  length: number,
  { salt, info }: { salt?: Uint8Array; info?: string } = {},
) =>
  Buffer.from(
    hkdfSync(
      "sha256",
      ikm,
      salt ?? Buffer.alloc(0),
      info ? Buffer.from(info) : Buffer.alloc(0),
      length,
    ),
  );

function hex(buffer: Uint8Array | Buffer): string {
  return Buffer.from(buffer).toString("hex");
}

describe("Crypto Parity: MD5 vs node:crypto", () => {
  it("should hash identically to node:crypto", () => {
    const data = Buffer.from("MD5 test data");

    const wasmResult = md5(data);
    const nodeResult = nodeMd5(data);

    expect(hex(wasmResult)).toBe(hex(nodeResult));
  });

  it("should hash empty buffer identically", () => {
    const data = Buffer.alloc(0);

    const wasmResult = md5(data);
    const nodeResult = nodeMd5(data);

    expect(hex(wasmResult)).toBe(hex(nodeResult));
  });

  it("should hash large data identically", () => {
    const data = randomBytes(10000);

    const wasmResult = md5(data);
    const nodeResult = nodeMd5(data);

    expect(hex(wasmResult)).toBe(hex(nodeResult));
  });
});

describe("Crypto Parity: HKDF vs node:crypto (RFC 5869)", () => {
  it("should derive keys identically to node:crypto", async () => {
    const ikm = randomBytes(32);
    const salt = randomBytes(32);
    const info = "test info";

    const wasmResult = hkdf(ikm, 64, { salt, info });
    const nodeResult = await nodeHkdf(ikm, 64, { salt, info });

    expect(hex(wasmResult)).toBe(hex(nodeResult));
  });

  it("should derive with empty salt identically", async () => {
    const ikm = randomBytes(32);

    const wasmResult = hkdf(ikm, 32, {});
    const nodeResult = await nodeHkdf(ikm, 32, {});

    expect(hex(wasmResult)).toBe(hex(nodeResult));
  });

  it("should derive different lengths identically", async () => {
    const ikm = randomBytes(32);
    const salt = randomBytes(16);

    for (const length of [16, 32, 48, 64, 128]) {
      const wasmResult = hkdf(ikm, length, { salt, info: undefined });
      const nodeResult = await nodeHkdf(ikm, length, { salt });

      expect(hex(wasmResult)).toBe(hex(nodeResult));
    }
  });
});
