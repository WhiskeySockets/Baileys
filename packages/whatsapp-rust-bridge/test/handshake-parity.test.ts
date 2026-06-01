import { describe, it, expect } from "bun:test";
import { encodeBinaryNode } from "baileys";
import { encodeNode, decodeNode, type BinaryNode } from "../dist";

function hex(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString("hex");
}

function expectByteIdentical(
  wasmEncoded: Uint8Array,
  legacyEncoded: Uint8Array,
  description: string
) {
  const wasmHex = hex(wasmEncoded);
  const legacyHex = hex(legacyEncoded);

  if (wasmHex !== legacyHex) {
    console.log(`\n${description}:`);
    console.log("Legacy:", legacyHex);
    console.log("WASM:  ", wasmHex);
    console.log(
      "Length - Legacy:",
      legacyEncoded.length,
      "WASM:",
      wasmEncoded.length
    );

    for (
      let i = 0;
      i < Math.max(wasmEncoded.length, legacyEncoded.length);
      i++
    ) {
      if (wasmEncoded[i] !== legacyEncoded[i]) {
        console.log(
          `First diff at byte ${i}: Legacy=0x${
            legacyEncoded[i]?.toString(16) ?? "undefined"
          } WASM=0x${wasmEncoded[i]?.toString(16) ?? "undefined"}`
        );
        break;
      }
    }
  }

  expect(wasmHex).toBe(legacyHex);
}

describe("Handshake IQ Message Parity", () => {
  it("should encode pair-device IQ result identically", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "result",
        id: "257131597",
      },
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "pair-device IQ result");
  });

  it("should encode encrypt count IQ get identically", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        id: "3661.63898-1",
        xmlns: "encrypt",
        type: "get",
        to: "@s.whatsapp.net",
      },
      content: [
        {
          tag: "count",
          attrs: {},
        },
      ],
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "encrypt count IQ get");
  });

  it("should encode encrypt prekey IQ set identically", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        xmlns: "encrypt",
        type: "set",
        to: "@s.whatsapp.net",
        id: "test-prekey-1",
      },
      content: [
        {
          tag: "registration",
          attrs: {},
          content: Buffer.from("000000fe", "hex"),
        },
        {
          tag: "type",
          attrs: {},
          content: Buffer.from("05", "hex"),
        },
        {
          tag: "identity",
          attrs: {},
          content: Buffer.from(
            "57ef843ce768b28d8c0f046eaad7c973b856875a10ff07f13a92dcbc51d8a358",
            "hex"
          ),
        },
        {
          tag: "list",
          attrs: {},
          content: [
            {
              tag: "key",
              attrs: {},
              content: [
                {
                  tag: "id",
                  attrs: {},
                  content: Buffer.from("000001", "hex"),
                },
                {
                  tag: "value",
                  attrs: {},
                  content: Buffer.from(
                    "e749c2bef53b90f37cd8d8655cd4df73b0924bdad5a2ea506412a1c72eb2e504",
                    "hex"
                  ),
                },
              ],
            },
          ],
        },
      ],
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "encrypt prekey IQ set");
  });

  it("should encode pair-device-sign IQ result identically", () => {
    const deviceIdentityContent = Buffer.from(
      "0a1208b3a09fd90610c3dac3c9061813200028001a40948f75608bebd276fb7386cb0899f9a2ce8b92c5206793ea6c22c6c714b28a99ca8078e8f9aea82f6f1540ea7fff4e31f52a984166dd3653e2ef1bd1e48ceb0b2240e7744730d44293a994df0405aaaad9f32fb44b52d6225565b7d7c1fe691a639759655f1d32b2208fb6e38ba0acc7fa9087ca3d4d84da3c10a0c2c16d51c63103",
      "hex"
    );

    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "result",
        id: "2204545668",
      },
      content: [
        {
          tag: "pair-device-sign",
          attrs: {},
          content: [
            {
              tag: "device-identity",
              attrs: {
                "key-index": "19",
              },
              content: deviceIdentityContent,
            },
          ],
        },
      ],
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(
      wasmEncoded,
      legacyEncoded,
      "pair-device-sign IQ result"
    );
  });

  it("should encode IQ with numeric ID identically (nibble encoding)", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "result",
        id: "1422037390",
      },
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "IQ with numeric ID");
  });

  it("should encode IQ with dotted ID identically (nibble encoding)", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "get",
        id: "21290.10000-1",
      },
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "IQ with dotted ID");
  });

  it("should encode hex content identically (hex encoding)", () => {
    const node: BinaryNode = {
      tag: "routing_info",
      attrs: {},
      content: Buffer.from("08020812080d", "hex"),
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "hex content");
  });

  it("should encode ib with edge_routing identically", () => {
    const node: BinaryNode = {
      tag: "ib",
      attrs: {
        from: "@s.whatsapp.net",
      },
      content: [
        {
          tag: "edge_routing",
          attrs: {},
          content: [
            {
              tag: "routing_info",
              attrs: {},
              content: Buffer.from("08020812080d", "hex"),
            },
          ],
        },
      ],
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "ib with edge_routing");
  });

  it("should encode ib with dirty sync identically", () => {
    const node: BinaryNode = {
      tag: "ib",
      attrs: {
        from: "@s.whatsapp.net",
      },
      content: [
        {
          tag: "dirty",
          attrs: {
            type: "account_sync",
            timestamp: "1764814151",
          },
        },
      ],
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "ib with dirty sync");
  });

  it("should encode stream:error identically", () => {
    const node: BinaryNode = {
      tag: "stream:error",
      attrs: {
        code: "515",
      },
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "stream:error");
  });
});

describe("Device JID Encoding Parity", () => {
  it("should encode device JID with colon format identically", () => {
    const node: BinaryNode = {
      tag: "device",
      attrs: {
        jid: "559984726662:77@s.whatsapp.net",
      },
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "device JID with colon");
  });

  it("should encode LID device JID identically", () => {
    const node: BinaryNode = {
      tag: "device",
      attrs: {
        jid: "236395184570386:77@lid",
        lid: "236395184570386:77@lid",
      },
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "LID device JID");
  });

  it("should encode server-only JID @s.whatsapp.net identically", () => {
    const node: BinaryNode = {
      tag: "success",
      attrs: {
        t: "1764814151",
        props: "27",
        location: "lla",
        lid: "236395184570386:77@lid",
        abprops: "10",
        creation: "1764814148",
        companion_enc_static: "j71eT4dJOdeK5yTYyRPVnE9zGGtAV2KVZwU3qO1FCqc=",
      },
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(wasmEncoded, legacyEncoded, "success with LID");
  });
});

describe("Round-trip Parity (Encode→Decode→Encode)", () => {
  it("should round-trip pair-device IQ result", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "result",
        id: "257131597",
      },
    };

    const encoded1 = encodeNode(node);
    const decoded = decodeNode(encoded1);
    const encoded2 = encodeNode(decoded);

    expect(hex(encoded2)).toBe("00f807191103041408ff85257131597f");
  });

  it("should round-trip complex IQ with nested content", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        xmlns: "encrypt",
        type: "set",
        to: "@s.whatsapp.net",
        id: "test-roundtrip",
      },
      content: [
        {
          tag: "registration",
          attrs: {},
          content: Buffer.from("000000fe", "hex"),
        },
        {
          tag: "identity",
          attrs: {},
          content: Buffer.from("abcd1234", "hex"),
        },
      ],
    };

    const encoded1 = encodeNode(node);
    const decoded = decodeNode(encoded1);
    const encoded2 = encodeNode(decoded);

    expect(hex(encoded2)).toBe(
      `00f80a1916cb045a110308fc0e746573742d726f756e6474726970f802f802adfc04000000fef8029cfc04abcd1234`
    );
  });
});

describe("Attribute Order Sensitivity", () => {
  it("should encode with same attribute order identically (WASM matches Legacy)", () => {
    const node: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "result",
        id: "test123",
        xmlns: "encrypt",
      },
    };

    const legacyEncoded = encodeBinaryNode(node);
    const wasmEncoded = encodeNode(node);

    expectByteIdentical(
      wasmEncoded,
      legacyEncoded,
      "attribute order preservation"
    );
  });

  it("should preserve attribute order (different order = different bytes)", () => {
    const node1: BinaryNode = {
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "result",
      },
    };

    const node2: BinaryNode = {
      tag: "iq",
      attrs: {
        type: "result",
        to: "@s.whatsapp.net",
      },
    };

    const legacy1 = encodeBinaryNode(node1);
    const legacy2 = encodeBinaryNode(node2);

    expect(hex(legacy1)).not.toBe(hex(legacy2));
  });
});
