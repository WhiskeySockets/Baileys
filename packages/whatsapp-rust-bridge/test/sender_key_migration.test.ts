import { describe, it, expect } from "bun:test";
import { ProtocolAddress, GroupCipher } from "../dist";
import { FakeStorage } from "./helpers/fake_storage";

describe("Legacy SenderKey Migration", () => {
  it("should migrate a legacy JSON sender key into a valid record", async () => {
    const storage = new FakeStorage();
    const groupId = "120363021033254949@g.us";
    const sender = new ProtocolAddress("236395184570386", 81);

    // Legacy JSON structure (as provided by user)
    // It's an array of SenderKeyStateStructure
    const legacySenderKey = [
      {
        senderKeyId: 12345,
        senderChainKey: {
          iteration: 1,
          seed: { type: "Buffer", data: Array.from(Buffer.alloc(32, 1)) },
        },
        senderSigningKey: {
          public: { type: "Buffer", data: Array.from(Buffer.alloc(32, 2)) },
          private: { type: "Buffer", data: Array.from(Buffer.alloc(32, 3)) },
        },
        senderMessageKeys: [],
      },
    ];

    const legacyJson = JSON.stringify(legacySenderKey);
    const legacyBytes = Buffer.from(legacyJson, "utf-8");

    // Store it in the fake storage
    storage.senderKeys.set(
      `${groupId}::${sender.id}::${sender.deviceId}`,
      legacyBytes,
    );

    const cipher = new GroupCipher(storage, groupId, sender);

    const plaintext = new Uint8Array([1, 2, 3]);
    const ciphertext = await cipher.encrypt(plaintext);

    expect(ciphertext).toBeDefined();
    expect(ciphertext.length).toBeGreaterThan(0);
  });
});
