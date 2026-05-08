import { run, bench, do_not_optimize, boxplot, summary } from "mitata";
import {
  LTHashAntiTampering,
  expandAppStateKeys,
  generateContentMac,
  generateSnapshotMac,
  generatePatchMac,
  generateIndexMac,
} from "../dist/index.js";

import { hkdf, hmacSign, LT_HASH_ANTI_TAMPERING } from "baileys";

async function baileysExpandKeys(keydata: Uint8Array) {
  const expanded = await hkdf(keydata, 160, { info: "WhatsApp Mutation Keys" });
  return {
    indexKey: expanded.slice(0, 32),
    valueEncryptionKey: expanded.slice(32, 64),
    valueMacKey: expanded.slice(64, 96),
    snapshotMacKey: expanded.slice(96, 128),
    patchMacKey: expanded.slice(128, 160),
  };
}

function baileysGenerateContentMac(
  operation: number,
  data: Buffer,
  keyId: string,
  key: Buffer
): Buffer {
  const r = operation === 1 ? 0x01 : 0x02;
  const keyData = Buffer.concat([
    Buffer.from([r]),
    Buffer.from(keyId, "base64"),
  ]);
  const last = Buffer.alloc(8);
  last.set([keyData.length], last.length - 1);
  const total = Buffer.concat([keyData, data, last]);
  return hmacSign(total, key, "sha512").slice(0, 32);
}

function baileysGenerateSnapshotMac(
  lthash: Uint8Array,
  version: number,
  name: string,
  key: Buffer
): Buffer {
  const versionBuff = Buffer.alloc(8);
  versionBuff.writeUint32BE(version, 4);
  const total = Buffer.concat([
    lthash,
    versionBuff,
    Buffer.from(name, "utf-8"),
  ]);
  return hmacSign(total, key, "sha256");
}

function baileysGeneratePatchMac(
  snapshotMac: Uint8Array,
  valueMacs: Uint8Array[],
  version: number,
  type: string,
  key: Buffer
): Buffer {
  const versionBuff = Buffer.alloc(8);
  versionBuff.writeUint32BE(version, 4);
  const total = Buffer.concat([
    snapshotMac,
    ...valueMacs,
    versionBuff,
    Buffer.from(type, "utf-8"),
  ]);
  return hmacSign(total, key);
}

const masterKey = new Uint8Array(32);
crypto.getRandomValues(masterKey);

const wasmKeys = expandAppStateKeys(masterKey);
const baileysKeys = await baileysExpandKeys(masterKey);

const baseHash = new Uint8Array(128).fill(0);

const valueMac1 = new Uint8Array(32);
const valueMac2 = new Uint8Array(32);
const valueMac3 = new Uint8Array(32);
const valueMac4 = new Uint8Array(32);
const valueMac5 = new Uint8Array(32);
crypto.getRandomValues(valueMac1);
crypto.getRandomValues(valueMac2);
crypto.getRandomValues(valueMac3);
crypto.getRandomValues(valueMac4);
crypto.getRandomValues(valueMac5);

const addItems = [valueMac1, valueMac2, valueMac3];
const subtractItems = [valueMac4, valueMac5];

const encryptedContent = Buffer.alloc(256);
crypto.getRandomValues(encryptedContent);
const keyIdBase64 = Buffer.from("test-key-id-12345").toString("base64");

const indexJson = JSON.stringify(["mute", "1234567890@s.whatsapp.net"]);
const indexBytes = Buffer.from(indexJson);

const snapshotMac = new Uint8Array(32);
crypto.getRandomValues(snapshotMac);
const patchValueMacs = [valueMac1, valueMac2, valueMac3];

const ltHashWasm = new LTHashAntiTampering();

console.log("\n🔑 AppState Benchmark: Baileys vs Rust WASM\n");

boxplot(() => {
  summary(() => {
    bench("Key Expansion (Rust WASM)", () => {
      const result = expandAppStateKeys(masterKey);
      do_not_optimize(result);
    }).gc("inner");

    bench("Key Expansion (Baileys)", async () => {
      const result = await baileysExpandKeys(masterKey);
      do_not_optimize(result);
    }).gc("inner");
  });

  summary(() => {
    bench("LT-Hash subtractThenAdd - 3 adds (Rust WASM)", () => {
      const result = ltHashWasm.subtractThenAdd(baseHash, [], addItems);
      do_not_optimize(result);
    }).gc("inner");

    bench("LT-Hash subtractThenAdd - 3 adds (Baileys)", async () => {
      const result = await LT_HASH_ANTI_TAMPERING.subtractThenAdd(
        baseHash.buffer as ArrayBuffer,
        addItems.map((i) => i.buffer as ArrayBuffer),
        []
      );
      do_not_optimize(result);
    }).gc("inner");
  });

  summary(() => {
    bench("LT-Hash subtractThenAdd - mixed ops (Rust WASM)", () => {
      const result = ltHashWasm.subtractThenAdd(
        baseHash,
        subtractItems,
        addItems
      );
      do_not_optimize(result);
    }).gc("inner");

    bench("LT-Hash subtractThenAdd - mixed ops (Baileys)", async () => {
      const result = await LT_HASH_ANTI_TAMPERING.subtractThenAdd(
        baseHash.buffer as ArrayBuffer,
        addItems.map((i) => i.buffer as ArrayBuffer),
        subtractItems.map((i) => i.buffer as ArrayBuffer)
      );
      do_not_optimize(result);
    }).gc("inner");
  });

  summary(() => {
    bench("Content MAC generation (Rust WASM)", () => {
      const result = generateContentMac(
        1,
        encryptedContent,
        Buffer.from(keyIdBase64, "base64"),
        wasmKeys.valueMacKey
      );
      do_not_optimize(result);
    }).gc("inner");

    bench("Content MAC generation (Baileys)", () => {
      const result = baileysGenerateContentMac(
        1,
        encryptedContent,
        keyIdBase64,
        baileysKeys.valueMacKey
      );
      do_not_optimize(result);
    }).gc("inner");
  });

  summary(() => {
    bench("Index MAC generation (Rust WASM)", () => {
      const result = generateIndexMac(indexBytes, wasmKeys.indexKey);
      do_not_optimize(result);
    }).gc("inner");

    bench("Index MAC generation (Baileys)", () => {
      const result = hmacSign(indexBytes, baileysKeys.indexKey);
      do_not_optimize(result);
    }).gc("inner");
  });

  summary(() => {
    bench("Snapshot MAC generation (Rust WASM)", () => {
      const result = generateSnapshotMac(
        baseHash,
        BigInt(42),
        "regular_high",
        wasmKeys.snapshotMacKey
      );
      do_not_optimize(result);
    }).gc("inner");

    bench("Snapshot MAC generation (Baileys)", () => {
      const result = baileysGenerateSnapshotMac(
        baseHash,
        42,
        "regular_high",
        baileysKeys.snapshotMacKey
      );
      do_not_optimize(result);
    }).gc("inner");
  });

  summary(() => {
    bench("Patch MAC generation (Rust WASM)", () => {
      const result = generatePatchMac(
        snapshotMac,
        patchValueMacs,
        BigInt(5),
        "regular_high",
        wasmKeys.patchMacKey
      );
      do_not_optimize(result);
    }).gc("inner");

    bench("Patch MAC generation (Baileys)", () => {
      const result = baileysGeneratePatchMac(
        snapshotMac,
        patchValueMacs,
        5,
        "regular_high",
        baileysKeys.patchMacKey
      );
      do_not_optimize(result);
    }).gc("inner");
  });

  summary(() => {
    bench("Full mutation encode flow (Rust WASM)", () => {
      const keys = expandAppStateKeys(masterKey);
      const indexMac = generateIndexMac(indexBytes, keys.indexKey);
      const contentMac = generateContentMac(
        1,
        encryptedContent,
        Buffer.from(keyIdBase64, "base64"),
        keys.valueMacKey
      );
      const newHash = ltHashWasm.subtractThenAdd(baseHash, [], [contentMac]);
      const snapMac = generateSnapshotMac(
        newHash,
        BigInt(1),
        "regular_high",
        keys.snapshotMacKey
      );
      const patchMac = generatePatchMac(
        snapMac,
        [contentMac],
        BigInt(1),
        "regular_high",
        keys.patchMacKey
      );

      do_not_optimize(indexMac);
      do_not_optimize(contentMac);
      do_not_optimize(newHash);
      do_not_optimize(snapMac);
      do_not_optimize(patchMac);
    }).gc("inner");

    bench("Full mutation encode flow (Baileys)", async () => {
      const keys = await baileysExpandKeys(masterKey);
      const indexMac = hmacSign(indexBytes, keys.indexKey);
      const contentMac = baileysGenerateContentMac(
        1,
        encryptedContent,
        keyIdBase64,
        keys.valueMacKey
      );
      const newHash = await LT_HASH_ANTI_TAMPERING.subtractThenAdd(
        baseHash.buffer as ArrayBuffer,
        [contentMac.buffer as ArrayBuffer],
        []
      );
      const snapMac = baileysGenerateSnapshotMac(
        new Uint8Array(newHash),
        1,
        "regular_high",
        keys.snapshotMacKey
      );
      const patchMac = baileysGeneratePatchMac(
        snapMac,
        [contentMac],
        1,
        "regular_high",
        keys.patchMacKey
      );

      do_not_optimize(indexMac);
      do_not_optimize(contentMac);
      do_not_optimize(newHash);
      do_not_optimize(snapMac);
      do_not_optimize(patchMac);
    }).gc("inner");
  });
});

await run();
