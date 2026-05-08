import { describe, it, expect } from "bun:test";
import { randomBytes } from "crypto";
import { md5, hkdf } from "../dist";
import {
  md5 as baileysMd5,
  hkdf as baileysHkdf,
} from "baileys/lib/Utils/crypto";

function hex(buffer: Uint8Array | Buffer): string {
  return Buffer.from(buffer).toString("hex");
}

describe("Crypto Parity: MD5", () => {
  it("should hash identically to Baileys", () => {
    const data = Buffer.from("MD5 test data");

    const wasmResult = md5(data);
    const baileysResult = baileysMd5(data);

    expect(hex(wasmResult)).toBe(hex(baileysResult));
  });

  it("should hash empty buffer identically", () => {
    const data = Buffer.alloc(0);

    const wasmResult = md5(data);
    const baileysResult = baileysMd5(data);

    expect(hex(wasmResult)).toBe(hex(baileysResult));
  });

  it("should hash large data identically", () => {
    const data = randomBytes(10000);

    const wasmResult = md5(data);
    const baileysResult = baileysMd5(data);

    expect(hex(wasmResult)).toBe(hex(baileysResult));
  });
});

describe("Crypto Parity: HKDF", () => {
  it("should derive keys identically to Baileys", async () => {
    const ikm = randomBytes(32);
    const salt = randomBytes(32);
    const info = "test info";

    const wasmResult = hkdf(ikm, 64, { salt, info });
    const baileysResult = await baileysHkdf(ikm, 64, { salt, info });

    expect(hex(wasmResult)).toBe(hex(baileysResult));
  });

  it("should derive with empty salt identically", async () => {
    const ikm = randomBytes(32);

    const wasmResult = hkdf(ikm, 32, { salt: null, info: undefined });
    const baileysResult = await baileysHkdf(ikm, 32, {});

    expect(hex(wasmResult)).toBe(hex(baileysResult));
  });

  it("should derive different lengths identically", async () => {
    const ikm = randomBytes(32);
    const salt = randomBytes(16);

    for (const length of [16, 32, 48, 64, 128]) {
      const wasmResult = hkdf(ikm, length, { salt, info: undefined });
      const baileysResult = await baileysHkdf(ikm, length, { salt });

      expect(hex(wasmResult)).toBe(hex(baileysResult));
    }
  });
});
