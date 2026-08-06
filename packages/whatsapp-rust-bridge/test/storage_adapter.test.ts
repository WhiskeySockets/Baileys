import { describe, it, expect } from "@jest/globals";
import { GroupSessionBuilder, ProtocolAddress, SenderKeyName } from "../dist/index.js";
import { FakeStorage } from "./helpers/fake_storage";

class RejectingPersistenceStorage extends FakeStorage {
  public failSenderKeyStore = true;
  public senderKeyLoadCount = 0;

  override async loadSenderKey(keyId: string): Promise<Uint8Array | undefined> {
    this.senderKeyLoadCount += 1;
    return super.loadSenderKey(keyId);
  }

  override async storeSenderKey(keyId: string, record: Uint8Array): Promise<void> {
    if (this.failSenderKeyStore) throw new Error("sender-key persistence failed");
    await super.storeSenderKey(keyId, record);
  }
}

// The adapter only backs the group path now: the session, identity and pre-key
// stores went with the callback-based session API, which the snapshot calls
// replaced. What is left to pin is that a failed write is not cached as if it
// had succeeded.
describe("StorageAdapter Interop", () => {
  const aliceAddress = new ProtocolAddress("alice", 1);

  it("should not cache a sender key when persistence rejects", async () => {
    const storage = new RejectingPersistenceStorage();
    const builder = new GroupSessionBuilder(storage);
    const senderKeyName = new SenderKeyName("cache-test@g.us", aliceAddress);

    await expect(builder.create(senderKeyName)).rejects.toEqual(
      expect.stringContaining("sender-key persistence failed")
    );
    expect(storage.senderKeyLoadCount).toBe(1);

    storage.failSenderKeyStore = false;
    await builder.create(senderKeyName);

    expect(storage.senderKeyLoadCount).toBe(2);
    expect(storage.senderKeys.get(senderKeyName.toString())).toBeDefined();
  });
});
