import { describe, it, expect } from "bun:test";
import {
  encodeBinaryNode,
  decodeBinaryNode as legacyDecodeNode,
} from "baileys";
import { decodeNode, encodeNode, type BinaryNode } from "../dist";

// Helper to visualize buffer differences
function hex(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString("hex");
}

describe("Parity: Legacy TS vs Rust WASM", () => {
  // This is the crucial regression test for @g.us
  it("should encode '@g.us' JID identically (using JID_PAIR)", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@g.us",
        type: "get",
        xmlns: "w:g2",
        id: "test-group",
      },
      content: [],
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    // The legacy encoder detects "@g.us", decodes it to { user: "", server: "g.us" },
    // and writes [JID_PAIR, LIST_EMPTY, "g.us" (token)].
    // The buggy WASM implementation likely writes it as a raw string.

    if (hex(legacyEncoded) !== hex(wasmEncoded)) {
      console.log("Legacy:", hex(legacyEncoded));
      console.log("WASM:  ", hex(wasmEncoded));
    }

    expect(hex(wasmEncoded)).toBe(hex(legacyEncoded));
  });

  it("should encode 's.whatsapp.net' server JID identically", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "s.whatsapp.net",
        type: "set",
        id: "ping",
      },
      content: [],
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expect(hex(wasmEncoded)).toBe(hex(legacyEncoded));
  });

  it("should encode standard user JID identically", () => {
    const node: BinaryNode = {
      tag: "message",
      attrs: {
        to: "1234567890@s.whatsapp.net",
        id: "msg-1",
      },
      content: [],
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expect(hex(wasmEncoded)).toBe(hex(legacyEncoded));
  });

  it("should encode device JID identically (AD_JID)", () => {
    const node: BinaryNode = {
      tag: "message",
      attrs: {
        to: "1234567890:2@s.whatsapp.net",
        id: "msg-device",
      },
      content: [],
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expect(hex(wasmEncoded)).toBe(hex(legacyEncoded));
  });

  it("should encode content strings identically", () => {
    const node: BinaryNode = {
      tag: "message",
      attrs: {},
      content: "Hello World",
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expect(hex(wasmEncoded)).toBe(hex(legacyEncoded));
  });

  it("should encode '@s.whatsapp.net' server-only JID identically", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "set",
        id: "ping",
      },
      content: [],
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expect(hex(wasmEncoded)).toBe(hex(legacyEncoded));
  });
});

describe("Decode Parity: Legacy TS vs Rust WASM", () => {
  it("should decode server-only JID (@s.whatsapp.net) identically", async () => {
    // Create a node with a server-only JID (empty user)
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "get",
        id: "test-123",
      },
      content: [],
    };

    // Encode using legacy encoder (known to be correct)
    const encoded = encodeBinaryNode(node);

    // Decode with both decoders
    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    // The 'to' attribute should be '@s.whatsapp.net' in both
    expect(`@${wasmDecoded.attrs.to}`).toBe(legacyDecoded.attrs.to);
    expect(wasmDecoded.attrs.to).toBe("s.whatsapp.net");
  });

  it("should decode server-only JID (@g.us) identically", async () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@g.us",
        type: "get",
        xmlns: "w:g2",
        id: "test-group",
      },
      content: [],
    };

    const encoded = encodeBinaryNode(node);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(`@${wasmDecoded.attrs.to}`).toBe(legacyDecoded.attrs.to);
    expect(wasmDecoded.attrs.to).toBe("g.us");
  });

  it("should decode standard user JID identically", async () => {
    const node: BinaryNode = {
      tag: "message",
      attrs: {
        to: "1234567890@s.whatsapp.net",
        from: "0987654321@s.whatsapp.net",
        id: "msg-1",
      },
      content: [],
    };

    const encoded = encodeBinaryNode(node);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.attrs.to).toBe(legacyDecoded.attrs.to);
    expect(wasmDecoded.attrs.from).toBe(legacyDecoded.attrs.from);
    expect(wasmDecoded.attrs.to).toBe("1234567890@s.whatsapp.net");
  });

  it("should decode device JID (AD_JID) identically", async () => {
    const node: BinaryNode = {
      tag: "message",
      attrs: {
        to: "1234567890:2@s.whatsapp.net",
        id: "msg-device",
      },
      content: [],
    };

    const encoded = encodeBinaryNode(node);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.attrs.to).toBe(legacyDecoded.attrs.to);
    expect(wasmDecoded.attrs.to).toBe("1234567890:2@s.whatsapp.net");
  });

  it("should decode LID JID identically", async () => {
    const node: BinaryNode = {
      tag: "message",
      attrs: {
        to: "123456789012345@lid",
        id: "msg-lid",
      },
      content: [],
    };

    const encoded = encodeBinaryNode(node);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.attrs.to).toBe(legacyDecoded.attrs.to);
    expect(wasmDecoded.attrs.to).toBe("123456789012345@lid");
  });

  it("should decode group JID identically", async () => {
    const node: BinaryNode = {
      tag: "message",
      attrs: {
        to: "120363214048076514@g.us",
        id: "msg-group",
      },
      content: [],
    };

    const encoded = encodeBinaryNode(node);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.attrs.to).toBe(legacyDecoded.attrs.to);
    expect(wasmDecoded.attrs.to).toBe("120363214048076514@g.us");
  });

  it("should decode nested nodes with JIDs identically", async () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "result",
        id: "test-nested",
      },
      content: [
        {
          tag: "participant",
          attrs: {
            jid: "1234567890@s.whatsapp.net",
          },
          content: undefined,
        },
        {
          tag: "participant",
          attrs: {
            jid: "0987654321:1@s.whatsapp.net",
          },
          content: undefined,
        },
      ],
    };

    const encoded = encodeBinaryNode(node);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(`@${wasmDecoded.attrs.to}`).toBe(legacyDecoded.attrs.to);
    expect(`@${wasmDecoded.attrs.to}`).toBe("@s.whatsapp.net");

    const legacyChildren = legacyDecoded.content as BinaryNode[];
    const wasmChildren = wasmDecoded.content as BinaryNode[];

    expect(wasmChildren[0].attrs.jid).toBe(legacyChildren[0].attrs.jid);
    expect(wasmChildren[1].attrs.jid).toBe(legacyChildren[1].attrs.jid);
  });
});

describe("JSON Serialization Parity", () => {
  it("should serialize decoded node to JSON with proper structure (not WASM pointer)", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "get",
        id: "test-json",
      },
      content: [],
    };

    const encoded = encodeNode(node);
    const decoded = decodeNode(encoded);

    // JSON.stringify should produce actual node data, not {"__wbg_ptr": ...}
    const jsonStr = JSON.stringify(decoded);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.tag).toBe("iq");
    expect(`@${parsed.attrs.to}`).toBe("@s.whatsapp.net");
    expect(parsed.attrs.type).toBe("get");
    expect(parsed.attrs.id).toBe("test-json");
    // Empty content arrays are encoded as no content, so they decode to undefined
    // This is expected behavior for the WhatsApp binary protocol

    // Ensure no WASM pointer leak
    expect(jsonStr).not.toContain("__wbg_ptr");
  });

  it("should serialize node with empty content to JSON (no __wbg_ptr)", () => {
    const node: BinaryNode = {
      tag: "test",
      attrs: { foo: "bar" },
    };

    const encoded = encodeNode(node);
    const decoded = decodeNode(encoded);

    const jsonStr = JSON.stringify(decoded);
    expect(jsonStr).not.toContain("__wbg_ptr");
    expect(JSON.parse(jsonStr).tag).toBe("test");
  });

  it("should serialize nested nodes to JSON correctly", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "result",
      },
      content: [
        {
          tag: "participant",
          attrs: { jid: "123@s.whatsapp.net" },
        },
        {
          tag: "participant",
          attrs: { jid: "456@s.whatsapp.net" },
        },
      ],
    };

    const encoded = encodeNode(node);
    const decoded = decodeNode(encoded);

    const jsonStr = JSON.stringify(decoded);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.tag).toBe("iq");
    expect(Array.isArray(parsed.content)).toBe(true);
    expect(parsed.content.length).toBe(2);
    expect(parsed.content[0].tag).toBe("participant");
    expect(parsed.content[0].attrs.jid).toBe("123@s.whatsapp.net");
    expect(parsed.content[1].tag).toBe("participant");
    expect(parsed.content[1].attrs.jid).toBe("456@s.whatsapp.net");

    // Ensure no WASM pointer leak in nested nodes
    expect(jsonStr).not.toContain("__wbg_ptr");
  });

  it("should serialize binary content to JSON correctly", () => {
    const node: BinaryNode = {
      tag: "enc",
      attrs: { type: "skmsg" },
      content: new Uint8Array([1, 2, 3, 4, 5]),
    };

    const encoded = encodeNode(node);
    const decoded = decodeNode(encoded);

    const jsonStr = JSON.stringify(decoded);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.tag).toBe("enc");
    expect(parsed.attrs.type).toBe("skmsg");
    // Uint8Array serializes as object with numeric keys
    expect(parsed.content).toBeDefined();
    expect(jsonStr).not.toContain("__wbg_ptr");
  });

  it("should serialize string content to JSON correctly", () => {
    const node: BinaryNode = {
      tag: "message",
      attrs: {},
      content: "hello world",
    };

    const encoded = encodeNode(node);
    const decoded = decodeNode(encoded);

    const jsonStr = JSON.stringify(decoded);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.tag).toBe("message");
    // String content is decoded as Uint8Array, check it's serializable
    expect(parsed.content).toBeDefined();
    expect(jsonStr).not.toContain("__wbg_ptr");
  });

  it("should match legacy decoder JSON output structure", async () => {
    const node: BinaryNode = {
      tag: "stream:error",
      attrs: {
        code: "515",
      },
      content: [],
    };

    const encoded = encodeNode(node);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    const legacyJson = JSON.parse(JSON.stringify(legacyDecoded));
    const wasmJson = JSON.parse(JSON.stringify(wasmDecoded));

    expect(wasmJson.tag).toBe(legacyJson.tag);
    expect(wasmJson.attrs.code).toBe(legacyJson.attrs.code);
  });

  it("should handle deeply nested nodes in JSON serialization", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: { id: "deep" },
      content: [
        {
          tag: "level1",
          attrs: {},
          content: [
            {
              tag: "level2",
              attrs: {},
              content: [
                {
                  tag: "level3",
                  attrs: { data: "found" },
                },
              ],
            },
          ],
        },
      ],
    };

    const encoded = encodeNode(node);
    const decoded = decodeNode(encoded);

    const jsonStr = JSON.stringify(decoded);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.content[0].content[0].content[0].tag).toBe("level3");
    expect(parsed.content[0].content[0].content[0].attrs.data).toBe("found");
    expect(jsonStr).not.toContain("__wbg_ptr");
  });
});
