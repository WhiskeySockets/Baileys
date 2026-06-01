import { NoiseSession, encodeNode, type BinaryNode } from "../dist/index.js";
import { run, bench, do_not_optimize, boxplot, summary } from "mitata";
import { randomBytes } from "crypto";
import { aesEncryptGCM, sha256, hkdf } from "baileys/lib/Utils/crypto.js";
import { encodeBinaryNode } from "baileys";

// Test data
const testPublicKey = randomBytes(32);
const testNoiseHeader = Buffer.from([0x57, 0x41, 0x06, 0x05]);
const testPlaintext = randomBytes(256);
const testNode: BinaryNode = {
  tag: "message",
  attrs: {
    to: "1234567890@s.whatsapp.net",
    id: "3EB0622825A79604144A",
    type: "text",
    t: String(Math.floor(Date.now() / 1000)),
  },
  content: [
    {
      tag: "conversation",
      attrs: {},
      content:
        "Hello from a benchmark test! This is a longer message to make the benchmark more realistic.",
    },
    {
      tag: "ephemeral_setting",
      attrs: {
        timestamp: String(Date.now()),
        expiration: "604800",
      },
    },
  ],
};

// Pre-encoded node for decode benchmarks
const encodedNode = Buffer.from(encodeNode(testNode));

// Helper: Generate IV like Baileys
function generateIV(counter: number): Uint8Array {
  const iv = new ArrayBuffer(12);
  new DataView(iv).setUint32(8, counter);
  return new Uint8Array(iv);
}

// JS reference implementation for comparison
class JSNoiseSession {
  hash: Buffer;
  salt: Buffer;
  encKey: Buffer;
  decKey: Buffer;
  writeCounter = 0;
  isFinished = false;

  constructor(publicKey: Buffer, noiseHeader: Buffer) {
    const data = Buffer.from("Noise_XX_25519_AESGCM_SHA256\0\0\0\0");
    this.hash = data.length === 32 ? data : sha256(data);
    this.salt = this.hash;
    this.encKey = this.hash;
    this.decKey = this.hash;
    this.authenticate(noiseHeader);
    this.authenticate(publicKey);
  }

  authenticate(data: Buffer): void {
    if (!this.isFinished) {
      this.hash = sha256(Buffer.concat([this.hash, data]));
    }
  }

  encrypt(plaintext: Buffer): Buffer {
    const result = aesEncryptGCM(
      plaintext,
      this.encKey,
      generateIV(this.writeCounter),
      this.hash,
    );
    this.writeCounter++;
    this.authenticate(result);
    return result;
  }

  async finishInit(): Promise<void> {
    const derived = await hkdf(Buffer.alloc(0), 64, {
      salt: this.salt,
      info: "",
    });
    this.encKey = derived.subarray(0, 32);
    this.decKey = derived.subarray(32);
    this.hash = Buffer.alloc(0);
    this.writeCounter = 0;
    this.isFinished = true;
  }

  encodeFrameRaw(data: Buffer): Buffer {
    const encrypted = this.isFinished ? this.encrypt(data) : data;
    const frame = Buffer.alloc(3 + encrypted.length);
    frame.writeUInt8(encrypted.length >> 16, 0);
    frame.writeUInt16BE(encrypted.length & 0xffff, 1);
    encrypted.copy(frame, 3);
    return frame;
  }

  encodeFrame(node: BinaryNode): Buffer {
    const encoded = encodeBinaryNode(node);
    return this.encodeFrameRaw(encoded);
  }
}

console.log("NoiseSession Benchmark");
console.log("======================\n");

boxplot(() => {
  summary(() => {
    bench("NoiseSession WASM - constructor", () => {
      const session = new NoiseSession(
        testPublicKey,
        testNoiseHeader,
        undefined,
      );
      do_not_optimize(session);
    }).gc("inner");

    bench("NoiseSession JS - constructor", () => {
      const session = new JSNoiseSession(testPublicKey, testNoiseHeader);
      do_not_optimize(session);
    }).gc("inner");
  });
});

boxplot(() => {
  summary(() => {
    let wasmSession: NoiseSession;
    let jsSession: JSNoiseSession;

    bench("NoiseSession WASM - encrypt (256 bytes)", () => {
      wasmSession = new NoiseSession(testPublicKey, testNoiseHeader, undefined);
      const result = wasmSession.encrypt(testPlaintext);
      do_not_optimize(result);
    }).gc("inner");

    bench("NoiseSession JS - encrypt (256 bytes)", () => {
      jsSession = new JSNoiseSession(testPublicKey, testNoiseHeader);
      const result = jsSession.encrypt(testPlaintext);
      do_not_optimize(result);
    }).gc("inner");
  });
});

boxplot(() => {
  summary(() => {
    bench("NoiseSession WASM - encodeFrameRaw (no encryption)", () => {
      const session = new NoiseSession(
        testPublicKey,
        testNoiseHeader,
        undefined,
      );
      const result = session.encodeFrameRaw(testPlaintext);
      do_not_optimize(result);
    }).gc("inner");

    bench("NoiseSession JS - encodeFrameRaw (no encryption)", () => {
      const session = new JSNoiseSession(testPublicKey, testNoiseHeader);
      const result = session.encodeFrameRaw(testPlaintext);
      do_not_optimize(result);
    }).gc("inner");
  });
});

boxplot(() => {
  summary(() => {
    bench("NoiseSession WASM - encodeFrame (combined)", () => {
      const session = new NoiseSession(
        testPublicKey,
        testNoiseHeader,
        undefined,
      );
      const result = session.encodeFrame(testNode);
      do_not_optimize(result);
    }).gc("inner");

    bench("NoiseSession JS - encodeFrame (separate ops)", () => {
      const session = new JSNoiseSession(testPublicKey, testNoiseHeader);
      const result = session.encodeFrame(testNode);
      do_not_optimize(result);
    }).gc("inner");
  });
});

// Post-finishInit benchmarks
boxplot(() => {
  summary(() => {
    bench("NoiseSession WASM - encodeFrame after finishInit", async () => {
      const session = new NoiseSession(
        testPublicKey,
        testNoiseHeader,
        undefined,
      );
      session.finishInit();
      const result = session.encodeFrame(testNode);
      do_not_optimize(result);
    }).gc("inner");

    bench("NoiseSession JS - encodeFrame after finishInit", async () => {
      const session = new JSNoiseSession(testPublicKey, testNoiseHeader);
      await session.finishInit();
      const result = session.encodeFrame(testNode);
      do_not_optimize(result);
    }).gc("inner");
  });
});

// Frame decoding benchmark
boxplot(() => {
  summary(() => {
    // Prepare test frames
    const frameData = Buffer.alloc(3 + encodedNode.length);
    frameData.writeUInt8(encodedNode.length >> 16, 0);
    frameData.writeUInt16BE(encodedNode.length & 0xffff, 1);
    encodedNode.copy(frameData, 3);

    bench("NoiseSession WASM - decodeFrame (handshake mode)", () => {
      const session = new NoiseSession(
        testPublicKey,
        testNoiseHeader,
        undefined,
      );
      session.decodeFrame(frameData);
    }).gc("inner");

    bench("Buffer parsing JS - decodeFrame equivalent", () => {
      let inBytes = Buffer.alloc(0);
      inBytes = Buffer.concat([inBytes, frameData]);
      const size = (inBytes.readUInt8() << 16) | inBytes.readUInt16BE(1);
      const frame = inBytes.slice(3, size + 3);
      do_not_optimize(frame);
    }).gc("inner");
  });
});

// Multiple encrypt operations (simulating message burst)
boxplot(() => {
  summary(() => {
    bench("NoiseSession WASM - 10 encrypts", () => {
      const session = new NoiseSession(
        testPublicKey,
        testNoiseHeader,
        undefined,
      );
      for (let i = 0; i < 10; i++) {
        const result = session.encrypt(testPlaintext);
        do_not_optimize(result);
      }
    }).gc("inner");

    bench("NoiseSession JS - 10 encrypts", () => {
      const session = new JSNoiseSession(testPublicKey, testNoiseHeader);
      for (let i = 0; i < 10; i++) {
        const result = session.encrypt(testPlaintext);
        do_not_optimize(result);
      }
    }).gc("inner");
  });
});

await run();
