import { run, bench, do_not_optimize, boxplot, summary } from "mitata";
import {
  ProtocolAddress,
  SessionBuilder,
  SessionCipher,
  generateSignedPreKey,
  generatePreKey,
} from "../dist/index.js";
import { FakeStorage } from "../test/helpers/fake_storage.ts";

import * as libsignalNode from "@whiskeysockets/libsignal-node";
import { type SignalStorage } from "@whiskeysockets/libsignal-node";

const libsignalKeyHelper = (libsignalNode as any).keyhelper;

class LibsignalStore implements SignalStorage {
  private sessions = new Map<string, any>();
  private identities = new Map<string, Buffer>();
  private preKeys = new Map<number, any>();
  private signedPreKeys = new Map<number, any>();

  public ourIdentityKeyPair = libsignalKeyHelper.generateIdentityKeyPair();
  public ourRegistrationId = libsignalKeyHelper.generateRegistrationId();

  async loadSession(address: string) {
    const serialized = this.sessions.get(address);
    return serialized
      ? libsignalNode.SessionRecord.deserialize(serialized)
      : undefined;
  }

  async storeSession(
    address: string,
    record: InstanceType<typeof libsignalNode.SessionRecord>,
  ) {
    this.sessions.set(address, record.serialize());
  }

  getOurIdentity() {
    return this.ourIdentityKeyPair;
  }

  getOurRegistrationId() {
    return this.ourRegistrationId;
  }

  isTrustedIdentity(
    identifier: string,
    identityKey: Uint8Array,
    _direction?: number,
  ) {
    const key = Buffer.from(identityKey);
    const existing = this.identities.get(identifier);
    if (!existing) {
      this.identities.set(identifier, Buffer.from(key));
      return true;
    }
    return existing.equals(key);
  }

  trustIdentity(identifier: string, identityKey: Uint8Array) {
    this.identities.set(identifier, Buffer.from(identityKey));
  }

  async loadPreKey(id: number) {
    return this.preKeys.get(id);
  }

  removePreKey(id: number) {
    this.preKeys.delete(id);
  }

  storePreKey(id: number, keyPair: any) {
    this.preKeys.set(id, keyPair);
  }

  getOurSignedPreKey() {
    return this.signedPreKeys.values().next().value;
  }

  storeSignedPreKey(id: number, signedPreKey: any) {
    this.signedPreKeys.set(id, signedPreKey);
  }

  loadSignedPreKey(id?: number) {
    let signedPreKey;
    if (typeof id === "number" && this.signedPreKeys.has(id)) {
      signedPreKey = this.signedPreKeys.get(id);
    } else {
      signedPreKey = this.signedPreKeys.values().next().value;
    }
    // libsignal-node expects { privKey, pubKey } directly, not the full signedPreKey object
    return signedPreKey?.keyPair;
  }
}

// ============================================================================
// Setup for Rust WASM benchmarks
// ============================================================================
const aliceStorage = new FakeStorage();
const bobStorage = new FakeStorage();

const wasmBobAddress = new ProtocolAddress("bob", 1);
const wasmAliceAddress = new ProtocolAddress("alice", 1);

// Trust each other's identities
aliceStorage.trustIdentity("bob", bobStorage.ourIdentityKeyPair.pubKey);
bobStorage.trustIdentity("alice", aliceStorage.ourIdentityKeyPair.pubKey);

// Generate Bob's pre-keys for WASM
const bobSignedPreKeyId = 1;
const bobSignedPreKey = generateSignedPreKey(
  bobStorage.ourIdentityKeyPair,
  bobSignedPreKeyId,
);
const bobOneTimePreKey = generatePreKey(100);

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

// Alice processes Bob's bundle and establishes session
const aliceSessionBuilder = new SessionBuilder(aliceStorage, wasmBobAddress);
await aliceSessionBuilder.processPreKeyBundle(bobBundle);

const aliceCipher = new SessionCipher(aliceStorage, wasmBobAddress);
const bobCipher = new SessionCipher(bobStorage, wasmAliceAddress);

// ============================================================================
// Setup for libsignal-node benchmarks
// ============================================================================
const aliceLibsignalStorage = new LibsignalStore();
const bobLibsignalStorage = new LibsignalStore();

const libsignalBobAddress = new libsignalNode.ProtocolAddress("bob", 1);
const libsignalAliceAddress = new libsignalNode.ProtocolAddress("alice", 1);

// Trust each other's identities
aliceLibsignalStorage.trustIdentity(
  "bob",
  Buffer.from(bobLibsignalStorage.ourIdentityKeyPair.pubKey),
);
bobLibsignalStorage.trustIdentity(
  "alice",
  Buffer.from(aliceLibsignalStorage.ourIdentityKeyPair.pubKey),
);

// Generate Bob's pre-keys for libsignal-node
const bobLibSignedPreKey = libsignalKeyHelper.generateSignedPreKey(
  bobLibsignalStorage.ourIdentityKeyPair,
  bobSignedPreKeyId,
);
const bobLibOneTimePreKey = libsignalKeyHelper.generatePreKey(100);

bobLibsignalStorage.storeSignedPreKey(
  bobLibSignedPreKey.keyId,
  bobLibSignedPreKey,
);
bobLibsignalStorage.storePreKey(
  bobLibOneTimePreKey.keyId,
  bobLibOneTimePreKey.keyPair,
);

const bobLibsignalBundle = {
  registrationId: bobLibsignalStorage.ourRegistrationId,
  identityKey: bobLibsignalStorage.ourIdentityKeyPair.pubKey,
  signedPreKey: {
    keyId: bobLibSignedPreKey.keyId,
    publicKey: bobLibSignedPreKey.keyPair.pubKey,
    signature: bobLibSignedPreKey.signature,
  },
  preKey: {
    keyId: bobLibOneTimePreKey.keyId,
    publicKey: bobLibOneTimePreKey.keyPair.pubKey,
  },
};

// Alice processes Bob's bundle and establishes session
const aliceLibsignalBuilder = new libsignalNode.SessionBuilder(
  aliceLibsignalStorage,
  libsignalBobAddress,
);
await aliceLibsignalBuilder.initOutgoing(bobLibsignalBundle);

const aliceLibsignalCipher = new libsignalNode.SessionCipher(
  aliceLibsignalStorage,
  libsignalBobAddress,
);
const bobLibsignalCipher = new libsignalNode.SessionCipher(
  bobLibsignalStorage,
  libsignalAliceAddress,
);

// ============================================================================
// Test Messages
// ============================================================================

// Realistic plaintext: A typical WhatsApp text message (~100 bytes)
const typicalMessage = Buffer.from(
  "Hey Bob! How's it going? Let's catch up soon. I have some news to share. 😊".repeat(
    2,
  ),
);

// ============================================================================
// Establish bidirectional sessions (required for decrypt benchmarks)
// ============================================================================

// WASM: Alice sends first message (PreKeyWhisperMessage)
const wasmFirstEncrypted = await aliceCipher.encrypt(typicalMessage);
// Bob decrypts first message - this establishes Bob's session with Alice
await bobCipher.decryptPreKeyWhisperMessage(wasmFirstEncrypted.body);
// Bob replies to Alice - this completes the ratchet setup
const wasmBobReply = await bobCipher.encrypt(typicalMessage);
// Alice decrypts Bob's reply - now both sides have established sessions
await aliceCipher.decryptWhisperMessage(wasmBobReply.body);

// libsignal-node: Same pattern
const libsignalFirstEncrypted =
  await aliceLibsignalCipher.encrypt(typicalMessage);
await bobLibsignalCipher.decryptPreKeyWhisperMessage(
  libsignalFirstEncrypted.body as unknown as Uint8Array,
);
const libsignalBobReply = await bobLibsignalCipher.encrypt(typicalMessage);
await aliceLibsignalCipher.decryptWhisperMessage(
  libsignalBobReply.body as unknown as Uint8Array,
);

// Now both Alice and Bob have fully established sessions in both libraries

// ============================================================================
// Benchmarks
// ============================================================================

boxplot(() => {
  summary(() => {
    bench("Encrypt typical message (Rust WASM)", async () => {
      const result = await aliceCipher.encrypt(typicalMessage);
      do_not_optimize(result);
    }).gc("inner");

    bench("Encrypt typical message (libsignal-node)", async () => {
      const result = await aliceLibsignalCipher.encrypt(typicalMessage);
      do_not_optimize(result);
    }).gc("inner");
  });

  summary(() => {
    // Decrypt benchmarks - Alice encrypts, Bob decrypts
    // Both sides now have established sessions, so these are WhisperMessages (type 1)
    bench("Decrypt WhisperMessage (Rust WASM)", async () => {
      // Alice encrypts a fresh message to Bob
      const encrypted = await aliceCipher.encrypt(typicalMessage);
      // Bob decrypts it - this advances the ratchet
      const result = await bobCipher.decryptWhisperMessage(encrypted.body);
      do_not_optimize(result);
    }).gc("inner");

    bench("Decrypt WhisperMessage (libsignal-node)", async () => {
      // Alice encrypts a fresh message to Bob
      const encrypted = await aliceLibsignalCipher.encrypt(typicalMessage);
      // Bob decrypts it - this advances the ratchet
      const result = await bobLibsignalCipher.decryptWhisperMessage(
        encrypted.body as unknown as Uint8Array,
      );
      do_not_optimize(result);
    }).gc("inner");
  });

  summary(() => {
    // Full round-trip: Alice -> Bob -> Alice
    bench("Full round-trip encrypt+decrypt (Rust WASM)", async () => {
      // Alice sends to Bob
      const toBob = await aliceCipher.encrypt(typicalMessage);
      const decryptedByBob = await bobCipher.decryptWhisperMessage(toBob.body);
      // Bob replies to Alice
      const toAlice = await bobCipher.encrypt(typicalMessage);
      const decryptedByAlice = await aliceCipher.decryptWhisperMessage(
        toAlice.body,
      );
      do_not_optimize(decryptedByBob);
      do_not_optimize(decryptedByAlice);
    }).gc("inner");

    bench("Full round-trip encrypt+decrypt (libsignal-node)", async () => {
      // Alice sends to Bob
      const toBob = await aliceLibsignalCipher.encrypt(typicalMessage);
      const decryptedByBob = await bobLibsignalCipher.decryptWhisperMessage(
        toBob.body as unknown as Uint8Array,
      );
      // Bob replies to Alice
      const toAlice = await bobLibsignalCipher.encrypt(typicalMessage);
      const decryptedByAlice = await aliceLibsignalCipher.decryptWhisperMessage(
        toAlice.body as unknown as Uint8Array,
      );
      do_not_optimize(decryptedByBob);
      do_not_optimize(decryptedByAlice);
    }).gc("inner");
  });
});

await run();
