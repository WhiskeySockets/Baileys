import { describe, it, expect } from "bun:test";
import {
  ProtocolAddress,
  SessionBuilder,
  SessionCipher,
  generateSignedPreKey,
  generatePreKey,
} from "../dist";
import { FakeStorage } from "./helpers/fake_storage";

describe("SessionCipher end-to-end", () => {
  it("should establish a session and exchange messages correctly", async () => {
    // === 1. SETUP ===
    // Create Alice and Bob with their own storage.
    const aliceStorage = new FakeStorage();
    const bobStorage = new FakeStorage();

    // Define their addresses.
    const aliceAddress = new ProtocolAddress("alice", 1);
    const bobAddress = new ProtocolAddress("bob", 1);

    // Alice needs to trust Bob's identity key, and vice versa.
    // This simulates fetching the key from a server and verifying it.
    aliceStorage.trustIdentity("bob", bobStorage.ourIdentityKeyPair.pubKey);
    bobStorage.trustIdentity("alice", aliceStorage.ourIdentityKeyPair.pubKey);

    // === 2. BOB'S PRE-KEY BUNDLE ===
    // Bob generates his keys and "uploads" them to the server (i.e., we store them in his storage).
    const bobSignedPreKeyId = 1;
    const bobSignedPreKey = generateSignedPreKey(
      bobStorage.ourIdentityKeyPair,
      bobSignedPreKeyId,
    );
    const bobOneTimePreKey = generatePreKey(100);

    bobStorage.storeSignedPreKey(bobSignedPreKey.keyId, bobSignedPreKey);
    bobStorage.storePreKey(bobOneTimePreKey.keyId, bobOneTimePreKey.keyPair);

    // Alice "downloads" Bob's bundle.
    const bobBundle = {
      registrationId: bobStorage.ourRegistrationId,
      identityKey: bobStorage.ourIdentityKeyPair.pubKey,
      signedPreKey: {
        keyId: bobSignedPreKey.keyId,
        publicKey: bobSignedPreKey.keyPair.pubKey,
        signature: bobSignedPreKey.signature,
      },
      preKey: {
        keyId: bobOneTimePreKey.keyId,
        publicKey: bobOneTimePreKey.keyPair.pubKey,
      },
    };

    // === 3. ALICE BUILDS THE SESSION ===
    const aliceSessionBuilder = new SessionBuilder(aliceStorage, bobAddress);
    await aliceSessionBuilder.processPreKeyBundle(bobBundle);

    // === 4. ALICE SENDS THE FIRST MESSAGE ===
    const aliceCipher = new SessionCipher(aliceStorage, bobAddress);
    const plaintext1 = Buffer.from("Hello Bob, this is Alice!");
    const encryptedMessageForBob = await aliceCipher.encrypt(plaintext1);

    // The first message is always a PreKeyWhisperMessage (type 3)
    expect(encryptedMessageForBob.type).toBe(3);

    // === 5. BOB RECEIVES AND DECRYPTS THE FIRST MESSAGE ===
    const bobCipher = new SessionCipher(bobStorage, aliceAddress);
    const decryptedByBob = await bobCipher.decryptPreKeyWhisperMessage(
      encryptedMessageForBob.body,
    );

    expect(Buffer.from(decryptedByBob)).toEqual(plaintext1);

    // Check that Bob's one-time pre-key was used and removed.
    const usedPreKey = await bobStorage.loadPreKey(bobOneTimePreKey.keyId);
    expect(usedPreKey).toBeUndefined();

    // === 6. BOB SENDS A REPLY ===
    const plaintext2 = Buffer.from("Hey Alice, I got your message!");
    const encryptedMessageForAlice = await bobCipher.encrypt(plaintext2);

    expect(encryptedMessageForAlice.type).toBe(2);

    // === 7. ALICE RECEIVES AND DECRYPTS THE REPLY ===
    const decryptedByAlice = await aliceCipher.decryptWhisperMessage(
      encryptedMessageForAlice.body,
    );

    expect(Buffer.from(decryptedByAlice)).toEqual(plaintext2);

    console.log("✅ Full session flow test passed!");
  });

  it("should treat Baileys-style plain session objects as missing sessions", async () => {
    const aliceStorage = new FakeStorage();
    const bobStorage = new FakeStorage();

    const aliceAddress = new ProtocolAddress("alice", 1);
    const bobAddress = new ProtocolAddress("bob", 1);

    aliceStorage.trustIdentity("bob", bobStorage.ourIdentityKeyPair.pubKey);
    bobStorage.trustIdentity("alice", aliceStorage.ourIdentityKeyPair.pubKey);

    const bobSignedPreKeyId = 7;
    const bobSignedPreKey = generateSignedPreKey(
      bobStorage.ourIdentityKeyPair,
      bobSignedPreKeyId,
    );
    const bobOneTimePreKey = generatePreKey(701);

    bobStorage.storeSignedPreKey(bobSignedPreKey.keyId, bobSignedPreKey);
    bobStorage.storePreKey(bobOneTimePreKey.keyId, bobOneTimePreKey.keyPair);

    const bobBundle = {
      registrationId: bobStorage.ourRegistrationId,
      identityKey: bobStorage.ourIdentityKeyPair.pubKey,
      signedPreKey: {
        keyId: bobSignedPreKey.keyId,
        publicKey: bobSignedPreKey.keyPair.pubKey,
        signature: bobSignedPreKey.signature,
      },
      preKey: {
        keyId: bobOneTimePreKey.keyId,
        publicKey: bobOneTimePreKey.keyPair.pubKey,
      },
    };

    const aliceSessionBuilder = new SessionBuilder(aliceStorage, bobAddress);
    await aliceSessionBuilder.processPreKeyBundle(bobBundle);

    const aliceCipher = new SessionCipher(aliceStorage, bobAddress);
    const plaintext = Buffer.from("Trigger broken loadSession path");
    const encryptedMessageForBob = await aliceCipher.encrypt(plaintext);

    // Simulate a Baileys-style storage adapter that returns a raw object for a fresh session.
    const originalLoadSession = bobStorage.loadSession.bind(bobStorage);
    bobStorage.loadSession = (async (address: string) => {
      const existing = await originalLoadSession(address);
      if (existing) {
        return existing;
      }
      return { _sessions: {}, version: "v1" };
    }) as any;

    const bobCipher = new SessionCipher(bobStorage, aliceAddress);

    // With the fix, the legacy JSON is treated as an empty session.
    // Since this is a PreKeyWhisperMessage, it establishes a new session.
    // So decryption should SUCCEED (self-healing).
    const decrypted = await bobCipher.decryptPreKeyWhisperMessage(
      encryptedMessageForBob.body,
    );
    expect(Buffer.from(decrypted)).toEqual(plaintext);
  });
});
