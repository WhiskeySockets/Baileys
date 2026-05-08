import { describe, expect, it } from "bun:test";
import { ProtocolAddress } from "../dist";

describe("ProtocolAddress", () => {
  it("encodes and decodes correctly", () => {
    const addr = new ProtocolAddress("alice", 5);
    expect(addr.toString()).toBe("alice.5");
    const decoded = ProtocolAddress.from("alice.5");
    expect(decoded).toBeInstanceOf(ProtocolAddress);
    expect(decoded.id).toBe("alice");
    expect(decoded.deviceId).toBe(5);
  });

  it("parses zero-padded device ids and ignores trailing segments", () => {
    const decoded = ProtocolAddress.from("carol.007.extra");
    expect(decoded.id).toBe("carol");
    expect(decoded.deviceId).toBe(7);
    expect(decoded.toString()).toBe("carol.7");
  });

  it("compares using is()", () => {
    const addr1 = new ProtocolAddress("bob", 1);
    const addr2 = new ProtocolAddress("bob", 1);
    const addr3 = new ProtocolAddress("bob", 2);
    expect(addr1.is(addr2)).toBe(true);
    expect(addr1.is(addr3)).toBe(false);
    // @ts-expect-error runtime guard: null is invalid
    expect(() => addr1.is(null)).toThrow();
    // @ts-expect-error runtime guard: plain objects are invalid
    expect(() => addr1.is({ id: "bob", deviceId: 1 })).toThrow();
  });

  it("rejects malformed inputs", () => {
    expect(() => ProtocolAddress.from("bad")).toThrow(
      "Invalid address encoding",
    );
    // @ts-expect-error runtime guard: must pass a string
    expect(() => ProtocolAddress.from(42)).toThrow("Invalid address encoding");
    expect(() => ProtocolAddress.from("alice.device")).toThrow(
      "Invalid address encoding",
    );
    // @ts-expect-error Testing invalid input
    expect(() => new ProtocolAddress(5, 1)).toThrow("id required for addr");
    expect(() => new ProtocolAddress("al.ice", 1)).toThrow(
      "encoded addr detected",
    );
    // @ts-expect-error Testing invalid input
    expect(() => new ProtocolAddress("alice", "1")).toThrow(
      "number required for deviceId",
    );
  });
});
