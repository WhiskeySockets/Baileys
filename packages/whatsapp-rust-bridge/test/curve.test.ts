import { describe, it, expect } from "bun:test";
import {
  generateKeyPair,
  calculateAgreement,
  calculateSignature,
  verifySignature,
  getPublicFromPrivateKey,
} from "../dist";

const random32 = () =>
  Buffer.from(
    Array.from({ length: 32 }, () => Math.floor(Math.random() * 256)),
  );

describe("curve primitives", () => {
  it("generates key pairs with expected structure", () => {
    const pair = generateKeyPair();
    expect(pair.privKey.length).toBe(32);
    expect(pair.pubKey.length).toBe(33);
    expect(pair.pubKey[0]).toBe(5);
  });

  it("calculates symmetric agreements", () => {
    const alice = generateKeyPair();
    const bob = generateKeyPair();
    const shared1 = calculateAgreement(bob.pubKey, alice.privKey);
    const shared2 = calculateAgreement(alice.pubKey, bob.privKey);
    expect(shared1).toEqual(shared2);
  });

  it("validates signatures", () => {
    const pair = generateKeyPair();
    const message = Buffer.from("message");
    const signature = calculateSignature(pair.privKey, message);
    expect(signature.length).toBe(64);
    expect(verifySignature(pair.pubKey, message, signature)).toBe(true);
    const tampered = Buffer.from(signature);
    tampered[0] ^= 0xff;
    expect(verifySignature(pair.pubKey, message, tampered)).toBe(false);
  });

  it("derives public key from private key", () => {
    const privKey = random32();
    const prefixedPub = getPublicFromPrivateKey(privKey);
    expect(prefixedPub.length).toBe(33);
    expect(prefixedPub[0]).toBe(5);
    const agreement = calculateAgreement(prefixedPub, privKey);
    expect(agreement.length).toBe(32);
  });

  it("correctly derives public key from an all-zero private key (verifies clamping)", () => {
    const inputPrivateKey = new Uint8Array(32);

    const expectedPublicKey = new Uint8Array([
      // The 0x05 prefix for the DJB key type
      0x05,
      // The raw 32-byte public key that your Rust code correctly generates
      105, 62, 71, 151, 44, 175, 82, 124, 120, 131, 173, 27, 57, 130, 47, 2,
      111, 71, 219, 42, 176, 225, 145, 153, 85, 184, 153, 58, 160, 68, 17, 209,
    ]);

    const result = getPublicFromPrivateKey(inputPrivateKey);

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(33);
    expect(result).toEqual(expectedPublicKey);
  });

  it("rejects malformed keys", () => {
    const privKey = random32();
    expect(() => calculateSignature(Buffer.alloc(0), Buffer.alloc(1))).toThrow(
      "Invalid private key type",
    );
    expect(() =>
      calculateSignature(Buffer.from("bad"), Buffer.alloc(1)),
    ).toThrow("Incorrect private key length");
    const badPub = Buffer.alloc(31);
    expect(() => calculateAgreement(badPub, privKey)).toThrow(
      "Invalid public key",
    );
    const badSig = Buffer.alloc(10);
    const pair = generateKeyPair();
    expect(() => verifySignature(pair.pubKey, Buffer.alloc(1), badSig)).toThrow(
      "Invalid signature",
    );
  });
});
