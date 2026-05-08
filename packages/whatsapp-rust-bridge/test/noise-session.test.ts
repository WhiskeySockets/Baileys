import { describe, it, expect } from "bun:test";
import {
  NoiseSession,
  encodeNode,
  getWAConnHeader,
  type BinaryNode,
} from "../dist";
import { randomBytes } from "crypto";
import {
  aesEncryptGCM,
  aesDecryptGCM,
  sha256,
  hkdf,
  Curve,
} from "baileys/lib/Utils/crypto";
import { makeNoiseHandler } from "baileys/lib/Utils/noise-handler";

// Pino logger mock for makeNoiseHandler
const mockLogger = {
  child: () => mockLogger,
  trace: () => {},
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

const NOISE_MODE = "Noise_XX_25519_AESGCM_SHA256\0\0\0\0";

function generateIV(counter: number): Uint8Array {
  const iv = new ArrayBuffer(12);
  new DataView(iv).setUint32(8, counter);
  return new Uint8Array(iv);
}

function hex(buffer: Uint8Array | Buffer): string {
  return Buffer.from(buffer).toString("hex");
}

// Helper to create a JS noise handler for parity testing
async function createJSNoiseHandler(publicKey: Buffer, noiseHeader: Buffer) {
  const keyPair = Curve.generateKeyPair();
  const handler = makeNoiseHandler({
    keyPair: {
      private: Buffer.from(keyPair.private),
      public: publicKey,
    },
    NOISE_HEADER: noiseHeader,
    logger: mockLogger as any,
    routingInfo: undefined,
  });
  return { handler, keyPair };
}

describe("NoiseSession", () => {
  // Use the real WA_CONN_HEADER from wacore-binary
  const testNoiseHeader = Buffer.from(getWAConnHeader());

  describe("constructor", () => {
    it("should create a new session", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);
      expect(session).toBeDefined();
      expect(session.isFinished).toBe(false);
    });

    it("should initialize with routing info", () => {
      const publicKey = randomBytes(32);
      const routingInfo = Buffer.from([0x08, 0x02, 0x08, 0x12, 0x08, 0x0d]);
      const session = new NoiseSession(publicKey, testNoiseHeader, routingInfo);
      expect(session).toBeDefined();
    });
  });

  describe("authenticate", () => {
    it("should update hash with Baileys sha256 parity", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      // Compute expected hash using Baileys
      const data = Buffer.from(NOISE_MODE);
      let expectedHash = data.length === 32 ? data : sha256(data);
      expectedHash = sha256(Buffer.concat([expectedHash, testNoiseHeader]));
      expectedHash = sha256(Buffer.concat([expectedHash, publicKey]));

      expect(hex(session.getHash())).toBe(hex(expectedHash));

      // Authenticate additional data
      const additionalData = randomBytes(32);
      session.authenticate(additionalData);
      expectedHash = sha256(Buffer.concat([expectedHash, additionalData]));

      expect(hex(session.getHash())).toBe(hex(expectedHash));
    });
  });

  describe("encrypt/decrypt", () => {
    it("should encrypt data identically to Baileys aesEncryptGCM", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      // Get the hash after initialization
      const hash = session.getHash();

      // Compute the key (same as initial hash in WASM)
      const data = Buffer.from(NOISE_MODE);
      const key = data.length === 32 ? data : sha256(data);

      const plaintext = Buffer.from("Hello, World!");
      const iv = generateIV(0);

      // Encrypt with WASM
      const wasmEncrypted = session.encrypt(plaintext);

      // Encrypt with Baileys
      const baileysEncrypted = aesEncryptGCM(plaintext, key, iv, hash);

      expect(hex(wasmEncrypted)).toBe(hex(baileysEncrypted));
    });

    it("should decrypt data encrypted by Baileys", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      // Get the hash after initialization
      const hash = session.getHash();

      // Compute the key
      const data = Buffer.from(NOISE_MODE);
      const key = data.length === 32 ? data : sha256(data);

      const plaintext = Buffer.from("Test message for decryption");
      const iv = generateIV(0);

      // Encrypt with Baileys
      const baileysEncrypted = aesEncryptGCM(plaintext, key, iv, hash);

      // Decrypt with WASM
      const wasmDecrypted = session.decrypt(baileysEncrypted);

      expect(hex(wasmDecrypted)).toBe(hex(plaintext));
    });

    it("should handle multiple encrypt/decrypt cycles", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      // Get initial state
      let hash: Buffer = Buffer.from(session.getHash());
      const data = Buffer.from(NOISE_MODE);
      let key = data.length === 32 ? Buffer.from(data) : sha256(data);

      for (let i = 0; i < 5; i++) {
        const plaintext = Buffer.from(`Message ${i}`);
        const iv = generateIV(i);

        const wasmEncrypted = session.encrypt(plaintext);
        const baileysEncrypted = aesEncryptGCM(plaintext, key, iv, hash);

        expect(hex(wasmEncrypted)).toBe(hex(baileysEncrypted));

        // Update hash like the session does
        hash = sha256(Buffer.concat([hash, baileysEncrypted]));
      }
    });
  });

  describe("mixIntoKey", () => {
    it("should derive keys identically to Baileys hkdf", async () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      // Get initial salt (same as initial hash)
      const data = Buffer.from(NOISE_MODE);
      const initialHash = data.length === 32 ? data : sha256(data);

      const keyMaterial = randomBytes(32);

      // Mix with WASM
      session.mixIntoKey(keyMaterial);

      // Mix with Baileys hkdf
      const derived = await hkdf(keyMaterial, 64, {
        salt: initialHash,
        info: "",
      });
      const expectedSalt = derived.subarray(0, 32);
      const expectedKey = derived.subarray(32);

      // Verify by encrypting same data - counters are reset to 0
      const plaintext = Buffer.from("After key mixing");
      const iv = generateIV(0);

      const wasmEncrypted = session.encrypt(plaintext);

      // Hash was updated during construction, need to track it
      let hash = sha256(Buffer.concat([initialHash, testNoiseHeader]));
      hash = sha256(Buffer.concat([hash, publicKey]));

      const baileysEncrypted = aesEncryptGCM(plaintext, expectedKey, iv, hash);

      expect(hex(wasmEncrypted)).toBe(hex(baileysEncrypted));
    });
  });

  describe("finishInit", () => {
    it("should set isFinished to true", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      expect(session.isFinished).toBe(false);
      session.finishInit();
      expect(session.isFinished).toBe(true);
    });

    it("should split keys for bidirectional communication", async () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      // Get initial salt
      const data = Buffer.from(NOISE_MODE);
      const initialSalt = data.length === 32 ? data : sha256(data);

      session.finishInit();

      // Use Baileys hkdf to get expected keys
      const derived = await hkdf(Buffer.alloc(0), 64, {
        salt: initialSalt,
        info: "",
      });

      // Encrypt with WASM
      const plaintext = Buffer.from("After finish");
      const iv = generateIV(0);
      const wasmEncrypted = session.encrypt(plaintext);

      // After finishInit, hash is cleared to empty buffer
      const emptyHash = Buffer.alloc(0);
      const expectedEncKey = derived.subarray(0, 32);
      const baileysEncrypted = aesEncryptGCM(
        plaintext,
        expectedEncKey,
        iv,
        emptyHash,
      );

      expect(hex(wasmEncrypted)).toBe(hex(baileysEncrypted));
    });
  });

  describe("encodeFrameRaw", () => {
    it("should encode frame with intro on first call", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);
      const data = Buffer.from("Test data");

      const frame = session.encodeFrameRaw(data);

      // Should include: noise_header + 3-byte length + data
      expect(frame.length).toBe(testNoiseHeader.length + 3 + data.length);

      // Check noise header
      expect(hex(frame.subarray(0, testNoiseHeader.length))).toBe(
        hex(testNoiseHeader),
      );

      // Check length prefix
      const length =
        (frame[testNoiseHeader.length] << 16) |
        (frame[testNoiseHeader.length + 1] << 8) |
        frame[testNoiseHeader.length + 2];
      expect(length).toBe(data.length);

      // Check data
      expect(hex(frame.subarray(testNoiseHeader.length + 3))).toBe(hex(data));
    });

    it("should omit intro on subsequent calls", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);
      const data = Buffer.from("Test data");

      // First call includes intro
      const frame1 = session.encodeFrameRaw(data);
      expect(frame1.length).toBe(testNoiseHeader.length + 3 + data.length);

      // Second call omits intro
      const frame2 = session.encodeFrameRaw(data);
      expect(frame2.length).toBe(3 + data.length);
    });

    it("should include routing info in intro", () => {
      const publicKey = randomBytes(32);
      const routingInfo = Buffer.from([0x08, 0x02, 0x08, 0x12, 0x08, 0x0d]);
      const session = new NoiseSession(publicKey, testNoiseHeader, routingInfo);
      const data = Buffer.from("Test");

      const frame = session.encodeFrameRaw(data);

      // Should start with "ED"
      expect(frame[0]).toBe(0x45); // 'E'
      expect(frame[1]).toBe(0x44); // 'D'

      // Bytes 2-3 should be 0, 1
      expect(frame[2]).toBe(0);
      expect(frame[3]).toBe(1);

      // Check routing length bytes (3-byte big-endian)
      expect(frame[4]).toBe(0); // high byte
      expect(frame[5]).toBe(0); // mid byte
      expect(frame[6]).toBe(routingInfo.length); // low byte
    });
  });

  describe("encodeFrame", () => {
    it("should encode binary node into frame", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      const node: BinaryNode = {
        tag: "iq",
        attrs: { type: "get", id: "test-123" },
      };

      const frame = session.encodeFrame(node);
      expect(frame).toBeInstanceOf(Uint8Array);
      expect(frame.length).toBeGreaterThan(testNoiseHeader.length + 3);
    });

    it("should encrypt frame content after finishInit", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);
      session.finishInit();

      const node: BinaryNode = {
        tag: "iq",
        attrs: { type: "get", id: "test-123" },
      };

      const frame = session.encodeFrame(node);

      // Frame should be larger due to encryption tag (16 bytes)
      const encoded = encodeNode(node);
      // intro (first call) + 3-byte length + encrypted data + tag
      expect(frame.length).toBe(
        testNoiseHeader.length + 3 + encoded.length + 16,
      );
    });
  });

  describe("decodeFrame", () => {
    it("should decode raw frame during handshake", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      const rawData = Buffer.from("Handshake data");
      // Build a frame: 3-byte length + data
      const frame = Buffer.alloc(3 + rawData.length);
      frame.writeUInt8(rawData.length >> 16, 0);
      frame.writeUInt16BE(rawData.length & 0xffff, 1);
      rawData.copy(frame, 3);

      const frames = session.decodeFrame(frame);

      expect(frames.length).toBe(1);
      expect(hex(frames[0])).toBe(hex(rawData));
    });

    it("should buffer partial frames", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      const rawData = Buffer.from("Complete frame data");
      const frame = Buffer.alloc(3 + rawData.length);
      frame.writeUInt8(rawData.length >> 16, 0);
      frame.writeUInt16BE(rawData.length & 0xffff, 1);
      rawData.copy(frame, 3);

      // Send partial frame
      let frames = session.decodeFrame(frame.subarray(0, 5));
      expect(frames.length).toBe(0);
      expect(session.bufferedBytes).toBe(5);

      // Send rest of frame
      frames = session.decodeFrame(frame.subarray(5));
      expect(frames.length).toBe(1);
      expect(session.bufferedBytes).toBe(0);
    });

    it("should handle multiple frames in one chunk", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      const data1 = Buffer.from("Frame 1");
      const data2 = Buffer.from("Frame 2");

      // Build two frames concatenated
      const frame1 = Buffer.alloc(3 + data1.length);
      frame1.writeUInt8(data1.length >> 16, 0);
      frame1.writeUInt16BE(data1.length & 0xffff, 1);
      data1.copy(frame1, 3);

      const frame2 = Buffer.alloc(3 + data2.length);
      frame2.writeUInt8(data2.length >> 16, 0);
      frame2.writeUInt16BE(data2.length & 0xffff, 1);
      data2.copy(frame2, 3);

      const combined = Buffer.concat([frame1, frame2]);

      const frames = session.decodeFrame(combined);

      expect(frames.length).toBe(2);
      expect(hex(frames[0])).toBe(hex(data1));
      expect(hex(frames[1])).toBe(hex(data2));
    });

    it("should encrypt data identically with two synced sessions (handshake simulation)", () => {
      const publicKey = randomBytes(32);
      // Create two sessions to simulate client/server with synced state
      const session1 = new NoiseSession(publicKey, testNoiseHeader, undefined);
      const session2 = new NoiseSession(publicKey, testNoiseHeader, undefined);

      // Both sessions should produce identical encrypted output for same plaintext
      const plaintext = Buffer.from("Handshake data");
      const encrypted1 = session1.encrypt(plaintext);
      const encrypted2 = session2.encrypt(plaintext);

      expect(hex(encrypted1)).toBe(hex(encrypted2));
    });

    it("should encode and decode raw frames correctly after finishInit", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);
      session.finishInit();

      // After finishInit, we test frame encoding/decoding with the same session
      // Note: In real protocol, two endpoints have swapped keys (write/read)
      // Here we test that the frame format is correct

      const data = Buffer.from("Test payload data");
      const frame = session.encodeFrameRaw(data);

      // The frame should be: intro + 3-byte length + encrypted data + tag
      // First frame has intro, subsequent frames don't
      expect(frame.length).toBe(testNoiseHeader.length + 3 + data.length + 16);

      // Verify the length prefix is correct
      const dataStart = testNoiseHeader.length;
      const expectedLen = data.length + 16; // encrypted data + tag
      const actualLen =
        (frame[dataStart] << 16) |
        (frame[dataStart + 1] << 8) |
        frame[dataStart + 2];
      expect(actualLen).toBe(expectedLen);
    });

    it("should decode binary nodes from raw frame data during handshake", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      // During handshake (before finishInit), decodeFrame returns raw data
      const node: BinaryNode = {
        tag: "iq",
        attrs: { type: "result", id: "test-456" },
      };

      // Encode without encryption (handshake mode)
      const encoded = encodeNode(node);
      const frame = Buffer.alloc(3 + encoded.length);
      frame.writeUInt8(encoded.length >> 16, 0);
      frame.writeUInt16BE(encoded.length & 0xffff, 1);
      encoded.forEach((byte, i) => (frame[3 + i] = byte));

      const decoded = session.decodeFrame(frame);

      expect(decoded.length).toBe(1);
      expect(hex(decoded[0])).toBe(hex(encoded));
    });
  });

  describe("clearBuffer", () => {
    it("should clear buffered bytes", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      // Add partial data
      session.decodeFrame(Buffer.from([0, 0, 100]));
      expect(session.bufferedBytes).toBe(3);

      session.clearBuffer();
      expect(session.bufferedBytes).toBe(0);
    });
  });

  describe("re-entrancy", () => {
    it("should allow calling encodeFrameRaw after decodeFrame returns (simulating callback pattern)", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);
      // Stay in handshake mode (no encryption) to test without key issues

      // Create a raw frame (no encryption in handshake mode)
      const rawData = Buffer.from("Incoming message");
      const frame = Buffer.alloc(3 + rawData.length);
      frame.writeUInt8(rawData.length >> 16, 0);
      frame.writeUInt16BE(rawData.length & 0xffff, 1);
      rawData.copy(frame, 3);

      // decodeFrame now returns array, allowing us to call other methods after
      const frames = session.decodeFrame(frame);
      expect(frames.length).toBe(1);

      // This simulates what happens when processing frames in a callback-style loop
      // Previously this would fail with re-entrancy error if done in a callback
      for (const decodedFrame of frames) {
        // Encode a response - this should work without re-entrancy issues
        const response = session.encodeFrameRaw(Buffer.from("Response"));
        expect(response.length).toBeGreaterThan(0);
      }
    });

    it("should allow interleaved decode and encode operations", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);
      // Stay in handshake mode

      // Create multiple raw frames
      const data1 = Buffer.from("Message 1");
      const data2 = Buffer.from("Message 2");

      const frame1 = Buffer.alloc(3 + data1.length);
      frame1.writeUInt8(data1.length >> 16, 0);
      frame1.writeUInt16BE(data1.length & 0xffff, 1);
      data1.copy(frame1, 3);

      const frame2 = Buffer.alloc(3 + data2.length);
      frame2.writeUInt8(data2.length >> 16, 0);
      frame2.writeUInt16BE(data2.length & 0xffff, 1);
      data2.copy(frame2, 3);

      const combined = Buffer.concat([frame1, frame2]);

      // Decode all frames
      const frames = session.decodeFrame(combined);
      expect(frames.length).toBe(2);

      // Process each frame and send responses
      const encodeResults: boolean[] = [];
      for (let i = 0; i < frames.length; i++) {
        const response = session.encodeFrameRaw(
          Buffer.from(`Response ${i + 1}`),
        );
        encodeResults.push(response.length > 0);
      }

      expect(encodeResults).toEqual([true, true]);
    });

    it("should allow calling encrypt after decodeFrame", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);
      // Stay in handshake mode

      const rawData = Buffer.from("Test data");
      const frame = Buffer.alloc(3 + rawData.length);
      frame.writeUInt8(rawData.length >> 16, 0);
      frame.writeUInt16BE(rawData.length & 0xffff, 1);
      rawData.copy(frame, 3);

      // Decode
      const frames = session.decodeFrame(frame);
      expect(frames.length).toBe(1);

      // Encrypt after decode - should work
      const encrypted = session.encrypt(Buffer.from("Encrypt this"));
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it("should allow calling authenticate after decodeFrame", () => {
      const publicKey = randomBytes(32);
      const session = new NoiseSession(publicKey, testNoiseHeader, undefined);

      const rawData = Buffer.from("Test data");
      const frame = Buffer.alloc(3 + rawData.length);
      frame.writeUInt8(rawData.length >> 16, 0);
      frame.writeUInt16BE(rawData.length & 0xffff, 1);
      rawData.copy(frame, 3);

      // Decode
      const frames = session.decodeFrame(frame);
      expect(frames.length).toBe(1);

      // Authenticate after decode - should work
      session.authenticate(Buffer.from("Auth data"));
      // If we get here without error, the test passes
      expect(true).toBe(true);
    });
  });

  describe("processHandshake", () => {
    // Simulate server-side to create encrypted data that matches what processHandshakeInit expects
    async function createMockServerHello(clientPublicKey: Buffer) {
      // Server's ephemeral key pair
      const serverEphemeral = Curve.generateKeyPair();
      // Server's static key pair (this is what gets encrypted)
      const serverStatic = Curve.generateKeyPair();
      // Mock certificate payload
      const certPayload = Buffer.from("Mock certificate payload for testing");

      // Initialize server-side state (mirrors client initialization)
      const data = Buffer.from(NOISE_MODE);
      let hash = data.length === 32 ? data : sha256(data);
      let salt = hash;
      let encKey = hash;
      let writeCounter = 0;

      // Authenticate: noise header + client public key
      hash = sha256(Buffer.concat([hash, testNoiseHeader]));
      hash = sha256(Buffer.concat([hash, clientPublicKey]));

      // Server: authenticate own ephemeral
      hash = sha256(Buffer.concat([hash, serverEphemeral.public]));

      // Server: mixIntoKey with shared secret (server ephemeral private, client public)
      const shared1 = Curve.sharedKey(serverEphemeral.private, clientPublicKey);
      const derived1 = await hkdf(shared1, 64, { salt, info: "" });
      salt = derived1.subarray(0, 32);
      encKey = derived1.subarray(32);
      writeCounter = 0;

      // Server: encrypt static key
      const iv1 = generateIV(writeCounter);
      const encryptedStatic = aesEncryptGCM(
        serverStatic.public,
        encKey,
        iv1,
        hash,
      );
      writeCounter++;
      hash = sha256(Buffer.concat([hash, encryptedStatic]));

      // Server: mixIntoKey with shared secret (server static private, client public)
      const shared2 = Curve.sharedKey(serverStatic.private, clientPublicKey);
      const derived2 = await hkdf(shared2, 64, { salt, info: "" });
      salt = derived2.subarray(0, 32);
      encKey = derived2.subarray(32);
      writeCounter = 0;

      // Server: encrypt certificate payload
      const iv2 = generateIV(writeCounter);
      const encryptedPayload = aesEncryptGCM(certPayload, encKey, iv2, hash);
      writeCounter++;
      hash = sha256(Buffer.concat([hash, encryptedPayload]));

      return {
        serverEphemeral,
        serverStatic,
        certPayload,
        encryptedStatic,
        encryptedPayload,
        // Final state for verification
        finalHash: hash,
        finalSalt: salt,
        finalEncKey: encKey,
      };
    }

    it("processHandshakeInit should decrypt server hello correctly", async () => {
      // Client key pair
      const clientKeyPair = Curve.generateKeyPair();

      // Create WASM session
      const session = new NoiseSession(
        clientKeyPair.public,
        testNoiseHeader,
        undefined,
      );

      // Create mock server hello
      const serverHello = await createMockServerHello(
        Buffer.from(clientKeyPair.public),
      );

      // Process handshake init with WASM
      const certPayloadResult = session.processHandshakeInit(
        serverHello.serverEphemeral.public,
        serverHello.encryptedStatic,
        serverHello.encryptedPayload,
        clientKeyPair.private,
      );

      // Verify decrypted payload matches original
      expect(hex(certPayloadResult)).toBe(hex(serverHello.certPayload));
    });

    it("processHandshakeInit should match Baileys step-by-step implementation", async () => {
      // Client key pair
      const clientKeyPair = Curve.generateKeyPair();

      // Create mock server hello
      const serverHello = await createMockServerHello(
        Buffer.from(clientKeyPair.public),
      );

      // WASM implementation
      const wasmSession = new NoiseSession(
        clientKeyPair.public,
        testNoiseHeader,
        undefined,
      );
      const wasmCertPayload = wasmSession.processHandshakeInit(
        serverHello.serverEphemeral.public,
        serverHello.encryptedStatic,
        serverHello.encryptedPayload,
        clientKeyPair.private,
      );

      // Baileys step-by-step implementation
      const data = Buffer.from(NOISE_MODE);
      let jsHash = data.length === 32 ? data : sha256(data);
      let jsSalt = jsHash;
      let jsEncKey = jsHash;
      let jsDecKey = jsHash;
      let jsWriteCounter = 0;

      // Initial authenticate
      jsHash = sha256(Buffer.concat([jsHash, testNoiseHeader]));
      jsHash = sha256(Buffer.concat([jsHash, clientKeyPair.public]));

      // Step 1: authenticate ephemeral
      jsHash = sha256(
        Buffer.concat([jsHash, serverHello.serverEphemeral.public]),
      );

      // Step 2: mixIntoKey
      const jsShared1 = Curve.sharedKey(
        clientKeyPair.private,
        serverHello.serverEphemeral.public,
      );
      const jsDerived1 = await hkdf(jsShared1, 64, { salt: jsSalt, info: "" });
      jsSalt = jsDerived1.subarray(0, 32);
      jsEncKey = jsDerived1.subarray(32);
      jsDecKey = jsEncKey;
      jsWriteCounter = 0;

      // Step 3: decrypt static
      const jsIv1 = generateIV(jsWriteCounter);
      const jsDecStatic = aesDecryptGCM(
        serverHello.encryptedStatic,
        jsDecKey,
        jsIv1,
        jsHash,
      );
      jsWriteCounter++;
      jsHash = sha256(Buffer.concat([jsHash, serverHello.encryptedStatic]));

      // Step 4: mixIntoKey with static
      const jsShared2 = Curve.sharedKey(clientKeyPair.private, jsDecStatic);
      const jsDerived2 = await hkdf(jsShared2, 64, { salt: jsSalt, info: "" });
      jsSalt = jsDerived2.subarray(0, 32);
      jsEncKey = jsDerived2.subarray(32);
      jsDecKey = jsEncKey;
      jsWriteCounter = 0;

      // Step 5: decrypt payload
      const jsIv2 = generateIV(jsWriteCounter);
      const jsCertPayload = aesDecryptGCM(
        serverHello.encryptedPayload,
        jsDecKey,
        jsIv2,
        jsHash,
      );

      // Compare results
      expect(hex(wasmCertPayload)).toBe(hex(jsCertPayload));
    });

    it("processHandshakeFinish should encrypt key and mix correctly", async () => {
      // Client key pair
      const clientKeyPair = Curve.generateKeyPair();
      // Noise key pair (secondary key used in handshake)
      const noiseKeyPair = Curve.generateKeyPair();

      // Create mock server hello
      const serverHello = await createMockServerHello(
        Buffer.from(clientKeyPair.public),
      );

      // WASM implementation - init phase
      const wasmSession = new NoiseSession(
        clientKeyPair.public,
        testNoiseHeader,
        undefined,
      );
      wasmSession.processHandshakeInit(
        serverHello.serverEphemeral.public,
        serverHello.encryptedStatic,
        serverHello.encryptedPayload,
        clientKeyPair.private,
      );

      // WASM implementation - finish phase
      const wasmEncryptedKey = wasmSession.processHandshakeFinish(
        noiseKeyPair.public,
        noiseKeyPair.private,
        serverHello.serverEphemeral.public,
      );

      // Baileys step-by-step - replicate entire flow
      const data = Buffer.from(NOISE_MODE);
      let jsHash = data.length === 32 ? data : sha256(data);
      let jsSalt = jsHash;
      let jsEncKey = jsHash;
      let jsDecKey = jsHash;
      let jsWriteCounter = 0;

      // Initial authenticate
      jsHash = sha256(Buffer.concat([jsHash, testNoiseHeader]));
      jsHash = sha256(Buffer.concat([jsHash, clientKeyPair.public]));

      // Step 1-5 (init phase)
      jsHash = sha256(
        Buffer.concat([jsHash, serverHello.serverEphemeral.public]),
      );
      const jsShared1 = Curve.sharedKey(
        clientKeyPair.private,
        serverHello.serverEphemeral.public,
      );
      const jsDerived1 = await hkdf(jsShared1, 64, { salt: jsSalt, info: "" });
      jsSalt = jsDerived1.subarray(0, 32);
      jsEncKey = jsDerived1.subarray(32);
      jsDecKey = jsEncKey;
      jsWriteCounter = 0;

      const jsIv1 = generateIV(jsWriteCounter);
      const jsDecStatic = aesDecryptGCM(
        serverHello.encryptedStatic,
        jsDecKey,
        jsIv1,
        jsHash,
      );
      jsWriteCounter++;
      jsHash = sha256(Buffer.concat([jsHash, serverHello.encryptedStatic]));

      const jsShared2 = Curve.sharedKey(clientKeyPair.private, jsDecStatic);
      const jsDerived2 = await hkdf(jsShared2, 64, { salt: jsSalt, info: "" });
      jsSalt = jsDerived2.subarray(0, 32);
      jsEncKey = jsDerived2.subarray(32);
      jsDecKey = jsEncKey;
      jsWriteCounter = 0;

      const jsIv2 = generateIV(jsWriteCounter);
      aesDecryptGCM(serverHello.encryptedPayload, jsDecKey, jsIv2, jsHash);
      jsWriteCounter++;
      jsHash = sha256(Buffer.concat([jsHash, serverHello.encryptedPayload]));

      // Step 7: encrypt noise public key
      const jsIv3 = generateIV(jsWriteCounter);
      const jsEncryptedKey = aesEncryptGCM(
        noiseKeyPair.public,
        jsEncKey,
        jsIv3,
        jsHash,
      );
      jsWriteCounter++;
      jsHash = sha256(Buffer.concat([jsHash, jsEncryptedKey]));

      // Step 8: final mixIntoKey
      const jsShared3 = Curve.sharedKey(
        noiseKeyPair.private,
        serverHello.serverEphemeral.public,
      );
      const jsDerived3 = await hkdf(jsShared3, 64, { salt: jsSalt, info: "" });

      // Compare encrypted keys
      expect(hex(wasmEncryptedKey)).toBe(hex(jsEncryptedKey));
    });

    it("full handshake should produce identical state to Baileys", async () => {
      // Client key pair
      const clientKeyPair = Curve.generateKeyPair();
      // Noise key pair
      const noiseKeyPair = Curve.generateKeyPair();

      // Create mock server hello
      const serverHello = await createMockServerHello(
        Buffer.from(clientKeyPair.public),
      );

      // WASM full handshake
      const wasmSession = new NoiseSession(
        clientKeyPair.public,
        testNoiseHeader,
        undefined,
      );
      wasmSession.processHandshakeInit(
        serverHello.serverEphemeral.public,
        serverHello.encryptedStatic,
        serverHello.encryptedPayload,
        clientKeyPair.private,
      );
      wasmSession.processHandshakeFinish(
        noiseKeyPair.public,
        noiseKeyPair.private,
        serverHello.serverEphemeral.public,
      );
      wasmSession.finishInit();

      // Baileys full handshake simulation
      const data = Buffer.from(NOISE_MODE);
      let jsHash = data.length === 32 ? data : sha256(data);
      let jsSalt = jsHash;
      let jsEncKey = jsHash;
      let jsWriteCounter = 0;

      jsHash = sha256(Buffer.concat([jsHash, testNoiseHeader]));
      jsHash = sha256(Buffer.concat([jsHash, clientKeyPair.public]));

      // Init phase
      jsHash = sha256(
        Buffer.concat([jsHash, serverHello.serverEphemeral.public]),
      );
      let derived = await hkdf(
        Curve.sharedKey(
          clientKeyPair.private,
          serverHello.serverEphemeral.public,
        ),
        64,
        { salt: jsSalt, info: "" },
      );
      jsSalt = derived.subarray(0, 32);
      jsEncKey = derived.subarray(32);
      jsWriteCounter = 0;

      let iv = generateIV(jsWriteCounter);
      const jsDecStatic = aesDecryptGCM(
        serverHello.encryptedStatic,
        jsEncKey,
        iv,
        jsHash,
      );
      jsWriteCounter++;
      jsHash = sha256(Buffer.concat([jsHash, serverHello.encryptedStatic]));

      derived = await hkdf(
        Curve.sharedKey(clientKeyPair.private, jsDecStatic),
        64,
        { salt: jsSalt, info: "" },
      );
      jsSalt = derived.subarray(0, 32);
      jsEncKey = derived.subarray(32);
      jsWriteCounter = 0;

      iv = generateIV(jsWriteCounter);
      aesDecryptGCM(serverHello.encryptedPayload, jsEncKey, iv, jsHash);
      jsWriteCounter++;
      jsHash = sha256(Buffer.concat([jsHash, serverHello.encryptedPayload]));

      // Finish phase
      iv = generateIV(jsWriteCounter);
      const jsEncryptedKey = aesEncryptGCM(
        noiseKeyPair.public,
        jsEncKey,
        iv,
        jsHash,
      );
      jsWriteCounter++;
      jsHash = sha256(Buffer.concat([jsHash, jsEncryptedKey]));

      derived = await hkdf(
        Curve.sharedKey(
          noiseKeyPair.private,
          serverHello.serverEphemeral.public,
        ),
        64,
        { salt: jsSalt, info: "" },
      );
      jsSalt = derived.subarray(0, 32);
      jsEncKey = derived.subarray(32);

      // finishInit
      derived = await hkdf(Buffer.alloc(0), 64, { salt: jsSalt, info: "" });
      const jsEncKeyFinal = derived.subarray(0, 32);
      const jsDecKeyFinal = derived.subarray(32);

      // After finishInit, verify both produce same encryption
      const testPlaintext = Buffer.from("Test after handshake complete");
      const testIv = generateIV(0);
      const emptyHash = Buffer.alloc(0);

      const wasmEncrypted = wasmSession.encrypt(testPlaintext);
      const jsEncrypted = aesEncryptGCM(
        testPlaintext,
        jsEncKeyFinal,
        testIv,
        emptyHash,
      );

      expect(hex(wasmEncrypted)).toBe(hex(jsEncrypted));
    });
  });
});
