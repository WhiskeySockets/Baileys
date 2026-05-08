import { describe, it, expect } from "bun:test";
import {
  GroupCipher,
  GroupSessionBuilder,
  SenderKeyName,
  SenderKeyRecord,
  SenderKeyDistributionMessage,
  ProtocolAddress,
} from "../dist";
import { FakeStorage } from "./helpers/fake_storage";

class LoggedFakeStorage extends FakeStorage {
  override async loadSenderKey(keyId: string): Promise<Uint8Array | undefined> {
    console.log(`[Storage] Loading sender key for: ${keyId}`);
    return super.loadSenderKey(keyId);
  }

  override async storeSenderKey(
    keyId: string,
    record: Uint8Array,
  ): Promise<void> {
    console.log(
      `[Storage] Storing sender key for: ${keyId} (${record.length} bytes)`,
    );
    return super.storeSenderKey(keyId, record);
  }
}

describe("Group Encryption end-to-end", () => {
  it("should establish a group session, exchange messages, and handle ratcheting", async () => {
    // === 1. SETUP ===
    const aliceStorage = new LoggedFakeStorage();
    const bobStorage = new LoggedFakeStorage();

    const groupId = "my-awesome-group@g.us";
    const aliceAddress = new ProtocolAddress("alice", 1);
    const bobAddress = new ProtocolAddress("bob", 1);

    // === 2. SESSION ESTABLISHMENT (Alice creates, Bob processes) ===
    console.log("--- Step 1: Alice creates group session ---");
    const aliceBuilder = new GroupSessionBuilder(aliceStorage);
    const aliceSenderKeyName = new SenderKeyName(groupId, aliceAddress);

    // Alice creates the initial distribution message
    const aliceSkdm = await aliceBuilder.create(aliceSenderKeyName);
    expect(aliceSkdm).toBeInstanceOf(SenderKeyDistributionMessage);

    // Verify that Alice's storage now contains her own sender key
    const aliceKeyInStorage = await aliceStorage.loadSenderKey(
      aliceSenderKeyName.toString(),
    );
    expect(aliceKeyInStorage).toBeDefined();
    expect(aliceKeyInStorage!.length).toBeGreaterThan(0);
    const aliceRecord = SenderKeyRecord.deserialize(aliceKeyInStorage!);
    expect(await aliceRecord.isEmpty()).toBe(false);

    console.log(
      "--- Step 2: Bob processes Alice's session creation message ---",
    );
    const bobBuilder = new GroupSessionBuilder(bobStorage);

    // Bob processes the message from Alice. The SenderKeyName must identify Alice.
    await bobBuilder.process(aliceSenderKeyName, aliceSkdm);

    // Verify Bob's storage now contains Alice's sender key
    const aliceKeyInBobsStorage = await bobStorage.loadSenderKey(
      aliceSenderKeyName.toString(),
    );
    expect(aliceKeyInBobsStorage).toBeDefined();
    const bobRecordForAlice = SenderKeyRecord.deserialize(
      aliceKeyInBobsStorage!,
    );
    expect(await bobRecordForAlice.isEmpty()).toBe(false);

    // === 3. ALICE SENDS A MESSAGE ===
    console.log("--- Step 3: Alice encrypts a message for the group ---");
    const aliceCipher = new GroupCipher(aliceStorage, groupId, aliceAddress);
    const plaintext1 = Buffer.from("Hello from Alice!");

    const ciphertext1 = await aliceCipher.encrypt(plaintext1);
    expect(ciphertext1).toBeInstanceOf(Uint8Array);
    expect(ciphertext1.length).toBeGreaterThan(plaintext1.length);

    // === 4. BOB DECRYPTS THE MESSAGE ===
    console.log("--- Step 4: Bob decrypts Alice's message ---");
    // To decrypt a message from Alice, Bob's cipher must be configured for Alice's SenderKeyName
    const bobCipherForAlice = new GroupCipher(
      bobStorage,
      groupId,
      aliceAddress,
    );

    const decrypted1 = await bobCipherForAlice.decrypt(ciphertext1);
    expect(Buffer.from(decrypted1)).toEqual(plaintext1);

    // === 5. RATCHETING TEST (Alice sends a second message) ===
    console.log(
      "--- Step 5: Alice encrypts a second message (testing ratchet) ---",
    );
    const plaintext2 = Buffer.from(
      "This is a second message to test the chain key.",
    );
    const ciphertext2 = await aliceCipher.encrypt(plaintext2);

    console.log("--- Step 6: Bob decrypts the second message ---");
    const decrypted2 = await bobCipherForAlice.decrypt(ciphertext2);
    expect(Buffer.from(decrypted2)).toEqual(plaintext2);

    console.log("✅ Full group session flow test passed!");
  });

  it("should fail to decrypt a message if the session has not been established", async () => {
    // Setup: Alice creates a session and encrypts, but Bob never processes it.
    const aliceStorage = new LoggedFakeStorage();
    const bobStorage = new LoggedFakeStorage();

    const groupId = "unestablished-group@g.us";
    const aliceAddress = new ProtocolAddress("alice", 1);

    // Alice sets up her side and encrypts
    const aliceBuilder = new GroupSessionBuilder(aliceStorage);
    const aliceSenderKeyName = new SenderKeyName(groupId, aliceAddress);
    await aliceBuilder.create(aliceSenderKeyName);

    const aliceCipher = new GroupCipher(aliceStorage, groupId, aliceAddress);
    const plaintext = Buffer.from("This message should fail to decrypt");
    const ciphertext = await aliceCipher.encrypt(plaintext);

    // Bob attempts to decrypt without having processed the distribution message
    const bobCipher = new GroupCipher(bobStorage, groupId, aliceAddress);

    // The decrypt call should reject because there's no sender key record for Alice
    await expect(bobCipher.decrypt(ciphertext)).rejects.toThrow(); // Bun's toReject() is simple and effective
  });
});
