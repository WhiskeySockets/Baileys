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
// Setup helpers — each bench group gets its own fresh session pair so the
// ratchet doesn't drift past libsignal's MAX_FORWARD_JUMPS (25_000) when one
// bench advances the chain solo (e.g. an Encrypt-only bench) before Decrypt
// has a chance to catch up.
// ============================================================================

type WasmPair = {
  alice: SessionCipher;
  bob: SessionCipher;
};

async function makeWasmPair(): Promise<WasmPair> {
  const aliceStorage = new FakeStorage();
  const bobStorage = new FakeStorage();
  const bobAddr = new ProtocolAddress("bob", 1);
  const aliceAddr = new ProtocolAddress("alice", 1);

  aliceStorage.trustIdentity("bob", bobStorage.ourIdentityKeyPair.pubKey);
  bobStorage.trustIdentity("alice", aliceStorage.ourIdentityKeyPair.pubKey);

  const sk = generateSignedPreKey(bobStorage.ourIdentityKeyPair, 1);
  const pk = generatePreKey(100);
  bobStorage.storeSignedPreKey(sk.keyId, sk);
  bobStorage.storePreKey(pk.keyId, pk.keyPair);

  await new SessionBuilder(aliceStorage, bobAddr).processPreKeyBundle({
    registrationId: bobStorage.ourRegistrationId,
    identityKey: bobStorage.ourIdentityKeyPair.pubKey,
    signedPreKey: {
      keyId: sk.keyId,
      publicKey: sk.keyPair.pubKey,
      signature: sk.signature,
    },
    preKey: { keyId: pk.keyId, publicKey: pk.keyPair.pubKey },
  });

  const alice = new SessionCipher(aliceStorage, bobAddr);
  const bob = new SessionCipher(bobStorage, aliceAddr);

  // PreKey handshake + reply so both sides have established sessions
  const first = await alice.encrypt(Buffer.from("hi"));
  await bob.decryptPreKeyWhisperMessage(first.body);
  const reply = await bob.encrypt(Buffer.from("ack"));
  await alice.decryptWhisperMessage(reply.body);

  return { alice, bob };
}

type LibPair = {
  alice: InstanceType<typeof libsignalNode.SessionCipher>;
  bob: InstanceType<typeof libsignalNode.SessionCipher>;
};

async function makeLibPair(): Promise<LibPair> {
  const aliceStorage = new LibsignalStore();
  const bobStorage = new LibsignalStore();
  const bobAddr = new libsignalNode.ProtocolAddress("bob", 1);
  const aliceAddr = new libsignalNode.ProtocolAddress("alice", 1);

  aliceStorage.trustIdentity(
    "bob",
    Buffer.from(bobStorage.ourIdentityKeyPair.pubKey),
  );
  bobStorage.trustIdentity(
    "alice",
    Buffer.from(aliceStorage.ourIdentityKeyPair.pubKey),
  );

  const sk = libsignalKeyHelper.generateSignedPreKey(
    bobStorage.ourIdentityKeyPair,
    1,
  );
  const pk = libsignalKeyHelper.generatePreKey(100);
  bobStorage.storeSignedPreKey(sk.keyId, sk);
  bobStorage.storePreKey(pk.keyId, pk.keyPair);

  const builder = new libsignalNode.SessionBuilder(aliceStorage, bobAddr);
  await builder.initOutgoing({
    registrationId: bobStorage.ourRegistrationId,
    identityKey: bobStorage.ourIdentityKeyPair.pubKey,
    signedPreKey: {
      keyId: sk.keyId,
      publicKey: sk.keyPair.pubKey,
      signature: sk.signature,
    },
    preKey: { keyId: pk.keyId, publicKey: pk.keyPair.pubKey },
  });

  const alice = new libsignalNode.SessionCipher(aliceStorage, bobAddr);
  const bob = new libsignalNode.SessionCipher(bobStorage, aliceAddr);

  const first = await alice.encrypt(Buffer.from("hi"));
  await bob.decryptPreKeyWhisperMessage(first.body as unknown as Uint8Array);
  const reply = await bob.encrypt(Buffer.from("ack"));
  await alice.decryptWhisperMessage(reply.body as unknown as Uint8Array);

  return { alice, bob };
}

// ============================================================================
// Test Messages
// ============================================================================

// Realistic plaintext: A typical WhatsApp text message (~100 bytes)
const typicalMessage = Buffer.from(
  "Hey Bob! How's it going? Let's catch up soon. I have some news to share. 😊".repeat(
    2,
  ),
);

// Each bench group below gets its own fresh session pair. This prevents one
// bench (e.g. Encrypt) from advancing the ratchet past the
// MAX_FORWARD_JUMPS=25_000 threshold and breaking subsequent Decrypt benches.

// ============================================================================
// Encrypt benchmarks
// ============================================================================
const encWasm = await makeWasmPair();
const encLib = await makeLibPair();

boxplot(() => {
  summary(() => {
    bench("Encrypt typical message (Rust WASM)", async () => {
      const result = await encWasm.alice.encrypt(typicalMessage);
      do_not_optimize(result);
    }).gc("inner");

    bench("Encrypt typical message (libsignal-node)", async () => {
      const result = await encLib.alice.encrypt(typicalMessage);
      do_not_optimize(result);
    }).gc("inner");
  });
});

// ============================================================================
// Decrypt benchmarks (fresh sessions — independent of Encrypt above)
// ============================================================================
const decWasm = await makeWasmPair();
const decLib = await makeLibPair();

// Use mitata's generator form so the encrypt setup runs outside the timed
// section (the [0] callback is invoked per-iteration before t0). The bench
// body only measures Bob's decrypt. Each iteration consumes a fresh
// ciphertext because both ratchets advance on every encrypt/decrypt.
boxplot(() => {
  summary(() => {
    bench("Decrypt WhisperMessage (Rust WASM)", function* () {
      yield {
        [0]: async () => await decWasm.alice.encrypt(typicalMessage),
        bench: async (encrypted: { body: Uint8Array }) => {
          const result = await decWasm.bob.decryptWhisperMessage(encrypted.body);
          do_not_optimize(result);
        },
      };
    }).gc("inner");

    bench("Decrypt WhisperMessage (libsignal-node)", function* () {
      yield {
        [0]: async () => await decLib.alice.encrypt(typicalMessage),
        bench: async (encrypted: { body: unknown }) => {
          const result = await decLib.bob.decryptWhisperMessage(
            encrypted.body as unknown as Uint8Array,
          );
          do_not_optimize(result);
        },
      };
    }).gc("inner");
  });
});

// ============================================================================
// Full round-trip benchmarks (fresh sessions)
// ============================================================================
const rtWasm = await makeWasmPair();
const rtLib = await makeLibPair();

boxplot(() => {
  summary(() => {
    bench("Full round-trip encrypt+decrypt (Rust WASM)", async () => {
      const toBob = await rtWasm.alice.encrypt(typicalMessage);
      const decryptedByBob = await rtWasm.bob.decryptWhisperMessage(toBob.body);
      const toAlice = await rtWasm.bob.encrypt(typicalMessage);
      const decryptedByAlice = await rtWasm.alice.decryptWhisperMessage(
        toAlice.body,
      );
      do_not_optimize(decryptedByBob);
      do_not_optimize(decryptedByAlice);
    }).gc("inner");

    bench("Full round-trip encrypt+decrypt (libsignal-node)", async () => {
      const toBob = await rtLib.alice.encrypt(typicalMessage);
      const decryptedByBob = await rtLib.bob.decryptWhisperMessage(
        toBob.body as unknown as Uint8Array,
      );
      const toAlice = await rtLib.bob.encrypt(typicalMessage);
      const decryptedByAlice = await rtLib.alice.decryptWhisperMessage(
        toAlice.body as unknown as Uint8Array,
      );
      do_not_optimize(decryptedByBob);
      do_not_optimize(decryptedByAlice);
    }).gc("inner");
  });
});

await run();
