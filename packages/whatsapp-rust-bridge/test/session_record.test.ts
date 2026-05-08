import { describe, it, expect } from "bun:test";
import { SessionRecord } from "../dist";

describe("SessionRecord Compatibility & Migration", () => {
  it("should handle legacy libsignal-node JSON format by returning a safe empty session", () => {
    // Data structure mimicked from libsignal-node export
    const legacyJson = {
      _sessions: {
        BXqk9qn8XfEUVVcLkKn1L8h8KqzaeErLOS96ZZmrsoBu: {
          registrationId: 1210404435,
          currentRatchet: {
            ephemeralKeyPair: {
              pubKey: "BX9jjfcQKGX272pWhk/Y+/0UKCwVd3p6hTnKFXoFM0td",
              privKey: "sDoxJ80LYQv0eW3B+XXvX2FZEH7iqHiYqmF66gNQME8=",
            },
            lastRemoteEphemeralKey:
              "BcfU95Sq+QZ6e6iI3SbP0Z/vW6Z2EXoJwj3cezfBN8BK",
            previousCounter: 0,
            rootKey: "6X0/t/S+FXrhdJ41Zf+mzMqYIdNdRm8oY5RsupUnXc4=",
          },
          indexInfo: {
            baseKey: "BXqk9qn8XfEUVVcLkKn1L8h8KqzaeErLOS96ZZmrsoBu",
            baseKeyType: 2,
            closed: -1,
            used: 1763603510595,
            created: 1763603510595,
            remoteIdentityKey: "BbUDizL+1P8AQINzVbV8jhT+WRfajaiWy6zH/ap8MoAm",
          },
          _chains: {},
        },
      },
      version: "v1",
    };

    // Attempt to deserialize the legacy object
    // This should NOT throw, but instead return a reset SessionRecord
    const record = SessionRecord.deserialize(legacyJson);

    expect(record).toBeInstanceOf(SessionRecord);

    // Important: Because we cannot easily migrate cryptographic state from JSON to Protobuf
    // without raw access to the crypto primitives in Rust, we expect the bridge
    // to return an EMPTY session. This forces the client to negotiate a new session
    // automatically (self-healing) rather than crashing.
    expect(record.haveOpenSession()).toBe(false);

    // Ensure the result is a valid serializeable object (now a standard protobuf binary)
    const serialized = record.serialize();
    expect(serialized).toBeInstanceOf(Uint8Array);
    // expect(serialized.length).toBeGreaterThan(0);
  });

  it("should handle Buffer-like objects (common in JSON database dumps)", () => {
    // Simulate a JSON object that represents a Buffer (e.g. from lowdb/Baileys auth store)
    // This is just random bytes, not a valid proto, but the deserialize -> new wrapping
    // doesn't validate proto structure until usage.
    const bufferObj = {
      type: "Buffer",
      data: [1, 2, 3, 4, 5, 255],
    };

    const record = SessionRecord.deserialize(bufferObj);

    expect(record).toBeInstanceOf(SessionRecord);

    const output = record.serialize();
    expect(output).toBeInstanceOf(Uint8Array);
    expect(output).toEqual(new Uint8Array([1, 2, 3, 4, 5, 255]));
  });

  it("should handle standard Uint8Array input", () => {
    const input = new Uint8Array([10, 20, 30, 40]);
    const record = SessionRecord.deserialize(input);

    expect(record).toBeInstanceOf(SessionRecord);
    expect(record.serialize()).toEqual(input);
  });

  it("should handle plain JS Arrays", () => {
    const input = [10, 20, 30, 40];
    const record = SessionRecord.deserialize(input);

    expect(record).toBeInstanceOf(SessionRecord);
    expect(record.serialize()).toEqual(new Uint8Array(input));
  });

  it("should throw on invalid input", () => {
    expect(() => SessionRecord.deserialize("invalid string")).toThrow();
    expect(() => SessionRecord.deserialize(12345)).toThrow();
    expect(() => SessionRecord.deserialize(null)).toThrow();
  });
});
