import { describe, it, expect } from "bun:test";
import { ProtocolAddress, SessionCipher, SessionRecord } from "../dist";
import { FakeStorage } from "./helpers/fake_storage";

describe("StorageAdapter Interop", () => {
  const aliceAddress = new ProtocolAddress("alice", 1);

  it("should gracefully handle legacy JSON session objects by treating them as empty", async () => {
    const storage = new FakeStorage();

    // Mock data structure mimicked from libsignal-node
    const legacyJson = {
      _sessions: {
        "BXqk9qn8...": {
          registrationId: 123,
          currentRatchet: {},
          indexInfo: {
            baseKey: "BXqk9qn8...",
            baseKeyType: 2,
            closed: -1,
          },
          _chains: {},
        },
      },
      version: "v1",
    };

    // Override loadSession to return the legacy object directly
    // @ts-ignore
    storage.loadSession = async () => legacyJson;

    const cipher = new SessionCipher(storage, aliceAddress);

    // The previous crash was: "error while invoking an ffi callback: JsValue(Object(...))"
    // We expect the Rust adapter to now detect the object, return an empty session,
    // and then the Cipher logic simply complains that there's no open session.
    try {
      await cipher.encrypt(new Uint8Array([1, 2, 3]));
      throw new Error("Should have thrown a logic error (No open session)");
    } catch (e: any) {
      const msg = e.toString();
      // Ensure it's NOT the FFI crash
      expect(msg).not.toContain("error while invoking an ffi callback");
      expect(msg).not.toContain("JsValue(Object");

      // It usually throws a generic string error from Rust like "No open session" or "No session record"
      // The exact message depends on wacore, but ensuring it's not the crash is sufficient.
    }
  });

  it("should correctly load Buffer-like objects { type: 'Buffer', data: [...] }", async () => {
    const storage = new FakeStorage();

    // 1. Create a valid (empty) session to serialize so we have valid protobuf bytes
    // Use deserialize with empty array to get a valid empty session
    const record = SessionRecord.deserialize(new Uint8Array([]));
    const validBytes = record.serialize();

    // 2. Wrap it in the Buffer-like structure common in JSON DBs (lowdb)
    const bufferLike = {
      type: "Buffer",
      data: Array.from(validBytes),
    };

    // @ts-ignore
    storage.loadSession = async () => bufferLike;

    const cipher = new SessionCipher(storage, aliceAddress);

    try {
      await cipher.encrypt(new Uint8Array([1]));
      throw new Error("Should have thrown a logic error");
    } catch (e: any) {
      const msg = e.toString();
      expect(msg).not.toContain("error while invoking an ffi callback");
      // Should not fail with protobuf parsing error if it converted correctly
      expect(msg).not.toContain("Protobuf");
      expect(msg).not.toContain("invalid wire type");
    }
  });
});
