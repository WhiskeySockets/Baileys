import { describe, it, expect } from "@jest/globals";
import { ProtocolAddress, GroupCipher } from "../dist/index.js";
import { FakeStorage } from "./helpers/fake_storage";

describe("Legacy SenderKey Migration", () => {
  /**
   * The JS libsignal omitted senderMessageKeys entirely when a state had none,
   * so a real upgraded auth state carries rows in this shape.
   */
  const shapes = [
    ["present but empty", { senderMessageKeys: [] }],
    ["omitted", {}],
    ["null", { senderMessageKeys: null }],
  ] as const satisfies readonly (readonly [string, Record<string, unknown>])[];

  it.each(shapes)("migrates a state whose senderMessageKeys is %s", async (_label, extra) => {
    const storage = new FakeStorage();
    const groupId = "120363021033254949@g.us";
    const sender = new ProtocolAddress("236395184570386", 81);

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
        ...extra,
      },
    ];

    storage.senderKeys.set(
      `${groupId}::${sender.id}::${sender.deviceId}`,
      Buffer.from(JSON.stringify(legacySenderKey), "utf-8")
    );

    const cipher = new GroupCipher(storage, groupId, sender);
    const ciphertext = await cipher.encrypt(new Uint8Array([1, 2, 3]));

    expect(ciphertext.length).toBeGreaterThan(0);
  });
});
