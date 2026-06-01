import { describe, it, expect } from "bun:test";
import {
  ProtocolAddress,
  SessionBuilder,
  SessionCipher,
  generateSignedPreKey,
  generatePreKey,
} from "../dist";
import { FakeStorage } from "./helpers/fake_storage";

describe("Simultaneous Session Initiation (Race Condition)", () => {
  it("should handle both sides initiating sessions simultaneously", async () => {
    const aliceStorage = new FakeStorage();
    const bobStorage = new FakeStorage();

    const aliceAddress = new ProtocolAddress("alice", 1);
    const bobAddress = new ProtocolAddress("bob", 1);

    aliceStorage.trustIdentity("bob", bobStorage.ourIdentityKeyPair.pubKey);
    bobStorage.trustIdentity("alice", aliceStorage.ourIdentityKeyPair.pubKey);

    const aliceSignedPreKey = generateSignedPreKey(
      aliceStorage.ourIdentityKeyPair,
      1
    );
    const aliceOneTimePreKey = generatePreKey(100);
    aliceStorage.storeSignedPreKey(aliceSignedPreKey.keyId, aliceSignedPreKey);
    aliceStorage.storePreKey(
      aliceOneTimePreKey.keyId,
      aliceOneTimePreKey.keyPair
    );

    const aliceBundle = {
      registrationId: aliceStorage.ourRegistrationId,
      identityKey: aliceStorage.ourIdentityKeyPair.pubKey,
      signedPreKey: {
        keyId: aliceSignedPreKey.keyId,
        publicKey: aliceSignedPreKey.keyPair.pubKey,
        signature: aliceSignedPreKey.signature,
      },
      preKey: {
        keyId: aliceOneTimePreKey.keyId,
        publicKey: aliceOneTimePreKey.keyPair.pubKey,
      },
    };

    const bobSignedPreKey = generateSignedPreKey(
      bobStorage.ourIdentityKeyPair,
      1
    );
    const bobOneTimePreKey = generatePreKey(200);
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
    const bobSessionBuilder = new SessionBuilder(bobStorage, aliceAddress);

    await aliceSessionBuilder.processPreKeyBundle(bobBundle);
    await bobSessionBuilder.processPreKeyBundle(aliceBundle);

    const aliceCipher = new SessionCipher(aliceStorage, bobAddress);
    const bobCipher = new SessionCipher(bobStorage, aliceAddress);

    const alicePlaintext = Buffer.from("Hello from Alice!");
    const bobPlaintext = Buffer.from("Hello from Bob!");

    const aliceEncrypted = await aliceCipher.encrypt(alicePlaintext);
    const bobEncrypted = await bobCipher.encrypt(bobPlaintext);

    expect(aliceEncrypted.type).toBe(3);
    expect(bobEncrypted.type).toBe(3);

    console.log("Alice encrypted message type:", aliceEncrypted.type);
    console.log("Bob encrypted message type:", bobEncrypted.type);
    console.log("Alice ciphertext length:", aliceEncrypted.body.length);
    console.log("Bob ciphertext length:", bobEncrypted.body.length);

    const decryptedByBob = await bobCipher.decryptPreKeyWhisperMessage(
      aliceEncrypted.body
    );
    console.log(
      "Bob decrypted Alice's message:",
      Buffer.from(decryptedByBob).toString()
    );
    expect(Buffer.from(decryptedByBob)).toEqual(alicePlaintext);

    const decryptedByAlice = await aliceCipher.decryptPreKeyWhisperMessage(
      bobEncrypted.body
    );
    console.log(
      "Alice decrypted Bob's message:",
      Buffer.from(decryptedByAlice).toString()
    );
    expect(Buffer.from(decryptedByAlice)).toEqual(bobPlaintext);

    console.log("✅ Simultaneous session initiation test passed!");
  });

  it("should handle session injection followed by incoming PreKey message", async () => {
    const baileysStorage = new FakeStorage();
    const device5Storage = new FakeStorage();

    const baileysAddress = new ProtocolAddress("baileys", 6);
    const device5Address = new ProtocolAddress("device5", 5);

    baileysStorage.trustIdentity(
      "device5",
      device5Storage.ourIdentityKeyPair.pubKey
    );
    device5Storage.trustIdentity(
      "baileys",
      baileysStorage.ourIdentityKeyPair.pubKey
    );

    const baileysSignedPreKey = generateSignedPreKey(
      baileysStorage.ourIdentityKeyPair,
      1
    );
    const baileysOneTimePreKey = generatePreKey(100);
    baileysStorage.storeSignedPreKey(
      baileysSignedPreKey.keyId,
      baileysSignedPreKey
    );
    baileysStorage.storePreKey(
      baileysOneTimePreKey.keyId,
      baileysOneTimePreKey.keyPair
    );

    const baileysBundle = {
      registrationId: baileysStorage.ourRegistrationId,
      identityKey: baileysStorage.ourIdentityKeyPair.pubKey,
      signedPreKey: {
        keyId: baileysSignedPreKey.keyId,
        publicKey: baileysSignedPreKey.keyPair.pubKey,
        signature: baileysSignedPreKey.signature,
      },
      preKey: {
        keyId: baileysOneTimePreKey.keyId,
        publicKey: baileysOneTimePreKey.keyPair.pubKey,
      },
    };

    const device5SignedPreKey = generateSignedPreKey(
      device5Storage.ourIdentityKeyPair,
      1
    );
    const device5OneTimePreKey = generatePreKey(200);
    device5Storage.storeSignedPreKey(
      device5SignedPreKey.keyId,
      device5SignedPreKey
    );
    device5Storage.storePreKey(
      device5OneTimePreKey.keyId,
      device5OneTimePreKey.keyPair
    );

    const device5Bundle = {
      registrationId: device5Storage.ourRegistrationId,
      identityKey: device5Storage.ourIdentityKeyPair.pubKey,
      signedPreKey: {
        keyId: device5SignedPreKey.keyId,
        publicKey: device5SignedPreKey.keyPair.pubKey,
        signature: device5SignedPreKey.signature,
      },
      preKey: {
        keyId: device5OneTimePreKey.keyId,
        publicKey: device5OneTimePreKey.keyPair.pubKey,
      },
    };

    const device5SessionBuilder = new SessionBuilder(
      device5Storage,
      baileysAddress
    );
    await device5SessionBuilder.processPreKeyBundle(baileysBundle);

    const device5Cipher = new SessionCipher(device5Storage, baileysAddress);
    const device5Plaintext = Buffer.from("Hello from Device5!");
    const device5Encrypted = await device5Cipher.encrypt(device5Plaintext);

    console.log("Device5 encrypted message type:", device5Encrypted.type);
    console.log("Device5 ciphertext length:", device5Encrypted.body.length);

    const baileysSessionBuilder = new SessionBuilder(
      baileysStorage,
      device5Address
    );
    await baileysSessionBuilder.processPreKeyBundle(device5Bundle);

    const baileysCipher = new SessionCipher(baileysStorage, device5Address);
    const baileysPlaintext = Buffer.from("Hello from Baileys!");
    const baileysEncrypted = await baileysCipher.encrypt(baileysPlaintext);

    console.log("Baileys encrypted message type:", baileysEncrypted.type);

    try {
      const decryptedByBaileys =
        await baileysCipher.decryptPreKeyWhisperMessage(device5Encrypted.body);
      console.log(
        "Baileys decrypted Device5's message:",
        Buffer.from(decryptedByBaileys).toString()
      );
      expect(Buffer.from(decryptedByBaileys)).toEqual(device5Plaintext);
      console.log("✅ Session injection + incoming PreKey test passed!");
    } catch (error) {
      console.error("❌ Failed to decrypt Device5's message:", error);
      throw error;
    }

    const decryptedByDevice5 = await device5Cipher.decryptPreKeyWhisperMessage(
      baileysEncrypted.body
    );
    console.log(
      "Device5 decrypted Baileys' message:",
      Buffer.from(decryptedByDevice5).toString()
    );
    expect(Buffer.from(decryptedByDevice5)).toEqual(baileysPlaintext);
  });

  it("initOutgoing should NOT overwrite existing session", async () => {
    const aliceStorage = new FakeStorage();
    const bobStorage = new FakeStorage();

    const aliceAddress = new ProtocolAddress("alice", 1);
    const bobAddress = new ProtocolAddress("bob", 1);

    aliceStorage.trustIdentity("bob", bobStorage.ourIdentityKeyPair.pubKey);
    bobStorage.trustIdentity("alice", aliceStorage.ourIdentityKeyPair.pubKey);

    const bobSignedPreKey = generateSignedPreKey(
      bobStorage.ourIdentityKeyPair,
      1
    );
    const bobOneTimePreKey = generatePreKey(300);
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
    const plaintext1 = Buffer.from("First message from Alice");
    const encrypted1 = await aliceCipher.encrypt(plaintext1);
    expect(encrypted1.type).toBe(3);

    const bobCipher = new SessionCipher(bobStorage, aliceAddress);
    const decrypted1 = await bobCipher.decryptPreKeyWhisperMessage(
      encrypted1.body
    );
    expect(Buffer.from(decrypted1)).toEqual(plaintext1);

    const bobReply = Buffer.from("Reply from Bob");
    const encryptedBobReply = await bobCipher.encrypt(bobReply);
    expect(encryptedBobReply.type).toBe(2);

    const decryptedBobReply = await aliceCipher.decryptWhisperMessage(
      encryptedBobReply.body
    );
    expect(Buffer.from(decryptedBobReply)).toEqual(bobReply);

    const plaintext2 = Buffer.from("Second message from Alice");
    const encrypted2 = await aliceCipher.encrypt(plaintext2);
    expect(encrypted2.type).toBe(2);

    const bobSignedPreKey2 = generateSignedPreKey(
      bobStorage.ourIdentityKeyPair,
      2
    );
    const bobOneTimePreKey2 = generatePreKey(400);
    bobStorage.storeSignedPreKey(bobSignedPreKey2.keyId, bobSignedPreKey2);
    bobStorage.storePreKey(bobOneTimePreKey2.keyId, bobOneTimePreKey2.keyPair);

    const bobBundle2 = {
      registrationId: bobStorage.ourRegistrationId,
      identityKey: bobStorage.ourIdentityKeyPair.pubKey,
      signedPreKey: {
        keyId: bobSignedPreKey2.keyId,
        publicKey: bobSignedPreKey2.keyPair.pubKey,
        signature: bobSignedPreKey2.signature,
      },
      preKey: {
        keyId: bobOneTimePreKey2.keyId,
        publicKey: bobOneTimePreKey2.keyPair.pubKey,
      },
    };

    const aliceSessionBuilder2 = new SessionBuilder(aliceStorage, bobAddress);
    await aliceSessionBuilder2.initOutgoing(bobBundle2);

    const plaintext3 = Buffer.from("Third message after initOutgoing call");
    const encrypted3 = await aliceCipher.encrypt(plaintext3);

    console.log("Message type after initOutgoing:", encrypted3.type);
    expect(encrypted3.type).toBe(2);

    const decrypted2 = await bobCipher.decryptWhisperMessage(encrypted2.body);
    expect(Buffer.from(decrypted2)).toEqual(plaintext2);

    const decrypted3 = await bobCipher.decryptWhisperMessage(encrypted3.body);
    expect(Buffer.from(decrypted3)).toEqual(plaintext3);

    console.log("✅ initOutgoing correctly preserved existing session!");
  });
});
