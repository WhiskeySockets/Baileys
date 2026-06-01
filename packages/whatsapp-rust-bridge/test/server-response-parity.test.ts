import { describe, it, expect } from "bun:test";
import {
  encodeBinaryNode,
  decodeBinaryNode as legacyDecodeNode,
} from "baileys";
import { decodeNode, encodeNode, type BinaryNode } from "../dist";

function hex(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString("hex");
}

describe("Server Response Decoding Parity", () => {
  it("should decode pair-device IQ response identically", async () => {
    const serverResponse: BinaryNode = {
      tag: "iq",
      attrs: {
        from: "@s.whatsapp.net",
        type: "set",
        id: "257131597",
        xmlns: "md",
      },
      content: [
        {
          tag: "pair-device",
          attrs: {},
          content: [
            {
              tag: "ref",
              attrs: {},
              content: Buffer.from(
                "32407578644530336d524e4258696b794b6c54764d314864642f42546e33676a7653534a4f364d6d4231742b6c5878454d2f30506259594e6e736a33552b4d65746b7330585a5a70684647322b566867684c6a78547231587978724a6758376f52594f64493d",
                "hex"
              ),
            },
          ],
        },
      ],
    };

    const encoded = encodeBinaryNode(serverResponse);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.tag).toBe(legacyDecoded.tag);
    expect(`@${wasmDecoded.attrs.from}`).toBe(legacyDecoded.attrs.from);
    expect(wasmDecoded.attrs.type).toBe(legacyDecoded.attrs.type);
    expect(wasmDecoded.attrs.id).toBe(legacyDecoded.attrs.id);
    expect(wasmDecoded.attrs.xmlns).toBe(legacyDecoded.attrs.xmlns);
  });

  it("should decode pair-success IQ response identically", async () => {
    const serverResponse: BinaryNode = {
      tag: "iq",
      attrs: {
        from: "@s.whatsapp.net",
        type: "set",
        id: "2204545668",
        xmlns: "md",
      },
      content: [
        {
          tag: "pair-success",
          attrs: {},
          content: [
            {
              tag: "client-props",
              attrs: {},
              content: Buffer.from("10001801", "hex"),
            },
            {
              tag: "platform",
              attrs: { name: "android" },
            },
            {
              tag: "device-identity",
              attrs: {},
              content: Buffer.from(
                "0a780a1208b3a09fd90610c3dac3c9061813200028001220b5038b32fed4ff0040837355b57c8e14fe5917da8da896cbacc7fdaa7c3280261a40948f75608bebd276fb7386cb0899f9a2ce8b92c5206793ea6c22c6c714b28a99ca8078e8f9aea82f6f1540ea7fff4e31f52a984166dd3653e2ef1bd1e48ceb0b12208941f205d0f3f0ee71c4af53fff2c78fd22434965b2bd72f42916a22ef2059a71800",
                "hex"
              ),
            },
            {
              tag: "device",
              attrs: {
                jid: "559984726662:77@s.whatsapp.net",
                lid: "236395184570386:77@lid",
              },
            },
          ],
        },
      ],
    };

    const encoded = encodeBinaryNode(serverResponse);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.tag).toBe(legacyDecoded.tag);
    expect(`@${wasmDecoded.attrs.from}`).toBe(legacyDecoded.attrs.from);

    const legacyContent = legacyDecoded.content as BinaryNode[];
    const wasmContent = wasmDecoded.content as BinaryNode[];

    expect(wasmContent[0].tag).toBe(legacyContent[0].tag);

    const legacyPairSuccess = legacyContent[0].content as BinaryNode[];
    const wasmPairSuccess = wasmContent[0].content as BinaryNode[];

    const legacyDevice = legacyPairSuccess.find((n) => n.tag === "device");
    const wasmDevice = wasmPairSuccess.find((n) => n.tag === "device");

    expect(wasmDevice?.attrs.jid).toBe(legacyDevice?.attrs.jid);
    expect(wasmDevice?.attrs.lid).toBe(legacyDevice?.attrs.lid);
  });

  it("should decode success response with lid attribute identically", async () => {
    const serverResponse: BinaryNode = {
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

    const encoded = encodeBinaryNode(serverResponse);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.tag).toBe(legacyDecoded.tag);
    expect(wasmDecoded.attrs.lid).toBe(legacyDecoded.attrs.lid);
    expect(wasmDecoded.attrs.t).toBe(legacyDecoded.attrs.t);
  });

  it("should decode ib with edge_routing identically", async () => {
    const serverResponse: BinaryNode = {
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

    const encoded = encodeBinaryNode(serverResponse);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.tag).toBe(legacyDecoded.tag);
    expect(`@${wasmDecoded.attrs.from}`).toBe(legacyDecoded.attrs.from);

    const legacyContent = legacyDecoded.content as BinaryNode[];
    const wasmContent = wasmDecoded.content as BinaryNode[];

    expect(wasmContent[0].tag).toBe(legacyContent[0].tag);
  });

  it("should decode account_sync notification identically", async () => {
    const serverResponse: BinaryNode = {
      tag: "notification",
      attrs: {
        from: "559984726662@s.whatsapp.net",
        type: "account_sync",
        id: "894267318",
        t: "1764814151",
      },
      content: [
        {
          tag: "devices",
          attrs: {
            dhash: "2:YylS+IM3",
          },
          content: [
            {
              tag: "device",
              attrs: {
                jid: "559984726662@s.whatsapp.net",
              },
            },
            {
              tag: "device",
              attrs: {
                jid: "559984726662:59@s.whatsapp.net",
                "key-index": "1",
              },
            },
            {
              tag: "device",
              attrs: {
                jid: "559984726662:77@s.whatsapp.net",
                "key-index": "19",
              },
            },
          ],
        },
      ],
    };

    const encoded = encodeBinaryNode(serverResponse);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.tag).toBe(legacyDecoded.tag);
    expect(wasmDecoded.attrs.from).toBe(legacyDecoded.attrs.from);
    expect(wasmDecoded.attrs.type).toBe(legacyDecoded.attrs.type);

    const legacyContent = legacyDecoded.content as BinaryNode[];
    const wasmContent = wasmDecoded.content as BinaryNode[];

    expect(wasmContent[0].tag).toBe(legacyContent[0].tag);

    const legacyDevices = legacyContent[0].content as BinaryNode[];
    const wasmDevices = wasmContent[0].content as BinaryNode[];

    for (let i = 0; i < legacyDevices.length; i++) {
      expect(wasmDevices[i]?.attrs.jid).toBe(legacyDevices[i]?.attrs.jid);
    }
  });

  it("should decode server_sync notification identically", async () => {
    const serverResponse: BinaryNode = {
      tag: "notification",
      attrs: {
        from: "@s.whatsapp.net",
        type: "server_sync",
        id: "92405240",
        t: "1764814152",
      },
      content: [
        {
          tag: "collection",
          attrs: {
            name: "regular_low",
            version: "66",
          },
        },
      ],
    };

    const encoded = encodeBinaryNode(serverResponse);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.tag).toBe(legacyDecoded.tag);
    expect(`@${wasmDecoded.attrs.from}`).toBe(legacyDecoded.attrs.from);
    expect(wasmDecoded.attrs.type).toBe(legacyDecoded.attrs.type);

    const legacyContent = legacyDecoded.content as BinaryNode[];
    const wasmContent = wasmDecoded.content as BinaryNode[];

    expect(wasmContent[0].attrs.name).toBe(legacyContent[0].attrs.name);
    expect(wasmContent[0].attrs.version).toBe(legacyContent[0].attrs.version);
  });

  it("should decode offline ib identically", async () => {
    const serverResponse: BinaryNode = {
      tag: "ib",
      attrs: {
        from: "@s.whatsapp.net",
      },
      content: [
        {
          tag: "offline",
          attrs: {
            count: "0",
          },
        },
      ],
    };

    const encoded = encodeBinaryNode(serverResponse);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.tag).toBe(legacyDecoded.tag);

    const legacyContent = legacyDecoded.content as BinaryNode[];
    const wasmContent = wasmDecoded.content as BinaryNode[];

    expect(wasmContent[0].tag).toBe(legacyContent[0].tag);
    expect(wasmContent[0].attrs.count).toBe(legacyContent[0].attrs.count);
  });

  it("should decode encrypted message identically - BROKEN: HEX_8 SIMD bug", async () => {
    const serverResponse: BinaryNode = {
      tag: "message",
      attrs: {
        from: "559984726662@s.whatsapp.net",
        type: "text",
        id: "A14AFA49C4D9AEDA69F01ADDF2289D71",
        category: "peer",
        t: "1764814152",
      },
      content: [
        {
          tag: "meta",
          attrs: {
            appdata: "default",
          },
        },
        {
          tag: "enc",
          attrs: {
            v: "2",
            type: "pkmsg",
          },
          content: Buffer.from(
            "33122105e61413ed86dae878cd6fbd799d58613dc565cd8637312c3eaa2aa0bdd088b470",
            "hex"
          ),
        },
      ],
    };

    const encoded = encodeBinaryNode(serverResponse);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.tag).toBe(legacyDecoded.tag);
    expect(wasmDecoded.attrs.from).toBe(legacyDecoded.attrs.from);
    expect(wasmDecoded.attrs.type).toBe(legacyDecoded.attrs.type);
    expect(wasmDecoded.attrs.id).toBe(legacyDecoded.attrs.id);

    const legacyContent = legacyDecoded.content as BinaryNode[];
    const wasmContent = wasmDecoded.content as BinaryNode[];

    const legacyEnc = legacyContent.find((n) => n.tag === "enc");
    const wasmEnc = wasmContent.find((n) => n.tag === "enc");

    expect(wasmEnc?.attrs.v).toBe(legacyEnc?.attrs.v);
    expect(wasmEnc?.attrs.type).toBe(legacyEnc?.attrs.type);
  });

  it("should demonstrate HEX_8 SIMD decoding bug", async () => {
    const node: BinaryNode = {
      tag: "test",
      attrs: {
        id: "A14AFA49C4D9AEDA69F01ADDF2289D71",
      },
    };

    const encoded = encodeBinaryNode(node);
    const wasmDecoded = decodeNode(new Uint8Array(encoded));
    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));

    console.log("Original ID:", node.attrs.id);
    console.log("Legacy decoded ID:", legacyDecoded.attrs.id);
    console.log("WASM decoded ID:", wasmDecoded.attrs.id);

    expect(wasmDecoded.attrs.id).toBe(legacyDecoded.attrs.id);
    expect(wasmDecoded.attrs.id).toBe("A14AFA49C4D9AEDA69F01ADDF2289D71");
    expect(legacyDecoded.attrs.id).toBe("A14AFA49C4D9AEDA69F01ADDF2289D71");
  });

  it("should decode group message from g.us identically", async () => {
    const serverResponse: BinaryNode = {
      tag: "message",
      attrs: {
        from: "120363214048076514@g.us",
        type: "text",
        id: "3EB0D58F1B09A9D7F9A123",
        participant: "559984726662@s.whatsapp.net",
        t: "1764814200",
      },
      content: [
        {
          tag: "enc",
          attrs: {
            v: "2",
            type: "skmsg",
          },
          content: Buffer.from("abcd1234", "hex"),
        },
      ],
    };

    const encoded = encodeBinaryNode(serverResponse);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.tag).toBe(legacyDecoded.tag);
    expect(wasmDecoded.attrs.from).toBe(legacyDecoded.attrs.from);
    expect(wasmDecoded.attrs.from).toBe("120363214048076514@g.us");
    expect(wasmDecoded.attrs.participant).toBe(legacyDecoded.attrs.participant);
    expect(wasmDecoded.attrs.participant).toBe("559984726662@s.whatsapp.net");
  });

  it("should decode receipt with retry type identically", async () => {
    const serverResponse: BinaryNode = {
      tag: "receipt",
      attrs: {
        from: "559984726662@s.whatsapp.net",
        id: "3EB0D58F1B09A9D7F9A123",
        type: "retry",
        t: "1764814300",
      },
      content: [
        {
          tag: "retry",
          attrs: {
            count: "1",
            v: "1",
            id: "3EB0D58F1B09A9D7F9A123",
            t: "1764814250",
          },
          content: [
            {
              tag: "registration",
              attrs: {},
              content: Buffer.from("000000fe", "hex"),
            },
          ],
        },
      ],
    };

    const encoded = encodeBinaryNode(serverResponse);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.tag).toBe(legacyDecoded.tag);
    expect(wasmDecoded.attrs.from).toBe(legacyDecoded.attrs.from);
    expect(wasmDecoded.attrs.type).toBe(legacyDecoded.attrs.type);
    expect(wasmDecoded.attrs.type).toBe("retry");

    const legacyContent = legacyDecoded.content as BinaryNode[];
    const wasmContent = wasmDecoded.content as BinaryNode[];

    expect(wasmContent[0].tag).toBe(legacyContent[0].tag);
    expect(wasmContent[0].attrs.count).toBe(legacyContent[0].attrs.count);
  });
});

describe("History Sync Message Decoding", () => {
  it("should decode history sync notification identically", async () => {
    const serverResponse: BinaryNode = {
      tag: "notification",
      attrs: {
        from: "559984726662@s.whatsapp.net",
        type: "mediaretry",
        id: "test-history-123",
        t: "1764814400",
      },
      content: [
        {
          tag: "enc",
          attrs: {
            v: "2",
            type: "pkmsg",
          },
          content: Buffer.from("0a120815", "hex"),
        },
      ],
    };

    const encoded = encodeBinaryNode(serverResponse);

    const legacyDecoded = await legacyDecodeNode(Buffer.from(encoded));
    const wasmDecoded = decodeNode(new Uint8Array(encoded));

    expect(wasmDecoded.tag).toBe(legacyDecoded.tag);
    expect(wasmDecoded.attrs.type).toBe(legacyDecoded.attrs.type);
  });
});
