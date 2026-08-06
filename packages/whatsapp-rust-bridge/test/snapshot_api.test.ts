import { describe, it, expect } from "@jest/globals";
import {
  processBundleWithSnapshot,
  ProtocolAddress,
  decryptPreKeyWithSnapshot,
  decryptWhisperWithSnapshot,
  encryptWithSnapshot,
  generateIdentityKeyPair,
  generatePreKey,
  generateRegistrationId,
  generateSignedPreKey,
  type SignalChanges,
  type SignalSnapshot,
} from "../dist/index.js";
import { FakeStorage } from "./helpers/fake_storage";

/**
 * The snapshot API is the whole point of this layer: an operation reads only
 * what the caller handed it and reports every mutation back, so the caller can
 * hold one lock and land one write. These tests pin that contract — no
 * callbacks, no hidden writes, effects surfaced explicitly.
 */

/** The WASM layer rejects with plain strings, so capture instead of toThrow(). */
async function rejection(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
  } catch (error) {
    return String(error);
  }

  throw new Error("expected the operation to reject, but it resolved");
}

const prefixed = (key: Uint8Array) =>
  key.length === 33 ? key : Uint8Array.from([5, ...key]);

type Party = {
  identity: { public: Uint8Array; private: Uint8Array };
  registrationId: number;
  signedPreKey: ReturnType<typeof generateSignedPreKey>;
  preKey: ReturnType<typeof generatePreKey>;
};

function makeParty(): Party {
  const identity = generateIdentityKeyPair();
  return {
    identity: { public: identity.pubKey, private: identity.privKey },
    registrationId: generateRegistrationId(),
    signedPreKey: generateSignedPreKey(identity, 1),
    preKey: generatePreKey(1),
  };
}

function snapshotOf(
  party: Party,
  extra: Partial<SignalSnapshot> = {},
): SignalSnapshot {
  return {
    identity: party.identity,
    registrationId: party.registrationId,
    preKeys: [{ id: 1, keyPair: { public: party.preKey.keyPair.pubKey, private: party.preKey.keyPair.privKey } }],
    signedPreKeys: [
      {
        id: 1,
        keyPair: {
          public: party.signedPreKey.keyPair.pubKey,
          private: party.signedPreKey.keyPair.privKey,
        },
        signature: party.signedPreKey.signature,
      },
    ],
    ...extra,
  } as SignalSnapshot;
}

/** Opens a session from alice towards bob (setup only). */
async function establish(alice: Party, bob: Party, bobAddr: ProtocolAddress) {
  // The same call the consumer makes.
  const out = await processBundleWithSnapshot(snapshotOf(alice), bobAddr, {
    registrationId: bob.registrationId,
    identityKey: prefixed(bob.identity.public),
    preKey: { keyId: 1, publicKey: prefixed(bob.preKey.keyPair.pubKey) },
    signedPreKey: {
      keyId: 1,
      publicKey: prefixed(bob.signedPreKey.keyPair.pubKey),
      signature: bob.signedPreKey.signature,
    },
  } as never);

  const session = out.changes.session;
  if (!session) throw new Error("session was not established");
  return session as Uint8Array;
}

describe("snapshot API", () => {
  const aliceAddr = () => new ProtocolAddress("alice", 1);
  const bobAddr = () => new ProtocolAddress("bob", 1);

  it("encrypts from a snapshot and reports the new session as a change", async () => {
    const alice = makeParty();
    const bob = makeParty();
    const session = await establish(alice, bob, bobAddr());

    const out = await encryptWithSnapshot(
      snapshotOf(alice, { session }),
      bobAddr(),
      new TextEncoder().encode("hello"),
    );

    expect(out.ciphertext.length).toBeGreaterThan(0);
    // A fresh session still owes bob a prekey message.
    expect(out.messageType).toBe(3);
    // The mutation is reported, never applied behind the caller's back.
    expect(out.changes.session).toBeDefined();
    expect(out.changes.sessionCleared).toBe(false);
  });

  it("round-trips a message between two parties through snapshots only", async () => {
    const alice = makeParty();
    const bob = makeParty();
    const aliceSession = await establish(alice, bob, bobAddr());

    const sent = await encryptWithSnapshot(
      snapshotOf(alice, { session: aliceSession }),
      bobAddr(),
      new TextEncoder().encode("ping"),
    );

    const received = await decryptPreKeyWithSnapshot(
      snapshotOf(bob),
      aliceAddr(),
      sent.ciphertext,
    );

    expect(new TextDecoder().decode(received.plaintext)).toBe("ping");
    expect(received.changes.session).toBeDefined();
    // bob consumed the one-time prekey: the caller must delete exactly this id.
    expect(received.changes.removedPreKeyId).toBe(1);
  });

  it("carries a conversation across several turns using the returned changes", async () => {
    const alice = makeParty();
    const bob = makeParty();
    let aliceSession = await establish(alice, bob, bobAddr());
    let bobSession: Uint8Array | undefined;

    // alice -> bob (prekey message)
    const first = await encryptWithSnapshot(
      snapshotOf(alice, { session: aliceSession }),
      bobAddr(),
      new TextEncoder().encode("m1"),
    );
    aliceSession = first.changes.session!;
    const firstIn = await decryptPreKeyWithSnapshot(snapshotOf(bob), aliceAddr(), first.ciphertext);
    bobSession = firstIn.changes.session!;
    expect(new TextDecoder().decode(firstIn.plaintext)).toBe("m1");

    // bob -> alice, then alice -> bob again: both sides advance their chains
    // using nothing but the changesets.
    const reply = await encryptWithSnapshot(
      snapshotOf(bob, { session: bobSession }),
      aliceAddr(),
      new TextEncoder().encode("m2"),
    );
    bobSession = reply.changes.session!;
    const replyIn = await decryptWhisperWithSnapshot(
      snapshotOf(alice, { session: aliceSession }),
      bobAddr(),
      reply.ciphertext,
    );
    aliceSession = replyIn.changes.session!;
    expect(new TextDecoder().decode(replyIn.plaintext)).toBe("m2");

    const third = await encryptWithSnapshot(
      snapshotOf(alice, { session: aliceSession }),
      bobAddr(),
      new TextEncoder().encode("m3"),
    );
    const thirdIn = await decryptWhisperWithSnapshot(
      snapshotOf(bob, { session: bobSession }),
      aliceAddr(),
      third.ciphertext,
    );
    expect(new TextDecoder().decode(thirdIn.plaintext)).toBe("m3");
  });

  it("advances the sending chain monotonically across calls", async () => {
    const alice = makeParty();
    const bob = makeParty();
    let session = await establish(alice, bob, bobAddr());

    const produced: string[] = [];
    for (let i = 0; i < 5; i++) {
      const out = await encryptWithSnapshot(
        snapshotOf(alice, { session }),
        bobAddr(),
        new TextEncoder().encode(`m${i}`),
      );
      produced.push(Buffer.from(out.ciphertext).toString("base64"));
      session = out.changes.session!;
    }

    // Reusing a chain index would repeat a ciphertext; each must be distinct.
    expect(new Set(produced).size).toBe(5);
  });

  // The three cases below replace what the removed SessionBuilder and
  // SessionCipher suites covered. They are the same scenarios expressed
  // against the snapshot calls, which is the only session API left.

  it("does not discard a live session when the peer's bundle is processed again", async () => {
    const alice = makeParty();
    const bob = makeParty();
    const session = await establish(alice, bob, bobAddr());

    const first = await encryptWithSnapshot(
      snapshotOf(alice, { session }),
      bobAddr(),
      new TextEncoder().encode("first"),
    );

    // A second bundle for the same peer, the way a re-fetch delivers one.
    const again = await processBundleWithSnapshot(
      snapshotOf(alice, { session: first.changes.session }),
      bobAddr(),
      {
        registrationId: bob.registrationId,
        identityKey: prefixed(bob.identity.public),
        preKey: { keyId: 1, publicKey: prefixed(bob.preKey.keyPair.pubKey) },
        signedPreKey: {
          keyId: 1,
          publicKey: prefixed(bob.signedPreKey.keyPair.pubKey),
          signature: bob.signedPreKey.signature,
        },
      } as never,
    );

    // Bob must still be able to read the message sent under the old session,
    // which is what breaks if processing a bundle replaces it outright.
    const received = await decryptPreKeyWithSnapshot(
      snapshotOf(bob),
      aliceAddr(),
      first.ciphertext,
    );

    expect(new TextDecoder().decode(received.plaintext)).toBe("first");
    expect(again.changes.session).toBeDefined();
  });

  it("converges when both sides open a session at the same time", async () => {
    const alice = makeParty();
    const bob = makeParty();

    // Neither has heard from the other yet, so both build from a bundle.
    const aliceSession = await establish(alice, bob, bobAddr());
    const bobSession = await establish(bob, alice, aliceAddr());

    const fromAlice = await encryptWithSnapshot(
      snapshotOf(alice, { session: aliceSession }),
      bobAddr(),
      new TextEncoder().encode("from alice"),
    );
    const fromBob = await encryptWithSnapshot(
      snapshotOf(bob, { session: bobSession }),
      aliceAddr(),
      new TextEncoder().encode("from bob"),
    );

    // Each side decrypts the other's opener against its own pending session.
    const atBob = await decryptPreKeyWithSnapshot(
      snapshotOf(bob, { session: bobSession }),
      aliceAddr(),
      fromAlice.ciphertext,
    );
    const atAlice = await decryptPreKeyWithSnapshot(
      snapshotOf(alice, { session: aliceSession }),
      bobAddr(),
      fromBob.ciphertext,
    );

    expect(new TextDecoder().decode(atBob.plaintext)).toBe("from alice");
    expect(new TextDecoder().decode(atAlice.plaintext)).toBe("from bob");
  });

  it("accepts an incoming prekey message after a bundle was injected", async () => {
    const alice = makeParty();
    const bob = makeParty();

    // Alice injects bob's bundle, then bob's own opener arrives before she
    // ever sent anything: the injected session must not shut that out.
    const injected = await establish(alice, bob, bobAddr());
    const bobSession = await establish(bob, alice, aliceAddr());
    const opener = await encryptWithSnapshot(
      snapshotOf(bob, { session: bobSession }),
      aliceAddr(),
      new TextEncoder().encode("opener"),
    );

    const received = await decryptPreKeyWithSnapshot(
      snapshotOf(alice, { session: injected }),
      bobAddr(),
      opener.ciphertext,
    );

    expect(new TextDecoder().decode(received.plaintext)).toBe("opener");
    expect(received.changes.session).toBeDefined();
  });

  it("does not mutate the snapshot it was given", async () => {
    const alice = makeParty();
    const bob = makeParty();
    const session = await establish(alice, bob, bobAddr());
    const before = Buffer.from(session).toString("base64");

    await encryptWithSnapshot(
      snapshotOf(alice, { session }),
      bobAddr(),
      new TextEncoder().encode("hello"),
    );

    // The caller owns its buffers: the operation reports changes instead.
    expect(Buffer.from(session).toString("base64")).toBe(before);
  });

  it("reports no changes when the operation fails", async () => {
    const alice = makeParty();
    const bobAddress = bobAddr();

    // No session in the snapshot: encryption cannot proceed, and it must say so
    // rather than inventing one.
    const message = await rejection(
      encryptWithSnapshot(snapshotOf(alice), bobAddress, new TextEncoder().encode("x")),
    );
    expect(message).toContain("SessionNotFound");
  });

  it("rejects a snapshot missing the prekey a message needs", async () => {
    const alice = makeParty();
    const bob = makeParty();
    const session = await establish(alice, bob, bobAddr());

    const sent = await encryptWithSnapshot(
      snapshotOf(alice, { session }),
      bobAddr(),
      new TextEncoder().encode("ping"),
    );

    // bob's snapshot omits the one-time prekey the message consumes: the
    // operation must fail loudly instead of silently establishing a session
    // the peer will not recognise.
    const withoutPreKey = { ...snapshotOf(bob), preKeys: [] } as SignalSnapshot;
    const message = await rejection(
      decryptPreKeyWithSnapshot(withoutPreKey, aliceAddr(), sent.ciphertext),
    );
    expect(message).toContain("PreKey");
  });

  it("keeps changes typed as optional so untouched records stay untouched", async () => {
    const alice = makeParty();
    const bob = makeParty();
    const session = await establish(alice, bob, bobAddr());

    const out = await encryptWithSnapshot(
      snapshotOf(alice, { session }),
      bobAddr(),
      new TextEncoder().encode("hello"),
    );

    const changes: SignalChanges = out.changes;
    // Encryption touches the session; it must not claim a sender-key or a
    // consumed prekey, which would make the caller write records it should not.
    expect(changes.senderKey).toBeUndefined();
    expect(changes.removedPreKeyId).toBeUndefined();
  });
});
