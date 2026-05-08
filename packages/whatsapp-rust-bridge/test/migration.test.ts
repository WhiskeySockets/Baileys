import { describe, it, expect } from "bun:test";
import {
  ProtocolAddress,
  SessionCipher,
  generateIdentityKeyPair,
  generatePreKey,
} from "../dist";
import { FakeStorage } from "./helpers/fake_storage";

describe("Legacy Session Migration", () => {
  it("should migrate a legacy JSON session into a valid open session", async () => {
    // await init();
    const aliceAddress = new ProtocolAddress("alice", 1);
    const storage = new FakeStorage();

    // Generate valid keys for the legacy session
    const identity = generateIdentityKeyPair();
    const ephemeral = generatePreKey(1);
    const remoteIdentity = generateIdentityKeyPair();
    const rootKey = Buffer.alloc(32, 1);
    const chainKey = Buffer.alloc(32, 2);
    const baseKey = generateIdentityKeyPair().pubKey; // Use valid public key (33 bytes)

    // Helper to toBase64
    const toB64 = (b: Uint8Array) => Buffer.from(b).toString("base64");

    // 1. Construct a Legacy libsignal-node JSON Session
    const legacySession = {
      registrationId: 12345,
      currentRatchet: {
        ephemeralKeyPair: {
          pubKey: toB64(ephemeral.keyPair.pubKey),
          privKey: toB64(ephemeral.keyPair.privKey),
        },
        lastRemoteEphemeralKey: toB64(ephemeral.keyPair.pubKey), // Reuse for simplicity
        previousCounter: 0,
        rootKey: toB64(rootKey),
      },
      indexInfo: {
        baseKey: toB64(baseKey),
        baseKeyType: 2,
        closed: -1,
        used: Date.now(),
        created: Date.now(),
        remoteIdentityKey: toB64(remoteIdentity.pubKey),
      },
      _chains: {
        // A receiving chain
        [toB64(ephemeral.keyPair.pubKey)]: {
          chainKey: {
            counter: 0,
            key: toB64(chainKey),
          },
          chainType: 2, // RECEIVING
          messageKeys: {},
        },
        // A sending chain
        [toB64(ephemeral.keyPair.pubKey)]: {
          // Using same key for simplicity, usually different
          chainKey: {
            counter: 0,
            key: toB64(chainKey),
          },
          chainType: 1, // SENDING
          messageKeys: {},
        },
      },
      version: "v1",
    };

    // Mock storage to return this legacy structure
    // @ts-ignore
    storage.loadSession = async () => legacySession;

    // 2. Initialize Cipher (which calls storage.loadSession)
    const cipher = new SessionCipher(storage, aliceAddress);

    // 3. Verify the session is recognized as OPEN
    // If migration SUCCEEDED, this should be TRUE.
    const isOpen = await cipher.hasOpenSession();
    expect(isOpen).toBe(true);

    // 4. Verify encryption works (requires an open session)
    // We need to trust the identity first to allow encryption
    await storage.trustIdentity("alice", remoteIdentity.pubKey);

    const plaintext = new Uint8Array([1, 2, 3, 4]);

    // Attempting to encrypt should now SUCCEED because we have a session
    const result = await cipher.encrypt(plaintext);
    expect(result.type).toBe(2); // WhisperMessage
    expect(result.body).toBeInstanceOf(Uint8Array);
  });

  it("should migrate a legacy JSON session wrapped in _sessions", async () => {
    const aliceAddress = new ProtocolAddress("alice_wrapped", 1);
    const storage = new FakeStorage();

    // Generate valid keys for the legacy session
    const identity = generateIdentityKeyPair();
    const ephemeral = generatePreKey(1);
    const remoteIdentity = generateIdentityKeyPair();
    const rootKey = Buffer.alloc(32, 1);
    const chainKey = Buffer.alloc(32, 2);
    const baseKey = generateIdentityKeyPair().pubKey;

    const toB64 = (b: Uint8Array) => Buffer.from(b).toString("base64");

    const legacySession = {
      registrationId: 12345,
      currentRatchet: {
        ephemeralKeyPair: {
          pubKey: toB64(ephemeral.keyPair.pubKey),
          privKey: toB64(ephemeral.keyPair.privKey),
        },
        lastRemoteEphemeralKey: toB64(ephemeral.keyPair.pubKey),
        previousCounter: 0,
        rootKey: toB64(rootKey),
      },
      indexInfo: {
        baseKey: toB64(baseKey),
        baseKeyType: 2,
        closed: -1,
        used: Date.now(),
        created: Date.now(),
        remoteIdentityKey: toB64(remoteIdentity.pubKey),
      },
      _chains: {
        [toB64(ephemeral.keyPair.pubKey)]: {
          chainKey: {
            counter: 0,
            key: toB64(chainKey),
          },
          chainType: 2,
          messageKeys: {},
        },
      },
      version: "v1",
    };

    const wrappedSession = {
      _sessions: {
        "some-random-key": legacySession,
      },
    };

    // @ts-ignore
    storage.loadSession = async () => wrappedSession;

    const cipher = new SessionCipher(storage, aliceAddress);

    const isOpen = await cipher.hasOpenSession();
    expect(isOpen).toBe(true);
  });
});
