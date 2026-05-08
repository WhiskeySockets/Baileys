import {
  SessionRecord,
  type KeyPair,
  type SignedPreKey,
  generateIdentityKeyPair,
  generateRegistrationId,
} from "../../dist/index.js";

export class FakeStorage {
  private sessions = new Map<string, Uint8Array>();
  private identities = new Map<string, Uint8Array>();
  private preKeys = new Map<number, KeyPair>();
  public senderKeys = new Map<string, Uint8Array>();
  private signedPreKeys = new Map<number, SignedPreKey>();

  public ourIdentityKeyPair: KeyPair;
  public ourRegistrationId: number;

  constructor() {
    this.ourIdentityKeyPair = generateIdentityKeyPair();
    this.ourRegistrationId = generateRegistrationId();
  }

  async loadSession(address: string): Promise<Uint8Array | undefined> {
    const serialized = this.sessions.get(address);
    return serialized ? new Uint8Array(serialized) : undefined;
  }
  async storeSession(address: string, record: SessionRecord): Promise<void> {
    this.sessions.set(address, record.serialize());
  }
  async storeSessionRaw(address: string, data: Uint8Array): Promise<void> {
    this.sessions.set(address, new Uint8Array(data));
  }
  async loadSenderKey(keyId: string): Promise<Uint8Array | undefined> {
    const existing = this.senderKeys.get(keyId);
    return existing ? new Uint8Array(existing) : undefined;
  }
  async storeSenderKey(keyId: string, record: Uint8Array): Promise<void> {
    this.senderKeys.set(keyId, new Uint8Array(record));
  }

  async getOurIdentity(): Promise<KeyPair> {
    return this.ourIdentityKeyPair;
  }
  async getOurRegistrationId(): Promise<number> {
    return this.ourRegistrationId;
  }
  async isTrustedIdentity(
    identifier: string,
    identityKey: Uint8Array,
    _direction?: number,
  ): Promise<boolean> {
    const existing = this.identities.get(identifier);
    if (!existing) {
      this.identities.set(identifier, identityKey);
      return true;
    }
    return Buffer.from(existing).equals(Buffer.from(identityKey));
  }
  trustIdentity(identifier: string, identityKey: Uint8Array): void {
    this.identities.set(identifier, identityKey);
  }

  async loadPreKey(id: number): Promise<KeyPair | undefined> {
    return this.preKeys.get(id);
  }
  async removePreKey(id: number): Promise<void> {
    this.preKeys.delete(id);
  }
  storePreKey(id: number, keyPair: KeyPair): void {
    this.preKeys.set(id, keyPair);
  }

  storeSignedPreKey(id: number, signedPreKey: SignedPreKey): void {
    const withTimestamp = { ...signedPreKey, timestamp: Date.now() };
    this.signedPreKeys.set(id, withTimestamp);
  }

  async loadSignedPreKey(id: number): Promise<SignedPreKey | undefined> {
    return this.signedPreKeys.get(id);
  }

  getSession(address: string): Uint8Array | undefined {
    return this.sessions.get(address);
  }
}
