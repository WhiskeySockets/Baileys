import { describe, it, expect } from "bun:test";
import {
  LTHashAntiTampering,
  expandAppStateKeys,
  generateContentMac,
  generateSnapshotMac,
  generatePatchMac,
  generateIndexMac,
  LTHashState,
} from "../dist";

import { hkdf, hmacSign } from "baileys/lib/Utils/crypto";
import { LT_HASH_ANTI_TAMPERING } from "baileys/lib/Utils/lt-hash";

function toHex(buffer: Uint8Array | ArrayBuffer): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Buffer.from(bytes).toString("hex");
}

async function mutationKeys(keydata: Uint8Array) {
  const expanded = await hkdf(keydata, 160, { info: "WhatsApp Mutation Keys" });
  return {
    indexKey: expanded.slice(0, 32),
    valueEncryptionKey: expanded.slice(32, 64),
    valueMacKey: expanded.slice(64, 96),
    snapshotMacKey: expanded.slice(96, 128),
    patchMacKey: expanded.slice(128, 160),
  };
}

function baileysGenerateMac(
  operation: number,
  data: Buffer,
  keyId: Uint8Array | string,
  key: Buffer
): Buffer {
  const getKeyData = () => {
    let r: number;
    if (operation === 1) {
      r = 0x01;
    } else {
      r = 0x02;
    }
    const buff = Buffer.from([r]);
    return Buffer.concat([buff, Buffer.from(keyId as string, "base64")]);
  };

  const keyData = getKeyData();
  const last = Buffer.alloc(8);
  last.set([keyData.length], last.length - 1);

  const total = Buffer.concat([keyData, data, last]);
  const hmac = hmacSign(total, key, "sha512");

  return hmac.slice(0, 32);
}

function baileysGenerateSnapshotMac(
  lthash: Uint8Array,
  version: number,
  name: string,
  key: Buffer
): Buffer {
  const to64BitNetworkOrder = (e: number) => {
    const buff = Buffer.alloc(8);
    buff.writeUint32BE(e, 4);
    return buff;
  };

  const total = Buffer.concat([
    lthash,
    to64BitNetworkOrder(version),
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
  const to64BitNetworkOrder = (e: number) => {
    const buff = Buffer.alloc(8);
    buff.writeUint32BE(e, 4);
    return buff;
  };

  const total = Buffer.concat([
    snapshotMac,
    ...valueMacs,
    to64BitNetworkOrder(version),
    Buffer.from(type, "utf-8"),
  ]);
  return hmacSign(total, key);
}

describe("AppState Parity: Baileys vs WASM", () => {
  describe("Key Expansion (mutationKeys)", () => {
    it("should expand keys identically to Baileys", async () => {
      const keyData = new Uint8Array(32).fill(7);

      const baileysKeys = await mutationKeys(keyData);

      const wasmKeys = expandAppStateKeys(keyData);

      expect(toHex(wasmKeys.indexKey)).toBe(toHex(baileysKeys.indexKey));
      expect(toHex(wasmKeys.valueEncryptionKey)).toBe(
        toHex(baileysKeys.valueEncryptionKey)
      );
      expect(toHex(wasmKeys.valueMacKey)).toBe(toHex(baileysKeys.valueMacKey));
      expect(toHex(wasmKeys.snapshotMacKey)).toBe(
        toHex(baileysKeys.snapshotMacKey)
      );
      expect(toHex(wasmKeys.patchMacKey)).toBe(toHex(baileysKeys.patchMacKey));
    });

    it("should expand keys identically with random key data", async () => {
      const keyData = new Uint8Array(32);
      crypto.getRandomValues(keyData);

      const baileysKeys = await mutationKeys(keyData);
      const wasmKeys = expandAppStateKeys(keyData);

      expect(toHex(wasmKeys.indexKey)).toBe(toHex(baileysKeys.indexKey));
      expect(toHex(wasmKeys.valueEncryptionKey)).toBe(
        toHex(baileysKeys.valueEncryptionKey)
      );
      expect(toHex(wasmKeys.valueMacKey)).toBe(toHex(baileysKeys.valueMacKey));
      expect(toHex(wasmKeys.snapshotMacKey)).toBe(
        toHex(baileysKeys.snapshotMacKey)
      );
      expect(toHex(wasmKeys.patchMacKey)).toBe(toHex(baileysKeys.patchMacKey));
    });
  });

  describe("LT-Hash Operations", () => {
    it("should perform subtractThenAdd identically (empty subtract)", async () => {
      const ltHashWasm = new LTHashAntiTampering();
      const base = new Uint8Array(128).fill(0);
      const addItem = new Uint8Array([1, 2, 3, 4, 5]);

      const baileysResult = await LT_HASH_ANTI_TAMPERING.subtractThenAdd(
        base.buffer as ArrayBuffer,
        [addItem.buffer as ArrayBuffer],
        []
      );

      const wasmResult = ltHashWasm.subtractThenAdd(base, [], [addItem]);

      expect(toHex(wasmResult)).toBe(toHex(baileysResult));
    });

    it("should perform subtractThenAdd identically (empty add)", async () => {
      const ltHashWasm = new LTHashAntiTampering();

      const initialBase = new Uint8Array(128).fill(0);
      const item = new Uint8Array([1, 2, 3, 4, 5]);

      const baileysAfterAdd = await LT_HASH_ANTI_TAMPERING.subtractThenAdd(
        initialBase.buffer as ArrayBuffer,
        [item.buffer as ArrayBuffer],
        []
      );

      const baileysResult = await LT_HASH_ANTI_TAMPERING.subtractThenAdd(
        baileysAfterAdd,
        [],
        [item.buffer as ArrayBuffer]
      );

      const wasmAfterAdd = ltHashWasm.subtractThenAdd(initialBase, [], [item]);
      const wasmResult = ltHashWasm.subtractThenAdd(wasmAfterAdd, [item], []);

      expect(toHex(wasmResult)).toBe(toHex(baileysResult));
    });

    it("should perform subtractThenAdd identically (both subtract and add)", async () => {
      const ltHashWasm = new LTHashAntiTampering();
      const base = new Uint8Array(128);
      for (let i = 0; i < 128; i++) {
        base[i] = i % 256;
      }

      const subtractItems = [
        new Uint8Array([10, 20, 30]),
        new Uint8Array([40, 50]),
      ];
      const addItems = [
        new Uint8Array([1, 2, 3, 4]),
        new Uint8Array([5, 6, 7]),
        new Uint8Array([8]),
      ];

      const baileysResult = await LT_HASH_ANTI_TAMPERING.subtractThenAdd(
        base.buffer as ArrayBuffer,
        addItems.map((i) => i.buffer as ArrayBuffer),
        subtractItems.map((i) => i.buffer as ArrayBuffer)
      );

      const wasmResult = ltHashWasm.subtractThenAdd(
        base,
        subtractItems,
        addItems
      );

      expect(toHex(wasmResult)).toBe(toHex(baileysResult));
    });

    it("should handle round-trip (add then subtract same values)", async () => {
      const ltHashWasm = new LTHashAntiTampering();
      const originalBase = new Uint8Array(128).fill(42);
      const items = [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([4, 5, 6, 7]),
        new Uint8Array([8, 9]),
      ];

      const afterAddWasm = ltHashWasm.subtractThenAdd(originalBase, [], items);

      const afterSubtractWasm = ltHashWasm.subtractThenAdd(
        afterAddWasm,
        items,
        []
      );

      expect(toHex(afterSubtractWasm)).toBe(toHex(originalBase));
    });

    it("should match Baileys for realistic value MACs", async () => {
      const ltHashWasm = new LTHashAntiTampering();
      const base = new Uint8Array(128).fill(0);

      const valueMac1 = new Uint8Array(32);
      const valueMac2 = new Uint8Array(32);
      const valueMac3 = new Uint8Array(32);
      crypto.getRandomValues(valueMac1);
      crypto.getRandomValues(valueMac2);
      crypto.getRandomValues(valueMac3);

      const baileysResult = await LT_HASH_ANTI_TAMPERING.subtractThenAdd(
        base.buffer as ArrayBuffer,
        [
          valueMac1.buffer as ArrayBuffer,
          valueMac2.buffer as ArrayBuffer,
          valueMac3.buffer as ArrayBuffer,
        ],
        []
      );

      const wasmResult = ltHashWasm.subtractThenAdd(
        base,
        [],
        [valueMac1, valueMac2, valueMac3]
      );

      expect(toHex(wasmResult)).toBe(toHex(baileysResult));
    });
  });

  describe("Content MAC Generation", () => {
    it("should generate content MAC identically for SET operation", async () => {
      const keyData = new Uint8Array(32).fill(7);
      const baileysKeys = await mutationKeys(keyData);
      const wasmKeys = expandAppStateKeys(keyData);

      const data = Buffer.from("test encrypted data");
      const keyId = Buffer.from("test-key-id").toString("base64");

      const baileysMac = baileysGenerateMac(
        1,
        data,
        keyId,
        baileysKeys.valueMacKey
      );

      const wasmMac = generateContentMac(
        1,
        data,
        Buffer.from(keyId, "base64"),
        wasmKeys.valueMacKey
      );

      expect(toHex(wasmMac)).toBe(toHex(baileysMac));
    });

    it("should generate content MAC identically for REMOVE operation", async () => {
      const keyData = new Uint8Array(32).fill(42);
      const baileysKeys = await mutationKeys(keyData);
      const wasmKeys = expandAppStateKeys(keyData);

      const data = Buffer.from("some content to remove");
      const keyId = Buffer.from("another-key-id").toString("base64");

      const baileysMac = baileysGenerateMac(
        2,
        data,
        keyId,
        baileysKeys.valueMacKey
      );

      const wasmMac = generateContentMac(
        2,
        data,
        Buffer.from(keyId, "base64"),
        wasmKeys.valueMacKey
      );

      expect(toHex(wasmMac)).toBe(toHex(baileysMac));
    });
  });

  describe("Snapshot MAC Generation", () => {
    it("should generate snapshot MAC identically", async () => {
      const keyData = new Uint8Array(32).fill(7);
      const baileysKeys = await mutationKeys(keyData);
      const wasmKeys = expandAppStateKeys(keyData);

      const ltHash = new Uint8Array(128);
      crypto.getRandomValues(ltHash);
      const version = 42;
      const name = "regular";

      const baileysMac = baileysGenerateSnapshotMac(
        ltHash,
        version,
        name,
        baileysKeys.snapshotMacKey
      );

      const wasmMac = generateSnapshotMac(
        ltHash,
        BigInt(version),
        name,
        wasmKeys.snapshotMacKey
      );

      expect(toHex(wasmMac)).toBe(toHex(baileysMac));
    });

    it("should generate snapshot MAC identically for different collection names", async () => {
      const keyData = new Uint8Array(32).fill(123);
      const baileysKeys = await mutationKeys(keyData);
      const wasmKeys = expandAppStateKeys(keyData);

      const ltHash = new Uint8Array(128).fill(55);
      const version = 100;

      const collectionNames = [
        "critical_block",
        "critical_unblock_low",
        "regular_high",
        "regular_low",
        "regular",
      ];

      for (const name of collectionNames) {
        const baileysMac = baileysGenerateSnapshotMac(
          ltHash,
          version,
          name,
          baileysKeys.snapshotMacKey
        );

        const wasmMac = generateSnapshotMac(
          ltHash,
          BigInt(version),
          name,
          wasmKeys.snapshotMacKey
        );

        expect(toHex(wasmMac)).toBe(toHex(baileysMac));
      }
    });
  });

  describe("Patch MAC Generation", () => {
    it("should generate patch MAC identically", async () => {
      const keyData = new Uint8Array(32).fill(7);
      const baileysKeys = await mutationKeys(keyData);
      const wasmKeys = expandAppStateKeys(keyData);

      const snapshotMac = new Uint8Array(32);
      crypto.getRandomValues(snapshotMac);

      const valueMacs = [
        new Uint8Array(32),
        new Uint8Array(32),
        new Uint8Array(32),
      ];
      valueMacs.forEach((mac) => crypto.getRandomValues(mac));

      const version = 5;
      const name = "regular_high";

      const baileysMac = baileysGeneratePatchMac(
        snapshotMac,
        valueMacs,
        version,
        name,
        baileysKeys.patchMacKey
      );

      const wasmMac = generatePatchMac(
        snapshotMac,
        valueMacs,
        BigInt(version),
        name,
        wasmKeys.patchMacKey
      );

      expect(toHex(wasmMac)).toBe(toHex(baileysMac));
    });

    it("should generate patch MAC identically with empty value MACs", async () => {
      const keyData = new Uint8Array(32).fill(99);
      const baileysKeys = await mutationKeys(keyData);
      const wasmKeys = expandAppStateKeys(keyData);

      const snapshotMac = new Uint8Array(32).fill(128);
      const version = 1;
      const name = "critical_block";

      const baileysMac = baileysGeneratePatchMac(
        snapshotMac,
        [],
        version,
        name,
        baileysKeys.patchMacKey
      );

      const wasmMac = generatePatchMac(
        snapshotMac,
        [],
        BigInt(version),
        name,
        wasmKeys.patchMacKey
      );

      expect(toHex(wasmMac)).toBe(toHex(baileysMac));
    });
  });

  describe("Index MAC Generation", () => {
    it("should generate index MAC identically", async () => {
      const keyData = new Uint8Array(32).fill(7);
      const baileysKeys = await mutationKeys(keyData);
      const wasmKeys = expandAppStateKeys(keyData);

      const indexJson = JSON.stringify(["mute", "1234567890@s.whatsapp.net"]);
      const indexBytes = Buffer.from(indexJson);

      const baileysMac = hmacSign(indexBytes, baileysKeys.indexKey);

      const wasmMac = generateIndexMac(indexBytes, wasmKeys.indexKey);

      expect(toHex(wasmMac)).toBe(toHex(baileysMac));
    });

    it("should generate index MAC identically for various index formats", async () => {
      const keyData = new Uint8Array(32).fill(42);
      const baileysKeys = await mutationKeys(keyData);
      const wasmKeys = expandAppStateKeys(keyData);

      const testIndices = [
        ["mute", "1234567890@s.whatsapp.net"],
        ["archive", "120363214048076514@g.us"],
        ["markChatAsRead", "1234567890@s.whatsapp.net"],
        ["pin_v1", "1234567890@s.whatsapp.net"],
        ["star", "1234567890@s.whatsapp.net", "MSG_ID_123", "1", "0"],
        ["deleteMessageForMe", "1234567890@s.whatsapp.net", "MSG_ID", "1", "0"],
      ];

      for (const index of testIndices) {
        const indexJson = JSON.stringify(index);
        const indexBytes = Buffer.from(indexJson);

        const baileysMac = hmacSign(indexBytes, baileysKeys.indexKey);
        const wasmMac = generateIndexMac(indexBytes, wasmKeys.indexKey);

        expect(toHex(wasmMac)).toBe(toHex(baileysMac));
      }
    });
  });

  describe("LTHashState", () => {
    it("should initialize with correct defaults", () => {
      const state = new LTHashState();

      expect(state.version).toBe(BigInt(0));
      expect(state.hash.length).toBe(128);
      expect(toHex(state.hash)).toBe("00".repeat(128));
    });

    it("should allow setting and getting version", () => {
      const state = new LTHashState();
      state.version = BigInt(42);

      expect(state.version).toBe(BigInt(42));
    });

    it("should allow setting and getting hash", () => {
      const state = new LTHashState();
      const newHash = new Uint8Array(128).fill(255);
      state.hash = newHash;

      expect(toHex(state.hash)).toBe(toHex(newHash));
    });

    it("should manage index-value map correctly", () => {
      const state = new LTHashState();
      const indexMacBase64 = Buffer.from("test-index-mac").toString("base64");
      const valueMac = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

      expect(state.hasValueMac(indexMacBase64)).toBe(false);
      expect(state.getValueMac(indexMacBase64)).toBeUndefined();

      state.setValueMac(indexMacBase64, valueMac);
      expect(state.hasValueMac(indexMacBase64)).toBe(true);
      const retrieved = state.getValueMac(indexMacBase64);
      expect(toHex(retrieved!)).toBe(toHex(valueMac));

      const deleted = state.deleteValueMac(indexMacBase64);
      expect(deleted).toBe(true);
      expect(state.hasValueMac(indexMacBase64)).toBe(false);

      const deletedAgain = state.deleteValueMac(indexMacBase64);
      expect(deletedAgain).toBe(false);
    });

    it("should clone state correctly", () => {
      const state = new LTHashState();
      state.version = BigInt(10);
      state.hash = new Uint8Array(128).fill(42);
      state.setValueMac("test-key", new Uint8Array([1, 2, 3]));

      const cloned = state.clone();

      expect(cloned.version).toBe(state.version);
      expect(toHex(cloned.hash)).toBe(toHex(state.hash));
    });
  });
});

describe("AppState Integration Tests", () => {
  it("should perform a complete mutation flow matching Baileys", async () => {
    const keyData = new Uint8Array(32).fill(7);
    const baileysKeys = await mutationKeys(keyData);
    const wasmKeys = expandAppStateKeys(keyData);

    const ltHashWasm = new LTHashAntiTampering();
    let wasmHash: Uint8Array = new Uint8Array(128).fill(0);
    let baileysHash: ArrayBuffer = new ArrayBuffer(128);

    const indexJson = JSON.stringify(["mute", "1234567890@s.whatsapp.net"]);
    const indexBytes = Buffer.from(indexJson);

    const baileysIndexMac = hmacSign(indexBytes, baileysKeys.indexKey);
    const wasmIndexMac = generateIndexMac(indexBytes, wasmKeys.indexKey);
    expect(toHex(wasmIndexMac)).toBe(toHex(baileysIndexMac));

    const encryptedValue = Buffer.from("simulated encrypted data");
    const keyId = Buffer.from("test-key-id").toString("base64");

    const baileysValueMac = baileysGenerateMac(
      1,
      encryptedValue,
      keyId,
      baileysKeys.valueMacKey
    );
    const wasmValueMac = generateContentMac(
      1,
      encryptedValue,
      Buffer.from(keyId, "base64"),
      wasmKeys.valueMacKey
    );
    expect(toHex(wasmValueMac)).toBe(toHex(baileysValueMac));

    baileysHash = await LT_HASH_ANTI_TAMPERING.subtractThenAdd(
      baileysHash,
      [new Uint8Array(baileysValueMac).buffer as ArrayBuffer],
      []
    );
    wasmHash = ltHashWasm.subtractThenAdd(wasmHash, [], [wasmValueMac]);
    expect(toHex(wasmHash)).toBe(toHex(baileysHash));

    const version = 1;
    const collectionName = "regular_high";

    const baileysSnapshotMac = baileysGenerateSnapshotMac(
      new Uint8Array(baileysHash),
      version,
      collectionName,
      baileysKeys.snapshotMacKey
    );
    const wasmSnapshotMac = generateSnapshotMac(
      wasmHash,
      BigInt(version),
      collectionName,
      wasmKeys.snapshotMacKey
    );
    expect(toHex(wasmSnapshotMac)).toBe(toHex(baileysSnapshotMac));

    const baileysPatchMac = baileysGeneratePatchMac(
      baileysSnapshotMac,
      [baileysValueMac],
      version,
      collectionName,
      baileysKeys.patchMacKey
    );
    const wasmPatchMac = generatePatchMac(
      wasmSnapshotMac,
      [wasmValueMac],
      BigInt(version),
      collectionName,
      wasmKeys.patchMacKey
    );
    expect(toHex(wasmPatchMac)).toBe(toHex(baileysPatchMac));
  });
});
